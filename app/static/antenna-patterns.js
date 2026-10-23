'use strict';
// Measured or simulated antenna patterns (CSV) for the pattern_table model.
let antennaPatterns=[];
function patternMessage(message,error=false){$('pattern-status').textContent=message;$('pattern-status').classList.toggle('error',error);}
function renderPatternOptions(){
 const select=$('antenna-editor').elements.pattern_id,current=select.value;select.replaceChildren(new Option('利得表を選択',''));
 for(const p of antennaPatterns){const option=new Option(p.name,p.id);option.dataset.userContent='true';select.add(option);}
 select.value=current;
}
async function loadPatterns(){
 try{
  antennaPatterns=(await api('/api/antenna-patterns')).patterns;renderPatternOptions();
  const box=$('pattern-list');box.replaceChildren();
  for(const p of antennaPatterns){
   const row=document.createElement('div');row.className='ocr-document';const title=cell('span',p.name+(p.source?' · '+p.source:''));title.dataset.userContent='true';
   const info=cell('span',p.frequencies_mhz[0]+'–'+p.frequencies_mhz[1]+' MHz ('+p.frequency_count+') · az '+p.azimuth_count+' · el '+p.elevations_deg[0]+'–'+p.elevations_deg[1]+'° · max '+p.max_gain_dbi+' dBi');info.className='hint';
   const remove=cell('button','削除');remove.type='button';
   remove.onclick=async()=>{try{await post('/api/antenna-patterns/'+p.id+'/delete',{});await loadPatterns();patternMessage('利得表を削除しました。');}catch(e){patternMessage(e.message,true);}};
   row.append(title,info,remove);box.append(row);
  }
 }catch(e){patternMessage(e.message,true);}
}
$('pattern-form').onsubmit=async e=>{
 e.preventDefault();const f=e.target,file=f.elements.file.files[0];if(!file)return;
 try{
  if(file.size>6*1024*1024)throw Error('CSVは6 MiB以下にしてください');
  await post('/api/antenna-patterns',{name:f.elements.name.value,source:f.elements.source.value,csv:await file.text()});
  f.reset();await loadPatterns();patternMessage('利得表を登録しました。アンテナプリセットの基準モデルで「利得表」を選んで使用します。');
 }catch(err){patternMessage(err.message,true);}
};
loadPatterns();
