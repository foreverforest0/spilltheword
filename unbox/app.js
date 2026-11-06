/* Unbox it: physical parcel interaction over the existing relative-clause banks. */
(() => {
 'use strict';
 const $=s=>document.querySelector(s), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const PARTS='unbox/assets/parts.png', PAPER='unbox/assets/papers.png', OPEN='unbox/assets/open-box.png';
 const crops={closed:[5,25,370,300],knife:[734,604,350,260],tape:[1090,626,350,183],peeled:[382,878,336,202],redCard:[750,871,309,184],greenCard:[1096,867,342,196],flap:[737,45,344,266]};
 const objectNames=['speaker','printer','watch','scooter','gamepad','earbuds','drone','powerbank','ereader','airfryer','actioncam','vr','ukulele','skate','instant','bubbletea','kite','snorkel','lava','disco'];
 const physical=Object.fromEntries(objectNames.map((n,i)=>['fa_'+n+'.webp',i]));
 function objectMarkup(it){
  if(Number.isInteger(it.art)){const cell=it.art%12,x=(cell%4)*362,row=Math.floor(cell/4),edges=it.art<12?[0,362,724,1086]:[0,385,738,1086],y=edges[row],h=edges[row+1]-y,id='ub-find-'+(++spriteSerial);return `<div class="ub-object ub-photo"><svg viewBox="${x} ${y} 362 ${h}" aria-hidden="true"><defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="362" height="${h}"/></clipPath></defs><image clip-path="url(#${id})" href="unbox/assets/finds-${it.art<12?1:2}.png" width="1448" height="1086"/></svg></div>`}
  const i=physical[it.im];
  if(i!==undefined){const x=(i%5)*280.4,y=Math.floor(i/5)*280.5,id='ub-object-crop-'+(++spriteSerial);return `<div class="ub-object ub-photo"><svg viewBox="${x} ${y} 280.4 280.5" aria-hidden="true"><defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="280.4" height="280.5"/></clipPath></defs><image clip-path="url(#${id})" href="unbox/assets/objects.png" width="1402" height="1122"/></svg></div>`}
  return `<div class="ub-object ub-postcard"><img src="ch/${it.im}" alt="" draggable="false"><span>${esc(it.n||it.l||'')}</span></div>`;
 }
 const names={s:'Choose a relative word',d:'Make a definition',j:'Join two sentences',q:'Check and repair',w:'Whose parcel is it?',p:'The story of an object'};
 const descriptions={s:'Choose who, which, where or whose to match what you unpack.',d:'Build a definition from two short sentences.',j:'Join two sentences with a relative clause.',q:'Decide whether the sentence is correct, then repair it if needed.',w:'Join two clues about the owner using whose.',p:'Tell an object’s story with Present or Past Simple Passive.'};
 const topic=g=>g==='p'?'Passive voice':'Relative clauses';
 const taskKeys=(g,lv)=>g==='p'?['p']:(lv==='1'?['s','d','j','q','w']:['s','d','j','q']);
 let active=null, audio=null, spriteSerial=0;
 const sprite=(key,cls='')=>{const [x,y,w,h]=crops[key],id="ub-crop-"+(++spriteSerial);return `<svg class="ub-sprite ${cls}" viewBox="${x} ${y} ${w} ${h}" aria-hidden="true" focusable="false"><defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><image clip-path="url(#${id})" href="${PARTS}" width="1448" height="1086"/></svg>`};
 const later=(run,ms,fn)=>{const timer=setTimeout(()=>{run.timers.delete(timer);if(active===run&&FY===run.owner&&run.root.isConnected)fn()},reduced?Math.min(ms,35):ms);run.timers.add(timer);return timer};
 function dispose(){if(!active)return;active.timers.forEach(clearTimeout);active.timers.clear();active=null}
 function sound(kind){
  if(S.snd===false)return;
  try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();
   const duration=kind==='paper'?.35:kind==='open'?.23:.055,n=Math.floor(audio.sampleRate*duration),buffer=audio.createBuffer(1,n,audio.sampleRate),a=buffer.getChannelData(0);
   for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/n,1.5)*(kind==='paper'?.35+.65*Math.abs(Math.sin(i/470)):1);
   const source=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();source.buffer=buffer;filter.type='bandpass';filter.frequency.value=kind==='cut'?3100:1200;filter.Q.value=.6;gain.gain.value=kind==='cut'?.025:.045;source.connect(filter);filter.connect(gain);gain.connect(audio.destination);source.start();
  }catch(_){}
 }
 function button(label,attrs=''){return `<button class="ub-button" type="button" ${attrs}>${label}</button>`}
 function back(){dispose();FY=null;VCUR=null;spSetup()}
 function makeSession(gid,lv){const D=FYO[lv];return {gid,lv,D,G:D[gid],items:shuffle(D[gid].items.slice()),i:0,notes:[],stars:0,mode:S.unboxMode||'n',contents:S.unboxContents||'both',phase:'sealed',started:true,open:false,tok:Date.now()}}
 function settings(gid,lv){
  dispose();const selected=gid||FY?.gid||'d',level=lv||FY?.lv||'1',mode=FY?.mode||S.unboxMode||'n',contents=FY?.contents||S.unboxContents||'both';
  FY=makeSession(selected,level);FY.mode=mode;FY.contents=contents;
  setView(`<section class="ub-page ub-setup"><div class="ub-header">${button('← Topics','id="ub-back"')}<h2>Unbox it<span>${topic(selected)} · ${level==='1'?'B1':'B2'}</span></h2><span></span></div><div class="ub-setup-art">${sprite('closed')}</div><div class="ub-settings"><p class="ub-eyebrow">A LITTLE SOMETHING TO FIGURE OUT</p><h3>Choose your parcel</h3><fieldset><legend>Your task</legend><div class="ub-task-options">${taskKeys(selected,level).map(k=>[k,names[k]]).map(([k,n])=>`<button type="button" class="ub-option${k===selected?' selected':''}" data-task="${k}" aria-pressed="${k===selected}"><b>${n}</b><small>${descriptions[k]}</small></button>`).join('')}</div></fieldset><fieldset id="ub-mode-field"><legend>Your answer</legend><div class="ub-choices">${[['n','Build with word tiles'],['t','Type the sentence']].map(([k,n])=>`<button type="button" class="ub-option${k===mode?' selected':''}" data-mode="${k}" aria-pressed="${k===mode}">${n}</button>`).join('')}</div></fieldset><fieldset><legend>Inside the box</legend><div class="ub-choices">${[['both','Object + card'],['object','Object'],['card','Card']].map(([k,n])=>`<button type="button" class="ub-option${k===contents?' selected':''}" data-contents="${k}" aria-pressed="${k===contents}">${n}</button>`).join('')}</div></fieldset><p class="ub-setup-hint">Take the knife, cut the tape, then lift the wrapping paper to discover your task.</p>${button('Open my first parcel →','id="ub-start"')}</div></section>`);
  $('#ub-back').onclick=back;
  const choose=(attribute,key)=>document.querySelectorAll(`[data-${attribute}]`).forEach(b=>b.onclick=()=>{FY[key]=b.dataset[attribute];document.querySelectorAll(`[data-${attribute}]`).forEach(x=>{const on=x===b;x.classList.toggle('selected',on);x.setAttribute('aria-pressed',String(on))});if(key==='gid')$('#ub-mode-field').hidden=FY.gid==='s'});
  choose('task','gid');choose('mode','mode');choose('contents','contents');$('#ub-mode-field').hidden=selected==='s';
  $('#ub-start').onclick=()=>{const {gid,lv,mode,contents}=FY;S.unboxMode=mode;S.unboxContents=contents;save();FY=makeSession(gid,lv);FY.mode=mode;FY.contents=contents;fyScene()};
 }
 function paperTexture(i){const col=i%3,row=Math.floor(i/3);return `<svg viewBox="${col*512+40} ${row*512+52} 425 408" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="${PAPER}" width="1536" height="1024"/></svg>`}
 function setPhase(run,phase){run.phase=phase;run.owner.phase=phase;run.root.dataset.phase=phase}
 function instruction(run,text){const el=run.root.querySelector('#ub-instruction');if(el)el.textContent=text}
 function returnKnife(run){run.held=false;run.drawing=false;run.root.classList.remove('ub-holding');const b=run.root.querySelector('#ub-knife');if(b)b.setAttribute('aria-pressed','false')}
 function openBox(run){
  if(run.phase!=='sealed')return;returnKnife(run);run.owner.open=true;setPhase(run,'opening');const knife=run.root.querySelector('#ub-knife');knife.disabled=true;knife.querySelector('span').textContent='';instruction(run,'The tape is cut. Your parcel is opening…');sound('open');
  later(run,1000,()=>{setPhase(run,'paper');instruction(run,'Lift the wrapping paper to see what is inside.');run.root.querySelector('#ub-paper').disabled=false;run.root.querySelector('#ub-paper').focus({preventScroll:true})});
 }
 function unwrap(run){
  if(run.phase!=='paper')return;setPhase(run,'unwrapping');sound('paper');run.root.querySelector('#ub-paper').disabled=true;instruction(run,'A little something for you…');
  later(run,800,()=>{setPhase(run,'revealed');run.owner.open=true;instruction(run,'Your task is ready. Take a look at the card.');const task=run.root.querySelector('#fztask');task.hidden=false;fyTask();if(innerWidth<700)task.scrollIntoView({behavior:reduced?'instant':'smooth',block:'nearest'})});
 }
 function bindCut(run){
  const stage=run.root.querySelector('#ub-stage'),parcel=run.root.querySelector('#ub-parcel'),knife=run.root.querySelector('#ub-knife'),ghost=run.root.querySelector('#ub-knife-ghost'),guide=run.root.querySelector('#ub-guide'),mark=run.root.querySelector('#ub-cut-mark'),progress=run.root.querySelector('#ub-progress');
  const A={x:530,y:220},B={x:420,y:373},dx=B.x-A.x,dy=B.y-A.y,len2=dx*dx+dy*dy;run.seam={a:A,b:B};run.bins=new Uint8Array(64);
  const point=e=>{const r=parcel.getBoundingClientRect();return {x:(e.clientX-r.left)*1000/r.width,y:(e.clientY-r.top)*(2000/3)/r.height}};
  const ghostAt=e=>{const r=stage.getBoundingClientRect();ghost.style.left=(e.clientX-r.left)+'px';ghost.style.top=(e.clientY-r.top)+'px'};
  const sample=p=>{const t=((p.x-A.x)*dx+(p.y-A.y)*dy)/len2;if(t<-.08||t>1.08)return;const clamped=Math.max(0,Math.min(1,t)),distance=Math.hypot(p.x-A.x-clamped*dx,p.y-A.y-clamped*dy);if(distance>23)return;const bin=Math.min(63,Math.floor(clamped*64));run.bins[bin]=1};
  const record=p=>{
   if(run.previous){const a=run.previous,d=Math.hypot(p.x-a.x,p.y-a.y),steps=Math.min(350,Math.max(1,Math.ceil(d/3)));for(let i=1;i<=steps;i++)sample({x:a.x+(p.x-a.x)*i/steps,y:a.y+(p.y-a.y)*i/steps})}else sample(p);
   run.previous=p;const n=run.bins.reduce((s,v)=>s+v,0);progress.value=n;run.root.dataset.cut=String(n);
   let paths='';for(let i=0;i<64;i++)if(run.bins[i]){const t=i/64,t2=(i+1)/64;paths+=`M${A.x+dx*t},${A.y+dy*t} L${A.x+dx*t2},${A.y+dy*t2} `}mark.setAttribute('d',paths);
   if(n>run.lastSound&&performance.now()-(run.soundAt||0)>80){sound('cut');run.lastSound=n;run.soundAt=performance.now()}
   if(n>=57&&run.bins.slice(0,4).some(Boolean)&&run.bins.slice(60).some(Boolean)){guide.style.opacity='0';openBox(run)}
  };
  const take=e=>{
   if(run.phase!=='sealed')return;run.held=true;run.root.classList.add('ub-holding');knife.setAttribute('aria-pressed','true');instruction(run,'Draw the blade along the tape, from one end of the dotted seam to the other.');sound('take');if(e)ghostAt(e);
  };
  const start=e=>{if(run.phase!=='sealed'||!run.held||e.button!==0)return;e.preventDefault();run.drawing=true;run.previous=null;stage.setPointerCapture(e.pointerId);ghostAt(e);record(point(e))};
  knife.onpointerdown=e=>{e.stopPropagation();take(e);start(e)};
  knife.onclick=e=>{if(e.detail===0){take();parcel.focus()}};
  stage.onpointerdown=e=>{if(e.target.closest('#ub-paper'))return;start(e)};
  stage.onpointermove=e=>{if(!run.held)return;ghostAt(e);if(run.drawing&&run.phase==='sealed')record(point(e))};
  const finish=e=>{run.drawing=false;run.previous=null;if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId)};
  stage.onpointerup=finish;stage.onpointercancel=finish;
  parcel.onkeydown=e=>{if((e.key==='Enter'||e.key===' ')&&run.held&&run.phase==='sealed'){e.preventDefault();run.bins.fill(1);progress.value=64;openBox(run)}else if(e.key==='Escape'&&run.phase==='sealed'){returnKnife(run);instruction(run,'Take the knife, then cut the tape along the seam.')}};
 }
 const oldTask=fyTask;
 fyStart=(gid,lv)=>settings(gid,lv);
 fyScene=()=>{
  dispose();if(!FY)return;const owner=FY;if(owner.i>=owner.items.length){fyEnd();return}
  const it=owner.items[owner.i],revealed=owner.phase==='revealed',pattern=owner.i%6,label=owner.gid==='s'?it.l:it.n;
  setView(`<section class="ub-page" data-phase="${revealed?'revealed':'sealed'}"><div class="ub-header">${button('← Topics','id="ub-back"')}<h2>Unbox it<span>${esc(names[owner.gid])}</span></h2><div class="ub-header-end"><span>Parcel ${owner.i+1} / ${owner.items.length}</span>${button('Choose task','id="ub-settings"')}</div></div><div class="ub-stage" id="ub-stage"><div class="ub-instruction-note">${sprite('redCard')}<p id="ub-instruction" role="status" aria-live="polite">${revealed?'Your task is ready. Take a look at the card.':'Take the knife, then cut the tape along the seam.'}</p></div><div class="ub-parcel" id="ub-parcel" tabindex="0" role="group" aria-label="Parcel. Take the knife, then drag along the tape. Keyboard: take the knife with Enter, then press Enter here to cut."><div class="ub-open"><img src="${OPEN}" alt="Open cardboard parcel" draggable="false"></div><div class="ub-inside ub-inside--${owner.contents}" aria-hidden="true">${objectMarkup(it)}<div class="ub-inner-card">${sprite('redCard')}<span>A LITTLE<br>CHALLENGE</span></div></div><div class="ub-paper-mask"><button class="ub-paper" id="ub-paper" type="button" disabled aria-label="Lift the wrapping paper">${paperTexture(pattern)}<span class="ub-paper-fold"></span></button></div><img class="ub-front" src="${OPEN}" alt="" draggable="false"><div class="ub-closed">${sprite('closed')}</div><div class="ub-flap ub-flap--back">${sprite('flap')}</div><div class="ub-flap ub-flap--front">${sprite('flap')}</div><svg class="ub-cut-overlay" viewBox="0 0 1000 666.6667" aria-hidden="true"><path id="ub-guide" d="M530 220L420 373"/><path id="ub-cut-mark"/></svg><div class="ub-loose-tape">${sprite('peeled')}</div></div><button type="button" class="ub-knife" id="ub-knife" aria-label="Take the knife" aria-pressed="false">${sprite('knife')}<span>Take the knife</span></button><div class="ub-knife-ghost" id="ub-knife-ghost" aria-hidden="true">${sprite('knife')}</div><progress id="ub-progress" class="ub-sr-only" max="64" value="0" aria-label="Tape cut progress"></progress></div><div class="ub-item-label" aria-hidden="true">${esc(label)}</div><div class="ub-task" data-topic="${topic(owner.gid)}" id="fztask"${revealed?'':' hidden'}></div></section>`);
  const root=$('.ub-page'),run={owner,root,phase:revealed?'revealed':'sealed',held:false,drawing:false,timers:new Set(),lastSound:0};active=run;
  $('#ub-back').onclick=back;$('#ub-settings').onclick=()=>settings(owner.gid,owner.lv);
  const paper=$('#ub-paper');let paperTouch=null;
  paper.onclick=()=>unwrap(run);
  // A captured knife drag can suppress the browser's subsequent compatibility click.
  // Handle a short touch tap directly; unwrap's phase guard prevents duplicate activation.
  paper.onpointerdown=e=>{if(e.pointerType==='touch'&&run.phase==='paper')paperTouch={id:e.pointerId,x:e.clientX,y:e.clientY}};
  paper.onpointerup=e=>{const t=paperTouch;paperTouch=null;if(t&&t.id===e.pointerId&&Math.hypot(e.clientX-t.x,e.clientY-t.y)<10)unwrap(run)};
  paper.onpointercancel=()=>{paperTouch=null};bindCut(run);
  if(revealed)fyTask();
 };
 fyTask=()=>{const task=$('#fztask');if(!task||!FY)return;task.hidden=false;
  if(FY.gid==='w'||FY.gid==='p'){
   const it=FY.items[FY.i],passive=FY.gid==='p';
   task.innerHTML=`<div class="evq">${passive?'Read the label. Describe the object using the passive. Leave out who did the action.':'Join the clues with whose. Keep the first sentence and replace Her / His.'}</div><div class="fzcard"><div>${esc(it.a)}</div><div>${esc(it.b)}</div></div>${passive?`<p class="fzhint">Start: <b>${esc(it.start)}</b> · ${it.tense==='past'?'Past':'Present'} Simple Passive</p>`:''}<div id="fzans"></div>`;
   fyBuild($('#fzans'),it,'',0,(s,f,r)=>fyDone(task,s,f,r));return;
  }
  oldTask();task.querySelectorAll('.fypb span').forEach(x=>x.remove());const q=task.querySelector('.evq');if(FY.gid==='s'&&q)q.textContent='Which relative word fits this person, thing or place?'};
 fyNext=()=>{
  const owner=FY,run=active;if(!owner||owner.leaving)return;if(owner.gid==='s'){const it=owner.items[owner.i];owner.notes.push(it.l+' → '+it.a)}owner.leaving=true;if(run){setPhase(run,'leaving');returnKnife(run)}
  const go=()=>{if(FY!==owner)return;owner.i++;owner.open=false;owner.phase='sealed';owner.leaving=false;fyScene()};
  if(run)later(run,430,go);else go();
 };
 fyDone=(T,sent,fails,rev)=>{
  if(!FY)return;const s=sent.charAt(0).toUpperCase()+sent.slice(1)+(/[.!?]$/.test(sent)?'':'.');FY.notes.push(s);if(!fails&&!rev)FY.stars++;
  const last=FY.i>=FY.items.length-1;T.innerHTML=`<p class="ub-eyebrow">A LITTLE DISCOVERY</p><div class="ub-correct" role="status">✓ Nicely done.</div><div class="evsent">${esc(s)}</div><p class="ub-read">Read it aloud before opening the next parcel.</p><div class="evbt">${button('Listen','id="fzsp"')}${button(last?'Finish →':'Next parcel →','id="fznx"')}</div>`;$('#fzsp').onclick=()=>elSpeak(s);$('#fznx').onclick=()=>fyNext();
 };
 fyEnd=()=>{
  dispose();const owner=FY;if(!owner)return;setView(`<section class="ub-page ub-end"><div class="ub-header">${button('← Topics','id="ub-back"')}<h2>All unwrapped<span>${topic(owner.gid)}</span></h2><span></span></div><div class="ub-end-note"><p class="ub-eyebrow">YOUR LITTLE COLLECTION</p><h3>${owner.items.length} parcels opened</h3><p>You’ve finished ${esc(names[owner.gid].toLowerCase())}.</p>${owner.notes.length?`<ol>${owner.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ol>`:''}<p>${owner.stars} first-try answers</p>${button('Another collection →','id="ub-again"')}</div></section>`);$('#ub-back').onclick=back;$('#ub-again').onclick=()=>settings(owner.gid,owner.lv);
 };
 // Keep the existing activity links and reviewed B1/B2 banks.
 Object.assign(FYNAME,names);
 for(const lv of ['1','2']){
  const group=VG[lv==='1'?'fyB1':'fyB2'];group[0]='Unbox it';group[1].forEach(([id],i)=>{group[1][i][1]=Object.values(names)[i]});
  for(const g of ['s','d','j','q']){const name=names[g];const id='f'+g+lv;SPSHORT[id]='Unbox it: '+name;const meta=SPT.find(x=>x.id===id);if(meta){meta.n=SPSHORT[id];meta.d=descriptions[g]}}
  const menu=lv==='1'?'fyB1':'fyB2';SPSHORT[menu]='Unbox it: relative clauses';
 }
 // New B1 collections are registered in their grammar topics as well as the parcel setup.
 VG.fyB1[1].push(['fw1',names.w]);
 for(const g of ['w','p']){const id='f'+g+'1';SPSHORT[id]='Unbox it: '+names[g];DMT[id]=1;DMTF[id]=()=>fyStart(g,'1');SPT.push({id,n:SPSHORT[id],d:descriptions[g]});}
 const passiveGroup=SPGRP.b1.find(g=>g[1].includes('cwa'));if(passiveGroup&&!passiveGroup[1].includes('fp1'))passiveGroup[1].push('fp1');
 const relativeGroup=SPGRP.b1.find(g=>g[1].includes('fyB1'));if(relativeGroup&&!relativeGroup[1].includes('fw1'))relativeGroup[1].push('fw1');
 // Existing root navigation cancels pending opening/unwrap callbacks automatically.
 const observer=new MutationObserver(()=>{if(active&&!active.root.isConnected)dispose()});observer.observe(document.getElementById('view'),{childList:true});
 window.addEventListener('load',()=>{if(new URLSearchParams(location.search).get('unbox')==='1'){S.splevel=new URLSearchParams(location.search).get('level')==='b2'?'b2':'b1';tab='speak';new URLSearchParams(location.search).get('task')==='passive'&&S.splevel==='b1'?fyStart('p','1'):vgStart(S.splevel==='b2'?'fyB2':'fyB1','fd'+(S.splevel==='b2'?'2':'1'))}});
})();
