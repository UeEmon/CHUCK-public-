"""Minimum transmit power of one link: the 24-hour forecast repeated over a ladder of powers."""
from engine import validate, ENGINE_COMMIT

# 1-2-5 steps (3–4 dB apart) from 10 W to 10 kW.
LADDER = (10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000)
NOTE = ('送信電力を10 Wから10 kWまで1-2-5の段階で変えて計算し、目標REL以上になる最小の段階を示します。'
        '段階の間の電力は計算しません。電力以外の条件（アンテナ、雑音、要求SNR、偏波損失）は計算時点の値のままです。'
        'RELは月間統計で、瞬時の通信可否ではありません。')


def meets(row, target):
    rel = row.get('reliability')
    return rel is not None and rel >= target


def minimum(steps, frequencies, target):
    """Per UTC and frequency, the smallest ladder power at the target REL; per UTC, the frequency that needs the least."""
    out = []
    for i, first in enumerate(steps[0]['hours']):
        rows = []
        for j, f in enumerate(frequencies):
            power = next((s['power_w'] for s in steps if meets(s['hours'][i]['rows'][j], target)), None)
            rows.append(dict(frequency_mhz=f, power_w=power))
        best = None
        for j, v in enumerate(rows):
            if v['power_w'] is None: continue
            # Equal power: the frequency with the higher REL at that power wins.
            rel = next(s for s in steps if s['power_w'] == v['power_w'])['hours'][i]['rows'][j]['reliability']
            if best is None or v['power_w'] < best['power_w'] or (v['power_w'] == best['power_w'] and rel > best['reliability']):
                best = dict(v, reliability=rel)
        out.append(dict(hour_utc=first['hour_utc'], rows=rows, best=best))
    return out


def predict(engine, p):
    steps = []
    for watts in LADDER:
        r = engine.run(validate(dict(p, power_w=watts)))
        target = p['reliability']
        hours = [dict(hour_utc=h['hour_utc'], muf_mhz=h['muf_mhz'],
                      rows=[dict(frequency_mhz=v['frequency_mhz'], reliability=v.get('reliability'), snr_db_hz=v.get('snr_db_hz'))
                            for v in h['rows']]) for h in r['hours']]
        steps.append(dict(power_w=watts, hours=hours, hours_meeting=sum(any(meets(v, target) for v in h['rows']) for h in hours)))
    return dict(kind='power', parameters=p, ladder=list(LADDER), distance_km=r['distance_km'], bearing_deg=r['bearing_deg'],
                steps=steps, minimum=minimum(steps, p['frequencies'], p['reliability']),
                note=NOTE, engine='voacapl 0.7.7', engine_commit=ENGINE_COMMIT)
