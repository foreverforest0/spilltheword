/* Five videos per topic; one short prompt per viewing, with its own models. */
(()=>{
 'use strict';
 const data=window.B1VideoData;let dispose=null,state=null;
 const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
 const previousView=setView;
 setView=function(html){dispose?.();dispose=null;return previousView(html)};
 function saved(topic){
  if(!object(S.b1Cinema))S.b1Cinema={};
  let s=S.b1Cinema[topic.number];if(!object(s))s=S.b1Cinema[topic.number]={};
  if(s.sequenceVersion!==2){s.step=0;s.task=0;s.finished=false;s.sequenceVersion=2}
  if(!Number.isInteger(s.step)||s.step<0||s.step>4)s.step=0;
  if(!Number.isInteger(s.task)||s.task<0||s.task>=topic.stages[s.step].tasks.length)s.task=0;
  if(!object(s.drafts))s.drafts={};if(!object(s.revealed))s.revealed={};
  return s;
 }
 const tv=screen=>`<div class="bv-tv"><div class="bv-screen">${screen}</div><img class="bv-frame" src="assets/b1-video/tv-frame.svg" alt="Hand-drawn television" draggable="false"></div>`;
 function open(number){const topic=data.topics.find(t=>t.number===+number);if(!topic)return;seaOff();S.splevel='b1';render(topic)}
 function render(topic,focus,replay){
  const s=saved(topic),stage=topic.stages[s.step],task=stage.tasks[s.task],key=task.id,source=data.sources[stage.source],finished=!!s.finished;
  const prior=s.task===0?s.drafts[stage.id]:'';
  const draft=typeof s.drafts[key]==='string'?s.drafts[key].slice(0,5000):typeof prior==='string'?prior.slice(0,5000):'';
  const last=s.step===4&&s.task===stage.tasks.length-1;
  state={topic:topic.number,step:s.step,task:s.task,finished};
  const screen=finished?`<img class="bv-end-gif" src="${esc(data.endGif)}" alt="The End">`:`<video id="bv-video" controls playsinline preload="metadata" poster="${esc(stage.poster)}" controlslist="nodownload noremoteplayback" disablepictureinpicture aria-label="${esc(stage.title)} — ${esc(source.title)}" ${stage.source==='HF'?'':'muted'}><source src="${esc(stage.video)}" type="video/mp4">Your browser cannot play this video.</video>`;
  setView(`<section class="bv-page" data-stw-plain data-topic="${topic.number}" data-step="${s.step}" data-task="${s.task}" data-finished="${finished}"><div class="bv-heading"><button type="button" class="bv-back" id="bv-topics">← Topics</button><div><p class="bv-eyebrow">B1 / VIDEO PRACTICE</p><h1>${esc(topic.name)}</h1></div><span class="bv-progress">${finished?'Complete':`${s.step+1} / 5`}</span></div><div class="bv-layout"><section class="bv-viewer" aria-label="Film player">${tv(screen)}${finished?'':`<p class="bv-credit">${esc(source.title)} · <a href="${esc(source.archive)}" target="_blank" rel="noopener">Moving Image Archive</a></p><p id="bv-video-status" class="bv-video-status" role="status"></p>`}</section><section class="bv-task" aria-label="${finished?'Training finished':'Question'}">${finished?`<h2>That’s a wrap.</h2><button type="button" id="bv-review">← Back</button>`:`<h2 class="bv-prompt">${esc(task.prompt)}</h2>${task.context?`<p class="bv-context">${esc(task.context)}</p>`:''}<textarea id="bv-draft" aria-label="Your answer" rows="4" maxlength="5000" spellcheck="false" placeholder="Your answer…">${esc(draft)}</textarea><button type="button" class="bv-show" id="bv-show" aria-expanded="${!!s.revealed[key]}" aria-controls="bv-models">${s.revealed[key]?'Hide answer':'Show answer'}</button><div class="bv-models" id="bv-models" ${s.revealed[key]?'':'hidden'}><ul>${task.answers.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></div><div class="bv-navigation">${s.step||s.task?'<button type="button" id="bv-previous">← Back</button>':'<span></span>'}<span class="bv-question-progress" aria-label="Question ${s.task+1} of ${stage.tasks.length} for this video">${s.task+1} / ${stage.tasks.length}</span><button type="button" id="bv-next">${last?'Finish →':'Next →'}</button></div>`}</section></div></section>`);
  document.getElementById('bv-topics').onclick=spSetup;
  if(finished){document.getElementById('bv-review').onclick=()=>{s.finished=false;save();render(topic,'bv-show')};return}
  const video=document.getElementById('bv-video');let alive=true;
  video.onerror=()=>{if(alive)document.getElementById('bv-video-status').textContent='The video could not load. Use Play to try again.'};
  const media=video.querySelector('source');media.onerror=video.onerror;
  document.getElementById('bv-draft').oninput=e=>{s.drafts[key]=e.target.value.slice(0,5000);save()};
  document.getElementById('bv-show').onclick=()=>{
   s.revealed[key]=!s.revealed[key];save();const shown=s.revealed[key],button=document.getElementById('bv-show');
   document.getElementById('bv-models').hidden=!shown;button.textContent=shown?'Hide answer':'Show answer';button.setAttribute('aria-expanded',String(shown));
  };
  const move=direction=>{
   const playback={muted:video.muted,volume:video.volume};video.pause();
   if(direction>0){if(s.task+1<stage.tasks.length)s.task++;else if(s.step<4){s.step++;s.task=0}else s.finished=true}
   else if(s.task>0)s.task--;else if(s.step>0){s.step--;s.task=topic.stages[s.step].tasks.length-1}
   save();render(topic,s.finished?'bv-review':'bv-next',s.finished?null:playback);
  };
  if(document.getElementById('bv-previous'))document.getElementById('bv-previous').onclick=()=>move(-1);
  document.getElementById('bv-next').onclick=()=>move(1);
  dispose=()=>{alive=false;video.onerror=null;media.onerror=null;video.pause();media.removeAttribute('src');video.removeAttribute('src');video.load()};
  if(focus)document.getElementById(focus)?.focus({preventScroll:true});
  if(replay){video.muted=replay.muted;video.volume=replay.volume;video.play().catch(()=>{});document.querySelector('.bv-page').scrollIntoView({block:'start',behavior:'instant'})}
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
