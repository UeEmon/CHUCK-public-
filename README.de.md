<p align="center"><img src="docs/images/chuck-icon.png" alt="CHUCK" width="140"></p>

# CHUCK

**C**overage & **H**F **U**sability **C**alculation **K**it

[日本語](README.md) | [English](README.en.md) | [Français](README.fr.md) | [Español](README.es.md) | [Italiano](README.it.md) | [Português](README.pt.md) | Deutsch | [한국어](README.ko.md)

CHUCK (Coverage & HF Usability Calculation Kit) ist eine Webanwendung zur HF-Ausbreitungsprognose mit der öffentlichen VOACAP-Rechenengine. Die Oberfläche unterstützt acht Sprachen ohne externe Übersetzungs-API. Oberfläche, JavaScript und Servercode der Marine-Website werden nicht wiederverwendet.

Diese Anleitung beschreibt Einstieg, Funktionen und wesentliche Grenzen. Die [japanische README](README.md) ist die ausführliche Referenz; verlinkte technische und rechtliche Dokumente bleiben in ihrer Originalsprache.

## Bedienungsanleitung

Bedienungshandbuch (4. Ausgabe) mit 42 Bildschirmaufnahmen zu Prognosen, Verbindungskarte, Berichten, Mesh, 12 Monaten, Sendeleistung, Standorten, Gateway und KI/OCR-Einstellungen. Für jede der 8 Bildschirmsprachen gibt es ein PDF mit Abbildungen des Bildschirms in dieser Sprache: [Deutsches PDF](app/static/manual/CHUCK_Operation_Manual_de.pdf). „Handbuch (PDF)“ oben in der App lädt die Ausgabe in der angezeigten Sprache herunter. Alle Sprachen: [日本語](app/static/manual/CHUCK_Operation_Manual_ja.pdf) / [English](app/static/manual/CHUCK_Operation_Manual_en.pdf) / [Français](app/static/manual/CHUCK_Operation_Manual_fr.pdf) / [Español](app/static/manual/CHUCK_Operation_Manual_es.pdf) / [Italiano](app/static/manual/CHUCK_Operation_Manual_it.pdf) / [Português](app/static/manual/CHUCK_Operation_Manual_pt.pdf) / [Deutsch](app/static/manual/CHUCK_Operation_Manual_de.pdf) / [한국어](app/static/manual/CHUCK_Operation_Manual_ko.pdf). Stand der Bildschirme: 27.10.2026; spätere Änderungen stehen in der aktuellen Dokumentation.

## Start

Docker Desktop (Windows/macOS) oder Docker Engine mit Compose v2 (Linux) installieren:

```sh
git clone https://github.com/UeEmon/CHUCK-public-.git
cd CHUCK-public-
docker compose up -d --build
```

**http://localhost:18082** öffnen. Alternativ `sh Start.sh` unter macOS/Linux oder `./Start.ps1` in Windows PowerShell verwenden. Der erste Build benötigt Internet. Engine-Quellcode und Karten sind enthalten; danach funktionieren manuelle Berechnungen und Karten offline. Externe Daten und Cloud-OCR benötigen eine Verbindung.

```sh
docker compose down
docker compose logs --tail=100 -f
```

Verlauf und Vorlagen bleiben bei normalen Stopps/Neubauten im Volume `hf-data`. `docker compose down -v` löscht persistente Volumes einschließlich Gateway-Daten. Benötigte Ergebnisse vorher exportieren.

## Funktionen und Bedienung

