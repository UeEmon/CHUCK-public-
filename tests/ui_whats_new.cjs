/* Optional real-browser check of the release notes shown to users.
 * NODE_PATH=<Playwright package directory> HF_UI_BROWSER=<Chromium executable> node tests/ui_whats_new.cjs [screenshot.png]
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hf-news-'));
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
  // Fixed notes: two features on the page and one whose element does not exist yet.
  const today=new Date().toISOString().slice(0,10);
  const notes=[{id:today+'-future',date:today,title:'未来の機能',text:'まだ画面にない機能',tab:'annual',element:'not-there-yet'},
   {id:today+'-annual',date:today,title:'12か月予測',text:'1つの経路について12か月分を計算し、月×UTCのRELで季節による変化を示します。',tab:'annual',element:'compute-annual'},
   {id:today+'-plan',date:today,title:'運用周波数の24時間計画',text:'24時間予測の下に、切替を抑えた時間帯ごとの使用周波数の表を表示します（CSV出力・印刷つき）。',tab:'prediction',element:'plan-mode'},
   {id:today+'-history',date:today,title:'未来の機能',text:'履歴だけの項目',tab:'not-a-tab'},
   {id:'2020-01-01-old',date:'2020-01-01',title:'メッシュの中継到達性',text:'直通では届かない拠点の組でも、1段か2段の中継で届く経路をメッシュ予測に示します。',tab:'mesh',element:'mesh-relays'}];
  await page.route('**/whats-new.json',route=>route.fulfill({contentType:'application/json',body:JSON.stringify(notes)}));
  await page.goto(url);await page.waitForFunction(()=>catalog.presets.length>=30);
  // A first visit counts recent notes as new, without a blocking dialog.
  await page.waitForFunction(()=>!$('news-banner').hidden);
  assert.equal(await page.locator('#news-banner-text').innerText(),'新しい機能が2件あります。');
  assert.equal(await page.locator('#whats-new-count').innerText(),'2');
  assert.equal(await page.locator('#whats-new').evaluate(d=>d.open),false);
  assert.deepEqual(await page.locator('.tabs .is-new').evaluateAll(b=>b.map(x=>x.dataset.tab)),['prediction','annual']);
  await page.locator('#news-banner-open').click();
  const items=page.locator('#whats-new-list li:not(.news-date)');
  // History entries without an element are listed but never counted as new, and get no button for a missing tab.
  assert.equal(await items.count(),4);
  assert.equal(await items.locator('.news-new').count(),2);
  assert.equal(await page.locator('#whats-new-list li.news-date').count(),2);
  assert.match(await items.nth(2).innerText(),/履歴だけの項目/);
  assert.equal(await items.nth(2).locator('button').count(),0);
  assert.match(await items.nth(3).innerText(),/メッシュの中継到達性/);
  if(process.argv[2])await page.screenshot({path:process.argv[2]});
  await items.nth(0).locator('button').click();
  assert.equal(await page.locator('#whats-new').evaluate(d=>d.open),false);
  assert.equal(await page.locator('#annual').isVisible(),true);
  assert.equal(await page.locator('#news-banner').isHidden(),true);
  assert.equal(await page.locator('.tabs .is-new').count(),0);
  assert.equal(await page.evaluate(()=>localStorage.getItem('chuck-whats-new-seen')),today+'-annual');
  // Seen notes stay quiet after a reload; a newer note is new again.
  await page.reload();await page.waitForFunction(()=>catalog.presets.length>=30);await page.waitForTimeout(300);
  assert.equal(await page.locator('#news-banner').isHidden(),true);
  notes.unshift({id:today+'-z',date:today,title:'メッシュの中継到達性',text:'直通では届かない拠点の組でも、1段か2段の中継で届く経路をメッシュ予測に示します。',tab:'mesh',element:'mesh-relays'});
  await page.reload();await page.waitForFunction(()=>!$('news-banner').hidden);
  assert.equal(await page.locator('#news-banner-text').innerText(),'新しい機能が1件あります。');
  await page.locator('#news-banner-close').click();
  assert.equal(await page.locator('#news-banner').isHidden(),true);
  await page.selectOption('#language','en');
  assert.match(await page.locator('#whats-new-open').innerText(),/^What’s new/);
  await page.locator('#whats-new-open').click();
  assert.match(await items.nth(0).innerText(),/Mesh relay reachability/);
  await page.locator('#whats-new-close').click();
  assert.deepEqual(errors,[]);
  console.log('Release notes UI checks passed');
 }finally{
  if(browser)await browser.close();child.kill();fs.rmSync(temp,{recursive:true,force:true});
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
