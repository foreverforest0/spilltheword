/* Separate inflection and dictionary-attested derivation builders. */
(()=>{
 'use strict';
 const F=WordWorkshopForms,D=WordWorkshopFamilies,levels=['kids','a1','a2','b1','b2','c1'];
 const allowed=(required,level)=>levels.indexOf(level)>=levels.indexOf(required);
 const auxAdd={kids:['am','is','are','was','were'],a1:['do','does','did','not'],a2:['to','have','has','will'],b1:['had','been','would'],b2:['might'],c1:['having']};
 const auxByLevel=Object.fromEntries(levels.map((l,i)=>[l,[...new Set(levels.slice(0,i+1).flatMap(k=>auxAdd[k]))]]));
 function derivations(row,level){return D.edges.filter(d=>d.from===row.forms.base[0]&&allowed(d.level,level))}
 function create(row){
  row=JSON.parse(JSON.stringify(row));
  if(row.type==='noun')row.forms.pluralPossessive=row.forms.plural.map(w=>w.endsWith('s')?w+"'":w+"'s");
  if(row.type==='adjective'){row.forms.equal=row.forms.base.map(w=>'as '+w+' as');row.forms.less=row.forms.base.map(w=>'less '+w);}
  return {row,key:'base',aux:[],chain:[],original:row.forms.base[0]};
 }
 function parts(build,level,mode='grammar'){
  const row=build.row,forms=row.forms,word=forms.base[0],head=word.split(' ')[0],ops=[];
  const form=(key,label,group='Endings')=>{if(forms[key])ops.push({id:'form-'+key,label,group,kind:'form',key})};
  const ids=new Set(F.steps(row,level).map(s=>s.id));
  if(row.type==='verb'){
   form('ing','-ing');form('past',/ed$/.test(forms.past[0].split(' ')[0])?'-ed':'Past form');
   if(forms.part[0]!==forms.past[0]&&(mode==='formation'?allowed('a2',level):ids.has('part')||ids.has('perfect')))form('part','V3');
   if(mode==='grammar'||allowed('a2',level))form('third',head==='be'||head==='have'?'He / she / it':'-s / -es');
   if(mode==='grammar')for(const value of auxByLevel[level])ops.push({id:'aux-'+value,label:value,kind:'aux',value,group:'Helpers'});
  }
  if(row.type==='noun'){
   if(mode==='grammar'||D.countable.includes(word))form('plural','-s / -es');
   if(mode==='grammar'&&level!=='kids'){form('possessive',"-'s");form('pluralPossessive',"Plural + possessive");}
  }
  if(row.type==='adjective'&&mode==='grammar'){
   if(ids.has('comparative'))form('comparative',forms.comparative[0].startsWith('more ')?'more':'-er');if(ids.has('superlative'))form('superlative',forms.superlative[0].startsWith('most ')?'most':'-est');
   if(ids.has('equal'))form('equal','as … as');if(ids.has('less'))form('less','less');
  }
  if(mode==='grammar'&&row.type!=='fixed')form('base','Base');
  if(mode==='formation'&&build.key==='base')for(const d of derivations(row,level))ops.push({...d,group:d.kind==='prefix'?'Prefixes':'Suffixes'});
  return ops;
 }
 function result(build){
  const base=(build.row.forms[build.key]||build.row.forms.base)[0],aux=build.aux.slice();
  if(build.row.type==='verb'&&/^be(?: |$)/.test(base)&&build.key==='base'&&aux.some(a=>/^(am|is|are|was|were|been|be)$/.test(a))){const i=aux.findIndex(a=>/^(am|is|are|was|were|been|be)$/.test(a));return [...aux.slice(0,i),aux[i],...aux.slice(i+1),base.replace(/^be\b\s*/,'')].filter(Boolean).join(' ')}
  if(!aux.length)return base;
  if(aux.length===1&&aux[0]==='not'&&/^(am|is|are|was|were)\b/.test(base))return base.replace(/^(am|is|are|was|were)\b/,'$1 not');
  return [...aux,base].join(' ');
 }
 function apply(build,id,level,mode='grammar'){
  const op=parts(build,level,mode).find(o=>o.id===id);if(!op)return false;
  if(op.kind==='form')build.key=op.key;
  else if(op.kind==='aux'){const i=build.aux.indexOf(op.value);if(i>=0)build.aux.splice(i,1);else build.aux.push(op.value)}
  else{const next=create(F.analyse(op.word,op.type));build.row=next.row;build.key='base';build.aux=[];}
  build.chain.push(op.label);return true;
 }
 function formationTasks(row,level){
  const groups=new Map(),seen=new Set([row.forms.base[0]]),queue=[{row,recipe:[],negative:false,agent:false,without:false}];
  const add=(word,type,recipe,negative,agent,without,ending='')=>{
   let prompt=type==='fixed'?(negative?'Make a negative adverb.':'Make an adverb.'):type==='noun'?(agent?'Make a noun for a person.':negative?'Make a negative noun.':'Make a noun.'):type==='adjective'?(without?'Make an adjective meaning without something.':negative?'Give the adjective a negative meaning.':'Make an adjective.'):negative?'Give the verb an opposite meaning.':'Make a verb.';
   if(ending==='plural')prompt='Make a plural noun.';
   if(ending==='past')prompt='Make a derived verb in the past.';
   if(ending==='ing')prompt='Make a derived verb in the -ing form.';
   if(type==='verb'&&!negative&&!ending){const first=recipe[0]||'';if(first.startsWith('prefix-re-'))prompt='Express doing it again.';if(first.startsWith('prefix-mis-'))prompt='Express doing it wrongly.';if(first.startsWith('prefix-over-'))prompt='Express too much.';if(first.startsWith('prefix-under-'))prompt='Express too little.';}
   const item=groups.get(prompt)||{id:'family-'+groups.size,prompt,answers:[],paths:[]};
   if(!item.answers.includes(word)){item.answers.push(word);item.paths.push({word,recipe});}groups.set(prompt,item);
  };
  while(queue.length){
   const item=queue.shift();if(item.recipe.length>=4)continue;
   for(const d of derivations(item.row,level)){
    if(seen.has(d.word))continue;seen.add(d.word);
    const recipe=[...item.recipe,d.id],negative=item.negative||d.negative||d.label==='-less',agent=item.agent||d.agent,without=item.without||d.label==='-less',next=F.analyse(d.word,d.type);
    add(d.word,d.type,recipe,negative,agent,without);
    if(d.type==='noun'&&D.countable.includes(d.word))for(const w of next.forms.plural)add(w,'noun',[...recipe,'form-plural'],negative,agent,without,'plural');
    if(d.type==='verb'&&allowed('a2',level))for(const key of ['past','ing'])for(const w of next.forms[key])add(w,'verb',[...recipe,'form-'+key],negative,agent,without,key);
    queue.push({row:next,recipe,negative,agent,without});
   }
  }
  return [...groups.values()];
 }
 function plan(row,level,mode){
  if(mode==='grammar')return F.plan(row,level,5);
  const pool=formationTasks(row,level);for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,5);
 }
 window.WordWorkshopParts={levels,auxByLevel,derivations,create,parts,result,apply,formationTasks,plan};
})();
