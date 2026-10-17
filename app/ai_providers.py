"""Per-provider credentials, model discovery and bounded JSON HTTP adapters."""
import copy
import json
import os
from pathlib import Path
import re
import tempfile
import threading
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit, quote, urlencode
from urllib.request import Request, build_opener, HTTPRedirectHandler, ProxyHandler
from engine import InputError

PROVIDERS=('openai','claude','gemini','local')
LABELS=dict(openai='OpenAI / ChatGPT',claude='Claude',gemini='Gemini',local='Local LLM')
KEYS=dict(openai=('OPENAI_API_KEY',),claude=('ANTHROPIC_API_KEY',),gemini=('GEMINI_API_KEY','GOOGLE_API_KEY'),local=('LOCAL_LLM_API_KEY',))
MODELS=dict(openai='HF_ANTENNA_OCR_MODEL',claude='ANTHROPIC_MODEL',gemini='GEMINI_MODEL',local='LOCAL_LLM_MODEL')
SETTINGS_LOCK=threading.RLock()

class AIError(RuntimeError):pass
class SettingsConflict(RuntimeError):pass

def provider_id(value):
    if not isinstance(value,str) or value not in PROVIDERS:raise InputError('AI provider is invalid')
    return value

def string(value,limit,label,empty=True):
    if not isinstance(value,str) or len(value)>limit or not value.isprintable() and value!='' or (not empty and not value.strip()):raise InputError(label+' is invalid')
    return value.strip()

def local_endpoint(value):
    value=string(value,512,'endpoint',False).rstrip('/')
    u=urlsplit(value)
    try:port=u.port
    except ValueError:raise InputError('Local endpoint port is invalid')
    if u.scheme not in ('http','https') or not u.hostname or u.username or u.password or u.query or u.fragment or any(c.isspace() for c in value):raise InputError('Local endpoint must be an HTTP(S) URL without credentials/query')
    return value

class AISettings:
    def __init__(self,path=None):self.path=Path(path) if path else Path(os.environ.get('DATA_DIR','./data'))/'ai-settings.json'
    def read(self):
        if not self.path.exists():return dict(revision=0,provider=provider_id(os.environ.get('HF_ANTENNA_OCR_PROVIDER','openai')),profiles={})
        try:
            value=json.loads(self.path.read_text())
            if not isinstance(value,dict) or type(value.get('revision')) is not int or not isinstance(value.get('profiles'),dict):raise ValueError()
            provider_id(value.get('provider'));return value
        except (ValueError,TypeError):raise AIError('AI settings file is invalid') from None
    def resolve(self,provider=None,overrides=None):
        with SETTINGS_LOCK:state=self.read()
        provider=provider_id(provider or state['provider']);saved=state['profiles'].get(provider,{})
        env_key=next((os.environ[k].strip() for k in KEYS[provider] if os.environ.get(k,'').strip()),'')
        saved_key=saved.get('api_key','')
        cfg=dict(provider=provider,model=saved.get('model',os.environ.get(MODELS[provider],'')),
                 api_key=saved_key or env_key,credential_source='saved' if saved_key else 'environment' if env_key else 'none',
                 endpoint=saved.get('endpoint',os.environ.get('LOCAL_LLM_BASE_URL','http://host.docker.internal:11434')) if provider=='local' else '',
                 protocol=saved.get('protocol',os.environ.get('LOCAL_LLM_PROTOCOL','ollama')) if provider=='local' else '')
        if overrides is not None:
            if not isinstance(overrides,dict):raise InputError('AI settings object required')
            for key in ('model','endpoint','protocol'):
                if key in overrides:cfg[key]=overrides[key]
            if overrides.get('clear_api_key') is True:cfg.update(api_key=env_key,credential_source='environment' if env_key else 'none')
            if overrides.get('api_key'):cfg.update(api_key=overrides['api_key'],credential_source='saved')
        cfg['model']=string(cfg['model'],200,'model')
        if cfg['model'] and not re.fullmatch(r'[A-Za-z0-9_.:/@+\-]+',cfg['model']):raise InputError('Model ID is invalid')
        cfg['api_key']=string(cfg['api_key'],4096,'API key')
        if any(ord(ch)>126 for ch in cfg['api_key']):raise InputError('API key must be ASCII')
        if provider=='local':
            cfg['endpoint']=local_endpoint(cfg['endpoint'])
            if cfg['protocol'] not in ('ollama','openai'):raise InputError('Local protocol is invalid')
        else:cfg.update(endpoint='',protocol='')
        cfg['configured']=bool(cfg['model'] and (cfg['api_key'] or provider=='local'))
        return cfg
    def snapshot(self):
        with SETTINGS_LOCK:
            state=self.read();profiles=[]
            for p in PROVIDERS:
                cfg=self.resolve(p)
                profiles.append({k:v for k,v in cfg.items() if k!='api_key'}|dict(key_present=bool(cfg['api_key']),label=LABELS[p]))
            return dict(revision=state['revision'],provider=state['provider'],profiles=profiles)
    def save(self,data):
        if not isinstance(data,dict) or type(data.get('revision')) is not int:raise InputError('Settings revision required')
        provider=provider_id(data.get('provider'))
        if 'clear_api_key' in data and type(data['clear_api_key']) is not bool:raise InputError('clear_api_key must be boolean')
        with SETTINGS_LOCK:
            state=self.read()
            if data['revision']!=state['revision']:raise SettingsConflict('AI settings changed; reload before saving')
            cfg=self.resolve(provider,data);profile=copy.deepcopy(state['profiles'].get(provider,{}))
            for k in ('model','endpoint','protocol'):profile[k]=cfg[k]
            if data.get('clear_api_key'):profile.pop('api_key',None)
            if data.get('api_key'):profile['api_key']=cfg['api_key']
            state['profiles'][provider]=profile;state.update(provider=provider,revision=state['revision']+1)
            self.path.parent.mkdir(parents=True,exist_ok=True)
            descriptor,name=tempfile.mkstemp(prefix='.ai-settings-',dir=self.path.parent)
            try:
                with os.fdopen(descriptor,'w') as f:
                    os.fchmod(f.fileno(),0o600);json.dump(state,f,ensure_ascii=False);f.flush();os.fsync(f.fileno())
                os.replace(name,self.path)
            finally:
                if os.path.exists(name):os.unlink(name)
            return self.snapshot()

