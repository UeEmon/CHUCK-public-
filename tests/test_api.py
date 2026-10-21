import json
from datetime import datetime, timezone
import os
from pathlib import Path
import sys
import tempfile
import threading
import unittest
from unittest.mock import patch
import urllib.request
import urllib.error
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'))
from engine import Engine

@unittest.skipUnless(Engine().ready(),'Built VOACAP engine required')
class ApiTests(unittest.TestCase):
    def test_persistence_downloads_and_validation(self):
        with tempfile.TemporaryDirectory() as tmp:
            os.environ['DATA_DIR']=tmp
            import server
            server.DB=Path(tmp)/'test.sqlite3'
            http=server.ThreadingHTTPServer(('127.0.0.1',0),server.Handler)
            thread=threading.Thread(target=http.serve_forever,daemon=True);thread.start()
            url=f'http://127.0.0.1:{http.server_port}'
            def request(path,data=None):
                req=urllib.request.Request(url+path,data=json.dumps(data).encode() if data else None,headers={'Content-Type':'application/json'})
                return urllib.request.urlopen(req)
            try:
                p=dict(tx_lat=35.3,tx_lon=139.67,rx_lat=13.45,rx_lon=144.75,year=2026,month=10)
                r=json.load(request('/api/predict',p));self.assertEqual(len(r['hours']),24)
                self.assertEqual(json.load(request('/api/results/'+r['id']))['parameters'],r['parameters'])
                for ext in ['csv','json','raw','input']:
                    with request('/api/results/'+r['id']+'/'+ext) as response:self.assertGreater(len(response.read()),200)
                c=json.load(request('/api/coverage',dict(p,frequency_mhz=8,hour_utc=12,span=60)))
                self.assertEqual(len(c['coverage']),35)
                self.assertEqual(len(json.load(request('/api/history'))),2)
                sites=[dict(name='=RX1',lat=13.45,lon=144.75),dict(name='那覇',lat=26.21,lon=127.68,gain=3,noise=145)]
                multi={key:value for key,value in p.items() if key not in ('rx_lat','rx_lon')}
                d=json.load(request('/api/diversity',dict(multi,rx_sites=sites,independence_assumption=True)))
                self.assertEqual(len(d['diversity_hours']),24)
                self.assertEqual(d['sites'][0]['hours'],r['hours'])
                self.assertEqual(d['sites'][1]['parameters']['rx_gain'],3)
                snapshot={'ssn':{'value':87.5,'kind':'predicted','month':'2026-10','stale':False},'note':'fixture'}
                with patch.object(server.SPACE_WEATHER,'snapshot',return_value=snapshot) as snapshot_call:
                    automatic=json.load(request('/api/diversity',dict(p,rx_sites=sites,ssn_source='noaa',ssn=999)))
                self.assertEqual(snapshot_call.call_count,1)
                self.assertTrue(all(s['parameters']['ssn']==87.5 for s in automatic['sites']))
                self.assertEqual(automatic['space_weather']['ssn']['value'],87.5)
                now=datetime.now(timezone.utc)
                effective={'value':42.5,'used_count':3,'stations':[],'error':None,'note':'fixture'}
                with patch.object(server.EFFECTIVE_SSN,'snapshot',return_value=effective):
                    current=dict(p,year=now.year,month=now.month,ssn_source='effective',ssn=999)
                    e=json.load(request('/api/predict',current))
                    self.assertEqual(json.load(request(f'/api/effective-ssn?year={now.year}&month={now.month}'))['value'],42.5)
                self.assertEqual(e['parameters']['ssn'],42.5)
                self.assertEqual(e['parameters']['ssn_source'],'effective')
                self.assertEqual(e['effective_ssn']['used_count'],3)
                self.assertNotIn('space_weather',e)
                with request('/api/results/'+e['id']+'/csv') as response:self.assertIn('# effective_ssn',response.read().decode('utf-8-sig'))
                with patch.object(server.EFFECTIVE_SSN,'snapshot',return_value=dict(effective,value=None,error='不足')):
                    with self.assertRaises(urllib.error.HTTPError) as failed:request('/api/predict',current)
                self.assertEqual(failed.exception.code,503)
                from positions import PositionStore
                import sqlite3
                store=PositionStore(lambda:sqlite3.connect(Path(tmp)/'positions.sqlite3'))
                store.ingest(dict(source='native-test',positions=[
                    dict(id='plane',kind='aircraft',lat=34,lon=140.5,observed_at=datetime.now(timezone.utc).isoformat()),
                    dict(id='ship',kind='vessel',lat=13.45,lon=144.75,observed_at=datetime.now(timezone.utc).isoformat())]))
                mobile_sites=[dict(name='移動RX',position_ref=dict(source='native-test',id='ship')),sites[1]]
                with patch.object(server.POSITIONS,'snapshot',return_value=store.snapshot()):
                    mobile=json.load(request('/api/diversity',dict(p,tx_position=dict(source='native-test',id='plane'),rx_sites=mobile_sites)))
                self.assertEqual(mobile['parameters']['tx_lat'],34)
                self.assertEqual(mobile['sites'][0]['parameters']['rx_lat'],13.45)
                self.assertEqual(mobile['position_inputs']['rx_site_1']['id'],'ship')
                self.assertEqual(mobile['parameters']['rx_sites'][0]['position_ref']['id'],'ship')
                self.assertEqual(json.load(request('/api/results/'+d['id'])),d)
                self.assertEqual(json.load(request('/api/history'))[0]['kind'],'rx_diversity')
                with request('/api/results/'+d['id']+'/csv') as response:
                    csv=response.read().decode('utf-8-sig')
                    self.assertIn('union_lower_percent',csv)
                    self.assertIn("'=RX1",csv)
                nodes=[dict(name='Yokosuka',lat=35.3,lon=139.67),dict(name='=Guam',lat=13.45,lon=144.75),dict(name='那覇',lat=26.21,lon=127.68,power_w=100,noise=145)]
                m=json.load(request('/api/mesh',dict(multi,tx_lat=0,tx_lon=0,rx_sites=sites,mesh_sites=nodes)))
                self.assertEqual(m['kind'],'mesh')
                self.assertEqual(len(m['links']),6)
                link={(l['tx_id'],l['rx_id']):l for l in m['links']}
                self.assertEqual(link[('n1','n2')]['hours'],r['hours'])
                self.assertNotEqual(link[('n2','n1')]['hours'],r['hours'])
                self.assertEqual(json.load(request('/api/history'))[0]['kind'],'mesh')
                with request('/api/results/'+m['id']+'/csv') as response:
                    csv=response.read().decode('utf-8-sig')
                    self.assertIn('tx_name,rx_id',csv)
                    self.assertIn("'=Guam",csv)
                    self.assertEqual(csv.count('\n'),4+6*24*len(r['parameters']['frequencies']))
                with self.assertRaises(urllib.error.HTTPError) as e:request('/api/mesh',dict(p,mesh_sites=nodes[:1]))
                self.assertEqual(e.exception.code,400)
                for bad in [dict(p,rx_sites=sites[:1]),dict(p,rx_sites=[dict(name='bad',lat=True,lon=144),sites[1]])]:
                    with self.assertRaises(urllib.error.HTTPError) as e:request('/api/diversity',bad)
                    self.assertEqual(e.exception.code,400)
                with self.assertRaises(urllib.error.HTTPError) as e:request('/api/predict',dict(p,tx_lat=100))
                self.assertEqual(e.exception.code,400)
                with self.assertRaises(urllib.error.HTTPError) as e:request('/api/predict',dict(p,month=1.2))
                self.assertEqual(e.exception.code,400)
                server.RUN_LOCK.acquire()
                try:
                    with self.assertRaises(urllib.error.HTTPError) as e:request('/api/predict',p)
                    self.assertEqual(e.exception.code,409)
                finally:server.RUN_LOCK.release()
                req=urllib.request.Request(url+'/api/predict',data=json.dumps(p).encode(),headers={'Content-Type':'application/json','Origin':'http://other.example'})
                with self.assertRaises(urllib.error.HTTPError) as e:urllib.request.urlopen(req)
                self.assertEqual(e.exception.code,403)
                for path in ['/','/app.js','/style.css','/land.geojson']:
                    with request(path) as response:self.assertEqual(response.status,200)
                for path in ['/diversity.js','/mesh.js']:
                    with request(path) as response:self.assertEqual(response.status,200)
            finally:
                http.shutdown();http.server_close();thread.join()

if __name__=='__main__':unittest.main()
