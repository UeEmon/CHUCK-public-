'use strict';
// Locale order: en, fr, es, it, pt, de, ko. Source keys are Japanese.
const HF_MESSAGES={
  "操作要領の第4版": [
    "Manual, 4th edition",
    "Manuel, 4e édition",
    "Manual, 4.ª edición",
    "Manuale, 4ª edizione",
    "Manual, 4.ª edição",
    "Handbuch, 4. Ausgabe",
    "조작 요령 제4판"
  ],
  "操作要領（第4版）を最新の画面に合わせて更新しました。ヒートマップで選んだセルの枠表示と、結果のサイト名の多言語表示を反映し、8言語すべての画面図を撮り直しました。": [
    "The manual (4th edition) has been updated to the current screens. It covers the outline of the selected heatmap cell and the site names in results shown in the screen language, and all figures were retaken in all 8 languages.",
    "Le manuel (4e édition) a été mis à jour selon les écrans actuels. Il couvre le cadre de la cellule choisie dans les cartes de chaleur et les noms de sites des résultats affichés dans la langue de l’écran ; toutes les figures ont été refaites dans les 8 langues.",
    "El manual (4.ª edición) se ha actualizado con las pantallas actuales. Incluye el marco de la celda elegida en los mapas de calor y los nombres de sitios de los resultados en el idioma de la pantalla, y todas las figuras se han vuelto a tomar en los 8 idiomas.",
    "Il manuale (4ª edizione) è stato aggiornato alle schermate attuali. Tratta il riquadro della cella scelta nelle mappe di calore e i nomi dei siti nei risultati mostrati nella lingua della schermata; tutte le figure sono state rifatte in tutte le 8 lingue.",
    "O manual (4.ª edição) foi atualizado para os ecrãs atuais. Abrange a moldura da célula escolhida nos mapas de calor e os nomes dos locais nos resultados no idioma do ecrã, e todas as figuras foram refeitas nos 8 idiomas.",
    "Das Handbuch (4. Ausgabe) wurde an die aktuellen Bildschirme angepasst. Es behandelt den Rahmen der gewählten Heatmap-Zelle und die Standortnamen in Ergebnissen in der Bildschirmsprache; alle Abbildungen wurden in allen 8 Sprachen neu aufgenommen.",
    "조작 요령(제4판)을 최신 화면에 맞추어 갱신했습니다. 히트맵에서 선택한 셀의 테두리 표시와 결과의 사이트 이름 다국어 표시를 반영하고, 8개 언어의 그림을 모두 다시 찍었습니다."
  ],
  "結果のサイト名の多言語化": [
    "Site names in results translated",
    "Noms de sites traduits dans les résultats",
    "Nombres de sitios traducidos en los resultados",
    "Nomi dei siti tradotti nei risultati",
    "Nomes de locais traduzidos nos resultados",
    "Standortnamen in Ergebnissen übersetzt",
    "결과의 사이트 이름 다국어화"
  ],
  "メッシュのTX × RXマトリックス、ダイバーシティーの表、Propagation Chartのサイト選択、報告書で、初期登録の地点名（東京・グアムなど）を表示中の言語で示すようにしました。登録・名前を変えた地点名は入力したまま表示します。": [
    "The mesh TX × RX matrix, the diversity tables, the Propagation Chart site selector and reports now show the built-in location names (Tokyo, Guam and so on) in the selected language. Locations you registered or renamed keep the name as entered.",
    "La matrice TX × RX du maillage, les tableaux de diversité, le choix du site du Propagation Chart et les rapports affichent désormais les noms des lieux prédéfinis (Tokyo, Guam, etc.) dans la langue choisie. Les lieux que vous avez enregistrés ou renommés gardent le nom saisi.",
    "La matriz TX × RX de la malla, las tablas de diversidad, el selector de sitio del Propagation Chart y los informes muestran ahora los nombres de las ubicaciones predefinidas (Tokio, Guam, etc.) en el idioma seleccionado. Las ubicaciones que usted registró o renombró conservan el nombre introducido.",
    "La matrice TX × RX della maglia, le tabelle di diversità, la scelta del sito del Propagation Chart e i rapporti mostrano ora i nomi delle località predefinite (Tokyo, Guam, ecc.) nella lingua selezionata. Le località registrate o rinominate da voi mantengono il nome inserito.",
    "A matriz TX × RX da malha, as tabelas de diversidade, o seletor de local do Propagation Chart e os relatórios mostram agora os nomes dos locais predefinidos (Tóquio, Guam etc.) no idioma selecionado. Os locais que você registrou ou renomeou mantêm o nome digitado.",
    "Die TX × RX-Matrix des Netzes, die Diversity-Tabellen, die Standortauswahl des Propagation Chart und Berichte zeigen die vordefinierten Ortsnamen (Tokio, Guam usw.) jetzt in der gewählten Sprache. Selbst angelegte oder umbenannte Orte behalten den eingegebenen Namen.",
    "메시 TX × RX 매트릭스, 다이버시티 표, Propagation Chart의 사이트 선택, 보고서에서 초기 등록 지점 이름(도쿄, 괌 등)을 선택한 언어로 표시합니다. 직접 등록하거나 이름을 바꾼 지점은 입력한 이름 그대로 표시합니다."
  ],
  "操作要領の8言語化": [
    "Manual in 8 languages",
    "Manuel en 8 langues",
    "Manual en 8 idiomas",
    "Manuale in 8 lingue",
    "Manual em 8 idiomas",
    "Handbuch in 8 Sprachen",
    "조작 요령 8개 언어 제공"
  ],
  "操作要領を画面の8言語それぞれで用意し、画面図もその言語の画面にしました。画面上部の「操作要領（PDF）」で、表示中の言語のPDFをダウンロードできます。Word版の配布は終了しました。": [
    "The operation manual is now available in each of the 8 screen languages, with figures taken from the screen in that language. “Manual (PDF)” at the top of the screen downloads the PDF in the current language. The Word version is no longer distributed.",
    "Le manuel d’utilisation est désormais disponible dans chacune des 8 langues de l’écran, avec des figures tirées de l’écran dans cette langue. « Manuel (PDF) » en haut de l’écran télécharge le PDF dans la langue affichée. La version Word n’est plus distribuée.",
    "El manual de operación está ahora disponible en cada uno de los 8 idiomas de la pantalla, con figuras tomadas de la pantalla en ese idioma. «Manual (PDF)» en la parte superior descarga el PDF en el idioma actual. La versión Word ya no se distribuye.",
    "Il manuale d’uso è ora disponibile in ciascuna delle 8 lingue della schermata, con figure tratte dalla schermata in quella lingua. «Manuale (PDF)» in alto scarica il PDF nella lingua attuale. La versione Word non è più distribuita.",
    "O manual de operação está agora disponível em cada um dos 8 idiomas do ecrã, com figuras tiradas do ecrã nesse idioma. “Manual (PDF)” no topo do ecrã transfere o PDF no idioma atual. A versão Word deixou de ser distribuída.",
    "Das Bedienungshandbuch gibt es jetzt in jeder der 8 Bildschirmsprachen, mit Abbildungen des Bildschirms in dieser Sprache. „Handbuch (PDF)“ oben im Bildschirm lädt das PDF in der angezeigten Sprache herunter. Die Word-Fassung wird nicht mehr verteilt.",
    "조작 요령을 화면의 8개 언어별로 마련하고, 그림도 해당 언어의 화면으로 했습니다. 화면 위쪽의 ‘조작 요령(PDF)’에서 표시 중인 언어의 PDF를 다운로드할 수 있습니다. Word판 배포는 종료했습니다."
  ],
  "メッシュ予測の回線マップを双方向で表示": [
    "Mesh forecast circuit map in both directions",
    "Carte du circuit de la prévision maillée dans les deux sens",
    "Mapa del circuito de la predicción de malla en ambos sentidos",
    "Mappa del collegamento della previsione mesh in entrambe le direzioni",
    "Mapa do circuito da previsão de malha nos dois sentidos",
    "Verbindungskarte der Mesh-Prognose in beide Richtungen",
    "메시 예측 회선 지도의 양방향 표시"
  ],
  "メッシュ予測の回線マップで、拠点の組ごとにA→BとB→Aの2本の経路を並べて描き、矢印で向きを、色とラベルでそれぞれの方向のRELを示します。これまでは片方向のRELだけを表示していました。": [
    "The mesh forecast circuit map now draws two paths side by side for each station pair, A→B and B→A, with arrows for the direction and colours and labels for the REL of each direction. Previously only the REL of one direction was shown.",
    "La carte du circuit de la prévision maillée trace désormais deux trajets côte à côte pour chaque paire de stations, A→B et B→A, avec des flèches pour le sens et des couleurs et étiquettes pour la REL de chaque sens. Auparavant, seule la REL d’un sens était affichée.",
    "El mapa del circuito de la predicción de malla dibuja ahora dos trayectos uno junto al otro para cada par de estaciones, A→B y B→A, con flechas para el sentido y colores y etiquetas para la REL de cada sentido. Antes solo se mostraba la REL de un sentido.",
    "La mappa del collegamento della previsione mesh ora traccia due percorsi affiancati per ogni coppia di stazioni, A→B e B→A, con frecce per la direzione e colori ed etichette per la REL di ciascuna direzione. Prima veniva mostrata solo la REL di una direzione.",
    "O mapa do circuito da previsão de malha agora desenha dois percursos lado a lado para cada par de estações, A→B e B→A, com setas para o sentido e cores e rótulos para a REL de cada sentido. Antes só era mostrada a REL de um sentido.",
    "Die Verbindungskarte der Mesh-Prognose zeichnet nun für jedes Stationspaar zwei Pfade nebeneinander, A→B und B→A, mit Pfeilen für die Richtung sowie Farben und Beschriftungen für die REL jeder Richtung. Bisher wurde nur die REL einer Richtung angezeigt.",
    "메시 예측의 회선 지도에서 거점 쌍마다 A→B와 B→A의 두 경로를 나란히 그리고, 화살표로 방향을, 색과 라벨로 각 방향의 REL을 표시합니다. 이전에는 한 방향의 REL만 표시했습니다."
  ],
  "選んだ周波数の回線マップ表示": [
    "Circuit map for the chosen frequency",
    "Carte du circuit pour la fréquence choisie",
    "Mapa del circuito para la frecuencia elegida",
    "Mappa del collegamento per la frequenza scelta",
    "Mapa do circuito para a frequência escolhida",
    "Verbindungskarte für die gewählte Frequenz",
    "선택한 주파수의 회선 지도"
  ],
  "24時間予測・ダイバーシティー予測・メッシュ予測で周波数の行を選んでいるときは、回線マップの経路の色とRELもその周波数で表示します。同じセルをもう一度選ぶと周波数の選択が外れ、最良周波数の表示に戻ります。": [
    "When a frequency row is chosen in the 24-hour forecast, diversity forecast or mesh forecast, the circuit map path colour and REL are also shown for that frequency. Choosing the same cell again clears the frequency and returns to the best frequency.",
    "Lorsqu’une ligne de fréquence est choisie dans la prévision sur 24 h, la prévision de diversité ou la prévision maillée, la couleur du trajet et la REL sur la carte du circuit sont aussi affichées pour cette fréquence. Choisir à nouveau la même cellule annule la fréquence et revient à la meilleure fréquence.",
    "Cuando se elige una fila de frecuencia en la predicción de 24 horas, la predicción de diversidad o la predicción de malla, el color del trayecto y la REL del mapa del circuito también se muestran para esa frecuencia. Al elegir de nuevo la misma celda se quita la frecuencia y se vuelve a la mejor frecuencia.",
    "Quando si sceglie una riga di frequenza nella previsione di 24 ore, nella previsione di diversità o nella previsione mesh, anche il colore del percorso e la REL sulla mappa del collegamento sono mostrati per quella frequenza. Scegliendo di nuovo la stessa cella la frequenza viene deselezionata e si torna alla frequenza migliore.",
    "Quando uma linha de frequência é escolhida na previsão de 24 horas, na previsão de diversidade ou na previsão de malha, a cor do percurso e a REL no mapa do circuito também são mostradas para essa frequência. Escolher a mesma célula novamente remove a frequência e volta à melhor frequência.",
    "Ist in der 24-Stunden-Prognose, der Diversity-Prognose oder der Mesh-Prognose eine Frequenzzeile gewählt, zeigt die Verbindungskarte Farbe und REL des Pfads ebenfalls für diese Frequenz. Ein erneuter Klick auf dieselbe Zelle hebt die Frequenzauswahl auf und kehrt zur besten Frequenz zurück.",
    "24시간 예측·다이버시티 예측·메시 예측에서 주파수 행을 선택하면 회선 지도의 경로 색과 REL도 그 주파수로 표시합니다. 같은 셀을 다시 선택하면 주파수 선택이 해제되고 최적 주파수 표시로 돌아갑니다."
  ],
  "バージョン1.0": [
    "Version 1.0",
    "Version 1.0",
    "Versión 1.0",
    "Versione 1.0",
    "Versão 1.0",
    "Version 1.0",
    "버전 1.0"
  ],
  "一通りの機能が揃ったため、バージョン1.0としました。以後は不具合の修正と外部データへの追従を中心に維持管理します。": [
    "With the planned features complete, CHUCK is now version 1.0. From here on it is maintained mainly through bug fixes and keeping up with external data sources.",
    "Les fonctions prévues étant terminées, CHUCK passe en version 1.0. Il sera désormais maintenu principalement par des corrections de bogues et l’adaptation aux sources de données externes.",
    "Con las funciones previstas completas, CHUCK pasa a la versión 1.0. A partir de ahora se mantendrá principalmente con correcciones de errores y la adaptación a las fuentes de datos externas.",
    "Completate le funzioni previste, CHUCK passa alla versione 1.0. D’ora in poi sarà mantenuto principalmente con correzioni di bug e l’adeguamento alle fonti di dati esterne.",
    "Com as funções previstas concluídas, o CHUCK passa à versão 1.0. A partir de agora será mantido principalmente com correções de erros e a adaptação às fontes de dados externas.",
    "Da die geplanten Funktionen fertig sind, ist CHUCK jetzt Version 1.0. Künftig wird es vor allem durch Fehlerbehebungen und die Anpassung an externe Datenquellen gepflegt.",
    "계획된 기능이 갖추어져 CHUCK을 버전 1.0으로 했습니다. 앞으로는 주로 버그 수정과 외부 데이터 대응을 중심으로 유지 관리합니다."
  ],
  "ヒートマップの周波数行の選択": [
    "Selecting a frequency row in the heatmaps",
    "Sélection d’une ligne de fréquence dans les cartes thermiques",
    "Selección de una fila de frecuencia en los mapas de calor",
    "Selezione di una riga di frequenza nelle mappe di calore",
    "Seleção de uma linha de frequência nos mapas de calor",
    "Auswahl einer Frequenzzeile in den Heatmaps",
    "히트맵의 주파수 행 선택"
  ],
  "24時間予測とダイバーシティー予測のヒートマップでセルを選ぶと、メッシュ予測の「経路の詳細 · 周波数 × UTC」と同じように、その周波数の行と時刻の列が選択されます。時刻別の詳細の表でも、選んだ周波数の行を色で示します。": [
    "Choosing a cell in the 24-hour forecast and diversity forecast heatmaps now selects that frequency’s row and the hour’s column, as in “Link detail · frequency × UTC” of the mesh forecast. The hourly detail table also highlights the chosen frequency’s row.",
    "Choisir une cellule dans les cartes thermiques de la prévision sur 24 h et de la prévision de diversité sélectionne désormais la ligne de cette fréquence et la colonne de l’heure, comme dans « Détail de la liaison · fréquence × UTC » de la prévision maillée. Le tableau des détails horaires met aussi en évidence la ligne de la fréquence choisie.",
    "Al elegir una celda en los mapas de calor de la predicción de 24 horas y de la predicción de diversidad, ahora se seleccionan la fila de esa frecuencia y la columna de la hora, igual que en «Detalle del enlace · frecuencia × UTC» de la predicción de malla. La tabla de detalles por hora también resalta la fila de la frecuencia elegida.",
    "Scegliendo una cella nelle mappe di calore della previsione di 24 ore e della previsione di diversità ora si selezionano la riga di quella frequenza e la colonna dell’ora, come in «Dettaglio collegamento · frequenza × UTC» della previsione mesh. Anche la tabella dei dettagli orari evidenzia la riga della frequenza scelta.",
    "Ao escolher uma célula nos mapas de calor da previsão de 24 horas e da previsão de diversidade, agora são selecionadas a linha dessa frequência e a coluna da hora, como em «Detalhe do enlace · frequência × UTC» da previsão de malha. A tabela de detalhes por hora também destaca a linha da frequência escolhida.",
    "Ein Klick auf eine Zelle in den Heatmaps der 24-Stunden-Prognose und der Diversity-Prognose wählt jetzt die Zeile dieser Frequenz und die Spalte der Stunde aus, wie in „Verbindungsdetails · Frequenz × UTC“ der Mesh-Prognose. Auch die Tabelle der Stundendetails hebt die Zeile der gewählten Frequenz hervor.",
    "24시간 예측과 다이버시티 예측의 히트맵에서 셀을 선택하면, 메시 예측의 「경로 상세 · 주파수 × UTC」와 같이 그 주파수의 행과 시각의 열이 선택됩니다. 시각별 상세 표에서도 선택한 주파수의 행을 색으로 표시합니다."
  ],
  "ヒートマップの表示時刻（UTC）": [
    "Heatmap display time (UTC)",
    "Heure affichée sur la carte thermique (UTC)",
    "Hora mostrada en el mapa de calor (UTC)",
    "Ora mostrata sulla mappa di calore (UTC)",
    "Hora exibida no mapa de calor (UTC)",
    "Anzeigezeit der Heatmap (UTC)",
    "히트맵 표시 시각 (UTC)"
  ],
  "ヒートマップの時刻スライダー": [
    "Time slider on the heatmaps",
    "Curseur horaire sur les cartes thermiques",
    "Control deslizante de hora en los mapas de calor",
    "Cursore orario sulle mappe di calore",
    "Controle deslizante de hora nos mapas de calor",
    "Zeitschieberegler an den Heatmaps",
    "히트맵의 시각 슬라이더"
  ],
  "24時間予測の「周波数 × 時刻の信頼度」とダイバーシティー予測の「周波数 × UTC」にも、UTCのスライダーと再生・停止ボタンを付けました。選んだ時刻の列が枠で示され、時刻別の詳細と回線マップも同じ時刻に切り替わります。": [
    "The 24-hour prediction “Reliability by frequency and time” and the diversity prediction “Frequency × UTC” now also have a UTC slider and a play/stop button. The chosen hour’s column is outlined, and the hourly details and the circuit map switch to the same hour.",
    "La « Fiabilité par fréquence et heure » de la prévision sur 24 heures et la « fréquence × UTC » de la prévision de diversité disposent aussi d’un curseur UTC et d’un bouton lecture/arrêt. La colonne de l’heure choisie est encadrée, et les détails horaires et la carte du circuit passent à la même heure.",
    "La «Fiabilidad por frecuencia y hora» de la predicción de 24 horas y la «frecuencia × UTC» de la predicción de diversidad también tienen un control deslizante UTC y un botón de reproducir/detener. La columna de la hora elegida se enmarca, y los detalles por hora y el mapa del circuito cambian a la misma hora.",
    "Anche l’«Affidabilità per frequenza e ora» della previsione 24 ore e la «frequenza × UTC» della previsione di diversità hanno ora un cursore UTC e un pulsante riproduci/ferma. La colonna dell’ora scelta è evidenziata con un bordo e i dettagli orari e la mappa del collegamento passano alla stessa ora.",
    "A «Confiabilidade por frequência e hora» da previsão de 24 horas e a «frequência × UTC» da previsão de diversidade também têm um controle deslizante UTC e um botão reproduzir/parar. A coluna da hora escolhida é destacada com uma moldura, e os detalhes por hora e o mapa do circuito mudam para a mesma hora.",
    "Auch „Zuverlässigkeit nach Frequenz und Zeit“ der 24-Stunden-Vorhersage und „Frequenz × UTC“ der Diversity-Vorhersage haben jetzt einen UTC-Schieberegler und eine Start/Stopp-Taste. Die Spalte der gewählten Stunde wird umrandet, und die Stundendetails und die Verbindungskarte wechseln auf dieselbe Stunde.",
    "24시간 예측의 「주파수·시각별 신뢰도」와 다이버시티 예측의 「주파수 × UTC」에도 UTC 슬라이더와 재생·정지 버튼을 달았습니다. 선택한 시각의 열에 테두리가 표시되고, 시각별 상세와 회선 지도도 같은 시각으로 바뀝니다."
  ],
  "画面の用語の統一": [
    "Consistent screen terms",
    "Termes d’écran harmonisés",
    "Términos de pantalla unificados",
    "Termini dello schermo uniformati",
    "Termos de tela unificados",
    "Einheitliche Begriffe auf dem Bildschirm",
    "화면 용어 통일"
  ],
  "「予察」と「〜結果」の表記を「予測」に揃えました。タブ名は「ダイバーシティー予測」「メッシュ予測」「12か月予測」「予測条件・宇宙天気」になります。": [
    "Screen labels now consistently say “forecast”. The tabs are now Diversity forecast, Mesh forecast, 12-month forecast and Forecast & space weather.",
    "Les libellés de l’écran utilisent désormais « prévision » de façon cohérente. Les onglets s’appellent Prévision de diversité, Prévision maillée, Prévision sur 12 mois et Conditions et météo spatiale.",
    "Las etiquetas de la pantalla usan ahora «predicción» de forma coherente. Las pestañas son Predicción de diversidad, Predicción de malla, Predicción de 12 meses y Condiciones y clima espacial.",
    "Le etichette dello schermo usano ora «previsione» in modo coerente. Le schede sono Previsione di diversità, Previsione mesh, Previsione a 12 mesi e Condizioni e meteo spaziale.",
    "Os rótulos da tela usam agora “previsão” de forma consistente. As abas são Previsão de diversidade, Previsão de malha, Previsão de 12 meses e Condições e clima espacial.",
    "Die Bildschirmbeschriftungen verwenden jetzt einheitlich „Prognose“. Die Reiter heißen Diversity-Prognose, Mesh-Prognose, 12-Monats-Prognose und Bedingungen und Weltraumwetter.",
    "화면 표기를 '예측'으로 통일했습니다. 탭 이름은 다이버시티 예측, 메시 예측, 12개월 예측, 예측 조건·우주 날씨입니다."
  ],
  "全タブの報告書の印刷": [
    "Report printing on every tab",
    "Impression du rapport dans tous les onglets",
    "Impresión del informe en todas las pestañas",
    "Stampa del rapporto in tutte le schede",
    "Impressão do relatório em todas as abas",
    "Berichtsdruck auf allen Reitern",
    "모든 탭의 보고서 인쇄"
  ],
  "カバー範囲、Propagation Chart、ダイバーシティー、メッシュ、12か月予測、必要な送信電力、拠点の候補の結果も「報告書を印刷」で、条件と表示中の表・図を1枚の印刷用ページにまとめられます。": [
    "Coverage, Propagation Chart, diversity, mesh, 12-month forecast, required power and site candidate results can also be put on one printable page with “Print report”, with the conditions and the shown tables and charts.",
    "Les résultats de couverture, Propagation Chart, diversité, maillage, prévision sur 12 mois, puissance requise et sites candidats peuvent aussi être réunis sur une page imprimable avec « Imprimer le rapport », avec les conditions et les tableaux et graphiques affichés.",
    "Los resultados de cobertura, Propagation Chart, diversidad, malla, predicción de 12 meses, potencia necesaria y sitios candidatos también pueden reunirse en una página imprimible con «Imprimir informe», con las condiciones y las tablas y gráficos mostrados.",
    "Anche i risultati di copertura, Propagation Chart, diversità, maglia, previsione a 12 mesi, potenza necessaria e siti candidati possono essere raccolti in una pagina stampabile con «Stampa rapporto», con le condizioni e le tabelle e i grafici mostrati.",
    "Os resultados de cobertura, Propagation Chart, diversidade, malha, previsão de 12 meses, potência necessária e locais candidatos também podem ser reunidos numa página imprimível com “Imprimir relatório”, com as condições e as tabelas e gráficos mostrados.",
    "Auch Ergebnisse zu Abdeckung, Propagation Chart, Diversity, Mesh, 12-Monats-Prognose, erforderlicher Sendeleistung und Standortkandidaten lassen sich mit „Bericht drucken“ auf einer druckbaren Seite zusammenfassen, mit den Bedingungen und den angezeigten Tabellen und Diagrammen.",
    "커버리지, Propagation Chart, 다이버시티, 메시, 12개월 예측, 필요 송신 전력, 거점 후보 결과도 '보고서 인쇄'로 조건과 표시 중인 표·그림을 한 장의 인쇄용 페이지로 정리할 수 있습니다."
  ],
  "項目": [
    "Field",
    "Champ",
    "Campo",
    "Campo",
    "Campo",
    "Feld",
    "항목"
  ],
  "HF Propagation JP — HF電波伝搬予測": [
    "HF Propagation — HF radio forecast",
    "HF Propagation — Prévision radio HF",
    "HF Propagation — Predicción de radio HF",
    "HF Propagation — Previsione radio HF",
    "HF Propagation — Previsão de rádio HF",
    "HF Propagation — HF-Funkprognose",
    "HF Propagation — HF 전파 예측"
  ],
  "HF電波伝搬予測ワークスペース": [
    "HF propagation workspace",
    "Espace de prévision HF",
    "Área de predicción HF",
    "Area di previsione HF",
    "Área de previsão HF",
    "Arbeitsbereich für HF-Prognosen",
    "HF 전파 예측 작업 공간"
  ],
  "エンジン確認中": [
    "Checking engine",
    "Vérification du moteur",
    "Comprobando el motor",
    "Verifica del motore",
    "Verificando o motor",
    "Engine wird geprüft",
    "엔진 확인 중"
  ],
  "電波の届き方を見通す": [
    "Plan your HF radio links",
    "Planifier les liaisons HF",
    "Planifique sus enlaces HF",
    "Pianifica i collegamenti HF",
    "Planeje seus enlaces HF",
    "HF-Funkverbindungen planen",
    "HF 통신 경로 예측"
  ],
  "設定を保存": [
    "Save settings",
    "Enregistrer les réglages",
    "Guardar ajustes",
    "Salva impostazioni",
    "Salvar configurações",
    "Einstellungen speichern",
    "설정 저장"
  ],
  "回線マップ": [
    "Link map",
    "Carte des liaisons",
    "Mapa de enlaces",
    "Mappa dei collegamenti",
    "Mapa de enlaces",
    "Verbindungskarte",
    "통신 경로 지도"
  ],
  "D-RAP吸収": [
    "D-RAP absorption",
    "Absorption D-RAP",
    "Absorción D-RAP",
    "Assorbimento D-RAP",
    "Absorção D-RAP",
    "D-RAP-Absorption",
    "D-RAP 흡수"
  ],
  "観測局": [
    "Observation stations",
    "Stations d’observation",
    "Estaciones de observación",
    "Stazioni di osservazione",
    "Estações de observação",
    "Messstationen",
    "관측소"
  ],
  "全体表示": [
    "World view",
    "Vue mondiale",
    "Vista mundial",
    "Vista globale",
    "Visão mundial",
    "Weltansicht",
    "전체 보기"
  ],
  "拡大": [
    "Zoom in",
    "Zoom avant",
    "Acercar",
    "Ingrandisci",
    "Aproximar",
    "Vergrößern",
    "확대"
  ],
  "縮小": [
    "Zoom out",
    "Zoom arrière",
    "Alejar",
    "Riduci",
    "Afastar",
    "Verkleinern",
    "축소"
  ],
  "地点は右側のプリセットから選択": [
    "Select locations from presets on the right",
    "Choisir les lieux à droite",
    "Seleccione ubicaciones a la derecha",
    "Seleziona le località a destra",
    "Selecione locais à direita",
    "Standorte rechts auswählen",
    "오른쪽 프리셋에서 지점 선택"
  ],
  "ドラッグで移動 · ホイール／ピンチ／＋－で拡縮 · Natural Earth": [
    "Drag to pan · Wheel, pinch or +/− to zoom · Natural Earth",
    "Glisser pour déplacer · Molette, pincement ou +/− pour zoomer · Natural Earth",
    "Arrastre para mover · Rueda, pellizco o +/− para ampliar · Natural Earth",
    "Trascina per spostare · Rotella, pizzico o +/− per lo zoom · Natural Earth",
    "Arraste para mover · Roda, pinça ou +/− para ampliar · Natural Earth",
    "Ziehen zum Verschieben · Mausrad, Zwei-Finger-Geste oder +/− zum Zoomen · Natural Earth",
    "드래그로 이동 · 휠/핀치/+−로 확대·축소 · Natural Earth"
  ],
  "D-RAPと観測局は「予測条件・宇宙天気」タブで取得できます。": [
    "Load D-RAP and stations in Forecast & space weather.",
    "Charger D-RAP et les stations dans Conditions et météo spatiale.",
    "Cargue D-RAP y estaciones en Condiciones y clima espacial.",
    "Carica D-RAP e stazioni in Condizioni e meteo spaziale.",
    "Carregue D-RAP e estações em Condições e clima espacial.",
    "D-RAP und Messstationen unter Bedingungen und Weltraumwetter laden.",
    "예측 조건·우주 날씨 탭에서 D-RAP 및 관측소를 불러옵니다."
  ],
  "D-RAP HAF: 黄＝低、赤＝高（0〜30 MHz以上）、透明＝0、灰＝欠測。観測局: 紫＝取得済、灰＝古い。": [
    "D-RAP HAF: yellow = low, red = high (0 to 30+ MHz), clear = 0, gray = missing. Stations: purple = fetched, gray = stale.",
    "D-RAP HAF : jaune = bas, rouge = élevé (0 à 30 MHz et plus), transparent = 0, gris = manquant. Stations : violet = chargé, gris = ancien.",
    "D-RAP HAF: amarillo = bajo, rojo = alto (0 a 30 MHz o más), transparente = 0, gris = sin datos. Estaciones: morado = obtenido, gris = antiguo.",
    "D-RAP HAF: giallo = basso, rosso = alto (da 0 a oltre 30 MHz), trasparente = 0, grigio = dato mancante. Stazioni: viola = scaricato, grigio = obsoleto.",
    "D-RAP HAF: amarelo = baixo, vermelho = alto (0 a 30 MHz ou mais), transparente = 0, cinza = sem dados. Estações: roxo = obtido, cinza = antigo.",
    "D-RAP HAF: Gelb = niedrig, Rot = hoch (0 bis über 30 MHz), transparent = 0, Grau = fehlend. Messstationen: Lila = abgerufen, Grau = veraltet.",
    "D-RAP HAF: 노랑=낮음, 빨강=높음(0~30 MHz 이상), 투명=0, 회색=결측. 관측소: 보라=가져옴, 회색=오래됨."
  ],
  "D-RAP HAF: 黄＝低、赤＝高（0〜30 MHz以上）、透明＝0、灰＝欠測。期限切れのため薄く表示。観測局: 紫＝取得済、灰＝古い。": [
    "D-RAP HAF: yellow = low, red = high (0 to 30+ MHz), clear = 0, gray = missing. Faded because it has expired. Stations: purple = fetched, gray = stale.",
    "D-RAP HAF : jaune = bas, rouge = élevé (0 à 30 MHz et plus), transparent = 0, gris = manquant. Atténué car expiré. Stations : violet = chargé, gris = ancien.",
    "D-RAP HAF: amarillo = bajo, rojo = alto (0 a 30 MHz o más), transparente = 0, gris = sin datos. Atenuado por estar vencido. Estaciones: morado = obtenido, gris = antiguo.",
    "D-RAP HAF: giallo = basso, rosso = alto (da 0 a oltre 30 MHz), trasparente = 0, grigio = dato mancante. Attenuato perché scaduto. Stazioni: viola = scaricato, grigio = obsoleto.",
    "D-RAP HAF: amarelo = baixo, vermelho = alto (0 a 30 MHz ou mais), transparente = 0, cinza = sem dados. Esmaecido por estar expirado. Estações: roxo = obtido, cinza = antigo.",
    "D-RAP HAF: Gelb = niedrig, Rot = hoch (0 bis über 30 MHz), transparent = 0, Grau = fehlend. Blass dargestellt, da abgelaufen. Messstationen: Lila = abgerufen, Grau = veraltet.",
    "D-RAP HAF: 노랑=낮음, 빨강=높음(0~30 MHz 이상), 투명=0, 회색=결측. 만료되어 흐리게 표시. 관측소: 보라=가져옴, 회색=오래됨."
  ],
  "D-RAP未取得。観測局は紫＝取得済、灰＝古い。": [
    "D-RAP not fetched. Stations: purple = fetched, gray = stale.",
    "D-RAP non chargé. Stations : violet = chargé, gris = ancien.",
    "D-RAP sin obtener. Estaciones: morado = obtenido, gris = antiguo.",
    "D-RAP non scaricato. Stazioni: viola = scaricato, grigio = obsoleto.",
    "D-RAP não obtido. Estações: roxo = obtido, cinza = antigo.",
    "D-RAP nicht abgerufen. Messstationen: Lila = abgerufen, Grau = veraltet.",
    "D-RAP 미취득. 관측소: 보라=가져옴, 회색=오래됨."
  ],
  "D-RAPは古い情報のため薄く表示。国内外の灰色観測局も古い情報です。取得ボタンで更新してください。": [
    "D-RAP is stale and shown faded. Gray stations in Japan and abroad are also stale. Press a fetch button to refresh.",
    "D-RAP est ancien et affiché atténué. Les stations grises au Japon et à l’étranger sont aussi anciennes. Utilisez un bouton de chargement pour actualiser.",
    "D-RAP es antiguo y se muestra atenuado. Las estaciones grises de Japón y del extranjero también son antiguas. Pulse un botón de obtención para actualizar.",
    "D-RAP è obsoleto e mostrato attenuato. Anche le stazioni grigie in Giappone e all’estero sono obsolete. Premi un pulsante di scaricamento per aggiornare.",
    "D-RAP está antigo e aparece esmaecido. As estações cinza no Japão e no exterior também estão antigas. Pressione um botão de obtenção para atualizar.",
    "D-RAP ist veraltet und blass dargestellt. Graue Messstationen in Japan und im Ausland sind ebenfalls veraltet. Zum Aktualisieren eine Abruf-Schaltfläche drücken.",
    "D-RAP이 오래되어 흐리게 표시됩니다. 국내외 회색 관측소도 오래된 정보입니다. 가져오기 버튼으로 갱신하세요."
  ],
  "地点と条件を確認して、計算を開始してください。": [
    "Check locations and conditions, then calculate.",
    "Vérifier les lieux et conditions, puis calculer.",
    "Compruebe ubicaciones y condiciones antes de calcular.",
    "Verifica località e condizioni, poi calcola.",
    "Verifique locais e condições e calcule.",
    "Standorte und Bedingungen prüfen und berechnen.",
    "지점과 조건을 확인한 후 계산하세요."
  ],
  "24時間予測": [
    "24-hour forecast",
    "Prévision sur 24 h",
    "Predicción de 24 horas",
    "Previsione di 24 ore",
    "Previsão de 24 horas",
    "24-Stunden-Prognose",
    "24시간 예측"
  ],
  "カバー範囲": [
    "Coverage",
    "Couverture",
    "Cobertura",
    "Copertura",
    "Cobertura",
    "Abdeckung",
    "커버리지"
  ],
  "ダイバーシティー予測": [
    "Diversity forecast",
    "Prévision de diversité",
    "Predicción de diversidad",
    "Previsione di diversità",
    "Previsão de diversidade",
    "Diversity-Prognose",
    "다이버시티 예측"
  ],
  "予測条件・宇宙天気": [
    "Forecast & space weather",
    "Conditions et météo spatiale",
    "Condiciones y clima espacial",
    "Condizioni e meteo spaziale",
    "Condições e clima espacial",
    "Bedingungen und Weltraumwetter",
    "예측 조건·우주 날씨"
  ],
  "地点プリセット": [
    "Location preset",
    "Préréglage du lieu",
    "Preajuste de ubicación",
    "Preimpostazione località",
    "Predefinição de local",
    "Standortvorlage",
    "지점 프리셋"
  ],
  "アンテナプリセット": [
    "Antenna preset",
    "Préréglage d’antenne",
    "Preajuste de antena",
    "Preimpostazione antenna",
    "Predefinição de antena",
    "Antennenvorlage",
    "안테나 프리셋"
  ],
  "移動局・外部入力": [
    "Mobile stations & input",
    "Stations mobiles et entrée",
    "Estaciones móviles y entrada",
    "Stazioni mobili e ingressi",
    "Estações móveis e entrada",
    "Mobile Stationen und Eingang",
    "이동국·외부 입력"
  ],
  "計算履歴": [
    "Calculation history",
    "Historique des calculs",
    "Historial de cálculos",
    "Cronologia dei calcoli",
    "Histórico de cálculos",
    "Berechnungsverlauf",
    "계산 이력"
  ],
  "回線距離": [
    "Link distance",
    "Distance de liaison",
    "Distancia del enlace",
    "Distanza del collegamento",
    "Distância do enlace",
    "Verbindungsentfernung",
    "경로 거리"
  ],
  "送信地点からの方位": [
    "Bearing from TX",
    "Azimut depuis TX",
    "Rumbo desde TX",
    "Azimut da TX",
    "Azimute a partir do TX",
    "Peilung vom TX",
    "TX 기준 방위각"
  ],
  "選択時刻の推奨周波数": [
    "Recommended frequency at selected hour",
    "Fréquence recommandée à l’heure choisie",
    "Frecuencia recomendada a la hora seleccionada",
    "Frequenza consigliata all’ora selezionata",
    "Frequência recomendada na hora selecionada",
    "Empfohlene Frequenz zur gewählten Stunde",
    "선택 시각의 권장 주파수"
  ],
  "周波数 × 時刻の信頼度": [
    "Reliability by frequency and time",
    "Fiabilité par fréquence et heure",
    "Fiabilidad por frecuencia y hora",
    "Affidabilità per frequenza e ora",
    "Confiabilidade por frequência e hora",
    "Zuverlässigkeit nach Frequenz und Zeit",
    "주파수·시각별 신뢰도"
  ],
  "計算後に24時間の結果を表示します": [
    "Calculate to display 24-hour results",
    "Calculer pour afficher les résultats sur 24 h",
    "Calcule para mostrar los resultados de 24 horas",
    "Calcola per visualizzare i risultati di 24 ore",
    "Calcule para exibir os resultados de 24 horas",
    "Berechnen, um 24-Stunden-Ergebnisse anzuzeigen",
    "계산 후 24시간 결과를 표시합니다"
  ],
  "要求信頼度以上のセルには印を表示": [
    "Marks indicate the target reliability is met",
    "Marque si la fiabilité cible est atteinte",
    "Las marcas indican que se alcanza la fiabilidad objetivo",
    "Il segno indica che l’affidabilità obiettivo è raggiunta",
    "Marcas indicam que a confiabilidade alvo foi atingida",
    "Markierung bei erreichter Zielzuverlässigkeit",
    "목표 신뢰도를 충족한 셀에 표시"
  ],
  "時刻別の詳細": [
    "Hourly details",
    "Détails horaires",
    "Detalles por hora",
    "Dettagli orari",
    "Detalhes por hora",
    "Stündliche Details",
    "시간별 상세"
  ],
  "CSV出力": [
    "Export CSV",
    "Exporter CSV",
    "Exportar CSV",
    "Esporta CSV",
    "Exportar CSV",
    "CSV exportieren",
    "CSV 내보내기"
  ],
  "JSON出力": [
    "Export JSON",
    "Exporter JSON",
    "Exportar JSON",
    "Esporta JSON",
    "Exportar JSON",
    "JSON exportieren",
    "JSON 내보내기"
  ],
  "VOACAP生出力": [
    "Raw VOACAP output",
    "Sortie brute VOACAP",
    "Salida original VOACAP",
    "Output grezzo VOACAP",
    "Saída bruta VOACAP",
    "VOACAP-Rohausgabe",
    "VOACAP 원시 출력"
  ],
  "入力カード": [
    "Input cards",
    "Cartes d’entrée",
    "Tarjetas de entrada",
    "Schede di ingresso",
    "Cartões de entrada",
    "Eingabekarten",
    "입력 카드"
  ],
  "指定時刻の地域カバー範囲": [
    "Regional coverage at a selected hour",
    "Couverture régionale à l’heure choisie",
    "Cobertura regional a una hora seleccionada",
    "Copertura regionale all’ora selezionata",
    "Cobertura regional na hora selecionada",
    "Regionale Abdeckung zur gewählten Stunde",
    "지정 시각의 지역 커버리지"
  ],
  "周波数 MHz": [
    "Frequency MHz",
    "Fréquence MHz",
    "Frecuencia MHz",
    "Frequenza MHz",
    "Frequência MHz",
    "Frequenz MHz",
    "주파수 MHz"
  ],
  "UTC時刻": [
    "UTC hour",
    "Heure UTC",
    "Hora UTC",
    "Ora UTC",
    "Hora UTC",
    "UTC-Stunde",
    "UTC 시각"
  ],
  "カバー範囲を計算": [
    "Calculate coverage",
    "Calculer la couverture",
    "Calcular cobertura",
    "Calcola copertura",
    "Calcular cobertura",
    "Abdeckung berechnen",
    "커버리지 계산"
  ],
  "移動局 · 位置ゲートウェイ": [
    "Mobile stations · Position gateway",
    "Stations mobiles · Passerelle de position",
    "Estaciones móviles · Pasarela de posición",
    "Stazioni mobili · Gateway di posizione",
    "Estações móveis · Gateway de posição",
    "Mobile Stationen · Positionsgateway",
    "이동국·위치 게이트웨이"
  ],
  "最新位置を表示": [
    "Refresh positions",
    "Actualiser les positions",
    "Actualizar posiciones",
    "Aggiorna posizioni",
    "Atualizar posições",
    "Positionen aktualisieren",
    "최신 위치 표시"
  ],
  "外部入力は独立したゲートウェイ（既定18083番）で受信します。本体はゲートウェイから正規化済み位置を取得します。局設定の変更もゲートウェイへ保存します。": [
    "External reports arrive at the separate gateway (default port 18083). The app reads normalized positions and saves station settings there.",
    "Les rapports externes arrivent sur la passerelle séparée (port 18083). L’application y lit les positions normalisées et enregistre les réglages.",
    "Los informes externos llegan a la pasarela independiente (puerto 18083). La aplicación lee posiciones normalizadas y guarda allí los ajustes.",
    "I dati esterni arrivano al gateway separato (porta 18083). L’app legge posizioni normalizzate e vi salva le impostazioni delle stazioni.",
    "Os dados externos chegam ao gateway separado (porta 18083). O aplicativo lê posições normalizadas e salva nele as configurações.",
    "Externe Meldungen empfängt das separate Gateway (Port 18083). Die App liest normalisierte Positionen und speichert dort Stationseinstellungen.",
    "외부 입력은 별도 게이트웨이(기본 포트 18083)에서 수신합니다. 본체는 정규화된 위치를 읽고 국 설정도 게이트웨이에 저장합니다."
  ],
  "有効な受信局は地点プリセットに自動登録します。右側の地点選択から使用でき、計算時に最新の有効位置を採用します。": [
    "Valid received stations are added to location presets. Select them on the right; each calculation resolves the latest valid position.",
    "Les stations reçues valides sont ajoutées aux préréglages. Les choisir à droite ; chaque calcul utilise la dernière position valide.",
    "Las estaciones recibidas válidas se añaden a los preajustes. Selecciónelas a la derecha; cada cálculo usa la última posición válida.",
    "Le stazioni ricevute valide sono aggiunte alle preimpostazioni. Selezionale a destra; ogni calcolo usa l’ultima posizione valida.",
    "Estações recebidas válidas são adicionadas às predefinições. Selecione-as à direita; cada cálculo usa a última posição válida.",
    "Gültige empfangene Stationen werden als Standortvorlagen registriert. Rechts auswählen; jede Berechnung nutzt die neueste gültige Position.",
    "유효한 수신국을 지점 프리셋에 자동 등록합니다. 오른쪽에서 선택하면 계산 시 유효한 최신 위치를 사용합니다."
  ],
  "5秒ごとに一覧を更新": [
    "Refresh every 5 seconds",
    "Actualiser toutes les 5 secondes",
    "Actualizar cada 5 segundos",
    "Aggiorna ogni 5 secondi",
    "Atualizar a cada 5 segundos",
    "Alle 5 Sekunden aktualisieren",
    "5초마다 새로 고침"
  ],
  "地図に移動局を表示": [
    "Show mobile stations on map",
    "Afficher les stations mobiles sur la carte",
    "Mostrar estaciones móviles en el mapa",
    "Mostra stazioni mobili sulla mappa",
    "Mostrar estações móveis no mapa",
    "Mobile Stationen auf Karte anzeigen",
    "지도에 이동국 표시"
  ],
  "読み込み中…": [
    "Loading…",
    "Chargement…",
    "Cargando…",
    "Caricamento…",
    "Carregando…",
    "Wird geladen…",
    "불러오는 중…"
  ],
  "局ごとの受信プロトコル設定": [
    "Input protocol per station",
    "Protocole d’entrée par station",
    "Protocolo de entrada por estación",
    "Protocollo di ingresso per stazione",
    "Protocolo de entrada por estação",
    "Eingangsprotokoll je Station",
    "국별 수신 프로토콜"
  ],
  "伝送はHTTP(S)。局単位でJSON・GeoJSON・NMEA 0183（RMC）を選択できます。形式・種別の変更や無効化では旧位置を破棄し、次の有効報告を待ちます。NMEA局は送信前に登録してください。": [
    "HTTP(S) transport; choose JSON, GeoJSON or NMEA 0183 RMC per station. Changing format/type or disabling clears the old position. Register NMEA stations before sending.",
    "Transport HTTP(S) : JSON, GeoJSON ou NMEA 0183 RMC par station. Changer le format/type ou désactiver efface l’ancienne position. Enregistrer les stations NMEA avant l’envoi.",
    "Transporte HTTP(S): JSON, GeoJSON o NMEA 0183 RMC por estación. Cambiar formato/tipo o desactivar borra la posición anterior. Registre las estaciones NMEA antes de enviar.",
    "Trasporto HTTP(S): JSON, GeoJSON o NMEA 0183 RMC per stazione. Cambiare formato/tipo o disattivare elimina la vecchia posizione. Registra le stazioni NMEA prima dell’invio.",
    "Transporte HTTP(S): JSON, GeoJSON ou NMEA 0183 RMC por estação. Alterar formato/tipo ou desativar elimina a posição anterior. Registre estações NMEA antes de enviar.",
    "HTTP(S): JSON, GeoJSON oder NMEA 0183 RMC je Station. Format-/Typwechsel oder Deaktivieren löscht die alte Position. NMEA-Stationen vor dem Senden registrieren.",
    "HTTP(S)로 전송하며 국별로 JSON·GeoJSON·NMEA 0183 RMC를 선택합니다. 형식·종류 변경 또는 비활성화 시 이전 위치를 삭제합니다. NMEA 국은 전송 전에 등록하세요."
  ],
  "送信元": [
    "Source",
    "Source",
    "Origen",
    "Origine",
    "Origem",
    "Quelle",
    "송신원"
  ],
  "局ID": [
    "Station ID",
    "Identifiant de station",
    "ID de estación",
    "ID stazione",
    "ID da estação",
    "Stations-ID",
    "국 ID"
  ],
  "局名": [
    "Station name",
    "Nom de station",
    "Nombre de estación",
    "Nome stazione",
    "Nome da estação",
    "Stationsname",
    "국명"
  ],
  "種別": [
    "Type",
    "Type",
    "Tipo",
    "Tipo",
    "Tipo",
    "Typ",
    "종류"
  ],
  "船舶": [
    "Vessel",
    "Navire",
    "Embarcación",
    "Nave",
    "Embarcação",
    "Schiff",
    "선박"
  ],
  "航空機": [
    "Aircraft",
    "Aéronef",
    "Aeronave",
    "Aeromobile",
    "Aeronave",
    "Luftfahrzeug",
    "항공기"
  ],
  "車両": [
    "Vehicle",
    "Véhicule",
    "Vehículo",
    "Veicolo",
    "Veículo",
    "Fahrzeug",
    "차량"
  ],
  "形式": [
    "Format",
    "Format",
    "Formato",
    "Formato",
    "Formato",
    "Format",
    "형식"
  ],
  "局を登録・更新": [
    "Register / update station",
    "Enregistrer / modifier la station",
    "Registrar / actualizar estación",
    "Registra / aggiorna stazione",
    "Registrar / atualizar estação",
    "Station registrieren / aktualisieren",
    "국 등록·수정"
  ],
  "位置は計算開始時の固定値です。24時間先までの移動、航空機高度による伝搬補正、速度・針路からの推測位置は計算しません。受信トークンを画面へ入力する必要はありません。": [
    "Positions are fixed at calculation start. No future movement, altitude correction or dead reckoning is modeled. No ingest token is entered in this UI.",
    "Positions figées au début du calcul. Aucun déplacement futur, correction d’altitude ni extrapolation. Aucun jeton de réception à saisir ici.",
    "Las posiciones se fijan al iniciar el cálculo. No se modelan movimiento futuro, corrección de altitud ni navegación estimada. No introduzca el token de recepción aquí.",
    "Posizioni fissate all’avvio del calcolo. Nessun movimento futuro, correzione di quota o stima della posizione. Nessun token di ricezione nell’interfaccia.",
    "Posições fixadas no início do cálculo. Sem movimento futuro, correção de altitude ou navegação estimada. Nenhum token de recepção na interface.",
    "Positionen werden beim Berechnungsstart fixiert. Keine Bewegungsprognose, Höhenkorrektur oder Koppelnavigation. Kein Empfangstoken in dieser Oberfläche.",
    "계산 시작 시점의 위치를 고정합니다. 향후 이동·고도 보정·추측 항법은 계산하지 않습니다. 수신 토큰을 화면에 입력할 필요는 없습니다."
  ],
  "複数RX · サイトダイバーシティー予測": [
    "Multiple RX · Site diversity forecast",
    "RX multiples · Prévision de diversité de sites",
    "Múltiples RX · Predicción de diversidad de sitios",
    "RX multipli · Previsione di diversità di sito",
    "Múltiplos RX · Previsão de diversidade de locais",
    "Mehrere RX · Standortdiversitätsprognose",
    "다중 RX·사이트 다이버시티 예측"
  ],
  "右側のRXが2局以上の場合、自動的にダイバーシティー予測を計算します。": [
    "Two or more RX stations automatically enable diversity forecasting.",
    "Deux RX ou plus activent automatiquement la prévision de diversité.",
    "Dos o más RX activan automáticamente la predicción de diversidad.",
    "Due o più RX attivano automaticamente la previsione di diversità.",
    "Dois ou mais RX ativam automaticamente a previsão de diversidade.",
    "Ab zwei RX wird automatisch eine Diversitätsprognose berechnet.",
    "RX가 2국 이상이면 자동으로 다이버시티 예측을 계산합니다."
  ],
  "RELは月間統計であり、瞬時の受信可否ではありません。合成SNR・波形合成や実受信機の切替制御は行いません。サイト間相関・共通障害・中継回線の可用性は未評価です。": [
    "REL is a monthly statistic, not instantaneous reception. No combined SNR, waveform combining or receiver control. Site correlation, common outages and backhaul availability are unmodeled.",
    "REL est une statistique mensuelle, pas une réception instantanée. Pas de combinaison de SNR/signaux ni commande des récepteurs. Corrélations, pannes communes et liaison de collecte non modélisées.",
    "REL es una estadística mensual, no recepción instantánea. Sin combinación de SNR/señales ni control de receptores. No se modelan correlación, fallos comunes ni disponibilidad del enlace de retorno.",
    "REL è una statistica mensile, non ricezione istantanea. Nessuna combinazione di SNR/segnali o controllo dei ricevitori. Correlazione, guasti comuni e disponibilità del collegamento di ritorno non sono modellati.",
    "REL é uma estatística mensal, não recepção instantânea. Sem combinação de SNR/sinais ou controle de receptores. Correlação, falhas comuns e disponibilidade do retorno não são modeladas.",
    "REL ist eine Monatsstatistik, kein momentaner Empfang. Keine SNR-/Signaladdition oder Empfängersteuerung. Korrelation, gemeinsame Ausfälle und Backhaul-Verfügbarkeit sind nicht modelliert.",
    "REL은 월간 통계이며 순간 수신 여부가 아닙니다. SNR·파형 합성 및 수신기 제어는 하지 않습니다. 사이트 상관·공통 장애·중계 회선 가용성은 모델링하지 않습니다."
  ],
  "計算後に、各時刻・周波数の最良サイトと比較結果を表示します。": [
    "Calculate to compare the best site at each time and frequency.",
    "Calculer pour comparer le meilleur site par heure et fréquence.",
    "Calcule para comparar el mejor sitio por hora y frecuencia.",
    "Calcola per confrontare il sito migliore per ora e frequenza.",
    "Calcule para comparar o melhor local por hora e frequência.",
    "Berechnen, um den besten Standort je Zeit und Frequenz zu vergleichen.",
    "계산 후 시각·주파수별 최적 사이트를 비교합니다."
  ],
  "周波数 × UTC · 最良サイトのREL（%）": [
    "Frequency × UTC · Best site REL (%)",
    "Fréquence × UTC · REL du meilleur site (%)",
    "Frecuencia × UTC · REL del mejor sitio (%)",
    "Frequenza × UTC · REL del sito migliore (%)",
    "Frequência × UTC · REL do melhor local (%)",
    "Frequenz × UTC · REL des besten Standorts (%)",
    "주파수 × UTC·최적 사이트 REL(%)"
  ],
  "ダイバーシティー合成後の信頼度ではありません。セルを選ぶと詳細を表示します。灰色は欠測。": [
    "Not post-combining reliability. Select a cell for details; gray means missing.",
    "Ce n’est pas la fiabilité après combinaison. Choisir une cellule ; gris = données manquantes.",
    "No es fiabilidad tras combinación. Seleccione una celda; gris = sin datos.",
    "Non è l’affidabilità dopo la combinazione. Seleziona una cella; grigio = dati mancanti.",
    "Não é confiabilidade após combinação. Selecione uma célula; cinza = dados ausentes.",
    "Keine Zuverlässigkeit nach Kombination. Zelle für Details wählen; Grau = fehlende Werte.",
    "합성 후 신뢰도가 아닙니다. 셀을 선택하면 상세를 표시하며 회색은 결측입니다."
  ],
  "時刻別 · サイト選択と理論範囲": [
    "Hourly site selection & theoretical bounds",
    "Choix horaire du site et bornes théoriques",
    "Selección por hora y límites teóricos",
    "Selezione oraria del sito e limiti teorici",
    "Seleção por hora e limites teóricos",
    "Stündliche Standortwahl und theoretische Grenzen",
    "시간별 사이트 선택·이론 범위"
  ],
  "サイト別詳細（計算時点の条件）": [
    "Site details (conditions at calculation time)",
    "Détails par site (conditions du calcul)",
    "Detalles por sitio (condiciones del cálculo)",
    "Dettagli per sito (condizioni del calcolo)",
    "Detalhes por local (condições do cálculo)",
    "Standortdetails (Bedingungen bei Berechnung)",
    "사이트별 상세(계산 시점 조건)"
  ],
  "共通の予測条件": [
    "Common forecast conditions",
    "Conditions de prévision communes",
    "Condiciones comunes de predicción",
    "Condizioni comuni di previsione",
    "Condições comuns de previsão",
    "Gemeinsame Prognosebedingungen",
    "공통 예측 조건"
  ],
  "予測条件": [
    "Forecast conditions",
    "Conditions de prévision",
    "Condiciones de predicción",
    "Condizioni di previsione",
    "Condições de previsão",
    "Prognosebedingungen",
    "예측 조건"
  ],
  "対象年": [
    "Year",
    "Année",
    "Año",
    "Anno",
    "Ano",
    "Jahr",
    "연도"
  ],
  "対象月": [
    "Month",
    "Mois",
    "Mes",
    "Mese",
    "Mês",
    "Monat",
    "월"
  ],
  "平滑黒点数 SSN": [
    "Smoothed sunspot number SSN",
    "Nombre de taches solaires lissé SSN",
    "Número suavizado de manchas solares SSN",
    "Numero smussato di macchie solari SSN",
    "Número suavizado de manchas solares SSN",
    "Geglättete Sonnenfleckenzahl SSN",
    "평활 흑점수 SSN"
  ],
  "送信電力 W": [
    "Transmit power W",
    "Puissance d’émission W",
    "Potencia de transmisión W",
    "Potenza di trasmissione W",
    "Potência de transmissão W",
    "Sendeleistung W",
    "송신 전력 W"
  ],
  "SSN取得方法": [
    "SSN source",
    "Source du SSN",
    "Origen del SSN",
    "Origine SSN",
    "Origem do SSN",
    "SSN-Quelle",
    "SSN 입력원"
  ],
  "手動入力": [
    "Manual input",
    "Saisie manuelle",
    "Entrada manual",
    "Inserimento manuale",
    "Entrada manual",
    "Manuelle Eingabe",
    "수동 입력"
  ],
  "NOAAの対象月平滑SSNを計算時に取得": [
    "Fetch NOAA target-month smoothed SSN at calculation",
    "Obtenir le SSN lissé NOAA du mois au calcul",
    "Obtener el SSN suavizado NOAA del mes al calcular",
    "Ottieni il SSN smussato NOAA del mese al calcolo",
    "Obter SSN suavizado NOAA do mês no cálculo",
    "NOAA-SSN des Zielmonats bei Berechnung abrufen",
    "계산 시 NOAA 대상 월 평활 SSN 가져오기"
  ],
  "計算周波数 MHz（最大11個、2〜30）": [
    "Frequencies MHz (up to 11, 2–30)",
    "Fréquences MHz (11 maximum, 2–30)",
    "Frecuencias MHz (hasta 11, 2–30)",
    "Frequenze MHz (fino a 11, 2–30)",
    "Frequências MHz (até 11, 2–30)",
    "Frequenzen MHz (bis zu 11, 2–30)",
    "계산 주파수 MHz(최대 11개, 2~30)"
  ],
  "詳細条件": [
    "Advanced conditions",
    "Conditions avancées",
    "Condiciones avanzadas",
    "Condizioni avanzate",
    "Condições avançadas",
    "Erweiterte Bedingungen",
    "상세 조건"
  ],
  "最低打上げ角 °": [
    "Minimum takeoff angle °",
    "Angle de départ minimal °",
    "Ángulo mínimo de salida °",
    "Angolo minimo di partenza °",
    "Ângulo mínimo de saída °",
    "Minimaler Abstrahlwinkel °",
    "최소 발사각 °"
  ],
  "要求SNR dB·Hz": [
    "Required SNR dB·Hz",
    "SNR requis dB·Hz",
    "SNR requerido dB·Hz",
    "SNR richiesto dB·Hz",
    "SNR necessário dB·Hz",
    "Erforderliches SNR dB·Hz",
    "요구 SNR dB·Hz"
  ],
  "目標REL %以上": [
    "Target REL at or above %",
    "REL cible à partir de %",
    "REL objetivo desde %",
    "REL obiettivo da %",
    "REL alvo a partir de %",
    "Ziel-REL ab %",
    "목표 REL % 이상"
  ],
  "利得補正はモデル全体への一律加算です。SNRは1 Hz帯域換算値です。": [
    "Gain correction is a uniform model offset. SNR is normalized to 1 Hz.",
    "Correction de gain uniforme du modèle. SNR ramené à 1 Hz.",
    "La corrección de ganancia es uniforme. SNR normalizado a 1 Hz.",
    "Correzione di guadagno uniforme. SNR normalizzato a 1 Hz.",
    "A correção de ganho é uniforme. SNR normalizado a 1 Hz.",
    "Gewinnkorrektur ist ein einheitlicher Modellversatz. SNR auf 1 Hz bezogen.",
    "이득 보정은 모델 전체에 일괄 적용합니다. SNR은 1 Hz 대역 환산값입니다."
  ],
  "SNR入力方法": [
    "SNR input method",
    "Méthode de saisie du SNR",
    "Método de entrada del SNR",
    "Metodo di inserimento SNR",
    "Método de entrada do SNR",
    "SNR-Eingabemethode",
    "SNR 입력 방법"
  ],
  "1 Hz換算値を直接入力": [
    "Enter 1 Hz normalized SNR",
    "Saisir le SNR ramené à 1 Hz",
    "Introducir SNR normalizado a 1 Hz",
    "Inserisci SNR normalizzato a 1 Hz",
    "Inserir SNR normalizado a 1 Hz",
    "Auf 1 Hz bezogenes SNR eingeben",
    "1 Hz 환산 SNR 직접 입력"
  ],
  "帯域内の必要SNR dB": [
    "Required in-band SNR dB",
    "SNR requis en bande dB",
    "SNR requerido en banda dB",
    "SNR richiesto in banda dB",
    "SNR necessário na banda dB",
    "Erforderliches Band-SNR dB",
    "대역 내 요구 SNR dB"
  ],
  "偏波方式と追加損失": [
    "Polarization & additional loss",
    "Polarisation et perte supplémentaire",
    "Polarización y pérdida adicional",
    "Polarizzazione e perdita aggiuntiva",
    "Polarização e perda adicional",
    "Polarisation und Zusatzverlust",
    "편파 방식·추가 손실"
  ],
  "仮定する追加偏波損失 dB（全経路共通）": [
    "Assumed additional polarization loss dB (all paths)",
    "Perte de polarisation supplémentaire supposée dB (tous trajets)",
    "Pérdida adicional de polarización supuesta dB (todas las rutas)",
    "Perdita di polarizzazione aggiuntiva ipotizzata dB (tutti i percorsi)",
    "Perda adicional de polarização assumida dB (todos os trajetos)",
    "Angenommener zusätzlicher Polarisationsverlust dB (alle Pfade)",
    "가정한 추가 편파 손실 dB(모든 경로 공통)"
  ],
  "偏波方式は条件として記録します。方式名だけではアンテナパターン・偏波不整合・ファラデー回転を自動計算しません。追加損失は利用者の仮定で、送信電力の等価低減として計算に反映します。アンテナ利得等に同じ損失を含めた場合は二重計上しないでください。": [
    "Polarization labels are recorded only: no automatic pattern, mismatch or Faraday-rotation model. Assumed loss is applied as equivalent transmit-power reduction. Do not count losses already included in antenna gain twice.",
    "Les polarisations sont enregistrées : aucun calcul automatique du diagramme, du désaccord ou de la rotation de Faraday. La perte supposée réduit la puissance équivalente. Ne pas compter deux fois les pertes déjà incluses dans le gain.",
    "Las polarizaciones se registran: sin cálculo automático de patrón, desadaptación ni rotación de Faraday. La pérdida supuesta reduce la potencia equivalente. No duplique pérdidas ya incluidas en la ganancia.",
    "Le polarizzazioni sono registrate: nessun calcolo automatico di diagramma, disadattamento o rotazione di Faraday. La perdita ipotizzata riduce la potenza equivalente. Non duplicare perdite già incluse nel guadagno.",
    "As polarizações são registradas: sem cálculo automático de diagrama, descasamento ou rotação de Faraday. A perda assumida reduz a potência equivalente. Não duplique perdas já incluídas no ganho.",
    "Polarisationsangaben werden gespeichert; keine automatische Diagramm-, Fehlanpassungs- oder Faraday-Rotationsberechnung. Der angenommene Verlust reduziert die äquivalente Sendeleistung. Bereits im Gewinn enthaltene Verluste nicht doppelt zählen.",
    "편파 방식은 기록만 하며 패턴·편파 부정합·패러데이 회전을 자동 계산하지 않습니다. 가정한 손실을 등가 송신 전력 감소로 반영합니다. 안테나 이득에 포함된 손실을 중복 적용하지 마세요."
  ],
  "サイト間独立を仮定した参考値を表示（実証なし）": [
    "Show independent-site scenario (unverified)",
    "Afficher le scénario de sites indépendants (non vérifié)",
    "Mostrar escenario de sitios independientes (sin verificar)",
    "Mostra scenario di siti indipendenti (non verificato)",
    "Mostrar cenário de locais independentes (não verificado)",
    "Szenario unabhängiger Standorte anzeigen (unbestätigt)",
    "사이트 독립 가정 참고값 표시(미검증)"
  ],
  "雑音は各RX、利得はアンテナプリセットで設定します。": [
    "Set noise per RX and gain in antenna presets.",
    "Régler le bruit par RX et le gain dans les préréglages d’antennes.",
    "Ajuste el ruido por RX y la ganancia en los preajustes de antenas.",
    "Imposta il rumore per RX e il guadagno nelle preimpostazioni antenne.",
    "Defina ruído por RX e ganho nas predefinições de antenas.",
    "Rauschen je RX und Gewinn in Antennenvorlagen einstellen.",
    "잡음은 RX별로, 이득은 안테나 프리셋에서 설정합니다."
  ],
  "宇宙天気 · NOAA SWPC": [
    "Space weather · NOAA SWPC",
    "Météo spatiale · NOAA SWPC",
    "Clima espacial · NOAA SWPC",
    "Meteo spaziale · NOAA SWPC",
    "Clima espacial · NOAA SWPC",
    "Weltraumwetter · NOAA SWPC",
    "우주 날씨·NOAA SWPC"
  ],
  "取得・表示": [
    "Fetch & display",
    "Obtenir et afficher",
    "Obtener y mostrar",
    "Scarica e visualizza",
    "Obter e exibir",
    "Abrufen und anzeigen",
    "가져오기·표시"
  ],
  "取得・表示を押すと、対象月の平滑SSNと現在のR/S/Gを取得します。": [
    "Fetch to display target-month smoothed SSN and current R/S/G.",
    "Obtenir le SSN lissé du mois cible et R/S/G actuels.",
    "Obtenga el SSN suavizado del mes y los R/S/G actuales.",
    "Scarica il SSN smussato del mese e R/S/G attuali.",
    "Obtenha o SSN suavizado do mês e R/S/G atuais.",
    "Geglättete SSN des Zielmonats und aktuelle R/S/G abrufen.",
    "대상 월 평활 SSN과 현재 R/S/G를 가져옵니다."
  ],
  "R: 電波障害／S: 太陽放射線嵐／G: 地磁気嵐。現在の指標は計算対象月の指標ではありません。F10.7・R/S/Gは参考表示で、計算補正には使用しません。": [
    "R: radio blackout; S: solar radiation storm; G: geomagnetic storm. Current values are not target-month values. F10.7 and R/S/G are informational and do not correct the calculation.",
    "R : panne radio ; S : tempête de rayonnement solaire ; G : tempête géomagnétique. Valeurs actuelles, pas celles du mois cible. F10.7 et R/S/G sont informatifs, sans correction du calcul.",
    "R: apagón de radio; S: tormenta de radiación solar; G: tormenta geomagnética. Son valores actuales, no del mes objetivo. F10.7 y R/S/G son informativos y no corrigen el cálculo.",
    "R: blackout radio; S: tempesta di radiazione solare; G: tempesta geomagnetica. Valori attuali, non del mese obiettivo. F10.7 e R/S/G sono informativi e non correggono il calcolo.",
    "R: apagão de rádio; S: tempestade de radiação solar; G: tempestade geomagnética. São valores atuais, não do mês alvo. F10.7 e R/S/G são informativos e não corrigem o cálculo.",
    "R: Funkstörung; S: Sonnenstrahlungssturm; G: geomagnetischer Sturm. Aktuelle Werte, keine Zielmonatswerte. F10.7 und R/S/G dienen nur der Information, ohne Rechenkorrektur.",
    "R: 전파 장애, S: 태양 방사선 폭풍, G: 지자기 폭풍. 현재 지표는 대상 월의 지표가 아닙니다. F10.7·R/S/G는 참고 표시이며 계산을 보정하지 않습니다."
  ],
  "現在の電離圏観測・吸収情報": [
    "Current ionosphere & absorption observations",
    "Observations actuelles de l’ionosphère et de l’absorption",
    "Observaciones actuales de ionosfera y absorción",
    "Osservazioni attuali di ionosfera e assorbimento",
    "Observações atuais da ionosfera e absorção",
    "Aktuelle Ionosphären- und Absorptionsmessungen",
    "현재 전리층·흡수 관측 정보"
  ],
  "国内観測・D-RAPを取得": [
    "Fetch Japan observations & D-RAP",
    "Obtenir les observations japonaises et D-RAP",
    "Obtener observaciones de Japón y D-RAP",
    "Scarica osservazioni del Giappone e D-RAP",
    "Obter observações do Japão e D-RAP",
    "Japanische Messungen und D-RAP abrufen",
    "일본 관측·D-RAP 가져오기"
  ],
  "月間予測とは別の現在情報です。観測値からVOACAPの信頼度やSNRを自動補正しません。": [
    "Current observations are separate from monthly forecasts. They do not automatically correct VOACAP reliability or SNR.",
    "Les observations actuelles sont distinctes des prévisions mensuelles. Elles ne corrigent pas automatiquement la fiabilité ou le SNR de VOACAP.",
    "Las observaciones actuales son distintas de las predicciones mensuales. No corrigen automáticamente la fiabilidad ni el SNR de VOACAP.",
    "Le osservazioni attuali sono separate dalle previsioni mensili. Non correggono automaticamente affidabilità o SNR di VOACAP.",
    "As observações atuais são separadas das previsões mensais. Não corrigem automaticamente a confiabilidade ou o SNR do VOACAP.",
    "Aktuelle Messungen sind von Monatsprognosen getrennt. Sie korrigieren VOACAP-Zuverlässigkeit und SNR nicht automatisch.",
    "현재 관측은 월간 예측과 별도이며 VOACAP 신뢰도·SNR을 자동 보정하지 않습니다."
  ],
  "取得するとD-RAPを地図に重ね、NICTの国内4観測局を表示します。": [
    "Fetch to overlay D-RAP and show the four NICT stations in Japan.",
    "Charger pour superposer D-RAP et afficher les quatre stations NICT au Japon.",
    "Obtenga los datos para superponer D-RAP y mostrar las cuatro estaciones NICT de Japón.",
    "Scarica per sovrapporre D-RAP e mostrare le quattro stazioni NICT in Giappone.",
    "Obtenha dados para sobrepor D-RAP e mostrar as quatro estações NICT no Japão.",
    "Abrufen, um D-RAP und die vier NICT-Stationen in Japan anzuzeigen.",
    "가져오면 D-RAP을 지도에 겹쳐 표시하고 일본 NICT 4개 관측소를 표시합니다."
  ],
  "D-RAP · D領域吸収": [
    "D-RAP · D-region absorption",
    "D-RAP · Absorption de la région D",
    "D-RAP · Absorción de la región D",
    "D-RAP · Assorbimento della regione D",
    "D-RAP · Absorção da região D",
    "D-RAP · D-Schicht-Absorption",
    "D-RAP·D 영역 흡수"
  ],
  "未取得": [
    "Not fetched",
    "Non chargé",
    "Sin obtener",
    "Non scaricato",
    "Não obtido",
    "Nicht abgerufen",
    "아직 가져오지 않음"
  ],
  "色はHAF（垂直伝搬で1 dB吸収の影響を受ける最高周波数、MHz）。0＝影響周波数0、灰色＝欠測。MUF・回線全体の損失ではありません。": [
    "Colors show HAF: highest frequency affected by 1 dB vertical absorption (MHz). Zero is zero; gray is missing. This is not MUF or total link loss.",
    "Couleurs : HAF, fréquence maximale affectée par 1 dB d’absorption verticale (MHz). Zéro = zéro ; gris = manquant. Ni MUF ni perte totale de liaison.",
    "Colores: HAF, máxima frecuencia afectada por 1 dB de absorción vertical (MHz). Cero = cero; gris = sin datos. No es MUF ni pérdida total del enlace.",
    "Colori: HAF, massima frequenza interessata da 1 dB di assorbimento verticale (MHz). Zero = zero; grigio = dato mancante. Non è MUF né perdita totale.",
    "Cores: HAF, maior frequência afetada por 1 dB de absorção vertical (MHz). Zero = zero; cinza = sem dados. Não é MUF nem perda total do enlace.",
    "Farben zeigen HAF: höchste bei vertikaler Ausbreitung von 1 dB Absorption betroffene Frequenz (MHz). Null = null, Grau = fehlend. Keine MUF oder Gesamtpfaddämpfung.",
    "색상은 수직 전파에서 1 dB 흡수 영향을 받는 최고 주파수 HAF(MHz)입니다. 0은 0, 회색은 결측이며 MUF나 경로 전체 손실이 아닙니다."
  ],
  "NICT · 国内電離圏観測": [
    "NICT · Japan ionosphere observations",
    "NICT · Observations ionosphériques au Japon",
    "NICT · Observaciones ionosféricas de Japón",
    "NICT · Osservazioni ionosferiche del Giappone",
    "NICT · Observações ionosféricas do Japão",
    "NICT · Japanische Ionosphärenmessungen",
    "NICT·일본 전리층 관측"
  ],
  "参考伝搬距離": [
    "Reference path distance",
    "Distance de référence",
    "Distancia de referencia",
    "Distanza di riferimento",
    "Distância de referência",
    "Referenz-Pfadentfernung",
    "참고 전파 거리"
  ],
  "NICTの距離別LUF／MUFは各局上空の垂直観測から導出した参考値。指定した送受信経路とは条件が異なるため、直接の精度誤差や補正率は算出しません。": [
    "NICT distance-based LUF/MUF are reference values from vertical soundings above each station. Their conditions differ from your path; no direct error or correction ratio is calculated.",
    "Les LUF/MUF NICT par distance proviennent de sondages verticaux locaux. Les conditions diffèrent du trajet choisi ; aucun taux direct d’erreur ou de correction n’est calculé.",
    "LUF/MUF de NICT por distancia son referencias de sondeos verticales locales. Sus condiciones difieren de la ruta; no se calcula error directo ni factor de corrección.",
    "LUF/MUF NICT per distanza derivano da sondaggi verticali locali. Le condizioni differiscono dal percorso scelto; nessun errore diretto o rapporto di correzione è calcolato.",
    "LUF/MUF do NICT por distância são referências de sondagens verticais locais. As condições diferem do trajeto; nenhum erro direto ou fator de correção é calculado.",
    "Entfernungsbezogene NICT-LUF/MUF beruhen auf lokalen Vertikalsondierungen. Andere Bedingungen als Ihr Pfad; kein direkter Fehler oder Korrekturfaktor wird berechnet.",
    "NICT 거리별 LUF/MUF는 각 관측소 상공의 수직 관측에서 얻은 참고값입니다. 선택한 경로와 조건이 달라 직접 오차나 보정률을 계산하지 않습니다."
  ],
  "NICT原典": [
    "NICT source",
    "Source NICT",
    "Fuente NICT",
    "Fonte NICT",
    "Fonte NICT",
    "NICT-Quelle",
    "NICT 원문"
  ],
  "NICT観測履歴と27日中央値": [
    "NICT history & 27-day median",
    "Historique NICT et médiane sur 27 jours",
    "Historial NICT y mediana de 27 días",
    "Storico NICT e mediana di 27 giorni",
    "Histórico NICT e mediana de 27 dias",
    "NICT-Verlauf und 27-Tage-Median",
    "NICT 이력·27일 중앙값"
  ],
  "GIRO · 海外電離圏観測": [
    "GIRO · International ionosphere observations",
    "GIRO · Observations ionosphériques internationales",
    "GIRO · Observaciones ionosféricas internacionales",
    "GIRO · Osservazioni ionosferiche internazionali",
    "GIRO · Observações ionosféricas internacionais",
    "GIRO · Internationale Ionosphärenmessungen",
    "GIRO·해외 전리층 관측"
  ],
  "Guam（グアム）": [
    "Guam",
    "Guam",
    "Guam",
    "Guam",
    "Guam",
    "Guam",
    "괌"
  ],
  "Juliusruh（ドイツ）": [
    "Juliusruh (Germany)",
    "Juliusruh (Allemagne)",
    "Juliusruh (Alemania)",
    "Juliusruh (Germania)",
    "Juliusruh (Alemanha)",
    "Juliusruh (Deutschland)",
    "율리우스루(독일)"
  ],
  "Millstone Hill（米国）": [
    "Millstone Hill (USA)",
    "Millstone Hill (États-Unis)",
    "Millstone Hill (EE. UU.)",
    "Millstone Hill (USA)",
    "Millstone Hill (EUA)",
    "Millstone Hill (USA)",
    "밀스톤힐(미국)"
  ],
  "海外観測を取得": [
    "Fetch international observations",
    "Obtenir les observations internationales",
    "Obtener observaciones internacionales",
    "Scarica osservazioni internazionali",
    "Obter observações internacionais",
    "Internationale Messungen abrufen",
    "해외 관측 가져오기"
  ],
  "海外観測はGIROの利用条件に適合する環境で有効にできます。": [
    "Enable GIRO only in environments compliant with its usage terms.",
    "Activer GIRO uniquement dans un environnement conforme à ses conditions.",
    "Active GIRO solo en entornos que cumplan sus condiciones de uso.",
    "Abilita GIRO solo in ambienti conformi alle sue condizioni d’uso.",
    "Ative GIRO apenas em ambientes que cumpram seus termos de uso.",
    "GIRO nur in Umgebungen aktivieren, die seine Nutzungsbedingungen erfüllen.",
    "GIRO 이용 조건을 충족하는 환경에서만 해외 관측을 활성화하세요."
  ],
  "GIRO / LGDC・各観測局。CC BY-NC-SA 4.0と": [
    "GIRO / LGDC and station contributors. Follow CC BY-NC-SA 4.0 and",
    "GIRO / LGDC et stations contributrices. Respecter CC BY-NC-SA 4.0 et",
    "GIRO / LGDC y estaciones contribuyentes. Cumpla CC BY-NC-SA 4.0 y",
    "GIRO / LGDC e stazioni contributrici. Rispettare CC BY-NC-SA 4.0 e",
    "GIRO / LGDC e estações contribuintes. Siga CC BY-NC-SA 4.0 e",
    "GIRO / LGDC und beitragende Stationen. CC BY-NC-SA 4.0 und",
    "GIRO / LGDC·각 관측소. CC BY-NC-SA 4.0 및"
  ],
  "に従って利用してください。CSは自動読取の信頼スコア（999＝手動、−1＝不明）です。MUF(D)はD＝3000 km。": [
    ". CS is the automatic-reading confidence score (999 = manual, −1 = unknown). MUF(D) uses D = 3000 km.",
    ". CS est le score de confiance de lecture automatique (999 = manuel, −1 = inconnu). MUF(D) utilise D = 3000 km.",
    ". CS es la confianza de lectura automática (999 = manual, −1 = desconocido). MUF(D) usa D = 3000 km.",
    ". CS è il punteggio di affidabilità della lettura automatica (999 = manuale, −1 = ignoto). MUF(D) usa D = 3000 km.",
    ". CS é a confiança da leitura automática (999 = manual, −1 = desconhecido). MUF(D) usa D = 3000 km.",
    " beachten. CS ist der Vertrauenswert der automatischen Auswertung (999 = manuell, −1 = unbekannt). MUF(D) nutzt D = 3000 km.",
    "에 따라 이용하세요. CS는 자동 판독 신뢰 점수(999=수동, −1=불명)이며 MUF(D)는 D=3000 km입니다."
  ],
  "地点プリセットの登録・編集": [
    "Register & edit location presets",
    "Créer et modifier les préréglages des lieux",
    "Registrar y editar preajustes de ubicaciones",
    "Registra e modifica preimpostazioni località",
    "Registrar e editar predefinições de locais",
    "Standortvorlagen registrieren und bearbeiten",
    "지점 프리셋 등록·편집"
  ],
  "一覧を再読込": [
    "Reload catalog",
    "Recharger le catalogue",
    "Recargar catálogo",
    "Ricarica catalogo",
    "Recarregar catálogo",
    "Katalog neu laden",
    "목록 다시 불러오기"
  ],
  "初期登録の主要都市は市中心付近の概略座標です。実際の無線局の設置地点はここで登録・編集してください。移動局は受信局IDに連動します。": [
    "Default cities use approximate city-center coordinates, not actual radio facilities. Register precise sites here. Mobile presets track the received station ID.",
    "Les villes utilisent des coordonnées approximatives du centre, pas des installations radio. Enregistrer les lieux précis ici. Les mobiles suivent l’identifiant reçu.",
    "Las ciudades usan coordenadas aproximadas del centro, no instalaciones de radio. Registre aquí los sitios exactos. Los móviles siguen el ID recibido.",
    "Le città usano coordinate approssimative del centro, non impianti radio. Registra qui i siti precisi. I mobili seguono l’ID ricevuto.",
    "As cidades usam coordenadas aproximadas do centro, não instalações de rádio. Registre os locais exatos aqui. Os móveis seguem o ID recebido.",
    "Städte verwenden ungefähre Zentrumskoordinaten, keine Funkstandorte. Genaue Standorte hier registrieren. Mobile Vorlagen folgen der empfangenen Stations-ID.",
    "기본 도시 좌표는 도심 부근의 개략값이며 실제 무선국 위치가 아닙니다. 정확한 지점은 여기서 등록하세요. 이동국은 수신국 ID에 연동합니다."
  ],
  "名称": [
    "Name",
    "Nom",
    "Nombre",
    "Nome",
    "Nome",
    "Name",
    "이름"
  ],
  "地域": [
    "Region",
    "Région",
    "Región",
    "Regione",
    "Região",
    "Region",
    "지역"
  ],
  "地点種別": [
    "Location type",
    "Type de lieu",
    "Tipo de ubicación",
    "Tipo di località",
    "Tipo de local",
    "Standorttyp",
    "지점 종류"
  ],
  "固定地点": [
    "Fixed location",
    "Lieu fixe",
    "Ubicación fija",
    "Località fissa",
    "Local fixo",
    "Fester Standort",
    "고정 지점"
  ],
  "受信している移動局": [
    "Received mobile station",
    "Station mobile reçue",
    "Estación móvil recibida",
    "Stazione mobile ricevuta",
    "Estação móvel recebida",
    "Empfangene mobile Station",
    "수신 중인 이동국"
  ],
  "受信局": [
    "Received station",
    "Station reçue",
    "Estación recibida",
    "Stazione ricevuta",
    "Estação recebida",
    "Empfangene Station",
    "수신국"
  ],
  "緯度 °": [
    "Latitude °",
    "Latitude °",
    "Latitud °",
    "Latitudine °",
    "Latitude °",
    "Breitengrad °",
    "위도 °"
  ],
  "経度 °": [
    "Longitude °",
    "Longitude °",
    "Longitud °",
    "Longitudine °",
    "Longitude °",
    "Längengrad °",
    "경도 °"
  ],
  "保存": [
    "Save",
    "Enregistrer",
    "Guardar",
    "Salva",
    "Salvar",
    "Speichern",
    "저장"
  ],
  "新規登録": [
    "New preset",
    "Nouveau préréglage",
    "Nuevo preajuste",
    "Nuova preimpostazione",
    "Nova predefinição",
    "Neue Vorlage",
    "새 프리셋"
  ],
  "アンテナプリセットの登録・編集": [
    "Register & edit antenna presets",
    "Créer et modifier les préréglages d’antennes",
    "Registrar y editar preajustes de antenas",
    "Registra e modifica preimpostazioni antenne",
    "Registrar e editar predefinições de antenas",
    "Antennenvorlagen registrieren und bearbeiten",
    "안테나 프리셋 등록·편집"
  ],
  "基準モデルと一律の利得補正を名前付きで保存します。任意の実アンテナの指向性・設置高のモデルを生成する機能ではありません。": [
    "Save a named baseline model and uniform gain correction. This does not generate real antenna patterns or installation-height models.",
    "Enregistrer un modèle de référence nommé et une correction uniforme du gain. Cela ne génère pas les diagrammes réels ni les modèles de hauteur d’installation.",
    "Guarde un modelo de referencia con nombre y una corrección uniforme de ganancia. No genera patrones reales de antena ni modelos de altura de instalación.",
    "Salva un modello base con nome e correzione uniforme del guadagno. Non genera diagrammi reali né modelli di altezza di installazione.",
    "Salve um modelo básico com nome e correção uniforme de ganho. Não gera diagramas reais de antena nem modelos de altura de instalação.",
    "Benanntes Basismodell und einheitliche Gewinnkorrektur speichern. Keine Erzeugung realer Antennendiagramme oder Montagehöhenmodelle.",
    "기준 모델과 일괄 이득 보정을 이름과 함께 저장합니다. 실제 안테나 지향성·설치 높이 모델을 생성하지 않습니다."
  ],
  "基準モデル": [
    "Baseline model",
    "Modèle de référence",
    "Modelo de referencia",
    "Modello base",
    "Modelo básico",
    "Basismodell",
    "기준 모델"
  ],
  "標準ホイップ": [
    "Standard whip",
    "Fouet standard",
    "Látigo estándar",
    "Stilo standard",
    "Chicote padrão",
    "Standard-Stabantenne",
    "표준 휩"
  ],
  "等方性基準": [
    "Isotropic reference",
    "Référence isotrope",
    "Referencia isotrópica",
    "Riferimento isotropico",
    "Referência isotrópica",
    "Isotrope Referenz",
    "등방성 기준"
  ],
  "利得補正 dB": [
    "Gain correction dB",
    "Correction de gain dB",
    "Corrección de ganancia dB",
    "Correzione di guadagno dB",
    "Correção de ganho dB",
    "Gewinnkorrektur dB",
    "이득 보정 dB"
  ],
  "保存された計算": [
    "Saved calculations",
    "Calculs enregistrés",
    "Cálculos guardados",
    "Calcoli salvati",
    "Cálculos salvos",
    "Gespeicherte Berechnungen",
    "저장된 계산"
  ],
  "更新": [
    "Refresh",
    "Actualiser",
    "Actualizar",
    "Aggiorna",
    "Atualizar",
    "Aktualisieren",
    "새로 고침"
  ],
  "送受信地点": [
    "TX & RX locations",
    "Lieux TX et RX",
    "Ubicaciones TX y RX",
    "Località TX e RX",
    "Locais TX e RX",
    "TX- und RX-Standorte",
    "송수신 지점"
  ],
  "＋ RXを追加": [
    "＋ Add RX",
    "＋ Ajouter RX",
    "＋ Añadir RX",
    "＋ Aggiungi RX",
    "＋ Adicionar RX",
    "＋ RX hinzufügen",
    "＋ RX 추가"
  ],
  "24時間の伝搬を計算 →": [
    "Calculate 24-hour forecast →",
    "Calculer la prévision sur 24 h →",
    "Calcular predicción de 24 horas →",
    "Calcola previsione di 24 ore →",
    "Calcular previsão de 24 horas →",
    "24-Stunden-Prognose berechnen →",
    "24시간 전파 계산 →"
  ],
  "TX 1局 · RX 1〜8局。RX 2局以上はダイバーシティー受信として計算します。位置は計算開始時点の値です。": [
    "One TX, 1–8 RX. Two or more RX use site diversity. Positions are fixed at calculation start.",
    "Un TX, 1–8 RX. Dès deux RX : diversité de sites. Positions figées au début du calcul.",
    "Un TX, 1–8 RX. Dos o más RX usan diversidad de sitios. Posiciones fijadas al iniciar el cálculo.",
    "Un TX, 1–8 RX. Da due RX si usa la diversità di sito. Posizioni fissate all’avvio del calcolo.",
    "Um TX, 1–8 RX. A partir de dois RX usa diversidade de locais. Posições fixadas no início do cálculo.",
    "Ein TX, 1–8 RX. Ab zwei RX Standortdiversität. Positionen werden beim Berechnungsstart fixiert.",
    "TX 1국·RX 1~8국. RX 2국 이상은 사이트 다이버시티를 사용합니다. 계산 시작 시 위치를 고정합니다."
  ],
  "地点を登録・編集": [
    "Register / edit locations",
    "Créer / modifier les lieux",
    "Registrar / editar ubicaciones",
    "Registra / modifica località",
    "Registrar / editar locais",
    "Standorte registrieren / bearbeiten",
    "지점 등록·편집"
  ],
  "アンテナを登録・編集": [
    "Register / edit antennas",
    "Créer / modifier les antennes",
    "Registrar / editar antenas",
    "Registra / modifica antenne",
    "Registrar / editar antenas",
    "Antennen registrieren / bearbeiten",
    "안테나 등록·편집"
  ],
  "外部データの利用条件・出典": [
    "External data terms & sources",
    "Conditions et sources des données externes",
    "Condiciones y fuentes de datos externos",
    "Condizioni e fonti dei dati esterni",
    "Termos e fontes dos dados externos",
    "Nutzungsbedingungen und Quellen externer Daten",
    "외부 데이터 이용 조건·출처"
  ],
  "本体MITは外部データへ適用されません。GIROは利用・共有条件あり。NOAA経由SSN等の第三者データは個別確認が必要です。": [
    "The app’s MIT license does not cover external data. GIRO has use and sharing conditions. Check third-party terms for SSN and other data provided through NOAA.",
    "La licence MIT de l’application ne couvre pas les données externes. GIRO impose des conditions d’utilisation et de partage. Vérifier les conditions des tiers pour le SSN et autres données via NOAA.",
    "La licencia MIT de la aplicación no cubre datos externos. GIRO tiene condiciones de uso y difusión. Compruebe las condiciones de terceros para SSN y otros datos vía NOAA.",
    "La licenza MIT dell’app non copre dati esterni. GIRO prevede condizioni d’uso e condivisione. Verificare le condizioni di terzi per SSN e altri dati tramite NOAA.",
    "A licença MIT do aplicativo não cobre dados externos. GIRO tem condições de uso e compartilhamento. Verifique termos de terceiros para SSN e outros dados via NOAA.",
    "Die MIT-Lizenz der App gilt nicht für externe Daten. GIRO hat Nutzungs- und Weitergabebedingungen. Bedingungen Dritter für SSN und andere NOAA-Daten prüfen.",
    "본체 MIT 라이선스는 외부 데이터에 적용되지 않습니다. GIRO에는 이용·공유 조건이 있습니다. NOAA를 통해 제공되는 SSN 등 제3자 데이터의 조건을 확인하세요."
  ],
  "予測は月間統計です。瞬時の電離圏変動・磁気嵐・実機アンテナ設置条件を完全には反映しません。": [
    "Monthly statistical forecasts do not fully capture instantaneous ionospheric changes, geomagnetic storms or real antenna installations.",
    "Les prévisions statistiques mensuelles ne représentent pas entièrement les variations instantanées, tempêtes géomagnétiques ou installations d’antennes réelles.",
    "Las predicciones estadísticas mensuales no reflejan por completo cambios instantáneos, tormentas geomagnéticas ni instalaciones reales de antena.",
    "Le previsioni statistiche mensili non rappresentano completamente variazioni istantanee, tempeste geomagnetiche o installazioni reali.",
    "As previsões estatísticas mensais não refletem totalmente mudanças instantâneas, tempestades geomagnéticas ou instalações reais de antena.",
    "Monatliche statistische Prognosen erfassen momentane Ionosphärenänderungen, geomagnetische Stürme und reale Antenneninstallationen nicht vollständig.",
    "월간 통계 예측은 순간 전리층 변화·지자기 폭풍·실제 안테나 설치 조건을 완전히 반영하지 못합니다."
  ],
  "TX · 送信地点": [
    "TX · Transmit location",
    "TX · Lieu d’émission",
    "TX · Ubicación de transmisión",
    "TX · Località di trasmissione",
    "TX · Local de transmissão",
    "TX · Sendestandort",
    "TX·송신 지점"
  ],
  "RX{n} · 受信地点": [
    "RX{n} · Receive location",
    "RX{n} · Lieu de réception",
    "RX{n} · Ubicación de recepción",
    "RX{n} · Località di ricezione",
    "RX{n} · Local de recepção",
    "RX{n} · Empfangsstandort",
    "RX{n}·수신 지점"
  ],
  "単一RX · 地点間予測": [
    "Single RX · Point-to-point forecast",
    "RX unique · Prévision point à point",
    "RX único · Predicción punto a punto",
    "RX singolo · Previsione punto-punto",
    "RX único · Previsão ponto a ponto",
    "Ein RX · Punkt-zu-Punkt-Prognose",
    "단일 RX·지점 간 예측"
  ],
  "RX {n}局 · ダイバーシティー受信": [
    "{n} RX · Diversity reception",
    "{n} RX · Réception en diversité",
    "{n} RX · Recepción por diversidad",
    "{n} RX · Ricezione in diversità",
    "{n} RX · Recepção em diversidade",
    "{n} RX · Diversitätsempfang",
    "RX {n}국·다이버시티 수신"
  ],
  "地点を選択": [
    "Select location",
    "Choisir le lieu",
    "Seleccionar ubicación",
    "Seleziona località",
    "Selecionar local",
    "Standort wählen",
    "지점 선택"
  ],
  "アンテナを選択": [
    "Select antenna",
    "Choisir l’antenne",
    "Seleccionar antena",
    "Seleziona antenna",
    "Selecionar antena",
    "Antenne wählen",
    "안테나 선택"
  ],
  "地点を選択してください": [
    "Select a location",
    "Choisir un lieu",
    "Seleccione una ubicación",
    "Seleziona una località",
    "Selecione um local",
    "Einen Standort auswählen",
    "지점을 선택하세요"
  ],
  "雑音 −dBW @3 MHz": [
    "Noise −dBW @3 MHz",
    "Bruit −dBW à 3 MHz",
    "Ruido −dBW a 3 MHz",
    "Rumore −dBW a 3 MHz",
    "Ruído −dBW a 3 MHz",
    "Rauschen −dBW bei 3 MHz",
    "잡음 −dBW @3 MHz"
  ],
  "TXと交換": [
    "Swap with TX",
    "Permuter avec TX",
    "Intercambiar con TX",
    "Scambia con TX",
    "Trocar com TX",
    "Mit TX tauschen",
    "TX와 교환"
  ],
  "RXを削除": [
    "Remove RX",
    "Supprimer RX",
    "Eliminar RX",
    "Rimuovi RX",
    "Remover RX",
    "RX entfernen",
    "RX 삭제"
  ],
  "北米": [
    "North America",
    "Amérique du Nord",
    "Norteamérica",
    "Nord America",
    "América do Norte",
    "Nordamerika",
    "북미"
  ],
  "東アジア": [
    "East Asia",
    "Asie de l’Est",
    "Asia Oriental",
    "Asia orientale",
    "Leste Asiático",
    "Ostasien",
    "동아시아"
  ],
  "ヨーロッパ": [
    "Europe",
    "Europe",
    "Europa",
    "Europa",
    "Europa",
    "Europa",
    "유럽"
  ],
  "その他": [
    "Other",
    "Autres",
    "Otros",
    "Altro",
    "Outros",
    "Sonstige",
    "기타"
  ],
  "移動局": [
    "Mobile stations",
    "Stations mobiles",
    "Estaciones móviles",
    "Stazioni mobili",
    "Estações móveis",
    "Mobile Stationen",
    "이동국"
  ],
  "履歴・保存設定": [
    "History / saved settings",
    "Historique / réglages enregistrés",
    "Historial / ajustes guardados",
    "Cronologia / impostazioni salvate",
    "Histórico / configurações salvas",
    "Verlauf / gespeicherte Einstellungen",
    "이력·저장 설정"
  ],
  "編集": [
    "Edit",
    "Modifier",
    "Editar",
    "Modifica",
    "Editar",
    "Bearbeiten",
    "편집"
  ],
  "削除": [
    "Delete",
    "Supprimer",
    "Eliminar",
    "Elimina",
    "Excluir",
    "Löschen",
    "삭제"
  ],
  "登録・編集": [
    "Register / edit",
    "Créer / modifier",
    "Registrar / editar",
    "Registra / modifica",
    "Registrar / editar",
    "Registrieren / bearbeiten",
    "등록·편집"
  ],
  "地域 / 地点": [
    "Region / location",
    "Région / lieu",
    "Región / ubicación",
    "Regione / località",
    "Região / local",
    "Region / Standort",
    "지역·지점"
  ],
  "モデル / 利得": [
    "Model / gain",
    "Modèle / gain",
    "Modelo / ganancia",
    "Modello / guadagno",
    "Modelo / ganho",
    "Modell / Gewinn",
    "모델·이득"
  ],
  "プリセットを保存しました。": [
    "Preset saved.",
    "Préréglage enregistré.",
    "Preajuste guardado.",
    "Preimpostazione salvata.",
    "Predefinição salva.",
    "Vorlage gespeichert.",
    "프리셋을 저장했습니다."
  ],
  "計算中…": [
    "Calculating…",
    "Calcul en cours…",
    "Calculando…",
    "Calcolo in corso…",
    "Calculando…",
    "Wird berechnet…",
    "계산 중…"
  ],
  "VOACAPで24時間分を計算しています…": [
    "Calculating 24 hours with VOACAP…",
    "Calcul de 24 heures avec VOACAP…",
    "Calculando 24 horas con VOACAP…",
    "Calcolo di 24 ore con VOACAP…",
    "Calculando 24 horas com VOACAP…",
    "24 Stunden werden mit VOACAP berechnet…",
    "VOACAP으로 24시간을 계산하는 중…"
  ],
  "計算完了。条件と結果を履歴に保存しました。": [
    "Calculation complete. Conditions and results saved to history.",
    "Calcul terminé. Conditions et résultats enregistrés.",
    "Cálculo completo. Condiciones y resultados guardados.",
    "Calcolo completato. Condizioni e risultati salvati.",
    "Cálculo concluído. Condições e resultados salvos.",
    "Berechnung abgeschlossen. Bedingungen und Ergebnisse gespeichert.",
    "계산 완료. 조건과 결과를 이력에 저장했습니다."
  ],
  "このブラウザに入力設定を保存しました。": [
    "Settings saved in this browser.",
    "Réglages enregistrés dans ce navigateur.",
    "Ajustes guardados en este navegador.",
    "Impostazioni salvate in questo browser.",
    "Configurações salvas neste navegador.",
    "Einstellungen in diesem Browser gespeichert.",
    "이 브라우저에 설정을 저장했습니다."
  ],
  "設定を保存できませんでした。": [
    "Could not save settings.",
    "Impossible d’enregistrer les réglages.",
    "No se pudieron guardar los ajustes.",
    "Impossibile salvare le impostazioni.",
    "Não foi possível salvar as configurações.",
    "Einstellungen konnten nicht gespeichert werden.",
    "설정을 저장하지 못했습니다."
  ],
  "通信に失敗しました": [
    "Request failed",
    "Échec de la requête",
    "Solicitud fallida",
    "Richiesta non riuscita",
    "Falha na solicitação",
    "Anfrage fehlgeschlagen",
    "통신에 실패했습니다"
  ],
  "● エンジン準備完了": [
    "● Engine ready",
    "● Moteur prêt",
    "● Motor listo",
    "● Motore pronto",
    "● Motor pronto",
    "● Engine bereit",
    "● 엔진 준비 완료"
  ],
  "エンジン未準備": [
    "Engine not ready",
    "Moteur non prêt",
    "Motor no disponible",
    "Motore non pronto",
    "Motor não pronto",
    "Engine nicht bereit",
    "엔진 준비 안 됨"
  ],
  "接続できません": [
    "Cannot connect",
    "Connexion impossible",
    "No se puede conectar",
    "Connessione impossibile",
    "Não foi possível conectar",
    "Keine Verbindung möglich",
    "연결할 수 없음"
  ],
  "信頼度 %": [
    "Reliability %",
    "Fiabilité %",
    "Fiabilidad %",
    "Affidabilità %",
    "Confiabilidade %",
    "Zuverlässigkeit %",
    "신뢰도 %"
  ],
  "信号 dBW": [
    "Signal dBW",
    "Signal dBW",
    "Señal dBW",
    "Segnale dBW",
    "Sinal dBW",
    "Signal dBW",
    "신호 dBW"
  ],
  "打上げ角 °": [
    "Takeoff angle °",
    "Angle de départ °",
    "Ángulo de salida °",
    "Angolo di partenza °",
    "Ângulo de saída °",
    "Abstrahlwinkel °",
    "발사각 °"
  ],
  "基準未達": [
    "Below target",
    "Objectif non atteint",
    "Objetivo no alcanzado",
    "Obiettivo non raggiunto",
    "Abaixo do alvo",
    "Ziel nicht erreicht",
    "목표 미달"
  ],
  "欠測": [
    "Missing",
    "Manquant",
    "Sin datos",
    "Mancante",
    "Ausente",
    "Fehlend",
    "결측"
  ],
  "サイト": [
    "Site",
    "Site",
    "Sitio",
    "Sito",
    "Local",
    "Standort",
    "사이트"
  ],
  "REL最大サイト": [
    "Site with highest REL",
    "Site au REL maximal",
    "Sitio con mayor REL",
    "Sito con REL massimo",
    "Local com maior REL",
    "Standort mit höchstem REL",
    "REL 최대 사이트"
  ],
  "最良REL %": [
    "Best REL %",
    "Meilleur REL %",
    "Mejor REL %",
    "Miglior REL %",
    "Melhor REL %",
    "Bestes REL %",
    "최적 REL %"
  ],
  "少なくとも1サイト受信 · 理論範囲 %": [
    "At least one site · Theoretical bounds %",
    "Au moins un site · Bornes théoriques %",
    "Al menos un sitio · Límites teóricos %",
    "Almeno un sito · Limiti teorici %",
    "Pelo menos um local · Limites teóricos %",
    "Mindestens ein Standort · Theoretische Grenzen %",
    "최소 1개 사이트 수신·이론 범위 %"
  ],
  "目標REL以上のサイト数": [
    "Sites meeting target REL",
    "Sites atteignant le REL cible",
    "Sitios que alcanzan el REL objetivo",
    "Siti che raggiungono il REL obiettivo",
    "Locais que atingem o REL alvo",
    "Standorte mit erreichtem Ziel-REL",
    "목표 REL 충족 사이트 수"
  ],
  "独立仮定の参考値 %": [
    "Independent-site scenario %",
    "Scénario de sites indépendants %",
    "Escenario de sitios independientes %",
    "Scenario di siti indipendenti %",
    "Cenário de locais independentes %",
    "Szenario unabhängiger Standorte %",
    "독립 가정 참고값 %"
  ],
  "経路 km": [
    "Path km",
    "Trajet km",
    "Ruta km",
    "Percorso km",
    "Trajeto km",
    "Pfad km",
    "경로 km"
  ],
  "アンテナ": [
    "Antenna",
    "Antenne",
    "Antena",
    "Antenna",
    "Antena",
    "Antenne",
    "안테나"
  ],
  "利得 dBi": [
    "Gain dBi",
    "Gain dBi",
    "Ganancia dBi",
    "Guadagno dBi",
    "Ganho dBi",
    "Gewinn dBi",
    "이득 dBi"
  ],
  "観測 UTC": [
    "Observed UTC",
    "Observation UTC",
    "Observación UTC",
    "Osservazione UTC",
    "Observação UTC",
    "Messzeit UTC",
    "관측 UTC"
  ],
  "状態": [
    "Status",
    "État",
    "Estado",
    "Stato",
    "Estado",
    "Status",
    "상태"
  ],
  "プリセット": [
    "Preset",
    "Préréglage",
    "Preajuste",
    "Preimpostazione",
    "Predefinição",
    "Vorlage",
    "프리셋"
  ],
  "名称 / ID": [
    "Name / ID",
    "Nom / ID",
    "Nombre / ID",
    "Nome / ID",
    "Nome / ID",
    "Name / ID",
    "이름·ID"
  ],
  "緯度 / 経度": [
    "Latitude / longitude",
    "Latitude / longitude",
    "Latitud / longitud",
    "Latitudine / longitudine",
    "Latitude / longitude",
    "Breite / Länge",
    "위도·경도"
  ],
  "送信元 / 局ID": [
    "Source / station ID",
    "Source / ID station",
    "Origen / ID estación",
    "Origine / ID stazione",
    "Origem / ID estação",
    "Quelle / Stations-ID",
    "송신원 / 국 ID"
  ],
  "受信形式": [
    "Input format",
    "Format d’entrée",
    "Formato de entrada",
    "Formato di ingresso",
    "Formato de entrada",
    "Eingangsformat",
    "수신 형식"
  ],
  "受信有効": [
    "Input enabled",
    "Réception activée",
    "Entrada habilitada",
    "Ingresso abilitato",
    "Entrada habilitada",
    "Empfang aktiv",
    "수신 활성"
  ],
  "期限切れ": [
    "Expired",
    "Expiré",
    "Caducado",
    "Scaduto",
    "Expirado",
    "Abgelaufen",
    "기간 만료"
  ],
  "有効": [
    "Valid",
    "Valide",
    "Válido",
    "Valido",
    "Válido",
    "Gültig",
    "유효"
  ],
  "エンジン緯度範囲外": [
    "Outside engine latitude range",
    "Hors plage de latitude du moteur",
    "Fuera del rango de latitud del motor",
    "Fuori dall’intervallo di latitudine del motore",
    "Fora do intervalo de latitude do motor",
    "Außerhalb des Breitengradbereichs der Engine",
    "엔진 위도 범위 밖"
  ],
  "計算履歴はまだありません。": [
    "No calculations saved yet.",
    "Aucun calcul enregistré.",
    "Todavía no hay cálculos guardados.",
    "Nessun calcolo salvato.",
    "Nenhum cálculo salvo ainda.",
    "Noch keine Berechnungen gespeichert.",
    "계산 이력이 없습니다."
  ],
  "開く": [
    "Open",
    "Ouvrir",
    "Abrir",
    "Apri",
    "Abrir",
    "Öffnen",
    "열기"
  ],
  "複数RXダイバーシティー": [
    "Multiple RX diversity",
    "Diversité RX multiples",
    "Diversidad de múltiples RX",
    "Diversità RX multipli",
    "Diversidade de múltiplos RX",
    "Diversität mit mehreren RX",
    "다중 RX 다이버시티"
  ],
  "地点間予測": [
    "Point-to-point forecast",
    "Prévision point à point",
    "Predicción punto a punto",
    "Previsione punto-punto",
    "Previsão ponto a ponto",
    "Punkt-zu-Punkt-Prognose",
    "지점 간 예측"
  ],
  "保存済みの計算条件と結果を読み込みました。": [
    "Saved conditions and results loaded.",
    "Conditions et résultats enregistrés chargés.",
    "Condiciones y resultados guardados cargados.",
    "Condizioni e risultati salvati caricati.",
    "Condições e resultados salvos carregados.",
    "Gespeicherte Bedingungen und Ergebnisse geladen.",
    "저장된 계산 조건과 결과를 불러왔습니다."
  ],
  "アンテナモデルに従う": [
    "Use antenna model",
    "Selon le modèle d’antenne",
    "Según el modelo de antena",
    "Usa modello antenna",
    "Usar modelo de antena",
    "Antennenmodell verwenden",
    "안테나 모델에 따름"
  ],
  "垂直偏波": [
    "Vertical",
    "Verticale",
    "Vertical",
    "Verticale",
    "Vertical",
    "Vertikal",
    "수직 편파"
  ],
  "水平偏波": [
    "Horizontal",
    "Horizontale",
    "Horizontal",
    "Orizzontale",
    "Horizontal",
    "Horizontal",
    "수평 편파"
  ],
  "右旋円偏波": [
    "Right-hand circular",
    "Circulaire droite",
    "Circular derecha",
    "Circolare destra",
    "Circular à direita",
    "Rechtszirkular",
    "우선회 원편파"
  ],
  "左旋円偏波": [
    "Left-hand circular",
    "Circulaire gauche",
    "Circular izquierda",
    "Circolare sinistra",
    "Circular à esquerda",
    "Linkszirkular",
    "좌선회 원편파"
  ],
  "その他直線偏波": [
    "Other linear",
    "Autre linéaire",
    "Otra lineal",
    "Altra lineare",
    "Outra linear",
    "Sonstige linear",
    "기타 선형 편파"
  ],
  "TX · 偏波": [
    "TX · Polarization",
    "TX · Polarisation",
    "TX · Polarización",
    "TX · Polarizzazione",
    "TX · Polarização",
    "TX · Polarisation",
    "TX·편파"
  ],
  "RX{n} · 偏波": [
    "RX{n} · Polarization",
    "RX{n} · Polarisation",
    "RX{n} · Polarización",
    "RX{n} · Polarizzazione",
    "RX{n} · Polarização",
    "RX{n} · Polarisation",
    "RX{n}·편파"
  ],
  "要求SNRは1 Hz帯域換算値（dB·Hz）です。": [
    "Required SNR is normalized to 1 Hz (dB·Hz).",
    "Le SNR requis est ramené à 1 Hz (dB·Hz).",
    "El SNR requerido está normalizado a 1 Hz (dB·Hz).",
    "Il SNR richiesto è normalizzato a 1 Hz (dB·Hz).",
    "O SNR necessário é normalizado a 1 Hz (dB·Hz).",
    "Das erforderliche SNR ist auf 1 Hz bezogen (dB·Hz).",
    "요구 SNR은 1 Hz 대역 환산값(dB·Hz)입니다."
  ],
  "SNR₁Hz = SNR帯域内 + 10 log₁₀(B [Hz]) → {value} dB·Hz": [
    "SNR₁Hz = SNRin-band + 10 log₁₀(B [Hz]) → {value} dB·Hz",
    "SNR₁Hz = SNRen bande + 10 log₁₀(B [Hz]) → {value} dB·Hz",
    "SNR₁Hz = SNRen banda + 10 log₁₀(B [Hz]) → {value} dB·Hz",
    "SNR₁Hz = SNRin banda + 10 log₁₀(B [Hz]) → {value} dB·Hz",
    "SNR₁Hz = SNRna banda + 10 log₁₀(B [Hz]) → {value} dB·Hz",
    "SNR₁Hz = SNRim Band + 10 log₁₀(B [Hz]) → {value} dB·Hz",
    "SNR₁Hz = 대역 내 SNR + 10 log₁₀(B [Hz]) → {value} dB·Hz"
  ],
  "TX 1局 → RX {n}局（短経路）": [
    "1 TX → {n} RX (short path)",
    "1 TX → {n} RX (trajet court)",
    "1 TX → {n} RX (trayecto corto)",
    "1 TX → {n} RX (percorso breve)",
    "1 TX → {n} RX (trajeto curto)",
    "1 TX → {n} RX (kurzer Pfad)",
    "TX 1국 → RX {n}국(단경로)"
  ],
  "{coords} [有効位置なし]": [
    "{coords} [no valid position]",
    "{coords} [aucune position valide]",
    "{coords} [sin posición válida]",
    "{coords} [nessuna posizione valida]",
    "{coords} [sem posição válida]",
    "{coords} [keine gültige Position]",
    "{coords} [유효 위치 없음]"
  ],
  "{coords} [最新位置に連動]": [
    "{coords} [tracks latest position]",
    "{coords} [suivi de la dernière position]",
    "{coords} [sigue la última posición]",
    "{coords} [segue l’ultima posizione]",
    "{coords} [segue a última posição]",
    "{coords} [folgt letzter Position]",
    "{coords} [최신 위치 연동]"
  ],
  "{name}（移動局）": [
    "{name} (mobile)",
    "{name} (mobile)",
    "{name} (móvil)",
    "{name} (mobile)",
    "{name} (móvel)",
    "{name} (mobil)",
    "{name}(이동국)"
  ],
  "{month}月": [
    "Month {month}",
    "Mois {month}",
    "Mes {month}",
    "Mese {month}",
    "Mês {month}",
    "Monat {month}",
    "{month}월"
  ],
  "RXは1〜8局にしてください。": [
    "RX count must be 1–8.",
    "Le nombre de RX doit être de 1 à 8.",
    "El número de RX debe ser de 1 a 8.",
    "Il numero di RX deve essere da 1 a 8.",
    "O número de RX deve ser de 1 a 8.",
    "Die RX-Anzahl muss 1–8 sein.",
    "RX는 1~8국이어야 합니다."
  ],
  "地点とアンテナのプリセットを選択してください。削除されたプリセットは再選択が必要です。": [
    "Select location and antenna presets. Reselect deleted presets.",
    "Choisir les lieux et antennes. Remplacer les préréglages supprimés.",
    "Seleccione ubicaciones y antenas. Vuelva a elegir los preajustes eliminados.",
    "Seleziona località e antenne. Riseleziona le preimpostazioni eliminate.",
    "Selecione locais e antenas. Selecione novamente as predefinições excluídas.",
    "Standort- und Antennenvorlagen wählen. Gelöschte Vorlagen neu auswählen.",
    "지점과 안테나 프리셋을 선택하세요. 삭제된 프리셋은 다시 선택해야 합니다."
  ],
  "{name}の有効な最新位置がありません。ゲートウェイの受信状態を確認してください。": [
    "No valid current position for {name}. Check gateway reception.",
    "Aucune position actuelle valide pour {name}. Vérifier la réception de la passerelle.",
    "No hay posición actual válida para {name}. Compruebe la recepción de la pasarela.",
    "Nessuna posizione attuale valida per {name}. Verifica la ricezione del gateway.",
    "Nenhuma posição atual válida para {name}. Verifique a recepção do gateway.",
    "Keine gültige aktuelle Position für {name}. Gateway-Empfang prüfen.",
    "{name}의 유효한 최신 위치가 없습니다. 게이트웨이 수신 상태를 확인하세요."
  ],
  "受信局を選択してください。": [
    "Select a received station.",
    "Choisir une station reçue.",
    "Seleccione una estación recibida.",
    "Seleziona una stazione ricevuta.",
    "Selecione uma estação recebida.",
    "Eine empfangene Station auswählen.",
    "수신국을 선택하세요."
  ],
  "別の画面で変更されています。一覧を再読込してから保存してください。": [
    "Changed in another view. Reload, reopen the editor and save.",
    "Modifié ailleurs. Recharger, rouvrir l’éditeur et enregistrer.",
    "Modificado en otra vista. Recargue, abra el editor y guarde.",
    "Modificato altrove. Ricarica, riapri l’editor e salva.",
    "Alterado em outra tela. Recarregue, reabra o editor e salve.",
    "In anderer Ansicht geändert. Neu laden, Editor erneut öffnen und speichern.",
    "다른 화면에서 변경되었습니다. 목록을 다시 불러오고 편집을 다시 열어 저장하세요."
  ],
  "同じ局名が登録されています": [
    "A preset with this name already exists",
    "Un préréglage de ce nom existe déjà",
    "Ya existe un preajuste con ese nombre",
    "Esiste già una preimpostazione con questo nome",
    "Já existe uma predefinição com este nome",
    "Eine Vorlage mit diesem Namen existiert bereits",
    "같은 이름의 프리셋이 이미 있습니다"
  ],
  "位置一覧を取得できません: {error}": [
    "Could not fetch positions: {error}",
    "Impossible de charger les positions : {error}",
    "No se pudieron obtener las posiciones: {error}",
    "Impossibile ottenere le posizioni: {error}",
    "Não foi possível obter as posições: {error}",
    "Positionen konnten nicht geladen werden: {error}",
    "위치 목록을 가져올 수 없습니다: {error}"
  ],
  "ゲートウェイ接続済 · {n}局 · 有効期限 {age}秒 · 外部受信 {state} · 取得 {time}": [
    "Gateway connected · {n} stations · TTL {age}s · External input {state} · Fetched {time}",
    "Passerelle connectée · {n} stations · TTL {age}s · Entrée externe {state} · Chargé {time}",
    "Pasarela conectada · {n} estaciones · TTL {age}s · Entrada externa {state} · Obtenido {time}",
    "Gateway connesso · {n} stazioni · TTL {age}s · Ingresso esterno {state} · Scaricato {time}",
    "Gateway conectado · {n} estações · TTL {age}s · Entrada externa {state} · Obtido {time}",
    "Gateway verbunden · {n} Stationen · TTL {age}s · Externer Eingang {state} · Abgerufen {time}",
    "게이트웨이 연결됨·{n}국·유효 기간 {age}초·외부 수신 {state}·가져온 시각 {time}"
  ],
  "無効": [
    "Disabled",
    "Désactivé",
    "Desactivado",
    "Disabilitato",
    "Desativado",
    "Deaktiviert",
    "비활성"
  ],
  "有効位置なし": [
    "No valid position",
    "Aucune position valide",
    "Sin posición válida",
    "Nessuna posizione valida",
    "Sem posição válida",
    "Keine gültige Position",
    "유효 위치 없음"
  ],
  "最新位置に連動": [
    "Tracks latest position",
    "Suit la dernière position",
    "Sigue la última posición",
    "Segue l’ultima posizione",
    "Segue a última posição",
    "Folgt letzter Position",
    "최신 위치 연동"
  ],
  "時刻不明": [
    "Unknown time",
    "Heure inconnue",
    "Hora desconocida",
    "Ora sconosciuta",
    "Hora desconhecida",
    "Unbekannte Zeit",
    "시각 불명"
  ],
  "不明": [
    "Unknown",
    "Inconnu",
    "Desconocido",
    "Sconosciuto",
    "Desconhecido",
    "Unbekannt",
    "불명"
  ],
  "データ未取得": [
    "No data fetched",
    "Données non chargées",
    "Sin datos obtenidos",
    "Dati non scaricati",
    "Dados não obtidos",
    "Keine Daten abgerufen",
    "데이터 미수신"
  ],
  "古い／取得失敗": [
    "Stale / fetch failed",
    "Ancien / échec du chargement",
    "Antiguo / error de obtención",
    "Obsoleto / scaricamento fallito",
    "Antigo / falha na obtenção",
    "Veraltet / Abruf fehlgeschlagen",
    "오래됨·가져오기 실패"
  ],
  "取得済": [
    "Fetched",
    "Chargé",
    "Obtenido",
    "Scaricato",
    "Obtido",
    "Abgerufen",
    "가져옴"
  ],
  "観測時刻 UTC": [
    "Observation time UTC",
    "Heure d’observation UTC",
    "Hora de observación UTC",
    "Ora di osservazione UTC",
    "Hora de observação UTC",
    "Beobachtungszeit UTC",
    "관측 시각 UTC"
  ],
  "垂直MUF（foF2相当）MHz": [
    "Vertical MUF (foF2) MHz",
    "MUF verticale (foF2) MHz",
    "MUF vertical (foF2) MHz",
    "MUF verticale (foF2) MHz",
    "MUF vertical (foF2) MHz",
    "Vertikale MUF (foF2) MHz",
    "수직 MUF(foF2) MHz"
  ],
  "参考LUF MHz": [
    "Reference LUF MHz",
    "LUF de référence MHz",
    "LUF de referencia MHz",
    "LUF di riferimento MHz",
    "LUF de referência MHz",
    "Referenz-LUF MHz",
    "참고 LUF MHz"
  ],
  "参考MUF MHz": [
    "Reference MUF MHz",
    "MUF de référence MHz",
    "MUF de referencia MHz",
    "MUF di riferimento MHz",
    "MUF de referência MHz",
    "Referenz-MUF MHz",
    "참고 MUF MHz"
  ],
  "foF2限定符": [
    "foF2 qualifier",
    "Qualificateur foF2",
    "Calificador foF2",
    "Qualificatore foF2",
    "Qualificador foF2",
    "foF2-Kennzeichen",
    "foF2 한정자"
  ],
  "MUF限定符": [
    "MUF qualifier",
    "Qualificateur MUF",
    "Calificador MUF",
    "Qualificatore MUF",
    "Qualificador MUF",
    "MUF-Kennzeichen",
    "MUF 한정자"
  ],
  "VOACAP計算後、選択時刻の回線MUFをここに併記します。": [
    "After calculation, the selected-hour link MUF appears here.",
    "Après calcul, la MUF de liaison à l’heure choisie apparaît ici.",
    "Tras calcular, aquí aparece la MUF del enlace a la hora seleccionada.",
    "Dopo il calcolo appare qui la MUF del collegamento all’ora scelta.",
    "Após calcular, a MUF do enlace na hora selecionada aparece aqui.",
    "Nach der Berechnung erscheint hier die Verbindungs-MUF zur gewählten Stunde.",
    "VOACAP 계산 후 선택 시각의 경로 MUF를 여기에 표시합니다."
  ],
  "国内観測とD-RAPを取得中…": [
    "Fetching Japan observations and D-RAP…",
    "Chargement des observations japonaises et D-RAP…",
    "Obteniendo observaciones de Japón y D-RAP…",
    "Scaricamento osservazioni del Giappone e D-RAP…",
    "Obtendo observações do Japão e D-RAP…",
    "Japanische Messungen und D-RAP werden abgerufen…",
    "일본 관측·D-RAP 가져오는 중…"
  ],
  "海外観測を取得中…": [
    "Fetching international observations…",
    "Chargement des observations internationales…",
    "Obteniendo observaciones internacionales…",
    "Scaricamento osservazioni internazionali…",
    "Obtendo observações internacionais…",
    "Internationale Messungen werden abgerufen…",
    "해외 관측 가져오는 중…"
  ],
  "観測局を変更しました。海外観測を取得してください。": [
    "Station changed. Fetch international observations.",
    "Station modifiée. Charger les observations internationales.",
    "Estación cambiada. Obtenga observaciones internacionales.",
    "Stazione cambiata. Scarica osservazioni internazionali.",
    "Estação alterada. Obtenha observações internacionais.",
    "Station geändert. Internationale Messungen abrufen.",
    "관측소를 변경했습니다. 해외 관측을 가져오세요."
  ],
  "対象局の観測は欠測です。": [
    "No observations for this station.",
    "Aucune observation pour cette station.",
    "No hay observaciones para esta estación.",
    "Nessuna osservazione per questa stazione.",
    "Sem observações para esta estação.",
    "Keine Messungen für diese Station.",
    "해당 관측소 데이터가 결측입니다."
  ],
  "D-RAPは期限切れです。現在の経路付近の参考値は表示できません。": [
    "D-RAP expired. Current route reference values are unavailable.",
    "D-RAP expiré. Références actuelles du trajet indisponibles.",
    "D-RAP caducado. No hay referencias actuales de la ruta.",
    "D-RAP scaduto. Riferimenti attuali del percorso non disponibili.",
    "D-RAP expirado. Referências atuais do trajeto indisponíveis.",
    "D-RAP abgelaufen. Keine aktuellen Pfadreferenzwerte.",
    "D-RAP이 만료되어 현재 경로 참고값을 표시할 수 없습니다."
  ],
  "経路付近のD-RAPは欠測です。": [
    "D-RAP near the route is missing.",
    "D-RAP manquant près du trajet.",
    "Faltan datos D-RAP cerca de la ruta.",
    "D-RAP mancante vicino al percorso.",
    "D-RAP ausente perto do trajeto.",
    "D-RAP nahe dem Pfad fehlt.",
    "경로 부근의 D-RAP이 결측입니다."
  ],
  "地点を正しく入力すると経路付近の格子を参照できます。": [
    "Select valid locations to sample the route grid.",
    "Choisir des lieux valides pour échantillonner le trajet.",
    "Seleccione ubicaciones válidas para consultar la cuadrícula.",
    "Seleziona località valide per campionare la griglia.",
    "Selecione locais válidos para consultar a grade.",
    "Gültige Standorte für die Pfadabtastung wählen.",
    "유효한 지점을 선택하면 경로 격자를 참조할 수 있습니다."
  ],
  "この経路のサンプリングはできません。": [
    "This route cannot be sampled.",
    "Ce trajet ne peut pas être échantillonné.",
    "No se puede muestrear esta ruta.",
    "Questo percorso non può essere campionato.",
    "Este trajeto não pode ser amostrado.",
    "Dieser Pfad kann nicht abgetastet werden.",
    "이 경로를 샘플링할 수 없습니다."
  ],
  "GIRO接続は無効です。利用条件に適合する環境でHF_GIRO_ENABLED=1を設定して再起動すると、海外観測を取得できます。": [
    "GIRO is disabled. In a compliant environment, set HF_GIRO_ENABLED=1 and restart.",
    "GIRO est désactivé. Dans un environnement conforme, définir HF_GIRO_ENABLED=1 et redémarrer.",
    "GIRO está desactivado. En un entorno conforme, defina HF_GIRO_ENABLED=1 y reinicie.",
    "GIRO è disabilitato. In un ambiente conforme, imposta HF_GIRO_ENABLED=1 e riavvia.",
    "GIRO está desativado. Em ambiente compatível, defina HF_GIRO_ENABLED=1 e reinicie.",
    "GIRO ist deaktiviert. In einer zulässigen Umgebung HF_GIRO_ENABLED=1 setzen und neu starten.",
    "GIRO가 비활성화되었습니다. 이용 조건에 맞는 환경에서 HF_GIRO_ENABLED=1로 설정한 후 재시작하세요."
  ],
  "NOAAデータを取得中…": [
    "Fetching NOAA data…",
    "Chargement des données NOAA…",
    "Obteniendo datos NOAA…",
    "Scaricamento dati NOAA…",
    "Obtendo dados NOAA…",
    "NOAA-Daten werden abgerufen…",
    "NOAA 데이터 가져오는 중…"
  ],
  "対象年月が変わりました。取得・表示で更新してください。": [
    "Target month changed. Fetch again to update.",
    "Mois cible modifié. Charger à nouveau.",
    "Mes objetivo cambiado. Obtenga los datos de nuevo.",
    "Mese obiettivo cambiato. Scarica di nuovo.",
    "Mês alvo alterado. Obtenha novamente.",
    "Zielmonat geändert. Zum Aktualisieren erneut abrufen.",
    "대상 연월이 변경되었습니다. 다시 가져오세요."
  ],
  "最良サイト": [
    "Best site",
    "Meilleur site",
    "Mejor sitio",
    "Sito migliore",
    "Melhor local",
    "Bester Standort",
    "최적 사이트"
  ],
  "追加偏波損失": [
    "Additional polarization loss",
    "Perte de polarisation supplémentaire",
    "Pérdida adicional de polarización",
    "Perdita di polarizzazione aggiuntiva",
    "Perda adicional de polarização",
    "Zusätzlicher Polarisationsverlust",
    "추가 편파 손실"
  ],
  "入力条件は計算時点の値": [
    "Conditions at calculation time",
    "Conditions au moment du calcul",
    "Condiciones al calcular",
    "Condizioni al momento del calcolo",
    "Condições no momento do cálculo",
    "Bedingungen zum Berechnungszeitpunkt",
    "계산 시점의 조건"
  ],
  "SSN手動入力": [
    "Manual SSN",
    "SSN manuel",
    "SSN manual",
    "SSN manuale",
    "SSN manual",
    "Manuelle SSN",
    "SSN 수동 입력"
  ],
  "NOAA平滑SSN": [
    "NOAA smoothed SSN",
    "SSN lissé NOAA",
    "SSN suavizado NOAA",
    "SSN smussato NOAA",
    "SSN suavizado NOAA",
    "Geglättete NOAA-SSN",
    "NOAA 평활 SSN"
  ],
  "要求SNR": [
    "Required SNR",
    "SNR requis",
    "SNR requerido",
    "SNR richiesto",
    "SNR necessário",
    "Erforderliches SNR",
    "요구 SNR"
  ],
  "目標REL": [
    "Target REL",
    "REL cible",
    "REL objetivo",
    "REL obiettivo",
    "REL alvo",
    "Ziel-REL",
    "목표 REL"
  ],
  "表示は計算時点の条件です。": [
    "Conditions at calculation time.",
    "Conditions au moment du calcul.",
    "Condiciones al calcular.",
    "Condizioni al momento del calcolo.",
    "Condições no momento do cálculo.",
    "Bedingungen zum Berechnungszeitpunkt.",
    "계산 시점의 조건입니다."
  ],
  "観測平滑値": [
    "Observed smoothed value",
    "Valeur lissée observée",
    "Valor suavizado observado",
    "Valore smussato osservato",
    "Valor suavizado observado",
    "Beobachteter geglätteter Wert",
    "관측 평활값"
  ],
  "予測平滑値": [
    "Predicted smoothed value",
    "Valeur lissée prévue",
    "Valor suavizado previsto",
    "Valore smussato previsto",
    "Valor suavizado previsto",
    "Vorhergesagter geglätteter Wert",
    "예측 평활값"
  ],
  "対象月データなし": [
    "No target-month data",
    "Aucune donnée du mois cible",
    "Sin datos del mes objetivo",
    "Nessun dato del mese obiettivo",
    "Sem dados do mês alvo",
    "Keine Daten für den Zielmonat",
    "대상 월 데이터 없음"
  ],
  "平滑SSN": [
    "Smoothed SSN",
    "SSN lissé",
    "SSN suavizado",
    "SSN smussato",
    "SSN suavizado",
    "Geglättete SSN",
    "평활 SSN"
  ],
  "現在": [
    "Current",
    "Actuel",
    "Actual",
    "Attuale",
    "Atual",
    "Aktuell",
    "현재"
  ],
  "観測": [
    "Observed",
    "Observation",
    "Observado",
    "Osservato",
    "Observado",
    "Beobachtet",
    "관측"
  ],
  "取得": [
    "Fetched",
    "Chargé",
    "Obtenido",
    "Scaricato",
    "Obtido",
    "Abgerufen",
    "가져옴"
  ],
  "出典": [
    "Source",
    "Source",
    "Fuente",
    "Fonte",
    "Fonte",
    "Quelle",
    "출처"
  ],
  "古い": [
    "Stale",
    "Ancien",
    "Antiguo",
    "Obsoleto",
    "Antigo",
    "Veraltet",
    "오래됨"
  ],
  "下限": [
    "Lower bound",
    "Borne inférieure",
    "Límite inferior",
    "Limite inferiore",
    "Limite inferior",
    "Untergrenze",
    "하한"
  ],
  "上限不明（欠測あり）": [
    "Upper bound unknown (missing data)",
    "Borne supérieure inconnue (données manquantes)",
    "Límite superior desconocido (faltan datos)",
    "Limite superiore ignoto (dati mancanti)",
    "Limite superior desconhecido (dados ausentes)",
    "Obergrenze unbekannt (fehlende Daten)",
    "상한 불명(결측 있음)"
  ],
  "別の計算を実行中です。完了後に再実行してください。": [
    "Another calculation is running. Retry when complete.",
    "Un autre calcul est en cours. Réessayer à la fin.",
    "Hay otro cálculo en curso. Reintente al finalizar.",
    "Un altro calcolo è in corso. Riprova al termine.",
    "Outro cálculo está em execução. Tente após concluir.",
    "Eine andere Berechnung läuft. Danach erneut versuchen.",
    "다른 계산이 실행 중입니다. 완료 후 다시 시도하세요."
  ],
  "送受信地点を1 km以上離してください": [
    "TX and RX must be at least 1 km apart",
    "TX et RX doivent être distants d’au moins 1 km",
    "TX y RX deben estar separados al menos 1 km",
    "TX e RX devono distare almeno 1 km",
    "TX e RX devem estar separados por pelo menos 1 km",
    "TX und RX müssen mindestens 1 km auseinanderliegen",
    "송수신 지점은 1 km 이상 떨어져 있어야 합니다"
  ],
  "{key}: {low}〜{high}の範囲で入力してください": [
    "{key}: enter a value between {low} and {high}",
    "{key} : saisir une valeur entre {low} et {high}",
    "{key}: introduzca un valor entre {low} y {high}",
    "{key}: inserisci un valore tra {low} e {high}",
    "{key}: insira um valor entre {low} e {high}",
    "{key}: Wert zwischen {low} und {high} eingeben",
    "{key}: {low}~{high} 범위의 값을 입력하세요"
  ],
  "{key}: 数値を入力してください": [
    "{key}: enter a number",
    "{key} : saisir un nombre",
    "{key}: introduzca un número",
    "{key}: inserisci un numero",
    "{key}: insira um número",
    "{key}: Zahl eingeben",
    "{key}: 숫자를 입력하세요"
  ],
  "{key}: 設定値が不正です": [
    "{key}: invalid option",
    "{key} : option invalide",
    "{key}: opción no válida",
    "{key}: opzione non valida",
    "{key}: opção inválida",
    "{key}: ungültige Option",
    "{key}: 잘못된 설정값"
  ],
  "{source}/{id}の受信形式を保存しました。": [
    "Input format saved for {source}/{id}.",
    "Format d’entrée enregistré pour {source}/{id}.",
    "Formato guardado para {source}/{id}.",
    "Formato salvato per {source}/{id}.",
    "Formato salvo para {source}/{id}.",
    "Eingangsformat für {source}/{id} gespeichert.",
    "{source}/{id}의 수신 형식을 저장했습니다."
  ],
  "{name}：地点プリセットから選択できます。": [
    "{name}: select from location presets.",
    "{name} : choisir dans les préréglages des lieux.",
    "{name}: seleccione desde los preajustes de ubicaciones.",
    "{name}: seleziona dalle preimpostazioni località.",
    "{name}: selecione nas predefinições de locais.",
    "{name}: aus Standortvorlagen auswählen.",
    "{name}: 지점 프리셋에서 선택할 수 있습니다."
  ],
  "エンジンが未準備です。": [
    "Engine not ready.",
    "Moteur non prêt.",
    "Motor no disponible.",
    "Motore non pronto.",
    "Motor não pronto.",
    "Engine nicht bereit.",
    "엔진 준비가 안 됐습니다."
  ],
  "地図の陸域データを読み込めませんでした。地点プリセットの選択は利用できます。": [
    "Land map could not be loaded. Location presets remain available.",
    "Carte terrestre non chargée. Les préréglages des lieux restent disponibles.",
    "No se pudo cargar el mapa. Los preajustes siguen disponibles.",
    "Impossibile caricare la mappa. Le preimpostazioni restano disponibili.",
    "Não foi possível carregar o mapa. Predefinições continuam disponíveis.",
    "Landkarte konnte nicht geladen werden. Standortvorlagen sind weiter verfügbar.",
    "육지 지도를 불러오지 못했습니다. 지점 프리셋은 사용할 수 있습니다."
  ],
  "計算エンジンが未準備です。Dockerで起動してください。": [
    "Engine not ready. Start the Docker app.",
    "Moteur non prêt. Démarrer l’application Docker.",
    "Motor no disponible. Inicie la aplicación Docker.",
    "Motore non pronto. Avvia l’app Docker.",
    "Motor não pronto. Inicie o aplicativo Docker.",
    "Engine nicht bereit. Docker-App starten.",
    "엔진 준비가 안 됐습니다. Docker 앱을 시작하세요."
  ],
  "サーバーに接続できません。Dockerの起動状態を確認してください。": [
    "Cannot reach server. Check Docker is running.",
    "Serveur inaccessible. Vérifier Docker.",
    "No se puede acceder al servidor. Compruebe Docker.",
    "Server non raggiungibile. Verifica Docker.",
    "Não foi possível acessar o servidor. Verifique o Docker.",
    "Server nicht erreichbar. Docker-Status prüfen.",
    "서버에 연결할 수 없습니다. Docker 실행 상태를 확인하세요."
  ],
  "{freq} MHz / {hour}:00 UTC / {count}地点 · TX中心の範囲を区画ごとにRELの色で表示（0〜100%）、灰色は計算値なし": [
    "{freq} MHz / {hour}:00 UTC / {count} points · Area around the TX, each cell colored by REL 0–100%; gray: no value",
    "{freq} MHz / {hour}:00 UTC / {count} points · Zone autour du TX, cases colorées par REL 0–100 % ; gris : absent",
    "{freq} MHz / {hour}:00 UTC / {count} puntos · Zona alrededor del TX, celdas por REL 0–100%; gris: sin valor",
    "{freq} MHz / {hour}:00 UTC / {count} punti · Area attorno al TX, celle per REL 0–100%; grigio: nessun valore",
    "{freq} MHz / {hour}:00 UTC / {count} pontos · Área em torno do TX, células por REL 0–100%; cinza: sem valor",
    "{freq} MHz / {hour}:00 UTC / {count} Punkte · Gebiet um den TX, Zellen nach REL 0–100 %; Grau: kein Wert",
    "{freq} MHz / {hour}:00 UTC / {count}개 지점·TX 중심 범위를 구획별 REL 색으로 표시(0~100%), 회색: 값 없음"
  ],
  "{count}サイト。": [
    "{count} sites.",
    "{count} sites.",
    "{count} sitios.",
    "{count} siti.",
    "{count} locais.",
    "{count} Standorte.",
    "{count}개 사이트."
  ],
  "短経路付近の格子を{count}点参照：HAFの最大 {max} MHz（欠測 {missing}点）。これは垂直伝搬の指標で、指定回線の損失・使用可能周波数判定ではありません。": [
    "{count} route samples: maximum HAF {max} MHz, {missing} missing. Vertical indicator only; not link loss or a usable-frequency decision.",
    "{count} points : HAF maximal {max} MHz, {missing} manquants. Indicateur vertical uniquement, pas une perte de liaison ni une décision de fréquence utilisable.",
    "{count} muestras: HAF máximo {max} MHz, {missing} ausentes. Solo indicador vertical; no es pérdida ni decisión de frecuencia utilizable.",
    "{count} campioni: HAF massimo {max} MHz, {missing} mancanti. Solo indicatore verticale, non perdita né decisione sulla frequenza utilizzabile.",
    "{count} amostras: HAF máximo {max} MHz, {missing} ausentes. Apenas indicador vertical, não perda nem decisão de frequência utilizável.",
    "{count} Pfadpunkte: maximale HAF {max} MHz, {missing} fehlend. Nur Vertikalindikator, keine Pfaddämpfung oder Nutzfrequenzentscheidung.",
    "경로 {count}점: 최대 HAF {max} MHz, 결측 {missing}점. 수직 전파 지표이며 경로 손실·사용 가능 주파수 판정이 아닙니다."
  ],
  "RELは各UTC・周波数の月間統計です。推奨サイトはREL最大（同値ならSNR最大）。少なくとも1サイト受信の上下限は各サイトRELを周辺確率とみなした理論範囲で、実測可用性ではありません。サイト間相関・共通障害・中継回線・切替遅延・受信機故障はモデル化していません。距離だけで独立とは判断しません。波形合成や合成SNR、リアルタイム切替制御は行いません。": [
    "REL is a monthly statistic for each UTC hour and frequency. Site choice maximizes REL, then SNR. Bounds for reception at one or more sites use site REL values as marginal probabilities; they are not measured availability. Site correlation, common outages, backhaul, switching delay and receiver failures are not modeled. Distance does not establish independence. No waveform/SNR combining or real-time switching is performed.",
    "REL est une statistique mensuelle par heure UTC et fréquence. Le choix maximise REL puis SNR. Les bornes pour au moins un site utilisent les REL comme probabilités marginales, pas comme disponibilité mesurée. Corrélations, pannes communes, collecte, délais de commutation et défaillances des récepteurs ne sont pas modélisés. La distance ne prouve pas l’indépendance. Aucune combinaison de signaux/SNR ni commutation en temps réel.",
    "REL es una estadística mensual por hora UTC y frecuencia. Se maximiza REL y después SNR. Los límites para al menos un sitio usan REL como probabilidades marginales, no disponibilidad medida. No se modelan correlación, fallos comunes, retorno, retardo de conmutación ni fallos de receptores. La distancia no demuestra independencia. No hay combinación de señales/SNR ni conmutación en tiempo real.",
    "REL è una statistica mensile per ora UTC e frequenza. La selezione massimizza REL, poi SNR. I limiti per almeno un sito usano REL come probabilità marginali, non disponibilità misurata. Correlazione, guasti comuni, collegamento di ritorno, ritardi di commutazione e guasti dei ricevitori non sono modellati. La distanza non dimostra indipendenza. Nessuna combinazione di segnali/SNR o commutazione in tempo reale.",
    "REL é uma estatística mensal por hora UTC e frequência. A seleção maximiza REL, depois SNR. Os limites para pelo menos um local usam REL como probabilidades marginais, não disponibilidade medida. Correlação, falhas comuns, retorno, atraso de comutação e falhas dos receptores não são modelados. Distância não demonstra independência. Sem combinação de sinais/SNR ou comutação em tempo real.",
    "REL ist eine Monatsstatistik je UTC-Stunde und Frequenz. Die Auswahl maximiert REL, dann SNR. Grenzen für mindestens einen Standort behandeln Standort-REL als Randwahrscheinlichkeiten, nicht als gemessene Verfügbarkeit. Korrelation, gemeinsame Ausfälle, Backhaul, Umschaltverzögerung und Empfängerausfälle sind nicht modelliert. Entfernung beweist keine Unabhängigkeit. Keine Signal-/SNR-Kombination oder Echtzeitumschaltung.",
    "REL은 UTC 시각·주파수별 월간 통계입니다. REL 최대, 동률이면 SNR 최대 사이트를 선택합니다. 최소 한 사이트 수신 범위는 각 REL을 주변 확률로 간주한 이론값이며 실측 가용성이 아닙니다. 사이트 상관·공통 장애·중계 회선·전환 지연·수신기 고장은 모델링하지 않습니다. 거리만으로 독립성을 판단하지 않으며 파형·SNR 합성 및 실시간 전환은 하지 않습니다."
  ],
  "送受信地点と短経路の世界地図。ドラッグで表示移動、ホイールで拡大縮小。": [
    "World map of TX/RX and short paths. Drag to pan; use the wheel to zoom.",
    "Carte mondiale des TX/RX et trajets courts. Glisser pour déplacer, molette pour zoomer.",
    "Mapa mundial de TX/RX y trayectos cortos. Arrastre para mover; rueda para ampliar.",
    "Mappa mondiale di TX/RX e percorsi brevi. Trascina per spostare; rotella per lo zoom.",
    "Mapa mundial de TX/RX e trajetos curtos. Arraste para mover; roda para ampliar.",
    "Weltkarte von TX/RX und kurzen Pfaden. Ziehen zum Verschieben, Mausrad zum Zoomen.",
    "TX/RX 및 단경로 세계 지도. 드래그로 이동하고 휠로 확대·축소합니다."
  ],
  "東京": [
    "Tokyo",
    "Tokyo",
    "Tokio",
    "Tokyo",
    "Tóquio",
    "Tokio",
    "도쿄"
  ],
  "大阪": [
    "Osaka",
    "Osaka",
    "Osaka",
    "Osaka",
    "Osaka",
    "Osaka",
    "오사카"
  ],
  "ソウル": [
    "Seoul",
    "Séoul",
    "Seúl",
    "Seul",
    "Seul",
    "Seoul",
    "서울"
  ],
  "北京": [
    "Beijing",
    "Pékin",
    "Pekín",
    "Pechino",
    "Pequim",
    "Peking",
    "베이징"
  ],
  "上海": [
    "Shanghai",
    "Shanghai",
    "Shanghái",
    "Shanghai",
    "Xangai",
    "Shanghai",
    "상하이"
  ],
  "台北": [
    "Taipei",
    "Taipei",
    "Taipéi",
    "Taipei",
    "Taipé",
    "Taipeh",
    "타이베이"
  ],
  "香港": [
    "Hong Kong",
    "Hong Kong",
    "Hong Kong",
    "Hong Kong",
    "Hong Kong",
    "Hongkong",
    "홍콩"
  ],
  "ニューヨーク": [
    "New York",
    "New York",
    "Nueva York",
    "New York",
    "Nova Iorque",
    "New York",
    "뉴욕"
  ],
  "ワシントンDC": [
    "Washington DC",
    "Washington DC",
    "Washington DC",
    "Washington DC",
    "Washington DC",
    "Washington DC",
    "워싱턴 DC"
  ],
  "ロサンゼルス": [
    "Los Angeles",
    "Los Angeles",
    "Los Ángeles",
    "Los Angeles",
    "Los Angeles",
    "Los Angeles",
    "로스앤젤레스"
  ],
  "サンフランシスコ": [
    "San Francisco",
    "San Francisco",
    "San Francisco",
    "San Francisco",
    "São Francisco",
    "San Francisco",
    "샌프란시스코"
  ],
  "シアトル": [
    "Seattle",
    "Seattle",
    "Seattle",
    "Seattle",
    "Seattle",
    "Seattle",
    "시애틀"
  ],
  "トロント": [
    "Toronto",
    "Toronto",
    "Toronto",
    "Toronto",
    "Toronto",
    "Toronto",
    "토론토"
  ],
  "バンクーバー": [
    "Vancouver",
    "Vancouver",
    "Vancouver",
    "Vancouver",
    "Vancouver",
    "Vancouver",
    "밴쿠버"
  ],
  "メキシコシティ": [
    "Mexico City",
    "Mexico",
    "Ciudad de México",
    "Città del Messico",
    "Cidade do México",
    "Mexiko-Stadt",
    "멕시코시티"
  ],
  "ロンドン": [
    "London",
    "Londres",
    "Londres",
    "Londra",
    "Londres",
    "London",
    "런던"
  ],
  "パリ": [
    "Paris",
    "Paris",
    "París",
    "Parigi",
    "Paris",
    "Paris",
    "파리"
  ],
  "ベルリン": [
    "Berlin",
    "Berlin",
    "Berlín",
    "Berlino",
    "Berlim",
    "Berlin",
    "베를린"
  ],
  "ローマ": [
    "Rome",
    "Rome",
    "Roma",
    "Roma",
    "Roma",
    "Rom",
    "로마"
  ],
  "マドリード": [
    "Madrid",
    "Madrid",
    "Madrid",
    "Madrid",
    "Madri",
    "Madrid",
    "마드리드"
  ],
  "ブリュッセル": [
    "Brussels",
    "Bruxelles",
    "Bruselas",
    "Bruxelles",
    "Bruxelas",
    "Brüssel",
    "브뤼셀"
  ],
  "ヘルシンキ": [
    "Helsinki",
    "Helsinki",
    "Helsinki",
    "Helsinki",
    "Helsinque",
    "Helsinki",
    "헬싱키"
  ],
  "ストックホルム": [
    "Stockholm",
    "Stockholm",
    "Estocolmo",
    "Stoccolma",
    "Estocolmo",
    "Stockholm",
    "스톡홀름"
  ],
  "横須賀": [
    "Yokosuka",
    "Yokosuka",
    "Yokosuka",
    "Yokosuka",
    "Yokosuka",
    "Yokosuka",
    "요코스카"
  ],
  "那覇": [
    "Naha",
    "Naha",
    "Naha",
    "Naha",
    "Naha",
    "Naha",
    "나하"
  ],
  "父島": [
    "Chichijima",
    "Chichijima",
    "Chichijima",
    "Chichijima",
    "Chichijima",
    "Chichijima",
    "지치지마"
  ],
  "グアム": [
    "Guam",
    "Guam",
    "Guam",
    "Guam",
    "Guam",
    "Guam",
    "괌"
  ],
  "ホノルル": [
    "Honolulu",
    "Honolulu",
    "Honolulu",
    "Honolulu",
    "Honolulu",
    "Honolulu",
    "호놀룰루"
  ],
  "シンガポール": [
    "Singapore",
    "Singapour",
    "Singapur",
    "Singapore",
    "Singapura",
    "Singapur",
    "싱가포르"
  ],
  "シドニー": [
    "Sydney",
    "Sydney",
    "Sídney",
    "Sydney",
    "Sydney",
    "Sydney",
    "시드니"
  ],
  "地点を設定してから計算してください。": [
    "Select locations before calculating.",
    "Choisir les lieux avant de calculer.",
    "Seleccione ubicaciones antes de calcular.",
    "Seleziona le località prima del calcolo.",
    "Selecione locais antes de calcular.",
    "Vor der Berechnung Standorte auswählen.",
    "계산 전에 지점을 선택하세요."
  ],
  "偏波方式": [
    "Polarization",
    "Polarisation",
    "Polarización",
    "Polarizzazione",
    "Polarização",
    "Polarisation",
    "편파 방식"
  ],
  "表示指標": [
    "Display metric",
    "Indicateur affiché",
    "Indicador mostrado",
    "Indicatore visualizzato",
    "Indicador apresentado",
    "Anzeigemetrik",
    "표시 지표"
  ],
  "SVG出力": [
    "Export SVG",
    "Exporter SVG",
    "Exportar SVG",
    "Esporta SVG",
    "Exportar SVG",
    "SVG exportieren",
    "SVG 내보내기"
  ],
  "セルは計算した周波数・UTC時刻の離散値です。周波数の間は補間しません。MUFは選択した経路のエンジン出力で、使用可能周波数や通信成功を保証する線ではありません。": [
    "Cells show discrete calculated frequencies and UTC hours without frequency interpolation. MUF is the engine output for the selected path; it does not guarantee a usable frequency or successful communication.",
    "Les cellules représentent les fréquences et heures UTC calculées, sans interpolation fréquentielle. La MUF est fournie par le moteur pour le trajet choisi ; elle ne garantit ni fréquence utilisable ni communication réussie.",
    "Las celdas muestran frecuencias y horas UTC calculadas, sin interpolar frecuencias. La MUF es la salida del motor para el trayecto elegido; no garantiza una frecuencia utilizable ni una comunicación correcta.",
    "Le celle mostrano frequenze e ore UTC calcolate, senza interpolazione delle frequenze. La MUF è l'uscita del motore per il percorso scelto; non garantisce frequenze utilizzabili o comunicazioni riuscite.",
    "As células mostram frequências e horas UTC calculadas, sem interpolação de frequência. A MUF é a saída do motor para o percurso escolhido; não garante frequência utilizável nem comunicação bem-sucedida.",
    "Zellen zeigen berechnete Frequenzen und UTC-Stunden ohne Frequenzinterpolation. Die MUF ist die Engine-Ausgabe für den gewählten Pfad; sie garantiert weder nutzbare Frequenzen noch erfolgreiche Kommunikation.",
    "셀은 계산한 주파수와 UTC 시각의 이산 값이며 주파수 사이를 보간하지 않습니다. MUF는 선택한 경로의 엔진 출력으로 사용 가능한 주파수나 통신 성공을 보장하지 않습니다."
  ],
  "寸法付きモデルは全長・設置高・主放射方向・地面定数を計算に反映します。長さは実寸mで、周波数ごとの共振長への自動変更はしません。基準ホイップ・等方性は寸法を使いません。整合器・SWR・ラジアル・近傍構造物の詳細は未評価です。": [
    "Dimensional models use physical length in metres, height, main-beam bearing and ground constants. Length is not retuned for each frequency. Reference whip and isotropic models ignore dimensions. Tuners, SWR, radials and nearby structures are not modeled in detail.",
    "Les modèles dimensionnels utilisent longueur physique en mètres, hauteur, azimut du lobe principal et constantes du sol. Aucun réaccord selon la fréquence. Les modèles fouet de référence et isotrope ignorent les dimensions. Coupleurs, ROS, radians et structures proches ne sont pas modélisés en détail.",
    "Los modelos dimensionales usan longitud física en metros, altura, orientación principal y constantes del suelo. No se reajusta la longitud por frecuencia. El látigo de referencia y el modelo isotrópico ignoran dimensiones. No se detallan acopladores, ROE, radiales ni estructuras cercanas.",
    "I modelli dimensionali usano lunghezza fisica in metri, altezza, direzione principale e costanti del terreno. Nessuna risintonizzazione per frequenza. I modelli stilo di riferimento e isotropico ignorano le dimensioni. Accordatori, ROS, radiali e strutture vicine non sono modellati in dettaglio.",
    "Os modelos dimensionais usam comprimento físico em metros, altura, direção principal e constantes do solo. O comprimento não é reajustado por frequência. Os modelos de chicote de referência e isotrópico ignoram dimensões. Acopladores, ROE, radiais e estruturas próximas não são modelados em detalhe.",
    "Maßmodelle verwenden physische Länge in Metern, Höhe, Hauptstrahlrichtung und Bodenkonstanten. Keine automatische Abstimmung je Frequenz. Referenz-Stab und Isotropmodell ignorieren Abmessungen. Anpassgeräte, SWR, Radiale und nahe Strukturen werden nicht detailliert modelliert.",
    "치수 모델은 실제 길이(m), 높이, 주 방사 방위 및 지면 상수를 반영합니다. 주파수별 공진 길이로 자동 조정하지 않습니다. 기준 휩과 등방성 모델은 치수를 사용하지 않습니다. 정합기, SWR, 라디얼 및 주변 구조물의 상세 특성은 미반영입니다."
  ],
  "垂直モノポール／ホイップ": [
    "Vertical monopole / whip",
    "Monopôle vertical / fouet",
    "Monopolo vertical / látigo",
    "Monopolo verticale / stilo",
    "Monopolo vertical / chicote",
    "Vertikaler Monopol / Stab",
    "수직 모노폴 / 휩"
  ],
  "水平ダイポール": [
    "Horizontal dipole",
    "Dipôle horizontal",
    "Dipolo horizontal",
    "Dipolo orizzontale",
    "Dipolo horizontal",
    "Horizontaler Dipol",
    "수평 다이폴"
  ],
  "垂直ダイポール": [
    "Vertical dipole",
    "Dipôle vertical",
    "Dipolo vertical",
    "Dipolo verticale",
    "Dipolo vertical",
    "Vertikaler Dipol",
    "수직 다이폴"
  ],
  "水平ログペリ": [
    "Horizontal log-periodic",
    "Log-périodique horizontale",
    "Log-periódica horizontal",
    "Log-periodica orizzontale",
    "Log-periódica horizontal",
    "Horizontale Log-Periodic",
    "수평 대수주기"
  ],
  "素子数": [
    "Elements",
    "Éléments",
    "Elementos",
    "Elementi",
    "Elementos",
    "Elemente",
    "소자 수"
  ],
  "短縮率 τ": [
    "Scale factor τ",
    "Facteur d’échelle τ",
    "Factor de escala τ",
    "Fattore di scala τ",
    "Fator de escala τ",
    "Skalierungsfaktor τ",
    "축소율 τ"
  ],
  "素子先端角 °（軸から）": [
    "Element-tip angle ° (from axis)",
    "Angle des extrémités ° (depuis l’axe)",
    "Ángulo de puntas ° (desde el eje)",
    "Angolo delle punte ° (dall’asse)",
    "Ângulo das pontas ° (a partir do eixo)",
    "Elementspitzenwinkel ° (zur Achse)",
    "소자 끝 각도 ° (축 기준)"
  ],
  "アレイ傾斜 °（鉛直から、90=水平）": [
    "Array slope ° (from vertical, 90 = horizontal)",
    "Inclinaison du réseau ° (depuis la verticale, 90 = horizontal)",
    "Inclinación del arreglo ° (desde la vertical, 90 = horizontal)",
    "Inclinazione della schiera ° (dalla verticale, 90 = orizzontale)",
    "Inclinação do arranjo ° (a partir da vertical, 90 = horizontal)",
    "Gruppenneigung ° (zur Senkrechten, 90 = horizontal)",
    "배열 경사 ° (수직 기준, 90 = 수평)"
  ],
  "給電線インピーダンス Ω": [
    "Feeder impedance Ω",
    "Impédance de la ligne Ω",
    "Impedancia de la línea Ω",
    "Impedenza della linea Ω",
    "Impedância da linha Ω",
    "Speiseleitungsimpedanz Ω",
    "급전선 임피던스 Ω"
  ],
  "全方向（オムニ）": [
    "Omnidirectional",
    "Omnidirectionnelle",
    "Omnidireccional",
    "Omnidirezionale",
    "Omnidirecional",
    "Rundstrahlend",
    "무지향성"
  ],
  "指向性": [
    "Directional",
    "Directive",
    "Directiva",
    "Direttiva",
    "Diretiva",
    "Richtantenne",
    "지향성"
  ],
  "アンテナ全長 m（ログペリは最長素子、逆Lは水平部）": [
    "Total antenna length m (log-periodic: longest element; inverted L: horizontal section)",
    "Longueur totale m (log-périodique : élément le plus long ; L inversé : partie horizontale)",
    "Longitud total m (log-periódica: elemento más largo; L invertida: tramo horizontal)",
    "Lunghezza totale m (log-periodica: elemento più lungo; L rovesciata: tratto orizzontale)",
    "Comprimento total m (log-periódica: elemento mais longo; L invertido: trecho horizontal)",
    "Antennengesamtlänge m (Log-Periodic: längstes Element; umgekehrtes L: waagerechter Teil)",
    "안테나 전체 길이 m (대수주기: 최장 소자, 역L: 수평부)"
  ],
  "地上高／給電点高 m（逆Lは垂直部）": [
    "Height / feed height m (inverted L: vertical section)",
    "Hauteur / hauteur d’alimentation m (L inversé : partie verticale)",
    "Altura / altura de alimentación m (L invertida: tramo vertical)",
    "Altezza / altezza di alimentazione m (L rovesciata: tratto verticale)",
    "Altura / altura de alimentação m (L invertido: trecho vertical)",
    "Höhe / Speisepunkthöhe m (umgekehrtes L: senkrechter Teil)",
    "지상고 / 급전점 높이 m (역L: 수직부)"
  ],
  "逆L": [
    "Inverted L",
    "L inversé",
    "L invertida",
    "L rovesciata",
    "L invertido",
    "Umgekehrtes L",
    "역L"
  ],
  "傾斜ロングワイヤー（スローパー）": [
    "Sloping long wire (sloper)",
    "Long fil incliné (sloper)",
    "Hilo largo inclinado (sloper)",
    "Filo lungo inclinato (sloper)",
    "Fio longo inclinado (sloper)",
    "Schräger Langdraht (Sloper)",
    "경사 롱와이어 (슬로퍼)"
  ],
  "線の傾斜 °（水平から）": [
    "Wire slope ° (from horizontal)",
    "Inclinaison du fil ° (depuis l’horizontale)",
    "Inclinación del hilo ° (desde la horizontal)",
    "Inclinazione del filo ° (dall’orizzontale)",
    "Inclinação do fio ° (a partir da horizontal)",
    "Drahtneigung ° (zur Waagerechten)",
    "선 경사 ° (수평 기준)"
  ],
  "利得表（実測・解析パターン）": [
    "Gain table (measured / simulated pattern)",
    "Table de gain (diagramme mesuré / simulé)",
    "Tabla de ganancia (diagrama medido / simulado)",
    "Tabella di guadagno (diagramma misurato / simulato)",
    "Tabela de ganho (diagrama medido / simulado)",
    "Gewinntabelle (gemessenes / simuliertes Diagramm)",
    "이득표 (실측·해석 패턴)"
  ],
  "利得表": [
    "Gain table",
    "Table de gain",
    "Tabla de ganancia",
    "Tabella di guadagno",
    "Tabela de ganho",
    "Gewinntabelle",
    "이득표"
  ],
  "利得表（実測・解析パターン）の登録": [
    "Register a gain table (measured / simulated pattern)",
    "Enregistrer une table de gain (diagramme mesuré / simulé)",
    "Registrar una tabla de ganancia (diagrama medido / simulado)",
    "Registra una tabella di guadagno (diagramma misurato / simulato)",
    "Registrar uma tabela de ganho (diagrama medido / simulado)",
    "Gewinntabelle registrieren (gemessenes / simuliertes Diagramm)",
    "이득표 등록 (실측·해석 패턴)"
  ],
  "航空機・艦船など、取付け構造を含めて実測またはNEC等で解析した放射パターンをCSVで登録します。見出しは frequency_mhz,azimuth_deg,elevation_deg,gain_dbi で、周波数1〜30 MHz・方位0〜360°未満・仰角0〜90°の全組合せの利得（dBi）が必要です。方位はアンテナの基準方向（機首など）から時計回りです。": [
    "Register a radiation pattern measured or simulated (e.g. NEC) with its mounting structure, such as an aircraft or ship, as CSV. The header is frequency_mhz,azimuth_deg,elevation_deg,gain_dbi, and every combination of frequency 1–30 MHz, azimuth 0 to below 360° and elevation 0–90° needs a gain in dBi. Azimuth is clockwise from the antenna's reference direction (e.g. the nose).",
    "Enregistrez en CSV un diagramme de rayonnement mesuré ou simulé (NEC, etc.) avec sa structure de montage, par exemple un aéronef ou un navire. L’en-tête est frequency_mhz,azimuth_deg,elevation_deg,gain_dbi ; chaque combinaison de fréquence 1–30 MHz, d’azimut 0 à moins de 360° et d’élévation 0–90° doit avoir un gain en dBi. L’azimut est compté dans le sens horaire depuis la direction de référence de l’antenne (le nez, par exemple).",
    "Registre en CSV un diagrama de radiación medido o simulado (NEC, etc.) con su estructura de montaje, como una aeronave o un buque. El encabezado es frequency_mhz,azimuth_deg,elevation_deg,gain_dbi y cada combinación de frecuencia 1–30 MHz, azimut de 0 a menos de 360° y elevación 0–90° necesita una ganancia en dBi. El azimut se mide en sentido horario desde la dirección de referencia de la antena (por ejemplo, el morro).",
    "Registra in CSV un diagramma di radiazione misurato o simulato (NEC, ecc.) con la struttura di montaggio, come un aereo o una nave. L’intestazione è frequency_mhz,azimuth_deg,elevation_deg,gain_dbi e ogni combinazione di frequenza 1–30 MHz, azimut da 0 a meno di 360° ed elevazione 0–90° richiede un guadagno in dBi. L’azimut è in senso orario dalla direzione di riferimento dell’antenna (ad esempio il muso).",
    "Registre em CSV um diagrama de radiação medido ou simulado (NEC, etc.) com a estrutura de montagem, como uma aeronave ou um navio. O cabeçalho é frequency_mhz,azimuth_deg,elevation_deg,gain_dbi e cada combinação de frequência 1–30 MHz, azimute de 0 a menos de 360° e elevação 0–90° precisa de um ganho em dBi. O azimute é contado no sentido horário a partir da direção de referência da antena (por exemplo, o nariz).",
    "Registrieren Sie ein gemessenes oder (z. B. mit NEC) simuliertes Strahlungsdiagramm samt Montagestruktur, etwa eines Flugzeugs oder Schiffs, als CSV. Die Kopfzeile lautet frequency_mhz,azimuth_deg,elevation_deg,gain_dbi; jede Kombination aus Frequenz 1–30 MHz, Azimut 0 bis unter 360° und Elevation 0–90° braucht einen Gewinn in dBi. Der Azimut zählt im Uhrzeigersinn ab der Bezugsrichtung der Antenne (z. B. der Flugzeugnase).",
    "항공기·선박 등 장착 구조를 포함해 실측하거나 NEC 등으로 해석한 방사 패턴을 CSV로 등록합니다. 머리글은 frequency_mhz,azimuth_deg,elevation_deg,gain_dbi이며, 주파수 1~30 MHz·방위 0~360° 미만·앙각 0~90°의 모든 조합에 이득(dBi)이 필요합니다. 방위는 안테나 기준 방향(기수 등)에서 시계 방향입니다."
  ],
  "計算では回線方向で切り出した周波数×仰角表をVOACAPへ渡します。範囲外の周波数・仰角は端の値を使います。機体の高度、機体姿勢の変化、利得表に含まれない損失は再現しません。": [
    "For each calculation, a frequency × elevation table cut at the circuit direction is passed to VOACAP. Frequencies and elevations outside the table use the edge values. Aircraft altitude, attitude changes and losses not in the table are not reproduced.",
    "Pour chaque calcul, une table fréquence × élévation extraite dans la direction du circuit est transmise à VOACAP. Les fréquences et élévations hors table prennent les valeurs des bords. L’altitude de l’aéronef, les variations d’assiette et les pertes absentes de la table ne sont pas reproduites.",
    "En cada cálculo se pasa a VOACAP una tabla frecuencia × elevación extraída en la dirección del circuito. Las frecuencias y elevaciones fuera de la tabla usan los valores del borde. No se reproducen la altitud de la aeronave, los cambios de actitud ni las pérdidas que no estén en la tabla.",
    "Per ogni calcolo viene passata a VOACAP una tabella frequenza × elevazione estratta nella direzione del collegamento. Frequenze ed elevazioni fuori tabella usano i valori ai bordi. Quota dell’aereo, variazioni di assetto e perdite non incluse nella tabella non sono riprodotte.",
    "Em cada cálculo, uma tabela frequência × elevação extraída na direção do circuito é passada ao VOACAP. Frequências e elevações fora da tabela usam os valores das bordas. A altitude da aeronave, as mudanças de atitude e as perdas fora da tabela não são reproduzidas.",
    "Für jede Berechnung wird VOACAP eine in Verbindungsrichtung geschnittene Tabelle Frequenz × Elevation übergeben. Frequenzen und Elevationen außerhalb der Tabelle verwenden die Randwerte. Flughöhe, Lageänderungen und nicht in der Tabelle enthaltene Verluste werden nicht nachgebildet.",
    "계산마다 회선 방향으로 잘라낸 주파수×앙각 표를 VOACAP에 넘깁니다. 범위 밖의 주파수·앙각은 가장자리 값을 씁니다. 기체 고도, 자세 변화, 이득표에 없는 손실은 재현하지 않습니다."
  ],
  "出典・解析条件（任意）": [
    "Source / analysis conditions (optional)",
    "Source / conditions d’analyse (facultatif)",
    "Fuente / condiciones de análisis (opcional)",
    "Fonte / condizioni di analisi (facoltativo)",
    "Fonte / condições de análise (opcional)",
    "Quelle / Analysebedingungen (optional)",
    "출처·해석 조건 (선택)"
  ],
  "CSVファイル": [
    "CSV file",
    "Fichier CSV",
    "Archivo CSV",
    "File CSV",
    "Arquivo CSV",
    "CSV-Datei",
    "CSV 파일"
  ],
  "記入例つきテンプレート（CSV）をダウンロード": [
    "Download template with example values (CSV)",
    "Télécharger le modèle avec exemple (CSV)",
    "Descargar plantilla con ejemplo (CSV)",
    "Scarica il modello con esempio (CSV)",
    "Baixar modelo com exemplo (CSV)",
    "Vorlage mit Beispielwerten herunterladen (CSV)",
    "예시 포함 템플릿 다운로드 (CSV)"
  ],
  "テンプレートの記入例は架空の値です。「#」で始まる注記行は残したまま、実測・解析した値に書き換えて登録できます。": [
    "The example values in the template are fictitious. Replace them with your measured or simulated gains and register the file; lines starting with # are notes and can stay.",
    "Les valeurs d’exemple du modèle sont fictives. Remplacez-les par vos gains mesurés ou simulés puis enregistrez le fichier ; les lignes commençant par # sont des notes et peuvent rester.",
    "Los valores de ejemplo de la plantilla son ficticios. Sustitúyalos por sus ganancias medidas o simuladas y registre el archivo; las líneas que empiezan por # son notas y pueden mantenerse.",
    "I valori di esempio del modello sono fittizi. Sostituiscili con i guadagni misurati o simulati e registra il file; le righe che iniziano con # sono note e possono restare.",
    "Os valores de exemplo do modelo são fictícios. Substitua-os pelos ganhos medidos ou simulados e registre o arquivo; as linhas iniciadas por # são notas e podem permanecer.",
    "Die Beispielwerte der Vorlage sind fiktiv. Ersetzen Sie sie durch gemessene oder simulierte Gewinne und registrieren Sie die Datei; mit # beginnende Zeilen sind Hinweise und dürfen bleiben.",
    "템플릿의 예시 값은 가상의 값입니다. 측정 또는 해석한 이득으로 바꾸어 등록하십시오. #으로 시작하는 줄은 주석이므로 그대로 두어도 됩니다."
  ],
  "利得表のテンプレート": [
    "Gain table template",
    "Modèle de table de gain",
    "Plantilla de tabla de ganancia",
    "Modello di tabella di guadagno",
    "Modelo de tabela de ganho",
    "Vorlage für Gewinntabellen",
    "이득표 템플릿"
  ],
  "利得表の登録画面から、記入例つきのCSVテンプレートをダウンロードできます。値を実測・解析結果に書き換えて、そのまま登録できます。": [
    "Download a CSV template with example values from the gain table registration panel. Replace the values with your measured or simulated results and register it as is.",
    "Téléchargez un modèle CSV avec exemple depuis le panneau d’enregistrement des tables de gain. Remplacez les valeurs par vos résultats mesurés ou simulés et enregistrez-le tel quel.",
    "Descargue una plantilla CSV con ejemplo desde el panel de registro de tablas de ganancia. Sustituya los valores por sus resultados medidos o simulados y regístrela tal cual.",
    "Scarica un modello CSV con esempio dal pannello di registrazione delle tabelle di guadagno. Sostituisci i valori con i risultati misurati o simulati e registralo così com’è.",
    "Baixe um modelo CSV com exemplo no painel de registro de tabelas de ganho. Substitua os valores pelos resultados medidos ou simulados e registre-o como está.",
    "Laden Sie im Bereich zur Registrierung von Gewinntabellen eine CSV-Vorlage mit Beispielwerten herunter. Ersetzen Sie die Werte durch Mess- oder Simulationsergebnisse und registrieren Sie sie unverändert.",
    "이득표 등록 화면에서 예시가 포함된 CSV 템플릿을 내려받을 수 있습니다. 값을 측정·해석 결과로 바꾸어 그대로 등록하십시오."
  ],
  "利得表を登録": [
    "Register gain table",
    "Enregistrer la table",
    "Registrar tabla",
    "Registra tabella",
    "Registrar tabela",
    "Tabelle registrieren",
    "이득표 등록"
  ],
  "利得表を選択": [
    "Select a gain table",
    "Choisir une table de gain",
    "Seleccione una tabla de ganancia",
    "Seleziona una tabella di guadagno",
    "Selecione uma tabela de ganho",
    "Gewinntabelle wählen",
    "이득표 선택"
  ],
  "利得表を登録しました。アンテナプリセットの基準モデルで「利得表」を選んで使用します。": [
    "Gain table registered. Choose “Gain table” as the reference model of an antenna preset to use it.",
    "Table de gain enregistrée. Choisissez « Table de gain » comme modèle de référence d’un préréglage d’antenne pour l’utiliser.",
    "Tabla de ganancia registrada. Elija «Tabla de ganancia» como modelo de referencia de un preajuste de antena para usarla.",
    "Tabella di guadagno registrata. Scegli «Tabella di guadagno» come modello di riferimento di un preset d’antenna per usarla.",
    "Tabela de ganho registrada. Escolha “Tabela de ganho” como modelo de referência de uma predefinição de antena para usá-la.",
    "Gewinntabelle registriert. Wählen Sie „Gewinntabelle“ als Referenzmodell einer Antennenvorgabe, um sie zu verwenden.",
    "이득표를 등록했습니다. 안테나 프리셋의 기준 모델에서 ‘이득표’를 선택해 사용합니다."
  ],
  "利得表を削除しました。": [
    "Gain table deleted.",
    "Table de gain supprimée.",
    "Tabla de ganancia eliminada.",
    "Tabella di guadagno eliminata.",
    "Tabela de ganho excluída.",
    "Gewinntabelle gelöscht.",
    "이득표를 삭제했습니다."
  ],
  "主放射方向の決め方": [
    "Main-beam direction",
    "Orientation du lobe",
    "Dirección del lóbulo",
    "Direzione del lobo",
    "Direção do lóbulo",
    "Hauptstrahlrichtung festlegen",
    "주 방사 방향 설정"
  ],
  "方位を固定": [
    "Fixed bearing",
    "Azimut fixe",
    "Azimut fijo",
    "Azimut fisso",
    "Azimute fixo",
    "Feste Richtung",
    "고정 방위"
  ],
  "相手局へ向ける": [
    "Toward the other station",
    "Vers l’autre station",
    "Hacia la otra estación",
    "Verso l’altra stazione",
    "Para a outra estação",
    "Zur Gegenstation",
    "상대국 방향"
  ],
  "主放射方位 °（真北基準）": [
    "Main-beam bearing ° (true north)",
    "Azimut du lobe ° (nord vrai)",
    "Azimut principal ° (norte verdadero)",
    "Azimut principale ° (nord vero)",
    "Azimute principal ° (norte verdadeiro)",
    "Hauptstrahlrichtung ° (geografisch Nord)",
    "주 방사 방위 ° (진북 기준)"
  ],
  "地面の比誘電率": [
    "Ground relative permittivity",
    "Permittivité relative du sol",
    "Permitividad relativa del suelo",
    "Permittività relativa del terreno",
    "Permissividade relativa do solo",
    "Relative Bodenpermittivität",
    "지면 비유전율"
  ],
  "地面の導電率 S/m": [
    "Ground conductivity S/m",
    "Conductivité du sol S/m",
    "Conductividad del suelo S/m",
    "Conducibilità del terreno S/m",
    "Condutividade do solo S/m",
    "Bodenleitfähigkeit S/m",
    "지면 전도율 S/m"
  ],
  "ログアウト": [
    "Log out",
    "Déconnexion",
    "Cerrar sesión",
    "Esci",
    "Terminar sessão",
    "Abmelden",
    "로그아웃"
  ],
  "ログイン": [
    "Log in",
    "Connexion",
    "Iniciar sesión",
    "Accedi",
    "Iniciar sessão",
    "Anmelden",
    "로그인"
  ],
  "位置ゲートウェイ管理": [
    "Position gateway administration",
    "Administration de la passerelle de position",
    "Administración de la pasarela de posición",
    "Gestione gateway di posizione",
    "Gestão do gateway de posição",
    "Positionsgateway-Verwaltung",
    "위치 게이트웨이 관리"
  ],
  "船舶・航空機・車両の受信状態と局別プロトコルを管理します。": [
    "Manage vessel, aircraft and vehicle reports and per-station protocols.",
    "Gérez les rapports des navires, aéronefs et véhicules et les protocoles par station.",
    "Gestione informes de buques, aeronaves y vehículos y protocolos por estación.",
    "Gestisci rapporti di navi, aeromobili e veicoli e protocolli per stazione.",
    "Gerir relatórios de navios, aeronaves e veículos e protocolos por estação.",
    "Meldungen von Schiffen, Flugzeugen und Fahrzeugen sowie Stationsprotokolle verwalten.",
    "선박·항공기·차량의 수신 상태와 국별 프로토콜을 관리합니다."
  ],
  "管理画面へログイン": [
    "Log in to administration",
    "Connexion à l’administration",
    "Acceder a administración",
    "Accedi alla gestione",
    "Entrar na administração",
    "Bei der Verwaltung anmelden",
    "관리 화면 로그인"
  ],
  "管理パスワード": [
    "Administration password",
    "Mot de passe d’administration",
    "Contraseña de administración",
    "Password di gestione",
    "Palavra-passe de administração",
    "Verwaltungspasswort",
    "관리 비밀번호"
  ],
  "HF_GATEWAY_UI_PASSWORDに16文字以上の専用パスワードを設定してください。受信用・本体連携用トークンは使用しません。": [
    "Set a dedicated password of at least 16 characters in HF_GATEWAY_UI_PASSWORD. Do not use either service token.",
    "Définissez un mot de passe dédié d’au moins 16 caractères dans HF_GATEWAY_UI_PASSWORD, distinct des jetons de service.",
    "Configure una contraseña exclusiva de al menos 16 caracteres en HF_GATEWAY_UI_PASSWORD, distinta de los tokens de servicio.",
    "Imposta una password dedicata di almeno 16 caratteri in HF_GATEWAY_UI_PASSWORD, diversa dai token di servizio.",
    "Defina uma palavra-passe dedicada com pelo menos 16 caracteres em HF_GATEWAY_UI_PASSWORD, distinta dos tokens de serviço.",
    "Eigenes Passwort mit mindestens 16 Zeichen in HF_GATEWAY_UI_PASSWORD setzen; keine Dienst-Token verwenden.",
    "HF_GATEWAY_UI_PASSWORD에 서비스 토큰과 다른 16자 이상의 전용 비밀번호를 설정하세요."
  ],
  "ゲートウェイ状態": [
    "Gateway status",
    "État de la passerelle",
    "Estado de la pasarela",
    "Stato del gateway",
    "Estado do gateway",
    "Gateway-Status",
    "게이트웨이 상태"
  ],
  "入力はHTTP(S)経由です。外部送信機は専用の受信トークンを使用し、本体は共通JSON v1を取得します。": [
    "Inputs use HTTP(S). External senders use a dedicated ingestion token; the main app retrieves common JSON v1.",
    "Entrées via HTTP(S). Les émetteurs utilisent un jeton de réception dédié ; l’application récupère le JSON v1 commun.",
    "Entradas mediante HTTP(S). Los emisores usan un token de recepción exclusivo; la aplicación obtiene JSON v1 común.",
    "Ingressi via HTTP(S). I mittenti usano un token dedicato; l’app recupera il JSON v1 comune.",
    "Entradas via HTTP(S). Os emissores usam um token dedicado; a aplicação obtém JSON v1 comum.",
    "Eingaben per HTTP(S). Sender nutzen einen eigenen Empfangs-Token; die Hauptanwendung ruft gemeinsames JSON v1 ab.",
    "입력은 HTTP(S)를 사용합니다. 외부 송신기는 전용 수신 토큰을 사용하며 본체는 공통 JSON v1을 가져옵니다."
  ],
  "形式・種別の変更や無効化では旧位置を破棄し、次の有効報告を待ちます。": [
    "Changing format or kind, or disabling reception, discards the old position until the next valid report.",
    "Changer le format ou le type, ou désactiver la réception, supprime l’ancienne position jusqu’au prochain rapport valide.",
    "Cambiar formato o tipo, o desactivar la recepción, elimina la posición anterior hasta el próximo informe válido.",
    "Cambiare formato o tipo, o disabilitare la ricezione, elimina la vecchia posizione fino al prossimo rapporto valido.",
    "Alterar formato ou tipo, ou desativar a receção, elimina a posição anterior até ao próximo relatório válido.",
    "Format-/Typwechsel oder Deaktivierung verwirft die alte Position bis zur nächsten gültigen Meldung.",
    "형식·종류 변경 또는 비활성화 시 이전 위치를 삭제하고 다음 유효 보고를 기다립니다."
  ],
  "移動局の最新位置": [
    "Latest mobile positions",
    "Dernières positions mobiles",
    "Últimas posiciones móviles",
    "Ultime posizioni mobili",
    "Últimas posições móveis",
    "Letzte Mobilpositionen",
    "이동국 최신 위치"
  ],
  "位置は計算開始時点の固定値です。速度・針路・高度による移動予測や伝搬補正は行いません。": [
    "Positions are fixed at calculation start. Speed, course and altitude do not predict motion or adjust propagation.",
    "Les positions sont figées au début du calcul. Vitesse, cap et altitude ne prédisent pas le mouvement et ne corrigent pas la propagation.",
    "Las posiciones se fijan al iniciar el cálculo. Velocidad, rumbo y altitud no predicen movimiento ni corrigen propagación.",
    "Le posizioni sono fissate all’inizio del calcolo. Velocità, rotta e quota non prevedono movimenti né correggono la propagazione.",
    "As posições são fixadas no início do cálculo. Velocidade, rumo e altitude não preveem movimento nem corrigem propagação.",
    "Positionen werden bei Rechenbeginn fixiert. Geschwindigkeit, Kurs und Höhe dienen keiner Bewegungsprognose oder Ausbreitungskorrektur.",
    "위치는 계산 시작 시 고정됩니다. 속도·침로·고도로 이동을 예측하거나 전파를 보정하지 않습니다."
  ],
  "計算後にPropagation Chartを表示します。": [
    "Run a calculation to display the Propagation Chart.",
    "Lancez un calcul pour afficher le Propagation Chart.",
    "Calcule para mostrar el Propagation Chart.",
    "Esegui un calcolo per mostrare il Propagation Chart.",
    "Calcule para apresentar o Propagation Chart.",
    "Berechnung starten, um den Propagation Chart anzuzeigen.",
    "계산 후 Propagation Chart를 표시합니다."
  ],
  "出典・モデル注記": [
    "Sources and model notes",
    "Sources et notes du modèle",
    "Fuentes y notas del modelo",
    "Fonti e note del modello",
    "Fontes e notas do modelo",
    "Quellen und Modellhinweise",
    "출처 및 모델 참고"
  ],
  "参考資料のみ（計算不可）": [
    "Reference only (not selectable)",
    "Référence seule (non sélectionnable)",
    "Solo referencia (no seleccionable)",
    "Solo riferimento (non selezionabile)",
    "Só referência (não selecionável)",
    "Nur Referenz (nicht auswählbar)",
    "참고 자료 전용 (계산 불가)"
  ],
  "寸法近似": [
    "dimensional approximation",
    "approximation dimensionnelle",
    "aproximación dimensional",
    "approssimazione dimensionale",
    "aproximação dimensional",
    "Maßnäherung",
    "치수 근사"
  ],
  "参考資料": [
    "reference",
    "référence",
    "referencia",
    "riferimento",
    "referência",
    "Referenz",
    "참고 자료"
  ],
  "全長": [
    "total length",
    "longueur totale",
    "longitud total",
    "lunghezza totale",
    "comprimento total",
    "Gesamtlänge",
    "전체 길이"
  ],
  "垂直ホイップ": [
    "Vertical whip",
    "Fouet vertical",
    "Látigo vertical",
    "Stilo verticale",
    "Chicote vertical",
    "Vertikaler Stab",
    "수직 휩"
  ],
  "グランドプレーン": [
    "Ground plane",
    "Plan de sol",
    "Plano de tierra",
    "Ground plane",
    "Plano de terra",
    "Groundplane",
    "그라운드 플레인"
  ],
  "艦船": [
    "Shipboard",
    "Naval",
    "Naval",
    "Navale",
    "Naval",
    "Schiff",
    "함정"
  ],
  "有効位置": [
    "Valid positions",
    "Positions valides",
    "Posiciones válidas",
    "Posizioni valide",
    "Posições válidas",
    "Gültige Positionen",
    "유효 위치"
  ],
  "外部受信": [
    "External ingestion",
    "Réception externe",
    "Recepción externa",
    "Ricezione esterna",
    "Receção externa",
    "Externer Empfang",
    "외부 수신"
  ],
  "本体連携": [
    "Main app connection",
    "Connexion à l’application",
    "Conexión con la aplicación",
    "Connessione all’app",
    "Ligação à aplicação",
    "Anwendungsverbindung",
    "본체 연동"
  ],
  "速度 kt / 針路 °": [
    "Speed kt / course °",
    "Vitesse kt / cap °",
    "Velocidad kt / rumbo °",
    "Velocità kt / rotta °",
    "Velocidade kt / rumo °",
    "Fahrt kt / Kurs °",
    "속도 kt / 침로 °"
  ],
  "局設定を保存しました。": [
    "Station settings saved.",
    "Paramètres de station enregistrés.",
    "Configuración guardada.",
    "Impostazioni salvate.",
    "Definições guardadas.",
    "Stationseinstellungen gespeichert.",
    "국 설정을 저장했습니다."
  ],
  "ログインしました。": [
    "Logged in.",
    "Connecté.",
    "Sesión iniciada.",
    "Accesso effettuato.",
    "Sessão iniciada.",
    "Angemeldet.",
    "로그인했습니다."
  ],
  "ログアウトしました。": [
    "Logged out.",
    "Déconnecté.",
    "Sesión cerrada.",
    "Disconnesso.",
    "Sessão terminada.",
    "Abgemeldet.",
    "로그아웃했습니다."
  ],
  "管理専用パスワードでログインしてください。": [
    "Log in with the dedicated administration password.",
    "Connectez-vous avec le mot de passe d’administration dédié.",
    "Acceda con la contraseña exclusiva de administración.",
    "Accedi con la password dedicata.",
    "Entre com a palavra-passe de administração dedicada.",
    "Mit dem eigenen Verwaltungspasswort anmelden.",
    "관리 전용 비밀번호로 로그인하세요."
  ],
  "管理パスワードを設定してください。": [
    "Set an administration password.",
    "Définissez un mot de passe d’administration.",
    "Configure una contraseña de administración.",
    "Imposta una password di gestione.",
    "Defina uma palavra-passe de administração.",
    "Verwaltungspasswort festlegen.",
    "관리 비밀번호를 설정하세요."
  ],
  "管理画面へログインしてください。": [
    "Log in to administration.",
    "Connectez-vous à l’administration.",
    "Acceda a administración.",
    "Accedi alla gestione.",
    "Entre na administração.",
    "Bei der Verwaltung anmelden.",
    "관리 화면에 로그인하세요."
  ],
  "パスワードが正しくありません。": [
    "Incorrect password.",
    "Mot de passe incorrect.",
    "Contraseña incorrecta.",
    "Password errata.",
    "Palavra-passe incorreta.",
    "Falsches Passwort.",
    "비밀번호가 올바르지 않습니다."
  ],
  "ログイン試行が多すぎます。しばらく待ってください。": [
    "Too many login attempts. Try again later.",
    "Trop de tentatives. Réessayez plus tard.",
    "Demasiados intentos. Inténtelo más tarde.",
    "Troppi tentativi. Riprova più tardi.",
    "Demasiadas tentativas. Tente mais tarde.",
    "Zu viele Anmeldeversuche. Später erneut versuchen.",
    "로그인 시도가 너무 많습니다. 잠시 후 다시 시도하세요."
  ],
  "CHUCK — HF電波伝搬予測": [
    "CHUCK — HF radio forecast",
    "CHUCK — Prévision radio HF",
    "CHUCK — Predicción de radio HF",
    "CHUCK — Previsione radio HF",
    "CHUCK — Previsão de rádio HF",
    "CHUCK — HF-Funkprognose",
    "CHUCK — HF 전파 예측"
  ],
  "高度 m": [
    "Altitude m",
    "Altitude m",
    "Altitud m",
    "Quota m",
    "Altitude m",
    "Höhe m",
    "고도 m"
  ],
  "カタログ・仕様書を生成AIで読み取る": [
    "Read catalogs/specifications with AI",
    "Lire catalogues et fiches avec l’IA",
    "Leer catálogos y fichas con IA",
    "Leggi cataloghi e schede con IA",
    "Ler catálogos e fichas com IA",
    "Kataloge/Datenblätter mit KI lesen",
    "생성 AI로 카탈로그·사양서 읽기"
  ],
  "資料ファイル": [
    "Source file",
    "Fichier source",
    "Archivo fuente",
    "File sorgente",
    "Ficheiro de origem",
    "Quelldatei",
    "자료 파일"
  ],
  "出典URL（任意・HTTPS）": [
    "Source URL (optional, HTTPS)",
    "URL source (facultative, HTTPS)",
    "URL fuente (opcional, HTTPS)",
    "URL fonte (facoltativo, HTTPS)",
    "URL de origem (opcional, HTTPS)",
    "Quell-URL (optional, HTTPS)",
    "출처 URL (선택·HTTPS)"
  ],
  "PDF・PNG・JPEG・WebP、1ファイル8 MiBまで。原本と読取結果をサーバーに保存します。読取りは候補の作成であり、自動登録ではありません。": [
    "PDF, PNG, JPEG or WebP, up to 8 MiB per file. The source and extraction are saved on the server. Reading creates review candidates; it does not register presets.",
    "PDF, PNG, JPEG ou WebP, 8 Mio maximum par fichier. Source et extraction sont conservées sur le serveur. La lecture crée des candidats à vérifier, sans inscription automatique.",
    "PDF, PNG, JPEG o WebP, hasta 8 MiB por archivo. Se guardan fuente y extracción en el servidor. La lectura crea candidatos para revisión, sin registro automático.",
    "PDF, PNG, JPEG o WebP, fino a 8 MiB per file. Originale ed estrazione sono salvati sul server. La lettura crea candidati da verificare, senza registrazione automatica.",
    "PDF, PNG, JPEG ou WebP, até 8 MiB por ficheiro. Original e extração são guardados no servidor. A leitura cria candidatos para revisão, sem registo automático.",
    "PDF, PNG, JPEG oder WebP, höchstens 8 MiB je Datei. Original und Extraktion werden auf dem Server gespeichert. Lesen erzeugt Prüfkandidaten, keine automatische Registrierung.",
    "PDF·PNG·JPEG·WebP, 파일당 최대 8 MiB입니다. 원본과 읽기 결과를 서버에 저장합니다. 읽기는 검토 후보를 생성하며 자동 등록하지 않습니다."
  ],
  "資料をOpenAI APIへ送信することと、API利用料金の発生を確認しました。": [
    "I acknowledge sending this document to the OpenAI API and incurring API charges.",
    "Je confirme l’envoi du document à l’API OpenAI et les frais associés.",
    "Confirmo el envío del documento a la API de OpenAI y los cargos de uso.",
    "Confermo l’invio del documento all’API OpenAI e i relativi costi.",
    "Confirmo o envio do documento à API OpenAI e os custos de utilização.",
    "Übermittlung an die OpenAI API und anfallende API-Kosten sind bestätigt.",
    "자료의 OpenAI API 전송과 API 이용 요금 발생을 확인했습니다."
  ],
  "生成AIで読み取る": [
    "Read with AI",
    "Lire avec l’IA",
    "Leer con IA",
    "Leggi con IA",
    "Ler com IA",
    "Mit KI lesen",
    "생성 AI로 읽기"
  ],
  "保存資料を再読込": [
    "Refresh saved documents",
    "Actualiser les documents",
    "Actualizar documentos",
    "Aggiorna documenti",
    "Atualizar documentos",
    "Gespeicherte Dokumente aktualisieren",
    "저장 자료 새로고침"
  ],
  "原本の値・単位・対象型式を確認しました。": [
    "I checked the source values, units and model designation.",
    "J’ai vérifié les valeurs, unités et références dans l’original.",
    "He verificado valores, unidades y modelo en el original.",
    "Ho verificato valori, unità e modello nell’originale.",
    "Verifiquei valores, unidades e modelo no original.",
    "Originalwerte, Einheiten und Modellbezeichnung sind geprüft.",
    "원본의 값·단위·대상 형식을 확인했습니다."
  ],
  "計算に使用するモデルは実機の放射特性を再現するものではなく、近似として使用します。": [
    "I use the calculation model as an approximation; it does not reproduce the installed antenna pattern.",
    "J’utilise le modèle comme approximation ; il ne reproduit pas le diagramme de l’antenne installée.",
    "Uso el modelo como aproximación; no reproduce el patrón de la antena instalada.",
    "Uso il modello come approssimazione; non riproduce il diagramma dell’antenna installata.",
    "Uso o modelo como aproximação; não reproduz o diagrama da antena instalada.",
    "Das Rechenmodell dient als Näherung und bildet das eingebaute Antennendiagramm nicht nach.",
    "계산 모델은 근사로 사용하며 실제 탑재 안테나의 방사 특성을 재현하지 않습니다."
  ],
  "原本をダウンロード": [
    "Download source",
    "Télécharger l’original",
    "Descargar original",
    "Scarica originale",
    "Transferir original",
    "Original herunterladen",
    "원본 다운로드"
  ],
  "読取候補を表示": [
    "Show extracted candidates",
    "Afficher les candidats",
    "Mostrar candidatos",
    "Mostra candidati",
    "Mostrar candidatos",
    "Lesekandidaten anzeigen",
    "읽기 후보 표시"
  ],
  "この候補を確認・編集": [
    "Review and edit candidate",
    "Vérifier et modifier",
    "Revisar y editar",
    "Verifica e modifica",
    "Rever e editar",
    "Kandidaten prüfen/bearbeiten",
    "이 후보 확인·편집"
  ],
  "読取値": [
    "Extracted value",
    "Valeur extraite",
    "Valor extraído",
    "Valore estratto",
    "Valor extraído",
    "Gelesener Wert",
    "읽기 값"
  ],
  "ページ・根拠": [
    "Page / evidence",
    "Page / preuve",
    "Página / evidencia",
    "Pagina / evidenza",
    "Página / evidência",
    "Seite / Beleg",
    "페이지·근거"
  ],
  "メーカー": [
    "Manufacturer",
    "Fabricant",
    "Fabricante",
    "Produttore",
    "Fabricante",
    "Hersteller",
    "제조사"
  ],
  "型式": [
    "Model designation",
    "Référence du modèle",
    "Designación del modelo",
    "Sigla modello",
    "Designação do modelo",
    "Modellbezeichnung",
    "형식"
  ],
  "アンテナ方式": [
    "Antenna type",
    "Type d’antenne",
    "Tipo de antena",
    "Tipo di antenna",
    "Tipo de antena",
    "Antennentyp",
    "안테나 방식"
  ],
  "搭載・設置方式": [
    "Installation / mounting",
    "Installation / montage",
    "Instalación / montaje",
    "Installazione / montaggio",
    "Instalação / montagem",
    "Einbau / Montage",
    "탑재·설치 방식"
  ],
  "物理全長 m": [
    "Physical length m",
    "Longueur physique m",
    "Longitud física m",
    "Lunghezza fisica m",
    "Comprimento físico m",
    "Physische Länge m",
    "물리적 전체 길이 m"
  ],
  "電気長 m": [
    "Electrical length m",
    "Longueur électrique m",
    "Longitud eléctrica m",
    "Lunghezza elettrica m",
    "Comprimento elétrico m",
    "Elektrische Länge m",
    "전기적 길이 m"
  ],
  "最低周波数 MHz": [
    "Minimum frequency MHz",
    "Fréquence minimale MHz",
    "Frecuencia mínima MHz",
    "Frequenza minima MHz",
    "Frequência mínima MHz",
    "Mindestfrequenz MHz",
    "최저 주파수 MHz"
  ],
  "最高周波数 MHz": [
    "Maximum frequency MHz",
    "Fréquence maximale MHz",
    "Frecuencia máxima MHz",
    "Frequenza massima MHz",
    "Frequência máxima MHz",
    "Höchstfrequenz MHz",
    "최고 주파수 MHz"
  ],
  "許容電力 W": [
    "Power rating W",
    "Puissance admissible W",
    "Potencia admisible W",
    "Potenza ammessa W",
    "Potência admissível W",
    "Belastbarkeit W",
    "허용 전력 W"
  ],
  "モデル注記": [
    "Model notes",
    "Notes du modèle",
    "Notas del modelo",
    "Note sul modello",
    "Notas do modelo",
    "Modellhinweise",
    "모델 참고"
  ],
  "HFロングワイヤー": [
    "HF long wire",
    "Fil long HF",
    "Hilo largo HF",
    "Filo lungo HF",
    "Fio longo HF",
    "HF-Langdraht",
    "HF 롱와이어"
  ],
  "資料は8 MiB以下です": [
    "Documents must be at most 8 MiB.",
    "Le document doit faire au plus 8 Mio.",
    "El documento debe tener como máximo 8 MiB.",
    "Il documento deve essere al massimo 8 MiB.",
    "O documento deve ter no máximo 8 MiB.",
    "Dokumente dürfen höchstens 8 MiB groß sein.",
    "자료는 최대 8 MiB입니다."
  ],
  "生成AIで資料を読取り中です。完了するまでお待ちください。": [
    "AI is reading the document. Please wait.",
    "L’IA lit le document. Patientez.",
    "La IA está leyendo el documento. Espere.",
    "L’IA sta leggendo il documento. Attendi.",
    "A IA está a ler o documento. Aguarde.",
    "Die KI liest das Dokument. Bitte warten.",
    "생성 AI가 자료를 읽는 중입니다. 완료될 때까지 기다려 주세요."
  ],
  "読取りが完了しました。候補の原本・単位を確認して登録してください。": [
    "Reading complete. Verify the source and units before registering candidates.",
    "Lecture terminée. Vérifiez l’original et les unités avant l’enregistrement.",
    "Lectura completada. Verifique el original y las unidades antes de registrar.",
    "Lettura completata. Verifica originale e unità prima di registrare.",
    "Leitura concluída. Verifique original e unidades antes de registar.",
    "Lesen abgeschlossen. Vor Registrierung Original und Einheiten prüfen.",
    "읽기가 완료되었습니다. 원본과 단위를 확인한 뒤 후보를 등록하세요."
  ],
  "アンテナ候補を読み取れませんでした。資料の画質・対象ページを確認してください。": [
    "No antenna candidates found. Check image quality and source pages.",
    "Aucun candidat trouvé. Vérifiez la qualité et les pages.",
    "No se encontraron candidatos. Revise calidad y páginas.",
    "Nessun candidato trovato. Verifica qualità e pagine.",
    "Nenhum candidato encontrado. Verifique qualidade e páginas.",
    "Keine Antennenkandidaten gefunden. Bildqualität und Seiten prüfen.",
    "안테나 후보를 읽지 못했습니다. 화질과 대상 페이지를 확인하세요."
  ],
  "OPENAI_API_KEYとHF_ANTENNA_OCR_MODELを設定してください": [
    "Set OPENAI_API_KEY and HF_ANTENNA_OCR_MODEL.",
    "Définissez OPENAI_API_KEY et HF_ANTENNA_OCR_MODEL.",
    "Configure OPENAI_API_KEY y HF_ANTENNA_OCR_MODEL.",
    "Imposta OPENAI_API_KEY e HF_ANTENNA_OCR_MODEL.",
    "Defina OPENAI_API_KEY e HF_ANTENNA_OCR_MODEL.",
    "OPENAI_API_KEY und HF_ANTENNA_OCR_MODEL setzen.",
    "OPENAI_API_KEY와 HF_ANTENNA_OCR_MODEL을 설정하세요."
  ],
  "参照中のアンテナプリセットを先に削除してください": [
    "Remove referencing antenna presets first.",
    "Supprimez d’abord les préréglages liés.",
    "Elimine primero los ajustes vinculados.",
    "Elimina prima i preset collegati.",
    "Elimine primeiro os predefinidos associados.",
    "Zuerst verknüpfte Antennenvorgaben löschen.",
    "참조 중인 안테나 프리셋을 먼저 삭제하세요."
  ],
  "資料を読み込めませんでした": [
    "Could not read the file.",
    "Impossible de lire le fichier.",
    "No se pudo leer el archivo.",
    "Impossibile leggere il file.",
    "Não foi possível ler o ficheiro.",
    "Datei konnte nicht gelesen werden.",
    "자료 파일을 읽지 못했습니다."
  ],
  "AI・モデル・APIキー設定": [
    "AI, model and API key settings",
    "Réglages IA, modèle et clé API",
    "Ajustes de IA, modelo y clave API",
    "Impostazioni IA, modello e chiave API",
    "Definições de IA, modelo e chave API",
    "KI-, Modell- und API-Schlüssel-Einstellungen",
    "AI·모델·API 키 설정"
  ],
  "使用するAI": [
    "AI provider",
    "Fournisseur IA",
    "Proveedor de IA",
    "Fornitore IA",
    "Fornecedor de IA",
    "KI-Anbieter",
    "사용할 AI"
  ],
  "モデル（一覧から選択・直接入力可）": [
    "Model (select or enter ID)",
    "Modèle (liste ou ID)",
    "Modelo (lista o ID)",
    "Modello (elenco o ID)",
    "Modelo (lista ou ID)",
    "Modell (auswählen oder ID eingeben)",
    "모델 (목록 선택·직접 입력)"
  ],
  "APIキー（空欄は現在の設定を維持）": [
    "API key (blank keeps current key)",
    "Clé API (vide : conserver)",
    "Clave API (vacío: conservar)",
    "Chiave API (vuoto: conserva)",
    "Chave API (vazio: manter)",
    "API-Schlüssel (leer: beibehalten)",
    "API 키 (공란은 현재 설정 유지)"
  ],
  "ローカル接続先": [
    "Local endpoint",
    "Point de connexion local",
    "Servidor local",
    "Endpoint locale",
    "Servidor local",
    "Lokaler Endpunkt",
    "로컬 접속 주소"
  ],
  "ローカルAPI形式": [
    "Local API format",
    "Format API local",
    "Formato API local",
    "Formato API locale",
    "Formato API local",
    "Lokales API-Format",
    "로컬 API 형식"
  ],
  "保存したキーを削除し、環境変数へ戻す": [
    "Delete saved key and use environment",
    "Supprimer la clé enregistrée et utiliser l’environnement",
    "Eliminar clave guardada y usar entorno",
    "Elimina chiave salvata e usa ambiente",
    "Eliminar chave guardada e usar ambiente",
    "Gespeicherten Schlüssel löschen und Umgebung nutzen",
    "저장 키 삭제 후 환경 변수 사용"
  ],
  "接続確認・モデル一覧を取得": [
    "Check connection / fetch models",
    "Vérifier / charger les modèles",
    "Comprobar / obtener modelos",
    "Verifica / carica modelli",
    "Verificar / obter modelos",
    "Verbindung prüfen / Modelle abrufen",
    "접속 확인·모델 목록 가져오기"
  ],
  "このAI・モデルを保存して使用": [
    "Save and use this AI / model",
    "Enregistrer et utiliser cette IA / ce modèle",
    "Guardar y usar esta IA / modelo",
    "Salva e usa IA / modello",
    "Guardar e usar IA / modelo",
    "Diese KI / dieses Modell speichern und nutzen",
    "이 AI·모델 저장 후 사용"
  ],
  "AI設定を再読込": [
    "Reload AI settings",
    "Recharger les réglages IA",
    "Recargar ajustes de IA",
    "Ricarica impostazioni IA",
    "Recarregar definições de IA",
    "KI-Einstellungen neu laden",
    "AI 설정 다시 읽기"
  ],
  "APIキーの取得手順": [
    "How to obtain an API key",
    "Obtenir une clé API",
    "Cómo obtener una clave API",
    "Come ottenere una chiave API",
    "Como obter uma chave API",
    "API-Schlüssel beschaffen",
    "API 키 발급 절차"
  ],
  "キー発行・公式手順を開く": [
    "Open key issuance / official guide",
    "Ouvrir la création de clé / le guide",
    "Abrir creación de clave / guía",
    "Apri creazione chiave / guida",
    "Abrir criação de chave / guia",
    "Schlüsselerstellung / offizielle Anleitung öffnen",
    "키 발급·공식 안내 열기"
  ],
  "APIキーは環境変数または保存設定から自動読込みします。各社アカウントからの自動発行・秘密キーの復元は行いません。": [
    "Keys load automatically from environment variables or saved settings. The app does not issue keys or recover their secrets from provider accounts.",
    "Les clés sont chargées depuis l’environnement ou les réglages enregistrés. L’application ne crée pas de clé et ne récupère pas de secret depuis les comptes.",
    "Las claves se cargan del entorno o de ajustes guardados. La aplicación no emite claves ni recupera secretos de las cuentas.",
    "Le chiavi si caricano da ambiente o impostazioni salvate. L’app non emette chiavi né recupera segreti dagli account.",
    "As chaves são carregadas do ambiente ou das definições guardadas. A aplicação não emite chaves nem recupera segredos das contas.",
    "Schlüssel werden aus Umgebung oder gespeicherten Einstellungen geladen. Die App erstellt keine Schlüssel und stellt keine Kontogeheimnisse wieder her.",
    "키는 환경 변수 또는 저장 설정에서 자동으로 읽습니다. 계정에서 키를 자동 발급하거나 비밀 키를 복구하지 않습니다."
  ],
  "モデル一覧はOCR対応を保証しません。画像・構造化出力対応を確認してください。ローカルLLMのPDFはページ画像へ変換して取り込んでください。": [
    "Listed models may not support OCR. Check image and structured output support. Convert PDF pages to images for local LLMs.",
    "La liste ne garantit pas l’OCR. Vérifiez images et sorties structurées. Convertissez les PDF en images pour les LLM locaux.",
    "La lista no garantiza OCR. Compruebe imágenes y salida estructurada. Convierta PDF en imágenes para LLM locales.",
    "L’elenco non garantisce OCR. Verifica immagini e output strutturato. Converti PDF in immagini per LLM locali.",
    "A lista não garante OCR. Verifique imagens e saída estruturada. Converta PDF em imagens para LLM locais.",
    "Die Liste garantiert keine OCR-Unterstützung. Bild- und strukturierte Ausgabe prüfen. PDF-Seiten für lokale LLMs in Bilder umwandeln.",
    "모델 목록은 OCR 지원을 보장하지 않습니다. 이미지·구조화 출력 지원을 확인하세요. 로컬 LLM용 PDF는 페이지 이미지로 변환하세요."
  ],
  "モデル一覧はOCR対応を保証しません。画像・構造化出力対応を確認してください。": [
    "Listed models may not support OCR. Check image and structured output support.",
    "La liste ne garantit pas l’OCR. Vérifiez images et sorties structurées.",
    "La lista no garantiza OCR. Compruebe imágenes y salida estructurada.",
    "L’elenco non garantisce OCR. Verifica immagini e output strutturato.",
    "A lista não garante OCR. Verifique imagens e saída estruturada.",
    "Die Liste garantiert keine OCR-Unterstützung. Bild- und strukturierte Ausgabe prüfen.",
    "모델 목록은 OCR 지원을 보장하지 않습니다. 이미지·구조화 출력 지원을 확인하세요."
  ],
  "資料を選択したAI接続先へ送信することと、クラウドAPIの利用料金を確認しました。": [
    "I acknowledge sending this document to the selected AI endpoint and the cloud API charges.",
    "Je confirme l’envoi au fournisseur IA choisi et les frais d’API cloud.",
    "Confirmo el envío al proveedor de IA elegido y los cargos de API en la nube.",
    "Confermo l’invio all’endpoint IA selezionato e i costi API cloud.",
    "Confirmo o envio ao servidor de IA escolhido e os custos de API cloud.",
    "Übermittlung an den gewählten KI-Endpunkt und Cloud-API-Kosten sind bestätigt.",
    "선택한 AI 접속 주소로 자료를 전송하며 클라우드 API 요금을 확인했습니다."
  ],
  "OpenAI Platformへログインし、使用するプロジェクトを選択します。": [
    "Sign in to OpenAI Platform and select your project.",
    "Connectez-vous à OpenAI Platform et choisissez le projet.",
    "Inicie sesión en OpenAI Platform y elija el proyecto.",
    "Accedi a OpenAI Platform e seleziona il progetto.",
    "Entre no OpenAI Platform e escolha o projeto.",
    "Bei OpenAI Platform anmelden und Projekt wählen.",
    "OpenAI Platform에 로그인하여 프로젝트를 선택합니다."
  ],
  "API keysでCreate new secret keyを実行し、キーをコピーします。": [
    "In API keys, choose Create new secret key and copy the key.",
    "Dans API keys, cliquez sur Create new secret key et copiez la clé.",
    "En API keys, pulse Create new secret key y copie la clave.",
    "In API keys scegli Create new secret key e copia la chiave.",
    "Em API keys, escolha Create new secret key e copie a chave.",
    "Unter API keys Create new secret key wählen und Schlüssel kopieren.",
    "API keys에서 Create new secret key를 실행하고 키를 복사합니다."
  ],
  "APIの請求・利用上限と、使用モデルへのアクセス権を確認します。": [
    "Check API billing, usage limits and model access.",
    "Vérifiez facturation API, limites et accès au modèle.",
    "Compruebe facturación API, límites y acceso al modelo.",
    "Verifica fatturazione API, limiti e accesso al modello.",
    "Verifique faturação API, limites e acesso ao modelo.",
    "API-Abrechnung, Nutzungslimits und Modellzugriff prüfen.",
    "API 결제·사용 한도와 모델 접근 권한을 확인합니다."
  ],
  "Claude Consoleへログインし、Settings → API keysを開きます。": [
    "Sign in to Claude Console and open Settings → API keys.",
    "Connectez-vous à Claude Console, puis Settings → API keys.",
    "Inicie sesión en Claude Console y abra Settings → API keys.",
    "Accedi a Claude Console e apri Settings → API keys.",
    "Entre na Claude Console e abra Settings → API keys.",
    "Bei Claude Console anmelden und Settings → API keys öffnen.",
    "Claude Console에 로그인하여 Settings → API keys를 엽니다."
  ],
  "Create keyで名前・有効期限・Linked accountを設定し、発行時のキーをコピーします。": [
    "Choose Create key, set name, expiration and Linked account, then copy the issued key.",
    "Choisissez Create key, définissez nom, expiration et Linked account, puis copiez la clé.",
    "Pulse Create key, indique nombre, caducidad y Linked account, y copie la clave.",
    "Scegli Create key, imposta nome, scadenza e Linked account, poi copia la chiave.",
    "Escolha Create key, defina nome, validade e Linked account, e copie a chave.",
    "Create key wählen, Name, Ablauf und Linked account setzen und Schlüssel kopieren.",
    "Create key에서 이름·만료·Linked account를 지정하고 발급된 키를 복사합니다."
  ],
  "APIの請求設定・利用枠を確認します。組織で権限がない場合は管理者へ依頼します。": [
    "Check API billing and quota. Ask your administrator if your organization restricts key creation.",
    "Vérifiez facturation et quota API. Demandez à l’administrateur si vos droits sont insuffisants.",
    "Compruebe facturación y cuota API. Solicite ayuda al administrador si faltan permisos.",
    "Verifica fatturazione e quota API. Chiedi all’amministratore se mancano i permessi.",
    "Verifique faturação e quota API. Peça ao administrador se não tiver permissões.",
    "API-Abrechnung und Kontingent prüfen. Bei fehlenden Rechten Administrator fragen.",
    "API 결제와 할당량을 확인합니다. 조직 권한이 없으면 관리자에게 요청합니다."
  ],
  "Google AI Studioへログインし、API keysを開きます。": [
    "Sign in to Google AI Studio and open API keys.",
    "Connectez-vous à Google AI Studio et ouvrez API keys.",
    "Inicie sesión en Google AI Studio y abra API keys.",
    "Accedi a Google AI Studio e apri API keys.",
    "Entre no Google AI Studio e abra API keys.",
    "Bei Google AI Studio anmelden und API keys öffnen.",
    "Google AI Studio에 로그인하여 API keys를 엽니다."
  ],
  "Create API keyで使用するプロジェクトを選び、キーを作成・コピーします。": [
    "Choose Create API key, select the project, then create and copy the key.",
    "Choisissez Create API key, sélectionnez le projet, créez et copiez la clé.",
    "Pulse Create API key, seleccione proyecto, cree y copie la clave.",
    "Scegli Create API key, seleziona progetto, crea e copia la chiave.",
    "Escolha Create API key, selecione o projeto, crie e copie a chave.",
    "Create API key wählen, Projekt auswählen, Schlüssel erstellen und kopieren.",
    "Create API key에서 프로젝트를 선택하고 키를 생성·복사합니다."
  ],
  "Gemini API用のキー制限と、プロジェクトの料金・割当を確認します。": [
    "Check Gemini API key restrictions and project billing/quota.",
    "Vérifiez restrictions de clé Gemini API, facturation et quota du projet.",
    "Compruebe restricciones de clave Gemini API, facturación y cuota.",
    "Verifica restrizioni chiave Gemini API, fatturazione e quota progetto.",
    "Verifique restrições da chave Gemini API, faturação e quota do projeto.",
    "Gemini-API-Schlüsselbeschränkungen sowie Projektkosten und Kontingente prüfen.",
    "Gemini API 키 제한과 프로젝트 요금·할당량을 확인합니다."
  ],
  "OllamaまたはOpenAI互換サーバーを起動し、画像対応モデルを用意します。": [
    "Start Ollama or an OpenAI-compatible server with an image-capable model.",
    "Démarrez Ollama ou un serveur compatible OpenAI avec un modèle visuel.",
    "Inicie Ollama o un servidor compatible con OpenAI con modelo de imágenes.",
    "Avvia Ollama o un server compatibile OpenAI con un modello visivo.",
    "Inicie Ollama ou servidor compatível OpenAI com um modelo de imagens.",
    "Ollama oder OpenAI-kompatiblen Server mit bildfähigem Modell starten.",
    "Ollama 또는 OpenAI 호환 서버를 시작하고 이미지 지원 모델을 준비합니다."
  ],
  "ローカル接続先とAPI形式を設定します。Dockerからホストへはhost.docker.internal等を指定します。": [
    "Set the local endpoint and API format. From Docker, use host.docker.internal or the host address.",
    "Réglez adresse locale et format API. Depuis Docker, utilisez host.docker.internal ou l’adresse hôte.",
    "Configure servidor local y formato API. Desde Docker use host.docker.internal o la dirección del host.",
    "Imposta endpoint locale e formato API. Da Docker usa host.docker.internal o l’indirizzo host.",
    "Defina servidor local e formato API. No Docker use host.docker.internal ou endereço do anfitrião.",
    "Lokalen Endpunkt und API-Format setzen. Aus Docker host.docker.internal oder Hostadresse nutzen.",
    "로컬 주소와 API 형식을 설정합니다. Docker에서는 host.docker.internal 등을 지정합니다."
  ],
  "認証なしのサーバーではキーは不要です。認証ありの場合はそのサーバーの管理者が設定したキーを入力します。": [
    "No key is needed for an unauthenticated local server. Otherwise enter the key configured by its administrator.",
    "Sans authentification locale, aucune clé n’est requise. Sinon, saisissez celle de l’administrateur.",
    "Un servidor local sin autenticación no necesita clave. Si la exige, use la clave del administrador.",
    "Un server locale senza autenticazione non richiede chiave. Altrimenti usa quella dell’amministratore.",
    "Sem autenticação local não é necessária chave. Caso contrário, use a chave do administrador.",
    "Lokale Server ohne Authentifizierung brauchen keinen Schlüssel. Sonst den vom Administrator gesetzten Schlüssel nutzen.",
    "인증 없는 로컬 서버는 키가 필요 없습니다. 인증이 있으면 관리자가 설정한 키를 입력합니다."
  ],
  "発行したキーを上のAPIキー欄へ貼り付け、モデル一覧を取得してモデルを選び、保存します。": [
    "Paste the key above, fetch the model list, select a model and save.",
    "Collez la clé ci-dessus, chargez les modèles, choisissez et enregistrez.",
    "Pegue la clave arriba, obtenga modelos, seleccione uno y guarde.",
    "Incolla la chiave sopra, carica i modelli, scegli e salva.",
    "Cole a chave acima, obtenha modelos, escolha e guarde.",
    "Schlüssel oben einfügen, Modellliste abrufen, Modell wählen und speichern.",
    "위 API 키 칸에 붙여넣고 목록에서 모델을 선택한 뒤 저장합니다."
  ],
  "チャットサービスへのログイン情報はAPIキーとして使用しません。APIの利用条件・料金は各社のAPI管理画面で確認してください。": [
    "Chat sign-in credentials are not API keys. Check API terms and billing in each provider’s console.",
    "Les identifiants du chat ne sont pas des clés API. Vérifiez conditions et tarifs dans chaque console.",
    "El acceso al chat no es una clave API. Consulte condiciones y tarifas en cada consola.",
    "Le credenziali chat non sono chiavi API. Verifica condizioni e costi nelle console.",
    "As credenciais de chat não são chaves API. Consulte condições e custos em cada consola.",
    "Chat-Anmeldedaten sind keine API-Schlüssel. API-Bedingungen und Kosten in der Anbieterkonsole prüfen.",
    "채팅 로그인 정보는 API 키가 아닙니다. API 조건과 요금은 각 사 관리 화면에서 확인하세요."
  ],
  "キー設定済み": [
    "Key configured",
    "Clé configurée",
    "Clave configurada",
    "Chiave configurata",
    "Chave configurada",
    "Schlüssel eingerichtet",
    "키 설정됨"
  ],
  "キー未設定": [
    "Key not configured",
    "Clé non configurée",
    "Clave sin configurar",
    "Chiave non configurata",
    "Chave não configurada",
    "Schlüssel nicht eingerichtet",
    "키 미설정"
  ],
  "保存設定": [
    "Saved settings",
    "Réglages enregistrés",
    "Ajustes guardados",
    "Impostazioni salvate",
    "Definições guardadas",
    "Gespeicherte Einstellungen",
    "저장 설정"
  ],
  "環境変数": [
    "Environment variables",
    "Variables d’environnement",
    "Variables de entorno",
    "Variabili di ambiente",
    "Variáveis de ambiente",
    "Umgebungsvariablen",
    "환경 변수"
  ],
  "未設定": [
    "Not configured",
    "Non configuré",
    "Sin configurar",
    "Non configurato",
    "Não configurado",
    "Nicht eingerichtet",
    "미설정"
  ],
  "ローカルはキー省略可": [
    "Key optional for local",
    "Clé facultative en local",
    "Clave opcional en local",
    "Chiave locale facoltativa",
    "Chave local opcional",
    "Lokaler Schlüssel optional",
    "로컬 키 생략 가능"
  ],
  "使用中:": [
    "Active:",
    "Actif :",
    "Activo:",
    "Attivo:",
    "Ativo:",
    "Aktiv:",
    "사용 중:"
  ],
  "モデル一覧を取得中です。": [
    "Fetching model list.",
    "Chargement des modèles.",
    "Obteniendo modelos.",
    "Caricamento modelli.",
    "A obter modelos.",
    "Modellliste wird abgerufen.",
    "모델 목록을 가져오는 중입니다."
  ],
  "接続確認済み": [
    "Connection verified",
    "Connexion vérifiée",
    "Conexión verificada",
    "Connessione verificata",
    "Ligação verificada",
    "Verbindung geprüft",
    "접속 확인됨"
  ],
  "AI接続設定を保存しました。": [
    "AI settings saved.",
    "Réglages IA enregistrés.",
    "Ajustes de IA guardados.",
    "Impostazioni IA salvate.",
    "Definições de IA guardadas.",
    "KI-Einstellungen gespeichert.",
    "AI 접속 설정을 저장했습니다."
  ],
  "AI設定で接続先・キー・モデルを設定してください": [
    "Configure provider, key and model in AI settings.",
    "Configurez fournisseur, clé et modèle dans les réglages IA.",
    "Configure proveedor, clave y modelo en ajustes de IA.",
    "Configura fornitore, chiave e modello nelle impostazioni IA.",
    "Configure fornecedor, chave e modelo nas definições de IA.",
    "Anbieter, Schlüssel und Modell in KI-Einstellungen festlegen.",
    "AI 설정에서 접속 주소·키·모델을 지정하세요."
  ],
  "外部データの取得時刻": [
    "External data acquisition times",
    "Heures d’acquisition externes",
    "Horas de adquisición de datos",
    "Orari di acquisizione dati",
    "Horas de aquisição de dados",
    "Abrufzeiten externer Daten",
    "외부 데이터 취득 시각"
  ],
  "最新データをまとめて取得": [
    "Refresh all external data",
    "Actualiser toutes les données",
    "Actualizar todos los datos",
    "Aggiorna tutti i dati",
    "Atualizar todos os dados",
    "Alle externen Daten aktualisieren",
    "최신 데이터 모두 가져오기"
  ],
  "最新データを取得": [
    "Fetch latest data",
    "Obtenir les dernières données",
    "Obtener datos recientes",
    "Ottieni dati recenti",
    "Obter dados recentes",
    "Aktuelle Daten abrufen",
    "최신 데이터 가져오기"
  ],
  "取得時刻は最後に取得に成功した時刻です。観測・発行時刻とは異なります。最新取得でも提供元の観測値が更新されていない場合があります。通信失敗時は以前の取得時刻を維持します。": [
    "Acquisition time is the last successful download, distinct from observation/publication time. Refreshing may return unchanged observations. Failed downloads retain the previous success time.",
    "L’acquisition indique le dernier téléchargement réussi, distinct de l’observation/publication. Une actualisation peut renvoyer les mêmes observations. Un échec conserve l’heure précédente.",
    "La adquisición indica la última descarga correcta, distinta de observación/publicación. Actualizar puede devolver observaciones sin cambios. Un fallo conserva la hora anterior.",
    "L’acquisizione è l’ultimo download riuscito, diverso da osservazione/pubblicazione. L’aggiornamento può restituire dati invariati. Gli errori conservano l’orario precedente.",
    "A aquisição é a última transferência bem-sucedida, distinta da observação/publicação. Atualizar pode devolver dados inalterados. Falhas mantêm a hora anterior.",
    "Abrufzeit ist der letzte erfolgreiche Download, getrennt von Beobachtungs-/Veröffentlichungszeit. Aktualisieren kann unveränderte Werte liefern. Bei Fehlern bleibt die letzte Erfolgszeit erhalten.",
    "취득 시각은 마지막 다운로드 성공 시각이며 관측·발행 시각과 다릅니다. 최신 조회에서도 관측값이 같을 수 있습니다. 통신 실패 시 이전 성공 시각을 유지합니다."
  ],
  "データソース": [
    "Data source",
    "Source des données",
    "Fuente de datos",
    "Fonte dati",
    "Fonte de dados",
    "Datenquelle",
    "데이터 출처"
  ],
  "観測・発行時刻": [
    "Observation / publication time",
    "Heure d’observation / publication",
    "Hora de observación / publicación",
    "Ora osservazione / pubblicazione",
    "Hora de observação / publicação",
    "Beobachtungs-/Veröffentlichungszeit",
    "관측·발행 시각"
  ],
  "最終取得成功 UTC": [
    "Last successful download UTC",
    "Dernier téléchargement réussi UTC",
    "Última descarga correcta UTC",
    "Ultimo download riuscito UTC",
    "Última transferência com sucesso UTC",
    "Letzter erfolgreicher Abruf UTC",
    "마지막 취득 성공 UTC"
  ],
  "取得状態": [
    "Acquisition status",
    "État d’acquisition",
    "Estado de adquisición",
    "Stato acquisizione",
    "Estado de aquisição",
    "Abrufstatus",
    "취득 상태"
  ],
  "月間系列・発行時刻不明": [
    "Monthly series; issue time unknown",
    "Série mensuelle ; publication inconnue",
    "Serie mensual; publicación desconocida",
    "Serie mensile; pubblicazione ignota",
    "Série mensal; publicação desconhecida",
    "Monatsreihe; Ausgabezeit unbekannt",
    "월간 계열·발행 시각 불명"
  ],
  "最新取得": [
    "Downloaded now",
    "Téléchargé maintenant",
    "Descargado ahora",
    "Scaricato ora",
    "Transferido agora",
    "Neu abgerufen",
    "최신 취득"
  ],
  "キャッシュ": [
    "Cached",
    "Cache",
    "Caché",
    "Cache",
    "Cache",
    "Zwischenspeicher",
    "캐시"
  ],
  "古いデータ": [
    "Stale data",
    "Données anciennes",
    "Datos antiguos",
    "Dati obsoleti",
    "Dados antigos",
    "Veraltete Daten",
    "오래된 데이터"
  ],
  "取得失敗": [
    "Download failed",
    "Échec du téléchargement",
    "Descarga fallida",
    "Download fallito",
    "Falha na transferência",
    "Abruf fehlgeschlagen",
    "취득 실패"
  ],
  "外部データを更新中です。": [
    "Refreshing external data.",
    "Actualisation des données externes.",
    "Actualizando datos externos.",
    "Aggiornamento dati esterni.",
    "A atualizar dados externos.",
    "Externe Daten werden aktualisiert.",
    "외부 데이터 업데이트 중입니다."
  ],
  "更新処理が完了しました。各ソースの取得状態を確認してください。": [
    "Refresh finished. Check each source’s acquisition status.",
    "Actualisation terminée. Vérifiez l’état de chaque source.",
    "Actualización finalizada. Revise el estado de cada fuente.",
    "Aggiornamento terminato. Controlla lo stato delle fonti.",
    "Atualização concluída. Verifique o estado de cada fonte.",
    "Aktualisierung abgeschlossen. Abrufstatus jeder Quelle prüfen.",
    "업데이트 처리가 완료되었습니다. 각 출처의 취득 상태를 확인하세요."
  ],
  "電波型式・受信品質": [
    "Emission class & reception quality",
    "Classe d’émission et qualité de réception",
    "Clase de emisión y calidad de recepción",
    "Classe di emissione e qualità di ricezione",
    "Classe de emissão e qualidade de recepção",
    "Sendeart und Empfangsqualität",
    "전파형식·수신 품질"
  ],
  "電波型式": [
    "Emission class",
    "Classe d’émission",
    "Clase de emisión",
    "Classe di emissione",
    "Classe de emissão",
    "Sendeart",
    "전파형식"
  ],
  "未指定": [
    "Unspecified",
    "Non précisée",
    "Sin especificar",
    "Non specificata",
    "Não especificada",
    "Nicht angegeben",
    "미지정"
  ],
  "電信": [
    "Telegraphy",
    "Télégraphie",
    "Telegrafía",
    "Telegrafia",
    "Telegrafia",
    "Telegrafie",
    "전신"
  ],
  "電話": [
    "Telephony",
    "Téléphonie",
    "Telefonía",
    "Telefonia",
    "Telefonia",
    "Telefonie",
    "전화"
  ],
  "データ": [
    "Data",
    "Données",
    "Datos",
    "Dati",
    "Dados",
    "Daten",
    "데이터"
  ],
  "A1A 電信（モールス・聴覚受信）": [
    "A1A Telegraphy (Morse, aural reception)",
    "A1A Télégraphie (Morse, réception auditive)",
    "A1A Telegrafía (Morse, recepción auditiva)",
    "A1A Telegrafia (Morse, ricezione uditiva)",
    "A1A Telegrafia (Morse, recepção auditiva)",
    "A1A Telegrafie (Morse, Hörempfang)",
    "A1A 전신(모스, 청각 수신)"
  ],
  "F1B 電信（FSK・自動受信）": [
    "F1B Telegraphy (FSK, automatic reception)",
    "F1B Télégraphie (FSK, réception automatique)",
    "F1B Telegrafía (FSK, recepción automática)",
    "F1B Telegrafia (FSK, ricezione automatica)",
    "F1B Telegrafia (FSK, recepção automática)",
    "F1B Telegrafie (FSK, automatischer Empfang)",
    "F1B 전신(FSK, 자동 수신)"
  ],
  "G1B 電信（PSK・自動受信）": [
    "G1B Telegraphy (PSK, automatic reception)",
    "G1B Télégraphie (PSK, réception automatique)",
    "G1B Telegrafía (PSK, recepción automática)",
    "G1B Telegrafia (PSK, ricezione automatica)",
    "G1B Telegrafia (PSK, recepção automática)",
    "G1B Telegrafie (PSK, automatischer Empfang)",
    "G1B 전신(PSK, 자동 수신)"
  ],
  "J2B 電信（SSB副搬送波・自動受信）": [
    "J2B Telegraphy (SSB subcarrier, automatic reception)",
    "J2B Télégraphie (sous-porteuse BLU, réception automatique)",
    "J2B Telegrafía (subportadora BLU, recepción automática)",
    "J2B Telegrafia (sottoportante SSB, ricezione automatica)",
    "J2B Telegrafia (subportadora SSB, recepção automática)",
    "J2B Telegrafie (SSB-Hilfsträger, automatischer Empfang)",
    "J2B 전신(SSB 부반송파, 자동 수신)"
  ],
  "A3E 電話（両側波帯AM）": [
    "A3E Telephony (double-sideband AM)",
    "A3E Téléphonie (AM double bande latérale)",
    "A3E Telefonía (AM de doble banda lateral)",
    "A3E Telefonia (AM a doppia banda laterale)",
    "A3E Telefonia (AM de banda lateral dupla)",
    "A3E Telefonie (Zweiseitenband-AM)",
    "A3E 전화(양측파대 AM)"
  ],
  "H3E 電話（SSB全搬送波）": [
    "H3E Telephony (SSB, full carrier)",
    "H3E Téléphonie (BLU, porteuse complète)",
    "H3E Telefonía (BLU, portadora completa)",
    "H3E Telefonia (SSB, portante intera)",
    "H3E Telefonia (SSB, portadora completa)",
    "H3E Telefonie (ESB, voller Träger)",
    "H3E 전화(SSB 전반송파)"
  ],
  "R3E 電話（SSB低減搬送波）": [
    "R3E Telephony (SSB, reduced carrier)",
    "R3E Téléphonie (BLU, porteuse réduite)",
    "R3E Telefonía (BLU, portadora reducida)",
    "R3E Telefonia (SSB, portante ridotta)",
    "R3E Telefonia (SSB, portadora reduzida)",
    "R3E Telefonie (ESB, reduzierter Träger)",
    "R3E 전화(SSB 저감반송파)"
  ],
  "J3E 電話（SSB抑圧搬送波）": [
    "J3E Telephony (SSB, suppressed carrier)",
    "J3E Téléphonie (BLU, porteuse supprimée)",
    "J3E Telefonía (BLU, portadora suprimida)",
    "J3E Telefonia (SSB, portante soppressa)",
    "J3E Telefonia (SSB, portadora suprimida)",
    "J3E Telefonie (ESB, unterdrückter Träger)",
    "J3E 전화(SSB 억압반송파)"
  ],
  "F3E 電話（FM）": [
    "F3E Telephony (FM)",
    "F3E Téléphonie (FM)",
    "F3E Telefonía (FM)",
    "F3E Telefonia (FM)",
    "F3E Telefonia (FM)",
    "F3E Telefonie (FM)",
    "F3E 전화(FM)"
  ],
  "F1D データ（FSK）": [
    "F1D Data (FSK)",
    "F1D Données (FSK)",
    "F1D Datos (FSK)",
    "F1D Dati (FSK)",
    "F1D Dados (FSK)",
    "F1D Daten (FSK)",
    "F1D 데이터(FSK)"
  ],
  "G1D データ（PSK）": [
    "G1D Data (PSK)",
    "G1D Données (PSK)",
    "G1D Datos (PSK)",
    "G1D Dati (PSK)",
    "G1D Dados (PSK)",
    "G1D Daten (PSK)",
    "G1D 데이터(PSK)"
  ],
  "J2D データ（SSB副搬送波）": [
    "J2D Data (SSB subcarrier)",
    "J2D Données (sous-porteuse BLU)",
    "J2D Datos (subportadora BLU)",
    "J2D Dati (sottoportante SSB)",
    "J2D Dados (subportadora SSB)",
    "J2D Daten (SSB-Hilfsträger)",
    "J2D 데이터(SSB 부반송파)"
  ],
  "占有帯域幅": [
    "Occupied bandwidth",
    "Largeur de bande occupée",
    "Ancho de banda ocupado",
    "Larghezza di banda occupata",
    "Largura de banda ocupada",
    "Belegte Bandbreite",
    "점유주파수대폭"
  ],
  "帯域内SNRと占有帯域幅から換算": [
    "Convert in-band SNR and occupied bandwidth",
    "Convertir SNR en bande et largeur occupée",
    "Convertir SNR en banda y ancho ocupado",
    "Converti SNR in banda e larghezza occupata",
    "Converter SNR na banda e largura ocupada",
    "Band-SNR und belegte Bandbreite umrechnen",
    "대역 내 SNR·점유주파수대폭으로 환산"
  ],
  "電波型式未指定": [
    "Emission class unspecified",
    "Classe d’émission non précisée",
    "Clase de emisión sin especificar",
    "Classe di emissione non specificata",
    "Classe de emissão não especificada",
    "Sendeart nicht angegeben",
    "전파형식 미지정"
  ],
  "電波型式の表記：{code}（占有帯域幅 {hz} Hz）": [
    "Emission designation: {code} (occupied bandwidth {hz} Hz)",
    "Désignation d’émission : {code} (largeur occupée {hz} Hz)",
    "Designación de emisión: {code} (ancho ocupado {hz} Hz)",
    "Designazione di emissione: {code} (larghezza occupata {hz} Hz)",
    "Designação de emissão: {code} (largura ocupada {hz} Hz)",
    "Sendeartbezeichnung: {code} (belegte Bandbreite {hz} Hz)",
    "전파형식 표기: {code}(점유주파수대폭 {hz} Hz)"
  ],
  "占有帯域幅 {hz} Hz": [
    "Occupied bandwidth {hz} Hz",
    "Largeur de bande occupée {hz} Hz",
    "Ancho de banda ocupado {hz} Hz",
    "Larghezza di banda occupata {hz} Hz",
    "Largura de banda ocupada {hz} Hz",
    "Belegte Bandbreite {hz} Hz",
    "점유주파수대폭 {hz} Hz"
  ],
  "占有帯域幅は3K00、2K40、500Hのように入力してください。": [
    "Enter the occupied bandwidth as 3K00, 2K40, 500H, etc.",
    "Saisir la largeur occupée sous la forme 3K00, 2K40, 500H, etc.",
    "Introduzca el ancho ocupado como 3K00, 2K40, 500H, etc.",
    "Inserire la larghezza occupata come 3K00, 2K40, 500H, ecc.",
    "Informe a largura ocupada como 3K00, 2K40, 500H etc.",
    "Belegte Bandbreite als 3K00, 2K40, 500H usw. eingeben.",
    "점유주파수대폭은 3K00, 2K40, 500H처럼 입력하세요."
  ],
  "A1A 24、J3E 45、A3E 67 dB·Hzは受信品質の例示値で変更可能です。占有帯域幅は電波型式の表記法（3桁の数字と小数点位置の単位文字H・K・M、例 3K00、2K40、500H）で入力します。その他の方式はモデム・符号化・速度・目標BER等に応じた値を指定してください。変調波形・帯域選択性・遅延拡散による復号性能は計算しません。": [
    "A1A 24, J3E 45 and A3E 67 dB·Hz are editable quality examples. Enter the occupied bandwidth in emission-designation notation (three figures with the unit letter H, K or M at the decimal point, e.g. 3K00, 2K40, 500H). For other modes use modem, coding, rate and target BER requirements. Waveforms, frequency selectivity and delay-spread decoding are not modeled.",
    "A1A 24, J3E 45 et A3E 67 dB·Hz sont des exemples modifiables. Saisir la largeur occupée selon la notation des désignations d’émission (trois chiffres, la lettre H, K ou M à la place de la virgule, p. ex. 3K00, 2K40, 500H). Autres modes : utiliser les exigences du modem, du codage, du débit et du BER. Pas de simulation de forme d’onde, sélectivité ou décodage avec étalement des retards.",
    "A1A 24, J3E 45 y A3E 67 dB·Hz son ejemplos editables. Introduzca el ancho ocupado en la notación de designación de emisiones (tres cifras con la letra H, K o M en lugar de la coma, p. ej. 3K00, 2K40, 500H). Para otros modos use los requisitos del módem, codificación, velocidad y BER. No se modelan formas de onda, selectividad ni decodificación con dispersión temporal.",
    "A1A 24, J3E 45 e A3E 67 dB·Hz sono esempi modificabili. Inserire la larghezza occupata nella notazione delle designazioni di emissione (tre cifre con la lettera H, K o M al posto della virgola, es. 3K00, 2K40, 500H). Per altri modi usare i requisiti di modem, codifica, velocità e BER. Forme d’onda, selettività e decodifica con dispersione temporale non sono modellate.",
    "A1A 24, J3E 45 e A3E 67 dB·Hz são exemplos editáveis. Informe a largura ocupada na notação de designação de emissão (três algarismos com a letra H, K ou M no lugar da vírgula, ex. 3K00, 2K40, 500H). Para outros modos use requisitos do modem, codificação, taxa e BER. Formas de onda, seletividade e decodificação com dispersão temporal não são modeladas.",
    "A1A 24, J3E 45 und A3E 67 dB·Hz sind veränderbare Qualitätsbeispiele. Belegte Bandbreite in der Sendeart-Notation eingeben (drei Ziffern, Einheitenbuchstabe H, K oder M an der Kommastelle, z. B. 3K00, 2K40, 500H). Für andere Verfahren gelten Modem-, Codierungs-, Datenraten- und BER-Anforderungen. Keine Wellenform-, Selektivitäts- oder Laufzeitspreizungs-Decodierungssimulation.",
    "A1A 24·J3E 45·A3E 67 dB·Hz는 수정 가능한 품질 예시입니다. 점유주파수대폭은 전파형식 표기법(세 자리 숫자와 소수점 위치의 단위 문자 H·K·M, 예 3K00, 2K40, 500H)으로 입력합니다. 다른 방식은 모뎀·부호화·속도·목표 BER에 맞춰 지정하세요. 파형·주파수 선택성·지연 확산에 따른 복호 성능은 계산하지 않습니다."
  ],
  "観測foF2から実効SSNを計算時に算出（今月のみ）": [
    "Effective SSN from observed foF2 at calculation (current month only)",
    "SSN effectif d’après la foF2 observée au calcul (mois en cours uniquement)",
    "SSN efectivo a partir de foF2 observada al calcular (solo mes actual)",
    "SSN effettivo dalla foF2 osservata al calcolo (solo mese corrente)",
    "SSN efetivo a partir da foF2 observada no cálculo (somente mês atual)",
    "Effektive SSN aus beobachteter foF2 bei Berechnung (nur aktueller Monat)",
    "관측 foF2로 계산 시 유효 SSN 산출(이번 달만)"
  ],
  "観測foF2から実効SSNを算出中…": [
    "Deriving effective SSN from observed foF2…",
    "Calcul de la SSN effective d’après la foF2 observée…",
    "Calculando el SSN efectivo a partir de foF2 observada…",
    "Calcolo dell’SSN effettivo dalla foF2 osservata…",
    "Calculando o SSN efetivo a partir da foF2 observada…",
    "Effektive SSN wird aus beobachteter foF2 berechnet…",
    "관측 foF2로 유효 SSN 산출 중…"
  ],
  "実効SSN（観測局の中央値）": [
    "Effective SSN (station median)",
    "SSN effective (médiane des stations)",
    "SSN efectivo (mediana de estaciones)",
    "SSN effettivo (mediana delle stazioni)",
    "SSN efetivo (mediana das estações)",
    "Effektive SSN (Stationsmedian)",
    "유효 SSN(관측소 중앙값)"
  ],
  "実効SSN {value}（{count}局の中央値、範囲 {low}〜{high}）。計算時に再算出します。": [
    "Effective SSN {value} (median of {count} stations, range {low}–{high}). Recomputed at calculation.",
    "SSN effective {value} (médiane de {count} stations, plage {low}–{high}). Recalculée au calcul.",
    "SSN efectivo {value} (mediana de {count} estaciones, rango {low}–{high}). Se recalcula al calcular.",
    "SSN effettivo {value} (mediana di {count} stazioni, intervallo {low}–{high}). Ricalcolato al calcolo.",
    "SSN efetivo {value} (mediana de {count} estações, faixa {low}–{high}). Recalculado no cálculo.",
    "Effektive SSN {value} (Median aus {count} Stationen, Bereich {low}–{high}). Wird bei der Berechnung neu bestimmt.",
    "유효 SSN {value}({count}개 관측소 중앙값, 범위 {low}~{high}). 계산 시 다시 산출합니다."
  ],
  "[除外]": [
    "[excluded]",
    "[exclue]",
    "[excluida]",
    "[esclusa]",
    "[excluída]",
    "[ausgeschlossen]",
    "[제외]"
  ],
  "メッシュ予測": [
    "Mesh forecast",
    "Prévision maillée",
    "Predicción de malla",
    "Previsione mesh",
    "Previsão de malha",
    "Mesh-Prognose",
    "메시 예측"
  ],
  "拠点間メッシュ · TX×RX のREL": [
    "Station mesh · TX×RX REL",
    "Maillage entre stations · REL TX×RX",
    "Malla entre estaciones · REL TX×RX",
    "Mesh tra stazioni · REL TX×RX",
    "Malha entre estações · REL TX×RX",
    "Stationsnetz · REL TX×RX",
    "거점 간 메시 · TX×RX REL"
  ],
  "メッシュを選ぶと、すべての拠点の組み合わせを両方向で計算します。行が送信拠点、列が受信拠点です。": [
    "With mesh selected, every pair of stations is calculated in both directions. Rows are transmitting stations, columns are receiving stations.",
    "En mode maillé, chaque paire de stations est calculée dans les deux sens. Les lignes sont les stations émettrices, les colonnes les stations réceptrices.",
    "En modo malla se calcula cada par de estaciones en ambos sentidos. Las filas son estaciones transmisoras y las columnas receptoras.",
    "In modalità mesh ogni coppia di stazioni viene calcolata in entrambe le direzioni. Le righe sono le stazioni trasmittenti, le colonne quelle riceventi.",
    "No modo malha, cada par de estações é calculado nos dois sentidos. As linhas são estações transmissoras e as colunas receptoras.",
    "Im Mesh-Modus wird jedes Stationspaar in beide Richtungen berechnet. Zeilen sind sendende, Spalten empfangende Stationen.",
    "메시를 선택하면 모든 거점 조합을 양방향으로 계산합니다. 행은 송신 거점, 열은 수신 거점입니다."
  ],
  "RELは月間統計であり、瞬時の受信可否ではありません。中継は各区間が目標REL以上かどうかだけで判定し、同時送信の干渉・チャネル割当は評価しません。": [
    "REL is a monthly statistic, not instantaneous reception. Relays are judged only by whether every hop meets the target REL; simultaneous-transmission interference and channel assignment are not evaluated.",
    "La REL est une statistique mensuelle, pas une réception instantanée. Les relais sont jugés uniquement selon que chaque saut atteint la REL cible ; les interférences d’émissions simultanées et l’attribution des canaux ne sont pas évaluées.",
    "REL es una estadística mensual, no la recepción instantánea. Los relevos se evalúan solo según si cada salto cumple la REL objetivo; no se evalúan la interferencia por transmisiones simultáneas ni la asignación de canales.",
    "La REL è una statistica mensile, non la ricezione istantanea. I relay sono valutati solo in base al fatto che ogni tratta raggiunga la REL obiettivo; l’interferenza da trasmissioni simultanee e l’assegnazione dei canali non sono valutate.",
    "REL é uma estatística mensal, não a recepção instantânea. As retransmissões são avaliadas apenas pelo fato de cada salto atingir a REL alvo; interferência de transmissões simultâneas e atribuição de canais não são avaliadas.",
    "REL ist eine Monatsstatistik, kein momentaner Empfang. Relais werden nur danach beurteilt, ob jeder Abschnitt die Ziel-REL erreicht; Störungen durch gleichzeitiges Senden und Kanalzuteilung werden nicht bewertet.",
    "REL은 월간 통계이며 순간 수신 여부가 아닙니다. 중계는 모든 구간이 목표 REL 이상인지로만 판정하며, 동시 송신 간섭과 채널 할당은 평가하지 않습니다."
  ],
  "計算後に、各UTC・周波数の拠点間RELを表示します。": [
    "After calculation, REL between stations is shown for each UTC hour and frequency.",
    "Après le calcul, la REL entre stations s’affiche pour chaque heure UTC et fréquence.",
    "Tras el cálculo se muestra la REL entre estaciones para cada hora UTC y frecuencia.",
    "Dopo il calcolo viene mostrata la REL tra stazioni per ogni ora UTC e frequenza.",
    "Após o cálculo, a REL entre estações é exibida para cada hora UTC e frequência.",
    "Nach der Berechnung wird die REL zwischen Stationen je UTC-Stunde und Frequenz angezeigt.",
    "계산 후 UTC 시각·주파수별 거점 간 REL을 표시합니다."
  ],
  "TX × RX マトリックス · REL（%）": [
    "TX × RX matrix · REL (%)",
    "Matrice TX × RX · REL (%)",
    "Matriz TX × RX · REL (%)",
    "Matrice TX × RX · REL (%)",
    "Matriz TX × RX · REL (%)",
    "TX × RX-Matrix · REL (%)",
    "TX × RX 매트릭스 · REL(%)"
  ],
  "周波数": [
    "Frequency",
    "Fréquence",
    "Frecuencia",
    "Frequenza",
    "Frequência",
    "Frequenz",
    "주파수"
  ],
  "最良周波数": [
    "Best frequency",
    "Meilleure fréquence",
    "Mejor frecuencia",
    "Frequenza migliore",
    "Melhor frequência",
    "Beste Frequenz",
    "최적 주파수"
  ],
  "▶ 再生": [
    "▶ Play",
    "▶ Lecture",
    "▶ Reproducir",
    "▶ Riproduci",
    "▶ Reproduzir",
    "▶ Abspielen",
    "▶ 재생"
  ],
  "■ 停止": [
    "■ Stop",
    "■ Arrêt",
    "■ Detener",
    "■ Ferma",
    "■ Parar",
    "■ Stopp",
    "■ 정지"
  ],
  "経路の詳細 · 周波数 × UTC": [
    "Link detail · frequency × UTC",
    "Détail de la liaison · fréquence × UTC",
    "Detalle del enlace · frecuencia × UTC",
    "Dettaglio collegamento · frequenza × UTC",
    "Detalhe do enlace · frequência × UTC",
    "Verbindungsdetails · Frequenz × UTC",
    "경로 상세 · 주파수 × UTC"
  ],
  "逆方向を表示": [
    "Show reverse direction",
    "Afficher le sens inverse",
    "Mostrar sentido inverso",
    "Mostra direzione inversa",
    "Mostrar sentido inverso",
    "Gegenrichtung anzeigen",
    "역방향 표시"
  ],
  "メッシュ（全拠点間を両方向で計算）": [
    "Mesh (calculate all station pairs in both directions)",
    "Maillage (toutes les paires de stations dans les deux sens)",
    "Malla (todos los pares de estaciones en ambos sentidos)",
    "Mesh (tutte le coppie di stazioni in entrambe le direzioni)",
    "Malha (todos os pares de estações nos dois sentidos)",
    "Mesh (alle Stationspaare in beide Richtungen)",
    "메시(모든 거점 간을 양방향으로 계산)"
  ],
  "メッシュでは全局が送受信する拠点になり、2〜8拠点（最大56経路）を計算します。": [
    "In mesh mode every station both transmits and receives; 2–8 stations (up to 56 links) are calculated.",
    "En mode maillé, chaque station émet et reçoit ; 2 à 8 stations (jusqu’à 56 liaisons) sont calculées.",
    "En modo malla cada estación transmite y recibe; se calculan de 2 a 8 estaciones (hasta 56 enlaces).",
    "In modalità mesh ogni stazione trasmette e riceve; si calcolano da 2 a 8 stazioni (fino a 56 collegamenti).",
    "No modo malha cada estação transmite e recebe; são calculadas de 2 a 8 estações (até 56 enlaces).",
    "Im Mesh-Modus sendet und empfängt jede Station; 2–8 Stationen (bis zu 56 Verbindungen) werden berechnet.",
    "메시에서는 모든 국이 송수신 거점이 되며 2~8개 거점(최대 56경로)을 계산합니다."
  ],
  "拠点{n} · 送受信": [
    "Station {n} · TX/RX",
    "Station {n} · émission/réception",
    "Estación {n} · TX/RX",
    "Stazione {n} · TX/RX",
    "Estação {n} · TX/RX",
    "Station {n} · Senden/Empfangen",
    "거점{n} · 송수신"
  ],
  "＋ 拠点を追加": [
    "+ Add station",
    "+ Ajouter une station",
    "+ Añadir estación",
    "+ Aggiungi stazione",
    "+ Adicionar estação",
    "+ Station hinzufügen",
    "+ 거점 추가"
  ],
  "メッシュ {n}拠点 · {count}経路": [
    "Mesh · {n} stations · {count} links",
    "Maillage · {n} stations · {count} liaisons",
    "Malla · {n} estaciones · {count} enlaces",
    "Mesh · {n} stazioni · {count} collegamenti",
    "Malha · {n} estações · {count} enlaces",
    "Mesh · {n} Stationen · {count} Verbindungen",
    "메시 {n}거점 · {count}경로"
  ],
  "メッシュ {n}拠点 · {count}組・双方向 {links}経路（短経路）": [
    "Mesh · {n} stations · {count} pairs, both directions {links} links (short path)",
    "Maillage · {n} stations · {count} paires, deux sens {links} liaisons (trajet court)",
    "Malla · {n} estaciones · {count} pares, ambos sentidos {links} enlaces (trayecto corto)",
    "Mesh · {n} stazioni · {count} coppie, entrambe le direzioni {links} collegamenti (percorso breve)",
    "Malha · {n} estações · {count} pares, ambos os sentidos {links} enlaces (caminho curto)",
    "Mesh · {n} Stationen · {count} Paare, beide Richtungen {links} Verbindungen (kurzer Weg)",
    "메시 {n}거점 · {count}쌍·양방향 {links}경로(단경로)"
  ],
  "メッシュの{n}経路を計算しています。完了までお待ちください…": [
    "Calculating {n} mesh links. Please wait…",
    "Calcul de {n} liaisons du maillage. Veuillez patienter…",
    "Calculando {n} enlaces de la malla. Espere…",
    "Calcolo di {n} collegamenti mesh in corso. Attendere…",
    "Calculando {n} enlaces da malha. Aguarde…",
    "{n} Mesh-Verbindungen werden berechnet. Bitte warten…",
    "메시 {n}경로를 계산하고 있습니다. 잠시 기다려 주세요…"
  ],
  "目標REL {target}% 以上: {count} / {total} 経路 · 双方向とも: {pairs} / {all} 組": [
    "Target REL {target}% or above: {count} / {total} links · both directions: {pairs} / {all} pairs",
    "REL cible {target}% ou plus : {count} / {total} liaisons · dans les deux sens : {pairs} / {all} paires",
    "REL objetivo {target}% o más: {count} / {total} enlaces · en ambos sentidos: {pairs} / {all} pares",
    "REL obiettivo {target}% o superiore: {count} / {total} collegamenti · in entrambe le direzioni: {pairs} / {all} coppie",
    "REL alvo {target}% ou mais: {count} / {total} enlaces · nos dois sentidos: {pairs} / {all} pares",
    "Ziel-REL {target}% oder höher: {count} / {total} Verbindungen · beide Richtungen: {pairs} / {all} Paare",
    "목표 REL {target}% 이상: {count} / {total}경로 · 양방향 모두: {pairs} / {all}쌍"
  ],
  "拠点間メッシュ": [
    "Station mesh",
    "Maillage entre stations",
    "Malla entre estaciones",
    "Mesh tra stazioni",
    "Malha entre estações",
    "Stationsnetz",
    "거점 간 메시"
  ],
  "メッシュは2〜8拠点にしてください。": [
    "Use 2–8 mesh stations.",
    "Utilisez 2 à 8 stations maillées.",
    "Use de 2 a 8 estaciones en la malla.",
    "Usa da 2 a 8 stazioni mesh.",
    "Use de 2 a 8 estações na malha.",
    "Bitte 2–8 Mesh-Stationen verwenden.",
    "메시는 2~8개 거점으로 지정하세요."
  ],
  "メッシュは2〜8拠点です。RXを7局以下にしてから選択してください。": [
    "Mesh supports 2–8 stations. Reduce RX to 7 or fewer before selecting it.",
    "Le maillage accepte 2 à 8 stations. Réduisez à 7 RX ou moins avant de le choisir.",
    "La malla admite de 2 a 8 estaciones. Reduzca a 7 RX o menos antes de elegirla.",
    "La mesh supporta da 2 a 8 stazioni. Riduci a 7 RX o meno prima di selezionarla.",
    "A malha aceita de 2 a 8 estações. Reduza para 7 RX ou menos antes de escolhê-la.",
    "Mesh unterstützt 2–8 Stationen. Vor der Auswahl auf höchstens 7 RX reduzieren.",
    "메시는 2~8개 거점입니다. RX를 7국 이하로 줄인 뒤 선택하세요."
  ],
  "送信電力は1〜100000 Wで指定してください。": [
    "Set transmit power between 1 and 100000 W.",
    "Indiquez une puissance d’émission de 1 à 100000 W.",
    "Indique una potencia de transmisión de 1 a 100000 W.",
    "Imposta una potenza di trasmissione tra 1 e 100000 W.",
    "Defina a potência de transmissão entre 1 e 100000 W.",
    "Sendeleistung zwischen 1 und 100000 W angeben.",
    "송신 전력을 1~100000 W로 지정하세요."
  ],
  "拠点": [
    "Stations",
    "Stations",
    "Estaciones",
    "Stazioni",
    "Estações",
    "Stationen",
    "거점"
  ],
  "保存アンテナ": [
    "Saved antenna",
    "Antenne enregistrée",
    "Antena guardada",
    "Antenna salvata",
    "Antena salva",
    "Gespeicherte Antenne",
    "저장된 안테나"
  ],
  "RELは各経路・UTC・周波数の月間統計です。VOACAPは送受信を入れ替えるとアンテナ・送信電力・受信雑音が変わるため、行（TX）と列（RX）の有向経路を別々に計算します。中継（多段ホップ）の到達性・同時送信の干渉・チャネル割当・経路間の相関はモデル化していません。経路ごとの生出力は保存しません。必要な場合は単一RXで再計算してください。": [
    "REL is a monthly statistic per link, UTC hour and frequency. Swapping TX and RX changes antennas, transmit power and receiver noise in VOACAP, so each directed link (row TX, column RX) is calculated separately. Multi-hop relay reachability, simultaneous-transmission interference, channel assignment and correlation between links are not modelled. Raw output per link is not stored; recalculate as a single RX if needed.",
    "La REL est une statistique mensuelle par liaison, heure UTC et fréquence. Inverser TX et RX change antennes, puissance d’émission et bruit de réception dans VOACAP ; chaque liaison orientée (ligne TX, colonne RX) est donc calculée séparément. L’accessibilité par relais multi-sauts, les interférences d’émissions simultanées, l’attribution des canaux et la corrélation entre liaisons ne sont pas modélisées. La sortie brute par liaison n’est pas conservée ; recalculez en RX unique si besoin.",
    "REL es una estadística mensual por enlace, hora UTC y frecuencia. Intercambiar TX y RX cambia antenas, potencia de transmisión y ruido de recepción en VOACAP, por lo que cada enlace dirigido (fila TX, columna RX) se calcula por separado. No se modelan la alcanzabilidad por relevo multisalto, la interferencia por transmisiones simultáneas, la asignación de canales ni la correlación entre enlaces. No se guarda la salida bruta por enlace; recalcule con un solo RX si la necesita.",
    "La REL è una statistica mensile per collegamento, ora UTC e frequenza. Scambiando TX e RX cambiano in VOACAP antenne, potenza di trasmissione e rumore di ricezione, quindi ogni collegamento orientato (riga TX, colonna RX) è calcolato separatamente. Raggiungibilità via relay multi-hop, interferenza da trasmissioni simultanee, assegnazione dei canali e correlazione tra collegamenti non sono modellate. L’output grezzo per collegamento non viene salvato; ricalcola con un solo RX se serve.",
    "REL é uma estatística mensal por enlace, hora UTC e frequência. Trocar TX e RX muda antenas, potência de transmissão e ruído de recepção no VOACAP, por isso cada enlace direcionado (linha TX, coluna RX) é calculado separadamente. Alcance por retransmissão multissalto, interferência de transmissões simultâneas, atribuição de canais e correlação entre enlaces não são modelados. A saída bruta por enlace não é salva; recalcule com um único RX se necessário.",
    "REL ist eine Monatsstatistik je Verbindung, UTC-Stunde und Frequenz. Das Vertauschen von TX und RX ändert in VOACAP Antennen, Sendeleistung und Empfangsrauschen, daher wird jede gerichtete Verbindung (Zeile TX, Spalte RX) getrennt berechnet. Erreichbarkeit über Multi-Hop-Relais, Störungen durch gleichzeitiges Senden, Kanalzuteilung und Korrelation zwischen Verbindungen werden nicht modelliert. Rohausgaben je Verbindung werden nicht gespeichert; bei Bedarf als einzelnen RX neu berechnen.",
    "REL은 경로·UTC 시각·주파수별 월간 통계입니다. VOACAP에서는 송수신을 바꾸면 안테나·송신 전력·수신 잡음이 달라지므로 행(TX)과 열(RX)의 방향별 경로를 따로 계산합니다. 다중 홉 중계 도달성, 동시 송신 간섭, 채널 할당, 경로 간 상관은 모델링하지 않습니다. 경로별 원시 출력은 저장하지 않으며, 필요하면 단일 RX로 다시 계산하세요."
  ],
  "拠点{n} · 偏波": [
    "Station {n} · polarization",
    "Station {n} · polarisation",
    "Estación {n} · polarización",
    "Stazione {n} · polarizzazione",
    "Estação {n} · polarização",
    "Station {n} · Polarisation",
    "거점{n} · 편파"
  ],
  "拠点を削除": [
    "Remove station",
    "Supprimer la station",
    "Eliminar estación",
    "Rimuovi stazione",
    "Remover estação",
    "Station entfernen",
    "거점 삭제"
  ],
  "送信アンテナプリセット": [
    "Transmit antenna preset",
    "Préréglage d’antenne d’émission",
    "Preajuste de antena de transmisión",
    "Preset antenna di trasmissione",
    "Predefinição da antena de transmissão",
    "Sendeantennen-Vorlage",
    "송신 안테나 프리셋"
  ],
  "受信アンテナプリセット": [
    "Receive antenna preset",
    "Préréglage d’antenne de réception",
    "Preajuste de antena de recepción",
    "Preset antenna di ricezione",
    "Predefinição da antena de recepção",
    "Empfangsantennen-Vorlage",
    "수신 안테나 프리셋"
  ],
  "送信と同じ": [
    "Same as transmit",
    "Identique à l’émission",
    "Igual que la de transmisión",
    "Uguale alla trasmissione",
    "Igual à de transmissão",
    "Wie Sendeantenne",
    "송신과 동일"
  ],
  "受信アンテナのプリセットを選択し直してください。": [
    "Select the receive antenna preset again.",
    "Sélectionnez de nouveau le préréglage d’antenne de réception.",
    "Vuelva a seleccionar el preajuste de antena de recepción.",
    "Seleziona di nuovo il preset dell’antenna di ricezione.",
    "Selecione novamente a predefinição da antena de recepção.",
    "Empfangsantennen-Vorlage erneut auswählen.",
    "수신 안테나 프리셋을 다시 선택하세요."
  ],
  "保存受信アンテナ": [
    "Saved receive antenna",
    "Antenne de réception enregistrée",
    "Antena de recepción guardada",
    "Antenna di ricezione salvata",
    "Antena de recepção salva",
    "Gespeicherte Empfangsantenne",
    "저장된 수신 안테나"
  ],
  "世界全体を表示": [
    "Show the whole world",
    "Afficher le monde entier",
    "Mostrar el mundo entero",
    "Mostra il mondo intero",
    "Mostrar o mundo inteiro",
    "Ganze Welt anzeigen",
    "전 세계 표시"
  ],
  "表示内容": [
    "Display",
    "Affichage",
    "Visualización",
    "Visualizzazione",
    "Exibição",
    "Anzeige",
    "표시 내용"
  ],
  "例 3K00、2K40、500H": [
    "e.g. 3K00, 2K40, 500H",
    "ex. 3K00, 2K40, 500H",
    "p. ej. 3K00, 2K40, 500H",
    "es. 3K00, 2K40, 500H",
    "ex. 3K00, 2K40, 500H",
    "z. B. 3K00, 2K40, 500H",
    "예: 3K00, 2K40, 500H"
  ],
  "全方向": [
    "Omnidirectional",
    "Omnidirectionnelle",
    "Omnidireccional",
    "Omnidirezionale",
    "Omnidirecional",
    "Rundstrahlend",
    "무지향성"
  ],
  "→ 相手局": [
    "→ other station",
    "→ station distante",
    "→ estación remota",
    "→ stazione remota",
    "→ estação remota",
    "→ Gegenstation",
    "→ 상대국"
  ],
  "水平ダイポール 全長10 m": [
    "Horizontal dipole, 10 m total length",
    "Dipôle horizontal, longueur totale 10 m",
    "Dipolo horizontal, longitud total 10 m",
    "Dipolo orizzontale, lunghezza totale 10 m",
    "Dipolo horizontal, comprimento total 10 m",
    "Horizontaler Dipol, Gesamtlänge 10 m",
    "수평 다이폴 전체 길이 10 m"
  ],
  "水平ダイポール 全長20 m": [
    "Horizontal dipole, 20 m total length",
    "Dipôle horizontal, longueur totale 20 m",
    "Dipolo horizontal, longitud total 20 m",
    "Dipolo orizzontale, lunghezza totale 20 m",
    "Dipolo horizontal, comprimento total 20 m",
    "Horizontaler Dipol, Gesamtlänge 20 m",
    "수평 다이폴 전체 길이 20 m"
  ],
  "水平ダイポール 全長40 m": [
    "Horizontal dipole, 40 m total length",
    "Dipôle horizontal, longueur totale 40 m",
    "Dipolo horizontal, longitud total 40 m",
    "Dipolo orizzontale, lunghezza totale 40 m",
    "Dipolo horizontal, comprimento total 40 m",
    "Horizontaler Dipol, Gesamtlänge 40 m",
    "수평 다이폴 전체 길이 40 m"
  ],
  "垂直ダイポール 全長10 m": [
    "Vertical dipole, 10 m total length",
    "Dipôle vertical, longueur totale 10 m",
    "Dipolo vertical, longitud total 10 m",
    "Dipolo verticale, lunghezza totale 10 m",
    "Dipolo vertical, comprimento total 10 m",
    "Vertikaler Dipol, Gesamtlänge 10 m",
    "수직 다이폴 전체 길이 10 m"
  ],
  "垂直ダイポール 全長20 m": [
    "Vertical dipole, 20 m total length",
    "Dipôle vertical, longueur totale 20 m",
    "Dipolo vertical, longitud total 20 m",
    "Dipolo verticale, lunghezza totale 20 m",
    "Dipolo vertical, comprimento total 20 m",
    "Vertikaler Dipol, Gesamtlänge 20 m",
    "수직 다이폴 전체 길이 20 m"
  ],
  "水平ログペリ 最長25 m・16素子": [
    "Horizontal log-periodic, longest element 25 m, 16 elements",
    "Log-périodique horizontale, élément le plus long 25 m, 16 éléments",
    "Log-periódica horizontal, elemento más largo 25 m, 16 elementos",
    "Log-periodica orizzontale, elemento più lungo 25 m, 16 elementi",
    "Log-periódica horizontal, elemento mais longo 25 m, 16 elementos",
    "Horizontale Logperiodische, längstes Element 25 m, 16 Elemente",
    "수평 로그 주기 최장 25 m·16소자"
  ],
  "逆L 水平部30 m・垂直部12 m": [
    "Inverted L, 30 m horizontal, 12 m vertical",
    "L inversé, 30 m horizontal, 12 m vertical",
    "L invertida, 30 m horizontal, 12 m vertical",
    "L rovesciata, 30 m orizzontale, 12 m verticale",
    "L invertido, 30 m horizontal, 12 m vertical",
    "Inverted-L, 30 m horizontal, 12 m vertikal",
    "역L 수평부 30 m·수직부 12 m"
  ],
  "スローパー 40 m・傾斜15°": [
    "Sloper, 40 m, 15° slope",
    "Sloper, 40 m, inclinaison 15°",
    "Sloper, 40 m, inclinación 15°",
    "Sloper, 40 m, inclinazione 15°",
    "Sloper, 40 m, inclinação 15°",
    "Sloper, 40 m, 15° Neigung",
    "슬로퍼 40 m·경사 15°"
  ],
  "USN AS-2537C/SR（寸法近似）": [
    "USN AS-2537C/SR (dimensional approximation)",
    "USN AS-2537C/SR (approximation dimensionnelle)",
    "USN AS-2537C/SR (aproximación dimensional)",
    "USN AS-2537C/SR (approssimazione dimensionale)",
    "USN AS-2537C/SR (aproximação dimensional)",
    "USN AS-2537C/SR (Maßnäherung)",
    "USN AS-2537C/SR(치수 근사)"
  ],
  "艦船 Comrod AT100D（寸法近似）": [
    "Shipboard Comrod AT100D (dimensional approximation)",
    "Navire Comrod AT100D (approximation dimensionnelle)",
    "Buque Comrod AT100D (aproximación dimensional)",
    "Nave Comrod AT100D (approssimazione dimensionale)",
    "Navio Comrod AT100D (aproximação dimensional)",
    "Schiff Comrod AT100D (Maßnäherung)",
    "함정 Comrod AT100D(치수 근사)"
  ],
  "艦船 Comrod AT83（寸法近似）": [
    "Shipboard Comrod AT83 (dimensional approximation)",
    "Navire Comrod AT83 (approximation dimensionnelle)",
    "Buque Comrod AT83 (aproximación dimensional)",
    "Nave Comrod AT83 (approssimazione dimensionale)",
    "Navio Comrod AT83 (aproximação dimensional)",
    "Schiff Comrod AT83 (Maßnäherung)",
    "함정 Comrod AT83(치수 근사)"
  ],
  "航空機 Chelton 455（参考資料）": [
    "Aircraft Chelton 455 (reference only)",
    "Aéronef Chelton 455 (référence)",
    "Aeronave Chelton 455 (solo referencia)",
    "Aeromobile Chelton 455 (solo riferimento)",
    "Aeronave Chelton 455 (apenas referência)",
    "Luftfahrzeug Chelton 455 (nur Referenz)",
    "항공기 Chelton 455(참고 자료)"
  ],
  "P-3 HFロングワイヤー（参考資料）": [
    "P-3 HF long wire (reference only)",
    "Long fil HF du P-3 (référence)",
    "Hilo largo HF del P-3 (solo referencia)",
    "Filo lungo HF del P-3 (solo riferimento)",
    "Fio longo HF do P-3 (apenas referência)",
    "P-3-HF-Langdraht (nur Referenz)",
    "P-3 HF 롱와이어(참고 자료)"
  ],
  "米海軍使用はメーカー公表。35 ft全高を単一モノポール長として近似。実放射素子長・基部・整合器・艦体・効率・実測利得は再現しない。地面定数は利用者の仮定。": [
    "US Navy use is per the manufacturer. The 35 ft overall height is approximated as a single monopole length. Actual radiator length, base, matching unit, hull, efficiency and measured gain are not reproduced. Ground constants are the user's assumption.",
    "Usage par l’US Navy selon le fabricant. La hauteur totale de 35 ft est approximée par une seule longueur de monopôle. La longueur rayonnante réelle, l’embase, la boîte d’accord, la coque, le rendement et le gain mesuré ne sont pas reproduits. Les constantes du sol sont une hypothèse de l’utilisateur.",
    "El uso por la US Navy consta según el fabricante. La altura total de 35 ft se aproxima como una única longitud de monopolo. No se reproducen la longitud radiante real, la base, el acoplador, el casco, la eficiencia ni la ganancia medida. Las constantes del suelo son una suposición del usuario.",
    "L’uso da parte della US Navy è dichiarato dal produttore. L’altezza totale di 35 ft è approssimata come un’unica lunghezza di monopolo. Lunghezza radiante reale, base, accordatore, scafo, efficienza e guadagno misurato non sono riprodotti. Le costanti del suolo sono un’ipotesi dell’utente.",
    "O uso pela US Navy é informado pelo fabricante. A altura total de 35 ft é aproximada como um único comprimento de monopolo. O comprimento radiante real, a base, o acoplador, o casco, a eficiência e o ganho medido não são reproduzidos. As constantes do solo são uma suposição do usuário.",
    "Einsatz bei der US Navy laut Hersteller. Die Gesamthöhe von 35 ft wird als eine Monopollänge angenähert. Tatsächliche Strahlerlänge, Fuß, Anpassgerät, Schiffsrumpf, Wirkungsgrad und gemessener Gewinn werden nicht nachgebildet. Bodenkonstanten sind Annahmen des Nutzers.",
    "미 해군 사용은 제조사 공표 기준. 전고 35 ft를 단일 모노폴 길이로 근사. 실제 방사 소자 길이·기부·정합기·선체·효율·실측 이득은 재현하지 않음. 지면 상수는 사용자의 가정."
  ],
  "メーカー公表の甲板設置HFモノポール、全高10 mを近似に使用。1.6–30 MHz。艦体・整合器・損失・実測パターンは未再現。特定国への採用は未確認。": [
    "Deck-mounted HF monopole per the manufacturer; its 10 m overall height is used for the approximation. 1.6–30 MHz. Hull, matching unit, losses and measured pattern are not reproduced. Adoption by any particular country is unconfirmed.",
    "Monopôle HF de pont selon le fabricant ; sa hauteur totale de 10 m sert à l’approximation. 1,6–30 MHz. Coque, boîte d’accord, pertes et diagramme mesuré non reproduits. Adoption par un pays donné non confirmée.",
    "Monopolo HF de cubierta según el fabricante; se usa su altura total de 10 m para la aproximación. 1,6–30 MHz. No se reproducen el casco, el acoplador, las pérdidas ni el diagrama medido. No se ha confirmado su adopción por ningún país.",
    "Monopolo HF da ponte secondo il produttore; l’altezza totale di 10 m è usata per l’approssimazione. 1,6–30 MHz. Scafo, accordatore, perdite e diagramma misurato non riprodotti. Adozione da parte di specifici paesi non confermata.",
    "Monopolo HF de convés segundo o fabricante; a altura total de 10 m é usada na aproximação. 1,6–30 MHz. Casco, acoplador, perdas e diagrama medido não reproduzidos. Adoção por algum país não confirmada.",
    "Deckmontierter HF-Monopol laut Hersteller; die Gesamthöhe von 10 m dient der Näherung. 1,6–30 MHz. Rumpf, Anpassgerät, Verluste und gemessenes Diagramm nicht nachgebildet. Einsatz in bestimmten Ländern unbestätigt.",
    "제조사 공표 갑판 설치 HF 모노폴, 전고 10 m를 근사에 사용. 1.6–30 MHz. 선체·정합기·손실·실측 패턴은 재현하지 않음. 특정 국가의 채택은 미확인."
  ],
  "メーカー公表のHF艦船ホイップ。物理全高8 m（電気長7.5 mとは区別）をモノポール近似に使用。1.6–30 MHz。艦体・整合器・給電方式・損失・実測パターンは未再現。特定国への採用は未確認。": [
    "Shipboard HF whip per the manufacturer. Its 8 m physical height (distinct from the 7.5 m electrical length) is used for the monopole approximation. 1.6–30 MHz. Hull, matching unit, feed, losses and measured pattern are not reproduced. Adoption by any particular country is unconfirmed.",
    "Fouet HF de navire selon le fabricant. Sa hauteur physique de 8 m (distincte de la longueur électrique de 7,5 m) sert à l’approximation monopôle. 1,6–30 MHz. Coque, boîte d’accord, alimentation, pertes et diagramme mesuré non reproduits. Adoption par un pays donné non confirmée.",
    "Látigo HF naval según el fabricante. Se usa su altura física de 8 m (distinta de la longitud eléctrica de 7,5 m) para la aproximación de monopolo. 1,6–30 MHz. No se reproducen el casco, el acoplador, la alimentación, las pérdidas ni el diagrama medido. No se ha confirmado su adopción por ningún país.",
    "Stilo HF navale secondo il produttore. L’altezza fisica di 8 m (distinta dalla lunghezza elettrica di 7,5 m) è usata per l’approssimazione a monopolo. 1,6–30 MHz. Scafo, accordatore, alimentazione, perdite e diagramma misurato non riprodotti. Adozione da parte di specifici paesi non confermata.",
    "Chicote HF naval segundo o fabricante. A altura física de 8 m (distinta do comprimento elétrico de 7,5 m) é usada na aproximação de monopolo. 1,6–30 MHz. Casco, acoplador, alimentação, perdas e diagrama medido não reproduzidos. Adoção por algum país não confirmada.",
    "HF-Schiffspeitsche laut Hersteller. Die physische Höhe von 8 m (nicht die elektrische Länge von 7,5 m) dient der Monopolnäherung. 1,6–30 MHz. Rumpf, Anpassgerät, Speisung, Verluste und gemessenes Diagramm nicht nachgebildet. Einsatz in bestimmten Ländern unbestätigt.",
    "제조사 공표 HF 함정 휩. 물리적 전고 8 m(전기적 길이 7.5 m와 구별)를 모노폴 근사에 사용. 1.6–30 MHz. 선체·정합기·급전 방식·손실·실측 패턴은 재현하지 않음. 특정 국가의 채택은 미확인."
  ],
  "固定翼・回転翼用HFタオルレール型、2–30 MHz。効率・偏波・放射パターンは取付けと機体に依存。共通の全長・機体込みパターン未取得のため計算選択不可。特定国・機種への採用は未確認。": [
    "HF towel-rail antenna for fixed- and rotary-wing aircraft, 2–30 MHz. Efficiency, polarization and radiation pattern depend on the installation and airframe. No common length or installed pattern is available, so it cannot be selected for calculation. Adoption by any particular country or aircraft type is unconfirmed.",
    "Antenne HF type « towel rail » pour voilures fixes et tournantes, 2–30 MHz. Rendement, polarisation et diagramme dépendent de l’installation et de l’appareil. Faute de longueur commune et de diagramme installé, elle ne peut pas être choisie pour le calcul. Adoption par un pays ou un type d’appareil non confirmée.",
    "Antena HF tipo «towel rail» para ala fija y rotatoria, 2–30 MHz. La eficiencia, la polarización y el diagrama dependen de la instalación y la aeronave. Sin longitud común ni diagrama instalado, no se puede seleccionar para el cálculo. No se ha confirmado su adopción por ningún país ni modelo.",
    "Antenna HF «towel rail» per ala fissa e rotante, 2–30 MHz. Efficienza, polarizzazione e diagramma dipendono dall’installazione e dal velivolo. Senza lunghezza comune né diagramma installato non è selezionabile per il calcolo. Adozione da parte di paesi o modelli non confermata.",
    "Antena HF tipo «towel rail» para asa fixa e rotativa, 2–30 MHz. Eficiência, polarização e diagrama dependem da instalação e da aeronave. Sem comprimento comum nem diagrama instalado, não pode ser selecionada para o cálculo. Adoção por algum país ou modelo não confirmada.",
    "HF-Towel-Rail-Antenne für Flächen- und Drehflügler, 2–30 MHz. Wirkungsgrad, Polarisation und Strahlungsdiagramm hängen von Einbau und Luftfahrzeug ab. Ohne gemeinsame Länge und Einbaudiagramm nicht für die Berechnung wählbar. Einsatz in bestimmten Ländern oder Mustern unbestätigt.",
    "고정익·회전익용 HF 타월 레일형, 2–30 MHz. 효율·편파·방사 패턴은 설치와 기체에 따라 다름. 공통 전장·기체 포함 패턴이 없어 계산에 선택 불가. 특정 국가·기종의 채택은 미확인."
  ],
  "メーカーのP-3用シャント改修説明で従来の2本式HFロングワイヤーを確認。全長・給電条件・機体込み実測指向性は未確認。2本を1本の全長として合算しない。各派生機の仕様や現在の搭載状態は断定しない。計算選択不可。": [
    "The manufacturer's P-3 shunt-antenna retrofit description confirms the former dual HF long wires. Length, feed conditions and measured installed directivity are unconfirmed. The two wires are not added together as one length. The specification of each variant and its current fit are not asserted. Cannot be selected for calculation.",
    "La description du fabricant de la modification shunt du P-3 confirme les anciens doubles longs fils HF. Longueur, alimentation et directivité installée mesurée non confirmées. Les deux fils ne sont pas additionnés en une seule longueur. La configuration de chaque variante et l’équipement actuel ne sont pas affirmés. Non sélectionnable pour le calcul.",
    "La descripción del fabricante de la modificación shunt del P-3 confirma los antiguos dos hilos largos HF. No se han confirmado la longitud, la alimentación ni la directividad instalada medida. Los dos hilos no se suman como una sola longitud. No se afirman la especificación de cada variante ni su equipamiento actual. No se puede seleccionar para el cálculo.",
    "La descrizione del produttore della modifica shunt del P-3 conferma i precedenti due fili lunghi HF. Lunghezza, alimentazione e direttività installata misurata non confermate. I due fili non vengono sommati in un’unica lunghezza. Specifiche delle varianti e dotazione attuale non sono affermate. Non selezionabile per il calcolo.",
    "A descrição do fabricante da modificação shunt do P-3 confirma os antigos dois fios longos HF. Comprimento, alimentação e diretividade instalada medida não confirmados. Os dois fios não são somados como um único comprimento. A especificação de cada variante e a instalação atual não são afirmadas. Não pode ser selecionada para o cálculo.",
    "Die Herstellerbeschreibung der P-3-Shunt-Umrüstung bestätigt die früheren zwei HF-Langdrähte. Länge, Speisung und gemessene Einbaurichtwirkung unbestätigt. Die zwei Drähte werden nicht zu einer Länge addiert. Ausstattung der einzelnen Varianten und aktueller Einbau werden nicht behauptet. Nicht für die Berechnung wählbar.",
    "제조사의 P-3용 션트 개조 설명에서 기존 2선식 HF 롱와이어를 확인. 전장·급전 조건·기체 포함 실측 지향성은 미확인. 2선을 하나의 전장으로 합산하지 않음. 각 파생형의 사양과 현재 탑재 상태는 단정하지 않음. 계산에 선택 불가."
  ],
  "参考資料のアンテナは計算に使用できません。": [
    "Reference-only antennas cannot be used for calculation.",
    "Les antennes de référence ne peuvent pas servir au calcul.",
    "Las antenas de referencia no se pueden usar para el cálculo.",
    "Le antenne di solo riferimento non possono essere usate per il calcolo.",
    "Antenas apenas de referência não podem ser usadas no cálculo.",
    "Reine Referenzantennen können nicht berechnet werden.",
    "참고 자료 안테나는 계산에 사용할 수 없습니다."
  ],
  "保存された地点・アンテナ設定が不正です": [
    "The saved location or antenna settings are invalid",
    "Les lieux ou antennes enregistrés sont invalides",
    "La configuración guardada de ubicación o antena no es válida",
    "Le impostazioni salvate di località o antenna non sono valide",
    "As configurações salvas de local ou antena são inválidas",
    "Gespeicherte Standort- oder Antenneneinstellungen sind ungültig",
    "저장된 지점·안테나 설정이 올바르지 않습니다"
  ],
  "稚内": [
    "Wakkanai",
    "Wakkanai",
    "Wakkanai",
    "Wakkanai",
    "Wakkanai",
    "Wakkanai",
    "왓카나이"
  ],
  "国分寺": [
    "Kokubunji",
    "Kokubunji",
    "Kokubunji",
    "Kokubunji",
    "Kokubunji",
    "Kokubunji",
    "고쿠분지"
  ],
  "山川": [
    "Yamagawa",
    "Yamagawa",
    "Yamagawa",
    "Yamagawa",
    "Yamagawa",
    "Yamagawa",
    "야마가와"
  ],
  "大宜味": [
    "Ogimi",
    "Ogimi",
    "Ogimi",
    "Ogimi",
    "Ogimi",
    "Ogimi",
    "오기미"
  ],
  "国内観測: {count}局。": [
    "Japan observations: {count} stations.",
    "Observations japonaises : {count} stations.",
    "Observaciones de Japón: {count} estaciones.",
    "Osservazioni del Giappone: {count} stazioni.",
    "Observações do Japão: {count} estações.",
    "Japanische Messungen: {count} Stationen.",
    "일본 관측: {count}개소."
  ],
  "国内観測: {count}局 [古い／取得失敗]。": [
    "Japan observations: {count} stations [stale / fetch failed].",
    "Observations japonaises : {count} stations [ancien / échec du chargement].",
    "Observaciones de Japón: {count} estaciones [antiguo / error de obtención].",
    "Osservazioni del Giappone: {count} stazioni [obsoleto / scaricamento fallito].",
    "Observações do Japão: {count} estações [antigo / falha na obtenção].",
    "Japanische Messungen: {count} Stationen [veraltet / Abruf fehlgeschlagen].",
    "일본 관측: {count}개소 [오래됨·가져오기 실패]."
  ],
  "国内観測: 欠測。": [
    "Japan observations: missing.",
    "Observations japonaises : manquantes.",
    "Observaciones de Japón: sin datos.",
    "Osservazioni del Giappone: mancanti.",
    "Observações do Japão: ausentes.",
    "Japanische Messungen: fehlend.",
    "일본 관측: 결측."
  ],
  "国内観測: 欠測 [古い／取得失敗]。": [
    "Japan observations: missing [stale / fetch failed].",
    "Observations japonaises : manquantes [ancien / échec du chargement].",
    "Observaciones de Japón: sin datos [antiguo / error de obtención].",
    "Osservazioni del Giappone: mancanti [obsoleto / scaricamento fallito].",
    "Observações do Japão: ausentes [antigo / falha na obtenção].",
    "Japanische Messungen: fehlend [veraltet / Abruf fehlgeschlagen].",
    "일본 관측: 결측 [오래됨·가져오기 실패]."
  ],
  "VOACAP回線予測（別条件の参考値）：{year}/{month}、{hour}:00 UTC、距離 {distance} km、MUF {muf} MHz。NICT観測の時刻・距離・場所とは一致しません。": [
    "VOACAP link forecast (reference under different conditions): {year}/{month}, {hour}:00 UTC, distance {distance} km, MUF {muf} MHz. Time, distance and place differ from the NICT observations.",
    "Prévision VOACAP de la liaison (référence dans d’autres conditions) : {year}/{month}, {hour}:00 UTC, distance {distance} km, MUF {muf} MHz. Heure, distance et lieu diffèrent des observations NICT.",
    "Predicción VOACAP del enlace (referencia en otras condiciones): {year}/{month}, {hour}:00 UTC, distancia {distance} km, MUF {muf} MHz. La hora, la distancia y el lugar no coinciden con las observaciones NICT.",
    "Previsione VOACAP del collegamento (riferimento in altre condizioni): {year}/{month}, {hour}:00 UTC, distanza {distance} km, MUF {muf} MHz. Ora, distanza e luogo non coincidono con le osservazioni NICT.",
    "Previsão VOACAP do enlace (referência em outras condições): {year}/{month}, {hour}:00 UTC, distância {distance} km, MUF {muf} MHz. Horário, distância e local diferem das observações NICT.",
    "VOACAP-Verbindungsprognose (Referenz unter anderen Bedingungen): {year}/{month}, {hour}:00 UTC, Entfernung {distance} km, MUF {muf} MHz. Zeit, Entfernung und Ort weichen von den NICT-Messungen ab.",
    "VOACAP 경로 예측(다른 조건의 참고값): {year}/{month}, {hour}:00 UTC, 거리 {distance} km, MUF {muf} MHz. NICT 관측의 시각·거리·장소와 일치하지 않습니다."
  ],
  "海外観測局の過去2時間のfoF2（MHz）。欠測や15分を超える間隔は接続しません。": [
    "foF2 (MHz) at the overseas station over the last 2 hours. Gaps and intervals over 15 minutes are not joined.",
    "foF2 (MHz) de la station étrangère sur les 2 dernières heures. Les lacunes et intervalles de plus de 15 minutes ne sont pas reliés.",
    "foF2 (MHz) de la estación extranjera en las últimas 2 horas. No se unen los huecos ni los intervalos de más de 15 minutos.",
    "foF2 (MHz) della stazione estera nelle ultime 2 ore. Dati mancanti e intervalli oltre 15 minuti non vengono collegati.",
    "foF2 (MHz) da estação estrangeira nas últimas 2 horas. Lacunas e intervalos acima de 15 minutos não são ligados.",
    "foF2 (MHz) der Auslandsstation in den letzten 2 Stunden. Lücken und Abstände über 15 Minuten werden nicht verbunden.",
    "해외 관측소의 최근 2시간 foF2(MHz). 결측이나 15분을 넘는 간격은 연결하지 않습니다."
  ],
  "D-RAP {time} / 古い（観測時刻から1時間超または時刻不正）": [
    "D-RAP {time} / stale (over 1 hour since observation, or invalid time)",
    "D-RAP {time} / ancien (plus d’1 heure depuis l’observation, ou heure invalide)",
    "D-RAP {time} / antiguo (más de 1 hora desde la observación o tiempo no válido)",
    "D-RAP {time} / obsoleto (oltre 1 ora dall’osservazione o orario non valido)",
    "D-RAP {time} / antigo (mais de 1 hora desde a observação ou horário inválido)",
    "D-RAP {time} / veraltet (über 1 Stunde seit der Messung oder ungültige Zeit)",
    "D-RAP {time} / 오래됨(관측 시각에서 1시간 초과 또는 시각 오류)"
  ],
  "{station} {time} / 古い観測値。再取得してください。": [
    "{station} {time} / stale observation. Please fetch again.",
    "{station} {time} / observation ancienne. Rechargez-la.",
    "{station} {time} / observación antigua. Vuelva a obtenerla.",
    "{station} {time} / osservazione obsoleta. Scaricala di nuovo.",
    "{station} {time} / observação antiga. Obtenha novamente.",
    "{station} {time} / veraltete Messung. Bitte erneut abrufen.",
    "{station} {time} / 오래된 관측값입니다. 다시 가져오세요."
  ],
  "HAF: 垂直伝搬で1 dB吸収の影響を受ける最高周波数（MHz）": [
    "HAF: highest frequency affected by 1 dB absorption on vertical propagation (MHz)",
    "HAF : fréquence maximale affectée par 1 dB d’absorption en propagation verticale (MHz)",
    "HAF: máxima frecuencia afectada por 1 dB de absorción en propagación vertical (MHz)",
    "HAF: massima frequenza interessata da 1 dB di assorbimento in propagazione verticale (MHz)",
    "HAF: maior frequência afetada por 1 dB de absorção na propagação vertical (MHz)",
    "HAF: höchste bei vertikaler Ausbreitung von 1 dB Absorption betroffene Frequenz (MHz)",
    "HAF: 수직 전파에서 1 dB 흡수 영향을 받는 최고 주파수(MHz)"
  ],
  "経路全体の損失やMUFではありません。0は吸収影響周波数0 MHz、欠測はnull。": [
    "Not total path loss or MUF. 0 means 0 MHz affected by absorption; missing is null.",
    "Ni perte totale du trajet ni MUF. 0 = 0 MHz affecté par l’absorption ; manquant = null.",
    "No es pérdida total del trayecto ni MUF. 0 = 0 MHz afectados por absorción; sin datos = null.",
    "Non è perdita totale del percorso né MUF. 0 = 0 MHz interessati dall’assorbimento; mancante = null.",
    "Não é perda total do percurso nem MUF. 0 = 0 MHz afetado por absorção; ausente = null.",
    "Weder Gesamtpfaddämpfung noch MUF. 0 = 0 MHz von Absorption betroffen; fehlend = null.",
    "경로 전체 손실이나 MUF가 아닙니다. 0은 흡수 영향 주파수 0 MHz, 결측은 null."
  ],
  "F領域のみ。距離別LUF/MUFは観測地点上空の垂直観測から導出した参考値で、指定回線の実測値ではありません。": [
    "F region only. LUF/MUF by distance are reference values derived from vertical soundings above each station, not measurements of your link.",
    "Région F uniquement. Les LUF/MUF par distance sont des valeurs de référence issues des sondages verticaux au-dessus de chaque station, pas des mesures de votre liaison.",
    "Solo región F. Los LUF/MUF por distancia son valores de referencia derivados de sondeos verticales sobre cada estación, no mediciones de su enlace.",
    "Solo regione F. LUF/MUF per distanza sono valori di riferimento ricavati da sondaggi verticali sopra ogni stazione, non misure del tuo collegamento.",
    "Somente região F. LUF/MUF por distância são valores de referência derivados de sondagens verticais sobre cada estação, não medições do seu enlace.",
    "Nur F-Region. LUF/MUF nach Entfernung sind aus Vertikallotungen über jeder Station abgeleitete Referenzwerte, keine Messungen Ihrer Verbindung.",
    "F 영역만. 거리별 LUF/MUF는 관측 지점 상공의 수직 관측에서 도출한 참고값이며 지정 경로의 실측값이 아닙니다."
  ],
  "自動読取・垂直観測からの推定": [
    "Auto-scaled, estimated from vertical soundings",
    "Lecture automatique, estimée à partir de sondages verticaux",
    "Lectura automática, estimada a partir de sondeos verticales",
    "Lettura automatica, stimata da sondaggi verticali",
    "Leitura automática, estimada a partir de sondagens verticais",
    "Automatisch ausgewertet, aus Vertikallotungen geschätzt",
    "자동 판독·수직 관측에서 추정"
  ],
  "取得再試行待ち／通信またはデータ形式を確認してください": [
    "Waiting to retry the fetch; check the connection or data format",
    "En attente de nouvel essai ; vérifiez la connexion ou le format des données",
    "Esperando para reintentar; compruebe la conexión o el formato de datos",
    "In attesa di riprovare; controlla la connessione o il formato dei dati",
    "Aguardando nova tentativa; verifique a conexão ou o formato dos dados",
    "Warte auf erneuten Abruf; Verbindung oder Datenformat prüfen",
    "가져오기 재시도 대기 중 / 통신 또는 데이터 형식을 확인하세요"
  ],
  "観測・障害情報は現在の状況。SSN取得方法で実効SSNを選んだ計算だけ、foF2観測からSSNを求めて使います。それ以外は月間VOACAP結果の信頼度・SNR・MUFを変更しません。": [
    "Observations and disturbance information show current conditions. Only calculations whose SSN source is effective SSN derive the SSN from foF2 observations. Otherwise they do not change the reliability, SNR or MUF of the monthly VOACAP results.",
    "Les observations et perturbations reflètent la situation actuelle. Seuls les calculs dont la source SSN est le SSN effectif dérivent le SSN des observations foF2. Sinon, la fiabilité, le SNR et la MUF des résultats VOACAP mensuels ne changent pas.",
    "Las observaciones y perturbaciones muestran la situación actual. Solo los cálculos cuya fuente de SSN es el SSN efectivo obtienen el SSN de las observaciones foF2. En los demás casos no cambian la fiabilidad, el SNR ni la MUF de los resultados VOACAP mensuales.",
    "Osservazioni e disturbi mostrano la situazione attuale. Solo i calcoli con fonte SSN effettivo ricavano l’SSN dalle osservazioni foF2. Negli altri casi affidabilità, SNR e MUF dei risultati VOACAP mensili non cambiano.",
    "Observações e perturbações mostram a situação atual. Somente cálculos com fonte de SSN efetivo derivam o SSN das observações foF2. Nos demais, a confiabilidade, o SNR e a MUF dos resultados VOACAP mensais não mudam.",
    "Messungen und Störungsmeldungen zeigen die aktuelle Lage. Nur Berechnungen mit effektiver SSN als SSN-Quelle leiten die SSN aus foF2-Messungen ab. Sonst bleiben Zuverlässigkeit, SNR und MUF der monatlichen VOACAP-Ergebnisse unverändert.",
    "관측·장애 정보는 현재 상황입니다. SSN 취득 방법으로 실효 SSN을 선택한 계산만 foF2 관측에서 SSN을 구해 사용합니다. 그 외에는 월간 VOACAP 결과의 신뢰도·SNR·MUF를 변경하지 않습니다."
  ],
  "海外観測局が不正です": [
    "Invalid overseas station",
    "Station étrangère invalide",
    "Estación extranjera no válida",
    "Stazione estera non valida",
    "Estação estrangeira inválida",
    "Ungültige Auslandsstation",
    "해외 관측소가 올바르지 않습니다"
  ],
  "GIRO利用条件に適合する環境でHF_GIRO_ENABLED=1を設定してください。": [
    "Set HF_GIRO_ENABLED=1 in an environment that meets the GIRO terms of use.",
    "Définissez HF_GIRO_ENABLED=1 dans un environnement conforme aux conditions GIRO.",
    "Configure HF_GIRO_ENABLED=1 en un entorno que cumpla las condiciones de GIRO.",
    "Imposta HF_GIRO_ENABLED=1 in un ambiente conforme alle condizioni GIRO.",
    "Defina HF_GIRO_ENABLED=1 em um ambiente que atenda às condições do GIRO.",
    "HF_GIRO_ENABLED=1 in einer Umgebung setzen, die die GIRO-Nutzungsbedingungen erfüllt.",
    "GIRO 이용 조건에 맞는 환경에서 HF_GIRO_ENABLED=1을 설정하세요."
  ],
  "SSNのみ計算入力に使用。F10.7・R/S/Gは参考表示です。瞬時の電離圏・磁気嵐による補正は行いません。NOAA公表SSN（SILSO V2尺度）は0.7倍して計算に使います（VOACAP Online Marineと同じ換算）。": [
    "Only SSN is used as calculation input. F10.7 and R/S/G are for reference. No correction is made for the instantaneous ionosphere or geomagnetic storms. The published NOAA SSN (SILSO V2 scale) is multiplied by 0.7 for the calculation (the same conversion as VOACAP Online Marine).",
    "Seul le SSN sert d’entrée au calcul. F10.7 et R/S/G sont indicatifs. Aucune correction pour l’ionosphère instantanée ni les orages géomagnétiques. Le SSN NOAA publié (échelle SILSO V2) est multiplié par 0,7 pour le calcul (même conversion que VOACAP Online Marine).",
    "Solo el SSN se usa como entrada del cálculo. F10.7 y R/S/G son de referencia. No se corrige por la ionosfera instantánea ni por tormentas geomagnéticas. El SSN publicado por NOAA (escala SILSO V2) se multiplica por 0,7 para el cálculo (la misma conversión que VOACAP Online Marine).",
    "Solo l’SSN è usato come input del calcolo. F10.7 e R/S/G sono indicativi. Nessuna correzione per la ionosfera istantanea o le tempeste geomagnetiche. L’SSN pubblicato da NOAA (scala SILSO V2) viene moltiplicato per 0,7 nel calcolo (la stessa conversione di VOACAP Online Marine).",
    "Somente o SSN é usado como entrada do cálculo. F10.7 e R/S/G são de referência. Não há correção para a ionosfera instantânea nem tempestades geomagnéticas. O SSN publicado pela NOAA (escala SILSO V2) é multiplicado por 0,7 no cálculo (a mesma conversão do VOACAP Online Marine).",
    "Nur die SSN fließt in die Berechnung ein. F10.7 und R/S/G sind Referenzwerte. Keine Korrektur für momentane Ionosphäre oder geomagnetische Stürme. Die veröffentlichte NOAA-SSN (SILSO-V2-Skala) wird für die Berechnung mit 0,7 multipliziert (dieselbe Umrechnung wie VOACAP Online Marine).",
    "SSN만 계산 입력에 사용합니다. F10.7·R/S/G는 참고 표시입니다. 순간 전리권·자기 폭풍에 의한 보정은 하지 않습니다. NOAA 공표 SSN(SILSO V2 척도)은 0.7배하여 계산에 사용합니다(VOACAP Online Marine과 같은 환산)."
  ],
  "取得を再試行待ちです": [
    "Waiting to retry the fetch",
    "En attente de nouvel essai",
    "Esperando para reintentar",
    "In attesa di riprovare",
    "Aguardando nova tentativa",
    "Warte auf erneuten Abruf",
    "가져오기 재시도 대기 중입니다"
  ],
  "SSN取得方法が不正です": [
    "Invalid SSN source",
    "Source SSN invalide",
    "Fuente de SSN no válida",
    "Fonte SSN non valida",
    "Fonte de SSN inválida",
    "Ungültige SSN-Quelle",
    "SSN 취득 방법이 올바르지 않습니다"
  ],
  "対象年月の新鮮な平滑SSNを取得できません。年月を確認するか手動入力に切り替えてください。": [
    "Cannot fetch a current smoothed SSN for the target month. Check the year and month or switch to manual input.",
    "Impossible d’obtenir un SSN lissé récent pour le mois visé. Vérifiez l’année et le mois ou passez en saisie manuelle.",
    "No se puede obtener un SSN suavizado actual para el mes objetivo. Compruebe el año y el mes o cambie a entrada manual.",
    "Impossibile ottenere un SSN livellato aggiornato per il mese scelto. Controlla anno e mese o passa all’inserimento manuale.",
    "Não foi possível obter um SSN suavizado atual para o mês alvo. Verifique ano e mês ou mude para entrada manual.",
    "Keine aktuelle geglättete SSN für den Zielmonat abrufbar. Jahr und Monat prüfen oder auf manuelle Eingabe umstellen.",
    "대상 연월의 최신 평활 SSN을 가져올 수 없습니다. 연월을 확인하거나 수동 입력으로 전환하세요."
  ],
  "NOAAデータを取得できませんでした": [
    "Could not fetch NOAA data",
    "Impossible d’obtenir les données NOAA",
    "No se pudieron obtener los datos de NOAA",
    "Impossibile scaricare i dati NOAA",
    "Não foi possível obter os dados da NOAA",
    "NOAA-Daten konnten nicht abgerufen werden",
    "NOAA 데이터를 가져오지 못했습니다"
  ],
  "観測地点上空のfoF2に、VOACAP（CCIR係数）の同じ地点・月・時刻のfoF2が一致するSSNを局ごとに求め、中央値を計算に使います。観測時点の電離圏を月間予測へ当てはめる近似で、磁気嵐中の急変や観測局から遠い経路の差は補正しません。対象年月が現在の月のときだけ使えます。": [
    "For each station, the SSN at which VOACAP (CCIR coefficients) gives the observed foF2 for the same place, month and time is found, and the median is used. This approximates the monthly forecast with the ionosphere at observation time and does not correct for sudden changes during storms or for paths far from the stations. Available only when the target month is the current month.",
    "Pour chaque station, on cherche le SSN pour lequel VOACAP (coefficients CCIR) donne la foF2 observée au même lieu, mois et heure, puis on utilise la médiane. Cette approximation applique l’ionosphère du moment à la prévision mensuelle et ne corrige ni les variations brusques pendant les orages ni les trajets éloignés des stations. Disponible uniquement si le mois visé est le mois en cours.",
    "Para cada estación se busca el SSN con el que VOACAP (coeficientes CCIR) da la foF2 observada en el mismo lugar, mes y hora, y se usa la mediana. Es una aproximación que aplica la ionosfera del momento a la predicción mensual y no corrige cambios bruscos durante tormentas ni trayectos lejanos a las estaciones. Solo disponible cuando el mes objetivo es el actual.",
    "Per ogni stazione si cerca l’SSN con cui VOACAP (coefficienti CCIR) restituisce la foF2 osservata nello stesso luogo, mese e ora, e se ne usa la mediana. È un’approssimazione che applica la ionosfera del momento alla previsione mensile e non corregge variazioni improvvise durante le tempeste né percorsi lontani dalle stazioni. Disponibile solo se il mese scelto è quello corrente.",
    "Para cada estação, procura-se o SSN com o qual o VOACAP (coeficientes CCIR) fornece a foF2 observada no mesmo local, mês e horário, e usa-se a mediana. É uma aproximação que aplica a ionosfera do momento à previsão mensal e não corrige mudanças bruscas durante tempestades nem percursos distantes das estações. Disponível apenas quando o mês alvo é o atual.",
    "Für jede Station wird die SSN gesucht, bei der VOACAP (CCIR-Koeffizienten) die gemessene foF2 für Ort, Monat und Uhrzeit liefert; verwendet wird der Median. Diese Näherung überträgt die aktuelle Ionosphäre auf die Monatsprognose und korrigiert weder Sprünge bei Stürmen noch Pfade fern der Stationen. Nur verfügbar, wenn der Zielmonat der aktuelle Monat ist.",
    "관측 지점 상공의 foF2에 대해, VOACAP(CCIR 계수)의 같은 지점·월·시각 foF2가 일치하는 SSN을 관측소별로 구하고 중앙값을 계산에 사용합니다. 관측 시점의 전리권을 월간 예측에 적용하는 근사이며, 자기 폭풍 중 급변이나 관측소에서 먼 경로의 차이는 보정하지 않습니다. 대상 연월이 현재 월일 때만 사용할 수 있습니다."
  ],
  "VOACAPの電離層出力を解釈できません": [
    "Cannot parse the VOACAP ionosphere output",
    "Impossible d’interpréter la sortie ionosphérique de VOACAP",
    "No se puede interpretar la salida ionosférica de VOACAP",
    "Impossibile interpretare l’output ionosferico di VOACAP",
    "Não foi possível interpretar a saída ionosférica do VOACAP",
    "VOACAP-Ionosphärenausgabe nicht auswertbar",
    "VOACAP 전리층 출력을 해석할 수 없습니다"
  ],
  "実効SSNは現在の月（UTC）の計算にだけ使えます。対象年月を今月にするか、別のSSN取得方法を選んでください。": [
    "Effective SSN can be used only for the current month (UTC). Set the target to this month or choose another SSN source.",
    "Le SSN effectif ne sert qu’au mois en cours (UTC). Choisissez ce mois ou une autre source SSN.",
    "El SSN efectivo solo sirve para el mes actual (UTC). Elija este mes u otra fuente de SSN.",
    "L’SSN effettivo vale solo per il mese corrente (UTC). Scegli questo mese o un’altra fonte SSN.",
    "O SSN efetivo só pode ser usado no mês atual (UTC). Escolha este mês ou outra fonte de SSN.",
    "Effektive SSN gilt nur für den aktuellen Monat (UTC). Diesen Monat oder eine andere SSN-Quelle wählen.",
    "실효 SSN은 현재 월(UTC) 계산에만 사용할 수 있습니다. 대상 연월을 이번 달로 하거나 다른 SSN 취득 방법을 선택하세요."
  ],
  "新しいfoF2観測が{min}局以上そろいません（使用可能 {count}局）。観測データを更新するか、別のSSN取得方法を選んでください。": [
    "Fewer than {min} recent foF2 observations are available (usable: {count}). Update the observations or choose another SSN source.",
    "Moins de {min} observations foF2 récentes disponibles (utilisables : {count}). Mettez à jour les observations ou choisissez une autre source SSN.",
    "Hay menos de {min} observaciones foF2 recientes (utilizables: {count}). Actualice las observaciones o elija otra fuente de SSN.",
    "Meno di {min} osservazioni foF2 recenti disponibili (utilizzabili: {count}). Aggiorna le osservazioni o scegli un’altra fonte SSN.",
    "Menos de {min} observações foF2 recentes disponíveis (utilizáveis: {count}). Atualize as observações ou escolha outra fonte de SSN.",
    "Weniger als {min} aktuelle foF2-Messungen (nutzbar: {count}). Messungen aktualisieren oder andere SSN-Quelle wählen.",
    "새 foF2 관측이 {min}개소 이상 모이지 않았습니다(사용 가능 {count}개소). 관측 데이터를 갱신하거나 다른 SSN 취득 방법을 선택하세요."
  ],
  "この地点・時刻ではfoF2がSSNに比例しないため除外": [
    "Excluded: foF2 does not scale with SSN at this place and time",
    "Exclu : la foF2 ne varie pas avec le SSN à ce lieu et cette heure",
    "Excluido: la foF2 no varía con el SSN en este lugar y hora",
    "Escluso: la foF2 non varia con l’SSN in questo luogo e ora",
    "Excluído: a foF2 não varia com o SSN neste local e horário",
    "Ausgeschlossen: foF2 skaliert hier und zu dieser Zeit nicht mit der SSN",
    "이 지점·시각에서는 foF2가 SSN에 비례하지 않아 제외"
  ],
  "太陽活動の範囲外の値（自動読取の誤りの可能性）のため除外": [
    "Excluded: value outside the solar-activity range (possible auto-scaling error)",
    "Exclu : valeur hors de la plage d’activité solaire (erreur de lecture automatique possible)",
    "Excluido: valor fuera del rango de actividad solar (posible error de lectura automática)",
    "Escluso: valore fuori dall’intervallo di attività solare (possibile errore di lettura automatica)",
    "Excluído: valor fora da faixa de atividade solar (possível erro de leitura automática)",
    "Ausgeschlossen: Wert außerhalb der Sonnenaktivität (möglicher Auswertungsfehler)",
    "태양 활동 범위 밖의 값(자동 판독 오류 가능성)이라 제외"
  ],
  "bandwidth: 範囲外です": [
    "bandwidth: out of range",
    "bandwidth : hors plage",
    "bandwidth: fuera de rango",
    "bandwidth: fuori intervallo",
    "bandwidth: fora do intervalo",
    "bandwidth: außerhalb des Bereichs",
    "bandwidth: 범위를 벗어났습니다"
  ],
  "modulation: 電波型式は3文字（例 J3E）で指定してください": [
    "modulation: enter the emission class as 3 characters (e.g. J3E)",
    "modulation : saisissez la classe d’émission en 3 caractères (ex. J3E)",
    "modulation: indique la clase de emisión con 3 caracteres (p. ej. J3E)",
    "modulation: indica la classe di emissione con 3 caratteri (es. J3E)",
    "modulation: informe a classe de emissão com 3 caracteres (ex. J3E)",
    "modulation: Sendeart mit 3 Zeichen angeben (z. B. J3E)",
    "modulation: 전파 형식은 3문자(예: J3E)로 지정하세요"
  ],
  "bandwidth: 占有帯域幅は表記法（例 3K00、500H）で指定してください": [
    "bandwidth: enter the occupied bandwidth in designator form (e.g. 3K00, 500H)",
    "bandwidth : saisissez la largeur de bande occupée au format normalisé (ex. 3K00, 500H)",
    "bandwidth: indique el ancho de banda ocupado en notación normalizada (p. ej. 3K00, 500H)",
    "bandwidth: indica la larghezza di banda occupata in notazione normalizzata (es. 3K00, 500H)",
    "bandwidth: informe a largura de banda ocupada na notação padrão (ex. 3K00, 500H)",
    "bandwidth: belegte Bandbreite in Normschreibweise angeben (z. B. 3K00, 500H)",
    "bandwidth: 점유 대역폭은 표기법(예: 3K00, 500H)으로 지정하세요"
  ],
  "bandwidth: 占有帯域幅を指定してください": [
    "bandwidth: enter the occupied bandwidth",
    "bandwidth : saisissez la largeur de bande occupée",
    "bandwidth: indique el ancho de banda ocupado",
    "bandwidth: indica la larghezza di banda occupata",
    "bandwidth: informe a largura de banda ocupada",
    "bandwidth: belegte Bandbreite angeben",
    "bandwidth: 점유 대역폭을 지정하세요"
  ],
  "azimuth_mode: fixed/pathで指定してください": [
    "azimuth_mode: use fixed or path",
    "azimuth_mode : utilisez fixed ou path",
    "azimuth_mode: use fixed o path",
    "azimuth_mode: usa fixed o path",
    "azimuth_mode: use fixed ou path",
    "azimuth_mode: fixed oder path angeben",
    "azimuth_mode: fixed/path로 지정하세요"
  ],
  "ログペリの給電点高は0.1 m以上です": [
    "A log-periodic feed point must be at least 0.1 m high",
    "Le point d’alimentation d’une log-périodique doit être à au moins 0,1 m",
    "El punto de alimentación de una log-periódica debe estar a 0,1 m o más",
    "Il punto di alimentazione di una log-periodica deve essere ad almeno 0,1 m",
    "O ponto de alimentação de uma log-periódica deve ter pelo menos 0,1 m",
    "Der Speisepunkt einer Logperiodischen muss mindestens 0,1 m hoch sein",
    "로그 주기의 급전점 높이는 0.1 m 이상입니다"
  ],
  "逆Lの垂直部の高さは0.1 m以上です": [
    "The vertical section of an inverted L must be at least 0.1 m high",
    "La partie verticale d’un L inversé doit mesurer au moins 0,1 m",
    "La parte vertical de una L invertida debe medir 0,1 m o más",
    "La parte verticale di una L rovesciata deve essere alta almeno 0,1 m",
    "A parte vertical de um L invertido deve ter pelo menos 0,1 m",
    "Der vertikale Teil einer Inverted-L muss mindestens 0,1 m hoch sein",
    "역L의 수직부 높이는 0.1 m 이상입니다"
  ],
  "水平ダイポールの地上高は0.1 m以上です": [
    "A horizontal dipole must be at least 0.1 m above ground",
    "Un dipôle horizontal doit être à au moins 0,1 m du sol",
    "Un dipolo horizontal debe estar a 0,1 m o más del suelo",
    "Un dipolo orizzontale deve essere ad almeno 0,1 m dal suolo",
    "Um dipolo horizontal deve estar a pelo menos 0,1 m do solo",
    "Ein horizontaler Dipol muss mindestens 0,1 m über dem Boden sein",
    "수평 다이폴의 지상고는 0.1 m 이상입니다"
  ],
  "JSONオブジェクトが必要です": [
    "A JSON object is required",
    "Un objet JSON est requis",
    "Se requiere un objeto JSON",
    "È richiesto un oggetto JSON",
    "É necessário um objeto JSON",
    "JSON-Objekt erforderlich",
    "JSON 객체가 필요합니다"
  ],
  "送信電力・ログペリ利得補正・偏波損失の組合せが計算範囲外です": [
    "The combination of transmit power, log-periodic gain correction and polarization loss is outside the calculation range",
    "La combinaison puissance d’émission, correction de gain log-périodique et perte de polarisation est hors plage de calcul",
    "La combinación de potencia de transmisión, corrección de ganancia log-periódica y pérdida de polarización está fuera del rango de cálculo",
    "La combinazione di potenza, correzione del guadagno log-periodico e perdita di polarizzazione è fuori dall’intervallo di calcolo",
    "A combinação de potência de transmissão, correção de ganho log-periódico e perda de polarização está fora da faixa de cálculo",
    "Die Kombination aus Sendeleistung, Logper-Gewinnkorrektur und Polarisationsverlust liegt außerhalb des Rechenbereichs",
    "송신 전력·로그 주기 이득 보정·편파 손실의 조합이 계산 범위를 벗어났습니다"
  ],
  "周波数は1〜11個で指定してください": [
    "Enter 1 to 11 frequencies",
    "Indiquez 1 à 11 fréquences",
    "Indique de 1 a 11 frecuencias",
    "Indica da 1 a 11 frequenze",
    "Informe de 1 a 11 frequências",
    "1 bis 11 Frequenzen angeben",
    "주파수는 1~11개로 지정하세요"
  ],
  "VOACAP出力を解釈できません。生出力とエンジン設定を確認してください。": [
    "Cannot parse the VOACAP output. Check the raw output and engine settings.",
    "Impossible d’interpréter la sortie VOACAP. Vérifiez la sortie brute et la configuration du moteur.",
    "No se puede interpretar la salida de VOACAP. Revise la salida bruta y la configuración del motor.",
    "Impossibile interpretare l’output VOACAP. Controlla l’output grezzo e le impostazioni del motore.",
    "Não foi possível interpretar a saída do VOACAP. Verifique a saída bruta e a configuração do motor.",
    "VOACAP-Ausgabe nicht auswertbar. Rohausgabe und Engine-Einstellungen prüfen.",
    "VOACAP 출력을 해석할 수 없습니다. 원시 출력과 엔진 설정을 확인하세요."
  ],
  "アンテナが不正です": [
    "Invalid antenna",
    "Antenne invalide",
    "Antena no válida",
    "Antenna non valida",
    "Antena inválida",
    "Ungültige Antenne",
    "안테나가 올바르지 않습니다"
  ],
  "計算エンジンが準備されていません。docker compose up --build で起動してください。": [
    "The calculation engine is not ready. Start it with docker compose up --build.",
    "Le moteur de calcul n’est pas prêt. Lancez-le avec docker compose up --build.",
    "El motor de cálculo no está listo. Inícielo con docker compose up --build.",
    "Il motore di calcolo non è pronto. Avvialo con docker compose up --build.",
    "O motor de cálculo não está pronto. Inicie-o com docker compose up --build.",
    "Die Rechen-Engine ist nicht bereit. Mit docker compose up --build starten.",
    "계산 엔진이 준비되지 않았습니다. docker compose up --build로 시작하세요."
  ],
  "24時間の結果が揃いません（{count}時間）": [
    "The 24-hour results are incomplete ({count} hours)",
    "Les résultats sur 24 heures sont incomplets ({count} heures)",
    "Los resultados de 24 horas están incompletos ({count} horas)",
    "I risultati delle 24 ore sono incompleti ({count} ore)",
    "Os resultados de 24 horas estão incompletos ({count} horas)",
    "Die 24-Stunden-Ergebnisse sind unvollständig ({count} Stunden)",
    "24시간 결과가 갖춰지지 않았습니다({count}시간)"
  ],
  "{field}: 設定値が不正です": [
    "{field}: invalid setting",
    "{field} : réglage invalide",
    "{field}: valor no válido",
    "{field}: valore non valido",
    "{field}: valor inválido",
    "{field}: ungültige Einstellung",
    "{field}: 설정값이 올바르지 않습니다"
  ],
  "計算が60秒を超えました。条件を見直してください。": [
    "The calculation took longer than 60 seconds. Review the conditions.",
    "Le calcul a dépassé 60 secondes. Revoyez les conditions.",
    "El cálculo superó los 60 segundos. Revise las condiciones.",
    "Il calcolo ha superato i 60 secondi. Rivedi le condizioni.",
    "O cálculo passou de 60 segundos. Revise as condições.",
    "Die Berechnung dauerte über 60 Sekunden. Bedingungen prüfen.",
    "계산이 60초를 넘었습니다. 조건을 재검토하세요."
  ],
  "VOACAP計算に失敗しました: {detail}": [
    "VOACAP calculation failed: {detail}",
    "Échec du calcul VOACAP : {detail}",
    "Falló el cálculo de VOACAP: {detail}",
    "Calcolo VOACAP non riuscito: {detail}",
    "O cálculo do VOACAP falhou: {detail}",
    "VOACAP-Berechnung fehlgeschlagen: {detail}",
    "VOACAP 계산에 실패했습니다: {detail}"
  ],
  "計算に失敗しました。サーバーログを確認してください。": [
    "Calculation failed. Check the server log.",
    "Échec du calcul. Consultez le journal du serveur.",
    "Falló el cálculo. Revise el registro del servidor.",
    "Calcolo non riuscito. Controlla il log del server.",
    "O cálculo falhou. Verifique o log do servidor.",
    "Berechnung fehlgeschlagen. Serverprotokoll prüfen.",
    "계산에 실패했습니다. 서버 로그를 확인하세요."
  ],
  "読み込みに失敗しました。サーバーログを確認してください。": [
    "Loading failed. Check the server log.",
    "Échec du chargement. Consultez le journal du serveur.",
    "Falló la carga. Revise el registro del servidor.",
    "Caricamento non riuscito. Controlla il log del server.",
    "O carregamento falhou. Verifique o log do servidor.",
    "Laden fehlgeschlagen. Serverprotokoll prüfen.",
    "불러오기에 실패했습니다. 서버 로그를 확인하세요."
  ],
  "mesh_sites: 拠点を2〜{count}地点指定してください": [
    "mesh_sites: specify 2 to {count} stations",
    "mesh_sites : indiquez 2 à {count} stations",
    "mesh_sites: indique de 2 a {count} estaciones",
    "mesh_sites: indica da 2 a {count} stazioni",
    "mesh_sites: informe de 2 a {count} estações",
    "mesh_sites: 2 bis {count} Stationen angeben",
    "mesh_sites: 거점을 2~{count}곳 지정하세요"
  ],
  "拠点はJSONオブジェクトで指定してください": [
    "Specify each station as a JSON object",
    "Indiquez chaque station sous forme d’objet JSON",
    "Indique cada estación como objeto JSON",
    "Indica ogni stazione come oggetto JSON",
    "Informe cada estação como objeto JSON",
    "Jede Station als JSON-Objekt angeben",
    "거점은 JSON 객체로 지정하세요"
  ],
  "拠点名は制御文字を含まない1〜40文字で指定してください": [
    "Station names must be 1–40 characters without control characters",
    "Le nom de station doit compter 1 à 40 caractères sans caractère de contrôle",
    "El nombre de la estación debe tener de 1 a 40 caracteres sin caracteres de control",
    "Il nome della stazione deve avere da 1 a 40 caratteri senza caratteri di controllo",
    "O nome da estação deve ter de 1 a 40 caracteres, sem caracteres de controle",
    "Stationsnamen müssen 1–40 Zeichen ohne Steuerzeichen haben",
    "거점 이름은 제어 문자를 포함하지 않는 1~40자로 지정하세요"
  ],
  "拠点名は重複しないように指定してください": [
    "Station names must be unique",
    "Les noms de station doivent être uniques",
    "Los nombres de estación deben ser únicos",
    "I nomi delle stazioni devono essere univoci",
    "Os nomes das estações devem ser únicos",
    "Stationsnamen müssen eindeutig sein",
    "거점 이름이 중복되지 않게 지정하세요"
  ],
  "拠点を1 km以上離してください: {a} / {b}": [
    "Stations must be at least 1 km apart: {a} / {b}",
    "Les stations doivent être à au moins 1 km l’une de l’autre : {a} / {b}",
    "Las estaciones deben estar a 1 km o más: {a} / {b}",
    "Le stazioni devono distare almeno 1 km: {a} / {b}",
    "As estações devem estar a pelo menos 1 km: {a} / {b}",
    "Stationen müssen mindestens 1 km auseinanderliegen: {a} / {b}",
    "거점을 1 km 이상 떨어뜨리세요: {a} / {b}"
  ],
  "{name}: receiveはJSONオブジェクトで指定してください": [
    "{name}: receive must be a JSON object",
    "{name} : receive doit être un objet JSON",
    "{name}: receive debe ser un objeto JSON",
    "{name}: receive deve essere un oggetto JSON",
    "{name}: receive deve ser um objeto JSON",
    "{name}: receive muss ein JSON-Objekt sein",
    "{name}: receive는 JSON 객체로 지정하세요"
  ],
  "rx_sites: RXサイトを2〜8地点指定してください": [
    "rx_sites: specify 2 to 8 RX sites",
    "rx_sites : indiquez 2 à 8 sites RX",
    "rx_sites: indique de 2 a 8 sitios RX",
    "rx_sites: indica da 2 a 8 siti RX",
    "rx_sites: informe de 2 a 8 locais RX",
    "rx_sites: 2 bis 8 RX-Standorte angeben",
    "rx_sites: RX 사이트를 2~8곳 지정하세요"
  ],
  "independence_assumption: true/falseを指定してください": [
    "independence_assumption: use true or false",
    "independence_assumption : utilisez true ou false",
    "independence_assumption: use true o false",
    "independence_assumption: usa true o false",
    "independence_assumption: use true ou false",
    "independence_assumption: true oder false angeben",
    "independence_assumption: true/false를 지정하세요"
  ],
  "RXサイトはJSONオブジェクトで指定してください": [
    "Specify each RX site as a JSON object",
    "Indiquez chaque site RX sous forme d’objet JSON",
    "Indique cada sitio RX como objeto JSON",
    "Indica ogni sito RX come oggetto JSON",
    "Informe cada local RX como objeto JSON",
    "Jeden RX-Standort als JSON-Objekt angeben",
    "RX 사이트는 JSON 객체로 지정하세요"
  ],
  "サイト名は制御文字を含まない1〜40文字で指定してください": [
    "Site names must be 1–40 characters without control characters",
    "Le nom de site doit compter 1 à 40 caractères sans caractère de contrôle",
    "El nombre del sitio debe tener de 1 a 40 caracteres sin caracteres de control",
    "Il nome del sito deve avere da 1 a 40 caratteri senza caratteri di controllo",
    "O nome do local deve ter de 1 a 40 caracteres, sem caracteres de controle",
    "Standortnamen müssen 1–40 Zeichen ohne Steuerzeichen haben",
    "사이트 이름은 제어 문자를 포함하지 않는 1~40자로 지정하세요"
  ],
  "サイト名は重複しないように指定してください": [
    "Site names must be unique",
    "Les noms de site doivent être uniques",
    "Los nombres de sitio deben ser únicos",
    "I nomi dei siti devono essere univoci",
    "Os nomes dos locais devem ser únicos",
    "Standortnamen müssen eindeutig sein",
    "사이트 이름이 중복되지 않게 지정하세요"
  ],
  "presetオブジェクトが必要です": [
    "A preset object is required",
    "Un objet preset est requis",
    "Se requiere un objeto preset",
    "È richiesto un oggetto preset",
    "É necessário um objeto preset",
    "Preset-Objekt erforderlich",
    "preset 객체가 필요합니다"
  ],
  "局名は表示可能な1〜40文字で指定してください": [
    "Station names must be 1–40 printable characters",
    "Le nom de station doit compter 1 à 40 caractères affichables",
    "El nombre de la estación debe tener de 1 a 40 caracteres imprimibles",
    "Il nome della stazione deve avere da 1 a 40 caratteri stampabili",
    "O nome da estação deve ter de 1 a 40 caracteres imprimíveis",
    "Stationsnamen müssen 1–40 druckbare Zeichen haben",
    "국명은 표시 가능한 1~40자로 지정하세요"
  ],
  "地点種別はfixed/mobileです": [
    "Location type must be fixed or mobile",
    "Le type de lieu doit être fixed ou mobile",
    "El tipo de ubicación debe ser fixed o mobile",
    "Il tipo di località deve essere fixed o mobile",
    "O tipo de local deve ser fixed ou mobile",
    "Standorttyp muss fixed oder mobile sein",
    "지점 종별은 fixed/mobile입니다"
  ],
  "地域名が不正です": [
    "Invalid region name",
    "Nom de région invalide",
    "Nombre de región no válido",
    "Nome della regione non valido",
    "Nome de região inválido",
    "Ungültiger Regionsname",
    "지역명이 올바르지 않습니다"
  ],
  "基準アンテナモデルが不正です": [
    "Invalid base antenna model",
    "Modèle d’antenne de base invalide",
    "Modelo de antena base no válido",
    "Modello di antenna di base non valido",
    "Modelo de antena base inválido",
    "Ungültiges Basis-Antennenmodell",
    "기준 안테나 모델이 올바르지 않습니다"
  ],
  "reference_onlyはtrue/falseです": [
    "reference_only must be true or false",
    "reference_only doit être true ou false",
    "reference_only debe ser true o false",
    "reference_only deve essere true o false",
    "reference_only deve ser true ou false",
    "reference_only muss true oder false sein",
    "reference_only는 true/false입니다"
  ],
  "移動局には受信局のposition_refが必要です": [
    "A mobile station needs the position_ref of a receiving station",
    "Une station mobile nécessite le position_ref d’une station reçue",
    "Una estación móvil necesita el position_ref de una estación recibida",
    "Una stazione mobile richiede il position_ref di una stazione ricevuta",
    "Uma estação móvel precisa do position_ref de uma estação recebida",
    "Eine mobile Station braucht die position_ref einer empfangenen Station",
    "이동국에는 수신국의 position_ref가 필요합니다"
  ],
  "取得したrevision整数が必要です": [
    "The fetched revision integer is required",
    "L’entier revision obtenu est requis",
    "Se requiere el entero revision obtenido",
    "È richiesto l’intero revision ottenuto",
    "É necessário o inteiro revision obtido",
    "Die abgerufene revision-Ganzzahl ist erforderlich",
    "가져온 revision 정수가 필요합니다"
  ],
  "collectionが不正です": [
    "Invalid collection",
    "collection invalide",
    "collection no válida",
    "collection non valida",
    "collection inválida",
    "Ungültige collection",
    "collection이 올바르지 않습니다"
  ],
  "actionはsave/deleteです": [
    "action must be save or delete",
    "action doit être save ou delete",
    "action debe ser save o delete",
    "action deve essere save o delete",
    "action deve ser save ou delete",
    "action muss save oder delete sein",
    "action은 save/delete입니다"
  ],
  "OCRの原本・単位・数値の確認が必要です": [
    "Confirm the OCR source, units and values",
    "Confirmez l’original, les unités et les valeurs de l’OCR",
    "Confirme el original, las unidades y los valores del OCR",
    "Conferma originale, unità e valori dell’OCR",
    "Confirme o original, as unidades e os valores do OCR",
    "OCR-Original, Einheiten und Werte bestätigen",
    "OCR 원본·단위·수치의 확인이 필요합니다"
  ],
  "document_refが不正です": [
    "Invalid document_ref",
    "document_ref invalide",
    "document_ref no válido",
    "document_ref non valido",
    "document_ref inválido",
    "Ungültige document_ref",
    "document_ref가 올바르지 않습니다"
  ],
  "実機特性ではなく近似モデルであることの確認が必要です": [
    "Confirm that this is an approximate model, not measured hardware characteristics",
    "Confirmez qu’il s’agit d’un modèle approché et non des caractéristiques réelles",
    "Confirme que es un modelo aproximado y no las características reales del equipo",
    "Conferma che si tratta di un modello approssimato e non delle caratteristiche reali",
    "Confirme que é um modelo aproximado, não as características reais do equipamento",
    "Bestätigen, dass dies ein Näherungsmodell und keine gemessene Hardwarecharakteristik ist",
    "실기 특성이 아닌 근사 모델임을 확인해야 합니다"
  ],
  "referenceが不正です": [
    "Invalid reference",
    "reference invalide",
    "reference no válida",
    "reference non valido",
    "reference inválida",
    "Ungültige reference",
    "reference가 올바르지 않습니다"
  ],
  "reference.{field}が不正です": [
    "Invalid reference.{field}",
    "reference.{field} invalide",
    "reference.{field} no válido",
    "reference.{field} non valido",
    "reference.{field} inválido",
    "Ungültiges reference.{field}",
    "reference.{field}가 올바르지 않습니다"
  ],
  "source URLが必要です": [
    "A source URL is required",
    "Une URL source est requise",
    "Se requiere una URL de fuente",
    "È richiesto un URL di origine",
    "É necessária uma URL de origem",
    "Quell-URL erforderlich",
    "source URL이 필요합니다"
  ],
  "source URLが不正です": [
    "Invalid source URL",
    "URL source invalide",
    "URL de fuente no válida",
    "URL di origine non valido",
    "URL de origem inválida",
    "Ungültige Quell-URL",
    "source URL이 올바르지 않습니다"
  ],
  "source URLはHTTPSです": [
    "The source URL must use HTTPS",
    "L’URL source doit utiliser HTTPS",
    "La URL de fuente debe usar HTTPS",
    "L’URL di origine deve usare HTTPS",
    "A URL de origem deve usar HTTPS",
    "Die Quell-URL muss HTTPS verwenden",
    "source URL은 HTTPS여야 합니다"
  ],
  "各プリセットは最大200件です": [
    "Each preset list holds up to 200 entries",
    "Chaque liste de préréglages compte au plus 200 entrées",
    "Cada lista de preajustes admite hasta 200 entradas",
    "Ogni elenco di preset contiene al massimo 200 voci",
    "Cada lista de predefinições comporta até 200 itens",
    "Jede Vorlagenliste umfasst höchstens 200 Einträge",
    "각 프리셋은 최대 200건입니다"
  ],
  "指定されたプリセットがありません": [
    "The specified preset does not exist",
    "Le préréglage indiqué n’existe pas",
    "El preajuste indicado no existe",
    "Il preset indicato non esiste",
    "A predefinição indicada não existe",
    "Die angegebene Vorlage existiert nicht",
    "지정된 프리셋이 없습니다"
  ],
  "取込資料がありません": [
    "The imported document does not exist",
    "Le document importé n’existe pas",
    "El documento importado no existe",
    "Il documento importato non esiste",
    "O documento importado não existe",
    "Das importierte Dokument existiert nicht",
    "가져온 자료가 없습니다"
  ],
  "取込資料の候補がありません": [
    "The imported document has no such candidate",
    "Le document importé n’a pas ce candidat",
    "El documento importado no tiene ese candidato",
    "Il documento importato non ha questo candidato",
    "O documento importado não tem esse candidato",
    "Das importierte Dokument hat keinen solchen Kandidaten",
    "가져온 자료의 후보가 없습니다"
  ],
  "プリセット要求の上限は8 KiBです": [
    "Preset requests are limited to 8 KiB",
    "Les requêtes de préréglage sont limitées à 8 Kio",
    "Las solicitudes de preajuste se limitan a 8 KiB",
    "Le richieste di preset sono limitate a 8 KiB",
    "As solicitações de predefinição são limitadas a 8 KiB",
    "Vorlagenanfragen sind auf 8 KiB begrenzt",
    "프리셋 요청 상한은 8 KiB입니다"
  ],
  "プリセットを保存できません": [
    "Cannot save the preset",
    "Impossible d’enregistrer le préréglage",
    "No se puede guardar el preajuste",
    "Impossibile salvare il preset",
    "Não foi possível salvar a predefinição",
    "Vorlage kann nicht gespeichert werden",
    "프리셋을 저장할 수 없습니다"
  ],
  "異なるオリジンからの保存は受け付けません": [
    "Saves from a different origin are not accepted",
    "Les enregistrements depuis une autre origine sont refusés",
    "No se aceptan guardados desde otro origen",
    "Non si accettano salvataggi da un’altra origine",
    "Não são aceitos salvamentos de outra origem",
    "Speichern von einem anderen Ursprung wird nicht angenommen",
    "다른 출처에서의 저장은 받지 않습니다"
  ],
  "見つかりません": [
    "Not found",
    "Introuvable",
    "No encontrado",
    "Non trovato",
    "Não encontrado",
    "Nicht gefunden",
    "찾을 수 없습니다"
  ],
  "指定された履歴がありません": [
    "The specified history entry does not exist",
    "L’entrée d’historique indiquée n’existe pas",
    "La entrada de historial indicada no existe",
    "La voce di cronologia indicata non esiste",
    "A entrada de histórico indicada não existe",
    "Der angegebene Verlaufseintrag existiert nicht",
    "지정된 이력이 없습니다"
  ],
  "出力形式がありません": [
    "No such output format",
    "Format de sortie inexistant",
    "Formato de salida inexistente",
    "Formato di output inesistente",
    "Formato de saída inexistente",
    "Kein solches Ausgabeformat",
    "출력 형식이 없습니다"
  ],
  "リクエストサイズが不正です": [
    "Invalid request size",
    "Taille de requête invalide",
    "Tamaño de solicitud no válido",
    "Dimensione della richiesta non valida",
    "Tamanho de solicitação inválido",
    "Ungültige Anfragegröße",
    "요청 크기가 올바르지 않습니다"
  ],
  "Content-Typeが不正です": [
    "Invalid Content-Type",
    "Content-Type invalide",
    "Content-Type no válido",
    "Content-Type non valido",
    "Content-Type inválido",
    "Ungültiger Content-Type",
    "Content-Type이 올바르지 않습니다"
  ],
  "application/jsonが必要です": [
    "application/json is required",
    "application/json est requis",
    "Se requiere application/json",
    "È richiesto application/json",
    "application/json é necessário",
    "application/json erforderlich",
    "application/json이 필요합니다"
  ],
  "application/json が必要です": [
    "application/json is required",
    "application/json est requis",
    "Se requiere application/json",
    "È richiesto application/json",
    "application/json é necessário",
    "application/json erforderlich",
    "application/json이 필요합니다"
  ],
  "JSONが不正です": [
    "Invalid JSON",
    "JSON invalide",
    "JSON no válido",
    "JSON non valido",
    "JSON inválido",
    "Ungültiges JSON",
    "JSON이 올바르지 않습니다"
  ],
  "異なるオリジンからの計算要求は受け付けません": [
    "Calculation requests from a different origin are not accepted",
    "Les demandes de calcul depuis une autre origine sont refusées",
    "No se aceptan solicitudes de cálculo desde otro origen",
    "Non si accettano richieste di calcolo da un’altra origine",
    "Não são aceitas solicitações de cálculo de outra origem",
    "Rechenanfragen von einem anderen Ursprung werden nicht angenommen",
    "다른 출처에서의 계산 요청은 받지 않습니다"
  ],
  "同一オリジンの画面から操作してください": [
    "Use the app page on the same origin",
    "Utilisez la page de l’application sur la même origine",
    "Use la página de la aplicación en el mismo origen",
    "Usa la pagina dell’app sulla stessa origine",
    "Use a página do aplicativo na mesma origem",
    "Bitte die App-Seite desselben Ursprungs verwenden",
    "같은 출처의 화면에서 조작하세요"
  ],
  "同一オリジンの画面から送ってください": [
    "Submit from the app page on the same origin",
    "Envoyez depuis la page de l’application sur la même origine",
    "Envíe desde la página de la aplicación en el mismo origen",
    "Invia dalla pagina dell’app sulla stessa origine",
    "Envie pela página do aplicativo na mesma origem",
    "Bitte von der App-Seite desselben Ursprungs senden",
    "같은 출처의 화면에서 보내세요"
  ],
  "採用した位置情報が準備中に期限切れになりました。再計算してください。": [
    "The selected position expired while preparing. Calculate again.",
    "La position retenue a expiré pendant la préparation. Relancez le calcul.",
    "La posición elegida caducó durante la preparación. Vuelva a calcular.",
    "La posizione scelta è scaduta durante la preparazione. Ricalcola.",
    "A posição escolhida expirou durante a preparação. Calcule novamente.",
    "Die gewählte Position ist während der Vorbereitung abgelaufen. Erneut berechnen.",
    "채택한 위치 정보가 준비 중에 만료되었습니다. 다시 계산하세요."
  ],
  "外部位置入力は位置ゲートウェイ（既定ポート18083）へ送信してください": [
    "Send external position input to the position gateway (default port 18083)",
    "Envoyez les positions externes à la passerelle de position (port 18083 par défaut)",
    "Envíe las posiciones externas a la pasarela de posiciones (puerto predeterminado 18083)",
    "Invia le posizioni esterne al gateway di posizione (porta predefinita 18083)",
    "Envie as posições externas ao gateway de posição (porta padrão 18083)",
    "Externe Positionen an das Positions-Gateway senden (Standardport 18083)",
    "외부 위치 입력은 위치 게이트웨이(기본 포트 18083)로 보내세요"
  ],
  "局設定は同一オリジンの画面または認証済みクライアントから行ってください": [
    "Change station settings from the app page on the same origin or an authenticated client",
    "Modifiez les stations depuis la page de l’application sur la même origine ou un client authentifié",
    "Cambie la configuración de estaciones desde la página de la aplicación en el mismo origen o un cliente autenticado",
    "Modifica le stazioni dalla pagina dell’app sulla stessa origine o da un client autenticato",
    "Altere as estações pela página do aplicativo na mesma origem ou por um cliente autenticado",
    "Stationseinstellungen über die App-Seite desselben Ursprungs oder einen authentifizierten Client ändern",
    "국 설정은 같은 출처의 화면 또는 인증된 클라이언트에서 하세요"
  ],
  "局設定の上限は4 KiBです": [
    "Station settings are limited to 4 KiB",
    "Les réglages de station sont limités à 4 Kio",
    "La configuración de estación se limita a 4 KiB",
    "Le impostazioni della stazione sono limitate a 4 KiB",
    "As configurações de estação são limitadas a 4 KiB",
    "Stationseinstellungen sind auf 4 KiB begrenzt",
    "국 설정 상한은 4 KiB입니다"
  ],
  "局設定の保存に失敗しました": [
    "Failed to save the station settings",
    "Échec de l’enregistrement de la station",
    "No se pudo guardar la configuración de la estación",
    "Salvataggio della stazione non riuscito",
    "Falha ao salvar a configuração da estação",
    "Stationseinstellungen konnten nicht gespeichert werden",
    "국 설정 저장에 실패했습니다"
  ],
  "APIキーを設定してください": [
    "Set an API key",
    "Définissez une clé API",
    "Configure una clave de API",
    "Imposta una chiave API",
    "Defina uma chave de API",
    "API-Schlüssel festlegen",
    "API 키를 설정하세요"
  ],
  "AIの読取りが完了しませんでした": [
    "The AI reading did not complete",
    "La lecture par l’IA n’a pas abouti",
    "La lectura por IA no se completó",
    "La lettura con IA non è stata completata",
    "A leitura por IA não foi concluída",
    "Die KI-Auswertung wurde nicht abgeschlossen",
    "AI 판독이 완료되지 않았습니다"
  ],
  "AIの読取結果が不正です": [
    "The AI reading result is invalid",
    "Le résultat de lecture de l’IA est invalide",
    "El resultado de lectura de la IA no es válido",
    "Il risultato della lettura con IA non è valido",
    "O resultado da leitura por IA é inválido",
    "Das KI-Auswertungsergebnis ist ungültig",
    "AI 판독 결과가 올바르지 않습니다"
  ],
  "ローカルLLMにはPDFをページ画像に変換して取り込んでください": [
    "For a local LLM, convert the PDF to page images before importing",
    "Pour un LLM local, convertissez le PDF en images de pages avant l’import",
    "Para un LLM local, convierta el PDF en imágenes de página antes de importarlo",
    "Per un LLM locale, converti il PDF in immagini di pagina prima di importarlo",
    "Para um LLM local, converta o PDF em imagens de página antes de importar",
    "Für ein lokales LLM das PDF vor dem Import in Seitenbilder umwandeln",
    "로컬 LLM에는 PDF를 페이지 이미지로 변환해 가져오세요"
  ],
  "資料の外部送信確認が必要です": [
    "Confirm sending the document to an external service",
    "Confirmez l’envoi du document à un service externe",
    "Confirme el envío del documento a un servicio externo",
    "Conferma l’invio del documento a un servizio esterno",
    "Confirme o envio do documento a um serviço externo",
    "Senden des Dokuments an einen externen Dienst bestätigen",
    "자료의 외부 전송 확인이 필요합니다"
  ],
  "PDF / PNG / JPEG / WebPを指定してください": [
    "Choose a PDF, PNG, JPEG or WebP file",
    "Choisissez un fichier PDF, PNG, JPEG ou WebP",
    "Elija un archivo PDF, PNG, JPEG o WebP",
    "Scegli un file PDF, PNG, JPEG o WebP",
    "Escolha um arquivo PDF, PNG, JPEG ou WebP",
    "PDF-, PNG-, JPEG- oder WebP-Datei wählen",
    "PDF / PNG / JPEG / WebP를 지정하세요"
  ],
  "資料の内容と形式が一致しません": [
    "The document content does not match its format",
    "Le contenu du document ne correspond pas à son format",
    "El contenido del documento no coincide con su formato",
    "Il contenuto del documento non corrisponde al formato",
    "O conteúdo do documento não corresponde ao formato",
    "Dokumentinhalt passt nicht zum Format",
    "자료 내용과 형식이 일치하지 않습니다"
  ],
  "資料が見つかりません": [
    "Document not found",
    "Document introuvable",
    "Documento no encontrado",
    "Documento non trovato",
    "Documento não encontrado",
    "Dokument nicht gefunden",
    "자료를 찾을 수 없습니다"
  ],
  "別の資料を読取り中です": [
    "Another document is being read",
    "Un autre document est en cours de lecture",
    "Se está leyendo otro documento",
    "È in corso la lettura di un altro documento",
    "Outro documento está sendo lido",
    "Ein anderes Dokument wird gerade ausgewertet",
    "다른 자료를 판독 중입니다"
  ],
  "保存資料の上限は50件です。不要な資料を削除してください": [
    "Up to 50 documents can be stored. Delete documents you no longer need",
    "50 documents au maximum peuvent être conservés. Supprimez ceux qui ne servent plus",
    "Se pueden guardar hasta 50 documentos. Elimine los que ya no necesite",
    "Si possono conservare al massimo 50 documenti. Elimina quelli non necessari",
    "É possível guardar até 50 documentos. Exclua os que não precisa mais",
    "Höchstens 50 Dokumente speicherbar. Nicht mehr benötigte löschen",
    "저장 자료 상한은 50건입니다. 불필요한 자료를 삭제하세요"
  ],
  "AI設定を保存できませんでした": [
    "Could not save the AI settings",
    "Impossible d’enregistrer les réglages IA",
    "No se pudo guardar la configuración de IA",
    "Impossibile salvare le impostazioni IA",
    "Não foi possível salvar as configurações de IA",
    "KI-Einstellungen konnten nicht gespeichert werden",
    "AI 설정을 저장하지 못했습니다"
  ],
  "資料の取り込みに失敗しました": [
    "Failed to import the document",
    "Échec de l’import du document",
    "No se pudo importar el documento",
    "Importazione del documento non riuscita",
    "Falha ao importar o documento",
    "Dokumentimport fehlgeschlagen",
    "자료 가져오기에 실패했습니다"
  ],
  "タイムゾーン付きISO日時が必要です": [
    "An ISO date-time with a time zone is required",
    "Une date-heure ISO avec fuseau horaire est requise",
    "Se requiere una fecha y hora ISO con zona horaria",
    "È richiesta una data-ora ISO con fuso orario",
    "É necessária uma data-hora ISO com fuso horário",
    "ISO-Zeitstempel mit Zeitzone erforderlich",
    "시간대가 있는 ISO 일시가 필요합니다"
  ],
  "タイムゾーン付きISO日時が不正です": [
    "Invalid ISO date-time with time zone",
    "Date-heure ISO avec fuseau horaire invalide",
    "Fecha y hora ISO con zona horaria no válida",
    "Data-ora ISO con fuso orario non valida",
    "Data-hora ISO com fuso horário inválida",
    "Ungültiger ISO-Zeitstempel mit Zeitzone",
    "시간대가 있는 ISO 일시가 올바르지 않습니다"
  ],
  "未対応の位置連接スキーマ版です": [
    "Unsupported position link schema version",
    "Version de schéma de liaison de position non prise en charge",
    "Versión de esquema de enlace de posiciones no compatible",
    "Versione dello schema di collegamento posizioni non supportata",
    "Versão do esquema de ligação de posição não suportada",
    "Nicht unterstützte Version des Positionsschemas",
    "지원하지 않는 위치 연계 스키마 버전입니다"
  ],
  "位置有効期限の設定が不正です": [
    "Invalid position expiry setting",
    "Réglage d’expiration de position invalide",
    "Configuración de caducidad de posición no válida",
    "Impostazione di scadenza della posizione non valida",
    "Configuração de validade da posição inválida",
    "Ungültige Ablaufeinstellung für Positionen",
    "위치 유효 기한 설정이 올바르지 않습니다"
  ],
  "受信状態が不正です": [
    "Invalid reception status",
    "État de réception invalide",
    "Estado de recepción no válido",
    "Stato di ricezione non valido",
    "Estado de recepção inválido",
    "Ungültiger Empfangsstatus",
    "수신 상태가 올바르지 않습니다"
  ],
  "{field}: 半角英数字と _ . : - の1〜64文字で指定してください": [
    "{field}: use 1–64 ASCII letters, digits or _ . : -",
    "{field} : utilisez 1 à 64 caractères ASCII (lettres, chiffres ou _ . : -)",
    "{field}: use de 1 a 64 caracteres ASCII (letras, dígitos o _ . : -)",
    "{field}: usa da 1 a 64 caratteri ASCII (lettere, cifre o _ . : -)",
    "{field}: use de 1 a 64 caracteres ASCII (letras, dígitos ou _ . : -)",
    "{field}: 1–64 ASCII-Buchstaben, Ziffern oder _ . : - verwenden",
    "{field}: 반각 영숫자와 _ . : - 의 1~64자로 지정하세요"
  ],
  "{field}: 有限の数値を指定してください（{min}〜{max}）": [
    "{field}: enter a finite number ({min} to {max})",
    "{field} : saisissez un nombre fini ({min} à {max})",
    "{field}: indique un número finito ({min} a {max})",
    "{field}: inserisci un numero finito (da {min} a {max})",
    "{field}: informe um número finito ({min} a {max})",
    "{field}: endliche Zahl angeben ({min} bis {max})",
    "{field}: 유한한 수치를 지정하세요({min}~{max})"
  ],
  "{field}: 表示可能な文字列が必要です": [
    "{field}: printable text is required",
    "{field} : texte affichable requis",
    "{field}: se requiere texto imprimible",
    "{field}: è richiesto testo stampabile",
    "{field}: é necessário texto imprimível",
    "{field}: druckbarer Text erforderlich",
    "{field}: 표시 가능한 문자열이 필요합니다"
  ],
  "共通位置一覧が不正です": [
    "Invalid shared position list",
    "Liste de positions partagée invalide",
    "Lista de posiciones compartida no válida",
    "Elenco di posizioni condiviso non valido",
    "Lista de posições compartilhada inválida",
    "Ungültige gemeinsame Positionsliste",
    "공통 위치 목록이 올바르지 않습니다"
  ],
  "共通位置レコードが不正です": [
    "Invalid shared position record",
    "Enregistrement de position partagé invalide",
    "Registro de posición compartido no válido",
    "Record di posizione condiviso non valido",
    "Registro de posição compartilhado inválido",
    "Ungültiger gemeinsamer Positionsdatensatz",
    "공통 위치 레코드가 올바르지 않습니다"
  ],
  "共通位置レコードの識別子が重複しています": [
    "Duplicate shared position record identifier",
    "Identifiant d’enregistrement de position en double",
    "Identificador de registro de posición duplicado",
    "Identificatore del record di posizione duplicato",
    "Identificador de registro de posição duplicado",
    "Doppelte Kennung im gemeinsamen Positionsdatensatz",
    "공통 위치 레코드의 식별자가 중복되었습니다"
  ],
  "共通位置フィールドが不足しています: {field}": [
    "Missing shared position field: {field}",
    "Champ de position partagé manquant : {field}",
    "Falta un campo de posición compartido: {field}",
    "Campo di posizione condiviso mancante: {field}",
    "Campo de posição compartilhado ausente: {field}",
    "Fehlendes Feld im gemeinsamen Positionsdatensatz: {field}",
    "공통 위치 필드가 부족합니다: {field}"
  ],
  "局種別が不正です": [
    "Invalid station type",
    "Type de station invalide",
    "Tipo de estación no válido",
    "Tipo di stazione non valido",
    "Tipo de estação inválido",
    "Ungültiger Stationstyp",
    "국 종별이 올바르지 않습니다"
  ],
  "針路は360未満です": [
    "Course must be less than 360",
    "Le cap doit être inférieur à 360",
    "El rumbo debe ser menor que 360",
    "La rotta deve essere inferiore a 360",
    "O rumo deve ser menor que 360",
    "Kurs muss unter 360 liegen",
    "침로는 360 미만입니다"
  ],
  "高度基準が不正です": [
    "Invalid altitude reference",
    "Référence d’altitude invalide",
    "Referencia de altitud no válida",
    "Riferimento di quota non valido",
    "Referência de altitude inválida",
    "Ungültiger Höhenbezug",
    "고도 기준이 올바르지 않습니다"
  ],
  "観測時刻と有効期限が一致しません": [
    "Observation time and expiry do not match",
    "L’heure d’observation et l’expiration ne concordent pas",
    "La hora de observación y la caducidad no coinciden",
    "Ora di osservazione e scadenza non coincidono",
    "Horário de observação e validade não coincidem",
    "Messzeit und Ablauf passen nicht zusammen",
    "관측 시각과 유효 기한이 일치하지 않습니다"
  ],
  "位置品質の状態が不正です": [
    "Invalid position quality status",
    "État de qualité de position invalide",
    "Estado de calidad de posición no válido",
    "Stato di qualità della posizione non valido",
    "Estado de qualidade da posição inválido",
    "Ungültiger Positionsqualitätsstatus",
    "위치 품질 상태가 올바르지 않습니다"
  ],
  "予測緯度範囲の判定が不正です": [
    "Invalid forecast latitude range check",
    "Contrôle de plage de latitude de prévision invalide",
    "Comprobación del rango de latitud de predicción no válida",
    "Controllo dell’intervallo di latitudine non valido",
    "Verificação da faixa de latitude da previsão inválida",
    "Ungültige Prüfung des Prognose-Breitenbereichs",
    "예측 위도 범위 판정이 올바르지 않습니다"
  ],
  "局設定が不正です": [
    "Invalid station settings",
    "Réglages de station invalides",
    "Configuración de estación no válida",
    "Impostazioni della stazione non valide",
    "Configuração de estação inválida",
    "Ungültige Stationseinstellungen",
    "국 설정이 올바르지 않습니다"
  ],
  "局設定の種別・状態が不正です": [
    "Invalid station setting type or status",
    "Type ou état de réglage de station invalide",
    "Tipo o estado de configuración de estación no válido",
    "Tipo o stato delle impostazioni della stazione non valido",
    "Tipo ou estado de configuração de estação inválido",
    "Ungültiger Typ oder Status der Stationseinstellung",
    "국 설정의 종별·상태가 올바르지 않습니다"
  ],
  "位置参照はsource/idオブジェクトで指定してください": [
    "Specify the position reference as a source/id object",
    "Indiquez la référence de position sous forme d’objet source/id",
    "Indique la referencia de posición como objeto source/id",
    "Indica il riferimento di posizione come oggetto source/id",
    "Informe a referência de posição como objeto source/id",
    "Positionsreferenz als source/id-Objekt angeben",
    "위치 참조는 source/id 객체로 지정하세요"
  ],
  "位置情報がありません: {ref}": [
    "No position available: {ref}",
    "Aucune position disponible : {ref}",
    "No hay posición disponible: {ref}",
    "Nessuna posizione disponibile: {ref}",
    "Nenhuma posição disponível: {ref}",
    "Keine Position vorhanden: {ref}",
    "위치 정보가 없습니다: {ref}"
  ],
  "位置情報が期限切れです: {ref}": [
    "Position has expired: {ref}",
    "Position expirée : {ref}",
    "La posición ha caducado: {ref}",
    "Posizione scaduta: {ref}",
    "A posição expirou: {ref}",
    "Position abgelaufen: {ref}",
    "위치 정보가 만료되었습니다: {ref}"
  ],
  "予測エンジンの緯度範囲±89°を超えています": [
    "Outside the forecast engine latitude range of ±89°",
    "Hors de la plage de latitude du moteur (±89°)",
    "Fuera del rango de latitud del motor (±89°)",
    "Fuori dall’intervallo di latitudine del motore (±89°)",
    "Fora da faixa de latitude do motor (±89°)",
    "Außerhalb des Breitenbereichs der Engine (±89°)",
    "예측 엔진의 위도 범위 ±89°를 넘었습니다"
  ],
  "WGS84以外の座標参照系指定には対応していません": [
    "Coordinate reference systems other than WGS84 are not supported",
    "Seul le système de référence WGS84 est pris en charge",
    "Solo se admite el sistema de referencia WGS84",
    "È supportato solo il sistema di riferimento WGS84",
    "Somente o sistema de referência WGS84 é suportado",
    "Nur das Bezugssystem WGS84 wird unterstützt",
    "WGS84 이외의 좌표 참조계 지정에는 대응하지 않습니다"
  ],
  "positionsは1〜100個です": [
    "positions must contain 1 to 100 items",
    "positions doit contenir 1 à 100 éléments",
    "positions debe contener de 1 a 100 elementos",
    "positions deve contenere da 1 a 100 elementi",
    "positions deve conter de 1 a 100 itens",
    "positions muss 1 bis 100 Einträge enthalten",
    "positions는 1~100개입니다"
  ],
  "featuresは1〜100個です": [
    "features must contain 1 to 100 items",
    "features doit contenir 1 à 100 éléments",
    "features debe contener de 1 a 100 elementos",
    "features deve contenere da 1 a 100 elementi",
    "features deve conter de 1 a 100 itens",
    "features muss 1 bis 100 Einträge enthalten",
    "features는 1~100개입니다"
  ],
  "チェックサム付きのRMCセンテンスを1行指定してください": [
    "Enter one RMC sentence with a checksum",
    "Saisissez une phrase RMC avec somme de contrôle",
    "Indique una sentencia RMC con suma de comprobación",
    "Inserisci una frase RMC con checksum",
    "Informe uma sentença RMC com checksum",
    "Einen RMC-Satz mit Prüfsumme angeben",
    "체크섬이 있는 RMC 문장을 1행 지정하세요"
  ],
  "NMEAチェックサムが一致しません": [
    "NMEA checksum mismatch",
    "Somme de contrôle NMEA incorrecte",
    "La suma de comprobación NMEA no coincide",
    "Checksum NMEA non corrispondente",
    "Checksum NMEA não confere",
    "NMEA-Prüfsumme stimmt nicht",
    "NMEA 체크섬이 일치하지 않습니다"
  ],
  "有効なRMC位置（status=A）が必要です": [
    "A valid RMC position (status=A) is required",
    "Une position RMC valide (status=A) est requise",
    "Se requiere una posición RMC válida (status=A)",
    "È richiesta una posizione RMC valida (status=A)",
    "É necessária uma posição RMC válida (status=A)",
    "Gültige RMC-Position (status=A) erforderlich",
    "유효한 RMC 위치(status=A)가 필요합니다"
  ],
  "RMCの推測・手動・無効・シミュレーション位置は使用しません": [
    "Estimated, manual, invalid and simulated RMC positions are not used",
    "Les positions RMC estimées, manuelles, invalides ou simulées ne sont pas utilisées",
    "No se usan posiciones RMC estimadas, manuales, no válidas ni simuladas",
    "Le posizioni RMC stimate, manuali, non valide o simulate non sono usate",
    "Posições RMC estimadas, manuais, inválidas ou simuladas não são usadas",
    "Geschätzte, manuelle, ungültige und simulierte RMC-Positionen werden nicht verwendet",
    "RMC의 추측·수동·무효·시뮬레이션 위치는 사용하지 않습니다"
  ],
  "RMC Nav Statusが有効ではありません": [
    "RMC Nav Status is not valid",
    "RMC Nav Status n’est pas valide",
    "RMC Nav Status no es válido",
    "RMC Nav Status non è valido",
    "RMC Nav Status não é válido",
    "RMC Nav Status ist nicht gültig",
    "RMC Nav Status가 유효하지 않습니다"
  ],
  "RMC日時が不正です": [
    "Invalid RMC date and time",
    "Date et heure RMC invalides",
    "Fecha y hora RMC no válidas",
    "Data e ora RMC non valide",
    "Data e hora RMC inválidas",
    "Ungültiges RMC-Datum/-Uhrzeit",
    "RMC 일시가 올바르지 않습니다"
  ],
  "各位置はJSONオブジェクトで指定してください": [
    "Specify each position as a JSON object",
    "Indiquez chaque position sous forme d’objet JSON",
    "Indique cada posición como objeto JSON",
    "Indica ogni posizione come oggetto JSON",
    "Informe cada posição como objeto JSON",
    "Jede Position als JSON-Objekt angeben",
    "각 위치는 JSON 객체로 지정하세요"
  ],
  "同じバッチ内でidが重複しています": [
    "Duplicate id in the same batch",
    "id en double dans le même lot",
    "id duplicado en el mismo lote",
    "id duplicato nello stesso lotto",
    "id duplicado no mesmo lote",
    "Doppelte id im selben Stapel",
    "같은 배치 안에서 id가 중복되었습니다"
  ],
  "kindはvessel / aircraft / vehicleです": [
    "kind must be vessel, aircraft or vehicle",
    "kind doit être vessel, aircraft ou vehicle",
    "kind debe ser vessel, aircraft o vehicle",
    "kind deve essere vessel, aircraft o vehicle",
    "kind deve ser vessel, aircraft ou vehicle",
    "kind muss vessel, aircraft oder vehicle sein",
    "kind는 vessel / aircraft / vehicle입니다"
  ],
  "nameは表示可能な1〜80文字で指定してください": [
    "name must be 1–80 printable characters",
    "name doit compter 1 à 80 caractères affichables",
    "name debe tener de 1 a 80 caracteres imprimibles",
    "name deve avere da 1 a 80 caratteri stampabili",
    "name deve ter de 1 a 80 caracteres imprimíveis",
    "name muss 1–80 druckbare Zeichen haben",
    "name은 표시 가능한 1~80자로 지정하세요"
  ],
  "観測時刻は過去24時間〜未来60秒の範囲で指定してください": [
    "Observation time must be within the past 24 hours and 60 seconds into the future",
    "L’heure d’observation doit être comprise entre 24 heures dans le passé et 60 secondes dans le futur",
    "La hora de observación debe estar entre 24 horas antes y 60 segundos después",
    "L’ora di osservazione deve essere tra 24 ore fa e 60 secondi nel futuro",
    "O horário de observação deve estar entre 24 horas atrás e 60 segundos à frente",
    "Messzeit muss zwischen 24 Stunden in der Vergangenheit und 60 Sekunden in der Zukunft liegen",
    "관측 시각은 과거 24시간~미래 60초 범위로 지정하세요"
  ],
  "course_degは360未満で指定してください": [
    "course_deg must be less than 360",
    "course_deg doit être inférieur à 360",
    "course_deg debe ser menor que 360",
    "course_deg deve essere inferiore a 360",
    "course_deg deve ser menor que 360",
    "course_deg muss unter 360 liegen",
    "course_deg는 360 미만으로 지정하세요"
  ],
  "altitude_referenceが不正です": [
    "Invalid altitude_reference",
    "altitude_reference invalide",
    "altitude_reference no válido",
    "altitude_reference non valido",
    "altitude_reference inválido",
    "Ungültige altitude_reference",
    "altitude_reference가 올바르지 않습니다"
  ],
  "NMEA緯経度の書式が不正です": [
    "Invalid NMEA latitude/longitude format",
    "Format de latitude/longitude NMEA invalide",
    "Formato de latitud/longitud NMEA no válido",
    "Formato di latitudine/longitudine NMEA non valido",
    "Formato de latitude/longitude NMEA inválido",
    "Ungültiges NMEA-Breiten-/Längenformat",
    "NMEA 위경도 서식이 올바르지 않습니다"
  ],
  "NMEA緯経度が不正です": [
    "Invalid NMEA latitude/longitude",
    "Latitude/longitude NMEA invalide",
    "Latitud/longitud NMEA no válida",
    "Latitudine/longitudine NMEA non valida",
    "Latitude/longitude NMEA inválida",
    "Ungültige NMEA-Breite/-Länge",
    "NMEA 위경도가 올바르지 않습니다"
  ],
  "NMEA緯経度の範囲が不正です": [
    "NMEA latitude/longitude out of range",
    "Latitude/longitude NMEA hors plage",
    "Latitud/longitud NMEA fuera de rango",
    "Latitudine/longitudine NMEA fuori intervallo",
    "Latitude/longitude NMEA fora do intervalo",
    "NMEA-Breite/-Länge außerhalb des Bereichs",
    "NMEA 위경도의 범위가 올바르지 않습니다"
  ],
  "RMCの日時・速度・針路が不正です": [
    "Invalid RMC date, speed or course",
    "Date, vitesse ou cap RMC invalide",
    "Fecha, velocidad o rumbo RMC no válidos",
    "Data, velocità o rotta RMC non validi",
    "Data, velocidade ou rumo RMC inválidos",
    "Ungültiges RMC-Datum, Geschwindigkeit oder Kurs",
    "RMC의 일시·속도·침로가 올바르지 않습니다"
  ],
  "局設定のJSONオブジェクトが必要です": [
    "A station settings JSON object is required",
    "Un objet JSON de réglages de station est requis",
    "Se requiere un objeto JSON de configuración de estación",
    "È richiesto un oggetto JSON di impostazioni della stazione",
    "É necessário um objeto JSON de configuração de estação",
    "JSON-Objekt mit Stationseinstellungen erforderlich",
    "국 설정의 JSON 객체가 필요합니다"
  ],
  "局種別・プロトコル・有効設定が不正です": [
    "Invalid station type, protocol or enabled setting",
    "Type de station, protocole ou activation invalide",
    "Tipo de estación, protocolo o activación no válidos",
    "Tipo di stazione, protocollo o attivazione non validi",
    "Tipo de estação, protocolo ou ativação inválidos",
    "Ungültiger Stationstyp, Protokoll oder Aktivierung",
    "국 종별·프로토콜·유효 설정이 올바르지 않습니다"
  ],
  "局名は表示可能な1〜80文字です": [
    "Station names must be 1–80 printable characters",
    "Le nom de station doit compter 1 à 80 caractères affichables",
    "El nombre de la estación debe tener de 1 a 80 caracteres imprimibles",
    "Il nome della stazione deve avere da 1 a 80 caratteri stampabili",
    "O nome da estação deve ter de 1 a 80 caracteres imprimíveis",
    "Stationsnamen müssen 1–80 druckbare Zeichen haben",
    "국명은 표시 가능한 1~80자입니다"
  ],
  "NMEA局は先に登録してください": [
    "Register the NMEA station first",
    "Enregistrez d’abord la station NMEA",
    "Registre primero la estación NMEA",
    "Registra prima la stazione NMEA",
    "Registre primeiro a estação NMEA",
    "NMEA-Station zuerst registrieren",
    "NMEA 국을 먼저 등록하세요"
  ],
  "Point Featureが必要です": [
    "A Point Feature is required",
    "Une Feature de type Point est requise",
    "Se requiere una Feature de tipo Point",
    "È richiesta una Feature di tipo Point",
    "É necessária uma Feature do tipo Point",
    "Point-Feature erforderlich",
    "Point Feature가 필요합니다"
  ],
  "WGS84 Point geometryのみ受け付けます": [
    "Only WGS84 Point geometry is accepted",
    "Seule une géométrie Point WGS84 est acceptée",
    "Solo se acepta geometría Point WGS84",
    "È accettata solo la geometria Point WGS84",
    "Somente geometria Point WGS84 é aceita",
    "Nur WGS84-Point-Geometrie wird angenommen",
    "WGS84 Point geometry만 받습니다"
  ],
  "coordinatesは[経度,緯度,任意の楕円体高m]です": [
    "coordinates must be [longitude, latitude, optional ellipsoidal height m]",
    "coordinates doit être [longitude, latitude, hauteur ellipsoïdale m facultative]",
    "coordinates debe ser [longitud, latitud, altura elipsoidal m opcional]",
    "coordinates deve essere [longitudine, latitudine, quota ellissoidica m facoltativa]",
    "coordinates deve ser [longitude, latitude, altura elipsoidal m opcional]",
    "coordinates muss [Länge, Breite, optionale Ellipsoidhöhe m] sein",
    "coordinates는 [경도, 위도, 임의의 타원체고 m]입니다"
  ],
  "局設定の上限は2000件です": [
    "Up to 2000 station settings are allowed",
    "2000 réglages de station au maximum",
    "Se permiten hasta 2000 configuraciones de estación",
    "Sono consentite al massimo 2000 impostazioni di stazione",
    "São permitidas até 2000 configurações de estação",
    "Höchstens 2000 Stationseinstellungen erlaubt",
    "국 설정 상한은 2000건입니다"
  ],
  "移動局の保持上限2000件を超えます": [
    "Exceeds the limit of 2000 stored mobile stations",
    "Dépasse la limite de 2000 stations mobiles conservées",
    "Supera el límite de 2000 estaciones móviles guardadas",
    "Supera il limite di 2000 stazioni mobili conservate",
    "Excede o limite de 2000 estações móveis guardadas",
    "Überschreitet die Grenze von 2000 gespeicherten mobilen Stationen",
    "이동국 보존 상한 2000건을 넘습니다"
  ],
  "局の受信形式・種別・有効設定と一致しません: {id}": [
    "Does not match the station input format, type or enabled setting: {id}",
    "Ne correspond pas au format, au type ou à l’activation de la station : {id}",
    "No coincide con el formato, tipo o activación de la estación: {id}",
    "Non corrisponde a formato, tipo o attivazione della stazione: {id}",
    "Não corresponde ao formato, tipo ou ativação da estação: {id}",
    "Passt nicht zu Eingabeformat, Typ oder Aktivierung der Station: {id}",
    "국의 수신 형식·종별·유효 설정과 일치하지 않습니다: {id}"
  ],
  "位置ゲートウェイURLの設定が不正です": [
    "Invalid position gateway URL setting",
    "URL de passerelle de position invalide",
    "URL de la pasarela de posiciones no válida",
    "URL del gateway di posizione non valido",
    "URL do gateway de posição inválida",
    "Ungültige URL-Einstellung des Positions-Gateways",
    "위치 게이트웨이 URL 설정이 올바르지 않습니다"
  ],
  "32文字以上のHF_POSITION_GATEWAY_TOKENを設定してください": [
    "Set an HF_POSITION_GATEWAY_TOKEN of at least 32 characters",
    "Définissez un HF_POSITION_GATEWAY_TOKEN d’au moins 32 caractères",
    "Configure un HF_POSITION_GATEWAY_TOKEN de al menos 32 caracteres",
    "Imposta un HF_POSITION_GATEWAY_TOKEN di almeno 32 caratteri",
    "Defina um HF_POSITION_GATEWAY_TOKEN com pelo menos 32 caracteres",
    "HF_POSITION_GATEWAY_TOKEN mit mindestens 32 Zeichen festlegen",
    "32자 이상의 HF_POSITION_GATEWAY_TOKEN을 설정하세요"
  ],
  "位置ゲートウェイに接続できないか、応答が不正です": [
    "Cannot reach the position gateway, or its response is invalid",
    "Passerelle de position injoignable ou réponse invalide",
    "No se puede conectar con la pasarela de posiciones o su respuesta no es válida",
    "Gateway di posizione irraggiungibile o risposta non valida",
    "Não foi possível conectar ao gateway de posição ou a resposta é inválida",
    "Positions-Gateway nicht erreichbar oder Antwort ungültig",
    "위치 게이트웨이에 연결할 수 없거나 응답이 올바르지 않습니다"
  ],
  "位置ゲートウェイの応答形式が不正です": [
    "Invalid position gateway response format",
    "Format de réponse de la passerelle de position invalide",
    "Formato de respuesta de la pasarela de posiciones no válido",
    "Formato di risposta del gateway di posizione non valido",
    "Formato de resposta do gateway de posição inválido",
    "Ungültiges Antwortformat des Positions-Gateways",
    "위치 게이트웨이의 응답 형식이 올바르지 않습니다"
  ],
  "位置ゲートウェイが局設定を拒否しました": [
    "The position gateway rejected the station settings",
    "La passerelle de position a refusé les réglages de station",
    "La pasarela de posiciones rechazó la configuración de estación",
    "Il gateway di posizione ha rifiutato le impostazioni della stazione",
    "O gateway de posição recusou a configuração de estação",
    "Das Positions-Gateway hat die Stationseinstellungen abgelehnt",
    "위치 게이트웨이가 국 설정을 거부했습니다"
  ],
  "位置ゲートウェイとの認証・通信に失敗しました（HTTP {code}）": [
    "Authentication or communication with the position gateway failed (HTTP {code})",
    "Échec d’authentification ou de communication avec la passerelle de position (HTTP {code})",
    "Falló la autenticación o la comunicación con la pasarela de posiciones (HTTP {code})",
    "Autenticazione o comunicazione con il gateway di posizione non riuscita (HTTP {code})",
    "Falha na autenticação ou comunicação com o gateway de posição (HTTP {code})",
    "Authentifizierung oder Kommunikation mit dem Positions-Gateway fehlgeschlagen (HTTP {code})",
    "위치 게이트웨이와의 인증·통신에 실패했습니다(HTTP {code})"
  ],
  "ゲートウェイの認証設定が未完了です": [
    "Gateway authentication is not configured",
    "L’authentification de la passerelle n’est pas configurée",
    "La autenticación de la pasarela no está configurada",
    "L’autenticazione del gateway non è configurata",
    "A autenticação do gateway não está configurada",
    "Gateway-Authentifizierung ist nicht eingerichtet",
    "게이트웨이 인증 설정이 완료되지 않았습니다"
  ],
  "外部受信用と本体連携用には別のトークンを設定してください": [
    "Use different tokens for external ingestion and the main app connection",
    "Utilisez des jetons distincts pour la réception externe et la liaison avec l’application",
    "Use tokens distintos para la recepción externa y la conexión con la aplicación",
    "Usa token diversi per la ricezione esterna e il collegamento con l’app",
    "Use tokens diferentes para a recepção externa e a conexão com o aplicativo",
    "Für externen Empfang und App-Anbindung unterschiedliche Tokens verwenden",
    "외부 수신용과 본체 연계용에는 다른 토큰을 설정하세요"
  ],
  "有効なBearerトークンが必要です": [
    "A valid Bearer token is required",
    "Un jeton Bearer valide est requis",
    "Se requiere un token Bearer válido",
    "È richiesto un token Bearer valido",
    "É necessário um token Bearer válido",
    "Gültiges Bearer-Token erforderlich",
    "유효한 Bearer 토큰이 필요합니다"
  ],
  "位置ゲートウェイへのブラウザ直接アクセスは受け付けません": [
    "Direct browser access to the position gateway is not accepted",
    "L’accès direct du navigateur à la passerelle de position est refusé",
    "No se acepta el acceso directo del navegador a la pasarela de posiciones",
    "L’accesso diretto dal browser al gateway di posizione non è consentito",
    "O acesso direto do navegador ao gateway de posição não é aceito",
    "Direkter Browserzugriff auf das Positions-Gateway wird nicht angenommen",
    "위치 게이트웨이로의 브라우저 직접 접근은 받지 않습니다"
  ],
  "ゲートウェイDBを読み込めません": [
    "Cannot read the gateway database",
    "Impossible de lire la base de la passerelle",
    "No se puede leer la base de datos de la pasarela",
    "Impossibile leggere il database del gateway",
    "Não foi possível ler o banco de dados do gateway",
    "Gateway-Datenbank kann nicht gelesen werden",
    "게이트웨이 DB를 읽을 수 없습니다"
  ],
  "ゲートウェイDBに保存できません": [
    "Cannot save to the gateway database",
    "Impossible d’enregistrer dans la base de la passerelle",
    "No se puede guardar en la base de datos de la pasarela",
    "Impossibile salvare nel database del gateway",
    "Não foi possível salvar no banco de dados do gateway",
    "Speichern in der Gateway-Datenbank nicht möglich",
    "게이트웨이 DB에 저장할 수 없습니다"
  ],
  "本体連接は{path}を使用してください": [
    "Use {path} for the main app connection",
    "Utilisez {path} pour la liaison avec l’application",
    "Use {path} para la conexión con la aplicación",
    "Usa {path} per il collegamento con l’app",
    "Use {path} para a conexão com o aplicativo",
    "Für die App-Anbindung {path} verwenden",
    "본체 연계는 {path}를 사용하세요"
  ],
  "管理操作は同一オリジンから行ってください。": [
    "Perform administration from the same origin.",
    "Effectuez l’administration depuis la même origine.",
    "Realice la administración desde el mismo origen.",
    "Esegui l’amministrazione dalla stessa origine.",
    "Faça a administração a partir da mesma origem.",
    "Verwaltung bitte vom selben Ursprung aus durchführen.",
    "관리 조작은 같은 출처에서 하세요."
  ],
  "管理操作に失敗しました。": [
    "Administration failed.",
    "Échec de l’opération d’administration.",
    "Falló la operación de administración.",
    "Operazione di amministrazione non riuscita.",
    "A operação de administração falhou.",
    "Verwaltungsvorgang fehlgeschlagen.",
    "관리 조작에 실패했습니다."
  ],
  "署名が一致しません": [
    "Signature mismatch",
    "Signature incorrecte",
    "La firma no coincide",
    "Firma non corrispondente",
    "A assinatura não confere",
    "Signatur stimmt nicht",
    "서명이 일치하지 않습니다"
  ],
  "source が必要です": [
    "source is required",
    "source est requis",
    "Se requiere source",
    "È richiesto source",
    "source é necessário",
    "source erforderlich",
    "source가 필요합니다"
  ],
  "usd は0以上の金額にしてください": [
    "usd must be an amount of 0 or more",
    "usd doit être un montant positif ou nul",
    "usd debe ser un importe de 0 o más",
    "usd deve essere un importo pari o superiore a 0",
    "usd deve ser um valor de 0 ou mais",
    "usd muss ein Betrag ab 0 sein",
    "usd는 0 이상의 금액으로 하세요"
  ],
  "状態が不正です": [
    "Invalid status",
    "État invalide",
    "Estado no válido",
    "Stato non valido",
    "Estado inválido",
    "Ungültiger Status",
    "상태가 올바르지 않습니다"
  ],
  "1つのユーザー名で送れる資料は{count}件までです": [
    "Up to {count} documents can be sent per user name",
    "{count} documents au maximum par nom d’utilisateur",
    "Se pueden enviar hasta {count} documentos por nombre de usuario",
    "Si possono inviare al massimo {count} documenti per nome utente",
    "É possível enviar até {count} documentos por nome de usuário",
    "Pro Benutzername höchstens {count} Dokumente",
    "하나의 사용자 이름으로 보낼 수 있는 자료는 {count}건까지입니다"
  ],
  "スポンサーが見つかりません": [
    "Sponsor not found",
    "Sponsor introuvable",
    "Patrocinador no encontrado",
    "Sponsor non trovato",
    "Patrocinador não encontrado",
    "Sponsor nicht gefunden",
    "스폰서를 찾을 수 없습니다"
  ],
  "{id}の受信形式": [
    "{id} input format",
    "Format de réception de {id}",
    "Formato de recepción de {id}",
    "Formato di ricezione di {id}",
    "Formato de recepção de {id}",
    "Eingabeformat von {id}",
    "{id}의 수신 형식"
  ],
  "{id}の受信有効": [
    "{id} input enabled",
    "Réception activée pour {id}",
    "Recepción activada para {id}",
    "Ricezione attiva per {id}",
    "Recepção ativada para {id}",
    "Empfang aktiv für {id}",
    "{id}의 수신 유효"
  ],
  "垂直ホイップ 2.4 m": [
    "Vertical whip 2.4 m",
    "Fouet vertical 2,4 m",
    "Látigo vertical 2,4 m",
    "Stilo verticale 2,4 m",
    "Chicote vertical 2,4 m",
    "Vertikale Peitsche 2,4 m",
    "수직 휩 2.4 m"
  ],
  "垂直ホイップ 5 m": [
    "Vertical whip 5 m",
    "Fouet vertical 5 m",
    "Látigo vertical 5 m",
    "Stilo verticale 5 m",
    "Chicote vertical 5 m",
    "Vertikale Peitsche 5 m",
    "수직 휩 5 m"
  ],
  "垂直ホイップ 7 m": [
    "Vertical whip 7 m",
    "Fouet vertical 7 m",
    "Látigo vertical 7 m",
    "Stilo verticale 7 m",
    "Chicote vertical 7 m",
    "Vertikale Peitsche 7 m",
    "수직 휩 7 m"
  ],
  "垂直ホイップ 10 m": [
    "Vertical whip 10 m",
    "Fouet vertical 10 m",
    "Látigo vertical 10 m",
    "Stilo verticale 10 m",
    "Chicote vertical 10 m",
    "Vertikale Peitsche 10 m",
    "수직 휩 10 m"
  ],
  "グランドプレーン 5 m": [
    "Ground plane 5 m",
    "Ground plane 5 m",
    "Plano de tierra 5 m",
    "Ground plane 5 m",
    "Plano de terra 5 m",
    "Groundplane 5 m",
    "그라운드 플레인 5 m"
  ],
  "index.htmlの構成が想定と異なります": [
    "index.html does not have the expected structure",
    "index.html n’a pas la structure attendue",
    "index.html no tiene la estructura esperada",
    "index.html non ha la struttura prevista",
    "index.html não tem a estrutura esperada",
    "index.html hat nicht den erwarteten Aufbau",
    "index.html의 구성이 예상과 다릅니다"
  ],
  "中継": [
    "Relay",
    "Relais",
    "Relevo",
    "Relay",
    "Retransmissão",
    "Relais",
    "중계"
  ],
  "直通のみ": [
    "Direct only",
    "Direct uniquement",
    "Solo directo",
    "Solo diretto",
    "Somente direto",
    "Nur direkt",
    "직접만"
  ],
  "1段まで": [
    "Up to 1 relay",
    "Jusqu’à 1 relais",
    "Hasta 1 relevo",
    "Fino a 1 relay",
    "Até 1 retransmissão",
    "Bis 1 Relais",
    "1단까지"
  ],
  "2段まで": [
    "Up to 2 relays",
    "Jusqu’à 2 relais",
    "Hasta 2 relevos",
    "Fino a 2 relay",
    "Até 2 retransmissões",
    "Bis 2 Relais",
    "2단까지"
  ],
  "中継で到達: {count} 経路 · 到達不可: {none} 経路（{hops}段まで）": [
    "Reachable via relay: {count} links · Unreachable: {none} links (up to {hops} relays)",
    "Accessibles par relais : {count} liaisons · Inaccessibles : {none} liaisons (jusqu’à {hops} relais)",
    "Alcanzables por relevo: {count} enlaces · Inalcanzables: {none} enlaces (hasta {hops} relevos)",
    "Raggiungibili via relay: {count} collegamenti · Non raggiungibili: {none} collegamenti (fino a {hops} relay)",
    "Alcançáveis por retransmissão: {count} enlaces · Inalcançáveis: {none} enlaces (até {hops} retransmissões)",
    "Über Relais erreichbar: {count} Verbindungen · Nicht erreichbar: {none} Verbindungen (bis {hops} Relais)",
    "중계로 도달: {count} 경로 · 도달 불가: {none} 경로({hops}단까지)"
  ],
  "{link} / 中継{count}段: {route}": [
    "{link} / {count} relay(s): {route}",
    "{link} / {count} relais : {route}",
    "{link} / {count} relevo(s): {route}",
    "{link} / {count} relay: {route}",
    "{link} / {count} retransmissão(ões): {route}",
    "{link} / {count} Relais: {route}",
    "{link} / 중계 {count}단: {route}"
  ],
  "直通で目標RELを満たします": [
    "Meets the target REL directly",
    "Atteint la REL cible en direct",
    "Cumple la REL objetivo en directo",
    "Raggiunge la REL obiettivo in diretta",
    "Atinge a REL alvo diretamente",
    "Erreicht die Ziel-REL direkt",
    "직접으로 목표 REL을 충족합니다"
  ],
  "{hops}段までの中継でも目標RELを満たす経路はありません": [
    "No route meets the target REL even with up to {hops} relays",
    "Aucun itinéraire n’atteint la REL cible, même avec jusqu’à {hops} relais",
    "Ninguna ruta cumple la REL objetivo ni con hasta {hops} relevos",
    "Nessun percorso raggiunge la REL obiettivo nemmeno con fino a {hops} relay",
    "Nenhuma rota atinge a REL alvo mesmo com até {hops} retransmissões",
    "Keine Route erreicht die Ziel-REL, auch nicht mit bis zu {hops} Relais",
    "{hops}단까지 중계해도 목표 REL을 충족하는 경로가 없습니다"
  ],
  "中継経路（{count}段）:": [
    "Relay route ({count} relay(s)):",
    "Itinéraire de relais ({count}) :",
    "Ruta de relevo ({count}):",
    "Percorso relay ({count}):",
    "Rota de retransmissão ({count}):",
    "Relaisroute ({count}):",
    "중계 경로({count}단):"
  ],
  "RELは各経路・UTC・周波数の月間統計です。VOACAPは送受信を入れ替えるとアンテナ・送信電力・受信雑音が変わるため、行（TX）と列（RX）の有向経路を別々に計算します。中継（最大2段）は各区間が目標REL以上かどうかだけで判定し、区間をまとめた通しのREL・中継の遅延・同時送信の干渉・チャネル割当・経路間の相関はモデル化していません。経路ごとの生出力は保存しません。必要な場合は単一RXで再計算してください。": [
    "REL is a monthly statistic per link, UTC hour and frequency. Swapping TX and RX changes antennas, transmit power and receiver noise in VOACAP, so each directed link (row TX, column RX) is calculated separately. Relays (up to 2) are judged only by whether every hop meets the target REL; an end-to-end REL across hops, relay delay, simultaneous-transmission interference, channel assignment and correlation between links are not modelled. Raw output per link is not stored; recalculate as a single RX if needed.",
    "La REL est une statistique mensuelle par liaison, heure UTC et fréquence. Inverser TX et RX change antennes, puissance d’émission et bruit de réception dans VOACAP ; chaque liaison orientée (ligne TX, colonne RX) est donc calculée séparément. Les relais (jusqu’à 2) sont jugés uniquement selon que chaque saut atteint la REL cible ; la REL de bout en bout, le délai des relais, les interférences d’émissions simultanées, l’attribution des canaux et la corrélation entre liaisons ne sont pas modélisés. La sortie brute par liaison n’est pas conservée ; recalculez en RX unique si besoin.",
    "REL es una estadística mensual por enlace, hora UTC y frecuencia. Intercambiar TX y RX cambia antenas, potencia de transmisión y ruido de recepción en VOACAP, por lo que cada enlace dirigido (fila TX, columna RX) se calcula por separado. Los relevos (hasta 2) se evalúan solo según si cada salto cumple la REL objetivo; no se modelan la REL de extremo a extremo, el retardo de los relevos, la interferencia por transmisiones simultáneas, la asignación de canales ni la correlación entre enlaces. No se guarda la salida bruta por enlace; recalcule con un solo RX si la necesita.",
    "La REL è una statistica mensile per collegamento, ora UTC e frequenza. Scambiando TX e RX cambiano in VOACAP antenne, potenza di trasmissione e rumore di ricezione, quindi ogni collegamento orientato (riga TX, colonna RX) è calcolato separatamente. I relay (fino a 2) sono valutati solo in base al fatto che ogni tratta raggiunga la REL obiettivo; REL complessiva, ritardo dei relay, interferenza da trasmissioni simultanee, assegnazione dei canali e correlazione tra collegamenti non sono modellati. L’output grezzo per collegamento non viene salvato; ricalcola con un solo RX se serve.",
    "REL é uma estatística mensal por enlace, hora UTC e frequência. Trocar TX e RX muda antenas, potência de transmissão e ruído de recepção no VOACAP, por isso cada enlace direcionado (linha TX, coluna RX) é calculado separadamente. As retransmissões (até 2) são avaliadas apenas pelo fato de cada salto atingir a REL alvo; REL ponta a ponta, atraso das retransmissões, interferência de transmissões simultâneas, atribuição de canais e correlação entre enlaces não são modelados. A saída bruta por enlace não é salva; recalcule com um único RX se necessário.",
    "REL ist eine Monatsstatistik je Verbindung, UTC-Stunde und Frequenz. Das Vertauschen von TX und RX ändert in VOACAP Antennen, Sendeleistung und Empfangsrauschen, daher wird jede gerichtete Verbindung (Zeile TX, Spalte RX) getrennt berechnet. Relais (bis zu 2) werden nur danach beurteilt, ob jeder Abschnitt die Ziel-REL erreicht; eine durchgehende REL, Relaisverzögerung, Störungen durch gleichzeitiges Senden, Kanalzuteilung und Korrelation zwischen Verbindungen werden nicht modelliert. Rohausgaben je Verbindung werden nicht gespeichert; bei Bedarf als einzelnen RX neu berechnen.",
    "REL은 경로·UTC 시각·주파수별 월간 통계입니다. VOACAP에서는 송수신을 바꾸면 안테나·송신 전력·수신 잡음이 달라지므로 행(TX)과 열(RX)의 방향별 경로를 따로 계산합니다. 중계(최대 2단)는 모든 구간이 목표 REL 이상인지로만 판정하며, 구간을 합친 종단 간 REL, 중계 지연, 동시 송신 간섭, 채널 할당, 경로 간 상관은 모델링하지 않습니다. 경로별 원시 출력은 저장하지 않으며, 필요하면 단일 RX로 다시 계산하세요."
  ],
  "運用周波数の24時間計画": [
    "24-hour operating frequency plan",
    "Plan de fréquences d’exploitation sur 24 h",
    "Plan de frecuencias de operación de 24 h",
    "Piano delle frequenze operative sulle 24 ore",
    "Plano de frequências de operação de 24 h",
    "24-Stunden-Betriebsfrequenzplan",
    "24시간 운용 주파수 계획"
  ],
  "方針": [
    "Policy",
    "Stratégie",
    "Criterio",
    "Criterio",
    "Critério",
    "Strategie",
    "방침"
  ],
  "切替を抑える": [
    "Fewest switches",
    "Moins de changements",
    "Menos cambios",
    "Meno cambi",
    "Menos trocas",
    "Wenige Wechsel",
    "전환 최소화"
  ],
  "毎時最良": [
    "Best each hour",
    "Meilleure chaque heure",
    "Mejor cada hora",
    "Migliore ogni ora",
    "Melhor a cada hora",
    "Jede Stunde die beste",
    "매시 최적"
  ],
  "印刷": [
    "Print",
    "Imprimer",
    "Imprimir",
    "Stampa",
    "Imprimir",
    "Drucken",
    "인쇄"
  ],
  "計算した周波数を割当周波数とみなし、時間帯ごとに使う周波数を決めます。「切替を抑える」は、目標REL以上の時間を毎時最良と同じだけ確保したうえで、切替回数が最も少なくなるように選びます（23時から0時への切替も数えます）。": [
    "The calculated frequencies are treated as the assigned set, and one frequency is chosen for each time block. “Fewest switches” keeps as many hours at or above the target REL as “Best each hour”, then chooses the fewest frequency changes (the 23:00→00:00 change is counted too).",
    "Les fréquences calculées sont considérées comme les fréquences attribuées, et une fréquence est choisie pour chaque plage horaire. « Moins de changements » conserve autant d’heures à la REL cible ou plus que « Meilleure chaque heure », puis choisit le moins de changements (le passage de 23:00 à 00:00 est compté).",
    "Las frecuencias calculadas se consideran las frecuencias asignadas y se elige una frecuencia para cada franja horaria. «Menos cambios» mantiene tantas horas en la REL objetivo o por encima como «Mejor cada hora» y luego elige el menor número de cambios (también se cuenta el cambio de 23:00 a 00:00).",
    "Le frequenze calcolate sono considerate le frequenze assegnate e per ogni fascia oraria viene scelta una frequenza. «Meno cambi» mantiene tante ore pari o superiori alla REL obiettivo quante «Migliore ogni ora», poi sceglie il minor numero di cambi (si conta anche il cambio dalle 23:00 alle 00:00).",
    "As frequências calculadas são tratadas como as frequências atribuídas, e uma frequência é escolhida para cada faixa horária. “Menos trocas” mantém tantas horas na REL alvo ou acima quanto “Melhor a cada hora” e depois escolhe o menor número de trocas (a troca das 23:00 para 00:00 também conta).",
    "Die berechneten Frequenzen gelten als zugeteilte Frequenzen, und für jeden Zeitblock wird eine Frequenz gewählt. „Wenige Wechsel“ hält so viele Stunden auf oder über der Ziel-REL wie „Jede Stunde die beste“ und wählt dann die wenigsten Wechsel (der Wechsel von 23:00 auf 00:00 zählt mit).",
    "계산한 주파수를 할당 주파수로 보고 시간대마다 사용할 주파수를 정합니다. '전환 최소화'는 목표 REL 이상인 시간을 '매시 최적'과 같은 만큼 확보한 뒤 전환 횟수가 가장 적도록 고릅니다(23시에서 0시로의 전환도 셉니다)."
  ],
  "計算後に運用周波数の計画を表示します": [
    "The operating frequency plan appears after calculation",
    "Le plan de fréquences s’affiche après le calcul",
    "El plan de frecuencias aparece tras el cálculo",
    "Il piano delle frequenze appare dopo il calcolo",
    "O plano de frequências aparece após o cálculo",
    "Der Frequenzplan erscheint nach der Berechnung",
    "계산 후 운용 주파수 계획을 표시합니다"
  ],
  "{date} · SSN {ssn} · 目標REL {rel}% · {distance} km · 割当 {count} 波": [
    "{date} · SSN {ssn} · Target REL {rel}% · {distance} km · {count} assigned frequencies",
    "{date} · SSN {ssn} · REL cible {rel}% · {distance} km · {count} fréquences attribuées",
    "{date} · SSN {ssn} · REL objetivo {rel}% · {distance} km · {count} frecuencias asignadas",
    "{date} · SSN {ssn} · REL obiettivo {rel}% · {distance} km · {count} frequenze assegnate",
    "{date} · SSN {ssn} · REL alvo {rel}% · {distance} km · {count} frequências atribuídas",
    "{date} · SSN {ssn} · Ziel-REL {rel}% · {distance} km · {count} zugeteilte Frequenzen",
    "{date} · SSN {ssn} · 목표 REL {rel}% · {distance} km · 할당 {count}파"
  ],
  "切替 {count} 回 · 目標REL以上 {met} / {total} 時間 · 方針: {label}": [
    "{count} switches · At or above target REL: {met} / {total} hours · Policy: {label}",
    "{count} changements · REL cible atteinte : {met} / {total} heures · Stratégie : {label}",
    "{count} cambios · En la REL objetivo o más: {met} / {total} horas · Criterio: {label}",
    "{count} cambi · REL obiettivo raggiunta: {met} / {total} ore · Criterio: {label}",
    "{count} trocas · Na REL alvo ou acima: {met} / {total} horas · Critério: {label}",
    "{count} Wechsel · Ziel-REL erreicht: {met} / {total} Stunden · Strategie: {label}",
    "전환 {count}회 · 목표 REL 이상: {met} / {total}시간 · 방침: {label}"
  ],
  "時間帯 UTC": [
    "Time block UTC",
    "Plage UTC",
    "Franja UTC",
    "Fascia UTC",
    "Faixa UTC",
    "Zeitblock UTC",
    "시간대 UTC"
  ],
  "最低SNR dB·Hz": [
    "Lowest SNR dB·Hz",
    "SNR minimal dB·Hz",
    "SNR mínima dB·Hz",
    "SNR minimo dB·Hz",
    "SNR mínima dB·Hz",
    "Niedrigste SNR dB·Hz",
    "최저 SNR dB·Hz"
  ],
  "目標REL未達": [
    "Below target REL",
    "Sous la REL cible",
    "Por debajo de la REL objetivo",
    "Sotto la REL obiettivo",
    "Abaixo da REL alvo",
    "Unter Ziel-REL",
    "목표 REL 미달"
  ],
  "{n} 時間": [
    "{n} h",
    "{n} h",
    "{n} h",
    "{n} h",
    "{n} h",
    "{n} h",
    "{n}시간"
  ],
  "印刷用のウィンドウを開けませんでした。ポップアップの許可を確認してください。": [
    "Could not open the print window. Check that pop-ups are allowed.",
    "Impossible d’ouvrir la fenêtre d’impression. Vérifiez que les fenêtres contextuelles sont autorisées.",
    "No se pudo abrir la ventana de impresión. Compruebe que las ventanas emergentes están permitidas.",
    "Impossibile aprire la finestra di stampa. Verifica che i pop-up siano consentiti.",
    "Não foi possível abrir a janela de impressão. Verifique se os pop-ups estão permitidos.",
    "Das Druckfenster konnte nicht geöffnet werden. Prüfen Sie, ob Pop-ups erlaubt sind.",
    "인쇄 창을 열 수 없습니다. 팝업이 허용되어 있는지 확인하세요."
  ],
  "12か月予測": [
    "12-month forecast",
    "Prévision sur 12 mois",
    "Predicción de 12 meses",
    "Previsione a 12 mesi",
    "Previsão de 12 meses",
    "12-Monats-Prognose",
    "12개월 예측"
  ],
  "12か月予測 · 月 × UTC のREL（%）": [
    "12-month forecast · REL by month × UTC (%)",
    "Prévision sur 12 mois · REL par mois × UTC (%)",
    "Predicción de 12 meses · REL por mes × UTC (%)",
    "Previsione a 12 mesi · REL per mese × UTC (%)",
    "Previsão de 12 meses · REL por mês × UTC (%)",
    "12-Monats-Prognose · REL nach Monat × UTC (%)",
    "12개월 예측 · 월 × UTC별 REL(%)"
  ],
  "12か月を計算": [
    "Calculate 12 months",
    "Calculer 12 mois",
    "Calcular 12 meses",
    "Calcola 12 mesi",
    "Calcular 12 meses",
    "12 Monate berechnen",
    "12개월 계산"
  ],
  "右側のTXとRX1の経路について、予測条件の年月から12か月分の24時間予測を計算します（エンジン12回）。SSNは手動入力なら全月に同じ値、NOAAなら月ごとの平滑SSNを使います。実効SSNは使えません。": [
    "For the path from TX to RX1 on the right, calculates 24-hour predictions for 12 months starting from the month in the prediction conditions (12 engine runs). A manual SSN is used for every month; NOAA uses each month’s smoothed SSN. The effective SSN cannot be used.",
    "Pour le trajet du TX vers RX1 à droite, calcule les prévisions sur 24 heures de 12 mois à partir du mois des conditions de prévision (12 exécutions du moteur). Une SSN manuelle sert pour tous les mois ; NOAA utilise la SSN lissée de chaque mois. La SSN effective n’est pas utilisable.",
    "Para el trayecto del TX al RX1 de la derecha, calcula predicciones de 24 horas de 12 meses a partir del mes de las condiciones de predicción (12 ejecuciones del motor). Una SSN manual se usa en todos los meses; NOAA usa la SSN suavizada de cada mes. No se puede usar la SSN efectiva.",
    "Per il percorso dal TX all’RX1 a destra, calcola previsioni di 24 ore per 12 mesi a partire dal mese delle condizioni di previsione (12 esecuzioni del motore). Una SSN manuale vale per tutti i mesi; NOAA usa la SSN livellata di ogni mese. La SSN effettiva non è utilizzabile.",
    "Para o trajeto do TX ao RX1 à direita, calcula previsões de 24 horas de 12 meses a partir do mês das condições de previsão (12 execuções do motor). Uma SSN manual vale para todos os meses; a NOAA usa a SSN suavizada de cada mês. A SSN efetiva não pode ser usada.",
    "Berechnet für den Pfad von TX zu RX1 rechts 24-Stunden-Prognosen für 12 Monate ab dem Monat der Prognosebedingungen (12 Engine-Läufe). Eine manuelle SSN gilt für alle Monate; NOAA verwendet die geglättete SSN jedes Monats. Die effektive SSN ist nicht verwendbar.",
    "오른쪽 TX에서 RX1까지의 경로에 대해 예측 조건의 연월부터 12개월분의 24시간 예측을 계산합니다(엔진 12회). 수동 SSN은 모든 달에 같은 값을, NOAA는 달마다의 평활 SSN을 사용합니다. 실효 SSN은 사용할 수 없습니다."
  ],
  "計算後に、月ごと・UTCごとのRELを表示します。": [
    "After calculation, REL is shown by month and UTC hour.",
    "Après le calcul, la REL s’affiche par mois et par heure UTC.",
    "Tras el cálculo se muestra la REL por mes y hora UTC.",
    "Dopo il calcolo, la REL viene mostrata per mese e ora UTC.",
    "Após o cálculo, a REL é exibida por mês e hora UTC.",
    "Nach der Berechnung wird die REL nach Monat und UTC-Stunde angezeigt.",
    "계산 후 월별·UTC별 REL을 표시합니다."
  ],
  "最良周波数では、セルの下段にREL最大の周波数（MHz）を表示します。点は目標REL以上、灰色は欠測です。右端は目標REL以上の時間数です。セルを選ぶと下にその月の周波数別の24時間を表示します。": [
    "With Best frequency, the lower line of each cell shows the frequency (MHz) with the highest REL. A dot marks the target REL or above; grey is missing data. The right column counts hours at or above the target REL. Select a cell to show that month’s 24 hours per frequency below.",
    "Avec Meilleure fréquence, la ligne inférieure de chaque cellule indique la fréquence (MHz) de REL maximale. Un point marque la REL cible ou plus ; le gris indique des données manquantes. La colonne de droite compte les heures à la REL cible ou plus. Sélectionnez une cellule pour afficher en dessous les 24 heures de ce mois par fréquence.",
    "Con Mejor frecuencia, la línea inferior de cada celda muestra la frecuencia (MHz) de mayor REL. Un punto marca la REL objetivo o superior; el gris indica datos ausentes. La columna derecha cuenta las horas en la REL objetivo o superior. Seleccione una celda para ver debajo las 24 horas de ese mes por frecuencia.",
    "Con Frequenza migliore, la riga inferiore di ogni cella mostra la frequenza (MHz) con la REL più alta. Un punto indica la REL obiettivo o superiore; il grigio indica dati mancanti. La colonna di destra conta le ore pari o superiori alla REL obiettivo. Seleziona una cella per mostrare sotto le 24 ore di quel mese per frequenza.",
    "Com Melhor frequência, a linha inferior de cada célula mostra a frequência (MHz) de maior REL. Um ponto marca a REL alvo ou acima; o cinza indica dados ausentes. A coluna da direita conta as horas na REL alvo ou acima. Selecione uma célula para ver abaixo as 24 horas desse mês por frequência.",
    "Bei Beste Frequenz zeigt die untere Zeile jeder Zelle die Frequenz (MHz) mit der höchsten REL. Ein Punkt markiert die Ziel-REL oder mehr; Grau bedeutet fehlende Daten. Die rechte Spalte zählt die Stunden auf oder über der Ziel-REL. Eine Zelle wählen, um unten die 24 Stunden dieses Monats je Frequenz anzuzeigen.",
    "최적 주파수에서는 셀 아래쪽에 REL이 가장 높은 주파수(MHz)를 표시합니다. 점은 목표 REL 이상, 회색은 결측입니다. 오른쪽 끝은 목표 REL 이상인 시간 수입니다. 셀을 선택하면 아래에 그 달의 주파수별 24시간을 표시합니다."
  ],
  "月の詳細 · 周波数 × UTC": [
    "Month detail · frequency × UTC",
    "Détail du mois · fréquence × UTC",
    "Detalle del mes · frecuencia × UTC",
    "Dettaglio del mese · frequenza × UTC",
    "Detalhe do mês · frequência × UTC",
    "Monatsdetail · Frequenz × UTC",
    "월 상세 · 주파수 × UTC"
  ],
  "各月のRELはその月の月間統計です。手動SSNでは12か月すべてに同じSSNを使います。NOAAの平滑SSNでは月ごとの値を使い、新鮮な値がない月は計算しません。実際の太陽活動・季節変化の年ごとの違いは反映しません。各月の生出力・入力カードは保存しません。必要な月は単一RXで再計算してください。": [
    "Each month’s REL is that month’s monthly statistic. With a manual SSN the same SSN is used for all 12 months; with NOAA’s smoothed SSN each month uses its own value, and months without a fresh value are not calculated. Year-to-year differences in actual solar activity and seasons are not reflected. Raw output and input cards per month are not stored; recalculate a month as a single RX if needed.",
    "La REL de chaque mois est la statistique mensuelle de ce mois. Avec une SSN manuelle, la même SSN sert pour les 12 mois ; avec la SSN lissée NOAA, chaque mois utilise sa propre valeur et les mois sans valeur récente ne sont pas calculés. Les différences d’une année à l’autre de l’activité solaire réelle et des saisons ne sont pas prises en compte. La sortie brute et les cartes d’entrée par mois ne sont pas conservées ; recalculez un mois en RX unique si besoin.",
    "La REL de cada mes es la estadística mensual de ese mes. Con SSN manual se usa la misma SSN en los 12 meses; con la SSN suavizada de NOAA cada mes usa su propio valor y los meses sin un valor reciente no se calculan. No se reflejan las diferencias interanuales de la actividad solar real ni de las estaciones. No se guardan la salida bruta ni las tarjetas de entrada por mes; recalcule un mes con un solo RX si lo necesita.",
    "La REL di ogni mese è la statistica mensile di quel mese. Con una SSN manuale si usa la stessa SSN per tutti i 12 mesi; con la SSN livellata NOAA ogni mese usa il proprio valore e i mesi senza un valore recente non vengono calcolati. Le differenze tra un anno e l’altro dell’attività solare reale e delle stagioni non sono considerate. Output grezzo e schede di input per mese non vengono salvati; ricalcola un mese con un solo RX se serve.",
    "A REL de cada mês é a estatística mensal desse mês. Com SSN manual, a mesma SSN é usada nos 12 meses; com a SSN suavizada da NOAA, cada mês usa o próprio valor e os meses sem valor recente não são calculados. Diferenças de um ano para outro na atividade solar real e nas estações não são refletidas. A saída bruta e os cartões de entrada por mês não são salvos; recalcule um mês com um único RX se necessário.",
    "Die REL jedes Monats ist die Monatsstatistik dieses Monats. Mit manueller SSN gilt dieselbe SSN für alle 12 Monate; mit der geglätteten NOAA-SSN verwendet jeder Monat seinen eigenen Wert, und Monate ohne aktuellen Wert werden nicht berechnet. Jährliche Unterschiede der tatsächlichen Sonnenaktivität und der Jahreszeiten werden nicht berücksichtigt. Rohausgaben und Eingabekarten je Monat werden nicht gespeichert; einen Monat bei Bedarf als einzelnen RX neu berechnen.",
    "각 달의 REL은 그 달의 월간 통계입니다. 수동 SSN에서는 12개월 모두 같은 SSN을, NOAA 평활 SSN에서는 달마다의 값을 사용하며 최신 값이 없는 달은 계산하지 않습니다. 실제 태양 활동과 계절의 해마다의 차이는 반영하지 않습니다. 달별 원시 출력·입력 카드는 저장하지 않으며, 필요한 달은 단일 RX로 다시 계산하세요."
  ],
  "12か月のどの月にも使えるSSNがありません": [
    "No usable SSN for any of the 12 months",
    "Aucune SSN utilisable pour l’un des 12 mois",
    "Ninguno de los 12 meses tiene una SSN utilizable",
    "Nessuna SSN utilizzabile per nessuno dei 12 mesi",
    "Nenhum dos 12 meses tem SSN utilizável",
    "Für keinen der 12 Monate ist eine verwendbare SSN vorhanden",
    "12개월 중 사용할 수 있는 SSN이 있는 달이 없습니다"
  ],
  "12か月予測では実効SSNを使えません。手動入力かNOAAの平滑SSNを選んでください。": [
    "The effective SSN cannot be used for the 12-month forecast. Choose manual input or NOAA smoothed SSN.",
    "La SSN effective n’est pas utilisable pour la prévision sur 12 mois. Choisissez la saisie manuelle ou la SSN lissée NOAA.",
    "No se puede usar la SSN efectiva en la predicción de 12 meses. Elija entrada manual o la SSN suavizada de NOAA.",
    "La SSN effettiva non è utilizzabile per la previsione a 12 mesi. Scegli l’inserimento manuale o la SSN livellata NOAA.",
    "A SSN efetiva não pode ser usada na previsão de 12 meses. Escolha entrada manual ou a SSN suavizada da NOAA.",
    "Die effektive SSN ist für die 12-Monats-Prognose nicht verwendbar. Manuelle Eingabe oder geglättete NOAA-SSN wählen.",
    "12개월 예측에서는 실효 SSN을 사용할 수 없습니다. 수동 입력이나 NOAA 평활 SSN을 선택하세요."
  ],
  "NOAAの新鮮な平滑SSNがありません": [
    "No fresh NOAA smoothed SSN",
    "Pas de SSN lissée NOAA récente",
    "No hay SSN suavizada reciente de NOAA",
    "Nessuna SSN livellata NOAA recente",
    "Sem SSN suavizada recente da NOAA",
    "Keine aktuelle geglättete NOAA-SSN",
    "최신 NOAA 평활 SSN이 없습니다"
  ],
  "{span} · NOAAの月ごとの平滑SSN×0.7 · {power} W · {distance} km · 要求SNR {snr} dB·Hz · 目標REL {rel}% · 吸収モード {label}": [
    "{span} · NOAA smoothed SSN per month×0.7 · {power} W · {distance} km · Required SNR {snr} dB·Hz · Target REL {rel}% · Absorption mode {label}",
    "{span} · SSN lissée NOAA par mois×0.7 · {power} W · {distance} km · SNR requis {snr} dB·Hz · REL cible {rel}% · Mode d’absorption {label}",
    "{span} · SSN suavizada de NOAA por mes×0.7 · {power} W · {distance} km · SNR requerida {snr} dB·Hz · REL objetivo {rel}% · Modo de absorción {label}",
    "{span} · SSN livellata NOAA per mese×0.7 · {power} W · {distance} km · SNR richiesto {snr} dB·Hz · REL obiettivo {rel}% · Modalità di assorbimento {label}",
    "{span} · SSN suavizada da NOAA por mês×0.7 · {power} W · {distance} km · SNR exigida {snr} dB·Hz · REL alvo {rel}% · Modo de absorção {label}",
    "{span} · Geglättete NOAA-SSN je Monat×0.7 · {power} W · {distance} km · Erforderliche SNR {snr} dB·Hz · Ziel-REL {rel}% · Absorptionsmodus {label}",
    "{span} · 월별 NOAA 평활 SSN×0.7 · {power} W · {distance} km · 요구 SNR {snr} dB·Hz · 목표 REL {rel}% · 흡수 모드 {label}"
  ],
  "{span} · SSN {ssn}（全月共通） · {power} W · {distance} km · 要求SNR {snr} dB·Hz · 目標REL {rel}% · 吸収モード {label}": [
    "{span} · SSN {ssn} (all months) · {power} W · {distance} km · Required SNR {snr} dB·Hz · Target REL {rel}% · Absorption mode {label}",
    "{span} · SSN {ssn} (tous les mois) · {power} W · {distance} km · SNR requis {snr} dB·Hz · REL cible {rel}% · Mode d’absorption {label}",
    "{span} · SSN {ssn} (todos los meses) · {power} W · {distance} km · SNR requerida {snr} dB·Hz · REL objetivo {rel}% · Modo de absorción {label}",
    "{span} · SSN {ssn} (tutti i mesi) · {power} W · {distance} km · SNR richiesto {snr} dB·Hz · REL obiettivo {rel}% · Modalità di assorbimento {label}",
    "{span} · SSN {ssn} (todos os meses) · {power} W · {distance} km · SNR exigida {snr} dB·Hz · REL alvo {rel}% · Modo de absorção {label}",
    "{span} · SSN {ssn} (alle Monate) · {power} W · {distance} km · Erforderliche SNR {snr} dB·Hz · Ziel-REL {rel}% · Absorptionsmodus {label}",
    "{span} · SSN {ssn}(전 월 공통) · {power} W · {distance} km · 요구 SNR {snr} dB·Hz · 목표 REL {rel}% · 흡수 모드 {label}"
  ],
  "月 / UTC": [
    "Month / UTC",
    "Mois / UTC",
    "Mes / UTC",
    "Mese / UTC",
    "Mês / UTC",
    "Monat / UTC",
    "월 / UTC"
  ],
  "目標REL以上（時間）": [
    "At target REL (h)",
    "REL cible atteinte (h)",
    "En REL objetivo (h)",
    "REL obiettivo raggiunta (h)",
    "Na REL alvo (h)",
    "Ziel-REL erreicht (h)",
    "목표 REL 이상(시간)"
  ],
  "12か月予測は単一RXの経路で計算します。メッシュを外してください。": [
    "The 12-month forecast is calculated for a single TX→RX path. Turn off mesh.",
    "La prévision sur 12 mois se calcule pour un trajet TX→RX unique. Désactivez le maillage.",
    "La predicción de 12 meses se calcula para un único trayecto TX→RX. Desactive la malla.",
    "La previsione a 12 mesi si calcola per un singolo percorso TX→RX. Disattiva la mesh.",
    "A previsão de 12 meses é calculada para um único trajeto TX→RX. Desative a malha.",
    "Die 12-Monats-Prognose wird für einen einzelnen TX→RX-Pfad berechnet. Mesh ausschalten.",
    "12개월 예측은 단일 TX→RX 경로로 계산합니다. 메시를 해제하세요."
  ],
  "12か月分を計算しています。エンジンを12回実行するため、完了までお待ちください…": [
    "Calculating 12 months. The engine runs 12 times, so please wait…",
    "Calcul de 12 mois. Le moteur s’exécute 12 fois, veuillez patienter…",
    "Calculando 12 meses. El motor se ejecuta 12 veces; espere…",
    "Calcolo di 12 mesi in corso. Il motore viene eseguito 12 volte, attendere…",
    "Calculando 12 meses. O motor é executado 12 vezes; aguarde…",
    "12 Monate werden berechnet. Die Engine läuft 12-mal, bitte warten…",
    "12개월분을 계산하고 있습니다. 엔진을 12회 실행하므로 완료될 때까지 기다려 주세요…"
  ],
  "必要な送信電力": [
    "Required power",
    "Puissance nécessaire",
    "Potencia necesaria",
    "Potenza necessaria",
    "Potência necessária",
    "Benötigte Leistung",
    "필요 송신 전력"
  ],
  "必要な送信電力 · 周波数 × UTC の最小電力（W）": [
    "Required power · minimum power by frequency × UTC (W)",
    "Puissance nécessaire · puissance minimale par fréquence × UTC (W)",
    "Potencia necesaria · potencia mínima por frecuencia × UTC (W)",
    "Potenza necessaria · potenza minima per frequenza × UTC (W)",
    "Potência necessária · potência mínima por frequência × UTC (W)",
    "Benötigte Leistung · Mindestleistung nach Frequenz × UTC (W)",
    "필요 송신 전력 · 주파수 × UTC별 최소 전력(W)"
  ],
  "送信電力を逆算": [
    "Find required power",
    "Calculer la puissance nécessaire",
    "Calcular la potencia necesaria",
    "Calcola la potenza necessaria",
    "Calcular a potência necessária",
    "Benötigte Leistung ermitteln",
    "필요 전력 역산"
  ],
  "右側のTXとRX1の経路について、送信電力を10 Wから10 kWまで1-2-5の10段階で変えて24時間予測を計算し、目標REL以上になる最小の電力を示します（エンジン10回）。": [
    "For the path from TX to RX1 on the right, calculates the 24-hour prediction at ten 1-2-5 power steps from 10 W to 10 kW and shows the smallest power that reaches the target REL (10 engine runs).",
    "Pour le trajet du TX vers RX1 à droite, calcule la prévision sur 24 heures pour dix paliers de puissance 1-2-5 de 10 W à 10 kW et indique la plus petite puissance atteignant la REL cible (10 exécutions du moteur).",
    "Para el trayecto del TX al RX1 de la derecha, calcula la predicción de 24 horas en diez pasos de potencia 1-2-5 de 10 W a 10 kW y muestra la menor potencia que alcanza la REL objetivo (10 ejecuciones del motor).",
    "Per il percorso dal TX all’RX1 a destra, calcola la previsione di 24 ore con dieci livelli di potenza 1-2-5 da 10 W a 10 kW e mostra la potenza minima che raggiunge la REL obiettivo (10 esecuzioni del motore).",
    "Para o trajeto do TX ao RX1 à direita, calcula a previsão de 24 horas em dez degraus de potência 1-2-5 de 10 W a 10 kW e mostra a menor potência que atinge a REL alvo (10 execuções do motor).",
    "Berechnet für den Pfad von TX zu RX1 rechts die 24-Stunden-Prognose mit zehn Leistungsstufen (1-2-5) von 10 W bis 10 kW und zeigt die kleinste Leistung, die die Ziel-REL erreicht (10 Engine-Läufe).",
    "오른쪽 TX에서 RX1까지의 경로에 대해 송신 전력을 10 W에서 10 kW까지 1-2-5의 10단계로 바꾸어 24시간 예측을 계산하고, 목표 REL 이상이 되는 최소 전력을 표시합니다(엔진 10회)."
  ],
  "計算後に、時刻・周波数ごとの最小電力を表示します。": [
    "After calculation, the minimum power for each time and frequency is shown.",
    "Après le calcul, la puissance minimale par heure et fréquence s’affiche.",
    "Tras el cálculo se muestra la potencia mínima por hora y frecuencia.",
    "Dopo il calcolo viene mostrata la potenza minima per ora e frequenza.",
    "Após o cálculo, é mostrada a potência mínima por hora e frequência.",
    "Nach der Berechnung wird die Mindestleistung je Uhrzeit und Frequenz angezeigt.",
    "계산 후 시각·주파수별 최소 전력을 표시합니다."
  ],
  "最上段は、その時刻に最も小さい電力で済む周波数（下段）と電力です。「>10k」は10 kWでも目標RELに届かないことを示します。色が明るいほど小さい電力で届きます。": [
    "The top row shows, for each hour, the power and (below it) the frequency that needs the least power. “>10k” means the target REL is not reached even at 10 kW. Brighter cells need less power.",
    "La première ligne indique, pour chaque heure, la puissance et (en dessous) la fréquence qui demande le moins de puissance. « >10k » signifie que la REL cible n’est pas atteinte même à 10 kW. Plus la case est claire, moins il faut de puissance.",
    "La primera fila muestra, para cada hora, la potencia y (debajo) la frecuencia que requiere menos potencia. «>10k» indica que no se alcanza la REL objetivo ni con 10 kW. Cuanto más clara la celda, menos potencia se necesita.",
    "La prima riga mostra, per ogni ora, la potenza e (sotto) la frequenza che richiede meno potenza. «>10k» indica che la REL obiettivo non è raggiunta nemmeno a 10 kW. Più la cella è chiara, meno potenza serve.",
    "A primeira linha mostra, para cada hora, a potência e (abaixo) a frequência que exige menos potência. “>10k” indica que a REL alvo não é atingida nem com 10 kW. Quanto mais clara a célula, menos potência é necessária.",
    "Die oberste Zeile zeigt je Stunde die Leistung und (darunter) die Frequenz mit dem geringsten Leistungsbedarf. „>10k“ bedeutet, dass die Ziel-REL selbst mit 10 kW nicht erreicht wird. Je heller die Zelle, desto weniger Leistung ist nötig.",
    "맨 윗줄은 각 시각에 가장 작은 전력으로 충분한 주파수(아래)와 전력입니다. '>10k'는 10 kW로도 목표 REL에 도달하지 못함을 뜻합니다. 색이 밝을수록 작은 전력으로 도달합니다."
  ],
  "電力ごとの最良REL · 電力 × UTC": [
    "Best REL per power · power × UTC",
    "Meilleure REL par puissance · puissance × UTC",
    "Mejor REL por potencia · potencia × UTC",
    "REL migliore per potenza · potenza × UTC",
    "Melhor REL por potência · potência × UTC",
    "Beste REL je Leistung · Leistung × UTC",
    "전력별 최고 REL · 전력 × UTC"
  ],
  "各電力で、時刻ごとに最も高いRELを示します。点は目標REL以上です。右端は目標REL以上になる時間数です。": [
    "For each power, shows the highest REL at each hour. A dot marks the target REL or above. The last column is the number of hours at or above the target REL.",
    "Pour chaque puissance, indique la REL la plus élevée à chaque heure. Un point signale la REL cible ou plus. La dernière colonne donne le nombre d’heures à la REL cible ou plus.",
    "Para cada potencia, muestra la REL más alta en cada hora. Un punto indica la REL objetivo o más. La última columna es el número de horas con la REL objetivo o más.",
    "Per ogni potenza, mostra la REL più alta in ogni ora. Un punto indica la REL obiettivo o superiore. L’ultima colonna è il numero di ore alla REL obiettivo o superiore.",
    "Para cada potência, mostra a REL mais alta em cada hora. Um ponto indica a REL alvo ou acima. A última coluna é o número de horas na REL alvo ou acima.",
    "Zeigt für jede Leistung die höchste REL je Stunde. Ein Punkt markiert die Ziel-REL oder mehr. Die letzte Spalte ist die Anzahl der Stunden mit Ziel-REL oder mehr.",
    "각 전력에서 시각별 가장 높은 REL을 표시합니다. 점은 목표 REL 이상입니다. 오른쪽 끝은 목표 REL 이상이 되는 시간 수입니다."
  ],
  "{date} · SSN {ssn} · 現在の設定 {power} W · {distance} km · 要求SNR {snr} dB·Hz · 目標REL {rel}% · 吸収モード {label}": [
    "{date} · SSN {ssn} · Current setting {power} W · {distance} km · Required SNR {snr} dB·Hz · Target REL {rel}% · Absorption mode {label}",
    "{date} · SSN {ssn} · Réglage actuel {power} W · {distance} km · SNR requis {snr} dB·Hz · REL cible {rel}% · Mode d’absorption {label}",
    "{date} · SSN {ssn} · Ajuste actual {power} W · {distance} km · SNR requerida {snr} dB·Hz · REL objetivo {rel}% · Modo de absorción {label}",
    "{date} · SSN {ssn} · Impostazione attuale {power} W · {distance} km · SNR richiesto {snr} dB·Hz · REL obiettivo {rel}% · Modalità di assorbimento {label}",
    "{date} · SSN {ssn} · Configuração atual {power} W · {distance} km · SNR exigida {snr} dB·Hz · REL alvo {rel}% · Modo de absorção {label}",
    "{date} · SSN {ssn} · Aktuelle Einstellung {power} W · {distance} km · Erforderliche SNR {snr} dB·Hz · Ziel-REL {rel}% · Absorptionsmodus {label}",
    "{date} · SSN {ssn} · 현재 설정 {power} W · {distance} km · 요구 SNR {snr} dB·Hz · 목표 REL {rel}% · 흡수 모드 {label}"
  ],
  "最小電力": [
    "Minimum power",
    "Puissance minimale",
    "Potencia mínima",
    "Potenza minima",
    "Potência mínima",
    "Mindestleistung",
    "최소 전력"
  ],
  "必要な送信電力は単一RXの経路で計算します。メッシュを外してください。": [
    "The required power is calculated for a single TX→RX path. Turn off mesh mode.",
    "La puissance nécessaire se calcule sur un seul trajet TX→RX. Désactivez le maillage.",
    "La potencia necesaria se calcula para un único trayecto TX→RX. Desactive la malla.",
    "La potenza necessaria si calcola su un solo percorso TX→RX. Disattivate la rete.",
    "A potência necessária é calculada para um único trajeto TX→RX. Desative a malha.",
    "Die benötigte Leistung wird für einen einzelnen TX→RX-Pfad berechnet. Schalten Sie das Netz aus.",
    "필요 송신 전력은 단일 TX→RX 경로로 계산합니다. 메시를 해제하세요."
  ],
  "送信電力を10段階で計算しています。エンジンを10回実行するため、完了までお待ちください…": [
    "Calculating ten power steps. The engine runs 10 times, so please wait…",
    "Calcul de dix paliers de puissance. Le moteur s’exécute 10 fois, veuillez patienter…",
    "Calculando diez pasos de potencia. El motor se ejecuta 10 veces; espere…",
    "Calcolo di dieci livelli di potenza in corso. Il motore viene eseguito 10 volte, attendere…",
    "Calculando dez degraus de potência. O motor é executado 10 vezes; aguarde…",
    "Zehn Leistungsstufen werden berechnet. Die Engine läuft 10-mal, bitte warten…",
    "송신 전력을 10단계로 계산하고 있습니다. 엔진을 10회 실행하므로 완료될 때까지 기다려 주세요…"
  ],
  "送信電力を10 Wから10 kWまで1-2-5の段階で変えて計算し、目標REL以上になる最小の段階を示します。段階の間の電力は計算しません。電力以外の条件（アンテナ、雑音、要求SNR、偏波損失）は計算時点の値のままです。RELは月間統計で、瞬時の通信可否ではありません。": [
    "The power is varied in 1-2-5 steps from 10 W to 10 kW and the smallest step that reaches the target REL is shown. Powers between steps are not calculated. Conditions other than power (antennas, noise, required SNR, polarization loss) keep their values at calculation time. REL is a monthly statistic, not whether a contact succeeds at a given moment.",
    "La puissance varie par paliers 1-2-5 de 10 W à 10 kW et le plus petit palier atteignant la REL cible est indiqué. Les puissances intermédiaires ne sont pas calculées. Les conditions autres que la puissance (antennes, bruit, SNR requis, perte de polarisation) gardent leurs valeurs au moment du calcul. La REL est une statistique mensuelle, pas la réussite d’une liaison à un instant donné.",
    "La potencia varía en pasos 1-2-5 de 10 W a 10 kW y se muestra el menor paso que alcanza la REL objetivo. No se calculan potencias intermedias. Las condiciones distintas de la potencia (antenas, ruido, SNR requerida, pérdida de polarización) mantienen sus valores del momento del cálculo. La REL es una estadística mensual, no el éxito de un enlace en un instante.",
    "La potenza varia a livelli 1-2-5 da 10 W a 10 kW e viene mostrato il livello minimo che raggiunge la REL obiettivo. Le potenze intermedie non sono calcolate. Le condizioni diverse dalla potenza (antenne, rumore, SNR richiesto, perdita di polarizzazione) mantengono i valori al momento del calcolo. La REL è una statistica mensile, non il successo di un collegamento in un dato istante.",
    "A potência varia em degraus 1-2-5 de 10 W a 10 kW e é mostrado o menor degrau que atinge a REL alvo. Potências intermediárias não são calculadas. As condições além da potência (antenas, ruído, SNR exigida, perda de polarização) mantêm os valores do momento do cálculo. A REL é uma estatística mensal, não o sucesso de um enlace num dado instante.",
    "Die Leistung wird in 1-2-5-Stufen von 10 W bis 10 kW variiert, und die kleinste Stufe mit Ziel-REL wird angezeigt. Zwischenwerte werden nicht berechnet. Andere Bedingungen als die Leistung (Antennen, Rauschen, erforderliche SNR, Polarisationsverlust) behalten ihre Werte zum Berechnungszeitpunkt. REL ist eine Monatsstatistik, nicht der Erfolg einer Verbindung zu einem bestimmten Zeitpunkt.",
    "송신 전력을 10 W에서 10 kW까지 1-2-5 단계로 바꾸어 목표 REL 이상이 되는 최소 단계를 표시합니다. 단계 사이의 전력은 계산하지 않습니다. 전력 이외의 조건(안테나, 잡음, 요구 SNR, 편파 손실)은 계산 시점의 값을 유지합니다. REL은 월간 통계이며 순간적인 통신 가능 여부가 아닙니다."
  ],
  "拠点の候補": [
    "Site candidates",
    "Sites candidats",
    "Sitios candidatos",
    "Siti candidati",
    "Locais candidatos",
    "Standortkandidaten",
    "거점 후보"
  ],
  "拠点の候補 · 目標REL以上の時間数で順位付け": [
    "Site candidates · ranked by hours at the target REL",
    "Sites candidats · classés par heures à la REL cible",
    "Sitios candidatos · ordenados por horas con la REL objetivo",
    "Siti candidati · ordinati per ore alla REL obiettivo",
    "Locais candidatos · ordenados por horas na REL alvo",
    "Standortkandidaten · nach Stunden mit Ziel-REL geordnet",
    "거점 후보 · 목표 REL 이상 시간 수로 순위"
  ],
  "候補の役割": [
    "Candidate role",
    "Rôle du candidat",
    "Función del candidato",
    "Ruolo del candidato",
    "Função do candidato",
    "Rolle des Kandidaten",
    "후보의 역할"
  ],
  "受信地点（TX→候補）": [
    "Receive site (TX→candidate)",
    "Site de réception (TX→candidat)",
    "Sitio receptor (TX→candidato)",
    "Sito di ricezione (TX→candidato)",
    "Local de recepção (TX→candidato)",
    "Empfangsstandort (TX→Kandidat)",
    "수신 지점(TX→후보)"
  ],
  "中継地点（TX→候補→RX1）": [
    "Relay site (TX→candidate→RX1)",
    "Site relais (TX→candidat→RX1)",
    "Sitio de retransmisión (TX→candidato→RX1)",
    "Sito di ripetizione (TX→candidato→RX1)",
    "Local de retransmissão (TX→candidato→RX1)",
    "Relaisstandort (TX→Kandidat→RX1)",
    "중계 지점(TX→후보→RX1)"
  ],
  "候補を比較": [
    "Compare candidates",
    "Comparer les candidats",
    "Comparar candidatos",
    "Confronta i candidati",
    "Comparar candidatos",
    "Kandidaten vergleichen",
    "후보 비교"
  ],
  "登録済みの地点プリセットから候補を最大10か所選びます。受信地点では候補ごとにエンジンを1回、中継地点では2回実行します。候補地点にはRX1のアンテナ・雑音を使い、中継地点はTXのアンテナと送信電力で再送信すると仮定します。": [
    "Choose up to 10 candidates from the saved location presets. The engine runs once per candidate for receive sites and twice for relay sites. Candidates use RX1’s antenna and noise; a relay is assumed to retransmit with the TX antenna and power.",
    "Choisissez jusqu’à 10 candidats parmi les préréglages de lieux. Le moteur s’exécute une fois par candidat pour un site de réception et deux fois pour un relais. Les candidats utilisent l’antenne et le bruit de RX1 ; un relais est supposé réémettre avec l’antenne et la puissance du TX.",
    "Elija hasta 10 candidatos entre los preajustes de ubicación guardados. El motor se ejecuta una vez por candidato para sitios receptores y dos veces para retransmisión. Los candidatos usan la antena y el ruido de RX1; se supone que el repetidor retransmite con la antena y la potencia del TX.",
    "Scegliete fino a 10 candidati tra i preset di località salvati. Il motore viene eseguito una volta per candidato per i siti di ricezione e due volte per i ripetitori. I candidati usano antenna e rumore di RX1; si assume che il ripetitore ritrasmetta con antenna e potenza del TX.",
    "Escolha até 10 candidatos entre as predefinições de local salvas. O motor é executado uma vez por candidato para locais de recepção e duas vezes para retransmissão. Os candidatos usam a antena e o ruído do RX1; supõe-se que o retransmissor reenvie com a antena e a potência do TX.",
    "Wählen Sie bis zu 10 Kandidaten aus den gespeicherten Standortvorlagen. Die Engine läuft je Kandidat einmal für Empfangsstandorte und zweimal für Relais. Kandidaten verwenden Antenne und Rauschen von RX1; ein Relais sendet annahmegemäß mit Antenne und Leistung des TX weiter.",
    "등록된 지점 프리셋에서 후보를 최대 10곳 고릅니다. 수신 지점은 후보마다 엔진을 1회, 중계 지점은 2회 실행합니다. 후보 지점에는 RX1의 안테나·잡음을 쓰며, 중계 지점은 TX의 안테나와 송신 전력으로 재송신한다고 가정합니다."
  ],
  "比較結果 · 候補 × UTC のREL（%）": [
    "Comparison · REL by candidate × UTC (%)",
    "Comparaison · REL par candidat × UTC (%)",
    "Comparación · REL por candidato × UTC (%)",
    "Confronto · REL per candidato × UTC (%)",
    "Comparação · REL por candidato × UTC (%)",
    "Vergleich · REL nach Kandidat × UTC (%)",
    "비교 결과 · 후보 × UTC별 REL(%)"
  ],
  "計算後に、候補地点を目標REL以上の時間数の多い順に表示します。": [
    "After calculation, candidates are listed by hours at the target REL, most first.",
    "Après le calcul, les candidats sont classés par nombre d’heures à la REL cible, du plus grand au plus petit.",
    "Tras el cálculo, los candidatos se ordenan por horas con la REL objetivo, de más a menos.",
    "Dopo il calcolo, i candidati sono ordinati per ore alla REL obiettivo, dal maggiore.",
    "Após o cálculo, os candidatos são ordenados por horas na REL alvo, do maior para o menor.",
    "Nach der Berechnung werden die Kandidaten nach Stunden mit Ziel-REL absteigend aufgeführt.",
    "계산 후 목표 REL 이상 시간 수가 많은 순으로 후보 지점을 표시합니다."
  ],
  "中継地点のRELは、その時刻の2区間の最良RELのうち低い方です。点は目標REL以上です。": [
    "For a relay site, REL is the lower of the two legs’ best REL at that hour. A dot marks the target REL or above.",
    "Pour un relais, la REL est la plus faible des meilleures REL des deux tronçons à cette heure. Un point signale la REL cible ou plus.",
    "Para un sitio de retransmisión, la REL es la menor de las mejores REL de los dos tramos a esa hora. Un punto indica la REL objetivo o más.",
    "Per un ripetitore, la REL è la minore tra le REL migliori delle due tratte in quell’ora. Un punto indica la REL obiettivo o superiore.",
    "Para um local de retransmissão, a REL é a menor entre as melhores REL dos dois trechos nessa hora. Um ponto indica a REL alvo ou acima.",
    "Bei einem Relaisstandort ist die REL der kleinere der besten REL-Werte beider Teilstrecken zu dieser Stunde. Ein Punkt markiert die Ziel-REL oder mehr.",
    "중계 지점의 REL은 그 시각 두 구간의 최고 REL 중 낮은 쪽입니다. 점은 목표 REL 이상입니다."
  ],
  "{count} / {max} か所を選択": [
    "{count} / {max} selected",
    "{count} / {max} sélectionnés",
    "{count} / {max} seleccionados",
    "{count} / {max} selezionati",
    "{count} / {max} selecionados",
    "{count} / {max} ausgewählt",
    "{count} / {max}곳 선택"
  ],
  "中継地点": [
    "Relay site",
    "Site relais",
    "Sitio de retransmisión",
    "Sito di ripetizione",
    "Local de retransmissão",
    "Relaisstandort",
    "중계 지점"
  ],
  "受信地点": [
    "Receive site",
    "Site de réception",
    "Sitio receptor",
    "Sito di ricezione",
    "Local de recepção",
    "Empfangsstandort",
    "수신 지점"
  ],
  "{label} · {date} · SSN {ssn} · {power} W · 目標REL {rel}%": [
    "{label} · {date} · SSN {ssn} · {power} W · Target REL {rel}%",
    "{label} · {date} · SSN {ssn} · {power} W · REL cible {rel}%",
    "{label} · {date} · SSN {ssn} · {power} W · REL objetivo {rel}%",
    "{label} · {date} · SSN {ssn} · {power} W · REL obiettivo {rel}%",
    "{label} · {date} · SSN {ssn} · {power} W · REL alvo {rel}%",
    "{label} · {date} · SSN {ssn} · {power} W · Ziel-REL {rel}%",
    "{label} · {date} · SSN {ssn} · {power} W · 목표 REL {rel}%"
  ],
  "順位": [
    "Rank",
    "Rang",
    "Puesto",
    "Posizione",
    "Posição",
    "Rang",
    "순위"
  ],
  "平均REL %": [
    "Mean REL %",
    "REL moyenne %",
    "REL media %",
    "REL media %",
    "REL média %",
    "Mittlere REL %",
    "평균 REL %"
  ],
  "拠点の候補は単一RXの経路で計算します。メッシュを外してください。": [
    "Site candidates are calculated for a single TX→RX path. Turn off mesh mode.",
    "Les sites candidats se calculent sur un seul trajet TX→RX. Désactivez le maillage.",
    "Los sitios candidatos se calculan para un único trayecto TX→RX. Desactive la malla.",
    "I siti candidati si calcolano su un solo percorso TX→RX. Disattivate la rete.",
    "Os locais candidatos são calculados para um único trajeto TX→RX. Desative a malha.",
    "Standortkandidaten werden für einen einzelnen TX→RX-Pfad berechnet. Schalten Sie das Netz aus.",
    "거점 후보는 단일 TX→RX 경로로 계산합니다. 메시를 해제하세요."
  ],
  "候補の地点を1か所以上選んでください。": [
    "Choose at least one candidate location.",
    "Choisissez au moins un lieu candidat.",
    "Elija al menos una ubicación candidata.",
    "Scegliete almeno una località candidata.",
    "Escolha pelo menos um local candidato.",
    "Wählen Sie mindestens einen Kandidatenstandort.",
    "후보 지점을 1곳 이상 고르세요."
  ],
  "候補地点を比較しています。エンジンを{count}回実行するため、完了までお待ちください…": [
    "Comparing candidates. The engine runs {count} times, so please wait…",
    "Comparaison des candidats. Le moteur s’exécute {count} fois, veuillez patienter…",
    "Comparando candidatos. El motor se ejecuta {count} veces; espere…",
    "Confronto dei candidati in corso. Il motore viene eseguito {count} volte, attendere…",
    "Comparando candidatos. O motor é executado {count} vezes; aguarde…",
    "Kandidaten werden verglichen. Die Engine läuft {count}-mal, bitte warten…",
    "후보 지점을 비교하고 있습니다. 엔진을 {count}회 실행하므로 완료될 때까지 기다려 주세요…"
  ],
  "候補地点は1〜{count}か所で指定してください": [
    "Specify 1–{count} candidate locations",
    "Indiquez de 1 à {count} lieux candidats",
    "Indique de 1 a {count} ubicaciones candidatas",
    "Indicate da 1 a {count} località candidate",
    "Indique de 1 a {count} locais candidatos",
    "Geben Sie 1–{count} Kandidatenstandorte an",
    "후보 지점은 1~{count}곳으로 지정하세요"
  ],
  "候補地点の形式が不正です": [
    "Invalid candidate location format",
    "Format de lieu candidat non valide",
    "Formato de ubicación candidata no válido",
    "Formato della località candidata non valido",
    "Formato de local candidato inválido",
    "Ungültiges Format des Kandidatenstandorts",
    "후보 지점 형식이 올바르지 않습니다"
  ],
  "候補地点の名称は1〜40文字で指定してください": [
    "Candidate names must be 1–40 characters",
    "Le nom d’un candidat doit comporter 1 à 40 caractères",
    "El nombre del candidato debe tener de 1 a 40 caracteres",
    "Il nome del candidato deve avere da 1 a 40 caratteri",
    "O nome do candidato deve ter de 1 a 40 caracteres",
    "Kandidatennamen müssen 1–40 Zeichen lang sein",
    "후보 지점 이름은 1~40자로 지정하세요"
  ],
  "候補地点の緯度・経度が範囲外です": [
    "Candidate latitude or longitude is out of range",
    "Latitude ou longitude du candidat hors limites",
    "Latitud o longitud del candidato fuera de rango",
    "Latitudine o longitudine del candidato fuori intervallo",
    "Latitude ou longitude do candidato fora do intervalo",
    "Breite oder Länge des Kandidaten außerhalb des Bereichs",
    "후보 지점의 위도·경도가 범위를 벗어났습니다"
  ],
  "TXまたはRX1と同じ地点のため計算しません": [
    "Not calculated: same place as TX or RX1",
    "Non calculé : même lieu que TX ou RX1",
    "No se calcula: mismo lugar que TX o RX1",
    "Non calcolato: stesso luogo di TX o RX1",
    "Não calculado: mesmo local que TX ou RX1",
    "Nicht berechnet: gleicher Ort wie TX oder RX1",
    "TX 또는 RX1과 같은 지점이므로 계산하지 않습니다"
  ],
  "候補地点ごとに独立した地点間予測を計算し、目標REL以上になる時間数の多い順に並べます（同数なら平均RELの高い順）。受信地点ではRX1のアンテナ・雑音を候補地点に置いた場合を計算します。中継地点ではTX→候補地点と候補地点→RX1の両区間を計算し、同じ時刻に両区間とも目標REL以上なら中継できるとします。中継局はRX1のアンテナで受信し、TXのアンテナと送信電力で再送信すると仮定します。中継の遅延・送受信切替・混信、地形や設置条件は考慮しません。": [
    "Each candidate is calculated as an independent point-to-point prediction and listed by hours at the target REL, most first (ties by higher mean REL). Receive sites use RX1’s antenna and noise at the candidate. Relay sites calculate TX→candidate and candidate→RX1 and count an hour as relayable when both legs reach the target REL in that hour. The relay is assumed to receive with RX1’s antenna and retransmit with the TX antenna and power. Relay delay, transmit/receive switching, interference, terrain and installation are not considered.",
    "Chaque candidat est calculé comme une prévision point à point indépendante et classé par heures à la REL cible, du plus grand au plus petit (à égalité, REL moyenne la plus haute). Les sites de réception utilisent l’antenne et le bruit de RX1 au lieu candidat. Pour un relais, TX→candidat et candidat→RX1 sont calculés et une heure compte comme relayable si les deux tronçons atteignent la REL cible à cette heure. Le relais est supposé recevoir avec l’antenne de RX1 et réémettre avec l’antenne et la puissance du TX. Le délai du relais, la commutation émission/réception, le brouillage, le relief et l’installation ne sont pas pris en compte.",
    "Cada candidato se calcula como una predicción punto a punto independiente y se ordena por horas con la REL objetivo, de más a menos (en empate, mayor REL media). Los sitios receptores usan la antena y el ruido de RX1 en el candidato. Para retransmisión se calculan TX→candidato y candidato→RX1, y una hora cuenta como retransmisible si ambos tramos alcanzan la REL objetivo a esa hora. Se supone que el repetidor recibe con la antena de RX1 y retransmite con la antena y potencia del TX. No se consideran el retardo, la conmutación emisión/recepción, la interferencia, el terreno ni la instalación.",
    "Ogni candidato è calcolato come previsione punto-punto indipendente e ordinato per ore alla REL obiettivo, dal maggiore (a parità, REL media più alta). I siti di ricezione usano antenna e rumore di RX1 nel candidato. Per i ripetitori si calcolano TX→candidato e candidato→RX1 e un’ora conta come ripetibile se entrambe le tratte raggiungono la REL obiettivo in quell’ora. Si assume che il ripetitore riceva con l’antenna di RX1 e ritrasmetta con antenna e potenza del TX. Ritardo, commutazione trasmissione/ricezione, interferenze, terreno e installazione non sono considerati.",
    "Cada candidato é calculado como uma previsão ponto a ponto independente e ordenado por horas na REL alvo, do maior para o menor (em empate, maior REL média). Locais de recepção usam a antena e o ruído do RX1 no candidato. Para retransmissão, calculam-se TX→candidato e candidato→RX1, e uma hora conta como retransmissível se ambos os trechos atingirem a REL alvo nessa hora. Supõe-se que o retransmissor receba com a antena do RX1 e reenvie com a antena e a potência do TX. Atraso, comutação transmissão/recepção, interferência, terreno e instalação não são considerados.",
    "Jeder Kandidat wird als unabhängige Punkt-zu-Punkt-Prognose berechnet und nach Stunden mit Ziel-REL absteigend geordnet (bei Gleichstand höhere mittlere REL). Empfangsstandorte verwenden Antenne und Rauschen von RX1 am Kandidaten. Bei Relais werden TX→Kandidat und Kandidat→RX1 berechnet; eine Stunde gilt als weiterleitbar, wenn beide Teilstrecken in dieser Stunde die Ziel-REL erreichen. Das Relais empfängt annahmegemäß mit der Antenne von RX1 und sendet mit Antenne und Leistung des TX weiter. Relaisverzögerung, Sende-/Empfangsumschaltung, Störungen, Gelände und Aufbau werden nicht berücksichtigt.",
    "후보 지점마다 독립된 지점 간 예측을 계산하고, 목표 REL 이상 시간 수가 많은 순으로 나열합니다(같으면 평균 REL이 높은 순). 수신 지점은 RX1의 안테나·잡음을 후보 지점에 둔 경우를 계산합니다. 중계 지점은 TX→후보 지점과 후보 지점→RX1 두 구간을 계산하고, 같은 시각에 두 구간 모두 목표 REL 이상이면 중계 가능으로 봅니다. 중계국은 RX1의 안테나로 수신하고 TX의 안테나와 송신 전력으로 재송신한다고 가정합니다. 중계 지연·송수신 전환·혼신, 지형과 설치 조건은 고려하지 않습니다."
  ],
  "確認する": [
    "Review",
    "Consulter",
    "Revisar",
    "Controlla",
    "Verificar",
    "Ansehen",
    "확인하기"
  ],
  "定時の再計算": [
    "Scheduled recalculation",
    "Recalcul programmé",
    "Recálculo programado",
    "Ricalcolo programmato",
    "Recálculo programado",
    "Geplante Neuberechnung",
    "정기 재계산"
  ],
  "保存された計算のうち地点間予測は「定時の再計算に追加」で登録できます。最初の再計算の結果を基準にし、目標REL以上の時間数が減ると画面上部に通知します。": [
    "Saved point-to-point predictions can be added with “Add to scheduled recalculation”. The first recalculation is the baseline; a notice appears at the top of the page when the hours at the target REL decrease.",
    "Les prévisions point à point enregistrées s’ajoutent avec « Ajouter au recalcul programmé ». Le premier recalcul sert de référence ; un avis s’affiche en haut de la page lorsque les heures à la REL cible diminuent.",
    "Las predicciones punto a punto guardadas se añaden con «Añadir al recálculo programado». El primer recálculo es la referencia; aparece un aviso arriba de la página cuando disminuyen las horas con la REL objetivo.",
    "Le previsioni punto-punto salvate si aggiungono con «Aggiungi al ricalcolo programmato». Il primo ricalcolo è il riferimento; in cima alla pagina compare un avviso quando le ore alla REL obiettivo diminuiscono.",
    "As previsões ponto a ponto salvas são adicionadas com “Adicionar ao recálculo programado”. O primeiro recálculo é a referência; um aviso aparece no topo da página quando as horas na REL alvo diminuem.",
    "Gespeicherte Punkt-zu-Punkt-Prognosen werden mit „Zur geplanten Neuberechnung hinzufügen“ registriert. Die erste Neuberechnung ist die Basis; oben auf der Seite erscheint ein Hinweis, wenn die Stunden mit Ziel-REL abnehmen.",
    "저장된 계산 중 지점 간 예측은 '정기 재계산에 추가'로 등록할 수 있습니다. 첫 재계산 결과를 기준으로 하며, 목표 REL 이상 시간 수가 줄면 화면 위쪽에 알립니다."
  ],
  "未確認": [
    "Not checked yet",
    "Pas encore vérifié",
    "Aún sin comprobar",
    "Non ancora verificato",
    "Ainda não verificado",
    "Noch nicht geprüft",
    "미확인"
  ],
  "変化なし": [
    "No change",
    "Inchangé",
    "Sin cambios",
    "Nessuna variazione",
    "Sem alteração",
    "Unverändert",
    "변화 없음"
  ],
  "増加": [
    "Increased",
    "En hausse",
    "Aumentó",
    "Aumentato",
    "Aumentou",
    "Gestiegen",
    "증가"
  ],
  "減少": [
    "Decreased",
    "En baisse",
    "Disminuyó",
    "Diminuito",
    "Diminuiu",
    "Gesunken",
    "감소"
  ],
  "定時の再計算に追加": [
    "Add to scheduled recalculation",
    "Ajouter au recalcul programmé",
    "Añadir al recálculo programado",
    "Aggiungi al ricalcolo programmato",
    "Adicionar ao recálculo programado",
    "Zur geplanten Neuberechnung hinzufügen",
    "정기 재계산에 추가"
  ],
  "登録済み": [
    "Added",
    "Ajouté",
    "Añadido",
    "Aggiunto",
    "Adicionado",
    "Hinzugefügt",
    "등록됨"
  ],
  "定時の再計算に登録しました。": [
    "Added to scheduled recalculation.",
    "Ajouté au recalcul programmé.",
    "Añadido al recálculo programado.",
    "Aggiunto al ricalcolo programmato.",
    "Adicionado ao recálculo programado.",
    "Zur geplanten Neuberechnung hinzugefügt.",
    "정기 재계산에 등록했습니다."
  ],
  "{hours}時間ごとに、登録した条件をNOAAの最新の平滑SSNで再計算します（最大{max}件）。": [
    "Every {hours} hours, the registered conditions are recalculated with the latest NOAA smoothed SSN (up to {max}).",
    "Toutes les {hours} heures, les conditions enregistrées sont recalculées avec la dernière SSN lissée NOAA (jusqu’à {max}).",
    "Cada {hours} horas se recalculan las condiciones registradas con la última SSN suavizada de NOAA (hasta {max}).",
    "Ogni {hours} ore le condizioni registrate vengono ricalcolate con l’ultima SSN livellata NOAA (fino a {max}).",
    "A cada {hours} horas, as condições registradas são recalculadas com a última SSN suavizada da NOAA (até {max}).",
    "Alle {hours} Stunden werden die registrierten Bedingungen mit der neuesten geglätteten NOAA-SSN neu berechnet (bis zu {max}).",
    "{hours}시간마다 등록한 조건을 NOAA의 최신 평활 SSN으로 재계산합니다(최대 {max}건)."
  ],
  "定時の再計算は停止しています（HF_WATCH_INTERVAL_HOURS=0）。「今すぐ再計算」で手動実行できます。": [
    "Scheduled recalculation is off (HF_WATCH_INTERVAL_HOURS=0). Use “Recalculate now” to run it manually.",
    "Le recalcul programmé est désactivé (HF_WATCH_INTERVAL_HOURS=0). Utilisez « Recalculer maintenant » pour le lancer manuellement.",
    "El recálculo programado está desactivado (HF_WATCH_INTERVAL_HOURS=0). Use «Recalcular ahora» para ejecutarlo manualmente.",
    "Il ricalcolo programmato è disattivato (HF_WATCH_INTERVAL_HOURS=0). Usate «Ricalcola ora» per eseguirlo manualmente.",
    "O recálculo programado está desativado (HF_WATCH_INTERVAL_HOURS=0). Use “Recalcular agora” para executá-lo manualmente.",
    "Die geplante Neuberechnung ist aus (HF_WATCH_INTERVAL_HOURS=0). Mit „Jetzt neu berechnen“ manuell ausführen.",
    "정기 재계산이 꺼져 있습니다(HF_WATCH_INTERVAL_HOURS=0). '지금 재계산'으로 수동 실행할 수 있습니다."
  ],
  "定時の再計算で、目標REL以上の時間数が減った条件が{count}件あります。": [
    "Scheduled recalculation: {count} condition(s) now have fewer hours at the target REL.",
    "Recalcul programmé : {count} condition(s) ont désormais moins d’heures à la REL cible.",
    "Recálculo programado: {count} condición(es) tienen ahora menos horas con la REL objetivo.",
    "Ricalcolo programmato: {count} condizione/i hanno ora meno ore alla REL obiettivo.",
    "Recálculo programado: {count} condição(ões) agora têm menos horas na REL alvo.",
    "Geplante Neuberechnung: {count} Bedingung(en) haben jetzt weniger Stunden mit Ziel-REL.",
    "정기 재계산에서 목표 REL 이상 시간 수가 줄어든 조건이 {count}건 있습니다."
  ],
  "登録された条件はありません。": [
    "No conditions are registered.",
    "Aucune condition enregistrée.",
    "No hay condiciones registradas.",
    "Nessuna condizione registrata.",
    "Não há condições registradas.",
    "Keine Bedingungen registriert.",
    "등록된 조건이 없습니다."
  ],
  "経路": [
    "Path",
    "Trajet",
    "Trayecto",
    "Percorso",
    "Trajeto",
    "Pfad",
    "경로"
  ],
  "年月": [
    "Month",
    "Mois",
    "Mes",
    "Mese",
    "Mês",
    "Monat",
    "연월"
  ],
  "最終確認": [
    "Last check",
    "Dernière vérification",
    "Última comprobación",
    "Ultima verifica",
    "Última verificação",
    "Letzte Prüfung",
    "마지막 확인"
  ],
  "目標REL以上（基準 → 最新）": [
    "At target REL (baseline → latest)",
    "À la REL cible (référence → dernier)",
    "Con REL objetivo (referencia → último)",
    "Alla REL obiettivo (riferimento → ultimo)",
    "Na REL alvo (referência → último)",
    "Mit Ziel-REL (Basis → neueste)",
    "목표 REL 이상(기준 → 최신)"
  ],
  "{base} → {latest} 時間": [
    "{base} → {latest} h",
    "{base} → {latest} h",
    "{base} → {latest} h",
    "{base} → {latest} h",
    "{base} → {latest} h",
    "{base} → {latest} h",
    "{base} → {latest}시간"
  ],
  "今すぐ再計算": [
    "Recalculate now",
    "Recalculer maintenant",
    "Recalcular ahora",
    "Ricalcola ora",
    "Recalcular agora",
    "Jetzt neu berechnen",
    "지금 재계산"
  ],
  "確認済みにする": [
    "Mark as reviewed",
    "Marquer comme vu",
    "Marcar como revisado",
    "Segna come visto",
    "Marcar como revisado",
    "Als gesehen markieren",
    "확인함으로 표시"
  ],
  "再計算しています…": [
    "Recalculating…",
    "Recalcul en cours…",
    "Recalculando…",
    "Ricalcolo in corso…",
    "Recalculando…",
    "Neuberechnung läuft…",
    "재계산하고 있습니다…"
  ],
  "再計算しました。": [
    "Recalculated.",
    "Recalculé.",
    "Recalculado.",
    "Ricalcolato.",
    "Recalculado.",
    "Neu berechnet.",
    "재계산했습니다."
  ],
  "指定された監視条件がありません": [
    "The specified condition is not registered",
    "La condition indiquée n’est pas enregistrée",
    "La condición indicada no está registrada",
    "La condizione indicata non è registrata",
    "A condição indicada não está registrada",
    "Die angegebene Bedingung ist nicht registriert",
    "지정한 조건이 등록되어 있지 않습니다"
  ],
  "定時の再計算に登録できるのは地点間予測（単一RX）の結果だけです": [
    "Only point-to-point (single RX) results can be added to scheduled recalculation",
    "Seuls les résultats point à point (un seul RX) peuvent être ajoutés au recalcul programmé",
    "Solo los resultados punto a punto (un RX) pueden añadirse al recálculo programado",
    "Solo i risultati punto-punto (un solo RX) possono essere aggiunti al ricalcolo programmato",
    "Somente resultados ponto a ponto (um RX) podem ser adicionados ao recálculo programado",
    "Nur Punkt-zu-Punkt-Ergebnisse (ein RX) können zur geplanten Neuberechnung hinzugefügt werden",
    "정기 재계산에는 지점 간 예측(단일 RX) 결과만 등록할 수 있습니다"
  ],
  "定時の再計算に登録できるのは{count}件までです": [
    "Up to {count} conditions can be added to scheduled recalculation",
    "Jusqu’à {count} conditions peuvent être ajoutées au recalcul programmé",
    "Se pueden añadir hasta {count} condiciones al recálculo programado",
    "Si possono aggiungere fino a {count} condizioni al ricalcolo programmato",
    "É possível adicionar até {count} condições ao recálculo programado",
    "Bis zu {count} Bedingungen können zur geplanten Neuberechnung hinzugefügt werden",
    "정기 재계산에는 {count}건까지 등록할 수 있습니다"
  ],
  "操作が不正です": [
    "Invalid action",
    "Action non valide",
    "Acción no válida",
    "Azione non valida",
    "Ação inválida",
    "Ungültige Aktion",
    "잘못된 조작입니다"
  ],
  "定時の再計算を更新できません": [
    "Could not update scheduled recalculation",
    "Impossible de mettre à jour le recalcul programmé",
    "No se pudo actualizar el recálculo programado",
    "Impossibile aggiornare il ricalcolo programmato",
    "Não foi possível atualizar o recálculo programado",
    "Geplante Neuberechnung konnte nicht aktualisiert werden",
    "정기 재계산을 갱신할 수 없습니다"
  ],
  "保存した地点間予測の条件を、定期的にNOAAの最新の平滑SSN（0.7倍して使用）で再計算します。登録時の最初の結果を基準とし、目標REL以上になる時間数が基準より減ったら画面に通知します。手動SSN・実効SSNで計算した条件もNOAAの平滑SSNで再計算します。移動局の位置は登録時の値で固定します。RELは月間統計で、当日の電離圏の状態は反映しません。": [
    "Saved point-to-point conditions are recalculated periodically with the latest NOAA smoothed SSN (multiplied by 0.7). The first result after registration is the baseline; a notice appears when the hours at the target REL fall below it. Conditions calculated with a manual or effective SSN are also recalculated with the NOAA smoothed SSN. Mobile station positions stay at their values at registration. REL is a monthly statistic and does not reflect the ionosphere on a given day.",
    "Les conditions point à point enregistrées sont recalculées périodiquement avec la dernière SSN lissée NOAA (multipliée par 0,7). Le premier résultat après l’enregistrement sert de référence ; un avis s’affiche lorsque les heures à la REL cible passent en dessous. Les conditions calculées avec une SSN manuelle ou effective sont aussi recalculées avec la SSN lissée NOAA. Les positions des stations mobiles restent celles de l’enregistrement. La REL est une statistique mensuelle et ne reflète pas l’ionosphère d’un jour donné.",
    "Las condiciones punto a punto guardadas se recalculan periódicamente con la última SSN suavizada de NOAA (multiplicada por 0,7). El primer resultado tras el registro es la referencia; aparece un aviso cuando las horas con la REL objetivo bajan de ella. Las condiciones calculadas con SSN manual o efectiva también se recalculan con la SSN suavizada de NOAA. Las posiciones de estaciones móviles se mantienen como en el registro. La REL es una estadística mensual y no refleja la ionosfera de un día concreto.",
    "Le condizioni punto-punto salvate vengono ricalcolate periodicamente con l’ultima SSN livellata NOAA (moltiplicata per 0,7). Il primo risultato dopo la registrazione è il riferimento; compare un avviso quando le ore alla REL obiettivo scendono sotto di esso. Anche le condizioni calcolate con SSN manuale o effettiva vengono ricalcolate con la SSN livellata NOAA. Le posizioni delle stazioni mobili restano quelle della registrazione. La REL è una statistica mensile e non riflette la ionosfera di un dato giorno.",
    "As condições ponto a ponto salvas são recalculadas periodicamente com a última SSN suavizada da NOAA (multiplicada por 0,7). O primeiro resultado após o registro é a referência; um aviso aparece quando as horas na REL alvo ficam abaixo dela. Condições calculadas com SSN manual ou efetiva também são recalculadas com a SSN suavizada da NOAA. As posições de estações móveis ficam com os valores do registro. A REL é uma estatística mensal e não reflete a ionosfera de um dia específico.",
    "Gespeicherte Punkt-zu-Punkt-Bedingungen werden regelmäßig mit der neuesten geglätteten NOAA-SSN (mit 0,7 multipliziert) neu berechnet. Das erste Ergebnis nach der Registrierung ist die Basis; ein Hinweis erscheint, wenn die Stunden mit Ziel-REL darunter fallen. Mit manueller oder effektiver SSN berechnete Bedingungen werden ebenfalls mit der geglätteten NOAA-SSN neu berechnet. Positionen mobiler Stationen bleiben auf dem Stand der Registrierung. REL ist eine Monatsstatistik und spiegelt nicht die Ionosphäre eines bestimmten Tages wider.",
    "저장한 지점 간 예측 조건을 정기적으로 NOAA의 최신 평활 SSN(0.7배하여 사용)으로 재계산합니다. 등록 후 첫 결과를 기준으로 하며, 목표 REL 이상 시간 수가 기준보다 줄면 화면에 알립니다. 수동 SSN·실효 SSN으로 계산한 조건도 NOAA 평활 SSN으로 재계산합니다. 이동국 위치는 등록 시의 값으로 고정합니다. REL은 월간 통계이며 당일의 전리층 상태는 반영하지 않습니다."
  ],
  "報告書を印刷": [
    "Print report",
    "Imprimer le rapport",
    "Imprimir informe",
    "Stampa rapporto",
    "Imprimir relatório",
    "Bericht drucken",
    "보고서 인쇄"
  ],
  "伝搬予測報告書": [
    "Propagation prediction report",
    "Rapport de prévision de propagation",
    "Informe de predicción de propagación",
    "Rapporto di previsione di propagazione",
    "Relatório de previsão de propagação",
    "Bericht zur Ausbreitungsprognose",
    "전파 예측 보고서"
  ],
  "作成": [
    "Created",
    "Créé",
    "Creado",
    "Creato",
    "Criado",
    "Erstellt",
    "작성"
  ],
  "計算": [
    "Calculated",
    "Calculé",
    "Calculado",
    "Calcolato",
    "Calculado",
    "Berechnet",
    "계산"
  ],
  "条件": [
    "Conditions",
    "Conditions",
    "Condiciones",
    "Condizioni",
    "Condições",
    "Bedingungen",
    "조건"
  ],
  "座標": [
    "Coordinates",
    "Coordonnées",
    "Coordenadas",
    "Coordinate",
    "Coordenadas",
    "Koordinaten",
    "좌표"
  ],
  "回線距離・方位": [
    "Distance and bearing",
    "Distance et azimut",
    "Distancia y rumbo",
    "Distanza e azimut",
    "Distância e azimute",
    "Entfernung und Richtung",
    "회선 거리·방위"
  ],
  "対象年月": [
    "Month",
    "Mois",
    "Mes",
    "Mese",
    "Mês",
    "Monat",
    "대상 연월"
  ],
  "送信電力": [
    "Transmit power",
    "Puissance d’émission",
    "Potencia de transmisión",
    "Potenza di trasmissione",
    "Potência de transmissão",
    "Sendeleistung",
    "송신 전력"
  ],
  "TXアンテナ": [
    "TX antenna",
    "Antenne TX",
    "Antena TX",
    "Antenna TX",
    "Antena TX",
    "TX-Antenne",
    "TX 안테나"
  ],
  "RXアンテナ": [
    "RX antenna",
    "Antenne RX",
    "Antena RX",
    "Antenna RX",
    "Antena RX",
    "RX-Antenne",
    "RX 안테나"
  ],
  "雑音": [
    "Noise",
    "Bruit",
    "Ruido",
    "Rumore",
    "Ruído",
    "Rauschen",
    "잡음"
  ],
  "要求SNR・目標REL": [
    "Required SNR / target REL",
    "SNR requis / REL cible",
    "SNR requerida / REL objetivo",
    "SNR richiesto / REL obiettivo",
    "SNR exigida / REL alvo",
    "Erforderliche SNR / Ziel-REL",
    "요구 SNR·목표 REL"
  ],
  "電波型式・偏波": [
    "Emission and polarization",
    "Classe d’émission et polarisation",
    "Clase de emisión y polarización",
    "Classe di emissione e polarizzazione",
    "Classe de emissão e polarização",
    "Sendeart und Polarisation",
    "전파 형식·편파"
  ],
  "時刻別の推奨周波数": [
    "Recommended frequency by hour",
    "Fréquence recommandée par heure",
    "Frecuencia recomendada por hora",
    "Frequenza consigliata per ora",
    "Frequência recomendada por hora",
    "Empfohlene Frequenz je Stunde",
    "시각별 추천 주파수"
  ],
  "目標RELに届く周波数がない時間は「—」とし、最もRELの高い周波数の値を赤で示します（{count}時間）。": [
    "Hours with no frequency at the target REL show “—”, with the values of the highest-REL frequency in red ({count} h).",
    "Les heures sans fréquence à la REL cible affichent « — », avec les valeurs de la fréquence de REL la plus haute en rouge ({count} h).",
    "Las horas sin frecuencia con la REL objetivo muestran «—», con los valores de la frecuencia de mayor REL en rojo ({count} h).",
    "Le ore senza frequenza alla REL obiettivo mostrano «—», con i valori della frequenza a REL più alta in rosso ({count} h).",
    "As horas sem frequência na REL alvo mostram “—”, com os valores da frequência de maior REL em vermelho ({count} h).",
    "Stunden ohne Frequenz mit Ziel-REL zeigen „—“, die Werte der Frequenz mit der höchsten REL in Rot ({count} h).",
    "목표 REL에 도달하는 주파수가 없는 시간은 '—'로 하고, REL이 가장 높은 주파수의 값을 빨간색으로 표시합니다({count}시간)."
  ],
  "すべての時間で目標RELに届く周波数があります。": [
    "Every hour has a frequency at the target REL.",
    "Chaque heure a une fréquence à la REL cible.",
    "Todas las horas tienen una frecuencia con la REL objetivo.",
    "Ogni ora ha una frequenza alla REL obiettivo.",
    "Todas as horas têm uma frequência na REL alvo.",
    "Jede Stunde hat eine Frequenz mit Ziel-REL.",
    "모든 시간에 목표 REL에 도달하는 주파수가 있습니다."
  ],
  "信頼度ヒートマップ（REL %）": [
    "Reliability heatmap (REL %)",
    "Carte de fiabilité (REL %)",
    "Mapa de calor de fiabilidad (REL %)",
    "Mappa di affidabilità (REL %)",
    "Mapa de calor de confiabilidade (REL %)",
    "Zuverlässigkeits-Heatmap (REL %)",
    "신뢰도 히트맵(REL %)"
  ],
  "操作要領の更新とダウンロード": [
    "Updated manual and download",
    "Manuel mis à jour et téléchargement",
    "Manual actualizado y descarga",
    "Manuale aggiornato e download",
    "Manual atualizado e download",
    "Aktualisiertes Handbuch zum Herunterladen",
    "조작 요령 갱신과 다운로드"
  ],
  "画面図入りの日本語の操作要領（第2版）を現在の画面に合わせて更新し、新しい機能の章を加えました。画面上部の「操作要領（PDF）」「Word」からダウンロードできます。": [
    "The illustrated Japanese operation manual (2nd edition) now matches the current screens and covers the new features. Download it with “Manual (Japanese, PDF)” or “Word” at the top of the page.",
    "Le manuel d’utilisation illustré en japonais (2e édition) correspond désormais aux écrans actuels et couvre les nouvelles fonctions. Téléchargez-le avec « Manuel (japonais, PDF) » ou « Word » en haut de la page.",
    "El manual de uso ilustrado en japonés (2.ª edición) refleja ahora las pantallas actuales e incluye las nuevas funciones. Descárguelo con «Manual (japonés, PDF)» o «Word» en la parte superior de la página.",
    "Il manuale operativo illustrato in giapponese (2ª edizione) ora corrisponde alle schermate attuali e include le nuove funzioni. Scaricalo con «Manuale (giapponese, PDF)» o «Word» in cima alla pagina.",
    "O manual de operação ilustrado em japonês (2.ª edição) agora corresponde às telas atuais e inclui as novas funções. Baixe-o em “Manual (japonês, PDF)” ou “Word” no topo da página.",
    "Das bebilderte japanische Bedienhandbuch (2. Auflage) entspricht jetzt den aktuellen Bildschirmen und beschreibt die neuen Funktionen. Herunterladen über „Handbuch (Japanisch, PDF)“ oder „Word“ oben auf der Seite.",
    "화면 그림이 들어간 일본어 조작 요령(제2판)을 현재 화면에 맞게 갱신하고 새 기능의 장을 추가했습니다. 페이지 위쪽의 「조작 요령(일본어, PDF)」「Word」에서 다운로드할 수 있습니다."
  ],
  "操作要領（PDF）": [
    "Manual (PDF)",
    "Manuel (PDF)",
    "Manual (PDF)",
    "Manuale (PDF)",
    "Manual (PDF)",
    "Handbuch (PDF)",
    "조작 요령(PDF)"
  ],
  "表示中の言語の操作要領（画面図入りPDF）をダウンロード": [
    "Download the illustrated manual (PDF) in the current language",
    "Télécharger le manuel illustré (PDF) dans la langue affichée",
    "Descargar el manual ilustrado (PDF) en el idioma actual",
    "Scarica il manuale illustrato (PDF) nella lingua attuale",
    "Baixar o manual ilustrado (PDF) no idioma atual",
    "Bebildertes Handbuch (PDF) in der aktuellen Sprache herunterladen",
    "표시 중인 언어의 조작 요령(화면 그림 포함 PDF) 다운로드"
  ],
  "新機能のお知らせ": [
    "What’s new",
    "Nouveautés",
    "Novedades",
    "Novità",
    "Novidades",
    "Neuigkeiten",
    "새 기능 안내"
  ],
  "新しい機能": [
    "New features",
    "Nouvelles fonctions",
    "Nuevas funciones",
    "Nuove funzioni",
    "Novos recursos",
    "Neue Funktionen",
    "새 기능"
  ],
  "初期リリースからの機能追加の履歴です。前回の表示以降に追加された機能に NEW を付けています。「見る」でその機能の画面へ移動します。": [
    "This is the history of features added since the initial release. Features added since you last looked are marked NEW. “Show” takes you to the feature.",
    "Voici l’historique des fonctions ajoutées depuis la première version. Les fonctions ajoutées depuis votre dernière visite sont marquées NEW. « Voir » ouvre la fonction.",
    "Este es el historial de funciones añadidas desde la versión inicial. Las funciones añadidas desde la última vez están marcadas como NEW. «Ver» lleva a la función.",
    "Questa è la cronologia delle funzioni aggiunte dalla prima versione. Le funzioni aggiunte dall’ultima visita sono contrassegnate NEW. «Mostra» apre la funzione.",
    "Este é o histórico de funções adicionadas desde a versão inicial. Os recursos adicionados desde a última vez estão marcados como NEW. “Ver” leva ao recurso.",
    "Dies ist der Verlauf der seit der ersten Version hinzugefügten Funktionen. Seit dem letzten Besuch hinzugefügte Funktionen sind mit NEW markiert. „Anzeigen“ öffnet die Funktion.",
    "초기 릴리스 이후 추가된 기능의 이력입니다. 지난번 표시 이후 추가된 기능에 NEW를 붙였습니다. '보기'를 누르면 그 기능 화면으로 이동합니다."
  ],
  "閉じる": [
    "Close",
    "Fermer",
    "Cerrar",
    "Chiudi",
    "Fechar",
    "Schließen",
    "닫기"
  ],
  "見る": [
    "Show",
    "Voir",
    "Ver",
    "Mostra",
    "Ver",
    "Anzeigen",
    "보기"
  ],
  "報告書の印刷": [
    "Report printing",
    "Impression du rapport",
    "Impresión de informe",
    "Stampa del rapporto",
    "Impressão de relatório",
    "Berichtsdruck",
    "보고서 인쇄"
  ],
  "24時間予測の条件、時刻別の推奨周波数、ヒートマップ、24時間計画を1枚の印刷用ページにまとめます。": [
    "Puts the conditions, hourly recommended frequency, heatmap and 24-hour plan of a 24-hour prediction on one printable page.",
    "Réunit sur une page imprimable les conditions, la fréquence recommandée par heure, la carte de fiabilité et le plan sur 24 heures d’une prévision.",
    "Reúne en una página imprimible las condiciones, la frecuencia recomendada por hora, el mapa de calor y el plan de 24 horas de una predicción.",
    "Riunisce in una pagina stampabile condizioni, frequenza consigliata per ora, mappa di affidabilità e piano di 24 ore di una previsione.",
    "Reúne numa página imprimível as condições, a frequência recomendada por hora, o mapa de calor e o plano de 24 horas de uma previsão.",
    "Fasst Bedingungen, empfohlene Frequenz je Stunde, Heatmap und 24-Stunden-Plan einer Prognose auf einer druckbaren Seite zusammen.",
    "24시간 예측의 조건, 시각별 추천 주파수, 히트맵, 24시간 계획을 한 장의 인쇄용 페이지로 정리합니다."
  ],
  "保存した地点間予測を毎日NOAAの最新SSNで再計算し、目標REL以上の時間が減ったら画面上部で知らせます。": [
    "Recalculates saved point-to-point predictions daily with the latest NOAA SSN and shows a notice at the top when the hours at the target REL decrease.",
    "Recalcule chaque jour les prévisions point à point enregistrées avec la dernière SSN NOAA et affiche un avis en haut si les heures à la REL cible diminuent.",
    "Recalcula a diario las predicciones punto a punto guardadas con la última SSN de NOAA y avisa arriba si disminuyen las horas con la REL objetivo.",
    "Ricalcola ogni giorno le previsioni punto-punto salvate con l’ultima SSN NOAA e mostra un avviso in alto se le ore alla REL obiettivo diminuiscono.",
    "Recalcula diariamente as previsões ponto a ponto salvas com a última SSN da NOAA e avisa no topo se as horas na REL alvo diminuírem.",
    "Rechnet gespeicherte Punkt-zu-Punkt-Prognosen täglich mit der neuesten NOAA-SSN neu und zeigt oben einen Hinweis, wenn die Stunden mit Ziel-REL abnehmen.",
    "저장한 지점 간 예측을 매일 NOAA 최신 SSN으로 재계산하고, 목표 REL 이상 시간이 줄면 화면 위쪽에서 알립니다."
  ],
  "登録済みの地点から、受信地点や中継地点として目標RELに届く時間が長い順に候補を並べます。": [
    "Ranks saved locations as receive or relay sites by how many hours they reach the target REL.",
    "Classe les lieux enregistrés comme sites de réception ou relais selon le nombre d’heures à la REL cible.",
    "Ordena las ubicaciones guardadas como sitios receptores o de retransmisión según las horas con la REL objetivo.",
    "Ordina le località salvate come siti di ricezione o ripetitori in base alle ore alla REL obiettivo.",
    "Ordena os locais salvos como locais de recepção ou retransmissão pelas horas na REL alvo.",
    "Ordnet gespeicherte Standorte als Empfangs- oder Relaisstandorte nach Stunden mit Ziel-REL.",
    "등록된 지점을 수신 지점이나 중계 지점으로 보고 목표 REL에 도달하는 시간이 긴 순으로 나열합니다."
  ],
  "送信電力を10 Wから10 kWまで変えて計算し、時刻・周波数ごとに目標RELに届く最小の電力を示します。": [
    "Calculates powers from 10 W to 10 kW and shows the smallest power that reaches the target REL for each time and frequency.",
    "Calcule des puissances de 10 W à 10 kW et indique, par heure et fréquence, la plus petite puissance atteignant la REL cible.",
    "Calcula potencias de 10 W a 10 kW y muestra, por hora y frecuencia, la menor potencia que alcanza la REL objetivo.",
    "Calcola potenze da 10 W a 10 kW e mostra, per ora e frequenza, la potenza minima che raggiunge la REL obiettivo.",
    "Calcula potências de 10 W a 10 kW e mostra, por hora e frequência, a menor potência que atinge a REL alvo.",
    "Berechnet Leistungen von 10 W bis 10 kW und zeigt je Uhrzeit und Frequenz die kleinste Leistung mit Ziel-REL.",
    "송신 전력을 10 W에서 10 kW까지 바꾸어 계산하고, 시각·주파수별로 목표 REL에 도달하는 최소 전력을 보여 줍니다."
  ],
  "1つの経路について12か月分を計算し、月×UTCのRELで季節による変化を示します。": [
    "Calculates twelve months for one path and shows the seasonal change as REL by month × UTC.",
    "Calcule douze mois pour un trajet et montre l’évolution saisonnière en REL par mois × UTC.",
    "Calcula doce meses para un trayecto y muestra el cambio estacional como REL por mes × UTC.",
    "Calcola dodici mesi per un percorso e mostra la variazione stagionale come REL per mese × UTC.",
    "Calcula doze meses para um trajeto e mostra a variação sazonal como REL por mês × UTC.",
    "Berechnet zwölf Monate für einen Pfad und zeigt die jahreszeitliche Änderung als REL nach Monat × UTC.",
    "하나의 경로에 대해 12개월분을 계산하고, 월 × UTC별 REL로 계절 변화를 보여 줍니다."
  ],
  "24時間予測の下に、切替を抑えた時間帯ごとの使用周波数の表を表示します（CSV出力・印刷つき）。": [
    "Shows, below the 24-hour prediction, a table of the frequency to use in each time block with few switches (with CSV export and printing).",
    "Affiche sous la prévision sur 24 heures un tableau de la fréquence à utiliser par tranche horaire avec peu de changements (export CSV et impression).",
    "Muestra bajo la predicción de 24 horas una tabla de la frecuencia a usar en cada franja con pocos cambios (con exportación CSV e impresión).",
    "Mostra sotto la previsione di 24 ore una tabella della frequenza da usare in ogni fascia oraria con pochi cambi (con esportazione CSV e stampa).",
    "Mostra abaixo da previsão de 24 horas uma tabela da frequência a usar em cada faixa horária com poucas trocas (com exportação CSV e impressão).",
    "Zeigt unter der 24-Stunden-Prognose eine Tabelle der Frequenz je Zeitblock mit wenigen Wechseln (mit CSV-Export und Druck).",
    "24시간 예측 아래에 전환을 줄인 시간대별 사용 주파수 표를 표시합니다(CSV 출력·인쇄 포함)."
  ],
  "メッシュの中継到達性": [
    "Mesh relay reachability",
    "Accessibilité par relais du maillage",
    "Alcance por retransmisión de la malla",
    "Raggiungibilità via ripetitore della rete",
    "Alcance por retransmissão da malha",
    "Erreichbarkeit über Relais im Netz",
    "메시 중계 도달성"
  ],
  "直通では届かない拠点の組でも、1段か2段の中継で届く経路をメッシュ予測に示します。": [
    "Shows in the mesh forecast the routes that reach a pair of stations through one or two relays when the direct path does not.",
    "Indique dans la prévision maillée les routes qui relient deux stations par un ou deux relais lorsque le trajet direct échoue.",
    "Muestra en la predicción de malla las rutas que conectan dos estaciones mediante uno o dos repetidores cuando el trayecto directo no llega.",
    "Mostra nella previsione mesh i percorsi che collegano due stazioni tramite uno o due ripetitori quando il collegamento diretto non arriva.",
    "Mostra na previsão de malha as rotas que ligam duas estações por um ou dois retransmissores quando o trajeto direto não chega.",
    "Zeigt in der Mesh-Prognose die Wege, die zwei Stationen über ein oder zwei Relais verbinden, wenn der direkte Pfad nicht reicht.",
    "직통으로는 닿지 않는 거점 쌍도 1단 또는 2단 중계로 닿는 경로를 메시 예측에 보여 줍니다."
  ],
  "新しい機能が{count}件あります。": [
    "{count} new feature(s) are available.",
    "{count} nouvelle(s) fonction(s) disponible(s).",
    "Hay {count} función(es) nueva(s).",
    "Sono disponibili {count} nuove funzioni.",
    "Há {count} recurso(s) novo(s).",
    "{count} neue Funktion(en) verfügbar.",
    "새 기능이 {count}건 있습니다."
  ],
  "全画面の8言語対応": [
    "Every screen in eight languages",
    "Tous les écrans en huit langues",
    "Todas las pantallas en ocho idiomas",
    "Tutte le schermate in otto lingue",
    "Todas as telas em oito idiomas",
    "Alle Bildschirme in acht Sprachen",
    "모든 화면 8개 언어 지원"
  ],
  "地図の凡例やサーバーからのメッセージを含め、画面の文字をすべて8言語で表示できるようにしました。": [
    "All on-screen text, including the map legend and server messages, can now be shown in eight languages.",
    "Tout le texte affiché, y compris la légende de la carte et les messages du serveur, est disponible en huit langues.",
    "Todo el texto en pantalla, incluida la leyenda del mapa y los mensajes del servidor, puede mostrarse en ocho idiomas.",
    "Tutto il testo a schermo, compresi la legenda della mappa e i messaggi del server, è disponibile in otto lingue.",
    "Todo o texto na tela, incluindo a legenda do mapa e as mensagens do servidor, pode ser exibido em oito idiomas.",
    "Alle Texte auf dem Bildschirm, einschließlich Kartenlegende und Servermeldungen, sind in acht Sprachen verfügbar.",
    "지도 범례와 서버 메시지를 포함해 화면의 모든 문자를 8개 언어로 표시할 수 있게 했습니다."
  ],
  "2〜8拠点の全組を両方向で計算し、TX×RXのRELマトリックスで表示します。拠点ごとに電力・送受信アンテナ・雑音を設定できます。": [
    "Calculates every pair of 2–8 stations in both directions and shows REL as a TX × RX matrix, with per-station power, transmit and receive antennas and noise.",
    "Calcule toutes les paires de 2 à 8 stations dans les deux sens et affiche la REL en matrice TX × RX, avec puissance, antennes d’émission et de réception et bruit par station.",
    "Calcula todos los pares de 2 a 8 estaciones en ambos sentidos y muestra la REL como matriz TX × RX, con potencia, antenas de transmisión y recepción y ruido por estación.",
    "Calcola tutte le coppie di 2–8 stazioni in entrambe le direzioni e mostra la REL come matrice TX × RX, con potenza, antenne di trasmissione e ricezione e rumore per stazione.",
    "Calcula todos os pares de 2 a 8 estações nos dois sentidos e mostra a REL como matriz TX × RX, com potência, antenas de transmissão e recepção e ruído por estação.",
    "Berechnet alle Paare von 2–8 Stationen in beiden Richtungen und zeigt die REL als TX × RX-Matrix, mit Leistung, Sende- und Empfangsantenne und Rauschen je Station.",
    "2~8개 거점의 모든 쌍을 양방향으로 계산하고 TX×RX REL 매트릭스로 표시합니다. 거점마다 전력·송수신 안테나·잡음을 설정할 수 있습니다."
  ],
  "実効SSN": [
    "Effective SSN",
    "SSN effective",
    "SSN efectiva",
    "SSN effettiva",
    "SSN efetiva",
    "Effektive SSN",
    "실효 SSN"
  ],
  "観測局のfoF2から現在の電離圏に合うSSNを逆算し、計算に使えるようにしました（任意）。": [
    "An SSN matching the current ionosphere can be derived from observed ionosonde foF2 and used for calculation (optional).",
    "Une SSN adaptée à l’ionosphère actuelle peut être déduite du foF2 observé et utilisée pour le calcul (facultatif).",
    "Puede obtenerse una SSN acorde con la ionosfera actual a partir del foF2 observado y usarse en el cálculo (opcional).",
    "Si può ricavare dal foF2 osservato una SSN adatta alla ionosfera attuale e usarla nel calcolo (facoltativo).",
    "Pode-se obter do foF2 observado uma SSN adequada à ionosfera atual e usá-la no cálculo (opcional).",
    "Aus beobachtetem foF2 kann eine zur aktuellen Ionosphäre passende SSN ermittelt und für die Berechnung genutzt werden (optional).",
    "관측국의 foF2로부터 현재 전리층에 맞는 SSN을 역산해 계산에 쓸 수 있게 했습니다(선택)."
  ],
  "指向性アンテナの拡充": [
    "More directional antennas",
    "Plus d’antennes directives",
    "Más antenas directivas",
    "Più antenne direttive",
    "Mais antenas diretivas",
    "Mehr Richtantennen",
    "지향성 안테나 확충"
  ],
  "主放射方向を相手局へ自動で向ける設定と、ログペリオディック・逆L・傾斜ロングワイヤーの参照モデルを追加しました。": [
    "Added a setting that aims the main beam at the other station, and log-periodic, inverted-L and sloping long-wire reference models.",
    "Ajout d’un réglage qui oriente le lobe principal vers l’autre station, et de modèles de référence log-périodique, en L inversé et long fil incliné.",
    "Se añadió un ajuste que orienta el lóbulo principal hacia la otra estación, y modelos de referencia log-periódica, L invertida e hilo largo inclinado.",
    "Aggiunta un’impostazione che orienta il lobo principale verso l’altra stazione e modelli di riferimento log-periodica, L rovesciata e filo lungo inclinato.",
    "Adicionada uma configuração que aponta o lóbulo principal para a outra estação e modelos de referência log-periódica, L invertido e fio longo inclinado.",
    "Neue Einstellung, die die Hauptkeule auf die Gegenstation richtet, sowie Referenzmodelle Log-Periodic, Inverted-L und schräger Langdraht.",
    "주 방사 방향을 상대국으로 자동으로 향하게 하는 설정과 로그 주기·역L·경사 롱와이어 참조 모델을 추가했습니다."
  ],
  "電波型式の選択": [
    "Emission designations",
    "Classes d’émission",
    "Clases de emisión",
    "Classi di emissione",
    "Classes de emissão",
    "Sendearten",
    "전파 형식 선택"
  ],
  "電波型式と占有帯域幅を選べるようにし、既定値を送信電力1000 W・周波数2〜20 MHzにしました。": [
    "Emission designation and occupied bandwidth can be selected; the defaults are now 1000 W and 2–20 MHz.",
    "La classe d’émission et la largeur de bande occupée sont sélectionnables ; les valeurs par défaut sont 1000 W et 2–20 MHz.",
    "Pueden elegirse la clase de emisión y el ancho de banda ocupado; los valores por defecto son 1000 W y 2–20 MHz.",
    "Si possono scegliere classe di emissione e larghezza di banda occupata; i valori predefiniti sono 1000 W e 2–20 MHz.",
    "É possível escolher a classe de emissão e a largura de banda ocupada; os padrões passam a ser 1000 W e 2–20 MHz.",
    "Sendeart und belegte Bandbreite sind wählbar; Standard sind jetzt 1000 W und 2–20 MHz.",
    "전파 형식과 점유 대역폭을 선택할 수 있게 하고, 기본값을 송신 전력 1000 W·주파수 2~20 MHz로 했습니다."
  ],
  "タッチ操作の地図拡大": [
    "Touch map zoom",
    "Zoom tactile de la carte",
    "Zoom táctil del mapa",
    "Zoom della mappa al tocco",
    "Zoom do mapa por toque",
    "Kartenzoom per Touch",
    "터치 지도 확대"
  ],
  "タッチ画面でのピンチ操作と「＋」「−」ボタンで地図を拡大・縮小できるようにしました。": [
    "The map can be zoomed with a pinch on touch screens and with the + and − buttons.",
    "La carte se zoome par pincement sur écran tactile et avec les boutons + et −.",
    "El mapa se amplía con el gesto de pellizco en pantallas táctiles y con los botones + y −.",
    "La mappa si ingrandisce con il pizzico sugli schermi touch e con i pulsanti + e −.",
    "O mapa pode ser ampliado com o gesto de pinça em telas sensíveis ao toque e com os botões + e −.",
    "Die Karte lässt sich auf Touchscreens per Zwei-Finger-Geste und mit den Tasten + und − zoomen.",
    "터치 화면의 핀치 조작과 '＋'·'−' 버튼으로 지도를 확대·축소할 수 있게 했습니다."
  ],
  "公開版": [
    "Public edition",
    "Édition publique",
    "Edición pública",
    "Edizione pubblica",
    "Edição pública",
    "Öffentliche Ausgabe",
    "공개판"
  ],
  "インストールせずに誰でも使える公開サイトを用意しました。計算回数に上限があり、履歴と自分の地点・アンテナ1件はブラウザに保存します。": [
    "A public site that anyone can use without installing. Calculations are rate-limited; history, your own locations and one antenna stay in your browser.",
    "Un site public utilisable par tous sans installation. Les calculs sont limités ; l’historique, vos lieux et une antenne restent dans votre navigateur.",
    "Un sitio público que cualquiera puede usar sin instalar. Los cálculos tienen límite; el historial, sus ubicaciones y una antena quedan en su navegador.",
    "Un sito pubblico utilizzabile da chiunque senza installazione. I calcoli sono limitati; cronologia, località e un’antenna restano nel browser.",
    "Um site público que qualquer pessoa pode usar sem instalar. Os cálculos têm limite; o histórico, seus locais e uma antena ficam no navegador.",
    "Eine öffentliche Website, die alle ohne Installation nutzen können. Berechnungen sind begrenzt; Verlauf, eigene Standorte und eine Antenne bleiben im Browser.",
    "설치 없이 누구나 쓸 수 있는 공개 사이트를 마련했습니다. 계산 횟수에 상한이 있으며, 이력과 자신의 지점·안테나 1개는 브라우저에 저장합니다."
  ],
  "CHUCKへの改称と操作要領": [
    "Renamed CHUCK, with an operation manual",
    "Renommé CHUCK, avec un manuel d’utilisation",
    "Renombrado CHUCK, con manual de operación",
    "Rinominato CHUCK, con manuale operativo",
    "Renomeado CHUCK, com manual de operação",
    "In CHUCK umbenannt, mit Bedienungsanleitung",
    "CHUCK으로 개칭, 조작 요령"
  ],
  "名称をCHUCKに改め、画面図入りの日本語操作要領（PDF・Word）を用意しました。": [
    "The application is now called CHUCK, with an illustrated Japanese operation manual (PDF and Word).",
    "L’application s’appelle désormais CHUCK, avec un manuel d’utilisation illustré en japonais (PDF et Word).",
    "La aplicación se llama ahora CHUCK, con un manual de operación ilustrado en japonés (PDF y Word).",
    "L’applicazione si chiama ora CHUCK, con un manuale operativo illustrato in giapponese (PDF e Word).",
    "O aplicativo passou a se chamar CHUCK, com um manual de operação ilustrado em japonês (PDF e Word).",
    "Die Anwendung heißt jetzt CHUCK, mit bebilderter japanischer Bedienungsanleitung (PDF und Word).",
    "명칭을 CHUCK으로 바꾸고, 화면 그림이 들어간 일본어 조작 요령(PDF·Word)을 마련했습니다."
  ],
  "アンテナ資料のAI読み取り": [
    "AI reading of antenna documents",
    "Lecture IA des documents d’antenne",
    "Lectura con IA de documentos de antena",
    "Lettura IA dei documenti d’antenna",
    "Leitura por IA de documentos de antena",
    "KI-Auslesen von Antennenunterlagen",
    "안테나 자료 AI 판독"
  ],
  "カタログや仕様書（PDF・画像）を生成AIで読み取り、根拠を確認してアンテナプリセットに登録できます。OpenAI・Claude・Gemini・ローカルLLMを選べます。": [
    "Catalogs and specifications (PDF or images) can be read with generative AI and, after checking the evidence, saved as antenna presets. OpenAI, Claude, Gemini or a local LLM can be used.",
    "Les catalogues et fiches techniques (PDF ou images) peuvent être lus par IA générative puis, après vérification, enregistrés comme préréglages d’antenne. OpenAI, Claude, Gemini ou un LLM local sont possibles.",
    "Los catálogos y especificaciones (PDF o imágenes) pueden leerse con IA generativa y, tras comprobar la evidencia, guardarse como preajustes de antena. Se puede usar OpenAI, Claude, Gemini o un LLM local.",
    "Cataloghi e specifiche (PDF o immagini) possono essere letti con IA generativa e, dopo la verifica, salvati come preset d’antenna. Si possono usare OpenAI, Claude, Gemini o un LLM locale.",
    "Catálogos e especificações (PDF ou imagens) podem ser lidos com IA generativa e, após conferir as evidências, salvos como predefinições de antena. É possível usar OpenAI, Claude, Gemini ou um LLM local.",
    "Kataloge und Datenblätter (PDF oder Bilder) können mit generativer KI ausgelesen und nach Prüfung als Antennenvorlagen gespeichert werden. OpenAI, Claude, Gemini oder ein lokales LLM sind möglich.",
    "카탈로그나 사양서(PDF·이미지)를 생성형 AI로 판독하고 근거를 확인해 안테나 프리셋에 등록할 수 있습니다. OpenAI·Claude·Gemini·로컬 LLM을 선택할 수 있습니다."
  ],
  "寸法付きアンテナとPropagation Chart": [
    "Dimensioned antennas and the Propagation Chart",
    "Antennes dimensionnées et Propagation Chart",
    "Antenas con dimensiones y Propagation Chart",
    "Antenne dimensionate e Propagation Chart",
    "Antenas dimensionadas e Propagation Chart",
    "Bemaßte Antennen und Propagation Chart",
    "치수 있는 안테나와 Propagation Chart"
  ],
  "寸法付きのホイップ・ダイポールと出典付きアンテナカタログ、UTC×周波数のPropagation Chart（SVG保存）を追加しました。": [
    "Added dimensioned whips and dipoles, a sourced antenna catalog and the UTC × frequency Propagation Chart (saved as SVG).",
    "Ajout de fouets et dipôles dimensionnés, d’un catalogue d’antennes sourcé et du Propagation Chart UTC × fréquence (enregistrable en SVG).",
    "Se añadieron látigos y dipolos con dimensiones, un catálogo de antenas con fuentes y el Propagation Chart UTC × frecuencia (guardable en SVG).",
    "Aggiunti stili e dipoli dimensionati, un catalogo d’antenne con fonti e il Propagation Chart UTC × frequenza (salvabile in SVG).",
    "Adicionados chicotes e dipolos dimensionados, um catálogo de antenas com fontes e o Propagation Chart UTC × frequência (salvo em SVG).",
    "Bemaßte Peitschen und Dipole, ein Antennenkatalog mit Quellen und das Propagation Chart UTC × Frequenz (als SVG speicherbar) kamen hinzu.",
    "치수가 있는 휩·다이폴과 출처가 있는 안테나 카탈로그, UTC×주파수 Propagation Chart(SVG 저장)를 추가했습니다."
  ],
  "送受信地点の画面とプリセット": [
    "Station workspace and presets",
    "Espace des stations et préréglages",
    "Espacio de estaciones y preajustes",
    "Area stazioni e preset",
    "Área de estações e predefinições",
    "Stationsbereich und Vorlagen",
    "송수신 지점 화면과 프리셋"
  ],
  "地図とTX・RXの選択画面、地点・アンテナのプリセット、電波型式・偏波の条件、8言語の切替を備えた画面にしました。": [
    "A workspace with the map, TX and RX selection, location and antenna presets, emission and polarization conditions, and eight languages.",
    "Un espace de travail avec la carte, le choix des TX et RX, les préréglages de lieux et d’antennes, les conditions d’émission et de polarisation, et huit langues.",
    "Un espacio de trabajo con el mapa, la selección de TX y RX, preajustes de ubicación y antena, condiciones de emisión y polarización, y ocho idiomas.",
    "Un’area di lavoro con mappa, scelta di TX e RX, preset di località e antenne, condizioni di emissione e polarizzazione e otto lingue.",
    "Uma área de trabalho com o mapa, a escolha de TX e RX, predefinições de local e antena, condições de emissão e polarização e oito idiomas.",
    "Ein Arbeitsbereich mit Karte, TX- und RX-Auswahl, Standort- und Antennenvorlagen, Sendeart- und Polarisationsbedingungen und acht Sprachen.",
    "지도와 TX·RX 선택 화면, 지점·안테나 프리셋, 전파 형식·편파 조건, 8개 언어 전환을 갖춘 화면으로 했습니다."
  ],
  "移動局の位置ゲートウェイ": [
    "Mobile station position gateway",
    "Passerelle de position des stations mobiles",
    "Pasarela de posición de estaciones móviles",
    "Gateway di posizione delle stazioni mobili",
    "Gateway de posição de estações móveis",
    "Positions-Gateway für Mobilstationen",
    "이동국 위치 게이트웨이"
  ],
  "船舶・航空機などの位置を独立したゲートウェイで受信し、最新位置で計算できるようにしました。": [
    "Positions of ships, aircraft and other mobile stations are received by a separate gateway and the latest position can be used for calculation.",
    "Les positions de navires, d’aéronefs et d’autres stations mobiles sont reçues par une passerelle séparée et la dernière position peut servir au calcul.",
    "Las posiciones de barcos, aeronaves y otras estaciones móviles se reciben en una pasarela independiente y la última posición puede usarse en el cálculo.",
    "Le posizioni di navi, aeromobili e altre stazioni mobili sono ricevute da un gateway separato e l’ultima posizione può essere usata nel calcolo.",
    "As posições de navios, aeronaves e outras estações móveis são recebidas por um gateway separado e a posição mais recente pode ser usada no cálculo.",
    "Positionen von Schiffen, Flugzeugen und anderen Mobilstationen werden über ein eigenes Gateway empfangen; die neueste Position kann für die Berechnung genutzt werden.",
    "선박·항공기 등의 위치를 독립된 게이트웨이로 수신하고, 최신 위치로 계산할 수 있게 했습니다."
  ],
  "最大8か所の受信地点を同時に計算し、最良サイトと理論範囲を比較できるようにしました。": [
    "Up to eight receive sites are calculated together to compare the best site and the theoretical bounds.",
    "Jusqu’à huit sites de réception sont calculés ensemble pour comparer le meilleur site et les bornes théoriques.",
    "Se calculan juntos hasta ocho sitios receptores para comparar el mejor sitio y los límites teóricos.",
    "Fino a otto siti di ricezione vengono calcolati insieme per confrontare il sito migliore e i limiti teorici.",
    "Até oito locais de recepção são calculados juntos para comparar o melhor local e os limites teóricos.",
    "Bis zu acht Empfangsstandorte werden gemeinsam berechnet, um den besten Standort und die theoretischen Grenzen zu vergleichen.",
    "최대 8곳의 수신 지점을 함께 계산해 최적 사이트와 이론 범위를 비교할 수 있게 했습니다."
  ],
  "宇宙天気と電離圏観測": [
    "Space weather and ionosonde observations",
    "Météo spatiale et observations ionosphériques",
    "Clima espacial y observaciones ionosféricas",
    "Meteo spaziale e osservazioni ionosferiche",
    "Clima espacial e observações ionosféricas",
    "Weltraumwetter und Ionosonden-Beobachtungen",
    "우주 기상과 전리층 관측"
  ],
  "NOAAの月別平滑SSNの自動取得、D-RAP吸収の地図表示、国内（NICT）・海外（GIRO）の観測局データを追加しました。": [
    "Added automatic NOAA monthly smoothed SSN, the D-RAP absorption map overlay, and domestic (NICT) and overseas (GIRO) ionosonde data.",
    "Ajout de la SSN lissée mensuelle NOAA automatique, de la couche D-RAP d’absorption sur la carte, et des données ionosphériques nationales (NICT) et étrangères (GIRO).",
    "Se añadieron la SSN suavizada mensual de NOAA automática, la capa D-RAP de absorción en el mapa y datos de ionosondas nacionales (NICT) y extranjeras (GIRO).",
    "Aggiunti la SSN livellata mensile NOAA automatica, il livello D-RAP di assorbimento sulla mappa e i dati delle ionosonde nazionali (NICT) ed estere (GIRO).",
    "Adicionados a SSN suavizada mensal da NOAA automática, a camada D-RAP de absorção no mapa e dados de ionossondas nacionais (NICT) e estrangeiras (GIRO).",
    "Automatische geglättete Monats-SSN von NOAA, D-RAP-Absorptionsebene auf der Karte sowie Ionosondendaten aus Japan (NICT) und dem Ausland (GIRO) kamen hinzu.",
    "NOAA 월별 평활 SSN 자동 취득, D-RAP 흡수 지도 표시, 국내(NICT)·해외(GIRO) 관측국 데이터를 추가했습니다."
  ],
  "初期リリース": [
    "Initial release",
    "Première version",
    "Versión inicial",
    "Prima versione",
    "Versão inicial",
    "Erste Version",
    "초기 릴리스"
  ],
  "VOACAP（voacapl）による24時間の地点間予測、信頼度ヒートマップ、推奨周波数、地域カバー範囲、計算履歴とCSV・JSON出力を、Dockerで起動するWebアプリとして公開しました。": [
    "Released as a Docker web application: 24-hour point-to-point prediction with VOACAP (voacapl), reliability heatmap, recommended frequency, regional coverage, calculation history and CSV/JSON export.",
    "Publiée comme application web Docker : prévision point à point sur 24 heures avec VOACAP (voacapl), carte de fiabilité, fréquence recommandée, couverture régionale, historique et export CSV/JSON.",
    "Publicada como aplicación web Docker: predicción punto a punto de 24 horas con VOACAP (voacapl), mapa de calor de fiabilidad, frecuencia recomendada, cobertura regional, historial y exportación CSV/JSON.",
    "Pubblicata come applicazione web Docker: previsione punto-punto di 24 ore con VOACAP (voacapl), mappa di affidabilità, frequenza consigliata, copertura regionale, cronologia ed esportazione CSV/JSON.",
    "Lançada como aplicativo web Docker: previsão ponto a ponto de 24 horas com VOACAP (voacapl), mapa de calor de confiabilidade, frequência recomendada, cobertura regional, histórico e exportação CSV/JSON.",
    "Als Docker-Webanwendung veröffentlicht: 24-Stunden-Punkt-zu-Punkt-Prognose mit VOACAP (voacapl), Zuverlässigkeits-Heatmap, empfohlene Frequenz, regionale Abdeckung, Verlauf und CSV/JSON-Export.",
    "Docker로 실행하는 웹 앱으로 공개: VOACAP(voacapl)에 의한 24시간 지점 간 예측, 신뢰도 히트맵, 추천 주파수, 지역 커버 범위, 계산 이력과 CSV·JSON 출력."
  ],
  "REL表示": [
    "REL display",
    "Affichage REL",
    "Vista REL",
    "Vista REL",
    "Exibição REL",
    "REL-Anzeige",
    "REL 표시"
  ],
  "4段階": [
    "4 grades",
    "4 niveaux",
    "4 niveles",
    "4 livelli",
    "4 níveis",
    "4 Stufen",
    "4단계"
  ],
  "REL · 4段階": [
    "REL · 4 grades",
    "REL · 4 niveaux",
    "REL · 4 niveles",
    "REL · 4 livelli",
    "REL · 4 níveis",
    "REL · 4 Stufen",
    "REL · 4단계"
  ],
  "信頼度 段階": [
    "Reliability grade",
    "Niveau de fiabilité",
    "Nivel de fiabilidad",
    "Livello di affidabilità",
    "Nível de confiabilidade",
    "Zuverlässigkeitsstufe",
    "신뢰도 등급"
  ],
  "最良REL 段階": [
    "Best REL grade",
    "Meilleur niveau REL",
    "Mejor nivel REL",
    "Miglior livello REL",
    "Melhor nível REL",
    "Beste REL-Stufe",
    "최적 REL 등급"
  ],
  "REL 段階": [
    "REL grade",
    "Niveau REL",
    "Nivel REL",
    "Livello REL",
    "Nível REL",
    "REL-Stufe",
    "REL 등급"
  ],
  "REL表示の切替と見やすい経路": [
    "REL display options and clearer paths",
    "Affichage REL et trajets plus lisibles",
    "Vista REL y trayectos más claros",
    "Vista REL e percorsi più leggibili",
    "Exibição REL e trajetos mais claros",
    "REL-Anzeige und deutlichere Pfade",
    "REL 표시 전환과 보기 쉬운 경로"
  ],
  "地図の「REL表示」で、RELを%と4段階（EXCELLENT・GOOD・POOR・NONE）から選べます。地図の経路はRELの段階で色分けし、選択時刻の最良RELを経路上に表示します。": [
    "Use “REL display” on the map to show REL as a percentage or in four grades (EXCELLENT, GOOD, POOR, NONE). Map paths are colored by REL grade and show the best REL for the selected hour.",
    "« Affichage REL » sur la carte permet d’afficher la REL en pourcentage ou en quatre niveaux (EXCELLENT, GOOD, POOR, NONE). Les trajets sont colorés selon le niveau de REL et indiquent la meilleure REL de l’heure choisie.",
    "Con «Vista REL» en el mapa, la REL se muestra en porcentaje o en cuatro niveles (EXCELLENT, GOOD, POOR, NONE). Los trayectos se colorean según el nivel de REL y muestran la mejor REL de la hora elegida.",
    "Con «Vista REL» sulla mappa la REL si mostra in percentuale o in quattro livelli (EXCELLENT, GOOD, POOR, NONE). I percorsi sono colorati in base al livello di REL e mostrano la REL migliore dell’ora scelta.",
    "Em «Exibição REL» no mapa, a REL aparece em porcentagem ou em quatro níveis (EXCELLENT, GOOD, POOR, NONE). Os trajetos são coloridos pelo nível de REL e mostram a melhor REL da hora escolhida.",
    "Mit „REL-Anzeige“ auf der Karte wird die REL in Prozent oder in vier Stufen (EXCELLENT, GOOD, POOR, NONE) angezeigt. Pfade sind nach REL-Stufe eingefärbt und zeigen die beste REL der gewählten Stunde.",
    "지도의 'REL 표시'에서 REL을 %와 4단계(EXCELLENT·GOOD·POOR·NONE) 중에서 고를 수 있습니다. 지도의 경로는 REL 단계로 색을 나누고, 선택한 시각의 최적 REL을 경로 위에 표시합니다."
  ],
  "利得表アンテナには登録済みの利得表が必要です": [
    "A gain-table antenna needs a registered gain table",
    "Une antenne à table de gain nécessite une table de gain enregistrée",
    "Una antena con tabla de ganancia necesita una tabla registrada",
    "Un'antenna a tabella di guadagno richiede una tabella registrata",
    "Uma antena com tabela de ganho precisa de uma tabela registrada",
    "Eine Gewinntabellen-Antenne benötigt eine registrierte Gewinntabelle",
    "이득표 안테나에는 등록된 이득표가 필요합니다"
  ],
  "利得表を読み込めません": [
    "Cannot load the gain table",
    "Impossible de charger la table de gain",
    "No se puede cargar la tabla de ganancia",
    "Impossibile caricare la tabella di guadagno",
    "Não é possível carregar a tabela de ganho",
    "Die Gewinntabelle kann nicht geladen werden",
    "이득표를 불러올 수 없습니다"
  ],
  "CSVが空です": [
    "The CSV is empty",
    "Le CSV est vide",
    "El CSV está vacío",
    "Il CSV è vuoto",
    "O CSV está vazio",
    "Die CSV-Datei ist leer",
    "CSV가 비어 있습니다"
  ],
  "CSVは6 MiB以下にしてください": [
    "The CSV must be 6 MiB or smaller",
    "Le CSV doit faire 6 Mio au maximum",
    "El CSV debe ocupar 6 MiB o menos",
    "Il CSV deve essere al massimo di 6 MiB",
    "O CSV deve ter no máximo 6 MiB",
    "Die CSV-Datei darf höchstens 6 MiB groß sein",
    "CSV는 6 MiB 이하로 해 주세요"
  ],
  "CSVの見出しは frequency_mhz,azimuth_deg,elevation_deg,gain_dbi です": [
    "The CSV header must be frequency_mhz,azimuth_deg,elevation_deg,gain_dbi",
    "L’en-tête du CSV doit être frequency_mhz,azimuth_deg,elevation_deg,gain_dbi",
    "El encabezado del CSV debe ser frequency_mhz,azimuth_deg,elevation_deg,gain_dbi",
    "L’intestazione del CSV deve essere frequency_mhz,azimuth_deg,elevation_deg,gain_dbi",
    "O cabeçalho do CSV deve ser frequency_mhz,azimuth_deg,elevation_deg,gain_dbi",
    "Die CSV-Kopfzeile muss frequency_mhz,azimuth_deg,elevation_deg,gain_dbi lauten",
    "CSV 머리글은 frequency_mhz,azimuth_deg,elevation_deg,gain_dbi 입니다"
  ],
  "データ点は{count}点以下にしてください": [
    "Use {count} data points or fewer",
    "Utilisez au maximum {count} points de données",
    "Use como máximo {count} puntos de datos",
    "Usa al massimo {count} punti dati",
    "Use no máximo {count} pontos de dados",
    "Höchstens {count} Datenpunkte verwenden",
    "데이터 점은 {count}개 이하로 해 주세요"
  ],
  "仰角は2点以上が必要です": [
    "At least two elevation angles are needed",
    "Au moins deux angles d’élévation sont nécessaires",
    "Se necesitan al menos dos ángulos de elevación",
    "Servono almeno due angoli di elevazione",
    "São necessários pelo menos dois ângulos de elevação",
    "Mindestens zwei Erhebungswinkel sind erforderlich",
    "앙각은 2개 이상 필요합니다"
  ],
  "周波数・方位・仰角のすべての組合せに利得が必要です（格子が欠けています）": [
    "Every combination of frequency, azimuth and elevation needs a gain (the grid is incomplete)",
    "Chaque combinaison de fréquence, d’azimut et d’élévation doit avoir un gain (grille incomplète)",
    "Cada combinación de frecuencia, acimut y elevación necesita una ganancia (la cuadrícula está incompleta)",
    "Ogni combinazione di frequenza, azimut ed elevazione richiede un guadagno (griglia incompleta)",
    "Cada combinação de frequência, azimute e elevação precisa de um ganho (a grade está incompleta)",
    "Jede Kombination aus Frequenz, Azimut und Erhebung braucht einen Gewinn (das Raster ist unvollständig)",
    "주파수·방위·앙각의 모든 조합에 이득이 필요합니다(격자가 빠져 있습니다)"
  ],
  "pattern_id: 利得表のIDが不正です": [
    "pattern_id: invalid gain table ID",
    "pattern_id : identifiant de table de gain invalide",
    "pattern_id: ID de tabla de ganancia no válido",
    "pattern_id: ID della tabella di guadagno non valido",
    "pattern_id: ID de tabela de ganho inválido",
    "pattern_id: ungültige Gewinntabellen-ID",
    "pattern_id: 이득표 ID가 올바르지 않습니다"
  ],
  "{line}行目: 4列が必要です": [
    "Line {line}: four columns are required",
    "Ligne {line} : quatre colonnes sont nécessaires",
    "Línea {line}: se necesitan cuatro columnas",
    "Riga {line}: servono quattro colonne",
    "Linha {line}: são necessárias quatro colunas",
    "Zeile {line}: vier Spalten erforderlich",
    "{line}행: 4개 열이 필요합니다"
  ],
  "{line}行目: 有限の数値が必要です": [
    "Line {line}: finite numbers are required",
    "Ligne {line} : des nombres finis sont nécessaires",
    "Línea {line}: se necesitan números finitos",
    "Riga {line}: servono numeri finiti",
    "Linha {line}: são necessários números finitos",
    "Zeile {line}: endliche Zahlen erforderlich",
    "{line}행: 유한한 숫자가 필요합니다"
  ],
  "{line}行目: 周波数は1〜30 MHzです": [
    "Line {line}: frequency must be 1–30 MHz",
    "Ligne {line} : la fréquence doit être entre 1 et 30 MHz",
    "Línea {line}: la frecuencia debe estar entre 1 y 30 MHz",
    "Riga {line}: la frequenza deve essere tra 1 e 30 MHz",
    "Linha {line}: a frequência deve estar entre 1 e 30 MHz",
    "Zeile {line}: Frequenz muss 1–30 MHz sein",
    "{line}행: 주파수는 1~30 MHz입니다"
  ],
  "{line}行目: 方位は0〜360°です": [
    "Line {line}: azimuth must be 0–360°",
    "Ligne {line} : l’azimut doit être entre 0 et 360°",
    "Línea {line}: el acimut debe estar entre 0 y 360°",
    "Riga {line}: l’azimut deve essere tra 0 e 360°",
    "Linha {line}: o azimute deve estar entre 0 e 360°",
    "Zeile {line}: Azimut muss 0–360° sein",
    "{line}행: 방위는 0~360°입니다"
  ],
  "{line}行目: 仰角は0〜90°です": [
    "Line {line}: elevation must be 0–90°",
    "Ligne {line} : l’élévation doit être entre 0 et 90°",
    "Línea {line}: la elevación debe estar entre 0 y 90°",
    "Riga {line}: l’elevazione deve essere tra 0 e 90°",
    "Linha {line}: a elevação deve estar entre 0 e 90°",
    "Zeile {line}: Erhebung muss 0–90° sein",
    "{line}행: 앙각은 0~90°입니다"
  ],
  "{line}行目: 利得は−100〜50 dBiです": [
    "Line {line}: gain must be −100 to 50 dBi",
    "Ligne {line} : le gain doit être entre −100 et 50 dBi",
    "Línea {line}: la ganancia debe estar entre −100 y 50 dBi",
    "Riga {line}: il guadagno deve essere tra −100 e 50 dBi",
    "Linha {line}: o ganho deve estar entre −100 e 50 dBi",
    "Zeile {line}: Gewinn muss −100 bis 50 dBi sein",
    "{line}행: 이득은 −100~50 dBi입니다"
  ],
  "{line}行目: 同じ周波数・方位・仰角が重複しています": [
    "Line {line}: duplicate frequency, azimuth and elevation",
    "Ligne {line} : fréquence, azimut et élévation en double",
    "Línea {line}: frecuencia, acimut y elevación duplicados",
    "Riga {line}: frequenza, azimut ed elevazione duplicati",
    "Linha {line}: frequência, azimute e elevação duplicados",
    "Zeile {line}: doppelte Kombination aus Frequenz, Azimut und Erhebung",
    "{line}행: 같은 주파수·방위·앙각이 중복되었습니다"
  ],
  "{line}行目: 数値ではありません": [
    "Line {line}: not a number",
    "Ligne {line} : ce n’est pas un nombre",
    "Línea {line}: no es un número",
    "Riga {line}: non è un numero",
    "Linha {line}: não é um número",
    "Zeile {line}: keine Zahl",
    "{line}행: 숫자가 아닙니다"
  ],
  "指定された利得表がありません。アンテナプリセットを確認してください": [
    "The specified gain table does not exist. Check the antenna preset",
    "La table de gain indiquée n’existe pas. Vérifiez le préréglage d’antenne",
    "La tabla de ganancia indicada no existe. Revise el preajuste de antena",
    "La tabella di guadagno indicata non esiste. Controlla il preset dell’antenna",
    "A tabela de ganho indicada não existe. Verifique a predefinição da antena",
    "Die angegebene Gewinntabelle existiert nicht. Antennenvorlage prüfen",
    "지정한 이득표가 없습니다. 안테나 프리셋을 확인해 주세요"
  ],
  "利得表の名称は表示可能な1〜40文字です": [
    "Gain table names must be 1–40 printable characters",
    "Le nom de la table de gain doit comporter 1 à 40 caractères affichables",
    "El nombre de la tabla de ganancia debe tener de 1 a 40 caracteres visibles",
    "Il nome della tabella di guadagno deve avere da 1 a 40 caratteri stampabili",
    "O nome da tabela de ganho deve ter de 1 a 40 caracteres visíveis",
    "Der Name der Gewinntabelle muss 1–40 druckbare Zeichen haben",
    "이득표 이름은 표시 가능한 1~40자입니다"
  ],
  "出典・解析条件は200文字以内です": [
    "Source and analysis conditions must be 200 characters or fewer",
    "La source et les conditions d’analyse sont limitées à 200 caractères",
    "La fuente y las condiciones de análisis admiten hasta 200 caracteres",
    "Fonte e condizioni di analisi: massimo 200 caratteri",
    "Fonte e condições de análise: no máximo 200 caracteres",
    "Quelle und Analysebedingungen: höchstens 200 Zeichen",
    "출처·해석 조건은 200자 이내입니다"
  ],
  "利得表は{count}件までです": [
    "Up to {count} gain tables can be registered",
    "Jusqu’à {count} tables de gain peuvent être enregistrées",
    "Se pueden registrar hasta {count} tablas de ganancia",
    "Si possono registrare fino a {count} tabelle di guadagno",
    "É possível registrar até {count} tabelas de ganho",
    "Es können bis zu {count} Gewinntabellen registriert werden",
    "이득표는 {count}개까지입니다"
  ],
  "同じ名称の利得表があります": [
    "A gain table with the same name already exists",
    "Une table de gain portant le même nom existe déjà",
    "Ya existe una tabla de ganancia con el mismo nombre",
    "Esiste già una tabella di guadagno con lo stesso nome",
    "Já existe uma tabela de ganho com o mesmo nome",
    "Eine Gewinntabelle mit diesem Namen existiert bereits",
    "같은 이름의 이득표가 있습니다"
  ],
  "この利得表を使うアンテナプリセットを先に削除してください": [
    "Delete the antenna presets that use this gain table first",
    "Supprimez d’abord les préréglages d’antenne qui utilisent cette table de gain",
    "Elimine primero los preajustes de antena que usan esta tabla de ganancia",
    "Elimina prima i preset di antenna che usano questa tabella di guadagno",
    "Exclua primeiro as predefinições de antena que usam esta tabela de ganho",
    "Zuerst die Antennenvorlagen löschen, die diese Gewinntabelle verwenden",
    "이 이득표를 사용하는 안테나 프리셋을 먼저 삭제해 주세요"
  ],
  "指定された利得表がありません": [
    "The specified gain table does not exist",
    "La table de gain indiquée n’existe pas",
    "La tabla de ganancia indicada no existe",
    "La tabella di guadagno indicata non esiste",
    "A tabela de ganho indicada não existe",
    "Die angegebene Gewinntabelle existiert nicht",
    "지정한 이득표가 없습니다"
  ],
  "利得表CSVは6 MiB以下です": [
    "The gain table CSV must be 6 MiB or smaller",
    "Le CSV de table de gain doit faire 6 Mio au maximum",
    "El CSV de la tabla de ganancia debe ocupar 6 MiB o menos",
    "Il CSV della tabella di guadagno deve essere al massimo di 6 MiB",
    "O CSV da tabela de ganho deve ter no máximo 6 MiB",
    "Die Gewinntabellen-CSV darf höchstens 6 MiB groß sein",
    "이득표 CSV는 6 MiB 이하입니다"
  ],
  "利得表を保存できませんでした": [
    "Could not save the gain table",
    "Impossible d’enregistrer la table de gain",
    "No se pudo guardar la tabla de ganancia",
    "Impossibile salvare la tabella di guadagno",
    "Não foi possível salvar a tabela de ganho",
    "Die Gewinntabelle konnte nicht gespeichert werden",
    "이득표를 저장하지 못했습니다"
  ],
  "アンテナの利得表": [
    "Antenna gain tables",
    "Tables de gain d’antenne",
    "Tablas de ganancia de antena",
    "Tabelle di guadagno d’antenna",
    "Tabelas de ganho de antena",
    "Antennen-Gewinntabellen",
    "안테나 이득표"
  ],
  "実測やNEC等で解析した放射パターンをCSVの利得表として登録し、アンテナプリセットの基準モデル「利得表」として計算に使えます。": [
    "Register measured or NEC-simulated radiation patterns as CSV gain tables and use them in calculations through the “gain table” base model of an antenna preset.",
    "Enregistrez des diagrammes de rayonnement mesurés ou simulés (NEC, etc.) sous forme de tables de gain CSV et utilisez-les dans les calculs via le modèle de base « table de gain » d’un préréglage d’antenne.",
    "Registre diagramas de radiación medidos o simulados (NEC, etc.) como tablas de ganancia CSV y úselos en los cálculos con el modelo base «tabla de ganancia» de un preajuste de antena.",
    "Registra diagrammi di radiazione misurati o simulati (NEC, ecc.) come tabelle di guadagno CSV e usali nei calcoli tramite il modello base «tabella di guadagno» di un preset d’antenna.",
    "Registre diagramas de radiação medidos ou simulados (NEC etc.) como tabelas de ganho CSV e use-os nos cálculos pelo modelo base «tabela de ganho» de uma predefinição de antena.",
    "Gemessene oder mit NEC usw. simulierte Strahlungsdiagramme als CSV-Gewinntabellen registrieren und über das Basismodell „Gewinntabelle“ einer Antennenvorlage in Berechnungen verwenden.",
    "실측 또는 NEC 등으로 해석한 방사 패턴을 CSV 이득표로 등록하고, 안테나 프리셋의 기준 모델 '이득표'로 계산에 사용할 수 있습니다."
  ],
  "スライダーで時刻を動かすと、マトリックス全体がその時刻に切り替わります。最良周波数では、セルの下段にREL最大の周波数（MHz）を表示します。点は目標REL以上、灰色は欠測です。セルを選ぶと下にその経路の24時間を表示します。": [
    "Moving the slider switches the whole matrix to that hour. With Best frequency, the lower line of each cell shows the frequency (MHz) with the highest REL. A dot marks REL at or above the target REL; grey is missing data. Select a cell to show that link's 24 hours below.",
    "Le curseur fait passer toute la matrice à l’heure choisie. En mode Meilleure fréquence, la ligne inférieure de chaque cellule indique la fréquence (MHz) de REL maximale. Un point signale une REL au moins égale à la REL cible ; le gris indique une donnée manquante. Sélectionnez une cellule pour afficher les 24 heures de cette liaison.",
    "Al mover el control, toda la matriz cambia a esa hora. Con Mejor frecuencia, la línea inferior de cada celda muestra la frecuencia (MHz) de mayor REL. Un punto indica REL igual o superior a la REL objetivo; el gris indica falta de datos. Seleccione una celda para ver las 24 horas de ese enlace.",
    "Spostando il cursore l’intera matrice passa a quell’ora. Con Frequenza migliore, la riga inferiore di ogni cella mostra la frequenza (MHz) con REL massima. Un punto indica REL pari o superiore alla REL obiettivo; il grigio indica dati mancanti. Seleziona una cella per vedere sotto le 24 ore di quel collegamento.",
    "Ao mover o controle, toda a matriz muda para essa hora. Com Melhor frequência, a linha inferior de cada célula mostra a frequência (MHz) de maior REL. Um ponto indica REL igual ou acima da REL alvo; cinza indica dado ausente. Selecione uma célula para ver abaixo as 24 horas desse enlace.",
    "Mit dem Schieberegler wechselt die gesamte Matrix auf diese Stunde. Bei Beste Frequenz zeigt die untere Zeile jeder Zelle die Frequenz (MHz) mit der höchsten REL. Ein Punkt markiert REL ab der Ziel-REL, Grau fehlende Daten. Eine Zelle wählen, um darunter die 24 Stunden dieser Verbindung zu sehen.",
    "슬라이더를 움직이면 매트릭스 전체가 해당 시각으로 바뀝니다. 최적 주파수에서는 각 셀 아래 줄에 REL이 가장 높은 주파수(MHz)를 표시합니다. 점은 목표 REL 이상, 회색은 결측입니다. 셀을 선택하면 아래에 그 경로의 24시간을 표시합니다."
  ],
  "· 区間REL {rels} · 中継経路REL {route} · {freqs} MHz": [
    "· Hop REL {rels} · Relay route REL {route} · {freqs} MHz",
    "· REL par saut {rels} · REL de l’itinéraire {route} · {freqs} MHz",
    "· REL por salto {rels} · REL de la ruta {route} · {freqs} MHz",
    "· REL per tratta {rels} · REL del percorso {route} · {freqs} MHz",
    "· REL por salto {rels} · REL da rota {route} · {freqs} MHz",
    "· Abschnitts-REL {rels} · Routen-REL {route} · {freqs} MHz",
    "· 구간 REL {rels} · 중계 경로 REL {route} · {freqs} MHz"
  ],
  "印 · はREL {value}%以上": [
    "Dot · = REL {value}% or above",
    "Point · = REL ≥ {value} %",
    "Punto · = REL ≥ {value}%",
    "Punto · = REL ≥ {value}%",
    "Ponto · = REL ≥ {value}%",
    "Punkt · = REL ab {value} %",
    "점 · = REL {value}% 이상"
  ],
  "REL表示の閾値": [
    "REL display thresholds",
    "Seuils d’affichage REL",
    "Umbrales de visualización REL",
    "Soglie di visualizzazione REL",
    "Limiares de exibição REL",
    "REL-Anzeigeschwellen",
    "REL 표시 임계값"
  ],
  "EXCELLENT %以上": [
    "EXCELLENT at or above %",
    "EXCELLENT à partir de %",
    "EXCELLENT desde %",
    "EXCELLENT da %",
    "EXCELLENT a partir de %",
    "EXCELLENT ab %",
    "EXCELLENT % 이상"
  ],
  "GOOD %以上": [
    "GOOD at or above %",
    "GOOD à partir de %",
    "GOOD desde %",
    "GOOD da %",
    "GOOD a partir de %",
    "GOOD ab %",
    "GOOD % 이상"
  ],
  "POOR %以上": [
    "POOR at or above %",
    "POOR à partir de %",
    "POOR desde %",
    "POOR da %",
    "POOR a partir de %",
    "POOR ab %",
    "POOR % 이상"
  ],
  "閾値は1〜100%で、EXCELLENT ＞ GOOD ＞ POOR の順にしてください。": [
    "Use thresholds from 1 to 100% with EXCELLENT > GOOD > POOR.",
    "Utilisez des seuils de 1 à 100 % avec EXCELLENT > GOOD > POOR.",
    "Use umbrales de 1 a 100% con EXCELLENT > GOOD > POOR.",
    "Usa soglie da 1 a 100% con EXCELLENT > GOOD > POOR.",
    "Use limiares de 1 a 100% com EXCELLENT > GOOD > POOR.",
    "Schwellen von 1 bis 100 % mit EXCELLENT > GOOD > POOR verwenden.",
    "임계값은 1~100%이며 EXCELLENT > GOOD > POOR 순서여야 합니다."
  ],
  "目標RELは計算条件です。推奨周波数、運用周波数の計画、送信電力・拠点の候補、中継経路の判定に使い、次の計算から反映します。セルの印（·）も目標REL以上に付けます。EXCELLENT・GOOD・POORは表示だけの設定で、このブラウザに保存します。POOR未満はNONEです。": [
    "Target REL is a calculation condition. It is used for the recommended frequency, the operating frequency plan, transmit power and site candidates, and relay route judgment, from the next calculation. Cells at or above it get the dot (·). EXCELLENT, GOOD and POOR are display-only settings saved in this browser. Below POOR is NONE.",
    "La REL cible est une condition de calcul. Elle sert à la fréquence recommandée, au plan de fréquences d’exploitation, aux candidats de puissance d’émission et de sites, et au jugement des relais, à partir du prochain calcul. Les cellules qui l’atteignent portent le point (·). EXCELLENT, GOOD et POOR sont des réglages d’affichage seulement, enregistrés dans ce navigateur. En dessous de POOR : NONE.",
    "La REL objetivo es una condición de cálculo. Se usa para la frecuencia recomendada, el plan de frecuencias de operación, los candidatos de potencia de transmisión y de sitios, y la evaluación de relevos, desde el próximo cálculo. Las celdas que la alcanzan llevan el punto (·). EXCELLENT, GOOD y POOR son ajustes solo de visualización, guardados en este navegador. Por debajo de POOR es NONE.",
    "La REL obiettivo è una condizione di calcolo. Si usa per la frequenza consigliata, il piano delle frequenze operative, i candidati di potenza di trasmissione e di siti e la valutazione dei relay, dal prossimo calcolo. Le celle che la raggiungono hanno il punto (·). EXCELLENT, GOOD e POOR sono impostazioni solo di visualizzazione, salvate in questo browser. Sotto POOR è NONE.",
    "A REL alvo é uma condição de cálculo. É usada na frequência recomendada, no plano de frequências de operação, nos candidatos de potência de transmissão e de locais e na avaliação de retransmissões, a partir do próximo cálculo. As células que a atingem recebem o ponto (·). EXCELLENT, GOOD e POOR são configurações apenas de exibição, salvas neste navegador. Abaixo de POOR é NONE.",
    "Die Ziel-REL ist eine Rechenbedingung. Sie gilt ab der nächsten Berechnung für die empfohlene Frequenz, den Betriebsfrequenzplan, Sendeleistungs- und Standortkandidaten sowie die Bewertung von Relaisrouten. Zellen ab diesem Wert erhalten den Punkt (·). EXCELLENT, GOOD und POOR sind reine Anzeigeeinstellungen, in diesem Browser gespeichert. Unter POOR gilt NONE.",
    "목표 REL은 계산 조건입니다. 다음 계산부터 추천 주파수, 운용 주파수 계획, 송신 전력·거점 후보, 중계 경로 판정에 사용합니다. 목표 REL 이상인 셀에는 점(·)을 붙입니다. EXCELLENT·GOOD·POOR는 표시 전용 설정이며 이 브라우저에 저장됩니다. POOR 미만은 NONE입니다."
  ],
  "既定値に戻す": [
    "Restore defaults",
    "Rétablir les valeurs par défaut",
    "Restaurar valores predeterminados",
    "Ripristina predefiniti",
    "Restaurar padrões",
    "Standardwerte wiederherstellen",
    "기본값으로 되돌리기"
  ],
  "メッシュ表の中継表示とREL閾値": [
    "Mesh relay marks and REL thresholds",
    "Relais de la maille et seuils REL",
    "Relevos de la malla y umbrales REL",
    "Relay della maglia e soglie REL",
    "Retransmissões da malha e limiares REL",
    "Mesh-Relais und REL-Schwellen",
    "메시 중계 표시와 REL 임계값"
  ],
  "メッシュのマトリックスで、中継で届く経路を枠で示し、中継後のRELと、その下に中継なしのRELを表示します。%と4段階の切替はメッシュ表にも反映し、段階と印の閾値は「予測条件・宇宙天気」で変更できます。": [
    "In the mesh matrix, links reachable via relay are framed and show the REL after relaying, with the direct REL without relays below. The %/grade toggle now also applies to the mesh tables, and the grade and mark thresholds can be changed under Conditions & space weather.",
    "Dans la matrice de maille, les liaisons atteintes par relais sont encadrées et affichent la REL après relais, avec la REL directe sans relais en dessous. Le choix %/niveaux s’applique aussi aux tableaux de maille, et les seuils se règlent dans Conditions et météo spatiale.",
    "En la matriz de malla, los enlaces alcanzables por relevo se enmarcan y muestran la REL tras el relevo, con la REL directa sin relevos debajo. El cambio %/niveles también se aplica a las tablas de malla, y los umbrales se ajustan en Condiciones y clima espacial.",
    "Nella matrice della maglia, i collegamenti raggiungibili tramite relay sono incorniciati e mostrano la REL dopo il relay, con sotto la REL diretta senza relay. Il passaggio %/livelli vale anche per le tabelle della maglia e le soglie si cambiano in Condizioni e meteo spaziale.",
    "Na matriz da malha, enlaces alcançados por retransmissão ganham moldura e mostram a REL após a retransmissão, com a REL direta sem retransmissão abaixo. A troca %/níveis também vale para as tabelas da malha, e os limiares mudam em Condições e clima espacial.",
    "In der Mesh-Matrix werden über Relais erreichbare Verbindungen gerahmt und zeigen die REL nach Relais, darunter die direkte REL ohne Relais. Die Umschaltung %/Stufen gilt auch für die Mesh-Tabellen; die Schwellen lassen sich unter Bedingungen & Weltraumwetter ändern.",
    "메시 매트릭스에서 중계로 도달하는 경로는 테두리로 표시하고 중계 후 REL과 그 아래 중계 없는 REL을 보여 줍니다. %/단계 전환은 메시 표에도 적용되며, 단계와 점 기준 임계값은 예측 조건·우주 기상에서 바꿀 수 있습니다."
  ],
  "↻の付いたセルは、直通では目標RELに届かないものの、他の拠点で中継すれば各区間が目標REL以上になる経路です。セルには中継後のREL（最も低い区間のREL）と、↻に続けて中継の段数だけを表示します。直通のRELや中継経路の詳細はセルを選ぶと下に表示します。中継局での転送遅延・同時送信の干渉は考慮しません。": [
    "Cells marked ↻ miss the target REL directly but can be reached through other stations with every hop at or above the target REL. The cell shows only the REL after relaying (the weakest hop) and the relay count after ↻. Select the cell to see the direct REL and the relay route below. Forwarding delay at relays and simultaneous-transmission interference are not considered.",
    "Les cellules marquées ↻ n’atteignent pas la REL cible en direct, mais peuvent être atteintes via d’autres stations avec chaque saut au moins à la REL cible. La cellule n’affiche que la REL après relais (le saut le plus faible) et le nombre de relais après ↻. Sélectionnez la cellule pour voir en dessous la REL directe et la route de relais. Le délai de retransmission et les interférences d’émissions simultanées ne sont pas pris en compte.",
    "Las celdas con ↻ no alcanzan la REL objetivo en directo, pero se alcanzan a través de otras estaciones con cada salto igual o superior a la REL objetivo. La celda muestra solo la REL tras el relevo (el salto más débil) y la cantidad de relevos tras ↻. Seleccione la celda para ver debajo la REL directa y la ruta de relevo. No se consideran el retardo de reenvío ni la interferencia por transmisiones simultáneas.",
    "Le celle con ↻ non raggiungono la REL obiettivo in diretta, ma sono raggiungibili tramite altre stazioni con ogni tratta pari o superiore alla REL obiettivo. La cella mostra solo la REL dopo il relay (la tratta più debole) e il numero di relay dopo ↻. Selezionare la cella per vedere sotto la REL diretta e il percorso di relay. Ritardo di inoltro e interferenza da trasmissioni simultanee non sono considerati.",
    "As células com ↻ não atingem a REL alvo diretamente, mas são alcançadas por outras estações com cada salto igual ou acima da REL alvo. A célula mostra apenas a REL após a retransmissão (o salto mais fraco) e a quantidade de retransmissões após ↻. Selecione a célula para ver abaixo a REL direta e a rota de retransmissão. Atraso de encaminhamento e interferência de transmissões simultâneas não são considerados.",
    "Mit ↻ markierte Zellen verfehlen die Ziel-REL direkt, sind aber über andere Stationen erreichbar, wobei jeder Abschnitt die Ziel-REL erreicht. Die Zelle zeigt nur die REL nach Relais (den schwächsten Abschnitt) und nach ↻ die Anzahl der Relais. Wählen Sie die Zelle, um darunter die direkte REL und die Relaisroute zu sehen. Weiterleitungsverzögerung und Störungen durch gleichzeitiges Senden werden nicht berücksichtigt.",
    "↻ 표시 셀은 직접으로는 목표 REL에 못 미치지만, 다른 거점을 중계하면 모든 구간이 목표 REL 이상이 되는 경로입니다. 셀에는 중계 후 REL(가장 낮은 구간의 REL)과 ↻ 뒤의 중계 단수만 표시합니다. 셀을 선택하면 아래에 직접 REL과 중계 경로를 표시합니다. 중계국의 전달 지연과 동시 송신 간섭은 고려하지 않습니다."
  ],
  "吸収モード": [
    "Absorption mode",
    "Mode d’absorption",
    "Modo de absorción",
    "Modalità di assorbimento",
    "Modo de absorção",
    "Absorptionsmodus",
    "흡수 모드"
  ],
  "a：Marine互換（Alexの改良＋IONCAPの吸収）": [
    "a: Marine-compatible (Alex’s changes + IONCAP absorption)",
    "a : compatible Marine (modifications d’Alex + absorption IONCAP)",
    "a: compatible con Marine (cambios de Alex + absorción IONCAP)",
    "a: compatibile con Marine (modifiche di Alex + assorbimento IONCAP)",
    "a: compatível com Marine (alterações de Alex + absorção IONCAP)",
    "a: Marine-kompatibel (Alex’ Änderungen + IONCAP-Absorption)",
    "a: Marine 호환 (Alex 수정 + IONCAP 흡수)"
  ],
  "W：VOACAP標準（吸収指数の下限あり）": [
    "W: VOACAP default (floor on the absorption index)",
    "W : VOACAP standard (plancher de l’indice d’absorption)",
    "W: VOACAP estándar (mínimo del índice de absorción)",
    "W: VOACAP standard (minimo dell’indice di assorbimento)",
    "W: VOACAP padrão (mínimo do índice de absorção)",
    "W: VOACAP-Standard (Untergrenze des Absorptionsindex)",
    "W: VOACAP 표준 (흡수 지수 하한 있음)"
  ],
  "吸収モードは計算エンジンの夜間吸収とMUF変動の扱いです。aはVOACAP Online Marineと同じ値になります。Wは夜間の低い周波数で受信電力が低めに出ます。": [
    "The absorption mode sets how the engine treats night-time absorption and MUF variability. a gives the same values as VOACAP Online Marine. W gives lower signals at low frequencies at night.",
    "Le mode d’absorption règle le traitement de l’absorption nocturne et de la variabilité de la MUF. a donne les mêmes valeurs que VOACAP Online Marine. W donne des signaux plus faibles la nuit aux basses fréquences.",
    "El modo de absorción define cómo trata el motor la absorción nocturna y la variabilidad de la MUF. a da los mismos valores que VOACAP Online Marine. W da señales más bajas de noche en frecuencias bajas.",
    "La modalità di assorbimento definisce come il motore tratta l’assorbimento notturno e la variabilità della MUF. a dà gli stessi valori di VOACAP Online Marine. W dà segnali più bassi di notte alle basse frequenze.",
    "O modo de absorção define como o motor trata a absorção noturna e a variabilidade da MUF. a dá os mesmos valores que o VOACAP Online Marine. W dá sinais mais baixos à noite nas frequências baixas.",
    "Der Absorptionsmodus legt fest, wie die Engine nächtliche Absorption und MUF-Schwankung behandelt. a liefert dieselben Werte wie VOACAP Online Marine. W liefert nachts bei niedrigen Frequenzen schwächere Signale.",
    "흡수 모드는 계산 엔진의 야간 흡수와 MUF 변동 처리 방식입니다. a는 VOACAP Online Marine과 같은 값을 냅니다. W는 야간 낮은 주파수에서 수신 전력이 낮게 나옵니다."
  ],
  "a（Marine互換）": [
    "a (Marine-compatible)",
    "a (compatible Marine)",
    "a (compatible con Marine)",
    "a (compatibile con Marine)",
    "a (compatível com Marine)",
    "a (Marine-kompatibel)",
    "a (Marine 호환)"
  ],
  "W（VOACAP標準）": [
    "W (VOACAP default)",
    "W (VOACAP standard)",
    "W (VOACAP estándar)",
    "W (VOACAP standard)",
    "W (VOACAP padrão)",
    "W (VOACAP-Standard)",
    "W (VOACAP 표준)"
  ],
  "吸収モードの選択": [
    "Absorption mode choice",
    "Choix du mode d’absorption",
    "Selección del modo de absorción",
    "Scelta della modalità di assorbimento",
    "Escolha do modo de absorção",
    "Wahl des Absorptionsmodus",
    "흡수 모드 선택"
  ],
  "計算エンジンの吸収モードを予測条件の詳細条件で選べるようにし、既定をVOACAP Online Marineと同じ a にしました。従来の値は W で再現できます。": [
    "You can now choose the engine’s absorption mode under the detailed prediction conditions. The default is a, the same as VOACAP Online Marine. Choose W to reproduce earlier results.",
    "Le mode d’absorption du moteur se choisit désormais dans les conditions détaillées. Par défaut a, comme VOACAP Online Marine. W reproduit les résultats antérieurs.",
    "Ahora puede elegir el modo de absorción del motor en las condiciones detalladas. El predeterminado es a, igual que VOACAP Online Marine. W reproduce los resultados anteriores.",
    "Ora si può scegliere la modalità di assorbimento del motore nelle condizioni dettagliate. Il predefinito è a, come VOACAP Online Marine. W riproduce i risultati precedenti.",
    "Agora é possível escolher o modo de absorção do motor nas condições detalhadas. O padrão é a, igual ao VOACAP Online Marine. W reproduz os resultados anteriores.",
    "Der Absorptionsmodus der Engine ist jetzt in den Detailbedingungen wählbar. Standard ist a wie bei VOACAP Online Marine. Mit W lassen sich frühere Ergebnisse reproduzieren.",
    "예측 조건의 상세 조건에서 계산 엔진의 흡수 모드를 선택할 수 있습니다. 기본값은 VOACAP Online Marine과 같은 a입니다. 이전 결과는 W로 재현할 수 있습니다."
  ],
  "計算用SSN": [
    "Calculation SSN",
    "SSN de calcul",
    "SSN de cálculo",
    "SSN di calcolo",
    "SSN de cálculo",
    "Berechnungs-SSN",
    "계산용 SSN"
  ],
  "公表値の0.7倍": [
    "0.7 × published value",
    "0,7 × valeur publiée",
    "0,7 × valor publicado",
    "0,7 × valore pubblicato",
    "0,7 × valor publicado",
    "0,7 × veröffentlichter Wert",
    "공표값의 0.7배"
  ],
  "SSNの換算と要求SNRの例示値": [
    "SSN conversion and example required SNR",
    "Conversion du SSN et SNR requis d’exemple",
    "Conversión del SSN y SNR requerida de ejemplo",
    "Conversione del SSN e SNR richiesto di esempio",
    "Conversão do SSN e SNR exigida de exemplo",
    "SSN-Umrechnung und Beispielwerte der erforderlichen SNR",
    "SSN 환산과 요구 SNR 예시값"
  ],
  "NOAAの平滑SSNを0.7倍して計算に使うようにしました（VOACAP Online Marineと同じ換算）。結果には公表値と換算後の値を記録します。電波型式A1A・J3E・A3Eの要求SNRの例示値も、Marineと同じ19・39・48 dB·Hzにしました。": [
    "The NOAA smoothed SSN is now multiplied by 0.7 for the calculation (the same conversion as VOACAP Online Marine). Results record both the published and the converted value. The example required SNR for the A1A, J3E and A3E emission classes is now 19, 39 and 48 dB·Hz, the same as Marine.",
    "Le SSN lissé NOAA est désormais multiplié par 0,7 pour le calcul (même conversion que VOACAP Online Marine). Les résultats enregistrent la valeur publiée et la valeur convertie. Le SNR requis d’exemple pour les classes A1A, J3E et A3E est désormais de 19, 39 et 48 dB·Hz, comme Marine.",
    "El SSN suavizado de NOAA ahora se multiplica por 0,7 para el cálculo (la misma conversión que VOACAP Online Marine). Los resultados registran el valor publicado y el convertido. La SNR requerida de ejemplo para las clases A1A, J3E y A3E es ahora 19, 39 y 48 dB·Hz, como en Marine.",
    "L’SSN livellato NOAA viene ora moltiplicato per 0,7 nel calcolo (la stessa conversione di VOACAP Online Marine). I risultati registrano il valore pubblicato e quello convertito. L’SNR richiesto di esempio per le classi A1A, J3E e A3E è ora 19, 39 e 48 dB·Hz, come in Marine.",
    "O SSN suavizado da NOAA agora é multiplicado por 0,7 no cálculo (a mesma conversão do VOACAP Online Marine). Os resultados registram o valor publicado e o convertido. A SNR exigida de exemplo para as classes A1A, J3E e A3E agora é 19, 39 e 48 dB·Hz, como no Marine.",
    "Die geglättete NOAA-SSN wird für die Berechnung jetzt mit 0,7 multipliziert (dieselbe Umrechnung wie VOACAP Online Marine). Ergebnisse speichern den veröffentlichten und den umgerechneten Wert. Die Beispielwerte der erforderlichen SNR für A1A, J3E und A3E sind jetzt 19, 39 und 48 dB·Hz, wie bei Marine.",
    "NOAA 평활 SSN을 0.7배하여 계산에 사용하도록 했습니다(VOACAP Online Marine과 같은 환산). 결과에는 공표값과 환산값을 기록합니다. 전파 형식 A1A·J3E·A3E의 요구 SNR 예시값도 Marine과 같은 19·39·48 dB·Hz로 했습니다."
  ],
  "今月の回線を詰めるときは実効SSN、来月以降の計画や12か月予測にはNOAA（公表値×0.7）を使います。": [
    "Use the effective SSN to fine-tune this month’s circuits, and NOAA (published value × 0.7) for planning next month onward and for the 12-month forecast.",
    "Utilisez le SSN effectif pour affiner les liaisons de ce mois, et NOAA (valeur publiée × 0,7) pour planifier à partir du mois prochain et pour la prévision sur 12 mois.",
    "Use el SSN efectivo para ajustar los circuitos de este mes, y NOAA (valor publicado × 0,7) para planificar desde el próximo mes y para la predicción de 12 meses.",
    "Usare l’SSN effettivo per affinare i collegamenti di questo mese, e NOAA (valore pubblicato × 0,7) per pianificare dal mese prossimo e per la previsione a 12 mesi.",
    "Use o SSN efetivo para ajustar os circuitos deste mês, e NOAA (valor publicado × 0,7) para planejar a partir do próximo mês e para a previsão de 12 meses.",
    "Für die Feinabstimmung der Verbindungen dieses Monats die effektive SSN verwenden, für die Planung ab nächstem Monat und die 12-Monats-Prognose NOAA (veröffentlichter Wert × 0,7).",
    "이번 달 회선을 조정할 때는 실효 SSN을, 다음 달 이후 계획과 12개월 예측에는 NOAA(공표값×0.7)를 사용합니다."
  ],
  "表示する予測": [
    "Forecast shown",
    "Prévision affichée",
    "Predicción mostrada",
    "Previsione mostrata",
    "Previsão exibida",
    "Angezeigte Prognose",
    "표시할 예측"
  ],
  "回線マップの表示時刻（UTC）": [
    "Circuit map display time (UTC)",
    "Heure affichée sur la carte du circuit (UTC)",
    "Hora mostrada en el mapa del circuito (UTC)",
    "Ora mostrata sulla mappa del collegamento (UTC)",
    "Hora exibida no mapa do circuito (UTC)",
    "Anzeigezeit der Verbindungskarte (UTC)",
    "회선 지도 표시 시각 (UTC)"
  ],
  "回線マップの時刻スライダー": [
    "Time slider on the circuit map",
    "Curseur horaire sur la carte du circuit",
    "Control deslizante de hora en el mapa del circuito",
    "Cursore orario sulla mappa del collegamento",
    "Controle deslizante de hora no mapa do circuito",
    "Zeitschieberegler auf der Verbindungskarte",
    "회선 지도의 시각 슬라이더"
  ],
  "24時間予測・ダイバーシティー予測・メッシュ予測のタブでは、回線マップの下にUTCのスライダーと再生・停止ボタンを表示します。時刻を動かすと、地図の経路の色とRELの表示がその時刻に切り替わります。": [
    "On the 24-hour forecast, Diversity forecast and Mesh forecast tabs, a UTC slider and a play/stop button appear below the circuit map. Moving the time switches the path colours and REL labels on the map to that hour.",
    "Dans les onglets Prévision sur 24 h, Prévision de diversité et Prévision maillée, un curseur UTC et un bouton lecture/arrêt s’affichent sous la carte du circuit. En déplaçant l’heure, les couleurs des trajets et l’affichage REL de la carte passent à cette heure.",
    "En las pestañas Predicción de 24 horas, Predicción de diversidad y Predicción de malla, se muestran un control deslizante UTC y un botón de reproducir/detener bajo el mapa del circuito. Al mover la hora, los colores de los trayectos y el REL del mapa cambian a esa hora.",
    "Nelle schede Previsione di 24 ore, Previsione di diversità e Previsione mesh, sotto la mappa del collegamento compaiono un cursore UTC e un pulsante riproduci/ferma. Spostando l’ora, i colori dei percorsi e il REL sulla mappa passano a quell’ora.",
    "Nas abas Previsão de 24 horas, Previsão de diversidade e Previsão de malha, um controle deslizante UTC e um botão reproduzir/parar aparecem abaixo do mapa do circuito. Ao mover a hora, as cores dos trajetos e o REL no mapa mudam para essa hora.",
    "Auf den Reitern 24-Stunden-Prognose, Diversity-Prognose und Mesh-Prognose erscheinen unter der Verbindungskarte ein UTC-Schieberegler und eine Start/Stopp-Taste. Beim Verschieben der Zeit wechseln Pfadfarben und REL-Anzeige der Karte auf diese Stunde.",
    "24시간 예측, 다이버시티 예측, 메시 예측 탭에서는 회선 지도 아래에 UTC 슬라이더와 재생·정지 버튼을 표시합니다. 시각을 움직이면 지도의 경로 색과 REL 표시가 그 시각으로 바뀝니다."
  ],
  "VOACAPのエリア計算で、TXから範囲内の各格子点までの信号強度・SNR・信頼度を計算します。受信側はRX1のアンテナ・雑音を使います。地図には等値線で区切った色の範囲で表示します。": [
    "VOACAP area coverage computes signal strength, SNR and reliability from the TX to every grid point in the range, using RX1’s antenna and noise at the receiver. The map shows the result as colour bands separated by contour lines.",
    "Le calcul de zone VOACAP calcule la force du signal, le SNR et la fiabilité du TX vers chaque point de la grille, avec l’antenne et le bruit de RX1 en réception. La carte affiche des plages de couleur séparées par des isolignes.",
    "El cálculo de área de VOACAP obtiene la intensidad de señal, el SNR y la fiabilidad desde el TX hasta cada punto de la cuadrícula, con la antena y el ruido de RX1 en recepción. El mapa muestra bandas de color separadas por isolíneas.",
    "Il calcolo d’area VOACAP ricava intensità del segnale, SNR e affidabilità dal TX a ogni punto della griglia, con antenna e rumore di RX1 in ricezione. La mappa mostra fasce di colore separate da isolinee.",
    "O cálculo de área do VOACAP obtém a intensidade do sinal, o SNR e a confiabilidade do TX até cada ponto da grelha, com a antena e o ruído de RX1 na receção. O mapa mostra faixas de cor separadas por isolinhas.",
    "Die VOACAP-Flächenberechnung ermittelt Signalstärke, SNR und Zuverlässigkeit vom TX zu jedem Gitterpunkt im Bereich, mit Antenne und Rauschen von RX1 beim Empfang. Die Karte zeigt Farbbänder, getrennt durch Isolinien.",
    "VOACAP 영역 계산으로 TX에서 범위 내 각 격자점까지의 신호 강도·SNR·신뢰도를 계산합니다. 수신 측은 RX1의 안테나·잡음을 사용합니다. 지도에는 등치선으로 구분한 색 범위로 표시합니다."
  ],
  "範囲": [
    "Range",
    "Zone",
    "Rango",
    "Area",
    "Área",
    "Bereich",
    "범위"
  ],
  "全世界": [
    "Whole world",
    "Monde entier",
    "Todo el mundo",
    "Mondo intero",
    "Mundo inteiro",
    "Ganze Welt",
    "전 세계"
  ],
  "TX中心 120° × 120°": [
    "Around TX 120° × 120°",
    "Autour du TX 120° × 120°",
    "Alrededor del TX 120° × 120°",
    "Attorno al TX 120° × 120°",
    "Em torno do TX 120° × 120°",
    "Um den TX 120° × 120°",
    "TX 중심 120° × 120°"
  ],
  "TX中心 60° × 60°": [
    "Around TX 60° × 60°",
    "Autour du TX 60° × 60°",
    "Alrededor del TX 60° × 60°",
    "Attorno al TX 60° × 60°",
    "Em torno do TX 60° × 60°",
    "Um den TX 60° × 60°",
    "TX 중심 60° × 60°"
  ],
  "TX中心 30° × 30°": [
    "Around TX 30° × 30°",
    "Autour du TX 30° × 30°",
    "Alrededor del TX 30° × 30°",
    "Attorno al TX 30° × 30°",
    "Em torno do TX 30° × 30°",
    "Um den TX 30° × 30°",
    "TX 중심 30° × 30°"
  ],
  "表示": [
    "Show",
    "Affichage",
    "Mostrar",
    "Mostra",
    "Mostrar",
    "Anzeige",
    "표시"
  ],
  "信号強度 S dBW": [
    "Signal strength S dBW",
    "Force du signal S dBW",
    "Intensidad de señal S dBW",
    "Intensità del segnale S dBW",
    "Intensidade do sinal S dBW",
    "Signalstärke S dBW",
    "신호 강도 S dBW"
  ],
  "計算には数秒かかります。完了後に上の地図へ表示します。": [
    "The calculation takes a few seconds; the result then appears on the map above.",
    "Le calcul prend quelques secondes ; le résultat s’affiche ensuite sur la carte.",
    "El cálculo tarda unos segundos; luego el resultado aparece en el mapa.",
    "Il calcolo richiede alcuni secondi; poi il risultato appare sulla mappa.",
    "O cálculo demora alguns segundos; depois o resultado aparece no mapa.",
    "Die Berechnung dauert einige Sekunden; danach erscheint das Ergebnis auf der Karte.",
    "계산에는 몇 초가 걸립니다. 완료되면 위 지도에 표시합니다."
  ],
  "VOACAPのエリア計算でカバー範囲を計算しています。完了までお待ちください。": [
    "Calculating coverage with VOACAP area coverage. Please wait…",
    "Calcul de la couverture par calcul de zone VOACAP. Veuillez patienter…",
    "Calculando la cobertura con el cálculo de área de VOACAP. Espere…",
    "Calcolo della copertura con il calcolo d’area VOACAP. Attendere…",
    "Calculando a cobertura com o cálculo de área do VOACAP. Aguarde…",
    "Abdeckung wird mit der VOACAP-Flächenberechnung berechnet. Bitte warten…",
    "VOACAP 영역 계산으로 커버리지를 계산하는 중입니다. 잠시 기다려 주세요."
  ],
  "カバー範囲の計算が完了しました。地図の色の範囲を選ぶと、その地点の信号強度・SNR・信頼度を確認できます。": [
    "Coverage complete. Select a coloured area on the map for the signal strength, SNR and reliability there.",
    "Couverture calculée. Choisissez une zone colorée pour voir force du signal, SNR et fiabilité.",
    "Cobertura calculada. Seleccione una zona coloreada para ver intensidad de señal, SNR y fiabilidad.",
    "Copertura completata. Seleziona un’area colorata per intensità del segnale, SNR e affidabilità.",
    "Cobertura calculada. Selecione uma área colorida para ver intensidade do sinal, SNR e confiabilidade.",
    "Abdeckung berechnet. Farbigen Bereich wählen für Signalstärke, SNR und Zuverlässigkeit.",
    "커버리지 계산 완료. 지도의 색 범위를 선택하면 그 지점의 신호 강도·SNR·신뢰도를 확인합니다."
  ],
  "{freq} MHz / {hour}:00 UTC / {label} / {size}×{size}格子 · TXから各格子点までのVOACAPエリア計算。格子点の間は補間して色分けしています": [
    "{freq} MHz / {hour}:00 UTC / {label} / {size}×{size} grid · VOACAP area coverage from the TX to each grid point, interpolated between grid points into colour bands",
    "{freq} MHz / {hour}:00 UTC / {label} / grille {size}×{size} · Calcul de zone VOACAP du TX vers chaque point, interpolé entre les points en plages de couleur",
    "{freq} MHz / {hour}:00 UTC / {label} / cuadrícula {size}×{size} · Cálculo de área VOACAP del TX a cada punto, interpolado entre puntos en bandas de color",
    "{freq} MHz / {hour}:00 UTC / {label} / griglia {size}×{size} · Calcolo d’area VOACAP dal TX a ogni punto, interpolato tra i punti in fasce di colore",
    "{freq} MHz / {hour}:00 UTC / {label} / grelha {size}×{size} · Cálculo de área VOACAP do TX a cada ponto, interpolado entre pontos em faixas de cor",
    "{freq} MHz / {hour}:00 UTC / {label} / Gitter {size}×{size} · VOACAP-Flächenberechnung vom TX zu jedem Gitterpunkt, zwischen den Punkten zu Farbbändern interpoliert",
    "{freq} MHz / {hour}:00 UTC / {label} / {size}×{size} 격자 · TX에서 각 격자점까지 VOACAP 영역 계산, 격자점 사이는 보간해 색으로 구분"
  ],
  "RX1のアンテナは全格子点で、RX1からTXへの方位に向けています": [
    "RX1’s antenna points along the RX1-to-TX bearing at every grid point.",
    "L’antenne de RX1 vise, en chaque point, le relèvement de RX1 vers le TX.",
    "La antena de RX1 apunta en cada punto al rumbo de RX1 hacia el TX.",
    "L’antenna di RX1 punta in ogni punto lungo la direzione da RX1 al TX.",
    "A antena de RX1 aponta, em cada ponto, no rumo de RX1 para o TX.",
    "Die RX1-Antenne zeigt an jedem Gitterpunkt in Richtung RX1→TX.",
    "RX1 안테나는 모든 격자점에서 RX1→TX 방위로 향합니다."
  ],
  "カバー範囲をVOACAPのエリア計算で面表示": [
    "Coverage as an area with VOACAP area calculation",
    "Couverture en zone avec le calcul de zone VOACAP",
    "Cobertura como zona con el cálculo de área de VOACAP",
    "Copertura come area con il calcolo d’area VOACAP",
    "Cobertura como área com o cálculo de área do VOACAP",
    "Abdeckung als Fläche mit der VOACAP-Flächenberechnung",
    "VOACAP 영역 계산으로 커버리지를 면으로 표시"
  ],
  "「カバー範囲」をVOACAPのエリア計算に変えました。TXから全世界または TX中心の範囲の各格子点（最大181×181）までを1回で計算し、VOACAPのS dBW地図のように、信号強度（Sメーター）・SNR・RELを等値線で区切った色の範囲で地図に表示します。受信側はRX1のアンテナ・雑音を使います。地図を選ぶとその地点の値を表示します。": [
    "“Coverage” now uses VOACAP area coverage. One run computes every grid point (up to 181×181) from the TX over the whole world or a range around the TX, and the map shows signal strength (S-meter), SNR or REL as colour bands separated by contour lines, like VOACAP’s S dBW maps. The receiver uses RX1’s antenna and noise. Select the map to see the values at that point.",
    "La « Couverture » utilise désormais le calcul de zone VOACAP. Un seul calcul couvre chaque point de grille (jusqu’à 181×181) depuis le TX, sur le monde entier ou une zone autour du TX, et la carte affiche la force du signal (S-mètre), le SNR ou la REL en plages de couleur séparées par des isolignes, comme les cartes S dBW de VOACAP. La réception utilise l’antenne et le bruit de RX1. Choisissez la carte pour voir les valeurs en ce point.",
    "La «Cobertura» usa ahora el cálculo de área de VOACAP. Un solo cálculo cubre cada punto de la cuadrícula (hasta 181×181) desde el TX, en todo el mundo o en un rango alrededor del TX, y el mapa muestra la intensidad de señal (S-meter), el SNR o la REL en bandas de color separadas por isolíneas, como los mapas S dBW de VOACAP. La recepción usa la antena y el ruido de RX1. Seleccione el mapa para ver los valores en ese punto.",
    "La «Copertura» usa ora il calcolo d’area VOACAP. Un solo calcolo copre ogni punto della griglia (fino a 181×181) dal TX, sul mondo intero o su un’area attorno al TX, e la mappa mostra intensità del segnale (S-meter), SNR o REL in fasce di colore separate da isolinee, come le mappe S dBW di VOACAP. La ricezione usa antenna e rumore di RX1. Seleziona la mappa per vedere i valori in quel punto.",
    "A «Cobertura» passa a usar o cálculo de área do VOACAP. Um só cálculo cobre cada ponto da grelha (até 181×181) desde o TX, no mundo inteiro ou numa área em torno do TX, e o mapa mostra a intensidade do sinal (S-meter), o SNR ou a REL em faixas de cor separadas por isolinhas, como os mapas S dBW do VOACAP. A receção usa a antena e o ruído de RX1. Selecione o mapa para ver os valores nesse ponto.",
    "„Abdeckung“ nutzt jetzt die VOACAP-Flächenberechnung. Ein Lauf berechnet jeden Gitterpunkt (bis 181×181) vom TX aus, weltweit oder in einem Bereich um den TX, und die Karte zeigt Signalstärke (S-Meter), SNR oder REL als Farbbänder mit Isolinien, wie die S-dBW-Karten von VOACAP. Der Empfang nutzt Antenne und Rauschen von RX1. Karte wählen, um die Werte an diesem Punkt zu sehen.",
    "'커버리지'를 VOACAP 영역 계산으로 바꿨습니다. TX에서 전 세계 또는 TX 중심 범위의 각 격자점(최대 181×181)까지를 한 번에 계산하고, VOACAP의 S dBW 지도처럼 신호 강도(S미터)·SNR·REL을 등치선으로 구분한 색 범위로 지도에 표시합니다. 수신 측은 RX1의 안테나·잡음을 사용합니다. 지도를 선택하면 그 지점의 값을 표시합니다."
  ],
  "値が入力欄に収まりません": [
    "The value does not fit the input field",
    "La valeur ne tient pas dans le champ",
    "El valor no cabe en el campo",
    "Il valore non entra nel campo",
    "O valor não cabe no campo",
    "Der Wert passt nicht in das Feld",
    "값이 입력란에 맞지 않습니다"
  ],
  "エリア計算の格子が揃いません（{count}/{total}点）": [
    "The area grid is incomplete ({count}/{total} points)",
    "La grille de zone est incomplète ({count}/{total} points)",
    "La cuadrícula de área está incompleta ({count}/{total} puntos)",
    "La griglia d’area è incompleta ({count}/{total} punti)",
    "A grelha de área está incompleta ({count}/{total} pontos)",
    "Das Flächengitter ist unvollständig ({count}/{total} Punkte)",
    "영역 격자가 완전하지 않습니다({count}/{total}점)"
  ],
  "利得表アンテナは方位ごとの切り出しが必要なため、カバー範囲では使えません": [
    "Gain-table antennas need a slice per bearing, so they cannot be used for coverage",
    "Les antennes à table de gain exigent une découpe par azimut et ne sont pas utilisables pour la couverture",
    "Las antenas con tabla de ganancia requieren un corte por rumbo y no se pueden usar en la cobertura",
    "Le antenne a tabella di guadagno richiedono un taglio per direzione e non si possono usare per la copertura",
    "As antenas com tabela de ganho exigem um corte por rumo e não podem ser usadas na cobertura",
    "Antennen mit Gewinntabelle brauchen einen Schnitt je Richtung und sind für die Abdeckung nicht nutzbar",
    "이득표 안테나는 방위별 절단이 필요하므로 커버리지에서는 사용할 수 없습니다"
  ],
  "span: 30・60・120・360（全世界）から選んでください": [
    "span: choose 30, 60, 120 or 360 (whole world)",
    "span : choisir 30, 60, 120 ou 360 (monde entier)",
    "span: elija 30, 60, 120 o 360 (todo el mundo)",
    "span: scegliere 30, 60, 120 o 360 (mondo intero)",
    "span: escolha 30, 60, 120 ou 360 (mundo inteiro)",
    "span: 30, 60, 120 oder 360 (ganze Welt) wählen",
    "span: 30·60·120·360(전 세계) 중에서 선택하세요"
  ]
};
