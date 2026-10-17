"""Server-to-server access to the authoritative position gateway; no cache."""
import copy
import json
import os
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, HTTPRedirectHandler, ProxyHandler, build_opener
from engine import InputError, EngineError
from position_contract import has_references, apply_snapshot, validate_snapshot, POSITIONS_PATH, STATIONS_PATH


class GatewayError(EngineError):
    pass


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs): return None


def reject_constant(value):
    raise ValueError(value)


class GatewayClient:
    def __init__(self, url=None, token=None):
        self.url = url
        self.token = token

    def request(self, path, data=None):
        base = (self.url if self.url is not None else os.environ.get('HF_POSITION_GATEWAY_URL','http://position-gateway:8001')).rstrip('/')
        token = self.token if self.token is not None else os.environ.get('HF_POSITION_GATEWAY_TOKEN','')
        url = urlparse(base)
        if url.scheme not in ('http','https') or not url.hostname or url.username or url.password or url.query or url.fragment:
            raise GatewayError('位置ゲートウェイURLの設定が不正です')
        if len(token)<32: raise GatewayError('32文字以上のHF_POSITION_GATEWAY_TOKENを設定してください')
        payload = json.dumps(data,allow_nan=False).encode() if data is not None else None
        req = Request(base+path,data=payload,headers={'Authorization':'Bearer '+token,'Content-Type':'application/json'})
        try:
            # Keep internal credentials off proxies and redirect destinations.
            with build_opener(ProxyHandler({}),NoRedirect).open(req,timeout=5) as response:
                raw = response.read(4*1024*1024+1)
            if len(raw)>4*1024*1024: raise ValueError('oversized response')
            return json.loads(raw,parse_constant=reject_constant)
        except HTTPError as e:
            if e.code==400: raise InputError('位置ゲートウェイが局設定を拒否しました')
            raise GatewayError('位置ゲートウェイとの認証・通信に失敗しました（HTTP '+str(e.code)+'）')
        except (URLError,OSError,ValueError,UnicodeError):
            raise GatewayError('位置ゲートウェイに接続できないか、応答が不正です')

    def snapshot(self):
        result = self.request(POSITIONS_PATH)
        try: validate_snapshot(result)
        except (InputError,TypeError,KeyError,OverflowError):
            raise GatewayError('位置ゲートウェイの応答形式が不正です')
        result['gateway'] = True
        return result

    def configure(self, data):
        return self.request(STATIONS_PATH,data)

    def apply(self, data):
        if not has_references(data): return copy.deepcopy(data),{}
        return apply_snapshot(data,self.snapshot())
