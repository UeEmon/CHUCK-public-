# GitHub Sponsors で寄付を受け付ける手順

公開版 CHUCK は GitHub Sponsors で寄付を受け、GitHub から届く通知（Webhook）で寄付台帳を作ります。支払いは GitHub が処理するため、カード情報はこのサーバーを通りません。

Stripe を直接使わないのは、Stripe の[制限業種リスト](https://stripe.com/legal/restricted-businesses)が日本で禁止される業種に「Donations to individuals（個人への寄付）」を挙げているためです。GitHub Sponsors は日本在住の個人を受取人として認めており、個人アカウントからの寄付には手数料がかかりません（[About GitHub Sponsors](https://docs.github.com/en/sponsors/getting-started-with-github-sponsors/about-github-sponsors)）。寄付する人には GitHub アカウントが必要です。

## 1. GitHub Sponsors に参加する

[個人アカウントの設定手順](https://docs.github.com/en/sponsors/receiving-sponsorships-through-github-sponsors/setting-up-github-sponsors-for-your-personal-account)に沿って進めます。

1. GitHub アカウントで2段階認証を有効にします（必須）。
2. <https://github.com/sponsors> から個人アカウントで参加し、連絡先を入力します。受け取り方法は銀行口座を選びます。
3. スポンサーダッシュボードでプロフィールを書きます。紹介文の例：「無料で公開しているHF電波伝搬予測サイト CHUCK の運営費（サーバー代など）に充てます。寄付は任意で、何かの対価ではありません。」
4. 入金用に Stripe Connect のアカウントを作ります。居住国と銀行口座の国は一致させます。本人情報は後から変えにくいので、送信前に確認します。
5. 税務フォームを出します。日本在住なので W-8BEN です。
6. 「Request approval」で審査を申請します。数日かかることがあります。

## 2. ティア（金額）を作る

ダッシュボードの「Sponsor tiers」で作ります。金額は米ドル建てで、公開後は金額を変えられないため、変えるときは古いティアを廃止して新しく作ります。

- 毎月：例 $1・$3・$5
- 1回のみ：例 $5・$10・$30
- 「Custom amounts」で、寄付者が金額を決められるようにします（最低額を設定）。
- ティアの説明に「特典はありません」と書きます。「購入」「商品」「特典」「対価」などの言葉は使いません。
- 「Display welcome message」をオンにし、ウェルカムメッセージに次を入れます。支払い後の画面とウェルカムメールに表示されます。

```
ご支援ありがとうございます。追加してほしいアンテナがあれば、希望者に限りカタログや仕様書をお送りいただけます（任意）。
https://<公開サイトのドメイン>/catalog.html
登録は検討しますが、お約束はできません。寄付は登録の対価ではありません。
```

## 3. Webhook を登録する

1. スポンサーダッシュボードの「Webhooks」→「Add webhook」を開きます。
2. Payload URL：`https://<公開サイトのドメイン>/api/sponsors/webhook`
3. Content type：`application/json`
4. Secret：長いランダムな文字列（例：`openssl rand -hex 32` の出力）。同じ値をサーバーに設定します。
5. 保存すると GitHub が確認の通知（ping）を送ります。「Recent Deliveries」で 200 が返っていれば接続できています。

サーバーの `.env` に設定します（`.env` はリポジトリに入れません）。

```sh
GITHUB_SPONSORS_WEBHOOK_SECRET=<Webhook の Secret と同じ値>
CHUCK_DONATION_URL=https://github.com/sponsors/<ユーザー名>
CHUCK_MONTHLY_COST_USD=20     # 寄付メーターの目安額（米ドル）。0 で非表示
```

設定後に `docker compose -f compose.yaml -f compose.public.yaml up -d` で再起動します。アンテナ画面に「GitHub Sponsorsで寄付する」「アンテナ資料を送る（希望者のみ）」のボタンと寄付メーターが出ます。

## 4. 台帳に記録されるもの

| 通知 | 台帳の扱い |
|---|---|
| `created` | スポンサー開始。毎月なら「継続中」、1回のみならその月の見込みに加算 |
| `tier_changed` | 毎月の金額を更新 |
| `pending_cancellation` | 「解約予定」。今月の見込みには残す |
| `cancelled` | 「解約済み」。見込みから外す |
| `edited` | 公開・非公開の変更を反映 |

GitHub は毎月の更新ごとには通知しないため、メーターは「継続中の毎月スポンサーの合計＋今月の1回のみの合計」による見込みです。実際の入金額は GitHub のダッシュボード（Payouts）で確認します。同じ通知が再送されても1回だけ反映します。

公開サイトの支援者一覧には、GitHub で公開（public）を選んだスポンサーだけを載せます。不適切な名前は管理画面で非表示にできます。

## 5. アンテナ資料の受付

寄付者は `/catalog.html` で GitHub のユーザー名を入力して資料を送ります。

- 送付は任意で、送るには「登録が確約されないことを了承」のチェックが必要です。
- 非公開のスポンサーを第三者に知られないよう、スポンサーでないユーザー名でも同じ「受け付けました」を返します。管理画面の「スポンサー」欄に照合結果（継続中・解約済み・記録なしなど）が出るので、記録なしの資料は見送ってかまいません。
- 原本は公開せず、登録の確認だけに使います。OCR で外部の AI に送る場合があることも受付ページに書いています。

管理サイトでアンテナ画面の「寄付と資料の管理」（`/support-admin.html`）を開き、資料を確認して、登録したらプリセットIDと「登録済み」を、見送るときは「見送り」を記録します。

## 6. 動作確認

1. Webhook の「Recent Deliveries」で ping が 200 になっていることを確認します。
2. 別の GitHub アカウントで最低額のスポンサーを1回行い、管理画面に記録が出ること、公開を選んだ場合はアンテナ画面の支援者一覧に出ることを確認します。
3. `/catalog.html` からそのユーザー名で PDF を送り、管理画面で「スポンサー」欄が「継続中」または「1回のみ」になることを確認します。

## 税金について

寄付は通常、雑所得として扱われます。会社員で給与以外の所得が年20万円以下なら所得税の確定申告は不要ですが、住民税の申告は別に必要です。金額や継続性によって扱いが変わるため、税理士に確認してください。
