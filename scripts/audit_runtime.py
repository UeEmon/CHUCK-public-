"""Fail-closed inventory and notice collection for the pinned runtime image."""
import hashlib
import importlib.metadata
import json
from pathlib import Path
import shutil
import subprocess
import sys


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def inventory(root=Path('/')):
    fmt = '${Package}\t${Version}\t${Architecture}\t${source:Package}\t${source:Version}\t${db:Status-Status}\n'
    rows = subprocess.check_output(['dpkg-query', '-W', '-f='+fmt], text=True)
    result = []
    for line in rows.splitlines():
        name, version, arch, source, source_version, status = line.split('\t')
        if status != 'installed':
            continue
        copyright = root/'usr/share/doc'/name/'copyright'
        if not copyright.is_file():
            raise RuntimeError('Missing copyright notice: '+name)
        result.append(dict(name=name, version=version, architecture=arch,
                           source=source, source_version=source_version,
                           copyright_sha256=digest(copyright)))
    return sorted(result, key=lambda row: row['name'])


def audit(lock_path, output):
    lock = json.loads(Path(lock_path).read_text())
    arch = subprocess.check_output(['dpkg', '--print-architecture'], text=True).strip()
    if arch not in lock['architectures']:
        raise RuntimeError('Unaudited architecture: '+arch)
    actual = inventory()
    expected = lock['architectures'][arch]['packages']
    if actual != expected:
        by_name = {p['name']: p for p in expected}
        changed = [p['name'] for p in actual if by_name.get(p['name']) != p]
        missing = sorted(set(by_name)-{p['name'] for p in actual})
        raise RuntimeError('Runtime differs from reviewed inventory: '+repr(dict(changed=changed, missing=missing)))
    if list(importlib.metadata.distributions()):
        raise RuntimeError('Unreviewed site-packages remain in runtime')
    python_license = Path('/usr/local/lib/python3.12/LICENSE.txt')
    if digest(python_license) != lock['python']['license_sha256']:
        raise RuntimeError('Python license differs from reviewed base')
    if sys.version.split()[0] != lock['python']['version']:
        raise RuntimeError('Python version differs from reviewed base')
    output = Path(output)
    output.mkdir(parents=True, exist_ok=True)
    notices = output/'package-notices'
    notices.mkdir(exist_ok=True)
    for row in actual:
        shutil.copyfile(Path('/usr/share/doc')/row['name']/'copyright', notices/(row['name']+'.copyright'))
    shutil.copytree('/usr/share/common-licenses', output/'common-licenses', symlinks=False, dirs_exist_ok=True)
    shutil.copyfile(python_license, output/'Python-LICENSE.txt')
    report = dict(architecture=arch, base_image=lock['base_image'], packages=actual,
                  python=lock['python'], status='inventory-matches-reviewed-lock; source-bundle-required-for-redistribution')
    (output/'runtime-inventory.json').write_text(json.dumps(report, indent=2)+'\n')
    print('Verified', len(actual), 'Debian packages and Python', sys.version.split()[0])


if __name__ == '__main__':
    audit(sys.argv[1], sys.argv[2])
