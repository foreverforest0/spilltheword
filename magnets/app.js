/* Word magnets directly on the blue fridge. No answer window, no decorative pin images. */
(() => {
 'use strict';
 const $=s=>document.querySelector(s), levels=['kids','a1','a2','b1','b2','c1'], decks={}, topicRoutes={}, colours=['#fff4dc','#f6d7dc','#dbe6cf','#e9dff0','#e3eaf0','#f1d9ba'];
 let active=null,serial=0;
 const escText=esc, title=lv=>lv==='kids'?'Kids':lv.toUpperCase();
 const words=s=>s.replace(/[.,?!:;“”]/g,'').split(/\s+/).filter(Boolean);
 const normal=s=>s.toLowerCase().replace(/[’‘]/g,"'").replace(/[.,?!:;]/g,'').replace(/\s+/g,' ').trim();
 const levelNow=()=>levels.includes(S.splevel)?S.splevel:'b1';
 const btn=(text,id)=>`<button type="button" class="fm-button" id="${id}">${text}</button>`;
 const markers=['at the moment','by the time','last week','last night','next year','this time tomorrow','every day','this morning','so far','by Friday','for','since','yet','already','just','ever','never','yesterday','tomorrow','now','usually','always','often','while','when','before','after','if','unless'];
 function markerFor(s){return markers.find(m=>new RegExp('\\b'+m+'\\b','i').test(s))||''}
 function kind(s){return /\?$/.test(s.trim())?'question':/\b(?:not|never|no|nobody|nothing|neither)\b|n[’']t\b/i.test(s)?'negative sentence':'statement'}
 function convert(row,cfg){
  const extra=row[4]||{},answers=extra.word?[extra.prompt.replace('___',extra.word)]:row[1],marker=markerFor(answers[0]);
  return {q:extra.word?`Build the complete sentence using the derived word “${extra.word}”.`:(`Build a ${kind(answers[0])} using ${cfg.title.replace(/^Fridge magnets:\s*/,'')}.`+(extra.prompt?' '+extra.prompt:'')),answers,marker,prefix:extra.prefix||'',tokens:(extra.word?words(answers[0]):extra.tokens)?.flatMap(words),picture:row[2]||'',hint:(cfg.hints||[]).join(' '),type:row[0]};
 }
 function register(){
  for(const lv of levels){
   topicRoutes[lv]=[];
   const groups=SPGRP[lv].filter(g=>/^\d+\s*·/.test(g[0]));
   groups.forEach((g,i)=>{
    const id='fm_'+lv+'_'+(i+1),key=(FRIDGE_TOPIC_KEYS[lv]||[])[i];let cfg=null,items;
    if(lv==='b1')cfg=g[1].map(x=>B1MAG[x]).find(Boolean);
    else if(MGXC[key])cfg=MGXC[key];
    if(cfg)items=cfg.items().map(row=>convert(row,cfg));else items=(FRIDGE_BANKS[key]||[]).map(r=>({...r,marker:markerFor(r.answers[0]),type:kind(r.answers[0])==='question'?'?':kind(r.answers[0])==='negative sentence'?'-':'+'}));
    if(!items.length)throw Error('Missing fridge topic '+lv+' '+g[0]);
    decks[id]={id,lv,title:g[0].replace(/^\d+\s*·\s*/,''),items,cfg};topicRoutes[lv].push(id);
    DMT[id]=1;DMTF[id]=()=>open(id);SPSHORT[id]='Fridge magnets';SPT.push({id,n:`Fridge magnets: ${decks[id].title}`,d:'Read the task and arrange the shuffled word magnets directly on the fridge.'});
    g[1]=g[1].filter(old=>!B1MAG[old]&&!MGXC[old]&&!['mgt','mga'].includes(old));if(!g[1].includes(id))g[1].push(id);
   });
   const id='fm_free_'+lv;DMT[id]=1;DMTF[id]=()=>open(topicRoutes[lv][0],{mode:'free'});SPSHORT[id]='Fridge magnets: free words';
   SPT.push({id,n:SPSHORT[id],d:'Build your own sentences with vocabulary for your level.'});
   if(!SPGRP[lv].some(g=>g[1].includes(id)))SPGRP[lv].push(['Word magnets',[id]]);
  }
 }
 function vocab(lv){const rank=levels.indexOf(lv),base='I you he she it we they me him her us them my your his its our their a an the this that these those and but or so because to of in on at from with without by about under over here there who what where when why how which whose not yes no very really too more most less as than some any much many all both each every other one two three four five ten am is are be do does can cannot have has don’t doesn’t isn’t aren’t';
  const list=base.split(' ');for(let i=0;i<=rank;i++)list.push(...FRIDGE_LEXICON[levels[i]].split(' '));
  if(rank>=2)list.push(...'was were did had could would should must will won’t didn’t wasn’t weren’t couldn’t would not might may been being doing done going gone seen bought made taken written read eaten drunk played worked finished started waiting feeling looking reading been has have haven’t hasn’t hadn’t'.split(' '));
  if(rank>=4)list.push(...'ought needn’t shall whom whether although despite neither nor having would’ve could’ve should’ve'.split(' '));
  return [...new Set(list)];
 }
 const tenses={
  simple:{n:'Present Simple',min:0,forms:['+','-','?'],marker:{'+':['usually','every day','often'],'-':['usually','often'],'?':['usually','every day']},examples:{'+':'I usually drink coffee in the morning.','-':'She doesn’t usually work on Fridays.','?':'Do you often read at home?'}},
  continuous:{n:'Present Continuous',min:0,forms:['+','-','?'],marker:{'+':['now','at the moment'],'-':['now','at the moment'],'?':['now','at the moment']},examples:{'+':'We are cooking dinner now.','-':'He isn’t working at the moment.','?':'Are you reading now?'}},
  past:{n:'Past Simple',min:0,forms:['+','-','?'],marker:{'+':['yesterday','last week'],'-':['yesterday','last night'],'?':['yesterday','last week']},examples:{'+':'I finished my homework yesterday.','-':'She didn’t call me last night.','?':'Did you work yesterday?'}},
  pastcontinuous:{n:'Past Continuous',min:2,forms:['+','-','?'],marker:{'+':['at eight last night'],'-':['at eight last night'],'?':['at eight last night']},examples:{'+':'We were watching TV at eight last night.','-':'I wasn’t working at eight last night.','?':'Were you sleeping at eight last night?'}},
  future:{n:'Future: will',min:2,forms:['+','-','?'],marker:{'+':['tomorrow'],'-':['tomorrow'],'?':['tomorrow']},examples:{'+':'I will call you tomorrow.','-':'She won’t be at home tomorrow.','?':'Will you help me tomorrow?'}},
  perfect:{n:'Present Perfect',min:2,forms:['+','-','?'],marker:{'+':['already','just'],'-':['yet'],'?':['ever','yet']},examples:{'+':'I have just finished my homework.','-':'I haven’t finished my homework yet.','?':'Have you ever tried Thai food?'}},
  perfectcontinuous:{n:'Present Perfect Continuous',min:3,forms:['+','-','?'],marker:{'+':['for'],'-':['lately'],'?':['how long']},examples:{'+':'I have been working for two hours.','-':'She hasn’t been sleeping well lately.','?':'How long have you been waiting?'}},
  pastperfect:{n:'Past Perfect',min:3,forms:['+','-','?'],marker:{'+':['before'],'-':['before'],'?':['before']},examples:{'+':'The film had started before we arrived.','-':'I hadn’t seen him before the party.','?':'Had you met her before the course?'}},
  futureperfect:{n:'Future Perfect',min:4,forms:['+','-','?'],marker:{'+':['by Friday'],'-':['by Friday'],'?':['by Friday']},examples:{'+':'I will have finished the report by Friday.','-':'We won’t have finished the project by Friday.','?':'Will you have finished the report by Friday?'}},
  futurecontinuous:{n:'Future Continuous',min:4,forms:['+','-','?'],marker:{'+':['this time tomorrow'],'-':['this time tomorrow'],'?':['this time tomorrow']},examples:{'+':'This time tomorrow we will be flying to Rome.','-':'I won’t be working this time tomorrow.','?':'Will you be working this time tomorrow?'}}
 };
 function options(lv){return Object.entries(tenses).filter(([,v])=>levels.indexOf(lv)>=v.min)}
 function seedWords(example){return words(example).map(w=>w==='I'?w:w.toLowerCase())}
 function open(id,opts={}){
  const deck=decks[id];if(!deck)return;active?.dispose?.();
  const mode=opts.mode||'guided',filter=opts.filter&&deck.items.some(r=>r.type===opts.filter)?opts.filter:'all',run={id,deck,lv:deck.lv,mode,filter,roundIndex:opts.roundIndex||0,order:[],pieces:[],history:[],saved:opts.saved||[],tense:'all',form:'-',category:'all',search:'',ghost:null,bag:shuffle(deck.items.filter(r=>filter==='all'||r.type===filter))};
  active=run;render(run);
 }
 function current(run){if(!run.round)run.round=run.bag.pop()||shuffle(run.deck.items.slice()).pop();return run.round}
 function render(run){
  if(active!==run)return;const free=run.mode!=='guided',r=free?null:current(run),available=options(run.lv);
  if(free&&run.mode==='task'&&run.tense==='all')run.tense=available.some(([k])=>k==='perfect')?'perfect':available[0][0];
  if(free&&run.mode==='task'&&!run.challenge)newChallenge(run);
  const task=free?(run.mode==='task'?`Make a ${({'-':'negative sentence','+':'statement','?':'question'})[run.form]} in ${tenses[run.tense].n}. Use <span class="fm-marker">${escText(run.challenge.marker)}</span>.`:'Make your own sentences. Choose words and place them directly on the fridge.'):`${escText(r.q)}${r.marker?` <small>Marker: <span class="fm-marker">${escText(r.marker)}</span></small>`:''}`;
  setView(`<section class="fm-page"><div class="fm-head">${btn('← Topics','fm-back')}<h2>Word magnets<small>${title(run.lv)} · ${escText(run.deck.title)}</small></h2><span class="fm-progress">${free?'Your own words':`Sentence ${run.roundIndex+1}`}</span></div><div class="fm-toolbar"><label>Grammar topic<select data-native-select id="fm-topic">${(topicRoutes[run.lv].includes(run.id)?topicRoutes[run.lv]:[run.id,...topicRoutes[run.lv]]).map(id=>`<option value="${id}"${id===run.id?' selected':''}>${escText(decks[id].title)}</option>`).join('')}</select></label><div class="fm-modes">${[['guided','Shuffled sentence'],['free','Free words'],['task','Give me a task']].map(([m,n])=>`<button class="fm-button" data-fm-mode="${m}" aria-pressed="${run.mode===m}">${n}</button>`).join('')}</div></div>${!free?`<div class="fm-round-options"><label>Sentence type <select data-native-select id="fm-type"><option value="all">All types</option>${(run.deck.cfg?.types||[['+','Statements'],['-','Negatives'],['?','Questions']]).filter(x=>x[0]!=='all'&&run.deck.items.some(r=>r.type===x[0])).map(([k,n])=>`<option value="${k}"${run.filter===k?' selected':''}>${escText(n)}</option>`).join('')}</select></label></div>`:`<div class="fm-toolbar"><label>Tense<select data-native-select id="fm-tense">${run.mode==='free'?'<option value="all">All words / all tenses</option>':''}${available.map(([k,v])=>`<option value="${k}"${run.tense===k?' selected':''}>${v.n}</option>`).join('')}</select></label>${run.mode==='task'?`<label>Sentence form<select data-native-select id="fm-form">${[['+','Statement'],['-','Negative'],['?','Question']].map(([k,n])=>`<option value="${k}"${run.form===k?' selected':''}>${n}</option>`).join('')}</select></label>`:''}</div>`}<div class="fm-task" id="fm-task">${task}${!free&&r.prefix?`<small>Keep this beginning: ${escText(r.prefix)}</small>`:''}</div><div class="fm-workspace"><div class="fm-fridge" id="fm-fridge"><img src="magnets/assets/blue-fridge.png" alt="Blue retro fridge" draggable="false"><div class="fm-door" id="fm-door" role="group" aria-label="Sentence magnets on the fridge"></div></div><aside class="fm-tray"><div class="fm-title-row"><h3>${free?'Your word collection':'Shuffled words'}</h3><span id="fm-count" class="fm-bank-count"></span></div><p class="fm-caption"><span class="fm-desktop-help">Drag a word onto the blue door, or tap it to add it. Drag between words to change their order. Tap a word on the fridge to return it.</span><span class="fm-mobile-help">Tap or drag words onto the door. Tap again to return.</span></p>${free?`<input type="search" id="fm-search" class="fm-search" placeholder="Find a word…" aria-label="Find a word"><div class="fm-compact">${btn('All words','fm-all')}${btn('Useful for this tense','fm-useful')}</div>`:''}<div class="fm-picture" id="fm-picture"></div><div class="fm-bank" id="fm-bank" role="group" aria-label="Available word magnets"></div><div class="fm-controls">${btn(free?'Check task clues':'Check sentence','mgchk')}${btn(free?'Example':'Show answer','mgans')}${btn('Undo','fm-undo')}${btn('Clear fridge','fm-clear')}${btn(run.mode==='task'?'New task':free?'New sentence':'Next sentence →','fm-next')}</div><div class="fm-result" id="fm-result" role="status" aria-live="polite"></div>${free?`<div class="fm-controls">${btn('Save my sentence','fm-save')}</div><p class="fm-note">Free sentences can have many answers. The clue check checks the marker and form hints; discuss the full grammar and meaning with your teacher.</p><div class="fm-saved" id="fm-saved"></div>`:`<button type="button" class="fm-button" id="fm-hint">Grammar hint</button><div class="fm-hint" id="fm-hint-text" hidden></div>`}</aside></div></section>`);
  run.root=$('.fm-page');run.dispose=()=>{run.ghost?.remove();run.root?.querySelectorAll('.fm-magnet').forEach(e=>{e.onpointerdown=null;e.onpointerup=null})};
  if(!run.pieces.length){
   let tokens=free?freeWords(run):r.tokens||words(r.answers[0]);
   run.pieces=tokens.map((w,i)=>({w,i,key:++serial}));run.bankOrder=shuffle(run.pieces.slice());
   if(!free&&run.bankOrder.length>1&&run.bankOrder.every((p,i)=>p===run.pieces[i]))run.bankOrder.reverse();
  }
  if(!free&&r.picture){const img=document.createElement('img');img.src='ch/'+r.picture;img.alt='Picture clue';$('#fm-picture').append(img)}
  bind(run);paint(run);if(free)drawSaved(run);
 }
 function newChallenge(run){const t=tenses[run.tense],pool=t.marker[run.form];run.challenge={marker:pool[Math.floor(Math.random()*pool.length)],example:t.examples[run.form]};run.challenge.marker=markerFor(run.challenge.example)||run.challenge.marker;
  // Ensure the example uses the assigned clue, including multi-word time expressions.
  const exact=t.marker[run.form].find(m=>normal(run.challenge.example).includes(normal(m)));if(exact)run.challenge.marker=exact;
 }
 function freeWords(run){
  let list=vocab(run.lv);const rank=levels.indexOf(run.lv);
  const forms=run.tense==='all'?[1,2,...(rank>=1||run.lv==='kids'?[3]:[]),...(rank>=2?[4]:[]),5]:run.tense.includes('continuous')||run.tense==='continuous'?[1,5]:run.tense.includes('perfect')||run.tense==='perfect'?[1,4]:run.tense==='past'?[1,3]:run.tense==='simple'?[1,2]:[1];
  for(const row of FRIDGE_VERBS)if(levels.indexOf(row[0])<=rank)list.push(...forms.map(i=>row[i]));
  if(run.tense==='all')list.push(...options(run.lv).flatMap(([,t])=>Object.values(t.examples).flatMap(seedWords)));
  else list.push(...Object.values(tenses[run.tense].examples).flatMap(seedWords));
  const aux={simple:'am is are isn’t aren’t do does don’t doesn’t have has can can’t',continuous:'am is are isn’t aren’t',past:'was were wasn’t weren’t did didn’t had',pastcontinuous:'was were wasn’t weren’t being',future:'will won’t be',perfect:'have has haven’t hasn’t been',perfectcontinuous:'have has haven’t hasn’t been',pastperfect:'had hadn’t been',futureperfect:'will won’t have been',futurecontinuous:'will won’t be'};
  const auxiliaries=new Set(Object.values(aux).join(' ').split(' ').concat('would could should must might may'.split(' ')));
  if(run.tense!=='all'){const allowed=new Set(aux[run.tense].split(' '));list=list.filter(w=>!auxiliaries.has(w)||allowed.has(w));list.push(...allowed);}
  return [...new Set(list)];
 }
 function remember(run){run.history.push(run.order.slice());if(run.history.length>40)run.history.shift()}
 function sentence(run){return run.order.map(p=>p.w).join(' ')}
 function categoryFor(w){return /^(am|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|should|could|can|must|may|might|.*n’t|not)$/i.test(w)?'grammar':'vocabulary'}
 function visibleWords(run){let list=run.bankOrder.filter(p=>!run.order.includes(p));if(run.search)list=list.filter(p=>p.w.toLowerCase().includes(run.search));
  if(run.useful&&run.tense!=='all'){const wanted=new Set(Object.values(tenses[run.tense].examples).flatMap(seedWords));list=list.filter(p=>wanted.has(p.w.toLowerCase())||categoryFor(p.w)==='grammar')}
  return list;
 }
 function paint(run){if(active!==run)return;const door=$('#fm-door'),bank=$('#fm-bank');door.replaceChildren();bank.replaceChildren();
  run.order.forEach(p=>door.append(magnet(run,p,true)));visibleWords(run).forEach(p=>bank.append(magnet(run,p,false)));$('#fm-count').textContent=`${run.order.length} on fridge · ${bank.children.length} available`;
 }
 function magnet(run,p,on){const el=document.createElement('button');el.type='button';el.className='fm-magnet';el.textContent=p.w;el.dataset.key=p.key;el.style.setProperty('--magnet',colours[p.i%colours.length]);el.style.setProperty('--tilt',((p.i%5)-2)*.45+'deg');el.setAttribute('aria-label',p.w+(on?' — return to words':' — add to fridge'));let drag=null,suppress=false;
  el.onclick=()=>{if(suppress){suppress=false;return}if(active!==run)return;remember(run);run.order=on?run.order.filter(x=>x!==p):[...run.order,run.mode==='guided'?p:{...p,key:++serial}];$('#fm-result').textContent='';paint(run)};
  el.onkeydown=e=>{if(on&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();const i=run.order.indexOf(p),j=i+(e.key==='ArrowLeft'?-1:1);if(j<0||j>=run.order.length)return;remember(run);[run.order[i],run.order[j]]=[run.order[j],run.order[i]];paint(run);run.root.querySelector(`[data-key="${p.key}"]`).focus()}};
  el.onpointerdown=e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};el.setPointerCapture(e.pointerId)};
  el.onpointermove=e=>{if(!drag||drag.id!==e.pointerId)return;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>6)drag.moved=true;if(!drag.moved)return;
   if(!run.ghost){run.ghost=el.cloneNode(true);run.ghost.classList.add('fm-ghost');run.ghost.removeAttribute('data-key');run.ghost.removeAttribute('id');document.body.append(run.ghost);el.classList.add('fm-dragging')}
   run.ghost.style.left=(e.clientX-run.ghost.offsetWidth/2)+'px';run.ghost.style.top=(e.clientY-18)+'px';
  };
  const finish=e=>{if(!drag||drag.id!==e.pointerId)return;const moved=drag.moved;drag=null;if(el.hasPointerCapture(e.pointerId))el.releasePointerCapture(e.pointerId);run.ghost?.remove();run.ghost=null;el.classList.remove('fm-dragging');if(!moved||e.type==='pointercancel')return;suppress=true;
   const target=document.elementFromPoint(e.clientX,e.clientY),door=$('#fm-door'),bank=$('#fm-bank');if(!target)return;
   if(target.closest('#fm-fridge')){
    remember(run);run.order=run.order.filter(x=>x!==p);let pos=run.order.length;const before=target.closest('.fm-magnet');if(before){const i=run.order.findIndex(x=>String(x.key)===before.dataset.key);if(i>=0){const r=before.getBoundingClientRect();pos=i+(e.clientX>r.x+r.width/2?1:0)}}run.order.splice(pos,0,!on&&run.mode!=='guided'?{...p,key:++serial}:p);$('#fm-result').textContent='';paint(run);
   }else if(bank.contains(target)){remember(run);run.order=run.order.filter(x=>x!==p);paint(run)}
  };el.onpointerup=finish;el.onpointercancel=finish;return el;
 }
 function bind(run){
  $('#fm-back').onclick=()=>{run.dispose();active=null;spSetup()};$('#fm-topic').onchange=e=>open(e.target.value,{mode:run.mode});
  run.root.querySelectorAll('[data-fm-mode]').forEach(b=>b.onclick=()=>{if(b.dataset.fmMode!==run.mode)open(run.id,{mode:b.dataset.fmMode,saved:run.saved})});
  const filter=$('#fm-type');if(filter)filter.onchange=e=>{run.filter=e.target.value;run.round=null;run.bag=shuffle(run.deck.items.filter(r=>run.filter==='all'||r.type===run.filter));run.round=run.bag.pop();if(!run.round){$('#fm-result').textContent='No sentences of this type.';return}run.pieces=[];run.order=[];run.history=[];render(run)};
  $('#fm-clear').onclick=()=>{remember(run);run.order=[];$('#fm-result').textContent='';paint(run)};
  $('#fm-undo').onclick=()=>{const old=run.history.pop();if(old){run.order=old;$('#fm-result').textContent='';paint(run)}};
  $('#fm-next').onclick=()=>{
   if(run.mode==='guided'){
    if(!run.bag.length)run.bag=shuffle(run.deck.items.filter(r=>run.filter==='all'||r.type===run.filter));run.round=run.bag.pop();run.roundIndex++;
   }else if(run.mode==='task')newChallenge(run);
   else{remember(run);run.order=[];$('#fm-result').textContent='Make a new sentence. Undo brings back the previous one.';paint(run);return}
   run.pieces=[];run.order=[];run.history=[];render(run);
  };
  $('#mgans').onclick=()=>{const r=run.mode==='guided'?current(run):null;$('#fm-result').textContent=r?(r.word?`${r.tokens.join(' + ')} → ${r.word}. ${r.q.replace('___',r.word)}`:(r.prefix?r.prefix+' ':'')+r.answers.join(' / ')):(run.mode==='task'?run.challenge.example:'Try: '+Object.values(tenses.simple.examples)[0])};
  $('#mgchk').onclick=()=>check(run);
  const hint=$('#fm-hint');if(hint)hint.onclick=()=>{const h=$('#fm-hint-text');h.hidden=!h.hidden;h.textContent=current(run).hint||'Find the subject, then the auxiliary and the main verb. In questions, check the auxiliary before the subject.'};
  const tense=$('#fm-tense');if(tense)tense.onchange=e=>{run.tense=e.target.value;run.challenge=null;run.pieces=[];run.order=[];run.history=[];render(run)};
  const form=$('#fm-form');if(form)form.onchange=e=>{run.form=e.target.value;run.challenge=null;run.pieces=[];run.order=[];run.history=[];render(run)};
  const search=$('#fm-search');if(search){search.value=run.search;search.oninput=e=>{run.search=e.target.value.toLowerCase();paint(run)};$('#fm-all').onclick=()=>{run.useful=false;run.search='';search.value='';paint(run)};$('#fm-useful').onclick=()=>{run.useful=true;paint(run)};$('#fm-save').onclick=()=>{const text=sentence(run);if(!text.trim()){ $('#fm-result').textContent='Add some words first.';return}run.saved.push(text);drawSaved(run)}}
 }
 function drawSaved(run){$('#fm-saved').innerHTML=run.saved.length?`<b>Your sentences</b><ol>${run.saved.map(s=>`<li>${escText(s)}</li>`).join('')}</ol>`:''}
 function check(run){const result=$('#fm-result'),text=sentence(run);if(!text){result.textContent='Add some word magnets to the fridge first.';return}
  if(run.mode!=='guided'){
   if(run.mode==='free'){result.textContent='Read your sentence aloud. Check the subject, verb form and word order with your teacher.';return}
   const marker=normal(run.challenge.marker),hasMarker=(' '+normal(text)+' ').includes(' '+marker+' '),negative=/\bnot\b|n[’']t\b|\bnever\b/i.test(text),formOK=run.form!=='-'||negative;
   result.textContent=`${hasMarker?'✓':'○'} Marker “${run.challenge.marker}” ${hasMarker?'included':'still needed'}. ${run.form==='-'?(formOK?'✓ Negative form included.':'○ Add a negative form.'):''} Read the full sentence with your teacher to check ${tenses[run.tense].n} and word order.`;return;
  }
  const r=current(run),ok=r.answers.some(a=>b1AnswerMatch(text,a)),els=[...$('#fm-door').children];
  if(ok){els.forEach(e=>e.classList.add('fm-good'));result.textContent=r.word?`Correct: ${r.word}. ${r.q.replace('___',r.word)}`:`Correct! ${(r.prefix?r.prefix+' ':'')+text.replace(/[.!?]+$/,'')}${/\?$/.test(r.answers[0])?'?':'.'} Read it aloud.`;try{sfx('pop')}catch{}return}
  const best=r.answers.map(a=>words(a)).sort((a,b)=>b.filter((w,i)=>normal(w)===normal(run.order[i]?.w||'')).length-a.filter((w,i)=>normal(w)===normal(run.order[i]?.w||'')).length)[0];
  els.forEach((e,i)=>e.classList.add(normal(run.order[i].w)===normal(best[i]||'')?'fm-good':'fm-bad'));result.textContent=run.order.length<words(r.answers[0]).length?'Some words are still missing. Check the order, too.':'Check the word order. Green outlines show words in the model position; pink ones need another place.';
 }
 register();
 // Preserve existing links while upgrading their presentation and level-aware free mode.
 const oldDmMagnets=dmMagnets;
 dmMagnets=(id,arg)=>{
  const cfg=arg&&typeof arg==='object'?arg:MGXC[id];const lv=levelNow();
  if(cfg){const items=cfg.items().map(row=>convert(row,cfg));decks[id]={id,lv,title:cfg.title.replace(/^Fridge magnets:\s*/,''),items,cfg};open(id,{filter:S.mgxt?.[id]||'all'});return}
  const fallback=(id==='mga'?'a2':lv),route=topicRoutes[fallback]?.find(k=>decks[k].title.toLowerCase().includes('word order'))||topicRoutes[fallback]?.[0];if(route)open(route);else oldDmMagnets(id,arg);
 };
 window.FRidge={decks,topics:topicRoutes,tenses,vocab,get run(){return active},open};
 new MutationObserver(()=>{if(active?.root&&!active.root.isConnected){active.dispose();active=null}}).observe(document.getElementById('view'),{childList:true});
 window.addEventListener('load',()=>{const p=new URLSearchParams(location.search);if(p.has('magnets')){S.splevel=levels.includes(p.get('level'))?p.get('level'):'b1';tab='speak';const ids=topicRoutes[S.splevel];open(p.get('topic')&&decks[p.get('topic')]?p.get('topic'):ids[0],{mode:['free','task'].includes(p.get('mode'))?p.get('mode'):'guided'})}});
})();
