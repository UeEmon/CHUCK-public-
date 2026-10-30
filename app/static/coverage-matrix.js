'use strict';
// Coverage matrix: a VOACAP area map for every frequency x UTC hour. Each cell gives the share of the area whose REL meets
// the target; selecting a cell shows its map, and the UTC bars (map-time.js) step or play the hours of the selected frequency.
let matrixFrequency=0;
function matrixHour(){return Number($('cov_hour').value);}
// Grid values arrive one byte each (server.py AREA_BYTES): 255 is no value.
function matrixGrid(b64,n,sign,offset){const bytes=atob(b64),rows=[];for(let y=0;y<n;y++){const row=[];for(let x=0;x<n;x++){const b=bytes.charCodeAt(y*n+x);row.push(b===255?null:sign*(b-offset));}rows.push(row);}return rows;}
function matrixArea(){
 const r=coverageResult,m=r?.matrix;if(!m)return null;const f=Math.min(matrixFrequency,m.frequencies.length-1),h=matrixHour(),key=f+'-'+h;r.matrixAreas??={};
 if(!r.matrixAreas[key]){const cell=m.cells[f][h],n=m.size;
  r.matrixAreas[key]={size:n,lon_min:m.lon_min,lon_max:m.lon_max,lat_min:m.lat_min,lat_max:m.lat_max,signal_dbw:matrixGrid(cell.signal_dbw,n,-1,0),snr_db_hz:matrixGrid(cell.snr_db_hz,n,1,100),reliability:matrixGrid(cell.reliability,n,1,0)};}
 return r.matrixAreas[key];
}
function selectMatrixCell(f,h){matrixFrequency=f;$('cov_hour').value=h;showCoverage();}
// Each cell gives the area-weighted median of the selected display over the grid points with a value, coloured like the map's bands.
// The share of the area meeting the REL target stays in the cell's tooltip.
function matrixMedian(b64,m,sign,offset){
 const bytes=atob(b64),n=m.size,values=[];let total=0;
 for(let y=0;y<n;y++){const w=Math.max(0,Math.cos((m.lat_min+(m.lat_max-m.lat_min)*y/(n-1))*Math.PI/180));
  for(let x=0;x<n;x++){const b=bytes.charCodeAt(y*n+x);if(b!==255){values.push([sign*(b-offset),w]);total+=w;}}}
 if(!values.length)return null;values.sort((a,b)=>a[0]-b[0]);let sum=0;for(const[v,w]of values){sum+=w;if(sum>=total/2)return v;}return values.at(-1)[0];
}
function matrixValues(r,metric){
 const m=r.matrix,[sign,offset]={signal_dbw:[-1,0],snr_db_hz:[1,100],reliability:[1,0]}[metric];r.matrixStats??={};
 return r.matrixStats[metric]??=m.cells.map(row=>row.map(c=>matrixMedian(c[metric],m,sign,offset)));
}
function matrixBandFill(metric,v){const band=coverageBand(coverageScales[metric].steps,v);return band<0?'#0c1824':coverageColors(metric)[band];}
function matrixInk(fill){const c=fill.match(/\d+/g)?.map(Number)??[12,24,36];return .299*c[0]+.587*c[1]+.114*c[2]>150?'#062c24':'#e6eef5';}
function renderCoverageMatrix(){
 const r=coverageResult,m=r.matrix,f=Math.min(matrixFrequency,m.frequencies.length-1),h=matrixHour(),target=r.parameters.reliability,metric=$('cov_metric').value,values=matrixValues(r,metric),
  label=r.span===360?'全世界':r.span+'° × '+r.span+'°',unit=coverageScales[metric].unit;
 $('coverage-info').replaceChildren(cell('span',metric==='reliability'?`${m.frequencies[f]} MHz / ${h}:00 UTC / ${label} / ${m.frequencies.length}周波数×24時間 · セルは範囲内のRELの中央値（%、緯度で面積補正）で、色は地図の凡例と同じです。セルを選ぶとその地図を表示し、UTCの再生で時刻を進めます`
  :metric==='signal_dbw'?`${m.frequencies[f]} MHz / ${h}:00 UTC / ${label} / ${m.frequencies.length}周波数×24時間 · セルは範囲内の信号強度の中央値（dBW、緯度で面積補正）で、色は地図の凡例と同じです。セルを選ぶとその地図を表示し、UTCの再生で時刻を進めます`
  :`${m.frequencies[f]} MHz / ${h}:00 UTC / ${label} / ${m.frequencies.length}周波数×24時間 · セルは範囲内のSNRの中央値（dB·Hz、緯度で面積補正）で、色は地図の凡例と同じです。セルを選ぶとその地図を表示し、UTCの再生で時刻を進めます`),...(r.notes??[]).map(n=>cell('p',n)));
 coverageLegend(metric);
 const table=document.createElement('table');table.className='heat coverage-matrix';const head=document.createElement('tr');head.append(cell('th','MHz / UTC'));
 for(const hour of m.hours){const th=cell('th',String(hour).padStart(2,'0'));th.classList.toggle('selected',hour===h);head.append(th);}table.append(head);
 m.frequencies.forEach((frequency,i)=>{const tr=document.createElement('tr'),label=cell('th',frequency.toFixed(3));label.classList.toggle('selected',i===f);tr.append(label);
  values[i].forEach((v,hour)=>{const td=document.createElement('td'),text=v==null?'—':String(Math.round(v)),fill=v==null?'#0c1824':matrixBandFill(metric,v),b=cell('button',text);
   td.style.background=fill;td.style.color=matrixInk(fill);
   td.classList.toggle('selected',i===f&&hour===h);
   b.title=`${frequency} MHz / ${hour}:00 UTC / 中央値 ${fmt(v)} ${unit} / REL ${target}%以上の面積 ${fmt(m.covered_percent[i][hour])}%`;b.onclick=()=>selectMatrixCell(i,hour);td.append(b);tr.append(td);});table.append(tr);});
 $('coverage-matrix').replaceChildren(table);
}
function openCoverageMatrix(r){let best=-1;r.matrix.covered_percent.forEach((row,f)=>row.forEach((v,h)=>{if(v!=null&&v>best){best=v;matrixFrequency=f;$('cov_hour').value=h;}}));if(best<0){matrixFrequency=0;$('cov_hour').value=12;}}
$('cov_hour').addEventListener('change',()=>{if(coverageResult?.matrix&&!$('coverage').hidden)showCoverage();});
$('compute-coverage').onclick=async()=>{
 if(busy)return;if(!form.checkValidity()){tab('conditions-tab');form.reportValidity();return;}if(!$('station-selection').reportValidity())return;try{validateCircuit();}catch(e){notice(e.message,true);return;}
 const p={...params(),ui_selection:circuitSnapshot()},span=Number($('cov_span').value);
 if(span>=360&&!await confirmDialog())return;
 setBusy(true);notice(`周波数${p.frequencies.length}波×24時間のカバー範囲を計算しています。数十秒〜数分かかります。`);
 try{coverageResult=await postWithDialog('カバー範囲を計算しています','/api/coverage-matrix',{...p,center_lat:p.tx_lat,center_lon:p.tx_lon,span});openCoverageMatrix(coverageResult);fitCoverage();showCoverage();notice('カバー範囲を計算しました。セルを選ぶとその周波数・時刻の地図を表示し、「▶ 再生」で24時間を順に表示します。');}
 catch(e){notice(e.message,true);}finally{setBusy(false);}
};
