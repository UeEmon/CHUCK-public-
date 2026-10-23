<p align="center"><img src="docs/images/chuck-icon.png" alt="CHUCK" width="140"></p>

# CHUCK

**C**overage & **H**F **U**sability **C**alculation **K**it

[日本語](README.md) | [English](README.en.md) | [Français](README.fr.md) | [Español](README.es.md) | [Italiano](README.it.md) | [Português](README.pt.md) | [Deutsch](README.de.md) | 한국어

CHUCK(Coverage & HF Usability Calculation Kit)는 공개 VOACAP 엔진을 사용하는 HF 전파 예측 웹 애플리케이션입니다. 외부 번역 API 없이 8개 언어를 지원합니다. Marine 사이트의 화면, JavaScript 및 서버 코드는 사용하지 않습니다.

이 안내는 설치, 주요 기능과 제한 사항을 요약합니다. 자세한 기준 문서는 [일본어 README](README.md)이며, 연결된 기술·법률 문서는 원래 언어로 제공됩니다.

## 조작 매뉴얼

일본어 매뉴얼은 23페이지에 Web 화면 24장을 수록하며 예측, 게이트웨이, AI/OCR 설정을 설명합니다. [PDF](docs/manual/CHUCK_Operation_Manual_ja.pdf) / [Word](docs/manual/CHUCK_Operation_Manual_ja.docx). 기준 버전은 `e790327`이며 이후 변경 사항은 최신 문서를 확인하십시오.

## 시작

Docker Desktop(Windows/macOS) 또는 Docker Engine과 Compose v2(Linux)를 설치한 후 실행합니다.

```sh
git clone https://github.com/UeEmon/CHUCK-public-.git
cd CHUCK-public-
docker compose up -d --build
```

**http://localhost:18082**에 접속합니다. macOS/Linux에서는 `sh Start.sh`, Windows PowerShell에서는 `./Start.ps1`도 사용할 수 있습니다. 최초 빌드에는 인터넷이 필요합니다. 엔진 소스와 지도 데이터가 포함되어 있어 빌드 후 수동 계산과 지도 표시는 오프라인으로 가능합니다. 외부 데이터와 클라우드 OCR에는 연결이 필요합니다.

```sh
docker compose down
docker compose logs --tail=100 -f
```

일반적인 중지·재빌드 후에도 기록과 프리셋은 `hf-data` 볼륨에 유지됩니다. `docker compose down -v`는 게이트웨이 데이터를 포함한 영구 볼륨을 삭제하므로 필요한 결과를 먼저 내보내십시오.

## 기능과 사용법

- 지도를 드래그하여 이동하고 휠/엄지 휠로 확대·축소합니다. 경도 180°를 넘어 이동할 수 있습니다. 클릭으로 TX/RX 위치가 바뀌지 않습니다.
- 오른쪽에서 프리셋으로 TX 1개와 RX 1~8개를 선택합니다. 특정 RX와 TX를 서로 바꿀 수 있으며, RX가 2개 이상이면 다이버시티 예측을 수행합니다.
- 위치와 안테나 프리셋은 별도 화면에서 편집합니다. 북미·동아시아·유럽 주요 도시의 초기 좌표는 실제 무선국이 아닌 도시 중심 부근의 근삿값입니다.
- 대상 월, 평활 흑점수(SSN), 출력, 2~30 MHz 중 최대 11개 주파수, 안테나, 잡음, 요구 SNR·신뢰도를 설정합니다.
- 지도 아래 탭에서 24시간 예측(CCIR/Method 30), 다이버시티, 지역 커버리지(최대 35개 독립 지점)를 확인합니다. 히트맵 셀을 선택하면 UTC별 상세와 권장 주파수가 표시됩니다.
- Propagation Chart는 REL/SNR, 경로별 MUF, RX 선택 및 SVG 저장을 제공합니다. SQLite 기록, CSV/JSON, VOACAP 원본 입출력도 지원합니다.
- 메시 모드는 2~8개 거점의 모든 쌍을 양방향으로 계산하고 주파수별 REL을 TX × RX 매트릭스로 표시합니다. UTC 슬라이더와 거점별 출력·안테나·잡음 설정을 제공하며 ↻ 표시 셀은 모든 구간이 목표 REL 이상인 1~2단 중계로 도달할 수 있는 경로이며, 중계 지연과 간섭은 모델링하지 않습니다. [메시](docs/MESH.md) 참조.
- 24시간 예측 아래의 24시간 운용 주파수 계획은 계산한 주파수로 전환이 가장 적은(또는 매시 최적) 시간대별 계획을 만들고 CSV 출력과 인쇄를 지원합니다. [주파수 계획](docs/FREQUENCY_PLAN.md) 참조.
- 12개월 전망은 선택한 달부터 12개월 동안 TX→RX1을 계산해 REL을 월 × UTC 표로 보여 줍니다(수동 SSN은 모든 달 공통, NOAA는 달마다의 평활 SSN). [전망](docs/ANNUAL.md) 참조.
- 필요 송신 전력은 TX→RX1을 10 W에서 10 kW까지 1-2-5의 10단계로 계산해, UTC·주파수별로 목표 REL에 도달하는 최소 전력을 보여 줍니다. [필요 송신 전력](docs/POWER.md) 참조.
- 거점 후보는 등록된 지점 최대 10곳을 수신 지점(TX→후보) 또는 중계 지점(TX→후보→RX1)으로 보고 목표 REL 이상 시간 수로 순위를 매깁니다. [거점 후보](docs/SITES.md) 참조.
- 정기 재계산은 저장한 지점 간 예측을 NOAA 최신 평활 SSN으로 다시 계산하고(기본 24시간마다, `HF_WATCH_INTERVAL_HOURS`), 목표 REL 이상 시간 수가 줄면 알립니다. 공개판 방문자는 사용할 수 없습니다. [정기 재계산](docs/WATCH.md) 참조.
- 단일 RX 결과의 '보고서 인쇄'는 조건, 시각별 추천 주파수, 히트맵, 24시간 주파수 계획을 한 페이지로 엽니다(인쇄 대화 상자에서 PDF로 저장 가능). [보고서](docs/REPORT.md) 참조. 커버리지, Propagation Chart, 다이버시티, 메시, 12개월, 필요 송신 전력, 거점 후보 탭도 표시 중인 표와 그림을 같은 방식으로 인쇄합니다.
- 새 기능은 앱 안에서 알립니다. 지난번 방문 이후 추가된 기능을 배너와 탭의 점으로 표시하고, '새 기능 안내'에서 모두 볼 수 있습니다. [새 기능 안내](docs/WHATS_NEW.md) 참조.
- Language에서 일본어·영어·프랑스어·스페인어·이탈리아어·포르투갈어·독일어·한국어를 선택합니다. 사용자가 입력한 이름은 변경하지 않습니다.

