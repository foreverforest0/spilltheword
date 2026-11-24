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
    if (!text) return ['empty', 'Write a sentence.'];
    const models = card.answers.map(normalize);
    if (models.some(model=>GrammarArticles.equivalent(text,model,card.prompt))) return ['correct', 'That works. Your sentence matches the roles in the scene.'];
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

  const props = {
    b1: ['ch/r_camera.webp','ch/r_tv.webp','ch/b_jacket.webp','assets/wobbly/pictures/bicycle.png','ch/cw_o_letter.webp','ch/cw_o_painting.webp','ch/r_shelf.webp','ch/cw_o_envelope.webp','ch/b_ticket.webp','ch/b_jacket.webp'],
    b2: ['ch/r_ac.webp','ch/r_ac.webp','ch/r_camera.webp','ch/r_camera.webp','ch/cw_o_watch.webp','ch/r_door.webp','ch/cw_o_window.webp','ch/r_tv.webp','assets/wobbly/pictures/backpack.png','ch/p_bread.webp'],
    c1: ['ch/r_camera.webp','ch/r_ac.webp','ch/cw_o_watch.webp','ch/cw_o_painting.webp','ch/r_camera.webp','ch/r_camera.webp','ch/cw_o_painting.webp','ch/town_map.webp','ch/cw_o_window.webp','ch/r_camera.webp'],
  };
  const times = {
    b1: ['yesterday','last night','yesterday','before the trip','yesterday','last week','yesterday','every year · before the deadline','last Friday','yesterday'],
    b2: ['this week','last winter','in progress now','overnight','next week · plan','first','yesterday','before the screening · necessary','while on a hike','this morning'],
    c1: ['before the festival opened','by the time her guests arrive','when another guest caught it on a bag by accident','last month','before she posts anything · wants to','twice this month','after the backlash · considered it','during her digital detox','before winter · should have','during a scroll-free weekend · without permission'],
  };
  const extraTime = {
    'b1-01':'yesterday','b1-02':'last night','b1-03':'yesterday','b1-05':'yesterday',
    'b1-06':'last week','b1-07':'yesterday','b1-09':'last Friday','b1-10':'yesterday',
    'b2-02':'last winter','b2-07':'yesterday','b2-10':'this morning','c1-04':'last month',
  };
  const homes = [[16,49],[40,39],[65,56],[83,43],[38,77],[74,78]];
  const foliage = [[3,34],[10,29],[18,32],[25,24],[48,28],[57,30],[67,24],[74,31],[91,27],[96,36],[6,71],[92,80]];
  const posture = '<span class="ce-figure" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
  let destroyPark;
  const previousView = setView;
  setView = function (html) {
    destroyPark?.();
    destroyPark = null;
    return previousView(html);
  };

  function open(level) {
    seaOff();
    S.splevel = level;
    const cards = levels[level];
    const state = saved[level] ??= { index: 0, drafts: {} };
    state.index = Math.max(0, Math.min(cards.length - 1, state.index || 0));
    let soundOn = false;
    const audio = ['prairie','grass-wind'].map((file, i) => {
      const track = new Audio('assets/causative-park/' + file + '.mp3');
      track.loop = true;
      track.volume = i ? .13 : .22;
      track.preload = 'none';
      return track;
    });
    function sound(play) {
      audio.forEach(track => {
        if (play) track.play().catch(() => {});
        else track.pause();
      });
    }

    function render(focusId) {
      const card = cards[state.index];
      const draft = state.drafts[card.id] ??= {};
      const time = times[level][state.index];
      const reminder = extraTime[card.id];
      const baseAnswers = card.answers.flatMap(answer => card.kind !== 'self' ? [answer] : [
        answer, answer.replace(/ (?:himself|herself)(?=[.!?]?$)/i, ''),
      ]);
      const timed = reminder ? baseAnswers.flatMap(answer => [
        answer.replace(/[.]$/, '') + ' ' + reminder + '.',
        reminder[0].toUpperCase() + reminder.slice(1) + ', ' + answer,
      ]) : [];
      const gradingCard = { ...card, answers: [...baseAnswers, ...timed] };
      setView(`
        <section id="causativeScene" data-practice-level="${level}" data-stw-plain>
          <header class="ce-header">
            <button type="button" id="ceBack">← Back to topics</button>
            <h1>Have / get something done</h1>
            <button type="button" id="ceSound" aria-pressed="${soundOn}">Park sounds</button>
          </header>
          <p id="ceInstruction">Tap a person.</p>
          <div class="ce-park" role="group" aria-label="Park">
            <div class="ce-meadow" aria-hidden="true"></div>
            <div class="ce-path" aria-hidden="true"></div>
            <div class="ce-pond" aria-hidden="true"></div>
            <div class="ce-mill" aria-hidden="true"><div class="ce-blades"><i></i><i></i><i></i><i></i></div></div>
            ${foliage.map(([x,y],i) => `<i class="ce-tree" style="--x:${x}%;--y:${y}%;--tree-size:${36+i%4*9}px" aria-hidden="true"></i>`).join('')}
            ${homes.map(([x,y],i) => `<button type="button" class="ce-walker ce-walker-${i}" aria-label="Person ${i+1}" style="left:${x}%;top:${y}%">${posture}<span class="ce-name"></span></button>`).join('')}
            <div class="ce-prop" hidden>
              <img src="${props[level][state.index]}" alt="">
              <span>${esc(card.object)}</span>
            </div>
          </div>
          <section id="ceTask" aria-label="Write a full sentence" hidden>
            <p class="ce-clues" id="ceClues"></p>
            <form id="ceForm">
              <textarea id="ceAnswer" aria-label="Your full sentence" aria-describedby="ceClues" rows="2" maxlength="1200" placeholder="Write a full sentence.">${esc(draft.text)}</textarea>
              <button type="submit">Check</button>
            </form>
            <p id="ceFeedback" role="status" data-result="${esc(draft.result?.[0])}">${esc(draft.result?.[1])}</p>
            <details id="ceHint" ${draft.hint ? 'open' : ''}><summary>Hint</summary><p>${esc(card.hint)}</p></details>
            <details id="ceExample" ${draft.example ? 'open' : ''}><summary>Show answer</summary><p>${esc(timed[0] || card.answers[0])}</p></details>
          </section>
          <p id="ceLive" class="ce-sr" role="status"></p>
          <nav aria-label="Situations">
            <button type="button" id="cePrev" ${state.index === 0 ? 'disabled' : ''}>Previous</button>
            <span>${state.index + 1} / ${cards.length}</span>
            <button type="button" id="ceNext">Next</button>
          </nav>
        </section>`);

      const root = document.getElementById('causativeScene');
      const get = id => root.querySelector('#' + id);
      const park = root.querySelector('.ce-park');
      const people = [...root.querySelectorAll('.ce-walker')];
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      let chosen = false;
      let revealTimer;
      function move(walker, x, y, ms) {
        walker.style.transitionDuration = (reduced ? 0 : ms) + 'ms';
        walker.style.left = x + '%';
        walker.style.top = y + '%';
      }
      function stroll(walker, i) {
        const [x,y] = homes[i];
        move(walker, x + (Math.random() - .5) * 17, y + (Math.random() - .5) * 18, 2600 + Math.random() * 1400);
      }
      function wander() {
        if (document.activeElement?.classList.contains('ce-walker')) return;
        people.forEach(stroll);
      }
      const wanderTimer = reduced ? undefined : setInterval(wander, 3600);
      const startTimer = reduced ? undefined : setTimeout(wander, 120);
      destroyPark = () => {
        clearInterval(wanderTimer);
        clearTimeout(startTimer);
        clearTimeout(revealTimer);
        sound(false);
      };
      if (soundOn) sound(true);
      get('ceSound').onclick = event => {
        soundOn = !soundOn;
        event.currentTarget.setAttribute('aria-pressed', String(soundOn));
        sound(soundOn);
      };
      const input = get('ceAnswer');
      people.forEach((walker,i) => {
        walker.onclick = event => {
          if (chosen) return;
          chosen = true;
          clearInterval(wanderTimer);
          clearTimeout(startTimer);
          const partner = card.kind === 'self' ? null : people[(i + 3) % people.length];
          const performers = partner ? [walker, partner] : [walker];
          park.classList.add('ce-meeting');
          performers.forEach((person, n) => {
            person.classList.add('ce-participant');
            person.querySelector('.ce-name').textContent = card.people[n];
          });
          people.forEach(person => { person.disabled = true; });
          const bounds = park.getBoundingClientRect();
          const position = walker.getBoundingClientRect();
          const x = (position.left + position.width / 2 - bounds.left) / bounds.width * 100;
          const y = (position.top + position.height * .7 - bounds.top) / bounds.height * 100;
          const direction = x <= 50 ? 1 : -1;
          const gap = Math.min(23, Math.max(13, 155 / bounds.width * 100));
          move(walker, x, y, 0);
          if (partner) {
            partner.classList.add('ce-approaching');
            move(partner, x + direction * gap, y, 740);
          }
          revealTimer = setTimeout(() => {
            partner?.classList.remove('ce-approaching');
            const prop = root.querySelector('.ce-prop');
            prop.style.left = (x + direction * gap * (partner ? .5 : .72)) + '%';
            prop.style.top = (y - 8) + '%';
            prop.hidden = false;
            get('ceInstruction').hidden = true;
            const names = partner ? card.people.join(' + ') : card.people[0];
            get('ceClues').textContent = [names, card.action, time].join(' · ');
            get('ceTask').hidden = false;
            get('ceLive').textContent = partner
              ? card.people[1] + ' joined ' + card.people[0] + '.'
              : card.people[0] + ' is alone.';
            if (event.detail === 0) input.focus({ preventScroll: true });
          }, reduced ? 0 : 760);
        };
      });

      get('ceBack').onclick = spSetup;
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
        draft.result = check(gradingCard, input.value);
        status.dataset.result = draft.result[0];
        status.textContent = draft.result[1];
        save();
      };
      get('ceHint').ontoggle = event => { draft.hint = event.currentTarget.open; save(); };
      get('ceExample').ontoggle = event => { draft.example = event.currentTarget.open; save(); };
      function moveCard(index, target) {
        state.index = index;
        render(target);
      }
      get('cePrev').onclick = () => moveCard(state.index - 1, state.index === 1 ? 'ceNext' : 'cePrev');
      get('ceNext').onclick = () => moveCard((state.index + 1) % cards.length, 'ceNext');
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
    SPSHORT[id] = 'Have / get something done · Park';
    SPT.push({ id, n: SPSHORT[id], d: 'Tap a person and write a sentence about what happens.' });
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
