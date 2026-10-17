# 外部データの出典・ライセンス・利用条件

確認日：2026-10-15

本体コードのMITライセンスは、外部データの利用許諾を付与するものではありません。以下は各提供元の公表条件の要約で、原文に代わる許諾・法的判断ではありません。

## 共通事項

- 取得・表示・保存・加工・第三者への再配布は別の利用行為です。APIが公開されていることや、無償で取得できることだけでは、商用利用や再配布が許諾されたとは判断できません。
- 本システムによる形式変換、UTC変換、選択、集計、描画を行っても、元データの条件を本体のMITへ変更しません。加工した表示は、本システムによる表示であることを明示し、提供元の公式製品・推奨と誤認させないでください。
- 外部へデータ・キャッシュ・画面・CSV・JSON・計算履歴を渡す場合は、対象データの出典、原典URL、取得／観測時刻、加工内容、ライセンスURL、該当する通知を保持し、共有先・用途の条件を確認してください。
- データの正確性・即時性・継続提供は保証されません。提供元の更新周期とアクセス条件を守ってください。利用条件は変更される可能性があるため、利用開始時と外部提供前に原文を再確認してください。

## Natural Earth（同梱地図）

- **使用対象**：app/static/land.geojson：1:110m land
- **接続状況**：同梱・使用中
- **適用条件・確認状況**：Public Domain（地図データ）
- **出典表示**：Made with Natural Earth.

- 地図データは改変・再配布・商用利用が可能です。許可取得や著作者表示は必須ではありませんが、本システムでは出典を表示します。Webサイト全体やロゴまで同じ扱いとはしません。

原文・参照先：

- https://www.naturalearthdata.com/about/terms-of-use/
- https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson

## NOAA / NWS / SWPC（D-RAP・R/S/G・太陽活動予測）

- **使用対象**：D-RAP格子、現在のR/S/G、月別太陽活動データ
- **接続状況**：API接続済み
- **適用条件・確認状況**：NWS公表利用条件。第三者由来部分は別途確認
- **出典表示**：Source: NOAA / NWS Space Weather Prediction Center (SWPC).

- NWS自身のデータ・製品は、別注記がない限りpublic domainとして適法な目的に無償利用できるとされています。自作データと称したり、NOAA/NWSの承認・提携があると示したりしないでください。
- 加工した値や地図を公式の政府情報として提示しないでください。本システムの格子描画・経路付近の集計は本システムによる加工表示です。
- NWS素材が主体となる著作物を配布する場合は、含まれるNWS素材を識別し、米国内で著作権保護の対象外である旨の通知を付します。出典・時刻・原典リンクを保持します。
- 第三者データについては、NWSの一般条件をそのまま適用せず、提供元の条件を確認するよう求められています。SIDC/SILSO由来SSN、カナダPenticton等由来F10.7はこの確認対象です。

原文・参照先：

- https://www.weather.gov/disclaimer
- https://www.spaceweather.gov/products/solar-cycle-progression
- https://www.spaceweather.gov/products/d-region-absorption-predictions-d-rap

## SIDC / WDC-SILSO由来の黒点数（NOAA経由）

- **使用対象**：NOAAの観測平滑SSNの原データ。予測SSNは提供元・生成方法を区別して扱う
- **接続状況**：NOAA経由で使用。個別の権利関係は未確定
- **適用条件・確認状況**：SILSOの直接配布系列：CC BY-NC 4.0。NOAA配布物への適用範囲は未確認
- **出典表示**：WDC-SILSO, Royal Observatory of Belgium, Brussels; DOI: 10.24414/qnza-ac80.

- SILSOの直接配布系列では、出典表示と非商用条件が公表されています。利用時はライセンスへのリンクと、変更した場合の変更表示も保持してください。
- NOAAから取得した観測SSNについて、経由したことで元データの条件が解消されたとは判断していません。商用利用・組織外再配布については対象製品の提供元へ確認してください。
- NOAAが生成する予測SSNまで一律にSILSOのCC BY-NCであると断定するものではありません。観測値と予測値を区別し、各対象データの条件を確認してください。
- 非営利組織・公的機関による利用、無償サービスであることだけで、非商用に該当すると断定しません。本体の利用許諾を受けても、取得データの権利確認は別途必要です。