- Weltkarte durch Ziehen verschieben, auch über 180° Länge; mit Mausrad/Daumenrad zoomen. Klicks verschieben keine TX/RX-Stationen.
- Rechts einen TX und ein bis acht RX aus Vorlagen wählen. TX lässt sich mit einem einzelnen RX tauschen. Ab zwei RX wird die Diversity-Prognose aktiviert.
- Standorte und Antennen separat bearbeiten. Vorgegebene Städte in Nordamerika, Ostasien und Europa haben ungefähre Koordinaten, keine tatsächlichen Funkstellenpositionen.
- Monat, geglättete Sonnenfleckenzahl (SSN), Leistung, bis zu 11 Frequenzen zwischen 2 und 30 MHz, Antenne, Rauschen, erforderlichen SNR und Zuverlässigkeit einstellen.
- Unter der Karte zeigen Registerkarten 24-Stunden-Prognosen (CCIR/Method 30), Diversity und regionale Abdeckung (höchstens 35 unabhängige Punkte). Eine Zelle öffnet UTC-Details und Frequenzempfehlungen.
- Propagation Chart mit REL/SNR, Pfad-MUF, RX-Auswahl und SVG-Export. SQLite-Verlauf, CSV/JSON sowie VOACAP-Rohein-/ausgabe verfügbar.
- Der Mesh-Modus berechnet alle Paare von 2–8 Stationen in beide Richtungen und zeigt die REL je Frequenz als TX × RX-Matrix, mit UTC-Schieberegler sowie Leistung, Antenne und Rauschen je Station. Mit ↻ markierte Zellen sind über 1–2 Relaisstationen erreichbar, wenn jeder Abschnitt die Ziel-REL erreicht; Relaisverzögerung und Störungen werden nicht modelliert. Siehe [Mesh](docs/MESH.md).
- Unter der 24-Stunden-Prognose erstellt der 24-Stunden-Betriebsfrequenzplan aus den berechneten Frequenzen Zeitblöcke mit wenigen Wechseln (oder jede Stunde die beste), mit CSV-Export und Druck. Siehe [Frequenzplan](docs/FREQUENCY_PLAN.md).
- Die 12-Monats-Prognose berechnet für TX→RX1 zwölf Monate ab dem gewählten Monat und zeigt die REL als Monat × UTC-Tabelle (manuelle SSN für alle Monate oder geglättete NOAA-SSN je Monat). Siehe [Prognose](docs/ANNUAL.md).
- Die benötigte Leistung berechnet TX→RX1 mit zehn 1-2-5-Stufen von 10 W bis 10 kW und zeigt je UTC und Frequenz die kleinste Leistung mit Ziel-REL. Siehe [benötigte Leistung](docs/POWER.md).
- Standortkandidaten ordnet bis zu 10 gespeicherte Standorte als Empfangs- (TX→Kandidat) oder Relaisstandorte (TX→Kandidat→RX1) nach Stunden mit Ziel-REL. Siehe [Standortkandidaten](docs/SITES.md).
- Die geplante Neuberechnung rechnet gespeicherte Punkt-zu-Punkt-Ergebnisse mit der neuesten geglätteten NOAA-SSN neu (standardmäßig alle 24 Stunden, `HF_WATCH_INTERVAL_HOURS`) und zeigt einen Hinweis, wenn die Stunden mit Ziel-REL abnehmen. Für Besucher der öffentlichen Ausgabe nicht verfügbar. Siehe [geplante Neuberechnung](docs/WATCH.md).
- „Bericht drucken“ bei einem Ergebnis mit einem RX öffnet eine druckbare Seite mit Bedingungen, empfohlener Frequenz je Stunde, Heatmap und 24-Stunden-Frequenzplan (im Druckdialog als PDF speicherbar). Siehe [Bericht](docs/REPORT.md). Die Reiter Abdeckung, Propagation Chart, Diversity, Mesh, 12 Monate, erforderliche Sendeleistung und Standortkandidaten drucken die angezeigten Tabellen und Diagramme auf dieselbe Weise.
- Neue Funktionen werden in der App angekündigt: ein Hinweisbalken und Punkte auf den Reitern markieren Neues seit dem letzten Besuch, „Neuigkeiten“ listet alles auf. Siehe [Neuigkeiten](docs/WHATS_NEW.md).
- Language bietet Japanisch, Englisch, Französisch, Spanisch, Italienisch, Portugiesisch, Deutsch und Koreanisch, ohne eigene Namen zu ändern.

Geänderte Eingaben berechnen vorhandene Ergebnisse nicht neu. Berechnung erneut starten. Jeweils bis zu 200 Standorte und Antennen; gleichzeitige Bearbeitung wird auf Konflikte geprüft.

## Externe Daten, mobile Stationen und KI

Die Registerkarte Bedingungen/Weltraumwetter vereint NOAA (SSN/F10.7/R/S/G), D-RAP, NICT und optional GIRO. Beobachtungs-/Veröffentlichungszeit und letzter erfolgreicher Abruf werden getrennt angezeigt; Einzel- und Gesamtaktualisierung sind möglich. Automatische SSN müssen exakt zum Monat passen; abgelaufene Werte werden nicht stillschweigend verwendet. Andere Beobachtungen korrigieren VOACAP nicht automatisch. Die NOAA-SSN (SILSO-V2-Skala) wird vor der Berechnung mit 0,7 multipliziert, wie bei VOACAP Online Marine; manuelle und effektive SSN werden unverändert verwendet. Siehe [Weltraumwetter](docs/SPACE_WEATHER.md) und [internationale Quellen](docs/INTERNATIONAL_IONOSPHERE.md).

GIRO ist standardmäßig deaktiviert. `HF_GIRO_ENABLED=1` nur bei erfüllten Nutzungsbedingungen oder entsprechender Genehmigung in `.env` setzen. Deaktiviert erfolgt keine GIRO-Verbindung.

