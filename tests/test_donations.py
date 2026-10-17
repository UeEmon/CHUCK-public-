import base64
from datetime import datetime, timezone
import hashlib
import hmac
import json
import os
from pathlib import Path
import sys
import tempfile
import threading
import uuid
import unittest
import urllib.error
import urllib.request

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'))
SECRET='s'*40
WEBHOOK='sponsors-test-secret'
PDF=b'%PDF-1.4\n%test\n'


def sponsorship(action,node,login,cents=500,one_time=False,privacy='public'):
    return dict(action=action,sponsorship=dict(node_id=node,created_at=datetime.now(timezone.utc).isoformat(),
                sponsor=dict(login=login),privacy_level=privacy,tier=dict(monthly_price_in_cents=cents,is_one_time=one_time)))


class DonationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp=tempfile.TemporaryDirectory()
        os.environ['DATA_DIR']=cls.tmp.name
        os.environ['CHUCK_ADMIN_SECRET']=SECRET
        os.environ['GITHUB_SPONSORS_WEBHOOK_SECRET']=WEBHOOK
        # Other tests reload server; import a fresh pair so public_server patches this one.
        for module in ('server','public_server'):sys.modules.pop(module,None)
        import server, public_server, donations
        server.DB=Path(cls.tmp.name)/'donations.sqlite3'
        cls.server,cls.public,cls.donations=server,public_server,donations
        cls.http=server.ThreadingHTTPServer(('127.0.0.1',0),public_server.PublicHandler)
        threading.Thread(target=cls.http.serve_forever,daemon=True).start()
        cls.url=f'http://127.0.0.1:{cls.http.server_port}'

    @classmethod
    def tearDownClass(cls):
        cls.http.shutdown();cls.http.server_close();cls.tmp.cleanup()
        os.environ.pop('GITHUB_SPONSORS_WEBHOOK_SECRET',None)

    def setUp(self):
        self.public.UPLOAD_LIMITER=self.public.RateLimiter(100,3600)

    def request(self,path,data=None,admin=False,headers=None,raw=None):
        h={'Content-Type':'application/json','Origin':self.url}
        if admin:h['X-Chuck-Admin']=SECRET
        h.update(headers or {})
        body=raw if raw is not None else (json.dumps(data).encode() if data is not None else None)
        req=urllib.request.Request(self.url+path,data=body,headers=h)
        try:
            with urllib.request.urlopen(req) as r:return r.status,r.read()
        except urllib.error.HTTPError as e:return e.code,e.read()

    def deliver(self,event,secret=WEBHOOK,kind='sponsorship',delivery=None):
        body=json.dumps(event).encode()
        signature='sha256='+hmac.new(secret.encode(),body,hashlib.sha256).hexdigest()
        return self.request('/api/sponsors/webhook',raw=body,headers={'X-Hub-Signature-256':signature,'X-GitHub-Event':kind,'X-GitHub-Delivery':delivery or str(uuid.uuid4())})

    def ledger(self):
        return json.loads(self.request('/api/admin/donations',admin=True)[1])

    def row(self,login):
        return next(s for s in self.ledger()['sponsorships'] if s['login']==login)

    def test_signature_is_required(self):
        event=sponsorship('created','S_bad','badsig')
        self.assertEqual(self.deliver(event,secret='other-secret-value')[0],400)
        self.assertEqual(self.request('/api/sponsors/webhook',raw=json.dumps(event).encode(),headers={'X-GitHub-Event':'sponsorship'})[0],400)
        self.assertFalse([s for s in self.ledger()['sponsorships'] if s['login']=='badsig'])
        self.assertEqual(json.loads(self.deliver({'zen':'x'},kind='ping')[1])['received'],'ping')

    def test_redelivery_is_applied_once(self):
        event=sponsorship('created','S_once','once-user',cents=1000)
        delivery=str(uuid.uuid4())
        self.assertEqual(json.loads(self.deliver(event,delivery=delivery)[1])['received'],'created')
        self.assertEqual(json.loads(self.deliver(event,delivery=delivery)[1])['received'],'duplicate')
        self.assertEqual(len([e for e in self.ledger()['events'] if e['login']=='once-user']),1)

    def test_monthly_lifecycle(self):
        before=self.ledger()['monthly_usd']
        self.deliver(sponsorship('created','S_life','life-user',cents=500))
        self.assertEqual(self.ledger()['monthly_usd'],before+5)
        self.deliver(sponsorship('tier_changed','S_life','life-user',cents=1000))
        self.assertEqual(self.ledger()['monthly_usd'],before+10)
        self.deliver(sponsorship('pending_cancellation','S_life','life-user',cents=1000))
        self.assertEqual(self.row('life-user')['state'],'pending_cancellation');self.assertEqual(self.ledger()['monthly_usd'],before+10)
        self.deliver(sponsorship('cancelled','S_life','life-user',cents=1000))
        self.assertEqual(self.row('life-user')['state'],'cancelled');self.assertEqual(self.ledger()['monthly_usd'],before)
        # A late tier change after cancellation does not revive it.
        self.deliver(sponsorship('tier_changed','S_life','life-user',cents=2000))
        self.assertEqual(self.row('life-user')['state'],'cancelled')

    def test_one_time_counts_this_month_only_when_made_this_month(self):
        before=self.ledger()['one_time_usd']
        self.deliver(sponsorship('created','S_now','now-user',cents=2500,one_time=True))
        self.assertEqual(self.ledger()['one_time_usd'],before+25)
        old=sponsorship('created','S_old','old-user',cents=2500,one_time=True);old['sponsorship']['created_at']='2020-01-01T00:00:00+00:00'
        self.deliver(old)
        self.assertEqual(self.ledger()['one_time_usd'],before+25)

    def test_only_public_sponsors_are_listed_and_can_be_hidden(self):
        self.deliver(sponsorship('created','S_pub','public-user'))
        self.deliver(sponsorship('created','S_priv','private-user',privacy='secret'))
        names=json.loads(self.request('/api/support/summary')[1])['supporters']
        self.assertIn('public-user',names);self.assertNotIn('private-user',names)
        self.assertEqual(self.request('/api/admin/supporters/public-user',dict(hidden=True),admin=True)[0],200)
        self.assertNotIn('public-user',json.loads(self.request('/api/support/summary')[1])['supporters'])

    def test_catalog_needs_login_consent_and_document(self):
        self.deliver(sponsorship('created','S_cat','cat-user',privacy='secret'))
        send=lambda **kw:self.request('/api/support/catalog',dict(dict(login='@cat-user',consent=True,filename='a.pdf',content=base64.b64encode(PDF).decode()),**kw))
        self.assertEqual(send(consent=False)[0],400)
        self.assertEqual(send(login='not a login')[0],400)
        self.assertEqual(send(content=base64.b64encode(b'<html>').decode())[0],400)
        self.assertEqual(send()[0],201)
        # Someone without a sponsorship gets the same answer; private sponsors are not revealed.
        self.assertEqual(send(login='no-sponsor-here')[0],201)
        self.assertEqual(self.request('/api/support/catalog',dict(login='cat-user',consent=True,content=''),headers={'Origin':'https://evil.example'})[0],403)
        listed={c['login']:c for c in json.loads(self.request('/api/admin/catalog-requests',admin=True)[1])}
        item=listed['cat-user']
        self.assertEqual((item['status'],item['media_type'],item['sponsor_state']),('pending','application/pdf','active'))
        self.assertEqual(listed['no-sponsor-here']['sponsor_state'],'')
        status,body=self.request(f'/api/admin/catalog-requests/{item["id"]}/file',admin=True)
        self.assertEqual((status,body),(200,PDF))
        self.assertEqual(self.request(f'/api/admin/catalog-requests/{item["id"]}',dict(status='registered',antenna_preset_id='user-1'),admin=True)[0],200)
        item=next(c for c in json.loads(self.request('/api/admin/catalog-requests',admin=True)[1]) if c['id']==item['id'])
        self.assertEqual((item['status'],item['antenna_preset_id']),('registered','user-1'))

    def test_catalog_limit_per_login(self):
        body=dict(login='limit-user',consent=True,filename='a.pdf',content=base64.b64encode(PDF).decode())
        for _ in range(self.donations.MAX_PER_LOGIN):self.assertEqual(self.request('/api/support/catalog',body)[0],201)
        self.assertEqual(self.request('/api/support/catalog',dict(body,login='LIMIT-user'))[0],400)

    def test_admin_ledger_is_closed_to_visitors(self):
        for path in ('/api/admin/donations','/api/admin/catalog-requests','/api/admin/catalog-requests/'+'0'*32+'/file'):
            self.assertEqual(self.request(path)[0],403,path)
        self.assertEqual(self.request('/api/admin/catalog-requests/'+'0'*32,dict(status='declined'))[0],403)
        self.assertEqual(self.request('/api/admin/catalog-requests/'+'0'*32,dict(status='declined'),admin=True,headers={'Origin':'https://evil.example'})[0],403)

    def test_running_cost_is_added_to_the_fixed_goal(self):
        cost='/api/admin/running-cost'
        self.assertEqual(self.request(cost,dict(source='oracle',usd=1))[0],403)
        self.assertEqual(self.request(cost,dict(source='oracle',usd=1),admin=True,headers={'Origin':'https://evil.example'})[0],403)
        for bad in (-1,'3',True,float('inf'),None):
            self.assertEqual(self.request(cost,raw=json.dumps(dict(source='oracle',usd=bad)).encode(),admin=True)[0],400,bad)
        os.environ['CHUCK_MONTHLY_COST_USD']='2'
        try:
            status,body=self.request(cost,dict(source='oracle',usd=3.456),admin=True)
            self.assertEqual((status,json.loads(body)['goal_usd']),(200,5.46))
            self.assertEqual(json.loads(self.request('/api/support/summary')[1])['goal_usd'],5.46)
            ledger=self.ledger()
            self.assertEqual((ledger['fixed_cost_usd'],[c['usd'] for c in ledger['running_costs']]),(2,[3.46]))
            # A report the timer stopped refreshing no longer counts.
            with self.server.connection() as c:c.execute("UPDATE running_costs SET updated='2000-01-01T00:00:00+00:00'")
            self.assertEqual(json.loads(self.request('/api/support/summary')[1])['goal_usd'],2)
        finally:
            os.environ.pop('CHUCK_MONTHLY_COST_USD',None)
            with self.server.connection() as c:c.execute('DELETE FROM running_costs')

    def test_config_points_to_built_in_catalog_page(self):
        cfg=json.loads(self.request('/api/public-config')[1])
        self.assertTrue(cfg['donations']);self.assertEqual(cfg['contact_url'],'/catalog.html')

    def test_index_loads_public_translations_before_i18n(self):
        body=self.request('/')[1].decode()
        self.assertLess(body.index('public-messages.js'),body.index('i18n.js'))
        self.assertGreater(body.index('public-messages.js'),body.index('i18n-messages.js'))


    def test_admin_page_is_translated(self):
        status,body=self.request('/support-admin.html');body=body.decode()
        self.assertEqual(status,200);self.assertIn('id="language"',body)
        order=[body.index(s) for s in ('support-admin.js','i18n-messages.js','support-messages.js','i18n.js')]
        self.assertEqual(order,sorted(order))
        source=(Path(__file__).resolve().parents[1]/'app'/'static'/'support-messages.js').read_text(encoding='utf-8')
        entries=json.loads('{'+source.split('const messages={',1)[1].split('\n };',1)[0]+'}')
        self.assertTrue(all(len(v)==7 and all(v) for v in entries.values()))
        script=(Path(__file__).resolve().parents[1]/'app'/'static'/'support-admin.js').read_text(encoding='utf-8')
        for word in ('未処理','解約予定','非表示にする','保存しました','記録なし'):
            self.assertIn("'"+word+"'",script);self.assertIn(word,entries)

if __name__=='__main__':
    unittest.main()
