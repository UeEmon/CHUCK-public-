import io
import json
from pathlib import Path
import sys
import tempfile
import time
import unittest
from unittest.mock import patch

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'))
from space_weather import SpaceWeather, SpaceWeatherError, FEEDS


class WeatherTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.weather=SpaceWeather(self.tmp.name)
        self.rows={
            'observed':[{'time-tag':'2026-10','ssn':200,'smoothed_ssn':-1,'smoothed_f10.7':-1},
                        {'time-tag':'2026-01','smoothed_ssn':100.1,'smoothed_f10.7':140}],
            'predicted':[{'time-tag':'2026-10','predicted_ssn':87.5,'predicted_f10.7':130}],
            'scales':{'0':{'DateStamp':time.strftime('%Y-%m-%d',time.gmtime()),'TimeStamp':time.strftime('%H:%M:%S',time.gmtime()),
                           'R':{'Scale':'0'},'S':{'Scale':None},'G':{'Scale':'3'}}}}

    def download(self, request, **kw):
        key=next(k for k,(path,ttl) in FEEDS.items() if request.full_url.endswith(path))
        return io.BytesIO(json.dumps(self.rows[key]).encode())

    def test_prediction_not_daily_ssn_and_metadata(self):
        with patch('space_weather.urlopen',side_effect=self.download):
            w=self.weather.snapshot(2026,10)
        self.assertEqual(w['ssn']['value'],87.5)
        self.assertEqual(w['ssn']['kind'],'predicted')
        self.assertEqual(w['current']['scales'],{'R':0,'S':None,'G':3})
        self.assertFalse(w['current']['stale'])
        self.assertTrue(w['ssn']['source_url'].startswith('https://services.swpc.noaa.gov/'))

    def test_force_refresh_bypasses_cache_and_preserves_last_success_on_failure(self):
        with patch('space_weather.urlopen',side_effect=self.download) as get:
            first=self.weather.snapshot(2026,10)
            self.weather.snapshot(2026,10);self.assertEqual(get.call_count,3)
            updated=self.weather.snapshot(2026,10,force=True);self.assertEqual(get.call_count,6)
            self.assertTrue(all(s['fetch_state']=='downloaded' for s in updated['sources'].values()))
        stamp=updated['sources']['predicted']['fetched_at']
        with patch('space_weather.urlopen',side_effect=OSError('offline')) as get:
            failed=self.weather.snapshot(2026,10,force=True)
            self.assertEqual(failed['sources']['predicted']['fetched_at'],stamp)
            self.assertEqual(failed['sources']['predicted']['fetch_state'],'failed')
            self.weather.snapshot(2026,10,force=True);self.assertEqual(get.call_count,3)

    def test_observed_preferred_and_unknown_month(self):
        with patch('space_weather.urlopen',side_effect=self.download):
            self.assertEqual(self.weather.snapshot(2026,1)['ssn']['kind'],'observed')
            self.assertIsNone(self.weather.snapshot(2035,1)['ssn'])

    def test_disk_cache_survives_restart_and_failure(self):
        with patch('space_weather.urlopen',side_effect=self.download) as get:
            self.weather.snapshot(2026,10)
            SpaceWeather(self.tmp.name).snapshot(2026,10)
            self.assertEqual(get.call_count,3)
        for file in Path(self.tmp.name).glob('*.json'):
            data=json.loads(file.read_text());data['fetched_at']=time.time()-90000;file.write_text(json.dumps(data))
        with patch('space_weather.urlopen',side_effect=OSError('offline')) as get:
            weather=SpaceWeather(self.tmp.name)
            self.assertTrue(weather.snapshot(2026,10)['ssn']['stale'])
            with self.assertRaises(SpaceWeatherError):weather.calculation_input({'year':2026,'month':10,'ssn_source':'noaa'})
            self.assertEqual(get.call_count,3)  # retry backoff

    def test_missing_data_not_zero_and_schema_failure(self):
        self.rows['predicted']=[{'time-tag':'2026-10','predicted_ssn':float('nan')}]
        self.rows['scales']={'wrong':{}}
        with patch('space_weather.urlopen',side_effect=self.download):
            w=self.weather.snapshot(2026,10)
        self.assertIsNone(w['ssn'])
        self.assertIsNone(w['current']['scales']['R'])
        self.assertTrue(w['current']['stale'])
        json.dumps(w,allow_nan=False)

    def test_automatic_input_overrides_client_and_manual_offline(self):
        with patch('space_weather.urlopen',side_effect=self.download):
            p,w=self.weather.calculation_input({'year':2026,'month':10,'ssn':999,'ssn_source':'noaa'})
        self.assertEqual(p['ssn'],87.5)
        self.assertEqual(w['ssn']['value'],p['ssn'])
        with patch('space_weather.urlopen',side_effect=AssertionError('must not fetch')):
            self.assertEqual(self.weather.calculation_input({'ssn':80}),({'ssn':80},None))
        with self.assertRaises(ValueError):self.weather.calculation_input({'ssn_source':'other'})

    def test_old_observation_marked_stale_even_when_download_fresh(self):
        self.rows['scales']['0']['DateStamp']='2000-01-01'
        with patch('space_weather.urlopen',side_effect=self.download):
            self.assertTrue(self.weather.snapshot(2026,10)['current']['stale'])

class WeatherHttpTests(unittest.TestCase):
    def test_endpoint_and_saved_automatic_input(self):
        import importlib
        import os
        import threading
        from urllib.request import urlopen, Request
        from urllib.error import HTTPError
        from http.server import ThreadingHTTPServer
        with tempfile.TemporaryDirectory() as directory, patch.dict(os.environ,{'DATA_DIR':directory}):
            import server
            server=importlib.reload(server)
            snapshot={'ssn':{'value':87.5,'kind':'predicted','month':'2026-10','stale':False},'note':'fixture'}
            with patch.object(server.SPACE_WEATHER,'snapshot',return_value=snapshot), patch.object(server.ENGINE,'run',side_effect=lambda p:{'parameters':p,'engine':'test','engine_commit':'test','hours':[]}):
                http=ThreadingHTTPServer(('127.0.0.1',0),server.Handler)
                thread=threading.Thread(target=http.serve_forever,daemon=True);thread.start()
                base='http://127.0.0.1:'+str(http.server_port)
                try:
                    with urlopen(base+'/api/space-weather?year=2026&month=10') as response:
                        self.assertEqual(json.load(response)['ssn']['value'],87.5)
                    with urlopen(base+'/api/space-weather?year=2026&month=10&refresh=1') as response:json.load(response)
                    server.SPACE_WEATHER.snapshot.assert_called_with(2026,10,force=True)
                    with self.assertRaises(HTTPError) as error:urlopen(base+'/api/space-weather?month=1.5')
                    self.assertEqual(error.exception.code,400)
                    payload={'tx_lat':35.3,'tx_lon':139.67,'rx_lat':13.45,'rx_lon':144.75,'year':2026,'month':10,'ssn_source':'noaa'}
                    with urlopen(Request(base+'/api/predict',data=json.dumps(payload).encode(),headers={'Content-Type':'application/json'})) as response:
                        saved=json.load(response)
                    self.assertEqual(saved['parameters']['ssn'],87.5)
                    with urlopen(base+'/api/results/'+saved['id']) as response:
                        self.assertEqual(json.load(response)['space_weather'],snapshot)
                    with urlopen(base+'/api/results/'+saved['id']+'/csv') as response:
                        self.assertIn('# space_weather',response.read().decode('utf-8-sig'))
                finally:
                    http.shutdown();thread.join();http.server_close()

if __name__=='__main__':unittest.main()
