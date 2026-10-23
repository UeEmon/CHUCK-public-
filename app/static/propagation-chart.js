'use strict';
function chartRun(){
 const type=$('chart-result').value;
 if(type==='diversity')return diversityResult?.sites.find(s=>s.id===$('chart-site').value)??null;
 return result;
}
function updatePropagationChart(preferred){
 const choice=$('chart-result'),previous=choice.value;
 choice.options[0].disabled=!result;choice.options[1].disabled=!diversityResult;
 choice.value=preferred??previous;
 if(choice.selectedOptions[0]?.disabled)choice.value=result?'point':'diversity';
 const sites=$('chart-site'),old=sites.value;sites.replaceChildren();
 if(choice.value==='diversity'&&diversityResult){for(const s of diversityResult.sites){const option=new Option(s.name,s.id);option.dataset.userContent='true';sites.add(option);}if([...sites.options].some(o=>o.value===old))sites.value=old;}
 else sites.add(new Option('RX1','rx1'));
 sites.disabled=choice.value!=='diversity';
 renderPropagationChart();
}
function renderPropagationChart(){
 const box=$('propagation-plot'),run=chartRun();box.replaceChildren();$('chart-export').disabled=!run;
 if(!run){$('chart-caption').textContent='計算後にPropagation Chartを表示します。';return;}
 const metric=$('chart-metric').value,isRel=metric==='reliability',p=run.parameters;
 const width=1100,height=540,left=64,top=32,pw=1000,ph=420,cw=pw/24;
 const root=svg('svg',{viewBox:'0 0 '+width+' '+height,role:'img','aria-label':'Propagation Chart · UTC × MHz',xmlns:NS},box);
 const title=svg('title',{},root);title.textContent='Propagation Chart · '+(isRel?'REL (%)':'SNR (dB·Hz)');
 svg('rect',{x:0,y:0,width,height,fill:'#0a1725'},root);
 const defs=svg('defs',{},root),clip=svg('clipPath',{id:'propagation-clip'},defs);
 svg('rect',{x:left,y:top,width:pw,height:ph},clip);
 const plot=svg('g',{'clip-path':'url(#propagation-clip)'},root),y=f=>top+ph*(30-f)/28;
 for(let f=2;f<=30;f+=2){svg('line',{x1:left,x2:left+pw,y1:y(f),y2:y(f),stroke:'#2b4054','stroke-width':1},root);svg('text',{x:left-10,y:y(f)+4,fill:'#b3c4d5','font-size':12,'text-anchor':'end'},root).textContent=f;}
 for(let h=0;h<=24;h++){const x=left+h*cw;svg('line',{x1:x,x2:x,y1:top,y2:top+ph,stroke:'#20364a','stroke-width':1},root);if(h%2===0)svg('text',{x,y:top+ph+22,fill:'#b3c4d5','font-size':12,'text-anchor':'middle'},root).textContent=String(h).padStart(2,'0');}
 svg('text',{x:14,y:20,fill:'#e6eef5','font-size':13},root).textContent='MHz';
 svg('text',{x:left+pw/2,y:top+ph+45,fill:'#e6eef5','font-size':13,'text-anchor':'middle'},root).textContent='UTC';
 for(const hour of run.hours){
  for(const row of hour.rows){
   const value=row[metric],valid=Number.isFinite(value),normalized=isRel?value:(value+20)/120*100;
   const mark=svg('rect',{x:left+hour.hour_utc*cw+1,y:y(row.frequency_mhz)-5,width:cw-2,height:10,fill:valid?(isRel?relPercentFill(value):color(normalized)):'#7b8794',tabindex:0,role:'button',stroke:valid&&isRel&&value>=p.reliability?'#effff8':'none','stroke-width':.8},plot);
   const caption=hour.hour_utc+':00 UTC / '+row.frequency_mhz+' MHz / '+(isRel?'REL ':'SNR ')+(valid?fmt(value,1):'—')+(isRel?' %':' dB·Hz');
   mark.setAttribute('aria-label',caption);svg('title',{},mark).textContent=caption;
   const open=()=>{if($('chart-result').value==='diversity'){$('diversity-hour').value=hour.hour_utc;renderDiversityDetail();tab('diversity');}else{$('hour').value=hour.hour_utc;renderDetail();tab('prediction');}};
   mark.onclick=open;mark.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}};
  }
 }
 if($('chart-muf').checked){
  let path='',previous=null;
  for(const h of [...run.hours].sort((a,b)=>a.hour_utc-b.hour_utc)){
   if(!Number.isFinite(h.muf_mhz)){previous=null;continue;}
   path+=(previous!==null&&h.hour_utc===previous+1?' L':' M')+(left+(h.hour_utc+.5)*cw)+','+y(h.muf_mhz);previous=h.hour_utc;
  }
  svg('path',{d:path,fill:'none',stroke:'#ffcf70','stroke-width':2.2},plot);
 }
 const gradient=svg('linearGradient',{id:'propagation-scale',x1:'0%',x2:'100%'},defs);
 for(let i=0;i<=100;i+=isRel?1:10)svg('stop',{offset:i+'%','stop-color':isRel?relPercentFill(i):color(i)},gradient);
 svg('rect',{x:left,y:500,width:240,height:9,fill:'url(#propagation-scale)'},root);
 svg('text',{x:left+250,y:510,fill:'#b3c4d5','font-size':12},root).textContent=isRel?'REL 0 → 100 %':'SNR −20 → 100 dB·Hz';
 if($('chart-muf').checked)svg('text',{x:left+pw-80,y:510,fill:'#ffcf70','font-size':13},root).textContent='MUF';
 $('chart-caption').textContent=p.year+'/'+p.month+' · SSN '+p.ssn+' · '+p.power_w+' W · '+run.distance_km+' km'+radioCaption(p);
}
$('chart-result').onchange=()=>updatePropagationChart();
for(const id of ['chart-site','chart-metric','chart-muf'])$(id).onchange=renderPropagationChart;
$('chart-export').onclick=()=>{
 const plot=$('propagation-plot').querySelector('svg');if(!plot)return;
 const clone=plot.cloneNode(true);clone.querySelectorAll('[tabindex]').forEach(e=>{e.removeAttribute('tabindex');e.removeAttribute('role');});
 const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)],{type:'image/svg+xml;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download='propagation-chart.svg';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
window.addEventListener('hf-language-change',()=>{if(chartRun())renderPropagationChart();});
updatePropagationChart();
