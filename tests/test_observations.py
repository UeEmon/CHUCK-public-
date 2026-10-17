import io
import json
from pathlib import Path
import sys
import tempfile
import time
import unittest
from unittest.mock import patch

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'))
from observations import Observations, parse_drap, parse_nict, parse_giro, is_old, DRAP_URL, NICT_URL

# Synthetic fixtures: no third-party observations are redistributed with tests.
DRAP='''# DRAP Tabular Values
# Product Valid At : 2026-10-15 06:00 UTC
 -120 0 120
 60 | 0.0 5.0 -1
 -60 | 10.0 NaN 20.0
'''
NICT='''Station : TO536
 Latest data : 2026/10/15 00:15 (JST=UT+9)
 ------ F region ------
 3000, 4.0, 22.0|...
 Vertical, 1.0, 7.0|...
 ------ E region ------
 3000, 1.0, 5.0|...
 Vertical, 0.5, 2.0|...
'''
GIRO='''# Global Ionospheric Radio Observatory (GIRO)
# Location: GEO ( 54.6 N 13.4 E ), URSI-Code JR055, JULIUSRUH
# Time                    CS   foF2 QD MUF(D) QD
2026-10-15T06:00:00.000Z 90 5.0 // 17.5 //
2026-10-15T06:05:00.000Z 20 NaN // -1 //
'''

class ParserTests(unittest.TestCase):
    def test_drap_missing_distinct_from_zero_and_variable_grid(self):
        d=parse_drap(DRAP)
        self.assertEqual(d['rows'][0]['values'],[0.,5.,None])
        self.assertEqual(d['rows'][1]['values'],[10.,None,20.])
        self.assertEqual(d['observed_at'],'2026-10-15T06:00:00+00:00')
        json.dumps(d,allow_nan=False)

    def test_drap_rejects_truncated_or_wrong_format(self):
        for text in ['error page',DRAP.replace('10.0 NaN 20.0','10.0 NaN')]:
            with self.assertRaises(ValueError):parse_drap(text)

    def test_nict_jst_previous_utc_day_and_f_region_only(self):
        s=parse_nict(NICT)['stations'][0]
        self.assertEqual(s['observed_at'],'2026-10-14T15:15:00+00:00')
        self.assertEqual(s['fof2_mhz'],7.)
        self.assertEqual(s['bands'][0]['muf_mhz'],22.)
        self.assertEqual(len(s['bands']),2)
        with self.assertRaises(ValueError):parse_nict('maintenance')

    def test_giro_preserves_quality_and_missing(self):
        d=parse_giro(GIRO,'JR055')
        self.assertIsNone(d['latest']['fof2_mhz'])
        self.assertIsNone(d['latest']['muf3000_mhz'])
        self.assertEqual(d['latest']['confidence'],20)
        self.assertEqual(d['series'][0]['muf3000_mhz'],17.5)
        self.assertEqual(d['lat'],54.6)
        with self.assertRaises(ValueError):parse_giro(GIRO,'GU513')
        with self.assertRaises(ValueError):parse_giro(GIRO.replace('CS   foF2','foF2   CS'),'JR055')

    def test_age_limits(self):
        t=time.time()
        from datetime import datetime,timezone
        iso=lambda seconds:datetime.fromtimestamp(seconds,timezone.utc).isoformat()
        self.assertFalse(is_old(iso(t-100),now=t))
        for v in [None,'unknown',iso(t-3601),iso(t+301)]:self.assertTrue(is_old(v,now=t))

class CacheTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.o=Observations(self.tmp.name)
    def download(self,request,**kwargs):
        return io.BytesIO((DRAP if request.full_url==DRAP_URL else NICT).encode())
    def test_partial_failure_returns_domestic_data(self):
        def get(req,**kwargs):
            if req.full_url==DRAP_URL:raise OSError('offline')
            return self.download(req)
        with patch('observations.urlopen',side_effect=get):
            s=self.o.snapshot()
        self.assertIsNone(s['drap']['data']);self.assertTrue(s['drap']['stale'])
        self.assertEqual(len(s['nict']['data']['stations']),1)
    def test_force_reloads_fresh_cache_and_failure_retains_fetch_time(self):
        with patch('observations.urlopen',side_effect=self.download) as get:
            a=self.o.fetch('drap',DRAP_URL,parse_drap)
            b=self.o.fetch('drap',DRAP_URL,parse_drap)
            self.assertEqual(get.call_count,1);self.assertEqual(b['fetch_state'],'cache')
            c=self.o.fetch('drap',DRAP_URL,parse_drap,force=True)
            self.assertEqual(get.call_count,2);self.assertEqual(c['fetch_state'],'downloaded')
        with patch('observations.urlopen',side_effect=OSError('offline')) as get:
            failed=self.o.fetch('drap',DRAP_URL,parse_drap,force=True)
            self.assertEqual(failed['fetched_at'],c['fetched_at']);self.assertEqual(failed['fetch_state'],'failed')
            self.o.fetch('drap',DRAP_URL,parse_drap,force=True);self.assertEqual(get.call_count,1)
    def test_disk_cache_and_failure_retry(self):
        with patch('observations.urlopen',side_effect=self.download) as get:
            self.o.fetch('drap',DRAP_URL,parse_drap)
            fresh=Observations(self.tmp.name).fetch('drap',DRAP_URL,parse_drap)
            self.assertEqual(get.call_count,1)
            self.assertIsNotNone(fresh['data'])
        self.o.memory['drap']['fetched_at']=time.time()-400
        with patch('observations.urlopen',side_effect=OSError('offline')) as get:
            a=self.o.fetch('drap',DRAP_URL,parse_drap)
            b=self.o.fetch('drap',DRAP_URL,parse_drap)
            self.assertTrue(a['stale']);self.assertEqual(a['data'],b['data']);self.assertEqual(get.call_count,1)
    def test_giro_disabled_does_not_contact_provider(self):
        with patch('observations.urlopen',side_effect=AssertionError('must not contact')):
            self.assertFalse(self.o.giro('GU513')['enabled'])
        with self.assertRaises(ValueError):self.o.giro('../../test')
    def test_giro_enabled_posts_fixed_query(self):
        o=Observations(self.tmp.name,giro_enabled=True)
        with patch('observations.urlopen',return_value=io.BytesIO(GIRO.encode())) as get:
            data=o.giro('JR055')
        self.assertTrue(data['enabled']);self.assertEqual(data['data']['code'],'JR055')
        req=get.call_args.args[0]
        self.assertIn(b'location=JR055',req.data);self.assertIn(b'DMUF=3000',req.data)

class EndpointTests(unittest.TestCase):
    def test_observation_endpoints_and_invalid_station(self):
        import importlib,os,threading
        from http.server import ThreadingHTTPServer
        from urllib.request import urlopen
        from urllib.error import HTTPError
        with tempfile.TemporaryDirectory() as directory,patch.dict(os.environ,{'DATA_DIR':directory,'HF_GIRO_ENABLED':'0'}):
            import server
            server=importlib.reload(server)
            with patch.object(server.OBSERVATIONS,'snapshot',return_value={'drap':{'data':None},'nict':{'data':None}}):
                http=ThreadingHTTPServer(('127.0.0.1',0),server.Handler)
                thread=threading.Thread(target=http.serve_forever,daemon=True);thread.start()
                base='http://127.0.0.1:'+str(http.server_port)
                try:
                    with urlopen(base+'/api/observations') as r:self.assertIn('drap',json.load(r))
                    with urlopen(base+'/api/observations/giro?station=GU513') as r:self.assertFalse(json.load(r)['enabled'])
                    with self.assertRaises(HTTPError) as error:urlopen(base+'/api/observations/giro?station=BAD')
                    self.assertEqual(error.exception.code,400)
                finally:http.shutdown();thread.join();http.server_close()

if __name__=='__main__':unittest.main()
