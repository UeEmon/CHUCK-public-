"""Generative AI for the space weather daily briefing: API settings, per-step choice and metered calls.

The administrator sets up to four APIs on the public-data admin page (Gemini, OpenAI, Claude and a
local LLM) and picks one API and model for each production step. Model IDs, voices and prices are
never built in: they are entered or chosen from the provider's own model list, so a retired or
made-up model is never assumed. Keys are kept in the public-data volume (mode 0600) and never shown.

Every call returns a record of what the provider itself reported (token usage, request ID, time).
Values the provider did not report stay None; they are never filled with 0 or with an estimate.
"""
import base64
import copy
import io
import json
import os
from pathlib import Path
import re
import tempfile
import threading
import time
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode, urlsplit
from urllib.request import HTTPRedirectHandler, ProxyHandler, Request, build_opener
import wave

PROVIDERS = ('gemini', 'openai', 'claude', 'local')
LABELS = {'gemini': 'Gemini (Google)', 'openai': 'OpenAI', 'claude': 'Claude (Anthropic)', 'local': 'Local LLM'}
ENV_KEYS = {'openai': ('OPENAI_API_KEY',), 'claude': ('ANTHROPIC_API_KEY',), 'gemini': ('GEMINI_API_KEY', 'GOOGLE_API_KEY'),
            'local': ('LOCAL_LLM_API_KEY',)}
# Production steps and the kind of API each needs. "review" may be switched off ("none").
STEPS = {
    'script': 'text',               # English structured script
    'translate_ja': 'text',         # Japanese narration (also the Japanese subtitles)
    'translate_subtitles': 'text',  # fr, es, it, pt, de, ko subtitles
    'review': 'text',               # independent AI review; the deciding checks are deterministic code
    'tts_en': 'speech',
    'tts_ja': 'speech',
}
# Claude has no speech API, and Ollama none either: those choices are refused, not silently replaced.
SPEECH_PROVIDERS = ('gemini', 'openai', 'local')
DEFAULT_STEPS = {'script': 'gemini', 'translate_ja': 'gemini', 'translate_subtitles': 'gemini', 'review': 'openai',
                 'tts_en': 'gemini', 'tts_ja': 'gemini'}
MODEL = re.compile(r'[A-Za-z0-9_.:/@+\-]{1,200}')
VOICE = re.compile(r'[A-Za-z0-9_.\-]{1,64}')
# How each voice is asked to read (briefing_languages.json keeps the language texts).
SPEECH_STYLE = json.loads((Path(__file__).parent / 'briefing_languages.json').read_text(encoding='utf-8'))['speech_style']
PRICE_FIELDS = ('input', 'output', 'cached_input', 'audio_output')
MAX_TEXT = 2_000_000
MAX_AUDIO = 40_000_000


class AIError(RuntimeError):
    """A failed call; .call keeps the provider's usage record when the provider answered (failures can cost too)."""
    def __init__(self, message, call=None):
        super().__init__(message)
        self.call = call


class SettingsConflict(ValueError):
    pass


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def endpoint(value):
    value = value.strip().rstrip('/') if isinstance(value, str) else ''
    u = urlsplit(value)
    try:
        u.port
    except ValueError:
        raise ValueError('ローカルLLMの接続先URLが不正です') from None
    if (u.scheme not in ('http', 'https') or not u.hostname or u.username or u.password or u.query or u.fragment
            or len(value) > 512 or any(c.isspace() for c in value)):
        raise ValueError('ローカルLLMの接続先URLが不正です')
    return value


def model_id(value, empty=True):
    value = value.strip() if isinstance(value, str) else None
    if value is None or value and not MODEL.fullmatch(value) or not value and not empty:
        raise ValueError('モデル名が不正です')
    return value


def price(value):
    if value is None or value == '':
        return None
    if isinstance(value, bool) or not isinstance(value, (int, float, str)):
        raise ValueError('料金が不正です')
    try:
        value = float(value)
    except ValueError:
        raise ValueError('料金が不正です') from None
    if not 0 <= value < 10_000:
        raise ValueError('料金が不正です')
    return value


