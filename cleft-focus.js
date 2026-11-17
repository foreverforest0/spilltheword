/* Oral cleft practice: several animated accents on one original sentence. */
(()=>{
 'use strict';
 const {rows,version}=CleftFocusData,types=['underline','circle','box','bracket','highlight'];let dispose=null;
 const previous=setView;setView=function(html){dispose?.();dispose=null;return previous(html)};
 function state(){let s=S.cleftFocus;if(!s||s.version!==version||!Array.isArray(s.order)||s.order.length!==rows.length||new Set(s.order).size!==rows.length||!s.order.every(id=>rows.some(r=>r.id===id)))s=S.cleftFocus={version,order:shuffle(rows.map(r=>r.id)),sentence:0,focus:0,shown:{}};s.sentence=Math.max(0,Math.min(rows.length-1,Number.isInteger(s.sentence)?s.sentence:0));const row=rows.find(r=>r.id===s.order[s.sentence]);s.focus=Math.max(0,Math.min(row.focus.length-1,Number.isInteger(s.focus)?s.focus:0));s.shown=s.shown||{};return s}
 function open(){
  seaOff();if(!['b2','c1'].includes(S.splevel))S.splevel=['b2','c1'].includes(S.glevel)?S.glevel:'b2';document.body.classList.add('grammar-style-active');const s=state(),row=rows.find(r=>r.id===s.order[s.sentence]),f=row.focus[s.focus],key=row.id+':'+s.focus,i=row.sentence.indexOf(f.phrase),paper=['#A9C632','#C8D2A6','#FFC4C5'][s.sentence%3],type=types[(s.sentence*3+s.focus)%types.length];save();
  setView(`<section class="cf-page cbpanel" data-cleft-row="${row.id}" data-cleft-focus="${s.focus}"><header class="cf-header"><button class="lvb" id="cfBack">← Topics</button><h1>Cleft sentences</h1><span class="cf-source">B2 ALH</span></header><p class="cf-instruction">Rephrase the sentence to put the marked phrase in focus. Say your answer aloud.</p><div class="cf-paper" style="--cf-paper:${paper}"><p class="cf-sentence" data-stw-plain>${esc(row.sentence.slice(0,i))}<span id="cfMarked">${esc(f.phrase.replace(/^(a|an|the|my|our|at|after) /i,'$1\u00a0'))}</span>${esc(row.sentence.slice(i+f.phrase.length))}</p></div><div class="cf-controls"><button class="lvb" id="cfHint" aria-expanded="false" aria-controls="cfStarters">Hint</button><button class="lvb" id="cfShow" aria-expanded="${!!s.shown[key]}" aria-controls="cfAnswers">Show answer</button></div><div id="cfStarters" class="cf-hint" hidden><ul>${f.starters.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div><div id="cfAnswers" class="cf-answers" ${s.shown[key]?'':'hidden'}>${f.answers.map(t=>`<p>${esc(t)}</p>`).join('')}</div><footer class="cf-navigation"><button class="lvb" id="cfPrevious" ${!s.sentence&&!s.focus?'disabled':''}>← Back</button><span>Sentence ${s.sentence+1} / ${rows.length}<br>Focus ${s.focus+1} / ${row.focus.length}</span><button class="lvb" id="cfNext">${s.focus<row.focus.length-1?'Next focus →':s.sentence<rows.length-1?'Next sentence →':'New round ↻'}</button></footer></section>`);
  let alive=true,mark=null,frame=0;const host=document.querySelector('.cf-paper');
  function annotate(animate){if(!alive)return;mark?.remove();mark=RoughNotation.annotate(document.getElementById('cfMarked'),{type,color:type==='highlight'?(paper==='#FFC4C5'?'#A9C632':'#FFC4C5'):'#1D2E1B',strokeWidth:2,iterations:type==='highlight'?1:2,padding:type==='circle'?7:5,brackets:['left','right'],multiline:true,animate:animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!window.SharedGame?.replaying,animationDuration:800});mark.show();host.dataset.annotation=type;}
  let width=host.getBoundingClientRect().width;const observer=new ResizeObserver(()=>{const next=host.getBoundingClientRect().width;if(Math.abs(next-width)<1)return;width=next;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>annotate(false))});
  document.fonts.ready.then(()=>{if(!alive)return;annotate(true);observer.observe(host)});
  dispose=()=>{alive=false;cancelAnimationFrame(frame);observer.disconnect();mark?.remove()};
  $('#cfBack').onclick=spSetup;
  $('#cfHint').onclick=()=>{const panel=$('#cfStarters');panel.hidden=!panel.hidden;$('#cfHint').setAttribute('aria-expanded',String(!panel.hidden))};
  $('#cfShow').onclick=()=>{const panel=$('#cfAnswers');panel.hidden=!panel.hidden;s.shown[key]=!panel.hidden;$('#cfShow').setAttribute('aria-expanded',String(!panel.hidden));save()};
  $('#cfPrevious').onclick=()=>{if(s.focus)s.focus--;else if(s.sentence){s.sentence--;s.focus=rows.find(r=>r.id===s.order[s.sentence]).focus.length-1}save();open()};
  $('#cfNext').onclick=()=>{if(s.focus<row.focus.length-1)s.focus++;else if(s.sentence<rows.length-1){s.sentence++;s.focus=0}else delete S.cleftFocus;save();open()};
  LevelDesign.sync();
 }
 DMT.cleft_focus=1;DMTF.cleft_focus=open;SPSHORT.cleft_focus='Shift the focus';SPT.push({id:'cleft_focus',n:'Cleft sentences: shift the focus',d:'Say a cleft sentence that emphasises the marked phrase. Hint lists possible openings; Show answer reveals models.'});
 const c1=SPGRP.c1.find(g=>g[0].includes('Cleft'));if(c1&&!c1[1].includes('cleft_focus'))c1[1].unshift('cleft_focus');
 if(!SPGRP.b2.some(g=>g[0].includes('Cleft'))){const id='topic_ball_b2_cleft',source=Object.values(TopicBall.topics).find(t=>t.name==='Cleft sentences');TopicBall.register(id,'b2','Cleft sentences',source.profile);SPGRP.b2.push(['14 · Cleft sentences',['cleft_focus',id]]);SPLV.find(l=>l[0]==='b2')[2].push(id);}
 for(const level of ['b2','c1']){const ids=SPLV.find(l=>l[0]===level)[2];if(!ids.includes('cleft_focus'))ids.push('cleft_focus')}
 window.CleftFocus={open,rows,types};
})();
