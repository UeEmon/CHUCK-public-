"""Space weather daily briefing: UTC timetable, data gates, rights, per-step AI settings, metered usage and the MP4."""
from datetime import date, datetime, timedelta, timezone
import http.client
import json
import os
from pathlib import Path
import shutil
import stat
import subprocess
import sys
import tempfile
import threading
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'app'))
sys.path.insert(0, str(Path(__file__).resolve().parent))
import briefing as b
import briefing_ai as ai
from public_data import write_file
from space_weather_view import kp_series

RUN = date(2026, 11, 3)
FREEZE = datetime(2026, 11, 3, 2, 40, tzinfo=timezone.utc)
SECRET = 'sk-test-' + 'x' * 40
FFMPEG = bool(shutil.which('ffmpeg') and shutil.which('ffprobe'))


def fetched_files(directory, run_date=RUN, frozen_at=FREEZE, drop=(), edit=None):
    """Put mock NOAA products in a fetcher data folder, as the fetcher would have saved them."""
    files = b.mock_files(run_date, frozen_at)
    for key, (raw, fetched_at, url) in files.items():
        if key in drop:
            continue
        if edit and key in edit:
            raw = edit[key](raw)
        write_file(Path(directory), key, raw, {'key': key, 'url': url, 'fetched_at': fetched_at, 'sha256': __import__('hashlib').sha256(raw).hexdigest()})


def configure(maker, provider='gemini', review='openai'):
    steps = {step: {'provider': provider, 'model': 'model-for-' + step} for step in ai.STEPS}
    steps['review'] = {'provider': review, 'model': 'review-model'}
    for step, kind in ai.STEPS.items():
        if kind == 'speech':
            steps[step]['voice'] = 'voice1'
    maker.settings.save({'revision': maker.settings.read()['revision'], 'steps': steps,
                         'providers': {'gemini': {'api_key': SECRET}, 'openai': {'api_key': SECRET}, 'claude': {'api_key': SECRET}},
                         'pricing': {provider + '/model-for-script': {'input': 0.1, 'output': 0.4, 'source_url': 'https://example.com/prices', 'checked_on': '2026-11-03'}}})


class FakeAI:
    """Answers each step like a well-behaved model, with provider-shaped usage records."""
    def __init__(self, override=None):
        self.requests = []
        self.override = override or {}

    def generate_json(self, cfg, system, user, schema, max_tokens=8000):
        self.requests.append((cfg['step'], cfg['provider'], user))
        data = json.loads(user)
        if cfg['step'] in self.override:
            value = self.override[cfg['step']]
        elif cfg['step'] == 'script':
            missing = {t for seg in b.MOCK['en'].values() for t in b.TOKEN.findall(seg)} - set(data['tokens'])
            value = {seg: b.without(b.MOCK['en'][seg], missing) for seg in b.SEGMENTS}
        elif cfg['step'] == 'review':
            value = {'verdict': 'pass', 'issues': []}
        else:
            tokens = {t for seg in data['english'].values() for t in b.TOKEN.findall(seg)}
            missing = {t for lang in b.MOCK.values() for seg in lang.values() for t in b.TOKEN.findall(seg)} - tokens
            value = {lang: {seg: b.without(b.MOCK[lang][seg], missing) for seg in b.SEGMENTS} for lang in data['target_languages']}
        call = {'step': cfg['step'], 'provider': cfg['provider'], 'model_id': cfg['model'], 'execution_mode': 'sync', 'kind': 'text', 'external': True,
                'provider_request_id': 'req-1', 'started_at': '2026-11-03T02:40:00Z', 'duration_seconds': 0.5, 'status': 'completed',
                'usage_kind': 'measured', 'measured': {'input_tokens': 1000, 'output_tokens': 500, 'cached_input_tokens': None, 'reasoning_tokens': None,
                                                       'audio_output_tokens': None, 'total_tokens': 1500}}
        return value, call

    def speak(self, cfg, text, language):
        self.requests.append((cfg['step'], cfg['provider'], text))
        audio = b.wav_bytes(b.mock_speech(text, language))
        return audio, {'step': cfg['step'], 'provider': cfg['provider'], 'model_id': cfg['model'], 'execution_mode': 'sync', 'kind': 'speech',
                       'status': 'completed', 'usage_kind': 'unavailable', 'measured': dict.fromkeys(('input_tokens', 'output_tokens')), 'duration_seconds': .1}


class TimetableTests(unittest.TestCase):
    def test_utc_timetable_across_dates(self):
        at = lambda *a: datetime(*a, tzinfo=timezone.utc)
        self.assertEqual(b.phase(at(2026, 11, 2, 23, 59, 59), RUN), 'WAITING_FOR_0000')
        self.assertEqual(b.phase(at(2026, 11, 3, 0, 0), RUN), 'RETRYING_UNTIL_0230')
        self.assertEqual(b.phase(at(2026, 11, 3, 2, 29, 59), RUN), 'RETRYING_UNTIL_0230')
        self.assertEqual(b.phase(at(2026, 11, 3, 2, 30), RUN), 'FREEZE_WINDOW')
        self.assertEqual(b.phase(at(2026, 11, 3, 3, 0), RUN), 'DEADLINE_PASSED')
        # JST 09:00 is 00:00 UTC; a JST-aware time gives the same answer.
        self.assertEqual(b.phase(datetime(2026, 11, 3, 11, 30, tzinfo=timezone(timedelta(hours=9))), RUN), 'FREEZE_WINDOW')
        leap = b.schedule(date(2028, 2, 29))
        self.assertEqual((leap['window_start'].date(), leap['window_end'].date()), (date(2028, 2, 28), date(2028, 2, 29)))
        year = b.schedule(date(2027, 1, 1))
        self.assertEqual(year['window_start'], at(2026, 12, 31, 0, 0))

    def test_scheduler_and_publishing_are_off(self):
        flags = b.release_flags()
        self.assertEqual((flags['scheduler_enabled'], flags['auto_publish_enabled'], flags['public_delivery_enabled']), (False, False, False))
        with patch.dict(os.environ, {'AUTO_PUBLISH_ENABLED': 'true', 'PUBLIC_DELIVERY_ENABLED': '1'}):
            flags = b.release_flags()
            # Auto publishing means CHUCK's own page; delivery to other services does not exist.
            self.assertTrue(flags['auto_publish_enabled'])
            self.assertFalse(flags['public_delivery_enabled'])
            self.assertTrue(flags['public_delivery_requested'])
        with tempfile.TemporaryDirectory() as d:
            maker = b.Briefing(d, clock=lambda: datetime(2026, 11, 3, 2, 35, tzinfo=timezone.utc))
            self.assertFalse(maker.due())
            with patch.dict(os.environ, {'HF_BRIEFING_SCHEDULER_ENABLED': '1'}):
                self.assertTrue(maker.due())
                self.assertFalse(maker.due(datetime(2026, 11, 3, 1, 0, tzinfo=timezone.utc)))


