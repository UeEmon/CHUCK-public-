"""Coverage of several transmitting stations on one grid: which station reaches each grid point best, and where none does."""
import base64
from concurrent.futures import ThreadPoolExecutor
import math
import os
import threading

from engine import InputError, Cancelled, validate, distance

# The TX of the circuit plus up to three more stations from the location presets.
MAX_EXTRA = 3
# Hours per engine run, as in the single-station coverage matrix.
RUN_HOURS = 6
# A coarser world grid than the single-station matrix (121) keeps 4 stations x 11 frequencies x 24 hours within a few minutes.
SIZES = (91, 61)
NONE = 255
NOTE = ('送信所ごとにVOACAPのエリア計算を同じ格子で行い、格子点ごとにRELが最も高い送信所（同じRELならSNRが高い方）を示します。'
        'どの送信所でも目標RELに届かない格子点を空白域とします。'
        '追加した送信所はTXのアンテナ・送信電力で送信し、受信側はRX1のアンテナ・雑音を使うと仮定します。'
        '同じ周波数での送信所どうしの混信や、受信側での送信所の切替は考慮しません。')


def prepare(data):
    """The extra stations chosen from the location presets: 1 to MAX_EXTRA fixed sites."""
    rows = data.get('stations')
    if not isinstance(rows, list) or not 1 <= len(rows) <= MAX_EXTRA:
        raise InputError(f'追加する送信所は1〜{MAX_EXTRA}か所で指定してください')
    out = []
    for row in rows:
        if not isinstance(row, dict): raise InputError('送信所の形式が不正です')
        name = row.get('name')
        if not isinstance(name, str) or not name.strip() or len(name.strip()) > 40:
            raise InputError('送信所の名称は1〜40文字で指定してください')
        identifier = row.get('id', '')
        if not isinstance(identifier, str) or len(identifier) > 64: raise InputError('送信所の形式が不正です')
        lat, lon = row.get('lat'), row.get('lon')
        if not all(isinstance(v, (int, float)) and not isinstance(v, bool) for v in (lat, lon)) or not (-89 <= lat <= 89 and -180 <= lon <= 180):
            raise InputError('送信所の緯度・経度が範囲外です')
        out.append(dict(id=identifier, name=name.strip(), lat=float(lat), lon=float(lon)))
    return out


def center(stations):
    """Middle of the stations: mean latitude, and the circular mean of longitude so stations either side of 180° stay together."""
    lat = sum(s['lat'] for s in stations) / len(stations)
    lon = math.degrees(math.atan2(sum(math.sin(math.radians(s['lon'])) for s in stations), sum(math.cos(math.radians(s['lon'])) for s in stations)))
    return round(max(-89., min(89., lat)), 2), round(lon, 2)


def check_apart(stations, rx):
    for a in stations[1:]:
        # RX1 gives the receiving antenna and noise, and the direction of a TX antenna aimed along the path.
        if distance(a['lat'], a['lon'], rx[0], rx[1]) < 1: raise InputError(f'送信所「{a["name"]}」はRX1と同じ地点です。RX1を別の地点にしてください')
    for i, a in enumerate(stations):
        for b in stations[:i]:
            if distance(a['lat'], a['lon'], b['lat'], b['lon']) < 1:
                raise InputError(f'送信所「{a["name"]}」は「{b["name"]}」と同じ地点です')


def grid_bytes(grid):
    """REL (0..100) and SNR (dB-Hz + 100, 0..254) of one area grid as bytes, row by row; 255 is no value."""
    rel = bytes(NONE if v is None else max(0, min(100, round(v))) for row in grid['reliability'] for v in row)
    snr = bytes(NONE if v is None else max(0, min(254, round(v) + 100)) for row in grid['snr_db_hz'] for v in row)
    return rel, snr


def rank_keys(rel, snr, index):
    # One integer per cell that orders by REL, then SNR, then the earlier station; -1 when there is no value.
    tie = 7 - index
    return [-1 if r == NONE else ((r << 8) | (0 if s == NONE else s)) << 3 | tie for r, s in zip(rel, snr)]


def decode(key):
    return (NONE, NONE) if key < 0 else ((key >> 11), 7 - (key & 7))


def row_weights(n, lat_min, lat_max):
    return [max(0., math.cos(math.radians(lat_min + (lat_max - lat_min) * y / (n - 1)))) for y in range(n)]


def share(flags, weights, n):
    """Area share (cos-latitude weighted, %) of the cells whose flag is set."""
    total = sum(weights) * n
    if not total: return None
    hit = sum(w * sum(flags[y * n:(y + 1) * n]) for y, w in enumerate(weights))
    return round(100 * hit / total, 1)


