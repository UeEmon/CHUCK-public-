'use strict';
// Minimum transmit power of one link: the forecast repeated over a 1-2-5 ladder of powers.
let powerResult=null;
const powerLabel=w=>w===null||w===undefined?'>10k':w>=1000?(w/1000)+'k':String(w);
function powerShade(r,w){
 // The smallest step is the brightest; out of reach is grey.
 if(w===null||w===undefined)return null;const i=r.ladder.indexOf(w);return 100-60*i/(r.ladder.length-1);
}
function powerPaint(td,v){td.style.background=relPercentFill(v);td.style.color=relPercentInk(v);}
function showPower(){
 const r=powerResult;if(!r)return;const p=r.parameters;
 $('power-caption').textContent=`${p.year}/${p.month} · SSN ${p.ssn} · 現在の設定 ${p.power_w} W · ${r.distance_km} km · 要求SNR ${p.required_snr} dB·Hz · 目標REL ${p.reliability}% · 吸収モード ${absorptionLabel(p)}`;
 $('power-note').textContent=r.note;
 $('power-exports').replaceChildren();for(const type of ['csv','json']){const a=cell('a',type.toUpperCase()+'出力');a.href=`/api/results/${r.id}/${type}`;a.download='';$('power-exports').append(a);}$('power-exports').append(reportButton('power'));$('power-exports').hidden=false;
 const table=document.createElement('table');table.className='heat power-matrix';const head=document.createElement('tr');head.append(cell('th','MHz / UTC'));for(let h=0;h<24;h++)head.append(cell('th',String(h).padStart(2,'0')));table.append(head);
 const best=document.createElement('tr');best.className='power-best';best.append(cell('th','最小電力'));
 for(const h of r.minimum){const v=h.best,td=document.createElement('td'),text=cell('span',powerLabel(v?.power_w));if(v)text.append(cell('small',v.frequency_mhz.toFixed(1)));td.append(text);td.title=`${h.hour_utc}:00 UTC / ${v?v.frequency_mhz+' MHz / '+v.power_w+' W':'>10 kW'}`;powerPaint(td,powerShade(r,v?.power_w));best.append(td);}
 table.append(best);
 p.frequencies.forEach((f,j)=>{
  const tr=document.createElement('tr');tr.append(cell('th',f.toFixed(3)));
  for(const h of r.minimum){const w=h.rows[j].power_w,td=cell('td',powerLabel(w));td.title=`${h.hour_utc}:00 UTC / ${f} MHz / ${w===null?'>10 kW':w+' W'}`;powerPaint(td,powerShade(r,w));tr.append(td);}
  table.append(tr);
 });
 $('power-heatmap').classList.remove('empty');$('power-heatmap').replaceChildren(table);
 const steps=document.createElement('table');steps.className='heat power-steps';const top=document.createElement('tr');top.append(cell('th','W / UTC'));for(let h=0;h<24;h++)top.append(cell('th',String(h).padStart(2,'0')));top.append(cell('th','目標REL以上（時間）'));steps.append(top);
 for(const s of r.steps){
  const tr=document.createElement('tr');tr.append(cell('th',String(s.power_w)));tr.classList.toggle('selected',s.power_w===p.power_w);
  for(const h of s.hours){const rels=h.rows.map(v=>v.reliability).filter(v=>v!==null&&v!==undefined),rel=rels.length?Math.max(...rels):null,td=cell('td',rel===null?'—':Math.round(rel)+(rel>=p.reliability?'·':''));powerPaint(td,rel);tr.append(td);}
  tr.append(cell('td',String(s.hours_meeting)));steps.append(tr);
 }
 $('power-steps').replaceChildren(steps);
}
function openPower(r){powerResult=r;coverageResult=null;tab('power');showPower();}
$('compute-power').onclick=async()=>{
 if(busy)return;if(!form.checkValidity()){tab('conditions-tab');form.reportValidity();return;}if(!$('station-selection').reportValidity())return;
 try{
  validateCircuit();if(meshMode())throw Error('必要な送信電力は単一RXの経路で計算します。メッシュを外してください。');
  const p={...params(),ui_selection:circuitSnapshot()};setBusy(true);notice('送信電力を10段階で計算しています。エンジンを10回実行するため、完了までお待ちください…');
  powerResult=await post('/api/power',p);coverageResult=null;showPower();notice('計算完了。条件と結果を履歴に保存しました。');
 }catch(e){notice(e.message,true);}finally{setBusy(false);}
};
