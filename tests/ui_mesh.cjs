/* Optional real-browser check of the station mesh matrix. Same requirements as ui_workbench.cjs:
 * NODE_PATH=<Playwright package directory> HF_UI_BROWSER=<Chromium executable>
 * VOACAP_BIN=... VOACAP_MODEL=... node tests/ui_mesh.cjs [screenshot.png]
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hf-mesh-'));
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
  // Power per station appears only in mesh mode.
  assert.equal(await page.locator('.mesh-power').count(),0);
  await page.locator('#mesh-mode').check();
  assert.equal(await page.locator('#tx-power-field').isVisible(),false);
  await page.locator('#add-rx-site').click();
  assert.equal(await page.locator('.mesh-power').count(),3);
  assert.match(await page.locator('#circuit-mode').innerText(),/3拠点 · 6経路/);
  await page.locator('.mesh-power').nth(1).fill('100');
  await page.locator('#rx-selections .station-card').nth(1).locator('select').nth(1).selectOption('standard-dipole-20');
  // Station 1 receives on another antenna; the others keep "same as transmit".
  assert.equal(await page.locator('.mesh-rx-antenna').count(),3);
  await page.locator('.mesh-rx-antenna').first().selectOption('standard-vertical-10');
  const response=page.waitForResponse(r=>r.url().endsWith('/api/mesh')&&r.request().method()==='POST');
  await page.locator('#predict').click();const mesh=await (await response).json();
  assert.equal(mesh.links.length,6);
  assert.deepEqual(mesh.sites.map(s=>s.power_w),[1000,100,1000]);
  assert.equal(mesh.sites[2].antenna,'dipole');
  assert.equal(mesh.sites[0].antenna,'whip');assert.equal(mesh.sites[0].receive.antenna,'vertical_dipole');assert.equal(mesh.sites[1].receive,null);
  assert.equal(await page.locator('#mesh').isVisible(),true);
  assert.equal(await page.locator('#mesh-matrix tr').count(),4);
  assert.equal(await page.locator('#mesh-matrix .mesh-self').count(),3);
  assert.equal(await page.locator('#mesh-matrix td button small').count(),6);
  // The slider moves the whole matrix; a fixed frequency hides the best-frequency line.
  await page.locator('#mesh-hour').fill('3');assert.equal(await page.locator('#mesh-hour-label').innerText(),'03:00 UTC');
  await page.selectOption('#mesh-frequency',String(mesh.parameters.frequencies[2]));
  assert.equal(await page.locator('#mesh-matrix td button small').count(),0);
  const expected=mesh.links.find(l=>l.tx_id==='n2'&&l.rx_id==='n3').hours[3].rows[2].reliability;
  const shown=await page.locator('#mesh-matrix tr').nth(2).locator('td').nth(2).locator('button').innerText();
  assert.equal(parseInt(shown),Math.round(expected));
  await page.locator('#mesh-matrix tr').nth(2).locator('td').nth(2).locator('button').click();
  assert.match(await page.locator('#mesh-link-title').innerText(),/\[N2\] → .*\[N3\]/);
  await page.locator('#mesh-reverse').click();
  assert.match(await page.locator('#mesh-link-title').innerText(),/\[N3\] → .*\[N2\]/);
  await page.locator('#mesh-link-heatmap td button').nth(24*1+5).click();
  assert.equal(await page.locator('#mesh-hour').inputValue(),'5');
  assert.equal(await page.locator('#mesh-frequency').inputValue(),String(mesh.parameters.frequencies[1]));
  // Only the chosen cell is outlined, not the whole hour column.
  assert.equal(await page.locator('#mesh-link-heatmap td.selected').count(),1);
  assert.equal(await page.locator('#mesh-link-heatmap tr').nth(2).locator('td').nth(5).evaluate(td=>td.classList.contains('selected')),true);
  await page.locator('#mesh-play').click();await page.waitForFunction(()=>$('mesh-hour').value!=='5');await page.locator('#mesh-play').click();
  const csv=await page.evaluate(id=>fetch(`/api/results/${id}/csv`).then(r=>r.text()),mesh.id);
  assert.match(csv,/tx_id,tx_name,rx_id,rx_name/);
  if(process.argv[2]){await page.selectOption('#mesh-frequency','best');await page.locator('#mesh-hour').fill('9');await page.locator('#mesh').screenshot({path:process.argv[2]});}
  // Language switch keeps user names and translates the controls.
  await page.selectOption('#language','en');
  assert.equal(await page.locator('.tabs [data-tab="mesh"]').innerText(),'Mesh forecast');
  assert.match(await page.locator('#mesh-summary').innerText(),/^Target REL/);
  assert.match(await page.locator('#circuit-mode').innerText(),/^Mesh · 3 stations · 6 links/);
  // Default site names follow the language; a user's own name stays as entered.
  const heads=()=>page.locator('#mesh-matrix th.mesh-name').evaluateAll(e=>e.slice(0,2).map(t=>t.textContent));
  assert.deepEqual(await heads(),['Tokyo [N1]','Guam [N2]']);
  assert.doesNotMatch(await page.locator('#mesh-link-title').innerText(),/[\u3040-\u30ff\u4e00-\u9fff]/);
  assert.deepEqual(await page.evaluate(()=>[resultSiteText('グアム [RX1]'),resultSiteText('グアム基地 [RX1]'),resultSiteName('グアム基地 [N1]',document.createElement('th')).dataset.userContent]),['Guam [RX1]','グアム基地 [RX1]','true']);
  await page.selectOption('#language','ja');
  assert.deepEqual(await heads(),['東京 [N1]','グアム [N2]']);
  // History restores mesh mode and per-station power.
  await page.locator('#mesh-mode').uncheck();assert.equal(await page.locator('.mesh-power').count(),0);
  await page.locator('.tabs [data-tab="history"]').click();await page.locator('#history-list button').first().click();
  await page.waitForFunction(()=>$('mesh-mode').checked);
  assert.deepEqual(await page.locator('.mesh-power').evaluateAll(e=>e.map(i=>i.value)),['1000','100','1000']);
  assert.deepEqual(await page.locator('.mesh-rx-antenna').evaluateAll(e=>e.map(i=>i.value)),['standard-vertical-10','','']);
  assert.equal(await page.locator('#mesh').isVisible(),true);
  assert.deepEqual(errors,[]);
  console.log('Mesh UI checks passed');
 }finally{await browser?.close();child.kill();fs.rmSync(temp,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
