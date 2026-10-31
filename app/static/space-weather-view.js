'use strict';
// Charts of the current space weather (実況) and the NOAA forecasts (予報) held by the server.
// Reads the cached data only; opening the tab never asks the providers again.
const swv={overview:null,observations:null,timer:null,measure:'ssn'};
const SWV_COLORS={stations:['#3987e5','#d95926','#199e70','#c98500'],monthly:'#8da2b7',smoothed:'#3987e5',predicted:'#d95926',grid:'#26384a',axis:'#8da2b7',ink:'#e6eef5'};
const SWV_LEVELS=['障害なし','小規模','中規模','大規模','甚大','極端'];
const SWV_SCALES={R:['R · 電波障害（太陽フレアのX線）','昼間側のHF吸収（デリンジャー現象）'],S:['S · 太陽放射線（高エネルギー陽子）','極域のHF吸収（PCA）'],G:['G · 地磁気嵐','電離圏嵐によるMUF低下・高緯度の不安定']};
// Status colours: 0 good, 1–2 warning, 3 serious, 4–5 critical; each tile also prints its level and name.
function swvLevelColor(level){return level===null||level===undefined?'#3a4b5c':level===0?'#0ca30c':level<=2?'#fab219':level===3?'#ec835a':'#d03b3b';}
function swvTime(value){return value?observedTime(value):'時刻不明';}
function swvFetched(seconds){return seconds?observedTime(new Date(seconds*1000).toISOString()):'未取得';}
function swvEmpty(target,text){const p=cell('p',text);p.className='hint';target.replaceChildren(p);}
function swvTip(box){let tip=box.querySelector('.swv-tip');if(!tip){tip=cell('div','');tip.className='swv-tip';tip.hidden=true;box.append(tip);}return tip;}
function swvText(parent,x,y,text,attrs={}){const t=svg('text',{x,y,fill:SWV_COLORS.axis,'font-size':11,...attrs},parent);t.textContent=text;return t;}
function swvTicks(max,count=4){const step=[1,2,2.5,5,10,20,25,50,100,200].find(s=>s*count>=max)||Math.ceil(max/count);return {step,top:Math.max(step,Math.ceil(max/step)*step)};}

function renderSwvScales(){
 const box=$('swv-scales'),scales=swv.overview?.scales;box.replaceChildren();
 if(!scales?.days.length){swvEmpty(box,scales?.source.error||'NOAAの障害レベル（R/S/G）は未取得です。');return;}
 const latest=scales.days.find(d=>d.kind==='latest'),max=scales.days.find(d=>d.kind==='max24h');
 for(const key of ['R','S','G']){
  const level=latest?.[key].scale,tile=document.createElement('div');tile.className='swv-tile'+(scales.stale?' swv-stale':'');
  const chip=cell('strong',level===null||level===undefined?key+' —':key+level);chip.className='swv-level';chip.style.background=swvLevelColor(level);chip.style.color=level>=1&&level<=2?'#0b0b0b':'#fff';
  const head=cell('span',SWV_SCALES[key][0]),name=cell('b',level===null||level===undefined?'欠測':SWV_LEVELS[level]);
  const past=max?.[key].scale,detail=cell('small',`過去24時間の最大 ${past===null||past===undefined?'—':key+past} · ${SWV_SCALES[key][1]}`);
  tile.append(head,chip,name,detail);box.append(tile);
 }
 for(const [label,value,note] of [['最新の月間黒点数',swv.overview.solar_cycle.latest_monthly,v=>v.month+' · F10.7 '+fmt(v.f10_7,1)+' sfu'],['最新の平滑黒点数',swv.overview.solar_cycle.latest_smoothed,v=>v.month+' · 計算に使う値（×0.7） '+fmt(v.engine_ssn,1)]]){
  const tile=document.createElement('div');tile.className='swv-tile';
  tile.append(cell('span',label),cell('strong',value?fmt(value.ssn,1):'—'),cell('small',value?note(value):'未取得'));box.append(tile);
 }
}

