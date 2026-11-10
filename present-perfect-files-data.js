/* Original everyday-life vignettes. Tickets/messages are recreated learning props. */
(() => {
  'use strict';
  window.PresentPerfectFileStories = [
    {
      id: 'unclaimed-roll', number: '01', title: 'The roll nobody collected',
      cover: ['the roll', 'nobody', 'collected.'], place: 'Porto, Portugal',
      date: '12 October 2026', shortDate: '12 OCT 2026', photo: 0,
      teaser: 'One second-hand camera. Twenty-two photographs. Someone else’s wedding.',
      note: 'Your weekend purchase has turned into a search for two strangers. Tell the story from the train journey to the news in this file.',
      details: [
        {id:'train',kind:'ticket',label:'Train ticket',heading:'Lisboa → Porto',date:'08 OCT 2026',eyebrow:'RAIL / SINGLE JOURNEY',code:'CP · 0810 · 07:15',rows:[['Departure','Lisboa · 07:15'],['Arrival','Porto · 10:05'],['Seat','Coach 3 / 24A'],['Fare','€19.50']],foot:'A long weekend. One small backpack.',word:'last Thursday'},
        {id:'market',kind:'receipt',label:'Market receipt',heading:'Friday finds',date:'09 OCT 2026',eyebrow:'FLEA MARKET / CASH SALE',code:'SALE 0048',rows:[['Used film camera','€18.00'],['Leather strap','included'],['Film inside','owner unknown'],['Total paid','€18.00']],foot:'The seller: “No idea what’s on that roll.”',word:'ever'},
        {id:'walk',kind:'photo',label:'Market photograph',heading:'Not another souvenir',date:'09 OCT 2026',photo:0,alt:'A second-hand film camera at a Porto flea market',notes:['Flea market, near the river','A camera instead of the usual postcard','No other film cameras in your collection'],word:'first'},
        {id:'lab',kind:'slip',label:'Lab envelope',heading:'Something survived',date:'10 OCT 2026',eyebrow:'FILM LAB / COLLECTION SLIP',code:'ROLL 22 / READY',rows:[['Frames recovered','22 of 24'],['Prints','ready for collection'],['Scan link','sent to your phone'],['Lab bill','€12.00']],foot:'Two empty frames. Twenty-two small pieces of somebody’s life.',word:'already'},
        {id:'wedding',kind:'photo',label:'Old photograph',heading:'The people in the pictures',date:'DATE ON FILM: 2001',photo:3,alt:'An old film photograph of a couple on a windy seaside promenade',notes:['A wedding by the sea','The same two people in sixteen photographs','No names on the envelope'],word:'never'},
        {id:'reply',kind:'message',label:'New message',heading:'A reply, at last',date:'TODAY · 12 OCT',eyebrow:'COMMUNITY GROUP / 09:42',sender:'Rita',message:'That’s my aunt and uncle! Their wedding, 2001. They thought the camera was gone forever. Can I put you in touch?',foot:'Your post: yesterday evening. This reply: a few minutes ago.',word:'just'},
        {id:'now',kind:'note',label:'Today’s note',heading:'Where things stand',date:'12 OCT 2026',eyebrow:'ON YOUR DESK / NOW',notes:['Camera on your shelf: from 9 October to today','Owner: found','Prints: still in your bag; not posted','The couple’s address: waiting for it'],word:'yet',extraWord:'since'}
      ]
    },
    {
      id:'dinosaur-night',number:'02',title:'A night under a dinosaur',
      cover:['a night', 'under a', 'dinosaur.'],place:'London, UK',
      date:'19 October 2026',shortDate:'19 OCT 2026',photo:1,
      teaser:'A sleeping bag, a museum after dark, and breakfast with people you met at midnight.',
      note:'You booked a museum sleepover instead of a hotel. Rebuild that night, then say what has stayed with you since.',
      details:[
        {id:'admission',kind:'ticket',label:'Admission ticket',heading:'After the doors close',date:'16 OCT 2026',eyebrow:'MUSEUM / ADULT SLEEPOVER',code:'ADMIT ONE · NIGHT 16/10',rows:[['Check-in','19:30'],['Bring','sleeping bag + toothbrush'],['Sleeping place','Dinosaur hall / D12'],['Checkout','17 October / 09:00']],foot:'Your first museum sleepover. Definitely not a normal hotel.',word:'ever'},
        {id:'packing',kind:'note',label:'Packing note',heading:'One slightly odd overnight bag',date:'16 OCT / 17:10',eyebrow:'PACKED / LEFT AT HOME',notes:['Sleeping bag, earplugs, warm socks: packed','Pillow: still on your sofa','Hotel reservation: none','Still on your wish list: a lighthouse sleepover'],word:'never'},
        {id:'hall',kind:'photo',label:'Midnight photograph',heading:'Your room for the night',date:'17 OCT / 00:18',photo:1,alt:'Sleeping bags beneath a dinosaur skeleton in a museum at night',notes:['Lights low; twenty sleeping bags','One enormous dinosaur overhead','Nobody getting much sleep'],word:'that night'},
        {id:'programme',kind:'slip',label:'Night programme',heading:'While the city sleeps',date:'16–17 OCT 2026',eyebrow:'FOLDED PROGRAMME / YOUR MARKS',code:'EVENING NOTES',rows:[['21:00','Torchlight tour — joined'],['23:15','Life drawing — tried'],['00:30','Ghost stories — missed'],['07:00','Breakfast — first in line']],foot:'One very bad dinosaur sketch, kept as a souvenir.',word:'already'},
        {id:'breakfast',kind:'photo',label:'Breakfast photograph',heading:'Coffee with the night shift',date:'17 OCT / 07:12',photo:4,alt:'Mugs and a croissant at a museum café after an overnight stay',notes:['Breakfast with two people from the next sleeping bags','Cold coffee, warm croissants','Contact names saved: Jo + Alex'],word:'met'},
        {id:'receipt',kind:'receipt',label:'Café receipt',heading:'The souvenir nobody planned',date:'17 OCT 2026',eyebrow:'MUSEUM CAFÉ / 08:03',code:'TABLE 04 · RECEIPT 117',rows:[['Coffee × 2','£6.40'],['Dinosaur postcard','£1.50'],['Extra croissant','£2.80'],['Total','£10.70']],foot:'Postcard to Mum: written. Stamp: bought. Postcard: still in your bag.',word:'yet'},
        {id:'group',kind:'message',label:'Group chat',heading:'Not just one night',date:'TODAY · 19 OCT',eyebrow:'“THE D12 CLUB” / 3 MEMBERS',sender:'Jo',message:'Two days since our museum breakfast! Photos from Alex: in the chat. Another strange overnight trip next month?',foot:'Group chat active from 17 October. Two voice notes each day. Next trip: not booked.',word:'since',extraWord:'for'}
      ]
    },
    {
      id:'cassette',number:'03',title:'The voice on the old tape',
      cover:['the voice', 'on the', 'old tape.'],place:'Bristol, UK',
      date:'26 October 2026',shortDate:'26 OCT 2026',photo:2,
      teaser:'One broken cassette player. A repair café. A voice your family thought was lost.',
      note:'You took an old cassette player to a volunteer repair café. Tell the story of the visit and what you and your family have done with the recording.',
      details:[
        {id:'travel',kind:'ticket',label:'Train ticket',heading:'Bath → Bristol',date:'24 OCT 2026',eyebrow:'RAIL / DAY RETURN',code:'24/10 · RETURN BEFORE MIDNIGHT',rows:[['Outward','09:12'],['In your bag','Grandma’s cassette player'],['Reason for trip','Repair café / 10:00'],['Return fare','£9.40']],foot:'A trip to fix a machine, not to buy a new one.',word:'on Saturday'},
        {id:'repair',kind:'slip',label:'Repair tag',heading:'A tiny belt. A big difference.',date:'24 OCT / 11:20',eyebrow:'VOLUNTEER REPAIR CAFÉ',code:'JOB 073 / WORKING AGAIN',rows:[['Problem','Motor turns; tape does not'],['Replaced','One rubber drive belt'],['Parts','£3.00'],['Volunteer time','Free / 45 minutes']],foot:'First repair-café visit. The volunteer refused a tip; you bought the tea.',word:'first'},
        {id:'bench',kind:'photo',label:'Workbench photograph',heading:'The patient on the table',date:'24 OCT / 10:47',photo:2,alt:'A cassette player being repaired on a volunteer workbench',notes:['Screws in a teacup','Old cassette already inside the player','Handwritten label: “Sunday / 1998”'],word:'already'},
        {id:'tape',kind:'note',label:'Listening notes',heading:'Not a blank tape',date:'24 OCT / 11:28',eyebrow:'FIRST LISTEN / SCRAP OF PAPER',notes:['00:04 — Grandma laughing','01:12 — her recipe for apple cake','04:30 — your dad, aged seven, asking for another slice','Recording forgotten in a drawer: twenty-eight years'],word:'never'},
        {id:'transfer',kind:'receipt',label:'Transfer receipt',heading:'From a tape to your phone',date:'24 OCT 2026',eyebrow:'AUDIO TRANSFER / DIGITAL COPY',code:'ORDER 052 / COLLECTED',rows:[['Cassette transferred','1'],['Audio recovered','18 minutes'],['Phone copies','You + Dad + Grandma'],['Total','£9.00']],foot:'Original tape in a paper envelope. Copies already in the family chat.',word:'just'},
        {id:'family',kind:'photo',label:'Kitchen photograph',heading:'A second listen',date:'25 OCT 2026',photo:5,alt:'An older woman holding a cassette with a younger relative beside her',notes:['Sunday, at Grandma’s kitchen table','Grandma listening twice; Dad once','The apple cake: baked together for the first time'],word:'twice'},
        {id:'today',kind:'message',label:'Message from Dad',heading:'The next little project',date:'TODAY · 26 OCT',eyebrow:'FAMILY CHAT / 08:16',sender:'Dad',message:'Third listen this morning! A whole box of tapes in the loft. Another listening session next weekend?',foot:'Player working from Saturday to today. More tapes: not checked. Original tape: not returned to the drawer.',word:'yet',extraWord:'since'}
      ]
    }
  ];
})();
