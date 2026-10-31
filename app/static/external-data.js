'use strict';
function fetchedTime(value){return typeof value==='number'&&Number.isFinite(value)?new Date(value*1000).toISOString().replace('T',' ').replace(/\.\d+Z$/,' UTC'):'未取得';}
function renderExternalDataTimes(){
 const rows=[];
 function add(name,source,observed){
  const state=source?.fetch_state==='failed'?'取得失敗':source?.stale?'古いデータ':source?.fetch_state==='downloaded'?'最新取得':source?.fetch_state==='uploaded'?'ファイル取り込み':source?.fetched_at?'キャッシュ':'未取得';
  rows.push([name,observed||'時刻不明',fetchedTime(source?.fetched_at),state+(source?.error?' / '+source.error:'')]);
 }
 for(const [key,label]of [['observed','NOAA / SSN observed'],['predicted','NOAA / SSN predicted'],['scales','NOAA / R-S-G']])add(label,weatherSnapshot?.sources?.[key],key==='scales'?weatherSnapshot?.current?.observed_at:weatherSnapshot?'月間系列・発行時刻不明':null);
 add('NOAA / D-RAP',observationData?.drap,observationData?.drap?.data?.observed_at);
 const nict=observationData?.nict;
 if(nict?.data?.stations?.length)for(const station of nict.data.stations)add('NICT / '+station.code,{...nict,stale:station.stale},station.observed_at);
 else add('NICT',nict,null);
 add('GIRO / '+$('giro-station').value,overseasData,overseasData?.data?.observed_at);
 $('external-data-times').replaceChildren(observationTable(['データソース','観測・発行時刻','最終取得成功 UTC','取得状態'],rows));
}
$('external-refresh-all').onclick=async()=>{
 const button=$('external-refresh-all');if(button.disabled)return;button.disabled=true;$('external-update-status').textContent='外部データを更新中です。';
 try{
  await Promise.allSettled([refreshWeather(true),$('observations-refresh').onclick()]);
  if(observationData?.giro?.enabled&&!$('giro-refresh').disabled)await $('giro-refresh').onclick();
  $('external-update-status').textContent='更新処理が完了しました。各ソースの取得状態を確認してください。';
 }finally{button.disabled=false;renderExternalDataTimes();}
};
renderExternalDataTimes();
