from datetime import datetime, timezone
import copy
import json
from pathlib import Path
import sqlite3
import subprocess
import sys
import tempfile
import threading
import time
import unittest
from unittest.mock import patch
from urllib.request import Request, urlopen
from urllib.error import HTTPError
sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'app'))
from positions import PositionStore, normalize, parse_heading, parse_rmc
from engine import InputError


def report(now, **kw):
    return dict(source='gateway', positions=[dict(id='ship-1', kind='vessel', name='試験船', lat=0, lon=139.123456,
                 observed_at=datetime.fromtimestamp(now, timezone.utc).isoformat(), **kw)])


def rmc(now, status='A', mode='A', lat='3500.0000', hemisphere='N'):
    dt = datetime.fromtimestamp(now,timezone.utc)
    body = f'GNRMC,{dt:%H%M%S},{status},{lat},{hemisphere},13930.0000,E,10.0,90.0,{dt:%d%m%y},,,{mode}'
    checksum = 0
    for char in body: checksum ^= ord(char)
    return '$'+body+'*'+format(checksum,'02X')+'\r\n'


def nmea(body):
    checksum = 0
    for char in body: checksum ^= ord(char)
    return '$'+body+'*'+format(checksum,'02X')+'\r\n'


class PositionTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.db = Path(self.tmp.name)/'positions.sqlite3'
        self.store = PositionStore(lambda: sqlite3.connect(self.db), 300)
        self.now = 1800000000

    def test_latest_identity_persistence_and_expiry(self):
        p = report(self.now)
        self.assertEqual(self.store.ingest(p, self.now)['accepted'], 1)
        for stamp in (self.now-1, self.now):
            q = report(stamp);q['positions'][0]['lat'] = 40
            self.assertEqual(self.store.ingest(q, self.now)['ignored_old_or_equal'], 1)
        other = dict(p, source='other');self.store.ingest(other, self.now)
        restored = PositionStore(lambda: sqlite3.connect(self.db))
        rows = restored.snapshot(self.now+301)['positions']
        self.assertEqual(len(rows), 2);self.assertEqual(rows[0]['lat'], 0)
        self.assertTrue(all(r['stale'] for r in rows))

    def test_invalid_fields_and_atomic_batch(self):
        self.store.ingest(report(self.now), self.now)
        for field, value in [('lat', True), ('lon', float('nan')), ('lat', 10**500), ('kind', 'unknown'), ('course_deg', 360), ('speed_knots', -1), ('name', '<bad\n>'), ('observed_at', '2026-10-15T12:00:00')]:
            q = report(self.now);q['positions'][0][field] = value
            with self.subTest(field=field), self.assertRaises(InputError): self.store.ingest(q, self.now)
        q = report(self.now);q['positions'].append(dict(q['positions'][0], id='second', lat=99))
        with self.assertRaises(InputError): self.store.ingest(q, self.now)
        self.assertEqual(len(self.store.snapshot(self.now)['positions']), 1)
        for stamp in (self.now-86401, self.now+61):
            with self.assertRaises(InputError): self.store.ingest(report(stamp), self.now)
        q = report(self.now);q['positions'] *= 2
        with self.assertRaises(InputError): self.store.ingest(q, self.now)

    def test_geojson_coordinate_order_and_metadata(self):
        properties = report(self.now)['positions'][0]
        q = dict(source='adsb', type='FeatureCollection', features=[dict(type='Feature', properties=dict(properties,kind='aircraft'), geometry=dict(type='Point', coordinates=[-120, 35, 1000]))])
        self.store.ingest(q, self.now)
        p = self.store.snapshot(self.now)['positions'][0]
        self.assertEqual((p['lon'], p['lat'], p['altitude_m']), (-120, 35, 1000))
        self.assertEqual(p['altitude_reference'], 'wgs84_ellipsoid')
        q['features'][0]['geometry']['type'] = 'LineString'
        with self.assertRaises(InputError): self.store.ingest(q, self.now)

    def test_resolution_snapshot_and_missing_or_stale_ref(self):
        self.store.ingest(report(self.now), self.now)
        original = dict(tx_lat=45, tx_lon=130, tx_position=dict(source='gateway', id='ship-1'),
                        rx_sites=[dict(name='A',position_ref=dict(source='gateway',id='ship-1'))])
        before = copy.deepcopy(original)
        data, inputs = self.store.apply(original, self.now)
        self.assertEqual(data['tx_lat'], 0)
        self.assertEqual(data['rx_sites'][0]['lon'], 139.123456)
        self.assertEqual(inputs['tx']['observed_at'], report(self.now)['positions'][0]['observed_at'])
        self.assertEqual(original, before)
        with self.assertRaises(InputError): self.store.apply(original, self.now+301)
        with self.assertRaises(InputError): self.store.apply(dict(rx_position=dict(source='none',id='absent')), self.now)
        pole = report(self.now+1);pole['positions'][0]['lat']=90
        self.store.ingest(pole,self.now+1)
        self.assertFalse(self.store.snapshot(self.now+1)['positions'][0]['prediction_compatible'])
        with self.assertRaises(InputError): self.store.apply(original,self.now+1)

    def test_capacity_rollback(self):
        # Populate the cap directly, then verify an attempted extra row rolls back.
        with self.store.connect() as c:
            c.executemany('INSERT INTO positions VALUES (?,?,?,?,?)', [('x',str(i),self.now,self.now,'{}') for i in range(2000)])
        with self.assertRaises(InputError): self.store.ingest(report(self.now), self.now)
        with self.store.connect() as c: self.assertEqual(c.execute('SELECT COUNT(*) FROM positions').fetchone()[0], 2000)

    def test_station_protocol_selection_and_change_invalidates_old_fix(self):
        self.store.ingest(report(self.now), self.now)
        station = dict(source='gateway',id='ship-1',kind='vessel',name='試験船',protocol='nmea0183')
        self.store.configure(station)
        self.assertEqual(self.store.snapshot(self.now)['positions'], [])
        with self.assertRaises(InputError): self.store.ingest(report(self.now),self.now)
        self.store.ingest_nmea('gateway','ship-1',rmc(self.now),self.now)
        p = self.store.snapshot(self.now)['positions'][0]
        self.assertEqual((p['lat'],p['lon'],p['protocol']), (35,139.5,'nmea0183'))
        self.store.configure(dict(station,enabled=False))
        with self.assertRaises(InputError): self.store.ingest_nmea('gateway','ship-1',rmc(self.now),self.now)
        self.assertEqual(self.store.snapshot(self.now)['positions'], [])

    def test_rmc_checksum_quality_and_hemispheres(self):
        self.assertEqual(parse_rmc(rmc(self.now,hemisphere='S'))['lat'],-35)
        for sentence in [rmc(self.now,status='V'),rmc(self.now,mode='N'),rmc(self.now,lat='3560.00'),rmc(self.now).split('*')[0]+'*00',rmc(self.now)+rmc(self.now)]:
            with self.subTest(sentence=sentence), self.assertRaises(InputError): parse_rmc(sentence)

    def test_independent_protocols_per_station_and_atomic_mismatch(self):
        self.store.configure(dict(source='gateway',id='geo',kind='vehicle',protocol='geojson'))
        self.store.ingest(report(self.now),self.now)
        geo = dict(type='FeatureCollection',source='gateway',features=[dict(type='Feature',geometry=dict(type='Point',coordinates=[140,36]),properties=dict(id='geo',kind='vehicle',observed_at=report(self.now)['positions'][0]['observed_at']))])
        self.store.ingest(geo,self.now)
        self.assertEqual({s['protocol'] for s in self.store.snapshot(self.now)['stations']}, {'json','geojson'})
        bad = report(self.now+1);bad['positions'][0]['lat']=45
        bad['positions'].append(dict(geo['features'][0]['properties'],lat=36,lon=140))
        with self.assertRaises(InputError): self.store.ingest(bad,self.now+1)
        ship = next(p for p in self.store.snapshot(self.now)['positions'] if p['id']=='ship-1')
        self.assertEqual(ship['lat'],0)

    def test_heading_sentences_are_true_headings(self):
        self.assertEqual(parse_heading(nmea('HEHDT,274.5,T')), dict(heading_deg=274.5, heading_sentence='HDT'))
        self.assertEqual(parse_heading(nmea('GPTHS,12.0,A'))['heading_deg'], 12.0)
        self.assertEqual(parse_heading(nmea('HEHDT,360.0,T'))['heading_deg'], 0)
        # Magnetic sensor 101.2 + deviation 1.5E + variation 7.3W = true 95.4.
        self.assertAlmostEqual(parse_heading(nmea('HCHDG,101.2,1.5,E,7.3,W'))['heading_deg'], 95.4)
        self.assertEqual(parse_heading(nmea('HCHDG,355.0,,,8.0,E'))['heading_deg'], 3.0)
        for sentence in [nmea('HCHDG,101.2,,,,'), nmea('HCHDG,101.2,1.5,E,,'), nmea('HCHDG,101.2,,,7.3,X'), nmea('HEHDT,,T'), nmea('HEHDT,361,T'),
                         nmea('HEHDT,90,M'), nmea('GPTHS,90.0,E'), nmea('GPTHS,90.0,V'), nmea('HEHDT,90.0,T').split('*')[0]+'*00', rmc(self.now)]:
            with self.subTest(sentence=sentence), self.assertRaises(InputError): parse_heading(sentence)

    def test_nmea_heading_is_attached_while_fresh_and_used_for_antennas(self):
        station = dict(source='gateway',id='ship-1',kind='vessel',name='試験船',protocol='nmea0183')
        self.store.configure(station)
        self.assertEqual(self.store.ingest_nmea('gateway','ship-1',nmea('HEHDT,80.0,T'),self.now-100)['headings'], 1)
        self.store.ingest_nmea('gateway','ship-1',rmc(self.now),self.now)
        p = self.store.snapshot(self.now)['positions'][0]
        self.assertEqual((p['course_deg'],p['heading_deg'],p['heading_source']), (90.0,80.0,'HDT'))
        query = dict(tx_position=dict(source='gateway',id='ship-1'),rx_sites=[dict(position_ref=dict(source='gateway',id='ship-1'))])
        data, inputs = self.store.apply(query, self.now)
        self.assertEqual((data['tx_course_deg'],data['rx_sites'][0]['course_deg'],inputs['tx']['heading_deg']), (80.0,80.0,80.0))
        # A heading older than the position TTL is dropped and the course over ground is used again.
        later = self.now+250
        self.store.ingest_nmea('gateway','ship-1',rmc(later),later)
        p = self.store.snapshot(later)['positions'][0]
        self.assertIsNone(p['heading_deg']);self.assertIsNone(p['heading_source'])
        self.assertEqual(self.store.apply(query, later)[0]['tx_course_deg'], 90.0)
        self.store.ingest_nmea('gateway','ship-1',nmea('HCHDG,90.0,,,7.0,W'),later)
        self.assertEqual(self.store.apply(query, later)[0]['tx_course_deg'], 83.0)
        # Disabling the station forgets the heading as well as the fix.
        self.store.configure(dict(station,enabled=False))
        with self.assertRaises(InputError): self.store.ingest_nmea('gateway','ship-1',nmea('HEHDT,80.0,T'),later)
        self.store.configure(station)
        self.store.ingest_nmea('gateway','ship-1',rmc(later+1),later+1)
        self.assertIsNone(self.store.snapshot(later+1)['positions'][0]['heading_deg'])

    def test_json_heading_travels_with_the_position(self):
        self.store.ingest(report(self.now, course_deg=10, heading_deg=355.5), self.now)
        p = self.store.snapshot(self.now)['positions'][0]
        self.assertEqual((p['heading_deg'],p['heading_source'],p['heading_at']), (355.5,'json',p['observed_at']))
        self.assertEqual(self.store.apply(dict(tx_position=dict(source='gateway',id='ship-1')), self.now)[0]['tx_course_deg'], 355.5)
        self.store.ingest(report(self.now+1, course_deg=10), self.now+1)
        p = self.store.snapshot(self.now+1)['positions'][0]
        self.assertIsNone(p['heading_deg'])
        self.assertEqual(self.store.apply(dict(tx_position=dict(source='gateway',id='ship-1')), self.now+1)[0]['tx_course_deg'], 10)
        for value in (360, -1, True, 'north'):
            with self.subTest(value=value), self.assertRaises(InputError): self.store.ingest(report(self.now+2, heading_deg=value), self.now+2)