function renderSwvNict(){
 const box=$('swv-nict'),n=swv.observations?.nict;box.replaceChildren();
 const stations=(n?.data?.stations||[]).filter(s=>s.bands.some(b=>b.muf_mhz!==null));
 if(!stations.length){swvEmpty(box,n?.error||'NICTの国内観測は未取得です。');return;}
 const W=720,H=260,L=48,R=110,T=16,B=36,plot=svg('svg',{viewBox:`0 0 ${W} ${H}`,role:'img','aria-label':'NICT国内4局の距離別参考MUF（MHz）。横軸は伝搬距離（km）、0 kmは垂直MUF（foF2相当）です。'},box);
 const maxKm=Math.max(...stations.flatMap(s=>s.bands.map(b=>b.distance_km))),maxMuf=Math.max(1,...stations.flatMap(s=>s.bands.map(b=>b.muf_mhz??0)));
 const {step,top}=swvTicks(maxMuf*1.08,4),x=km=>L+km/Math.max(1,maxKm)*(W-L-R),y=v=>H-B-v/top*(H-T-B);
 for(let v=0;v<=top+1e-9;v+=step){svg('line',{x1:L,x2:W-R,y1:y(v),y2:y(v),stroke:SWV_COLORS.grid},plot);swvText(plot,L-6,y(v)+4,fmt(v,0),{'text-anchor':'end'});}
 for(let km=0;km<=maxKm;km+=500)swvText(plot,x(km),H-B+16,km===0?'垂直':String(km),{'text-anchor':'middle'});
 swvText(plot,L,T-4,'MUF（MHz）');swvText(plot,W-R,H-4,'伝搬距離（km）',{'text-anchor':'end'});
 const labels=[];
 stations.forEach((s,i)=>{
  const color=SWV_COLORS.stations[i%4],points=s.bands.filter(b=>b.muf_mhz!==null).sort((a,b)=>a.distance_km-b.distance_km);
  const g=svg('g',{opacity:s.stale?.45:1},plot);
  svg('path',{d:points.map((b,j)=>(j?'L':'M')+x(b.distance_km)+','+y(b.muf_mhz)).join(' '),fill:'none',stroke:color,'stroke-width':2,'stroke-dasharray':s.stale?'5 4':'none'},g);
  for(const b of points){const c=svg('circle',{cx:x(b.distance_km),cy:y(b.muf_mhz),r:4,fill:color,stroke:'#111e2c','stroke-width':2},g);svg('title',{},c).textContent=`${s.name} ${s.code} · ${b.distance_km?b.distance_km+' km':'垂直'} · MUF ${fmt(b.muf_mhz,2)} MHz · LUF ${fmt(b.luf_mhz,2)} MHz`;}
  const last=points.at(-1);labels.push({y:y(last.muf_mhz),text:s.name+(s.stale?'（古い）':''),color,g});
 });
 // Direct labels at the line ends, nudged apart so they never overlap.
 labels.sort((a,b)=>a.y-b.y);for(let i=1;i<labels.length;i++)labels[i].y=Math.max(labels[i].y,labels[i-1].y+14);
 for(const l of labels){svg('rect',{x:W-R+8,y:l.y-5,width:10,height:3,rx:1,fill:l.color},l.g);swvText(l.g,W-R+22,l.y+4,l.text,{fill:SWV_COLORS.ink});}
 const legend=document.createElement('ul');legend.className='swv-legend';
 stations.forEach((s,i)=>{const li=document.createElement('li'),key=cell('i','');key.style.background=SWV_COLORS.stations[i%4];li.append(key,`${s.name} ${s.code} · foF2 ${fmt(s.fof2_mhz,2)} MHz · ${swvTime(s.observed_at)}${s.stale?' · 古い':''}`);legend.append(li);});
 box.append(legend);
}

