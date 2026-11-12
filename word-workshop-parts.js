/* Separate inflection and dictionary-attested derivation builders. */
(()=>{
 'use strict';
 const F=WordWorkshopForms,D=WordWorkshopFamilies,levels=['kids','a1','a2','b1','b2','c1'];
 const allowed=(required,level)=>levels.indexOf(level)>=levels.indexOf(required);
 const auxAdd={kids:['am','is','are','was','were'],a1:['do','does','did','not'],a2:['to','have','has','will'],b1:['had','been','would'],b2:['might'],c1:['having']};
 const auxByLevel=Object.fromEntries(levels.map((l,i)=>[l,[...new Set(levels.slice(0,i+1).flatMap(k=>auxAdd[k]))]]));
 const taskCache=new Map();
 function derivations(row,level){
  const authored=D.edges.filter(d=>d.from===row.forms.base[0]),out=[],seen=new Set();
  for(const d of [...authored,...(window.WordWorkshopDictionary?.joins(row.forms.base[0],row.type,'c1')||[])]){
   const key=d.kind+'|'+d.label;if(seen.has(key))continue;seen.add(key);out.push(d);
  }return out;
 }
 function create(row){
  row=JSON.parse(JSON.stringify(row));
  if(row.type==='noun')row.forms.pluralPossessive=row.forms.plural.map(w=>w.endsWith('s')?w+"'":w+"'s");
  if(row.type==='adjective'){row.forms.equal=row.forms.base.map(w=>'as '+w+' as');row.forms.less=row.forms.base.map(w=>'less '+w);}
  return {row,key:'base',aux:[],chain:[],original:row.forms.base[0]};
 }
 const inventory=[];
 const push=(id,label,kind,value,group)=>inventory.push({id,label,kind,value,group});
 for(const label of new Set(D.edges.filter(e=>e.kind==='prefix').map(e=>e.label)))push('prefix-'+label.slice(0,-1),label,'prefix',label.slice(0,-1),'Prefixes');
 for(const label of new Set(D.edges.filter(e=>e.kind==='suffix').map(e=>e.label)))push('suffix-'+label.slice(1),label,'suffix',label.slice(1),'Suffixes');
 for(const [id,label,value]of [['ending-ed','-ed','past'],['ending-s','-s / -es','plural'],['ending-est','-est','superlative'],['ending-possessive',"-'s",'possessive']])push(id,label,'ending',value,'Endings');
 if(!inventory.some(o=>o.label==='-ing'))push('suffix-ing','-ing','suffix','ing','Suffixes');
 if(!inventory.some(o=>o.label==='-er'))push('suffix-er','-er','suffix','er','Suffixes');
 for(const value of ['more','most','less','least'])push('degree-'+value,value,'degree',value,'Comparison');
 push('stem-past','V2','stem','past','Endings');push('stem-part','V3','stem','part','Endings');
 push('degree-equal','as … as','degree','equal','Comparison');push('remove-ly','remove -ly','remove','ly','Remove a piece');
 function extendInventory(){
  const lex=window.WordWorkshopDictionary;if(!lex)return;
  for(const value of lex.prefixes)if(!inventory.some(o=>o.id==='prefix-'+value))push('prefix-'+value,value+'-','prefix',value,'Prefixes');
  for(const value of lex.suffixes)if(!inventory.some(o=>o.id==='suffix-'+value))push('suffix-'+value,'-'+value,'suffix',value,'Suffixes');
 }
 function partId(id,mode='formation'){
  if(mode==='grammar'||inventory.some(p=>p.id===id))return id;
  const d=D.edges.find(e=>e.id===id);if(d)return d.kind==='remove'?'remove-ly':d.kind+'-'+d.label.replace(/-/g,'');
  return {'form-plural':'ending-s','form-past':'ending-ed','form-ing':'suffix-ing','form-third':'ending-s','form-comparative':'suffix-er','form-superlative':'ending-est'}[id]||id;
 }
 function assemble(build,id){
  const op=inventory.find(o=>o.id===partId(id));if(!op)return false;
  const word=result(build),label=op.kind==='ending'&&op.value==='past'?'-ed':op.kind==='ending'&&op.value==='plural'?'-s':op.label;
  // Known joins repair spelling; all other choices still produce an editable trial word.
  const edge=D.edges.find(d=>d.from===word&&d.label===label&&d.kind===op.kind)||window.WordWorkshopDictionary?.joins(word,build.row.type,'c1').find(d=>d.label===label&&d.kind===op.kind);
  let next,kind='fixed',valid=!!edge;
  if(edge){next=edge.word;kind=edge.type;build.negative=!!build.negative||!!edge.negative||edge.label==='-less';build.without=!!build.without||edge.label==='-less';build.agent=!!edge.agent;}
  else if(op.kind==='prefix')next=op.value+word;
  else if(op.kind==='remove')next=word.endsWith('ly')?word.slice(0,-2):word;
  else if(op.kind==='stem'){next=build.row.forms[op.value]?.[0]||word;kind=build.row.type;valid=!!build.row.forms[op.value];}
  else if(op.kind==='degree'){next=op.value==='equal'?'as '+word+' as':op.value+' '+word;valid=build.row.type==='adjective'&&F.canCompare(word)&&(op.value==='more'?build.row.forms.comparative.includes(next):op.value==='most'?build.row.forms.superlative.includes(next):true);kind='adjective';build.degree={word,key:['most','least'].includes(op.value)?'superlative':'comparative'};}
  else{
   const current=build.row,known=current.forms.base[0]===word;
   let key=op.value;
   if(op.kind==='suffix'&&op.value==='er'&&current.type==='adjective')key='comparative';
   else if(op.kind==='suffix'&&op.value==='ing')key='ing';
   else if(op.kind==='ending'&&op.value==='plural'&&current.type==='verb')key='third';
   if(known&&current.forms[key]&&!(key==='comparative'&&current.forms[key][0].startsWith('more '))&&!(key==='superlative'&&current.forms[key][0].startsWith('most '))&&!(key==='past'&&!/ed$/.test(current.forms[key][0].split(' ')[0]))){next=current.forms[key][0];kind=current.type;valid=true;if(key==='comparative'||key==='superlative')build.degree={word,key};}
   else next=word+(op.kind==='ending'?({past:'ed',plural:'s',superlative:'est',possessive:"'s"}[op.value]||op.value):op.value);
  }
  build.validPath=(build.validPath!==false)&&valid;
  build.surface=next;build.row=edge?create(F.analyse(next,kind)).row:{word:next,type:kind,forms:{base:[next]}};build.key='base';build.aux=[];build.chain.push(op.label);return true;
 }
 function parts(build,level,mode='grammar'){
  if(mode==='formation')return inventory.map(o=>({...o}));
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
  if(mode==='formation'&&build.key==='base')for(const d of derivations(row,level))ops.push({...d,group:d.kind==='remove'?'Remove a piece':d.kind==='prefix'?'Prefixes':'Suffixes'});
  return ops;
 }
 function result(build){
  if(typeof build.surface==='string')return build.surface;
  const base=(build.row.forms[build.key]||build.row.forms.base)[0],aux=build.aux.slice();
  if(build.row.type==='verb'&&/^be(?: |$)/.test(base)&&build.key==='base'&&aux.some(a=>/^(am|is|are|was|were|been|be)$/.test(a))){const i=aux.findIndex(a=>/^(am|is|are|was|were|been|be)$/.test(a));return [...aux.slice(0,i),aux[i],...aux.slice(i+1),base.replace(/^be\b\s*/,'')].filter(Boolean).join(' ')}
  if(!aux.length)return base;
  if(aux.length===1&&aux[0]==='not'&&/^(am|is|are|was|were)\b/.test(base))return base.replace(/^(am|is|are|was|were)\b/,'$1 not');
  return [...aux,base].join(' ');
 }
 function apply(build,id,level,mode='grammar'){
  if(mode==='formation')return assemble(build,id);
  const op=parts(build,level,mode).find(o=>o.id===id);if(!op)return false;
  if(op.kind==='form')build.key=op.key;
  else if(op.kind==='aux'){const i=build.aux.indexOf(op.value);if(i>=0)build.aux.splice(i,1);else build.aux.push(op.value)}
  else{const next=create(F.analyse(op.word,op.type));build.row=next.row;build.key='base';build.aux=[];}
  build.chain.push(op.label);return true;
 }
 function formationTasks(row,level){
  const cacheKey=JSON.stringify([row.word,row.type,level,row.forms,window.WordWorkshopDictionary?.status]);if(taskCache.has(cacheKey))return taskCache.get(cacheKey);
  const groups=new Map(),seen=new Set([row.forms.base[0]]),queue=[{row,recipe:[],negative:false,agent:false,without:false}];
  const add=(word,type,recipe,negative,agent,without,ending='')=>{
   let prompt=['fixed','adverb'].includes(type)?(negative?'Make a negative adverb.':'Make an adverb.'):type==='noun'?(agent?'Make a noun for a person.':negative?'Make a negative noun.':'Make a noun.'):type==='adjective'?(without?'Make an adjective meaning without something.':negative?'Give the adjective a negative meaning.':'Make an adjective.'):negative?'Give the verb an opposite meaning.':'Make a verb.';
   if(ending==='plural')prompt='Make a plural noun.';
   if(ending==='past')prompt='Make a derived verb in the past.';
   if(ending==='ing')prompt='Make a derived verb in the -ing form.';
   if(type==='verb'&&!negative&&!ending){const first=recipe[0]||'';if(first.startsWith('prefix-re-'))prompt='Express doing it again.';if(first.startsWith('prefix-mis-'))prompt='Express doing it wrongly.';if(first.startsWith('prefix-over-'))prompt='Express too much.';if(first.startsWith('prefix-under-'))prompt='Express too little.';}
   const prefix=({'Express doing it again.':'re-','Express doing it wrongly.':'mis-','Express too much.':'over-','Express too little.':'under-'})[prompt]||'';
   const item=groups.get(prompt)||{id:'family-'+groups.size,prompt,answers:[],paths:[],meta:{type,negative,agent,without,ending,prefix}};
   if(!item.answers.includes(word)){item.answers.push(word);item.paths.push({word,recipe});}groups.set(prompt,item);
  };
  const comparisons=(item)=>{
   if(row.type==='adjective'&&item.recipe.length)return;
   if(!allowed('a2',level)||item.row.type!=='adjective'||!F.canCompare(item.row.forms.base[0]))return;
   const f=item.row.forms;
   for(const [key,prompt]of [['comparative','Make the comparative.'],['superlative','Make the superlative.']]){
    const direction=row.type==='adjective'?prompt:key==='comparative'?'Make a comparative adjective.':'Make a superlative adjective.';
    const group=groups.get(direction)||{id:'degree-'+key,prompt:direction,answers:[],paths:[],meta:{comparison:key,original:row.type==='adjective'?row.forms.base[0]:null}};
    for(const word of f[key])if(!group.answers.includes(word)){
     const op=word.startsWith('more ')?'degree-more':word.startsWith('most ')?'degree-most':key==='comparative'?'suffix-er':'ending-est';
     group.answers.push(word);group.paths.push({word,recipe:[...item.recipe,op]});
    }groups.set(direction,group);
   }
  };
  comparisons(queue[0]);
  while(queue.length&&seen.size<160){
   const item=queue.shift();if(item.recipe.length>=4)continue;
   for(const d of derivations(item.row,level)){
    if(seen.has(d.word))continue;seen.add(d.word);
    const recipe=[...item.recipe,d.id],negative=item.negative||d.negative||d.label==='-less',agent=item.agent||d.agent,without=item.without||d.label==='-less',next=F.analyse(d.word,d.type);
    add(d.word,d.type,recipe,negative,agent,without);
    if(d.type==='noun'&&(D.countable.includes(d.word)||window.WordWorkshopDictionary?.correct(next.forms.plural?.[0])))for(const w of next.forms.plural)add(w,'noun',[...recipe,'form-plural'],negative,agent,without,'plural');
    if(d.type==='verb'&&allowed('a2',level))for(const key of ['past','ing'])for(const w of next.forms[key])add(w,'verb',[...recipe,key==='ing'?'suffix-ing':/ed$/.test(w)?'ending-ed':'stem-past'],negative,agent,without,key);
    comparisons({row:next,recipe});queue.push({row:next,recipe,negative,agent,without});
   }
  }
  // Only offer model routes that the actual board can construct. Third-party
  // morphology may normalize a rare lemma differently from the spelling data.
  const tasks=[...groups.values()].map(task=>{
   const paths=task.paths.filter(path=>{const build=create(row);return path.recipe.every(id=>apply(build,id,level,'formation'))&&F.matches(result(build),[path.word])&&(!window.WordWorkshopDictionary||window.WordWorkshopDictionary.status!=='ready'||window.WordWorkshopDictionary.correct(path.word.split(' ').at(-1)));});
   return {...task,paths,answers:[...new Set(paths.map(path=>path.word))]};
  }).filter(task=>task.paths.length);if(taskCache.size>600)taskCache.delete(taskCache.keys().next().value);taskCache.set(cacheKey,tasks);return tasks;
 }
 function matchesFormation(build,task){
  const meta=task.meta;if(!meta||!build.chain.length||result(build)===build.original||build.validPath===false||!window.WordWorkshopDictionary?.correct(result(build).split(' ').at(-1)))return false;
  if(meta.comparison)return build.degree?.key===meta.comparison&&(!meta.original||build.degree.word===meta.original);
  if(meta.ending)return false;
  const type=['fixed','adverb'].includes(build.row.type)?'adverb':build.row.type;
  return type===(['fixed','adverb'].includes(meta.type)?'adverb':meta.type)&&(!meta.negative||build.negative)&&(!meta.agent||build.agent)&&(!meta.without||build.without)&&(!meta.prefix||build.chain.includes(meta.prefix));
 }
 function matchesTyped(row,value,task){
  if(!/^[a-z]+$/.test(F.norm(value))||!task.meta||task.meta.comparison||task.meta.ending)return false;
  const found=window.WordWorkshopDictionary?.familyTarget(row.forms.base[0],row.type,F.norm(value));
  if(!found)return false;
  const meta=task.meta,type=['adverb','fixed'].includes(found.type)?'adverb':found.type;
  return type===(['fixed','adverb'].includes(meta.type)?'adverb':meta.type)&&(!meta.negative||found.negative)&&(!meta.agent||found.agent)&&(!meta.without||found.without)&&(!meta.prefix||found.chain.includes(meta.prefix));
 }
 function plan(row,level,mode){
  if(mode==='grammar')return F.plan(row,level,5);
  const pool=formationTasks(row,level).slice();for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,5);
 }
 window.WordWorkshopParts={levels,auxByLevel,derivations,create,parts,result,apply,formationTasks,plan,partId,inventory,extendInventory,matchesFormation,matchesTyped};
})();
