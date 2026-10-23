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
| GET | /api/antenna-patterns | 登録済み利得表の一覧（格子の概要・SHA-256） |
| POST | /api/antenna-patterns | 利得表CSVの登録 `{name,source?,csv}`（同一オリジンのみ） |
| POST | /api/antenna-patterns/{id}/delete | 利得表の削除（プリセットから参照中は不可） |
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
  "power_w":1000,"frequencies":[2,4,6,8,10,12,14,16,18,20],
  "tx_antenna":"whip","rx_antenna":"whip",
  "tx_gain":0,"rx_gain":0,
  "noise":150,"min_angle":3,"required_snr":40,"reliability":90
}
```

`tx_antenna` / `rx_antenna` は `whip`、`isotropic`、`monopole`、`dipole`、`vertical_dipole`、`log_periodic`、`inverted_l`、`sloping_long_wire`、`pattern_table`。
`year,month,tx_lat,tx_lon,rx_lat,rx_lon` は必須、その他は上記の既定値を使用します。

寸法付き3モデルは`tx_length_m` / `rx_length_m`（0.1〜200 m）が必須です。
`{tx,rx}_height_m`（0〜200 m、ダイポール既定10・その他0）、`{tx,rx}_azimuth_deg`（0〜359.9、既定0）、
`{tx,rx}_ground_permittivity`（1〜80、既定13）、`{tx,rx}_ground_conductivity`（0.00003〜5 S/m、既定0.005）も指定できます。
水平ダイポールは高さ0.1 m以上、垂直ダイポールは給電点高が全長の半分より上である必要があります。
方位は水平ダイポールの主放射方向で、ワイヤー方向ではありません。`{tx,rx}_azimuth_mode`は`fixed`（既定、`azimuth_deg`を使用）または`path`（TXは受信局、RXは送信局への大圏方位を使用し、`azimuth_deg`は無視）。モノポールは地表設置、基準モデルは寸法未使用。
`log_periodic`（水平ログペリ、HFMUFES Type 43）は`length_m`を最長素子長、`height_m`を給電点高（0.1 m以上、既定10）とし、`{tx,rx}_lp_elements`（3〜20の整数、既定16）、`{tx,rx}_lp_tau`（0.7〜0.98、既定0.9）、`{tx,rx}_lp_apex_deg`（素子先端角5〜45°、既定25）、`{tx,rx}_lp_slope_deg`（鉛直からのアレイ傾斜0〜90°、既定90＝水平）、`{tx,rx}_lp_impedance_ohm`（50〜1000 Ω、既定450）を指定できます。`inverted_l`（逆L、Type 38）は`length_m`を水平部、`height_m`を垂直部（0.1 m以上、既定10）とします。`sloping_long_wire`（スローパー、Type 41）は`length_m`を線長、`height_m`を給電点高、`{tx,rx}_lw_slope_deg`（水平からの傾斜0〜90°、既定10）とし、方位は線が下る向き（主ローブ）で指定します。`pattern_table`（利得表）は`{tx,rx}_pattern_id`（登録済み利得表の32桁ID）が必須で、方位は表の基準方向です（[ANTENNA_PRESETS.md](ANTENNA_PRESETS.md#利得表実測解析パターン)）。結果には`{tx,rx}_pattern_sha256`と`{tx,rx}_pattern_offset_deg`を追加します。他のモデルではモデル固有項目は`null`です。ログペリ・逆L・スローパーの利得補正はTXカードの電力へ換算するため、送信電力・利得補正・偏波損失の組合せが1 mW〜100 MW相当の範囲外ならエラーです。
`rx_sites[]`ではプレフィックスなしの`length_m,height_m,azimuth_deg,azimuth_mode,ground_permittivity,ground_conductivity`と`lp_*`・`lw_slope_deg`・`pattern_id`を局ごとに指定できます。

### 変調・受信帯域・偏波

- `modulation`: 電波型式の3文字（例 `A1A`、`J3E`、`F1B`）または`manual`（既定）。
  1文字目は主搬送波の変調（N/A/H/R/J/B/C/F/G/D/P/K/L/M/Q/V/W/X）、2文字目は変調信号の性質（0/1/2/3/7/8/9/X）、
  3文字目は伝送情報の型式（N/A/B/C/D/E/F/W/X）。小文字は大文字に正規化します。
  旧形式の`cw/ssb/am/fm/fsk`はそれぞれ`A1A/J3E/A3E/F3E/F1B`へ読み替え、`psk/qam/ofdm/digital`は`manual`として扱います。
  電波型式は記録で、APIが型式ごとの必要SNRを強制しません。UIでA1A/J3E/A3Eを選ぶと24/45/67を例示入力しますが編集可能です。
- `bandwidth`: 占有帯域幅を電波型式の表記法で指定（例 `500H`、`2K40`、`3K00`、`16K0`）。
  4文字で、単位文字H/K/M/Gを小数点の位置に置きます（1 Hz〜1M00）。結果には`bandwidth`と換算した`bandwidth_hz`を保存します。
  旧形式の`bandwidth_hz`だけを指定した場合は有効数字3桁の表記へ丸めて扱います。
- `snr_input`: `direct`（既定）なら従来の`required_snr`（0〜99 dB·Hz）。
  `bandwidth`なら`bandwidth`（または旧形式の`bandwidth_hz`）と`inband_snr_db`（−40〜60）を指定。
  サーバーで`required_snr = inband_snr_db + 10 log10(bandwidth_hz)`を算出し、小数4桁へ丸めて0〜99の範囲を検証します。
- `tx_polarization/rx_polarization`: `model/vertical/horizontal/rhcp/lhcp/linear_other`（既定model）。
  メタデータとして保存し、方式名だけでパターンや偏波損失を変更しません。
  diversityの各`rx_sites[]`では`polarization`を個別指定できます。
- `polarization_loss_db`: 全経路に共通の仮定した追加損失0〜30 dB（既定0）。
  エンジンのTX電力を等価的に低減します。parameters.power_wは元の値を保持します。

### 吸収モード

- `absorption_mode`: 計算エンジン voacapl の `--absorption-mode`。`a`（既定、Alexの改良＋IONCAPの吸収）または `W`（VOACAP標準）。
  `a` はVOACAP Online Marineと同じ値になります（`docs/VALIDATION.md` 2026-10-23）。`W` は吸収指数に下限0.1を設けるため、夜間の低い周波数で受信電力が低めに出ます。
  2026-10-23より前の結果は `W` で計算しており、`parameters` にこの項目がありません。
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

## 拠点間メッシュ

`POST /api/mesh`：年月・周波数・要求SNR等の共通値に、拠点一覧mesh_sitesを追加します。
トップレベルのtx_*/rx_*は不要です（先頭2拠点から設定）。tx_position/rx_position/rx_sitesは無視します。

```json
{
  "year":2026,"month":10,"ssn_source":"manual","ssn":80,"frequencies":[4,8,12],"power_w":500,
  "mesh_sites":[
    {"name":"A","lat":35.68,"lon":139.69,"antenna":"whip","gain":0,"noise":150,"power_w":1000},
    {"name":"B","lat":26.21,"lon":127.68,"antenna":"dipole","length_m":20,"height_m":12,"noise":145,"power_w":100},
    {"name":"C","lat":13.45,"lon":144.75,"position_ref":{"source":"gateway","id":"ship"},
     "receive":{"antenna":"vertical_dipole","length_m":10,"height_m":8,"gain":0}}
  ]
}
```

mesh_sitesは2〜8個。拠点名は重複しない1〜40文字、拠点どうしは1 km以上離します。
antenna/gain/polarization/noise/power_wを省略した場合は共通のtx_antenna/tx_gain/tx_polarization/noise/power_w
（未指定ならwhip/0/model/150/1000）を使います。アンテナ寸法等はrx_sitesと同じ項目を拠点ごとに指定できます。
receiveは受信に使う別のアンテナで、antenna/gainと寸法等を指定します。省略すると送信と同じアンテナで受信します。
position_refはゲートウェイの最新位置に置き換え、position_inputs.mesh_site_Nに記録します。

応答：kind=mesh、parameters（正規化した拠点一覧mesh_sitesを含む）、sites（id=n1〜nN、name、lat/lon、antenna、gain、noise、power_w、偏波・寸法、receive（別の受信アンテナ、なければnull））、
links（tx_id、rx_id、distance_km、bearing_deg、24時間×周波数のhours）、note、engine/engine_commit、履歴id/created。
linksはTXの入力順、RXの入力順に並び、自己経路は含みません。経路ごとの生出力・入力カードは保存しません。

履歴kind=mesh。CSVは経路×UTC×周波数の行で、tx_id/tx_name/rx_id/rx_name、REL/SNR/信号/打上げ角/MUF、距離、
目標REL以上かどうか（meets_target）を収録します。拠点名の先頭= / + / - / @にはアポストロフィを付加します。
エンジンはN×(N−1)回逐次実行、各回60秒まで。失敗時は部分結果を保存しません。
公開版では回数制限のコストが8です。詳細は[MESH.md](MESH.md)。

## 12か月の見通し

`POST /api/annual`：`/api/predict` と同じ入力で、year/monthから始まる12か月の24時間予測を計算します。
ssn_sourceはmanual（全月同じSSN）またはnoaa（月ごとの平滑SSN、新鮮な値がない月は計算しない）。
effectiveは400で拒否します。開始月にNOAAの値がない場合は `/api/predict` と同じく503です。

応答：kind=annual、parameters、distance_km、bearing_deg、months（year、month、ssn、hours。NOAAではssn_detail、
SSNのない月はssn=null・missing・空のhours）、note、engine/engine_commit、履歴id/created。
月ごとの生出力・入力カードは保存しないため、raw/input出力はありません。

履歴kind=annual。CSVは月×UTC×周波数の行で、year/month/SSN、REL/SNR/信号/打上げ角/MUF、
目標REL以上かどうか（meets_target）を収録します。SSNのない月は空欄の1行です。
エンジンは最大12回逐次実行、各回60秒まで。公開版では回数制限のコストが4です。詳細は[ANNUAL.md](ANNUAL.md)。

## 必要な送信電力

`POST /api/power`：`/api/predict` と同じ入力で、送信電力を10・20・50・100・200・500・1000・2000・5000・10000 Wに変えて24時間予測を計算します。
入力のpower_wは計算に使わず、parametersにそのまま残します。

応答：kind=power、parameters、ladder（電力の段階）、distance_km、bearing_deg、
steps（power_w、hours_meeting、hours。hoursの各行はfrequency_mhz・reliability・snr_db_hz）、
minimum（hour_utc、rows［frequency_mhz、power_w。届かなければnull］、best［最小電力の周波数・電力・REL。届かなければnull］）、
note、engine/engine_commit、履歴id/created。生出力・入力カードは保存しないため、raw/input出力はありません。

履歴kind=power。CSVは電力×UTC×周波数の行で、REL/SNR/MUF、目標REL以上かどうか（meets_target）、
その時刻・周波数の最小電力（minimum_power_W、届かなければ空欄）を収録します。
エンジンは10回逐次実行、各回60秒まで。公開版では回数制限のコストが4です。詳細は[POWER.md](POWER.md)。

## 拠点の候補

`POST /api/sites`：`/api/predict` と同じ入力に、candidates（1〜10件。各要素はid・name［1〜40文字］・lat・lon）と
site_mode（receive［既定］またはrelay）を加えます。receiveはTX→候補（RX1のアンテナ・雑音）、
relayはTX→候補と候補→RX1（候補はTXのアンテナ・送信電力で再送信）を計算します。

応答：kind=sites、parameters、site_mode、candidates（順位順。rank、id、name、lat、lon、distance_tx_km、relayではdistance_rx_km、
hours［hour_utc、reliability、frequencies（区間ごとの最良周波数）］、hours_meeting、mean_reliability。
TX・RX1から1 km未満の候補はskippedと空のhours、rank=null）、note、engine/engine_commit、履歴id/created。
生出力・入力カードは保存しないため、raw/input出力はありません。

履歴kind=sites。CSVは候補×UTCの行で、順位、地点、距離、時間数、平均REL、REL、区間ごとの周波数、目標REL以上かどうかを収録します。
エンジンは最大20回逐次実行、各回60秒まで。公開版では回数制限のコストが5です。詳細は[SITES.md](SITES.md)。

## 定時の再計算

`GET /api/watches`：interval_hours、max、note、watches（登録順）を返します。
各watchはid、created、result_id、label、parameters、baseline、latest（checked、ssn、ssn_detail、hours_meeting、
best［hour_utc、frequency_mhz、reliability］。失敗時はchecked・error）、基準がまだない場合のlast_error、acknowledged、
status（pending／same／better／worse／error）、notify（worseで未確認ならtrue）です。

`POST /api/watches`（同一オリジン、application/json）：
`{"action":"add","result_id":"…"}` は単一RXの地点間予測の履歴を登録し、すぐに1回再計算します（最大20件）。
`{"action":"run","id":"…"}` は今すぐ再計算します（他の計算中は409）。
`{"action":"acknowledge","id":"…"}` は最新の減少を確認済みにし、`{"action":"delete","id":"…"}` は削除します。
応答はGETと同じ形です。公開版では管理者だけが使えます。詳細は[WATCH.md](WATCH.md)。

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
