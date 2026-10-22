/* Optional real-browser check of the printable report. Needs no engine: a synthetic result is shown.
 * NODE_PATH=<Playwright package directory> HF_UI_BROWSER=<Chromium executable> node tests/ui_report.cjs [screenshot.png]
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hf-report-'));
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
  await page.goto(url);await page.waitForFunction(()=>catalog.presets.length>=30);
  assert.equal(await page.locator('#report-print').isVisible(),false);
  // Night on 7 MHz, day on 10 MHz; 03 UTC reaches no frequency at the target.
  await page.evaluate(()=>{
   const rel=(h,f)=>h===3?{7:60,10:20}[f]:h<6||h>=18?{7:85,10:20}[f]:{7:50,10:90}[f];
   result={id:'abc',created:'2026-10-22T05:00:00+00:00',engine:'voacapl 0.7.7',engine_commit:'deadbeef',distance_km:2500,bearing_deg:150,ui_selection:circuitSnapshot(),
    parameters:{...params(),year:2026,month:10,ssn:100,power_w:1000,required_snr:40,reliability:80,noise:150,frequencies:[7,10]},
    hours:Array.from({length:24},(_,h)=>({hour_utc:h,muf_mhz:12,rows:[7,10].map(f=>({frequency_mhz:f,reliability:rel(h,f),snr_db_hz:40+f,signal_dbw:-120,takeoff_deg:10}))}))};
   renderResult();$('exports').hidden=false;
  });
  // Printing opens a plain page; print() is replaced so the page can be read.
  await page.evaluate(()=>{const open=window.open;window.open=(...args)=>{const w=open(...args);w.print=()=>{window.printedReport=w.document.body.innerText;window.reportHtml=w.document.documentElement.outerHTML;};window.reportWindow=w;return w;};});
  await page.locator('#report-print').click();
  const text=await page.evaluate(()=>window.printedReport);
  assert.match(text,/^伝搬予測報告書\n/);
  assert.match(text,/ID abc/);
  assert.match(text,/経路\t東京 → グアム/);
  assert.match(text,/SSN\t100（手動入力）/);
  assert.match(text,/回線距離・方位\t2500 km \/ 150 °/);
  assert.match(text,/要求SNR・目標REL\t40 dB·Hz \/ 80%/);
  assert.match(text,/時刻別の推奨周波数/);
  assert.match(text,/（1時間）/);
  assert.match(text,/信頼度ヒートマップ/);assert.match(text,/運用周波数の24時間計画/);
  assert.match(text,/deadbeef/);
  const report=await page.evaluate(()=>{const d=window.reportWindow.document,mhz=[...d.querySelectorAll('.hourly tr')[1].cells].map(c=>c.textContent);return {mhz,buttons:d.querySelectorAll('button').length,heat:d.querySelectorAll('.heat tr').length};});
  assert.deepEqual(report.mhz.slice(0,5),['MHz','7.0','7.0','7.0','—']);assert.equal(report.mhz[13],'10.0');
  assert.equal(report.buttons,0);assert.equal(report.heat,3);
  if(process.argv[2]){const shot=await browser.newPage({viewport:{width:1100,height:800}});await shot.setContent(await page.evaluate(()=>window.reportHtml));await shot.screenshot({path:process.argv[2],fullPage:true});await shot.close();}
  await page.evaluate(()=>window.reportWindow.close());
  await page.selectOption('#language','en');
  assert.equal(await page.locator('#report-print').innerText(),'Print report');
  await page.locator('#report-print').click();
  const english=await page.evaluate(()=>window.printedReport);
  assert.match(english,/^Propagation prediction report\n/);
  assert.match(english,/Path\tTokyo → Guam/);
  assert.match(english,/SSN\t100（Manual input）/);
  assert.match(english,/Recommended frequency by hour/);
  assert.match(english,/\(1 h\)/);
  assert.deepEqual(errors,[]);
  console.log('Report UI checks passed');
 }finally{
  if(browser)await browser.close();child.kill();fs.rmSync(temp,{recursive:true,force:true});
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