class FactsTests(unittest.TestCase):
    def facts(self, frozen_at=FREEZE, **kwargs):
        with tempfile.TemporaryDirectory() as d:
            fetched_files(d, **kwargs)
            return b.collect(b.fetcher_files(d), RUN, frozen_at, b.rights({}))

    def test_values_match_the_space_weather_tab(self):
        facts = self.facts()
        files = b.mock_files(RUN, FREEZE)
        feed = lambda key: {'data': json.loads(files[key][0]), 'stale': False, 'url': None, 'fetched_at': 1, 'error': None, 'fetch_state': 'cache'}
        series = kp_series(feed('kp'), feed('kp-forecast'), FREEZE)
        self.assertEqual(facts['kp_series_latest'], series['latest'])
        self.assertEqual(facts['values']['kp_latest']['value'], series['latest']['kp'])
        window = [r['kp'] for r in series['rows'] if r['kind'] != 'predicted' and '2026-11-02' <= r['time'] < '2026-11-03']
        self.assertEqual(len(window), 8)
        self.assertEqual(facts['values']['kp_max24']['value'], max(window))
        self.assertEqual(facts['values']['g_kp_max24']['value'], 1)  # Kp 5 is G1, as in the tab
        self.assertEqual(facts['values']['kp_max24']['kind'], 'observation')
        self.assertEqual(facts['values']['d1_kp']['kind'], 'forecast')
        self.assertEqual(b.check_values(facts['values']), [])

    def test_missing_incomplete_and_stale_required_data(self):
        self.assertFalse(self.facts(drop=('kp',))['products']['kp']['complete'])
        # One 3-hour interval of the window missing is incomplete, not filled in.
        cut = lambda raw: json.dumps([row for row in json.loads(raw) if not row[0].startswith('2026-11-02 06')]).encode()
        products = self.facts(edit={'kp': cut})['products']
        self.assertFalse(products['kp']['complete'])
        self.assertIn('7 of 8', products['kp']['detail'])
        # Freezing long after the latest scale observation makes it stale.
        self.assertFalse(self.facts(frozen_at=FREEZE + timedelta(hours=3))['products']['scales']['fresh'])
        # A broken product is invalid.
        self.assertTrue(self.facts(edit={'scales': lambda raw: b'{not json'})['products']['scales']['invalid'])
        # Missing optional data is omitted and named, never filled.
        facts = self.facts(drop=('drap',))
        self.assertNotIn('drap_haf', facts['values'])
        self.assertFalse(facts['products']['drap']['used'])

    def test_nict_rights_and_external_ai(self):
        self.assertEqual(b.rights({})['nict']['public'], False)
        with self.assertRaises(ValueError):
            b.check_rights({'nict': {'public': True, 'external_ai': True, 'evidence_url': 'http://insecure'}})
        with self.assertRaises(ValueError):
            b.check_rights({'giro': {'public': True, 'external_ai': True, 'evidence_url': 'https://x'}})
        values = {'kp_max24': {'value': 5, 'source': 'kp'}, 'nict_fof2': {'value': 7.2, 'source': 'nict'}, 'date': {'value': '2026-11-03', 'source': None}}
        with tempfile.TemporaryDirectory() as d:
            maker = b.Briefing(d)
            configure(maker, 'gemini')
            maker.settings.save({'revision': maker.settings.read()['revision'],
                                 'rights': b.check_rights({'nict': {'public': True, 'external_ai': False, 'evidence_url': 'https://example.com/agreement'}})})
            state = maker.settings.read()
            self.assertTrue(b.rights(state['rights'])['nict']['public'])
            self.assertEqual(set(maker.allowed(values, 'script', state)), {'kp_max24', 'date'})
            maker.settings.save({'revision': state['revision'], 'steps': {'script': {'provider': 'local'}}})
            self.assertEqual(set(maker.allowed(values, 'script', maker.settings.read())), set(values))


