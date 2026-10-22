"""Build human-readable external data notices from one maintained catalog."""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def build():
    catalog = json.loads((ROOT/'app/static/data-licenses.json').read_text())
    title = '外部データの出典・ライセンス・利用条件'
    md = [f'# {title}', '', f"確認日：{catalog['reviewed_at']}", '', catalog['scope'], '', '## 共通事項', '']
    page = [f'<h1>{title}</h1>', f"<p>確認日：{catalog['reviewed_at']}</p>", '<p>'+html.escape(catalog['scope'])+'</p>', '<h2>共通事項</h2>', '<ul>']
    for item in catalog['common']:
        md += ['- '+item]
        page += ['<li>'+html.escape(item)+'</li>']
    page += ['</ul>']
    for source in catalog['sources']:
        md += ['', '## '+source['name'], '']
        page += [f'<section id="{source["id"]}"><h2>'+html.escape(source['name'])+'</h2>']
        for field,label in [('usage','使用対象'),('status','接続状況'),('license','適用条件・確認状況'),('attribution','出典表示')]:
            md += [f"- **{label}**：{source[field]}"]
            page += ['<p><strong>'+label+'：</strong>'+html.escape(source[field])+'</p>']
        md += ['']
        page += ['<ul>']
        for condition in source['conditions']:
            md += ['- '+condition]
            page += ['<li>'+html.escape(condition)+'</li>']
        page += ['</ul><p>原文・参照先：</p><ul>']
        md += ['', '原文・参照先：', '']
        for url in source['references']:
            md += ['- '+url]
            page += ['<li><a href="'+html.escape(url,quote=True)+'" target="_blank" rel="noopener noreferrer">'+html.escape(url)+'</a></li>']
        page += ['</ul></section>']
    md += ['', 'この文書は app/static/data-licenses.json から scripts/build_data_notices.py で生成します。原文の代替ではありません。', '']
    head='<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><style>body{font:16px/1.8 system-ui,sans-serif;max-width:1000px;margin:32px auto;padding:0 20px;color:#e6eef5;background:#09121d}h1{font-size:1.6rem}h2{font-size:1.25rem}section{border-top:1px solid #375269;margin-top:32px;padding-top:12px}a{color:#75dfbc;overflow-wrap:anywhere}li{margin-bottom:10px}p{overflow-wrap:anywhere}</style><body><nav><a href="/">アプリへ戻る</a></nav>'
    (ROOT/'DATA_LICENSES.md').write_text('\n'.join(md))
    # Same local translations as the app; the page follows the language chosen there.
    scripts='<script src="i18n-messages.js"></script><script src="data-licenses-messages.js"></script><script src="i18n.js"></script>'
    (ROOT/'app/static/data-licenses.html').write_text(head+'\n'.join(page)+scripts+'</body></html>\n')

if __name__=='__main__':
    build()
