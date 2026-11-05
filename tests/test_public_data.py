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
import public_data_store
from http.server import ThreadingHTTPServer
from space_weather import ROOT, FEEDS, KP_FEEDS, ALL_FEEDS, SpaceWeather

TOKEN='t'*40
ROWS={'observed':[{'time-tag':'2026-01','smoothed_ssn':100.1,'smoothed_f10.7':140}],
      'predicted':[{'time-tag':'2026-10','predicted_ssn':87.5,'predicted_f10.7':130}],
      'scales':{'0':{'DateStamp':'2026-10-31','TimeStamp':'00:00:00','R':{'Scale':'0'},'S':{'Scale':'0'},'G':{'Scale':'1'}}}}

KP={'kp':[['time_tag','Kp','a_running','station_count'],['2026-01-01 00:00:00.000','2.33','7','8']],
    'kp-forecast':[['time_tag','kp','observed','noaa_scale'],['2026-01-01 03:00:00','3.00','predicted',None]]}


def provider(request,**kwargs):
    key=next(k for k,(path,_) in ALL_FEEDS.items() if request.full_url==ROOT+path)
    return io.BytesIO(json.dumps(ROWS.get(key) or KP[key]).encode())


class FetcherTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.fetcher=public_data_server.Fetcher(self.tmp.name,public_data_server.sources(giro_enabled=False))

    def test_sources_are_fixed_and_giro_is_opt_in(self):
        self.assertEqual(set(public_data_server.sources(giro_enabled=False)),{'observed','predicted','scales','kp','kp-forecast','drap','nict'})
        self.assertEqual(set(public_data_server.sources(giro_enabled=True))-{'observed','predicted','scales','kp','kp-forecast','drap','nict'},{'GU513','JR055','MHJ45'})

    def test_scheduled_fetch_validates_and_keeps_previous_files(self):
        with patch('public_data_server.urlopen',side_effect=provider) as get:
            for key in FEEDS:self.assertIsNone(self.fetcher.fetch(key))
            self.assertEqual(get.call_count,3)
            for key in FEEDS:self.assertFalse(self.fetcher.due(key))
        raw,fetched_at,_=self.fetcher.latest('predicted')
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
        self.assertEqual(sorted(c.args[0].full_url for c in get.call_args_list),sorted([ROOT+FEEDS['scales'][0],*(ROOT+path for path,_ in KP_FEEDS.values()),public_data_server.DRAP_URL,public_data_server.NICT_URL]))

    def test_saved_files_are_checked_when_read(self):
        with patch('public_data_server.urlopen',side_effect=provider):self.fetcher.fetch('observed')
        raw,fetched,origin=self.fetcher.latest('observed')
        self.assertEqual((json.loads(raw),origin),(ROWS['observed'],'download'));self.assertLess(abs(fetched-time.time()),5)
        (Path(self.tmp.name)/'observed.raw').write_bytes(b'[]')
        self.assertEqual(self.fetcher.latest('observed'),(None,None,None))
        self.assertEqual(self.fetcher.latest('predicted'),(None,None,None))

    def test_link_file_carries_container_files_to_an_on_premises_container(self):
        with patch('public_data_server.urlopen',side_effect=provider):
            for key in FEEDS:self.fetcher.fetch(key)
        path=self.fetcher.export()
        self.assertEqual(path.name,'chuck-public-data.json')
        bundle=path.read_bytes()
        self.assertEqual(set(json.loads(bundle)['sources']),set(FEEDS))
        with tempfile.TemporaryDirectory() as onprem, patch.dict(os.environ,{'HF_PUBLIC_DATA_SOURCE':'file'}), \
                patch('public_data_server.urlopen',side_effect=AssertionError('must not connect')):
            container=public_data_server.Fetcher(onprem)
            self.assertEqual(container.import_file(bundle),{'bundle':{'imported':list(json.loads(bundle)['sources']),'skipped':[],'rejected':[]}})
            # The same or older data never replaces what is held.
            self.assertEqual(container.import_file(bundle)['bundle']['skipped'],list(json.loads(bundle)['sources']))
            self.assertEqual(container.latest('predicted')[2],'bundle')
            # On premises nothing is downloaded, neither on schedule nor on request.
            container.refresh_due(every=True)
            self.assertTrue(container.fetch('observed'))
            self.assertTrue((Path(onprem)/'export'/'chuck-public-data.json').exists())
            # Tampered or unknown entries are rejected one by one.
            folder=Path(onprem)
            validators={key:check for key,(_,_,_,check) in public_data_server.sources(giro_enabled=True).items()}
            data=json.loads(bundle)
            data['sources']['observed']['raw']=__import__('base64').b64encode(b'[]').decode()
            data['sources']['scales']['fetched_at']+=10;data['sources']['scales']['raw']=__import__('base64').b64encode(b'{"wrong":{}}').decode()
            data['sources']['scales']['sha256']=__import__('hashlib').sha256(b'{"wrong":{}}').hexdigest()
            data['sources']['../x']=data['sources']['predicted']
            result,_=public_data_store.import_bundle(json.dumps(data).encode(),folder,validators)
            self.assertEqual(sorted(result['rejected']),['../x','observed','scales'])
            for content in (b'{}',b'not json',json.dumps({'format':'chuck-public-data','sources':{}}).encode()):
                with self.assertRaises(ValueError):public_data_store.import_bundle(content,folder,validators)
            with self.assertRaises(ValueError):container.import_file(json.dumps({'format':'chuck-public-data','sources':{}}).encode())

    def test_data_source(self):
        for env,expected in [({},'internet'),({'HF_PUBLIC_DATA_SOURCE':'file'},'file'),({'HF_PUBLIC_DATA_SOURCE':'FILE'},'file'),
                             ({'HF_PUBLIC_DATA_SOURCE':'other'},'internet'),({'HF_PUBLIC_DATA_MODE':'file'},'file'),
                             ({'HF_PUBLIC_DATA_SOURCE':'internet','HF_PUBLIC_DATA_MODE':'file'},'internet')]:
            with patch.dict(os.environ,env):
                for name in ('HF_PUBLIC_DATA_SOURCE','HF_PUBLIC_DATA_MODE'):
                    if name not in env:os.environ.pop(name,None)
                self.assertEqual(public_data_server.source(),expected,env)


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
        with patch.dict(os.environ,{'HF_PUBLIC_DATA_URL':self.url,'HF_PUBLIC_DATA_TOKEN':TOKEN}):
            public_data.LINK.clear()
            p,w=SpaceWeather().calculation_input({'year':2026,'month':10,'ssn_source':'noaa'})
            self.assertEqual(p['ssn'],61.2)
            self.assertEqual({s['origin'] for s in w['sources'].values()},{'api'})
            self.assertEqual(w['link'],{'mode':'api','url':self.url,'source':'internet'})
            raw,_=public_data.request('/api/export')
            self.assertEqual(json.loads(raw)['format'],'chuck-public-data')
            os.environ['HF_PUBLIC_DATA_URL']='http://127.0.0.1:9'
            with self.assertRaises(public_data.PublicDataError):public_data.download('observed')
            os.environ['HF_PUBLIC_DATA_URL']='http://user:pass@127.0.0.1:9'
            with self.assertRaises(public_data.PublicDataError):public_data.download('observed')
            public_data.LINK.clear()

    def test_on_premises_chuck_uploads_through_the_container(self):
        # CHUCK passes files to the container (POST /api/import) and saves none itself.
        with tempfile.TemporaryDirectory() as onprem, patch.dict(os.environ,{'HF_PUBLIC_DATA_URL':self.url,'HF_PUBLIC_DATA_TOKEN':TOKEN,'HF_PUBLIC_DATA_SOURCE':'file'}), \
                patch.object(public_data_server,'FETCHER',public_data_server.Fetcher(onprem)), patch('public_data_server.urlopen',side_effect=AssertionError('must not connect')):
            public_data.LINK.clear()
            with self.assertRaises(public_data.PublicDataError):public_data.download('predicted')
            self.assertEqual(public_data.upload(json.dumps(ROWS['predicted']).encode())['kind'],'predicted')
            with self.assertRaises(ValueError):public_data.upload(b'{"wrong":1}')
            self.assertEqual(self.get('/api/import',{'Authorization':'Bearer '+TOKEN})[0],404)  # POST only
            raw,_,origin=public_data.download('predicted')
            self.assertEqual((json.loads(raw),origin),(ROWS['predicted'],'upload'))
            p,w=SpaceWeather().calculation_input({'year':2026,'month':10,'ssn_source':'noaa'})
            self.assertEqual((p['ssn'],w['link']['source'],w['sources']['predicted']['fetch_state']),(61.2,'file','uploaded'))
            link=public_data.link_status(refresh=True)
            self.assertEqual((link['mode'],link['source'],link['connected']),('api','file',True));self.assertTrue(link['imported_at'])
            public_data.LINK.clear()
        req=urllib.request.Request(self.url+'/api/import',data=b'{}',headers={'Content-Type':'application/json'})
        with patch.dict(os.environ,{'HF_PUBLIC_DATA_TOKEN':TOKEN}):
            with self.assertRaises(urllib.error.HTTPError) as error:urllib.request.urlopen(req)
        self.assertEqual(error.exception.code,401)

    def test_published_briefing_reaches_chuck_with_byte_ranges(self):
        import briefing,server
        with tempfile.TemporaryDirectory() as root:
            maker=briefing.Briefing(root)
            day=maker.root/'published'/'2026-11-03';(day/'subtitles').mkdir(parents=True)
            (day/'meta.json').write_text(json.dumps({'run_date_utc':'2026-11-03','run_id':'r','subtitles':['ja']}))
            video=bytes(range(256))*40;(day/'video_en.mp4').write_bytes(video);(day/'subtitles'/'ja.vtt').write_text('WEBVTT\n')
            chuck=ThreadingHTTPServer(('127.0.0.1',0),server.Handler);threading.Thread(target=chuck.serve_forever,daemon=True).start()
            self.addCleanup(lambda:(chuck.shutdown(),chuck.server_close()))
            base=f'http://127.0.0.1:{chuck.server_port}'
            with patch.object(public_data_server,'BRIEFING',maker),patch.dict(os.environ,{'HF_PUBLIC_DATA_URL':self.url,'HF_PUBLIC_DATA_TOKEN':TOKEN}):
                auth={'Authorization':'Bearer '+TOKEN}
                self.assertEqual(self.get('/api/briefing/published')[0],401)
                status,body,_=self.get('/api/briefing/published',auth)
                self.assertEqual((status,[i['run_date_utc'] for i in json.loads(body)['items']]),(200,['2026-11-03']))
                self.assertEqual(self.get('/api/briefing/published/2026-11-03/audio_en.wav',auth)[0],404)
                status,body,headers=self.get('/api/briefing/published/2026-11-03/video_en.mp4',{**auth,'Range':'bytes=100-199'})
                self.assertEqual((status,body,headers['Content-Range']),(206,video[100:200],f'bytes 100-199/{len(video)}'))
                # CHUCK passes the list and the files on, without a token, to any visitor.
                def visit(path,headers=None):
                    try:
                        with urllib.request.urlopen(urllib.request.Request(base+path,headers=headers or {})) as r:return r.status,r.read(),r.headers
                    except urllib.error.HTTPError as e:return e.code,e.read(),e.headers
                status,body,_=visit('/api/space-weather/briefing')
                self.assertEqual((status,json.loads(body)['items'][0]['run_id'],json.loads(body)['available']),(200,'r',True))
                self.assertNotIn(TOKEN,body.decode())
                status,body,headers=visit('/api/space-weather/briefing/2026-11-03/video_en.mp4',{'Range':'bytes=-10'})
                self.assertEqual((status,body,headers['Content-Type']),(206,video[-10:],'video/mp4'))
                status,body,_=visit('/api/space-weather/briefing/2026-11-03/video_en.mp4')
                self.assertEqual((status,body),(200,video))
                self.assertEqual(visit('/api/space-weather/briefing/2026-11-03/subtitles/ja.vtt')[1],b'WEBVTT\n')
                self.assertEqual(visit('/api/space-weather/briefing/2026-11-03/../settings.json')[0],404)
                self.assertEqual(visit('/api/space-weather/briefing/2026-11-04/video_ja.mp4')[0],404)
                os.environ['HF_PUBLIC_DATA_URL']='http://127.0.0.1:9'
                self.assertEqual(json.loads(visit('/api/space-weather/briefing')[1])['available'],False)


if __name__=='__main__':unittest.main()
