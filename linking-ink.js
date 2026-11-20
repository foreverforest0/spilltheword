(() => {
  'use strict';
  // Vocabulary in B1 cards comes from B1 Course. B2 and C1 recycle B2 ALH.
  // Each option is a linker. Punctuation belongs to the two sentence halves.
  const banks = {
    b1: [
      ['although', 'because', 'so that', 'Lena is usually outgoing', 'she felt awkward at the party.', 'Contrast an expectation with what happened.', 'Talk about a time you felt awkward somewhere new.'],
      ['because', 'although', 'unless', 'I stay in touch with Sam', 'we get on well.', 'Give the reason you stay in touch.', 'Say why you stay in touch with someone.'],
      ['so', 'but', 'because', 'The plot was hard to follow', 'we read a summary afterwards.', 'Introduce the result of a confusing plot.', 'Explain what you did after watching a confusing film.'],
      ['even though', 'so that', 'because', 'The special effects were amazing', 'the film left me bored.', 'The second idea is surprising given the first.', 'Describe a film you expected to enjoy more.'],
      ['unless', 'even though', 'since', 'I won’t apply for the job', 'they can offer a better work-life balance.', 'The offer is the condition that would change your decision.', 'Name a condition that would change your mind about a job.'],
      ['so that', 'although', 'unless', 'I wrote down the deadline', 'I wouldn’t forget it.', 'Explain the purpose of writing it down.', 'Describe something you do to remember deadlines.'],
      ['while', 'because', 'so that', 'My sister is straightforward', 'I tend to be more sympathetic.', 'Compare two people with different ways of responding.', 'Compare your personality with someone else’s.'],
      ['but', 'so', 'because', 'I wanted to go hitchhiking', 'my friends talked me out of it.', 'Show how the second event went against your plans.', 'Talk about a plan a friend persuaded you to change.'],
    ],
    b2: [
      ['however', 'therefore', 'for instance', 'We tried to cut back on scrolling.', 'we kept picking up our phones.', 'The habit continued despite the plan.', 'Talk about a habit you tried to change.'],
      ['as a result', 'in contrast', 'for example', 'The smart meter made our energy use visible.', 'we started using less electricity.', 'Move from a cause to its consequence.', 'Describe a change that led to lower energy use.'],
      ['in addition', 'instead', 'nevertheless', 'The flat has double-glazing.', 'it has underfloor heating.', 'Add another feature of the same flat.', 'Describe two features of your ideal flat.'],
      ['whereas', 'because', 'so that', 'Nina is laid-back', 'her brother is bad-tempered.', 'Compare two opposite traits.', 'Compare two people’s reactions to stress.'],
      ['despite', 'because of', 'instead of', 'the backlash, the offbeat film director made a sequel.', '', 'Introduce an obstacle followed by a noun phrase.', 'Describe a decision someone made in the face of criticism.'],
      ['because of', 'in spite of', 'instead of', 'a fault in the thermostat, the flat got too cold.', '', 'Introduce the cause with a noun phrase.', 'Explain what caused a problem at home.'],
      ['in case', 'even though', 'now that', 'Save the footage', 'someone asks to see it later.', 'Take a precaution against a possible future request.', 'Describe a precaution you take on a trip.'],
      ['furthermore', 'on the contrary', 'instead', 'The park would give the community more open space.', 'it would cost very little to maintain.', 'Add a second argument for the same proposal.', 'Give two reasons to restore a local park.'],
    ],
    c1: [
      ['nevertheless', 'accordingly', 'in other words', 'The evidence looked increasingly misleading.', 'she remained adamant that the footage was genuine.', 'The second sentence holds despite the evidence in the first.', 'Describe a belief someone kept despite contrary evidence.'],
      ['accordingly', 'conversely', 'even so', 'The smart meter revealed a steep overnight increase.', 'the heating schedule was adjusted.', 'Introduce an action taken in response to the finding.', 'Suggest a decision based on a surprising piece of evidence.'],
      ['granted that', 'in order that', 'provided that', 'the proposal is ambitious, the community has enough funding to give it a shot.', '', 'Concede a point before qualifying its importance.', 'Acknowledge a drawback before defending a proposal.'],
      ['conversely', 'similarly', 'specifically', 'A constant stream of notifications makes it easy to get sidetracked.', 'a scroll-free evening can help you stay present.', 'Reverse the relationship described in the first sentence.', 'Contrast how you feel with and without notifications.'],
      ['insofar as', 'even if', 'unless', 'Automation is useful', 'it frees people from repetitive work.', 'Limit the claim to the extent that the benefit holds.', 'Qualify a claim about when technology is useful.'],
      ['albeit', 'as well as', 'owing to', 'The offbeat film was fruitful as a conversation starter', 'a little ideologically muddled.', 'Concede a limitation using a shortened clause.', 'Give a balanced opinion about a film.'],
      ['inasmuch as', 'even though', 'until', 'The two proposals are comparable', 'they both aim to restore public space.', 'Explain the respect in which the comparison is valid.', 'Compare two ideas that share the same aim.'],
      ['lest', 'given that', 'now that', 'She kept a copy of the footage', 'the original be deleted.', 'Introduce a feared outcome with a formal linker and a base verb.', 'Explain a precaution using a formal register.'],
    ],
  };

  const groups = {
    b1: 'Reason, result and contrast',
    b2: 'Contrast, addition and consequence',
    c1: 'Concession, qualification and inference',
  };
  const positions = { b1: 0, b2: 0, c1: 0 };
  const choices = (card, index) => [0, 1, 2].map(offset => card[(offset + index) % 3]);
  const capitalize = value => value[0].toUpperCase() + value.slice(1);
  function sentenceParts(level, index, linker) {
    const [, , , first, second] = banks[level][index];
    if (!second) return ['', capitalize(linker), ' ' + first];
    if (first.endsWith('.')) return [first + ' ', capitalize(linker), ', ' + second];
    const comma = ['so', 'but', 'while', 'whereas', 'albeit'].includes(linker);
    return [first + (comma ? ', ' : ' '), linker, ' ' + second];
  }

  function open(level) {
    seaOff();
    S.splevel = level;
    let oral = false;
    const cards = banks[level];

    function render(focus) {
      const index = positions[level];
      const [answer, , , first, second, hint, speaking] = cards[index];
      const options = choices(cards[index], index);
      const [before, , after] = sentenceParts(level, index, answer);
      setView(`
        <section id="linkingInk" data-practice-level="${level}" data-stw-plain>
          <header class="li-header">
            <button type="button" id="liBack">Topics</button>
            <h1>Linking words</h1>
            <span class="li-level">${level.toUpperCase()}</span>
          </header>
          <div class="li-workspace">
            <div class="li-top">
              <span>${groups[level]}</span>
              <output aria-label="Card ${index + 1} of ${cards.length}">${index + 1} / ${cards.length}</output>
            </div>
            <div class="li-mode" role="group" aria-label="Practice mode">
              <button type="button" id="liWritten" aria-pressed="${!oral}">Written</button>
              <button type="button" id="liOral" aria-pressed="${oral}">Oral</button>
            </div>
            <p>${oral ? 'Say the complete sentence aloud. Then open the example to compare.' : 'Choose the linker that joins the ideas in the intended way.'}</p>
            <div class="li-stage">
              <div class="li-ink" aria-hidden="true"><i></i><i></i></div>
              <div class="li-paper">
                <p class="li-fragments">${second ? `<span>${first}</span><span>${second}</span>` : `<span>${first}</span>`}</p>
                <p class="li-sentence">${before}<strong id="liGap"><span class="li-sr">missing linker</span><span aria-hidden="true">…</span></strong>${after}</p>
              </div>
            </div>
            <form id="liForm" ${oral ? 'hidden' : ''}>
              <fieldset>
                <legend class="li-sr">Choose a linker</legend>
                ${options.map(option => `<label><input type="radio" name="liLinker" value="${option}" required><span>${option}</span></label>`).join('')}
              </fieldset>
              <button type="submit">Check</button>
            </form>
            <p id="liFeedback" role="status"></p>
            <details><summary>Hint</summary><p>${hint}</p></details>
            <details><summary>Show example</summary>
              <p>${sentenceParts(level, index, answer).join('')}</p>
              ${oral ? `<p><strong>Your turn.</strong> ${speaking} Use <em>${answer}</em>.</p>` : ''}
            </details>
            <nav aria-label="Practice cards">
              <button type="button" id="liPrev" ${index === 0 ? 'disabled' : ''}>Previous</button>
              <button type="button" id="liNext" ${index === cards.length - 1 ? 'disabled' : ''}>Next</button>
            </nav>
          </div>
        </section>`);
      const root = document.getElementById('linkingInk');
      const get = id => root.querySelector('#' + id);
      const stage = root.querySelector('.li-stage');
      const gap = get('liGap');
      const feedback = get('liFeedback');
      const form = get('liForm');
      function resetAnswer() {
        stage.classList.remove('li-mixed');
        gap.innerHTML = '<span class="li-sr">missing linker</span><span aria-hidden="true">…</span>';
        feedback.textContent = '';
        delete feedback.dataset.result;
      }
      form.onchange = resetAnswer;
      form.onsubmit = event => {
        event.preventDefault();
        const selected = new FormData(form).get('liLinker');
        if (!options.includes(selected)) return;
        const correct = selected === answer;
        stage.classList.toggle('li-mixed', correct);
        if (correct) gap.textContent = sentenceParts(level, index, answer)[1];
        feedback.dataset.result = correct ? 'correct' : 'retry';
        feedback.textContent = correct ? 'Correct. ' + hint : 'Try another linker. ' + hint;
      };
      if (oral) root.querySelector('details:last-of-type').addEventListener('toggle', event => {
        const shown = event.currentTarget.open;
        stage.classList.toggle('li-mixed', shown);
        if (shown) gap.textContent = sentenceParts(level, index, answer)[1];
        else resetAnswer();
      });
      get('liBack').onclick = () => { S.glevel = level; go('gram'); };
      get('liWritten').onclick = () => { if (oral) { oral = false; render('liWritten'); } };
      get('liOral').onclick = () => { if (!oral) { oral = true; render('liOral'); } };
      get('liPrev').onclick = () => { positions[level]--; render('liPrev'); };
      get('liNext').onclick = () => { positions[level]++; render('liNext'); };
      if (focus) {
        const target = get(focus);
        (target.disabled ? get(focus === 'liNext' ? 'liPrev' : 'liNext') : target).focus();
      } else window.scrollTo(0, 0);
    }
    render();
  }

  for (const level of Object.keys(banks)) {
    const id = 'linking_ink_' + level;
    DMT[id] = 1;
    DMTF[id] = () => open(level);
    SPSHORT[id] = 'Linking words · mixing inks';
    SPT.push({ id, n: SPSHORT[id], d: 'Join two ideas with a linker and watch the inks mix.' });
    const topics = SPGRP[level];
    const existing = topics.filter(([name]) => /^\d+\s*·/.test(name) && /linking|linkers|connectors/i.test(name));
    if (existing.length) {
      existing.forEach(([, ids]) => ids.push(id));
    } else {
      const number = 1 + Math.max(0, ...topics.map(([name]) => parseInt(name, 10) || 0));
      topics.push([number + ' · Linking words', [id]]);
    }
    SPLV.find(([key]) => key === level)?.[2].push(id);
  }
})();
