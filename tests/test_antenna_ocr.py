"""Vision OCR contract, strict validation, provenance and local HTTP integration."""
import base64
import copy
import http.client
import json
import os
from pathlib import Path
import sqlite3
import sys
import tempfile
import threading
import unittest
from unittest.mock import patch, MagicMock
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'))
import antenna_ocr as ocr
import ai_providers
from engine import InputError
from presets import PresetStore

def extraction():
    row={k:None for k in ocr.FIELDS}
    row.update(name='Test 10 m whip',physical_length_m=10,electrical_length_m=7.5,
               evidence=[dict(field='name',page=1,quote='Test 10 m whip'),dict(field='physical_length_m',page=2,quote='Height 10 m'),dict(field='electrical_length_m',page=2,quote='Electrical length 7.5 m')])
    return dict(candidates=[row],warnings=[])

def upload(mime='application/pdf',raw=b'%PDF-1.4\nfixture'):
    return dict(filename='catalog.pdf',media_type=mime,data_base64=base64.b64encode(raw).decode(),external_processing=True,source_url='https://example.org/catalog.pdf')

class OCRTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.db=Path(self.tmp.name)/'db'
        self.store=ocr.DocumentStore(lambda:sqlite3.connect(self.db))
        self.env=patch.dict(os.environ,OPENAI_API_KEY='test-not-a-real-key',HF_ANTENNA_OCR_MODEL='test-vision-model');self.env.start()
    def tearDown(self):self.env.stop();self.tmp.cleanup()
    def test_upload_validation(self):
        with patch.object(ocr,'MAX_FILE',4):
            with self.assertRaises(InputError):ocr.document(upload())
        for body in [dict(upload(),external_processing=False),dict(upload(),filename='../x.pdf'),dict(upload(),data_base64='!!!'),dict(upload(),media_type='text/html'),upload(raw=b'<script>'),dict(upload(),source_url='javascript:alert(1)'),dict(upload(),source_url='https://u:p@example.org')]:
            with self.assertRaises(InputError):ocr.document(body)
        for mime,raw in [('image/png',b'\x89PNG\r\n\x1a\nfixture'),('image/jpeg',b'\xff\xd8\xfffixture'),('image/webp',b'RIFF1234WEBPfixture')]:
            self.assertEqual(ocr.document(upload(mime,raw))[2],raw)
    def test_output_validation_and_missing_evidence(self):
        a=ocr.clean_extraction(extraction());self.assertEqual(a['candidates'][0]['physical_length_m'],10)
        raw=extraction();raw['candidates'][0]['gain_dbi']=5
        self.assertIsNone(ocr.clean_extraction(raw)['candidates'][0]['gain_dbi'])
        for field,value in [('physical_length_m',True),('electrical_length_m',float('nan')),('gain_dbi',float('inf')),('power_w',-1),('name','x'*161)]:
            raw=extraction();raw['candidates'][0][field]=value
            with self.assertRaises(ocr.OCRError):ocr.clean_extraction(raw)
        raw=extraction();raw['candidates'][0]['evidence'][0]['page']=0
        with self.assertRaises(ocr.OCRError):ocr.clean_extraction(raw)
        with self.assertRaises(ocr.OCRError):ocr.clean_extraction(dict(candidates=extraction()['candidates']*11,warnings=[]))
    def test_api_payload_pdf_and_image_and_failures(self):
        response=MagicMock();response.__enter__.return_value.read.return_value=json.dumps(dict(status='completed',output=[dict(type='message',content=[dict(type='output_text',text=json.dumps(extraction()))])])).encode()
        opener=MagicMock();opener.open.return_value=response
        with patch.object(ai_providers,'build_opener',return_value=opener):
            for mime in ['application/pdf','image/png']:
                self.assertEqual(ocr.extract('x.pdf',mime,b'fixture')['candidates'][0]['physical_length_m'],10)
                req=opener.open.call_args.args[0];payload=json.loads(req.data)
                self.assertFalse(payload['store']);self.assertNotIn('tools',payload)
                self.assertEqual(payload['text']['format']['type'],'json_schema')
                attachment=payload['input'][0]['content'][1]
                self.assertEqual(attachment['type'],'input_file' if mime=='application/pdf' else 'input_image')
                self.assertIn('data:'+mime+';base64,',attachment.get('file_data',attachment.get('image_url')))
                self.assertEqual(opener.open.call_args.kwargs['timeout'],120)
            response.__enter__.return_value.read.return_value=b'{"status":"incomplete"}'
            with self.assertRaises(ocr.OCRError):ocr.extract('x','application/pdf',b'fixture')
        with patch.dict(os.environ,OPENAI_API_KEY=''):
            self.assertFalse(ocr.config()['configured'])
            with self.assertRaises(ocr.OCRError):ocr.extract('x','application/pdf',b'fixture')
    def test_storage_provenance_review_and_deletion(self):
        with patch.object(ocr,'extract',return_value=extraction()):doc=self.store.import_file(upload())
        self.assertNotIn('content',doc);self.assertEqual(self.store.get(doc['id'],True)['content'],b'%PDF-1.4\nfixture')
        self.assertEqual(self.store.list()[0]['id'],doc['id'])
        presets=PresetStore(lambda:sqlite3.connect(self.db));rev=presets.snapshot()['revision']
        p=dict(name='Reviewed antenna',model='whip',gain=0,reference_only=True,document_ref=dict(id=doc['id'],candidate_index=0,reviewed=False))
        def save(preset):return presets.edit(dict(action='save',collection='antennas',revision=rev,preset=preset))
        with self.assertRaises(InputError):save(p)
        p['document_ref']['reviewed']=True
        p['reference_only']=False
        with self.assertRaises(InputError):save(p)
        p['reference_only']=True;saved=save(p)
        self.assertEqual(presets.snapshot()['antennas'][-1]['document_ref']['id'],doc['id'])
        with self.assertRaises(InputError):self.store.delete(doc['id'])
        presets.edit(dict(action='delete',collection='antennas',id=saved['id'],revision=saved['revision']))
        self.store.delete(doc['id']);self.assertEqual(self.store.list(),[])
        with self.assertRaises(InputError):self.store.get(doc['id'])
        with self.assertRaises(InputError):self.store.get('../../etc/passwd')
    def test_failures_do_not_save_and_lock_is_released(self):
        with patch.object(ocr,'extract',side_effect=ocr.OCRError('fixture failure')):
            with self.assertRaises(ocr.OCRError):self.store.import_file(upload())
        self.assertEqual(self.store.list(),[]);self.assertFalse(ocr.LOCK.locked())
        ocr.LOCK.acquire()
        try:
            with self.assertRaises(ocr.OCRBusy):self.store.import_file(upload())
        finally:ocr.LOCK.release()
    def test_http_origin_content_and_no_automatic_registration(self):
        import server
        from http.server import ThreadingHTTPServer
        with patch.object(server,'ANTENNA_DOCUMENTS',self.store),patch.object(ocr,'extract',return_value=extraction()):
            listener=ThreadingHTTPServer(('127.0.0.1',0),server.Handler);thread=threading.Thread(target=listener.serve_forever,daemon=True);thread.start()
            origin=f'http://127.0.0.1:{listener.server_port}'
            def call(path,data=None,headers=None):
                c=http.client.HTTPConnection('127.0.0.1',listener.server_port)
                c.request('GET' if data is None else 'POST',path,body=None if data is None else json.dumps(data),headers=headers or {})
                r=c.getresponse();body=r.read();result=(r.status,body,dict(r.getheaders()));c.close();return result
            try:
                good={'Origin':origin,'Content-Type':'application/json'}
                self.assertEqual(call('/api/antenna-imports',upload())[0],403)
                self.assertEqual(call('/api/antenna-imports',upload(),{'Origin':origin})[0],415)
                code,body,_=call('/api/antenna-imports',upload(),good);self.assertEqual(code,200)
                doc=json.loads(body);self.assertNotIn('test-not-a-real-key',body.decode())
                self.assertEqual(len(PresetStore(lambda:sqlite3.connect(self.db)).snapshot()['antennas']),17)
                code,body,h=call('/api/antenna-imports/'+doc['id']+'/source');self.assertEqual(code,200);self.assertIn('attachment',h['Content-Disposition'])
                self.assertEqual(call('/api/antenna-imports/'+doc['id']+'/delete',{},good)[0],200)
            finally:listener.shutdown();listener.server_close();thread.join()

if __name__=='__main__':unittest.main()
