/* Optional real-browser check of today's conditions panel. Needs no engine: a synthetic result and today.assess output are shown.
 * NODE_PATH=<Playwright package directory> HF_UI_BROWSER=<Chromium executable> node tests/ui_today_check.cjs [screenshot.png]
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,execFileSync}=require('node:child_process');
const {chromium}=require('playwright');
// A radio blackout (R3, D-RAP HAF 6 MHz everywhere) and a G3 storm on Tokyo–London, assessed by the real module.
const ASSESS=`
import json,sys
from datetime import datetime,timezone
sys.path[:0]=['app','tests']
import today,test_today as t
now=datetime.now(timezone.utc)
r=t.result(rx=(51.5,-0.13),distance=9560);r['parameters'].update(year=now.year,month=now.month)
d=now.date().isoformat()
s=t.scales(r=3,g=3);s['data']['0']['DateStamp']=d;s['data']['1']['DateStamp']=d
print(json.dumps({'result':r,'today':today.assess(r,t.drap(6),s,now)}))`;
(async()=>{
 const fixture=JSON.parse(execFileSync('python3',['-c',ASSESS]).toString());
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hf-today-'));
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
  let calls=0;
  await page.route('**/api/results/r1/today',route=>{calls++;route.fulfill({json:fixture.today});});
  await page.goto(url);await page.waitForFunction(()=>catalog.presets.length>=30);
  assert.equal(await page.locator('#today-run').isDisabled(),true);
  await page.evaluate(r=>{result={...r,bearing_deg:330,parameters:{...params(),...r.parameters,ssn:80,power_w:1000,frequencies:[5,10,14.5,25]}};result.hours.forEach(h=>h.rows.forEach(v=>v.signal_dbw=-120));renderResult();},fixture.result);
  // A current-month result is checked without pressing the button.
  await page.waitForSelector('#today-table table');
  assert.equal(calls,1);
  const status=await page.locator('#today-status').innerText();
  assert.match(status,/現在 R3 · S0 · G3（過去24時間の最大 G0）/);
  assert.match(status,/D-RAPの吸収を見積もりに使っています/);
  assert.match(status,/経路の最大地磁気緯度 \d+(\.\d)?°/);
  assert.match(await page.locator('#today-best').innerText(),/^今日の状況での推奨（\d\d:00 UTC）: 10 MHz ⚠$/);
  const first=await page.locator('#today-table tr').nth(3).locator('td').first();
  assert.equal(await first.getAttribute('class'),'today-blocked');
  assert.match(await first.innerText(),/✕$/);
  assert.match(await first.getAttribute('title'),/推定の追加吸収 \d+\.\d dB/);
  assert.equal(await page.locator('#today-table th').nth(1).innerText(),String(new Date().getUTCHours()).padStart(2,'0'));
  // Re-rendering the same result reuses the check.
  await page.evaluate(()=>renderResult());assert.equal(calls,1);
  await page.locator('#today-run').click();await page.waitForFunction(()=>todayCheck);assert.equal(calls,2);
  if(process.argv[2])await page.locator('#today-check').screenshot({path:process.argv[2]});
  await page.selectOption('#language','en');
  assert.equal(await page.locator('#today-check h3').innerText(),"Today's conditions check");
  assert.match(await page.locator('#today-status').innerText(),/Now R3 · S0 · G3 \(past 24 h maximum G0\)/);
  assert.match(await page.locator('#today-best').innerText(),/^Recommended under today's conditions/);
  // A result for another month is not checked.
  await page.evaluate(()=>{result={...result,id:'r2',parameters:{...result.parameters,month:result.parameters.month%12+1}};renderResult();});
  assert.equal(calls,2);
  await page.selectOption('#language','ja');
  assert.equal(await page.locator('#today-status').innerText(),'今日の状況での確認は、対象年月が今月の結果だけに使えます。');
  assert.deepEqual(errors,[]);
  console.log("Today's conditions UI checks passed");
 }finally{
  if(browser)await browser.close();child.kill();fs.rmSync(temp,{recursive:true,force:true});
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
