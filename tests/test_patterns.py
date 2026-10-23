"""User gain tables: CSV grid validation, slicing, Type 14 files and engine use."""
import json
import os
from pathlib import Path
import sqlite3
import sys
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'))
from engine import Engine, InputError, cards, validate
from patterns import PatternStore, parse_csv, slice_table, type14_file
from presets import PresetStore

BASE=dict(tx_lat=35.68,tx_lon=139.76,rx_lat=21.31,rx_lon=-157.86,year=2026,month=10)


def csv_text(gain,freqs=(2,30),azims=range(0,360,10),elevs=range(0,91,10)):
    rows=['frequency_mhz,azimuth_deg,elevation_deg,gain_dbi']
    rows+=[f'{f},{a},{e},{gain(f,a,e)}' for f in freqs for a in azims for e in elevs]
    return '\n'.join(rows)


# Nose lobe: 0 dBi within 10 degrees of the reference heading, -20 dBi elsewhere.
NOSE=lambda f,a,e:0 if a in (0,10,350) else -20


class GridTests(unittest.TestCase):
    def test_csv_must_be_a_complete_grid(self):
        grid=parse_csv('﻿# comment\n'+csv_text(lambda f,a,e:e/10))
        self.assertEqual((grid['frequencies_mhz'],len(grid['azimuths_deg']),len(grid['elevations_deg'])),([2,30],36,10))
        good=csv_text(lambda f,a,e:0).splitlines()
        for bad,message in [('a,b,c,d\n1,0,0,0','見出し'),('\n'.join(good[:-1]),'格子'),('\n'.join(good+[good[1]]),'重複'),
                            ('\n'.join(good[:1]+['31,0,0,0']),'周波数'),('\n'.join(good[:1]+['2,0,91,0']),'仰角'),
                            ('\n'.join(good[:1]+['2,0,0,x']),'数値'),('\n'.join(good[:1]+['2,0,0,0','2,0,10,nan']),'有限'),
                            ('\n'.join(good[:1]+['2,0,0,0']),'仰角は2点'),('',"空")]:
            with self.assertRaisesRegex(InputError,message):parse_csv(bad)

    def test_downloadable_template_imports_as_is(self):
        raw=(Path(__file__).resolve().parents[1]/'app/static/antenna-pattern-template.csv').read_text(encoding='utf-8')
        grid=parse_csv(raw)
        self.assertEqual((len(grid['frequencies_mhz']),len(grid['azimuths_deg']),len(grid['elevations_deg'])),(4,8,6))
        self.assertIn('架空',raw)   # the example values must not pass for a real antenna

    def test_slicing_interpolates_and_wraps_azimuth(self):
        grid=parse_csv(csv_text(lambda f,a,e:(-10 if a==180 else 0)+e/10+(f-2)/28,azims=(0,90,180,270)))
        self.assertAlmostEqual(slice_table(grid,180)[1][0],-10)   # 2 MHz, 0 deg
        self.assertAlmostEqual(slice_table(grid,135)[1][0],-5)    # halfway between 90 and 180
        self.assertAlmostEqual(slice_table(grid,315)[1][0],0)     # wraps between 270 and 0
        self.assertAlmostEqual(slice_table(grid,0)[0][45],4.5)    # 1 MHz clamps to 2 MHz
        self.assertAlmostEqual(slice_table(grid,0)[15][90],9.5)   # 16 MHz is halfway in frequency
        lines=type14_file(grid,0,3,'CHUCK TX').splitlines()
        self.assertEqual(len(lines),5+30*10)
        self.assertEqual(float(lines[2].split()[0]),3)
        self.assertEqual(lines[5][:9],' 1   0.0 ')
        self.assertTrue(all(len(x)==9+7*10 for x in lines[5:14]) and len(lines[14])==9+7)


class StoreTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();db=Path(self.tmp.name)/'c.sqlite3'
        self.connect=lambda:sqlite3.connect(db)
        self.patterns=PatternStore(self.connect);self.presets=PresetStore(self.connect)
    def tearDown(self):self.tmp.cleanup()
    def test_presets_reference_existing_tables_and_block_deletion(self):
        item=self.patterns.import_csv(dict(name='P-3 nose',source='NEC model',csv=csv_text(NOSE)))
        self.assertEqual((item['azimuth_count'],item['max_gain_dbi']),(36,0))
        with self.assertRaisesRegex(InputError,'同じ名称'):self.patterns.import_csv(dict(name='P-3 nose',csv=csv_text(NOSE)))
        grid,digest=self.patterns.grid(item['id']);self.assertEqual(digest,item['sha256'])
        edit=lambda **p:self.presets.edit(dict(revision=self.presets.snapshot()['revision'],collection='antennas',action='save',preset=p))
        with self.assertRaisesRegex(InputError,'利得表'):edit(name='No table',model='pattern_table')
        with self.assertRaisesRegex(InputError,'利得表がありません'):edit(name='Missing',model='pattern_table',pattern_id='f'*32)
        key=edit(name='Airframe',model='pattern_table',pattern_id=item['id'],azimuth_mode='path')['id']
        row=next(a for a in self.presets.snapshot()['antennas'] if a['id']==key)
        self.assertEqual((row['pattern_id'],row['length_m']),(item['id'],None))
        with self.assertRaisesRegex(InputError,'先に削除'):self.patterns.delete(item['id'])
        self.presets.edit(dict(revision=self.presets.snapshot()['revision'],collection='antennas',action='delete',id=key))
        self.patterns.delete(item['id']);self.assertEqual(self.patterns.list(),[])
        with self.assertRaises(InputError):self.patterns.grid(item['id'])

    def test_validation_and_cards(self):
        with self.assertRaises(InputError):validate(dict(BASE,tx_antenna='pattern_table'))
        p=validate(dict(BASE,tx_antenna='pattern_table',tx_pattern_id='a'*32,tx_azimuth_deg=40))
        self.assertIsNone(validate(dict(BASE))['tx_pattern_id'])
        line=next(x for x in cards(p).splitlines() if x.startswith('ANTENNA       1'))
        self.assertEqual(float(line[63:68]),0)  # the table is pre-sliced at the path azimuth


