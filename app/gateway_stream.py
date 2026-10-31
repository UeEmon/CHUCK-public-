"""TCP/UDP NMEA 0183 input for the position gateway.

Devices that stream plain NMEA (GPS receivers, marine multiplexers, AVL units)
cannot send an HTTP Bearer token. A sender is authorized either by a per-station
stream key sent as the first line (TCP: once per connection, UDP: first line of
each datagram), or, on closed networks, by the sender IP address registered on
a station without a key. RMC fixes and HDT/HDG/THS headings are stored; other
sentences are counted and skipped.
"""
import re
import socket
import socketserver
import threading
import time
from engine import InputError

MAX_LINE = 256           # Longest accepted NMEA line incl. CR LF (NMEA allows 82).
MAX_DATAGRAM = 2048      # One UDP datagram may carry several sentences.
MAX_CONNECTIONS = 64     # Simultaneous TCP senders.
IDLE_TIMEOUT = 300       # Seconds without data before a TCP sender is dropped.
LINES_PER_SECOND = 20    # Per sender; excess lines are dropped before parsing.
KEY_TIMEOUT = 15         # Seconds a new TCP sender has to send its first line.
MAX_FAILURES = 10        # Failed authorizations per IP before it is ignored ...
FAILURE_WINDOW = 600     # ... for this many seconds.
KEY_LINE = re.compile(r'[A-Za-z0-9_-]{16,128}')


class StreamStats:
    """Thread-safe counters shown on the gateway management page."""

    def __init__(self):
        self.lock = threading.Lock()
        self.listeners = {}
        self.counts = dict(accepted=0, headings=0, ignored=0, skipped=0, rejected=0, unauthorized=0, rate_limited=0)
        self.connections = 0
        self.last_error = None
        self.windows = {}
        self.failures = {}

    def add(self, key, amount=1):
        with self.lock: self.counts[key] += amount

    def error(self, peer, message):
        with self.lock:
            self.counts['rejected'] += 1
            self.last_error = dict(peer=peer, message=message, at=time.time())

    def allow(self, peer, now=None):
        """Fixed one-second window per sender to keep floods away from the DB."""
        now = time.monotonic() if now is None else now
        with self.lock:
            if len(self.windows) > 4096: self.windows.clear()
            start, count = self.windows.get(peer, (now, 0))
            if now - start >= 1: start, count = now, 0
            if count >= LINES_PER_SECOND:
                self.counts['rate_limited'] += 1
                self.windows[peer] = (start, count)
                return False
            self.windows[peer] = (start, count + 1)
            return True

    def blocked(self, peer, now=None):
        now = time.monotonic() if now is None else now
        with self.lock:
            recent = [t for t in self.failures.get(peer, []) if now - t < FAILURE_WINDOW]
            if recent: self.failures[peer] = recent
            else: self.failures.pop(peer, None)
            return len(recent) >= MAX_FAILURES

    def unauthorized(self, peer, now=None):
        now = time.monotonic() if now is None else now
        with self.lock:
            self.counts['unauthorized'] += 1
            if len(self.failures) > 4096: self.failures.clear()
            self.failures.setdefault(peer, []).append(now)

    def snapshot(self):
        with self.lock:
            error = dict(self.last_error) if self.last_error else None
            return dict(listeners=dict(self.listeners), connections=self.connections,
                        counts=dict(self.counts), last_error=error)


def decode(stats, peer, raw):
    try: return raw.decode('ascii').strip('\r\n')
    except UnicodeError:
        stats.error(peer, 'ASCII以外の文字を含む行です')
        return None


def authorize(server, peer, first):
    """Return (station, key, first_line_is_data) for the first line of a sender."""
    key = first.strip() if first and KEY_LINE.fullmatch(first.strip()) else None
    try:
        station = server.store.stream_station(peer, key, server.require_key)
    except Exception:
        __import__('traceback').print_exc()
        station = None
    return station, key, key is None


