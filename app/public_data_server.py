"""Public-data fetcher: downloads NOAA, NICT and (opt-in) GIRO data for CHUCK on a schedule.

Runs as its own container in an environment that reaches the internet; CHUCK
itself never contacts the providers. Each source is validated with CHUCK's own
parser and kept as <key>.raw (the provider's bytes) and <key>.json (fetched_at,
url, sha256).

CHUCK never saves, reads or imports public data files: it receives every
source from this container's Bearer API (GET /api/data/<key>). Link files and
NOAA JSON files are imported on this container's own admin page (or with the
Bearer API POST /api/import).

Where the data comes from is HF_PUBLIC_DATA_SOURCE:

* internet (default): downloaded from the providers on a schedule. After every
  cycle the container writes export/chuck-public-data.json (the link file),
  also served at GET /api/export.
* file: on premises without internet. Nothing is downloaded; the data comes from
  a link file written by a container in the public environment, or from NOAA
  JSON files, imported on this container's admin page.

The fetcher's own admin page (public_data_ui.py) shows the sources and turns GIRO on or off, and
runs the space weather daily briefing (briefing.py) with the generative AI chosen per step.
"""
from datetime import datetime, timezone
import hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
import re
from pathlib import Path
import secrets
import sys
import threading
import time
from urllib.parse import urlparse, parse_qs
from urllib.request import Request, urlopen

from observations import DRAP_URL, NICT_URL, GIRO_URL, GIRO_STATIONS, giro_body, parse_drap, parse_nict, parse_giro
from briefing import Briefing, THREE_DAY, THREE_DAY_URL, parse_three_day, release_flags
from public_data_ui import PublicDataUI
from public_data import BUNDLE_FORMAT, KEY, MAX_BUNDLE, MAX_RAW
from public_data_store import StoreError, import_bundle, import_noaa, is_bundle, make_bundle, read_file, write_file
from space_weather import ALL_FEEDS, ROOT, check_schema

DATA = Path(os.environ.get('HF_PUBLIC_DATA_DIR', os.environ.get('DATA_DIR', './public-data')))
# Initial GIRO setting only; the fetcher admin page saves the choice to settings.json.
GIRO_ENABLED = os.environ.get('HF_GIRO_ENABLED', '0') == '1'
RETRY_SECONDS = 60
SETTINGS = 'settings.json'


def source():
    """'file' on premises (data only from imported files), otherwise 'internet'.
    HF_PUBLIC_DATA_MODE=file, CHUCK's former setting for the file link, still selects file."""
    value = os.environ.get('HF_PUBLIC_DATA_SOURCE', '').strip().lower()
    if not value:
        value = os.environ.get('HF_PUBLIC_DATA_MODE', '').strip().lower()
    return 'file' if value in ('file', 'offline') else 'internet'


def json_check(key):
    return lambda raw: check_schema(key, json.loads(raw))


def text_check(parser):
    return lambda raw: parser(raw.decode('utf-8', errors='replace'))


def sources(giro_enabled=None):
    """Fixed allowlist: key -> (url, request body or None, refresh seconds, validator)."""
    table = {key: (ROOT + path, None, ttl, json_check(key)) for key, (path, ttl) in ALL_FEEDS.items()}
    table['drap'] = (DRAP_URL, None, 300, text_check(parse_drap))
    # NOAA's 3-day forecast text, read by the briefing for the Kp forecast's issue time only.
    table[THREE_DAY] = (THREE_DAY_URL, None, 3600, text_check(parse_three_day))
    table['nict'] = (NICT_URL, None, 300, text_check(parse_nict))
    if GIRO_ENABLED if giro_enabled is None else giro_enabled:
        for code in GIRO_STATIONS:
            table[code] = (GIRO_URL, lambda code=code: giro_body(code), 300, text_check(lambda text, code=code: parse_giro(text, code)))
    return table