SETTINGS=AISettings()

class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self,*args,**kwargs):return None

def request_json(cfg,url,payload=None,timeout=120):
    headers={'Content-Type':'application/json'}
    if cfg['provider']=='claude':headers.update({'x-api-key':cfg['api_key'],'anthropic-version':'2023-06-01'})
    elif cfg['provider']=='gemini':headers['x-goog-api-key']=cfg['api_key']
    elif cfg['api_key']:headers['Authorization']='Bearer '+cfg['api_key']
    req=Request(url,data=None if payload is None else json.dumps(payload).encode(),headers=headers,method='GET' if payload is None else 'POST')
    handlers=[NoRedirect()]
    if cfg['provider']=='local':handlers.append(ProxyHandler({}))
    try:
        with build_opener(*handlers).open(req,timeout=timeout) as response:body=response.read(2*1024*1024+1)
        if len(body)>2*1024*1024:raise AIError('AI response exceeds limit')
        result=json.loads(body)
        if not isinstance(result,dict):raise ValueError()
        return result
    except HTTPError as error:raise AIError('AI API error (HTTP '+str(error.code)+')') from None
    except (URLError,TimeoutError,OSError):raise AIError('AI connection failed / timed out') from None
    except (ValueError,TypeError):raise AIError('AI response is invalid') from None

def list_models(cfg):
    p=cfg['provider']
    if not cfg['api_key'] and p!='local':raise AIError('APIキーを設定してください')
    models=[];cursor=None
    for _ in range(20):
        if p=='openai':url='https://api.openai.com/v1/models'
        elif p=='claude':url='https://api.anthropic.com/v1/models?'+urlencode(dict(limit=100,**({'after_id':cursor} if cursor else {})))
        elif p=='gemini':url='https://generativelanguage.googleapis.com/v1beta/models?'+urlencode(dict(pageSize=100,**({'pageToken':cursor} if cursor else {})))
        else:url=cfg['endpoint']+('/api/tags' if cfg['protocol']=='ollama' else '/models')
        result=request_json(cfg,url,timeout=30)
        rows=result.get('models' if p=='gemini' or p=='local' and cfg['protocol']=='ollama' else 'data')
        if not isinstance(rows,list):raise AIError('Model list is invalid')
        for row in rows:
            if not isinstance(row,dict):raise AIError('Model list is invalid')
            if p=='gemini' and 'generateContent' not in row.get('supportedGenerationMethods',[]):continue
            mid=row.get('name') if p=='gemini' or p=='local' and cfg['protocol']=='ollama' else row.get('id')
            if p=='gemini' and isinstance(mid,str):mid=mid.removeprefix('models/')
            try:mid=string(mid,200,'model',False)
            except InputError:continue
            if re.fullmatch(r'[A-Za-z0-9_.:/@+\-]+',mid):models.append(dict(id=mid,label=string(row.get('display_name',row.get('displayName',mid)),300,'model label')))
        next_cursor=result.get('last_id') if p=='claude' and result.get('has_more') else result.get('nextPageToken') if p=='gemini' else None
        if not next_cursor or next_cursor==cursor:break
        cursor=next_cursor
    return dict(provider=p,models=list({m['id']:m for m in models}.values()),note='モデル一覧はOCR対応を保証しません。画像・構造化出力対応を確認してください。')

