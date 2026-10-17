# 本体・位置ゲートウェイ共通連接仕様 v1

本体とゲートウェイ間の連接は、**Bearer認証付きHTTP(S) + UTF-8 JSONの単一REST API**に固定します。
外部入力形式の解析・検査・正規化はゲートウェイが担当し、本体は共通位置モデルだけを使用します。
HTTPS終端は遠隔配置時の前段で行い、Compose内は専用サービス名へのHTTPを使います。

| 区間 | 形式・責任 |
|---|---|
| 外部局とゲートウェイ | 局別にJSON / GeoJSON / NMEA 0183 RMCを選択。現在の伝送はHTTP(S) |
| ゲートウェイ内部 | 入力アダプターでWGS84・UTC・共通単位へ正規化、局設定・順序逆転・品質を検査、最新DBへ保存 |
| ゲートウェイと本体 | 以下のinternal/v1 APIで共通JSONのみを交換 |
| 本体 | 共通レコードの妥当性・鮮度を検査し、固定座標としてVOACAPへ渡す。外部センテンスを解析しない |

本体のGatewayClientはposition_contract.pyだけに依存し、位置DB・NMEA/GeoJSONパーサーを読み込みません。
位置レコードのprotocolは来歴を示す不透明な文字列であり、本体の座標解釈や計算の分岐条件にしません。
入力形式を追加する場合はゲートウェイ側のアダプターと対応形式一覧を拡張します。
画面の形式選択もゲートウェイが返したprotocolsから生成するため、未知の形式名も選択肢に反映できます。

## 内部API

ゲートウェイの既定内部URL：http://position-gateway:8001

| Method | Path | 用途 |
|---|---|---|
| GET | /internal/v1/positions | 正規化済み最新位置・局設定・対応形式の一貫したスナップショット |
| POST | /internal/v1/stations | 局設定の登録・更新。外部入力形式名はゲートウェイが検証する |

Authorization: Bearer にHF_POSITION_GATEWAY_TOKENを設定。要求/応答はapplication/json。
外部受信用HF_POSITION_INGEST_TOKENでは接続不可。本体連携用トークンでは外部位置書込不可です。
Web管理画面のセッションCookieもサービスAPIのBearer認証には代用できません。
本体の画面向けGET /api/positionsとPOST /api/position-stationsは従来どおりで、本体が上記APIへ代理接続します。
ゲートウェイへの旧GET /api/positions・POST /api/position-stationsは410で廃止。
外部送信用POST /api/positionsとPOST /api/positions/nmeaは引き続きゲートウェイで使用します。
本体・ゲートウェイを同じ改訂版へ更新してください。

本体は表示更新・計算要求ごとに取得し、受信失敗時に古いキャッシュを採用しません。
タイムアウト5秒、応答上限4 MiB、リダイレクト・環境プロキシ経由の転送は禁止。
ComposeのhealthcheckはDB生存確認のみで、連接トークンの正しさを保証しません。[接続確認と障害の切り分け](POSITION_INTERFACE.md#接続確認と障害の切り分け)も確認してください。

## 共通スナップショット

| フィールド | 型・意味 |
|---|---|
| schema_version | 整数1。真偽値や文字列は不可 |
| server_time | タイムゾーン付きISO日時。ゲートウェイではUTCへ統一 |
| max_age_seconds | 整数10〜86400。観測時刻を起点とする有効期限 |
| ingest_enabled | 外部受信が有効かどうかの真偽値 |
| positions | 最大2000件の共通位置レコード |
| stations | 最大2000件の局設定（source/id/name/kind/protocol/enabled） |
| protocols | ゲートウェイが扱える入力形式名の一覧。本体で固定列挙しない |

位置レコードの規定：

| フィールド | 型・単位・扱い |
|---|---|
| source / id | 半角英数字と _ . : -、各1〜64文字。組合せが一意 |
| name / kind | 表示名、vessel / aircraft / vehicle |
| lat / lon | 有限の数値、WGS84十進度。緯度±90・経度±180 |
| observed_at / received_at | 観測時刻 / ゲートウェイ受信時刻、ISO日時 |
| expires_at | observed_at + max_age_secondsに一致するISO日時 |
| age_seconds | 観測からの経過秒数。メタデータであり予測の移動補正に使わない |
| stale | ゲートウェイの期限判定。trueなら不採用。本体でもexpires_atを再検査 |
| prediction_compatible | 緯度±89°のエンジン範囲内かの真偽値 |
| speed_knots | 対地速度kt、0〜3000またはnull |
| course_deg | 真方位の対地針路、0以上360未満またはnull |
| altitude_m | 高度m、−1000〜100000またはnull |
| altitude_reference | unknown / msl / wgs84_ellipsoid / pressure。自動変換しない |
| protocol | 入力形式の来歴。座標の並びや単位はこの値に依存させない |

欠測値はnull、0は有効値です。NaN/Infinity/数値文字列/真偽値座標を禁止します。
同じsource/idの重複レコード、期限の不整合、型・範囲の違反、未対応schema_versionは本体が503で拒否。
共通応答が正常でも、指定局が欠測・期限切れ・エンジン範囲外なら計算要求は400です。
外部局のlatitude/longitudeの順序やNMEA度分表現は、この共通モデルへ出す前に変換します。

新しい外部形式の追加は共通モデルを維持する限りv1のままです。
必須フィールド・単位・意味が非互換に変わる場合は新しい版を設計し、対応する本体へ更新します。
局登録・入力例・認証設定・移行手順は[POSITION_INTERFACE.md](POSITION_INTERFACE.md)を参照してください。
