"""The operation manual offered by the download button is shipped with the app in every screen language."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
STATIC = ROOT/'app/static'
LANGUAGES = ('ja','en','fr','es','it','pt','de','ko')
READMES = {'README.md':'ja','README.en.md':'en','README.fr.md':'fr','README.es.md':'es',
           'README.it.md':'it','README.pt.md':'pt','README.de.md':'de','README.ko.md':'ko'}


class Links(HTMLParser):
    def __init__(self):super().__init__();self.links={}
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag=='a' and attrs.get('id','').startswith('manual-'):self.links[attrs['id']]=attrs


class ManualTests(unittest.TestCase):
    def test_download_button_points_to_shipped_pdf(self):
        parser=Links();parser.feed((STATIC/'index.html').read_text())
        self.assertEqual(set(parser.links),{'manual-pdf'})
        attrs=parser.links['manual-pdf']
        self.assertEqual(attrs['href'],'manual/CHUCK_Operation_Manual_ja.pdf')
        self.assertEqual(attrs['download'],'CHUCK_Operation_Manual_ja.pdf')

    def test_every_language_has_a_pdf_and_no_word_file(self):
        for language in LANGUAGES:
            path=STATIC/f'manual/CHUCK_Operation_Manual_{language}.pdf'
            self.assertTrue(path.read_bytes().startswith(b'%PDF-'),path.name)
        self.assertEqual(list((STATIC/'manual').glob('*.docx')),[])

    def test_button_follows_the_screen_language(self):
        script=(STATIC/'manual-download.js').read_text()
        self.assertEqual(tuple(json.loads(re.search(r"locales=(\[[^\]]+\])",script)[1].replace("'",'"'))),LANGUAGES)
        self.assertIn('hf-language-change',script)
        index=(STATIC/'index.html').read_text()
        self.assertLess(index.index('i18n.js'),index.index('manual-download.js'))

    def test_translations_cover_the_same_sentences(self):
        tables={language:json.loads((ROOT/f'docs/manual/i18n/{language}.json').read_text()) for language in LANGUAGES[1:]}
        keys=set(tables['en'])
        for language,table in tables.items():
            self.assertEqual(set(table),keys,language)
            self.assertTrue(all(table.values()),language)
        # Korean is written in Hangul only; no Chinese characters slip in.
        self.assertFalse([v for v in tables['ko'].values() if re.search('[\u3400-\u9fff]',v)])

    def test_readmes_link_their_own_language(self):
        for name,language in READMES.items():
            text=(ROOT/name).read_text()
            self.assertIn(f'app/static/manual/CHUCK_Operation_Manual_{language}.pdf',text,name)
            self.assertNotIn('.docx',text,name)


if __name__ == '__main__':
    unittest.main()
