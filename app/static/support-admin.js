'use strict';
// Admin page for the donation ledger and antenna documents (admin site only).
(function(){
 const status=document.getElementById('status');
 const say=(text,error)=>{status.textContent=text;status.style.color=error?'#f18c8c':'';};
 const LABELS={pending:'未処理',registered:'登録済み',declined:'見送り'};
 async function call(url,body){
  const r=await fetch(url,body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{});
  const v=await r.json().catch(()=>({}));if(!r.ok)throw Error(v.error||'失敗しました');return v;
 }
 function cell(row,value,user){const td=document.createElement('td');if(user)td.dataset.userContent='';td.style.textAlign='left';if(value instanceof Node)td.append(value);else td.textContent=value??'';row.append(td);return td;}
 function table(target,headers,rows,build){
  const t=document.createElement('table'),head=t.insertRow();
  for(const h of headers){const th=document.createElement('th');th.textContent=h;th.style.textAlign='left';head.append(th);}
  for(const r of rows)build(t.insertRow(),r);
  target.replaceChildren(rows.length?t:Object.assign(document.createElement('p'),{className:'muted',textContent:'まだありません'}));
 }
 // Times stay in JST in a format every language reads the same way.
 const when=iso=>new Date(iso).toLocaleString('sv-SE',{timeZone:'Asia/Tokyo'}).slice(0,16)+' JST';
 const usd=v=>'$'+v.toFixed(2);
 const STATES={active:'継続中',pending_cancellation:'解約予定',cancelled:'解約済み',one_time:'1回のみ'};
 async function load(){
  const [ledger,catalogs]=await Promise.all([call('/api/admin/donations'),call('/api/admin/catalog-requests')]);
  document.getElementById('ledger-title').textContent=`スポンサー（${ledger.month}の見込み：毎月 ${usd(ledger.monthly_usd)}＋1回のみ ${usd(ledger.one_time_usd)}、手数料なし・入金はGitHubの明細で確認）`;
  table(document.getElementById('donations'),['開始日時','GitHub','金額','種類','状態','公開','一覧',''],ledger.sponsorships,(tr,s)=>{
   cell(tr,when(s.created));cell(tr,s.login,true);cell(tr,usd(s.usd));cell(tr,s.one_time?'1回のみ':'毎月');cell(tr,STATES[s.state]||s.state);cell(tr,s.privacy==='public'?'公開':'非公開');
   cell(tr,s.privacy!=='public'?'—':s.hidden?'非表示':'表示中');
   const b=document.createElement('button');b.type='button';b.textContent=s.hidden?'表示する':'非表示にする';b.disabled=s.privacy!=='public';
   b.onclick=()=>call('/api/admin/supporters/'+encodeURIComponent(s.login),{hidden:!s.hidden}).then(load).catch(e=>say(e.message,true));cell(tr,b);
  });
  table(document.getElementById('events'),['受信日時','操作','GitHub','金額','種類'],ledger.events,(tr,e)=>{cell(tr,when(e.received));cell(tr,e.action);cell(tr,e.login,true);cell(tr,usd(e.usd));cell(tr,e.one_time?'1回のみ':'毎月');});
  table(document.getElementById('catalogs'),['受付日時','GitHub','スポンサー','メモ','連絡先','資料','状態','プリセットID','管理メモ',''],catalogs,(tr,c)=>{
   cell(tr,when(c.created));cell(tr,c.login,true);cell(tr,STATES[c.sponsor_state]||'記録なし');cell(tr,c.note,true);cell(tr,c.contact,true);
   const a=document.createElement('a');a.href=`/api/admin/catalog-requests/${c.id}/file`;a.textContent=`${c.filename}（${Math.ceil(c.size/1024)}KB）`;cell(tr,a,true);
   const select=document.createElement('select');for(const [v,l]of Object.entries(LABELS))select.add(new Option(l,v,false,v===c.status));cell(tr,select);
   const preset=Object.assign(document.createElement('input'),{value:c.antenna_preset_id,maxLength:120});cell(tr,preset);
   const note=Object.assign(document.createElement('input'),{value:c.admin_note,maxLength:1000});cell(tr,note);
   const save=document.createElement('button');save.type='button';save.textContent='保存';
   save.onclick=()=>call('/api/admin/catalog-requests/'+c.id,{status:select.value,antenna_preset_id:preset.value,admin_note:note.value}).then(()=>{say('保存しました');return load();}).catch(e=>say(e.message,true));
   cell(tr,save);
  });
 }
 load().catch(e=>say(e.message,true));
})();
