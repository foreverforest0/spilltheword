/* Room → letter. The sentence stays visible; How to opens explicit instructions. */
(()=>{
'use strict';
const $=s=>document.querySelector(s),root=$('#writing-room'),scene=$('.wr-scene'),paper=$('#wr-manuscript'),input=$('#wr-answer'),feedback=$('#wr-feedback'),check=$('#wr-check');
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const video=$('#wr-room-video'),roomMotion=BardRoomMotion.create($('#wr-enter'));let motionPaused=reduce();
let level='b1',index=0,busy=false,alive=true,penTimer=0,request=null,replayQueue=[];const cursors={b1:0,b2:0,c1:0},drafts=new Map(),signed=[],checks=new Map(),history=[];
const detailChoices=new Map();
const proof=BardReview.create({paper,input,onChange:remaining=>{keep();updateWords();root.dataset.phase=remaining?'review':'writing';feedback.textContent=remaining?remaining+' marked issue(s) left.':'Corrections applied. Check the revised version before signing.';check.textContent='Check again'},onEdit:()=>{root.dataset.phase='writing';feedback.textContent='Edit your draft, then check again.';check.textContent='Check again'}});
const key=()=>level+':'+index,task=()=>BardTasks[level][index],wait=ms=>new Promise(r=>setTimeout(r,reduce()?0:ms));
try{replayQueue=parent.WritingRoomBridge?.replayChecks?.()||[]}catch{}
function setBusy(on){$('#wr-review').inert=on;$('#wr-error-popup').inert=on;busy=on;root.setAttribute('aria-busy',String(on));input.readOnly=on;root.querySelectorAll('button').forEach(b=>b.disabled=on)}
function updateWords(){const text=input.value.toLowerCase();$('#wr-words').querySelectorAll('button').forEach((b,i)=>{const phrase=task().words[i][0].toLowerCase(),base=phrase.split(' ')[0];b.classList.toggle('used',text.includes(phrase)||(phrase.split(' ').length===1&&new RegExp('\\b'+base+'(?:s|d|ed|ing)?\\b','i').test(text)))})}
function render(){
 proof.clear();const row=task();root.dataset.level=level;root.dataset.task=index;root.dataset.phase='writing';$('#wr-source').textContent=row.source;renderDetail();
 document.querySelectorAll('[data-level]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.level===level)));
 $('#wr-words').replaceChildren(...row.words.map(([word,meaning])=>{const b=document.createElement('button');b.type='button';b.className='wr-word';b.textContent=word;b.onclick=()=>{const box=$('#wr-gloss');box.hidden=box.dataset.word===word&&!box.hidden;box.dataset.word=word;box.textContent=meaning};return b}));
 input.value=drafts.get(key())||'';feedback.textContent='';$('#wr-gloss').hidden=true;$('#wr-signature').classList.remove('signed');$('#wr-signature').setAttribute('aria-hidden','true');paper.style.opacity='';paper.style.transform='';updateWords();placePen();
}
function renderDetail(){const options=task().details||[{kind:'Add a detail',text:task().detail}],choice=(detailChoices.get(key())||0)%options.length;$('#wr-detail-kind').textContent=options[choice].kind;$('#wr-detail').textContent=options[choice].text;$('#wr-detail-next').hidden=options.length<2}
$('#wr-detail-next').onclick=()=>{detailChoices.set(key(),(detailChoices.get(key())||0)+1);renderDetail();if(!reduce())$('.wr-detail-note').animate([{transform:'rotate(0)'},{transform:'rotate(-2deg)'},{transform:'rotate(0)'}],{duration:260})};
function keep(){drafts.set(key(),input.value)}
function placePen(){
 const quill=$('#wr-quill');if(document.activeElement!==input||!paper.classList.contains('wr-writing')){quill.style.left='86%';quill.style.top='25%';quill.style.transform='';return}
 const style=getComputedStyle(input),mirror=document.createElement('div');mirror.style.cssText='position:fixed;left:-10000px;top:0;visibility:hidden;white-space:pre-wrap;overflow-wrap:break-word;box-sizing:border-box;';
 for(const property of ['font','lineHeight','letterSpacing','padding','border','wordSpacing','textIndent'])mirror.style[property]=style[property];mirror.style.width=input.clientWidth+'px';mirror.textContent=input.value.slice(0,input.selectionStart);
 const caret=document.createElement('span');caret.textContent='\u200b';mirror.append(caret);document.body.append(mirror);
 const pageBox=paper.getBoundingClientRect(),box=input.getBoundingClientRect(),px=box.left-pageBox.left+caret.offsetLeft,py=box.top-pageBox.top+caret.offsetTop-input.scrollTop+parseFloat(style.fontSize)*1.08;
 quill.style.left=Math.min(paper.clientWidth-15,Math.max(5,px))+'px';quill.style.top=Math.min(paper.clientHeight-90,Math.max(0,py-quill.getBoundingClientRect().height*.96))+'px';quill.style.transform='rotate(-3deg)';mirror.remove();
}
input.addEventListener('input',()=>{if(proof.active)proof.clear();keep();feedback.textContent='';updateWords();paper.classList.add('wr-writing');clearTimeout(penTimer);penTimer=setTimeout(()=>{paper.classList.remove('wr-writing');placePen()},450);placePen()});
for(const type of ['click','keyup','focus','blur','scroll','select'])input.addEventListener(type,placePen);document.fonts.ready.then(placePen);window.addEventListener('resize',placePen);
$('#wr-new').onclick=()=>{keep();index=(index+1)%BardTasks[level].length;cursors[level]=index;render()};
for(const b of document.querySelectorAll('[data-level]'))b.onclick=()=>{keep();level=b.dataset.level;index=cursors[level];render()};
function videoState(){const stopped=video.paused;if(stopped)roomMotion.pause();else roomMotion.play();$('#wr-pause').textContent=stopped?'Play scene':'Pause scene';$('#wr-pause').setAttribute('aria-pressed',String(stopped))}
function revealSource(){requestAnimationFrame(()=>{placePen();proof.refresh();if(parent!==window)parent.postMessage({type:'writing-room-focus-source'},location.origin);else $('#wr-source').scrollIntoView({block:'center',behavior:reduce()?'instant':'smooth'})})}
function roomView(open){
 root.dataset.view=open?'room':'writing';$('#wr-intro').hidden=!open;$('#wr-work').hidden=open;$('#wr-new').hidden=open;
 if(open){proof.close();if(!motionPaused)video.play().catch(()=>{});$('#wr-enter').focus({preventScroll:true})}else{video.pause();$('#wr-source').focus({preventScroll:true});revealSource()}
}
$('#wr-enter').onclick=()=>roomView(false);
$('#wr-room-back').onclick=()=>{keep();roomView(true)};
$('#wr-pause').onclick=()=>{motionPaused=!video.paused;if(motionPaused)video.pause();else video.play().catch(()=>{});setTimeout(videoState,0)};
video.addEventListener('pause',videoState);video.addEventListener('play',videoState);
if(reduce()){video.removeAttribute('autoplay');video.pause()}videoState();
$('#wr-how-toggle').onclick=()=>{const help=$('#wr-help');help.hidden=!help.hidden;$('#wr-how-toggle').setAttribute('aria-expanded',String(!help.hidden))};
async function grammar(text){
 if(checks.has(text))return checks.get(text);
 const local=BardGrammar.localIssues(text);
 request=new AbortController();const timeout=setTimeout(()=>request?.abort(),12000);
 try{
  const response=await fetch('https://api.languagetool.org/v2/check',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({text,language:'en-GB',level:'picky'}),signal:request.signal});
  if(!response.ok)throw Error(response.status===429?'Grammar checking is busy. Please try again in a moment.':'Grammar checking is unavailable. Your draft is safe.');
  const result=await response.json(),issues=BardGrammar.mergeIssues(BardGrammar.normalizeRemote(text,result),local);
  checks.set(text,issues);return issues;
 }catch(e){if(local.length){checks.set(text,local);return local}if(e.name==='AbortError')throw Error('The grammar check timed out. Your draft is safe.');if(e instanceof TypeError||e instanceof SyntaxError)throw Error('Grammar checking is unavailable. Your draft is safe.');throw e}
 finally{clearTimeout(timeout);request=null}
}
async function checkedGrammar(text){
 if(replayQueue.length){const row=replayQueue.shift();if(row.text!==text)throw Error('This writing-room session has changed. Ask for a fresh link.');if(row.version!==BardGrammar.version)throw Error('This session used an older checker. Open a fresh game.');history.push(row);if(row.error)throw Error(row.error);checks.set(text,row.issues);return row.issues}
 try{const issues=await grammar(text);history.push({version:BardGrammar.version,text,issues});return issues}catch(e){history.push({version:BardGrammar.version,text,issues:[],error:e.message});throw e}
}
async function animateAccept(text){
 root.dataset.phase='signing';$('#wr-signature').classList.add('signed');$('#wr-signature').setAttribute('aria-hidden','false');await wait(1250);if(!alive)return;
 const box=paper.getBoundingClientRect(),stack=$('#wr-stack').getBoundingClientRect();root.dataset.phase='stacking';
 if(!reduce())await paper.animate([{transform:'none',opacity:1},{transform:'translateY(-25px) rotate(-3deg)',offset:.2,opacity:1},{transform:`translate(${stack.left+stack.width/2-box.left-box.width/2}px,${stack.top+stack.height/2-box.top-box.height/2}px) rotate(4deg) scale(.17)`,opacity:0}],{duration:900,easing:'ease-in-out',fill:'forwards'}).finished;
 signed.push({level,text,source:task().source});$('#wr-count').textContent=signed.length;$('#wr-stack').setAttribute('aria-label','Open '+signed.length+' signed pages');drafts.delete(key());index=(index+1)%BardTasks[level].length;cursors[level]=index;paper.getAnimations().forEach(a=>a.cancel());render();feedback.textContent='Signed. A fresh page is ready.';
}
check.onclick=async()=>{
 if(busy)return;const text=input.value;if(!text.trim()){feedback.textContent='Write your new version first.';input.focus();return}
 keep();proof.close();setBusy(true);check.textContent='Checking…';feedback.textContent='';root.dataset.phase='checking';
 try{
  const issues=await checkedGrammar(text);if(!alive)return;
  if(issues.length){root.dataset.phase='review';proof.show(issues);feedback.textContent=issues.length+' issue(s) found. Click a marked phrase to correct it.'}
  else await animateAccept(text);
 }catch(e){if(alive){root.dataset.phase='writing';feedback.textContent=e.message||'Grammar checking is unavailable. Your draft is safe.'}}
 finally{if(alive){setBusy(false);check.textContent=proof.active?'Check again':'Check'}}
};
input.onkeydown=e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();check.click()}};
$('#wr-stack').onclick=()=>{
 const archive=$('#wr-signed-pages'),list=$('#wr-signed-list');list.replaceChildren();
 if(!signed.length){const p=document.createElement('p');p.textContent='Your signed pages will rest here.';list.append(p)}
 for(const row of signed){const article=document.createElement('article'),level=document.createElement('small'),text=document.createElement('p');level.textContent=row.level.toUpperCase();text.textContent=row.text;article.append(level,text);list.append(article)}
 archive.hidden=!archive.hidden;if(!archive.hidden)archive.scrollIntoView({behavior:reduce()?'instant':'smooth',block:'nearest'});
};$('#wr-close-pages').onclick=()=>{$('#wr-signed-pages').hidden=true;$('#wr-stack').focus()};
window.WritingRoom={get busy(){return busy},exportChecks:()=>history.slice(),revealSource,get state(){return {view:root.dataset.view,level,index,draft:input.value,signed:signed.slice()}}};
window.addEventListener('pagehide',()=>{alive=false;request?.abort();clearTimeout(penTimer);proof.destroy();video.pause();roomMotion.destroy();resize.disconnect()},{once:true});
const resize=new ResizeObserver(()=>{try{if(parent!==window)parent.postMessage({type:'writing-room-height',height:Math.ceil(root.getBoundingClientRect().height)},location.origin)}catch{}});resize.observe(root);
render();try{parent.SharedGame?.attachFrame(window)}catch{}
})();
