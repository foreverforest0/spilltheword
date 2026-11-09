/* Reviewed, cumulative transformations for every numbered grammar topic.
   Each instruction changes the preceding sentence; examples are checkable models. */
(()=>{
 'use strict';
 const bank={};
 function add(level,number,start,lines){
  const steps=lines.trim().split('\n').map(line=>{const [instruction,answers,hint]=line.split(' | ');if(!instruction||!answers||!hint)throw Error('Incomplete expander '+level+number);return {instruction,answers:answers.split(' ~ '),hint}});
  bank[level+':'+number]={start,steps};
 }
 add('kids',1,'Mia is happy.',`
Add a colour: her bag is blue. Join with and. | Mia is happy and her bag is blue. | Use is in both parts.
Change happy to sad. Keep the bag. | Mia is sad and her bag is blue. | Replace only happy.
Say she is not sad. Keep the bag. | Mia is not sad and her bag is blue. | Put not after is.
Now ask only about Mia: is she sad? Use her name. | Is Mia sad? | Put Is before Mia. Leave out the bag.
Answer no, using she. | No, she is not. | No, she + is not.
`);
 add('kids',2,'I play.',`
Add what: football. | I play football. | Put football after play.
Add when: every day. | I play football every day. | Put every day at the end.
Change I to Tom. | Tom plays football every day. | He / she / it: add -s to play.
Say Tom does not do this. | Tom does not play football every day. | After does not, use play.
Ask if Tom does this. Use a positive question. | Does Tom play football every day? | Does + Tom + play ...?
`);
 add('kids',3,'She is reading.',`
Add what: a book. | She is reading a book. | Put a book after reading.
Add where: at home. | She is reading a book at home. | Put the place after a book.
Add when: now. | She is reading a book at home now. | Put now at the end.
Make it negative. | She is not reading a book at home now. | Put not after is.
Ask if she is doing this. Use a positive question. | Is she reading a book at home now? | Move is before she; leave out not.
`);
 add('kids',4,'There is a cat.',`
Add where: on the bed. | There is a cat on the bed. | Put on the bed at the end.
Change one cat to two cats. | There are two cats on the bed. | Two cats: use are.
Say there are no cats there. Use not any. | There are not any cats on the bed. | There are not any + plural noun.
Ask if there are any cats there. | Are there any cats on the bed? | Are there any ...?
Answer no. | No, there are not. | No, there + are not.
`);
 add('kids',5,'Tom plays.',`
Make it about yesterday: change plays to the past. | Tom played yesterday. | play + -ed.
Add what: football. | Tom played football yesterday. | Put football before yesterday.
Add where: in the park. | Tom played football in the park yesterday. | Place comes before time.
Say Tom did not do this. | Tom did not play football in the park yesterday. | After did not, use play.
Ask if Tom did this. Use a positive question. | Did Tom play football in the park yesterday? | Did + Tom + play ...?
`);
 add('kids',6,'There is a box.',`
Change one box to two. | There are two boxes. | box → boxes; is → are.
Add a description: red. | There are two red boxes. | Put red before boxes.
Add where: on the table. | There are two red boxes on the table. | Add the place at the end.
Replace two red boxes with three blue toys. | There are three blue toys on the table. | toy → toys.
Ask if the three blue toys are on the table. Start Are there. | Are there three blue toys on the table? | Are there + number + plural noun ...?
`);
 add('kids',7,'I get up.',`
Add a time: at seven. | I get up at seven. | Use at before a clock time.
Add o'clock after seven. | I get up at seven o'clock. | seven o'clock.
Change I to Ben. | Ben gets up at seven o'clock. | Add -s to get.
Say Ben does not do this. | Ben does not get up at seven o'clock. | does not + get up.
Ask when Ben gets up. Use What time and leave out the time. | What time does Ben get up? | What time + does + Ben + get up?
`);
 add('kids',8,'Mia has got a bag.',`
Add a colour: red. | Mia has got a red bag. | Put red before bag.
Add size: small. | Mia has got a small red bag. | Put small before red.
Say Mia has not got this bag. | Mia has not got a small red bag. | Put not after has.
Ask if Mia has got it. Use a positive question. | Has Mia got a small red bag? | Has + Mia + got ...?
Answer yes, using she. | Yes, she has. | Yes, she + has.
`);
 add('kids',9,'This is a bag.',`
Say it belongs to Mia: replace a with her. | This is her bag. | her + noun.
Replace her bag with hers. | This is hers. | hers stands alone; leave out bag.
Move it far away: change This to That. | That is hers. | That is for one thing far away.
Now there are two bags far away. Change That and is. | Those are hers. | That → Those; is → are.
Ask if those bags are hers. Keep the pronoun hers. | Are those hers? | Are + those + hers?
`);
 add('a1',1,'Ben is a teacher.',`
Add where: in London. | Ben is a teacher in London. | Add the place at the end.
Add a second fact with and: he is friendly. | Ben is a teacher in London and he is friendly. | Keep is in both clauses.
Make only friendly negative. | Ben is a teacher in London and he is not friendly. | Put not after the second is.
Keep only the job and place. Ask a positive yes/no question about them. | Is Ben a teacher in London? | Is + Ben + a teacher + place?
Answer yes, using he. | Yes, he is. | Repeat the form of be.
`);
 add('a1',2,'Mia reads.',`
Add an object: books. | Mia reads books. | Subject → verb → object.
Add a place: at home. | Mia reads books at home. | Put place after the object.
Add a time: every evening. | Mia reads books at home every evening. | Put time after place.
Add often before the main verb. | Mia often reads books at home every evening. | Subject → frequency → verb.
Ask what Mia reads. Keep place and time, but leave out often and books. | What does Mia read at home every evening? | What + does + subject + base verb ...?
`);
 add('a1',3,'Mia works.',`
Add where: in a cafe. | Mia works in a cafe. ~ Mia works in a café. | Put the place after works.
Add usually before works. | Mia usually works in a cafe. ~ Mia usually works in a café. | Frequency goes before the main verb.
Add when: on Saturdays. | Mia usually works in a cafe on Saturdays. ~ Mia usually works in a café on Saturdays. | Use on + days.
Say she does not work there on Saturdays. Leave out usually. | Mia does not work in a cafe on Saturdays. ~ Mia does not work in a café on Saturdays. | does not + work.
Ask whether she works there on Saturdays. Use her name and a positive question. | Does Mia work in a cafe on Saturdays? ~ Does Mia work in a café on Saturdays? | Does + Mia + work ...?
`);
 add('a1',4,'Ben is cooking.',`
Add what: dinner. | Ben is cooking dinner. | verb-ing + object.
Add where: in the kitchen. | Ben is cooking dinner in the kitchen. | Put the place after dinner.
Add when: right now. | Ben is cooking dinner in the kitchen right now. | Add right now at the end.
Make the whole sentence negative. | Ben is not cooking dinner in the kitchen right now. | is not + cooking.
Ask what Ben is cooking. Keep place and time, but leave out dinner and not. | What is Ben cooking in the kitchen right now? | What + is + Ben + cooking ...?
`);
 add('a1',5,'Mia visited a museum.',`
Add when: yesterday. | Mia visited a museum yesterday. | Add a finished past time.
Add who with: with Ben, before yesterday. | Mia visited a museum with Ben yesterday. | Keep visited in the past.
Make it negative. | Mia did not visit a museum with Ben yesterday. | did not + base verb.
Ask a positive yes/no question. | Did Mia visit a museum with Ben yesterday? | Did + subject + visit ...?
Answer yes, using she. | Yes, she did. | Use did in the short answer.
`);
 add('a1',6,'There is a chair.',`
Add where: next to the window. | There is a chair next to the window. | There is + singular noun.
Change a chair to two chairs. | There are two chairs next to the window. | Use are with a plural noun.
Say there are no chairs there. Use not any. | There are not any chairs next to the window. | not any + plural noun.
Ask if there are any chairs there. | Are there any chairs next to the window? | Are there any ...?
Answer no. | No, there are not. | Keep there in the short answer.
`);
 add('a1',7,'Mia calls Ben.',`
Replace Mia with a subject pronoun. | She calls Ben. | Mia → she.
Replace Ben with an object pronoun. | She calls him. | Ben → him after the verb.
Add when: every evening. | She calls him every evening. | Keep both pronouns.
Make it negative. | She does not call him every evening. | does not + call; keep him.
Ask a positive yes/no question. | Does she call him every evening? | Does + she + call + him ...?
`);
 add('a1',8,'The bag is here.',`
Replace here with under the chair. | The bag is under the chair. | under + the chair.
Move the bag: replace under the chair with next to the desk. | The bag is next to the desk. | Use next to as one place phrase.
Move it between the desk and the bed. Replace the old place. | The bag is between the desk and the bed. | between A and B.
Say it is not in that place. | The bag is not between the desk and the bed. | Put not after is.
Ask where the bag is. Leave out the place. | Where is the bag? | Where + is + the bag?
`);
 add('a1',9,'Ben has got a camera.',`
Add a description: new. | Ben has got a new camera. | Put new before camera.
Add another thing: and two tickets. | Ben has got a new camera and two tickets. | Keep has got for both objects.
Change Ben to I. | I have got a new camera and two tickets. | I + have got.
Make it negative. Use any with tickets and keep a new camera. | I have not got a new camera or any tickets. | not ... a camera or any tickets.
Ask a positive question about me. Change I to you and use two tickets. | Have you got a new camera and two tickets? | Have + you + got ...?
`);
 add('a1',10,'The lesson starts.',`
Add a clock time: at nine. | The lesson starts at nine. | at + clock time.
Add a day: on Monday. | The lesson starts at nine on Monday. | on + day.
Add a month: in June. | The lesson starts at nine on Monday in June. | in + month.
Ask what time the lesson starts. Keep the day and month. | What time does the lesson start on Monday in June? | Remove at nine; does + start.
Answer with only the clock time. Start It starts. | It starts at nine. | Keep at before nine.
`);
 add('a1',11,'Open the door.',`
Make the instruction polite: add Please at the beginning. | Please open the door. | Please + base verb.
Add how: slowly. | Please open the door slowly. | Put slowly at the end.
Make the instruction negative. Keep Please and slowly. | Please do not open the door slowly. | Please do not + base verb.
Replace slowly with before nine. Keep it negative. | Please do not open the door before nine. | before + time.
Give permission after nine instead. Start Please open and use after nine. | Please open the door after nine. | Remove do not; before → after.
`);
 add('a1',12,'There are apples.',`
Add a small number: use a few apples. | There are a few apples. | a few + countable plural.
Add where: in the bag. | There are a few apples in the bag. | Put the place last.
Say there are no apples there. Use not any. | There are not any apples in the bag. | not any + plural noun.
Change apples to water. Keep not any and the place. | There is not any water in the bag. | Water is uncountable: use is.
Ask how much water is in the bag. | How much water is there in the bag? | How much + uncountable noun + is there ...?
`);
 add('a1',13,'I like swimming.',`
Add where: in the sea. | I like swimming in the sea. | Like + verb-ing.
Add when: in summer. | I like swimming in the sea in summer. | Keep swimming; add time last.
Change I to Mia. | Mia likes swimming in the sea in summer. | likes + swimming.
Make it negative. | Mia does not like swimming in the sea in summer. | does not like + verb-ing.
Ask a positive yes/no question. | Does Mia like swimming in the sea in summer? | Does + Mia + like + swimming ...?
`);
 add('a1',14,'Ben buys books.',`
Add where: at the market. | Ben buys books at the market. | Place comes after the object.
Add when: on Sundays. | Ben buys books at the market on Sundays. | Add the day at the end.
Ask what Ben buys. Keep place and day. | What does Ben buy at the market on Sundays? | Remove books; use does + buy.
Now ask where Ben buys books. Keep the day. | Where does Ben buy books on Sundays? | Replace What with Where; restore books.
Now ask when Ben buys books at the market. | When does Ben buy books at the market? | Remove on Sundays; restore the place.
`);
 add('a2',1,'Ben walks to work.',`
Add a frequency adverb: usually. | Ben usually walks to work. | Put usually before walks.
Add when: on weekdays. | Ben usually walks to work on weekdays. | Put the time phrase at the end.
Make it negative. Keep usually and on weekdays. | Ben does not usually walk to work on weekdays. | does not + usually + walk.
Ask how Ben usually gets to work. Leave out on weekdays and use a positive question. | How does Ben usually get to work? | How + does + Ben + usually + get to work?
Answer the question with He and on foot. Keep usually. | He usually gets to work on foot. | He + usually + gets ... on foot.
`);
 add('a2',2,'Mia is tired.',`
Add a degree word: very. | Mia is very tired. | Put very before tired.
Add another fact with and: she is busy. | Mia is very tired and she is busy. | Keep is in both clauses.
Change both clauses to yesterday. Put Yesterday at the beginning. | Yesterday, Mia was very tired and she was busy. | is → was in both clauses.
Make only very tired negative. | Yesterday, Mia was not very tired and she was busy. | Put not after the first was.
Ask whether Mia was very tired yesterday. Leave out the busy clause and use a positive question. | Was Mia very tired yesterday? | Was + Mia ... yesterday?
`);
 add('a2',3,'Mia is working.',`
Add a temporary period: this week. | Mia is working this week. | Add this week at the end.
Add where: from home, before the time phrase. | Mia is working from home this week. | A temporary arrangement uses is working.
Make it negative. | Mia is not working from home this week. | is not + working.
Ask where Mia is working this week. Remove from home and not. | Where is Mia working this week? | Where + is + Mia + working ...?
Now make a positive statement about an arrangement tomorrow: Mia / meet / Ben / at six. | Mia is meeting Ben at six tomorrow. ~ Mia is meeting Ben tomorrow at six. | Present Continuous can describe a future arrangement.
`);
 add('a2',4,'Ben works in a cafe.',`
Add usually before works. | Ben usually works in a cafe. ~ Ben usually works in a café. | Present Simple describes a routine.
Add a contrast: but today he / work / at home. | Ben usually works in a cafe, but today he is working at home. ~ Ben usually works in a café, but today he is working at home. | Routine: works. Today: is working.
Make only the usual routine negative. | Ben does not usually work in a cafe, but today he is working at home. ~ Ben does not usually work in a café, but today he is working at home. | does not usually + work.
Keep only today. Ask where Ben is working today. | Where is Ben working today? | Use is ... working for the current situation.
Ask where Ben usually works instead. | Where does Ben usually work? | For a routine, use does + work.
`);
 add('a2',5,'She reads books.',`
Add often before reads. | She often reads books. | Frequency goes before the main verb.
Add quietly after books. | She often reads books quietly. | The manner adverb follows the object.
Add where: at home. | She often reads books quietly at home. | Manner → place.
Add when: in the evening. | She often reads books quietly at home in the evening. | Manner → place → time.
Ask what she often reads. Keep manner, place and time. | What does she often read quietly at home in the evening? | What + does + subject + often + base verb ...?
`);
 add('a2',6,'Ben bought a book.',`
Add when: last Saturday. | Ben bought a book last Saturday. | Use Past Simple with a finished past time.
Add where: at the market, before the time phrase. | Ben bought a book at the market last Saturday. | Object → place → time.
Make it negative. | Ben did not buy a book at the market last Saturday. | did not + buy, not bought.
Ask what Ben bought. Keep place and time, and use a positive question. | What did Ben buy at the market last Saturday? | What + did + Ben + buy ...?
Answer with He and two books instead of a book. Keep place and time. | He bought two books at the market last Saturday. | Restore the irregular past form bought.
`);
 add('a2',7,'Mia was reading.',`
Add what: a book. | Mia was reading a book. | was + reading + object.
Add a past moment: at eight last night. | Mia was reading a book at eight last night. | The action was in progress at that time.
Add an interruption: when Ben called. | Mia was reading a book at eight last night when Ben called. | Ongoing action + when + Past Simple.
Make only reading negative. | Mia was not reading a book at eight last night when Ben called. | was not + reading.
Ask what Mia was doing when Ben called. Leave out the book and clock time. | What was Mia doing when Ben called? | What + was + Mia + doing ...?
`);
 add('a2',8,'Ben walked home.',`
Make the walk an action in progress. | Ben was walking home. | was + verb-ing.
Add an interruption: when it started to rain. | Ben was walking home when it started to rain. | Past Continuous + when + Past Simple.
Put the interruption first. Start When. | When it started to rain, Ben was walking home. | Keep both verb forms.
Replace the first clause with While Ben was walking home. Put the rain in the second clause. | While Ben was walking home, it started to rain. | While introduces the action in progress.
Make only the rain negative. | While Ben was walking home, it did not start to rain. | did not + start; keep was walking.
`);
 add('a2',9,'Mia can swim.',`
Add how: very well. | Mia can swim very well. | Modal + base verb.
Say she cannot do this. | Mia cannot swim very well. | cannot + swim.
Ask whether she can do this. Use a positive question. | Can Mia swim very well? | Can + Mia + swim ...?
Now give Mia advice to practise every day. Start Mia should. | Mia should practise every day. ~ Mia should practice every day. | should + base verb.
Change the advice into an obligation. Start Mia has to. | Mia has to practise every day. ~ Mia has to practice every day. | has to + base verb.
`);
 add('a2',10,'Ben plays football.',`
Make it a past habit that is no longer true. Use used to. | Ben used to play football. | used to + base verb.
Add frequency: every weekend. | Ben used to play football every weekend. | Add the frequency at the end.
Add contrast: but now he plays tennis. | Ben used to play football every weekend, but now he plays tennis. | Past habit with used to; current habit with plays.
Make only the past habit negative. | Ben did not use to play football every weekend, but now he plays tennis. | After did not, use use to.
Ask about the past habit only. Use a positive question and keep every weekend. | Did Ben use to play football every weekend? | Did + Ben + use to + play ...?
`);
 add('a2',11,'Mia wants to travel.',`
Add where: to Italy. | Mia wants to travel to Italy. | want + to + base verb.
Add a purpose: to learn Italian. | Mia wants to travel to Italy to learn Italian. | to + base verb can express purpose.
Replace wants to travel with enjoys travelling. Keep place and purpose. | Mia enjoys travelling to Italy to learn Italian. ~ Mia enjoys traveling to Italy to learn Italian. | enjoy + verb-ing.
Make it negative. | Mia does not enjoy travelling to Italy to learn Italian. ~ Mia does not enjoy traveling to Italy to learn Italian. | does not enjoy + verb-ing.
Replace the whole sentence with a positive decision yesterday. Use Mia / decide / travel to Italy / learn Italian. | Mia decided to travel to Italy to learn Italian yesterday. ~ Yesterday, Mia decided to travel to Italy to learn Italian. | decided + to travel; purpose: to learn.
`);
 add('a2',12,'Mia has visited Rome.',`
Add a number of times: twice. | Mia has visited Rome twice. | Add twice at the end; do not add a finished past time.
Ask if she has ever visited Rome. Use Mia; leave out twice. | Has Mia ever visited Rome? | Has + Mia + ever + V3 ...?
Answer no with a full sentence. Use She and never. | She has never visited Rome. | has never + V3; no extra not.
Change the subject to They. | They have never visited Rome. | They + have.
Ask whether they have visited Rome yet. Use a positive question and remove never. | Have they visited Rome yet? | Have + they + V3 ... yet?
`);
 add('a2',13,'This bag is big.',`
Compare it with my bag. Use bigger than. | This bag is bigger than my bag. | big → bigger.
Add a stronger difference: much. | This bag is much bigger than my bag. | much + comparative.
Replace the comparison with the biggest in the shop. | This bag is the biggest in the shop. | the + superlative.
Make it negative. | This bag is not the biggest in the shop. | Put not after is.
Compare them again: say this bag and my bag are equally big. Use as ... as. | This bag is as big as my bag. | as + adjective + as.
`);
 add('b1',1,'Mia has finished the report.',`
Add just in the correct position. | Mia has just finished the report. | Put just between has and V3.
Add a result now: so she can go home. | Mia has just finished the report, so she can go home. | Present Perfect connects the action to a result now.
Now say the report is unfinished. Use not and yet; remove just and the result clause. | Mia has not finished the report yet. | has not + V3 ... yet.
Ask whether she has finished it yet. Use her name and a positive question. | Has Mia finished the report yet? | Has + Mia + V3 ... yet?
Make a positive statement about a finished past time: Mia / finish the report / yesterday. | Mia finished the report yesterday. | A finished past time needs Past Simple, not Present Perfect.
`);
 add('b1',2,'Mia has been studying.',`
Add what: English. | Mia has been studying English. | has been + verb-ing.
Add how long: for two hours. | Mia has been studying English for two hours. | for + duration.
Replace for two hours with since nine o'clock. | Mia has been studying English since nine o'clock. | since + starting point.
Make it negative. | Mia has not been studying English since nine o'clock. | has not been + verb-ing.
Ask how long Mia has been studying English. Remove the starting time and not. | How long has Mia been studying English? | How long + has + Mia + been + verb-ing?
`);
 add('b1',3,'Ben had left.',`
Add a later past event: before Mia arrived. | Ben had left before Mia arrived. | Earlier action: had + V3; later action: Past Simple.
Add already in the correct position. | Ben had already left before Mia arrived. | Put already after had.
Replace before Mia arrived with by the time Mia arrived. Put the time clause first. | By the time Mia arrived, Ben had already left. | By the time + Past Simple; had already + V3.
Say Ben had not left then. Remove already. | By the time Mia arrived, Ben had not left. | had not + V3.
Ask if Ben had left before Mia arrived. Use a positive question. | Had Ben left before Mia arrived? | Had + Ben + V3 + before ...?
`);
 add('b1',4,'I will walk to work.',`
Add a real future condition at the beginning: if it does not rain. | If it does not rain, I will walk to work. | First conditional: if + Present Simple, will + base verb.
Make only the result negative. | If it does not rain, I will not walk to work. | Keep the if-clause; will not + base verb.
Restore a positive result and make the situation imaginary. Use If it did not rain and I would walk to work. | If it did not rain, I would walk to work. | Second conditional: if + Past Simple, would + base verb.
Replace the condition with having a car: If I had a car. Change walk to drive. | If I had a car, I would drive to work. | If + Past Simple; would drive.
Ask about that imaginary situation. Start What would you do and keep if you had a car. Leave out the trip to work. | What would you do if you had a car? | What + would + you + do + if + Past Simple?
`);
 add('b1',5,'They make the bags.',`
Add where: in Italy. | They make the bags in Italy. | Add the place after the object.
Make the bags the subject. Use Present Simple Passive and leave out they. | The bags are made in Italy. | are + past participle.
Make it about last year instead. | The bags were made in Italy last year. | were + V3 + finished past time.
Make it negative. | The bags were not made in Italy last year. | were not + made.
Ask where the bags were made last year. Use a positive question. | Where were the bags made last year? | Where + were + subject + V3 ...?
`);
 add('b1',6,'Mia said, "I am tired."',`
Report Mia's words. Use that. | Mia said that she was tired. | I → she; am → was.
Report an extra fact: Mia said, "I am tired because I work hard." Keep that. | Mia said that she was tired because she worked hard. | Backshift both present verbs.
Change said to told and add Ben as the listener. | Mia told Ben that she was tired because she worked hard. | tell + person; say does not take a person directly.
Now report these different words to Ben: "I am not tired." | Mia told Ben that she was not tired. | Keep told Ben that; report the negative.
Report Mia's next message to Ben: "I will rest tomorrow." Report it the next day, using the next day. | Mia told Ben that she would rest the next day. | will → would; tomorrow → the next day.
`);
 add('b1',7,'I know a woman.',`
Identify her: she teaches English. Use who. | I know a woman who teaches English. | who + verb describes a person.
Add where she teaches: at our school. | I know a woman who teaches English at our school. | Keep the relative clause attached to woman.
Describe her bag instead: her bag is red. Use whose; replace the teaching clause. | I know a woman whose bag is red. | whose + noun expresses possession.
Now identify the woman by her home: she lives next to the park. Use who. | I know a woman who lives next to the park. | Replace the old relative clause.
Make only the relative clause negative. | I know a woman who does not live next to the park. | who + does not + base verb.
`);
 add('b1',8,'Ben works here.',`
Add a negative question tag. | Ben works here, does he not? ~ Ben works here, doesn't he? | Positive Present Simple → doesn't + pronoun.
Add usually before works. Keep the tag. | Ben usually works here, does he not? ~ Ben usually works here, doesn't he? | The tag still uses does.
Make the main clause negative and change the tag. Leave out usually. | Ben does not work here, does he? | Negative clause → positive tag.
Make the main clause a positive past statement about yesterday. Change the tag too. | Ben worked here yesterday, did he not? ~ Ben worked here yesterday, didn't he? | Past Simple → didn't he?
Now use a positive Present Perfect statement with before. Remove yesterday and update the tag. | Ben has worked here before, has he not? ~ Ben has worked here before, hasn't he? | Present Perfect → hasn't he?
`);
 add('b1',9,'Ben is at home.',`
Make this a strong deduction. Use must. | Ben must be at home. | must + be for a strong positive deduction.
Add the evidence: because his car is outside. | Ben must be at home because his car is outside. | Keep the evidence in Present Simple.
Now the evidence is uncertain. Use might; leave out the evidence clause. | Ben might be at home. | might + be means it is possible.
Say it is impossible for Ben to be at home. Use cannot. | Ben cannot be at home. | cannot + be for a strong negative deduction.
Add evidence for the impossibility: because he is in Rome. | Ben cannot be at home because he is in Rome. | Give evidence that supports the negative deduction.
`);
 add('b1',10,'Mia enjoys reading.',`
Add what: detective stories. | Mia enjoys reading detective stories. | enjoy + verb-ing + object.
Add when: on the train. | Mia enjoys reading detective stories on the train. | Keep the gerund after enjoy.
Replace enjoys reading with wants to read. Keep the details. | Mia wants to read detective stories on the train. | want + to + base verb.
Add a purpose: to relax. | Mia wants to read detective stories on the train to relax. | to relax answers Why?
Now say she is interested in this activity. Start Mia is interested in; leave out wants and to relax. | Mia is interested in reading detective stories on the train. | A preposition is followed by verb-ing.
`);
 add('b1',11,'Mia checks the report.',`
Add how she checks it. Form an adverb from careful. | Mia checks the report carefully. | careful + -ly.
Use an adjective from care instead. Start Mia is ... when she checks the report. | Mia is careful when she checks the report. | care → careful after is.
Use the noun care instead. Start Mia checks the report with. | Mia checks the report with care. | with + noun.
Describe the opposite behaviour. Start Mia is and end when she checks the report. Use an adjective from care. | Mia is careless when she checks the report. | care + -less gives the opposite of careful.
Turn careless into an adverb. Start Mia checks the report. | Mia checks the report carelessly. | careless + -ly.
`);
 add('b2',1,'Ben missed the train.',`
Add the real result: so he arrived late. | Ben missed the train, so he arrived late. | Both facts are completed past events.
Imagine the opposite past. Start If Ben had not missed the train; use would not have for the result. | If Ben had not missed the train, he would not have arrived late. | If + had not + V3, would not have + V3.
Replace would not have arrived late with would have arrived on time. | If Ben had not missed the train, he would have arrived on time. | Keep the unreal past condition.
Add the consequence: and he would have seen Mia. | If Ben had not missed the train, he would have arrived on time and he would have seen Mia. | Both unreal results use would have + V3.
Put the two result clauses first and the if-clause last. | Ben would have arrived on time and he would have seen Mia if he had not missed the train. | Repeat Ben in the first clause; use he in the condition.
`);
 add('b2',2,'Ben did not study medicine.',`
Add a result that is true now: so he is not a doctor now. | Ben did not study medicine, so he is not a doctor now. | Past cause → present result.
Imagine the opposite. Start If Ben had studied medicine; use would be a doctor now. | If Ben had studied medicine, he would be a doctor now. | Past condition: had + V3. Present result: would + base verb.
Add a second present result: and he would work in a hospital. | If Ben had studied medicine, he would be a doctor now and he would work in a hospital. | Keep would + base verb for both present results.
Keep only the first result and put it first. | Ben would be a doctor now if he had studied medicine. | A past condition can come after its present result.
Change to a different mixed pattern: Ben is afraid of flying, so he did not travel yesterday. Start If Ben were not afraid of flying. | If Ben were not afraid of flying, he would have travelled yesterday. ~ If Ben were not afraid of flying, he would have traveled yesterday. | Present condition → past result: if + Past Simple, would have + V3.
`);
 add('b2',3,'I do not have a car.',`
Express a wish about now. Start I wish. | I wish I had a car. | A present wish uses Past Simple.
Add the reason for the wish: so I could drive to work. | I wish I had a car so I could drive to work. | could expresses the imagined ability.
Now regret a past event: I did not buy the car. Use I wish and leave out the reason. | I wish I had bought the car. | Past regret: wish + had + V3.
Make that past regret stronger. Replace I wish with If only. | If only I had bought the car. | Keep Past Perfect after If only.
Now complain about an ongoing problem: the neighbour keeps blocking my drive. Use I wish and would stop. | I wish the neighbour would stop blocking my drive. ~ I wish the neighbor would stop blocking my drive. | wish + another person + would + base verb; stop + verb-ing.
`);
 add('b2',4,'They are repairing the bridge.',`
Make the bridge the subject. Leave out the agent. | The bridge is being repaired. | Present Continuous Passive: is being + V3.
Say the repair is now complete. Use Present Perfect Passive and add in three months to show the time taken. | The bridge has been repaired in three months. | A completed repair uses has been + V3; in describes time taken.
Add a deadline and move the completed repair into the future: by Friday. Remove in three months. | The bridge will have been repaired by Friday. | Future Perfect Passive: will have been + V3.
Change this into an obligation to finish before Friday. Use must, not Future Perfect. | The bridge must be repaired before Friday. | Modal Passive: must be + V3.
Make that obligation negative: say repairing it before Friday is forbidden. | The bridge must not be repaired before Friday. | must not be + V3 means prohibition.
`);
 add('b2',5,'Mia asked Ben, "Where do you live?"',`
Report the question. | Mia asked Ben where he lived. | Reported questions use statement word order.
Change the original question to "Do you live in London?" and report it using if. | Mia asked Ben if he lived in London. | Yes/no reported question: if + subject + verb.
Change the original question to "Have you finished the report?" Report it using whether. | Mia asked Ben whether he had finished the report. | Present Perfect backshifts to Past Perfect.
Now report a command: "Finish the report." Keep Mia and Ben. | Mia told Ben to finish the report. | tell + person + to + base verb.
Make the original command negative: "Do not finish the report." Report it. | Mia told Ben not to finish the report. | tell + person + not to + base verb.
`);
 add('b2',6,'Ben missed the train.',`
Make it a strong deduction about the past. Use must have. | Ben must have missed the train. | must have + V3.
Add the evidence: because he arrived late. | Ben must have missed the train because he arrived late. | Keep the evidence in Past Simple.
Make the deduction uncertain. Use might have; leave out the evidence. | Ben might have missed the train. | might have + V3.
Now say missing the train was impossible. Use cannot have. | Ben cannot have missed the train. | cannot have + V3.
Give evidence for that impossibility: because I saw him on it. | Ben cannot have missed the train because I saw him on it. | Use evidence that supports the negative deduction.
`);
 add('b2',7,'Mia is a doctor.',`
Add extra information: she lives next door. Use a non-defining relative clause after Mia. | Mia, who lives next door, is a doctor. | Use commas around extra information about a named person.
Add information about her son instead. Replace the who-clause with whose son studies in Rome. | Mia, whose son studies in Rome, is a doctor. | whose + noun; keep both commas.
Make only the relative clause negative. | Mia, whose son does not study in Rome, is a doctor. | Relative clauses can contain does not + base verb.
Replace that relative clause with a reduced passive clause: Mia was trained in London. | Mia, trained in London, is a doctor. | Remove who was; keep the past participle.
Restore a full relative clause. Use who and Past Simple Passive. | Mia, who was trained in London, is a doctor. | Restore who was before the past participle.
`);
 add('b2',8,'Ben stopped smoking.',`
Add when: last year. | Ben stopped smoking last year. | stop + verb-ing means ending an activity.
Change the meaning: during a walk, Ben paused in order to smoke. Use stopped to smoke; replace last year with during his walk. | Ben stopped to smoke during his walk. | stop + to + base verb expresses the reason for stopping.
Say he did not pause to smoke. | Ben did not stop to smoke during his walk. | did not stop + to smoke.
Now say he remembered a task: taking his medicine before the walk. Use remembered to take and before his walk. | Ben remembered to take his medicine before his walk. | remember to do = remember a task and do it.
Change the meaning to a memory of a completed action. Replace to take with taking. | Ben remembered taking his medicine before his walk. | remember doing = have a memory of doing it.
`);
 add('b2',9,'Mia will write the report.',`
Show the action in progress at a future moment: at ten tomorrow. | Mia will be writing the report at ten tomorrow. | Future Continuous: will be + verb-ing.
Ask a positive yes/no question about that future activity. | Will Mia be writing the report at ten tomorrow? | Will + subject + be + verb-ing ...?
Now state that the report will be finished by Friday. Use Future Perfect; remove the clock time. | Mia will have written the report by Friday. | will have + V3 + by a deadline.
Make the completed-by-Friday statement negative. | Mia will not have written the report by Friday. | will not have + V3.
Ask what Mia will have written by Friday. Use a positive question. | What will Mia have written by Friday? | What + will + subject + have + V3 ...?
`);
 add('b2',10,'A mechanic repaired Mia\'s car.',`
Start with Mia and use had ... repaired to show someone did the work for her. | Mia had her car repaired. | have + object + V3.
Add when: last week. | Mia had her car repaired last week. | had here is Past Simple, not Past Perfect.
Make it a future arrangement: use is having and tomorrow instead. | Mia is having her car repaired tomorrow. | is having + object + V3.
Say that arrangement is not happening. | Mia is not having her car repaired tomorrow. | Put not after is.
Ask a positive question about the arrangement. Replace having with getting. | Is Mia getting her car repaired tomorrow? | get + object + V3 can also express a service.
`);
 add('b2',11,'This room is bigger than that room.',`
Add a large difference: far. | This room is far bigger than that room. | far + comparative.
Express the opposite comparison. Start That room and use not nearly as big as. | That room is not nearly as big as this room. | not nearly as + adjective + as.
Now say this room is exactly double the size. Start This room and use twice as big as. | This room is twice as big as that room. | twice as + adjective + as.
Compare changes over time: this room becomes brighter when it becomes bigger. Use The bigger ... the brighter. | The bigger this room gets, the brighter it becomes. | the + comparative ..., the + comparative ...
Replace brighter with more expensive and keep the paired comparison. | The bigger this room gets, the more expensive it becomes. | Use more with a longer adjective.
`);
 add('b2',12,'Mia makes a decision.',`
Add when: every morning. | Mia makes a decision every morning. | make a decision.
Change to yesterday. | Mia made a decision yesterday. | make → made.
Add a second action: and she took a break. | Mia made a decision yesterday and she took a break. | take a break, not make a break.
Add what she did next: after she did her homework. Put this clause at the beginning. | After she did her homework, Mia made a decision yesterday and she took a break. | do homework; make a decision; take a break.
Replace the time clause with Having done her homework. Leave out yesterday and the repeated she after and. | Having done her homework, Mia made a decision and took a break. | Having done shows the homework happened first.
`);
 add('b2',13,'It is possible to finish the report.',`
Make possible negative using a prefix. | It is impossible to finish the report. | possible → impossible.
Add a reason: because the instructions are unclear. | It is impossible to finish the report because the instructions are unclear. | clear → unclear.
Express the same idea using the noun possibility. Start There is no. | There is no possibility of finishing the report because the instructions are unclear. | possibility of + verb-ing.
Make it positive. Use a possibility and clear instead. | There is a possibility of finishing the report because the instructions are clear. | Remove no and the negative prefix un-.
Use an adverb from success instead. Start We can finish the report ... because the instructions are clear. | We can finish the report successfully because the instructions are clear. | The verb finish needs an adverb: successfully.
`);
 add('c1',1,'Mia has seen such a view.',`
Make the statement negative using never. | Mia has never seen such a view. | never goes between has and V3.
Emphasise never by putting it first. | Never has Mia seen such a view. | Negative fronting triggers auxiliary–subject inversion.
Replace such a view with such a beautiful view before. | Never has Mia seen such a beautiful view before. | Keep inversion after Never.
Now use this past sequence: Mia arrived, then the rain began immediately. Start No sooner and use than. | No sooner had Mia arrived than the rain began. | No sooner + had + subject + V3 + than + Past Simple.
Express the same sequence with Hardly and when. | Hardly had Mia arrived when the rain began. | Hardly ... when, not than.
`);
 add('c1',2,'Mia sent Ben the report yesterday.',`
Emphasise the person who sent it. Start It was Mia who. | It was Mia who sent Ben the report yesterday. | It + be + focus + who-clause.
Emphasise the recipient instead. Start It was Ben whom Mia. | It was Ben whom Mia sent the report to yesterday. | Move the recipient into focus; keep to at the end of its phrase.
Emphasise the time instead. Start It was yesterday that. | It was yesterday that Mia sent Ben the report. | Focus the time; keep ordinary clause word order after that.
Emphasise the action using a pseudo-cleft. Start What Mia did yesterday was. | What Mia did yesterday was send Ben the report. | After What ... did was, a base verb is possible.
Add exclusivity. Replace What with All and keep the rest. | All Mia did yesterday was send Ben the report. | All ... did was focuses the only action.
`);
 add('c1',3,'Ben should leave.',`
Express that it is time for this to happen. Start It is time. | It is time Ben left. | It is time + subject + Past Simple.
Make it more urgent. Use high time. | It is high time Ben left. | Keep Past Simple after high time.
Now express my preference instead: I would rather Ben left. | I would rather Ben left. | would rather + another subject + Past Simple.
Say I prefer him not to leave. | I would rather Ben did not leave. | Negative preference: did not + base verb.
Now make a formal recommendation that he remain here instead. Start I recommend that Ben. | I recommend that Ben remain here. ~ I recommend that Ben should remain here. | Formal mandative subjunctive: that + subject + base verb.
`);
 add('c1',4,'Mia finished the report.',`
Add the later action: and then she went home. | Mia finished the report and then she went home. | The report was finished before she went home.
Replace the first clause with a perfect participle clause. | Having finished the report, Mia went home. | Having + V3 marks an earlier completed action with the same subject.
Add a reason for leaving: because she felt tired. | Having finished the report, Mia went home because she felt tired. | Keep the main-clause subject as Mia.
Reduce the reason clause too. Use feeling tired after and, following Having finished the report. | Having finished the report and feeling tired, Mia went home. | Both participle clauses refer to Mia.
Express the first action as incomplete instead. Use Not having finished the report and change went home to stayed at work. Keep feeling tired. | Not having finished the report and feeling tired, Mia stayed at work. | Not having + V3 expresses a negative earlier event.
`);
 add('c1',5,'Mia claims that she saw Ben.',`
Replace that she saw with a perfect infinitive. | Mia claims to have seen Ben. | to have + V3 refers to an earlier action.
Add when she saw him: yesterday. | Mia claims to have seen Ben yesterday. | The perfect infinitive still refers to the earlier sighting.
Make the claimed sighting negative, keeping claims positive. | Mia claims not to have seen Ben yesterday. | not + to have + V3.
Express an admission instead: Mia admits that she did not see Ben yesterday. Use a perfect gerund. | Mia admits not having seen Ben yesterday. | admit + not having + V3.
Now make the admission positive and add a place: at the station. Put it before yesterday. | Mia admits having seen Ben at the station yesterday. | admit + having + V3 + object + place + time.
`);
 add('c1',6,'Mia said, "I have been waiting."',`
Report the statement with that. | Mia said that she had been waiting. | Present Perfect Continuous → Past Perfect Continuous.
Add a duration from her original words: for two hours. | Mia said that she had been waiting for two hours. | Keep for + duration in the reported version.
Add her next words: "I will not wait any longer." Join the reported clauses with and. | Mia said that she had been waiting for two hours and she would not wait any longer. | will not → would not; I → she.
Replace said with told and add Ben as the listener. | Mia told Ben that she had been waiting for two hours and she would not wait any longer. | tell + listener + reported clause.
Now report Mia's question to Ben: "Why did you not call me?" Use asked, and leave out the previous statements. | Mia asked Ben why he had not called her. | Statement word order; did not call → had not called; me → her.
`);
 const substitutions=[
  [],
  [['Mia','Zoe'],['Ben','Leo'],['Tom','Max'],['Rome','Paris'],['London','Oxford'],['the report','the article'],['football','basketball']],
  [['Mia','Eva'],['Ben','Sam'],['Tom','Dan'],['Rome','Milan'],['London','Bristol'],['the report','the document'],['football','volleyball']]
 ];
 function variant(level,number,index=0){
  const source=bank[level+':'+number];if(!source)throw Error('Missing expander sequence '+level+':'+number);
  const replace=text=>(substitutions[index%substitutions.length]||[]).reduce((s,[a,b])=>s.replace(new RegExp('\\b'+a+'\\b','g'),b),text);
  return {start:replace(source.start),steps:source.steps.map(s=>({instruction:replace(s.instruction),hint:replace(s.hint),answers:s.answers.map(replace)}))};
 }
 window.ExpanderCurriculum={bank,variant};
})();
