"""Public deployment entry point: the upstream server with public restrictions.

Everything the upstream app does stays in server.py so upstream changes merge
cleanly. This module only wraps it:

* Shared presets, AI settings, antenna OCR and the position gateway are
  admin-only. Admin requests carry X-Chuck-Admin, set by the reverse proxy on
  the password-protected admin site and stripped on the public site.
* The shared history list is hidden; each browser keeps its own list of result
  IDs (static/public.js). Results stay readable by their random ID.
* Calculations are rate limited per client and old results are pruned.
* GitHub Sponsors reports sponsorships to a webhook kept in a ledger
  (donations.py); sponsors may send antenna catalogs, reviewed on the admin site.
"""
import base64
from collections import deque
from datetime import datetime, timedelta, timezone
from http.server import ThreadingHTTPServer
import io
import json
import os
import re
import secrets
import threading
import time
from urllib.parse import parse_qs, urlparse

import donations
import server

ADMIN_HEADER='X-Chuck-Admin'
CALCULATIONS=('/api/predict','/api/coverage','/api/diversity','/api/mesh','/api/annual')
# Coverage runs 35 engine passes, diversity up to 8, an annual outlook 12 and a mesh up to 56, so they cost more.
COST={'/api/predict':1,'/api/coverage':5,'/api/diversity':3,'/api/annual':4,'/api/mesh':8}
ADMIN_GET=('/api/ai-settings','/api/antenna-imports','/api/positions')
ADMIN_POST=('/api/ai-settings','/api/position-stations','/api/presets','/api/antenna-imports')
WEBHOOK='/api/sponsors/webhook'


def admin_secret():
    value=os.environ.get('CHUCK_ADMIN_SECRET','')
    return value if len(value)>=32 else ''


def link_env(name):
    # Only links a visitor can safely follow are shown on the public site.
    value=os.environ.get(name,'').strip()
    parsed=urlparse(value)
    if parsed.scheme=='https' and parsed.hostname:return value
    if parsed.scheme=='mailto' and '@' in parsed.path:return value
    return ''


def int_env(name,default):
    try:return max(0,int(os.environ.get(name,default)))
    except ValueError:return default


def monthly_goal():
    # The fixed part (domain and so on) plus whatever the host reported recently, such as the Oracle bill.
    return round(int_env('CHUCK_MONTHLY_COST_USD',0)+sum(c['usd'] for c in DONATIONS.running_costs()),2)


class RateLimiter:
    """Sliding-window budget of calculation cost per client."""
    def __init__(self,budget,window_seconds,clock=time.monotonic):
        self.budget=budget;self.window=window_seconds;self.clock=clock
        self.spent={};self.lock=threading.Lock()

    def take(self,client,cost):
        now=self.clock()
        with self.lock:
            entries=self.spent.setdefault(client,deque())
            while entries and entries[0][0]<=now-self.window:entries.popleft()
            if sum(c for _,c in entries)+cost>self.budget:
                retry=int(entries[0][0]+self.window-now)+1 if entries else int(self.window)
                return retry
            entries.append((now,cost))
            if len(self.spent)>10000:
                for key in [k for k,v in self.spent.items() if not v]:del self.spent[key]
            return 0


LIMITER=RateLimiter(int_env('CHUCK_RATE_BUDGET',60),int_env('CHUCK_RATE_WINDOW_SECONDS',3600))
UPLOAD_LIMITER=RateLimiter(10,3600)
RETENTION_DAYS=int_env('CHUCK_RESULT_RETENTION_DAYS',30)
MAX_RESULTS=int_env('CHUCK_MAX_RESULTS',20000)


def references_positions(value):
    """True when a request asks the server to resolve live gateway positions."""
    if isinstance(value,dict):
        return any(k in ('position_ref','tx_position','rx_position') or references_positions(v) for k,v in value.items())
    if isinstance(value,list):return any(references_positions(v) for v in value)
    return False


_upstream_save=server.save


def save(result,kind='point'):
    saved=_upstream_save(result,kind)
    cutoff=(datetime.now(timezone.utc)-timedelta(days=RETENTION_DAYS)).isoformat()
    with server.connection() as c:
        c.execute('DELETE FROM predictions WHERE created<?',(cutoff,))
        c.execute('DELETE FROM predictions WHERE id NOT IN (SELECT id FROM predictions ORDER BY created DESC LIMIT ?)',(MAX_RESULTS,))
    return saved


server.save=save
DONATIONS=donations.DonationStore(server.connection)


def webhook_secret():
    value=os.environ.get('GITHUB_SPONSORS_WEBHOOK_SECRET','')
    return value if len(value)>=16 else ''


