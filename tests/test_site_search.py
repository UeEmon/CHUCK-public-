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
import site_search
from engine import InputError, validate

GUAM, MANILA, SYDNEY = (13.45, 144.75), (14.6, 120.98), (-33.87, 151.21)


def fake_run(q):
    # REL by receiver latitude: Guam 90 by day, Manila 60 all day, Sydney 30; a transmitter at Manila halves it.
    rel = {13: 90, 14: 60, -33: 30}[int(q['rx_lat'])]
    if int(q['tx_lat']) == 14: rel //= 2
    hours = [dict(hour_utc=h, muf_mhz=12, rows=[dict(frequency_mhz=f, reliability=(rel if 6 <= h < 18 or rel != 90 else 10) - (f > 10), snr_db_hz=40)
                                               for f in q['frequencies']]) for h in range(24)]
    return dict(parameters=q, distance_km=2500, bearing_deg=150, hours=hours, input_cards='cards', raw_output='raw')


class SiteSearchTests(unittest.TestCase):
    def setUp(self):
        self.p = validate(dict(tx_lat=35.68, tx_lon=139.69, rx_lat=SYDNEY[0], rx_lon=SYDNEY[1],
                               year=2026, month=10, ssn=80, frequencies=[8, 12], reliability=50))

    def candidates(self, *places):
        return [dict(id=f'c{i}', name=f'site {i}', lat=a, lon=b) for i, (a, b) in enumerate(places)]

    def test_receive_sites_are_ranked_by_hours_then_mean(self):
        calls = []
        def run(q): calls.append(q);return fake_run(q)
        r = site_search.predict(Mock(run=run), self.p, self.candidates(GUAM, MANILA, SYDNEY), 'receive')
        self.assertEqual(len(calls), 3)
        self.assertTrue(all((q['tx_lat'], q['tx_antenna']) == (35.68, self.p['tx_antenna']) for q in calls))
        self.assertEqual([(c['name'], c['rank'], c['hours_meeting']) for c in r['candidates']],
                         [('site 1', 1, 24), ('site 0', 2, 12), ('site 2', 3, 0)])
        self.assertEqual(r['candidates'][0]['hours'][0], dict(hour_utc=0, reliability=60, frequencies=[8]))
        self.assertEqual(r['candidates'][1]['mean_reliability'], 50.0)
        self.assertNotIn('raw_output', json.dumps(r))

    def test_relay_needs_both_legs_in_the_same_hour(self):
        calls = []
        def run(q): calls.append(q);return fake_run(q)
        r = site_search.predict(Mock(run=run), self.p, self.candidates(MANILA), 'relay')
        self.assertEqual([(q['tx_lat'], q['rx_lat']) for q in calls], [(35.68, 14.6), (14.6, SYDNEY[0])])
        c = r['candidates'][0]
        self.assertEqual(c['hours'][0], dict(hour_utc=0, reliability=15, frequencies=[8, 8]))
        self.assertEqual((c['hours_meeting'], c['rank']), (0, 1))
        self.assertIn('distance_rx_km', c)

    def test_candidates_at_an_endpoint_are_skipped(self):
        r = site_search.predict(Mock(run=fake_run), self.p, self.candidates(SYDNEY, GUAM), 'relay')
        self.assertEqual(r['candidates'][0]['name'], 'site 1')
        self.assertEqual((r['candidates'][1]['rank'], r['candidates'][1]['hours']), (None, []))
        self.assertIn('skipped', r['candidates'][1])

    def test_prepare_checks_the_request(self):
        rows, mode = site_search.prepare(dict(candidates=[dict(id='a', name=' A ', lat=1, lon=2)], site_mode='relay'))
        self.assertEqual((rows, mode), ([dict(id='a', name='A', lat=1.0, lon=2.0)], 'relay'))
        for bad in [dict(candidates=[]), dict(candidates=[dict(name='A', lat=1, lon=2)]*11),
                    dict(candidates=[dict(name='', lat=1, lon=2)]), dict(candidates=[dict(name='A', lat=95, lon=2)]),
                    dict(candidates=[dict(name='A', lat=True, lon=2)]), dict(candidates=[dict(name='A', lat=1, lon=2)], site_mode='x')]:
            with self.assertRaises(InputError): site_search.prepare(bad)


class SiteSearchApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        os.environ['DATA_DIR'] = cls.tmp.name
        sys.modules.pop('server', None)
        import server
        server.DB = Path(cls.tmp.name)/'sites.sqlite3'
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
        data = dict(tx_lat=35.68, tx_lon=139.69, rx_lat=SYDNEY[0], rx_lon=SYDNEY[1], year=2026, month=10, ssn=80,
                    frequencies=[8], reliability=50, site_mode='receive',
                    candidates=[dict(id='g', name='=Guam', lat=GUAM[0], lon=GUAM[1]), dict(id='m', name='Manila', lat=MANILA[0], lon=MANILA[1])])
        with patch.object(self.server.ENGINE, 'run', side_effect=fake_run):
            status, body = self.request('/api/sites', data)
        self.assertEqual(status, 200, body)
        r = json.loads(body)
        self.assertEqual([c['name'] for c in r['candidates']], ['Manila', '=Guam'])
        self.assertEqual(json.loads(self.request('/api/history')[1])[0]['kind'], 'sites')
        rows = list(csv.reader(io.StringIO(self.request(f'/api/results/{r["id"]}/csv')[1].decode('utf-8-sig'))))
        header = rows.index(['rank', 'name', 'lat', 'lon', 'distance_tx_km', 'distance_rx_km', 'hours_meeting', 'mean_REL_percent', 'UTC', 'REL_percent', 'leg1_MHz', 'leg2_MHz', 'meets_target'])
        self.assertEqual(len(rows)-header-1, 48)
        self.assertEqual(rows[header+1][:2], ['1', 'Manila'])
        self.assertEqual(rows[header+25][1], "'=Guam")
        self.assertEqual(self.request('/api/sites', dict(data, candidates=[]))[0], 400)


if __name__ == '__main__':
    unittest.main()