def write_private(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    descriptor, name = tempfile.mkstemp(prefix='.' + path.name + '-', dir=path.parent)
    try:
        with os.fdopen(descriptor, 'w') as f:
            os.fchmod(f.fileno(), 0o600)
            json.dump(value, f, ensure_ascii=False)
            f.flush()
            os.fsync(f.fileno())
        os.replace(name, path)
    finally:
        if os.path.exists(name):
            os.unlink(name)


class BriefingSettings:
    """API keys and endpoints per provider, the API and model of each step, prices and the budget."""

    def __init__(self, path):
        self.path = Path(path)
        self.lock = threading.RLock()

    def defaults(self):
        return {'revision': 0,
                'providers': {'gemini': {}, 'openai': {}, 'claude': {},
                              'local': {'endpoint': os.environ.get('LOCAL_LLM_BASE_URL', 'http://host.docker.internal:11434'),
                                        'protocol': os.environ.get('LOCAL_LLM_PROTOCOL', 'ollama')}},
                'steps': {step: {'provider': provider, 'model': '', 'voice': ''} for step, provider in DEFAULT_STEPS.items()},
                'pricing': {}, 'budget_usd_per_run': None, 'length': 'short', 'resolution': '1280x720',
                'rights': {}}

    def read(self):
        state = self.defaults()
        try:
            saved = json.loads(self.path.read_text())
            if not isinstance(saved, dict):
                raise ValueError
        except (OSError, ValueError):
            return state
        if type(saved.get('revision')) is int:
            state['revision'] = saved['revision']
        for p, profile in (saved.get('providers') or {}).items():
            if p in PROVIDERS and isinstance(profile, dict):
                state['providers'][p].update({k: v for k, v in profile.items() if k in ('api_key', 'endpoint', 'protocol') and isinstance(v, str)})
        for step, choice in (saved.get('steps') or {}).items():
            if step in STEPS and isinstance(choice, dict):
                state['steps'][step].update({k: v for k, v in choice.items() if k in ('provider', 'model', 'voice') and isinstance(v, str)})
        for field in ('pricing', 'rights'):
            if isinstance(saved.get(field), dict):
                state[field] = saved[field]
        if saved.get('budget_usd_per_run') is None or isinstance(saved.get('budget_usd_per_run'), (int, float)):
            state['budget_usd_per_run'] = saved.get('budget_usd_per_run')
        if saved.get('length') in ('short', 'standard'):
            state['length'] = saved['length']
        if saved.get('resolution') in ('1280x720', '1920x1080'):
            state['resolution'] = saved['resolution']
        return state

    def credential(self, provider, state=None):
        state = state or self.read()
        saved = state['providers'][provider].get('api_key', '')
        if saved:
            return saved, 'saved'
        env = next((os.environ[k].strip() for k in ENV_KEYS[provider] if os.environ.get(k, '').strip()), '')
        return env, 'environment' if env else 'none'

    def provider(self, provider, state=None):
        """Connection settings of one provider, including its key (for calls only, never for display)."""
        state = state or self.read()
        key, _ = self.credential(provider, state)
        profile = state['providers'][provider]
        return {'provider': provider, 'api_key': key, 'endpoint': profile.get('endpoint', '') if provider == 'local' else '',
                'protocol': profile.get('protocol', 'ollama') if provider == 'local' else ''}

    def step(self, step, state=None):
        """The API, model and voice chosen for one step, ready to call; None when the step is switched off."""
        state = state or self.read()
        choice = state['steps'][step]
        if step == 'review' and choice['provider'] == 'none':
            return None
        cfg = self.provider(choice['provider'], state)
        cfg.update(model=choice['model'], voice=choice.get('voice', ''), step=step)
        return cfg

    def problems(self, state=None):
        """Why each step cannot run yet (missing key, model or voice); an empty dict when all are ready."""
        state = state or self.read()
        result = {}
        for step in STEPS:
            cfg = self.step(step, state)
            if cfg is None:
                continue
            if not cfg['model']:
                result[step] = 'モデルを指定してください'
            elif cfg['provider'] != 'local' and not cfg['api_key']:
                result[step] = 'APIキーを設定してください'
            elif STEPS[step] == 'speech' and not cfg['voice']:
                result[step] = '声の名前を指定してください'
        return result

    def snapshot(self):
        with self.lock:
            state = self.read()
        view = copy.deepcopy({k: v for k, v in state.items() if k != 'providers'})
        view['providers'] = []
        for p in PROVIDERS:
            profile = state['providers'][p]
            item = {'id': p, 'label': LABELS[p], 'credential': self.credential(p, state)[1], 'speech': p in SPEECH_PROVIDERS}
            if p == 'local':
                item.update(endpoint=profile.get('endpoint', ''), protocol=profile.get('protocol', 'ollama'))
            view['providers'].append(item)
        view['step_kinds'] = STEPS
        view['problems'] = self.problems(state)
        return view

    def save(self, data):
        if not isinstance(data, dict) or type(data.get('revision')) is not int:
            raise ValueError('設定の版（revision）を指定してください')
        with self.lock:
            state = self.read()
            if data['revision'] != state['revision']:
                raise SettingsConflict('設定がほかの画面で変更されました。読み込み直してから保存してください')
            for p, change in (data.get('providers') or {}).items():
                if p not in PROVIDERS or not isinstance(change, dict):
                    raise ValueError('生成AIの種類が不正です')
                profile = state['providers'][p]
                key = change.get('api_key')
                if key is not None:
                    if not isinstance(key, str) or len(key) > 4096 or not key.isascii() or not key.isprintable():
                        raise ValueError('APIキーが不正です')
                    if key.strip():
                        profile['api_key'] = key.strip()
                if change.get('clear_api_key') is True:
                    profile.pop('api_key', None)
                if p == 'local':
                    if 'endpoint' in change:
                        profile['endpoint'] = endpoint(change['endpoint'])
                    if 'protocol' in change:
                        if change['protocol'] not in ('ollama', 'openai'):
                            raise ValueError('ローカルLLMの方式が不正です')
                        profile['protocol'] = change['protocol']
            for step, change in (data.get('steps') or {}).items():
                if step not in STEPS or not isinstance(change, dict):
                    raise ValueError('工程の指定が不正です')
                choice = state['steps'][step]
                if 'provider' in change:
                    allowed = (SPEECH_PROVIDERS if STEPS[step] == 'speech' else PROVIDERS) + (('none',) if step == 'review' else ())
                    if change['provider'] not in allowed:
                        raise ValueError('この工程では選べない生成AIです')
                    choice['provider'] = change['provider']
                if 'model' in change:
                    choice['model'] = model_id(change['model'])
                if 'voice' in change:
                    value = change['voice'].strip() if isinstance(change['voice'], str) else None
                    if value is None or value and not VOICE.fullmatch(value):
                        raise ValueError('声の名前が不正です')
                    choice['voice'] = value
            if 'pricing' in data:
                if not isinstance(data['pricing'], dict) or len(data['pricing']) > 64:
                    raise ValueError('料金が不正です')
                pricing = {}
                for name, row in data['pricing'].items():
                    provider, _, model = name.partition('/') if isinstance(name, str) else ('', '', '')
                    if provider not in PROVIDERS or not isinstance(row, dict):
                        raise ValueError('料金が不正です')
                    model_id(model, empty=False)
                    item = {k: price(row.get(k)) for k in PRICE_FIELDS}
                    for k, limit in (('source_url', 512), ('checked_on', 10)):
                        value = row.get(k) or ''
                        if not isinstance(value, str) or len(value) > limit or not value.isprintable():
                            raise ValueError('料金が不正です')
                        item[k] = value.strip()
                    if item['source_url'] and not item['source_url'].startswith('https://'):
                        raise ValueError('料金の参照元はhttps://のURLにしてください')
                    if item['checked_on'] and not re.fullmatch(r'\d{4}-\d{2}-\d{2}', item['checked_on']):
                        raise ValueError('料金の確認日はYYYY-MM-DDで入力してください')
                    pricing[provider + '/' + model] = item
                state['pricing'] = pricing
            if 'budget_usd_per_run' in data:
                state['budget_usd_per_run'] = price(data['budget_usd_per_run'])
            if 'length' in data:
                if data['length'] not in ('short', 'standard'):
                    raise ValueError('動画の長さが不正です')
                state['length'] = data['length']
            if 'resolution' in data:
                if data['resolution'] not in ('1280x720', '1920x1080'):
                    raise ValueError('解像度が不正です')
                state['resolution'] = data['resolution']
            if 'rights' in data:
                state['rights'] = data['rights']  # checked by the caller against the data catalog
            state['revision'] += 1
            write_private(self.path, state)
        return self.snapshot()


# ---- calls -----------------------------------------------------------------------------------

def now_iso():
    return time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())


