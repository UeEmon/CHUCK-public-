"""Rank candidate receive or relay sites of one transmitter by the hours they reach the target REL."""
from engine import InputError, validate, distance, ENGINE_COMMIT

MAX_CANDIDATES = 10
MODES = ('receive', 'relay')
NOTE = ('候補地点ごとに独立した地点間予測を計算し、目標REL以上になる時間数の多い順に並べます（同数なら平均RELの高い順）。'
        '受信地点ではRX1のアンテナ・雑音を候補地点に置いた場合を計算します。'
        '中継地点ではTX→候補地点と候補地点→RX1の両区間を計算し、同じ時刻に両区間とも目標REL以上なら中継できるとします。'
        '中継局はRX1のアンテナで受信し、TXのアンテナと送信電力で再送信すると仮定します。'
        '中継の遅延・送受信切替・混信、地形や設置条件は考慮しません。')


def prepare(data):
    mode = data.get('site_mode', 'receive')
    if mode not in MODES: raise InputError('site_mode: 設定値が不正です')
    rows = data.get('candidates')
    if not isinstance(rows, list) or not 1 <= len(rows) <= MAX_CANDIDATES:
        raise InputError(f'候補地点は1〜{MAX_CANDIDATES}か所で指定してください')
    out = []
    for row in rows:
        if not isinstance(row, dict): raise InputError('候補地点の形式が不正です')
        name = row.get('name')
        if not isinstance(name, str) or not name.strip() or len(name.strip()) > 40:
            raise InputError('候補地点の名称は1〜40文字で指定してください')
        identifier = row.get('id', '')
        if not isinstance(identifier, str) or len(identifier) > 64: raise InputError('候補地点の形式が不正です')
        lat, lon = row.get('lat'), row.get('lon')
        if not all(isinstance(v, (int, float)) and not isinstance(v, bool) for v in (lat, lon)) or not (-89 <= lat <= 89 and -180 <= lon <= 180):
            raise InputError('候補地点の緯度・経度が範囲外です')
        out.append(dict(id=identifier, name=name.strip(), lat=float(lat), lon=float(lon)))
    return out, mode


def best(row_list):
    # Same rule as the recommended frequency: highest REL, then highest SNR.
    top = None
    for v in row_list:
        if v.get('reliability') is None: continue
        if top is None or v['reliability'] > top['reliability'] or (v['reliability'] == top['reliability'] and (v.get('snr_db_hz') or -999) > (top.get('snr_db_hz') or -999)):
            top = v
    return top


def evaluate(engine, p, c, mode):
    entry = dict(c, distance_tx_km=round(distance(p['tx_lat'], p['tx_lon'], c['lat'], c['lon']), 1))
    if mode == 'relay': entry['distance_rx_km'] = round(distance(c['lat'], c['lon'], p['rx_lat'], p['rx_lon']), 1)
    if entry['distance_tx_km'] < 1 or entry.get('distance_rx_km', 1) < 1:
        return dict(entry, skipped='TXまたはRX1と同じ地点のため計算しません', hours=[], hours_meeting=None, mean_reliability=None)
    legs = [engine.run(validate(dict(p, rx_lat=c['lat'], rx_lon=c['lon'])))['hours']]
    if mode == 'relay': legs.append(engine.run(validate(dict(p, tx_lat=c['lat'], tx_lon=c['lon'])))['hours'])
    hours = []
    for parts in zip(*legs):
        picks = [best(h['rows']) for h in parts]
        rel = None if any(v is None for v in picks) else min(v['reliability'] for v in picks)
        hours.append(dict(hour_utc=parts[0]['hour_utc'], reliability=rel,
                          frequencies=[v['frequency_mhz'] if v else None for v in picks]))
    known = [h['reliability'] for h in hours if h['reliability'] is not None]
    return dict(entry, hours=hours, hours_meeting=sum(r >= p['reliability'] for r in known),
                mean_reliability=round(sum(known)/len(known), 1) if known else None)


def predict(engine, p, candidates, mode):
    rows = [evaluate(engine, p, c, mode) for c in candidates]
    rows.sort(key=lambda r: (r['hours_meeting'] is None, -(r['hours_meeting'] or 0), -(r['mean_reliability'] or 0)))
    for i, r in enumerate(rows, 1): r['rank'] = None if r['hours_meeting'] is None else i
    return dict(kind='sites', parameters=p, site_mode=mode, candidates=rows, note=NOTE,
                engine='voacapl 0.7.7', engine_commit=ENGINE_COMMIT)
