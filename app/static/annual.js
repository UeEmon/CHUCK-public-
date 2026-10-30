'use strict';
// Month × UTC outlook of one link: twelve monthly forecasts from the selected month.
let annualResult=null,annualSelected=null;
const annualLabel=m=>`${m.year}/${m.month}`;
function annualRow(hour,frequency){if(!hour)return null;if(frequency!=='best')return hour.rows.find(r=>r.frequency_mhz===Number(frequency))??null;let best=null;for(const r of hour.rows){if(r.reliability===null||r.reliability===undefined)continue;if(!best||r.reliability>best.reliability||(r.reliability===best.reliability&&(r.snr_db_hz??-Infinity)>(best.snr_db_hz??-Infinity)))best=r;}return best;}
function annualPaint(td,rel){td.style.background=relPercentFill(rel);td.style.color=relPercentInk(rel);}
function showAnnual(){
 const r=annualResult;if(!r)return;const p=r.parameters;
 const span=`${annualLabel(r.months[0])}〜${annualLabel(r.months[r.months.length-1])}`,rest=`${p.power_w} W · ${r.distance_km} km · 要求SNR ${p.required_snr} dB·Hz · 目標REL ${p.reliability}% · 吸収モード ${absorptionLabel(p)}${methodCaption(p)}`;
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
 renderAngles();
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
// Takeoff-angle analysis: distribution of the engine's TANGLE (angle of the most reliable mode) over the year or the selected month.
function angleSamples(months,frequency){const out=[];for(const m of months){if(m.ssn===null)continue;for(const h of m.hours){const v=annualRow(h,frequency);if(v&&v.takeoff_deg!=null&&(v.reliability??0)>0)out.push({month:m,hour:h.hour_utc,angle:v.takeoff_deg,rel:v.reliability});}}return out;}
function anglePercentile(sorted,q){if(!sorted.length)return null;const i=(sorted.length-1)*q,lo=Math.floor(i),hi=Math.ceil(i);return sorted[lo]+(sorted[hi]-sorted[lo])*(i-lo);}
function renderAngles(){
 const r=annualResult;if(!r)return;const frequency=$('annual-frequency').value,target=r.parameters.reliability,year=$('angle-period').value==='year';
 const months=year?r.months:r.months.filter(m=>m.year===annualSelected.year&&m.month===annualSelected.month),samples=angleSamples(months,frequency),met=samples.filter(s=>s.rel>=target);
 const period=year?`${annualLabel(r.months[0])}〜${annualLabel(r.months[r.months.length-1])}`:annualLabel(months[0]);
 $('angle-caption').textContent=`${period} · ${frequency==='best'?'最良周波数':Number(frequency).toFixed(3)+' MHz'} · REL 1%以上 ${samples.length}時間`;
 const basis=met.length?met:samples,sorted=basis.map(s=>s.angle).sort((a,b)=>a-b),bins=new Map();for(const s of samples){const b=Math.floor(s.angle),e=bins.get(b)??{met:0,other:0};e[s.rel>=target?'met':'other']++;bins.set(b,e);}
 let mode=null;for(const [b,e] of bins){const n=met.length?e.met:e.met+e.other;if(n&&(mode===null||n>(met.length?bins.get(mode).met:bins.get(mode).met+bins.get(mode).other)))mode=b;}
 $('angle-summary').textContent=!samples.length?'伝搬する時間がありません。':`${met.length?'目標REL以上':'REL 1%以上'} ${basis.length}時間 · 中央値 ${fmt(anglePercentile(sorted,.5))}° · 10〜90%の範囲 ${fmt(anglePercentile(sorted,.1))}〜${fmt(anglePercentile(sorted,.9))}° · 最頻 ${mode}〜${mode+1}°`;
 const plot=$('angle-plot');plot.replaceChildren();
 if(samples.length){
  const max=Math.max(10,Math.ceil(Math.max(...samples.map(s=>s.angle))+1)),top=Math.max(...[...bins.values()].map(e=>e.met+e.other)),W=760,H=240,L=44,B=34,T=12,R=12,bw=(W-L-R)/max,yv=v=>H-B-(H-B-T)*v/top;
  const g=document.createElementNS(NS,'svg');g.setAttribute('viewBox',`0 0 ${W} ${H}`);g.setAttribute('role','img');g.setAttribute('aria-label','打上げ角の分布');plot.append(g);
  const step=top>40?10:top>10?5:1;for(let v=0;v<=top;v+=step){svg('line',{x1:L,x2:W-R,y1:yv(v),y2:yv(v),stroke:'#26384a','stroke-width':.6},g);svg('text',{x:L-6,y:yv(v)+3,fill:'#8da2b7','font-size':10,'text-anchor':'end'},g).textContent=v;}
  for(let a=0;a<=max;a+=max>40?10:5){const x=L+a*bw;svg('text',{x,y:H-B+14,fill:'#8da2b7','font-size':10,'text-anchor':'middle'},g).textContent=a+'°';}
  for(const [b,e] of bins){const x=L+b*bw+.5,w=Math.max(1,bw-1);if(e.met)svg('rect',{x,width:w,y:yv(e.met),height:yv(0)-yv(e.met),fill:'#38e1ff'},g);if(e.other)svg('rect',{x,width:w,y:yv(e.met+e.other),height:yv(e.met)-yv(e.met+e.other),fill:'#2c6f86'},g);
   svg('title',{},g.lastChild).textContent=`${b}〜${b+1}° / ${e.met} + ${e.other} h`;}
  svg('text',{x:(L+W-R)/2,y:H-4,fill:'#8da2b7','font-size':11,'text-anchor':'middle'},g).textContent='打上げ角 °';
  const yl=svg('text',{x:12,y:(T+H-B)/2,fill:'#8da2b7','font-size':11,'text-anchor':'middle',transform:`rotate(-90 12 ${(T+H-B)/2})`},g);yl.textContent='時間';
 }
 const table=document.createElement('table');table.className='heat annual-matrix';const head=document.createElement('tr');head.append(cell('th','月 / UTC'));for(let h=0;h<24;h++)head.append(cell('th',String(h).padStart(2,'0')));table.append(head);
 for(const m of months){const tr=document.createElement('tr');tr.append(cell('th',annualLabel(m)));for(let h=0;h<24;h++){const v=m.ssn===null?null:annualRow(m.hours.find(x=>x.hour_utc===h),frequency),rel=v?.reliability??null,show=v&&v.takeoff_deg!=null&&(rel??0)>0,td=cell('td',show?fmt(v.takeoff_deg,0):'—');annualPaint(td,show?rel:null);td.title=`${annualLabel(m)} / ${h}:00 UTC / ${v?v.frequency_mhz+' MHz':'—'} / ${show?fmt(v.takeoff_deg)+'°':'—'} / REL ${fmt(rel)}%`;tr.append(td);}table.append(tr);}
 $('angle-table').replaceChildren(table);
}
$('angle-period').onchange=renderAngles;
$('annual-frequency').onchange=renderAnnual;
function openAnnual(r){annualResult=r;annualSelected=null;coverageResult=null;tab('annual');showAnnual();}
$('compute-annual').onclick=async()=>{
 if(busy)return;if(!form.checkValidity()){tab('conditions-tab');form.reportValidity();return;}if(!$('station-selection').reportValidity())return;
 try{
  validateCircuit();if(meshMode())throw Error('12か月予測は単一RXの経路で計算します。メッシュを外してください。');
  if(fields.ssn_source.value==='effective')throw Error('12か月予測では実効SSNを使えません。手動入力かNOAAの平滑SSNを選んでください。');
  const p={...params(),ui_selection:circuitSnapshot()};setBusy(true);notice('12か月分を計算しています。エンジンを12回実行するため、完了までお待ちください…');
  annualResult=await post('/api/annual',p);annualSelected=null;coverageResult=null;showAnnual();notice('計算完了。条件と結果を履歴に保存しました。');
 }catch(e){notice(e.message,true);}finally{setBusy(false);}
};
