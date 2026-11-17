/* Existing vocabulary games and a quiet, user-supplied UI click. */
(()=>{
 'use strict';
 const originalSfx=sfx,click=new Audio('assets/sounds/site-click.mp3');click.preload='auto';click.volume=.28;let last=-Infinity;
 const special=new Set(['door','hum','floor','ding','print']);
 sfx=function(name){
  if(S.snd===false||window.SharedGame?.replaying)return;
  if(special.has(name))return originalSfx(name);
  const now=performance.now();if(now-last<70)return;last=now;
  click.pause();try{click.currentTime=0}catch{}click.play().catch(()=>{});
 };
 document.addEventListener('click',e=>{if(e.target.closest?.('button,a,input[type=checkbox],input[type=radio],summary')&&!e.target.closest('#ttPrint,#ftPrint,#ftDoor,#elbt,[data-time-stop],#ftNext'))sfx('click')},true);
 document.addEventListener('click',e=>{if(e.target.closest?.('#sndbtn')&&S.snd===false){click.pause();try{click.currentTime=0}catch{}}});
 const games=[
  ['alias','Alias','Explain a word without saying it.'],
  ['taboo','Taboo','Explain a word without the forbidden words.'],
  ['jeo','Jeopardy','Choose a category and play for points.'],
  ['craft','Word Craft','Build words and explore word families.']
 ];
 wordsView=function(){return `<section class="vocabulary-page"><h1 class="vocabulary-title">Vocabulary</h1><div class="vocabulary-games">${games.map(([id,name,description],i)=>`<button class="vocabulary-game" data-vocabulary-game="${id}"><span>${esc(name)}</span><small>${esc(description)}</small><img class="topic-pencil" src="assets/pencils/pencil-${i+1}.svg" alt="" aria-hidden="true"></button>`).join('')}</div></section>`};
 bindWords=function(){document.querySelectorAll('[data-vocabulary-game]').forEach(b=>b.onclick=()=>{const game=b.dataset.vocabularyGame;if(game==='craft'){go('gram');S.gmode='craft';save();gmNew();return}go(game)})};
 window.SiteInteractions={get clickAudio(){return click},games};
})();