def post(cfg, url, headers, payload, limit=MAX_TEXT, timeout=180, method='POST'):
    """One HTTPS (or local HTTP) request; returns the body and the response headers. Keys never appear in errors."""
    request = Request(url, data=None if payload is None else json.dumps(payload).encode(),
                      headers={'Content-Type': 'application/json', **headers}, method=method)
    handlers = [NoRedirect()]
    if cfg['provider'] == 'local':
        handlers.append(ProxyHandler({}))  # a local server is reached directly, never through a proxy
    try:
        with build_opener(*handlers).open(request, timeout=timeout) as response:
            body = response.read(limit + 1)
            reply_headers = dict(response.headers.items())
    except HTTPError as error:
        raise AIError('生成AIのAPIがエラーを返しました（HTTP ' + str(error.code) + '）') from None
    except (URLError, TimeoutError, OSError):
        raise AIError('生成AIのAPIに接続できないか、時間内に応答がありませんでした') from None
    if len(body) > limit:
        raise AIError('生成AIの応答が大きすぎます')
    return body, reply_headers


def auth(cfg):
    if cfg['provider'] == 'claude':
        return {'x-api-key': cfg['api_key'], 'anthropic-version': '2023-06-01'}
    if cfg['provider'] == 'gemini':
        return {'x-goog-api-key': cfg['api_key']}
    return {'Authorization': 'Bearer ' + cfg['api_key']} if cfg['api_key'] else {}


