# API v0.1

AI接続・キー設定とモデル一覧は[AI_SETTINGS.md](AI_SETTINGS.md)、外部データの`refresh=1`と取得時刻は[SPACE_WEATHER.md](SPACE_WEATHER.md)を参照してください。

画面の操作は同一オリジン。JSONの数値は有限値のみ。通常POSTはContent-Type: application/jsonを指定します。
画面・計算にはログイン認証がなく、既定の公開先はlocalhostのみです。
外部位置入力にはBearer認証を追加しています。位置入力の形式別Content-Type等はPOSITION_INTERFACE.mdを参照してください。

| Method | URL | 内容 |
|---|---|---|
| GET | /api/health | 計算エンジン・係数ファイルの配置確認（完全な自己試験ではない） |
| POST | /api/predict | 24時間地点間予測・履歴保存 |
| POST | /api/coverage | 地域格子35地点の予測・履歴保存 |
| POST | /api/diversity | 単一TX→複数RXの24時間比較・履歴保存 |
| GET | /api/positions | 移動局の最新位置・局別受信設定 |
| POST | /api/positions または /api/positions/nmea | 本体では廃止。410、ゲートウェイ18083へ送信する |
| POST | /api/position-stations | 局ごとの形式・種別・有効設定をゲートウェイへ代理保存 |
| GET | /api/presets | 地点・アンテナのカタログと共通revision |
| POST | /api/presets | プリセット保存・削除、受信移動局の登録 |
| GET | /api/history | 最新100件の保存条件・日時・識別子 |
| GET | /api/results/{id} | 保存済み計算のJSON |
| GET | /api/results/{id}/csv | CSV（UTF-8 BOM付き） |
| GET | /api/results/{id}/json | JSONダウンロード |
| GET | /api/results/{id}/raw | VOACAP生出力（地点間予測のみ） |
| GET | /api/results/{id}/input | VOACAP入力カード（地点間予測のみ） |

POSTの例：

```json
{
  "tx_lat":35.30,"tx_lon":139.67,
  "rx_lat":13.45,"rx_lon":144.75,
  "year":2026,"month":10,"ssn":80,
  "power_w":150,"frequencies":[2,4,6,8,12,16,18,22,25],
  "tx_antenna":"whip","rx_antenna":"whip",
  "tx_gain":0,"rx_gain":0,
  "noise":150,"min_angle":3,"required_snr":40,"reliability":90
}
```

`tx_antenna` / `rx_antenna` は `whip`、`isotropic`、`monopole`、`dipole`、`vertical_dipole`。
`year,month,tx_lat,tx_lon,rx_lat,rx_lon` は必須、その他は上記の既定値を使用します。

寸法付き3モデルは`tx_length_m` / `rx_length_m`（0.1〜200 m）が必須です。
`{tx,rx}_height_m`（0〜200 m、ダイポール既定10・その他0）、`{tx,rx}_azimuth_deg`（0〜359.9、既定0）、
`{tx,rx}_ground_permittivity`（1〜80、既定13）、`{tx,rx}_ground_conductivity`（0.00003〜5 S/m、既定0.005）も指定できます。
水平ダイポールは高さ0.1 m以上、垂直ダイポールは給電点高が全長の半分より上である必要があります。
方位は水平ダイポールの主放射方向で、ワイヤー方向ではありません。モノポールは地表設置、基準モデルは寸法未使用。
`rx_sites[]`ではプレフィックスなしの`length_m,height_m,azimuth_deg,ground_permittivity,ground_conductivity`を局ごとに指定できます。

### 変調・受信帯域・偏波

- `modulation`: `manual/cw/ssb/am/fm/fsk/psk/qam/ofdm/digital`（既定manual）。
  方式名は記録で、APIが方式ごとの必要SNRを強制しません。UIでCW/SSB/AMを選ぶと24/45/67を例示入力しますが編集可能です。
- `snr_input`: `direct`（既定）なら従来の`required_snr`（0〜99 dB·Hz）。
  `bandwidth`なら`bandwidth_hz`（1〜1,000,000）と`inband_snr_db`（−40〜60）を指定。
  サーバーで`required_snr = inband_snr_db + 10 log10(bandwidth_hz)`を算出し、小数4桁へ丸めて0〜99の範囲を検証します。
- `tx_polarization/rx_polarization`: `model/vertical/horizontal/rhcp/lhcp/linear_other`（既定model）。
  メタデータとして保存し、方式名だけでパターンや偏波損失を変更しません。
  diversityの各`rx_sites[]`では`polarization`を個別指定できます。
- `polarization_loss_db`: 全経路に共通の仮定した追加損失0〜30 dB（既定0）。
  エンジンのTX電力を等価的に低減します。parameters.power_wは元の値を保持します。
- 条件はJSON・CSV冒頭のparameters・履歴に保存します。
  `ui_selection`オブジェクトを指定すると、計算に使うプリセット選択のスナップショットも結果に保存します。

