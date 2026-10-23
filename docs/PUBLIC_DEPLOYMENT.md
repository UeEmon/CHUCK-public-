# 公開版（誰でも使える版）

このリポジトリは CHUCK の本家（非公開）から分けた公開版です。本家の開発はそのまま続け、ここでは不特定の利用者に公開するための制限だけを加えます。

## 本家との違い

本家のファイルはできるだけ変更せず、公開用の差分は次の新しいファイルに閉じ込めています。本家の変更はそのまま取り込めます。

| ファイル | 内容 |
|---|---|
| `app/public_server.py` | 本家の `server.py` を包む起動口。管理者限定機能の遮断、計算回数の制限、古い結果の削除 |
| `app/static/public.js` | 利用者のプリセットと計算履歴をブラウザに保存する画面側の処理。`public_server.py` が `index.html` に差し込む |
| `compose.public.yaml` | 起動口と設定値を公開版に切り替える上書きファイル |
| `app/donations.py` | 寄付台帳とアンテナ資料の受付（GitHub Sponsors の Webhook の検証と記録） |
| `app/static/catalog.html`・`catalog.js` | アンテナ資料の受付ページ |
| `app/static/support-admin.html`・`support-admin.js` | 管理サイトの寄付・資料の管理画面 |
| `app/static/public-messages.js` | 公開版で追加した文言の翻訳（本家と同じ8言語） |
| `tests/test_public.py`・`tests/test_donations.py` | 公開版の試験 |

## 利用者と管理者でできること

| 機能 | 利用者（公開サイト） | 管理者（管理サイト） |
|---|---|---|
| 伝搬予測・カバー範囲・ダイバーシティー計算 | 可（回数制限あり） | 可（制限なし） |
| 共通の地点プリセット | 閲覧のみ。「コピーして編集」で自分用の複製を作れる | 追加・編集・削除 |
| アンテナプリセット | 閲覧のみ。登録は管理者だけ。一部の装備のアンテナは表示しない | 追加・編集・削除（全件表示） |
| アンテナの利得表（実測・解析パターン） | 閲覧のみ。登録・削除は管理者だけ | 登録・削除 |
| 自分の地点プリセット | このブラウザに保存。JSONで書き出し・読み込み | — |
| 計算履歴 | このブラウザに保存した自分の分だけ | 全件 |
| AI設定・アンテナ資料のOCR取込み | 不可（サーバーのAPIキーを使うため） | 可 |
| 位置ゲートウェイ・移動局 | 不可（位置情報を公開しないため） | 可 |

計算結果はサーバーに保存され、推測できない128ビットのIDを知っている人だけが開けます。`CHUCK_RESULT_RETENTION_DAYS`（既定30日）を過ぎた結果と、`CHUCK_MAX_RESULTS`（既定2万件）を超えた古い結果は、新しい計算のたびに削除します。

## アンテナの追加依頼と寄付

アンテナプリセットは管理者が資料を確認して登録します。公開サイトのアンテナ画面には次を表示します。

- 登録は管理者のみであること
- 寄付をいただいた方のうち希望者に限り、カタログや仕様書を送れること（送付は任意で、寄付だけでもよいこと）
- 資料は登録を検討するが確約しないこと、寄付は登録の対価ではないこと

寄付は GitHub Sponsors で受け、GitHub からの Webhook で台帳に記録します。Stripe は日本の個人への寄付を禁止業種に挙げているため使いません。設定手順は [SPONSORS_SETUP.md](SPONSORS_SETUP.md) にまとめました。

| 変数 | 内容 |
|---|---|
| `CHUCK_DONATION_URL` | GitHub Sponsors のページ（例：`https://github.com/sponsors/UeEmon`）。未設定ならボタンなし |
| `CHUCK_CONTACT_URL` | 資料の送付先を外部フォームにする場合だけ設定。未設定なら組み込みの受付ページ |
| `GITHUB_SPONSORS_WEBHOOK_SECRET` | GitHub Sponsors の Webhook に設定した秘密の文字列（16文字以上）。未設定なら台帳・受付ページ・メーターは無効 |
| `CHUCK_MONTHLY_COST_USD` | 運営費の固定分（米ドル）。サーバーが `/api/admin/running-cost` で送る請求額を足したものが寄付メーターの目安。合計0で非表示 |

