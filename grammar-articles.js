/* Compare already-normalised sentences. Keep word order, omissions and meaning-bearing phrases strict. */
globalThis.GrammarArticles = (() => {
 const articles = new Set(['a', 'an', 'the']);
 const fixed = /\b(?:in (?:the end|a hurry|a way|the morning|the afternoon|the evening)|at (?:the end|the moment|the same time)|on (?:the other hand|the whole|the contrary|a regular basis)|for (?:a while|the first time)|the (?:more|less|sooner|better|same|only)|a (?:few|little|lot|number)|have a (?:go|look|rest))\b/i;
 const specific = /^(?:only|same|first|last|next|previous|former|latter|other|best|worst|most|least|sun|moon|sky|earth|world|internet|police|public|rest|\d+(?:st|nd|rd|th))\b/i;
 const articleTask = /\b(?:article choice|articles?|definite|indefinite)\b/i;
 function equivalent(input, model, prompt = '') {
  if (input === model) return true;
  if (!input || !model || articleTask.test(prompt)) return false;
  const mine = input.trim().split(/\s+/), expected = model.trim().split(/\s+/);
  if (mine.length !== expected.length) return false;
  const lockedPositions = new Set();
  for (const sentence of [input, model]) {
   for (const match of sentence.matchAll(new RegExp(fixed.source, 'gi'))) {
    const start = sentence.slice(0, match.index).trim().split(/\s+/).filter(Boolean).length;
    match[0].split(/\s+/).forEach((word, index) => {
     if (articles.has(word.toLowerCase())) lockedPositions.add(start + index);
    });
   }
  }
  return mine.every((word, index) => {
   if (word === expected[index]) return true;
   if (!articles.has(word.toLowerCase()) || !articles.has(expected[index].toLowerCase())) return false;
   if (lockedPositions.has(index) || specific.test(expected[index + 1] || '')) return false;
   // Keep unique or explicitly identifying referents. Still tolerate a/an pronunciation swaps.
   if ((word.toLowerCase() === 'the' || expected[index].toLowerCase() === 'the') &&
       /\b(?:of (?:the|this|that)|who|which|that|we discussed|you mentioned)\b/i.test(expected.slice(index+2).join(' '))) return false;
   return true;
  });
 }
 return {equivalent};
})();
