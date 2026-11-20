(() => {
  'use strict';
  const levels = window.CausativeSceneData;
  const storageKey = 'spill-causative-scene-v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch {}
  }
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch]);
  function normalize(value) {
    return value.toLowerCase().trim().replace(/[‘’]/g, "'")
      .replace(/\s+/g, ' ').replace(/[,.;!?]/g, '').trim()
      .replace(/\bwill've\b/g, 'will have')
      .replace(/\bshould've\b/g, 'should have')
      .replace(/\b(noah|elif)'ll\b/g, '$1 will')
      .replace(/\b(mina|omar)'s had\b/g, '$1 has had')
      .replace(/\b(zoe|ada)'s (having|getting|going)\b/g, '$1 is $2')
      .replace(/\bgotten\b/g, 'got');
  }
  function check(card, answer) {
    const text = normalize(answer);
    if (!text) return ['empty', 'Write a sentence or switch to Oral.'];
    const models = card.answers.map(normalize);
    if (models.includes(text)) return ['correct', 'That works. Your sentence matches the roles in the scene.'];
    const [verb] = card.action.toLowerCase().split(' ');
    const nearError = models.some(model => {
      if (card.kind === 'self') return false;
      const participles = { take: 'taken', steal: 'stolen', break: 'broken' };
      const participle = participles[verb] || (verb.endsWith('e') ? verb + 'd' : verb + 'ed');
      return model.includes(' ' + participle) && model.replace(' ' + participle, ' ' + verb) === text;
    });
    if (nearError) return ['revise', 'Use the past participle after the object. ' + card.hint];
    return ['review', 'Compare with the example. Check who did the work and whether someone arranged it or experienced it.' ];
  }
  window.CausativeSceneChecker = { check };

  const roles = {
    arrange: ['Organises the service', 'Does the work'],
    self: ['Does it personally', 'Does something else'],
    event: ['Experiences the event', 'Causes the event'],
  };
  const actionMenu = {
    arrange: 'Arrange the service',
    self: 'Help with something else',
    event: 'Experience the incident',
  };
  const kindName = { all: 'All situations', arrange: 'Arrange a service', self: 'Do it yourself', event: 'Unwanted events' };

  function open(level) {
    seaOff();
    S.splevel = level;
    const state = saved[level] ??= { filter: 'all', index: 0, oral: false, drafts: {} };
    let actor = null;
    let feedback = '';
    let animation;
    const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

    function render(focusId) {
      const cards = levels[level].filter(card => state.filter === 'all' || card.kind === state.filter);
      const card = cards[state.index];
      const performer = card.kind === 'self' ? 0 : 1;
      const draft = state.drafts[card.id] ??= {};
      const menu = [card.action, actionMenu[card.kind]];
      const ordered = state.index % 2 ? menu : menu.slice().reverse();
      setView(`
        <section id="causativeScene" data-practice-level="${level}" data-stw-plain>
          <header class="ce-header">
            <button type="button" id="ceBack">Topics</button>
            <h1>Have / get something done</h1>
            <span class="ce-level">${level.toUpperCase()}</span>
          </header>
          <div class="ce-workspace">
            <div class="ce-meta">
              <div class="ce-filters" role="group" aria-label="Situation type">
                ${['all', 'arrange', 'self', ...(level === 'b1' ? [] : ['event'])].map(name => `<button type="button" id="ce-filter-${name}" data-filter="${name}" aria-pressed="${name === state.filter}">${kindName[name]}</button>`).join('')}
              </div>
              <output aria-label="Situation ${state.index + 1} of ${cards.length}">${state.index + 1} / ${cards.length}</output>
            </div>
            <h2>${esc(card.title)}</h2>
            <p class="ce-context">${esc(card.context)}</p>
            <p id="ceTask">Select the person who carries out the main action, then choose what they do.</p>
            <div class="ce-scene" data-scene="${card.scene}" data-complete="${!!draft.complete}" aria-describedby="ceTask">
              <div class="ce-land" aria-hidden="true"><i></i><i></i><i></i></div>
              <div class="ce-object"><i aria-hidden="true"></i><span>${esc(card.object)}</span></div>
              ${card.people.map((name, i) => `
                <div class="ce-person ce-person-${i}" data-selected="${actor === i}" data-performer="${performer === i}">
                  <button type="button" class="ce-actor" id="ce-actor-${i}" data-actor="${i}" aria-expanded="${actor === i}" aria-controls="ceTools">
                    <span class="ce-figure" aria-hidden="true"><i></i><i></i><i></i></span>
                    <span class="ce-name">${esc(name)}</span>
                    ${draft.complete ? `<small>${roles[card.kind][i]}</small>` : ''}
                  </button>
                </div>
              `).join('')}
              <div class="ce-tools" id="ceTools" data-actor="${actor ?? ''}" role="group" aria-label="${actor === null ? 'Actions' : `Actions for ${esc(card.people[actor])}`}" ${actor === null ? 'hidden' : ''}>
                ${ordered.map((verb, i) => `<button type="button" id="ce-action-${i}" data-does="${verb === card.action}">${esc(verb)}</button>`).join('')}
              </div>
            </div>
            <p id="ceSceneNote" role="status">${esc(feedback)}</p>
            <p id="cePrompt">${esc(card.prompt)}</p>
            <div class="ce-modes" role="group" aria-label="Practice mode">
              <button type="button" id="ceWritten" aria-pressed="${!state.oral}">Written</button>
              <button type="button" id="ceOral" aria-pressed="${state.oral}">Oral</button>
            </div>
            ${state.oral ? '<p>Say your sentence aloud, then open the example to compare.</p>' : `
              <form id="ceForm">
                <textarea id="ceAnswer" aria-label="Your sentence" aria-describedby="cePrompt" rows="3" maxlength="1200">${esc(draft.text)}</textarea>
                <button type="submit">Check</button>
              </form>
              <p id="ceFeedback" role="status" data-result="${esc(draft.result?.[0])}">${esc(draft.result?.[1])}</p>
            `}
            <details id="ceHint" ${draft.hint ? 'open' : ''}><summary>Hint</summary><p>${esc(card.hint)}</p></details>
            <details id="ceExample" ${draft.example ? 'open' : ''}><summary>Show example</summary><p>${esc(card.answers[0])}</p></details>
            <nav aria-label="Situations">
              <button type="button" id="cePrev" ${state.index === 0 ? 'disabled' : ''}>Previous</button>
              <button type="button" id="ceNext" ${state.index === cards.length - 1 ? 'disabled' : ''}>Next</button>
            </nav>
          </div>
        </section>`);

      const root = document.getElementById('causativeScene');
      const get = id => root.querySelector('#' + id);
      get('ceBack').onclick = () => { S.glevel = level; go('gram'); };
      root.querySelectorAll('[data-filter]').forEach(button => {
        button.onclick = () => {
          state.filter = button.dataset.filter;
          move(0, button.id);
        };
      });
      root.querySelectorAll('button[data-actor]').forEach(button => {
        button.onclick = () => {
          const next = Number(button.dataset.actor);
          actor = next === actor ? null : next;
          feedback = '';
          render(actor === null ? button.id : 'ce-action-0');
        };
      });
      get('ceTools').onkeydown = event => {
        if (event.key === 'Escape') {
          const target = 'ce-actor-' + actor;
          actor = null;
          render(target);
        }
      };
      root.querySelectorAll('[data-does]').forEach(button => {
        button.onclick = () => {
          if (actor === performer && button.dataset.does === 'true') {
            draft.complete = true;
            feedback = card.kind === 'arrange' ? `${card.people[0]} is the organiser. The work is done by ${card.people[1]}.` :
              card.kind === 'event' ? `${card.people[0]} experiences the event without arranging it.` :
              `${card.people[0]} does the work personally.`;
            actor = null;
            render('ce-actor-' + performer);
            const scene = document.querySelector('#causativeScene .ce-scene');
            if (!reduced()) {
              animation?.cancel();
              const figure = scene.querySelector('[data-performer=true] .ce-figure');
              const direction = performer === 0 ? '1' : '-1';
              animation = figure.animate([
                { transform: 'translateX(0) rotate(0deg)' },
                { transform: `translateX(calc(${direction} * 22px)) rotate(${performer === 0 ? 12 : -12}deg) translateY(-8px)` },
                { transform: 'translateX(0) rotate(0deg)' },
              ], { duration: 670, easing: 'ease-in-out' });
              scene.querySelector('.ce-object i').animate([
                { opacity: .88, scale: 1 }, { opacity: 1, scale: 1.17 }, { opacity: .88, scale: 1 },
              ], { duration: 680, delay: 160, easing: 'ease-out' });
            }
          } else {
            const message = actor !== performer ? 'Look at who actually carries out the action in the situation.' :
              'You found the person. Choose the main action they carry out.';
            feedback = message;
            get('ceSceneNote').textContent = message;
          }
        };
      });
      const input = get('ceAnswer');
      if (input) {
        const status = get('ceFeedback');
        input.oninput = () => {
          draft.text = input.value;
          delete draft.result;
          status.textContent = '';
          delete status.dataset.result;
          save();
        };
        get('ceForm').onsubmit = event => {
          event.preventDefault();
          draft.result = check(card, input.value);
          status.dataset.result = draft.result[0];
          status.textContent = draft.result[1];
          save();
        };
      }
      get('ceHint').ontoggle = event => { draft.hint = event.currentTarget.open; save(); };
      get('ceExample').ontoggle = event => { draft.example = event.currentTarget.open; save(); };
      get('ceWritten').onclick = () => { if (state.oral) { state.oral = false; render('ceWritten'); } };
      get('ceOral').onclick = () => { if (!state.oral) { state.oral = true; render('ceOral'); } };
      function move(index, target) {
        actor = null;
        feedback = '';
        state.index = index;
        render(target);
      }
      get('cePrev').onclick = () => move(state.index - 1, state.index === 1 ? 'ceNext' : 'cePrev');
      get('ceNext').onclick = () => move(state.index + 1, state.index === cards.length - 2 ? 'cePrev' : 'ceNext');
      if (focusId) get(focusId)?.focus({ preventScroll: true });
      save();
    }

    render();
    window.scrollTo(0, 0);
  }

  for (const level of Object.keys(levels)) {
    const id = 'causative_scene_' + level;
    DMT[id] = 1;
    DMTF[id] = () => open(level);
    SPSHORT[id] = 'Have / get something done · scene editor';
    SPT.push({ id, n: SPSHORT[id], d: 'Choose who performs the action, then describe what happened.' });
    const topics = SPGRP[level];
    const matching = topics.find(([name]) => /^\d+\s*·/.test(name) && /causative|have\s*\/\s*get something done/i.test(name));
    if (matching) matching[1].push(id);
    else {
      const revision = topics.findIndex(([, ids]) => ids.includes('revision_room'));
      const number = 1 + Math.max(0, ...topics.filter((_, i) => i !== revision).map(([name]) => parseInt(name, 10) || 0));
      if (revision !== -1) topics[revision][0] = (number + 1) + ' · Revision room';
      topics.splice(revision === -1 ? topics.length : revision, 0, [number + ' · Have / get something done', [id]]);
    }
    const ids = SPLV.find(([key]) => key === level)?.[2];
    if (ids && !ids.includes(id)) {
      const revision = ids.indexOf('revision_room');
      ids.splice(revision === -1 ? ids.length : revision, 0, id);
    }
  }
})();
