/* Error detection and strict service-response handling. Never grade a sentence by style alone. */
(()=>{
 'use strict';
 const version=2;
 function dedupe(issues){const seen=new Map();for(const issue of issues){const key=issue.offset+':'+issue.length;if(seen.has(key)){const row=seen.get(key);row.replacements=[...new Set([...(row.replacements||[]),...(issue.replacements||[])])].slice(0,5)}else seen.set(key,{...issue})}return [...seen.values()].sort((a,b)=>a.offset-b.offset||b.length-a.length)}
 function localIssues(text){
  const issues=[];
  const add=(offset,word,replacements,message)=>issues.push({offset,length:word.length,replacements,message,type:'grammar',ruleId:'LOCAL_FORM_GUARD'});
  const patterns=[
   [/\b(I)\s+(is|are)\b/gi,()=>['am'],'Use “am” with “I”.'],
   [/\b(he|she|it)\s+(am|are)\b/gi,()=>['is'],'Use “is” with he, she or it.'],
   [/\b(we|you|they)\s+(am|is)\b/gi,()=>['are'],'Use “are” with we, you or they.'],
   [/\b(I|we|you|they)\s+(has)\b/gi,()=>['have'],'Use “have” with I, we, you or they.'],
   [/\b(I|we|you|they)\s+(does)\b/gi,()=>['do'],'Use “do” with I, we, you or they.'],
   [/\b(I|we|you|they)\s+(doesn['’]t)\b/gi,()=>["don’t"],'Use “don’t” with I, we, you or they.'],
   [/\b(he|she|it)\s+(don['’]t)\b/gi,()=>["doesn’t"],'Use “doesn’t” with he, she or it.'],
   [/\b(did not|didn['’]t|does not|doesn['’]t|do not|don['’]t)\s+(went|gone|did|done|saw|seen|ate|eaten|came|bought|took|taken|made|wrote|written|played|likes|goes|has|was|were)\b/gi,m=>[{went:'go',gone:'go',did:'do',done:'do',saw:'see',seen:'see',ate:'eat',eaten:'eat',came:'come',bought:'buy',took:'take',taken:'take',made:'make',wrote:'write',written:'write',played:'play',likes:'like',goes:'go',has:'have',was:'be',were:'be'}[m[2].toLowerCase()]],'After do / does / did, use the base form of the main verb.'],
   [/\b(has|have|had)\s+(went|saw|ate|wrote|took|did)\b/gi,m=>[{went:'gone',saw:'seen',ate:'eaten',wrote:'written',took:'taken',did:'done'}[m[2].toLowerCase()]],'After have / has / had, use the past participle.']
  ];
  for(const [pattern,forms,message]of patterns)for(const match of text.matchAll(pattern)){const offset=match.index+match[0].lastIndexOf(match[2]);add(offset,match[2],forms(match),message)}
  for(const match of text.matchAll(/\b(he|she|it)\s+(were)\b/gi)){
   const before=text.slice(Math.max(0,match.index-80),match.index);
   if(!/\b(if|wish|though|suppose|imagine)\b[^.!?]*$/i.test(before))add(match.index+match[0].lastIndexOf(match[2]),match[2],['was'],'Use “was” with he / she / it in an ordinary past statement.');
  }
  const verbs={go:['goes','went'],have:['has','had'],do:['does','did'],want:['wants','wanted'],like:['likes','liked'],need:['needs','needed'],know:['knows','knew'],feel:['feels','felt'],seem:['seems','seemed'],look:['looks','looked'],say:['says','said'],think:['thinks','thought'],work:['works','worked'],live:['lives','lived'],play:['plays','played'],open:['opens','opened'],close:['closes','closed'],take:['takes','took'],come:['comes','came']};
  const third=/\b(he|she|it)\s+(go|have|do|want|like|need|know|feel|seem|look|say|think|work|live|play|open|close|take|come)\b/gi;
  for(const match of text.matchAll(third)){
   const before=text.slice(Math.max(0,match.index-100),match.index);
   // Preserve grammatical mandative subjunctives, including “I insist he go”.
   if(/\b(insist|recommend|suggest|demand|require|essential|vital|important|necessary)\b[^.!?]*$/i.test(before))continue;
   add(match.index+match[0].lastIndexOf(match[2]),match[2],verbs[match[2].toLowerCase()],'Check the verb form with he / she / it. Choose the tense that keeps your meaning.');
  }
  return dedupe(issues);
 }
 function normalizeRemote(text,result){
  if(!result||!Array.isArray(result.matches)||result.warnings?.incompleteResults)throw Error('The grammar check could not finish. Your draft is safe.');
  const detected=result.language?.detectedLanguage;
  if(detected?.code&&!/^en(?:-|$)/i.test(detected.code)&&detected.confidence>.8)throw Error('Write your version in English, then check again.');
  const issues=[];
  for(const match of result.matches){
   if(!match||typeof match.message!=='string'||!Number.isInteger(match.offset)||!Number.isInteger(match.length)||match.offset<0||match.length<0||match.offset+match.length>text.length)throw Error('The checker returned an incomplete correction. Your draft is safe.');
   const type=String(match.rule?.issueType||'uncategorized').toLowerCase(),category=String(match.rule?.category?.id||'').toUpperCase();
   const structural=/^(GRAMMAR|AGREEMENT|TENSE|VERBS|ARTICLES|PREPOSITIONS|CONFUSED_WORDS|TYPOS|PUNCTUATION)$/.test(category);
   if(!structural&&(['style','register','locale-violation','locale-specific-content','formatting'].includes(type)||category==='STYLE'))continue;
   const replacements=[...new Set((match.replacements||[]).map(r=>r?.value).filter(v=>typeof v==='string'&&v.length<=200))].slice(0,5);
   issues.push({offset:match.offset,length:match.length,message:match.message,replacements,type,ruleId:String(match.rule?.id||'')});
  }
  return dedupe(issues);
 }
 window.BardGrammar={version,localIssues,normalizeRemote,mergeIssues:(remote,local)=>dedupe([...remote,...local])};
})();
