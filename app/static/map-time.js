'use strict';
// UTC slider under the circuit map. It drives the hour control of the visible result tab, so the map paths follow it.
const mapTimeTabs={prediction:{control:'hour',event:'change',ready:()=>result},diversity:{control:'diversity-hour',event:'change',ready:()=>diversityResult},mesh:{control:'mesh-hour',event:'input',ready:()=>meshResult}};
let mapTimer=null;
function mapTimeTab(){return Object.keys(mapTimeTabs).find(id=>!$(id).hidden)??null;}
function stopMapPlay(){if(mapTimer){clearInterval(mapTimer);mapTimer=null;}$('map-play').textContent='▶ 再生';}
function syncMapTime(){
 const id=mapTimeTab();$('map-time').hidden=!id;if(!id){stopMapPlay();return;}
 const hour=Number($(mapTimeTabs[id].control).value);$('map-hour').value=hour;$('map-hour-label').textContent=String(hour).padStart(2,'0')+':00 UTC';
}
function setMapHour(hour){
 const id=mapTimeTab();if(!id)return;const t=mapTimeTabs[id],control=$(t.control);
 control.value=String((hour+24)%24);control.dispatchEvent(new Event(t.event));
}
$('map-hour').oninput=e=>{stopMapPlay();setMapHour(Number(e.target.value));};
$('map-play').onclick=()=>{
 if(mapTimer){stopMapPlay();return;}const id=mapTimeTab();if(!id||!mapTimeTabs[id].ready())return;
 if(typeof stopMeshPlay==='function')stopMeshPlay();$('map-play').textContent='■ 停止';
 mapTimer=setInterval(()=>{const now=mapTimeTab();if(now!==id){stopMapPlay();return;}setMapHour(Number($('map-hour').value)+1);},800);
};
// Direct use of a tab's own control; renders that also redraw the map sync through drawMap.
for(const t of Object.values(mapTimeTabs))$(t.control).addEventListener(t.event,syncMapTime);
syncMapTime();
