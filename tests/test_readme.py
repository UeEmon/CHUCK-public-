"""Keep localized GitHub entry points navigable and operationally consistent."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
READMES = ['README.md'] + [f'README.{code}.md' for code in ('en', 'fr', 'es', 'it', 'pt', 'de', 'ko')]


class ReadmeTests(unittest.TestCase):
    def test_language_navigation_and_local_links(self):
        for name in READMES:
            content = (ROOT / name).read_text(encoding='utf-8')
            with self.subTest(readme=name):
                for target in READMES:
                    if target != name:
                        self.assertIn(f']({target})', content)
                for target in re.findall(r'\]\(([^)]+)\)', content):
                    if '://' not in target:
                        self.assertTrue((ROOT / target.split('#')[0]).is_file(), target)
                self.assertEqual(content.count('```') % 2, 0)

    def test_startup_gateway_and_license_coverage(self):
        for name in READMES:
            content = (ROOT / name).read_text(encoding='utf-8')
            with self.subTest(readme=name):
                for required in ('docker compose up -d --build', 'http://localhost:18082',
                                 '18083', 'HF_PORT=18084', 'HF_POSITION_INGEST_TOKEN',
                                 'HF_POSITION_GATEWAY_TOKEN', 'docs/GATEWAY_PROTOCOL.md',
                                 'docs/POSITION_INTERFACE.md', 'DATA_LICENSES.md',
                                 'SOFTWARE_LICENSES.md', 'docs/REDISTRIBUTION.md'):
                    self.assertIn(required, content)
                self.assertNotIn('HF_PORT=18083', content)


if __name__ == '__main__':
    unittest.main()
