'use strict';
// Coverage: a VOACAP area map for every frequency x UTC hour. The chosen frequency's map at the UTC bar's hour is drawn on
// the circuit map, and the UTC bars (map-time.js) step or play its hours. No area summary is shown: it would read like a path value.
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
// The frequency list is the result's frequencies; the form shows it only once a result exists.
function fillCoverageFrequencies(list){
 const select=$('cov_freq'),keep=Number(select.value),values=list.map(Number);if(select.options.length===values.length&&values.every((v,i)=>Number(select.options[i].value)===v))return;
 select.replaceChildren(...values.map(v=>new Option(v.toFixed(3)+' MHz',v)));if(values.includes(keep))select.value=keep;
}
// The map shows the chosen frequency at the UTC bar's hour; the bar steps or plays the 24 hours.
function renderCoverageMatrix(){
 if(coverageResult.stations)return renderStationCoverage();
 const r=coverageResult,m=r.matrix,f=Math.min(matrixFrequency,m.frequencies.length-1),h=matrixHour(),label=r.span===360?'全世界':r.span+'° × '+r.span+'°';
 fillCoverageFrequencies(m.frequencies);$('cov_freq').value=m.frequencies[f];
 $('coverage-info').replaceChildren(cell('span',`${m.frequencies[f]} MHz / ${h}:00 UTC / ${label} / ${m.size}×${m.size}格子 · TXから各格子点までのVOACAPエリア計算。格子点の間は補間して色分けしています`),...(r.notes??[]).map(n=>cell('p',n)));
 coverageLegend($('cov_metric').value);
}
// A new result keeps the frequency chosen for the previous one when it was calculated, and the shown hour.
function openCoverageMatrix(r){matrixFrequency=Math.max(0,r.matrix.frequencies.indexOf(Number($('cov_freq').value)));}
$('cov_freq').onchange=()=>{const m=coverageResult?.matrix;if(!m)return;const best=$('cov_freq').value==='best',i=m.frequencies.indexOf(Number($('cov_freq').value));
 // A result of several stations also offers the best frequency of each grid point (coverage-stations.js).
 if(coverageResult.stations)stationBest=best;if(i>=0)matrixFrequency=i;if(best||i>=0)showCoverage();};
$('cov_hour').addEventListener('change',()=>{if(coverageResult?.matrix&&!$('coverage').hidden)showCoverage();});
$('compute-coverage').onclick=async()=>{
 if(busy)return;if(!form.checkValidity()){tab('conditions-tab');form.reportValidity();return;}if(!$('station-selection').reportValidity())return;try{validateCircuit();}catch(e){notice(e.message,true);return;}
 const p={...params(),ui_selection:circuitSnapshot()},span=Number($('cov_span').value);
 if(span>=360&&!await confirmDialog())return;
 setBusy(true);notice(`周波数${p.frequencies.length}波×24時間のカバー範囲を計算しています。数十秒〜数分かかります。`);
 try{coverageResult=await postWithDialog('カバー範囲を計算しています','/api/coverage-matrix',{...p,center_lat:p.tx_lat,center_lon:p.tx_lon,span});openCoverageMatrix(coverageResult);fitCoverage();showCoverage();notice('カバー範囲を計算しました。周波数を選ぶとその地図を表示し、UTCのスライダーや「▶ 再生」で24時間を順に表示します。');}
 catch(e){notice(e.message,true);}finally{setBusy(false);}
};
