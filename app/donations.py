"""Sponsorship ledger and antenna catalog intake for the public deployment.

Donations go through GitHub Sponsors, which accepts sponsored developers who
live in Japan (Stripe lists donations to individuals in Japan as prohibited).
GitHub reports each sponsorship change to the webhook here. Only the sponsor's
GitHub login, the tier amount and the privacy level are kept; payment details
stay with GitHub. Sponsors may send antenna catalogs under their GitHub login.
"""
from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import math
import re
import uuid

JST=timezone(timedelta(hours=9))
MAX_FILE=8*1024*1024
MAX_PER_LOGIN=5
MAX_PENDING=500
STATUSES=('pending','registered','declined')
LOGIN=re.compile(r'[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}')
DELIVERY=re.compile(r'[0-9A-Fa-f-]{8,64}')
CONTROL=re.compile(r'[\x00-\x1f\x7f]')
# Monthly sponsorships still counted this month; one-time ones count in the month they were made.
COUNTED=('active','pending_cancellation')
# A reported running cost older than this is ignored, so a stopped timer cannot leave a stale goal.
COST_MAX_AGE=timedelta(days=40)


class SignatureError(Exception):pass


def verify(payload,header,secret):
    """Checks GitHub's X-Hub-Signature-256 header (HMAC-SHA256 of the body)."""
    expected='sha256='+hmac.new(secret.encode(),payload,hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected.encode(),(header or '').encode()):raise SignatureError('署名が一致しません')


def clean_text(value,limit):
    return CONTROL.sub('',value).strip()[:limit] if isinstance(value,str) else ''


def media_type(content):
    if content.startswith(b'%PDF-'):return 'application/pdf'
    if content.startswith(b'\x89PNG\r\n\x1a\n'):return 'image/png'
    if content.startswith(b'\xff\xd8\xff'):return 'image/jpeg'
    if content[:4]==b'RIFF' and content[8:12]==b'WEBP':return 'image/webp'
    return ''


def month_bounds(now=None):
    # Months follow Japan time; rows store UTC ISO timestamps.
    local=(now or datetime.now(timezone.utc)).astimezone(JST)
    start=local.replace(day=1,hour=0,minute=0,second=0,microsecond=0)
    end=(start+timedelta(days=32)).replace(day=1)
    return start.strftime('%Y-%m'),start.astimezone(timezone.utc).isoformat(),end.astimezone(timezone.utc).isoformat()


