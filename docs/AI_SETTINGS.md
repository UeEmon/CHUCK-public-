# AI切替・モデル選択・APIキー取得手順

アンテナプリセット → カタログ・仕様書の取込み → **AI・モデル・APIキー設定**で設定します。選択したAIのモデル一覧を取得し、モデルを選択またはIDを直接入力して「このAI・モデルを保存して使用」を押します。AIを切り替えるだけでは適用されず、保存後の接続先がOCRで使用されます。通常の伝搬計算エンジンは変更しません。

| 画面のAI | 接続方式 | 入力 |
|---|---|---|
| OpenAI / ChatGPT | OpenAI Responses API | PDF・PNG・JPEG・WebP |
| Claude | Anthropic Messages API | PDF・PNG・JPEG・WebP |
| Gemini | Google Gemini generateContent | PDF・PNG・JPEG・WebP |
| Local LLM / Ollama | Ollama /api/chat | PNG・JPEG・WebP |
| Local LLM / OpenAI-compatible | /chat/completions | PNG・JPEG・WebP |

モデル一覧は接続したアカウント／ローカルサーバーから取得します。画像入力と構造化出力を受け付けるモデルを選んでください。一覧への掲載だけではOCR対応や精度は保証できません。ローカルLLMへPDFを送る場合は事前にページ画像へ変換してください。モデルの自動ダウンロードや、失敗時の他社・クラウドへの自動切替はしません。

## APIキーを取得する

### OpenAI / ChatGPT系

1. [OpenAI Platform](https://platform.openai.com/)へログインし、対象の組織・プロジェクトを選択。
2. [API keys](https://platform.openai.com/api-keys)で「Create new secret key」を選び、キーを作成してコピー。
3. API側の請求・クレジット・利用上限と、使うモデルへのアクセスを確認。
4. CHUCKでOpenAIを選び、キーを入力 → モデル一覧取得 → 画像／構造化出力対応モデル選択 → 保存。

ChatGPTの画面にログインした情報をAPIキーとして使う機能ではありません。チャットの契約だけでAPI認証・利用枠が設定されると考えず、API管理画面で確認してください。[公式クイックスタート](https://developers.openai.com/api/docs/quickstart)

### Claude

1. [Claude Console](https://platform.claude.com/)へログイン。
2. Settings → [API keys](https://platform.claude.com/settings/keys) → Create key。
3. 名前・有効期限・Linked accountを指定。共有運用では用途に合うサービスアカウントやワークスペースの権限を管理者と確認。
4. 発行時に表示されたキーをコピーし、CHUCKでClaudeを選んで入力 → モデル一覧取得 → 選択 → 保存。
5. APIの請求・利用枠を確認。キー作成の権限がない場合は組織管理者へ依頼。

Claudeのキーは発行後に秘密値を再表示できず、Admin APIでも秘密値を回復できません。紛失時は再発行します。[公式手順](https://platform.claude.com/docs/en/get-api-key)。この実装は通常のAPIキー接続であり、OAuth・管理者用キーによる発行代行・複数ワークスペースの追加ヘッダー設定には対応しません。

### Gemini

1. [Google AI StudioのAPI keys](https://aistudio.google.com/api-keys)へGoogleアカウントでログイン。
2. Create API keyから使用プロジェクトを選び、キーを作成・コピー。画面の初期プロジェクトや権限の案内に従う。
3. Gemini API用のキー制限・プロジェクトの料金と割当を確認。
4. CHUCKでGeminiを選び、キーを入力 → モデル一覧取得 → 対応モデル選択 → 保存。

既存のGoogle CloudキーはAPI制限・権限によって使えない場合があります。[公式手順](https://ai.google.dev/gemini-api/docs/api-key)を確認してください。

### ローカルLLM

1. OllamaまたはLM Studio等のOpenAI互換サーバーを起動し、画像対応モデルを用意。
2. CHUCKでLocal LLMを選択し、API形式と接続先を指定。
3. Ollamaの例：`http://host.docker.internal:11434`。OpenAI互換の例：`http://host.docker.internal:1234/v1`。接続先にはクエリ・認証情報を埋め込まない。
4. 認証のないローカルサーバーはAPIキー不要。認証する場合は、そのサーバー管理者が設定したキーを入力。
5. モデル一覧を取得し、画像対応モデルを選んで保存。

Composeにhost.docker.internalのhost-gateway設定を追加しています。ホスト側LLMサーバーの待受け設定やファイアウォールでDockerからの接続を許可する必要があります。コンテナ内のlocalhostは通常ホストPCを指しません。ローカル接続ではHTTPプロキシを使わず、明示した接続先へ直接接続します。

公式資料：[Ollamaモデル一覧](https://docs.ollama.com/api/tags)、[Vision](https://docs.ollama.com/capabilities/vision)、[LM Studio](https://lmstudio.ai/docs/developer/openai-compat/chat-completions)。

## キーの自動読込み・保存

| AI | キー環境変数 | モデル環境変数 |
|---|---|---|
| OpenAI | OPENAI_API_KEY | HF_ANTENNA_OCR_MODEL |
| Claude | ANTHROPIC_API_KEY | ANTHROPIC_MODEL |
| Gemini | GEMINI_API_KEY（優先）、GOOGLE_API_KEY | GEMINI_MODEL |
| Local LLM | LOCAL_LLM_API_KEY（任意） | LOCAL_LLM_MODEL |

初期AIは`HF_ANTENNA_OCR_PROVIDER=openai/claude/gemini/local`、ローカルURLは`LOCAL_LLM_BASE_URL`、形式は`LOCAL_LLM_PROTOCOL=ollama/openai`でも指定できます。

優先順は保存設定 → 環境変数です。画面でキーを空欄にして保存すると既存キーを維持します。「保存したキーを削除し、環境変数へ戻す」で保存キーを削除できますが、環境変数に残るキーは削除されません。保存設定がなければ環境変数から自動読込みします。各社のアカウントへログインしてキーを自動発行・回収する機能ではありません。

AIごとのキー・モデルを分け、別AIへキーを流用しません。保存キーはhf-data内`ai-settings.json`へ原子的に保存し、ファイル権限0600を設定します。これは暗号化保管ではありません。キーをAPIレスポンスやlocalStorageへ返さず、画面には設定有無と保存設定／環境変数の別を表示します。キー入力欄は保存成功・AI変更時に消去。モデル一覧取得前に入力した未保存キーはその操作にも使えますが、保存ボタンまで永続化しません。

従来のlocalhost信頼モデルです。設定画面に個別ログインはなく、LAN公開時はHTTPS・リバースプロキシの認証等を用意し、利用者に設定変更を許可する範囲を決めてください。APIキーや設定ファイルをGit・再配布束に含めません。

設定保存はrevisionで競合を検出。処理中OCRは開始時の接続設定を使い、取得結果にはそのAI・モデルを保存します。既存のOpenAI取込資料はOpenAIとして移行し、後からAIを変更しても出典ラベルを変更しません。

API：`GET /api/ai-settings`（秘密値なし）、`POST /api/ai-settings`（revision, provider, model, api_key任意, clear_api_key任意, endpoint/protocolはlocal用）、`POST /api/ai-settings/models`（同じ接続情報で一覧取得、保存しない）。POSTは同一Origin＋JSON、最大16 KiB。409は設定競合、502は接続／APIエラーです。
