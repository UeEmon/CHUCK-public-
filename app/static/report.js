'use strict';
// One printable briefing page of a single-link result: conditions, hourly recommendation, heatmap and frequency plan.
function reportText(s){return window.HF_I18N?HF_I18N.translate(s):s;}
function reportEndpoint(selection,key){
 // Saved circuits keep the preset; default names follow the UI language, user names stay as entered.
 const e=key==='tx'?selection?.tx:selection?.rxs?.[0],l=e?.location,a=e?.antenna;
 return {name:l?(isOriginalPreset(l)?reportText(l.name):l.name):null,antenna:a?(isOriginalPreset(a)?reportText(a.name):a.name)+' ('+antennaSummary(a)+')':null,noise:e?.noise};
}
function reportTable(d,rows){
 const table=d.createElement('table');table.className='conditions';
 for(const [k,v] of rows){const tr=d.createElement('tr'),th=d.createElement('th'),td=d.createElement('td');th.textContent=reportText(k);td.textContent=v;tr.append(th,td);table.append(tr);}
 return table;
}
function reportPlain(d,source){
 // Cell buttons become their contents so the copy prints like a table, keeping its colours and second lines.
 const table=d.importNode(source,true);for(const b of table.querySelectorAll('button'))b.replaceWith(...b.childNodes);return table;
}
const reportCss='@page{size:A4 landscape;margin:10mm}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}body{font:11px/1.5 "Hiragino Sans","Hiragino Kaku Gothic ProN","Meiryo","Yu Gothic","Noto Sans JP",sans-serif;color:#000;margin:16px}h1{font-size:17px;margin:0 0 4px}h2{font-size:13px;margin:14px 0 6px;border-bottom:1px solid #999}h3{font-size:12px;margin:10px 0 4px}table{border-collapse:collapse;font:inherit}th,td{border:1px solid #999;padding:2px 5px;text-align:left}.conditions th{background:#eee;white-space:nowrap}.conditions td{min-width:420px}.heat td,.heat th,.hourly td,.hourly th{text-align:center;padding:2px 3px;font-size:10px}.heat th,.hourly th{background:#eee}.heat small,.heat i{display:block;font-size:8px;font-style:normal;opacity:.85}.meta,.foot{color:#444}.plan-table th{background:#eee}.plan-unmet{color:#a00}.chart{max-width:100%;height:auto;break-inside:avoid}.map{width:100%;height:auto;background:#0a1725}';
function buildReport(d){
 const r=result,p=r.parameters,tx=reportEndpoint(r.ui_selection,'tx'),rx=reportEndpoint(r.ui_selection,'rx'),sec=(title)=>{const h=d.createElement('h2');h.textContent=reportText(title);d.body.append(h);};
 d.documentElement.lang=document.documentElement.lang;d.title=reportText('伝搬予測報告書');
 const style=d.createElement('style');
 style.textContent=reportCss;
 d.head.append(style);
 const title=d.createElement('h1');title.textContent=d.title;d.body.append(title);
 const meta=d.createElement('p');meta.className='meta';meta.textContent=`${reportText('作成')} ${new Date().toISOString().slice(0,16).replace('T',' ')} UTC · ${reportText('計算')} ${String(r.created??'').slice(0,16).replace('T',' ')} UTC · ID ${r.id??'—'}`;d.body.append(meta);
 sec('条件');
 const ssn=`${p.ssn}（${r.space_weather?'NOAA '+noaaSSNText(r.space_weather.ssn):reportText(r.effective_ssn?effectiveCaption():'手動入力')}）`;
 d.body.append(reportTable(d,[
  ['経路',`${tx.name??'TX'} → ${rx.name??'RX'}`],
  ['座標',`TX ${p.tx_lat.toFixed(2)}, ${p.tx_lon.toFixed(2)} / RX ${p.rx_lat.toFixed(2)}, ${p.rx_lon.toFixed(2)}`],
  ['回線距離・方位',`${r.distance_km} km / ${r.bearing_deg} °`],
  ['対象年月',`${p.year}/${p.month}`],['SSN',ssn],['送信電力',`${p.power_w} W`],
  ['周波数',p.frequencies.map(f=>f.toFixed(3)).join(', ')+' MHz'],
  ['TXアンテナ',tx.antenna??`${p.tx_antenna} / ${p.tx_gain} dB`],['RXアンテナ',rx.antenna??`${p.rx_antenna} / ${p.rx_gain} dB`],
  ['雑音',`−${p.noise} dBW`],['要求SNR・目標REL',`${p.required_snr} dB·Hz / ${p.reliability}%`],['吸収モード',absorptionLabel(p)],
  ['電波型式・偏波',reportText(radioCaption(p).slice(3))],
 ]));
 sec('時刻別の推奨周波数');
 const hourly=planHourly(r),table=d.createElement('table');table.className='hourly';
 for(const [label,value] of [['UTC',h=>String(h.hour).padStart(2,'0')],['MHz',h=>h.meets?h.row.frequency_mhz.toFixed(1):'—'],['REL %',h=>h.row.reliability===null||h.row.reliability===undefined?'—':String(Math.round(h.row.reliability))],['SNR',h=>fmt(h.row.snr_db_hz,0)]]){
  const tr=d.createElement('tr'),th=d.createElement('th');th.textContent=label;tr.append(th);
  for(const h of hourly){const td=d.createElement('td');td.textContent=value(h);if(!h.meets)td.style.color='#a00';tr.append(td);}
  table.append(tr);
 }
 d.body.append(table);
 const unmet=hourly.filter(h=>!h.meets).length,hint=d.createElement('p');hint.className='foot';
 hint.textContent=reportText(unmet?`目標RELに届く周波数がない時間は「—」とし、最もRELの高い周波数の値を赤で示します（${unmet}時間）。`:'すべての時間で目標RELに届く周波数があります。');d.body.append(hint);
 sec('信頼度ヒートマップ（REL %）');
 const heat=$('heatmap').querySelector('table');if(heat)d.body.append(reportPlain(d,heat));
 const plan=$('plan-table').querySelector('table');
 if(plan){sec('運用周波数の24時間計画');for(const id of ['plan-caption','plan-summary']){const e=d.createElement('p');e.textContent=$(id).textContent;d.body.append(e);}d.body.append(reportPlain(d,plan));}
 const foot=d.createElement('p');foot.className='foot';foot.textContent=`${reportText('予測は月間統計です。瞬時の電離圏変動・磁気嵐・実機アンテナ設置条件を完全には反映しません。')} Engine: ${r.engine} (${r.engine_commit}) · CHUCK`;d.body.append(foot);
}
function openReportWindow(build){
 const w=window.open('','_blank');if(!w){notice('印刷用のウィンドウを開けませんでした。ポップアップの許可を確認してください。',true);return;}
 build(w.document);w.focus();w.print();
}
$('report-print').onclick=()=>{if(result)openReportWindow(buildReport);};
// The other result tabs print what the tab shows, already in the UI language: conditions, then each panel's captions, tables and charts.
const reportTabs={coverage:()=>coverageResult,'propagation-chart':()=>chartRun(),diversity:()=>diversityResult,mesh:()=>meshResult,annual:()=>annualResult,power:()=>powerResult,sites:()=>sitesResult};
function reportButton(id){const b=cell('button','報告書を印刷');b.type='button';b.className='report-tab-print';b.onclick=()=>printTabReport(id);return b;}
function reportStamp(v){return v?String(v).slice(0,16).replace('T',' ')+' UTC':'—';}
function reportConditions(d,id,r){
 const p=r.parameters,rows=[];
 if(id==='mesh')rows.push(['拠点',r.sites.map(s=>resultSiteText(s.name)).join(' · ')]);
 else if(id==='diversity')rows.push(['経路',`${reportEndpoint(r.ui_selection,'tx').name??'TX'} → ${r.sites.map(s=>resultSiteText(s.name)).join(' · ')}`]);
 else if(p.tx_lat!==undefined)rows.push(['経路',`${reportEndpoint(r.ui_selection,'tx').name??'TX'} → ${r.chart_site!=null?resultSiteText(r.chart_site):reportEndpoint(r.ui_selection,'rx').name??'RX'}`]);
 if(r.distance_km!==undefined)rows.push(['回線距離・方位',`${r.distance_km} km`+(r.bearing_deg!==undefined?` / ${r.bearing_deg} °`:'')]);
 rows.push(['対象年月',`${p.year}/${p.month}`]);
 if(id!=='annual')rows.push(['SSN',String(p.ssn)]);
 if(p.power_w!==undefined&&id!=='mesh')rows.push(['送信電力',`${p.power_w} W`]);
 rows.push(['周波数',id==='coverage'&&r.matrix?`${r.matrix.frequencies[Math.min(matrixFrequency,r.matrix.frequencies.length-1)]} MHz / ${$('cov_hour').value}:00 UTC`:id==='coverage'?`${r.frequency_mhz} MHz / ${r.hour_utc}:00 UTC`:p.frequencies.map(f=>f.toFixed(3)).join(', ')+' MHz']);
 if(p.required_snr!==undefined)rows.push(['要求SNR・目標REL',`${p.required_snr} dB·Hz / ${p.reliability}%`]);
 if(p.absorption_mode)rows.push(['吸収モード',reportText(absorptionLabel(p))]);
 if(p.modulation)rows.push(['電波型式・偏波',reportText(radioCaption(p).slice(3))]);
 return reportTable(d,rows);
}
function reportControls(panel){
 // The view choices beside a panel title (UTC, frequency, metric), so the copy says which slice it shows.
 const parts=[];
 for(const label of panel.querySelectorAll('.panel-title label')){
  const control=label.querySelector('output,select');if(!control)continue;
  const name=[...label.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.data.trim()).join(' ').trim();
  const value=control.tagName==='SELECT'?control.selectedOptions[0]?.text??'':control.textContent;
  // An output already names its unit ("03:00 UTC"), so its label is left out.
  parts.push(name&&control.tagName!=='OUTPUT'?name+' '+value:value);
 }
 return parts.join(' · ');
}
function reportPanel(d,panel){
 const h3=panel.querySelector('h3');if(!h3)return;
 const h=d.createElement('h2'),extra=panel.querySelector('.panel-title > span.muted');h.textContent=h3.textContent+(extra?.textContent?' · '+extra.textContent:'');d.body.append(h);
 const controls=reportControls(panel);if(controls){const p=d.createElement('p');p.className='meta';p.textContent=controls;d.body.append(p);}
 for(const e of panel.children){
  if(e.hidden||e.dataset.report==='skip'||e.matches('.panel-title,h3,.exports,form,details,label,button,.coverage-form,.legend'))continue;
  const table=e.matches('table')?e:e.querySelector('table'),chart=e.querySelector('svg');
  if(table){d.body.append(reportPlain(d,table));continue;}
  if(chart){const c=d.importNode(chart,true);c.removeAttribute('id');c.classList.add('chart');for(const n of c.querySelectorAll('[tabindex]')){n.removeAttribute('tabindex');n.removeAttribute('role');}d.body.append(c);continue;}
  const text=e.textContent.trim();if(!text)continue;
  const p=d.createElement(e.tagName==='H4'?'h3':'p');if(e.classList.contains('hint'))p.className='foot';p.textContent=text;d.body.append(p);
 }
}
function buildTabReport(d,id,r){
 const label=document.querySelector(`nav.tabs [data-tab="${id}"]`).textContent;
 d.documentElement.lang=document.documentElement.lang;d.title=`${reportText('伝搬予測報告書')} · ${label}`;
 const style=d.createElement('style');style.textContent=reportCss;d.head.append(style);
 const title=d.createElement('h1');title.textContent=d.title;d.body.append(title);
 const meta=d.createElement('p');meta.className='meta';meta.textContent=`${reportText('作成')} ${reportStamp(new Date().toISOString())} · ${reportText('計算')} ${reportStamp(r.created)} · ID ${r.id??'—'}`;d.body.append(meta);
 const h=d.createElement('h2');h.textContent=reportText('条件');d.body.append(h);d.body.append(reportConditions(d,id,r));
 for(const panel of $(id).querySelectorAll('.panel'))if(panel.dataset.report!=='skip')reportPanel(d,panel);
 if(id==='coverage'){
  // The coverage points are drawn on the map, so the map is the result.
  const h=d.createElement('h2');h.textContent=document.querySelector('.map-panel h3').textContent;d.body.append(h);
  const map=d.importNode($('map'),true);map.removeAttribute('id');map.classList.add('map');d.body.append(map);
 }
 const foot=d.createElement('p');foot.className='foot';foot.textContent=reportText('予測は月間統計です。瞬時の電離圏変動・磁気嵐・実機アンテナ設置条件を完全には反映しません。')+(r.engine?` Engine: ${r.engine} (${r.engine_commit}) · CHUCK`:' CHUCK');d.body.append(foot);
}
function printTabReport(id){
 const r=reportTabs[id]();if(!r)return;
 // A diversity site run of the chart carries no id or time of its own.
 const v=diversityResult,run=id==='propagation-chart'&&$('chart-result').value==='diversity'?{...r,id:v.id,created:v.created,ui_selection:v.ui_selection,engine:v.engine,engine_commit:v.engine_commit,chart_site:r.name}:r;
 openReportWindow(d=>buildTabReport(d,id,run));
}
$('chart-print').onclick=()=>printTabReport('propagation-chart');
