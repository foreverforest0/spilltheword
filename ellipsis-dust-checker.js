/* Conservative checking for original dialogues; unfamiliar valid paraphrases remain reviewable. */
(()=>{'use strict';
function normalise(s){return String(s||'').normalize('NFKC').toLowerCase().replace(/[’‘]/g,"'").replace(/\bcan't\b/g,'cannot').replace(/\bwon't\b/g,'will not').replace(/\b(does|do|did|is|are|was|were|have|has|had|could|would|should|must)n?'t\b/g,(_,w)=>w+' not').replace(/\b(i|you|we|they)'ve\b/g,'$1 have').replace(/\b(i|you|he|she|we|they)'ll\b/g,'$1 will').replace(/\b(i|you|he|she|we|they)'d\b/g,'$1 would').replace(/\bi'm\b/g,'i am').replace(/\b(you|we|they)'re\b/g,'$1 are').replace(/\bit's (already )?been\b/g,'it has $1been').replace(/\b(it|he|she)'s\b/g,'$1 is').replace(/\blet's\b/g,'let us').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()}
function check(t,value){const s=normalise(value),models=t.answers.map(normalise);if(!s)return {status:'empty',message:'Write a shorter reply, or answer aloud and show an example.'};if(models.some(a=>globalThis.GrammarArticles?.equivalent(s,a,t.prompt) ?? (s===a)))return {status:'correct',message:'Yes — shorter, with the same meaning.'};
if(s===normalise(t.reply))return {status:'retry',message:'The meaning is right, but the repetition is still there. Make B’s reply shorter.'};
if(models.some(a=>a==='i hope not')&&s==='i do not hope so')return {status:'retry',message:'Keep the negative meaning with hope not. Don’t hope so changes the meaning.'};
if(models.some(a=>a==='i assume not')&&s==='i do not assume so')return {status:'retry',message:'Assume not makes a negative assumption. Don’t assume so only denies a positive assumption.'};
if(models.some(a=>/\bto$/.test(a)&&a.replace(/ to$/,'')===s))return {status:'retry',message:'Keep the final to here; only the repeated verb phrase is omitted.'};
if(['one','ones'].includes(t.kind)&&models.some(a=>a.replace(/\bones\b/g,'one').replace(/\bone\b/g,t.kind==='one'?'ones':'one')===s))return {status:'retry',message:t.kind==='one'?'Use one for a singular countable noun.':'Use ones for a plural countable noun.'};
if(t.kind==='agreement'&&models.some(a=>a.replace(/\b(am|have|had|would)\b/g,'do')===s)&&!models.includes(s))return {status:'retry',message:'Match the auxiliary in A’s statement; do is not the matching auxiliary here.'};
if(t.kind==='modal-perfect'&&models.some(a=>a.replace(/ have(?: been)?$/,'')===s))return {status:'retry',message:'Keep the perfect auxiliary chain requested in the task; it preserves the past reference.'};
if(t.kind==='do-so'&&models.some(a=>a.replace(/\bdid so\b/,'do so')===s))return {status:'retry',message:'This action happened in the past. Use did so.'};
return {status:'review',message:'Other short replies may work. Compare the meaning and grammar with an example.'};}
const api={normalise,check};if(typeof module!=='undefined')module.exports=api;else window.EllipsisDustChecker=api;
})();
