/* Rough Notation marks the actual draft; replacements remain editable learner actions. */
window.BardReview={create({paper,input,onChange,onEdit}){
 const review=document.getElementById('wr-review'),popup=document.getElementById('wr-error-popup'),edit=document.getElementById('wr-edit'),manual=document.getElementById('wr-replacement');
 let issues=[],annotations=[],selected=-1,text='',drawFrame=0,alive=true,round=0;
 const styles=['circle','strike-through','crossed-off'];
 function removeMarks(){annotations.forEach(a=>a.remove());annotations=[]}
 function close(){popup.hidden=true;selected=-1}
 function clear(){cancelAnimationFrame(drawFrame);removeMarks();close();issues=[];review.replaceChildren();review.hidden=true;input.hidden=false;edit.hidden=true}
 function draw(animate){
  if(!alive||review.hidden)return;removeMarks();
  review.querySelectorAll('.wr-error').forEach((span,i)=>{span.dataset.annotation=styles[(i+round)%styles.length];const mark=RoughNotation.annotate(span,{type:styles[(i+round)%styles.length],color:'#70271F',strokeWidth:1.9,iterations:2,padding:3,multiline:true,animate:animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches,animationDuration:420});annotations.push(mark);mark.show()});
 }
 function placePopup(){
  if(popup.hidden||selected<0)return;const target=review.querySelector(`[data-issue="${selected}"]`);if(!target)return;
  const p=paper.getBoundingClientRect(),r=target.getBoundingClientRect();popup.style.width=Math.min(270,paper.clientWidth-24)+'px';const h=popup.getBoundingClientRect().height,w=popup.getBoundingClientRect().width;
  const left=Math.max(12,Math.min(paper.clientWidth-w-12,r.left-p.left-10));let top=r.bottom-p.top+9;if(top+h>paper.clientHeight-12)top=r.top-p.top-h-9;
  popup.style.left=left+'px';popup.style.top=Math.max(12,Math.min(paper.clientHeight-h-12,top))+'px';
 }
 function open(i){
  selected=i;const issue=issues[i];if(!issue)return;popup.hidden=false;document.getElementById('wr-error-message').textContent=issue.message;manual.value=issue.replacements?.[0]??'';
  const choices=document.getElementById('wr-replacements');choices.replaceChildren();
  for(const replacement of issue.replacements||[]){const b=document.createElement('button');b.type='button';b.textContent=replacement||'Remove';b.onclick=()=>apply(replacement);choices.append(b)}
  placePopup();manual.focus({preventScroll:true});manual.select();
 }
 function paint(animate,openFirst){
  removeMarks();review.replaceChildren();let end=0;
  issues=issues.slice().sort((a,b)=>a.offset-b.offset||b.length-a.length).filter(issue=>{if(issue.offset<end)return false;end=issue.offset+issue.length;return true});end=0;
  issues.forEach((issue,i)=>{review.append(document.createTextNode(text.slice(end,issue.offset)));const span=document.createElement('span');span.className='wr-error';span.dataset.issue=i;span.tabIndex=0;span.setAttribute('role','button');span.setAttribute('aria-label','Correct '+(text.slice(issue.offset,issue.offset+issue.length)||'this insertion'));span.textContent=text.slice(issue.offset,issue.offset+issue.length)||'⌃';span.onclick=()=>open(i);span.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(i)}};review.append(span);end=issue.offset+issue.length});review.append(document.createTextNode(text.slice(end)));
  cancelAnimationFrame(drawFrame);drawFrame=requestAnimationFrame(()=>{draw(animate);if(openFirst&&issues.length){review.querySelector('.wr-error').scrollIntoView({block:'nearest',inline:'nearest'});open(0)}});
 }
 function show(found){text=input.value;issues=found.map(x=>({...x,replacements:(x.replacements||[]).slice()}));input.hidden=true;review.hidden=false;edit.hidden=false;round++;paint(true,true)}
 function apply(value){
  const issue=issues[selected];if(!issue)return;const old=text;const next=old.slice(0,issue.offset)+value+old.slice(issue.offset+issue.length);if(next===old||next.length>1200)return;
  const delta=value.length-issue.length,remaining=issues.filter((_,i)=>i!==selected).flatMap(row=>{if(row.offset+row.length<=issue.offset)return [row];if(row.offset>=issue.offset+issue.length)return [{...row,offset:row.offset+delta}];return []});
  close();input.value=next;text=next;issues=remaining;
  if(issues.length)paint(false,true);else{clear();input.focus({preventScroll:true});input.setSelectionRange(issue.offset+value.length,issue.offset+value.length)}
  onChange(issues.length);
 }
 function reflow(){if(review.hidden)return;cancelAnimationFrame(drawFrame);drawFrame=requestAnimationFrame(()=>{draw(false);if(selected>=0){const span=review.querySelector(`[data-issue="${selected}"]`),box=review.getBoundingClientRect(),r=span?.getBoundingClientRect();if(!r||r.bottom<box.top||r.top>box.bottom)close();else placePopup()}})}
 review.addEventListener('scroll',reflow);window.addEventListener('resize',reflow);document.fonts.ready.then(reflow);
 document.getElementById('wr-error-close').onclick=close;document.getElementById('wr-apply').onclick=()=>apply(manual.value);manual.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();apply(manual.value)}else if(e.key==='Escape'){e.preventDefault();close()}};
 edit.onclick=()=>{clear();input.focus({preventScroll:true});onEdit()};
 return {show,clear,close,refresh:reflow,get active(){return !review.hidden},get count(){return issues.length},destroy(){alive=false;clear();window.removeEventListener('resize',reflow);review.removeEventListener('scroll',reflow)}};
}};