### 地点・アンテナのカタログ

カタログ・仕様書の生成AI OCR取込みは[ANTENNA_OCR.md](ANTENNA_OCR.md)を参照。取込資料は`/api/antenna-imports`で管理し、登録は原本確認後に以下のプリセットAPIで行います。

`GET /api/presets` → `{revision,presets:[地点...],antennas:[アンテナ...]}`。
POST例：

```json
{"revision":0,"collection":"locations","action":"save","preset":{"name":"RX-A","kind":"fixed","region":"その他","lat":35,"lon":139}}
```

- collectionは`locations`（既定）または`antennas`。更新時はpreset.idも指定、新規時はサーバーでIDを採番します。
- 地点はname 1〜40文字・lat −89〜89・lon −180〜180・region 1〜40文字。
  kind=mobileなら`position_ref:{source,id}`を指定し、lat/lonは初期表示用。計算では局参照で最新の有効位置を取得します。
- アンテナはname、model（上記5種）、gain (−20〜30 dB)とプレフィックスなしの寸法・地面定数。
  出典付き項目は`reference:{operator,designation,checked_on,notes,sources:[HTTPS URL...]}`、`reference_only`真偽値を保持します。
  reference_only=trueはUIで計算選択不可の参考資料です。APIはプリセットIDからではなく直接指定したモデルパラメーターで計算します。
- 削除は`{revision,collection,action:"delete",id}`。両カタログ共通revisionが不一致なら409。
  同名重複・不正入力は400。各200件まで。同一Originの画面で管理するローカルアプリの信頼モデルです。
- `{action:"sync_mobile"}`はゲートウェイから最新位置を再取得して有効局を未登録の地点プリセットへ追加。
  戻り値は`{imported}`。古い／計算緯度範囲外は登録せず、登録済みの名称編集・明示削除を維持します。
  削除済み局はUIから手動登録可能です。既定都市を削除しても再起動時に復活しません。

coverageでは追加で `frequency_mhz`（既定8）、`hour_utc`（既定12）、`span`（10〜120、既定60）、
`center_lat`（−70〜70、既定RX緯度）、`center_lon`（既定RX経度）を指定できます。
中心緯度の範囲外では入力エラーを返します。緯度端は±89°でクリップします。

地点間の結果には `parameters, hours, distance_km, bearing_deg, raw_output, input_cards, engine, engine_commit, id, created` が含まれます。
`hours[].rows[]` は周波数、信頼度%、SNR dB·Hz、信号dBW、打上げ角などを持ち、計算不能値はnullです。

エラー：400 入力不正、403 異なるOrigin、404 不明な履歴/パス、409 別計算中、415 JSON以外、503 エンジン準備不足/失敗。
エンジン1回のタイムアウトは60秒です。カバー範囲は逐次計算で最大35回です。

入力カード内のtx.voa/rx.voaは、parametersと同梱アンテナモデルから実行ごとに生成する一時ファイルです。
入力カードだけを別のVOACAPへコピーする場合は、これらのアンテナファイルも設定に従って用意してください。

## 複数RXダイバーシティー

`POST /api/diversity`：共通TX・年月・周波数等に以下を追加します。
このAPIではトップレベルrx_lat/rx_lonは不要（先頭サイトから設定）。

```json
{
  "tx_lat":35.3,"tx_lon":139.67,"year":2026,"month":10,
  "ssn_source":"manual","ssn":80,"frequencies":[4,8,12],
  "rx_sites":[
    {"name":"RX-A","lat":26.21,"lon":127.68,"antenna":"whip","gain":0,"noise":150},
    {"name":"RX-B","lat":27.09,"lon":142.19,"antenna":"isotropic","gain":3,"noise":145}
  ],
  "independence_assumption":false
}
```

rx_sitesは2〜8個。サイト名は重複しない1〜40文字。緯経度は必須。
antenna/gain/noiseを省略した場合、共通のrx_antenna/rx_gain/noise（未指定ならwhip/0/150）を使用。
各サイトはTXから1 km以上離す必要があります。independence_assumptionは真偽値のみ、既定false。

応答：kind=rx_diversity、parameters（正規化RX一覧含む）、sites（id/name・各経路の24時間出力・条件・生出力・入力カード）、
diversity_hours（24UTC×周波数）、site_separations、note、engine/engine_commit、履歴id/created。
diversity_hours[].rows[]にはbest_site_id、best_rel_percent、union_lower_percent、union_upper_percent、
independent_scenario_percent、complete、valid_sites、sites_meeting_targetを収録。
独立値は明示指定時のみ、欠測時はnull。詳細はRX_DIVERSITY.md。

履歴kind=rx_diversity。CSVはサイト別行と該当時刻・周波数の統合評価列、JSONは生出力・入力カードを含む全結果。
CSVサイト名の先頭= / + / - / @は数式対策としてアポストロフィを付加します。
raw/input個別ダウンロードは地点間のみです。NOAA自動SSN・排他・Origin検証・エラーコードは既存と共通。
エンジンは最大8回逐次実行、各回60秒まで。失敗時は部分結果を履歴保存しません。

