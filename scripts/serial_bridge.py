"""Serial NMEA 0183 bridge for the CHUCK position gateway.

A GPS receiver, a marine NMEA multiplexer or another device with a serial
(RS-232/RS-422 via USB, or a USB GPS that appears as a serial port) output is
connected to a PC near the device. This program reads its NMEA sentences and
forwards them to the position gateway's TCP/UDP input with the station's
stream key, reconnecting when either side drops.

  python3 scripts/serial_bridge.py /dev/ttyUSB0 --host 168.110.7.225 --port 10120
  python3 scripts/serial_bridge.py COM3 --baud 38400 --udp ...      (Windows needs pyserial)
  python3 scripts/serial_bridge.py --list                           (candidate ports)

The stream key is read from HF_GATEWAY_STREAM_KEY or --key-file, never from
the command line, so it does not show up in the process list. Only RMC (position)
and HDT/HDG/THS (heading) are forwarded by default, which is what the gateway
stores; --sentences all sends everything. Lines with a wrong checksum are dropped here. On Linux and macOS
only the Python standard library is used.
"""
import argparse
import glob
import os
import re
import socket
import sys
import time

BAUDS = (1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400)
SENTENCE = re.compile(r'[$!][A-Z]{2}([A-Z]{3}),[\x20-\x7e]*\*([0-9A-Fa-f]{2})')
MAX_LINE = 256


class BridgeError(Exception):
    pass


def valid(line):
    """Return the sentence type of a checksummed NMEA line, or None."""
    match = SENTENCE.fullmatch(line)
    if not match or len(line) > MAX_LINE: return None
    value = 0
    for char in line[1:line.rindex('*')]: value ^= ord(char)
    return match.group(1) if value == int(match.group(2), 16) else None


def candidate_ports():
    if os.name == 'nt':
        try:
            from serial.tools import list_ports
            return [p.device for p in list_ports.comports()]
        except ImportError:
            return []
    patterns = ('/dev/ttyUSB*', '/dev/ttyACM*', '/dev/ttyS[0-9]*', '/dev/serial/by-id/*', '/dev/cu.usb*', '/dev/cu.*serial*', '/dev/cu.*GPS*')
    return sorted({p for pattern in patterns for p in glob.glob(pattern)})


class PosixSerial:
    """Raw 8N1 serial port through termios (Linux, macOS)."""

    def __init__(self, path, baud):
        import termios
        import tty
        if baud not in BAUDS: raise BridgeError(f'未対応の通信速度です: {baud}')
        self.fd = os.open(path, os.O_RDONLY | os.O_NOCTTY | os.O_NONBLOCK)
        try:
            if os.isatty(self.fd):
                tty.setraw(self.fd)
                attrs = termios.tcgetattr(self.fd)
                speed = getattr(termios, f'B{baud}')
                attrs[4] = attrs[5] = speed
                attrs[2] |= termios.CLOCAL | termios.CREAD
                attrs[2] &= ~(termios.PARENB | termios.CSTOPB)
                termios.tcsetattr(self.fd, termios.TCSANOW, attrs)
            os.set_blocking(self.fd, True)
        except Exception:
            os.close(self.fd)
            raise

    def read(self, timeout=1.0):
        import select
        ready, _, _ = select.select([self.fd], [], [], timeout)
        if not ready: return b''
        data = os.read(self.fd, 4096)
        if not data: raise OSError('シリアルポートが閉じられました')
        return data

    def close(self):
        os.close(self.fd)


class PySerial:
    """Windows (or any OS with pyserial installed)."""

    def __init__(self, path, baud):
        try:
            import serial
        except ImportError:
            raise BridgeError('Windowsではpyserialが必要です: pip install pyserial')
        self.port = serial.Serial(path, baud, timeout=1)

    def read(self, timeout=1.0):
        return self.port.read(self.port.in_waiting or 1)

    def close(self):
        self.port.close()


class StdinSource:
    """Read NMEA from standard input, e.g. `cat log.nmea | serial_bridge.py -`."""

    def __init__(self):
        self.stream = sys.stdin.buffer

    def read(self, timeout=1.0):
        data = self.stream.readline()
        if not data: raise EOFError()
        return data

    def close(self):
        pass


