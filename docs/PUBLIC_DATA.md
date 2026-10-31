# 公開データの取得用コンテナと連携方式

追加日: 2026-10-31

CHUCKが使う公開データ（NOAA SWPCの平滑SSN・障害レベル・D-RAP、NICTの電離圏観測、任意有効化のGIRO）は、取得用コンテナ（`public-data`、`app/public_data_server.py`）が定期的に提供元から取得します。CHUCK本体は提供元へ直接接続しません。CHUCKと取得用コンテナの連携方式は2つです。

| 連携方式 | 構成 | CHUCKの設定 |
|---|---|---|
| API連携（既定） | CHUCKと取得用コンテナの両方を公開環境（インターネットに接続できる環境）で動かす | `HF_PUBLIC_DATA_MODE=api` |
| ファイル連携 | CHUCKをオンプレミス（インターネットに接続できない環境）で、取得用コンテナを公開環境で動かす | `HF_PUBLIC_DATA_MODE=file` |

現在の方式は管理画面（`/limits-admin.html`）の「公開データの連携」に表示されます。

## 取得用コンテナ

- 取得先は固定の一覧だけです（NOAAの3系列とD-RAP、NICT、管理画面で有効にしたときGIRO 3局）。CHUCKは種類名（`observed`・`predicted`・`scales`・`drap`・`nict`・`GU513` など）だけを指定し、URLは指定できません。
- 1分ごとに、更新間隔（NOAAの月間系列6時間、ほかは5分）を過ぎたデータを提供元から取得します。CHUCKの画面の利用者が提供元へ取得し直させることはできません（API連携の `GET /api/data/<種類>?refresh=1` は取得用コンテナ側に残していますが、CHUCKは送りません）。
- 取得した内容はCHUCKと同じ解析処理で検証し、通ったものだけを `<種類>.raw`（提供元の応答そのもの）と `<種類>.json`（取得時刻、URL、SHA-256）として `/data` に保存します。失敗しても前回のファイルを残し、60秒は再試行しません。
- 更新があるたびに、全データをまとめた連携ファイル `/data/export/chuck-public-data.json` を書き出します。
- API（いずれも `Authorization: Bearer <HF_PUBLIC_DATA_TOKEN>` が必要。ブラウザからの直接アクセスは拒否）
  - `GET /api/data/<種類>`：提供元の応答そのもの。`X-Fetched-At` に取得時刻（UNIX秒）
  - `GET /api/export`：連携ファイル
  - `GET /api/status`：各データの取得時刻とGIROの設定（`giro_enabled`）
  - `GET /api/health`：死活確認（認証なし）

## 管理画面

取得用コンテナの管理画面は `http://localhost:18084/` です（公開環境のサーバーでは、SSHのポート転送などでサーバー自身の18084番に接続します）。`.env` に16文字以上の専用パスワード `HF_PUBLIC_DATA_UI_PASSWORD`（`HF_PUBLIC_DATA_TOKEN` とは別の値）を設定し、`docker compose up -d public-data` で反映してからログインします。未設定のときはログインできません。HTTPSの後ろで使う場合は `HF_PUBLIC_DATA_UI_SECURE_COOKIE=1` も設定します。

- 取得状態：データごとの提供元、更新間隔、最終取得成功時刻、直近の失敗。「今すぐ取得」で更新間隔にかかわらず全データを取得します。
- 連携ファイルのダウンロード（ファイル連携用）。
- GIRO · 海外電離圏観測の有効化・無効化：有効にするには、利用条件（[Rules of the Road](https://giro.uml.edu/didbase/RulesOfTheRoad.html)）への適合の確認が必要です。設定は `/data/settings.json` に保存され、再起動後も保持されます。`HF_GIRO_ENABLED=1` は、管理画面で一度も設定していないときの初期値です。
- CHUCKは取得用コンテナのGIRO設定に従います（API連携では `GET /api/status` を30秒に1回まで確認、ファイル連携では取り込んだ連携ファイルの設定）。CHUCK側でGIROを有効にする設定はありません。

ログインセッションは1時間で、HttpOnly・SameSite=Strictのクッキーを使います。8回失敗すると15分ログインできません。

## API連携（両方を公開環境で動かす）

`Start.sh`・`Start.ps1` は初回起動時に `.env` へ `HF_PUBLIC_DATA_TOKEN`（48文字のランダム値）を作り、CHUCKと取得用コンテナの両方に渡します。手動で起動する場合は `.env` に32文字以上の値を設定してから `docker compose up -d --build` を実行してください。位置ゲートウェイのトークンとは別の値にします。

CHUCKは計算や表示のたびに取得用コンテナへ問い合わせ、取得用コンテナが提供元から取得した時刻を「最終取得成功」として表示します。予測条件・宇宙天気タブの「外部データの取得時刻」には、取得用コンテナに接続できているか（API連携）、または最後に連携ファイルを取り込んだ時刻（ファイル連携）を表示します。取得用コンテナに接続できないときは前回の値を古いデータとして表示し、60秒は再試行しません。

## ファイル連携（CHUCKをオンプレミスで動かす）

1. 公開環境で取得用コンテナを動かします（CHUCK本体は不要）。
   ```sh
   docker compose up -d --build public-data
   ```
2. 連携ファイルを取り出します。次のいずれかです。
   - `docker compose cp public-data:/data/export/chuck-public-data.json .`
   - `curl -H "Authorization: Bearer $HF_PUBLIC_DATA_TOKEN" http://127.0.0.1:18084/api/export -o chuck-public-data.json`
   - 公開環境でCHUCKもAPI連携で動かしている場合は、管理画面の「オンプレミス用の連携ファイルをダウンロード」
3. ファイルをオンプレミス環境へ持ち込み、CHUCKの管理画面「公開データの連携」で取り込みます。

オンプレミスのCHUCKは `.env` に `HF_PUBLIC_DATA_MODE=file` を設定して起動します（取得用コンテナは起動しなくてかまいません：`docker compose up -d --build hf-propagation position-gateway`）。

- 取り込んだデータは `/data/public-data` に保存され、再起動後も使えます。種類ごとにSHA-256と内容を検証し、手元のデータより新しいものだけを置き換えます。壊れた・未知の種類は取り込まず、画面に表示します。
- 計算に必要なのは主にNOAAの平滑SSNです。予測平滑SSNは毎月更新されるため、月に1回程度取り込んでください。取り込んだデータは、より新しいファイルを取り込むまで計算に使います。
- NICT・D-RAP・GIROは現在の観測値のため、持ち込んだ時点で古いデータとして表示され、実効SSNには使えません。
- 取得用コンテナがない場合は、NOAAのJSONファイルをそのまま取り込むこともできます（[SPACE_WEATHER.md](SPACE_WEATHER.md)の「オンプレミス運用」）。

## 制約

- 連携方式の切り替えは環境変数で行い、管理画面からは変更できません。
- 取得用コンテナはデータをCHUCKへ渡すだけで、第三者に公開しません。各データの利用条件・出典は本体と同じです（[DATA_LICENSES.md](../DATA_LICENSES.md)）。
