(() => {
  'use strict';
  const rooms = {
    bedroom: [['books','on','bed'], ['toys','next to','bed'], ['cat','under','chair2']],
    living: [['cat','on','sofa'], ['cat','under','ctable'], ['cat','between','sofa','armchair']],
    bathroom: [['sponge','in','bath'], ['soap','on','wshelf'], ['shampoo','next to','sinkm']],
  };
  let room = 'bedroom', round = 0;
  async function open() {
    S.splevel = 'kids';
    const r = RMR.find(item => item.id === room);
    const config = ROOM_WORKSHOP[room], tasks = rooms[room];
    const task = tasks[round], [object, relation, furniture, other] = task;
    setView(`<section class="kp-game" data-practice-level="kids"><header><button type="button" id="kpBack">Topics</button><h1>Put it in the room</h1></header>
      <nav aria-label="Choose a room">${Object.keys(rooms).map(id=>`<button type="button" data-kp-room="${id}" aria-pressed="${id===room}">${esc(RMR.find(x=>x.id===id).n)}</button>`).join('')}</nav>
      <h2>${esc(roomTaskLine(task))}</h2>
      <div class="rmst kp-stage" id="kpStage" style="aspect-ratio:${r.ar}">${rmBg(r)}</div>
      <div class="kp-controls"><button type="button" id="kpObject" disabled aria-pressed="false"><img src="${rmSrc(object)}" alt="" draggable="false">${esc(RMI[object][0])}</button>
      <button type="button" id="kpShow" disabled>Show answer</button><button type="button" id="kpNext">Next</button></div>
      <p id="kpStatus" role="status">Drag the object, or tap it and then tap a spot.</p></section>`);
    const root=$('.kp-game'),stage=$('#kpStage'), source=$('#kpObject'),status=$('#kpStatus');
    $('#kpBack').onclick=()=>{S.glevel='kids';go('gram')};
    $('#kpNext').onclick=()=>{round=(round+1)%tasks.length;open()};
    root.querySelectorAll('[data-kp-room]').forEach(b=>b.onclick=()=>{room=b.dataset.kpRoom;round=0;open()});
    await Promise.all([...new Set([object,...config.base.map(([key])=>key)])].map(rmAr));
    if(!root.isConnected)return;
    source.disabled=false; $("#kpShow").disabled=false;
    const items=config.base.map(([k,x,bottom,s],i)=>({k,x,y:bottom-RMI[k][1]*s*RMAR[k]*r.ar/2,s,z:10+i}));
    function picture(item,extra=''){
      const el=document.createElement('img');
      el.className='kp-picture '+extra;
      el.src=rmSrc(item.k);el.alt='';el.draggable=false;
      el.style.cssText=`left:${item.x}%;top:${item.y}%;width:${RMI[item.k][1]*item.s}%;z-index:${item.z}`;
      stage.append(el);
    }
    items.forEach(item=>picture(item));
    const names=other?'the '+RMI[furniture][0]+' and the '+RMI[other][0]:'the '+RMI[furniture][0];
    function getSpot(preposition){
      const piece={k:object,x:50,y:50,s:.65,z:35};
      if(preposition==='in'){
       const box=rmBox(items.find(item=>item.k===furniture),r.ar);
       piece.x=box.cx;piece.y=box.t+box.h*.57;piece.s=.43;
      }else solveRoomTask([...items,piece],r,[object,preposition,furniture,other]);
      const anchor=items.find(item=>item.k===furniture),box=rmBox(anchor,r.ar);
      if(preposition==='under')piece.y=Math.min(93,Math.max(piece.y,box.b+2));
      piece.x=Math.max(5,Math.min(95,piece.x));
      piece.y=Math.max(6,Math.min(93,piece.y));
      return piece;
    }
    const alternatives=relation==='between'?['between','on','next to']:relation==='in'?['in','on','next to']:['on','under','next to'];
    const spots=alternatives.map(preposition=>({preposition,piece:getSpot(preposition)}));
    let selected=false,drag=null;
    function select(on){selected=on;source.setAttribute('aria-pressed',String(on));stage.classList.toggle('kp-select',on)}
    function place(spot,example=false){
      if(!spot)return;
      if(spot.preposition!==relation&&!example){
       status.textContent=`${spot.preposition[0].toUpperCase()+spot.preposition.slice(1)} ${spot.preposition==='between'?names:'the '+RMI[furniture][0]}. Try ${relation}.`;
       return;
      }
      stage.querySelector('.kp-placed')?.remove();
      picture(spot.piece,'kp-placed');
      select(false);
      const plural=['books','toys'].includes(object);
      status.textContent=`${example?'':'✓ '}The ${RMI[object][0]} ${plural?'are':'is'} ${relation} ${names}.`;
    }
    for(const spot of spots){
      const button=document.createElement('button');
      button.type='button';button.className='kp-spot';
      button.style.left=spot.piece.x+'%';button.style.top=spot.piece.y+'%';
      button.setAttribute('aria-label',spot.preposition+' '+names);
      button.onclick=()=>{if(selected)place(spot);else status.textContent='Tap the object first.'};
      stage.append(button);
    }
    $('#kpShow').onclick=()=>place(spots.find(spot=>spot.preposition===relation),true);
    source.onclick=()=>select(!selected);
    source.onpointerdown=e=>{if(e.button===0)drag={x:e.clientX,y:e.clientY,moved:false}};
    source.onpointermove=e=>{
      if(!drag||(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<8))return;
      if(!drag.moved){drag.moved=true;source.setPointerCapture(e.pointerId);select(true);drag.ghost=source.querySelector('img').cloneNode();drag.ghost.className='kp-ghost';document.body.append(drag.ghost)}
      drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';
    };
    source.onpointerup=e=>{
      if(!drag?.moved){drag=null;return}
      drag.ghost.remove();drag=null;
      const box=stage.getBoundingClientRect();
      if(e.clientX>=box.left&&e.clientX<=box.right&&e.clientY>=box.top&&e.clientY<=box.bottom){
       const distance=s=>Math.hypot(box.left+s.piece.x*box.width/100-e.clientX,box.top+s.piece.y*box.height/100-e.clientY);
       const best=spots.reduce((a,b)=>distance(a)<distance(b)?a:b);
       if(distance(best)<=Math.max(26,box.width*.09))place(best);else status.textContent='Try one of the circles.';
      }
      source.onclick=()=>{source.onclick=()=>select(!selected)};
      setTimeout(()=>{source.onclick=()=>select(!selected)},0);
    };
    source.onpointercancel=()=>{drag?.ghost?.remove();drag=null};
  }
  const id='kids_put_room';
  DMT[id]=1;DMTF[id]=open;SPSHORT[id]='Put it in the room';
  SPT.push({id,n:SPSHORT[id],d:'Move things around our rooms to practise prepositions of place.'});
  const groups=SPGRP.kids;
  groups.push([1+Math.max(...groups.map(([name])=>parseInt(name,10)||0))+' · Prepositions of place',[id]]);
  SPLV.find(([level])=>level==='kids')[2].push(id);
})();
