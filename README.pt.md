<p align="center"><img src="docs/images/chuck-icon.png" alt="CHUCK" width="140"></p>

# CHUCK

**C**overage & **H**F **U**sability **C**alculation **K**it

[日本語](README.md) | [English](README.en.md) | [Français](README.fr.md) | [Español](README.es.md) | [Italiano](README.it.md) | Português | [Deutsch](README.de.md) | [한국어](README.ko.md)

CHUCK (Coverage & HF Usability Calculation Kit) é uma aplicação web de previsão de propagação HF baseada no motor público VOACAP. Oferece oito idiomas sem API externa de tradução. Não reutiliza a interface, o JavaScript ou o código de servidor do site Marine.

Este guia resume instalação, operação e limitações essenciais. O [README japonês](README.md) é a referência detalhada; os documentos técnicos e legais vinculados mantêm o idioma original.

## Manual de operação

Manual em japonês: 23 páginas e 24 capturas da interface, incluindo previsões, gateway e configuração de IA/OCR. [PDF](docs/manual/CHUCK_Operation_Manual_ja.pdf) / [Word](docs/manual/CHUCK_Operation_Manual_ja.docx). Referência: `e790327`; consulte a documentação atual para alterações posteriores.

## Início

Instale Docker Desktop (Windows/macOS) ou Docker Engine com Compose v2 (Linux):

```sh
git clone https://github.com/UeEmon/CHUCK-public-.git
cd CHUCK-public-
docker compose up -d --build
```

Abra **http://localhost:18082**. Alternativas: `sh Start.sh` no macOS/Linux ou `./Start.ps1` no Windows PowerShell. A primeira compilação precisa de Internet. O código do motor e os mapas estão incluídos; depois, cálculos manuais e mapas funcionam offline. Dados externos e OCR na nuvem precisam de conexão.

```sh
docker compose down
docker compose logs --tail=100 -f
```

Histórico e predefinições permanecem no volume `hf-data`. `docker compose down -v` apaga os volumes persistentes, inclusive dados do gateway: exporte primeiro os resultados necessários.

## Recursos e operação

- Arraste o mapa mundial, inclusive através de 180° de longitude; use a roda/roda lateral para zoom. Cliques não movem TX/RX.
- À direita, escolha um TX e de um a oito RX por predefinições. Troque TX com um RX específico. Dois ou mais RX ativam a previsão de diversidade.
- Edite locais e antenas em telas separadas. As cidades iniciais da América do Norte, Ásia Oriental e Europa têm coordenadas aproximadas, não posições reais de estações rádio.
- Defina mês, número suavizado de manchas solares (SSN), potência, até 11 frequências de 2 a 30 MHz, antena, ruído, SNR e confiabilidade exigidos.
- As abas abaixo do mapa apresentam previsões de 24 horas (CCIR/Method 30), diversidade e cobertura regional (até 35 pontos independentes). Selecione uma célula para detalhes UTC e frequências recomendadas.
- Propagation Chart com REL/SNR, MUF por percurso, seleção de RX e exportação SVG. Histórico SQLite, CSV/JSON e entrada/saída original VOACAP disponíveis.
- O modo malha calcula todos os pares de 2 a 8 estações nos dois sentidos e mostra a REL por frequência como matriz TX × RX, com controle UTC e potência, antena e ruído por estação. As células com ↻ são alcançáveis por 1–2 estações de retransmissão com cada salto igual ou acima da REL alvo; atraso de retransmissão e interferência não são modelados. Veja [malha](docs/MESH.md).
- Abaixo da previsão de 24 horas, o plano de frequências de operação de 24 h transforma as frequências calculadas em faixas horárias com o menor número de trocas (ou a melhor a cada hora), com exportação CSV e impressão. Veja [plano de frequências](docs/FREQUENCY_PLAN.md).
- A perspectiva de 12 meses calcula TX→RX1 por doze meses a partir do mês escolhido e mostra a REL como tabela mês × UTC (uma SSN manual para todos os meses ou a SSN suavizada da NOAA de cada mês). Veja [perspectiva](docs/ANNUAL.md).
- Em Language, escolha japonês, inglês, francês, espanhol, italiano, português, alemão ou coreano sem alterar nomes cadastrados.

Alterar entradas não recalcula resultados existentes: execute novamente. Até 200 locais e 200 antenas, com detecção de conflitos de edição.

## Dados externos, estações móveis e IA

A aba condições/clima espacial reúne NOAA (SSN/F10.7/R/S/G), D-RAP, NICT e GIRO opcional. Mostra separadamente o horário de observação/publicação e a última obtenção bem-sucedida, com atualização individual ou conjunta. O SSN automático precisa corresponder ao mês exato; valores vencidos não são usados silenciosamente. As demais observações não corrigem automaticamente o VOACAP. Veja [clima espacial](docs/SPACE_WEATHER.md) e [fontes internacionais](docs/INTERNATIONAL_IONOSPHERE.md).

