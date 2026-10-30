/* Screenshots for the operation manuals (docs/manual/build_manual.py) in every screen language.
 * Each result is computed once; the screen is then switched through the languages and shot again.
 * Needs the real VOACAP engine (voacapl) and the UI fixture, which stubs the paid OCR API:
 *   DATA_DIR=<empty dir> HF_GATEWAY_DATA_DIR=<same> HF_UI_OCR_FIXTURE=1 HF_GATEWAY_UI_PASSWORD=<password> \
 *     HF_POSITION_GATEWAY_TOKEN=<32+ chars> HF_POSITION_INGEST_TOKEN=<32+ chars> python3 tests/ui_fixture.py
 *   NODE_PATH=<Playwright package directory> HF_GATEWAY_UI_PASSWORD=<password> \
 *     node docs/manual/capture_screens.cjs <UI_URL> <GATEWAY_URL> docs/manual/images [ja,en,...] [step,...]
 * Images go to docs/manual/images/<language>/.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const [url,gatewayUrl,out,languageList,only]=process.argv.slice(2);
const languages=(languageList||'ja,en,fr,es,it,pt,de,ko').split(',');
for(const language of languages)fs.mkdirSync(path.join(out,language),{recursive:true});
let current=languages[0];
const file=name=>path.join(out,current,name+'.png');
const wanted=step=>!only||only.split(',').includes(step);
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.HF_UI_BROWSER||undefined,args:['--no-sandbox','--disable-dev-shm-usage'],headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1.5,locale:'ja-JP',timezoneId:'UTC'});
 const page=await context.newPage();
 page.on('pageerror',e=>console.error('pageerror',e.message));
 const shot=async(target,name,options={})=>{
  const locator=typeof target==='string'?page.locator(target).first():target,page_=locator.page();
  await locator.scrollIntoViewIfNeeded();await page_.waitForTimeout(300);
  await locator.screenshot({path:file(name),...options});console.log('saved',current,name);
 };
 const clip=async(name,top,bottom,{left=top,padding=12}={})=>{
  // Union of two elements' boxes, page coordinates.
  const box=await page.evaluate(([t,b,l,p])=>{const r=s=>document.querySelector(s).getBoundingClientRect();const a=r(t),z=r(b),w=r(l);
   return {x:w.left+scrollX,y:a.top+scrollY-p,width:w.width,height:z.bottom-a.top+2*p};},[top,bottom,left,padding]);
  await page.screenshot({path:file(name),clip:box,fullPage:true});console.log('saved',current,name);
 };
 // Zoom the map toward the western Pacific so the example paths are readable.
 const focusMap=async(steps=2)=>{
  await page.locator('#reset-map').click();await page.locator('#map').scrollIntoViewIfNeeded();
  const box=await page.locator('#map').boundingBox();
  await page.mouse.move(box.x+box.width*.84,box.y+box.height*.42);
  for(let i=0;i<steps;i++){await page.mouse.wheel(0,-120);await page.waitForTimeout(200);}
  // Drag the zoomed area back toward the centre.
  if(steps){await page.mouse.down();await page.mouse.move(box.x+box.width*.6,box.y+box.height*.45,{steps:8});await page.mouse.up();await page.waitForTimeout(200);}
 };
 // Runs the shots once per screen language; selectors never depend on the screen text.
 const each=async(shots,target=page)=>{
  for(const language of languages){current=language;await target.selectOption('#language',language);await target.waitForTimeout(200);await shots();}
 };
 const tab=async id=>{await page.locator(`.tabs [data-tab="${id}"]`).click();await page.waitForTimeout(300);};
 const compute=async()=>{await page.locator('#predict').click();await page.waitForFunction(()=>!busy,null,{timeout:600000});};
 // Report windows are captured instead of printed.
 const report=async(button,name)=>{
  await page.evaluate(()=>{window.printed=null;const open=window.open;window.open=(...args)=>{const w=open(...args);w.print=()=>{window.printed=w.document.documentElement.outerHTML;w.close();};return w;};});
  await page.locator(button).click();await page.waitForFunction(()=>window.printed);
  const html=await page.evaluate(()=>window.printed);
  const view=await context.newPage();await view.setViewportSize({width:1000,height:900});await view.setContent(html);
  await view.screenshot({path:file(name),fullPage:true});await view.close();console.log('saved',current,name);
 };

 await page.goto(url);await page.waitForFunction(()=>catalog.presets.length>=30);
 // Fixed example circuit: Yokosuka (20 m dipole) to Guam (10 m whip), November 2026, SSN 100 by hand.
 await page.evaluate(()=>{
  circuit.tx={location_id:'default-yokosuka',antenna_id:'standard-dipole-20',noise:150,polarization:'model'};
  circuit.rxs=[{location_id:'default-guam',antenna_id:'standard-whip-10',noise:150,polarization:'model'}];renderCircuit();
 });
 await tab('conditions-tab');
 await page.fill('#year','2026');await page.selectOption('#month','11');
 await page.selectOption('[name=ssn_source]','manual');await page.fill('[name=ssn]','100');
 await page.selectOption('#modulation','J3E');
 await tab('prediction');

 if(wanted('start')){
  await page.locator('#news-banner-close').click();
  await each(async()=>{
   await page.evaluate(()=>scrollTo(0,0));
   await page.screenshot({path:file('01-start')});console.log('saved',current,'01-start');
   await shot('.topline-actions','02-manual-buttons',{});
   await shot('.station-setup','03-stations');
  });
 }
 if(wanted('conditions')){
  await tab('conditions-tab');
  await page.locator('#conditions details > summary').first().click();
  await each(async()=>{
   await shot('#conditions-tab > .panel','04-conditions');
   await shot(page.locator('#conditions fieldset').nth(1),'05-emission');
   await shot('#conditions details','06-advanced');
   await shot('#conditions fieldset:has(#rel-excellent)','06b-rel-threshold');
  });
 }
 if(wanted('external')){
  await tab('conditions-tab');
  await each(async()=>{
   await clip('40-external','#conditions-tab > section.panel','#conditions-tab .weather-panel');
   await shot('#observations','41-observations');
  });
 }
 await compute();
 if(wanted('prediction')){
  await tab('prediction');
  // Selecting a cell selects its frequency row and its hour everywhere.
  await page.locator('#heatmap tr').nth(9).locator('button').nth(3).click();
  await focusMap();
  await page.evaluate(()=>{$('map-hour').value=3;$('map-hour').dispatchEvent(new Event('input'));});
  await each(async()=>{
   await shot('.map-panel','07-map-time');
   await clip('08-heatmap','#prediction > .metrics','#prediction > .panel',{left:'#prediction'});
   await page.selectOption('#rel-display','grade');
   await shot('.map-panel','09-map-grade');
   await shot(page.locator('#prediction > .panel').first(),'10-heatmap-grade');
   await page.selectOption('#rel-display','percent');
   await shot(page.locator('#prediction > .panel').nth(1),'11-detail');
   await shot(page.locator('#prediction > .panel').nth(2),'12-plan');
   await report('#report-print','13-report');
  });
 }
 if(wanted('chart')){
  await tab('propagation-chart');
  await each(()=>shot('#propagation-chart','14-chart'));
 }
 if(wanted('coverage')){
  await tab('coverage');
  await page.locator('#compute-coverage').click();await page.waitForFunction(()=>!busy&&coverageResult,null,{timeout:600000});
  await focusMap(1);
  await each(async()=>{await shot('.map-panel','15-coverage-map');await shot('#coverage','16-coverage');});
 }
 if(wanted('diversity')){
  await page.evaluate(()=>{circuit.rxs=['default-guam','default-chichijima','default-naha'].map(id=>({location_id:id,antenna_id:'standard-whip-10',noise:150,polarization:'model'}));renderCircuit();});
  await compute();
  await page.locator('#diversity-heatmap tr').nth(5).locator('button').nth(3).click();
  await focusMap();
  await each(async()=>{
   await shot('.station-setup','17-diversity-stations');
   await shot(page.locator('#diversity > .panel').nth(1),'18-diversity-heatmap');
   await shot(page.locator('#diversity > .panel').nth(2),'19-diversity-sites');
   await shot('.map-panel','20-diversity-map');
  });
 }
 if(wanted('mesh')){
  await page.locator('#mesh-mode').check();
  await page.evaluate(()=>{circuit.tx={location_id:'default-yokosuka',antenna_id:'standard-whip-10',noise:150,polarization:'model',power_w:500};
   circuit.rxs=['default-naha','default-chichijima','default-guam','default-singapore'].map(id=>({location_id:id,antenna_id:'standard-whip-10',noise:150,polarization:'model',power_w:500}));renderCircuit();});
  await compute();
  await page.selectOption('#mesh-frequency','best');
  await page.evaluate(()=>{$('mesh-hour').value=12;$('mesh-hour').dispatchEvent(new Event('input'));});
  await each(()=>shot(page.locator('#mesh > .panel').nth(1),'21-mesh-matrix'));
  const relayed=page.locator('#mesh-matrix button:has(i)').first();
  if(await relayed.count()){await relayed.click();await page.waitForTimeout(300);}
  await focusMap(0);
  await each(async()=>{await shot(page.locator('#mesh > .panel').nth(2),'22-mesh-link');await shot('.map-panel','23-mesh-map');});
  await page.locator('#mesh-mode').uncheck();
  await page.evaluate(()=>{circuit.tx={location_id:'default-yokosuka',antenna_id:'standard-dipole-20',noise:150,polarization:'model'};
   circuit.rxs=[{location_id:'default-guam',antenna_id:'standard-whip-10',noise:150,polarization:'model'}];renderCircuit();});
  await compute();
 }
 if(wanted('annual')){
  await tab('annual');await page.locator('#compute-annual').click();await page.waitForFunction(()=>!busy&&!$('annual-exports').hidden,null,{timeout:900000});
  await each(()=>shot(page.locator('#annual > .panel').first(),'24-annual'));
 }
 if(wanted('power')){
  await tab('power');await page.locator('#compute-power').click();await page.waitForFunction(()=>!busy&&!$('power-exports').hidden,null,{timeout:900000});
  await each(async()=>{await shot(page.locator('#power > .panel').first(),'25-power');await shot(page.locator('#power > .panel').nth(1),'26-power-steps');});
 }
 if(wanted('sites')){
  await tab('sites');
  for(const id of ['default-chichijima','default-naha','default-taipei','default-honolulu','default-singapore','default-sydney'])await page.locator(`#site-candidates input[value="${id}"]`).check();
  await page.locator('#compute-sites').click();await page.waitForFunction(()=>!busy&&!$('sites-exports').hidden,null,{timeout:900000});
  await each(async()=>{await shot(page.locator('#sites > .panel').first(),'27-sites-setup');await shot(page.locator('#sites > .panel').nth(1),'28-sites');});
 }
 if(wanted('presets')){
  await tab('location-presets');
  await page.evaluate(()=>editCatalog('locations',catalog.presets[0]));
  await each(()=>shot('#location-presets > .panel','29-locations'));
  await tab('antenna-presets');
  await page.evaluate(()=>editCatalog('antennas',catalog.antennas.find(a=>a.id==='standard-dipole-20')));
  await page.locator('#pattern-panel > summary').click();
  await each(async()=>{await shot('#antenna-editor','30-antenna-editor');await shot('#pattern-panel','31-pattern');});
  await page.locator('#pattern-panel > summary').click();
 }
 if(wanted('ai')){
  await tab('antenna-presets');
  await page.locator('#antenna-import-panel > summary').click();
  await page.locator('#ai-settings-panel > summary').click();await page.waitForFunction(()=>aiSettings?.profiles.length===4);
  await page.locator('#ai-models').click();await page.waitForFunction(()=>!aiLoading&&$('ai-model-options').children.length>=1);
  await page.locator('#ai-key-guide > summary').click();
  await each(()=>shot('#ai-settings-panel','32-ai-settings'));
  await page.locator('#ai-settings-panel > summary').click();
  await page.locator('#antenna-import-form [name=file]').setInputFiles({name:'catalog.png',mimeType:'image/png',buffer:fs.readFileSync(path.join(__dirname,'../../app/static/chuck-icon.png'))});
  await page.locator('#antenna-import-form [name=source_url]').fill('https://example.org/catalog.pdf');
  await page.locator('#antenna-import-form [name=external_processing]').check();
  await page.locator('#ocr-submit').click();await page.waitForFunction(()=>antennaDocument?.extraction.candidates.length>=1&&!ocrReading);
  await each(()=>shot('#antenna-import-panel','33-ocr'));
  await page.locator('#ocr-candidates .ocr-candidate button').first().click();
  await each(()=>shot('#antenna-editor','34-ocr-review'));
  await page.locator('#antenna-import-panel > summary').click();
 }
 if(wanted('positions')){
  await tab('positions');await page.locator('#positions-refresh').click();await page.waitForTimeout(800);
  await page.locator('#positions details > summary').click();
  await each(()=>shot('#positions > .panel','35-positions'));
 }
 if(wanted('history')){
  await tab('history');
  await page.evaluate(()=>result&&!watchData?.watches.some(w=>w.result_id===result.id)&&editWatch({action:'add',result_id:result.id}));
  await page.locator('#refresh-history').click();await page.waitForTimeout(1500);
  await each(()=>shot('#history','36-history'));
 }
 if(wanted('news')){
  await page.locator('#whats-new-open').click();await page.waitForTimeout(400);
  await each(()=>shot('#whats-new','37-whats-new'));
  await page.locator('#whats-new-close').click();
 }
 if(wanted('gateway')&&gatewayUrl){
  const g=await context.newPage();await g.goto(gatewayUrl);
  await each(()=>shot(g.locator('#login-panel'),'38-gateway-login'),g);
  await g.fill('#login-form [name=password]',process.env.HF_GATEWAY_UI_PASSWORD);await g.locator('#login-form button').click();
  await g.locator('#management').waitFor();await g.waitForTimeout(800);
  await each(async()=>{await g.screenshot({path:file('39-gateway'),fullPage:true});console.log('saved',current,'39-gateway');},g);
  await g.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
