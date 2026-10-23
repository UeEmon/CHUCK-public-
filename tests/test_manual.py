"""The operation manual offered by the download buttons is shipped with the app."""
from html.parser import HTMLParser
from pathlib import Path
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
STATIC = ROOT/'app/static'


class Links(HTMLParser):
    def __init__(self):super().__init__();self.links={}
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag=='a' and attrs.get('id','').startswith('manual-'):self.links[attrs['id']]=attrs


class ManualTests(unittest.TestCase):
    def test_download_buttons_point_to_shipped_files(self):
        parser=Links();parser.feed((STATIC/'index.html').read_text())
        self.assertEqual(set(parser.links),{'manual-pdf','manual-docx'})
        for attrs in parser.links.values():
            path=STATIC/attrs['href']
            self.assertTrue(path.is_file(),attrs['href'])
            self.assertEqual(attrs['download'],path.name)
        self.assertTrue((STATIC/parser.links['manual-pdf']['href']).read_bytes().startswith(b'%PDF-'))
        with zipfile.ZipFile(STATIC/parser.links['manual-docx']['href']) as docx:
            self.assertIn('word/document.xml',docx.namelist())

    def test_readmes_link_the_shipped_manual(self):
        for readme in sorted(ROOT.glob('README*.md')):
            text=readme.read_text()
            for name in ('CHUCK_Operation_Manual_ja.pdf','CHUCK_Operation_Manual_ja.docx'):
                self.assertIn('app/static/manual/'+name,text,readme.name)


if __name__ == '__main__':
    unittest.main()
