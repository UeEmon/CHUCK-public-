# GPS等のシリアル接続（シリアル中継）

GPS受信機、船舶のNMEAマルチプレクサ、USB接続のGPSなど、NMEA 0183をシリアルで出す機器から位置を送るための中継プログラムです。
ゲートウェイはクラウドのサーバーで動いており機器を直接つなげないため、機器をつないだPC（ノートPC、Raspberry Piなど）で `scripts/serial_bridge.py` を動かします。
シリアルから読んだNMEAを、局の受信キーを付けて[TCP・UDPでのNMEA受信](POSITION_INTERFACE.md#tcpudpでのnmea受信)へ送ります。

```text
GPS ──シリアル/USB── PC（serial_bridge.py） ──TCP/UDP 10120＋受信キー──> 位置ゲートウェイ
```

## 必要なもの

- Python 3.9以降。LinuxとmacOSは標準ライブラリだけで動きます。Windowsは `pip install pyserial` が必要です。
- ゲートウェイ管理画面で作った受信形式「NMEA 0183」の局と、その局の受信キー（局一覧の「受信キー」の「発行」で表示）。
- ゲートウェイのTCP・UDP受信が有効で、ファイアウォールが開いていること。公開版のサーバーではポート10120です。

## 使い方

1. 機器をつなぎ、ポート名を確かめます。

   ```sh
   python3 scripts/serial_bridge.py --list
   ```

   LinuxはUSB変換器が `/dev/ttyUSB0`、USB GPSが `/dev/ttyACM0` など、macOSは `/dev/cu.usbserial-…`・`/dev/cu.usbmodem…`、WindowsはデバイスマネージャーのCOM番号（`COM3` など）です。
   Linuxでポートを開けないときは、利用者を `dialout` グループに加えてログインし直します（`sudo usermod -aG dialout $USER`）。

2. 受信キーを環境変数かファイルで渡し、中継を始めます。キーはコマンドの引数には書けません（プロセス一覧に見えるため）。

   ```sh
   export HF_GATEWAY_STREAM_KEY='（管理画面で表示された受信キー）'
   python3 scripts/serial_bridge.py /dev/ttyUSB0 --host 168.110.7.225 --port 10120
   ```

   ```bat
   rem Windows
   set HF_GATEWAY_STREAM_KEY=（受信キー）
   py scripts\serial_bridge.py COM3 --host 168.110.7.225 --port 10120
   ```

   ファイルで渡す場合は `--key-file station.key`（所有者だけが読める権限にします）。

3. 管理画面の「ゲートウェイ状態」で保存件数が増え、局の位置が更新されることを確かめます。中継側も60秒ごと（`--report`）に件数を表示します。

| オプション | 既定 | 内容 |
|---|---|---|
| `--baud` | 4800 | 通信速度。NMEA 0183の標準は4800。AIS・高速GPSは38400、USB GPSは9600などが多い（機器の説明書を確認）。1200〜230400 |
| `--host` | （必須） | ゲートウェイのホスト名またはIPアドレス |
| `--port` | 10120 | ゲートウェイのTCP・UDPポート |
| `--udp` | TCP | UDPで送る。携帯回線で接続が切れやすい場合など |
| `--sentences` | RMC,HDT,HDG,THS | 送るセンテンスの種類（カンマ区切り）。ゲートウェイが保存するのは位置のRMCと船首方位のHDT・HDG・THSなので通常は既定のまま。`all` で全部 |
| `--max-rate` | 5 | 種類ごとの最大送信回数/秒。10 Hzの受信機でも5回/秒に間引く。ゲートウェイの上限は送信元ごとに毎秒20行 |
| `--report` | 60 | 件数を表示する間隔秒。0で表示しない |

通信は8ビット・パリティなし・ストップビット1（8N1）です。データ形式は機器側で「NMEA 0183出力」を選んでください（u-bloxのUBXなどバイナリのみの設定では送れません）。

## 動作

- チェックサムが合わない行、NMEAでない行はPCで捨て、ゲートウェイには送りません。
- 機器を抜いた・ゲートウェイに届かないなどで切れたときは、1秒から最大30秒まで間隔を広げながら自動で接続し直します。切れている間の位置は送らずに捨てます（古い位置を後からまとめて送ることはしません）。
- TCPは接続直後に受信キーを1行送り、その後NMEAを送り続けます。UDPは各データグラムの1行目に受信キーを付けます。
- `-` を指定すると標準入力から読みます。記録したNMEAファイルの再送などに使えます（`python3 scripts/serial_bridge.py - --host … < log.nmea`）。
- 終了時（Ctrl+C、systemdの停止）に件数をまとめて表示します。

| 表示 | 意味 |
|---|---|
| 受信 | シリアルから読んだ行数 |
| 送信 | ゲートウェイへ送った行数 |
| 未送信 | 接続できず捨てた行数 |
| チェックサム誤り等 | 壊れた行。多い場合は通信速度の違いを疑う |
| 対象外 | `--sentences` に含まれない種類（GGA・GSVなど） |
| 間引き | `--max-rate` を超えたため送らなかった行数 |

## 常時動かす（Linux・Raspberry Pi）

```ini
# /etc/systemd/system/chuck-serial.service
[Unit]
Description=CHUCK serial NMEA bridge
After=network-online.target
Wants=network-online.target

[Service]
User=pi
Group=dialout
EnvironmentFile=/etc/chuck-serial.env
ExecStart=/usr/bin/python3 /home/pi/CHUCK/scripts/serial_bridge.py /dev/serial/by-id/usb-XXXX --host 168.110.7.225 --port 10120
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

`/etc/chuck-serial.env` に `HF_GATEWAY_STREAM_KEY=…` と書き、`sudo chmod 600 /etc/chuck-serial.env` にします。
`/dev/serial/by-id/…` を使うと、USBの差し替えで `ttyUSB0` と `ttyUSB1` が入れ替わっても同じ機器を指せます。
`sudo systemctl enable --now chuck-serial`、状態は `journalctl -u chuck-serial -f` で確認します。

## 機器なしで試す

試験用シミュレーターの `serial` コマンドが、疑似シリアルポート（LinuxとmacOS）にGPSのようにRMC・GGAを毎秒出力します（`--station ship-tcp` ならHDTも）。

```sh
python3 scripts/gateway_simulator.py serial --station car-nmea
# 疑似シリアルポート: /dev/pts/3（car-nmea のRMC・GGAを1秒ごとに出力）
python3 scripts/serial_bridge.py /dev/pts/3 --host 127.0.0.1 --port 10110   # 別の端末で
```

## 注意

- TCP・UDPは暗号化されません。受信キーと位置は平文で流れるため、漏れたと思ったら管理画面で再発行してください。暗号化が必要な場合はHTTPSの `/api/positions/nmea` を使う送信機を検討してください。
- PCの時計は位置の時刻に使いません（RMCの時刻をそのまま送ります）。受信機が測位していない間（RMCの状態V）はゲートウェイが保存しません。
- ジャイロコンパス・GNSSコンパスのHDT・HDG・THSが同じシリアル線（マルチプレクサ経由など）に流れていれば、そのまま船首方位としてゲートウェイへ届きます。別のポートにつながっている場合は、同じ受信キーで中継をもう1つ動かしてください。HDGは偏差付きのものだけが使われます。
- AIS（`!AIVDM`）は `--sentences all` で送れますが、ゲートウェイは現在RMCと船首方位だけを保存し、AISは読み飛ばします。
