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
// Shares are relative to the best cell, since a whole-world share can be small; same ramp as the REL legend bar.
const matrixRamp=[[24,50,76],[24,124,119],[123,223,172]];
function matrixFill(v,max){if(v==null)return '#0c1824';const t=max>0?Math.min(1,v/max):0,k=t<.5?0:1,u=t<.5?t*2:(t-.5)*2,a=matrixRamp[k],b=matrixRamp[k+1];return `rgb(${a.map((c,i)=>Math.round(c+(b[i]-c)*u)).join(',')})`;}
function selectMatrixCell(f,h){matrixFrequency=f;$('cov_hour').value=h;showCoverage();}
function renderCoverageMatrix(){
 const r=coverageResult,m=r.matrix,f=Math.min(matrixFrequency,m.frequencies.length-1),h=matrixHour(),target=r.parameters.reliability,max=Math.max(0,...m.covered_percent.flat().filter(v=>v!=null));
 $('coverage-info').replaceChildren(cell('span',`${m.frequencies[f]} MHz / ${h}:00 UTC / ${r.span===360?'全世界':r.span+'° × '+r.span+'°'} / ${m.frequencies.length}周波数×24時間 · セルはREL ${target}%以上となる面積の割合（緯度で面積補正）。セルを選ぶとその地図を表示し、UTCの再生で時刻を進めます`),...(r.notes??[]).map(n=>cell('p',n)));
 coverageLegend($('cov_metric').value);
 const table=document.createElement('table');table.className='heat coverage-matrix';const head=document.createElement('tr');head.append(cell('th','MHz / UTC'));
 for(const hour of m.hours){const th=cell('th',String(hour).padStart(2,'0'));th.classList.toggle('selected',hour===h);head.append(th);}table.append(head);
 m.frequencies.forEach((frequency,i)=>{const tr=document.createElement('tr'),label=cell('th',frequency.toFixed(3));label.classList.toggle('selected',i===f);tr.append(label);
  m.covered_percent[i].forEach((v,hour)=>{const td=document.createElement('td'),b=cell('button',v==null?'—':v<10?v.toFixed(1):String(Math.round(v)));td.style.background=matrixFill(v,max);td.style.color=v!=null&&max>0&&v/max>.6?'#062c24':'#e6eef5';td.classList.toggle('selected',i===f&&hour===h);
   b.title=`${frequency} MHz / ${hour}:00 UTC / REL ${target}%以上の面積 ${fmt(v)}%`;b.onclick=()=>selectMatrixCell(i,hour);td.append(b);tr.append(td);});table.append(tr);});
 $('coverage-matrix').replaceChildren(table);
}
// A new matrix opens on the frequency and hour with the largest covered share.
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