class TemplateTests(unittest.TestCase):
    values = {'date': {'value': '2026-11-03', 'unit': 'date', 'source': None}, 'kp_max24': {'value': 4.33, 'unit': 'kp', 'source': 'kp'}}

    def texts(self, en, **other):
        result = {lang: {seg: 'Text.' for seg in b.SEGMENTS} for lang in b.LANGUAGES}
        for lang in b.LANGUAGES:
            result[lang]['overview'] = other.get(lang, en)
        return result

    def test_values_only_through_tokens(self):
        ok = self.texts('Briefing for {{date}}: highest Kp {{kp_max24}}, below G1.', ja='{{date}}、Kpの最大は{{kp_max24}}でG1未満です。')
        problems = b.check_templates(ok, self.values)
        self.assertEqual([p for p in problems if 'core' not in p], [])
        self.assertTrue(any('digits' in p for p in b.check_templates(self.texts('Kp was 4.33 on {{date}} {{kp_max24}}.'), self.values)))
        self.assertTrue(any('differ' in p for p in b.check_templates(self.texts('{{date}} {{kp_max24}}.', de='{{date}}.'), self.values)))
        self.assertTrue(any('unknown' in p for p in b.check_templates(self.texts('{{date}} {{kp_max24}} {{flare_class}}.'), self.values)))
        broken = self.texts('{{date}} {{kp_max24}}.')
        del broken['ko']
        self.assertIn('ko: missing', b.check_templates(broken, self.values))
        self.assertTrue(any('digits' in p for p in b.check_templates(self.texts('{{date}} {{kp_max24}}.', ja='{{date}} {{kp_max24}} ３日間。'), self.values)))

    def test_each_language_gets_its_own_formatting(self):
        item = {'value': 4.33, 'unit': 'kp'}
        self.assertEqual([b.render_value(item, lang) for lang in ('en', 'de', 'ja')], ['4.33', '4,33', '4.33'])
        self.assertEqual(b.render_value({'value': 35, 'unit': 'percent'}, 'fr'), '35 %')
        self.assertEqual(b.render_value({'value': '2026-11-03T00:00:00+00:00', 'unit': 'datetime'}, 'en'), b.day_text('2026-11-03', 'en') + ' 00:00 UTC')
        self.assertEqual(b.render_value({'value': '2026-11-02T18:00:00+00:00', 'unit': 'period'}, 'en'), b.day_text('2026-11-02', 'en') + ' 18:00–21:00 UTC')
        self.assertEqual(b.day_text('2026-11-03', 'ja'), '2026年11月3日')
        self.assertEqual(b.day_text('2026-11-03', 'de'), '3. November 2026')

    def test_slide_text_stays_inside_its_box(self):
        slide = b.Slide('impacts', '2026-11-03', 'footer')
        lines = slide.text(84, 300, 'Daytime absorption may weaken low HF bands during the sunlit hours.', 20, width=330)
        self.assertGreater(lines, 1)
        self.assertIn('<tspan', slide.parts[-1])
        self.assertIn('xml:space="preserve"', slide.parts[-1])  # '  |  ' separators are drawn as written
        self.assertEqual(b.check_slides({'impacts': slide}), [])
        slide.text(1200, 400, 'A line that runs past the right edge of the slide', 22)
        self.assertEqual(len(b.check_slides({'impacts': slide})), 1)

    def test_subtitle_languages_follow_chuck(self):
        """Same languages, order and labels as CHUCK's language menu, so a viewer finds their language at once."""
        import re
        static = Path(__file__).resolve().parents[1] / 'app' / 'static'
        locales = re.search(r"locales=\[([^\]]+)\]", (static / 'i18n.js').read_text())[1]
        self.assertEqual(b.LANGUAGES, tuple(x.strip(" '") for x in locales.split(',')))
        menu = re.search(r'<select id="language"[^>]*>(.*?)</select>', (static / 'index.html').read_text())[1]
        self.assertEqual(b.NATIVE_NAMES, dict(re.findall(r'<option value="([a-z]+)">([^<]+)</option>', menu)))
        self.assertEqual(set(b.ISO639_2), set(b.LANGUAGES))
        self.assertEqual(ai.AUDIO_ORDER, ('en',) + tuple(x for x in b.LANGUAGES if x != 'en'))
        self.assertEqual(set(ai.SPEECH_STYLE), set(b.LANGUAGES))  # every language can be a voice

    def test_speech_loses_the_bursts_around_it_but_no_speech(self):
        import math as m
        rate = b.RATE
        tone = lambda seconds, amp: b''.join(int(amp * m.sin(2 * m.pi * 440 * i / rate)).to_bytes(2, 'little', signed=True) for i in range(int(seconds * rate)))
        quiet = lambda seconds: b'\x00\x00' * int(seconds * rate)
        speech = tone(.6, 8000) + quiet(.1) + tone(.5, 8000)  # a short pause inside speech stays
        raw = tone(.05, 3000) + quiet(.3) + speech + quiet(.4) + tone(.15, 30000) + quiet(.05)
        out = b.trimmed(raw)
        self.assertAlmostEqual(len(out) / 2 / rate, len(speech) / 2 / rate + .15, delta=.03)
        self.assertLess(max(abs(int.from_bytes(out[i:i + 2], 'little', signed=True)) for i in range(0, len(out), 2)), 8001)
        self.assertEqual(b.trimmed(quiet(.5)), quiet(.5))

    def test_noaa_is_read_as_a_word_but_written_as_noaa(self):
        self.assertEqual(b.as_spoken('NOAAの現在の発表は、NOAA-SWPC', 'ja'), 'ノアの現在の発表は、ノア-SWPC')
        self.assertEqual(b.as_spoken('NOAA reports; NOAAX stays', 'en'), 'Noah reports; NOAAX stays')
        self.assertEqual(set(b.SPOKEN_AS), set(b.LANGUAGES))

    def test_noaa_g_forecast_leads_over_the_kp_implied_level(self):
        kp = {'value': 4.67, 'unit': 'kp', 'source': 'kp-forecast'}
        official = {'d1_kp': kp, 'd1_g': {'value': 1, 'unit': 'scale', 'source': 'scales'}}
        self.assertEqual(b.check_values(official), [])  # NOAA may forecast G1 with a maximum Kp of 4.67
        implied = {'d1_kp': kp, 'd1_g': {'value': 1, 'unit': 'scale', 'source': 'kp-forecast'}}
        self.assertEqual(b.check_values(implied), ['d1_g: does not follow from Kp'])

    def test_slides_are_english_and_subtitles_are_ordered(self):
        slide = b.Slide('overview', '2026-11-03', 'footer')
        self.assertEqual(b.check_slides({'overview': slide}), [])
        slide.text(0, 0, '宇宙天気')
        self.assertEqual(len(b.check_slides({'overview': slide})), 1)
        plan = {seg: (i * 10.0, 10.0) for i, seg in enumerate(b.SEGMENTS)}
        texts = {seg: 'First sentence for {{date}}. Second sentence that is a little longer.' for seg in b.SEGMENTS}
        items = b.cues(texts, self.values, 'de', plan, {seg: 8.0 for seg in b.SEGMENTS})
        self.assertEqual(b.check_cues({'de': items}, 60.0), [])
        self.assertIn('3. November 2026.', items[0]['text'])  # split before filling, so the date stays whole
        self.assertEqual(len(b.check_cues({'de': items[::-1]}, 60.0)), 1)
        self.assertIn('00:00:10,000 --> ', b.srt(items))
        self.assertTrue(b.vtt(items).startswith('WEBVTT'))


