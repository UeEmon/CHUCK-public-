<p align="center"><img src="docs/images/chuck-icon.png" alt="CHUCK" width="140"></p>

# CHUCK

**C**overage & **H**F **U**sability **C**alculation **K**it

[日本語](README.md) | [English](README.en.md) | [Français](README.fr.md) | Español | [Italiano](README.it.md) | [Português](README.pt.md) | [Deutsch](README.de.md) | [한국어](README.ko.md)

CHUCK (Coverage & HF Usability Calculation Kit) es una aplicación web de predicción de propagación HF que utiliza el motor público VOACAP. Ofrece ocho idiomas sin API de traducción externa. No reutiliza la interfaz, JavaScript ni el código de servidor del sitio Marine.

Esta guía resume instalación, uso y limitaciones esenciales. El [README japonés](README.md) es la referencia detallada; los documentos técnicos y legales enlazados mantienen su idioma original.

## Manual de uso

Manual en japonés: 23 páginas y 24 capturas de la interfaz, con predicciones, pasarela y configuración de IA/OCR. [PDF](docs/manual/CHUCK_Operation_Manual_ja.pdf) / [Word](docs/manual/CHUCK_Operation_Manual_ja.docx). Referencia: `e790327`; consulte la documentación actual para cambios posteriores.

## Inicio

Instale Docker Desktop (Windows/macOS) o Docker Engine con Compose v2 (Linux):

```sh
git clone https://github.com/UeEmon/CHUCK-public-.git
cd CHUCK-public-
docker compose up -d --build
```

Abra **http://localhost:18082**. También puede ejecutar `sh Start.sh` en macOS/Linux o `./Start.ps1` en Windows PowerShell. La primera compilación requiere Internet. Se incluyen el código del motor y los mapas; después, el cálculo manual y la visualización del mapa funcionan sin conexión. Las fuentes externas y el OCR en la nube necesitan conexión.

```sh
docker compose down
docker compose logs --tail=100 -f
```

El historial y los preajustes se conservan en `hf-data`. `docker compose down -v` elimina los volúmenes persistentes, incluidos los datos de la pasarela. Exporte primero los resultados necesarios.

## Funciones y uso

