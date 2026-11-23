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
 const buttons={
  kids:['#76204e','#fbd6e9'],a1:['#244281','#dce8ff'],a2:['#a12f22','#ffe2ce'],
  b1:['#001166','#e5eaff'],b2:['#2d521e','#e1ebcc'],c1:['#523574','#ede1fa']
 };
 const controls=[
  ['back',/^(?:back to )?(?:(?:kids|a[12]|b[12]|c1) )?(?:all )?topics$|^exercises$/i],
  ['primary',/^check(?: (?:answer|tag|sentence|question))?$|^start(?: practice| game)?$|^next(?: (?:step|card|question|sentence|task|photo))?$/i],
  ['answer',/^(?:show|hide) (?:the right )?(?:answers?|examples?|models?)$/i],
  ['secondary',/^(?:hint(?: \(\d+\))?|how to\??|previous(?: (?:photo|sentence|question|step))?|back|new (?:cards|round|sentence|ticket)|print|clear|reset|try again|undo strikeout|cross out|skip)$/i]
 ];
 function styleControls(root){
  root.querySelectorAll('button:not([data-dot]),summary,a[href]').forEach(control=>{
   const label=control.textContent.trim().replace(/^[^a-z]+|[^a-z0-9?)]+$/gi,'').trim();
   const name=control.getAttribute('aria-label')||'';
   const kind=controls.find(([,match])=>match.test(label)||match.test(name))?.[0];
   const role=control.classList.contains('stw-back-to-topics')?'back':kind;
   if(role)control.dataset.lessonControl=role;
   else if(control.dataset.lessonControl)delete control.dataset.lessonControl;
   if(role==='back'&&control.textContent!=='← Back to topics'){
    control.textContent='← Back to topics';
    if(name)control.setAttribute('aria-label','Back to topics');
   }
  });
 }
 function level(){const root=document.querySelector('#view');return root?.querySelector('.grammar-page,.sx-catalog')?(S.glevel||'b1'):(root?.querySelector('[data-practice-level]')?.dataset.practiceLevel||root?.querySelector('[data-pond-topic]')?.dataset.pondTopic.split(':')[0]||root?.querySelector('.sx-dive')?.dataset.topic.split(':')[0]||S.splevel||S.glevel||'b1')}
 const current=()=>palettes[level()]||palettes.b1;
 function sync(){
  const root=document.querySelector('#view');if(!root)return;
  const active=tab==='gram'||!!root.querySelector('.cbpanel,.sx-dive,.sx-catalog,.pond-page,.b1-stage,.bv-page,.future-page,[data-practice-level],.b1-pattern-practice,.ks-page,.pn-page,.ub-page,.tybar,.rb-story');
  if(!active){delete document.body.dataset.studyLevel;return}
  document.body.dataset.studyLevel=level();const p=current(),style=document.body.style;
  const [button,buttonSoft]=buttons[level()]||buttons.b1;
  styleControls(root);
  for(const [key,value]of Object.entries({ink:p.ink,paper:p.paper,strong:p.strong,'on-strong':p.onStrong,'card-1':p.cards[0],'card-2':p.cards[1],button,'button-soft':buttonSoft}))style.setProperty('--lesson-'+key,value);
  root.querySelectorAll('.grammar-topic,.sx-topic').forEach((el,i)=>{const c=p.cards[i%p.cards.length];el.style.setProperty('--lesson-card',c);el.style.setProperty('--lesson-card-ink',p.cardInks?.[i%p.cards.length]||(c===p.strong?p.onStrong:p.ink))});
 }
 window.LevelDesign={palettes,current,level,sync};
 const previous=setView;setView=function(html){const result=previous(html);sync();return result};
 let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;sync()})}).observe(document.getElementById('view'),{childList:true,subtree:true,characterData:true});
 sync();
})();
