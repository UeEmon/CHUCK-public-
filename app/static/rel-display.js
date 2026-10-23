'use strict';
// REL can be shown as a percentage (default) or as four grades.
// Grade thresholds are display settings only; the target REL input beside them is a calculation condition.
const relDefaults={excellent:90,good:80,poor:60};
const relGrades=[
 {key:'excellent',name:'EXCELLENT',short:'E',fill:'#2fd47a',ink:'#03200e'},
 {key:'good',name:'GOOD',short:'G',fill:'#c3e84b',ink:'#1d2903'},
 {key:'poor',name:'POOR',short:'P',fill:'#ffb13d',ink:'#2d1900'},
 {key:null,name:'NONE',short:'N',fill:'#ff5c6c',ink:'#2c0006'}
];
const relUnknownTint='#e9f1f7';
let relMode='percent',relThresholds={...relDefaults};
try{if(localStorage.getItem('hf-rel-display')==='grade')relMode='grade';}catch{/* Storage is optional. */}
function validRelThresholds(t){
 const ok=Object.keys(relDefaults).every(k=>Number.isFinite(t?.[k])&&t[k]>0&&t[k]<=100);
 return ok&&t.excellent>t.good&&t.good>t.poor;
}
try{const saved=JSON.parse(localStorage.getItem('hf-rel-thresholds'));if(validRelThresholds(saved))relThresholds={...relDefaults,...saved};}catch{/* Defaults apply. */}
const relKnown=v=>v!==null&&v!==undefined&&Number.isFinite(Number(v));
const relMin=g=>g.key?relThresholds[g.key]:-Infinity;
function relGrade(v){return relKnown(v)?relGrades.find(g=>Number(v)>=relMin(g)):null;}
// The dot that marks cells at or above the target REL of the shown result, in either mode.
function relMark(v,target){return relKnown(v)&&Number(v)>=target?'·':'';}
function relLegendTarget(e){const r=e.closest('#mesh')?(typeof meshResult!=='undefined'&&meshResult):(typeof result!=='undefined'&&result);return r?.parameters?.reliability??Number(fields.reliability.value);}
// style: 'cell' for heatmap buttons, 'table' for detail tables, 'label' for map text.
function relText(v,style='table'){
 if(!relKnown(v))return '—';
 if(relMode==='grade'){const g=relGrade(v);return style==='cell'?g.short:g.name;}
 return style==='cell'?String(Math.round(v)):style==='label'?Math.round(v)+'%':fmt(v);
}
function relFill(v){return relMode==='grade'&&relKnown(v)?relGrade(v).fill:color(v);}
function relInk(v){return relMode==='grade'&&relKnown(v)?relGrade(v).ink:(v??0)>55?'#062b25':'#d6e7f1';}
function relHeader(name){return name+(relMode==='grade'?' 段階':' %');}
function relTitle(v){const g=relGrade(v);return relKnown(v)?'REL '+fmt(v)+'% · '+g.name:'REL —';}
function samePlace(a,b){return Math.abs(a.lat-b.lat)<1e-4&&Math.abs(a.lon-b.lon)<1e-4;}
function sameEndpoint(endpoint,lat,lon,ref){
 if(endpoint.position_ref&&ref)return endpoint.position_ref.source===ref.source&&endpoint.position_ref.id===ref.id;
 return !endpoint.position_ref&&!ref&&samePlace(endpoint,{lat,lon});
}
function bestRow(rows){return rows.filter(r=>relKnown(r.reliability)).sort((a,b)=>b.reliability-a.reliability||(b.snr_db_hz??-999)-(a.snr_db_hz??-999))[0]??null;}
// REL of the computed TX→RX path shown on the map, for the hour selected in the visible result.
function relayReliability(tx,rx){
 const fromPoint=()=>{
  if(typeof result==='undefined'||!result?.hours)return null;const p=result.parameters;
  if(!sameEndpoint(tx,p.tx_lat,p.tx_lon,p.tx_position)||!sameEndpoint(rx,p.rx_lat,p.rx_lon,p.rx_position))return null;
  const hour=Number($('hour').value),h=result.hours.find(h=>h.hour_utc===hour);
  return h?{hour,row:bestRow(h.rows)}:null;
 };
 const fromDiversity=()=>{
  if(typeof diversityResult==='undefined'||!diversityResult)return null;const r=diversityResult,p=r.parameters;
  if(!sameEndpoint(tx,p.tx_lat,p.tx_lon,p.tx_position))return null;
  const index=(p.rx_sites??[]).findIndex(s=>sameEndpoint(rx,s.lat,s.lon,s.position_ref)),site=r.sites[index];
  const hour=Number($('diversity-hour').value),h=site?.hours.find(h=>h.hour_utc===hour);
  return h?{hour,row:bestRow(h.rows)}:null;
 };
 const fromMesh=()=>{
  if(typeof meshResult==='undefined'||!meshResult)return null;const site=e=>meshResult.sites.find(s=>sameEndpoint(e,s.lat,s.lon,s.position_ref));
  const a=site(tx),b=site(rx),link=a&&b&&meshLink(a.id,b.id);if(!link)return null;
  const hour=Number($('mesh-hour').value);return {hour,row:meshRow(link,hour,$('mesh-frequency').value)};
 };
 const visible=id=>$(id)&&!$(id).hidden;
 const order=visible('mesh')?[fromMesh,fromDiversity,fromPoint]:visible('diversity')?[fromDiversity,fromPoint,fromMesh]:[fromPoint,fromDiversity,fromMesh];
 for(const source of order){const found=source();if(found)return found;}
 return null;
}
function renderRelLegend(){
 const grade=relMode==='grade';
 for(const legend of document.querySelectorAll('.rel-grade-legend'))legend.replaceChildren(...relGrades.map((g,i)=>{
  const item=document.createElement('span'),swatch=document.createElement('b');swatch.style.background=g.fill;
  item.append(swatch,document.createTextNode(g.short+' '+g.name+(g.key?' ≥'+relMin(g)+'%':' <'+relThresholds.poor+'%')));return item;
 }));
 for(const e of document.querySelectorAll('.rel-mark-legend'))e.textContent=`印 · はREL ${relLegendTarget(e)}%以上`;
 if($('rel-unit'))$('rel-unit').textContent=grade?'REL · 4段階':'REL · %';
 for(const e of document.querySelectorAll('.rel-percent-legend'))e.hidden=grade;
 for(const e of document.querySelectorAll('.rel-grade-legend'))e.hidden=!grade;
}
function refreshRelViews(){
 renderRelLegend();
 if(typeof renderResult==='function'&&result)renderResult();
 if(typeof showDiversity==='function'&&diversityResult)showDiversity();
 if(typeof renderMeshMatrix==='function'&&meshResult)renderMeshMatrix();
 drawMap();
}
function setRelMode(mode){
 relMode=mode==='grade'?'grade':'percent';
 try{localStorage.setItem('hf-rel-display',relMode);}catch{/* Still apply for this session. */}
 refreshRelViews();
}
const relInputs={excellent:'rel-excellent',good:'rel-good',poor:'rel-poor'};
function showRelThresholds(){for(const [k,id]of Object.entries(relInputs))$(id).value=relThresholds[k];}
function applyRelThresholds(){
 const next=Object.fromEntries(Object.entries(relInputs).map(([k,id])=>[k,$(id).value===''?NaN:Number($(id).value)]));
 const ok=validRelThresholds(next);$('rel-threshold-error').hidden=ok;if(!ok)return;
 relThresholds=next;try{localStorage.setItem('hf-rel-thresholds',JSON.stringify(relThresholds));}catch{/* Still apply for this session. */}
 refreshRelViews();
}
for(const id of Object.values(relInputs))$(id).addEventListener('change',applyRelThresholds);
$('rel-threshold-reset').onclick=()=>{relThresholds={...relDefaults};showRelThresholds();applyRelThresholds();};
showRelThresholds();
$('rel-display').value=relMode;
$('rel-display').onchange=e=>setRelMode(e.target.value);
fields.reliability.addEventListener('change',renderRelLegend);
renderRelLegend();