def open_source(path, baud):
    if path == '-': return StdinSource()
    if os.name == 'nt': return PySerial(path, baud)
    return PosixSerial(path, baud)


class Sender:
    """Forward lines to the gateway with the stream key; reconnect with backoff."""

    def __init__(self, host, port, key, udp=False, timeout=10, log=print):
        self.host, self.port, self.key, self.udp, self.timeout, self.log = host, port, key, udp, timeout, log
        self.sock = None
        self.retry_at = 0
        self.backoff = 1
        self.sent = self.dropped = 0

    def connect(self):
        if self.udp:
            family = socket.AF_INET6 if ':' in self.host else socket.AF_INET
            self.sock = socket.socket(family, socket.SOCK_DGRAM)
            return
        self.sock = socket.create_connection((self.host, self.port), timeout=self.timeout)
        self.sock.sendall((self.key + '\r\n').encode('ascii'))
        self.log(f'ゲートウェイに接続しました {self.host}:{self.port}')

    def send(self, line, now=None):
        now = time.monotonic() if now is None else now
        if self.sock is None:
            if now < self.retry_at:
                self.dropped += 1
                return False
            try:
                self.connect()
                self.backoff = 1
            except OSError as error:
                self.retry_at = now + self.backoff
                self.log(f'接続できません（{self.backoff}秒後に再試行）: {error}')
                self.backoff = min(self.backoff * 2, 30)
                self.dropped += 1
                return False
        try:
            if self.udp: self.sock.sendto((self.key + '\r\n' + line + '\r\n').encode('ascii'), (self.host, self.port))
            else: self.sock.sendall((line + '\r\n').encode('ascii'))
            self.sent += 1
            return True
        except OSError as error:
            self.log(f'送信が切れました: {error}')
            self.close()
            self.dropped += 1
            return False

    def close(self):
        if self.sock:
            try: self.sock.close()
            except OSError: pass
        self.sock = None


DEFAULT_SENTENCES = ('RMC', 'HDT', 'HDG', 'THS')  # What the gateway stores.


class Bridge:
    """Split the byte stream into lines, check and filter them, keep under the gateway's rate limit."""

    def __init__(self, sender, sentences=DEFAULT_SENTENCES, max_rate=5.0, log=print):
        self.sender, self.sentences, self.log = sender, sentences, log
        self.interval = 1.0 / max_rate if max_rate else 0
        self.buffer = b''
        self.last_sent = {}
        self.counts = dict(read=0, bad=0, filtered=0, throttled=0)

    def feed(self, data, now=None):
        now = time.monotonic() if now is None else now
        self.buffer += data
        *lines, self.buffer = self.buffer.split(b'\n')
        if len(self.buffer) > MAX_LINE: self.buffer = b''  # Garbage without line ends (wrong baud rate).
        for raw in lines:
            try: line = raw.decode('ascii').strip('\r\n\x00 ')
            except UnicodeDecodeError:
                self.counts['bad'] += 1
                continue
            if not line: continue
            self.counts['read'] += 1
            kind = valid(line)
            if not kind:
                self.counts['bad'] += 1
                continue
            if self.sentences and kind not in self.sentences:
                self.counts['filtered'] += 1
                continue
            # One line per sentence type per interval: a 10 Hz receiver is sent at max_rate.
            if now - self.last_sent.get(kind, -1e9) < self.interval:
                self.counts['throttled'] += 1
                continue
            if self.sender.send(line, now): self.last_sent[kind] = now

    def summary(self):
        c = self.counts
        return (f"受信 {c['read']}行・送信 {self.sender.sent}・未送信 {self.sender.dropped}・"
                f"チェックサム誤り等 {c['bad']}・対象外 {c['filtered']}・間引き {c['throttled']}")


