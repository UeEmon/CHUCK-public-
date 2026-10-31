"""Position gateway: owns adapters, station settings and latest-position DB."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import secrets
import sqlite3
from urllib.parse import urlparse, parse_qs
from engine import InputError
from positions import PositionStore
from position_contract import POSITIONS_PATH, STATIONS_PATH, SCHEMA_VERSION
from gateway_ui import GatewayUI
import gateway_stream

DATA=Path(os.environ.get('HF_GATEWAY_DATA_DIR',os.environ.get('DATA_DIR','./gateway-data')))
DATA.mkdir(parents=True,exist_ok=True)
DB=DATA/'positions.sqlite3'


def connection():
    return sqlite3.connect(DB,timeout=15)


STORE=PositionStore(connection,os.environ.get('HF_POSITION_MAX_AGE_SECONDS','300'))
STREAM=gateway_stream.StreamStats()
STREAM_PORT=10110  # Customary NMEA-over-IP port, published by Compose.


def stream_enabled():
    return os.environ.get('HF_GATEWAY_NMEA_STREAM','0')=='1'


def stream_key_required():
    # Internet-facing deployments accept only senders with a per-station key.
    return os.environ.get('HF_GATEWAY_NMEA_REQUIRE_KEY','0')=='1'


class Handler(GatewayUI,BaseHTTPRequestHandler):
    def gateway_store(self):return STORE
    def gateway_stream(self):return dict(STREAM.snapshot(),enabled=stream_enabled(),require_key=stream_key_required())
    def json(self, code, obj):
        body=json.dumps(obj,ensure_ascii=False,allow_nan=False).encode()
        self.send_response(code)
        self.send_header('Content-Type','application/json; charset=utf-8')
        self.send_header('Content-Length',str(len(body)))
        self.send_header('Cache-Control','no-store')
        self.send_header('X-Content-Type-Options','nosniff')
        if code==401: self.send_header('WWW-Authenticate','Bearer')
        self.end_headers();self.wfile.write(body)

    def authorize(self, name):
        token=os.environ.get(name,'')
        if len(token)<32:
            self.json(503,{'error':'ゲートウェイの認証設定が未完了です'});return False
        other='HF_POSITION_GATEWAY_TOKEN' if name=='HF_POSITION_INGEST_TOKEN' else 'HF_POSITION_INGEST_TOKEN'
        if token==os.environ.get(other,''):
            self.json(503,{'error':'外部受信用と本体連携用には別のトークンを設定してください'});return False
        if not secrets.compare_digest(self.headers.get('Authorization','').encode(),('Bearer '+token).encode()):
            self.json(401,{'error':'有効なBearerトークンが必要です'});return False
        # Service endpoints keep Bearer authentication separate from UI sessions.
        if self.headers.get('Origin'):
            self.json(403,{'error':'位置ゲートウェイへのブラウザ直接アクセスは受け付けません'});return False
        return True

    def do_GET(self):
        path=urlparse(self.path).path
        try:
            if self.ui_get(path):return
            if path=='/api/health':
                with STORE.connect() as c: c.execute('SELECT 1').fetchone()
                return self.json(200,{'ok':True,'role':'position-gateway',
                    'ingest_enabled':len(os.environ.get('HF_POSITION_INGEST_TOKEN',''))>=32,
                    'client_enabled':len(os.environ.get('HF_POSITION_GATEWAY_TOKEN',''))>=32})
            if path=='/api/positions': return self.json(410,{'error':'本体連接は'+POSITIONS_PATH+'を使用してください'})
            if path!=POSITIONS_PATH: return self.json(404,{'error':'見つかりません'})
            if not self.authorize('HF_POSITION_GATEWAY_TOKEN'): return
            return self.json(200,dict(STORE.snapshot(),schema_version=SCHEMA_VERSION,ingest_enabled=len(os.environ.get('HF_POSITION_INGEST_TOKEN',''))>=32))
        except Exception:
            __import__('traceback').print_exc();self.json(503,{'error':'ゲートウェイDBを読み込めません'})

    def do_POST(self):
        path=urlparse(self.path).path
        if self.ui_post(path):return
        if path=='/api/position-stations': return self.json(410,{'error':'本体連接は'+STATIONS_PATH+'を使用してください'})
        config=path==STATIONS_PATH
        nmea=path=='/api/positions/nmea'
        if path not in ('/api/positions','/api/positions/nmea',STATIONS_PATH):
            return self.json(404,{'error':'見つかりません'})
        if not self.authorize('HF_POSITION_GATEWAY_TOKEN' if config else 'HF_POSITION_INGEST_TOKEN'): return
        types=('text/plain',) if nmea else ('application/json','application/geo+json') if not config else ('application/json',)
        if self.headers.get('Content-Type','').split(';')[0].strip() not in types:
            return self.json(415,{'error':'Content-Typeが不正です'})
        try:
            length=int(self.headers.get('Content-Length','0'))
            if not 0<length<=(4096 if config else 262144): raise InputError('リクエストサイズが不正です')
            raw=self.rfile.read(length)
            if config: result=STORE.configure(json.loads(raw))
            elif nmea:
                q=parse_qs(urlparse(self.path).query)
                result=STORE.ingest_nmea(q.get('source',[None])[0],q.get('id',[None])[0],raw.decode('ascii'))
            else: result=STORE.ingest(json.loads(raw))
            self.json(200,result)
        except (InputError,ValueError,UnicodeError) as e: self.json(400,{'error':str(e)})
        except Exception:
            __import__('traceback').print_exc();self.json(500,{'error':'ゲートウェイDBに保存できません'})


if __name__=='__main__':
    print('Position gateway: :8001',flush=True)
    if stream_enabled():
        gateway_stream.start(STORE,STREAM,tcp_port=STREAM_PORT,udp_port=STREAM_PORT,require_key=stream_key_required())
        print(f'NMEA 0183 TCP/UDP input: :{STREAM_PORT}',flush=True)
    ThreadingHTTPServer(('0.0.0.0',8001),Handler).serve_forever()
