/* Optional real-browser check of the space weather now & forecast tab.
 * NODE_PATH=<Playwright package directory> HF_UI_BROWSER=<Chromium executable> node tests/ui_space_weather_view.cjs [screenshot.png]
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
const now=new Date(Math.floor(Date.now()/60000)*60000),month=offset=>{const d=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()+offset,1));return d.toISOString().slice(0,7);};
const day=offset=>new Date(Date.now()+offset*86400000).toISOString().slice(0,10);
const source={url:'https://services.swpc.noaa.gov/',fetched_at:Date.now()/1000,stale:false,error:null,fetch_state:'cache'};
const observed=[],predicted=[];
for(let i=-200;i<-1;i++){const s=Math.max(0,140*Math.sin((i+200)/132*Math.PI));observed.push({month:month(i),ssn:+(s+10*Math.sin(i)).toFixed(1),smoothed_ssn:i<-7?+s.toFixed(1):null,f10_7:70+s*.8,smoothed_f10_7:i<-7?70+s*.75:null});}
for(let i=-6;i<30;i++){const s=Math.max(5,120-i*3);predicted.push({month:month(i),ssn:s,engine_ssn:+(s*.7).toFixed(1),high_ssn:s+12,low_ssn:Math.max(0,s-12),f10_7:70+s*.75,high_f10_7:80+s*.75,low_f10_7:60+s*.75});}
const overview={provider:'NOAA SWPC',note:'R/S/Gの予報はNOAA SWPCの3日予報、平滑SSNの予報はNOAAの太陽活動周期予測です。いずれも参考表示で、VOACAPの計算には平滑SSN（公表値×0.7）だけを使います。',
 solar_cycle:{observed,predicted,latest_monthly:{month:month(-2),ssn:96,f10_7:140},latest_smoothed:{month:month(-8),ssn:118.2,engine_ssn:82.7},sources:{observed:source,predicted:source}},
 scales:{observed_at:now.toISOString(),stale:false,source,days:[
  {kind:'max24h',date:day(0),R:{scale:1},S:{scale:0},G:{scale:2}},
  {kind:'latest',date:day(0),R:{scale:0},S:{scale:0},G:{scale:1}},
  {kind:'forecast',date:day(1),R:{scale:null,minor_prob:55,major_prob:15},S:{scale:null,prob:10},G:{scale:1}},
  {kind:'forecast',date:day(2),R:{scale:null,minor_prob:45,major_prob:10},S:{scale:null,prob:5},G:{scale:0}},
  {kind:'forecast',date:day(3),R:{scale:null,minor_prob:40,major_prob:5},S:{scale:null,prob:1},G:{scale:3}}]}};
const lons=[],rows=[];for(let lon=-178;lon<=178;lon+=4)lons.push(lon);
for(let lat=89;lat>=-89;lat-=2)rows.push({lat,values:lons.map(lon=>{const v=18-Math.hypot(lon-140,lat-10)/6;return v>0?+v.toFixed(1):0;})});
const band=(f,i)=>[0,500,1000,1500,2000,2500,3000,3500,4000].map(km=>({distance_km:km,luf_mhz:2,muf_mhz:+(f*(1+km/1300)+i*.2).toFixed(2)}));
const stations=[['WK546','稚内',45.4,141.7,6.1],['TO536','国分寺',35.7,139.5,7.2],['YG431','山川',31.2,130.6,8.0],['OK426','大宜味',26.7,128.2,9.1]]
 .map(([code,name,lat,lon,f],i)=>({code,name,lat,lon,observed_at:now.toISOString(),fof2_mhz:f,bands:band(f,i),stale:i===0}));
const observations={note:'',drap:{data:{observed_at:now.toISOString(),longitudes:lons,rows},stale:false,fetched_at:Date.now()/1000,source_url:'https://services.swpc.noaa.gov/text/drap_global_frequencies.txt'},
 nict:{data:{stations},stale:false,fetched_at:Date.now()/1000,source_url:'https://wdc.nict.go.jp/'},giro:{enabled:false}};
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hf-swv-'));
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
  await page.route('**/api/space-weather/overview',route=>{calls++;route.fulfill({contentType:'application/json',body:JSON.stringify(overview)});});
  await page.route('**/api/observations',route=>route.fulfill({contentType:'application/json',body:JSON.stringify(observations)}));
  await page.goto(url);await page.waitForFunction(()=>catalog.presets.length>=30);
  assert.equal(calls,0); // Nothing is read until the tab is opened.
  await page.locator('[data-tab="space-weather-view"]').click();
  await page.waitForFunction(()=>document.querySelectorAll('#swv-scales .swv-tile').length===5);
  assert.equal(calls,1);
  assert.deepEqual(await page.locator('#swv-scales .swv-level').allInnerTexts(),['R0','S0','G1']);
  assert.match(await page.locator('#swv-scales .swv-tile').nth(2).innerText(),/過去24時間の最大 G2/);
  assert.equal(await page.locator('#swv-nict path').count(),4);
  assert.match(await page.locator('#swv-nict').innerText(),/稚内（古い）/);
  assert.match(await page.locator('#swv-drap').innerText(),/最大HAF 17\.6 MHz/);
  assert.equal(await page.locator('#swv-forecast tr').count(),4);
  assert.match(await page.locator('#swv-forecast tr').nth(1).innerText(),/55%[\s\S]*15%[\s\S]*10%[\s\S]*G1 小規模/);
  assert.equal(await page.locator('#swv-months tr').count(),13);
  assert.match(await page.locator('#swv-months tr').nth(1).innerText(),new RegExp(month(0)));
  // Hovering the cycle chart shows the month under the pointer.
  await page.locator('#swv-cycle svg').scrollIntoViewIfNeeded();const chart=await page.locator('#swv-cycle svg').boundingBox();
  await page.mouse.move(chart.x+chart.width*.85,chart.y+chart.height/2);
  assert.match(await page.locator('#swv-cycle .swv-tip').innerText(),/予測平滑値/);
  if(process.argv[2])await page.screenshot({path:process.argv[2],fullPage:true});
  await page.selectOption('#swv-cycle-measure','f10_7');
  assert.match(await page.locator('#swv-cycle svg').getAttribute('aria-label'),/F10\.7/);
  // Other languages translate the tab.
  await page.selectOption('#language','en');
  assert.equal(await page.locator('[data-tab="space-weather-view"]').innerText(),'Space weather now & forecast');
  assert.match(await page.locator('#swv-forecast tr').first().innerText(),/Probability of R1–R2/);
  if(process.argv[3])await page.screenshot({path:process.argv[3],fullPage:true});
  assert.deepEqual(errors,[]);
  console.log('space weather view UI check passed');
 }finally{await browser?.close();child.kill();fs.rmSync(temp,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
