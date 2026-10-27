'use strict';
let positionData=null,positionLoading=false;
const positionKind={vessel:'船舶',aircraft:'航空機',vehicle:'車両'};
async function saveStation(station){try{await post('/api/position-stations',station);notice(`${station.source}/${station.id}の受信形式を保存しました。`);await refreshPositions();}catch(e){notice(e.message,true);}}
function protocolLabel(value){return {json:'JSON',geojson:'GeoJSON',nmea0183:'NMEA 0183 · RMC'}[value]??value;}
function renderStationSettings(){const choices=positionData.protocols,formSelect=$('position-station-form').elements.protocol,previous=formSelect.value;formSelect.replaceChildren();for(const value of choices)formSelect.add(new Option(protocolLabel(value),value));if(choices.includes(previous))formSelect.value=previous;const table=document.createElement('table'),head=document.createElement('tr');['送信元 / 局ID','局名','種別','受信形式','受信有効'].forEach(s=>head.append(cell('th',s)));table.append(head);for(const station of positionData.stations){const tr=document.createElement('tr');[`${station.source}/${station.id}`,station.name,positionKind[station.kind]].forEach(v=>tr.append(cell('td',v)));const td=document.createElement('td'),select=document.createElement('select');for(const value of choices)select.add(new Option(protocolLabel(value),value));select.value=station.protocol;select.setAttribute('aria-label',station.id+'の受信形式');select.onchange=()=>saveStation({...station,protocol:select.value});td.append(select);tr.append(td);const active=document.createElement('input');active.type='checkbox';active.checked=station.enabled;active.setAttribute('aria-label',station.id+'の受信有効');active.onchange=()=>saveStation({...station,enabled:active.checked});const a=document.createElement('td');a.append(active);tr.append(a);table.append(tr);}$('position-stations').replaceChildren(table);}
$('position-station-form').onsubmit=async e=>{e.preventDefault();const values=Object.fromEntries(new FormData(e.currentTarget));await saveStation({...values,enabled:true});};
function renderPositions(){
 const table=document.createElement('table'),head=document.createElement('tr');['種別','名称 / ID','送信元','緯度 / 経度','観測 UTC','状態','プリセット'].forEach(v=>head.append(cell('th',v)));table.append(head);
 for(const p of positionData.positions){
  const stale=p.stale||Date.parse(p.expires_at)<=Date.now(),tr=document.createElement('tr');
  [positionKind[p.kind],p.name+' / '+p.id,p.source,fmt(p.lat,5)+', '+fmt(p.lon,5),p.observed_at,stale?'期限切れ':p.prediction_compatible?'有効':'エンジン緯度範囲外'].forEach(v=>tr.append(cell('td',v)));
  const td=document.createElement('td'),b=cell('button','登録・編集');b.type='button';b.disabled=stale||!p.prediction_compatible;b.onclick=()=>registerReceived(p);td.append(b);tr.append(td);table.append(tr);
 }
 $('positions-table').replaceChildren(table);renderStationSettings();updateMobileOptions();refreshCircuitPositions();
}
async function refreshPositions(){
 if(positionLoading)return;positionLoading=true;
 try{
  positionData=await api('/api/positions');
  $('positions-status').textContent='ゲートウェイ接続済 · '+positionData.positions.length+'局 · 有効期限 '+positionData.max_age_seconds+'秒 · 外部受信 '+(positionData.ingest_enabled?'有効':'無効')+' · 取得 '+positionData.server_time;
  const synced=await post('/api/presets',{action:'sync_mobile'});if(synced.imported)await loadCatalog();
  renderPositions();
 }catch(e){positionData=null;$('positions-status').textContent='位置一覧を取得できません: '+e.message;refreshCircuitPositions();}
 finally{positionLoading=false;}
}
function drawPositionLayer(parent){
 if(!$('positions-map').checked||!positionData)return;
 for(const p of positionData.positions){const stale=p.stale||Date.parse(p.expires_at)<=Date.now(),[x,y]=xy(p.lon,p.lat);const marker=svg('circle',{cx:x,cy:y,r:4/Math.sqrt(zoom),fill:stale?'#7b8794':p.kind==='aircraft'?'#94c8ff':p.kind==='vehicle'?'#b598ff':'#f7b965',stroke:'#fff','stroke-width':.7},parent);const label=s=>window.HF_I18N?HF_I18N.translate(s):s;svg('title',{},marker).textContent=label(positionKind[p.kind])+' '+p.name+' ('+p.source+'/'+p.id+') / '+p.observed_at+(stale?' ['+label('期限切れ')+']':'');marker.onclick=e=>{e.stopPropagation();tab('positions');notice(p.name+'：地点プリセットから選択できます。');};}
}
$('positions-refresh').onclick=refreshPositions;$('positions-map').onchange=drawMap;
setInterval(()=>{if(document.hidden)return;if($('positions-poll').checked)refreshPositions();else if(positionData)renderPositions();},5000);
