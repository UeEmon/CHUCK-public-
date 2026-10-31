"""Public HF observations. Only the opt-in effective SSN (effective_ssn.py) feeds them into VOACAP."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
import copy
from data_terms import terms_for
import public_data
import json
import math
from pathlib import Path
import re
import threading
import time
from urllib.parse import urlencode

UTC = timezone.utc
DRAP_URL = 'https://services.swpc.noaa.gov/text/drap_global_frequencies.txt'
NICT_URL = 'https://wdc.nict.go.jp/Ionosphere/realtime/oblver/index.html'
GIRO_URL = 'https://giro.uml.edu/didbase/scaled.php'
GIRO_TERMS = 'https://giro.uml.edu/didbase/RulesOfTheRoad.html'
NICT_STATIONS = {
    'WK546': ('稚内', 45.16, 141.75), 'TO536': ('国分寺', 35.71, 139.49),
    'YG431': ('山川', 31.20, 130.62), 'OK426': ('大宜味', 26.68, 128.15),
}
GIRO_STATIONS = {'GU513': 'Guam', 'JR055': 'Juliusruh', 'MHJ45': 'Millstone Hill'}


def finite(value, low=0, high=200):
    try:
        n = float(value)
        return n if math.isfinite(n) and low <= n <= high else None
    except (TypeError, ValueError):
        return None


def stamp(value, offset=0):
    return datetime.fromisoformat(value.replace('Z', '+00:00')).replace(
        tzinfo=timezone(timedelta(hours=offset))).astimezone(UTC).isoformat()


def is_old(value, seconds=3600, now=None):
    try:
        age = (time.time() if now is None else now) - datetime.fromisoformat(value).timestamp()
        return not -300 <= age <= seconds
    except (TypeError, ValueError):
        return True


def parse_drap(text):
    match = re.search(r'Product Valid At\s*:\s*(\d{4}-\d\d-\d\d \d\d:\d\d) UTC', text)
    if not match:
        raise ValueError('D-RAP timestamp missing')
    lons = None
    rows = []
    for line in text.splitlines():
        if not line.strip() or line.lstrip().startswith('#'):
            continue
        if '|' not in line:
            parts = line.split()
            if len(parts) > 2 and all(re.fullmatch(r'-?\d+(?:\.\d+)?', p) for p in parts):
                lons = [float(p) for p in parts]
            continue
        lat, values = line.split('|', 1)
        lat = finite(lat.strip(), -90, 90)
        if lat is None or lons is None:
            raise ValueError('D-RAP grid invalid')
        values = values.split()
        if len(values) != len(lons):
            raise ValueError('D-RAP row width mismatch')
        rows.append({'lat': lat, 'values': [finite(v) for v in values]})
    if not lons or not rows or len(set(lons)) != len(lons) or any(not -180 <= n <= 180 for n in lons):
        raise ValueError('D-RAP grid missing')
    if lons != sorted(lons) or len({r['lat'] for r in rows}) != len(rows):
        raise ValueError('D-RAP coordinate order invalid')
    rows.sort(key=lambda r:r['lat'], reverse=True)
    if not any(any(v is not None for v in row['values']) for row in rows):
        raise ValueError('D-RAP has no valid cells')
    return {'observed_at': stamp(match[1]), 'longitudes': lons, 'rows': rows,
            'quantity': 'HAF: 垂直伝搬で1 dB吸収の影響を受ける最高周波数（MHz）',
            'note': '経路全体の損失やMUFではありません。0は吸収影響周波数0 MHz、欠測はnull。'}


def parse_nict(text):
    stations = []
    for block in re.split(r'\bStation\s*:', text)[1:]:
        code = block.split()[0]
        if code not in NICT_STATIONS:
            continue
        name, lat, lon = NICT_STATIONS[code]
        timestamp = re.search(r'Latest data\s*:\s*(\d{4}/\d\d/\d\d \d\d:\d\d)\s*\(JST', block)
        observed = stamp(timestamp[1].replace('/', '-'), 9) if timestamp else None
        f_region = re.search(r'-+\s*F region\s*-+(.*?)(?:-+\s*E region|<img|\Z)', block, re.S)
        bands = []
        if f_region:
            for row in re.finditer(r'^\s*(Vertical|\d+)\s*,\s*([^,\n]+),\s*([^|\n]+)\|', f_region[1], re.M):
                bands.append({'distance_km': 0 if row[1] == 'Vertical' else int(row[1]),
                              'luf_mhz': finite(row[2]), 'muf_mhz': finite(row[3])})
        vertical = next((r['muf_mhz'] for r in bands if r['distance_km'] == 0), None)
        stations.append({'code': code, 'name': name, 'lat': lat, 'lon': lon, 'observed_at': observed,
                         'fof2_mhz': vertical, 'bands': bands, 'quality': '自動読取・垂直観測からの推定'})
    if not stations or not any(s['bands'] for s in stations):
        raise ValueError('NICT station data missing')
    return {'stations': stations, 'note': 'F領域のみ。距離別LUF/MUFは観測地点上空の垂直観測から導出した参考値で、指定回線の実測値ではありません。',
            'credit': 'Source: WDC for Ionosphere and Space Weather, Tokyo, NICT'}


def parse_giro(text, expected):
    if 'GIRO' not in text or not re.search(r'URSI-Code\s+' + re.escape(expected) + r'\b', text):
        raise ValueError('GIRO station mismatch or invalid response')
    if not re.search(r'# Time\s+CS\s+foF2\s+QD\s+MUF\(D\)\s+QD', text):
        raise ValueError('GIRO columns changed')
    location = re.search(r'GEO\s*\(\s*([\d.]+)\s*([NS])\s+([\d.]+)\s*([EW])', text)
    rows = []
    for line in text.splitlines():
        if not line or line.startswith('#'):
            continue
        cols = line.split()
        if len(cols) != 6:
            continue
        try:
            observed = datetime.fromisoformat(cols[0].replace('Z', '+00:00')).astimezone(UTC).isoformat()
        except ValueError:
            continue
        if not cols[0].endswith('Z'):
            continue
        score = finite(cols[1], -1, 999)
        rows.append({'observed_at': observed, 'confidence': score,
                     'fof2_mhz': finite(cols[2]), 'fof2_qualifier': cols[3],
                     'muf3000_mhz': finite(cols[4]), 'muf_qualifier': cols[5]})
    if not rows:
        raise ValueError('GIRO has no observations in the requested interval')
    rows.sort(key=lambda row: row['observed_at'])
    result = {'code': expected, 'name': GIRO_STATIONS[expected], 'series': rows,
              'latest': rows[-1], 'observed_at': rows[-1]['observed_at'],
              'credit': 'GIRO / Lowell GIRO Data Center; station ' + expected,
              'license': 'CC BY-NC-SA 4.0; LGDC Rules of the Road', 'terms_url': GIRO_TERMS}
    if location:
        result['lat'] = float(location[1]) * (1 if location[2] == 'N' else -1)
        result['lon'] = float(location[3]) * (1 if location[4] == 'E' else -1)
    return result


def giro_body(code, now=None):
    """GIRO query for the last two hours of one station."""
    now = now or datetime.now(UTC)
    return urlencode([('date_start', (now-timedelta(hours=2)).strftime('%Y-%m-%d %H:%M')),
                      ('date_end', now.strftime('%Y-%m-%d %H:%M')), ('location', code),
                      ('chosenchars[]', '0'), ('chosenchars[]', '8'), ('DMUF', '3000'),
                      ('query_submit', 'Search')]).encode()


class Observations:
    def __init__(self, directory, giro_enabled=False):
        """giro_enabled is a bool or a function asked on every use (the fetcher's setting)."""
        self.directory = Path(directory)
        self.giro_setting = giro_enabled
        self.memory = {}
        self.retry_after = {}
        self.locks = {key: threading.Lock() for key in ['drap', 'nict', *GIRO_STATIONS]}

    @property
    def giro_enabled(self):
        return bool(self.giro_setting() if callable(self.giro_setting) else self.giro_setting)

    def fetch(self, key, url, parser, force=False):
        with self.locks[key]:
            cached = self.memory.get(key)
            if cached is None:
                try:
                    cached = json.loads((self.directory / (key + '.json')).read_text())
                    if not isinstance(cached.get('data'), dict) or finite(cached.get('fetched_at'), 0, 1e12) is None:
                        cached = None
                except (OSError, ValueError, AttributeError):
                    cached = None
            now = time.time()
            error = None
            fresh = cached is not None and 0 <= now - cached['fetched_at'] < 300
            state='cache'
            if not fresh or force:
                fresh=False;state='failed'
                error = '取得再試行待ち／通信またはデータ形式を確認してください'
                if now >= self.retry_after.get(key, 0):
                    try:
                        raw, fetched_at = public_data.download(key, force)
                        if len(raw) > 2_000_000:
                            raise ValueError('response too large')
                        data = parser(raw.decode('utf-8', errors='replace'))
                        cached = {'data': data, 'fetched_at': fetched_at}
                        self.memory[key] = cached
                        fresh = True
                        state='downloaded'
                        error = None
                        try:
                            self.directory.mkdir(parents=True, exist_ok=True)
                            tmp = self.directory / (key + '.tmp')
                            tmp.write_text(json.dumps(cached, allow_nan=False))
                            tmp.replace(self.directory / (key + '.json'))
                        except OSError:
                            pass
                    except public_data.PublicDataError as e:
                        error = str(e)
                        self.retry_after[key] = now + 60
                    except Exception:
                        self.retry_after[key] = now + 60
            result = copy.deepcopy(cached or {'data': None, 'fetched_at': None})
            result.update(source_url=url, stale=not fresh, error=error,fetch_state=state,
                          data_terms=terms_for('noaa' if key=='drap' else 'nict' if key=='nict' else 'giro'))
            if result['data']:
                if key == 'nict':
                    for station in result['data']['stations']:
                        station['stale'] = not fresh or is_old(station['observed_at'])
                    result['stale'] = all(s['stale'] for s in result['data']['stations'])
                else:
                    result['stale'] = not fresh or is_old(result['data'].get('observed_at'))
            return result

    def snapshot(self,force=False):
        with ThreadPoolExecutor(max_workers=2) as pool:
            drap = pool.submit(self.fetch, 'drap', DRAP_URL, parse_drap,force=force)
            nict = pool.submit(self.fetch, 'nict', NICT_URL, parse_nict,force=force)
            return {'drap': drap.result(), 'nict': nict.result(),
                    'giro': {'enabled': self.giro_enabled, 'stations': GIRO_STATIONS, 'terms_url': GIRO_TERMS},
                    'note': '観測・障害情報は現在の状況。SSN取得方法で実効SSNを選んだ計算だけ、foF2観測からSSNを求めて使います。それ以外は月間VOACAP結果の信頼度・SNR・MUFを変更しません。'}

    def giro(self, code,force=False):
        if code not in GIRO_STATIONS:
            raise ValueError('海外観測局が不正です')
        if not self.giro_enabled:
            return {'enabled': False, 'data': None, 'stale': True, 'data_terms': terms_for('giro'),
                    'error': '公開データ取得用コンテナの管理画面でGIROの取得を有効にしてください。', 'terms_url': GIRO_TERMS}
        result = self.fetch(code, GIRO_URL, lambda text: parse_giro(text, code), force=force)
        result['enabled'] = True
        return result
