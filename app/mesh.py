"""Directed link forecasts between every pair of mesh nodes."""
from engine import validate, number, InputError, ENGINE_COMMIT, distance, ANTENNA_FIELDS

MAX_SITES = 8
NOTE = ('RELは各経路・UTC・周波数の月間統計です。VOACAPは送受信を入れ替えると'
        'アンテナ・送信電力・受信雑音が変わるため、行（TX）と列（RX）の有向経路を別々に計算します。'
        '中継（多段ホップ）の到達性・同時送信の干渉・チャネル割当・経路間の相関はモデル化していません。'
        '経路ごとの生出力は保存しません。必要な場合は単一RXで再計算してください。')


def endpoint(site, data, prefix):
    """Raw TX/RX fields of one node, falling back to the shared form values."""
    q = {prefix+'_lat': site.get('lat'), prefix+'_lon': site.get('lon'),
         prefix+'_antenna': site.get('antenna', data.get(prefix+'_antenna', 'whip')),
         prefix+'_gain': site.get('gain', data.get(prefix+'_gain', 0)),
         prefix+'_polarization': site.get('polarization', data.get(prefix+'_polarization', 'model'))}
    q.update({prefix+'_'+key: site[key] for key in ANTENNA_FIELDS if key in site})
    return q


def prepare(data):
    raw = data.get('mesh_sites')
    if not isinstance(raw, list) or not 2 <= len(raw) <= MAX_SITES:
        raise InputError(f'mesh_sites: 拠点を2〜{MAX_SITES}地点指定してください')
    if any(not isinstance(site, dict) for site in raw):
        raise InputError('拠点はJSONオブジェクトで指定してください')
    sites = []
    names = set()
    for i, site in enumerate(raw):
        name = site.get('name', 'N'+str(i+1))
        if not isinstance(name, str) or not name.strip() or len(name) > 40 or any(ord(c) < 32 for c in name):
            raise InputError('拠点名は制御文字を含まない1〜40文字で指定してください')
        name = name.strip()
        if name in names:
            raise InputError('拠点名は重複しないように指定してください')
        names.add(name)
        # Validate this node as TX towards its neighbour; the node fields are the same as RX.
        other = raw[(i+1) % len(raw)]
        q = dict(data, **endpoint(site, data, 'tx'), **endpoint(other, data, 'rx'),
                 power_w=site.get('power_w', data.get('power_w', 1000)))
        if data.get('ssn_source') in ('noaa', 'effective'):
            q['ssn'] = 0  # Validate all nodes before accessing external data.
        try:
            p = validate(q)
        except InputError as e:
            raise InputError(name+': '+str(e))
        noise = number(dict(noise=site.get('noise', data.get('noise', 150))), 'noise', 100, 180)
        sites.append(dict(id='n'+str(i+1), name=name, lat=p['tx_lat'], lon=p['tx_lon'],
                          antenna=p['tx_antenna'], gain=p['tx_gain'], noise=noise,
                          power_w=p['power_w'], polarization=p['tx_polarization'],
                          **{key: p['tx_'+key] for key in ANTENNA_FIELDS}))
        if 'position_ref' in site: sites[-1]['position_ref'] = site['position_ref']
    for i, a in enumerate(sites):
        for b in sites[i+1:]:
            if distance(a['lat'], a['lon'], b['lat'], b['lon']) < 1:
                raise InputError(f'拠点を1 km以上離してください: {a["name"]} / {b["name"]}')
    return sites


def pair(p, tx, rx):
    """Calculation parameters for the directed link tx → rx."""
    q = dict(p, power_w=tx['power_w'], noise=rx['noise'])
    for prefix, site in (('tx', tx), ('rx', rx)):
        q.update({prefix+'_lat': site['lat'], prefix+'_lon': site['lon'], prefix+'_antenna': site['antenna'],
                  prefix+'_gain': site['gain'], prefix+'_polarization': site['polarization']})
        q.update({prefix+'_'+key: site[key] for key in ANTENNA_FIELDS})
    q = validate(q)
    q['ssn_source'] = p.get('ssn_source', 'manual')
    return q


def predict(engine, p, sites):
    links = []
    for tx in sites:
        for rx in sites:
            if tx is rx: continue
            r = engine.run(pair(p, tx, rx))
            links.append(dict(tx_id=tx['id'], rx_id=rx['id'], distance_km=r.get('distance_km'),
                              bearing_deg=r.get('bearing_deg'), hours=r['hours']))
    parameters = dict(p, mesh_sites=sites)
    for key in ('tx_position', 'rx_position'): parameters.pop(key, None)
    return dict(kind='mesh', parameters=parameters, sites=sites, links=links, note=NOTE,
                engine='voacapl 0.7.7', engine_commit=ENGINE_COMMIT)
