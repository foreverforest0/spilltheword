/* B1 parcel collections. Label stories are fictional, not product-origin claims. */
(() => {
 const whose = [
  [0,'synthesizer','This synthesizer belongs to a musician.','Her band is playing tonight.','This synthesizer belongs to a musician whose band is playing tonight'],
  [1,'camera','This camera belongs to a student.','His photos are in the school magazine.','This camera belongs to a student whose photos are in the school magazine'],
  [2,'trainers','These trainers belong to a runner.','Her next race is on Sunday.','These trainers belong to a runner whose next race is on Sunday'],
  [3,'skateboard','This skateboard belongs to a neighbour.','His sister teaches me Spanish.','This skateboard belongs to a neighbour whose sister teaches me Spanish'],
  [4,'controller','This controller belongs to a friend.','Her console stopped working yesterday.','This controller belongs to a friend whose console stopped working yesterday'],
  [5,'bag','This bag belongs to a designer.','His shop has just opened.','This bag belongs to a designer whose shop has just opened'],
  [6,'lamp','This lamp belongs to a writer.','Her desk is next to the window.','This lamp belongs to a writer whose desk is next to the window'],
  [7,'cassette player','This cassette player belongs to a DJ.','His real name is Alex.','This cassette player belongs to a DJ whose real name is Alex'],
  [8,'mug','This mug belongs to a teacher.','Her students love making videos.','This mug belongs to a teacher whose students love making videos'],
  [12,'coffee','This coffee is for a colleague.','His train was late this morning.','This coffee is for a colleague whose train was late this morning'],
  [13,'phone','This phone belongs to a student.','Her project is about AI.','This phone belongs to a student whose project is about AI'],
  [14,'e-reader','This e-reader belongs to a traveller.','His backpack is always full of books.','This e-reader belongs to a traveller whose backpack is always full of books'],
  [15,'tote bag','This tote bag belongs to a neighbour.','Her dog comes to work with her.','This tote bag belongs to a neighbour whose dog comes to work with her'],
  [16,'glasses','These glasses belong to a chef.','His restaurant is round the corner.','These glasses belong to a chef whose restaurant is round the corner'],
  [17,'notebook','This notebook belongs to an artist.','Her drawings cover the kitchen wall.','This notebook belongs to an artist whose drawings cover the kitchen wall']
 ];
 const passive = [
  [0,'synthesizer','The technician repaired this synthesizer yesterday.','This synthesizer','repair · yesterday','This synthesizer was repaired yesterday','past'],
  [1,'camera','The shop checks this camera before every rental.','This camera','check · before every rental','This camera is checked before every rental','present'],
  [2,'trainers','The company makes these trainers in small batches.','These trainers','make · in small batches','These trainers are made in small batches','present'],
  [3,'skateboard','A local artist painted this skateboard last month.','This skateboard','paint · last month','This skateboard was painted last month','past'],
  [4,'controller','The seller tested this controller before shipping it.','This controller','test · before shipping','This controller was tested before shipping','past'],
  [5,'bag','The studio makes this bag by hand.','This bag','make · by hand','This bag is made by hand','present'],
  [6,'lamp','The courier delivered this lamp on Monday.','This lamp','deliver · on Monday','This lamp was delivered on Monday','past'],
  [7,'cassette player','The repair shop cleaned this cassette player last week.','This cassette player','clean · last week','This cassette player was cleaned last week','past'],
  [8,'mug','A potter made this mug in Portugal in 2022.','This mug','make · in Portugal · in 2022','This mug was made in Portugal in 2022','past'],
  [9,'keyboard','The warehouse packed this keyboard this morning.','This keyboard','pack · this morning','This keyboard was packed this morning','past'],
  [10,'chess piece','The designer printed this chess piece in three hours.','This chess piece','print · in three hours','This chess piece was printed in three hours','past'],
  [11,'decoration','The organisers use this decoration at every party.','This decoration','use · at every party','This decoration is used at every party','present'],
  [12,'coffee','The cafe serves this coffee with oat milk.','This coffee','serve · with oat milk','This coffee is served with oat milk','present'],
  [14,'e-reader','The book club lends this e-reader to new members.','This e-reader','lend · to new members','This e-reader is lent to new members','present'],
  [15,'tote bag','The shop sells this tote bag online.','This tote bag','sell · online','This tote bag is sold online','present'],
  [16,'glasses','The optician adjusted these glasses yesterday.','These glasses','adjust · yesterday','These glasses were adjusted yesterday','past'],
  [17,'notebook','The studio makes this notebook from recycled paper.','This notebook','make · from recycled paper','This notebook is made from recycled paper','present'],
  [18,'bottle','The company sells this bottle in three sizes.','This bottle','sell · in three sizes','This bottle is sold in three sizes','present'],
  [19,'headphones','The technician tested these headphones last Friday.','These headphones','test · last Friday','These headphones were tested last Friday','past'],
  [20,'photo printer','The library uses this photo printer for workshops.','This photo printer','use · for workshops','This photo printer is used for workshops','present']
 ];
 const build=(r,type)=>({art:r[0],n:r[1],im:'unbox-find-'+r[0],a:r[2],b:type==='w'?r[3]:r[4],start:type==='w'?'':r[3],ok:[type==='w'?r[4]:r[5]],tense:type==='p'?r[6]:null,dis:type==='w'?['who','which','her','his']:['is','are','was','were','be'].filter(w=>!(r[5].split(' ').includes(w))),hb:type==='w'?'Use whose + the thing belonging to the person. Do not keep her or his.':'Use am / is / are for a present routine, or was / were for a finished past action, followed by the past participle.',h2:type==='w'?'Keep the first sentence. Replace Her / His with whose and attach the second part to the person.':'Keep the words from the label. Check subject agreement and the past participle.'});
 FYO['1'].w={items:whose.map(r=>build(r,'w'))};FYO['1'].p={items:passive.map(r=>build(r,'p'))};
})();