function renderSwvDrap(){
 const box=$('swv-drap'),d=swv.observations?.drap;box.replaceChildren();
 if(!d?.data){swvEmpty(box,d?.error||'D-RAPは未取得です。');return;}
 const plot=svg('svg',{viewBox:'0 0 1000 500',role:'img','aria-label':'D-RAPの世界分布。色はHAF（MHz）で、黄＝低、赤＝高、透明＝0、灰＝欠測です。',class:'swv-map'},box);
 svg('rect',{x:0,y:0,width:1000,height:500,fill:'#0d1926'},plot);
 if(land){const g=svg('g',{},plot);for(const feature of land.features){const polys=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates;for(const poly of polys)svg('path',{d:poly.map(ring=>ring.map((v,i)=>`${i?'L':'M'}${xy(v[0],v[1]).join(',')}`).join(' ')+' Z').join(' '),fill:'#20364a',stroke:'#375269','stroke-width':.6,'fill-rule':'evenodd'},g);}}
 const layer=svg('g',{opacity:d.stale?.25:.75},plot),lons=d.data.longitudes,rows=d.data.rows;let peak=null;
 for(let j=0;j<rows.length;j++){
  const r=rows[j],north=j===0?90:(rows[j-1].lat+r.lat)/2,south=j===rows.length-1?-90:(r.lat+rows[j+1].lat)/2;
  for(let i=0;i<lons.length;i++){
   const value=r.values[i];if(value===0)continue;
   if(value!==null&&(!peak||value>peak.value))peak={value,lat:r.lat,lon:lons[i]};
   const west=i===0?-180:(lons[i-1]+lons[i])/2,east=i===lons.length-1?180:(lons[i]+lons[i+1])/2,[px,py]=xy(west,north);
   svg('rect',{x:px,y:py,width:(east-west)*1000/360,height:(north-south)*500/180,fill:value===null?'#7b8794':`hsl(${Math.max(0,60-Math.min(30,value)*2)},90%,55%)`},layer);
  }
 }
 if(peak&&!d.stale){const [px,py]=xy(peak.lon,peak.lat);const c=svg('circle',{cx:px,cy:py,r:7,fill:'none',stroke:'#fff','stroke-width':2},plot);svg('title',{},c).textContent=`最大HAF ${fmt(peak.value,1)} MHz`;}
 const scale=document.createElement('div');scale.className='swv-scale';
 scale.append(cell('span','0'),cell('i',''),cell('span','30 MHz以上'),cell('small','HAF：垂直伝搬で1 dBの吸収を受ける最高周波数。透明＝0、灰＝欠測'));box.append(scale);
 const summary=cell('p',d.stale?`D-RAP ${swvTime(d.data.observed_at)} · 古いため薄く表示しています。`:peak?`D-RAP ${swvTime(d.data.observed_at)} · 最大HAF ${fmt(peak.value,1)} MHz（緯度 ${fmt(peak.lat,0)}°、経度 ${fmt(peak.lon,0)}°）`:`D-RAP ${swvTime(d.data.observed_at)} · 吸収はありません（全格子でHAF 0 MHz）。`);
 summary.className='hint';box.append(summary);
}

function swvProbability(value){
 const td=document.createElement('td');if(value===null||value===undefined){td.textContent='—';return td;}
 const bar=cell('span','');bar.className='swv-bar';const fill=cell('i','');fill.style.width=Math.max(0,Math.min(100,value))+'%';bar.append(fill);
 td.append(bar,cell('b',value+'%'));return td;
}
function renderSwvForecast(){
 const box=$('swv-forecast'),days=(swv.overview?.scales.days||[]).filter(d=>d.kind==='forecast');box.replaceChildren();
 if(!days.length){swvEmpty(box,'NOAAの3日予報は未取得です。');return;}
 const table=document.createElement('table'),head=document.createElement('tr');table.className='swv-forecast';
 for(const h of ['日付（UTC）','R1〜R2の確率','R3以上の確率','S1以上の確率','地磁気嵐の予報'])head.append(cell('th',h));table.append(head);
 for(const day of days){
  const tr=document.createElement('tr'),g=day.G.scale,chip=cell('span',g===null?'—':'G'+g+' '+SWV_LEVELS[g]);
  chip.className='swv-chip';chip.style.background=swvLevelColor(g);chip.style.color=g>=1&&g<=2?'#0b0b0b':'#fff';
  const gcell=document.createElement('td');gcell.append(chip);
  tr.append(cell('td',day.date||'日付不明'),swvProbability(day.R.minor_prob),swvProbability(day.R.major_prob),swvProbability(day.S.prob),gcell);table.append(tr);
 }
 box.append(table);
}

