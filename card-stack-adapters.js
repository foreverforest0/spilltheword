/* Adapters preserve each exercise's prompts, answers and specialised controls. */
(()=>{
 'use strict';
 const {create,paper}=CardStacks;
 const header=(title,extra='')=>`<div class="cbbar"><button class="lvb" id="cs-topics">← Topics</button><h2>${esc(title)}</h2><div>${extra}</div></div>`;
 function shell(title,extra='',id='cs-main'){setView(`<section class="panel k-card cbpanel cs-question-page">${header(title,extra)}<div class="cs-task-hint" id="cs-task-hint" hidden></div><div id="${id}"></div></section>`);$('#cs-topics').onclick=spSetup;return document.getElementById(id)}
 const oldGlRender=glRender;
 glRender=function(){
  if(GL?.mode!=='ts')return oldGlRender();const owner=GL,items=owner.items;
  const host=shell('Tense Switch','<button class="lvb" id="cs-rule">Hint</button>');
  const deck=create(host,items.map(x=>({front:`<div class="cs-text-front">${esc(x.s)}</div><div class="cs-text-copy">${esc(x.q)}</div>`,back:`<div class="cs-text-front">${esc(x.a)}</div><div class="cs-text-copy"><p>${esc(x.q)}</p><p>${esc(x.s)}</p></div>`})),{initial:owner.i%items.length,label:'Tense Switch',onChange:i=>{owner.i=i;owner.show=false;$('#cs-task-hint').hidden=true},onFlip:(_,back)=>owner.show=back});
  $('#cs-rule').onclick=()=>{const box=$('#cs-task-hint'),topic=items[deck.index].t;box.hidden=!box.hidden;box.textContent=topic.f+' '+topic.ex};
 };
 function gifPaper(c,back=false){
  const media=`<img class="gifimg" src="${GIFS[c.g]||GIFS[0]}" alt="Animated scene" draggable="false">`,words=c.words||[];
  let copy=(c.gram?'<p class="gifg">'+esc(c.gram)+'</p>':'')+(words.length?'<p class="gifw">'+words.map(w=>esc(w.w||w)).join(' · ')+'</p>':'');
  if(back){const rule=GT.find(t=>t.n===c.gram);copy+='<p>Describe what is happening in complete sentences.</p>'+(rule?'<p class="cs-model">'+esc(rule.f)+'</p>':'');const translated=words.filter(w=>w.r);if(translated.length)copy+='<p class="cs-model">'+translated.map(w=>esc(w.w)+' — '+esc(w.r)).join('<br>')+'</p>'}
  return paper(media,copy||'<p>What is happening?</p>');
 }
 const oldGif=_renderGif;
 _renderGif=function(){
  if(!GF?.cards?.length)return oldGif();const owner=GF,host=shell('Describe the GIF','<button class="lvb" id="cs-gif-new">New cards</button>');
  create(host,owner.cards.map(c=>({front:()=>gifPaper(c),back:()=>gifPaper(c,true)})),{initial:owner.csIndex||0,onChange:i=>{owner.csIndex=i;owner.open=-1}});
  $('#cs-gif-new').onclick=()=>{owner.cards=owner.cards.map(()=>gifDeal(false));owner.csIndex=0;renderGif()};
 };
 const oldSpeaking=_renderSp;
 _renderSp=function(){
  if(!GF||GF.task==='gwt')return oldSpeaking();const owner=GF;let models=[];
  if(owner.task==='thr'||PHOTO[owner.task]){
   models=(owner.items||spItems()).map(([sceneIndex,questionIndex])=>{const scene=spSet()[sceneIndex],qa=scene.q[questionIndex];return {front:()=>paper(`<img src="${PICS[scene.k]}" alt="" draggable="false">`,`<p>${esc(qa[0])}</p>`),back:()=>paper(`<img src="${PICS[scene.k]}" alt="" draggable="false">`,`<p>${esc(qa[0])}</p><p class="cs-model">${esc(qa[1])}</p>`)}});
  }else{
   const step=owner.task==='cmp'?2:1;
   for(let n=0;n<owner.order.length-(step===2?1:0);n+=step){const a=ACTIONS[owner.order[n]],b=ACTIONS[owner.order[n+1]],past=owner.t||'yesterday',compare=owner.task==='cmp',isPast=owner.task==='pas';
    const media=compare?`<div class="two"><img src="${a[1]}" alt=""><span>→</span><img src="${b[1]}" alt=""></div>`:`<img src="${a[1]}" alt="" draggable="false">`;
    const question=compare?'What was she doing '+past+'? What is she doing now?':isPast?'What was she doing '+past+'?':SPPRES[owner.q]||'What is she doing?';
    const answer=compare?'She was '+a[0]+', but now she is '+b[0]+'.':isPast?'She was '+a[0]+'.':'She is '+a[0]+'.';models.push({front:()=>paper(media,esc(question)),back:()=>paper(media,`<p>${esc(question)}</p><p class="cs-model">${esc(answer)}</p>`)})
   }
  }
  const host=shell(SPSHORT[owner.task]||'Describe the picture','<button class="lvb" id="cs-speaking-hint">Hint</button>');
  create(host,models,{initial:owner.csIndex||0,onChange:i=>{owner.csIndex=i;$('#cs-task-hint').hidden=true}});
  $('#cs-speaking-hint').onclick=()=>{const box=$('#cs-task-hint');box.hidden=!box.hidden;box.textContent=(SPM[owner.task]||SPM.pres||[]).slice(0,8).map(x=>x[0]).join(' · ')};
 };
 function scene(output,current,page,onQuestion,onOpen){
  output.innerHTML='<article class="scene-photo"><div class="scene-card-deck"></div></article>';const photo=output.querySelector('.scene-photo');
  const items=current.questions.map((qa,i)=>({className:'scene-photo-toggle',front:()=>{const im=document.createElement('img');im.src=current.src;im.alt='Illustrated Present Continuous scene';return im},back:()=>{
   const wrap=document.createElement('div'),w=Math.round(output.querySelector('.scene-card-deck').clientWidth);const lens=magPic(current.src,w,'',Math.round(w*.7));lens.querySelector('.mglight')?.remove();lens.classList.add('lit');
   const move=lens.onpointermove,down=lens.onpointerdown;lens.onpointermove=e=>{lens.classList.remove('lit');move?.(e);lens.classList.add('lit')};lens.onpointerdown=e=>{lens.classList.remove('lit');down?.(e);lens.classList.add('lit')};
   wrap.append(lens);const question=document.createElement('div');question.className='scene-question-copy';question.innerHTML='<p class="scene-question">'+esc(qa[1])+'</p>';wrap.append(question);return wrap;
  }}));
  return create(output.querySelector('.scene-card-deck'),items,{label:'One scene, five questions',keepSide:true,onChange:(i,_,deck)=>{onQuestion(i);onOpen(deck.flips[i]);photo.classList.toggle('opened',deck.flips[i])},onFlip:(_,back)=>{onOpen(back);photo.classList.toggle('opened',back)}});
 }
 function reporter(rows,normalize){
  const round=shuffle(rows.slice()),drafts=round.map(()=>({text:'',feedback:''}));let active=0,deck;
  setView(`<section class="panel k-card cbpanel reporter-page cs-question-page">${header('Correct the reporter','<button class="lvb" id="reporterHint">Hint</button>')}<div class="reporter-hint" id="reporterHintText" hidden></div><div id="reporterCards"></div><label class="reporter-label" for="reporterAnswer">Correct the report</label><textarea id="reporterAnswer" rows="2" spellcheck="false" placeholder="She isn’t … She is …"></textarea><button class="lvb" id="reporterCheck">Check</button><p id="reporterFeedback" role="status" aria-live="polite"></p></section>`);$('#cs-topics').onclick=spSetup;
  const page=$('#view .reporter-page'),input=$('#reporterAnswer'),feedback=$('#reporterFeedback');
  deck=create($('#reporterCards'),round.map(row=>({front:()=>paper(`<img src="${row.src}" alt="" draggable="false">`,`<p>The reporter says:</p><p>${esc(row.subject+' is '+row.wrong+'.')}</p>`),back:()=>paper(`<img src="${row.src}" alt="" draggable="false">`,`<p class="cs-model">${esc(row.subject+' isn’t '+row.wrong+'. '+row.subject+' is '+row.answers[0]+'.')}</p>`)})),{nextId:'reporterNew',beforeChange:(_,old)=>{drafts[old]={text:input.value,feedback:feedback.textContent};input.disabled=true;$('#reporterCheck').disabled=true},onChange:i=>{input.disabled=false;$('#reporterCheck').disabled=false;active=i;input.value=drafts[i].text;feedback.textContent=drafts[i].feedback;const row=round[i];page.dataset.action=row.key;page.dataset.subject=row.subject;page.dataset.wrong=row.wrong;$('#reporterHintText').hidden=true}});
  $('#reporterHint').onclick=()=>{const box=$('#reporterHintText'),row=round[active];box.hidden=!box.hidden;box.textContent=row.subject+' isn’t + verb-ing. '+row.subject+' is + verb-ing.'};
  $('#reporterCheck').onclick=()=>{const row=round[active],subject=row.subject.toLowerCase(),answer=normalize(input.value),negative=subject+' is not '+row.wrong;feedback.textContent=row.answers.some(action=>answer===negative+' '+subject+' is '+action)?'Correct! '+row.subject+' isn’t '+row.wrong+'. '+row.subject+' is '+row.answers[0]+'.':!answer.startsWith(negative)?'First, say that the reporter’s action isn’t happening.':answer===negative?'Now add a positive sentence about the picture.':'Check the main action in the picture and use is + verb-ing.'};input.oninput=()=>feedback.textContent='';
 }
 function there(mode){
  const scenes=shuffle(SCENES.slice()),pairs=shuffle(THERE_COMPARE.slice()),questions=scene=>scene.q.filter(qa=>/^(Is there|Are there|How many)/.test(qa[0])).map(qa=>[qa[0].split('?')[0]+'?',qa[1]]);
  const round=mode==='compare'?pairs.map(p=>({pictures:[[p[0],'Picture A'],[p[1],'Picture B']],question:p[2],answer:p[3]})):scenes.flatMap(s=>questions(s).map(q=>({pictures:[[s.k,s.n]],question:q[0],answer:q[1]})));
  setView(`<section class="there-page cs-question-page">${header('There is / There are: '+THERE_TITLES[mode])}<div class="there-controls">${mode==='memory'?'<button type="button" id="thereHide" aria-pressed="false">Turn light off</button>':''}<button type="button" id="thereExample">Show an example</button></div><div id="thereCards"></div></section>`);$('#cs-topics').onclick=spSetup;const lights=round.map(()=>false);let deck;
  const picture=item=>`<div class="there-images${item.pictures.length===1?' single':''}">${item.pictures.map(([key,label])=>`<figure class="there-scene"><figcaption>${esc(label)}</figcaption><img class="there-photo" src="${PICS[key]}" alt="${esc(label)}"></figure>`).join('')}</div>`;
  deck=create($('#thereCards'),round.map(item=>({front:()=>paper(picture(item),`<div class="thereQuestion">${esc(item.question)}</div>`),back:()=>paper(picture(item),`<div class="thereQuestion">${esc(item.question)}</div><div class="there-example">${esc(item.answer)}</div>`)})),{label:THERE_TITLES[mode],nextId:'thereNew',onChange:i=>{if(mode==='memory')light(i)},onBuild:(card,i)=>{card.classList.toggle('lights-off',lights[i])}});
  function light(i){if(!deck)return;deck.cards[i].classList.toggle('lights-off',lights[i]);const b=$('#thereHide');if(b){b.textContent=lights[i]?'Turn light on':'Turn light off';b.setAttribute('aria-pressed',String(lights[i]))}}
  $('#thereExample').onclick=()=>deck.flip(true);if(mode==='memory')$('#thereHide').onclick=()=>{lights[deck.index]=!lights[deck.index];light(deck.index)};
 }
 // Concrete single-card exercises opt in; the machine/room interactions stay intact.
 therePractice=mode=>there(mode);
 CardStacks.scene=scene;CardStacks.reporter=reporter;CardStacks.there=there;
 const arrowKeys=e=>{if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey||e.target.closest('input,textarea,select,[contenteditable=true]')||document.querySelector('dialog[open],.tymod,.live-answer-panel'))return;const deck=[...CardStacks.instances].find(d=>d.host.isConnected);if(!deck)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();e.stopPropagation();deck.go(e.key==='ArrowRight'?1:-1)}};
 const bindKeys=()=>document.addEventListener('keydown',arrowKeys,true);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindKeys,{once:true});else bindKeys();
})();
