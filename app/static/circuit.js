'use strict';
// The catalog is persisted on the server; circuit choices are per browser.
let catalog={revision:0,presets:[],antennas:[]};
let circuit={tx:{location_id:'default-tokyo',antenna_id:'builtin-whip',noise:150,polarization:'model'},rxs:[{location_id:'default-guam',antenna_id:'builtin-whip',noise:150,polarization:'model'}]};
const defaultPresetNames={"default-new-york":"ニューヨーク","default-washington":"ワシントンDC","default-los-angeles":"ロサンゼルス","default-san-francisco":"サンフランシスコ","default-seattle":"シアトル","default-toronto":"トロント","default-vancouver":"バンクーバー","default-mexico-city":"メキシコシティ","default-tokyo":"東京","default-osaka":"大阪","default-seoul":"ソウル","default-beijing":"北京","default-shanghai":"上海","default-taipei":"台北","default-hong-kong":"香港","default-london":"ロンドン","default-paris":"パリ","default-berlin":"ベルリン","default-rome":"ローマ","default-madrid":"マドリード","default-brussels":"ブリュッセル","default-helsinki":"ヘルシンキ","default-stockholm":"ストックホルム","default-yokosuka":"横須賀","default-naha":"那覇","default-chichijima":"父島","default-guam":"グアム","default-honolulu":"ホノルル","default-singapore":"シンガポール","default-sydney":"シドニー","builtin-whip":"標準ホイップ","builtin-isotropic":"等方性基準"};
Object.assign(defaultPresetNames,{"standard-whip-24":"垂直ホイップ 2.4 m","standard-whip-5":"垂直ホイップ 5 m","standard-whip-7":"垂直ホイップ 7 m","standard-whip-10":"垂直ホイップ 10 m","standard-gp-5":"グランドプレーン 5 m","standard-dipole-10":"水平ダイポール 全長10 m","standard-dipole-20":"水平ダイポール 全長20 m","standard-dipole-40":"水平ダイポール 全長40 m","standard-vertical-10":"垂直ダイポール 全長10 m","standard-vertical-20":"垂直ダイポール 全長20 m","reference-usn-as2537c":"USN AS-2537C/SR（寸法近似）"});
function isOriginalPreset(p){return defaultPresetNames[p.id]===p.name;}
function displayedPresetName(p){return isOriginalPreset(p)&&window.HF_I18N?HF_I18N.translate(p.name):p.name;}
const lpDefaults={lp_elements:16,lp_tau:.9,lp_apex_deg:25,lp_slope_deg:90,lp_impedance_ohm:450};
// Model-specific fields and their defaults, mirroring engine.MODEL_FIELDS.
const modelFields={log_periodic:lpDefaults,sloping_long_wire:{lw_slope_deg:10}};
const extraDefaults=Object.assign({},...Object.values(modelFields));
const antennaFields=['length_m','height_m','azimuth_deg','ground_permittivity','ground_conductivity',...Object.keys(extraDefaults)];
// Mirrors engine.DIRECTIONAL_ANTENNAS: only these use a main-beam direction.
const directionalModels=['dipole','log_periodic','inverted_l','sloping_long_wire'];
const isDirectional=a=>directionalModels.includes(a?.model);
function antennaConfig(a){return {length_m:a?.length_m??null,height_m:a?.height_m??0,azimuth_deg:a?.azimuth_deg??0,azimuth_mode:a?.azimuth_mode??'fixed',ground_permittivity:a?.ground_permittivity??13,ground_conductivity:a?.ground_conductivity??.005,...Object.fromEntries(Object.keys(extraDefaults).map(k=>[k,a?.[k]??null]))};}
function antennaSummary(a){return a.model+' / '+a.gain+' dB'+(a.length_m!=null?' / L '+a.length_m+' m':'')+(['dipole','vertical_dipole','log_periodic','inverted_l','sloping_long_wire'].includes(a.model)?' / h '+a.height_m+' m':'')+(a.model==='log_periodic'?' / '+a.lp_elements+'el τ'+a.lp_tau:'')+(a.model==='sloping_long_wire'?' / '+a.lw_slope_deg+'°↗':'')+(isDirectional(a)?' / '+(a.azimuth_mode==='path'?'→ 相手局':a.azimuth_deg+'°'):'');}
const transientLocations=[],transientAntennas=[];
const allLocations=()=>[...catalog.presets,...transientLocations];
const allAntennas=()=>[...catalog.antennas,...transientAntennas];
function locationFor(e){return allLocations().find(p=>p.id===e.location_id);}
function antennaFor(e){return allAntennas().find(p=>p.id===e.antenna_id);}
function liveLocation(p){
 if(!p)return null;
 if(p.kind!=='mobile')return p;
 const row=typeof positionData!=='undefined'&&positionData?.positions.find(r=>r.source===p.position_ref.source&&r.id===p.position_ref.id);
 return {...p,lat:row?.lat??p.lat,lon:row?.lon??p.lon,unavailable:!row||row.stale||!row.prediction_compatible||Date.parse(row.expires_at)<=Date.now(),position_ref:{...p.position_ref}};
}
const meshMode=()=>$('mesh-mode').checked;
const MESH_MAX=8;
function circuitEndpoints(){if(meshMode())return [circuit.tx,...circuit.rxs].map((e,i)=>{const l=liveLocation(locationFor(e));return l?{...l,label:'N'+(i+1)}:null;}).filter(Boolean);const tx=liveLocation(locationFor(circuit.tx));if(!tx)return [];return [{...tx,label:'TX'},...circuit.rxs.map((e,i)=>{const l=liveLocation(locationFor(e));return l?{...l,label:'RX'+(i+1)}:null;}).filter(Boolean)];}
function circuitParams(){
 const p={};
 for(const [prefix,e]of [['tx',circuit.tx],['rx',circuit.rxs[0]]]){
  const l=liveLocation(locationFor(e)),a=antennaFor(e);
  for(const [key,value]of Object.entries(antennaConfig(a)))p[prefix+'_'+key]=value;
  p[prefix+'_polarization']=e.polarization??'model';p[prefix+'_lat']=l?.lat??NaN;p[prefix+'_lon']=l?.lon??NaN;p[prefix+'_antenna']=a?.model??'';p[prefix+'_gain']=a?.gain??0;
  if(l?.position_ref)p[prefix+'_position']={...l.position_ref};
 }
 p.noise=Number(circuit.rxs[0].noise);return p;
}
function circuitSites(){return circuit.rxs.map((e,i)=>{const l=liveLocation(locationFor(e)),a=antennaFor(e);return {...antennaConfig(a),polarization:e.polarization??'model',name:l.name.slice(0,31)+' [RX'+(i+1)+']',lat:l.lat,lon:l.lon,antenna:a.model,gain:a.gain,noise:Number(e.noise),...(l.position_ref?{position_ref:{...l.position_ref}}:{})};});}
// Kept as a reference: renderCircuit detaches the shared power field while it rebuilds the cards.
const sharedPower=$('power_w');
function meshPower(e){return Number(e.power_w??sharedPower.value);}
// Every mesh node transmits and receives, so each keeps its own power, antenna and noise.
function circuitMeshSites(){return [circuit.tx,...circuit.rxs].map((e,i)=>{const l=liveLocation(locationFor(e)),a=antennaFor(e);return {...antennaConfig(a),polarization:e.polarization??'model',name:l.name.slice(0,31)+' [N'+(i+1)+']',lat:l.lat,lon:l.lon,antenna:a.model,gain:a.gain,noise:Number(e.noise),power_w:meshPower(e),...(l.position_ref?{position_ref:{...l.position_ref}}:{})};});}
function validateCircuit(){
 if(circuit.rxs.length<1||circuit.rxs.length>8)throw Error('RXは1〜8局にしてください。');
 if(meshMode()&&circuit.rxs.length+1>MESH_MAX)throw Error('メッシュは2〜8拠点にしてください。');
 if(meshMode())for(const e of [circuit.tx,...circuit.rxs]){const w=meshPower(e);if(!(w>=1&&w<=100000))throw Error('送信電力は1〜100000 Wで指定してください。');}
 for(const e of [circuit.tx,...circuit.rxs]){
  const l=liveLocation(locationFor(e));if(antennaFor(e)?.reference_only)throw Error('参考資料のアンテナは計算に使用できません。');if(!l||!antennaFor(e))throw Error('地点とアンテナのプリセットを選択してください。削除されたプリセットは再選択が必要です。');
  if(l.unavailable)throw Error(l.name+'の有効な最新位置がありません。ゲートウェイの受信状態を確認してください。');
 }
}
function circuitSnapshot(){const snapshot=e=>({...e,location:locationFor(e),antenna:antennaFor(e)});return {version:2,tx:snapshot(circuit.tx),rxs:circuit.rxs.map(snapshot),independence_assumption:$('diversity-independent').checked,mesh:meshMode()};}
function swapReceiver(i){if(busy)return;[circuit.tx,circuit.rxs[i]]=[circuit.rxs[i],circuit.tx];renderCircuit();}
function rxLimit(){return meshMode()?MESH_MAX-1:8;}
function addReceiver(){if(busy||circuit.rxs.length>=rxLimit())return;const used=new Set([circuit.tx,...circuit.rxs].map(e=>e.location_id));const l=catalog.presets.find(p=>!used.has(p.id))??catalog.presets[0];circuit.rxs.push({location_id:l?.id??'',antenna_id:catalog.antennas[0]?.id??'',noise:150,polarization:'model',...(meshMode()?{power_w:Number(sharedPower.value)}:{})});renderCircuit();}
function renderCircuit(){
 function card(e,index){
  const mesh=meshMode(),box=document.createElement('fieldset'),legend=cell('legend',mesh?'拠点'+(index+2)+' · 送受信':index<0?'TX · 送信地点':'RX'+(index+1)+' · 受信地点');box.className='station-card';box.append(legend);
  const location=document.createElement('select'),antenna=document.createElement('select');
  location.add(new Option('地点を選択',''));for(const region of new Set(allLocations().map(p=>p.region))){const group=document.createElement('optgroup');group.label=region;for(const p of allLocations().filter(p=>p.region===region)){const option=new Option(p.name+(p.kind==='mobile'?' [M]':''),p.id);if(!isOriginalPreset(p))option.dataset.userContent='true';group.append(option);};location.append(group);}
  antenna.add(new Option('アンテナを選択',''));for(const [title,directional]of [['全方向（オムニ）',false],['指向性',true]]){const group=document.createElement('optgroup');group.label=title;for(const p of allAntennas().filter(p=>isDirectional(p)===directional)){const option=new Option(p.name+' / '+antennaSummary(p),p.id);if(!isOriginalPreset(p))option.dataset.userContent='true';option.disabled=p.reference_only===true;group.append(option);}if(group.children.length)antenna.append(group);}
  location.value=e.location_id;antenna.value=e.antenna_id;location.onchange=()=>{e.location_id=location.value;renderCircuit();};antenna.onchange=()=>{e.antenna_id=antenna.value;drawMap();};
  for(const [title,select]of [['地点プリセット',location],['アンテナプリセット',antenna]]){const label=cell('label',title);label.append(select);box.append(label);}
  const l=liveLocation(locationFor(e));const info=cell('p',l?fmt(l.lat,4)+'°, '+fmt(l.lon,4)+'°'+(l.kind==='mobile'?' · '+l.position_ref.source+'/'+l.position_ref.id+(l.unavailable?' [有効位置なし]':' [最新位置に連動]'):''):'地点を選択してください');info.className='hint endpoint-position';box.append(info);
  if(index<0){const power=$('tx-power-field');power.hidden=mesh;box.append(power);}
  if(mesh){const label=cell('label','送信電力 W'),input=document.createElement('input');e.power_w=meshPower(e);Object.assign(input,{type:'number',min:1,max:100000,step:'any',required:true,value:e.power_w});input.className='mesh-power';input.oninput=()=>e.power_w=Number(input.value);label.append(input);box.append(label);}
  if(index>=0||mesh){
   const label=cell('label','雑音 −dBW @3 MHz'),input=document.createElement('input');Object.assign(input,{type:'number',min:100,max:180,step:'any',required:true,value:e.noise});input.oninput=()=>e.noise=Number(input.value);label.append(input);box.append(label);
   const swap=cell('button','TXと交換'),remove=cell('button',mesh?'拠点を削除':'RXを削除');swap.type=remove.type='button';swap.onclick=()=>swapReceiver(index);swap.hidden=mesh||index<0;if(index<0)remove.hidden=true;remove.disabled=circuit.rxs.length===1;remove.dataset.locked=String(remove.disabled);remove.onclick=()=>{if(busy||circuit.rxs.length===1)return;circuit.rxs.splice(index,1);renderCircuit();};box.append(swap,remove);
  }
  return box;
 }
 $('tx-selection').replaceChildren(card(circuit.tx,-1));$('rx-selections').replaceChildren(...circuit.rxs.map(card));
 const n=circuit.rxs.length+1;$('add-rx-site').disabled=busy||circuit.rxs.length>=rxLimit();$('add-rx-site').textContent=meshMode()?'＋ 拠点を追加':'＋ RXを追加';$('circuit-mode').textContent=meshMode()?`メッシュ ${n}拠点 · ${n*(n-1)}経路`:circuit.rxs.length===1?'単一RX · 地点間予察':'RX '+circuit.rxs.length+'局 · ダイバーシティー受信';
 renderPolarizationSettings();setBusy(busy);drawMap();
}
function refreshCircuitPositions(){
 const cards=document.querySelectorAll('#station-selection .endpoint-position');
 [circuit.tx,...circuit.rxs].forEach((e,i)=>{const l=liveLocation(locationFor(e));if(cards[i]&&l)cards[i].textContent=fmt(l.lat,4)+'°, '+fmt(l.lon,4)+'°'+(l.kind==='mobile'?' · '+l.position_ref.source+'/'+l.position_ref.id+(l.unavailable?' [有効位置なし]':' [最新位置に連動]'):'');});
 drawMap();
}
function restoreCircuit(selection,p){
 transientLocations.length=0;transientAntennas.length=0;
 let counter=0;
 function endpoint(snapshot,location,antenna,noise,power_w){
  const suffix=String(++counter),loc=snapshot?.location??location,ant=snapshot?.antenna??antenna;
  if(!loc||!ant)throw Error('保存された地点・アンテナ設定が不正です');
  let l=catalog.presets.find(v=>v.id===snapshot?.location_id&&v.lat===loc.lat&&v.lon===loc.lon&&v.name===loc.name&&v.kind===loc.kind&&JSON.stringify(v.position_ref)===JSON.stringify(loc.position_ref));
  if(!l){l={...loc,id:'history-location-'+suffix,region:'履歴・保存設定'};transientLocations.push(l);}
  let a=catalog.antennas.find(v=>v.id===snapshot?.antenna_id&&v.model===ant.model&&v.gain===ant.gain&&v.name===ant.name&&JSON.stringify(antennaConfig(v))===JSON.stringify(antennaConfig(ant))&&(v.reference_only??false)===(ant.reference_only??false)&&JSON.stringify(v.document_ref??null)===JSON.stringify(ant.document_ref??null));
  if(!a){a={...ant,id:'history-antenna-'+suffix};transientAntennas.push(a);}
  const power=snapshot?.power_w??power_w;
  return {location_id:l.id,antenna_id:a.id,noise:Number(snapshot?.noise??noise??150),polarization:snapshot?.polarization??'model',...(power!==undefined?{power_w:Number(power)}:{})};
 }
 if(selection?.version===2&&selection.tx&&Array.isArray(selection.rxs)&&selection.rxs.length>=1&&selection.rxs.length<=8){
  circuit={tx:endpoint(selection.tx),rxs:selection.rxs.map(v=>endpoint(v))};
 }else{
  const loc=(name,lat,lon,ref)=>({name,lat,lon,kind:ref?'mobile':'fixed',region:'履歴・保存設定',...(ref?{position_ref:ref}:{})});
  // Older history has no selection snapshot; keep its saved dimensions and ground constants.
  const dims=(source,prefix)=>Object.fromEntries(Object.keys(antennaConfig(null)).filter(k=>source[prefix+k]!==undefined).map(k=>[k,source[prefix+k]]));
  const tx=endpoint(null,loc('保存TX',p.tx_lat,p.tx_lon,p.tx_position),{name:'保存TXアンテナ',model:p.tx_antenna,gain:p.tx_gain,...dims(p,'tx_')},150);
  if(Array.isArray(p.mesh_sites)&&p.mesh_sites.length>=2){
   const [first,...rest]=p.mesh_sites.slice(0,MESH_MAX).map(s=>endpoint(null,loc(s.name,s.lat,s.lon,s.position_ref),{name:'保存アンテナ',model:s.antenna,gain:s.gain,...dims(s,'')},s.noise,s.power_w));
   circuit={tx:first,rxs:rest};
  }else{
  const sites=p.rx_sites??[{name:'保存RX',lat:p.rx_lat,lon:p.rx_lon,antenna:p.rx_antenna,gain:p.rx_gain,noise:p.noise,position_ref:p.rx_position,...dims(p,'rx_')}];
  circuit={tx,rxs:sites.slice(0,8).map(s=>endpoint(null,loc(s.name,s.lat,s.lon,s.position_ref),{name:'保存RXアンテナ',model:s.antenna,gain:s.gain,...dims(s,'')},s.noise))};
  }
 }
 $('mesh-mode').checked=selection?.mesh??Array.isArray(p.mesh_sites);
 if(!selection){circuit.tx.polarization=p.tx_polarization??'model';circuit.rxs.forEach((e,i)=>e.polarization=p.rx_sites?.[i]?.polarization??p.rx_polarization??'model');if(Array.isArray(p.mesh_sites))[circuit.tx,...circuit.rxs].forEach((e,i)=>e.polarization=p.mesh_sites[i]?.polarization??'model');} $('diversity-independent').checked=(selection?.independence_assumption??p.independence_assumption)===true;updateRadioConditions();renderCircuit();
}
async function loadCatalog(){catalog=await api('/api/presets');renderCatalog();renderCircuit();}
function renderCatalog(){
 for(const [collection,rows,target]of [['locations',catalog.presets,'locations-list'],['antennas',catalog.antennas,'antennas-list']]){
  const table=document.createElement('table'),head=document.createElement('tr');['名称',collection==='locations'?'地域 / 地点':'モデル / 利得','編集','削除',...(collection==='antennas'?['出典・モデル注記']:[])].forEach(t=>head.append(cell('th',t)));table.append(head);
  for(const p of collection==='antennas'?[...rows].sort((a,b)=>isDirectional(a)-isDirectional(b)):rows){
   const tr=document.createElement('tr');const nameCell=cell('td',p.name);if(!isOriginalPreset(p))nameCell.dataset.userContent='true';tr.append(nameCell,cell('td',collection==='locations'?p.region+' / '+(p.kind==='mobile'?p.position_ref.source+'/'+p.position_ref.id:fmt(p.lat,4)+', '+fmt(p.lon,4)):(isDirectional(p)?'指向性':'全方向')+' / '+antennaSummary(p)));
   for(const [title,action]of [['編集',()=>editCatalog(collection,p)],['削除',()=>mutateCatalog({collection,action:'delete',id:p.id})]]){const td=document.createElement('td'),b=cell('button',title);b.type='button';b.onclick=action;td.append(b);tr.append(td);}if(collection==='antennas'){const td=document.createElement('td');if(p.reference){for(const [i,url]of p.reference.sources.entries()){const link=cell('a','Source '+(i+1));link.href=url;link.target='_blank';link.rel='noopener noreferrer';td.append(link,document.createTextNode(' '));}const note=cell('small',p.reference.notes);note.className='hint';td.append(note);if(p.reference_only)td.append(cell('strong','参考資料のみ（計算不可）'));}if(p.document_ref){const link=cell('a','原本をダウンロード');link.href='/api/antenna-imports/'+p.document_ref.id+'/source';link.download='';td.append(link);}tr.append(td);}table.append(tr);
  }$(target).replaceChildren(table);
 }
}
async function mutateCatalog(data){
 try{await post('/api/presets',{revision:catalog.revision,...data});await loadCatalog();notice('プリセットを保存しました。');return true;}
 catch(e){notice(e.message,true);return false;}
}
function editCatalog(collection,p){
 const f=$(collection==='locations'?'location-editor':'antenna-editor');f.reset();f.elements.id.value='';for(const [key,value]of Object.entries(p))if(f.elements[key])f.elements[key].value=value;
 f.dataset.revision=String(catalog.revision);delete f.dataset.reference;delete f.dataset.referenceOnly;delete f.dataset.referenceLength;if(collection==='antennas'){if(p.reference){f.dataset.reference=JSON.stringify(p.reference);if(p.length_m!==null)f.dataset.referenceLength=p.length_m;}if(p.reference_only)f.dataset.referenceOnly='true';}
 if(collection==='antennas'){f.elements.reference_only.checked=!!p.reference_only;if(p.length_m!=null)f.dataset.referenceLength=p.length_m;if(typeof editOCRReference==='function')editOCRReference(p);}
 if(collection==='locations'){updateMobileOptions(p.position_ref);updateLocationKind(false);}else updateAntennaEditor();
 tab(collection==='locations'?'location-presets':'antenna-presets');f.scrollIntoView({block:'nearest',behavior:'smooth'});
}
function updateMobileOptions(ref){
 const select=$('location-editor').elements.mobile_ref,current=ref?JSON.stringify(ref):select.value;select.replaceChildren();
 const refs=new Map();for(const p of catalog.presets.filter(p=>p.kind==='mobile'))refs.set(JSON.stringify(p.position_ref),p.name);
 for(const p of typeof positionData!=='undefined'?positionData?.positions??[]:[])refs.set(JSON.stringify({source:p.source,id:p.id}),p.name+(p.stale?' [期限切れ]':''));
 for(const [key,name]of refs)select.add(new Option(name+' / '+JSON.parse(key).source+'/'+JSON.parse(key).id,key));
 if(ref&&!refs.has(current))select.add(new Option(ref.source+'/'+ref.id,current));
 if(current)select.value=current;
}
function updateLocationKind(copy=true){
 const f=$('location-editor'),mobile=f.elements.kind.value==='mobile';$('mobile-preset-row').hidden=!mobile;
 f.elements.lat.readOnly=f.elements.lon.readOnly=mobile;f.elements.mobile_ref.required=mobile;
 if(mobile&&copy)copyMobileCoordinates();
}
function copyMobileCoordinates(){
 const f=$('location-editor');if(!f.elements.mobile_ref.value)return;
 const ref=JSON.parse(f.elements.mobile_ref.value),p=positionData?.positions.find(r=>r.source===ref.source&&r.id===ref.id)??catalog.presets.find(r=>r.position_ref?.source===ref.source&&r.position_ref?.id===ref.id);
 if(p){f.elements.lat.value=p.lat;f.elements.lon.value=p.lon;if(!f.elements.name.value)f.elements.name.value=p.name;}
}
function registerReceived(p){
 const existing=catalog.presets.find(r=>r.position_ref?.source===p.source&&r.position_ref?.id===p.id);
 editCatalog('locations',existing??{name:p.name.slice(0,40),kind:'mobile',region:'移動局',lat:p.lat,lon:p.lon,position_ref:{source:p.source,id:p.id}});
}
$('add-rx-site').onclick=addReceiver;
$('mesh-mode').onchange=()=>{if(meshMode()&&circuit.rxs.length>MESH_MAX-1){$('mesh-mode').checked=false;notice('メッシュは2〜8拠点です。RXを7局以下にしてから選択してください。',true);return;}renderCircuit();};
$('station-selection').onsubmit=e=>e.preventDefault();
$('catalog-refresh').onclick=()=>loadCatalog().catch(e=>notice(e.message,true));
for(const [collection,id]of [['locations','location-editor'],['antennas','antenna-editor']]){
 const editor=$(id);editor.addEventListener('focusin',()=>{if(!editor.dataset.revision)editor.dataset.revision=String(catalog.revision);});
 editor.onsubmit=async e=>{
  e.preventDefault();const preset=Object.fromEntries(new FormData(editor));if(!preset.id)delete preset.id;
  if(collection==='locations'){preset.lat=Number(preset.lat);preset.lon=Number(preset.lon);if(preset.kind==='mobile'){if(!preset.mobile_ref){notice('受信局を選択してください。',true);return;}preset.position_ref=JSON.parse(preset.mobile_ref);}delete preset.mobile_ref;}
  else {if(editor.dataset.reference)preset.reference=JSON.parse(editor.dataset.reference);if(!('length_m' in preset)&&editor.dataset.referenceLength)preset.length_m=editor.dataset.referenceLength;preset.reference_only=editor.elements.reference_only.checked;if(editor.dataset.documentRef)preset.document_ref={...JSON.parse(editor.dataset.documentRef),reviewed:$('ocr-reviewed').checked,approximation_ack:$('ocr-approximation').checked};preset.gain=Number(preset.gain);for(const key of antennaFields)if(key in preset)preset[key]=Number(preset[key]);}
  const ok=await mutateCatalog({collection,action:'save',preset,revision:Number(editor.dataset.revision??catalog.revision)});if(ok){editor.reset();editor.elements.id.value='';delete editor.dataset.revision;delete editor.dataset.reference;delete editor.dataset.referenceOnly;delete editor.dataset.referenceLength;if(collection==='locations')updateLocationKind();else {updateAntennaEditor();if(typeof editOCRReference==='function')editOCRReference({});}}
 };
}
$('new-location').onclick=()=>{const f=$('location-editor');f.reset();f.elements.id.value='';f.dataset.revision=String(catalog.revision);updateMobileOptions();updateLocationKind();};
$('new-antenna').onclick=()=>{const f=$('antenna-editor');f.reset();f.elements.id.value='';delete f.dataset.reference;delete f.dataset.referenceOnly;delete f.dataset.referenceLength;f.dataset.revision=String(catalog.revision);updateAntennaEditor();};
$('location-editor').elements.kind.onchange=()=>{updateMobileOptions();updateLocationKind();};
$('location-editor').elements.mobile_ref.onchange=copyMobileCoordinates;