function renderSwvCycle(){
 const box=$('swv-cycle'),c=swv.overview?.solar_cycle;box.replaceChildren();
 if(!c||!c.observed.length&&!c.predicted.length){swvEmpty(box,c?.sources.observed.error||'NOAAの太陽活動周期データは未取得です。');return;}
 const f=swv.measure==='f10_7',unit=f?'sfu':'',key={monthly:f?'f10_7':'ssn',smoothed:f?'smoothed_f10_7':'smoothed_ssn',predicted:f?'f10_7':'ssn',high:f?'high_f10_7':'high_ssn',low:f?'low_f10_7':'low_ssn'};
 const months=[...new Set([...c.observed,...c.predicted].map(r=>r.month))].sort(),index=new Map(months.map((m,i)=>[m,i]));
 const W=720,H=280,L=48,R=16,T=18,B=34,plot=svg('svg',{viewBox:`0 0 ${W} ${H}`,role:'img','aria-label':f?'F10.7（sfu）の月別実績・平滑値・予測':'黒点数SSNの月別実績・平滑値・予測'},box);
 const values=[...c.observed.flatMap(r=>[r[key.monthly],r[key.smoothed]]),...c.predicted.flatMap(r=>[r[key.predicted],r[key.high]])].filter(v=>v!==null&&v!==undefined);
 const {step,top}=swvTicks(Math.max(1,...values)*1.05,5),x=m=>L+index.get(m)/Math.max(1,months.length-1)*(W-L-R),y=v=>H-B-v/top*(H-T-B);
 for(let v=0;v<=top+1e-9;v+=step){svg('line',{x1:L,x2:W-R,y1:y(v),y2:y(v),stroke:SWV_COLORS.grid},plot);swvText(plot,L-6,y(v)+4,fmt(v,0),{'text-anchor':'end'});}
 for(const m of months)if(m.endsWith('-01')&&+m.slice(0,4)%2===0)swvText(plot,x(m),H-B+16,m.slice(0,4),{'text-anchor':'middle'});
 swvText(plot,L,T-6,f?'F10.7（sfu）':'黒点数 SSN');
 const line=(rows,field)=>{let d='',open=false;for(const r of rows){const v=r[field];if(v===null||v===undefined){open=false;continue;}d+=(open?'L':'M')+x(r.month)+','+y(v);open=true;}return d;};
 const band=c.predicted.filter(r=>r[key.high]!==null&&r[key.low]!==null);
 if(band.length>1)svg('path',{d:band.map((r,i)=>(i?'L':'M')+x(r.month)+','+y(r[key.high])).join('')+band.slice().reverse().map(r=>'L'+x(r.month)+','+y(r[key.low])).join('')+'Z',fill:SWV_COLORS.predicted,opacity:.18},plot);
 svg('path',{d:line(c.observed,key.monthly),fill:'none',stroke:SWV_COLORS.monthly,'stroke-width':1,opacity:.7},plot);
 svg('path',{d:line(c.observed,key.smoothed),fill:'none',stroke:SWV_COLORS.smoothed,'stroke-width':2},plot);
 svg('path',{d:line(c.predicted,key.predicted),fill:'none',stroke:SWV_COLORS.predicted,'stroke-width':2,'stroke-dasharray':'6 4'},plot);
 const now=new Date().toISOString().slice(0,7);
 if(index.has(now)){svg('line',{x1:x(now),x2:x(now),y1:T,y2:H-B,stroke:SWV_COLORS.ink,'stroke-width':1,'stroke-dasharray':'2 3',opacity:.6},plot);swvText(plot,x(now)+4,T+10,'今月',{fill:SWV_COLORS.ink});}
 const legend=document.createElement('ul');legend.className='swv-legend';
 for(const [color,text,dash] of [[SWV_COLORS.monthly,'月間値（実績）'],[SWV_COLORS.smoothed,'平滑値（実績）'],[SWV_COLORS.predicted,'予測平滑値（帯は予測の上限〜下限）',true]]){const li=document.createElement('li'),k=cell('i','');k.style.background=color;if(dash)k.className='dashed';li.append(k,text);legend.append(li);}
 // Crosshair and tooltip for the month under the pointer.
 const cross=svg('line',{y1:T,y2:H-B,stroke:SWV_COLORS.ink,'stroke-width':1,opacity:0},plot),hit=svg('rect',{x:L,y:T,width:W-L-R,height:H-T-B,fill:'transparent'},plot),tip=swvTip(box);
 const byMonth=m=>({o:c.observed.find(r=>r.month===m),p:c.predicted.find(r=>r.month===m)});
 hit.addEventListener('pointermove',e=>{
  const rect=plot.getBoundingClientRect(),vx=(e.clientX-rect.left)/rect.width*W,i=Math.round((vx-L)/(W-L-R)*(months.length-1)),m=months[Math.max(0,Math.min(months.length-1,i))],{o,p}=byMonth(m);
  cross.setAttribute('x1',x(m));cross.setAttribute('x2',x(m));cross.setAttribute('opacity',.5);
  const lines=[m];if(o){lines.push('月間値 '+fmt(o[key.monthly],1)+(unit&&' '+unit),'平滑値 '+fmt(o[key.smoothed],1)+(unit&&' '+unit));}
  if(p){lines.push('予測平滑値 '+fmt(p[key.predicted],1)+(unit&&' '+unit),'予測範囲 '+fmt(p[key.low],1)+'〜'+fmt(p[key.high],1));if(!f)lines.push('計算に使う値（×0.7） '+fmt(p.engine_ssn,1));}
  tip.replaceChildren(...lines.map((t,j)=>cell(j?'span':'b',t)));tip.hidden=false;
  const px=e.clientX-box.getBoundingClientRect().left;tip.style.left=Math.min(px+12,box.clientWidth-190)+'px';tip.style.top='24px';
 });
 hit.addEventListener('pointerleave',()=>{cross.setAttribute('opacity',0);tip.hidden=true;});
 box.append(legend);
}

