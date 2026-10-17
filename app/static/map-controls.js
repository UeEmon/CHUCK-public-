'use strict';
(function bindMapControls(){
 const map=$('map');let drag=null,suppressClick=false;
 function clamp(){center=[((center[0]%1000)+1000)%1000,Math.max(250/zoom,Math.min(500-250/zoom,center[1]))];}
 function transformed(x,y,matrix){const p=map.createSVGPoint();p.x=x;p.y=y;return p.matrixTransform(matrix);}
 map.addEventListener('contextmenu',e=>e.preventDefault());
 map.addEventListener('pointerdown',e=>{
  if(e.button!==0||drag)return;
  drag={id:e.pointerId,x:e.clientX,y:e.clientY,center:[...center],matrix:map.getScreenCTM().inverse(),moved:false};suppressClick=false;
 });
 map.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.id)return;
  if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<4)return;
  if(!drag.moved){drag.moved=true;map.setPointerCapture(e.pointerId);map.classList.add('dragging');}
  const start=transformed(drag.x,drag.y,drag.matrix),now=transformed(e.clientX,e.clientY,drag.matrix);
  center=[drag.center[0]+start.x-now.x,drag.center[1]+start.y-now.y];clamp();drawMap();e.preventDefault();
 });
 function end(e){if(!drag||e.pointerId!==drag.id)return;suppressClick=drag.moved;if(map.hasPointerCapture(e.pointerId))map.releasePointerCapture(e.pointerId);drag=null;map.classList.remove('dragging');}
 map.addEventListener('pointerup',end);map.addEventListener('pointercancel',end);
 // Also end a click that was released outside the SVG before the drag threshold.
 window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);
 map.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopImmediatePropagation();suppressClick=false;}},true);
 map.addEventListener('wheel',e=>{
  e.preventDefault();if(drag)return;const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;if(!delta)return;
  const scale=e.deltaMode===1?16:e.deltaMode===2?500:1,old=zoom,p=mapPoint(e);
  zoom=Math.max(1,Math.min(6,zoom*Math.exp(-Math.max(-200,Math.min(200,delta*scale))*.003)));
  center=[p.x-(p.x-center[0])*old/zoom,p.y-(p.y-center[1])*old/zoom];clamp();drawMap();
 },{passive:false});
})();
