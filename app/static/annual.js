'use strict';
// Month × UTC outlook of one link: twelve monthly forecasts from the selected month.
let annualResult=null,annualSelected=null;
const annualLabel=m=>`${m.year}/${m.month}`;
function annualRow(hour,frequency){if(!hour)return null;if(frequency!=='best')return hour.rows.find(r=>r.frequency_mhz===Number(frequency))??null;let best=null;for(const r of hour.rows){if(r.reliability===null||r.reliability===undefined)continue;if(!best||r.reliability>best.reliability||(r.reliability===best.reliability&&(r.snr_db_hz??-Infinity)>(best.snr_db_hz??-Infinity)))best=r;}return best;}
function annualPaint(td,rel){td.style.background=relPercentFill(rel);td.style.color=relPercentInk(rel);}
function showAnnual(){
 const r=annualResult;if(!r)return;const p=r.parameters;
 const span=`${annualLabel(r.months[0])}〜${annualLabel(r.months[r.months.length-1])}`,rest=`${p.power_w} W · ${r.distance_km} km · 要求SNR ${p.required_snr} dB·Hz · 目標REL ${p.reliability}% · 吸収モード ${absorptionLabel(p)}`;
 $('annual-caption').textContent=p.ssn_source==='noaa'?`${span} · NOAAの月ごとの平滑SSN×0.7 · ${rest}`:`${span} · SSN ${p.ssn}（全月共通） · ${rest}`;
 $('annual-note').textContent=r.note;
 $('annual-exports').replaceChildren();for(const type of ['csv','json']){const a=cell('a',type.toUpperCase()+'出力');a.href=`/api/results/${r.id}/${type}`;a.download='';$('annual-exports').append(a);}$('annual-exports').append(reportButton('annual'));$('annual-exports').hidden=false;
 const select=$('annual-frequency'),previous=select.value;select.replaceChildren(new Option('最良周波数','best'),...p.frequencies.map(f=>new Option(f.toFixed(3)+' MHz',String(f))));select.value=[...select.options].some(o=>o.value===previous)?previous:'best';
 if(!annualSelected||!r.months.some(m=>m.year===annualSelected.year&&m.month===annualSelected.month&&m.ssn!==null)){const first=r.months.find(m=>m.ssn!==null);annualSelected={year:first.year,month:first.month,hour:new Date().getUTCHours()};}
 renderAnnual();
}
function renderAnnual(){
 const r=annualResult;if(!r)return;const frequency=$('annual-frequency').value,target=r.parameters.reliability;
 const table=document.createElement('table');table.className='heat annual-matrix';const head=document.createElement('tr');head.append(cell('th','月 / UTC'));for(let h=0;h<24;h++)head.append(cell('th',String(h).padStart(2,'0')));head.append(cell('th','目標REL以上（時間）'));table.append(head);
 for(const m of r.months){
  const tr=document.createElement('tr'),label=cell('th',m.ssn===null?annualLabel(m):`${annualLabel(m)} · SSN ${m.ssn}`);label.classList.toggle('selected',m.year===annualSelected.year&&m.month===annualSelected.month);tr.append(label);
  let meeting=0;
  for(let h=0;h<24;h++){
   const td=document.createElement('td');
   if(m.ssn===null){td.className='annual-missing';td.textContent='—';td.title=m.missing??'';tr.append(td);continue;}
   const v=annualRow(m.hours.find(x=>x.hour_utc===h),frequency),rel=v?.reliability??null,button=cell('button',rel===null?'—':Math.round(rel)+(rel>=target?'·':''));
   if(rel!==null&&rel>=target)meeting++;
   if(frequency==='best'&&v)button.append(cell('small',v.frequency_mhz.toFixed(1)));
   button.title=`${annualLabel(m)} / ${h}:00 UTC / ${v?v.frequency_mhz+' MHz':'—'} / REL ${fmt(rel)}% / SNR ${fmt(v?.snr_db_hz)} dB·Hz`;
   button.onclick=()=>{annualSelected={year:m.year,month:m.month,hour:h};renderAnnual();};
   annualPaint(td,rel);td.classList.toggle('selected',m.year===annualSelected.year&&m.month===annualSelected.month&&h===annualSelected.hour);td.append(button);tr.append(td);
  }
  tr.append(cell('td',m.ssn===null?'—':String(meeting)));table.append(tr);
 }
 $('annual-heatmap').classList.remove('empty');$('annual-heatmap').replaceChildren(table);
 renderAnnualMonth();
}
function renderAnnualMonth(){
 // Frequency × UTC of the selected month, the same view as a single-link forecast.
 const r=annualResult,m=r.months.find(m=>m.year===annualSelected.year&&m.month===annualSelected.month);if(!m)return;
 $('annual-month-title').textContent=`${annualLabel(m)} · SSN ${m.ssn}`;
 const table=document.createElement('table');table.className='heat';const head=document.createElement('tr');head.append(cell('th','MHz / UTC'));for(let h=0;h<24;h++){const th=cell('th',String(h).padStart(2,'0'));th.classList.toggle('selected',h===annualSelected.hour);head.append(th);}table.append(head);
 for(const f of r.parameters.frequencies){
  const tr=document.createElement('tr');tr.append(cell('th',f.toFixed(3)));
  for(const h of m.hours){const v=h.rows.find(v=>v.frequency_mhz===f),rel=v?.reliability??null,td=document.createElement('td'),button=cell('button',rel===null?'—':Math.round(rel)+(rel>=r.parameters.reliability?'·':''));annualPaint(td,rel);td.classList.toggle('selected',h.hour_utc===annualSelected.hour);button.title=`${h.hour_utc}:00 UTC / ${f} MHz / REL ${fmt(rel)}% / SNR ${fmt(v?.snr_db_hz)} dB·Hz / MUF ${fmt(h.muf_mhz)} MHz`;button.onclick=()=>{annualSelected.hour=h.hour_utc;renderAnnual();};td.append(button);tr.append(td);}
  table.append(tr);
 }
 $('annual-month').replaceChildren(table);
}
$('annual-frequency').onchange=renderAnnual;
function openAnnual(r){annualResult=r;annualSelected=null;coverageResult=null;tab('annual');showAnnual();}
$('compute-annual').onclick=async()=>{
 if(busy)return;if(!form.checkValidity()){tab('conditions-tab');form.reportValidity();return;}if(!$('station-selection').reportValidity())return;
 try{
  validateCircuit();if(meshMode())throw Error('12か月の見通しは単一RXの経路で計算します。メッシュを外してください。');
  if(fields.ssn_source.value==='effective')throw Error('12か月の見通しでは実効SSNを使えません。手動入力かNOAAの平滑SSNを選んでください。');
  const p={...params(),ui_selection:circuitSnapshot()};setBusy(true);notice('12か月分を計算しています。エンジンを12回実行するため、完了までお待ちください…');
  annualResult=await post('/api/annual',p);annualSelected=null;coverageResult=null;showAnnual();notice('計算完了。条件と結果を履歴に保存しました。');
 }catch(e){notice(e.message,true);}finally{setBusy(false);}
};
