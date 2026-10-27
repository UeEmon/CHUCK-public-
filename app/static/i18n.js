'use strict';
// Local translations only. Preserve source text across application DOM updates.
(function(){
 const locales=['ja','en','fr','es','it','pt','de','ko'],textState=new WeakMap(),attributeState=new WeakMap();
 let locale='ja';
 try{const saved=localStorage.getItem('hf-language');if(locales.includes(saved))locale=saved;}catch{/* Storage is optional. */}
 const escape=s=>s.replace(/[.*+?^$(){}|[\]\\]/g,'\\$&');
 const templates=Object.entries(HF_MESSAGES).filter(([k])=>k.includes('{')).map(([source,values])=>{
  const names=[],parts=source.split(/(\{[a-z]+\})/);const regex=new RegExp('^'+parts.map(part=>{if(/^\{[a-z]+\}$/.test(part)){names.push(part.slice(1,-1));return '(.+?)';}return escape(part);}).join('')+'$');
  return {regex,names,values};
 });
 const fragments=Object.keys(HF_MESSAGES).filter(k=>!k.includes('{')).sort((a,b)=>b.length-a.length);
 const fragmentRegex=new RegExp(fragments.map(escape).join('|'),'g');
 function translate(source){
  if(locale==='ja'||!source)return source;const index=locales.indexOf(locale)-1;
  if(HF_MESSAGES[source])return HF_MESSAGES[source][index];
  for(const entry of templates){const match=source.match(entry.regex);if(match){const vars=Object.fromEntries(entry.names.map((name,i)=>[name,match[i+1]]));return entry.values[index].replace(/\{([a-z]+)\}/g,(_,key)=>['state','error','note','detail','label'].includes(key)?translate(vars[key]):vars[key]);}}
  return source.replace(fragmentRegex,key=>HF_MESSAGES[key][index]);
 }
 function excluded(element){return !element||element.closest('script,style,#language,[data-user-content],#positions-table td:nth-child(2),#position-stations td:nth-child(2),#map text,#map title');}
 function updateText(node){
  if(excluded(node.parentElement)||!node.data.trim())return;
  let cached=textState.get(node);
  if(!cached||node.data!==cached.rendered)cached={source:node.data};
  const stripped=cached.source.trim(),translated=translate(stripped);
  cached.rendered=cached.source.replace(stripped,translated);textState.set(node,cached);
  if(node.data!==cached.rendered)node.data=cached.rendered;
 }
 function updateAttributes(element){
  if(excluded(element))return;let cache=attributeState.get(element);if(!cache){cache={};attributeState.set(element,cache);}
  for(const name of ['title','aria-label','placeholder',...(element.tagName==='OPTGROUP'?['label']:[])]){
   const value=element.getAttribute(name);if(value===null)continue;
   if(!cache[name]||value!==cache[name].rendered)cache[name]={source:value};
   const item=cache[name];item.rendered=translate(item.source);if(value!==item.rendered)element.setAttribute(name,item.rendered);
  }
 }
 function visit(root){
  if(root.nodeType===Node.TEXT_NODE){updateText(root);return;}
  if(root.nodeType!==Node.ELEMENT_NODE)return;updateAttributes(root);
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
  while(walker.nextNode()){const n=walker.currentNode;if(n.nodeType===Node.TEXT_NODE)updateText(n);else updateAttributes(n);}
 }
 function setLanguage(value,persist=true){
  if(!locales.includes(value))return;locale=value;document.documentElement.lang=value;
  const select=document.getElementById('language');if(select)select.value=value;
  if(persist)try{localStorage.setItem('hf-language',value);}catch{/* Still apply for this session. */}
  visit(document.documentElement);
  window.dispatchEvent(new CustomEvent('hf-language-change',{detail:{language:value}}));
 }
 const observer=new MutationObserver(records=>{
  for(const r of records){if(r.type==='characterData')updateText(r.target);else if(r.type==='attributes')updateAttributes(r.target);else for(const node of r.addedNodes)visit(node);}
 });
 observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','placeholder','label']});
 window.HF_I18N={setLanguage,translate,get language(){return locale;},locales};
 document.getElementById('language')?.addEventListener('change',e=>setLanguage(e.target.value));
 setLanguage(locale,false);
})();
