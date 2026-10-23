"""Compare CHUCK HTTP output against a separate direct VOACAP invocation."""
from pathlib import Path
import argparse, json, os, sys, tempfile, shutil, subprocess, threading
from urllib.request import Request,urlopen

REPO=Path(__file__).resolve().parents[1]
OUT=REPO/'dist'/'voacap-comparison'
sys.path.insert(0,str(REPO/'app'))
METRICS={'REL':'reliability','SNR':'snr_db_hz','S DBW':'signal_dbw','TANGLE':'takeoff_deg'}

def independent_parse(raw,frequencies):
    result={};current=None
    for line in raw.splitlines():
        s=line.strip()
        if s.endswith(' FREQ'):
            values=s[:-5].split();current=int(float(values[0]))%24
            result[current]={'muf_mhz':float(values[1]),'rows':[{'frequency_mhz':f} for f in frequencies]}
        elif current is not None:
            for label,key in METRICS.items():
                if s.endswith(' '+label):
                    values=s[:-len(label)].split()
                    for i,row in enumerate(result[current]['rows']):
                        try:value=float(values[i+1])
                        except ValueError:value=None
                        row[key]=round(value*100,1) if label=='REL' and value is not None else value
    assert len(result)==24
    return result

def direct(cards,tag,mode=None):
    model=Path(os.environ['VOACAP_MODEL'])
    with tempfile.TemporaryDirectory(prefix='vc-',dir='/tmp') as t:
        root=Path(t)/'m';root.mkdir()
        for name in ['coeffs','geocity','geonatio','geostate']:(root/name).symlink_to(model/name,target_is_directory=True)
        for name in ['database','antennas']:shutil.copytree(model/name,root/name)
        (root/'run').mkdir();(root/'run/voacapx.dat').write_text(cards)
        cp=subprocess.run([os.environ['VOACAP_BIN'],*(['--absorption-mode='+mode] if mode else []),'-s',str(root)],cwd=t,capture_output=True,text=True,timeout=60)
        assert cp.returncode==0,cp.stderr
        raw=(root/'run/voacapx.out').read_text()
    (OUT/(tag+'-direct-input.dat')).write_text(cards)
    (OUT/(tag+'-direct-output.out')).write_text(raw)
    return raw

def manual_cards(p):
    # Separate fixed-card construction: no CHUCK cards/validate/parse functions.
    coordinates=''.join(f'{abs(p[k]):{width}.2f}{pos if p[k]>=0 else neg}' for k,width,pos,neg in
        [('tx_lat',5,'N','S'),('tx_lon',9,'E','W'),('rx_lat',9,'N','S'),('rx_lon',9,'E','W')])
    lines=['COMMENT   Independent VOACAP comparison','LINEMAX     999','COEFFS    CCIR','TIME          1   24    1    1',
        'MONTH      202610.00','SUNSPOT    80.0','LABEL     TX                  RX',f'CIRCUIT   {coordinates}  S     0',
        'SYSTEM     1.00  150 3.00   9040.00 3.00 0.10','FPROB      1.00 1.00 1.00 0.00',
        'ANTENNA       1    1    2   30     0.000[default/swwhip.voa   ]  0.0  0.150000',
        'ANTENNA       2    2    2   30     0.000[default/swwhip.voa   ]  0.0  0.000000',
        'FREQUENCY $'+''.join(f'{f:6.3f}' for f in p['frequencies']+[0]*6),'METHOD       30    0','EXECUTE','QUIT']
    return '\n'.join(lines)+'\n'

