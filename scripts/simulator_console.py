"""Browser control panel for the position gateway test jig.

Started by `gateway_simulator.py serve`. It listens on 127.0.0.1 only, keeps
the tokens and stream keys on the server side, and accepts control requests
only with the per-run token embedded in the page it serves.
"""
from collections import deque
import copy
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import secrets
import threading
import time
from urllib.parse import urlparse

import gateway_simulator as jig

STATIC = Path(__file__).resolve().parent / 'simulator_static'
LAND = Path(__file__).resolve().parents[1] / 'app' / 'static' / 'land.geojson'
KINDS = ('vessel', 'aircraft', 'vehicle')
FAULTS = {
    'checksum': ('チェックサム誤りのRMC', ('http-nmea', 'tcp', 'udp')),
    'void': ('測位無効（status=V）のRMC', ('http-nmea', 'tcp', 'udp')),
    'old': ('2日前の観測時刻', jig.TRANSPORTS),
    'out_of_range': ('緯度95°（範囲外）', ('http-json', 'http-geojson')),
    'wrong_key': ('誤った受信キー', ('tcp', 'udp')),
}
TRACK_POINTS = 240


class Console:
    """Simulation state shared by the browser requests and the sending thread."""

    def __init__(self, gateway, stations, interval=5, clock=time.time):
        self.gateway, self.interval, self.clock = gateway, float(interval), clock
        self.lock = threading.RLock()
        self.stations = {}
        for station in stations: self._add(station, active=True)
        self.running = False
        self.log = deque(maxlen=400)
        self.check_results = None
        self.busy = None
        self.received = {}
        self.received_error = None
        self.received_at = 0
        self.stop_event = threading.Event()
        self.thread = threading.Thread(target=self._loop, name='simulator', daemon=True)

    def start_thread(self):
        self.thread.start()

    def close(self):
        self.stop_event.set()
        with self.lock: self.gateway.close()

    def _add(self, station, active=False):
        station = dict(station)
        station.setdefault('name', station['id'])
        station.setdefault('speed_knots', 0); station.setdefault('course_deg', 0)
        station.update(active=active, track=[(station['lat'], station['lon'])], last='', sent=0)
        self.stations[station['id']] = station

    def note(self, text):
        with self.lock: self.log.appendleft(f"{jig.iso(self.clock())[11:19]} {text}")

    # Sending ---------------------------------------------------------------
    def _send(self, station, stamp, **kwargs):
        try:
            status, body = self.gateway.send(station, stamp, **kwargs)
            if status is None: return 'TCP/UDP送信済み'
            if status == 200: return f"受理 {body.get('accepted', 0)}・無視 {body.get('ignored_old_or_equal', 0)}"
            return f"HTTP {status} {body.get('error', '')}".strip()
        except jig.JigError as error:
            return str(error)

    def tick(self):
        """Send one report for every active station and move it forward."""
        with self.lock:
            stamp = self.clock()
            for station in self.stations.values():
                if not station['active']: continue
                if station['transport'] in ('tcp', 'udp') and not station.get('stream_key'):
                    # Sending without a key would only count failures and get this IP blocked.
                    station['last'] = '受信キーなし（「局を登録」を押してください）'
                    continue
                station['last'] = self._send(station, stamp)
                station['sent'] += 1
                jig.advance(station, self.interval)
                station['track'].append((station['lat'], station['lon']))
                del station['track'][:-TRACK_POINTS]

    def _loop(self):
        next_tick = time.monotonic()
        while not self.stop_event.is_set():
            if self.running:
                self.tick()
                next_tick += self.interval
                self.stop_event.wait(max(0.05, next_tick - time.monotonic()))
            else:
                next_tick = time.monotonic()
                self.stop_event.wait(0.2)

    def refresh_received(self):
        """Read the gateway's own view, at most once a second, to compare with what was sent."""
        if self.clock() - self.received_at < 1: return
        self.received_at = self.clock()
        try:
            snapshot = self.gateway.snapshot()
            with self.lock: self.received, self.received_error = snapshot, None
        except jig.JigError as error:
            with self.lock: self.received_error = str(error)

    # Actions from the browser ------------------------------------------------
    def action(self, data):
        name = data.get('action')
        handler = getattr(self, 'do_' + str(name), None)
        if not handler or not isinstance(name, str): raise jig.JigError('不明な操作です')
        return handler(data)

    def station(self, data):
        station = self.stations.get(data.get('id'))
        if not station: raise jig.JigError('局が見つかりません')
        return station

    def do_start(self, data):
        with self.lock: self.running = True
        self.note('送信を開始しました')

    def do_stop(self, data):
        with self.lock:
            self.running = False
            self.gateway.close()
        self.note('送信を停止しました')

    def do_step(self, data):
        self.tick(); self.note('1回だけ送信しました')

    def do_interval(self, data):
        value = data.get('interval')
        if not isinstance(value, (int, float)) or not 0.5 <= value <= 3600: raise jig.JigError('送信間隔は0.5〜3600秒です')
        with self.lock: self.interval = float(value)
        self.note(f'送信間隔を{value}秒にしました')

    def do_toggle(self, data):
        with self.lock:
            station = self.station(data)
            station['active'] = not station['active']
            if not station['active']: self.gateway.close(station['id'])
        self.note(f"{station['id']} を{'再開' if station['active'] else '一時停止'}しました")

    def do_update(self, data):
        with self.lock:
            station = self.station(data)
            for field, low, high in (('speed_knots', 0, 3000), ('course_deg', 0, 359.999), ('lat', -85, 85), ('lon', -180, 180), ('altitude_m', -1000, 100000)):
                if field in data and data[field] is not None:
                    value = data[field]
                    if isinstance(value, bool) or not isinstance(value, (int, float)) or not low <= value <= high:
                        raise jig.JigError(f'{field}は{low}〜{high}で指定してください')
                    station[field] = float(value)
            if 'lat' in data or 'lon' in data: station['track'].append((station['lat'], station['lon']))
        self.note(f"{station['id']} を変更しました")

    def do_add(self, data):
        station = dict(id=data.get('id'), name=data.get('name') or data.get('id'), kind=data.get('kind'), transport=data.get('transport'),
                       lat=data.get('lat'), lon=data.get('lon'), speed_knots=data.get('speed_knots') or 0, course_deg=data.get('course_deg') or 0)
        if data.get('altitude_m') not in (None, ''): station['altitude_m'] = data['altitude_m']
        if station['kind'] not in KINDS: raise jig.JigError('種別が不正です')
        jig.load_scenario_list([station])
        with self.lock:
            if station['id'] in self.stations: raise jig.JigError('同じ局IDがあります')
            self._add(station)
        self.note(f"{station['id']} を追加しました。局を登録してから送信してください")

    def do_remove(self, data):
        with self.lock:
            station = self.station(data)
            self.gateway.close(station['id'])
            del self.stations[station['id']]
        self.note(f"{station['id']} を削除しました（ゲートウェイの局設定は残ります）")

    def do_setup(self, data):
        with self.lock:
            targets = [s for s in self.stations.values() if not data.get('id') or s['id'] == data['id']]
            jig.setup(self.gateway, targets, self.note)
            for s in targets: self.gateway.close(s['id'])

    def do_fault(self, data):
        kind = data.get('fault')
        if kind not in FAULTS: raise jig.JigError('不明な異常の種類です')
        label, transports = FAULTS[kind]
        with self.lock:
            station = self.station(data)
            if station['transport'] not in transports: raise jig.JigError(f"{label}は{station['transport']}では送れません")
            stamp = self.clock()
            if kind == 'checksum': result = self._send(station, stamp, extra_lines=[jig.rmc(station, stamp, corrupt=True)])
            elif kind == 'void': result = self._send(station, stamp, extra_lines=[jig.rmc(station, stamp, status='V')])
            elif kind == 'old':
                old = stamp - 2 * 86400
                result = self._send(station, old, extra_lines=[jig.rmc(station, old)] if station['transport'] in ('http-nmea', 'tcp', 'udp') else ())
            elif kind == 'out_of_range': result = self._send(dict(station, lat=95), stamp)
            else:
                self.gateway.close(station['id'])  # A fresh TCP connection that starts with the wrong key.
                result = self._send(station, stamp, key_override='wrong-key-' + secrets.token_hex(11))
                self.gateway.close(station['id'])
            station['last'] = f'{label}: {result}'
        self.note(f"{station['id']} に{label}を送りました: {result}")

    def do_check(self, data):
        with self.lock:
            if self.busy: raise jig.JigError('機能確認を実行中です')
            self.busy = 'check'
            stations = [{k: v for k, v in s.items() if k not in ('track', 'active', 'last', 'sent')} for s in self.stations.values()]
            self.check_results = None
        def work():
            gateway = copy.copy(self.gateway); gateway.connections = {}
            results = []
            try:
                results = jig.check(gateway, copy.deepcopy(stations), self.note)
            except jig.JigError as error:
                results = [('機能確認を実行できません', False, str(error))]
            finally:
                gateway.close()
                with self.lock:
                    self.check_results = [dict(name=n, ok=o, detail=d) for n, o, d in results]
                    self.busy = None
                    # check() issued new stream keys; the old ones no longer work.
                    self.note('機能確認が終わりました。受信キーが変わったため「局を登録」をやり直してください' if any(
                        s['transport'] in ('tcp', 'udp') for s in stations) else '機能確認が終わりました')
                    for s in self.stations.values():
                        if s['transport'] in ('tcp', 'udp'): s.pop('stream_key', None); self.gateway.close(s['id'])
        threading.Thread(target=work, name='simulator-check', daemon=True).start()

    def state(self):
        self.refresh_received()
        with self.lock:
            now = self.clock()
            stations = []
            for s in self.stations.values():
                received = self.received.get(s['id'])
                stations.append(dict(
                    id=s['id'], name=s['name'], kind=s['kind'], transport=s['transport'], lat=s['lat'], lon=s['lon'],
                    speed_knots=s['speed_knots'], course_deg=s['course_deg'], altitude_m=s.get('altitude_m'),
                    active=s['active'], last=s['last'], sent=s['sent'], track=s['track'],
                    key_ready=bool(s.get('stream_key')) if s['transport'] in ('tcp', 'udp') else None,
                    received=dict(lat=received['lat'], lon=received['lon'], observed_at=received['observed_at'],
                                  age_seconds=round(now - jig.parse_iso(received['observed_at']), 1), stale=received['stale']) if received else None))
            return dict(running=self.running, interval=self.interval, busy=self.busy, log=list(self.log), check=self.check_results,
                        stations=stations, received_error=self.received_error,
                        faults={k: dict(label=v[0], transports=list(v[1])) for k, v in FAULTS.items()},
                        config=dict(url=self.gateway.base, nmea_host=self.gateway.nmea_host, nmea_port=self.gateway.nmea_port,
                                    udp_port=self.gateway.udp_port, source=self.gateway.source,
                                    ingest_token=len(self.gateway.ingest_token or '') >= 32,
                                    gateway_token=len(self.gateway.gateway_token or '') >= 32))


