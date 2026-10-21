"""VOACAP adapter. Fixed-width cards follow upstream decred.for/antcalc.for."""
import math
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

ENGINE_COMMIT = 'c12a98b348c39f36f2659b8b3aa97b86284c8a1d'
ANTENNAS = {'isotropic':'samples/sample.00','whip':'default/swwhip.voa',
            'monopole':'samples/sample.22','dipole':'samples/sample.23','vertical_dipole':'samples/sample.35'}
GEOMETRIC_ANTENNAS=('monopole','dipole','vertical_dipole')
ANTENNA_FIELDS=('length_m','height_m','azimuth_deg','ground_permittivity','ground_conductivity')
POLARIZATIONS = ('model','vertical','horizontal','rhcp','lhcp','linear_other')
MODULATIONS = ('manual','cw','ssb','am','fm','fsk','psk','qam','ofdm','digital')

class InputError(ValueError):
    pass

class EngineError(RuntimeError):
    pass

def number(data, key, low, high, default=None, integer=False):
    value = data.get(key, default)
    if isinstance(value, bool):
        raise InputError(f'{key}: 数値を入力してください')
    try:
        value = float(value)
    except (ValueError, TypeError):
        raise InputError(f'{key}: 数値を入力してください')
    if not math.isfinite(value) or not low <= value <= high or (integer and value != int(value)):
        raise InputError(f'{key}: {low}〜{high}の範囲で入力してください')
    return int(value) if integer else value

def antenna_parameters(data,model,prefix=''):
    """Positive dimensions are metres, not a wavelength that changes per band."""
    p={}
    key=prefix+'length_m'
    p['length_m']=number(data,key,.1,200) if model in GEOMETRIC_ANTENNAS or data.get(key) is not None else None
    for field,lo,hi,default in [('height_m',0,200,10 if model in ('dipole','vertical_dipole') else 0),
                              ('azimuth_deg',0,359.9,0),('ground_permittivity',1,80,13),
                              ('ground_conductivity',.00003,5,.005)]:
        p[field]=number(data,prefix+field,lo,hi,default)
    if model=='dipole' and p['height_m']<.1:raise InputError('水平ダイポールの地上高は0.1 m以上です')
    if model=='vertical_dipole' and p['height_m']<=p['length_m']/2:
        raise InputError('垂直ダイポールの給電点高は全長の半分より高くしてください')
    return p

def antenna_file(p,prefix,source):
    lines=source.splitlines()
    model=p[prefix+'_antenna']
    def setparm(n,value):lines[n+1]=f'{value:12.6f}  [{n:2d}] CHUCK antenna parameter'
    if model in GEOMETRIC_ANTENNAS:
        for n,key in [(3,'ground_permittivity'),(4,'ground_conductivity'),(6,'length_m')]:
            setparm(n,p[prefix+'_'+key])
        if model=='monopole':setparm(7,p[prefix+'_gain'])
        else:
            setparm(7,p[prefix+'_height_m']);setparm(8,p[prefix+'_gain'])
    else:lines[2]=f"{p[prefix+'_gain']:6.2f}  [ 1] Max Gain dBi..:"
    return '\n'.join(lines)+'\n'

