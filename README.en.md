<p align="center"><img src="docs/images/chuck-icon.png" alt="CHUCK" width="140"></p>

# CHUCK

**C**overage & **H**F **U**sability **C**alculation **K**it

[日本語](README.md) | English | [Français](README.fr.md) | [Español](README.es.md) | [Italiano](README.it.md) | [Português](README.pt.md) | [Deutsch](README.de.md) | [한국어](README.ko.md)

CHUCK (Coverage & HF Usability Calculation Kit) is an HF propagation prediction web application using the public VOACAP engine. The interface supports eight languages without an external translation API. It does not reuse the Marine website's interface, JavaScript or server code.

This localized guide covers setup, operation and essential limitations. The [Japanese README](README.md) is the detailed reference; linked technical and legal documents remain in their original language.

## Operation manual

Japanese operation manual: 23 pages with 24 web-interface screenshots, including predictions, gateway management and AI/OCR setup. [PDF](docs/manual/CHUCK_Operation_Manual_ja.pdf) / [Word](docs/manual/CHUCK_Operation_Manual_ja.docx). Applies to commit `e790327`; consult current documentation for subsequent changes.

## Quick start

Install Docker Desktop (Windows/macOS) or Docker Engine with Compose v2 (Linux), then run:

```sh
git clone https://github.com/UeEmon/CHUCK-public-.git
cd CHUCK-public-
docker compose up -d --build
```

Open **http://localhost:18082**. Alternatively, use `sh Start.sh` on macOS/Linux or `./Start.ps1` in Windows PowerShell. The initial build needs internet access. Engine source and map data are bundled; after building, manual calculations and map display work offline. External feeds and cloud OCR require connectivity.

```sh
docker compose down
docker compose logs --tail=100 -f
```

History and presets persist in the `hf-data` volume across normal stops/rebuilds. `docker compose down -v` deletes persistent volumes, including gateway data; export required results first.

## Features and operation

- Drag the wrapping world map to pan across 180°; use the wheel/thumb wheel to zoom. Clicking does not move TX/RX.
- Select one TX and one to eight RX sites from presets on the right. Swap TX with an individual RX without changing the others. Two or more RX sites enable diversity predictions.
- Manage location and antenna presets in separate editors. Initial cities cover North America, East Asia and Europe; city coordinates are approximate, not actual radio stations.
- Set month, smoothed sunspot number (SSN), power, up to 11 frequencies within 2–30 MHz, antenna model, noise, required SNR/reliability and minimum elevation.
- Calculate 24-hour CCIR/Method 30 predictions. Results below the map use tabs for reliability, diversity and regional coverage (up to 35 independent points). Select a heatmap cell for UTC details and recommended frequencies.
- Use the UTC–frequency Propagation Chart (REL/SNR, path MUF, RX selection, SVG export), saved history, CSV/JSON and raw VOACAP input/output.
- Choose Japanese, English, French, Spanish, Italian, Portuguese, German or Korean with Language. User-entered names and settings are preserved.

Changing inputs does not recalculate existing results. Recalculate to compare with the current map. Presets are stored in SQLite (up to 200 locations and 200 antennas); concurrent edits are checked for conflicts.

## External data, mobile sites and AI

The conditions/space-weather tab combines NOAA SSN/F10.7/R/S/G, D-RAP, NICT and optional GIRO observations. Observation/publication time and last successful retrieval time are shown separately, with individual/batch refresh. NOAA automatic SSN requires an exact matching month; expired SSN is not silently used. Other observations correct VOACAP only when you choose the effective SSN, which inverts current ionosonde foF2 (NICT, plus GIRO when enabled) into the SSN VOACAP needs to reproduce it, for the current month only. The NOAA SSN (SILSO V2 scale) is multiplied by 0.7 before it goes to the engine, the same conversion as VOACAP Online Marine; manual and effective SSN are used as entered. See [space weather](docs/SPACE_WEATHER.md) and [international sources](docs/INTERNATIONAL_IONOSPHERE.md).

GIRO is disabled by default. Set `HF_GIRO_ENABLED=1` in `.env` only when your use meets its terms or you have the required permission. No GIRO connection is made while disabled.

