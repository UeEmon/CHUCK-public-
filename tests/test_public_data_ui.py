"""The fetcher's admin page: its own password, and the GIRO setting CHUCK follows."""
import http.client
import io
import json
import os
from pathlib import Path
import sys
import tempfile
import threading
import unittest
from unittest.mock import patch

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'));sys.path.insert(0,str(Path(__file__).resolve().parent))
import public_data
import public_data_server
import public_data_ui as ui
from http.server import ThreadingHTTPServer
from observations import Observations
from test_public_data import TOKEN, provider

PASSWORD='dedicated-fetcher-password'


class FetcherSettingsTests(unittest.TestCase):
    def test_giro_setting_is_saved_and_survives_a_restart(self):
        with tempfile.TemporaryDirectory() as directory:
            with patch.object(public_data_server,'GIRO_ENABLED',False):
                fetcher=public_data_server.Fetcher(directory)
                self.assertFalse(fetcher.giro_enabled());self.assertNotIn('GU513',fetcher.table)
                fetcher.set_giro(True)
                self.assertTrue(fetcher.giro_enabled());self.assertIn('GU513',fetcher.table)
                self.assertTrue(public_data_server.Fetcher(directory).giro_enabled())
                self.assertEqual(json.loads(fetcher.bundle())['settings'],{'giro_enabled':True})
                fetcher.set_giro(False)
                self.assertNotIn('JR055',public_data_server.Fetcher(directory).table)
            # The environment only sets the choice before the admin page saves one.
            with patch.object(public_data_server,'GIRO_ENABLED',True):
                self.assertFalse(public_data_server.Fetcher(directory).giro_enabled())
        with tempfile.TemporaryDirectory() as directory, patch.object(public_data_server,'GIRO_ENABLED',True):
            self.assertTrue(public_data_server.Fetcher(directory).giro_enabled())

    def test_errors_are_reported_until_the_next_success(self):
        with tempfile.TemporaryDirectory() as directory:
            fetcher=public_data_server.Fetcher(directory,public_data_server.sources(giro_enabled=False))
            with patch('public_data_server.urlopen',side_effect=OSError):fetcher.fetch('observed')
            self.assertEqual(fetcher.status()['observed']['error'],'提供元から取得できませんでした')
            fetcher.retry_after.clear()
            with patch('public_data_server.urlopen',side_effect=provider):fetcher.fetch('observed')
            self.assertIsNone(fetcher.status()['observed']['error'])
            self.assertEqual(fetcher.fetch('GU513'),'取得対象ではありません')


class AdminPageTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.fetcher=public_data_server.Fetcher(self.tmp.name,public_data_server.sources(giro_enabled=False))
        for p in [patch.object(public_data_server,'FETCHER',self.fetcher),patch('public_data_server.urlopen',side_effect=provider),
                  patch.dict(os.environ,{'HF_PUBLIC_DATA_UI_PASSWORD':PASSWORD,'HF_PUBLIC_DATA_TOKEN':TOKEN})]:
            p.start();self.addCleanup(p.stop)
        ui.SESSIONS.clear();ui.FAILURES.clear()
        self.http=ThreadingHTTPServer(('127.0.0.1',0),public_data_server.Handler)
        threading.Thread(target=self.http.serve_forever,daemon=True).start()
        self.addCleanup(self.http.server_close);self.addCleanup(self.http.shutdown)
        self.origin=f'http://127.0.0.1:{self.http.server_port}'

    def request(self,path,data=None,cookie=None,headers=None):
        h={'Origin':self.origin,'Content-Type':'application/json'}
        if cookie:h['Cookie']=cookie
        h.update(headers or {})
        c=http.client.HTTPConnection('127.0.0.1',self.http.server_port)
        c.request('GET' if data is None else 'POST',path,None if data is None else json.dumps(data),h)
        response=c.getresponse();body=response.read();result=dict(response.getheaders());c.close()
        return response.status,result,json.loads(body) if result.get('Content-Type','').startswith('application/json; charset') else body

    def login(self):
        code,headers,_=self.request('/ui/api/login',{'password':PASSWORD})
        self.assertEqual(code,200);self.assertIn('HttpOnly',headers['Set-Cookie']);self.assertIn('Path=/ui',headers['Set-Cookie'])
        return headers['Set-Cookie'].split(';')[0]

    def test_page_and_login(self):
        code,headers,body=self.request('/')
        self.assertEqual(code,200);self.assertIn(b'public-data.js',body);self.assertIn("frame-ancestors 'none'",headers['Content-Security-Policy'])
        self.assertEqual(self.request('/ui/api/session')[2],{'authenticated':False,'configured':True})
        self.assertEqual(self.request('/ui/api/status')[0],401)
        self.assertEqual(self.request('/ui/api/login',{'password':'wrong'})[0],401)
        self.assertEqual(self.request('/ui/api/login',{'password':PASSWORD},headers={'Origin':'http://evil'})[0],403)
        cookie=self.login()
        code,_,status=self.request('/ui/api/status',cookie=cookie)
        self.assertEqual(code,200);self.assertFalse(status['giro_enabled']);self.assertIn('observed',status['sources'])
        # The browser session never opens the CHUCK-facing API.
        self.assertEqual(self.request('/api/status',cookie=cookie)[0],401)
        self.assertEqual(self.request('/ui/api/logout',{},cookie=cookie)[0],200)
        self.assertEqual(self.request('/ui/api/status',cookie=cookie)[0],401)

    def test_password_must_differ_from_the_token(self):
        for value in [TOKEN,'short']:
            with patch.dict(os.environ,{'HF_PUBLIC_DATA_UI_PASSWORD':value}):
                self.assertFalse(self.request('/ui/api/session')[2]['configured'])
                self.assertEqual(self.request('/ui/api/login',{'password':value})[0],503)

    def test_giro_setting_requires_the_terms_and_reaches_chuck(self):
        cookie=self.login()
        code,_,body=self.request('/ui/api/settings',{'giro_enabled':True},cookie=cookie)
        self.assertEqual(code,400);self.assertFalse(self.fetcher.giro_enabled())
        self.assertEqual(self.request('/ui/api/settings',{'giro_enabled':'yes'},cookie=cookie)[0],400)
        code,_,body=self.request('/ui/api/settings',{'giro_enabled':True,'terms_accepted':True},cookie=cookie)
        self.assertEqual(code,200);self.assertTrue(body['giro_enabled']);self.assertIn('GU513',body['sources'])
        with patch.dict(os.environ,{'HF_PUBLIC_DATA_MODE':'api','HF_PUBLIC_DATA_URL':self.origin}):
            public_data.LINK.clear()
            observations=Observations(self.tmp.name,public_data.giro_enabled)
            self.assertTrue(observations.giro_enabled)
            link=public_data.link_status()
            self.assertTrue(link['connected']);self.assertIsNone(link['error'])
            self.request('/ui/api/settings',{'giro_enabled':False},cookie=cookie)
            self.assertTrue(observations.giro_enabled) # cached for 30 seconds
            public_data.link_status(refresh=True)
            self.assertFalse(observations.giro_enabled)
            self.assertFalse(observations.giro('JR055')['enabled'])
            # An unreachable fetcher keeps the last known setting and reports the failure.
            os.environ['HF_PUBLIC_DATA_URL']='http://127.0.0.1:9'
            link=public_data.link_status(refresh=True)
            self.assertFalse(link['connected']);self.assertTrue(link['error']);self.assertIsNotNone(link['connected_at'])
            public_data.LINK.clear()

    def test_manual_fetch_and_export(self):
        cookie=self.login()
        code,_,body=self.request('/ui/api/fetch',{},cookie=cookie)
        self.assertEqual(code,200);self.assertIsNotNone(body['sources']['observed']['fetched_at'])
        code,headers,raw=self.request('/ui/api/export',cookie=cookie)
        self.assertEqual(code,200);self.assertIn('attachment',headers['Content-Disposition'])
        bundle=json.loads(raw);self.assertEqual(bundle['settings'],{'giro_enabled':False});self.assertIn('observed',bundle['sources'])
        # The file link carries the setting to an on-premises CHUCK.
        with tempfile.TemporaryDirectory() as directory, patch.dict(os.environ,{'HF_PUBLIC_DATA_MODE':'file','HF_PUBLIC_DATA_DIR':directory}):
            bundle['settings']['giro_enabled']=True
            validators={key:check for key,(_,_,_,check) in public_data_server.sources(giro_enabled=True).items()}
            public_data.import_bundle(json.dumps(bundle).encode(),Path(directory),validators)
            link=public_data.link_status()
            self.assertEqual((link['mode'],link['connected'],link['giro_enabled']),('file',None,True));self.assertTrue(link['checked_at'])


if __name__=='__main__':unittest.main()
