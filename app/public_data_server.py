"""Public-data fetcher: downloads NOAA, NICT and (opt-in) GIRO data for CHUCK on a schedule.

Runs as its own container in an environment that reaches the internet; CHUCK
itself never contacts the providers. Each source is validated with CHUCK's own
parser and kept as <key>.raw (the provider's bytes) and <key>.json (fetched_at,
url, sha256).

* API link: CHUCK (HF_PUBLIC_DATA_MODE=api) reads GET /api/data/<key>.
* File link: CHUCK runs on premises without internet (HF_PUBLIC_DATA_MODE=file).
  After every cycle the fetcher writes export/chuck-public-data.json, also
  served at GET /api/export; an administrator uploads it on the CHUCK admin page.

The fetcher's own admin page (public_data_ui.py) shows the sources and turns GIRO on or off, and
runs the space weather daily briefing (briefing.py) with the generative AI chosen per step.

On a public server the admin page is also served over HTTPS on its own port (HF_PUBLIC_DATA_UI_HTTPS=1,
container port 8443): only the page and its /ui/ API, never the Bearer API, optionally only to the
addresses in HF_PUBLIC_DATA_UI_ALLOW. Without a certificate a self-signed one is made in /data/tls.
"""
from datetime import datetime, timezone
import hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import ipaddress
import json
import os
from pathlib import Path
import secrets
import ssl
import subprocess
import sys
import threading
import time
from urllib.parse import urlparse, parse_qs
from urllib.request import Request, urlopen

from observations import DRAP_URL, NICT_URL, GIRO_URL, GIRO_STATIONS, giro_body, parse_drap, parse_nict, parse_giro
from briefing import Briefing
from public_data_ui import PublicDataUI, ui_password
from public_data import BUNDLE_FORMAT, KEY, MAX_RAW, PublicDataError, make_bundle, read_file, write_file
from space_weather import ALL_FEEDS, ROOT, check_schema

DATA = Path(os.environ.get('HF_PUBLIC_DATA_DIR', os.environ.get('DATA_DIR', './public-data')))
# Initial GIRO setting only; the fetcher admin page saves the choice to settings.json.
GIRO_ENABLED = os.environ.get('HF_GIRO_ENABLED', '0') == '1'
RETRY_SECONDS = 60
SETTINGS = 'settings.json'


def json_check(key):
    return lambda raw: check_schema(key, json.loads(raw))


def text_check(parser):
    return lambda raw: parser(raw.decode('utf-8', errors='replace'))


def sources(giro_enabled=None):
    """Fixed allowlist: key -> (url, request body or None, refresh seconds, validator)."""
    table = {key: (ROOT + path, None, ttl, json_check(key)) for key, (path, ttl) in ALL_FEEDS.items()}
    table['drap'] = (DRAP_URL, None, 300, text_check(parse_drap))
    table['nict'] = (NICT_URL, None, 300, text_check(parse_nict))
    if GIRO_ENABLED if giro_enabled is None else giro_enabled:
        for code in GIRO_STATIONS:
            table[code] = (GIRO_URL, lambda code=code: giro_body(code), 300, text_check(lambda text, code=code: parse_giro(text, code)))
    return table


