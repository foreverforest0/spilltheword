/* Open notebooks: every keepsake is visible at once; no guided question sequence. */
(()=>{
 'use strict';
 const stories=PastNotebookData;let dispose=null;
 const previous=setView;setView=function(html){dispose?.();dispose=null;return previous(html)};
 const level=()=>S.splevel==='b2'?'b2':'b1';
 // Bounds are filled from the generated source sheets, without modifying image pixels.
 function picture(sheet,rect,alt){return `<svg class="pn-image" viewBox="${rect.join(' ')}" role="img" aria-label="${esc(alt)}" focusable="false"><image href="assets/past-notebooks/${sheet}" width="${sheet==='photographs.png'?PastNotebookArt.photos[0]:PastNotebookArt.objects[0]}" height="${sheet==='photographs.png'?PastNotebookArt.photos[1]:PastNotebookArt.objects[1]}"/></svg>`}
 function textOf(piece){return level()==='b2'?(piece.b2Text||piece.text):piece.text}
 function renderPiece(p,large=false){
  if(p.kind==='photo')return `<span class="pn-polaroid">${picture('photographs.png',PastNotebookArt.photoBounds[p.photo],p.label)}<span>${esc(p.label)}</span></span>`;
  if(p.kind==='object')return `<span class="pn-object">${picture('objects.png',PastNotebookArt.objectBounds[p.prop],p.label)}<span class="pn-object-note">${esc(p.text)}</span></span>`;
  if(p.kind==='audio')return `<span class="pn-audio-card"><span class="pn-voice-icon" aria-hidden="true">◉</span><strong>${esc(p.label)}</strong><span>${p.audio?'Listen to the message':'Recording to be added'}</span></span>`;
  return `<span class="pn-paper pn-paper--${p.kind}"><span class="pn-paper-label">${esc(p.label)}</span><span class="pn-paper-text">${esc(textOf(p))}</span></span>`;
 }
 function getState(story){S.pastNotebooks=S.pastNotebooks||{};const k=level()+':'+story.id;let s=S.pastNotebooks[k];if(!s||s.version!==1)s=S.pastNotebooks[k]={version:1,draft:typeof S.pastStoryFiles?.[k]?.answers?.[6]==='string'?S.pastStoryFiles[k].answers[6]:'',layout:{}};s.draft=typeof s.draft==='string'?s.draft.slice(0,7000):'';s.layout=s.layout||{};return s}
 function setup(){seaOff();document.body.classList.add('grammar-style-active');setView(`<section class="pn-page" data-notebook-level="${level()}"><header class="pn-header"><button class="lvb" id="pnTopics">← Topics</button><h1>Story notebooks</h1></header><div class="pn-shelf">${stories.map((s,i)=>`<button class="pn-cover" data-notebook="${s.id}"><span class="pn-cover-spine"></span><span class="pn-cover-number">${String(i+1).padStart(2,'0')}</span><h2>${esc(s.title)}</h2><p>${esc(s.description)}</p><span class="pn-open-label">Open notebook →</span></button>`).join('')}</div></section>`);$('#pnTopics').onclick=()=>{S.gmode='ts';go('gram')};document.querySelectorAll('[data-notebook]').forEach(b=>b.onclick=()=>open(b.dataset.notebook))}
 function open(id){const story=stories.find(s=>s.id===id);if(!story)return;seaOff();document.body.classList.add('grammar-style-active');const saved=getState(story);save();
 setView(`<section class="pn-page" data-notebook="${id}" data-notebook-level="${level()}"><header class="pn-header"><button class="lvb" id="pnClose">← Notebooks</button><div><h1>${esc(story.title)}</h1><p>${esc(story.description)}</p></div></header><div class="pn-book"><section class="pn-left-page" aria-label="Objects, photographs, notes and tickets"><div class="pn-collage" id="pnCollage">${story.pieces.map((p,i)=>`<button type="button" class="pn-piece pn-piece-${i} pn-kind-${p.kind}" data-notebook-piece="${i}" aria-label="Open ${esc(p.label)}" draggable="false">${renderPiece(p)}</button>`).join('')}</div></section><div class="pn-binding" aria-hidden="true">${'<i></i>'.repeat(14)}</div><section class="pn-right-page" aria-label="Your story"><label class="sr-only" for="pnDraft">Your story</label><textarea id="pnDraft" maxlength="7000" spellcheck="false" placeholder="Your story…">${esc(saved.draft)}</textarea></section></div><dialog class="pn-dialog" id="pnDetail"><button class="pn-detail-close" id="pnDetailClose" aria-label="Close detail">×</button><div id="pnDetailBody"></div></dialog></section>`);
 $('#pnClose').onclick=setup;$('#pnDraft').oninput=e=>{saved.draft=e.target.value;save()};
 const dialog=$('#pnDetail');let audio=null,activeButton=null,drag=null,top=10;
 function close(){audio?.pause();audio=null;dialog.close();activeButton?.focus({preventScroll:true})}
 $('#pnDetailClose').onclick=close;dialog.oncancel=e=>{e.preventDefault();close()};dialog.onclick=e=>{if(e.target===dialog)close()};
 function inspect(index,button){const p=story.pieces[index];activeButton=button;const body=$('#pnDetailBody');body.innerHTML=`<h2>${esc(p.label)}</h2>${renderPiece(p,true)}${p.kind==='audio'?(p.audio?`<audio controls preload="metadata" src="${esc(p.audio)}" aria-label="${esc(p.label)}"></audio><details><summary>Transcript</summary><p>${esc(p.transcript)}</p></details>`:'<p class="pn-audio-pending">The voice recording has not been supplied yet.</p>'):''}`;dialog.showModal();audio=body.querySelector('audio');}
 const collage=$('#pnCollage');
 document.querySelectorAll('[data-notebook-piece]').forEach(button=>{
  const index=+button.dataset.notebookPiece,piece=story.pieces[index],pos=saved.layout[piece.id];if(pos){button.style.left=pos.x+'%';button.style.top=pos.y+'%';button.style.zIndex=pos.z;top=Math.max(top,pos.z)}
  let suppress=false;
  button.onclick=()=>{if(suppress){suppress=false;return}inspect(index,button)};button.ondragstart=e=>e.preventDefault();
  button.onpointerdown=e=>{if(e.button!==0||innerWidth<760)return;const b=button.getBoundingClientRect(),c=collage.getBoundingClientRect();drag={button,id:e.pointerId,startX:e.clientX,startY:e.clientY,x:b.left-c.left,y:b.top-c.top,moved:false,piece};button.setPointerCapture(e.pointerId)};
  button.onpointermove=e=>{if(!drag||drag.button!==button||drag.id!==e.pointerId)return;const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;if(!drag.moved&&Math.hypot(dx,dy)<7)return;drag.moved=true;const x=Math.max(0,Math.min(collage.clientWidth-button.offsetWidth,drag.x+dx)),y=Math.max(0,Math.min(collage.clientHeight-button.offsetHeight,drag.y+dy));button.style.left=x/collage.clientWidth*100+'%';button.style.top=y/collage.clientHeight*100+'%';button.style.zIndex=++top;drag.pos={x:x/collage.clientWidth*100,y:y/collage.clientHeight*100,z:top};};
  const finish=e=>{if(!drag||drag.button!==button||drag.id!==e.pointerId)return;if(drag.moved){saved.layout[piece.id]=drag.pos;suppress=true;save()}drag=null;try{button.releasePointerCapture(e.pointerId)}catch{}};button.onpointerup=finish;button.onpointercancel=finish;
  button.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')suppress=false;if(!e.shiftKey||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const b=button.getBoundingClientRect(),c=collage.getBoundingClientRect(),x=Math.max(0,Math.min(collage.clientWidth-button.offsetWidth,b.left-c.left+(e.key==='ArrowLeft'?-10:e.key==='ArrowRight'?10:0))),y=Math.max(0,Math.min(collage.clientHeight-button.offsetHeight,b.top-c.top+(e.key==='ArrowUp'?-10:e.key==='ArrowDown'?10:0)));const pos={x:x/collage.clientWidth*100,y:y/collage.clientHeight*100,z:++top};saved.layout[piece.id]=pos;button.style.left=pos.x+'%';button.style.top=pos.y+'%';button.style.zIndex=pos.z;save()};
 });
 dispose=()=>{audio?.pause();if(dialog.open)dialog.close();drag=null};
 }
 for(const lv of ['b1','b2']){const g=SPGRP[lv].find(g=>/Past Perfect|Past tenses|Narrative tenses/i.test(g[0]));if(g&&!g[1].includes('past_story_files'))g[1].push('past_story_files');const ids=SPLV.find(x=>x[0]===lv)?.[2];if(ids&&!ids.includes('past_story_files'))ids.push('past_story_files')}
 // B2 needs its existing Past Perfect entry even on a fresh initial catalog.
 if(!SPGRP.b2.some(g=>g[1].includes('past_story_files')))SPGRP.b2.push(['15 · Past Perfect',['past_story_files']]);
 DMT.past_story_files=1;DMTF.past_story_files=setup;SPSHORT.past_story_files='Story notebooks: past tenses';SPT.push({id:'past_story_files',n:'Story notebooks: past tenses',d:'Photographs, objects, notes and tickets in an open notebook.'});window.PastStoryFiles={stories,setup,open};window.PastNotebooks={stories,setup,open};
})();
