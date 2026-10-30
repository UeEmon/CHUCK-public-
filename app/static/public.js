'use strict';
// Public deployment layer, loaded right after app.js by public_server.py.
// Shared presets are read-only for visitors; their own locations, one own
// antenna and their history stay in this browser. Admin requests (through the admin site) are untouched.
const PUBLIC_CONFIG=fetch('/api/public-config').then(r=>r.ok?r.json():{public:false}).catch(()=>({public:false}));
const PUBLIC_STORE='chuck-public-v1';
const PUBLIC_LIMIT=200,HISTORY_LIMIT=100,ANTENNA_LIMIT=1;
const publicKinds={'/api/predict':'point','/api/coverage':'coverage','/api/coverage-matrix':'coverage','/api/diversity':'rx_diversity','/api/mesh':'mesh','/api/annual':'annual','/api/power':'power','/api/sites':'sites'};

function publicLoad(){
 try{const v=JSON.parse(localStorage.getItem(PUBLIC_STORE)||'{}');const list=k=>Array.isArray(v[k])?v[k]:[];return {locations:list('locations'),antennas:list('antennas').slice(0,ANTENNA_LIMIT),history:list('history')};}
 catch{return {locations:[],antennas:[],history:[]};}
}
function publicSave(v){
 try{localStorage.setItem(PUBLIC_STORE,JSON.stringify(v));}
 catch{throw Error('このブラウザに保存できません。プライベートモードや保存領域の設定を確認してください。');}
}
const ANTENNA_SHARED='全員が使える共通のアンテナプリセットは管理者が登録します。';
const ANTENNA_FULL='このブラウザに登録できる自分のアンテナは1つまでです。今のアンテナを編集するか、削除してから登録してください。';
const isLocalPreset=p=>typeof p?.id==='string'&&p.id.startsWith('local-');
function localId(){return 'local-'+(crypto.randomUUID?crypto.randomUUID().replace(/-/g,''):Date.now().toString(16)+Math.random().toString(16).slice(2));}
function publicName(name){
 if(typeof name!=='string'||!name.trim()||name.trim().length>40)throw Error('名称は1〜40文字で指定してください');
 return name.trim();
}
function publicNumber(value,label,min,max){
 const n=Number(value);if(!Number.isFinite(n)||n<min||n>max)throw Error(`${label}は${min}〜${max}の範囲で指定してください`);return n;
}
function cleanLocation(p){
 if(p.kind==='mobile'||p.position_ref)throw Error('公開版では移動局の地点は登録できません');
 const region=typeof p.region==='string'&&p.region.trim()?p.region.trim().slice(0,40):'マイ地点';
 return {id:p.id,name:publicName(p.name),kind:'fixed',region,lat:publicNumber(p.lat,'緯度',-89,89),lon:publicNumber(p.lon,'経度',-180,180)};
}
const ANTENNA_MODELS=['whip','isotropic','monopole','dipole','vertical_dipole'],GEOMETRIC=['monopole','dipole','vertical_dipole'];
function cleanAntenna(p){
 // Mirrors the server's antenna_parameters; the calculation checks the values again.
 if(!ANTENNA_MODELS.includes(p.model))throw Error('アンテナのモデルを選んでください');
 const range=(value,min,max,fallback)=>{if(value===undefined||value===null||value==='')return fallback;const n=Number(value);if(!Number.isFinite(n)||n<min||n>max)throw Error('アンテナの利得・寸法が入力できる範囲を超えています');return n;};
 const length=GEOMETRIC.includes(p.model)?range(p.length_m,.1,200,NaN):null;if(Number.isNaN(length))throw Error('アンテナの利得・寸法が入力できる範囲を超えています');
 const a={id:p.id,name:publicName(p.name),model:p.model,gain:range(p.gain,-20,30,0),length_m:length,
  height_m:range(p.height_m,0,200,p.model==='dipole'||p.model==='vertical_dipole'?10:0),azimuth_deg:range(p.azimuth_deg,0,359.9,0),
  ground_permittivity:range(p.ground_permittivity,1,80,13),ground_conductivity:range(p.ground_conductivity,.00003,5,.005),reference_only:false};
 if(a.model==='dipole'&&a.height_m<.1)throw Error('水平ダイポールの地上高は0.1 m以上にしてください');
 if(a.model==='vertical_dipole'&&a.height_m<=a.length_m/2)throw Error('垂直ダイポールの給電点高は全長の半分より高くしてください');
 return a;
}
function editLocalPreset(data,catalogNow){
 const antennas=data.collection==='antennas',store=publicLoad(),key=antennas?'antennas':'locations',rows=store[key];
 if(data.action==='delete'){
  if(!isLocalPreset({id:data.id}))throw Error('共通プリセットは削除できません（管理者のみ）');
  store[key]=rows.filter(p=>p.id!==data.id);publicSave(store);return {revision:catalogNow.revision,id:data.id};
 }
 if(data.action!=='save')throw Error('公開版では使用できない操作です');
 const input={...data.preset};delete input.document_ref;delete input.reference;
 const shared=antennas?catalogNow.antennas:catalogNow.presets;
 // Editing a shared preset saves the visitor's own copy.
 if(!isLocalPreset(input)){
  input.id=localId();
  if(typeof input.name==='string'&&shared.some(v=>v.name===input.name.trim()))input.name=input.name.trim().slice(0,34)+'（コピー）';
 }
 const p=antennas?cleanAntenna(input):cleanLocation(input);
 if([...shared,...rows].some(v=>v.name===p.name&&v.id!==p.id))throw Error('同じ名前が登録されています');
 const index=rows.findIndex(v=>v.id===p.id);
 if(index<0&&antennas&&rows.length>=ANTENNA_LIMIT)throw Error(ANTENNA_FULL);
 if(index<0&&rows.length>=PUBLIC_LIMIT)throw Error('このブラウザに保存できるのは'+PUBLIC_LIMIT+'件までです');
 if(index<0)rows.push(p);else rows[index]=p;
 publicSave(store);return {revision:catalogNow.revision,id:p.id};
}
function rememberResult(path,r){
 if(!r?.id)return;
 const store=publicLoad();
 store.history=[{id:r.id,created:r.created,kind:publicKinds[path],parameters:r.parameters},...store.history.filter(h=>h.id!==r.id)].slice(0,HISTORY_LIMIT);
 try{publicSave(store);}catch{/* A calculation still succeeds without local history. */}
}

