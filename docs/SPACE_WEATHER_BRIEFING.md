# 宇宙天気デイブリーフィング（検証版）

追加日: 2026-11-03

公開データ取得用コンテナ（`public-data`）で、NOAAの公開データから宇宙天気のデイリーブリーフィング動画を作ります。実装は「宇宙天気デイリーブリーフィング実装指示書（版数1.0、2026-11-03）」の方針に沿っています。**この版は実装・検証用です。公開・配信の機能はなく、定時の自動作成も既定で無効です。** 作ったファイルは取得用コンテナのデータ領域（`/data/briefing/`）にだけ保存します。

CHUCK本体の画面・API・計算には影響しません。CHUCKの「宇宙天気の実況・予報」タブ（[SPACE_WEATHER_VIEW.md](SPACE_WEATHER_VIEW.md)）と同じ解析関数（`kp_series`・`scale_days`・`kp_storm_level`）で値を読むため、Kp・R/S/G・Gレベル（Kp 5＝G1）はタブの表示と一致します。

## できあがるもの（1回の実行）

| ファイル | 内容 |
|---|---|
| `space_weather_YYYY-MM-DD.mp4` | 英語表記のスライド動画1本。映像1（H.264、1280×720または1920×1080）＋音声2（英語＝既定、日本語、AAC）＋字幕8（CHUCKの画面と同じ言語・順序でja, en, fr, es, it, pt, de, ko、トラック名もCHUCKの言語メニューと同じ「日本語」「English」「Français」…、`mov_text`、言語 `jpn eng fra spa ita por deu kor`）＝11ストリーム |
| `subtitles/<言語>.srt`・`.vtt` | 8言語の字幕（動画に入れたものと同じ） |
| `audio_en.wav`・`audio_ja.wav` | 英日の音声トラック |
| `script_en.md`・`script_ja.md` | 英日の原稿 |
| `briefing.json` | 章ごとの `facts`（使った値）、`narration_en`・`narration_ja`、8言語の `subtitles`、`citations`、目標と実際の尺 |
| `sources_manifest.json` | データごとのURL、取得時刻、SHA-256、観測時刻・有効時刻、必須/任意、欠測・陳腐化・権利の状態 |
| `rights_manifest.json` | データ・図表ごとの `license_id`、根拠URL、公開・外部AI送信の可否、出典表示、確認状態 |
| `qa_report.json` | 品質ゲートの結果、`release_state`（`READY_LOCAL` か `HOLD`）、保留の理由、`published: false` |
| `token_usage.json`・`cost_report.json` | API呼び出しごとの記録と費用（下記） |
| `media_probe.json` | ffprobeとデコードの結果 |
| `run_log.jsonl` | 状態の推移（FETCHING → FROZEN → GENERATING_SCRIPT → TRANSLATING → QA → SYNTHESIZING_AUDIO → RENDERING → VALIDATING → READY_LOCAL / HOLD） |
| `raw/` | 実行に使った提供元の応答そのもの（再現用） |

保存先は `/data/briefing/runs/<対象日>/<実行ID>/` です。14日より古い実行とキャッシュは消します。同じ日に何度実行しても別の実行として残り、公開は行われないため二重公開は起きません（`idempotency_key` は日付ごとに1つ）。

## 時刻の規則（UTC）

| 時刻（UTC） | JST | 扱い |
|---|---|---|
| 前日00:00〜当日00:00 | 前日09:00〜当日09:00 | 観測の集計期間（終了時刻は含まない）。Kpは3時間区間8つがそろって完全 |
| 00:00〜02:30 | 09:00〜11:30 | 取得用コンテナが1分ごとに更新・失敗分の再試行（既存の取得処理） |
| 02:30 | 11:30 | 凍結。その時点のファイルを `raw/` に固定し、品質ゲートにかける |
| 02:30〜03:00 | 11:30〜12:00 | 原稿・翻訳・音声・動画・検査 |
| 03:00 | 12:00 | 締切。間に合わなければ `HOLD` |

予報は02:30までに取得したNOAAの最新の発表を使います。NOAAのR/S/Gの「過去24時間の最大」はNOAA自身の24時間（発表時点まで）で、00:00区切りではありません（値の説明にそう記録します）。管理画面からの試験実行は時刻を問わず実行できますが、02:30〜03:00の外なら `SCHEDULE_OK` が不合格になり `HOLD` です。Mockは02:30の凍結を模擬します。

## データと権利

