/* Saved search scenes: point, name and answer aloud; teacher checks. */
(()=>{
'use strict';
const KEY='spill-kids-search-v1',scenes=window.KidsSearchScenes;
let stored={};try{stored=JSON.parse(localStorage.getItem(KEY))||{}}catch{}
let scene=Math.max(0,scenes.findIndex(x=>x.id===stored.scene)),indices=stored.indices||{},marks=stored.marks||{},zoom=1;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({scene:scenes[scene].id,indices,marks}))}catch{}};
const text=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function open(){
 seaOff();const s=scenes[scene];indices[s.id]=Math.min(11,Math.max(0,indices[s.id]||0));const i=indices[s.id],t=s.tasks[i],key=s.id+':'+i,mark=marks[key];
 setView(`<section class="ks-page" aria-label="Hidden object search"><header class="ks-head"><h1>Find & say</h1></header><nav class="ks-places" aria-label="Choose a place">${scenes.map((s,i)=>`<button type="button" data-ks-scene="${i}" aria-pressed="${i===scene}">${text(s.title)}</button>`).join('')}</nav><div class="ks-layout"><div class="ks-picture"><div class="ks-tools" aria-label="Picture zoom"><button type="button" id="ksMinus" aria-label="Zoom out">−</button><output id="ksZoom">100%</output><button type="button" id="ksPlus" aria-label="Zoom in">+</button><button type="button" id="ksFit">Fit picture</button></div><div class="ks-viewport" id="ksViewport" tabindex="0" aria-label="Picture; use the zoom controls and scroll to explore"><div class="ks-surface" id="ksSurface"><img id="ksImage" src="${s.image}" alt="${text(s.title)}: a detailed scene with people and objects to find" draggable="false"><button type="button" class="ks-marker" id="ksMarker" aria-label="Remove your marker" ${mark?'':'hidden'} style="left:${mark?.x||0}%;top:${mark?.y||0}%">+</button></div></div></div><aside class="ks-task"><span class="ks-count">${i+1} / ${s.tasks.length}</span><h2 id="ksPrompt" aria-live="polite">${text(t.prompt)}</h2><nav class="ks-next" aria-label="Tasks"><button type="button" id="ksPrev" ${i===0?'disabled':''} aria-label="Previous task">←</button><button type="button" id="ksNext">${i===11?'Start again ↻':'Next →'}</button></nav><details class="ks-key"><summary>For the teacher</summary><p>${text(t.key)}</p><small>${text(t.topic)}</small></details></aside></div></section>`);
 const viewport=document.getElementById('ksViewport'),surface=document.getElementById('ksSurface'),image=document.getElementById('ksImage');
 // Fit the complete scene initially. Zoom preserves the centre of the visible area.
 function resize(value){const prev=zoom;zoom=Math.max(1,Math.min(4,value));surface.style.width=(100*zoom)+'%';document.getElementById('ksZoom').textContent=Math.round(zoom*100)+'%';document.getElementById('ksMinus').disabled=zoom===1;document.getElementById('ksPlus').disabled=zoom===4;if(prev!==zoom){viewport.scrollLeft=(viewport.scrollLeft+viewport.clientWidth/2)*zoom/prev-viewport.clientWidth/2;viewport.scrollTop=(viewport.scrollTop+viewport.clientHeight/2)*zoom/prev-viewport.clientHeight/2}}
 resize(zoom);document.getElementById('ksPlus').onclick=()=>resize(zoom+.5);document.getElementById('ksMinus').onclick=()=>resize(zoom-.5);document.getElementById('ksFit').onclick=()=>{resize(1);viewport.scrollTo(0,0)};
 image.onclick=e=>{const r=image.getBoundingClientRect();marks[key]={x:Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)),y:Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100))};const m=document.getElementById('ksMarker');m.hidden=false;m.style.left=marks[key].x+'%';m.style.top=marks[key].y+'%';save()};document.getElementById('ksMarker').onclick=()=>{delete marks[key];document.getElementById('ksMarker').hidden=true;save()};
 function move(delta){indices[s.id]=(i+delta+s.tasks.length)%s.tasks.length;save();open();document.getElementById('ksPrompt').focus({preventScroll:true})}
 document.getElementById('ksPrompt').tabIndex=-1;document.getElementById('ksPrev').onclick=()=>move(-1);document.getElementById('ksNext').onclick=()=>move(1);
 document.querySelectorAll('[data-ks-scene]').forEach(b=>b.onclick=()=>{scene=+b.dataset.ksScene;zoom=1;save();open()});
}
DMT.kids_search=1;DMTF.kids_search=open;SPSHORT.kids_search='Find & say';SPT.push({id:'kids_search',n:'Find & say',d:'Find objects in three busy scenes and answer aloud.'});
const n=1+Math.max(0,...SPGRP.kids.map(g=>parseInt(g[0])||0));SPGRP.kids.push([n+' · Find & say',['kids_search']]);SPLV.find(l=>l[0]==='kids')[2].push('kids_search');
window.KidsSearch={open,scenes};
})();
