"""Offline-first local web application; Python standard library only."""
import csv
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import io
import json
import mimetypes
import os
import secrets
from pathlib import Path
import sqlite3
import threading
from urllib.parse import urlparse, parse_qs
import uuid
from engine import Engine, InputError, EngineError, validate, number, distance

from space_weather import SpaceWeather, SpaceWeatherError
from observations import Observations, GIRO_STATIONS
from effective_ssn import EffectiveSSN, EffectiveSSNError
import diversity
import mesh
from gateway_client import GatewayClient, GatewayError
from presets import PresetStore, PresetConflict
from antenna_ocr import DocumentStore, OCRError, OCRBusy, config as ocr_config, MAX_FILE
import ai_providers

BASE=Path(__file__).parent
DATA=Path(os.environ.get('DATA_DIR','./data'))
DATA.mkdir(parents=True,exist_ok=True)
DB=DATA/'predictions.sqlite3'
ENGINE=Engine()
SPACE_WEATHER=SpaceWeather(DATA/'space-weather')
OBSERVATIONS=Observations(DATA/'observations',os.environ.get('HF_GIRO_ENABLED','0')=='1')
EFFECTIVE_SSN=EffectiveSSN(ENGINE,OBSERVATIONS)
RUN_LOCK=threading.Lock()

def connection():
    c=sqlite3.connect(DB,timeout=15)
    c.execute('CREATE TABLE IF NOT EXISTS predictions (id TEXT PRIMARY KEY, created TEXT NOT NULL, kind TEXT NOT NULL, result TEXT NOT NULL)')
    return c

POSITIONS=GatewayClient()
PRESETS=PresetStore(connection)
ANTENNA_DOCUMENTS=DocumentStore(connection)

def save(result,kind='point'):
    result['id']=uuid.uuid4().hex
    result['created']=datetime.now(timezone.utc).isoformat()
    with connection() as c:
        c.execute('INSERT INTO predictions VALUES (?,?,?,?)',(result['id'],result['created'],kind,json.dumps(result,allow_nan=False)))
    return result

def load(identifier):
    with connection() as c:
        row=c.execute('SELECT result FROM predictions WHERE id=?',(identifier,)).fetchone()
    if not row: raise InputError('指定された履歴がありません')
    return json.loads(row[0])

def coverage(p, extra):
    # A regional sample grid, not interpolated coverage contours.
    lat=number(extra,'center_lat',-70,70,p['rx_lat'])
    lon=number(extra,'center_lon',-180,180,p['rx_lon'])
    span=number(extra,'span',10,120,60)
    hour=number(extra,'hour_utc',0,23,12,integer=True)
    frequency=number(extra,'frequency_mhz',2,30,8)
    points=[]
    for y in range(5):
        for x in range(7):
            a=max(-89,min(89,lat+(y-2)*span/4))
            b=(lon+(x-3)*span/6+180)%360-180
            q=dict(p,rx_lat=a,rx_lon=b,frequencies=[frequency])
            if distance(p['tx_lat'],p['tx_lon'],a,b)<1: continue
            r=ENGINE.run(q,hour)['hours'][0]['rows'][0]
            points.append(dict(lat=a,lon=b,**r))
    return {'parameters':p,'coverage':points,'hour_utc':hour,'frequency_mhz':frequency,'span':span,'center_lat':lat,'center_lon':lon,'engine':'voacapl 0.7.7','engine_commit':__import__('engine').ENGINE_COMMIT}

