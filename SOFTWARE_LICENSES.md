# ソフトウェアの利用条件と再配布対象

確認日：2026-10-15。本体MIT・外部データ条件・第三者ソフト条件を区別します。
公表条件と取得物の照合に基づく整理であり、法律専門家による保証ではありません。

## ソース一式

| 対象 | 条件 | 通知と対応 |
|---|---|---|
| 本体Python・JavaScript・HTML/CSS・独自スクリプト | MIT | LICENSEを保持 |
| voacaplのNTIA/ITS由来部分 | 米国政府由来ソフトの原文通知 | vendor/LICENSE、vendor/COPYINGを保持。米国内の著作権保護に関する記述を国外に無条件で一般化しない |
| J.A. Watsonによるエンジン改変 | CC0 | 上流原文を保持 |
| dst2csv・dst2ascii・f90getopt | GPL-3.0-or-later | 著作権表示・GPL全文・対応するソースを保持。最終実行イメージに変換ツールのバイナリは含めない |
| ar-lib・compile・missing | GPL-2.0-or-laterとファイル内の配布例外 | 原文ヘッダを保持、GPL-2全文を同梱 |
| configure・aclocal生成コード | ファイル内の許諾・例外 | 各原文を保持 |
| install-sh | X Consortiumの許諾 | ファイル内の著作権・許諾を保持 |
| 地図・外部データ | データ別条件 | DATA_LICENSES.md参照。コードMITの対象ではない |

全ソースの出典・例外はTHIRD_PARTY_NOTICES.md、ローカル変更はvendor/LOCAL_CHANGES.md。
GPLソフトの使用だけで本体すべてをGPLに変更するという扱いにはしていません。
本体は独立したPython/JSコード、計算エンジンは外部プロセスです。GPLのDST変換部品を本体へリンクしていません。

## Docker最終イメージ

本体と独立位置ゲートウェイは同じ最終イメージを使い、Pythonの起動コマンドを分けています。
下記のパッケージ在庫・通知・対応ソースは両方に共通です。位置ゲートウェイ用の追加外部依存はありません。

基準：python:3.12-slim-bookwormのOCI index digest
`sha256:34386ef0cb081344d7ec1c103ba398e6e9f64e9ab3a1509accc92a4e24a07258`。
amd64/arm64の実レイヤと、Debian配布の追加ライブラリを読み取り、全copyright通知を照合しました。

| 対象 | 固定した内容・条件 |
|---|---|
| CPython | 3.12.15。PSF License 2と内包部品の条件。取得したLICENSE全文を同梱 |
| Debian基盤 | 各CPUとも105パッケージ。各パッケージの個別条件を保持。MIT一括とはしない |
| amd64追加 | libgfortran5、libquadmath0（12.2.0-14+deb12u1）。最終107パッケージ |
| arm64追加 | libgfortran5（同版）。最終106パッケージ。libquadmath0を明示要求しない |
| libgfortran | GPLとGCC Runtime Library Exception 3.1。例外はライブラリ自身のソース・通知の配布義務を消すものではない |
| libquadmath・glibc等 | LGPL系を含むパッケージ別の条件。GCC例外を一律には適用しない |
| SQLite、OpenSSL、圧縮・文字コード等 | CPython内包部品とDebianパッケージの原文を保持 |

全パッケージ名・バージョン・CPU・ソースパッケージ版・通知のSHA-256は
[runtime-license-lock.json](licenses/runtime-license-lock.json) に記録しています。
パッケージ全体のライセンスは複数あり、単一のSPDX名に誤ってまとめません。
最終イメージの `/licenses/runtime/package-notices/*.copyright` にパッケージごとの原文、
`/licenses/runtime/common-licenses/` に参照先の全文、`runtime-inventory.json` に実照合結果を収録します。

Debian mainの公開パッケージとその条件を根拠に再配布対象としています。
検査は「Debianだから無条件に配れる」という判断ではなく、固定版の通知保持・
対応ソースの同時提供・使用した部品の条件履行を前提とします。

## 除外と影響

- ソースから上流ロゴ1点、マニュアル4点を保守的に除外。計算・Web/APIには不要。
- 最終イメージから未使用のpipとensurepipを除外。新規Pythonパッケージのインストール機能はなくなりますが、本体は標準ライブラリのみで動作します。
- setuptools/wheelが存在する場合も除外。ビルド段階・上流ベースの履歴レイヤは配布しません。
- 最終イメージはscratchへ監査済みファイルシステムをコピーする構成とし、削除済みpipが下位レイヤから配布されることを避けます。
- GPL/LGPLという理由で必要なエンジンやライブラリを削除していません。
- 外部の観測データ、計算履歴、キャッシュ、認証情報、データ用ボリュームはソース・イメージの配布物に含めません。GIRO接続コードはデータそのものではなく、既定無効を維持します。

## 原文

- Python：https://docs.python.org/3.12/license.html
- f90getopt：https://github.com/haniibrahim/f90getopt
- GCC例外：https://www.gnu.org/licenses/gcc-exception-3.1.en.html
- Debianパッケージ著作権ファイル：https://www.debian.org/doc/debian-policy/ch-docs.html
- Debianの分類：https://www.debian.org/legal/licenses/
- Docker公式Python：https://hub.docker.com/_/python

## 確認の限界

Docker実行環境がないため、変更後Dockerfileのビルド、最終イメージ内検査、対応ソースの一括取得と配布束の生成はまだ実行していません。
そのため現段階で「配布用完成イメージの全条件履行済み」とは表明しません。
実ビルドでロックと差異があれば停止し、対応ソースを取得できなければ配布束を作らない構成です。
Docker Desktop/Engine等のホスト製品は本イメージに同梱せず、その利用条件は本体MITでは許諾しません。
