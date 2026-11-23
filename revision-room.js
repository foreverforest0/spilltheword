/* Free B1 production: cues, personal questions and learner-selected words. */
(()=>{
'use strict';
const D=RevisionRoomData,A='assets/revision-room/',KEY='spill-revision-room-b1-v3';
const groups={tenses:'Tenses',conditions:'Conditionals',forms:'Word forms',structures:'Structures'};
const stages=['intro','settings','tables','cards','archive'];
const names={intro:'Topics',settings:'List',tables:'Charts',cards:'Cards',archive:'Drawers'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=n=>Math.max(0,Math.min(1,n));
const ease=n=>{n=clamp(n);return n*n*(3-2*n)};
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
let s;try{s=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem('spill-revision-preview-b1-v3'))}catch{}
if(!s||s.version!==3)s={version:3,stage:'intro',category:'tenses',selected:[],wordSelection:[],extraWords:[],baseWord:'work',drafts:{},tab:'tenses',card:0,lexOffset:0,drawers:[],challenges:{}};
const topic=id=>D.topics.find(t=>t.id===id);
s.selected=s.selected.filter(id=>topic(id));s.wordSelection||=[];s.extraWords||=[];s.drafts||={};s.challenges||={};s.drawers||=[];
const chosen=()=>s.selected.map(topic).filter(Boolean);
const pool=()=>[...new Map([...D.words,...s.extraWords].map(w=>[w.toLowerCase(),w])).values()];
const normaliseWords=values=>{const map=new Map(pool().map(w=>[w.toLowerCase(),w]));return [...new Set(values.map(w=>map.get(w.toLowerCase())).filter(Boolean))]};
s.wordSelection=normaliseWords(s.wordSelection);
const words=()=>s.baseOnly||!s.wordSelection.length?[s.baseWord.trim()||'work']:s.wordSelection;
const ready=()=>s.selected.length>0&&!!(s.baseWord.trim()||s.wordSelection.length);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(s))}catch{}};
const asset=name=>A+name;
const art=(name,cls='')=>`<img class="rb-art ${cls}" src="${asset(name)}" alt="" draggable="false">`;
const lexTasks=[
 ['Explain','Explain the word without saying it.'],
 ['Synonym','Give a close synonym or a short paraphrase.'],
 ['Opposite','Give an opposite in a context. No direct opposite? Describe the contrast.'],
 ['A line','Use the word in a line from a film.'],
 ['Film title','Use the word in the title of a film about your life.'],
 ['Meme','Describe a meme that could illustrate the word.'],
 ['Tiny story','Use the word in a two-sentence story.'],
 ['Collocation','Give a natural collocation, then use it.'],
 ['Advice','Give a piece of advice using the word.'],
 ['Villain','Use the word in a dramatic villain’s line.'],
 ['Comment','Use the word in a comment under a ridiculous video.'],
 ['Question','Ask me a question using the word.'],
 ['Headline','Use the word in a headline you would click on.'],
 ['Character','Describe a fictional character using the word.'],
 ['Reply','Reply to an imaginary message using the word.']
];
let cleanup=null,frame=0,tick=null,dialogKey=null,visualPosition=null,lastMotionTime=0,departureTimer=null;
const positions={};
const previous=setView;
setView=function(html){cleanup?.();cleanup=null;return previous(html)};
function pauseTimers(){Object.values(s.challenges).forEach(c=>{if(c.deadline){c.seconds=Math.max(0,Math.ceil((c.deadline-Date.now())/1000));c.deadline=null}});clearInterval(tick);tick=null;save()}
function location(){const el=document.querySelector('#rbStory');if(!el)return null;const top=el.getBoundingClientRect().top+scrollY,span=Math.max(1,el.offsetHeight-innerHeight),p=clamp((scrollY-top)/span)*stages.length;return {el,top,span,position:p,index:Math.min(4,Math.floor(p)),local:p>=5?1:p%1}}
function go(stage){if(!stages.includes(stage))return;if(stages.indexOf(stage)>1&&!s.selected.length)stage='intro';const p=location();if(!p){s.stage=stage;render();return}window.scrollTo({top:p.top+p.span*(stages.indexOf(stage)+(stage==='intro'?0:.4))/5,behavior:reduced()?'instant':'smooth'});if(reduced())motion()}
function shell(){setView(`<section id="rbStory" class="rb-story" data-stw-plain><div class="rb-pin"><main id="rbScene" class="rb-room" data-stw-plain></main><nav class="rb-dots" aria-label="Steps">${stages.map(st=>`<button data-dot="${st}" aria-label="${names[st]}"></button>`).join('')}</nav></div></section>`);
 const previousRestoration=history.scrollRestoration;history.scrollRestoration='manual';
 const animate=now=>{frame=0;const moving=motion(false,now);if(moving)frame=requestAnimationFrame(animate)};
 const scroll=()=>{if(!frame)frame=requestAnimationFrame(animate)};window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);document.querySelectorAll('[data-dot]').forEach(b=>b.onclick=()=>go(b.dataset.dot));
 cleanup=()=>{pauseTimers();history.scrollRestoration=previousRestoration;window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);cancelAnimationFrame(frame);clearTimeout(departureTimer);frame=0;visualPosition=null;lastMotionTime=0};
}
function top(){return `<header class="rb-top"><div class="rb-heading">${typeof glSetup==='function'?'<button class="rb-catalog-back" data-exit-b1 aria-label="Back to topics">← B1</button>':''}<button class="rb-brand" data-go="intro">Revision room <small>B1</small></button></div><nav>${stages.map(st=>`<button data-go="${st}" aria-current="${s.stage===st?'step':'false'}">${names[st]}</button>`).join('')}</nav></header>`}
function paint(transition=false,direction=1){
 pauseTimers();const host=document.querySelector('#rbScene');if(!host)return;
 const old=host.dataset.stage,content=host.querySelector('.rb-content');
 for(const el of host.querySelectorAll('[data-scroll-save]'))positions[old+el.dataset.scrollSave]=[el.scrollLeft,el.scrollTop];
 document.querySelector('.rb-departure')?.remove();clearTimeout(departureTimer);
 let ghost=null;
 if(transition&&content&&!reduced()){
  ghost=content.cloneNode(true);ghost.className='rb-departure';ghost.inert=true;ghost.setAttribute('aria-hidden','true');ghost.style.setProperty('--p',getComputedStyle(document.querySelector('#rbStory')).getPropertyValue('--p'));
  ghost.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  ghost.style.setProperty('--direction',direction);
  const inputs=content.querySelectorAll('textarea,input'),copies=ghost.querySelectorAll('textarea,input');
  inputs.forEach((el,i)=>{if(copies[i]){const copy=document.createElement('div');copy.className=copies[i].className;copy.textContent=el.value;copy.style.cssText=copies[i].style.cssText;copies[i].replaceWith(copy)}});
  ghost.querySelectorAll('*').forEach(el=>{for(const a of [...el.attributes])if(a.name.startsWith('data-'))el.removeAttribute(a.name)});
 }
 host.dataset.stage=s.stage;const views={intro,settings,tables,cards,archive};
 host.innerHTML=top()+`<div class="rb-content${ghost?' rb-arriving':''}" data-arrival="${s.stage}" style="--direction:${direction}">${views[s.stage]()}</div>`;
 if(ghost){host.append(ghost);departureTimer=setTimeout(()=>ghost.remove(),580)}
 bind(host);
 for(const el of host.querySelectorAll('.rb-content [data-scroll-save]')){const pos=positions[s.stage+el.dataset.scrollSave];if(pos){el.scrollLeft=pos[0];el.scrollTop=pos[1]}}
 save();
}
function render(){seaOff();document.body.classList.add('grammar-style-active');const fresh=!document.querySelector('#rbStory');if(fresh)shell();if(!stages.includes(s.stage))s.stage='intro';paint();if(fresh){const p=location();scrollTo({top:p.top+p.span*(stages.indexOf(s.stage)+(s.stage==='intro'?0:.4))/5,behavior:'instant'})}motion()}
function motion(instant=true,now=performance.now()){
 const p=location();if(!p)return false;
 if(instant||reduced()||visualPosition===null){visualPosition=p.position;lastMotionTime=now}
 else{const dt=Math.max(1,Math.min(48,now-lastMotionTime||16));lastMotionTime=now;visualPosition+=(p.position-visualPosition)*(1-Math.exp(-dt/75));if(Math.abs(p.position-visualPosition)<.00015)visualPosition=p.position}
 const index=Math.min(4,Math.floor(visualPosition)),local=visualPosition>=5?1:visualPosition%1,st=stages[index];
 if(st!==s.stage){const direction=index>=stages.indexOf(s.stage)?1:-1;s.stage=st;paint(true,direction)}
 p.local=local;p.el.dataset.motionStage=st;p.el.style.setProperty('--p',local.toFixed(4));
 p.el.style.setProperty('--enter','1');p.el.style.setProperty('--exit','0');
 document.querySelectorAll('[data-dot]').forEach(b=>b.setAttribute('aria-current',b.dataset.dot===st?'step':'false'));
 if(st==='intro'){
  const W=innerWidth,H=innerHeight,visible=D.topics.filter(t=>t.group===s.category),bar=ease(p.local/.4),fly=ease((p.local-.45)/.5),mobile=W<700,paperW=mobile?W-30:Math.min(1000,W-180),paperLeft=(W-paperW)/2;
  document.querySelectorAll('[data-topic-icon]').forEach(b=>{const id=b.dataset.topicIcon,i=visible.findIndex(t=>t.id===id),j=s.selected.indexOf(id),selected=j>=0,slot=i>=0?i:j,cols=mobile?4:Math.min(12,visible.length),row=Math.floor(slot/cols),col=slot%cols;
   const sx=(.08+((slot*37)%85)/100)*W,sy=(.18+((slot*23)%65)/100)*(H-65),bx=(W-cols*(mobile?82:92))/2+col*(mobile?82:92)+40,by=mobile?120+row*112:105+row*115;
   let x=sx+(bx-sx)*bar,y=sy+(by-sy)*bar,scale=1,opacity=i<0?0:1;
   if(selected){const tx=paperLeft+(mobile?43:72),ty=195+j*45;x+=(tx-x)*fly;y+=(ty-y)*fly;scale=1-.72*fly;opacity=i<0?fly:1}else opacity*=1-fly;
   b.style.left=x+'px';b.style.top=y+'px';b.style.transform=`translate(-50%,-50%) scale(${reduced()?1:scale}) rotate(${(1-bar)*(slot%2?-8:7)}deg)`;b.style.opacity=opacity;b.style.pointerEvents=i<0||fly>.65?'none':'auto';b.style.setProperty('--label-opacity',1-fly);
  });
 }
 return !instant&&!reduced()&&Math.abs(p.position-visualPosition)>.0001;
}
function listRows(ghost=false){return `<div class="rb-topic-list" ${ghost?'':'data-scroll-save="topics"'}>${chosen().map(t=>`<div class="rb-list-row" data-list-topic="${t.id}">${ghost?'<span class="rb-list-space"></span>':art(t.art)}<span>${esc(t.label)}</span>${ghost?'':`<button data-remove="${t.id}" aria-label="Remove ${esc(t.label)}">×</button>`}</div>`).join('')}</div>`}
function intro(){const shown=D.topics.filter(t=>t.group===s.category||s.selected.includes(t.id));return `<section class="rb-select-scene"><div class="rb-categories" role="group" aria-label="Topic categories">${Object.entries(groups).map(([id,n])=>`<button data-category="${id}" aria-pressed="${s.category===id}">${n}</button>`).join('')}</div><div class="rb-topic-pictures">${shown.map(t=>`<button data-topic-icon="${t.id}" class="rb-topic-icon" aria-pressed="${s.selected.includes(t.id)}">${art(t.art)}<span class="rb-topic-tag rb-tag-${t.group}" style="background:${['#dceaf3','#e9dfef','#e5ebd4','#f3dfd9','#ede4c8','#dcebe6'][D.topics.findIndex(x=>x.id===t.id)%6]}">${esc(t.label)}</span></button>`).join('')}</div><div class="rb-intro-leaf" aria-hidden="true">${listRows(true)}</div><button class="rb-next-sheet" data-go="settings" ${!s.selected.length?'disabled':''} aria-label="Back to topics">↓</button></section>`}
function settings(){return `<section class="rb-settings-scene"><div class="rb-leaf">${art('f-logo.svg','rb-leaf-logo')}<div class="rb-leaf-scroll" data-scroll-save="leaf">${listRows()}<label class="rb-base-word">Word <input id="rbBaseWord" maxlength="45" enterkeyhint="go" autocapitalize="off" spellcheck="false" value="${esc(s.baseWord)}" aria-label="Base word for the tense chart"></label></div><button class="rb-word-note" id="rbWordsOpen">${art('logo-v3-svg.png')}<span>My words</span></button><div class="rb-chosen-word-tags">${s.wordSelection.map(w=>`<span>${esc(w)}</span>`).join('')}</div><button class="rb-leaf-next" data-go="tables" ${!ready()?'disabled':''} title="Back to charts" aria-label="Back to charts">Back to charts →</button></div><dialog id="rbWordsDialog" class="rb-word-dialog"><button class="rb-close" id="rbWordsClose" aria-label="Close">×</button><div class="rb-word-tabs"><button id="rbCourseWords">B1 course</button><button id="rbCustomWords">My list</button></div><div id="rbCoursePanel"><input id="rbSearch" type="search" placeholder="Find a word" aria-label="Find a word"><div id="rbWordChoices" class="rb-word-choices">${wordChoices()}</div></div><div id="rbCustomPanel" hidden><textarea id="rbPaste" rows="6" placeholder="One word or phrase per line" aria-label="Custom word list"></textarea><button id="rbAddWords" aria-label="Add words">+</button></div></dialog></section>`}
function wordChoices(query=''){return pool().filter(w=>w.toLowerCase().includes(query.toLowerCase())).map(w=>`<label><input type="checkbox" data-word="${esc(w)}" ${s.wordSelection.includes(w)?'checked':''}><span>${esc(w)}</span></label>`).join('')}
const axes=[['past','Past'],['present','Present'],['future','Future']],aspects=[['simple','Simple'],['continuous','Continuous'],['perfect','Perfect'],['perfect-continuous','Perfect Continuous']];
const tenseId=(p,a)=>p+'-'+a;
function draft(key,label){return `<textarea class="rb-sentence" spellcheck="false" data-draft="${esc(key)}" rows="3" aria-label="${esc(label)}">${esc(s.drafts[key]||'')}</textarea>`}
function tableRow(t,i){const w=words()[i%words().length]||s.baseWord;return `<tr><th scope="row">${esc(t.label)}</th><td class="rb-row-word">${esc(w)}</td><td class="rb-row-cue">${esc(t.seed.join(' · '))}</td><td>${draft('table:'+t.id+':'+w,t.label)}</td></tr>`}
function tables(){const types={tenses:chosen().filter(t=>t.group==='tenses'),conditions:chosen().filter(t=>t.group==='conditions'),forms:chosen().filter(t=>['forms','structures'].includes(t.group))};if(!types[s.tab]?.length)s.tab=Object.keys(types).find(g=>types[g].length)||'tenses';const extras=types.tenses.filter(t=>['going-to','past-mix'].includes(t.id));return `<section class="rb-table-scene"><div class="rb-table-folder"><div class="rb-table-tabs" role="tablist">${[['tenses','Tenses'],['conditions','If & wishes'],['forms','Forms & structures']].map(([id,label])=>`<button data-table="${id}" role="tab" aria-selected="${s.tab===id}" ${!types[id].length?'disabled':''}>${label}</button>`).join('')}</div><div class="rb-grid-paper"><div class="rb-table-top"><span>${s.tab==='tenses'?esc(s.baseWord):''}</span></div><div class="rb-table-scroll" data-scroll-save="table-${s.tab}" tabindex="0">${s.tab==='tenses'?`<table class="rb-tense-table"><thead><tr><th></th>${aspects.map(([,n])=>`<th>${n}</th>`).join('')}</tr></thead><tbody>${axes.map(([p,n])=>`<tr><th scope="row">${n}</th>${aspects.map(([a])=>{const t=topic(tenseId(p,a));return `<td>${t&&s.selected.includes(t.id)?`<div class="rb-cues">${esc(s.baseWord)} · ${esc(t.seed.join(' · '))}</div>${draft('tense:'+t.id+':'+s.baseWord,t.label)}`:'<span class="rb-unselected">—</span>'}</td>`}).join('')}</tr>`).join('')}</tbody></table>${extras.length?`<table class="rb-row-table rb-extra-tenses"><tbody>${extras.map(tableRow).join('')}</tbody></table>`:''}`:`<table class="rb-row-table"><thead><tr><th>Topic</th><th>Word</th><th>Details</th><th>Your sentence</th></tr></thead><tbody>${types[s.tab].map(tableRow).join('')}</tbody></table>`}</div></div></div><button class="rb-scene-next" data-go="cards" aria-label="Back to cards">↓</button></section>`}
function referenceObject(g){return `<div class="rb-reference-object${g.layers?' rb-news-object':''}">${g.layers?g.layers.map(layer=>`<span style="--x:${layer.x}px;--y:${layer.y}px;--rotation:${layer.rotation}deg">${art(layer.art)}</span>`).join(''):art(g.object)}</div>`}
function currentLexTask(index){const w=words()[index];return lexTasks[(index+(s.lexOffset||0)+(s.lexByWord?.[w]||0))%15]}
function cards(){
 const ws=words();s.card=Math.max(0,Math.min(s.card,ws.length-1));const start=Math.floor(s.card/5)*5,shown=ws.slice(start,start+5);
 return `<section class="rb-search-scene"><div class="rb-search-scroll" data-scroll-save="lex-gallery"><div class="rb-search-gallery" style="--columns:${shown.length}">${shown.map((w,i)=>{const g=D.gallery[i],task=currentLexTask(start+i);return `<article class="rb-lex-pair" data-lex-word="${esc(w)}" style="--order:${i};--settle:${g.rotation}deg;--receipt-ink:${g.ink};--receipt-paper:${g.color}"><div class="rb-receipt-card">${art(g.paper,'rb-receipt-backplate')}<p class="rb-lex-task-text">${task[1]}</p><button data-lex-refresh="${start+i}" aria-label="Another task for ${esc(w)}">↻</button></div><figure class="rb-lex-object">${referenceObject(g)}<figcaption class="rb-object-word">${esc(w)}</figcaption></figure></article>`}).join('')}</div></div><nav class="rb-gallery-nav"><button data-action="prev-card" ${start===0?'disabled':''} aria-label="Previous words">←</button><button data-action="next-card" aria-label="Next words">→</button></nav></section>`;
}
function drawerLabel(label){if(label.length<=21)return `<text x="72" y="18" text-anchor="middle" font-size="13" textLength="${Math.min(115,label.length*6.3)}" lengthAdjust="spacingAndGlyphs">${esc(label)}</text>`;const parts=label.split(' '),middle=Math.ceil(parts.length/2);return `<text x="72" y="11" text-anchor="middle" font-size="10"><tspan x="72">${esc(parts.slice(0,middle).join(' '))}</tspan><tspan x="72" dy="10">${esc(parts.slice(middle).join(' '))}</tspan></text>`}
function drawerSvg(t,i){const g=D.gallery[i%5],paper=D.drawerPapers[i%D.drawerPapers.length];return `<svg class="rb-drawer-svg" viewBox="0 0 400 200" aria-hidden="true"><polygon class="rb-svg-top" points="0,0 400,0 355,80 -45,80" fill="${g.drawer}"/><polygon class="rb-svg-right" points="400,0 400,200 355,280 355,80" fill="#FEFEFB"/><polygon class="rb-svg-left" points="0,0 -45,80 -45,280 0,200" fill="${g.drawer}"/><path class="rb-svg-edge" d="M0 0 L-45 80 L355 80 L400 0 M355 80 L355 280 L400 200" fill="none" stroke="#aaa" stroke-width="1"/><g class="rb-svg-papers"><g class="rb-svg-paper"><image href="${asset(paper)}" x="46" y="22" width="280" height="180" preserveAspectRatio="xMidYMid meet"/></g></g><g class="rb-svg-face"><image href="${asset('drawer-face.svg')}" x="-1.539" y="-1.942" width="403.539" height="203.453" preserveAspectRatio="none"/><g class="rb-svg-label" transform="translate(128 16)"><image href="${asset('tab-outer.svg')}" width="144" height="28"/><image href="${asset('tab-inner.svg')}" x="12" y="4" width="120" height="20"/><rect x="12" y="4" width="120" height="20" rx="10" fill="${g.drawer}" fill-opacity=".3"/>${drawerLabel(t.label)}</g><image href="${asset('drawer-knob.svg')}" x="180" y="120" width="40" height="40"/></g></svg>`}
function challenge(id){let c=s.challenges[id];if(!c||!words().includes(c.word)){c=s.challenges[id]={index:Math.floor(Math.random()*15),word:words()[s.selected.indexOf(id)%Math.max(1,words().length)],seconds:60,deadline:null}}return c}
function archive(){return `<section class="rb-cabinet-scene" data-scroll-save="cabinet"><div class="rb-cabinet">${chosen().map((t,i)=>{const c=challenge(t.id),open=s.drawers.includes(t.id),g=D.gallery[i%5];return `<section class="rb-drawer ${open?'rb-open':''}" style="--drawer-tint:${g.drawer};--receipt-ink:${g.ink};--receipt-paper:${g.color}"><button class="rb-drawer-front" data-drawer="${t.id}" aria-label="${esc(t.label)}" aria-expanded="${open}" aria-pressed="${open}">${drawerSvg(t,i)}</button><button class="rb-drawer-card" data-open-task="${t.id}" aria-label="Task: ${esc(t.label)}"><span>${esc(c.word||'')}</span><small>1:00</small></button></section>`}).join('')}</div><dialog id="rbStoryDialog" class="rb-story-dialog"><button class="rb-close" id="rbTaskClose" aria-label="Close">×</button><div id="rbStoryTask"></div></dialog></section>`}
function taskBody(id){const t=topic(id),c=challenge(id),g=D.gallery[Math.max(0,s.selected.indexOf(id))%5];return `<span class="rb-task-topic">${esc(t.label)}</span><div class="rb-story-receipt" style="--receipt-ink:${g.ink};--receipt-paper:${g.color}">${art(g.paper,'rb-receipt-backplate')}<h2>${esc(t.tasks[c.index])}</h2><button class="rb-task-refresh" id="rbTaskRefresh" aria-label="Another question on this topic">↻</button></div><figure class="rb-story-object">${referenceObject(g)}<figcaption><button class="rb-task-word" id="rbTaskWord" title="Another selected word">${esc(c.word||'')}</button></figcaption></figure><div class="rb-timer"><output id="rbTimer">${time(c.seconds)}</output><button id="rbTimerStart" aria-label="Start timer">▶</button><button id="rbTimerReset" aria-label="Reset timer">↺</button></div>`}
function time(n){return Math.floor(n/60)+':'+String(n%60).padStart(2,'0')}
function openTask(id){pauseTimers();dialogKey=id;const d=document.querySelector('#rbStoryDialog');document.querySelector('#rbStoryTask').innerHTML=taskBody(id);d.showModal();bindTask(id);const close=()=>{pauseTimers();d.close();dialogKey=null;paint();motion();document.querySelector('[data-open-task="'+id+'"]')?.focus({preventScroll:true})};document.querySelector('#rbTaskClose').onclick=close;d.oncancel=e=>{e.preventDefault();close()};d.onclick=e=>{if(e.target===d)close()};}
function bindTask(id){const c=challenge(id);
 document.querySelector('#rbTaskWord').onclick=()=>{c.word=words()[(words().indexOf(c.word)+1)%words().length];document.querySelector('#rbTaskWord').textContent=c.word;save()};
 document.querySelector('#rbTaskRefresh').onclick=()=>{pauseTimers();c.index=(c.index+1)%15;c.seconds=60;document.querySelector('#rbStoryTask').innerHTML=taskBody(id);bindTask(id);save()};
 document.querySelector('#rbTimerReset').onclick=()=>{pauseTimers();c.seconds=60;document.querySelector('#rbTimer').textContent='1:00';document.querySelector('#rbTimerStart').textContent='▶';document.querySelector('#rbTimerStart').setAttribute('aria-label','Start timer');save()};
 document.querySelector('#rbTimerStart').onclick=()=>{if(c.deadline){pauseTimers();document.querySelector('#rbTimerStart').textContent='▶';document.querySelector('#rbTimerStart').setAttribute('aria-label','Resume timer');return}if(c.seconds===0)c.seconds=60;c.deadline=Date.now()+c.seconds*1000;document.querySelector('#rbTimerStart').textContent='Ⅱ';document.querySelector('#rbTimerStart').setAttribute('aria-label','Pause');tick=setInterval(()=>{const el=document.querySelector('#rbTimer');if(!el||dialogKey!==id){pauseTimers();return}c.seconds=Math.max(0,Math.ceil((c.deadline-Date.now())/1000));el.textContent=time(c.seconds);if(c.seconds===0){pauseTimers();document.querySelector('#rbTimerStart').textContent='▶';document.querySelector('#rbTimerStart').setAttribute('aria-label','Start timer')}},200);save()};
}
function bindWords(){document.querySelectorAll('[data-word]').forEach(x=>x.onchange=()=>{const w=x.dataset.word;s.baseOnly=false;s.wordSelection=x.checked?[...new Set([...s.wordSelection,w])]:s.wordSelection.filter(v=>v!==w);save()})}
function bind(host){const back=host.querySelector('[data-exit-b1]');if(back)back.onclick=()=>{S.glevel='b1';window.go('gram');window.scrollTo(0,0)};host.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));host.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{s.category=b.dataset.category;paint();motion()});host.querySelectorAll('[data-topic-icon]').forEach(b=>b.onclick=()=>{const id=b.dataset.topicIcon;s.selected=s.selected.includes(id)?s.selected.filter(t=>t!==id):[...s.selected,id];paint();motion()});host.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{s.selected=s.selected.filter(id=>id!==b.dataset.remove);s.drawers=s.drawers.filter(id=>s.selected.includes(id));paint();motion()});host.querySelectorAll('[data-table]').forEach(b=>b.onclick=()=>{s.tab=b.dataset.table;paint();motion()});host.querySelectorAll('[data-draft]').forEach(a=>a.oninput=()=>{s.drafts[a.dataset.draft]=a.value;save()});
 const base=host.querySelector('#rbBaseWord');
 if(base){
  const updateNext=()=>{const next=host.querySelector('.rb-leaf-next');if(next)next.disabled=!ready()};
  const commit=()=>{s.baseWord=base.value.trim().slice(0,45)||'work';base.value=s.baseWord;if(s.baseOnly||!s.wordSelection.length){if(!pool().some(w=>w.toLowerCase()===s.baseWord.toLowerCase()))s.extraWords.push(s.baseWord);s.wordSelection=normaliseWords([s.baseWord]);s.baseOnly=true}save();updateNext()};
  base.oninput=()=>{s.baseWord=base.value.trim().slice(0,45);save();updateNext()};base.onblur=commit;
  base.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();commit();base.blur();go('tables')}};
 }
 const wopen=host.querySelector('#rbWordsOpen');if(wopen){const d=host.querySelector('#rbWordsDialog');wopen.onclick=()=>d.showModal();const close=()=>{d.close();paint();motion()};host.querySelector('#rbWordsClose').onclick=close;d.oncancel=e=>{e.preventDefault();close()};d.onclick=e=>{if(e.target===d)close()};host.querySelector('#rbSearch').oninput=e=>{host.querySelector('#rbWordChoices').innerHTML=wordChoices(e.target.value);bindWords()};host.querySelector('#rbCustomWords').onclick=()=>{host.querySelector('#rbCoursePanel').hidden=true;host.querySelector('#rbCustomPanel').hidden=false};host.querySelector('#rbCourseWords').onclick=()=>{host.querySelector('#rbCoursePanel').hidden=false;host.querySelector('#rbCustomPanel').hidden=true};host.querySelector('#rbAddWords').onclick=()=>{const add=host.querySelector('#rbPaste').value.split(/\n|;/).map(v=>v.split('|')[0].trim()).filter(v=>v&&v.length<=80).slice(0,80);s.extraWords=[...new Set([...s.extraWords,...add])];s.baseOnly=false;s.wordSelection=normaliseWords([...s.wordSelection,...add]);save();close()};bindWords()}
 host.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{const a=b.dataset.action;if(a==='prev-card')s.card=Math.max(0,Math.floor(s.card/5)*5-5);if(a==='next-card'){const next=Math.floor(s.card/5)*5+5;if(next>=words().length){go('archive');return}s.card=next}paint();motion()});host.querySelectorAll('[data-drawer]').forEach(b=>{const row=b.closest('.rb-drawer');const expanded=()=>b.setAttribute('aria-expanded',String(row.matches(':hover,:focus-within')||s.drawers.includes(b.dataset.drawer)));row.onpointerenter=()=>b.setAttribute('aria-expanded','true');row.onpointerleave=expanded;row.onfocusin=()=>b.setAttribute('aria-expanded','true');row.onfocusout=()=>requestAnimationFrame(expanded);b.onclick=()=>{const id=b.dataset.drawer,open=!s.drawers.includes(id);s.drawers=open?[...s.drawers,id]:s.drawers.filter(x=>x!==id);row.classList.toggle('rb-open',open);b.setAttribute('aria-pressed',String(open));if(!open)b.blur();expanded();save()}});
 host.querySelectorAll('[data-lex-refresh]').forEach(b=>b.onclick=()=>{const i=+b.dataset.lexRefresh,w=words()[i];s.lexByWord||={};s.lexByWord[w]=(s.lexByWord[w]||0)+1;b.closest('.rb-lex-pair').querySelector('.rb-lex-task-text').textContent=currentLexTask(i)[1];save()});host.querySelectorAll('[data-open-task]').forEach(b=>b.onclick=()=>openTask(b.dataset.openTask));
}
for(const lv of ['b1']){SPGRP[lv]=SPGRP[lv].filter(g=>!g[1].includes('revision_room'));const last=1+Math.max(0,...SPGRP[lv].map(g=>parseInt(g[0])||0));SPGRP[lv].push([last+' · Revision room',['revision_room']]);const ids=SPLV.find(x=>x[0]===lv)?.[2];if(ids){const at=ids.indexOf('revision_room');if(at>=0)ids.splice(at,1);ids.push('revision_room')}}
DMT.revision_room=1;DMTF.revision_room=render;SPSHORT.revision_room='Revision room';if(!SPT.some(t=>t.id==='revision_room'))SPT.push({id:'revision_room',n:'Revision room',d:''});
window.RevisionRoom={setup:render,go,getState:()=>s,topics:D.topics,lexTasks,taskFor:id=>topic(id)?.tasks,clockRemaining:id=>challenge(id).seconds};
})();
