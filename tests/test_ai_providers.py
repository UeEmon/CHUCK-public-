"""No live or billable calls: provider adapters, secrets and settings use fixtures."""
import copy
import http.client
import json
import os
from pathlib import Path
import sys
import tempfile
import threading
import unittest
from unittest.mock import patch, MagicMock
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'))
import ai_providers as ai
import antenna_ocr as ocr
from engine import InputError
from test_antenna_ocr import extraction, upload

class AIProviderTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.settings=ai.AISettings(Path(self.tmp.name)/'settings.json')
        self.patch=patch.object(ai,'SETTINGS',self.settings);self.patch.start()
        self.env=patch.dict(os.environ,{'OPENAI_API_KEY':'openai-fixture-key','HF_ANTENNA_OCR_MODEL':'openai-test','ANTHROPIC_API_KEY':'claude-fixture-key','ANTHROPIC_MODEL':'claude-test','GEMINI_API_KEY':'gemini-fixture-key','GEMINI_MODEL':'gemini-test','HF_ANTENNA_OCR_PROVIDER':'openai','LOCAL_LLM_MODEL':'local-vision-test','LOCAL_LLM_BASE_URL':'http://127.0.0.1:11434','LOCAL_LLM_PROTOCOL':'ollama','LOCAL_LLM_API_KEY':''});self.env.start()
    def tearDown(self):self.env.stop();self.patch.stop();self.tmp.cleanup()
    def save(self,**kw):return self.settings.save(dict(revision=self.settings.snapshot()['revision'],**kw))
    def test_environment_saved_priority_permissions_and_no_secret_readback(self):
        snapshot=self.settings.snapshot();self.assertNotIn('fixture-key',json.dumps(snapshot))
        self.assertEqual(self.settings.resolve('claude')['api_key'],'claude-fixture-key')
        self.assertEqual(self.settings.resolve('local')['api_key'],'')
        old=snapshot['revision'];self.save(provider='claude',model='chosen-vision',api_key='saved-claude-secret')
        self.assertEqual(self.settings.resolve()['api_key'],'saved-claude-secret')
        self.assertEqual(self.settings.path.stat().st_mode&0o777,0o600)
        self.assertNotIn('saved-claude-secret',json.dumps(self.settings.snapshot()))
        with self.assertRaises(ai.SettingsConflict):self.settings.save(dict(revision=old,provider='openai'))
        self.save(provider='claude',clear_api_key=True)
        self.assertEqual(self.settings.resolve()['api_key'],'claude-fixture-key')
        self.assertEqual(self.settings.resolve()['credential_source'],'environment')
        self.assertEqual(self.settings.resolve('openai')['api_key'],'openai-fixture-key')
        self.assertEqual(ai.AISettings(self.settings.path).snapshot()['provider'],'claude')
    def test_validation_and_local_no_cloud_key_fallback(self):
        for body in [dict(provider='unknown'),dict(provider='local',endpoint='file:///tmp/a'),dict(provider='local',endpoint='http://u:p@host'),dict(provider='local',endpoint='http://host/?key=x'),dict(provider='local',protocol='bad'),dict(provider='openai',api_key='bad\nkey'),dict(provider='openai',model='bad model')]:
            with self.assertRaises(InputError):self.save(**body)
        cfg=self.settings.resolve('local');self.assertTrue(cfg['configured']);self.assertEqual(cfg['api_key'],'')
        with self.assertRaises(InputError):ai.extract_json(cfg,'x.pdf','application/pdf',b'PDF',ocr.PROMPT,ocr.schema())
        self.save(provider='local',model='local-vl')
        self.assertNotIn('application/pdf',ocr.config()['media_types'])
    def test_models_pagination_and_generation_filter(self):
        results=[dict(data=[dict(id='a',display_name='A')],has_more=True,last_id='a'),dict(data=[dict(id='b')],has_more=False)]
        with patch.object(ai,'request_json',side_effect=results) as request:
            self.assertEqual([m['id'] for m in ai.list_models(self.settings.resolve('claude'))['models']],['a','b'])
            self.assertIn('after_id=a',request.call_args.args[1])
        with patch.object(ai,'request_json',return_value=dict(models=[dict(name='models/gemini-vl',supportedGenerationMethods=['generateContent']),dict(name='models/embed',supportedGenerationMethods=['embedContent'])])):
            self.assertEqual(ai.list_models(self.settings.resolve('gemini'))['models'][0]['id'],'gemini-vl')
        for protocol,result,path in [('ollama',dict(models=[dict(name='local-vl')]),'/api/tags'),('openai',dict(data=[dict(id='local-vl')]),'/models')]:
            cfg=self.settings.resolve('local',dict(protocol=protocol))
            with patch.object(ai,'request_json',return_value=result) as request:
                self.assertEqual(ai.list_models(cfg)['models'][0]['id'],'local-vl');self.assertTrue(request.call_args.args[1].endswith(path))
    def test_ocr_payload_and_response_for_all_providers(self):
        fixtures={
         'openai':dict(status='completed',output=[dict(type='message',content=[dict(type='output_text',text=json.dumps(extraction()))])]),
         'claude':dict(stop_reason='end_turn',content=[dict(type='text',text=json.dumps(extraction()))]),
         'gemini':dict(candidates=[dict(finishReason='STOP',content=dict(parts=[dict(text=json.dumps(extraction()))]))]),
         'local':dict(done=True,done_reason='stop',message=dict(content=json.dumps(extraction()))) }
        for provider,response in fixtures.items():
            cfg=self.settings.resolve(provider)
            with patch.object(ai,'request_json',return_value=response) as request:
                self.assertEqual(ocr.extract('x.png','image/png',b'fixture',cfg)['candidates'][0]['physical_length_m'],10)
                payload=request.call_args.args[2];self.assertEqual(payload['model'] if provider!='gemini' else cfg['model'],cfg['model']);self.assertNotIn('tools',payload)
                if provider=='claude':self.assertEqual(payload['messages'][0]['content'][0]['type'],'image');self.assertIn('output_config',payload)
                if provider=='gemini':self.assertEqual(payload['contents'][0]['parts'][1]['inlineData']['mimeType'],'image/png')
            if provider in ('claude','gemini'):
                with patch.object(ai,'request_json',return_value=response) as request:
                    ocr.extract('x.pdf','application/pdf',b'fixture',cfg)
                    payload=request.call_args.args[2]
                    if provider=='claude':self.assertEqual(payload['messages'][0]['content'][0]['type'],'document')
                    else:self.assertEqual(payload['contents'][0]['parts'][1]['inlineData']['mimeType'],'application/pdf')
        cfg=self.settings.resolve('local',dict(protocol='openai'))
        with patch.object(ai,'request_json',return_value=dict(choices=[dict(finish_reason='stop',message=dict(content=json.dumps(extraction())))])):
            self.assertEqual(ocr.extract('x.png','image/png',b'fixture',cfg)['candidates'][0]['physical_length_m'],10)
        with patch.object(ai,'request_json',return_value=dict(stop_reason='max_tokens',content=[])):
            with self.assertRaises(ocr.OCRError):ocr.extract('x.png','image/png',b'fixture',self.settings.resolve('claude'))
    def test_http_headers_are_provider_specific_and_redirects_disabled(self):
        response=MagicMock();response.__enter__.return_value.read.return_value=b'{}';opener=MagicMock();opener.open.return_value=response
        for provider in ai.PROVIDERS:
            cfg=self.settings.resolve(provider)
            with patch.object(ai,'build_opener',return_value=opener) as build:
                ai.request_json(cfg,'http://127.0.0.1/fixture',{})
                req=opener.open.call_args.args[0];headers={k.lower():v for k,v in req.header_items()}
                if provider=='claude':self.assertEqual(headers['x-api-key'],'claude-fixture-key');self.assertNotIn('authorization',headers)
                elif provider=='gemini':self.assertEqual(headers['x-goog-api-key'],'gemini-fixture-key');self.assertNotIn('authorization',headers)
                elif provider=='local':self.assertNotIn('authorization',headers)
                else:self.assertEqual(headers['authorization'],'Bearer openai-fixture-key')
                self.assertTrue(any(isinstance(h,ai.NoRedirect) for h in build.call_args.args))
    def test_settings_http_origin_and_secret_handling(self):
        import server
        from http.server import ThreadingHTTPServer
        listener=ThreadingHTTPServer(('127.0.0.1',0),server.Handler);thread=threading.Thread(target=listener.serve_forever,daemon=True);thread.start()
        origin=f'http://127.0.0.1:{listener.server_port}'
        def call(data=None,origin_header=None):
            c=http.client.HTTPConnection('127.0.0.1',listener.server_port);headers={'Content-Type':'application/json'}
            if origin_header:headers['Origin']=origin_header
            c.request('GET' if data is None else 'POST','/api/ai-settings',None if data is None else json.dumps(data),headers)
            response=c.getresponse();body=response.read();status=response.status;c.close();return status,body
        try:
            self.assertNotIn(b'fixture-key',call()[1]);body=dict(provider='claude',revision=0,model='new-vl',api_key='ui-secret-key')
            self.assertEqual(call(body)[0],403);code,result=call(body,origin);self.assertEqual(code,200);self.assertNotIn(b'ui-secret-key',result)
            self.assertEqual(self.settings.resolve()['api_key'],'ui-secret-key')
            self.assertEqual(call(body,origin)[0],409)
        finally:listener.shutdown();listener.server_close();thread.join()

if __name__=='__main__':unittest.main()
