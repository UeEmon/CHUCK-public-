'use strict';
// Two saved single-link results side by side: B − A for each common frequency and UTC hour, plus the conditions that differ.
// Everything is read from saved results; no engine runs.
let compareRows=[],comparePair=null;
const compareCache=new Map();
const compareKnown=v=>v!==null&&v!==undefined&&Number.isFinite(Number(v));
function compareOption(r){
 const p=r.parameters,names=r.tx_name&&r.rx_name?` · ${r.tx_name} → ${r.rx_name}`:'';
 return new Option(`#${r.id} · ${p.year}/${p.month}${names} · ${p.power_w} W · ${new Date(r.created).toLocaleString(document.documentElement.lang)}`,String(r.id));
}
function updateCompareChoices(rows){
 // Called by the history list; keeps the chosen pair when both are still listed, else the latest two.
 compareRows=rows.filter(r=>r.kind==='point');
 const a=$('compare-a'),b=$('compare-b'),old=[a.value,b.value];
 for(const select of [a,b])select.replaceChildren(new Option('選択してください',''),...compareRows.map(compareOption));
 const listed=v=>compareRows.some(r=>String(r.id)===v);
 a.value=listed(old[0])?old[0]:String(compareRows[1]?.id??'');b.value=listed(old[1])?old[1]:String(compareRows[0]?.id??'');
 $('compare-panel').hidden=compareRows.length<2;
 if(a.value&&b.value&&(!comparePair||String(comparePair.a.id)!==a.value||String(comparePair.b.id)!==b.value))runCompare();
}
async function compareResult(id){if(!compareCache.has(id))compareCache.set(id,api('/api/results/'+id).catch(e=>{compareCache.delete(id);throw e;}));return compareCache.get(id);}
async function runCompare(){
 const a=$('compare-a').value,b=$('compare-b').value;
 if(!a||!b||a===b){comparePair=null;$('compare-csv').disabled=true;$('compare-caption').textContent=a&&a===b?'別の結果を選んでください。':'';$('compare-summary').textContent='';$('compare-conditions').replaceChildren();$('compare-heatmap').classList.add('empty');$('compare-heatmap').textContent='2件を選ぶと差を表示します';return;}
 try{const [ra,rb]=await Promise.all([compareResult(a),compareResult(b)]);if($('compare-a').value!==a||$('compare-b').value!==b)return;comparePair={a:ra,b:rb};renderCompare();}
 catch(e){notice(e.message,true);}
}
function compareIndex(r){const m=new Map();for(const h of r.hours)for(const v of h.rows)m.set(h.hour_utc+'|'+v.frequency_mhz,v);return m;}
function compareBest(r,hour){
 // Same rule as the recommended frequency: highest REL, then highest SNR.
 let best=null;for(const v of r.hours.find(h=>h.hour_utc===hour)?.rows??[]){if(!compareKnown(v.reliability))continue;if(!best||v.reliability>best.reliability||(v.reliability===best.reliability&&(v.snr_db_hz??-Infinity)>(best.snr_db_hz??-Infinity)))best=v;}return best;
}
function compareConditions(a,b){
 const pa=a.parameters,pb=b.parameters;
 const place=(r,p,end)=>{const name=end==='tx'?r.ui_selection?.tx?.location?.name:r.ui_selection?.rxs?.[0]?.location?.name;return name??`${p[end+'_lat']}, ${p[end+'_lon']}`;};
 const antenna=(u,p,end)=>(end==='tx'?u?.tx?.antenna?.name:u?.rxs?.[0]?.antenna?.name)??p[end+'_antenna'];
 const items=[
  ['年月',p=>`${p.year}/${p.month}`],['SSN',p=>`${p.ssn} (${p.ssn_source??'manual'})`],['送信電力 W',p=>p.power_w],
  ['TX地点',(p,r)=>place(r,p,'tx'),true],['RX地点',(p,r)=>place(r,p,'rx'),true],
  ['TXアンテナ',(p,r)=>antenna(r.ui_selection,p,'tx'),true],['RXアンテナ',(p,r)=>antenna(r.ui_selection,p,'rx'),true],
  ['TX利得補正 dB',p=>p.tx_gain],['RX利得補正 dB',p=>p.rx_gain],['雑音 −dBW @3 MHz',p=>p.noise],['要求SNR dB·Hz',p=>p.required_snr],['目標REL %',p=>p.reliability],
  ['最低打上げ角 °',p=>p.min_angle],['吸収モード',p=>absorptionLabel(p)],['計算方式',p=>methodLabels[p.method??30]??p.method],['仮定する追加偏波損失 dB',p=>p.polarization_loss_db??0],
  ['周波数 MHz',p=>p.frequencies.map(f=>f.toFixed(3)).join(', ')]
 ];
 return items.map(([label,get,user])=>({label,a:String(get(pa,a)),b:String(get(pb,b)),user})).filter(v=>v.a!==v.b);
}
function compareFill(d,scale){
 // Diverging: green where B is better, red where B is worse, panel colour near zero.
 if(!compareKnown(d))return relUnknownFill;const t=Math.min(1,Math.abs(d)/scale);return relMix('#16293a',d>0?'#2fd47a':'#ff5c6c',t);
}
function renderCompare(){
 if(!comparePair)return;
 const {a,b}=comparePair,metric=$('compare-metric').value,scale=metric==='reliability'?50:20,target=a.parameters.reliability;
 const fa=a.parameters.frequencies,fb=b.parameters.frequencies,common=fa.filter(f=>fb.includes(f)),only=[...fa.filter(f=>!fb.includes(f)),...fb.filter(f=>!fa.includes(f))];
 const ia=compareIndex(a),ib=compareIndex(b),unit=metric==='reliability'?'%':'dB';
 $('compare-caption').textContent=`A: #${a.id} · ${a.parameters.year}/${a.parameters.month} · ${a.distance_km} km　B: #${b.id} · ${b.parameters.year}/${b.parameters.month} · ${b.distance_km} km`;
 const hoursMet=r=>[...Array(24).keys()].filter(h=>{const v=compareBest(r,h);return v&&v.reliability>=target;}).length;
 const ma=hoursMet(a),mb=hoursMet(b);
 $('compare-summary').textContent=`目標REL ${target}%（Aの値）以上の時間: A ${ma} 時間 → B ${mb} 時間（${mb-ma>=0?'+':''}${mb-ma}）`;
 const diffs=compareConditions(a,b);
 if(!diffs.length)$('compare-conditions').replaceChildren(cell('p','計算条件は同じです。'));
 else{const table=document.createElement('table');table.className='compare-conditions';const head=document.createElement('tr');for(const t of ['違う条件','A','B'])head.append(cell('th',t));table.append(head);
  for(const v of diffs){const tr=document.createElement('tr');tr.append(cell('td',v.label));for(const value of [v.a,v.b])tr.append(v.user?resultSiteName(value,document.createElement('td')):cell('td',value));table.append(tr);}
  $('compare-conditions').replaceChildren(table);}
 if(!common.length){$('compare-heatmap').classList.add('empty');$('compare-heatmap').textContent='共通の周波数がないため比較できません';$('compare-csv').disabled=true;$('compare-only').textContent='';return;}
 const table=document.createElement('table');table.className='heat compare-heat';const head=document.createElement('tr');head.append(cell('th','MHz / UTC'));for(let h=0;h<24;h++)head.append(cell('th',String(h).padStart(2,'0')));table.append(head);
 let better=0,worse=0,gained=0,lost=0;
 for(const f of common){
  const tr=document.createElement('tr');tr.append(cell('th',f.toFixed(3)));
  for(let h=0;h<24;h++){
   const va=ia.get(h+'|'+f),vb=ib.get(h+'|'+f),x=va?.[metric],y=vb?.[metric],d=compareKnown(x)&&compareKnown(y)?y-x:null,td=document.createElement('td');
   const metA=compareKnown(va?.reliability)&&va.reliability>=target,metB=compareKnown(vb?.reliability)&&vb.reliability>=target;
   if(d!==null){if(d>0)better++;else if(d<0)worse++;}
   if(metB&&!metA)gained++;if(metA&&!metB)lost++;
   const text=d===null?'—':(d>0?'+':'')+(metric==='reliability'?Math.round(d):fmt(d));
   const button=cell('button',text);if(metA!==metB)button.append(cell('small',metB?'▲':'▼'));
   button.title=`${h}:00 UTC / ${f} MHz / A ${fmt(x)} → B ${fmt(y)} ${unit}`;
   td.style.background=compareFill(d,scale);td.style.color=d!==null&&Math.abs(d)/scale>.55?'#08131d':'#e6eef5';
   td.append(button);tr.append(td);
  }
  table.append(tr);
 }
 $('compare-heatmap').classList.remove('empty');$('compare-heatmap').replaceChildren(table);
 $('compare-counts').textContent=`Bが高いセル ${better} · Bが低いセル ${worse} · ▲ Bで目標RELに届く ${gained} · ▼ Bで目標RELを下回る ${lost}`;
 $('compare-only').textContent=only.length?`片方だけで計算した周波数は表示しません: ${only.map(f=>f.toFixed(3)).join(', ')} MHz`:'';
 $('compare-csv').disabled=false;
}
$('compare-a').onchange=runCompare;$('compare-b').onchange=runCompare;$('compare-metric').onchange=renderCompare;
$('compare-swap').onclick=()=>{const a=$('compare-a').value;$('compare-a').value=$('compare-b').value;$('compare-b').value=a;runCompare();};
$('compare-csv').onclick=()=>{
 if(!comparePair)return;const {a,b}=comparePair,ia=compareIndex(a),ib=compareIndex(b),common=a.parameters.frequencies.filter(f=>b.parameters.frequencies.includes(f));
 const lines=['hour_utc,frequency_mhz,rel_a,rel_b,rel_diff,snr_a,snr_b,snr_diff'],num=v=>compareKnown(v)?v:'',diff=(x,y)=>compareKnown(x)&&compareKnown(y)?Math.round((y-x)*100)/100:'';
 for(let h=0;h<24;h++)for(const f of common){const va=ia.get(h+'|'+f),vb=ib.get(h+'|'+f);lines.push([h,f,num(va?.reliability),num(vb?.reliability),diff(va?.reliability,vb?.reliability),num(va?.snr_db_hz),num(vb?.snr_db_hz),diff(va?.snr_db_hz,vb?.snr_db_hz)].join(','));}
 const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([lines.join('\r\n')+'\r\n'],{type:'text/csv'}));link.download=`compare-${a.id}-${b.id}.csv`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
};
