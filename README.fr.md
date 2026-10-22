<p align="center"><img src="docs/images/chuck-icon.png" alt="CHUCK" width="140"></p>

# CHUCK

**C**overage & **H**F **U**sability **C**alculation **K**it

[日本語](README.md) | [English](README.en.md) | Français | [Español](README.es.md) | [Italiano](README.it.md) | [Português](README.pt.md) | [Deutsch](README.de.md) | [한국어](README.ko.md)

CHUCK (Coverage & HF Usability Calculation Kit) est une application web de prévision de la propagation HF fondée sur le moteur public VOACAP. Son interface propose huit langues, sans API de traduction externe. Le code de l'interface, du JavaScript et du serveur du site Marine n'est pas réutilisé.

Ce guide présente l'installation, les fonctions et les limites essentielles. Le [README japonais](README.md) constitue la référence détaillée ; les documents techniques et juridiques liés conservent leur langue d'origine.

## Manuel d'utilisation

Manuel en japonais : 23 pages et 24 captures de l'interface, avec prévisions, passerelle et configuration IA/OCR. [PDF](docs/manual/CHUCK_Operation_Manual_ja.pdf) / [Word](docs/manual/CHUCK_Operation_Manual_ja.docx). Version de référence : `e790327`. Consultez la documentation actuelle pour les changements ultérieurs.

## Démarrage

Installez Docker Desktop (Windows/macOS) ou Docker Engine avec Compose v2 (Linux), puis exécutez :

```sh
git clone https://github.com/UeEmon/CHUCK-public-.git
cd CHUCK-public-
docker compose up -d --build
```

Ouvrez **http://localhost:18082**. Vous pouvez aussi utiliser `sh Start.sh` (macOS/Linux) ou `./Start.ps1` (Windows PowerShell). La première compilation nécessite Internet. Les sources du moteur et les cartes sont incluses ; les calculs manuels et les cartes fonctionnent ensuite hors ligne. Les données externes et l'OCR dans le cloud nécessitent une connexion.

```sh
docker compose down
docker compose logs --tail=100 -f
```

L'historique et les préréglages sont conservés dans le volume `hf-data`. Attention : `docker compose down -v` supprime les volumes persistants, y compris les données de la passerelle. Exportez d'abord les résultats nécessaires.

## Utilisation

- Déplacez la carte par glissement, y compris au-delà du méridien 180° ; zoomez avec la molette ou la molette de pouce. Un clic ne déplace pas les stations.
- À droite, sélectionnez un TX et un à huit RX parmi les préréglages. Chaque RX peut être échangé avec le TX. À partir de deux RX, la prévision en diversité est activée.
- Gérez séparément les lieux et les antennes. Les villes initiales d'Amérique du Nord, d'Asie orientale et d'Europe ont des coordonnées approximatives, pas celles de véritables stations radio.
- Réglez le mois, le nombre lissé de taches solaires (SSN), la puissance, jusqu'à 11 fréquences entre 2 et 30 MHz, l'antenne, le bruit, le SNR et la fiabilité requis.
- Les résultats sur 24 heures (CCIR/Method 30) figurent sous la carte, par onglets : fiabilité, diversité, couverture régionale (35 points indépendants au maximum). Une cellule affiche les détails UTC et les fréquences recommandées.
- Le Propagation Chart affiche REL/SNR et MUF par trajet, avec sélection du RX et export SVG. Historique SQLite, export CSV/JSON et entrées/sorties VOACAP sont disponibles.
- Le mode maillé calcule toutes les paires de 2 à 8 stations dans les deux sens et affiche la REL par fréquence sous forme de matrice TX × RX, avec curseur UTC et puissance, antenne et bruit propres à chaque station. Les cellules marquées ↻ sont accessibles via 1 ou 2 stations relais avec chaque saut au moins à la REL cible ; le délai des relais et les interférences ne sont pas modélisés. Voir [maillage](docs/MESH.md).
- Language permet de choisir japonais, anglais, français, espagnol, italien, portugais, allemand ou coréen, sans modifier les noms saisis.

Une modification des entrées ne recalcule pas les résultats existants : relancez le calcul. Les préréglages sont limités à 200 lieux et 200 antennes ; les conflits d'édition sont détectés.

## Données externes, stations mobiles et IA

L'onglet conditions/météo spatiale regroupe NOAA (SSN/F10.7/R/S/G), D-RAP, NICT et GIRO en option. Il distingue l'heure d'observation/publication de la dernière acquisition réussie et permet une actualisation individuelle ou globale. Le SSN automatique doit correspondre exactement au mois choisi ; une valeur expirée n'est pas utilisée silencieusement. Les autres observations ne corrigent pas automatiquement les calculs. Voir [météo spatiale](docs/SPACE_WEATHER.md) et [sources internationales](docs/INTERNATIONAL_IONOSPHERE.md).

GIRO est désactivé par défaut. N'ajoutez `HF_GIRO_ENABLED=1` à `.env` que si votre usage respecte ses conditions ou dispose de l'autorisation nécessaire. Aucune connexion GIRO n'est effectuée lorsqu'il est désactivé.

