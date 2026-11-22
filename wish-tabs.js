(() => {
  'use strict';
  const levels = window.WishTabsData;
  const tabs = [
    ['now', 'Now'],
    ['past', 'Past'],
    ['change', 'Change'],
    ['ability', 'Ability'],
  ];
  const storageKey = 'spill-wish-tabs-v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch {}
  }
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch]);
  function normalize(value) {
    return value.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim()
      .replace(/[.!?]+$/, '')
      .replace(/^i wish that /, 'i wish ')
      .replace(/\b(i|we|you|he|she|they)'d (?=(?:checked|waited|been)\b)/g, '$1 had ')
      .replace(/\b(had|were|was|did|could|would)n't\b/g, '$1 not');
  }
  function check(card, response) {
    const value = normalize(response);
    if (!value) return ['empty', 'Write a sentence.'];
    const models = card.answers.map(normalize);
    if (models.includes(value)) return ['correct', 'That works. Your sentence expresses the wish in this situation.'];
    const likelyErrors = {
      now: [
        [/\bi (?:were|was)\b/, 'i am'],
        [/\bwere\b|\bwas\b/, 'is'],
        [/\bdid not\b/, 'do not'],
      ],
      past: [
        [/\bhad not deleted\b/, 'did not delete'],
        [/\bhad not sold\b/, 'did not sell'],
        [/\bhad not ignored\b/, 'did not ignore'],
        [/\bhad not shared\b/, 'did not share'],
        [/\bhad not left\b/, 'did not leave'],
        [/\bhad checked\b/, 'checked'],
        [/\bhad waited\b/, 'waited'],
        [/\bhad restored\b/, 'restored'],
      ],
      change: [[/\bwould\b/, 'will']],
      ability: [[/\bcould\b/, 'can']],
    };
    if (models.some(model => likelyErrors[card.kind].some(([pattern, substitute]) =>
      pattern.test(model) && model.replace(pattern, substitute) === value))) {
      return ['revise', card.hint];
    }
    return ['review', 'Compare with the example. Does your sentence express the same wish about this situation?'];
  }
  window.WishTabsChecker = { check };

  function open(level) {
    seaOff();
    S.splevel = level;
    const state = saved[level] ??= { tab: 0, indices: {}, oral: false, responses: {} };
    setView(`
      <section id="wishTabs" data-practice-level="${level}" data-stw-plain>
        <header class="wt-header">
          <button type="button" id="wtBack">Topics</button>
          <h1>Wish / If only</h1>
          <span>${level.toUpperCase()}</span>
        </header>
        <div class="wt-window">
          <div class="wt-tabs" role="tablist" aria-label="Type of wish">
            <span class="wt-slider" aria-hidden="true"></span>
            <svg class="wt-rail" aria-hidden="true">
              <path class="wt-rail-track"></path>
              <path class="wt-rail-active"></path>
            </svg>
            ${tabs.map(([kind, title], i) => `
              <button type="button" role="tab" id="wt-tab-${kind}" aria-controls="wtPanel" data-tab="${i}">${title}</button>
            `).join('')}
          </div>
          <div id="wtPanel" role="tabpanel"></div>
        </div>
      </section>`);
    const root = document.getElementById('wishTabs');
    const get = id => root.querySelector('#' + id);
    const panel = get('wtPanel');
    const buttons = [...root.querySelectorAll('[role=tab]')];
    const rail = root.querySelector('.wt-rail');
    const track = rail.querySelector('.wt-rail-track');
    const active = rail.querySelector('.wt-rail-active');
    let railStops = [];
    function positionRail() {
      if (railStops.length) active.style.strokeDashoffset = String(54 - railStops[state.tab]);
    }
    function layoutRail() {
      if (!root.isConnected) { railObserver.disconnect(); return; }
      const width = rail.clientWidth;
      if (!width) return;
      const x = width - 32;
      const radius = 64;
      const start = 16;
      const line = x - radius - start;
      const path = `M ${start} 30 H ${x - radius} A ${radius} ${radius} 0 0 1 ${x} ${30 + radius} V 362`;
      track.setAttribute('d', path);
      active.setAttribute('d', path);
      const corner = line + radius * Math.PI / 2;
      railStops = [width * .285 - start, width * .625 - start, corner + 30, corner + 150];
      positionRail();
    }
    const railObserver = new ResizeObserver(layoutRail);
    railObserver.observe(rail);


    function render(focusId) {
      const [kind] = tabs[state.tab];
      const cards = levels[level].filter(card => card.kind === kind);
      const index = state.indices[kind] || 0;
      const card = cards[index];
      const draft = state.responses[card.id] ??= {};
      root.style.setProperty('--wt-active', state.tab);
      positionRail();
      root.dataset.kind = kind;
      buttons.forEach((button, i) => {
        button.setAttribute('aria-selected', String(i === state.tab));
        button.tabIndex = i === state.tab ? 0 : -1;
      });
      panel.setAttribute('aria-labelledby', buttons[state.tab].id);
      panel.innerHTML = `
        <div class="wt-title">
          <h2>${escape(card.title)}</h2>
          <output aria-label="Situation ${index + 1} of ${cards.length}">${index + 1} / ${cards.length}</output>
        </div>
        <p class="wt-context">${escape(card.context)}</p>
        <p id="wtPrompt">${escape(card.prompt)}</p>

          <form id="wtForm">
            <textarea id="wtAnswer" aria-label="Your sentence" aria-describedby="wtPrompt" rows="3" maxlength="1200">${escape(draft.text)}</textarea>
            <button type="submit">Check</button>
          </form>
          <p id="wtFeedback" role="status" data-result="${escape(draft.result?.[0])}">${escape(draft.result?.[1])}</p>
        <details id="wtHint" ${draft.hint ? 'open' : ''}><summary>Hint</summary><p>${escape(card.hint)}</p></details>
        <details id="wtExample" ${draft.example ? 'open' : ''}><summary>Show example</summary><p>${escape(card.answers[0])}</p></details>
        <nav aria-label="Situations">
          <button type="button" id="wtPrev" ${index === 0 ? 'disabled' : ''}>Previous</button>
          <button type="button" id="wtNext" ${index === cards.length - 1 ? 'disabled' : ''}>Next</button>
        </nav>`;
      const input = get('wtAnswer');
      if (input) {
        const feedback = get('wtFeedback');
        input.oninput = () => {
          draft.text = input.value;
          delete draft.result;
          feedback.textContent = '';
          delete feedback.dataset.result;
          save();
        };
        get('wtForm').onsubmit = event => {
          event.preventDefault();
          draft.result = check(card, input.value);
          feedback.dataset.result = draft.result[0];
          feedback.textContent = draft.result[1];
          save();
        };
      }
      get('wtHint').ontoggle = event => { draft.hint = event.currentTarget.open; save(); };
      get('wtExample').ontoggle = event => { draft.example = event.currentTarget.open; save(); };
      get('wtPrev').onclick = () => { state.indices[kind] = index - 1; render(index === 1 ? 'wtNext' : 'wtPrev'); };
      get('wtNext').onclick = () => { state.indices[kind] = index + 1; render(index === cards.length - 2 ? 'wtPrev' : 'wtNext'); };
      if (focusId) get(focusId)?.focus({ preventScroll: true });
      save();
    }

    function switchTab(next) {
      if (next !== state.tab) {
        state.tab = next;
        render();
      }
      buttons[next].focus({ preventScroll: true });
    }
    buttons.forEach((button, i) => {
      button.onclick = () => switchTab(i);
      button.onkeydown = event => {
        const next = {
          ArrowLeft: (i + tabs.length - 1) % tabs.length,
          ArrowRight: (i + 1) % tabs.length,
          Home: 0,
          End: tabs.length - 1,
        }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        switchTab(next);
      };
    });
    get('wtBack').onclick = () => { S.glevel = level; go('gram'); };
    render();
    window.scrollTo(0, 0);
  }

  for (const level of Object.keys(levels)) {
    const id = 'wish_tabs_' + level;
    DMT[id] = 1;
    DMTF[id] = () => open(level);
    SPSHORT[id] = 'Wish / If only · flowing tabs';
    SPT.push({ id, n: SPSHORT[id], d: 'Practise wishes about the present, the past, changes and abilities.' });
    const topics = SPGRP[level];
    const matching = topics.filter(([name]) => /^\d+\s*·/.test(name) && /\bwish\b|if only/i.test(name));
    if (matching.length) matching.forEach(([, ids]) => { if (!ids.includes(id)) ids.push(id); });
    else {
      const number = 1 + Math.max(0, ...topics.map(([name]) => parseInt(name, 10) || 0));
      topics.push([number + ' · Wish / If only', [id]]);
    }
    const ids = SPLV.find(([key]) => key === level)?.[2];
    if (ids && !ids.includes(id)) ids.push(id);
  }
})();
