"""Measured or simulated antenna patterns (e.g. airframe-mounted HF antennas).

A pattern is a complete frequency x azimuth x elevation grid of gain in dBi,
uploaded as CSV. For each circuit the engine slices it at the path azimuth
relative to the antenna's reference heading and hands VOACAP a Type 14
frequency x elevation table.
"""
from bisect import bisect_right
from contextlib import closing
import csv
from datetime import datetime, timezone
import hashlib
import io
import json
import math
import re
import threading
import uuid
from engine import InputError

MAX_CSV=6*1024*1024
MAX_POINTS=300000
MAX_PATTERNS=50
HEADER=('frequency_mhz','azimuth_deg','elevation_deg','gain_dbi')


def parse_csv(raw):
    """Return the sorted grid of a CSV with exactly one gain per grid point."""
    if not isinstance(raw,str) or not raw.strip():raise InputError('CSVが空です')
    if len(raw.encode())>MAX_CSV:raise InputError('CSVは6 MiB以下にしてください')
    rows=[r for r in csv.reader(io.StringIO(raw.lstrip('﻿'))) if r and any(c.strip() for c in r) and not r[0].lstrip().startswith('#')]
    if not rows or tuple(c.strip().lower() for c in rows[0])!=HEADER:
        raise InputError('CSVの見出しは frequency_mhz,azimuth_deg,elevation_deg,gain_dbi です')
    if len(rows)-1>MAX_POINTS:raise InputError(f'データ点は{MAX_POINTS}点以下にしてください')
    points={}
    for line,row in enumerate(rows[1:],2):
        if len(row)!=4:raise InputError(f'{line}行目: 4列が必要です')
        try:f,a,e,g=(float(c) for c in row)
        except ValueError:raise InputError(f'{line}行目: 数値ではありません') from None
        if not all(map(math.isfinite,(f,a,e,g))):raise InputError(f'{line}行目: 有限の数値が必要です')
        if not 1<=f<=30:raise InputError(f'{line}行目: 周波数は1〜30 MHzです')
        if not 0<=a<=360:raise InputError(f'{line}行目: 方位は0〜360°です')
        if not 0<=e<=90:raise InputError(f'{line}行目: 仰角は0〜90°です')
        if not -100<=g<=50:raise InputError(f'{line}行目: 利得は−100〜50 dBiです')
        key=(round(f,4),round(a%360,4),round(e,4))
        if key in points:raise InputError(f'{line}行目: 同じ周波数・方位・仰角が重複しています')
        points[key]=round(g,3)
    freqs,azims,elevs=(sorted({k[i] for k in points}) for i in range(3))
    if len(elevs)<2:raise InputError('仰角は2点以上が必要です')
    if len(freqs)*len(azims)*len(elevs)!=len(points):
        raise InputError('周波数・方位・仰角のすべての組合せに利得が必要です（格子が欠けています）')
    gains=[[[points[(f,a,e)] for e in elevs] for a in azims] for f in freqs]
    return dict(frequencies_mhz=freqs,azimuths_deg=azims,elevations_deg=elevs,gains_dbi=gains)


def _bracket(values,x):
    """Indices and weight for clamped linear interpolation."""
    if x<=values[0]:return 0,0,0.
    if x>=values[-1]:return len(values)-1,len(values)-1,0.
    j=bisect_right(values,x);i=j-1
    return i,j,(x-values[i])/(values[j]-values[i])


def _azimuth(values,x):
    """Circular interpolation; a single azimuth means no azimuth dependence."""
    if len(values)==1:return 0,0,0.
    x%=360;j=bisect_right(values,x)
    i=j-1 if j else len(values)-1;j%=len(values)
    span=(values[j]-values[i])%360 or 360
    return i,j,((x-values[i])%360)/span


def slice_table(grid,offset_deg):
    """Gains for 1..30 MHz x 0..90 degrees at an azimuth offset from the reference heading."""
    g=grid['gains_dbi'];ai,aj,aw=_azimuth(grid['azimuths_deg'],offset_deg)
    table=[]
    for mhz in range(1,31):
        fi,fj,fw=_bracket(grid['frequencies_mhz'],mhz)
        row=[]
        for deg in range(91):
            ei,ej,ew=_bracket(grid['elevations_deg'],deg)
            def at(f):
                a=[g[f][ai][ei]*(1-ew)+g[f][ai][ej]*ew,g[f][aj][ei]*(1-ew)+g[f][aj][ej]*ew]
                return a[0]*(1-aw)+a[1]*aw
            row.append(at(fi)*(1-fw)+at(fj)*fw)
        table.append(row)
    return table


