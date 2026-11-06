/* Reviewed B1 expansion. Existing illustrations are reused; no remote services. */
const B1_CONTENT_AUDIT = [];
(() => {
 'use strict';
 const rows = text => text.trim().split('\n').map(line => line.split(' | '));
 const add = (bank, key, target, items) => {
  const before=target.length;target.push(...items);
  B1_CONTENT_AUDIT.push({bank,key,before,added:items.length,after:target.length});
 };
 const practice = {
 pfi:`I can’t find my phone. I (leave) it somewhere. | Complete with the Present Perfect. | I can’t find my phone. I’ve left it somewhere.
Have you tried that new café? | Answer no; use yet. | No, I haven’t tried it yet.
We moved here in March and still live here. | Use since and the Present Perfect. | We’ve lived here since March.
I’ve just sent you the link. | Ask a question starting with What. | What have you just sent me?
She’s gone to the supermarket. | Explain where she is now. | She’s at the supermarket. She hasn’t come back yet.`,
 ppc:`I started looking for my keys twenty minutes ago. I’m still looking. | Use the Present Perfect Continuous. | I’ve been looking for my keys for twenty minutes.
Your phone calls keep going to voicemail. | Ask: you / avoid / me? Use the Present Perfect Continuous. | Have you been avoiding me?
We (not / sleep) well lately. The neighbours are so loud. | Complete with the Present Perfect Continuous. | We haven’t been sleeping well lately. The neighbours are so loud.
Her hands are covered in paint. | Explain: she / paint / the kitchen. | She’s been painting the kitchen.
He’s been working from home since January. | Ask a question with How long. | How long has he been working from home?`,
 pperf:`I got to the café. My friend left ten minutes earlier. | Join with By the time and use the Past Perfect. | By the time I got to the café, my friend had left.
We couldn’t order pizza. The restaurant closed earlier. | Join with because and use the Past Perfect. | We couldn’t order pizza because the restaurant had closed.
You arrived at the cinema. Did the film start before that? | Ask with Had and already. | Had the film already started when you arrived?
I thought I’d sent the message, but it was still in my drafts. | Say what had not happened. | I hadn’t sent the message.
It was my first time trying sushi. | Use never and before. | I’d never tried sushi before.`,
 cd1:`I’ll get home tonight. Then I’ll send you the photos. | Join with when; keep the future reference. | I’ll send you the photos when I get home tonight.
Maybe the café will be full. We’ll get takeaway coffee. | Start with If. | If the café is full, we’ll get takeaway coffee.
Don’t leave now and you’ll miss the last bus. | Start with Unless. | Unless you leave now, you’ll miss the last bus.
Maybe you’ll need a hand with the boxes. I’ll come over. | Start with If. | If you need a hand with the boxes, I’ll come over.
You might finish work early. What will you do then? | Ask with What will you do if. | What will you do if you finish work early?`,
 cd2:`I haven’t got a spare room, so you can’t stay with me. | Start with If I had. | If I had a spare room, you could stay with me.
I’m not you. My advice is to ask for a refund. | Use If I were you. | If I were you, I’d ask for a refund.
Imagine your phone stopped working for a week. | Ask with What would you do if. | What would you do if your phone stopped working for a week?
We don’t live closer, so we don’t meet more often. | Start with If. | If we lived closer, we’d meet more often.
I’d join you tonight if I didn’t have to work. | Put the if-clause first. | If I didn’t have to work, I’d join you tonight.`,
 wsh:`My flat doesn’t get much sunlight. | Start with I wish. | I wish my flat got more sunlight.
I can’t remember people’s names. | Start with I wish. | I wish I could remember people’s names.
Our neighbours make a lot of noise at night. | Use wish + Past Simple for the present situation. | I wish our neighbours didn’t make so much noise at night.
I don’t have Friday off. | Start with I wish. | I wish I had Friday off.
Her parents live a long way away. | Start with She wishes. | She wishes her parents lived closer.`,
 pass:`Someone stole my bike outside the café yesterday. | Use the passive; start with My bike. | My bike was stolen outside the café yesterday.
They clean the coffee machine every evening. | Use the passive. | The coffee machine is cleaned every evening.
Did someone send the invitations yesterday? | Use a passive question. | Were the invitations sent yesterday?
They don’t allow dogs in this shop. | Use the passive. | Dogs aren’t allowed in this shop.
My sister made this cake. | Use the passive and keep the person who did it. | This cake was made by my sister.`,
 rep:`Yesterday Mia told me, “I’m running late.” | Report it later; use said and backshift. | Mia said she was running late.
Last night Ben said to me, “I’ll text you when I get home.” | Report it the next day; backshift. | Ben said he’d text me when he got home.
Yesterday my friends said, “We’ve already booked a table.” | Report it later; backshift. | My friends said they’d already booked a table.
Yesterday Dad said, “I can’t find my glasses.” | Report it later; backshift. | Dad said he couldn’t find his glasses.
On Monday Ella said, “I’m working from home tomorrow.” | Report it on Wednesday; backshift and change tomorrow. | Ella said she was working from home the next day.`,
 rcl:`That’s the café. We had our first lesson there. | Join with where. | That’s the café where we had our first lesson.
I finally found the charger. You lent it to me. | Join with that. | I finally found the charger that you lent me.
She’s the neighbour. Her dog keeps escaping. | Join with whose. | She’s the neighbour whose dog keeps escaping.
Do you know anyone? They can fix a bike. | Join with who. | Do you know anyone who can fix a bike?
The app is free. It helps me plan my meals. | Join with which. | The app which helps me plan my meals is free.`,
 tag:`You’ve got my number, | Add a question tag. | You’ve got my number, haven’t you?
There isn’t a queue, | Add a question tag. | There isn’t a queue, is there?
Let’s grab something to eat, | Add a question tag. | Let’s grab something to eat, shall we?
Nobody’s replied yet, | Add a question tag. | Nobody’s replied yet, have they?
I’m on the right bus, | Add a question tag. | I’m on the right bus, aren’t I?`,
 mdd:`You’ve been up since five. I’m sure you’re exhausted. | Use must. | You must be exhausted.
Maybe she’s on another call. | Use might. | She might be on another call.
That isn’t my suitcase. Mine has a red handle. | Use can’t. | That can’t be my suitcase.
I can hear the baby crying through the monitor. I’m sure she’s awake. | Use must. | She must be awake.
Perhaps they’re waiting at the other entrance. | Use could. | They could be waiting at the other entrance.`,
 gpr:`Thanks for (pick) me up. | Complete the whole sentence. | Thanks for picking me up.
I’m fed up with (wait) for a reply. | Complete the whole sentence. | I’m fed up with waiting for a reply.
She left without (take) her phone. | Complete the whole sentence. | She left without taking her phone.
Are you thinking about (move) closer to work? | Complete the whole sentence. | Are you thinking about moving closer to work?
We got home by (take) the last bus. | Complete the whole sentence. | We got home by taking the last bus.`,
 gvb:`Do you fancy (grab) a coffee? | Complete the whole sentence. | Do you fancy grabbing a coffee?
I keep (forget) where I put my keys. | Complete the whole sentence. | I keep forgetting where I put my keys.
Would you mind (turn) the music down? | Complete the whole sentence. | Would you mind turning the music down?
We ended up (order) a takeaway. | Complete the whole sentence. | We ended up ordering a takeaway.
She suggested (meet) somewhere quieter. | Complete the whole sentence. | She suggested meeting somewhere quieter.`,
 ivb:`I didn’t mean (wake) you up. | Complete the whole sentence. | I didn’t mean to wake you up.
We managed (get) the last two seats. | Complete the whole sentence. | We managed to get the last two seats.
Can you afford (take) a few days off? | Complete the whole sentence. | Can you afford to take a few days off?
He offered (give) me a lift home. | Complete the whole sentence. | He offered to give me a lift home.
I’d love (come), but I’m working tonight. | Complete the whole sentence. | I’d love to come, but I’m working tonight.`,
 gsb:`(Cook) for one can be a bit boring. | Use a gerund as the subject. | Cooking for one can be a bit boring.
It’s hard (switch) off after a busy day. | Complete the whole sentence. | It’s hard to switch off after a busy day.
It takes me ages (choose) what to watch. | Complete the whole sentence. | It takes me ages to choose what to watch.
It’s no use (call) him. His phone’s off. | Complete both sentences. | It’s no use calling him. His phone’s off.
Is (share) a flat cheaper than living alone? | Complete the whole sentence. | Is sharing a flat cheaper than living alone?`,
 iad:`I left early. I wanted to avoid the traffic. | Join with to for purpose. | I left early to avoid the traffic.
This bag is too heavy. I can’t carry it. | Join with too … to. | This bag is too heavy to carry.
The café is close enough. We can walk there. | Join with enough … to. | The café is close enough to walk to.
I’m glad (hear) you’re feeling better. | Complete the whole sentence. | I’m glad to hear you’re feeling better.
We booked online. We wanted to get cheaper tickets. | Join with in order to. | We booked online in order to get cheaper tickets.`,
 gdf:`I remember (send) it. I can picture pressing the button. | Complete both sentences; a memory. | I remember sending it. I can picture pressing the button.
Remember (send) it before you leave. It’s still in your drafts. | Complete both sentences; a task. | Remember to send it before you leave. It’s still in your drafts.
Try (restart) your phone. That might fix it. | Complete both sentences; test a solution. | Try restarting your phone. That might fix it.
I tried (restart) my phone, but the button was broken. | Complete the sentence; an unsuccessful attempt. | I tried to restart my phone, but the button was broken.
We stopped (get) a coffee on the way home. | Complete the sentence; we paused our journey for coffee. | We stopped to get a coffee on the way home.`,
 gsm:`I love cooking for friends. | Use the other form. | I love to cook for friends.
It started getting dark. | Use the other form. | It started to get dark.
I’d love going with you. | Correct the verb form after would love. | I’d love to go with you.
She prefers to sit near the window. | Use the other form; keep the same general preference. | She prefers sitting near the window.
They continued chatting after everyone else left. | Use the other form. | They continued to chat after everyone else left.`
 };
 Object.entries(practice).forEach(([k,t])=>{
  const items=rows(t);add('transformations',k,TS[k],items);
  DESKDATA[k].examples=items.map(x=>x[2]);
  B1_CONTENT_AUDIT.push({bank:'desk-examples',key:k,before:0,added:5,after:5});
 });
 const typed = {
 tv3:`forget - forgot - ___ | forgotten | n
choose - chose - ___ | chosen | n
send - sent - ___ | sent | s
bring - brought - ___ | brought | s
leave - left - ___ | left | s`,
 tpa:`My parcel ___ (deliver) yesterday, but I can’t find it. | was delivered | pa
Sorry, dogs ___ (not / allow) in the café. | aren’t allowed|are not allowed | pr
The bins ___ (empty) every Tuesday morning. | are emptied | pr
Your refund will ___ (process) within five days. | be processed | fu
The tickets have already ___ (send) to your email address. | been sent | fu`,
 trp:`Yesterday Mia said, “I’m stuck in traffic.” = Mia said she ___ stuck in traffic. | was | be
Yesterday Ben said to me, “I’ll give you a lift.” = Ben said he ___ give me a lift. | would | m
Yesterday Ella said, “I haven’t checked my messages.” = Ella said she ___ checked her messages. | hadn’t|had not | p
Yesterday Tom said, “I don’t feel well.” = Tom said he ___ feel well. | didn’t|did not | v
Yesterday Jo said, “I can’t make it tonight.” = Jo said she ___ make it that night. | couldn’t|could not | m`,
 ttg:`You’ve saved me a seat, ___? | haven’t you | n
There aren’t any tickets left, ___? | are there | p
Let’s get a takeaway, ___? | shall we | s
Nobody’s called back yet, ___? | have they | s
I’m not too late, ___? | am I | s`,
 tcd:`If the café’s full, we ___ (get) a takeaway coffee. Use the first conditional. | will get|’ll get|'ll get | 1
If I ___ (have) Friday off, I’d come with you. | had | 2
If you ___ (heat) butter, it melts. | heat | 0
If you ___ (need) a lift tomorrow, I’ll pick you up. | need | 1
I ___ (not / buy) that phone if I were you. | wouldn’t buy|would not buy | 2`,
 tgi:`Do you fancy ___ (get) something to eat? | getting | g
I didn’t mean ___ (wake) you up. | to wake | i
Thanks for ___ (wait) for me. | waiting | p
We managed ___ (find) a table by the window. | to find | i
She suggested ___ (take) a break. | taking | g`,
 twf:`Thanks for being so ___. You’ve been a huge help. (HELP) | helpful | a
I need to make a ___ about the job by Friday. (DECIDE) | decision | n
It’s ___ to park here. There’s a clear No Parking sign. (LEGAL) | illegal | o
Our new ___ explains things really clearly. (TEACH) | teacher | p
That was a bit ___ of me. I should have checked your name. (CARE) | careless | a`
 };
 Object.entries(typed).forEach(([k,t])=>{
  let items=rows(t).map(([p,a,m])=>({p,a:a.split('|'),h:'Read the context and check the target form.',nl:true,m}));
  // V3 practice gets five new verbs, not duplicates of the existing verb list.
  if(k==='tv3')items=rows(`deal - dealt - ___ | dealt | s
shoot - shot - ___ | shot | s
shine - shone - ___ | shone|shined | s
tear - tore - ___ | torn | n
blow - blew - ___ | blown | n`).map(([p,a,m])=>({p,a:a.split('|'),h:'Type the past participle (third form).',nl:true,m}));
  // shoot already appears in the old V3 bank; use a different irregular verb.
  if(k==='tv3')items[1]={p:'stick - stuck - ___',a:['stuck'],h:'stick → stuck → stuck.',nl:true,m:'s'};
  const original=TYD[k].pool.bind(TYD[k]);const before=original('all').length;
  TYD[k].pool=mode=>original(mode).concat(items.filter(x=>mode==='all'||x.m===mode));
  B1_CONTENT_AUDIT.push({bank:'typewriter',key:k,before,added:5,after:before+5});
 });
 // State the requested tense so another grammatical tense is not marked wrong in an open gap.
 const passivePool=TYD.tpa.pool.bind(TYD.tpa);
 TYD.tpa.pool=mode=>passivePool(mode).map(it=>{
  const a=it.a[0].replace(/[’]/g,"'");
  const cue=/^(was|were)/.test(a)?'Past Simple passive':/^will/.test(a)?'Future passive with will':/^(has|have|been)/.test(a)?'Present Perfect passive':/^be /.test(a)?'modal passive':'Present Simple passive';
  return {...it,p:it.p+' ['+cue+']'};
 });
 const conditionalPool=TYD.tcd.pool.bind(TYD.tcd);
 TYD.tcd.pool=mode=>conditionalPool(mode).map(it=>{
  const type=/^Zero conditional/.test(it.h)?'Zero conditional':/^First conditional/.test(it.h)?'First conditional':/^Second conditional/.test(it.h)?'Second conditional':null;
  return type?{...it,p:it.p+' ['+type+']'}:it;
 });
 TYD.trp.help+=' For this task, report the words later using standard backshift.';
 const tagPool=TYD.ttg.pool.bind(TYD.ttg);
 TYD.ttg.pool=mode=>tagPool(mode).map(it=>it.p==='Open the door, ___?'?{...it,a:['will you','can you','could you','would you','won’t you']}:it.p==='I am late, ___?'?{...it,a:['aren’t I','am I not']}:it);
 const magnetText={
 pf:`+ | I’ve just sent you the address.
- | We haven’t decided where to eat yet.
? | Have you seen the message I sent you?
time | I’ve had this phone for three years.
+ | She’s already booked us a table.`,
 pc:`+ | I’ve been trying to call you all morning.
- | We haven’t been getting much sleep lately.
? | How long have you been working from home?
cause | Your shoes are muddy because you’ve been walking through the park.
+ | She’s been looking for a flat near work.`,
 cd:`1 | If you’re running late, I’ll save you a seat.
2 | If I had Friday off, I’d come with you.
0 | If I drink coffee after dinner, I can’t sleep.
1 | I’ll text you when I get home.
2 | What would you do if you lost your phone?`,
 rp:`be | Mia said she was stuck in traffic.
v | Tom said he didn’t feel well.
m | Ben said he would give me a lift.
p | Ella said she hadn’t checked her messages.
m | Jo said she couldn’t make it that night.`,
 rc:`people | She’s the neighbour who feeds our cat.
things | That’s the charger that I’ve been looking for.
places | This is the café where we usually meet.
whose | He’s the friend whose bike I borrowed.
join | The app that you recommended is really useful.`,
 md:`must | You must be exhausted.
might | She might be on another call.
cant | That can’t be my suitcase.
must | Someone must be cooking downstairs.
might | They might be waiting at the other entrance.`,
 ge:`ing | Would you mind turning the music down?
to | We decided to take a taxi home.
prep | Thanks for waiting for me.
meaning | Try restarting your phone.
meaning | I remember locking the front door.`
 };
 const magContext={
 rp:['Yesterday Mia said, “I’m stuck in traffic.” Report it later with backshift.','Yesterday Tom said, “I don’t feel well.” Report it later with backshift.','Yesterday Ben said to me, “I’ll give you a lift.” Report it later with backshift.','Yesterday Ella said, “I haven’t checked my messages.” Report it later with backshift.','Yesterday Jo said, “I can’t make it tonight.” Report it the next day with backshift.'],
 rc:[null,null,null,null,'The app is really useful. You recommended it. Join with that.'],
 md:['You’ve been up since five and haven’t had a break. Use must.','Maybe she’s on another call. You aren’t sure. Use might.','My suitcase is blue. That one is bright red. Use can’t.','You can smell dinner and hear pans downstairs. Use must.','Maybe they’re at the other entrance. Use might.'],
 ge:[null,null,null,'You want to suggest a possible fix for a phone that keeps freezing. Use try + -ing.','You can picture turning the key in the front door. Use remember + -ing.']
 };
 Object.entries(magnetText).forEach(([k,t])=>{
  const target=B1MAG['mb1'+k].items();const items=rows(t).map(([type,s],i)=>[type,[s],null,null,{prompt:magContext[k]?.[i]||'Build the sentence. Read it aloud, then make a similar sentence about your life.'}]);
  add('magnets','mb1'+k,target,items);
 });
 const pastPairs=rows(`When I got to the café, | my friend had already left.
I couldn’t send you the photo because | my phone had run out of battery.
By the time we checked the tickets, | the price had gone up.
She ordered the same coffee because | she’d enjoyed it last time.
Before you invited everyone, | had you booked a table?`);
 add('magnets','mb1pp',B1MAG.mb1pp.items(),pastPairs.flatMap(([a,b])=>[['full',[a+' '+b]],['finish',[b],null,null,{prefix:a,prompt:'Finish the sentence with the earlier event.'}]]));
 const passivePairs=rows(`Someone delivered my parcel to the wrong flat. | My parcel was delivered to the wrong flat.
They don’t allow dogs in this café. | Dogs aren’t allowed in this café.
They’ve already sent the tickets. | The tickets have already been sent.
Someone will check your booking at the door. | Your booking will be checked at the door.
They clean the coffee machine every evening. | The coffee machine is cleaned every evening.`);
 add('magnets','mb1pa',B1MAG.mb1pa.items(),passivePairs.flatMap(([p,a])=>[['change',[a],null,null,{prompt:'Change to the passive: '+p}],['full',[a]]]));
 const tagPairs=rows(`You’ve saved me a seat, | haven’t you?
There aren’t any tickets left, | are there?
Let’s grab a coffee, | shall we?
Nobody’s replied yet, | have they?
I’m not too late, | am I?`);
 add('magnets','mb1tg',B1MAG.mb1tg.items(),tagPairs.flatMap(([prefix,tail])=>[['full',[prefix+' '+tail]],['tag',[tail],null,null,{prefix,prompt:'Add the question tag.'}]]));
 const words=rows(`prefix | I can’t ___ this file. It won’t open. | un | lock | unlock
suffix | Thanks for your ___. That was really kind. | kind | ness | kindness
suffix | This charger is ___: it doesn’t work at all. | use | less | useless
spelling | ___, I’d saved a copy before my laptop crashed. | lucky | ly | luckily
prefix | I think we ___ about where to meet. | dis | agree | disagree`);
 add('magnets','mb1wf',B1MAG.mb1wf.items(),words.map(([type,p,a,b,word])=>[type,[a+' '+b],null,null,{prompt:p,tokens:[a,b],word,follow:'Read the complete sentence aloud.'}]));
 // Keep the existing mode identifiers so every new item appears in its filter.
 B1MAG.mb1ge.items().find(it=>it[1][0]==='Learning a language takes time.')[1].push('To learn a language takes time.');
 B1MAG.mb1cd.hints.push('Zero: if + Present Simple, Present Simple for facts and habits.');
 const typeMap={mb1pp:{finish:'part'},mb1cd:{'0':'zero','1':'first','2':'second'},mb1pa:{full:'build',change:'transform'},mb1rp:{be:'present',v:'present',m:'future',p:'perfect'}};
 B1MAG.mb1cd.types.push(['zero','Zero Conditional']);
 Object.entries(typeMap).forEach(([id,map])=>B1MAG[id].items().forEach(it=>{it[0]=map[it[0]]||it[0]}));
 const pictureExtras={
 ppc:[
  [0,'Her hair’s wet, but it isn’t raining. What might she have been doing?','She’s been swimming.'],
  [1,'Those shoes are filthy. Ask how long the walk has lasted.','How long have you been walking?'],
  [2,'There’s flour on his sleeves. Finish: “He’s been …”','He’s been making bread.'],
  [3,'She hasn’t answered her phone all afternoon. What has kept her busy?','She’s been painting her room.'],
  [6,'He looks exhausted. Ask whether he has been running.','Have you been running?']
 ],
 ppf:[
  [0,'Her phone was dead when she needed a taxi. What had she forgotten to do?','She’d forgotten to charge it.'],
  [1,'The cinema was empty when she woke up. What had happened?','The film had finished, and everyone had gone home.'],
  [2,'She reached the stop just too late. Complete: “By the time she got there, …”','By the time she got there, the bus had already left.'],
  [3,'Dinner was burnt when she came back. Explain with had left.','She’d left it in the oven too long.'],
  [7,'She couldn’t make breakfast. What hadn’t she done?','She hadn’t bought any food.']
 ],
 ifw:[
  [0,'If your home had one extra room, what would you use it for?','If I had an extra room, I’d turn it into a little library.'],
  [3,'If you could have any drink delivered right now, what would you choose?','I’d choose an iced coffee if I could order anything.'],
  [4,'If you didn’t need a car, how would you get around?','If I didn’t need a car, I’d cycle everywhere.'],
  [11,'If you could wear only one outfit for a week, what would you pick?','If I had to choose, I’d pick jeans and a soft jumper.'],
  [17,'If you had to leave your phone at home tomorrow, what would be hardest?','If I left my phone at home, I wouldn’t know when my bus was coming.']
 ],
 pfm:[
  [0,'Have you ever received a message that completely changed your plans?','Yes, I have. My friend invited me on a last-minute trip.'],
  [1,'What’s something you’ve tried recently and would happily try again?','I’ve tried matcha ice cream. I’d definitely have it again.'],
  [8,'Have you ever broken something and tried to hide it? What happened?','Yes, I have. I broke a mug and bought a replacement before anyone noticed.'],
  [9,'What have you been waiting for this week? Has it happened yet?','I’ve been waiting for some exam results. They haven’t arrived yet.'],
  [15,'Have you ever deleted something by accident? Did you get it back?','Yes, I have. I deleted a photo, but luckily it was still in my backups.']
 ],
 rcl:[
  [8,'Describe a series you’d recommend. Start: “It’s a series that …”','It’s a series that makes you want to watch one more episode.'],
  [9,'Describe a song you never skip. Use that.','It’s a song that always puts me in a good mood.'],
  [14,'Describe a useful app without naming it. Use which or that.','It’s an app that helps you get home when you miss the last bus.'],
  [15,'Describe a shop you could spend hours in. Use where.','It’s a shop where I always find something I didn’t know I needed.'],
  [26,'Describe someone whose pet has a funny habit. Use whose.','I have a friend whose cat sleeps in the kitchen sink.']
 ]};
 Object.entries(pictureExtras).forEach(([k,items])=>add('picture-speaking',k,PHOTO[k],items.map(([i,q,a])=>({k:PHOTO[k][i].k,q:[[q,a]]}))));
 const wordExtras={
 wgv:`fancy | Do you fancy grabbing something to eat?
keep | I keep checking my phone even when it hasn’t buzzed.
mind | Would you mind saving me a seat?
put off | I’ve been putting off booking a dentist’s appointment.
recommend | I’d recommend getting there before the lunchtime rush.`,
 wiv:`manage | We managed to catch the last bus home.
afford | I can’t afford to replace my phone just yet.
offer | She offered to pick me up from the station.
pretend | I pretended to be busy because I didn’t want to talk.
mean | I didn’t mean to send that message to the whole group.`,
 wbo:`stop | We stopped chatting when the film started. / We stopped to chat on the way home.
remember | I remember sending the email. / Remember to send the email before lunch.
try | Try turning the sound off. / I tried to turn the sound off, but the button was broken.
like | I like cooking for friends. / I like to cook everything before my guests arrive.
need | My bike needs fixing. / I need to fix my bike before Monday.`,
 wpa:`fed up with | I’m fed up with getting stuck in traffic every morning.
excited about | We’re excited about finally meeting in person.
good at | She’s really good at making people feel welcome.
worried about | I’m worried about missing the last train.
used to (be used to) | I’m still not used to working in such a quiet office.`,
 wpv:`look forward to | I’m looking forward to having a quiet evening at home.
apologise for | Sorry, I should apologise for keeping you waiting.
think about | We’re thinking about moving somewhere a bit cheaper.
end up | We ended up staying for dinner.
get round to | Have you got round to replying to that email yet?`,
 wpo:`without | I can’t leave the house without checking I’ve got my keys.
instead of | Let’s walk instead of waiting for another bus.
before | Text me before leaving work.
by | I save money by bringing lunch from home.
in spite of | In spite of feeling nervous, I really enjoyed the lesson.`
 };
 Object.entries(wordExtras).forEach(([k,t])=>add('word-cards',k,WD[k],rows(t)));
 const contexts={
 pfi:['a message you haven’t answered yet','something you’ve just done','something you’ve never tried','a small problem you’ve had this week','something you’ve already arranged'],
 ppc:['waiting for a friend who is running late','a noisy neighbour keeping you awake','something you’ve been practising lately','a hobby keeping you busy all week','why your hands are covered in paint'],
 pperf:['you got there after everyone left','you couldn’t pay because you’d forgotten something','you realised you’d sent a message to the wrong person','you opened the fridge and got a surprise','your plans changed because of an earlier event'],
 cd1:['offer a lift if someone needs one','make a plan in case the café is full','promise to text when you get home','warn a friend about missing the last bus','arrange what to do if it rains'],
 cd2:['imagine you had Friday off','imagine your phone stopped working for a week','give a friend advice about a refund','imagine you lived closer to your friends','imagine you could work anywhere'],
 pass:['a parcel sent to the wrong flat','a café rule about dogs','a bike stolen outside a shop','how tickets are checked at the door','something made by a friend'],
 rep:['report a friend saying they’re running late','report a promise made to you yesterday','report why someone couldn’t come to dinner','report a message about a change of plans','report someone’s plans for the next day'],
 rcl:['describe the neighbour who feeds your cat','describe a charger you keep losing','describe the café where you usually meet','describe a friend whose pet is always hungry','describe an app that saves you time'],
 mdd:['a friend yawning after a night shift','someone not answering their phone','a suitcase that clearly isn’t yours','the smell of dinner from downstairs','friends waiting at another entrance'],
 gpr:['thank a friend for picking you up','say what you’re fed up with doing','talk about something you left without doing','say what you’re thinking about changing','explain how you save money'],
 gvb:['suggest somewhere quieter to meet','ask a friend to turn the music down','say what you keep forgetting','say what you avoid doing when tired','talk about what you ended up doing last night'],
 ivb:['apologise for something you didn’t mean to do','offer to give someone a lift','talk about something you can’t afford to do','say what you managed to do just in time','invite a friend and say what you’d love to do'],
 gsb:['say what helps you switch off after work','say what takes you ages to do','say what there’s no use doing','say what is hard to do alone','ask whether sharing a flat is cheaper'],
 iad:['explain why you left home early','describe a bag that is too heavy to carry','say whether the café is close enough to walk to','say what you’re glad to hear','explain why you booked online'],
 gdf:['remember sending a message; a clear memory','remember to send a message; a task still to do','try restarting a frozen phone; test a solution','try to open a stuck window; make an effort','stop to get coffee during a walk'],
 gsm:['talk about cooking for friends','say it started getting dark','say what you would love to do tonight','talk about where you prefer to sit','say what you continued doing after the lesson'],
 tag:['check that a friend has saved you a seat','check whether there are any tickets left','suggest getting something to eat','check that nobody has replied yet','check that you aren’t too late'],
 wsh:['wish your flat got more sunlight','wish you could remember names','wish your neighbours were quieter','wish you had Friday off','wish a friend lived closer']
 };
 // New rounds are paired deliberately; a random verb must not contradict the prompt.
 Object.entries(contexts).forEach(([k,list])=>{
  const C=GACHA[k];const old=C.c.length;C.c.push(...list.map(x=>'context · '+x));
  C.rounds=list.map((x,i)=>[DESKDATA[k].examples[i], 'Make a similar sentence: '+x]);
  B1_CONTENT_AUDIT.push({bank:'gachapon',key:k,before:old,added:5,after:C.c.length});
 });
 // Repair existing combinations that forced a completed action into a duration frame.
 GACHA.pfi.c=GACHA.pfi.c.map(x=>x==='statement · for two years'?'negative · for two years':x==='statement · since 2020'?'negative · since 2020':x==='question · How long…?'?'question · Have you ever…?':x);
 // General form cues are choices, not rules that apply to every possible first capsule.
 ['gpr','gvb','ivb','gdf','gsm','iad'].forEach(k=>{GACHA[k].c=GACHA[k].c.map(x=>x.startsWith('question ·')?'question · choose the auxiliary that fits the first capsule':x)});
 // Magic-ball replies stay playful but grammatically complete.
 add('magic-ball','b1',M8A.b1,[
  'I’ve been wondering the same thing. Ask again tomorrow.',
  'If I were you, I’d give it a try.',
  'That might be just what you need.',
  'I haven’t made up my mind yet. Give me a moment.',
  'It could turn out better than you expect.'
 ]);
 const boardExtras={
 p:[
  {n:'Unread message',o:'phone',lead:'Nora · reply to my message',note:'I’m still waiting for her reply.',ch:['yet','since','ever'],c:[0],ok:['Nora hasn’t replied to my message yet','She hasn’t replied to my message yet'],hv:'reply → replied',dis:['replied','has','since']},
  {n:'Coffee receipt',o:'ticket',lead:'Victor · try this café',note:'Ask about his experience at any time before now.',ch:['ever','for','yet'],c:[0],ok:['Has Victor ever tried this café','Has he ever tried this café'],hv:'try → tried',dis:['Have','tried','for']},
  {n:'Missing charger',o:'key',lead:'Grant · lose his charger',note:'It happened a moment ago, and now he can’t charge his phone.',ch:['just','since','yet'],c:[0],ok:['Grant has just lost his charger','He has just lost his charger'],hv:'lose → lost',dis:['lose','have','yet']},
  {n:'Flat key',o:'key',lead:'Nora · live in this flat',note:'From last March until now. Use the starting point.',ch:['since','for','ago'],c:[0],ok:['Nora has lived in this flat since last March','She has lived in this flat since last March'],hv:'live → lived',dis:['for','lived','ago']},
  {n:'Dinner booking',o:'phone',lead:'Victor · book a table',note:'It is done. You thought he would book it later.',ch:['already','yet','ever'],c:[0],ok:['Victor has already booked a table','He has already booked a table'],hv:'book → booked',dis:['book','have','yet']}
 ],
 t:[
  {n:'Saved seat',o:'ticket',lead:'To Nora: “You’ve saved me a seat.”',ok:['You’ve saved me a seat, haven’t you?'],dis:['hasn’t','didn’t','have'],c:[0]},
  {n:'Last tickets',o:'ticket',lead:'“There aren’t any tickets left.”',ok:['There aren’t any tickets left, are there?'],dis:['aren’t','are they','is'],c:[1]},
  {n:'Coffee break',o:'cup',lead:'“Let’s grab a coffee.”',ok:['Let’s grab a coffee, shall we?'],dis:['will','don’t','we will'],ch:['…, shall we?','…, will we?','…, don’t we?'],c:[0]},
  {n:'Group chat',o:'phone',lead:'“Nobody’s replied yet.”',ok:['Nobody’s replied yet, have they?','Nobody has replied yet, have they?'],dis:['has he','haven’t','did'],c:[1]},
  {n:'Late arrival',o:'watch',lead:'“I’m not too late.”',ok:['I’m not too late, am I?','I am not too late, am I?'],dis:['aren’t I','is','isn’t'],c:[1]}
 ],
 a:[
  ['Parcel', 'nora','Someone delivered the parcel to the wrong flat yesterday.','The parcel was delivered to the wrong flat yesterday','was / were + V3','deliver → delivered'],
  ['Café rule','cup','They don’t allow dogs in this café.','Dogs aren’t allowed in this café','am / is / are + V3','allow → allowed'],
  ['Coffee machine','cup','They clean the coffee machine every evening.','The coffee machine is cleaned every evening','am / is / are + V3','clean → cleaned'],
  ['Booking','ticket','They will check your booking at the door.','Your booking will be checked at the door','will be + V3','check → checked'],
  ['Invitations','phone','They have already sent the invitations.','The invitations have already been sent','has / have been + V3','send → sent']
 ]};
 boardExtras.p.forEach(it=>Object.assign(it,{pol:1,w:1,h:'Read the time context. Which word fits it?',h2:'Keep have / has + V3. Use the chosen time word in the correct position.'}));
 boardExtras.t.forEach(it=>Object.assign(it,{pol:2,note:'Add the usual opposite-polarity tag. Read it as a real conversation.',ch:it.ch||CWO.t.items[0].ch,h:'Match the auxiliary and the pronoun; notice negative words such as nobody.',h2:'Positive statement → negative tag; negative statement → positive tag. Let’s → shall we.',tone:'up'}));
 boardExtras.a=boardExtras.a.map(([n,o,active,answer,form,hv])=>({n,o,pol:3,lead:'Active: “'+active+'”',note:'Say the same thing in the passive.',ch:[form,'have + V3 without be','V3 without an auxiliary'],c:[0],ok:[answer],dis:['did','do'],hv,h:'Keep the tense from the active sentence.',h2:'Passive: the object becomes the subject; use a form of be + past participle.'}));
 Object.entries(boardExtras).forEach(([k,items])=>add('case-board',k,CWO[k].items,items));
 const elevatorExtras=[
  ['fa_courier.webp','Courier','he','I’m stuck in traffic.',6,2,'He said he was stuck in traffic'],
  ['fa_barista.webp','Barista','she','I haven’t had a break today.',5,1,'She said she hadn’t had a break that day'],
  ['fa_trainer.webp','Trainer','he','I’ll give you a lift tomorrow.',8,4,'He said he would give me a lift the next day'],
  ['fa_teacher.webp','Teacher','she','I can’t find my phone.',8,4,'She said she couldn’t find her phone'],
  ['fa_coder.webp','Programmer','she','I sent the link yesterday.',3,1,'She said she had sent the link the day before']
 ].map(([p,pn,g,say,from,to,answer])=>({p,pn,g,say,from,to,opts:[to,...[1,2,3,4].filter(x=>x!==to).slice(0,2)],note:'They said this to you yesterday. Report it later using backshift.',h:'Report it later: change the tense, pronouns and time expressions where needed.',h2:answer+'.',ok:[answer,answer.replace(' said ',' said that ')],dis:['is','will','have']}));
 add('tense-elevator','t1',ELO.t1.items,elevatorExtras);
 const clue=(n,box,s,t,lv,ok)=>({n,box,s,t,lv,ok,k:'',loc:'Look at the '+n.toLowerCase()+'.',dis:lv==='must'?['might','can’t']:lv==='cant'?['must','might']:['must','can’t'],h:lv==='might'?'This is only a possibility; you do not have enough evidence to be certain.':'Use the facts in this clue: is the idea strongly supported or ruled out?'});
 const e=EVO;
 const evidenceExtras={
 b1:[
  clue('Photo',e.b1.clues[4].box,'The photo caption reads “Nina, my assistant”.','What is Nina’s role?', 'must',['Nina must be his assistant','She must be his assistant']),
  clue('Answering machine',e.b1.clues[6].box,'A new message says “Sorry, the lift is out of order. I’m walking up the stairs now. — Mr Grey”.','Can Mr Grey be in the lift?','cant',['Mr Grey can’t be in the lift','He can’t be in the lift']),
  clue('Coffee note',e.b1.clues[5].box,'Nina’s note says “We haven’t decided where to have lunch yet”.','Where could they eat later?','might',['They might eat at a café','They could eat at a café','They may eat at a café']),
  clue('Laptop',e.b1.clues[2].box,'The laptop is showing a live video call. You can hear Mr Grey speaking through its speakers.','Is the laptop switched on?','must',['The laptop must be switched on','It must be switched on']),
  clue('Receipt',e.b1.clues[9].box,'The receipt says “Paid by card”. There is a matching card-payment confirmation on the phone.','Can the payment be in cash?','cant',['The payment can’t be in cash','It can’t be a cash payment'])
 ],
 h1:[
  clue('Alarm clock',e.h1.clues[2].box,'The alarm clock shows 08:15. The guest’s appointment is at 08:30.','Is there much time before his appointment?','cant',['There can’t be much time left','He can’t have much time left']),
  clue('Suitcase',e.h1.clues[5].box,'The suitcase is closed, but you can hear a phone ringing inside it.','Where is the ringing phone?','must',['The phone must be in the suitcase','It must be in the suitcase']),
  clue('Notebook',e.h1.clues[7].box,'The notebook only says “Lunch with Anna”. There is no place or time.','Where could they have lunch?','might',['They might have lunch at a café','They could have lunch at a café','They may have lunch at a café']),
  clue('Kettle',e.h1.clues[0].box,'Steam is still rising from the freshly boiled water.','What is the water like?','must',['The water must be hot','It must be hot']),
  clue('Room key',e.h1.clues[8].box,'The key tag clearly says “Room 12”, not “Room 21”.','Can this be the key to Room 21?','cant',['This can’t be the key to Room 21','It can’t be the key to Room 21'])
 ],
 k1:[
  clue('Birthday card',e.k1.clues[4].box,'The card is signed “Love, Mia”. It is addressed to Dad.','Who is the card for?','must',['The card must be for Dad','It must be for Dad']),
  clue('Fridge',e.k1.clues[2].box,'The fridge is open. There is a pudding on one shelf, but you don’t know whether Mia likes it.','What could Mia eat?','might',['Mia might eat the pudding','She might eat the pudding','Mia could eat the pudding']),
  clue('Plate',e.k1.clues[5].box,'You can see every part of the plate. There are only crumbs on it.','Can there be a whole cake on this plate?','cant',['There can’t be a whole cake on this plate','There can’t be a whole cake on it']),
  clue('Dog',e.k1.clues[6].box,'The dog’s eyes are shut. He is snoring quietly beside his bowl.','What is the dog doing?','must',['The dog must be sleeping','He must be asleep']),
  clue('Slippers',e.k1.clues[7].box,'The slippers are small. Dad’s shoes are much larger, and he cannot get his feet into them.','Can they be Dad’s slippers?','cant',['They can’t be Dad’s slippers','The slippers can’t be Dad’s'])
 ],
 l1:[
  clue('Window',e.l1.clues[0].box,'The window is open and the curtains are moving sharply in the breeze.','What is the weather like?','must',['It must be windy outside','It must be windy']),
  clue('Coffee mug',e.l1.clues[1].box,'The mug is on the table. Grandma’s name is painted on it.','Whose mug is it?','must',['It must be Grandma’s mug','The mug must be Grandma’s']),
  clue('Remote control',e.l1.clues[2].box,'The TV is off. The remote is on the shelf, but you don’t know whether its batteries work.','Why might the remote not work?','might',['The batteries might be flat','Its batteries could be flat','The batteries may be flat']),
  clue('Vase',e.l1.clues[7].box,'Several pieces of the vase are lying separately on the floor.','Can the vase still be in one piece?','cant',['The vase can’t be in one piece','It can’t be in one piece']),
  clue('Cat',e.l1.clues[8].box,'The cat is behind the chair. Nothing else shows what she plans to do next.','What might she do next?','might',['She might jump onto the sofa','The cat might jump onto the sofa','She could jump onto the sofa'])
 ],
 s1:[
  clue('Screen',e.s1.clues[0].box,'The document title is “CHAPTER 12”. You can see a novel in progress.','What kind of text is she working on?','must',['She must be writing a novel','She must be working on a novel']),
  clue('Clock',e.s1.clues[1].box,'It is 14:05. The printed deadline says 17:00 today.','Can the deadline already be over?','cant',['The deadline can’t be over yet','It can’t be past the deadline yet']),
  clue('Coffee mug',e.s1.clues[4].box,'The coffee is cold. You don’t know whether Ms Reed wants another cup.','What might she do with it?','might',['She might make a fresh cup','She might get another coffee','She could make a fresh cup']),
  clue('Folder',e.s1.clues[8].box,'The folder is labelled “NEW NOVEL – Ms Reed”. Her editor is expecting it.','Whose novel is it?','must',['It must be Ms Reed’s novel','The novel must be Ms Reed’s']),
  clue('Bin',e.s1.clues[7].box,'You can see all the way into the bin. It is completely empty.','Can her torn drafts be inside this bin?','cant',['Her torn drafts can’t be in this bin','They can’t be in this bin'])
 ]};
 Object.entries(evidenceExtras).forEach(([k,items])=>add('evidence-room',k,EVO[k].clues,items));
 const factoryPairs=[
  ['fa_barista.webp','barista','A barista is someone.','They make your coffee.','They','A barista is someone who makes your coffee','people'],
  ['fa_cafe.webp','café','A café is a place.','You can meet a friend there.','there','A café is a place where you can meet a friend','place'],
  ['fa_speaker.webp','smart speaker','A smart speaker is a device.','It can play your favourite songs.','It','A smart speaker is a device which can play your favourite songs','thing'],
  ['fa_courier.webp','courier','A courier is someone.','They bring parcels to your door.','They','A courier is someone who brings parcels to your door','people'],
  ['fa_park.webp','park','A park is a place.','People can go for a walk there.','there','A park is a place where people can go for a walk','place']
 ];
 const factoryItem=(p,join=false)=>{
  let [im,n,a,b,rep,answer,kind]=p;
  if(join){
   const versions={barista:['That’s the barista.','They remember my order.','That’s the barista who remembers my order'],café:['This is the café.','We usually meet there.','This is the café where we usually meet'],'smart speaker':['I use a speaker.','It plays music in the kitchen.','I use a speaker which plays music in the kitchen'],courier:['I spoke to the courier.','They brought my parcel.','I spoke to the courier who brought my parcel'],park:['That’s the park.','We walk the dog there.','That’s the park where we walk the dog']};[a,b,answer]=versions[n];
  }
  return {im,n,a,b,rep,ch:['who','which','where','that'],c:kind==='people'?[0,3]:kind==='thing'?[1,3]:[2],ok:kind==='place'?[answer]:[answer,answer.replace(kind==='people'?' who ':' which ',' that ')],dis:kind==='people'?['which','where']:kind==='thing'?['who','where']:['who','which'],h:'Look at the role of the missing word: person, thing, or at/in a place.',h2:kind==='people'?'Use who or that as the subject of the relative clause.':kind==='thing'?'Use which or that as the subject of the relative clause.':'Use where to replace there, meaning at/in that place.'};
 };
 add('factory','definitions',FYO['1'].d.items,factoryPairs.map(p=>factoryItem(p)));
 add('factory','join',FYO['1'].j.items,factoryPairs.map(p=>factoryItem(p,true)));
 add('factory','sort',FYO['1'].s.items,factoryPairs.map(([im,n,,,,,,kind])=>({im,l:'a '+n,a:kind==='people'?'who':kind==='place'?'where':'which'})));
 const quality=[
  {im:'fa_cafe.webp',n:'café',s:'This is the café which we usually meet.',hl:'which',good:0,ch:['who','which','where','that'],c:[2],ok:['This is the café where we usually meet','This is the café which we usually meet in','This is the café that we usually meet in'],dis:['who','which'],h:'The second clause means we meet at that place.',h2:'Use where, or which/that plus a preposition.'},
  {im:'fa_barista.webp',n:'barista',s:'That’s the barista who remembers my order.',hl:'who',good:1,hg:'The relative pronoun who is the subject and refers to a person.'},
  {im:'fa_speaker.webp',n:'smart speaker',s:'I use a speaker who plays music in the kitchen.',hl:'who',good:0,ch:['who','which','where','that'],c:[1,3],ok:['I use a speaker which plays music in the kitchen','I use a speaker that plays music in the kitchen'],dis:['who','where'],h:'Here a speaker is a device, not a person.',h2:'Use which or that for the device.'},
  {im:'fa_courier.webp',n:'courier',s:'The courier who brought my parcel was really friendly.',hl:'who',good:1,hg:'Who refers to the courier and is the subject of brought.'},
  {im:'fa_park.webp',n:'park',s:'That’s the park that we walk the dog.',hl:'that',good:0,ch:['who','which','where','that'],c:[2],ok:['That’s the park where we walk the dog','That’s the park that we walk the dog in','That’s the park which we walk the dog in'],dis:['who','that'],h:'The dog is the object of walk. We need a word meaning in that place.',h2:'Use where, or add in after the relative clause with which/that.'}
 ];
 add('factory','quality-control',FYO['1'].q.items,quality);
 // Five additional riddles reuse familiar object pictures with fresh definitions.
 add('guess-what','b1',GWI,[
  ['ut notebook','a notebook','a thing','It’s something that …','I use to write down ideas before I forget them.','Who might use it? It’s useful for someone who …','likes making lists.'],
  ['ut earphones','earphones','things','They’re things which …','let me listen to a podcast on the bus.','When do you need them? I use them when …','I don’t want to disturb anyone.'],
  ['ut camera','a film camera','a device','It’s a device that …','takes pictures you can’t check straight away.','Who might like it? It’s for people who …','enjoy waiting for a surprise.'],
  ['gw coins','coins','small things','They’re things which …','I always find at the bottom of my bag.','Where might you use them? A machine where you can spend them …','might sell drinks or snacks.'],
  ['gw duolingo','a language app','an app','It’s an app that …','reminds me to practise a language every day.','Who might use it? It’s handy for someone who …','wants to learn a little on the way to work.']
 ]);
 // Use safe, reviewed baseline capsule pairs; no incompatible random grammar cues.
 const safeContexts={
 pfi:['statement · just','statement · already','negative · yet','question · ever','negative · never','statement · this week','question · recently','statement · so far','question · ever','statement · already','question · ever','negative · still'],
 gpr:['statement about a hobby','statement about a future plan','question about a fear','statement about a daily annoyance','thank someone for doing something','apologise for doing something','statement about the weekend','suggest an alternative action','question about a problem','statement about an ambition','statement about a small success','statement about paying for something'],
 gvb:['statement about free time','negative about a bad habit','question about something completed','polite question with Would you mind','suggest an activity','statement about a repeated habit','statement about learning a skill','question with Can you imagine','statement about a possible change','statement about something you no longer do','statement about a habit you stopped','statement about something you find annoying'],
 ivb:['statement about tonight','statement about a choice','statement about the future','statement about a trip','statement about a promise','statement about something you won’t do','statement about a small success','negative about money','statement about learning a skill','statement about an arrangement','statement about something urgent','polite request'],
 gdf:['pause a walk to buy coffee: stop to do','a memory of an earlier action: remember doing','a task you failed to do: forget to do','test a possible solution: try doing','be sorry about an earlier action: regret doing','continue the same activity: go on doing'],
 gsm:['general preference; -ing or to V','something you enjoy; -ing or to V','something you dislike; -ing or to V','a choice; -ing or to V','an activity starting; -ing or to V','an activity beginning; -ing or to V','an activity continuing; -ing or to V','something unbearable; -ing or to V'],
 iad:['feeling: happy to help','feeling: ready to leave','feeling: glad to hear news','feeling: sorry to interrupt','feeling: surprised to see someone','feeling: afraid to ask a question','a problem: too hot to drink','a problem: too small to fit','ability: tall enough to reach','ability: old enough to vote','a problem: too young to drive','a task: easy enough to do']
 };
 Object.entries(contexts).forEach(([k,list])=>{
  const C=GACHA[k],safe=safeContexts[k];C.reviewedRounds=C.v.map((v,i)=>[v,safe?safe[i%safe.length]:C.c[i%Math.min(12,C.c.length)]]);
 });
 const extraWords={pfi:['send','try','have','lose','book'],ppc:['wait','work','practise','learn','paint'],pperf:['leave','forget','send','eat','change'],cd1:['offer','get','text','leave','rain'],cd2:['have','lose','be','live','work'],pass:['deliver','allow','steal','check','make'],rep:['say','promise','explain','tell','say'],rcl:['who','that','where','whose','that'],mdd:['must','might','can’t','must','might'],gpr:['thank you for','fed up with','without','think about','by'],gvb:['suggest','mind','keep','avoid','end up'],ivb:['mean','offer','afford','manage','would love'],gsb:['switch off','choose','call','cook','share a flat'],iad:['to avoid','too heavy','close enough','glad','in order to'],gdf:['remember doing','remember to do','try doing','try to do','stop to do'],gsm:['love','start','would love','prefer','continue'],tag:['have','there are','let’s','nobody has','I am'],wsh:['get','can','be','have','live']};
 Object.entries(contexts).forEach(([k,list])=>{GACHA[k].rounds=list.map((x,i)=>[extraWords[k][i],'context · '+x])});
 const ballQuestions={
 pfi:['Have I left my keys at work?','Has my cat stolen my snack?','Have we met somewhere before?','Has my parcel arrived yet?','Have I sent that message to the wrong person?'],
 ppc:['Has my neighbour been practising the drums again?','Have I been spending too much time online?','Has my cat been sleeping on my clean clothes?','Have they been waiting at the wrong entrance?','Have I been learning English in my sleep?'],
 pperf:['Had the film already started when I got there?','Had I met her before the party?','Had someone eaten my lunch before I opened the fridge?','Had I locked the door before I left?','Had they booked the last table before I called?'],
 cd1:['Will I catch the last bus if I leave now?','Will my friend forgive me if I bring cake?','Will I feel better if I take a break?','Will we get a table if we go early?','Will my cat notice if I move its bed?'],
 cd2:['Would I sleep better if I left my phone in another room?','Would I enjoy living by the sea?','Would my cat cook dinner if it could?','Would I take better photos if I had a new phone?','Would we meet more often if we lived closer?'],
 pass:['Was my parcel delivered to the wrong flat?','Are these biscuits made with real butter?','Was that message sent to everyone?','Is breakfast included in the price?','Were my keys found under the sofa?'],
 mdd:['Could my charger be under the sofa?','Might she still be on another call?','Could that noise be my cat?','Might they be waiting outside?','Could this be the start of a good week?']
 };
 Object.entries(ballQuestions).forEach(([k,items])=>{const before=M8T[k][1].split(' · ').length;M8T[k][1]+=' · '+items.join(' · ');B1_CONTENT_AUDIT.push({bank:'magic-ball-questions',key:k,before,added:5,after:before+5})});
 // Original recorded clips keep their existing file indices. New messages use device speech.
 add('voice-messages','b1',VMR,[
  ['I’m running a bit late.','s',1.7,'device'],
  ['I haven’t checked my messages yet.','s',2.1,'device'],
  ['Could you save me a seat?','c',1.8,'device'],
  ['Do you know where my charger is?','y',2.0,'device'],
  ['I’ll give you a lift tomorrow.','s',1.9,'device']
 ]);
})();