# While a briefing edition waits for its data (00:00-03:00 UTC, and 12:00-15:00 UTC when that edition is on),
# the Kp products are read every 5 minutes instead of every 10 or 60, so a new issue is seen within 5 minutes.
FAST_KEYS = ('kp', 'kp-forecast', THREE_DAY)
FAST_SECONDS = 300


class Fetcher:
    def __init__(self, directory, table=None, fast=None):
        self.directory = Path(directory)
        self.fast = fast or (lambda: False)
        self.table = sources(self.settings()['giro_enabled']) if table is None else table
        self.locks = {key: threading.Lock() for key in sources(True)} | {key: threading.Lock() for key in self.table}
        self.retry_after = {}
        self.errors = {}
        self.import_lock = threading.Lock()

    def settings(self):
        try:
            value = json.loads((self.directory / SETTINGS).read_text())
            value = value if isinstance(value, dict) else {}
        except (OSError, ValueError):
            value = {}
        imported = value.get('imported_at')
        return {'giro_enabled': value['giro_enabled'] is True if 'giro_enabled' in value else GIRO_ENABLED,
                'imported_at': imported if isinstance(imported, (int, float)) and not isinstance(imported, bool) else None}

    def save_settings(self, **changes):
        self.directory.mkdir(parents=True, exist_ok=True)
        temporary = self.directory / (SETTINGS + '.tmp')
        try:
            current = json.loads((self.directory / SETTINGS).read_text())
            current = current if isinstance(current, dict) else {}
        except (OSError, ValueError):
            current = {}
        temporary.write_text(json.dumps({**current, **changes, 'updated_at': time.time()}))
        temporary.replace(self.directory / SETTINGS)

    def giro_enabled(self):
        return any(code in self.table for code in GIRO_STATIONS)

    def set_giro(self, enabled):
        """Save the GIRO choice and start or stop downloading the GIRO stations."""
        self.save_settings(giro_enabled=bool(enabled))
        self.table = sources(bool(enabled))
        self.export()

    def import_file(self, raw):
        """Check and save a link file or a NOAA JSON file imported by an administrator.
        A link file replaces only older data; on premises its GIRO setting is taken over too."""
        if is_bundle(raw) or len(raw) > MAX_RAW:
            validators = {key: check for key, (_, _, _, check) in sources(giro_enabled=True).items()}
            with self.import_lock:
                result, giro = import_bundle(raw, self.directory, validators)
                if source() == 'file' and giro is not None and giro != self.giro_enabled():
                    self.save_settings(giro_enabled=giro)
                    self.table = sources(giro)
                self.save_settings(imported_at=time.time())
                self.export()
            return {'bundle': result}
        with self.import_lock:
            result = import_noaa(raw, self.directory)
            self.retry_after.pop(result['kind'], None)
            self.save_settings(imported_at=time.time())
            self.export()
        return result

    def meta(self, key):
        try:
            return json.loads((self.directory / (key + '.json')).read_text())
        except (OSError, ValueError):
            return None

    def refresh_seconds(self, key):
        ttl = self.table[key][2]
        try:
            return min(ttl, FAST_SECONDS) if key in FAST_KEYS and self.fast() else ttl
        except Exception:
            return ttl

    def due(self, key):
        meta = self.meta(key)
        return not meta or not 0 <= time.time() - meta.get('fetched_at', 0) < self.refresh_seconds(key)

    def fetch(self, key):
        """Download one source now; returns an error message or None. Failures keep the previous files."""
        entry = self.table.get(key)
        if entry is None:
            return '取得対象ではありません'
        url, body, _, check = entry
        if source() == 'file':
            return 'オンプレミス（ファイル連携）のため提供元から取得しません'
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
                self.errors[key] = '提供元から取得できませんでした'
                return self.errors[key]
            write_file(self.directory, key, raw, {'key': key, 'url': url, 'fetched_at': time.time(),
                                                  'sha256': hashlib.sha256(raw).hexdigest(), 'origin': 'download'})
            self.errors.pop(key, None)
            return None

    def latest(self, key):
        """The saved bytes of one source, when they were obtained and how ('download', 'bundle' or 'upload')."""
        try:
            return read_file(self.directory, key)
        except StoreError:
            return None, None, None

    def bundle(self):
        bundle = make_bundle(self.directory, list(self.table))
        bundle['settings'] = {'giro_enabled': self.giro_enabled()}
        return json.dumps(bundle).encode()

    def export(self):
        """Write the bundle for the file link; returns its path."""
        path = self.directory / 'export' / (BUNDLE_FORMAT + '.json')
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary = path.with_suffix('.tmp')
        temporary.write_bytes(self.bundle())
        temporary.replace(path)
        return path

    def refresh_due(self, every=False):
        changed = False
        for key in list(self.table) if source() == 'internet' else []:
            if every or self.due(key):
                changed = self.fetch(key) is None or changed
        if changed or not (self.directory / 'export' / (BUNDLE_FORMAT + '.json')).exists():
            self.export()

    def status(self):
        now = time.time()
        result = {}
        for key, (url, _, ttl, _) in list(self.table.items()):
            meta = self.meta(key) or {}
            fetched = meta.get('fetched_at')
            result[key] = {'url': url, 'refresh_seconds': self.refresh_seconds(key),
                           'fetched_at': datetime.fromtimestamp(fetched, timezone.utc).isoformat() if fetched else None,
                           'age_seconds': round(now - fetched) if fetched else None, 'error': self.errors.get(key),
                           'origin': meta.get('origin', 'download') if fetched else None}
        return result


