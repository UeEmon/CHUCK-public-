'use strict';
const $=id=>document.getElementById(id);
const TOKEN=document.querySelector('meta[name=simulator-token]').content;
const KIND={vessel:'船舶',aircraft:'航空機',vehicle:'車両'};
const COLORS=['#56d9b0','#ffcf70','#ff9dd6','#9fa8ff','#8be06b','#ffa36b','#6be0e0','#d9a6ff'];
const SVGNS='http://www.w3.org/2000/svg';
let state=null,land=null,zoom=1,center=null,editing=false;

function notice(text,error=false){$('notice').textContent=text;$('notice').classList.toggle('error',error);}
async function call(method,path,body){
 const r=await fetch(path,{method,headers:{'X-Simulator-Token':TOKEN,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
 const data=await r.json();if(!r.ok)throw Error(data.error||'通信に失敗しました');return data;
}
async function act(body,message){try{state=await call('POST','/api/action',body);if(message)notice(message);render();}catch(e){notice(e.message,true);}}
function el(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
function svg(tag,attrs){const e=document.createElementNS(SVGNS,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);return e;}
function button(text,onclick,disabled=false){const b=el('button',text);b.type='button';b.onclick=onclick;b.disabled=disabled;return b;}

function renderConfig(){
 const c=state.config;
 $('config').textContent=`ゲートウェイ ${c.url} · TCP ${c.nmea_host}:${c.nmea_port} · UDP ${c.nmea_host}:${c.udp_port} · 送信元 ${c.source} · 受信トークン ${c.ingest_token?'設定済み':'未設定'} · 本体連携トークン ${c.gateway_token?'設定済み':'未設定'}`;
 if(document.activeElement!==$('interval'))$('interval').value=state.interval;
 $('run-state').textContent=state.busy?'機能確認を実行中':state.running?'送信中':'停止中';$('run-state').classList.toggle('on',state.running);
 $('start').disabled=state.running;$('stop').disabled=!state.running;$('check').disabled=!!state.busy;
}

function renderStations(){
 if(editing)return; // Do not replace the inputs while the user is typing.
 const t=$('stations');t.replaceChildren();
 const head=el('tr');['','局','種別','入力方式','送信位置','速度 kt','針路 °','ゲートウェイ受信','送信数','最後の結果','操作','異常送信'].forEach(h=>head.append(el('th',h)));t.append(head);
 state.stations.forEach((s,i)=>{
  const tr=el('tr');
  const swatch=el('span','','dot');swatch.style.background=COLORS[i%COLORS.length];tr.append(td(swatch));
  tr.append(td(el('span',`${s.name} (${s.id})`)));tr.append(td(el('span',KIND[s.kind])));
  const transport=el('span',s.transport);if(s.key_ready===false){transport.append(el('span',' 受信キーなし','warn'));}tr.append(td(transport));
  tr.append(td(el('span',`${s.lat.toFixed(5)}, ${s.lon.toFixed(5)}`)));
  for(const field of['speed_knots','course_deg']){const input=el('input');input.type='number';input.step='any';input.min=0;input.max=field==='speed_knots'?3000:359.9;input.value=s[field];
   input.onfocus=()=>editing=true;input.onblur=()=>{editing=false;};input.onchange=()=>{editing=false;act({action:'update',id:s.id,[field]:Number(input.value)},`${s.id}の${field==='speed_knots'?'速度':'針路'}を変えました`);};tr.append(td(input));}
  const r=s.received;tr.append(td(r?el('span',`${r.lat.toFixed(5)}, ${r.lon.toFixed(5)} · ${r.age_seconds}秒前${r.stale?' · 期限切れ':''}`,r.stale?'warn':'ok'):el('span','未受信','warn')));
  tr.append(td(el('span',String(s.sent))));
  tr.append(td(el('span',s.last||'—',/HTTP 4|HTTP 5|できません|なし/.test(s.last)?'ng':'')));
  const ops=document.createElement('span');
  ops.append(button(s.active?'一時停止':'再開',()=>act({action:'toggle',id:s.id})),button('登録',()=>act({action:'setup',id:s.id},`${s.id}を登録しました`)),button('削除',()=>act({action:'remove',id:s.id})));
  tr.append(td(ops));
  const fault=document.createElement('span'),select=el('select');select.setAttribute('aria-label',s.id+'の異常の種類');
  for(const[key,f]of Object.entries(state.faults))if(f.transports.includes(s.transport))select.add(new Option(f.label,key));
  fault.append(select,button('送信',()=>act({action:'fault',id:s.id,fault:select.value})));tr.append(td(fault));
  t.append(tr);
 });
}
function td(child){const c=el('td');c.append(child);return c;}

function renderCheck(){
 const box=$('check-results');
 if(state.busy==='check'){box.replaceChildren(el('p','実行中です。ログに進み具合が出ます。','hint'));return;}
 if(!state.check)return;
 const ok=state.check.filter(r=>r.ok).length,list=el('ul');
 for(const r of state.check)list.append(el('li',`${r.ok?'PASS':'FAIL'} ${r.name}${r.detail&&!r.ok?' ('+r.detail+')':''}`,r.ok?'ok':'ng'));
 box.replaceChildren(el('p',`${ok}/${state.check.length} 合格`,ok===state.check.length?'ok':'ng'),list);
}
function renderLog(){$('log').replaceChildren(...state.log.map(line=>el('li',line)));}

// Equirectangular map fitted to the stations, their tracks and the received fixes.
function bounds(){
 const pts=[];for(const s of state.stations){for(const p of s.track)pts.push(p);if(s.received)pts.push([s.received.lat,s.received.lon]);}
 if(!pts.length)return{lat:35,lon:139.7,span:2};
 const lats=pts.map(p=>p[0]),lons=pts.map(p=>p[1]);
 const lat=(Math.min(...lats)+Math.max(...lats))/2,lon=(Math.min(...lons)+Math.max(...lons))/2;
 const span=Math.max(0.05,(Math.max(...lats)-Math.min(...lats))*1.4,(Math.max(...lons)-Math.min(...lons))*Math.cos(lat*Math.PI/180)*1.4*520/800);
 return{lat,lon,span};
}
function renderMap(){
 const map=$('map');map.replaceChildren();
 const b=bounds(),c=center||b,span=b.span/zoom,W=800,H=520,k=H/span,cos=Math.cos(c.lat*Math.PI/180);
 const x=lon=>W/2+(lon-c.lon)*cos*k,y=lat=>H/2-(lat-c.lat)*k;
 if(land){const g=svg('g',{class:'land'});for(const f of land.features){const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;
  for(const poly of polys){const d=poly.map(ring=>'M'+ring.map(([lo,la])=>`${x(lo).toFixed(1)},${y(la).toFixed(1)}`).join('L')+'Z').join('');g.append(svg('path',{d}));}}map.append(g);}
 const grid=svg('g',{class:'grid'}),step=[0.01,0.02,0.05,0.1,0.2,0.5,1,2,5,10,20].find(s=>span/s<=8)||30;
 for(let la=Math.ceil((c.lat-span)/step)*step;la<=c.lat+span;la+=step){grid.append(svg('line',{x1:0,x2:W,y1:y(la),y2:y(la)}));const t=svg('text',{x:4,y:y(la)-3});t.textContent=la.toFixed(step<0.1?2:1)+'°';grid.append(t);}
 const lonSpan=span*W/H/cos;for(let lo=Math.ceil((c.lon-lonSpan)/step)*step;lo<=c.lon+lonSpan;lo+=step){grid.append(svg('line',{y1:0,y2:H,x1:x(lo),x2:x(lo)}));const t=svg('text',{x:x(lo)+3,y:H-4});t.textContent=lo.toFixed(step<0.1?2:1)+'°';grid.append(t);}
 map.append(grid);
 state.stations.forEach((s,i)=>{
  const color=COLORS[i%COLORS.length];
  if(s.track.length>1)map.append(svg('polyline',{class:'track',stroke:color,points:s.track.map(([la,lo])=>`${x(lo).toFixed(1)},${y(la).toFixed(1)}`).join(' ')}));
  if(s.received)map.append(svg('circle',{class:'received',cx:x(s.received.lon),cy:y(s.received.lat),r:9}));
  const px=x(s.lon),py=y(s.lat),a=s.course_deg*Math.PI/180;
  const tri=[[0,-9],[6,7],[-6,7]].map(([dx,dy])=>`${(px+dx*Math.cos(a)-dy*Math.sin(a)).toFixed(1)},${(py+dx*Math.sin(a)+dy*Math.cos(a)).toFixed(1)}`).join(' ');
  map.append(svg('polygon',{class:'sent',fill:color,points:tri,opacity:s.active?1:.4}));
  const label=svg('text',{class:'label',x:px+10,y:py-8});label.textContent=s.id;map.append(label);
 });
}
function render(){if(!state)return;renderConfig();renderStations();renderCheck();renderLog();renderMap();}
async function refresh(){try{state=await call('GET','/api/state');render();}catch(e){notice(e.message,true);}}

$('start').onclick=()=>act({action:'start'},'送信を開始しました');
$('stop').onclick=()=>act({action:'stop'},'停止しました');
$('step').onclick=()=>act({action:'step'},'1回だけ送信しました');
$('setup').onclick=()=>act({action:'setup'},'全局を登録し、TCP・UDPの局に受信キーを発行しました');
$('check').onclick=()=>act({action:'check'},'機能確認を始めました');
$('interval').onchange=e=>act({action:'interval',interval:Number(e.target.value)});
$('zoom-in').onclick=()=>{zoom*=2;render();};$('zoom-out').onclick=()=>{zoom/=2;render();};$('zoom-fit').onclick=()=>{zoom=1;center=null;render();};
$('add-form').onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));
 for(const k of['lat','lon','speed_knots','course_deg','altitude_m'])d[k]=d[k]===''?null:Number(d[k]);act({action:'add',...d},`${d.id}を追加しました`);};
fetch('land.geojson').then(r=>r.ok?r.json():null).then(d=>{land=d;render();}).catch(()=>{});
refresh();setInterval(refresh,1000);
