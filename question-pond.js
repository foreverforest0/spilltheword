/* Original lightweight implementation of the draw → swim → catch interaction
   studied in github.com/gauransh18/doodle-pond. No upstream source is bundled. */
(()=>{
 'use strict';
 const palette=['#70271F','#F24E07','#26422B','#CCE5FF','#F9F5E6'];
 const storageKey='stw-question-pond-v1';
 const allTopics=[];let activeDispose=null;
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const plain=s=>String(s).toLowerCase().replace(/[’‘]/g,"'").replace(/\blet's\b/g,'let us').replace(/\bwon't\b/g,'will not').replace(/\bcan't\b/g,'can not').replace(/\bcannot\b/g,'can not').replace(/\bshan't\b/g,'shall not').replace(/n't\b/g,' not').replace(/\bcan't\b/g,'can not').replace(/'m\b/g,' am').replace(/'re\b/g,' are').replace(/'ve\b/g,' have').replace(/'ll\b/g,' will').replace(/[^a-z0-9'\s]/g,' ').replace(/\s+/g,' ').trim();
 function forms(s){
  let out=[plain(s)];
  for(let i=0;i<5&&out.some(x=>/\b(?:he|she|it|that|there|here|who|what|where|how|when)'s\b|'d\b/.test(x));i++)out=out.flatMap(x=>/\b(he|she|it|that|there|here|who|what|where|how|when)'s\b/.test(x)?[x.replace(/\b(he|she|it|that|there|here|who|what|where|how|when)'s\b/,'$1 is'),x.replace(/\b(he|she|it|that|there|here|who|what|where|how|when)'s\b/,'$1 has')]:/'d\b/.test(x)?[x.replace(/'d\b/,' had'),x.replace(/'d\b/,' would')]:[x]);
  return out.map(x=>x.replace(/'/g,'').replace(/\s+/g,' ').trim());
 }
 const matches=(answer,expected)=>{const actual=new Set(forms(answer));return expected.some(e=>forms(e).some(v=>actual.has(v)))};
 function validDrawing(strokes){
  return Array.isArray(strokes)&&strokes.length>0&&strokes.length<=120&&strokes.every(s=>s&&palette.includes(s.color)&&Number.isFinite(s.width)&&s.width>=.002&&s.width<=.08&&Array.isArray(s.points)&&s.points.length>=2&&s.points.length%2===0&&s.points.every(v=>Number.isFinite(v)&&v>=0&&v<=1))&&strokes.reduce((n,s)=>n+s.points.length/2,0)<=4000;
 }
 function readSaved(){try{const v=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(v)?v.filter(x=>x&&typeof x.topic==='string'&&validDrawing(x.strokes)).slice(-40):[]}catch{return []}}
 function saveFish(topic,strokes){try{const old=readSaved(),mine=old.filter(f=>f.topic===topic).slice(-7),others=old.filter(f=>f.topic!==topic);localStorage.setItem(storageKey,JSON.stringify([...others,...mine,{topic,strokes}].slice(-40)));return true}catch{return false}}
 function paint(ctx,strokes,width,height){
  ctx.clearRect(0,0,width,height);ctx.lineCap='round';ctx.lineJoin='round';
  for(const s of strokes){ctx.strokeStyle=s.color;ctx.lineWidth=s.width*width;ctx.beginPath();ctx.moveTo(s.points[0]*width,s.points[1]*height);for(let i=2;i<s.points.length;i+=2)ctx.lineTo(s.points[i]*width,s.points[i+1]*height);ctx.stroke()}
 }
 function artFromStrokes(strokes){
  const sheet=document.createElement('canvas');sheet.width=600;sheet.height=360;const ctx=sheet.getContext('2d');paint(ctx,strokes,600,360);
  const data=ctx.getImageData(0,0,600,360).data;let x0=600,y0=360,x1=0,y1=0,ink=0;
  for(let y=0;y<360;y++)for(let x=0;x<600;x++)if(data[(y*600+x)*4+3]>20){ink++;x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}
  if(ink<28||x1-x0<10||y1-y0<6)return null;
  const crop=document.createElement('canvas');crop.width=x1-x0+13;crop.height=y1-y0+13;crop.getContext('2d').drawImage(sheet,x0,y0,x1-x0+1,y1-y0+1,6,6,x1-x0+1,y1-y0+1);return crop.toDataURL('image/png');
 }
 const priorView=setView;
 setView=function(html){if(activeDispose){activeDispose();activeDispose=null}return priorView(html)};
 function open(topic){
  const questions=PondQuestions.bankFor(topic.level,topic.number);let mode='catch',current=null,queue=[],phase='idle',fish=[],selected=null,timers=new Set(),frame=0,previousTime=0,alive=true,strokes=[],pen=null,color=palette[0],width=.018,eraser=false,drawnFish=null,storageNotice='';
  const later=(fn,ms)=>{const id=setTimeout(()=>{timers.delete(id);if(alive)fn()},reduce()?Math.min(ms,35):ms);timers.add(id);return id};
  const pageId=topic.level+':'+topic.number;
  setView(`<section class="pond-page" data-pond-topic="${esc(pageId)}"><div class="pond-header"><button class="pond-back" id="pondBack">← Exercises</button><h1>Question pond</h1><span class="pond-topic-label">${esc(topic.name)} · ${topic.level==='kids'?'Kids':topic.level.toUpperCase()}</span></div><div class="pond-toolbar"><nav aria-label="Pond mode"><button class="pond-button active" id="pondCatchMode" aria-pressed="true">Catch a question</button><button class="pond-button" id="pondDrawMode" aria-pressed="false">Draw & release</button></nav><button class="pond-button" id="pondHow" aria-expanded="false" aria-controls="pondHelp">How to?</button></div><p id="pondHelp" class="pond-help" hidden>Click any fish, or tap the water, to catch a question. Use the words in the prompt to write your answer. In Draw & release, draw a fish and release it: a correct answer lets it swim; an incorrect answer makes it jump out. You can correct the same answer and try again.</p><div class="pond-layout"><div class="pond-water-column"><div class="pond-water" id="pondWater" aria-label="Illustrated pond"><div class="pond-school" id="pondSchool"></div><div class="pond-ripple" id="pondRipple" aria-hidden="true"></div><div class="pond-line" id="pondLine" aria-hidden="true"></div></div><p class="pond-status" id="pondStatus" role="status" aria-live="polite">Click a fish to catch a question.</p></div><aside class="pond-question" id="pondQuestion" aria-label="Caught question"><div class="pond-empty"><span class="pond-idle-fish" aria-hidden="true"></span><p>A question is swimming by.</p></div></aside></div></section>`);
  const root=$('#view .pond-page'),water=$('#pondWater'),school=$('#pondSchool'),card=$('#pondQuestion'),status=$('#pondStatus'),ripple=$('#pondRipple'),line=$('#pondLine');
  function dispose(){alive=false;cancelAnimationFrame(frame);timers.forEach(clearTimeout);timers.clear();document.removeEventListener('visibilitychange',visibility);resize.disconnect();fish.forEach(f=>f.el.remove());fish=[];pen=null;root.dataset.disposed='true'}
  activeDispose=dispose;
  $('#pondBack').onclick=spSetup;if($('#view .grammar-exercise-back'))$('#pondBack').hidden=true;
  $('#pondHow').onclick=()=>{const help=$('#pondHelp');help.hidden=!help.hidden;$('#pondHow').setAttribute('aria-expanded',String(!help.hidden))};
  function motion(f,now){
   const r=water.getBoundingClientRect(),size=clamp(r.width*.17,76,116),angle=Math.atan2(f.vy*r.height,f.vx*r.width),flip=f.vx<0?-1:1,tilt=flip<0?angle-Math.PI:angle;
   f.el.style.width=size+'px';f.el.style.height=size+'px';
   f.el.style.left=(f.x*100)+'%';f.el.style.top=(f.y*100)+'%';f.el.style.transform=`translate(-50%,-50%) rotate(${tilt*.45}rad)`;
   f.art.style.transform=`scaleX(${flip}) rotate(${reduce()?0:Math.sin(now*.003+f.seed)*3}deg)`;
  }
  function addFish(src,index,owned=false){
   const el=document.createElement('button');el.type='button';el.className='pond-fish'+(owned?' pond-own-fish':'');el.setAttribute('aria-label',owned?'Catch your fish for another question':'Catch fish '+(index+1));
   const art=document.createElement('span');art.className='pond-fish-art';art.setAttribute('aria-hidden','true');
   if(src){const im=document.createElement('img');im.src=src;im.alt='';im.draggable=false;art.appendChild(im)}else{art.classList.add('pond-house-fish');art.style.backgroundPosition=[0,50,100][index%3]+'% '+(index%6<3?0:100)+'%'}
   el.appendChild(art);school.appendChild(el);
   const f={el,art,x:.22+(index%3)*.27,y:.27+(Math.floor(index/3)%3)*.23,vx:(index%2?-1:1)*(.018+Math.random()*.008),vy:(Math.random()-.5)*.018,seed:Math.random()*30,owned,busy:false};fish.push(f);motion(f,performance.now());el.onclick=e=>{e.stopPropagation();catchFish(f)};el.onpointerenter=()=>f.hovered=true;el.onpointerleave=()=>f.hovered=false;el.onfocus=()=>f.focused=true;el.onblur=()=>f.focused=false;return f;
  }
  for(let i=0;i<6;i++)addFish(null,i);
  for(const saved of readSaved().filter(f=>f.topic===pageId).slice(-8)){const src=artFromStrokes(saved.strokes);if(src)addFish(src,fish.length,true)}
  function tick(now){
   if(!alive)return;const dt=previousTime?Math.min((now-previousTime)/1000,.05):0;previousTime=now;
   if(!document.hidden)for(const f of fish){if(f.busy||f===selected||f.hovered||f.focused||reduce())continue;
    f.x+=f.vx*dt;f.y+=f.vy*dt;
    if(f.x<.15||f.x>.85){f.vx*=-1;f.x=clamp(f.x,.15,.85)}if(f.y<.23||f.y>.76){f.vy*=-1;f.y=clamp(f.y,.23,.76)}
    f.vy+=Math.sin(now*.0006+f.seed)*dt*.0009;f.vy=clamp(f.vy,-.013,.013);motion(f,now);
   }
   if(!document.hidden)frame=requestAnimationFrame(tick);
  }
  function visibility(){cancelAnimationFrame(frame);previousTime=0;if(!document.hidden)frame=requestAnimationFrame(tick)}
  document.addEventListener('visibilitychange',visibility);frame=requestAnimationFrame(tick);
  const resize=new ResizeObserver(()=>{for(const f of fish)if(!f.busy)motion(f,performance.now())});resize.observe(water);
  function splash(x,y){ripple.style.left=x*100+'%';ripple.style.top=y*100+'%';ripple.classList.remove('show');void ripple.offsetWidth;ripple.classList.add('show')}
  function enableFishing(enabled){for(const f of fish)f.el.disabled=!enabled;water.dataset.canCatch=String(enabled)}
  function idle(){current=null;selected=null;phase='idle';strokes=[];pen=null;drawnFish=null;root.dataset.phase=phase;card.innerHTML='<div class="pond-empty"><span class="pond-idle-fish" aria-hidden="true"></span><p>A question is swimming by.</p></div>';status.textContent='Click a fish to catch a question.';enableFishing(true)}
  function changeMode(next){
   if(mode===next||phase==='catching'||phase==='releasing')return;
   mode=next;root.dataset.mode=mode;
   $('#pondCatchMode').classList.toggle('active',mode==='catch');$('#pondCatchMode').setAttribute('aria-pressed',String(mode==='catch'));
   $('#pondDrawMode').classList.toggle('active',mode==='draw');$('#pondDrawMode').setAttribute('aria-pressed',String(mode==='draw'));
   if(current&&phase!=='answered'){strokes=[];drawnFish=null;phase='question';questionCard()}else idle();
  }
  $('#pondCatchMode').onclick=()=>changeMode('catch');$('#pondDrawMode').onclick=()=>changeMode('draw');root.dataset.mode=mode;root.dataset.phase=phase;enableFishing(true);
  function nextQuestion(){if(!queue.length)queue=shuffle(questions.map((_,i)=>i));const index=queue.pop();current={...questions[index],index};root.dataset.questionIndex=index}
  function catchFish(f){
   if(phase!=='idle'||f.busy)return;phase='catching';root.dataset.phase=phase;selected=f;enableFishing(false);status.textContent='A little question, just for you…';splash(f.x,f.y);line.style.setProperty('--line-left',f.x*100+'%');line.style.setProperty('--line-top',f.y*100+'%');line.classList.add('show');f.el.classList.add('caught');
   later(()=>{line.classList.remove('show');f.el.classList.remove('caught');selected=null;nextQuestion();phase='question';questionCard();status.textContent='Use the words in the prompt.';$('#pondAnswer').focus({preventScroll:true});if(innerWidth<760)card.scrollIntoView({behavior:reduce()?'instant':'smooth',block:'nearest'})},520);
  }
  water.onclick=e=>{if(phase!=='idle')return;const r=water.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;const nearest=fish.filter(f=>!f.busy).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];if(nearest)catchFish(nearest)};
  function questionCard(){
   root.dataset.phase=phase;root.dataset.outcome='';
   card.innerHTML=`<div class="pond-card-copy"><p class="pond-question-text">${esc(current.question)}</p><p class="pond-cue">${esc(current.cue)}</p><label for="pondAnswer">Your answer</label><textarea id="pondAnswer" rows="2" spellcheck="false" autocomplete="off"></textarea><div class="pond-answer-actions">${mode==='catch'?'<button class="pond-button primary" id="pondCheck">Check</button><button class="pond-text-button" id="pondShowAnswer">Show answer</button>':'<button class="pond-button primary" id="pondStartDrawing">Draw your fish</button>'}<button class="pond-text-button" id="pondReturn">Back to pond</button></div><p class="pond-feedback" id="pondFeedback" role="status" aria-live="polite"></p><div id="pondStudio" hidden></div></div>`;
   const input=$('#pondAnswer');if(current.draft)input.value=current.draft;
   input.oninput=()=>{current.draft=input.value;$('#pondFeedback').textContent='';root.dataset.outcome=''};
   $('#pondReturn').onclick=()=>{if(phase!=='releasing')idle()};
   if(mode==='catch'){
    $('#pondCheck').onclick=()=>{if(!input.value.trim()){input.focus();$('#pondFeedback').textContent='Write your answer first.';return}
     const ok=matches(input.value,current.answers);root.dataset.outcome=ok?'correct':'incorrect';$('#pondFeedback').textContent=ok?'Yes! Catch another fish when you’re ready.':'Not quite. Check the words and the verb form, then try again.';
     if(ok){phase='answered';root.dataset.phase=phase;$('#pondCheck').disabled=true;input.readOnly=true;$('#pondReturn').textContent='Catch another fish'}
    };
    $('#pondShowAnswer').onclick=()=>{$('#pondFeedback').textContent=current.answers[0];root.dataset.outcome='example'};
   }else $('#pondStartDrawing').onclick=()=>{if(!input.value.trim()){input.focus();$('#pondFeedback').textContent='Write your answer first.';return}studio()};
  }
  function studio(){
   if(!$('#pondStudio').hidden)return;$('#pondStartDrawing').hidden=true;const box=$('#pondStudio');box.hidden=false;
   box.innerHTML=`<p class="pond-draw-label">Draw a fish facing right.</p><div class="pond-drawing-tools"><div class="pond-colors" aria-label="Pencil colour">${palette.map((c,i)=>`<button class="pond-swatch${i===0?' active':''}" style="--swatch:${c}" data-pond-color="${c}" aria-label="${['Brown','Orange','Green','Blue','Cream'][i]} pencil" aria-pressed="${i===0}"></button>`).join('')}</div><label class="pond-width-label">Pencil <input id="pondWidth" type="range" min="4" max="18" value="11" aria-label="Pencil width"></label><button class="pond-text-button" id="pondErase" aria-pressed="false">Eraser</button><button class="pond-text-button" id="pondClear">Clear</button></div><canvas id="pondCanvas" width="600" height="360" aria-label="Draw your fish here"></canvas><button class="pond-button primary" id="pondRelease">Release & check</button>`;
   const canvas=$('#pondCanvas'),ctx=canvas.getContext('2d');color=palette[0];width=11/600;eraser=false;
   const repaint=()=>paint(ctx,strokes,600,360);
   box.querySelectorAll('[data-pond-color]').forEach(b=>b.onclick=()=>{color=b.dataset.pondColor;eraser=false;$('#pondErase').setAttribute('aria-pressed','false');box.querySelectorAll('[data-pond-color]').forEach(c=>{c.classList.toggle('active',c===b);c.setAttribute('aria-pressed',String(c===b))})});
   $('#pondWidth').oninput=e=>width=Number(e.target.value)/600;
   $('#pondErase').onclick=()=>{eraser=!eraser;$('#pondErase').setAttribute('aria-pressed',String(eraser))};
   $('#pondClear').onclick=()=>{if(phase==='releasing')return;strokes=[];pen=null;repaint();$('#pondFeedback').textContent=''};
   const coords=e=>{const r=canvas.getBoundingClientRect();return [clamp((e.clientX-r.left)/r.width,0,1),clamp((e.clientY-r.top)/r.height,0,1)]};
   canvas.onpointerdown=e=>{
    if(phase==='releasing'||phase==='answered'||(e.pointerType==='mouse'&&e.button!==0))return;e.preventDefault();canvas.setPointerCapture(e.pointerId);
    const [x,y]=coords(e);if(eraser){pen={erase:true};eraseAt(x,y);return}
    if(strokes.length>=120||strokes.reduce((n,s)=>n+s.points.length/2,0)>=3950){$('#pondFeedback').textContent='This fish has plenty of pencil marks. Release it, or clear the drawing to start again.';pen=null;return}
    pen={color,width,points:[x,y,x+.0001,y+.0001].map(n=>clamp(n,0,1))};strokes.push(pen);repaint();
   };
   function eraseAt(x,y){strokes=strokes.filter(s=>!s.points.some((_,i)=>i%2===0&&Math.hypot(s.points[i]-x,(s.points[i+1]-y)*.6)<.035));repaint()}
   canvas.onpointermove=e=>{if(!pen)return;const [x,y]=coords(e);if(pen.erase){eraseAt(x,y);return}const points=pen.points;if(points.length>1200||strokes.reduce((n,s)=>n+s.points.length/2,0)>=4000){pen=null;return}if(Math.hypot(x-points.at(-2),y-points.at(-1))>.002){points.push(x,y);repaint()}};
   const end=()=>pen=null;canvas.onpointerup=end;canvas.onpointercancel=end;canvas.onlostpointercapture=end;
   $('#pondRelease').onclick=release;repaint();
  }
  function release(){
   if(phase==='releasing'||phase==='answered')return;
   const input=$('#pondAnswer');if(!input.value.trim()){input.focus();$('#pondFeedback').textContent='Write your answer first.';return}
   const src=validDrawing(strokes)&&artFromStrokes(strokes);if(!src){$('#pondFeedback').textContent='Draw a little fish before releasing it.';return}
   phase='releasing';root.dataset.phase=phase;const releaseButton=$('#pondRelease');releaseButton.disabled=true;input.readOnly=true;
   const ok=matches(input.value,current.answers);root.dataset.outcome=ok?'correct':'incorrect';
   drawnFish=addFish(src,fish.length,true);drawnFish.x=.55;drawnFish.y=.66;drawnFish.busy=true;motion(drawnFish,performance.now());drawnFish.el.disabled=true;drawnFish.el.classList.add(ok?'released':'jumped');splash(.55,.66);
   status.textContent=ok?'Your fish is swimming.':'Your fish jumped out. Try correcting your answer.';
   $('#pondFeedback').textContent=ok?'Correct — your fish can stay in the pond!':'Not quite — your fish jumped out. Check your answer and release it again.';
   if(ok){const saved=saveFish(pageId,strokes);storageNotice=saved?'':' Your browser could not save it for next time.';$('#pondFeedback').textContent+=storageNotice;}
   later(()=>{
    if(ok){drawnFish.busy=false;drawnFish.el.classList.remove('released');drawnFish=null;phase='answered';input.readOnly=true;$('#pondReturn').textContent='Catch another fish';$('#pondRelease').textContent='Swimming in the pond';$('#pondStudio').hidden=true;
     // Keep the local school bounded even after a long lesson.
     const owned=fish.filter(f=>f.owned);if(owned.length>8){const old=owned[0];old.el.remove();fish=fish.filter(f=>f!==old)}
    }else{drawnFish.el.remove();fish=fish.filter(f=>f!==drawnFish);drawnFish=null;phase='question';input.readOnly=false;releaseButton.disabled=false;input.focus({preventScroll:true})}
    root.dataset.phase=phase;
   },ok?650:1100);
  }
 }
 for(const [level,groups]of Object.entries(SPGRP))for(const group of groups){
  const number=Number(group[0].match(/^(\d+)\s*·/)?.[1]);if(!number)continue;
  const topic={id:'pond_'+level+'_'+number,level,number,name:group[0].replace(/^\d+\s*·\s*/,'')};
  PondQuestions.bankFor(level,number); // fail visibly in development rather than silently use an unrelated topic
  allTopics.push(topic);if(!group[1].includes(topic.id))group[1].push(topic.id);SPSHORT[topic.id]='Question pond';SPT.push({id:topic.id,n:'Question pond: '+topic.name,d:'Catch a question or draw and release a fish.'});DMT[topic.id]=1;DMTF[topic.id]=()=>open(topic);SPLV.find(l=>l[0]===level)?.[2].push(topic.id);
 }
 window.QuestionPond={topics:allTopics,forms,matches,validDrawing,bankFor:PondQuestions.bankFor,open:id=>{const topic=allTopics.find(t=>t.id===id);if(!topic)throw Error('Unknown pond');open(topic)}};
})();