`app/briefing.py` の `CATALOG` に、データごとの必須/任意、更新間隔、許容遅延、集計規則、ライセンス、公開・外部AI送信の既定値、欠測時の扱いを固定しています。

| データ | 必須 | 公開 | 外部AI | 欠測時 |
|---|---|---|---|---|
| NOAA R/S/Gと3日予報（`scales`） | 必須 | 可 | 可 | HOLD |
| NOAA Kp観測（`kp`） | 必須 | 可 | 可 | HOLD |
| NOAA Kp 3日予報（`kp-forecast`） | 必須 | 可 | 可 | HOLD |
| NOAA D-RAP（`drap`） | 任意 | 可 | 可 | 省略して「なし」と明記 |
| NICT電離圏（`nict`） | 任意 | **未確認（PENDING_RIGHTS）** | **不可** | 省略 |

- NICTの公開ページのデータは、公開物での再配布が包括的に確認できていないため（[DATA_LICENSES.md](../DATA_LICENSES.md)）、既定では原稿にも外部AIにも渡しません。提供元の許諾を確認したら、管理画面の「データの権利」で根拠のURL（https://）とともに変更できます。「公開に使える」でも「外部AIへ送れる」を外したデータは、ローカルLLMを選んだ工程にだけ渡ります。外部AIへの代替は行いません。
- NICTの省庁間連携データ、NASA DONKI、ESA SWE、GFZ Kpには、この版では接続しません（`NOT_CONFIGURED`・`NOT_IMPLEMENTED` として診断に出ます）。不正な取得や推測での補完はしません。
- GIROはLGDCの共有規則により対象外です。
- スライド・グラフはこのコンテナが値から描いたもので、機関の画像・ロゴは使いません。陸地の輪郭はNatural Earth（パブリックドメイン）です。

## 数値を生成AIに書かせない仕組み

1. 値（Kpの最大、R/S/Gのレベル、確率、日付・時刻など）を構造化して `{{kp_max24}}` のようなトークンにし、意味と種別（観測・予報・モデル・定数）を付けて生成AIに渡します。
2. 生成AIはトークンを置くだけです。数字を書いてはいけません（R1〜R5・S1〜S5・G1〜G5の名称だけ例外）。
3. 翻訳もトークンをそのまま保ちます。
4. このコンテナが言語ごとの書式（小数点・日付・%）で値を埋め込みます。
5. 検査（`FACTS_VALID`）：全言語のトークンが英語と同じか、トークン以外に数字がないか、未知のトークンや欠けた言語がないか、主要な事実（日付・R/S/G・Kp最大・1日目の予報）を述べているか、値の範囲と整合（予報KpとGレベル）。1つでも外れれば `HOLD` で、翻訳や音声へ進みません。
6. スライドの文字がすべて英語か（描いた文字列を検査）、字幕の時刻が単調で範囲内か、MP4が11ストリーム・言語・既定音声・尺どおりで最後までデコードできるかも検査します。

## 生成AIの設定（管理画面）

取得用コンテナの管理画面（`http://localhost:18084/`）の「宇宙天気デイブリーフィング（検証用）」で設定します。設定は `/data/briefing/settings.json`（パーミッション0600）に保存され、APIキーは画面・APIの応答・ログ・成果物に出ません。

### API（4種類）

| API | キー | 備考 |
|---|---|---|
| Gemini（Google） | 画面で保存、または `GEMINI_API_KEY`・`GOOGLE_API_KEY` | 文章と音声合成 |
| OpenAI | 画面で保存、または `OPENAI_API_KEY` | 文章と音声合成 |
| Claude（Anthropic） | 画面で保存、または `ANTHROPIC_API_KEY` | 文章のみ（音声合成なし） |
| ローカルLLM | 必要な場合だけ（`LOCAL_LLM_API_KEY`） | 接続先URLと方式（Ollama／OpenAI互換）。既定 `http://host.docker.internal:11434`。音声合成はOpenAI互換の `/audio/speech` がある場合だけ |

「モデル一覧を取得」は各社のモデル一覧APIを呼び、キーが通ることと、モデル名が実在することを確かめます（選択肢として出ます）。モデル名・声・料金はコードに固定していません。

### 工程ごとのAPI

| 工程 | 選べるAPI | 既定 |
|---|---|---|
| 英語の原稿 | Gemini・OpenAI・Claude・ローカル | Gemini |
| 日本語への翻訳（音声・字幕） | 同上 | Gemini |
| 字幕の翻訳（仏・西・伊・葡・独・韓） | 同上 | Gemini |
| 独立レビュー | 同上、または「使わない」 | OpenAI |
| 英語の音声合成 | Gemini・OpenAI・ローカル（OpenAI互換） | Gemini |
| 日本語の音声合成 | 同上 | Gemini |

