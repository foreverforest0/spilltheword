/* Recreated keepsakes, not real bookings or transactions. Source pixels stay intact. */
(() => {
  const paper = (id, kind, label, sheet, crop, word, transcript) => ({id, kind, label, sheet, crop, word, transcript});
  const photo = (id, label, frame, caption, word, alt) => ({id, kind:'photo', label, photo:frame, caption, word, alt});
  const pack = (name, rects) => (id, kind, label, n, word, transcript = '') => paper(id,kind,label,name,rects[n],word,transcript);
  const porto = pack('porto', [[20,150,560,270],[620,25,300,485],[950,145,585,285],[15,635,555,300],[615,525,305,490],[1020,525,465,460]]);
  const london = pack('london', [[10,120,505,345],[620,10,290,495],[1015,135,515,315],[5,635,505,315],[620,520,290,500],[1040,540,460,440]]);
  const bristol = pack('bristol', [[20,125,505,315],[610,5,305,500],[1000,120,530,325],[10,630,525,320],[605,520,325,500],[1045,550,450,455]]);
  window.PresentPerfectFileStories = [
    {id:'unclaimed-roll', number:'01', title:'The roll nobody collected', place:'Porto, Portugal', shortDate:'12 OCT 2026', photo:0, color:'sand',
      premise:'A second-hand camera still held a roll of someone else’s wedding photographs. Tell the story of finding it and what has happened since. You can invent the missing connections.',
      details:[
        porto('train','ticket','Train ticket',0,'last Thursday','Lisboa to Porto, 8 October 2026, 07:15, seat 24A, €19.50.'),
        porto('market','receipt','Market receipt',1,'ever','Mercado do Sol, Porto. Film camera, 9 October 2026. Total €18.00.'),
        porto('museum','ticket','Museum ticket',2,'been','Photo Museum, Porto, 10 October 2026. One admission, €8.00.'),
        porto('concert','ticket','Concert ticket',3,'that evening','Ribeira Sessions, live music, 9 October 2026, 20:30, €12.00.'),
        porto('lab','receipt','Film lab receipt',4,'already','Film Lab, 10 October 2026. Develop and scan, €12.00.'),
        porto('now','note','Small blank note',5,'yet'),
        photo('walk','Market photograph',0,'A lucky find by the river','first','A second-hand camera held at a Porto flea market.'),
        photo('wedding','Old wedding photograph',3,'A wedding, summer 2001','never','A couple on a windy seaside promenade in an old film photograph.')
      ]},
    {id:'dinosaur-night', number:'02', title:'A night under a dinosaur', place:'London, UK', shortDate:'19 OCT 2026', photo:1, color:'blue',
      premise:'A museum sleepover instead of a hotel. Tell the story of that weekend and what has stayed with you since. The keepsakes leave room for your own version.',
      details:[
        london('travel','ticket','Day travel ticket',0,'on Friday','London day travel, 16 October 2026. £9.10.'),
        london('receipt','receipt','Café receipt',1,'yet','Museum Café, 17 October 2026. Two coffees £6.40, postcard £1.50, croissant £2.80. Total £10.70.'),
        london('admission','ticket','Museum sleepover ticket',2,'ever','After Hours museum sleepover. 16 October 2026, 19:30, hall D12. One admission.'),
        london('concert','ticket','Concert ticket',3,'also','Late Night Quartet, London, 17 October 2026, 18:30. Row B, seat 12.'),
        london('shop','receipt','Museum shop receipt',4,'just','Museum shop, 17 October 2026. Postcard £1.50, stamp £1.10. Total £2.60.'),
        london('packing','note','Small blank note',5,'since'),
        photo('hall','Midnight photograph',1,'After the doors closed','never','Sleeping bags beneath a dinosaur skeleton in a museum at night.'),
        photo('breakfast','Breakfast photograph',4,'Saturday, 7:12 a.m.','met','Two mugs and a croissant at a museum café after an overnight stay.')
      ]},
    {id:'cassette', number:'03', title:'The voice on the old tape', place:'Bristol, UK', shortDate:'26 OCT 2026', photo:2, color:'wine',
      premise:'An old cassette player, a volunteer repair café and a family voice thought lost. Reconstruct the weekend and what you have done with the recording since. Invent the connections that the papers cannot show.',
      details:[
        bristol('travel','ticket','Train ticket',0,'on Saturday','Bath to Bristol, 24 October 2026, 09:12. Day return £9.40.'),
        bristol('repair','receipt','Repair café receipt',1,'first','Repair Café, Bristol, 24 October 2026. Drive belt £3.00, labour free. Total £3.00.'),
        bristol('museum','ticket','Sound museum ticket',2,'been','Sound Museum, Bristol, 24 October 2026, 14:00. One admission, £8.00.'),
        bristol('concert','ticket','Live session ticket',3,'that evening','Sunday Tapes, Bristol, 25 October 2026, 19:00. £18.00.'),
        bristol('shop','receipt','Record shop receipt',4,'already','The Record Room, 24 October 2026. Used cassette £4.00, blank tape £2.50. Total £6.50.'),
        bristol('tape','note','Small blank note',5,'just'),
        photo('bench','Workbench photograph',2,'Saturday, at the repair café','never','A cassette player being repaired, with screws and tools on a workbench.'),
        photo('family','Kitchen photograph',5,'A second listen at Grandma’s','twice','An older woman holding a cassette beside a younger relative.')
      ]}
  ];
})();
