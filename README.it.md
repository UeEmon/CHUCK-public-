<p align="center"><img src="docs/images/chuck-icon.png" alt="CHUCK" width="140"></p>

# CHUCK

**C**overage & **H**F **U**sability **C**alculation **K**it

[日本語](README.md) | [English](README.en.md) | [Français](README.fr.md) | [Español](README.es.md) | Italiano | [Português](README.pt.md) | [Deutsch](README.de.md) | [한국어](README.ko.md)

CHUCK (Coverage & HF Usability Calculation Kit) è un'applicazione web di previsione della propagazione HF basata sul motore pubblico VOACAP. Supporta otto lingue senza API di traduzione esterne. Non riutilizza interfaccia, JavaScript o codice server del sito Marine.

Questa guida riassume avvio, funzioni e limiti principali. Il [README giapponese](README.md) è il riferimento dettagliato; i documenti tecnici e legali collegati mantengono la lingua originale.

## Manuale operativo

Manuale in giapponese: 23 pagine e 24 schermate, con previsioni, gateway e impostazioni IA/OCR. [PDF](docs/manual/CHUCK_Operation_Manual_ja.pdf) / [Word](docs/manual/CHUCK_Operation_Manual_ja.docx). Riferimento: `e790327`; consultare la documentazione corrente per modifiche successive.

## Avvio

Installare Docker Desktop (Windows/macOS) oppure Docker Engine con Compose v2 (Linux):

```sh
git clone https://github.com/UeEmon/CHUCK-public-.git
cd CHUCK-public-
docker compose up -d --build
```

Aprire **http://localhost:18082**. In alternativa: `sh Start.sh` su macOS/Linux o `./Start.ps1` in Windows PowerShell. La prima compilazione richiede Internet. Sorgenti del motore e mappe sono inclusi; successivamente calcoli manuali e mappe funzionano offline. Dati esterni e OCR cloud richiedono una connessione.

```sh
docker compose down
docker compose logs --tail=100 -f
```

Cronologia e preset restano nel volume `hf-data` dopo arresti e ricompilazioni normali. `docker compose down -v` elimina i volumi persistenti, inclusi i dati del gateway: esportare prima i risultati necessari.

## Funzioni e utilizzo

- Trascinare la mappa anche oltre il meridiano 180°; usare rotella/rotella laterale per lo zoom. I clic non spostano TX/RX.
- Selezionare a destra un TX e da uno a otto RX tramite preset. Ogni RX può essere scambiato con il TX. Con almeno due RX si attiva la previsione in diversità.
- Modificare separatamente preset di luoghi e antenne. Le città iniziali di Nord America, Asia orientale ed Europa hanno coordinate approssimative, non quelle di vere stazioni radio.
- Impostare mese, numero smussato di macchie solari (SSN), potenza, fino a 11 frequenze fra 2 e 30 MHz, antenna, rumore, SNR e affidabilità richiesti.
- Le schede sotto la mappa mostrano previsioni su 24 ore (CCIR/Method 30), diversità e copertura regionale (massimo 35 punti indipendenti). Selezionare una cella per dettagli UTC e frequenze consigliate.
- Propagation Chart: REL/SNR, MUF per percorso, scelta RX ed esportazione SVG. Disponibili cronologia SQLite, CSV/JSON e ingresso/uscita VOACAP originali.
- Con Language scegliere giapponese, inglese, francese, spagnolo, italiano, portoghese, tedesco o coreano senza alterare i nomi inseriti.

Le modifiche agli ingressi non ricalcolano i risultati: avviare un nuovo calcolo. Limite di 200 luoghi e 200 antenne, con rilevamento dei conflitti di modifica.

## Dati esterni, stazioni mobili e IA

La scheda condizioni/meteo spaziale riunisce NOAA (SSN/F10.7/R/S/G), D-RAP, NICT e GIRO opzionale. Distingue ora di osservazione/pubblicazione e ultima acquisizione riuscita, con aggiornamento singolo o completo. Il SSN automatico deve corrispondere esattamente al mese; dati scaduti non vengono usati tacitamente. Le altre osservazioni non correggono automaticamente VOACAP. Vedere [meteo spaziale](docs/SPACE_WEATHER.md) e [fonti internazionali](docs/INTERNATIONAL_IONOSPHERE.md).

GIRO è disabilitato per impostazione predefinita. Aggiungere `HF_GIRO_ENABLED=1` a `.env` solo se l'uso rispetta le condizioni o dispone del permesso necessario. Se disabilitato, non viene contattato.

