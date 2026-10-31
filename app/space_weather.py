"""NOAA SWPC public JSON adapter; no daily-index substitution or storm correction.

The feeds come from the public-data fetcher container (public_data.py), never from NOAA directly.
"""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import copy
from data_terms import terms_for
import public_data
import json
import math
from pathlib import Path
import threading
import time

ROOT = 'https://services.swpc.noaa.gov/'
FEEDS = {
    'observed': ('json/solar-cycle/observed-solar-cycle-indices.json', 21600),
    'predicted': ('json/solar-cycle/predicted-solar-cycle.json', 21600),
    'scales': ('products/noaa-scales.json', 300),
}
NOTE = 'SSNのみ計算入力に使用。F10.7・R/S/Gは参考表示です。瞬時の電離圏・磁気嵐による補正は行いません。NOAA公表SSN（SILSO V2尺度）は0.7倍して計算に使います（VOACAP Online Marineと同じ換算）。'
MAX_FILE = 2_000_000
# VOACAP's coefficients predate the SILSO V2 sunspot scale; VOACAP Online Marine also multiplies V2 values by 0.7.
ENGINE_SSN_SCALE = 0.7


def engine_ssn(value):
    """The SSN given to the engine for a published SILSO V2 smoothed SSN."""
    return round(value * ENGINE_SSN_SCALE, 1)


def numeric(value, high=1000):
    if isinstance(value, bool):
        return None
    try:
        value = float(value)
        return value if math.isfinite(value) and 0 <= value <= high else None
    except (TypeError, ValueError):
        return None


class SpaceWeatherError(RuntimeError):
    pass


def reject_constant(name):
    raise ValueError(name)  # NaN and Infinity are not JSON.


def check_schema(key, data):
    if key == 'scales':
        if not isinstance(data, dict) or not isinstance(data.get('0'), dict):
            raise ValueError('invalid scales schema')
    elif not isinstance(data, list) or not data or not all(isinstance(row, dict) and isinstance(row.get('time-tag'), str) for row in data):
        raise ValueError('invalid monthly schema')


def file_kind(data):
    """Which NOAA feed an uploaded file is, from the fields it carries."""
    if isinstance(data, dict):
        return 'scales'
    rows = data if isinstance(data, list) else []
    for key, field in (('predicted', 'predicted_ssn'), ('observed', 'smoothed_ssn')):
        if any(isinstance(row, dict) and field in row for row in rows):
            return key
    raise ValueError('NOAAの観測平滑SSN・予測平滑SSN・障害レベル（R/S/G）のJSONファイルではありません')


def months(key, data):
    if key == 'scales' or not isinstance(data, list):
        return None
    tags = sorted(row['time-tag'] for row in data if isinstance(row, dict) and isinstance(row.get('time-tag'), str))
    return {'first': tags[0][:7], 'last': tags[-1][:7]} if tags else None