def main():
    global OUT
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-dir',type=Path,default=OUT)
    args=parser.parse_args()
    for key in ['VOACAP_BIN','VOACAP_MODEL']:
        if not os.environ.get(key):parser.error(key+' must point to a built native engine/model')
    OUT=args.output_dir.resolve();OUT.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='chuck-compare-') as tmp:
        os.environ['DATA_DIR']=tmp
        import server
        http=server.ThreadingHTTPServer(('127.0.0.1',0),server.Handler)
        thread=threading.Thread(target=http.serve_forever,daemon=True);thread.start()
        baseline={'tx_lat':35.68,'tx_lon':139.76,'year':2026,'month':10,'ssn':80,'ssn_source':'manual',
            'power_w':150,'frequencies':[4,6,8,12,16],'noise':150,'min_angle':3,'required_snr':40,'reliability':90,
            'tx_antenna':'whip','rx_antenna':'whip','tx_gain':0,'rx_gain':0,'polarization_loss_db':0}
        cases=[('tokyo-guam',13.45,144.75),('tokyo-honolulu',21.31,-157.86),('tokyo-london',51.51,-.13)]
        summary=[]
        try:
            for tag,lat,lon in cases:
                p=dict(baseline,rx_lat=lat,rx_lon=lon)
                req=Request(f'http://127.0.0.1:{http.server_port}/api/predict',data=json.dumps(p).encode(),headers={'Content-Type':'application/json'})
                with urlopen(req,timeout=90) as r:app=json.load(r)
                (OUT/(tag+'-chuck.json')).write_text(json.dumps(app,ensure_ascii=False,indent=2))
                raw=direct(manual_cards(p),tag,'a')
                ref=independent_parse(raw,p['frequencies']);maximum={k:0 for k in METRICS.values()};maximum['muf_mhz']=0
                null_mismatches=0;count=0
                for h in app['hours']:
                    rh=ref[h['hour_utc']];maximum['muf_mhz']=max(maximum['muf_mhz'],abs(h['muf_mhz']-rh['muf_mhz']))
                    for a,b in zip(h['rows'],rh['rows']):
                        count+=1
                        for key in METRICS.values():
                            if a[key] is None or b[key] is None:null_mismatches+=a[key]!=b[key]
                            else:maximum[key]=max(maximum[key],abs(a[key]-b[key]))
                example=app['hours'][12]['rows'][2];refexample=ref[12]['rows'][2]
                summary.append(dict(case=tag,parameters=p,points=count,max_absolute_difference=maximum,
                    null_mismatches=null_mismatches,utc12_8mhz=dict(chuck=example,voacap=refexample),
                    engine=app['engine'],engine_commit=app['engine_commit'],direct_header=raw.splitlines()[1].strip()))
        finally:http.shutdown();http.server_close();thread.join()
        upstream=(REPO/'vendor/tests/p2p/test01.dat').read_text()
        raw=direct(upstream,'upstream-test01')
        fs=[6.07,7.2,9.7,11.85,13.7,15.35,17.73,21.65,25.89]
        legacy=independent_parse((REPO/'vendor/tests/p2p/test01.out').read_text(),fs)
        native=independent_parse(raw,fs)
        differences={k:0 for k in list(METRICS.values())+['muf_mhz']}
        for hour in legacy:
            differences['muf_mhz']=max(differences['muf_mhz'],abs(legacy[hour]['muf_mhz']-native[hour]['muf_mhz']))
            for a,b in zip(legacy[hour]['rows'],native[hour]['rows']):
                for key in METRICS.values():
                    if a[key] is not None and b[key] is not None:differences[key]=max(differences[key],abs(a[key]-b[key]))
        # Every legacy difference is a value printed next to a rounding boundary
        # (docs/VALIDATION.md, 2026-10-17), so one step of the printed last digit is allowed.
        tolerance={'reliability':1,'snr_db_hz':1,'signal_dbw':1,'takeoff_deg':0.1,'muf_mhz':0.1}
        within=all(round(differences[k],6)<=tolerance[k] for k in tolerance)
        result={'comparison':'CHUCK HTTP API vs standalone same bundled VOACAP engine; not Marine service',
            'cases':summary,'upstream_windows_reference_max_difference':differences,
            'upstream_windows_reference_tolerance':tolerance,'upstream_windows_reference_within_tolerance':within}
        result['passed']=within and all(not c['null_mismatches'] and all(v==0 for v in c['max_absolute_difference'].values()) for c in summary)
        (OUT/'summary.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result,ensure_ascii=False,indent=2))
        if not result['passed']:raise SystemExit(1)

if __name__=='__main__':main()
