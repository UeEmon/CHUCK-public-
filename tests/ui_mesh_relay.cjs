/* Optional real-browser check of mesh relay reachability. Needs no engine: a synthetic mesh result is shown.
 * NODE_PATH=<Playwright package directory> HF_UI_BROWSER=<Chromium executable> node tests/ui_mesh_relay.cjs
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hf-mesh-relay-'));
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
  await page.goto(url);await page.waitForFunction(()=>typeof openMesh==='function');
  // Only A→B, B→D and C→A meet the 80% target, and only on 10 MHz.
  await page.evaluate(()=>{
   const ids=['n1','n2','n3','n4'],names=['Alpha','Bravo','Charlie','Delta'],good={'n1>n2':90,'n2>n4':85,'n3>n1':95};
   const sites=ids.map((id,i)=>({id,name:names[i],lat:30+i,lon:130+i,antenna:'whip',power_w:1000,noise:150}));
   const links=[];
   for(const a of ids)for(const b of ids)if(a!==b)links.push({tx_id:a,rx_id:b,distance_km:500,bearing_deg:90,hours:Array.from({length:24},(_,h)=>({hour_utc:h,muf_mhz:12,
    rows:[5,10].map(f=>({frequency_mhz:f,reliability:f===10?(good[a+'>'+b]??30):20,snr_db_hz:40}))}))});
   openMesh({id:1,kind:'mesh',parameters:{year:2026,month:10,ssn:100,ssn_source:'manual',required_snr:40,reliability:80,frequencies:[5,10]},sites,links,note:'note'});
  });
  const matrixCell=(r,c)=>page.locator('#mesh-matrix tr').nth(r).locator('td').nth(c);
  assert.equal(await page.locator('#mesh-relays').inputValue(),'2');
  assert.equal(await page.locator('#mesh-relay-summary').innerText(),'中継で到達: 3 経路 · 到達不可: 6 経路（2段まで）');
  const relayCell=(r,c)=>matrixCell(r,c).locator('button').evaluate(b=>[b.firstChild.textContent,b.querySelector('i').textContent,...[...b.querySelectorAll('small>span')].map(e=>e.textContent)]);
  // REL after relaying (weakest hop) on top, hop count, then the direct REL below.
  assert.deepEqual(await relayCell(1,3),['85','↻1','30 ↻0 · 10.0']);// A→B→D
  assert.deepEqual(await relayCell(3,1),['90·','↻1','30 ↻0 · 10.0']);// C→A→B
  assert.deepEqual(await relayCell(3,3),['85','↻2','30 ↻1','30 ↻0 · 10.0']);// C→A→B→D; best single relay is 30
  assert.equal(await matrixCell(3,3).locator('small.mesh-badge small.mesh-badge').innerText(),'30 ↻0 · 10.0');// direct nested inside single relay
  await matrixCell(3,3).locator('button').click();
  assert.equal(await page.locator('#mesh-relay-route').innerText(),'中継経路（2段）: Charlie → Alpha → Bravo → Delta · 区間REL 95% / 90% / 85% · 中継経路REL 85% · 10.0 / 10.0 / 10.0 MHz');
  await page.selectOption('#mesh-relays','1');
  assert.equal(await page.locator('#mesh-relay-summary').innerText(),'中継で到達: 2 経路 · 到達不可: 7 経路（1段まで）');
  assert.equal(await page.locator('#mesh-relay-route').innerText(),'1段までの中継でも目標RELを満たす経路はありません');
  // On 5 MHz no hop meets the target, so nothing is reachable.
  await page.selectOption('#mesh-frequency','5');
  assert.equal(await page.locator('#mesh-matrix i').count(),0);
  await page.selectOption('#mesh-frequency','best');await page.selectOption('#mesh-relays','2');
  await matrixCell(1,1).locator('button').click();
  assert.equal(await page.locator('#mesh-relay-route').innerText(),'直通で目標RELを満たします');
  await matrixCell(3,3).locator('button').click();
  // Station names stay as entered in another language.
  await page.selectOption('#language','en');
  assert.equal(await page.locator('#mesh-relay-summary').innerText(),'Reachable via relay: 3 links · Unreachable: 6 links (up to 2 relays)');
  assert.match(await page.locator('#mesh-relay-route').innerText(),/^Relay route \(2 relay\(s\)\): Charlie → Alpha → Bravo → Delta · Hop REL/);
  await page.selectOption('#language','ja');
  await page.selectOption('#mesh-relays','0');
  assert.equal(await page.locator('#mesh-relay-summary').isVisible(),false);
  assert.equal(await page.locator('#mesh-relay-route').isVisible(),false);
  assert.equal(await page.locator('#mesh-matrix i').count(),0);
  // The percent/grade toggle and the display thresholds also apply to the matrix.
  const setThreshold=(id,value)=>page.evaluate(([id,value])=>{$(id).value=value;$(id).dispatchEvent(new Event('change'));},[id,value]);
  await page.selectOption('#mesh-relays','2');
  assert.equal(await matrixCell(1,1).locator('button').innerText(),'90·\n10.0');// mark at the default 90%
  await page.selectOption('#rel-display','grade');
  assert.deepEqual(await relayCell(1,3),['G','↻1','N ↻0 · 10.0']);
  await setThreshold('rel-good','86');
  assert.deepEqual(await relayCell(1,3),['P','↻1','N ↻0 · 10.0']);
  await setThreshold('rel-mark-threshold','95');
  assert.equal(await matrixCell(1,1).locator('button').innerText(),'E\n10.0');
  await setThreshold('rel-poor','90');
  assert.equal(await page.evaluate(()=>$('rel-threshold-error').hidden),false);// GOOD must stay above POOR
  await page.evaluate(()=>$('rel-threshold-reset').click());
  assert.equal(await page.locator('#rel-good').inputValue(),'80');
  await page.selectOption('#rel-display','percent');
  assert.deepEqual(await relayCell(1,3),['85','↻1','30 ↻0 · 10.0']);
  assert.deepEqual(errors,[]);
  console.log('Mesh relay UI checks passed');
 }finally{
  if(browser)await browser.close();child.kill();fs.rmSync(temp,{recursive:true,force:true});
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
