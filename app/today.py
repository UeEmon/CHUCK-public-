"""Today's conditions check for a point-to-point result.

The monthly VOACAP prediction is left as it is. This module only estimates, for
the next 24 hours, where today's disturbances may spoil it, from data CHUCK
already holds:

* D-RAP (NOAA): the highest frequency affected by 1 dB of vertical D-region
  absorption (HAF). It is applied only while a radio blackout (R1+) or a solar
  radiation storm (S1+) is in progress, so that the ordinary daytime absorption
  VOACAP already models is not counted twice.
* NOAA scales: the geomagnetic storm level (G) now, in the past 24 hours and in
  the 3-day forecast, used for rule-of-thumb MUF depression and auroral zone
  warnings.

Every number here is an estimate; see docs/TODAY_CHECK.md.
"""
from datetime import datetime, timedelta, timezone
import math

UTC = timezone.utc
EARTH_KM = 6371.0
D_LAYER_KM = 90.0      # height where the ray crosses the absorbing D region
F_LAYER_KM = 300.0     # reflection height used to estimate the hop length
DRAP_HOURS = 3         # hours the current D-RAP snapshot is assumed to last
HAF_EXPONENT = 1.5     # D-RAP frequency dependence of absorption, (HAF/f)^1.5
WARN_LOSS_DB = 3.0     # estimated extra loss from which a cell is flagged
# Geomagnetic dipole pole (IGRF, epoch 2025).
POLE_LAT, POLE_LON = 80.8, -72.7
# MUF depression for paths reaching 45° geomagnetic latitude or more, by G level (rule of thumb).
MUF_FACTOR = {1: 0.95, 2: 0.90, 3: 0.85, 4: 0.75, 5: 0.65}
NOTE = ('月間予測の信頼度・SNRは変えず、今日の宇宙天気で悪くなりそうな時刻と周波数に印を付ける目安です。'
        'D-RAPの吸収はR1以上またはS1以上が出ている間だけ、現在の値が3時間続くとして見積もります。'
        '地磁気嵐によるMUFの低下とオーロラ帯の判定は経験的な目安です。')


