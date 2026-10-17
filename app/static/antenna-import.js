'use strict';
let antennaDocument=null,antennaOCRConfig=null,ocrReading=false;
const ocrFieldNames={name:'名称',manufacturer:'メーカー',designation:'型式',antenna_type:'アンテナ方式',mounting:'搭載・設置方式',polarization:'偏波方式',physical_length_m:'物理全長 m',electrical_length_m:'電気長 m',frequency_min_mhz:'最低周波数 MHz',frequency_max_mhz:'最高周波数 MHz',power_w:'許容電力 W',gain_dbi:'利得 dBi',notes:'モデル注記'};
function sourceDownload(id){const a=cell('a','原本をダウンロード');a.href='/api/antenna-imports/'+id+'/source';a.download='';return a;}
function ocrMessage(message,error=false){$('ocr-status').textContent=message;$('ocr-status').classList.toggle('error',error);}
async function loadAntennaDocuments(){
 try{
  const cfg=await api('/api/antenna-imports');antennaOCRConfig=cfg;
  $('ocr-config').textContent=cfg.configured?cfg.provider_label+' / '+cfg.model:'AI設定で接続先・キー・モデルを設定してください';
  $('ocr-submit').disabled=ocrReading||!cfg.configured;
  $('antenna-import-form').elements.file.accept=cfg.media_types.join(',');
  const box=$('ocr-documents');box.replaceChildren();
  for(const doc of cfg.documents){
   const row=document.createElement('div');row.className='ocr-document';const title=cell('span',doc.filename+' · '+doc.created);title.dataset.userContent='true';
   const open=cell('button','読取候補を表示');open.type='button';open.onclick=async()=>{try{showAntennaDocument(await api('/api/antenna-imports/'+doc.id));}catch(e){ocrMessage(e.message,true);}};
   const remove=cell('button','削除');remove.type='button';remove.disabled=ocrReading;remove.onclick=async()=>{try{await post('/api/antenna-imports/'+doc.id+'/delete',{});if(antennaDocument?.id===doc.id){antennaDocument=null;$('ocr-candidates').replaceChildren();}await loadAntennaDocuments();}catch(e){ocrMessage(e.message,true);}};
   row.append(title,open,sourceDownload(doc.id),remove);box.append(row);
  }
 }catch(e){ocrMessage(e.message,true);}
}
function showAntennaDocument(doc){
 antennaDocument=doc;const box=$('ocr-candidates');box.replaceChildren();
 const title=cell('h4',doc.filename);title.dataset.userContent='true';box.append(title,sourceDownload(doc.id));
 const provenance=cell('p','SHA-256 '+doc.sha256+' · '+(aiLabels[doc.provider]??doc.provider??'OpenAI')+' / '+doc.model);provenance.className='hint';box.append(provenance);
 if(doc.source_url){const a=cell('a',doc.source_url);a.href=doc.source_url;a.target='_blank';a.rel='noopener noreferrer';box.append(a);}
 for(const warning of doc.extraction.warnings){const p=cell('p',warning);p.dataset.userContent='true';p.className='hint';box.append(p);}
 if(!doc.extraction.candidates.length)box.append(cell('p','アンテナ候補を読み取れませんでした。資料の画質・対象ページを確認してください。'));
 for(const [index,candidate]of doc.extraction.candidates.entries()){
  const panel=document.createElement('section');panel.className='ocr-candidate';
  const heading=cell('h4',candidate.name??candidate.designation??('Candidate '+(index+1)));heading.dataset.userContent='true';panel.append(heading);
  const table=document.createElement('table'),head=document.createElement('tr');['項目','読取値','ページ・根拠'].forEach(t=>head.append(cell('th',t)));table.append(head);
  for(const [key,label]of Object.entries(ocrFieldNames)){
   const row=document.createElement('tr'),value=cell('td',candidate[key]??'—'),evidence=cell('td',candidate.evidence.filter(e=>e.field===key).map(e=>'p.'+(e.page??'?')+' '+e.quote).join(' / '));value.dataset.userContent=evidence.dataset.userContent='true';row.append(cell('th',label),value,evidence);table.append(row);
  }
  const wrap=document.createElement('div');wrap.className='table-wrap';wrap.append(table);panel.append(wrap);
  const select=cell('button','この候補を確認・編集');select.type='button';select.onclick=()=>{
   const length=candidate.physical_length_m;
   editCatalog('antennas',{name:(candidate.name??candidate.designation??'Imported antenna').slice(0,40),model:'whip',gain:0,reference_only:true,
    length_m:typeof length==='number'&&length>=.1&&length<=200?length:null,
    document_ref:{id:doc.id,candidate_index:index,reviewed:false,approximation_ack:false}});
   $('antenna-editor').scrollIntoView({block:'center',behavior:'smooth'});
  };panel.append(select);box.append(panel);
 }
}
function updateOCRReview(){
 const f=$('antenna-editor'),active=!!f.dataset.documentRef,reference=f.elements.reference_only.checked;
 $('ocr-review').hidden=!active;$('ocr-reviewed').required=active;$('ocr-approximation').required=active&&!reference;
 $('ocr-approximation').disabled=reference;
}
function editOCRReference(p){
 const f=$('antenna-editor');delete f.dataset.documentRef;$('ocr-reviewed').checked=false;$('ocr-approximation').checked=false;
 $('ocr-review-source').replaceChildren();
 if(p.document_ref){f.dataset.documentRef=JSON.stringify(p.document_ref);$('ocr-review-source').append(sourceDownload(p.document_ref.id));}
 updateOCRReview();
}
$('antenna-editor').elements.reference_only.onchange=updateOCRReview;
$('new-antenna').addEventListener('click',()=>editOCRReference({}));
$('ocr-refresh').onclick=loadAntennaDocuments;
$('antenna-import-form').onsubmit=async e=>{
 e.preventDefault();if(ocrReading)return;
 const f=e.currentTarget,file=f.elements.file.files[0];if(!file||!f.reportValidity())return;
 if(file.size>8*1024*1024){ocrMessage('資料は8 MiB以下です',true);return;}
 ocrReading=true;$('ocr-submit').disabled=true;ocrMessage('生成AIで資料を読取り中です。完了するまでお待ちください。');
 try{
  const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(Error('資料を読み込めませんでした'));reader.readAsDataURL(file);});
  const doc=await post('/api/antenna-imports',{filename:file.name,media_type:file.type,data_base64:data,source_url:f.elements.source_url.value.trim(),external_processing:f.elements.external_processing.checked});
  showAntennaDocument(doc);f.reset();ocrMessage('読取りが完了しました。候補の原本・単位を確認して登録してください。');
 }catch(e){ocrMessage(e.message,true);}finally{ocrReading=false;await loadAntennaDocuments();}
};
loadAntennaDocuments();
