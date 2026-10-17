"""Authenticated push input stores only the latest WGS84 position per identity."""
from datetime import datetime, timezone
import json
import re
import time
from engine import InputError
from position_contract import identifier, numeric, utc, apply_snapshot

KINDS = ('vessel', 'aircraft', 'vehicle')
PROTOCOLS = ('json', 'geojson', 'nmea0183')


def normalize(data, now):
    if not isinstance(data, dict): raise InputError('JSONオブジェクトが必要です')
    source = identifier(data.get('source'), 'source')
    if data.get('crs') is not None: raise InputError('WGS84以外の座標参照系指定には対応していません')
    if data.get('type') == 'FeatureCollection':
        features = data.get('features')
        if not isinstance(features, list) or not 1 <= len(features) <= 100: raise InputError('featuresは1〜100個です')
        raw = []
        for f in features:
            if not isinstance(f, dict) or f.get('type') != 'Feature' or not isinstance(f.get('properties'), dict): raise InputError('Point Featureが必要です')
            g = f.get('geometry')
            if not isinstance(g, dict) or g.get('type') != 'Point' or g.get('crs') is not None: raise InputError('WGS84 Point geometryのみ受け付けます')
            coords = g.get('coordinates')
            if not isinstance(coords, list) or len(coords) not in (2, 3): raise InputError('coordinatesは[経度,緯度,任意の楕円体高m]です')
            row = dict(f['properties'], lon=coords[0], lat=coords[1])
            if len(coords) == 3: row.update(altitude_m=coords[2], altitude_reference='wgs84_ellipsoid')
            raw.append(row)
    else:
        raw = data.get('positions')
    if not isinstance(raw, list) or not 1 <= len(raw) <= 100: raise InputError('positionsは1〜100個です')
    result = []
    seen = set()
    for row in raw:
        if not isinstance(row, dict): raise InputError('各位置はJSONオブジェクトで指定してください')
        key = identifier(row.get('id'), 'id')
        if key in seen: raise InputError('同じバッチ内でidが重複しています')
        seen.add(key)
        kind = row.get('kind')
        if kind not in KINDS: raise InputError('kindはvessel / aircraft / vehicleです')
        name = row.get('name', key)
        if not isinstance(name, str) or not 1 <= len(name.strip()) <= 80 or not name.isprintable(): raise InputError('nameは表示可能な1〜80文字で指定してください')
        stamp, observed = utc(row.get('observed_at'))
        if stamp > now+60 or stamp < now-86400: raise InputError('観測時刻は過去24時間〜未来60秒の範囲で指定してください')
        p = dict(source=source, id=key, name=name.strip(), kind=kind,
                 lat=numeric(row.get('lat'), 'lat', -90, 90),
                 lon=numeric(row.get('lon'), 'lon', -180, 180), observed_at=observed)
        for field, low, high in [('speed_knots', 0, 3000), ('course_deg', 0, 360), ('altitude_m', -1000, 100000)]:
            value = row.get(field)
            p[field] = numeric(value, field, low, high) if value is not None else None
        if p['course_deg'] is not None and p['course_deg'] >= 360: raise InputError('course_degは360未満で指定してください')
        reference = row.get('altitude_reference', 'unknown')
        if reference not in ('unknown', 'msl', 'wgs84_ellipsoid', 'pressure'): raise InputError('altitude_referenceが不正です')
        p['altitude_reference'] = reference
        result.append((stamp, p))
    return result


