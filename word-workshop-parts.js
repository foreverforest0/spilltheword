/* Reviewed word-family joins plus level-scoped inflections and auxiliaries. */
(()=>{
 'use strict';
 const F=WordWorkshopForms,levels=['kids','a1','a2','b1','b2','c1'];
 const families=[];
 const add=(from,to,affix,kind,type,level)=>families.push({from,word:to,label:affix,kind,type,level,id:kind+'-'+affix.replace(/[^a-z]/g,'')+'-'+to,prompt:(kind==='prefix'?'Add a prefix':'Change the word')+' · '+affix+'.'});
 for(const [from,to,affix,type,level]of [
  ['happy','unhappy','un-','adjective','a1'],['kind','unkind','un-','adjective','a1'],['usual','unusual','un-','adjective','a2'],['fair','unfair','un-','adjective','a2'],['clear','unclear','un-','adjective','a2'],['lucky','unlucky','un-','adjective','a2'],['helpful','unhelpful','un-','adjective','a2'],['comfortable','uncomfortable','un-','adjective','b1'],['successful','unsuccessful','un-','adjective','b1'],['expected','unexpected','un-','adjective','b1'],
  ['agree','disagree','dis-','verb','a2'],['appear','disappear','dis-','verb','a2'],['honest','dishonest','dis-','adjective','b1'],['connect','disconnect','dis-','verb','b1'],['like','dislike','dis-','verb','a2'],['possible','impossible','im-','adjective','b1'],['patient','impatient','im-','adjective','b1'],['polite','impolite','im-','adjective','b1'],['correct','incorrect','in-','adjective','b1'],['complete','incomplete','in-','adjective','b1'],['legal','illegal','il-','adjective','b2'],['regular','irregular','ir-','adjective','b2'],['responsible','irresponsible','ir-','adjective','b2'],
  ['write','rewrite','re-','verb','a2'],['read','reread','re-','verb','a2'],['build','rebuild','re-','verb','b1'],['open','reopen','re-','verb','a2'],['start','restart','re-','verb','a2'],['use','reuse','re-','verb','a2'],['do','redo','re-','verb','a2'],['understand','misunderstand','mis-','verb','b2'],['lead','mislead','mis-','verb','b2'],['cook','overcook','over-','verb','b2'],['estimate','underestimate','under-','verb','b2']
 ])add(from,to,affix,'prefix',type,level);
 for(const [from,to,affix,type,level]of [
  ['happy','happiness','-ness','noun','a2'],['unhappy','unhappiness','-ness','noun','a2'],['kind','kindness','-ness','noun','a2'],['sad','sadness','-ness','noun','a2'],['dark','darkness','-ness','noun','a2'],['ill','illness','-ness','noun','a2'],['care','careful','-ful','adjective','a2'],['care','careless','-less','adjective','a2'],['help','helpful','-ful','adjective','a2'],['help','helpless','-less','adjective','a2'],['hope','hopeful','-ful','adjective','a2'],['hope','hopeless','-less','adjective','a2'],['use','useful','-ful','adjective','a2'],['use','useless','-less','adjective','a2'],['harm','harmful','-ful','adjective','b1'],['harm','harmless','-less','adjective','b1'],
  ['quick','quickly','-ly','fixed','a1'],['slow','slowly','-ly','fixed','a1'],['careful','carefully','-ly','fixed','a2'],['careless','carelessly','-ly','fixed','a2'],['happy','happily','-ly','fixed','a2'],['quiet','quietly','-ly','fixed','a2'],['beautiful','beautifully','-ly','fixed','a2'],['reluctant','reluctantly','-ly','fixed','b1'],['suspicious','suspiciously','-ly','fixed','b2'],
  ['conceal','concealment','-ment','noun','b1'],['develop','development','-ment','noun','b1'],['improve','improvement','-ment','noun','b1'],['agree','agreement','-ment','noun','b1'],['disagree','disagreement','-ment','noun','b1'],['achieve','achievement','-ment','noun','b1'],['decide','decision','-sion','noun','b1'],['discuss','discussion','-ion','noun','b1'],['inform','information','-ation','fixed','b1'],['create','creation','-ion','noun','b1'],['educate','education','-ion','noun','b1'],['collect','collection','-ion','noun','b1'],['protect','protection','-ion','noun','b1'],['act','action','-ion','noun','b1'],
  ['create','creative','-ive','adjective','b2'],['attract','attractive','-ive','adjective','b2'],['effect','effective','-ive','adjective','b2'],['danger','dangerous','-ous','adjective','b1'],['fame','famous','-ous','adjective','b1'],['curious','curiosity','-ity','noun','b2'],['possible','possibility','-ity','noun','b2'],['active','activity','-ity','noun','b1'],['rely','reliable','-able','adjective','b2'],['comfort','comfortable','-able','adjective','b1'],['enjoy','enjoyable','-able','adjective','b1'],['suit','suitable','-able','adjective','b1'],['read','readable','-able','adjective','b2'],['nation','national','-al','adjective','b1'],['person','personal','-al','adjective','b1']
 ])add(from,to,affix,'suffix',type,level);
 const allowed=(required,level)=>levels.indexOf(level)>=levels.indexOf(required);
 function derivations(row,level){return families.filter(d=>d.from===row.forms.base[0]&&allowed(d.level,level))}
 const auxByLevel={kids:['am','is','are','was','were'],a1:['am','is','are','was','were','do','does','did','not'],a2:['am','is','are','was','were','have','has','did','not'],b1:['am','is','are','was','were','have','has','had','been','did','not'],b2:['have','has','had','been','will','might','not'],c1:['to','have','having','been','not']};
 function create(row){return {row,key:'base',aux:[],chain:[],original:row.forms.base[0]}}
 function parts(build,level){
  const row=build.row,forms=row.forms,word=forms.base[0],head=word.split(' ')[0],ops=[];
  const form=(key,label,group='Endings')=>{if(forms[key])ops.push({id:'form-'+key,label,group,kind:'form',key})};
  if(row.type==='verb'){
   const ids=new Set(F.steps(row,level).map(s=>s.id));
   if(ids.has('third'))form('third',head==='be'||head==='have'?'He / she / it':'-s / -es');
   if(ids.has('ing')||ids.has('pastContinuous')||ids.has('perfectContinuous'))form('ing','-ing');
   const regularPast=/ed$/.test(forms.past[0].split(' ')[0])&&forms.past[0]!==word,regularPart=forms.part[0]===forms.past[0]&&regularPast;
   if(ids.has('past'))form('past',regularPast?'-ed':'Past form',regularPast?'Endings':'Stem changes');
   if(['part','perfect','pastPerfect','futurePerfect','modalPerfect','negativePerfect','perfectParticiple','negativeParticiple','perfectInfinitive','negativeInfinitive'].some(id=>ids.has(id))){if(!regularPart)form('part',/en$/.test(forms.part[0].split(' ')[0])&&head!=='be'?'-en / V3':'Past participle','Stem changes');else if(!ids.has('past'))form('part','-ed','Endings')}
   for(const value of auxByLevel[level]||auxByLevel.b1)ops.push({id:'aux-'+value,label:value,kind:'aux',value,group:'Auxiliary words'});
  }
  if(row.type==='noun'){const plural=forms.plural[0];form('plural',plural.startsWith(word)&&/s$/.test(plural)?'-s / -es':'Plural','Endings');if(level!=='kids')form('possessive',"-'s");}
  if(row.type==='adjective'&&!['kids','a1'].includes(level)){form('comparative',forms.comparative[0].startsWith('more ')?'more':'-er');form('superlative',forms.superlative[0].startsWith('most ')?'most':'-est')}
  if(row.type!=='fixed')form('base','Base form','Stem changes');
  for(const d of derivations(row,level))ops.push({...d,group:d.kind==='prefix'?'Prefixes':'Suffixes'});
  return ops;
 }
 function result(build){
  const base=(build.row.forms[build.key]||build.row.forms.base)[0],aux=build.aux.slice();
  if(build.row.type==='verb'&&/^be(?: |$)/.test(base)&&build.key==='base'&&aux.some(a=>/^(am|is|are|was|were|been|be)$/.test(a))){const i=aux.findIndex(a=>/^(am|is|are|was|were|been|be)$/.test(a));return [...aux.slice(0,i),aux[i],...aux.slice(i+1),base.replace(/^be\b\s*/,'')].filter(Boolean).join(' ')}
  if(!aux.length)return base;
  if(aux.length===1&&aux[0]==='not'&&/^(am|is|are|was|were)\b/.test(base))return base.replace(/^(am|is|are|was|were)\b/,'$1 not');
  return [...aux,base].join(' ');
 }
 function apply(build,id,level){const op=parts(build,level).find(o=>o.id===id);if(!op)return false;
  if(op.kind==='form')build.key=op.key;
  else if(op.kind==='aux'){const i=build.aux.indexOf(op.value);if(i>=0)build.aux.splice(i,1);else build.aux.push(op.value)}
  else{build.row=F.analyse(op.word,op.type);build.key='base';build.aux=[]}
  build.chain.push(op.label);return true;
 }
 window.WordWorkshopParts={levels,auxByLevel,derivations,create,parts,result,apply};
})();
