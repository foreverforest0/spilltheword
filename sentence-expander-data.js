/* Reviewed, cumulative transformations for every numbered grammar topic.
   Each instruction changes the preceding sentence; examples are checkable models. */
(()=>{
 'use strict';
 const bank={};
 function add(level,number,start,lines){
  const steps=lines.trim().split('\n').map(line=>{const [instruction,answers,hint,starter='']=line.split(' | ');if(!instruction||!answers||!hint)throw Error('Incomplete expander '+level+number);return {instruction,answers:answers.split(' ~ '),hint,starter}});
  bank[level+':'+number]={start,steps};
 }
 add('kids',1,'Mia is happy.',`
Bag · blue. Join with and. | Mia is happy and her bag is blue. | Add a second fact about Mia's bag.
Mood swap · sad. Keep the bag. | Mia is sad and her bag is blue. | Change only the feeling.
Reverse the mood statement. | Mia is not sad and her bag is blue. | Make only the first fact negative.
Ask about Mia's mood only. Use her name; ask positively. | Is Mia sad? | The question needs a different word order. | Is
Reply no · use she. | No, she is not. | Keep the reply short. | No
`);
 add('kids',2,'I play.',`
Add a sport · football. | I play football. | The sport is the object.
Add a daily habit · every day. | I play football every day. | Put the time after the activity.
New player · Tom. | Tom plays football every day. | Check the verb when the person changes.
Tom does not do this. | Tom does not play football every day. | The main verb loses its extra ending.
Ask about Tom's habit. | Does Tom play football every day? | Keep all the activity details. | Does
`);
 add('kids',3,'She is reading.',`
Add an object · book. | She is reading a book. | A singular object needs an article.
Place · home. | She is reading a book at home. | Add the right place word yourself.
Time · now. | She is reading a book at home now. | Keep the place and object.
Reverse the statement. | She is not reading a book at home now. | The negative belongs beside the helping verb.
Ask if it is happening. | Is she reading a book at home now? | Remove the negative and change word order. | Is
`);
 add('kids',4,'There is a cat.',`
Place · bed, on top. | There is a cat on the bed. | Choose the place phrase yourself.
One cat becomes two. | There are two cats on the bed. | More than one changes the noun and verb.
No cats remain · use any. | There are not any cats on the bed. | Keep the bed in the sentence.
Ask whether any cats are there. | Are there any cats on the bed? | Remove the negative. | Are
Reply no. | No, there are not. | Keep the same helping verb. | No
`);
 add('kids',5,'Tom plays.',`
Time travel · yesterday. | Tom played yesterday. | Change the action to the past.
Add a sport · football. | Tom played football yesterday. | Keep the past time.
Place · park. | Tom played football in the park yesterday. | Put the place before the time.
It did not happen. | Tom did not play football in the park yesterday. | The negative helper carries the past.
Ask about that day. | Did Tom play football in the park yesterday? | Ask a positive yes/no question. | Did
`);
 add('kids',6,'There is a box.',`
One box becomes two. | There are two boxes. | Both the noun and verb need attention.
Describe the boxes · red. | There are two red boxes. | The colour belongs before the thing.
Place · table, on top. | There are two red boxes on the table. | Build the place phrase yourself.
Object swap · three blue toys. | There are three blue toys on the table. | Keep the same place.
Check the toys' location with a question. | Are there three blue toys on the table? | Keep the number and colour. | Are
`);
 add('kids',7,'I get up.',`
Clock clue · seven. | I get up at seven. | Clock times need a preposition.
Spell out the clock expression · o'clock. | I get up at seven o'clock. | Put it beside the number.
New person · Ben. | Ben gets up at seven o'clock. | Keep the routine; check agreement.
Reverse Ben's routine. | Ben does not get up at seven o'clock. | Use the base verb after the negative helper.
Ask for the clock time. Drop seven. | What time does Ben get up? | A time question has its own opening. | What
`);
 add('kids',8,'Mia has got a bag.',`
Bag colour · red. | Mia has got a red bag. | Put the adjective before the noun.
Bag size · small. | Mia has got a small red bag. | Think about adjective order.
Mia does not have this bag. | Mia has not got a small red bag. | Make the possession negative.
Ask about the bag. | Has Mia got a small red bag? | Keep the size and colour. | Has
Reply yes · use she. | Yes, she has. | A short reply does not repeat the bag. | Yes
`);
 add('kids',9,'This is a bag.',`
Owner clue · Mia. Use a possessive determiner. | This is her bag. | The bag still needs a word before it.
Replace the owner-and-bag phrase with one pronoun. | This is hers. | The possession word must stand alone.
Move the bag far away. | That is hers. | Change the pointing word.
Now two bags, still far away. | Those are hers. | Change the pointing word and the verb.
Check possession · positive yes/no question. Keep the possessive pronoun. | Are those hers? | Use a positive question. | Are
`);
 add('a1',1,'Ben is a teacher.',`
Workplace · London. | Ben is a teacher in London. | Add the city with a preposition.
Personality · friendly. Join with and. | Ben is a teacher in London and he is friendly. | Add a second fact about Ben.
Reverse only the personality. | Ben is a teacher in London and he is not friendly. | Keep the job and city positive.
Ask about the job and city only. | Is Ben a teacher in London? | Leave out the personality fact. | Is
Reply yes · use he. | Yes, he is. | Repeat the helping verb, not the details. | Yes
`);
 add('a1',2,'Mia reads.',`
Object · books. | Mia reads books. | Add what Mia reads.
Place · home. | Mia reads books at home. | Put the place after the object.
Time · every evening. | Mia reads books at home every evening. | Put the time after the place.
Frequency · often. | Mia often reads books at home every evening. | Frequency belongs near the main verb.
Ask about the object. Drop often. | What does Mia read at home every evening? | Keep the place and time. | What
`);
 add('a1',3,'Mia works.',`
Workplace · cafe. | Mia works in a cafe. ~ Mia works in a café. | Choose the place preposition yourself.
Frequency · usually. | Mia usually works in a cafe. ~ Mia usually works in a café. | Put it before the main verb.
Day · Saturdays. | Mia usually works in a cafe on Saturdays. ~ Mia usually works in a café on Saturdays. | Days need a preposition.
No Saturday work. Drop usually. | Mia does not work in a cafe on Saturdays. ~ Mia does not work in a café on Saturdays. | The negative helper changes the main verb.
Ask about the Saturday routine. Use her name. | Does Mia work in a cafe on Saturdays? ~ Does Mia work in a café on Saturdays? | Use a positive yes/no question. | Does
`);
 add('a1',4,'Ben is cooking.',`
Object · dinner. | Ben is cooking dinner. | Add what Ben is making.
Place · kitchen. | Ben is cooking dinner in the kitchen. | Build a place phrase.
Time · right now. | Ben is cooking dinner in the kitchen right now. | Keep the activity and place.
It is not happening. | Ben is not cooking dinner in the kitchen right now. | Make the action negative.
Ask about the food. Remove the negative. | What is Ben cooking in the kitchen right now? | Keep the place and time. | What
`);
 add('a1',5,'Mia visited a museum.',`
Time · yesterday. | Mia visited a museum yesterday. | This is a finished past visit.
Companion · Ben. Put this before the time. | Mia visited a museum with Ben yesterday. | Add the person with the right preposition.
The visit did not happen. | Mia did not visit a museum with Ben yesterday. | Let the negative helper carry the tense.
Ask about the visit. | Did Mia visit a museum with Ben yesterday? | Use a positive yes/no question. | Did
Reply yes · use she. | Yes, she did. | Reuse the question's helper. | Yes
`);
 add('a1',6,'There is a chair.',`
Place · window, beside it. | There is a chair next to the window. | Use a two-word place preposition.
One chair becomes two. | There are two chairs next to the window. | Check both agreement and number.
No chairs remain · use any. | There are not any chairs next to the window. | Keep the window location.
Ask whether any chairs are there. | Are there any chairs next to the window? | Use a positive question. | Are
Reply no. | No, there are not. | Keep the location word from the question. | No
`);
 add('a1',7,'Mia calls Ben.',`
Replace Mia with a subject pronoun. | She calls Ben. | Who is doing the calling?
Replace Ben with an object pronoun. | She calls him. | Who receives the call?
Time · every evening. | She calls him every evening. | Keep both pronouns.
Reverse the calling habit. | She does not call him every evening. | Check the main verb after the helper.
Ask about the habit. | Does she call him every evening? | Use a positive question and keep both pronouns. | Does
`);
 add('a1',8,'The bag is here.',`
Move the bag beneath the chair. | The bag is under the chair. | Replace the old location.
Move it beside the desk. | The bag is next to the desk. | Use a two-word place preposition.
New position · desk on one side, bed on the other. | The bag is between the desk and the bed. | Replace the old location completely.
Deny that location. | The bag is not between the desk and the bed. | Leave both pieces of furniture in place.
Ask for the bag's location. | Where is the bag? | The question replaces the place phrase. | Where
`);
 add('a1',9,'Ben has got a camera.',`
Camera description · new. | Ben has got a new camera. | Put the adjective before the object.
Add tickets · two. Join with and. | Ben has got a new camera and two tickets. | Share the possession verb between the objects.
New owner · I. | I have got a new camera and two tickets. | Possession needs different agreement.
Neither item is mine · use any for tickets. | I have not got a new camera or any tickets. | The linking word between negative objects changes.
Ask me about possession · two tickets again. | Have you got a new camera and two tickets? | Use you and a positive question. | Have
`);
 add('a1',10,'The lesson starts.',`
Clock time · nine. | The lesson starts at nine. | Choose the clock-time preposition.
Day · Monday. | The lesson starts at nine on Monday. | Choose the day preposition.
Month · June. | The lesson starts at nine on Monday in June. | Choose the month preposition.
Ask for the clock time. Keep day and month. | What time does the lesson start on Monday in June? | Remove the answer from the question. | What
Reply with the clock time only. | It starts at nine. | Use a short full statement. | It
`);
 add('a1',11,'Open the door.',`
Make the instruction polite. | Please open the door. | Add one courtesy word at the front. | Please
Add manner · slowly. | Please open the door slowly. | The manner word goes after the object.
Turn it into a polite prohibition. | Please do not open the door slowly. | Keep the courtesy word and manner.
Replace the manner with a limit · before nine. | Please do not open the door before nine. | Keep the prohibition.
Permission instead · after nine. | Please open the door after nine. | Reverse both the polarity and the time limit. | Please
`);
 add('a1',12,'There are apples.',`
A small number of apples · use few. | There are a few apples. | A small positive quantity needs an extra word.
Place · bag. | There are a few apples in the bag. | Add the location at the end.
No apples remain · use any. | There are not any apples in the bag. | Keep the location.
Object swap · water. Keep the negative. | There is not any water in the bag. | Reconsider the verb for an uncountable noun.
Ask about the amount of water. | How much water is there in the bag? | Keep the bag as the location. | How
`);
 add('a1',13,'I like swimming.',`
Place · sea. | I like swimming in the sea. | The activity keeps its current ending.
Season · summer. | I like swimming in the sea in summer. | Add the season after the place.
New swimmer · Mia. | Mia likes swimming in the sea in summer. | Only the finite verb changes with the subject.
Mia does not enjoy this habit. Keep like. | Mia does not like swimming in the sea in summer. | Do not change the activity into a base verb.
Ask about Mia's preference. | Does Mia like swimming in the sea in summer? | Use a positive yes/no question. | Does
`);
 add('a1',14,'Ben buys books.',`
Place · market. | Ben buys books at the market. | Build the place phrase after the object.
Day · Sundays. | Ben buys books at the market on Sundays. | Put the day at the end.
Ask about the purchase. Keep place and day. | What does Ben buy at the market on Sundays? | The object becomes the question focus. | What
Ask about the place instead. Keep the day. | Where does Ben buy books on Sundays? | Bring the object back into the question. | Where
Ask about the day instead. Keep the market. | When does Ben buy books at the market? | The time phrase becomes the question focus. | When
`);
 add('a2',1,'Ben walks to work.',`
Frequency · usually. | Ben usually walks to work. | Place the adverb near the main verb.
Time · weekdays. | Ben usually walks to work on weekdays. | Days need the right preposition.
Reverse the routine. Keep the frequency. | Ben does not usually walk to work on weekdays. | The helper carries agreement.
Ask about Ben's usual way to work. Drop weekdays; use get. | How does Ben usually get to work? | Ask a positive question about manner. | How
Reply using on foot. Keep usually. | He usually gets to work on foot. | Give a full statement about his routine. | He
`);
 add('a2',2,'Mia is tired.',`
Degree · very. | Mia is very tired. | Strengthen the adjective.
Add a second fact · busy. Join with and. | Mia is very tired and she is busy. | Repeat the subject in the second clause.
Time shift · yesterday. Put the time first. | Yesterday, Mia was very tired and she was busy. | Both facts move into the past. | Yesterday
Reverse only the tiredness. | Yesterday, Mia was not very tired and she was busy. | Leave the busy fact positive.
Ask about the tiredness yesterday. Drop the busy fact. | Was Mia very tired yesterday? | Use a positive question. | Was
`);
 add('a2',3,'Mia is working.',`
Temporary period · this week. | Mia is working this week. | Keep the action in progress.
Workplace · home, remotely. Before the time. | Mia is working from home this week. | Choose the preposition for remote work.
Reverse the statement. | Mia is not working from home this week. | Keep the temporary period.
Ask about the workplace. Remove the negative. | Where is Mia working this week? | The location becomes the question focus. | Where
New arrangement · Mia / meet / Ben / six / tomorrow. | Mia is meeting Ben at six tomorrow. ~ Mia is meeting Ben tomorrow at six. | Use the current tense to describe a future plan. | Mia
`);
 add('a2',4,'Ben works in a cafe.',`
Frequency · usually. | Ben usually works in a cafe. ~ Ben usually works in a café. | Keep the routine tense.
Contrast today · work / home. | Ben usually works in a cafe, but today he is working at home. ~ Ben usually works in a café, but today he is working at home. | One routine, one temporary action; repeat the subject as a pronoun.
Reverse only the routine. | Ben does not usually work in a cafe, but today he is working at home. ~ Ben does not usually work in a café, but today he is working at home. | Leave today's activity positive.
Ask about today's workplace only. | Where is Ben working today? | Remove the routine and the negative. | Where
Ask about the usual workplace instead. | Where does Ben usually work? | Change the tense to match a habit. | Where
`);
 add('a2',5,'She reads books.',`
Frequency · often. | She often reads books. | Decide where it belongs around the main verb.
Manner · quietly. After the object. | She often reads books quietly. | Keep the frequency unchanged.
Place · home. | She often reads books quietly at home. | Add the place after the manner.
Time · evening. | She often reads books quietly at home in the evening. | Add the time after the place.
Ask about the reading material. | What does she often read quietly at home in the evening? | Keep the manner, place and time. | What
`);
 add('a2',6,'Ben bought a book.',`
Time · last Saturday. | Ben bought a book last Saturday. | The purchase is a finished event.
Place · market. Before the time. | Ben bought a book at the market last Saturday. | Keep the irregular past verb.
The purchase did not happen. | Ben did not buy a book at the market last Saturday. | The helper carries the past tense.
Ask about the purchase. Keep place and time. | What did Ben buy at the market last Saturday? | Use a positive question. | What
Reply with two books. Keep place and time. | He bought two books at the market last Saturday. | Restore a past statement. | He
`);
 add('a2',7,'Mia was reading.',`
Object · book. | Mia was reading a book. | A singular object needs an article.
Past moment · eight, last night. | Mia was reading a book at eight last night. | This action was in progress then.
Interruption · Ben / call. | Mia was reading a book at eight last night when Ben called. | Join a short past event to the ongoing one.
Reverse only the reading. | Mia was not reading a book at eight last night when Ben called. | Leave the interruption positive.
Ask about Mia's activity during the interruption. Drop book and clock time. | What was Mia doing when Ben called? | Use a general action verb. | What
`);
 add('a2',8,'Ben walked home.',`
Show the walk in progress. | Ben was walking home. | Rebuild the verb rather than adding a time.
Interruption · rain / start. | Ben was walking home when it started to rain. | Use when to connect the two actions.
Interruption first. | When it started to rain, Ben was walking home. | Keep both verb forms. | When
Ongoing action first; introduce it with a different time linker. | While Ben was walking home, it started to rain. | Keep the rain as the short event. | While
Reverse only the rain event. | While Ben was walking home, it did not start to rain. | Keep the ongoing walk positive.
`);
 add('a2',9,'Mia can swim.',`
Ability level · very well. | Mia can swim very well. | Keep the modal unchanged.
Reverse the ability. | Mia cannot swim very well. | The main verb stays in its base form.
Ask about the ability. | Can Mia swim very well? | Use a positive question. | Can
Advice instead · should; practise / every day. | Mia should practise every day. ~ Mia should practice every day. | The main verb must fit the advice modal. | Mia
Turn the advice into an obligation · use have. | Mia has to practise every day. ~ Mia has to practice every day. | Check agreement, then the following verb form. | Mia
`);
 add('a2',10,'Ben plays football.',`
Make the football habit no longer true · use used. | Ben used to play football. | The verb pattern must signal a past habit.
Frequency · every weekend. | Ben used to play football every weekend. | Keep the past-habit pattern.
Contrast now · play / tennis. | Ben used to play football every weekend, but now he plays tennis. | Use a present habit in the second clause; repeat the subject as a pronoun.
Reverse only the past habit. | Ben did not use to play football every weekend, but now he plays tennis. | Check the spelling after the negative helper.
Ask about the past habit only. Keep the frequency. | Did Ben use to play football every weekend? | Use a positive question. | Did
`);
 add('a2',11,'Mia wants to travel.',`
Destination · Italy. | Mia wants to travel to Italy. | Keep the verb pattern after want.
Purpose · learn / Italian. | Mia wants to travel to Italy to learn Italian. | Explain the reason for the journey.
Enjoyment instead of desire · use enjoy. | Mia enjoys travelling to Italy to learn Italian. ~ Mia enjoys traveling to Italy to learn Italian. | Rebuild the following verb; keep destination and purpose.
Reverse the enjoyment. | Mia does not enjoy travelling to Italy to learn Italian. ~ Mia does not enjoy traveling to Italy to learn Italian. | The negative helper changes only the finite verb.
Yesterday's decision · Mia / travel / Italy / learn Italian. | Mia decided to travel to Italy to learn Italian yesterday. ~ Yesterday, Mia decided to travel to Italy to learn Italian. | Replace the whole statement; use decide.
`);
 add('a2',12,'Mia has visited Rome.',`
Visit count · twice. | Mia has visited Rome twice. | Keep the time period open.
Ask about lifetime experience · use ever. Drop twice; use her name. | Has Mia ever visited Rome? | A question needs a new word order. | Has
Reply negatively in a full sentence · never. | She has never visited Rome. | Do not add a second negative. | She
New travellers · They. | They have never visited Rome. | Check agreement in the helping verb. | They
Ask about completion · yet. Drop never. | Have they visited Rome yet? | Use a positive question. | Have
`);
 add('a2',13,'This bag is big.',`
Compare with my bag · big. | This bag is bigger than my bag. | Form the comparative yourself.
Increase the difference · much. | This bag is much bigger than my bag. | Place the intensifier beside the comparison.
Now rank it first in the shop. | This bag is the biggest in the shop. | Replace the comparison with a superlative.
Deny that ranking. | This bag is not the biggest in the shop. | Keep the shop reference.
Equal size instead · use as twice. | This bag is as big as my bag. | Return to a comparison with my bag.
`);
 add('b1',1,'Mia has finished the report.',`
Recent completion · just. | Mia has just finished the report. | Find the adverb's position inside the verb group.
Present result · can / go home. Join with so. | Mia has just finished the report, so she can go home. | Repeat the subject as a pronoun in the result.
Unfinished · yet. Drop just and the result. | Mia has not finished the report yet. | Change both polarity and the time marker.
Ask about completion · keep yet and her name. | Has Mia finished the report yet? | Use a positive yes/no question. | Has
Finished past time · yesterday. | Mia finished the report yesterday. | Return to a positive statement and reconsider the tense. | Mia
`);
 add('b1',2,'Mia has been studying.',`
Study subject · English. | Mia has been studying English. | Add the object; keep the current verb group.
Duration · two hours. | Mia has been studying English for two hours. | Choose the right duration marker.
Starting point instead · nine o'clock. | Mia has been studying English since nine o'clock. | Replace the duration, including its marker.
Reverse the statement. | Mia has not been studying English since nine o'clock. | The negative belongs inside the verb group.
Ask about duration. Drop the starting point. | How long has Mia been studying English? | Use a positive question about elapsed time. | How
`);
 add('b1',3,'Ben had left.',`
Later event · Mia / arrive. Link with before. | Ben had left before Mia arrived. | The two actions occupy different past times.
Earlier than expected · already. | Ben had already left before Mia arrived. | Place the adverb inside the verb group.
Later event first · use by. | By the time Mia arrived, Ben had already left. | Keep the earlier action completed. | By
The departure was still unfinished. Drop already. | By the time Mia arrived, Ben had not left. | Keep the later event first.
Ask about the departure · link with before. | Had Ben left before Mia arrived? | Use a positive question. | Had
`);
 add('b1',4,'I will walk to work.',`
Real future condition · no rain. Put it first. | If it does not rain, I will walk to work. | Choose the tense in the condition yourself. | If
Reverse only the result. | If it does not rain, I will not walk to work. | Leave the condition unchanged.
Imaginary instead. Restore a positive result. | If it did not rain, I would walk to work. | Both sides need a different verb pattern. | If
New imaginary condition · have / car. Travel by driving. | If I had a car, I would drive to work. | Keep the destination unchanged. | If
Ask about the imaginary car situation. Use you; drop work. | What would you do if you had a car? | Ask what action the listener would take. | What
`);
 add('b1',5,'They make the bags.',`
Origin · Italy. | They make the bags in Italy. | Add the country after the object.
Focus on the bags. Remove the agent. | The bags are made in Italy. | Preserve the tense while changing the voice. | The
Time shift · last year. | The bags were made in Italy last year. | Keep the passive voice.
Reverse the statement. | The bags were not made in Italy last year. | The main participle does not change.
Ask about the place of production. | Where were the bags made last year? | Keep the past time and use a positive question. | Where
`);
 add('b1',6,'Mia said, "I am tired."',`
Report the quotation · use that. | Mia said that she was tired. | Reconsider the speaker and tense.
Add her reason · work / hard. | Mia said that she was tired because she worked hard. | Report both parts consistently.
Name the listener · Ben. Switch to tell. | Mia told Ben that she was tired because she worked hard. | The reporting verb needs a person.
New message · not tired. Report to the same listener. | Mia told Ben that she was not tired. | Replace the earlier reason as well as the message.
Next message · rest / tomorrow. Report it the next day. | Mia told Ben that she would rest the next day. | Reconsider the modal and the time reference.
`);
 add('b1',7,'I know a woman.',`
Identify the woman · teach / English. Use who. | I know a woman who teaches English. | Add a clause attached to the person.
Teaching place · our school. | I know a woman who teaches English at our school. | Add the place inside the relative clause.
Identify by possession instead · bag / red. | I know a woman whose bag is red. | Replace the teaching clause; choose a possession linker.
Identify by home instead · live / beside the park. Use who. | I know a woman who lives next to the park. | Replace the previous identifying detail.
Reverse only the identifying clause. | I know a woman who does not live next to the park. | Keep the main statement positive.
`);
 add('b1',8,'Ben works here.',`
Invite confirmation · add a negative tag. | Ben works here, does he not? ~ Ben works here, doesn't he? | The tag depends on the tense and subject.
Frequency · usually. Keep the tag. | Ben usually works here, does he not? ~ Ben usually works here, doesn't he? | The main verb still describes a routine.
Reverse the main clause. Drop usually; update the tag. | Ben does not work here, does he? | The tag's polarity changes too.
Positive past statement · yesterday. Update the tag. | Ben worked here yesterday, did he not? ~ Ben worked here yesterday, didn't he? | Both the clause and tag need the past.
Experience up to now · before. Drop yesterday; update the tag. | Ben has worked here before, has he not? ~ Ben has worked here before, hasn't he? | Change the tense in both places.
`);
 add('b1',9,'Ben is at home.',`
Strong deduction · must. | Ben must be at home. | Keep the location; rebuild the verb group.
Evidence · his car / outside. Link with because. | Ben must be at home because his car is outside. | State the evidence as a current fact.
Uncertain possibility · might. Drop the evidence. | Ben might be at home. | Reduce certainty without changing the location.
Impossible location · cannot. | Ben cannot be at home. | Express a negative deduction, not a prohibition.
Evidence · Ben / Rome. Link with because. | Ben cannot be at home because he is in Rome. | Use a pronoun in the evidence clause.
`);
 add('b1',10,'Mia enjoys reading.',`
Reading material · detective stories. | Mia enjoys reading detective stories. | Keep the existing verb pattern.
Situation · train. | Mia enjoys reading detective stories on the train. | Add the location after the material.
Desire instead of enjoyment · use want. | Mia wants to read detective stories on the train. | Keep the material and location; change the following verb form.
Purpose · relax. | Mia wants to read detective stories on the train to relax. | Add the reason at the end.
Interest instead · use interested. Drop the purpose. | Mia is interested in reading detective stories on the train. | Choose the preposition and following verb form. | Mia
`);
 add('b1',11,'Mia checks the report.',`
Manner · form a word from careful. | Mia checks the report carefully. | Choose the word class that modifies an action.
Describe Mia instead · form a word from care. Keep a when-clause. | Mia is careful when she checks the report. | Change the word class and sentence frame. | Mia
Use the noun care after with. | Mia checks the report with care. | Return to a statement about checking. | Mia
Opposite personal quality · care. Keep the when-clause. | Mia is careless when she checks the report. | Build a negative adjective rather than negating the verb. | Mia
Describe the checking manner again. Keep the opposite meaning. | Mia checks the report carelessly. | Replace the quality statement with an action statement. | Mia
`);
 add('b2',1,'Ben missed the train.',`
Actual consequence · arrive / late. Join with so. | Ben missed the train, so he arrived late. | Both actions are completed facts.
Opposite past · keep miss and arrive late. | If Ben had not missed the train, he would not have arrived late. | Rebuild the cause and result as an unreal past. | If
Positive result · arrive / on time. | If Ben had not missed the train, he would have arrived on time. | Keep the unreal condition.
Add another unreal result · see / Mia. Repeat he. | If Ben had not missed the train, he would have arrived on time and he would have seen Mia. | Keep the result in the same time frame.
Both results first; condition last. | Ben would have arrived on time and he would have seen Mia if he had not missed the train. | Name Ben in the first clause and use a pronoun in the condition. | Ben
`);
 add('b2',2,'Ben did not study medicine.',`
Current consequence · not a doctor / now. Join with so. | Ben did not study medicine, so he is not a doctor now. | The cause is past; the result is present.
Reverse the past cause and present result. | If Ben had studied medicine, he would be a doctor now. | Keep the result in the present, not the past. | If
Add another current result · work / hospital. Repeat he. | If Ben had studied medicine, he would be a doctor now and he would work in a hospital. | Keep the second result imaginary too.
First result first. Drop the hospital result. | Ben would be a doctor now if he had studied medicine. | Keep the past condition after the result. | Ben
New mixed situation · fear of flying now; no travel yesterday. | If Ben were not afraid of flying, he would have travelled yesterday. ~ If Ben were not afraid of flying, he would have traveled yesterday. | Imagine no fear and the opposite past result. | If
`);
 add('b2',3,'I do not have a car.',`
A wish about now · use wish. | I wish I had a car. | The verb form marks distance from reality. | I
Reason · drive / work. Link with so; express imagined ability. | I wish I had a car so I could drive to work. | Keep the wish about the present.
Past regret instead · not buying the car. Drop the reason. | I wish I had bought the car. | The missed event needs an earlier time form. | I
Stronger regret · only. | If only I had bought the car. | Keep the past event unchanged. | If
Recurring annoyance · neighbour / block / drive. Wish for it to stop. | I wish the neighbour would stop blocking my drive. ~ I wish the neighbor would stop blocking my drive. | This wish is about another person's behaviour. | I
`);
 add('b2',4,'They are repairing the bridge.',`
Focus on the bridge. Remove the agent. | The bridge is being repaired. | Preserve the ongoing action while changing voice. | The
Completion now · perfect passive; three months taken. | The bridge has been repaired in three months. | Express a completed result with passive voice.
Future deadline · Friday. Drop the repair duration. | The bridge will have been repaired by Friday. | Show completion before the deadline.
Obligation to finish before Friday · use must. | The bridge must be repaired before Friday. | Replace the future completion pattern.
Forbidden before Friday. | The bridge must not be repaired before Friday. | Negate the obligation without changing the deadline.
`);
 add('b2',5,'Mia asked Ben, "Where do you live?"',`
Report the question. | Mia asked Ben where he lived. | Use statement order inside the reported question.
New question · live / London? Report with if. | Mia asked Ben if he lived in London. | The original question expects yes or no.
New question · finish / report, completed by now? Report with whether. | Mia asked Ben whether he had finished the report. | Backshift the completed action.
Command instead · finish / report. Same speaker and listener. | Mia told Ben to finish the report. | Change the reporting verb and the following verb pattern.
A negative command instead. | Mia told Ben not to finish the report. | Place the negative before the requested action.
`);
 add('b2',6,'Ben missed the train.',`
Strong past deduction · must. | Ben must have missed the train. | The event is inferred, not stated as a fact.
Evidence · arrive / late. Link with because. | Ben must have missed the train because he arrived late. | State the evidence as a past fact.
Uncertain past deduction · might. Drop the evidence. | Ben might have missed the train. | Keep the same earlier event.
The past event is impossible · cannot. | Ben cannot have missed the train. | Use a deduction, not a past inability.
Evidence · I / see / him / on it. | Ben cannot have missed the train because I saw him on it. | Support the impossibility with a past fact.
`);
 add('b2',7,'Mia is a doctor.',`
Extra information · live / next door. Put it after Mia. | Mia, who lives next door, is a doctor. | This information does not identify which Mia.
Possession instead · son / study / Rome. | Mia, whose son studies in Rome, is a doctor. | Replace the extra-information clause.
Reverse only the extra information. | Mia, whose son does not study in Rome, is a doctor. | Leave the profession positive.
Training place instead · London. Reduce a passive relative. | Mia, trained in London, is a doctor. | Replace the earlier detail with a shorter modifier.
Restore the full passive relative · use who. | Mia, who was trained in London, is a doctor. | Keep the same training detail.
`);
 add('b2',8,'Ben stopped smoking.',`
Time · last year. | Ben stopped smoking last year. | The activity ended then.
Meaning shift · pause for a cigarette during a walk. | Ben stopped to smoke during his walk. | Rebuild the verb pattern after stop.
Deny that pause. | Ben did not stop to smoke during his walk. | Keep the purpose and walking context.
New event · remember / take medicine / before the walk. A task was completed. | Ben remembered to take his medicine before his walk. | Choose the pattern for remembering a responsibility.
Meaning shift · a memory of the medicine, not a task. | Ben remembered taking his medicine before his walk. | Change the following verb form.
`);
 add('b2',9,'Mia will write the report.',`
In progress · ten tomorrow. | Mia will be writing the report at ten tomorrow. | Rebuild the future verb group.
Ask about that future activity. | Will Mia be writing the report at ten tomorrow? | Use a positive yes/no question. | Will
Completion deadline · Friday. Drop the clock time. | Mia will have written the report by Friday. | Switch from progress to completion.
It will remain unfinished by then. | Mia will not have written the report by Friday. | Negate completion, not the deadline.
Ask about the completed work. | What will Mia have written by Friday? | Use a positive question; keep the deadline. | What
`);
 add('b2',10,'A mechanic repaired Mia\'s car.',`
Mia arranged the service. Make her the subject; use have. | Mia had her car repaired. | She did not repair the car herself. | Mia
Time · last week. | Mia had her car repaired last week. | This is a completed service.
Future arrangement instead · tomorrow. | Mia is having her car repaired tomorrow. | Use an arrangement tense, not a prediction.
Cancel the arrangement. | Mia is not having her car repaired tomorrow. | Negate the service arrangement.
Ask about the arrangement · switch to get. | Is Mia getting her car repaired tomorrow? | Use a positive question.
`);
 add('b2',11,'This room is bigger than that room.',`
Increase the difference · far. | This room is far bigger than that room. | Intensify the comparison.
Reverse the comparison · use nearly and as twice. | That room is not nearly as big as this room. | Start with the smaller room and make it negative. | That
Exact ratio · double. Use twice and as twice. | This room is twice as big as that room. | Return to the larger room as subject. | This
Linked changes · get bigger; become brighter. | The bigger this room gets, the brighter it becomes. | Make the two comparisons depend on each other. | The
Swap brightness for expense. | The bigger this room gets, the more expensive it becomes. | Keep the linked-change pattern.
`);
 add('b2',12,'Mia makes a decision.',`
Time · every morning. | Mia makes a decision every morning. | Keep the routine tense.
Time shift · yesterday. | Mia made a decision yesterday. | Rebuild the finite verb.
Next action · break. Join with and; repeat she. | Mia made a decision yesterday and she took a break. | Choose the verb that collocates with break.
Earlier action · homework. Put a time clause first. | After she did her homework, Mia made a decision yesterday and she took a break. | Choose the right collocation for homework. | After
Compress the earlier action into a perfect participle. Drop yesterday and the repeated she. | Having done her homework, Mia made a decision and took a break. | The subject is shared by the actions. | Having
`);
 add('b2',13,'It is possible to finish the report.',`
Reverse possible using a prefix. | It is impossible to finish the report. | Change the adjective, not the main verb.
Reason · instructions / not clear. Link with because. | It is impossible to finish the report because the instructions are unclear. | Express the negative quality with a prefix.
Use the noun from possible · no chance remains. | There is no possibility of finishing the report because the instructions are unclear. | Check the preposition and the following verb form. | There
A chance exists; instructions now clear. | There is a possibility of finishing the report because the instructions are clear. | Remove both negative meanings.
Success as manner · form an adverb. Keep the reason. | We can finish the report successfully because the instructions are clear. | Switch to a statement about finishing. | We
`);
 add('c1',1,'Mia has seen such a view.',`
Negative experience · never. | Mia has never seen such a view. | Place the adverb inside the verb group.
Front the negative word for emphasis. | Never has Mia seen such a view. | Reconsider subject–auxiliary order. | Never
Enrich the view · beautiful; add before at the end. | Never has Mia seen such a beautiful view before. | Preserve the emphasis pattern.
Immediate sequence · Mia / arrive; rain / begin. Pair with than. | No sooner had Mia arrived than the rain began. | Use a fronted negative time expression. | No
Same sequence, different negative opener. | Hardly had Mia arrived when the rain began. | The linker must change too. | Hardly
`);
 add('c1',2,'Mia sent Ben the report yesterday.',`
Focus on the sender. | It was Mia who sent Ben the report yesterday. | Build a cleft; use who for the person. | It
Focus on the recipient instead · use whom. | It was Ben whom Mia sent the report to yesterday. | Keep the stranded preposition with the reporting clause. | It
Focus on the time instead · use that. | It was yesterday that Mia sent Ben the report. | Move only the focus, not the event details. | It
Focus on the action · pseudo-cleft. | What Mia did yesterday was send Ben the report. ~ What Mia did yesterday was to send Ben the report. | Rebuild the event around what was done. | What
Only this action happened. Replace the opening. | All Mia did yesterday was send Ben the report. ~ All Mia did yesterday was to send Ben the report. | Keep the action in its base form. | All
`);
 add('c1',3,'Ben should leave.',`
Departure due now · use a hypothetical past. | It is time Ben left. | The verb form creates distance from the present. | It
Increase the urgency · high. | It is high time Ben left. | Keep the departure in the same hypothetical form.
My preference instead · use rather. | I would rather Ben left. | The departure has a different subject from the preference. | I
I prefer him not to leave. | I would rather Ben did not leave. | Negate the preferred action, not the preference.
Formal recommendation · Ben / remain / here. | I recommend that Ben remain here. ~ I recommend that Ben should remain here. | Use recommend and a mandative clause. | I
`);
 add('c1',4,'Mia finished the report.',`
Later action · go / home. Join with and then; use she. | Mia finished the report and then she went home. | Put the two completed events in order.
Compress the earlier action into a perfect participle. | Having finished the report, Mia went home. | Keep the shared subject clear. | Having
Reason for leaving · feel / tired. Link with because. | Having finished the report, Mia went home because she felt tired. | Keep the reason in the same past time.
Reduce the reason too. Join the modifiers with and. | Having finished the report and feeling tired, Mia went home. | Make both opening modifiers refer to Mia.
Earlier action unfinished; Mia stays at work instead. Keep the tiredness. | Not having finished the report and feeling tired, Mia stayed at work. | Negate only the earlier action; preserve the shared subject. | Not
`);
 add('c1',5,'Mia claims that she saw Ben.',`
Replace the reported clause with a perfect infinitive. | Mia claims to have seen Ben. | The claimed event happened earlier than the claim.
Sighting time · yesterday. | Mia claims to have seen Ben yesterday. | The time belongs to the earlier event.
Deny the sighting inside the claim. | Mia claims not to have seen Ben yesterday. | Keep the reporting verb positive.
An admission instead · deny the same sighting. Use admit. | Mia admits not having seen Ben yesterday. | Change the following verb pattern without changing the time.
Positive admission; sighting place · station, before yesterday. | Mia admits having seen Ben at the station yesterday. | Keep the earlier-event relationship.
`);
 add('c1',6,'Mia said, "I have been waiting."',`
Report her statement · use that. | Mia said that she had been waiting. | Both perspective and tense may shift.
Waiting duration · two hours. | Mia said that she had been waiting for two hours. | Preserve the duration relationship.
Next message · will / not / wait / any longer. Join with and; repeat she. | Mia said that she had been waiting for two hours and she would not wait any longer. | Report a future refusal from a past viewpoint.
Name the listener · Ben. Switch to tell. | Mia told Ben that she had been waiting for two hours and she would not wait any longer. | The reporting verb needs an object.
New question · why / you / not call / me? Use ask. | Mia asked Ben why he had not called her. | Drop the earlier statements; report the question with shifted perspective.
`);
 const substitutions=[
  [],
  [['Mia','Zoe'],['Ben','Leo'],['Tom','Max'],['Rome','Paris'],['London','Oxford'],['the report','the article'],['football','basketball']],
  [['Mia','Eva'],['Ben','Sam'],['Tom','Dan'],['Rome','Milan'],['London','Bristol'],['the report','the document'],['football','volleyball']]
 ];
 function variant(level,number,index=0){
  const source=bank[level+':'+number];if(!source)throw Error('Missing expander sequence '+level+':'+number);
  const replace=text=>(substitutions[index%substitutions.length]||[]).reduce((s,[a,b])=>s.replace(new RegExp('\\b'+a+'\\b','g'),b),text);
  return {start:replace(source.start),steps:source.steps.map(s=>({instruction:replace(s.instruction),hint:replace(s.hint),starter:replace(s.starter),answers:s.answers.map(replace)}))};
 }
 window.ExpanderCurriculum={bank,variant};
})();