原文・参照先：

- https://www.sidc.be/index.php/SILSO/datafiles
- https://creativecommons.org/licenses/by-nc/4.0/
- https://www.spaceweather.gov/products/solar-cycle-progression
- https://www.weather.gov/disclaimer

## NICT / WDC for Ionosphere and Space Weather

- **使用対象**：国内4局の垂直観測由来F領域LUF/MUFサマリ
- **接続状況**：数値接続済み
- **適用条件・確認状況**：WDCの出典・謝辞要件。包括的な再配布許諾は未確認
- **出典表示**：Source: WDC for Ionosphere and Space Weather, Tokyo, National Institute of Information and Communications Technology (NICT).

- WDCから取得したデータを用いる発表・刊行物では、提供元NICT/WDCへの謝辞を記載してください。WDCは成果の写しの提供も希望しています。
- 本システムは数値の選択、JSTからUTCへの変換、表・地図表示を行います。NICTの公式表示・公式判定ではありません。元の自動読取データの品質や欠測を保証しません。
- 確認できたWDCの謝辞要件だけから、商用提供やデータ一式の組織外再配布が包括的に許諾されたとは判断していません。それらは取得元に確認してください。
- swc.nict.go.jpの図表等を別途利用する場合は、そのサイトの転載・改変・リンク条件も確認してください。本システムでは同サイトの画像やページを埋め込まず、原典へリンクします。

原文・参照先：

- https://wdc.nict.go.jp/wdc-top/policy.html
- https://wdc.nict.go.jp/Ionosphere/realtime/oblver.html
- https://swc.nict.go.jp/notice.html

## GIRO / Lowell GIRO Data Center（各観測局のデータ）

- **使用対象**：海外局のfoF2、MUF(3000)、CS、限定符
- **接続状況**：接続機能あり。既定無効（HF_GIRO_ENABLED=0）
- **適用条件・確認状況**：CC BY-NC-SA 4.0、およびLGDC Rules of the Road
- **出典表示**：GIRO / Lowell GIRO Data Center and the identified station data provider. Reference: Reinisch & Galkin (2011), DOI: 10.5047/eps.2011.03.001; resource: http://spase.info/SMWG/Observatory/GIRO.

- LGDCは公開アクセスの対象を教育・非商用研究として記載しています。業務運用・商用利用がこの範囲に入るとは仮定しません。範囲外の用途は提供元との確認・必要な許諾を行ってください。
- データは元の各観測局に帰属します。GIROと対象局を識別し、出典・ライセンスへのリンク・改変表示を保持してください。成果発表ではGIRO論文・資源の引用、データ所有者への共著機会の提示等、原文の公表条件を確認してください。
- LGDCの規則には、取得データの共有先を有効なLGDCアカウント保有者に限る旨があります。公開Web画面・APIでの再提供、キャッシュや観測値の外部配布を、取得できたという理由だけで行わないでください。
- 共有・修正・注釈を加えたデータは元のライセンスを保持するよう規定されています。観測値の手動訂正は、LGDCでは単なる派生成果ではなく修正データとして扱われます。派生成果に関する扱いも原文を確認してください。
- 有効化は利用者が用途と共有範囲を確認したうえで行います。設定を有効にするだけで許諾を取得したことにはなりません。GIROの条件を本体MITへ変更しません。

原文・参照先：

- https://giro.uml.edu/didbase/RulesOfTheRoad.html
- https://creativecommons.org/licenses/by-nc-sa/4.0/
- https://giro.uml.edu/didbase/scaled.php

この文書は app/static/data-licenses.json から scripts/build_data_notices.py で生成します。原文の代替ではありません。
