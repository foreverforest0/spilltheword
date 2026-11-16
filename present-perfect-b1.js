/* B1 Present Perfect: course vocabulary shared by typewriter, fridge and pond.
   Questions have a fixed focus, opening and subject; no guessed question intent. */
(()=>{
 'use strict';
 const source=(course,unit,lesson,lexeme)=>({course,unit,lesson,lexeme});
 const B=(lesson,lexeme,unit=0)=>source('b1',unit,lesson,lexeme);
 const T=(unit,lesson,lexeme)=>source('teens',unit,lesson,lexeme);
 const questions=[
  ['She has stayed in touch with her flatmate for three years.','How long has she stayed in touch with her flatmate?','How long','she','duration',B(3,'stay in touch with')],
  ['They have known their landlord since 2019.','How long have they known their landlord?','How long','they','duration',T(3,1,'a landlord')],
  ['He has had this wallet for two years.','How long has he had this wallet?','How long','he','duration',T(2,1,'wallet')],
  ['She has been worried about the deadline since Monday.','How long has she been worried about the deadline?','How long','she','duration',B(6,'deadline')],
  ['They have seen three documentaries this month.','How many documentaries have they seen this month?','How many documentaries','they','number of documentaries',B(9,'documentary',1)],
  ['He has been to two concerts this year.','How many concerts has he been to this year?','How many concerts','he','number of concerts',T(4,1,'go to a concert')],
  ['She has written four blog posts this week.','How many blog posts has she written this week?','How many blog posts','she','number of blog posts',T(4,1,'write a blog')],
  ['They have won two competitions this year.','How many competitions have they won this year?','How many competitions','they','number of competitions',T(1,5,'competition')],
  ['He has lost his sunglasses.','What has he lost?','What','he','lost object',T(0,0,'sunglasses')],
  ['She has bought a board game.','What has she bought?','What','she','bought object',T(0,0,'board game')],
  ['They have recycled the paper.','What have they recycled?','What','they','recycled material',T(3,7,'recycle')],
  ['He has borrowed a musical instrument.','What has he borrowed?','What','he','borrowed object',T(0,0,'musical instrument')],
  ['She has left her helmet in the garage.','Where has she left her helmet?','Where','she','place',T(0,0,'helmet')],
  ['They have put the recycling bins in the garden.','Where have they put the recycling bins?','Where','they','place',T(3,7,'recycling bins')],
  ['He has kept his diary in the cupboard.','Where has he kept his diary?','Where','he','place',T(4,1,'keep a diary')],
  ['She has left her smartphone in the kitchen.','Where has she left her smartphone?','Where','she','place',T(3,3,'smartphone')],
  ['Yes, she has applied for a part-time job.','Has she applied for a part-time job?','Has','she','yes/no; keep the activity',B(5,'part-time job')],
  ['No, they have not met a famous person.','Have they met a famous person?','Have','they','positive yes/no; keep the activity',T(4,1,'meet a famous person')],
  ['Yes, he has eaten sushi.','Has he eaten sushi?','Has','he','yes/no; keep the activity',T(4,1,'eat sushi')],
  ['No, she has not ridden a horse.','Has she ridden a horse?','Has','she','positive yes/no; keep the activity',T(4,1,'ride a horse')],
  ['He has quit because he has felt stressed at work.','Why has he quit?','Why','he','reason for quitting',B(5,'quit')],
  ['She has felt exhausted because she has worked overtime.','Why has she felt exhausted?','Why','she','reason for feeling exhausted',B(6,'overtime')],
  ['They have spent fifty pounds on a birthday present.','How much have they spent on a birthday present?','How much','they','amount of money; keep on a birthday present',T(2,1,'spend')],
  ['She has paid twenty pounds for the board game.','How much has she paid for the board game?','How much','she','amount of money; keep for the board game',T(2,1,'pay')]
 ].map(([answer,question,start,subject,focus,vocab])=>({answer,question,start,subject,focus,vocab}));
 const timeRows=[
  ['She has known her flatmate ___ 2019.','since',B(3,'be friendly with')],
  ['They have stayed in touch ___ five years.','for',B(3,'stay in touch with')],
  ['He has been worried about the deadline ___ Monday.','since',B(6,'deadline')],
  ['She has had this part-time job ___ six months.','for',B(5,'part-time job')],
  ['They have been friends ___ they left school.','since',T(0,3,'leave school')],
  ['He has owned this musical instrument ___ a long time.','for',T(0,0,'musical instrument')],
  ['We have not seen our landlord ___ last Friday.','since',T(3,1,'a landlord')],
  ['She has not earned any pocket money ___ two weeks.','for',T(2,1,'pocket money')],
  ['Have they had this board game ___ Christmas?','since',T(0,0,'board game')],
  ['Has he known that musician ___ ten years?','for',T(4,5,'musician')],
  ['She has been scared of horses ___ she was a child.','since',B(1,'to be scared of',1)],
  ['They have rented this flat ___ three months.','for',T(3,1,'rent a flat')],
  ['He has been proud of that achievement ___ June.','since',T(1,5,'achievement')],
  ['We have had this laptop ___ ages.','for',T(3,3,'laptop')],
  ['She has been interested in cinematography ___ 2020.','since',B(10,'cinematography',1)],
  ['They have worked with this manager ___ a year.','for',B(6,'manager')],
  ['I have not used my bank card ___ yesterday.','since',T(2,1,'bank card')],
  ['He has not felt motivated ___ several weeks.','for',B(0,'motivated',1)],
  ['Have you been friends ___ your first day at university?','since',T(0,3,'go to university')],
  ['Has she owned that helmet ___ two years?','for',T(0,0,'helmet')],
  ['She has kept a diary ___ she started school.','since',T(4,1,'keep a diary')],
  ['He has been a tenant here ___ eight months.','for',T(3,1,'a tenant')],
  ['They have been married ___ September.','since',T(0,3,'get married')],
  ['We have not had a holiday ___ a year.','for',B(6,'work-life balance')]
 ].map(([sentence,answer,vocab])=>({sentence,answer,vocab}));
 const buildRows=[
  ['She / know / her flatmate / since 2019','She has known her flatmate since 2019.',B(3,'be friendly with')],
  ['They / stay in touch / for five years','They have stayed in touch for five years.',B(3,'stay in touch with')],
  ['He / just / apply for / a part-time job','He has just applied for a part-time job.',B(5,'part-time job')],
  ['She / not / meet / the deadline / yet','She has not met the deadline yet.',B(6,'deadline')],
  ['They / already / pay / the bill','They have already paid the bill.',B(9,'bill')],
  ['He / never / ride / a horse','He has never ridden a horse.',T(4,1,'ride a horse')],
  ['She / lose / her sunglasses','She has lost her sunglasses.',T(0,0,'sunglasses')],
  ['We / not / see / that documentary / yet','We have not seen that documentary yet.',B(9,'documentary',1)],
  ['They / write / three blog posts / this week','They have written three blog posts this week.',T(4,1,'write a blog')],
  ['He / be / worried about the deadline / since Monday','He has been worried about the deadline since Monday.',B(6,'deadline')],
  ['She / borrow / a musical instrument','She has borrowed a musical instrument.',T(0,0,'musical instrument')],
  ['They / keep / a diary / since January','They have kept a diary since January.',T(4,1,'keep a diary')],
  ['Ask a yes/no question: she / ever / eat / sushi','Has she ever eaten sushi?',T(4,1,'eat sushi')],
  ['Ask a yes/no question: they / win / a competition / yet','Have they won a competition yet?',T(1,5,'competition')],
  ['Ask a yes/no question: he / already / buy / a board game','Has he already bought a board game?',T(0,0,'board game')],
  ['Ask a yes/no question: she / have / this laptop / for two years','Has she had this laptop for two years?',T(3,3,'laptop')],
  ['I / not / spend / my pocket money / yet','I have not spent my pocket money yet.',T(2,1,'pocket money')],
  ['We / recycle / the paper','We have recycled the paper.',T(3,7,'recycle')]
 ].map(([cue,answer,vocab])=>({cue,answer,vocab}));
 const corrections=[
  ['She have known her flatmate since 2019.','She has known her flatmate since 2019.','auxiliary',B(3,'be friendly with')],
  ['They has stayed in touch for five years.','They have stayed in touch for five years.','auxiliary',B(3,'stay in touch with')],
  ['Has they ever eaten sushi?','Have they ever eaten sushi?','auxiliary',T(4,1,'eat sushi')],
  ['He have not met the deadline yet.','He has not met the deadline yet.','auxiliary',B(6,'deadline')],
  ['She has had this laptop since two years.','She has had this laptop for two years.','time',T(3,3,'laptop')],
  ['They have been friends for 2019.','They have been friends since 2019.','time',B(3,'be friendly with')],
  ['He has not earned any pocket money since two weeks.','He has not earned any pocket money for two weeks.','time',T(2,1,'pocket money')],
  ['Have you known your landlord for last summer?','Have you known your landlord since last summer?','time',T(3,1,'a landlord')],
  ['She has wrote three blog posts this week.','She has written three blog posts this week.','participle',T(4,1,'write a blog')],
  ['He has never rode a horse.','He has never ridden a horse.','participle',T(4,1,'ride a horse')],
  ['They have already payed the bill.','They have already paid the bill.','participle',B(9,'bill')],
  ['She has forgot her bank card.','She has forgotten her bank card.','participle',T(2,1,'bank card')]
 ].map(([wrong,answer,error,vocab])=>({wrong,answer,error,vocab}));
 const questionCue=q=>`Answer: ${q.answer}\nAsk about ${q.focus}. Start with “${q.start}”. Use “${q.subject}”. Keep the other necessary words; add no extra words.`;
 const questionHint=q=>`${q.start} + ${/^(Have|Has)$/.test(q.start)?'subject + V3':'have / has + subject + V3'}?`;
 function addDrill(id,label,C){
  TYD[id]=C;SPSHORT[id]=label;DMT[id]=1;DMTF[id]=()=>tyDrillStart(id);
  SPT.push({id,n:label,d:C.help});const group=SPGRP.b1.find(g=>g[0].startsWith('1 ·'));
  if(!group[1].includes(id))group[1].splice(group[1].indexOf('tv3')+1,0,id);
  const list=SPLV.find(l=>l[0]==='b1')[2];if(!list.includes(id))list.push(id);
 }
 addDrill('tppfs','Typewriter: For / since',{
  title:'Typewriter: Present Perfect — for / since',help:'Fill each gap with for or since. Type only the missing word.',modes:[['all','For / since']],
  pool(){return timeRows.map(r=>({p:r.sentence,a:[r.answer],h:'For + a duration; since + a starting point or a past event.',nl:true}))},fmt:(it,i)=>({t:i+'. '+it.p,nl:true})
 });
 addDrill('tppq','Typewriter: Build the question',{
  title:'Typewriter: Present Perfect — build the question',multilineAnswers:true,help:'Read the answer and the fixed question focus. Type the complete question using the given opening and subject.',modes:[['all','Build the question']],
  pool(){return questions.map(q=>({p:questionCue(q),a:[q.question],h:questionHint(q),nl:true}))},fmt:(it,i)=>({t:i+'. '+it.p,nl:true})
 });
 const cfg=B1MAG.mb1pf;
 cfg.guidedLabel='Sentence magnets';
 cfg.types=[['sent','Sentences: mixed types'],['time','For / since']];
 cfg.help='Build a full Present Perfect sentence. Sentences mixes statements, negatives and questions. For / since practises durations and starting points separately.';
 const sentences=buildRows.map(r=>['sent',[r.answer],null,null,{prompt:r.cue,vocab:r.vocab}]);
 const timeMagnets=timeRows.map(r=>{
  const answer=r.sentence.replace('___',r.answer),tokens=answer.replace(/[.,?!]/g,'').split(' ');
  const freePieces=tokens.concat(r.answer==='for'?'since':'for').map(word=>({word,forms:[word],fi:0}));
  return ['time',[answer],null,null,{prompt:'Choose for or since, then build the complete sentence. '+r.sentence,tokens,freePieces,vocab:r.vocab}];
 });
 cfg.items=()=>sentences.concat(timeMagnets);
 cfg.hints=['have / has + V3. Negatives: have / has not + V3. Questions: have / has + subject + V3?','For + duration. Since + starting point or a past event. Leave the unused time word in the bank.'];
 // Discard only cached rounds for this exercise; saved course choices are untouched.
 for(const key of Object.keys(MGXQ))if(key.startsWith('mb1pf'))delete MGXQ[key];
 const pond={
  build:buildRows.map(r=>({kind:'build',question:'Build the full Present Perfect sentence.',cue:r.cue,answers:[r.answer],hint:'Use every cue in the given order. Add have / has, use V3 and keep the time phrase.',vocab:r.vocab})),
  fix:corrections.map(r=>({kind:'fix',error:r.error,question:'Fix one grammar error. Write the complete sentence.',cue:r.wrong,answers:[r.answer],hint:'Change only the wrong auxiliary, for / since, or past participle. Keep the other words.',vocab:r.vocab})),
  question:questions.map(q=>({kind:'question',question:'Build the question for this answer.',cue:questionCue(q),answers:[q.question],hint:questionHint(q),vocab:q.vocab}))
 };
 const previousBank=PondQuestions.bankFor;
 PondQuestions.bankFor=function(level,number){if(level==='b1'&&+number===1)return Object.values(pond).flat().map(r=>({...r,answers:r.answers.slice()}));return previousBank(level,number)};
 window.PresentPerfectB1={questions,timeRows,buildRows,corrections,pond};
})();