입력 변경만으로 기존 결과가 재계산되지 않습니다. 다시 계산하십시오. 위치·안테나는 각각 최대 200개이며 동시 편집 충돌을 감지합니다.

## 외부 데이터·이동국·AI

예측 조건·우주 기상 탭에서 NOAA(SSN/F10.7/R/S/G), D-RAP, NICT 및 선택적 GIRO를 사용합니다. 관측/발표 시각과 마지막 수집 성공 시각을 구분하며 개별·일괄 갱신할 수 있습니다. 자동 SSN은 대상 월과 정확히 일치해야 하며 만료된 값으로 조용히 대체하지 않습니다. 다른 관측값은 VOACAP 결과를 자동 보정하지 않습니다. NOAA SSN(SILSO V2 척도)은 VOACAP Online Marine과 같이 0.7배하여 계산에 사용하며, 수동 SSN과 실효 SSN은 그대로 사용합니다. [우주 기상](docs/SPACE_WEATHER.md), [국외 데이터 조사](docs/INTERNATIONAL_IONOSPHERE.md)를 참조하십시오.

GIRO는 기본 비활성화입니다. 이용 조건을 충족하거나 필요한 허가를 받은 경우에만 `.env`에 `HF_GIRO_ENABLED=1`을 설정하십시오. 비활성 상태에서는 GIRO에 연결하지 않습니다.

