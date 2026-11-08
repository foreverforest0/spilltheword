/* Clear imperative commands, one-object process cards and direct shelf sorting. */
(()=>{
 const items={
  keys:{src:'ch/o17.webp',name:'keys'},camera:{src:'ch/o16.webp',name:'camera'},books:{src:'ch/o10.webp',name:'books'},
  notebook:{src:'ch/g_notebook.webp',name:'notebook'},wallet:{src:'ch/cw_o_wallet.webp',name:'wallet'},passport:{src:'ch/cw_o_passport.webp',name:'passport'},
  umbrella:{src:'ch/cw_o_umbrella.webp',name:'umbrella'},apples:{src:'ch/o04.webp',name:'apples'},cookies:{src:'ch/o07.webp',name:'cookies'},
  water:{src:'ch/p_water.webp',name:'water'},bananas:{src:'ch/p_bananas.webp',name:'bananas'},bears:{src:'ch/o11.webp',name:'teddy bears'}
 };
 const trips=[
  {name:'A walk in the city',steps:[['put','keys'],['put','books'],['out','books'],['put','camera'],['swap','camera','notebook'],['remember','water']]},
  {name:'A picnic in the park',steps:[['put','apples'],['put','books'],['swap','books','cookies'],['remember','water'],['out','apples'],['put','bananas']]},
  {name:'A day at school',steps:[['put','books'],['put','wallet'],['swap','wallet','notebook'],['put','camera'],['out','camera'],['remember','keys']]},
  {name:'Photos in the park',steps:[['put','camera'],['put','passport'],['out','passport'],['put','books'],['swap','books','water'],['remember','keys']]},
  {name:'A train journey',steps:[['put','passport'],['put','camera'],['swap','camera','notebook'],['put','cookies'],['out','cookies'],['remember','wallet']]},
  {name:'A visit to a friend',steps:[['put','bears'],['put','books'],['swap','books','cookies'],['put','camera'],['out','camera'],['remember','water']]},
  {name:'A visit to the library',steps:[['put','books'],['put','apples'],['out','apples'],['put','camera'],['swap','camera','notebook'],['remember','keys']]},
  {name:'A rainy day out',steps:[['put','umbrella'],['put','camera'],['swap','camera','wallet'],['put','bears'],['out','bears'],['remember','keys']]}
 ];
 let tripQueue=[];
 const noun=k=>'the '+items[k].name;
 const command=([type,key,replacement])=>type==='out'?'Take '+noun(key)+' out of the bag.':type==='swap'?'Replace '+noun(key)+' with '+noun(replacement)+'.':type==='remember'?'Don’t forget to put '+noun(key)+' in the bag.':'Put '+noun(key)+' in the bag.';
 let packDispose=null;
 const beforePracticalView=setView;
 setView=function(html){if(packDispose){packDispose();packDispose=null}return beforePracticalView(html)};
 function packCommands(){
  if(!tripQueue.length)tripQueue=shuffle(trips.slice());const trip=tripQueue.pop();
  const st=dmShell('pkb','Pack the bag','Read one command at a time. Drag the named object into or out of the bag, or click it. To replace something, take the old item out and put the new one in. A correct action brings the next command.',[]);
  $('#dmhint').remove();$('#dmnew').textContent='New trip';$('#dmnew').onclick=packCommands;st.classList.add('pack-commands-stage');
  st.innerHTML=`<div class="pack-command-copy"><p class="pack-trip">${esc(trip.name)}</p><p class="pack-step"></p><p class="pack-command" id="packCommand" aria-live="polite"></p></div><div class="command-packing"><section class="pack-table" data-spatial-zone="pack-table" aria-label="On the table"><h3>On the table</h3><div class="pack-object-grid"></div></section><section class="pack-target" data-spatial-zone="pack-bag" aria-label="In the bag"><h3>In the bag</h3><img class="command-bag-art" src="ch/sp_bag.webp" alt=""><div class="pack-object-grid"></div></section></div><p id="packFeedback" role="status"></p>`;
  const packed=new Set(),elements=new Map(),table=st.querySelector('.pack-table .pack-object-grid'),bag=st.querySelector('.pack-target .pack-object-grid');let step=0,target=new Set(),busy=false,timer=null;
  packDispose=()=>clearTimeout(timer);
  const required=[...new Set(trip.steps.flatMap(s=>s.slice(1)))],others=shuffle(Object.keys(items).filter(k=>!required.includes(k))).slice(0,Math.max(0,8-required.length));
  const renderCommand=()=>{
   if(step>=trip.steps.length){busy=true;st.dataset.complete='true';st.querySelector('.pack-step').textContent='Ready to go';$('#packCommand').textContent='Your bag is packed!';$('#packFeedback').textContent='You followed every command.';elements.forEach(el=>el.disabled=true);return}
   busy=false;target=new Set(packed);const [type,key,replacement]=trip.steps[step];if(type==='out')target.delete(key);else if(type==='swap'){target.delete(key);target.add(replacement)}else target.add(key);
   st.dataset.step=step;st.dataset.commandType=type;st.querySelector('.pack-step').textContent='Command '+(step+1)+' of '+trip.steps.length;$('#packCommand').textContent=command(trip.steps[step]);$('#packFeedback').textContent='';
  };
  const move=(el,inBag)=>{
   if(busy)return;const key=el.dataset.packItem;if(packed.has(key)===inBag)return;
   if(target.has(key)!==inBag){$('#packFeedback').textContent='Not this action. '+command(trip.steps[step]);return}
   if(inBag)packed.add(key);else packed.delete(key);(inBag?bag:table).append(el);el.setAttribute('aria-pressed',String(inBag));
   if(packed.size===target.size&&[...packed].every(k=>target.has(k))){busy=true;$('#packFeedback').textContent='That’s right!';timer=setTimeout(()=>{if(!st.isConnected)return;step++;renderCommand()},matchMedia('(prefers-reduced-motion: reduce)').matches?80:700)}
   else{const missing=[...target].filter(k=>!packed.has(k)),extra=[...packed].filter(k=>!target.has(k));$('#packFeedback').textContent=extra.length?'Now take '+noun(extra[0])+' out.':'Now put '+noun(missing[0])+' in.'}
  };
  shuffle([...required,...others]).forEach(key=>{
   const item=items[key],el=document.createElement('button');el.type='button';el.className='practical-object';el.dataset.packItem=key;el.setAttribute('aria-pressed','false');el.innerHTML=`<img src="${item.src}" alt="" draggable="false"><span>${esc(item.name)}</span>`;
   spatialDrag(el,zone=>{if(zone&&zone.closest('.pack-commands-stage')===st)move(el,zone.dataset.spatialZone==='pack-bag')});el.onclick=()=>{if(!el.consumeDrag())move(el,!packed.has(key))};elements.set(key,el);table.append(el);
  });
  st.dataset.trip=trip.name;renderCommand();
 }
 DMTF.pkb=packCommands;dmPackCmd=packCommands;
 const packDescription=SPT.find(t=>t.id==='pkb');if(packDescription)packDescription.d='Follow one command: put in, take out, replace or don’t forget.';

 const processes=[
  ['make tea','ch/r_kettle.webp',['boil','put in','pour','wait','take out']],
  ['wash your hands','ch/b_soap.webp',['turn on','wet','use','rub','rinse','dry']],
  ['take a good selfie','ch/o16.webp',['find','hold','look','smile','press','choose']],
  ['make a sandwich','ch/p_bread.webp',['take','slice','put','add','cut','eat']],
  ['charge your phone',PICS['ut flip'],['take','plug in','connect','wait','check','unplug']],
  ['make an omelette','ch/p_eggs.webp',['break','add','mix','melt','pour','fold']],
  ['brush your teeth','shop/personal-care/berry-kids-toothpaste.webp',['put','brush','rinse','spit','wash']],
  ['use an umbrella','ch/cw_o_umbrella.webp',['open','hold','lift','shake','close']],
  ['make coffee','ch/o06.webp',['boil','put','pour','add','stir','drink']],
  ['clean your room','ch/r_robot.webp',['pick up','put away','wipe','turn on','clean','open']],
  ['order food online','ch/g_laptop.webp',['open','choose','add','check','pay','wait']],
  ['plan a good day','ch/r_aclock.webp',['set','make','choose','start','finish','rest']]
 ];
 let processQueue=[];
 function processCards(){
  if(processQueue.length<6)processQueue=shuffle(processes.slice());const round=processQueue.splice(0,6);
  setView(`<section class="panel k-card cbpanel process-page"><div class="cbbar"><button class="lvb" id="processBack">← Topics</button><h2>How to?</h2><div><button class="lvb" id="processHints" aria-expanded="false">Hints</button> <button class="lvb" id="processNew">New cards</button></div></div><p class="muted small">Look at one object and explain the process. Click its card for useful verbs; click again to turn it back.</p><div class="process-hints" id="processHintText" hidden>First / Firstly → Then → Next → After that → Finally</div><div class="process-grid">${round.map(([title,src,verbs],i)=>`<button class="process-card" type="button" data-process="${esc(title)}" aria-pressed="false" style="--process-color:${['#CCE5FF','#F4DDF4','#BEC3EC','#F5E99A','#B2BC70','#FF9275'][i]}"><span class="process-front"><span class="process-picture"><img src="${src}" alt="" draggable="false"></span><span class="process-question">How to ${esc(title)}?</span></span><span class="process-back" hidden><span class="process-question">How to ${esc(title)}?</span><span class="process-verbs" role="list">${verbs.map(v=>`<span role="listitem">${esc(v)}</span>`).join('')}</span></span></button>`).join('')}</div></section>`);
  $('#processBack').onclick=spSetup;$('#processNew').onclick=processCards;
  $('#processHints').onclick=()=>{const box=$('#processHintText');box.hidden=!box.hidden;$('#processHints').setAttribute('aria-expanded',String(!box.hidden))};
  $('#view .process-grid').querySelectorAll('.process-card').forEach(card=>card.onclick=()=>{
   const open=card.getAttribute('aria-pressed')!=='true';card.setAttribute('aria-pressed',String(open));card.querySelector('.process-front').hidden=open;card.querySelector('.process-back').hidden=!open;
   if(!matchMedia('(prefers-reduced-motion: reduce)').matches)card.animate([{transform:'perspective(800px) rotateY(-75deg)'},{transform:'perspective(800px) rotateY(0)'}],{duration:280,easing:'ease-out'});
  });
 }
 DMT.how=1;DMTF.how=processCards;
 const previousCards=renderCards;
 renderCards=function(){if(CB?.task==='how')return processCards();return previousCards()};

 const foods=[
  {key:'apples',name:'apples',type:'c',src:'ch/o04.webp'},{key:'carrots',name:'carrots',type:'c',src:'ch/o05.webp'},
  {key:'eggs',name:'eggs',type:'c',src:'ch/p_eggs.webp'},{key:'lemons',name:'lemons',type:'c',src:'ch/p_lemons.webp'},
  {key:'mushrooms',name:'mushrooms',type:'c',src:'ch/p_mushrooms.webp'},{key:'pears',name:'pears',type:'c',src:'ch/p_pears.webp'},
  {key:'bananas',name:'bananas',type:'c',src:'ch/p_bananas.webp'},{key:'strawberries',name:'strawberries',type:'c',src:'shop/produce/strawberries.webp'},
  {key:'milk',name:'milk',type:'u',src:'shop/dairy/whole-milk.webp'},{key:'butter',name:'butter',type:'u',src:'ch/p_butter.webp'},
  {key:'cheese',name:'cheese',type:'u',src:'ch/p_cheese.webp'},{key:'ham',name:'ham',type:'u',src:'ch/p_ham.webp'},
  {key:'water',name:'water',type:'u',src:'ch/p_water.webp'},{key:'lemonade',name:'lemonade',type:'u',src:'ch/p_lemonade.webp'},
  {key:'yogurt',name:'yogurt',type:'u',src:'shop/dairy/greek-yogurt-plain.webp'},{key:'cream',name:'cream',type:'u',src:'shop/dairy/cooking-cream.webp'}
 ];
 function shelfFridge(){
  const round=shuffle([...shuffle(foods.filter(f=>f.type==='c')).slice(0,4),...shuffle(foods.filter(f=>f.type==='u')).slice(0,4)]);
  const st=dmShell('frg','Fridge','Drag each food onto the correct shelf: countable at the top, uncountable below. You can also select a food and click a shelf. Click a food on a shelf to return it to the table, then press Check.',[]);
  $('#dmhint').remove();$('#dmnew').textContent='New food';$('#dmnew').onclick=shelfFridge;st.classList.add('shelf-fridge-stage');
  st.innerHTML=`<div class="shelf-workspace"><section class="shelf-table" aria-label="Food on the table"><h3>On the table</h3><div class="shelf-bank" data-spatial-zone="food-table"></div><button class="lvb" id="shelfCheck">Check</button><p id="shelfFeedback" role="status"></p></section><div class="open-shelf-fridge"><img class="shelf-fridge-photo" src="ch/fr_open.webp" alt="Open cream fridge"><section class="food-shelf countable-shelf" data-spatial-zone="c" role="group" tabindex="0" aria-label="Countable shelf"><h3>Countable</h3><div class="food-shelf-items"></div></section><section class="food-shelf uncountable-shelf" data-spatial-zone="u" role="group" tabindex="0" aria-label="Uncountable shelf"><h3>Uncountable</h3><div class="food-shelf-items"></div></section></div></div>`;
  const bank=st.querySelector('.shelf-bank');let selected=null;
  const deselect=()=>{st.querySelectorAll('.shelf-food').forEach(el=>{el.classList.remove('selected');el.setAttribute('aria-pressed','false')});selected=null};
  const move=(el,zone)=>{
   if(!zone||zone.closest('.shelf-fridge-stage')!==st)return;const shelf=zone.dataset.spatialZone,target=shelf==='food-table'?bank:zone.querySelector('.food-shelf-items');if(el.parentNode===target)return;
   if(shelf!=='food-table'&&target.childElementCount>=4){$('#shelfFeedback').textContent='This shelf is full. Move an item back to the table or onto the other shelf.';return}
   target.append(el);el.dataset.shelf=shelf;deselect();st.querySelectorAll('.shelf-food').forEach(b=>{b.classList.remove('food-correct','food-incorrect');b.removeAttribute('data-result')});$('#shelfFeedback').textContent='';
  };
  round.forEach(food=>{
   const el=document.createElement('button');el.type='button';el.className='shelf-food';el.dataset.food=food.key;el.dataset.foodType=food.type;el.dataset.shelf='food-table';el.setAttribute('aria-pressed','false');el.innerHTML=`<img src="${food.src}" alt="" draggable="false"><span>${esc(food.name)}</span>`;
   spatialDrag(el,zone=>move(el,zone));el.onclick=()=>{
    if(el.consumeDrag())return;if(el.dataset.shelf!=='food-table'){move(el,bank);return}
    const prior=selected===el;deselect();if(!prior){selected=el;el.classList.add('selected');el.setAttribute('aria-pressed','true')}
   };bank.append(el);
  });
  st.querySelectorAll('.food-shelf').forEach(zone=>{zone.onclick=e=>{if(selected&&!e.target.closest('.shelf-food'))move(selected,zone)};zone.onkeydown=e=>{if(selected&&e.target===zone&&(e.key==='Enter'||e.key===' ')){e.preventDefault();move(selected,zone)}}});
  $('#shelfCheck').onclick=()=>{
   let placed=0,correct=0;st.querySelectorAll('.shelf-food').forEach(el=>{if(el.dataset.shelf==='food-table')return;placed++;const good=el.dataset.shelf===el.dataset.foodType;if(good)correct++;el.dataset.result=good?'correct':'incorrect';el.classList.toggle('food-correct',good);el.classList.toggle('food-incorrect',!good)});
   $('#shelfFeedback').textContent=placed?correct+' / '+placed+' correct.'+(placed<round.length?' '+(round.length-placed)+' still on the table.':correct===round.length?' All sorted!':' Move the marked items to the other shelf.'):'Drag the food onto the shelves first.';
  };
 }
 DMTF.frg=shelfFridge;
 const legacyFridge=dmFridge;
 dmFridge=function(quantities){return quantities?legacyFridge(quantities):shelfFridge()};
})();
