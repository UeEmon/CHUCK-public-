/* Optional real-browser check of the coverage of several stations. Needs no engine: /api/coverage-stations answers with a synthetic result.
 * NODE_PATH=<Playwright package directory> HF_UI_BROWSER=<Chromium executable> node tests/ui_coverage_stations.cjs [screenshot.png]
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
const b64=values=>Buffer.from(values).toString('base64');
function overlay(request){
 // A 4×4 grid: the TX covers the west half, the first added station the east half, and the bottom row is a gap.
 const n=4,size=n*n,station=[],rel=[];
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){station.push(x<2?0:1);rel.push(y===0?20:90);}
 const cell={reliability:b64(rel),station:b64(station)},area={covered:75,stations:[{alone:37.5,best:37.5,only:37.5},{alone:37.5,best:37.5,only:37.5},{alone:0,best:0,only:0}]};
 const freqs=request.frequencies;
 return {id:'c1',kind:'coverage_stations',created:'2026-11-14T00:00:00Z',parameters:{...request,ssn:80,reliability:80,year:2026,month:11},note:'note',notes:[],span:request.span,center_lat:20,center_lon:135,
  stations:[{id:request.tx_id,name:request.tx_name,lat:35,lon:139},...request.stations],engine:'voacapl 0.7.7',engine_commit:'x',
  matrix:{size:n,lon_min:120,lon_max:150,lat_min:5,lat_max:35,frequencies:freqs,hours:[...Array(24).keys()],
   cells:freqs.map(()=>Array(24).fill(cell)),summary:freqs.map(()=>Array(24).fill(area)),
   best:{cells:Array(24).fill({...cell,frequency:b64(Array(size).fill(1))}),summary:Array(24).fill({...area,covered:80})}}};
}
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hf-stations-'));
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
  await page.route('**/api/coverage-stations',route=>{sent=JSON.parse(route.request().postData());route.fulfill({contentType:'application/json',body:JSON.stringify(overlay(sent))});});
  await page.route('**/api/jobs/*',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({done:1,total:4,cancelling:false})}));
  await page.goto(url);await page.waitForFunction(()=>catalog.presets.length>=30);
  await page.locator('.tabs [data-tab="coverage"]').click();
  // The TX and RX1 locations are not offered; nothing chosen is refused before sending.
  const used=await page.evaluate(()=>[circuit.tx.location_id,circuit.rxs[0].location_id]);
  for(const id of used)assert.equal(await page.locator(`#station-candidates input[value="${id}"]`).count(),0);
  await page.locator('#compute-stations').click();
  assert.match(await page.locator('#notice').innerText(),/1か所以上/);assert.equal(sent,null);
  const boxes=page.locator('#station-candidates input');
  for(let i=0;i<3;i++)await boxes.nth(i).check();
  assert.equal(await page.locator('#station-count').innerText(),'3 / 3 か所を選択');
  assert.equal(await boxes.nth(3).isDisabled(),true);
  await boxes.nth(2).uncheck();
  await page.selectOption('#cov_span','60');
  await page.locator('#compute-stations').click();
  await page.waitForFunction(()=>coverageResult?.stations&&!$('station-summary').hidden);
  assert.equal(sent.span,60);assert.equal(sent.stations.length,2);assert.equal(sent.tx_id,used[0]);
  assert.deepEqual(Object.keys(sent.stations[0]).sort(),['id','lat','lon','name']);
  // The view offers the best station and the best frequency; the single-station metric is hidden.
  assert.equal(await page.locator('#cov_station_metric_field').isHidden(),false);
  assert.equal(await page.locator('#cov_metric').isHidden(),true);
  assert.equal(await page.locator('#cov_freq').inputValue(),'best');
  assert.equal(await page.locator('#coverage-legend > span').count(),4);
  assert.match(await page.locator('#coverage-legend').innerText(),/空白域（目標REL 80%未満）/);
  const rows=page.locator('#station-summary tr');
  assert.equal(await rows.count(),6);
  assert.equal(await rows.nth(1).locator('td').first().innerText(),'37.5');
  assert.equal(await rows.nth(4).locator('td').first().innerText(),'80.0');
  assert.equal(await rows.nth(5).locator('td').first().innerText(),'20.0');
  assert.match(await page.locator('#station-summary p').innerText(),/^最良周波数 \/ \d+:00 UTC/);
  assert.match(await page.locator('#route-info').innerText(),/^送信所の重ね合わせ 最良周波数/);
  assert.equal(await page.locator('#map image.coverage-area').count(),1);
  // One frequency, then the REL view.
  await page.selectOption('#cov_freq',String(sent.frequencies[0]));
  assert.equal(await rows.nth(4).locator('td').first().innerText(),'75.0');
  assert.match(await page.locator('#station-summary p').innerText(),/MHz \/ \d+:00 UTC/);
  await page.selectOption('#cov_station_metric','reliability');
  assert.equal(await page.locator('#coverage-legend small').innerText(),'%');
  await page.selectOption('#cov_station_metric','station');
  await page.selectOption('#cov_freq','best');
  assert.equal(await page.locator('#coverage-exports a').count(),2);
  if(process.argv[2])await page.locator('.workspace').screenshot({path:process.argv[2]}).catch(()=>page.screenshot({path:process.argv[2]}));
  await page.selectOption('#language','en');
  assert.match(await page.locator('#coverage-legend').innerText(),/REL/);
  assert.doesNotMatch(await page.locator('#station-overlay').innerText(),/[ぁ-んァ-ヶ一-龯]/);
  assert.doesNotMatch(await page.locator('#station-summary').innerText(),/[ぁ-んァ-ヶ一-龯]/);
  assert.doesNotMatch(await page.locator('#coverage-legend').innerText(),/[ぁ-んァ-ヶ]/);
  assert.deepEqual(errors,[]);
  console.log('Coverage of several stations UI checks passed');
 }finally{
  if(browser)await browser.close();child.kill();fs.rmSync(temp,{recursive:true,force:true});
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
