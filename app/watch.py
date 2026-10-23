"""Saved single-link conditions recalculated on a schedule with the latest NOAA smoothed SSN."""
from datetime import datetime, timedelta, timezone
import json
import uuid
from engine import InputError, validate
from space_weather import ENGINE_SSN_SCALE

MAX_WATCHES = 20
NOTE = ('保存した地点間予測の条件を、定期的にNOAAの最新の平滑SSN（0.7倍して使用）で再計算します。'
        '登録時の最初の結果を基準とし、目標REL以上になる時間数が基準より減ったら画面に通知します。'
        '手動SSN・実効SSNで計算した条件もNOAAの平滑SSNで再計算します。移動局の位置は登録時の値で固定します。'
        'RELは月間統計で、当日の電離圏の状態は反映しません。')


def summary(r, target):
    """Hours at the target REL and the best frequency of each hour (highest REL, then SNR)."""
    best = []
    for h in r['hours']:
        top = None
        for v in h['rows']:
            if v.get('reliability') is None: continue
            if top is None or v['reliability'] > top['reliability'] or (v['reliability'] == top['reliability'] and (v.get('snr_db_hz') or -999) > (top.get('snr_db_hz') or -999)):
                top = v
        best.append(dict(hour_utc=h['hour_utc'], frequency_mhz=top and top['frequency_mhz'], reliability=top and top['reliability']))
    return dict(hours_meeting=sum(v['reliability'] is not None and v['reliability'] >= target for v in best), best=best)


def check(engine, parameters, ssn_for, now=None):
    """One recalculation; ssn_for(year, month) returns (ssn, detail) or (None, reason)."""
    checked = (now or datetime.now(timezone.utc)).isoformat()
    ssn, detail = ssn_for(parameters['year'], parameters['month'])
    if ssn is None: return dict(checked=checked, error=detail)
    # Conditions saved before the SSN scale conversion keep the published NOAA value.
    if 'noaa_ssn_scale' not in parameters and detail and 'published' in detail: ssn = detail['published']
    # Conditions saved before the absorption mode existed were calculated with 'W'.
    q = validate(dict({'absorption_mode': 'W'}, **dict(parameters, ssn=ssn)))
    return dict(checked=checked, ssn=q['ssn'], ssn_detail=detail, **summary(engine.run(q), q['reliability']))


def status(w):
    latest, baseline = w.get('latest'), w.get('baseline')
    if not latest: return 'pending'
    if 'error' in latest: return 'error'
    if latest['hours_meeting'] < baseline['hours_meeting']: return 'worse'
    if latest['hours_meeting'] > baseline['hours_meeting']: return 'better'
    return 'same'


def label(result):
    """TX → RX names from the saved circuit, or coordinates when the result has none."""
    p, selection = result['parameters'], result.get('ui_selection')
    try:
        names = [selection['tx']['location']['name'], selection['rxs'][0]['location']['name']]
        if all(isinstance(n, str) and n for n in names): return ' → '.join(n[:40] for n in names)
    except (KeyError, IndexError, TypeError): pass
    return f"{p['tx_lat']:.2f}, {p['tx_lon']:.2f} → {p['rx_lat']:.2f}, {p['rx_lon']:.2f}"


class WatchStore:
    def __init__(self, connection):
        self.connection = connection
        with connection() as c:
            c.execute('CREATE TABLE IF NOT EXISTS watches (id TEXT PRIMARY KEY, created TEXT NOT NULL, state TEXT NOT NULL)')

    def list(self):
        with self.connection() as c:
            rows = c.execute('SELECT state FROM watches ORDER BY created').fetchall()
        out = []
        for (state,) in rows:
            w = json.loads(state)
            w['status'] = status(w)
            w['notify'] = w['status'] == 'worse' and w.get('acknowledged') != w['latest']['checked']
            out.append(w)
        return out

    def get(self, identifier):
        with self.connection() as c:
            row = c.execute('SELECT state FROM watches WHERE id=?', (identifier,)).fetchone()
        if not row: raise InputError('指定された監視条件がありません')
        return json.loads(row[0])

    def put(self, w):
        with self.connection() as c:
            c.execute('UPDATE watches SET state=? WHERE id=?', (json.dumps(w, allow_nan=False), w['id']))
        return w

    def add(self, result):
        # Only single-link forecasts: other kinds store no per-hour rows of one path.
        if 'hours' not in result or result.get('kind') not in (None, 'point'):
            raise InputError('定時の再計算に登録できるのは地点間予測（単一RX）の結果だけです')
        with self.connection() as c:
            if c.execute('SELECT COUNT(*) FROM watches').fetchone()[0] >= MAX_WATCHES:
                raise InputError(f'定時の再計算に登録できるのは{MAX_WATCHES}件までです')
        parameters = {k: v for k, v in result['parameters'].items() if k not in ('tx_position', 'rx_position', 'ssn_source')}
        parameters['noaa_ssn_scale'] = ENGINE_SSN_SCALE
        w = dict(id=uuid.uuid4().hex, created=datetime.now(timezone.utc).isoformat(), result_id=result['id'],
                 label=label(result), parameters=parameters, baseline=None, latest=None, acknowledged=None)
        with self.connection() as c:
            c.execute('INSERT INTO watches VALUES (?,?,?)', (w['id'], w['created'], json.dumps(w, allow_nan=False)))
        return w

    def delete(self, identifier):
        with self.connection() as c: c.execute('DELETE FROM watches WHERE id=?', (identifier,))

    def acknowledge(self, identifier):
        w = self.get(identifier)
        w['acknowledged'] = w['latest'] and w['latest']['checked']
        return self.put(w)

    def record(self, identifier, result):
        w = self.get(identifier)
        # The first successful check is the baseline later checks are compared with.
        if w['baseline'] is None and 'error' not in result: w['baseline'] = result
        if 'error' not in result: w.pop('last_error', None)
        if w['baseline'] is not None: w['latest'] = result
        else: w['latest'] = None; w['last_error'] = result
        return self.put(w)

    def due(self, interval_hours, now=None):
        now = now or datetime.now(timezone.utc)
        out = []
        for w in self.list():
            last = (w.get('latest') or w.get('last_error') or {}).get('checked')
            if last is None or datetime.fromisoformat(last) <= now - timedelta(hours=interval_hours): out.append(w['id'])
        return out