def great_circle(a_lat, a_lon, b_lat, b_lon, fraction):
    rad = math.radians
    p1, l1, p2, l2 = rad(a_lat), rad(a_lon), rad(b_lat), rad(b_lon)
    d = 2 * math.asin(min(1, math.sqrt(math.sin((p2 - p1) / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin((l2 - l1) / 2) ** 2)))
    if d < 1e-9:
        return a_lat, a_lon
    s1, s2 = math.sin((1 - fraction) * d) / math.sin(d), math.sin(fraction * d) / math.sin(d)
    x = s1 * math.cos(p1) * math.cos(l1) + s2 * math.cos(p2) * math.cos(l2)
    y = s1 * math.cos(p1) * math.sin(l1) + s2 * math.cos(p2) * math.sin(l2)
    z = s1 * math.sin(p1) + s2 * math.sin(p2)
    return math.degrees(math.atan2(z, math.hypot(x, y))), math.degrees(math.atan2(y, x))


def geomagnetic_lat(lat, lon):
    rad = math.radians
    value = (math.sin(rad(lat)) * math.sin(rad(POLE_LAT))
             + math.cos(rad(lat)) * math.cos(rad(POLE_LAT)) * math.cos(rad(lon - POLE_LON)))
    return math.degrees(math.asin(max(-1, min(1, value))))


def hop_count(distance_km, takeoff_deg):
    """Hops of the given takeoff angle that fit the path, reflecting at F_LAYER_KM."""
    elevation = math.radians(max(0.1, takeoff_deg))
    half = math.acos(EARTH_KM * math.cos(elevation) / (EARTH_KM + F_LAYER_KM)) - elevation
    return max(1, round(distance_km / (2 * EARTH_KM * half)))


def secant(takeoff_deg):
    """Secant of the incidence angle where the ray crosses the D region."""
    sine = EARTH_KM * math.cos(math.radians(max(0.1, takeoff_deg))) / (EARTH_KM + D_LAYER_KM)
    return 1 / math.sqrt(1 - sine * sine)


def haf_at(drap, lat, lon):
    """Nearest D-RAP cell; None when the cell is missing."""
    lons = drap['longitudes']
    lon = (lon + 180) % 360 - 180
    row = min(drap['rows'], key=lambda r: abs(r['lat'] - lat))
    column = min(range(len(lons)), key=lambda i: min(abs(lons[i] - lon), 360 - abs(lons[i] - lon)))
    return row['values'][column]


def scale_level(item, key):
    value = item.get(key) if isinstance(item, dict) else None
    value = value.get('Scale') if isinstance(value, dict) else None
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return int(number) if number.is_integer() and 0 <= number <= 5 else None


def scales_by_kind(data):
    """Current, past-24-hour and forecast-by-date levels from noaa-scales.json."""
    data = data if isinstance(data, dict) else {}
    forecast = {}
    for key in ('1', '2', '3'):
        item = data.get(key)
        if isinstance(item, dict) and isinstance(item.get('DateStamp'), str):
            forecast[item['DateStamp']] = scale_level(item, 'G')
    level = lambda key, scale: scale_level(data.get(key), scale)
    return {'R': level('0', 'R'), 'S': level('0', 'S'), 'G': level('0', 'G'), 'G24': level('-1', 'G'), 'forecast_g': forecast}


def assess(result, drap_feed, scales_feed, now=None):
    now = (now or datetime.now(UTC)).astimezone(UTC)
    p = result.get('parameters') or {}
    if 'hours' not in result:
        return {'available': False, 'reason': '今日の状況での確認は、単一RXの地点間予測だけに使えます。'}
    if (p.get('year'), p.get('month')) != (now.year, now.month):
        return {'available': False, 'reason': '今日の状況での確認は、対象年月が今月の結果だけに使えます。'}
    scales = scales_by_kind(scales_feed.get('data'))
    scales_stale = bool(scales_feed.get('stale'))
    drap = drap_feed.get('data')
    drap_stale = bool(drap_feed.get('stale')) or not drap
    disturbed = (scales['R'] or 0) >= 1 or (scales['S'] or 0) >= 1
    use_drap = disturbed and not drap_stale and not scales_stale

    distance = result.get('distance_km') or 0
    samples = [great_circle(p['tx_lat'], p['tx_lon'], p['rx_lat'], p['rx_lon'], i / 50) for i in range(51)]
    max_geomag = max(abs(geomagnetic_lat(lat, lon)) for lat, lon in samples)
    path_haf = None
    if drap:
        values = [v for v in (haf_at(drap, lat, lon) for lat, lon in samples) if v is not None]
        path_haf = max(values) if values else None

    def g_for(offset, when):
        if offset < DRAP_HOURS:
            levels = [v for v in (scales['G'], scales['G24']) if v is not None]
            return max(levels) if levels else None
        forecast = scales['forecast_g'].get(when.date().isoformat())
        return forecast if forecast is not None else scales['G']

    def crossing_loss(frequency, takeoff):
        """Estimated extra absorption (dB) at the D-region crossings of every hop."""
        hops = hop_count(distance, takeoff)
        sec = secant(takeoff)
        loss = 0.0
        for k in range(hops + 1):
            lat, lon = great_circle(p['tx_lat'], p['tx_lon'], p['rx_lat'], p['rx_lon'], k / hops)
            haf = haf_at(drap, lat, lon)
            if haf:
                loss += (1 if k in (0, hops) else 2) * sec * (haf / frequency) ** HAF_EXPONENT
        return loss

    by_hour = {h['hour_utc']: h for h in result['hours']}
    start = now.replace(minute=0, second=0, microsecond=0)
    hours = []
    for offset in range(24):
        when = start + timedelta(hours=offset)
        base = by_hour.get(when.hour)
        if base is None:
            continue
        g = g_for(offset, when) if not scales_stale else None
        factor = 1.0
        if g and g >= 1:
            k = MUF_FACTOR[g]
            factor = k if max_geomag >= 45 else 1 - (1 - k) / 2 if max_geomag >= 30 else 1.0
        auroral = bool(g) and g >= 1 and max_geomag >= 67 - 2 * (g + 4)
        muf = base.get('muf_mhz')
        muf_adjusted = round(muf * factor, 2) if muf is not None else None
        drap_now = use_drap and offset < DRAP_HOURS
        rows = []
        for row in base['rows']:
            rel, snr = row.get('reliability'), row.get('snr_db_hz')
            reasons, loss = [], None
            if rel and snr is not None:  # a frequency the month never opens is left unmarked
                if drap_now:
                    loss = round(crossing_loss(row['frequency_mhz'], row.get('takeoff_deg') or p.get('min_angle', 3)), 1)
                    if loss >= WARN_LOSS_DB:
                        reasons.append('absorption')
                if muf_adjusted is not None and factor < 1 and muf_adjusted < row['frequency_mhz'] <= muf * 1.05:
                    reasons.append('muf')
                if auroral:
                    reasons.append('auroral')
            meets = rel is not None and rel >= p.get('reliability', 90)
            blocked = loss is not None and meets and snr - loss < p.get('required_snr', 0)
            status = 'blocked' if blocked else 'warn' if reasons else 'ok'
            rows.append({'frequency_mhz': row['frequency_mhz'], 'reliability': rel, 'snr_db_hz': snr,
                         'extra_loss_db': loss, 'status': status, 'reasons': reasons})
        candidates = [r for r in rows if r['reliability'] is not None and r['reliability'] >= p.get('reliability', 90) and r['status'] != 'blocked']
        rank = lambda r: (r['status'] == 'ok', r['reliability'], (r['snr_db_hz'] or -999) - (r['extra_loss_db'] or 0))
        best = max(candidates, key=rank) if candidates else None
        hours.append({'offset': offset, 'time_utc': when.isoformat(), 'hour_utc': when.hour, 'g_scale': g,
                      'absorption_applied': drap_now, 'muf_mhz': muf, 'muf_adjusted_mhz': muf_adjusted,
                      'auroral': auroral, 'rows': rows,
                      'best_mhz': best['frequency_mhz'] if best else None, 'best_status': best['status'] if best else None})
    return {'available': True, 'generated_at': now.isoformat(), 'result_id': result.get('id'), 'hours': hours,
            'conditions': {'R': scales['R'], 'S': scales['S'], 'G': scales['G'], 'G24': scales['G24'],
                           'forecast_g': scales['forecast_g'], 'scales_stale': scales_stale,
                           'scales_fetched_at': scales_feed.get('fetched_at'),
                           'drap_observed_at': drap.get('observed_at') if drap else None, 'drap_stale': drap_stale,
                           'absorption_applied': use_drap, 'path_max_haf_mhz': path_haf,
                           'path_max_geomagnetic_lat': round(max_geomag, 1)},
            'note': NOTE}