class Fetcher:
    def __init__(self, directory, table=None):
        self.directory = Path(directory)
        self.table = sources(self.settings()['giro_enabled']) if table is None else table
        self.locks = {key: threading.Lock() for key in sources(True)} | {key: threading.Lock() for key in self.table}
        self.retry_after = {}
        self.errors = {}

    def settings(self):
        try:
            value = json.loads((self.directory / SETTINGS).read_text())
            return {'giro_enabled': value['giro_enabled'] is True}
        except (OSError, ValueError, KeyError, TypeError):
            return {'giro_enabled': GIRO_ENABLED}

    def giro_enabled(self):
        return any(code in self.table for code in GIRO_STATIONS)

    def set_giro(self, enabled):
        """Save the GIRO choice and start or stop downloading the GIRO stations."""
        self.directory.mkdir(parents=True, exist_ok=True)
        temporary = self.directory / (SETTINGS + '.tmp')
        temporary.write_text(json.dumps({'giro_enabled': bool(enabled), 'updated_at': time.time()}))
        temporary.replace(self.directory / SETTINGS)
        self.table = sources(bool(enabled))
        self.export()

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
        entry = self.table.get(key)
        if entry is None:
            return '取得対象ではありません'
        url, body, _, check = entry
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
            write_file(self.directory, key, raw, {'key': key, 'url': url, 'fetched_at': time.time(), 'sha256': hashlib.sha256(raw).hexdigest()})
            self.errors.pop(key, None)
            return None

    def latest(self, key):
        try:
            raw, fetched_at = read_file(self.directory, key)
        except PublicDataError:
            return None, None
        return raw, fetched_at

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
        for key in list(self.table):
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
            result[key] = {'url': url, 'refresh_seconds': ttl,
                           'fetched_at': datetime.fromtimestamp(fetched, timezone.utc).isoformat() if fetched else None,
                           'age_seconds': round(now - fetched) if fetched else None, 'error': self.errors.get(key)}
        return result


FETCHER = Fetcher(DATA)
# Space weather daily briefing (local files only). Its scheduler is off unless HF_BRIEFING_SCHEDULER_ENABLED=1.
BRIEFING = Briefing(DATA, refresh=lambda: FETCHER.refresh_due(every=True))


def loop():
    while True:
        try:
            FETCHER.refresh_due()
            if BRIEFING.due():
                BRIEFING.start('live', scheduled=True)
        except Exception:
            __import__('traceback').print_exc()
        time.sleep(60)


class Handler(PublicDataUI, BaseHTTPRequestHandler):
    def fetcher(self):
        return FETCHER

    def briefing(self):
        return BRIEFING

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
                if self.authorize():
                    self.json(200, {'sources': FETCHER.status(), 'giro_enabled': FETCHER.giro_enabled(),
                                    'server_time': datetime.now(timezone.utc).isoformat()})
                return
            if url.path == '/api/export':
                if self.authorize():
                    self.send(200, FETCHER.bundle(), 'application/json', [('Content-Disposition', f'attachment; filename="{BUNDLE_FORMAT}.json"')])
                return
            if self.ui_get(url.path):
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

    def do_POST(self):
        if not self.ui_post(urlparse(self.path).path):
            self.json(404, {'error': '見つかりません'})


# ---- HTTPS admin page for a public server ------------------------------------------------------------

ADMIN_PORT = 8443


class AdminHandler(Handler):
    """The admin page alone, over HTTPS: the Bearer API (/api/...) is not reachable here and cookies are Secure."""
    secure_cookie = True
    timeout = 60  # a client that stops mid-request does not hold a thread

    def allowed(self):
        networks = admin_networks()
        if networks is None:
            return True
        try:
            address = ipaddress.ip_address(self.client_address[0])
        except ValueError:
            return False
        address = address.ipv4_mapped or address if address.version == 6 else address
        return any(address in network for network in networks)

    def end_headers(self):
        self.send_header('Strict-Transport-Security', 'max-age=31536000')
        super().end_headers()

    def do_GET(self):
        if not self.allowed():
            return self.json(403, {'error': 'この接続元からは管理画面を開けません'})
        if not self.ui_get(urlparse(self.path).path):
            self.json(404, {'error': '見つかりません'})

    def do_POST(self):
        if not self.allowed():
            return self.json(403, {'error': 'この接続元からは管理画面を開けません'})
        super().do_POST()


class AdminServer(ThreadingHTTPServer):
    def handle_error(self, request, client_address):
        # Failed TLS handshakes (a browser refusing the self-signed certificate, scanners) are routine here.
        error = sys.exc_info()[1]
        if isinstance(error, (ssl.SSLError, ConnectionError, TimeoutError)):
            print(f'public-data admin: {client_address[0]}: {type(error).__name__}', flush=True)
        else:
            super().handle_error(request, client_address)


