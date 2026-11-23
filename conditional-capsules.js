/* Each row keeps the same past event while the result moves from past to present.
   Course vocabulary: B2 ALH units/lessons in docs/b2-alh-approved.json. */
(()=>{
 const phone=['You didn’t charge your phone.','You missed an important call.','You can’t use your phone now.',
  'If I had charged my phone, I wouldn’t have missed the call.','If I had charged my phone, I could use it now.'];
 const b2=[phone,
  ['You didn’t swap your shift.','You missed your job interview.','You’re still looking for a job.',
   'If I had swapped my shift, I wouldn’t have missed my job interview.','If I had swapped my shift, I might have a new job now.'],
  ['You spent your entire paycheck.','You couldn’t take the city train yesterday.','You can’t afford a ticket today.',
   'If I hadn’t spent my entire paycheck, I could have taken the city train yesterday.','If I hadn’t spent my entire paycheck, I could afford a ticket today.'],
  ['You didn’t apply for the job.','You missed the chance to interview.','You’re still in your old job.',
   'If I had applied for the job, I might have got an interview.','If I had applied for the job, I might have a different job now.'],
  ['You weren’t open-minded about the suggestion.','You rejected a useful idea.','The same problem is still unresolved.',
   'If I had been more open-minded, I might not have rejected the idea.','If I had been more open-minded, we might have a solution now.'],
  ['You skipped the training.','You made a mistake on your first shift.','You’re still unsure how to do the task.',
   'If I hadn’t skipped the training, I might not have made a mistake on my first shift.','If I hadn’t skipped the training, I might know how to do the task now.']
 ];
 const c1=[...b2.slice(1),
  ['You ignored the evidence.','You drew the wrong conclusion.','You still trust the wrong explanation.',
   'If I hadn’t ignored the evidence, I wouldn’t have drawn the wrong conclusion.','If I hadn’t ignored the evidence, I might trust a different explanation now.'],
  ['You showed little flexibility during the talks.','The other side walked away.','There’s still no agreement.',
   'If I had shown more flexibility during the talks, the other side might not have walked away.','If I had shown more flexibility during the talks, we might have an agreement by now.'],
  ['You kept fixating on one setback.','You passed up a chance to try again.','Your achievement still feels out of reach.',
   'If I hadn’t kept fixating on that setback, I might not have passed up the chance to try again.','If I hadn’t kept fixating on that setback, my goal might be within reach now.']
 ];
 function open(level){
  seaOff();gachaOff();gcInject();S.splevel=level;
  const deck=shuffle((level==='c1'?c1.slice():b2.slice(1)));
  if(level==='b2')deck.unshift(phone);
  let index=-1,phase='ready',mode=0,opened=[false,false],timer=0,drafts=['',''];
  setView(`<section class="panel k-card cbpanel conditional-capsules" data-practice-level="${level}" data-stw-plain>
   <div class="cbbar"><button class="lvb" id="yesterdayBack">← Back to topics</button><h2>Another version of yesterday</h2></div>
   <div class="gcw"><div class="gcm"><img src="ch/gacha/machine.png" alt=""><button type="button" class="gck" id="yesterdayTurn" aria-label="Turn the handle"></button><div class="gcctr" id="yesterdayTray"></div></div>
   <div class="gcr"><button class="lvb" id="yesterdayNew">Turn the handle</button>
   <section id="yesterdayRound" hidden>
    <div class="gcs A"><small>Past event</small><div class="gv" id="yesterdayEvent"></div></div>
    <div class="gcs B"><small>Result</small><div class="gv" id="yesterdayResult" aria-live="polite"></div></div>
    <div class="result-switch" role="group" aria-label="When is the result?"><button class="lvb" type="button" data-result-time="0">THEN</button><button class="lvb" type="button" data-result-time="1">NOW</button></div>
    <p id="yesterdayPrompt"></p>
    <form id="yesterdayForm"><textarea id="yesterdayAnswer" rows="2" aria-label="Your conditional sentence"></textarea><button class="lvb" type="submit">Check</button></form>
    <p id="yesterdayFeedback" role="status"></p>
    <details id="yesterdayExample"><summary>Show answer</summary><p></p></details>
   </section></div></div></section>`);
  const root=$('.conditional-capsules'),get=id=>root.querySelector('#yesterday'+id);
  const tray=get('Tray'),knob=get('Turn'),next=get('New'),answer=get('Answer');
  function paint(){
   const row=deck[index];const ready=opened.every(Boolean);
   get('Round').hidden=false;get('Event').textContent=opened[0]?row[0]:'—';get('Result').textContent=opened[1]?row[mode+1]:'—';
   root.querySelectorAll('[data-result-time]').forEach(button=>{
    button.disabled=!ready;button.setAttribute('aria-pressed',String(+button.dataset.resultTime===mode));
   });
   get('Prompt').textContent=ready?(mode?'Change the result to now.':'Change the past. Start with If I …'):'';
   get('Form').hidden=!ready;get('Example').hidden=!ready;
   get('Example').open=false;get('Example').querySelector('p').textContent=row[mode+3];
   get('Feedback').textContent='';answer.value=drafts[mode];
  }
  function turn(){
   if(phase==='dropping')return;
   index=(index+1)%deck.length;mode=0;opened=[false,false];drafts=['',''];phase='dropping';
   knob.disabled=true;next.disabled=true;next.textContent='New capsules';
   get('Round').hidden=true;tray.replaceChildren();knob.classList.add('go');
   sfx('click');
   timer=setTimeout(()=>{
    if(!root.isConnected)return;
    knob.classList.remove('go');phase='opening';
    for(const i of [0,1]){
     const cap=document.createElement('button');cap.type='button';cap.className='gcc bn';cap.style.left=(i*43)+'%';cap.style.top='36%';
     cap.setAttribute('aria-label',i?'Open result capsule':'Open past event capsule');
     cap.innerHTML=`<img src="ch/gacha/cap${i?'B':'A'}.png" alt="">`;
     cap.onclick=()=>{opened[i]=true;cap.remove();sfx('ding');paint();if(opened.every(Boolean)){phase='ready';knob.disabled=false;next.disabled=false;answer.focus({preventScroll:true})}else tray.firstElementChild?.focus({preventScroll:true})};
     tray.append(cap);
    }
    tray.firstElementChild.focus({preventScroll:true});
   },matchMedia('(prefers-reduced-motion: reduce)').matches?0:680);
  }
  get('Back').onclick=()=>{clearTimeout(timer);spSetup()};
  knob.onclick=next.onclick=turn;
  root.querySelectorAll('[data-result-time]').forEach(button=>button.onclick=()=>{drafts[mode]=answer.value;mode=+button.dataset.resultTime;paint()});
  get('Form').onsubmit=e=>{
   e.preventDefault();const value=answer.value.trim();
   get('Feedback').textContent=!value?'Write a sentence first.':b1AnswerMatch(value,deck[index][mode+3])?'✓ Correct.':'Compare your condition and result with the model.';
  };
 }
 for(const level of ['b2','c1']){
  const id='conditional_capsules_'+level,title='Another version of yesterday';
  DMT[id]=1;DMTF[id]=()=>open(level);SPSHORT[id]=title;
  SPT.push({id,n:title,d:'Open two capsules. Change the past, then switch from a past result to a present result.'});
  SPLV.find(item=>item[0]===level)[2].push(id);
  const groups=SPGRP[level].filter(item=>level==='c1'?/· Conditionals$/.test(item[0]):/· (?:Third|Mixed) conditionals?$/i.test(item[0]));
  groups.forEach(([,ids])=>ids.push(id));
 }
})();
