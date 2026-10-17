'use strict';
const polarizationLabels={model:'アンテナモデルに従う',vertical:'垂直偏波',horizontal:'水平偏波',rhcp:'右旋円偏波',lhcp:'左旋円偏波',linear_other:'その他直線偏波'};
function renderPolarizationSettings(){
 const target=$('polarization-settings');target.replaceChildren();
 for(const [i,e]of [circuit.tx,...circuit.rxs].entries()){
  const label=cell('label',i===0?'TX · 偏波':'RX'+i+' · 偏波'),select=document.createElement('select');
  for(const [value,text]of Object.entries(polarizationLabels))select.add(new Option(text,value));
  select.value=e.polarization??'model';select.onchange=()=>e.polarization=select.value;label.append(select);target.append(label);
 }
}
function updateRadioConditions(){
 const bandwidth=fields.snr_input.value==='bandwidth';$('bandwidth-settings').hidden=!bandwidth;
 fields.bandwidth_hz.disabled=fields.inband_snr_db.disabled=!bandwidth;fields.required_snr.readOnly=bandwidth;
 if(bandwidth){const b=Number(fields.bandwidth_hz.value),snr=Number(fields.inband_snr_db.value);if(b>0&&Number.isFinite(snr))fields.required_snr.value=(snr+10*Math.log10(b)).toFixed(4);}
 $('snr-conversion').textContent=bandwidth?'SNR₁Hz = SNR帯域内 + 10 log₁₀(B [Hz]) → '+fields.required_snr.value+' dB·Hz':'要求SNRは1 Hz帯域換算値（dB·Hz）です。';
}
fields.modulation.onchange=()=>{
 const example={cw:24,ssb:45,am:67}[fields.modulation.value];
 if(example!==undefined){fields.snr_input.value='direct';fields.required_snr.value=example;}
 updateRadioConditions();
};
for(const key of ['snr_input','bandwidth_hz','inband_snr_db'])fields[key].addEventListener('input',updateRadioConditions);
updateRadioConditions();
function radioCaption(p,multiple=false){return ' · '+p.modulation+' · TX '+(polarizationLabels[p.tx_polarization]??polarizationLabels.model)+' / '+(multiple?'RX1 ':'RX ')+(polarizationLabels[p.rx_polarization]??polarizationLabels.model)+' · 追加偏波損失 '+(p.polarization_loss_db??0)+' dB';}
