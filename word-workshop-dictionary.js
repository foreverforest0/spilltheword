/* Local SCOWL/Hunspell spelling data + transparent, dictionary-backed joins. */
(()=>{
 'use strict';
 const root=new URL('.',document.currentScript.src),cache=new Map();let data=null,words=null,people=null,pending=null,status='idle';
 const prefixes=['un','re','dis','in','im','il','ir','mis','over','under','non','anti','pre','post','co','inter','sub','super','de','en','em','out'];
 const suffixes=['ness','ful','less','some','ly','ment','able','ible','ive','ous','al','ic','ical','ish','y','er','or','ee','ist','ism','ship','hood','dom','ance','ence','ity','ion','ation','sion','ize','ise','ify','en'];
 const adjectives=new Set(['ful','less','some','able','ible','ive','ous','al','ic','ical','ish','y']),nouns=new Set(['ness','ment','er','or','ee','ist','ism','ship','hood','dom','ance','ence','ity','ion','ation','sion']);
 const productivePrefixes=prefixes.slice();
 const familyCache=new Map();
 const levelOf=s=>['un','re','ness','ful','less','ly','y','er','ish','hood','ship'].includes(s)?'a2':['ize','ise','ify','ity','ism','dom','ic','ical','ible','anti','inter','sub','super','non','post','out'].includes(s)?'b2':'b1';
 const levels=['kids','a1','a2','b1','b2','c1'];
 async function load(){
  if(pending)return pending;status='loading';
  pending=(async()=>{
   let raw;
   try{
    if(!window.DecompressionStream)throw Error('Use JSON fallback');
    const response=await fetch(new URL('vendor/english/lexicon.json.gz',root));if(!response.ok)throw Error('Dictionary unavailable');
    raw=await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).json();
   }catch{
    const response=await fetch(new URL('vendor/english/lexicon.json',root));if(!response.ok)throw Error('Dictionary unavailable');raw=await response.json();
   }
   data=raw;words=new Set(raw.words.split(' '));people=new Set(raw.people||[]);
   for(const links of Object.values(raw.related||{}))for(const [, ,label,kind]of links){const list=kind==='prefix'?prefixes:kind==='suffix'?suffixes:null,value=label.replace(/-/g,'');if(list&&!list.includes(value))list.push(value);}
   for(const rule of raw.rules)if(rule.kind==='PFX'&&rule.add&&!prefixes.includes(rule.add))prefixes.push(rule.add);
   status='ready';return true;
  })().catch(()=>{status='unavailable';return false;});return pending;
 }
 const correct=w=>!!words?.has(w),flags=w=>data?.flags[w]||'';
 function typeOf(w){const pos=data?.pos?.[w];if(pos?.length===1)return {n:'noun',v:'verb',a:'adjective',r:'adverb'}[pos];const tag=String(nlp.world().model.one.lexicon[w]||'');if(/Uncountable|Noun/.test(tag))return 'noun';if(/Adjective/.test(tag))return 'adjective';if(/Adverb/.test(tag))return 'adverb';const f=flags(w);if(/[DG]/.test(f))return 'verb';if(/[TPY]/.test(f))return 'adjective';if(/S/.test(f))return 'noun';return '';}
 function ruleWord(word,r){
  const condition=new RegExp(r.kind==='PFX'?'^'+r.condition:r.condition+'$');if(!condition.test(word))return null;
  if(r.kind==='PFX')return word.startsWith(r.strip)?r.add+word.slice(r.strip.length):null;
  return !r.strip?word+r.add:word.endsWith(r.strip)?word.slice(0,-r.strip.length)+r.add:null;
 }
 function isLemma(word,type){return !!data?.pos?.[word]?.includes({verb:'v',noun:'n',adjective:'a',adverb:'r'}[type])||type==='verb'&&/[DG]/.test(flags(word));}
 function inflections(word){
  const out={};if(!data)return out;
  for(const r of data.rules){const key={D:'past',G:'ing',S:'third'}[r.flag];if(!key||r.kind!=='SFX'||!flags(word).includes(r.flag))continue;const target=ruleWord(word,r);if(correct(target))(out[key]||=[]).push(target);}
  return out;
 }
 function stems(w){
  const out=[w];if(w.endsWith('e'))out.push(w.slice(0,-1));if(/[^aeiou]y$/.test(w))out.push(w.slice(0,-1)+'i',w.slice(0,-1));
  if(/[aeiou][^aeiouwxy]$/.test(w)&&!/[aeiou]{2}[^aeiouwxy]$/.test(w))out.push(w+w.at(-1));return out;
 }
 function joins(word,type,level='c1'){
  if(!data||!correct(word)||!/^[a-z]+$/.test(word))return [];
  const key=[word,type,level].join('|');if(cache.has(key))return cache.get(key);
  const out=[],seen=new Set(),sourceType=['verb','noun','adjective','adverb'].includes(type)?type:typeOf(word)||'fixed';
  const add=(target,label,kind,pos,required=levelOf(label.replace(/-/g,'')))=>{
   if(target===word||!correct(target)||seen.has(kind+'|'+label+'|'+target)||levels.indexOf(levels.includes(level)?level:'b1')<levels.indexOf(required))return;
   if(['inflammable','invaluable'].includes(target)&&kind==='prefix')return;
   const targetPOS=data.pos?.[target];if(kind==='prefix'&&targetPOS?.length===1)pos={n:'noun',v:'verb',a:'adjective',r:'adverb'}[targetPOS];
   seen.add(kind+'|'+label+'|'+target);
   out.push({from:word,word:target,label,kind,type:pos,level:required,id:kind==='remove'?'remove-ly':kind+'-'+label.replace(/-/g,''),negative:kind==='prefix'&&['un-','dis-','in-','im-','il-','ir-','non-','mis-'].includes(label),agent:people.has(target),generic:true});
  };
  for(const [target,pos,label,kind]of data.related?.[word]||[])add(target,label,kind,pos);
  // Source flags authorize non-transparent transformations, rather than guessing arbitrary stems.
  for(const r of data.rules){
   if(!flags(word).includes(r.flag))continue;
   if(r.kind==='PFX'&&sourceType!=='fixed')add(ruleWord(word,r)||'',r.add+'-','prefix',sourceType);
   else if(['V','N','Y','P','B','L'].includes(r.flag)){
    const target=ruleWord(word,r)||'';
    const label={V:'-ive',Y:'-ly',P:'-ness',B:'-able',L:'-ment'}[r.flag]||(r.add==='ion'?'-ion':r.add==='ication'?'-ation':'');
    if(!label)continue;
    if(label==='-ly'&&!['adjective','noun'].includes(sourceType))continue;
    const pos=label==='-ly'?(/[RTP]/.test(flags(target))?'adjective':'adverb'):adjectives.has(label.slice(1))?'adjective':'noun';add(target,label,'suffix',pos);
   }
  }
  for(const pre of productivePrefixes)if(sourceType!=='fixed'&&(sourceType!=='verb'||isLemma(pre+word,'verb')))add(pre+word,pre+'-','prefix',sourceType);
  for(const suf of suffixes){
   const current=sourceType;
   if(['ion','ation','sion','ity','ive','al','ic','ical','ance','ence'].includes(suf))continue; // Explicit flags or authored edges cover these stem changes.
   if(suf==='ly'&&!['adjective','noun','verb'].includes(current))continue;
   if(suf==='er'&&(current==='adjective'||!flags(word).includes('R')))continue;
   if(suf==='or'&&current!=='verb')continue;
   if(suf==='ness'&&current!=='adjective')continue;
   if(['ful','less','some','hood','ship','dom'].includes(suf)&&!['noun','verb','fixed'].includes(current))continue;
   for(const stem of stems(word)){
    const target=stem+suf;
    let pos=adjectives.has(suf)?'adjective':nouns.has(suf)?'noun':['ize','ise','ify'].includes(suf)?'verb':suf==='en'?(current==='adjective'?'verb':'adjective'):'fixed';
    if(suf==='ly'){
     if(/[RTP]/.test(flags(target)))pos='adjective';else if(current==='adjective')pos='adverb';else continue;
    }
    add(target,'-'+suf,'suffix',pos);
   }
  }
  if((type==='adverb'||type==='fixed')&&word.endsWith('ly')){
   const base=word.slice(0,-2),options=[base,base.endsWith('i')?base.slice(0,-1)+'y':'',base.endsWith('l')?base+'e':''];
   for(const target of options)if(target&&/[RTPY]/.test(flags(target)))add(target,'remove -ly','remove','adjective','a2');
  }
  cache.set(key,out);return out;
 }
 function familyTarget(word,type,target){
  if(!correct(target))return null;const key=word+'|'+type+'|'+target;if(familyCache.has(key))return familyCache.get(key);
  const queue=[{word,type,depth:0,negative:false,without:false,agent:false,chain:[]}],seen=new Set([word]);let result=null;
  while(queue.length&&seen.size<1200){
   const item=queue.shift();if(item.depth>=4)continue;
   const authored=window.WordWorkshopFamilies?.edges.filter(e=>e.from===item.word)||[];
   for(const d of [...authored,...joins(item.word,item.type,'c1')]){
    if(seen.has(d.word))continue;seen.add(d.word);
    const next={word:d.word,type:d.type,depth:item.depth+1,negative:item.negative||d.negative||d.label==='-less',without:item.without||d.label==='-less',agent:!!d.agent,chain:[...item.chain,d.label]};
    if(d.word===target){result=next;queue.length=0;break;}queue.push(next);
   }
  }
  if(familyCache.size>500)familyCache.delete(familyCache.keys().next().value);familyCache.set(key,result);return result;
 }
 window.WordWorkshopDictionary={load,correct,joins,typeOf,isLemma,inflections,familyTarget,prefixes,suffixes,get status(){return status},get count(){return words?.size||0}};
})();
