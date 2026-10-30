'use strict';
// Admin page for the public site's calculation budget (admin site only).
(function(){
 const status=document.getElementById('status'),form=document.getElementById('rate-form');
 const say=(text,error)=>{status.textContent=text;status.style.color=error?'#f18c8c':'';};
 const LABELS={'/api/predict':'24時間予測','/api/coverage':'カバー範囲（1時刻）','/api/coverage-matrix':'カバー範囲（周波数×時刻）','/api/diversity':'ダイバーシティー予測',
  '/api/mesh':'メッシュ予測','/api/annual':'12か月予測','/api/power':'必要な送信電力','/api/sites':'拠点の候補'};
 async function call(body){
  const r=await fetch('/api/admin/rate-limit',body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{});
  const v=await r.json().catch(()=>({}));if(!r.ok)throw Error(v.error||'失敗しました');return v;
 }
 const when=iso=>new Date(iso).toLocaleString('sv-SE',{timeZone:'Asia/Tokyo'}).slice(0,16)+' JST';
 function counts(){
  // How many runs of each kind fit in the budget, updated while typing.
  const budget=Number(form.elements.budget.value);
  for(const input of form.querySelectorAll('[data-cost]')){
   const cost=Number(input.value),out=input.closest('tr').querySelector('output');
   out.textContent=cost>0&&budget>=0?String(Math.floor(budget/cost)):'—';
  }
 }
 function show(s){
  form.elements.budget.value=s.budget;form.elements.window_minutes.value=Math.round(s.window_seconds/60);
  const d=s.defaults;
  document.getElementById('rate-defaults').textContent=`既定値：${Math.round(d.window_seconds/60)}分あたり${d.budget}ポイント（環境変数 CHUCK_RATE_BUDGET・CHUCK_RATE_WINDOW_SECONDS）`;
  document.getElementById('rate-updated').textContent=s.updated?`最終更新：${when(s.updated)}`:'既定値で動作しています';
  const t=document.createElement('table'),head=t.insertRow();
  for(const h of ['計算の種類','1回の消費ポイント','時間枠あたりの回数','既定値']){const th=document.createElement('th');th.textContent=h;th.style.textAlign='left';head.append(th);}
  for(const [path,label]of Object.entries(LABELS)){
   if(!(path in s.cost))continue;
   const tr=t.insertRow(),cell=v=>{const td=tr.insertCell();td.style.textAlign='left';td.append(v);};
   cell(label);
   const input=Object.assign(document.createElement('input'),{type:'number',min:1,max:1000,step:1,required:true,value:s.cost[path]});
   input.dataset.cost=path;input.style.maxWidth='120px';input.setAttribute('aria-label',label);cell(input);
   cell(document.createElement('output'));cell(String(d.cost[path]));
  }
  document.getElementById('rate-costs').replaceChildren(t);counts();
 }
 form.oninput=counts;
 form.onsubmit=e=>{
  e.preventDefault();
  const cost=Object.fromEntries([...form.querySelectorAll('[data-cost]')].map(i=>[i.dataset.cost,Number(i.value)]));
  call({budget:Number(form.elements.budget.value),window_seconds:Number(form.elements.window_minutes.value)*60,cost})
   .then(s=>{show(s);say('保存しました');}).catch(e=>say(e.message,true));
 };
 document.getElementById('rate-reset').onclick=()=>call({reset:true}).then(s=>{show(s);say('既定値に戻しました');}).catch(e=>say(e.message,true));
 call().then(show).catch(e=>say(e.message,true));
})();
