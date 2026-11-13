'use strict';
// Coverage of several transmitting stations: the TX and up to 3 location presets on one grid. The map paints each grid point
// in the colour of the station that reaches it best, and grey where no station reaches the target REL (a gap).
const STATION_MAX=3,stationChoice=new Set(),stationColors=['#38e1ff','#ffa94d','#c48bff','#7ee081'],stationGap='#8b96a3';
let stationBest=true;
function stationOptions(){
 // Fixed locations other than the TX and RX1 (RX1 gives the receiving antenna and noise, and must stay apart).
 const used=new Set([circuit.tx.location_id,circuit.rxs[0]?.location_id]);
 return allLocations().filter(p=>p.kind!=='mobile'&&!used.has(p.id));
}
function renderStationCandidates(){
 const options=stationOptions();for(const id of [...stationChoice])if(!options.some(p=>p.id===id))stationChoice.delete(id);
 const box=$('station-candidates');box.replaceChildren();
 for(const p of options){
  const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.value=p.id;input.checked=stationChoice.has(p.id);
  input.disabled=busy||!input.checked&&stationChoice.size>=STATION_MAX;
  input.onchange=()=>{if(input.checked)stationChoice.add(p.id);else stationChoice.delete(p.id);renderStationCandidates();};
  label.append(input,siteName(p,document.createElement('span')));box.append(label);
 }
 $('station-count').textContent=`${stationChoice.size} / ${STATION_MAX} か所を選択`;
}
function stationName(s,node){
 const preset=allLocations().find(v=>v.id===s.id&&v.name===s.name);
 if(preset)return siteName(preset,node);node.textContent=s.name;node.dataset.userContent='true';return node;
}
// The cell shown: the chosen frequency, or the best frequency of each grid point.
function stationCell(){const r=coverageResult,m=r.matrix,h=matrixHour();return stationBest?m.best.cells[h]:m.cells[Math.min(matrixFrequency,m.frequencies.length-1)][h];}
function stationSummary(){const r=coverageResult,m=r.matrix,h=matrixHour();return stationBest?m.best.summary[h]:m.summary[Math.min(matrixFrequency,m.frequencies.length-1)][h];}
function stationFrequencyLabel(){const m=coverageResult.matrix;return stationBest?'最良周波数':m.frequencies[Math.min(matrixFrequency,m.frequencies.length-1)]+' MHz';}
function stationArea(){
 const r=coverageResult,m=r.matrix,key=(stationBest?'best':matrixFrequency)+'-'+matrixHour();r.stationAreas??={};
 if(!r.stationAreas[key]){const c=stationCell(),n=m.size;
  r.stationAreas[key]={size:n,lon_min:m.lon_min,lon_max:m.lon_max,lat_min:m.lat_min,lat_max:m.lat_max,reliability:matrixGrid(c.reliability,n,1,0),station:matrixGrid(c.station,n,1,0),frequency:c.frequency?matrixGrid(c.frequency,n,1,0):null};}
 return r.stationAreas[key];
}
// Each grid point fills its own cell: a station index is not a value to interpolate between points.
function stationImage(a){
 a.images??={};if(a.images.station)return a.images.station;const n=a.size,target=coverageResult.parameters.reliability;
 const rgb=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),colors=stationColors.map(rgb),gap=rgb(stationGap);
 const W=Math.min(1440,Math.max(960,(n-1)*8)),H=Math.max(2,Math.round(W*(a.lat_max-a.lat_min)/(a.lon_max-a.lon_min))),kinds=new Int8Array(W*H);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const gx=Math.round(x/(W-1)*(n-1)),gy=Math.round((1-y/(H-1))*(n-1)),rel=a.reliability[gy][gx],s=a.station[gy][gx];kinds[y*W+x]=rel==null||s==null?-1:rel>=target?s:9;}
 const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;const ctx=canvas.getContext('2d'),img=ctx.createImageData(W,H);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,k=kinds[i],o=i*4;if(k<0)continue;const edge=(x+1<W&&kinds[i+1]!==k)||(y+1<H&&kinds[i+W]!==k);const c=k===9?gap:colors[k];
  img.data[o]=edge?5:c[0];img.data[o+1]=edge?13:c[1];img.data[o+2]=edge?22:c[2];img.data[o+3]=edge?170:k===9?120:190;}
 ctx.putImageData(img,0,0);return a.images.station=canvas.toDataURL('image/png');
}
function stationPoint(a,lon,lat){const n=a.size;while(lon<a.lon_min-1e-9)lon+=360;while(lon>a.lon_max+1e-9)lon-=360;const x=Math.round((lon-a.lon_min)/(a.lon_max-a.lon_min)*(n-1)),y=Math.round((lat-a.lat_min)/(a.lat_max-a.lat_min)*(n-1));if(x<0||x>=n||y<0||y>=n)return null;
 return{lat:a.lat_min+(a.lat_max-a.lat_min)*y/(n-1),lon:((a.lon_min+(a.lon_max-a.lon_min)*x/(n-1)+540)%360)-180,reliability:a.reliability[y][x],station:a.station[y][x],frequency:a.frequency?.[y]?.[x]};}
