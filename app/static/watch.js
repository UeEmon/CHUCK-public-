'use strict';
// Saved single-link conditions that the server recalculates on a schedule with the latest NOAA smoothed SSN.
let watchData=null;
const watchStatus={pending:'未確認',same:'変化なし',better:'増加',worse:'減少',error:'取得失敗'};
async function refreshWatches(){
 // The public edition keeps this feature for administrators, so a refusal only hides it.
 try{const r=await fetch('/api/watches');if(!r.ok)throw Error();watchData=await r.json();}catch{watchData=null;}
 renderWatches();
}
async function editWatch(body){
 try{watchData=await post('/api/watches',body);renderWatches();return true;}catch(e){notice(e.message,true);return false;}
}
function watchButton(r){
 if(!watchData)return null;const button=cell('button','定時の再計算に追加');
 if(watchData.watches.some(w=>w.result_id===r.id)){button.textContent='登録済み';button.disabled=true;}
 button.onclick=async()=>{if(busy)return;button.disabled=true;if(await editWatch({action:'add',result_id:r.id})){button.textContent='登録済み';notice('定時の再計算に登録しました。');}else button.disabled=false;};
 return button;
}
function renderWatches(){
 const panel=$('watch-panel'),alert=$('watch-alert');panel.hidden=!watchData;
 if(!watchData){alert.hidden=true;return;}
 const hours=watchData.interval_hours;
 $('watch-interval').textContent=hours>0?`${hours}時間ごとに、登録した条件をNOAAの最新の平滑SSNで再計算します（最大${watchData.max}件）。`:'定時の再計算は停止しています（HF_WATCH_INTERVAL_HOURS=0）。「今すぐ再計算」で手動実行できます。';
 $('watch-note').textContent=watchData.note;
 const notify=watchData.watches.filter(w=>w.notify);
 alert.hidden=!notify.length;$('watch-alert-text').textContent=`定時の再計算で、目標REL以上の時間数が減った条件が${notify.length}件あります。`;
 if(!watchData.watches.length){$('watch-list').replaceChildren(cell('p','登録された条件はありません。'));return;}
 const table=document.createElement('table');table.className='watch-table';const head=document.createElement('tr');
 for(const t of ['経路','年月','最終確認','SSN','目標REL以上（基準 → 最新）','状態',''])head.append(cell('th',t));table.append(head);
 for(const w of watchData.watches){
  const tr=document.createElement('tr'),p=w.parameters,latest=w.latest,route=cell('td',w.label);route.dataset.userContent='true';
  const last=latest??w.last_error;
  tr.append(route,cell('td',`${p.year}/${p.month}`),cell('td',last?new Date(last.checked).toLocaleString(document.documentElement.lang):'—'),cell('td',latest&&!latest.error?String(latest.ssn):'—'),
   cell('td',w.baseline?`${w.baseline.hours_meeting} → ${latest&&!latest.error?latest.hours_meeting:'—'} 時間`:'—'));
  const state=cell('td',watchStatus[w.status]);state.className='watch-'+w.status;if(last?.error)state.title=last.error;tr.append(state);
  const actions=document.createElement('td'),run=cell('button','今すぐ再計算'),remove=cell('button','削除');
  run.onclick=async()=>{if(busy)return;run.disabled=true;notice('再計算しています…');if(await editWatch({action:'run',id:w.id}))notice('再計算しました。');};
  remove.onclick=()=>editWatch({action:'delete',id:w.id});
  if(w.notify){const ack=cell('button','確認済みにする');ack.onclick=()=>editWatch({action:'acknowledge',id:w.id});actions.append(ack);}
  actions.append(run,remove);tr.append(actions);tr.classList.toggle('watch-notify',w.notify);table.append(tr);
 }
 $('watch-list').replaceChildren(table);
}
$('watch-refresh').onclick=refreshWatches;
$('watch-alert-open').onclick=()=>tab('history');
refreshWatches();setInterval(refreshWatches,10*60*1000);