def type14_file(grid,offset_deg,gain_db,label):
    """VOACAP Type 14: 30 records of efficiency and 91 elevation gains (readant.for)."""
    lines=[f'{label[:18]:<18}:CHUCK pattern table (Type 14)',' 3     3 parameters',f'{gain_db:6.2f}  [ 1] Max Gain dBi..:',
           '  14    [ 2] Antenna Type..: 30 x (efficiency + 91 gain values) follow','10.00   [ 3] Frequency']
    for mhz,row in enumerate(slice_table(grid,offset_deg),1):
        # f7.3 holds -99.999..999.999; gains below -99 dBi are effectively nulls.
        values=[f'{min(99.,max(-99.,v)):7.3f}' for v in row]
        lines+=[f'{mhz:2d}{0.:6.1f} '+''.join(values[:10])]+[' '*9+''.join(values[k:k+10]) for k in range(10,91,10)]
    return '\n'.join(lines)+'\n'


def pattern_id(value):
    if not isinstance(value,str) or not re.fullmatch('[a-f0-9]{32}',value):raise InputError('pattern_id: 利得表のIDが不正です')
    return value


class PatternStore:
    def __init__(self,connection):
        self.connection=connection;self.cache={};self.lock=threading.Lock()
    def connect(self):
        c=self.connection()
        c.execute('CREATE TABLE IF NOT EXISTS antenna_patterns (id TEXT PRIMARY KEY, created TEXT NOT NULL, name TEXT NOT NULL, source TEXT NOT NULL, sha256 TEXT NOT NULL, grid TEXT NOT NULL)')
        return c
    @staticmethod
    def summary(row):
        grid=json.loads(row[5]) if isinstance(row[5],str) else row[5]
        f,a,e=grid['frequencies_mhz'],grid['azimuths_deg'],grid['elevations_deg']
        return dict(id=row[0],created=row[1],name=row[2],source=row[3],sha256=row[4],
                    frequencies_mhz=[f[0],f[-1]],frequency_count=len(f),azimuth_count=len(a),
                    elevations_deg=[e[0],e[-1]],elevation_count=len(e),
                    max_gain_dbi=max(v for fa in grid['gains_dbi'] for ae in fa for v in ae))
    def list(self):
        with closing(self.connect()) as c:
            return [self.summary(r) for r in c.execute('SELECT id,created,name,source,sha256,grid FROM antenna_patterns ORDER BY created DESC')]
    def grid(self,key):
        """Grid and its source hash; cached because a coverage map runs the engine many times."""
        pattern_id(key)
        with self.lock:
            if key in self.cache:return self.cache[key]
        with closing(self.connect()) as c:
            row=c.execute('SELECT grid,sha256 FROM antenna_patterns WHERE id=?',(key,)).fetchone()
        if row is None:raise InputError('指定された利得表がありません。アンテナプリセットを確認してください')
        value=(json.loads(row[0]),row[1])
        with self.lock:self.cache[key]=value
        return value
    def import_csv(self,data):
        if not isinstance(data,dict):raise InputError('JSONオブジェクトが必要です')
        name=data.get('name')
        if not isinstance(name,str) or not 1<=len(name.strip())<=40 or not name.isprintable():raise InputError('利得表の名称は表示可能な1〜40文字です')
        source=data.get('source','')
        if not isinstance(source,str) or len(source)>200 or (source and not source.isprintable()):raise InputError('出典・解析条件は200文字以内です')
        raw=data.get('csv')
        grid=parse_csv(raw)
        key=uuid.uuid4().hex;created=datetime.now(timezone.utc).isoformat()
        row=(key,created,name.strip(),source.strip(),hashlib.sha256(raw.encode()).hexdigest(),json.dumps(grid,separators=(',',':')))
        with closing(self.connect()) as c,c:
            c.execute('BEGIN IMMEDIATE')
            if c.execute('SELECT COUNT(*) FROM antenna_patterns').fetchone()[0]>=MAX_PATTERNS:raise InputError(f'利得表は{MAX_PATTERNS}件までです')
            if c.execute('SELECT 1 FROM antenna_patterns WHERE name=?',(row[2],)).fetchone():raise InputError('同じ名称の利得表があります')
            c.execute('INSERT INTO antenna_patterns VALUES (?,?,?,?,?,?)',row)
        return self.summary(row)
    def delete(self,key):
        pattern_id(key)
        with closing(self.connect()) as c,c:
            c.execute('BEGIN IMMEDIATE')
            exists=c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='antenna_presets'").fetchone()
            if exists and c.execute("SELECT 1 FROM antenna_presets WHERE json_extract(payload,'$.pattern_id')=?",(key,)).fetchone():
                raise InputError('この利得表を使うアンテナプリセットを先に削除してください')
            if not c.execute('DELETE FROM antenna_patterns WHERE id=?',(key,)).rowcount:raise InputError('指定された利得表がありません')
        with self.lock:self.cache.pop(key,None)
