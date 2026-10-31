"""Today's conditions check: D-RAP absorption and geomagnetic storm marks on a monthly result."""
from datetime import datetime, timezone
from pathlib import Path
import sys
import unittest
sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'app'))
import today

NOW = datetime(2026, 10, 31, 10, 20, tzinfo=timezone.utc)


def result(tx=(35.68, 139.76), rx=(13.45, 144.75), month=10, distance=2500):
    hours = [{'hour_utc': h, 'muf_mhz': 15.0, 'rows': [
        {'frequency_mhz': 5.0, 'reliability': 95, 'snr_db_hz': 60.0, 'takeoff_deg': 10},
        {'frequency_mhz': 10.0, 'reliability': 95, 'snr_db_hz': 70.0, 'takeoff_deg': 10},
        {'frequency_mhz': 14.5, 'reliability': 92, 'snr_db_hz': 65.0, 'takeoff_deg': 10},
        {'frequency_mhz': 25.0, 'reliability': 0, 'snr_db_hz': 10.0, 'takeoff_deg': 10}]} for h in range(24)]
    return {'id': 'r1', 'distance_km': distance, 'hours': hours,
            'parameters': {'tx_lat': tx[0], 'tx_lon': tx[1], 'rx_lat': rx[0], 'rx_lon': rx[1], 'year': 2026, 'month': month,
                           'reliability': 90, 'required_snr': 45, 'min_angle': 3}}


def drap(value):
    lons = list(range(-178, 182, 4))
    return {'data': {'observed_at': NOW.isoformat(), 'longitudes': lons,
                     'rows': [{'lat': lat, 'values': [value] * len(lons)} for lat in range(89, -90, -2)]},
            'stale': False, 'fetched_at': 1}


def scales(r=0, s=0, g=0, g24=0, forecast=None):
    def item(date, **levels):
        return {'DateStamp': date, 'TimeStamp': '10:00:00', **{k: {'Scale': str(v)} for k, v in levels.items()}}
    forecast = forecast or {}
    return {'data': {'-1': item('2026-10-31', R=0, S=0, G=g24), '0': item('2026-10-31', R=r, S=s, G=g),
                     '1': item('2026-10-31', G=forecast.get('2026-10-31', 0)), '2': item('2026-11-01', G=forecast.get('2026-11-01', 0)),
                     '3': item('2026-11-02', G=0)}, 'stale': False, 'fetched_at': 1}


class TodayTests(unittest.TestCase):
    def test_quiet_day_marks_nothing(self):
        out = today.assess(result(), drap(4), scales(), NOW)
        self.assertTrue(out['available'])
        self.assertEqual(len(out['hours']), 24)
        self.assertEqual(out['hours'][0]['hour_utc'], 10)
        self.assertEqual(out['hours'][23]['hour_utc'], 9)
        # Ordinary daytime absorption is already in VOACAP, so D-RAP is not applied without R or S.
        self.assertFalse(out['conditions']['absorption_applied'])
        self.assertTrue(all(r['status'] == 'ok' for h in out['hours'] for r in h['rows']))
        self.assertEqual(out['hours'][0]['best_mhz'], 10.0)

    def test_radio_blackout_absorbs_low_frequencies_for_three_hours(self):
        out = today.assess(result(), drap(12), scales(r=3), NOW)
        self.assertTrue(out['conditions']['absorption_applied'])
        first = {r['frequency_mhz']: r for r in out['hours'][0]['rows']}
        # Absorption falls with frequency as (HAF/f)^1.5.
        self.assertGreater(first[5.0]['extra_loss_db'], first[10.0]['extra_loss_db'])
        self.assertGreater(first[10.0]['extra_loss_db'], first[14.5]['extra_loss_db'])
        self.assertEqual(first[5.0]['status'], 'blocked')
        self.assertIn('absorption', first[5.0]['reasons'])
        # A frequency the month never reaches is not called blocked.
        self.assertEqual(first[25.0]['status'], 'ok')
        self.assertEqual(out['hours'][0]['best_mhz'], 10.0)
        self.assertEqual(out['hours'][0]['best_status'], 'warn')
        self.assertTrue(all(h['absorption_applied'] == (h['offset'] < 3) for h in out['hours']))
        self.assertTrue(all(r['extra_loss_db'] is None for r in out['hours'][3]['rows']))

    def test_stale_drap_is_not_applied(self):
        feed = drap(12)
        feed['stale'] = True
        out = today.assess(result(), feed, scales(r=3), NOW)
        self.assertFalse(out['conditions']['absorption_applied'])

    def test_storm_lowers_muf_and_marks_auroral_paths(self):
        # Tokyo to London crosses high geomagnetic latitudes.
        out = today.assess(result(rx=(51.5, -0.13), distance=9560), drap(0), scales(g=3, forecast={'2026-10-31': 2, '2026-11-01': 0}), NOW)
        self.assertGreater(out['conditions']['path_max_geomagnetic_lat'], 60)
        first = out['hours'][0]
        self.assertEqual(first['g_scale'], 3)
        self.assertEqual(first['muf_adjusted_mhz'], 12.75)
        self.assertTrue(first['auroral'])
        rows = {r['frequency_mhz']: r for r in first['rows']}
        self.assertIn('muf', rows[14.5]['reasons'])
        self.assertNotIn('muf', rows[10.0]['reasons'])
        self.assertEqual(rows[10.0]['status'], 'warn')
        # Later hours follow the forecast for their own UTC date.
        by_offset = {h['offset']: h for h in out['hours']}
        self.assertEqual(by_offset[5]['g_scale'], 2)
        self.assertEqual(by_offset[20]['g_scale'], 0)
        self.assertFalse(by_offset[20]['auroral'])

    def test_low_latitude_path_keeps_muf(self):
        out = today.assess(result(tx=(1.35, 103.82), rx=(-6.2, 106.85), distance=900), drap(0), scales(g=2), NOW)
        self.assertEqual(out['hours'][0]['muf_adjusted_mhz'], 15.0)
        self.assertFalse(out['hours'][0]['auroral'])

    def test_only_current_month_point_results(self):
        self.assertFalse(today.assess(result(month=11), drap(0), scales(), NOW)['available'])
        self.assertFalse(today.assess({'parameters': {'year': 2026, 'month': 10}}, drap(0), scales(), NOW)['available'])

    def test_geometry_helpers(self):
        self.assertEqual(today.hop_count(2500, 10), 1)
        self.assertGreaterEqual(today.hop_count(9560, 5), 2)
        self.assertAlmostEqual(today.geomagnetic_lat(80.8, -72.7), 90, places=5)
        self.assertGreater(today.secant(3), today.secant(30))


if __name__ == '__main__':
    unittest.main()
