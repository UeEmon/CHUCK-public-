import json
import os
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'))
from engine import Engine, InputError, cards, parse_output, validate, antenna_file, ANTENNAS

BASE={'tx_lat':35.3,'tx_lon':139.67,'rx_lat':13.45,'rx_lon':144.75,'year':2026,'month':10}
class CardsTests(unittest.TestCase):
    def test_geometry_validation_and_parameter_files(self):
        root=Path(__file__).resolve().parents[1]/'vendor/itshfbc/antennas'
        # Locate the upstream model templates independent of native installation.
        if not root.exists():root=next((Path(__file__).resolve().parents[1]/'vendor').rglob('sample.22')).parent.parent
        for model in ['monopole','dipole','vertical_dipole']:
            p=validate(dict(BASE,tx_antenna=model,tx_length_m=10,tx_height_m=12,tx_azimuth_deg=123,tx_ground_permittivity=25,tx_ground_conductivity=.03,tx_gain=4))
            self.assertEqual(validate(p),p)
            lines=antenna_file(p,'tx',(root/ANTENNAS[model]).read_text()).splitlines()
            self.assertEqual(float(lines[7].split()[0]),10)
            self.assertEqual(float(lines[4].split()[0]),25)
            self.assertEqual(float(lines[5].split()[0]),.03)
            self.assertEqual(float(lines[8 if model=='monopole' else 9].split()[0]),4)
        for values in [dict(tx_length_m=0),dict(tx_length_m=True),dict(tx_length_m=201),dict(tx_length_m=10,tx_height_m=0),dict(tx_length_m=10,tx_ground_conductivity=0),dict(tx_length_m=10,tx_azimuth_deg=360)]:
            with self.assertRaises(InputError):validate(dict(BASE,tx_antenna='dipole',**values))
        with self.assertRaises(InputError):validate(dict(BASE,tx_antenna='vertical_dipole',tx_length_m=20,tx_height_m=10))
    def test_upstream_reference_output(self):
        raw=(Path(__file__).resolve().parents[1]/'vendor/tests/p2p/test01.out').read_text()
        result=parse_output(raw,[6.07,7.2,9.7,11.85,13.7,15.35,17.73,21.65,25.89])
        self.assertEqual(len(result),24)
        h=next(h for h in result if h['hour_utc']==1)
        self.assertEqual(h['muf_mhz'],16.2)
        self.assertEqual(h['rows'][0]['snr_db_hz'],106)
        self.assertEqual(h['rows'][6]['reliability'],91)
        self.assertEqual(h['rows'][8]['signal_dbw'],-173)
    def test_card_widths_and_hemispheres(self):
        p=validate(dict(BASE,rx_lat=-33.87,rx_lon=-157.86))
        lines=cards(p).splitlines()
        circuit=next(x for x in lines if x.startswith('CIRCUIT'))
        self.assertEqual(circuit[35],'S')
        self.assertEqual(circuit[45],'W')
        ant=next(x for x in lines if x.startswith('ANTENNA'))
        self.assertEqual(ant[41:62].strip(),'default/swwhip.voa')
        self.assertAlmostEqual(float(ant[68:78]),.15)
    def test_invalid_input(self):
        for key,val in [('tx_lat',100),('ssn',float('nan')),('month',1.5),('power_w',True),('frequencies',[None]),('frequencies',[]),('frequencies',[1])]:
            with self.subTest(key=key,val=val), self.assertRaises(InputError):validate(dict(BASE,**{key:val}))
        with self.assertRaises(InputError):validate(dict(BASE,rx_lat=35.3,rx_lon=139.67))
    def test_radio_conditions_and_idempotent_snr_conversion(self):
        p=validate(dict(BASE,modulation='fsk',snr_input='bandwidth',bandwidth_hz=3000,inband_snr_db=10,
                        tx_polarization='vertical',rx_polarization='horizontal',polarization_loss_db=3))
        self.assertEqual(p['required_snr'],44.7712)
        self.assertEqual(validate(p),p)
        # Labels alone do not invent a different antenna/polarization model.
        a=validate(BASE);b=validate(dict(BASE,tx_polarization='rhcp',rx_polarization='lhcp'))
        self.assertEqual(cards(a),cards(b))
        tx=next(line for line in cards(p).splitlines() if line.startswith('ANTENNA'))
        self.assertAlmostEqual(float(tx[68:78]),.15*10**(-.3),delta=.000001)
        # Small powers remain nonzero after the largest supported assumed loss.
        small=cards(validate(dict(BASE,power_w=1,polarization_loss_db=30)))
        self.assertEqual(float(next(l for l in small.splitlines() if l.startswith('ANTENNA'))[68:78]),.000001)
        for key,value in [('modulation','unsupported'),('tx_polarization',True),('rx_polarization','bad'),('polarization_loss_db',-1),('polarization_loss_db',31),('snr_input','bad')]:
            with self.subTest(key=key),self.assertRaises(InputError):validate(dict(BASE,**{key:value}))
        for extra in [dict(bandwidth_hz=0,inband_snr_db=10),dict(bandwidth_hz=1,inband_snr_db=-40),dict(bandwidth_hz=1e6,inband_snr_db=60)]:
            with self.assertRaises(InputError):validate(dict(BASE,snr_input='bandwidth',**extra))

