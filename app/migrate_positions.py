"""Copy legacy position tables into a NEW gateway DB; leave the source intact."""
import argparse
import json
import os
from pathlib import Path
import sqlite3
import tempfile
from positions import PositionStore


def migrate(source, destination):
    source, destination = Path(source).resolve(), Path(destination).resolve()
    if not source.is_file(): raise RuntimeError('Legacy database not found')
    if destination.exists(): raise RuntimeError('Destination already exists; no overwrite is permitted')
    destination.parent.mkdir(parents=True,exist_ok=True)
    with sqlite3.connect(source.as_uri()+'?mode=ro',uri=True) as old:
        old.execute('BEGIN')
        positions=old.execute('SELECT source,identifier,observed,received,payload FROM positions').fetchall()
        stations=old.execute('SELECT source,identifier,payload FROM position_stations').fetchall()
    old.close()
    if len(positions)>2000 or len(stations)>2000: raise RuntimeError('Legacy inventory exceeds gateway capacity')
    for row in positions+stations: json.loads(row[-1])
    with tempfile.TemporaryDirectory(prefix='position-migrate-',dir=destination.parent) as directory:
        temporary=Path(directory)/'positions.sqlite3'
        store=PositionStore(lambda:sqlite3.connect(temporary))
        with store.connect() as new:
            new.executemany('INSERT INTO positions VALUES (?,?,?,?,?)',positions)
            new.executemany('INSERT INTO position_stations VALUES (?,?,?)',stations)
        new.close()
        # Exclusive publication also prevents a racing gateway startup from
        # causing an existing database to be overwritten.
        os.link(temporary,destination)
    return dict(positions=len(positions),stations=len(stations))


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source',required=True)
    parser.add_argument('--destination',required=True)
    args=parser.parse_args()
    print(json.dumps(migrate(args.source,args.destination)))