def make_server(console, port=8090):
    token = secrets.token_urlsafe(24)

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *args): pass

        def reply(self, status, body, content_type='application/json; charset=utf-8'):
            data = body if isinstance(body, bytes) else json.dumps(body, ensure_ascii=False).encode()
            self.send_response(status)
            for key, value in (('Content-Type', content_type), ('Content-Length', str(len(data))), ('Cache-Control', 'no-store'),
                               ('X-Content-Type-Options', 'nosniff'), ('X-Frame-Options', 'DENY'), ('Referrer-Policy', 'no-referrer'),
                               ('Content-Security-Policy', "default-src 'self'; style-src 'self'; script-src 'self'; frame-ancestors 'none'")):
                self.send_header(key, value)
            self.end_headers(); self.wfile.write(data)

        def local_host(self):
            # Refuse DNS rebinding: only the loopback names this server listens on.
            host = self.headers.get('Host', '')
            return host in (f'127.0.0.1:{self.server.server_port}', f'localhost:{self.server.server_port}')

        def do_GET(self):
            if not self.local_host(): return self.reply(403, dict(error='127.0.0.1から開いてください'))
            path = urlparse(self.path).path
            files = {'/': ('index.html', 'text/html; charset=utf-8'), '/simulator.js': ('simulator.js', 'text/javascript; charset=utf-8'),
                     '/simulator.css': ('simulator.css', 'text/css; charset=utf-8')}
            if path in files:
                name, mime = files[path]
                body = (STATIC / name).read_bytes()
                if name == 'index.html': body = body.replace(b'{{TOKEN}}', token.encode())
                return self.reply(200, body, mime)
            if path == '/land.geojson' and LAND.exists(): return self.reply(200, LAND.read_bytes(), 'application/geo+json')
            if path == '/api/state':
                if not secrets.compare_digest(self.headers.get('X-Simulator-Token', ''), token): return self.reply(403, dict(error='画面を開き直してください'))
                return self.reply(200, console.state())
            self.reply(404, dict(error='見つかりません'))

        def do_POST(self):
            if not self.local_host() or not secrets.compare_digest(self.headers.get('X-Simulator-Token', ''), token):
                return self.reply(403, dict(error='画面を開き直してください'))
            if self.headers.get('Content-Type', '').split(';')[0] != 'application/json': return self.reply(415, dict(error='JSONが必要です'))
            try:
                length = int(self.headers.get('Content-Length', '0'))
                if not 0 < length <= 8192: raise jig.JigError('要求が大きすぎます')
                data = json.loads(self.rfile.read(length))
                if not isinstance(data, dict): raise jig.JigError('JSONオブジェクトが必要です')
                console.action(data)
                self.reply(200, console.state())
            except (jig.JigError, ValueError) as error:
                self.reply(400, dict(error=str(error)))

    server = ThreadingHTTPServer(('127.0.0.1', port), Handler)
    server.daemon_threads = True
    return server, token


def serve(gateway, stations, interval, port, log):
    console = Console(gateway, stations, interval)
    server, _ = make_server(console, port)
    console.start_thread()
    log(f'管制画面: http://127.0.0.1:{server.server_port}/  （停止はCtrl+C）')
    try: server.serve_forever()
    except KeyboardInterrupt: pass
    finally:
        server.server_close(); console.close()
