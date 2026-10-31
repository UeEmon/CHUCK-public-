"""Serial NMEA bridge: a (pseudo) serial GPS reaches the gateway's TCP/UDP input with a stream key."""
import argparse
import os
from pathlib import Path
import socket
import sqlite3
import sys
import tempfile
import threading
import time
import unittest
from unittest.mock import patch
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'app'));sys.path.insert(0,str(ROOT/'scripts'))
import gateway_simulator as jig
import gateway_stream
import serial_bridge as bridge
from positions import PositionStore

STATION=dict(id='gps1',lat=35.0,lon=139.5,speed_knots=10.0,course_deg=90.0)


class FakeSender:
    def __init__(self):self.lines=[];self.sent=self.dropped=0
    def send(self,line,now=None):
        self.lines.append(line);self.sent+=1;return True


class UnitTests(unittest.TestCase):
    def test_valid_checks_checksum_and_returns_type(self):
        line=jig.rmc(dict(STATION),time.time()).strip()
        self.assertEqual(bridge.valid(line),'RMC')
        self.assertEqual(bridge.valid(jig.gga(dict(STATION),time.time()).strip()),'GGA')
        self.assertIsNone(bridge.valid(jig.rmc(dict(STATION),time.time(),corrupt=True).strip()))
        for bad in ('','garbage','$GPRMC,1,2,3','$GPRMC,*00\x01'):
            with self.subTest(bad=bad):self.assertIsNone(bridge.valid(bad))

    def test_bridge_filters_splits_and_throttles(self):
        sender=FakeSender()
        b=bridge.Bridge(sender,('RMC',),max_rate=1,log=lambda _:None)
        now=time.time()
        data=(jig.gga(dict(STATION),now)+jig.rmc(dict(STATION),now)+jig.rmc(dict(STATION),now,corrupt=True)).encode()
        b.feed(data[:30],now=100.0);b.feed(data[30:],now=100.0)  # A sentence split across two reads.
        self.assertEqual(len(sender.lines),1);self.assertEqual(bridge.valid(sender.lines[0]),'RMC')
        self.assertEqual((b.counts['filtered'],b.counts['bad']),(1,1))
        b.feed(jig.rmc(dict(STATION),now).encode(),now=100.5)  # Within 1 s: thinned out.
        b.feed(jig.rmc(dict(STATION),now).encode(),now=101.1)
        self.assertEqual((len(sender.lines),b.counts['throttled']),(2,1))
        b.feed(b'\xff'*400,now=102)  # Wrong baud rate: garbage without line ends is discarded.
        self.assertEqual(b.buffer,b'')
        everything=bridge.Bridge(FakeSender(),(),max_rate=0,log=lambda _:None)
        everything.feed((jig.gga(dict(STATION),now)*3).encode())
        self.assertEqual(everything.sender.sent,3)

    def test_sender_backs_off_when_gateway_is_down(self):
        with socket.socket() as s:
            s.bind(('127.0.0.1',0));port=s.getsockname()[1]  # Bound but not listening: refused.
            sender=bridge.Sender('127.0.0.1',port,'k'*32,log=lambda _:None)
            self.assertFalse(sender.send('x',now=10.0))
            self.assertFalse(sender.send('x',now=10.5))  # Inside the back-off: not even tried.
            self.assertEqual((sender.dropped,sender.backoff,sender.retry_at),(2,2,11.0))

    def test_key_comes_from_environment_or_file_only(self):
        args=argparse.Namespace(key_file=None)
        with patch.dict(os.environ,HF_GATEWAY_STREAM_KEY=''),self.assertRaises(bridge.BridgeError):bridge.read_key(args)
        with patch.dict(os.environ,HF_GATEWAY_STREAM_KEY=' '+'a'*32+'\n'):self.assertEqual(bridge.read_key(args),'a'*32)
        with tempfile.NamedTemporaryFile('w',suffix='.key') as f:
            f.write('b'*32+'\n');f.flush()
            self.assertEqual(bridge.read_key(argparse.Namespace(key_file=f.name)),'b'*32)
        with patch('sys.stderr'),self.assertRaises(SystemExit):bridge.main(['/dev/null'])  # --host is required.


@unittest.skipIf(os.name=='nt','pseudo terminals are POSIX only')
class EndToEndTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.store=PositionStore(lambda:sqlite3.connect(Path(self.tmp.name)/'db'))
        self.stats=gateway_stream.StreamStats()
        for server in gateway_stream.start(self.store,self.stats,host='127.0.0.1',tcp_port=0,udp_port=0,require_key=True):
            self.addCleanup(server.server_close);self.addCleanup(server.shutdown)
        self.key=self.store.configure(dict(source='gps',id='gps1',kind='vessel',name='本船',protocol='nmea0183',stream_key='generate'))['stream_key']

    def relay(self,udp):
        stop=threading.Event();ready=threading.Event();path=[]
        device=threading.Thread(target=jig.serial_device,args=(dict(STATION),0.1,5,lambda _:None),
                                kwargs=dict(ready=lambda p:(path.append(p),ready.set()),stop=stop.is_set),daemon=True)
        device.start();self.assertTrue(ready.wait(5))
        args=argparse.Namespace(device=path[0],baud=4800,host='127.0.0.1',port=self.stats.listeners['udp' if udp else 'tcp'],
                                udp=udp,key_file=None,sentences='RMC',max_rate=5,report=0)
        logs=[]
        deadline=time.time()+5
        with patch.dict(os.environ,HF_GATEWAY_STREAM_KEY=self.key):
            result=bridge.run(args,log=logs.append,stop=lambda:self.stats.snapshot()['counts']['accepted']>=2 or time.time()>deadline)
        stop.set();device.join(5)
        self.assertGreaterEqual(self.stats.snapshot()['counts']['accepted'],2,logs)
        self.assertEqual(self.stats.snapshot()['counts']['unauthorized'],0)
        self.assertGreater(result.counts['filtered'],0)  # GGA stayed on the PC.
        self.assertNotIn(self.key,'\n'.join(logs))
        position=self.store.snapshot()['positions'][0]
        self.assertEqual((position['source'],position['id'],position['protocol']),('gps','gps1','nmea0183'))
        self.assertAlmostEqual(position['lat'],35.0,places=2)

    def test_pseudo_serial_gps_over_tcp(self):self.relay(udp=False)

    def test_pseudo_serial_gps_over_udp(self):self.relay(udp=True)


if __name__=='__main__':unittest.main()
