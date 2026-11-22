(() => {
  'use strict';
  const levels = window.FutureOrdersData;
  const labels = {
    decision: 'Decide now', intention: 'Intention', prediction: 'Prediction',
    arrangement: 'Arrangement', schedule: 'Timetable', ongoing: 'In progress',
    complete: 'Done by then', duration: 'Duration',
  };
  const key = 'spill-future-orders-v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(key)) || {}; } catch {}
  function save() {
    try { localStorage.setItem(key, JSON.stringify(saved)); } catch {}
  }
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch]);
  function normalize(value) {
    return value.toLowerCase().trim().replace(/[‘’]/g, "'")
      .replace(/[,.!?;]/g, '').replace(/\s+/g, ' ')
      .replace(/\b(i|you|he|she|we|they)'ll\b/g, '$1 will')
      .replace(/\bi'm\b/g, 'i am')
      .replace(/\b(you|we|they)'re\b/g, '$1 are')
      .replace(/\b(he|she|it)'s going\b/g, '$1 is going');
  }
  function check(card, answer) {
    const text = normalize(answer);
    if (!text) return ['empty', 'Write a sentence.'];
    const models = card.answers.map(normalize);
    if (models.includes(text)) return ['correct', 'That works. The future form fits the situation.'];
    const commonErrors = [
      ['will be editing', 'will editing'],
      ['will be hiking', 'will hiking'],
      ['will be discussing', 'will discussing'],
      ['will have restored', 'will have restore'],
      ['will have installed', 'will have install'],
      ['will have been editing', 'will have editing'],
      ['will have been doing', 'will have doing'],
      ['am going to', 'am going'],
      ['are going to', 'are going'],
      ['is going to', 'is going'],
    ];
    if (models.some(model => commonErrors.some(([from, to]) => model.includes(from) && model.replace(from, to) === text))) {
      return ['revise', card.hint];
    }
    return ['review', 'Compare with the example. Check whether your sentence keeps the same meaning and uses the future form requested.'];
  }
  window.FutureOrdersChecker = { check };

  function open(level) {
    seaOff();
    S.splevel = level;
    const cards = levels[level];
    const state = saved[level] ??= { index: 0, oral: false, drafts: {} };
    setView(`
      <section id="futureOrders" data-practice-level="${level}" data-stw-plain>
        <header class="fo-header">
          <button id="foBack" type="button">Topics</button>
          <h1>Future forms</h1>
          <span>${level.toUpperCase()}</span>
        </header>
        <div class="fo-workspace">
          <div class="fo-rack" role="group" aria-label="Order rack. Use Left and Right to turn it">
            <i class="fo-rail" aria-hidden="true"></i>
            ${cards.map((card,i) => `<button class="fo-ticket" type="button" data-order="${i}" data-kind="${card.kind}">
              <span class="fo-hanger" aria-hidden="true"></span>
              <span class="fo-paper"><strong>${esc(card.title)}</strong><span class="fo-stamp">${labels[card.kind]}</span></span>
            </button>`).join('')}
          </div>
          <nav aria-label="Orders">
            <button id="foPrev" type="button">Previous order</button>
            <output id="foCount"></output>
            <button id="foNext" type="button">Next order</button>
          </nav>
          <article id="foOrder"></article>
        </div>
      </section>`);
    const root = document.getElementById('futureOrders');
    const get = id => root.querySelector('#' + id);
    const rack = root.querySelector('.fo-rack');
    const tickets = [...rack.querySelectorAll('[data-order]')];

    function positionTickets() {
      for (const [i, ticket] of tickets.entries()) {
        const angle = (i - state.index) * 2 * Math.PI / tickets.length;
        const depth = (Math.cos(angle) + 1) / 2;
        const x = Math.sin(angle);
        ticket.style.setProperty('--fo-x', (50 + 39 * x) + '%');
        ticket.style.setProperty('--fo-y', (27 + 66 * depth) + 'px');
        ticket.style.setProperty('--fo-scale', .47 + .53 * depth);
        ticket.style.setProperty('--fo-turn', (-60 * x) + 'deg');
        ticket.style.opacity = String(.34 + .66 * depth);
        ticket.style.zIndex = String(1 + Math.round(100 * depth));
        const isCurrent = i === state.index;
        ticket.tabIndex = isCurrent ? 0 : -1;
        ticket.setAttribute('aria-current', isCurrent ? 'true' : 'false');
      }
    }
    function render(focusId) {
      const card = cards[state.index];
      const draft = state.drafts[card.id] ??= {};
      positionTickets();
      get('foCount').textContent = `${state.index + 1} / ${cards.length}`;
      get('foCount').setAttribute('aria-label', `Order ${state.index + 1} of ${cards.length}`);
      get('foOrder').innerHTML = `
        <h2>${esc(card.title)}</h2>
        <p class="fo-context">${esc(card.context)}</p>
        <p id="foPrompt">${esc(card.prompt.replace(/Write or say (?:one|a) (?:full )?sentence[.!]?/gi,'').trim() || card.prompt)}</p>

          <form id="foForm">
            <textarea id="foAnswer" aria-label="Your sentence" aria-describedby="foPrompt" rows="2" maxlength="1200">${esc(draft.text)}</textarea>
            <button type="submit">Check</button>
          </form>
          <p id="foFeedback" role="status" data-result="${esc(draft.result?.[0])}">${esc(draft.result?.[1])}</p>
        <details id="foHint" ${draft.hint ? 'open' : ''}><summary>Hint</summary><p>${esc(card.hint)}</p></details>
        <details id="foExample" ${draft.example ? 'open' : ''}><summary>Show answer</summary><p>${esc(card.answers[0])}</p></details>`;
      const field = get('foAnswer');
      if (field) {
        const status = get('foFeedback');
        field.oninput = () => {
          draft.text = field.value;
          delete draft.result;
          status.textContent = '';
          delete status.dataset.result;
          save();
        };
        get('foForm').onsubmit = event => {
          event.preventDefault();
          draft.result = check(card, field.value);
          status.dataset.result = draft.result[0];
          status.textContent = draft.result[1];
          save();
        };
      }
      get('foHint').ontoggle = event => { draft.hint = event.currentTarget.open; save(); };
      get('foExample').ontoggle = event => { draft.example = event.currentTarget.open; save(); };
      if (focusId) get(focusId)?.focus({ preventScroll: true });
      save();
    }
    function to(index, focus) {
      state.index = (index + cards.length) % cards.length;
      render();
      if (focus) tickets[state.index].focus({ preventScroll: true });
    }
    tickets.forEach((ticket, index) => {
      ticket.onclick = () => {
        if (index === state.index) get('foOrder').scrollIntoView({ block: 'nearest' });
        else to(index, true);
      };
      ticket.onkeydown = event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        to(state.index + (event.key === 'ArrowRight' ? 1 : -1), true);
      };
    });
    get('foPrev').onclick = () => to(state.index - 1);
    get('foNext').onclick = () => to(state.index + 1);
    get('foBack').onclick = () => { S.glevel = level; go('gram'); };
    render();
    window.scrollTo(0, 0);
  }

  for (const level of Object.keys(levels)) {
    const id = 'future_orders_' + level;
    DMT[id] = 1;
    DMTF[id] = () => open(level);
    SPSHORT[id] = 'Future forms · rotating order rack';
    SPT.push({ id, n: SPSHORT[id], d: 'Turn the rack and choose the future form that fits each order.' });
    const topics = SPGRP[level];
    const futureTopic = topics.find(([name]) => /^\d+\s*·/.test(name) && /\bfuture\b/i.test(name));
    if (futureTopic) futureTopic[1].push(id);
    else {
      const revision = topics.findIndex(([, ids]) => ids.includes('revision_room'));
      const number = 1 + Math.max(0, ...topics.filter((_, i) => i !== revision).map(([name]) => parseInt(name, 10) || 0));
      if (revision !== -1) topics[revision][0] = (number + 1) + ' · Revision room';
      topics.splice(revision === -1 ? topics.length : revision, 0, [number + ' · Future forms', [id]]);
    }
    const ids = SPLV.find(([key]) => key === level)?.[2];
    if (ids && !ids.includes(id)) {
      const revision = ids.indexOf('revision_room');
      ids.splice(revision === -1 ? ids.length : revision, 0, id);
    }
  }
})();