寄付者は受付ページで GitHub のユーザー名を入力し、希望すれば資料（PDF・PNG・JPEG・WebP、8MBまで、1ユーザー名5件まで）を送れます。送信には「登録が確約されないことを了承」のチェックが必須です。非公開のスポンサーを第三者に知られないよう、受付ページはスポンサーかどうかに関わらず同じ応答を返し、照合結果は管理画面だけに表示します。管理者は管理サイトの `/support-admin.html` でスポンサーと資料を確認し、登録したプリセットIDと状態（未処理・登録済み・見送り）を記録します。支援者一覧には GitHub で公開を選んだスポンサーだけを載せ、管理画面から非表示にできます。

## 管理者の判定

管理者かどうかは、リバースプロキシが付ける `X-Chuck-Admin` ヘッダーの値が `CHUCK_ADMIN_SECRET`（32文字以上）と一致するかで判定します。値を設定しない、または32文字未満のときは、誰も管理者になりません。

公開サイトではこのヘッダーを必ず削除し、パスワードで保護した管理サイトでだけ付けます。Caddyの例：

```caddyfile
# 公開サイト：誰でも使える。管理者ヘッダーは利用者が送っても消す
{$CHUCK_DOMAIN} {
	reverse_proxy hf-propagation:8000 {
		header_up -X-Chuck-Admin
	}
}

# 管理サイト：パスワードを通った人だけに管理者ヘッダーを付ける
admin.{$CHUCK_DOMAIN} {
	basic_auth {
		{$CHUCK_USER} {$CHUCK_PASSWORD_HASH}
	}
	reverse_proxy hf-propagation:8000 {
		header_up X-Chuck-Admin {$CHUCK_ADMIN_SECRET}
	}
}
```

アプリの18082番は本家と同じく127.0.0.1にだけ公開し、外部からはリバースプロキシ経由でしか届かないようにします。

## 計算回数の制限

利用者ごと（`X-Forwarded-For` の先頭、なければ接続元IP）に、`CHUCK_RATE_WINDOW_SECONDS`（既定3600秒）あたり `CHUCK_RATE_BUDGET`（既定60）の枠を設けます。1回の消費量は地点間予測1、ダイバーシティー3、カバー範囲5です（カバー範囲は35回分のエンジン計算を行うため）。上限を超えると429を返します。CaddyはX-Forwarded-Forを接続元の値で置き換えるため、利用者が偽装しても無視されます。

同時に実行できる計算は本家と同じく1件で、実行中の要求は409になります。

## 起動

```sh
docker compose -f compose.yaml -f compose.public.yaml up -d --build
```

`.env` に `CHUCK_ADMIN_SECRET` を設定します（例：`openssl rand -hex 32`）。同じ値をリバースプロキシにも渡します。

## 本家の変更を取り込む

```sh
git remote add upstream https://github.com/UeEmon/VOCAP-COMPATIBILITY-.git  # 初回のみ
git fetch upstream
git merge upstream/main
python3 -m unittest discover -s tests
```

本家で `index.html` の `<script src="app.js"></script>` が変わった場合、`public_server.py` は500を返して差し込みの失敗を知らせます。そのときは差し込み位置を合わせてください。本家で `i18n-messages.js` の読み込みタグが変わった場合は公開版の翻訳が読み込まれず、追加した文言が日本語のままになります。本家で新しいAPIが増えた場合は、管理者限定にすべきかを確認し、`ADMIN_GET`／`ADMIN_POST` に追加します。

## 公開リポジトリへの同期

開発はこの非公開リポジトリ CHUCK-public-dev で行い、利用者が見る公開リポジトリ [UeEmon/CHUCK-public-](https://github.com/UeEmon/CHUCK-public-) には履歴を持たない写しを置きます。main が更新されると、`.github/workflows/publish.yml` が公開リポジトリへ main と同じ中身のコミットを1つ足します。Oracle Cloud の本番は公開リポジトリを5分おきに取り込むため、マージしてから数分で本番にも反映されます。

- 書き込みには公開リポジトリのデプロイキー（書き込み可）を使います。秘密鍵はこのリポジトリの Secret `PUBLIC_DEPLOY_KEY` にだけ置きます。
- 公開リポジトリに直接入った変更があると、上書きで消さないように同期を止めます。その変更をこのリポジトリに取り込めば、次の同期から再開します。
- 手動で同期し直すときは、Actions の Publish を Run workflow で実行します。