def extract_json(cfg,name,mime,raw,prompt,schema):
    p=cfg['provider'];model=cfg['model'];encoded=__import__('base64').b64encode(raw).decode('ascii')
    if not cfg['configured']:raise AIError('AI設定で接続先・キー・モデルを設定してください')
    if p=='openai':
        uri='data:'+mime+';base64,'+encoded
        attachment=dict(type='input_file',filename=name,file_data=uri) if mime=='application/pdf' else dict(type='input_image',image_url=uri,detail='high')
        payload=dict(model=model,store=False,instructions=prompt,max_output_tokens=10000,input=[dict(role='user',content=[dict(type='input_text',text='Extract antenna specifications.'),attachment])],text=dict(format=dict(type='json_schema',name='antenna_catalog',strict=True,schema=schema)))
        response=request_json(cfg,'https://api.openai.com/v1/responses',payload)
        if response.get('status')!='completed':raise AIError('AIの読取りが完了しませんでした')
        output=''.join(c['text'] for m in response.get('output',[]) if m.get('type')=='message' for c in m.get('content',[]) if c.get('type')=='output_text')
    elif p=='claude':
        attachment=dict(type='document' if mime=='application/pdf' else 'image',source=dict(type='base64',media_type=mime,data=encoded))
        payload=dict(model=model,max_tokens=10000,system=prompt,messages=[dict(role='user',content=[attachment,dict(type='text',text='Extract antenna specifications.')])],output_config=dict(format=dict(type='json_schema',schema=schema)))
        response=request_json(cfg,'https://api.anthropic.com/v1/messages',payload)
        if response.get('stop_reason')!='end_turn':raise AIError('AIの読取りが完了しませんでした')
        output=''.join(c['text'] for c in response.get('content',[]) if c.get('type')=='text')
    elif p=='gemini':
        payload=dict(systemInstruction=dict(parts=[dict(text=prompt)]),contents=[dict(role='user',parts=[dict(text='Extract antenna specifications.'),dict(inlineData=dict(mimeType=mime,data=encoded))])],generationConfig=dict(responseMimeType='application/json',responseJsonSchema=schema,maxOutputTokens=10000))
        response=request_json(cfg,'https://generativelanguage.googleapis.com/v1beta/models/'+quote(model,safe='')+':generateContent',payload)
        candidates=response.get('candidates',[])
        if not candidates or candidates[0].get('finishReason')!='STOP':raise AIError('AIの読取りが完了しませんでした')
        output=''.join(c.get('text','') for c in candidates[0].get('content',{}).get('parts',[]) if not c.get('thought'))
    else:
        if mime=='application/pdf':raise InputError('ローカルLLMにはPDFをページ画像に変換して取り込んでください')
        if cfg['protocol']=='ollama':
            payload=dict(model=model,stream=False,format=schema,messages=[dict(role='system',content=prompt),dict(role='user',content='Extract antenna specifications.',images=[encoded])],options=dict(num_predict=10000))
            response=request_json(cfg,cfg['endpoint']+'/api/chat',payload)
            if response.get('done') is not True or response.get('done_reason')=='length':raise AIError('AIの読取りが完了しませんでした')
            output=response.get('message',{}).get('content','')
        else:
            payload=dict(model=model,stream=False,max_tokens=10000,messages=[dict(role='system',content=prompt),dict(role='user',content=[dict(type='text',text='Extract antenna specifications.'),dict(type='image_url',image_url=dict(url='data:'+mime+';base64,'+encoded))])],response_format=dict(type='json_schema',json_schema=dict(name='antenna_catalog',strict=True,schema=schema)))
            response=request_json(cfg,cfg['endpoint']+'/chat/completions',payload)
            choices=response.get('choices',[])
            if not choices or choices[0].get('finish_reason')!='stop':raise AIError('AIの読取りが完了しませんでした')
            output=choices[0].get('message',{}).get('content','')
    try:return json.loads(output)
    except (ValueError,TypeError):raise AIError('AIの読取結果が不正です') from None
