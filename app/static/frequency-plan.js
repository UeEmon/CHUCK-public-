'use strict';
// 24-hour operating frequency plan from a single-link result: the calculated frequencies are the assigned set.
let frequencyPlan=null;
const planModes={steady:'切替を抑える',hourly:'毎時最良'};
function planHours(r){return [...r.hours].sort((a,b)=>a.hour_utc-b.hour_utc);}
function planHourly(r){
 // Same rule as the recommended frequency: highest REL, then highest SNR.
 const target=r.parameters.reliability;
 return planHours(r).map(h=>{let best=null;for(const v of h.rows){if(v.reliability===null||v.reliability===undefined)continue;if(!best||v.reliability>best.reliability||(v.reliability===best.reliability&&(v.snr_db_hz??-Infinity)>(best.snr_db_hz??-Infinity)))best=v;}return {hour:h.hour_utc,row:best??h.rows[0],meets:!!best&&best.reliability>=target};});
}
function planSteady(r){
 // Cyclic dynamic programme: most hours at the target REL first, then fewest switches (23→00 included), then highest total REL.
 const target=r.parameters.reliability,hours=planHours(r),n=r.parameters.frequencies.length,UNMET=1e7,SWITCH=1e4;
 const cost=hours.map(h=>h.rows.map(v=>{const rel=v.reliability??null;return (rel!==null&&rel>=target?0:UNMET)-(rel??0);}));
 let best=null;
 for(let start=0;start<n;start++){
  let score=cost[0].map((c,f)=>f===start?c:Infinity);const from=[];
  for(let t=1;t<hours.length;t++){
   const next=[],back=[];
   for(let f=0;f<n;f++){let low=Infinity,arg=0;for(let g=0;g<n;g++){const s=score[g]+(g===f?0:SWITCH);if(s<low){low=s;arg=g;}}next.push(low+cost[t][f]);back.push(arg);}
   score=next;from.push(back);
  }
  for(let f=0;f<n;f++){const s=score[f]+(f===start||hours.length<2?0:SWITCH);if(!best||s<best.score)best={score:s,last:f,from};}
 }
 const choice=new Array(hours.length);choice[hours.length-1]=best.last;
 for(let t=hours.length-1;t>0;t--)choice[t-1]=best.from[t-1][choice[t]];
 return hours.map((h,t)=>{const v=h.rows[choice[t]];return {hour:h.hour_utc,row:v,meets:v.reliability!==null&&v.reliability!==undefined&&v.reliability>=target};});
}
function planBlocks(hours){
 const blocks=[];for(const h of hours){const last=blocks[blocks.length-1];if(last&&last.frequency===h.row.frequency_mhz)last.hours.push(h);else blocks.push({frequency:h.row.frequency_mhz,hours:[h]});}
 // A block running through 23:00 continues into the 00:00 block on the next day.
 if(blocks.length>1&&blocks[0].frequency===blocks[blocks.length-1].frequency){const tail=blocks.pop();blocks[0].hours=[...tail.hours,...blocks[0].hours];}
 return blocks;
}
function planSwitches(hours){return hours.length<2?0:hours.filter((h,i)=>h.row.frequency_mhz!==hours[(i+hours.length-1)%hours.length].row.frequency_mhz).length;}
function renderFrequencyPlan(){
 const r=result;if(!r){return;}
 const mode=$('plan-mode').value,hours=mode==='hourly'?planHourly(r):planSteady(r),blocks=planBlocks(hours),p=r.parameters,met=hours.filter(h=>h.meets).length;
 frequencyPlan={mode,hours,id:r.id};
 $('plan-caption').textContent=`${p.year}/${p.month} · SSN ${p.ssn} · 目標REL ${p.reliability}% · ${r.distance_km} km · 割当 ${p.frequencies.length} 波`;
 $('plan-summary').textContent=`切替 ${planSwitches(hours)} 回 · 目標REL以上 ${met} / ${hours.length} 時間 · 方針: ${planModes[mode]}`;
 const table=document.createElement('table');table.className='plan-table';const head=document.createElement('tr');
 for(const t of ['時間帯 UTC','周波数 MHz','REL %','最低SNR dB·Hz','目標REL未達'])head.append(cell('th',t));table.append(head);
 const pad=h=>String(h).padStart(2,'0');
 for(const b of blocks){
  const tr=document.createElement('tr'),first=b.hours[0].hour,last=b.hours[b.hours.length-1].hour,rels=b.hours.map(h=>h.row.reliability).filter(v=>v!==null&&v!==undefined),snrs=b.hours.map(h=>h.row.snr_db_hz).filter(v=>v!==null&&v!==undefined),unmet=b.hours.filter(h=>!h.meets).length;
  tr.append(cell('td',`${pad(first)}:00–${pad(last+1)}:00`),cell('td',b.frequency.toFixed(3)),
   cell('td',rels.length?(Math.round(Math.min(...rels))===Math.round(Math.max(...rels))?String(Math.round(Math.min(...rels))):`${Math.round(Math.min(...rels))}–${Math.round(Math.max(...rels))}`):'—'),
   cell('td',snrs.length?fmt(Math.min(...snrs)):'—'),cell('td',`${unmet} 時間`));
  tr.classList.toggle('plan-unmet',unmet>0);table.append(tr);
 }
 $('plan-table').classList.remove('empty');$('plan-table').replaceChildren(table);
 $('plan-csv').disabled=false;$('plan-print').disabled=false;
}
function planCsv(){
 if(!frequencyPlan)return;const lines=['hour_utc,frequency_mhz,reliability,snr_db_hz,meets_target,switch'];
 frequencyPlan.hours.forEach((h,i,all)=>{const previous=all[(i+all.length-1)%all.length];lines.push([h.hour,h.row.frequency_mhz,h.row.reliability??'',h.row.snr_db_hz??'',h.meets?1:0,all.length>1&&previous.row.frequency_mhz!==h.row.frequency_mhz?1:0].join(','));});
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([lines.join('\r\n')+'\r\n'],{type:'text/csv'}));a.download=`frequency-plan-${frequencyPlan.id??'result'}-${frequencyPlan.mode}.csv`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
$('plan-mode').onchange=renderFrequencyPlan;$('plan-csv').onclick=planCsv;
$('plan-print').onclick=()=>{
 // A separate plain page keeps the dark workspace out of print; the text is already in the UI language.
 const w=window.open('','_blank');if(!w){notice('印刷用のウィンドウを開けませんでした。ポップアップの許可を確認してください。',true);return;}
 const d=w.document;d.documentElement.lang=document.documentElement.lang;d.title=$('frequency-plan').querySelector('h3').textContent;
 const style=d.createElement('style');style.textContent='body{font:12px/1.6 system-ui,sans-serif;color:#000;margin:24px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:4px 8px;text-align:left}th{background:#eee}';d.head.append(style);
 const title=d.createElement('h1');title.style.fontSize='16px';title.textContent=d.title;d.body.append(title);
 for(const id of ['plan-caption','plan-summary']){const p=d.createElement('p');p.textContent=$(id).textContent;d.body.append(p);}
 d.body.append(d.importNode($('plan-table').querySelector('table'),true));
 w.focus();w.print();
};
