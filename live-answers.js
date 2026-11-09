/* Read-only, encrypted student screens over the site's existing Firestore service.
   BroadcastChannel also supports a teacher and pupil in tabs on the same device. */
(()=>{
 'use strict';
 const encoder=new TextEncoder(),decoder=new TextDecoder();let publisher=null,viewer=null;
 const hex=b=>[...new Uint8Array(b)].map(n=>n.toString(16).padStart(2,'0')).join('');
 async function context(code){
  const digest=await crypto.subtle.digest('SHA-256',encoder.encode('stw-live:'+code));
  return {id:hex(digest).slice(0,32),key:await crypto.subtle.importKey('raw',digest,'AES-GCM',false,['encrypt','decrypt'])};
 }
 async function seal(ctx,data){
  let raw=encoder.encode(JSON.stringify(data)),z=0;
  if(window.CompressionStream){raw=new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());z=1}
  const iv=crypto.getRandomValues(new Uint8Array(12)),encrypted=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},ctx.key,raw)),out=new Uint8Array(13+encrypted.length);out[0]=z;out.set(iv,1);out.set(encrypted,13);return wvB64(out);
 }
 async function unseal(ctx,value){
  const data=wvUn(value);let raw=await crypto.subtle.decrypt({name:'AES-GCM',iv:data.slice(1,13)},ctx.key,data.slice(13));
  if(data[0])raw=await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  return JSON.parse(decoder.decode(raw));
 }
 function head(doc){return [...doc.querySelectorAll('style,link[rel=stylesheet]')].map(e=>{const n=e.cloneNode(true);if(n.tagName==='LINK')n.href=e.href;return n.outerHTML}).join('')}
 function clone(root,depth=0){
  const doc=root.ownerDocument,c=root.cloneNode(true),src=[root,...root.querySelectorAll('*')],dst=[c,...c.querySelectorAll('*')];
  src.forEach((e,i)=>{
   const d=dst[i];if(!d)return;
   const assets=doc.defaultView?.SharedLiveAssetMap;for(const a of ['src','href','xlink:href']){const source=e.getAttribute(a);if(source&&assets?.has(source))d.setAttribute(a,assets.get(source))}
   for(const a of [...d.attributes])if(/^on/i.test(a.name)||a.name==='autofocus')d.removeAttribute(a.name);
   if(e.matches('textarea'))d.textContent=e.value;
   else if(e.matches('input')){d.setAttribute('value',e.value);d.toggleAttribute('checked',e.checked)}
   else if(e.matches('select'))[...d.options].forEach((o,j)=>o.toggleAttribute('selected',e.selectedIndex===j));
   else if(e.matches('canvas'))try{const im=doc.createElement('img');im.src=e.toDataURL();im.setAttribute('style',d.getAttribute('style')||'');im.className=d.className;im.width=e.width;im.height=e.height;im.style.maxWidth='100%';im.style.height='auto';d.replaceWith(im)}catch{d.remove()}
   else if(e.matches('iframe')){
    try{if(depth>1||e.contentWindow.location.origin!==location.origin||!e.contentDocument.body){d.remove();return}
     const inner=e.contentDocument;d.removeAttribute('src');d.setAttribute('sandbox','allow-same-origin');d.srcdoc=documentHTML(inner,clone(inner.body,depth+1).innerHTML,inner.body.className,true);
    }catch{d.remove()}
   }
  });
  c.querySelectorAll('script,object,embed,audio,video,[data-no-share-replay],input[type=password],input[type=file]').forEach(e=>e.remove());
  return c;
 }
 function documentHTML(doc,html,cls,body=false){
  const base=doc.createElement('base');base.href=doc.baseURI;
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+base.outerHTML+head(doc)+'</head><body class="'+cls.replace(/[^\w -]/g,'')+'">'+(body?html:'<main id="view">'+html+'</main>')+'</body></html>';
 }
 function snapshot(){
  const view=document.getElementById('view');if(!view)return null;
  const h=clone(view).innerHTML;
  return {sid:sessionId,name:'Student '+sessionId.slice(0,3),ts:Date.now(),html:documentHTML(document,h,document.body.className),width:Math.max(document.documentElement.clientWidth,view.scrollWidth),height:Math.max(view.scrollHeight+view.offsetTop+40,innerHeight),task:(typeof SPSHORT!=='undefined'&&SPSHORT[BLOBID])||document.querySelector('#view h1,#view h2,#view h3')?.getAttribute('aria-label')||'Game',level:S.splevel||''};
 }
 const sessionId=(()=>{try{let id=sessionStorage.getItem('stw-live-student');if(!id){id=hex(crypto.getRandomValues(new Uint8Array(8)));sessionStorage.setItem('stw-live-student',id)}return id}catch{return hex(crypto.getRandomValues(new Uint8Array(8)))}})();
 const timeout=p=>Promise.race([p,new Promise((_,reject)=>setTimeout(()=>reject(Error('Connection timed out')),12000))]);
 async function publish(code){
  if(publisher?.code===code)return;
  publisher?.close();const ctx=await context(code);let disposed=false,busy=false,timer=null,ref=null,lastAt=0;
  const bc=window.BroadcastChannel?new BroadcastChannel('stw-live-'+ctx.id):null,observers=[],documents=[],listening=new WeakSet();
  const status=t=>{document.querySelectorAll('[data-live-status]').forEach(e=>e.textContent=t)};
  const send=async()=>{
   if(disposed||busy)return;busy=true;lastAt=Date.now();
   try{const data=snapshot();if(!data)return;const w=await seal(ctx,data);if(w.length>950000){status('Screen is too large to share');return}
    const packet={w,ts:data.ts};bc?.postMessage(packet);
    if(ref){await timeout(ref.set(packet));status('Live answers connected')}
   }catch(e){status('Live connection interrupted — reconnecting…');console.warn('Live answers:',e)}finally{busy=false}
  };
  const schedule=()=>{if(disposed||timer)return;timer=setTimeout(()=>{timer=null;send()},Math.max(200,1000-(Date.now()-lastAt)))};
  function watch(win){
   if(listening.has(win))return;listening.add(win);
   try{const root=win===window?document.getElementById('view'):win.document.body;if(!root)return;
    const observer=new MutationObserver(changes=>{if(changes.every(c=>(c.target.nodeType===1?c.target:c.target.parentElement)?.closest('[data-no-share-replay]')))return;schedule();frames()});observer.observe(root,{childList:true,subtree:true,attributes:true,characterData:true});observers.push(observer);
    documents.push(win.document);for(const event of ['input','change','click','pointerup','keyup'])win.document.addEventListener(event,schedule,true);
   }catch{}
  }
  function frames(){for(const f of document.querySelectorAll('#view iframe'))try{if(f.contentDocument?.readyState==='complete')watch(f.contentWindow);else f.addEventListener('load',()=>watch(f.contentWindow),{once:true})}catch{}}
  watch(window);frames();bc&&(bc.onmessage=e=>{if(e.data?.hello)schedule()});
  const heartbeat=setInterval(()=>{frames();send()},15000);
  const connect=async()=>{
   try{const db=await timeout(fbLoad());if(disposed)return;ref=db.collection('watch').doc('live-'+ctx.id).collection('s').doc(sessionId);status('Live answers connected');send()}
   catch(e){if(disposed)return;status('Live answers offline — retrying…');retry=setTimeout(connect,15000)}
  };
  let retry=null;publisher={code,close(){disposed=true;clearTimeout(timer);clearTimeout(retry);clearInterval(heartbeat);observers.forEach(o=>o.disconnect());bc?.close();for(const doc of documents)for(const event of ['input','change','click','pointerup','keyup'])doc.removeEventListener(event,schedule,true)}};
  status('Connecting live answers…');connect();schedule();
 }
 async function monitor(code){
  viewer?.close();const ctx=await context(code),panel=document.createElement('section');panel.className='live-answer-panel';panel.setAttribute('aria-label','Student answers');
  panel.innerHTML='<div class="live-answer-header"><h2>Student answers</h2><span role="status">Connecting…</span><button type="button">Close</button></div><p class="live-answer-empty">Send Copy link to your student. Their screen and answers will appear here.</p><div class="live-answer-screens"></div>';
  document.body.appendChild(panel);const grid=panel.querySelector('.live-answer-screens'),status=panel.querySelector('[role=status]'),tiles=new Map();let disposed=false,unsubscribe=null,retry=null;
  const bc=window.BroadcastChannel?new BroadcastChannel('stw-live-'+ctx.id):null;
  const receive=async packet=>{
   if(disposed||!packet?.w)return;
   try{const data=await unseal(ctx,packet.w);if(disposed||Date.now()-data.ts>3600000)return;
    let tile=tiles.get(data.sid);if(tile&&tile.time>=data.ts)return;
    if(!tile){const el=document.createElement('article');el.className='live-answer-tile';const caption=document.createElement('p'),stage=document.createElement('div'),frame=document.createElement('iframe');stage.className='live-answer-stage';frame.setAttribute('sandbox','allow-same-origin');frame.title='Read-only student screen';stage.appendChild(frame);el.append(caption,stage);grid.appendChild(el);tile={el,caption,stage,frame,time:0};tiles.set(data.sid,tile)}
    tile.time=data.ts;tile.width=Math.max(320,Math.min(2400,data.width||1200));tile.height=Math.max(300,Math.min(12000,data.height||900));tile.caption.textContent=data.name+' · '+(data.level?data.level.toUpperCase()+' · ':'')+data.task;
    tile.frame.srcdoc=data.html;tile.frame.style.cssText=`width:${tile.width}px;height:${tile.height}px;border:0;pointer-events:none;transform-origin:top left`;
    layout();panel.querySelector('.live-answer-empty').hidden=true;status.textContent='Live · updated just now';
   }catch(e){status.textContent='Could not read an update';console.warn('Live screen:',e)}
  };
  function layout(){for(const t of tiles.values()){const scale=t.stage.clientWidth/t.width;t.frame.style.transform=`scale(${scale})`;t.stage.style.height=Math.min(6000,t.height*scale)+'px'}}
  const resize=new ResizeObserver(layout);resize.observe(grid);
  if(bc){bc.onmessage=e=>receive(e.data);bc.postMessage({hello:true})}
  const connect=async()=>{try{const db=await timeout(fbLoad());if(disposed)return;unsubscribe=db.collection('watch').doc('live-'+ctx.id).collection('s').onSnapshot(q=>{if(!disposed){status.textContent=tiles.size?'Live':'Connected · waiting for your student';q.docChanges().forEach(c=>{if(c.type!=='removed')receive(c.doc.data())})}},()=>{status.textContent='Connection interrupted — reconnecting…';unsubscribe?.();retry=setTimeout(connect,10000)})}catch(e){if(!disposed){status.textContent=tiles.size?'Local connection · cloud offline':'Connection unavailable — retrying…';retry=setTimeout(connect,15000)}}};
  const heartbeat=setInterval(()=>{for(const t of tiles.values()){t.el.classList.toggle('live-stale',Date.now()-t.time>45000);if(Date.now()-t.time>45000)status.textContent='Waiting for the next update…'}},5000);
  viewer={close(){disposed=true;unsubscribe?.();clearTimeout(retry);clearInterval(heartbeat);resize.disconnect();bc?.close();panel.remove();viewer=null}};
  panel.querySelector('button').onclick=()=>viewer?.close();connect();
 }
 const style=document.createElement('style');style.textContent='.live-answer-panel{position:fixed;inset:0;z-index:5000;overflow:auto;padding:24px;background:#F9F5E6;color:#70271F;font-family:Georgia,serif}.live-answer-header{display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-bottom:20px}.live-answer-header h2{font:32px Georgia,serif;margin:0}.live-answer-header button{margin-left:auto;border:0;background:#CCE5FF;color:#70271F;padding:12px 22px;font:18px Georgia,serif;cursor:pointer}.live-answer-header [role=status]{color:#26422B}.live-answer-screens{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(480px,100%),1fr));gap:24px}.live-answer-tile{min-width:0;background:#fff;padding:12px}.live-answer-tile>p{margin:0 0 12px}.live-answer-stage{width:100%;overflow:auto}.live-answer-tile.live-stale{opacity:.65}.live-answer-stage iframe{display:block}.game-share-toolbar [data-live-status]{font:14px Georgia,serif;color:#26422B}';document.head.appendChild(style);
 window.SharedLive={publish,monitor,snapshot,stop:()=>{publisher?.close();publisher=null}};
})();
