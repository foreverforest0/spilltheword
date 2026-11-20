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
    if (!text) return ['empty', 'Write a sentence or switch to Oral.'];
    const models = card.answers.map(normalize);
    if (models.includes(text)) return ['correct', 'That works. Your sentence matches the situation.'];
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
    const hourLabel = n => n === 1 ? '1 hour' : n + ' hours';
    const required = card => card.price / card.rate;
    setView(`
      <section id="workHours" data-practice-level="${level}" data-stw-plain>
        <header class="wh-header">
          <button type="button" id="whBack">Topics</button>
          <h1>Too / enough / so / such</h1>
          <span>${level.toUpperCase()}</span>
        </header>
        <div class="wh-workspace">
          <div class="wh-display">
            <div class="wh-ring" aria-hidden="true"></div>
            <output id="whAmount" aria-live="polite"></output>
          </div>
          <div class="wh-toggle" role="group" aria-label="Show cost as">
            <button type="button" data-unit="money">Price</button>
            <button type="button" data-unit="hours">Work hours</button>
          </div>
          <div class="wh-carousel" role="group" aria-label="Swipe to browse purchases, or focus a purchase and use the arrow keys">
            ${cards.map((card,i) => `<button type="button" class="wh-card" data-card="${i}">
              <strong>${esc(card.title)}</strong>
              <span class="wh-card-value"></span>
              <span class="wh-card-alt"></span>
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
    const ring = root.querySelector('.wh-ring');
    let scrollTimer;

    function amounts(animate) {
      const card = cards[state.index];
      const hours = state.unit === 'hours';
      const value = get('whAmount');
      value.innerHTML = hours ?
        `<strong>${hourLabel(required(card))}</strong><small>of work for €${card.price}</small>` :
        `<strong>€${card.price}</strong><small>at €${card.rate} per hour</small>`;
      ring.innerHTML = Array.from({ length: required(card) }, (_, i) => {
        const angle = i * 2 * Math.PI / required(card) - Math.PI / 2;
        return `<i class="${i < card.available ? 'wh-covered' : 'wh-uncovered'}" style="--wh-x:${50 + 44 * Math.cos(angle)}%;--wh-y:${50 + 44 * Math.sin(angle)}%"></i>`;
      }).join('');
      if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        value.getAnimations().forEach(animation => animation.cancel());
        value.animate([{opacity:.2,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:330,easing:'ease-out'});
        ring.querySelectorAll('i').forEach((dot, i) => {
          dot.animate([{opacity:.15,scale:.55},{opacity:1,scale:1}],{duration:330,delay:i*24});
        });
      }
      root.querySelectorAll('[data-unit]').forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.unit === state.unit));
      });
      tickets.forEach((ticket, i) => {
        const item = cards[i], current = i === state.index;
        ticket.tabIndex = current ? 0 : -1;
        ticket.setAttribute('aria-current', String(current));
        ticket.querySelector('.wh-card-value').textContent = hours ? hourLabel(required(item)) : '€' + item.price;
        ticket.querySelector('.wh-card-alt').textContent = hours ? '€' + item.price : hourLabel(required(item)) + ' of work';
      });
    }
    function render(focusId, animate = false) {
      const card = cards[state.index];
      const draft = state.drafts[card.id] ??= {};
      amounts(animate);
      get('whCount').textContent = `${state.index + 1} / ${cards.length}`;
      get('whCount').setAttribute('aria-label', `Purchase ${state.index + 1} of ${cards.length}`);
      get('whPrev').disabled = state.index === 0;
      get('whNext').disabled = state.index === cards.length - 1;
      get('whExercise').innerHTML = `
        <h2>${esc(card.title)}</h2>
        <p class="wh-facts">€${card.rate} per hour · ${hourLabel(card.available)} of pay available</p>
        <p class="wh-context">${esc(card.context)}</p>
        <p id="whPrompt">${esc(card.prompt)}</p>
        <div class="wh-mode" role="group" aria-label="Practice mode">
          <button type="button" id="whWritten" aria-pressed="${!state.oral}">Written</button>
          <button type="button" id="whOral" aria-pressed="${state.oral}">Oral</button>
        </div>
        ${state.oral ? '<p>Say your sentence aloud, then compare with the example.</p>' : `
          <form id="whForm">
            <textarea aria-label="Your sentence" aria-describedby="whPrompt" id="whAnswer" rows="2" maxlength="1200">${esc(draft.text)}</textarea>
            <button type="submit">Check</button>
          </form>
          <p id="whFeedback" role="status" data-result="${esc(draft.result?.[0])}">${esc(draft.result?.[1])}</p>
        `}
        <details id="whHint" ${draft.hint ? 'open' : ''}><summary>Hint</summary><p>${esc(card.hint)}</p></details>
        <details id="whExample" ${draft.example ? 'open' : ''}><summary>Show example</summary><p>${esc(card.answers[0])}</p></details>`;
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
      get('whWritten').onclick = () => { if (state.oral) { state.oral = false; render('whWritten'); } };
      get('whOral').onclick = () => { if (!state.oral) { state.oral = true; render('whOral'); } };
      if (focusId) get(focusId)?.focus({preventScroll:true});
      save();
    }

    const center = ticket => ticket.offsetLeft + ticket.offsetWidth / 2 - carousel.clientWidth / 2;
    function to(index, focus = false) {
      const next = Math.max(0, Math.min(cards.length - 1, index));
      if (state.index !== next) {
        state.index = next;
        render(null, true);
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
        render(null, true);
      }
    }
    if ('onscrollend' in carousel) carousel.addEventListener('scrollend', syncFromScroll);
    else carousel.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(syncFromScroll, 160);
    }, {passive:true});

    root.querySelectorAll('[data-unit]').forEach(button => {
      button.onclick = () => {
        if (button.dataset.unit === state.unit) return;
        state.unit = button.dataset.unit;
        amounts(true);
        save();
      };
    });
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
    SPSHORT[id] = 'Too / enough / so / such · work hours';
    SPT.push({ id, n: SPSHORT[id], d: 'See what a purchase costs in work hours and describe the limit or result.' });
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
