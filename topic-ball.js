/* One magic ball per grammar topic. Kids ask aloud; no speech capture or grading. */
(()=>{
 'use strict';
 const topics={},specialLinks={};let dispose=null;
 const previous=setView;setView=function(html){dispose?.();dispose=null;const result=previous(html);const id=specialLinks[S.sptask];if(id&&document.querySelector('.future-exercise,.ft-printer-page,.ft-lift-page')){const bar=document.querySelector('.future-header');if(bar){const b=document.createElement('button');b.className='lvb tb-open';b.textContent='Magic 8-ball';b.onclick=()=>{S.topicBallReturn=S.sptask;spOpen(id)};bar.appendChild(b)}}return result};
 const profile=(focus,example,hint,tags,test,review=false)=>({focus,example,hint,tags,test,review});
 const has=(pattern)=>q=>pattern.test(q);
 const continuous=q=>{const m=/^will\b.+\bbe\s+(\w+)/i.exec(q);return !!m&&m8IsIng(m[1].toLowerCase())},perfectContinuous=q=>{const m=/^will\b.+\bhave\s+been\s+(\w+)/i.exec(q);return !!m&&m8IsIng(m[1].toLowerCase())},perfect=q=>{const m=/^will\b.+\bhave\s+(\w+)/i.exec(q);return !!m&&m8IsPP(m[1].toLowerCase())};
 const futureProfiles={
  will:profile('will','Will I learn something new today?','Will + subject + base verb?',null,q=>/^will\b/i.test(q)&&!continuous(q)&&!perfect(q)&&!perfectContinuous(q)),
  going:profile('going to','Am I going to travel this summer?','Am / Is / Are + subject + going to + base verb?',null,has(/^(am|is|are)\b.+\bgoing to\s+\w+/i)),
  continuous:profile('Future Continuous','Will I be travelling at ten tomorrow?','An activity in progress at a future moment.',null,continuous),
  perfect:profile('Future Perfect','Will I have finished my work by six?','A completed result by a future deadline.',null,q=>perfect(q)&&!perfectContinuous(q)),
  perfectcontinuous:profile('Future Perfect Continuous','Will I have been studying for two hours by noon?','Duration up to a future moment.',null,perfectContinuous),
  mix:profile('future processes, results or durations','Will I have arrived by noon?','Choose a future form that matches your meaning.',null,q=>continuous(q)||perfect(q)||perfectContinuous(q))
 };
 function conditional(q){const i=q.toLowerCase().indexOf(' if ');if(i<0)return null;const m=/^would\b.+\bhave\s+(\w+)/i.exec(q.slice(0,i));return {perfectResult:!!m&&m8IsPP(m[1].toLowerCase()),pastCondition:/\bhad\b/i.test(q.slice(i))}}
 function forTopic(name,level){
  const n=name.toLowerCase();
  if(n==='to be')return profile('am / is / are','Am I a good friend?','Put am, is or are before the subject.',['be']);
  if(n.includes('mix')&&n.includes('present'))return profile('Present Simple or Present Continuous','Does my friend play tennis?','Choose a routine or something happening now.',['ps','pc']);
  if(n.includes('mix')&&n.includes('past'))return profile('Past Simple or Past Continuous','Was my friend studying at eight yesterday?','Choose a completed event or an action in progress.',['psp','pasc']);
  if(n.includes('present perfect continuous'))return profile('Present Perfect Continuous','Have I been working too hard?','Have / Has + subject + been + -ing?',['ppc']);
  if(n.includes('present perfect'))return profile('Present Perfect','Have I met this person before?','Have / Has + subject + past participle?',['pfi']);
  if(n.includes('present continuous'))return profile('Present Continuous','Is my friend thinking about me?','Am / Is / Are + subject + -ing?',['pc']);
  if(n.includes('present simple'))return profile('Present Simple','Does my cat like me?','Do / Does + subject + base verb?',['ps']);
  if(n.includes('past continuous'))return profile('Past Continuous','Was my friend sleeping at nine yesterday?','Was / Were + subject + -ing?',['pasc']);
  if(n.includes('past perfect'))return profile('Past Perfect','Had I met her before the party?','Had + subject + past participle?',['pperf']);
  if(n.includes('past simple'))return profile(n.includes('-ed')?'Past Simple with regular verbs':'Past Simple','Did I play well yesterday?','Did + subject + base verb?',['psp']);
  if(n.includes('there is'))return profile('there is / there are','Is there a cat near my house?','Is / Are + there + noun?',['thr']);
  if(n.includes('third conditional'))return profile('Third Conditional','Would I have won if I had tried harder?','An imagined result of a different past.',['cd3'],q=>{const c=conditional(q);return !!c&&c.perfectResult&&c.pastCondition});
  if(n.includes('mixed conditional'))return profile('Mixed Conditionals','Would I be happier now if I had studied harder?','Connect a past condition with a present result, or the reverse.',null,q=>{const c=conditional(q);return !!c&&c.perfectResult!==c.pastCondition});
  if(n.includes('conditionals'))return profile('First or Second Conditional','Would I be happy if I lived by the sea?','Include an if-clause and its imagined result.',['cd1','cd2'],has(/\bif\b/i));
  if(n.includes('wish'))return profile('wish / if only','Do you wish you had more free time?','Ask about a wish, with a clause after wish.',null,has(/\b(wish|wishes|if only)\b/i));
  if(n.includes('passive'))return profile('the passive voice','Was this cake made by my friend?','A form of be + past participle.',['pass','pasa'],null);
  if(n.includes('reported speech'))return profile('reported speech','Did she say that I would win?','Ask about reported words, a question or an instruction.',null,has(/\b(say|said|tell|told|ask|asked)\b.+\b(that|if|whether|to|would|was|were|had)\b/i));
  if(n.includes('relative'))return profile('a relative clause','Is this the person who knows my secret?','Include who, which, that, whose or where in a relative clause.',null,has(/\b(who|which|that|whose|where)\b.+\w/i));
  if(n.includes('question tags'))return profile('a question tag','My friend likes me, doesn’t she?','Statement, comma, auxiliary + pronoun?',null,has(/,\s*(?:am|is|are|was|were|do|does|did|have|has|had|will|would|can|could|should|must)(?:n['’]t|\s+not)?\s+(?:i|you|he|she|it|we|they|there)\?$|,\s*(?:won['’]t|can['’]t|shan['’]t)\s+(?:i|you|he|she|it|we|they|there)\?$/i),true);
  if(n.includes('past modals'))return profile('past modals','Could I have left my keys at school?','Modal + subject + have + past participle?',['mdp']);
  if(n.includes('modals of deduction'))return profile('modals of deduction','Could my friend be at home?','Ask about a possibility using could, might or must.',null,has(/^(?:can|could|might|may|must)\b.+\bbe\b/i));
  if(n.includes('modals'))return profile('can / could / should / must / have to','Should I try something new?','Ask about ability, advice or an obligation.',['can','shd','mdd']);
  if(n.includes('used to'))return profile('used to','Did my teacher use to play football?','After did, use use to.',['uto']);
  if(n.includes('perfect infinitive'))return profile('a perfect infinitive or gerund','Do I seem to have lost my keys?','Use to have + past participle, or having + past participle.',null,has(/\b(?:to have|having)\s+(?:been\s+)?\w+/i),true);
  if(n.includes('gerund')||n.includes('infinitive'))return profile(n==='gerund'?'a gerund':'a gerund or infinitive',n==='gerund'?'Do I enjoy swimming?':'Do I need to stop worrying?','Use a verb followed by -ing or to + base verb.',null,has(n==='gerund'?/\b\w{3,}ing\b/i:/\b(?:\w{3,}ing|to\s+\w+)\b/i));
  if(n.includes('causative'))return profile('causative have / get','Will I have my hair cut today?','Have / Get + object + past participle.',null,has(/\b(?:have|has|get|gets|got|had)\b.+\b(?:cut|done|made|repaired|cleaned|painted|fixed|delivered|built|washed)\b/i));
  if(n.includes('future perfect'))return futureProfiles.mix;
  if(n.includes('comparison structures'))return profile('comparison structures','Is this twice as expensive as that?','Use as … as, a multiplier, or the … the … .',null,has(/\bas\b.+\bas\b|\bthe\b.+\bthe\b|\b(?:twice|three times|far|much)\b.+\bthan\b/i));
  if(n.includes('comparative'))return profile('comparatives or superlatives','Is my dog bigger than yours?','Use a comparative with than, or a superlative.',null,has(/\bthan\b|\b(?:the|my|your|our|his|her|their)\s+(?:most\s+\w+|\w+est|best|worst)\b/i));
  if(n.includes('collocations'))return profile('a verb–noun collocation','Will I make a good decision today?','Use a phrase with make, do, take, have or give.',null,has(/\b(?:make|do|take|have|give)\b.+\w/i),true);
  if(n.includes('word formation'))return profile('word formation','Is happiness the noun form of happy?','Ask about a related word, a prefix or a suffix.',null,has(/\b(noun|verb|adjective|adverb|prefix|suffix|form|formed|derived)\b|['“"]\w+['”"]/i),true);
  if(n.includes('inversion'))return profile('inversion','Had I studied harder, would I have won?','Put had before the subject in an inverted conditional.',null,has(/^had\b.+,\s*would\b.+\bhave\b/i),true);
  if(n.includes('cleft'))return profile('a cleft sentence','Is it my sister who will win?','Is it … who / that … ?',null,has(/^is\s+it\b.+\b(who|that)\b/i));
  if(n.includes('would rather')||n.includes('subjunctive'))return profile('it’s time / would rather / the subjunctive','Would you rather I stayed at home?','After would rather + another subject, use a past form.',null,has(/\b(?:rather|it['’]?s time|it is time|essential|important|suggest|insist)\b/i),true);
  if(n.includes('participle clauses'))return profile('a participle clause','Will I find my keys while looking under the sofa?','Include a clause such as while looking or after finishing.',null,has(/\b(?:while|after|before|when)\s+\w+ing\b|\bhaving\s+\w+/i),true);
  if(n.includes('plural'))return profile('plural nouns','Are those mice friendly?','Ask about more than one thing.',null,has(/\b(?:are|were|these|those|they|people|children|mice|feet|teeth)\b/i));
  if(n.includes('countable'))return profile('countable or uncountable nouns','Are there any apples in my bag?','Use some / any / much / many with a suitable noun.',null,has(/\b(?:some|any|much|many|enough|a little|a few)\b/i));
  if(n.includes('imperatives'))return profile('an instruction','Is “Close the door” an instruction?','Put your instruction in quotes and ask a yes/no question about it.',null,has(/[“"'].+[”"']|\b(?:instruction|command)\b/i),true);
  if(n.includes('preposition'))return profile('a preposition of place','Is my cat under the bed?','Include a place word such as in, on, under or next to.',null,has(/\b(?:in|on|under|behind|between|above|below|near|next to|in front of)\b/i));
  if(n.includes('have got')||n.includes('have /'))return profile('have got / have','Have I got a blue bag?','Have / Has + subject + got … ?',null,has(/\b(?:have|has|got)\b/i));
  if(n.includes('whose')||n.includes('this /'))return profile('possession or this / that / these / those','Is that bag mine?','Use a possessive word or a demonstrative.',null,has(/\b(?:my|your|his|her|our|their|mine|yours|hers|ours|theirs|this|that|these|those)\b/i));
  if(n.includes('pronouns'))return profile('pronouns','Does she know me?','Use a subject or object pronoun.',null,has(/\b(?:i|you|he|she|it|we|they|me|him|her|us|them)\b/i));
  if(n==='time')return profile('telling the time','Is it three o’clock?','Ask about a time, a day or a date.',null,has(/\b(?:o['’]?clock|past|quarter|half|noon|midnight|morning|afternoon|evening|monday|tuesday|wednesday|thursday|friday|saturday|sunday|at|today)\b|\d/i));
  if(n==='questions'||n==='word order')return profile('yes/no question word order','Does my friend like pizza?','Auxiliary + subject + the rest of the question?',null,null);
  throw new Error('Missing topic ball profile: '+level+' / '+name);
 }
 function check(topic,raw){
  const q=String(raw||'').trim().replace(/\s+/g,' '),p=topic.profile;
  if(!q)return {ok:false,message:'Write a yes/no question first.'};
  if(!q.endsWith('?'))return {ok:false,message:'Add a question mark at the end.'};
  if(p.review){if(q.split(' ').length<4)return {ok:false,message:'Write a full question.'};if(!/^(?:am|is|are|was|were|do|does|did|have|has|had|will|would|can|could|should|must|may|might|shall)\b/i.test(q)&&p.focus!=='a question tag')return {ok:false,message:'Start your yes/no question with an auxiliary verb.'};}
  else{const basic=m8Check(q,'c1');if(!basic.ok)return {ok:false,message:basic.msg};if(p.tags&&!p.tags.includes(basic.tag))return {ok:false,message:'Use '+p.focus+' for this question. Hint can help.'};}
  const normalized=q.replace(/\bwon['’]t\b/gi,'will not').replace(/\b(is|are|was|were|have|has|had|would|could|should|must)n['’]t\b/gi,'$1 not');
  if(p.test&&!p.test(normalized))return {ok:false,message:'Use '+p.focus+' for this question. Hint can help.'};
  return {ok:true};
 }
 function open(id){
  const topic=topics[id];if(!topic)return;seaOff();const level=topic.back&&['a1','a2','b1','b2','c1'].includes(S.splevel)?S.splevel:topic.level;S.splevel=level;document.body.classList.add('grammar-style-active');
  S.topicBallRuns=S.topicBallRuns||{};let state=S.topicBallRuns[id];if(!state||state.version!==1)state=S.topicBallRuns[id]={version:1,draft:'',answer:'',lastQuestion:''};save();
  const oral=level==='kids',p=topic.profile;
  setView(`<section class="topic-ball-page cbpanel" data-ball-topic="${esc(id)}"><div class="tb-header"><button class="lvb" id="tbBack">← Topics</button><h1>Magic 8-ball</h1></div><h2 class="tb-topic" data-stw-plain>${esc(topic.name)}</h2><div class="tb-layout"><button type="button" class="tb-ball${state.answer?' tb-answered':''}" id="tbBall" aria-label="Ask the magic ball"><span class="tb-window"><span class="tb-eight" aria-hidden="true">8</span><span class="tb-triangle"><svg viewBox="0 0 100 90" aria-hidden="true"><polygon points="50,86 6,8 94,8" fill="#2a4fd6" stroke="#9db6ff" stroke-width="2.4" stroke-linejoin="round"/></svg><span id="tbAnswer">${esc(state.answer||'')}</span></span></span></button><div class="tb-task"><p class="tb-instruction">Ask a yes/no question using <strong>${esc(p.focus)}</strong>.</p>${oral?'<p>Ask aloud. Your teacher checks the question. Then tap the ball.</p>':`<label class="sr-only" for="tbQuestion">Your question</label><textarea id="tbQuestion" maxlength="350" rows="2" class="future-answer" spellcheck="false" placeholder="Your question…">${esc(typeof state.draft==='string'?state.draft.slice(0,350):'')}</textarea><button class="lvb" id="tbAsk">Ask the ball</button>${p.review?'<p class="tb-review">Check the wording with your teacher before asking the ball.</p>':''}`}<button class="lvb" id="tbHint" aria-controls="tbHintText" aria-expanded="false">Hint</button><div class="tb-hint" id="tbHintText" hidden><p>${esc(p.hint)}</p><p>${esc(p.example)}</p></div><p class="tb-status" id="tbStatus" role="status" aria-live="polite"></p><p class="tb-last-question" id="tbLast">${oral?'':esc(state.lastQuestion||'')}</p></div></div></section>`);
  let alive=true,busy=false,timer=0;const ball=$('#tbBall'),input=$('#tbQuestion');
  dispose=()=>{alive=false;clearTimeout(timer)};
  $('#tbBack').onclick=()=>{if(topic.back){spOpen(specialLinks[S.topicBallReturn]===id?S.topicBallReturn:topic.back);return}S.glevel=topic.level;S.gmode='ts';save();spSetup()};
  $('#tbHint').onclick=()=>{const h=$('#tbHintText');h.hidden=!h.hidden;$('#tbHint').setAttribute('aria-expanded',String(!h.hidden))};
  function ask(){
   if(busy)return;const question=oral?'':input.value.trim();
   if(!oral){const result=check(topic,question);if(!result.ok){$('#tbStatus').textContent=result.message;input.focus();return}}
   busy=true;ball.disabled=true;if($('#tbAsk'))$('#tbAsk').disabled=true;$('#tbStatus').textContent='The ball is thinking…';ball.classList.remove('tb-answered');ball.classList.add('tb-shaking');sfx('pop');
   const pool=oral?['Yes!','No!','Maybe!','Ask again!']:['Yes.','No.','Maybe.','Very likely.','Unlikely.','Ask again.','Absolutely.','Not this time.'];const answer=pool[Math.floor(Math.random()*pool.length)];
   timer=setTimeout(()=>{if(!alive)return;state.answer=answer;state.lastQuestion=question;save();$('#tbAnswer').textContent=answer;ball.classList.remove('tb-shaking');ball.classList.add('tb-answered');ball.disabled=false;busy=false;if($('#tbAsk'))$('#tbAsk').disabled=false;$('#tbStatus').textContent=oral?'Say the ball’s answer aloud.':'Do you agree with the ball? Say why.';$('#tbLast').textContent=question;sfx('pop')},matchMedia('(prefers-reduced-motion: reduce)').matches||window.SharedGame?.replaying?0:1300);
  }
  ball.onclick=ask;if($('#tbAsk'))$('#tbAsk').onclick=ask;
  if(input){input.oninput=()=>{state.draft=input.value;state.answer='';save();ball.classList.remove('tb-answered');$('#tbStatus').textContent=''};input.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask()}}}
  LevelDesign.sync();
 }
 function register(id,level,name,p,back){const topic=topics[id]={id,level,name,profile:p,back};DMT[id]=1;DMTF[id]=()=>open(id);SPSHORT[id]='Magic 8-ball';BLX[id]='Ask a yes/no question using '+p.focus+'. '+(level==='kids'?'Ask aloud. Your teacher checks the question, then you tap the ball.':'Write your question, then ask the ball. Hint shows an example for this topic.');SPT.push({id,n:'Magic 8-ball · '+name,d:'Ask a yes/no question using this topic.'});return topic}
 for(const [level,groups]of Object.entries(SPGRP)){
  for(let i=groups.length-1;i>=0;i--)if(groups[i][1].length===1&&groups[i][1][0]==='m8')groups.splice(i,1);
  const ids=SPLV.find(l=>l[0]===level)?.[2];if(ids){const at=ids.indexOf('m8');if(at>=0)ids.splice(at,1)}
  groups.forEach((group,i)=>{if(!/^\d+\s*·/.test(group[0]))return;const name=group[0].replace(/^\d+\s*·\s*/,''),id='topic_ball_'+level+'_'+i;register(id,level,name,forTopic(name,level));group[1].push(id);if(ids&&!ids.includes(id))ids.push(id)});
 }
 for(const [key,p]of Object.entries(futureProfiles)){const id='topic_ball_future_'+key;register(id,key==='will'||key==='going'?'a2':'b2',p.focus,p,'future_'+(key==='mix'?'advanced':key));if(key!=='mix')specialLinks['future_'+key]=id;if(['continuous','perfect','perfectcontinuous','mix'].includes(key))specialLinks['future_print_'+key]=id;}
 specialLinks.future_lift='topic_ball_future_mix';
 window.TopicBall={open,topics,check:(id,q)=>check(topics[id],q)};
})();
