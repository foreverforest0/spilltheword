/* Original sentences built with vocabulary from the user's B2 ALH course. */
(()=>{
 const rows=[];
 const person=['It was … who / that …','… was the person who …'];
 const thing=['… was what …','What … was …','It was … that …'];
 const time=['It was … that …'];
 const action=['What … did was …'];
 function add(id,sentence,vocabulary,focus){rows.push({id,sentence,vocabulary,focus:focus.map(([phrase,starters,answers])=>({phrase,starters,answers}))})}
 add('hangout','My oldest friend suggested a low-key hangout after a week of endless micro-obligations.',['low-key hangout','endless micro-obligations'],[
  ['My oldest friend',person,['My oldest friend was the person who suggested a low-key hangout after a week of endless micro-obligations.','It was my oldest friend who suggested a low-key hangout after a week of endless micro-obligations.']],
  ['a low-key hangout',thing,['A low-key hangout was what my oldest friend suggested after a week of endless micro-obligations.','What my oldest friend suggested after a week of endless micro-obligations was a low-key hangout.']],
  ['after a week of endless micro-obligations',time,['It was after a week of endless micro-obligations that my oldest friend suggested a low-key hangout.']]
 ]);
 add('notifications','A constant stream of notifications kept me tethered to my phone throughout our anniversary dinner.',['a constant stream of','tethered to'],[
  ['A constant stream of notifications',thing,['A constant stream of notifications was what kept me tethered to my phone throughout our anniversary dinner.','What kept me tethered to my phone throughout our anniversary dinner was a constant stream of notifications.']],
  ['kept me tethered to my phone',action,['What a constant stream of notifications did throughout our anniversary dinner was keep me tethered to my phone.']],
  ['throughout our anniversary dinner',time,['It was throughout our anniversary dinner that a constant stream of notifications kept me tethered to my phone.']]
 ]);
 add('subscriptions','Nora spotted the subscription creep while canceling the subscriptions she had forgotten about.',['subscription creep','canceling the subscriptions'],[
  ['Nora',person,['Nora was the person who spotted the subscription creep while canceling the subscriptions she had forgotten about.','It was Nora who spotted the subscription creep while canceling the subscriptions she had forgotten about.']],
  ['the subscription creep',thing,['The subscription creep was what Nora spotted while canceling the subscriptions she had forgotten about.','What Nora spotted while canceling the subscriptions she had forgotten about was the subscription creep.']],
  ['while canceling the subscriptions she had forgotten about',time,['It was while canceling the subscriptions she had forgotten about that Nora spotted the subscription creep.']]
 ]);
 add('compost','My sleep-deprived flatmate built a compost heap from scratch instead of finishing his job application.',['sleep-deprived','compost heap','from scratch'],[
  ['My sleep-deprived flatmate',person,['It was my sleep-deprived flatmate who built a compost heap from scratch instead of finishing his job application.','My sleep-deprived flatmate was the person who built a compost heap from scratch instead of finishing his job application.']],
  ['a compost heap',thing,['A compost heap was what my sleep-deprived flatmate built from scratch instead of finishing his job application.','What my sleep-deprived flatmate built from scratch instead of finishing his job application was a compost heap.']],
  ['built a compost heap from scratch',action,['Instead of finishing his job application, what my sleep-deprived flatmate did was build a compost heap from scratch.']]
 ]);
 add('lightbulb','I got sidetracked by a bizarre conspiracy theory while looking for an energy-efficient lightbulb.',['to get sidetracked','bizarre','energy-efficient lightbulb'],[
  ['a bizarre conspiracy theory',thing,['A bizarre conspiracy theory was what I got sidetracked by while looking for an energy-efficient lightbulb.','What I got sidetracked by while looking for an energy-efficient lightbulb was a bizarre conspiracy theory.']],
  ['while looking for an energy-efficient lightbulb',time,['It was while looking for an energy-efficient lightbulb that I got sidetracked by a bizarre conspiracy theory.']],
  ['an energy-efficient lightbulb',thing,['An energy-efficient lightbulb was what I was looking for when I got sidetracked by a bizarre conspiracy theory.','What I was looking for when I got sidetracked by a bizarre conspiracy theory was an energy-efficient lightbulb.']]
 ]);
 add('detox','At a ridiculously expensive wellness retreat, Leo finally gave himself permission to do without his smartphone.',['ridiculously','wellness','smartphone','do without'],[
  ['At a ridiculously expensive wellness retreat',time,['It was at a ridiculously expensive wellness retreat that Leo finally gave himself permission to do without his smartphone.']],
  ['Leo',person,['It was Leo who finally gave himself permission to do without his smartphone at a ridiculously expensive wellness retreat.','Leo was the person who finally gave himself permission to do without his smartphone at a ridiculously expensive wellness retreat.']],
  ['permission to do without his smartphone',thing,['Permission to do without his smartphone was what Leo finally gave himself at a ridiculously expensive wellness retreat.','What Leo finally gave himself at a ridiculously expensive wellness retreat was permission to do without his smartphone.']]
 ]);
 add('scrolling','After our last-minute digital detox, the most down-to-earth person in the office admitted that she missed scrolling online.',['last-minute','digital detox','down-to-earth','scrolling online'],[
  ['After our last-minute digital detox',time,['It was after our last-minute digital detox that the most down-to-earth person in the office admitted that she missed scrolling online.']],
  ['the most down-to-earth person in the office',person,['It was the most down-to-earth person in the office who admitted that she missed scrolling online after our last-minute digital detox.']],
  ['scrolling online',thing,['Scrolling online was what the most down-to-earth person in the office admitted that she missed after our last-minute digital detox.','What the most down-to-earth person in the office admitted that she missed after our last-minute digital detox was scrolling online.']]
 ]);
 add('pep-talk','A five-minute pep talk from my sister gave me the courage to give the part-time job a shot.',['pep talk','give it a shot','part-time job'],[
  ['A five-minute pep talk from my sister',thing,['A five-minute pep talk from my sister was what gave me the courage to give the part-time job a shot.','What gave me the courage to give the part-time job a shot was a five-minute pep talk from my sister.']],
  ['the courage to give the part-time job a shot',thing,['The courage to give the part-time job a shot was what a five-minute pep talk from my sister gave me.','What a five-minute pep talk from my sister gave me was the courage to give the part-time job a shot.']]
 ]);
 window.CleftFocusData={version:1,course:'b2alh',rows};
})();
