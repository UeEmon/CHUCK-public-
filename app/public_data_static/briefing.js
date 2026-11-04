'use strict';
// Space weather daily briefing: generative AI per step, a verification run, and its files. Nothing here publishes.
let brief=null,briefModels={},briefVoices={},briefModelLoads={},briefVoiceFilters={};
const STEP_LABELS={script:'英語の原稿',translate_ja:'日本語への翻訳（音声・字幕）',translate_subtitles:'字幕の翻訳（仏・西・伊・葡・独・韓）',review:'独立レビュー',tts_en:'英語の音声合成',tts_ja:'日本語の音声合成'};
const GATE_LABELS={DATA_COMPLETE:'必須データがそろっている',DATA_FRESH:'必須データが新しい',FACTS_VALID:'数値・時刻・単位の整合',LICENSE_CLEARED:'権利の確認',LANGUAGES_COMPLETE:'8言語の字幕と英日音声',MEDIA_VALID:'動画のトラックと再生',BUDGET_OK:'予算',REVIEW_OK:'生成AIによるレビュー',SCHEDULE_OK:'時刻規則（02:30凍結・03:00締切）',PRODUCTION_INPUT:'実データ（Mockでない）',RELEASE_POLICY:'公開（この版では無効）'};
const CREDENTIALS={saved:'保存済みのキーを使用',environment:'環境変数のキーを使用',none:'未設定'};
const PRICE_FIELDS=[['input','入力'],['output','出力'],['cached_input','キャッシュ入力'],['audio_output','音声出力']];
function utcText(v){return v?String(v).replace('T',' ').replace(/(\.\d+)?(Z|\+00:00)$/,' UTC'):'—';}
function input(name,value,type='text',placeholder=''){const i=document.createElement('input');i.name=name;i.type=type;i.value=value??'';i.placeholder=placeholder;i.autocomplete='off';return i;}
function labelled(text,control){const l=cell('label',text);l.append(control);return l;}
function select(name,options,value){const s=document.createElement('select');s.name=name;for(const [v,t] of options){const o=cell('option',t);o.value=v;s.append(o);}s.value=value;return s;}
function check(name,checked){const c=document.createElement('input');c.type='checkbox';c.name=name;c.checked=!!checked;return c;}
function fileUrl(run,name,download=false){return '/ui/api/briefing/file?'+new URLSearchParams({date:run.run_date_utc,run:run.run_id,name,...(download?{download:'1'}:{})});}
function gateText(g){return g.passed===true?'合格':g.passed===false?'不合格':'対象外';}
function gridTable(headers,rows){const t=document.createElement('table'),head=document.createElement('tr');headers.forEach(v=>head.append(cell('th',v)));t.append(head);for(const values of rows){const tr=document.createElement('tr');for(const v of values){const td=document.createElement('td');if(v instanceof Node)td.append(v);else td.textContent=v??'—';tr.append(td);}t.append(tr);}return t;}
function datalist(provider){let list=$('models-'+provider);if(!list){list=document.createElement('datalist');list.id='models-'+provider;document.body.append(list);}list.replaceChildren(...(briefModels[provider]||[]).map(m=>{const o=document.createElement('option');o.value=m.id;o.label=m.label;return o;}));return list.id;}
const PRIORITY_LABELS=[['precision','精度重視'],['balance','バランス重視'],['cost','コスト重視']];
// Fills providers and models from the generative AIs that have a key. Nothing is saved until 「設定を保存」.
async function recommendSteps(priority,result){
 const form=$('briefing-settings'),keys={};
 for(const p of brief.settings.providers){const v=form.elements['key-'+p.id].value;if(v)keys[p.id]=v;}
 result.textContent='取得しています。';
 try{
  const r=await api('/ui/api/briefing/recommend',{priority,keys,prefer:form.elements['step-provider-script'].value});
  Object.assign(briefModels,r.models);for(const p of Object.keys(r.models))datalist(p);
  for(const [step,c] of Object.entries(r.steps)){
   form.elements['step-provider-'+step].value=c.provider;
   const box=document.querySelector('.model-choice[data-step="'+step+'"]');box.replaceChildren();box.dataset.value=c.model;renderModelChoice(box,c.provider);
  }
  refreshModelChoices();refreshVoiceChoices();
  const label=s=>STEP_LABELS[s],used=Object.keys(r.models).map(p=>brief.settings.providers.find(x=>x.id===p).label);
  const parts=[used.length?'次の生成AIから設定しました：'+used.join('、')+'。':'APIキーのある生成AIがありません。'];
  if(r.unfilled.length)parts.push('合うモデルが見つからない工程：'+r.unfilled.map(label).join('、')+'。');
  if(Object.keys(r.skipped).length)parts.push('一覧を取得できなかった生成AI：'+Object.entries(r.skipped).map(([p,e])=>brief.settings.providers.find(x=>x.id===p).label+'（'+e+'）').join('、')+'。');
  if(Object.keys(r.steps).some(st=>brief.settings.step_kinds[st]==='speech'))parts.push('音声合成の「声の名前」を選んでください。');
  parts.push('内容を確認して「設定を保存」を押してください。');
  result.textContent=parts.join(' ');
 }catch(e){result.textContent=e.message;notice(e.message,true);}
}
// The voice of a speech step: Gemini's own voice list, OpenAI's documented list, or typed in (local LLM, or a new voice).
function voiceKey(provider,model){return provider==='openai'?provider+'/'+model:provider;}
function loadVoices(provider,model){
 const key=voiceKey(provider,model);
 if(!briefVoices[key]){const typed=$('briefing-settings').elements['key-'+provider]?.value;
  briefVoices[key]=api('/ui/api/briefing/voices',{provider,model,...(typed?{api_key:typed}:{})}).catch(e=>{delete briefVoices[key];throw e;});}
 return briefVoices[key];
}
function renderVoiceChoice(box){
 const step=box.dataset.step,name='step-voice-'+step,current=box.querySelector('[name]')?.value??box.dataset.value,form=$('briefing-settings');
 const provider=form.elements['step-provider-'+step].value,model=form.elements['step-model-'+step]?.value||'',typedIn=(v=current)=>{const i=input(name,v,'text','声の名前を入力');box.replaceChildren(i);return i;};
 if(provider==='local'){typedIn();return;}
 const i=typedIn(),hint=cell('span','声の一覧を取得しています。');hint.className='hint';box.append(hint);
 loadVoices(provider,model).then(r=>{
  if(!box.isConnected||form.elements['step-provider-'+step].value!==provider)return;
  const now=box.querySelector('[name]').value;
  if(!r.voices.length){hint.textContent='声の一覧がありません。名前を入力してください。';return;}
  const filters=voiceFilters(r.voices,STEP_LANGS[step]),fsel=filters.length>1?select('',filters.map(f=>[f.key,f.label]),''):null;
  if(fsel){fsel.removeAttribute('name');fsel.title='声の言語で絞り込む';fsel.value=filters.some(f=>f.key===briefVoiceFilters[step])?briefVoiceFilters[step]:filters[0].key;}
  const sel=select(name,[],''),manual=cell('button','手入力');manual.type='button';
  const fill=()=>{const keep=sel.value||now,f=fsel?filters.find(f=>f.key===fsel.value):null,shown=f?r.voices.filter(f.test):r.voices;
   const options=[['','選んでください'],...shown.map(v=>[v.id,v.label&&v.label!==v.id?v.id+'（'+v.label+'）':v.id])];
   if(keep&&!shown.some(v=>v.id===keep))options.push([keep,keep+(r.voices.some(v=>v.id===keep)?'（絞り込みの外）':'（一覧にありません）')]);
   sel.replaceChildren(...options.map(([v,t])=>{const o=cell('option',t);o.value=v;return o;}));sel.value=keep||'';};
  if(fsel)fsel.onchange=()=>{briefVoiceFilters[step]=fsel.value;fill();};
  fill();
  manual.onclick=()=>{const t=typedIn(sel.value);t.focus();};
  const note=cell('span',r.source==='document'?'公式資料の一覧（'+r.checked_on+'確認）':'');note.className='hint';
  box.replaceChildren(...(fsel?[fsel]:[]),sel,manual,note);
 },e=>{if(box.isConnected)hint.textContent=e.message;});
}
// Voice IDs such as ja-jp-advisor-1 name their language and region; short names (charon, kore …) have none and read any language.
const STEP_LANGS={tts_en:'en',tts_ja:'ja'};
function voiceFilters(voices,lang){
 const tag=v=>/^([a-z]{2,3})-([a-z]{2,4})-/i.exec(v.id),common=v=>!tag(v),code=v=>tag(v)?.[1].toLowerCase(),region=v=>tag(v)?.[2].toLowerCase();
 if(!voices.some(tag))return [];
 const out=[],add=(key,label,test)=>{const n=voices.filter(test).length;if(n)out.push({key,label:label.replace('{n}',n),test});};
 const langs=[...new Set(voices.filter(tag).map(code))].sort(),mine=langs.includes(lang)?lang:null;
 if(mine){
  add(mine,mine+'（全地域）と共通の声：{n}件',v=>common(v)||code(v)===mine);
  for(const reg of [...new Set(voices.filter(v=>code(v)===mine).map(region))].sort())add(mine+'-'+reg,'地域 '+mine+'-'+reg+'：{n}件',v=>code(v)===mine&&region(v)===reg);
 }
 add('common','共通の声（言語の指定なし）：{n}件',common);
 for(const l of langs)if(l!==mine)add(l,l+'（全地域）と共通の声：{n}件',v=>common(v)||code(v)===l);
 add('all','すべての言語：{n}件',()=>true);
 return out;
}
function refreshVoiceChoices(){for(const box of document.querySelectorAll('.voice-choice'))renderVoiceChoice(box);}
// The model of a step: a list to choose from once the provider's models are fetched, otherwise typed in.
function renderModelChoice(box,provider){
 const name='step-model-'+box.dataset.step,current=box.querySelector('[name]')?.value??box.dataset.value;
 // By default only the current models of the step's kind (text or speech); the checkbox shows the whole list.
 const all=document.querySelector('[name="models-all"]')?.checked,models=(briefModels[provider]||[]).filter(m=>all||m.current&&m.kind===box.dataset.kind);
 if(provider==='none'){box.replaceChildren(cell('span','—'),Object.assign(input(name,''),{type:'hidden'}));return;}
 const typeIn=v=>{const i=input(name,v,'text','モデルIDを入力');i.setAttribute('list',datalist(provider));box.replaceChildren(i);return i;};
 if(!models.length&&!briefModelLoads[provider]){const i=typeIn(current);i.placeholder='「モデル一覧を取得」を押すか入力';return;}
 if(!models.length){
  // Still loading, or the list could not be fetched: keep a list holding the current choice and say why.
  const s=select(name,current?[[current,current]]:[['','選んでください']],current||''),manual=cell('button','手入力'),why=cell('span',briefModelLoads[provider]==='loading'?'モデル一覧を取得しています。':'モデル一覧を取得できませんでした。');
  manual.type='button';manual.onclick=()=>typeIn(s.value).focus();why.className='hint';box.replaceChildren(s,manual,why);return;}
 const options=[['','選んでください'],...models.map(m=>[m.id,m.label&&m.label!==m.id?m.id+'（'+m.label+'）':m.id])];
 if(current&&!models.some(m=>m.id===current))options.push([current,current+'（一覧にありません）']);
 const s=select(name,options,current||''),manual=cell('button','手入力');manual.type='button';
 manual.onclick=()=>typeIn(s.value).focus();
 box.replaceChildren(s,manual);
}
// The model lists of the providers that already have a key (or a local endpoint) are fetched when the page opens,
// so that each step offers a list from the start. A failure is shown next to the provider's fetch button.
function autoLoadModels(){
 for(const p of brief.settings.providers){
  if(briefModels[p.id]||briefModelLoads[p.id]==='loading'||!(p.credential!=='none'||p.id==='local'&&p.endpoint))continue;
  briefModelLoads[p.id]='loading';
  api('/ui/api/briefing/models',{provider:p.id}).then(r=>{briefModels[p.id]=r.models;briefModelLoads[p.id]='done';datalist(p.id);refreshModelChoices();refreshVoiceChoices();},
   e=>{briefModelLoads[p.id]='failed';const out=$('models-result-'+p.id);if(out)out.textContent=e.message;refreshModelChoices();});
 }
 refreshModelChoices();
}
function refreshModelChoices(){for(const box of document.querySelectorAll('.model-choice'))renderModelChoice(box,document.querySelector('[name="step-provider-'+box.dataset.step+'"]').value);}
function renderBriefingStatus(){
 const b=brief,f=b.flags;
 $('briefing-flags').textContent='定時の自動作成 '+(f.scheduler_enabled?'有効':'無効')+' · CHUCKへの自動公開 '+(f.auto_publish_enabled?'有効（定時の実行が全検査に合格したときだけ）':'無効')+' · 他のサービスへの配信 なし';
 const pub=$('briefing-published');
 pub.replaceChildren(b.published.length?gridTable(['対象日','実行','公開','',''],b.published.map(m=>{const off=cell('button','取り下げる');off.type='button';
  off.onclick=async()=>{off.disabled=true;try{brief=await api('/ui/api/briefing/unpublish',{date:m.run_date_utc});renderBriefingStatus();notice(m.run_date_utc+'の公開を取り下げました。');}catch(e){notice(e.message,true);off.disabled=false;}};
  return [m.run_date_utc,m.run_id,utcText(m.published_at),cell('span','CHUCKの宇宙天気タブに表示中'),off];})):cell('p','CHUCKに公開中のブリーフィングはありません。'));
 const lines=['現在 '+utcText(b.now)+' · '+b.phase,'凍結 '+utcText(b.timetable.freeze)+' · 締切 '+utcText(b.timetable.deadline)];
 if(b.running)lines.push('作成中です（'+b.running.mode+'、'+b.running.run_date+'、'+(b.state||'')+'）。');
 if(b.last_error)lines.push('前回の失敗 '+utcText(b.last_error.at)+'：'+b.last_error.error);
 const problems=Object.entries(b.settings.problems);if(problems.length)lines.push('未設定の工程：'+problems.map(([k,v])=>STEP_LABELS[k]+'（'+v+'）').join('、'));
 $('briefing-state').textContent=lines.join(' ');
 $('briefing-run').querySelector('button').disabled=!!b.running;
 const run=b.latest;$('briefing-result').hidden=!run;
 if(run){
  $('briefing-summary').textContent=run.run_date_utc+' · '+run.mode+' · '+run.release_state+(run.hold_reasons.length?'（保留の理由 '+run.hold_reasons.join(', ')+'）':'')+' · 公開 なし · 完了 '+utcText(run.finished_at);
  $('briefing-gates').replaceChildren(gridTable(['品質ゲート','内容','結果','詳細'],Object.entries(run.quality_gates).map(([k,g])=>{const r=cell('span',gateText(g));r.className=g.passed===false?'gate-fail':g.passed?'gate-pass':'';return [k,GATE_LABELS[k],r,Array.isArray(g.detail)?g.detail.join(' / '):g.detail];})));
  const c=run.cost,usd=v=>v==null?'—':'$'+Number(v).toFixed(6);
  $('briefing-cost').replaceChildren(gridTable(['API呼び出し','キャッシュ利用','実測トークン（入力/出力/音声）','実測使用量から計算した費用','推定費用（テキスト）','注記'],[[c.api_calls,c.cache_hits,c.metered_tokens?[c.metered_tokens.input_tokens,c.metered_tokens.output_tokens,c.metered_tokens.audio_output_tokens].map(v=>v??'—').join(' / '):'未計測',usd(c.calculated_usd_from_measured_usage),usd(c.estimated_text_usd),c.calculated_cost_note]]),
   gridTable(['工程','生成AI','モデル','状態','使用量','秒'],Object.values(run.calls.reduce((groups,x)=>{const key=[x.step,x.provider,x.model_id,x.status,x.usage_kind].join('|'),g=groups[key]||={...x,count:0,duration_seconds:0};g.count++;g.duration_seconds+=x.duration_seconds||0;return groups;},{})).map(x=>[(STEP_LABELS[x.step]||x.step)+(x.count>1?' ×'+x.count:''),x.provider,x.model_id,x.status,x.usage_kind,x.duration_seconds?x.duration_seconds.toFixed(1):'—'])));
  const video=run.files.find(n=>n.endsWith('.mp4')),player=$('briefing-video');player.hidden=!video;
  if(video&&player.dataset.run!==run.run_id){player.dataset.run=run.run_id;player.src=fileUrl(run,video);}
  const links=run.files.filter(n=>!n.endsWith('.wav')).map(n=>{const a=cell('a',n);a.href=fileUrl(run,n,true);a.download=n.split('/').pop();return a;});
  const audio=run.files.filter(n=>n.endsWith('.wav')).map(n=>{const box=cell('label',n==='audio_en.wav'?'英語の音声':'日本語の音声'),a=document.createElement('audio');a.controls=true;a.preload='none';a.src=fileUrl(run,n);box.append(a);return box;});
  $('briefing-files').replaceChildren(...audio,...links);
 }
 $('briefing-history').replaceChildren(gridTable(['対象日','実行','方式','結果','保留の理由','完了'],b.history.map(h=>[h.run_date_utc,h.run_id,h.mode,h.release_state,(h.hold_reasons||[]).join(', '),utcText(h.finished_at)])));
}
function renderBriefingForm(){
 const s=brief.settings,form=$('briefing-settings');
 $('briefing-providers').replaceChildren(...s.providers.map(p=>{
  const box=document.createElement('fieldset'),legend=cell('legend',p.label),fetch=cell('button','モデル一覧を取得');fetch.type='button';
  box.append(legend,cell('p',CREDENTIALS[p.credential]),labelled('APIキー',input('key-'+p.id,'','password',p.id==='local'?'必要な場合だけ':'')));
  if(p.credential==='saved')box.append(labelled(' 保存済みのキーを削除する',check('clear-'+p.id,false)));
  if(p.id==='local')box.append(labelled('接続先URL',input('endpoint-local',p.endpoint)),labelled('方式',select('protocol-local',[['ollama','Ollama'],['openai','OpenAI互換']],p.protocol)));
  const result=cell('span','');result.className='hint';result.id='models-result-'+p.id;
  fetch.onclick=async()=>{fetch.disabled=true;result.textContent='取得しています。';try{const typed=form.elements['key-'+p.id].value;const r=await api('/ui/api/briefing/models',{provider:p.id,...(typed?{api_key:typed}:{})});briefModels[p.id]=r.models;datalist(p.id);refreshModelChoices();refreshVoiceChoices();result.textContent=r.models.length+'件のモデルを取得しました。工程ごとの欄から選べます。';notice(p.label+'：'+r.models.length+'件のモデルを取得しました。');}catch(e){result.textContent=e.message;notice(e.message,true);}finally{fetch.disabled=false;}};
  box.append(fetch,result);return box;}));
 const providerOptions=kind=>s.providers.filter(p=>kind!=='speech'||p.speech).map(p=>[p.id,p.label]);
 const priority=select('recommend-priority',PRIORITY_LABELS,'balance'),recommend=cell('button','推奨の組み合わせを設定'),advice=cell('p','');
 recommend.type='button';advice.className='hint';recommend.onclick=async()=>{recommend.disabled=true;try{await recommendSteps(priority.value,advice);}finally{recommend.disabled=false;}};
 const all=check('models-all',false);all.onchange=refreshModelChoices;
 const tools=document.createElement('div');tools.className='recommend';const lead=cell('span','原稿と翻訳には、原稿の欄で選んでいる生成AIを使います。');lead.className='hint';
 tools.append(labelled('重視する点 ',priority),recommend,lead,labelled(' 現行以外のモデルも表示する',all));
 $('briefing-steps').replaceChildren(tools,advice,gridTable(['工程','生成AI','モデル','声の名前'],Object.entries(s.steps).map(([step,c])=>{
  const kind=s.step_kinds[step],choice=select('step-provider-'+step,[...providerOptions(kind),...(step==='review'?[['none','使わない']]:[])],c.provider),model=document.createElement('span');
  model.className='model-choice';model.dataset.step=step;model.dataset.kind=kind;model.dataset.value=c.model||'';
  const voice=document.createElement('span');voice.className='voice-choice';voice.dataset.step=step;voice.dataset.value=c.voice||'';
  choice.onchange=()=>{renderModelChoice(model,choice.value);if(kind==='speech')renderVoiceChoice(voice);};renderModelChoice(model,choice.value);
  if(kind==='speech')model.onchange=()=>renderVoiceChoice(voice);
  return [STEP_LABELS[step],choice,model,kind==='speech'?voice:'—'];})));
 refreshVoiceChoices();autoLoadModels();
 const names=[...new Set([...Object.values(s.steps).filter(c=>c.provider!=='none'&&c.model).map(c=>c.provider+'/'+c.model),...Object.keys(s.pricing)])];
 $('briefing-pricing').replaceChildren(names.length?gridTable(['生成AI/モデル',...PRICE_FIELDS.map(f=>f[1]),'料金表のURL','確認日'],names.map(n=>{const row=s.pricing[n]||{};return [n,...PRICE_FIELDS.map(([f])=>input('price-'+f+'-'+n,row[f]??'','text','—')),input('price-source_url-'+n,row.source_url,'url','https://'),input('price-checked_on-'+n,row.checked_on,'date')];})):cell('p','工程にモデルを設定すると、ここに料金の入力欄が出ます。'));
 form.elements.budget.value=s.budget_usd_per_run??'';form.elements.video_length.value=s.length;form.elements.resolution.value=s.resolution;
 $('briefing-rights').replaceChildren(gridTable(['データ','必須','公開に使える','外部AIへ送れる','根拠のURL','決定'],Object.entries(brief.catalog).map(([k,c])=>{const r=brief.rights[k];return [c.label,c.required?'必須':'任意',check('right-public-'+k,r.public),check('right-ai-'+k,r.external_ai),input('right-url-'+k,r.source==='administrator'?r.evidence_url:'','url',c.rights_evidence_url),r.source==='administrator'?'管理者':'既定'];})));
}
async function refreshBriefing(form=true){try{brief=await api('/ui/api/briefing');renderBriefingStatus();if(form)renderBriefingForm();}catch(e){notice(e.message,true);}}
$('briefing-settings').onsubmit=async e=>{
 e.preventDefault();const f=e.currentTarget.elements,s=brief.settings,data={revision:s.revision,providers:{},steps:{},pricing:{},rights:{},length:f.video_length.value,resolution:f.resolution.value,budget_usd_per_run:f.budget.value.trim()||null};
 for(const p of s.providers){const change={};if(f['key-'+p.id].value)change.api_key=f['key-'+p.id].value;if(f['clear-'+p.id]?.checked)change.clear_api_key=true;if(p.id==='local'){change.endpoint=f['endpoint-local'].value;change.protocol=f['protocol-local'].value;}data.providers[p.id]=change;}
 for(const step of Object.keys(s.steps)){data.steps[step]={provider:f['step-provider-'+step].value,model:f['step-model-'+step].value};if(f['step-voice-'+step])data.steps[step].voice=f['step-voice-'+step].value;}
 for(const el of e.currentTarget.querySelectorAll('[name^="price-input-"]')){const n=el.name.slice('price-input-'.length),row={};for(const [k] of PRICE_FIELDS)row[k]=f['price-'+k+'-'+n].value.trim()||null;row.source_url=f['price-source_url-'+n].value.trim();row.checked_on=f['price-checked_on-'+n].value;if(Object.values(row).some(v=>v))data.pricing[n]=row;}
 for(const k of Object.keys(brief.catalog)){const url=f['right-url-'+k].value.trim();if(url)data.rights[k]={public:f['right-public-'+k].checked,external_ai:f['right-ai-'+k].checked,evidence_url:url};}
 try{brief=await api('/ui/api/briefing/settings',data);renderBriefingStatus();renderBriefingForm();notice('ブリーフィングの設定を保存しました。');}catch(e){notice(e.message,true);}
};
$('briefing-run').onsubmit=async e=>{e.preventDefault();const f=e.currentTarget.elements;try{brief=await api('/ui/api/briefing/run',{mode:f.mode.value,date:f.date.value});renderBriefingStatus();notice('ブリーフィングの作成を始めました。公開はしません。');}catch(err){notice(err.message,true);}};
$('briefing-test').onclick=async()=>{const b=$('briefing-test');b.disabled=true;try{const r=await api('/ui/api/briefing/test',{});notice('接続試験：'+Object.entries(r.providers).map(([k,v])=>k+' '+v.result).join('、')+'（結果はbriefing/connection_report.mdにも保存しました）');}catch(e){notice(e.message,true);}finally{b.disabled=false;}};
$('briefing-run').elements.date.value=new Date().toISOString().slice(0,10);
// The form is filled once and after saving, so periodic updates never erase what the administrator is typing.
const refreshFetcher=refresh;refresh=async()=>{await refreshFetcher();if(!$('management').hidden)await refreshBriefing(brief===null);};
setInterval(()=>{if(brief?.running&&!document.hidden)refreshBriefing(false);},4000);
