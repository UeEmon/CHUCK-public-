'use strict';
// Admin page: how public data reaches CHUCK, and file uploads for on-premises servers (file link).
(function(){
 const status=document.getElementById('status'),form=document.getElementById('space-weather-form');
 const say=(text,error)=>{status.textContent=text;status.style.color=error?'#f18c8c':'';};
 const LABELS={observed:'観測平滑SSN',predicted:'予測平滑SSN',scales:'障害レベル（R/S/G）'};
 const ORIGINS={upload:'NOAAファイルの取り込み',download:'NOAAから取得',api:'取得用コンテナ（API連携）',file:'連携ファイル'};
 const when=seconds=>new Date(seconds*1000).toLocaleString('sv-SE',{timeZone:'Asia/Tokyo'}).slice(0,16)+' JST';
 async function upload(file){
  const r=await fetch('/api/space-weather/upload',{method:'POST',headers:{'Content-Type':'application/json'},body:await file.text()});
  const v=await r.json().catch(()=>({}));if(!r.ok)throw Error(v.error||'失敗しました');return v;
 }
 async function show(){
  const r=await fetch('/api/space-weather'),v=await r.json().catch(()=>({}));
  if(!r.ok)throw Error(v.error||'失敗しました');
  const api=v.link?.mode!=='file';
  document.getElementById('space-weather-mode').textContent=api?`現在の連携方式：API連携（${v.link?.url}）`:'現在の連携方式：ファイル連携（オンプレミス）';
  document.getElementById('public-data-export').hidden=!api;
  const t=document.createElement('table'),head=t.insertRow();
  for(const h of ['データ','取得元','取得・取り込み時刻','収録期間','状態']){const th=document.createElement('th');th.textContent=h;th.style.textAlign='left';head.append(th);}
  for(const [key,label]of Object.entries(LABELS)){
   const s=v.sources?.[key]||{},tr=t.insertRow(),cell=text=>{const td=tr.insertCell();td.style.textAlign='left';td.textContent=text;};
   cell(label);
   cell(ORIGINS[s.origin]||'—');
   cell(s.fetched_at?when(s.fetched_at):'未取得');
   cell(s.months?s.months.first+' – '+s.months.last:'—');
   cell(!s.fetched_at?'データがありません':s.stale?'古いデータ（計算に使えません）':'使用中');
  }
  document.getElementById('space-weather-sources').replaceChildren(t);
 }
 form.onsubmit=async e=>{
  e.preventDefault();
  const button=form.querySelector('button[type="submit"]');button.disabled=true;
  const done=[],failed=[];
  try{
   for(const file of form.elements.files.files){
    try{
     const v=await upload(file);
     if(!v.bundle){done.push(LABELS[v.kind]);continue;}
     done.push(v.bundle.imported.length?'連携ファイル':'連携ファイル（新しいデータなし）');
     if(v.bundle.rejected.length)failed.push(file.name+': 取り込めないデータ '+v.bundle.rejected.join(', '));
    }catch(error){failed.push(file.name+': '+error.message);}
   }
   if(failed.length)say(failed.join(' / '),true);
   else say('取り込みました：'+done.join(', '));
   form.reset();await show();
  }catch(error){say(error.message,true);}
  finally{button.disabled=false;}
 };
 show().catch(e=>say(e.message,true));
})();
