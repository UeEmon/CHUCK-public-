"""Gateway contract v1. No wire-format decoders or storage dependencies."""
import copy
from datetime import datetime, timezone
import math
import re
import time
from engine import InputError

SCHEMA_VERSION=1
POSITIONS_PATH='/internal/v1/positions'
STATIONS_PATH='/internal/v1/stations'


def identifier(value, field):
    if not isinstance(value,str) or not re.fullmatch(r'[A-Za-z0-9_.:-]{1,64}',value):
        raise InputError(field+': 半角英数字と _ . : - の1〜64文字で指定してください')
    return value


def numeric(value, field, low, high):
    if isinstance(value,bool) or not isinstance(value,(int,float)) or not low<=value<=high or not math.isfinite(value):
        raise InputError(field+': 有限の数値を指定してください（'+str(low)+'〜'+str(high)+'）')
    return float(value)


def utc(value):
    if not isinstance(value,str) or 'T' not in value: raise InputError('タイムゾーン付きISO日時が必要です')
    try:
        dt=datetime.fromisoformat(value.replace('Z','+00:00'))
        if dt.tzinfo is None: raise ValueError()
        stamp=dt.timestamp()
        return stamp,datetime.fromtimestamp(stamp,timezone.utc).isoformat()
    except (ValueError,OverflowError): raise InputError('タイムゾーン付きISO日時が不正です')


def text(value, field, maximum):
    if not isinstance(value,str) or not 1<=len(value)<=maximum or not value.isprintable():
        raise InputError(field+': 表示可能な文字列が必要です')


def validate_snapshot(snapshot):
    if not isinstance(snapshot,dict) or type(snapshot.get('schema_version')) is not int or snapshot['schema_version']!=SCHEMA_VERSION:
        raise InputError('未対応の位置連接スキーマ版です')
    if type(snapshot.get('max_age_seconds')) is not int or not 10<=snapshot['max_age_seconds']<=86400:
        raise InputError('位置有効期限の設定が不正です')
    utc(snapshot.get('server_time'))
    if type(snapshot.get('ingest_enabled')) is not bool: raise InputError('受信状態が不正です')
    for key in ('positions','stations','protocols'):
        if not isinstance(snapshot.get(key),list) or len(snapshot[key])>2000: raise InputError('共通位置一覧が不正です')
    # Protocol names are opaque capabilities. New gateway adapters do not
    # require a new decoder, enum or release in the prediction application.
    for protocol in snapshot['protocols']: text(protocol,'protocol',64)
    seen=set()
    for p in snapshot['positions']:
        if not isinstance(p,dict): raise InputError('共通位置レコードが不正です')
        identity=(identifier(p.get('source'),'source'),identifier(p.get('id'),'id'))
        if identity in seen: raise InputError('共通位置レコードの識別子が重複しています')
        seen.add(identity)
        text(p.get('name'),'name',80)
        if p.get('kind') not in ('vessel','aircraft','vehicle'): raise InputError('局種別が不正です')
        lat=numeric(p.get('lat'),'lat',-90,90);numeric(p.get('lon'),'lon',-180,180)
        for key,low,high in [('speed_knots',0,3000),('course_deg',0,360),('altitude_m',-1000,100000)]:
            if key not in p: raise InputError('共通位置フィールドが不足しています: '+key)
            if p[key] is not None: numeric(p[key],key,low,high)
        if p['course_deg'] is not None and p['course_deg']>=360: raise InputError('針路は360未満です')
        if p.get('altitude_reference') not in ('unknown','msl','wgs84_ellipsoid','pressure'): raise InputError('高度基準が不正です')
        observed=utc(p.get('observed_at'))[0];expires=utc(p.get('expires_at'))[0];utc(p.get('received_at'))
        if abs(expires-observed-snapshot['max_age_seconds'])>0.01: raise InputError('観測時刻と有効期限が一致しません')
        numeric(p.get('age_seconds'),'age_seconds',-1e12,1e12)
        if type(p.get('stale')) is not bool or type(p.get('prediction_compatible')) is not bool:
            raise InputError('位置品質の状態が不正です')
        if p['prediction_compatible']!=(abs(lat)<=89): raise InputError('予測緯度範囲の判定が不正です')
        text(p.get('protocol'),'protocol',64)
    for s in snapshot['stations']:
        if not isinstance(s,dict): raise InputError('局設定が不正です')
        identifier(s.get('source'),'source');identifier(s.get('id'),'id');text(s.get('name'),'name',80)
        text(s.get('protocol'),'protocol',64)
        if s.get('kind') not in ('vessel','aircraft','vehicle') or type(s.get('enabled')) is not bool:
            raise InputError('局設定の種別・状態が不正です')
    return snapshot


def has_references(data):
    return any(k in data for k in ('tx_position','rx_position')) or (
        isinstance(data.get('rx_sites'),list) and any(isinstance(s,dict) and 'position_ref' in s for s in data['rx_sites']))


def apply_snapshot(data, snapshot, now=None):
    now=time.time() if now is None else now
    data=copy.deepcopy(data)
    inputs={}
    index={(p['source'],p['id']):p for p in snapshot['positions']}
    def resolve(ref):
        if not isinstance(ref,dict): raise InputError('位置参照はsource/idオブジェクトで指定してください')
        source,key=identifier(ref.get('source'),'source'),identifier(ref.get('id'),'id')
        p=index.get((source,key))
        if p is None: raise InputError('位置情報がありません: '+source+'/'+key)
        if p['stale'] or utc(p['expires_at'])[0]<now: raise InputError('位置情報が期限切れです: '+source+'/'+key)
        if not p['prediction_compatible']: raise InputError('予測エンジンの緯度範囲±89°を超えています')
        return p
    for prefix in ('tx','rx'):
        if prefix+'_position' in data:
            p=resolve(data[prefix+'_position'])
            data[prefix+'_lat'],data[prefix+'_lon']=p['lat'],p['lon'];inputs[prefix]=p
    if isinstance(data.get('rx_sites'),list):
        for i,site in enumerate(data['rx_sites']):
            if isinstance(site,dict) and 'position_ref' in site:
                p=resolve(site['position_ref']);site.update(lat=p['lat'],lon=p['lon']);inputs['rx_site_'+str(i+1)]=p
    return data,inputs
