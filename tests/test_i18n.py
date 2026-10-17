"""Check all eight locales have complete static UI messages and placeholders."""
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import unittest

STATIC=Path(__file__).resolve().parents[1]/'app/static'

class LocalesTests(unittest.TestCase):
    def test_dictionary_and_static_text_coverage(self):
        raw=(STATIC/'i18n-messages.js').read_text()
        messages=json.loads(raw.split('const HF_MESSAGES=',1)[1].strip().removesuffix(';'))
        for source,values in messages.items():
            self.assertEqual(len(values),7,source)
            variables=set(re.findall(r'\{[a-z]+\}',source))
            for value in values:
                self.assertTrue(value.strip(),source)
                self.assertEqual(set(re.findall(r'\{[a-z]+\}',value)),variables,source)
        class Texts(HTMLParser):
            def __init__(self):super().__init__();self.texts=[]
            def handle_data(self,data):
                if re.search('[ぁ-んァ-ヶ一-龯]',data):self.texts.append(data.strip())
        parser=Texts()
        for page in [STATIC/'index.html',STATIC.parent/'gateway_static/index.html']:parser.feed(page.read_text())
        for text in parser.texts:
            if text=='日本語':continue # Language names always remain native.
            self.assertTrue(text in messages,text)

if __name__=='__main__':unittest.main()
