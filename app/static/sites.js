'use strict';
// Candidate receive or relay sites of the current TX, ranked by the hours they reach the target REL.
let sitesResult=null;
const SITE_MAX=10,siteChoice=new Set();
function siteOptions(){
 // Fixed locations only: a mobile station has no single position to compare.
 const used=new Set([circuit.tx.location_id,circuit.rxs[0]?.location_id]);
 return allLocations().filter(p=>p.kind!=='mobile'&&!used.has(p.id));
}
function siteName(p,node){node.textContent=displayedPresetName(p);if(!isOriginalPreset(p))node.dataset.userContent='true';return node;}
function renderSiteCandidates(){
 const options=siteOptions();for(const id of [...siteChoice])if(!options.some(p=>p.id===id))siteChoice.delete(id);
 const box=$('site-candidates');box.replaceChildren();
 for(const p of options){
  const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.value=p.id;input.checked=siteChoice.has(p.id);
  input.disabled=!input.checked&&siteChoice.size>=SITE_MAX;
  input.onchange=()=>{if(input.checked)siteChoice.add(p.id);else siteChoice.delete(p.id);renderSiteCandidates();};
  label.append(input,siteName(p,document.createElement('span')));box.append(label);
 }
 $('site-count').textContent=`${siteChoice.size} / ${SITE_MAX} か所を選択`;
}
function showSites(){
 const r=sitesResult;if(!r)return;const p=r.parameters,relay=r.site_mode==='relay';
 $('sites-caption').textContent=`${relay?'中継地点':'受信地点'} · ${p.year}/${p.month} · SSN ${p.ssn} · ${p.power_w} W · 目標REL ${p.reliability}%`;
 $('sites-note').textContent=r.note;
 $('sites-exports').replaceChildren();for(const type of ['csv','json']){const a=cell('a',type.toUpperCase()+'出力');a.href=`/api/results/${r.id}/${type}`;a.download='';$('sites-exports').append(a);}$('sites-exports').append(reportButton('sites'));$('sites-exports').hidden=false;
 const table=document.createElement('table');table.className='heat sites-matrix';const head=document.createElement('tr');
 for(const t of ['順位','地点',relay?'TX / RX1 km':'TX km'])head.append(cell('th',t));for(let h=0;h<24;h++)head.append(cell('th',String(h).padStart(2,'0')));head.append(cell('th','目標REL以上（時間）'),cell('th','平均REL %'));table.append(head);
 for(const c of r.candidates){
  const tr=document.createElement('tr'),preset=allLocations().find(v=>v.id===c.id&&v.name===c.name),name=cell('th','');
  if(preset)siteName(preset,name);else{name.textContent=c.name;name.dataset.userContent='true';}
  tr.append(cell('td',c.rank??'—'),name,cell('td',relay?`${fmt(c.distance_tx_km,0)} / ${fmt(c.distance_rx_km,0)}`:fmt(c.distance_tx_km,0)));
  if(c.skipped){const td=cell('td',c.skipped);td.colSpan=26;td.className='muted';tr.append(td);table.append(tr);continue;}
  for(const h of c.hours){const rel=h.reliability,td=cell('td',rel===null?'—':Math.round(rel)+(rel>=p.reliability?'·':''));td.style.background=relPercentFill(rel);td.style.color=relPercentInk(rel);td.title=`${h.hour_utc}:00 UTC / ${h.frequencies.map(f=>f===null?'—':f+' MHz').join(' → ')} / REL ${fmt(rel)}%`;tr.append(td);}
  tr.append(cell('td',String(c.hours_meeting)),cell('td',fmt(c.mean_reliability)));table.append(tr);
 }
 $('sites-table').classList.remove('empty');$('sites-table').replaceChildren(table);
}
function openSites(r){sitesResult=r;coverageResult=null;$('site-mode').value=r.site_mode;tab('sites');showSites();}
$('compute-sites').onclick=async()=>{
 if(busy)return;if(!form.checkValidity()){tab('conditions-tab');form.reportValidity();return;}if(!$('station-selection').reportValidity())return;
 try{
  validateCircuit();if(meshMode())throw Error('拠点の候補は単一RXの経路で計算します。メッシュを外してください。');
  const chosen=siteOptions().filter(p=>siteChoice.has(p.id));if(!chosen.length)throw Error('候補の地点を1か所以上選んでください。');
  const mode=$('site-mode').value,runs=chosen.length*(mode==='relay'?2:1);
  const p={...params(),ui_selection:circuitSnapshot(),site_mode:mode,candidates:chosen.map(c=>({id:c.id,name:c.name.slice(0,40),lat:c.lat,lon:c.lon}))};
  setBusy(true);notice(`候補地点を比較しています。エンジンを${runs}回実行するため、完了までお待ちください…`);
  sitesResult=await post('/api/sites',p);coverageResult=null;showSites();notice('計算完了。条件と結果を履歴に保存しました。');
 }catch(e){notice(e.message,true);}finally{setBusy(false);}
};
