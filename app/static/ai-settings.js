'use strict';
let aiSettings=null,aiLoading=false,aiModelRequest=0;
const aiLabels={openai:'OpenAI / ChatGPT',claude:'Claude',gemini:'Gemini',local:'Local LLM'};
const keyGuides={
 openai:{url:'https://platform.openai.com/api-keys',steps:['OpenAI Platformへログインし、使用するプロジェクトを選択します。','API keysでCreate new secret keyを実行し、キーをコピーします。','APIの請求・利用上限と、使用モデルへのアクセス権を確認します。']},
 claude:{url:'https://platform.claude.com/settings/keys',steps:['Claude Consoleへログインし、Settings → API keysを開きます。','Create keyで名前・有効期限・Linked accountを設定し、発行時のキーをコピーします。','APIの請求設定・利用枠を確認します。組織で権限がない場合は管理者へ依頼します。']},
 gemini:{url:'https://aistudio.google.com/api-keys',steps:['Google AI Studioへログインし、API keysを開きます。','Create API keyで使用するプロジェクトを選び、キーを作成・コピーします。','Gemini API用のキー制限と、プロジェクトの料金・割当を確認します。']},
 local:{url:'https://docs.ollama.com/api/introduction',steps:['OllamaまたはOpenAI互換サーバーを起動し、画像対応モデルを用意します。','ローカル接続先とAPI形式を設定します。Dockerからホストへはhost.docker.internal等を指定します。','認証なしのサーバーではキーは不要です。認証ありの場合はそのサーバーの管理者が設定したキーを入力します。']}
};
function aiMessage(value,error=false){$('ai-message').textContent=value;$('ai-message').classList.toggle('error',error);}
function renderKeyGuide(provider){
 const guide=keyGuides[provider],box=$('ai-key-steps');box.replaceChildren();
 const link=cell('a','キー発行・公式手順を開く');link.href=guide.url;link.target='_blank';link.rel='noopener noreferrer';box.append(link);
 const list=document.createElement('ol');for(const step of guide.steps)list.append(cell('li',step));
 list.append(cell('li','発行したキーを上のAPIキー欄へ貼り付け、モデル一覧を取得してモデルを選び、保存します。'));box.append(list);
 box.append(cell('p','チャットサービスへのログイン情報はAPIキーとして使用しません。APIの利用条件・料金は各社のAPI管理画面で確認してください。'));
}
function renderAIProfile(provider){
 if(!aiSettings)return;const f=$('ai-settings-form'),profile=aiSettings.profiles.find(p=>p.provider===provider);
 ++aiModelRequest;f.elements.provider.value=provider;f.elements.model.value=profile.model;f.elements.api_key.value='';f.elements.clear_api_key.checked=false;
 f.elements.endpoint.value=profile.endpoint;f.elements.protocol.value=profile.protocol||'ollama';
 $('ai-local-endpoint').hidden=$('ai-local-protocol').hidden=provider!=='local';$('ai-model-options').replaceChildren();
 $('ai-key-status').textContent=(profile.key_present?'キー設定済み':'キー未設定')+' · '+({saved:'保存設定',environment:'環境変数',none:'未設定'}[profile.credential_source])+(provider==='local'?' · ローカルはキー省略可':'');
 renderKeyGuide(provider);aiMessage('');
}
async function loadAISettings(){
 try{aiSettings=await api('/api/ai-settings');$('ai-active').textContent='使用中: '+aiLabels[aiSettings.provider]+' / '+(aiSettings.profiles.find(p=>p.provider===aiSettings.provider).model||'—');renderAIProfile(aiSettings.provider);}catch(e){aiMessage(e.message,true);}
}
function aiDraft(){
 const f=$('ai-settings-form'),data={provider:f.elements.provider.value,model:f.elements.model.value.trim(),endpoint:f.elements.endpoint.value.trim(),protocol:f.elements.protocol.value,clear_api_key:f.elements.clear_api_key.checked};
 if(f.elements.api_key.value.trim())data.api_key=f.elements.api_key.value.trim();return data;
}
$('ai-settings-form').elements.provider.onchange=e=>renderAIProfile(e.target.value);
$('ai-settings-form').elements.protocol.onchange=e=>{const field=$('ai-settings-form').elements.endpoint;if(e.target.value==='openai'&&field.value==='http://host.docker.internal:11434')field.value='http://host.docker.internal:1234/v1';};
$('ai-models').onclick=async()=>{
 if(aiLoading)return;aiLoading=true;$('ai-models').disabled=true;const request=++aiModelRequest,provider=$('ai-settings-form').elements.provider.value;aiMessage('モデル一覧を取得中です。');
 try{
  const result=await post('/api/ai-settings/models',aiDraft());if(request!==aiModelRequest||provider!==$('ai-settings-form').elements.provider.value)return;
  const options=$('ai-model-options');options.replaceChildren();for(const m of result.models){const o=new Option(m.label,m.id);o.dataset.userContent='true';options.append(o);}
  aiMessage('接続確認済み · '+result.models.length+' models · '+result.note);
 }catch(e){if(request===aiModelRequest)aiMessage(e.message,true);}finally{aiLoading=false;$('ai-models').disabled=false;}
};
$('ai-settings-form').onsubmit=async e=>{
 e.preventDefault();if(!aiSettings)return;$('ai-save').disabled=true;
 try{const data=aiDraft();data.revision=aiSettings.revision;aiSettings=await post('/api/ai-settings',data);e.target.elements.api_key.value='';await loadAISettings();if(typeof loadAntennaDocuments==='function')await loadAntennaDocuments();aiMessage('AI接続設定を保存しました。');}
 catch(error){aiMessage(error.message,true);}finally{$('ai-save').disabled=false;}
};
$('ai-reload').onclick=loadAISettings;
loadAISettings();
