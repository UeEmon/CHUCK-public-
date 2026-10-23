"""Effective SSN: the SSN at which VOACAP's own foF2 matches current ionosonde foF2.

VOACAP's CCIR foF2 is linear in SSN, so two engine runs per station bracket the
observed value and give the SSN directly. The combined value is a median of
independent stations and replaces the monthly smoothed SSN for one calculation.
"""
from concurrent.futures import ThreadPoolExecutor
import copy
from datetime import datetime, timezone
import re
import statistics

from engine import EngineError, InputError, cards, validate
from observations import GIRO_STATIONS

UTC = timezone.utc
SSN_LOW, SSN_MID, SSN_HIGH = 0.0, 125.0, 250.0
MIN_STATIONS = 2
# GIRO autoscaling confidence 0-100; 999 marks manually scaled values.
GIRO_MIN_CONFIDENCE = 50
# Printed foF2 has 0.1 MHz resolution; a larger mid-point miss means non-linear coefficients.
LINEARITY_TOLERANCE_MHZ = 0.15
# Autoscaling errors give values far outside any solar cycle; those stations are rejected.
RAW_RANGE = (-50.0, 400.0)
NOTE = ('観測地点上空のfoF2に、VOACAP（CCIR係数）の同じ地点・月・時刻のfoF2が一致するSSNを局ごとに求め、'
        '中央値を計算に使います。観測時点の電離圏を月間予測へ当てはめる近似で、磁気嵐中の急変や'
        '観測局から遠い経路の差は補正しません。対象年月が現在の月のときだけ使えます。')


class EffectiveSSNError(RuntimeError):
    pass


def observation_hours(observed_at):
    """VOACAP hours (1-24) bracketing the observation and the weight of the later one."""
    t = datetime.fromisoformat(observed_at).astimezone(UTC)
    u = t.hour + t.minute / 60 + t.second / 3600
    first = int(u)
    return (first or 24, first + 1), u - first


def station_cards(station, year, month, hours, ssn, antennas=True):
    lat = station['lat']
    # A 0.1° circuit puts the single control point over the station.
    other = lat + 0.1 if lat < 88 else lat - 0.1
    p = validate({'tx_lat': lat, 'tx_lon': station['lon'], 'rx_lat': other, 'rx_lon': station['lon'],
                  'year': year, 'month': month, 'ssn': ssn, 'frequencies': [5]})
    deck = cards(p).replace('METHOD       30', 'METHOD        1')
    deck = re.sub(r'^TIME .*$', f'TIME     {hours[0]:5d}{hours[1]:5d}{1:5d}{1:5d}', deck, count=1, flags=re.M)
    # VOACAP rejects ANTENNA cards after the first EXECUTE; the first ones stay in effect.
    return ''.join(line for line in deck.replace('QUIT\n', '').splitlines(True)
                   if antennas or not line.startswith('ANTENNA'))


def parse_ionosphere(raw):
    """Method 1 output: one block per EXECUTE, each a list of (UT hour, F2Z)."""
    blocks = []
    current = None
    for line in raw.splitlines():
        if re.search(r'\bSSN\s*=', line):
            current = []
            blocks.append(current)
        elif current is not None:
            cols = line.split()
            if len(cols) >= 10 and re.fullmatch(r'\d+\.\d[NS]', cols[0]):
                try:
                    current.append((round(float(cols[3])) % 24, float(cols[9])))
                except ValueError:
                    pass
    return blocks


def model_fof2(engine, stations, year, month):
    """Run one deck with three SSN blocks per station; return {code: {ssn: {hour: foF2}}}."""
    deck = ''
    order = []
    for station in stations:
        for ssn in (SSN_LOW, SSN_MID, SSN_HIGH):
            deck += station_cards(station, year, month, station['hours'], ssn, not order)
            order.append((station['code'], ssn))
    raw = engine.execute(lambda root: deck + 'QUIT\n')
    blocks = parse_ionosphere(raw)
    if len(blocks) != len(order) or any(len(b) != 2 for b in blocks):
        raise EngineError('VOACAPの電離層出力を解釈できません')
    result = {}
    for (code, ssn), rows in zip(order, blocks):
        result.setdefault(code, {})[ssn] = dict(rows)
    return result