def handle_line(server, station, peer, line):
    """Process one received line. Never raises: errors only update counters."""
    stats = server.stats
    if not line or not stats.allow(peer): return
    try:
        result = server.store.ingest_stream(station, line)
    except InputError as error:
        return stats.error(peer, str(error))
    except Exception:
        __import__('traceback').print_exc()
        return stats.error(peer, 'ゲートウェイDBに保存できません')
    stats.add('accepted', result.get('accepted', 0))
    stats.add('ignored', result.get('ignored_old_or_equal', 0))
    stats.add('skipped', result.get('skipped', 0))
    stats.add('headings', result.get('headings', 0))


class _TCPHandler(socketserver.StreamRequestHandler):
    timeout = KEY_TIMEOUT

    def readline(self):
        """Next line, or None when the sender closed, timed out or sent too much."""
        try: raw = self.rfile.readline(MAX_LINE + 1)
        except (socket.timeout, OSError): return None
        if not raw: return None
        if len(raw) > MAX_LINE and not raw.endswith(b'\n'):
            self.server.stats.error(self.client_address[0], 'NMEAの1行が長すぎます')
            return None
        return raw

    def handle(self):
        server, stats = self.server, self.server.stats
        peer = self.client_address[0]
        if stats.blocked(peer): return
        with stats.lock:
            if stats.connections >= MAX_CONNECTIONS: return
            stats.connections += 1
        try:
            raw = self.readline()
            first = decode(stats, peer, raw) if raw else None
            if first is None: return
            station, key, data = authorize(server, peer, first)
            if not station:
                stats.unauthorized(peer)
                return  # Unauthorized senders are disconnected at once.
            self.connection.settimeout(IDLE_TIMEOUT)
            if data: handle_line(server, station, peer, first)
            while True:
                raw = self.readline()
                if raw is None: return
                line = decode(stats, peer, raw)
                if line is None: continue
                # Re-check every line so disabling a station or revoking its key takes effect at once.
                station = server.store.stream_station(peer, key, server.require_key)
                if not station:
                    stats.unauthorized(peer)
                    return
                handle_line(server, station, peer, line)
        finally:
            with stats.lock: stats.connections -= 1


class _UDPHandler(socketserver.BaseRequestHandler):
    def handle(self):
        server, stats = self.server, self.server.stats
        data = self.request[0]
        peer = self.client_address[0]
        if stats.blocked(peer): return
        if len(data) > MAX_DATAGRAM:
            return stats.error(peer, 'UDPデータグラムが大きすぎます')
        lines = []
        for raw in data.splitlines():
            if len(raw) > MAX_LINE: return stats.error(peer, 'NMEAの1行が長すぎます')
            line = decode(stats, peer, raw)
            if line is None: return
            if line: lines.append(line)
        if not lines: return
        station, key, first_is_data = authorize(server, peer, lines[0])
        if not station: return stats.unauthorized(peer)
        for line in lines if first_is_data else lines[1:]:
            handle_line(server, station, peer, line)


class _DualStack:
    """Listen on IPv6 with IPv4-mapped addresses when the host supports it."""
    allow_reuse_address = True
    daemon_threads = True

    def server_bind(self):
        if self.address_family == socket.AF_INET6:
            try: self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
            except OSError: pass
        super().server_bind()


def _server(base, handler, host, port, store, stats, require_key):
    family = socket.AF_INET6 if ':' in host else socket.AF_INET
    cls = type(base.__name__ + 'Gateway', (_DualStack, base), dict(address_family=family))
    server = cls((host, port), handler)
    server.store, server.stats, server.require_key = store, stats, require_key
    return server


def start(store, stats, host=None, tcp_port=None, udp_port=None, require_key=False):
    """Start the enabled listeners in daemon threads and return the servers."""
    host = host or '0.0.0.0'
    servers = []
    for proto, base, handler, port in (('tcp', socketserver.ThreadingTCPServer, _TCPHandler, tcp_port),
                                       ('udp', socketserver.ThreadingUDPServer, _UDPHandler, udp_port)):
        if port is None: continue
        server = _server(base, handler, host, port, store, stats, require_key)
        threading.Thread(target=server.serve_forever, name='nmea-' + proto, daemon=True).start()
        with stats.lock: stats.listeners[proto] = server.server_address[1]
        servers.append(server)
    return servers
