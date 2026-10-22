'use strict';
let observationData=null,overseasData=null;
function observedTime(v){return v?new Date(v).toISOString().replace('T',' ').replace('.000Z',' UTC').replace('+00:00',' UTC'):'時刻不明';}
function observationTable(headers,rows){
 const table=document.createElement('table'),head=document.createElement('tr');
 for(const h of headers)head.append(cell('th',h));table.append(head);
 for(const row of rows){const tr=document.createElement('tr');for(const v of row)tr.append(cell('td',v));table.append(tr);}
 return table;
}
function renderObservationComparison(){
 const box=$('observation-comparison');if(!box)return;
 if(!result){box.textContent='VOACAP計算後、選択時刻の回線MUFをここに併記します。';return;}
 const hour=result.hours.find(h=>h.hour_utc===+$('hour').value);
 box.textContent=`VOACAP回線予測（別条件の参考値）：${result.parameters.year}/${result.parameters.month}、${$('hour').value}:00 UTC、距離 ${result.distance_km} km、MUF ${fmt(hour?.muf_mhz,2)} MHz。NICT観測の時刻・距離・場所とは一致しません。`;
}
function renderNict(){
 const n=observationData?.nict;
 if(!n?.data){$('nict-observations').textContent=n?.error||'データ未取得';renderObservationComparison();return;}
 const rows=n.data.stations.map(s=>{const b=s.bands.find(b=>b.distance_km===+$('observation-distance').value);return [s.name+' '+s.code,observedTime(s.observed_at),s.stale?'古い／取得失敗':'取得済',fmt(s.fof2_mhz,2),fmt(b?.luf_mhz,2),fmt(b?.muf_mhz,2)];});
 $('nict-observations').replaceChildren(observationTable(['観測局','観測時刻 UTC','状態','垂直MUF（foF2相当）MHz','参考LUF MHz','参考MUF MHz'],rows));
 renderObservationComparison();
}
function gridCell(lon,lat){
 const d=observationData?.drap?.data;if(!d)return null;
 let xi=0,yi=0;
 for(let i=1;i<d.longitudes.length;i++)if(Math.abs(d.longitudes[i]-lon)<Math.abs(d.longitudes[xi]-lon))xi=i;
 for(let i=1;i<d.rows.length;i++)if(Math.abs(d.rows[i].lat-lat)<Math.abs(d.rows[yi].lat-lat))yi=i;
 return d.rows[yi].values[xi];
}
function renderDrapRoute(){
 const target=$('drap-route'),d=observationData?.drap;
 if(!target)return;
 if(!d?.data){target.textContent='';return;}
 if(d.stale){target.textContent='D-RAPは期限切れです。現在の経路付近の参考値は表示できません。';return;}
 const p=params();if(!['tx_lat','tx_lon','rx_lat','rx_lon'].every(k=>Number.isFinite(p[k]))||Math.abs(p.tx_lat)>89||Math.abs(p.rx_lat)>89||Math.abs(p.tx_lon)>180||Math.abs(p.rx_lon)>180){target.textContent='地点を正しく入力すると経路付近の格子を参照できます。';return;}let points=gc([p.tx_lat,p.tx_lon],[p.rx_lat,p.rx_lon]);
 if(!points.length){target.textContent='この経路のサンプリングはできません。';return;}
 const values=points.map(([x,y])=>gridCell(x*360/1000-180,90-y*180/500));
 const known=values.filter(v=>v!==null&&Number.isFinite(v));
 target.textContent=known.length?`短経路付近の格子を${values.length}点参照：HAFの最大 ${fmt(Math.max(...known),1)} MHz（欠測 ${values.length-known.length}点）。これは垂直伝搬の指標で、指定回線の損失・使用可能周波数判定ではありません。`:'経路付近のD-RAPは欠測です。';
}
function drawObservationLayers(parent){
 const d=observationData?.drap;
 if($('show-drap').checked&&d?.data){
  const layer=svg('g',{'pointer-events':'none',opacity:d.stale ? .2 : .55},parent);
  const lons=d.data.longitudes,rows=d.data.rows;
  for(let j=0;j<rows.length;j++){
   const r=rows[j],north=j===0?90:(rows[j-1].lat+r.lat)/2,south=j===rows.length-1?-90:(r.lat+rows[j+1].lat)/2;
   for(let i=0;i<lons.length;i++){
    const value=r.values[i];if(value===0)continue;
    const west=i===0?-180:(lons[i-1]+lons[i])/2,east=i===lons.length-1?180:(lons[i]+lons[i+1])/2;
    const [x,y]=xy(west,north);svg('rect',{x,y,width:(east-west)*1000/360,height:(north-south)*500/180,fill:value===null?'#7b8794':`hsl(${Math.max(0,60-Math.min(30,value)*2)},90%,55%)`},layer);
   }
  }
 }
 if($('show-stations').checked){
  const stations=observationData?.nict?.data?.stations||[];
  const overseas=overseasData?.data;
  for(const s of [...stations,...(overseas&&Number.isFinite(overseas.lat)?[{...overseas,stale:overseasData.stale,fof2_mhz:overseas.latest.fof2_mhz}]:[])]){
   const [x,y]=xy(s.lon,s.lat),c=svg('circle',{cx:x,cy:y,r:4/Math.sqrt(zoom),fill:s.stale?'#7b8794':'#b598ff',stroke:'#fff','stroke-width':.7},parent);
   const title=svg('title',{},c);title.textContent=`${s.name} ${s.code} / ${observedTime(s.observed_at)} / foF2 ${fmt(s.fof2_mhz,2)} MHz${s.stale?' [古い]':''}`;
   c.onclick=e=>{e.stopPropagation();notice(title.textContent);};
  }
 }
 renderDrapRoute();
}
$('show-drap').onchange=drawMap;$('show-stations').onchange=drawMap;
$('observation-distance').onchange=renderNict;
$('observations-refresh').onclick=async()=>{
 const button=$('observations-refresh');button.disabled=true;$('observations-status').textContent='国内観測とD-RAPを取得中…';
 try{
  observationData=await api('/api/observations?refresh=1');const d=observationData.drap,n=observationData.nict;
  $('observations-status').replaceChildren(`国内観測: ${n.data?n.data.stations.length+'局':'欠測'}${n.stale?' [古い／取得失敗]':''}。`,' ',document.createTextNode(observationData.note));
  $('drap-status').textContent=d.data?`D-RAP ${observedTime(d.data.observed_at)} / ${d.stale?'古い／取得失敗':'取得済'} / 取得 ${observedTime(d.fetched_at?new Date(d.fetched_at*1000).toISOString():null)}`:(d.error||'欠測');
  $('observation-map-legend').textContent=d.data?`D-RAP HAF: 黄＝低、赤＝高（0〜30 MHz以上）、透明＝0、灰＝欠測。${d.stale?'期限切れのため薄く表示。':''}観測局: 紫＝取得済、灰＝古い。`:'D-RAP未取得。観測局は紫＝取得済、灰＝古い。';
  $('observation-sources').replaceChildren();
  for(const [name,source] of [['NOAA D-RAP',d],['NICT',n]]){
   const a=cell('a',name+'出典');a.href=source.source_url;a.target='_blank';a.rel='noopener noreferrer';
   $('observation-sources').append(a,document.createTextNode(` 取得 ${source.fetched_at?new Date(source.fetched_at*1000).toISOString():'未取得'}${source.error?' / '+source.error:''} `));
  }
  $('giro-refresh').disabled=!observationData.giro.enabled;
  if(!observationData.giro.enabled)$('giro-status').textContent='GIRO接続は無効です。利用条件に適合する環境でHF_GIRO_ENABLED=1を設定して再起動すると、海外観測を取得できます。';
  renderNict();drawMap();
 }catch(e){$('observations-status').textContent=e.message;}finally{button.disabled=false;if(typeof renderExternalDataTimes==='function')renderExternalDataTimes();}
};
function renderGiroChart(series){
 const box=$('giro-chart');box.replaceChildren();const values=series.filter(r=>r.fof2_mhz!==null);
 if(!values.length)return;
 const plot=svg('svg',{viewBox:'0 0 600 180',role:'img','aria-label':'海外観測局の過去2時間のfoF2（MHz）。欠測や15分を超える間隔は接続しません。'},box);
 const start=new Date(series[0].observed_at).getTime(),end=new Date(series.at(-1).observed_at).getTime();
 const max=Math.max(1,...values.map(r=>r.fof2_mhz))*1.1;
 for(let i=0;i<=4;i++){const y=145-i*30;svg('line',{x1:45,x2:590,y1:y,y2:y,stroke:'#375269'},plot);const t=svg('text',{x:3,y:y+4,fill:'#a8b8c9','font-size':11},plot);t.textContent=fmt(max*i/4,1);}
 let path='',previous=null;
 for(const row of series){const time=new Date(row.observed_at).getTime();if(row.fof2_mhz===null){previous=null;continue;}
  const x=45+(time-start)/Math.max(1,end-start)*540,y=145-row.fof2_mhz/max*120;
  path+=(previous!==null&&time-previous<=15*60000?' L':' M')+x+','+y;previous=time;
  const c=svg('circle',{cx:x,cy:y,r:2,fill:'#b598ff'},plot);svg('title',{},c).textContent=`${row.observed_at} / foF2 ${row.fof2_mhz} MHz / CS ${row.confidence??'不明'}`;
 }
 svg('path',{d:path,fill:'none',stroke:'#b598ff','stroke-width':2},plot);
 for(const [x,time,anchor] of [[45,start,'start'],[585,end,'end']]){const t=svg('text',{x,y:172,fill:'#a8b8c9','font-size':11,'text-anchor':anchor},plot);t.textContent=new Date(time).toISOString().slice(11,16)+' UTC';}
 const label=svg('text',{x:45,y:14,fill:'#a8b8c9','font-size':11},plot);label.textContent='foF2（MHz）';
}
$('giro-refresh').onclick=async()=>{
 const button=$('giro-refresh'),code=$('giro-station').value;button.disabled=true;$('giro-status').textContent='海外観測を取得中…';
 try{
  const response=await api('/api/observations/giro?station='+encodeURIComponent(code)+'&refresh=1');
  if(code!==$('giro-station').value)return;
  overseasData=response;
  const d=response.data;
  if(!d){$('giro-status').textContent=response.error||'対象局の観測は欠測です。';$('giro-observations').replaceChildren();$('giro-chart').replaceChildren();drawMap();return;}
  const r=d.latest;
  $('giro-status').textContent=`${d.name} ${d.code} / ${observedTime(r.observed_at)} / ${response.stale?'古い／取得失敗':'取得済'} / ${d.credit} / 取得 ${response.fetched_at?new Date(response.fetched_at*1000).toISOString():'不明'}${response.error?' / '+response.error:''}`;
  $('giro-observations').replaceChildren(observationTable(['foF2 MHz','MUF(3000) MHz','CS','foF2限定符','MUF限定符'],[[fmt(r.fof2_mhz,2),fmt(r.muf3000_mhz,2),r.confidence??'不明',r.fof2_qualifier,r.muf_qualifier]]));
  renderGiroChart(d.series);drawMap();
 }catch(e){$('giro-status').textContent=e.message;}finally{button.disabled=observationData?.giro.enabled===false;if(typeof renderExternalDataTimes==='function')renderExternalDataTimes();}
};
$('giro-station').onchange=()=>{overseasData=null;if(typeof renderExternalDataTimes==='function')renderExternalDataTimes();$('giro-observations').replaceChildren();$('giro-chart').replaceChildren();$('giro-status').textContent='観測局を変更しました。海外観測を取得してください。';drawMap();};
renderObservationComparison();
// Age the display even when the page remains open without another network fetch.
function ageObservationDisplay(){
 const old=value=>!value||!Number.isFinite(Date.parse(value))||Date.now()-Date.parse(value)>3600000||Date.parse(value)-Date.now()>300000;
 const d=observationData?.drap;
 if(d?.data&&old(d.data.observed_at)){
  d.stale=true;
  $('drap-status').textContent=`D-RAP ${observedTime(d.data.observed_at)} / 古い（観測時刻から1時間超または時刻不正）`;
  $('observation-map-legend').textContent='D-RAPは古い情報のため薄く表示。国内外の灰色観測局も古い情報です。取得ボタンで更新してください。';
 }
 for(const station of observationData?.nict?.data?.stations||[])if(old(station.observed_at))station.stale=true;
 if(overseasData?.data&&old(overseasData.data.observed_at)){
  overseasData.stale=true;
  $('giro-status').textContent=`${overseasData.data.name} ${observedTime(overseasData.data.observed_at)} / 古い観測値。再取得してください。`;
 }
 renderNict();drawMap();if(typeof renderExternalDataTimes==='function')renderExternalDataTimes();
}
setInterval(ageObservationDisplay,60000);