工程ごとにモデル（と音声の工程は声の名前）を入力します。未設定の工程があると実データの実行は始まらず、理由が画面に出ます。既定の振り分けは指示書の推奨初期経路（原稿・翻訳はGemini、レビューはOpenAI、音声はGeminiかOpenAI）に合わせたもので、比較して変えてかまいません。独立レビューは補助で、合否を決めるのは上記の決定的な検査です。

工程ごとのモデル欄には、取得した一覧のうち**現行のモデルだけ**が出ます（文章の工程には文章生成のモデル、音声の工程には音声合成のモデル）。現行かどうかは名前だけで判定します：プレビュー・実験版・別名（latest など）・日付付きの固定版を除き、系列（例：…-pro、…-flash）ごとに最新の世代だけを残します。「現行以外のモデルも表示する」で全件、「手入力」で一覧にない名前も使えます。

「推奨の組み合わせを設定」は、キーのある生成AI（保存済みか、画面に入力したばかりのキー）の一覧を取得し、「精度重視・バランス重視・コスト重視」に合わせて工程を埋めます。区分は名前の大きさを表す語だけで決めます（pro・opus など＝上位、flash・sonnet・mini など＝中位、lite・nano・haiku など＝下位。語がなければ上位）。各社の一覧APIは料金を返さないため、料金欄は従来どおり料金表から入力します。独立レビューは、ほかにキーのある生成AIがあれば原稿と別の生成AIにします。コスト重視ではローカルLLMが使えればそれを優先します。音声の工程はClaudeを選びません。声の名前は入らないので入力してください。ボタンは保存しません。内容を確かめて「設定を保存」を押します。

同じ工程・モデル・プロンプト版・入力なら結果をキャッシュし、再実行でAPIを呼びません（変わった部分だけ作り直します）。

### 料金と予算

工程にモデルを設定すると、料金（米ドル、100万トークンあたりの入力・出力・キャッシュ入力・音声出力）と、料金表のURL・確認日の入力欄が出ます。1回あたりの予算を入れると `BUDGET_OK` で検査します（費用を計算できないときは不合格）。

## 費用とトークンの記録

- 呼び出しごとに、工程、API、モデル、実行方式（同期）、リクエストID、開始時刻、処理時間、状態と、**提供元が返した使用量を種類別に**（入力・出力・キャッシュ入力・推論・音声出力）保存します。返されなかった値は `null` のままで、0や推定で埋めません（OpenAIの音声合成は使用量を返さないため `unavailable`）。
- 推定（文字数÷4）は `estimated_*` の別欄です。費用は「実測使用量×入力した料金」（`calculated_usd_from_measured_usage`）と推定（`estimated_usd`）を分け、請求書と照合する欄（`invoice_reconciled_usd`）は空欄で用意しています。
- 失敗した呼び出しも記録し、`retry_or_failed_calls` で数えます。キャッシュ利用は呼び出しに数えません。
- Mockの実行は `api_calls: 0`、`metered_tokens: null`、`measured_provider_cost: null` と記録します（「生成AIの利用料は実測0円、実APIトークンは未計測」）。
- ffmpegの処理時間（`ffmpeg_render_seconds_measured`）も記録します。

## 品質ゲート

| ゲート | 内容 |
|---|---|
| `DATA_COMPLETE` | 必須データが対象期間どおりそろう |
| `DATA_FRESH` | 必須データが許容遅延内 |
| `FACTS_VALID` | 上記の数値・時刻・単位・言語間の一致、英語だけのスライド、字幕の時刻 |
| `LICENSE_CLEARED` | 使うデータの権利が確認済み |
| `LANGUAGES_COMPLETE` | 8言語の字幕と英日の原稿 |
| `MEDIA_VALID` | ffprobeで11ストリーム・言語・既定音声・尺、全体のデコード |
| `BUDGET_OK` | 予算内（未設定なら合格と記録） |
| `REVIEW_OK` | 生成AIのレビュー（「使わない」なら対象外） |
| `SCHEDULE_OK` | 02:30〜03:00の凍結と03:00までの完了 |
| `PRODUCTION_INPUT` | Mockデータでない |
| `RELEASE_POLICY` | 公開は無効（参考表示。常に不合格で、結果はローカルのまま） |

