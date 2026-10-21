from datetime import datetime, timezone
from pathlib import Path
import sys
import unittest
import unittest.mock
from unittest.mock import MagicMock

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'app'))
from engine import Engine, InputError
import effective_ssn
from effective_ssn import EffectiveSSN, EffectiveSSNError, candidates, estimate, model_fof2, observation_hours

UTC = timezone.utc


def nict(stations):
    return {'nict': {'data': {'stations': stations}}}


def station(code, lat, lon, observed_at, fof2, stale=False):
    return {'code': code, 'name': code, 'lat': lat, 'lon': lon, 'observed_at': observed_at, 'fof2_mhz': fof2, 'stale': stale}


class SelectionTests(unittest.TestCase):
    def test_observation_hours_bracket_and_wrap(self):
        self.assertEqual(observation_hours('2026-10-21T02:30:00+00:00'), ((2, 3), 0.5))
        self.assertEqual(observation_hours('2026-10-21T00:15:00+00:00'), ((24, 1), 0.25))
        self.assertEqual(observation_hours('2026-10-21T23:45:00+00:00'), ((23, 24), 0.75))
        # JST input is converted to UTC.
        self.assertEqual(observation_hours('2026-10-21T09:00:00+09:00'), ((24, 1), 0.0))

    def test_candidates_skip_stale_missing_and_low_confidence(self):
        now = '2026-10-21T02:00:00+00:00'
        snapshot = nict([station('TO536', 35.71, 139.49, now, 9.0), station('WK546', 45.16, 141.75, now, 8.0, stale=True),
                         station('YG431', 31.2, 130.62, now, None)])
        giro = [{'stale': False, 'data': {'code': 'JR055', 'name': 'Juliusruh', 'lat': 54.6, 'lon': 13.4, 'series': [
                    {'observed_at': now, 'fof2_mhz': 6.0, 'confidence': 90},
                    {'observed_at': '2026-10-21T02:15:00+00:00', 'fof2_mhz': 9.9, 'confidence': 20}]}},
                {'stale': False, 'data': {'code': 'GU513', 'name': 'Guam', 'lat': 13.6, 'lon': 144.9, 'series': [
                    {'observed_at': now, 'fof2_mhz': 11.0, 'confidence': 999}]}},
                {'stale': True, 'data': {'code': 'MHJ45', 'name': 'Millstone Hill', 'lat': 42.6, 'lon': 288.5, 'series': [
                    {'observed_at': now, 'fof2_mhz': 5.0, 'confidence': 90}]}}]
        found = candidates(snapshot, giro)
        self.assertEqual([s['code'] for s in found], ['TO536', 'JR055', 'GU513'])
        # The low-confidence later row is ignored in favour of the last trusted one.
        self.assertEqual(found[1]['fof2_mhz'], 6.0)

    def test_other_month_is_refused_without_fetching(self):
        observations = MagicMock(giro_enabled=False)
        service = EffectiveSSN(Engine(), observations)
        result = service.snapshot(2020, 1)
        self.assertIsNone(result['value'])
        self.assertIn('現在の月', result['error'])
        observations.snapshot.assert_not_called()
        with self.assertRaises(InputError):
            service.calculation_input({'year': 2020, 'month': 1})

    def test_too_few_stations_is_an_error_for_this_month(self):
        now = datetime.now(UTC)
        observations = MagicMock(giro_enabled=False)
        observations.snapshot.return_value = nict([])
        service = EffectiveSSN(Engine(), observations)
        result = service.snapshot(now.year, now.month)
        self.assertIsNone(result['value'])
        self.assertEqual(result['used_count'], 0)
        with self.assertRaises(EffectiveSSNError):
            service.calculation_input({'year': now.year, 'month': now.month})


@unittest.skipUnless(Engine().ready(), 'Built VOACAP engine required')
class InversionTests(unittest.TestCase):
    def test_inversion_recovers_the_ssn_of_a_model_foF2(self):
        engine = Engine()
        observed = '2026-10-21T02:30:00+00:00'
        sites = [{'code': 'TO536', 'lat': 35.71, 'lon': 139.49}, {'code': 'WK546', 'lat': 45.16, 'lon': 141.75},
                 {'code': 'JR055', 'lat': 54.6, 'lon': 13.4}]
        for s in sites:
            s['hours'] = observation_hours(observed)[0]
        model = model_fof2(engine, sites, 2026, 10)
        stations = []
        for target, s in zip((40, 100, 160), sites):
            # foF2 the model gives at the target SSN, halfway between 02 and 03 UTC.
            f = [sum(model[s['code']][ssn][h] for h in (2, 3)) / 2 for ssn in (0.0, 250.0)]
            stations.append(dict(s, name=s['code'], observed_at=observed, fof2_mhz=f[0] + (f[1] - f[0]) * target / 250))
        stations.append(dict(sites[0], code='BAD', name='BAD', observed_at=observed, fof2_mhz=60.0))
        for s in stations:
            s.pop('hours')
        value, used = estimate(engine, stations, 2026, 10)
        self.assertEqual(len(used), 3)
        for s, target in zip(stations, (40, 100, 160)):
            self.assertAlmostEqual(s['effective_ssn'], target, delta=0.5)
        self.assertAlmostEqual(value, 100, delta=0.5)
        self.assertFalse(stations[-1]['used'])
        self.assertIsNotNone(stations[-1]['reason'])

    def test_unchanged_observations_reuse_the_engine_result(self):
        now = datetime.now(UTC)
        observed = now.replace(second=0, microsecond=0).isoformat()
        observations = MagicMock(giro_enabled=False)
        observations.snapshot.return_value = nict([station('TO536', 35.71, 139.49, observed, 9.0),
                                                   station('WK546', 45.16, 141.75, observed, 7.5)])
        engine = Engine()
        service = EffectiveSSN(engine, observations)
        with unittest.mock.patch.object(engine, 'execute', wraps=engine.execute) as runs:
            first = service.snapshot(now.year, now.month)
            second = service.snapshot(now.year, now.month)
            self.assertEqual(runs.call_count, 1)
            observations.snapshot.return_value['nict']['data']['stations'][0]['fof2_mhz'] = 9.5
            third = service.snapshot(now.year, now.month)
            self.assertEqual(runs.call_count, 2)
        self.assertEqual(first['value'], second['value'])
        self.assertEqual(first['stations'], second['stations'])
        self.assertGreater(third['value'], first['value'])

    def test_voacap_foF2_is_linear_in_ssn(self):
        engine = Engine()
        # Local noon and night over Kokubunji.
        sites = [{'code': 'day', 'lat': 35.71, 'lon': 139.49, 'hours': (3, 4)},
                 {'code': 'night', 'lat': 35.71, 'lon': 139.49, 'hours': (15, 16)}]
        model = model_fof2(engine, sites, 2026, 10)
        for code, hours in (('day', (3, 4)), ('night', (15, 16))):
            for hour in hours:
                f = model[code]
                self.assertAlmostEqual(f[125.0][hour], (f[0.0][hour] + f[250.0][hour]) / 2,
                                       delta=effective_ssn.LINEARITY_TOLERANCE_MHZ)
                self.assertGreater(f[250.0][hour], f[0.0][hour])


if __name__ == '__main__':
    unittest.main()