@unittest.skipUnless(Engine().ready(),'VOACAP_BIN and VOACAP_MODEL must point to a built engine')
class EngineTests(unittest.TestCase):
    def test_tables_drive_the_prediction(self):
        tables={'0'*32:(parse_csv(csv_text(lambda f,a,e:0)),'flat'),'1'*32:(parse_csv(csv_text(NOSE)),'nose')}
        e=Engine();e.patterns=lambda key:tables[key]
        q=dict(BASE,frequencies=[7,14])
        signal=lambda p:[r['signal_dbw'] for r in e.run(p,4)['hours'][0]['rows']]
        # A flat 0 dBi table is exactly the isotropic model; the gain correction adds on top.
        self.assertEqual(signal(validate(dict(q,tx_antenna='pattern_table',tx_pattern_id='0'*32))),signal(validate(dict(q,tx_antenna='isotropic'))))
        flat=signal(validate(dict(q,tx_antenna='pattern_table',tx_pattern_id='0'*32,tx_gain=5)))
        self.assertEqual([a-b for a,b in zip(flat,signal(validate(dict(q,tx_antenna='isotropic'))))],[5,5])
        aimed=e.run(validate(dict(q,rx_antenna='pattern_table',rx_pattern_id='1'*32,rx_azimuth_mode='path')),4)
        away=signal(validate(dict(q,rx_antenna='pattern_table',rx_pattern_id='1'*32,rx_azimuth_deg=0)))
        self.assertTrue(all(a['signal_dbw']-b>=15 for a,b in zip(aimed['hours'][0]['rows'],away)))
        self.assertEqual((aimed['parameters']['rx_pattern_sha256'],aimed['parameters']['rx_pattern_offset_deg']),('nose',0))

    def test_api_import_predict_and_delete(self):
        with tempfile.TemporaryDirectory() as tmp:
            os.environ['DATA_DIR']=tmp
            import server
            server.DB=Path(tmp)/'test.sqlite3';server.PATTERNS.cache.clear()
            http=server.ThreadingHTTPServer(('127.0.0.1',0),server.Handler)
            threading.Thread(target=http.serve_forever,daemon=True).start()
            url=f'http://127.0.0.1:{http.server_port}'
            def request(path,data=None,origin=True):
                headers={'Content-Type':'application/json',**({'Origin':url} if origin else {})}
                return json.load(urllib.request.urlopen(urllib.request.Request(url+path,data=json.dumps(data).encode() if data is not None else None,headers=headers)))
            try:
                with self.assertRaises(urllib.error.HTTPError) as denied:request('/api/antenna-patterns',dict(name='x',csv=csv_text(NOSE)),origin=False)
                self.assertEqual(denied.exception.code,403)
                item=request('/api/antenna-patterns',dict(name='Nose',csv=csv_text(NOSE)))
                self.assertEqual([p['id'] for p in request('/api/antenna-patterns')['patterns']],[item['id']])
                r=request('/api/predict',dict(BASE,tx_antenna='pattern_table',tx_pattern_id=item['id'],tx_azimuth_mode='path',frequencies=[14]))
                self.assertEqual(r['parameters']['tx_pattern_sha256'],item['sha256'])
                with self.assertRaises(urllib.error.HTTPError) as bad:request('/api/antenna-patterns',dict(name='Bad',csv='a,b'))
                self.assertEqual(bad.exception.code,400)
                self.assertTrue(request('/api/antenna-patterns/'+item['id']+'/delete',{})['deleted'])
                with self.assertRaises(urllib.error.HTTPError) as gone:request('/api/predict',dict(BASE,tx_antenna='pattern_table',tx_pattern_id=item['id']))
                self.assertEqual(gone.exception.code,400)
            finally:
                http.shutdown();http.server_close()


if __name__=='__main__':unittest.main()
