"""Collect exact Debian and CPython source archives; abort on missing sources."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import tarfile
import tempfile
from urllib.request import urlopen


def collect(inventory_path, directory):
    report = json.loads(Path(inventory_path).read_text())
    root = Path(directory).resolve()
    root.mkdir(parents=True, exist_ok=True)
    # Only Debian sources already configured by the pinned official base image.
    source_config = Path('/etc/apt/sources.list.d/debian.sources')
    text = source_config.read_text()
    if 'Types: deb' not in text:
        raise RuntimeError('Unexpected Debian source configuration')
    source_config.write_text(text.replace('Types: deb\n', 'Types: deb deb-src\n'))
    subprocess.run(['apt-get', 'update'], check=True)
    packages = sorted({(r['source'], r['source_version']) for r in report['packages']})
    for name, version in packages:
        subprocess.run(['apt-get', 'source', '--download-only', '--only-source', name+'='+version],
                       cwd=root, check=True)
    python = report['python']
    # The runtime omits ensurepip/pip. Omit bundled installer wheels from its
    # source companion too, rather than adding unaudited binary dependencies.
    with tempfile.TemporaryDirectory(prefix='hf-python-source-') as temp:
        target = Path(temp)/'python.tar.xz'
        with urlopen(python['source_url'], timeout=60) as response, target.open('wb') as output:
            while block := response.read(1024*1024):
                output.write(block)
        if hashlib.sha256(target.read_bytes()).hexdigest() != python['source_sha256']:
            raise RuntimeError('CPython source checksum mismatch')
        prefix = 'Python-'+python['version']+'/Lib/ensurepip'
        with tarfile.open(target) as source, tarfile.open(root/('Python-'+python['version']+'-without-ensurepip.tar.xz'), 'w:xz') as dest:
            for member in source:
                if member.name == prefix or member.name.startswith(prefix+'/'):
                    continue
                dest.addfile(member, source.extractfile(member) if member.isfile() else None)
    (root/'CPython-source-changes.txt').write_text('Upstream SHA256: '+python['source_sha256']+'\nThe ensurepip directory and bundled installer wheels are omitted, matching the runtime removal. CPython calculation/runtime code is unchanged.\n')
    files = []
    for path in sorted(root.iterdir()):
        if path.is_file():
            files.append(dict(file=path.name, sha256=hashlib.sha256(path.read_bytes()).hexdigest(), size=path.stat().st_size))
    (root/'source-manifest.json').write_text(json.dumps(dict(debian_sources=packages, files=files), indent=2)+'\n')


if __name__ == '__main__':
    collect(sys.argv[1], sys.argv[2])
