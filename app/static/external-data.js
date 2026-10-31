'use strict';
function fetchedTime(value){return typeof value==='number'&&Number.isFinite(value)?new Date(value*1000).toISOString().replace('T',' ').replace(/\.\d+Z$/,' UTC'):'未取得';}
function renderExternalDataTimes(){
 const rows=[];
 function add(name,source,observed){
  // Data is fetched by the fetcher container or uploaded by an administrator; this only shows what the server holds.
  const state=source?.fetch_state==='failed'&&!source?.fetched_at?'取得失敗':source?.stale?'古いデータ':source?.fetch_state==='uploaded'?'反映中（ファイル取り込み）':source?.fetched_at?'反映中':'未取得';
  rows.push([name,observed||'時刻不明',fetchedTime(source?.fetched_at),state+(source?.error?' / '+source.error:'')]);
 }
 for(const [key,label]of [['observed','NOAA / SSN observed'],['predicted','NOAA / SSN predicted'],['scales','NOAA / R-S-G']])add(label,weatherSnapshot?.sources?.[key],key==='scales'?weatherSnapshot?.current?.observed_at:weatherSnapshot?'月間系列・発行時刻不明':null);
 add('NOAA / D-RAP',observationData?.drap,observationData?.drap?.data?.observed_at);
 const nict=observationData?.nict;
 if(nict?.data?.stations?.length)for(const station of nict.data.stations)add('NICT / '+station.code,{...nict,stale:station.stale},station.observed_at);
 else add('NICT',nict,null);
 if(observationData?.giro?.enabled===false)rows.push(['GIRO','—','—','無効']);
 else add('GIRO / '+$('giro-station').value,overseasData,overseasData?.data?.observed_at);
 $('external-data-times').replaceChildren(observationTable(['データソース','観測・発行時刻','最終取得成功 UTC','取得状態'],rows));
}
let publicDataLink=null;
function renderPublicDataLink(){
 const l=publicDataLink,box=$('public-data-link');
 if(!l){box.textContent='取得用コンテナとの連携状況を確認できません。';return;}
 if(l.mode==='file'){box.replaceChildren(document.createTextNode('ファイル連携：管理者が取り込んだ連携ファイルを使用しています。'),' ',document.createTextNode(l.checked_at?'最終取り込み':'連携ファイルは未取り込みです。'),l.checked_at?' '+fetchedTime(l.checked_at):'');return;}
 box.replaceChildren(document.createTextNode(l.connected?'取得用コンテナとのAPI連携：接続中':'取得用コンテナとのAPI連携：接続できません'),' ',document.createTextNode('確認'),' '+fetchedTime(l.checked_at));
 if(!l.connected){box.append(' / ',document.createTextNode(l.error||'取得用コンテナに接続できないか、応答が不正です'));if(l.connected_at)box.append(' / ',document.createTextNode('最後に接続できた時刻'),' '+fetchedTime(l.connected_at));}
}
async function refreshPublicDataLink(){try{publicDataLink=await api('/api/public-data/status');}catch{publicDataLink=null;}renderPublicDataLink();}
let externalLoading=false,externalLoadedAt=0;
// The server holds what the fetcher downloaded; the page shows it on open and every 5 minutes.
async function refreshExternalData(){
 if(externalLoading)return;externalLoading=true;externalLoadedAt=Date.now();
 try{
  await Promise.allSettled([refreshPublicDataLink(),refreshWeather(),refreshObservations()]);
  if(observationData?.giro?.enabled)await refreshGiro();
 }finally{externalLoading=false;renderExternalDataTimes();}
}
renderExternalDataTimes();
document.addEventListener('DOMContentLoaded',refreshExternalData,{once:true});
setInterval(()=>{if(!document.hidden)refreshExternalData();},300000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-externalLoadedAt>300000)refreshExternalData();});
