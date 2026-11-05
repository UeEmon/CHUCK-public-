"""CHUCK's client of the public-data container (public_data_server.py); the only way CHUCK gets public data.

CHUCK never contacts the providers (NOAA, NICT, GIRO) and never saves, reads or
imports public data files itself. The public-data container downloads the data,
keeps every file (downloads, imported link files, imported NOAA files) and hands
it to CHUCK over its Bearer API.

Where the container's data comes from is the container's setting
(HF_PUBLIC_DATA_SOURCE, see public_data_server.py):

* internet (default) it downloads from the providers; CHUCK and the container run where the internet is reachable.
* file     CHUCK and the container run on premises without internet. The container reads a link file written
           by a container in the public environment; an administrator imports it on the container's own admin page.

Callers name a fixed source key only; the container owns the provider URLs.
"""
import json
import math
import os
import re
import threading
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, HTTPRedirectHandler, ProxyHandler, build_opener

STATUS_SECONDS = 30
LINK_LOCK = threading.Lock()
LINK = {}
MAX_RAW = 2_000_000
MAX_BUNDLE = 16_000_000
BUNDLE_FORMAT = 'chuck-public-data'
KEY = re.compile(r'[A-Za-z0-9-]{1,32}')
SOURCES = ('internet', 'file')
# How the container obtained a source -> how CHUCK's pages name it.
ORIGINS = {'download': 'api', 'bundle': 'file', 'upload': 'upload'}


class PublicDataError(RuntimeError):
    pass


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs): return None


def base_url():
    return os.environ.get('HF_PUBLIC_DATA_URL', 'http://public-data:8002')


def describe():
    """The link shown with the space weather data: always the container's API, and where its data comes from."""
    link = link_status()
    return {'mode': 'api', 'url': base_url(), 'source': link.get('source')}


def link_status(refresh=False):
    """Whether CHUCK reaches the container, and the container's settings; checked at most every 30 seconds."""
    with LINK_LOCK:
        now = time.time()
        if refresh or not LINK or not 0 <= now - LINK['checked_at'] < STATUS_SECONDS:
            try:
                status = json.loads(request('/api/status')[0])
                if not isinstance(status, dict):
                    raise PublicDataError('取得用コンテナの応答が不正です')
                LINK.update(connected=True, error=None, giro_enabled=status.get('giro_enabled') is True, connected_at=now,
                            source=status.get('source') if status.get('source') in SOURCES else 'internet',
                            imported_at=timestamp(status.get('imported_at')))
            except (PublicDataError, ValueError) as e:
                # Keep the last known settings while the container cannot be reached.
                LINK.update(connected=False, error=str(e) if isinstance(e, PublicDataError) else '取得用コンテナの応答が不正です')
                LINK.setdefault('giro_enabled', False)
            LINK['checked_at'] = now
        return {'mode': 'api', 'connected': LINK['connected'], 'checked_at': LINK['checked_at'], 'connected_at': LINK.get('connected_at'),
                'error': LINK['error'], 'giro_enabled': LINK['giro_enabled'], 'source': LINK.get('source'),
                'imported_at': LINK.get('imported_at')}


def giro_enabled():
    return link_status()['giro_enabled']


def timestamp(value):
    try:
        value = float(value)
    except (TypeError, ValueError):
        return None
    return value if math.isfinite(value) and 0 < value < 1e11 else None


def download(key, force=False):
    """The latest raw bytes of one source, when the container obtained them (UNIX seconds) and how
    ('api' downloaded by the container, 'file' from an imported link file, 'upload' from an uploaded NOAA file)."""
    if not KEY.fullmatch(key):
        raise PublicDataError('データの種類が不正です')
    raw, headers = request('/api/data/' + key + ('?refresh=1' if force else ''))
    fetched_at = timestamp(headers.get('X-Fetched-At'))
    if len(raw) > MAX_RAW or fetched_at is None:
        raise PublicDataError('取得用コンテナに接続できないか、応答が不正です')
    return raw, fetched_at, ORIGINS.get(headers.get('X-Origin'), 'api')


def fetcher_request(path, headers=None):
    base = base_url().rstrip('/')
    token = os.environ.get('HF_PUBLIC_DATA_TOKEN', '')
    url = urlparse(base)
    if url.scheme not in ('http', 'https') or not url.hostname or url.username or url.password or url.query or url.fragment:
        raise PublicDataError('取得用コンテナのURL設定が不正です')
    if len(token) < 32:
        raise PublicDataError('32文字以上のHF_PUBLIC_DATA_TOKENを設定してください')
    return Request(base + path, headers={**(headers or {}), 'Authorization': 'Bearer ' + token})


def open_stream(path, headers=None):
    """GET one path of the container API without reading it (a published video, passed on in pieces).
    Returns the open response; HTTP errors come back as (code, None)."""
    req = fetcher_request(path, headers)
    try:
        return build_opener(ProxyHandler({}), NoRedirect).open(req, timeout=15)
    except HTTPError as e:
        e.close()
        return e.code
    except (URLError, OSError, ValueError):
        raise PublicDataError('取得用コンテナに接続できないか、応答が不正です') from None


def request(path):
    """GET one path of the container API; returns the body and headers."""
    req = fetcher_request(path)
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
