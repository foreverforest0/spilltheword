/* A single writing desk; prompts stay in How to, writing happens on the parchment. */
(()=>{
'use strict';
const $=s=>document.querySelector(s),root=$('#writing-room'),scene=$('.wr-scene'),paper=$('#wr-manuscript'),input=$('#wr-answer'),feedback=$('#wr-feedback'),check=$('#wr-check');
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
let level='b1',index=0,busy=false,alive=true,penTimer=0,request=null,replayQueue=[];const cursors={b1:0,b2:0,c1:0},drafts=new Map(),signed=[],checks=new Map(),history=[];
const key=()=>level+':'+index,task=()=>BardTasks[level][index],wait=ms=>new Promise(r=>setTimeout(r,reduce()?0:ms));
try{replayQueue=parent.WritingRoomBridge?.replayChecks?.()||[]}catch{}
function setBusy(on){busy=on;root.setAttribute('aria-busy',String(on));input.readOnly=on;root.querySelectorAll('button').forEach(b=>b.disabled=on)}
function updateWords(){const text=input.value.toLowerCase();$('#wr-words').querySelectorAll('button').forEach((b,i)=>{const phrase=task().words[i][0].toLowerCase(),base=phrase.split(' ')[0];b.classList.toggle('used',text.includes(phrase)||(phrase.split(' ').length===1&&new RegExp('\\b'+base+'(?:s|d|ed|ing)?\\b','i').test(text)))})}
function render(){
 const row=task();root.dataset.level=level;root.dataset.task=index;root.dataset.phase='writing';$('#wr-source').textContent=row.source;$('#wr-detail').textContent=row.detail;
 document.querySelectorAll('[data-level]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.level===level)));
 $('#wr-words').replaceChildren(...row.words.map(([word,meaning])=>{const b=document.createElement('button');b.type='button';b.className='wr-word';b.textContent=word;b.onclick=()=>{const box=$('#wr-gloss');box.hidden=box.dataset.word===word&&!box.hidden;box.dataset.word=word;box.textContent=meaning};return b}));
 input.value=drafts.get(key())||'';feedback.textContent='';$('#wr-gloss').hidden=true;$('#wr-signature').classList.remove('signed');$('#wr-signature').setAttribute('aria-hidden','true');paper.style.opacity='';paper.style.transform='';updateWords();placePen();
}
function keep(){drafts.set(key(),input.value)}
function placePen(){
 const quill=$('#wr-quill');if(document.activeElement!==input||!paper.classList.contains('wr-writing')){quill.style.left='86%';quill.style.top='25%';quill.style.transform='';return}
 const style=getComputedStyle(input),mirror=document.createElement('div');mirror.style.cssText='position:fixed;left:-10000px;top:0;visibility:hidden;white-space:pre-wrap;overflow-wrap:break-word;box-sizing:border-box;';
 for(const property of ['font','lineHeight','letterSpacing','padding','border','wordSpacing','textIndent'])mirror.style[property]=style[property];mirror.style.width=input.clientWidth+'px';mirror.textContent=input.value.slice(0,input.selectionStart);
 const caret=document.createElement('span');caret.textContent='\u200b';mirror.append(caret);document.body.append(mirror);
 const pageBox=paper.getBoundingClientRect(),box=input.getBoundingClientRect(),px=box.left-pageBox.left+caret.offsetLeft,py=box.top-pageBox.top+caret.offsetTop-input.scrollTop+parseFloat(style.fontSize)*1.08;
 quill.style.left=Math.min(paper.clientWidth-15,Math.max(5,px))+'px';quill.style.top=Math.min(paper.clientHeight-90,Math.max(0,py-quill.getBoundingClientRect().height*.96))+'px';quill.style.transform='rotate(-3deg)';mirror.remove();
}
input.addEventListener('input',()=>{keep();feedback.textContent='';updateWords();paper.classList.add('wr-writing');clearTimeout(penTimer);penTimer=setTimeout(()=>{paper.classList.remove('wr-writing');placePen()},450);placePen()});
for(const type of ['click','keyup','focus','blur','scroll','select'])input.addEventListener(type,placePen);document.fonts.ready.then(placePen);window.addEventListener('resize',placePen);
$('#wr-new').onclick=()=>{keep();index=(index+1)%BardTasks[level].length;cursors[level]=index;render()};
for(const b of document.querySelectorAll('[data-level]'))b.onclick=()=>{keep();level=b.dataset.level;index=cursors[level];render()};
async function grammar(text){
 if(checks.has(text))return checks.get(text);
 request=new AbortController();const timeout=setTimeout(()=>request?.abort(),12000);
 try{
  const response=await fetch('https://api.languagetool.org/v2/check',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({text,language:'en-GB',level:'default'}),signal:request.signal});
  if(!response.ok)throw Error(response.status===429?'Grammar checking is busy. Please try again in a moment.':'Grammar checking is unavailable. Your draft is safe.');
  const result=await response.json();if(!Array.isArray(result.matches)||result.warnings?.incompleteResults)throw Error('The grammar check could not finish. Your draft is safe.');
  // Do not reject vocabulary, style, spelling, punctuation or alternative wording.
  const issues=result.matches.filter(m=>m.rule?.issueType==='grammar').map(m=>({message:String(m.message||'Check the grammar in this phrase.'),offset:Math.max(0,Number(m.offset)||0),length:Math.max(0,Number(m.length)||0)}));
  checks.set(text,issues);return issues;
 }catch(e){if(e.name==='AbortError')throw Error('The grammar check timed out. Your draft is safe.');if(e instanceof TypeError||e instanceof SyntaxError)throw Error('Grammar checking is unavailable. Your draft is safe.');throw e}
 finally{clearTimeout(timeout);request=null}
}
async function checkedGrammar(text){
 if(replayQueue.length){const row=replayQueue.shift();if(row.text!==text)throw Error('This writing-room session has changed. Ask for a fresh link.');history.push(row);if(row.error)throw Error(row.error);checks.set(text,row.issues);return row.issues}
 try{const issues=await grammar(text);history.push({text,issues});return issues}catch(e){history.push({text,issues:[],error:e.message});throw e}
}
async function animateReject(){
 root.dataset.phase='crumpling';const box=paper.getBoundingClientRect(),base=scene.getBoundingClientRect(),basket=$('.wr-basket-front').getBoundingClientRect();
 if(!reduce()){await paper.animate([{transform:'none',opacity:1},{transform:'rotate(-5deg) scale(.9,.8)',offset:.4,opacity:1},{transform:'rotate(17deg) scale(.12)',opacity:0}],{duration:650,easing:'ease-in',fill:'forwards'}).finished}
 const ball=document.createElement('img');ball.src='assets/ball.webp';ball.alt='';ball.className='wr-ball';scene.append(ball);ball.style.left=(box.left-base.left+box.width/2-32)+'px';ball.style.top=(box.top-base.top+box.height/2-32)+'px';
 const dx=basket.left+basket.width/2-(box.left+box.width/2),dy=basket.top+basket.height*.5-(box.top+box.height/2);root.dataset.phase='throwing';
 if(!reduce())await ball.animate([{transform:'translate(0,0) rotate(0deg)',opacity:1},{transform:`translate(${dx*.55}px,${Math.min(-90,dy-80)}px) rotate(140deg)`,offset:.5,opacity:1},{transform:`translate(${dx}px,${dy}px) rotate(300deg) scale(.6)`,opacity:0}],{duration:900,easing:'ease-in',fill:'forwards'}).finished;
 ball.remove();paper.getAnimations().forEach(a=>a.cancel());root.dataset.phase='writing';
}
async function animateAccept(text){
 root.dataset.phase='signing';$('#wr-signature').classList.add('signed');$('#wr-signature').setAttribute('aria-hidden','false');await wait(1250);if(!alive)return;
 const box=paper.getBoundingClientRect(),stack=$('#wr-stack').getBoundingClientRect();root.dataset.phase='stacking';
 if(!reduce())await paper.animate([{transform:'none',opacity:1},{transform:'translateY(-25px) rotate(-3deg)',offset:.2,opacity:1},{transform:`translate(${stack.left+stack.width/2-box.left-box.width/2}px,${stack.top+stack.height/2-box.top-box.height/2}px) rotate(4deg) scale(.17)`,opacity:0}],{duration:900,easing:'ease-in-out',fill:'forwards'}).finished;
 signed.push({level,text,source:task().source});$('#wr-count').textContent=signed.length;$('#wr-stack').setAttribute('aria-label','Open '+signed.length+' signed pages');drafts.delete(key());index=(index+1)%BardTasks[level].length;cursors[level]=index;paper.getAnimations().forEach(a=>a.cancel());render();feedback.textContent='Signed. A fresh page is ready.';
}
check.onclick=async()=>{
 if(busy)return;const text=input.value;if(!text.trim()){feedback.textContent='Write your new version first.';input.focus();return}
 keep();setBusy(true);check.textContent='Checking…';feedback.textContent='';root.dataset.phase='checking';
 try{
  const issues=await checkedGrammar(text);if(!alive)return;
  if(issues.length){const issue=issues[0];await animateReject();if(!alive)return;feedback.textContent=issue.message;input.focus();input.setSelectionRange(Math.min(issue.offset,input.value.length),Math.min(issue.offset+issue.length,input.value.length));placePen()}
  else await animateAccept(text);
 }catch(e){if(alive){root.dataset.phase='writing';feedback.textContent=e.message||'Grammar checking is unavailable. Your draft is safe.'}}
 finally{if(alive){setBusy(false);check.textContent='Check'}}
};
input.onkeydown=e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();check.click()}};
$('#wr-stack').onclick=()=>{
 const archive=$('#wr-signed-pages'),list=$('#wr-signed-list');list.replaceChildren();
 if(!signed.length){const p=document.createElement('p');p.textContent='Your signed pages will rest here.';list.append(p)}
 for(const row of signed){const article=document.createElement('article'),level=document.createElement('small'),text=document.createElement('p');level.textContent=row.level.toUpperCase();text.textContent=row.text;article.append(level,text);list.append(article)}
 archive.hidden=!archive.hidden;if(!archive.hidden)archive.scrollIntoView({behavior:reduce()?'instant':'smooth',block:'nearest'});
};$('#wr-close-pages').onclick=()=>{$('#wr-signed-pages').hidden=true;$('#wr-stack').focus()};
window.WritingRoom={get busy(){return busy},exportChecks:()=>history.slice(),get state(){return {level,index,draft:input.value,signed:signed.slice()}}};
window.addEventListener('pagehide',()=>{alive=false;request?.abort();clearTimeout(penTimer);resize.disconnect()},{once:true});
const resize=new ResizeObserver(()=>{try{if(parent!==window)parent.postMessage({type:'writing-room-height',height:Math.ceil(root.getBoundingClientRect().height)},location.origin)}catch{}});resize.observe(root);
render();try{parent.SharedGame?.attachFrame(window)}catch{}
})();
