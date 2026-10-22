"""Keep the user-facing release notes well formed and translated."""
import json
from pathlib import Path
import re
import unittest

STATIC = Path(__file__).resolve().parents[1]/'app/static'


class WhatsNewTests(unittest.TestCase):
    def test_entries(self):
        raw = (STATIC/'i18n-messages.js').read_text()
        messages = json.loads(raw.split('const HF_MESSAGES=', 1)[1].strip().removesuffix(';'))
        entries = json.loads((STATIC/'whats-new.json').read_text())
        self.assertTrue(entries)
        self.assertEqual(len({e['id'] for e in entries}), len(entries))
        dates = [e['date'] for e in entries]
        self.assertEqual(dates, sorted(dates, reverse=True), 'newest first')
        self.assertTrue(any('element' not in e for e in entries), 'history since the initial release')
        for e in entries:
            with self.subTest(entry=e['id']):
                self.assertLessEqual({'id', 'date', 'title', 'text'}, set(e))
                self.assertLessEqual(set(e), {'id', 'date', 'title', 'text', 'tab', 'element'})
                self.assertRegex(e['date'], r'^\d{4}-\d{2}-\d{2}$')
                self.assertTrue(e['id'].startswith(e['date']))
                if 'tab' in e:self.assertRegex(e['tab'], r'^[a-z-]+$')
                # A highlighted feature needs the tab its "見る" button opens; history entries have no element.
                if 'element' in e:self.assertIn('tab', e);self.assertRegex(e['element'], r'^[a-z-]+$')
                # Shown through the page translator, so both texts need every locale.
                self.assertIn(e['title'], messages);self.assertIn(e['text'], messages)


if __name__ == '__main__':
    unittest.main()
