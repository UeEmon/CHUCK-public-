"""Send a JSON/GeoJSON/NMEA RMC file using an environment token."""
import argparse
import json
import os
from pathlib import Path
from urllib.parse import urlparse, urlunparse, parse_qsl, urlencode
from urllib.request import Request


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('file', type=Path)
    parser.add_argument('--url', default='http://127.0.0.1:18083/api/positions')
    parser.add_argument('--protocol', choices=('json','geojson','nmea0183'), default='json')
    parser.add_argument('--source', help='Required for nmea0183')
    parser.add_argument('--station-id', help='Required for nmea0183')
    args = parser.parse_args()
    target = urlparse(args.url)
    if target.scheme not in ('http', 'https') or not target.hostname or target.username or target.password:
        parser.error('HTTP(S) URL without embedded credentials is required')
    token = os.environ.get('HF_POSITION_INGEST_TOKEN', '')
    if len(token) < 32: parser.error('Set HF_POSITION_INGEST_TOKEN to at least 32 characters')
    if target.scheme == 'http' and target.hostname not in ('127.0.0.1', 'localhost', '::1'):
        parser.error('Use HTTPS for remote senders (HTTP is permitted only on loopback)')
    payload = args.file.read_bytes()
    if args.protocol == 'nmea0183':
        if not args.source or not args.station_id: parser.error('NMEA requires --source and --station-id')
        endpoint = target.path if target.path.endswith('/nmea') else target.path.rstrip('/')+'/nmea'
        query = dict(parse_qsl(target.query));query.update(source=args.source,id=args.station_id)
        args.url = urlunparse(target._replace(path=endpoint,query=urlencode(query)))
        payload.decode('ascii')
    else:
        data = json.loads(payload)  # Catch malformed files locally without sending.
        if args.protocol == 'geojson' and data.get('type')!='FeatureCollection': parser.error('GeoJSON requires FeatureCollection')
    if len(payload) > 262144: parser.error('Payload exceeds 256 KiB')
    content_type = {'json':'application/json','geojson':'application/geo+json','nmea0183':'text/plain'}[args.protocol]
    request = Request(args.url, data=payload, headers={'Content-Type':content_type, 'Authorization':'Bearer '+token})
    # Do not forward the bearer credential through an HTTP redirect.
    from urllib.request import HTTPRedirectHandler, build_opener
    class NoRedirect(HTTPRedirectHandler):
        def redirect_request(self, *a, **kw): return None
    with build_opener(NoRedirect).open(request, timeout=15) as response:
        print(json.dumps(json.load(response), ensure_ascii=False))


if __name__ == '__main__': main()