def usage(provider, protocol, body):
    """The provider's own usage report, by type. Missing values stay None (never 0, never estimated)."""
    keys = ('input_tokens', 'output_tokens', 'cached_input_tokens', 'reasoning_tokens', 'audio_output_tokens', 'total_tokens')
    result = dict.fromkeys(keys)
    if not isinstance(body, dict):
        return result
    if provider == 'openai' or provider == 'local' and protocol == 'openai':
        u = body.get('usage') if isinstance(body.get('usage'), dict) else {}
        result['input_tokens'] = u.get('input_tokens', u.get('prompt_tokens'))
        result['output_tokens'] = u.get('output_tokens', u.get('completion_tokens'))
        details = u.get('input_tokens_details') or u.get('prompt_tokens_details') or {}
        result['cached_input_tokens'] = details.get('cached_tokens') if isinstance(details, dict) else None
        details = u.get('output_tokens_details') or u.get('completion_tokens_details') or {}
        result['reasoning_tokens'] = details.get('reasoning_tokens') if isinstance(details, dict) else None
        result['total_tokens'] = u.get('total_tokens')
    elif provider == 'claude':
        u = body.get('usage') if isinstance(body.get('usage'), dict) else {}
        result['input_tokens'] = u.get('input_tokens')
        result['output_tokens'] = u.get('output_tokens')
        result['cached_input_tokens'] = u.get('cache_read_input_tokens')
    elif provider == 'gemini':
        u = body.get('usageMetadata') if isinstance(body.get('usageMetadata'), dict) else {}
        result['input_tokens'] = u.get('promptTokenCount')
        result['cached_input_tokens'] = u.get('cachedContentTokenCount')
        result['reasoning_tokens'] = u.get('thoughtsTokenCount')
        result['total_tokens'] = u.get('totalTokenCount')
        audio = [d.get('tokenCount') for d in u.get('candidatesTokensDetails') or [] if isinstance(d, dict) and d.get('modality') == 'AUDIO']
        if audio:
            result['audio_output_tokens'] = sum(v for v in audio if isinstance(v, int))
        else:
            result['output_tokens'] = u.get('candidatesTokenCount')
    else:  # ollama
        result['input_tokens'] = body.get('prompt_eval_count')
        result['output_tokens'] = body.get('eval_count')
    return {k: v if type(v) is int and v >= 0 else None for k, v in result.items()}


