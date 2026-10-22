import csv
import io
import json
import os
from pathlib import Path
import sys
import tempfile
import threading
import unittest
from unittest.mock import Mock, patch
import urllib.error
import urllib.request
sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'app'))
import power
from engine import validate


def fake_run(q):
    # 8 MHz reaches 50% at 200 W; 12 MHz only during 06–17 UTC from 1 kW; nothing reaches it at 0–2 UTC.
    def rel(f, h):
        if h < 3: return 10
        if f == 8: return 50 if q['power_w'] >= 200 else 20
        return 60 if 6 <= h < 18 and q['power_w'] >= 1000 else None
    return dict(parameters=q, distance_km=2500, bearing_deg=150,
                hours=[dict(hour_utc=h, muf_mhz=12, rows=[dict(frequency_mhz=f, reliability=rel(f, h), snr_db_hz=40, signal_dbw=-120)
                                                         for f in q['frequencies']]) for h in range(24)],
                input_cards='cards', raw_output='raw')


class PowerTests(unittest.TestCase):
    def setUp(self):
        self.p = validate(dict(tx_lat=35.68, tx_lon=139.69, rx_lat=13.45, rx_lon=144.75,
                               year=2026, month=10, ssn=80, frequencies=[8, 12], reliability=40, power_w=300))

    def test_every_step_runs_with_its_own_power(self):
        calls = []
        def run(q): calls.append(q);return fake_run(q)
        r = power.predict(Mock(run=run), self.p)
        self.assertEqual([q['power_w'] for q in calls], list(power.LADDER))
        self.assertTrue(all(q['frequencies'] == [8, 12] and q['ssn'] == 80 for q in calls))
        self.assertEqual(r['kind'], 'power')
        self.assertEqual(r['parameters']['power_w'], 300)
        self.assertNotIn('raw_output', json.dumps(r))
        self.assertNotIn('hours', r)  # Single-link raw/input exports must not apply.

    def test_minimum_power_per_hour_and_frequency(self):
        r = power.predict(Mock(run=fake_run), self.p)
        m = {h['hour_utc']: h for h in r['minimum']}
        self.assertEqual([v['power_w'] for v in m[12]['rows']], [200, 1000])
        self.assertEqual(m[12]['best'], dict(frequency_mhz=8, power_w=200, reliability=50))
        self.assertEqual([v['power_w'] for v in m[20]['rows']], [200, None])
        self.assertEqual(m[1]['best'], None)
        self.assertEqual([s['hours_meeting'] for s in r['steps']][:5], [0, 0, 0, 0, 21])

    def test_equal_power_prefers_higher_rel(self):
        def run(q):
            r = fake_run(q)
            for h in r['hours']: h['rows'] = [dict(v, reliability=45 if v['frequency_mhz'] == 8 else 70) for v in h['rows']]
            return r
        r = power.predict(Mock(run=run), self.p)
        self.assertEqual(r['minimum'][0]['best'], dict(frequency_mhz=12, power_w=10, reliability=70))


class PowerApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        os.environ['DATA_DIR'] = cls.tmp.name
        sys.modules.pop('server', None)
        import server
        server.DB = Path(cls.tmp.name)/'power.sqlite3'
        cls.server = server
        cls.http = server.ThreadingHTTPServer(('127.0.0.1', 0), server.Handler)
        threading.Thread(target=cls.http.serve_forever, daemon=True).start()
        cls.url = f'http://127.0.0.1:{cls.http.server_port}'

    @classmethod
    def tearDownClass(cls):
        cls.http.shutdown();cls.http.server_close();cls.tmp.cleanup()

    def request(self, path, data=None):
        req = urllib.request.Request(self.url+path, data=json.dumps(data).encode() if data is not None else None,
                                     headers={'Content-Type': 'application/json', 'Origin': self.url})
        try:
            with urllib.request.urlopen(req) as r: return r.status, r.read()
        except urllib.error.HTTPError as e: return e.code, e.read()

    def test_history_and_csv(self):
        data = dict(tx_lat=35.68, tx_lon=139.69, rx_lat=13.45, rx_lon=144.75, year=2026, month=10, ssn=80,
                    frequencies=[8, 12], reliability=40)
        with patch.object(self.server.ENGINE, 'run', side_effect=fake_run):
            status, body = self.request('/api/power', data)
        self.assertEqual(status, 200, body)
        r = json.loads(body)
        self.assertEqual(len(r['steps']), len(power.LADDER))
        self.assertEqual(json.loads(self.request('/api/history')[1])[0]['kind'], 'power')
        rows = list(csv.reader(io.StringIO(self.request(f'/api/results/{r["id"]}/csv')[1].decode('utf-8-sig'))))
        header = rows.index(['power_W', 'UTC', 'MHz', 'REL_percent', 'SNR_dBHz', 'MUF_MHz', 'meets_target', 'minimum_power_W'])
        self.assertEqual(len(rows)-header-1, len(power.LADDER)*24*2)
        self.assertEqual(rows[header+1], ['10', '0', '8.0', '10', '40', '12', 'False', ''])
        self.assertIn(['200', '12', '8.0', '50', '40', '12', 'True', '200'], rows)
        self.assertEqual(self.request(f'/api/results/{r["id"]}/raw')[0], 404)


if __name__ == '__main__':
    unittest.main()
