'use strict';
const polarizationLabels={model:'アンテナモデルに従う',vertical:'垂直偏波',horizontal:'水平偏波',rhcp:'右旋円偏波',lhcp:'左旋円偏波',linear_other:'その他直線偏波'};
function renderPolarizationSettings(){
 const target=$('polarization-settings');target.replaceChildren();
 for(const [i,e]of [circuit.tx,...circuit.rxs].entries()){
  const label=cell('label',typeof meshMode==='function'&&meshMode()?'拠点'+(i+1)+' · 偏波':i===0?'TX · 偏波':'RX'+i+' · 偏波'),select=document.createElement('select');
  for(const [value,text]of Object.entries(polarizationLabels))select.add(new Option(text,value));
  select.value=e.polarization??'model';select.onchange=()=>e.polarization=select.value;label.append(select);target.append(label);
 }
}
// Typical occupied bandwidths in the 電波型式 notation; the field stays editable.
const emissionBandwidths={A1A:'500H',F1B:'304H',G1B:'500H',J2B:'500H',A3E:'6K00',H3E:'3K00',R3E:'3K00',J3E:'3K00',F3E:'16K0',F1D:'3K00',G1D:'3K00',J2D:'3K00'};
const legacyModulations={cw:'A1A',ssb:'J3E',am:'A3E',fm:'F3E',fsk:'F1B'};
// Three figures with the unit letter H/K/M/G standing at the decimal point, e.g. 2K40 = 2400 Hz.
function bandwidthHz(code){const m=/^([1-9][0-9]{0,2})([HKMG])([0-9]*)$/.exec(String(code).toUpperCase());return m&&code.length===4?Number(m[1]+'.'+(m[3]||'0'))*{H:1,K:1e3,M:1e6,G:1e9}[m[2]]:NaN;}
function emissionLabel(p){return p.modulation==='manual'||!p.modulation?'電波型式未指定':(p.bandwidth??'')+p.modulation;}
function updateRadioConditions(){
 const bandwidth=fields.snr_input.value==='bandwidth',hz=bandwidthHz(fields.bandwidth.value);$('bandwidth-settings').hidden=!bandwidth;
 fields.inband_snr_db.disabled=!bandwidth;fields.required_snr.readOnly=bandwidth;
 if(bandwidth){const snr=Number(fields.inband_snr_db.value);if(hz>0&&Number.isFinite(snr))fields.required_snr.value=(snr+10*Math.log10(hz)).toFixed(4);}
 $('emission-designation').textContent=Number.isFinite(hz)?(fields.modulation.value==='manual'?'占有帯域幅 '+hz+' Hz':'電波型式の表記：'+fields.bandwidth.value.toUpperCase()+fields.modulation.value+'（占有帯域幅 '+hz+' Hz）'):'占有帯域幅は3K00、2K40、500Hのように入力してください。';
 $('snr-conversion').textContent=bandwidth?'SNR₁Hz = SNR帯域内 + 10 log₁₀(B [Hz]) → '+fields.required_snr.value+' dB·Hz':'要求SNRは1 Hz帯域換算値（dB·Hz）です。';
}
fields.modulation.onchange=()=>{
 const example={A1A:19,J3E:39,A3E:48}[fields.modulation.value];
 if(example!==undefined){fields.snr_input.value='direct';fields.required_snr.value=example;}
 if(emissionBandwidths[fields.modulation.value])fields.bandwidth.value=emissionBandwidths[fields.modulation.value];
 updateRadioConditions();
};
for(const key of ['snr_input','bandwidth','inband_snr_db'])fields[key].addEventListener('input',updateRadioConditions);
updateRadioConditions();
// VOACAP METHOD 30/21/22 are the Auto/Ducted/Ray-hop choices of VOACAP Online Marine.
const methodLabels={30:'Auto（30）',21:'Ducted（21）',22:'Ray-hop（22）'};
function methodCaption(p){return ' · 計算方式 '+(methodLabels[p.method]??methodLabels[30]);}
function absorptionLabel(p){return p.absorption_mode==='a'?'a（Marine互換）':'W（VOACAP標準）';}
function radioCaption(p,multiple=false){return ' · '+emissionLabel(p)+' · TX '+(polarizationLabels[p.tx_polarization]??polarizationLabels.model)+' / '+(multiple?'RX1 ':'RX ')+(polarizationLabels[p.rx_polarization]??polarizationLabels.model)+' · 追加偏波損失 '+(p.polarization_loss_db??0)+' dB · 吸収モード '+absorptionLabel(p)+methodCaption(p);}