def parse_rmc(text):
    line = text.strip('\r\n')
    if not re.fullmatch(r'\$[A-Z]{2}RMC,[\x20-\x7e]+\*[0-9A-Fa-f]{2}', line) or len(line) > 256:
        raise InputError('チェックサム付きのRMCセンテンスを1行指定してください')
    body, checksum = line[1:].rsplit('*', 1)
    actual = 0
    for char in body: actual ^= ord(char)
    if actual != int(checksum, 16): raise InputError('NMEAチェックサムが一致しません')
    f = body.split(',')
    if not 12 <= len(f) <= 14 or f[2] != 'A': raise InputError('有効なRMC位置（status=A）が必要です')
    if len(f) >= 13 and f[12] not in ('', 'A', 'D', 'F', 'R', 'P'):
        raise InputError('RMCの推測・手動・無効・シミュレーション位置は使用しません')
    if len(f) == 14 and f[13] not in ('', 'A', 'D', 'V'): raise InputError('RMC Nav Statusが有効ではありません')
    def coordinate(token, hemisphere, latitude):
        width = 2 if latitude else 3
        if not re.fullmatch(r'\d{'+str(width+2)+r'}(?:\.\d+)?', token): raise InputError('NMEA緯経度の書式が不正です')
        degrees, minutes = int(token[:width]), float(token[width:])
        if minutes >= 60 or hemisphere not in (('N', 'S') if latitude else ('E', 'W')): raise InputError('NMEA緯経度が不正です')
        value = degrees+minutes/60
        if value > (90 if latitude else 180): raise InputError('NMEA緯経度の範囲が不正です')
        return -value if hemisphere in ('S', 'W') else value
    if not re.fullmatch(r'\d{6}(?:\.\d{1,6})?', f[1]) or not re.fullmatch(r'\d{6}', f[9]): raise InputError('RMC日時が不正です')
    try:
        dt = datetime.strptime(f[9]+f[1][:6], '%d%m%y%H%M%S').replace(tzinfo=timezone.utc)
        if '.' in f[1]: dt = dt.replace(microsecond=int(f[1].split('.')[1].ljust(6,'0')))
        speed = float(f[7]) if f[7] else None
        course = float(f[8]) if f[8] else None
    except ValueError: raise InputError('RMCの日時・速度・針路が不正です')
    return dict(lat=coordinate(f[3], f[4], True), lon=coordinate(f[5], f[6], False),
                observed_at=dt.isoformat(), speed_knots=speed, course_deg=course)


