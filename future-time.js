/* Seven-document future practice and the time lift; no grading of free wording. */
(()=>{
 'use strict';
 let {documents,lift}=FutureTimeData;const version=4;
 let all=Object.values(documents).flat();const find=id=>all.find(x=>x.id===id);
 const level=()=>['b1','b2'].includes(S.glevel)?S.glevel:'b2';
 function useCourse(){const data=FutureLevelData[level()];documents=data.documents;lift=data.lift;all=Object.values(documents).flat();return data}
 const modeNames={will:'Future Simple / will',timetable:'Present Simple: timetables',mix:'Mix: will and timetables'};
 const titles=Object.fromEntries(['will','going','arrangement','timetable','continuous','perfect','perfectcontinuous','mix'].map(k=>[k,'Future printer']));
 let cleanup=null;
 const previous=setView;setView=function(html){cleanup?.();cleanup=null;return previous(html)};
 const quick=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||!!window.SharedGame?.replaying;
 function prepare(){seaOff();document.body.classList.add('grammar-style-active');S.splevel=level();useCourse()}
 function room(){prepare();S.futureSection='advanced';save();setView(`<section class="future-page future-room" data-future-section="advanced">${heading('Future practice')}<div class="future-choices">${[['printer','Future printer','Will and Present Simple timetables.'],['calendar','Weekly calendar','Plans, arrangements, future activity, results and duration.']].map(([key,title,text],i)=>`<button class="grammar-topic" data-future-task="${key}"><span>${esc(title)}</span><small>${text}</small><img class="topic-pencil" src="assets/pencils/pencil-${i+1}.svg" alt=""></button>`).join('')}</div></section>`);$('#ftBack').onclick=()=>{S.gmode='ts';save();go('gram')};document.querySelectorAll('[data-future-task]').forEach(b=>b.onclick=()=>spOpen('future_'+b.dataset.futureTask));LevelDesign.sync()}
 const heading=title=>`<header class="future-header"><button class="lvb" id="ftBack">← Topics</button><h1>${esc(title)}</h1></header>`;
 function toggle(button,target){const b=document.getElementById(button),t=document.getElementById(target);b.onclick=()=>{t.hidden=!t.hidden;b.setAttribute('aria-expanded',String(!t.hidden))}}
 function answerHTML(row,answer,shown){return `<h2 class="ft-prompt" data-stw-plain>${esc(row.prompt)}</h2><label class="sr-only" for="ftAnswer">Your answer</label><textarea class="future-answer" id="ftAnswer" maxlength="500" rows="2" placeholder="Write one sentence, or answer aloud…" spellcheck="false">${esc(typeof answer==='string'?answer.slice(0,500):'')}</textarea><div class="ft-answer-controls"><button class="lvb" id="ftHint" aria-controls="ftHintText" aria-expanded="false">Hint</button><button class="lvb" id="ftShow" aria-controls="ftAnswers" aria-expanded="${!!shown}">Show answers</button></div><p id="ftHintText" class="ft-hint" hidden>${esc(row.hint)}</p><div id="ftAnswers" class="future-models" ${shown?'':'hidden'}>${row.answers.map(a=>`<p>${esc(a)}</p>`).join('')}</div>`}
 function wireAnswer(state,index){$('#ftAnswer').oninput=e=>{state.answers[index]=e.target.value;save()};toggle('ftHint','ftHintText');$('#ftShow').onclick=()=>{const el=$('#ftAnswers');el.hidden=!el.hidden;state.shown[index]=!el.hidden;$('#ftShow').setAttribute('aria-expanded',String(!el.hidden));save()}}
 const boxes={ticket:'25 265 460 410',board:'495 275 465 380',clock:'965 240 410 430',person:'1400 30 330 840'};
 function art(kind,cls=''){const [x,y,width,height]=boxes[kind].split(' ');return `<svg class="ft-art ft-art--${kind} ${cls}" viewBox="${boxes[kind]}" role="img" aria-label="${{ticket:'Train ticket: London to Paris, 09:00 to 12:00',board:'Arrivals: Paris 12:00; Lyon 14:30',clock:'Clock showing ten o’clock',person:'Sam, a traveller with a bag'}[kind]}"><defs><clipPath id="ft-clip-${kind}"><rect x="${x}" y="${y}" width="${width}" height="${height}"/></clipPath></defs><image href="assets/time-lift/travel-sheet.png" width="1774" height="887" clip-path="url(#ft-clip-${kind})"/></svg>`}
 function newDeck(mode){if(mode!=='mix')return shuffle(documents[mode].map(x=>x.id)).slice(0,7);return shuffle([...shuffle(documents.will.map(x=>x.id)).slice(0,4),...shuffle(documents.timetable.map(x=>x.id)).slice(0,3)])}
 function stateFor(mode){S.futurePrinterRuns=S.futurePrinterRuns||{};const key=level()+':'+mode;let s=S.futurePrinterRuns[key];if(!s||s.version!==version||!Array.isArray(s.deck)||s.deck.length!==7||new Set(s.deck).size!==7||!s.deck.every(id=>find(id)&&(mode==='mix'||find(id).kind===mode))||!Number.isInteger(s.printed)||s.printed<0||s.printed>7)s=S.futurePrinterRuns[key]={version,deck:newDeck(mode),printed:0,active:0,answers:{},shown:{}};s.active=Math.max(0,Math.min(s.printed-1,Number.isInteger(s.active)?s.active:0));s.answers=s.answers||{};s.shown=s.shown||{};return s}
 function printer(mode){
  if(mode&&!['will','timetable','mix'].includes(mode)){FutureCalendar.open(mode);return}prepare();S.futurePrinterModes=S.futurePrinterModes||{};mode=mode||S.futurePrinterModes[level()]||'mix';if(!['will','timetable','mix'].includes(mode))mode='mix';S.futurePrinterModes[level()]=mode;const s=stateFor(mode);save();
  setView(`<section class="future-page ft-printer-page" data-document-mode="${mode}">${heading(titles[mode])}<label class="ft-mode-label" for="ftMode">Practise</label><select class="ft-mode-select" id="ftMode">${Object.entries(modeNames).map(([key,name])=>`<option value="${key}" ${mode===key?'selected':''}>${esc(name)}</option>`).join('')}</select><p class="ft-instructions">Read the facts. Write or say one sentence.${mode==='mix'?' Choose the future form yourself.':''}</p><div class="tt-layout"><div class="tt-printer"><div class="tt-housing" aria-hidden="true"><img src="assets/timetable/printer-reference.jpg" alt="" draggable="false"></div><div class="tt-paper-window" id="ftPaper"></div><div class="tt-printer-idle" id="ftIdle">DOCUMENT PRINTER</div></div><section class="tt-task" aria-label="Document task"><p class="tt-progress" id="ftProgress" role="status"></p><div id="ftQuestion"></div><button class="lvb" id="ftPrint">Print document</button><nav class="tt-history" id="ftHistory" aria-label="Printed documents"></nav></section></div></section>`);
  const root=$('.ft-printer-page'),button=$('#ftPrint'),paper=$('#ftPaper');let busy=false,alive=true,timer=0;
  const audio=new Audio(FuturePracticeData.printerSound);audio.preload='auto';
  function stop(){audio.pause();try{audio.currentTime=0}catch{}}
  const mute=e=>{if(e.target.closest?.('#sndbtn'))audio.muted=S.snd===false};document.addEventListener('click',mute);
  cleanup=()=>{alive=false;clearTimeout(timer);stop();document.removeEventListener('click',mute)};
  $('#ftBack').onclick=room;
  $('#ftMode').onchange=e=>printer(e.target.value);
  function draw(){
   $('#ftIdle').hidden=s.printed>0;$('#ftProgress').textContent=`${s.printed?s.active+1:0} / 7`;
   button.textContent=s.printed===7?'New seven documents':s.printed?'Print next document':'Print document';
   $('#ftHistory').innerHTML=Array.from({length:s.printed},(_,i)=>`<button class="tt-history-ticket${i===s.active?' on':''}" data-document-index="${i}" aria-label="Review document ${i+1}" aria-current="${i===s.active?'step':'false'}">${i+1}</button>`).join('');
   root.querySelectorAll('[data-document-index]').forEach(b=>b.onclick=()=>{if(busy)return;s.active=+b.dataset.documentIndex;save();draw()});
   if(!s.printed){paper.innerHTML='';$('#ftQuestion').innerHTML='<p class="future-intro">Print the first document to begin.</p>';return}
   const row=find(s.deck[s.active]);
   paper.innerHTML=`<article class="tt-ticket tt-ticket--document" aria-label="${esc(row.title)}"><div class="tt-ticket-top"><span>TOMORROW & BEYOND</span><span>${s.active+1} / 7</span></div><h2 class="tt-ticket-name">${esc(row.title)}</h2><div class="ft-document-facts">${row.facts.map(t=>`<p>${esc(t)}</p>`).join('')}</div><div class="tt-ticket-stub"><div class="tt-barcode" aria-hidden="true"></div><small>LANGUAGE PRACTICE · SUPPLIED SCHEDULE</small></div></article>`;
   $('#ftQuestion').innerHTML=answerHTML(row,s.answers[s.active],s.shown[s.active]);wireAnswer(s,s.active);
  }
  button.onclick=()=>{
   if(busy)return;if(s.printed===7){delete S.futurePrinterRuns[level()+':'+mode];save();printer(mode);return}
   busy=true;s.active=s.printed++;save();draw();button.disabled=true;root.dataset.phase='printing';
   const ticket=paper.querySelector('.tt-ticket');ticket.style.visibility='hidden';
   function feed(){if(!alive)return;const duration=Math.max(300,Math.min(15000,Number.isFinite(audio.duration)?audio.duration*1000:FuturePracticeData.printerDurationMS));ticket.style.animationDuration=duration+'ms';ticket.style.visibility='';ticket.classList.add('tt-feeding');timer=setTimeout(()=>{if(!alive)return;busy=false;root.dataset.phase='ready';ticket.classList.remove('tt-feeding');button.disabled=false;if(!quick())stop()},quick()?0:duration+50)}
   if(S.snd!==false&&!window.SharedGame?.replaying){stop();audio.muted=false;audio.play().then(feed).catch(feed)}else feed();
  };
  draw();root.dataset.phase='ready';
 }
 function timeLift(){
  prepare();S.futureLiftRuns=S.futureLiftRuns||{};let s=S.futureLiftRuns[level()];if(!s||s.version!==version||!Number.isInteger(s.active)||s.active<0||s.active>=lift.length)s=S.futureLiftRuns[level()]={version,active:0,opened:false,answers:{},shown:{}};s.answers=s.answers||{};s.shown=s.shown||{};s.opened=false;save();
  setView(`<section class="future-page ft-lift-page">${heading('Time lift')}<p class="ft-instructions">Open the doors. Read the plan and answer for the time on the lift.</p><div class="ft-lift-layout"><div class="ft-shaft"><div class="elv ft-cab" id="ftCab"><div class="elind ft-indicator"><span id="ftArrow" aria-hidden="true">●</span><b id="ftTime"></b></div><div class="elfr"><div class="ft-inside"><img id="ftPerson" class="ft-person-image" alt=""><div id="ftProp"></div></div><div class="eldr l"></div><div class="eldr r"></div></div></div><button class="ft-door-button" id="ftDoor" aria-controls="ftTask" aria-expanded="false">Open doors</button><p class="ft-lift-status" id="ftStatus" role="status"></p></div><section class="ft-task" id="ftTask" aria-label="Time lift task"></section></div><div class="ft-lift-navigation"><span id="ftRideProgress"></span><button class="lvb" id="ftNext">Next time →</button></div></section>`);
  const root=$('.ft-lift-page'),cab=$('#ftCab'),door=$('#ftDoor');let busy=false,alive=true;const timers=new Set();
  function later(fn,delay){const id=setTimeout(()=>{timers.delete(id);if(alive)fn()},quick()?0:delay);timers.add(id)}
  const audio=new Audio('assets/sounds/time-lift.mp3');audio.preload='auto';audio.volume=.55;
  const stopSound=()=>{audio.pause();try{audio.currentTime=0}catch{}};
  function sound(){if(S.snd===false||window.SharedGame?.replaying)return;stopSound();audio.play().catch(()=>{})}
  const mute=e=>{if(e.target.closest?.('#sndbtn')&&S.snd===false)stopSound()};document.addEventListener('click',mute);
  cleanup=()=>{alive=false;timers.forEach(clearTimeout);timers.clear();stopSound();document.removeEventListener('click',mute)};
  $('#ftBack').onclick=room;
  function task(){
   const row=lift[s.active];
   $('#ftTask').innerHTML=s.opened?`<div class="ft-plan"><p class="ft-plan-heading">${esc(row.facts[0])}</p>${row.facts.slice(1).map(t=>`<p>${esc(t)}</p>`).join('')}</div>${answerHTML(row,s.answers[s.active],s.shown[s.active])}`:'<p class="ft-closed-note">Open the doors to see the traveller and the task.</p>';
   if(s.opened)wireAnswer(s,s.active);
  }
  function draw(){
   const row=lift[s.active];cab.classList.toggle('open',!!s.opened);door.setAttribute('aria-expanded',String(!!s.opened));door.textContent=s.opened?'Close doors':'Open doors';
   $('#ftTime').textContent=row.label;$('#ftPerson').src=row.personImage;$('#ftPerson').alt=row.facts[1].split(':')[0];$('#ftProp').innerHTML=row.objectImage?`<img class="ft-object-image" src="${row.objectImage}" alt="${esc(row.title.toLowerCase())} object">`:(row.art?art(row.art):'')+(row.extraArt?art(row.extraArt,'ft-extra-art'):'');
   $('#ftRideProgress').textContent=`${s.active+1} / ${lift.length}`;$('#ftNext').textContent=s.active===lift.length-1?'Start again ↺':'Next time →';$('#ftStatus').textContent='At your stop';
   task();
  }
  function travel(to){
   if(busy||to===s.active)return;busy=true;s.opened=false;save();cab.classList.remove('open');door.disabled=true;$('#ftNext').disabled=true;root.dataset.phase='closing';stopSound();$('#ftTask').innerHTML='<p class="ft-closed-note">Travelling to the next time…</p>';
   later(()=>{root.dataset.phase='moving';$('#ftArrow').textContent=to>s.active?'▲':'▼';$('#ftStatus').textContent='Moving…';
    later(()=>{$('#ftTime').textContent=lift[to].label},450);
    later(()=>{s.active=to;s.opened=false;save();busy=false;root.dataset.phase='ready';$('#ftArrow').textContent='●';door.disabled=false;$('#ftNext').disabled=false;draw();door.focus({preventScroll:true})},1200);
   },550);
  }
  door.onclick=()=>{if(busy)return;s.opened=!s.opened;save();if(s.opened)sound();else stopSound();draw()};
  $('#ftNext').onclick=()=>{if(busy)return;if(s.active===lift.length-1){s.answers={};s.shown={};save()}travel((s.active+1)%lift.length)};
  draw();root.dataset.phase='ready';
 }
 const routes={printer:()=>printer(),...Object.fromEntries(Object.keys(titles).map(mode=>['print_'+mode,()=>printer(mode)]))};
 for(const [key,fn]of Object.entries(routes)){const id='future_'+key,title=key==='lift'?'Time lift':'Future printer';DMT[id]=1;DMTF[id]=fn;SPSHORT[id]=title;SPT.push({id,n:title,d:'Read the facts, choose a future form and write or say one sentence.'});for(const level of ['b2','c1']){const ids=SPLV.find(l=>l[0]===level)?.[2];if(ids&&!ids.includes(id))ids.push(id)}}
 window.FutureTime={room,printer,get documents(){return documents},get lift(){return lift},art};
})();