window.addEventListener('hf-language-change',()=>drawMap());

function updateAntennaEditor(){
 const f=$('antenna-editor'),model=f.elements.model.value,geometric=['monopole','dipole','vertical_dipole','log_periodic','inverted_l','sloping_long_wire'].includes(model),dipole=['dipole','vertical_dipole','log_periodic','inverted_l','sloping_long_wire'].includes(model);
 for(const key of antennaFields){const enabled=key==='length_m'?geometric:key==='height_m'?dipole:key==='azimuth_deg'?isDirectional({model})&&f.elements.azimuth_mode.value!=='path':key in extraDefaults?key in (modelFields[model]??{}):geometric;f.elements[key].disabled=!enabled;f.elements[key].required=enabled;}
 f.elements.azimuth_mode.disabled=!isDirectional({model});
 for(const label of f.querySelectorAll('.directional-only'))label.hidden=!isDirectional({model});
 for(const label of f.querySelectorAll('.lp-only'))label.hidden=model!=='log_periodic';
 for(const label of f.querySelectorAll('.lw-only'))label.hidden=model!=='sloping_long_wire';
}
$('antenna-editor').elements.model.onchange=()=>{const f=$('antenna-editor');for(const [key,value]of Object.entries(extraDefaults))if(!f.elements[key].value)f.elements[key].value=value;if(f.elements.model.value==='inverted_l'&&Number(f.elements.height_m.value)<=0)f.elements.height_m.value=12;if(f.elements.model.value==='log_periodic'){if(!f.elements.length_m.value)f.elements.length_m.value=25;if(Number(f.elements.height_m.value)<=0)f.elements.height_m.value=20;}if(!f.elements.length_m.value)f.elements.length_m.value=10;if(f.elements.model.value==='dipole'&&Number(f.elements.height_m.value)<=0)f.elements.height_m.value=10;if(f.elements.model.value==='vertical_dipole')f.elements.height_m.value=Math.max(Number(f.elements.height_m.value),Number(f.elements.length_m.value)/2+1);updateAntennaEditor();};
$('antenna-editor').elements.azimuth_mode.onchange=updateAntennaEditor;
updateAntennaEditor();
Object.assign(defaultPresetNames,{"reference-marine-at100d":"艦船 Comrod AT100D（寸法近似）","reference-marine-at83":"艦船 Comrod AT83（寸法近似）","reference-air-chelton455":"航空機 Chelton 455（参考資料）"});
Object.assign(defaultPresetNames,{'reference-air-p3-longwire':'P-3 HFロングワイヤー（参考資料）'});
Object.assign(defaultPresetNames,{'standard-lpda-25':'水平ログペリ 最長25 m・16素子','standard-inverted-l-30':'逆L 水平部30 m・垂直部12 m','standard-sloper-40':'スローパー 40 m・傾斜15°'});
