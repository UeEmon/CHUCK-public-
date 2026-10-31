<p align="center"><img src="docs/images/chuck-icon.png" alt="CHUCK" width="140"></p>

# CHUCK

**C**overage & **H**F **U**sability **C**alculation **K**it

[日本語](README.md) | [English](README.en.md) | [Français](README.fr.md) | [Español](README.es.md) | Italiano | [Português](README.pt.md) | [Deutsch](README.de.md) | [한국어](README.ko.md)

CHUCK (Coverage & HF Usability Calculation Kit) è un'applicazione web di previsione della propagazione HF basata sul motore pubblico VOACAP. Supporta otto lingue senza API di traduzione esterne. Non riutilizza interfaccia, JavaScript o codice server del sito Marine.

Questa guida riassume avvio, funzioni e limiti principali. Il [README giapponese](README.md) è il riferimento dettagliato; i documenti tecnici e legali collegati mantengono la lingua originale.

## Manuale operativo

Manuale d’uso (4ª edizione) con 42 schermate: previsioni, mappa dei collegamenti, rapporti, mesh, 12 mesi, potenza, siti, gateway e impostazioni IA/OCR. C’è un PDF per ciascuna delle 8 lingue della schermata, illustrato con la schermata in quella lingua: [PDF in italiano](app/static/manual/CHUCK_Operation_Manual_it.pdf). «Manuale (PDF)» in cima all’app scarica l’edizione della lingua visualizzata. Tutte le lingue: [日本語](app/static/manual/CHUCK_Operation_Manual_ja.pdf) / [English](app/static/manual/CHUCK_Operation_Manual_en.pdf) / [Français](app/static/manual/CHUCK_Operation_Manual_fr.pdf) / [Español](app/static/manual/CHUCK_Operation_Manual_es.pdf) / [Italiano](app/static/manual/CHUCK_Operation_Manual_it.pdf) / [Português](app/static/manual/CHUCK_Operation_Manual_pt.pdf) / [Deutsch](app/static/manual/CHUCK_Operation_Manual_de.pdf) / [한국어](app/static/manual/CHUCK_Operation_Manual_ko.pdf). Schermate del 27/10/2026; consultare la documentazione corrente per modifiche successive.

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
- Le schede sotto la mappa mostrano previsioni su 24 ore (CCIR/Method 30), diversità e copertura regionale (calcolo d’area VOACAP dal TX, mostrato come le mappe S dBW di VOACAP). Selezionare una cella per dettagli UTC e frequenze consigliate.
- Propagation Chart: REL/SNR, MUF per percorso, scelta RX ed esportazione SVG. Disponibili cronologia SQLite, CSV/JSON e ingresso/uscita VOACAP originali.
- La modalità mesh calcola tutte le coppie di 2–8 stazioni in entrambe le direzioni e mostra la REL per frequenza come matrice TX × RX, con cursore UTC e potenza, antenna e rumore per stazione. Le celle con ↻ sono raggiungibili tramite 1–2 stazioni relay con ogni tratta pari o superiore alla REL obiettivo; ritardo dei relay e interferenze non sono modellati. Vedere [mesh](docs/MESH.md).
- Sotto la previsione di 24 ore, il piano delle frequenze operative sulle 24 ore trasforma le frequenze calcolate in fasce orarie con il minor numero di cambi (o la migliore ogni ora), con esportazione CSV e stampa. Vedere [piano delle frequenze](docs/FREQUENCY_PLAN.md).
- La previsione a 12 mesi calcola TX→RX1 per dodici mesi dal mese scelto e mostra la REL come tabella mese × UTC (una SSN manuale per tutti i mesi o la SSN livellata NOAA di ogni mese). Vedere [previsione](docs/ANNUAL.md).
- La potenza necessaria calcola TX→RX1 con dieci livelli 1-2-5 da 10 W a 10 kW e mostra, per UTC e frequenza, la potenza minima che raggiunge la REL obiettivo. Vedere [potenza necessaria](docs/POWER.md).
- Siti candidati ordina fino a 10 località salvate come siti di ricezione (TX→candidato) o ripetitori (TX→candidato→RX1) per ore alla REL obiettivo. Vedere [siti candidati](docs/SITES.md).
- Il ricalcolo programmato riesegue i risultati punto-punto salvati con l’ultima SSN livellata NOAA (ogni 24 ore per impostazione predefinita, `HF_WATCH_INTERVAL_HOURS`) e mostra un avviso se le ore alla REL obiettivo diminuiscono. Non disponibile ai visitatori dell’edizione pubblica. Vedere [ricalcolo programmato](docs/WATCH.md).
- La verifica delle condizioni di oggi contrassegna, su un risultato punto-punto del mese in corso, le prossime 24 ore e frequenze che la meteo spaziale di oggi può degradare: assorbimento D-RAP con R1+ o S1+, calo della MUF e zona aurorale durante le tempeste geomagnetiche. La REL mensile non cambia. Vedere [condizioni di oggi](docs/TODAY_CHECK.md).
- «Stampa rapporto» su un risultato con un solo RX apre una pagina stampabile con condizioni, frequenza consigliata per ora, mappa di affidabilità e piano di frequenze di 24 ore (salvabile in PDF dalla finestra di stampa). Vedere [rapporto](docs/REPORT.md). Le schede copertura, Propagation Chart, diversità, maglia, 12 mesi, potenza necessaria e siti candidati stampano allo stesso modo tabelle e grafici mostrati.
- Le nuove funzioni sono annunciate nell’applicazione: un avviso e dei punti sulle schede segnalano le aggiunte dall’ultima visita, e «Novità» le elenca tutte. Vedere [novità](docs/WHATS_NEW.md).
- Con Language scegliere giapponese, inglese, francese, spagnolo, italiano, portoghese, tedesco o coreano senza alterare i nomi inseriti.

