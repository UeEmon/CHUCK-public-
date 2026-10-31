# 国外の電離圏観測データ候補

確認日：2026-10-16 JST。以下は公開一次資料の確認結果です。新規ソースの実観測値取得や伝搬計算への同化は未実施です。

| ソース | 内容・形式 | 本システムへの適合と制約 |
|---|---|---|
| GIRO / Lowell DIDBase | 世界のイオノゾンデ観測。foF2、MUF(D)、信頼度等。既存のscaled.php応答を解析 | 現行連携済み。Guam・Juliusruh・Millstone Hillを選択可能。局ごとの欠測・自動読取品質・時刻を確認。利用条件への適合を確認して公開データ取得用コンテナの管理画面で有効化 |
| 豪州ASWFC / WDC | foF2・M(3000)F2・MUF(3000)F2等。5分値・時間値・月中央値。SCL、固定列、SAO、月別ZIP等 | 型式・単位・品質フラグが公開され、参考観測としての追加候補。autoとvalidで列順が異なり、再処理による重複・時刻の乱れあり。品質管理と重複整理が必要 |
| 豪州Space Weather API | 登録キー付きHTTPS POST/JSON。A/K/Dst指数、磁気警報・オーロラ情報 | 確認した公開仕様にはfoF2取得メソッドがない。電離圏観測値のJSON APIと混同しない。磁気擾乱の参考指標候補 |
| IGS Global Ionosphere Maps | GNSS由来の鉛直TEC。最終・速報・リアルタイム・予測の製品群、IONEX等 | 全球の電離圏状況表示・検証の候補。TECはfoF2やHF回線MUFとは別物で、そのままSSNや回線MUFへ代入しない。製品別の遅延・入手方法・解析センター条件を確認する必要あり |

## 利用条件

- GIROは[Rules of the Road](https://giro.uml.edu/didbase/RulesOfTheRoad.html)の出典・観測所の謝辞、非商用・継承等の条件を保持します。ソフトウェア本体のMITはデータに適用しません。詳細は既存の[外部データ条件](../DATA_LICENSES.md)を参照。
- [ASWFC WDCのデータ条件](https://sws.bom.gov.au/World_Data_Centre)は提供者の謝辞・利用論文の送付、商用／産業利用の事前書面合意、同僚への共有時の条件伝達を定めています。豪州気象局の一般ページにCC BYの案内があっても、WDC固有条件を無視して一律に再配布可とは扱いません。現段階では自動取得・同梱を追加していません。
- IGSの公開製品についても、個々の配布元・解析センター・取得経路の条件を確認してから再配布や商用提供の可否を判断します。今回一律の再配布許諾を確認したものではありません。

## 判断

既存GIROの局拡充が最も小さい変更で対応できる候補です。ただし局一覧の掲載だけで最新値の取得可を保証せず、追加ごとに局コード・座標・応答・品質を検証します。次の候補はASWFCの公開ファイルですが、用途に合う利用条件の確認と専用パーサーが必要です。IGS TECは別レイヤーの参考表示として検討します。

いずれも月間VOACAP予測のREL/SNRを自動補正する根拠にはしていません。例外は利用者が選ぶ実効SSN（[SPACE_WEATHER.md](SPACE_WEATHER.md)）で、NICTと有効化したGIROのfoF2からSSNを求めて計算に使います。取得成功時刻、観測時刻、品質・欠測、出典を分けて表示する方針です。

一次資料：

- [GIRO](https://giro.uml.edu/)、[利用条件](https://giro.uml.edu/didbase/RulesOfTheRoad.html)
- [ASWFC自動読取形式](https://sws.bom.gov.au/World_Data_Centre/2/8/12)、[ダウンロード案内](https://sws.bom.gov.au/World_Data_Centre/1/1)
- [Space Weather API仕様](https://sws-data.sws.bom.gov.au/api-docs)、[登録とAPIキー](https://sws-data.sws.bom.gov.au/register)
- [IGS電離圏ワーキンググループ](https://igs.org/wg/ionosphere/)、[製品案内](https://igs.org/data-products-overview/)
