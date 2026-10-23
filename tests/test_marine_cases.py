import json
from pathlib import Path
import sys
import unittest

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
from compare_marine import compare

class MarineCasesTests(unittest.TestCase):
    def test_recorded_cases_cover_every_hour_and_band(self):
        spec=json.loads((ROOT/'docs/validation/marine-cases.json').read_text())
        bands=spec['defaults']['frequencies']
        for case in spec['cases']:
            rel=case['marine']['rel']
            self.assertEqual(sorted(map(int,rel)),list(range(24)),case['id'])
            for values in rel.values():
                self.assertEqual([float(f) for f in values],bands,case['id'])
                self.assertTrue(all(0<=v<=100 for v in values.values()))
    def test_compare_matches_hours_and_bands(self):
        app={'hours':[{'hour_utc':h,'muf_mhz':10,'rows':[{'frequency_mhz':4.12,'reliability':h,'snr_db_hz':40,'signal_dbw':-100}]} for h in range(24)]}
        # Marine hour 24 is 0 UTC.
        points,stats=compare({'marine':{'rel':{'24':{'4.12':3},'5':{'4.12':5}},'sdbw':{'5':{'4.12':-104}}}},app)
        self.assertEqual([(p['hour_utc'],p['difference']) for p in points if p['metric']=='rel'],[(0,-3),(5,0)])
        self.assertEqual(stats['rel']['max_absolute'],3)
        self.assertEqual(stats['sdbw']['mean'],4)

if __name__=='__main__':unittest.main()
