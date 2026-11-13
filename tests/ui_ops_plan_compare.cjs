/* Optional real-browser check of the diversity/mesh operating plans and the two-result comparison. Needs no engine: synthetic results are shown.
 * NODE_PATH=<Playwright package directory> HF_UI_BROWSER=<Chromium executable> node tests/ui_ops_plan_compare.cjs [screenshot-directory]
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hf-ops-'));
 const child=spawn('python3',['tests/ui_fixture.py'],{env:{...process.env,DATA_DIR:temp,HF_GATEWAY_DATA_DIR:temp,
  HF_POSITION_GATEWAY_TOKEN:'test-ui-internal-000000000000000000000',
  HF_POSITION_INGEST_TOKEN:'test-ui-external-000000000000000000000',HF_GATEWAY_UI_PASSWORD:'browser-test-password-12345'}});
 let browser;const errors=[],shots=process.argv[2];
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
  const rows=async id=>page.locator(`#${id} tr`).evaluateAll(trs=>trs.slice(1).map(tr=>[...tr.cells].map(td=>td.textContent)));
  const csv=async button=>{const download=page.waitForEvent('download');await page.locator(button).click();return fs.readFileSync(await (await download).path(),'utf8').trim().split(/\r\n/);};

  // Diversity: Guam carries 7 MHz in the first half of the day, Saipan 10 MHz in the second; at 05 UTC Saipan on 7 MHz is briefly best.
  assert.equal(await page.locator('#diversity-plan-csv').isDisabled(),true);
  await page.evaluate(()=>{
   const base={...params(),year:2026,month:10,ssn:100,power_w:1000,required_snr:40,reliability:80,frequencies:[7,10]};
   const rel={Guam:(h,f)=>f===7?(h<12?90:50):60,Saipan:(h,f)=>f===10?(h<12?40:85):(h===5?95:h<12?30:70)};
   const sites=['Guam','Saipan'].map((name,i)=>({id:'rx'+(i+1),name,distance_km:2500,parameters:{...base,rx_antenna:'whip',rx_gain:0},
    hours:Array.from({length:24},(_,h)=>({hour_utc:h,muf_mhz:12,rows:[7,10].map(f=>({frequency_mhz:f,reliability:rel[name](h,f),snr_db_hz:40+f,signal_dbw:-120}))}))}));
   const diversity_hours=Array.from({length:24},(_,h)=>({hour_utc:h,rows:[7,10].map(f=>({frequency_mhz:f,best_rel_percent:80,best_site_id:'rx1',complete:true,union_lower_percent:80,union_upper_percent:90,sites_meeting_target:1}))}));
   openDiversity({id:'d1',kind:'rx_diversity',parameters:{...base,ssn_source:'manual'},sites,diversity_hours,independence_assumption:false,note:'note'});
  });
  assert.equal(await page.locator('#diversity-plan-summary').innerText(),'周波数の切替 2 回 · 受信局の切替 2 回 · 目標REL以上 24 / 24 時間 · 方針: 切替を抑える');
  assert.deepEqual(await rows('diversity-plan-table'),[['00:00–12:00','7.000','Guam','90','47.0','0 時間'],['12:00–24:00','10.000','Saipan','85','50.0','0 時間']]);
  await page.selectOption('#diversity-plan-mode','hourly');
  assert.equal(await page.locator('#diversity-plan-summary').innerText(),'周波数の切替 2 回 · 受信局の切替 4 回 · 目標REL以上 24 / 24 時間 · 方針: 毎時最良');
  assert.deepEqual((await rows('diversity-plan-table')).map(r=>r[0]+' '+r[2]),['00:00–05:00 Guam','05:00–06:00 Saipan','06:00–12:00 Guam','12:00–24:00 Saipan']);
  let lines=await csv('#diversity-plan-csv');
  assert.equal(lines[0],'hour_utc,frequency_mhz,rx_site_id,rx_site,reliability,snr_db_hz,meets_target,frequency_switch,site_switch');
  assert.equal(lines.length,25);assert.equal(lines[6],'5,7,rx2,Saipan,95,47,1,0,1');
  await page.selectOption('#diversity-plan-mode','steady');
  if(shots)await page.locator('#diversity-plan').screenshot({path:path.join(shots,'diversity-plan.png')});

  // Mesh: A→B works on 5 MHz all day; every other path on 10 MHz by day and 5 MHz by night.
  await page.evaluate(()=>{
   const ids=['n1','n2','n3'],names=['Alpha','Bravo','Charlie'];
   const sites=ids.map((id,i)=>({id,name:names[i],lat:30+i,lon:130+i,antenna:'whip',power_w:1000,noise:150}));
   const links=[];
   for(const a of ids)for(const b of ids)if(a!==b)links.push({tx_id:a,rx_id:b,distance_km:500,bearing_deg:90,hours:Array.from({length:24},(_,h)=>({hour_utc:h,muf_mhz:12,
    rows:[5,10].map(f=>({frequency_mhz:f,reliability:a==='n1'&&b==='n2'?(f===5?90:50):(h>=6&&h<18?(f===10?90:40):(f===5?85:30)),snr_db_hz:40}))}))});
   openMesh({id:'m1',kind:'mesh',parameters:{year:2026,month:10,ssn:100,ssn_source:'manual',required_snr:40,reliability:80,frequencies:[5,10]},sites,links,note:'note'});
  });
  assert.equal(await page.locator('#mesh-plan-summary').innerText(),'全経路の切替 10 回 · 目標REL以上 144 / 144 経路時間 · 方針: 経路ごと · 切替を抑える');
  const mesh=await rows('mesh-plan-table');
  assert.deepEqual(mesh[0],['Alpha','Bravo','00:00–24:00 5.000','0','0 時間']);
  assert.deepEqual(mesh[1],['Alpha','Charlie','18:00–06:00 5.000 / 06:00–18:00 10.000','2','0 時間']);
  await page.selectOption('#mesh-plan-mode','common');
  assert.equal(await page.locator('#mesh-plan-summary').innerText(),'切替 2 回 · 全経路が目標REL以上 12 / 24 時間 · 方針: 全経路で共通の周波数');
  assert.deepEqual(await rows('mesh-plan-table'),[['18:00–06:00','5.000','6 / 6','85'],['06:00–18:00','10.000','5 / 6','50']]);
  assert.equal(await page.locator('#mesh-plan-table tr.plan-unmet').count(),1);
  lines=await csv('#mesh-plan-csv');
  assert.equal(lines[0],'hour_utc,tx_id,tx_name,rx_id,rx_name,frequency_mhz,reliability,snr_db_hz,meets_target,switch');
  assert.equal(lines.length,1+6*24);assert.equal(lines[1+6],'6,n1,Alpha,n2,Bravo,10,50,40,0,1');
  if(shots)await page.locator('#mesh-plan').screenshot({path:path.join(shots,'mesh-plan.png')});
  // Printing opens a plain page holding only the plan.
  await page.evaluate(()=>{const open=window.open;window.open=(...args)=>{const w=open(...args);w.print=()=>{window.printedPlan=w.document.body.innerText;w.close();};return w;};});
  await page.locator('#mesh-plan-print').click();
  assert.match(await page.evaluate(()=>window.printedPlan),/^メッシュの24時間運用計画\n[\s\S]*06:00–18:00\t10\.000\t5 \/ 6/);

  // Comparison of two saved single-link results, with the API stubbed.
  await page.evaluate(()=>{
   const make=(id,power,frequencies,rel)=>({id,kind:'point',created:'2026-11-13T0'+id+':00:00+00:00',distance_km:2500,bearing_deg:150,
    parameters:{...params(),year:2026,month:11,ssn:100,ssn_source:'manual',power_w:power,required_snr:40,reliability:80,frequencies,method:30,absorption_mode:'a'},
    ui_selection:{tx:{location:{name:'東京'},antenna:{name:'標準ホイップ'}},rxs:[{location:{name:'Test Site'},antenna:{name:'標準ホイップ'}}]},
    hours:Array.from({length:24},(_,h)=>({hour_utc:h,muf_mhz:12,rows:frequencies.map(f=>({frequency_mhz:f,reliability:rel[f],snr_db_hz:30+rel[f]/10,signal_dbw:-120}))}))});
   const saved={1:make(1,1000,[7,10],{7:70,10:80}),2:make(2,2000,[7,10,14],{7:85,10:75,14:60})};
   window.api=async url=>{if(url==='/api/history')return [2,1].map(id=>({id,created:saved[id].created,kind:'point',parameters:saved[id].parameters,tx_name:'東京',rx_name:'Test Site'}));const m=url.match(/^\/api\/results\/(\d+)$/);if(m)return saved[m[1]];return [];};
   tab('history');
  });
  await page.waitForFunction(()=>document.querySelectorAll('#compare-heatmap td').length===48);
  assert.equal(await page.locator('#compare-panel').isVisible(),true);
  assert.equal(await page.locator('#compare-a').inputValue(),'1');assert.equal(await page.locator('#compare-b').inputValue(),'2');
  assert.equal(await page.locator('#compare-summary').innerText(),'目標REL 80%（Aの値）以上の時間: A 24 時間 → B 24 時間（+0）');
  assert.deepEqual((await rows('compare-conditions')).map(r=>r[0]),['送信電力 W','周波数 MHz']);
  const heat=await page.locator('#compare-heatmap tr').evaluateAll(trs=>trs.slice(1).map(tr=>[...tr.cells].slice(0,2).map(td=>td.innerText.replace(/\n/g,''))));
  assert.deepEqual(heat,[['7.000','+15▲'],['10.000','-5▼']]);
  assert.equal(await page.locator('#compare-counts').innerText(),'Bが高いセル 24 · Bが低いセル 24 · ▲ Bで目標RELに届く 24 · ▼ Bで目標RELを下回る 24');
  assert.match(await page.locator('#compare-only').innerText(),/14\.000 MHz/);
  await page.selectOption('#compare-metric','snr_db_hz');
  assert.equal(await page.locator('#compare-heatmap tr:nth-child(2) td:nth-child(2)').innerText().then(t=>t.split('\n')[0]),'+1.5');
  lines=await csv('#compare-csv');
  assert.equal(lines[0],'hour_utc,frequency_mhz,rel_a,rel_b,rel_diff,snr_a,snr_b,snr_diff');assert.equal(lines.length,1+48);assert.equal(lines[1],'0,7,70,85,15,37,38.5,1.5');
  await page.locator('#compare-swap').click();
  await page.waitForFunction(()=>document.getElementById('compare-a').value==='2'&&/B 24/.test(document.getElementById('compare-summary').textContent));
  await page.selectOption('#compare-metric','reliability');
  if(shots)await page.locator('#compare-panel').screenshot({path:path.join(shots,'compare.png')});
  await page.selectOption('#compare-b','2');
  assert.equal(await page.locator('#compare-caption').innerText(),'別の結果を選んでください。');

  // English.
  await page.selectOption('#compare-b','1');await page.waitForFunction(()=>document.querySelectorAll('#compare-heatmap td').length===48);
  await page.selectOption('#language','en');
  assert.equal(await page.locator('#compare-panel h3').innerText(),'Compare two results');
  assert.match(await page.locator('#compare-summary').innerText(),/^Hours at or above target REL 80% \(A's value\): A 24 h → B 24 h \(\+0\)$/);
  assert.match(await page.locator('#mesh-plan-summary').innerText(),/^2 switches · All paths at or above target REL: 12 \/ 24 hours · Policy: One common frequency for all paths$/);
  assert.match(await page.locator('#diversity-plan-summary').innerText(),/^2 frequency switches · 2 receiving-site switches · At or above target REL: 24 \/ 24 hours · Policy: Fewest switches$/);
  assert.deepEqual(errors,[]);
  console.log('Operating plan and comparison UI checks passed');
 }finally{
  if(browser)await browser.close();child.kill();fs.rmSync(temp,{recursive:true,force:true});
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
