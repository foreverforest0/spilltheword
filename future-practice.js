/* Two future-practice rooms and a seven-ticket timetable printer. */
(()=>{
 'use strict';
 const {tickets,banks}=FuturePracticeData;let dispose=null;
 const previous=setView;setView=function(html){dispose?.();dispose=null;return previous(html)};
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||!!window.SharedGame?.replaying;
 const byId=id=>tickets.find(t=>t.id===id);
 const sectionFor=key=>['continuous','perfect','perfectcontinuous'].includes(key)?'advanced':'basic';
 function setLevel(section){if(['b1','b2'].includes(S.glevel)){S.splevel=S.glevel;return}if(section==='advanced'&&!['b2','c1'].includes(S.splevel))S.splevel='b2';else if(section==='basic')S.splevel=GLV.some(l=>l[0]===S.glevel&&l[0]!=='all')?S.glevel:'b1'}
 function pencil(i){return `<img class="topic-pencil" src="assets/pencils/pencil-${i%8+1}.svg" alt="" aria-hidden="true">`}
 function header(title,back){return `<header class="future-header"><button class="lvb" id="futureBack" aria-label="Back to ${back}">← Topics</button><h1>${esc(title)}</h1></header>`}
 function open(section){
  if(['b1','b2'].includes(S.glevel)){FutureTime.room();return}
  seaOff();document.body.classList.add('grammar-style-active');setLevel(section);S.futureSection=section;save();
  const basic=section==='basic',lower=['a1','a2'].includes(S.glevel),items=basic?[['will','Future Simple / will','Decisions, offers, promises and predictions'],['going','Be going to','Intentions and predictions from evidence'],...(!lower?[['timetable','Timetable: Present Simple','Read seven tickets for future dates']]:[])]:[['continuous','Future Continuous','An activity at a future moment'],['perfect','Future Perfect','A completed result by a future time'],['perfectcontinuous','Future Perfect Continuous','The duration of an activity up to a future time'],['print_continuous','Journey printer','Activities at a future moment · seven documents'],['print_perfect','Deadline printer','Results by a deadline · seven documents'],['print_perfectcontinuous','Duration printer','How long by a future time · seven documents'],['print_mix','Future mix printer','Choose the future form yourself']];
  setView(`<section class="future-page future-room" data-future-section="${section}">${header(basic?'Future Simple / will / going to':'Future Continuous / Perfect / Perfect Continuous','Grammar')}<div class="future-choices">${items.map(([key,title,description],i)=>`<button class="grammar-topic" data-future-task="${key}"><span>${esc(title)}</span><small>${esc(description)}</small>${pencil(i)}</button>`).join('')}</div></section>`);
  $('#futureBack').onclick=()=>{S.gmode='ts';save();go('gram')};
  document.querySelectorAll('[data-future-task]').forEach(b=>b.onclick=()=>spOpen('future_'+b.dataset.futureTask));
  LevelDesign.sync();
 }
 function modeButtons(mode){return `<div class="future-mode" role="group" aria-label="Answer mode"><button class="lvb${mode==='write'?' on':''}" data-future-mode="write" aria-pressed="${mode==='write'}">Write</button><button class="lvb${mode==='speak'?' on':''}" data-future-mode="speak" aria-pressed="${mode==='speak'}">Speak</button></div>`}
 function wireModes(host,state,render){host.querySelectorAll('[data-future-mode]').forEach(b=>b.onclick=()=>{const input=host.querySelector('[data-future-answer]');if(input)state.answers[state.active]=input.value;state.mode=b.dataset.futureMode;save();render()})}
 function initialTicketState(){
  const mandatory=['cinema','park','museum','train','flight'],other=shuffle(['theatre','boat','zoo','aquarium','tour']).slice(0,2);
  const deck=shuffle([...mandatory,...other].map(kind=>{const pool=tickets.filter(t=>t.kind===kind),date=new Date();date.setUTCHours(12,0,0,0);date.setUTCDate(date.getUTCDate()+7+Math.floor(Math.random()*14));return {id:pool[Math.floor(Math.random()*pool.length)].id,date:date.toISOString().slice(0,10)}}));
  return {version:1,deck,printed:0,active:0,mode:'write',answers:{},shown:{},complete:false};
 }
 function ticketState(){
  let s=S.futureTickets;const today=new Date().toISOString().slice(0,10);
  const valid=s?.version===1&&Array.isArray(s.deck)&&s.deck.length===7&&s.deck.every(x=>x&&byId(x.id)&&/^\d{4}-\d{2}-\d{2}$/.test(x.date)&&Number.isFinite(Date.parse(x.date+'T12:00:00Z'))&&x.date>=today)&&new Set(s.deck.map(x=>x.id)).size===7&&Number.isInteger(s.printed)&&s.printed>=0&&s.printed<=7;
  if(!valid)s=S.futureTickets=initialTicketState();
  s.active=Math.max(0,Math.min(s.printed-1,Number.isInteger(s.active)?s.active:0));s.answers=s.answers&&typeof s.answers==='object'?s.answers:{};s.shown=s.shown&&typeof s.shown==='object'?s.shown:{};s.mode=s.mode==='speak'?'speak':'write';return s;
 }
 function dateLabel(date){return new Date(date+'T12:00:00Z').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric',timeZone:'UTC'})}
 function timeLabel(time){const [h,m]=time.split(':').map(Number);return `${h%12||12}${m?':'+String(m).padStart(2,'0'):''} ${h<12?'am':'pm'}`}
 function subject(t){return t.kind==='cinema'?'The film':t.kind==='theatre'?'The show':t.kind==='train'?'The train':t.kind==='flight'?'The flight':t.kind==='boat'?(t.title==='Canal cruise'?'The cruise':'The boat'):t.kind==='tour'?'The tour':t.kind==='park'?'The park':t.kind==='museum'?'The museum':t.kind==='zoo'?'The zoo':t.kind==='aquarium'?'The aquarium':t.title}
 const baseVerb={starts:'start',finishes:'finish',opens:'open',closes:'close',leaves:'leave',arrives:'arrive',departs:'depart'};
 function question(t){let sub=subject(t);if(sub.startsWith('The '))sub='the '+sub.slice(4);return `What time does ${sub} ${baseVerb[t.verb]}?`}
 function models(t){const main=subject(t)+' '+t.verb+' at '+timeLabel(t.time)+'.';return t.kind==='cinema'?[main,t.title+' '+t.verb+' at '+timeLabel(t.time)+'.']:t.kind==='train'||t.kind==='flight'?[main,'The '+t.title+' '+(t.kind==='train'?'train':'flight')+' '+t.verb+' at '+timeLabel(t.time)+'.']:[main]}
 function ticketHTML(t,item,index){
  const style=t.kind==='cinema'?'cinema':['train','flight'].includes(t.kind)?'boarding':t.kind==='museum'?'thermal':['park','zoo','aquarium'].includes(t.kind)?'entry':'admit';
  const label={starts:'START',finishes:'FINISH',opens:'OPEN',closes:'CLOSE',leaves:'DEPARTURE',arrives:'ARRIVAL',departs:'DEPARTURE'}[t.verb];
  return `<article class="tt-ticket tt-ticket--${style}" data-stw-plain aria-label="${esc(t.title+' ticket')}"><div class="tt-ticket-top"><span>${esc(t.kind.toUpperCase())}</span><span>ADMIT ONE</span></div><div class="tt-ticket-name">${esc(t.title)}</div><div class="tt-ticket-venue">${esc(t.venue)}</div><div class="tt-ticket-city">${esc(t.city)}</div><div class="tt-ticket-detail"><div><span>DATE</span><strong>${esc(dateLabel(item.date))}</strong></div><div class="tt-ticket-time"><span>${label}</span><strong>${esc(t.time)}</strong></div></div><p class="tt-ticket-extra">${esc(t.extra)}</p><div class="tt-ticket-stub"><div class="tt-barcode" aria-hidden="true"></div><span>STW ${String(index+1).padStart(2,'0')} ${esc(t.id.toUpperCase())}</span><small>PRACTICE TICKET · LOCAL TIME</small></div></article>`;
 }
 function timetable(){
  seaOff();document.body.classList.add('grammar-style-active');const s=ticketState();save();
  setView(`<section class="future-page timetable-page" data-future-section="basic">${header('Timetable: Present Simple','Future tasks')}<div class="future-toolbar">${modeButtons(s.mode)}<button class="future-how" id="ttHow" aria-expanded="false" aria-controls="ttHelp">How to?</button></div><p class="future-help" id="ttHelp" hidden>Read the date and time on each ticket. Say or write one full sentence in the Present Simple about the future timetable. Real places, carriers and film titles are used; dates and times are created for practice. Seven tickets are selected without repeats.</p><div class="tt-layout"><div class="tt-printer" aria-label="Ticket printer"><div class="tt-housing" aria-hidden="true"><img src="assets/timetable/printer-reference.jpg" alt="" draggable="false"></div><div class="tt-paper-window" id="ttPaper"></div><div class="tt-printer-idle" id="ttIdle">TICKET PRINTER</div></div><section class="tt-task" aria-label="Ticket task"><p class="tt-progress" id="ttProgress" role="status"></p><div id="ttQuestion"></div><button class="lvb tt-print" id="ttPrint">Print ticket</button><nav class="tt-history" id="ttHistory" aria-label="Printed tickets"></nav></section></div></section>`);
  const root=$('.timetable-page'),paper=$('#ttPaper'),task=$('#ttQuestion'),button=$('#ttPrint');let busy=false,timer=0,alive=true;
  const sound=typeof FuturePracticeData.printerSound==='string'&&FuturePracticeData.printerSound?new Audio(FuturePracticeData.printerSound):null;
  if(sound)sound.preload='auto';
  function stopSound(){if(!sound)return;sound.pause();try{sound.currentTime=0}catch{}}
  const syncSound=e=>{if(sound&&e.target.closest?.('#sndbtn'))sound.muted=S.snd===false};
  document.addEventListener('click',syncSound);
  dispose=()=>{alive=false;clearTimeout(timer);stopSound();document.removeEventListener('click',syncSound)};
  $('#futureBack').onclick=()=>open('basic');wireModes(root,s,timetable);
  $('#ttHow').onclick=()=>{const h=$('#ttHelp');h.hidden=!h.hidden;$('#ttHow').setAttribute('aria-expanded',String(!h.hidden))};
  function draw(){
   $('#ttIdle').hidden=!!s.printed;
   $('#ttProgress').textContent=s.complete?'7 / 7 · Complete':`${s.printed?s.active+1:0} / 7`;
   button.textContent=s.complete?'New seven tickets':s.printed===7?'Finish':s.printed?'Print next ticket':'Print ticket';
   $('#ttHistory').innerHTML=Array.from({length:s.printed},(_,i)=>`<button class="tt-history-ticket${i===s.active?' on':''}" data-ticket-index="${i}" aria-label="Review ticket ${i+1}" aria-current="${i===s.active?'step':'false'}">${i+1}</button>`).join('');
   $('#ttHistory').querySelectorAll('button').forEach(b=>b.onclick=()=>{if(busy)return;s.active=+b.dataset.ticketIndex;s.complete=false;save();draw()});
   if(!s.printed){paper.innerHTML='';task.innerHTML='<p class="future-intro">Print a ticket. Read its future date and say when the event happens.</p>';return}
   const item=s.deck[s.active],t=byId(item.id);paper.innerHTML=ticketHTML(t,item,s.active);
   task.innerHTML=`<p class="tt-future-date">${esc(dateLabel(item.date))}</p><h2 class="tt-question" data-stw-plain>${esc(question(t))}</h2><p class="tt-task-cue">${s.mode==='speak'?'Say one sentence in the Present Simple.':'Write one sentence in the Present Simple.'}</p>${s.mode==='write'?`<label class="sr-only" for="ttAnswer">Your answer</label><textarea rows="2" maxlength="350" class="future-answer" id="ttAnswer" data-future-answer spellcheck="false" placeholder="Your answer…">${esc(typeof s.answers[s.active]==='string'?s.answers[s.active].slice(0,350):'')}</textarea>`:''}<button class="lvb" id="ttShow" aria-expanded="${!!s.shown[s.active]}" aria-controls="ttModels">${s.shown[s.active]?'Hide answer':'Show answer'}</button><div id="ttModels" class="future-models" ${s.shown[s.active]?'':'hidden'}>${models(t).map(a=>`<p>${esc(a)}</p>`).join('')}</div>`;
   $('#ttAnswer')?.addEventListener('input',e=>{s.answers[s.active]=e.target.value;save()});
   $('#ttShow').onclick=()=>{s.shown[s.active]=!s.shown[s.active];save();$('#ttModels').hidden=!s.shown[s.active];$('#ttShow').textContent=s.shown[s.active]?'Hide answer':'Show answer';$('#ttShow').setAttribute('aria-expanded',String(!!s.shown[s.active]))};
  }
  button.onclick=()=>{
   if(busy)return;
   if(s.complete){S.futureTickets=initialTicketState();save();timetable();return}
   if(s.printed===7){s.complete=true;save();draw();return}
   busy=true;s.active=s.printed++;s.complete=false;save();draw();button.disabled=true;if(innerWidth<760)root.querySelector('.tt-printer').scrollIntoView({block:'start',behavior:reduced()?'instant':'smooth'});root.dataset.phase='printing';
   const ticket=paper.querySelector('.tt-ticket');ticket.style.visibility='hidden';
   const startFeed=()=>{
    if(!alive)return;
    const measured=sound&&Number.isFinite(sound.duration)?Math.round(sound.duration*1000):0;
    const duration=Math.max(300,Math.min(15000,measured||Number(FuturePracticeData.printerDurationMS)||1600));
    ticket.style.animationDuration=duration+'ms';ticket.style.visibility='';ticket.classList.add('tt-feeding');
    timer=setTimeout(()=>{if(!alive)return;busy=false;root.dataset.phase='ready';ticket.classList.remove('tt-feeding');button.disabled=false;if(!reduced())stopSound()},reduced()?0:duration+50);
   };
   if(sound&&S.snd!==false&&!window.SharedGame?.replaying){stopSound();sound.muted=false;sound.play().then(startFeed).catch(startFeed)}else startFeed();
  };
  draw();root.dataset.phase='ready';
 }
 function practice(key){
  const bank=banks[key];if(!bank)return;seaOff();document.body.classList.add('grammar-style-active');setLevel(sectionFor(key));const writtenOnly=S.splevel==='b1'||['will','going'].includes(key);
  S.futureExercises=S.futureExercises||{};let state=S.futureExercises[key];
  if(!state||!Array.isArray(state.order)||state.order.length!==7||!state.order.every(id=>bank.items.some(x=>x.id===id)))state=S.futureExercises[key]={order:shuffle(bank.items.map(x=>x.id)).slice(0,7),active:0,mode:'write',answers:{},shown:{}};
  state.active=Math.max(0,Math.min(6,Number.isInteger(state.active)?state.active:0));state.answers=state.answers||{};state.shown=state.shown||{};state.mode=!writtenOnly&&state.mode==='speak'?'speak':'write';save();
  const row=bank.items.find(x=>x.id===state.order[state.active]);
  setView(`<section class="future-page future-exercise" data-future-section="${sectionFor(key)}">${header(bank.title,'Future tasks')}<div class="future-toolbar">${writtenOnly?'':modeButtons(state.mode)}<span>${state.active+1} / 7</span></div><div class="future-exercise-card"><p class="future-context">${esc(row.context)}</p><h2 class="future-prompt" data-stw-plain>${esc(row.prompt)}</h2>${row.hint?`<div class="future-hint-area"><button type="button" class="lvb" id="futureHint" aria-expanded="false" aria-controls="futureHintText">Hint</button><p class="future-hint" id="futureHintText" hidden>${esc(row.hint)}</p></div>`:''}${state.mode==='write'?`<textarea rows="2" maxlength="500" class="future-answer" data-future-answer aria-label="Your answer" spellcheck="false" placeholder="Your answer…">${esc(typeof state.answers[state.active]==='string'?state.answers[state.active].slice(0,500):'')}</textarea>`:'<p>Say your answer aloud.</p>'}<button class="lvb" id="futureShow" aria-expanded="${!!state.shown[state.active]}" aria-controls="futureModels">${state.shown[state.active]?'Hide answer':'Show answer'}</button><div class="future-models" id="futureModels" ${state.shown[state.active]?'':'hidden'}>${row.answers.map(a=>`<p>${esc(a)}</p>`).join('')}</div></div><div class="future-navigation">${state.active?'<button class="lvb" id="futurePrevious">← Back</button>':'<span></span>'}<button class="lvb" id="futureNext">${state.active===6?'New seven questions':'Next →'}</button></div></section>`);
  const root=$('.future-exercise');$('#futureBack').onclick=()=>open(sectionFor(key));wireModes(root,state,()=>practice(key));
  root.querySelector('[data-future-answer]')?.addEventListener('input',e=>{state.answers[state.active]=e.target.value;save()});
  if($('#futureHint'))$('#futureHint').onclick=()=>{const hint=$('#futureHintText');hint.hidden=!hint.hidden;$('#futureHint').setAttribute('aria-expanded',String(!hint.hidden))};
  $('#futureShow').onclick=()=>{state.shown[state.active]=!state.shown[state.active];save();$('#futureModels').hidden=!state.shown[state.active];$('#futureShow').textContent=state.shown[state.active]?'Hide answer':'Show answer';$('#futureShow').setAttribute('aria-expanded',String(!!state.shown[state.active]))};
  if($('#futurePrevious'))$('#futurePrevious').onclick=()=>{state.active--;save();practice(key)};
  $('#futureNext').onclick=()=>{if(state.active===6)delete S.futureExercises[key];else state.active++;save();practice(key)};
 }
 const routes={basic:()=>open('basic'),advanced:()=>open('advanced'),timetable,...Object.fromEntries(Object.keys(banks).map(key=>[key,()=>practice(key)]))};
 for(const [key,fn]of Object.entries(routes)){const id='future_'+key;DMT[id]=1;DMTF[id]=fn;SPSHORT[id]=key==='basic'?'Future Simple / will / going to':key==='advanced'?'Future Continuous / Perfect / Perfect Continuous':key==='timetable'?'Timetable: ticket printer':banks[key].title;SPT.push({id,n:SPSHORT[id],d:key==='timetable'?'Read seven tickets and describe their future timetable.':'Practise one future form at a time.'})}
 for(const level of ['kids','a1','a2']){for(const group of SPGRP[level])group[1]=group[1].filter(id=>id!=='future_timetable');const list=SPLV.find(l=>l[0]===level)[2];const i=list.indexOf('future_timetable');if(i>=0)list.splice(i,1)}
 window.FuturePractice={open,timetable,practice,question,models,get tickets(){return tickets},get banks(){return banks}};
})();
