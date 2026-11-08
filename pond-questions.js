/* Topic-specific, checkable question prompts. No generative or remote answer grader. */
(()=>{
 const read=text=>text.trim().split('\n').map(line=>{const [question,cue,answers]=line.split(' | ');return {question,cue,answers:answers.split(' ~ ')}});
 const bank={
 be:read(`Who is Mia? | Mia / a teacher | Mia is a teacher.
Where are the cats? | The cats / in the garden | The cats are in the garden.
How is Ben today? | Ben / happy | Ben is happy.
Are the children tired? | No / they | No, they are not.
Is the bag blue? | Yes / it | Yes, it is.
Who are you? | I / a student | I am a student.`),
 pskids:read(`What does Tom do every day? | Tom / play / football | Tom plays football.
What do the children like? | They / like / cats | They like cats.
What does Mia read? | She / read / books | She reads books.
What do we eat? | We / eat / apples | We eat apples.
What does the dog do? | It / run | It runs.
What do you drink? | I / drink / milk | I drink milk.`),
 ps:read(`What does Mia do after school? | She / play / tennis | She plays tennis.
Does Tom like coffee? | No / he | No, he does not.
Where do they live? | They / live / in London | They live in London.
When does Ben get up? | He / get up / at seven | He gets up at seven.
What does your sister do on Sundays? | She / not work / on Sundays | She does not work on Sundays.
Do you walk to school? | Yes / I | Yes, I do.`),
 pc:read(`What is Mia doing now? | She / read / a book | She is reading a book.
What are the boys doing? | They / play / football | They are playing football.
Is the cat sleeping? | No / it | No, it is not.
What is Dad making? | He / make / a cake | He is making a cake.
Are you listening? | Yes / I | Yes, I am.
Why is Ben wet? | He / swim | He is swimming.`),
 there:read(`What is on the table? | There / a book / on the table | There is a book on the table.
What is in the garden? | There / two cats / in the garden | There are two cats in the garden.
Is there a sofa in the room? | Yes / there | Yes, there is.
Are there any apples? | No / there | No, there are not.
What is under the chair? | There / a bag / under the chair | There is a bag under the chair.
What is in the box? | There / three toys / in the box | There are three toys in the box.`),
 pastkids:read(`What did Tom do yesterday? | Tom / play / football | Tom played football.
What did Mia watch? | She / watch / a film | She watched a film.
What did the dog do? | It / jump | It jumped.
What did the children do? | They / paint / a picture | They painted a picture.
Did you visit Grandma? | Yes / I | Yes, I did.
Did Ben wash the car? | No / he | No, he did not.`),
 past:read(`Where did Mia go yesterday? | She / go / to the park | She went to the park.
What did Ben buy? | He / buy / a book | He bought a book.
Did they see the film? | No / they | No, they did not.
When did you arrive? | I / arrive / at six | I arrived at six.
What did you eat? | I / eat / pizza | I ate pizza.
Were the children at home? | Yes / they | Yes, they were.`),
 plural:read(`What is the plural of one box? | two ___ | two boxes
What is the plural of one baby? | three ___ | three babies
What is the plural of one cat? | two ___ | two cats
What is the plural of one bus? | four ___ | four buses
What is the plural of one toy? | five ___ | five toys
What is the plural of one child? | two ___ | two children`),
 time:read(`What time is it? | 7:00 — write it in words | It is seven o'clock. ~ Seven o'clock.
What time is it? | 4:30 — use half past | It is half past four. ~ Half past four.
When does the lesson start? | It / start / 9:00 | It starts at nine o'clock. ~ It starts at nine.
What time is it? | 8:15 — use quarter past | It is quarter past eight. ~ It is a quarter past eight. ~ Quarter past eight.
When do you go to bed? | I / go to bed / 9:00 | I go to bed at nine o'clock. ~ I go to bed at nine.
What time is it? | 5:45 — use quarter to | It is quarter to six. ~ It is a quarter to six. ~ Quarter to six.`),
 have:read(`What has Mia got? | She / a red bag | She has got a red bag. ~ She has a red bag.
Have the boys got a dog? | Yes / they | Yes, they have.
Has Ben got a camera? | No / he | No, he has not.
What have you got? | I / two pencils | I have got two pencils. ~ I have two pencils.
What has the cat got? | It / green eyes | It has got green eyes. ~ It has green eyes.
Have you got a ticket? | No / I | No, I have not.`),
 possessive:read(`Whose bag is this? | It belongs to Mia. This is ___ bag. | This is her bag.
Whose pencils are these? | They belong to me. They are ___. | They are mine.
What are these near you? | ___ are my books. | These are my books.
What is that far away? | ___ is a bird. | That is a bird.
Whose coat is this? | It belongs to you. This coat is ___. | This coat is yours.
Whose hat is this? | It belongs to Ben. This is ___ hat. | This is his hat.`),
 wordorder:read(`Where does Mia live? | lives / in Paris / Mia | Mia lives in Paris.
What are they doing? | are / they / reading | They are reading.
Can Ben swim? | can / yes / he | Yes, he can.
When do you have breakfast? | at eight / have breakfast / I | I have breakfast at eight. ~ At eight I have breakfast.
What does Tom like? | likes / Tom / music | Tom likes music.
Where is the cat? | on the sofa / is / the cat | The cat is on the sofa.`),
 pronouns:read(`Where is Mia? | Replace Mia: ___ is at school. | She is at school.
Where are the boys? | Replace the boys: ___ are outside. | They are outside.
Who is this present for? | For Ben: It is for ___. | It is for him.
Whose bag is it? | It belongs to me. It is ___. | It is mine.
Who can help us? | Mia can help ___. | Mia can help us.
What is that near your hand? | ___ is my pencil. | This is my pencil.`),
 prepositions:read(`Where is the cat? | The cat / under / the table | The cat is under the table.
Where is the lamp? | The lamp / between / the bed and the desk | The lamp is between the bed and the desk.
Where are the books? | The books / on / the shelf | The books are on the shelf.
Where is the chair? | The chair / next to / the window | The chair is next to the window.
Where is the bag? | The bag / behind / the door | The bag is behind the door.
Where are the shoes? | The shoes / in front of / the sofa | The shoes are in front of the sofa.`),
 imperatives:read(`What should Ben do with the door? | Tell him: open / the door | Open the door.
What should Mia do with the light? | Tell her: turn off / the light | Turn off the light.
What is the rule in the library? | not / shout | Do not shout.
What should the children do? | Tell them: sit down | Sit down.
What should Ben do with the book? | Tell him: put / the book / on the table | Put the book on the table.
What should Mia remember? | not / forget / your bag | Do not forget your bag.`),
 count:read(`How many apples are there? | There / three apples | There are three apples.
How much milk is there? | There / a little milk | There is a little milk.
Is there any bread? | No / there | No, there is not.
What do we need for lunch? | We / need / some rice | We need some rice.
How many eggs do we need? | We / need / a few eggs | We need a few eggs.
Is there much sugar? | No / there / not much sugar | No, there is not much sugar.`),
 gerund:read(`What does Mia enjoy? | She / enjoy / swim | She enjoys swimming.
What is Ben good at? | He / be good at / draw | He is good at drawing.
What do they avoid? | They / avoid / drive / at night | They avoid driving at night.
What does Tom miss? | He / miss / play / football | He misses playing football.
What did you finish? | I / finish / read / the book | I finished reading the book.
What does she suggest? | She / suggest / walk / home | She suggests walking home.`),
 questions:read(`How do you ask about Mia's home? | where / Mia / live | Where does Mia live?
How do you ask about Ben's age? | how old / Ben | How old is Ben?
How do you ask about their breakfast? | what / they / eat / for breakfast | What do they eat for breakfast?
How do you ask about the price? | how much / it / cost | How much does it cost?
How do you ask about yesterday? | where / you / go / yesterday | Where did you go yesterday?
How do you ask about a bag's owner? | whose / bag / this | Whose bag is this?`),
 mixpresent:read(`What is different today? | Usually she walks, but today she ___ (cycle). | Usually she walks, but today she is cycling.
What does Ben usually drink? | He / usually / drink / tea | He usually drinks tea.
What is Mia doing right now? | She / write / an email | She is writing an email.
Does Tom work on Sundays? | No / he | No, he does not.
Why can't you talk now? | I / have / dinner / right now | I am having dinner right now.
What does the shop sell? | It / sell / books | It sells books.`),
 pastcontinuous:read(`What was Mia doing at eight? | She / read / a book | She was reading a book.
What were the boys doing at noon? | They / play / chess | They were playing chess.
Was Ben sleeping? | No / he | No, he was not.
What were you doing when I called? | I / cook / dinner | I was cooking dinner.
Were they waiting outside? | Yes / they | Yes, they were.
What was Dad doing all evening? | He / paint / the kitchen | He was painting the kitchen.`),
 mixpast:read(`What happened while you were cooking? | I / cook / when / the phone / ring | I was cooking when the phone rang.
What did you see on your way home? | While / I / walk / home / I / see / Mia | While I was walking home, I saw Mia.
What was Ben doing at seven? | He / watch / TV | He was watching TV.
What interrupted the game? | We / play / when / it / start / to rain | We were playing when it started to rain.
Why didn't she hear the phone? | She / sleep / when / it / ring | She was sleeping when it rang.
What happened when you opened the door? | The cat / run / out | The cat ran out.`),
 modals:read(`What is your advice for a tired friend? | You / should / rest | You should rest.
What is the museum rule about photos? | You / must not / take / photos | You must not take photos.
Is a tie necessary? | No. You / not have to / wear / a tie | You do not have to wear a tie.
What must Ben do before school? | He / have to / finish / his homework | He has to finish his homework.
What can Mia do well? | She / can / swim | She can swim.
What should we do about the rain? | We / should / take / an umbrella | We should take an umbrella.`),
 used:read(`Where did Mia live as a child? | She / used to / live / in Rome | She used to live in Rome.
Did Ben play tennis as a child? | Ask with use to: Ben / play / tennis | Did Ben use to play tennis?
What was different before? | I / not use to / like / coffee | I did not use to like coffee.
What did they do after school? | They / used to / play / outside | They used to play outside.
Did she wear glasses? | Yes / she | Yes, she did.
What has changed about the bus? | It / used to / be / cheaper | It used to be cheaper.`),
 infinitive:read(`What did Mia decide? | She / decide / study / French | She decided to study French.
What do they enjoy? | They / enjoy / cook / together | They enjoy cooking together.
What does Ben hope? | He / hope / pass / the exam | He hopes to pass the exam.
What does Mia avoid? | She / avoid / drive / at night | She avoids driving at night.
Why did he go to the shop? | He / go / to the shop / buy / milk | He went to the shop to buy milk.
What did you stop doing? | I / stop / smoke | I stopped smoking.`),
 perfect:read(`Why can't Mia open the door? | She / lose / her keys. Use Present Perfect. | She has lost her keys.
Have they finished the work? | No / they / not finish / it / yet | No, they have not finished it yet.
What has Ben just done? | He / just / send / the email | He has just sent the email.
How long have you lived here? | I / live / here / for two years | I have lived here for two years.
Has Mia ever visited Rome? | No / she / never / visit / Rome | No, she has never visited Rome.
What has changed in the kitchen? | We / buy / a new fridge | We have bought a new fridge.`),
 comparison:read(`Which animal is bigger? | An elephant / big / a mouse | An elephant is bigger than a mouse.
Which bag is the most expensive? | The blue bag / expensive / of all | The blue bag is the most expensive of all.
How does Mia's room compare? | Her room / small / mine | Her room is smaller than mine.
Are the two chairs equally comfortable? | This chair / as comfortable as / that one | This chair is as comfortable as that one.
Which film was better? | The first film / good / the second | The first film was better than the second.
What is the busiest day? | Saturday / busy / day of the week | Saturday is the busiest day of the week.`),
 perfectcontinuous:read(`Why are Mia's hands covered in paint? | She / paint / the kitchen. Use Present Perfect Continuous. | She has been painting the kitchen.
How long has Ben been waiting? | He / wait / for an hour | He has been waiting for an hour.
Why are they tired? | They / work / all day | They have been working all day.
What have you been doing this morning? | I / study / English | I have been studying English.
Has she been sleeping well? | No / she | No, she has not.
Why are the children wet? | They / play / in the rain | They have been playing in the rain.`),
 pastperfect:read(`Why couldn't Mia get into her flat? | She / forget / her keys. Use Past Perfect. | She had forgotten her keys.
What had happened before you arrived? | The film / already / start | The film had already started.
Had Ben eaten before the lesson? | No / he | No, he had not.
Why did the street look wet? | It / rain / earlier | It had rained earlier.
What had she never done before that trip? | She / never / fly / before | She had never flown before.
Why couldn't you buy the tickets? | The show / sell / out | The show had sold out.`),
 conditional:read(`What will you do if it rains? | If / it / rain / we / stay / at home | If it rains, we will stay at home. ~ We will stay at home if it rains.
What would Mia do with more free time? | If / she / have / more free time / she / learn / Italian | If she had more free time, she would learn Italian. ~ She would learn Italian if she had more free time.
What will happen if Ben studies? | If / he / study / he / pass / the exam | If he studies, he will pass the exam. ~ He will pass the exam if he studies.
What would you do with a million pounds? | If / I / have / a million pounds / I / buy / a house | If I had a million pounds, I would buy a house. ~ I would buy a house if I had a million pounds.`),
 passive:read(`Where are these bikes made? | They / make / in Germany. Use Passive. | They are made in Germany.
What happened to Mia's phone? | It / steal / yesterday | It was stolen yesterday.
Who wrote this book? | This book / write / by a teenager | This book was written by a teenager.
When is the room cleaned? | It / clean / every morning | It is cleaned every morning.
Was the window broken by the children? | No / it | No, it was not.
Where is English spoken? | English / speak / in many countries | English is spoken in many countries.`),
 reported:read(`What did Mia say yesterday? | “I am tired.” Start: Mia said that… | Mia said that she was tired. ~ Mia said she was tired.
What did Ben tell you last week? | “I will call you.” Start: Ben told me that… | Ben told me that he would call me. ~ Ben told me he would call me.
What did they say yesterday? | “We have finished.” Start: They said that… | They said that they had finished. ~ They said they had finished.
What did Anna say on Monday? | “I can't come.” Start: Anna said that… | Anna said that she could not come. ~ Anna said she could not come.
What did Tom say yesterday? | “I work from home.” Start: Tom said that… | Tom said that he worked from home. ~ Tom said he worked from home.
What did Mia tell you last week? | “I have lost my bag.” Start: Mia told me that… | Mia told me that she had lost her bag. ~ Mia told me she had lost her bag.`),
 relatives:read(`Who is the man? | He / the man / lives next door. Use who. | He is the man who lives next door.
Which café do you mean? | It / the café / we met. Use where. | It is the café where we met.
Which book do you mean? | It / the book / you lent me. Use that. | It is the book that you lent me.
Who is Mia? | She / the girl / dog is missing. Use whose. | She is the girl whose dog is missing.
What does the app do? | It / an app / helps me study. Use which. | It is an app which helps me study.
Which teacher do you mean? | She / the teacher / helped me. Use who. | She is the teacher who helped me.`),
 tags:read(`How do you check your assumption? | You are coming, ___? Write the whole sentence. | You are coming, aren't you?
How do you check about the train? | It hasn't left, ___? Write the whole sentence. | It has not left, has it?
How do you invite agreement? | It was a lovely day, ___? Write the whole sentence. | It was a lovely day, wasn't it?
How do you check about Mia? | She can swim, ___? Write the whole sentence. | She can swim, can't she?
How do you make this suggestion? | Let's go, ___? Write the whole sentence. | Let's go, shall we?
How do you check your seat? | I'm in the right place, ___? Write the whole sentence. | I am in the right place, aren't I?`),
 deduction:read(`What do you conclude from the light? | The lights are on. He / must / be / at home | He must be at home.
Could this be Mia's coat? | Her coat is blue. This coat is red. It / cannot / be / hers | It cannot be hers.
Where might Ben be? | He / might / be / in the garden | He might be in the garden.
Why is she carrying an umbrella? | It / might / rain | It might rain.
What do you conclude if Ben has not eaten all day? | He / must / be / hungry | He must be hungry.
Could that animal be a cat? | It is barking. It / cannot / be / a cat | It cannot be a cat.`),
 wordformation:read(`What kind of person is Mia? | She is very ___ (help). | She is very helpful.
How did Ben answer? | He answered ___ (polite). | He answered politely.
What is the opposite of possible? | It is ___ (possible). | It is impossible.
What do we need to make? | We need to make a ___ (decide). | We need to make a decision.
How does she feel? | She feels ___ (hope). | She feels hopeful.
What is important here? | Your ___ (safe) is important. | Your safety is important.`),
 third:read(`Why did Mia miss the train? | She left late. If / she / leave / earlier / she / catch / it | If she had left earlier, she would have caught it. ~ She would have caught it if she had left earlier.
What would have happened with an umbrella? | If / I / take / an umbrella / I / not get / wet | If I had taken an umbrella, I would not have got wet. ~ If I had taken an umbrella, I would not have gotten wet.
What if Ben had studied? | If / he / study / he / pass / the test | If he had studied, he would have passed the test.
What if they had booked? | If / they / book / earlier / they / get / a table | If they had booked earlier, they would have got a table. ~ If they had booked earlier, they would have gotten a table.`),
 mixed:read(`Why is Ben tired now? | He went to bed late. Imagine the opposite past action and its result now. Start: If he had gone to bed earlier, … Use would not + be + tired now. | If he had gone to bed earlier, he would not be tired now.
Why can't you call Mia now? | I lost her number. Imagine I did not lose her number and can call her now. Start: If I had not lost her number, … Use would + base verb. | If I had not lost her number, I would call her now.
Why didn't Anna take the job? | She does not speak French. Imagine she speaks French now and change the past result. Start: If she spoke French, … Use would have + V3. | If she spoke French, she would have taken the job.
Why are they lost now? | They did not bring a map. Imagine they brought a map and are not lost now. Start: If they had brought a map, … Use would not + be + lost now. | If they had brought a map, they would not be lost now.`),
 wish:read(`What does Mia regret? | She didn't study. Start: She wishes… | She wishes she had studied.
What would you change about your flat? | I / wish / my flat / be / bigger | I wish my flat were bigger. ~ I wish my flat was bigger.
What does Ben regret? | He sold his bike. Start: He wishes… | He wishes he had not sold his bike.
What do you want the neighbour to stop doing? | I / wish / he / stop / shouting. Use would. | I wish he would stop shouting.`),
 passiveall:read(`What has happened to the bridge? | It / repair / recently. Use Present Perfect Passive. | It has been repaired recently.
What was happening to the road? | It / repair / when we arrived. Use Past Continuous Passive. | It was being repaired when we arrived.
When must the form be sent? | It / must / send / by Friday | It must be sent by Friday.
What will happen to the tickets? | They / send / by email. Use Future Passive. | They will be sent by email.`),
 reportedall:read(`What did Mia ask you yesterday? | “Where do you live?” Start: Mia asked me where… | Mia asked me where I lived.
What did Ben ask you last week? | “Have you finished?” Start: Ben asked me if… | Ben asked me if I had finished. ~ Ben asked me whether I had finished.
What did Anna tell you to do? | “Close the door.” Start: Anna told me… | Anna told me to close the door.
What did Dad warn you not to do? | “Don't touch it.” Start: Dad warned me… | Dad warned me not to touch it.`),
 pastdeduction:read(`What do you conclude from the wet ground? | It / must / rain / last night | It must have rained last night.
Why hasn't Ben answered? | He / might / forget / his phone | He might have forgotten his phone.
Could Mia have taken the key? | She was abroad. She / cannot / take / it | She cannot have taken it. ~ She could not have taken it.
What should you have done? | I / should / leave / earlier | I should have left earlier.`),
 futureperfect:read(`What will you have done by Friday? | I / finish / the report / by Friday. Use Future Perfect. | I will have finished the report by Friday.
What will Ben be doing at eight tomorrow? | He / fly / to Rome. Use Future Continuous. | He will be flying to Rome.
Will they have arrived by noon? | Yes / they | Yes, they will.
What will you be doing this time tomorrow? | I / sit / on the beach. Use Future Continuous. | I will be sitting on the beach.`),
 causative:read(`What did Mia do about her hair? | She / have / her hair / cut / yesterday | She had her hair cut yesterday.
What will Ben do about his car? | He / get / his car / repair / tomorrow | He will get his car repaired tomorrow.
Why is your bike at the shop? | I / have / my bike / fix. Use Present Continuous. | I am having my bike fixed.
What have they done about the windows? | They / have / the windows / clean. Use Present Perfect. | They have had the windows cleaned.`),
 comparisonadvanced:read(`How does the second book compare? | It / far / interesting / the first | It is far more interesting than the first.
How does practice affect confidence? | The more / you practise / the more / confident / you become | The more you practise, the more confident you become.
Are the two routes equally safe? | This route / not nearly / as safe as / that one | This route is not nearly as safe as that one.
How expensive was the meal? | It / twice / as expensive as / we expected | It was twice as expensive as we expected.`),
 collocations:read(`What must we do about the problem? | We / need / make / a decision | We need to make a decision.
What does Mia do after dinner? | She / do / the washing-up | She does the washing-up.
What should Ben do now? | He / should / take / a break | He should take a break.
What did you promise to do? | I / promise / do / my best | I promised to do my best.`),
 affixes:read(`How did the service disappoint you? | The service was ___ (satisfactory). Use a negative prefix. | The service was unsatisfactory.
How did Mia react? | She reacted ___ (expect). Use an adverb meaning not as expected. | She reacted unexpectedly.
What has changed about the town? | The town has been ___ (develop). Add a prefix meaning again. | The town has been redeveloped.
How does Ben approach the task? | His approach is very ___ (create). | His approach is very creative.`),
 inversion:read(`How can you emphasise that you had never seen it? | Start with Never: I had never seen such a view. | Never had I seen such a view.
How can you emphasise the ban? | Start: Under no circumstances / you / open / this door. Use must. | Under no circumstances must you open this door.
How can you emphasise the timing? | No sooner / we / arrive / than / it / start / to rain | No sooner had we arrived than it started to rain.
How can you introduce this condition formally? | If you need help, call me. Start with Should. | Should you need help, call me.`),
 cleft:read(`How can you emphasise Mia? | Mia broke the vase. Start: It was Mia… | It was Mia who broke the vase. ~ It was Mia that broke the vase.
How can you emphasise your need? | I need a holiday. Start: What I need… | What I need is a holiday.
How can you emphasise yesterday? | We met yesterday. Start: It was yesterday… | It was yesterday that we met.
How can you emphasise the action? | She called the police. Start: What she did… | What she did was call the police. ~ What she did was to call the police.`),
 subjunctive:read(`How can you say we should leave now? | It / time / we / leave | It is time we left.
What would you prefer Ben to do? | I / would rather / Ben / stay / here | I would rather Ben stayed here.
What did the doctor recommend? | The doctor / recommend / that / he / rest | The doctor recommended that he rest. ~ The doctor recommended that he should rest.
What did Mia insist on? | She / insist / that / he / be / on time | She insisted that he be on time. ~ She insisted that he should be on time.`),
 participles:read(`How can you shorten the reason? | Because she felt tired, she went home. Start with Feeling. | Feeling tired, she went home.
How can you show the earlier action? | After he had finished work, he left. Start with Having. | Having finished work, he left.
Which person do you mean? | The man who is standing by the door is Ben. Reduce who is standing. | The man standing by the door is Ben.
How can you shorten this passive clause? | The letter, which was written in French, confused me. Start: Written in French… | Written in French, the letter confused me.`),
 perfectgerund:read(`What did Mia deny? | She / deny / take / the money. Use a perfect gerund. | She denied having taken the money.
What does Ben seem to have done? | He / seem / forget / the meeting. Use a perfect infinitive. | He seems to have forgotten the meeting.
What is Anna proud of? | She / be proud of / finish / the race. Use a perfect gerund. | She is proud of having finished the race.
What would you have liked to do? | I / would like / meet / her. Use a perfect infinitive. | I would like to have met her.`)
 };
 const topics={kids:['be','pskids','pc','there','pastkids','plural','time','have','possessive'],a1:['be','wordorder','ps','pc','past','there','pronouns','prepositions','have','time','imperatives','count','gerund','questions'],a2:['ps','be','pc','mixpresent','wordorder','past','pastcontinuous','mixpast','modals','used','infinitive','perfect','comparison'],b1:['perfect','perfectcontinuous','pastperfect','conditional','passive','reported','relatives','tags','deduction','infinitive','wordformation'],b2:['third','mixed','wish','passiveall','reportedall','pastdeduction','relatives','infinitive','futureperfect','causative','comparisonadvanced','collocations','affixes'],c1:['inversion','cleft','subjunctive','participles','perfectgerund','reportedall']};
 const tsKeys={be:'be',ps:'ps',pc:'pcn',there:'thr',past:'psp',pastcontinuous:'pasc',modals:'shd',used:'uto',perfect:'pfi',comparison:'cmp',perfectcontinuous:'ppc',pastperfect:'pperf',conditional:'cd1',passive:'pass',reported:'rep',relatives:'rcl',tags:'tag',deduction:'mdd',third:'cd3',mixed:'cdm',wish:'wsp',passiveall:'pasa',pastdeduction:'mdp',futureperfect:'fpf',causative:'cau',comparisonadvanced:'cmx',inversion:'inv',cleft:'cle',subjunctive:'sbj',participles:'ptc'};
 window.PondQuestions={topics,bankFor(level,number){
  const key=topics[level]?.[number-1];if(!key||!bank[key])throw Error('No pond questions for '+level+':'+number);
  const own=bank[key].map(r=>({...r,answers:r.answers.slice()}));
  // Existing checked transformation sets add variety for older learners.
  if(level!=='kids'&&tsKeys[key]&&typeof TS!=='undefined'){
   for(const [sentence,instruction,answer]of (TS[tsKeys[key]]||[]).slice(0,8)){
    if(!answer||!instruction||!sentence)continue;
    const answers=answer.split(/\s+\/\s+/).flatMap(a=>a.includes('(that)')?[a.replace('(that)','that'),a.replace('(that) ','')]:[a]);
    own.push({question:'How would you change this sentence?',cue:sentence+' '+instruction,answers});
   }
  }
  return own;
 }};
})();
