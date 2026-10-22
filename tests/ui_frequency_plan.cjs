/* Optional real-browser check of the 24-hour operating frequency plan. Needs no engine: a synthetic result is shown.
 * NODE_PATH=<Playwright package directory> HF_UI_BROWSER=<Chromium executable> node tests/ui_frequency_plan.cjs [screenshot.png]
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hf-plan-'));
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
  const page=await browser.newPage({viewport:{width:1500,height:1000},acceptDownloads:true});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForFunction(()=>catalog.presets.length>=30);
  assert.equal(await page.locator('#plan-csv').isDisabled(),true);
  // Night favours 7 MHz (5 MHz briefly better), day favours 10 MHz (7 MHz once better): hourly best switches often.
  await page.evaluate(()=>{
   const rel=(h,f)=>h<6?{5:90,7:85,10:20}[f]:h<18?{5:20,7:h===9?92:60,10:90}[f]:{5:h===22?89:70,7:88,10:30}[f];
   result={id:7,distance_km:2500,bearing_deg:150,parameters:{...params(),year:2026,month:10,ssn:100,power_w:1000,required_snr:40,reliability:80,frequencies:[5,7,10]},
    hours:Array.from({length:24},(_,h)=>({hour_utc:h,muf_mhz:12,rows:[5,7,10].map(f=>({frequency_mhz:f,reliability:rel(h,f),snr_db_hz:40+f,signal_dbw:-120,takeoff_deg:10}))}))};
   renderResult();
  });
  const rows=async()=>page.locator('#plan-table tr').evaluateAll(trs=>trs.slice(1).map(tr=>[...tr.cells].map(td=>td.textContent)));
  assert.equal(await page.locator('#plan-summary').innerText(),'切替 2 回 · 目標REL以上 24 / 24 時間 · 方針: 切替を抑える');
  assert.deepEqual(await rows(),[['18:00–06:00','7.000','85–88','47.0','0 時間'],['06:00–18:00','10.000','90','50.0','0 時間']]);
  await page.selectOption('#plan-mode','hourly');
  assert.equal(await page.locator('#plan-summary').innerText(),'切替 7 回 · 目標REL以上 24 / 24 時間 · 方針: 毎時最良');
  assert.equal((await rows())[0][0],'00:00–06:00');
  const download=page.waitForEvent('download');await page.locator('#plan-csv').click();
  const csv=fs.readFileSync(await (await download).path(),'utf8').trim().split(/\r\n/);
  assert.equal(csv[0],'hour_utc,frequency_mhz,reliability,snr_db_hz,meets_target,switch');
  assert.equal(csv.length,25);assert.equal(csv[10],'9,7,92,47,1,1');
  // Printing opens a plain page holding only the plan.
  await page.evaluate(()=>{const open=window.open;window.open=(...args)=>{const w=open(...args);w.print=()=>{window.printedPlan=w.document.body.innerText;w.close();};return w;};});
  await page.locator('#plan-print').click();
  const printed=await page.evaluate(()=>window.printedPlan);
  assert.match(printed,/^運用周波数の24時間計画\n/);assert.match(printed,/切替 7 回/);assert.match(printed,/09:00–10:00\t7\.000/);
  // An hour where nothing meets the target is reported, not hidden.
  await page.evaluate(()=>{result.hours[3].rows.forEach(r=>r.reliability=40);renderResult();});
  await page.selectOption('#plan-mode','steady');
  assert.match(await page.locator('#plan-summary').innerText(),/目標REL以上 23 \/ 24 時間/);
  assert.equal(await page.locator('#plan-table tr.plan-unmet').count(),1);
  if(process.argv[2]){await page.evaluate(()=>{result.hours[3].rows.forEach((r,i)=>r.reliability=[90,85,20][i]);renderResult();});await page.locator('#frequency-plan').screenshot({path:process.argv[2]});}
  await page.selectOption('#language','en');
  assert.match(await page.locator('#plan-summary').innerText(),/^2 switches · At or above target REL: \d+ \/ 24 hours · Policy: Fewest switches$/);
  assert.equal(await page.locator('#frequency-plan h3').innerText(),'24-hour operating frequency plan');
  assert.deepEqual(errors,[]);
  console.log('Frequency plan UI checks passed');
 }finally{
  if(browser)await browser.close();child.kill();fs.rmSync(temp,{recursive:true,force:true});
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