function renderSwvMonths(){
 const box=$('swv-months'),rows=swv.overview?.solar_cycle.predicted||[],now=new Date().toISOString().slice(0,7);box.replaceChildren();
 const next=rows.filter(r=>r.month>=now).slice(0,12);
 if(!next.length){swvEmpty(box,'今月以降の予測平滑SSNはありません。');return;}
 box.append(observationTable(['対象月','予測平滑SSN','予測範囲（下限〜上限）','計算に使う値（×0.7）','予測F10.7（sfu）'],next.map(r=>[r.month,fmt(r.ssn,1),fmt(r.low_ssn,1)+'〜'+fmt(r.high_ssn,1),fmt(r.engine_ssn,1),fmt(r.f10_7,1)])));
}

function renderSwvSources(){
 const box=$('swv-sources'),o=swv.overview,obs=swv.observations;box.replaceChildren();
 const items=[];
 if(o)items.push(['NOAA 障害レベル（R/S/G）',o.scales.source],['NOAA 観測黒点数',o.solar_cycle.sources.observed],['NOAA 予測黒点数',o.solar_cycle.sources.predicted]);
 if(obs)items.push(['NOAA D-RAP',obs.drap],['NICT',obs.nict]);
 for(const [name,s] of items){
  const a=cell('a',name);a.href=s.url||s.source_url||'#';a.target='_blank';a.rel='noopener noreferrer';
  box.append(a,document.createTextNode(` 最終取得 ${swvFetched(s.fetched_at)}${s.stale?' · 古い':''}${s.error?' · '+s.error:''}　`));
 }
 $('swv-note').textContent=o?.note||'';
}

function renderSpaceWeatherView(){renderSwvScales();renderSwvNict();renderSwvDrap();renderSwvForecast();renderSwvCycle();renderSwvMonths();renderSwvSources();}
async function loadSpaceWeatherView(){
 $('swv-status').textContent='読み込み中…';
 const [overview,observations]=await Promise.allSettled([api('/api/space-weather/overview'),api('/api/observations')]);
 if(overview.status==='fulfilled')swv.overview=overview.value;
 if(observations.status==='fulfilled')swv.observations=observations.value;
 const errors=[overview,observations].filter(r=>r.status==='rejected').map(r=>r.reason.message);
 $('swv-status').textContent=errors.length?errors.join(' / '):`表示時刻 ${observedTime(new Date().toISOString().slice(0,19)+'Z')} · R/S/G ${swvTime(swv.overview?.scales.observed_at)}${swv.overview?.scales.stale?'（古い）':''}`;
 renderSpaceWeatherView();
}
$('swv-cycle-measure').onchange=e=>{swv.measure=e.target.value;renderSwvCycle();};
// Load when the tab is shown and keep it current while it stays open; the server serves its cached copies.
new MutationObserver(()=>{
 const shown=!$('space-weather-view').hidden;clearInterval(swv.timer);swv.timer=null;
 if(shown){loadSpaceWeatherView();swv.timer=setInterval(loadSpaceWeatherView,300000);}
}).observe($('space-weather-view'),{attributes:true,attributeFilter:['hidden']});
