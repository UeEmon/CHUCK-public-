"""Multi-RX selection forecasts, without inventing joint channel statistics."""
import math
from engine import validate, InputError, ENGINE_COMMIT, distance, ANTENNA_FIELDS

NOTE = ('RELは各UTC・周波数の月間統計です。推奨サイトはREL最大（同値ならSNR最大）。'
        '少なくとも1サイト受信の上下限は各サイトRELを周辺確率とみなした理論範囲で、実測可用性ではありません。'
        'サイト間相関・共通障害・中継回線・切替遅延・受信機故障はモデル化していません。'
        '距離だけで独立とは判断しません。波形合成や合成SNR、リアルタイム切替制御は行いません。')


def prepare(data):
    raw = data.get('rx_sites')
    if not isinstance(raw, list) or not 2 <= len(raw) <= 8:
        raise InputError('rx_sites: RXサイトを2〜8地点指定してください')
    independent = data.get('independence_assumption', False)
    if not isinstance(independent, bool):
        raise InputError('independence_assumption: true/falseを指定してください')
    sites = []
    names = set()
    for i, site in enumerate(raw):
        if not isinstance(site, dict):
            raise InputError('RXサイトはJSONオブジェクトで指定してください')
        name = site.get('name', 'RX'+str(i+1))
        if not isinstance(name, str) or not name.strip() or len(name) > 40 or any(ord(c) < 32 for c in name):
            raise InputError('サイト名は制御文字を含まない1〜40文字で指定してください')
        name = name.strip()
        if name in names:
            raise InputError('サイト名は重複しないように指定してください')
        names.add(name)
        q = dict(data, rx_lat=site.get('lat'), rx_lon=site.get('lon'),
                 rx_antenna=site.get('antenna', data.get('rx_antenna', 'whip')),
                 rx_gain=site.get('gain', data.get('rx_gain', 0)),
                 noise=site.get('noise', data.get('noise', 150)),
                 rx_polarization=site.get('polarization',data.get('rx_polarization','model')),
                 rx_course_deg=site.get('course_deg'))
        for key in ANTENNA_FIELDS:
            if key in site:q['rx_'+key]=site[key]
        if data.get('ssn_source') == 'noaa':
            q['ssn'] = 0  # Validate all sites before accessing external data.
        p = validate(q)
        sites.append(dict(id='rx'+str(i+1), name=name, lat=p['rx_lat'], lon=p['rx_lon'],
                          antenna=p['rx_antenna'], gain=p['rx_gain'], noise=p['noise'],polarization=p['rx_polarization'],
                          course_deg=p['rx_course_deg']))
        sites[-1].update({key:p['rx_'+key] for key in ANTENNA_FIELDS})
        if 'position_ref' in site: sites[-1]['position_ref']=site['position_ref']
    return sites, independent


def valid(value, low=-math.inf, high=math.inf):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value) and low <= value <= high


def combine(samples, target, independent=False):
    available = [s for s in samples if valid(s.get('reliability'), 0, 100)]
    best = max(available, key=lambda s: (s['reliability'], s.get('snr_db_hz') if valid(s.get('snr_db_hz')) else -math.inf), default=None)
    complete = len(available) == len(samples)
    lower = best['reliability'] if best else None
    upper = min(100, sum(s['reliability'] for s in available)) if complete else None
    scenario = 100*(1-math.prod(1-s['reliability']/100 for s in available)) if complete and independent else None
    return dict(best_site_id=best['site_id'] if best else None,
                best_rel_percent=lower, union_lower_percent=lower,
                union_upper_percent=upper,
                independent_scenario_percent=round(scenario, 3) if scenario is not None else None,
                complete=complete, valid_sites=len(available),
                sites_meeting_target=sum(s['reliability'] >= target for s in available))


def predict(engine, p, sites, independent=False):
    results = []
    for site in sites:
        q = validate(dict(p, rx_lat=site['lat'], rx_lon=site['lon'],
                          rx_antenna=site['antenna'], rx_gain=site['gain'], noise=site['noise'],rx_polarization=site.get('polarization','model'),
                          rx_course_deg=site.get('course_deg'),
                          **{'rx_'+key:site[key] for key in ANTENNA_FIELDS if key in site}))
        q['ssn_source'] = p.get('ssn_source', 'manual')
        results.append(dict(id=site['id'], name=site['name'], **engine.run(q)))
    indexes = [{(h['hour_utc'], row['frequency_mhz']): row for h in r['hours'] for row in h['rows']} for r in results]
    hours = []
    for hour in range(24):
        rows = []
        for frequency in p['frequencies']:
            samples = [dict(index.get((hour, frequency), {}), site_id=site['id']) for index, site in zip(indexes, sites)]
            rows.append(dict(frequency_mhz=frequency, **combine(samples, p['reliability'], independent)))
        hours.append(dict(hour_utc=hour, rows=rows))
    separation = [dict(site_a=a['id'], site_b=b['id'], distance_km=round(distance(a['lat'], a['lon'], b['lat'], b['lon']), 2))
                  for i, a in enumerate(sites) for b in sites[i+1:]]
    parameters = dict(p, rx_sites=sites, independence_assumption=independent)
    return dict(kind='rx_diversity', parameters=parameters, sites=results, diversity_hours=hours,
                site_separations=separation, note=NOTE,
                selection_rule='maximum_REL_then_SNR; stable_input_order_on_tie',
                independence_assumption=independent, engine='voacapl 0.7.7', engine_commit=ENGINE_COMMIT)