독립 게이트웨이(기본 **http://localhost:18083**)는 국별 JSON·GeoJSON·NMEA 0183 RMC를 수신하고 본체와 HTTP(S)/공통 JSON v1으로 연결합니다. 수신한 이동국을 위치 프리셋으로 등록할 수 있습니다. 계산마다 위치를 고정하며 이동 경로·고도 효과는 계산하지 않습니다. `HF_POSITION_INGEST_TOKEN`과 `HF_POSITION_GATEWAY_TOKEN`에 서로 다른 32자 이상 비밀값을 설정하십시오. 웹 관리 화면에는 추가로 16자 이상의 `HF_GATEWAY_UI_PASSWORD`가 필요합니다. [위치 입력](docs/POSITION_INTERFACE.md), [연결 프로토콜](docs/GATEWAY_PROTOCOL.md), [게이트웨이 웹](docs/GATEWAY_WEB_UI.md)을 참조하십시오.

안테나 카탈로그 OCR은 OpenAI·Claude·Gemini·로컬 LLM(Ollama/OpenAI 호환), 모델 조회·선택과 키 설정을 지원합니다. 키는 환경 변수나 저장 설정에서 불러오며 자동 발급하지 않습니다. 저장 키는 디스크에서 암호화되지 않습니다. 클라우드 전송에는 명시적 동의가 필요합니다. 로컬 OCR은 이미지만 지원하므로 PDF 페이지를 먼저 이미지로 변환하십시오. 원본·근거·모델 가정을 확인한 후 등록하십시오. [AI 설정·키 발급 절차](docs/AI_SETTINGS.md), [OCR](docs/ANTENNA_OCR.md), [안테나 모델](docs/ANTENNA_PRESETS.md)을 참조하십시오.

연결 확인: 내부 포트 8001은 호스트 공개 포트와 별개입니다. `/api/health`는 DB를 확인할 뿐 토큰 인증 성공을 보장하지 않습니다. `http://localhost:18082/api/positions`에서 본체→게이트웨이 연결을 확인하십시오. 위치 누락·만료 시 고정 좌표로 대체하지 않고 계산을 중단합니다. 웹 비밀번호는 두 토큰과 달라야 합니다. 원격 게이트웨이는 Compose의 `environment.HF_POSITION_GATEWAY_URL`을 덮어써야 하며 `.env`만으로 고정 기본 URL이 바뀌지 않습니다. [연결 점검표](docs/POSITION_INTERFACE.md#接続確認と障害の切り分け)를 참조하십시오.

## 해석과 제한

REL은 월간 통계 모델의 회선 신뢰도이며 순간 접속 확률이 아닙니다. SNR은 1 Hz 기준(dB·Hz)이며 `SNR_B ≈ SNR_1Hz − 10 log10(B_Hz)`로 비교합니다. 변조 방식 이름만으로 복호 성능이 보장되지 않으므로 모뎀·대역폭에 맞는 요구 SNR을 입력하십시오. 편파 이름은 부정합·패러데이 회전을 자동 계산하지 않습니다. 선택적인 추가 손실 0~30 dB는 사용자 가정에 따른 민감도 분석입니다.

치수 기반 안테나 근사는 항공기·함정 설치 상태의 실측 패턴이 아닙니다. 적절한 모델이 없는 참고용 항목은 계산에 사용할 수 없습니다. 다이버시티는 상관관계 미상의 이론적 범위를 표시하며 독립 가정 추정은 선택 사항입니다. 파형 합성·실제 수신기 전환은 하지 않습니다([상세](docs/RX_DIVERSITY.md)). VOACAP은 월간 통계 모델로 폭풍·지형·설치 조건을 완전히 반영하지 않습니다. 권장 주파수는 주파수 할당이나 운용 허가를 의미하지 않습니다.

## 네트워크·개발·라이선스

본체는 기본 localhost에만 바인딩하며 공개 웹용 인증은 없습니다. 신뢰하는 LAN에서는 `.env`에 `HF_BIND=0.0.0.0`을 추가하고 Compose를 재시작한 후 호스트 LAN IP로 접속합니다. 외부 접근은 인증/TLS로 보호하십시오. 포트 변경은 `HF_PORT=18084`를 사용합니다. 18083은 게이트웨이 기본 포트입니다.

서버는 Python 3.12 표준 라이브러리만 사용하며 브라우저 JavaScript에도 외부 의존성이 없습니다. 계산은 한 번에 하나이며 동시 요청에는 HTTP 409를 반환합니다.

```sh
python3 -m unittest discover -s tests -v
node --check app/static/app.js
```

실제 엔진 테스트에는 `VOACAP_BIN`과 `VOACAP_MODEL`을 설정합니다. [API](docs/API.md), [검증 결과·미검증 항목](docs/VALIDATION.md)을 참조하십시오.

새 코드는 MIT([LICENSE](LICENSE))입니다. 포함된 제3자 소프트웨어와 외부 데이터에는 **별도 조건**이 적용됩니다. [제3자 고지](THIRD_PARTY_NOTICES.md), [소프트웨어 라이선스](SOFTWARE_LICENSES.md), [감사 대상 버전](licenses/runtime-license-lock.json), [외부 데이터 조건](DATA_LICENSES.md)을 확인하십시오. GIRO에는 비상업적 연구·공유 제한이 있으며, 모든 NOAA/NICT 유래 데이터가 상업적으로 무제한 사용 가능하다고 가정하지 마십시오.

Docker 환경에서 재배포 패키지를 생성합니다.

```sh
python3 scripts/build_redistribution.py dist/redistribution
```

대응 소스·라이선스·해시가 포함된 **생성 디렉터리 전체**를 배포하십시오. 미감사 차이 또는 대응 소스 누락 시 중단됩니다. Git 과거 기록·중간 빌드 단계·빌드 캐시는 배포하지 않습니다. [재배포 절차](docs/REDISTRIBUTION.md)를 참조하십시오.
