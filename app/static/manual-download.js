'use strict';
// The manual download follows the screen language (one illustrated PDF per locale).
(function(){
 const link=document.getElementById('manual-pdf');if(!link)return;
 const locales=['ja','en','fr','es','it','pt','de','ko'];
 function update(language){
  const name=`CHUCK_Operation_Manual_${locales.includes(language)?language:'ja'}.pdf`;
  link.href='manual/'+name;link.download=name;
 }
 update(document.documentElement.lang);
 window.addEventListener('hf-language-change',e=>update(e.detail.language));
})();
