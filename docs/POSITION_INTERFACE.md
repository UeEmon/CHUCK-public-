# 移動局位置の外部インターフェース

船舶・航空機・車両を共通管理し、局ごとに入力形式を選択します。
位置は独立したゲートウェイのSQLiteへ最新報告だけを保存し、伝搬計算のTX/RXに利用できます。

## サーバー構成

| サービス | 既定の公開先 | 担当 |
|---|---|---|
| hf-propagation | 127.0.0.1:18082 | Web画面、伝搬計算、計算履歴。位置はゲートウェイから取得 |
| position-gateway | 127.0.0.1:18083 | 外部位置受信、形式の正規化、局別設定、最新位置DB |
| position-migrate | 公開なし・任意実行 | 旧本体DBの位置・局設定だけを新規ゲートウェイDBへコピー |

ゲートウェイ自身のWeb管理画面は`http://localhost:18083/`です。専用の`HF_GATEWAY_UI_PASSWORD`（16文字以上、サービス用トークンと別値）でログインします。[画面操作と認証設定](GATEWAY_WEB_UI.md)を参照してください。

本体とゲートウェイは別プロセス・別コンテナです。ゲートウェイが位置情報の管理元となり、
本体は表示・計算要求ごとに認証付きHTTPで共通JSONのスナップショットを取得します。
連接仕様は[共通連接仕様 v1](GATEWAY_PROTOCOL.md)に統一しています。外部入力の解析はゲートウェイで完結します。
DBの共有マウントや本体側の最新位置キャッシュへのフォールバックは行いません。
ゲートウェイ停止・認証失敗時は位置参照を使う計算と位置一覧を503で停止します。
起動済み本体の固定座標計算・既存履歴は使用できます。初回Compose起動はゲートウェイのDB正常性を待ちます。

両サービスは同じ監査対象イメージを使用し、起動するPythonプログラムを分けます。
追加の外部パッケージはありません。ゲートウェイはVOACAP計算エンジンを実行しません。

## 伝送と形式

| 項目 | 仕様 |
|---|---|
| 伝送 | HTTP(S) POSTによるプッシュ。受信先はposition-gateway。遠隔接続はHTTPSリバースプロキシ等で保護する |
| JSON | 本システムの共通位置スキーマ。複数局を1バッチで送信可能 |
| GeoJSON | RFC 7946のFeatureCollection / Point。coordinatesは[経度,緯度,任意のWGS84楕円体高m] |
| NMEA 0183 | RMCのみ。チェックサム・測位有効性・日時を検査。1リクエスト1センテンス |
| 局識別 | source＋id。異なるsourceの同じidは別局 |
| 局種別 | vessel / aircraft / vehicle |
| 座標・時刻 | WGS84十進緯経度、ISO日時（タイムゾーン必須、内部UTC） |
| 更新周期 | 外部送信側が決定。画面の一覧更新は5秒周期、停止可能 |

JSON・GeoJSONは初回の有効報告で局を自動登録します。以後はその局の選択形式を固定し、
異なる形式や種別では受け付けません。NMEAは識別子・局種別を文中に持たないため、先に局登録が必要です。
局名は登録設定を優先し、変更後の次の有効報告へ適用します。

「移動局・外部入力」→「局ごとの受信プロトコル設定」で新規登録・形式変更・有効/無効を設定します。
形式・種別の変更、または無効化では旧位置を破棄し、新しい有効報告が来るまで計算に使いません。
複数局でJSON / GeoJSON / NMEAを同時に使えますが、同じ局に複数形式を混在させません。

## 有効化と認証

Composeへ以下の環境変数を渡します。

| 変数 | 内容 |
|---|---|
| HF_POSITION_INGEST_TOKEN | 32文字以上の秘密値。未設定・短すぎる場合、位置受信は503で停止 |
| HF_POSITION_GATEWAY_TOKEN | 32文字以上の本体連携・局設定用の秘密値。外部受信用とは別の値にする |
| HF_POSITION_GATEWAY_URL | 本体からの接続先。Composeではhttp://position-gateway:8001（コンテナ内部の名前） |
| HF_POSITION_MAX_AGE_SECONDS | 位置の最大経過秒数。既定300、範囲10〜86400 |
| HF_BIND / HF_PORT | 既存の待受設定。既定127.0.0.1:18082 |
| HF_GATEWAY_BIND / HF_GATEWAY_PORT | ゲートウェイの公開先。既定127.0.0.1:18083、内部8001 |

