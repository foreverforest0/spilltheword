/* Level colours are shared by catalogs, cards and exercise controls. */
(()=>{
 const palettes={
  kids:{cards:['#E1E629','#FFB2D1','#16277F','#F04423'],ink:'#16277F',paper:'#E1E629',strong:'#16277F',onStrong:'#FCF6EA',cardInks:['#16277F','#16277F','#FCF6EA','#09133F']},
  a1:{cards:['#E1E629','#FFB2D1','#16277F','#F04423'],ink:'#16277F',paper:'#E1E629',strong:'#16277F',onStrong:'#FCF6EA',cardInks:['#16277F','#16277F','#FCF6EA','#09133F']},
  a2:{cards:['#E1E629','#FFB2D1','#16277F','#F04423'],ink:'#16277F',paper:'#E1E629',strong:'#16277F',onStrong:'#FCF6EA',cardInks:['#16277F','#16277F','#FCF6EA','#09133F']},
  b1:{cards:['#001166','#f0f0e7'],ink:'#001166',paper:'#f0f0e7',strong:'#001166',onStrong:'#f0f0e7'},
  b2:{cards:['#A9C632','#C8D2A6','#FFC4C5','#1D2E1B'],ink:'#1D2E1B',paper:'#C8D2A6',strong:'#1D2E1B',onStrong:'#C8D2A6'},
  c1:{cards:['#A9C632','#C8D2A6','#FFC4C5','#1D2E1B'],ink:'#1D2E1B',paper:'#C8D2A6',strong:'#1D2E1B',onStrong:'#C8D2A6'}
 };
 function level(){const root=document.querySelector('#view');return root?.querySelector('.grammar-page,.sx-catalog')?(S.glevel||'b1'):(root?.querySelector('[data-pond-topic]')?.dataset.pondTopic.split(':')[0]||root?.querySelector('.sx-dive')?.dataset.topic.split(':')[0]||S.splevel||S.glevel||'b1')}
 const current=()=>palettes[level()]||palettes.b1;
 function sync(){
  const root=document.querySelector('#view');if(!root)return;
  const active=tab==='gram'||!!root.querySelector('.cbpanel,.sx-dive,.sx-catalog,.pond-page,.b1-stage,.bv-page,.future-page');
  if(!active){delete document.body.dataset.studyLevel;return}
  document.body.dataset.studyLevel=level();const p=current(),style=document.body.style;
  for(const [key,value]of Object.entries({ink:p.ink,paper:p.paper,strong:p.strong,'on-strong':p.onStrong,'card-1':p.cards[0],'card-2':p.cards[1]}))style.setProperty('--lesson-'+key,value);
  root.querySelectorAll('.grammar-topic,.sx-topic').forEach((el,i)=>{const c=p.cards[i%p.cards.length];el.style.setProperty('--lesson-card',c);el.style.setProperty('--lesson-card-ink',p.cardInks?.[i%p.cards.length]||(c===p.strong?p.onStrong:p.ink))});
 }
 window.LevelDesign={palettes,current,level,sync};
 const previous=setView;setView=function(html){const result=previous(html);sync();return result};
 let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;sync()})}).observe(document.getElementById('view'),{childList:true,subtree:true});
 sync();
})();
