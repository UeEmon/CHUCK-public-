import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
import sqlite3
import sys
import tempfile
import threading
import unittest
from unittest.mock import Mock, patch
import urllib.error
import urllib.request
sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'app'))
import watch
from engine import InputError, validate

PARAMS = dict(tx_lat=35.68, tx_lon=139.69, rx_lat=13.45, rx_lon=144.75, year=2026, month=10, ssn=80, frequencies=[8, 12], reliability=50)


def fake_run(q):
    # Hours at the target follow the SSN: SSN/10 hours on 12 MHz.
    return dict(parameters=q, distance_km=2500, bearing_deg=150,
                hours=[dict(hour_utc=h, muf_mhz=12, rows=[dict(frequency_mhz=8, reliability=40, snr_db_hz=40),
                                                         dict(frequency_mhz=12, reliability=80 if h < q['ssn']/10 else 30, snr_db_hz=30)]) for h in range(24)],
                input_cards='cards', raw_output='raw')


class WatchTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.db = Path(self.tmp.name)/'w.sqlite3'
        self.store = watch.WatchStore(lambda: sqlite3.connect(self.db))
        self.result = dict(id='r1', parameters=dict(validate(PARAMS), ssn_source='manual', tx_position=dict(source='s', id='x')), hours=[],
                           ui_selection=dict(tx=dict(location=dict(name='東京')), rxs=[dict(location=dict(name='Guam'))]))

    def tearDown(self): self.tmp.cleanup()

    def test_check_uses_the_month_ssn_and_summarises(self):
        r = watch.check(Mock(run=fake_run), validate(PARAMS), lambda y, m: (100, dict(kind='predicted')))
        self.assertEqual((r['ssn'], r['hours_meeting']), (100, 10))
        self.assertEqual(r['best'][0], dict(hour_utc=0, frequency_mhz=12, reliability=80))
        self.assertEqual(r['best'][20], dict(hour_utc=20, frequency_mhz=8, reliability=40))
        self.assertEqual(watch.check(Mock(run=fake_run), validate(PARAMS), lambda y, m: (None, 'no data'))['error'], 'no data')

    def test_baseline_status_notification_and_acknowledgement(self):
        w = self.store.add(self.result)
        self.assertEqual(w['label'], '東京 → Guam')
        self.assertNotIn('tx_position', w['parameters']);self.assertNotIn('ssn_source', w['parameters'])
        self.assertEqual(self.store.list()[0]['status'], 'pending')
        self.store.record(w['id'], dict(checked='2026-10-22T00:00:00+00:00', error='no data'))
        self.assertEqual(self.store.list()[0]['status'], 'pending')
        self.store.record(w['id'], dict(checked='2026-10-23T00:00:00+00:00', hours_meeting=10, best=[]))
        self.assertEqual(self.store.list()[0]['status'], 'same');self.assertNotIn('last_error', self.store.list()[0])
        self.store.record(w['id'], dict(checked='2026-10-24T00:00:00+00:00', hours_meeting=6, best=[]))
        listed = self.store.list()[0]
        self.assertEqual((listed['status'], listed['notify'], listed['baseline']['hours_meeting']), ('worse', True, 10))
        self.store.acknowledge(w['id'])
        self.assertFalse(self.store.list()[0]['notify'])
        # A newer worse check notifies again.
        self.store.record(w['id'], dict(checked='2026-10-25T00:00:00+00:00', hours_meeting=5, best=[]))
        self.assertTrue(self.store.list()[0]['notify'])
        self.store.record(w['id'], dict(checked='2026-10-26T00:00:00+00:00', error='no data'))
        self.assertEqual(self.store.list()[0]['status'], 'error')
        self.store.delete(w['id'])
        self.assertEqual(self.store.list(), [])

    def test_only_single_links_and_a_limit(self):
        with self.assertRaises(InputError): self.store.add(dict(self.result, kind='annual'))
        with self.assertRaises(InputError): self.store.add(dict(id='c', parameters=self.result['parameters'], coverage=[]))
        for _ in range(watch.MAX_WATCHES): self.store.add(self.result)
        with self.assertRaises(InputError): self.store.add(self.result)

    def test_due_after_the_interval(self):
        w = self.store.add(self.result)
        now = datetime(2026, 10, 24, tzinfo=timezone.utc)
        self.assertEqual(self.store.due(24, now), [w['id']])
        self.store.record(w['id'], dict(checked=(now-timedelta(hours=3)).isoformat(), hours_meeting=1, best=[]))
        self.assertEqual(self.store.due(24, now), [])
        self.assertEqual(self.store.due(2, now), [w['id']])


class WatchApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        os.environ['DATA_DIR'] = cls.tmp.name
        sys.modules.pop('server', None)
        import server
        server.DB = Path(cls.tmp.name)/'watch.sqlite3'
        server.WATCHES = watch.WatchStore(server.connection)
        cls.server = server
        cls.http = server.ThreadingHTTPServer(('127.0.0.1', 0), server.Handler)
        threading.Thread(target=cls.http.serve_forever, daemon=True).start()
        cls.url = f'http://127.0.0.1:{cls.http.server_port}'

    @classmethod
    def tearDownClass(cls):
        cls.http.shutdown();cls.http.server_close();cls.tmp.cleanup()

    def request(self, path, data=None, origin=True):
        headers = {'Content-Type': 'application/json'}
        if origin: headers['Origin'] = self.url
        req = urllib.request.Request(self.url+path, data=json.dumps(data).encode() if data is not None else None, headers=headers)
        try:
            with urllib.request.urlopen(req) as r: return r.status, json.loads(r.read())
        except urllib.error.HTTPError as e: return e.code, json.loads(e.read())

    def test_add_run_and_delete(self):
        ssn = {'value': 120}
        def snapshot(year, month, force=False): return dict(ssn=dict(value=ssn['value'], month=f'{year}-{month:02d}', kind='predicted', stale=False))
        with patch.object(self.server.ENGINE, 'run', side_effect=fake_run), patch.object(self.server.SPACE_WEATHER, 'snapshot', side_effect=snapshot):
            status, r = self.request('/api/predict', PARAMS)
            self.assertEqual(status, 200)
            self.assertEqual(self.request('/api/watches', dict(action='add', result_id=r['id']), origin=False)[0], 403)
            status, body = self.request('/api/watches', dict(action='add', result_id=r['id']))
            self.assertEqual(status, 200, body)
            w = body['watches'][0]
            self.assertEqual((w['baseline']['ssn'], w['baseline']['hours_meeting'], w['status']), (120, 12, 'same'))
            ssn['value'] = 60
            status, body = self.request('/api/watches', dict(action='run', id=w['id']))
            self.assertEqual((body['watches'][0]['latest']['hours_meeting'], body['watches'][0]['notify']), (6, True))
            # Another calculation holding the engine is reported, not waited for.
            self.server.RUN_LOCK.acquire()
            try: self.assertEqual(self.request('/api/watches', dict(action='run', id=w['id']))[0], 409)
            finally: self.server.RUN_LOCK.release()
        self.assertEqual(self.request('/api/watches')[1]['watches'][0]['id'], w['id'])
        self.assertEqual(self.request('/api/watches', dict(action='acknowledge', id=w['id']))[1]['watches'][0]['notify'], False)
        self.assertEqual(self.request('/api/watches', dict(action='bogus'))[0], 400)
        self.assertEqual(self.request('/api/watches', dict(action='run', id='nope'))[0], 400)
        self.assertEqual(self.request('/api/watches', dict(action='delete', id=w['id']))[1]['watches'], [])

    def test_missing_noaa_ssn_is_recorded(self):
        def snapshot(year, month, force=False): return dict(ssn=None)
        with patch.object(self.server.ENGINE, 'run', side_effect=fake_run), patch.object(self.server.SPACE_WEATHER, 'snapshot', side_effect=snapshot):
            status, r = self.request('/api/predict', PARAMS)
            status, body = self.request('/api/watches', dict(action='add', result_id=r['id']))
        w = [v for v in body['watches'] if v['result_id'] == r['id']][0]
        self.assertEqual((w['status'], w['last_error']['error']), ('pending', 'NOAAの新鮮な平滑SSNがありません'))
        self.request('/api/watches', dict(action='delete', id=w['id']))


if __name__ == '__main__':
    unittest.main()