def record(cfg, started, body, headers, kind, extra=None):
    measured = usage(cfg['provider'], cfg.get('protocol'), body)
    request_id = None
    if isinstance(body, dict):
        request_id = body.get('id') or body.get('responseId')
    request_id = request_id or headers.get('x-request-id') or headers.get('request-id')
    return {'step': cfg.get('step'), 'provider': cfg['provider'], 'model_id': cfg['model'], 'execution_mode': 'sync', 'kind': kind,
            'external': cfg['provider'] != 'local', 'provider_request_id': str(request_id)[:200] if request_id else None,
            'started_at': started[0], 'duration_seconds': round(time.monotonic() - started[1], 3), 'status': 'completed',
            'usage_kind': 'measured' if any(v is not None for v in measured.values()) else 'unavailable',
            'measured': measured, **(extra or {})}


def generate_json(cfg, system, user, schema, max_tokens=8000):
    """A JSON object from one text API call that follows the schema; returns (object, call record)."""
    p, model = cfg['provider'], cfg['model']
    if not model:
        raise AIError('モデルを指定してください')
    if p != 'local' and not cfg['api_key']:
        raise AIError('APIキーを設定してください')
    started = (now_iso(), time.monotonic())
    try:
        if p == 'openai':
            payload = {'model': model, 'store': False, 'instructions': system, 'max_output_tokens': max_tokens, 'input': user,
                       'text': {'format': {'type': 'json_schema', 'name': 'briefing', 'strict': True, 'schema': schema}}}
            raw, headers = post(cfg, 'https://api.openai.com/v1/responses', auth(cfg), payload)
            body = json.loads(raw)
            ok = body.get('status') == 'completed'
            output = ''.join(c.get('text', '') for m in body.get('output', []) if m.get('type') == 'message'
                             for c in m.get('content', []) if c.get('type') == 'output_text')
        elif p == 'claude':
            payload = {'model': model, 'max_tokens': max_tokens, 'system': system, 'messages': [{'role': 'user', 'content': user}],
                       'output_config': {'format': {'type': 'json_schema', 'schema': schema}}}
            raw, headers = post(cfg, 'https://api.anthropic.com/v1/messages', auth(cfg), payload)
            body = json.loads(raw)
            ok = body.get('stop_reason') == 'end_turn'
            output = ''.join(c.get('text', '') for c in body.get('content', []) if c.get('type') == 'text')
        elif p == 'gemini':
            payload = {'systemInstruction': {'parts': [{'text': system}]}, 'contents': [{'role': 'user', 'parts': [{'text': user}]}],
                       'generationConfig': {'responseMimeType': 'application/json', 'responseJsonSchema': schema, 'maxOutputTokens': max_tokens}}
            raw, headers = post(cfg, 'https://generativelanguage.googleapis.com/v1beta/models/' + quote(model, safe='') + ':generateContent',
                                auth(cfg), payload)
            body = json.loads(raw)
            candidates = body.get('candidates') or [{}]
            ok = candidates[0].get('finishReason') == 'STOP'
            output = ''.join(part.get('text', '') for part in candidates[0].get('content', {}).get('parts', []) if not part.get('thought'))
        elif cfg['protocol'] == 'ollama':
            payload = {'model': model, 'stream': False, 'format': schema, 'options': {'num_predict': max_tokens},
                       'messages': [{'role': 'system', 'content': system}, {'role': 'user', 'content': user}]}
            raw, headers = post(cfg, cfg['endpoint'] + '/api/chat', auth(cfg), payload, timeout=600)
            body = json.loads(raw)
            ok = body.get('done') is True and body.get('done_reason') != 'length'
            output = body.get('message', {}).get('content', '')
        else:
            payload = {'model': model, 'stream': False, 'max_tokens': max_tokens,
                       'messages': [{'role': 'system', 'content': system}, {'role': 'user', 'content': user}],
                       'response_format': {'type': 'json_schema', 'json_schema': {'name': 'briefing', 'strict': True, 'schema': schema}}}
            raw, headers = post(cfg, cfg['endpoint'] + '/chat/completions', auth(cfg), payload, timeout=600)
            body = json.loads(raw)
            choices = body.get('choices') or [{}]
            ok = choices[0].get('finish_reason') == 'stop'
            output = choices[0].get('message', {}).get('content', '')
    except (ValueError, TypeError, AttributeError, KeyError, IndexError):
        raise AIError('生成AIの応答を読み取れませんでした') from None
    call = record(cfg, started, body, headers, 'text')
    if not ok:
        call['status'] = 'incomplete'
        raise AIError('生成AIの出力が完了しませんでした', call)
    try:
        value = json.loads(output)
        if not isinstance(value, dict):
            raise ValueError
    except (ValueError, TypeError):
        call['status'] = 'invalid_output'
        raise AIError('生成AIの応答を読み取れませんでした', call) from None
    return value, call


