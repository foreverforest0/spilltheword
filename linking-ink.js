(() => {
  'use strict';
  const { levels } = window.LinkingInkData;
  const { check } = window.LinkingInkChecker;
  const key = 'spill-linking-ink-v2';
  const relations = {
    contrast: ['Contrast', 'Show a contrast between the two facts.'],
    reason: ['Reason', 'Show why the action or situation happened.'],
    result: ['Result', 'Show what happened as a result.'],
    purpose: ['Purpose and precaution', 'Show what someone wanted to achieve or prevent.'],
    addition: ['Addition', 'Add the second idea to the first.'],
    time: ['Time', 'Show how the timing of the two events is related.'],
    condition: ['Condition', 'Show the condition or exception, or that the outcome holds either way.'],
  };
  const tips = {
    contrast: 'Look for a linker that contrasts facts or introduces a concession.',
    reason: 'Look for a linker that introduces an explanation.',
    result: 'Look for a linker that introduces a consequence.',
    purpose: 'Look for a linker that introduces an aim or a precaution.',
    addition: 'Look for a linker that adds another point.',
    time: 'Look for a linker that places the two events in time.',
    condition: 'Look for a linker that introduces a condition or exception.',
  };
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(key)) || {}; } catch {}
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch]);
  function save() {
    try { localStorage.setItem(key, JSON.stringify(saved)); } catch {}
  }

  function open(level) {
    seaOff();
    S.splevel = level;
    const state = saved[level] ??= { filter: 'all', index: 0, oral: false, cards: {} };

    function render(focusId, animate = false) {
      const cards = levels[level].filter(card => state.filter === 'all' || card.relation === state.filter);
      state.index = Math.min(state.index, cards.length - 1);
      const card = cards[state.index];
      const progress = state.cards[card.id] ??= { linker: '', answers: {} };
      const link = Object.hasOwn(card.links, progress.linker) ? progress.linker : '';
      const answer = progress.answers[link] ??= {};
      const [relation, instruction] = relations[card.relation];
      const model = card.links[link];
      const linkMessage = link ? 'That linker fits. Now join the two facts.' :
        progress.rejected ? 'That linker signals a different relationship. Try one that expresses ' + relation.toLowerCase() + '.' : '';

      setView(`
        <section id="linkingInk" data-practice-level="${level}" data-stw-plain>
          <header class="li-header">
            <button type="button" id="liBack">Topics</button>
            <h1>Linking words</h1>
            <span class="li-level">${level.toUpperCase()}</span>
          </header>
          <div class="li-workspace">
            <div class="li-top">
              <label for="liFilter">Relationship</label>
              <select id="liFilter">
                <option value="all">All relationships</option>
                ${Object.entries(relations).map(([id, [name]]) => `<option value="${id}" ${id === state.filter ? 'selected' : ''}>${name}</option>`).join('')}
              </select>
              <output aria-label="Card ${state.index + 1} of ${cards.length}">${state.index + 1} / ${cards.length}</output>
            </div>
            <h2>${relation}</h2>
            <p>${instruction} Choose a linker, then join the facts.</p>
            <div class="li-stage ${link ? 'li-mixed' : ''} ${animate ? 'li-fresh-mix' : ''}">
              <div class="li-ink" aria-hidden="true"><i></i><i></i></div>
              <div class="li-facts">${card.facts.map(fact => `<p>${escape(fact)}</p>`).join('')}</div>
            </div>
            <div class="li-options" role="group" aria-label="Choose a linker">
              ${card.choices.map(({ text }, i) => `<button type="button" id="liOption${i}" data-option="${escape(text)}" aria-pressed="${text === link}">${escape(text)}</button>`).join('')}
            </div>
            <p id="liLinkFeedback" role="status">${escape(linkMessage)}</p>
            ${link ? `
              <div class="li-mode" role="group" aria-label="Practice mode">
                <button type="button" id="liWritten" aria-pressed="${!state.oral}">Written</button>
                <button type="button" id="liOral" aria-pressed="${state.oral}">Oral</button>
              </div>
              ${state.oral ? `<p>Say your answer aloud using <strong>${escape(link)}</strong>. Then compare with the example.</p>` : `
                <form id="liForm">
                  <label for="liAnswer">Join the facts using <strong>${escape(link)}</strong>.</label>
                  <textarea rows="3" maxlength="1200" id="liAnswer">${escape(answer.text)}</textarea>
                  <button type="submit">Check</button>
                </form>
                <p id="liFeedback" role="status" data-result="${escape(answer.result?.state)}">${escape(answer.result?.message)}</p>
              `}
            ` : ''}
            <details id="liHint" ${progress.hint ? 'open' : ''}><summary>Hint</summary><p>${escape(model?.hint || tips[card.relation])}</p></details>
            <details id="liExample" ${answer.example ? 'open' : ''}>
              <summary>Show example</summary>
              <p>${escape((model || Object.values(card.links)[0]).answers[0])}</p>
            </details>
            <nav aria-label="Practice cards">
              <button type="button" id="liPrev" ${state.index === 0 ? 'disabled' : ''}>Previous</button>
              <button type="button" id="liNext" ${state.index === cards.length - 1 ? 'disabled' : ''}>Next</button>
            </nav>
          </div>
        </section>`);

      const root = document.getElementById('linkingInk');
      const get = id => root.querySelector('#' + id);
      get('liBack').onclick = () => { S.glevel = level; go('gram'); };
      get('liFilter').onchange = event => {
        state.filter = event.target.value;
        state.index = 0;
        render('liFilter');
      };
      root.querySelectorAll('[data-option]').forEach(button => {
        button.onclick = () => {
          const option = button.dataset.option;
          const mixed = Object.hasOwn(card.links, option);
          if (mixed && option === link) return;
          progress.linker = mixed ? option : '';
          progress.rejected = !mixed;
          render(button.id, mixed && !link);
        };
      });
      get('liHint').ontoggle = event => { progress.hint = event.currentTarget.open; save(); };
      get('liExample').ontoggle = event => { answer.example = event.currentTarget.open; save(); };
      if (link) {
        get('liWritten').onclick = () => { if (state.oral) { state.oral = false; render('liWritten'); } };
        get('liOral').onclick = () => { if (!state.oral) { state.oral = true; render('liOral'); } };
      }
      const input = get('liAnswer');
      if (input) {
        const feedback = get('liFeedback');
        input.oninput = () => {
          answer.text = input.value;
          delete answer.result;
          feedback.textContent = '';
          delete feedback.dataset.result;
          save();
        };
        get('liForm').onsubmit = event => {
          event.preventDefault();
          answer.result = check(link, model.answers, input.value);
          feedback.dataset.result = answer.result.state;
          feedback.textContent = answer.result.message;
          save();
        };
      }
      function move(offset) {
        state.index += offset;
        render('liFilter');
        window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      }
      get('liPrev').onclick = () => move(-1);
      get('liNext').onclick = () => move(1);
      get(focusId)?.focus({ preventScroll: true });
      save();
    }
    render();
    window.scrollTo(0, 0);
  }

  for (const level of Object.keys(levels)) {
    const id = 'linking_ink_' + level;
    DMT[id] = 1;
    DMTF[id] = () => open(level);
    SPSHORT[id] = 'Linking words · mixing inks';
    SPT.push({ id, n: SPSHORT[id], d: 'Join two facts with a linker and watch the inks mix.' });
    const topics = SPGRP[level];
    const existing = topics.filter(([name]) => /^\d+\s*·/.test(name) && /linking|linkers|connectors/i.test(name));
    if (existing.length) {
      existing.forEach(([, ids]) => { if (!ids.includes(id)) ids.push(id); });
    } else {
      const revision = level === 'b1' ? topics.findIndex(([name]) => /revision room/i.test(name)) : -1;
      const number = 1 + Math.max(0, ...topics.filter((_, i) => i !== revision).map(([name]) => parseInt(name, 10) || 0));
      if (revision !== -1) topics[revision][0] = (number + 1) + ' · Revision room';
      topics.splice(revision === -1 ? topics.length : revision, 0, [number + ' · Linking words', [id]]);
    }
    const ids = SPLV.find(([key]) => key === level)?.[2];
    if (ids && !ids.includes(id)) {
      const revision = ids.indexOf('revision_room');
      ids.splice(revision === -1 ? ids.length : revision, 0, id);
    }
  }
})();
