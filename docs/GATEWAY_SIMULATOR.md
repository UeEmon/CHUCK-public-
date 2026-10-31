# 位置ゲートウェイ試験用シミュレーター

`scripts/gateway_simulator.py` は、位置ゲートウェイの機能確認に使う治具です。船舶・航空機・車両の模擬局を推測航法で動かし、ゲートウェイが受け付けるすべての入力方式で位置を送ります。Python標準ライブラリだけで動き、ゲートウェイと同じマシンでも別のマシンからでも使えます。

| 入力方式 | 送り先 | 認証 |
|---|---|---|
| http-json | `POST /api/positions`（共通JSON） | 受信トークン |
| http-geojson | `POST /api/positions`（GeoJSON） | 受信トークン |
| http-nmea | `POST /api/positions/nmea`（RMC 1行） | 受信トークン |
| tcp | TCP 10110、NMEA 0183（GGAとRMC） | 局ごとの受信キー |
| udp | UDP 10110、NMEA 0183（GGAとRMC） | 局ごとの受信キー |

## 準備

ゲートウェイと同じ2つのトークンを環境変数に設定します。受信トークンは位置の送信に、本体連携用トークンは模擬局の登録・受信キーの発行・位置一覧の読み戻しに使います。TCP・UDPを試す場合は、ゲートウェイを `HF_GATEWAY_NMEA_STREAM=1` で起動しておきます。

```sh
export HF_POSITION_INGEST_TOKEN='…'    # ゲートウェイと同じ値
export HF_POSITION_GATEWAY_TOKEN='…'   # ゲートウェイと同じ値
```

模擬局はすべて送信元 `sim` で登録します（`--source` で変更可）。本番の局とは別の送信元名を使ってください。

## 機能確認（check）

```sh
python3 scripts/gateway_simulator.py check
```

模擬局を登録し、TCP・UDPの局には受信キーを発行してから、各方式で1回ずつ送ります。そのあと本体連携APIで位置一覧を読み戻し、項目ごとにPASS/FAILを表示します。1つでも不合格なら終了コード1、接続や設定の誤りは2を返します。

| 確認項目 | 合格の条件 |
|---|---|
| 各方式の局が位置一覧に反映 | 送った緯度・経度・種別の有効な位置が載る |
| 同じ観測時刻の再送 | `ignored_old_or_equal` として無視される |
| チェックサム誤りのNMEA | HTTP 400で拒否される |
| 測位無効（status=V）のRMC | HTTP 400で拒否される |
| 誤った受信トークン | HTTP 401で拒否される |
| 誤った受信キーのUDP | 位置が更新されない |
| TCPでGGAとRMCを混ぜて送る | GGAを読み飛ばし、RMCの位置が保存される |

誤った受信キーの確認は、ゲートウェイの「認証失敗」を1回増やします。同じ送信元IPから10分間に10回失敗すると、そのIPは10分間無視されるので、checkを短時間に何度も繰り返さないでください。

## 管制画面（serve）

```sh
python3 scripts/gateway_simulator.py serve --interval 2
# 表示された http://127.0.0.1:8090/ をブラウザで開く
```

ブラウザから模擬局を操作できます。画面はこのマシンの127.0.0.1だけで開き、トークンと受信キーは画面に出しません。

| 操作 | 内容 |
|---|---|
| 局を登録・受信キー発行 | 全局をゲートウェイに登録し、TCP・UDPの局に受信キーを発行する。行の「登録」で1局だけ |
| 送信開始・停止・1回だけ送信 | 送信間隔ごとに全局を進めて送る。行の「一時停止」で局ごとに止める |
| 速度・針路 | 表の入力欄を変えると次の送信から反映する |
| 異常送信 | チェックサム誤り、測位無効（status=V）、2日前の観測時刻、緯度95°、誤った受信キーを1回送る。結果は「最後の結果」に出る |
| 機能確認を実行 | `check` と同じ確認を画面から行い、PASS/FAILを一覧にする。終わったら受信キーが変わるので「局を登録」をやり直す |
| 局を追加・削除 | 種別・入力方式・初期位置・速度・針路を決めて追加する。追加した局は「登録」してから送る |

地図には送った位置と航跡（三角）と、本体連携APIで読み戻したゲートウェイの受信位置（青い輪）を重ねます。表の「ゲートウェイ受信」で、受信位置と経過秒数を比べられます。受信キーのないTCP・UDPの局は、認証失敗で送信元IPが無視されないよう、送らずに待ちます。

## 連続送信（run）

```sh
python3 scripts/gateway_simulator.py run --interval 5            # 停止はCtrl+C
python3 scripts/gateway_simulator.py run --only tcp --only udp --duration 600
```

5秒ごと（`--interval`）に模擬局を進めて送信し、送った位置と結果を1行ずつ表示します。ゲートウェイ管理画面や本体の地図で、局が動いていく様子を確認できます。TCPの局は1本の接続を保ち、切れたら受信キーを付けて接続し直します。

runは起動時に模擬局を登録し、受信キーを発行し直します。キーを固定したいときは、先に `setup --keys keys.json` でキーを書き出し、`run --no-setup --keys keys.json` で読み込みます。キーのファイルは所有者だけが読める権限で作ります。

## 遠隔のゲートウェイ

```sh
python3 scripts/gateway_simulator.py check --url https://gateway.example.org --nmea-host gateway.example.org
```

遠隔のゲートウェイにはHTTPSだけを使います（HTTPはループバックに限ります）。TCP・UDPの送り先は既定で `--url` のホスト、ポートは `--nmea-port`（既定10110）です。UDPだけ別のポートの場合は `--udp-port` を指定します。HTTPSのリバースプロキシの裏にある場合も、TCP・UDPの10110はプロキシを通らず直接届く必要があります。

## 模擬局を変える

`--scenario` にJSON配列を渡すと、局の数・種別・入力方式・初期位置・速度・針路を自由に決められます。

```json
[
  {"id": "ferry-1", "name": "模擬フェリー", "kind": "vessel", "transport": "tcp", "lat": 34.6, "lon": 135.2, "speed_knots": 18, "course_deg": 120},
  {"id": "heli-1", "name": "模擬ヘリ", "kind": "aircraft", "transport": "http-json", "lat": 35.6, "lon": 139.8, "speed_knots": 120, "course_deg": 300, "altitude_m": 600}
]
```

`id`・`kind`（vessel / aircraft / vehicle）・`transport`・`lat`・`lon` は必須です。`--only` で入力方式を絞り込めます。高度はJSON・GeoJSONで送り、NMEAのRMCには含めません。