`RELEASE_POLICY` 以外がすべて合格なら `READY_LOCAL`、1つでも不合格なら `HOLD` です。必須データが欠けていれば生成AIを呼ばずに `HOLD` にします。`PUBLISHED` への遷移はありません。

## 公開機能が無効であることの確認

- 公開・配信・アップロードのコードはありません。`AUTO_PUBLISH_ENABLED`・`PUBLIC_DELIVERY_ENABLED` を環境変数に設定しても状態に「要求あり」と出るだけで、何も公開しません（`test_scheduler_and_publishing_are_off`）。
- 定時の自動作成は `HF_BRIEFING_SCHEDULER_ENABLED=1` のときだけ、02:30〜03:00 UTCに実データで1日2回まで試み、結果はローカル保存だけです。既定は `0` です。
- 成果物はCHUCKのAPI・画面にも出しません（取得用コンテナのBearer API `/api/...` にも追加していません）。管理画面（パスワード保護）で再生・ダウンロードできるだけです。

## 操作

管理画面で対象日と実行方式を選び「作成する（公開しない）」を押します。

- **Mock**：API・ネット不要。NOAA形式の模擬データと模擬音声（短い音のあと無音）で全工程を通します。結果は必ず `HOLD`（`PRODUCTION_INPUT`）です。
- **実データと生成AI**：取得用コンテナが保存している最新のデータで、設定した生成AIを呼びます。
- **前回の実データで再現**：その日の直近の実データの実行の `raw/` を使って作り直します。

コマンドでも実行できます（取得用コンテナ内）。

```sh
docker compose exec public-data python briefing.py doctor               # 設定と前提の確認（キーは表示しない）
docker compose exec public-data python briefing.py test-connections     # 各APIの認証とデータの取得状況 → /data/briefing/connection_report.{json,md}
docker compose exec public-data python briefing.py run --date 2026-11-03 --mode mock
docker compose exec public-data python briefing.py replay --date 2026-11-03
docker compose exec public-data python briefing.py validate --date 2026-11-03
docker compose exec public-data python briefing.py report-cost --date 2026-11-03
```

取得用コンテナのイメージは、ffmpegとDejaVuフォントを加えた専用の段（Dockerfileの `public-data`、`hf-public-data:local`）になりました。更新時は `docker compose up -d --build public-data` で作り直してください。

## 試験

`python3 -m unittest tests.test_briefing`（ffmpeg・ffprobeがない環境では動画の試験を飛ばします）。時刻規則（JST・うるう日・年跨ぎ）、欠測・区間不足・陳腐化・破損、NICTの権利と外部AIへの送信制限、トークン以外の数字・言語間の不一致・欠けた言語、英語だけのスライド、字幕の時刻、設定（キーを表示しない、0600、Claude・Ollamaの音声合成を拒否、版の衝突）、提供元ごとの使用量の読み取り、費用計算、Mockで11ストリームのMP4、使用量つきの実データ実行で `READY_LOCAL`、キャッシュ・再現、必須データ欠測時にAIを呼ばないこと、数字を書いた原稿・締切後の実行の `HOLD`、管理画面のAPIを確認します。

## 未解決・ブロッカー

| 項目 | 状態 |
|---|---|
| 各社APIの実接続 | **未検証**。この環境にはAPIキーがなく、Gemini・OpenAI・Claude・ローカルLLMの実呼び出し、実測トークン、実費は未計測です。キーを設定したら「接続を試験する」→ 実データで1回実行してください |
| Batch API | 未実装。指示書は前日の事前処理（用語集・定型表現）だけをBatch化する方針ですが、この版は同期APIとキャッシュだけです。締切のある当日処理はBatchに依存しません |
| 日本語音声の品質 | 実際のTTS（Gemini・OpenAI）で生成し、試聴での確認が必要です。Mockの音声は品質確認用ではありません |
| NOAAの3日予報の発表時刻 | JSONに発表時刻がないため、取得時刻だけを記録しています（`issue_time: null`） |
| NASA DONKI・ESA・GFZ・NICT省庁間連携 | 接続なし（契約・規約の確認が先） |
| Dockerイメージ | この作業環境ではDockerのデーモンが使えず、`public-data` 段のビルドは未確認です。動画処理はこの環境のffmpeg 6.1で確認しました（イメージに入るのはDebian bookwormのffmpeg 5.1です） |
| 為替換算・月額 | 費用は米ドルが一次値。月額見込みは実測の計算値×30日のみで、為替換算はしていません |
