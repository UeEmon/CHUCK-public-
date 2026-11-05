"""The public-data container's files: every save and every read of public data happens here, never in CHUCK.

Each source is kept as <key>.raw (the provider's bytes) and <key>.json (key, url, fetched_at, sha256 and
origin: 'download' fetched by the container, 'bundle' from an imported link file, 'upload' from an
uploaded NOAA JSON file). CHUCK receives them over the container's API (public_data.py).
"""
import base64
from datetime import datetime, timezone
import hashlib
import json
import time

from public_data import BUNDLE_FORMAT, KEY, MAX_RAW, timestamp
from space_weather import ALL_FEEDS, ROOT, check_schema, file_kind, months, numeric, reject_constant

ORIGINS = ('download', 'bundle', 'upload')


class StoreError(RuntimeError):
    pass


def read_file(folder, key):
    """One source from a folder of <key>.raw and <key>.json files."""
    try:
        meta = json.loads((folder / (key + '.json')).read_text())
        raw = (folder / (key + '.raw')).read_bytes()
    except OSError:
        raise StoreError('まだ取得できていません') from None
    except ValueError:
        meta = None
    fetched_at = timestamp(meta.get('fetched_at')) if isinstance(meta, dict) else None
    if len(raw) > MAX_RAW or fetched_at is None or hashlib.sha256(raw).hexdigest() != meta.get('sha256'):
        raise StoreError('保存したデータが壊れています')
    return raw, fetched_at, meta.get('origin') if meta.get('origin') in ORIGINS else 'download'


def write_file(folder, key, raw, meta):
    folder.mkdir(parents=True, exist_ok=True)
    # The raw file is replaced before its description, so a reader never pairs new metadata with old bytes.
    for name, content in ((key + '.raw', raw), (key + '.json', json.dumps(meta).encode())):
        temporary = folder / (name + '.tmp')
        temporary.write_bytes(content)
        temporary.replace(folder / name)


def make_bundle(folder, keys):
    """Every source the container holds, as one JSON file to carry to an on-premises container."""
    sources = {}
    for key in keys:
        try:
            raw, fetched_at, _ = read_file(folder, key)
            meta = json.loads((folder / (key + '.json')).read_text())
        except (StoreError, OSError, ValueError):
            continue
        sources[key] = {'url': meta.get('url'), 'fetched_at': fetched_at, 'sha256': meta['sha256'],
                        'raw': base64.b64encode(raw).decode()}
    return {'format': BUNDLE_FORMAT, 'version': 1, 'created_at': datetime.now(timezone.utc).isoformat(), 'sources': sources}


def is_bundle(raw):
    return b'"' + BUNDLE_FORMAT.encode() + b'"' in raw[:4096]


def import_bundle(content, folder, validators):
    """Unpack a link file; each source is checked like a download and replaces only older data.
    Returns the result and the GIRO setting the file carries (None when it carries none)."""
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
        except StoreError:
            current = None
        if current is not None and current >= fetched_at:
            result['skipped'].append(key)
            continue
        url = item.get('url') if isinstance(item.get('url'), str) else None
        write_file(folder, key, raw, {'key': key, 'url': url, 'fetched_at': fetched_at, 'sha256': item['sha256'], 'origin': 'bundle'})
        result['imported'].append(key)
    if not result['imported'] and not result['skipped']:
        raise ValueError('取り込める公開データがありません')
    settings = bundle.get('settings')
    giro = settings.get('giro_enabled') if isinstance(settings, dict) and isinstance(settings.get('giro_enabled'), bool) else None
    return result, giro


def import_noaa(raw, folder):
    """Save one NOAA SWPC JSON file (observed or predicted smoothed SSN, or the R/S/G scales) uploaded by an administrator."""
    if not raw or len(raw) > MAX_RAW:
        raise ValueError('ファイルは2 MB以下のNOAA JSONを指定してください')
    try:
        data = json.loads(raw, parse_constant=reject_constant)
    except (ValueError, UnicodeError):
        raise ValueError('JSONとして読み取れません') from None
    key = file_kind(data)
    try:
        check_schema(key, data)
    except ValueError:
        raise ValueError('NOAAの観測平滑SSN・予測平滑SSN・障害レベル（R/S/G）のJSONファイルではありません') from None
    if key != 'scales' and not any(numeric(row.get('smoothed_ssn' if key == 'observed' else 'predicted_ssn'), 250) is not None for row in data):
        raise ValueError('有効な平滑SSNが1件もありません')
    fetched_at = time.time()
    write_file(folder, key, raw, {'key': key, 'url': ROOT + ALL_FEEDS[key][0], 'fetched_at': fetched_at,
                                  'sha256': hashlib.sha256(raw).hexdigest(), 'origin': 'upload'})
    return {'kind': key, 'rows': len(data) if isinstance(data, list) else None, 'months': months(key, data), 'fetched_at': fetched_at}