function drawStationCoverage(g){
 const r=coverageResult,a=stationArea(),metric=$('cov_station_metric').value,[x1,y1]=xy(a.lon_min,a.lat_max),[x2,y2]=xy(a.lon_max,a.lat_min);
 const image=svg('image',{class:'coverage-area',href:metric==='station'?stationImage(a):coverageImage(a,'reliability'),x:x1,y:y1,width:x2-x1,height:y2-y1,preserveAspectRatio:'none'},g);
 image.onclick=e=>{e.stopPropagation();const p=mapPoint(e),v=stationPoint(a,p.x*360/1000-180,90-p.y*180/500);if(!v)return;
  const s=v.station==null?null:r.stations[v.station],f=v.frequency==null?null:r.matrix.frequencies[v.frequency];
  const point=`${v.lat.toFixed(1)}, ${v.lon.toFixed(1)}`,detail=relTitle(v.reliability)+(v.reliability!=null&&v.reliability<r.parameters.reliability?' / 空白域':'');
  notice(s?`${point} / 最良の送信所 ${resultSiteText(s.name)}`+(f?` · ${f} MHz`:'')+` / ${detail}`:`${point} / 送信所 — / ${detail}`);};
 if(land)for(const feature of land.features){const polys=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates;for(const poly of polys)svg('path',{d:poly.map(ring=>ring.map((v,i)=>`${i?'L':'M'}${xy(v[0],v[1]).join(',')}`).join(' ')+' Z').join(' '),fill:'none',stroke:'#c0e5de','stroke-width':.5/Math.sqrt(zoom),opacity:.7,'pointer-events':'none'},g);}
 if(r.span<360)svg('rect',{x:x1,y:y1,width:x2-x1,height:y2-y1,fill:'none',stroke:'#c0e5de','stroke-width':1/Math.sqrt(zoom),'stroke-dasharray':(5/zoom)+' '+(3/zoom),opacity:.8,'pointer-events':'none'},g);
 // The stations of the result, in their colours; the circuit's TX and RX markers are drawn above them by drawMap.
 const size=7/Math.sqrt(zoom);
 r.stations.forEach((s,i)=>{const[x,y]=xy(s.lon,s.lat);svg('rect',{x:x-size,y:y-size,width:2*size,height:2*size,fill:stationColors[i],stroke:'#050d16','stroke-width':1.6/Math.sqrt(zoom),transform:`rotate(45 ${x} ${y})`},g);
  // The circuit's TX is already labelled by drawMap.
  if(i===0&&s.id&&s.id===circuit.tx.location_id)return;
  const t=svg('text',{x:x+10/zoom,y:y+14/zoom,fill:stationColors[i],'font-size':11/zoom,'font-weight':700,stroke:'#050d16','stroke-width':3/zoom,'paint-order':'stroke','stroke-linejoin':'round'},g);t.textContent=s.name;});
 const x=center[0]-500/zoom+8/zoom,y=center[1]-250/zoom+8/zoom,label=stationFrequencyLabel(),text=`${window.HF_I18N?HF_I18N.translate(label):label} · ${String(matrixHour()).padStart(2,'0')}:00 UTC`;
 svg('rect',{class:'coverage-label',x,y,width:(text.length*6.4+12)/zoom,height:20/zoom,rx:3/zoom,fill:'#050d16',opacity:.82,'pointer-events':'none'},$('map'));
 svg('text',{class:'coverage-label',x:x+6/zoom,y:y+14/zoom,fill:'#f7b965','font-size':12/zoom,'font-weight':600,'pointer-events':'none'},$('map')).textContent=text;
}
function stationLegend(){
 const r=coverageResult,box=$('coverage-legend');box.replaceChildren();
 r.stations.forEach((s,i)=>{const item=document.createElement('span'),sw=document.createElement('i');sw.style.background=stationColors[i];item.append(sw,stationName(s,document.createElement('span')));box.append(item);});
 const item=document.createElement('span'),sw=document.createElement('i');sw.style.background=stationGap;item.append(sw,`空白域（目標REL ${r.parameters.reliability}%未満）`);box.append(item);box.hidden=false;
}
function stationTable(){
 const r=coverageResult,s=stationSummary(),table=document.createElement('table');table.className='heat station-summary';
 const head=document.createElement('tr');for(const t of ['送信所','単独で目標REL以上 %','最も届く範囲 %','この送信所だけが届く範囲 %'])head.append(cell('th',t));table.append(head);
 r.stations.forEach((v,i)=>{const tr=document.createElement('tr'),name=cell('th',''),sw=document.createElement('i');sw.className='station-key';sw.style.background=stationColors[i];name.append(sw,stationName(v,document.createElement('span')));
  const row=s.stations[i];tr.append(name,cell('td',fmt(row.alone)),cell('td',fmt(row.best)),cell('td',fmt(row.only)));table.append(tr);});
 const all=document.createElement('tr');all.append(cell('th','全送信所'),cell('td',fmt(s.covered)),cell('td',fmt(s.covered)),cell('td','—'));table.append(all);
 const gap=document.createElement('tr');gap.append(cell('th','空白域'),cell('td',s.covered==null?'—':fmt(Math.round((100-s.covered)*10)/10)),cell('td','—'),cell('td','—'));table.append(gap);
 $('station-summary').replaceChildren(cell('p',`${stationFrequencyLabel()} / ${matrixHour()}:00 UTC · 範囲内の面積に占める割合（緯度で重み付け）。地点間のRELではありません。`),table);
}
// Called by renderCoverageMatrix for a result of several stations.
function renderStationCoverage(){
 const r=coverageResult,m=r.matrix,label=r.span===360?'全世界':r.span+'° × '+r.span+'°',select=$('cov_freq'),values=['best',...m.frequencies.map(String)];
 if(select.options.length!==values.length||values.some((v,i)=>select.options[i].value!==v))select.replaceChildren(new Option('最良周波数','best'),...m.frequencies.map(v=>new Option(Number(v).toFixed(3)+' MHz',v)));
 select.value=stationBest?'best':String(m.frequencies[Math.min(matrixFrequency,m.frequencies.length-1)]);
 $('coverage-info').replaceChildren(cell('span',`送信所の重ね合わせ ${r.stations.length}か所 · ${stationFrequencyLabel()}`),cell('span',' / '),cell('span',`${matrixHour()}:00 UTC / ${label} / ${m.size}×${m.size}格子`),cell('p',r.note),...(r.notes??[]).map(n=>cell('p',n)));
 if($('cov_station_metric').value==='station')stationLegend();else coverageLegend('reliability');
 stationTable();
}
$('cov_station_metric').onchange=()=>{if(coverageResult?.stations)showCoverage();};
$('compute-stations').onclick=async()=>{
 if(busy)return;if(!form.checkValidity()){tab('conditions-tab');form.reportValidity();return;}if(!$('station-selection').reportValidity())return;
 try{
  validateCircuit();if(meshMode())throw Error('送信所の重ね合わせは単一RXの回線で計算します。メッシュを外してください。');
  const chosen=stationOptions().filter(p=>stationChoice.has(p.id));if(!chosen.length)throw Error('重ねる送信所を1か所以上選んでください。');
  const p={...params(),ui_selection:circuitSnapshot()},span=Number($('cov_span').value),tx=allLocations().find(v=>v.id===circuit.tx.location_id);
  if(span>=360&&!await confirmDialog())return;
  setBusy(true);notice(`送信所${chosen.length+1}か所 × 周波数${p.frequencies.length}波 × 24時間のカバー範囲を計算しています。数分かかります。`);
  coverageResult=await postWithDialog('送信所を重ねて計算しています','/api/coverage-stations',{...p,span,tx_id:circuit.tx.location_id??'',tx_name:tx?tx.name.slice(0,40):'TX',stations:chosen.map(c=>({id:c.id,name:c.name.slice(0,40),lat:c.lat,lon:c.lon}))});
  openCoverageMatrix(coverageResult);fitCoverage();showCoverage();
  notice('送信所を重ねたカバー範囲を計算しました。色は格子点ごとに最も届く送信所、灰色はどの送信所でも目標RELに届かない空白域です。');
 }catch(e){notice(e.message,true);}finally{setBusy(false);renderStationCandidates();}
};
