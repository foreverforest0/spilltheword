/* One coin develops one scene; five speaking questions share the same picture. */
(()=>{
 const sceneNumbers=[...new Set(SCN.scp.map(row=>row[0]))];
 let queue=[];
 function start(){
  let current=null,question=0,opened=false,busy=false;
  setView(`<section class="panel k-card cbpanel scene-booth-page"><div class="cbbar"><button class="lvb" id="sceneBack">← Topics</button><h2>Present Continuous: scenes</h2><div><button class="lvb" id="sceneHint">Hint</button> <button class="lvb" id="sceneNew">New photo</button></div></div><p class="muted small">Insert the coin to print one picture. Click the picture for a magnifying glass and five questions. Say your answers out loud.</p><div class="cbh" id="sceneHintText" hidden></div><div class="scene-booth-layout"><div class="scene-machine" data-phase="idle"><img class="scene-cabinet" src="photobooth/assets/booth.webp" alt="Our illustrated photobooth"><div class="scene-sign">PHOTOGRAPHS</div><div class="scene-door"><img src="photobooth/assets/curtain.webp" alt="" class="scene-curtain"><span class="scene-count" aria-live="polite"></span></div><button class="scene-coin" aria-label="Insert coin"><img src="photobooth/assets/coin.webp" alt=""><span>Insert coin</span></button></div><div class="scene-output" aria-live="polite"></div></div></section>`);
  const page=$('#view .scene-booth-page'),machine=page.querySelector('.scene-machine'),output=page.querySelector('.scene-output'),coin=page.querySelector('.scene-coin');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,reduced?10:ms));
  $('#sceneBack').onclick=spSetup;
  $('#sceneNew').onclick=start;
  $('#sceneHint').onclick=()=>{const box=$('#sceneHintText');box.hidden=!box.hidden;box.textContent='Use am / is / are + verb-ing. '+(current&&opened?current.questions[question][2]:'She is reading. They are playing.')};
  const draw=()=>{
   CardStacks.scene(output,current,page,i=>{question=i;$('#sceneHintText').hidden=true},value=>{opened=value;$('#sceneHintText').hidden=true});
  };
  coin.onclick=async()=>{
   if(busy)return;busy=true;coin.disabled=true;machine.dataset.phase='printing';
   if(!queue.length)queue=shuffle(sceneNumbers.slice());const number=queue.pop();
   current={src:'ch/sc'+number+'.jpg',questions:SCN.scp.filter(row=>row[0]===number).slice(0,5).map(row=>[row[0],row[1].split('?')[0]+'?',row[2]])};
   try{sfx('click')}catch{};
   for(const n of ['3','2','1']){if(!page.isConnected)return;page.querySelector('.scene-count').textContent=n;await wait(420)}
   if(!page.isConnected)return;page.querySelector('.scene-count').textContent='';machine.dataset.phase='ready';draw();
   output.querySelector('.scene-photo').animate?.([{opacity:0,transform:'translate(-65%,140px) rotate(-6deg) scale(.3)'},{opacity:1,transform:'translate(0,0) rotate(0) scale(1)'}],{duration:reduced?1:850,easing:'ease-out'});
  };
 }
 DMT.scp=1;DMTF.scp=start;
})();
