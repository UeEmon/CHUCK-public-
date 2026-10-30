/* Optional real-browser check of the 12-month outlook. Needs no engine: /api/annual answers with a synthetic result.
 * NODE_PATH=<Playwright package directory> HF_UI_BROWSER=<Chromium executable> node tests/ui_annual.cjs [screenshot.png]
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
function outlook(request){
 // Winter nights favour 5 MHz, summer days 10 MHz; February has no SSN.
 const months=Array.from({length:12},(_,i)=>{const year=2026+Math.floor((9+i)/12),month=(9+i)%12+1;
  if(year===2027&&month===2)return {year,month,ssn:null,missing:'NOAAの新鮮な平滑SSNがありません',hours:[]};
  const summer=month>=5&&month<=9;
  return {year,month,ssn:80,hours:Array.from({length:24},(_,h)=>({hour_utc:h,muf_mhz:12,rows:[5,10].map(f=>({frequency_mhz:f,snr_db_hz:40+f,takeoff_deg:f===10?(h<12?12.3:14.8):24.7,
   reliability:f===10?(summer&&h>=6&&h<18?90:40):(!summer&&(h<6||h>=18)?85:30)}))}))};});
 return {id:'a1',kind:'annual',parameters:{...request,ssn_source:'manual'},distance_km:2500,bearing_deg:150,months,note:'note',engine:'voacapl 0.7.7',engine_commit:'x'};
}
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hf-annual-'));
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
  await page.route('**/api/annual',route=>{sent=JSON.parse(route.request().postData());route.fulfill({contentType:'application/json',body:JSON.stringify(outlook({...sent,reliability:80,frequencies:[5,10]}))});});
  await page.goto(url);await page.waitForFunction(()=>catalog.presets.length>=30);
  await page.locator('.tabs [data-tab="annual"]').click();
  // The effective SSN is refused before anything is sent.
  await page.evaluate(()=>{fields.ssn_source.value='effective';});
  await page.locator('#compute-annual').click();
  assert.match(await page.locator('#notice').innerText(),/実効SSNを使えません/);assert.equal(sent,null);
  await page.evaluate(()=>{fields.ssn_source.value='manual';fields.ssn.readOnly=false;});
  await page.locator('#compute-annual').click();
  await page.waitForFunction(()=>$('annual-heatmap').querySelector('table'));
  assert.equal(typeof sent.tx_lat,'number');assert.equal(typeof sent.rx_lat,'number');
  assert.match(await page.locator('#annual-caption').innerText(),/^2026\/10〜2027\/9 · SSN 80（全月共通） · /);
  const rows=page.locator('#annual-heatmap tr');
  assert.equal(await rows.count(),13);
  assert.equal(await rows.nth(1).locator('th').innerText(),'2026/10 · SSN 80');
  // Hours at the target: October nights on 5 MHz (12), July days on 10 MHz (12), February missing.
  assert.equal(await rows.nth(1).locator('td').last().innerText(),'12');
  assert.equal(await rows.nth(5).locator('td').last().innerText(),'—');
  assert.equal(await rows.nth(5).locator('td.annual-missing').count(),24);
  assert.equal(await rows.nth(1).locator('td').nth(0).locator('small').innerText(),'5.0');
  assert.equal(await rows.nth(10).locator('td').nth(12).locator('small').innerText(),'10.0');
  await page.selectOption('#annual-frequency','10');
  assert.equal(await rows.nth(1).locator('td').last().innerText(),'0');
  assert.equal(await page.locator('#annual-heatmap small').count(),0);
  // Selecting a cell shows that month per frequency and keeps the hour.
  await rows.nth(10).locator('td').nth(12).locator('button').click();
  assert.equal(await page.locator('#annual-month-title').innerText(),'2027/7 · SSN 80');
  assert.equal(await page.locator('#annual-month tr').count(),3);
  assert.equal(await page.locator('#annual-month td.selected').count(),2);
  assert.equal(await page.locator('#annual-exports a').count(),2);
  // Takeoff angles: 10 MHz is at 12.3° before 12 UTC and 14.8° after, in 1° bars; the table follows the period.
  assert.match(await page.locator('#angle-caption').innerText(),/^2026\/10〜2027\/9 · 10\.000 MHz · REL 1%以上 \d+時間$/);
  assert.match(await page.locator('#angle-summary').innerText(),/^目標REL以上 \d+時間 · 中央値 (12\.3|14\.8|13\.6)° · 10〜90%の範囲 12\.3〜14\.8° · 最頻 1[24]〜1[35]°$/);
  assert.equal(await page.locator('#angle-plot rect').count(),4);
  assert.equal(await page.locator('#angle-table tr').count(),13);
  await page.selectOption('#angle-period','month');
  assert.equal(await page.locator('#angle-table tr').count(),2);
  assert.equal(await page.locator('#angle-table tr').nth(1).locator('th').innerText(),'2027/7');
  assert.equal(await page.locator('#angle-table tr').nth(1).locator('td').nth(0).innerText(),'12');
  if(process.argv[2]){await page.selectOption('#annual-frequency','best');await page.locator('#annual').screenshot({path:process.argv[2]});}
  await page.selectOption('#language','en');
  assert.equal(await page.locator('.tabs [data-tab="annual"]').innerText(),'12-month forecast');
  assert.match(await page.locator('#annual-caption').innerText(),/^2026\/10〜2027\/9 · SSN 80 \(all months\) · /);
  assert.equal(await rows.nth(0).locator('th').last().innerText(),'At target REL (h)');
  assert.equal(await page.locator('#angle-panel h3').innerText(),'Takeoff angle analysis');
  assert.match(await page.locator('#angle-caption').innerText(),/^2027\/7 · (10\.000 MHz|Best frequency) · \d+ h with REL ≥ 1%$/);
  assert.match(await page.locator('#angle-summary').innerText(),/^At or above target REL: \d+ h · median /);
  assert.deepEqual(errors,[]);
  console.log('Annual outlook UI checks passed');
 }finally{
  if(browser)await browser.close();child.kill();fs.rmSync(temp,{recursive:true,force:true});
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
