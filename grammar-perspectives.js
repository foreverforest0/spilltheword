/* Correct a report, change the observer's viewpoint, and listen before sorting. */
(()=>{
 let dispose=null;
 const previousView=setView;
 setView=function(html){if(dispose){dispose();dispose=null}return previousView(html)};
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const pictureKeys=['o16','o15','o14','o12','o04','o10','o07','o17'];
 const objects=pictureKeys.map(key=>DMO.find(o=>o[0]===key));
 const picture=o=>`<img class="demo-object-image" src="ch/${o[0]}.webp" alt="" draggable="false">`;
 const demonstrative=(o,near)=>o[1]==='p'?(near?'these':'those'):(near?'this':'that');
 const capital=s=>s[0].toUpperCase()+s.slice(1);
 const statement=(o,word)=>capital(word)+(o[1]==='p'?' are ':' is ')+o[2]+'.';
 const variants=(kind,active)=>{
  const host=$('#view .cbbar');
  host.insertAdjacentHTML('afterend',`<nav class="spatial-variants" aria-label="Practice mode">${(kind==='nof'?[['new','Change viewpoint'],['old','Move objects']]:[['new','Listen and sort'],['old','Look and sort']]).map(([id,name])=>`<button class="lvb" data-spatial-variant="${id}" aria-pressed="${id===active}">${name}</button>`).join('')}</nav>`);
  host.parentNode.querySelectorAll('[data-spatial-variant]').forEach(button=>button.onclick=()=>{if(button.getAttribute('aria-pressed')==='true')return;button.dataset.spatialVariant==='old'?legacy(kind):kind==='nof'?viewpoint():listeningBaskets()});
 };
 const oldSpatialGame=spatialGame;
 function legacy(kind){oldSpatialGame(kind==='fbk');variants(kind,'old');$('#dmnew').onclick=()=>legacy(kind)}

 const reporterRows=[
  ['reading a book','She','sleeping',['reading','reading a book']],
  ['brushing her hair','She','washing her hands',['brushing her hair']],
  ['brushing her teeth','She','eating pizza',['brushing her teeth']],
  ['drawing a picture','She','writing a letter',['drawing','drawing a picture','painting','painting a picture']],
  ['drinking coffee','She','running',['drinking','drinking coffee','drinking tea','drinking a cup of coffee','drinking a cup of tea']],
  ['knitting','She','sleeping',['knitting','knitting a scarf']],
  ['shopping','She','swimming',['shopping','buying food','buying groceries']],
  ['typing on a laptop','She','sleeping',['typing','typing on a laptop','using a laptop','using the laptop','working on a laptop','working on the laptop','using a computer']],
  ['talking on the phone','She','singing',['talking on the phone','talking on her phone','making a phone call']],
  ['watering the plants','She','cooking',['watering the plants','watering plants','watering a plant']],
  ['cooking soup','She','drinking',['cooking','cooking soup','making soup','cooking dinner','cooking lunch','cooking food']],
  ['painting a wall','She','reading',['painting','painting a wall','painting the wall']],
  ['dancing','He','swimming',['dancing']],
  ['singing','She','sleeping',['singing','singing a song']],
  ['riding a bike','He','walking',['riding a bike','riding his bike','riding a bicycle','cycling']],
  ['running','She','sleeping',['running','jogging']]
 ].map(([key,subject,wrong,answers])=>({key,subject,wrong,answers,src:ACTIONS.find(a=>a[0]===key)[1]}));
 const reporterNorm=s=>String(s).toLowerCase().trim().replace(/[’‘]/g,"'").replace(/\b(she|he)'s\b/g,'$1 is').replace(/\bisn't\b/g,'is not').replace(/\b(?:but|and)\b/g,' ').replace(/[^a-z\s]/g,' ').replace(/\s+/g,' ').trim();
 let reporterQueue=[];
 function reporter(){
  if(!reporterQueue.length)reporterQueue=shuffle(reporterRows.slice());const row=reporterQueue.pop(),subject=row.subject.toLowerCase();
  setView(`<section class="panel k-card cbpanel reporter-page"><div class="cbbar"><button class="lvb" id="reporterBack">← Topics</button><h2>Correct the reporter</h2><div><button class="lvb" id="reporterHint" aria-expanded="false">Hint</button> <button class="lvb" id="reporterNew">New picture</button></div></div><p class="muted small">The reporter is wrong. Write a negative sentence about the report, then a positive sentence about the picture.</p><div class="reporter-hint" id="reporterHintText" hidden>${row.subject} isn’t + verb-ing. ${row.subject} is + verb-ing. You can also use “is not”.</div><article class="reporter-card"><div class="reporter-picture"><img src="${row.src}" alt="${row.subject} is ${row.key}." draggable="false"></div><div class="reporter-quote"><span>The reporter says:</span><p>${row.subject} is ${row.wrong}.</p></div></article><label class="reporter-label" for="reporterAnswer">Correct the report</label><textarea id="reporterAnswer" rows="2" spellcheck="false" placeholder="${row.subject} isn’t … ${row.subject} is …"></textarea><button class="lvb" id="reporterCheck">Check</button><p id="reporterFeedback" role="status" aria-live="polite"></p></section>`);
  const page=$('#view .reporter-page');page.dataset.action=row.key;page.dataset.subject=row.subject;page.dataset.wrong=row.wrong;
  $('#reporterBack').onclick=spSetup;$('#reporterNew').onclick=reporter;
  $('#reporterHint').onclick=()=>{const box=$('#reporterHintText');box.hidden=!box.hidden;$('#reporterHint').setAttribute('aria-expanded',String(!box.hidden))};
  $('#reporterCheck').onclick=()=>{
   const answer=reporterNorm($('#reporterAnswer').value),negative=subject+' is not '+row.wrong;
   if(row.answers.some(action=>answer===negative+' '+subject+' is '+action)){$('#reporterFeedback').textContent='Correct! '+row.subject+' isn’t '+row.wrong+'. '+row.subject+' is '+row.answers[0]+'.';return}
   $('#reporterFeedback').textContent=!answer.startsWith(negative)?'First, say that the reporter’s action isn’t happening.':answer===negative?'Now add a positive sentence about the picture.':'Check the main action in the picture and use is + verb-ing.';
  };
  $('#reporterAnswer').oninput=()=>{$('#reporterFeedback').textContent=''};
 }
 DMT.pcr=1;DMTF.pcr=reporter;SPSHORT.pcr='Correct the reporter';SPT.push({id:'pcr',n:'Present Continuous: Correct the reporter',d:'Correct a false report with a negative and a positive sentence.'});
 for(const level of ['kids','a1','a2']){
  const group=SPGRP[level].find(g=>/^\d+ · Present Continuous$/.test(g[0]));if(group&&!group[1].includes('pcr'))group[1].push('pcr');
  const list=SPLV.find(l=>l[0]===level)?.[2];if(list&&!list.includes('pcr'))list.push('pcr');
 }

 function viewpoint(){
  const st=dmShell('nof','Near or Far','The objects stay still. Read the sentence, then move the observer to the other side. Choose this, that, these or those from the new viewpoint.',[]);
  $('#dmhint').remove();$('#dmnew').textContent='New object';variants('nof','new');st.classList.add('perspective-stage');
  const singles=shuffle(objects.filter(o=>o[1]==='s')),plurals=shuffle(objects.filter(o=>o[1]==='p'));
  const arranged=shuffle([singles[0],singles[1],plurals[0],plurals[1]]).map(o=>({o,side:'left'})).concat(shuffle([singles[2],singles[3],plurals[2],plurals[3]]).map(o=>({o,side:'right'})));
  let side='left',active=-1,phase='observe',before='',queue=shuffle(arranged.map((_,i)=>i));
  st.innerHTML=`<div class="perspective-board" data-observer="left"><div class="perspective-table">${['left','right'].map(group=>`<div class="perspective-end">${arranged.map(({o,side},i)=>side===group?`<div class="perspective-object" data-view-object="${i}">${picture(o)}<span>${esc(o[2].replace(/^(a|an) /,''))}</span></div>`:'').join('')}</div>`).join('')}</div><div class="observer-track"><div class="observer-marker"><svg viewBox="0 0 62 62" aria-hidden="true"><path d="M12 27Q32 5 52 27Q32 49 12 27Z" fill="#F9F5E6" stroke="#70271F" stroke-width="2"/><circle cx="32" cy="27" r="8" fill="#26422B"/><circle cx="34" cy="24" r="2" fill="#F9F5E6"/></svg><span>You</span></div></div></div><div class="perspective-question"><p class="perspective-before"></p><p id="viewSentence"></p><button class="lvb" id="viewSwitch">Switch sides</button><div class="demonstrative-answers">${['this','that','these','those'].map(word=>`<button class="lvb" data-view-answer="${word}" disabled>${capital(word)}</button>`).join('')}</div><p id="viewFeedback" role="status"></p></div>`;
  const board=st.querySelector('.perspective-board'),sentence=$('#viewSentence'),feedback=$('#viewFeedback');
  const sync=()=>{
   const item=arranged[active],word=demonstrative(item.o,item.side===side);st.dataset.observer=side;st.dataset.target=active;st.dataset.expected=word;st.dataset.phase=phase;
   board.dataset.observer=side;st.querySelectorAll('[data-view-object]').forEach(el=>el.classList.toggle('current',+el.dataset.viewObject===active));
   st.querySelector('.perspective-before').textContent=phase==='answer'?'Before: '+before:'';
   sentence.textContent=phase==='answer'?'___'+(item.o[1]==='p'?' are ':' is ')+item.o[2]+'.':statement(item.o,word);
   st.querySelectorAll('[data-view-answer]').forEach(button=>button.disabled=phase!=='answer');$('#viewSwitch').disabled=phase==='answer';
  };
  const next=()=>{if(!queue.length)queue=shuffle(arranged.map((_,i)=>i));active=queue.pop();phase='observe';feedback.textContent='Move the observer to the other side.';sync()};
  $('#dmnew').onclick=next;
  $('#viewSwitch').onclick=()=>{const item=arranged[active];before=statement(item.o,demonstrative(item.o,item.side===side));side=side==='left'?'right':'left';phase='answer';feedback.textContent='The objects haven’t moved. What changes in the sentence?';sync()};
  st.querySelectorAll('[data-view-answer]').forEach(button=>button.onclick=()=>{
   if(phase!=='answer')return;const item=arranged[active],expected=demonstrative(item.o,item.side===side);
   if(button.dataset.viewAnswer!==expected){feedback.textContent=(item.o[1]==='p'?'More than one object.':'One object.')+' Think about where you are standing now.';return}
   phase='done';feedback.textContent='Correct! '+before.split(' ')[0]+' → '+capital(expected)+'.';sync();
  });
  next();
 }

 function listeningBaskets(){
  const st=dmShell('fbk','Four baskets','Listen to the whole sentence. Choose the matching picture, then a basket. You can also drag the picture. Listen repeats the sentence; Show text reveals it when you need it.',[]);
  $('#dmhint').remove();$('#dmnew').textContent='New round';$('#dmnew').onclick=listeningBaskets;variants('fbk','new');st.classList.add('listening-baskets-stage');
  const singles=shuffle(objects.filter(o=>o[1]==='s')),plurals=shuffle(objects.filter(o=>o[1]==='p'));
  const rounds=shuffle([...singles.map((o,i)=>({o,word:i<2?'this':'that'})),...plurals.map((o,i)=>({o,word:i<2?'these':'those'}))]);
  let index=0,selected=null,busy=false,timer=null,speechTimer=null,speechToken=0,audioEnabled=false;
  st.innerHTML=`<audio id="basketAudio" preload="auto"></audio><div class="listening-controls"><button class="lvb" id="basketListen">Listen</button><button class="lvb" id="basketText" aria-expanded="false">Show text</button><span id="basketProgress"></span></div><p class="basket-transcript" id="basketTranscript" hidden></p><p id="basketFeedback" role="status" aria-live="polite">Press Listen, then choose a picture and a basket.</p><div class="listening-picture-bank"></div><div class="listening-baskets">${['this','that','these','those'].map(word=>`<section class="listening-basket" data-listening-basket="${word}" data-spatial-zone="${word}" role="group" tabindex="0" aria-label="${word} basket"><h3>${word}</h3><div class="listening-sorted"></div></section>`).join('')}</div>`;
  const bank=st.querySelector('.listening-picture-bank'),feedback=$('#basketFeedback'),listen=$('#basketListen'),audio=$('#basketAudio');
  const stopSpeech=()=>{speechToken++;clearTimeout(speechTimer);audio.onplaying=audio.onended=audio.onerror=null;audio.pause();if(window.speechSynthesis)speechSynthesis.cancel();listen.textContent='Listen'};
  dispose=()=>{clearTimeout(timer);stopSpeech();audio.removeAttribute('src');audio.load()};
  const currentSentence=()=>index<rounds.length?statement(rounds[index].o,rounds[index].word):'';
  const speak=()=>{
   if(index>=rounds.length)return;stopSpeech();audioEnabled=true;const token=speechToken;let fallbackStarted=false;
   const alive=()=>st.isConnected&&token===speechToken;
   const fallback=()=>{
    if(!alive()||fallbackStarted)return;fallbackStarted=true;clearTimeout(speechTimer);
    if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){listen.textContent='Listen again';feedback.textContent='Voice playback is unavailable here. Use Show text to practise this round.';return}
    const utterance=new SpeechSynthesisUtterance(currentSentence()),voices=speechSynthesis.getVoices();
    const voice=voices.find(v=>/^en[-_]GB/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang));if(voice)utterance.voice=voice;
    utterance.lang=voice?.lang||'en-GB';utterance.rate=.82;
    utterance.onstart=()=>{if(alive()){clearTimeout(speechTimer);listen.textContent='Listening…'}};
    utterance.onend=()=>{if(alive()){clearTimeout(speechTimer);listen.textContent='Listen again'}};
    utterance.onerror=event=>{if(!alive()||event.error==='canceled'||event.error==='interrupted')return;clearTimeout(speechTimer);listen.textContent='Listen again';feedback.textContent='The voice could not play. Try Listen again or Show text.'};
    st._utterance=utterance;speechSynthesis.speak(utterance);
    speechTimer=setTimeout(()=>{if(alive()&&listen.textContent!=='Listening…')feedback.textContent='If you can’t hear the voice, try Listen again or Show text.'},4500);
   };
   listen.textContent='Loading…';audio.currentTime=0;
   audio.onplaying=()=>{if(alive()){clearTimeout(speechTimer);listen.textContent='Listening…'}};
   audio.onended=()=>{if(alive())listen.textContent='Listen again'};audio.onerror=fallback;
   audio.play().catch(error=>{if(!alive())return;if(error.name==='NotAllowedError'){audioEnabled=false;listen.textContent='Listen again';feedback.textContent='Press Listen to play this sentence.'}else if(error.name!=='AbortError')fallback()});
   speechTimer=setTimeout(()=>{if(alive()&&listen.textContent==='Loading…')fallback()},4500);
  };
  const next=()=>{
   busy=false;selected=null;st.querySelectorAll('.listening-object').forEach(el=>{el.classList.remove('selected');el.setAttribute('aria-pressed','false')});
   $('#basketTranscript').hidden=true;$('#basketText').setAttribute('aria-expanded','false');
   if(index>=rounds.length){stopSpeech();listen.disabled=true;$('#basketText').disabled=true;$('#basketProgress').textContent='8 / 8';feedback.textContent='All sorted! You matched every sentence.';st.dataset.complete='true';return}
   const task=rounds[index];st.dataset.currentObject=task.o[0];st.dataset.currentWord=task.word;audio.src='assets/basket-audio/'+task.word+'-'+task.o[0]+'.mp3';$('#basketProgress').textContent=(index+1)+' / '+rounds.length;$('#basketTranscript').textContent=currentSentence();feedback.textContent='Listen, then choose a picture and a basket.';
   if(audioEnabled)speak();
  };
  const put=(el,word)=>{
   if(busy||el.disabled||index>=rounds.length)return;const task=rounds[index];
   if(el.dataset.listeningObject!==task.o[0]){feedback.textContent='Listen again and choose a different picture.';return}
   if(word!==task.word){feedback.textContent='Listen again and choose another basket.';return}
   busy=true;stopSpeech();el.disabled=true;el.classList.remove('selected');el.setAttribute('aria-pressed','false');st.querySelector(`[data-listening-basket="${word}"] .listening-sorted`).append(el);feedback.textContent='Correct! '+currentSentence();
   timer=setTimeout(()=>{if(!st.isConnected)return;index++;next()},reduced()?80:1100);
  };
  shuffle(objects.slice()).forEach(o=>{
   const el=document.createElement('button');el.type='button';el.className='listening-object';el.dataset.listeningObject=o[0];el.setAttribute('aria-label',o[2]);el.setAttribute('aria-pressed','false');el.innerHTML=picture(o);
   spatialDrag(el,zone=>{if(zone?.closest('.listening-baskets-stage')===st)put(el,zone.dataset.spatialZone)});
   el.onclick=()=>{if(el.consumeDrag()||el.disabled||busy)return;const prior=selected===el;st.querySelectorAll('.listening-object').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false')});selected=prior?null:el;if(selected){el.classList.add('selected');el.setAttribute('aria-pressed','true')}};bank.append(el);
  });
  st.querySelectorAll('[data-listening-basket]').forEach(zone=>{zone.onclick=event=>{if(selected&&!event.target.closest('.listening-object'))put(selected,zone.dataset.listeningBasket)};zone.onkeydown=event=>{if(selected&&event.target===zone&&(event.key==='Enter'||event.key===' ')){event.preventDefault();put(selected,zone.dataset.listeningBasket)}}});
  listen.onclick=speak;$('#basketText').onclick=()=>{const box=$('#basketTranscript');box.hidden=!box.hidden;$('#basketText').setAttribute('aria-expanded',String(!box.hidden))};next();
 }
 DMTF.nof=viewpoint;DMTF.fbk=listeningBaskets;
})();
