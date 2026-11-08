/* Prepared rooms with side palettes and one visible instruction at a time. */
const ROOM_WORKSHOP={
 living:{furniture:['sofa','armchair','ctable','bookcase','floorlamp','plant','clock','rug2'],objects:['cat','books','newspaper','flowers','radio'],base:[['bookcase',15,82,.75],['sofa',49,86,.95],['armchair',85,88,.95],['ctable',49,98,.9],['floorlamp',73,84,.85],['plant',8,96,.8],['clock',50,28,.7]],tasks:[['cat','on','sofa'],['cat','under','ctable'],['cat','between','sofa','armchair']]},
 bedroom:{furniture:['bed','wardrobe','nstand','chair2','shelf','mirror','rug2','plant'],objects:['books','toys','cat','phone','camera'],base:[['wardrobe',15,84,.75],['bed',49,94,.72],['nstand',74,90,.62],['chair2',89,98,.65],['mirror',73,40,.8],['plant',9,98,.7]],tasks:[['books','on','bed'],['toys','next to','bed'],['cat','under','chair2']]},
 kitchen:{furniture:['fridge','stove','cupboard','table','chair1','chair2','clock','plant'],objects:['apples','carrots','cookies','latte','tea'],base:[['fridge',13,85,.9],['stove',35,85,.9],['cupboard',84,85,.78],['table',57,96,.95],['chair1',40,98,.6],['chair2',75,98,.6],['clock',57,28,.75]],tasks:[['apples','on','table'],['carrots','next to','fridge'],['cookies','on','table']]},
 bathroom:{furniture:['bath','sinkm','toilet','wshelf','hamper','mirror','towel2','plant'],objects:['soap','shampoo','sponge','tbrush','cream'],base:[['bath',27,92,.8],['sinkm',65,87,.85],['toilet',86,95,.8],['wshelf',26,38,.9],['hamper',9,98,.75],['plant',50,94,.7]],tasks:[['soap','on','wshelf'],['shampoo','next to','sinkm'],['sponge','on','bath']]},
 study:{furniture:['desk','ochair','bookcase','floorlamp','plant','shelf','clock','rug2'],objects:['books','cat','phone','camera','newspaper'],base:[['desk',44,87,.85],['ochair',44,99,.65],['bookcase',84,83,.72],['floorlamp',18,87,.9],['plant',9,97,.75],['clock',49,27,.75]],tasks:[['books','on','desk'],['cat','under','desk'],['plant','next to','bookcase']]}
};
const ROOM_SESSIONS={};let ROOM_MODE='task';
function roomTaskLine(t){return 'Put the '+RMI[t[0]][0]+' '+t[1]+' the '+RMI[t[2]][0]+(t[3]?' and the '+RMI[t[3]][0]:'')+'.'}
function roomTaskCorrect(items,r,t){
 const a=items.find(o=>o.k===t[0]),b=items.find(o=>o.k===t[2]);if(!a||!b)return false;
 const A=rmBox(a,r.ar),B=rmBox(b,r.ar);
 if(t[1]==='next to')return Math.abs(A.b-B.b)<Math.max(A.h,B.h)*.5+3&&((A.r<=B.l+2&&A.r>=B.l-12)||(A.l>=B.r-2&&A.l<=B.r+12));
 if(t[1]==='between'){const c=items.find(o=>o.k===t[3]);if(!c)return false;const C=rmBox(c,r.ar),left=B.cx<C.cx?B:C,right=B.cx<C.cx?C:B;return A.cx>left.r-1&&A.cx<right.l+1&&Math.abs(A.b-Math.max(B.b,C.b))<8}
 return rmRel(A,B,t[1]);
}
function solveRoomTask(items,r,t){
 let a=items.find(o=>o.k===t[0]);if(!a){a={k:t[0],x:50,y:65,s:.65,f:0,z:30};items.push(a)}
 const b=items.find(o=>o.k===t[2]),B=rmBox(b,r.ar);a.s=.65;
 let A=rmBox(a,r.ar),x=B.cx,bottom=B.b;
 if(t[1]==='on'){bottom=B.t+B.h*(SEATK.includes(b.k)?.38:(SURF[b.k]??.1));a.z=b.z+2}
 else if(t[1]==='under'){bottom=B.b-1;a.z=b.z-1}
 else if(t[1]==='next to'){x=B.r+A.w/2+3;if(x+A.w/2>98)x=B.l-A.w/2-3;a.z=b.z+1}
 else if(t[1]==='between'){const c=items.find(o=>o.k===t[3]),C=rmBox(c,r.ar),left=B.cx<C.cx?B:C,right=B.cx<C.cx?C:B;const gap=right.l-left.r;a.s=Math.min(.65,Math.max(.25,gap*.8/RMI[a.k][1]));A=rmBox(a,r.ar);x=(left.r+right.l)/2;bottom=Math.max(B.b,C.b);a.z=Math.max(b.z,c.z)+1}
 a.x=x;a.y=bottom-A.h/2;
}
async function roomWorkshop(){
 if(!ROOM_WORKSHOP[S.rmroom])S.rmroom='living';const r=RMR.find(x=>x.id===S.rmroom),cfg=ROOM_WORKSHOP[r.id];
 const state=ROOM_SESSIONS[r.id]||(ROOM_SESSIONS[r.id]={set:0,task:0,items:null});let selected=null,words=false;
 const palette=(keys,label)=>`<aside class="room-palette" aria-label="${label}"><p>${label}</p>${keys.map(k=>`<button class="room-choice" data-room-item="${k}" aria-label="Add ${RMI[k][0]}"><img src="${rmSrc(k)}" alt="" draggable="false"><span>${RMI[k][0]}</span></button>`).join('')}</aside>`;
 setView(`<section class="panel k-card cbpanel room-workshop"><div class="cbbar"><button class="lvb" id="roomBack">← Topics</button><h2>Furnish a room</h2><div><button class="lvb" id="roomSet">Room set ${state.set+1}</button></div></div><p class="muted small">Choose a room. Click furniture in the side panels to add it, then drag it. Select an item to resize, flip or remove it.</p><div class="room-tabs">${Object.keys(ROOM_WORKSHOP).map(id=>`<button class="lvb${id===r.id?' on':''}" data-room="${id}">${RMR.find(x=>x.id===id).n}</button>`).join('')}</div><div class="room-modes">${[['task','Task card'],['rnd','Set randomly'],['free','Free design']].map(([id,label])=>`<button class="lvb${id===ROOM_MODE?' on':''}" data-room-mode="${id}">${label}</button>`).join('')}</div><div class="room-task-card" ${ROOM_MODE==='free'?'hidden':''}><p id="roomInstruction"></p><div><button class="lvb" id="roomCheck">Check</button> <button class="lvb" id="roomSolution">Show solution</button> <button class="lvb" id="roomNext">${ROOM_MODE==='rnd'?'Set randomly':'New task'}</button></div><p id="roomFeedback" role="status"></p></div><div class="room-workspace">${palette(cfg.furniture,'Furniture')}<div class="room-center"><div class="rmst" id="roomStage" style="aspect-ratio:${r.ar}">${rmBg(r)}</div><div class="room-edit-controls"><button class="lvb" id="roomSmaller">− smaller</button><button class="lvb" id="roomBigger">+ bigger</button><button class="lvb" id="roomFlip">Flip</button><button class="lvb" id="roomRemove">Remove</button><button class="lvb" id="roomWords">Show words</button></div></div>${palette(cfg.objects,'Objects')}</div></section>`);
 const page=$('#view .room-workshop'),stage=$('#roomStage');
 $('#roomBack').onclick=spSetup;
 page.querySelectorAll('[data-room]').forEach(b=>b.onclick=()=>{S.rmroom=b.dataset.room;save();roomWorkshop()});
 page.querySelectorAll('[data-room-mode]').forEach(b=>b.onclick=()=>{ROOM_MODE=b.dataset.roomMode;roomWorkshop()});
 await Promise.all([...new Set([...cfg.furniture,...cfg.objects])].map(k=>rmAr(k)));if(!page.isConnected)return;
 const preset=()=>cfg.base.map(([k,x,bottom,s],i)=>{const w=RMI[k][1]*s,h=w*RMAR[k]*r.ar;return {k,x:state.set?100-x:x,y:bottom-h/2,s,f:0,z:10+i}});
 if(!state.items)state.items=preset();
 const task=()=>cfg.tasks[state.task%cfg.tasks.length];
 const clamp=o=>{const b=rmBox(o,r.ar);o.x=Math.max(b.w/2+1,Math.min(99-b.w/2,o.x));o.y=Math.max(b.h/2+1,Math.min(99-b.h/2,o.y))};
 const feedback=text=>{$('#roomFeedback').textContent=text};
 function draw(){stage.querySelectorAll('.rmi').forEach(el=>el.remove());state.items.forEach(o=>{
  const el=document.createElement('div');el.className='rmi'+(selected===o?' sel':'');el.dataset.key=o.k;el.setAttribute('role','button');el.tabIndex=0;el.setAttribute('aria-label',RMI[o.k][0]);
  el.style.cssText=`left:${o.x}%;top:${o.y}%;width:${RMI[o.k][1]*o.s}%;z-index:${o.z}`;el.innerHTML=`<img src="${rmSrc(o.k)}" alt="" draggable="false" style="transform:scaleX(${o.f?-1:1})">${words?`<span class="rmlb">${RMI[o.k][0]}</span>`:''}`;stage.append(el);
  let start=null;
  const select=()=>{selected=o;stage.querySelectorAll('.rmi').forEach(e=>e.classList.toggle('sel',e===el))};
  el.onpointerdown=e=>{if(e.button!==0)return;select();start={x:e.clientX,y:e.clientY,ox:o.x,oy:o.y};el.setPointerCapture(e.pointerId)};
  el.onpointermove=e=>{if(!start)return;o.x=start.ox+(e.clientX-start.x)/stage.clientWidth*100;o.y=start.oy+(e.clientY-start.y)/stage.clientHeight*100;clamp(o);el.style.left=o.x+'%';el.style.top=o.y+'%';feedback('')};
  el.onpointerup=()=>{if(start){o.x=Math.round(o.x*2)/2;o.y=Math.round(o.y*2)/2;start=null;el.style.left=o.x+'%';el.style.top=o.y+'%'}};el.onpointercancel=()=>{start=null};
  el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select()}if(e.key.startsWith('Arrow')){e.preventDefault();select();o.x+=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;o.y+=e.key==='ArrowDown'?1:e.key==='ArrowUp'?-1:0;clamp(o);draw();stage.querySelector(`[data-key="${o.k}"]`)?.focus()}};
 })}
 const instruction=()=>{$('#roomInstruction').textContent=ROOM_MODE==='rnd'?'Where '+(['books','apples','toys','carrots','cookies'].includes(task()[0])?'are':'is')+' the '+RMI[task()[0]][0]+'?':roomTaskLine(task())};
 const prepare=()=>{selected=null;state.items=preset();if(ROOM_MODE==='rnd')solveRoomTask(state.items,r,task());draw();instruction();feedback('')};
 page.querySelectorAll('[data-room-item]').forEach(b=>b.onclick=()=>{const k=b.dataset.roomItem;selected=state.items.find(o=>o.k===k);if(!selected){selected={k,x:50,y:75,s:.7,f:0,z:40};clamp(selected);state.items.push(selected)}draw();feedback('')});
 $('#roomSet').onclick=()=>{state.set=1-state.set;state.items=null;roomWorkshop()};
 $('#roomSmaller').onclick=()=>{if(selected){selected.s=Math.max(.3,selected.s*.9);clamp(selected);draw()}};$('#roomBigger').onclick=()=>{if(selected){const prev=selected.s;selected.s=Math.min(1.3,selected.s*1.1);const b=rmBox(selected,r.ar);if(b.h>96||b.w>96)selected.s=prev;clamp(selected);draw()}};
 $('#roomFlip').onclick=()=>{if(selected){selected.f=1-selected.f;draw()}};$('#roomRemove').onclick=()=>{if(selected){state.items=state.items.filter(o=>o!==selected);selected=null;draw()}};$('#roomWords').onclick=()=>{words=!words;draw()};
 $('#roomCheck').hidden=ROOM_MODE!=='task';$('#roomCheck').onclick=()=>feedback(roomTaskCorrect(state.items,r,task())?'Correct! Read your sentence aloud.':'Look at the instruction and move the object.');
 $('#roomSolution').textContent=ROOM_MODE==='rnd'?'Show answer':'Show solution';$('#roomSolution').onclick=()=>{if(ROOM_MODE==='task'){solveRoomTask(state.items,r,task());draw()}const t=task(),plural=['books','apples','toys','carrots','cookies'].includes(t[0]);feedback('The '+RMI[t[0]][0]+(plural?' are ':' is ')+t[1]+' the '+RMI[t[2]][0]+(t[3]?' and the '+RMI[t[3]][0]:'')+'.')};
 $('#roomNext').onclick=()=>{state.task=(state.task+1)%cfg.tasks.length;prepare()};
 if(ROOM_MODE==='rnd')solveRoomTask(state.items,r,task());draw();instruction();
}
DMTF.rmp=roomWorkshop;DMTF.room=roomWorkshop;
