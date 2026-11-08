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
  const updateQuestion=()=>{
   page.querySelector('.scene-question').textContent=current.questions[question][1];
   page.querySelectorAll('[data-scene-question]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.sceneQuestion===question)));
   $('#sceneHintText').hidden=true;
  };
  const draw=()=>{
   output.innerHTML=`<article class="scene-photo${opened?' opened':''}"><button class="scene-photo-toggle" aria-label="${opened?'Close question and magnifier':'Open picture and questions'}" aria-expanded="${opened}"></button>${opened?'<div class="scene-question-copy"><p class="scene-question"></p><div class="scene-question-tabs" aria-label="Five questions">'+current.questions.map((_,i)=>`<button class="lvb" data-scene-question="${i}" aria-pressed="${i===question}">${i+1}</button>`).join('')+'</div></div>':''}</article>`;
   const toggle=output.querySelector('.scene-photo-toggle');
   if(opened){
    const w=Math.round(Math.min(620,Math.max(250,output.clientWidth)));
    const lens=magPic(current.src,w,'',Math.round(w*.7));lens.querySelector('.mglight').remove();lens.classList.add('lit');toggle.append(lens);
    // Keep the picture lit while the magnifier reveals a larger detail under the cursor.
    const move=lens.onpointermove,down=lens.onpointerdown;
    lens.onpointermove=e=>{lens.classList.remove('lit');move(e);lens.classList.add('lit')};
    lens.onpointerdown=e=>{lens.classList.remove('lit');down(e);lens.classList.add('lit')};
   }else{const img=document.createElement('img');img.src=current.src;img.alt='Illustrated Present Continuous scene';toggle.append(img)}
   toggle.onclick=()=>{opened=!opened;$('#sceneHintText').hidden=true;draw()};
   if(opened){updateQuestion();output.querySelectorAll('[data-scene-question]').forEach(b=>b.onclick=()=>{question=+b.dataset.sceneQuestion;updateQuestion()})}
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