def admin_networks():
    """HF_PUBLIC_DATA_UI_ALLOW: comma-separated addresses or CIDR ranges; empty means any address (the password still applies)."""
    value = os.environ.get('HF_PUBLIC_DATA_UI_ALLOW', '').strip()
    if not value:
        return None
    networks = []
    for item in value.split(','):
        try:
            networks.append(ipaddress.ip_network(item.strip(), strict=False))
        except ValueError:
            print(f'public-data: ignored HF_PUBLIC_DATA_UI_ALLOW entry {item.strip()!r}', flush=True)
    return networks


def certificate(directory):
    """The admin page's certificate: HF_PUBLIC_DATA_UI_TLS_CERT/KEY if given, otherwise a self-signed one kept in /data/tls."""
    cert, key = os.environ.get('HF_PUBLIC_DATA_UI_TLS_CERT', ''), os.environ.get('HF_PUBLIC_DATA_UI_TLS_KEY', '')
    if cert or key:
        return Path(cert), Path(key)
    folder = Path(directory) / 'tls'
    cert, key = folder / 'cert.pem', folder / 'key.pem'
    if not (cert.exists() and key.exists()):
        folder.mkdir(parents=True, exist_ok=True)
        os.chmod(folder, 0o700)
        subprocess.run(['openssl', 'req', '-x509', '-newkey', 'rsa:3072', '-sha256', '-nodes', '-days', '825', '-subj', '/CN=CHUCK public-data admin',
                        '-keyout', str(key), '-out', str(cert)], check=True, capture_output=True, timeout=120)
        os.chmod(key, 0o600)
    return cert, key


def fingerprint(cert):
    der = ssl.PEM_cert_to_DER_cert(Path(cert).read_text())
    return ':'.join(f'{b:02X}' for b in hashlib.sha256(der).digest())


def admin_server(port=ADMIN_PORT, directory=None, handler=AdminHandler):
    """The HTTPS listener, or None (with the reason printed) when it is off or cannot start."""
    if os.environ.get('HF_PUBLIC_DATA_UI_HTTPS', '0') != '1':
        return None
    if not ui_password():
        print('public-data: HTTPS admin page is off: set HF_PUBLIC_DATA_UI_PASSWORD (16+ characters, not the token)', flush=True)
        return None
    try:
        cert, key = certificate(DATA if directory is None else directory)
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.minimum_version = ssl.TLSVersion.TLSv1_2
        context.load_cert_chain(cert, key)
        httpd = AdminServer(('0.0.0.0', port), handler)
        # The handshake runs in the request thread, so a silent client cannot stall the listener.
        httpd.socket = context.wrap_socket(httpd.socket, server_side=True, do_handshake_on_connect=False)
        print(f'public-data: HTTPS admin page on :{port} (certificate SHA-256 {fingerprint(cert)})', flush=True)
        return httpd
    except (OSError, ssl.SSLError, subprocess.SubprocessError, ValueError) as error:
        print('public-data: HTTPS admin page could not start:', type(error).__name__, error, flush=True)
        return None


if __name__ == '__main__':
    if '--once' in sys.argv[1:]:
        # Download every source once and write the bundle, e.g. from a scheduled job.
        failed = [key for key in FETCHER.table if FETCHER.fetch(key)]
        print(f'public-data: wrote {FETCHER.export()} with {len(FETCHER.table) - len(failed)} sources' + (f'; failed: {", ".join(failed)}' if failed else ''), flush=True)
        sys.exit(1 if failed else 0)
    threading.Thread(target=loop, daemon=True).start()
    admin = admin_server()
    if admin:
        threading.Thread(target=admin.serve_forever, daemon=True).start()
    print('Public-data fetcher: :8002', flush=True)
    ThreadingHTTPServer(('0.0.0.0', 8002), Handler).serve_forever()