An independent gateway (default **http://localhost:18083**) accepts per-station JSON, GeoJSON or NMEA 0183 RMC, then sends a common HTTP(S)/JSON v1 format to the application. Received mobile stations can become location presets. Positions are frozen for each calculation; route/altitude effects are not modeled. Configure distinct secrets of at least 32 characters for `HF_POSITION_INGEST_TOKEN` and `HF_POSITION_GATEWAY_TOKEN`. The gateway web UI additionally needs `HF_GATEWAY_UI_PASSWORD` (at least 16 characters). See [position input](docs/POSITION_INTERFACE.md), [protocol](docs/GATEWAY_PROTOCOL.md) and [gateway UI](docs/GATEWAY_WEB_UI.md).

Antenna catalog OCR supports OpenAI, Claude, Gemini and local LLMs (Ollama/OpenAI-compatible), with model discovery and key settings. Keys can be loaded from configured environment variables or saved settings; the application does **not** issue API keys automatically. Saved keys are not encrypted at rest. Cloud processing requires explicit consent. Local OCR accepts images; convert PDF pages to images first. Review the original, evidence and modeling assumptions before registering presets. See [AI setup/key acquisition](docs/AI_SETTINGS.md), [OCR](docs/ANTENNA_OCR.md) and [antenna models](docs/ANTENNA_PRESETS.md).

Gateway connection checks: the app uses internal port 8001, independent of published ports. A healthy `/api/health` checks the database, not successful token authentication. Open `http://localhost:18082/api/positions` to verify the app-to-gateway path. Expired/missing mobile positions stop the calculation rather than fall back to fixed coordinates. Keep the UI password distinct from both tokens. For a remote gateway, override the app's Compose `environment.HF_POSITION_GATEWAY_URL`; setting `.env` alone does not change the fixed default URL. See the [connection checklist](docs/POSITION_INTERFACE.md#接続確認と障害の切り分け).

## Interpretation and limitations

- REL is modeled monthly circuit reliability, not an instantaneous connection probability. SNR is normalized to 1 Hz (dB·Hz): `SNR_B ≈ SNR_1Hz − 10 log10(B_Hz)`.
- Modulation names alone do not establish decoding performance. Enter the required SNR for your modem, bandwidth, rate and BER. Polarization labels do not automatically model mismatch or Faraday rotation; an optional user-assumed 0–30 dB extra loss is only a sensitivity analysis.
- Antenna dimension approximations are not measured aircraft/ship installation patterns. Reference-only entries cannot be used for calculation until suitable modeling information is supplied.
- Diversity results compare sites and show theoretical bounds with unknown correlation; an independence-based estimate is optional. No waveform combining or real receiver switching is performed. See [diversity](docs/RX_DIVERSITY.md).
- Mesh mode calculates every pair of 2–8 stations in both directions and shows REL per frequency as a TX × RX matrix, with a UTC slider and per-station power, antenna and noise. Cells marked ↻ are reachable through 1–2 relay stations with every hop at or above the target REL; relay delay and interference are not modelled. See [mesh](docs/MESH.md).
- Below the 24-hour prediction, the 24-hour operating frequency plan turns the calculated frequencies into time blocks with the fewest switches (or the best each hour), with CSV export and printing. See [frequency plan](docs/FREQUENCY_PLAN.md).
- The 12-month outlook calculates TX→RX1 for twelve months from the selected month and shows REL as a month × UTC table (one manual SSN for all months, or NOAA smoothed SSN per month). See [outlook](docs/ANNUAL.md).
- The required power search calculates TX→RX1 at ten 1-2-5 power steps from 10 W to 10 kW and shows the smallest power that reaches the target REL per UTC and frequency. See [required power](docs/POWER.md).
- Site candidates ranks up to 10 saved locations as receive sites (TX→candidate) or relay sites (TX→candidate→RX1) by the hours they reach the target REL. See [site candidates](docs/SITES.md).
- Scheduled recalculation reruns saved point-to-point results with the latest NOAA smoothed SSN (every 24 hours by default, `HF_WATCH_INTERVAL_HOURS`) and shows a notice when the hours at the target REL decrease. Not available to visitors of the public edition. See [scheduled recalculation](docs/WATCH.md).
- “Print report” on a single-link result opens one printable page with the conditions, hourly recommended frequency, heatmap and 24-hour frequency plan (save as PDF from the print dialog). See [report](docs/REPORT.md).
- New features are announced in the app: a banner and dots on the tabs mark features added since your last visit, and “What’s new” lists them all. See [what’s new](docs/WHATS_NEW.md).
- VOACAP is a monthly statistical model. Instantaneous ionospheric changes, storms, terrain and installation effects are not fully represented. Recommendations do not grant frequency assignments or operating authorization.

## Network access and development

The application binds to localhost by default and has no public-web authentication. For a trusted LAN, add `HF_BIND=0.0.0.0` to `.env`, restart Compose and use the host's LAN address. Protect non-local deployments with appropriate authentication/TLS. To change the app port, set `HF_PORT=18084`; 18083 is already the default gateway port.

The server uses Python 3.12's standard library; browser JavaScript has no external dependencies. Predictions are serialized; concurrent requests receive HTTP 409.

```sh
python3 -m unittest discover -s tests -v
node --check app/static/app.js
```

Set `VOACAP_BIN` and `VOACAP_MODEL` for native-engine tests. See [API](docs/API.md) and [validation/results and untested areas](docs/VALIDATION.md).

## Licensing and redistribution

New application code is MIT licensed ([LICENSE](LICENSE)). Bundled third-party software and external data have **separate terms**. Read [third-party notices](THIRD_PARTY_NOTICES.md), [software licenses](SOFTWARE_LICENSES.md), [package lock](licenses/runtime-license-lock.json) and [external-data terms](DATA_LICENSES.md) before sharing images, caches or outputs. GIRO has noncommercial/research and sharing restrictions; do not assume unrestricted commercial use of all NOAA/NICT-derived data.

With Docker available, prepare a redistribution bundle using:

```sh
python3 scripts/build_redistribution.py dist/redistribution
```

Distribute the **entire generated directory**, including matching sources, notices and hashes. The script stops on unaudited differences or missing corresponding sources. See [redistribution requirements and caveats](docs/REDISTRIBUTION.md). Do not distribute Git history, intermediate build stages or build caches as part of this bundle.
