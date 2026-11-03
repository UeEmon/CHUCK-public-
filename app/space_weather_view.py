"""Current conditions and forecasts from the NOAA feeds CHUCK already holds, for charts.

Reads the cached feeds only (SpaceWeather.feed without force), so viewing the
charts never makes the public-data fetcher download again.
"""
from datetime import datetime, timezone

from data_terms import terms_for
from space_weather import FEEDS, KP_FEEDS, engine_ssn, kp_rows, numeric

# The solar cycle chart starts with cycle 24 (minimum December 2008).
FIRST_MONTH = '2008-01'
# NOAA scales: "-1" is the past 24 hours' maximum, "0" the latest observation, "1"–"3" the forecast days.
SCALE_DAYS = (('-1', 'max24h'), ('0', 'latest'), ('1', 'forecast'), ('2', 'forecast'), ('3', 'forecast'))
NOTE = ('R/S/GとKpの予報はNOAA SWPCの3日予報、平滑SSNの予報はNOAAの太陽活動周期予測です。'
        'いずれも参考表示で、VOACAPの計算には平滑SSN（公表値×0.7）だけを使います。')


def source(feed):
    return {k: feed[k] for k in ('url', 'fetched_at', 'stale', 'error', 'fetch_state')}


def month(tag):
    return tag[:7] if isinstance(tag, str) and len(tag) >= 7 and tag[4] == '-' else None


def solar_cycle(observed, predicted):
    rows = []
    for row in observed['data'] or []:
        tag = month(row.get('time-tag')) if isinstance(row, dict) else None
        if not tag or tag < FIRST_MONTH:
            continue
        item = {'month': tag, 'ssn': numeric(row.get('ssn')), 'smoothed_ssn': numeric(row.get('smoothed_ssn'), 250),
                'f10_7': numeric(row.get('f10.7')), 'smoothed_f10_7': numeric(row.get('smoothed_f10.7'))}
        if any(item[k] is not None for k in ('ssn', 'smoothed_ssn', 'f10_7', 'smoothed_f10_7')):
            rows.append(item)
    forecast = []
    for row in predicted['data'] or []:
        tag = month(row.get('time-tag')) if isinstance(row, dict) else None
        value = numeric(row.get('predicted_ssn'), 250) if tag else None
        if value is None:
            continue
        forecast.append({'month': tag, 'ssn': value, 'engine_ssn': engine_ssn(value),
                         'high_ssn': numeric(row.get('high_ssn')), 'low_ssn': numeric(row.get('low_ssn')),
                         'f10_7': numeric(row.get('predicted_f10.7')), 'high_f10_7': numeric(row.get('high_f10.7')),
                         'low_f10_7': numeric(row.get('low_f10.7'))})
    rows.sort(key=lambda r: r['month'])
    forecast.sort(key=lambda r: r['month'])
    latest = next((r for r in reversed(rows) if r['ssn'] is not None), None)
    smoothed = next((r for r in reversed(rows) if r['smoothed_ssn'] is not None), None)
    return {'observed': rows, 'predicted': forecast,
            'latest_monthly': latest and {'month': latest['month'], 'ssn': latest['ssn'], 'f10_7': latest['f10_7']},
            'latest_smoothed': smoothed and {'month': smoothed['month'], 'ssn': smoothed['smoothed_ssn'],
                                             'engine_ssn': engine_ssn(smoothed['smoothed_ssn'])},
            'sources': {'observed': source(observed), 'predicted': source(predicted)}}


def probability(value):
    value = numeric(value, 100)
    return int(value) if value is not None and value.is_integer() else value


def level(item, key='Scale'):
    value = numeric(item.get(key), 5) if isinstance(item, dict) else None
    return int(value) if value is not None and value.is_integer() else None


def scale_days(feed, now):
    data = feed['data'] if isinstance(feed['data'], dict) else {}
    days = []
    for key, kind in SCALE_DAYS:
        item = data.get(key)
        if not isinstance(item, dict):
            continue
        r, s, g = (item.get(k) if isinstance(item.get(k), dict) else {} for k in 'RSG')
        try:
            date = datetime.strptime(item.get('DateStamp') or '', '%Y-%m-%d').date().isoformat()
        except (TypeError, ValueError):
            date = None
        days.append({'kind': kind, 'date': date, 'time': item.get('TimeStamp') if isinstance(item.get('TimeStamp'), str) else None,
                     'R': {'scale': level(r), 'minor_prob': probability(r.get('MinorProb')), 'major_prob': probability(r.get('MajorProb'))},
                     'S': {'scale': level(s), 'prob': probability(s.get('Prob'))},
                     'G': {'scale': level(g)}})
    latest = next((d for d in days if d['kind'] == 'latest'), None)
    stale = feed['stale']
    try:
        observed_at = datetime.fromisoformat(latest['date'] + 'T' + latest['time']).replace(tzinfo=timezone.utc)
        stale = stale or not -300 <= (now - observed_at).total_seconds() <= 3600
        observed_at = observed_at.isoformat()
    except (TypeError, ValueError):
        observed_at, stale = None, True
    return {'days': days, 'observed_at': observed_at, 'stale': stale, 'source': source(feed)}


def kp_storm_level(kp):
    """NOAA G scale from Kp: Kp 5 is G1 up to Kp 9 for G5."""
    return max(0, min(5, int(kp) - 4)) if kp is not None else None


def kp_series(observed, forecast, now):
    """The past week's 3-hourly Kp and the forecast; forecast rows win for the periods both cover."""
    rows = {r['time']: dict(r, kind='observed') for r in kp_rows(observed['data'])}
    for r in kp_rows(forecast['data']):
        if r['kind'] == 'predicted' or r['time'] not in rows:
            rows[r['time']] = r
    rows = [dict(r, g=kp_storm_level(r['kp'])) for r in sorted(rows.values(), key=lambda r: r['time'])]
    past = [r for r in rows if r['kind'] != 'predicted' and r['time'] <= now.isoformat()]
    future = [r for r in rows if r['kind'] == 'predicted']
    latest = past[-1] if past else None
    stale = observed['stale'] or latest is None or (now - datetime.fromisoformat(latest['time'])).total_seconds() > 6 * 3600
    peak = max(future, key=lambda r: r['kp']) if future else None
    return {'rows': rows, 'latest': latest, 'stale': stale, 'forecast_max': peak,
            'sources': {'kp': source(observed), 'kp-forecast': source(forecast)}}


def overview(weather, now=None):
    now = now or datetime.now(timezone.utc)
    feeds = {key: weather.feed(key) for key in (*FEEDS, *KP_FEEDS)}
    return {'data_terms': terms_for('noaa', 'silso-via-noaa'), 'provider': 'NOAA SWPC', 'generated_at': now.isoformat(),
            'solar_cycle': solar_cycle(feeds['observed'], feeds['predicted']),
            'scales': scale_days(feeds['scales'], now),
            'kp': kp_series(feeds['kp'], feeds['kp-forecast'], now), 'note': NOTE}
