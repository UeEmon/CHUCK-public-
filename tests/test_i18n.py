"""Check all eight locales have complete static UI messages and placeholders."""
import ast
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import unittest

STATIC=Path(__file__).resolve().parents[1]/'app/static'
JAPANESE=re.compile('[ぁ-んァ-ヶ一-龯]')

def load_messages(*extra):
    raw=(STATIC/'i18n-messages.js').read_text()
    messages=json.loads(raw.split('const HF_MESSAGES=',1)[1].strip().removesuffix(';'))
    for name in extra:
        # Page dictionaries never override the shared one (see their merge loop).
        source=(STATIC/name).read_text()
        for key,values in json.loads('{'+source.split('const messages={',1)[1].split('\n };',1)[0]+'}').items():
            messages.setdefault(key,values)
    return messages

def translatable(messages):
    # Same lookup order as i18n.js: exact key, a {placeholder} template, then known fragments.
    templates=[re.compile('^'+''.join('.+?' if re.fullmatch(r'\{[a-z]+\}',part) else re.escape(part) for part in re.split(r'(\{[a-z]+\})',key))+'$') for key in messages if '{' in key]
    fragments=re.compile('|'.join(re.escape(key) for key in sorted((k for k in messages if '{' not in k),key=len,reverse=True)))
    return lambda text:text in messages or any(t.match(text) for t in templates) or not JAPANESE.search(fragments.sub('',text))

class Texts(HTMLParser):
    """Japanese text nodes and translated attributes of a static page."""
    def __init__(self):super().__init__();self.texts=[];self.skip=0
    def handle_starttag(self,tag,attrs):
        if tag in ('script','style'):self.skip+=1
        for name,value in attrs:
            if name in ('title','aria-label','placeholder','label') and value and JAPANESE.search(value):self.texts.append(value.strip())
    def handle_endtag(self,tag):
        if tag in ('script','style'):self.skip-=1
    def handle_data(self,data):
        if not self.skip and JAPANESE.search(data):self.texts.append(data.strip())

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
        parser=Texts()
        for page in [STATIC/'index.html',STATIC.parent/'gateway_static/index.html']:parser.feed(page.read_text())
        for text in parser.texts:
            if text=='日本語':continue # Language names always remain native.
            self.assertTrue(text in messages,text)

    def test_map_legend_variants_are_translated(self):
        raw=(STATIC/'i18n-messages.js').read_text()
        messages=json.loads(raw.split('const HF_MESSAGES=',1)[1].strip().removesuffix(';'))
        source=(STATIC/'observations.js').read_text()
        legends=[]
        for line in source.splitlines():
            if "$('observation-map-legend').textContent=" not in line:continue
            for literal in re.findall(r"`([^`]*)`|'([^']*[ぁ-んァ-ヶ一-龯][^']*)'",line.split('textContent=',1)[1]):
                text=literal[0] or literal[1]
                # Expand ${cond?'A':''} into both rendered variants.
                optional=re.search(r"\$\{[^?]+\?'([^']*)':''\}",text)
                legends+=[text.replace(optional[0],v) for v in (optional[1],'')] if optional else [text]
        self.assertGreaterEqual(len(legends),4)
        for text in legends:
            self.assertNotIn('${',text)
            self.assertTrue(text in messages,text)

    def test_page_dictionaries_cover_their_pages(self):
        for page,extra in [('index.html',()),('../gateway_static/index.html',()),('catalog.html',('public-messages.js',)),
                           ('support-admin.html',('support-messages.js',)),('data-licenses.html',('data-licenses-messages.js',))]:
            messages=load_messages(*extra);covered=translatable(messages)
            for name in extra:
                source=(STATIC/name).read_text()
                for key,values in json.loads('{'+source.split('const messages={',1)[1].split('\n };',1)[0]+'}').items():
                    self.assertEqual(len(values),7,key);self.assertTrue(all(v.strip() for v in values),key)
                    self.assertTrue(all(set(re.findall(r'\{[a-z]+\}',v))==set(re.findall(r'\{[a-z]+\}',key)) for v in values),key)
            parser=Texts();parser.feed((STATIC/page).read_text())
            for text in parser.texts:
                if text=='日本語':continue
                self.assertTrue(covered(text),f'{page}: {text}')

    def test_server_messages_are_translated(self):
        # Error messages and notes that the server sends to the browser are shown in the UI language.
        covered=translatable(load_messages('public-messages.js','support-messages.js'))
        def render(node):
            if isinstance(node,ast.Constant):return node.value if isinstance(node.value,str) else 'x'
            if isinstance(node,ast.JoinedStr):return ''.join(render(v) for v in node.values)
            if isinstance(node,ast.BinOp) and isinstance(node.op,ast.Add):return render(node.left)+render(node.right)
            return 'x'
        missing=[]
        for path in sorted((STATIC.parent).glob('*.py')):
            tree=ast.parse(path.read_text());parents={child:node for node in ast.walk(tree) for child in ast.iter_child_nodes(node)}
            for node in ast.walk(tree):
                if not isinstance(node,(ast.Constant,ast.JoinedStr,ast.BinOp)):continue
                parent=parents.get(node)
                if isinstance(parent,(ast.JoinedStr,ast.BinOp,ast.Expr,ast.FormattedValue)):continue # inner part, or a docstring
                if isinstance(node,ast.BinOp) and not isinstance(node.op,ast.Add):continue
                text=render(node).strip()
                if not JAPANESE.search(text) or text.startswith('海上自衛隊|'):continue # pattern, not a message
                if not covered(text):missing.append(f'{path.name}:{node.lineno}: {text}')
        self.assertEqual(missing,[])

    def test_external_data_notice_catalog_is_translated(self):
        messages=load_messages('data-licenses-messages.js')
        catalog=json.loads((STATIC/'data-licenses.json').read_text())
        texts=[catalog['scope'],*catalog['common']]
        for source in catalog['sources']:texts+=[source[f] for f in ('name','usage','status','license','attribution')]+source['conditions']
        for text in texts:
            if JAPANESE.search(text):self.assertIn(text,messages)

if __name__=='__main__':unittest.main()
