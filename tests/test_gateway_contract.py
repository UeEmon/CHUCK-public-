import copy
import json
import os
from pathlib import Path
import sqlite3
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'))
from position_contract import validate_snapshot,POSITIONS_PATH,STATIONS_PATH
from gateway_client import GatewayClient,GatewayError
from positions import PositionStore
from test_positions import rmc,report


class GatewayContractTests(unittest.TestCase):
    def snapshot(self):
        with tempfile.TemporaryDirectory() as directory:
            store=PositionStore(lambda:sqlite3.connect(Path(directory)/'positions.sqlite3'))
            store.ingest(report(1800000000),1800000000)
            return dict(store.snapshot(1800000000),schema_version=1,ingest_enabled=True)

    def test_application_client_does_not_load_external_adapters(self):
        root=Path(__file__).resolve().parents[1]
        result=subprocess.run([sys.executable,'-c',"import sys;sys.path.insert(0,sys.argv[1]);import gateway_client;assert 'positions' not in sys.modules;assert 'gateway_server' not in sys.modules",str(root/'app')],capture_output=True,text=True)
        self.assertEqual(result.returncode,0,result.stderr)

    def test_three_external_formats_share_one_position_model(self):
        normalized=[]
        for protocol in ('json','geojson','nmea0183'):
            with tempfile.TemporaryDirectory() as directory:
                store=PositionStore(lambda:sqlite3.connect(Path(directory)/'positions.sqlite3'))
                store.configure(dict(source='gateway',id='ship-1',name='試験船',kind='vessel',protocol=protocol))
                p=report(1800000000);p['positions'][0].update(lat=35,lon=139.5,speed_knots=10,course_deg=90)
                if protocol=='nmea0183':store.ingest_nmea('gateway','ship-1',rmc(1800000000),1800000000)
                elif protocol=='geojson':
                    store.ingest(dict(type='FeatureCollection',source='gateway',features=[dict(type='Feature',properties=p['positions'][0],geometry=dict(type='Point',coordinates=[139.5,35]))]),1800000000)
                else:store.ingest(p,1800000000)
                snapshot=dict(store.snapshot(1800000000),schema_version=1,ingest_enabled=True)
                validate_snapshot(snapshot)
                row=snapshot['positions'][0]
                normalized.append({k:v for k,v in row.items() if k!='protocol'})
        self.assertEqual(normalized[0],normalized[1]);self.assertEqual(normalized[1],normalized[2])

    def test_invalid_common_records_are_rejected_as_gateway_errors(self):
        original=self.snapshot()
        for field,value in [('lat',True),('lon',float('nan')),('expires_at','bad'),('speed_knots',-1),('prediction_compatible',False)]:
            snapshot=copy.deepcopy(original);snapshot['positions'][0][field]=value
            with self.subTest(field=field),patch.object(GatewayClient,'request',return_value=snapshot):
                with self.assertRaises(GatewayError):GatewayClient().snapshot()
        for version in (2,True,'1'):
            with patch.object(GatewayClient,'request',return_value=dict(original,schema_version=version)):
                with self.assertRaises(GatewayError):GatewayClient().snapshot()
        duplicate=copy.deepcopy(original);duplicate['positions']*=2
        with patch.object(GatewayClient,'request',return_value=duplicate):
            with self.assertRaises(GatewayError):GatewayClient().snapshot()

    def test_new_adapter_name_needs_no_application_enum_change(self):
        snapshot=self.snapshot();snapshot['protocols'].append('future-adapter')
        snapshot['positions'][0]['protocol']='future-adapter';snapshot['stations'][0]['protocol']='future-adapter'
        with patch.object(GatewayClient,'request',return_value=snapshot):
            self.assertEqual(GatewayClient().snapshot()['positions'][0]['lat'],0)

    def test_client_uses_only_versioned_internal_routes(self):
        client=GatewayClient()
        with patch.object(client,'request',return_value=self.snapshot()) as request:
            client.snapshot();self.assertEqual(request.call_args.args,(POSITIONS_PATH,))
            client.configure(dict(source='gps',id='car'))
            self.assertEqual(request.call_args.args[0],STATIONS_PATH)


if __name__=='__main__':unittest.main()
