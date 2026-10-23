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
    def test_log_periodic_parameters_and_gain_correction(self):
        root=next((Path(__file__).resolve().parents[1]/'vendor').rglob('sample.43')).parent.parent
        p=validate(dict(BASE,tx_antenna='log_periodic',tx_length_m=25,tx_height_m=20,tx_lp_elements=12,tx_lp_tau=.88,tx_gain=3,rx_antenna='log_periodic',rx_length_m=20,rx_gain=-3))
        self.assertEqual((p['tx_lp_slope_deg'],p['tx_lp_apex_deg'],p['tx_lp_impedance_ohm']),(90,25,450))
        self.assertIsNone(validate(dict(BASE))['tx_lp_tau'])
        values=[float(x.split()[0]) for x in antenna_file(p,'tx',(root/ANTENNAS['log_periodic']).read_text()).splitlines()[2:14]]
        self.assertEqual(values[2:4]+values[5:],[13,.005,20,25,90,450,25,.88,12])
        # Type 43 has no gain slot: both corrections move to the TX card power (+3 dB -3 dB here).
        power=lambda q:float(next(x for x in cards(q).splitlines() if x.startswith('ANTENNA       1'))[68:78])
        self.assertAlmostEqual(power(p),1,places=5)
        self.assertAlmostEqual(power(dict(p,rx_gain=7)),10,places=4)
        self.assertAlmostEqual(power(validate(dict(BASE,power_w=100000))),100)
        for values in [dict(tx_lp_elements=2),dict(tx_lp_elements=12.5),dict(tx_lp_tau=.99),dict(tx_lp_slope_deg=91),dict(tx_height_m=0),dict(power_w=1,polarization_loss_db=30,tx_gain=-20)]:
            with self.assertRaises(InputError):validate(dict(BASE,tx_antenna='log_periodic',tx_length_m=25,**values))
    def test_wire_models_map_dimensions_and_offset_the_sloper_beam(self):
        root=next((Path(__file__).resolve().parents[1]/'vendor').rglob('sample.43')).parent.parent
        p=validate(dict(BASE,tx_antenna='inverted_l',tx_length_m=30,tx_height_m=12,rx_antenna='sloping_long_wire',rx_length_m=40,rx_height_m=2,rx_lw_slope_deg=15,rx_azimuth_deg=100))
        tx=[float(x.split()[0]) for x in antenna_file(p,'tx',(root/ANTENNAS['inverted_l']).read_text()).splitlines()[4:9]]
        rx=[float(x.split()[0]) for x in antenna_file(p,'rx',(root/ANTENNAS['sloping_long_wire']).read_text()).splitlines()[4:10]]
        self.assertEqual((tx[0],tx[1],tx[3],tx[4]),(13,.005,30,12))
        self.assertEqual((rx[3],rx[4],rx[5]),(15,40,2))
        self.assertIsNone(p['tx_lw_slope_deg'])
        antennas=[x for x in cards(p).splitlines() if x.startswith('ANTENNA')]
        self.assertEqual(float(antennas[1][63:68]),280) # beam_main is the rising direction
        with self.assertRaises(InputError):validate(dict(BASE,tx_antenna='inverted_l',tx_length_m=30,tx_height_m=0))
        with self.assertRaises(InputError):validate(dict(BASE,tx_antenna='sloping_long_wire',tx_length_m=30,tx_lw_slope_deg=91))
    def test_path_azimuth_mode_aims_each_end_at_the_other(self):
        from engine import bearing
        p=validate(dict(BASE,rx_lat=21.31,rx_lon=-157.86,tx_antenna='dipole',tx_length_m=20,tx_azimuth_deg=12,tx_azimuth_mode='path',
                        rx_antenna='dipole',rx_length_m=20,rx_azimuth_mode='path'))
        antennas=[x for x in cards(p).splitlines() if x.startswith('ANTENNA')]
        self.assertEqual(float(antennas[0][63:68]),round(bearing(35.3,139.67,21.31,-157.86),1))
        self.assertEqual(float(antennas[1][63:68]),round(bearing(21.31,-157.86,35.3,139.67),1))
        fixed=[x for x in cards(dict(p,tx_azimuth_mode='fixed')).splitlines() if x.startswith('ANTENNA')]
        self.assertEqual(float(fixed[0][63:68]),12)
        self.assertEqual(validate(dict(BASE))['tx_azimuth_mode'],'fixed')
        omni=validate(dict(BASE,tx_antenna='monopole',tx_length_m=10,tx_azimuth_deg=45,tx_azimuth_mode='path'))
        self.assertEqual(float(next(x for x in cards(omni).splitlines() if x.startswith('ANTENNA'))[63:68]),0)
        for mode in ['north',1,None]:
            with self.assertRaises(InputError):validate(dict(BASE,tx_antenna='dipole',tx_length_m=20,tx_azimuth_mode=mode))
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
        self.assertAlmostEqual(float(ant[68:78]),1)
    def test_invalid_input(self):
        for key,val in [('tx_lat',100),('ssn',float('nan')),('month',1.5),('power_w',True),('frequencies',[None]),('frequencies',[]),('frequencies',[1])]:
            with self.subTest(key=key,val=val), self.assertRaises(InputError):validate(dict(BASE,**{key:val}))
        with self.assertRaises(InputError):validate(dict(BASE,rx_lat=35.3,rx_lon=139.67))
    def test_radio_conditions_and_idempotent_snr_conversion(self):
        p=validate(dict(BASE,modulation='F1B',snr_input='bandwidth',bandwidth='3K00',inband_snr_db=10,
                        tx_polarization='vertical',rx_polarization='horizontal',polarization_loss_db=3))
        self.assertEqual(p['required_snr'],44.7712)
        self.assertEqual((p['modulation'],p['bandwidth'],p['bandwidth_hz']),('F1B','3K00',3000))
        self.assertEqual(validate(p),p)
        # Labels alone do not invent a different antenna/polarization model.
        a=validate(BASE);b=validate(dict(BASE,tx_polarization='rhcp',rx_polarization='lhcp'))
        self.assertEqual(cards(a),cards(b))
        tx=next(line for line in cards(p).splitlines() if line.startswith('ANTENNA'))
        self.assertAlmostEqual(float(tx[68:78]),10**(-.3),delta=.000001)
        # Small powers remain nonzero after the largest supported assumed loss.
        small=cards(validate(dict(BASE,power_w=1,polarization_loss_db=30)))
        self.assertEqual(float(next(l for l in small.splitlines() if l.startswith('ANTENNA'))[68:78]),.000001)
        for key,value in [('modulation','unsupported'),('tx_polarization',True),('rx_polarization','bad'),('polarization_loss_db',-1),('polarization_loss_db',31),('snr_input','bad')]:
            with self.subTest(key=key),self.assertRaises(InputError):validate(dict(BASE,**{key:value}))
        for extra in [dict(inband_snr_db=10),dict(bandwidth='3000',inband_snr_db=10),dict(bandwidth_hz=0,inband_snr_db=10),dict(bandwidth_hz=1,inband_snr_db=-40),dict(bandwidth_hz=1e6,inband_snr_db=60)]:
            with self.assertRaises(InputError):validate(dict(BASE,snr_input='bandwidth',**extra))

    def test_defaults(self):
        p=validate(BASE)
        self.assertEqual(p['power_w'],1000)
        self.assertEqual(p['frequencies'],[2,4,6,8,10,12,14,16,18,20])
        self.assertEqual(p['modulation'],'manual')
    def test_emission_designations(self):
        for code,hz in [('500H',500),('304H',304),('2K40',2400),('3K00',3000),('16K0',16000),('1M00',1000000),('2k40',2400)]:
            with self.subTest(code=code):
                p=validate(dict(BASE,modulation='J3E',bandwidth=code))
                self.assertEqual((p['bandwidth'],p['bandwidth_hz']),(code.upper(),hz))
                self.assertEqual(validate(p),p)
        for code in ['3000','3K0','0K50','K300','2K4O','3K000','2M00','',3000]:
            with self.subTest(code=code),self.assertRaises(InputError):validate(dict(BASE,bandwidth=code))
        for code in ['A1A','J3E','h3e','F1B','G1D','D7W','X1X']:
            self.assertEqual(validate(dict(BASE,modulation=code))['modulation'],code.upper())
        for code in ['J3','J3EE','Z3E','J4E','J3Z','ssb2']:
            with self.subTest(code=code),self.assertRaises(InputError):validate(dict(BASE,modulation=code))
        # Earlier mode names and receiver bandwidths in Hz still validate.
        legacy=validate(dict(BASE,modulation='ssb',snr_input='bandwidth',bandwidth_hz=2750,inband_snr_db=10))
        self.assertEqual((legacy['modulation'],legacy['bandwidth'],legacy['bandwidth_hz']),('J3E','2K75',2750))
        self.assertEqual(validate(dict(BASE,modulation='ofdm'))['modulation'],'manual')
    def test_absorption_mode_defaults_to_the_marine_setting(self):
        self.assertEqual(validate(dict(BASE))['absorption_mode'],'a')
        self.assertEqual(validate(dict(BASE,absorption_mode='W'))['absorption_mode'],'W')
        for value in ['A','I','w','',1,None]:
            with self.subTest(value=value),self.assertRaises(InputError):validate(dict(BASE,absorption_mode=value))

