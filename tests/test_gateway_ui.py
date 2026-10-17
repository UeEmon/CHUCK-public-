"""Browser sessions must never authorize the external/service ingestion APIs."""
import http.client
import json
import os
from pathlib import Path
import sqlite3
import sys
import tempfile
import threading
import time
import unittest
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'))
import gateway_server as gateway
import gateway_ui as ui
from positions import PositionStore

class GatewayUITests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.env=patch.dict(os.environ,HF_GATEWAY_UI_PASSWORD='dedicated-browser-password',HF_POSITION_GATEWAY_TOKEN='c'*40,HF_POSITION_INGEST_TOKEN='i'*40)
        self.env.start()
        self.store=patch.object(gateway,'STORE',PositionStore(lambda:sqlite3.connect(Path(self.tmp.name)/'db')));self.store.start()
        ui.SESSIONS.clear();ui.FAILURES.clear()
        self.http=gateway.ThreadingHTTPServer(('127.0.0.1',0),gateway.Handler)
        self.thread=threading.Thread(target=self.http.serve_forever,daemon=True);self.thread.start()
        self.origin=f'http://127.0.0.1:{self.http.server_port}'
    def tearDown(self):
        self.http.shutdown();self.http.server_close();self.thread.join();self.store.stop();self.env.stop();self.tmp.cleanup()
    def request(self,path,data=None,cookie=None,headers=None):
        h={'Origin':self.origin,'Content-Type':'application/json'}
        if cookie:h['Cookie']=cookie
        h.update(headers or {})
        c=http.client.HTTPConnection('127.0.0.1',self.http.server_port)
        c.request('GET' if data is None else 'POST',path,None if data is None else json.dumps(data),h)
        response=c.getresponse();body=response.read();status=response.status;result=dict(response.getheaders());c.close()
        return status,result,json.loads(body) if result.get('Content-Type','').startswith('application/json') else body
    def login(self):
        code,headers,_=self.request('/ui/api/login',{'password':'dedicated-browser-password'})
        self.assertEqual(code,200)
        self.assertIn('HttpOnly',headers['Set-Cookie']);self.assertIn('SameSite=Strict',headers['Set-Cookie'])
        return headers['Set-Cookie'].split(';')[0]
    def test_configuration_and_static_files(self):
        for value in ['', 'short', 'i'*40, 'c'*40]:
            with patch.dict(os.environ,HF_GATEWAY_UI_PASSWORD=value):
                self.assertFalse(self.request('/ui/api/session')[2]['configured'])
                self.assertEqual(self.request('/ui/api/login',{'password':value})[0],503)
        for path in ['/','/gateway.js','/style.css','/i18n.js','/i18n-messages.js']:
            code,h,_=self.request(path);self.assertEqual(code,200);self.assertIn("frame-ancestors 'none'",h['Content-Security-Policy'])
        self.assertEqual(self.request('/ui/api/status')[0],401)
    def test_authenticated_config_and_service_isolation(self):
        cookie=self.login()
        status=self.request('/ui/api/status',cookie=cookie)
        self.assertEqual(status[0],200)
        serialized=json.dumps(status[2]);self.assertNotIn('i'*40,serialized);self.assertNotIn('c'*40,serialized);self.assertNotIn('dedicated-browser-password',serialized)
        station=dict(source='gps',id='plane',name='Aircraft',kind='aircraft',protocol='geojson',enabled=True)
        self.assertEqual(self.request('/ui/api/stations',station,cookie)[0],200)
        self.assertEqual(self.request('/ui/api/status',cookie=cookie)[2]['stations'][0]['protocol'],'geojson')
        self.assertEqual(self.request('/api/positions',dict(source='gps',positions=[]),cookie)[0],401)
        self.assertEqual(self.request('/internal/v1/positions',cookie=cookie)[0],401)
        self.assertEqual(self.request('/ui/api/stations',station,cookie,{'Origin':'https://other.example'})[0],403)
        self.assertEqual(self.request('/ui/api/stations',station,cookie,{'Content-Type':'text/plain'})[0],415)
        self.assertEqual(self.request('/ui/api/stations',[],cookie)[0],400)
        self.assertEqual(self.request('/ui/api/logout',{},cookie)[0],200)
        self.assertEqual(self.request('/ui/api/status',cookie=cookie)[0],401)
    def test_health_is_not_proof_of_service_authentication(self):
        from gateway_client import GatewayClient, GatewayError
        # Length-only health flags must not be mistaken for successful auth.
        with patch.dict(os.environ,HF_POSITION_INGEST_TOKEN='c'*40):
            code,_,health=self.request('/api/health')
            self.assertEqual(code,200)
            self.assertTrue(health['ingest_enabled'])
            self.assertTrue(health['client_enabled'])
            with self.assertRaises(GatewayError) as error:
                GatewayClient(self.origin,'c'*40).snapshot()
            self.assertIn('503',str(error.exception))
        with self.assertRaises(GatewayError) as error:
            GatewayClient(self.origin,'wrong-token-'*4).snapshot()
        self.assertIn('401',str(error.exception))
        self.assertEqual(GatewayClient(self.origin,'c'*40).snapshot()['schema_version'],1)

    def test_expiry_password_rotation_and_throttling(self):
        cookie=self.login()
        token=cookie.split('=')[1];ui.SESSIONS[token]['expires']=time.monotonic()-1
        self.assertEqual(self.request('/ui/api/status',cookie=cookie)[0],401)
        cookie=self.login()
        with patch.dict(os.environ,HF_GATEWAY_UI_PASSWORD='changed-browser-password'):
            self.assertEqual(self.request('/ui/api/status',cookie=cookie)[0],401)
        for _ in range(8):self.assertEqual(self.request('/ui/api/login',{'password':'bad'})[0],401)
        self.assertEqual(self.request('/ui/api/login',{'password':'dedicated-browser-password'})[0],429)

if __name__=='__main__':unittest.main()
