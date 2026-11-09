/* Ocean Sentence Expander: topic-specific changes, Codrops BlockRevealers,
   and an accessible vertical trail that keeps every previous sentence. */
(()=>{
 'use strict';
 const topics=[],colours=['#CCE5FF','#BEC3EC','#F4DDF4','#FF9275','#B2BC70'];let disposeRun=null;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const priorView=setView;
 setView=function(html){if(disposeRun){disposeRun();disposeRun=null}return priorView(html)};
 function setup(){
  seaOff();EX=null;S.gmode='exp';
  const level=S.glevel&&S.glevel!=='all'?S.glevel:'b1';S.glevel=level;
  const own=topics.filter(t=>t.level===level);
  setView(`<section class="sx-catalog"><h1>Sentence Expander</h1><div class="sx-levels" role="tablist" aria-label="Grammar level">${['kids','a1','a2','b1','b2','c1'].map(l=>`<button type="button" role="tab" data-sx-level="${l}" aria-selected="${l===level}">${l==='kids'?'Kids':l.toUpperCase()}</button>`).join('')}</div><div class="sx-practice-mode" role="group" aria-label="How to practise"><button type="button" data-sx-mode="write" aria-pressed="${!S.exSpeak}">Write</button><button type="button" data-sx-mode="speak" aria-pressed="${!!S.exSpeak}">Speak</button></div><div class="sx-topic-grid">${own.map((t,i)=>`<button type="button" class="sx-topic" data-sx-topic="${t.id}" style="--sx-card:${colours[i%colours.length]}"><span class="sx-mini-fish" style="background-position:${[0,50,100][i%3]}% ${i%6<3?0:100}%" aria-hidden="true"></span><span>${esc(t.name)}</span></button>`).join('')}</div></section>`);
  document.querySelectorAll('[data-sx-level]').forEach(b=>b.onclick=()=>{S.glevel=b.dataset.sxLevel;save();exSetup()});
  document.querySelectorAll('[data-sx-mode]').forEach(b=>b.onclick=()=>{S.exSpeak=b.dataset.sxMode==='speak';save();document.querySelectorAll('[data-sx-mode]').forEach(x=>x.setAttribute('aria-pressed',String((x.dataset.sxMode==='speak')===!!S.exSpeak)))});
  document.querySelectorAll('[data-sx-topic]').forEach(b=>b.onclick=()=>{S.exnav='expander';S.splevel=level;save();spOpen(b.dataset.sxTopic)});
 }
 function open(topic,variant){
  if(document.querySelector('#view [data-grammar-exercise]'))S.exnav='grammar';
  const fromGrammar=S.exnav==='grammar';seaOff();
  const choice=Number.isInteger(variant)?variant:Math.floor(Math.random()*3),chain=ExpanderCurriculum.variant(topic.level,topic.number,choice);
  EX={topic:topic.id,variant:choice,chain,index:0,answers:[],draft:chain.start,speak:!!S.exSpeak};
  S.splevel=topic.level;
  setView(`<section class="sx-dive" data-topic="${topic.level}:${topic.number}" data-variant="${choice}"><header class="sx-header"><h1>Sentence Expander</h1><p class="sx-topic-name">${esc(topic.name)} · ${topic.level==='kids'?'Kids':topic.level.toUpperCase()}</p></header><div class="sx-status"><button type="button" id="sx-topics">← Topics</button><button type="button" id="sx-how" aria-expanded="false" aria-controls="sx-help">How to?</button><span class="sx-depth-label" role="status" aria-live="polite"><b id="sx-depth">0</b> m <span id="sx-progress">0 / ${chain.steps.length}</span></span></div><p id="sx-help" class="sx-help" hidden>${EX.speak?'Say each new version aloud, then choose I’ve said it to reveal an example and dive deeper.':'Edit the sentence using the change and words given. Keep the other details unless the task asks you to replace them. Check opens the next step.'} Hint explains the form. You can scroll up to see your earlier versions.</p><div class="sx-ocean-art" aria-hidden="true"><span class="sx-fish sx-fish-one"></span><span class="sx-fish sx-fish-two"></span><span class="sx-fish sx-fish-three"></span><svg class="sx-seaweed" viewBox="0 0 130 300"><g fill="none" stroke="#26422B" stroke-linecap="round"><path d="M70 290Q25 220 55 145T43 20" stroke-width="8"/><path d="M66 280Q120 205 86 145T110 50" stroke-width="6"/><path d="M60 260Q10 190 27 110" stroke-width="5"/></g></svg><i class="sx-bubble"></i><i class="sx-bubble"></i><i class="sx-bubble"></i></div><div class="sx-trail" id="sx-trail"><section class="sx-start"><span class="sx-step-label">At the surface</span><p>${esc(chain.start)}</p></section></div></section>`);
  const root=document.querySelector('.sx-dive'),trail=document.getElementById('sx-trail'),state=EX;let alive=true,animating=false,timers=new Set(),effects=[];
  const later=(fn,ms)=>{const id=setTimeout(()=>{timers.delete(id);if(alive)fn()},ms);timers.add(id);return id};
  disposeRun=()=>{alive=false;timers.forEach(clearTimeout);effects.forEach(f=>{window.anime?.remove(f.revealer);f.content.style.opacity=1});document.removeEventListener('stw:shared-restored',restorePosition);document.body.classList.remove('sentence-dive')};
  document.body.classList.add('sentence-dive');root.dataset.phase='question';
  const back=()=>{if(fromGrammar)spSetup();else exSetup()};
  document.getElementById('sx-topics').onclick=back;
  document.getElementById('sx-how').onclick=()=>{const help=document.getElementById('sx-help');help.hidden=!help.hidden;document.getElementById('sx-how').setAttribute('aria-expanded',String(!help.hidden));if(!help.hidden)help.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'center'})};
  function descend(stage){
   if(!alive||!stage.isConnected)return;
   const top=stage.getBoundingClientRect().top+scrollY-78;
   window.scrollTo({top:Math.max(0,top),behavior:reduced()?'instant':'smooth'});
  }
  function restorePosition(){if(state.index>0){const current=trail.querySelector('[data-step="'+state.index+'"]')||trail.querySelector('.sx-finish');if(current)descend(current)}}
  document.addEventListener('stw:shared-restored',restorePosition);
  function reveal(stage,after){
   if(reduced()||typeof RevealFx==='undefined'){after();return}
   const fx=new RevealFx(stage,{isContentHidden:true});effects.push(fx);
   fx.reveal({direction:state.index%2?'rl':'lr',bgcolor:colours[state.index%colours.length],duration:260,easing:'easeInOutQuint',onCover:content=>{if(alive)content.style.opacity=1},onComplete:()=>{if(alive)after()}});
  }
  function append(){
   if(!alive)return;const index=state.index,step=chain.steps[index];animating=true;root.setAttribute('aria-busy','true');
   const stage=document.createElement('section');stage.className='sx-stage';stage.dataset.step=index;stage.style.setProperty('--sx-accent',colours[index%colours.length]);stage.setAttribute('aria-label','Change '+(index+1));
   stage.innerHTML=`<div class="sx-step-paper"><div class="sx-step-top"><span class="sx-step-label">${(index+1)*600} m · Change ${index+1}</span><button type="button" class="sx-hint-toggle" id="sx-hint-${index}" aria-expanded="false" aria-controls="sx-hint-copy-${index}">Hint</button></div><p class="sx-instruction">${esc(step.instruction)}</p><p class="sx-previous"><span>Previous version</span>${esc(state.answers.at(-1)||chain.start)}</p><div class="sx-hint" id="sx-hint-copy-${index}" hidden><p>${esc(step.hint)}</p><button type="button" class="sx-example-toggle" id="sx-example-${index}">Show an example</button><p class="sx-example" id="sx-example-copy-${index}" hidden>${esc(step.answers[0])}</p></div>${state.speak?'<p class="sx-speak-prompt">Say your new sentence aloud.</p>':`<label class="sx-input-label" for="sx-answer-${index}">Your new version</label><textarea id="sx-answer-${index}" class="sx-answer" rows="2" spellcheck="false" autocomplete="off">${esc(state.draft)}</textarea>`}<div class="sx-actions"><button type="button" class="sx-check" id="sx-check-${index}" disabled>${state.speak?'I’ve said it':'Check'}</button><p id="sx-feedback-${index}" class="sx-feedback" role="status" aria-live="polite"></p></div></div>`;
   trail.appendChild(stage);root.dataset.step=index;root.dataset.phase='revealing';
   reveal(stage,()=>{animating=false;root.setAttribute('aria-busy','false');root.dataset.phase='question';stage.querySelector('.sx-check').disabled=false});
   // RevealFx wraps the paper before listeners are attached, so handlers survive.
   const hint=stage.querySelector('.sx-hint-toggle'),hintCopy=stage.querySelector('.sx-hint');hint.onclick=()=>{hintCopy.hidden=!hintCopy.hidden;hint.setAttribute('aria-expanded',String(!hintCopy.hidden))};
   const example=stage.querySelector('.sx-example-toggle');example.onclick=()=>{const copy=stage.querySelector('.sx-example');copy.hidden=!copy.hidden;example.textContent=copy.hidden?'Show an example':'Hide example'};
   const input=stage.querySelector('.sx-answer'),button=stage.querySelector('.sx-check'),feedback=stage.querySelector('.sx-feedback');
   if(input){input.oninput=()=>{state.draft=input.value;feedback.textContent='';stage.classList.remove('sx-incorrect')};input.onkeydown=e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();button.click()}}}
   button.onclick=()=>{
    if(animating||stage.dataset.complete)return;
    const answer=state.speak?step.answers[0]:input.value.trim();
    if(!answer){feedback.textContent='Write your new sentence first.';input?.focus();return}
    if(!state.speak&&!QuestionPond.matches(answer,step.answers)){stage.classList.add('sx-incorrect');feedback.textContent=answer===(state.answers.at(-1)||chain.start)?'Change the sentence above first.':'Not quite. Use the change and words given; Hint can help.';return}
    state.answers.push(answer);state.draft=answer;state.index++;stage.dataset.complete='true';stage.classList.add('sx-complete');button.disabled=true;button.textContent=state.speak?'Example below':'Checked';
    if(input)input.readOnly=true;else{const model=document.createElement('p');model.className='sx-spoken-example';model.textContent=answer;stage.querySelector('.sx-speak-prompt').replaceWith(model)}
    feedback.textContent=state.speak?'Compare it with your sentence.':'Yes — let’s dive deeper.';
    document.getElementById('sx-depth').textContent=state.index*600;document.getElementById('sx-progress').textContent=state.index+' / '+chain.steps.length;
    animating=true;root.setAttribute('aria-busy','true');root.dataset.phase='descending';
    later(()=>{if(state.index===chain.steps.length)finish();else append()},reduced()?35:450);
   };
   if(index>0)later(()=>descend(stage),reduced()?0:40);
  }
  function finish(){
   animating=false;root.setAttribute('aria-busy','false');root.dataset.phase='complete';const section=document.createElement('section');section.className='sx-finish';section.innerHTML=`<span class="sx-step-label">${chain.steps.length*600} m</span><h2>A deeper sentence</h2><p>${esc(state.answers.at(-1))}</p><button type="button" id="sx-again">Another dive</button>`;trail.appendChild(section);section.querySelector('button').onclick=()=>open(topic,(choice+1)%3);descend(section);
  }
  window.scrollTo(0,0);append();
 }
 for(const [level,groups]of Object.entries(SPGRP))for(const group of groups){
  const number=Number(group[0].match(/^(\d+)\s*·/)?.[1]);if(!number)continue;
  if(!ExpanderCurriculum.bank[level+':'+number])throw Error('Missing Sentence Expander topic: '+level+':'+number);
  const topic={id:'exp_'+level+'_'+number,level,number,name:group[0].replace(/^\d+\s*·\s*/,'')};topics.push(topic);
  group[1].push(topic.id);SPSHORT[topic.id]='Sentence Expander';SPT.push({id:topic.id,n:'Sentence Expander: '+topic.name,d:'Change the sentence one step at a time.'});DMT[topic.id]=1;DMTF[topic.id]=()=>open(topic);SPLV.find(l=>l[0]===level)?.[2].push(topic.id);
 }
 window.SentenceExpander={setup,topics,open:id=>{const t=topics.find(t=>t.id===id);if(!t)throw Error('Unknown expander topic');open(t)}};
})();
