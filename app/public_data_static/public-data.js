'use strict';
const $=id=>document.getElementById(id);
let loading=false,status=null;
function cell(tag,text){const e=document.createElement(tag);e.textContent=text;return e;}
function notice(text,error=false){$('notice').textContent=text;$('notice').classList.toggle('error',error);}
function loginView(authenticated){$('management').hidden=!authenticated;$('login-panel').hidden=authenticated;$('logout').hidden=!authenticated;}
async function api(url,data){
 const r=await fetch(url,{credentials:'same-origin',...(data===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})});
 const body=await r.json();if(!r.ok){if(r.status===401)loginView(false);throw Error(body.error||'通信に失敗しました');}return body;
}
function table(headers,rows){const t=document.createElement('table'),head=document.createElement('tr');headers.forEach(v=>head.append(cell('th',v)));t.append(head);for(const values of rows){const tr=document.createElement('tr');values.forEach(v=>tr.append(cell('td',v??'—')));t.append(tr);}return t;}
function interval(seconds){return seconds>=3600?seconds/3600+' 時間':seconds/60+' 分';}
function render(){
 const sources=Object.entries(status.sources),fetched=sources.filter(([,s])=>s.fetched_at).length;
 $('fetcher-status').textContent='取得済み '+fetched+' / '+sources.length+' · CHUCK連携 '+(status.client_enabled?'有効':'無効（HF_PUBLIC_DATA_TOKEN未設定）')+' · GIRO '+(status.giro_enabled?'有効':'無効');
 $('source-list').replaceChildren(table(['データ','提供元','更新間隔','最終取得成功 UTC','状態'],sources.map(([key,s])=>[key,s.url,interval(s.refresh_seconds),s.fetched_at?s.fetched_at.replace('T',' ').replace(/\.\d+/,'').replace('+00:00',' UTC'):'未取得',s.error||(s.fetched_at?(s.age_seconds>s.refresh_seconds*2?'古いデータ':'取得済み'):'未取得')])));
 $('giro-state').textContent=status.giro_enabled?'GIROの取得は有効です。':'GIROの取得は無効です。';
 $('giro-terms').href=status.giro_terms_url;$('giro-enable').hidden=status.giro_enabled;$('giro-disable').hidden=!status.giro_enabled;
 $('giro-form').elements.terms_accepted.closest('label').hidden=status.giro_enabled;
}
async function refresh(){if(loading)return;loading=true;try{status=await api('/ui/api/status');loginView(true);render();}catch(e){notice(e.message,true);}finally{loading=false;}}
async function saveGiro(enabled){
 try{status=await api('/ui/api/settings',{giro_enabled:enabled,terms_accepted:$('giro-form').elements.terms_accepted.checked});$('giro-form').reset();render();notice(enabled?'GIROの取得を有効にしました。次の取得から反映します。':'GIROの取得を無効にしました。');}catch(e){notice(e.message,true);}
}
$('login-form').onsubmit=async e=>{e.preventDefault();const field=e.currentTarget.elements.password;try{const password=field.value;field.value='';await api('/ui/api/login',{password});loginView(true);notice('ログインしました。');await refresh();}catch(e){notice(e.message,true);}};
$('logout').onclick=async()=>{try{await api('/ui/api/logout',{});status=null;$('source-list').replaceChildren();loginView(false);notice('ログアウトしました。');}catch(e){notice(e.message,true);}};
$('giro-form').onsubmit=e=>{e.preventDefault();saveGiro(true);};
$('giro-disable').onclick=()=>saveGiro(false);
$('fetch-now').onclick=async()=>{
 const button=$('fetch-now');button.disabled=true;notice('提供元から取得しています。');
 try{status=await api('/ui/api/fetch',{});render();const failed=Object.values(status.sources).filter(s=>s.error).length;notice(failed?'取得できなかったデータがあります。状態を確認してください。':'全データを取得しました。',failed>0);}catch(e){notice(e.message,true);}finally{button.disabled=false;}
};
(async()=>{try{const session=await api('/ui/api/session');loginView(session.authenticated);$('login-status').textContent=session.configured?'管理専用パスワードでログインしてください。':'管理パスワードを設定してください。';$('login-form').querySelector('button').disabled=!session.configured;if(session.authenticated)await refresh();}catch(e){notice(e.message,true);}})();
setInterval(()=>{if(!$('management').hidden&&!document.hidden)refresh();},30000);
