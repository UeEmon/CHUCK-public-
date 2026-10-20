'use strict';
(function bindMapControls(){
 const map=$('map');let drag=null,pinch=null,suppressClick=false;
 // Active touches, so two fingers pinch to zoom on tablets and phones.
 const pointers=new Map();
 function clamp(){center=[((center[0]%1000)+1000)%1000,Math.max(250/zoom,Math.min(500-250/zoom,center[1]))];}
 function transformed(x,y,matrix){const p=map.createSVGPoint();p.x=x;p.y=y;return p.matrixTransform(matrix);}
 map.addEventListener('contextmenu',e=>e.preventDefault());
 map.addEventListener('pointerdown',e=>{
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size===2){startPinch();return;}
  if(e.button!==0||drag||pinch)return;
  drag={id:e.pointerId,x:e.clientX,y:e.clientY,center:[...center],matrix:map.getScreenCTM().inverse(),moved:false};suppressClick=false;
 });
 map.addEventListener('pointermove',e=>{
  if(pointers.has(e.pointerId))pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pinch){movePinch();e.preventDefault();return;}
  if(!drag||e.pointerId!==drag.id)return;
  if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<4)return;
  if(!drag.moved){drag.moved=true;map.setPointerCapture(e.pointerId);map.classList.add('dragging');}
  const start=transformed(drag.x,drag.y,drag.matrix),now=transformed(e.clientX,e.clientY,drag.matrix);
  center=[drag.center[0]+start.x-now.x,drag.center[1]+start.y-now.y];clamp();drawMap();e.preventDefault();
 });
 function zoomAround(next,anchor,screen,matrix,base){
  // Keep the map point under the fingers (or the map centre) in place while zooming.
  next=Math.max(1,Math.min(6,next));const now=transformed(screen.x,screen.y,matrix);
  zoom=next;center=[anchor.x-(now.x-base.center[0])*base.zoom/next,anchor.y-(now.y-base.center[1])*base.zoom/next];clamp();drawMap();
 }
 function middle(){const [a,b]=[...pointers.values()];return {x:(a.x+b.x)/2,y:(a.y+b.y)/2,d:Math.hypot(a.x-b.x,a.y-b.y)||1};}
 function startPinch(){
  if(drag){if(map.hasPointerCapture(drag.id))map.releasePointerCapture(drag.id);drag=null;}
  const m=middle(),matrix=map.getScreenCTM().inverse();
  pinch={m,matrix,anchor:transformed(m.x,m.y,matrix),base:{zoom,center:[...center]}};suppressClick=true;map.classList.add('dragging');
 }
 function movePinch(){const m=middle();zoomAround(pinch.base.zoom*m.d/pinch.m.d,pinch.anchor,m,pinch.matrix,pinch.base);}
 function step(factor){
  const r=map.getBoundingClientRect(),s={x:r.left+r.width/2,y:r.top+r.height/2},matrix=map.getScreenCTM().inverse();
  zoomAround(zoom*factor,transformed(s.x,s.y,matrix),s,matrix,{zoom,center:[...center]});
 }
 $('zoom-in').onclick=()=>step(1.5);$('zoom-out').onclick=()=>step(1/1.5);
 function lift(e){pointers.delete(e.pointerId);if(pinch&&pointers.size<2){pinch=null;map.classList.remove('dragging');}}
 map.addEventListener('pointerup',lift);map.addEventListener('pointercancel',lift);window.addEventListener('pointerup',lift);window.addEventListener('pointercancel',lift);
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
