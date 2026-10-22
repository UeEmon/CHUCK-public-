'use strict';
// Release notes for users: whats-new.json lists features newest first, back to the first release.
// Notes tied to an element ("element") announce a feature: unseen ones get a banner and tab dots without
// blocking the page, and show only once the element is on the page, so a note can land before the feature.
// Notes without an element are the history and never count as new.
const NEWS_SEEN='chuck-whats-new-seen',NEWS_WINDOW_DAYS=60;
let newsItems=[];
function newsSeen(){try{return localStorage.getItem(NEWS_SEEN);}catch{return null;}}
function newsUnseen(){
 // Announcements newer than the last entry seen; a first visit counts the recent ones as new.
 const seen=newsSeen(),index=newsItems.findIndex(n=>n.id===seen),since=Date.now()-NEWS_WINDOW_DAYS*86400000;
 return (index>=0?newsItems.slice(0,index):newsItems.filter(n=>Date.parse(n.date)>=since)).filter(n=>n.element);
}
function markNewsSeen(){if(newsItems.length)try{localStorage.setItem(NEWS_SEEN,newsItems[0].id);}catch{/* Shown again next time. */}renderNewsBadges();}
function renderNewsBadges(){
 const unseen=newsUnseen(),tabs=new Set(unseen.map(n=>n.tab));
 for(const b of document.querySelectorAll('.tabs [data-tab]'))b.classList.toggle('is-new',tabs.has(b.dataset.tab));
 $('whats-new-count').textContent=unseen.length?String(unseen.length):'';$('whats-new-count').hidden=!unseen.length;
 $('news-banner').hidden=!unseen.length;$('news-banner-text').textContent=`新しい機能が${unseen.length}件あります。`;
}
function openNews(){
 const unseen=new Set(newsUnseen().map(n=>n.id)),list=$('whats-new-list');list.replaceChildren();
 let date=null;
 for(const n of newsItems){
  if(n.date!==date){date=n.date;const day=cell('li',date);day.className='news-date';list.append(day);}
  const item=document.createElement('li'),head=document.createElement('div');
  if(unseen.has(n.id)){const badge=cell('span','NEW');badge.className='news-new';head.append(badge);}
  head.append(cell('strong',n.title));item.append(head,cell('p',n.text));
  if(n.tab&&document.querySelector(`.tabs [data-tab="${n.tab}"]`)){
   const show=cell('button','見る');show.type='button';show.onclick=()=>{closeNews();tab(n.tab);if(n.element)$(n.element)?.scrollIntoView({block:'center'});};item.append(show);
  }
  list.append(item);
 }
 const dialog=$('whats-new');if(!dialog.open)dialog.showModal();
}
function closeNews(){markNewsSeen();const dialog=$('whats-new');if(dialog.open)dialog.close();}
$('whats-new-open').onclick=openNews;$('news-banner-open').onclick=openNews;$('news-banner-close').onclick=markNewsSeen;$('whats-new-close').onclick=closeNews;$('whats-new').addEventListener('cancel',markNewsSeen);
fetch('whats-new.json').then(r=>r.ok?r.json():[]).then(rows=>{
 newsItems=rows.filter(n=>!n.element||(document.getElementById(n.element)&&document.querySelector(`.tabs [data-tab="${n.tab}"]`)));
 renderNewsBadges();
}).catch(()=>{/* Release notes are optional. */});
