"""How CHUCK obtains public data (NOAA, NICT, GIRO), chosen with HF_PUBLIC_DATA_MODE.

CHUCK never contacts the providers itself; the public-data fetcher container
(public_data_server.py) downloads them on a schedule.

* api  (default) CHUCK asks the fetcher over HTTP; both run where the internet is reachable.
* file CHUCK runs on premises without internet. The fetcher runs in the public
       environment and writes a bundle file; an administrator uploads it on the
       CHUCK admin page, which unpacks it into HF_PUBLIC_DATA_DIR for CHUCK to read.

Callers name a fixed source key only; the fetcher owns the provider URLs.
"""
import base64
from datetime import datetime, timezone
import hashlib
import json
import math
import os
from pathlib import Path
import re
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, HTTPRedirectHandler, ProxyHandler, build_opener

MODES = ('api', 'file')
MAX_RAW = 2_000_000
MAX_BUNDLE = 16_000_000
BUNDLE_FORMAT = 'chuck-public-data'
KEY = re.compile(r'[A-Za-z0-9-]{1,32}')


class PublicDataError(RuntimeError):
    pass


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs): return None


def mode():
    value = os.environ.get('HF_PUBLIC_DATA_MODE', 'api').strip().lower()
    return value if value in MODES else 'api'


def directory():
    return Path(os.environ.get('HF_PUBLIC_DATA_DIR') or Path(os.environ.get('DATA_DIR', './data')) / 'public-data')


def describe():
    m = mode()
    return {'mode': m, 'url': os.environ.get('HF_PUBLIC_DATA_URL', 'http://public-data:8002') if m == 'api' else None}


def timestamp(value):
    try:
        value = float(value)
    except (TypeError, ValueError):
        return None
    return value if math.isfinite(value) and 0 < value < 1e11 else None


def download(key, force=False):
    """The latest raw bytes of one source and when the fetcher downloaded them (UNIX seconds)."""
    if not KEY.fullmatch(key):
        raise PublicDataError('データの種類が不正です')
    if mode() == 'file':
        return read_file(directory(), key)
    raw, headers = request('/api/data/' + key + ('?refresh=1' if force else ''))
    fetched_at = timestamp(headers.get('X-Fetched-At'))
    if len(raw) > MAX_RAW or fetched_at is None:
        raise PublicDataError('取得用コンテナに接続できないか、応答が不正です')
    return raw, fetched_at


def read_file(folder, key):
    """One source from a folder of <key>.raw and <key>.json files; None when it is missing."""
    try:
        meta = json.loads((folder / (key + '.json')).read_text())
        raw = (folder / (key + '.raw')).read_bytes()
    except OSError:
        raise PublicDataError('連携ファイルがありません。管理画面で取得用コンテナのファイルを取り込んでください') from None
    except ValueError:
        meta = None
    fetched_at = timestamp(meta.get('fetched_at')) if isinstance(meta, dict) else None
    if len(raw) > MAX_RAW or fetched_at is None or hashlib.sha256(raw).hexdigest() != meta.get('sha256'):
        raise PublicDataError('連携ファイルが壊れています。取り込み直してください')
    return raw, fetched_at


def write_file(folder, key, raw, meta):
    folder.mkdir(parents=True, exist_ok=True)
    # The raw file is replaced before its description, so a reader never pairs new metadata with old bytes.
    for name, content in ((key + '.raw', raw), (key + '.json', json.dumps(meta).encode())):
        temporary = folder / (name + '.tmp')
        temporary.write_bytes(content)
        temporary.replace(folder / name)


def make_bundle(folder, keys):
    """Every source the fetcher holds, as one JSON file to carry to an on-premises CHUCK."""
    sources = {}
    for key in keys:
        try:
            raw, fetched_at = read_file(folder, key)
            meta = json.loads((folder / (key + '.json')).read_text())
        except (PublicDataError, OSError, ValueError):
            continue
        sources[key] = {'url': meta.get('url'), 'fetched_at': fetched_at, 'sha256': meta['sha256'],
                        'raw': base64.b64encode(raw).decode()}
    return {'format': BUNDLE_FORMAT, 'version': 1, 'created_at': datetime.now(timezone.utc).isoformat(), 'sources': sources}


def import_bundle(content, folder, validators):
    """Unpack a fetcher bundle; each source is checked like a download and replaces only older data."""
    try:
        bundle = json.loads(content)
        if not isinstance(bundle, dict) or bundle.get('format') != BUNDLE_FORMAT or not isinstance(bundle.get('sources'), dict):
            raise ValueError
    except (ValueError, UnicodeError):
        raise ValueError('取得用コンテナの連携ファイルではありません') from None
    result = {'imported': [], 'skipped': [], 'rejected': []}
    for key, item in bundle['sources'].items():
        try:
            if not KEY.fullmatch(key) or key not in validators or not isinstance(item, dict):
                raise ValueError(key)
            raw = base64.b64decode(item.get('raw') or '', validate=True)
            fetched_at = timestamp(item.get('fetched_at'))
            if len(raw) > MAX_RAW or fetched_at is None or hashlib.sha256(raw).hexdigest() != item.get('sha256'):
                raise ValueError(key)
            validators[key](raw)
        except Exception:
            result['rejected'].append(key)
            continue
        try:
            current = read_file(folder, key)[1]
        except PublicDataError:
            current = None
        if current is not None and current >= fetched_at:
            result['skipped'].append(key)
            continue
        url = item.get('url') if isinstance(item.get('url'), str) else None
        write_file(folder, key, raw, {'key': key, 'url': url, 'fetched_at': fetched_at, 'sha256': item['sha256']})
        result['imported'].append(key)
    if not result['imported'] and not result['skipped']:
        raise ValueError('取り込める公開データがありません')
    return result


def request(path):
    """GET one path of the fetcher API; returns the body and headers."""
    base = os.environ.get('HF_PUBLIC_DATA_URL', 'http://public-data:8002').rstrip('/')
    token = os.environ.get('HF_PUBLIC_DATA_TOKEN', '')
    url = urlparse(base)
    if url.scheme not in ('http', 'https') or not url.hostname or url.username or url.password or url.query or url.fragment:
        raise PublicDataError('取得用コンテナのURL設定が不正です')
    if len(token) < 32:
        raise PublicDataError('32文字以上のHF_PUBLIC_DATA_TOKENを設定してください')
    req = Request(base + path, headers={'Authorization': 'Bearer ' + token})
    try:
        # Keep the internal token off proxies and redirect destinations.
        with build_opener(ProxyHandler({}), NoRedirect).open(req, timeout=15) as response:
            raw = response.read(MAX_BUNDLE + 1)
            headers = response.headers
        if len(raw) > MAX_BUNDLE:
            raise ValueError('oversized response')
    except HTTPError as e:
        raise PublicDataError('取得用コンテナから取得できませんでした（HTTP ' + str(e.code) + '）') from None
    except (URLError, OSError, ValueError):
        raise PublicDataError('取得用コンテナに接続できないか、応答が不正です') from None
    return raw, headers
