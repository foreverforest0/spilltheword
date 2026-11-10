/* Offline form drills. Particles stay attached; teachers can review ambiguous words. */
(()=>{
 'use strict';
 const irregular={};
 for(const line of `be|was/were|been
begin|began|begun
become|became|become
bend|bent|bent
bet|bet|bet
bite|bit|bitten
blow|blew|blown
break|broke|broken
bring|brought|brought
build|built|built
buy|bought|bought
catch|caught|caught
choose|chose|chosen
come|came|come
cost|cost|cost
cut|cut|cut
deal|dealt|dealt
dig|dug|dug
do|did|done
draw|drew|drawn
dream|dreamed/dreamt|dreamed/dreamt
drink|drank|drunk
drive|drove|driven
eat|ate|eaten
fall|fell|fallen
feed|fed|fed
feel|felt|felt
fight|fought|fought
find|found|found
fit|fit/fitted|fit/fitted
fly|flew|flown
forbid|forbade|forbidden
forget|forgot|forgotten
forgive|forgave|forgiven
freeze|froze|frozen
get|got|got/gotten
give|gave|given
go|went|gone
grow|grew|grown
hang|hung|hung
have|had|had
hear|heard|heard
hide|hid|hidden
hit|hit|hit
hold|held|held
hurt|hurt|hurt
keep|kept|kept
know|knew|known
lay|laid|laid
lead|led|led
lean|leaned/leant|leaned/leant
learn|learned/learnt|learned/learnt
leave|left|left
lend|lent|lent
let|let|let
light|lit/lighted|lit/lighted
lose|lost|lost
make|made|made
mean|meant|meant
meet|met|met
pay|paid|paid
quit|quit/quitted|quit/quitted
put|put|put
read|read|read
ride|rode|ridden
ring|rang|rung
rise|rose|risen
run|ran|run
say|said|said
see|saw|seen
seek|sought|sought
sell|sold|sold
send|sent|sent
set|set|set
shake|shook|shaken
shine|shone/shined|shone/shined
shoot|shot|shot
show|showed|shown/showed
shut|shut|shut
sing|sang|sung
sink|sank|sunk
sit|sat|sat
sleep|slept|slept
smell|smelled/smelt|smelled/smelt
speak|spoke|spoken
spell|spelled/spelt|spelled/spelt
spend|spent|spent
spill|spilled/spilt|spilled/spilt
split|split|split
spread|spread|spread
stand|stood|stood
steal|stole|stolen
stick|stuck|stuck
sting|stung|stung
strike|struck|struck/stricken
swear|swore|sworn
sweep|swept|swept
swim|swam|swum
swing|swung|swung
take|took|taken
teach|taught|taught
tear|tore|torn
tell|told|told
think|thought|thought
throw|threw|thrown
understand|understood|understood
wake|woke/waked|woken/waked
wear|wore|worn
weep|wept|wept
win|won|won
write|wrote|written
overcome|overcame|overcome
undergo|underwent|undergone
withdraw|withdrew|withdrawn
withstand|withstood|withstood
undertake|undertook|undertaken
mistake|mistook|mistaken
rewrite|rewrote|rewritten
retake|retook|retaken
overtake|overtook|overtaken
redo|redid|redone
overdo|overdid|overdone
outdo|outdid|outdone
upset|upset|upset
outrun|outran|outrun
rerun|reran|rerun`.split('\n')){const [base,past,part]=line.split('|');irregular[base]={past:past.split('/'),part:part.split('/')}}
 const norm=s=>String(s).toLowerCase().normalize('NFKC').replace(/[’‘]/g,"'").replace(/[.!?,;:]+$/g,'').replace(/\s+/g,' ').trim();
 const alternatives=s=>[...new Set(String(s||'').split(/\s*\/\s*/).map(norm).filter(Boolean))];
 function parseWords(raw){const seen=new Set(),out=[];for(const line of String(raw).split(/[\n;]/)){const [left,...rest]=line.split(/\||\t|\s[—–]\s/);for(let word of left.split(',')){word=word.replace(/^\s*(?:[-*•]|\d+[.)])\s*/,'').trim();const key=norm(word);if(!key||seen.has(key))continue;seen.add(key);out.push({word:key,meaning:rest.join(' | ').trim()})}}return out.slice(0,150)}
 function detect(word){
  const head=word.split(' ')[0],lex=nlp.world().model.one.lexicon,tag=String(lex[head]||'');
  if(!tag&&nlp(word).has('#Adverb'))return 'fixed';
  if(/^(?:used to|have got|had better)\b/.test(word))return 'fixed';
  if(irregular[head]||(/^to /.test(word))||((typeof WCPOS!=='undefined'&&WCPOS[head]==='v')&&word!=='work experience'))return 'verb';
  if(/Uncountable|Adverb|Modal/.test(tag)||/^(?:used to|have got|had better)\b/.test(word))return 'fixed';
  const pos=typeof WCPOS!=='undefined'?WCPOS[word]:null;if(pos==='n')return 'noun';if(pos==='j')return 'adjective';
  if(/Infinitive|Verb|PastTense|Gerund|Participle/.test(tag))return 'verb';
  if(/Adjective|Comparative|Superlative/.test(tag)&&!word.includes(' '))return 'adjective';
  if(/Noun|Singular|Plural|Actor/.test(tag))return 'noun';
  return '';
 }
 function verbForms(word){
  let [head,...tail]=word.replace(/^to /,'').split(' ');const lemma=nlp(head).verbs().toInfinitive().text();if(lemma&&!lemma.includes(' '))head=norm(lemma);
  const base=[head,...tail].join(' '),conj=nlp(head).verbs().conjugate()[0]||{},append=xs=>xs.map(w=>[w,...tail].join(' '));
  let past=irregular[head]?.past||[conj.PastTense||(/e$/.test(head)?head+'d':/[^aeiou]y$/.test(head)?head.slice(0,-1)+'ied':head+'ed')],part=irregular[head]?.part||[conj.Participle||past[0]];
  let ing=conj.Gerund||(/ie$/.test(head)?head.slice(0,-2)+'ying':/e$/.test(head)&&!/(ee|ye|oe)$/.test(head)?head.slice(0,-1)+'ing':head+'ing');
  const third=head==='be'?'is':head==='have'?'has':conj.PresentTense||(/[^aeiou]y$/.test(head)?head.slice(0,-1)+'ies':/(s|x|z|ch|sh|o)$/.test(head)?head+'es':head+'s');
  if(head==='lie'){past=tail[0]==='down'?['lay']:['lied'];part=tail[0]==='down'?['lain']:['lied'];ing='lying'}
  if(['travel','cancel','label','model'].includes(head)){past=[head+'led',head+'ed'];part=past;return {base:[base],past:append(past),part:append(part),ing:append([head+'ling',head+'ing']),third:append([third])}}
  return {base:[base],past:append(past),part:append(part),ing:append([ing]),third:append([third])};
 }
 function adjectiveForms(word){
  const special={shy:['shyer/shier','shyest/shiest'],dry:['drier/dryer','driest/dryest'],sly:['slyer/slier','slyest/sliest'],red:['redder','reddest'],fun:['more fun','most fun'],good:['better','best'],bad:['worse','worst'],far:['farther/further','farthest/furthest'],little:['less','least'],many:['more','most'],much:['more','most']};
  const syllables=(word.replace(/e$/,'').match(/[aeiouy]+/g)||[]).length;let comparative,superlative;
  if(special[word])[comparative,superlative]=special[word];
  else if(/[^aeiou]y$/.test(word)){comparative=word.slice(0,-1)+'ier';superlative=word.slice(0,-1)+'iest'}
  else if(syllables===1&&!/(ed|ing|ful|less)$/.test(word)||/^(?:clever|narrow|shallow|simple|gentle|quiet|polite)$/.test(word)){
   const stem=/[aeiou][^aeiouwxy]$/.test(word)&&!/[aeiou]{2}[^aeiouwxy]$/.test(word)?word+word.at(-1):word;
   comparative=word.endsWith('e')?word+'r':stem+'er';superlative=word.endsWith('e')?word+'st':stem+'est';
  }else{comparative='more '+word;superlative='most '+word}
  if(/^(?:clever|quiet|polite|friendly|simple|narrow|shallow)$/.test(word)){comparative+='/more '+word;superlative+='/most '+word}
  return {base:[word],comparative:alternatives(comparative),superlative:alternatives(superlative)};
 }
 function analyse(word,type,custom={}){
  word=norm(word);type=type||detect(word);let forms={base:[word]};
  if(type==='verb')forms=verbForms(word);
  else if(type==='noun'){
   const singular=norm(nlp(word).nouns().toSingular().text()||word),plural=norm(nlp(singular).nouns().toPlural().text()||singular+'s');forms={base:[singular],plural:[plural],possessive:[singular+"'s"]};
  }else if(type==='adjective')forms=adjectiveForms(word);
  for(const [key,value]of Object.entries(custom))if(Object.hasOwn(forms,key)&&alternatives(value).length)forms[key]=alternatives(value);
  return {word,type,forms};
 }
 function steps(row){const f=row.forms,make=(id,prompt,hint,answers)=>({id,prompt,hint,answers});
  if(row.type==='verb')return [make('ing','Make the -ing form.','Change the verb; keep every particle.',f.ing),make('past','Past Simple · positive.','Use the past form, not a perfect construction.',f.past),make('third','Present Simple · he / she / it.','Write the verb phrase only.',f.third),make('perfect','Present Perfect · I / you / we / they.','Write the whole verb phrase, without a subject.',f.part.map(w=>'have '+w)),make('negative','Past Simple · negative.','Write the verb phrase, without a subject.',f.base.map(w=>'did not '+w))].map(s=>row.forms.base[0]==='be'&&s.id==='negative'?{...s,prompt:'Past Simple · negative · I / he / she / it.',answers:['was not']}:s);
  if(row.type==='noun')return [make('plural','Make it plural.','Keep the whole noun phrase.',f.plural),make('possessive','Make the singular possessive.','Show that something belongs to one.',f.possessive),make('singular','Back to one · singular.','Remove the plural or possession.',f.base)];
  if(row.type==='adjective')return [make('comparative','Make the comparative.','Give the adjective form, without than.',f.comparative),make('superlative','Make the superlative.','Give the adjective form, without the.',f.superlative),make('positive','Back to the original degree.','Remove the comparison.',f.base)];
  return [];
 }
 function expand(s){return norm(s).replace(/\b(i|you|we|they)'ve\b/g,'$1 have').replace(/\b(he|she|it)'s\b/g,'$1 has').replace(/\bhaven't\b/g,'have not').replace(/\bhasn't\b/g,'has not').replace(/\bdidn't\b/g,'did not').replace(/\bwasn't\b/g,'was not').replace(/\bweren't\b/g,'were not')}
 const matches=(value,answers)=>answers.some(a=>expand(value)===expand(a));
 function sentenceUses(value,target){
  const tokens=expand(value).match(/[a-z]+(?:'[a-z]+)?|[.!?;\n]/g)||[],wanted=expand(target).match(/[a-z]+(?:'[a-z]+)?/g)||[];
  if(tokens.filter(w=>/[a-z]/.test(w)).length<wanted.length+1)return false;
  const possessives=new Set(['my','your','his','her','its','our','their',"one's"]);
  if(tokens.some((_,i)=>wanted.every((w,j)=>possessives.has(w)?possessives.has(tokens[i+j]):tokens[i+j]===w)))return true;
  const separable=new Set(['take off','put off','give up','turn off','turn on','pick up','bring up','hand in','give back','take back','throw away','put away','work out','wake up','set up','carry out','fill in','fill out','break up','let down','make up','cut off','take out','put on','call off','look up']);
  const head=wanted.at(-2),particle=wanted.at(-1),lemma=head?nlp(head).verbs().toInfinitive().text():'';
  if(!separable.has(lemma+' '+particle))return false;
  const prefix=wanted.slice(0,-1);
  return tokens.some((_,i)=>prefix.every((w,j)=>tokens[i+j]===w)&&[1,2,3,4].some(gap=>{const object=tokens.slice(i+prefix.length,i+prefix.length+gap);return tokens[i+prefix.length+gap]===particle&&object.length===gap&&object.every(w=>!/[.!?;\n]/.test(w)&&!['have','has','had','will','would','is','are','was','were','not','and','but'].includes(w))}));
 }
 window.WordWorkshopForms={parseWords,detect,analyse,steps,matches,sentenceUses,norm};
})();
