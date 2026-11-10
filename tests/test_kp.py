"""NOAA planetary Kp: both feed layouts and the observed + forecast series for the space weather tab."""
from datetime import datetime, timedelta, timezone
from pathlib import Path
import sys
import unittest

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'))
from space_weather import kp_rows
from space_weather_view import kp_series, kp_storm_level

NOW=datetime(2026,10,31,3,0,tzinfo=timezone.utc)


def kp_tables():
    observed=[['time_tag','Kp','a_running','station_count']]+[[(NOW-timedelta(hours=3*i)).strftime('%Y-%m-%d %H:%M:%S.000'),str(2+i%4),'7','8'] for i in range(8,0,-1)]
    forecast=[['time_tag','kp','observed','noaa_scale']]+[[(NOW+timedelta(hours=3*i)).strftime('%Y-%m-%d %H:%M:%S'),str(3+i%3),'predicted' if i>0 else 'estimated',None] for i in range(0,9)]
    return observed,forecast


class KpTests(unittest.TestCase):
    def test_both_noaa_layouts(self):
        observed,forecast=kp_tables()
        self.assertEqual(kp_rows(observed)[-1],{'time':(NOW-timedelta(hours=3)).isoformat(),'kp':3.0,'kind':'observed'})
        objects=[{'time_tag':'2026-10-31T00:00:00','Kp':5.33},{'time_tag':'bad','Kp':1},{'time_tag':'2026-10-31T03:00:00','kp_index':-1}]
        self.assertEqual(kp_rows(objects),[{'time':'2026-10-31T00:00:00+00:00','kp':5.33,'kind':'observed'}])
        self.assertEqual(kp_rows([['wrong']]),[])

    def test_series_joins_observations_and_forecast(self):
        observed,forecast=kp_tables()
        feed=lambda data:{'data':data,'stale':False,'url':None,'fetched_at':1,'error':None,'fetch_state':'cache'}
        series=kp_series(feed(observed),feed(forecast),NOW)
        self.assertEqual(series['latest']['time'],NOW.isoformat())  # the estimated value for now
        self.assertFalse(series['stale'])
        self.assertEqual((series['forecast_max']['kp'],series['forecast_max']['g']),(5.0,1))
        self.assertEqual(len([r for r in series['rows'] if r['kind']=='predicted']),8)

    def test_storm_level_counts_the_lower_third_as_noaa_does(self):
        # NOAA's 3-day forecast prints "4.67 (G1)": Kp 5- is G1, Kp 4+ is not.
        cases={0:0,4.33:0,4.67:1,5:1,5.33:1,5.67:2,6.67:3,7.67:4,8.67:5,9:5}
        self.assertEqual({kp:kp_storm_level(kp) for kp in cases},cases)
        self.assertIsNone(kp_storm_level(None))


if __name__=='__main__':unittest.main()
