"""Admin page of the public-data fetcher: its own password and expiring HttpOnly sessions, like the gateway's."""
from http.cookies import SimpleCookie
from pathlib import Path
import json
import os
import secrets
import threading
import time

from observations import GIRO_TERMS
from public_data import BUNDLE_FORMAT

BASE=Path(__file__).parent
LOCK=threading.Lock()
FETCH_LOCK=threading.Lock()
SESSIONS={}
FAILURES={}
TTL=3600
COOKIE='chuck_public_data_session'
CSP="default-src 'self'; script-src 'self'; style-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"

def ui_password():
    value=os.environ.get('HF_PUBLIC_DATA_UI_PASSWORD','')
    return value if len(value)>=16 and value!=os.environ.get('HF_PUBLIC_DATA_TOKEN','') else ''

class PublicDataUI:
    def ui_send(self,status,body,mime,headers=()):
        self.send_response(status)
        for key,value in [('Content-Type',mime),('Content-Length',str(len(body))),('Cache-Control','no-store'),('X-Content-Type-Options','nosniff'),
                          ('X-Frame-Options','DENY'),('Content-Security-Policy',CSP),*headers]:self.send_header(key,value)
        self.end_headers();self.wfile.write(body)

    def ui_json(self,status,value,cookie=None):
        self.ui_send(status,json.dumps(value,ensure_ascii=False,allow_nan=False).encode(),'application/json; charset=utf-8',[('Set-Cookie',cookie)] if cookie else [])

    def ui_cookie(self,value,max_age=TTL):
        secure='; Secure' if os.environ.get('HF_PUBLIC_DATA_UI_SECURE_COOKIE')=='1' else ''
        return f'{COOKIE}={value}; Path=/ui; HttpOnly; SameSite=Strict; Max-Age={max_age}'+secure

    def ui_session(self):
        try:
            jar=SimpleCookie();jar.load(self.headers.get('Cookie',''))
            token=jar[COOKIE].value if COOKIE in jar else ''
        except Exception:return None
        with LOCK:
            session=SESSIONS.get(token)
            if not session:return None
            password=ui_password()
            if session['expires']<=time.monotonic() or not password or not secrets.compare_digest(session['password'],password.encode()):
                SESSIONS.pop(token,None);return None
        return token

    def ui_status(self):
        fetcher=self.fetcher()
        return dict(sources=fetcher.status(),giro_enabled=fetcher.giro_enabled(),giro_terms_url=GIRO_TERMS,
                    client_enabled=len(os.environ.get('HF_PUBLIC_DATA_TOKEN',''))>=32,role='public-data')

    def ui_get(self,path):
        files={'/':(BASE/'public_data_static/index.html','text/html; charset=utf-8'),
               '/public-data.js':(BASE/'public_data_static/public-data.js','text/javascript; charset=utf-8'),
               '/style.css':(BASE/'gateway_static/style.css','text/css; charset=utf-8'),
               '/i18n.js':(BASE/'static/i18n.js','text/javascript; charset=utf-8'),
               '/i18n-messages.js':(BASE/'static/i18n-messages.js','text/javascript; charset=utf-8'),
               '/chuck-icon.png':(BASE/'static/chuck-icon.png','image/png'),
               '/favicon.png':(BASE/'static/favicon.png','image/png')}
        if path in files:
            file,mime=files[path];self.ui_send(200,file.read_bytes(),mime);return True
        if not path.startswith('/ui/'):return False
        if path=='/ui/api/session':
            self.ui_json(200,dict(authenticated=bool(self.ui_session()),configured=bool(ui_password())));return True
        if not self.ui_session():
            self.ui_json(401,dict(error='管理画面へログインしてください。'));return True
        if path=='/ui/api/status':
            self.ui_json(200,self.ui_status());return True
        if path=='/ui/api/export':
            self.ui_send(200,self.fetcher().bundle(),'application/json',[('Content-Disposition',f'attachment; filename="{BUNDLE_FORMAT}.json"')]);return True
        self.ui_json(404,dict(error='見つかりません'));return True

    def ui_post(self,path):
        if not path.startswith('/ui/'):return False
        origin=self.headers.get('Origin')
        if origin not in ('http://'+self.headers.get('Host',''),'https://'+self.headers.get('Host','')):
            self.ui_json(403,dict(error='管理操作は同一オリジンから行ってください。'));return True
        if self.headers.get('Content-Type','').split(';')[0].strip()!='application/json':
            self.ui_json(415,dict(error='application/jsonが必要です'));return True
        try:
            size=int(self.headers.get('Content-Length','0'))
            if not 0<size<=8192:raise ValueError('リクエストサイズが不正です')
            data=json.loads(self.rfile.read(size))
            if not isinstance(data,dict):raise ValueError('JSONオブジェクトが必要です')
            if path=='/ui/api/login':
                password=ui_password()
                if not password:self.ui_json(503,dict(error='管理パスワードを設定してください。'));return True
                now=time.monotonic();ip=self.client_address[0]
                with LOCK:
                    attempts=[t for t in FAILURES.get(ip,[]) if now-t<900]
                    if len(attempts)>=8:self.ui_json(429,dict(error='ログイン試行が多すぎます。しばらく待ってください。'));return True
                    value=data.get('password')
                    if not isinstance(value,str) or not secrets.compare_digest(value.encode(),password.encode()):
                        if len(FAILURES)>1024:FAILURES.clear()
                        FAILURES[ip]=attempts+[now];self.ui_json(401,dict(error='パスワードが正しくありません。'));return True
                    FAILURES.pop(ip,None)
                    for key,session in list(SESSIONS.items()):
                        if session['expires']<=now:SESSIONS.pop(key)
                    if len(SESSIONS)>=128:SESSIONS.pop(next(iter(SESSIONS)))
                    token=secrets.token_hex(32)
                    SESSIONS[token]=dict(expires=now+TTL,password=password.encode())
                self.ui_json(200,dict(authenticated=True),self.ui_cookie(token));return True
            session=self.ui_session()
            if not session:self.ui_json(401,dict(error='管理画面へログインしてください。'));return True
            if path=='/ui/api/logout':
                with LOCK:SESSIONS.pop(session,None)
                self.ui_json(200,dict(authenticated=False),self.ui_cookie('',0));return True
            if path=='/ui/api/settings':
                if not isinstance(data.get('giro_enabled'),bool):raise ValueError('giro_enabledにtrueまたはfalseを指定してください')
                if data['giro_enabled'] and data.get('terms_accepted') is not True:raise ValueError('GIROの利用条件への適合を確認してください')
                self.fetcher().set_giro(data['giro_enabled'])
                self.ui_json(200,self.ui_status());return True
            if path=='/ui/api/fetch':
                # The administrator's manual download of every source; failed ones still wait out their retry delay.
                if not FETCH_LOCK.acquire(blocking=False):self.ui_json(409,dict(error='取得中です。しばらく待ってください。'));return True
                try:self.fetcher().refresh_due(every=True)
                finally:FETCH_LOCK.release()
                self.ui_json(200,self.ui_status());return True
            self.ui_json(404,dict(error='見つかりません'));return True
        except (ValueError,UnicodeError) as error:
            self.ui_json(400,dict(error=str(error)));return True
        except Exception:
            __import__('traceback').print_exc();self.ui_json(500,dict(error='管理操作に失敗しました。'));return True
