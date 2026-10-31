"""Public-data fetcher: downloads NOAA, NICT and (opt-in) GIRO data for CHUCK on a schedule.

Runs as its own container in an environment that reaches the internet; CHUCK
itself never contacts the providers. Each source is validated with CHUCK's own
parser and kept as <key>.raw (the provider's bytes) and <key>.json (fetched_at,
url, sha256).

* API link: CHUCK (HF_PUBLIC_DATA_MODE=api) reads GET /api/data/<key>.
* File link: CHUCK runs on premises without internet (HF_PUBLIC_DATA_MODE=file).
  After every cycle the fetcher writes export/chuck-public-data.json, also
  served at GET /api/export; an administrator uploads it on the CHUCK admin page.
"""
from datetime import datetime, timezone
import hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import secrets
import sys
import threading
import time
from urllib.parse import urlparse, parse_qs
from urllib.request import Request, urlopen

from observations import DRAP_URL, NICT_URL, GIRO_URL, GIRO_STATIONS, giro_body, parse_drap, parse_nict, parse_giro
from public_data import BUNDLE_FORMAT, KEY, MAX_RAW, PublicDataError, make_bundle, read_file, write_file
from space_weather import FEEDS, ROOT, check_schema

DATA = Path(os.environ.get('HF_PUBLIC_DATA_DIR', os.environ.get('DATA_DIR', './public-data')))
GIRO_ENABLED = os.environ.get('HF_GIRO_ENABLED', '0') == '1'
RETRY_SECONDS = 60


def json_check(key):
    return lambda raw: check_schema(key, json.loads(raw))


def text_check(parser):
    return lambda raw: parser(raw.decode('utf-8', errors='replace'))


def sources(giro_enabled=None):
    """Fixed allowlist: key -> (url, request body or None, refresh seconds, validator)."""
    table = {key: (ROOT + path, None, ttl, json_check(key)) for key, (path, ttl) in FEEDS.items()}
    table['drap'] = (DRAP_URL, None, 300, text_check(parse_drap))
    table['nict'] = (NICT_URL, None, 300, text_check(parse_nict))
    if GIRO_ENABLED if giro_enabled is None else giro_enabled:
        for code in GIRO_STATIONS:
            table[code] = (GIRO_URL, lambda code=code: giro_body(code), 300, text_check(lambda text, code=code: parse_giro(text, code)))
    return table


class Fetcher:
    def __init__(self, directory, table=None):
        self.directory = Path(directory)
        self.table = sources() if table is None else table
        self.locks = {key: threading.Lock() for key in self.table}
        self.retry_after = {}

    def meta(self, key):
        try:
            return json.loads((self.directory / (key + '.json')).read_text())
        except (OSError, ValueError):
            return None

    def due(self, key):
        meta = self.meta(key)
        return not meta or not 0 <= time.time() - meta.get('fetched_at', 0) < self.table[key][2]

    def fetch(self, key):
        """Download one source now; returns an error message or None. Failures keep the previous files."""
        url, body, _, check = self.table[key]
        with self.locks[key]:
            now = time.time()
            if now < self.retry_after.get(key, 0):
                return '取得を再試行待ちです'
            try:
                request = Request(url, data=body() if body else None, headers={'User-Agent': 'HF-Propagation-JP/0.3'})
                with urlopen(request, timeout=10) as response:
                    raw = response.read(MAX_RAW + 1)
                if len(raw) > MAX_RAW:
                    raise ValueError('response too large')
                check(raw)
            except Exception as e:
                self.retry_after[key] = now + RETRY_SECONDS
                print(f'public-data: {key} failed: {type(e).__name__}', flush=True)
                return '提供元から取得できませんでした'
            write_file(self.directory, key, raw, {'key': key, 'url': url, 'fetched_at': time.time(), 'sha256': hashlib.sha256(raw).hexdigest()})
            return None

    def latest(self, key):
        try:
            raw, fetched_at = read_file(self.directory, key)
        except PublicDataError:
            return None, None
        return raw, fetched_at

    def bundle(self):
        return json.dumps(make_bundle(self.directory, self.table)).encode()

    def export(self):
        """Write the bundle for the file link; returns its path."""
        path = self.directory / 'export' / (BUNDLE_FORMAT + '.json')
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary = path.with_suffix('.tmp')
        temporary.write_bytes(self.bundle())
        temporary.replace(path)
        return path

    def refresh_due(self):
        changed = False
        for key in self.table:
            if self.due(key):
                changed = self.fetch(key) is None or changed
        if changed or not (self.directory / 'export' / (BUNDLE_FORMAT + '.json')).exists():
            self.export()

    def status(self):
        now = time.time()
        result = {}
        for key, (url, _, ttl, _) in self.table.items():
            meta = self.meta(key) or {}
            fetched = meta.get('fetched_at')
            result[key] = {'url': url, 'refresh_seconds': ttl,
                           'fetched_at': datetime.fromtimestamp(fetched, timezone.utc).isoformat() if fetched else None,
                           'age_seconds': round(now - fetched) if fetched else None}
        return result


