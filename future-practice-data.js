/* Real identities; authored practice timetables, not live availability. */
(()=>{
 'use strict';
 const tickets=[];
 function ticket(id,kind,title,venue,city,verb,time,extra,source){tickets.push({id,kind,title,venue,city,verb,time,extra,source})}
 ticket('cinema-budapest','cinema','The Grand Budapest Hotel','Prince Charles Cinema','London','starts','19:40','Screen 1 · Seat G12','https://princecharlescinema.com/');
 ticket('cinema-paddington','cinema','Paddington 2','BFI Southbank','London','starts','17:30','NFT1 · Seat E08','https://www.bfi.org.uk/bfi-southbank');
 ticket('cinema-spirited','cinema','Spirited Away','Film Forum','New York','starts','18:15','Screen 2 · Seat C06','https://filmforum.org/');
 ticket('cinema-future','cinema','Back to the Future','Prince Charles Cinema','London','finishes','21:45','Screen 1 · Seat F10','https://princecharlescinema.com/');
 ticket('park-disney','park','Disneyland Park','Disneyland Paris','Marne-la-Vallée','opens','09:30','One-day park entry','https://www.disneylandparis.com/');
 ticket('park-tivoli','park','Tivoli Gardens','Tivoli Gardens','Copenhagen','opens','11:00','Gardens admission','https://www.tivoli.dk/');
 ticket('park-europa','park','Europa-Park','Europa-Park','Rust','closes','18:00','One-day park entry','https://www.europapark.de/');
 ticket('museum-louvre','museum','The Louvre','Louvre Museum','Paris','opens','09:00','Museum admission · Porte des Lions','https://www.louvre.fr/');
 ticket('museum-british','museum','The British Museum','The British Museum','London','closes','17:00','Museum visit · Great Russell Street','https://www.britishmuseum.org/');
 ticket('museum-vangogh','museum','The Van Gogh Museum','Van Gogh Museum','Amsterdam','opens','09:00','Museum admission · Museumplein','https://www.vangoghmuseum.nl/');
 ticket('museum-prado','museum','The Prado Museum','Museo del Prado','Madrid','closes','20:00','Museum admission · Paseo del Prado','https://www.museodelprado.es/');
 ticket('train-london','train','Eurostar','London St Pancras → Paris Gare du Nord','London','leaves','09:31','Coach 07 · Seat 42 · Departure: London','https://www.eurostar.com/');
 ticket('train-paris','train','Eurostar','Paris Gare du Nord → London St Pancras','London','arrives','12:30','Coach 04 · Seat 18 · Arrival: London','https://www.eurostar.com/');
 ticket('train-italo','train','Italo','Roma Termini → Firenze Santa Maria Novella','Rome','leaves','10:20','Coach 03 · Seat 12 · Departure: Rome','https://www.italotreno.com/');
 ticket('flight-ba','flight','British Airways','London Heathrow → Rome Fiumicino','London','departs','08:45','Economy · Seat 18A · Departure: London','https://www.britishairways.com/');
 ticket('flight-klm','flight','KLM','Amsterdam Schiphol → Berlin Brandenburg','Berlin','arrives','14:10','Economy · Seat 12F · Arrival: Berlin','https://www.klm.com/');
 ticket('flight-tap','flight','TAP Air Portugal','Lisbon Humberto Delgado → Madrid Barajas','Lisbon','departs','16:25','Economy · Seat 09A · Departure: Lisbon','https://www.flytap.com/');
 ticket('theatre-lion','theatre','The Lion King','Lyceum Theatre','London','starts','19:30','Stalls · Row G · Seat 14','https://www.thelionking.co.uk/');
 ticket('theatre-wicked','theatre','Wicked','Apollo Victoria Theatre','London','starts','14:30','Circle · Row C · Seat 08','https://www.wickedthemusical.co.uk/');
 ticket('theatre-hamilton','theatre','Hamilton','Victoria Palace Theatre','London','finishes','22:15','Royal Circle · Row E · Seat 10','https://hamiltonmusical.com/london/');
 ticket('boat-thames','boat','Uber Boat by Thames Clippers','Westminster Pier → Tower Pier','London','leaves','10:40','River journey · Departure: Westminster Pier','https://www.thamesclippers.com/');
 ticket('boat-amsterdam','boat','Canal cruise','Stromma Amsterdam','Amsterdam','starts','15:15','Canal cruise · Central Station area','https://www.stromma.com/en-nl/amsterdam/');
 ticket('zoo-london','zoo','London Zoo','London Zoo','London','opens','10:00','Zoo admission · Regent’s Park','https://www.londonzoo.org/');
 ticket('zoo-prague','zoo','Prague Zoo','Prague Zoo','Prague','closes','18:00','Zoo admission · U Trojského zámku','https://www.zoopraha.cz/en');
 ticket('aquarium-lisbon','aquarium','Oceanário de Lisboa','Oceanário de Lisboa','Lisbon','opens','10:00','Aquarium admission · Parque das Nações','https://www.oceanario.pt/');
 ticket('aquarium-barcelona','aquarium','L’Aquàrium de Barcelona','L’Aquàrium de Barcelona','Barcelona','closes','20:00','Aquarium admission · Port Vell','https://www.aquariumbcn.com/');
 ticket('tour-wembley','tour','Wembley Stadium tour','Wembley Stadium','London','starts','11:30','Guided stadium tour','https://www.wembleystadium.com/');
 ticket('tour-globe','tour','Shakespeare’s Globe tour','Shakespeare’s Globe','London','starts','13:45','Guided theatre tour · Bankside','https://www.shakespearesglobe.com/');
 const banks={};
 function bank(key,title,lines){banks[key]={title,items:lines.trim().split('\n').map((line,i)=>{const [context,prompt,answers,hint='']=line.split(' | ');if(!context||!prompt||!answers)throw Error('Incomplete future task '+key+i);return {id:key+'_'+i,context,prompt,hint,answers:answers.split(' ~ ')}})}}
 bank('will','Future Simple / will',`
Your friend is carrying a heavy box. You decide to help now. | Offer to carry the box. | I will carry the box for you. ~ I’ll carry the box for you. | Use will.
You have just chosen soup from the menu. | Tell the waiter your choice. | I will have the soup. ~ I’ll have the soup. | Use will and have.
Anna asks you not to tell anyone her secret. | Promise to keep it. | I will not tell anyone your secret. | Start with I will not.
Your friend asks for your notes. You agree. | Promise to send them tonight. | I will send you my notes tonight. ~ I’ll send you my notes tonight. | Use will.
You think Mia’s new café has a bright future. | Predict success. | I think Mia’s new café will be successful. | Use I think and will.
You believe it probably will not rain tomorrow. | Make a prediction. | It will probably not rain tomorrow. | Use probably and will not.
Ben is free tomorrow. You want his help. | Ask him to help you tomorrow. | Will you help me tomorrow? | Start with Will you.
The answer is: Yes, I will call you tonight. | Ask about calling you tonight. | Will you call me tonight? | Start with Will you.
Your friend asks: Will Mia join us? You know she will. | Give a short positive answer. | Yes, she will. | Use Yes / No + the subject + will / won’t.
Your friend asks: Will they be late? You know they will not. | Give a short negative answer. | No, they will not. ~ No, they won’t. | Use Yes / No + the subject + will / won’t.
The phone rings. You decide to answer it. | Say what you will do. | I will answer the phone. ~ I’ll answer the phone. | Use answer.
Ben refuses to lend you his bike. | Report his refusal. | Ben will not lend me his bike. ~ Ben won’t lend me his bike. | Use Ben and will not.
`);
 bank('going','Be going to',`
Mia decided last week to learn Spanish. | State her intention. | Mia is going to learn Spanish. | Use going to and learn Spanish.
You have planned to visit Rome next month. | Describe your plan. | I am going to visit Rome next month. ~ I’m going to visit Rome next month. | Use going to.
The cup is right on the edge and is tipping over. | Predict what is about to happen. | The cup is going to fall. | Use the cup, going to and fall.
Look at the dark rain clouds above us. | Make a prediction. | It is going to rain. ~ It’s going to rain. | Use going to and rain.
Ben has decided not to buy a new phone. | State his decision. | Ben is not going to buy a new phone. ~ Ben isn’t going to buy a new phone. | Use going to.
We have decided to stay at home tonight. | Say that we have no plan to go out tonight. | We are not going to go out tonight. ~ We aren’t going to go out tonight. | Use going to.
The answer is: Anna is going to study in Berlin. | Ask about the city. | Where is Anna going to study? | Start with Where is Anna.
The answer is: I am going to leave on Friday. | Ask about the day. | When are you going to leave? | Start with When are you.
Ben is going to cook dinner tonight. | Make a yes/no question about Ben’s plan. | Is Ben going to cook dinner tonight? | Start with Is Ben + going to + the base verb.
Your friend asks: Are they going to move? Their plan is confirmed. | Give a short positive answer. | Yes, they are. | Use Yes / No + the subject + am / is / are (not).
Your friend asks: Is she going to drive? She has no plan to drive. | Give a short negative answer. | No, she is not. ~ No, she isn’t. | Use Yes / No + the subject + am / is / are (not).
These words contain one error: She going to pack her bag. | Write the corrected sentence. | She is going to pack her bag. | Use am / is / are + going to + the base verb.
`);
 bank('continuous','Future Continuous',`
Tomorrow, Mia’s flight lasts from 9 am to noon. | Say what she will be doing at ten. Use fly. | Mia will be flying at ten tomorrow. ~ She will be flying at ten tomorrow.
Ben works from 2 pm to 6 pm tomorrow. | Describe his activity at four tomorrow. Use work. | Ben will be working at four tomorrow. ~ He will be working at four tomorrow.
You are on a train from 8 pm to midnight tomorrow. | Describe your activity at nine tomorrow evening. Use travel by train. | I will be travelling by train at nine tomorrow evening. ~ I will be traveling by train at nine tomorrow evening.
Mia’s class ends at 5 pm tomorrow. She is free at six. | Say she will not be studying at six tomorrow. | Mia will not be studying at six tomorrow. ~ She won’t be studying at six tomorrow.
The answer is: Ben will be cooking at seven tomorrow. | Ask about his activity. Start with What will Ben. | What will Ben be doing at seven tomorrow?
The answer is: Mia will be working at home tomorrow morning. | Ask about the place. Start with Where will Mia. | Where will Mia be working tomorrow morning?
You want to know if Anna plans to use the car tonight. | Ask politely with the Future Continuous. Start with Will you. | Will you be using the car tonight?
Will they be waiting at the station at ten? Yes. | Give a short positive answer. | Yes, they will.
This sentence contains one error: She will studying at eight tomorrow. | Write the corrected sentence. | She will be studying at eight tomorrow.
Mia studies from 7 to 9 tomorrow; Ben cooks from 7 to 8. | Describe both activities at half past seven. Use and. | Mia will be studying and Ben will be cooking at half past seven tomorrow.
`);
 bank('perfect','Future Perfect',`
Mia plans to finish the report before Friday. | Describe the completed result by Friday. Use the Future Perfect. | Mia will have finished the report by Friday.
The train arrives at noon tomorrow. | Describe its completed arrival by one tomorrow. Use arrive. | The train will have arrived by one tomorrow.
Ben plans to read three chapters before six tomorrow. | State the completed amount by six. Use the Future Perfect. | Ben will have read three chapters by six tomorrow.
The bridge will still be unfinished at the end of June. | Say it will not be completed by July. Use they and finish. | They will not have finished the bridge by July. ~ They won’t have finished the bridge by July.
The answer is: Mia will have packed her suitcase by eight. | Ask what she will have packed by eight. Start with What. | What will Mia have packed by eight?
The answer is: Ben will have finished the course by December. | Ask about the deadline. Start with By when. | By when will Ben have finished the course?
Will she have arrived by noon? Yes. | Give a short positive answer. | Yes, she will.
Will they have finished by Friday? No. | Give a short negative answer. | No, they will not. ~ No, they won’t.
This sentence contains one error: She will have wrote the email by six. | Write the corrected sentence. | She will have written the email by six.
Next June marks ten years since Mia first met Ben. | Say how long she will have known him. Use the Future Perfect. | Mia will have known Ben for ten years by next June.
`);
 bank('perfectcontinuous','Future Perfect Continuous',`
Ben starts studying at 8 am tomorrow and continues until noon. | Describe the accumulated duration by 11 am. Use study. | By eleven tomorrow, Ben will have been studying for three hours.
Mia started work here in January. Next January marks one year. | State the duration by next January. Use work here. | By next January, Mia will have been working here for a year.
Tomorrow’s walk starts at nine and ends at one. | State how long we will have been walking by noon. | By noon tomorrow, we will have been walking for three hours.
Ben starts training in June. In August, only two months will have passed. | Say he will not have been training for three months by August. | Ben will not have been training for three months by August.
The answer is: By June, Mia will have been teaching here for five years. | Ask about the duration. Start with How long. Keep by June. | How long will Mia have been teaching here by June?
The answer is: By noon, Ben will have been driving for two hours. | Ask if he will have been driving for two hours by noon. Start with Will Ben. | Will Ben have been driving for two hours by noon?
Will she have been working here for a year by Friday? Yes. | Give a short positive answer. | Yes, she will.
Will they have been travelling for a month by June? No. | Give a short negative answer. | No, they will not. ~ No, they won’t.
This sentence contains one error: By noon, I will have been wait for two hours. | Write the corrected sentence. | By noon, I will have been waiting for two hours.
Next month, Anna completes her tenth year of running this café. | Describe the duration of this activity by next month. Use run. | By next month, Anna will have been running this café for ten years.
`);
 window.FuturePracticeData={tickets,banks,printerSound:'assets/timetable/printer.mp3',printerDurationMS:1593};
})();