- Arrastre el mapa mundial, también a través de 180° de longitud; amplíe con la rueda o rueda lateral. Los clics no mueven TX/RX.
- A la derecha, seleccione un TX y entre uno y ocho RX desde los preajustes. Puede intercambiar TX con un RX concreto. Con dos o más RX se activa la predicción por diversidad.
- Edite ubicaciones y antenas por separado. Las ciudades iniciales de Norteamérica, Asia oriental y Europa tienen coordenadas aproximadas, no ubicaciones de estaciones reales.
- Configure mes, número suavizado de manchas solares (SSN), potencia, hasta 11 frecuencias entre 2 y 30 MHz, antena, ruido, SNR y fiabilidad requeridos.
- Consulte predicciones de 24 horas (CCIR/Method 30) en las pestañas bajo el mapa: fiabilidad, diversidad y cobertura regional (máximo 35 puntos independientes). Seleccione una celda para detalles UTC y frecuencias recomendadas.
- Propagation Chart muestra REL/SNR y MUF por trayecto, selección de RX y exportación SVG. Incluye historial SQLite, CSV/JSON y entrada/salida VOACAP sin procesar.
- El modo malla calcula todos los pares de 2 a 8 estaciones en ambos sentidos y muestra la REL por frecuencia como matriz TX × RX, con control UTC y potencia, antena y ruido por estación. Las celdas con ↻ se alcanzan mediante 1–2 estaciones de relevo con cada salto igual o superior a la REL objetivo; no modela el retardo de relevo ni las interferencias. Véase [malla](docs/MESH.md).
- Bajo la predicción de 24 horas, el plan de frecuencias de operación de 24 h convierte las frecuencias calculadas en franjas horarias con el menor número de cambios (o la mejor cada hora), con exportación CSV e impresión. Véase [plan de frecuencias](docs/FREQUENCY_PLAN.md).
- La perspectiva de 12 meses calcula TX→RX1 durante doce meses desde el mes elegido y muestra la REL como tabla mes × UTC (una SSN manual para todos los meses o la SSN suavizada de NOAA de cada mes). Véase [perspectiva](docs/ANNUAL.md).
- La potencia necesaria calcula TX→RX1 en diez pasos 1-2-5 de 10 W a 10 kW y muestra, por UTC y frecuencia, la menor potencia que alcanza la REL objetivo. Véase [potencia necesaria](docs/POWER.md).
- Sitios candidatos ordena hasta 10 ubicaciones guardadas como sitios receptores (TX→candidato) o de retransmisión (TX→candidato→RX1) por las horas con la REL objetivo. Véase [sitios candidatos](docs/SITES.md).
- El recálculo programado vuelve a calcular los resultados punto a punto guardados con la última SSN suavizada de NOAA (cada 24 horas por defecto, `HF_WATCH_INTERVAL_HOURS`) y muestra un aviso si disminuyen las horas con la REL objetivo. No disponible para visitantes de la edición pública. Véase [recálculo programado](docs/WATCH.md).
- «Imprimir informe» en un resultado de un solo RX abre una página imprimible con las condiciones, la frecuencia recomendada por hora, el mapa de calor y el plan de frecuencias de 24 horas (se puede guardar como PDF desde el diálogo de impresión). Véase [informe](docs/REPORT.md).
- Las nuevas funciones se anuncian en la aplicación: un aviso y puntos en las pestañas marcan lo añadido desde la última visita, y «Novedades» lo enumera todo. Véase [novedades](docs/WHATS_NEW.md).
- Language permite elegir japonés, inglés, francés, español, italiano, portugués, alemán o coreano sin cambiar los nombres introducidos.

Cambiar las entradas no recalcula los resultados existentes. Ejecute de nuevo el cálculo. Se admiten hasta 200 ubicaciones y 200 antenas, con detección de conflictos de edición.

## Datos externos, estaciones móviles e IA

La pestaña de condiciones/meteorología espacial reúne NOAA (SSN/F10.7/R/S/G), D-RAP, NICT y GIRO opcional. Muestra por separado la hora de observación/publicación y la última adquisición correcta, con actualización individual o conjunta. El SSN automático debe coincidir con el mes exacto; no se usan valores caducados de forma silenciosa. Las demás observaciones no corrigen automáticamente VOACAP. El SSN de NOAA (escala SILSO V2) se multiplica por 0,7 antes del cálculo, como en VOACAP Online Marine; el SSN manual y el efectivo se usan tal cual. Consulte [meteorología espacial](docs/SPACE_WEATHER.md) y [fuentes internacionales](docs/INTERNATIONAL_IONOSPHERE.md).

GIRO está desactivado por defecto. Añada `HF_GIRO_ENABLED=1` a `.env` únicamente si cumple sus condiciones o dispone del permiso necesario. Si está desactivado, no se conecta a GIRO.

