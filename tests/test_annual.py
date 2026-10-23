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
import annual
from engine import validate


def fake_run(q):
    # REL follows the month and SSN so a mixed-up month would be detected.
    rel = q['month']*5 + q['ssn']/10
    return dict(parameters=q, distance_km=2500, bearing_deg=150,
                hours=[dict(hour_utc=h, muf_mhz=12, rows=[dict(frequency_mhz=f, reliability=rel, snr_db_hz=40)
                                                         for f in q['frequencies']]) for h in range(24)],
                input_cards='cards', raw_output='raw')


class AnnualTests(unittest.TestCase):
    def setUp(self):
        self.p = validate(dict(tx_lat=35.68, tx_lon=139.69, rx_lat=13.45, rx_lon=144.75,
                               year=2026, month=10, ssn=80, frequencies=[8, 12]))

    def test_twelve_months_roll_into_the_next_year(self):
        self.assertEqual(annual.months(2026, 10)[:4], [(2026, 10), (2026, 11), (2026, 12), (2027, 1)])
        self.assertEqual(annual.months(2026, 10)[-1], (2027, 9))
        self.assertEqual(len(annual.months(2026, 1)), 12)
        self.assertEqual(annual.months(2026, 1)[-1], (2026, 12))

    def test_each_month_runs_with_its_own_month_and_ssn(self):
        calls = []
        def run(q): calls.append(q);return fake_run(q)
        r = annual.predict(Mock(run=run), self.p, lambda y, m: (100 if m < 6 else 50, None))
        self.assertEqual(r['kind'], 'annual')
        self.assertEqual([(q['year'], q['month'], q['ssn']) for q in calls][:4],
                         [(2026, 10, 50), (2026, 11, 50), (2026, 12, 50), (2027, 1, 100)])
        self.assertEqual(r['months'][3]['hours'][0]['rows'][0]['reliability'], 5+10)
        self.assertEqual((r['distance_km'], r['bearing_deg']), (2500, 150))
        self.assertNotIn('raw_output', json.dumps(r))
        self.assertNotIn('hours', r)  # Single-link raw/input exports must not apply.

    def test_months_without_ssn_are_kept_as_missing(self):
        r = annual.predict(Mock(run=fake_run), self.p, lambda y, m: (None, 'no data') if y == 2027 else (60, dict(kind='predicted')))
        self.assertEqual(sum(m['ssn'] is None for m in r['months']), 9)
        self.assertEqual(r['months'][5], dict(year=2027, month=3, ssn=None, missing='no data', hours=[]))
        self.assertEqual(r['months'][0]['ssn_detail'], dict(kind='predicted'))
        with self.assertRaises(ValueError):
            annual.predict(Mock(run=fake_run), self.p, lambda y, m: (None, 'no data'))


class AnnualApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        os.environ['DATA_DIR'] = cls.tmp.name
        sys.modules.pop('server', None)
        import server
        server.DB = Path(cls.tmp.name)/'annual.sqlite3'
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

    def test_manual_ssn_history_and_csv(self):
        data = dict(tx_lat=35.68, tx_lon=139.69, rx_lat=13.45, rx_lon=144.75, year=2026, month=10, ssn=80,
                    frequencies=[8, 12], reliability=40)
        with patch.object(self.server.ENGINE, 'run', side_effect=fake_run):
            status, body = self.request('/api/annual', data)
        self.assertEqual(status, 200, body)
        r = json.loads(body)
        self.assertEqual([m['ssn'] for m in r['months']], [80]*12)
        self.assertEqual(json.loads(self.request('/api/history')[1])[0]['kind'], 'annual')
        rows = list(csv.reader(io.StringIO(self.request(f'/api/results/{r["id"]}/csv')[1].decode('utf-8-sig'))))
        header = rows.index(['year', 'month', 'SSN', 'UTC', 'MHz', 'REL_percent', 'SNR_dBHz', 'S_dBW', 'TOA_deg', 'MUF_MHz', 'meets_target'])
        self.assertEqual(len(rows)-header-1, 12*24*2)
        self.assertEqual(rows[header+1][:6], ['2026', '10', '80.0', '0', '8.0', '58.0'])
        self.assertEqual(rows[header+1][-1], 'True')
        self.assertEqual(self.request(f'/api/results/{r["id"]}/raw')[0], 404)

    def test_effective_ssn_is_refused(self):
        data = dict(tx_lat=35.68, tx_lon=139.69, rx_lat=13.45, rx_lon=144.75, year=2026, month=10, ssn_source='effective')
        status, body = self.request('/api/annual', data)
        self.assertEqual(status, 400)
        self.assertIn('実効SSN', json.loads(body)['error'])

    def test_noaa_ssn_is_looked_up_per_month(self):
        def snapshot(year, month, force=False):
            ssn = None if (year, month) == (2027, 2) else dict(value=year-2000+month, month=f'{year}-{month:02d}', kind='predicted', stale=False)
            return dict(ssn=ssn)
        data = dict(tx_lat=35.68, tx_lon=139.69, rx_lat=13.45, rx_lon=144.75, year=2026, month=10, ssn_source='noaa', frequencies=[8])
        with patch.object(self.server.ENGINE, 'run', side_effect=fake_run), \
             patch.object(self.server.SPACE_WEATHER, 'calculation_input', side_effect=lambda d: (dict(d, ssn=36), None)), \
             patch.object(self.server.SPACE_WEATHER, 'snapshot', side_effect=snapshot):
            status, body = self.request('/api/annual', data)
        self.assertEqual(status, 200, body)
        months = json.loads(body)['months']
        self.assertEqual(months[0]['ssn'], 25.2)
        self.assertEqual(months[0]['ssn_detail'], dict(kind='predicted', month='2026-10', published=36, scale=0.7))
        self.assertEqual(months[4]['ssn'], None)
        self.assertEqual(months[3]['ssn'], 19.6)


if __name__ == '__main__':
    unittest.main()
