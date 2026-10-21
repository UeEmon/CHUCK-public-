/* Optional real-browser checks. Requires Playwright and a built native engine.
 * NODE_PATH=<Playwright package directory> HF_UI_BROWSER=<Chromium executable>
 * VOACAP_BIN=... VOACAP_MODEL=... node tests/ui_workbench.cjs
 * All databases are temporary. No app runtime npm dependencies are added.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hf-ui-'));
 const child=spawn('python3',['tests/ui_fixture.py'],{env:{...process.env,DATA_DIR:temp,HF_GATEWAY_DATA_DIR:temp,
  HF_POSITION_GATEWAY_TOKEN:'test-ui-internal-000000000000000000000',
  HF_POSITION_INGEST_TOKEN:'test-ui-external-000000000000000000000',HF_GATEWAY_UI_PASSWORD:'browser-test-password-12345',HF_UI_OCR_FIXTURE:'1'}});
 let browser,gatewayUrl;const errors=[];
 try{
  const url=await new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>reject(Error('UI fixture startup timed out')),10000);
   child.stdout.on('data',d=>{const gateway=d.toString().match(/GATEWAY_URL=(\S+)/);if(gateway)gatewayUrl=gateway[1];const match=d.toString().match(/UI_URL=(\S+)/);if(match){clearTimeout(timeout);resolve(match[1]);}});
   child.on('exit',c=>{clearTimeout(timeout);reject(Error('UI fixture exited '+c));});
   child.stderr.on('data',d=>{if(d.toString().includes('Traceback'))process.stderr.write(d);});
  });
  browser=await chromium.launch({executablePath:process.env.HF_UI_BROWSER||undefined,
   args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--no-zygote','--single-process'],headless:true});
  const page=await browser.newPage({viewport:{width:1500,height:1000}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await page.waitForFunction(()=>catalog.presets.some(p=>p.position_ref?.id==='ship'));
  assert.equal(await page.locator('.station-card').count(),2);
  const layout=await page.evaluate(()=>{
   const map=$('map').getBoundingClientRect(),right=document.querySelector('.station-setup').getBoundingClientRect(),out=$('prediction').getBoundingClientRect();
   return {left:map.right<=right.left,below:out.top>=map.bottom,within:out.right<=right.left};
  });
  assert.deepEqual(layout,{left:true,below:true,within:true});
  const initial=await page.evaluate(()=>JSON.stringify(circuit));
  for(const language of ['en','fr','es','it','pt','de','ko','ja']){
   await page.selectOption('#language',language);
   assert.equal(await page.locator('html').getAttribute('lang'),language);
   assert.equal(await page.evaluate(()=>JSON.stringify(circuit)),initial);
   const label=await page.locator('.tabs [data-tab="conditions-tab"]').innerText();
   assert.equal(label.includes('予察条件'),language==='ja');
  }
  await page.selectOption('#language','en');
  await page.reload();await page.waitForFunction(()=>catalog.presets.length>=30);
  assert.equal(await page.locator('#language').inputValue(),'en');
  assert.equal(await page.locator('#add-rx-site').innerText(),'＋ Add RX');
  await page.locator('.tabs [data-tab="conditions-tab"]').click();
  // UTC acquisition time is separate from observation time; explicit refresh bypasses TTL.
  let weatherCalls=0,observationCalls=0;
  await page.route('**/api/space-weather?*',route=>{
   const query=new URL(route.request().url()).searchParams;assert.equal(query.get('refresh'),'1');weatherCalls++;
   const fetched=1770000000+weatherCalls,sources=Object.fromEntries(['observed','predicted','scales'].map(k=>[k,{url:'https://example.org/'+k,fetched_at:fetched,stale:false,error:null,fetch_state:'downloaded'}]));
   route.fulfill({json:{target_month:'2026-10',ssn:{value:80,kind:'predicted',stale:false},current:{scales:{R:0,S:0,G:0},observed_at:'2026-01-01T00:00:00Z',stale:false},sources,note:'Fixture'}});
  });
  await page.route('**/api/observations?refresh=1',route=>{observationCalls++;route.fulfill({json:{drap:{data:null,fetched_at:1770000001,stale:true,error:'fixture unavailable',fetch_state:'failed',source_url:'https://example.org/drap'},nict:{data:null,fetched_at:null,stale:true,error:'fixture unavailable',fetch_state:'failed',source_url:'https://example.org/nict'},giro:{enabled:false},note:'Fixture'}});});
  await page.locator('#external-refresh-all').click();await page.waitForFunction(()=>!$('external-refresh-all').disabled);
  assert.equal(weatherCalls,1);assert.equal(observationCalls,1);
  assert.match(await page.locator('#external-data-times').innerText(),/2026-01-01/);
  assert.match(await page.locator('#external-data-times').innerText(),/UTC/);
  const fetchedBefore=await page.locator('#external-data-times tr').nth(1).locator('td').nth(2).textContent();
  await page.locator('#weather-refresh').click();await page.waitForFunction(()=>!$('weather-refresh').disabled);
  assert.equal(weatherCalls,2);assert.notEqual(await page.locator('#external-data-times tr').nth(1).locator('td').nth(2).textContent(),fetchedBefore);
  await page.unroute('**/api/space-weather?*');await page.unroute('**/api/observations?refresh=1');
  await page.selectOption('#modulation','A1A');assert.equal(await page.locator('[name=required_snr]').inputValue(),'24');
  assert.equal(await page.locator('[name=bandwidth]').inputValue(),'500H');
  await page.selectOption('#modulation','J3E');assert.equal(await page.locator('[name=required_snr]').inputValue(),'45');
  assert.equal(await page.locator('[name=bandwidth]').inputValue(),'3K00');
  await page.selectOption('#modulation','F1B');assert.equal(await page.locator('[name=bandwidth]').inputValue(),'304H');
  await page.selectOption('#snr-input','bandwidth');
  await page.fill('[name=bandwidth]','3K00');await page.fill('[name=inband_snr_db]','10');
  assert.match(await page.locator('#emission-designation').textContent(),/3K00F1B/);
  assert.equal(await page.locator('[name=required_snr]').inputValue(),'44.7712');
  await page.selectOption('#polarization-settings select','vertical');
  // The first selector is TX; all receiver conditions stay independent.
  await page.locator('#polarization-settings select').nth(1).selectOption('horizontal');
  await page.fill('[name=polarization_loss_db]','3');
  assert.equal(await page.locator('[name=ssn_source]').inputValue(),'noaa');assert.equal(await page.locator('#tx-selection .station-card #power_w').inputValue(),'1000');
  await page.selectOption('[name=ssn_source]','manual');
  const prediction=page.waitForResponse(r=>r.url().endsWith('/api/predict')&&r.request().method()==='POST');
  await page.locator('#predict').click();
  const response=await prediction;const run=await response.json();assert.equal(response.status(),200,JSON.stringify(run));
  assert.equal(run.parameters.modulation,'F1B');assert.equal(run.parameters.required_snr,44.7712);
  assert.equal(run.parameters.bandwidth,'3K00');assert.equal(run.parameters.bandwidth_hz,3000);
  assert.equal(run.parameters.tx_polarization,'vertical');assert.equal(run.parameters.rx_polarization,'horizontal');
  assert.equal(run.parameters.polarization_loss_db,3);assert.equal(run.ui_selection.version,2);
  await page.waitForFunction(()=>!busy);
  await page.locator('[data-tab="propagation-chart"]').click();
  assert.equal(await page.locator('#propagation-plot rect[role=button]').count(),24*run.parameters.frequencies.length);
  await page.selectOption('#chart-metric','snr_db_hz');
  if(process.env.HF_UI_QA_DIR)await page.locator('#propagation-chart').screenshot({path:path.join(process.env.HF_UI_QA_DIR,'chart.png')});
  assert.match(await page.locator('#propagation-plot svg title').first().textContent(),/SNR/);
  const download=page.waitForEvent('download');await page.locator('#chart-export').click();
  const file=await download;const svgText=fs.readFileSync(await file.path(),'utf8');
  assert.equal(await page.evaluate(s=>new DOMParser().parseFromString(s,'image/svg+xml').querySelector('parsererror')===null,svgText),true);
  await page.locator('#propagation-plot rect[role=button]').first().press('Enter');
  assert.equal(await page.locator('#prediction').isVisible(),true);
  // Both mouse buttons leave circuit locations untouched.
  await page.locator('#map').scrollIntoViewIfNeeded();
  const beforeMap=await page.evaluate(()=>JSON.stringify(circuit)),box=await page.locator('#map').boundingBox();
  await page.mouse.click(box.x+box.width*.5,box.y+box.height*.5,{button:'right'});
  await page.mouse.click(box.x+box.width*.5,box.y+box.height*.5);
  assert.equal(await page.evaluate(()=>JSON.stringify(circuit)),beforeMap);
  const globalCenter=await page.evaluate(()=>[...center]);
  await page.mouse.move(box.x+box.width*.6,box.y+box.height*.5);await page.mouse.down();
  await page.mouse.move(box.x+box.width*.6+130,box.y+box.height*.5,{steps:5});await page.mouse.up();
  assert.notDeepEqual(await page.evaluate(()=>[...center]),globalCenter);
  await page.evaluate(()=>{center=[0,250];drawMap();});
  assert.equal(await page.locator('#map use[href="#map-world"]').count(),2);
  assert.equal(await page.evaluate(()=>JSON.stringify(circuit)),beforeMap);
  await page.mouse.move(box.x+box.width*.6,box.y+box.height*.5);
  await page.mouse.wheel(0,-250);
  await page.waitForFunction(()=>zoom>1);
  const centerBefore=await page.evaluate(()=>[...center]);
  await page.mouse.down();await page.mouse.move(box.x+box.width*.6+40,box.y+box.height*.5+20,{steps:5});await page.mouse.up();
  assert.notDeepEqual(await page.evaluate(()=>[...center]),centerBefore);
  assert.equal(await page.evaluate(()=>JSON.stringify(circuit)),beforeMap);
  const zoomBefore=await page.evaluate(()=>zoom);
  await page.mouse.wheel(-160,0);await page.waitForFunction(z=>zoom>z,zoomBefore);
  await page.locator('#reset-map').click();
  assert.equal(await page.evaluate(()=>zoom),1);
  await page.locator('#add-rx-site').click();await page.locator('#add-rx-site').click();
  assert.equal(await page.locator('#rx-selections .station-card').count(),3);
  const beforeSwap=await page.evaluate(()=>JSON.parse(JSON.stringify(circuit)));
  await page.locator('#rx-selections .station-card').nth(1).locator('button').first().click();
  const swapped=await page.evaluate(()=>JSON.parse(JSON.stringify(circuit)));
  assert.deepEqual(swapped.tx,beforeSwap.rxs[1]);assert.deepEqual(swapped.rxs[1],beforeSwap.tx);
  assert.deepEqual(swapped.rxs[0],beforeSwap.rxs[0]);assert.deepEqual(swapped.rxs[2],beforeSwap.rxs[2]);
  const diversity=page.waitForResponse(r=>r.url().endsWith('/api/diversity')&&r.request().method()==='POST');
  await page.locator('#predict').click();const diversityResponse=await diversity;
  assert.equal(diversityResponse.status(),200);const multi=await diversityResponse.json();assert.equal(multi.sites.length,3);
  await page.waitForFunction(()=>!busy);
  await page.locator('[data-tab="propagation-chart"]').click();
  assert.equal(await page.locator('#chart-result').inputValue(),'diversity');
  assert.equal(await page.locator('#chart-site option').count(),3);
  await page.selectOption('#chart-site',multi.sites[1].id);
  assert.equal(await page.locator('#propagation-plot rect[role=button]').count(),24*multi.parameters.frequencies.length);
  if(process.env.HF_UI_DIAGNOSTICS)console.log('Result captions:',await page.locator('#result-caption,#diversity-caption,#diversity-note').allTextContents());
  for(const caption of await page.locator('#result-caption,#diversity-caption,#diversity-note').allTextContents())assert.equal(/[ぁ-んァ-ヶ一-龯]/.test(caption),false,caption);
  // Browser settings retain all endpoints and polarization selections.
  await page.locator('#save-settings').click();const saved=await page.evaluate(()=>JSON.stringify(circuit));
  await page.reload();await page.waitForFunction(()=>catalog.presets.length>=30&&circuit.rxs.length===3);
  assert.equal(await page.evaluate(()=>JSON.stringify(circuit)),saved);
  // Old history without radio fields must not inherit a prior bandwidth mode.
  await page.evaluate(()=>{fields.snr_input.value='bandwidth';fill(window.legacyRun={tx_lat:35.3,tx_lon:139.67,rx_lat:13.45,rx_lon:144.75,tx_antenna:'whip',rx_antenna:'whip',tx_gain:0,rx_gain:0,year:2026,month:10,ssn:80,power_w:150,frequencies:[4,8],noise:150,required_snr:40,reliability:90,min_angle:3});});
  assert.equal(await page.locator('#snr-input').inputValue(),'direct');
  assert.equal(await page.locator('[name=required_snr]').inputValue(),'40');
  assert.equal(await page.locator('#modulation').inputValue(),'manual');assert.equal(await page.locator('[name=bandwidth]').inputValue(),'3K00');
  // Earlier mode names load as the matching emission class.
  await page.evaluate(()=>fill({...legacyRun,modulation:'ssb'}));assert.equal(await page.locator('#modulation').inputValue(),'J3E');
  await page.evaluate(()=>fill({...legacyRun,modulation:'ofdm'}));assert.equal(await page.locator('#modulation').inputValue(),'manual');
  // Add/remove bounds and disabled states.
  while(await page.locator('#rx-selections .station-card').count()<8)await page.locator('#add-rx-site').click();
  assert.equal(await page.locator('#add-rx-site').isDisabled(),true);
  while(await page.locator('#rx-selections .station-card').count()>1)await page.locator('#rx-selections .station-card').last().locator('button').nth(1).click();
  assert.equal(await page.locator('#rx-selections .station-card button').nth(1).isDisabled(),true);
  // Catalog CRUD and user text survives language changes.
  await page.locator('.tabs [data-tab="antenna-presets"]').click();
  assert.equal(await page.evaluate(()=>catalog.antennas.length),21);
  // Directional models carry a main-beam setting; omnidirectional ones never show it.
  const groups=await page.evaluate(()=>[...document.querySelectorAll('#tx-selection optgroup')].filter(g=>g.querySelector('option[value^="standard-"]')).map(g=>[...g.children].map(o=>o.value).filter(v=>v.startsWith('standard-'))));
  assert.equal(groups.length,2);assert.ok(groups[0].includes('standard-vertical-10'));
  assert.deepEqual(groups[1],['standard-dipole-10','standard-dipole-20','standard-dipole-40','standard-lpda-25','standard-inverted-l-30','standard-sloper-40']);
  assert.equal(await page.evaluate(()=>catalog.antennas.find(a=>a.id==='standard-dipole-20').azimuth_mode),'path');
  await page.evaluate(()=>editCatalog('antennas',catalog.antennas.find(a=>a.id==='standard-whip-5')));
  assert.equal(await page.locator('#antenna-editor [name=azimuth_mode]').isVisible(),false);
  await page.evaluate(()=>editCatalog('antennas',catalog.antennas.find(a=>a.id==='standard-dipole-20')));
  assert.equal(await page.locator('#antenna-editor [name=azimuth_deg]').isDisabled(),true);
  await page.selectOption('#antenna-editor [name=azimuth_mode]','fixed');assert.equal(await page.locator('#antenna-editor [name=azimuth_deg]').isDisabled(),false);
  await page.selectOption('#antenna-editor [name=model]','sloping_long_wire');
  assert.equal(await page.locator('#antenna-editor [name=lw_slope_deg]').isVisible(),true);assert.equal(await page.locator('#antenna-editor [name=lp_tau]').isVisible(),false);
  await page.locator('#new-antenna').click();
  await page.fill('#antenna-editor [name=name]','Test LPDA');await page.selectOption('#antenna-editor [name=model]','log_periodic');
  assert.equal(await page.locator('#antenna-editor [name=lp_tau]').inputValue(),'0.9');await page.fill('#antenna-editor [name=lp_elements]','10');
  await page.locator('#antenna-editor button[type=submit]').click();await page.waitForFunction(()=>catalog.antennas.some(a=>a.name==='Test LPDA'));
  assert.deepEqual(await page.evaluate(()=>{const a=catalog.antennas.find(a=>a.name==='Test LPDA');return [a.length_m,a.height_m,a.lp_elements,a.lp_slope_deg];}),[25,10,10,90]);
  await page.evaluate(()=>mutateCatalog({collection:'antennas',action:'delete',id:catalog.antennas.find(a=>a.name==='Test LPDA').id}));
  await page.waitForFunction(()=>catalog.antennas.length===21);
  await page.locator('#new-antenna').click();
  assert.equal(await page.evaluate(()=>catalog.antennas.find(a=>a.id==='reference-air-p3-longwire').reference_only),true);
  await page.evaluate(()=>editCatalog('antennas',catalog.antennas.find(a=>a.id==='reference-jmsdf-nat201')));
  await page.locator('#antenna-editor button[type=submit]').click();await page.waitForFunction(()=>!$('antenna-editor').elements.id.value);
  assert.equal(await page.evaluate(()=>catalog.antennas.find(a=>a.id==='reference-jmsdf-nat201').length_m),5.783);
  await page.selectOption('#antenna-editor [name=model]','dipole');
  await page.fill('#antenna-editor [name=name]','Physical dipole');await page.fill('#antenna-editor [name=length_m]','22');
  await page.locator('#antenna-editor button[type=submit]').click();await page.waitForFunction(()=>catalog.antennas.some(a=>a.name==='Physical dipole'));
  assert.equal(await page.evaluate(()=>catalog.antennas.find(a=>a.name==='Physical dipole').length_m),22);
  await page.fill('#antenna-editor [name=name]','保存');await page.fill('#antenna-editor [name=gain]','4.5');
  await page.locator('#antenna-editor button[type=submit]').click();
  await page.waitForFunction(()=>catalog.antennas.some(a=>a.name==='保存'));
  await page.selectOption('#language','fr');
  assert.equal(await page.locator('#antennas-list td').filter({hasText:/^保存$/}).innerText(),'保存');
  // OCR upload creates review candidates, never an automatic catalog record.
  await page.selectOption('#language','en');
  await page.locator('#antenna-import-panel > summary').click();
  await page.waitForFunction(()=>antennaOCRConfig?.configured);
  await page.locator('#ai-settings-panel > summary').click();await page.waitForFunction(()=>aiSettings?.profiles.length===4);
  for(const provider of ['claude','gemini','local','openai']){
   await page.selectOption('#ai-settings-form [name=provider]',provider);
   if(provider==='claude'||provider==='gemini')await page.fill('#ai-settings-form [name=api_key]',provider+'-ui-secret');
   await page.locator('#ai-models').click();await page.waitForFunction(()=>!aiLoading&&$('ai-model-options').children.length===1);
   assert.equal(await page.locator('#ai-model-options option').getAttribute('value'),provider+'-vision-test');
   await page.fill('#ai-settings-form [name=model]',provider+'-vision-test');
   await page.locator('#ai-save').click();await page.waitForFunction(p=>aiSettings.provider===p&&antennaOCRConfig.provider===p,provider);
   assert.equal(await page.locator('#ai-settings-form [name=api_key]').inputValue(),'');
   const settingsBody=await page.evaluate(()=>fetch('/api/ai-settings').then(r=>r.text()));assert.equal(settingsBody.includes('-ui-secret'),false);
   if(provider==='local'){assert.equal(await page.locator('#antenna-import-form [name=file]').getAttribute('accept'),'image/png,image/jpeg,image/webp');}
  }
  await page.selectOption('#ai-settings-form [name=provider]','claude');
  assert.equal(await page.locator('#ai-settings-form [name=model]').inputValue(),'claude-vision-test');
  await page.locator('#ai-key-guide > summary').click();
  assert.match(await page.locator('#ai-key-steps').innerText(),/Claude Console/);
  if(process.env.HF_UI_QA_DIR)await page.locator('#ai-settings-panel').screenshot({path:path.join(process.env.HF_UI_QA_DIR,'ai-settings.png')});
  await page.selectOption('#ai-settings-form [name=provider]','openai');
  await page.locator('#ai-settings-panel > summary').click();
  const countBeforeOCR=await page.evaluate(()=>catalog.antennas.length);
  await page.locator('#antenna-import-form [name=file]').setInputFiles({name:'fixture-catalog.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\nfixture')});
  await page.locator('#antenna-import-form [name=source_url]').fill('https://example.org/catalog.pdf');
  await page.locator('#antenna-import-form [name=external_processing]').check();
  await page.locator('#ocr-submit').click();await page.waitForFunction(()=>antennaDocument?.extraction.candidates.length===1&&!ocrReading);
  assert.equal(await page.evaluate(()=>catalog.antennas.length),countBeforeOCR);
  assert.match(await page.locator('#ocr-candidates').innerText(),/Electrical length 7.5 m/);
  await page.locator('#ocr-candidates .ocr-candidate button').click();
  if(process.env.HF_UI_QA_DIR)await page.locator('#antenna-import-panel').screenshot({path:path.join(process.env.HF_UI_QA_DIR,'antenna-ocr.png')});
  assert.equal(await page.locator('#antenna-editor [name=reference_only]').isChecked(),true);
  assert.equal(await page.evaluate(()=>$('antenna-editor').checkValidity()),false);
  await page.selectOption('#antenna-editor [name=model]','monopole');
  assert.equal(await page.locator('#antenna-editor [name=length_m]').inputValue(),'10');
  assert.equal(await page.locator('#antenna-editor [name=gain]').inputValue(),'0');
  await page.locator('#ocr-reviewed').check();
  await page.locator('#antenna-editor [name=reference_only]').uncheck();
  assert.equal(await page.evaluate(()=>$('antenna-editor').checkValidity()),false);
  await page.locator('#ocr-approximation').check();
  await page.locator('#antenna-editor button[type=submit]').click();
  await page.waitForFunction(()=>catalog.antennas.some(a=>a.name==='Test 10 m whip'&&a.document_ref?.reviewed));
  assert.equal(await page.evaluate(()=>catalog.antennas.find(a=>a.name==='Test 10 m whip').length_m),10);
  assert.equal(await page.evaluate(()=>{
   const before=JSON.parse(JSON.stringify(circuit)),a=catalog.antennas.find(a=>a.name==='Test 10 m whip'),ref=a.document_ref;
   circuit.tx.antenna_id=a.id;const snapshot=JSON.parse(JSON.stringify(circuitSnapshot()));a.document_ref={...ref,id:'f'.repeat(32)};
   restoreCircuit(snapshot,{});const preserved=antennaFor(circuit.tx).document_ref.id===ref.id;
   a.document_ref=ref;circuit=before;renderCircuit();return preserved;
  }),true);
  await page.locator('#new-antenna').click();
  assert.equal(await page.locator('#ocr-review').isVisible(),false);
  assert.equal(await page.evaluate(()=>!!$('antenna-editor').dataset.documentRef),false);
  await page.locator('.tabs [data-tab="location-presets"]').click();
  await page.fill('#location-editor [name=name]','User test location');
  await page.fill('#location-editor [name=lat]','42.5');await page.fill('#location-editor [name=lon]','12.5');
  await page.locator('#location-editor button[type=submit]').click();
  await page.waitForFunction(()=>catalog.presets.some(p=>p.name==='User test location'));
  await page.reload();await page.waitForFunction(()=>catalog.presets.some(p=>p.name==='User test location'));
  // Mobile preset resolves a new live position rather than its catalog snapshot.
  await page.evaluate(()=>{
   const mobile=catalog.presets.find(p=>p.position_ref?.id==='ship');circuit.rxs[0].location_id=mobile.id;
   positionData.positions.find(p=>p.id==='ship').lat=31.25;renderCircuit();
  });
  assert.equal(await page.evaluate(()=>circuitParams().rx_lat),31.25);
  assert.equal(await page.evaluate(()=>circuitParams().rx_position.id),'ship');
  await page.evaluate(()=>{positionData.positions.find(p=>p.id==='ship').stale=true;});
  assert.equal(await page.evaluate(()=>{try{validateCircuit();return false;}catch{return true;}}),true);
  // Every supported locale covers every static source key except proper language names.
  const missing=await page.evaluate(()=>{
   const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),out=[];
   while(walker.nextNode()){
    const n=walker.currentNode;if(n.parentElement.closest('script,style,#language,[data-user-content],#locations-list,#antennas-list,#station-selection,#map,#polarization-settings,#positions-table,#position-stations'))continue;
    const source=n.textContent.trim();if(/[ぁ-んァ-ヶ一-龯]/.test(source)&&HF_I18N.translate(source)===source)out.push(source);
   }return out;
  });
  assert.deepEqual(missing,[]);
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),true);
  if(process.env.HF_UI_SCREENSHOT)await page.screenshot({path:process.env.HF_UI_SCREENSHOT,fullPage:true});
  // Standalone gateway UI: password session, configuration, locale persistence.
  await page.goto(gatewayUrl);await page.locator('#login-panel').waitFor();
  await page.selectOption('#language','en');
  await page.fill('#login-form [name=password]','browser-test-password-12345');await page.locator('#login-form button').click();
  await page.locator('#management').waitFor();assert.equal(await page.locator('#login-form [name=password]').inputValue(),'');
  await page.fill('#station-form [name=source]','air');await page.fill('#station-form [name=id]','plane');
  await page.fill('#station-form [name=name]','UI aircraft');await page.selectOption('#station-form [name=kind]','aircraft');
  await page.selectOption('#station-form [name=protocol]','geojson');await page.locator('#station-form button[type=submit]').click();
  await page.locator('#station-list td').filter({hasText:/^UI aircraft$/}).waitFor();
  assert.equal(await page.locator('#station-list tr').filter({hasText:'UI aircraft'}).locator('td').nth(3).textContent(),'geojson');
  if(process.env.HF_UI_QA_DIR){await page.setViewportSize({width:1400,height:1000});await page.screenshot({path:path.join(process.env.HF_UI_QA_DIR,'gateway.png'),fullPage:true});}
  for(const language of ['ja','fr','es','it','pt','de','ko','en']){await page.selectOption('#language',language);assert.equal(await page.locator('html').getAttribute('lang'),language);}
  const status=await page.evaluate(()=>fetch('/ui/api/status').then(r=>r.text()));assert.equal(status.includes('test-ui-internal'),false);assert.equal(status.includes('browser-test-password'),false);
  await page.reload();await page.locator('#management').waitFor();await page.locator('#logout').click();await page.locator('#login-panel').waitFor();
  assert.equal(await page.evaluate(()=>fetch('/ui/api/status').then(r=>r.status)),401);
  assert.deepEqual(errors,[]);
  console.log('PASS: 8 locales, catalogs/P-3, 4 AI profiles/models/secret handling, OCR review (fixture), real engine/chart/map and gateway administration');
 }finally{if(browser)await browser.close();child.kill();fs.rmSync(temp,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
