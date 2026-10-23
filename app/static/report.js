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
 // Cell buttons become text so the copy prints like a table, keeping its colours.
 const table=d.importNode(source,true);for(const b of table.querySelectorAll('button'))b.replaceWith(d.createTextNode(b.textContent));return table;
}
function buildReport(d){
 const r=result,p=r.parameters,tx=reportEndpoint(r.ui_selection,'tx'),rx=reportEndpoint(r.ui_selection,'rx'),sec=(title)=>{const h=d.createElement('h2');h.textContent=reportText(title);d.body.append(h);};
 d.documentElement.lang=document.documentElement.lang;d.title=reportText('伝搬予測報告書');
 const style=d.createElement('style');
 style.textContent='@page{size:A4 landscape;margin:10mm}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}body{font:11px/1.5 system-ui,sans-serif;color:#000;margin:16px}h1{font-size:17px;margin:0 0 4px}h2{font-size:13px;margin:14px 0 6px;border-bottom:1px solid #999}table{border-collapse:collapse;font:inherit}th,td{border:1px solid #999;padding:2px 5px;text-align:left}.conditions th{background:#eee;white-space:nowrap}.conditions td{min-width:420px}.heat td,.heat th,.hourly td,.hourly th{text-align:center;padding:2px 3px;font-size:10px}.heat th,.hourly th{background:#eee}.meta,.foot{color:#444}.plan-table th{background:#eee}.plan-unmet{color:#a00}';
 d.head.append(style);
 const title=d.createElement('h1');title.textContent=d.title;d.body.append(title);
 const meta=d.createElement('p');meta.className='meta';meta.textContent=`${reportText('作成')} ${new Date().toISOString().slice(0,16).replace('T',' ')} UTC · ${reportText('計算')} ${String(r.created??'').slice(0,16).replace('T',' ')} UTC · ID ${r.id??'—'}`;d.body.append(meta);
 sec('条件');
 const ssn=`${p.ssn}（${r.space_weather?'NOAA '+r.space_weather.ssn.kind:reportText(r.effective_ssn?effectiveCaption():'手動入力')}）`;
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
$('report-print').onclick=()=>{
 if(!result)return;
 const w=window.open('','_blank');if(!w){notice('印刷用のウィンドウを開けませんでした。ポップアップの許可を確認してください。',true);return;}
 buildReport(w.document);w.focus();w.print();
};
