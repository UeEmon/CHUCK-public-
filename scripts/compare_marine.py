"""Compare CHUCK with values read from the VOACAP Online Marine service under matching settings.

The Marine values are copied by hand (or by a browser operator) into
docs/validation/marine-cases.json; this script never contacts the Marine site.
"""
from pathlib import Path
import argparse, json, os, sys, tempfile, threading
from urllib.request import Request,urlopen

REPO=Path(__file__).resolve().parents[1]
CASES=REPO/'docs'/'validation'/'marine-cases.json'
OUT=REPO/'dist'/'marine-comparison'
sys.path.insert(0,str(REPO/'app'))
METRICS={'rel':'reliability','snr':'snr_db_hz','sdbw':'signal_dbw','muf':'muf_mhz'}

def chuck_value(app,hour,frequency,metric):
    h=next(x for x in app['hours'] if x['hour_utc']==hour)
    if metric=='muf':return h['muf_mhz']
    row=next((r for r in h['rows'] if abs(r['frequency_mhz']-frequency)<1e-6),None)
    if row is None:raise SystemExit(f'{frequency} MHz is not in the CHUCK request')
    return row[METRICS[metric]]

def compare(case,app):
    # marine: {"rel": {"UTC hour": {"MHz": value}}, "snr"/"sdbw": {...}, "muf": {"UTC hour": value}}
    marine=case.get('marine') or {};points=[];per={}
    for metric in METRICS:
        table=marine.get(metric) or {}
        for hour,values in table.items():
            for frequency,value in (values.items() if isinstance(values,dict) else [(None,values)]):
                ours=chuck_value(app,int(hour)%24,None if frequency is None else float(frequency),metric)
                points.append(dict(metric=metric,hour_utc=int(hour)%24,frequency_mhz=None if frequency is None else float(frequency),
                    marine=value,chuck=ours,difference=None if value is None or ours is None else round(ours-value,3)))
    for metric in METRICS:
        d=[p['difference'] for p in points if p['metric']==metric and p['difference'] is not None]
        nulls=sum(1 for p in points if p['metric']==metric and (p['marine'] is None)!=(p['chuck'] is None))
        if d or nulls:per[metric]=dict(points=len(d),null_mismatches=nulls,max_absolute=max(map(abs,d),default=None),
            mean=round(sum(d)/len(d),3) if d else None,mean_absolute=round(sum(map(abs,d))/len(d),3) if d else None)
    return points,per

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cases',type=Path,default=CASES)
    parser.add_argument('--output-dir',type=Path,default=OUT)
    parser.add_argument('--require-complete',action='store_true',help='exit 1 when a case has no Marine values yet')
    args=parser.parse_args()
    for key in ['VOACAP_BIN','VOACAP_MODEL']:
        if not os.environ.get(key):parser.error(key+' must point to a built native engine/model')
    spec=json.loads(args.cases.read_text());out=args.output_dir.resolve();out.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='chuck-marine-') as tmp:
        os.environ['DATA_DIR']=tmp
        import server
        http=server.ThreadingHTTPServer(('127.0.0.1',0),server.Handler)
        thread=threading.Thread(target=http.serve_forever,daemon=True);thread.start()
        summary=[]
        try:
            for case in spec['cases']:
                p=dict(spec.get('defaults',{}),**case['parameters'])
                req=Request(f'http://127.0.0.1:{http.server_port}/api/predict',data=json.dumps(p).encode(),headers={'Content-Type':'application/json'})
                with urlopen(req,timeout=90) as r:app=json.load(r)
                (out/(case['id']+'-chuck.json')).write_text(json.dumps(app,ensure_ascii=False,indent=2))
                points,per=compare(case,app)
                summary.append(dict(case=case['id'],description=case.get('description',''),parameters=app['parameters'],
                    marine_settings=(case.get('marine') or {}).get('settings'),marine_retrieved=(case.get('marine') or {}).get('retrieved'),
                    has_marine_values=bool(points),statistics=per,points=points))
        finally:http.shutdown();http.server_close();thread.join()
    result={'comparison':'CHUCK HTTP API vs values read from VOACAP Online Marine (https://www.voacap.com/marine/)',
        'engine':'voacapl 0.7.7','cases':summary,'missing_marine_values':[c['case'] for c in summary if not c['has_marine_values']]}
    (out/'summary.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
    # The record in docs/ keeps the statistics and the largest differences, not every point.
    record=dict(result,cases=[dict({k:v for k,v in c.items() if k!='points'},largest_rel_differences=sorted(
        (p for p in c['points'] if p['metric']=='rel' and p['difference'] is not None),key=lambda p:-abs(p['difference']))[:10]) for c in summary])
    (out/'record.json').write_text(json.dumps(record,ensure_ascii=False,indent=1))
    for c in summary:
        print(c['case'],'no Marine values yet' if not c['has_marine_values'] else
            ' '.join(f"{m}: n={s['points']} max|d|={s['max_absolute']} mean d={s['mean']}" for m,s in c['statistics'].items()))
    if args.require_complete and result['missing_marine_values']:raise SystemExit(1)

if __name__=='__main__':main()
