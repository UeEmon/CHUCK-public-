/* Optional real-browser check of the site candidate comparison. Needs no engine: /api/sites answers with a synthetic result.
 * NODE_PATH=<Playwright package directory> HF_UI_BROWSER=<Chromium executable> node tests/ui_sites.cjs [screenshot.png]
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
function ranking(request){
 // The second candidate reaches the target all day; the first only by day; a third sits on the TX.
 const hours=day=>Array.from({length:24},(_,h)=>{const rel=day&&(h<6||h>=18)?20:85;return {hour_utc:h,reliability:rel,frequencies:request.site_mode==='relay'?[8,10]:[8]};});
 const [a,b,c]=request.candidates;
 return {id:'s1',kind:'sites',site_mode:request.site_mode,parameters:{...request,ssn:80,reliability:80,year:2026,month:10},note:'note',engine:'voacapl 0.7.7',engine_commit:'x',
  candidates:[{...b,rank:1,distance_tx_km:2900,distance_rx_km:4100,hours:hours(false),hours_meeting:24,mean_reliability:85},
   {...a,rank:2,distance_tx_km:1100,distance_rx_km:5000,hours:hours(true),hours_meeting:12,mean_reliability:52.5},
   {...c,rank:null,distance_tx_km:0,distance_rx_km:5300,skipped:'TXまたはRX1と同じ地点のため計算しません',hours:[],hours_meeting:null,mean_reliability:null}]};
}
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hf-sites-'));
 const child=spawn('python3',['tests/ui_fixture.py'],{env:{...process.env,DATA_DIR:temp,HF_GATEWAY_DATA_DIR:temp,
  HF_POSITION_GATEWAY_TOKEN:'test-ui-internal-000000000000000000000',
  HF_POSITION_INGEST_TOKEN:'test-ui-external-000000000000000000000',HF_GATEWAY_UI_PASSWORD:'browser-test-password-12345'}});
 let browser;const errors=[];
 try{
  const url=await new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>reject(Error('UI fixture startup timed out')),10000);
   child.stdout.on('data',d=>{const match=d.toString().match(/UI_URL=(\S+)/);if(match){clearTimeout(timeout);resolve(match[1]);}});
   child.on('exit',c=>{clearTimeout(timeout);reject(Error('UI fixture exited '+c));});
  });
  browser=await chromium.launch({executablePath:process.env.HF_UI_BROWSER||undefined,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],headless:true});
  const page=await browser.newPage({viewport:{width:1500,height:1000}});
  page.on('pageerror',e=>errors.push(e.message));
  let sent=null;
  await page.route('**/api/sites',route=>{sent=JSON.parse(route.request().postData());route.fulfill({contentType:'application/json',body:JSON.stringify(ranking(sent))});});
  await page.goto(url);await page.waitForFunction(()=>catalog.presets.length>=30);
  await page.locator('.tabs [data-tab="sites"]').click();
  // The TX and RX1 locations are not offered; nothing chosen is refused before sending.
  const used=await page.evaluate(()=>[circuit.tx.location_id,circuit.rxs[0].location_id]);
  for(const id of used)assert.equal(await page.locator(`#site-candidates input[value="${id}"]`).count(),0);
  await page.locator('#compute-sites').click();
  assert.match(await page.locator('#notice').innerText(),/1か所以上/);assert.equal(sent,null);
  const boxes=page.locator('#site-candidates input');
  for(let i=0;i<10;i++)await boxes.nth(i).check();
  assert.equal(await page.locator('#site-count').innerText(),'10 / 10 か所を選択');
  assert.equal(await boxes.nth(10).isDisabled(),true);
  for(let i=3;i<10;i++)await boxes.nth(i).uncheck();
  await page.selectOption('#site-mode','relay');
  await page.locator('#compute-sites').click();
  await page.waitForFunction(()=>$('sites-table').querySelector('table'));
  assert.equal(sent.site_mode,'relay');assert.equal(sent.candidates.length,3);
  assert.deepEqual(Object.keys(sent.candidates[0]).sort(),['id','lat','lon','name']);
  assert.match(await page.locator('#sites-caption').innerText(),/^中継地点 · 2026\/10 · SSN 80 · /);
  const rows=page.locator('#sites-table tr');
  assert.equal(await rows.count(),4);
  assert.equal(await rows.nth(1).locator('td').first().innerText(),'1');
  assert.equal(await rows.nth(1).locator('td').nth(1).innerText(),'2900 / 4100');
  assert.equal(await rows.nth(1).locator('td').nth(-2).innerText(),'24');
  assert.equal(await rows.nth(2).locator('td').nth(2).innerText(),'20');
  assert.match(await rows.nth(3).innerText(),/同じ地点/);
  assert.equal(await page.locator('#sites-exports a').count(),2);
  if(process.argv[2])await page.locator('#sites').screenshot({path:process.argv[2]});
  await page.selectOption('#language','en');
  assert.equal(await page.locator('.tabs [data-tab="sites"]').innerText(),'Site candidates');
  assert.match(await page.locator('#sites-caption').innerText(),/^Relay site · 2026\/10 · SSN 80 · .* · Target REL 80%$/);
  assert.equal(await page.locator('#site-count').innerText(),'3 / 10 selected');
  assert.match(await rows.nth(3).innerText(),/same place as TX or RX1/);
  assert.deepEqual(errors,[]);
  console.log('Site candidate UI checks passed');
 }finally{
  if(browser)await browser.close();child.kill();fs.rmSync(temp,{recursive:true,force:true});
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
