'use strict';
let diversityResult=null,diversityFrequency=null;
for(let hour=0;hour<24;hour++)$('diversity-hour').add(new Option(String(hour).padStart(2,'0')+':00',hour));
$('diversity-hour').value=new Date().getUTCHours();
const siteCell=s=>s?resultSiteName(s.name,document.createElement('td')):cell('td','欠測');
function diversityTable(headers,rows){const table=document.createElement('table'),head=document.createElement('tr');headers.forEach(t=>head.append(cell('th',t)));table.append(head);for(const values of rows){const tr=document.createElement('tr');values.forEach(v=>tr.append(v instanceof Node?v:cell('td',v)));table.append(tr);}return table;}
function showDiversity(){
 const r=diversityResult;if(!r)return;
 const p=r.parameters;if(!p.frequencies.includes(diversityFrequency))diversityFrequency=null;
 $('diversity-caption').textContent=`${p.year}/${p.month} · SSN ${p.ssn} (${p.ssn_source}) · ${p.power_w} W · 要求SNR ${p.required_snr} dB·Hz · 目標REL ${p.reliability}% · 吸収モード ${absorptionLabel(p)} · RX ${r.sites.length} · 表示は計算時点の条件です。`;
 $('diversity-caption').textContent+=radioCaption(p,true);$('diversity-note').textContent=r.note;
 $('diversity-exports').replaceChildren();for(const type of ['csv','json']){const a=cell('a',type.toUpperCase()+'出力');a.href=`/api/results/${r.id}/${type}`;a.download='';$('diversity-exports').append(a);}$('diversity-exports').append(reportButton('diversity'));$('diversity-exports').hidden=false;
 const table=document.createElement('table');table.className='heat';const head=document.createElement('tr');head.append(cell('th','MHz / UTC'));for(let h=0;h<24;h++){const th=cell('th',String(h).padStart(2,'0'));th.dataset.hour=h;head.append(th);}table.append(head);
 for(const frequency of p.frequencies){const tr=document.createElement('tr'),label=cell('th',frequency.toFixed(3));label.dataset.frequency=frequency;tr.append(label);for(const h of r.diversity_hours){const row=h.rows.find(v=>v.frequency_mhz===frequency),td=document.createElement('td'),button=cell('button',relText(row.best_rel_percent,'cell'));td.dataset.hour=h.hour_utc;td.dataset.frequency=frequency;td.style.background=relFill(row.best_rel_percent);td.style.color=relInk(row.best_rel_percent);button.title=`${h.hour_utc}:00 UTC / ${frequency} MHz / ${r.sites.find(s=>s.id===row.best_site_id)?.name??'欠測'} / ${relTitle(row.best_rel_percent)}`;button.onclick=()=>{diversityFrequency=diversityFrequency===frequency&&Number($('diversity-hour').value)===h.hour_utc?null:frequency;$('diversity-hour').value=h.hour_utc;renderDiversityDetail();drawMap();};td.append(button);tr.append(td);}table.append(tr);}$('diversity-heatmap').replaceChildren(table);
 renderDiversityDetail();updatePropagationChart('diversity');drawMap();
}
function renderDiversityDetail(){
 const r=diversityResult;if(!r)return;const hour=Number($('diversity-hour').value),h=r.diversity_hours.find(h=>h.hour_utc===hour),independent=r.independence_assumption;
 document.querySelectorAll('#diversity-heatmap th[data-hour]').forEach(e=>e.classList.toggle('selected',+e.dataset.hour===hour));document.querySelectorAll('#diversity-heatmap td').forEach(e=>e.classList.toggle('selected',+e.dataset.hour===hour&&(diversityFrequency===null||+e.dataset.frequency===diversityFrequency)));document.querySelectorAll('#diversity-heatmap th[data-frequency]').forEach(e=>e.classList.toggle('selected',+e.dataset.frequency===diversityFrequency));
 const headers=['MHz','REL最大サイト',relHeader('最良REL'),'少なくとも1サイト受信 · 理論範囲 %','目標REL以上のサイト数'];if(independent)headers.push('独立仮定の参考値 %');
 const rows=h.rows.map(v=>{const row=[v.frequency_mhz.toFixed(3),siteCell(r.sites.find(s=>s.id===v.best_site_id)),relText(v.best_rel_percent),v.complete?`${fmt(v.union_lower_percent)}〜${fmt(v.union_upper_percent)}`:`下限 ${fmt(v.union_lower_percent)} / 上限不明（欠測あり）`,`${v.sites_meeting_target} / ${r.sites.length}`];if(independent)row.push(fmt(v.independent_scenario_percent));return row;});
 const summary=diversityTable(headers,rows);h.rows.forEach((v,i)=>summary.rows[i+1].classList.toggle('selected',v.frequency_mhz===diversityFrequency));$('diversity-summary').replaceChildren(summary);const detail=[];
 for(const site of r.sites){const p=site.parameters;for(const v of site.hours.find(h=>h.hour_utc===hour).rows)detail.push([siteCell(site),v.frequency_mhz.toFixed(3),relText(v.reliability),fmt(v.snr_db_hz),fmt(v.signal_dbw),site.distance_km,p.rx_antenna,p.rx_gain,p.noise,polarizationLabels[p.rx_polarization]??polarizationLabels.model]);}
 $('diversity-detail').replaceChildren(diversityTable(['サイト','MHz',relHeader('REL'),'SNR dB·Hz','信号 dBW','経路 km','アンテナ','利得 dBi','雑音 −dBW @3 MHz','偏波方式'],detail));
}
$('diversity-hour').onchange=()=>{renderDiversityDetail();drawMap();};
function openDiversity(r){diversityResult=r;coverageResult=null;tab('diversity');showDiversity();}