const upstreamApi=api;
let publicSharedCatalog={revision:0,presets:[],antennas:[]};
api=async function(url,options){
 const cfg=await PUBLIC_CONFIG;
 if(!cfg.public||cfg.admin)return upstreamApi(url,options);
 const path=url.split('?')[0],method=(options?.method||'GET').toUpperCase();
 if(path==='/api/history')return publicLoad().history;
 if(path==='/api/presets'&&method==='GET'){
  publicSharedCatalog=await upstreamApi(url,options);const store=publicLoad();
  return {...publicSharedCatalog,presets:[...publicSharedCatalog.presets,...store.locations],antennas:[...publicSharedCatalog.antennas,...store.antennas]};
 }
 if(path==='/api/presets')return editLocalPreset(JSON.parse(options.body),publicSharedCatalog);
 if(['/api/ai-settings','/api/antenna-imports','/api/positions','/api/position-stations'].some(p=>path===p||path.startsWith(p+'/')))
  throw Error('公開版では使用できない機能です');
 const r=await upstreamApi(url,options);
 if(method==='POST'&&publicKinds[path])rememberResult(path,r);
 return r;
};

function publicExport(){
 const blob=new Blob([JSON.stringify((({locations,antennas,history})=>({format:'chuck-public-v1',exported:new Date().toISOString(),locations,antennas,history}))(publicLoad()),null,2)],{type:'application/json'});
 const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='chuck-my-data.json';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
}
async function publicImport(file){
 try{
  const data=JSON.parse(await file.text());if(data?.format!=='chuck-public-v1')throw Error('CHUCKの書き出しファイルではありません');
  const store=publicLoad();let added=0;
  for(const raw of Array.isArray(data.locations)?data.locations:[]){
   if(store.locations.length>=PUBLIC_LIMIT)break;
   try{const p=cleanLocation({...raw,id:isLocalPreset(raw)?raw.id:localId()});if(store.locations.some(v=>v.id===p.id||v.name===p.name))continue;store.locations.push(p);added++;}catch{/* Skip invalid rows. */}
  }
  for(const raw of Array.isArray(data.antennas)?data.antennas:[]){
   if(store.antennas.length>=ANTENNA_LIMIT)break;
   try{const a=cleanAntenna({...raw,id:isLocalPreset(raw)?raw.id:localId()});if(publicSharedCatalog.antennas.some(v=>v.name===a.name))continue;store.antennas.push(a);added++;}catch{/* Skip invalid rows. */}
  }
  const known=new Set(store.history.map(h=>h.id));
  for(const h of Array.isArray(data.history)?data.history:[])if(typeof h?.id==='string'&&/^[0-9a-f]{32}$/.test(h.id)&&!known.has(h.id)){store.history.push(h);known.add(h.id);}
  store.history.sort((a,b)=>String(b.created).localeCompare(String(a.created)));store.history=store.history.slice(0,HISTORY_LIMIT);
  publicSave(store);await loadCatalog();notice(added+'件のプリセットと履歴を読み込みました。');
 }catch(e){notice(e.message,true);}
}

