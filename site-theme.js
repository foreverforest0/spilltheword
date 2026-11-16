try{if(window.parent!==window)window.parent.SharedGame?.attachFrame(window)}catch{}
/* Shared visual language for the main app and embedded games. */
(()=>{
 const wave=[0,-.55,-1,-.72,-.12,.6,1,.72,.15,-.5];
 const doodles=Array.from({length:8},(_,i)=>`<image href="${new URL(`assets/pencils/pencil-${i+1}.svg`,document.currentScript?.src||document.baseURI)}" x="15" width="18" height="48"/>`);
 const gameNames=new Set(['Word Craft','Absurd Choices','Scrambl','Sentence Expander','Shop','Creative Writing','Grammar Dice','Gachapon']);
 function decorate(title){
  if(title.tagName==='H3'&&!gameNames.has(title.textContent.replace(/\s+/g,' ').trim()))return;
  if(title.closest('.grammar-topic,.stw-board-card,.stw-prompt-card,[data-stw-plain]'))return;
  if((title.closest('.stw-home')&&!title.matches('.category'))||title.querySelector('button,input,select,a,[id]'))return;
  const copy=title.cloneNode(true);copy.querySelectorAll('br').forEach(br=>br.replaceWith(' '));const text=copy.textContent.replace(/\s+/g,' ').trim();if(!text||(title.dataset.stwHeadingText===text&&title.querySelector('.stw-wave-word')))return;
  title.dataset.stwHeadingText=text;title.classList.add('stw-wavy-title');title.setAttribute('aria-label',text);
  const f=document.createDocumentFragment(),words=text.split(' ');let index=0;
  words.forEach((word,wi)=>{
   const group=document.createElement('span');group.className='stw-wave-word';group.setAttribute('aria-hidden','true');
   Array.from(word).forEach(ch=>{const span=document.createElement('span');span.className='stw-wave-letter';span.style.setProperty('--stw-y',wave[index%wave.length]);span.style.setProperty('--stw-delay',(index*.075)+'s');span.style.setProperty('--stw-dy',[-6,-3,2,5,2][index%5]+'px');span.textContent=ch;group.appendChild(span);index++});f.appendChild(group);
   if(wi<words.length-1){f.appendChild(document.createTextNode(' '));if(wi===0||(wi>2&&wi%3===0)){const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.classList.add('stw-title-doodle');icon.setAttribute('viewBox','0 0 48 48');icon.setAttribute('aria-hidden','true');icon.innerHTML=doodles[wi%doodles.length];f.appendChild(icon)}}
  });title.replaceChildren(f);
 }
 function enhanceTitles(root=document){schedulePencils();if(root.matches?.('h1,h2,h3,.brand,.game-nav>span,.stw-home .category'))decorate(root);root.querySelectorAll?.('h1,h2,h3,.brand,.game-nav>span,.stw-home .category').forEach(decorate)}
 function keepPencilsClear(){
  const pencils=[...document.querySelectorAll('.home-pencil-row img')];if(!pencils.length)return;
  const obstacles=[...document.querySelectorAll('body button,body a,body input')].filter(el=>!el.closest('.stw-home')&&getComputedStyle(el).position==='fixed').map(el=>el.getBoundingClientRect());
  for(const pencil of pencils){const r=pencil.getBoundingClientRect();pencil.style.visibility=obstacles.some(b=>r.left<b.right+8&&r.right>b.left-8&&r.top<b.bottom+8&&r.bottom>b.top-8)?'hidden':''}
 }
 let pencilFrame=0;function schedulePencils(){cancelAnimationFrame(pencilFrame);pencilFrame=requestAnimationFrame(keepPencilsClear)}
 window.addEventListener('resize',schedulePencils);window.addEventListener('scroll',schedulePencils,{passive:true});
 function init(){document.body.classList.add('stw-site-theme');enhanceTitles();let pending=false;
  const observer=new MutationObserver(records=>{if(!records.some(r=>(r.target.nodeType===1?r.target:r.target.parentElement)?.closest('h1,h2,h3,.brand,.game-nav>span,.stw-home .category')||[...r.addedNodes].some(n=>n.nodeType===1&&!n.matches?.('.stw-wave-word,.stw-wave-letter,.stw-title-doodle'))))return;if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;enhanceTitles()})});observer.observe(document.body,{childList:true,characterData:true,subtree:true});
 }
 window.SpillTheme={enhanceTitles};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
