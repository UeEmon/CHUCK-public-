/* Optional real-browser check of the printable report on the other result tabs. Needs no engine: synthetic results are shown.
 * NODE_PATH=<Playwright package directory> HF_UI_BROWSER=<Chromium executable> node tests/ui_report_tabs.cjs [screenshot-directory]
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hf-report-tabs-'));
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
  await page.evaluate(()=>{const open=window.open;window.open=(...args)=>{const w=open(...args);w.print=()=>{window.printed={text:w.document.body.innerText,html:w.document.documentElement.outerHTML,buttons:w.document.querySelectorAll('button,select,input').length,tables:w.document.querySelectorAll('table').length,svgs:w.document.querySelectorAll('svg').length};w.close();};return w;};});
  const shots=process.argv[2];if(shots)fs.mkdirSync(shots,{recursive:true});
  const print=async(locator,name)=>{
   await page.evaluate(()=>{window.printed=null;});await page.locator(locator).click();
   const out=await page.evaluate(()=>window.printed);assert.ok(out,name+' printed');assert.equal(out.buttons,0,name);
   if(shots){const shot=await browser.newPage({viewport:{width:1100,height:800}});await shot.setContent(out.html);await shot.screenshot({path:path.join(shots,name+'.png'),fullPage:true});await shot.close();}
   return out;
  };
  // Shared synthetic forecast: 7 MHz by night, 10 MHz by day.
  await page.evaluate(()=>{
   const rel=(h,f)=>h<6||h>=18?{7:85,10:20}[f]:{7:50,10:90}[f];
   window.hours=()=>Array.from({length:24},(_,h)=>({hour_utc:h,muf_mhz:12,rows:[7,10].map(f=>({frequency_mhz:f,reliability:rel(h,f),snr_db_hz:40+f,signal_dbw:-120,takeoff_deg:10}))}));
   window.base={...params(),year:2026,month:10,ssn:100,power_w:1000,required_snr:40,reliability:80,noise:150,frequencies:[7,10]};
  });

  // Mesh: the matrix at the slider hour, with relayed cells and their hop count.
  await page.evaluate(()=>{
   const ids=['n1','n2','n3'],names=['Alpha','Bravo','Charlie'],sites=ids.map((id,i)=>({id,name:names[i],lat:30+i,lon:130+i,antenna:'whip',power_w:1000,noise:150}));
   const links=[];for(const a of ids)for(const b of ids)if(a!==b)links.push({tx_id:a,rx_id:b,distance_km:500,bearing_deg:90,hours:hours()});
   openMesh({id:'m1',kind:'mesh',created:'2026-10-23T01:00:00+00:00',engine:'voacapl 0.7.7',engine_commit:'deadbeef',parameters:{...base,ssn_source:'manual'},sites,links,note:'mesh note'});
   $('mesh-hour').value=3;renderMeshMatrix();
  });
  assert.equal(await page.locator('#mesh-exports .report-tab-print').innerText(),'報告書を印刷');
  let out=await print('#mesh-exports .report-tab-print','mesh');
  assert.match(out.text,/^伝搬予測報告書 · メッシュ予測\n/);
  assert.match(out.text,/ID m1/);assert.match(out.text,/拠点\tAlpha · Bravo · Charlie/);
  assert.match(out.text,/TX × RX マトリックス · REL（%）/);assert.match(out.text,/周波数 最良周波数 · 03:00 UTC · 中継 2段まで/);
  assert.match(out.text,/経路の詳細 · 周波数 × UTC/);assert.match(out.text,/deadbeef/);
  assert.doesNotMatch(out.text,/CSV出力/);
  assert.equal(out.tables,3);
  // Cell colours survive the copy.
  assert.match(out.html,/<td style="background: rgb\(/);

  // 12-month outlook.
  await page.evaluate(()=>{
   const months=Array.from({length:12},(_,i)=>({year:2026+Math.floor((9+i)/12),month:(9+i)%12+1,ssn:80,hours:hours()}));
   openAnnual({id:'a1',kind:'annual',created:'2026-10-23T02:00:00+00:00',parameters:{...base,ssn_source:'manual'},ui_selection:circuitSnapshot(),distance_km:2500,bearing_deg:150,months,note:'annual note',engine:'voacapl 0.7.7',engine_commit:'x'});
  });
  out=await print('#annual-exports .report-tab-print','annual');
  assert.match(out.text,/^伝搬予測報告書 · 12か月予測\n/);
  assert.match(out.text,/経路\t東京 → グアム/);assert.match(out.text,/周波数 最良周波数/);
  assert.match(out.text,/月の詳細 · 周波数 × UTC · 2026\/10 · SSN 80/);
  assert.doesNotMatch(out.text,/^SSN\t/m);assert.equal(out.tables,3);

  // Required power.
  await page.evaluate(()=>{
   const ladder=[10,100,1000],steps=ladder.map(w=>({power_w:w,hours:hours(),hours_meeting:24}));
   const minimum=Array.from({length:24},(_,h)=>({hour_utc:h,rows:[{frequency_mhz:7,power_w:100},{frequency_mhz:10,power_w:null}],best:{frequency_mhz:7,power_w:100,reliability:85}}));
   openPower({id:'p1',kind:'power',parameters:{...base,ssn_source:'manual'},ui_selection:circuitSnapshot(),ladder,distance_km:2500,bearing_deg:150,steps,minimum,note:'power note',engine:'voacapl 0.7.7',engine_commit:'x'});
  });
  out=await print('#power-exports .report-tab-print','power');
  assert.match(out.text,/^伝搬予測報告書 · 必要な送信電力\n/);assert.match(out.text,/電力ごとの最良REL/);assert.match(out.text,/>10k/);
  assert.equal(out.tables,3);

  // Site candidates: the candidate picker is left out.
  await page.evaluate(()=>{
   const day=Array.from({length:24},(_,h)=>({hour_utc:h,reliability:85,frequencies:[8]}));
   openSites({id:'s1',kind:'sites',site_mode:'receive',parameters:{...base},ui_selection:circuitSnapshot(),note:'sites note',engine:'voacapl 0.7.7',engine_commit:'x',
    candidates:[{id:'x1',name:'Candidate One',rank:1,distance_tx_km:2900,hours:day,hours_meeting:24,mean_reliability:85}]});
  });
  out=await print('#sites-exports .report-tab-print','sites');
  assert.match(out.text,/^伝搬予測報告書 · 拠点の候補\n/);assert.match(out.text,/Candidate One/);
  assert.doesNotMatch(out.text,/か所を選択/);assert.equal(out.tables,2);

  // Diversity, then the Propagation Chart of one of its sites.
  await page.evaluate(()=>{
   const sites=['Guam','Saipan'].map((name,i)=>({id:'rx'+(i+1),name,distance_km:2500+i*100,parameters:{...base,rx_antenna:'whip',rx_gain:0},hours:hours()}));
   const diversity_hours=Array.from({length:24},(_,h)=>({hour_utc:h,rows:[7,10].map(f=>({frequency_mhz:f,best_rel_percent:80,best_site_id:'rx1',complete:true,union_lower_percent:80,union_upper_percent:90,sites_meeting_target:1}))}));
   openDiversity({id:'d1',kind:'rx_diversity',created:'2026-10-23T03:00:00+00:00',parameters:{...base,ssn_source:'manual'},ui_selection:circuitSnapshot(),sites,diversity_hours,independence_assumption:false,note:'diversity note',engine:'voacapl 0.7.7',engine_commit:'x'});
  });
  out=await print('#diversity-exports .report-tab-print','diversity');
  assert.match(out.text,/^伝搬予測報告書 · ダイバーシティー予測\n/);assert.match(out.text,/経路\t東京 → Guam · Saipan/);
  assert.match(out.text,/サイト別詳細/);assert.equal(out.tables,4);
  await page.evaluate(()=>{tab('propagation-chart');$('chart-site').value='rx2';renderPropagationChart();});
  out=await print('#chart-print','chart');
  assert.match(out.text,/^伝搬予測報告書 · Propagation Chart\n/);assert.match(out.text,/ID d1/);
  assert.match(out.text,/経路\t東京 → Saipan/);assert.match(out.text,/受信局 Saipan/);assert.equal(out.svgs,1);

  // Coverage prints the map with the VOACAP area grid drawn as colour bands.
  await page.evaluate(()=>{
   coverageResult={id:'c1',kind:'coverage',created:'2026-10-23T04:00:00+00:00',parameters:{...base},frequency_mhz:8,hour_utc:12,span:60,center_lat:20,center_lon:140,
    area:{size:2,lon_min:110,lon_max:170,lat_min:-10,lat_max:50,signal_dbw:[[-150,-120],[-100,null]],snr_db_hz:[[10,40],[60,null]],reliability:[[5,50],[95,null]]}};
   tab('coverage');showCoverage();
  });
  out=await print('#coverage-exports .report-tab-print','coverage');
  assert.match(out.text,/^伝搬予測報告書 · カバー範囲\n/);assert.match(out.text,/周波数\t8 MHz \/ 12:00 UTC/);
  assert.match(out.text,/回線マップ/);assert.doesNotMatch(out.text,/計算には時間がかかります/);
  assert.equal(out.svgs,1);assert.match(out.html,/<image class="coverage-area"[^>]*href="data:image\/png;base64,/);

  // Text follows the UI language.
  await page.selectOption('#language','en');
  await page.evaluate(()=>{tab('mesh');});
  out=await print('#mesh-exports .report-tab-print','mesh-en');
  assert.match(out.text,/^Propagation prediction report · /);
  assert.deepEqual(errors,[]);
  console.log('Report tab UI checks passed');
 }finally{
  if(browser)await browser.close();child.kill();fs.rmSync(temp,{recursive:true,force:true});
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
