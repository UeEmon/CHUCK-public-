/* Optional real-browser check of scheduled recalculation. Needs no engine: /api/watches and /api/history answer with synthetic data.
 * NODE_PATH=<Playwright package directory> HF_UI_BROWSER=<Chromium executable> node tests/ui_watch.cjs [screenshot.png]
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
const parameters={year:2026,month:10,power_w:1000,frequencies:[8,12],reliability:50};
const check=(day,hours)=>({checked:`2026-10-${day}T00:00:00+00:00`,ssn:hours*10,hours_meeting:hours,best:[]});
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hf-watch-'));
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
  // One watch that got worse (12 → 8 hours) and one that has not been checked yet.
  const state={interval_hours:24,max:20,note:'note',watches:[
   {id:'w1',result_id:'r0',label:'東京 → グアム',parameters,baseline:check(22,12),latest:check(23,8),status:'worse',notify:true},
   {id:'w2',result_id:'r9',label:'東京 → ソウル',parameters,baseline:null,latest:null,last_error:{checked:'2026-10-23T00:00:00+00:00',error:'NOAAの新鮮な平滑SSNがありません'},status:'pending',notify:false}]};
  const posted=[];
  await page.route('**/api/watches',route=>{
   if(route.request().method()==='POST'){const body=JSON.parse(route.request().postData());posted.push(body);
    if(body.action==='acknowledge')state.watches[0].notify=false;
    if(body.action==='add')state.watches.push({id:'w3',result_id:body.result_id,label:'東京 → 台北',parameters,baseline:check(23,10),latest:check(23,10),status:'same',notify:false});
    if(body.action==='delete')state.watches=state.watches.filter(w=>w.id!==body.id);}
   route.fulfill({contentType:'application/json',body:JSON.stringify(state)});
  });
  await page.route('**/api/history',route=>route.fulfill({contentType:'application/json',body:JSON.stringify([
   {id:'r1',created:'2026-10-23T00:00:00+00:00',kind:'point',parameters},{id:'r0',created:'2026-10-22T00:00:00+00:00',kind:'point',parameters},
   {id:'r2',created:'2026-10-21T00:00:00+00:00',kind:'annual',parameters}])}));
  await page.goto(url);await page.waitForFunction(()=>catalog.presets.length>=30);
  // The banner appears without opening the history tab.
  await page.waitForFunction(()=>!$('watch-alert').hidden);
  assert.equal(await page.locator('#watch-alert-text').innerText(),'定時の再計算で、目標REL以上の時間数が減った条件が1件あります。');
  await page.locator('#watch-alert-open').click();
  assert.equal(await page.locator('#history').isVisible(),true);
  await page.waitForFunction(()=>$('history-list').children.length===3);
  const rows=page.locator('#watch-list tr');
  assert.equal(await rows.count(),3);
  assert.match(await rows.nth(1).innerText(),/12 → 8 時間/);
  assert.equal(await rows.nth(1).locator('.watch-worse').innerText(),'減少');
  assert.equal(await rows.nth(2).locator('.watch-pending').getAttribute('title'),'NOAAの新鮮な平滑SSNがありません');
  assert.match(await page.locator('#watch-interval').innerText(),/24時間ごとに/);
  // Only single-link results get the add button; an already registered one is disabled.
  const history=page.locator('#history-list > div');
  assert.equal(await history.nth(0).locator('button').count(),2);
  assert.equal(await history.nth(1).locator('button').nth(0).innerText(),'登録済み');
  assert.equal(await history.nth(2).locator('button').count(),1);
  await history.nth(0).locator('button').nth(0).click();
  await page.waitForFunction(()=>$('watch-list').querySelectorAll('tr').length===4);
  assert.deepEqual(posted.at(-1),{action:'add',result_id:'r1'});
  assert.equal(await history.nth(0).locator('button').nth(0).innerText(),'登録済み');
  if(process.argv[2])await page.locator('#history').screenshot({path:process.argv[2]});
  await rows.nth(1).locator('button',{hasText:'確認済みにする'}).click();
  await page.waitForFunction(()=>$('watch-alert').hidden);
  await page.selectOption('#language','en');
  assert.equal(await page.locator('#watch-panel h3').innerText(),'Scheduled recalculation');
  assert.equal(await rows.nth(1).locator('td').nth(4).innerText(),'12 → 8 h');
  assert.equal(await rows.nth(1).locator('td').first().innerText(),'東京 → グアム');
  assert.deepEqual(errors,[]);
  console.log('Scheduled recalculation UI checks passed');
 }finally{
  if(browser)await browser.close();child.kill();fs.rmSync(temp,{recursive:true,force:true});
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
