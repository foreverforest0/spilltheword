/* A second Kids fridge activity: choose the verb form, then build a habit. */
const KIDS_HABIT_VERBS=[
 ['read','reads','books','ch/o10.webp','Books'],
 ['eat','eats','apples','ch/o04.webp','Apples'],
 ['drink','drinks','milk','ch/p_milk.webp','Milk'],
 ['like','likes','cats','ch/o01.webp','A cat'],
 ['play','plays','with toys','ch/o11.webp','Toys'],
 ['cook','cooks','eggs','ch/p_eggs.webp','Eggs'],
 ['draw','draws','a cat','ch/o02.webp','A cat']
];
const KIDS_HABIT_SUBJECTS=[['I',false],['You',false],['We',false],['They',false],['He',true],['She',true],['Tom',true],['Mum',true]];
function kidsHabitItems(){
 return KIDS_HABIT_VERBS.flatMap(([base,third,object,pic,alt])=>KIDS_HABIT_SUBJECTS.map(([subject,addS])=>{
  const verb=addS?third:base,wrong=addS?base:third,tokens=[subject,verb,object];
  return [addS?'s':'base',[tokens.join(' ')+'.'],pic,alt,{
   tokens,pictureStyle:'plain',pictureCaption:'Every day · '+subject,pictureAlt:alt,
   freePieces:[...tokens,wrong].map(word=>({word,forms:[word],fi:0})),
   agreement:{subject,verb,wrong,addS}
  }];
 }));
}
MGXC.mkhabit={
 title:'Fridge magnets: daily habits',
 help:'Look at the picture and the person. Choose the verb with -s or without -s. Drag or tap three magnets to make a sentence about every day. Leave the other verb in the bank. Tap a magnet on the fridge to put it back.',
 hints:['I / you / we / they: use the verb without -s.','He / she / it, Tom or Mum: add -s to the verb.'],
 types:[['all','Mix'],['s','He / she: add -s'],['base','I / you / we / they']],
 items:kidsHabitItems
};
DMT.mkhabit=1;
DMTF.mkhabit=()=>dmMagnets('mkhabit',MGXC.mkhabit);
SPSHORT.mkhabit='Fridge magnets: -s or no -s';
SPT.push({id:'mkhabit',n:SPSHORT.mkhabit,d:'Choose read or reads and build a short everyday habit.'});
SPGRP.kids.find(group=>group[0].includes('Present Simple'))[1].push('mkhabit');
SPLV.find(level=>level[0]==='kids')[2].push('mkhabit');