FETCHER = Fetcher(DATA)


def loop():
    while True:
        try:
            FETCHER.refresh_due()
        except Exception:
            __import__('traceback').print_exc()
        time.sleep(60)


class Handler(BaseHTTPRequestHandler):
    def send(self, code, body, kind, headers=()):
        self.send_response(code)
        self.send_header('Content-Type', kind)
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        for name, value in headers:
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(body)

    def json(self, code, obj):
        self.send(code, json.dumps(obj, ensure_ascii=False, allow_nan=False).encode(), 'application/json; charset=utf-8',
                  [('WWW-Authenticate', 'Bearer')] if code == 401 else [])

    def authorize(self):
        token = os.environ.get('HF_PUBLIC_DATA_TOKEN', '')
        if len(token) < 32:
            self.json(503, {'error': '32文字以上のHF_PUBLIC_DATA_TOKENを設定してください'});return False
        if not secrets.compare_digest(self.headers.get('Authorization', '').encode(), ('Bearer ' + token).encode()):
            self.json(401, {'error': '有効なBearerトークンが必要です'});return False
        if self.headers.get('Origin'):
            self.json(403, {'error': '取得用コンテナへのブラウザ直接アクセスは受け付けません'});return False
        return True

    def do_GET(self):
        url = urlparse(self.path)
        try:
            if url.path == '/api/health':
                return self.json(200, {'ok': True, 'role': 'public-data', 'client_enabled': len(os.environ.get('HF_PUBLIC_DATA_TOKEN', '')) >= 32})
            if url.path == '/api/status':
                if self.authorize():self.json(200, {'sources': FETCHER.status()})
                return
            if url.path == '/api/export':
                if self.authorize():
                    self.send(200, FETCHER.bundle(), 'application/json', [('Content-Disposition', f'attachment; filename="{BUNDLE_FORMAT}.json"')])
                return
            if not url.path.startswith('/api/data/'):
                return self.json(404, {'error': '見つかりません'})
            if not self.authorize():
                return
            key = url.path[len('/api/data/'):]
            if not KEY.fullmatch(key) or key not in FETCHER.table:
                return self.json(404, {'error': '取得対象ではありません'})
            if parse_qs(url.query).get('refresh') == ['1'] or FETCHER.due(key):
                FETCHER.fetch(key)
            raw, fetched_at = FETCHER.latest(key)
            if raw is None:
                return self.json(503, {'error': 'まだ取得できていません'})
            self.send(200, raw, 'application/octet-stream', [('X-Fetched-At', repr(fetched_at))])
        except Exception:
            __import__('traceback').print_exc();self.json(500, {'error': '読み込みに失敗しました'})


if __name__ == '__main__':
    if '--once' in sys.argv[1:]:
        # Download every source once and write the bundle, e.g. from a scheduled job.
        failed = [key for key in FETCHER.table if FETCHER.fetch(key)]
        print(f'public-data: wrote {FETCHER.export()} with {len(FETCHER.table) - len(failed)} sources' + (f'; failed: {", ".join(failed)}' if failed else ''), flush=True)
        sys.exit(1 if failed else 0)
    threading.Thread(target=loop, daemon=True).start()
    print('Public-data fetcher: :8002', flush=True)
    ThreadingHTTPServer(('0.0.0.0', 8002), Handler).serve_forever()
