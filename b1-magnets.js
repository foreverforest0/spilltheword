/* B1 sentence banks and shared fridge UI for all grammar levels. */
const B1MAG = {};
function b1Rows(type, text) {
 return text.trim().split('\n').map(line=>[type,line.split(' | ')]);
}
function b1Add(key,title,group,types,items,hints) {
 const id='mb1'+key;
 const cfg={title:'Fridge magnets: '+title,b1:true,types:[['all','Mixed / all types'],...types],items:()=>items,
  help:'Choose a mode. Drag or tap magnets to build the answer, then press Check. Tap a magnet on the door to return it. Try the challenge for extra forms.',
  hints:hints||['Read the context and find the subject and auxiliary first.','Check the word order, verb form and time words.']};
 B1MAG[id]=cfg;MGXC[id]=cfg;DMT[id]=1;DMTF[id]=()=>dmMagnets(id,cfg);
 SPSHORT[id]='Fridge magnets: '+title;SPGRP.b1[group][1].push(id);SPLV.find(l=>l[0]==='b1')[2].push(id);
 SPT.push({id,n:SPSHORT[id],d:cfg.help});
}
b1Add('pf','Present Perfect',1,[['+','Statements'],['-','Negatives'],['?','Questions'],['time','For / since']], [
 ...b1Rows('+',`She has already finished her homework. | She has finished her homework already.
We have just bought a new car.
He has broken his glasses.
They have visited Rome twice.
I have lost my wallet.
You have made a lot of progress.`),
 ...b1Rows('-',`I haven’t booked the tickets yet.
They have never tried Thai food.
She hasn’t called me yet.
We haven’t seen this film.
He has never flown alone.
I haven’t finished my lunch yet.`),
 ...b1Rows('?',`Have you ever lost your passport?
Has she sent the email yet?
Where have you put my keys?
Have they arrived already?
How many books have you read this month?
Has he ever cooked for you?`),
 ...b1Rows('time',`We have lived here for five years.
He has known Anna since 2020.
She has had this bike for two years.
I haven’t seen him since Monday.
Have you known each other for a long time?
They have been friends since school.`)
],['have / has + V3; questions: Have / Has + subject + V3?','Already usually follows have / has; yet usually comes last. For = duration, since = starting point.']);
b1Add('pc','Present Perfect Continuous',2,[['+','Statements'],['-','Negatives'],['?','Questions'],['cause','Cause and result']], [
 ...b1Rows('+',`She has been studying all morning.
We have been waiting for the bus for twenty minutes.
He has been painting his bedroom since Monday.
They have been working on a new project.
I have been learning to drive lately.
It has been raining all day.`),
 ...b1Rows('-',`He hasn’t been sleeping well lately.
I haven’t been feeling well recently.
They haven’t been practising enough.
She hasn’t been working here for long.
We haven’t been using the car lately.
You haven’t been listening to me.`),
 ...b1Rows('?',`How long have you been learning English?
Have they been working on this project since Monday?
What have you been doing all morning?
Has she been waiting for a long time?
Why have you been avoiding me?
Have you been looking for a new job?`),
 ...b1Rows('cause',`You are wet because you have been walking in the rain.
She is tired because she has been running.
His hands are dirty because he has been repairing his bike.
The kitchen smells nice because we have been baking bread.
My eyes hurt because I have been reading all day.
They are hot because they have been dancing.`)
],['have / has + been + V-ing. Keep been even in questions and negatives.','Use for with a duration and since with a starting point.']);
const B1PAST=[
 ['When we arrived,','the film had already started.'],['She was upset because','she had lost her phone.'],
 ['When my friend called,','I hadn’t finished my homework.'],['Before you started working here,','had you met him?'],
 ['By the time I reached the station,','the train had left.'],['He couldn’t get into the flat because','he had forgotten his keys.'],
 ['I was hungry because','I hadn’t eaten breakfast.'],['When she opened the fridge,','someone had eaten the cake.'],
 ['They were late because','their car had broken down.'],['Before I moved to London,','I had never lived abroad.'],
 ['By the time we got home,','the rain had stopped.'],['He knew the answer because','he had read the book.'],
 ['When the guests arrived,','we had already cooked dinner.'],['She couldn’t pay because','she had left her wallet at home.'],
 ['When I checked my email,','the company had sent a reply.'],['Before the lesson began,','had everyone done the homework?'],
 ['We couldn’t watch the film because','we had lost the tickets.'],['By the time the shop opened,','a queue had formed outside.'],
 ['He felt nervous because','he had never flown before.'],['When I woke up,','my sister had already left.'],
 ['She failed the test because','she hadn’t studied enough.'],['Before you bought the car,','had you checked the engine?'],
 ['When we reached the hotel,','they had given our room to someone else.'],['I recognised the woman because','I had seen her on TV.']
];
b1Add('pp','Past Perfect',3,[['full','Whole sentence'],['part','Finish the sentence']], B1PAST.flatMap(([prefix,tail])=>[
 ['full',[prefix+' '+tail]],['part',[tail],null,null,{prefix,prompt:'Complete the sentence using Past Perfect.'}]
]),['Earlier past action: had + V3. Negative: hadn’t + V3.','Use Past Simple for the later event. In questions: Had + subject + V3?']);
const B1COND1=[
 ['If it rains,','we will stay at home.'],['If you study,','you will pass the exam.'],['If she calls,','I will tell her the news.'],
 ['If we leave now,','we won’t miss the train.'],['If I have time,','I will help you.'],['If he saves enough money,','he will buy a bike.'],
 ['If you don’t hurry,','you will be late.'],['If they invite me,','I will go to the party.'],['If the weather is nice,','we will eat outside.'],
 ['If you feel ill,','will you call a doctor?'],['If she gets the job,','will she move to London?'],['If I send you the link,','will you read it?']
];
const B1COND2=[
 ['If I had more free time,','I would learn Italian.'],['If I were you,','I wouldn’t buy that phone.'],['If flights were cheaper,','she would travel more.'],
 ['If we lived near the sea,','we would swim every day.'],['If he knew the answer,','he would tell us.'],['If I won a million pounds,','I would buy a house.'],
 ['If you didn’t work so much,','you wouldn’t feel so tired.'],['If she had a car,','she wouldn’t take the bus.'],['If I could fly,','I would visit every country.'],
 ['If you could choose any country,','where would you live?'],['If you found a wallet,','what would you do?'],['If they offered you the job,','would you accept it?']
];
function b1Conditional(type,rows){return rows.map(([a,b])=>{
 const answers=[a+' '+b];
 if(!/\?$/.test(b))answers.push(b[0].toUpperCase()+b.slice(1).replace(/\.$/,'')+' '+a[0].toLowerCase()+a.slice(1).replace(/,$/,'')+'.');
 return [type,answers];
})}
b1Add('cd','Conditionals',4,[['first','First Conditional'],['second','Second Conditional']], [...b1Conditional('first',B1COND1),...b1Conditional('second',B1COND2)],['First: if + Present Simple, will + base verb.','Second: if + Past Simple, would + base verb. Both clause orders are accepted.']);
const B1PASS=[
 ['These bicycles are made in Germany.','People make these bicycles in Germany.'],['The museum is cleaned every evening.','Someone cleans the museum every evening.'],
 ['My phone was stolen on the train.','Someone stole my phone on the train.'],['The windows weren’t broken by the children.','The children didn’t break the windows.'],
 ['When was this bridge built?','When did people build this bridge?'],['Is breakfast included in the price?','Do they include breakfast in the price?'],
 ['English is spoken in many countries.','People speak English in many countries.'],['The letters were sent yesterday.','Someone sent the letters yesterday.'],
 ['This book was written by a teenager.','A teenager wrote this book.'],['The rooms aren’t cleaned on Sundays.','They don’t clean the rooms on Sundays.'],
 ['Was the painting sold last week?','Did they sell the painting last week?'],['Where are these shoes made?','Where do they make these shoes?'],
 ['The cake was baked by my sister.','My sister baked the cake.'],['The road was repaired last month.','Someone repaired the road last month.'],
 ['Tickets are sold online.','They sell tickets online.'],['The documents weren’t signed yesterday.','They didn’t sign the documents yesterday.'],
 ['Are pets allowed in this hotel?','Do they allow pets in this hotel?'],['Who was invited to the meeting?','Who did they invite to the meeting?'],
 ['The photos were taken by my brother.','My brother took the photos.'],['This cheese is made from milk.','They make this cheese from milk.'],
 ['The meal wasn’t cooked at home.','They didn’t cook the meal at home.'],['How often is this room used?','How often do people use this room?'],
 ['The thief was caught by the police.','The police caught the thief.'],['The shop is closed at six every day.','They close the shop at six every day.']
];
b1Add('pa','Passive',5,[['build','Build a passive sentence'],['transform','Active → Passive']],B1PASS.flatMap(([answer,active])=>[
 ['build',[answer]],['transform',[answer],null,null,{prompt:'Change Active to Passive: '+active}]
]),['Passive: am / is / are / was / were + V3.','Use by + person when the doer matters. Start a question with the auxiliary.']);
const B1REPORT=[
 ['Anna','I am tired.','Anna said that she was tired.'],['Ben','I don’t like this film.','Ben told me that he didn’t like that film.'],
 ['Kate','I have lost my keys.','Kate said that she had lost her keys.'],['Tom','I will call you tomorrow.','Tom said that he would call me the next day.'],
 ['Mia','I can help you.','Mia said that she could help me.'],['Leo','We are waiting outside.','Leo said that they were waiting outside.'],
 ['Anna','I work in a bank.','Anna said that she worked in a bank.'],['Ben','I am looking for a job.','Ben said that he was looking for a job.'],
 ['Kate','I haven’t finished yet.','Kate said that she hadn’t finished yet.'],['Tom','I won’t be late.','Tom said that he wouldn’t be late.'],
 ['Mia','I can’t swim.','Mia said that she couldn’t swim.'],['Leo','We live here.','Leo said that they lived there.'],
 ['Anna','I am busy today.','Anna said that she was busy that day.'],['Ben','I saw you yesterday.','Ben told me that he had seen me the day before.'],
 ['Kate','I bought a new phone.','Kate said that she had bought a new phone.'],['Tom','I will send you the photo.','Tom said that he would send me the photo.'],
 ['Mia','I have never been to Paris.','Mia said that she had never been to Paris.'],['Leo','We are not ready.','Leo said that they were not ready.'],
 ['Anna','I need your help.','Anna told me that she needed my help.'],['Ben','My sister is at home.','Ben said that his sister was at home.'],
 ['Kate','I don’t know the answer.','Kate said that she didn’t know the answer.'],['Tom','I have already eaten.','Tom said that he had already eaten.'],
 ['Mia','I will visit you next week.','Mia said that she would visit me the following week.'],['Leo','We can meet you here.','Leo said that they could meet me there.']
];
b1Add('rp','Reported Speech',6,[['present','Present → past'],['perfect','Past / perfect'],['future','Will / can']],B1REPORT.map(([name,quote,answer])=>[
 /\b(will|won’t|can|can’t)\b/.test(quote)?'future':/\b(have|haven’t|bought|saw)\b/.test(quote)?'perfect':'present',
 [answer,answer.replace(' that ',' ')],null,null,{prompt:`Yesterday, in another place, ${name} said to you: “${quote}” Retell it today; use backshift.`}
]),['said (that) …; told + person + (that) … . That is optional.','For this task shift the tense back: am → was, have done → had done, will → would, can → could.']);
const B1REL=[
 ['people','A vet is someone who looks after sick animals.'],['places','This is the café where we first met.'],['whose','I have a friend whose sister lives in Canada.'],
 ['things','The phone that I bought yesterday doesn’t work.'],['people','She is the teacher who helped me prepare for the exam.'],['things','This is a machine which makes fresh pasta.'],
 ['people','A pilot is someone who flies planes.'],['places','This is the village where my grandparents live.'],['whose','That is the boy whose bike was stolen.'],
 ['things','I lost the scarf that you gave me.'],['people','The woman who lives next door is a doctor.'],['things','We watched a film which made us laugh.'],
 ['people','I know a girl who speaks five languages.'],['places','That is the hotel where we stayed last summer.'],['whose','She is the writer whose books I love.'],
 ['things','This is the key that opens the garage.'],['people','He is the man who found my wallet.'],['things','I need a bag which has lots of pockets.'],
 ['places','This is the park where we play tennis.'],['whose','I met a man whose daughter is a singer.'],['things','The cake that she made was delicious.'],
 ['people','A mechanic is a person who repairs cars.'],['places','That is the shop where I bought my coat.'],['whose','I know a girl whose father is a pilot.']
];
b1Add('rc','Relative Clauses',7,[['people','People'],['things','Things'],['places','Places'],['whose','Whose'],['join','Join two sentences']],B1REL.flatMap(([type,answer])=>{
 const out=[[type,[answer]]];
 const m=answer.match(/^(.*?) (who|which|that|where|whose) (.*)$/);
 if(m&&['people','places','whose'].includes(type)){
  const starters={people:'Describe the person using who.',places:'Describe the place using where.',whose:'Describe who something belongs to using whose.'};
  out.push(['join',[answer],null,null,{prompt:starters[type]+' '+({
   'I know a girl whose father is a pilot.':'I know a girl. Her father is a pilot.',
   'I have a friend whose sister lives in Canada.':'I have a friend. Her sister lives in Canada.',
   'This is the café where we first met.':'This is the café. We first met there.'
  }[answer]||b1RelativePrompt(answer,type))}]);
 }
 return out;
}),['who / that: people; which / that: things; where: places; whose: possession.','The relative clause follows the noun it describes.']);
function b1RelativePrompt(s,type){
 const prompts={
 'A vet is someone who looks after sick animals.':'A vet is a person. This person looks after sick animals.',
 'She is the teacher who helped me prepare for the exam.':'She is the teacher. She helped me prepare for the exam.',
 'A pilot is someone who flies planes.':'A pilot is a person. This person flies planes.',
 'This is the village where my grandparents live.':'This is the village. My grandparents live there.',
 'That is the boy whose bike was stolen.':'That is the boy. His bike was stolen.',
 'The woman who lives next door is a doctor.':'The woman is a doctor. She lives next door.',
 'I know a girl who speaks five languages.':'I know a girl. She speaks five languages.',
 'That is the hotel where we stayed last summer.':'That is the hotel. We stayed there last summer.',
 'She is the writer whose books I love.':'She is the writer. I love her books.',
 'He is the man who found my wallet.':'He is the man. He found my wallet.',
 'This is the park where we play tennis.':'This is the park. We play tennis there.',
 'I met a man whose daughter is a singer.':'I met a man. His daughter is a singer.',
 'A mechanic is a person who repairs cars.':'A mechanic is a person. This person repairs cars.',
 'That is the shop where I bought my coat.':'That is the shop. I bought my coat there.'
 };
 return prompts[s]||s;
}
const B1TAGS=[
 ['You work here,','don’t you?'],['She isn’t at home,','is she?'],['They went to Spain,','didn’t they?'],['He has finished,','hasn’t he?'],
 ['We can leave now,','can’t we?'],['You won’t tell anyone,','will you?'],['I’m late,','aren’t I?'],['Let’s take a break,','shall we?'],
 ['She likes coffee,','doesn’t she?'],['They aren’t ready,','are they?'],['He didn’t call,','did he?'],['You have met Anna,','haven’t you?'],
 ['It was cold,','wasn’t it?'],['We shouldn’t wait,','should we?'],['Your brother lives here,','doesn’t he?'],['The children are sleeping,','aren’t they?'],
 ['She will help us,','won’t she?'],['You don’t eat meat,','do you?'],['They were late,','weren’t they?'],['He can’t drive,','can he?'],
 ['You haven’t seen my keys,','have you?'],['I’m in the right room,','aren’t I?'],['Let’s order pizza,','shall we?'],['The film starts at eight,','doesn’t it?']
];
b1Add('tg','Question Tags',8,[['full','Whole sentence'],['tag','Tag only']],B1TAGS.flatMap(([prefix,tail])=>[
 ['full',[prefix+' '+tail]],['tag',[tail],null,null,{prefix,prompt:'Add the question tag.'}]
]),['Positive statement → negative tag; negative statement → positive tag. Match the auxiliary and pronoun.','I am → aren’t I? Let’s → shall we?']);
const B1DEDUCE=[
 ['must','The lights are on and I can hear music inside.','Someone must be at home.'],['might','Maybe Anna is on the bus. I’m not sure.','Anna might be on the bus.'],
 ['cant','This is not Tom’s bag. His bag is blue.','This can’t be Tom’s bag.'],['must','He has been running for an hour without a break.','He must be tired.'],
 ['might','Perhaps they know the answer.','They might know the answer.'],['cant','I’ve just seen Mark in London.','He can’t be in Paris right now.'],
 ['must','She has won first prize and is smiling.','She must be happy.'],['might','Perhaps the shop is closed for lunch.','The shop might be closed for lunch.'],
 ['cant','We need the number twelve bus. This one is the number six.','This can’t be our bus.'],['must','The dog hasn’t eaten for two days.','It must be hungry.'],
 ['might','Maybe he is working late.','He might be working late.'],['cant','That house has no roof or windows.','It can’t be ready to live in.'],
 ['must','Everyone is wearing a coat and gloves.','It must be cold outside.'],['might','Perhaps the keys are in your pocket.','The keys might be in your pocket.'],
 ['cant','This cake contains nuts and Leo is allergic to nuts.','It can’t be safe for Leo.'],['must','She has been awake for thirty hours.','She must be sleepy.'],
 ['might','Maybe our train is delayed.','Our train might be delayed.'],['cant','That is my brother. His name is Max, not Ben.','He can’t be Ben.'],
 ['must','Rain is falling outside and his coat is dripping.','It must be raining outside.'],['might','Perhaps she is studying in the library.','She might be studying in the library.'],
 ['cant','The restaurant is empty and locked.','It can’t be open right now.'],['must','The phone is ringing inside his bag.','His phone must be in his bag.'],
 ['might','Maybe they are waiting at the wrong entrance.','They might be waiting at the wrong entrance.'],['cant','This is a photo of a desert with no water.','It can’t be a photo of the ocean.']
];
b1Add('md','Modals of Deduction',9,[['must','Must: almost sure'],['might','Might: possible'],['cant','Can’t: impossible']],B1DEDUCE.map(([t,p,a])=>[t,[a],null,null,{prompt:p+' Use '+({must:'must',might:'might',cant:'can’t'}[t])+'.'}]),['must: almost sure; might / could: possible; can’t: impossible.','Use modal + base verb: must be, might know, can’t live.']);
const B1GER=[
 ['ing','She enjoys reading detective stories.'],['ing','Would you mind opening the window?'],['ing','He avoids driving at night.'],['ing','They suggested going for a walk.'],
 ['to','We decided to take the train.'],['to','He promised to help me.'],['to','She managed to finish on time.'],['to','I can’t afford to buy a new car.'],
 ['prep','I’m interested in learning Japanese.'],['prep','She left without saying goodbye.'],['prep','We are looking forward to seeing you.'],['prep','He apologised for being late.'],
 ['pattern','I went to the shop to buy some milk.'],['pattern','He is too tired to drive.'],['pattern','She isn’t old enough to rent a car.'],['pattern','Learning a language takes time.'],
 ['pattern','It’s important to get enough sleep.'],['pattern','It takes an hour to get there.'],['both','It started raining.'],['both','She loves to dance.'],
 ['meaning','He stopped to buy a coffee.','He was driving. He stopped because he wanted a coffee.'],
 ['meaning','He stopped drinking coffee.','He used to drink coffee. Now he no longer drinks it.'],
 ['meaning','I remember locking the door.','I have a memory of turning the key in the lock.'],
 ['meaning','Remember to lock the door.','You are leaving soon. Don’t forget this task.']
];
b1Add('ge','Gerund & Infinitive',10,[['ing','Verb + -ing'],['to','Verb + to'],['prep','After prepositions'],['pattern','Purpose / subject / too / enough'],['both','Both forms'],['meaning','Change of meaning']],B1GER.map(([t,a,p])=>[t,t==='both'?(a==='It started raining.'?[a,'It started to rain.']:[a,'She loves dancing.']):[a],null,null,{prompt:p||'Choose the correct verb form and build the sentence.',forms:true,tokens:a.replace(/[.,?!]/g,'').match(/to (?:take|help|finish|buy|drive|rent|get|dance|lock)\b|\S+/g)}]),['enjoy / avoid / mind + -ing; decide / promise / manage + to V; preposition + -ing.','stop doing = end the activity; stop to do = pause another activity for a purpose.']);
const B1WORDS=[
 ['prefix','It’s ___ to finish this in one minute.','im','possible','impossible'],['suffix','Please be ___ with that glass.','care','ful','careful'],
 ['suffix','He lost his phone because he was ___.','care','less','careless'],['suffix','We finally reached an ___.','agree','ment','agreement'],
 ['suffix','Thank you for your ___.','kind','ness','kindness'],['suffix','She answered the question ___.','correct','ly','correctly'],
 ['prefix','I ___ with you. I think the opposite is true.','dis','agree','disagree'],['suffix','Could you ___ this paragraph? It’s too long.','short','en','shorten'],
 ['prefix','That answer is ___. Try again.','in','correct','incorrect'],['prefix','It’s ___ to interrupt people.','im','polite','impolite'],
 ['prefix','The children are ___ because their dog is missing.','un','happy','unhappy'],['prefix','Please ___ your essay and fix the mistakes.','re','write','rewrite'],
 ['suffix','The firefighter was very ___.','help','ful','helpful'],['suffix','He felt ___ because he could do nothing.','power','less','powerless'],
 ['suffix','We need a final ___ before Friday.','agree','ment','agreement'],['suffix','She spoke very ___ so everyone could hear.','clear','ly','clearly'],
 ['suffix','The sky is ___ today.','cloud','y','cloudy'],['suffix','His latest ___ is a new kind of robot.','invent','ion','invention'],
 ['spelling','We wish you health and ___.','happy','ness','happiness'],['spelling','___, we caught the last bus home.','lucky','ly','luckily'],
 ['spelling','What was your final ___?','decide','ion','decision'],['spelling','He is a ___ musician.','fame','ous','famous'],
 ['spelling','The guide gave us useful ___.','inform','ation','information'],['spelling','___ is important when you ride a bike.','safe','ty','safety']
];
b1Add('wf','Word Formation',11,[['prefix','Prefixes'],['suffix','Suffixes'],['spelling','Word building / spelling']],B1WORDS.map(([t,p,a,b,word])=>[t,[a+' '+b],null,null,{prompt:p,tokens:[a,b],word,follow:'Read the complete sentence aloud.'}]),['Build the word from left to right, then use it in the gap.','Some spellings change: happy + ness → happiness; decide + ion → decision; fame + ous → famous.']);
const B1MAGSTYLE=document.createElement('style');
B1MAGSTYLE.textContent=`
.b1-magnet-layout{display:grid;grid-template-columns:var(--fridge-width,280px) minmax(0,1fr);gap:24px;align-items:start;max-width:1000px;margin:auto;height:var(--fridge-height,648px)}
.b1-fridge{position:relative;width:100%;height:var(--fridge-height,648px);background:transparent;border:0;padding:0;box-shadow:none}
.magnet-fridge-art{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none}

.b1-strip{position:absolute;inset:42% 6% 11%;display:flex;gap:5px;flex-wrap:wrap;align-content:flex-start;align-items:flex-start;padding:4px;background:transparent!important;border:0!important;box-shadow:none!important;overflow:auto}
.b1-bank-side{display:flex;flex-direction:column;gap:12px;height:100%;min-height:0;min-width:0}
.b1-bank{display:flex;gap:10px;flex-wrap:wrap;align-content:flex-start;padding:4px;min-height:70px;overflow:auto;flex:1;background:transparent;border:0}
body.stw-site-theme #view .b1-magnet,.b1-drag-ghost{position:relative;display:flex;align-items:center;gap:5px;padding:4px!important;min-height:42px;color:#70271F!important;border:0!important;border-radius:0!important;font:21px/1.2 Georgia,serif!important;box-shadow:none!important;cursor:grab;touch-action:none;max-width:100%;overflow-wrap:anywhere;background:transparent!important}
.b1-magnet img{width:30px;height:30px;object-fit:contain;pointer-events:none;flex:none}.b1-magnet span{pointer-events:none}
body.stw-site-theme #view .b1-fridge.blue .b1-magnet{color:#F9F5E6!important;text-shadow:0 1px 2px #26422B}
.b1-magnet:focus-visible{outline:2px solid #70271F;outline-offset:3px}.b1-magnet.good span{text-decoration:underline;text-decoration-color:#26422B;text-decoration-thickness:3px}.b1-magnet.bad span{text-decoration:underline wavy #F24E07}
.b1-prefix{position:absolute;top:12%;left:10%;right:10%;font:20px/1.3 Georgia,serif;color:#70271F;margin:0}.blue .b1-prefix{color:#F9F5E6}
.b1-context{font:20px/1.35 Georgia,serif;color:#70271F;overflow-wrap:anywhere;margin:0;flex:none}
.b1-answer{font:18px/1.35 Georgia,serif;color:#26422B;max-height:100px;overflow:auto;flex:none}.b1-answer:empty{display:none}
.b1-controls{display:flex;flex-direction:column;align-items:flex-start;gap:8px;margin:0;flex:none}.b1-check-row{display:flex;gap:8px;flex-wrap:wrap}.b1-new-row{display:block}
.b1-settings{flex:none}.b1-settings summary{cursor:pointer;font:16px Georgia,serif;color:#26422B}.b1-settings .mgmodes{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0;max-height:100px;overflow:auto}.b1-settings .b1-controls{flex-direction:row;flex-wrap:wrap}
.mgmodes .lvb.on,.b1-controls .lvb.on{background:#70271F!important;color:#F9F5E6!important}.b1-settings .lvb{font-size:14px!important;padding:6px 9px!important}
.b1-controls .lvb{background:#CCE5FF;color:#70271F;border:0;box-shadow:none;font:17px Georgia,serif}.b1-stage{height:auto!important;min-height:0;overflow:visible!important;background:transparent!important;padding:0!important}
.b1-magnet-picture{flex:none}.b1-magnet-picture:empty{display:none}.b1-magnet-picture .mgpic{max-width:100%}
.b1-habit-picture{margin:0;background:#fff;color:#70271F}.b1-habit-art{position:relative;overflow:hidden;padding:12px;background:#CCE5FF;box-sizing:border-box}.b1-habit-art img{display:block;position:absolute;inset:12px;width:calc(100% - 24px);height:calc(100% - 24px);object-fit:contain}.b1-habit-picture figcaption{padding:7px 8px;font:18px/1.2 Georgia,serif}
.b1-drag-ghost{position:fixed!important;z-index:500;pointer-events:none;max-width:240px;opacity:.95}
@media(max-width:620px){.b1-habit-picture figcaption{font-size:16px}.b1-magnet-layout{gap:10px}.b1-bank-side{gap:8px}.b1-bank{gap:5px;padding:0}.b1-strip{gap:2px;padding:2px}body.stw-site-theme #view .b1-magnet{font-size:18px!important;gap:3px;padding:2px!important;min-height:36px}.b1-magnet img{width:27px;height:27px}.b1-context,.b1-prefix{font-size:16px}.b1-controls .lvb{font-size:15px!important;padding:7px 9px!important}.b1-check-row{gap:6px}.b1-answer{font-size:16px;max-height:75px}}
`;
let fridgeResizeCleanup=()=>{};
document.head.appendChild(B1MAGSTYLE);
function b1MagnetRound(st,mb,id,cfg,round){
 const extra=round.extra||{}, answers=round.s;
 const norm=s=>s.toLowerCase().replace(/[.,?!]/g,'').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
 st.classList.add('b1-stage');
 const level=document.createElement('div');level.className='b1-controls';
 S.b1challenge=S.b1challenge||{};
 level.innerHTML=['guided','challenge'].map(m=>`<button class="lvb${(S.b1challenge[id]||'guided')===m?' on':''}" data-level="${m}">${m==='guided'?'Only needed magnets':'Challenge: extra forms'}</button>`).join('');

 level.onclick=e=>{const b=e.target.closest('[data-level]');if(!b)return;S.b1challenge[id]=b.dataset.level;save();dmMagnets(id,cfg)};
 const prompt=document.createElement('div');prompt.className='b1-context';
 prompt.textContent=extra.prompt||'';
 prompt.hidden=!extra.prompt||/^(Build the sentence|Complete the sentence using|Add the question tag)/i.test(extra.prompt);
 blobSet(cfg.help+' Drag or tap magnets to build your answer. Tap a placed magnet to return it. Drag it before another magnet to change the order.');
 const blue=cfg.b1||['b1','b2','c1'].includes(S.splevel)||(!S.splevel&&['b1','b2','c1'].includes(S.glevel));
 st.innerHTML=`<div class="b1-magnet-layout"><div class="b1-fridge${blue?' blue':''}" aria-label="${blue?'Blue':'Beige'} fridge"><img class="magnet-fridge-art" src="${blue?'ch/magnets-fridge-blue.png':'ch/mf_fridge.webp'}" alt=""><p class="b1-prefix"></p><div class="b1-strip" role="group" aria-label="Your answer on the fridge door"></div></div><div class="b1-bank-side"><details class="b1-settings"><summary>Practice options</summary></details><div class="b1-magnet-picture"></div><div class="b1-bank" role="group" aria-label="Available magnets"></div><div class="b1-controls"><div class="b1-new-row"></div><div class="b1-check-row"><button class="lvb" id="mgchk">✓ Check</button><button class="lvb" id="mgans">Show answer</button></div></div><div class="b1-answer" role="status" aria-live="polite"></div></div></div>`;
 st.querySelector('.b1-settings').append(mb);if(cfg.b1)st.querySelector('.b1-settings').append(level);
 st.querySelector('.b1-bank-side').insertBefore(prompt,st.querySelector('.b1-magnet-picture'));
 st.querySelector('.b1-new-row').appendChild($('#dmnew'));
 const hintButton=$('#dmhint');if(hintButton&&!hintButton.hidden)st.querySelector('.b1-settings').append(hintButton);
 const hint=$('#dmh');if(hint)st.querySelector('.b1-settings').append(hint);
 fridgeResizeCleanup();
 const aspect=blue?754/2086:560/1294;
 const fit=()=>{
  if(!st.isConnected)return;
  const layout=st.querySelector('.b1-magnet-layout'),w=layout.clientWidth,gap=w<620?10:24;
  const side=w<620?Math.min(150,w*.41):Math.min(400,w*.45);
  const available=Math.max(240,window.innerHeight-st.getBoundingClientRect().top-56);
  const width=Math.min(available*aspect,w-side-gap,370);
  layout.style.setProperty('--fridge-width',width+'px');
  layout.style.setProperty('--fridge-height',width/aspect+'px');
  if(round.pic){
   const box=st.querySelector('.b1-magnet-picture');
   const largeKidsPicture=id==='mgc'&&S.splevel==='kids';
   const size=Math.round(Math.max(70,Math.min(extra.pictureStyle==='plain'&&w<620?110:largeKidsPicture?360:240,box.parentElement.clientWidth,available*(largeKidsPicture ? .42 : .25))));
   if(box.dataset.pictureSize!==String(size)){
    box.dataset.pictureSize=String(size);
    if(extra.pictureStyle==='plain'){
     const figure=document.createElement('figure');figure.className='b1-habit-picture';figure.style.width=size+'px';
     const art=document.createElement('div');art.className='b1-habit-art';art.style.height=size+'px';
     const img=document.createElement('img');img.src=round.pic;img.alt=extra.pictureAlt||'';img.draggable=false;
     const caption=document.createElement('figcaption');caption.textContent=extra.pictureCaption||'';
     art.append(img);figure.append(art,caption);box.replaceChildren(figure);
    }else box.replaceChildren(magPic(round.pic,size,''));
   }
  }
 };
 const observer=new ResizeObserver(fit);observer.observe(st.closest('.cbpanel'));window.addEventListener('resize',fit);fridgeResizeCleanup=()=>{observer.disconnect();window.removeEventListener('resize',fit)};
 requestAnimationFrame(fit);
 if(extra.free){$('#mgchk').hidden=true;$('#mgans').hidden=true;$('#dmnew').onclick=()=>{MGKEEP={items:order.map(p=>({word:p.word,forms:p.forms,fi:p.fi}))};dmMagnets(id,null)}}

 const prefix=st.querySelector('.b1-prefix');prefix.textContent=extra.prefix||'';prefix.hidden=!extra.prefix;
 const strip=st.querySelector('.b1-strip'),bank=st.querySelector('.b1-bank'),result=st.querySelector('.b1-answer');
 const tokens=extra.tokens||answers[0].replace(/[.,?!]/g,'').split(' ');
 const variants={reading:['read','reading','to read'],opening:['open','opening','to open'],driving:['drive','driving','to drive'],going:['go','going','to go'],learning:['learn','learning','to learn'],saying:['say','saying','to say'],seeing:['see','seeing','to see'],being:['be','being','to be'],Learning:['Learn','Learning','To learn'],raining:['rain','raining','to rain'],drinking:['drink','drinking','to drink'],locking:['lock','locking','to lock'], 'to take':['take','taking','to take'], 'to help':['help','helping','to help'], 'to finish':['finish','finishing','to finish'], 'to buy':['buy','buying','to buy'], 'to drive':['drive','driving','to drive'], 'to rent':['rent','renting','to rent'], 'to get':['get','getting','to get'], 'to dance':['dance','dancing','to dance'], 'to lock':['lock','locking','to lock'],turning:['turn','turning','to turn'],waiting:['wait','waiting','to wait'],restarting:['restart','restarting','to restart']};
 let pieces=extra.freePieces?extra.freePieces.map((p,index)=>({...p,index})):tokens.map((word,index)=>({word,index,forms:extra.forms&&variants[word]?variants[word]:[word],fi:0}));
 if(extra.forms)pieces.forEach(p=>{p.fi=p.forms.indexOf(p.word)});
 // Each alternative answer is accepted with its own length (e.g. optional "that").

 if(S.b1challenge[id]==='challenge'){
  const wrong=extra.word?['un','ly']:id==='mb1md'?['must','might','can’t']:['has','had','will','would','is','was','do','does','to','not'];
  const extras=wrong.filter(w=>!tokens.includes(w)).slice(0,2);
  pieces.push(...extras.map((word,i)=>({word,index:tokens.length+i,forms:[word],fi:0,extra:true})));
 }
 if(extra.forms)pieces.forEach(p=>{if(p.forms.length>1){p.fi=(p.fi+1)%p.forms.length;p.word=p.forms[p.fi]}});
 const bankOrder=shuffle(pieces.slice());
 let order=pieces.filter(p=>p.keep);
 const paint=()=>{
  strip.replaceChildren();bank.replaceChildren();

  [...order,...bankOrder.filter(p=>!order.includes(p))].forEach(p=>{
   const on=order.includes(p),el=document.createElement('button');p.el=el;el.type='button';el.className='b1-magnet';el.dataset.piece=p.index;
   const pin=MGN[p.index%MGN.length];
   el.innerHTML=`<img src="ch/mg_${pin}.webp" alt="" draggable="false"><span>${esc(p.word)}</span>`;
   el.setAttribute('aria-label',p.word+(on?' — return to bank':' — add to answer'));
   let wasDragged=false;el.onclick=()=>{if(wasDragged){wasDragged=false;return}order=on?order.filter(x=>x!==p):[...order,p];result.textContent='';paint()};
   // Pointer drag works with mouse and touch; a click remains a keyboard alternative.
   let drag=null,ghost=null;
   const cleanup=()=>{if(ghost)ghost.remove();ghost=null;el.style.opacity=''};
   el.onpointerdown=e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY};wasDragged=false;el.setPointerCapture(e.pointerId)};
   el.onpointermove=e=>{if(!drag)return;if(Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y)>8){wasDragged=true;if(!ghost){ghost=el.cloneNode(true);ghost.classList.add('b1-drag-ghost');document.body.appendChild(ghost);el.style.opacity='.3'}ghost.style.left=(e.clientX-ghost.offsetWidth/2)+'px';ghost.style.top=(e.clientY-20)+'px'}};
   el.onpointerup=e=>{
    if(!drag)return;drag=null;if(!wasDragged)return;
    cleanup();el.releasePointerCapture(e.pointerId);e.preventDefault();const target=document.elementFromPoint(e.clientX,e.clientY);if(!target)return;
    const fridge=st.querySelector('.b1-fridge');
    if(fridge.contains(target)){
     order=order.filter(x=>x!==p);const before=target.closest('[data-piece]');const pos=before?order.findIndex(x=>x.index===+before.dataset.piece):-1;
     if(pos<0)order.push(p);else order.splice(pos,0,p);
    }else if(bank.contains(target))order=order.filter(x=>x!==p);
    result.textContent='';paint();
   };
   el.onpointercancel=()=>{drag=null;wasDragged=false;cleanup()};
   (on?strip:bank).append(el);
   if(p.forms.length>1){
    const change=document.createElement('button');change.type='button';change.className='lvb';change.textContent='↻';change.setAttribute('aria-label','Change form of '+p.word);
    change.onclick=()=>{p.fi=(p.fi+1)%p.forms.length;p.word=p.forms[p.fi];result.textContent='';paint()};(on?strip:bank).append(change);
   }
  });
 };
 paint();
 $('#mgans').onclick=()=>{result.textContent=extra.word?`${tokens.join(' + ')} → ${extra.word}. ${extra.prompt.replace('___',extra.word)}`:(extra.prefix?extra.prefix+' ':'')+answers.join(' / ')};
 $('#mgchk').onclick=()=>{
  if(!order.length){result.textContent='Put some magnets on the door first.';return}
  const mine=norm(order.map(p=>p.word).join(' '));
  const correct=answers.some(a=>norm(a)===mine);
  order.forEach(p=>p.el.classList.toggle('good',correct));
  if(correct){
   result.textContent=extra.word?`Correct: ${tokens.join(' + ')} → ${extra.word}. ${extra.prompt.replace('___',extra.word)} Read it aloud.`:`Perfect! ${(extra.prefix?extra.prefix+' ':'')+order.map(p=>p.word).join(' ')}. Read it aloud, then make a similar example of your own.`;
   if(extra.agreement){const a=extra.agreement;result.textContent='Yes! '+a.subject+' → '+a.verb+'. Read: '+answers[0]}
  }else{
   const expected=(extra.tokens||norm(answers[0]).split(' ')).map(norm);order.forEach((p,i)=>p.el.classList.add(norm(p.word)===expected[i]?'good':'bad'));
   result.textContent='Not yet. Check the order and verb forms. Straight underline = correct position; wavy underline = try again.';
   if(extra.agreement){
    const a=extra.agreement;
    result.textContent=order.some(p=>p.word===a.wrong)?(a.addS?a.subject+' is one person. Add -s to the verb.':'I / you / we / they: use the verb without -s.'):'Use three magnets: who + action + what. Leave one verb in the bank.';
   }
  }
 };
}