送信時は `Authorization: Bearer <秘密値>` が必須です。秘密値をURLやGitへ入れないでください。
受信トークンは全送信元共通であり、送信元別の権限分離や署名検証は実装していません。
ゲートウェイは位置受信に外部受信用、位置読出し・局設定に本体連携用のトークンを要求します。
外部送信者へ本体連携用トークンを配布しないでください。同じ値を両方に設定した場合は503で拒否します。
ゲートウェイのサービスAPIへのOrigin付き直接要求は拒否します。本体のブラウザ画面は本体の同一オリジンAPIを使い、本体が代理接続します。ゲートウェイ自身の管理画面は別系統の`/ui/api/*`とセッション認証を使います。
本体の局設定は既存アプリと同じローカル画面の信頼モデルです（同一OriginのPOST、または本体連携用Bearer認証）。
Origin検査はログイン認証ではありません。位置一覧・計算履歴の閲覧も既存UIと同様にログインなしです。
外部へ公開する構成では、HTTPSと認証・アクセス制御を前段で行ってください。
本アプリ自身がTLS終端やユーザー管理を行うわけではありません。

例（同じシェルから起動・送信する場合）：

```sh
export HF_POSITION_INGEST_TOKEN="$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')"
export HF_POSITION_GATEWAY_TOKEN="$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')"
export HF_POSITION_MAX_AGE_SECONDS=300
docker compose up -d --build
```

再起動時も両サービスに同じ本体連携用トークン、送信側とゲートウェイに同じ外部受信用トークンを渡してください。
本体には外部受信用トークンを渡しません。秘密値は画面や応答JSONに返しません。
別端末から入力する場合はHF_GATEWAY_BINDをLAN待受に変更し、HTTPS前段を構成します。
ゲートウェイだけを別ホストへ置く場合、本体のHF_POSITION_GATEWAY_URLをそのHTTPS接続先に変更してください。
Composeの既定URLは固定のため、別ホスト構成ではComposeオーバーライド等でenvironmentを上書きします。

### 接続確認と障害の切り分け

| 確認箇所 | 確認方法・意味 |
|---|---|
| Compose構文 | `docker compose config --quiet`。実際の接続確認ではない |
| ゲートウェイの生存 | `curl --fail http://localhost:18083/api/health`。DBへの簡易アクセスを確認するが、トークンの一致・権限は確認しない |
| 本体からの連接 | ブラウザで本体の`http://localhost:18082/api/positions`を開く。200かつ`schema_version: 1`なら本体から内部APIへの認証・共通応答検査まで成功（局が0件でも正常） |
| 外部からの受信 | 下記サンプル送信後に`accepted`を確認し、本体の位置一覧に反映されることを確認。NMEAは事前の局登録が必要 |
| 鮮度 | 既定300秒で期限切れ。時刻は送信端末・ゲートウェイ・本体で同期する。古い座標へ自動退避しない |

`/api/health`の`ingest_enabled`・`client_enabled`は各トークンの**長さの検査のみ**です。同じトークンを両用途へ設定した場合もtrueになり得ますが、サービスAPIは503で拒否します。Composeのhealthy表示だけで認証完了と判断しないでください。Web管理画面の状態表示も実際の本体接続試験ではありません。

本体のポートを変更するときはゲートウェイの公開ポートと重複させないでください。例：本体`HF_PORT=18084`、ゲートウェイ既定18083。ホスト側ポート変更はコンテナ間の`http://position-gateway:8001`を変更しません。`HF_BIND`と`HF_GATEWAY_BIND`も別設定です。

## ゲートウェイAPI（既定18083）

| Method | URL | 用途 |
|---|---|---|
| GET | /api/health | DBの正常性・認証設定有無。秘密値や局データは返さない |
| GET | /internal/v1/positions | 本体連携用Bearer。共通JSONによる最新位置・局設定・対応形式・有効期限 |
| POST | /internal/v1/stations | 本体連携用Bearer。局の登録・更新（JSON、上限4 KiB） |
| POST | /api/positions | 外部受信用Bearer。JSONまたはGeoJSONの受信 |
| POST | /api/positions/nmea?source=gps&id=car-1 | 外部受信用Bearer。登録済み1局のRMC受信（text/plain） |

