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
                req=urllib.request.Request(url+path,data=json.dumps(data).encode() if data is not None else None,headers={'Content-Type':'application/json'})
                return urllib.request.urlopen(req)
            try:
                p=dict(tx_lat=35.3,tx_lon=139.67,rx_lat=13.45,rx_lon=144.75,year=2026,month=10)
                r=json.load(request('/api/predict',p));self.assertEqual(len(r['hours']),24)
                self.assertEqual(json.load(request('/api/results/'+r['id']))['parameters'],r['parameters'])
                for ext in ['csv','json','raw','input']:
                    with request('/api/results/'+r['id']+'/'+ext) as response:self.assertGreater(len(response.read()),200)
                c=json.load(request('/api/coverage',dict(p,frequency_mhz=8,hour_utc=12)))
                # One VOACAP area run over the whole world by default; a span is centred on the TX.
                self.assertEqual((c['center_lat'],c['center_lon'],c['span'],c['area']['size']),(35.3,139.67,360,181))
                self.assertEqual(len(c['area']['signal_dbw']),181);self.assertEqual(len(c['area']['reliability'][0]),181)
                with request('/api/results/'+c['id']+'/csv') as response:self.assertEqual(sum(l[:1] in '-0123456789' for l in response.read().decode().splitlines()),181*181)
                c=json.load(request('/api/coverage',dict(p,frequency_mhz=8,hour_utc=12,span=60)))
                self.assertEqual((c['area']['size'],c['area']['lon_min'],c['area']['lon_max'],c['area']['lat_min'],c['area']['lat_max']),(121,109.7,169.7,5.3,65.3))
                with self.assertRaises(urllib.error.HTTPError):request('/api/coverage',dict(p,span=45))
                # The matrix keeps one byte per grid value; each cell decodes to the same map as a single run.
                m=json.load(request('/api/coverage-matrix',dict(p,frequencies=[7,10],span=30)))
                self.assertEqual((m['matrix']['frequencies'],m['matrix']['hours'],m['matrix']['size']),([7,10],list(range(24)),61))
                self.assertEqual((len(m['matrix']['covered_percent']),len(m['matrix']['covered_percent'][1]),len(m['matrix']['cells'][1])),(2,24,24))
                single=server.ENGINE.area(m['parameters'],13,10,(m['matrix']['lon_min'],m['matrix']['lon_max'],m['matrix']['lat_min'],m['matrix']['lat_max']),61)['grid']
                packed=server.pack_area(single)
                self.assertEqual(m['matrix']['cells'][1][13],packed)
                self.assertEqual(m['matrix']['covered_percent'][1][13],server.covered_percent(single,m['parameters']['reliability']))
                with request('/api/results/'+m['id']+'/csv') as response:self.assertEqual(sum(l[:1].isdigit() for l in response.read().decode().splitlines()),48)
                # A job token reports progress while the request runs and can stop it; it is gone afterwards.
                token='t'*20;seen=[];result={}
                def run():
                    try:request('/api/coverage-matrix',dict(p,frequencies=[7,10,14],span=30,job=token))
                    except urllib.error.HTTPError as e:result.update(code=e.code,body=json.load(e))
                worker=threading.Thread(target=run);worker.start()
                while worker.is_alive() and not seen:
                    try:seen.append(json.load(request('/api/jobs/'+token)))
                    except urllib.error.HTTPError:pass
                self.assertEqual(seen[0]['total'],12)
                self.assertTrue(json.load(request('/api/jobs/'+token+'/cancel',{}))['cancelled'])
                worker.join(30)
                self.assertEqual((result['code'],result['body']['cancelled']),(409,True))
                with self.assertRaises(urllib.error.HTTPError) as gone:request('/api/jobs/'+token)
                self.assertEqual(gone.exception.code,404)
                self.assertFalse(json.load(request('/api/jobs/'+token+'/cancel',{}))['cancelled'])
                self.assertEqual(len(json.load(request('/api/history'))),4)
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
                self.assertTrue(all(s['parameters']['ssn']==61.2 for s in automatic['sites']))
                self.assertEqual((automatic['space_weather']['ssn']['value'],automatic['space_weather']['ssn']['engine_value'],automatic['space_weather']['ssn']['scale']),(87.5,61.2,0.7))
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


class AreaPackingTests(unittest.TestCase):
    def test_bytes_and_covered_share(self):
        import server
        grid=dict(size=2,lon_min=0,lon_max=10,lat_min=0,lat_max=60,signal_dbw=[[-100.4,None],[-300,5]],snr_db_hz=[[-120,40.6],[None,200]],reliability=[[95,50],[None,90]])
        packed={k:list(__import__('base64').b64decode(v)) for k,v in server.pack_area(grid).items()}
        self.assertEqual(packed,{'signal_dbw':[100,255,254,0],'snr_db_hz':[0,141,255,254],'reliability':[95,50,255,90]})
        # Row at 60° weighs cos 60° = 0.5 of the equator row: (1+0.5)/(2+1) of the area meets 90 %.
        self.assertEqual(server.covered_percent(grid,90),50.0)
