(() => {
  'use strict';
  const levels = window.QuestionTagsGlowData;
  const directions = { rise: 'Rising', fall: 'Falling' };
  const key = 'spill-question-tags-glow-v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(key)) || {}; } catch {}
  function save() {
    try { localStorage.setItem(key, JSON.stringify(saved)); } catch {}
  }
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch]);
  const normalize = str => str.toLowerCase().replace(/[‘’]/g, "'")
    .replace(/[^a-z'\s]/g, ' ').replace(/\s+/g, ' ').trim();

  function check(card, answer) {
    const text = normalize(answer);
    if (!text) return ['empty', 'Write the question tag first.'];
    const stem = normalize(card.stem) + ' ';
    const tag = text.startsWith(stem) ? text.slice(stem.length) : text;
    const models = card.tags.map(normalize);
    if (models.includes(tag)) return ['correct', 'That tag fits the sentence.'];
    const contrast = models[0].replace(/n't /, ' ');
    if (contrast !== models[0] && contrast === tag) return ['review', card.hint];
    return ['review', 'Compare with the example. Check the auxiliary, polarity and pronoun.'];
  }
  window.QuestionTagsGlowChecker = { check };

  function open(level) {
    seaOff();
    S.splevel = level;
    const cards = levels[level];
    const state = saved[level] ??= { index: 0, drafts: {} };
    let audioContext, oscillator, timer, playback = 0;

    function stop() {
      playback++;
      clearTimeout(timer);
      if (oscillator) {
        try { oscillator.stop(); } catch {}
        oscillator = null;
      }
    }

    function render(focusId) {
      stop();
      const card = cards[state.index];
      const draft = state.drafts[card.id] ??= {};
      setView(`
        <section id="questionTagsGlow" data-practice-level="${level}" data-stw-plain>
          <header class="qtg-header">
            <button id="qtgBack" type="button">Topics</button>
            <h1>Question tags</h1>
            <span>${level.toUpperCase()}</span>
          </header>
          <div class="qtg-workspace">
            <div class="qtg-top"><h2>${esc(card.title)}</h2><output aria-label="Situation ${state.index + 1} of ${cards.length}">${state.index + 1} / ${cards.length}</output></div>
            <p class="qtg-stem">${esc(card.stem)}, <span aria-label="missing question tag">…?</span></p>
              <form id="qtgForm">
                <label for="qtgAnswer">Add the question tag.</label>
                <input id="qtgAnswer" type="text" maxlength="300" autocomplete="off" spellcheck="false" value="${esc(draft.text)}">
                <button type="submit">Check tag</button>
              </form>
              <p id="qtgFeedback" role="status" data-result="${esc(draft.result?.[0])}">${esc(draft.result?.[1])}</p>
            <section class="qtg-pitch" aria-label="Intonation">
              <div class="qtg-halo" aria-hidden="true"></div>
              <h3>How would you say the tag?</h3>
              <div class="qtg-pitch-controls">
                ${Object.entries(directions).map(([id,name]) => `<div class="qtg-pitch-choice">
                  <button type="button" data-pitch="${id}" aria-pressed="${draft.pitch === id}">${name}</button>
                  <button type="button" data-play="${id}" aria-label="Play ${name.toLowerCase()} pitch cue">Play cue</button>
                </div>`).join('')}
              </div>
              <div id="qtgContour" data-direction="${draft.pitch || ''}" aria-hidden="true"><i></i></div>
              <p id="qtgCue" role="status"></p>
              <p id="qtgPitchFeedback" role="status"></p>
            </section>
            <details id="qtgHint" ${draft.hint ? 'open' : ''}><summary>Hint</summary><p>${esc(card.hint)}</p></details>
            <details id="qtgExample" ${draft.example ? 'open' : ''}><summary>Show the right answer</summary>
              <p>${esc(card.stem)}, <strong>${esc(card.tags[0])}?</strong></p>
              <p><strong>${directions[card.direction]} pitch.</strong> ${esc(card.reason)}</p>
            </details>
            <nav aria-label="Situations">
              <button type="button" id="qtgPrev" ${state.index === 0 ? 'disabled' : ''}>Previous</button>
              <button type="button" id="qtgNext" ${state.index === cards.length - 1 ? 'disabled' : ''}>Next</button>
            </nav>
          </div>
        </section>`);

      const root = document.getElementById('questionTagsGlow');
      const get = id => root.querySelector('#' + id);
      const pitch = root.querySelector('.qtg-pitch');
      const contour = get('qtgContour');
      const pitchFeedback = get('qtgPitchFeedback');
      function showPitchFeedback() {
        pitchFeedback.textContent = !draft.pitch ? '' : draft.pitch === card.direction ?
          'That fits this reading. ' + card.reason :
          'Try the ' + directions[card.direction].toLowerCase() + ' contour for this reading. ' + card.reason;
      }
      showPitchFeedback();

      async function play(direction, sound = true) {
        stop();
        const token = playback;
        contour.dataset.direction = direction;
        pitch.dataset.playing = direction;
        get('qtgCue').textContent = sound ? directions[direction] + ' pitch cue' : '';
        timer = setTimeout(() => {
          delete pitch.dataset.playing;
          contour.dataset.direction = draft.pitch || direction;
          get('qtgCue').textContent = '';
        }, 1000);
        if (!sound) return;
        try {
          const Audio = window.AudioContext || window.webkitAudioContext;
          if (!Audio) return;
          audioContext ??= new Audio();
          if (audioContext.state !== 'running') await audioContext.resume();
          if (token !== playback || !root.isConnected) return;
          const t = audioContext.currentTime;
          const tone = audioContext.createOscillator();
          const gain = audioContext.createGain();
          oscillator = tone;
          tone.type = 'sine';
          tone.frequency.setValueAtTime(direction === 'rise' ? 245 : 400, t);
          tone.frequency.exponentialRampToValueAtTime(direction === 'rise' ? 400 : 245, t + .72);
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(.14, t + .06);
          gain.gain.setValueAtTime(.14, t + .55);
          gain.gain.linearRampToValueAtTime(0, t + .78);
          tone.connect(gain).connect(audioContext.destination);
          tone.onended = () => {
            tone.disconnect();
            gain.disconnect();
            if (oscillator === tone) oscillator = null;
          };
          tone.start(t);
          tone.stop(t + .8);
        } catch {
          if (token === playback && root.isConnected) get('qtgCue').textContent = directions[direction] + ' pitch shown visually';
        }
      }
      root.querySelectorAll('[data-pitch]').forEach(button => {
        button.onclick = () => {
          draft.pitch = button.dataset.pitch;
          for (const option of root.querySelectorAll('[data-pitch]')) {
            option.setAttribute('aria-pressed', String(option === button));
          }
          showPitchFeedback();
          play(draft.pitch, false);
          save();
        };
      });
      root.querySelectorAll('[data-play]').forEach(button => { button.onclick = () => play(button.dataset.play); });

      const input = get('qtgAnswer');
      if (input) {
        const status = get('qtgFeedback');
        input.oninput = () => {
          draft.text = input.value;
          delete draft.result;
          status.textContent = '';
          delete status.dataset.result;
          save();
        };
        get('qtgForm').onsubmit = event => {
          event.preventDefault();
          draft.result = check(card, input.value);
          status.dataset.result = draft.result[0];
          status.textContent = draft.result[1];
          save();
        };
      }
      get('qtgHint').ontoggle = event => { draft.hint = event.currentTarget.open; save(); };
      get('qtgExample').ontoggle = event => { draft.example = event.currentTarget.open; save(); };
      get('qtgPrev').onclick = () => { state.index--; render(state.index === 0 ? 'qtgNext' : 'qtgPrev'); };
      get('qtgNext').onclick = () => { state.index++; render(state.index === cards.length - 1 ? 'qtgPrev' : 'qtgNext'); };
      get('qtgBack').onclick = () => {
        stop();
        if (audioContext) audioContext.close().catch(() => {});
        S.glevel = level;
        go('gram');
      };
      if (focusId) get(focusId)?.focus({ preventScroll: true });
      save();
    }
    render();
    window.scrollTo(0, 0);
  }

  for (const level of Object.keys(levels)) {
    const id = 'question_tags_glow_' + level;
    DMT[id] = 1;
    DMTF[id] = () => open(level);
    SPSHORT[id] = 'Question tags · voice glow';
    SPT.push({ id, n: SPSHORT[id], d: 'Add a question tag and practise its intonation.' });
    const topics = SPGRP[level];
    const topic = topics.find(([name]) => /^\d+\s*·/.test(name) && /question tags|tag questions/i.test(name));
    if (topic) topic[1].push(id);
    else {
      const revision = topics.findIndex(([, ids]) => ids.includes('revision_room'));
      const number = 1 + Math.max(0, ...topics.filter((_, i) => i !== revision).map(([name]) => parseInt(name, 10) || 0));
      if (revision !== -1) topics[revision][0] = (number + 1) + ' · Revision room';
      topics.splice(revision === -1 ? topics.length : revision, 0, [number + ' · Question tags', [id]]);
    }
    const ids = SPLV.find(([key]) => key === level)?.[2];
    if (ids && !ids.includes(id)) {
      const revision = ids.indexOf('revision_room');
      ids.splice(revision === -1 ? ids.length : revision, 0, id);
    }
  }
})();