@unittest.skipUnless(Engine().ready(),'VOACAP_BIN and VOACAP_MODEL must point to a built engine')
class IntegrationTests(unittest.TestCase):
    def test_real_prediction_and_power_scaling(self):
        engine=Engine();p=validate(BASE)
        a=engine.run(p);b=engine.run(dict(p,power_w=p['power_w']*10))
        self.assertEqual(len(a['hours']),24)
        self.assertEqual(sum(len(h['rows']) for h in a['hours']),216)
        for ha,hb in zip(a['hours'],b['hours']):
            for ra,rb in zip(ha['rows'],hb['rows']):
                self.assertAlmostEqual(rb['signal_dbw']-ra['signal_dbw'],10,delta=1)
                self.assertTrue(0<=ra['reliability']<=100)
    def test_gain_controls(self):
        e=Engine()
        for antenna in ['whip','isotropic','monopole','dipole','vertical_dipole']:
            p=validate(dict(BASE,tx_antenna=antenna,rx_antenna=antenna,tx_length_m=10,rx_length_m=10,tx_height_m=12,rx_height_m=12,frequencies=[8]))
            a=e.run(p,12)['hours'][0]['rows'][0]
            b=e.run(dict(p,tx_gain=5,rx_gain=3),12)['hours'][0]['rows'][0]
            self.assertAlmostEqual(b['signal_dbw']-a['signal_dbw'],8,delta=1)
    def test_physical_dimensions_change_the_prediction(self):
        e=Engine();p=validate(dict(BASE,tx_antenna='dipole',tx_length_m=10,tx_height_m=12,frequencies=[4,8,16]))
        a=e.run(p);b=e.run(validate(dict(p,tx_length_m=35,tx_height_m=20,tx_azimuth_deg=90)))
        self.assertTrue(any(abs(ra['signal_dbw']-rb['signal_dbw'])>=2 for ha,hb in zip(a['hours'],b['hours']) for ra,rb in zip(ha['rows'],hb['rows'])))
    def test_assumed_polarization_loss_and_snr_threshold(self):
        e=Engine();p=validate(dict(BASE,frequencies=[8],required_snr=24,modulation='cw'))
        base=e.run(p);loss=e.run(validate(dict(p,polarization_loss_db=3)))
        high=e.run(validate(dict(p,required_snr=67,modulation='am')))
        changed=False
        for a,b,c in zip(base['hours'],loss['hours'],high['hours']):
            ar,br,cr=a['rows'][0],b['rows'][0],c['rows'][0]
            self.assertAlmostEqual(ar['signal_dbw']-br['signal_dbw'],3,delta=1)
            self.assertAlmostEqual(ar['snr_db_hz']-br['snr_db_hz'],3,delta=1)
            self.assertEqual(ar['signal_dbw'],cr['signal_dbw'])
            self.assertGreaterEqual(ar['reliability'],cr['reliability'])
            changed|=ar['reliability']!=cr['reliability']
        self.assertTrue(changed)
    def test_decimal_frequency_and_midnight(self):
        p=validate(dict(BASE,frequencies=[8.291,12.29],rx_lat=-33.87,rx_lon=-157.86))
        r=Engine().run(p,0)
        self.assertEqual([h['hour_utc'] for h in r['hours']],[0])
        self.assertEqual([v['frequency_mhz'] for v in r['hours'][0]['rows']],[8.291,12.29])

if __name__=='__main__':unittest.main()