Le modifiche agli ingressi non ricalcolano i risultati: avviare un nuovo calcolo. Limite di 200 luoghi e 200 antenne, con rilevamento dei conflitti di modifica.

## Dati esterni, stazioni mobili e IA

La scheda condizioni/meteo spaziale riunisce NOAA (SSN/F10.7/R/S/G), D-RAP, NICT e GIRO opzionale. Distingue ora di osservazione/pubblicazione e ultima acquisizione riuscita, con aggiornamento singolo o completo. Il SSN automatico deve corrispondere esattamente al mese; dati scaduti non vengono usati tacitamente. Le altre osservazioni non correggono automaticamente VOACAP. Il SSN NOAA (scala SILSO V2) viene moltiplicato per 0,7 prima del calcolo, come in VOACAP Online Marine; il SSN manuale e quello effettivo sono usati così come sono. Vedere [meteo spaziale](docs/SPACE_WEATHER.md) e [fonti internazionali](docs/INTERNATIONAL_IONOSPHERE.md).

GIRO è disabilitato per impostazione predefinita. Abilitarlo nella pagina di amministrazione del container di acquisizione dei dati pubblici (`http://localhost:18084/`, accesso con `HF_PUBLIC_DATA_UI_PASSWORD` di `.env`) solo se l'uso rispetta le condizioni o dispone del permesso necessario. Se disabilitato, non viene contattato.

Il gateway indipendente (**http://localhost:18083**) accetta JSON, GeoJSON o NMEA 0183 RMC per stazione (più la prua HDT/HDG/THS per orientare le antenne fissate allo scafo) e comunica con l'applicazione tramite HTTP(S)/JSON v1. Le stazioni ricevute possono diventare preset. Le posizioni sono fissate per ciascun calcolo; percorso e quota non sono modellati. Impostare segreti diversi di almeno 32 caratteri per `HF_POSITION_INGEST_TOKEN` e `HF_POSITION_GATEWAY_TOKEN`. L'interfaccia web richiede inoltre `HF_GATEWAY_UI_PASSWORD` (almeno 16 caratteri). Vedere [posizioni](docs/POSITION_INTERFACE.md), [protocollo](docs/GATEWAY_PROTOCOL.md) e [web gateway](docs/GATEWAY_WEB_UI.md).

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
