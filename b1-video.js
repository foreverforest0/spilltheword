/* Five open-answer stages per B1 topic. No grading; every stage has models. */
(()=>{
 'use strict';
 const data=window.B1VideoData;let dispose=null,state=null;
 const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
 const previousView=setView;
 setView=function(html){dispose?.();dispose=null;return previousView(html)};
 function saved(topic){
  if(!object(S.b1Cinema))S.b1Cinema={};
  let s=S.b1Cinema[topic.number];if(!object(s))s=S.b1Cinema[topic.number]={};
  if(!Number.isInteger(s.step)||s.step<0||s.step>4)s.step=0;
  if(!object(s.drafts))s.drafts={};if(!object(s.revealed))s.revealed={};
  return s;
 }
 const tv=screen=>`<div class="bv-tv"><div class="bv-screen">${screen}</div><img class="bv-frame" src="assets/b1-video/tv-frame.svg" alt="Hand-drawn television" draggable="false"></div>`;
 function open(number){const topic=data.topics.find(t=>t.number===+number);if(!topic)return;seaOff();S.splevel='b1';render(topic)}
 function render(topic,focus){
  const s=saved(topic),stage=topic.stages[s.step],source=data.sources[stage.source],finished=!!s.finished;
  const draft=typeof s.drafts[stage.id]==='string'?s.drafts[stage.id].slice(0,5000):'';
  state={topic:topic.number,step:s.step,finished};
  const screen=finished?`<img class="bv-end-gif" src="${esc(data.endGif)}" alt="The End">`:`<video id="bv-video" controls playsinline preload="metadata" poster="${esc(stage.poster)}" controlslist="nodownload noremoteplayback" disablepictureinpicture aria-label="${esc(stage.title)} — ${esc(source.title)}" ${stage.source==='HF'?'':'muted'}><source src="${esc(stage.video)}" type="video/mp4">Your browser cannot play this video.</video>`;
  setView(`<section class="bv-page" data-stw-plain data-topic="${topic.number}" data-step="${s.step}" data-finished="${finished}"><div class="bv-heading"><button type="button" class="bv-back" id="bv-topics">← Topics</button><div><p class="bv-eyebrow">B1 / VIDEO PRACTICE</p><h1>${esc(topic.name)}</h1></div><span class="bv-progress">${finished?'Complete':`${s.step+1} / 5`}</span></div><div class="bv-layout"><section class="bv-viewer" aria-label="Film player">${tv(screen)}${finished?'':`<p class="bv-credit">${esc(source.title)} · <a href="${esc(source.archive)}" target="_blank" rel="noopener">Moving Image Archive</a></p><p id="bv-video-status" class="bv-video-status" role="status"></p>`}</section><section class="bv-task" aria-label="${finished?'Training finished':'Stage instructions'}">${finished?`<p class="bv-eyebrow">FIVE STAGES COMPLETE</p><h2>That’s a wrap.</h2><p>You have reached the end of the training. Your writing is saved.</p><button type="button" id="bv-review">← Review stage 5</button>`:`<p class="bv-eyebrow">STAGE ${s.step+1} / 5 · ${esc(stage.focus)}</p><h2>${esc(stage.title)}</h2><p class="bv-watch">Watch the short scene. Replay it whenever you need.</p>${stage.context?`<p class="bv-context">${esc(stage.context)}</p>`:''}<ol class="bv-instructions">${stage.instructions.map(t=>`<li>${esc(t)}</li>`).join('')}</ol><label class="bv-draft-label" for="bv-draft">Your notes <span>— or say your answers aloud</span></label><textarea id="bv-draft" rows="4" maxlength="5000" spellcheck="false" placeholder="Your own words…">${esc(draft)}</textarea><button type="button" class="bv-show" id="bv-show" aria-expanded="${!!s.revealed[stage.id]}" aria-controls="bv-models">${s.revealed[stage.id]?'Hide answer':'Show answer'}</button><div class="bv-models" id="bv-models" ${s.revealed[stage.id]?'':'hidden'}><p class="bv-eyebrow">POSSIBLE ANSWERS</p><ul>${stage.answers.map(a=>`<li>${esc(a)}</li>`).join('')}</ul><p class="bv-model-note">These are examples. Other correct wording is possible. Any invented story details are supplied in the task.</p></div><div class="bv-navigation">${s.step?'<button type="button" id="bv-previous">← Back</button>':'<span></span>'}<button type="button" id="bv-next">${s.step===4?'Finish →':'Next →'}</button></div>`}</section></div></section>`);
  document.getElementById('bv-topics').onclick=spSetup;
  if(finished){document.getElementById('bv-review').onclick=()=>{s.finished=false;save();render(topic,'bv-show')};return}
  const video=document.getElementById('bv-video');let alive=true;
  video.onerror=()=>{if(alive)document.getElementById('bv-video-status').textContent='The video could not load. Use Play to try again.'};
  const media=video.querySelector('source');media.onerror=video.onerror;
  document.getElementById('bv-draft').oninput=e=>{s.drafts[stage.id]=e.target.value.slice(0,5000);save()};
  document.getElementById('bv-show').onclick=()=>{
   s.revealed[stage.id]=!s.revealed[stage.id];save();const shown=s.revealed[stage.id],button=document.getElementById('bv-show');
   document.getElementById('bv-models').hidden=!shown;button.textContent=shown?'Hide answer':'Show answer';button.setAttribute('aria-expanded',String(shown));
  };
  const move=direction=>{video.pause();s.step+=direction;save();render(topic,'bv-next')};
  if(document.getElementById('bv-previous'))document.getElementById('bv-previous').onclick=()=>move(-1);
  document.getElementById('bv-next').onclick=()=>{if(s.step===4){video.pause();s.finished=true;save();render(topic,'bv-review')}else move(1)};
  dispose=()=>{alive=false;video.onerror=null;media.onerror=null;video.pause();media.removeAttribute('src');video.removeAttribute('src');video.load()};
  if(focus)document.getElementById(focus)?.focus({preventScroll:true});
 }
 for(const topic of data.topics){
  const group=SPGRP.b1.find(g=>g[0].startsWith(topic.number+' ·'));if(!group)continue;
  const id='film_b1_'+topic.number;
  if(topic.number===1){const old=group[1].indexOf('ppvideo');if(old>=0)group[1].splice(old,1);DMTF.ppvideo=()=>open(1);SPSHORT.ppvideo='Video: five-stage practice'}
  if(!group[1].includes(id))group[1].splice(1,0,id);
  SPSHORT[id]='Video: five-stage practice';DMT[id]=1;DMTF[id]=()=>open(topic.number);
  SPT.push({id,n:'Video: '+topic.name,d:'Five film scenes, clear tasks and possible answers.'});
  const list=SPLV.find(l=>l[0]==='b1')[2];if(!list.includes(id))list.push(id);
 }
 window.B1Video={data,open,get state(){return state}};
})();