class PositionHttpTests(unittest.TestCase):
    def test_auth_input_and_predictions_use_snapshot(self):
        import os
        import server
        import gateway_server
        from gateway_client import GatewayClient
        with tempfile.TemporaryDirectory() as tmp, patch.object(server, 'DB', Path(tmp)/'api.sqlite3'), patch.object(gateway_server,'DB',Path(tmp)/'gateway.sqlite3'), patch.dict(os.environ, {'HF_POSITION_INGEST_TOKEN':'s'*40,'HF_POSITION_GATEWAY_TOKEN':'c'*40}):
            gateway=gateway_server.ThreadingHTTPServer(('127.0.0.1',0),gateway_server.Handler)
            gateway_thread=threading.Thread(target=gateway.serve_forever,daemon=True);gateway_thread.start()
            gateway_base='http://127.0.0.1:'+str(gateway.server_port)
            client=patch.object(server,'POSITIONS',GatewayClient(gateway_base,'c'*40));client.start()
            http = server.ThreadingHTTPServer(('127.0.0.1', 0), server.Handler)
            thread = threading.Thread(target=http.serve_forever, daemon=True);thread.start()
            base = 'http://127.0.0.1:'+str(http.server_port)
            def request(path, payload=None, auth=True, **headers):
                h = {'Content-Type':'application/json', **headers}
                if auth: h['Authorization'] = 'Bearer '+('c' if path=='/api/position-stations' else 's')*40
                target=gateway_base if path.startswith('/api/positions') and payload is not None else base
                return urlopen(Request(target+path, data=json.dumps(payload).encode() if payload is not None else None, headers=h))
            try:
                p = report(time.time())
                with self.assertRaises(HTTPError) as e: request('/api/positions', p, False)
                self.assertEqual(e.exception.code, 401)
                with request('/api/positions', p) as r: self.assertEqual(json.load(r)['accepted'], 1)
                sample=Path(tmp)/'sample.json';sample.write_text(json.dumps(dict(p,source='sender-test')))
                completed=subprocess.run([sys.executable,str(Path(__file__).resolve().parents[1]/'scripts/send_positions.py'),str(sample),'--url',gateway_base+'/api/positions'],capture_output=True,text=True)
                self.assertEqual(completed.returncode,0,completed.stderr)
                self.assertEqual(json.loads(completed.stdout)['accepted'],1)
                with request('/api/positions') as r: self.assertEqual(len(json.load(r)['positions']), 2)
                with self.assertRaises(HTTPError) as e:
                    urlopen(Request(gateway_base+'/internal/v1/positions',headers={'Authorization':'Bearer '+'s'*40}))
                self.assertEqual(e.exception.code,401)
                with self.assertRaises(HTTPError) as e:
                    urlopen(Request(base+'/api/positions',data=json.dumps(p).encode(),headers={'Content-Type':'application/json'}))
                self.assertEqual(e.exception.code,410)
                with self.assertRaises(HTTPError) as e:
                    urlopen(Request(gateway_base+'/api/positions',headers={'Authorization':'Bearer '+'c'*40}))
                self.assertEqual(e.exception.code,410)
                with self.assertRaises(HTTPError) as e:
                    urlopen(Request(gateway_base+'/api/position-stations',data=b'{}',headers={'Authorization':'Bearer '+'c'*40,'Content-Type':'application/json'}))
                self.assertEqual(e.exception.code,410)
                station=dict(source='gps',id='car-1',kind='vehicle',name='試験車',protocol='nmea0183')
                with request('/api/position-stations',station,Origin=base) as r: self.assertEqual(json.load(r)['protocol'],'nmea0183')
                req=Request(gateway_base+'/api/positions/nmea?source=gps&id=car-1',data=rmc(time.time()).encode(),headers={'Authorization':'Bearer '+'s'*40,'Content-Type':'text/plain'})
                with urlopen(req) as r: self.assertEqual(json.load(r)['accepted'],1)
                nmea_file=Path(tmp)/'position.nmea';nmea_file.write_text(rmc(time.time()))
                completed=subprocess.run([sys.executable,str(Path(__file__).resolve().parents[1]/'scripts/send_positions.py'),str(nmea_file),'--url',gateway_base+'/api/positions','--protocol','nmea0183','--source','gps','--station-id','car-1'],capture_output=True,text=True)
                self.assertEqual(completed.returncode,0,completed.stderr)
                with self.assertRaises(HTTPError) as e: request('/api/position-stations',station,False)
                self.assertEqual(e.exception.code,403)
                with self.assertRaises(HTTPError) as e: request('/api/positions',p,**{'Content-Type':'text/plain'})
                self.assertEqual(e.exception.code,415)
                with self.assertRaises(HTTPError) as e: request('/api/positions', p, Origin='http://other.example')
                self.assertEqual(e.exception.code, 403)
                with patch.dict(os.environ, {'HF_POSITION_INGEST_TOKEN':''}):
                    with self.assertRaises(HTTPError) as e: request('/api/positions', p)
                    self.assertEqual(e.exception.code, 503)
                payload = dict(tx_position=dict(source='gateway',id='ship-1'), tx_lat=88, tx_lon=0,
                               rx_lat=35.3,rx_lon=139.67,year=2026,month=10)
                with patch.object(server.ENGINE, 'run', side_effect=lambda q:dict(parameters=q,engine='test',engine_commit='test',hours=[])):
                    with request('/api/predict', payload) as r: result = json.load(r)
                    self.assertEqual(result['parameters']['tx_lat'], 0)
                    self.assertEqual(result['position_inputs']['tx']['id'], 'ship-1')
                    with request('/api/results/'+result['id']+'/csv') as r: self.assertIn('# position_inputs',r.read().decode('utf-8-sig'))
                    with request('/api/results/'+result['id']) as r: self.assertEqual(json.load(r)['position_inputs'],result['position_inputs'])
                    payload['tx_position']['id'] = 'missing'
                    with self.assertRaises(HTTPError) as e: request('/api/predict', payload)
                    self.assertEqual(e.exception.code, 400)
                for path in ['/positions.js']:
                    with request(path) as r: self.assertEqual(r.status, 200)
                with self.assertRaises(HTTPError) as e:
                    urlopen(Request(gateway_base+'/api/positions',data=json.dumps(p).encode(),headers={'Authorization':'Bearer '+'c'*40,'Content-Type':'application/json'}))
                self.assertEqual(e.exception.code,401)
                with self.assertRaises(HTTPError) as e:
                    urlopen(Request(gateway_base+'/internal/v1/stations',data=json.dumps(station).encode(),headers={'Authorization':'Bearer '+'s'*40,'Content-Type':'application/json'}))
                self.assertEqual(e.exception.code,401)
                # The normal native test run exercises the complete gateway ->
                # app -> real engine chain as well as the mock-engine cases.
                payload['tx_position']['id']='ship-1'
                if server.ENGINE.ready():
                    with request('/api/predict',dict(payload,frequencies=[8])) as r:
                        self.assertEqual(len(json.load(r)['hours']),24)
                with patch.object(server,'POSITIONS',GatewayClient('http://127.0.0.1:1','c'*40)), patch.object(server.ENGINE,'run',side_effect=lambda q:dict(parameters=q,engine='test',engine_commit='test',hours=[])):
                    with self.assertRaises(HTTPError) as e: request('/api/positions')
                    self.assertEqual(e.exception.code,503)
                    with self.assertRaises(HTTPError) as e: request('/api/predict',payload)
                    self.assertEqual(e.exception.code,503)
                    fixed={k:v for k,v in payload.items() if k!='tx_position'}
                    with request('/api/predict',fixed) as r: self.assertEqual(r.status,200)
            finally:
                http.shutdown();http.server_close();thread.join()
                client.stop();gateway.shutdown();gateway.server_close();gateway_thread.join()


if __name__ == '__main__': unittest.main()
