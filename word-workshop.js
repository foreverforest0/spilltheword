/* Word Craft now practises the forms of the teacher's own selected vocabulary. */
(()=>{
 'use strict';
 const F=WordWorkshopForms,P=WordWorkshopParts,types=[['','Choose type'],['verb','Verb / verb phrase'],['noun','Noun'],['adjective','Adjective'],['adverb','Adverb'],['fixed','Expression · free writing']],labels={past:'Past Simple',part:'Past participle',ing:'-ing form',third:'He / she / it',plural:'Plural',possessive:'Singular possessive',comparative:'Comparative',superlative:'Superlative'};
 let rows=[],state=null,dragController=null,boardObserver=null;const touchBound=new WeakSet();let touchClickGuard=false;
 // Block only the compatibility click belonging to a touch action, even if it replaced the screen.
 document.addEventListener('pointerdown',()=>{touchClickGuard=false;},true);
 document.addEventListener('keydown',()=>{touchClickGuard=false;},true);
 document.addEventListener('click',e=>{if(touchClickGuard){touchClickGuard=false;e.preventDefault();e.stopImmediatePropagation();}},true);
 function init(){S.mine.craft=typeof S.mine.craft==='string'?S.mine.craft:'';S.les.craft=Array.isArray(S.les.craft)?S.les.craft:[];S.lx.craft=Array.isArray(S.lx.craft)?S.lx.craft:[];if(!S.wordWorkshop||typeof S.wordWorkshop!=='object')S.wordWorkshop={};if(!S.wordWorkshop.overrides||typeof S.wordWorkshop.overrides!=='object')S.wordWorkshop.overrides={};if(!['grammar','formation'].includes(S.wordWorkshop.mode))S.wordWorkshop.mode='grammar';if(!P.levels.includes(S.wordWorkshop.level))S.wordWorkshop.level=P.levels.includes(S.glevel)?S.glevel:'b1'}
 function override(word){return Object.hasOwn(S.wordWorkshop.overrides,word)?S.wordWorkshop.overrides[word]:{}}
 function updateOverride(word,patch){S.wordWorkshop.overrides[word]={...override(word),...patch};save()}
 function collect(){
  const seen=new Set(),out=[];for(const item of [...lessonWords('craft').map(r=>({word:F.norm(r.w),meaning:r.r||'',source:r.cat})),...F.parseWords(S.mine.craft).map(r=>({...r,source:'My words'}))]){
   if(seen.has(item.word))continue;seen.add(item.word);const own=override(item.word),type=Object.hasOwn(own,'type')&&types.some(t=>t[0]===own.type)?own.type:F.detect(item.word);
   out.push({...item,...F.analyse(item.word,type,own.forms||{}),enabled:own.enabled!==false});
  }return out.slice(0,150);
 }
 function preview(){
  rows=collect();const selected=rows.filter(r=>r.enabled),ready=selected.filter(r=>S.wordWorkshop.mode==='formation'?P.formationTasks(r,S.wordWorkshop.level).length:r.type),untyped=selected.length-ready.length;
  $('#ww-count').textContent=S.wordWorkshop.mode==='formation'?ready.length+' words with verified families'+(untyped?' · '+untyped+' kept for Grammar':''):selected.length+' selected'+(untyped?' · choose a type for '+untyped+' word'+(untyped===1?'':'s'):'');$('#ww-start').disabled=S.wordWorkshop.mode==='formation'?!ready.length:!selected.length||!!untyped;
  const formation=S.wordWorkshop.mode==='formation';
  $('#ww-review-help').textContent=formation?'Choose words for word formation. Each row shows whether a family is available at this level.':'Choose how each word is used. Review or edit its forms; separate accepted alternatives with /.';
  $('#ww-start-note').textContent=!selected.length?'Select at least one word.':formation&&!ready.length?'No word-family tasks for these selected words at '+S.wordWorkshop.level.toUpperCase()+'. Start Grammar with this list, choose another level, or add words such as care, help or happy.':formation&&untyped?ready.length+' selected words will be used; '+untyped+' have no family at this level.':!formation&&untyped?'Choose a word type for each selected word to start.':'';
  const fallback=$('#ww-use-grammar');fallback.hidden=!(formation&&selected.length&&!ready.length);fallback.textContent=selected.every(r=>r.type)?'Start Grammar with these words':'Switch to Grammar';
  $('#ww-preview').innerHTML=rows.length?rows.map((r,i)=>`<article class="ww-review-row"><label class="ww-choice"><input type="checkbox" data-ww-include="${i}" ${r.enabled?'checked':''}><span>${esc(r.word)}${r.meaning?`<small>${esc(r.meaning)}</small>`:''}</span></label><label class="ww-type-label"><span class="ww-sr-only">Use ${esc(r.word)} as</span><select data-ww-type="${i}">${types.map(([v,n])=>`<option value="${v}"${v===r.type?' selected':''}>${n}</option>`).join('')}</select></label>${S.wordWorkshop.mode==='formation'?`<p class="ww-family-status">${P.formationTasks(r,S.wordWorkshop.level).length?P.formationTasks(r,S.wordWorkshop.level).length+' word-family tasks':'No word-family tasks at '+S.wordWorkshop.level.toUpperCase()}</p>`:''}${S.wordWorkshop.mode==='grammar'&&!['fixed','adverb','adjective',''].includes(r.type)?`<details class="ww-forms-editor"><summary>Review forms</summary><div>${Object.entries(r.forms).filter(([k])=>k!=='base').map(([k,values])=>`<label>${labels[k]||esc(k)}<input type="text" data-ww-form="${i}" data-form="${k}" maxlength="250" value="${esc(values.join(' / '))}"></label>`).join('')}</div></details>`:''}</article>`).join(''):'<p class="ww-empty">Select course words or paste your own list above.</p>';
 }
 function setup(){
  boardObserver?.disconnect();dragController?.abort();document.querySelector('.ww-drag-ghost')?.remove();init();state=null;
  setView(`<section class="ww-page ww-settings">${gmBar()}<h1>Word Craft</h1><p class="ww-subtitle">A workshop for your words</p><div class="ww-mode-picker" role="group" aria-label="Workshop mode"><button type="button" data-ww-mode="grammar" aria-pressed="${S.wordWorkshop.mode==='grammar'}">Grammar</button><button type="button" data-ww-mode="formation" aria-pressed="${S.wordWorkshop.mode==='formation'}">Word formation</button></div><div class="ww-level-picker" id="ww-levels" role="group" aria-label="Training level">${P.levels.map(l=>`<button type="button" data-ww-level="${l}" aria-pressed="${S.wordWorkshop.level===l}">${l==='kids'?'Kids':l.toUpperCase()}</button>`).join('')}</div><p class="ww-level-note">Higher levels include the earlier forms. Each word gets up to five different random tasks.</p><div class="ww-source-grid"><section class="ww-source"><h2>Words from your courses</h2>${lessonPickerHTML('craft')}</section><section class="ww-source"><h2>Your own words</h2><label for="mine">One word or phrase per line. A translation after | is optional.</label><textarea id="mine" rows="7" maxlength="12000" placeholder="look for\ntake off\nconceal"></textarea><button type="button" id="ww-example">Insert an example</button></section></div><section class="ww-selection" aria-label="Selected vocabulary"><div class="ww-selection-top"><h2>Your vocabulary</h2><p id="ww-count" role="status"></p></div><p class="ww-review-help" id="ww-review-help">Choose how each word is used. You can review or edit its forms before starting; separate accepted alternatives with /.</p><div id="ww-preview"></div><p id="ww-start-note" class="ww-start-note" role="status"></p><div class="ww-start-actions"><button type="button" id="ww-start" class="ww-primary" disabled aria-describedby="ww-start-note">Start workshop</button><button type="button" id="ww-use-grammar" hidden>Start Grammar instead</button></div></section></section>`);
  gmBind();document.querySelectorAll('[data-ww-mode]').forEach(b=>b.onclick=()=>{S.wordWorkshop.mode=b.dataset.wwMode;save();document.querySelectorAll('[data-ww-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));preview();});$('#ww-levels').onclick=e=>{const button=e.target.closest('[data-ww-level]');if(!button)return;S.wordWorkshop.level=button.dataset.wwLevel;save();document.querySelectorAll('[data-ww-level]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));preview()};$('#mine').value=S.mine.craft;$('#mine').oninput=e=>{S.mine.craft=e.target.value;save();preview()};
  $('#ww-example').onclick=()=>{const existing=F.parseWords(S.mine.craft).map(r=>r.word);S.mine.craft+=(S.mine.craft.trim()?'\n':'')+(S.wordWorkshop.mode==='formation'?['care','help','happy','comfort','create']:['look for','take off','be packed with']).filter(w=>!existing.includes(w)).join('\n');$('#mine').value=S.mine.craft;save();preview()};
  bindLessons('craft',preview);preview();
  $('#ww-preview').onchange=e=>{const target=e.target;if(target.dataset.wwInclude!==undefined){const row=rows[+target.dataset.wwInclude];updateOverride(row.word,{enabled:target.checked});preview()}
   else if(target.dataset.wwType!==undefined){const row=rows[+target.dataset.wwType];updateOverride(row.word,{type:target.value,forms:{}});preview()}
   else if(target.dataset.wwForm!==undefined){const row=rows[+target.dataset.wwForm],key=target.dataset.form;updateOverride(row.word,{forms:{...(override(row.word).forms||{}),[key]:target.value}});preview()}
  };
  $('#ww-use-grammar').onclick=()=>{
   S.wordWorkshop.mode='grammar';save();document.querySelectorAll('[data-ww-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.wwMode==='grammar')));preview();
   const entries=collect().filter(r=>r.enabled);if(entries.length&&entries.every(r=>r.type))start(entries);
  };
  $('#ww-start').onclick=()=>{const entries=collect().filter(r=>r.enabled&&(S.wordWorkshop.mode==='grammar'?r.type:P.formationTasks(r,S.wordWorkshop.level).length));if(entries.length)start(entries)};bindTouchButtons(document.querySelector('.ww-page'));
 }
 function start(entries){
  boardObserver?.disconnect();const level=S.wordWorkshop.level,mode=S.wordWorkshop.mode;S.splevel=level;
  state={entries:shuffle(entries),level,mode,wordIndex:-1,phase:'board',completed:[],drag:null};
  state.runs=state.entries.map(row=>({row,steps:P.plan(row,level,mode),index:0,phase:'forms',build:P.create(row),history:[],draft:'',feedback:'',pos:null,completed:[],context:null}));renderBoard();
 }
 const active=()=>state?.runs[state.wordIndex];
 function hintText(run){
  const task=stage(run);
  if(state.mode==='formation')return 'One route: '+task.paths[0].recipe.map(id=>{const op=P.inventory.find(o=>o.id===P.partId(id));return op?.label||id;}).join(' → ')+'. Spelling can change as the pieces join.';
  return 'Keep every particle in the phrase. Choose the ending or stem first, then arrange any auxiliary words. Open the answer below if you want to compare.';
 }
 const stage=run=>run.steps[run.index];
 const formOf=run=>run.phase!=='forms'&&run.context?run.context.form:run.draft||P.result(run.build);
 function renderBoard(){
  setView(`<section class="ww-page ww-play ww-tile-play" data-stw-plain data-phase="board"><header class="ww-header"><button id="ww-edit" type="button">← Words</button><h1>Word Craft</h1><button id="ww-how" type="button" aria-expanded="false" aria-controls="ww-help">How to?</button></header><p id="ww-help" class="ww-help" hidden>Drag a small word window from the word bank onto the board. Select it, then drag a piece onto the word, or click the piece. Each new task starts with the original word. Undo reverses a join; Reset starts this word again. Five different forms are picked randomly when available; nouns or small word families may have fewer genuine forms. Word formation has the same full palette for every word. Try any pieces; Check checks the final result. Comparison belongs to Word formation. Hints and answers appear only inside Hint. After the forms, write a phrase or sentence for the random situation. This writing has no checking. Move a focused window with Shift + arrow keys.</p><div class="ww-play-meta"><span>${state.mode==='grammar'?'GRAMMAR':'WORD FORMATION'} / ${state.level.toUpperCase()}</span><p id="ww-progress"></p></div><div class="ww-word-bank" id="ww-bank" aria-label="Word bank"></div><div class="ww-construction" id="ww-stage"><div class="ww-word-board" id="wcf" aria-label="Vocabulary board"><span class="ww-board-caption">Drop a word here. Build it on the board.</span><div class="ww-tiles" id="ww-tiles"></div></div><aside class="ww-tools" id="ww-tools" aria-label="Word building parts"></aside></div><section class="ww-collected" aria-label="Completed forms"><h2>On your workbench</h2><div id="ww-collected"></div></section></section>`);
  $('#ww-edit').onclick=setup;$('#ww-how').onclick=()=>toggle('ww-how','ww-help');bindTouchButtons(document.querySelector('.ww-header'));renderTiles();renderTools();renderCollected();boardObserver=new ResizeObserver(clampWindows);boardObserver.observe($('#wcf'));
 }
 function clampWindows(){
  const board=$('#wcf');if(!board||!state){boardObserver?.disconnect();return;}
  const w=board.clientWidth,h=board.clientHeight;
  document.querySelectorAll('#ww-tiles [data-ww-word]').forEach(node=>{const run=state.runs[+node.dataset.wwWord];if(!run?.pos)return;run.pos.x=Math.max(.025,Math.min(1-(node.offsetWidth+10)/w,run.pos.x));run.pos.y=Math.max(.08,Math.min(1-(node.offsetHeight+15)/h,run.pos.y));node.style.left=run.pos.x*100+'%';node.style.top=run.pos.y*100+'%';});
 }
 function renderTiles(){
  $('#ww-progress').textContent=state.completed.length+' / '+state.runs.reduce((n,r)=>n+r.steps.length,0)+' forms';
  const bank=$('#ww-bank');bank.innerHTML='<span class="ww-bank-label">YOUR WORDS</span>'+state.runs.map((r,i)=>`<button type="button" class="ww-bank-word" id="ww-bank-${i}" data-ww-word="${i}" data-ww-source="word" aria-pressed="${i===state.wordIndex}">${esc(r.row.forms.base[0])}</button>`).join('');
  const tiles=$('#ww-tiles');tiles.innerHTML=state.runs.map((r,i)=>r.pos?`<button type="button" id="ww-tile-${i}" class="ww-word-tile${i===state.wordIndex?' selected':''}${r.phase==='done'?' finished':''}" data-ww-word="${i}" data-ww-source="word" style="left:${r.pos.x*100}%;top:${r.pos.y*100}%" aria-pressed="${i===state.wordIndex}" aria-controls="ww-tools"><${i===state.wordIndex?'output id="ww-result"':'strong'}>${esc(formOf(r))}</${i===state.wordIndex?'output':'strong'}><small>${esc(r.row.forms.base[0])}</small><span>${Math.min(r.index+(r.phase!=='forms'?1:0),r.steps.length)} / ${r.steps.length}${r.phase==='done'?' ✓':''}</span></button>`:'').join('');
  clampWindows();
  document.querySelectorAll('[data-ww-source=word]').forEach(button=>{
   const i=+button.dataset.wwWord;button.onclick=()=>select(i);bindDrag(button,'word',String(i));
   button.onkeydown=e=>{if(e.shiftKey&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();const r=state.runs[i];if(!r.pos)placeWord(i);const board=$('#wcf').getBoundingClientRect();r.pos.x=Math.max(0,Math.min(.72,r.pos.x+({'ArrowLeft':-12,'ArrowRight':12}[e.key]||0)/board.width));r.pos.y=Math.max(0,Math.min(.8,r.pos.y+({'ArrowUp':-12,'ArrowDown':12}[e.key]||0)/board.height));renderTiles();$('#ww-tile-'+i)?.focus({preventScroll:true});}};
  });bindTouchButtons(bank);bindTouchButtons(tiles);
 }
 function placeWord(i,pos){
  const n=state.runs.filter(r=>r.pos).length;
  state.runs[i].pos=pos||{x:.06+(n%3)*.28,y:.15+(Math.floor(n/3)%5)*.14};
 }
 function select(index){if(!state.runs[index])return;state.wordIndex=index;const run=active();if(!run.pos)placeWord(index);if(!run.steps.length&&run.phase==='forms')beginContext(run);renderTiles();renderTools();}
 function renderTools(){
  const run=active(),box=$('#ww-tools');if(!run){box.innerHTML='<p class="ww-tools-empty">Bring a word onto the board.</p>';return;}
  if(run.phase==='context'||run.phase==='done'){
   const c=run.context;
   box.innerHTML=`<p class="ww-context-label">A RANDOM SITUATION</p><h2 id="ww-topic">${esc(c.topic.title)}</h2><p class="ww-context-prompt">${esc(c.topic.prompt)}</p><p class="ww-context-target">Try <strong id="ww-word">${esc(c.form)}</strong></p><label for="ww-answer">Your phrase or sentence</label><textarea id="ww-answer" rows="6" maxlength="1200" spellcheck="false" placeholder="Your idea…"></textarea><p class="ww-no-check">Free writing · no checking</p><button type="button" id="ww-next" class="ww-primary">${state.runs.every(r=>r.phase==='done')?'New round':run.phase==='done'?'Next word':'Save & continue'}</button>`;
   $('#ww-answer').value=c.draft;$('#ww-answer').oninput=e=>{c.draft=e.target.value;saveWriting(run);};
   $('#ww-next').onclick=()=>{if(state.runs.every(r=>r.phase==='done')){start(state.entries);return;}run.phase='done';saveWriting(run);const next=state.runs.findIndex(r=>r.phase!=='done');if(next>=0)select(next);else{state.phase='done';document.querySelector('.ww-play').dataset.phase='done';renderTiles();renderTools();}};bindTouchButtons(box);return;
  }
  const task=stage(run),parts=P.parts(run.build,state.level,state.mode),groups=[...new Set(parts.map(p=>p.group))];
  box.innerHTML=`<div class="ww-tools-heading"><span id="ww-selected">${esc(run.row.forms.base[0])}</span><span>${run.index+1} / ${run.steps.length}</span></div><p id="ww-task">${esc(task.prompt)}</p><button type="button" id="ww-hint" aria-expanded="false" aria-controls="ww-hint-copy">Hint</button><div id="ww-hint-copy" class="ww-hint-copy" hidden><p>${esc(hintText(run))}</p><button type="button" id="ww-show" aria-expanded="false" aria-controls="ww-model">Show answer</button><p class="ww-model" id="ww-model" hidden>${esc(task.answers.join(' / '))}</p></div><div class="ww-part-groups">${groups.map(group=>`<section class="ww-part-group"><h3>${esc(group)}</h3><div>${parts.filter(p=>p.group===group).map(p=>`<button type="button" class="ww-part" id="ww-op-${p.id}" data-ww-part="${esc(p.id)}" data-ww-source="part" aria-pressed="${p.kind==='aux'&&run.build.aux.includes(p.value)}">${esc(p.label)}</button>`).join('')}</div></section>`).join('')}</div><p class="ww-recipe">${esc([run.build.original,...run.build.chain].join(' + '))}</p><div class="ww-builder-actions"><button type="button" id="ww-undo" aria-label="Undo last piece" ${run.history.length?'':'disabled'}>Undo</button><button type="button" id="ww-reset">Reset</button><button type="button" id="ww-check" class="ww-primary">Check</button></div><p id="ww-feedback" role="status">${esc(run.feedback)}</p><details class="ww-extra"><summary>Type a form instead</summary><label class="ww-sr-only" for="ww-answer">Your form</label><textarea id="ww-answer" rows="2" maxlength="250" spellcheck="false"></textarea></details>`;
  box.querySelectorAll('[data-ww-part]').forEach(button=>{button.onclick=()=>applyPart(button.dataset.wwPart);bindDrag(button,'part',button.dataset.wwPart);});
  $('#ww-answer').value=run.draft;$('#ww-answer').oninput=e=>{run.draft=e.target.value;$('#ww-result').textContent=formOf(run);};
  $('#ww-hint').onclick=()=>toggle('ww-hint','ww-hint-copy');$('#ww-show').onclick=()=>toggle('ww-show','ww-model');
  $('#ww-reset').onclick=()=>{run.build=P.create(run.row);run.history=[];run.draft='';run.feedback='';refresh();};
  $('#ww-undo').onclick=()=>{if(run.history.length){run.build=run.history.pop();run.draft='';run.feedback='';refresh();}};
  $('#ww-check').onclick=()=>{
   if(!F.matches(formOf(run),task.answers)){run.feedback='Try another combination.';$('#ww-feedback').textContent=run.feedback;return;}
   const form=formOf(run);state.completed.push({word:run.row.word,form});run.completed.push(form);run.index++;run.build=P.create(run.row);run.history=[];run.draft='';run.feedback='';
   if(run.index>=run.steps.length)beginContext(run);refresh();renderCollected();
  };bindTouchButtons(box);
 }
 function beginContext(run){
  const topic=WordWorkshopContexts[Math.floor(Math.random()*WordWorkshopContexts.length)],form=run.completed.length?run.completed[Math.floor(Math.random()*run.completed.length)]:run.row.forms.base[0];
  run.phase='context';run.context={topic,form,draft:''};
 }
 function saveWriting(run){if(!S.wordWorkshop.writing)S.wordWorkshop.writing={};S.wordWorkshop.writing[state.mode+'|'+run.row.word]={...run.context,level:state.level};save();}
 function refresh(){renderTiles();renderTools();}
 function applyPart(id,index=state.wordIndex){
  const run=state.runs[index];if(!run||run.phase!=='forms')return;
  const before=JSON.parse(JSON.stringify(run.build));
  if(!P.apply(run.build,id,state.level,state.mode)){run.feedback='This piece does not join this word.';if(index===state.wordIndex)renderTools();return;}
  state.wordIndex=index;if(!run.pos)placeWord(index);run.history.push(before);run.draft='';run.feedback='';refresh();
 }
 function bindDrag(button,kind,id){
  button.ondragstart=e=>e.preventDefault();
  button.onpointerdown=e=>{
   if(e.button!==0||state.drag)return;
   const stageEl=$('#ww-stage'),current=state;dragController?.abort();dragController=new AbortController();const controller=dragController;
   const drag={kind,id,node:button,pointer:e.pointerId,x:e.clientX,y:e.clientY,moved:false,ghost:null};state.drag=drag;
   const move=ev=>{
    if(state!==current||!stageEl.isConnected){drag.ghost?.remove();controller.abort();return;}
    if(current.drag!==drag||ev.pointerId!==drag.pointer)return;
    if(!drag.moved&&Math.hypot(ev.clientX-drag.x,ev.clientY-drag.y)<7)return;
    if(!drag.moved){drag.moved=true;stageEl.setPointerCapture(ev.pointerId);const ghost=document.createElement('div');ghost.className='ww-drag-ghost';ghost.textContent=kind==='word'?state.runs[+id].row.forms.base[0]:button.textContent;ghost.dataset.noShareReplay='true';document.body.append(ghost);drag.ghost=ghost;}
    ev.preventDefault();drag.ghost.style.left=ev.clientX+'px';drag.ghost.style.top=ev.clientY+'px';
   };
   const finish=ev=>{
    if(state!==current||!stageEl.isConnected){drag.ghost?.remove();controller.abort();return;}
    if(current.drag!==drag||ev.pointerId!==drag.pointer)return;
    move(ev);const moved=drag.moved;drag.ghost?.remove();state.drag=null;controller.abort();
    if(!moved)return;
    if(ev.pointerType==='touch')touchClickGuard=true;
    const target=document.elementFromPoint(ev.clientX,ev.clientY),word=target?.closest('[data-ww-word]'),part=target?.closest('[data-ww-part]');
    const commit=()=>{
    if(kind==='part'&&word){applyPart(id,+word.dataset.wwWord);return;}
    if(kind==='word'&&part){applyPart(part.dataset.wwPart,+id);return;}
    if(kind==='word'&&target?.closest('#wcf')){
     const board=$('#wcf').getBoundingClientRect();placeWord(+id,{x:Math.max(.025,Math.min(.72,(ev.clientX-board.left-75)/board.width)),y:Math.max(.08,Math.min(.82,(ev.clientY-board.top-30)/board.height))});select(+id);
    }
    };
    commit();
   };
   const cancel=()=>{if(current.drag!==drag)return;drag.ghost?.remove();current.drag=null;controller.abort();};
   // Listen on the document for bank drags, capture on the stable work area once moving.
   document.addEventListener('pointermove',move,{signal:controller.signal});document.addEventListener('pointerup',finish,{signal:controller.signal});document.addEventListener('pointercancel',cancel,{signal:controller.signal});
   stageEl.onlostpointercapture=ev=>{if(ev.target===stageEl)cancel();};
  };
 }
 function bindTouchButtons(root){
  root?.querySelectorAll('button').forEach(button=>{
   if(touchBound.has(button)||typeof button.onclick!=='function')return;touchBound.add(button);
   const action=button.onclick;
   button.addEventListener('pointerdown',e=>{
    const focused=document.activeElement;
    if(e.pointerType==='touch'&&focused?.matches('input,textarea,select'))focused.blur();
   });
   button.addEventListener('pointerup',e=>{
    if(e.pointerType!=='touch'||state?.drag?.moved)return;
    touchClickGuard=true;e.preventDefault();action.call(button,e);
   });
  });
 }
 function renderCollected(){const tray=$('#ww-collected');tray.replaceChildren();for(const item of state.completed){const chip=document.createElement('span');chip.textContent=item.form;tray.append(chip);}if(!state.completed.length)tray.textContent='Your completed forms will collect here.';}
 function toggle(button,panel){const copy=$('#'+panel);copy.hidden=!copy.hidden;$('#'+button).setAttribute('aria-expanded',String(!copy.hidden));}
 wcSetup=setup;
 window.WordWorkshop={setup,get state(){return state},get selection(){return rows}};
})();