本体のGET /api/positionsとPOST /api/position-stationsは画面向けの代理接続です。
ゲートウェイの旧GET /api/positions・POST /api/position-stationsは410となり、内部APIへ統一しました。
**旧本体18082へのPOST /api/positionsおよび/nmeaは410を返します。送信先を18083へ変更してください。**
本体→ゲートウェイ通信はタイムアウト5秒、リダイレクトを拒否し、環境プロキシを使いません。
共通JSON応答はschema_version=1。未対応版・形式不正・共通位置の型/範囲/期限不整合は本体で503として扱います。

局登録例：

```json
{"source":"gps","id":"car-1","name":"試験車","kind":"vehicle","protocol":"nmea0183","enabled":true}
```

source/idは半角英数字と `_ . : -` の1〜64文字。局名は表示可能な1〜80文字。
局設定・最新位置は各2000件まで。最新位置は受信時に観測時刻が7日より古いものを掃除します。
局設定は再起動しても保持します。航跡履歴は保存しません。

### JSON

Content-Type: application/json

```json
{
  "source":"gateway-1",
  "positions":[
    {"id":"ship-1","kind":"vessel","name":"試験船","lat":35.1,"lon":139.2,
     "observed_at":"2026-10-15T09:45:00Z","speed_knots":12.5,"course_deg":90},
    {"id":"aircraft-1","kind":"aircraft","lat":34.9,"lon":140.2,
     "observed_at":"2026-10-15T09:45:00Z","altitude_m":3000,"altitude_reference":"msl"},
    {"id":"vehicle-1","kind":"vehicle","lat":35.3,"lon":139.4,
     "observed_at":"2026-10-15T09:45:00Z"}
  ]
}
```

例の時刻は現在の観測時刻に置き換えてください。座標は説明用です。
latは±90、lonは±180。真偽値・文字列数値・NaN・Infinityは拒否します。
任意値は未取得なら省略またはnull。speed_knots=0〜3000、course_deg=0以上360未満、altitude_m=−1000〜100000。
高度基準はunknown（既定）/ msl / wgs84_ellipsoid / pressure。異なる高度基準を自動変換しません。

### GeoJSON

Content-Type: application/geo+json（application/jsonも可）

```json
{
  "type":"FeatureCollection","source":"gis-gateway",
  "features":[{
    "type":"Feature",
    "geometry":{"type":"Point","coordinates":[139.2,35.1,1000]},
    "properties":{"id":"aircraft-1","kind":"aircraft","name":"試験機","observed_at":"2026-10-15T09:45:00Z"}
  }]
}
```

識別子はproperties.idを使用します。第三座標がある場合、altitude_referenceはwgs84_ellipsoid。
LineString、MultiPoint、独自crs指定は受け付けません。JSONとGeoJSONでは緯経度の並びの違いに注意してください。

### NMEA 0183 RMC

Content-Type: text/plain。本文はASCIIのRMCを1行（CR/LF終端可）。
GP/GN等の2文字Talker IDに対応。XORチェックサム必須、status=Aのみ受理します。
任意のmodeは空/A/D/F/R/Pのみ、Nav Statusは空/A/D/Vのみを受理する保守的な実装です。
推測航法・手入力・無効・シミュレーションモードを有効位置として扱いません。
UTC時刻とddmmyy日付、ddmm/dddmm形式の緯経度、N/S/E/W、対地速度kt・対地針路を正規化します。
秒は0〜59（うるう秒60は未対応）。日付はPythonの2桁年解釈を使い、観測時刻の許容窓も検査します。
RMCから高度は取得できません。GGA/GLLやAIS !AIVDM/!AIVDOのデコードは含めません。

## 更新・欠測の扱い

- 1バッチ1〜100局、上限256 KiB。NMEAは本文256文字まで。
- 観測時刻は受信時点の過去24時間〜未来60秒以内。位置時刻が古くても有効期限内とは限りません。
- 同じ局の古い時刻・同時刻の再送は無視し、上書きしません。応答はaccepted / ignored_old_or_equal。
- 同一バッチのid重複や1件でも不正なデータ・設定不一致があればバッチ全体を拒否します。
- 期限切れは一覧で表示できますが計算には使いません。既定300秒を超えるとstale=true。
- 90°付近の位置は保存できますが、エンジンの±89°範囲外は計算不可です。
- HTTP 400：入力・設定不一致、401：位置受信の認証失敗、403：Origin/局設定アクセス不許可、415：Content-Type不正、503：受信無効。

## 伝搬予測への使用

