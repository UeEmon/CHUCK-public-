"""Position gateway test jig: simulated moving stations on every input path.

Simulates vessels, aircraft and vehicles that move by dead reckoning and report
to the position gateway over each supported input:

  http-json     POST /api/positions (common JSON)
  http-geojson  POST /api/positions (GeoJSON FeatureCollection)
  http-nmea     POST /api/positions/nmea (one RMC sentence)
  tcp           NMEA 0183 stream over TCP with a stream key line
  udp           NMEA 0183 datagrams over UDP with a stream key line

Commands:
  check   Register the simulated stations, send one report on every path, read
          the gateway snapshot back and print PASS/FAIL per item (exit 1 on a
          failure). Also checks that bad input is refused.
  run     Keep the stations moving and reporting every --interval seconds.
  setup   Register the stations and issue their stream keys only.
  serve   Open a control panel in the browser (http://127.0.0.1:8090/) to
          start/stop stations, steer them, inject faults and run the check.

Environment: HF_POSITION_INGEST_TOKEN (sending) and HF_POSITION_GATEWAY_TOKEN
(station setup, issuing stream keys and reading positions back).
Only the Python standard library is used.
"""
import argparse
from datetime import datetime, timezone
import json
import math
import os
import socket
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode, urlparse
from urllib.request import HTTPRedirectHandler, Request, build_opener

TRANSPORTS = ('http-json', 'http-geojson', 'http-nmea', 'tcp', 'udp')
NMEA_TRANSPORTS = ('http-nmea', 'tcp', 'udp')

# One station per input path around Tokyo Bay. Edit or pass --scenario FILE
# (a JSON list of objects with the same keys) to simulate other traffic.
DEFAULT_SCENARIO = [
    dict(id='ship-json', name='模擬船舶 JSON', kind='vessel', transport='http-json', lat=35.00, lon=139.80, speed_knots=12, course_deg=45),
    dict(id='plane-geojson', name='模擬航空機 GeoJSON', kind='aircraft', transport='http-geojson', lat=35.50, lon=139.70, speed_knots=450, course_deg=270, altitude_m=10000),
    dict(id='car-nmea', name='模擬車両 NMEA', kind='vehicle', transport='http-nmea', lat=35.68, lon=139.76, speed_knots=30, course_deg=90),
    dict(id='ship-tcp', name='模擬船舶 TCP', kind='vessel', transport='tcp', lat=34.90, lon=139.90, speed_knots=15, course_deg=180),
    dict(id='car-udp', name='模擬車両 UDP', kind='vehicle', transport='udp', lat=35.40, lon=139.60, speed_knots=40, course_deg=0),
]


class JigError(Exception):
    pass


class _NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs): return None  # Never forward a token.


ID_CHARS = set('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.:-')


def parse_iso(value):
    return datetime.fromisoformat(value.replace('Z', '+00:00')).timestamp()


def iso(stamp):
    return datetime.fromtimestamp(stamp, timezone.utc).isoformat()


def checksum(body):
    value = 0
    for char in body: value ^= ord(char)
    return format(value, '02X')


def sentence(body):
    return '$' + body + '*' + checksum(body) + '\r\n'


def nmea_coordinate(value, latitude):
    hemisphere = ('N' if value >= 0 else 'S') if latitude else ('E' if value >= 0 else 'W')
    value = abs(value)
    degrees = int(value)
    minutes = (value - degrees) * 60
    if round(minutes, 4) >= 60: degrees, minutes = degrees + 1, 0.0
    return f'{degrees:0{2 if latitude else 3}d}{minutes:07.4f}', hemisphere


def rmc(station, stamp, status='A', corrupt=False):
    dt = datetime.fromtimestamp(stamp, timezone.utc)
    lat, ns = nmea_coordinate(station['lat'], True)
    lon, ew = nmea_coordinate(station['lon'], False)
    body = (f"GNRMC,{dt:%H%M%S}.{dt.microsecond // 10000:02d},{status},{lat},{ns},{lon},{ew},"
            f"{station['speed_knots']:.1f},{station['course_deg']:.1f},{dt:%d%m%y},,,A")
    if not corrupt: return sentence(body)
    return '$' + body + '*' + format(int(checksum(body), 16) ^ 1, '02X') + '\r\n'