def catalog_url():
    # Without an external form, catalogs go to the built-in page once donations are recorded.
    return link_env('CHUCK_CONTACT_URL') or ('/catalog.html' if webhook_secret() else '')


def defense_ministry(antenna):
    # The public site does not list Japan Ministry of Defense (JMSDF) equipment.
    ref=antenna.get('reference') or {}
    return ref.get('operator')=='JMSDF' or any(urlparse(u).hostname in ('mod.go.jp','www.mod.go.jp') for u in ref.get('sources',[]))


DEFENSE_WORDS=re.compile('海上自衛隊|自衛隊|海自|防衛省|JMSDF')


def without_defense_wording(antenna):
    # Other public references stay, minus sentences that mention the JMSDF.
    ref=antenna.get('reference')
    if not ref or not DEFENSE_WORDS.search(ref.get('notes','')):return antenna
    notes=''.join(s for s in re.findall(r'[^。]*。?',ref['notes']) if s and not DEFENSE_WORDS.search(s))
    return dict(antenna,reference=dict(ref,notes=notes))


def public_presets(snapshot):
    # Mobile presets follow live gateway positions, which are admin-only.
    return dict(snapshot,presets=[p for p in snapshot['presets'] if p.get('kind')!='mobile'],
                antennas=[without_defense_wording(a) for a in snapshot['antennas'] if not defense_ministry(a)],editable=False)