def pcm_wav(pcm, rate=24000):
    buffer = io.BytesIO()
    with wave.open(buffer, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(pcm)
    return buffer.getvalue()


def wav_seconds(raw):
    with wave.open(io.BytesIO(raw)) as w:
        return w.getnframes() / w.getframerate()


def speak(cfg, text, language):
    """WAV audio of one narration segment; returns (bytes, call record). Claude and Ollama are refused."""
    p, model, voice = cfg['provider'], cfg['model'], cfg.get('voice', '')
    if p not in SPEECH_PROVIDERS or p == 'local' and cfg['protocol'] != 'openai':
        raise AIError('選んだ生成AIには音声合成がありません')
    if not model or not voice:
        raise AIError('音声合成のモデルと声の名前を指定してください')
    if p != 'local' and not cfg['api_key']:
        raise AIError('APIキーを設定してください')
    style = SPEECH_STYLE[language]
    started = (now_iso(), time.monotonic())
    extra = {'input_characters': len(text), 'language': language}
    if p in ('openai', 'local'):
        url = 'https://api.openai.com/v1/audio/speech' if p == 'openai' else cfg['endpoint'] + '/audio/speech'
        raw, headers = post(cfg, url, auth(cfg), {'model': model, 'voice': voice, 'input': text, 'response_format': 'wav', 'instructions': style},
                            limit=MAX_AUDIO, timeout=300)
        try:
            seconds = wav_seconds(raw)
        except (wave.Error, EOFError, ZeroDivisionError):
            raise AIError('音声合成の応答を読み取れませんでした') from None
        # The speech endpoint returns audio only; its usage is not reported in the response.
        return raw, record(cfg, started, None, headers, 'speech', extra | {'audio_seconds': round(seconds, 2)})
    payload = {'contents': [{'parts': [{'text': style + '\n' + text}]}],
               'generationConfig': {'responseModalities': ['AUDIO'],
                                    'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': voice}}}}}
    raw, headers = post(cfg, 'https://generativelanguage.googleapis.com/v1beta/models/' + quote(model, safe='') + ':generateContent',
                        auth(cfg), payload, limit=MAX_AUDIO, timeout=300)
    try:
        body = json.loads(raw)
        part = body['candidates'][0]['content']['parts'][0]['inlineData']
        rate = re.search(r'rate=(\d+)', part.get('mimeType', ''))
        audio = pcm_wav(base64.b64decode(part['data']), int(rate[1]) if rate else 24000)
    except (ValueError, KeyError, IndexError, TypeError):
        raise AIError('音声合成の応答を読み取れませんでした') from None
    return audio, record(cfg, started, body, headers, 'speech', extra | {'audio_seconds': round(wav_seconds(audio), 2)})


# ---- which listed models to offer ------------------------------------------------------------------
# The providers' lists say nothing about which models are current, so these rules (names patterns only,
# no model names) decide: speech steps get speech-synthesis models, text steps get general text models,
# and of each family only the newest generation that is not a preview, an alias or a dated snapshot.
SPEECH_MODEL = re.compile(r'(^|[-_.])tts([-_.]|$)', re.I)
NOT_TEXT = re.compile(r'(^|[-_.])(tts|image|images|imagen|veo|sora|dall|audio|realtime|transcribe|whisper|embed|embedding|embeddings|'
                      r'moderation|lyria|robotics|computer|gemma|aqa|banana|deep|research|antigravity|search|live|native)([-_.]|$)', re.I)
