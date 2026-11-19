/* Known valid alternatives are accepted; unsupported paraphrases receive neutral comparison. */
(()=>{'use strict';
function normalise(s){return String(s||'').normalize('NFKC').toLowerCase().replace(/[’‘]/g,"'").replace(/\bcan't\b/g,'cannot').replace(/\bwasn't\b/g,'was not').replace(/\bweren't\b/g,'were not').replace(/\bwouldn't\b/g,'would not').replace(/\bhadn't\b/g,'had not').replace(/\bwho's\b/g,'who is').replace(/\bcafe\b/g,'café').replace(/[^a-z0-9é, ']/g,' ').replace(/\s*,\s*/g,', ').replace(/\s+/g,' ').trim().replace(/, $/,',')}
const strip=s=>s.replace(/,/g,'').replace(/\s+/g,' ').trim();
function check(t,value){const s=normalise(value),models=t.answers.map(normalise);if(!s)return {status:'empty',message:'Write a sentence, or answer aloud and show an example.'};if(models.includes(s))return {status:'correct',message:'Yes — the facts are joined correctly.'};
const commas=['non-defining','whole-clause','quantifier','preposition-non-defining'].includes(t.kind);
if(commas&&models.some(a=>strip(a)===strip(s)))return {status:'retry',message:'This is extra information. Check the comma or pair of commas shown in the example.'};
if(commas&&models.some(a=>strip(a.replace(/\b(who|which)\b/g,'that'))===strip(s)))return {status:'retry',message:'Use who or which here. That cannot introduce this non-defining clause.'};
if(t.kind==='subject'&&models.some(a=>a.replace(/\b(who|which|that) /,'')===s))return {status:'retry',message:'The relative word is the subject here, so it cannot be left out.'};
if(t.kind==='possessive'||t.kind==='non-defining'){if(models.some(a=>a.replace(/\bwhose\b/g,'who is')===s))return {status:'retry',message:'Use whose + noun for possession. Who’s means who is or who has.'}}
if(t.kind==='subject'&&models.some(a=>a.replace(/\b(who|that) /,'$1 she ')===s||a.replace(/\b(who|which|that) /,'$1 it ')===s))return {status:'retry',message:'The relative word already acts as the subject. Remove the repeated subject.'};
if(t.kind==='quantifier'&&models.some(a=>a.replace(/of whom/g,'of which')===s||a.replace(/of which/g,'of whom')===s))return {status:'retry',message:'Use of whom for people and of which for things.'};
return {status:'review',message:'Other wordings are possible. Compare your meaning and relative clause with an example.'};}
const api={check,normalise};if(typeof module!=='undefined')module.exports=api;else window.RelativeLensChecker=api;
})();
