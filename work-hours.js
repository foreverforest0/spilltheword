(() => {
  'use strict';
  const levels = window.WorkHoursData;
  const key = 'spill-work-hours-v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(key)) || {}; } catch {}
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch]);
  function save() {
    try { localStorage.setItem(key, JSON.stringify(saved)); } catch {}
  }
  function normalize(str) {
    return str.toLowerCase().trim().replace(/[‘’]/g, "'").replace(/[,.!?;]/g, '').replace(/\s+/g, ' ')
      .replace(/\b(i|we|you|he|she|they)'ll\b/g, '$1 will')
      .replace(/\b(i|we|you|they)'ve\b/g, '$1 have')
      .replace(/\b(i|we|you|they)'re\b/g, '$1 are').replace(/\bi'm\b/g, 'i am')
      .replace(/\bit's\b/g, 'it is').replace(/\bwon't\b/g, 'will not')
      .replace(/\b(is|do|could)n't\b/g, '$1 not')
      .replace(/\b(1|2|3|4) hours?\b/g, (_, n) => ['','one hour','two hours','three hours','four hours'][n]);
  }
  function check(card, answer) {
    const text = normalize(answer);
    if (!text) return ['empty', 'Write a sentence.'];
    const models = card.answers.map(normalize);
    if (models.some(model=>GrammarArticles.equivalent(text,model,card.prompt))) return ['correct', 'That works. Your sentence matches the situation.'];
    const substitutions = {
      too: [[/too expensive/, 'expensive too'], [/too many hours/, 'too much hours']],
      adj: [[/(cheap|affordable|low) enough/, 'enough $1']],
      noun: [[/enough (money|time)/, '$1 enough']],
      so: [[/so (expensive|high|quickly|fast)/, 'such $1']],
      such: [[/such (a|an|high)/, 'so $1']],
    };
    if (models.some(model => substitutions[card.kind].some(([pattern, replacement]) =>
      pattern.test(model) && model.replace(pattern, replacement) === text))) return ['revise', card.hint];
    return ['review', 'Compare with the example. Check that your sentence expresses the same limit or result.'];
  }
  window.WorkHoursChecker = { check };

  function open(level) {
    seaOff();
    S.splevel = level;
    const cards = levels[level];
    const state = saved[level] ??= { index: 0, unit: 'money', oral: false, drafts: {} };
    setView(`
      <section id="workHours" data-practice-level="${level}" data-stw-plain>
        <header class="wh-header">
          <button type="button" id="whBack">Topics</button>
          <h1>Too / enough / so / such</h1>
          <span>${level.toUpperCase()}</span>
        </header>
        <div class="wh-workspace">
          <div class="wh-display">
            <output id="whAmount" aria-live="polite"></output>
          </div>

          <div class="wh-carousel" role="group" aria-label="Swipe to browse purchases, or focus a purchase and use the arrow keys">
            ${cards.map((card,i) => `<button type="button" class="wh-card" data-card="${i}">
              <strong>${esc(card.title)}</strong>
              <span class="wh-card-value"></span>
            </button>`).join('')}
          </div>
          <nav aria-label="Purchases">
            <button type="button" id="whPrev">Previous</button>
            <output id="whCount"></output>
            <button type="button" id="whNext">Next</button>
          </nav>
          <article id="whExercise"></article>
        </div>
      </section>`);

    const root = document.getElementById('workHours');
    const get = id => root.querySelector('#' + id);
    const carousel = root.querySelector('.wh-carousel');
    const tickets = [...carousel.querySelectorAll('[data-card]')];
    let scrollTimer;

    function amounts() {
      const card=cards[state.index];
      get('whAmount').textContent='€'+card.price;
      tickets.forEach((ticket,i)=>{
        ticket.tabIndex=i===state.index?0:-1;
        ticket.setAttribute('aria-current',String(i===state.index));
        ticket.querySelector('.wh-card-value').textContent='€'+cards[i].price;
      });
    }
    function render(focusId) {
      const card = cards[state.index];
      const draft = state.drafts[card.id] ??= {};
      amounts();
      get('whCount').textContent = `${state.index + 1} / ${cards.length}`;
      get('whCount').setAttribute('aria-label', `Purchase ${state.index + 1} of ${cards.length}`);
      get('whPrev').disabled = state.index === 0;
      get('whNext').disabled = state.index === cards.length - 1;
      get('whExercise').innerHTML = `
        <h2>${esc(card.title)}</h2>
        ${level!=='b1'?`<p class="wh-facts">€${card.rate} per hour · ${card.available} hours of pay available</p>`:state.index<6?`<p class="wh-facts">Budget €${card.rate*card.available}</p>`:''}
        ${card.context?`<p class="wh-context">${esc(card.context)}</p>`:''}
        <p id="whPrompt">${esc(card.prompt)}</p>

          <form id="whForm">
            <textarea aria-label="Your sentence" aria-describedby="whPrompt" id="whAnswer" rows="2" maxlength="1200">${esc(draft.text)}</textarea>
            <button type="submit">Check</button>
          </form>
          <p id="whFeedback" role="status" data-result="${esc(draft.result?.[0])}">${esc(draft.result?.[1])}</p>
        <details id="whHint" ${draft.hint ? 'open' : ''}><summary>Hint</summary><p>${esc(card.hint)}</p></details>
        <details id="whExample" ${draft.example ? 'open' : ''}><summary>Show answer</summary><p>${esc(card.answers[0])}</p></details>`;
      const input = get('whAnswer');
      if (input) {
        const feedback = get('whFeedback');
        input.oninput = () => {
          draft.text = input.value;
          delete draft.result;
          feedback.textContent = '';
          delete feedback.dataset.result;
          save();
        };
        get('whForm').onsubmit = event => {
          event.preventDefault();
          draft.result = check(card, input.value);
          feedback.dataset.result = draft.result[0];
          feedback.textContent = draft.result[1];
          save();
        };
      }
      get('whHint').ontoggle = event => { draft.hint = event.currentTarget.open; save(); };
      get('whExample').ontoggle = event => { draft.example = event.currentTarget.open; save(); };
      if (focusId) get(focusId)?.focus({preventScroll:true});
      save();
    }

    const center = ticket => ticket.offsetLeft + ticket.offsetWidth / 2 - carousel.clientWidth / 2;
    function to(index, focus = false) {
      const next = Math.max(0, Math.min(cards.length - 1, index));
      if (state.index !== next) {
        state.index = next;
        render();
      }
      const ticket = tickets[state.index];
      carousel.scrollTo({left:center(ticket),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
      if (focus) ticket.focus({preventScroll:true});
    }
    function syncFromScroll() {
      if (!root.isConnected) return;
      const index = tickets.reduce((best, item, i) =>
        Math.abs(center(item) - carousel.scrollLeft) < Math.abs(center(tickets[best]) - carousel.scrollLeft) ? i : best, 0);
      if (index !== state.index) {
        state.index = index;
        render();
      }
    }
    if ('onscrollend' in carousel) carousel.addEventListener('scrollend', syncFromScroll);
    else carousel.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(syncFromScroll, 160);
    }, {passive:true});

    tickets.forEach((ticket, i) => {
      ticket.onclick = () => to(i, true);
      ticket.onkeydown = event => {
        if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
        event.preventDefault();
        const target = { ArrowLeft: i - 1, ArrowRight: i + 1, Home: 0, End: cards.length - 1 }[event.key];
        to(target, true);
      };
    });
    get('whPrev').onclick = () => {
      to(state.index - 1);
      if (get('whPrev').disabled) get('whNext').focus({preventScroll:true});
    };
    get('whNext').onclick = () => {
      to(state.index + 1);
      if (get('whNext').disabled) get('whPrev').focus({preventScroll:true});
    };
    get('whBack').onclick = () => { S.glevel = level; go('gram'); };
    render();
    carousel.scrollTo({left:center(tickets[state.index]),behavior:'instant'});
    window.scrollTo(0, 0);
  }

  for (const level of Object.keys(levels)) {
    const id = 'work_hours_' + level;
    DMT[id] = 1;
    DMTF[id] = () => open(level);
    SPSHORT[id] = 'Too / enough / so / such';
    SPT.push({ id, n: SPSHORT[id], d: 'Describe a price, a budget or a result.' });
    const topics = SPGRP[level];
    const topic = topics.find(([name]) => /^\d+\s*·/.test(name) && /\btoo\b.*\benough\b|\bso\b.*\bsuch\b/i.test(name));
    if (topic) topic[1].push(id);
    else {
      const revision = topics.findIndex(([, ids]) => ids.includes('revision_room'));
      const number = 1 + Math.max(0, ...topics.filter((_, i) => i !== revision).map(([name]) => parseInt(name, 10) || 0));
      if (revision !== -1) topics[revision][0] = (number + 1) + ' · Revision room';
      topics.splice(revision === -1 ? topics.length : revision, 0, [number + ' · Too / enough / so / such', [id]]);
    }
    const ids = SPLV.find(([key]) => key === level)?.[2];
    if (ids && !ids.includes(id)) {
      const revision = ids.indexOf('revision_room');
      ids.splice(revision === -1 ? ids.length : revision, 0, id);
    }
  }
})();
