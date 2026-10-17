'use strict';
const $=id=>document.getElementById(id),form=$('station-form'),kind={vessel:'船舶',aircraft:'航空機',vehicle:'車両'};
let loading=false,snapshot=null;
function cell(tag,text){const e=document.createElement(tag);e.textContent=text;return e;}
function notice(text,error=false){$('notice').textContent=text;$('notice').classList.toggle('error',error);}
function loginView(authenticated){$('management').hidden=authenticated===false;$('login-panel').hidden=authenticated;$('logout').hidden=!authenticated;}
async function api(url,data){
 const r=await fetch(url,{credentials:'same-origin',...(data===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})});
 const body=await r.json();if(!r.ok){if(r.status===401)loginView(false);throw Error(body.error||'通信に失敗しました');}return body;
}
function table(headers,rows){const t=document.createElement('table'),head=document.createElement('tr');headers.forEach(v=>head.append(cell('th',v)));t.append(head);for(const values of rows){const tr=document.createElement('tr');values.forEach(v=>{const td=document.createElement('td');if(v instanceof Node)td.append(v);else td.textContent=v??'—';tr.append(td);});t.append(tr);}return t;}
async function saveStation(station){try{await api('/ui/api/stations',station);notice('局設定を保存しました。');await refresh();}catch(e){notice(e.message,true);}}
function editStation(station){for(const [key,value]of Object.entries(station))if(form.elements[key]){if(key==='enabled')form.elements[key].checked=value;else form.elements[key].value=value;}form.scrollIntoView({block:'nearest',behavior:'smooth'});}
function render(){
 const valid=snapshot.positions.filter(p=>!p.stale&&Date.parse(p.expires_at)>Date.now()).length;
 $('gateway-status').textContent='有効位置 '+valid+' / '+snapshot.positions.length+' · 外部受信 '+(snapshot.ingest_enabled?'有効':'無効')+' · 本体連携 '+(snapshot.client_enabled?'有効':'無効')+' · TTL '+snapshot.max_age_seconds+' s · '+snapshot.server_time;
 const previous=form.elements.protocol.value;form.elements.protocol.replaceChildren();for(const p of snapshot.protocols)form.elements.protocol.add(new Option({json:'JSON',geojson:'GeoJSON',nmea0183:'NMEA 0183 · RMC'}[p]??p,p));if(snapshot.protocols.includes(previous))form.elements.protocol.value=previous;
 $('station-list').replaceChildren(table(['送信元 / 局ID','局名','種別','受信形式','受信有効','編集'],snapshot.stations.map(s=>{
  const name=cell('span',s.name);name.dataset.userContent='true';
  const button=cell('button','編集');button.onclick=()=>editStation(s);const active=document.createElement('input');active.type='checkbox';active.checked=s.enabled;active.setAttribute('aria-label',s.id+' enabled');active.onchange=()=>saveStation({...s,enabled:active.checked});
  return [s.source+'/'+s.id,name,kind[s.kind],s.protocol,active,button];
 })));
 $('positions-list').replaceChildren(table(['局名','送信元 / 局ID','種別','緯度 / 経度','観測 UTC','速度 kt / 針路 °','高度 m','状態'],snapshot.positions.map(p=>{
  const name=cell('span',p.name);name.dataset.userContent='true';
  return [name,p.source+'/'+p.id,kind[p.kind],p.lat.toFixed(5)+', '+p.lon.toFixed(5),p.observed_at,(p.speed_knots??'—')+' / '+(p.course_deg??'—'),p.altitude_m??'—',p.stale||Date.parse(p.expires_at)<=Date.now()?'期限切れ':p.prediction_compatible?'有効':'エンジン緯度範囲外'];
 })));
}
async function refresh(){if(loading)return;loading=true;try{snapshot=await api('/ui/api/status');loginView(true);render();}catch(e){notice(e.message,true);}finally{loading=false;}}
$('login-form').onsubmit=async e=>{e.preventDefault();const field=e.currentTarget.elements.password;try{const password=field.value;field.value='';await api('/ui/api/login',{password});loginView(true);notice('ログインしました。');await refresh();}catch(e){notice(e.message,true);}};
$('logout').onclick=async()=>{try{await api('/ui/api/logout',{});snapshot=null;$('station-list').replaceChildren();$('positions-list').replaceChildren();loginView(false);notice('ログアウトしました。');}catch(e){notice(e.message,true);}};
form.onsubmit=async e=>{e.preventDefault();const data=Object.fromEntries(new FormData(form));data.enabled=form.elements.enabled.checked;await saveStation(data);};
$('new-station').onclick=()=>form.reset();$('refresh').onclick=refresh;
(async()=>{try{const session=await api('/ui/api/session');loginView(session.authenticated);$('login-status').textContent=session.configured?'管理専用パスワードでログインしてください。':'管理パスワードを設定してください。';$('login-form').querySelector('button').disabled=!session.configured;if(session.authenticated)await refresh();}catch(e){notice(e.message,true);}})();
setInterval(()=>{if(!$('management').hidden&&$('poll').checked&&!document.hidden)refresh();else if(snapshot&&!document.hidden)render();},5000);