class PositionStore:
    def __init__(self, connection, max_age=300):
        self.connection = connection
        self.max_age = int(max_age)
        if not 10 <= self.max_age <= 86400: raise ValueError('HF_POSITION_MAX_AGE_SECONDS must be 10..86400')

    def connect(self):
        c = self.connection()
        c.execute('CREATE TABLE IF NOT EXISTS positions (source TEXT NOT NULL, identifier TEXT NOT NULL, observed REAL NOT NULL, received REAL NOT NULL, payload TEXT NOT NULL, PRIMARY KEY(source,identifier))')
        c.execute('CREATE TABLE IF NOT EXISTS position_stations (source TEXT NOT NULL, identifier TEXT NOT NULL, payload TEXT NOT NULL, PRIMARY KEY(source,identifier))')
        return c

    def configure(self, data):
        if not isinstance(data, dict): raise InputError('局設定のJSONオブジェクトが必要です')
        p = dict(source=identifier(data.get('source'),'source'), id=identifier(data.get('id'),'id'))
        p.update(kind=data.get('kind'), name=data.get('name',p['id']), protocol=data.get('protocol'), enabled=data.get('enabled',True))
        if p['kind'] not in KINDS or p['protocol'] not in PROTOCOLS or not isinstance(p['enabled'],bool): raise InputError('局種別・プロトコル・有効設定が不正です')
        if not isinstance(p['name'],str) or not 1 <= len(p['name'].strip()) <= 80 or not p['name'].isprintable(): raise InputError('局名は表示可能な1〜80文字です')
        p['name'] = p['name'].strip()
        with self.connect() as c:
            c.execute('BEGIN IMMEDIATE')
            old = c.execute('SELECT payload FROM position_stations WHERE source=? AND identifier=?',(p['source'],p['id'])).fetchone()
            c.execute('INSERT OR REPLACE INTO position_stations VALUES (?,?,?)',(p['source'],p['id'],json.dumps(p)))
            if c.execute('SELECT COUNT(*) FROM position_stations').fetchone()[0] > 2000: raise InputError('局設定の上限は2000件です')
            previous = json.loads(old[0]) if old else None
            if not p['enabled'] or previous and (previous['protocol']!=p['protocol'] or previous['kind']!=p['kind']):
                c.execute('DELETE FROM positions WHERE source=? AND identifier=?',(p['source'],p['id']))
        return p

    def ingest_nmea(self, source, key, text, now=None):
        source, key = identifier(source,'source'), identifier(key,'id')
        with self.connect() as c:
            row = c.execute('SELECT payload FROM position_stations WHERE source=? AND identifier=?',(source,key)).fetchone()
        if not row: raise InputError('NMEA局は先に登録してください')
        station = json.loads(row[0])
        p = dict(parse_rmc(text), id=key, name=station['name'],kind=station['kind'])
        return self.ingest(dict(source=source,positions=[p]),now,protocol='nmea0183')

    def ingest(self, data, now=None, protocol=None):
        now = time.time() if now is None else now
        rows = normalize(data, now)  # Entire batch is validated before any write.
        protocol = protocol or ('geojson' if data.get('type')=='FeatureCollection' else 'json')
        accepted = ignored = 0
        with self.connect() as c:
            c.execute('BEGIN IMMEDIATE')
            c.execute('DELETE FROM positions WHERE observed < ?', (now-7*86400,))
            for stamp, p in rows:
                profile = c.execute('SELECT payload FROM position_stations WHERE source=? AND identifier=?',(p['source'],p['id'])).fetchone()
                if profile:
                    station = json.loads(profile[0])
                    if not station['enabled'] or station['protocol']!=protocol or station['kind']!=p['kind']: raise InputError('局の受信形式・種別・有効設定と一致しません: '+p['id'])
                else:
                    station = dict(source=p['source'],id=p['id'],kind=p['kind'],name=p['name'],protocol=protocol,enabled=True)
                    c.execute('INSERT INTO position_stations VALUES (?,?,?)',(p['source'],p['id'],json.dumps(station)))
                p.update(protocol=protocol,name=station['name'])
                old = c.execute('SELECT observed FROM positions WHERE source=? AND identifier=?', (p['source'], p['id'])).fetchone()
                if old and stamp <= old[0]:
                    ignored += 1
                    continue
                c.execute('INSERT OR REPLACE INTO positions VALUES (?,?,?,?,?)', (p['source'], p['id'], stamp, now, json.dumps(p, allow_nan=False)))
                accepted += 1
            if c.execute('SELECT COUNT(*) FROM positions').fetchone()[0] > 2000: raise InputError('移動局の保持上限2000件を超えます')
            if c.execute('SELECT COUNT(*) FROM position_stations').fetchone()[0] > 2000: raise InputError('局設定の上限は2000件です')
        return dict(accepted=accepted, ignored_old_or_equal=ignored)

    def decorate(self, row, now):
        stamp, received, payload = row
        p = json.loads(payload)
        p.update(received_at=datetime.fromtimestamp(received, timezone.utc).isoformat(),
                 age_seconds=round(now-stamp, 1), stale=now-stamp > self.max_age,
                 prediction_compatible=abs(p['lat']) <= 89,
                 expires_at=datetime.fromtimestamp(stamp+self.max_age, timezone.utc).isoformat())
        return p

    def snapshot(self, now=None):
        now = time.time() if now is None else now
        with self.connect() as c:
            c.execute('BEGIN')
            rows = c.execute('SELECT observed,received,payload FROM positions ORDER BY source,identifier').fetchall()
            stations = [json.loads(row[0]) for row in c.execute('SELECT payload FROM position_stations ORDER BY source,identifier')]
        return dict(positions=[self.decorate(row, now) for row in rows], max_age_seconds=self.max_age,
                    stations=stations, protocols=list(PROTOCOLS), server_time=datetime.fromtimestamp(now, timezone.utc).isoformat())

    def apply(self, data, now=None):
        return apply_snapshot(data, self.snapshot(now), now)