## 宇宙天気API

`GET /api/space-weather?year=2026&month=10`

省略時は現在のUTC年月。yearは1900〜2100、monthは1〜12の整数。不正値は400。
応答: provider, target_month, ssn（value, kind=observed/predicted, month, field, f10_7_sfu,
source_url, fetched_at=UNIX秒, stale）、current（scales.R/S/G=0〜5またはnull,
observed_at=UTC ISO時刻, stale, source_url, fetched_at）、sources, note。
対象月のSSNがなければssn=null。外部取得失敗でも200で欠測・stale・errorを返します。

`POST /api/predict` と `/api/coverage` に `ssn_source: "manual" | "noaa"` を追加。
省略時manual。noaaではクライアントSSNを使わずサーバー取得値を使用します。
対象月に有効な新鮮なSSNがなければ503。手動値への暗黙のフォールバックは行いません。
NOAA利用時は結果直下のspace_weatherに取得時点の出典情報を保存します。
詳細はSPACE_WEATHER.md。

## 実効SSN

`GET /api/effective-ssn?year=2026&month=10`

省略時は現在のUTC年月。観測foF2から求めた実効SSNを返します。
応答: method, target_month, computed_at, value（使えないときnull）, used_count, min_stations, spread（min, max）,
stations（code, name, provider, lat, lon, observed_at, fof2_mhz, model_fof2_mhz.ssn_0/ssn_250, effective_ssn, used, reason, credit）, error, note, giro_enabled。
値が求められなくても200でvalue=nullとerrorを返します。不正な年月は400。

`ssn_source: "effective"` を `POST /api/predict`・`/api/coverage`・`/api/diversity` に指定すると、クライアントのSSNを使わずサーバーで求めた値を使います。
対象年月が現在の月でなければ400、現在の月で観測が2局未満なら503。結果直下のeffective_ssnに上の応答を保存します。

## 観測・障害情報

`GET /api/observations`

- drap: data（observed_at, longitudes, rows[{lat, values}], quantity, note）、source_url、fetched_at（UNIX秒）、stale、error。
- nict: data（stations[{code,name,lat,lon,observed_at,fof2_mhz,bands[{distance_km,luf_mhz,muf_mhz}],quality,stale}], credit, note）と取得メタデータ。
- giro: enabled、許可されたstations、terms_url。
- 一部または全ソースが取得できなくても200でdata=null／stale／errorを返します。未取得・欠測を0に変換しません。

`GET /api/observations/giro?station=JR055`

stationはGU513／JR055／MHJ45のみ。省略時JR055、不正局は400。
HF_GIRO_ENABLED=1の場合、過去2時間のデータを取得し、data.series、data.latest、局位置（提供された場合）、出典・利用条件・取得メタデータを返します。
無効時は外部接続せず200、enabled=false、data=nullと設定説明を返します。
取得失敗や対象期間欠測はdata=null（古いキャッシュがあればそちら）、stale=true。
指定局と応答内URSIコードを照合。外部の任意URLや認証情報をクライアントから受け付けません。

これらのAPIはVOACAP結果を変更しません。各ソースの詳細と有効化はSPACE_WEATHER.md参照。


## 移動局位置参照

詳細は [POSITION_INTERFACE.md](POSITION_INTERFACE.md)。局ごとの受信形式と更新・認証仕様を定義しています。
入力は独立ゲートウェイ18083で受信し、本体は認証付き共通JSONを取得します。
本体連接は/internal/v1/positions・/internal/v1/stationsへ統一。仕様は[GATEWAY_PROTOCOL.md](GATEWAY_PROTOCOL.md)。
位置一覧・位置参照計算・局設定でゲートウェイに接続できない場合は503。固定座標計算は接続を必要としません。
予測3APIへtx_position/rx_position={source,id}、diversityのrx_sitesへposition_ref={source,id}を指定可能。
緯経度の代わりにサーバーの有効な最新位置を使い、結果へposition_inputsを保存します。
期限切れ・不明局・エンジン緯度範囲外は400、手動座標への暗黙の代替は行いません。
diversityのトップレベルrx_positionは無視、coverageの中心点はrx_positionに連動します。

## 外部データの条件表示・保存

宇宙天気APIの応答直下、および観測APIの各データ取得結果に `data_terms` を付加します。
内容は確認日（reviewed_at）、適用範囲、条件ページの相対パス、共通事項、
該当ソースの出典表示・条件・原文URLです。コード本体のMITで外部データを再許諾しません。
NOAA自動SSNを使う今後の計算では、space_weather.data_termsが履歴・JSON・CSVに保存されます。
既存の履歴・過去にダウンロードしたファイルへの遡及的な追記は行いません。
`/data-licenses.html` と `/data-licenses.json` で現行の条件一覧を参照できます。
