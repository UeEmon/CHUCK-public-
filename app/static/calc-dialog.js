'use strict';
// Modal dialog for long calculations: shows the server's progress for the request's job token and can cancel it.
// The modal blocks the page and setBusy disables the tab's controls until the request ends.
async function postWithDialog(title,url,body){
 const dialog=$('calc-dialog'),job=Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join(''),started=Date.now();
 $('calc-title').textContent=title;$('calc-status').textContent='計算の準備をしています…';$('calc-progress').removeAttribute('value');$('calc-elapsed').textContent='経過 0秒';
 $('calc-cancel').disabled=false;$('calc-cancel').onclick=async()=>{$('calc-cancel').disabled=true;$('calc-status').textContent='計算を中止しています…';try{await post(`/api/jobs/${job}/cancel`,{});}catch{}};
 dialog.showModal();
 let polling=true;
 const poll=async()=>{
  while(polling){
   $('calc-elapsed').textContent=`経過 ${Math.round((Date.now()-started)/1000)}秒`;
   try{const s=await api(`/api/jobs/${job}`);if(!polling)break;
    if(s.cancelling)$('calc-status').textContent='計算を中止しています…';
    else{$('calc-progress').max=s.total;$('calc-progress').value=s.done;$('calc-status').textContent=`${s.done} / ${s.total} 件の計算が完了`;}}catch{}
   await new Promise(resolve=>setTimeout(resolve,700));
  }
 };
 poll();
 try{return await post(url,{...body,job});}
 finally{polling=false;dialog.close();}
}
// Only the cancel button ends the dialog; Esc must not hide a running calculation.
$('calc-dialog').addEventListener('cancel',e=>e.preventDefault());
