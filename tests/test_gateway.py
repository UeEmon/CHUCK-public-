import json
from pathlib import Path
import sqlite3
import sys
import tempfile
import time
from datetime import datetime,timezone
import unittest
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'))
from gateway_client import GatewayClient, GatewayError
from positions import PositionStore
from migrate_positions import migrate


class GatewayTests(unittest.TestCase):
    def test_offline_gateway_only_blocks_referenced_positions(self):
        client=GatewayClient('http://127.0.0.1:1','c'*40)
        with patch.object(client,'request',side_effect=GatewayError('offline')):
            self.assertEqual(client.apply(dict(tx_lat=35)),(dict(tx_lat=35),{}))
            with self.assertRaises(GatewayError): client.apply(dict(tx_position=dict(source='gps',id='one')))

    def test_missing_token_url_and_malformed_snapshot(self):
        for url,token in [('http://127.0.0.1',''),('http://user:password@127.0.0.1','c'*40),('file:///tmp/data','c'*40)]:
            with self.assertRaises(GatewayError): GatewayClient(url,token).snapshot()
        with patch.object(GatewayClient,'request',return_value={'positions':None}):
            with self.assertRaises(GatewayError): GatewayClient().snapshot()

    def test_migration_preserves_original_and_never_overwrites(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);old=root/'legacy.sqlite3';new=root/'gateway.sqlite3'
            store=PositionStore(lambda:sqlite3.connect(old))
            store.configure(dict(source='gps',id='car',kind='vehicle',protocol='nmea0183'))
            store.ingest(dict(source='legacy',positions=[dict(id='ship',kind='vessel',lat=35,lon=140,observed_at=datetime.now(timezone.utc).isoformat())]))
            with sqlite3.connect(old) as c:
                c.execute('CREATE TABLE predictions (private TEXT)');c.execute("INSERT INTO predictions VALUES ('retain')")
            before=old.read_bytes()
            self.assertEqual(migrate(old,new),dict(positions=1,stations=2))
            self.assertEqual(old.read_bytes(),before)
            with sqlite3.connect(new) as c:
                self.assertEqual(c.execute('SELECT COUNT(*) FROM position_stations').fetchone()[0],2)
                self.assertEqual(json.loads(c.execute('SELECT payload FROM positions').fetchone()[0])['id'],'ship')
                self.assertIsNone(c.execute("SELECT name FROM sqlite_master WHERE name='predictions'").fetchone())
            with self.assertRaises(RuntimeError): migrate(old,new)