Il gateway indipendente (**http://localhost:18083**) accetta JSON, GeoJSON o NMEA 0183 RMC per stazione e comunica con l'applicazione tramite HTTP(S)/JSON v1. Le stazioni ricevute possono diventare preset. Le posizioni sono fissate per ciascun calcolo; percorso e quota non sono modellati. Impostare segreti diversi di almeno 32 caratteri per `HF_POSITION_INGEST_TOKEN` e `HF_POSITION_GATEWAY_TOKEN`. L'interfaccia web richiede inoltre `HF_GATEWAY_UI_PASSWORD` (almeno 16 caratteri). Vedere [posizioni](docs/POSITION_INTERFACE.md), [protocollo](docs/GATEWAY_PROTOCOL.md) e [web gateway](docs/GATEWAY_WEB_UI.md).

L'OCR dei cataloghi supporta OpenAI, Claude, Gemini e LLM locali (Ollama/compatibili OpenAI), scelta del modello e impostazione delle chiavi. Le chiavi provengono da variabili d'ambiente o impostazioni salvate: non vengono emesse automaticamente e non sono cifrate su disco. Il cloud richiede consenso esplicito. L'OCR locale accetta immagini: convertire prima le pagine PDF. Verificare originali, prove e ipotesi prima di registrare un'antenna. Vedere [IA e ottenimento chiavi](docs/AI_SETTINGS.md), [OCR](docs/ANTENNA_OCR.md) e [antenne](docs/ANTENNA_PRESETS.md).

Verifica del collegamento: la porta interna è 8001, indipendente dalle porte pubblicate. `/api/health` verifica il database, non l'autenticazione. Aprire `http://localhost:18082/api/positions` per verificare il percorso dall'applicazione. Posizioni assenti/scadute bloccano il calcolo senza ripiego su coordinate fisse. La password web deve differire da entrambi i token. Per un gateway remoto, sovrascrivere `environment.HF_POSITION_GATEWAY_URL` in Compose: `.env` da solo non modifica l'URL predefinito fisso. Vedere la [lista di verifica](docs/POSITION_INTERFACE.md#接続確認と障害の切り分け).

## Limiti e sicurezza

REL è affidabilità mensile modellata, non probabilità istantanea di connessione. SNR è normalizzato a 1 Hz (dB·Hz): `SNR_B ≈ SNR_1Hz − 10 log10(B_Hz)`. La sola modulazione non garantisce decodifica: specificare il SNR del modem e della banda. Le etichette di polarizzazione non calcolano disadattamento o rotazione di Faraday; la perdita aggiuntiva opzionale di 0–30 dB è un'ipotesi dell'utente.

Le approssimazioni dimensionali delle antenne non sono diagrammi misurati su aeromobili/navi. Le voci di solo riferimento prive di modello idoneo non sono calcolabili. La diversità mostra limiti teorici a correlazione ignota, senza combinazione di segnali o commutazione reale; la stima indipendente è facoltativa ([dettagli](docs/RX_DIVERSITY.md)). VOACAP è mensile e statistico, non rappresenta completamente tempeste, terreno e installazione. Le raccomandazioni non autorizzano l'uso delle frequenze.

L'applicazione ascolta su localhost e non ha autenticazione per il web pubblico. Per una LAN fidata aggiungere `HF_BIND=0.0.0.0` a `.env`, riavviare Compose e usare l'IP LAN dell'host. Proteggere gli accessi non locali con autenticazione/TLS. Per cambiare porta usare `HF_PORT=18084`; 18083 è già la porta predefinita del gateway.

## Sviluppo e licenze

Server con libreria standard Python 3.12, JavaScript senza dipendenze esterne. Un calcolo alla volta; richieste concorrenti ricevono HTTP 409.

```sh
python3 -m unittest discover -s tests -v
node --check app/static/app.js
```

Impostare `VOACAP_BIN` e `VOACAP_MODEL` per i test del motore nativo. Vedere [API](docs/API.md) e [validazione e aspetti non verificati](docs/VALIDATION.md).

Nuovo codice sotto MIT ([LICENSE](LICENSE)). Software di terzi e dati esterni hanno **condizioni separate**: [avvisi](THIRD_PARTY_NOTICES.md), [licenze software](SOFTWARE_LICENSES.md), [versioni verificate](licenses/runtime-license-lock.json) e [condizioni dati](DATA_LICENSES.md). GIRO limita usi e condivisione; non presumere uso commerciale illimitato di tutti i dati NOAA/NICT.

Con Docker, preparare il pacchetto:

```sh
python3 scripts/build_redistribution.py dist/redistribution
```

Distribuire **l'intera directory generata**, con sorgenti corrispondenti, licenze e hash. Differenze non verificate o sorgenti mancanti interrompono lo script. Escludere cronologia Git, stadi intermedi e cache di compilazione. Vedere [redistribuzione](docs/REDISTRIBUTION.md).