def validate(data):
    if not isinstance(data, dict):
        raise InputError('JSONオブジェクトが必要です')
    p = {}
    for key,choices,default in [('modulation',MODULATIONS,'manual'),('snr_input',('direct','bandwidth'),'direct'),
                                ('tx_polarization',POLARIZATIONS,'model'),('rx_polarization',POLARIZATIONS,'model')]:
        value=data.get(key,default)
        if not isinstance(value,str) or value not in choices: raise InputError(key+': 設定値が不正です')
        p[key]=value
    p['polarization_loss_db']=number(data,'polarization_loss_db',0,30,0)
    for prefix in ('tx', 'rx'):
        p[prefix+'_lat'] = number(data,prefix+'_lat',-89,89)
        p[prefix+'_lon'] = number(data,prefix+'_lon',-180,180)
        ant = data.get(prefix+'_antenna','whip')
        if not isinstance(ant,str) or ant not in ANTENNAS:
            raise InputError('アンテナが不正です')
        p[prefix+'_antenna'] = ant
        p[prefix+'_gain'] = number(data,prefix+'_gain',-20,30,0)
        p.update({prefix+'_'+k:v for k,v in antenna_parameters(data,ant,prefix+'_').items()})
    p['year'] = number(data,'year',1900,2100,integer=True)
    p['month'] = number(data,'month',1,12,integer=True)
    for key,lo,hi,default in [('ssn',0,250,80),('power_w',1,100000,150),('noise',100,180,150),('min_angle',0.1,45,3),('required_snr',0,99,40),('reliability',1,99,90)]:
        if key!='required_snr': p[key] = number(data,key,lo,hi,default)
    if p['snr_input']=='bandwidth':
        p['bandwidth_hz']=number(data,'bandwidth_hz',1,1000000)
        p['inband_snr_db']=number(data,'inband_snr_db',-40,60)
        p['required_snr']=round(p['inband_snr_db']+10*math.log10(p['bandwidth_hz']),4)
        number(p,'required_snr',0,99)
    else:p['required_snr']=number(data,'required_snr',0,99,40)
    freq = data.get('frequencies',[2,4,6,8,12,16,18,22,25])
    if not isinstance(freq,list) or not 1 <= len(freq) <= 11:
        raise InputError('周波数は1〜11個で指定してください')
    p['frequencies'] = [number({'f':f},'f',2,30) for f in freq]
    p['frequencies'] = sorted(set(round(f,3) for f in p['frequencies']))
    if distance(p['tx_lat'],p['tx_lon'],p['rx_lat'],p['rx_lon']) < 1:
        raise InputError('送受信地点を1 km以上離してください')
    return p

def distance(a,b,c,d):
    a,b,c,d = map(math.radians,(a,b,c,d))
    h=math.sin((c-a)/2)**2+math.cos(a)*math.cos(c)*math.sin((d-b)/2)**2
    return 6371.0088*2*math.asin(math.sqrt(min(1,h)))

def bearing(a,b,c,d):
    a,b,c,d=map(math.radians,(a,b,c,d))
    return (math.degrees(math.atan2(math.sin(d-b)*math.cos(c),math.cos(a)*math.sin(c)-math.sin(a)*math.cos(c)*math.cos(d-b)))+360)%360

def cards(p, hour=None):
    coords=''.join(f'{abs(p[k]):{w}.2f}{pos if p[k]>=0 else neg}' for k,w,pos,neg in [('tx_lat',5,'N','S'),('tx_lon',9,'E','W'),('rx_lat',9,'N','S'),('rx_lon',9,'E','W')])
    start,end = (1,24) if hour is None else (hour or 24,hour or 24)
    lines=['COMMENT   HF Propagation JP / independent user interface','LINEMAX     999','COEFFS    CCIR',f'TIME     {start:5d}{end:5d}{1:5d}{1:5d}',f'MONTH     {p["year"]:5d}{p["month"]:5.2f}',f'SUNSPOT   {p["ssn"]:5.1f}','LABEL     TX                  RX',f'CIRCUIT   {coords}  S {0:5d}',f'SYSTEM    {1.:5.2f}{p["noise"]:5.0f}{p["min_angle"]:5.2f}{p["reliability"]:5.0f}{p["required_snr"]:5.2f}{3.:5.2f}{0.1:5.2f}','FPROB      1.00 1.00 1.00 0.00']
    for i,prefix in enumerate(('tx','rx'),1):
        ant=f'[{ANTENNAS[p[prefix+"_antenna"]]:<21}]'
        # A user-assumed extra path loss is equivalent to reducing launch power.
        # Polarization labels alone never synthesize a different antenna pattern.
        power=p['power_w']/1000*10**(-p.get('polarization_loss_db',0)/10) if i==1 else 0
        azimuth=p.get(prefix+'_azimuth_deg',0) if p[prefix+'_antenna'] in GEOMETRIC_ANTENNAS else 0
        lines.append(f'ANTENNA   {i:5d}{i:5d}{2:5d}{30:5d}{(p[prefix+'_gain'] if p[prefix+'_antenna']=='isotropic' else 0.):10.3f}{ant}{azimuth:5.1f}{power:10.6f}')
    lines+=['FREQUENCY $'+''.join(f'{f:6.3f}' for f in (p['frequencies']+[0]*11)[:11]),'METHOD       30    0','EXECUTE','QUIT']
    return '\n'.join(lines)+'\n'