class SettingsTests(unittest.TestCase):
    def test_keys_steps_and_prices(self):
        with tempfile.TemporaryDirectory() as d, patch.dict(os.environ, {'GEMINI_API_KEY': 'env-key', 'OPENAI_API_KEY': ''}):
            s = ai.BriefingSettings(Path(d) / 'settings.json')
            self.assertEqual(s.credential('gemini')[1], 'environment')
            snap = s.save({'revision': 0, 'providers': {'openai': {'api_key': SECRET}},
                           'steps': {'tts_en': {'provider': 'openai', 'model': 'tts-model', 'voice': 'alloy'}, 'review': {'provider': 'none'}}})
            self.assertNotIn(SECRET, json.dumps(snap))
            self.assertEqual(stat.S_IMODE((Path(d) / 'settings.json').stat().st_mode), 0o600)
            self.assertEqual(snap['providers'][1]['credential'], 'saved')
            self.assertIsNone(s.step('review'))
            self.assertEqual(s.step('tts_en')['api_key'], SECRET)
            for bad in ({'steps': {'tts_ja': {'provider': 'claude'}}}, {'steps': {'script': {'provider': 'none'}}},
                        {'steps': {'script': {'model': 'bad model'}}}, {'providers': {'local': {'endpoint': 'ftp://x'}}},
                        {'pricing': {'openai/m': {'input': -1}}}, {'pricing': {'openai/m': {'source_url': 'http://x'}}}):
                with self.assertRaises(ValueError):
                    s.save({'revision': snap['revision'], **bad})
            with self.assertRaises(ai.SettingsConflict):
                s.save({'revision': 0})
            snap = s.save({'revision': snap['revision'], 'providers': {'openai': {'clear_api_key': True}}})
            self.assertEqual(snap['providers'][1]['credential'], 'none')
            self.assertIn('script', snap['problems'])

    def test_languages_are_chosen_and_only_their_steps_are_required(self):
        with tempfile.TemporaryDirectory() as d:
            path = Path(d) / 'settings.json'
            # Settings saved before the choice existed: the Japanese translation step becomes the translation step.
            path.write_text(json.dumps({'revision': 3, 'steps': {'translate_ja': {'provider': 'openai', 'model': 'old-model'}}}))
            s = ai.BriefingSettings(path)
            state = s.read()
            self.assertEqual(state['steps']['translate'], {'provider': 'openai', 'model': 'old-model', 'voice': ''})
            self.assertEqual(ai.chosen_languages(state), (('en', 'ja'), b.LANGUAGES, ('en',) + tuple(x for x in b.LANGUAGES if x != 'en')))
            self.assertTrue({'tts_en', 'tts_ja'} <= set(s.problems(state)) and 'tts_fr' not in s.problems(state))
            for bad in ({'audio': [], 'subtitles': ['en']}, {'audio': ['xx'], 'subtitles': []}, {'audio': 'en', 'subtitles': []}, ['en']):
                with self.assertRaises(ValueError):
                    s.save({'revision': 3, 'languages': bad})
            snap = s.save({'revision': 3, 'languages': {'audio': ['ko', 'fr', 'en'], 'subtitles': ['ko', 'ja']}})
            self.assertEqual(snap['languages'], {'audio': ['en', 'fr', 'ko'], 'subtitles': ['ja', 'ko']})  # English leads, then CHUCK's order
            self.assertEqual(ai.chosen_languages(s.read()), (('en', 'fr', 'ko'), ('ja', 'ko'), ('en', 'ja', 'fr', 'ko')))
            problems = s.problems()
            self.assertTrue({'tts_en', 'tts_fr', 'tts_ko'} <= set(problems) and not {'tts_ja', 'tts_de'} & set(problems))
            snap = s.save({'revision': snap['revision'], 'languages': {'audio': ['en'], 'subtitles': ['en']}})
            self.assertNotIn('translate', snap['problems'])  # English only: nothing to translate

    def test_claude_and_ollama_have_no_speech(self):
        for cfg in ({'provider': 'claude', 'model': 'm', 'voice': 'v', 'api_key': 'k'}, {'provider': 'local', 'protocol': 'ollama', 'model': 'm', 'voice': 'v', 'api_key': ''}):
            with self.assertRaises(ai.AIError):
                ai.speak(cfg, 'text', 'en')

    def test_usage_is_read_by_type_and_never_invented(self):
        self.assertEqual(ai.usage('openai', '', {'usage': {'input_tokens': 10, 'output_tokens': 5, 'input_tokens_details': {'cached_tokens': 2}}})['cached_input_tokens'], 2)
        self.assertEqual(ai.usage('claude', '', {'usage': {'input_tokens': 7, 'output_tokens': 3, 'cache_read_input_tokens': 1}})['input_tokens'], 7)
        gemini = ai.usage('gemini', '', {'usageMetadata': {'promptTokenCount': 9, 'candidatesTokenCount': 4, 'thoughtsTokenCount': 6}})
        self.assertEqual((gemini['input_tokens'], gemini['output_tokens'], gemini['reasoning_tokens']), (9, 4, 6))
        audio = ai.usage('gemini', '', {'usageMetadata': {'promptTokenCount': 9, 'candidatesTokensDetails': [{'modality': 'AUDIO', 'tokenCount': 700}]}})
        self.assertEqual((audio['audio_output_tokens'], audio['output_tokens']), (700, None))
        self.assertEqual(ai.usage('local', 'ollama', {'prompt_eval_count': 3, 'eval_count': 4})['output_tokens'], 4)
        self.assertTrue(all(v is None for v in ai.usage('openai', '', {}).values()))
        self.assertTrue(all(v is None for v in ai.usage('openai', '', {'usage': {'input_tokens': 'many'}}).values()))

    def test_calculated_cost_needs_measured_usage_and_a_price(self):
        pricing = {'gemini/m': {'input': 0.1, 'output': 0.4, 'cached_input': None, 'audio_output': None}}
        call = {'provider': 'gemini', 'model_id': 'm', 'kind': 'text', 'usage_kind': 'measured',
                'measured': {'input_tokens': 1_000_000, 'output_tokens': 500_000, 'reasoning_tokens': 500_000, 'cached_input_tokens': None, 'audio_output_tokens': None},
                'estimated_input_tokens': 10, 'estimated_output_tokens': 10}
        self.assertEqual(b.cost(call, pricing)['calculated_usd_from_measured_usage'], 0.5)  # Gemini bills thinking as output
        self.assertIsNone(b.cost(dict(call, usage_kind='unavailable'), pricing)['calculated_usd_from_measured_usage'])
        self.assertIsNone(b.cost(dict(call, model_id='other'), pricing)['calculated_usd_from_measured_usage'])


