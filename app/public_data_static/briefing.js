'use strict';
// Space weather daily briefing: generative AI per step, a verification run, and its files. Nothing here publishes.
let brief=null,briefModels={};
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
function renderBriefingStatus(){
 const b=brief,f=b.flags;
 $('briefing-flags').textContent='定時の自動作成 '+(f.scheduler_enabled?'有効（ローカル保存のみ）':'無効')+' · 自動公開 無効 · 一般配信 無効'+(f.auto_publish_requested||f.public_delivery_requested?'（環境変数で公開が指定されていますが、この版には公開機能がありません）':'');
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
  fetch.onclick=async()=>{fetch.disabled=true;try{const r=await api('/ui/api/briefing/models',{provider:p.id});briefModels[p.id]=r.models;datalist(p.id);notice(p.label+'：'+r.models.length+'件のモデルを取得しました。');}catch(e){notice(e.message,true);}finally{fetch.disabled=false;}};
  box.append(fetch);return box;}));
 const providerOptions=kind=>s.providers.filter(p=>kind!=='speech'||p.speech).map(p=>[p.id,p.label]);
 $('briefing-steps').replaceChildren(gridTable(['工程','生成AI','モデル','声の名前'],Object.entries(s.steps).map(([step,c])=>{
  const kind=s.step_kinds[step],choice=select('step-provider-'+step,[...providerOptions(kind),...(step==='review'?[['none','使わない']]:[])],c.provider),model=input('step-model-'+step,c.model,'text','モデル一覧から選ぶか入力');
  const sync=()=>model.setAttribute('list',datalist(choice.value));choice.onchange=sync;sync();
  return [STEP_LABELS[step],choice,model,kind==='speech'?input('step-voice-'+step,c.voice,'text','例: 各社の声の名前'):'—'];})));
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
