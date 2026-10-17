import copy
import sys
from pathlib import Path
import unittest
from unittest.mock import Mock
sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'app'))
from diversity import prepare, combine, predict
from engine import InputError, validate, EngineError


class DiversityTests(unittest.TestCase):
    def setUp(self):
        self.data = dict(tx_lat=35.3, tx_lon=139.67, year=2026, month=10,
                         frequencies=[8, 12], rx_sites=[dict(name='A', lat=26.21, lon=127.68),
                                                     dict(name='B', lat=13.45, lon=144.75, gain=3, noise=145)])

    def test_preparation_and_per_site_overrides(self):
        sites, independent = prepare(self.data)
        self.assertFalse(independent)
        self.assertEqual(sites[1]['gain'], 3)
        self.assertEqual(sites[1]['noise'], 145)
        self.assertEqual(sites[0]['noise'], 150)
        self.assertNotIn('rx_lat', self.data)
        data = dict(self.data, rx_sites=[dict(name='RX'+str(i), lat=10+i, lon=130) for i in range(8)])
        self.assertEqual(len(prepare(data)[0]), 8)

    def test_invalid_sites_and_assumption(self):
        for raw in [None, [], self.data['rx_sites'][:1], self.data['rx_sites']*5, [None, {}]]:
            with self.subTest(raw=raw), self.assertRaises(InputError):
                prepare(dict(self.data, rx_sites=raw))
        for key, value in [('lat', True), ('lon', float('nan')), ('antenna', 'other'), ('noise', 99), ('gain', 31), ('name', '=bad\n')]:
            data = copy.deepcopy(self.data);data['rx_sites'][0][key] = value
            with self.subTest(key=key), self.assertRaises(InputError): prepare(data)
        data = copy.deepcopy(self.data);data['rx_sites'][1]['name'] = 'A'
        with self.assertRaises(InputError): prepare(data)
        with self.assertRaises(InputError): prepare(dict(self.data, independence_assumption='false'))
        data = copy.deepcopy(self.data);data['rx_sites'][0].update(lat=35.3, lon=139.67)
        with self.assertRaises(InputError): prepare(data)

    def test_distinct_physical_antennas_reach_each_engine_run(self):
        data=copy.deepcopy(self.data)
        data['rx_sites'][0].update(antenna='dipole',length_m=20,height_m=12,azimuth_deg=45)
        data['rx_sites'][1].update(antenna='vertical_dipole',length_m=10,height_m=8,ground_conductivity=.03)
        sites,_=prepare(data)
        p=validate(dict(data,rx_lat=sites[0]['lat'],rx_lon=sites[0]['lon']))
        def run(q):return dict(parameters=q,hours=[])
        result=predict(Mock(run=run),p,sites)
        a,b=[s['parameters'] for s in result['sites']]
        self.assertEqual((a['rx_length_m'],a['rx_height_m'],a['rx_azimuth_deg']),(20,12,45))
        self.assertEqual((b['rx_length_m'],b['rx_height_m'],b['rx_ground_conductivity']),(10,8,.03))

    def test_bounds_and_explicit_independence(self):
        samples = [dict(site_id='a', reliability=80), dict(site_id='b', reliability=60)]
        s = combine(samples, 70)
        self.assertEqual(s['union_lower_percent'], 80)
        self.assertEqual(s['union_upper_percent'], 100)
        self.assertIsNone(s['independent_scenario_percent'])
        self.assertEqual(s['sites_meeting_target'], 1)
        self.assertEqual(combine(samples, 70, True)['independent_scenario_percent'], 92)

    def test_missing_and_zero_are_distinct(self):
        s = combine([dict(site_id='a', reliability=0), dict(site_id='b', reliability=None)], 90, True)
        self.assertEqual(s['best_rel_percent'], 0)
        self.assertEqual(s['union_lower_percent'], 0)
        self.assertIsNone(s['union_upper_percent'])
        self.assertIsNone(s['independent_scenario_percent'])
        self.assertFalse(s['complete'])
        self.assertIsNone(combine([dict(site_id='a', reliability=float('nan'))], 90)['best_site_id'])
        s = combine([dict(site_id='a', reliability=0), dict(site_id='b', reliability=0)], 90, True)
        self.assertEqual(s['independent_scenario_percent'], 0)

    def test_selection_ties_and_no_snr_summing(self):
        samples = [dict(site_id='a', reliability=80, snr_db_hz=20), dict(site_id='b', reliability=80, snr_db_hz=30)]
        self.assertEqual(combine(samples, 90)['best_site_id'], 'b')
        samples[0]['snr_db_hz'] = 30
        self.assertEqual(combine(samples, 90)['best_site_id'], 'a')
        self.assertNotIn('combined_snr', combine(samples, 90))

    def test_index_alignment_metadata_and_no_input_mutation(self):
        sites, independent = prepare(self.data)
        p = validate(dict(self.data, rx_lat=sites[0]['lat'], rx_lon=sites[0]['lon']))
        original = copy.deepcopy(p)
        def run(q):
            # Deliberately reversed frequency rows: join by key, never by index.
            return dict(parameters=q, hours=[dict(hour_utc=h, rows=[dict(frequency_mhz=f, reliability=q['rx_gain']+f, snr_db_hz=40) for f in [12, 8]]) for h in range(24)])
        r = predict(Mock(run=run), p, sites, independent)
        self.assertEqual(len(r['diversity_hours']), 24)
        self.assertEqual(r['diversity_hours'][0]['rows'][0]['best_rel_percent'], 11)
        self.assertEqual(r['diversity_hours'][0]['rows'][0]['best_site_id'], 'rx2')
        self.assertEqual(r['sites'][1]['parameters']['noise'], 145)
        self.assertEqual(p, original)
        self.assertEqual(len(r['site_separations']), 1)
        self.assertEqual(r['parameters']['rx_sites'], sites)

    def test_engine_failure_not_silently_partial(self):
        sites, _ = prepare(self.data)
        p = validate(dict(self.data, rx_lat=26.21, rx_lon=127.68))
        engine = Mock();engine.run.side_effect = EngineError('failed')
        with self.assertRaises(EngineError): predict(engine, p, sites)


if __name__ == '__main__': unittest.main()
