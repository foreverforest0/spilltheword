(() => {
  'use strict';
  const wanted = ['drawing a picture','reading a book','riding a bike','swimming','dancing','singing','playing chess','watching TV','taking a photo','playing the guitar','eating pizza','running'];
  const actions = wanted.map(name=>ACTIONS.find(row=>row[0]===name)).filter(Boolean);
  const people = ['Mia','Leo','Eva','Ben'];
  let deck=[],index=0,guess='';
  function play(reset=false){
   S.splevel='a1';
   if(reset||!deck.length){
    deck=shuffle(actions.slice()).map(([verb,src],i)=>({verb,src,name:people[i%4],he:i%2===1,likes:i%3!==1}));
    index=0;
   }
   const item=deck[index],pronoun=item.he?'He':'She';
   const next=index<deck.length-1;
   setView(`<section class="la1-page" data-practice-level="a1"><header><button type="button" id="la1Back">Topics</button><h1>Do you like …?</h1></header>
   <p>Ask ${item.name}. Then guess the answer.</p>
   <div class="la1-card"><img src="${item.src}" alt="${esc(item.verb)}"><p>Do you like ${esc(item.verb)}?</p></div>
   <div class="la1-actions"><button type="button" data-guess="yes" aria-pressed="${guess==='yes'}" ${guess?'disabled':''}>Yes, I do</button><button type="button" data-guess="no" aria-pressed="${guess==='no'}" ${guess?'disabled':''}>No, I don’t</button></div>
   ${guess?`<div class="la1-answer" role="status"><strong>${item.name}: ${item.likes?'Yes, I do.':'No, I don’t.'}</strong><p>Tell someone about ${item.name}. <span>${pronoun} …</span></p><details><summary>Show answer</summary><p>${pronoun} ${item.likes?'likes':'doesn’t like'} ${esc(item.verb)}.</p></details></div>`:''}
   <nav><span>${index+1} / ${deck.length}</span><button id="la1Next" type="button" ${guess?'':'disabled'}>${next?'Next':'Play again'}</button></nav></section>`);
   $('#la1Back').onclick=()=>{S.glevel='a1';go('gram')};
   document.querySelectorAll('[data-guess]').forEach(button=>button.onclick=()=>{guess=button.dataset.guess;play();$('#la1Next').focus({preventScroll:true})});
   $('#la1Next').onclick=()=>{guess='';if(next)index++;play(!next)};
  }
  const cfg={
   title:'Fridge magnets: Like + -ing',
   help:'Look at the action. Build a sentence or a question with like + -ing.',
   types:[['all','All types'],['+','Statements'],['-','Negatives'],['?','Questions']],
   hints:['I like drawing. She likes drawing.','I don’t like drawing. He doesn’t like drawing.','Do you like drawing? Does she like drawing?'],
   items:()=>actions.flatMap(([verb,src],i)=>{
    const first=i%2===0, subject=first?'I':i%4===1?'She':'He';
    const lower=subject.toLowerCase();
    return [
     ['+',[`${subject} ${first?'like':'likes'} ${verb}.`],src,verb,{pictureStyle:'plain',pictureAlt:verb}],
     ['-',first?[`I don’t like ${verb}.`,`I do not like ${verb}.`]:[`${subject} doesn’t like ${verb}.`,`${subject} does not like ${verb}.`],src,verb,{pictureStyle:'plain',pictureAlt:verb}],
     ['?',[first?`Do you like ${verb}?`:`Does ${lower} like ${verb}?`],src,verb,{pictureStyle:'plain',pictureAlt:verb}],
    ];
   }),
  };
  const group=SPGRP.a1.find(([name])=>/^\d+\s*·\s*Gerund$/i.test(name));
  for(const [id,title,open] of [
   ['a1_like_guess','Guess what they like',()=>{guess='';play(true)}],
   ['a1_like_fridge',cfg.title,()=>{S.splevel='a1';dmMagnets('a1_like_fridge',cfg)}],
  ]){
   DMT[id]=1;DMTF[id]=open;SPSHORT[id]=title;
   SPT.push({id,n:title,d:'Practise like and don’t like with actions.'});
   group[1].push(id);
   SPLV.find(([level])=>level==='a1')[2].push(id);
  }
})();
