"""Ephemeral app/gateway pair used by the optional Playwright UI checks."""
import os
import sys
import threading
from datetime import datetime, timezone
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'app'))
import server
import gateway_server
from http.server import ThreadingHTTPServer

if os.environ.get('HF_UI_OCR_FIXTURE')=='1':
    # Explicit test-only backend; never calls a paid API.
    import antenna_ocr
    from test_antenna_ocr import extraction
    os.environ['OPENAI_API_KEY']='fixture-not-a-real-api-key'
    os.environ['HF_ANTENNA_OCR_MODEL']='fixture-vision-model'
    antenna_ocr.extract=lambda *args:extraction()
    import ai_providers
    ai_providers.list_models=lambda cfg:dict(provider=cfg['provider'],models=[dict(id=cfg['provider']+'-vision-test',label='Vision fixture')],note='Vision fixture')

gateway_server.STORE.ingest(dict(source='ui-fixture',positions=[
    dict(id='ship',name='Test vessel',kind='vessel',lat=32,lon=135,observed_at=datetime.now(timezone.utc).isoformat())]))
gateway=ThreadingHTTPServer(('127.0.0.1',0),gateway_server.Handler)
os.environ['HF_POSITION_GATEWAY_URL']=f'http://127.0.0.1:{gateway.server_port}'
threading.Thread(target=gateway.serve_forever,daemon=True).start()
app=ThreadingHTTPServer(('127.0.0.1',0),server.Handler)
print(f'GATEWAY_URL=http://127.0.0.1:{gateway.server_port} UI_URL=http://127.0.0.1:{app.server_port}',flush=True)
app.serve_forever()
