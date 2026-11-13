'use strict';
// 24-hour operating plans for diversity (receiving site + frequency) and mesh (per path, or one common frequency) results.
// Built from the saved result in the browser with the same cyclic programme as the single-link plan; no engine runs.
let diversityPlan=null,meshPlan=null;
const opsPad=h=>String(h).padStart(2,'0');
const opsKnown=v=>v!==null&&v!==undefined;
const opsSpan=(first,last)=>`${opsPad(first)}:00–${opsPad(last+1)}:00`;
function opsRange(values){const v=values.filter(opsKnown).map(Math.round);if(!v.length)return '—';const lo=Math.min(...v),hi=Math.max(...v);return lo===hi?String(lo):`${lo}–${hi}`;}
function opsRowIndex(hours){
 // hour → frequency → row, so missing hours or frequencies read as no value.
 const index=new Map();for(const h of hours??[]){const m=new Map();for(const v of h.rows)m.set(v.frequency_mhz,v);index.set(h.hour_utc,m);}return index;
}
function opsBetter(a,b){
 // Highest REL, then highest SNR; unknown REL never wins.
 if(!a||!opsKnown(a.reliability))return false;if(!b||!opsKnown(b.reliability))return true;
 return a.reliability>b.reliability||(a.reliability===b.reliability&&(a.snr_db_hz??-Infinity)>(b.snr_db_hz??-Infinity));
}
function opsBlocks(hours,key){
 const blocks=[];for(const h of hours){const last=blocks[blocks.length-1];if(last&&last.key===key(h))last.hours.push(h);else blocks.push({key:key(h),hours:[h]});}
 // A block running through 23:00 continues into the 00:00 block on the next day.
 if(blocks.length>1&&blocks[0].key===blocks[blocks.length-1].key){const tail=blocks.pop();blocks[0].hours=[...tail.hours,...blocks[0].hours];}
 return blocks;
}
function opsSwitches(hours,key){return hours.length<2?0:hours.filter((h,i)=>key(h)!==key(hours[(i+hours.length-1)%hours.length])).length;}
function opsCsv(lines,name){
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([lines.join('\r\n')+'\r\n'],{type:'text/csv'}));a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
const opsQuote=v=>/[",\r\n]/.test(String(v))?`"${String(v).replace(/"/g,'""')}"`:String(v);
function opsPrint(panel,ids){
 // A separate plain page keeps the dark workspace out of print; the text is already in the UI language.
 const w=window.open('','_blank');if(!w){notice('印刷用のウィンドウを開けませんでした。ポップアップの許可を確認してください。',true);return;}
 const d=w.document;d.documentElement.lang=document.documentElement.lang;d.title=$(panel).querySelector('h3').textContent;
 const style=d.createElement('style');style.textContent='body{font:12px/1.6 "Hiragino Sans","Hiragino Kaku Gothic ProN","Meiryo","Yu Gothic","Noto Sans JP",sans-serif;color:#000;margin:24px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:4px 8px;text-align:left}th{background:#eee}';d.head.append(style);
 const title=d.createElement('h1');title.style.fontSize='16px';title.textContent=d.title;d.body.append(title);
 for(const id of ids.slice(0,-1)){const p=d.createElement('p');p.textContent=$(id).textContent;d.body.append(p);}
 d.body.append(d.importNode($(ids[ids.length-1]).querySelector('table'),true));
 w.focus();w.print();
}
function opsTable(headers){const table=document.createElement('table');table.className='plan-table';const head=document.createElement('tr');for(const t of headers)head.append(cell('th',t));table.append(head);return table;}

// Diversity: one TX frequency and one receiving site per hour.
function diversityPlanStates(r){
 const sites=r.sites.map(s=>({site:s,index:opsRowIndex(s.hours)})),states=[];
 for(const s of sites)for(const f of r.parameters.frequencies)states.push({site:s.site,frequency:f,index:s.index});
 return states;
}
function buildDiversityPlan(r,mode){
 const target=r.parameters.reliability,states=diversityPlanStates(r),hours=[...Array(24).keys()];
 const row=(s,h)=>s.index.get(h)?.get(s.frequency)??null;
 let choice;
 if(mode==='hourly')choice=hours.map(h=>{let best=0;states.forEach((s,i)=>{if(opsBetter(row(s,h),row(states[best],h)))best=i;});return best;});
 else{
  // Most hours at the target REL, then fewest frequency changes, then fewest site changes, then highest total REL.
  const UNMET=1e9,FREQUENCY=1e6,SITE=1e4;
  const cost=hours.map(h=>states.map(s=>{const rel=row(s,h)?.reliability??null;return (rel!==null&&rel>=target?0:UNMET)-(rel??0);}));
  choice=planCyclic(cost,(g,f)=>(states[g].frequency===states[f].frequency?0:FREQUENCY)+(states[g].site.id===states[f].site.id?0:SITE));
 }
 return hours.map((h,t)=>{const s=states[choice[t]],v=row(s,h);return {hour:h,site:s.site,frequency:s.frequency,row:v,meets:opsKnown(v?.reliability)&&v.reliability>=target};});
}
const diversityPlanModes={steady:'切替を抑える',hourly:'毎時最良'};
function renderDiversityPlan(){
 const r=diversityResult;if(!r)return;
 const mode=$('diversity-plan-mode').value,hours=buildDiversityPlan(r,mode),p=r.parameters,met=hours.filter(h=>h.meets).length;
 diversityPlan={mode,hours,id:r.id};
 $('diversity-plan-caption').textContent=`${p.year}/${p.month} · SSN ${p.ssn} · 目標REL ${p.reliability}% · RX ${r.sites.length} · 割当 ${p.frequencies.length} 波`;
 $('diversity-plan-summary').textContent=`周波数の切替 ${opsSwitches(hours,h=>h.frequency)} 回 · 受信局の切替 ${opsSwitches(hours,h=>h.site.id)} 回 · 目標REL以上 ${met} / ${hours.length} 時間 · 方針: ${diversityPlanModes[mode]}`;
 const table=opsTable(['時間帯 UTC','周波数 MHz','受信局','REL %','最低SNR dB·Hz','目標REL未達']);
 for(const b of opsBlocks(hours,h=>h.site.id+'|'+h.frequency)){
  const first=b.hours[0],last=b.hours[b.hours.length-1],snrs=b.hours.map(h=>h.row?.snr_db_hz).filter(opsKnown),unmet=b.hours.filter(h=>!h.meets).length,tr=document.createElement('tr');
  tr.append(cell('td',opsSpan(first.hour,last.hour)),cell('td',first.frequency.toFixed(3)),resultSiteName(first.site.name,document.createElement('td')),cell('td',opsRange(b.hours.map(h=>h.row?.reliability))),cell('td',snrs.length?fmt(Math.min(...snrs)):'—'),cell('td',`${unmet} 時間`));
  tr.classList.toggle('plan-unmet',unmet>0);table.append(tr);
 }
 $('diversity-plan-table').classList.remove('empty');$('diversity-plan-table').replaceChildren(table);
 $('diversity-plan-csv').disabled=false;$('diversity-plan-print').disabled=false;
}
$('diversity-plan-mode').onchange=renderDiversityPlan;
$('diversity-plan-csv').onclick=()=>{
 if(!diversityPlan)return;const lines=['hour_utc,frequency_mhz,rx_site_id,rx_site,reliability,snr_db_hz,meets_target,frequency_switch,site_switch'];
 diversityPlan.hours.forEach((h,i,all)=>{const prev=all[(i+all.length-1)%all.length];lines.push([h.hour,h.frequency,h.site.id,opsQuote(h.site.name),h.row?.reliability??'',h.row?.snr_db_hz??'',h.meets?1:0,all.length>1&&prev.frequency!==h.frequency?1:0,all.length>1&&prev.site.id!==h.site.id?1:0].join(','));});
 opsCsv(lines,`diversity-plan-${diversityPlan.id??'result'}-${diversityPlan.mode}.csv`);
};
$('diversity-plan-print').onclick=()=>opsPrint('diversity-plan',['diversity-plan-caption','diversity-plan-summary','diversity-plan-table']);

// Mesh: a frequency plan for each directed path, or one common frequency for every path.
function meshPlanLinks(r){return r.links.map(l=>({link:l,index:opsRowIndex(l.hours)}));}
function meshPlanPath(r,item,mode){
 const target=r.parameters.reliability,fs=r.parameters.frequencies,hours=[...Array(24).keys()],row=(h,f)=>item.index.get(h)?.get(f)??null;
 let choice;
 if(mode==='hourly')choice=hours.map(h=>{let best=0;fs.forEach((f,i)=>{if(opsBetter(row(h,f),row(h,fs[best])))best=i;});return best;});
 else{const UNMET=1e7,SWITCH=1e4;choice=planCyclic(hours.map(h=>fs.map(f=>{const rel=row(h,f)?.reliability??null;return (rel!==null&&rel>=target?0:UNMET)-(rel??0);})),(g,f)=>g===f?0:SWITCH);}
 return hours.map((h,t)=>{const f=fs[choice[t]],v=row(h,f);return {hour:h,frequency:f,row:v,meets:opsKnown(v?.reliability)&&v.reliability>=target};});
}
function meshPlanCommon(r,items){
 // One net frequency per hour: most path-hours at the target REL, then fewest changes, then highest total REL.
 const target=r.parameters.reliability,fs=r.parameters.frequencies,hours=[...Array(24).keys()],UNMET=1e8,SWITCH=1e6;
 const cost=hours.map(h=>fs.map(f=>items.reduce((sum,item)=>{const rel=item.index.get(h)?.get(f)?.reliability??null;return sum+(rel!==null&&rel>=target?0:UNMET)-(rel??0);},0)));
 const choice=planCyclic(cost,(g,f)=>g===f?0:SWITCH);
 return hours.map((h,t)=>{const f=fs[choice[t]],rows=items.map(item=>item.index.get(h)?.get(f)??null);return {hour:h,frequency:f,rows,met:rows.filter(v=>opsKnown(v?.reliability)&&v.reliability>=target).length};});
}
const meshPlanModes={steady:'経路ごと · 切替を抑える',hourly:'経路ごと · 毎時最良',common:'全経路で共通の周波数'};
function renderMeshPlan(){
 const r=meshResult;if(!r)return;
 const mode=$('mesh-plan-mode').value,items=meshPlanLinks(r),p=r.parameters,n=items.length;
 const name=id=>r.sites.find(s=>s.id===id).name;
 $('mesh-plan-caption').textContent=`${p.year}/${p.month} · SSN ${p.ssn} · 目標REL ${p.reliability}% · 拠点 ${r.sites.length} · 経路 ${n} · 割当 ${p.frequencies.length} 波`;
 let table;
 if(mode==='common'){
  const hours=meshPlanCommon(r,items),all=hours.filter(h=>h.met===n).length;
  meshPlan={mode,id:r.id,rows:items.flatMap((item,i)=>hours.map((h,t)=>({hour:h.hour,link:item.link,frequency:h.frequency,row:h.rows[i],switch:hours.length>1&&hours[(t+hours.length-1)%hours.length].frequency!==h.frequency})))};
  $('mesh-plan-summary').textContent=`切替 ${opsSwitches(hours,h=>h.frequency)} 回 · 全経路が目標REL以上 ${all} / ${hours.length} 時間 · 方針: ${meshPlanModes[mode]}`;
  table=opsTable(['時間帯 UTC','周波数 MHz','目標REL以上の経路','最低REL %']);
  for(const b of opsBlocks(hours,h=>h.frequency)){
   const first=b.hours[0],last=b.hours[b.hours.length-1],counts=b.hours.map(h=>h.met),rels=b.hours.flatMap(h=>h.rows.map(v=>v?.reliability)).filter(opsKnown),tr=document.createElement('tr'),lo=Math.min(...counts),hi=Math.max(...counts);
   tr.append(cell('td',opsSpan(first.hour,last.hour)),cell('td',first.frequency.toFixed(3)),cell('td',`${lo===hi?lo:lo+'–'+hi} / ${n}`),cell('td',rels.length?String(Math.round(Math.min(...rels))):'—'));
   tr.classList.toggle('plan-unmet',lo<n);table.append(tr);
  }
 }else{
  const plans=items.map(item=>({link:item.link,hours:meshPlanPath(r,item,mode)})),met=plans.reduce((s,pl)=>s+pl.hours.filter(h=>h.meets).length,0),switches=plans.reduce((s,pl)=>s+opsSwitches(pl.hours,h=>h.frequency),0);
  meshPlan={mode,id:r.id,rows:plans.flatMap(pl=>pl.hours.map((h,t,all)=>({hour:h.hour,link:pl.link,frequency:h.frequency,row:h.row,switch:all.length>1&&all[(t+all.length-1)%all.length].frequency!==h.frequency})))};
  $('mesh-plan-summary').textContent=`全経路の切替 ${switches} 回 · 目標REL以上 ${met} / ${n*24} 経路時間 · 方針: ${meshPlanModes[mode]}`;
  table=opsTable(['送信拠点','受信拠点','周波数の計画（UTC）','切替 回','目標REL未達']);
  for(const pl of plans){
   const unmet=pl.hours.filter(h=>!h.meets).length,tr=document.createElement('tr'),schedule=opsBlocks(pl.hours,h=>h.frequency).map(b=>`${opsSpan(b.hours[0].hour,b.hours[b.hours.length-1].hour)} ${b.key.toFixed(3)}`).join(' / ');
   tr.append(resultSiteName(name(pl.link.tx_id),document.createElement('td')),resultSiteName(name(pl.link.rx_id),document.createElement('td')),cell('td',schedule),cell('td',String(opsSwitches(pl.hours,h=>h.frequency))),cell('td',`${unmet} 時間`));
   tr.classList.toggle('plan-unmet',unmet>0);table.append(tr);
  }
 }
 $('mesh-plan-table').classList.remove('empty');$('mesh-plan-table').replaceChildren(table);
 $('mesh-plan-csv').disabled=false;$('mesh-plan-print').disabled=false;
}
$('mesh-plan-mode').onchange=renderMeshPlan;
$('mesh-plan-csv').onclick=()=>{
 if(!meshPlan||!meshResult)return;const name=id=>meshResult.sites.find(s=>s.id===id).name,target=meshResult.parameters.reliability;
 const lines=['hour_utc,tx_id,tx_name,rx_id,rx_name,frequency_mhz,reliability,snr_db_hz,meets_target,switch'];
 for(const v of meshPlan.rows)lines.push([v.hour,v.link.tx_id,opsQuote(name(v.link.tx_id)),v.link.rx_id,opsQuote(name(v.link.rx_id)),v.frequency,v.row?.reliability??'',v.row?.snr_db_hz??'',opsKnown(v.row?.reliability)&&v.row.reliability>=target?1:0,v.switch?1:0].join(','));
 opsCsv(lines,`mesh-plan-${meshPlan.id??'result'}-${meshPlan.mode}.csv`);
};
$('mesh-plan-print').onclick=()=>opsPrint('mesh-plan',['mesh-plan-caption','mesh-plan-summary','mesh-plan-table']);