有効な受信局を地点プリセットに自動登録します。右側のTXまたは任意のRXで、その移動局プリセットを選択すると位置参照を設定します。
地図クリックでは局を移動しません。「TXと交換」は位置参照を含む地点・アンテナ選択を指定RXとTXで相互交換します。
固定地点プリセットに選び直すと、その端点の位置連動を解除します。地点・名称の編集は専用の「地点プリセット」画面に集約しています。
現行UIの受信サイト欄には緯経度の直接編集機能はありません。固定地点への切替は地点プリセットの選択で行います。位置参照を残したまま予測APIへ緯経度を併記しても、位置参照が優先されます。

予測APIでは緯経度に代えて以下を指定できます（通常の電力・年月等の条件は別途必要）：

```json
{"tx_position":{"source":"gateway-1","id":"ship-1"},"rx_lat":26.21,"rx_lon":127.68,"year":2026,"month":10}
```

rx_positionも同様。diversityのrx_sitesには `position_ref:{"source":"gps","id":"car-1"}` を指定できます。
diversityではトップレベルrx_positionを使わず各サイトの参照を使います。
coverageでrx_positionを指定すると中心点もそのRXの位置に合わせます。

計算要求でゲートウェイの一貫したDBスナップショットから有効位置を取得し、渡された緯経度より位置参照を優先します。
欠測・期限切れでは400。手動位置へ黙って戻しません。位置参照と採用した観測時刻・取得時刻・形式等を
結果のposition_inputsおよびCSV/JSONへ保存し、後から移動しても保存済み結果を変更しません。
履歴再表示は当時の予測です。同じ参照を使って再計算すると、その時点の新しい位置を使います。

**位置は要求時点の固定座標です。24時間分の航路・飛行経路の追跡予測ではありません。**
航空機高度のHF伝搬補正、速度・針路による推測位置、実受信品質の評価は行いません。

## 送信サンプル

`scripts/send_positions.py`は標準ライブラリのみで動作します。送信側にも同じ環境変数トークンを設定してください。

```sh
python3 scripts/send_positions.py positions.json
python3 scripts/send_positions.py positions.geojson --protocol geojson
python3 scripts/send_positions.py position.nmea --protocol nmea0183 --source gps --station-id car-1
```

既定宛先はhttp://127.0.0.1:18083/api/positions。遠隔宛先は `--url https://example.org/api/positions` で指定。
サンプルは遠隔HTTP平文とリダイレクトを拒否します。単発送信用であり、周期送信は外部送信側が実装します。
シリアル・UDP/TCPの生ストリーム受信、AIS/ADS-Bの生フレーム、NMEA 2000への直接接続は未実装です。
そのような機器・既存システムは、送信側アダプターで対応形式へ変換し、このゲートウェイへHTTP(S)送信してください。

## 旧本体DBからの移行

旧位置情報を残す場合、**新ゲートウェイを初めて起動する前**に実行します。
先に既存データボリュームをバックアップしてください。次の処理は旧DBを読み取り専用で参照します。

```sh
docker compose stop hf-propagation position-gateway
docker compose --profile tools run --rm --build position-migrate
docker compose up -d --build
```

hf-dataのpredictions.sqlite3からpositions/position_stationsだけをgateway-dataの新規positions.sqlite3へコピーします。
旧DB・計算履歴は変更せず、本体履歴をゲートウェイへコピーしません。局別形式・観測時刻・受信時刻を保持します。
移行元に位置テーブルがない場合や移行先DBが既に存在する場合は停止し、上書きしません。
既に新ゲートウェイを起動済みの場合、既存のゲートウェイDBを削除して再試行せず、バックアップと内容を確認してください。
位置情報が不要なら移行せず、新しい受信報告で開始できます。旧DBの未使用位置テーブルはそのまま保持されます。

Composeを使わない移行は `python app/migrate_positions.py --source 旧DB --destination 新DB` で行えます。
再配布時はhf-dataとgateway-dataの両方を配布物から除外してください。

受信データの出典・利用・再配布条件は入力元ごとに確認してください。コードMITが入力データへ適用されるわけではありません。
位置DB・計算履歴・トークンは配布束へ含めないでください。

参照（仕様・外部コードの転載なし）：
- GeoJSON：https://www.rfc-editor.org/rfc/rfc7946
- GPSDの公開RMC解説：https://gpsd.io/NMEA.html

NMEAという名称は規格の識別です。規格書の同梱やNMEA認証取得を意味せず、GPSDのソフトウェアを取り込んでいません。
