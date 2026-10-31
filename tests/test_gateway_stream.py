"""NMEA 0183 over TCP/UDP: only registered sender addresses reach the position DB."""
from pathlib import Path
import socket
import sqlite3
import sys
import tempfile
import time
import unittest
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'))
sys.path.insert(0,str(Path(__file__).resolve().parent))
import gateway_stream
from engine import InputError
from positions import PositionStore, peer_address
from test_positions import rmc


def gga():
    body='GPGGA,120000,3500.0000,N,13930.0000,E,1,08,0.9,10.0,M,39.0,M,,'
    checksum=0
    for char in body: checksum^=ord(char)
    return '$'+body+'*'+format(checksum,'02X')+'\r\n'


class PeerSettingTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.store=PositionStore(lambda:sqlite3.connect(Path(self.tmp.name)/'db'))
        self.station=dict(source='gps',id='car',kind='vehicle',name='車両',protocol='nmea0183',peer='192.0.2.10')

    def test_address_normalization(self):
        self.assertEqual(peer_address(' 192.0.2.10 '),'192.0.2.10')
        self.assertEqual(peer_address('::ffff:192.0.2.10'),'192.0.2.10')
        self.assertEqual(peer_address('2001:DB8::1'),'2001:db8::1')
        self.assertIsNone(peer_address(''))
        for bad in ['192.0.2.0/24','0.0.0.0','224.0.0.1','host.example',7]:
            with self.subTest(bad=bad),self.assertRaises(InputError):peer_address(bad)

    def test_peer_is_unique_nmea_only_and_kept_when_omitted(self):
        self.store.configure(self.station)
        with self.assertRaises(InputError):self.store.configure(dict(self.station,id='other'))
        with self.assertRaises(InputError):self.store.configure(dict(self.station,id='json',protocol='json'))
        # Older clients that send no peer field keep the stored address.
        legacy={k:v for k,v in self.station.items() if k!='peer'}
        self.assertEqual(self.store.configure(dict(legacy,enabled=False))['peer'],'192.0.2.10')
        self.assertIsNone(self.store.stream_station('192.0.2.10'))
        self.store.configure(dict(legacy,enabled=True))
        self.assertEqual(self.store.stream_station('192.0.2.10')['id'],'car')
        self.assertIsNone(self.store.stream_station('192.0.2.10',require_key=True))
        self.assertNotIn('peer',self.store.configure(dict(self.station,peer='')))
        self.assertIsNone(self.store.stream_station('192.0.2.10'))

    def test_stream_key_is_shown_once_and_only_its_hash_is_kept(self):
        station={k:v for k,v in self.station.items() if k!='peer'}
        saved=self.store.configure(dict(station,stream_key='generate'))
        key=saved['stream_key']
        self.assertGreaterEqual(len(key),32);self.assertTrue(saved['stream_key_set'])
        listed=self.store.snapshot()['stations'][0]
        self.assertEqual(listed['stream_key_set'],True)
        self.assertNotIn('stream_key',listed);self.assertNotIn('stream_key_hash',listed)
        self.assertNotIn(key,(Path(self.tmp.name)/'db').read_bytes().decode('latin-1'))
        # Any sender IP works with the key, so mobile links with changing addresses are fine.
        for peer in ('198.51.100.7','2001:db8::5',None):
            self.assertEqual(self.store.stream_station(peer,key,require_key=True)['id'],'car')
        self.assertIsNone(self.store.stream_station('198.51.100.7','x'*32))
        self.assertIsNone(self.store.stream_station('198.51.100.7'))  # A key station never accepts IP only.
        # Saving without the field (main app screen, edit form) keeps the key.
        self.assertTrue(self.store.configure(dict(listed,name='新名'))['stream_key_set'])
        self.assertEqual(self.store.stream_station(None,key)['name'],'新名')
        # A registered IP narrows the key to that sender.
        self.store.configure(dict(station,peer='192.0.2.10'))
        self.assertIsNone(self.store.stream_station('198.51.100.7',key))
        self.assertEqual(self.store.stream_station('192.0.2.10',key)['id'],'car')
        new=self.store.configure(dict(station,peer='',stream_key='generate'))['stream_key']
        self.assertIsNone(self.store.stream_station(None,key))
        self.assertIsNotNone(self.store.stream_station(None,new))
        self.store.configure(dict(station,stream_key=''))
        self.assertIsNone(self.store.stream_station(None,new))
        for bad in ('my-own-key',123):
            with self.subTest(bad=bad),self.assertRaises(InputError):self.store.configure(dict(station,stream_key=bad))
        with self.assertRaises(InputError):self.store.configure(dict(station,protocol='json',stream_key='generate'))

    def test_stream_stores_rmc_and_skips_other_sentences(self):
        self.store.configure(self.station)
        now=time.time()
        station=self.store.stream_station('192.0.2.10')
        self.assertEqual(self.store.ingest_stream(station,gga(),now)['skipped'],1)
        self.assertEqual(self.store.ingest_stream(station,rmc(now),now)['accepted'],1)
        position=self.store.snapshot(now)['positions'][0]
        self.assertEqual((position['source'],position['id'],position['protocol'],position['lat']),('gps','car','nmea0183',35))
        with self.assertRaises(InputError):self.store.ingest_stream(station,'garbage',now)


class SocketTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.store=PositionStore(lambda:sqlite3.connect(Path(self.tmp.name)/'db'))
        self.stats=gateway_stream.StreamStats()
        self.listen()

    def listen(self,require_key=False):
        self.stats=gateway_stream.StreamStats()
        self.servers=gateway_stream.start(self.store,self.stats,host='127.0.0.1',tcp_port=0,udp_port=0,require_key=require_key)
        for server in self.servers:self.addCleanup(server.server_close);self.addCleanup(server.shutdown)
        self.tcp,self.udp=self.stats.listeners['tcp'],self.stats.listeners['udp']

    def register(self,peer='127.0.0.1',key=False):
        saved=self.store.configure(dict(source='gps',id='car',kind='vehicle',name='車両',protocol='nmea0183',peer=peer,**(dict(stream_key='generate') if key else {})))
        return saved.get('stream_key')

    def wait(self,predicate):
        deadline=time.time()+5
        while time.time()<deadline:
            if predicate():return True
            time.sleep(0.02)
        return False

    def positions(self):return self.store.snapshot()['positions']

    def test_tcp_stream_of_mixed_sentences(self):
        self.register()
        with socket.create_connection(('127.0.0.1',self.tcp)) as s:
            s.sendall((gga()+rmc(time.time())+'garbage\r\n').encode())
            self.assertTrue(self.wait(lambda:self.stats.snapshot()['counts']['rejected']==1))
        counts=self.stats.snapshot()['counts']
        self.assertEqual((counts['accepted'],counts['skipped']),(1,1))
        self.assertEqual(self.positions()[0]['id'],'car')

    def test_udp_datagram_with_several_sentences(self):
        self.register()
        with socket.socket(socket.AF_INET,socket.SOCK_DGRAM) as s:
            s.sendto((gga()+rmc(time.time())).encode(),('127.0.0.1',self.udp))
            self.assertTrue(self.wait(lambda:self.positions()))
        self.assertEqual(self.stats.snapshot()['counts']['skipped'],1)

    def test_unregistered_sender_is_dropped(self):
        self.register('192.0.2.10')
        with socket.create_connection(('127.0.0.1',self.tcp)) as s:
            s.sendall(rmc(time.time()).encode())
            s.settimeout(5)
            self.assertEqual(s.recv(1),b'')  # Closed by the gateway.
        with socket.socket(socket.AF_INET,socket.SOCK_DGRAM) as s:
            s.sendto(rmc(time.time()).encode(),('127.0.0.1',self.udp))
            self.assertTrue(self.wait(lambda:self.stats.snapshot()['counts']['unauthorized']==2))
        self.assertEqual(self.positions(),[])

    def test_stream_key_over_tcp_and_udp_when_keys_are_required(self):
        for server in self.servers:server.shutdown();server.server_close()
        self.listen(require_key=True)
        key=self.register('',key=True)
        with socket.create_connection(('127.0.0.1',self.tcp)) as s:
            s.sendall((key+'\r\n'+gga()+rmc(time.time())).encode())
            self.assertTrue(self.wait(lambda:self.stats.snapshot()['counts']['accepted']==1))
        with socket.socket(socket.AF_INET,socket.SOCK_DGRAM) as s:
            s.sendto((key+'\n'+rmc(time.time()+1)).encode(),('127.0.0.1',self.udp))
            self.assertTrue(self.wait(lambda:self.stats.snapshot()['counts']['accepted']==2))
            s.sendto(rmc(time.time()+2).encode(),('127.0.0.1',self.udp))  # No key line.
            s.sendto(('x'*32+'\n'+rmc(time.time()+2)).encode(),('127.0.0.1',self.udp))
            self.assertTrue(self.wait(lambda:self.stats.snapshot()['counts']['unauthorized']==2))
        self.assertEqual(self.stats.snapshot()['counts']['accepted'],2)

    def test_revoking_the_key_ends_an_open_connection(self):
        key=self.register('',key=True)
        with socket.create_connection(('127.0.0.1',self.tcp)) as s:
            s.sendall((key+'\r\n'+rmc(time.time())).encode())
            self.assertTrue(self.wait(lambda:self.stats.snapshot()['counts']['accepted']==1))
            self.store.configure(dict(source='gps',id='car',kind='vehicle',name='車両',protocol='nmea0183',stream_key=''))
            s.sendall(rmc(time.time()+1).encode())
            s.settimeout(5)
            self.assertEqual(s.recv(1),b'')
        self.assertEqual(self.stats.snapshot()['counts']['unauthorized'],1)

    def test_repeated_failures_block_the_sender(self):
        stats=gateway_stream.StreamStats()
        for _ in range(gateway_stream.MAX_FAILURES):stats.unauthorized('203.0.113.9',now=10.0)
        self.assertTrue(stats.blocked('203.0.113.9',now=11.0))
        self.assertFalse(stats.blocked('203.0.113.9',now=10.0+gateway_stream.FAILURE_WINDOW+1))

    def test_long_line_closes_connection_and_rate_limit(self):
        self.register()
        with socket.create_connection(('127.0.0.1',self.tcp)) as s:
            s.sendall(b'$'+b'A'*400)
            s.settimeout(5)
            self.assertEqual(s.recv(1),b'')
        self.assertEqual(self.stats.snapshot()['last_error']['message'],'NMEAの1行が長すぎます')
        stats=gateway_stream.StreamStats()
        allowed=[stats.allow('192.0.2.1',now=100.0) for _ in range(gateway_stream.LINES_PER_SECOND+5)]
        self.assertEqual(allowed.count(True),gateway_stream.LINES_PER_SECOND)
        self.assertTrue(stats.allow('192.0.2.1',now=101.5))


if __name__=='__main__':unittest.main()
