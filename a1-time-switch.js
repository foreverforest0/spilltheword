(() => {
 'use strict';
 const cards = [
  ['mem catlaptop','The cat','works','is working','on the laptop','every morning','right now'],
  ['mem mic','He','talks','is talking','into the microphone','usually','today'],
  ['mem fine','The dog','sits','is sitting','at the table','every single day','right now'],
  ['mem blink','He','looks','is looking','at the screen','often','at the moment'],
  ['mem sponge','He','works','is working','','on Mondays','this week'],
  ['mem chair','He','sits','is sitting','on the chair','every afternoon','now'],
  ['mem monkey','The monkey','looks','is looking','around','every day','right now'],
  ['mem raccoon','The raccoon','looks','is looking','for food','every evening','at the moment'],
 ].filter(([image])=>PICS[image]);
 const clean=s=>s.toLowerCase().replace(/[’‘]/g,"'").replace(/[.!?,]/g,'').trim().replace(/\s+/g,' ').replace(/\b(he|she|it)'s\b/g,'$1 is');
 function open(marker){
  S.splevel='a1';
  const deck=shuffle(cards.slice());
  let index=0, side=0, changed=false, drafts=['',''], shown=false;
  function render(focus){
   const [image,subject,simple,continuous,rest,routine,now]=deck[index];
   const from=index%2, target=1-from;
   const active=marker?(changed?target:from):side;
   const time=active?now:routine, verb=active?continuous:simple;
   const medial=!active&&['usually','often'].includes(time);
   const sentence=(form,mark=false)=>{
    const span=value=>mark?`<mark>${esc(value)}</mark>`:esc(value);
    return [subject,medial?span(time):'',span(form),rest,medial?'':span(time)].filter(Boolean).join(' ')+'.';
   };
   const answer=marker?verb:sentence(verb);
   const draft=marker?drafts[0]:drafts[side];
   const switcher=`<div class="ats-switch" data-side="${side}" role="group" aria-label="Time"><i aria-hidden="true"></i><button type="button" data-ats-side="0" aria-pressed="${side===0}"><strong>Every day</strong><span>${routine}</span></button><button type="button" data-ats-side="1" aria-pressed="${side===1}"><strong>Right now</strong><span>${now}</span></button></div>`;
   setView(`<section class="ats-page" data-practice-level="a1"><header><button type="button" id="atsBack">Topics</button><h1>${marker?'Change the verb':'Every day or right now?'}</h1></header>
    ${marker?`<p>${changed?'Change the highlighted verb.':'Read the sentence. Then change the time.'}</p><div class="ats-line" id="atsSentence">${sentence(from?continuous:simple,changed)}</div><button type="button" id="atsChange" ${changed?'disabled':''}>Change time</button>`:
    `${switcher}<p>Say or write one sentence about the picture. Then switch sides and make another.</p>`}
    <img class="ats-image" src="${PICS[image]}" alt="Meme for this round">
    ${!marker||changed?`<form id="atsForm"><label for="atsAnswer">${marker?'New verb form':'Your sentence'}</label><textarea id="atsAnswer" rows="2" maxlength="300">${esc(draft)}</textarea><button type="submit">Check</button></form>
    <button type="button" id="atsShow" aria-expanded="${shown}">${shown?'Hide answer':'Show answer'}</button><p id="atsExample" ${shown?'':'hidden'}>${sentence(verb)}</p><p id="atsFeedback" role="status"></p>`:''}
    <nav><span>${index+1} / ${deck.length}</span><button type="button" id="atsNext">Next picture</button></nav></section>`);
   $('#atsBack').onclick=()=>{S.glevel='a1';go('gram')};
   $('#atsNext').onclick=()=>{index=(index+1)%deck.length;side=0;changed=false;drafts=['',''];shown=false;render('#atsNext')};
   document.querySelectorAll('[data-ats-side]').forEach(button=>button.onclick=()=>{
    if(side===Number(button.dataset.atsSide))return;
    side=Number(button.dataset.atsSide);shown=false;render(`[data-ats-side="${side}"]`);
    const ball=$('.ats-switch i');
    const direction=side?-1:1;
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches)ball.animate([
     {transform:`translateX(${direction*100}%) scaleX(.97)`},{transform:`translateX(${direction*43}%) scaleX(1.13)`},{transform:'translateX(0) scaleX(1)'},
    ],{duration:440,easing:'cubic-bezier(.22,.78,.3,1)'});
   });
   if($('#atsChange'))$('#atsChange').onclick=()=>{changed=true;render('#atsAnswer')};
   const input=$('#atsAnswer');
   if(input){
    input.oninput=()=>{drafts[marker?0:side]=input.value;$('#atsFeedback').textContent=''};
    $('#atsForm').onsubmit=e=>{
     e.preventDefault();
     const value=clean(input.value), model=clean(answer);
     const wrong=clean(marker?(active?simple:continuous):sentence(active?simple:continuous));
     $('#atsFeedback').textContent=!value?'Write an answer, or say it aloud and use Show answer.':(GrammarArticles.equivalent(value,model)||marker&&GrammarArticles.equivalent(value,clean(sentence(verb))))?'Correct!':value===wrong?'Look at the new time clue. '+(active?'Use am, is or are + -ing.':'Use the Present Simple.'):'Compare with the example. Check that your verb fits the time clue.';
    };
    $('#atsShow').onclick=()=>{shown=!shown;$('#atsExample').hidden=!shown;$('#atsShow').textContent=shown?'Hide answer':'Show answer';$('#atsShow').setAttribute('aria-expanded',String(shown))};
   }
   if(focus)$(focus)?.focus({preventScroll:true});
  }
  render();
 }
 const groups=SPGRP.a1;
 const ids=[];
 for(const [id,title,marker] of [['a1_every_now','Every day or right now?',false],['a1_time_marker','Change the verb · time marker',true]]){
  DMT[id]=1;DMTF[id]=()=>open(marker);SPSHORT[id]=title;SPT.push({id,n:title,d:'Practise Present Simple and Present Continuous.'});ids.push(id);
 }
 groups.push([1+Math.max(...groups.map(([name])=>parseInt(name,10)||0))+' · Present Simple or Present Continuous',ids]);
 SPLV.find(([level])=>level==='a1')[2].push(...ids);
})();
