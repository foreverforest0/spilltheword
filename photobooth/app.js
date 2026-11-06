/* Self-contained three-frame grammar booth. No camera, network or paid services. */
(() => {
 'use strict';
 const $ = s => document.querySelector(s), bank = window.PHOTO_BANK;
 const topic = $('#topic'), mode = $('#mode'), scene = $('#scene'), booth = $('#booth');
 const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
 let phase = 'idle', frame = 0, round = 0, tasks = [], photos = [], selected = '', locked = false, session = 0, sessionTopic = '';
 const delay = ms => new Promise(r => setTimeout(r, reduced ? 12 : ms));
 const norm = s => String(s).toLowerCase().replace(/[’‘]/g,"'")
  .replace(/\b(can't|won't|shan't)\b/g, x => ({"can't":'cannot',"won't":'will not',"shan't":'shall not'}[x]))
  .replace(/\b(does|do|did|is|are|was|were|has|have|had|would|should|could|must)n't\b/g,'$1 not')
  .replace(/\b(i|you|he|she|it|we|they)'ll\b/g,'$1 will')
  .replace(/[.,!?;:"“”]/g,'').replace(/\s+/g,' ').trim();
 const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const shuffle = a => a.map(v => ({v,r:Math.random()})).sort((a,b)=>a.r-b.r).map(x=>x.v);
 const current = () => bank[+topic.value];
 function setPhase(s) { phase = s; booth.dataset.state = s; topic.disabled = mode.disabled = scene.disabled = false; }
 const pause = async(ms,run) => {await delay(ms);return run===session;};
 function feedback(text,kind='') { $('#feedback').textContent=text; $('#feedback').className='feedback '+kind; }
 function sound(kind) {
  try {
   const A = window.AudioContext || window.webkitAudioContext;
   sound.ctx = sound.ctx || new A(); const ctx=sound.ctx; if(ctx.state==='suspended')ctx.resume();
   const o=ctx.createOscillator(), g=ctx.createGain(); o.connect(g);g.connect(ctx.destination);
   o.type='sine';o.frequency.setValueAtTime(kind==='coin'?880:kind==='print'?130:660,ctx.currentTime);
   g.gain.setValueAtTime(.035,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.16);o.start();o.stop(ctx.currentTime+.18);
  } catch(_) {}
 }
 bank.forEach((t,i)=>topic.add(new Option(t.title,String(i))));
 function reset() {
  session++;setPhase('idle');frame=0;tasks=[];photos=[];locked=false;$('#coin').disabled=false;$('#coin').classList.remove('inserted');
  $('#paper').classList.remove('printing');$('#paper').style.setProperty('--feed','-103%');$('#paper-content').replaceChildren();
  $('#countdown').textContent='';$('#flash').classList.remove('fire');
  $('#finish').hidden=true;$('#next-frame').hidden=true;$('#answer-form').hidden=true;$('#prompt').hidden=true;$('#task-scene').hidden=true;
  $('#task-title').textContent=current().title;$('#instruction').textContent='Choose a mode and scene, then insert the coin. Finish each sentence to reveal its photograph.';
  $('#round-label').textContent='YOUR THREE-PICTURE SESSION';$('#footnote').textContent='You can change the topic, mode or scene at any time.';
  $('#preview-image').parentElement.classList.remove('active');$('#task-scene').classList.remove('revealed');$('#machine-caption').textContent='The curtain is closed. Click the coin to begin.';
  document.querySelectorAll('.lamps i').forEach(e=>e.classList.remove('on'));feedback('');
 }
 function populateModes(){mode.replaceChildren();current().exerciseModes.forEach((m,i)=>mode.add(new Option(m.name,String(i))))}
 function populateScenes(){scene.replaceChildren();scene.add(new Option('Next three scenes','auto'));current().cases.forEach((t,i)=>scene.add(new Option(`Scene ${String(i+1).padStart(2,'0')}`,String(i))))}
 topic.onchange=()=>{round=0;populateModes();populateScenes();reset()};mode.onchange=reset;scene.onchange=reset;
 $('#change-task').onclick=()=>{reset();window.scrollTo({top:0,behavior:reduced?'instant':'smooth'});topic.focus({preventScroll:true})};
 function showTask() {
  const t=tasks[frame];selected='';locked=false;setPhase('answering');$('#next-frame').hidden=true;
  $('#task-title').textContent=sessionTopic;$('#round-label').textContent=`FRAME ${frame+1} / 3 · SCENE ${t.sceneNumber}`;
  $('#instruction').textContent=t.instruction;$('#prompt').hidden=false;$('#prompt').textContent=t.prompt;
  $('#task-scene').classList.remove('revealed');$('#task-scene').hidden=false;$('#task-image').src=t.picture;$('#frame-number').textContent=`FRAME 0${frame+1} · DEVELOPING…`;
  $('#preview-image').src=t.picture;$('#preview-image').parentElement.classList.add('active');
  $('#answer-form').hidden=false;$('#answer').value='';$('#answer').disabled=false;$('#check').disabled=false;
  const choice=t.mode==='1';$('#answer').hidden=choice;$('.answer-label').hidden=choice;$('#choices').hidden=!choice;
  $('#choices').replaceChildren();
  if(choice){
   const good=new Set(t.answers.map(norm)),alternatives=t.options.filter(x=>!good.has(norm(x))),choices=shuffle([t.answers[0],...shuffle(alternatives).slice(0,2)]);
   for(const text of choices){const b=document.createElement('button');b.type='button';b.textContent=text;b.setAttribute('aria-pressed','false');b.onclick=()=>{if(locked)return;selected=text;$('#choices').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));feedback('')};$('#choices').append(b)}
  }
  $('#machine-caption').textContent='Finish the sentence to develop the blurred picture.';feedback('');
  if(innerWidth<=700){const run=session;setTimeout(()=>{if(run===session&&phase==='answering')$('.desk').scrollIntoView({block:'start',behavior:reduced?'instant':'smooth'})},reduced?12:1200)}
 }
 $('#coin').onclick=async()=>{
  if(phase!=='idle')return;
  const run=session;setPhase('starting');$('#coin').disabled=true;$('#coin').classList.add('inserted');sound('coin');
  const chosen=current(),m=mode.value,start=scene.value==='auto'?(round*3)%chosen.cases.length:+scene.value;sessionTopic=chosen.title;
  tasks=Array.from({length:3},(_,i)=>{const index=(start+i)%chosen.cases.length,t=chosen.cases[index];return {...t,mode:m,sceneNumber:index+1,instruction:chosen.exerciseModes[+m].instruction,answers:m==='2'?[...new Set([t.correction,...t.answers.map(a=>t.correction.replace(t.answers[0],a))])]:t.answers,prompt:m==='2'?t.errorPrompt:t.prompt}});
  $('#machine-caption').textContent='Your session is starting…';if(!await pause(850,run))return;showTask();
 };
 function fillPaper(){
  $('#paper-content').replaceChildren();
  // A strip feeds bottom first: completed photographs collect from the bottom up.
  const frames=Array(3-photos.length).fill(null).concat([...photos].reverse());
  for(const photo of frames){const f=document.createElement('div');f.className='print-frame';if(photo)f.innerHTML=`<img src="${esc(photo.picture)}" alt="Developed grammar scene"><p>${esc(photo.answer)}</p>`;$('#paper-content').append(f)}
 }
 $('#answer-form').onsubmit=async e=>{
  e.preventDefault();if(phase!=='answering'||locked)return;
  const run=session,t=tasks[frame],answer=t.mode==='1'?selected:$('#answer').value;
  if(!answer.trim()){feedback(t.mode==='1'?'Choose an answer first.':'Type an answer first.','error');return}
  if(!t.answers.some(a=>norm(a)===norm(answer))){feedback('Not quite. Check the instruction and try again.','error');return}
  locked=true;$('#check').disabled=true;$('#answer').disabled=true;$('#choices').querySelectorAll('button').forEach(x=>x.disabled=true);
  if(innerWidth<=700)booth.scrollIntoView({block:'start',behavior:reduced?'instant':'smooth'});
  setPhase('shooting');feedback('Correct — your photograph is developing!','success');$('#machine-caption').textContent='Hold still…';if(!await pause(650,run))return;
  for(const n of ['3','2','1']){$('#countdown').textContent=n;if(!await pause(450,run))return}$('#countdown').textContent='';
  $('#flash').classList.add('fire');sound('shutter');if(!await pause(400,run))return;$('#flash').classList.remove('fire');
  $('#task-scene').classList.add('revealed');$('#frame-number').textContent=`FRAME 0${frame+1} · DEVELOPED`;
  photos.push({picture:t.picture,answer:t.correction,prompt:t.prompt,instruction:t.instruction});fillPaper();
  document.querySelectorAll('.lamps i')[frame].classList.add('on');frame++;
  setPhase('printing');$('#machine-caption').textContent='The curtain is opening. Here comes your photograph…';
  if(!await pause(600,run))return;
  $('#paper').classList.add('printing');$('#paper').style.setProperty('--feed',`${-100+(frame/3)*100}%`);sound('print');
  if(!await pause(2300,run))return;
  if(frame<3){setPhase('revealed');$('#next-frame').hidden=false;feedback('Your picture is ready. Press Next picture when you are ready.','success');$('#machine-caption').textContent=`${frame} of 3 photographs developed.`;return}
  setPhase('done');$('#answer-form').hidden=true;
  $('#task-title').textContent='A little keepsake.';$('#instruction').textContent='All three pictures are developed. Your photo strip is ready to save.';$('#round-label').textContent='SESSION COMPLETE';
  $('#finish').hidden=false;feedback('Your three-picture strip is ready.','success');$('#machine-caption').textContent='Three pictures. Three little achievements.';
  $('#footnote').textContent='Save your strip, start another session or choose any other topic.';round++;
 };
 $('#next-frame').onclick=()=>{if(phase==='revealed')showTask()};
 $('#again').onclick=reset;
 const loadImage=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src});
 function wrap(ctx,text,x,y,width,lineHeight){let line='';for(const word of text.split(/\s+/)){const next=line?line+' '+word:word;if(ctx.measureText(next).width>width&&line){ctx.fillText(line,x,y);y+=lineHeight;line=word}else line=next}if(line){ctx.fillText(line,x,y);y+=lineHeight}return y;}
 $('#download').onclick=async()=>{
  if(phase!=='done'||photos.length!==3)return;
  const button=$('#download');button.disabled=true;
  try {
   const exportPhotos=[...photos].reverse(),exportTopic=sessionTopic,run=session;const images=await Promise.all(exportPhotos.map(p=>loadImage(p.picture))),c=document.createElement('canvas');c.width=720;c.height=2040;const ctx=c.getContext('2d');
   ctx.fillStyle='#fff0d8';ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle='#7c1a2b';ctx.lineWidth=5;ctx.strokeRect(18,18,684,2004);
   ctx.fillStyle='#711725';ctx.font='bold 25px Georgia';ctx.textAlign='center';wrap(ctx,exportTopic,360,62,620,30);ctx.font='14px sans-serif';ctx.fillText('B1 · GRAMMAR PHOTOBOOTH',360,115);
   for(let i=0;i<3;i++) {const y=150+i*610;ctx.drawImage(images[i],50,y,620,465);ctx.strokeStyle='#8a3442';ctx.lineWidth=2;ctx.strokeRect(50,y,620,465);ctx.fillStyle='#711725';ctx.font='bold 20px sans-serif';wrap(ctx,exportPhotos[i].answer,360,y+493,600,25);ctx.font='14px sans-serif';wrap(ctx,exportPhotos[i].prompt,360,y+550,600,19);}
   ctx.font='italic 18px Georgia';ctx.fillText('Three pictures. Three little achievements.',360,1990);
   const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));if(!blob)throw Error('Cannot export');
   if(run!==session)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='grammar-photobooth-'+exportTopic.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
  }catch(_){feedback('The strip could not be saved. Please try again.','error')}finally{button.disabled=false}
 };
 populateModes();populateScenes();reset();
})();
