import json
import os
import re
from pathlib import Path
import sys
import tempfile
import threading
import unittest
import urllib.error
import urllib.request

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'))
SECRET='s'*40


class PublicModeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp=tempfile.TemporaryDirectory()
        os.environ['DATA_DIR']=cls.tmp.name
        os.environ['CHUCK_ADMIN_SECRET']=SECRET
        # Other tests reload server; import a fresh pair so public_server patches this one.
        for module in ('server','public_server'):sys.modules.pop(module,None)
        import server, public_server
        server.DB=Path(cls.tmp.name)/'public.sqlite3'
        cls.server,cls.public=server,public_server
        cls.http=server.ThreadingHTTPServer(('127.0.0.1',0),public_server.PublicHandler)
        threading.Thread(target=cls.http.serve_forever,daemon=True).start()
        cls.url=f'http://127.0.0.1:{cls.http.server_port}'

    @classmethod
    def tearDownClass(cls):
        cls.http.shutdown();cls.http.server_close();cls.tmp.cleanup()

    def request(self,path,data=None,admin=False):
        headers={'Content-Type':'application/json','Origin':self.url}
        if admin:headers['X-Chuck-Admin']=SECRET
        req=urllib.request.Request(self.url+path,data=json.dumps(data).encode() if data is not None else None,headers=headers)
        try:
            with urllib.request.urlopen(req) as r:return r.status,r.read()
        except urllib.error.HTTPError as e:return e.code,e.read()

    def test_config_reports_admin_only_with_secret(self):
        self.assertFalse(json.loads(self.request('/api/public-config')[1])['admin'])
        self.assertTrue(json.loads(self.request('/api/public-config',admin=True)[1])['admin'])
        req=urllib.request.Request(self.url+'/api/public-config',headers={'X-Chuck-Admin':'wrong'})
        with urllib.request.urlopen(req) as r:self.assertFalse(json.load(r)['admin'])

    def test_antenna_request_links_accept_only_safe_schemes(self):
        for value,expected in [('https://example.com/donate','https://example.com/donate'),('mailto:chuck@example.com','mailto:chuck@example.com'),
                               ('javascript:alert(1)',''),('http://example.com',''),('','')]:
            os.environ['CHUCK_DONATION_URL']=value
            self.assertEqual(json.loads(self.request('/api/public-config')[1])['donation_url'],expected,value)
        os.environ.pop('CHUCK_DONATION_URL',None)

    def test_admin_functions_are_closed_to_visitors(self):
        for path in ('/api/ai-settings','/api/antenna-imports','/api/antenna-imports/'+'0'*32,'/api/positions'):
            self.assertEqual(self.request(path)[0],403,path)
        for path in ('/api/ai-settings','/api/position-stations','/api/presets','/api/antenna-imports','/api/antenna-patterns','/api/antenna-patterns/'+'0'*32+'/delete'):
            self.assertEqual(self.request(path,{})[0],403,path)
        self.assertNotEqual(self.request('/api/ai-settings',admin=True)[0],403)

    def test_shared_history_is_hidden(self):
        self.server.save(dict(parameters={}),'point')
        self.assertEqual(json.loads(self.request('/api/history')[1]),[])
        self.assertGreaterEqual(len(json.loads(self.request('/api/history',admin=True)[1])),1)

    def test_presets_are_read_only_without_mobile_stations(self):
        status,body=self.request('/api/presets');catalog=json.loads(body)
        self.assertEqual(status,200);self.assertFalse(catalog['editable'])
        self.assertTrue(catalog['presets']);self.assertTrue(all(p['kind']!='mobile' for p in catalog['presets']))
        ids={a['id'] for a in catalog['antennas']}
        self.assertNotIn('reference-jmsdf-nat201',ids);self.assertIn('reference-usn-as2537c',ids)
        self.assertNotRegex(json.dumps(catalog['antennas'],ensure_ascii=False),'海自|自衛隊|JMSDF|防衛')
        p3=next(a for a in catalog['antennas'] if a['id']=='reference-air-p3-longwire')
        self.assertIn('2本を1本の全長として合算しない。',p3['reference']['notes'])
        # The filter still holds if a defense ministry reference comes back from upstream.
        mod=dict(id='m',reference=dict(operator='X',sources=['https://www.mod.go.jp/a.pdf']))
        note=dict(id='n',reference=dict(operator='Y',notes='残す。海自の記述。',sources=[]))
        filtered=self.public.public_presets(dict(presets=[],antennas=[mod,note]))['antennas']
        self.assertEqual([(a['id'],a['reference']['notes']) for a in filtered],[('n','残す。')])

    def test_index_loads_public_layer(self):
        status,body=self.request('/')
        self.assertEqual(status,200);self.assertIn(b'<script src="app.js"></script><script src="public.js"></script>',body)
        self.assertEqual(self.request('/public.js')[0],200)

    def test_live_positions_are_rejected(self):
        p=dict(tx_lat=35.3,tx_lon=139.67,rx_lat=13.45,rx_lon=144.75,year=2026,month=10)
        self.assertEqual(self.request('/api/predict',dict(p,rx_position=dict(source='a',id='b')))[0],400)
        sites=[dict(name='RX',position_ref=dict(source='a',id='b'))]
        self.assertEqual(self.request('/api/diversity',dict(p,rx_sites=sites))[0],400)
        self.assertEqual(self.request('/api/mesh',dict(p,mesh_sites=[dict(name='A',lat=1,lon=2),*sites]))[0],400)

    def test_calculations_are_rate_limited(self):
        previous=self.public.LIMITER
        self.public.LIMITER=self.public.RateLimiter(0,60)
        try:
            status,body=self.request('/api/predict',dict(tx_lat=35.3,tx_lon=139.67,rx_lat=13.45,rx_lon=144.75))
            self.assertEqual(status,429,body)
            # A mesh is the most expensive calculation and must never bypass the budget.
            status,body=self.request('/api/mesh',dict(mesh_sites=[dict(name='A',lat=35.3,lon=139.67),dict(name='B',lat=13.45,lon=144.75)]))
            self.assertEqual(status,429,body)
        finally:
            self.public.LIMITER=previous

    def test_effective_ssn_is_open_to_visitors_and_rate_limited(self):
        from unittest.mock import patch
        snapshot=dict(value=42.5,used_count=2,stations=[],error=None,note='fixture')
        with patch.object(self.server.EFFECTIVE_SSN,'snapshot',return_value=snapshot):
            status,body=self.request('/api/effective-ssn')
            self.assertEqual(status,200,body)
            self.assertEqual(json.loads(body)['value'],42.5)
            previous=self.public.LIMITER
            self.public.LIMITER=self.public.RateLimiter(0,60)
            try:
                status,body=self.request('/api/predict',dict(tx_lat=35.3,tx_lon=139.67,rx_lat=13.45,rx_lon=144.75,ssn_source='effective'))
                self.assertEqual(status,429,body)
            finally:
                self.public.LIMITER=previous

    def test_rate_limiter_window(self):
        now=[0.0]
        limiter=self.public.RateLimiter(5,60,clock=lambda:now[0])
        self.assertEqual(limiter.take('a',5),0)
        self.assertGreater(limiter.take('a',1),0)
        self.assertEqual(limiter.take('b',1),0)
        now[0]=61
        self.assertEqual(limiter.take('a',5),0)

    def test_admin_sets_rate_limit(self):
        public=self.public
        try:
            self.assertEqual(self.request('/api/admin/rate-limit')[0],403)
            status,body=self.request('/api/admin/rate-limit',admin=True);current=json.loads(body)
            self.assertEqual(status,200);self.assertIsNone(current['updated'])
            self.assertEqual(current['defaults']['budget'],public.RATE_DEFAULTS['budget'])
            # Visitors cannot change the limit.
            self.assertEqual(self.request('/api/admin/rate-limit',dict(current,budget=999))[0],403)
            cost=dict(current['cost'],**{'/api/predict':2})
            status,body=self.request('/api/admin/rate-limit',dict(budget=3,window_seconds=600,cost=cost),admin=True)
            self.assertEqual(status,200,body);saved=json.loads(body)
            self.assertEqual((saved['budget'],saved['window_seconds'],saved['cost']['/api/predict']),(3,600,2))
            self.assertEqual((public.LIMITER.budget,public.LIMITER.window,public.COST['/api/predict']),(3,600,2))
            cfg=json.loads(self.request('/api/public-config')[1])
            self.assertEqual((cfg['rate_budget'],cfg['rate_window_seconds'],cfg['cost']['/api/predict']),(3,600,2))
            # The saved value survives a restart: a fresh limiter picks it up from the database.
            public.LIMITER.configure(60,3600);public.RATE_SETTINGS.apply()
            self.assertEqual((public.LIMITER.budget,public.LIMITER.window),(3,600))
            for bad in (dict(budget=-1),dict(budget=1.5),dict(budget='3'),dict(window_seconds=30),dict(cost={'/api/predict':1}),dict(cost=dict(cost,**{'/api/mesh':0}))):
                status,body=self.request('/api/admin/rate-limit',dict(dict(budget=3,window_seconds=600,cost=cost),**bad),admin=True)
                self.assertEqual(status,400,bad)
            status,body=self.request('/api/admin/rate-limit',dict(reset=True),admin=True)
            self.assertEqual(status,200,body);self.assertIsNone(json.loads(body)['updated'])
            self.assertEqual(public.LIMITER.budget,public.RATE_DEFAULTS['budget'])
            self.assertEqual(public.COST,public.RATE_DEFAULTS['cost'])
        finally:
            public.RATE_SETTINGS.reset()

    def test_limits_admin_page_is_translated(self):
        status,body=self.request('/limits-admin.html');body=body.decode()
        self.assertEqual(status,200)
        order=[body.index(s) for s in ('limits-admin.js','i18n-messages.js','support-messages.js','i18n.js')]
        self.assertEqual(order,sorted(order))
        static=Path(__file__).resolve().parents[1]/'app'/'static'
        source=(static/'support-messages.js').read_text(encoding='utf-8')
        entries=json.loads('{'+source.split('const messages={',1)[1].split('\n };',1)[0]+'}')
        script=(static/'limits-admin.js').read_text(encoding='utf-8')
        for word in ('カバー範囲（周波数×時刻）','1回の消費ポイント','既定値で動作しています','既定値に戻しました'):
            self.assertIn("'"+word+"'",script);self.assertIn(word,entries)
        self.assertEqual(set(self.public.COST),set(re.findall(r"'(/api/[a-z-]+)':",script.split('LABELS=',1)[1].split('};',1)[0])))

    def test_old_results_are_pruned(self):
        with self.server.connection() as c:
            c.execute('INSERT INTO predictions VALUES (?,?,?,?)',('old'.ljust(32,'0'),'2000-01-01T00:00:00+00:00','point','{}'))
        self.server.save(dict(parameters={}),'point')
        with self.server.connection() as c:
            self.assertIsNone(c.execute('SELECT 1 FROM predictions WHERE created<?',('2001',)).fetchone())

    def test_position_reference_detection(self):
        self.assertTrue(self.public.references_positions({'rx_sites':[{'position_ref':{}}]}))
        self.assertTrue(self.public.references_positions({'tx_position':None}))
        self.assertFalse(self.public.references_positions({'rx_sites':[{'name':'RX'}]}))


if __name__=='__main__':
    unittest.main()
