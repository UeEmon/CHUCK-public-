"""Attach dated source-specific data terms without relicensing external data."""
import copy
import json
from pathlib import Path

_CATALOG = json.loads((Path(__file__).parent/'static/data-licenses.json').read_text())
_SOURCES = {source['id']: source for source in _CATALOG['sources']}


def terms_for(*identifiers):
    return {
        'reviewed_at': _CATALOG['reviewed_at'],
        'scope': _CATALOG['scope'],
        'notice_path': '/data-licenses.html',
        'common': copy.deepcopy(_CATALOG['common']),
        'sources': [copy.deepcopy(_SOURCES[key]) for key in identifiers],
    }