@unittest.skipUnless(FFMPEG, 'ffmpeg and ffprobe are needed to render the MP4')
class RunTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)

    def test_mock_run_makes_one_mp4_with_eleven_streams_and_holds(self):
        maker = b.Briefing(self.tmp.name, clock=lambda: datetime(2026, 11, 3, 9, 0, tzinfo=timezone.utc))
        qa = maker.run('mock', '2026-11-03')
        self.assertEqual(qa['release_state'], 'HOLD')
        self.assertEqual(qa['hold_reasons'], ['PRODUCTION_INPUT'])  # mock data is never ready for release
        self.assertFalse(qa['published'])
        self.assertTrue(qa['media']['ok'])
        self.assertEqual(qa['media']['streams'], 11)
        out = maker.run_dir('2026-11-03', qa['run_id'])
        mp4 = next(out.glob('space_weather_*.mp4'))
        streams = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-of', 'json', str(mp4)],
                                            check=True, capture_output=True).stdout)['streams']
        tracks = [(s['tags'].get('language'), s['tags'].get('handler_name')) for s in streams if s['codec_type'] == 'subtitle']
        self.assertEqual(tracks, [(b.ISO639_2[x], b.NATIVE_NAMES[x]) for x in b.LANGUAGES])
        self.assertEqual(tracks[0], ('jpn', b.NATIVE_NAMES['ja']))
        audio = [(s['tags'].get('language'), s['tags'].get('handler_name')) for s in streams if s['codec_type'] == 'audio']
        self.assertEqual(audio, [('eng', 'English'), ('jpn', b.NATIVE_NAMES['ja'])])
        for lang in b.LANGUAGES:
            self.assertTrue((out / 'subtitles' / (lang + '.srt')).read_text().startswith('1\n'))
            self.assertTrue((out / 'subtitles' / (lang + '.vtt')).exists())
        cost = json.loads((out / 'cost_report.json').read_text())
        self.assertEqual((cost['api_calls'], cost['metered_tokens'], cost['measured_provider_cost']), (0, None, None))
        briefing = json.loads((out / 'briefing.json').read_text())
        self.assertEqual(len(briefing['segments']), 6)
        self.assertEqual(set(briefing['segments'][0]['subtitles']), set(b.LANGUAGES))
        self.assertTrue(briefing['segments'][4]['citations'])
        self.assertEqual(maker.file('2026-11-03', qa['run_id'], 'subtitles/../qa_report.json'), None)
        self.assertEqual(maker.file('2026-11-03', qa['run_id'], 'raw/kp.raw'), None)
        self.assertIsNotNone(maker.file('2026-11-03', qa['run_id'], 'subtitles/ko.vtt'))

    @unittest.skipUnless(FFMPEG, 'ffmpeg is needed')
    def test_mock_run_carries_only_the_chosen_languages(self):
        maker = b.Briefing(self.tmp.name, clock=lambda: datetime(2026, 11, 3, 9, 0, tzinfo=timezone.utc))
        maker.settings.save({'revision': 0, 'languages': {'audio': ['fr', 'ja'], 'subtitles': ['ko']}})
        qa = maker.run('mock', '2026-11-03')
        self.assertEqual(qa['hold_reasons'], ['PRODUCTION_INPUT'])
        self.assertTrue(qa['media']['ok'], qa['media'])
        self.assertEqual(qa['quality_gates']['LANGUAGES_COMPLETE'], {'passed': True, 'detail': 'audio ja, fr; subtitles ko'})
        self.assertEqual([a['language'] for a in qa['media']['audio']], ['jpn', 'fra'])
        self.assertEqual([x['language'] for x in qa['media']['subtitles']], ['kor'])
        out = maker.run_dir('2026-11-03', qa['run_id'])
        self.assertEqual(sorted(p.name for p in out.glob('audio_*.wav')), ['audio_fr.wav', 'audio_ja.wav'])
        self.assertEqual(sorted(p.name for p in (out / 'subtitles').iterdir()), ['ko.srt', 'ko.vtt'])
        self.assertIsNotNone(maker.file('2026-11-03', qa['run_id'], 'audio_fr.wav'))
        briefing = json.loads((out / 'briefing.json').read_text())
        self.assertEqual((set(briefing['segments'][0]['narration']), set(briefing['segments'][0]['subtitles'])), ({'ja', 'fr'}, {'ko'}))

    def test_live_run_with_metered_calls_is_ready_locally_and_never_published(self):
        fetched_files(self.tmp.name)
        maker = b.Briefing(self.tmp.name, clock=lambda: FREEZE)
        configure(maker, 'gemini')
        fake = FakeAI()
        with patch.object(ai, 'generate_json', fake.generate_json), patch.object(ai, 'speak', fake.speak):
            qa = maker.run('live', '2026-11-03')
        self.assertEqual(qa['release_state'], 'READY_LOCAL', qa['quality_gates'])
        self.assertFalse(qa['published'])
        self.assertFalse(qa['quality_gates']['RELEASE_POLICY']['passed'])
        self.assertEqual([c['step'] for c in qa['calls'][:4]], ['script', 'translate', 'translate', 'review'])  # seven languages, four per call
        out = maker.run_dir('2026-11-03', qa['run_id'])
        cost = json.loads((out / 'cost_report.json').read_text())
        self.assertEqual(cost['api_calls'], 4 + 12)
        script = cost['model_calls'][0]
        self.assertEqual(script['measured']['input_tokens'], 1000)
        self.assertEqual(script['calculated_usd_from_measured_usage'], 0.0003)
        self.assertEqual(script['estimated_input_tokens'] > 0, True)
        self.assertIsNone(cost['calculated_usd_from_measured_usage'])  # other steps have no price, so no total is claimed
        # The NICT product (rights pending) never reached the external AI.
        self.assertTrue(all('nict' not in request for _, _, request in fake.requests))
        # Keys never appear in any output file.
        for path in out.rglob('*'):
            if path.is_file():
                self.assertNotIn(SECRET.encode(), path.read_bytes(), path)
        # A second run for the same day reuses the cache and is a separate run with the same idempotency key.
        with patch.object(ai, 'generate_json', side_effect=AssertionError('cache expected')), patch.object(ai, 'speak', side_effect=AssertionError('cache expected')):
            again = b.Briefing(self.tmp.name, clock=lambda: FREEZE + timedelta(seconds=5))
            second = again.run('live', '2026-11-03')
        self.assertEqual(second['idempotency_key'], qa['idempotency_key'])
        self.assertNotEqual(second['run_id'], qa['run_id'])
        self.assertEqual(second['cost']['api_calls'], 0)
        self.assertEqual(second['cost']['cache_hits'], 16)
        # Replay uses the frozen bytes of the last real run.
        with patch.object(ai, 'generate_json', side_effect=AssertionError), patch.object(ai, 'speak', side_effect=AssertionError):
            replay = b.Briefing(self.tmp.name, clock=lambda: FREEZE + timedelta(seconds=10)).run('replay', '2026-11-03')
        self.assertEqual(replay['quality_gates']['DATA_COMPLETE']['passed'], True)

    @unittest.skipUnless(FFMPEG, 'ffmpeg is needed')
    def test_auto_publish_copies_a_passed_live_run_for_chuck(self):
        fetched_files(self.tmp.name)
        maker = b.Briefing(self.tmp.name, clock=lambda: FREEZE)
        configure(maker, 'gemini')
        fake = FakeAI()
        with patch.object(ai, 'generate_json', fake.generate_json), patch.object(ai, 'speak', fake.speak), \
                patch.dict(os.environ, {'AUTO_PUBLISH_ENABLED': '1', 'HF_BRIEFING_SCHEDULER_ENABLED': '1'}):
            manual = maker.run('live', '2026-11-03')
            self.assertEqual((manual['release_state'], manual['published']), ('READY_LOCAL', False))  # a run started by hand stays local
            self.assertEqual(maker.published(), [])
            qa = b.Briefing(self.tmp.name, clock=lambda: FREEZE + timedelta(seconds=2)).run('live', '2026-11-03', scheduled=True)
            self.assertEqual(qa['release_state'], 'PUBLISHED', qa['quality_gates'])
            self.assertTrue(qa['published'] and qa['quality_gates']['RELEASE_POLICY']['passed'])
            # A published day is not made again by the scheduler.
            self.assertFalse(b.Briefing(self.tmp.name, clock=lambda: datetime(2026, 11, 3, 2, 45, tzinfo=timezone.utc)).due())
            # Mock and replay runs are never published, even with publishing on.
            mock = b.Briefing(self.tmp.name, clock=lambda: FREEZE + timedelta(seconds=20)).run('mock', '2026-11-04')
            self.assertEqual(mock['release_state'], 'HOLD')
        [meta] = maker.published()
        self.assertEqual((meta['run_date_utc'], meta['run_id'], meta['audio'], meta['subtitles']), ('2026-11-03', qa['run_id'], ['en', 'ja'], list(b.LANGUAGES)))
        self.assertTrue(meta['sources'] and all(src['url'].startswith('https://') for src in meta['sources']))
        self.assertNotIn('nict', json.dumps(meta).lower())
        for lang, code in (('en', 'eng'), ('ja', 'jpn')):
            mp4 = maker.published_file('2026-11-03', f'video_{lang}.mp4')
            streams = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-of', 'json', str(mp4)], check=True, capture_output=True).stdout)['streams']
            self.assertEqual([(st['codec_type'], (st.get('tags') or {}).get('language')) for st in streams if st['codec_type'] != 'video'], [('audio', code)])
        self.assertIsNotNone(maker.published_file('2026-11-03', 'subtitles/ko.vtt'))
        self.assertIsNone(maker.published_file('2026-11-03', 'subtitles/../meta.json'))
        self.assertIsNone(maker.published_file('2026-11-03', 'audio_en.wav'))
        for path in (maker.root / 'published').rglob('*'):
            if path.is_file():
                self.assertNotIn(SECRET.encode(), path.read_bytes(), path)
        self.assertTrue(maker.unpublish('2026-11-03'))
        self.assertEqual(maker.published(), [])
        self.assertFalse(maker.unpublish('2026-11-03'))
        with self.assertRaises(ValueError):
            maker.unpublish('../x')

    def test_hold_without_required_data_calls_no_ai(self):
        fetched_files(self.tmp.name, drop=('kp-forecast',))
        maker = b.Briefing(self.tmp.name, clock=lambda: FREEZE)
        configure(maker)
        with patch.object(ai, 'generate_json', side_effect=AssertionError('no AI call expected')):
            qa = maker.run('live', '2026-11-03')
        self.assertEqual(qa['release_state'], 'HOLD')
        self.assertIn('DATA_COMPLETE', qa['hold_reasons'])
        self.assertEqual(qa['calls'], [])

    def test_ai_writing_numbers_or_a_late_run_holds(self):
        fetched_files(self.tmp.name)
        maker = b.Briefing(self.tmp.name, clock=lambda: FREEZE)
        configure(maker)
        invented = {seg: 'A flare of class X2 was seen on {{date}}.' if seg == 'solar' else b.MOCK['en'][seg] for seg in b.SEGMENTS}
        fake = FakeAI({'script': invented})
        with patch.object(ai, 'generate_json', fake.generate_json), patch.object(ai, 'speak', fake.speak):
            qa = maker.run('live', '2026-11-03')
        self.assertIn('FACTS_VALID', qa['hold_reasons'])
        self.assertEqual([c['step'] for c in qa['calls']], ['script'])  # stopped before translation and speech
        late = b.Briefing(self.tmp.name, clock=lambda: datetime(2026, 11, 3, 4, 0, tzinfo=timezone.utc))
        fetched_files(self.tmp.name, frozen_at=datetime(2026, 11, 3, 4, 0, tzinfo=timezone.utc))
        with patch.object(ai, 'generate_json', FakeAI().generate_json), patch.object(ai, 'speak', FakeAI().speak):
            qa = late.run('live', '2026-11-03')
        self.assertIn('SCHEDULE_OK', qa['hold_reasons'])


