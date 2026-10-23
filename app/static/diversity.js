'use strict';
let diversityResult=null;
for(let hour=0;hour<24;hour++)$('diversity-hour').add(new Option(String(hour).padStart(2,'0')+':00',hour));
$('diversity-hour').value=new Date().getUTCHours();
function diversityTable(headers,rows){const table=document.createElement('table'),head=document.createElement('tr');headers.forEach(t=>head.append(cell('th',t)));table.append(head);for(const values of rows){const tr=document.createElement('tr');values.forEach(v=>tr.append(cell('td',v)));table.append(tr);}return table;}
function showDiversity(){
 const r=diversityResult;if(!r)return;
 const p=r.parameters;
 $('diversity-caption').textContent=`${p.year}/${p.month} · SSN ${p.ssn} (${p.ssn_source}) · ${p.power_w} W · 要求SNR ${p.required_snr} dB·Hz · 目標REL ${p.reliability}% · RX ${r.sites.length} · 表示は計算時点の条件です。`;
 $('diversity-caption').textContent+=radioCaption(p,true);$('diversity-note').textContent=r.note;
 $('diversity-exports').replaceChildren();for(const type of ['csv','json']){const a=cell('a',type.toUpperCase()+'出力');a.href=`/api/results/${r.id}/${type}`;a.download='';$('diversity-exports').append(a);}$('diversity-exports').hidden=false;
 const table=document.createElement('table');table.className='heat';const head=document.createElement('tr');head.append(cell('th','MHz / UTC'));for(let h=0;h<24;h++)head.append(cell('th',String(h).padStart(2,'0')));table.append(head);
 for(const frequency of p.frequencies){const tr=document.createElement('tr');tr.append(cell('th',frequency.toFixed(3)));for(const h of r.diversity_hours){const row=h.rows.find(v=>v.frequency_mhz===frequency),td=document.createElement('td'),button=cell('button',relText(row.best_rel_percent,'cell'));td.style.background=relFill(row.best_rel_percent);td.style.color=relInk(row.best_rel_percent);button.title=`${h.hour_utc}:00 UTC / ${frequency} MHz / ${r.sites.find(s=>s.id===row.best_site_id)?.name??'欠測'} / ${relTitle(row.best_rel_percent)}`;button.onclick=()=>{$('diversity-hour').value=h.hour_utc;renderDiversityDetail();};td.append(button);tr.append(td);}table.append(tr);}$('diversity-heatmap').replaceChildren(table);
 renderDiversityDetail();updatePropagationChart('diversity');drawMap();
}
function renderDiversityDetail(){
 const r=diversityResult;if(!r)return;const hour=Number($('diversity-hour').value),h=r.diversity_hours.find(h=>h.hour_utc===hour),independent=r.independence_assumption;
 const headers=['MHz','REL最大サイト',relHeader('最良REL'),'少なくとも1サイト受信 · 理論範囲 %','目標REL以上のサイト数'];if(independent)headers.push('独立仮定の参考値 %');
 const rows=h.rows.map(v=>{const row=[v.frequency_mhz.toFixed(3),r.sites.find(s=>s.id===v.best_site_id)?.name??'欠測',relText(v.best_rel_percent),v.complete?`${fmt(v.union_lower_percent)}〜${fmt(v.union_upper_percent)}`:`下限 ${fmt(v.union_lower_percent)} / 上限不明（欠測あり）`,`${v.sites_meeting_target} / ${r.sites.length}`];if(independent)row.push(fmt(v.independent_scenario_percent));return row;});
 $('diversity-summary').replaceChildren(diversityTable(headers,rows));const detail=[];
 for(const site of r.sites){const p=site.parameters;for(const v of site.hours.find(h=>h.hour_utc===hour).rows)detail.push([site.name,v.frequency_mhz.toFixed(3),relText(v.reliability),fmt(v.snr_db_hz),fmt(v.signal_dbw),site.distance_km,p.rx_antenna,p.rx_gain,p.noise,polarizationLabels[p.rx_polarization]??polarizationLabels.model]);}
 $('diversity-detail').replaceChildren(diversityTable(['サイト','MHz',relHeader('REL'),'SNR dB·Hz','信号 dBW','経路 km','アンテナ','利得 dBi','雑音 −dBW @3 MHz','偏波方式'],detail));
}
$('diversity-hour').onchange=()=>{renderDiversityDetail();drawMap();};
function openDiversity(r){diversityResult=r;coverageResult=null;tab('diversity');showDiversity();}
