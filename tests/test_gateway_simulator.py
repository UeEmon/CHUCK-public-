"""The gateway test jig passes against a real in-process gateway."""
import contextlib
import io
import os
from pathlib import Path
import sqlite3
import sys
import tempfile
import threading
import unittest
from unittest.mock import patch
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'app'));sys.path.insert(0,str(ROOT/'scripts'))
import gateway_server as gateway
import gateway_simulator as jig
import simulator_console
import http.client
import json
import time
import gateway_stream
from positions import PositionStore


class SimulatorTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        env=patch.dict(os.environ,HF_POSITION_GATEWAY_TOKEN='c'*40,HF_POSITION_INGEST_TOKEN='i'*40);env.start();self.addCleanup(env.stop)
        store=PositionStore(lambda:sqlite3.connect(Path(self.tmp.name)/'db'))
        patched=patch.object(gateway,'STORE',store);patched.start();self.addCleanup(patched.stop)
        self.http=gateway.ThreadingHTTPServer(('127.0.0.1',0),gateway.Handler)
        threading.Thread(target=self.http.serve_forever,daemon=True).start()
        self.addCleanup(self.http.server_close);self.addCleanup(self.http.shutdown)
        self.stats=gateway_stream.StreamStats()
        for server in gateway_stream.start(store,self.stats,host='127.0.0.1',tcp_port=0,udp_port=0,require_key=True):
            self.addCleanup(server.server_close);self.addCleanup(server.shutdown)
        self.args=['--url',f'http://127.0.0.1:{self.http.server_port}','--nmea-port',str(self.stats.listeners['tcp']),'--udp-port',str(self.stats.listeners['udp'])]

    def jig(self,*extra):
        out=io.StringIO()
        with contextlib.redirect_stdout(out),contextlib.redirect_stderr(out):
            code=jig.main([*extra,*self.args])
        return code,out.getvalue()

    def test_check_passes_on_every_input_path(self):
        code,out=self.jig('check')
        self.assertEqual(code,0,out);self.assertIn('結果: 11/11 合格',out)
        self.assertNotIn('FAIL',out)

    def test_run_moves_stations_and_keys_file_is_private(self):
        keys=Path(self.tmp.name)/'keys.json'
        code,out=self.jig('setup','--only','tcp','--keys',str(keys))
        self.assertEqual(code,0,out);self.assertEqual(keys.stat().st_mode&0o777,0o600)
        code,out=self.jig('run','--only','tcp','--no-setup','--keys',str(keys),'--interval','0.2','--duration','0.5')
        self.assertEqual(code,0,out)
        self.assertTrue(self.stats.snapshot()['counts']['accepted']>=1 or 'TCP/UDP送信' in out)

    def test_fails_without_tokens_and_rejects_remote_http(self):
        with patch.dict(os.environ,HF_POSITION_GATEWAY_TOKEN=''):
            code,out=self.jig('check')
        self.assertEqual(code,2);self.assertIn('トークン',out)
        with self.assertRaises(jig.JigError):jig.Gateway('http://192.0.2.1:18083','i'*40,'c'*40,None,10110)

    def gateway(self):
        return jig.Gateway(f'http://127.0.0.1:{self.http.server_port}','i'*40,'c'*40,'127.0.0.1',self.stats.listeners['tcp'],udp_port=self.stats.listeners['udp'])

    def test_console_steers_stations_and_injects_faults(self):
        console=simulator_console.Console(self.gateway(),jig.load_scenario(None),interval=1)
        self.addCleanup(console.close)
        console.tick()  # Stream stations have no key yet: they wait instead of failing.
        self.assertEqual(self.stats.snapshot()['counts']['unauthorized'],0)
        self.assertIn('受信キーなし',console.stations['ship-tcp']['last'])
        console.action(dict(action='setup'))
        console.action(dict(action='update',id='ship-json',speed_knots=600,course_deg=90))
        console.action(dict(action='step'))
        deadline=time.time()+5
        while time.time()<deadline and len(console.state()['stations'][0]['track'])<2 or not all(s['received'] for s in console.state()['stations']):
            console.received_at=0;time.sleep(0.1)
            if time.time()>deadline:break
        state=console.state()
        self.assertTrue(all(s['received'] for s in state['stations']),state['stations'])
        self.assertNotIn('stream_key',json.dumps(state))
        ship=next(s for s in state['stations'] if s['id']=='ship-json')
        self.assertGreater(ship['lon'],139.8)  # Moved east after the step.
        console.action(dict(action='fault',id='car-nmea',fault='checksum'))
        self.assertIn('HTTP 400',console.stations['car-nmea']['last'])
        console.action(dict(action='fault',id='ship-json',fault='out_of_range'))
        self.assertIn('HTTP 400',console.stations['ship-json']['last'])
        with self.assertRaises(jig.JigError):console.action(dict(action='fault',id='ship-json',fault='wrong_key'))
        console.action(dict(action='add',id='bus-1',kind='vehicle',transport='udp',lat=35.1,lon=139.1,speed_knots=20,course_deg=10))
        for bad in (dict(action='add',id='bus-1',kind='vehicle',transport='udp',lat=35,lon=139),dict(action='add',id='x y',kind='vehicle',transport='udp',lat=35,lon=139),
                    dict(action='update',id='bus-1',speed_knots=-1),dict(action='interval',interval=0),dict(action='nope')):
            with self.subTest(bad=bad),self.assertRaises(jig.JigError):console.action(bad)
        console.action(dict(action='remove',id='bus-1'));self.assertNotIn('bus-1',console.stations)

    def test_console_server_requires_its_token_and_loopback_host(self):
        console=simulator_console.Console(self.gateway(),jig.load_scenario(None))
        server,token=simulator_console.make_server(console,0)
        threading.Thread(target=server.serve_forever,daemon=True).start()
        self.addCleanup(console.close);self.addCleanup(server.server_close);self.addCleanup(server.shutdown)
        port=server.server_port
        def request(method,path,headers=None,body=None):
            c=http.client.HTTPConnection('127.0.0.1',port,timeout=5);c.request(method,path,body=body,headers=headers or {})
            r=c.getresponse();data=r.read();c.close();return r.status,data
        status,page=request('GET','/')
        self.assertEqual(status,200);self.assertIn(token.encode(),page)
        self.assertEqual(request('GET','/',{'Host':'evil.example:%d'%port})[0],403)
        self.assertEqual(request('GET','/api/state')[0],403)
        self.assertEqual(request('POST','/api/action',{'Content-Type':'application/json'},'{"action":"start"}')[0],403)
        status,data=request('POST','/api/action',{'Content-Type':'application/json','X-Simulator-Token':token},'{"action":"start"}')
        self.assertEqual(status,200);self.assertTrue(json.loads(data)['running'])

    def test_rmc_and_dead_reckoning(self):
        sys.path.insert(0,str(ROOT/'app'))
        from positions import parse_rmc
        station=dict(lat=-33.5,lon=-70.25,speed_knots=60,course_deg=90)
        fix=parse_rmc(jig.rmc(station,1800000000.5))
        self.assertAlmostEqual(fix['lat'],-33.5,6);self.assertAlmostEqual(fix['lon'],-70.25,6)
        with self.assertRaises(Exception):parse_rmc(jig.rmc(station,1800000000,corrupt=True))
        jig.advance(station,3600)  # One hour east at 60 kt = 60 nm = 1 degree of arc.
        self.assertAlmostEqual(station['lat'],-33.5,6)
        self.assertAlmostEqual(station['lon'],-70.25+1/0.8338,2)


if __name__=='__main__':unittest.main()