class DonationStore:
    def __init__(self,connection):
        self.connect=connection

    def connection(self):
        # The schema is checked on every connection so a moved database (tests, DATA_DIR) still works.
        c=self.connect()
        with c:
            c.execute('CREATE TABLE IF NOT EXISTS sponsorships (node_id TEXT PRIMARY KEY, login TEXT NOT NULL, privacy TEXT NOT NULL, cents INTEGER NOT NULL, one_time INTEGER NOT NULL, state TEXT NOT NULL, created TEXT NOT NULL, updated TEXT NOT NULL, hidden INTEGER NOT NULL DEFAULT 0)')
            # One row per webhook delivery, so a redelivered event is applied once.
            c.execute('CREATE TABLE IF NOT EXISTS sponsor_events (delivery TEXT PRIMARY KEY, received TEXT NOT NULL, action TEXT NOT NULL, node_id TEXT NOT NULL, login TEXT NOT NULL, cents INTEGER NOT NULL, one_time INTEGER NOT NULL)')
            # Server cost reported by the host (for example the Oracle bill); one row per source.
            c.execute('CREATE TABLE IF NOT EXISTS running_costs (source TEXT PRIMARY KEY, usd REAL NOT NULL, updated TEXT NOT NULL)')
            c.execute('CREATE TABLE IF NOT EXISTS catalog_requests (id TEXT PRIMARY KEY, created TEXT NOT NULL, login TEXT NOT NULL, contact TEXT NOT NULL, note TEXT NOT NULL, filename TEXT NOT NULL, media_type TEXT NOT NULL, content BLOB NOT NULL, status TEXT NOT NULL DEFAULT \'pending\', antenna_preset_id TEXT NOT NULL DEFAULT \'\', admin_note TEXT NOT NULL DEFAULT \'\', updated TEXT NOT NULL)')
        return c

    def handle(self,delivery,event):
        """Applies one verified `sponsorship` webhook. Returns what it did."""
        sponsorship=event.get('sponsorship') if isinstance(event,dict) else None
        action=event.get('action') if sponsorship else None
        if not isinstance(sponsorship,dict) or not isinstance(action,str) or not DELIVERY.fullmatch(delivery or ''):return 'ignored'
        node=sponsorship.get('node_id');login=(sponsorship.get('sponsor') or {}).get('login');tier=sponsorship.get('tier') or {}
        cents=tier.get('monthly_price_in_cents')
        if not isinstance(node,str) or not isinstance(login,str) or not LOGIN.fullmatch(login) or not isinstance(cents,int):return 'ignored'
        one_time=bool(tier.get('is_one_time'));privacy='public' if sponsorship.get('privacy_level')=='public' else 'private'
        now=datetime.now(timezone.utc).isoformat();created=clean_text(sponsorship.get('created_at'),40) or now
        with self.connection() as c:
            if c.execute('INSERT OR IGNORE INTO sponsor_events VALUES (?,?,?,?,?,?,?)',(delivery,now,action,node,login,cents,int(one_time))).rowcount==0:return 'duplicate'
            state={'cancelled':'cancelled','pending_cancellation':'pending_cancellation'}.get(action,'one_time' if one_time else 'active')
            row=c.execute('SELECT state FROM sponsorships WHERE node_id=?',(node,)).fetchone()
            if row and row[0]=='cancelled' and action!='created':state='cancelled'
            c.execute('INSERT INTO sponsorships (node_id,login,privacy,cents,one_time,state,created,updated) VALUES (?,?,?,?,?,?,?,?) '
                      'ON CONFLICT(node_id) DO UPDATE SET login=excluded.login,privacy=excluded.privacy,cents=excluded.cents,one_time=excluded.one_time,state=excluded.state,updated=excluded.updated',
                      (node,login,privacy,cents,int(one_time),state,created,now))
        return action

    def month_cents(self,c):
        month,start,end=month_bounds()
        recurring=c.execute(f"SELECT COALESCE(SUM(cents),0) FROM sponsorships WHERE one_time=0 AND state IN {COUNTED}").fetchone()[0]
        once=c.execute('SELECT COALESCE(SUM(cents),0) FROM sponsorships WHERE one_time=1 AND created>=? AND created<?',(start,end)).fetchone()[0]
        return month,recurring,once

    def summary(self,goal_usd):
        since=(datetime.now(timezone.utc)-timedelta(days=365)).isoformat()
        with self.connection() as c:
            month,recurring,once=self.month_cents(c)
            # Only sponsors who chose to be public on GitHub are listed, newest first.
            names=[r[0] for r in c.execute(f"SELECT login FROM sponsorships WHERE privacy='public' AND hidden=0 AND (state IN {COUNTED} OR (one_time=1 AND created>=?)) GROUP BY lower(login) ORDER BY MAX(created) DESC LIMIT 50",(since,))]
        return dict(month=month,goal_usd=goal_usd,expected_usd=round((recurring+once)/100,2),supporters=names)

    def set_running_cost(self,source,usd):
        source=clean_text(source,40)
        if not source:raise ValueError('source が必要です')
        if isinstance(usd,bool) or not isinstance(usd,(int,float)) or not math.isfinite(usd) or not 0<=usd<=100000:raise ValueError('usd は0以上の金額にしてください')
        with self.connection() as c:
            c.execute('INSERT INTO running_costs VALUES (?,?,?) ON CONFLICT(source) DO UPDATE SET usd=excluded.usd,updated=excluded.updated',
                      (source,round(float(usd),2),datetime.now(timezone.utc).isoformat()))

    def running_costs(self):
        since=(datetime.now(timezone.utc)-COST_MAX_AGE).isoformat()
        with self.connection() as c:
            rows=c.execute('SELECT source,usd,updated FROM running_costs WHERE updated>=? ORDER BY source',(since,)).fetchall()
        return [dict(source=s,usd=u,updated=t) for s,u,t in rows]

    def ledger(self,limit=200):
        with self.connection() as c:
            month,recurring,once=self.month_cents(c)
            rows=c.execute('SELECT login,privacy,cents,one_time,state,created,updated,hidden FROM sponsorships ORDER BY created DESC LIMIT ?',(limit,)).fetchall()
            events=c.execute('SELECT received,action,login,cents,one_time FROM sponsor_events ORDER BY received DESC LIMIT ?',(limit,)).fetchall()
        return dict(month=month,monthly_usd=recurring/100,one_time_usd=once/100,
                    sponsorships=[dict(login=l,privacy=p,usd=cents/100,one_time=bool(o),state=s,created=cr,updated=u,hidden=bool(h)) for l,p,cents,o,s,cr,u,h in rows],
                    events=[dict(received=r,action=a,login=l,usd=cents/100,one_time=bool(o)) for r,a,l,cents,o in events])

    def add_catalog(self,login,contact,note,filename,content):
        if not LOGIN.fullmatch(login or ''):raise ValueError('GitHubのユーザー名を入力してください')
        if not content or len(content)>MAX_FILE:raise ValueError('資料は8MBまでのPDFまたは画像を送ってください')
        kind=media_type(content)
        if not kind:raise ValueError('PDF・PNG・JPEG・WebPのいずれかを送ってください')
        now=datetime.now(timezone.utc).isoformat()
        with self.connection() as c:
            # Whether the login sponsors is not revealed here (private sponsors stay private);
            # the admin page shows the match.
            if c.execute('SELECT COUNT(*) FROM catalog_requests WHERE lower(login)=lower(?)',(login,)).fetchone()[0]>=MAX_PER_LOGIN:
                raise ValueError(f'1つのユーザー名で送れる資料は{MAX_PER_LOGIN}件までです')
            if c.execute("SELECT COUNT(*) FROM catalog_requests WHERE status='pending'").fetchone()[0]>=MAX_PENDING:
                raise ValueError('未処理の資料が多いため受付を一時停止しています。時間をおいて送ってください')
            identifier=uuid.uuid4().hex
            c.execute('INSERT INTO catalog_requests (id,created,login,contact,note,filename,media_type,content,updated) VALUES (?,?,?,?,?,?,?,?,?)',
                      (identifier,now,login,clean_text(contact,200),clean_text(note,1000),clean_text(filename,120) or 'catalog',kind,content,now))
        return identifier

    def catalogs(self):
        with self.connection() as c:
            rows=c.execute('SELECT r.id,r.created,r.login,r.contact,r.note,r.filename,r.media_type,length(r.content),r.status,r.antenna_preset_id,r.admin_note,r.updated,'
                           '(SELECT s.state FROM sponsorships s WHERE lower(s.login)=lower(r.login) ORDER BY s.created DESC LIMIT 1) '
                           'FROM catalog_requests r ORDER BY r.created DESC').fetchall()
        keys=('id','created','login','contact','note','filename','media_type','size','status','antenna_preset_id','admin_note','updated','sponsor_state')
        return [dict(zip(keys,r),sponsor_state=r[-1] or '') for r in rows]

    def catalog_file(self,identifier):
        with self.connection() as c:
            return c.execute('SELECT filename,media_type,content FROM catalog_requests WHERE id=?',(identifier,)).fetchone()

    def update_catalog(self,identifier,data):
        status=data.get('status')
        if status not in STATUSES:raise ValueError('状態が不正です')
        with self.connection() as c:
            changed=c.execute('UPDATE catalog_requests SET status=?,antenna_preset_id=?,admin_note=?,updated=? WHERE id=?',
                              (status,clean_text(data.get('antenna_preset_id'),120),clean_text(data.get('admin_note'),1000),datetime.now(timezone.utc).isoformat(),identifier)).rowcount
        if not changed:raise LookupError('資料が見つかりません')

    def hide_supporter(self,login,hidden):
        with self.connection() as c:
            if not c.execute('UPDATE sponsorships SET hidden=? WHERE lower(login)=lower(?)',(int(bool(hidden)),login)).rowcount:raise LookupError('スポンサーが見つかりません')
