'use strict';
// Directed TX×RX matrix of a mesh result; the UTC slider moves the whole matrix in time.
let meshResult=null,meshSelected=null,meshTimer=null;
const meshSite=id=>meshResult.sites.find(s=>s.id===id);
const meshLink=(tx,rx)=>meshResult.links.find(l=>l.tx_id===tx&&l.rx_id===rx);
const meshPad=h=>String(h).padStart(2,'0')+':00';
function meshBest(rows){
 // Same rule as the single-link best frequency: highest REL, then highest SNR.
 let best=null;for(const r of rows){if(r.reliability===null||r.reliability===undefined)continue;if(!best||r.reliability>best.reliability||(r.reliability===best.reliability&&(r.snr_db_hz??-Infinity)>(best.snr_db_hz??-Infinity)))best=r;}return best;
}
function meshRow(link,hour,frequency){const h=link.hours.find(h=>h.hour_utc===hour);if(!h)return null;return frequency==='best'?meshBest(h.rows):h.rows.find(r=>r.frequency_mhz===Number(frequency))??null;}
function meshRelayRoute(hour,frequency,tx,rx,relays){
 // Shortest chain of hops that each meet the target REL at this UTC (fewest relays, then highest weakest hop).
 // Each hop uses the chosen frequency, or its own best frequency; nothing is combined into an end-to-end REL.
 const target=meshResult.parameters.reliability,hop=(a,b)=>{const v=meshRow(meshLink(a,b),hour,frequency);return v&&v.reliability!==null&&v.reliability!==undefined&&v.reliability>=target?v:null;};
 let best=null;
 const walk=(path,rows)=>{
  const last=path[path.length-1],v=hop(last,rx);
  if(v){const all=[...rows,v],weakest=Math.min(...all.map(r=>r.reliability));if(!best||all.length<best.rows.length||(all.length===best.rows.length&&weakest>best.weakest))best={ids:[...path,rx],rows:all,weakest};}
  if(path.length>relays)return;
  for(const s of meshResult.sites){if(path.includes(s.id)||s.id===rx)continue;const w=hop(last,s.id);if(w)walk([...path,s.id],[...rows,w]);}
 };
 walk([tx],[]);return best;
}
function meshRouteText(route){return route.ids.map(id=>meshSite(id).name).join(' → ');}
function meshName(id){const th=cell('th',meshSite(id).name);th.dataset.userContent='true';return th;}
function meshPaint(td,rel){td.style.background=color(rel);td.style.color=(rel??0)>55?'#062b25':'#d6e7f1';}
function showMesh(){
 const r=meshResult;if(!r)return;const p=r.parameters,powers=r.sites.map(s=>s.power_w),low=Math.min(...powers),high=Math.max(...powers);
 $('mesh-caption').textContent=`${p.year}/${p.month} · SSN ${p.ssn} (${p.ssn_source}) · ${low===high?low:low+'〜'+high} W · 要求SNR ${p.required_snr} dB·Hz · 目標REL ${p.reliability}% · 拠点 ${r.sites.length} · 表示は計算時点の条件です。`;
 $('mesh-note').textContent=r.note;
 $('mesh-exports').replaceChildren();for(const type of ['csv','json']){const a=cell('a',type.toUpperCase()+'出力');a.href=`/api/results/${r.id}/${type}`;a.download='';$('mesh-exports').append(a);}$('mesh-exports').hidden=false;
 const select=$('mesh-frequency'),previous=select.value;select.replaceChildren(new Option('最良周波数','best'),...p.frequencies.map(f=>new Option(f.toFixed(3)+' MHz',String(f))));select.value=[...select.options].some(o=>o.value===previous)?previous:'best';
 if(!meshSelected||!meshLink(meshSelected.tx,meshSelected.rx))meshSelected={tx:r.links[0].tx_id,rx:r.links[0].rx_id};
 renderMeshMatrix();drawMap();
}
function renderMeshMatrix(){
 const r=meshResult;if(!r)return;const hour=Number($('mesh-hour').value),frequency=$('mesh-frequency').value,target=r.parameters.reliability,relays=Number($('mesh-relays').value);
 $('mesh-hour-label').textContent=meshPad(hour)+' UTC';
 const table=document.createElement('table');table.className='heat mesh-matrix';const head=document.createElement('tr');head.append(cell('th','TX ＼ RX'));for(const s of r.sites)head.append(meshName(s.id));table.append(head);
 let meeting=0,both=0,relayed=0;
 for(const tx of r.sites){
  const tr=document.createElement('tr');tr.append(meshName(tx.id));
  for(const rx of r.sites){
   const td=document.createElement('td');
   if(tx===rx){td.className='mesh-self';td.textContent='—';tr.append(td);continue;}
   const v=meshRow(meshLink(tx.id,rx.id),hour,frequency),rel=v?.reliability??null,button=cell('button',rel===null?'—':Math.round(rel)+(rel>=target?'·':''));
   if(rel!==null&&rel>=target){meeting++;const back=meshRow(meshLink(rx.id,tx.id),hour,frequency)?.reliability;if(back!==null&&back!==undefined&&back>=target)both++;}
   if(frequency==='best'&&v)button.append(cell('small',v.frequency_mhz.toFixed(1)));
   button.title=`${tx.name} → ${rx.name} / ${hour}:00 UTC / ${v?v.frequency_mhz+' MHz':'—'} / REL ${fmt(rel)}% / SNR ${fmt(v?.snr_db_hz)} dB·Hz`;
   const route=relays&&!(rel>=target)?meshRelayRoute(hour,frequency,tx.id,rx.id,relays):null;
   if(route){relayed++;td.classList.add('mesh-relay');button.append(cell('i','↻'+(route.ids.length-2)));button.title=`${button.title} / 中継${route.ids.length-2}段: ${meshRouteText(route)}`;}
   button.onclick=()=>{meshSelected={tx:tx.id,rx:rx.id};renderMeshMatrix();};
   meshPaint(td,rel);td.classList.toggle('selected',meshSelected?.tx===tx.id&&meshSelected?.rx===rx.id);td.append(button);tr.append(td);
  }
  table.append(tr);
 }
 $('mesh-matrix').replaceChildren(table);
 const n=r.sites.length;
 $('mesh-summary').textContent=`目標REL ${target}% 以上: ${meeting} / ${n*(n-1)} 経路 · 双方向とも: ${both/2} / ${n*(n-1)/2} 組`;
 $('mesh-relay-summary').hidden=!relays;$('mesh-relay-summary').textContent=`中継で到達: ${relayed} 経路 · 到達不可: ${n*(n-1)-meeting-relayed} 経路（${relays}段まで）`;
 renderMeshLink();
}
function renderMeshLink(){
 const r=meshResult;if(!r||!meshSelected)return;const link=meshLink(meshSelected.tx,meshSelected.rx);if(!link)return;
 const hour=Number($('mesh-hour').value),frequency=$('mesh-frequency').value,tx=meshSite(link.tx_id),rx=meshSite(link.rx_id);
 const title=$('mesh-link-title');title.replaceChildren();for(const [text,user]of [[tx.name,true],[' → ',false],[rx.name,true],[` · ${link.distance_km} km · ${link.bearing_deg} ° · ${tx.antenna} → ${(rx.receive??rx).antenna}`,false]]){const span=cell('span',text);if(user)span.dataset.userContent='true';title.append(span);}
 const table=document.createElement('table');table.className='heat';const head=document.createElement('tr');head.append(cell('th','MHz / UTC'));for(let h=0;h<24;h++){const th=cell('th',String(h).padStart(2,'0'));th.classList.toggle('selected',h===hour);head.append(th);}table.append(head);
 for(const f of r.parameters.frequencies){
  const tr=document.createElement('tr'),label=cell('th',f.toFixed(3));label.classList.toggle('selected',frequency===String(f));tr.append(label);
  for(const h of link.hours){const v=h.rows.find(v=>v.frequency_mhz===f),rel=v?.reliability??null,td=document.createElement('td'),button=cell('button',rel===null?'—':Math.round(rel)+(rel>=r.parameters.reliability?'·':''));meshPaint(td,rel);td.classList.toggle('selected',h.hour_utc===hour);button.title=`${h.hour_utc}:00 UTC / ${f} MHz / REL ${fmt(rel)}% / SNR ${fmt(v?.snr_db_hz)} dB·Hz / MUF ${fmt(h.muf_mhz)} MHz`;button.onclick=()=>{stopMeshPlay();$('mesh-hour').value=h.hour_utc;$('mesh-frequency').value=String(f);renderMeshMatrix();};td.append(button);tr.append(td);}
  table.append(tr);
 }
 $('mesh-link-heatmap').replaceChildren(table);
 renderMeshRelay(link,hour,frequency);
}
function renderMeshRelay(link,hour,frequency){
 // The chain for the selected pair at the matrix time; names stay untranslated.
 const out=$('mesh-relay-route'),relays=Number($('mesh-relays').value),target=meshResult.parameters.reliability;out.replaceChildren();out.hidden=!relays;if(!relays)return;
 const direct=meshRow(link,hour,frequency)?.reliability;
 if(direct!==null&&direct!==undefined&&direct>=target){out.append(cell('span','直通で目標RELを満たします'));return;}
 const route=meshRelayRoute(hour,frequency,link.tx_id,link.rx_id,relays);
 if(!route){out.append(cell('span',`${relays}段までの中継でも目標RELを満たす経路はありません`));return;}
 out.append(cell('span',`中継経路（${route.ids.length-2}段）:`),' ');
 route.ids.forEach((id,i)=>{if(i)out.append(' → ');const name=cell('span',meshSite(id).name);name.dataset.userContent='true';out.append(name);});
 out.append(cell('span',` · 区間REL ${route.rows.map(v=>Math.round(v.reliability)).join(' / ')}% · ${route.rows.map(v=>v.frequency_mhz.toFixed(1)).join(' / ')} MHz`));
}
function stopMeshPlay(){if(meshTimer){clearInterval(meshTimer);meshTimer=null;}$('mesh-play').textContent='▶ 再生';}
$('mesh-play').onclick=()=>{if(meshTimer){stopMeshPlay();return;}if(!meshResult)return;$('mesh-play').textContent='■ 停止';meshTimer=setInterval(()=>{if($('mesh').hidden){stopMeshPlay();return;}$('mesh-hour').value=(Number($('mesh-hour').value)+1)%24;renderMeshMatrix();},800);};
$('mesh-hour').value=new Date().getUTCHours();
$('mesh-hour').oninput=renderMeshMatrix;$('mesh-frequency').onchange=renderMeshMatrix;$('mesh-relays').onchange=renderMeshMatrix;
$('mesh-reverse').onclick=()=>{if(meshSelected){meshSelected={tx:meshSelected.rx,rx:meshSelected.tx};renderMeshMatrix();}};
function openMesh(r){meshResult=r;meshSelected=null;coverageResult=null;tab('mesh');showMesh();}
