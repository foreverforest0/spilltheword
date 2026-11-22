/* Pictures and short cues for the B1 verb patterns. */
(()=>{
 const image = n => 'gi/'+String(n).padStart(2,'0')+'.jpg';
 const mixed=[
 [3,'The dog denied','chew the sofa','The dog denied chewing the sofa.'],
 [4,'The dog refuses','let anyone touch it','The dog refuses to let anyone touch it.'],
 [5,'The dog is practising','write','The dog is practising writing.'],
 [6,'The dog seems','be shocked','The dog seems to be shocked.'],
 [7,'The dogs keep','argue','The dogs keep arguing.'],
 [17,'The man is avoiding','talk to his colleague','The man is avoiding talking to his colleague.'],
 [19,'The penguin is learning','fly','The penguin is learning to fly.'],
 [20,'The cat keeps','sit on the keyboard','The cat keeps sitting on the keyboard.'],
 [22,'The dog is waiting','eat the cake','The dog is waiting to eat the cake.'],
 [28,'The cat wants','go out','The cat wants to go out.'],
 [30,'The duck pretends','be an office worker','The duck pretends to be an office worker.'],
 [32,'The cat expects','get food','The cat expects to get food.'],
 [34,'The dog keeps','dig holes','The dog keeps digging holes.']
 ];
 const purpose=[
 [28,'purpose','the cat · go outside · get some fresh air','The cat goes outside to get some fresh air.'],
 [36,'too','the window · small · climb through safely','The window is too small to climb through safely.'],
 [22,'enough','the dog · tall · reach the cake','The dog is tall enough to reach the cake.'],
 [41,'purpose','he · bring a cake · celebrate their birthday','He brings a cake to celebrate their birthday.'],
 [53,'too','the slipper · small · hide in','The slipper is too small to hide in.'],
 [19,'enough','the penguin · not old · swim alone','The penguin isn’t old enough to swim alone.']
 ];
 const habits=[
 [15,'The dog loves','ride in the car','The dog loves riding in the car.','The dog loves to ride in the car.'],
 [14,'The cat hates','get wet','The cat hates getting wet.','The cat hates to get wet.'],
 [43,'They prefer','sleep together','They prefer sleeping together.','They prefer to sleep together.'],
 [44,'It started','rain','It started raining.','It started to rain.'],
 [52,'The dog adores','play in the mud','The dog adores playing in the mud.']
 ];
 function open(title,rows,full=false){
  seaOff();S.splevel='b1';let deck=shuffle(rows.slice()),index=0;
  function draw(){
   const [pic,lead,cue,...models]=deck[index];
   setView(`<section class="b1-pattern-practice" data-stw-plain><header><button id="b1PatternBack">← Back to topics</button><h1>${esc(title)}</h1></header>
    <div class="b1-pattern-stage"><img src="${image(pic)}" alt=""><div class="b1-pattern-task">
    <p class="b1-pattern-cue">${esc(lead)}${full?'':' …'} <small>${full?esc(cue):'('+esc(cue)+')'}</small></p>
    <form id="b1PatternForm"><textarea id="b1PatternAnswer" aria-label="Your sentence" rows="2"></textarea><button type="submit">Check</button></form>
    <p id="b1PatternFeedback" role="status"></p><details><summary>Show answer</summary>${models.map(model=>`<p>${esc(model)}</p>`).join('')}</details>
    <nav aria-label="Cards"><button id="b1PatternPrev" ${index?'':'disabled'}>Previous</button><button id="b1PatternNext">${index===deck.length-1?'New round':'Next'}</button></nav></div></div></section>`);
   $('#b1PatternBack').onclick=spSetup;
   $('#b1PatternForm').onsubmit=e=>{e.preventDefault();const answer=$('#b1PatternAnswer').value.trim();$('#b1PatternFeedback').textContent=!answer?'Write a sentence first.':models.some(model=>b1AnswerMatch(answer,model)||(!full&&b1AnswerMatch(lead+' '+answer,model)))?'✓ Correct.':'Compare with the model.'};
   $('#b1PatternPrev').onclick=()=>{index--;draw()};
   $('#b1PatternNext').onclick=()=>{if(index===deck.length-1){deck=shuffle(rows.slice());index=0}else index++;draw()};
   blobSet(full?'Use the cue words to make one sentence.':'Finish the sentence with the verb in brackets.');
  }
  draw();
 }
 const b1=SPGRP.b1,verbs=b1.find(([title])=>/^10\s*·/.test(title))[1];
 const register=(id,title,rows,full)=>{DMT[id]=1;DMTF[id]=()=>open(title,rows,full);SPSHORT[id]=title;SPT.push({id,n:title,d:'Make one sentence from the picture and the cues.'});SPLV.find(l=>l[0]==='b1')[2].push(id)};
 register('b1_verb_patterns_mix','Gerund or infinitive?',mixed);
 register('b1_purpose_picture','Purpose / too / enough',purpose,true);
 register('b1_like_patterns','Like / start / prefer',habits);
 if(!verbs.includes('b1_verb_patterns_mix'))verbs.push('b1_verb_patterns_mix');
 for(let i=0;i<verbs.length;i++)if(verbs[i]==='gsm')verbs[i]='b1_like_patterns';
 if(!verbs.includes('b1_like_patterns'))verbs.push('b1_like_patterns');
 DMTF.gsm=()=>open('Like / start / prefer',habits);
 const ordered=b1.findIndex(g=>/^10\s*·/.test(g[0]));
 const nextNumber=1+Math.max(...b1.map(([title])=>parseInt(title,10)||0));
 b1.splice(ordered+1,0,[nextNumber+' · Purpose / too / enough',['b1_purpose_picture']]);
})();