def candidates(snapshot, giro):
    """Fresh foF2 observations with coordinates, one per station."""
    found = []
    nict = snapshot.get('nict') or {}
    for s in ((nict.get('data') or {}).get('stations') or []):
        if s.get('stale') or s.get('fof2_mhz') is None or not s.get('observed_at'):
            continue
        found.append({'code': s['code'], 'name': s['name'], 'provider': 'NICT', 'lat': s['lat'], 'lon': s['lon'],
                      'observed_at': s['observed_at'], 'fof2_mhz': s['fof2_mhz'],
                      'credit': (nict.get('data') or {}).get('credit')})
    for item in giro:
        data = item.get('data') or {}
        if item.get('stale') or 'lat' not in data:
            continue
        rows = [r for r in data.get('series', []) if r.get('fof2_mhz') is not None
                and r.get('confidence') is not None and (r['confidence'] == 999 or r['confidence'] >= GIRO_MIN_CONFIDENCE)]
        if rows:
            r = rows[-1]
            found.append({'code': data['code'], 'name': data['name'], 'provider': 'GIRO', 'lat': data['lat'],
                          'lon': data['lon'], 'observed_at': r['observed_at'], 'fof2_mhz': r['fof2_mhz'],
                          'confidence': r['confidence'], 'credit': data.get('credit')})
    return found


def estimate(engine, stations, year, month):
    for s in stations:
        s['hours'], s['weight'] = observation_hours(s['observed_at'])
    model = model_fof2(engine, stations, year, month) if stations else {}
    used = []
    for s in stations:
        w = s.pop('weight')
        hours = [h % 24 for h in s.pop('hours')]
        f = {ssn: model[s['code']][ssn][hours[0]] * (1 - w) + model[s['code']][ssn][hours[1]] * w
             for ssn in (SSN_LOW, SSN_MID, SSN_HIGH)}
        slope = (f[SSN_HIGH] - f[SSN_LOW]) / (SSN_HIGH - SSN_LOW)
        s['model_fof2_mhz'] = {'ssn_0': round(f[SSN_LOW], 2), 'ssn_250': round(f[SSN_HIGH], 2)}
        if abs(f[SSN_MID] - (f[SSN_LOW] + f[SSN_HIGH]) / 2) > LINEARITY_TOLERANCE_MHZ or slope <= 0.002:
            s.update(effective_ssn=None, used=False, reason='この地点・時刻ではfoF2がSSNに比例しないため除外')
            continue
        raw = (s['fof2_mhz'] - f[SSN_LOW]) / slope
        s['effective_ssn'] = round(raw, 1)
        if not RAW_RANGE[0] <= raw <= RAW_RANGE[1]:
            s.update(used=False, reason='太陽活動の範囲外の値（自動読取の誤りの可能性）のため除外')
            continue
        s.update(used=True, reason=None)
        used.append(raw)
    value = round(min(SSN_HIGH, max(SSN_LOW, statistics.median(used))), 1) if len(used) >= MIN_STATIONS else None
    return value, used


class EffectiveSSN:
    def __init__(self, engine, observations):
        self.engine = engine
        self.observations = observations
        # Observations change at most every few minutes; reuse the engine result until they do.
        self.last = (None, None)

    def snapshot(self, year, month, force=False):
        now = datetime.now(UTC)
        result = {'method': 'voacap-fof2-inversion', 'target_month': f'{year:04d}-{month:02d}',
                  'computed_at': now.isoformat(), 'min_stations': MIN_STATIONS, 'value': None,
                  'stations': [], 'used_count': 0, 'spread': None, 'error': None, 'note': NOTE,
                  'giro_enabled': self.observations.giro_enabled}
        if (year, month) != (now.year, now.month):
            result['error'] = '実効SSNは現在の月（UTC）の計算にだけ使えます。対象年月を今月にするか、別のSSN取得方法を選んでください。'
            return result
        with ThreadPoolExecutor(max_workers=1 + len(GIRO_STATIONS)) as pool:
            snapshot = pool.submit(self.observations.snapshot, force)
            giro = [pool.submit(self.observations.giro, code, force) for code in GIRO_STATIONS] if self.observations.giro_enabled else []
            stations = candidates(snapshot.result(), [g.result() for g in giro])
        key = (year, month, tuple((s['code'], s['observed_at'], s['fof2_mhz']) for s in stations))
        if self.last[0] == key:
            value, used, stations = copy.deepcopy(self.last[1])
        else:
            value, used = estimate(self.engine, stations, year, month)
            self.last = (key, copy.deepcopy((value, used, stations)))
        result.update(value=value, stations=stations, used_count=len(used),
                      spread={'min': round(min(used), 1), 'max': round(max(used), 1)} if used else None)
        if value is None:
            result['error'] = (f'新しいfoF2観測が{MIN_STATIONS}局以上そろいません（使用可能 {len(used)}局）。'
                               '観測データを更新するか、別のSSN取得方法を選んでください。')
        return result

    def calculation_input(self, data):
        year, month = int(data['year']), int(data['month'])
        now = datetime.now(UTC)
        snapshot = self.snapshot(year, month)
        if snapshot['value'] is None:
            raise (InputError if (year, month) != (now.year, now.month) else EffectiveSSNError)(snapshot['error'])
        return dict(data, ssn=snapshot['value']), snapshot
