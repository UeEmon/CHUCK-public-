/* Optional real-browser check of the required power search. Needs no engine: /api/power answers with a synthetic result.
 * NODE_PATH=<Playwright package directory> HF_UI_BROWSER=<Chromium executable> node tests/ui_power.cjs [screenshot.png]
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
const LADDER=[10,20,50,100,200,500,1000,2000,5000,10000];
function search(request){
 // 5 MHz reaches the target from 200 W at night, 10 MHz from 50 W by day; 03 UTC is out of reach.
 const rel=(f,h,w)=>h===3?20:f===5?(h<6||h>=18)&&w>=200?85:30:(h>=6&&h<18)&&w>=50?90:40;
 const steps=LADDER.map(w=>{const hours=Array.from({length:24},(_,h)=>({hour_utc:h,muf_mhz:12,rows:[5,10].map(f=>({frequency_mhz:f,reliability:rel(f,h,w),snr_db_hz:40}))}));
  return {power_w:w,hours,hours_meeting:hours.filter(h=>h.rows.some(v=>v.reliability>=80)).length};});
 const minimum=Array.from({length:24},(_,h)=>{const rows=[5,10].map(f=>({frequency_mhz:f,power_w:LADDER.find(w=>rel(f,h,w)>=80)??null}));
  const ok=rows.filter(v=>v.power_w!==null).sort((a,b)=>a.power_w-b.power_w);return {hour_utc:h,rows,best:ok.length?{...ok[0],reliability:rel(ok[0].frequency_mhz,h,ok[0].power_w)}:null};});
 return {id:'p1',kind:'power',parameters:{...request,ssn:80,ssn_source:'manual'},ladder:LADDER,distance_km:2500,bearing_deg:150,steps,minimum,note:'note',engine:'voacapl 0.7.7',engine_commit:'x'};
}
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hf-power-'));
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
  await page.route('**/api/power',route=>{sent=JSON.parse(route.request().postData());route.fulfill({contentType:'application/json',body:JSON.stringify(search({...sent,reliability:80,frequencies:[5,10],power_w:500,year:2026,month:10}))});});
  await page.goto(url);await page.waitForFunction(()=>catalog.presets.length>=30);
  await page.locator('.tabs [data-tab="power"]').click();
  await page.locator('#compute-power').click();
  await page.waitForFunction(()=>$('power-heatmap').querySelector('table'));
  assert.equal(typeof sent.tx_lat,'number');assert.equal(typeof sent.power_w,'number');
  assert.match(await page.locator('#power-caption').innerText(),/^2026\/10 · SSN 80 · 現在の設定 500 W · 2500 km · /);
  const rows=page.locator('#power-heatmap tr');
  assert.equal(await rows.count(),4);
  assert.equal(await rows.nth(1).locator('th').innerText(),'最小電力');
  // Night: 5 MHz at 200 W; day: 10 MHz at 50 W; 03 UTC out of reach.
  assert.equal(await rows.nth(1).locator('td').nth(0).innerText(),'200\n5.0');
  assert.equal(await rows.nth(1).locator('td').nth(12).innerText(),'50\n10.0');
  assert.equal(await rows.nth(1).locator('td').nth(3).innerText(),'>10k');
  assert.equal(await rows.nth(2).locator('td').nth(12).innerText(),'>10k');
  assert.equal(await rows.nth(3).locator('td').nth(12).innerText(),'50');
  const steps=page.locator('#power-steps tr');
  assert.equal(await steps.count(),11);
  assert.equal(await steps.nth(3).locator('td').last().innerText(),'12');
  assert.equal(await steps.nth(5).locator('td').last().innerText(),'23');
  assert.equal(await steps.nth(10).locator('th').innerText(),'10000');
  assert.equal(await page.locator('#power-exports a').count(),2);
  if(process.argv[2])await page.locator('#power').screenshot({path:process.argv[2]});
  await page.selectOption('#language','en');
  assert.equal(await page.locator('.tabs [data-tab="power"]').innerText(),'Required power');
  assert.match(await page.locator('#power-caption').innerText(),/Current setting 500 W/);
  assert.equal(await rows.nth(1).locator('th').innerText(),'Minimum power');
  assert.deepEqual(errors,[]);
  console.log('Required power UI checks passed');
 }finally{
  if(browser)await browser.close();child.kill();fs.rmSync(temp,{recursive:true,force:true});
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
