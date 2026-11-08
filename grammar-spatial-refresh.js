/* Focused Kids/A1 practice and clean object assets shared by the spatial games. */
const CLEAN_OBJECT_INDEX=Object.fromEntries(DMO.map((o,i)=>[o[0],i]));
// Keep the original cutouts; the first sprite cell replaces the incomplete cat head.
function spatialObject(o){
 const i=CLEAN_OBJECT_INDEX[o[0]],x=i%6,y=Math.floor(i/6);
 return i===0?`<span class="spatial-cutout spatial-cat" role="img" aria-label="${esc(o[2])}" style="--object-x:${x*20}%;--object-y:${y*50}%"></span>`:`<img class="spatial-cutout spatial-photo" src="ch/${o[0]}.webp" alt="${esc(o[2])}" draggable="false">`;
}
const PC_TYPEWRITER_ROWS=[
 ['I','am','read','reading'],['You','are','play','playing'],['He','is','eat','eating'],['She','is','drink','drinking'],['We','are','cook','cooking'],['They','are','jump','jumping'],['The cat','is','sleep','sleeping'],['The dogs','are','run','running'],['She','is','dance','dancing'],['He','is','write','writing'],['We','are','swim','swimming'],['I','am','draw','drawing']
];
TYD.tpc=tyMk('Typewriter: Present Continuous','Choose a mode. Type the missing word or words and press Enter.',[['be','Am / is / are'],['ing','Add -ing'],['phrase','Build the verb']],{be:'I am. He / she / it is. You / we / they are.',ing:'Use the verb with -ing.',phrase:'Use am / is / are + verb-ing.'},PC_TYPEWRITER_ROWS.flatMap(([s,be,v,ing])=>[
 [`${s} ___ ${ing}.`,be,'be'],[`${s} ${be} ___ (${v}).`,ing,'ing'],[`${s} ___ (${v}).`,`${be} ${ing}`,'phrase']
]));
DMT.tpc=1;DMTF.tpc=()=>tyDrillStart('tpc');SPSHORT.tpc='Typewriter: Present Continuous';SPT.push({id:'tpc',n:SPSHORT.tpc,d:TYD.tpc.help});
for(const [lv,groups]of Object.entries(SPGRP))for(const group of groups)if(/^\d+ · Present Continuous$/.test(group[0])){group[1].push('tpc');SPLV.find(l=>l[0]===lv)?.[2].push('tpc')}
const ownershipItems=cbItems;
cbItems=function(){
 if(CB.task!=='who')return ownershipItems();
 const roles=['my','his','your','our','her','your','my','his','our','their','your','our'];
 const pronouns={my:'mine',your:'yours',our:'ours',his:'his',her:'hers',their:'theirs'};
 return shuffle(WH.map((c,i)=>{
  const adjective=roles[i],plural=c[1]==='cookies',noun=c[1],p=plural?'These are':'This is',q=plural?'These '+noun+' are':'This '+noun+' is';
  const context=adjective==='my'?'Speak as '+c[0]+'.':adjective==='your'?'Speak to '+c[0]+'.':adjective==='our'?'You and '+c[0]+' own it. Speak as “we”.':'Talk about '+c[0]+'.';
  return {src:'ch/w'+String(i+1).padStart(2,'0')+'.jpg',photo:1,t:'',frontImageOnly:true,noHints:true,ownerContext:context,backPrompts:[p+' ___ '+noun+'.',q+' ___.'],ownershipAnswers:[adjective,pronouns[adjective]]};
 }));
};
const ownershipDescription=SPT.find(x=>x.id==='who');if(ownershipDescription)ownershipDescription.d='Turn a picture over and complete both sentences: my / mine, your / yours, his, her / hers, our / ours, their / theirs.';
function spatialDrag(el,drop){
 let start=null,ghost=null,moved=false;
 el.onpointerdown=e=>{if(e.button!==0||el.disabled)return;start={x:e.clientX,y:e.clientY};moved=false;el.setPointerCapture(e.pointerId)};
 el.onpointermove=e=>{if(!start||Math.abs(e.clientX-start.x)+Math.abs(e.clientY-start.y)<7&&!moved)return;moved=true;if(!ghost){ghost=el.cloneNode(true);ghost.classList.add('spatial-drag-ghost');ghost.style.width=el.offsetWidth+'px';document.body.append(ghost);el.style.opacity='.25'}ghost.style.left=e.clientX-ghost.offsetWidth/2+'px';ghost.style.top=e.clientY-ghost.offsetHeight/2+'px'};
 const clean=()=>{ghost?.remove();ghost=null;el.style.opacity=''};
 el.onpointerup=e=>{if(!start)return;start=null;clean();if(moved){el.releasePointerCapture(e.pointerId);e.preventDefault();drop(document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-spatial-zone]'))}};
 el.onpointercancel=()=>{start=null;clean()};
 el.consumeDrag=()=>{const v=moved;moved=false;return v};
}
function spatialTransfer(el,target){
 const before=el.getBoundingClientRect();target.append(el);const after=el.getBoundingClientRect();
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)el.animate([{transform:`translate(${before.x-after.x}px,${before.y-after.y}px) scale(1.08)`},{transform:'translate(0,0) scale(1)'}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'});
}
function spatialGame(baskets=false){
 const id=baskets?'fbk':'nof',title=baskets?'Four baskets':'Near or Far';
 const st=dmShell(id,title,baskets?'Drag each picture into this, that, these or those. Look at its NEAR / FAR label and count the objects. You can also select a picture and click a basket.':'Drag a picture near you or far away. You can also select a picture and click HERE or THERE. Say the sentence when it lands.',[]);
 $('#dmhint').remove();$('#dmnew').textContent='New round';$('#dmnew').onclick=()=>spatialGame(baskets);
 st.classList.add('spatial-stage');let selected=null,correct=0;
 const zone=(key,label)=>`<div class="spatial-zone ${key}" data-spatial-zone="${key}" role="button" tabindex="0" aria-label="${label}"><strong>${label}</strong><div class="spatial-zone-items"></div></div>`;
 st.innerHTML=`<svg width="0" height="0" class="spatial-filters" aria-hidden="true"><defs><filter id="spatial-clean"><feMorphology in="SourceAlpha" operator="erode" radius=".45" result="trimmed"/><feComposite in="SourceGraphic" in2="trimmed" operator="in"/></filter></defs></svg><div class="spatial-status" role="status">${baskets?'0 / 8':'Choose a picture.'}</div>${baskets?'<div class="spatial-tray"></div><div class="spatial-baskets">'+['this','that','these','those'].map(n=>zone(n,n)).join('')+'</div>':'<div class="spatial-depth">'+zone('far','THERE · that / those')+zone('near','HERE · this / these')+'</div><div class="spatial-tray"></div>'}`;
 const status=st.querySelector('.spatial-status');
 let items;
 if(baskets){const one=shuffle(DMO.filter(o=>o[1]==='s')).slice(0,4),many=shuffle(DMO.filter(o=>o[1]==='p')).slice(0,4);items=shuffle([...one.map((o,i)=>({o,near:i%2===0})),...many.map((o,i)=>({o,near:i%2===0}))])}
 else items=shuffle(DMO.slice()).slice(0,8).map(o=>({o}));
 const put=(el,z)=>{
  if(!z||el.disabled)return;const item=items[+el.dataset.object];
  if(baskets){const expected=item.o[1]==='p'?(item.near?'these':'those'):(item.near?'this':'that');
   if(z.dataset.spatialZone!==expected){status.textContent=(item.o[1]==='p'?'More than one':'One thing')+' · '+(item.near?'near':'far')+'. Try another basket.';el.animate?.([{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(0)'}],{duration:220});return}
   el.disabled=true;correct++;spatialTransfer(el,z.querySelector('.spatial-zone-items'));status.textContent=correct+' / 8 · '+dmSent(item.o,item.near)+(correct===8?' All sorted!':'');
  }else{spatialTransfer(el,z.querySelector('.spatial-zone-items'));el.dataset.distance=z.dataset.spatialZone;status.textContent=dmSent(item.o,z.dataset.spatialZone==='near')}
  el.classList.remove('selected');selected=null;
 };
 items.forEach((item,i)=>{const el=document.createElement('button');el.type='button';el.className='spatial-item';el.dataset.object=i;el.innerHTML=spatialObject(item.o)+(baskets?'<span class="spatial-distance">'+(item.near?'NEAR':'FAR')+'</span>':'');el.setAttribute('aria-label',item.o[2]+(baskets?' '+(item.near?'near':'far'):''));el.draggable=false;
  spatialDrag(el,z=>put(el,z));el.onclick=()=>{if(el.consumeDrag()||el.disabled)return;st.querySelectorAll('.spatial-item').forEach(b=>b.classList.toggle('selected',b===el));selected=el;if(!baskets&&el.dataset.distance)status.textContent=dmSent(item.o,el.dataset.distance==='near')};st.querySelector('.spatial-tray').append(el);
 });
 st.querySelectorAll('[data-spatial-zone]').forEach(z=>{z.onclick=e=>{if(!e.target.closest('.spatial-item')&&selected)put(selected,z)};z.onkeydown=e=>{if((e.key==='Enter'||e.key===' ')&&e.target===z&&selected){e.preventDefault();put(selected,z)}}});
}
DMTF.nof=()=>spatialGame(false);DMTF.fbk=()=>spatialGame(true);