// A typed contraction may stand for either auxiliary; the authored model determines the intended one.
function b1AnswerMatch(input,expected){
 const clean=s=>cwNorm(String(s)).replace(/[.,!?;:]/g,'').replace(/\s+/g,' ').trim();
 const past=/^(?:(?:already|just|never|ever) )?(?:been|got|had|seen|gone|done|made|taken|given|said|written|eaten|read|sent|found|lost|left|bought|brought|caught|forgotten|broken|known|told|won|grown|flown|worn|chosen|drunk|begun|met|put|cut|built|heard|kept|paid|run|slept|spoken|understood|[a-z]+ed)\b/;
 const result=clean(expected)
  .replace(/\b(i|you|he|she|it|we|they)'d (?=.)/g,(m,p,offset,text)=>p+(past.test(text.slice(offset+m.length))?' had ':' would '))
  .replace(/\b(he|she|it|that|there|who|nobody|somebody|everyone|someone|what)'s (?=.)/g,(m,p,offset,text)=>{
   const rest=text.slice(offset+m.length);const adjective=/^(?:(?:already|just) )?(?:tired|worried|scared|interested|excited|surprised|pleased|afraid)\b/.test(rest);
   return p+(past.test(rest)&&!adjective?' has ':' is ');
  });
 let values=[clean(input)];
 const expand=(pattern,options)=>{values=values.flatMap(v=>pattern.test(v)?options.map(o=>v.replace(pattern,o)):[v])};
 expand(/\b(i|you|he|she|it|we|they)'d\b/,["$1 would","$1 had"]);
 expand(/\b(he|she|it|that|there|who|nobody|somebody|everyone|someone|what)'s\b/,["$1 is","$1 has"]);
 return values.includes(result);
}