class AdminPageTests(unittest.TestCase):
    def setUp(self):
        import public_data_server
        import public_data_ui as ui
        from http.server import ThreadingHTTPServer
        from test_public_data import TOKEN
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.maker = b.Briefing(self.tmp.name)
        for p in [patch.object(public_data_server, 'BRIEFING', self.maker),
                  patch.dict(os.environ, {'HF_PUBLIC_DATA_UI_PASSWORD': 'dedicated-fetcher-password', 'HF_PUBLIC_DATA_TOKEN': TOKEN})]:
            p.start()
            self.addCleanup(p.stop)
        ui.SESSIONS.clear()
        ui.FAILURES.clear()
        self.http = ThreadingHTTPServer(('127.0.0.1', 0), public_data_server.Handler)
        threading.Thread(target=self.http.serve_forever, daemon=True).start()
        self.addCleanup(self.http.server_close)
        self.addCleanup(self.http.shutdown)
        self.origin = f'http://127.0.0.1:{self.http.server_port}'

    def request(self, path, data=None, cookie=None):
        headers = {'Origin': self.origin, 'Content-Type': 'application/json', **({'Cookie': cookie} if cookie else {})}
        c = http.client.HTTPConnection('127.0.0.1', self.http.server_port)
        c.request('GET' if data is None else 'POST', path, None if data is None else json.dumps(data), headers)
        response = c.getresponse()
        body = response.read()
        kind = response.getheader('Content-Type', '')
        c.close()
        return response.status, json.loads(body) if kind.startswith('application/json; charset') else body

    def test_settings_and_status_never_show_keys(self):
        self.assertEqual(self.request('/ui/api/briefing')[0], 401)
        c = http.client.HTTPConnection('127.0.0.1', self.http.server_port)
        c.request('POST', '/ui/api/login', json.dumps({'password': 'dedicated-fetcher-password'}), {'Origin': self.origin, 'Content-Type': 'application/json'})
        cookie = c.getresponse().getheader('Set-Cookie').split(';')[0]
        c.close()
        code, status = self.request('/ui/api/briefing', cookie=cookie)
        self.assertEqual(code, 200)
        self.assertFalse(status['flags']['auto_publish_enabled'])
        self.assertEqual(status['settings']['steps']['review']['provider'], 'openai')
        code, status = self.request('/ui/api/briefing/settings', {'revision': 0, 'providers': {'claude': {'api_key': SECRET}},
                                                                  'steps': {'script': {'provider': 'claude', 'model': 'some-claude-model'}},
                                                                  'rights': {'nict': {'public': False, 'external_ai': False, 'evidence_url': 'https://example.com/terms'}}}, cookie=cookie)
        self.assertEqual(code, 200)
        self.assertNotIn(SECRET, json.dumps(status))
        self.assertEqual(status['rights']['nict']['source'], 'administrator')
        self.assertEqual(self.request('/ui/api/briefing/settings', {'revision': 0}, cookie=cookie)[0], 409)
        self.assertEqual(self.request('/ui/api/briefing/settings', {'revision': 1, 'steps': {'tts_en': {'provider': 'claude'}}}, cookie=cookie)[0], 400)
        self.assertEqual(self.request('/ui/api/briefing/run', {'mode': 'publish'}, cookie=cookie)[0], 400)
        self.assertEqual(self.request('/ui/api/briefing/file?date=2026-11-03&run=x&name=../settings.json', cookie=cookie)[0], 404)
        self.assertEqual(self.request('/ui/api/briefing/models', {'provider': 'nope'}, cookie=cookie)[0], 400)
        # A key typed but not saved lists the models once and is never stored.
        seen = []
        def listing(cfg):
            seen.append(cfg['api_key'])
            if not cfg['api_key']:
                raise ai.AIError('APIキーを設定してください')
            return [{'id': 'model-a', 'label': 'Model A'}]
        with patch.object(ai, 'list_models', listing):
            self.assertEqual(self.request('/ui/api/briefing/models', {'provider': 'openai'}, cookie=cookie)[0], 502)
            status, body = self.request('/ui/api/briefing/models', {'provider': 'openai', 'api_key': ' typed-key-123 '}, cookie=cookie)
            self.assertEqual((status, body['models'][0]['id']), (200, 'model-a'))
            self.assertEqual(self.request('/ui/api/briefing/models', {'provider': 'openai', 'api_key': 'bad\nkey'}, cookie=cookie)[0], 400)
        self.assertEqual(seen, ['', 'typed-key-123'])
        self.assertNotIn('typed-key-123', json.dumps(self.request('/ui/api/briefing', cookie=cookie)[1]))
        # The recommendation lists only providers with a key (Claude saved above, Gemini typed) and saves nothing.
        asked = []
        def lists(cfg):
            asked.append(cfg['provider'])
            if cfg['provider'] == 'local':
                raise ai.AIError('接続できませんでした')
            return {'claude': [{'id': 'claude-opus-9-1'}, {'id': 'claude-haiku-9-1'}],
                    'gemini': [{'id': 'gemini-9-pro'}, {'id': 'gemini-9-flash-lite'}, {'id': 'gemini-9-flash-lite-tts'}]}[cfg['provider']]
        with patch.object(ai, 'list_models', lists):
            self.assertEqual(self.request('/ui/api/briefing/recommend', {'priority': 'cheap'}, cookie=cookie)[0], 400)
            status, body = self.request('/ui/api/briefing/recommend', {'priority': 'cost', 'keys': {'gemini': 'typed-gemini-456'}}, cookie=cookie)
        self.assertEqual(status, 200)
        self.assertNotIn('openai', asked)
        self.assertEqual(body['steps']['script'], {'provider': 'gemini', 'model': 'gemini-9-flash-lite'})
        self.assertEqual(body['steps']['review'], {'provider': 'claude', 'model': 'claude-haiku-9-1'})
        self.assertEqual(body['steps']['tts_ja'], {'provider': 'gemini', 'model': 'gemini-9-flash-lite-tts'})
        self.assertNotIn('typed-gemini-456', json.dumps(body))
        settings = self.request('/ui/api/briefing', cookie=cookie)[1]['settings']
        self.assertEqual(settings['steps']['tts_ja']['model'], '')
        # Voices: listed with the saved or typed key; the key never comes back.
        with patch.object(ai, 'list_voices', lambda cfg, model='': {'voices': [{'id': 'v-' + cfg['api_key'][:3], 'label': model}], 'source': 'api',
                                                                    'source_url': None, 'checked_on': None}):
            status, body = self.request('/ui/api/briefing/voices', {'provider': 'gemini', 'model': 'm', 'api_key': 'typed-voice-789'}, cookie=cookie)
            self.assertEqual((status, body['voices']), (200, [{'id': 'v-typ', 'label': 'm'}]))
            self.assertNotIn('typed-voice-789', json.dumps(body))
            self.assertEqual(self.request('/ui/api/briefing/voices', {'provider': 'gemini', 'model': 5}, cookie=cookie)[0], 400)
        self.assertNotIn('typed-gemini-456', json.dumps(settings))