NOT_CURRENT = re.compile(r'(^|[-_.])(preview|exp|experimental|latest|beta|alpha)([-_.]|$)', re.I)
DATED = re.compile(r'[-_.@](\d{8}|\d{4}-\d{2}-\d{2}|\d{4})$')


def model_kind(mid):
    """'speech' for speech synthesis, 'text' for general text generation, 'other' for everything else."""
    name = mid.rsplit('/', 1)[-1]
    if SPEECH_MODEL.search(name):
        return 'speech'
    return 'other' if NOT_TEXT.search(name) else 'text'


def family(mid):
    """(family, generation): version numbers are taken out of the name, e.g. claude-opus-5-5 -> ('claude-opus', (5, 5))."""
    name = DATED.sub('', mid.rsplit('/', 1)[-1].lower())
    words, version = [], []
    for part in re.split(r'[-_]', name):
        # '5', '3.8' and '4o' are generations; 'o3' is the family 'o' in generation 3.
        number = re.fullmatch(r'(\d+(?:\.\d+)*)[a-z]?', part) or re.fullmatch(r'([a-z])(\d+(?:\.\d+)*)', part)
        if number and number.re.pattern.startswith('(\\d'):
            version += [int(x) for x in number.group(1).split('.')]
        elif number:
            words.append(number.group(1))
            version += [int(x) for x in number.group(2).split('.')]
        else:
            words.append(part)
    return '-'.join(words), tuple(version)


def mark_current(models):
    """Tags each model with its kind and whether it is offered by default (the newest current generation of its family)."""
    best = {}
    for m in models:
        m['kind'] = model_kind(m['id'])
        name = m['id'].rsplit('/', 1)[-1]
        m['current'] = False
        if m['kind'] == 'other' or NOT_CURRENT.search(name):
            continue
        fam, version = family(m['id'])
        # Of equal generations, the undated name wins over a dated snapshot.
        rank = (version, not DATED.search(name))
        if fam not in best or rank > best[fam][0]:
            best[fam] = (rank, m)
    # A family far behind its line is no longer current either: e.g. a 2.x pro when the same line is at 4.
    # The line is the name before its first version number; one major generation behind is still offered.
    newest = {}
    for fam, (rank, m) in best.items():
        line = re.split(r'[-_]\d', DATED.sub('', m['id'].rsplit('/', 1)[-1].lower()), maxsplit=1)[0]
        if rank[0]:
            newest[line] = max(newest.get(line, 0), rank[0][0])
    for fam, (rank, m) in best.items():
        line = re.split(r'[-_]\d', DATED.sub('', m['id'].rsplit('/', 1)[-1].lower()), maxsplit=1)[0]
        m['current'] = not rank[0] or rank[0][0] >= newest.get(line, 0) - 1
    return models


# ---- recommended combinations -----------------------------------------------------------------------
# Three priorities over the providers that have a key. Tiers come from the size words in the model names
# only (the lists carry no prices): 3 = largest (pro, opus, ...), 2 = middle (flash, sonnet, mini, ...),
# 1 = smallest (lite, nano, haiku, ...). A name without a size word is taken as the largest of its family.
PRIORITIES = ('precision', 'balance', 'cost')
SMALL = re.compile(r'(^|[-_.])(lite|nano|haiku|small|tiny|micro)([-_.]|$)', re.I)
MIDDLE = re.compile(r'(^|[-_.])(flash|sonnet|mini|medium|turbo)([-_.]|$)', re.I)


def tier(mid):
    name = mid.rsplit('/', 1)[-1]
    return 1 if SMALL.search(name) else 2 if MIDDLE.search(name) else 3


def pick(models, kind, priority):
    """The current model of this kind that best fits the priority, or None."""
    found = [m for m in models if m.get('current') and m.get('kind') == kind]
    if not found:
        return None
    fit = {'precision': lambda t: -t, 'cost': lambda t: t, 'balance': lambda t: (abs(t - 2), -t)}[priority]
    return min(found, key=lambda m: (fit(tier(m['id'])), tuple(-x for x in family(m['id'])[1]), len(m['id']), m['id']))


