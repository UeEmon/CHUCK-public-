"""NOAA SWPC public JSON adapter; no daily-index substitution or storm correction."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import copy
from data_terms import terms_for
import json
import math
from pathlib import Path
import threading
import time
from urllib.request import Request, urlopen

ROOT = 'https://services.swpc.noaa.gov/'
FEEDS = {
    'observed': ('json/solar-cycle/observed-solar-cycle-indices.json', 21600),
    'predicted': ('json/solar-cycle/predicted-solar-cycle.json', 21600),
    'scales': ('products/noaa-scales.json', 300),
}
NOTE = 'SSNのみ計算入力に使用。F10.7・R/S/Gは参考表示です。瞬時の電離圏・磁気嵐による補正は行いません。NOAA公表SSNを無変換で使用し、旧VOACAP係数との尺度校正は未検証です。'


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
            if cached and 0 <= now - cached['fetched_at'] < ttl and not force:
                return dict(cached, url=url, stale=False, error=None,fetch_state='cache')
            error = '取得を再試行待ちです'
            if now >= self.retry_after.get(key, 0):
                try:
                    request = Request(url, headers={'User-Agent': 'HF-Propagation-JP/0.2', 'Accept': 'application/json'})
                    with urlopen(request, timeout=8) as response:
                        raw = response.read(2_000_001)
                    if len(raw) > 2_000_000:
                        raise ValueError('response too large')
                    data = json.loads(raw)
                    if key == 'scales':
                        if not isinstance(data, dict) or not isinstance(data.get('0'), dict):
                            raise ValueError('invalid scales schema')
                    elif not isinstance(data, list) or not data or not all(isinstance(row, dict) and isinstance(row.get('time-tag'), str) for row in data):
                        raise ValueError('invalid monthly schema')
                    cached = {'data': data, 'fetched_at': time.time()}
                    self.memory[key] = cached
                    try:
                        self.directory.mkdir(parents=True, exist_ok=True)
                        temporary = self.directory / (key + '.tmp')
                        temporary.write_text(json.dumps(cached, allow_nan=False))
                        temporary.replace(self.directory / (key + '.json'))
                    except OSError:
                        pass  # Read-only storage must not prevent a live response.
                    return dict(cached, url=url, stale=False, error=None,fetch_state='downloaded')
                except Exception:
                    error = 'NOAAデータを取得できませんでした'
                    self.retry_after[key] = now + 60
            return dict(cached or {'data': None, 'fetched_at': None}, url=url, stale=True, error=error,fetch_state='failed')

    def snapshot(self, year, month, force=False):
        target = f'{year:04d}-{month:02d}'
        # Fixed allowlisted endpoints only; callers cannot supply URLs.
        with ThreadPoolExecutor(max_workers=3) as pool:
            feeds = dict(zip(FEEDS, pool.map(lambda key:self.feed(key,force), FEEDS)))
        selected = None
        for key, field, flux in [('observed', 'smoothed_ssn', 'smoothed_f10.7'), ('predicted', 'predicted_ssn', 'predicted_f10.7')]:
            feed = feeds[key]
            for row in feed['data'] or []:
                value = numeric(row.get(field), 250)
                if row.get('time-tag') == target and value is not None:
                    selected = {'value': value, 'month': target, 'kind': key, 'field': field,
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
                'sources': {key: {k: f[k] for k in ('url', 'fetched_at', 'stale', 'error','fetch_state')} for key, f in feeds.items()},
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
        return dict(data, ssn=ssn['value']), copy.deepcopy(snapshot)