class ModelChoiceTests(unittest.TestCase):
    MODELS = ['gemini-8-pro', 'gemini-9-pro', 'gemini-9-flash', 'gemini-9-flash-lite', 'gemini-10-pro-preview', 'gemini-9-flash-tts',
              'gemini-9-flash-lite-tts', 'gemini-9-pro-tts', 'imagen-9', 'text-embedding-9', 'claude-opus-9-1', 'claude-opus-9',
              'claude-opus-8-20250101', 'claude-sonnet-9-1', 'claude-haiku-9-1', 'gpt-9', 'gpt-9-20260101', 'gpt-9-mini', 'gpt-8',
              'gpt-9-nano', 'gpt-9-mini-tts', 'o9', 'o8-mini', 'gpt-9-latest']

    def marked(self, prefix=''):
        return ai.mark_current([{'id': m} for m in self.MODELS if m.startswith(prefix)])

    def test_only_the_newest_current_generation_of_each_family(self):
        current = {m['id'] for m in self.marked() if m['current']}
        self.assertEqual(current, {'gemini-9-pro', 'gemini-9-flash', 'gemini-9-flash-lite', 'gemini-9-flash-tts', 'gemini-9-flash-lite-tts',
                                   'gemini-9-pro-tts', 'claude-opus-9-1', 'claude-sonnet-9-1', 'claude-haiku-9-1', 'gpt-9', 'gpt-9-mini',
                                   'gpt-9-nano', 'gpt-9-mini-tts', 'o9', 'o8-mini'})
        kinds = {m['id']: m['kind'] for m in self.marked()}
        self.assertEqual((kinds['gemini-9-flash-tts'], kinds['imagen-9'], kinds['gpt-9']), ('speech', 'other', 'text'))

    def test_priorities_pick_by_size_words(self):
        models = {'gemini': self.marked('gemini'), 'claude': self.marked('claude')}
        paid = ('precision', 'balance', 'cost')
        picks = {p: ai.recommend(models, p)['steps'] for p in paid}
        self.assertEqual([picks[p]['script']['model'] for p in paid], ['gemini-9-pro', 'gemini-9-flash', 'gemini-9-flash-lite'])
        self.assertEqual([picks[p]['review']['model'] for p in paid], ['claude-opus-9-1', 'claude-sonnet-9-1', 'claude-haiku-9-1'])
        self.assertEqual([picks[p]['tts_en']['model'] for p in paid], ['gemini-9-pro-tts', 'gemini-9-flash-tts', 'gemini-9-flash-lite-tts'])
        with self.assertRaises(ValueError):
            ai.recommend(models, 'cheap')

    def test_claude_never_gets_speech_and_one_provider_reviews_itself(self):
        result = ai.recommend({'claude': self.marked('claude')}, 'balance')
        self.assertEqual(result['unfilled'], ['tts_' + x for x in ai.AUDIO_ORDER])
        self.assertEqual(result['steps']['review'], result['steps']['script'])
        self.assertEqual(ai.recommend({}, 'cost'), {'steps': {}, 'unfilled': list(ai.STEPS)})

    def test_voices_come_from_gemini_api_or_openai_documentation(self):
        pages = [{'voices': [{'id': 'Voice-b', 'display_name': 'B', 'type': 'prebuilt'}, {'id': 'mine', 'type': 'prompted'}], 'next_page_token': 't'},
                 {'voices': [{'id': 'Voice-a', 'display_name': 'A'}, {'id': 'bad name!'}]}]
        urls = []
        def post(cfg, url, headers, payload, **kw):
            urls.append((url, headers))
            return json.dumps(pages[len(urls) - 1]).encode(), {}
        with patch.object(ai, 'post', post):
            result = ai.list_voices({'provider': 'gemini', 'api_key': 'k'})
        self.assertEqual([v['id'] for v in result['voices']], ['Voice-a', 'Voice-b'])
        self.assertEqual(result['source'], 'api')
        self.assertIn('page_token=t', urls[1][0])
        self.assertEqual(urls[0][1], {'x-goog-api-key': 'k'})
        doc = ai.list_voices({'provider': 'openai', 'api_key': ''}, 'tts-1')
        self.assertEqual((doc['source'], len(doc['voices'])), ('document', len(ai.DOCUMENTED_VOICES['openai']['models']['tts-1'])))
        self.assertGreater(len(ai.list_voices({'provider': 'openai', 'api_key': ''}, 'another-tts')['voices']), len(doc['voices']))
        with self.assertRaises(ai.AIError):
            ai.list_voices({'provider': 'claude', 'api_key': 'k'})
        with self.assertRaises(ai.AIError):
            ai.list_voices({'provider': 'gemini', 'api_key': ''})

    def test_a_family_two_generations_behind_its_line_is_not_current(self):
        models = ai.mark_current([{'id': m} for m in ['gemini-7.5-pro', 'gemini-8.8-flash', 'gemini-9-argon', 'gemini-omni-1.1-flash']])
        self.assertEqual({m['id'] for m in models if m['current']}, {'gemini-8.8-flash', 'gemini-9-argon', 'gemini-omni-1.1-flash'})

    def test_the_script_provider_chosen_by_the_administrator_leads(self):
        models = {'gemini': self.marked('gemini'), 'claude': self.marked('claude')}
        for priority in ('precision', 'balance', 'cost'):
            steps = ai.recommend(models, priority, 'claude')['steps']
            self.assertEqual((steps['script']['provider'], steps['review']['provider'], steps['tts_en']['provider']), ('claude', 'gemini', 'gemini'))
        self.assertEqual(ai.recommend(models, 'cost', 'claude')['steps']['script']['model'], 'claude-haiku-9-1')
        # A choice without a fitting model (or none at all) falls back to the usual order.
        self.assertEqual(ai.recommend(models, 'balance', 'openai')['steps']['script']['provider'], 'gemini')


    def test_free_priority_puts_everything_but_the_review_on_the_free_tier(self):
        models = {'gemini': self.marked('gemini'), 'gemini_free': self.marked('gemini'), 'claude': self.marked('claude'),
                  'openai': self.marked('gpt')}
        steps = ai.recommend(models, 'free', 'claude')['steps']
        self.assertEqual((steps['script'], steps['translate'], steps['tts_fr']),
                         ({'provider': 'gemini_free', 'model': 'gemini-9-flash'}, {'provider': 'gemini_free', 'model': 'gemini-9-flash'},
                          {'provider': 'gemini_free', 'model': 'gemini-9-flash-tts'}))
        # The review stays with another company than Google, on its smallest model.
        self.assertEqual(steps['review'], {'provider': 'openai', 'model': 'gpt-9-nano'})
        # Without another company the free tier reviews itself; without a free key the choice is refused.
        self.assertEqual(ai.recommend({'gemini_free': self.marked('gemini')}, 'free')['steps']['review']['provider'], 'gemini_free')
        with self.assertRaises(ValueError):
            ai.recommend({'gemini': self.marked('gemini')}, 'free')
        # The other priorities never use the free-tier key.
        for priority in ('precision', 'balance', 'cost'):
            self.assertNotIn('gemini_free', {c['provider'] for c in ai.recommend(models, priority)['steps'].values()})

    def test_free_tier_calls_cost_nothing_and_use_the_gemini_api(self):
        call = {'provider': 'gemini_free', 'model_id': 'gemini-9-flash', 'kind': 'text', 'status': 'completed', 'usage_kind': 'measured',
                'measured': {'input_tokens': 1000, 'output_tokens': 500, 'reasoning_tokens': 800}, 'estimated_input_tokens': 900}
        result = b.cost(call, {})
        self.assertEqual((result['calculated_usd_from_measured_usage'], result['estimated_usd'], result['price_basis']), (0.0, 0.0, 'free_tier'))
        report = b.cost_report({'run_date': '2026-11-05', 'run_id': 'r', 'mode': 'live'}, [call], {}, False, 0.16, 1.0)
        self.assertEqual(report['calculated_usd_from_measured_usage'], 0.0)
        self.assertEqual(ai.auth({'provider': 'gemini_free', 'api_key': 'k'}), {'x-goog-api-key': 'k'})
        urls = []
        def post(cfg, url, headers, payload, **kw):
            urls.append(url)
            return json.dumps({'models': [{'name': 'models/gemini-9-flash', 'supportedGenerationMethods': ['generateContent']}]}).encode(), {}
        with patch.object(ai, 'post', post):
            self.assertEqual([m['id'] for m in ai.list_models({'provider': 'gemini_free', 'api_key': 'k'})], ['gemini-9-flash'])
        self.assertTrue(urls[0].startswith('https://generativelanguage.googleapis.com/'))

    def test_a_rate_limited_request_is_sent_again_and_then_fails_without_another_key(self):
        from urllib.error import HTTPError
        attempts, waits = [], []
        class Opener:
            def open(self, request, timeout):
                attempts.append(request.full_url)
                raise HTTPError(request.full_url, 429, 'Too Many Requests', {'Retry-After': '5'} if len(attempts) == 1 else {}, None)
        with patch.object(ai, 'build_opener', lambda *h: Opener()), patch.object(ai, 'SLEEP', waits.append):
            with self.assertRaises(ai.AIError) as caught:
                ai.post({'provider': 'gemini_free'}, 'https://generativelanguage.googleapis.com/x', {}, {})
        self.assertEqual(len(attempts), len(ai.RATE_LIMIT_WAITS) + 1)
        self.assertEqual(waits, [5, *ai.RATE_LIMIT_WAITS[1:]])
        self.assertIn('HTTP 429', str(caught.exception))
        # A busy model (503) is sent again the same way; other errors are not.
        for code, tries in ((503, len(ai.RATE_LIMIT_WAITS) + 1), (500, 1)):
            attempts.clear()
            class Busy:
                def open(self, request, timeout):
                    attempts.append(1)
                    raise HTTPError(request.full_url, code, 'error', {}, None)
            with patch.object(ai, 'build_opener', lambda *h: Busy()), patch.object(ai, 'SLEEP', lambda s: None):
                with self.assertRaises(ai.AIError) as caught:
                    ai.post({'provider': 'gemini'}, 'https://generativelanguage.googleapis.com/x', {}, {})
            self.assertEqual((len(attempts), 'HTTP %d' % code in str(caught.exception)), (tries, True))


if __name__ == '__main__':
    unittest.main()
