"""Shared location and antenna catalogs; edits are atomic and revisioned."""
from contextlib import closing
import json
import uuid
import hashlib
from urllib.parse import urlsplit
from engine import InputError, ANTENNAS, antenna_parameters
from position_contract import identifier, numeric

# Archived copy: the maker's site serves an expired self-signed certificate.
P3_SOURCE='https://web.archive.org/web/20260516023653/https://www.asbavionics.com/asb-avionics-develops-hf-shunt-antenna-for-p3.html'

DEFAULTS=[('yokosuka','横須賀',35.30,139.67),('naha','那覇',26.21,127.68),('chichijima','父島',27.09,142.19),
          ('guam','グアム',13.45,144.75),('honolulu','ホノルル',21.31,-157.86),
          ('singapore','シンガポール',1.29,103.85),('sydney','シドニー',-33.87,151.21)]
CITIES={
 '北米':[('new-york','ニューヨーク',40.71,-74.01),('washington','ワシントンDC',38.91,-77.04),('los-angeles','ロサンゼルス',34.05,-118.24),('san-francisco','サンフランシスコ',37.77,-122.42),('seattle','シアトル',47.61,-122.33),('toronto','トロント',43.65,-79.38),('vancouver','バンクーバー',49.28,-123.12),('mexico-city','メキシコシティ',19.43,-99.13)],
 '東アジア':[('tokyo','東京',35.68,139.76),('osaka','大阪',34.69,135.50),('seoul','ソウル',37.57,126.98),('beijing','北京',39.90,116.41),('shanghai','上海',31.23,121.47),('taipei','台北',25.03,121.57),('hong-kong','香港',22.32,114.17)],
 'ヨーロッパ':[('london','ロンドン',51.51,-0.13),('paris','パリ',48.86,2.35),('berlin','ベルリン',52.52,13.41),('rome','ローマ',41.90,12.50),('madrid','マドリード',40.42,-3.70),('brussels','ブリュッセル',50.85,4.35),('helsinki','ヘルシンキ',60.17,24.94),('stockholm','ストックホルム',59.33,18.07)]}


class PresetConflict(RuntimeError):
    pass


def validate_preset(data, collection='locations'):
    if not isinstance(data,dict): raise InputError('presetオブジェクトが必要です')
    key=identifier(data.get('id',uuid.uuid4().hex),'id')
    name=data.get('name')
    if not isinstance(name,str) or not 1<=len(name.strip())<=40 or not name.isprintable():
        raise InputError('局名は表示可能な1〜40文字で指定してください')
    p=dict(id=key,name=name.strip())
    if collection=='antennas':
        model=data.get('model','whip')
        if not isinstance(model,str) or model not in ANTENNAS: raise InputError('基準アンテナモデルが不正です')
        p.update(model=model,gain=numeric(data.get('gain',0),'gain',-20,30),**antenna_parameters(data,model))
        if type(data.get('reference_only',False)) is not bool:raise InputError('reference_onlyはtrue/falseです')
        p['reference_only']=data.get('reference_only',False)
        doc=data.get('document_ref')
        if doc is not None:
            if not isinstance(doc,dict) or doc.get('reviewed') is not True:raise InputError('OCRの原本・単位・数値の確認が必要です')
            key_doc=doc.get('id');index=doc.get('candidate_index')
            if not isinstance(key_doc,str) or len(key_doc)!=32 or any(ch not in '0123456789abcdef' for ch in key_doc) or type(index) is not int or not 0<=index<10:raise InputError('document_refが不正です')
            ack=doc.get('approximation_ack',False)
            if type(ack) is not bool or (not p['reference_only'] and not ack):raise InputError('実機特性ではなく近似モデルであることの確認が必要です')
            p['document_ref']=dict(id=key_doc,candidate_index=index,reviewed=True,approximation_ack=ack)
        ref=data.get('reference')
        if ref is not None:
            if not isinstance(ref,dict):raise InputError('referenceが不正です')
            clean={}
            for field,limit in [('operator',40),('designation',64),('checked_on',10),('notes',500)]:
                value=ref.get(field)
                if not isinstance(value,str) or not 1<=len(value)<=limit or not value.isprintable():raise InputError('reference.'+field+'が不正です')
                clean[field]=value
            sources=ref.get('sources')
            if not isinstance(sources,list) or not 1<=len(sources)<=3:raise InputError('source URLが必要です')
            for url in sources:
                if not isinstance(url,str) or len(url)>2048:raise InputError('source URLが不正です')
                parsed=urlsplit(url)
                if parsed.scheme!='https' or not parsed.hostname or parsed.username or parsed.password:raise InputError('source URLはHTTPSです')
            p['reference']=dict(clean,sources=sources)
        return p
    kind=data.get('kind','fixed')
    if kind not in ('fixed','mobile'): raise InputError('地点種別はfixed/mobileです')
    region=data.get('region','その他')
    if not isinstance(region,str) or not 1<=len(region)<=40 or not region.isprintable(): raise InputError('地域名が不正です')
    p.update(kind=kind,region=region,lat=numeric(data.get('lat'),'lat',-89,89),lon=numeric(data.get('lon'),'lon',-180,180))
    if kind=='mobile':
        ref=data.get('position_ref')
        if not isinstance(ref,dict): raise InputError('移動局には受信局のposition_refが必要です')
        p['position_ref']=dict(source=identifier(ref.get('source'),'source'),id=identifier(ref.get('id'),'id'))
    return p


