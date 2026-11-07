/* Shared visual language for the main app and embedded games. */
(()=>{
 const wave=[0,-.55,-1,-.72,-.12,.6,1,.72,.15,-.5];
 const doodles=[
  '<path d="M21 3 25 14 36 8 30 20 43 24 29 28 34 41 22 32 13 43 15 29 2 25 15 19 9 8 20 14Z" fill="#CCE5FF"/><path d="m17 20 8 6m-5-13 2 8" fill="none"/>',
  '<path d="M23 16C11-2 0 13 15 23-3 29 9 43 22 29c-1 22 19 14 10-1 20 7 22-13 3-11 11-17-8-23-12-1Z" fill="#F24E07"/><circle cx="25" cy="24" r="3" fill="#F9F5E6"/>',
  '<path d="M8 39Q8 10 39 6q-1 31-31 33Z" fill="#26422B"/><path d="M10 37 33 13m-15 14 1-9m5 4 8 1" stroke="#F9F5E6" fill="none"/>'
 ];
 const gameNames=new Set(['Word Craft','Absurd Choices','Scrambl','Sentence Expander','Shop','Creative Writing','Grammar Dice','Gachapon']);
 function decorate(title){
  if(title.tagName==='H3'&&!gameNames.has(title.textContent.replace(/\s+/g,' ').trim()))return;
  if(title.closest('.stw-home')||title.querySelector('button,input,select,a,[id]')||title.closest('.stw-prompt-card'))return;
  const copy=title.cloneNode(true);copy.querySelectorAll('br').forEach(br=>br.replaceWith(' '));const text=copy.textContent.replace(/\s+/g,' ').trim();if(!text||(title.dataset.stwHeadingText===text&&title.querySelector('.stw-wave-word')))return;
  title.dataset.stwHeadingText=text;title.classList.add('stw-wavy-title');title.setAttribute('aria-label',text);if(title.parentElement?.matches('button.grammar-topic'))title.parentElement.setAttribute('aria-label',text);
  const f=document.createDocumentFragment(),words=text.split(' ');let index=0;
  words.forEach((word,wi)=>{
   const group=document.createElement('span');group.className='stw-wave-word';group.setAttribute('aria-hidden','true');
   Array.from(word).forEach(ch=>{const span=document.createElement('span');span.className='stw-wave-letter';span.style.setProperty('--stw-y',wave[index%wave.length]);span.style.setProperty('--stw-delay',(-index*.12)+'s');span.textContent=ch;group.appendChild(span);index++});f.appendChild(group);
   if(wi<words.length-1){f.appendChild(document.createTextNode(' '));if(wi===0||(wi>2&&wi%3===0)){const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.classList.add('stw-title-doodle');icon.setAttribute('viewBox','0 0 48 48');icon.setAttribute('aria-hidden','true');icon.innerHTML=doodles[wi%doodles.length];f.appendChild(icon)}}
  });title.replaceChildren(f);
 }
 function enhanceTitles(root=document){if(root.matches?.('h1,h2,h3,.brand,.game-nav>span,.grammar-topic>span'))decorate(root);root.querySelectorAll?.('h1,h2,h3,.brand,.game-nav>span,.grammar-topic>span').forEach(decorate)}
 function init(){document.body.classList.add('stw-site-theme');enhanceTitles();let pending=false;
  const observer=new MutationObserver(records=>{if(!records.some(r=>(r.target.nodeType===1?r.target:r.target.parentElement)?.closest('h1,h2,h3,.brand,.game-nav>span,.grammar-topic>span')||[...r.addedNodes].some(n=>n.nodeType===1&&!n.matches?.('.stw-wave-word,.stw-wave-letter,.stw-title-doodle'))))return;if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;enhanceTitles()})});observer.observe(document.body,{childList:true,characterData:true,subtree:true});
 }
 window.SpillTheme={enhanceTitles};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