@unittest.skipUnless(Engine().ready(),'VOACAP_BIN and VOACAP_MODEL must point to a built engine')
class IntegrationTests(unittest.TestCase):
    def test_real_prediction_and_power_scaling(self):
        engine=Engine();p=validate(BASE)
        a=engine.run(p);b=engine.run(dict(p,power_w=p['power_w']*10))
        self.assertEqual(len(a['hours']),24)
        self.assertEqual(sum(len(h['rows']) for h in a['hours']),240)
        for ha,hb in zip(a['hours'],b['hours']):
            for ra,rb in zip(ha['rows'],hb['rows']):
                self.assertAlmostEqual(rb['signal_dbw']-ra['signal_dbw'],10,delta=1)
                self.assertTrue(0<=ra['reliability']<=100)
    def test_absorption_mode_reaches_the_engine(self):
        # Tokyo-Guam at 14 UTC is night at the path: W floors the absorption index, so
        # 4 MHz is weaker than with the Marine-compatible 'a'; daytime 1 UTC is unchanged.
        e=Engine();p=validate(dict(BASE,tx_lat=35.68,tx_lon=139.76,frequencies=[4.12]))
        night={m:e.run(dict(p,absorption_mode=m),14) for m in ('a','W')}
        self.assertIn('16.1207a',night['a']['raw_output']);self.assertIn('16.1207W',night['W']['raw_output'])
        self.assertGreater(night['a']['hours'][0]['rows'][0]['signal_dbw']-night['W']['hours'][0]['rows'][0]['signal_dbw'],3)
        day=[e.run(dict(p,absorption_mode=m),1)['hours'][0]['rows'][0]['signal_dbw'] for m in ('a','W')]
        self.assertEqual(day[0],day[1])
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
    def test_path_azimuth_turns_a_dipole_toward_the_other_station(self):
        # Tokyo-Honolulu runs roughly east, so a north-facing dipole is near end-fire.
        e=Engine();p=validate(dict(BASE,tx_lat=35.68,tx_lon=139.76,rx_lat=21.31,rx_lon=-157.86,tx_antenna='dipole',rx_antenna='dipole',
                                   tx_length_m=20,rx_length_m=20,frequencies=[14]))
        fixed=e.run(p,4)['hours'][0]['rows'][0]
        aimed=e.run(dict(p,tx_azimuth_mode='path',rx_azimuth_mode='path'),4)['hours'][0]['rows'][0]
        self.assertGreater(aimed['signal_dbw']-fixed['signal_dbw'],10)
    def test_log_periodic_has_a_front_and_a_back(self):
        e=Engine();p=validate(dict(BASE,tx_lat=35.68,tx_lon=139.76,rx_lat=21.31,rx_lon=-157.86,tx_antenna='log_periodic',
                                   tx_length_m=25,tx_height_m=20,tx_azimuth_mode='path',frequencies=[14]))
        front=e.run(p,4)['hours'][0]['rows'][0]
        from engine import bearing
        back=e.run(dict(p,tx_azimuth_mode='fixed',tx_azimuth_deg=round((bearing(35.68,139.76,21.31,-157.86)+180)%360,1)),4)['hours'][0]['rows'][0]
        self.assertGreater(front['signal_dbw']-back['signal_dbw'],10)
        stronger=e.run(dict(p,tx_gain=6),4)['hours'][0]['rows'][0]
        self.assertAlmostEqual(stronger['signal_dbw']-front['signal_dbw'],6,delta=1)
    def test_sloper_main_lobe_points_down_the_slope(self):
        e=Engine();p=validate(dict(BASE,tx_lat=35.68,tx_lon=139.76,rx_lat=40.71,rx_lon=-74.01,tx_antenna='sloping_long_wire',
                                   tx_length_m=40,tx_height_m=2,tx_lw_slope_deg=15,tx_azimuth_mode='path',frequencies=[7,14]))
        from engine import bearing
        aimed=e.run(p,4)['hours'][0]['rows']
        away=e.run(dict(p,tx_azimuth_mode='fixed',tx_azimuth_deg=round((bearing(35.68,139.76,40.71,-74.01)+180)%360,1)),4)['hours'][0]['rows']
        self.assertTrue(all(a['signal_dbw']>b['signal_dbw'] for a,b in zip(aimed,away)))
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