def parse_output(raw, frequencies):
    blocks=[]
    current=None
    labels={'REL':'reliability','SNR':'snr_db_hz','S DBW':'signal_dbw','TANGLE':'takeoff_deg','MUFday':'muf_day_fraction'}
    for line in raw.splitlines():
        if line.rstrip().endswith(' FREQ'):
            # First field = hour, second = MUF, then requested frequencies.
            try:
                values=[float(line[i:i+5]) for i in range(1,66,5)]
            except ValueError:
                continue
            if len(values)>=2+len(frequencies):
                current={'hour_utc':int(values[0])%24,'muf_mhz':values[1], 'rows':[{'frequency_mhz':f} for f in frequencies]}
                blocks.append(current)
        elif current:
            label=next((k for k in labels if line.rstrip().endswith(' '+k)),None)
            if label:
                for i,row in enumerate(current['rows']):
                    token=line[1+(i+2)*5:1+(i+3)*5].strip()
                    try: value=float(token)
                    except ValueError: value=None
                    row[labels[label]]=value
    if not blocks or any(any('reliability' not in r or 'snr_db_hz' not in r for r in b['rows']) for b in blocks):
        raise EngineError('VOACAP出力を解釈できません。生出力とエンジン設定を確認してください。')
    for b in blocks:
        for r in b['rows']:
            if r['reliability'] is not None:
                r['reliability']=round(r['reliability']*100,1)
    return sorted(blocks,key=lambda b:b['hour_utc'])

class Engine:
    def __init__(self):
        self.binary=os.environ.get('VOACAP_BIN','/usr/local/bin/voacapl')
        self.model=Path(os.environ.get('VOACAP_MODEL','/usr/local/share/voacapl/itshfbc'))
    def ready(self):
        return bool(shutil.which(self.binary)) and (self.model/'coeffs/coeff01.bin').exists()
    def execute(self,prepare):
        """Run one card deck; prepare(root) may edit private files and returns the deck."""
        if not self.ready():
            raise EngineError('計算エンジンが準備されていません。docker compose up --build で起動してください。')
        # Each calculation gets private run/database/antenna files. Short paths
        # also satisfy the upstream 50-character legacy run-directory limit.
        with tempfile.TemporaryDirectory(prefix='hf-',dir='/tmp') as tmp:
            root=Path(tmp)/'m'
            root.mkdir()
            for name in ('coeffs','geocity','geonatio','geostate'):
                (root/name).symlink_to(self.model/name,target_is_directory=True)
            for name in ('database','antennas'):
                shutil.copytree(self.model/name,root/name)
            card=prepare(root)
            (root/'run').mkdir()
            (root/'run/voacapx.dat').write_text(card,encoding='ascii')
            try:
                cp=subprocess.run([self.binary,'-s',str(root)],cwd=tmp,stdin=subprocess.DEVNULL,capture_output=True,text=True,timeout=60)
            except subprocess.TimeoutExpired:
                raise EngineError('計算が60秒を超えました。条件を見直してください。')
            out=root/'run/voacapx.out'
            if cp.returncode or not out.exists():
                raise EngineError('VOACAP計算に失敗しました: '+(cp.stderr or cp.stdout)[-800:])
            return out.read_text(errors='replace')
    def run(self,p,hour=None):
        card=cards(p,hour)
        def antennas(root):
            nonlocal card
            for prefix in ('tx','rx'):
                source=root/'antennas'/ANTENNAS[p[prefix+'_antenna']]
                # Separate files allow independent TX/RX gain even for same model.
                target=root/'antennas'/('tx.voa' if prefix=='tx' else 'rx.voa')
                target.write_text(antenna_file(p,prefix,source.read_text()))
            card=card.replace(ANTENNAS[p['tx_antenna']].ljust(21),'tx.voa'.ljust(21),1)
            # Replacement of RX must occur only on RX card.
            card='\n'.join(line.replace(ANTENNAS[p['rx_antenna']].ljust(21),'rx.voa'.ljust(21)) if line.startswith('ANTENNA       2') else line for line in card.splitlines())+'\n'
            return card
        raw=self.execute(antennas)
        hours=parse_output(raw,p['frequencies'])
        if hour is None and len(hours)!=24:
            raise EngineError(f'24時間の結果が揃いません（{len(hours)}時間）')
        return {'parameters':p,'engine':'voacapl 0.7.7','engine_commit':ENGINE_COMMIT,'distance_km':round(distance(p['tx_lat'],p['tx_lon'],p['rx_lat'],p['rx_lon']),1),'bearing_deg':round(bearing(p['tx_lat'],p['tx_lon'],p['rx_lat'],p['rx_lon']),1),'hours':hours,'input_cards':card,'raw_output':raw}
