/* Shared action colours and final catalog cleanup. */
(()=>{
 const removed=new Set(['tl1','tl2','future_lift']);
 for(const groups of Object.values(SPGRP))for(const group of groups)group[1]=group[1].filter(id=>!removed.has(id));
 for(const level of SPLV)level[2]=level[2].filter(id=>!removed.has(id));
 for(let i=SPT.length-1;i>=0;i--)if(removed.has(SPT[i].id))SPT.splice(i,1);
 for(const id of removed){delete DMT[id];delete DMTF[id]}
 const open=spOpen;
 spOpen=function(id){if(removed.has(id)){go('gram');return}return open.apply(this,arguments)};
 for(const id of ['kts','kpl','ked','kig','tpc']){
  const cfg=TYD[id];if(!cfg)continue;
  const original=cfg.pool;
  cfg.pool=function(mode){
   const details=id==='ked'?['after lunch','on Monday','at five']:id==='kts'?['every morning','on Saturdays','after school']:['right now','today','this morning'];
   return original.call(this,mode).map((item,i)=>{
    if(/yesterday|last |\bnow\b|\btoday\b|\bmorning\b/.test(item.p))return item;
    return {...item,p:item.p.replace(/[.!?]?$/,' '+details[i%details.length]+'.')};
   });
  };
 }
 const view=document.getElementById('view');
 function update(){
  const level=view.querySelector('[data-pond-topic],[data-topic],[data-practice-level]')?.dataset;
  view.dataset.actionLevel=(level?.pondTopic||level?.topic||level?.practiceLevel||S.splevel||'kids').split(':')[0];
  for(const button of view.querySelectorAll('button')){
   const label=button.textContent.trim();
   if(/\b(check|release & check)\b/i.test(label)&&!/^check(ing|ed)/i.test(label))button.dataset.grammarAction='check';
   else if(/\b(show|hide) (the |an )?(answer|example|solution)\b/i.test(label))button.dataset.grammarAction='show';
   else delete button.dataset.grammarAction;
  }
 }
 new MutationObserver(update).observe(view,{childList:true,subtree:true,characterData:true});
 update();
})();
