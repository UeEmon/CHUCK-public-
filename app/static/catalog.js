'use strict';
// Optional antenna documents from GitHub Sponsors donors, matched by GitHub login on the admin page.
(function(){
 const form=document.getElementById('catalog-form'),status=document.getElementById('status');
 const say=(text,error)=>{status.textContent=text;status.style.color=error?'#f18c8c':'';};
 const base64=file=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]||'');reader.onerror=()=>reject(reader.error);reader.readAsDataURL(file);});
 form.addEventListener('submit',async e=>{
  e.preventDefault();const file=form.file.files[0];
  if(!file)return say('ファイルを選んでください',true);
  if(file.size>8*1024*1024)return say('資料は8MBまでのPDFまたは画像を送ってください',true);
  const button=form.querySelector('button');button.disabled=true;say('送信中…');
  try{
   const body={login:form.login.value.trim(),note:form.note.value,contact:form.contact.value,filename:file.name,consent:form.consent.checked,content:await base64(file)};
   const r=await fetch('/api/support/catalog',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
   const v=await r.json().catch(()=>({}));
   if(!r.ok)throw Error(v.error||'送信内容が不正です');
   form.file.value='';form.note.value='';say('資料を受け付けました。内容を確認して登録を検討します。');
  }catch(err){say(err.message,true);}
  finally{button.disabled=false;}
 });
})();
