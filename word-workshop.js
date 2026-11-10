/* Word Craft now practises the forms of the teacher's own selected vocabulary. */
(()=>{
 'use strict';
 const F=WordWorkshopForms,types=[['','Choose type'],['verb','Verb / verb phrase'],['noun','Noun'],['adjective','Adjective'],['fixed','Expression · sentence only']],labels={past:'Past Simple',part:'Past participle',ing:'-ing form',third:'He / she / it',plural:'Plural',possessive:'Singular possessive',comparative:'Comparative',superlative:'Superlative'};
 let rows=[],state=null;
 function init(){S.mine.craft=typeof S.mine.craft==='string'?S.mine.craft:'';S.les.craft=Array.isArray(S.les.craft)?S.les.craft:[];S.lx.craft=Array.isArray(S.lx.craft)?S.lx.craft:[];if(!S.wordWorkshop||typeof S.wordWorkshop!=='object')S.wordWorkshop={};if(!S.wordWorkshop.overrides||typeof S.wordWorkshop.overrides!=='object')S.wordWorkshop.overrides={}}
 function override(word){return Object.hasOwn(S.wordWorkshop.overrides,word)?S.wordWorkshop.overrides[word]:{}}
 function updateOverride(word,patch){S.wordWorkshop.overrides[word]={...override(word),...patch};save()}
 function collect(){
  const seen=new Set(),out=[];for(const item of [...lessonWords('craft').map(r=>({word:F.norm(r.w),meaning:r.r||'',source:r.cat})),...F.parseWords(S.mine.craft).map(r=>({...r,source:'My words'}))]){
   if(seen.has(item.word))continue;seen.add(item.word);const own=override(item.word),type=Object.hasOwn(own,'type')&&types.some(t=>t[0]===own.type)?own.type:F.detect(item.word);
   out.push({...item,...F.analyse(item.word,type,own.forms||{}),enabled:own.enabled!==false});
  }return out.slice(0,150);
 }
 function preview(){
  rows=collect();const selected=rows.filter(r=>r.enabled),ready=selected.filter(r=>r.type),untyped=selected.length-ready.length;
  $('#ww-count').textContent=selected.length+' selected'+(untyped?' · choose a type for '+untyped+' word'+(untyped===1?'':'s'):'');$('#ww-start').disabled=!selected.length||!!untyped;
  $('#ww-preview').innerHTML=rows.length?rows.map((r,i)=>`<article class="ww-review-row"><label class="ww-choice"><input type="checkbox" data-ww-include="${i}" ${r.enabled?'checked':''}><span>${esc(r.word)}${r.meaning?`<small>${esc(r.meaning)}</small>`:''}</span></label><label class="ww-type-label"><span class="ww-sr-only">Use ${esc(r.word)} as</span><select data-ww-type="${i}">${types.map(([v,n])=>`<option value="${v}"${v===r.type?' selected':''}>${n}</option>`).join('')}</select></label>${r.type&&r.type!=='fixed'?`<details class="ww-forms-editor"><summary>Review forms</summary><div>${Object.entries(r.forms).filter(([k])=>k!=='base').map(([k,values])=>`<label>${labels[k]||esc(k)}<input type="text" data-ww-form="${i}" data-form="${k}" maxlength="250" value="${esc(values.join(' / '))}"></label>`).join('')}</div></details>`:''}</article>`).join(''):'<p class="ww-empty">Select course words or paste your own list above.</p>';
 }
 function setup(){
  init();state=null;
  setView(`<section class="ww-page ww-settings">${gmBar()}<h1>Word Craft</h1><p class="ww-subtitle">A workshop for your words</p><div class="ww-source-grid"><section class="ww-source"><h2>Words from your courses</h2>${lessonPickerHTML('craft')}</section><section class="ww-source"><h2>Your own words</h2><label for="mine">One word or phrase per line. A translation after | is optional.</label><textarea id="mine" rows="7" maxlength="12000" placeholder="look for\ntake off\nconceal"></textarea><button type="button" id="ww-example">Insert an example</button></section></div><section class="ww-selection" aria-label="Selected vocabulary"><div class="ww-selection-top"><h2>Your vocabulary</h2><p id="ww-count" role="status"></p></div><p class="ww-review-help">Choose how each word is used. You can review or edit its forms before starting; separate accepted alternatives with /.</p><div id="ww-preview"></div><button type="button" id="ww-start" class="ww-primary" disabled>Start workshop</button></section></section>`);
  gmBind();$('#mine').value=S.mine.craft;$('#mine').oninput=e=>{S.mine.craft=e.target.value;save();preview()};
  $('#ww-example').onclick=()=>{const existing=F.parseWords(S.mine.craft).map(r=>r.word);S.mine.craft+=(S.mine.craft.trim()?'\n':'')+['look for','take off','conceal'].filter(w=>!existing.includes(w)).join('\n');$('#mine').value=S.mine.craft;save();preview()};
  bindLessons('craft',preview);preview();
  $('#ww-preview').onchange=e=>{const target=e.target;if(target.dataset.wwInclude!==undefined){const row=rows[+target.dataset.wwInclude];updateOverride(row.word,{enabled:target.checked});preview()}
   else if(target.dataset.wwType!==undefined){const row=rows[+target.dataset.wwType];updateOverride(row.word,{type:target.value,forms:{}});preview()}
   else if(target.dataset.wwForm!==undefined){const row=rows[+target.dataset.wwForm],key=target.dataset.form;updateOverride(row.word,{forms:{...(override(row.word).forms||{}),[key]:target.value}});preview()}
  };
  $('#ww-start').onclick=()=>{const entries=collect().filter(r=>r.enabled);if(entries.length&&entries.every(r=>r.type))start(entries)};
 }
 function start(entries){state={entries:shuffle(entries),wordIndex:0,stepIndex:0,completed:[],draft:'',phase:'forms',done:false,target:null,sentence:''};render()}
 function current(){return state.entries[state.wordIndex]}
 function stage(){return F.steps(current())[state.stepIndex]||{id:'context',prompt:'Use this expression in a sentence.',hint:'Keep the expression and add your own context.',answers:current().forms.base}}
 function render(){
  const final=state.phase==='sentence'||state.phase==='done',row=final?state.target.row:current(),task=final?null:stage(),context=!final&&task.id==='context',total=F.steps(row).length||1;
  setView(`<section class="ww-page ww-play" data-phase="${state.phase}"><header class="ww-header"><button id="ww-edit" type="button">← Words</button><h1>Word Craft</h1><button id="ww-how" type="button" aria-expanded="false" aria-controls="ww-help">How to?</button></header><p id="ww-help" class="ww-help" hidden>One word stays on the board while you change its forms. Write only the requested form or verb phrase. Keep phrasal-verb particles. Check, then choose Next form. After all words, use one random form in your own sentence. Save sentence checks that you used the target form; your teacher can review the whole sentence through See answers.</p><p class="ww-progress">${final?'Your own sentence':`Word ${state.wordIndex+1} / ${state.entries.length} · Form ${state.stepIndex+1} / ${total}`}</p><div class="ww-board" id="wcf"><div class="ww-word-paper"><span>${final?'Use this form':'Your word'}</span><p id="ww-word">${esc(final?state.target.form:row.forms.base[0])}</p>${row.meaning?`<small>${esc(row.meaning)}</small>`:''}</div><div class="ww-job-paper"><p id="ww-task">${esc(final?'Make your own sentence with this form.':task.prompt)}</p><button type="button" id="ww-hint" aria-expanded="false" aria-controls="ww-hint-copy">Hint</button><p id="ww-hint-copy" hidden>${esc(final?'Give the form a subject and a real situation. You may change a possessive to fit your sentence.':task.hint)}</p><label for="ww-answer">${final||context?'Your sentence':'Your form'}</label><textarea id="ww-answer" rows="${final||context?3:2}" maxlength="${final||context?900:250}" spellcheck="false" autocomplete="off"></textarea><div class="ww-actions"><button type="button" id="ww-check" class="ww-primary">${final?'Save sentence':'Check'}</button>${final?'':'<button type="button" id="ww-show" aria-expanded="false" aria-controls="ww-model">Show answer</button>'}<button type="button" id="ww-next" hidden>${!final&&state.wordIndex===state.entries.length-1&&state.stepIndex===total-1?'My sentence':!final&&state.stepIndex===total-1?'Next word':'Next form'}</button></div><p id="ww-feedback" role="status" aria-live="polite"></p>${final?'':`<p id="ww-model" class="ww-model" hidden>${esc(context?'Use “'+task.answers[0]+'” in your own sentence.':task.answers.join(' / '))}</p>`}</div></div><section class="ww-collected" aria-label="Completed forms"><h2>On your workbench</h2><div id="ww-collected"></div></section></section>`);
  const input=$('#ww-answer');input.value=final?state.sentence:state.draft;renderCollected();
  $('#ww-edit').onclick=setup;$('#ww-how').onclick=()=>toggle('ww-how','ww-help');$('#ww-hint').onclick=()=>toggle('ww-hint','ww-hint-copy');
  if(!final)$('#ww-show').onclick=()=>{toggle('ww-show','ww-model');$('#ww-show').textContent=$('#ww-model').hidden?'Show answer':'Hide answer'};
  input.oninput=()=>{if(final)state.sentence=input.value;else state.draft=input.value;$('#ww-feedback').textContent=''};
  input.onkeydown=e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();$('#ww-check').click()}};
  $('#ww-check').onclick=()=>{
   if(state.done||state.phase==='done')return;const value=input.value.trim();if(!value){$('#ww-feedback').textContent=final||context?'Write a sentence first.':'Write the requested form first.';input.focus();return}
   const ok=final?F.sentenceUses(value,state.target.form):context?F.sentenceUses(value,task.answers[0]):F.matches(value,task.answers);
   if(!ok){$('#ww-feedback').textContent=final||context?'Use the form on the board in a full sentence.':'Not quite. Check the tense, spelling and particles.';return}
   input.readOnly=true;$('#ww-check').disabled=true;
   if(final){state.sentence=value;state.phase='done';document.querySelector('.ww-play').dataset.phase='done';$('#ww-feedback').textContent='Saved with the target form. Your sentence is ready for your teacher.';$('#ww-next').textContent='Another workshop';$('#ww-next').hidden=false}
   else{state.done=true;state.completed.push({word:row.word,row,task:task.id,form:context?task.answers[0]:value,answers:task.answers});renderCollected();$('#ww-feedback').textContent=context?'Saved with the expression.':'Correct. Your new form is on the workbench.';$('#ww-next').hidden=false;const chip=$('#ww-collected').lastElementChild;if(chip&&!matchMedia('(prefers-reduced-motion: reduce)').matches)chip.animate([{transform:'translateY(-12px) rotate(-3deg)',opacity:0},{transform:'none',opacity:1}],{duration:350})}
  };
  $('#ww-next').onclick=()=>{
   if(state.phase==='done'){start(state.entries);return}if(!state.done)return;state.done=false;state.draft='';state.stepIndex++;
   if(state.stepIndex>=total){state.wordIndex++;state.stepIndex=0}
   if(state.wordIndex>=state.entries.length){const picked=state.completed[Math.floor(Math.random()*state.completed.length)];state.target={row:picked.row,form:picked.answers[0]};state.phase='sentence'}
   render();
  };
 }
 function renderCollected(){const tray=$('#ww-collected');tray.replaceChildren();if(!state.completed.length){const p=document.createElement('p');p.textContent='Your checked forms will collect here.';tray.append(p);return}for(const item of state.completed){const chip=document.createElement('span');chip.textContent=item.form;tray.append(chip)}}
 function toggle(button,panel){const copy=$('#'+panel);copy.hidden=!copy.hidden;$('#'+button).setAttribute('aria-expanded',String(!copy.hidden))}
 wcSetup=setup;
 window.WordWorkshop={setup,get state(){return state},get selection(){return rows}};
})();