GIRO fica desativado por padrão. Adicione `HF_GIRO_ENABLED=1` ao `.env` somente quando seu uso cumprir as condições ou tiver autorização. Desativado, não há conexão ao GIRO.

O gateway independente (**http://localhost:18083**) recebe JSON, GeoJSON ou NMEA 0183 RMC por estação e comunica-se com a aplicação por HTTP(S)/JSON v1. Estações recebidas podem virar predefinições de local. A posição é fixada para cada cálculo; rota e altitude não são modeladas. Configure segredos distintos de pelo menos 32 caracteres em `HF_POSITION_INGEST_TOKEN` e `HF_POSITION_GATEWAY_TOKEN`. A interface web também exige `HF_GATEWAY_UI_PASSWORD` com pelo menos 16 caracteres. Veja [posições](docs/POSITION_INTERFACE.md), [protocolo](docs/GATEWAY_PROTOCOL.md) e [interface do gateway](docs/GATEWAY_WEB_UI.md).

O OCR de catálogos de antenas aceita OpenAI, Claude, Gemini e LLMs locais (Ollama/compatíveis com OpenAI), seleção de modelos e configuração de chaves. As chaves vêm de variáveis de ambiente ou configurações salvas; não são emitidas automaticamente nem criptografadas em disco. A nuvem exige consentimento explícito. OCR local aceita imagens: converta primeiro as páginas PDF. Confira original, evidências e hipóteses antes de cadastrar antenas. Veja [IA e obtenção de chaves](docs/AI_SETTINGS.md), [OCR](docs/ANTENNA_OCR.md) e [antenas](docs/ANTENNA_PRESETS.md).

Verificação da conexão: a porta interna é 8001, independente das portas publicadas. `/api/health` verifica o banco, não a autenticação. Abra `http://localhost:18082/api/positions` para testar o caminho desde a aplicação. Posições ausentes/vencidas bloqueiam o cálculo sem recorrer a coordenadas fixas. A senha web deve ser diferente dos dois tokens. Para um gateway remoto, sobrescreva `environment.HF_POSITION_GATEWAY_URL` no Compose; somente `.env` não altera a URL padrão fixa. Veja a [lista de verificação](docs/POSITION_INTERFACE.md#接続確認と障害の切り分け).

## Limitações e segurança

REL é confiabilidade mensal modelada, não probabilidade instantânea de conexão. SNR é normalizado para 1 Hz (dB·Hz): `SNR_B ≈ SNR_1Hz − 10 log10(B_Hz)`. O nome da modulação não garante decodificação: informe o SNR adequado ao modem e à largura de banda. Rótulos de polarização não calculam automaticamente descasamento ou rotação de Faraday; a perda adicional opcional de 0–30 dB é uma hipótese do usuário.

Aproximações dimensionais de antenas não são diagramas medidos em aeronaves/navios. Referências sem modelo apropriado não podem ser usadas no cálculo. A diversidade mostra limites teóricos com correlação desconhecida, sem combinar sinais ou comutar receptores; a estimativa independente é opcional ([detalhes](docs/RX_DIVERSITY.md)). VOACAP é mensal e estatístico: não representa completamente tempestades, terreno e instalação. Recomendações não concedem autorização para operar frequências.

A aplicação escuta em localhost por padrão e não tem autenticação para a web pública. Para uma LAN confiável, adicione `HF_BIND=0.0.0.0` ao `.env`, reinicie Compose e use o IP LAN do host. Proteja acessos não locais com autenticação/TLS. Para mudar a porta: `HF_PORT=18084`; 18083 já é a porta padrão do gateway.

## Desenvolvimento e licenças

Servidor com biblioteca padrão Python 3.12; JavaScript sem dependências externas. Um cálculo por vez; solicitações concorrentes recebem HTTP 409.

```sh
python3 -m unittest discover -s tests -v
node --check app/static/app.js
```

Defina `VOACAP_BIN` e `VOACAP_MODEL` para testar o motor nativo. Veja [API](docs/API.md) e [validação e itens não testados](docs/VALIDATION.md).

Código novo sob MIT ([LICENSE](LICENSE)). Componentes de terceiros e dados externos têm **condições separadas**: [avisos](THIRD_PARTY_NOTICES.md), [licenças de software](SOFTWARE_LICENSES.md), [versões auditadas](licenses/runtime-license-lock.json) e [condições dos dados](DATA_LICENSES.md). GIRO restringe usos e compartilhamento; não presuma uso comercial irrestrito de todos os dados NOAA/NICT.

Com Docker, prepare a redistribuição:

```sh
python3 scripts/build_redistribution.py dist/redistribution
```

Distribua **todo o diretório gerado**, com fontes correspondentes, licenças e hashes. Diferenças não auditadas ou fontes ausentes interrompem o processo. Exclua histórico Git, estágios intermediários e caches de compilação. Veja [redistribuição](docs/REDISTRIBUTION.md).
