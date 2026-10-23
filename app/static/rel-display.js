'use strict';
// REL can be shown as a percentage (default) or as four grades.
const relGrades=[
 {min:90,name:'EXCELLENT',short:'E',fill:'#2fd47a',ink:'#03200e'},
 {min:80,name:'GOOD',short:'G',fill:'#c3e84b',ink:'#1d2903'},
 {min:60,name:'POOR',short:'P',fill:'#ffb13d',ink:'#2d1900'},
 {min:-Infinity,name:'NONE',short:'N',fill:'#ff5c6c',ink:'#2c0006'}
];
const relUnknownTint='#e9f1f7';
let relMode='percent';
try{if(localStorage.getItem('hf-rel-display')==='grade')relMode='grade';}catch{/* Storage is optional. */}
const relKnown=v=>v!==null&&v!==undefined&&Number.isFinite(Number(v));
function relGrade(v){return relKnown(v)?relGrades.find(g=>Number(v)>=g.min):null;}
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
 const order=$('diversity')&&!$('diversity').hidden?[fromDiversity,fromPoint]:[fromPoint,fromDiversity];
 for(const source of order){const found=source();if(found)return found;}
 return null;
}
function renderRelLegend(){
 const grade=relMode==='grade';
 if($('rel-unit'))$('rel-unit').textContent=grade?'REL · 4段階':'REL · %';
 for(const e of document.querySelectorAll('.rel-percent-legend'))e.hidden=grade;
 for(const e of document.querySelectorAll('.rel-grade-legend'))e.hidden=!grade;
}
function setRelMode(mode){
 relMode=mode==='grade'?'grade':'percent';
 try{localStorage.setItem('hf-rel-display',relMode);}catch{/* Still apply for this session. */}
 renderRelLegend();
 if(typeof renderResult==='function'&&result)renderResult();
 if(typeof showDiversity==='function'&&diversityResult)showDiversity();
 drawMap();
}
$('rel-display').value=relMode;
$('rel-display').onchange=e=>setRelMode(e.target.value);
for(const legend of document.querySelectorAll('.rel-grade-legend'))legend.replaceChildren(...relGrades.map((g,i)=>{
 const item=document.createElement('span'),swatch=document.createElement('b');swatch.style.background=g.fill;
 item.append(swatch,document.createTextNode(g.short+' '+g.name+(i<3?' ≥'+g.min+'%':' <60%')));return item;
}));
renderRelLegend();
