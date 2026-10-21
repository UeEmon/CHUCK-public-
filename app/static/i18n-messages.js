'use strict';
// Locale order: en, fr, es, it, pt, de, ko. Source keys are Japanese.
const HF_MESSAGES={
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
  "D-RAPと観測局は「予察条件・宇宙天気」タブで取得できます。": [
    "Load D-RAP and stations in Forecast & space weather.",
    "Charger D-RAP et les stations dans Conditions et météo spatiale.",
    "Cargue D-RAP y estaciones en Condiciones y clima espacial.",
    "Carica D-RAP e stazioni in Condizioni e meteo spaziale.",
    "Carregue D-RAP e estações em Condições e clima espacial.",
    "D-RAP und Messstationen unter Bedingungen und Weltraumwetter laden.",
    "예측 조건·우주 날씨 탭에서 D-RAP 및 관측소를 불러옵니다."
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
  "ダイバーシティー結果": [
    "Diversity results",
    "Résultats de diversité",
    "Resultados de diversidad",
    "Risultati di diversità",
    "Resultados de diversidade",
    "Diversitätsergebnisse",
    "다이버시티 결과"
  ],
  "予察条件・宇宙天気": [
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
  "送信点からの方位": [
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
  "RX1の地点・アンテナ・雑音を使用し、その地点を中心に、最大35地点で信頼度を計算します。補間なしの格子点表示です。": [
    "Uses RX1 location, antenna and noise; up to 35 grid points without interpolation.",
    "Position, antenne et bruit de RX1 ; 35 points maximum sans interpolation.",
    "Usa la ubicación, antena y ruido de RX1; hasta 35 puntos sin interpolación.",
    "Usa posizione, antenna e rumore di RX1; fino a 35 punti senza interpolazione.",
    "Usa posição, antena e ruído de RX1; até 35 pontos sem interpolação.",
    "Nutzt Standort, Antenne und Rauschen von RX1; bis zu 35 Gitterpunkte ohne Interpolation.",
    "RX1의 위치·안테나·잡음으로 최대 35개 격자점을 계산합니다. 보간하지 않습니다."
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
  "範囲（緯度・経度幅）": [
    "Extent (latitude / longitude)",
    "Étendue (latitude / longitude)",
    "Extensión (latitud / longitud)",
    "Estensione (latitudine / longitudine)",
    "Extensão (latitude / longitude)",
    "Bereich (Breite / Länge)",
    "범위(위도·경도)"
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
  "計算には時間がかかります。完了後に上の地図へ表示します。": [
    "Calculation may take time. Results appear on the map.",
    "Le calcul peut prendre du temps. Les résultats apparaissent sur la carte.",
    "El cálculo puede tardar. Los resultados aparecen en el mapa.",
    "Il calcolo può richiedere tempo. I risultati appaiono sulla mappa.",
    "O cálculo pode demorar. Os resultados aparecem no mapa.",
    "Die Berechnung kann dauern. Ergebnisse erscheinen auf der Karte.",
    "계산에 시간이 걸릴 수 있습니다. 완료 후 지도에 표시합니다."
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
  "共通の予察条件": [
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
  "要求信頼度 %": [
    "Target reliability %",
    "Fiabilité cible %",
    "Fiabilidad objetivo %",
    "Affidabilità obiettivo %",
    "Confiabilidade alvo %",
    "Zielzuverlässigkeit %",
    "목표 신뢰도 %"
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
  "単一RX · 地点間予察": [
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
  "地域カバー範囲を計算しています。最大35地点の処理が完了するまでお待ちください。": [
    "Calculating regional coverage at up to 35 points…",
    "Calcul de couverture régionale sur 35 points maximum…",
    "Calculando cobertura regional en hasta 35 puntos…",
    "Calcolo della copertura regionale su un massimo di 35 punti…",
    "Calculando cobertura regional em até 35 pontos…",
    "Regionale Abdeckung an bis zu 35 Punkten wird berechnet…",
    "최대 35개 지점의 지역 커버리지를 계산하는 중…"
  ],
  "カバー範囲の計算が完了しました。地図の丸を選ぶと地点と信頼度を確認できます。": [
    "Coverage complete. Select map circles for location and reliability.",
    "Couverture calculée. Choisir les cercles pour le lieu et la fiabilité.",
    "Cobertura calculada. Seleccione círculos para ubicación y fiabilidad.",
    "Copertura completata. Seleziona i cerchi per località e affidabilità.",
    "Cobertura calculada. Selecione círculos para local e confiabilidade.",
    "Abdeckung berechnet. Kartenkreise für Standort und Zuverlässigkeit wählen.",
    "커버리지 계산 완료. 지도 원을 선택하면 지점과 신뢰도를 확인합니다."
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
  "{freq} MHz / {hour}:00 UTC / {count}地点 · 丸の色はREL（0〜100%）、灰色は計算値なし": [
    "{freq} MHz / {hour}:00 UTC / {count} points · Circle color: REL 0–100%; gray: no value",
    "{freq} MHz / {hour}:00 UTC / {count} points · Couleur : REL 0–100 % ; gris : absent",
    "{freq} MHz / {hour}:00 UTC / {count} puntos · Color: REL 0–100%; gris: sin valor",
    "{freq} MHz / {hour}:00 UTC / {count} punti · Colore: REL 0–100%; grigio: nessun valore",
    "{freq} MHz / {hour}:00 UTC / {count} pontos · Cor: REL 0–100%; cinza: sem valor",
    "{freq} MHz / {hour}:00 UTC / {count} Punkte · Farbe: REL 0–100 %; Grau: kein Wert",
    "{freq} MHz / {hour}:00 UTC / {count}개 지점·원 색상: REL 0~100%, 회색: 값 없음"
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
  "国内観測: {value}": [
    "Japan observations: {value}",
    "Observations au Japon : {value}",
    "Observaciones de Japón: {value}",
    "Osservazioni del Giappone: {value}",
    "Observações do Japão: {value}",
    "Japanische Messungen: {value}",
    "일본 관측: {value}"
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
  "計算結果": [
    "Calculation results",
    "Résultats du calcul",
    "Resultados del cálculo",
    "Risultati del calcolo",
    "Resultados do cálculo",
    "Berechnungsergebnisse",
    "계산 결과"
  ],
  "単一RXの結果": [
    "Single RX results",
    "Résultats RX unique",
    "Resultados de un RX",
    "Risultati RX singolo",
    "Resultados de um RX",
    "Ergebnisse eines RX",
    "단일 RX 결과"
  ],
  "複数RXの結果": [
    "Multiple RX results",
    "Résultats multi-RX",
    "Resultados de varios RX",
    "Risultati multi-RX",
    "Resultados de vários RX",
    "Ergebnisse mehrerer RX",
    "다중 RX 결과"
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
  "メッシュ結果": [
    "Mesh results",
    "Résultats maillés",
    "Resultados de malla",
    "Risultati mesh",
    "Resultados de malha",
    "Mesh-Ergebnisse",
    "메시 결과"
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
  "RELは月間統計であり、瞬時の受信可否ではありません。中継（多段ホップ）・同時送信の干渉・チャネル割当は評価しません。": [
    "REL is a monthly statistic, not instantaneous reception. Relaying (multi-hop), simultaneous-transmission interference and channel assignment are not evaluated.",
    "La REL est une statistique mensuelle, pas une réception instantanée. Le relais (multi-sauts), les interférences d’émissions simultanées et l’attribution des canaux ne sont pas évalués.",
    "REL es una estadística mensual, no la recepción instantánea. No se evalúan el relevo (multisalto), la interferencia por transmisiones simultáneas ni la asignación de canales.",
    "La REL è una statistica mensile, non la ricezione istantanea. Il relay (multi-hop), l’interferenza da trasmissioni simultanee e l’assegnazione dei canali non sono valutati.",
    "REL é uma estatística mensal, não a recepção instantânea. Retransmissão (multissalto), interferência de transmissões simultâneas e atribuição de canais não são avaliadas.",
    "REL ist eine Monatsstatistik, kein momentaner Empfang. Weiterleitung (Multi-Hop), Störungen durch gleichzeitiges Senden und Kanalzuteilung werden nicht bewertet.",
    "REL은 월간 통계이며 순간 수신 여부가 아닙니다. 중계(다중 홉), 동시 송신 간섭, 채널 할당은 평가하지 않습니다."
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
  "スライダーで時刻を動かすと、マトリックス全体がその時刻に切り替わります。最良周波数では、セルの下段にREL最大の周波数（MHz）を表示します。点は目標REL以上、灰色は欠測です。セルを選ぶと下にその経路の24時間を表示します。": [
    "Moving the slider switches the whole matrix to that hour. With Best frequency, the lower line of each cell shows the frequency (MHz) with the highest REL. A dot marks the target REL or above; grey is missing data. Select a cell to show that link's 24 hours below.",
    "Le curseur fait passer toute la matrice à l’heure choisie. En mode Meilleure fréquence, la ligne inférieure de chaque cellule indique la fréquence (MHz) de REL maximale. Un point signale la REL cible atteinte ; le gris indique une donnée manquante. Sélectionnez une cellule pour afficher les 24 heures de cette liaison.",
    "Al mover el control, toda la matriz cambia a esa hora. Con Mejor frecuencia, la línea inferior de cada celda muestra la frecuencia (MHz) de mayor REL. Un punto indica REL objetivo o superior; el gris indica falta de datos. Seleccione una celda para ver las 24 horas de ese enlace.",
    "Spostando il cursore l’intera matrice passa a quell’ora. Con Frequenza migliore, la riga inferiore di ogni cella mostra la frequenza (MHz) con REL massima. Un punto indica REL obiettivo o superiore; il grigio indica dati mancanti. Seleziona una cella per vedere sotto le 24 ore di quel collegamento.",
    "Ao mover o controle, toda a matriz muda para essa hora. Com Melhor frequência, a linha inferior de cada célula mostra a frequência (MHz) de maior REL. Um ponto indica REL alvo ou superior; cinza indica dado ausente. Selecione uma célula para ver abaixo as 24 horas desse enlace.",
    "Mit dem Schieberegler wechselt die gesamte Matrix auf diese Stunde. Bei Beste Frequenz zeigt die untere Zeile jeder Zelle die Frequenz (MHz) mit der höchsten REL. Ein Punkt markiert Ziel-REL oder höher, Grau fehlende Daten. Eine Zelle wählen, um darunter die 24 Stunden dieser Verbindung zu sehen.",
    "슬라이더를 움직이면 매트릭스 전체가 해당 시각으로 바뀝니다. 최적 주파수에서는 각 셀 아래 줄에 REL이 가장 높은 주파수(MHz)를 표시합니다. 점은 목표 REL 이상, 회색은 결측입니다. 셀을 선택하면 아래에 그 경로의 24시간을 표시합니다."
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
  "メッシュ {n}拠点 · {count}組（短経路）": [
    "Mesh · {n} stations · {count} pairs (short path)",
    "Maillage · {n} stations · {count} paires (trajet court)",
    "Malla · {n} estaciones · {count} pares (trayecto corto)",
    "Mesh · {n} stazioni · {count} coppie (percorso breve)",
    "Malha · {n} estações · {count} pares (caminho curto)",
    "Mesh · {n} Stationen · {count} Paare (kurzer Weg)",
    "메시 {n}거점 · {count}쌍(단경로)"
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
  ]
};