class SpaceWeather:
    def __init__(self, directory):
        self.directory = Path(directory)
        self.lock = threading.Lock()
        self.memory = {}
        self.retry_after = {}

    def feed(self, key, force=False):
        path, ttl = FEEDS[key]
        url = ROOT + path
        with self.lock:
            cached = self.memory.get(key)
            if cached is None:
                try:
                    cached = json.loads((self.directory / (key + '.json')).read_text())
                    if not isinstance(cached, dict) or not isinstance(cached.get('fetched_at'), (int, float)):
                        cached = None
                except (OSError, ValueError):
                    cached = None
            now = time.time()
            uploaded = bool(cached) and cached.get('origin') == 'upload'
            state = 'uploaded' if uploaded else 'cache'
            if cached and 0 <= now - cached['fetched_at'] < ttl and not force:
                return dict(cached, url=url, stale=False, error=None, fetch_state=state)
            error = '取得を再試行待ちです'
            if now >= self.retry_after.get(key, 0):
                try:
                    raw, fetched_at = public_data.download(key, force)
                    origin = public_data.mode()
                    if len(raw) > MAX_FILE:
                        raise ValueError('response too large')
                    data = json.loads(raw)
                    check_schema(key, data)
                    if cached and cached['fetched_at'] >= fetched_at:
                        # The fetcher has nothing newer than an uploaded or earlier copy.
                        return dict(cached, url=url, stale=False, error=None, fetch_state=state)
                    cached = {'data': data, 'fetched_at': fetched_at, 'origin': origin}
                    self.store(key, cached)
                    return dict(cached, url=url, stale=False, error=None,fetch_state='downloaded')
                except public_data.PublicDataError as e:
                    error = str(e)
                    self.retry_after[key] = now + 60
                except Exception:
                    error = 'NOAAデータを取得できませんでした'  # The fetcher answered with something that is not the feed.
                    self.retry_after[key] = now + 60
            if uploaded:
                # The administrator's file is kept in use when NOAA cannot be reached.
                return dict(cached, url=url, stale=False, error=error, fetch_state=state)
            return dict(cached or {'data': None, 'fetched_at': None}, url=url, stale=True, error=error,fetch_state='failed')

    def store(self, key, record):
        self.memory[key] = record
        try:
            self.directory.mkdir(parents=True, exist_ok=True)
            temporary = self.directory / (key + '.tmp')
            temporary.write_text(json.dumps(record, allow_nan=False))
            temporary.replace(self.directory / (key + '.json'))
        except OSError:
            pass  # Read-only storage must not prevent a live response.

    def upload(self, raw):
        """Replace one feed with a NOAA JSON file uploaded by the administrator."""
        if not raw or len(raw) > MAX_FILE:
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
        record = {'data': data, 'fetched_at': time.time(), 'origin': 'upload'}
        with self.lock:
            self.store(key, record)
            self.retry_after.pop(key, None)
        return {'kind': key, 'rows': len(data) if isinstance(data, list) else None, 'months': months(key, data),
                'fetched_at': record['fetched_at']}

    def snapshot(self, year, month, force=False):
        target = f'{year:04d}-{month:02d}'
        # Fixed allowlisted feeds only; callers cannot supply URLs.
        with ThreadPoolExecutor(max_workers=3) as pool:
            feeds = dict(zip(FEEDS, pool.map(lambda key:self.feed(key,force), FEEDS)))
        selected = None
        for key, field, flux in [('observed', 'smoothed_ssn', 'smoothed_f10.7'), ('predicted', 'predicted_ssn', 'predicted_f10.7')]:
            feed = feeds[key]
            for row in feed['data'] or []:
                value = numeric(row.get(field), 250)
                if row.get('time-tag') == target and value is not None:
                    selected = {'value': value, 'engine_value': engine_ssn(value), 'scale': ENGINE_SSN_SCALE,
                                'month': target, 'kind': key, 'field': field,
                                'f10_7_sfu': numeric(row.get(flux)), 'source_url': feed['url'],
                                'fetched_at': feed['fetched_at'], 'stale': feed['stale']}
                    break
            if selected:
                break
        scale_feed = feeds['scales']
        current = (scale_feed['data'] or {}).get('0', {})
        scales = {}
        for key in ('R', 'S', 'G'):
            item = current.get(key)
            value = numeric(item.get('Scale'), 5) if isinstance(item, dict) else None
            scales[key] = int(value) if value is not None and value.is_integer() else None
        observed_at = None
        try:
            stamp = current['DateStamp'] + 'T' + current['TimeStamp']
            observed_at = datetime.fromisoformat(stamp).replace(tzinfo=timezone.utc).isoformat()
            age = time.time() - datetime.fromisoformat(observed_at).timestamp()
            scale_stale = scale_feed['stale'] or not -300 <= age <= 3600
        except (KeyError, TypeError, ValueError):
            scale_stale = True
        return {'data_terms': terms_for('noaa','silso-via-noaa'), 'provider': 'NOAA SWPC', 'target_month': target, 'ssn': selected,
                'current': {'scales': scales, 'observed_at': observed_at, 'stale': scale_stale,
                            'source_url': scale_feed['url'], 'fetched_at': scale_feed['fetched_at']},
                'sources': {key: dict({k: f[k] for k in ('url', 'fetched_at', 'stale', 'error','fetch_state')},
                                      origin=f.get('origin', 'download') if f['fetched_at'] else None,
                                      months=months(key, f['data'])) for key, f in feeds.items()},
                'link': public_data.describe(),
                'note': NOTE}

    def calculation_input(self, data):
        mode = data.get('ssn_source', 'manual')
        if mode not in ('manual', 'noaa'):
            raise ValueError('SSN取得方法が不正です')
        if mode == 'manual':
            return data, None
        snapshot = self.snapshot(int(data['year']), int(data['month']))
        ssn = snapshot['ssn']
        if not ssn or ssn['stale']:
            raise SpaceWeatherError('対象年月の新鮮な平滑SSNを取得できません。年月を確認するか手動入力に切り替えてください。')
        snapshot = copy.deepcopy(snapshot)
        snapshot['ssn'].update(engine_value=engine_ssn(ssn['value']), scale=ENGINE_SSN_SCALE)
        return dict(data, ssn=snapshot['ssn']['engine_value']), snapshot