def gga(station, stamp):
    dt = datetime.fromtimestamp(stamp, timezone.utc)
    lat, ns = nmea_coordinate(station['lat'], True)
    lon, ew = nmea_coordinate(station['lon'], False)
    return sentence(f'GNGGA,{dt:%H%M%S},{lat},{ns},{lon},{ew},1,10,0.8,{station.get("altitude_m") or 0:.1f},M,39.0,M,,')


def advance(station, seconds):
    """Dead reckoning on a sphere, good enough for a few hours of simulation."""
    distance = station['speed_knots'] * seconds / 3600 / 60  # Degrees of arc (1 nm = 1').
    course = math.radians(station['course_deg'])
    lat = station['lat'] + distance * math.cos(course)
    lon = station['lon'] + distance * math.sin(course) / max(math.cos(math.radians(station['lat'])), 0.01)
    if abs(lat) > 85:  # Turn back before the poles instead of crossing them.
        lat = math.copysign(170 - abs(lat), lat)
        station['course_deg'] = (180 - station['course_deg']) % 360
    station['lat'] = round(lat, 7)
    station['lon'] = round((lon + 180) % 360 - 180, 7)


class Gateway:
    def __init__(self, url, ingest_token, gateway_token, nmea_host, nmea_port, source='sim', timeout=10, udp_port=None):
        target = urlparse(url)
        if target.scheme not in ('http', 'https') or not target.hostname or target.username or target.password:
            raise JigError('--url はユーザー情報を含まないHTTP(S)のURLで指定してください')
        if target.scheme == 'http' and target.hostname not in ('127.0.0.1', 'localhost', '::1'):
            raise JigError('遠隔のゲートウェイにはHTTPSを使ってください（HTTPはループバックだけ）')
        self.base = url.rstrip('/')
        self.ingest_token, self.gateway_token = ingest_token, gateway_token
        self.nmea_host, self.nmea_port = nmea_host or target.hostname, nmea_port
        self.udp_port = udp_port or nmea_port
        self.source, self.timeout = source, timeout
        self.opener = build_opener(_NoRedirect)
        self.connections = {}

    def request(self, path, token, body=None, content_type='application/json', query=None):
        if len(token or '') < 32: raise JigError('トークンが設定されていません（32文字以上）')
        url = self.base + path + ('?' + urlencode(query) if query else '')
        data = body.encode() if isinstance(body, str) else body
        request = Request(url, data=data, headers={'Authorization': 'Bearer ' + token, **({'Content-Type': content_type} if data is not None else {})})
        try:
            with self.opener.open(request, timeout=self.timeout) as response:
                return response.status, json.load(response)
        except HTTPError as error:
            try: detail = json.load(error)
            except ValueError: detail = {}
            return error.code, detail
        except (URLError, OSError) as error:
            raise JigError(f'ゲートウェイに接続できません: {url} ({error})')

    # Station setup and read-back use the main-app service token.
    def configure(self, station, issue_key):
        protocol = {'http-json': 'json', 'http-geojson': 'geojson'}.get(station['transport'], 'nmea0183')
        body = dict(source=self.source, id=station['id'], name=station['name'], kind=station['kind'], protocol=protocol, enabled=True)
        if issue_key: body['stream_key'] = 'generate'
        status, result = self.request('/internal/v1/stations', self.gateway_token, json.dumps(body))
        if status != 200: raise JigError(f"局設定に失敗しました {station['id']}: {status} {result.get('error', '')}")
        return result

    def snapshot(self):
        status, result = self.request('/internal/v1/positions', self.gateway_token)
        if status != 200: raise JigError(f"位置一覧を取得できません: {status} {result.get('error', '')}")
        return {p['id']: p for p in result['positions'] if p['source'] == self.source}

    # Reports use the external ingestion token or the station's stream key.
    def send(self, station, stamp, key_override=None, extra_lines=()):
        transport = station['transport']
        if transport in ('http-json', 'http-geojson'):
            record = dict(id=station['id'], name=station['name'], kind=station['kind'], observed_at=iso(stamp),
                          speed_knots=station['speed_knots'], course_deg=station['course_deg'])
            if station.get('altitude_m') is not None:
                record.update(altitude_m=station['altitude_m'], altitude_reference='msl')
            if transport == 'http-json':
                payload = dict(source=self.source, positions=[dict(record, lat=station['lat'], lon=station['lon'])])
                content_type = 'application/json'
            else:
                if 'altitude_m' in record: del record['altitude_reference']  # Third coordinate is ellipsoidal height.
                altitude = record.pop('altitude_m', None)
                coordinates = [station['lon'], station['lat']] + ([altitude] if altitude is not None else [])
                payload = dict(type='FeatureCollection', source=self.source, features=[
                    dict(type='Feature', geometry=dict(type='Point', coordinates=coordinates), properties=record)])
                content_type = 'application/geo+json'
            return self.request('/api/positions', self.ingest_token, json.dumps(payload, ensure_ascii=False), content_type)
        if transport == 'http-nmea':
            return self.request('/api/positions/nmea', self.ingest_token, extra_lines[0] if extra_lines else rmc(station, stamp),
                                'text/plain', dict(source=self.source, id=station['id']))
        key = key_override if key_override is not None else station.get('stream_key')
        lines = list(extra_lines) or [gga(station, stamp), rmc(station, stamp)]
        if transport == 'udp':
            payload = ((key + '\r\n') if key else '') + ''.join(lines)
            family = socket.AF_INET6 if ':' in self.nmea_host else socket.AF_INET
            with socket.socket(family, socket.SOCK_DGRAM) as sock:
                sock.sendto(payload.encode('ascii'), (self.nmea_host, self.udp_port))
            return None, {}
        for attempt in (1, 2):  # TCP keeps one open connection per station.
            sock = self.connections.get(station['id'])
            try:
                if sock is None:
                    sock = socket.create_connection((self.nmea_host, self.nmea_port), timeout=self.timeout)
                    if key: sock.sendall((key + '\r\n').encode('ascii'))
                    self.connections[station['id']] = sock
                sock.sendall(''.join(lines).encode('ascii'))
                return None, {}
            except OSError as error:
                self.close(station['id'])
                if attempt == 2: raise JigError(f"TCPで送信できません {self.nmea_host}:{self.nmea_port} ({error})")

    def close(self, station_id=None):
        for key in ([station_id] if station_id else list(self.connections)):
            sock = self.connections.pop(key, None)
            if sock:
                try: sock.close()
                except OSError: pass