class Handler(BaseHTTPRequestHandler):
    def send(self,code,body,content_type='application/json; charset=utf-8',filename=None):
        if not isinstance(body,bytes): body=body.encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type',content_type)
        self.send_header('Content-Length',str(len(body)))
        self.send_header('X-Content-Type-Options','nosniff')
        self.send_header('Cache-Control','no-store')
        if code==401: self.send_header('WWW-Authenticate','Bearer')
        if filename: self.send_header('Content-Disposition',f'attachment; filename="{filename}"')
        self.end_headers()
        self.wfile.write(body)
    def json(self,code,obj): self.send(code,json.dumps(obj,ensure_ascii=False,allow_nan=False))
    def do_GET(self):
        path=urlparse(self.path).path
        try:
            if path=='/api/ai-settings':return self.json(200,ai_providers.SETTINGS.snapshot())
            if path=='/api/antenna-imports':return self.json(200,dict(ocr_config(),documents=ANTENNA_DOCUMENTS.list()))
            if path.startswith('/api/antenna-imports/'):
                parts=path.split('/')
                item=ANTENNA_DOCUMENTS.get(parts[3],content=len(parts)==5 and parts[4]=='source')
                if len(parts)==4:return self.json(200,item)
                if len(parts)==5 and parts[4]=='source':
                    ext={'application/pdf':'pdf','image/png':'png','image/jpeg':'jpg','image/webp':'webp'}[item['media_type']]
                    return self.send(200,item['content'],item['media_type'],item['id']+'.'+ext)
                raise InputError('資料が見つかりません')
            if path=='/api/health':
                return self.json(200,{'ok':ENGINE.ready(),'engine':'voacapl 0.7.7'})
            if path=='/api/positions':
                return self.json(200,POSITIONS.snapshot())
            if path=='/api/presets':
                return self.json(200,PRESETS.snapshot())
            if path=='/api/observations':
                return self.json(200,OBSERVATIONS.snapshot(force=parse_qs(urlparse(self.path).query).get('refresh')==['1']))
            if path=='/api/observations/giro':
                code=parse_qs(urlparse(self.path).query).get('station',['JR055'])[0]
                if code not in GIRO_STATIONS: raise InputError('海外観測局が不正です')
                return self.json(200,OBSERVATIONS.giro(code,force=parse_qs(urlparse(self.path).query).get('refresh')==['1']))
            if path=='/api/space-weather':
                query=parse_qs(urlparse(self.path).query)
                now=datetime.now(timezone.utc)
                date={k:query.get(k,[v])[0] for k,v in [('year',now.year),('month',now.month)]}
                year=number(date,'year',1900,2100,integer=True)
                month=number(date,'month',1,12,integer=True)
                return self.json(200,SPACE_WEATHER.snapshot(year,month,force=query.get('refresh')==['1']))
            if path=='/api/effective-ssn':
                query=parse_qs(urlparse(self.path).query)
                now=datetime.now(timezone.utc)
                date={k:query.get(k,[v])[0] for k,v in [('year',now.year),('month',now.month)]}
                year=number(date,'year',1900,2100,integer=True)
                month=number(date,'month',1,12,integer=True)
                return self.json(200,EFFECTIVE_SSN.snapshot(year,month,force=query.get('refresh')==['1']))
            if path=='/api/history':
                with connection() as c: rows=c.execute('SELECT id,created,kind,json_extract(result,\'$.parameters\') FROM predictions ORDER BY created DESC LIMIT 100').fetchall()
                return self.json(200,[dict(id=r[0],created=r[1],kind=r[2],parameters=json.loads(r[3])) for r in rows])
            if path.startswith('/api/results/'):
                pieces=path.split('/')
                r=load(pieces[3])
                if len(pieces)==4: return self.json(200,r)
                if len(pieces)==5:
                    ext=pieces[4]
                    if ext=='json': return self.send(200,json.dumps(r,ensure_ascii=False,indent=2),'application/json; charset=utf-8',r['id']+'.json')
                    if ext in ('raw','input') and 'hours' in r:
                        return self.send(200,r['raw_output' if ext=='raw' else 'input_cards'],'text/plain; charset=utf-8',r['id']+'.'+('out' if ext=='raw' else 'dat'))
                    if ext=='csv':
                        output=io.StringIO()
                        w=csv.writer(output)
                        # Metadata before data makes exported calculations reproducible.
                        w.writerow(['# parameters',json.dumps(r['parameters'],ensure_ascii=False)])
                        if 'space_weather' in r: w.writerow(['# space_weather',json.dumps(r['space_weather'],ensure_ascii=False)])
                        if 'effective_ssn' in r: w.writerow(['# effective_ssn',json.dumps(r['effective_ssn'],ensure_ascii=False)])
                        if 'position_inputs' in r: w.writerow(['# position_inputs',json.dumps(r['position_inputs'],ensure_ascii=False)])
                        w.writerow(['# engine',r['engine'],r['engine_commit']])
                        if r.get('kind') == 'rx_diversity':
                            w.writerow(['# diversity_note',r['note']])
                            w.writerow(['# independence_assumption',r['independence_assumption']])
                            w.writerow(['UTC','MHz','site_id','site_name','REL_percent','SNR_dBHz','S_dBW','MUF_MHz','best_site_id','union_lower_percent','union_upper_percent','independent_scenario_percent','complete','sites_meeting_target'])
                            summary={(h['hour_utc'],v['frequency_mhz']):v for h in r['diversity_hours'] for v in h['rows']}
                            for site in r['sites']:
                                for h in site['hours']:
                                    for v in h['rows']:
                                        s=summary[(h['hour_utc'],v['frequency_mhz'])]
                                        name=site['name']
                                        if name.startswith(('=','+','-','@')): name="'"+name
                                        w.writerow([h['hour_utc'],v['frequency_mhz'],site['id'],name,v.get('reliability'),v.get('snr_db_hz'),v.get('signal_dbw'),h['muf_mhz'],s['best_site_id'],s['union_lower_percent'],s['union_upper_percent'],s['independent_scenario_percent'],s['complete'],s['sites_meeting_target']])
                        elif r.get('kind') == 'mesh':
                            w.writerow(['# mesh_note',r['note']])
                            w.writerow(['UTC','MHz','tx_id','tx_name','rx_id','rx_name','REL_percent','SNR_dBHz','S_dBW','TOA_deg','MUF_MHz','distance_km','meets_target'])
                            names={s['id']:s['name'] if not s['name'].startswith(('=','+','-','@')) else "'"+s['name'] for s in r['sites']}
                            for link in r['links']:
                                for h in link['hours']:
                                    for v in h['rows']:
                                        rel=v.get('reliability')
                                        w.writerow([h['hour_utc'],v['frequency_mhz'],link['tx_id'],names[link['tx_id']],link['rx_id'],names[link['rx_id']],rel,v.get('snr_db_hz'),v.get('signal_dbw'),v.get('takeoff_deg'),h['muf_mhz'],link['distance_km'],rel is not None and rel>=r['parameters']['reliability']])
                        elif 'hours' in r:
                            w.writerow(['UTC','MHz','REL_percent','SNR_dBHz','S_dBW','TOA_deg','MUF_MHz'])
                            for h in r['hours']:
                                for v in h['rows']: w.writerow([h['hour_utc'],v['frequency_mhz'],v.get('reliability'),v.get('snr_db_hz'),v.get('signal_dbw'),v.get('takeoff_deg'),h['muf_mhz']])
                        else:
                            w.writerow(['latitude','longitude','UTC','MHz','REL_percent','SNR_dBHz'])
                            for v in r['coverage']: w.writerow([v['lat'],v['lon'],r['hour_utc'],v['frequency_mhz'],v.get('reliability'),v.get('snr_db_hz')])
                        return self.send(200,'\ufeff'+output.getvalue(),'text/csv; charset=utf-8',r['id']+'.csv')
                return self.json(404,{'error':'出力形式がありません'})
            name='index.html' if path=='/' else path.lstrip('/')
            file=(BASE/'static'/name).resolve()
            if not file.is_relative_to((BASE/'static').resolve()) or not file.is_file():
                return self.json(404,{'error':'見つかりません'})
            return self.send(200,file.read_bytes(),mimetypes.guess_type(str(file))[0] or 'application/octet-stream')
        except (GatewayError,ai_providers.AIError,EngineError) as e: self.json(503,{'error':str(e)})
        except InputError as e: self.json(400 if path in ('/api/space-weather','/api/effective-ssn','/api/observations/giro') else 404,{'error':str(e)})
        except Exception:
            __import__('traceback').print_exc()
            self.json(500,{'error':'読み込みに失敗しました。サーバーログを確認してください。'})
    def do_POST(self):
        path=urlparse(self.path).path
        if path in ('/api/ai-settings','/api/ai-settings/models'):return self.configure_ai(path)
        if path in ('/api/positions','/api/positions/nmea'):
            return self.json(410,{'error':'外部位置入力は位置ゲートウェイ（既定ポート18083）へ送信してください'})
        if path=='/api/position-stations': return self.configure_position_station()
        if path=='/api/presets': return self.edit_presets()
        if path=='/api/antenna-imports' or path.startswith('/api/antenna-imports/'):return self.import_antenna(path)
        if path not in ('/api/predict','/api/coverage','/api/diversity','/api/mesh'): return self.json(404,{'error':'見つかりません'})
        # Local app has no authentication: forbid cross-origin form / fetch writes.
        origin=self.headers.get('Origin')
        if origin and origin not in ('http://'+self.headers.get('Host',''),'https://'+self.headers.get('Host','')):
            return self.json(403,{'error':'異なるオリジンからの計算要求は受け付けません'})
        if not self.headers.get('Content-Type','').startswith('application/json'):
            return self.json(415,{'error':'application/json が必要です'})
        locked=False
        try:
            length=int(self.headers.get('Content-Length','0'))
            if not 0<length<=16384: raise InputError('リクエストサイズが不正です')
            data=json.loads(self.rfile.read(length))
            if not isinstance(data,dict): raise InputError('JSONオブジェクトが必要です')
            if path=='/api/diversity': data.pop('rx_position',None)
            if path=='/api/mesh':
                for key in ('tx_position','rx_position','rx_sites'): data.pop(key,None)
            else: data.pop('mesh_sites',None)
            data,position_inputs=POSITIONS.apply(data)
            if path=='/api/coverage' and 'rx_position' in data:
                data.update(center_lat=data['rx_lat'],center_lon=data['rx_lon'])
            sites,independent=diversity.prepare(data) if path=='/api/diversity' else (None,False)
            if sites:
                first=sites[0]
                data=dict(data,rx_lat=first['lat'],rx_lon=first['lon'],rx_antenna=first['antenna'],rx_gain=first['gain'],noise=first['noise'])
                data.update({'rx_'+key:first[key] for key in __import__('engine').ANTENNA_FIELDS})
            nodes=mesh.prepare(data) if path=='/api/mesh' else None
            if nodes:
                data=dict(data,**mesh.endpoint(nodes[0],data,'tx'),**mesh.endpoint(nodes[1],data,'rx'),power_w=nodes[0]['power_w'],noise=nodes[1]['noise'])
            p=validate(dict(data,ssn=0) if data.get('ssn_source') in ('noaa','effective') else data)
            weather=effective=None
            if data.get('ssn_source')=='effective':
                prepared,effective=EFFECTIVE_SSN.calculation_input(dict(data,year=p['year'],month=p['month']))
            else:
                prepared,weather=SPACE_WEATHER.calculation_input(dict(data,year=p['year'],month=p['month']))
            p=validate(prepared)
            p['ssn_source']=data.get('ssn_source','manual')
            for key in ('tx_position','rx_position'):
                if key in data: p[key]=data[key]
            locked=RUN_LOCK.acquire(blocking=False)
            if not locked: return self.json(409,{'error':'別の計算を実行中です。完了後に再実行してください。'})
            if any(datetime.fromisoformat(v['expires_at']) < datetime.now(timezone.utc) for v in position_inputs.values()):
                raise InputError('採用した位置情報が準備中に期限切れになりました。再計算してください。')
            r=mesh.predict(ENGINE,p,nodes) if nodes else diversity.predict(ENGINE,p,sites,independent) if sites else ENGINE.run(p) if path=='/api/predict' else coverage(p,data)
            if weather is not None: r['space_weather']=weather
            if effective is not None: r['effective_ssn']=effective
            if position_inputs: r['position_inputs']=position_inputs
            if isinstance(data.get('ui_selection'),dict): r['ui_selection']=data['ui_selection']
            self.json(200,save(r,'mesh' if nodes else 'rx_diversity' if sites else 'point' if path=='/api/predict' else 'coverage'))
        except (InputError,ValueError,UnicodeError) as e: self.json(400,{'error':str(e)})
        except (EngineError,SpaceWeatherError,EffectiveSSNError) as e: self.json(503,{'error':str(e)})
        except Exception:
            __import__('traceback').print_exc()
            self.json(500,{'error':'計算に失敗しました。サーバーログを確認してください。'})
        finally:
            if locked: RUN_LOCK.release()

    def configure_ai(self,path):
        if self.headers.get('Origin') not in ('http://'+self.headers.get('Host',''),'https://'+self.headers.get('Host','')):return self.json(403,dict(error='同一オリジンの画面から操作してください'))
        if self.headers.get('Content-Type','').split(';')[0].strip()!='application/json':return self.json(415,dict(error='application/jsonが必要です'))
        try:
            size=int(self.headers.get('Content-Length','0'))
            if not 0<size<=16384:raise InputError('AI settings request is too large')
            data=json.loads(self.rfile.read(size))
            if not isinstance(data,dict):raise InputError('AI settings object required')
            if path.endswith('/models'):
                cfg=ai_providers.SETTINGS.resolve(data.get('provider'),data)
                return self.json(200,ai_providers.list_models(cfg))
            self.json(200,ai_providers.SETTINGS.save(data))
        except ai_providers.SettingsConflict as e:self.json(409,dict(error=str(e)))
        except ai_providers.AIError as e:self.json(502,dict(error=str(e)))
        except (InputError,ValueError,UnicodeError) as e:self.json(400,dict(error=str(e)))
        except Exception:
            self.json(500,dict(error='AI設定を保存できませんでした'))

    def import_antenna(self,path):
        # A paid external processing request requires the exact browser Origin.
        if self.headers.get('Origin') not in ('http://'+self.headers.get('Host',''),'https://'+self.headers.get('Host','')):
            return self.json(403,dict(error='同一オリジンの画面から操作してください'))
        if self.headers.get('Content-Type','').split(';')[0].strip()!='application/json':return self.json(415,dict(error='application/jsonが必要です'))
        try:
            size=int(self.headers.get('Content-Length','0'))
            limit=((MAX_FILE+2)//3)*4+8192 if path=='/api/antenna-imports' else 1024
            if not 0<size<=limit:raise InputError('資料は8 MiB以下です')
            data=json.loads(self.rfile.read(size))
            if path=='/api/antenna-imports':return self.json(200,ANTENNA_DOCUMENTS.import_file(data))
            parts=path.split('/')
            if len(parts)==5 and parts[4]=='delete':
                ANTENNA_DOCUMENTS.delete(parts[3]);return self.json(200,dict(deleted=True))
            return self.json(404,dict(error='見つかりません'))
        except OCRBusy as e:self.json(409,dict(error=str(e)))
        except OCRError as e:self.json(502,dict(error=str(e)))
        except (InputError,ValueError,UnicodeError) as e:self.json(400,dict(error=str(e)))
        except Exception:
            __import__('traceback').print_exc();self.json(500,dict(error='資料の取り込みに失敗しました'))

    def edit_presets(self):
        origin=self.headers.get('Origin')
        if origin and origin not in ('http://'+self.headers.get('Host',''),'https://'+self.headers.get('Host','')):
            return self.json(403,{'error':'異なるオリジンからの保存は受け付けません'})
        if not self.headers.get('Content-Type','').startswith('application/json'):
            return self.json(415,{'error':'application/jsonが必要です'})
        try:
            length=int(self.headers.get('Content-Length','0'))
            if not 0<length<=8192: raise InputError('プリセット要求の上限は8 KiBです')
            data=json.loads(self.rfile.read(length))
            if isinstance(data,dict) and data.get('action')=='sync_mobile':
                return self.json(200,PRESETS.sync_mobile(POSITIONS.snapshot()['positions']))
            self.json(200,PRESETS.edit(data))
        except GatewayError as e: self.json(503,{'error':str(e)})
        except PresetConflict as e: self.json(409,{'error':str(e)})
        except (InputError,ValueError,UnicodeError) as e: self.json(400,{'error':str(e)})
        except Exception:
            __import__('traceback').print_exc();self.json(500,{'error':'プリセットを保存できません'})

    def configure_position_station(self):
        # Configuration uses the same local UI trust model as prediction setup.
        origin=self.headers.get('Origin')
        token=os.environ.get('HF_POSITION_GATEWAY_TOKEN','')
        bearer=len(token)>=32 and secrets.compare_digest(self.headers.get('Authorization','').encode(),('Bearer '+token).encode())
        if not bearer and origin not in ('http://'+self.headers.get('Host',''),'https://'+self.headers.get('Host','')):
            return self.json(403,{'error':'局設定は同一オリジンの画面または認証済みクライアントから行ってください'})
        if not self.headers.get('Content-Type','').startswith('application/json'): return self.json(415,{'error':'application/jsonが必要です'})
        try:
            length=int(self.headers.get('Content-Length','0'))
            if not 0<length<=4096: raise InputError('局設定の上限は4 KiBです')
            self.json(200,POSITIONS.configure(json.loads(self.rfile.read(length))))
        except GatewayError as e: self.json(503,{'error':str(e)})
        except (InputError,ValueError,UnicodeError) as e: self.json(400,{'error':str(e)})
        except Exception:
            __import__('traceback').print_exc()
            self.json(500,{'error':'局設定の保存に失敗しました'})

if __name__=='__main__':
    connection().close()
    print('HF Propagation JP: http://localhost:18082',flush=True)
    ThreadingHTTPServer(('0.0.0.0',8000),Handler).serve_forever()
