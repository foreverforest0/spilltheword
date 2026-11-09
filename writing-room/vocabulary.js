/* Recognise inflections in the hint scroll independently of grammar acceptance. */
(()=>{
 'use strict';
 const groups=[
  ['take','takes','took','taken','taking'],['breath','breaths'],['deep','deeper','deepest'],
  ['nervous','nervously','nervousness'],['delight','delights','delighted','delighting','delightful','delightfully'],
  ['unexpected','unexpectedly'],['arrive','arrives','arrived','arriving','arrival','arrivals'],
  ['exhaust','exhausts','exhausted','exhausting','exhaustion'],['decide','decides','decided','deciding','decision','decisions'],
  ['hesitate','hesitates','hesitated','hesitating','hesitation','hesitations','hesitant','hesitantly'],['anxious','anxiously','anxiety','anxieties'],
  ['gather','gathers','gathered','gathering'],['courage','courageous','courageously'],
  ['reluctant','reluctantly','reluctance'],['support','supports','supported','supporting','supportive'],
  ['ambition','ambitions','ambitious','ambitiously'],['betray','betrays','betrayed','betraying','betrayal','betrayals'],
  ['regret','regrets','regretted','regretting','regretful','regretfully'],
  ['conceal','conceals','concealed','concealing','concealment','concealments'],
  ['apprehension','apprehensions','apprehensive','apprehensively'],['maintain','maintains','maintained','maintaining'],
  ['resentment','resentments','resent','resents','resented','resenting','resentful','resentfully'],
  ['restrain','restrains','restrained','restraining','restraint','restraints'],['outward','outwardly'],
  ['motive','motives'],['seem','seems','seemed','seeming','seemingly'],['arouse','arouses','aroused','arousing'],
  ['suspicion','suspicions','suspicious','suspiciously']
 ];
 const families=new Map();for(const row of groups){const forms=new Set(row);for(const word of row)families.set(word,forms)}
 const determiners=new Set(['a','an','the','some','any','one','two','three','several','enough','more','another','each','my','your','his','her','our','their','its']);
 const flexible=new Set(['a','an','the','my','your','his','her','our','their','its']);
 const tokens=text=>String(text).toLowerCase().match(/[a-z]+(?:['’][a-z]+)?|[.!?;\n]/g)||[];
 function used(text,phrase){
  const draft=tokens(text),hint=tokens(phrase);if(!hint.length)return false;
  function match(i,j){
   if(j===hint.length)return true;const word=hint[j];
   if(flexible.has(word))return match(i,j+1)||(determiners.has(draft[i])&&match(i+1,j+1));
   return i<draft.length&&(families.get(word)?.has(draft[i])||word===draft[i])&&match(i+1,j+1);
  }
  return draft.some((_,i)=>match(i,0));
 }
 window.BardVocabulary={used};
})();