class PresetStore:
    def __init__(self, connection): self.connection=connection

    def connect(self):
        c=self.connection()
        try:
            c.execute('CREATE TABLE IF NOT EXISTS station_presets (id TEXT PRIMARY KEY, payload TEXT NOT NULL)')
            c.execute('CREATE TABLE IF NOT EXISTS station_presets_meta (id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL)')
            c.execute('CREATE TABLE IF NOT EXISTS antenna_presets (id TEXT PRIMARY KEY, payload TEXT NOT NULL)')
            c.execute('CREATE TABLE IF NOT EXISTS preset_migrations (id TEXT PRIMARY KEY)')
            c.execute('BEGIN IMMEDIATE')
            created=c.execute('INSERT OR IGNORE INTO station_presets_meta VALUES (1,0)').rowcount
            seeded=c.execute("INSERT OR IGNORE INTO preset_migrations VALUES ('cities-and-antennas-v1')").rowcount
            if seeded:
                for region,rows in dict(CITIES,その他=DEFAULTS).items():
                    for key,name,lat,lon in rows:
                        p=validate_preset(dict(id='default-'+key,name=name,lat=lat,lon=lon,region=region))
                        c.execute('INSERT OR IGNORE INTO station_presets VALUES (?,?)',(p['id'],json.dumps(p,ensure_ascii=False)))
                for key,name,model in [('builtin-whip','標準ホイップ','whip'),('builtin-isotropic','等方性基準','isotropic')]:
                    p=validate_preset(dict(id=key,name=name,model=model,gain=0),'antennas')
                    c.execute('INSERT OR IGNORE INTO antenna_presets VALUES (?,?)',(p['id'],json.dumps(p,ensure_ascii=False)))
                if not created:c.execute('UPDATE station_presets_meta SET revision=revision+1 WHERE id=1')
            if c.execute("INSERT OR IGNORE INTO preset_migrations VALUES ('antenna-dimensions-v1')").rowcount:
                examples=[
                    ('whip-24','垂直ホイップ 2.4 m','monopole',2.4,0),
                    ('whip-5','垂直ホイップ 5 m','monopole',5,0),
                    ('whip-7','垂直ホイップ 7 m','monopole',7,0),
                    ('whip-10','垂直ホイップ 10 m','monopole',10,0),
                    ('gp-5','グランドプレーン 5 m','monopole',5,0),
                    ('dipole-10','水平ダイポール 全長10 m','dipole',10,10),
                    ('dipole-20','水平ダイポール 全長20 m','dipole',20,10),
                    ('dipole-40','水平ダイポール 全長40 m','dipole',40,15),
                    ('vertical-10','垂直ダイポール 全長10 m','vertical_dipole',10,7.5),
                    ('vertical-20','垂直ダイポール 全長20 m','vertical_dipole',20,15)]
                names={json.loads(r[0])['name'] for r in c.execute('SELECT payload FROM antenna_presets')}
                for key,name,model,length,height in examples:
                    # Keep pre-existing edited names/IDs intact, even on upgrade.
                    if name in names or len(names)>=200:continue
                    p=validate_preset(dict(id='standard-'+key,name=name,model=model,length_m=length,height_m=height),'antennas')
                    c.execute('INSERT OR IGNORE INTO antenna_presets VALUES (?,?)',(p['id'],json.dumps(p,ensure_ascii=False)))
                    names.add(name)
                if not created:c.execute('UPDATE station_presets_meta SET revision=revision+1 WHERE id=1')
            if c.execute("INSERT OR IGNORE INTO preset_migrations VALUES ('naval-public-references-v1')").rowcount:
                references=[
                    dict(id='reference-usn-as2537c',name='USN AS-2537C/SR（寸法近似）',model='monopole',length_m=10.668,
                         reference=dict(operator='US Navy',designation='AS-2537C/SR',checked_on='2026-10-15',
                           notes='米海軍使用はメーカー公表。35 ft全高を単一モノポール長として近似。実放射素子長・基部・整合器・艦体・効率・実測利得は再現しない。地面定数は利用者の仮定。',
                           sources=['https://www.valcommfg.ca/as-2537c-sr']))]
                for item in references:
                    name=item['name']
                    if c.execute('SELECT COUNT(*) FROM antenna_presets').fetchone()[0]>=200:break
                    if c.execute("SELECT 1 FROM antenna_presets WHERE json_extract(payload,'$.name')=?",(name,)).fetchone():continue
                    p=validate_preset(item,'antennas')
                    c.execute('INSERT OR IGNORE INTO antenna_presets VALUES (?,?)',(p['id'],json.dumps(p,ensure_ascii=False)))
                if not created:c.execute('UPDATE station_presets_meta SET revision=revision+1 WHERE id=1')
            if c.execute("INSERT OR IGNORE INTO preset_migrations VALUES ('airborne-marine-references-v1')").rowcount:
                references=[
                    dict(id='reference-marine-at100d',name='艦船 Comrod AT100D（寸法近似）',model='monopole',length_m=10,
                         reference=dict(operator='Shipboard product',designation='AT100D',checked_on='2026-10-15',
                           notes='メーカー公表の甲板設置HFモノポール、全高10 mを近似に使用。1.6–30 MHz。艦体・整合器・損失・実測パターンは未再現。特定国への採用は未確認。',
                           sources=['https://www.comrod.com/product/10-m-33-ft-hf-two-piece-sectional-whip-monopole-end-feed-1-6-30-mhz-at100d/'])),
                    dict(id='reference-marine-at83',name='艦船 Comrod AT83（寸法近似）',model='monopole',length_m=8,
                         reference=dict(operator='Shipboard product',designation='AT83 series',checked_on='2026-10-15',
                           notes='メーカー公表のHF艦船ホイップ。物理全高8 m（電気長7.5 mとは区別）をモノポール近似に使用。1.6–30 MHz。艦体・整合器・給電方式・損失・実測パターンは未再現。特定国への採用は未確認。',
                           sources=['https://www.comrod.com/wp-content/uploads/AT83-Series.pdf'])),
                    dict(id='reference-air-chelton455',name='航空機 Chelton 455（参考資料）',model='whip',reference_only=True,
                         reference=dict(operator='Airborne product',designation='Chelton 455 series',checked_on='2026-10-15',
                           notes='固定翼・回転翼用HFタオルレール型、2–30 MHz。効率・偏波・放射パターンは取付けと機体に依存。共通の全長・機体込みパターン未取得のため計算選択不可。特定国・機種への採用は未確認。',
                           sources=['https://www.chelton.com/product/hf-towel-rail-antenna-array-455-series/','https://cdn.chelton.com/datasheets/chelton-435-465-455-485-towel-rail-antenna-arrays.pdf']))]
                for item in references:
                    if c.execute('SELECT COUNT(*) FROM antenna_presets').fetchone()[0]>=200:break
                    if c.execute("SELECT 1 FROM antenna_presets WHERE json_extract(payload,'$.name')=?",(item['name'],)).fetchone():continue
                    p=validate_preset(item,'antennas')
                    c.execute('INSERT OR IGNORE INTO antenna_presets VALUES (?,?)',(p['id'],json.dumps(p,ensure_ascii=False)))
                if not created:c.execute('UPDATE station_presets_meta SET revision=revision+1 WHERE id=1')
            if c.execute("INSERT OR IGNORE INTO preset_migrations VALUES ('p3-long-wire-reference-v1')").rowcount:
                name='P-3 HFロングワイヤー（参考資料）'
                if c.execute('SELECT COUNT(*) FROM antenna_presets').fetchone()[0]<200 and not c.execute("SELECT 1 FROM antenna_presets WHERE json_extract(payload,'$.name')=?",(name,)).fetchone():
                    item=dict(id='reference-air-p3-longwire',name=name,model='whip',reference_only=True,
                              reference=dict(operator='P-3 family (public reference)',designation='P-3 dual HF long-wire',checked_on='2026-10-16',
                                notes='メーカーのP-3用シャント改修説明で従来の2本式HFロングワイヤーを確認。全長・給電条件・機体込み実測指向性は未確認。2本を1本の全長として合算しない。各派生機の仕様や現在の搭載状態は断定しない。計算選択不可。',
                                sources=[P3_SOURCE]))
                    p=validate_preset(item,'antennas')
                    c.execute('INSERT OR IGNORE INTO antenna_presets VALUES (?,?)',(p['id'],json.dumps(p,ensure_ascii=False)))
                if not created:c.execute('UPDATE station_presets_meta SET revision=revision+1 WHERE id=1')
            if c.execute("INSERT OR IGNORE INTO preset_migrations VALUES ('p3-source-archive-v1')").rowcount:
                # ASB's own site serves an expired self-signed certificate, so browsers warn; point to the archived copy.
                changed=False
                for key,payload in c.execute('SELECT id,payload FROM antenna_presets').fetchall():
                    item=json.loads(payload);ref=item.get('reference') or {}
                    if 'https://www.asbavionics.com/asb-avionics-develops-hf-shunt-antenna-for-p3.html' not in ref.get('sources',[]):continue
                    ref['sources']=[P3_SOURCE if u=='https://www.asbavionics.com/asb-avionics-develops-hf-shunt-antenna-for-p3.html' else u for u in ref['sources']]
                    c.execute('UPDATE antenna_presets SET payload=? WHERE id=?',(json.dumps(item,ensure_ascii=False),key));changed=True
                if changed and not created:c.execute('UPDATE station_presets_meta SET revision=revision+1 WHERE id=1')
            if c.execute("INSERT OR IGNORE INTO preset_migrations VALUES ('dipole-path-azimuth-v1')").rowcount:
                # Standard horizontal dipoles were seeded facing north; aim untouched
                # seeds at the other station. Edited copies keep their bearing.
                seeds={'standard-dipole-10':('水平ダイポール 全長10 m',10,10),'standard-dipole-20':('水平ダイポール 全長20 m',20,10),
                       'standard-dipole-40':('水平ダイポール 全長40 m',40,15)}
                changed=False
                for key,(name,length,height) in seeds.items():
                    row=c.execute('SELECT payload FROM antenna_presets WHERE id=?',(key,)).fetchone()
                    if not row:continue
                    p=validate_preset(json.loads(row[0]),'antennas')
                    if p!=validate_preset(dict(id=key,name=name,model='dipole',length_m=length,height_m=height),'antennas'):continue
                    p['azimuth_mode']='path'
                    c.execute('UPDATE antenna_presets SET payload=? WHERE id=?',(json.dumps(p,ensure_ascii=False),key))
                    changed=True
                if changed and not created:c.execute('UPDATE station_presets_meta SET revision=revision+1 WHERE id=1')
            if c.execute("INSERT OR IGNORE INTO preset_migrations VALUES ('wire-directional-standards-v1')").rowcount:
                items=[dict(id='standard-lpda-25',name='水平ログペリ 最長25 m・16素子',model='log_periodic',length_m=25,height_m=20,azimuth_mode='path'),
                       dict(id='standard-inverted-l-30',name='逆L 水平部30 m・垂直部12 m',model='inverted_l',length_m=30,height_m=12),
                       dict(id='standard-sloper-40',name='スローパー 40 m・傾斜15°',model='sloping_long_wire',length_m=40,height_m=2,lw_slope_deg=15,azimuth_mode='path')]
                added=False
                for item in items:
                    if c.execute('SELECT COUNT(*) FROM antenna_presets').fetchone()[0]>=200:break
                    if c.execute("SELECT 1 FROM antenna_presets WHERE json_extract(payload,'$.name')=?",(item['name'],)).fetchone():continue
                    p=validate_preset(item,'antennas')
                    c.execute('INSERT OR IGNORE INTO antenna_presets VALUES (?,?)',(p['id'],json.dumps(p,ensure_ascii=False)))
                    added=True
                if added and not created:c.execute('UPDATE station_presets_meta SET revision=revision+1 WHERE id=1')
            c.commit()
            return c
        except Exception:
            c.rollback();c.close();raise

    def snapshot(self):
        with closing(self.connect()) as c, c:
            c.execute('BEGIN')
            revision=c.execute('SELECT revision FROM station_presets_meta WHERE id=1').fetchone()[0]
            rows=c.execute('SELECT payload FROM station_presets ORDER BY rowid').fetchall()
            antennas=c.execute('SELECT payload FROM antenna_presets ORDER BY rowid').fetchall()
        return dict(revision=revision,presets=[validate_preset(json.loads(row[0])) for row in rows],antennas=[validate_preset(json.loads(row[0]),'antennas') for row in antennas])

    def sync_mobile(self, positions):
        imported=0
        with closing(self.connect()) as c,c:
            c.execute('BEGIN IMMEDIATE')
            current=[json.loads(row[0]) for row in c.execute('SELECT payload FROM station_presets')]
            names={p['name'] for p in current}
            refs={(p['position_ref']['source'],p['position_ref']['id']) for p in current if p.get('position_ref')}
            for row in positions:
                if row['stale'] or not row['prediction_compatible'] or len(current)+imported>=200:continue
                identity=(row['source'],row['id'])
                key='mobile-'+hashlib.sha256((identity[0]+'\0'+identity[1]).encode()).hexdigest()[:24]
                seen='seen-'+key
                if identity in refs or c.execute('SELECT 1 FROM preset_migrations WHERE id=?',(seen,)).fetchone():continue
                name=row['name'][:40]
                if name in names:name=name[:25]+' ['+key[-8:]+']'
                p=validate_preset(dict(id=key,name=name,kind='mobile',region='移動局',lat=row['lat'],lon=row['lon'],position_ref=dict(source=identity[0],id=identity[1])))
                c.execute('INSERT INTO station_presets VALUES (?,?)',(key,json.dumps(p,ensure_ascii=False)))
                c.execute('INSERT INTO preset_migrations VALUES (?)',(seen,))
                names.add(name);refs.add(identity);imported+=1
            if imported:c.execute('UPDATE station_presets_meta SET revision=revision+1 WHERE id=1')
        return dict(imported=imported)

    def edit(self, data):
        if not isinstance(data,dict) or type(data.get('revision')) is not int or data['revision']<0:
            raise InputError('取得したrevision整数が必要です')
        action=data.get('action')
        collection=data.get('collection','locations')
        if collection not in ('locations','antennas'): raise InputError('collectionが不正です')
        table='antenna_presets' if collection=='antennas' else 'station_presets'
        if action not in ('save','delete'): raise InputError('actionはsave/deleteです')
        p=validate_preset(data.get('preset'),collection) if action=='save' else None
        key=p['id'] if p else identifier(data.get('id'),'id')
        with closing(self.connect()) as c, c:
            c.execute('BEGIN IMMEDIATE')
            current=c.execute('SELECT revision FROM station_presets_meta WHERE id=1').fetchone()[0]
            if current!=data['revision']: raise PresetConflict('別の画面で変更されています。一覧を再読込してから保存してください。')
            if action=='save':
                if p.get('document_ref'):
                    doc=p['document_ref']
                    if not c.execute("SELECT name FROM sqlite_master WHERE name='antenna_documents'").fetchone():raise InputError('取込資料がありません')
                    row=c.execute('SELECT extraction FROM antenna_documents WHERE id=?',(doc['id'],)).fetchone()
                    if not row or doc['candidate_index']>=len(json.loads(row[0])['candidates']):raise InputError('取込資料の候補がありません')
                duplicate=c.execute("SELECT id FROM "+table+" WHERE json_extract(payload,'$.name')=? AND id<>?",(p['name'],key)).fetchone()
                if duplicate: raise InputError('同じ局名が登録されています')
                c.execute('INSERT INTO '+table+' VALUES (?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload',(key,json.dumps(p,ensure_ascii=False,allow_nan=False)))
                if c.execute('SELECT COUNT(*) FROM '+table).fetchone()[0]>200: raise InputError('各プリセットは最大200件です')
            else:
                if not c.execute('DELETE FROM '+table+' WHERE id=?',(key,)).rowcount: raise InputError('指定されたプリセットがありません')
            c.execute('UPDATE station_presets_meta SET revision=revision+1 WHERE id=1')
        # Return the exact result of this committed operation; a subsequent GET
        # refreshes the collection (and may include another client's changes).
        return dict(revision=current+1,id=key)