def recommend(available, priority, prefer=None):
    """Steps filled from {provider: models marked by mark_current}; providers without a fitting model are left out.
    The review goes to another provider when one exists, so that it stays independent of the script.
    prefer is the provider the administrator chose for the script; it leads when it has a fitting model.
    Returns {'steps': {step: {'provider', 'model'}}, 'unfilled': [steps no listed model fits]}."""
    if priority not in PRIORITIES:
        raise ValueError('重視する点が不正です')
    order = [p for p in PROVIDERS if p in available]
    # A local model has no API fee, so cost first tries it.
    if priority == 'cost' and 'local' in order:
        order.remove('local'); order.insert(0, 'local')
    if prefer in order:
        order.remove(prefer); order.insert(0, prefer)
    text = [(p, pick(available[p], 'text', priority)) for p in order]
    text = [(p, m) for p, m in text if m]
    if text:
        best = max(tier(m['id']) for _, m in text) if priority == 'precision' and prefer not in dict(text) else None
        primary = next((p, m) for p, m in text if best is None or tier(m['id']) == best)
    speech = [(p, pick(available[p], 'speech', priority)) for p in order if p in SPEECH_PROVIDERS]
    speech = [(p, m) for p, m in speech if m]
    if speech:
        # The script's provider is kept for speech when it can speak, so fewer keys and bills are involved.
        voice = next(((p, m) for p, m in speech if text and p == primary[0]), speech[0])
    steps, unfilled = {}, []
    for step, kind in STEPS.items():
        if kind == 'speech':
            chosen = voice if speech else None
        elif step == 'review' and text:
            chosen = next(((p, m) for p, m in text if p != primary[0]), primary)
        else:
            chosen = primary if text else None
        if chosen:
            steps[step] = {'provider': chosen[0], 'model': chosen[1]['id']}
        else:
            unfilled.append(step)
    return {'steps': steps, 'unfilled': unfilled}


def list_models(cfg):
    """The provider's own model list: the way to confirm a model ID exists. Also serves as the connection test."""
    p = cfg['provider']
    if p != 'local' and not cfg['api_key']:
        raise AIError('APIキーを設定してください')
    models, cursor = [], None
    for _ in range(20):
        if p == 'openai':
            url = 'https://api.openai.com/v1/models'
        elif p == 'claude':
            url = 'https://api.anthropic.com/v1/models?' + urlencode(dict(limit=100, **({'after_id': cursor} if cursor else {})))
        elif p == 'gemini':
            url = 'https://generativelanguage.googleapis.com/v1beta/models?' + urlencode(dict(pageSize=100, **({'pageToken': cursor} if cursor else {})))
        else:
            url = cfg['endpoint'] + ('/api/tags' if cfg['protocol'] == 'ollama' else '/models')
        raw, _ = post(cfg, url, auth(cfg), None, timeout=30, method='GET')
        try:
            body = json.loads(raw)
            rows = body.get('models' if p == 'gemini' or p == 'local' and cfg['protocol'] == 'ollama' else 'data')
            if not isinstance(rows, list):
                raise ValueError
        except (ValueError, AttributeError):
            raise AIError('生成AIの応答を読み取れませんでした') from None
        for row in rows:
            if not isinstance(row, dict):
                continue
            mid = row.get('name') if p == 'gemini' or p == 'local' and cfg['protocol'] == 'ollama' else row.get('id')
            if p == 'gemini' and isinstance(mid, str):
                if 'generateContent' not in row.get('supportedGenerationMethods', []):
                    continue
                mid = mid.removeprefix('models/')
            if isinstance(mid, str) and MODEL.fullmatch(mid):
                label = row.get('display_name', row.get('displayName', mid))
                models.append({'id': mid, 'label': label if isinstance(label, str) and len(label) <= 300 else mid})
        cursor = body.get('last_id') if p == 'claude' and body.get('has_more') else body.get('nextPageToken') if p == 'gemini' else None
        if not cursor:
            break
    return sorted({m['id']: m for m in models}.values(), key=lambda m: m['id'])
