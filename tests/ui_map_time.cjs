/* Optional real-browser check of the UTC slider under the circuit map. No VOACAP run is needed:
 * NODE_PATH=<Playwright package directory> HF_UI_BROWSER=<Chromium executable> node tests/ui_map_time.cjs [screenshot.png]
 */
'use strict';
const assert=require('node:assert/strict');const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');const {chromium}=require('playwright');
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hf-mt-'));
 const child=spawn('python3',['tests/ui_fixture.py'],{env:{...process.env,DATA_DIR:temp,HF_GATEWAY_DATA_DIR:temp,HF_POSITION_GATEWAY_TOKEN:'test-ui-internal-000000000000000000000',HF_POSITION_INGEST_TOKEN:'test-ui-external-000000000000000000000',HF_GATEWAY_UI_PASSWORD:'browser-test-password-12345'}});
 let browser;const errors=[];
 try{
  const url=await new Promise((res,rej)=>{child.stdout.on('data',d=>{const m=d.toString().match(/UI_URL=(\S+)/);if(m)res(m[1]);});child.on('exit',c=>rej(Error('exit '+c)));});
  browser=await chromium.launch({executablePath:process.env.HF_UI_BROWSER||undefined,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],headless:true});
  const page=await browser.newPage({viewport:{width:1500,height:1000}});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForFunction(()=>catalog.presets.length>=30);
  assert.equal(await page.locator('#map-time').isVisible(),true);
  await page.locator('#map-hour').fill('5');
  assert.equal(await page.locator('#hour').inputValue(),'5');assert.equal(await page.locator('#map-hour-label').innerText(),'05:00 UTC');
  await page.selectOption('#hour','9');assert.equal(await page.locator('#map-hour').inputValue(),'9');
  // The heatmap slider of the prediction tab moves the same hour.
  const heat=page.locator('#prediction .heat-time');
  await heat.locator('input').fill('7');assert.equal(await page.locator('#hour').inputValue(),'7');
  assert.equal(await page.locator('#map-hour').inputValue(),'7');assert.equal(await heat.locator('output').innerText(),'07:00 UTC');
  await page.selectOption('#hour','9');assert.equal(await heat.locator('input').inputValue(),'9');
  await page.locator('.tabs [data-tab="coverage"]').click();assert.equal(await page.locator('#map-time').isVisible(),false);
  await page.locator('.tabs [data-tab="diversity"]').click();assert.equal(await page.locator('#map-time').isVisible(),true);
  await page.locator('#map-hour').fill('14');assert.equal(await page.locator('#diversity-hour').inputValue(),'14');
  const divHeat=page.locator('#diversity .heat-time');assert.equal(await divHeat.locator('output').innerText(),'14:00 UTC');
  await divHeat.locator('input').fill('16');assert.equal(await page.locator('#diversity-hour').inputValue(),'16');assert.equal(await page.locator('#map-hour').inputValue(),'16');
  await page.locator('.tabs [data-tab="mesh"]').click();
  await page.locator('#map-hour').fill('22');assert.equal(await page.locator('#mesh-hour').inputValue(),'22');
  await page.locator('#mesh-hour').fill('3');assert.equal(await page.locator('#map-hour-label').innerText(),'03:00 UTC');
  // Play advances the visible tab's hour and stops on tab change.
  await page.locator('.tabs [data-tab="prediction"]').click();assert.equal(await page.locator('#map-hour').inputValue(),'9');
  await page.evaluate("result={hours:[],parameters:{}}");
  await heat.locator('button').click();assert.equal(await page.locator('#map-play').innerText(),'■ 停止');assert.equal(await heat.locator('button').innerText(),'■ 停止');
  await page.waitForTimeout(1800);const h=Number(await page.locator('#hour').inputValue());assert.ok(h===10||h===11,String(h));
  assert.equal(await page.locator('#map-hour').inputValue(),String(h));
  await page.locator('.tabs [data-tab="sites"]').click();assert.equal(await page.locator('#map-play').innerText(),'▶ 再生');
  await page.locator('.tabs [data-tab="prediction"]').click();
  // The computed path recolours with the slider (REL rises with the hour in this fake result).
  await page.evaluate(()=>{const [tx,rx]=circuitEndpoints();result={parameters:{tx_lat:tx.lat,tx_lon:tx.lon,rx_lat:rx.lat,rx_lon:rx.lon,reliability:90,frequencies:[10]},hours:Array.from({length:24},(_,h)=>({hour_utc:h,rows:[{frequency_mhz:10,reliability:h*4,snr_db_hz:40}]}))};drawMap();});
  const label=()=>page.locator('#map text').filter({hasText:'REL'}).first().textContent();
  await page.locator('#map-hour').fill('2');assert.match(await label(),/REL 8%.*02UTC/);
  await page.locator('#map-hour').fill('23');assert.match(await label(),/REL 92%.*23UTC/);
  await page.selectOption('#language','en');assert.equal(await page.locator('#map-play').innerText(),'▶ Play');
  assert.equal(await page.locator('#map-hour').getAttribute('aria-label'),'Circuit map display time (UTC)');
  // The selected hour's heatmap column is outlined.
  await page.evaluate(()=>{Object.assign(result,{id:'fake',distance_km:2550,bearing_deg:170});Object.assign(result.parameters,{year:2026,month:10,ssn:80,power_w:1000,required_snr:39});renderResult();});await heat.locator('input').fill('4');
  assert.deepEqual(await page.locator('#heatmap td.selected').evaluateAll(e=>e.map(td=>td.dataset.hour)),['4']);
  if(process.argv[2])await page.locator('.map-panel').screenshot({path:process.argv[2]});
  assert.deepEqual(errors,[]);console.log('ok');
 }finally{if(browser)await browser.close();child.kill();}
})().catch(e=>{console.error(e);process.exit(1);});
