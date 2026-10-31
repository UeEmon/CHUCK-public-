from datetime import datetime, timezone
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'))
from space_weather import SpaceWeather
import space_weather_view

NOW=datetime(2026,10,31,3,0,tzinfo=timezone.utc)
ROWS={
    'observed':[{'time-tag':'1990-01','ssn':150,'smoothed_ssn':140},
                {'time-tag':'2026-03','ssn':120.5,'smoothed_ssn':118.2,'f10.7':160,'smoothed_f10.7':150},
                {'time-tag':'2026-09','ssn':96,'smoothed_ssn':-1,'f10.7':140,'smoothed_f10.7':-1},
                {'time-tag':'2026-10','ssn':-1,'smoothed_ssn':-1}],
    'predicted':[{'time-tag':'2026-11','predicted_ssn':90,'high_ssn':100,'low_ssn':80,'predicted_f10.7':135},
                 {'time-tag':'2026-10','predicted_ssn':92.4,'high_ssn':None,'low_ssn':84},
                 {'time-tag':'2026-12','predicted_ssn':-1}],
    'scales':{'-1':{'DateStamp':'2026-10-31','TimeStamp':'00:00:00','R':{'Scale':'1','MinorProb':None,'MajorProb':None},'S':{'Scale':'0','Prob':None},'G':{'Scale':'2'}},
              '0':{'DateStamp':'2026-10-31','TimeStamp':'02:55:00','R':{'Scale':'0'},'S':{'Scale':'0'},'G':{'Scale':'1'}},
              '1':{'DateStamp':'2026-11-01','TimeStamp':'00:00:00','R':{'Scale':None,'MinorProb':'55','MajorProb':'15'},'S':{'Scale':None,'Prob':'10'},'G':{'Scale':'1'}},
              '2':{'DateStamp':'2026-11-02','TimeStamp':'00:00:00','R':{'Scale':None,'MinorProb':'45','MajorProb':'10'},'S':{'Prob':'5'},'G':{'Scale':'0'}},
              '3':{'DateStamp':'bad','R':'none','S':{},'G':{'Scale':'9'}}}}


class OverviewTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.weather=SpaceWeather(self.tmp.name)

    def overview(self,rows=ROWS):
        download=lambda key,force=False:(json.dumps(rows[key]).encode(),NOW.timestamp())
        with patch('public_data.download',side_effect=download) as get:
            result=space_weather_view.overview(self.weather,NOW)
        # Viewing the charts never forces a new download.
        self.assertTrue(all(not call.args[1] for call in get.call_args_list))
        return result

    def test_solar_cycle_series_and_forecast(self):
        cycle=self.overview()['solar_cycle']
        self.assertEqual([r['month'] for r in cycle['observed']],['2026-03','2026-09'])  # before 2008 and all-missing rows are left out
        self.assertIsNone(cycle['observed'][1]['smoothed_ssn'])
        self.assertEqual([r['month'] for r in cycle['predicted']],['2026-10','2026-11'])
        self.assertEqual(cycle['predicted'][0]['engine_ssn'],64.7)
        self.assertIsNone(cycle['predicted'][0]['high_ssn'])
        self.assertEqual(cycle['latest_monthly'],{'month':'2026-09','ssn':96,'f10_7':140})
        self.assertEqual(cycle['latest_smoothed'],{'month':'2026-03','ssn':118.2,'engine_ssn':82.7})

    def test_scales_current_and_three_day_forecast(self):
        scales=self.overview()['scales']
        self.assertFalse(scales['stale'])
        self.assertEqual([d['kind'] for d in scales['days']],['max24h','latest','forecast','forecast','forecast'])
        self.assertEqual(scales['days'][0]['G'],{'scale':2})
        day=scales['days'][2]
        self.assertEqual((day['date'],day['R'],day['S']),('2026-11-01',{'scale':None,'minor_prob':55,'major_prob':15},{'scale':None,'prob':10}))
        broken=scales['days'][4]
        self.assertEqual((broken['date'],broken['R']['minor_prob'],broken['G']['scale']),(None,None,None))

    def test_missing_feeds_are_empty_not_errors(self):
        with patch('public_data.download',side_effect=OSError('offline')):
            result=space_weather_view.overview(self.weather,NOW)
        self.assertEqual((result['solar_cycle']['observed'],result['scales']['days']),([],[]))
        self.assertTrue(result['scales']['stale'])
        self.assertIsNone(result['solar_cycle']['latest_smoothed'])
        json.dumps(result,allow_nan=False)

    def test_old_latest_observation_is_stale(self):
        rows=json.loads(json.dumps(ROWS));rows['scales']['0']['DateStamp']='2026-10-29'
        self.assertTrue(self.overview(rows)['scales']['stale'])


if __name__=='__main__':unittest.main()
