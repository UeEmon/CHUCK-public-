'use strict';
// Today's conditions check for a single-link result: marks from the server's /api/results/<id>/today, the monthly REL is unchanged.
let todayCheck=null,todayCheckFor=null;
function todayCheckCurrentMonth(r){const now=new Date();return r&&r.hours&&r.parameters.year===now.getUTCFullYear()&&r.parameters.month===now.getUTCMonth()+1;}
function todayLevel(v){return v===null||v===undefined?'—':String(v);}
function todayReasons(row){
 const out=[];
 if(row.extra_loss_db!==null&&row.extra_loss_db!==undefined)out.push(`推定の追加吸収 ${row.extra_loss_db.toFixed(1)} dB`);
 if(row.status==='blocked')out.push('推定の追加吸収で要求SNRを下回る恐れ');
 if(row.reasons.includes('muf'))out.push('地磁気嵐でMUFが下がる恐れ');
 if(row.reasons.includes('auroral'))out.push('オーロラ帯の吸収・フェージング');
 return out;
}
function todayCheckSummary(t){
 const c=t.conditions,lines=[];
 if(c.scales_stale)lines.push('NOAAのR・S・Gが古いか取得できないため、今日の状況を判定できません');
 else lines.push(`現在 R${todayLevel(c.R)} · S${todayLevel(c.S)} · G${todayLevel(c.G)}（過去24時間の最大 G${todayLevel(c.G24)}）`);
 if(c.absorption_applied)lines.push(`D-RAPの吸収を見積もりに使っています（${(c.drap_observed_at||'').slice(11,16)} UTCの値を3時間）`);
 else if(c.drap_stale)lines.push('D-RAPが古いか取得できないため、吸収は見積もっていません');
 else if(!c.scales_stale)lines.push('R・Sが0のため、D-RAPの吸収は使っていません（通常の昼間の吸収はVOACAPに含まれます）');
 lines.push(`経路の最大地磁気緯度 ${c.path_max_geomagnetic_lat}°`);
 return lines;
}
function renderTodayCheckTable(){
 const box=$('today-table'),t=todayCheck;if(!t||!t.available)return;
 const table=document.createElement('table');table.className='heat today-heat';
 const head=document.createElement('tr');head.append(cell('th','MHz / UTC'));
 for(const h of t.hours)head.append(cell('th',String(h.hour_utc).padStart(2,'0')));table.append(head);
 const g=document.createElement('tr');g.append(cell('th','G（地磁気嵐）'));for(const h of t.hours)g.append(cell('td',todayLevel(h.g_scale)));table.append(g);
 const muf=document.createElement('tr');muf.append(cell('th','MUF MHz（嵐の目安）'));for(const h of t.hours)muf.append(cell('td',fmt(h.muf_adjusted_mhz)));table.append(muf);
 const freqs=t.hours[0]?.rows.map(r=>r.frequency_mhz)??[];
 freqs.forEach((f,i)=>{
  const tr=document.createElement('tr');tr.append(cell('th',f.toFixed(3)));
  for(const h of t.hours){const r=h.rows[i],td=document.createElement('td');td.style.background=relFill(r.reliability);td.style.color=relInk(r.reliability);td.className='today-'+r.status;
   td.textContent=relText(r.reliability,'cell')+(r.status==='blocked'?' ✕':r.status==='warn'?' ⚠':'');
   td.title=[`${h.hour_utc}:00 UTC / ${f} MHz / ${relTitle(r.reliability)}`,...todayReasons(r)].join(' / ');tr.append(td);}
  table.append(tr);
 });
 box.classList.remove('empty');box.replaceChildren(table);
}
function renderTodayCheckResult(){
 const t=todayCheck,status=$('today-status');
 if(!t.available){status.textContent=t.reason;$('today-best').textContent='';$('today-table').replaceChildren();$('today-table').classList.add('empty');return;}
 status.replaceChildren(...todayCheckSummary(t).map(line=>cell('span',line)));
 const now=t.hours[0];$('today-best').textContent=now?`今日の状況での推奨（${String(now.hour_utc).padStart(2,'0')}:00 UTC）: `+(now.best_mhz?now.best_mhz+' MHz'+(now.best_status==='warn'?' ⚠':''):'基準未達'):'';
 renderTodayCheckTable();
}
async function runTodayCheck(){
 if(!result?.id)return;const id=result.id;$('today-status').textContent='今日の状況を取得しています…';
 try{const t=await api(`/api/results/${id}/today`);if(result?.id!==id)return;todayCheck=t;todayCheckFor=id;renderTodayCheckResult();}
 catch(e){$('today-status').textContent=e.message;}
}
function renderTodayCheck(){
 // Called from renderResult(); checks automatically when the result is for the current month.
 const button=$('today-run');if(!button)return;
 button.disabled=!result?.id;
 if(todayCheckFor===result?.id&&todayCheck){renderTodayCheckResult();return;}
 todayCheck=null;todayCheckFor=null;$('today-best').textContent='';$('today-table').replaceChildren(cell('span','計算後に今日の状況での確認を表示します'));$('today-table').classList.add('empty');
 if(todayCheckCurrentMonth(result))runTodayCheck();else $('today-status').textContent=result?'今日の状況での確認は、対象年月が今月の結果だけに使えます。':'';
}
$('today-run')?.addEventListener('click',runTodayCheck);
