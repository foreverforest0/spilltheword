(() => {
  'use strict';
  const normalize = value => value.trim().toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/\s*([,;.!?])\s*/g, '$1 ')
    .replace(/[.!?\s]+$/, '');
  const sentenceAdverbs = ['however', 'as a result', 'therefore', 'consequently', 'moreover', 'in addition', 'nevertheless', 'even so', "what's more"];

  function check(link, models, value) {
    const text = normalize(value);
    if (!text) return { state: 'empty', message: 'Write your sentence or switch to Oral.' };
    if (models.some(model => normalize(model) === text)) {
      return { state: 'correct', message: 'That works. You kept both facts and used the linker correctly.' };
    }
    if (/\bdespite of\b/.test(text)) {
      return { state: 'revise', message: 'Use despite directly before the phrase, or use in spite of.' };
    }
    if (/^although\b[^.;]*, but\b/.test(text)) {
      return { state: 'revise', message: 'When although introduces the opening clause, join it to the main clause without but.' };
    }
    if (sentenceAdverbs.includes(normalize(link)) && text.includes(', ' + normalize(link) + ', ')) {
      // Only classify the known model with its sentence boundary replaced.
      const repaired = text.replace(', ' + normalize(link) + ', ', '. ' + normalize(link) + ', ');
      if (models.some(model => normalize(model) === repaired)) {
        return { state: 'revise', message: 'These are two complete clauses. Use a full stop or semicolon before the linker.' };
      }
    }
    const isModelWithSemicolon = models.some(model => sentenceAdverbs.includes(normalize(link)) &&
      normalize(model).replace('. ' + normalize(link) + ', ', '; ' + normalize(link) + ', ') === text);
    if (isModelWithSemicolon) {
      return { state: 'correct', message: 'That works. The semicolon joins the two complete clauses.' };
    }
    return { state: 'review', message: 'Compare with the example. Check that both facts and the intended relationship are still clear.' };
  }

  window.LinkingInkChecker = { check };
})();