La passerelle indépendante (**http://localhost:18083** par défaut) reçoit, par station, JSON, GeoJSON ou NMEA 0183 RMC et utilise HTTP(S)/JSON v1 vers l'application. Les stations reçues peuvent être enregistrées comme lieux. Les positions sont figées pour chaque calcul ; trajet et altitude ne sont pas modélisés. Définissez deux secrets distincts d'au moins 32 caractères : `HF_POSITION_INGEST_TOKEN` et `HF_POSITION_GATEWAY_TOKEN`. L'interface web nécessite aussi `HF_GATEWAY_UI_PASSWORD` (16 caractères minimum). Voir [positions](docs/POSITION_INTERFACE.md), [protocole](docs/GATEWAY_PROTOCOL.md) et [interface de passerelle](docs/GATEWAY_WEB_UI.md).

L'OCR de catalogues d'antennes prend en charge OpenAI, Claude, Gemini et les LLM locaux (Ollama/compatibles OpenAI), avec choix du modèle et configuration des clés. Les clés proviennent de variables d'environnement ou de réglages enregistrés ; elles ne sont pas créées automatiquement et ne sont pas chiffrées sur disque. L'envoi au cloud exige un consentement explicite. En local, utilisez des images et convertissez d'abord les pages PDF. Vérifiez l'original, les preuves et les hypothèses avant validation. Voir [configuration IA et obtention des clés](docs/AI_SETTINGS.md), [OCR](docs/ANTENNA_OCR.md) et [antennes](docs/ANTENNA_PRESETS.md).

Vérification de liaison : le port interne est 8001, indépendant des ports publiés. `/api/health` vérifie la base, pas l'authentification. Ouvrez `http://localhost:18082/api/positions` pour tester le trajet depuis l'application. Une position absente/périmée bloque le calcul sans repli sur des coordonnées fixes. Le mot de passe web doit différer des deux jetons. Pour une passerelle distante, surchargez `environment.HF_POSITION_GATEWAY_URL` dans Compose : `.env` seul ne change pas l'URL par défaut fixe. Voir la [liste de vérification](docs/POSITION_INTERFACE.md#接続確認と障害の切り分け).

## Limites et sécurité

REL est une fiabilité mensuelle modélisée, pas une probabilité instantanée de connexion. Le SNR est normalisé à 1 Hz (dB·Hz) : `SNR_B ≈ SNR_1Hz − 10 log10(B_Hz)`. La modulation ne garantit pas le décodage ; indiquez le SNR adapté au modem et à la bande passante. Les étiquettes de polarisation ne calculent ni désadaptation ni rotation de Faraday ; la perte supplémentaire optionnelle de 0–30 dB est une hypothèse utilisateur.

Les approximations dimensionnelles des antennes ne sont pas des diagrammes mesurés sur avion/navire. Les références sans modèle approprié ne sont pas calculables. La diversité présente des bornes théoriques avec corrélation inconnue, sans combinaison de signaux ni commutation réelle ; l'estimation indépendante est facultative ([détails](docs/RX_DIVERSITY.md)). VOACAP est statistique et mensuel, sans représentation complète des tempêtes, du relief ou des installations. Les recommandations ne constituent aucune autorisation d'émettre.

L'application écoute uniquement sur localhost par défaut et ne possède pas d'authentification pour le web public. Pour un LAN de confiance, ajoutez `HF_BIND=0.0.0.0` à `.env`, redémarrez Compose et utilisez l'adresse LAN de l'hôte. Protégez tout accès non local par authentification/TLS. Pour changer de port : `HF_PORT=18084` (18083 est réservé par défaut à la passerelle).

## Développement et licences

Serveur en bibliothèque standard Python 3.12, JavaScript sans dépendances externes. Un seul calcul à la fois ; une requête concurrente reçoit HTTP 409.

```sh
python3 -m unittest discover -s tests -v
node --check app/static/app.js
```

Définissez `VOACAP_BIN` et `VOACAP_MODEL` pour les tests du moteur natif. Voir [API](docs/API.md) et [validation et limites des essais](docs/VALIDATION.md).

Le nouveau code est sous licence MIT ([LICENSE](LICENSE)). Les composants tiers et les données externes ont des **conditions distinctes** : [mentions tierces](THIRD_PARTY_NOTICES.md), [licences logicielles](SOFTWARE_LICENSES.md), [versions auditées](licenses/runtime-license-lock.json), [conditions des données](DATA_LICENSES.md). GIRO limite notamment les usages et le partage ; ne présumez pas d'un droit commercial illimité pour toutes les données NOAA/NICT.

Avec Docker, générez le paquet de redistribution :

```sh
python3 scripts/build_redistribution.py dist/redistribution
```

Distribuez le **répertoire généré entier**, avec sources correspondantes, licences et empreintes. Le script s'arrête en cas d'écart non audité ou de sources manquantes. Ne distribuez pas l'historique Git, les étapes intermédiaires ni les caches de compilation. Voir [redistribution](docs/REDISTRIBUTION.md).
