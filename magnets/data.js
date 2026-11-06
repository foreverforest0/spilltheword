/* Curated, level-specific sentence banks for topics without an existing magnet deck. */
const FRIDGE_BANKS={};
function fridgeBank(key,task,text){FRIDGE_BANKS[key]=text.trim().split('\n').map(s=>({q:task,answers:[s.trim()]}));}
fridgeBank('a1_word','Put the words in the correct order. Start with the subject.',`
My little brother loves this song.
We usually have lunch at home.
There is a red bag under the chair.
I can help you after school.
She speaks English very well.
They are watching a funny film.`);
fridgeBank('a1_there','Describe what is in the room. Use there is or there are.',`
There is a lamp next to the bed.
There are two chairs in the kitchen.
There isn’t a mirror in this room.
Are there any books on the desk?
Is there a window in the bathroom?
There are some shoes under the bed.`);
fridgeBank('a1_pron','Build the sentence. Choose the correct position for the pronouns.',`
This is my bag and that is yours.
Can you help me with this box?
She lives with her sister.
We like him because he is funny.
These keys are mine.
I can see them from here.`);
fridgeBank('a1_prep','Describe the position or movement. Keep the preposition with its noun.',`
The cat is under the table.
My phone is next to the bed.
There is a shop behind the school.
She is walking to the park.
The keys are in my coat.
He is standing between two cars.`);
fridgeBank('a1_have','Build the sentence with have got or has got.',`
I have got a new bike.
She has got two brothers.
We haven’t got any milk.
Has he got a blue pen?
They have got a small garden.
Have you got a minute?`);
fridgeBank('a1_time','Build the sentence. Use the time expression in the right place.',`
The lesson starts at nine o’clock.
We play tennis on Fridays.
My birthday is in June.
I have lunch at half past twelve.
She goes to bed at ten.
Do you work at the weekend?`);
fridgeBank('a1_imp','Build an instruction. Start with a verb or don’t.',`
Please put your phone in your bag.
Don’t open the window.
Turn left at the next street.
Wash your hands before lunch.
Please speak a little more slowly.
Don’t forget your keys.`);
fridgeBank('a1_count','Build the sentence. Check countable and uncountable nouns.',`
There is some bread on the table.
How many apples do we need?
We haven’t got much time.
Can I have some water?
There aren’t any eggs in the fridge.
How much milk is there?`);
fridgeBank('a1_ger','Build the sentence using like, love or hate + -ing.',`
I like reading in bed.
She loves dancing with her friends.
We don’t like getting up early.
Do you like cooking at home?
He hates waiting for the bus.
They love playing outside.`);
fridgeBank('a1_question','Build a question. Put the question word first.',`
Where does your sister live?
What time do you get up?
How old is your brother?
Why are you wearing my coat?
Who is that woman?
How much does this book cost?`);
fridgeBank('a2_simple','Build the Present Simple sentence. Check questions, negatives and he / she / it forms.',`
My flatmate usually gets home after seven.
How often do you check your messages?
The last train leaves at half past eleven.
She doesn’t spend much money on clothes.
Do your neighbours make a lot of noise?
We hardly ever eat out during the week.`);
fridgeBank('a2_be','Build the sentence with the correct form of be.',`
The shops are usually busy on Saturdays.
Were you at the meeting yesterday?
I wasn’t ready to leave at eight.
Why is your suitcase so heavy?
There were a lot of people at the station.
The tickets aren’t as expensive as I thought.`);
fridgeBank('a2_continuous','Build the Present Continuous sentence for an action happening now or a temporary situation.',`
I am staying with my sister this week.
Why are you looking at me like that?
They aren’t using the meeting room today.
We are looking for a bigger flat.
Is she still waiting for a reply?
He is learning to drive at the moment.`);
fridgeBank('a2_past','Build the Past Simple sentence. Use did + base verb in questions and negatives.',`
We missed the last bus home.
Did you enjoy your first day at work?
She didn’t recognise me at first.
How much did you pay for those shoes?
I left my umbrella at the restaurant.
They moved to a different city last year.`);
fridgeBank('a2_order','Arrange the words to make a natural sentence.',`
I didn’t expect to see you here.
She has already paid for the tickets.
Can you tell me the time, please?
We usually do the shopping on Fridays.
Why are you still wearing your coat?
I would like to try something different.`);
fridgeBank('a2_mixpresent','Build the sentence. Use Present Simple for routines and Present Continuous for now.',`
I usually walk but today I am taking the bus.
She is working from home this week.
Do you always drink tea in the morning?
We aren’t watching TV right now.
He never eats breakfast before work.
What are you doing at the moment?`);
fridgeBank('a2_pastcont','Build the sentence in Past Continuous.',`
I was cooking when you called.
They were waiting outside the cinema.
She wasn’t listening to the teacher.
Were you sleeping at ten last night?
What were they talking about?
It was raining all afternoon.`);
fridgeBank('a2_mixpast','Build the sentence. Use Past Continuous for the action in progress and Past Simple for the event.',`
I was having a shower when the doorbell rang.
She dropped her phone while she was running.
We were watching TV when the lights went out.
What were you doing when I called?
He was walking home when he saw Anna.
They were eating dinner when we arrived.`);
fridgeBank('a2_modals','Build the sentence. Keep the modal before the base verb.',`
You should take a warm coat.
We have to leave before eight.
You mustn’t park in front of the gate.
Do I have to bring my laptop?
She can’t come to the party.
You don’t have to pay today.`);
fridgeBank('a2_used','Describe a past habit using used to or didn’t use to.',`
I used to walk to school.
She didn’t use to like coffee.
Did you use to live near here?
We used to play outside every day.
He didn’t use to wear glasses.
There used to be a cinema here.`);
fridgeBank('a2_infger','Build the sentence. Keep -ing or to with the correct verb.',`
I enjoy cooking for my friends.
She wants to learn Spanish.
We decided to take the train.
He finished cleaning the kitchen.
Would you like to come with us?
They hope to move next year.`);
fridgeBank('a2_perfect','Build the sentence in Present Perfect. Use have or has + past participle.',`
I have just sent the email.
She hasn’t seen this film yet.
Have you ever tried sushi?
We have lived here for three years.
He has already booked the tickets.
They haven’t finished their homework.`);
fridgeBank('a2_compare','Build the sentence using a comparative or superlative.',`
This bag is cheaper than that one.
She is the tallest person in our class.
The train is faster than the bus.
This is the best cafe in town.
Today is colder than yesterday.
My room is smaller than yours.`);
fridgeBank('b2_third','Build a Third Conditional sentence about an unreal past situation.',`
If I had left earlier, I would have caught the train.
She would have called you if her phone hadn’t died.
If we had booked sooner, we could have got cheaper tickets.
I wouldn’t have ordered it if I had seen the price.
Would you have gone if they had invited you?
If he had listened, he wouldn’t have made that mistake.`);
fridgeBank('b2_mixed','Build a Mixed Conditional sentence. Connect the past cause with the present result.',`
If I had studied medicine, I would be a doctor now.
She wouldn’t be so tired if she had gone to bed earlier.
If we hadn’t missed the train, we would be at home now.
He would have a better job if he had finished his course.
If I had saved more money, I could afford that flat now.
We wouldn’t be lost if you had brought the map.`);
fridgeBank('b2_wish','Build the sentence with wish or if only. Express a present wish or a past regret.',`
I wish I had listened to your advice.
If only we hadn’t sold that house.
She wishes she could speak French.
I wish you wouldn’t leave your shoes here.
If only I had more free time.
He wishes he hadn’t sent that message.`);
fridgeBank('b2_passive','Build the passive sentence. Keep the full auxiliary chain together.',`
The bridge is being repaired this month.
Your order has already been shipped.
The documents must be signed by Friday.
The meeting had been cancelled before we arrived.
A new station will be built next year.
This problem should have been reported earlier.`);
fridgeBank('b2_report','Build the reported question, statement or request. Use statement word order after the reporting verb.',`
She asked me whether I had seen her keys.
He wanted to know where I was staying.
They told us not to wait outside.
She said she would have finished by Friday.
He asked why I hadn’t called him back.
I promised that I would keep it secret.`);
fridgeBank('b2_deduction','Build a deduction about the past using modal + have + past participle.',`
She must have forgotten about the meeting.
He can’t have seen my message.
They might have taken the wrong train.
You could have left it at the cafe.
She must have been working all night.
He couldn’t have done it on his own.`);
fridgeBank('b2_relative','Build a sentence with a defining or non-defining relative clause. Keep commas with their clauses.',`
My sister, who lives in Leeds, is visiting this weekend.
The laptop which I bought last year has stopped working.
That is the colleague whose idea won the prize.
The cafe where we used to meet has closed.
The film, which lasted three hours, was surprisingly good.
The person to whom I spoke was very helpful.`);
fridgeBank('b2_ger','Build the sentence. Check the gerund or infinitive pattern.',`
I regret telling him about the surprise.
She remembered to lock the door.
We stopped to get some coffee.
He denied taking the money.
I would rather stay at home tonight.
They made us wait outside for an hour.`);
fridgeBank('b2_future','Build a Future Perfect or Future Continuous sentence.',`
By Friday, I will have finished the report.
This time tomorrow, we will be flying to Rome.
Will you be using the car this evening?
She will have left by the time we arrive.
In June, they will have been married for ten years.
I won’t be working at eight tonight.`);
fridgeBank('b2_causative','Build the sentence using have or get + object + past participle.',`
I had my phone repaired yesterday.
She is getting her hair cut tomorrow.
We need to have the windows cleaned.
Have you ever had your bag stolen?
They had their kitchen painted last month.
He is going to get his bike serviced.`);
fridgeBank('b2_compare','Build the sentence using the comparison structure shown by the words.',`
The sooner we leave, the better.
This book is nowhere near as good as the first one.
The more I practise, the more confident I feel.
It is getting harder and harder to find a flat.
She is by far the most experienced person here.
The second option is slightly less expensive.`);
fridgeBank('b2_collocations','Build a natural sentence. Keep the collocation together.',`
We need to take responsibility for what happened.
She made a good impression at the interview.
I find it difficult to make up my mind.
They paid close attention to every detail.
Let’s keep in touch after the course.
He took my advice and applied for the job.`);
fridgeBank('b2_word','Build the sentence. Put the derived word in its correct position.',`
The instructions were surprisingly easy to follow.
Her confidence has grown since she started working here.
It would be irresponsible to ignore the warning.
We need a more reliable way to contact them.
The decision caused a lot of disagreement.
He apologised for the misunderstanding.`);
fridgeBank('c1_inversion','Build the sentence with inversion after the opening negative or restrictive expression.',`
Never have I seen such a crowded train.
Not until we got home did we realise what had happened.
Hardly had I sat down when the phone rang.
Under no circumstances should you share your password.
Only after reading the report did she change her mind.
No sooner had we arrived than it started to rain.`);
fridgeBank('c1_cleft','Build a cleft sentence to emphasise one part of the message.',`
What I need right now is a proper break.
It was Anna who first suggested the idea.
The reason I called was to check you were all right.
What surprised me most was how calm she was.
It wasn’t until Monday that they replied.
All I wanted was a chance to explain.`);
fridgeBank('c1_subj','Build the sentence using the correct form after the expression.',`
It is high time we took this problem seriously.
I would rather you didn’t mention it again.
She insisted that he be given another chance.
If only I had known what they were planning.
I would sooner we discussed this in private.
It is essential that every applicant submit a reference.`);
fridgeBank('c1_participle','Build the sentence with a participle clause. Keep it next to the subject it describes.',`
Having missed the last train, we decided to get a taxi.
Not knowing what to say, I stayed silent.
Written in a hurry, the email sounded rather rude.
Having been warned about the traffic, we left early.
Walking through the market, she spotted an old friend.
Surrounded by strangers, he felt completely out of place.`);
fridgeBank('c1_perfect','Build the sentence using a perfect infinitive or perfect gerund.',`
She seems to have misunderstood the question.
He denied having spoken to the journalist.
I would like to have seen their reaction.
They are believed to have left the country.
She regretted not having taken the opportunity.
He was lucky to have been offered the job.`);
fridgeBank('c1_report','Build the reported sentence. Keep the reporting verb and its complement together.',`
She accused him of having leaked the documents.
He insisted that he had never met her before.
They warned us not to underestimate the risks.
She admitted having overlooked an important detail.
He denied that he had been involved in the decision.
They urged us to reconsider our position.`);
fridgeBank('kids_plural','Build a sentence with the plural noun.',`
There are three cats in the garden.
These boxes are very heavy.
I have got two red buses.
The children are playing outside.
My feet are cold.
Those mice are very small.`);
fridgeBank('kids_past','Build a Past Simple sentence. Use the -ed verb.',`
I played football yesterday.
She watched a film last night.
We visited our grandma on Sunday.
He opened the door.
They cleaned their room yesterday.
I helped my mum in the kitchen.`);
fridgeBank('kids_whose','Build a sentence to say who something belongs to.',`
This is my blue bag.
Those shoes are hers.
Is this pencil yours?
The red hat is his.
These books are ours.
That bike is not mine.`);
// Topic order matches the stable grammar sections in SPGRP (excluding Fun).
const FRIDGE_TOPIC_KEYS={
 kids:['mkb','mks','mgc','a1_there','kids_past','kids_plural','a1_time','a1_have','kids_whose'],
 a1:['mgb','a1_word','mgs','mgc','mgp','a1_there','a1_pron','a1_prep','a1_have','a1_time','a1_imp','a1_count','a1_ger','a1_question'],
 a2:['a2_simple','a2_be','a2_continuous','a2_mixpresent','a2_order','a2_past','a2_pastcont','a2_mixpast','a2_modals','a2_used','a2_infger','a2_perfect','a2_compare'],
 b2:['b2_third','b2_mixed','b2_wish','b2_passive','b2_report','b2_deduction','b2_relative','b2_ger','b2_future','b2_causative','b2_compare','b2_collocations','b2_word'],
 c1:['c1_inversion','c1_cleft','c1_subj','c1_participle','c1_perfect','c1_report']
};
// Themes add vocabulary; basic function words remain available at every level.
const FRIDGE_LEXICON={
 kids:'cat dog bird fish apple banana cake milk juice ball toy bike car bus bag book pen pencil school teacher friend mum dad sister brother house room door window table chair bed park garden red blue green yellow big small happy sad hungry cold hot play eat drink like love see read draw jump run',
 a1:'coffee tea water bread cheese egg phone key shop street station ticket train work lesson morning evening weekend breakfast lunch dinner family neighbour kitchen bathroom office tired busy new old good nice small help want need go come get make take buy cook walk live speak listen watch study start finish open close',
 a2:'holiday journey airport luggage flight hotel beach mountain restaurant menu bill invitation appointment message meeting problem idea plan hobby concert cinema museum library weather traffic shopping practise decide promise hope enjoy avoid prefer learn borrow lend arrive leave lose find forget remember wait choose yesterday already just yet ever never since for while before after',
 b1:'project deadline progress experience opportunity advice colleague customer application interview salary course qualification equipment recipe ingredients environment pollution recycling volunteer achievement decision agreement explanation suggestion responsibility confident disappointed reliable careful anxious exhausted manage afford achieve improve develop organise arrange repair deliver book cancel complain apologise recommend suggest realise depend',
 b2:'approach assessment awareness consequence evidence expectation impact insight issue outcome perspective priority purpose requirement resource solution strategy assumption commitment concern confidence efficiency flexibility improvement misunderstanding negotiation reputation responsibility sustainable controversial effective convincing reluctant determined accurate significant maintain establish acknowledge demonstrate evaluate justify negotiate persuade reconsider resolve underestimate whereas nevertheless despite unless provided otherwise',
 c1:'ambiguity coherence consensus constraint discrepancy implication incentive integrity nuance premise resilience scrutiny setback stance threshold trade-off vulnerability assertion contingency credibility accountability complacency disparity feasibility discretion mitigate substantiate corroborate undermine reconcile scrutinise entail exacerbate ascertain refute concede envisage ostensibly arguably inadvertently inherently notwithstanding albeit whereby'
};
// Explicit verb forms avoid generated spelling errors in the free word bank.
const FRIDGE_VERBS=[
 ['kids','play','plays','played','played','playing'],['kids','eat','eats','ate','eaten','eating'],['kids','drink','drinks','drank','drunk','drinking'],['kids','read','reads','read','read','reading'],['kids','draw','draws','drew','drawn','drawing'],['kids','run','runs','ran','run','running'],['kids','like','likes','liked','liked','liking'],['kids','go','goes','went','gone','going'],['kids','see','sees','saw','seen','seeing'],['kids','jump','jumps','jumped','jumped','jumping'],
 ['a1','work','works','worked','worked','working'],['a1','live','lives','lived','lived','living'],['a1','cook','cooks','cooked','cooked','cooking'],['a1','walk','walks','walked','walked','walking'],['a1','study','studies','studied','studied','studying'],['a1','make','makes','made','made','making'],['a1','take','takes','took','taken','taking'],['a1','buy','buys','bought','bought','buying'],['a1','come','comes','came','come','coming'],['a1','get','gets','got','got','getting'],['a1','help','helps','helped','helped','helping'],['a1','finish','finishes','finished','finished','finishing'],['a1','watch','watches','watched','watched','watching'],
 ['a2','wait','waits','waited','waited','waiting'],['a2','choose','chooses','chose','chosen','choosing'],['a2','leave','leaves','left','left','leaving'],['a2','lose','loses','lost','lost','losing'],['a2','find','finds','found','found','finding'],['a2','forget','forgets','forgot','forgotten','forgetting'],['a2','write','writes','wrote','written','writing'],['a2','try','tries','tried','tried','trying'],['a2','feel','feels','felt','felt','feeling'],['a2','arrive','arrives','arrived','arrived','arriving'],
 ['b1','achieve','achieves','achieved','achieved','achieving'],['b1','improve','improves','improved','improved','improving'],['b1','repair','repairs','repaired','repaired','repairing'],['b1','deliver','delivers','delivered','delivered','delivering'],['b1','organise','organises','organised','organised','organising'],['b1','suggest','suggests','suggested','suggested','suggesting'],
 ['b2','maintain','maintains','maintained','maintained','maintaining'],['b2','persuade','persuades','persuaded','persuaded','persuading'],['b2','resolve','resolves','resolved','resolved','resolving'],['b2','negotiate','negotiates','negotiated','negotiated','negotiating'],
 ['c1','mitigate','mitigates','mitigated','mitigated','mitigating'],['c1','scrutinise','scrutinises','scrutinised','scrutinised','scrutinising'],['c1','undermine','undermines','undermined','undermined','undermining'],['c1','reconcile','reconciles','reconciled','reconciled','reconciling']
];