Das separate Gateway (**http://localhost:18083**) empfängt je Station JSON, GeoJSON oder NMEA 0183 RMC und nutzt zur Anwendung HTTP(S)/JSON v1. Empfangene Stationen können als Standortvorlagen registriert werden. Positionen werden pro Berechnung festgehalten; Route und Höhe werden nicht modelliert. Unterschiedliche Geheimnisse mit mindestens 32 Zeichen für `HF_POSITION_INGEST_TOKEN` und `HF_POSITION_GATEWAY_TOKEN` setzen. Die Webverwaltung benötigt zusätzlich `HF_GATEWAY_UI_PASSWORD` mit mindestens 16 Zeichen. Siehe [Positionseingang](docs/POSITION_INTERFACE.md), [Protokoll](docs/GATEWAY_PROTOCOL.md) und [Gateway-Weboberfläche](docs/GATEWAY_WEB_UI.md).

Antennenkatalog-OCR unterstützt OpenAI, Claude, Gemini und lokale LLMs (Ollama/OpenAI-kompatibel), Modellauswahl und Schlüsselkonfiguration. Schlüssel stammen aus Umgebungsvariablen oder gespeicherten Einstellungen; sie werden nicht automatisch ausgestellt und liegen auf dem Datenträger unverschlüsselt vor. Cloud-Verarbeitung erfordert ausdrückliche Zustimmung. Lokale OCR akzeptiert Bilder; PDF-Seiten vorher konvertieren. Original, Belege und Modellannahmen vor dem Registrieren prüfen. Siehe [KI und Schlüsselbeschaffung](docs/AI_SETTINGS.md), [OCR](docs/ANTENNA_OCR.md) und [Antennen](docs/ANTENNA_PRESETS.md).

Verbindungsprüfung: Der interne Port 8001 ist unabhängig von veröffentlichten Ports. `/api/health` prüft die Datenbank, nicht die Authentifizierung. `http://localhost:18082/api/positions` prüft den Weg von der Anwendung zum Gateway. Fehlende/abgelaufene Positionen stoppen die Berechnung statt auf feste Koordinaten zurückzufallen. Das Webpasswort muss sich von beiden Tokens unterscheiden. Bei einem entfernten Gateway `environment.HF_POSITION_GATEWAY_URL` in Compose überschreiben; `.env` allein ändert die feste Standard-URL nicht. Siehe [Prüfliste](docs/POSITION_INTERFACE.md#接続確認と障害の切り分け).

## Grenzen und Sicherheit

REL ist modellierte monatliche Verbindungszuverlässigkeit, keine momentane Verbindungswahrscheinlichkeit. SNR ist auf 1 Hz normiert (dB·Hz): `SNR_B ≈ SNR_1Hz − 10 log10(B_Hz)`. Der Modulationsname garantiert keine Decodierung: passenden SNR für Modem und Bandbreite angeben. Polarisationsnamen berechnen weder Fehlanpassung noch Faraday-Rotation automatisch; optionale zusätzliche 0–30 dB Verlust sind eine Nutzerannahme.

Antennen-Näherungen anhand von Abmessungen sind keine gemessenen Flugzeug-/Schiffsmuster. Reine Referenzeinträge ohne geeignetes Modell sind nicht berechenbar. Diversity zeigt theoretische Grenzen bei unbekannter Korrelation, ohne Signalzusammenführung oder reale Empfängerumschaltung; die Unabhängigkeitsschätzung ist optional ([Details](docs/RX_DIVERSITY.md)). VOACAP ist ein monatliches statistisches Modell und erfasst Stürme, Gelände und Einbau nicht vollständig. Empfehlungen ersetzen keine Frequenzzuteilung oder Betriebsgenehmigung.

Die Anwendung bindet standardmäßig an localhost und besitzt keine Anmeldung für das öffentliche Web. Für ein vertrauenswürdiges LAN `HF_BIND=0.0.0.0` in `.env` setzen, Compose neu starten und die LAN-IP des Hosts verwenden. Nichtlokale Zugriffe mit Authentifizierung/TLS absichern. Portänderung: `HF_PORT=18084`; 18083 ist bereits der Gateway-Standardport.

## Entwicklung und Lizenzen

Server mit Python-3.12-Standardbibliothek; JavaScript ohne externe Abhängigkeiten. Eine Berechnung gleichzeitig; konkurrierende Anfragen erhalten HTTP 409.

```sh
python3 -m unittest discover -s tests -v
node --check app/static/app.js
```

Für native Engine-Tests `VOACAP_BIN` und `VOACAP_MODEL` setzen. Siehe [API](docs/API.md) und [Validierung/ungeprüfte Bereiche](docs/VALIDATION.md).

Neuer Code steht unter MIT ([LICENSE](LICENSE)). Drittsoftware und externe Daten haben **eigene Bedingungen**: [Dritthinweise](THIRD_PARTY_NOTICES.md), [Softwarelizenzen](SOFTWARE_LICENSES.md), [geprüfte Versionen](licenses/runtime-license-lock.json) und [Datenbedingungen](DATA_LICENSES.md). GIRO beschränkt Nutzung und Weitergabe; uneingeschränkte kommerzielle Nutzung aller NOAA-/NICT-Daten darf nicht vorausgesetzt werden.

Mit Docker das Weitergabepaket erstellen:

```sh
python3 scripts/build_redistribution.py dist/redistribution
```

Das **gesamte erzeugte Verzeichnis** einschließlich zugehöriger Quellen, Lizenzen und Prüfsummen weitergeben. Ungeprüfte Abweichungen oder fehlende Quellen stoppen das Skript. Git-Verlauf, Zwischenstufen und Build-Caches ausschließen. Siehe [Weitergabe](docs/REDISTRIBUTION.md).