class PublicHandler(server.Handler):
    def is_admin(self):
        expected=admin_secret()
        return bool(expected) and secrets.compare_digest(self.headers.get(ADMIN_HEADER,'').encode(),expected.encode())

    def client(self):
        # The reverse proxy replaces X-Forwarded-For with the real client address.
        forwarded=self.headers.get('X-Forwarded-For','').split(',')[0].strip()
        return forwarded or self.client_address[0]

    def denied(self):
        return self.json(403,{'error':'公開版では管理者だけが使用できる機能です'})

    def do_GET(self):
        path=urlparse(self.path).path
        admin=self.is_admin()
        if path=='/api/public-config':
            return self.json(200,dict(public=True,admin=admin,rate_budget=LIMITER.budget,rate_window_seconds=LIMITER.window,
                                      retention_days=RETENTION_DAYS,cost=COST,
                                      donation_url=link_env('CHUCK_DONATION_URL'),contact_url=catalog_url(),donations=bool(webhook_secret())))
        if path.startswith('/api/support/'):return self.support_get(path)
        if path.startswith('/api/admin/'):return self.admin_get(path) if admin else self.denied()
        if admin:return super().do_GET()
        if any(path==p or path.startswith(p+'/') for p in ADMIN_GET):return self.denied()
        if path=='/api/history':return self.json(200,[])
        if path=='/api/presets':
            try:return self.json(200,public_presets(server.PRESETS.snapshot()))
            except Exception:
                __import__('traceback').print_exc()
                return self.json(500,{'error':'読み込みに失敗しました。サーバーログを確認してください。'})
        if path in ('/','/index.html'):return self.index()
        return super().do_GET()

    def index(self):
        html=(server.BASE/'static'/'index.html').read_text(encoding='utf-8')
        tag='<script src="app.js"></script>'
        if tag not in html:return self.json(500,{'error':'index.htmlの構成が想定と異なります'})
        html=html.replace(tag,tag+'<script src="public.js"></script>',1)
        # Translations for the public layer must load before i18n.js builds its tables.
        messages='<script src="i18n-messages.js"></script>'
        self.send(200,html.replace(messages,messages+'<script src="public-messages.js"></script>',1),'text/html; charset=utf-8')

    def same_origin(self):
        host=self.headers.get('Host','')
        return self.headers.get('Origin') in ('http://'+host,'https://'+host)

    def read_body(self,limit):
        try:length=int(self.headers.get('Content-Length','0'))
        except ValueError:length=0
        return self.rfile.read(length) if 0<length<=limit else None

    def support_get(self,path):
        if path=='/api/support/summary':return self.json(200,DONATIONS.summary(monthly_goal()))
        return self.json(404,{'error':'見つかりません'})

    def admin_get(self,path):
        if path=='/api/admin/donations':
            return self.json(200,dict(DONATIONS.ledger(),fixed_cost_usd=int_env('CHUCK_MONTHLY_COST_USD',0),running_costs=DONATIONS.running_costs(),goal_usd=monthly_goal()))
        if path=='/api/admin/catalog-requests':return self.json(200,DONATIONS.catalogs())
        match=re.fullmatch(r'/api/admin/catalog-requests/([0-9a-f]{32})/file',path)
        row=DONATIONS.catalog_file(match.group(1)) if match else None
        if not row:return self.json(404,{'error':'見つかりません'})
        filename,kind,content=row
        extension={'application/pdf':'pdf','image/png':'png','image/jpeg':'jpg','image/webp':'webp'}[kind]
        return self.send(200,content,kind,f'catalog-{match.group(1)[:8]}.{extension}')

    def sponsors_webhook(self):
        secret=webhook_secret()
        if not secret:return self.json(503,{'error':'GITHUB_SPONSORS_WEBHOOK_SECRET is not set'})
        body=self.read_body(262144)
        if body is None:return self.json(400,{'error':'invalid size'})
        try:
            donations.verify(body,self.headers.get('X-Hub-Signature-256'),secret)
            event=json.loads(body)
        except (donations.SignatureError,ValueError,UnicodeError) as e:return self.json(400,{'error':str(e)})
        kind=self.headers.get('X-GitHub-Event')
        if kind=='ping':return self.json(200,{'received':'ping'})
        if kind!='sponsorship':return self.json(200,{'received':'ignored'})
        return self.json(200,{'received':DONATIONS.handle(self.headers.get('X-GitHub-Delivery'),event)})

    def send_catalog(self):
        if not self.same_origin():return self.json(403,{'error':'同一オリジンの画面から送ってください'})
        if UPLOAD_LIMITER.take(self.client(),1):return self.json(429,{'error':'送信回数の上限に達しました。時間をおいて送ってください'})
        body=self.read_body(12*1024*1024)
        if body is None:return self.json(400,{'error':'資料は8MBまでのPDFまたは画像を送ってください'})
        try:
            data=json.loads(body)
            if not isinstance(data,dict) or data.get('consent') is not True:raise ValueError('登録が確約されないことへの同意が必要です')
            content=base64.b64decode(data.get('content') or '',validate=True)
            identifier=DONATIONS.add_catalog(str(data.get('login','')).strip().lstrip('@'),data.get('contact'),data.get('note'),data.get('filename'),content)
        except (ValueError,UnicodeError,TypeError,base64.binascii.Error) as e:return self.json(400,{'error':str(e) or '送信内容が不正です'})
        return self.json(201,{'id':identifier})

    def admin_post(self,path):
        if not self.same_origin():return self.json(403,{'error':'同一オリジンの画面から操作してください'})
        body=self.read_body(16384)
        try:
            data=json.loads(body or b'')
            if not isinstance(data,dict):raise ValueError('JSONオブジェクトが必要です')
            if path=='/api/admin/running-cost':DONATIONS.set_running_cost(data.get('source'),data.get('usd'));return self.json(200,{'goal_usd':monthly_goal()})
            match=re.fullmatch(r'/api/admin/catalog-requests/([0-9a-f]{32})',path)
            if match:DONATIONS.update_catalog(match.group(1),data);return self.json(200,{'ok':True})
            match=re.fullmatch(r'/api/admin/supporters/([A-Za-z0-9-]{1,39})',path)
            if match:DONATIONS.hide_supporter(match.group(1),data.get('hidden'));return self.json(200,{'ok':True})
        except LookupError as e:return self.json(404,{'error':str(e)})
        except (ValueError,UnicodeError) as e:return self.json(400,{'error':str(e)})
        return self.json(404,{'error':'見つかりません'})

    def do_POST(self):
        path=urlparse(self.path).path
        if path==WEBHOOK:return self.sponsors_webhook()
        if path=='/api/support/catalog':return self.send_catalog()
        if path.startswith('/api/admin/'):return self.admin_post(path) if self.is_admin() else self.denied()
        if self.is_admin():return super().do_POST()
        if any(path==p or path.startswith(p+'/') for p in ADMIN_POST):return self.denied()
        if path in CALCULATIONS:
            try:length=int(self.headers.get('Content-Length','0'))
            except ValueError:length=0
            if not 0<length<=16384:return self.json(400,{'error':'リクエストサイズが不正です'})
            body=self.rfile.read(length)
            try:data=json.loads(body)
            except (ValueError,UnicodeError):return self.json(400,{'error':'JSONが不正です'})
            if references_positions(data):
                return self.json(400,{'error':'公開版では移動局の位置連動は使用できません'})
            retry=LIMITER.take(self.client(),COST[path])
            if retry:
                return self.json(429,{'error':f'計算回数の上限に達しました。約{(retry+59)//60}分後に再実行してください。'})
            self.rfile=io.BytesIO(body)
        return super().do_POST()


if __name__=='__main__':
    server.connection().close()
    if not admin_secret():print('CHUCK_ADMIN_SECRET is unset or shorter than 32 characters: admin functions are disabled',flush=True)
    print('CHUCK public mode: http://localhost:18082',flush=True)
    ThreadingHTTPServer(('0.0.0.0',8000),PublicHandler).serve_forever()
