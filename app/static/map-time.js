'use strict';
// UTC sliders under the circuit map and above the prediction/diversity heatmaps. Each drives the hour control of its tab,
// so the map paths, heatmap column and detail tables follow it. The map slider follows whichever of those tabs is visible.
const mapTimeTabs={prediction:{control:'hour',event:'change',ready:()=>result},diversity:{control:'diversity-hour',event:'change',ready:()=>diversityResult},mesh:{control:'mesh-hour',event:'input',ready:()=>meshResult}};
const timeBars=[...document.querySelectorAll('.time-bar')];
let mapTimer=null;
function mapTimeTab(){return Object.keys(mapTimeTabs).find(id=>!$(id).hidden)??null;}
function barTab(bar){return bar.dataset.timeTab??mapTimeTab();}
function stopMapPlay(){if(mapTimer){clearInterval(mapTimer);mapTimer=null;}for(const bar of timeBars)bar.querySelector('button').textContent='▶ 再生';}
function syncMapTime(){
 const id=mapTimeTab();$('map-time').hidden=!id;if(!id)stopMapPlay();
 for(const bar of timeBars){
  const tab=barTab(bar);if(!tab)continue;const hour=Number($(mapTimeTabs[tab].control).value);
  bar.querySelector('input').value=hour;bar.querySelector('output').textContent=String(hour).padStart(2,'0')+':00 UTC';
 }
}
function setMapHour(tab,hour){
 const t=mapTimeTabs[tab],control=$(t.control);
 control.value=String((hour+24)%24);control.dispatchEvent(new Event(t.event));
}
function toggleMapPlay(){
 if(mapTimer){stopMapPlay();return;}const id=mapTimeTab();if(!id||!mapTimeTabs[id].ready())return;
 if(typeof stopMeshPlay==='function')stopMeshPlay();for(const bar of timeBars)bar.querySelector('button').textContent='■ 停止';
 mapTimer=setInterval(()=>{if(mapTimeTab()!==id){stopMapPlay();return;}setMapHour(id,Number($(mapTimeTabs[id].control).value)+1);},800);
}
for(const bar of timeBars){
 bar.querySelector('input').oninput=e=>{const tab=barTab(bar);if(!tab)return;stopMapPlay();setMapHour(tab,Number(e.target.value));};
 bar.querySelector('button').onclick=toggleMapPlay;
}
// Direct use of a tab's own control; renders that also redraw the map sync through drawMap.
for(const t of Object.values(mapTimeTabs))$(t.control).addEventListener(t.event,syncMapTime);
syncMapTime();
