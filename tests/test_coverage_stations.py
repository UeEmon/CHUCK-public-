import base64
import json
import os
from pathlib import Path
import sys
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'app'))
import coverage_stations as cs
from engine import Engine, InputError


class CombineTests(unittest.TestCase):
    def test_best_station_gap_and_area_shares(self):
        # Two rows on the equator (equal weights), two columns: 4 cells.
        n = 2; weights = [1., 1.]
        a = (bytes([90, 90, 10, cs.NONE]), bytes([150, 140, 120, cs.NONE]))
        b = (bytes([90, 30, 80, cs.NONE]), bytes([160, 120, 140, cs.NONE]))
        packed, area, _ = cs.combine([a, b], 50, weights, n)
        # Same REL: the higher SNR wins; no value anywhere stays empty.
        self.assertEqual(list(packed['station']), [1, 0, 1, cs.NONE])
        self.assertEqual(list(packed['reliability']), [90, 90, 80, cs.NONE])
        self.assertEqual(area['covered'], 75.0)
        self.assertEqual(area['stations'][0], dict(alone=50.0, best=25.0, only=25.0))
        self.assertEqual(area['stations'][1], dict(alone=50.0, best=50.0, only=25.0))

    def test_ties_go_to_the_earlier_station(self):
        same = (bytes([70]), bytes([130]))
        packed, area, _ = cs.combine([same, same, same], 50, [1.], 1)
        self.assertEqual(list(packed['station']), [0])
        self.assertEqual([s['best'] for s in area['stations']], [100.0, 0.0, 0.0])
        self.assertEqual([s['only'] for s in area['stations']], [0.0, 0.0, 0.0])

    def test_below_target_is_a_gap_but_keeps_its_best_station(self):
        packed, area, _ = cs.combine([(bytes([20]), bytes([100])), (bytes([40]), bytes([100]))], 50, [1.], 1)
        self.assertEqual((list(packed['station']), list(packed['reliability'])), ([1], [40]))
        self.assertEqual((area['covered'], area['stations'][1]['best']), (0.0, 0.0))

    def test_prepare_and_centre(self):
        stations = cs.prepare(dict(stations=[dict(id='a', name=' Guam ', lat=13.45, lon=144.75)]))
        self.assertEqual(stations, [dict(id='a', name='Guam', lat=13.45, lon=144.75)])
        for bad in ([], [dict(name='x', lat=0, lon=0)]*4, [dict(name='', lat=0, lon=0)], [dict(name='x', lat=95, lon=0)], [dict(name='x', lat=True, lon=0)], 'x'):
            with self.assertRaises(InputError): cs.prepare(dict(stations=bad))
        # Stations either side of 180° are centred near 180°, not at 0°.
        lat, lon = cs.center([dict(lat=10, lon=170), dict(lat=20, lon=-170)])
        self.assertEqual((lat, abs(lon)), (15.0, 180.0))
        with self.assertRaises(InputError): cs.check_apart([dict(name='TX', lat=0, lon=0), dict(name='A', lat=0, lon=0.001)], (10, 10))
        with self.assertRaises(InputError): cs.check_apart([dict(name='TX', lat=0, lon=0), dict(name='A', lat=10, lon=10)], (10, 10))


@unittest.skipUnless(Engine().ready(), 'Built VOACAP engine required')
class ApiTests(unittest.TestCase):
    def test_stations_share_one_grid_and_match_single_runs(self):
        with tempfile.TemporaryDirectory() as tmp:
            os.environ['DATA_DIR'] = tmp
            import server
            server.DB = Path(tmp)/'test.sqlite3'
            http = server.ThreadingHTTPServer(('127.0.0.1', 0), server.Handler)
            threading.Thread(target=http.serve_forever, daemon=True).start()
            url = f'http://127.0.0.1:{http.server_port}'
            def request(path, data=None):
                req = urllib.request.Request(url+path, data=json.dumps(data).encode() if data is not None else None, headers={'Content-Type': 'application/json'})
                return urllib.request.urlopen(req)
            try:
                p = dict(tx_lat=35.3, tx_lon=139.67, rx_lat=13.45, rx_lon=144.75, year=2026, month=10, frequencies=[7, 10], span=30,
                         tx_name='Yokosuka', tx_id='tx-1', stations=[dict(id='m', name='Manila', lat=14.6, lon=120.98)])
                r = json.load(request('/api/coverage-stations', p))
                m = r['matrix']
                self.assertEqual(([s['name'] for s in r['stations']], r['stations'][0]['id'], m['size'], len(m['cells']), len(m['cells'][0]), len(m['best']['cells'])),
                                 (['Yokosuka', 'Manila'], 'tx-1', 61, 2, 24, 24))
                # The grid is centred between the stations.
                self.assertEqual((r['center_lat'], r['center_lon']), cs.center(r['stations']))
                bounds = (m['lon_min'], m['lon_max'], m['lat_min'], m['lat_max'])
                # Each station's own map, at 10 MHz and 13 UTC (from the same 6-hour run), decides the best station of every grid point.
                own = [cs.grid_bytes(server.ENGINE.area_plots(server.validate(dict(r['parameters'], tx_lat=s['lat'], tx_lon=s['lon'])), [(h, 10) for h in range(12, 18)], bounds, 61)['grids'][1]) for s in r['stations']]
                packed, area, _ = cs.combine(own, r['parameters']['reliability'], cs.row_weights(61, m['lat_min'], m['lat_max']), 61)
                self.assertEqual(m['cells'][1][13], {k: base64.b64encode(v).decode() for k, v in packed.items()})
                self.assertEqual(m['summary'][1][13], area)
                # The best-frequency map is never worse than either frequency's map.
                best = base64.b64decode(m['best']['cells'][13]['reliability'])
                for fi in range(2):
                    single = base64.b64decode(m['cells'][fi][13]['reliability'])
                    self.assertTrue(all(b == cs.NONE or s == cs.NONE or b >= s for b, s in zip(best, single)))
                with request('/api/results/'+r['id']+'/csv') as response:
                    rows = response.read().decode().splitlines()
                self.assertEqual(sum(l[:1].isdigit() or l.startswith('best') for l in rows), 3*24*2)
                history = json.load(request('/api/history'))
                self.assertEqual(history[0]['kind'], 'coverage_stations')
                for bad in (dict(p, stations=[]), dict(p, stations=[dict(name='RX', lat=13.45, lon=144.75)]), dict(p, span=45)):
                    with self.assertRaises(urllib.error.HTTPError) as e: request('/api/coverage-stations', bad)
                    self.assertEqual(e.exception.code, 400)
            finally:
                http.shutdown(); http.server_close()


if __name__ == '__main__':
    unittest.main()