def read_key(args):
    if args.key_file:
        with open(args.key_file, encoding='ascii') as handle: key = handle.read().strip()
    else:
        key = os.environ.get('HF_GATEWAY_STREAM_KEY', '').strip()
    if not re.fullmatch(r'[A-Za-z0-9_-]{16,128}', key):
        raise BridgeError('受信キーを HF_GATEWAY_STREAM_KEY か --key-file で指定してください（ゲートウェイ管理画面で発行）')
    return key


def run(args, log=print, stop=lambda: False):
    key = read_key(args)
    sentences = () if args.sentences.lower() == 'all' else tuple(s.strip().upper() for s in args.sentences.split(',') if s.strip())
    sender = Sender(args.host, args.port, key, args.udp, log=log)
    bridge = Bridge(sender, sentences, args.max_rate, log)
    source, backoff, last_report = None, 1, time.monotonic()
    log(f"中継を開始します: {args.device} {args.baud}bps → {'UDP' if args.udp else 'TCP'} {args.host}:{args.port}")
    try:
        while not stop():
            if source is None:
                try:
                    source = open_source(args.device, args.baud)
                    log(f'シリアルポートを開きました: {args.device}')
                    backoff = 1
                except (OSError, BridgeError) as error:
                    if isinstance(error, BridgeError): raise
                    log(f'シリアルポートを開けません（{backoff}秒後に再試行）: {error}')
                    time.sleep(backoff); backoff = min(backoff * 2, 30)
                    continue
            try:
                bridge.feed(source.read())
            except EOFError:
                break
            except OSError as error:
                log(f'シリアルポートが切れました: {error}')
                source.close(); source = None
            if args.report and time.monotonic() - last_report >= args.report:
                log(bridge.summary()); last_report = time.monotonic()
    except KeyboardInterrupt:
        pass
    finally:
        if source: source.close()
        sender.close()
        log(bridge.summary())
    return bridge


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('device', nargs='?', help='シリアルポート（/dev/ttyUSB0、/dev/cu.usbserial-…、COM3）。- で標準入力')
    parser.add_argument('--list', action='store_true', help='候補のシリアルポートを表示して終了')
    parser.add_argument('--baud', type=int, default=4800, help='通信速度（既定4800。AISや高速GPSは38400など）')
    parser.add_argument('--host', help='ゲートウェイのホスト（例 168.110.7.225）')
    parser.add_argument('--port', type=int, default=10120, help='ゲートウェイのTCP・UDPポート（既定10120）')
    parser.add_argument('--udp', action='store_true', help='TCPの代わりにUDPで送る')
    parser.add_argument('--key-file', help='受信キーを書いたファイル（既定は環境変数 HF_GATEWAY_STREAM_KEY）')
    parser.add_argument('--sentences', default=','.join(DEFAULT_SENTENCES), help='転送するセンテンス（カンマ区切り。既定RMC,HDT,HDG,THS、allで全部）')
    parser.add_argument('--max-rate', type=float, default=5, help='センテンスの種類ごとの最大送信回数/秒（既定5。ゲートウェイの上限は送信元ごとに毎秒20行）')
    parser.add_argument('--report', type=float, default=60, help='件数を表示する間隔秒（既定60、0で表示しない）')
    args = parser.parse_args(argv)
    if args.list:
        ports = candidate_ports()
        print('\n'.join(ports) if ports else 'シリアルポートが見つかりません（機器をつないでから、ドライバーを確認してください）')
        return 0
    if not args.device or not args.host: parser.error('シリアルポートと --host を指定してください（--list で候補を表示）')
    if args.baud not in BAUDS: parser.error('通信速度は ' + ', '.join(map(str, BAUDS)) + ' のどれかです')
    if args.max_rate < 0 or args.max_rate > 20: parser.error('--max-rate は0〜20です')
    import signal
    signal.signal(signal.SIGTERM, lambda *_: (_ for _ in ()).throw(KeyboardInterrupt()))  # systemd stop: print the summary.
    try:
        run(args, log=lambda text: print(text, flush=True))
        return 0
    except BridgeError as error:
        print('エラー: ' + str(error), file=sys.stderr)
        return 2


if __name__ == '__main__':
    sys.exit(main())
