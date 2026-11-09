/* A shareable, deterministic game recipe. Live monitoring uses live-answers.js.
   Replay contains only game input events, never executable code or DOM HTML. */
(()=>{
 'use strict';
 let publisherCode=null,lastSharedWatch=null;try{lastSharedWatch=sessionStorage.getItem('stw-last-shared-watch')}catch{}
 const nativeRandom=Math.random,storageKeys=['stw-question-pond-v1','stw-watercolor-appearance-v1','midnight-kitchen-progress-v1','engGames.typewriter'];
 let recipe=null,replaying=false,depth=0,rng=nativeRandom,lastEvent=0,student=false;
 const contexts=new WeakMap();
 const copy=o=>JSON.parse(JSON.stringify(o,(k,v)=>['__proto__','constructor','prototype'].includes(k)?undefined:v));
 const seed=()=>crypto.getRandomValues(new Uint32Array(1))[0];
 function random(n){return ()=>{n|=0;n=n+0x6D2B79F5|0;let t=Math.imul(n^n>>>15,1|n);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}}
 Math.random=()=>rng();
 function settings(){const s=copy(S);delete s.wcode;delete s.rname;return s}
 function begin(route,args){
  if(replaying||depth)return;
  const stores={};for(const k of storageKeys)try{stores[k]=localStorage.getItem(k)}catch{}
  const pond=route==='spOpen'&&/^pond_([a-z0-9]+)_(\d+)$/.exec(args[0]);
  if(pond){try{stores['stw-question-pond-v1']=JSON.stringify(JSON.parse(stores['stw-question-pond-v1']||'[]').filter(f=>f.topic===pond[1]+':'+pond[2]).slice(-8))}catch{stores['stw-question-pond-v1']=null}}
  else delete stores['stw-question-pond-v1'];
  if(!(route==='spOpen'&&args[0]==='app'))delete stores['stw-watercolor-appearance-v1'];
  if(!((route==='go'&&args[0]==='house')||(route==='spOpen'&&args[0]==='wzh')))delete stores['midnight-kitchen-progress-v1'];
  if(route==='go'&&args[0]==='write'){if(TY)stores['engGames.typewriter']=JSON.stringify(TY)}else delete stores['engGames.typewriter'];
  recipe={watch:publisherCode||[...crypto.getRandomValues(new Uint32Array(4))].map(n=>String(n).padStart(10,'0')).join(''),v:1,route,args:copy(args),tab,settings:settings(),stores,seed:seed(),events:[]};rng=random(recipe.seed);lastEvent=performance.now();
 }
 function wrap(fn,route){return function(...args){begin(route,args);depth++;try{return fn.apply(this,args)}finally{depth--;toolbar()}}}
 go=wrap(go,'go');spOpen=wrap(spOpen,'spOpen');gmNew=wrap(gmNew,'gmNew');exSetup=wrap(exSetup,'exSetup');startGame=wrap(startGame,'startGame');
 const baseView=setView;setView=function(html){const result=baseView(html);toolbar();return result};
 const style=document.createElement('style');style.textContent=`.game-share-toolbar{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;align-items:center;max-width:1440px;margin:0 auto 8px;padding:6px 0;min-height:38px}.game-share-toolbar button{background:#CCE5FF!important;color:#70271F!important;border:0!important;border-radius:3px;font:16px/1.2 Georgia,serif!important;padding:10px 15px;cursor:pointer;box-shadow:none!important}.game-share-toolbar output{font:15px Georgia,serif;color:#26422B}.game-share-toolbar input{width:min(500px,60vw);font:14px Georgia,serif}.shared-game-loading{position:fixed;inset:0;z-index:9999;background:#F9F5E6ed;display:grid;place-content:center;color:#70271F;font:24px Georgia,serif;padding:30px;text-align:center}.shared-game-loading button{margin-top:20px;padding:12px;background:#CCE5FF;border:0;color:#70271F;font:18px Georgia,serif}`;document.head.appendChild(style);
 function toolbar(){
  const view=document.getElementById('view');if(!view||tab==='home'||!recipe||ROOM.role==='guest')return;
  if(view.querySelector(':scope>.game-share-toolbar'))return;
  const row=document.createElement('div');row.className='game-share-toolbar';row.dataset.noShareReplay='true';
  const result=document.createElement('output');result.setAttribute('aria-live','polite');
  const b=document.createElement('button');b.type='button';b.textContent='Copy link';b.onclick=async()=>{
   b.disabled=true;result.textContent='';
   try{const url=await getLink();let copied=false;
    try{await navigator.clipboard.writeText(url);copied=true}catch{
     const field=document.createElement('textarea');field.value=url;field.style.cssText='position:fixed;opacity:0';document.body.appendChild(field);field.select();try{copied=document.execCommand('copy')}catch{}field.remove();
    }
    row.querySelector('input')?.remove();
    if(copied)result.textContent='Copied ✓';else{const field=document.createElement('input');field.readOnly=true;field.value=url;field.setAttribute('aria-label','Game link');row.appendChild(field);field.select();result.textContent='Copy this link';}
   }catch(e){result.textContent=e.message||'Could not create link.'}finally{b.disabled=false}
  };row.append(result,b);if(student){const state=document.createElement('span');state.dataset.liveStatus='';state.textContent='Live answers';row.prepend(state)}else{const watch=document.createElement('button');watch.type='button';watch.textContent='See answers';watch.onclick=()=>SharedLive.monitor(lastSharedWatch||recipe.watch);row.appendChild(watch)}view.prepend(row);
 }
 function selector(el,root){
  if(!(el instanceof el.ownerDocument.defaultView.Element))return null;
  const parts=[];
  while(el&&el!==root){
   if(el.id){parts.unshift('#'+CSS.escape(el.id));break}
   const tag=el.localName;if(!tag)return null;
   const siblings=[...el.parentElement.children].filter(n=>n.localName===tag);parts.unshift(tag+':nth-of-type('+(siblings.indexOf(el)+1)+')');el=el.parentElement;
  }
  return parts.join('>');
 }
 function rootFor(win){return win===window?document.getElementById('view'):win.document.body}
 function attach(win,framePath='main'){
  if(contexts.has(win))return;
  const state={rng:random((recipe?.seed||seed())^hash(framePath)),pointer:null};contexts.set(win,state);
  if(win!==window)win.Math.random=()=>state.rng();
  const listen=type=>win.document.addEventListener(type,e=>{
   if(replaying){if(e.isTrusted){e.preventDefault();e.stopImmediatePropagation()}return}if(!recipe||!e.isTrusted)return;
   const root=rootFor(win);let target=e.target;if(type==='keydown'&&!root?.contains(target)&&win===window)target=root?.querySelector('.tyst')||target;if(!root?.contains(target)||target.closest('[data-no-share-replay]')||target.closest('input[type=file],input[type=password],a[href],.rmwrap,#wvpanel,#download,[download]'))return;
   if(type==='pointermove'&&!state.pointer)return;
   if(type==='keydown'&&(['Tab','Shift','Control','Alt','Meta','Escape'].includes(e.key)||e.ctrlKey||e.metaKey))return;
   if(type==='click'&&target.closest('input,textarea,select'))return;
   const path=selector(target,root);if(!path)return;
   const now=performance.now(),event={type,path,frame:framePath,seed:seed(),wait:Math.min(2500,Math.max(0,Math.round(now-lastEvent)))};
   if(type==='input'||type==='change'){event.value=target.value;event.checked=!!target.checked}
   if(type==='keydown'){event.key=e.key;event.code=e.code;event.shiftKey=e.shiftKey}
   if(type.startsWith('pointer')){
    const r=target.getBoundingClientRect();event.x=r.width?(e.clientX-r.left)/r.width:.5;event.y=r.height?(e.clientY-r.top)/r.height:.5;event.button=e.button;event.pointerId=e.pointerId;event.pointerType=e.pointerType;
    if(type==='pointerdown')state.pointer={last:0};
    if(type==='pointermove'){if(now-state.pointer.last<32)return;state.pointer.last=now}
    if(type==='pointerup'||type==='pointercancel')state.pointer=null;
   }
   // Each event gets its own stream, so decorative animation does not change tasks.
   if(win===window)rng=random(event.seed);else state.rng=random(event.seed);
   lastEvent=now;recipe.events.push(event);
  },true);
  ['click','input','change','keydown','pointerdown','pointermove','pointerup','pointercancel','dragstart','drop','dragend'].forEach(listen);
 }
 function hash(s){let n=2166136261;for(const c of s)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0}
 function attachFrame(win){
  try{if(win.location.origin!==location.origin)return;attach(win,win.location.pathname)}catch{}
 }
 attach(window);
 async function getLink(){
  if(!recipe)throw Error('Open a game first.');
  if(recipe.events.length>5000)throw Error('This session is too long. Start a fresh round before copying.');
  const data=copy(recipe);data.tab=recipe.tab;
  const token=await encodeCfg(data);if(token.length>90000)throw Error('This session is too long. Start a fresh round before copying.');
  if(!student){lastSharedWatch=data.watch;try{sessionStorage.setItem('stw-last-shared-watch',data.watch)}catch{}}
  return location.href.split('#')[0]+'#play='+token;
 }
 const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 async function waitFor(fn,ms=15000){const start=performance.now();while(performance.now()-start<ms){const value=fn();if(value)return value;await delay(40)}throw Error('This game has changed. Ask for a new link.');}
 async function decodeShared(token){
  if(!/^[jz][A-Za-z0-9_-]+$/.test(token))throw Error('This game link is incomplete.');
  const bytes=unb64u(token.slice(1));let stream=new Blob([bytes]).stream();
  if(token[0]==='z')stream=stream.pipeThrough(new DecompressionStream('deflate-raw'));
  const reader=stream.getReader(),parts=[];let size=0;
  for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>2000000){await reader.cancel();throw Error('This game link is too large.')}parts.push(value)}
  return JSON.parse(await new Blob(parts).text());
 }
 function valid(data){
  if(!data||data.v!==1||!['go','spOpen','gmNew','exSetup','startGame'].includes(data.route)||!Array.isArray(data.args)||data.args.length>3||!Number.isInteger(data.seed)||!data.settings||Array.isArray(data.settings)||!NAV.concat('home','speak').includes(data.tab)||!Array.isArray(data.events)||data.events.length>5000)throw Error('This game link is incomplete.');
  if(data.watch&&(!/^[0-9]{20,50}$/.test(data.watch)))throw Error('Invalid live session.');
  if(data.route==='go'&&!NAV.concat('home','speak').includes(data.args[0]))throw Error('Unknown game.');
  if(data.route==='spOpen'&&!SPT.some(t=>t.id===data.args[0])&&!Object.hasOwn(DMT,data.args[0])&&!Object.values(SPGRP).some(gs=>gs.some(g=>g[1].includes(data.args[0]))))throw Error('Unknown exercise.');
  if(data.route==='startGame'&&(!Object.hasOwn(GAMES,data.args[0])||REMOVED_GAMES.has(data.args[0])))throw Error('Unknown game.');
  if(data.route==='gmNew'&&!GLMODES.some(m=>m[0]===data.settings.gmode))throw Error('Unknown game mode.');
  for(const e of data.events)if(!['click','input','change','keydown','pointerdown','pointermove','pointerup','pointercancel','dragstart','drop','dragend'].includes(e.type)||typeof e.path!=='string'||e.path.length>2000||typeof e.frame!=='string'||e.frame.length>300||!Number.isInteger(e.seed)||!Number.isFinite(e.wait)||e.wait<0||e.wait>2500)throw Error('This game link is incomplete.');
 }
 async function restore(token){
  const cover=document.createElement('div');cover.className='shared-game-loading';cover.textContent='Opening your game…';document.body.appendChild(cover);replaying=true;
  try{
   if(token.length>90000)throw Error('This game link is too long.');
   const data=copy(await decodeShared(token));valid(data);recipe=data;student=true;publisherCode=data.watch||null;
   S=Object.assign(copy(DEF),data.settings);delete S.wcode;delete S.rname;
   for(const k of storageKeys)try{const v=data.stores?.[k];if(v===null)localStorage.removeItem(k);else if(typeof v==='string'&&v.length<200000)localStorage.setItem(k,v)}catch{}
   rng=random(data.seed);tab=data.tab;
   if(data.route==='spOpen'&&data.tab==='gram')window.openSharedGrammar(data.args[0],S.splevel);
   else if(data.route==='spOpen'){go('speak');rng=random(data.seed);spOpen(data.args[0])}
   else if(data.route==='go')go(data.args[0]);
   else if(data.route==='gmNew'){go('gram');Object.assign(S,copy(data.settings));rng=random(data.seed);gmNew()}
   else if(data.route==='exSetup'){go('gram');Object.assign(S,copy(data.settings));rng=random(data.seed);exSetup()}
   else startGame(data.args[0]);
   let transfer=new DataTransfer();
   for(const e of data.events){
    await delay(e.wait);
    const win=await waitFor(()=>e.frame==='main'?window:[...document.querySelectorAll('#view iframe')].map(f=>f.contentWindow).find(w=>{try{return w.location.pathname===e.frame&&w.document.readyState==='complete'}catch{return false}}));
    const root=rootFor(win),el=await waitFor(()=>root?.querySelector(e.path));
    if(el.closest('[data-no-share-replay],input[type=file],input[type=password],a[href],.rmwrap,#wvpanel,#download,[download]'))throw Error('Unsupported game action.');
    if(win===window)rng=random(e.seed);else{attachFrame(win);contexts.get(win).rng=random(e.seed)}
    if(e.type==='input'||e.type==='change'){el.value=String(e.value??'');if('checked'in el)el.checked=e.checked;el.dispatchEvent(new win.Event(e.type,{bubbles:true}));}
    else if(e.type==='keydown'){el.focus();el.dispatchEvent(new win.KeyboardEvent('keydown',{key:e.key,code:e.code,shiftKey:e.shiftKey,bubbles:true,cancelable:true}));}
    else if(e.type.startsWith('pointer')){
     const r=el.getBoundingClientRect();const capture=win.Element.prototype.setPointerCapture,release=win.Element.prototype.releasePointerCapture;
     win.Element.prototype.setPointerCapture=function(id){try{return capture.call(this,id)}catch{}};
     win.Element.prototype.releasePointerCapture=function(id){try{return release.call(this,id)}catch{}};cover.style.pointerEvents='none';
     try{el.dispatchEvent(new win.PointerEvent(e.type,{clientX:r.left+r.width*e.x,clientY:r.top+r.height*e.y,button:e.button||0,buttons:e.type==='pointerup'?0:1,pointerId:e.pointerId||1,pointerType:e.pointerType||'mouse',bubbles:true,cancelable:true}));}finally{win.Element.prototype.setPointerCapture=capture;win.Element.prototype.releasePointerCapture=release;cover.style.pointerEvents=''}
    }else if(['dragstart','drop','dragend'].includes(e.type)){el.dispatchEvent(new win.DragEvent(e.type,{bubbles:true,cancelable:true,dataTransfer:transfer}));if(e.type==='dragend')transfer=new DataTransfer()}
    else el.dispatchEvent(new win.MouseEvent('click',{bubbles:true,cancelable:true,view:win}));
   }
   cover.remove();replaying=false;lastEvent=performance.now();toolbar();window.scrollTo(0,0);if(data.watch)SharedLive.publish(data.watch);
  }catch(e){replaying=false;cover.textContent=e.message||'Could not open this game link.';const back=document.createElement('button');back.textContent='Back to games';back.onclick=()=>{cover.remove();history.replaceState(null,'',location.pathname);go('home')};cover.appendChild(back);console.warn('Shared game:',e)}
 }
 window.SharedGame={getLink,restore,attachFrame,get replaying(){return replaying},get isStudent(){return student},get eventCount(){return recipe?.events.length||0}};
})();
