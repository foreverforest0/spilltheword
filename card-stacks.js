/* Shared paper decks. Motion adapted from Codrops CardStackEffects (2015).
   Next and Back navigate; neither action grades or removes a card. */
(()=>{
 'use strict';
 const effects=['yuda','krisna','wangi','wira','slamet','eka'];
 const palette=['#CCE5FF','#BEC3EC','#F4DDF4','#F5E99A','#B2BC70','#FF9275','#70271F','#26422B','#F24E07','#F9F5E6'];
 const instances=new Set(),reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const clean=s=>String(s||'').replace(/^[^A-Za-z0-9“"‘']+/,'');
 function ink(hex){const rgb=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]<.18?'#F9F5E6':'#70271F'}
 function create(host,items,options={}){
  if(!host||!items.length)return null;host._cardDeck?.dispose();
  let index=Math.max(0,Math.min(options.initial||0,items.length-1)),alive=true,busy=false,timer=null,queue=[],lastEffect='';const flips=items.map((_,i)=>!!options.initialFlips?.[i]),cards=[];
  host.classList.add('cs-deck');host.dataset.cardStack='true';host.setAttribute('aria-label',options.label||'Practice cards');
  host.innerHTML='<div class="cs-stage"><div class="cs-stack"></div></div><nav class="cs-controls" aria-label="Card navigation"><button type="button" class="cs-back">Back</button><span class="cs-count" role="status" aria-live="polite"></span><button type="button" class="cs-next">Next</button></nav>';
  const stack=host.querySelector('.cs-stack'),previous=host.querySelector('.cs-back'),next=host.querySelector('.cs-next'),counter=host.querySelector('.cs-count');
  if(options.nextId)next.id=options.nextId;if(options.backId)previous.id=options.backId;
  const api={host,cards,items,flips,get index(){return index},get busy(){return busy},get current(){return cards[index]},go,flip,fit,setBack,dispose};host._cardDeck=api;instances.add(api);
  function content(value,item,i){const wrap=document.createElement('div');wrap.className='cs-content';const result=typeof value==='function'?value(item,i):value;if(result instanceof Node)wrap.appendChild(result);else wrap.innerHTML=result||'';return wrap}
  items.forEach((item,i)=>{
   const card=document.createElement('article');card.className='cs-card '+(item.className||'');card.dataset.stackCard=i;card.setAttribute('role','button');card.setAttribute('tabindex','-1');card.setAttribute('aria-label','Turn card '+(i+1));
   for(const [key,value]of Object.entries(item.data||{}))card.dataset[key]=value;
   const colour=item.colour||palette[i%palette.length];card.style.setProperty('--cs-colour',colour);card.style.setProperty('--cs-ink',ink(colour));card.innerHTML='<div class="cs-rotor"><div class="cs-face cs-front"></div><div class="cs-face cs-reverse"></div></div>';
   card._built={};stack.appendChild(card);cards.push(card);
   let pointer=null,moved=false;card.addEventListener('pointerdown',e=>{pointer={x:e.clientX,y:e.clientY};moved=false});card.addEventListener('pointermove',e=>{if(pointer&&Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)>7)moved=true});card.addEventListener('pointercancel',()=>{pointer=null;moved=true});
   card.onclick=e=>{if(busy)return;pointer=null;if(moved){moved=false;return}if(e.defaultPrevented||e.target.closest('button,input,textarea,select,a,[contenteditable=true],[data-no-card-flip],[role=button]:not(.cs-card)'))return;if(getSelection()?.toString())return;
    if(options.onOpen&&!flips[i])options.onOpen(i,item,card);else if(options.onClose&&flips[i])options.onClose(i,item,card);else flip();
   };
   card.onkeydown=e=>{if(busy)return;if(e.target!==card)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();if(options.onOpen&&!flips[i])options.onOpen(i,item,card);else if(options.onClose&&flips[i])options.onClose(i,item,card);else flip()}};
  });
  function ensure(i,side){const card=cards[i];if(card._built[side])return;card._built[side]=true;const wrap=content(items[i][side],items[i],i);card.querySelector(side==='front'?'.cs-front':'.cs-reverse').appendChild(wrap);observer.observe(wrap);wrap.querySelectorAll('img').forEach(im=>im.addEventListener('load',fit));options.onBuild?.(card,i,side,api)}
  function state(){
   ensure(index,'front');if(flips[index])ensure(index,'back');
   host.dataset.index=index;host.setAttribute('aria-busy',String(busy));previous.disabled=busy||index===0;next.disabled=busy||index===items.length-1;counter.textContent=(index+1)+' / '+items.length;
   cards.forEach((card,i)=>{card.hidden=i!==index;card.inert=i!==index;card.setAttribute('tabindex',i===index?'0':'-1');card.setAttribute('aria-hidden',String(i!==index));card.setAttribute('aria-pressed',String(flips[i]));card.classList.toggle('is-flipped',flips[i]);card.classList.toggle('flipped',flips[i]);card.querySelector('.cs-front').inert=flips[i];card.querySelector('.cs-reverse').inert=!flips[i];card.querySelector('.cs-front').setAttribute('aria-hidden',String(flips[i]));card.querySelector('.cs-reverse').setAttribute('aria-hidden',String(!flips[i]))});fit();
  }
  function fit(){if(!alive||!host.isConnected)return;const card=cards[index],side=card.querySelector(flips[index]?'.cs-reverse .cs-content':'.cs-front .cs-content');const height=Math.max(180,Math.ceil(side.getBoundingClientRect().height));stack.style.setProperty('--cs-height',height+'px')}
  function finish(){if(!alive)return;busy=false;cards.forEach(c=>c.classList.remove('cs-going-next','cs-going-back'));state()}
  function motion(done,direction){
   busy=true;if(!queue.length)queue=shuffle(effects.slice());let effect=queue.pop();if(effect===lastEffect&&queue.length){queue.unshift(effect);effect=queue.pop()}lastEffect=effect;host.dataset.effect=effect;state();
   const outgoing=cards[index];outgoing.classList.add(direction>0?'cs-going-next':'cs-going-back');
   timer=setTimeout(()=>{timer=null;if(!alive)return;outgoing.classList.remove('cs-going-next','cs-going-back');done();},reduced()?0:effect==='slamet'?620:520);
  }
  function go(direction){
   if(busy||!alive||index+direction<0||index+direction>=items.length)return;const old=index,nextIndex=index+direction;
   options.beforeChange?.(nextIndex,old,api);
   motion(()=>{if(options.keepSide)flips[nextIndex]=flips[old];index=nextIndex;finish();options.onChange?.(index,old,api);
    if(!reduced())cards[index].animate([{opacity:.4,transform:'translateY(10px) scale(.97)'},{opacity:1,transform:'none'}],{duration:220,easing:'ease-out'});
   },direction);
  }
  function flip(value){
   if(busy||!alive)return;busy=true;flips[index]=typeof value==='boolean'?value:!flips[index];state();options.onFlip?.(index,flips[index],api);
   timer=setTimeout(()=>{timer=null;finish()},reduced()?0:440);
  }
  function setBack(i,html,open=true){cards[i]._built.back=true;const wrap=content(html,items[i],i);cards[i].querySelector('.cs-reverse').replaceChildren(wrap);observer.observe(wrap);if(index!==i){index=i;state()}flip(open)}
  function dispose(){if(!alive)return;alive=false;clearTimeout(timer);observer.disconnect();host.querySelectorAll('*').forEach(el=>el.getAnimations?.().forEach(a=>a.cancel()));options.onDispose?.();instances.delete(api);if(host._cardDeck===api)delete host._cardDeck}
  const observer=new ResizeObserver(fit);
  previous.onclick=()=>go(-1);next.onclick=()=>go(1);host.onkeydown=e=>{if(e.target.closest('input,textarea,select,[contenteditable=true]'))return;if(e.key==='ArrowRight'){e.preventDefault();e.stopPropagation();go(1)}else if(e.key==='ArrowLeft'){e.preventDefault();e.stopPropagation();go(-1)}};
  state();options.onChange?.(index,-1,api);return api;
 }
 const priorView=setView;setView=function(html){for(const deck of [...instances])deck.dispose();return priorView(html)};
 function image(it){return it.src?cbImg(it):(it.extra||`<span class="stw-word-art">${esc(it.t||'')}</span>`)}
 function paper(media,copy,extra=''){return `<article class="stw-prompt-card stw-board-card ${extra}"><div class="stw-prompt-media">${media}</div>${copy?'<div class="stw-prompt-copy">'+copy+'</div>':''}</article>`}
 function cardsPage(){
  if(CB.task==='how')return DMTF.how();
  const shared=CB.task==='gmj'||CB.task==='intv',items=cbItems();CB.currentItems=items;let deck,counts=items.map(()=>0),sharedStates=items.map(()=>({hidden:true,text:''}));
  setView(`<section class="panel k-card cbpanel cs-question-page"><div class="cbbar"><button class="lvb" id="cbback">← Topics</button><h2>${esc(SPSHORT[CB.task]||'Cards')}</h2><div>${shared?'<button class="lvb" id="cbsharedhint">Hint</button> ':''}<button class="lvb" id="cbnew">New cards</button></div></div>${VCUR&&VG[VCUR.g]?.[1].some(v=>v[0]===CB.task)?vBar():''}<div class="cbh" id="cbsharedh" hidden role="status"></div><div id="cboard"></div></section>`);vBind();
  $('#cbback').onclick=spSetup;$('#cbnew').onclick=renderCards;
  const models=items.map((it,i)=>{
   const caption=(it.qo||it.q)&&it.t===SPSHORT[CB.task]?'':it.t,question=it.qo||it.q||'';
   const front=paper(image(it),it.frontImageOnly?'':`${caption?'<p class="cbt">'+esc(caption)+'</p>':''}${question&&question!==it.t?'<p class="cbq">'+esc(question)+'</p>':''}`);
   let copy='';
   if(it.noHints)copy=`<p class="ownership-context">${esc(it.ownerContext)}</p>${it.backPrompts.map(p=>`<p class="ownership-prompt">${esc(p)}</p>`).join('')}`;
   else if(it.answers)copy='<ul class="interview-answers">'+it.answers.map(a=>'<li>'+esc(a)+'</li>').join('')+'</ul>';
   else{
    copy=(question?'<p class="cbq2">'+esc(question)+'</p>':'')+(it.sharedHints?'<p class="cbt2">'+esc(it.hints?.at(-1)||caption)+'</p>':caption?'<p class="cbt2">'+esc(caption)+'</p>':'');
    const answer=it.a||it.modes?.s?.[1];if(answer)copy+='<p class="cs-model">'+esc(clean(answer))+'</p>';
    if(!shared&&it.hints?.length)copy+='<button type="button" class="lvb cs-item-hint">Hint</button><div class="cbh cs-item-hint-copy" hidden></div>';
   }
   return {front,back:paper(image(it),copy),className:'cbc',data:{i}};
  });
  deck=create($('#cboard'),models,{label:SPSHORT[CB.task],beforeChange:(_,old)=>{sharedStates[old]={hidden:$('#cbsharedh').hidden,text:$('#cbsharedh').textContent}},onChange:i=>{CB.active=i;$('#cbsharedh').hidden=sharedStates[i].hidden;$('#cbsharedh').textContent=sharedStates[i].text},onBuild:(card,i,side)=>{if(side!=='back')return;const b=card.querySelector('.cs-item-hint');if(b)b.onclick=()=>{const box=card.querySelector('.cs-item-hint-copy');box.hidden=!box.hidden;box.textContent=(items[i].hints||[]).join(' ');deck.fit()}}});
  if(shared)$('#cbsharedhint').onclick=()=>{const i=deck.index,lines=items[i].hints||[],box=$('#cbsharedh');box.hidden=false;box.textContent=lines[Math.min(counts[i]++,lines.length-1)]||'Ask a question about the picture.'};
  blobSet(CB.task==='who'?'Turn the picture over and complete both sentences.':'Click the card to turn it over. Next and Back move through the same set.');
 }
 function process(grid){
  if(grid._cardDeck)return;const cards=[...grid.querySelectorAll('.process-card')];
  const items=cards.map(card=>{const front=card.querySelector('.process-front'),back=card.querySelector('.process-back');front.hidden=false;back.hidden=false;return {front,back,className:'process-card',data:{process:card.dataset.process}}});
  grid.classList.remove('process-grid');create(grid,items,{label:'How to?'});
 }
 // All existing table-based card games use the same navigation and flip layer.
 const legacyBoard=mountBoard,legacyFlip=cardFlip,legacyClose=cardClose;
 mountBoard=function(bd,items,onOpen){
  if(!items.length)return legacyBoard(bd,items,onOpen);
  const round=bd.id==='rboard'&&R;
  if(round){round.csKeys=round.csKeys||[];round.csBacks=round.csBacks||[];round.csFlips=round.csFlips||[];items.forEach((it,i)=>{if(round.csKeys[i]!==it.html){round.csKeys[i]=it.html;round.csBacks[i]=null;round.csFlips[i]=false}})}
  const models=items.map((it,i)=>({front:it.html,back:round?.csBacks?.[i]||it.html,className:'cbc '+(it.cls||''),data:{i},source:it}));
  const initial=bd.id==='rboard'?(R.pk>=0?R.pk:R.csIndex||0):0;
  const saveBacks=()=>{if(round)bd._stack?.cards.forEach((card,i)=>{if(round.csBacks[i])round.csBacks[i]=card.querySelector('.cs-reverse .cs-content')?.innerHTML||round.csBacks[i]})};
  const deck=create(bd,models,{initial,initialFlips:round?.csFlips,beforeChange:saveBacks,onOpen:(i,_,node)=>{saveBacks();onOpen?.(i,items[i],node)},onClose:(i,_,node)=>{saveBacks();const done=node.querySelector('.rcx[data-a=done]');if(done&&round){round.pk=i;round.csFlips[i]=false;done.click()}else cardClose(bd,node)},onChange:(i,old,api)=>{if(round){round.csIndex=i;if(old>=0)round.pk=api.flips[i]?i:-1}},onFlip:(i,face,api)=>{if(round){round.csFlips=api.flips.slice();round.pk=face?i:-1}},onBuild:(node,i,side)=>{if(side!=='back'||!round)return;const hb=node.querySelector('#rhint');if(hb)hb.onclick=e=>{e.stopPropagation();const box=node.querySelector('.cbh');box.hidden=!box.hidden;box.textContent=DESCR.join(' ');deck.fit()}}});
  bd._stack=deck;
 };
 cardFlip=function(bd,node,inner,w,h,quick){if(!bd._stack)return legacyFlip(bd,node,inner,w,h,quick);node._o={};const i=+node.dataset.stackCard;if(bd.id==='rboard'&&R)R.csBacks[i]=inner;bd._stack.setBack(i,inner,true)};
 cardClose=function(bd,node){if(!bd._stack)return legacyClose(bd,node);bd._stack.flip(false)};
 renderCards=cardsPage;
 window.CardStacks={create,paper,process,palette,effects,instances};
})();