def load_scenario(path):
    return load_scenario_list(json.loads(path.read_text()) if path else [dict(s) for s in DEFAULT_SCENARIO])


def load_scenario_list(stations):
    if not isinstance(stations, list) or not stations: raise JigError('シナリオは局のJSON配列で指定してください')
    seen = set()
    for s in stations:
        for field in ('id', 'kind', 'transport', 'lat', 'lon'):
            if field not in s: raise JigError(f'シナリオの局に{field}がありません')
        if s['transport'] not in TRANSPORTS: raise JigError(f"未対応のtransportです: {s['transport']}")
        if not isinstance(s['id'], str) or not s['id'] or len(s['id']) > 64 or any(c not in ID_CHARS for c in s['id']):
            raise JigError('局IDは半角英数字と _ . : - の1〜64文字です')
        if s['kind'] not in ('vessel', 'aircraft', 'vehicle'): raise JigError(f"未対応のkindです: {s['kind']}")
        for field, low, high in (('lat', -85, 85), ('lon', -180, 180), ('speed_knots', 0, 3000), ('course_deg', 0, 360)):
            value = s.get(field, 0)
            if isinstance(value, bool) or not isinstance(value, (int, float)) or not low <= value <= high:
                raise JigError(f"{s['id']}の{field}は{low}〜{high}の数値です")
        if s['id'] in seen: raise JigError(f"シナリオの局IDが重複しています: {s['id']}")
        seen.add(s['id'])
        s.setdefault('name', s['id']); s.setdefault('speed_knots', 0); s.setdefault('course_deg', 0)
    return stations


