import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('audit_runtime',ROOT/'scripts/audit_runtime.py')
audit=importlib.util.module_from_spec(spec);spec.loader.exec_module(audit)


class RedistributionTests(unittest.TestCase):
    def test_inventory_uses_exact_source_version_and_raw_notice_bytes(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp);notice=root/'usr/share/doc/example/copyright'
            notice.parent.mkdir(parents=True);notice.write_bytes(b'license \xff\n')
            with patch.object(audit.subprocess,'check_output',return_value='example\t1+b1\tamd64\tsource-example\t1\tinstalled\n'):
                result=audit.inventory(root)
            self.assertEqual(result[0]['source_version'],'1')
            self.assertEqual(result[0]['copyright_sha256'],audit.digest(notice))

    def test_missing_notice_rejected(self):
        with tempfile.TemporaryDirectory() as temp,patch.object(audit.subprocess,'check_output',return_value='example\t1\tamd64\texample\t1\tinstalled\n'):
            with self.assertRaisesRegex(RuntimeError,'Missing copyright'):audit.inventory(Path(temp))

    def test_package_drift_rejected_before_approval(self):
        lock=ROOT/'licenses/runtime-license-lock.json'
        with patch.object(audit.subprocess,'check_output',return_value='amd64'),patch.object(audit,'inventory',return_value=[]):
            with self.assertRaisesRegex(RuntimeError,'differs from reviewed'):audit.audit(lock,'unused-output')

    def test_unsupported_architecture_rejected(self):
        with patch.object(audit.subprocess,'check_output',return_value='unknown-cpu'):
            with self.assertRaisesRegex(RuntimeError,'Unaudited architecture'):audit.audit(ROOT/'licenses/runtime-license-lock.json','unused-output')

    def test_tracked_paths_unique_on_case_insensitive_file_systems(self):
        # The release build runs this suite inside the final image, which has no git.
        if shutil.which('git'):
            paths=subprocess.check_output(['git','ls-files','-z'],cwd=ROOT,text=True).split('\0')
        else:
            paths=[str(path.relative_to(ROOT)) for path in ROOT.rglob('*') if path.is_file()
                   and not {'.git','dist','__pycache__'}&set(path.relative_to(ROOT).parts)]
        folded=[path.casefold() for path in paths if path]
        self.assertEqual(sorted({p for p in folded if folded.count(p)>1}),[])

    def test_lock_covers_all_reviewed_packages_and_no_asset_references(self):
        lock=json.loads((ROOT/'licenses/runtime-license-lock.json').read_text())
        for arch,count in [('amd64',107),('arm64',106)]:
            rows=lock['architectures'][arch]['packages']
            self.assertEqual(len(rows),count)
            self.assertTrue(all(len(r['copyright_sha256'])==64 and r['source_version'] for r in rows))
        makefile=(ROOT/'vendor/Makefile.am').read_text()
        self.assertNotIn('logo.png',makefile)
        self.assertNotIn('dist_man_MANS',makefile)
        for path in ['vendor/logo.png', 'vendor/man/voacapl.1',
                     'vendor/man/makeitshfbc.1', 'vendor/man/dst2csv.1',
                     'vendor/man/dst2ascii.1']:
            self.assertFalse((ROOT/path).exists(), path)


if __name__=='__main__':unittest.main()