function publicHint(text){const p=document.createElement('p');p.className='hint public-hint';p.textContent=text;return p;}
function publicTools(){
 const box=document.createElement('div');box.className='exports public-tools';
 const exportButton=document.createElement('button'),importButton=document.createElement('button'),input=document.createElement('input');
 exportButton.type=importButton.type='button';exportButton.textContent='自分のデータを書き出す';importButton.textContent='書き出したデータを読み込む';
 Object.assign(input,{type:'file',accept:'application/json,.json',hidden:true});
 exportButton.onclick=publicExport;importButton.onclick=()=>input.click();input.onchange=()=>{if(input.files[0])publicImport(input.files[0]);input.value='';};
 box.append(exportButton,importButton,input);return box;
}

const CATALOG_OPTIONAL='追加してほしいアンテナがある方は、寄付をいただいた方のうち希望者に限り、アンテナのカタログや仕様書（型式・寸法・周波数範囲が分かる資料）をお送りいただけます。資料の送付は任意で、寄付だけでも大歓迎です。';
const CATALOG_NOT_PROMISED='いただいた資料は内容を確認して登録を検討しますが、登録をお約束するものではありません。資料の内容や公開の可否によっては見送ることがあります。寄付は登録の対価ではありません。';
async function supportMeter(cfg){
 // Shows this month's expected sponsorship against the running cost, and public sponsors.
 if(!cfg.donations)return null;
 const s=await fetch('/api/support/summary').then(r=>r.ok?r.json():null).catch(()=>null);if(!s)return null;
 const box=document.createElement('div');box.className='public-support-meter';
 if(s.goal_usd>0){
  const usd=v=>'$'+v.toLocaleString('en-US',{maximumFractionDigits:2});
  const p=publicHint('今月の支援見込み '+usd(s.expected_usd)+' / 運営費の目安 '+usd(s.goal_usd));
  const bar=document.createElement('progress');bar.style.width='100%';bar.max=s.goal_usd;bar.value=Math.min(s.expected_usd,s.goal_usd);
  box.append(p,bar);
 }
 if(s.supporters.length){
  const p=publicHint('ご支援ありがとうございます：'),names=document.createElement('span');
  names.dataset.userContent='';names.textContent=' '+s.supporters.join('、');p.append(names);box.append(p);
 }
 return box.childNodes.length?box:null;
}
function antennaRequest(cfg){
 // Antennas are curated by the administrator; donors may optionally send catalogs.
 const box=document.createElement('div');box.className='panel public-antenna-request';
 box.append(publicHint(ANTENNA_SHARED),publicHint(CATALOG_OPTIONAL),publicHint(CATALOG_NOT_PROMISED));
 const links=document.createElement('p');links.className='exports';
 for(const [url,label]of [[cfg.donation_url,'GitHub Sponsorsで寄付する'],[cfg.contact_url,'アンテナ資料を送る（希望者のみ）']]){
  if(!url)continue;const a=document.createElement('a');a.href=url;a.textContent=label;
  if(!url.startsWith('/')){a.target='_blank';a.rel='noopener noreferrer';}
  links.append(a,document.createTextNode(' '));
 }
 if(links.childNodes.length)box.append(links);
 if(cfg.donation_url)box.append(publicHint('寄付はGitHub Sponsors（GitHubアカウントが必要）で、毎月または1回だけを選べます。'));
 supportMeter(cfg).then(meter=>{if(meter)box.append(meter);});
 return box;
}
const domReady=new Promise(resolve=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',resolve,{once:true}):resolve());
Promise.all([PUBLIC_CONFIG,domReady]).then(([cfg])=>{
 if(cfg.public&&cfg.admin&&cfg.donations){
  // Admins reach the donation ledger from the antenna screen.
  const link=Object.assign(document.createElement('a'),{href:'/support-admin.html',textContent:'寄付と資料の管理'});
  const p=document.createElement('p');p.className='exports';p.append(link);document.getElementById('antenna-editor')?.before(p);
 }
 if(!cfg.public||cfg.admin)return;
 const hide=el=>{if(el){el.hidden=true;el.style.display='none';}};
 hide(document.querySelector('[data-tab="positions"]'));hide(document.getElementById('positions'));
 hide(document.getElementById('ai-settings-panel'));hide(document.getElementById('antenna-import-panel'));
 const mobile=document.querySelector('#location-editor select[name="kind"] option[value="mobile"]');if(mobile)mobile.remove();
 const ownAntenna='アンテナは自分用を1つだけ登録できます。このブラウザにだけ保存され、他の利用者には表示されません。共通のアンテナは「コピーして編集」で自分用に変えられます。';
 const shared='共通プリセットは閲覧専用です。追加・編集した地点は「自分の」プリセットとしてこのブラウザにだけ保存され、他の利用者には表示されません。';
 const locationEditor=document.getElementById('location-editor');if(locationEditor)locationEditor.before(publicHint(shared),publicTools());
 const antennaEditor=document.getElementById('antenna-editor');
 if(antennaEditor){
  antennaEditor.before(antennaRequest(cfg),publicHint(ownAntenna));
  // Document-backed and reference-only antennas stay with the administrator.
  for(const name of ['reference_only'])hide(antennaEditor.elements[name]?.closest('label'));
  for(const id of ['ocr-reviewed','ocr-approximation'])hide(document.getElementById(id)?.closest('label'));
 }
 const historyList=document.getElementById('history-list');
 if(historyList)historyList.before(publicHint('計算履歴はこのブラウザにだけ保存されます。サーバー上の結果は'+cfg.retention_days+'日後に削除されます。'),publicTools());
 if(typeof renderCatalog==='function'){
  const upstreamRender=renderCatalog;
  renderCatalog=function(){
   upstreamRender();
   for(const [rows,target]of [[catalog.presets,'locations-list'],[catalog.antennas,'antennas-list']]){
    const trs=document.querySelectorAll('#'+target+' tr');
    rows.forEach((p,i)=>{
     const buttons=trs[i+1]?.querySelectorAll('button');if(!buttons||buttons.length<2||isLocalPreset(p))return;
     buttons[0].textContent='コピーして編集';buttons[1].disabled=true;buttons[1].title='共通プリセットは削除できません';
    });
   }
  };
 }
 loadCatalog().catch(e=>notice(e.message,true));
});
