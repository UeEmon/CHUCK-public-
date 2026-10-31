import copy
import sys
from pathlib import Path
import unittest
from unittest.mock import Mock
sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'app'))
from mesh import prepare, predict, pair
from engine import InputError, validate, beam_azimuth
from position_contract import apply_snapshot, has_references


def fake_run(q):
    # REL depends on direction so a transposed matrix would be detected.
    rel = round(q['tx_lat'] - q['rx_lat'] + 50, 1)
    return dict(parameters=q, distance_km=1000, bearing_deg=90,
                hours=[dict(hour_utc=h, muf_mhz=12, rows=[dict(frequency_mhz=f, reliability=rel, snr_db_hz=40)
                                                         for f in q['frequencies']]) for h in range(24)],
                input_cards='cards', raw_output='raw')


class MeshTests(unittest.TestCase):
    def setUp(self):
        self.data = dict(year=2026, month=10, frequencies=[8, 12], power_w=500,
                         mesh_sites=[dict(name='Tokyo', lat=35.68, lon=139.69),
                                     dict(name='Naha', lat=26.21, lon=127.68, power_w=100, noise=145,
                                          antenna='dipole', length_m=20, height_m=12),
                                     dict(name='Guam', lat=13.45, lon=144.75, gain=3)])

    def test_preparation_and_per_node_settings(self):
        sites = prepare(self.data)
        self.assertEqual([s['id'] for s in sites], ['n1', 'n2', 'n3'])
        self.assertEqual([s['power_w'] for s in sites], [500, 100, 500])
        self.assertEqual([s['noise'] for s in sites], [150, 145, 150])
        self.assertEqual((sites[1]['antenna'], sites[1]['length_m'], sites[1]['height_m']), ('dipole', 20, 12))
        self.assertEqual(sites[2]['gain'], 3)
        data = dict(self.data, mesh_sites=[dict(name='N'+str(i), lat=10+i, lon=130) for i in range(8)])
        self.assertEqual(len(prepare(data)), 8)

    def test_invalid_nodes(self):
        for raw in [None, [], self.data['mesh_sites'][:1], self.data['mesh_sites']*3, [None, {}]]:
            with self.subTest(raw=raw), self.assertRaises(InputError):
                prepare(dict(self.data, mesh_sites=raw))
        for key, value in [('lat', True), ('lon', float('nan')), ('antenna', 'other'), ('noise', 99),
                           ('gain', 31), ('power_w', 0), ('name', '=bad\n')]:
            data = copy.deepcopy(self.data);data['mesh_sites'][2][key] = value
            with self.subTest(key=key), self.assertRaises(InputError): prepare(data)
        data = copy.deepcopy(self.data);data['mesh_sites'][1]['name'] = 'Tokyo'
        with self.assertRaises(InputError): prepare(data)
        data = copy.deepcopy(self.data);data['mesh_sites'][2].update(lat=35.68, lon=139.69)
        with self.assertRaises(InputError): prepare(data)

    def test_every_directed_link_uses_its_own_ends(self):
        sites = prepare(self.data)
        p = validate(dict(self.data, tx_lat=sites[0]['lat'], tx_lon=sites[0]['lon'], rx_lat=sites[1]['lat'], rx_lon=sites[1]['lon']))
        calls = []
        def run(q): calls.append(q);return fake_run(q)
        r = predict(Mock(run=run), p, sites)
        self.assertEqual(r['kind'], 'mesh')
        self.assertEqual([(l['tx_id'], l['rx_id']) for l in r['links']],
                         [('n1', 'n2'), ('n1', 'n3'), ('n2', 'n1'), ('n2', 'n3'), ('n3', 'n1'), ('n3', 'n2')])
        n2_to_n1 = calls[2]
        self.assertEqual((n2_to_n1['tx_lat'], n2_to_n1['rx_lat']), (26.21, 35.68))
        self.assertEqual((n2_to_n1['power_w'], n2_to_n1['noise']), (100, 150))
        self.assertEqual((n2_to_n1['tx_antenna'], n2_to_n1['tx_length_m']), ('dipole', 20))
        n1_to_n2 = calls[0]
        self.assertEqual((n1_to_n2['power_w'], n1_to_n2['noise'], n1_to_n2['rx_antenna']), (500, 145, 'dipole'))
        self.assertEqual(calls[5]['tx_gain'], 3)
        rel = {(l['tx_id'], l['rx_id']): l['hours'][0]['rows'][0]['reliability'] for l in r['links']}
        self.assertEqual(rel[('n1', 'n2')], round(35.68-26.21+50, 1))
        self.assertEqual(rel[('n2', 'n1')], round(26.21-35.68+50, 1))
        self.assertNotIn('raw_output', r['links'][0])
        self.assertEqual(r['parameters']['mesh_sites'], sites)

    def test_separate_receiving_antenna(self):
        data = copy.deepcopy(self.data)
        data['mesh_sites'][0]['receive'] = dict(antenna='vertical_dipole', length_m=10, height_m=8, gain=2)
        sites = prepare(data)
        self.assertEqual((sites[0]['antenna'], sites[0]['receive']['antenna']), ('whip', 'vertical_dipole'))
        self.assertEqual((sites[0]['receive']['length_m'], sites[0]['receive']['gain']), (10, 2))
        self.assertIsNone(sites[1]['receive'])
        p = validate(dict(data, tx_lat=sites[0]['lat'], tx_lon=sites[0]['lon'], rx_lat=sites[1]['lat'], rx_lon=sites[1]['lon']))
        calls = []
        def run(q): calls.append(q);return fake_run(q)
        predict(Mock(run=run), p, sites)
        n1_to_n2, n2_to_n1 = calls[0], calls[2]
        self.assertEqual(n1_to_n2['tx_antenna'], 'whip')
        self.assertEqual((n2_to_n1['rx_antenna'], n2_to_n1['rx_length_m'], n2_to_n1['rx_gain']), ('vertical_dipole', 10, 2))
        self.assertEqual((n2_to_n1['tx_antenna'], n2_to_n1['tx_length_m']), ('dipole', 20))
        self.assertEqual((n1_to_n2['rx_antenna'], n1_to_n2['rx_length_m']), ('dipole', 20))
        for bad in ['whip', dict(antenna='other'), dict(antenna='vertical_dipole', length_m=10, height_m=2)]:
            data['mesh_sites'][0]['receive'] = bad
            with self.subTest(bad=bad), self.assertRaises(InputError): prepare(data)

    def test_position_references_resolve_per_node(self):
        data = copy.deepcopy(self.data)
        data['mesh_sites'][2]['position_ref'] = dict(source='gw', id='ship')
        self.assertTrue(has_references(data))
        snapshot = dict(positions=[dict(source='gw', id='ship', lat=20, lon=140, stale=False, course_deg=45,
                                        expires_at='2999-01-01T00:00:00Z', prediction_compatible=True)])
        resolved, inputs = apply_snapshot(data, snapshot)
        self.assertEqual((resolved['mesh_sites'][2]['lat'], resolved['mesh_sites'][2]['lon']), (20, 140))
        self.assertEqual(resolved['mesh_sites'][2]['course_deg'], 45)
        # A node antenna fixed to the hull turns with the reported course.
        resolved['mesh_sites'][2].update(antenna='dipole', length_m=20, azimuth_deg=0, azimuth_mode='heading')
        sites = prepare(resolved)
        self.assertEqual(sites[2]['course_deg'], 45)
        q = pair(validate(dict(resolved, tx_lat=sites[0]['lat'], tx_lon=sites[0]['lon'], rx_lat=sites[1]['lat'], rx_lon=sites[1]['lon'])), sites[2], sites[0])
        self.assertEqual(beam_azimuth(q, 'tx'), 45)
        resolved['mesh_sites'][2].pop('course_deg')
        with self.assertRaises(InputError): prepare(resolved)
        self.assertIn('mesh_site_3', inputs)
        self.assertEqual(data['mesh_sites'][2]['lat'], 13.45)


if __name__ == '__main__':
    unittest.main()
