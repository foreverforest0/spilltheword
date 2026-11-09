/* Error detection and strict service-response handling. Never grade a sentence by style alone. */
(()=>{
 'use strict';
 const version=3;
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
  // Coordinated actions share the past-tense subject, even without repeating “he”.
  // Anchor on an explicit finite clause; exclude infinitives, modals and new subjects.
  const past={open:'opened',close:'closed',take:'took',go:'went',come:'came',feel:'felt',look:'looked',walk:'walked',run:'ran',turn:'turned',say:'said',tell:'told',ask:'asked',answer:'answered',help:'helped',stay:'stayed',leave:'left',enter:'entered',arrive:'arrived',start:'started',stop:'stopped',try:'tried',decide:'decided',want:'wanted',need:'needed',work:'worked',play:'played',smile:'smiled',laugh:'laughed',cry:'cried',speak:'spoke',write:'wrote',see:'saw',hear:'heard',find:'found',give:'gave',make:'made',do:'did',buy:'bought',bring:'brought',sit:'sat',stand:'stood',sleep:'slept',eat:'ate',drink:'drank',watch:'watched',wait:'waited',knock:'knocked',reach:'reached',grab:'grabbed',pick:'picked',hold:'held',put:'put',keep:'kept',hide:'hid',conceal:'concealed',gather:'gathered',maintain:'maintained',support:'supported',agree:'agreed',offer:'offered',expect:'expected',protect:'protected',betray:'betrayed',regret:'regretted',hesitate:'hesitated',realise:'realised',realize:'realized'};
  const bases=Object.keys(past).join('|'),adverbs='finally|then|also|slowly|quickly|carefully|quietly|suddenly|eventually|immediately|reluctantly|bravely|nervously|calmly';
  const joined=new RegExp('\\b(?:and|but|then)\\s+(?:(?:'+adverbs+')\\s+){0,4}('+bases+')\\b','gi');
  const heads=new RegExp('\\b(?:I|you|he|she|it|we|they)\\s+(?:(?:'+adverbs+')\\s+){0,3}(' + [...new Set(Object.values(past).filter(v=>!['did','put'].includes(v)))].join('|')+'|was|were)\\b','gi');
  for(const match of text.matchAll(joined)){
   const before=text.slice(0,match.index).split(/[.!?;\n]/).pop();
   const anchors=[...before.matchAll(heads)];if(!anchors.length)continue;
   const anchor=anchors[anchors.length-1],tail=before.slice(anchor.index+anchor[0].length);
   if(/\b(?:I|you|he|she|it|we|they|can|could|may|might|must|shall|should|will|would|did|does|don't|doesn't|didn't|now|nowadays)\b|["“”]/i.test(tail))continue;
   if(/\bto\s+(?!(?:the|a|an|his|her|our|their|my|your|this|that)\b)[a-z]+\b/i.test(tail))continue;
   const word=match[1],base=word.toLowerCase(),after=text.slice(match.index+match[0].length);
   // “open to ideas” and “close to home” can be adjectives, not finite actions.
   if(['open','close'].includes(base)&&(/^\s+(?:to|about|with)\b/i.test(after)||/^\s*[,.;!?]?\s*$/.test(after)))continue;
   // Preserve noun/adjective coordinations: “needed help and support”, “open doors and open windows”.
   if(['open','close','support','regret','work','help','play','watch','look','walk','run','sleep','drink','answer','offer','need','want'].includes(base)&&!new RegExp('\\b(?:'+adverbs+')\\b','i').test(match[0])&&!/^\s+(?:the|a|an|this|that|these|those|my|your|his|her|its|our|their|it|them|me|him|us|something|anything|nothing)\b/i.test(after))continue;
   if(past[base]===base)continue;
   const replacement=word[0]===word[0].toUpperCase()?past[base][0].toUpperCase()+past[base].slice(1):past[base];
   add(match.index+match[0].lastIndexOf(word),word,[replacement],'These actions describe the same past event. Use “'+replacement+'” to keep the coordinated verb in the past.');
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
