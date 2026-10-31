import io
import json
import os
from pathlib import Path
import sys
import tempfile
import threading
import time
import unittest
from unittest.mock import patch
import urllib.error
import urllib.request

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'))
import public_data
import public_data_server
from http.server import ThreadingHTTPServer
from space_weather import ROOT, FEEDS, SpaceWeather

TOKEN='t'*40
ROWS={'observed':[{'time-tag':'2026-01','smoothed_ssn':100.1,'smoothed_f10.7':140}],
      'predicted':[{'time-tag':'2026-10','predicted_ssn':87.5,'predicted_f10.7':130}],
      'scales':{'0':{'DateStamp':'2026-10-31','TimeStamp':'00:00:00','R':{'Scale':'0'},'S':{'Scale':'0'},'G':{'Scale':'1'}}}}


def provider(request,**kwargs):
    key=next(k for k,(path,_) in FEEDS.items() if request.full_url==ROOT+path)
    return io.BytesIO(json.dumps(ROWS[key]).encode())


class FetcherTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.fetcher=public_data_server.Fetcher(self.tmp.name,public_data_server.sources(giro_enabled=False))

    def test_sources_are_fixed_and_giro_is_opt_in(self):
        self.assertEqual(set(public_data_server.sources(giro_enabled=False)),{'observed','predicted','scales','drap','nict'})
        self.assertEqual(set(public_data_server.sources(giro_enabled=True))-{'observed','predicted','scales','drap','nict'},{'GU513','JR055','MHJ45'})

    def test_scheduled_fetch_validates_and_keeps_previous_files(self):
        with patch('public_data_server.urlopen',side_effect=provider) as get:
            for key in FEEDS:self.assertIsNone(self.fetcher.fetch(key))
            self.assertEqual(get.call_count,3)
            for key in FEEDS:self.assertFalse(self.fetcher.due(key))
        raw,fetched_at=self.fetcher.latest('predicted')
        self.assertEqual(json.loads(raw),ROWS['predicted']);self.assertEqual(self.fetcher.meta('predicted')['url'],ROOT+FEEDS['predicted'][0])
        # Invalid content is not stored, the previous files stay and retries wait a minute.
        with patch('public_data_server.urlopen',return_value=io.BytesIO(b'{"wrong":1}')) as get:
            self.assertTrue(self.fetcher.fetch('predicted'))
            self.assertTrue(self.fetcher.fetch('predicted'));self.assertEqual(get.call_count,1)
        self.assertEqual(json.loads(self.fetcher.latest('predicted')[0]),ROWS['predicted'])
        # refresh_due only downloads sources whose refresh period has passed.
        meta=json.loads((Path(self.tmp.name)/'scales.json').read_text());meta['fetched_at']-=400
        (Path(self.tmp.name)/'scales.json').write_text(json.dumps(meta))
        def noaa_only(request,**kwargs):
            if not request.full_url.startswith(ROOT):raise OSError('offline')
            return provider(request)
        with patch('public_data_server.urlopen',side_effect=noaa_only) as get:
            self.fetcher.refresh_due()
        self.assertEqual(sorted(c.args[0].full_url for c in get.call_args_list),sorted([ROOT+FEEDS['scales'][0],public_data_server.DRAP_URL,public_data_server.NICT_URL]))

    def test_file_link_reads_fetcher_files_and_rejects_tampering(self):
        with patch('public_data_server.urlopen',side_effect=provider):self.fetcher.fetch('observed')
        with patch.dict(os.environ,{'HF_PUBLIC_DATA_MODE':'file','HF_PUBLIC_DATA_DIR':self.tmp.name}):
            raw,fetched=public_data.download('observed')
            self.assertEqual(json.loads(raw),ROWS['observed']);self.assertLess(abs(fetched-time.time()),5)
            (Path(self.tmp.name)/'observed.raw').write_bytes(b'[]')
            with self.assertRaises(public_data.PublicDataError):public_data.download('observed')
            with self.assertRaises(public_data.PublicDataError):public_data.download('predicted')
            with self.assertRaises(public_data.PublicDataError):public_data.download('../x')

    def test_bundle_carries_fetcher_files_to_an_on_premises_chuck(self):
        with patch('public_data_server.urlopen',side_effect=provider):
            for key in FEEDS:self.fetcher.fetch(key)
        path=self.fetcher.export()
        self.assertEqual(path.name,'chuck-public-data.json')
        bundle=path.read_bytes()
        self.assertEqual(set(json.loads(bundle)['sources']),set(FEEDS))
        validators={key:check for key,(_,_,_,check) in public_data_server.sources(giro_enabled=True).items()}
        with tempfile.TemporaryDirectory() as onprem:
            folder=Path(onprem)
            self.assertEqual(public_data.import_bundle(bundle,folder,validators),{'imported':list(json.loads(bundle)['sources']),'skipped':[],'rejected':[]})
            # The same or older data never replaces what is held.
            self.assertEqual(public_data.import_bundle(bundle,folder,validators)['skipped'],list(json.loads(bundle)['sources']))
            with patch.dict(os.environ,{'HF_PUBLIC_DATA_MODE':'file','HF_PUBLIC_DATA_DIR':onprem}), patch('public_data.request',side_effect=AssertionError('must not connect')):
                p,w=SpaceWeather(Path(onprem)/'cache').calculation_input({'year':2026,'month':10,'ssn_source':'noaa'})
                self.assertEqual((p['ssn'],w['sources']['predicted']['origin'],w['link']['mode']),(61.2,'file','file'))
            # Tampered or unknown entries are rejected one by one.
            data=json.loads(bundle)
            data['sources']['observed']['raw']=__import__('base64').b64encode(b'[]').decode()
            data['sources']['scales']['fetched_at']+=10;data['sources']['scales']['raw']=__import__('base64').b64encode(b'{"wrong":{}}').decode()
            data['sources']['scales']['sha256']=__import__('hashlib').sha256(b'{"wrong":{}}').hexdigest()
            data['sources']['../x']=data['sources']['predicted']
            result=public_data.import_bundle(json.dumps(data).encode(),folder,validators)
            self.assertEqual(sorted(result['rejected']),['../x','observed','scales'])
            for content in (b'{}',b'not json',json.dumps({'format':'chuck-public-data','sources':{}}).encode()):
                with self.assertRaises(ValueError):public_data.import_bundle(content,folder,validators)

    def test_modes(self):
        for value,expected in [(None,'api'),('file','file'),('FILE','file'),('direct','api'),('','api')]:
            with patch.dict(os.environ,{} if value is None else {'HF_PUBLIC_DATA_MODE':value}):
                if value is None:os.environ.pop('HF_PUBLIC_DATA_MODE',None)
                self.assertEqual(public_data.mode(),expected,value)


class ApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp=tempfile.TemporaryDirectory()
        cls.fetcher=public_data_server.Fetcher(cls.tmp.name,public_data_server.sources(giro_enabled=False))
        cls.patches=[patch.object(public_data_server,'FETCHER',cls.fetcher),patch('public_data_server.urlopen',side_effect=provider)]
        for p in cls.patches:p.start()
        cls.http=ThreadingHTTPServer(('127.0.0.1',0),public_data_server.Handler)
        threading.Thread(target=cls.http.serve_forever,daemon=True).start()
        cls.url=f'http://127.0.0.1:{cls.http.server_port}'

    @classmethod
    def tearDownClass(cls):
        cls.http.shutdown();cls.http.server_close()
        for p in cls.patches:p.stop()
        cls.tmp.cleanup()

    def get(self,path,headers=None):
        try:
            with urllib.request.urlopen(urllib.request.Request(self.url+path,headers=headers or {})) as r:return r.status,r.read(),r.headers
        except urllib.error.HTTPError as e:return e.code,e.read(),e.headers

    def test_authentication(self):
        self.assertEqual(self.get('/api/health')[0],200)
        with patch.dict(os.environ,{'HF_PUBLIC_DATA_TOKEN':'short'}):
            self.assertEqual(self.get('/api/data/observed',{'Authorization':'Bearer short'})[0],503)
        with patch.dict(os.environ,{'HF_PUBLIC_DATA_TOKEN':TOKEN}):
            self.assertEqual(self.get('/api/data/observed')[0],401)
            self.assertEqual(self.get('/api/data/observed',{'Authorization':'Bearer '+'x'*40})[0],401)
            self.assertEqual(self.get('/api/data/observed',{'Authorization':'Bearer '+TOKEN,'Origin':'http://evil'})[0],403)
            self.assertEqual(self.get('/api/data/GU513',{'Authorization':'Bearer '+TOKEN})[0],404)
            status,body,headers=self.get('/api/data/observed',{'Authorization':'Bearer '+TOKEN})
            self.assertEqual((status,json.loads(body)),(200,ROWS['observed']));self.assertTrue(float(headers['X-Fetched-At']))
            status,body,_=self.get('/api/status',{'Authorization':'Bearer '+TOKEN})
            self.assertIsNotNone(json.loads(body)['sources']['observed']['fetched_at'])

    def test_chuck_reads_space_weather_over_the_api(self):
        with tempfile.TemporaryDirectory() as directory, patch.dict(os.environ,{'HF_PUBLIC_DATA_MODE':'api','HF_PUBLIC_DATA_URL':self.url,'HF_PUBLIC_DATA_TOKEN':TOKEN}):
            p,w=SpaceWeather(directory).calculation_input({'year':2026,'month':10,'ssn_source':'noaa'})
            self.assertEqual(p['ssn'],61.2)
            self.assertEqual({s['origin'] for s in w['sources'].values()},{'api'})
            self.assertEqual(w['link'],{'mode':'api','url':self.url})
            raw,_=public_data.request('/api/export')
            self.assertEqual(json.loads(raw)['format'],'chuck-public-data')
            os.environ['HF_PUBLIC_DATA_URL']='http://127.0.0.1:9'
            with self.assertRaises(public_data.PublicDataError):public_data.download('observed')
            os.environ['HF_PUBLIC_DATA_URL']='http://user:pass@127.0.0.1:9'
            with self.assertRaises(public_data.PublicDataError):public_data.download('observed')


if __name__=='__main__':unittest.main()