La pasarela independiente (**http://localhost:18083** por defecto) admite JSON, GeoJSON o NMEA 0183 RMC por estación y enlaza con la aplicación mediante HTTP(S)/JSON v1. Las estaciones recibidas pueden registrarse como ubicaciones. Cada cálculo fija la posición; no modela trayectorias ni altitud. Configure secretos distintos de al menos 32 caracteres en `HF_POSITION_INGEST_TOKEN` y `HF_POSITION_GATEWAY_TOKEN`; la web requiere además `HF_GATEWAY_UI_PASSWORD` de al menos 16 caracteres. Consulte [entrada de posiciones](docs/POSITION_INTERFACE.md), [protocolo](docs/GATEWAY_PROTOCOL.md) y [web de la pasarela](docs/GATEWAY_WEB_UI.md).

El OCR de catálogos de antenas admite OpenAI, Claude, Gemini y LLM locales (Ollama/compatibles con OpenAI), selección de modelos y configuración de claves. Las claves se cargan desde variables de entorno o ajustes guardados; no se emiten automáticamente ni se cifran en disco. La nube requiere consentimiento explícito. El OCR local admite imágenes; convierta primero las páginas PDF. Revise original, evidencias y supuestos antes de registrar una antena. Consulte [IA y obtención de claves](docs/AI_SETTINGS.md), [OCR](docs/ANTENNA_OCR.md) y [modelos de antena](docs/ANTENNA_PRESETS.md).

Comprobación de enlace: el puerto interno es 8001, independiente de los puertos publicados. `/api/health` comprueba la base de datos, no la autenticación. Abra `http://localhost:18082/api/positions` para verificar la conexión desde la aplicación. Una posición ausente/caducada bloquea el cálculo sin volver a coordenadas fijas. La contraseña web debe ser distinta de ambos tokens. Para una pasarela remota, sobrescriba `environment.HF_POSITION_GATEWAY_URL` en Compose; `.env` por sí solo no cambia la URL predeterminada fija. Consulte la [lista de comprobación](docs/POSITION_INTERFACE.md#接続確認と障害の切り分け).

## Límites y seguridad

REL es fiabilidad mensual modelada, no probabilidad instantánea de conexión. SNR se normaliza a 1 Hz (dB·Hz): `SNR_B ≈ SNR_1Hz − 10 log10(B_Hz)`. El nombre de modulación no garantiza decodificación: indique el SNR adecuado para módem y ancho de banda. La polarización seleccionada no calcula automáticamente desadaptación ni rotación de Faraday; la pérdida adicional opcional de 0–30 dB es un supuesto del usuario.

Las aproximaciones dimensionales no son diagramas medidos sobre aeronaves/buques. Las referencias sin modelo apropiado no pueden utilizarse para calcular. La diversidad muestra límites teóricos con correlación desconocida, sin combinar señales ni conmutar receptores; la estimación independiente es opcional ([detalles](docs/RX_DIVERSITY.md)). VOACAP es mensual y estadístico: no representa plenamente tormentas, terreno ni instalación. Las recomendaciones no conceden asignación de frecuencias ni permiso de operación.

La aplicación escucha en localhost por defecto y no tiene autenticación para la web pública. Para una LAN de confianza, añada `HF_BIND=0.0.0.0` a `.env`, reinicie Compose y use la IP LAN del equipo. Proteja accesos no locales con autenticación/TLS. Puede cambiar el puerto con `HF_PORT=18084`; 18083 ya es el puerto predeterminado de la pasarela.

## Desarrollo y licencias

Servidor con biblioteca estándar Python 3.12; JavaScript sin dependencias externas. Un cálculo simultáneo; las solicitudes concurrentes reciben HTTP 409.

```sh
python3 -m unittest discover -s tests -v
node --check app/static/app.js
```

Defina `VOACAP_BIN` y `VOACAP_MODEL` para pruebas con el motor nativo. Consulte [API](docs/API.md) y [validación y aspectos no probados](docs/VALIDATION.md).

El código nuevo usa MIT ([LICENSE](LICENSE)). Los componentes de terceros y los datos externos tienen **condiciones separadas**: [avisos](THIRD_PARTY_NOTICES.md), [licencias de software](SOFTWARE_LICENSES.md), [versiones auditadas](licenses/runtime-license-lock.json) y [condiciones de datos](DATA_LICENSES.md). GIRO restringe usos y redistribución; no suponga uso comercial ilimitado de todos los datos derivados de NOAA/NICT.

Con Docker, prepare la redistribución:

```sh
python3 scripts/build_redistribution.py dist/redistribution
```

Distribuya **todo el directorio generado**, incluidas fuentes correspondientes, licencias y hashes. El proceso se detiene ante diferencias no auditadas o fuentes ausentes. No incluya historial Git, etapas intermedias ni cachés de compilación. Consulte [redistribución](docs/REDISTRIBUTION.md).