def setup(gateway, stations, log):
    for station in stations:
        stream = station['transport'] in ('tcp', 'udp')
        result = gateway.configure(station, issue_key=stream)
        if stream: station['stream_key'] = result['stream_key']
        log(f"登録 {gateway.source}/{station['id']} ({station['transport']})" + (' 受信キーを発行' if stream else ''))


def wait_for(gateway, predicate, seconds=5):
    deadline = time.time() + seconds
    while True:
        snapshot = gateway.snapshot()
        if predicate(snapshot) or time.time() >= deadline: return snapshot
        time.sleep(0.2)


def same_place(position, station):
    return position and abs(position['lat'] - station['lat']) < 1e-4 and abs(position['lon'] - station['lon']) < 1e-4


def check(gateway, stations, log):
    """Positive report on every path, then refusals. Returns the list of (name, ok, detail)."""
    results = []
    def record(name, ok, detail=''):
        results.append((name, ok, detail))
        log(('PASS ' if ok else 'FAIL ') + name + (f' ({detail})' if detail else ''))

    setup(gateway, stations, log)
    stamp = time.time()
    for station in stations:
        status, body = gateway.send(station, stamp)
        if status is not None and (status != 200 or body.get('accepted') != 1):
            record(f"{station['transport']} {station['id']} 送信", False, f"HTTP {status} {body.get('error', body)}")
    gateway.close()
    snapshot = wait_for(gateway, lambda snap: all(same_place(snap.get(s['id']), s) for s in stations))
    for station in stations:
        position = snapshot.get(station['id'])
        ok = same_place(position, station) and position['kind'] == station['kind'] and not position['stale']
        detail = '' if ok else ('位置が届いていません' if not position else f"lat {position['lat']} lon {position['lon']}")
        if ok and station.get('altitude_m') is not None and station['transport'] == 'http-json':
            ok = position['altitude_m'] == station['altitude_m']; detail = '' if ok else '高度が一致しません'
        record(f"{station['transport']} {station['id']} が位置一覧に反映", ok, detail)

    by_transport = {s['transport']: s for s in stations}
    later = stamp + 2
    if 'http-json' in by_transport:
        s = by_transport['http-json']
        status, body = gateway.send(s, stamp)  # Same observation time again.
        record('同じ観測時刻の再送は無視される', status == 200 and body.get('ignored_old_or_equal') == 1, f'HTTP {status} {body}')
    if 'http-nmea' in by_transport:
        s = by_transport['http-nmea']
        status, body = gateway.send(s, later, extra_lines=[rmc(s, later, corrupt=True)])
        record('チェックサム誤りのNMEAは拒否される', status == 400, f'HTTP {status}')
        status, body = gateway.send(s, later, extra_lines=[rmc(s, later, status='V')])
        record('測位無効（status=V）のRMCは拒否される', status == 400, f'HTTP {status}')
    status, body = gateway.request('/api/positions', 'x' * 40, json.dumps(dict(source=gateway.source, positions=[])))
    record('誤った受信トークンは拒否される', status == 401, f'HTTP {status}')
    if 'udp' in by_transport:
        # One failed attempt only: ten failures within ten minutes block the sender IP.
        s = dict(by_transport['udp'], lat=by_transport['udp']['lat'] + 0.5)
        gateway.send(s, later, key_override='wrong-key-' + 'x' * 22)
        time.sleep(1)
        position = gateway.snapshot().get(s['id'])
        record('誤った受信キーのUDPは保存されない', bool(position) and not same_place(position, s))
    if 'tcp' in by_transport:
        s = by_transport['tcp']
        advance(s, 60)
        gateway.send(s, later)
        gateway.close()
        position = wait_for(gateway, lambda snap: same_place(snap.get(s['id']), s)).get(s['id'])
        record('TCPでGGAを混ぜても次のRMCを保存する', same_place(position, s))
    return results


