"""Catalog lifecycle and same-origin API integration (no external services)."""
import json
import sqlite3
import sys
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'))
from presets import PresetStore, PresetConflict
from engine import InputError

class PresetTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.db=Path(self.tmp.name)/'catalog.sqlite3'
        self.store=PresetStore(lambda:sqlite3.connect(self.db))
    def tearDown(self):self.tmp.cleanup()
    def edit(self,**data):return self.store.edit(dict(revision=self.store.snapshot()['revision'],**data))
    def test_seed_migration_and_deletion_persist(self):
        first=self.store.snapshot()
        self.assertEqual(len(first['presets']),30)
        for region in ['北米','東アジア','ヨーロッパ']:
            self.assertGreaterEqual(sum(p['region']==region for p in first['presets']),7)
        tokyo=next(p for p in first['presets'] if p['id']=='default-tokyo')
        self.edit(action='save',preset=dict(tokyo,name='東京カスタム',lat=35.1))
        self.edit(action='delete',id='default-london')
        reopened=PresetStore(lambda:sqlite3.connect(self.db)).snapshot()
        self.assertEqual(next(p for p in reopened['presets'] if p['id']==tokyo['id'])['lat'],35.1)
        self.assertNotIn('default-london',[p['id'] for p in reopened['presets']])
        self.assertEqual(len(reopened['antennas']),17)
    def test_edit_conflict_validation_and_shared_revision(self):
        revision=self.store.snapshot()['revision']
        self.edit(collection='antennas',action='save',preset=dict(id='custom',name='カスタム',model='whip',gain=3.5))
        with self.assertRaises(PresetConflict):
            self.store.edit(dict(revision=revision,action='delete',id='default-tokyo'))
        for p in [dict(name='bad',lat=True,lon=0),dict(name='bad',lat=90,lon=0),dict(name='bad',lat=0,lon=0,kind='mobile')]:
            with self.assertRaises(InputError):self.edit(action='save',preset=p)
        for p in [dict(name='bad',model='imaginary'),dict(name='bad',gain=31)]:
            with self.assertRaises(InputError):self.edit(collection='antennas',action='save',preset=p)
        with self.assertRaises(InputError):self.edit(action='save',preset=dict(name='東京',lat=1,lon=2))
        self.assertEqual(next(p for p in self.store.snapshot()['antennas'] if p['id']=='custom')['gain'],3.5)
    def test_public_references_dimensions_and_non_reseeding(self):
        rows={p['id']:p for p in self.store.snapshot()['antennas']}
        self.assertEqual(rows['reference-usn-as2537c']['length_m'],10.668)
        self.assertEqual(rows['reference-marine-at83']['length_m'],8)
        self.assertTrue(rows['reference-air-chelton455']['reference_only'])
        self.assertTrue(rows['reference-air-p3-longwire']['reference_only'])
        self.assertIsNone(rows['reference-air-p3-longwire']['length_m'])
        self.assertEqual(rows['standard-dipole-20']['height_m'],10)
        self.edit(collection='antennas',action='delete',id='reference-marine-at83')
        self.edit(collection='antennas',action='save',preset=dict(rows['standard-whip-5'],name='Edited whip',length_m=6))
        after={p['id']:p for p in self.store.snapshot()['antennas']}
        self.assertNotIn('reference-marine-at83',after)
        self.assertEqual(after['standard-whip-5']['length_m'],6)
    def test_mobile_auto_registration_is_idempotent_and_deletion_is_respected(self):
        p=dict(source='ais',id='ship1',name='船舶',lat=35,lon=139,stale=False,prediction_compatible=True)
        self.assertEqual(self.store.sync_mobile([dict(p,stale=True)])['imported'],0)
        self.assertEqual(self.store.sync_mobile([dict(p,prediction_compatible=False)])['imported'],0)
        self.assertEqual(self.store.sync_mobile([p])['imported'],1)
        revision=self.store.snapshot()['revision']
        self.assertEqual(self.store.sync_mobile([dict(p,lat=34)])['imported'],0)
        self.assertEqual(self.store.snapshot()['revision'],revision)
        row=next(r for r in self.store.snapshot()['presets'] if r['kind']=='mobile')
        self.assertEqual(row['position_ref'],dict(source='ais',id='ship1'))
        self.edit(action='save',preset=dict(row,name='編集した船舶'))
        self.assertEqual(self.store.sync_mobile([p])['imported'],0)
        self.edit(action='delete',id=row['id'])
        self.assertEqual(self.store.sync_mobile([p])['imported'],0)
        self.edit(action='save',preset=row) # Explicit manual restoration is supported.
        self.assertEqual(self.store.sync_mobile([p])['imported'],0)
    def test_catalog_http(self):
        import server
        with patch.object(server,'DB',self.db):
            http=server.ThreadingHTTPServer(('127.0.0.1',0),server.Handler)
            thread=threading.Thread(target=http.serve_forever,daemon=True);thread.start()
            url=f'http://127.0.0.1:{http.server_port}'
            def request(data=None,origin=None):
                headers={'Content-Type':'application/json'}
                if origin:headers['Origin']=origin
                return json.load(urllib.request.urlopen(urllib.request.Request(url+'/api/presets',headers=headers,data=json.dumps(data).encode() if data is not None else None)))
            try:
                catalog=request()
                body=dict(action='save',revision=catalog['revision'],collection='antennas',preset=dict(name='APIアンテナ',model='isotropic',gain=-2))
                saved=request(body)
                self.assertEqual(saved['revision'],catalog['revision']+1)
                for data,origin,status in [(body,None,409),({},None,400),(body,'https://other.example',403)]:
                    with self.assertRaises(urllib.error.HTTPError) as e:request(data,origin)
                    self.assertEqual(e.exception.code,status)
                p=dict(source='gps',id='car',name='車両',lat=35,lon=139,stale=False,prediction_compatible=True)
                with patch.object(server.POSITIONS,'snapshot',return_value=dict(positions=[p])):
                    self.assertEqual(request(dict(action='sync_mobile'))['imported'],1)
                self.assertTrue(any(r['name']=='APIアンテナ' for r in request()['antennas']))
            finally:http.shutdown();http.server_close();thread.join()

if __name__=='__main__':unittest.main()