def combine(per_station, target, weights, n):
    """Best station of each cell for one map (a list of (rel, snr) bytes, one per station), and the area summary."""
    keys = [rank_keys(rel, snr, i) for i, (rel, snr) in enumerate(per_station)]
    best = list(map(max, zip(*keys))) if len(keys) > 1 else keys[0]
    rel_best, station = zip(*map(decode, best))
    meets = [bytes(1 if r != NONE and r >= target else 0 for r in rel) for rel, _ in per_station]
    counts = list(map(sum, zip(*meets)))
    covered = [1 if c else 0 for c in counts]
    stations = []
    for i, m in enumerate(meets):
        stations.append(dict(alone=share(m, weights, n),
                             best=share([1 if c and s == i else 0 for c, s in zip(covered, station)], weights, n),
                             # The area that only this station covers: lost if it were taken away.
                             only=share([1 if v and c == 1 else 0 for v, c in zip(m, counts)], weights, n)))
    return dict(reliability=bytes(rel_best), station=bytes(station)), dict(covered=share(covered, weights, n), stations=stations), best


def b64(data):
    return base64.b64encode(data).decode('ascii')


def predict(engine, p, stations, bounds, size, cancel=None, step=None, total=None):
    """Area coverage of every station for every frequency x 24 hours, combined per grid point."""
    check_apart(stations, (p['rx_lat'], p['rx_lon']))
    frequencies = p['frequencies']
    params = [p] + [validate(dict({k: v for k, v in p.items() if k != 'tx_position'}, tx_lat=s['lat'], tx_lon=s['lon'])) for s in stations[1:]]
    runs = [(i, fi, list(range(h, h + RUN_HOURS))) for i in range(len(stations)) for fi in range(len(frequencies)) for h in range(0, 24, RUN_HOURS)]
    if total: total(len(runs))
    cancel = cancel or threading.Event()
    maps = {}
    lock = threading.Lock()
    first = {}

    def run(item):
        i, fi, hours = item
        try:
            r = engine.area_plots(params[i], [(h, frequencies[fi]) for h in hours], bounds, size, cancel)
        except Exception:
            cancel.set(); raise  # stop the other runs
        packed = [grid_bytes(g) for g in r['grids']]
        with lock:
            for h, g in zip(hours, packed): maps[i, fi, h] = g
            if i == 0 and fi == 0 and not first: first.update(grid=r['grids'][0], input_area=r['input_area'])
        if step: step()

    with ThreadPoolExecutor(max_workers=max(1, min(len(runs), os.cpu_count() or 1))) as pool:
        futures = [pool.submit(run, item) for item in runs]
        failed = [f.exception() for f in futures if f.exception() is not None]
        if failed: raise next((e for e in failed if not isinstance(e, Cancelled)), failed[0])

    grid = first['grid']
    n = grid['size']
    weights = row_weights(n, grid['lat_min'], grid['lat_max'])
    target = p['reliability']
    cells, summary, best_cells, best_summary = [], [], [], []
    for fi in range(len(frequencies)):
        cell_row, summary_row = [], []
        for h in range(24):
            packed, area, _ = combine([maps[i, fi, h] for i in range(len(stations))], target, weights, n)
            cell_row.append({k: b64(v) for k, v in packed.items()})
            summary_row.append(area)
        cells.append(cell_row); summary.append(summary_row)
    # The best frequency of each cell: for each station its best map over the frequencies, then the best station.
    for h in range(24):
        per_station, chosen = [], []
        for i in range(len(stations)):
            # The frequency index rides in the low bits of each key, the lower frequency winning a tie.
            keyed = [[-1 if k < 0 else (k << 4) | (15 - fi) for k in rank_keys(*maps[i, fi, h], i)] for fi in range(len(frequencies))]
            top = list(map(max, zip(*keyed))) if len(keyed) > 1 else keyed[0]
            rel = bytes(NONE if t < 0 else t >> 15 for t in top)
            snr = bytes(NONE if t < 0 else (t >> 7) & 255 for t in top)
            per_station.append((rel, snr)); chosen.append([0 if t < 0 else 15 - (t & 15) for t in top])
        packed, area, _ = combine(per_station, target, weights, n)
        station = packed['station']
        packed['frequency'] = bytes(NONE if station[c] == NONE else chosen[station[c]][c] for c in range(n * n))
        best_cells.append({k: b64(v) for k, v in packed.items()})
        best_summary.append(area)
    return dict(kind='coverage_stations', parameters=p, stations=stations, note=NOTE, input_area=first['input_area'],
                matrix=dict(size=n, lon_min=grid['lon_min'], lon_max=grid['lon_max'], lat_min=grid['lat_min'], lat_max=grid['lat_max'],
                            frequencies=frequencies, hours=list(range(24)), cells=cells, summary=summary,
                            best=dict(cells=best_cells, summary=best_summary)))
