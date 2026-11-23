/* Deliberately bounded checking: unfamiliar paraphrases are offered comparison, never labelled wrong. */
(()=>{'use strict';
function normalise(s){return String(s||'').normalize('NFKC').toLowerCase().replace(/[’‘]/g,"'").replace(/\bcan(?:no|')t\b/g,'cannot').replace(/\bcouldn't\b/g,'could not').replace(/\bmustn't\b/g,'must not').replace(/\bmightn't\b/g,'might not').replace(/\bmayn't\b/g,'may not').replace(/\bi'm\b/g,'i am').replace(/\b(they|we|you)'re\b/g,'$1 are').replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim()}
function check(t,mode,value){const b=t[mode],s=normalise(value);if(!s)return {status:'empty',message:'Write a deduction, or answer aloud and show an example.'};if(b.answers.some(a=>(globalThis.GrammarArticles?.equivalent(s,normalise(a),t.prompt) ?? (normalise(a)===s))))return {status:'correct',message:'Yes — this fits the evidence.'};
if(/\bmust not\b/.test(s))return {status:'retry',message:'Mustn’t means prohibition. For a negative deduction, try can’t or couldn’t have.'};
if(/\b(must|might|may|could|cannot|could not) (?:has|had|to|of)\b/.test(s))return {status:'retry',message:'After a modal, use the base form: be, have, take…'};
if(/\b(must|might|may|could|cannot|could not) have (?:be|being)\b/.test(s))return {status:'retry',message:'For a past state, use modal + have been.'};
if(/\b(must|might|may|could|cannot|could not) (?:is|are|was|were)\b/.test(s))return {status:'retry',message:'Use be after a modal. For a past state, use have been.'};
const past=/\b(?:must|might|may|could|cannot) have\b/.test(normalise(b.answer));
if(mode==='before'&&past&&!/\b(?:must|might|may|could|cannot|could not) have\b/.test(s)&&/\b(?:must|might|may|could|cannot) be\b/.test(s))return {status:'retry',message:'This clue refers to the past. Try modal + have + past participle (or have been + -ing).'};
return {status:'review',message:'Other answers are possible. Compare your meaning and verb form with an example.'};}
const api={check,normalise};if(typeof module!=='undefined')module.exports=api;else window.DeductionToggleChecker=api;
})();
