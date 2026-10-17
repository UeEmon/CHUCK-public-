"""Build a runtime image AND its corresponding sources/notices, never image-only."""
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import uuid


def run(*args):
    return subprocess.check_output(list(args), text=True).strip()


def build(destination):
    root = Path(__file__).resolve().parents[1]
    if not shutil.which('docker'):
        raise RuntimeError('Docker is required; no redistribution artifact was produced')
    subprocess.run(['docker', 'info'], stdout=subprocess.DEVNULL, check=True)
    if run('git', '-C', str(root), 'status', '--porcelain'):
        raise RuntimeError('Commit all intended changes before producing matching sources')
    destination = Path(destination).resolve()
    if destination.exists():
        raise RuntimeError('Destination already exists; use a new release directory')
    if destination == root or root in destination.parents and not (root/'dist') in destination.parents:
        raise RuntimeError('Inside the repository, release output must be below dist/')
    destination.parent.mkdir(parents=True, exist_ok=True)
    token = uuid.uuid4().hex[:12]
    runtime = 'hf-propagation:redistribute-'+token
    sources = 'hf-propagation:sources-'+token
    for target, tag in [('final', runtime), ('redistribution-sources', sources)]:
        subprocess.run(['docker', 'build', '--target', target, '-t', tag, str(root)], check=True)
    runtime_id = run('docker', 'image', 'inspect', runtime, '--format', '{{.Id}}')
    # Exercise the actual flattened image, not only the builder filesystem.
    # Network isolation still permits the local HTTP regression tests.
    verification = (
        "import sys,unittest; sys.path.insert(0,'/verification/scripts'); "
        "from audit_runtime import audit; "
        "audit('/verification/licenses/runtime-license-lock.json','/tmp/license-verification'); "
        "suite=unittest.defaultTestLoader.discover('/verification/tests'); "
        "result=unittest.TextTestRunner(verbosity=2).run(suite); "
        "sys.exit(0 if result.wasSuccessful() and not result.skipped else 1)"
    )
    subprocess.run(['docker', 'run', '--rm', '--network', 'none',
                    '--mount', 'type=bind,src='+str(root)+',dst=/verification,readonly',
                    '--workdir', '/verification', '--entrypoint', 'python',
                    runtime_id, '-c', verification], check=True)
    with tempfile.TemporaryDirectory(prefix='hf-release-', dir=destination.parent) as temp:
        staging = Path(temp)/'bundle'
        staging.mkdir()
        for image, location, folder in [(runtime_id, '/licenses', 'licenses'), (sources, '/redistribution', 'corresponding-sources')]:
            container = run('docker', 'create', '--entrypoint', '/bin/true', image)
            try:
                subprocess.run(['docker', 'cp', container+':'+location, str(staging/folder)], check=True)
            finally:
                subprocess.run(['docker', 'rm', container], check=True, stdout=subprocess.DEVNULL)
        inventory = staging/'licenses/runtime/runtime-inventory.json'
        source_inventory = staging/'corresponding-sources/runtime-inventory.json'
        if inventory.read_bytes() != source_inventory.read_bytes():
            raise RuntimeError('Runtime changed between image and source builds; aborting redistribution')
        subprocess.run(['git', '-C', str(root), 'archive', '--format=tar.gz', '-o', str(staging/'application-source.tar.gz'), 'HEAD'], check=True)
        subprocess.run(['docker', 'image', 'save', '-o', str(staging/'runtime-image.tar'), runtime_id], check=True)
        shutil.copyfile(root/'docs/REDISTRIBUTION.md', staging/'READ-ME-FIRST.md')
        def sha256(path):
            value = hashlib.sha256()
            with path.open('rb') as stream:
                while block := stream.read(1024*1024):
                    value.update(block)
            return value.hexdigest()
        files = {str(p.relative_to(staging)): sha256(p) for p in staging.rglob('*') if p.is_file()}
        (staging/'SHA256SUMS.json').write_text(json.dumps(files, indent=2)+'\n')
        staging.rename(destination)
    print('Redistribute the complete directory, not runtime-image.tar alone:', destination)


if __name__ == '__main__':
    build(sys.argv[1] if len(sys.argv)>1 else 'dist/redistribution')
