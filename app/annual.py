"""Twelve monthly 24-hour forecasts of one link, for a seasonal outlook."""
from engine import validate, ENGINE_COMMIT

MONTHS = 12
NOTE = ('各月のRELはその月の月間統計です。手動SSNでは12か月すべてに同じSSNを使います。'
        'NOAAの平滑SSNでは月ごとの値を使い、新鮮な値がない月は計算しません。'
        '実際の太陽活動・季節変化の年ごとの違いは反映しません。'
        '各月の生出力・入力カードは保存しません。必要な月は単一RXで再計算してください。')


def months(year, month):
    """The selected month and the eleven after it."""
    start = year*12 + month - 1
    return [((start+i)//12, (start+i) % 12 + 1) for i in range(MONTHS)]


def predict(engine, p, ssn_for):
    """ssn_for(year, month) returns (ssn, detail); a None SSN leaves that month out with detail as the reason."""
    out = []
    for year, month in months(p['year'], p['month']):
        ssn, detail = ssn_for(year, month)
        if ssn is None:
            out.append(dict(year=year, month=month, ssn=None, missing=detail, hours=[]))
            continue
        q = validate(dict(p, year=year, month=month, ssn=ssn))
        q['ssn_source'] = p.get('ssn_source', 'manual')
        r = engine.run(q)
        entry = dict(year=year, month=month, ssn=q['ssn'], hours=r['hours'])
        if detail is not None: entry['ssn_detail'] = detail
        out.append(entry)
        distance_km, bearing_deg = r.get('distance_km'), r.get('bearing_deg')
    if all(m['ssn'] is None for m in out):
        raise ValueError('12か月のどの月にも使えるSSNがありません')
    return dict(kind='annual', parameters=p, distance_km=distance_km, bearing_deg=bearing_deg,
                months=out, note=NOTE, engine='voacapl 0.7.7', engine_commit=ENGINE_COMMIT)