def run(gateway, stations, interval, duration, log):
    started = time.time()
    tick = 0
    try:
        while not duration or time.time() - started < duration:
            stamp = time.time()
            for station in stations:
                try:
                    status, body = gateway.send(station, stamp)
                    outcome = 'TCP/UDP送信' if status is None else f"HTTP {status} {body.get('error') or body}"
                except JigError as error:
                    outcome = str(error)
                log(f"{iso(stamp)[11:19]} {station['transport']:<12} {station['id']:<14} {station['lat']:9.5f} {station['lon']:10.5f} {outcome}")
                advance(station, interval)
            tick += 1
            time.sleep(max(0, started + tick * interval - time.time()))
    except KeyboardInterrupt:
        pass
    finally:
        gateway.close()


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('command', choices=('check', 'run', 'setup', 'serve'))
    parser.add_argument('--url', default='http://127.0.0.1:18083', help='ゲートウェイのURL（既定 http://127.0.0.1:18083）')
    parser.add_argument('--nmea-host', help='TCP・UDPの送信先ホスト（既定は--urlのホスト）')
    parser.add_argument('--nmea-port', type=int, default=10110, help='TCP・UDPの送信先ポート（既定10110）')
    parser.add_argument('--udp-port', type=int, help='UDPだけ別のポートへ送る場合に指定（既定は--nmea-port）')
    parser.add_argument('--source', default='sim', help='模擬局の送信元名（既定sim）')
    parser.add_argument('--scenario', type=lambda p: __import__('pathlib').Path(p), help='局一覧のJSONファイル')
    parser.add_argument('--only', action='append', choices=TRANSPORTS, help='この入力方式の局だけを使う（複数指定可）')
    parser.add_argument('--interval', type=float, default=5, help='runの送信間隔秒（既定5）')
    parser.add_argument('--duration', type=float, default=0, help='runの実行秒数（0は停止するまで）')
    parser.add_argument('--no-setup', action='store_true', help='runで局登録と受信キー発行を省く（--keysで受信キーを渡す）')
    parser.add_argument('--port', type=int, default=8090, help='serveの管制画面のポート（既定8090、127.0.0.1だけで待ち受け）')
    parser.add_argument('--keys', type=lambda p: __import__('pathlib').Path(p), help='setupで受信キーを書き出す/runで読み込むJSONファイル')
    args = parser.parse_args(argv)
    log = lambda text: print(text, flush=True)
    try:
        stations = load_scenario(args.scenario)
        if args.only: stations = [s for s in stations if s['transport'] in args.only]
        if not stations: raise JigError('対象の局がありません')
        gateway = Gateway(args.url, os.environ.get('HF_POSITION_INGEST_TOKEN', ''), os.environ.get('HF_POSITION_GATEWAY_TOKEN', ''),
                          args.nmea_host, args.nmea_port, args.source, udp_port=args.udp_port)
        if args.command == 'check':
            results = check(gateway, stations, log)
            failed = [r for r in results if not r[1]]
            log(f'結果: {len(results) - len(failed)}/{len(results)} 合格')
            return 1 if failed else 0
        if args.command == 'serve':
            import simulator_console
            simulator_console.serve(gateway, stations, args.interval, args.port, log)
            return 0
        if args.command == 'setup' or not args.no_setup:
            setup(gateway, stations, log)
            if args.keys:
                keys = {s['id']: s['stream_key'] for s in stations if s.get('stream_key')}
                fd = os.open(args.keys, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
                with os.fdopen(fd, 'w') as handle: json.dump(keys, handle, indent=1)
                log(f'受信キーを書き出しました: {args.keys}')
        elif args.keys:
            keys = json.loads(args.keys.read_text())
            for s in stations: s['stream_key'] = keys.get(s['id'], s.get('stream_key'))
        if args.command == 'run':
            run(gateway, stations, args.interval, args.duration, log)
        return 0
    except JigError as error:
        print('エラー: ' + str(error), file=sys.stderr)
        return 2


if __name__ == '__main__':
    sys.exit(main())