FETCHER = Fetcher(DATA)
# Space weather daily briefing (local files only). Its scheduler is off unless HF_BRIEFING_SCHEDULER_ENABLED=1.
BRIEFING = Briefing(DATA, refresh=lambda: FETCHER.refresh_due(every=True))
FETCHER.fast = lambda: release_flags()['scheduler_enabled'] and BRIEFING.window_open()


def loop():
    while True:
        try:
            FETCHER.refresh_due()
            edition = BRIEFING.due()
            if edition:
                BRIEFING.start('live', run_date=edition[0], scheduled=True, hour=edition[1])
        except Exception:
            __import__('traceback').print_exc()
        time.sleep(60)


class Handler(PublicDataUI, BaseHTTPRequestHandler):
    def fetcher(self):
        return FETCHER

    def briefing(self):
        return BRIEFING

    def data_source(self):
        return source()

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

    def send_file(self, path):
        """A published file, with byte ranges so that a browser can seek in the video."""
        size = path.stat().st_size
        kind = {'.mp4': 'video/mp4', '.vtt': 'text/vtt; charset=utf-8', '.json': 'application/json; charset=utf-8'}[path.suffix]
        start, end, code = 0, size - 1, 200
        match = re.fullmatch(r'bytes=(\d*)-(\d*)', self.headers.get('Range', '').strip())
        if match and size and (match.group(1) or match.group(2)):
            if match.group(1):
                start, end = int(match.group(1)), min(int(match.group(2) or size - 1), size - 1)
            else:
                start = max(0, size - int(match.group(2)))
            if start > end:
                self.send_response(416)
                self.send_header('Content-Range', f'bytes */{size}')
                self.send_header('Content-Length', '0')
                self.end_headers()
                return
            code = 206
        self.send_response(code)
        self.send_header('Content-Type', kind)
        self.send_header('Content-Length', str(end - start + 1))
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('X-Content-Type-Options', 'nosniff')
        if code == 206:
            self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.end_headers()
        with path.open('rb') as f:
            f.seek(start)
            left = end - start + 1
            while left > 0:
                chunk = f.read(min(1 << 16, left))
                if not chunk:
                    break
                self.wfile.write(chunk)
                left -= len(chunk)

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
                if self.authorize():
                    self.json(200, {'sources': FETCHER.status(), 'giro_enabled': FETCHER.giro_enabled(),
                                    'source': source(), 'imported_at': FETCHER.settings()['imported_at'],
                                    'server_time': datetime.now(timezone.utc).isoformat()})
                return
            if url.path == '/api/export':
                if self.authorize():
                    self.send(200, FETCHER.bundle(), 'application/json', [('Content-Disposition', f'attachment; filename="{BUNDLE_FORMAT}.json"')])
                return
            if url.path == '/api/briefing/published':
                # Released briefings for CHUCK's space weather tab (the only place they are published).
                if self.authorize():
                    self.json(200, {'items': BRIEFING.published()})
                return
            if url.path.startswith('/api/briefing/published/'):
                if not self.authorize():
                    return
                release, _, name = url.path[len('/api/briefing/published/'):].partition('/')
                path = BRIEFING.published_file(release, name)
                if path is None:
                    return self.json(404, {'error': '見つかりません'})
                return self.send_file(path)
            if self.ui_get(url.path):
                return
            if not url.path.startswith('/api/data/'):
                return self.json(404, {'error': '見つかりません'})
            if not self.authorize():
                return
            key = url.path[len('/api/data/'):]
            if not KEY.fullmatch(key) or key not in FETCHER.table:
                return self.json(404, {'error': '取得対象ではありません'})
            if source() == 'internet' and (parse_qs(url.query).get('refresh') == ['1'] or FETCHER.due(key)):
                FETCHER.fetch(key)
            raw, fetched_at, origin = FETCHER.latest(key)
            if raw is None:
                return self.json(503, {'error': 'まだ取得できていません' if source() == 'internet' else
                                       '連携ファイルがありません。管理画面で取得用コンテナのファイルを取り込んでください'})
            self.send(200, raw, 'application/octet-stream', [('X-Fetched-At', repr(fetched_at)), ('X-Origin', origin)])
        except Exception:
            __import__('traceback').print_exc();self.json(500, {'error': '読み込みに失敗しました'})

    def do_POST(self):
        path = urlparse(self.path).path
        if path == '/api/import':
            return self.import_file()
        if not self.ui_post(path):
            self.json(404, {'error': '見つかりません'})

    def import_file(self):
        """POST /api/import: a link file or a NOAA JSON file, e.g. from a scheduled job (the admin page uses /ui/api/import)."""
        if not self.authorize():
            return
        if self.headers.get('Content-Type', '').split(';')[0].strip() != 'application/json':
            return self.json(415, {'error': 'application/jsonが必要です'})
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if not 0 < length <= MAX_BUNDLE:
                raise ValueError('ファイルは16 MB以下にしてください')
            self.json(200, FETCHER.import_file(self.rfile.read(length)))
        except (ValueError, UnicodeError) as e:
            self.json(400, {'error': str(e)})
        except Exception:
            __import__('traceback').print_exc();self.json(500, {'error': '公開データを取り込めませんでした'})


if __name__ == '__main__':
    if '--once' in sys.argv[1:]:
        if source() == 'file':
            print('public-data: HF_PUBLIC_DATA_SOURCE=file never downloads; import a link file instead', flush=True)
            sys.exit(1)
        # Download every source once and write the bundle, e.g. from a scheduled job.
        failed = [key for key in FETCHER.table if FETCHER.fetch(key)]
        print(f'public-data: wrote {FETCHER.export()} with {len(FETCHER.table) - len(failed)} sources' + (f'; failed: {", ".join(failed)}' if failed else ''), flush=True)
        sys.exit(1 if failed else 0)
    threading.Thread(target=loop, daemon=True).start()
    print(f'Public-data fetcher ({source()}): :8002', flush=True)
    ThreadingHTTPServer(('0.0.0.0', 8002), Handler).serve_forever()
