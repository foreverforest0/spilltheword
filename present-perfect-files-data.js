/* Recreated keepsakes, not real bookings or transactions. Source pixels stay intact. */
(() => {
  const paper = (id, kind, label, sheet, crop, word, transcript) => ({id, kind, label, sheet, crop, word, transcript});
  const photo = (id, label, frame, caption, word, alt) => ({id, kind:'photo', label, photo:frame, caption, word, alt});
  const pack = (name, rects) => (id, kind, label, n, word, transcript = '') => paper(id,kind,label,name,rects[n],word,transcript);
  const porto = pack('porto', [[20,150,560,270],[620,25,300,485],[950,145,585,285],[15,635,555,300],[615,525,305,490],[1020,525,465,460]]);
  const london = pack('london', [[10,120,505,345],[620,10,290,495],[1015,135,515,315],[5,635,505,315],[620,520,290,500],[1040,540,460,440]]);
  const bristol = pack('bristol', [[20,125,505,315],[610,5,305,500],[1000,120,530,325],[10,630,525,320],[605,520,325,500],[1045,550,450,455]]);
  const extras = {
    porto:[[0,150,620,385],[625,55,620,560],[65,635,500,600],[625,785,620,335]],
    london:[[0,135,625,395],[630,180,620,305],[0,675,620,555],[635,725,615,465]],
    bristol:[[0,110,630,420],[630,75,615,450],[80,620,480,610],[640,620,560,605]]
  };
  const extra = (sheet, n, id, kind, label, word, transcript='') => ({
    id,kind,label,word,transcript,source:sheet+'-extras.png',size:[1254,1254],crop:extras[sheet][n]
  });
  window.PresentPerfectFileStories = [
    {id:'unclaimed-roll', number:'01', title:'The roll nobody collected', place:'Porto, Portugal', shortDate:'12 OCT 2026', photo:0, color:'sand',
      premise:'A second-hand camera still held a roll of someone else’s wedding photographs. Tell the story of finding it and what has happened since. You can invent the missing connections.',
      details:[
        porto('train','ticket','Train ticket',0,'last Thursday','Lisboa to Porto, 8 October 2026, 07:15, seat 24A, €19.50.'),
        porto('market','receipt','Market receipt',1,'ever','Mercado do Sol, Porto. Film camera, 9 October 2026. Total €18.00.'),
        extra('porto',0,'museum','ticket','Anne Frank House ticket','been','Saved ticket from an earlier trip. Anne Frank House, Amsterdam, 6 September 2026, 10:15. One admission.'),
        porto('concert','ticket','Concert ticket',3,'that evening','Ribeira Sessions, live music, 9 October 2026, 20:30, €12.00.'),
        porto('lab','receipt','Film lab receipt',4,'already','Film Lab, 10 October 2026. Develop and scan, €12.00.'),
        {...porto('now','note','A reminder for Beth',5,'yet'),note:"Don't forget Beth's keychain!"},
        photo('walk','Market photograph',0,'A lucky find by the river','first','A second-hand camera held at a Porto flea market.'),
        photo('wedding','Old wedding photograph',3,'A wedding, summer 2001','never','A couple on a windy seaside promenade in an old film photograph.'),
        extra('porto',1,'earbuds','object','Wired headphones','forgotten','A pair of wired headphones, loosely coiled.'),
        extra('porto',2,'pocketbook','object','Pocket notebook','written','A closed blue spiral pocket notebook.'),
        extra('porto',3,'wrapper','object','Sweet wrapper','already','A crumpled burgundy sweet wrapper.')
      ]},
    {id:'dinosaur-night', number:'02', title:'A night under a dinosaur', place:'London, UK', shortDate:'19 OCT 2026', photo:1, color:'blue',
      premise:'A museum sleepover instead of a hotel. Tell the story of that weekend and what has stayed with you since. The keepsakes leave room for your own version.',
      details:[
        london('travel','ticket','Day travel ticket',0,'on Friday','London day travel, 16 October 2026. £9.10.'),
        london('receipt','receipt','Café receipt',1,'yet','Museum Café, 17 October 2026. Two coffees £6.40, postcard £1.50, croissant £2.80. Total £10.70.'),
        london('admission','ticket','Museum sleepover ticket',2,'ever','After Hours museum sleepover. 16 October 2026, 19:30, hall D12. One admission.'),
        extra('london',0,'concert','ticket','LEGOLAND Windsor ticket','before','Saved ticket from an earlier trip. LEGOLAND Windsor, 23 August 2026. One-day admission.'),
        london('shop','receipt','Museum shop receipt',4,'just','Museum shop, 17 October 2026. Postcard £1.50, stamp £1.10. Total £2.60.'),
        {...london('packing','note','A reminder for Mum',5,'since'),note:"Post Mum's postcard. Ask Jo for the photos."},
        photo('hall','Midnight photograph',1,'After the doors closed','never','Sleeping bags beneath a dinosaur skeleton in a museum at night.'),
        photo('breakfast','Breakfast photograph',4,'Saturday, 7:12 a.m.','met','Two mugs and a croissant at a museum café after an overnight stay.'),
        extra('london',1,'sunglasses','object','Sunglasses','lost','A pair of folded burgundy sunglasses.'),
        extra('london',2,'citymap','object','Folded map','found','A folded paper city map.'),
        extra('london',3,'mints','object','Mint tin','yet','A small blue tin of mints.')
      ]},
    {id:'cassette', number:'03', title:'The voice on the old tape', place:'Bristol, UK', shortDate:'26 OCT 2026', photo:2, color:'wine',
      premise:'An old cassette player, a volunteer repair café and a family voice thought lost. Reconstruct the weekend and what you have done with the recording since. Invent the connections that the papers cannot show.',
      details:[
        bristol('travel','ticket','Train ticket',0,'on Saturday','Bath to Bristol, 24 October 2026, 09:12. Day return £9.40.'),
        bristol('repair','receipt','Repair café receipt',1,'first','Repair Café, Bristol, 24 October 2026. Drive belt £3.00, labour free. Total £3.00.'),
        extra('bristol',0,'museum','ticket','Disneyland Paris ticket','been','Saved ticket from an earlier trip. Disneyland Paris, 12 September 2026. One day, one park. One admission.'),
        bristol('concert','ticket','Live session ticket',3,'that evening','Sunday Tapes, Bristol, 25 October 2026, 19:00. £18.00.'),
        bristol('shop','receipt','Record shop receipt',4,'already','The Record Room, 24 October 2026. Used cassette £4.00, blank tape £2.50. Total £6.50.'),
        {...bristol('tape','note','A reminder for Dad',5,'just'),note:"Bring Dad's headphones. Check the tapes."},
        photo('bench','Workbench photograph',2,'Saturday, at the repair café','never','A cassette player being repaired, with screws and tools on a workbench.'),
        photo('family','Kitchen photograph',5,'A second listen at Grandma’s','twice','An older woman holding a cassette beside a younger relative.'),
        extra('bristol',1,'cassette-tape','object','Cassette tape','heard','An unlabelled blue cassette tape.'),
        extra('bristol',2,'notebook','object','Green notebook','kept','A small closed green notebook with an orange band.'),
        extra('bristol',3,'tea','object','Tea packet','made','A crinkled packet of tea with a blank tag.')
      ]}
  ];
})();
