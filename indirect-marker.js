(() => {
  'use strict';
  const tasks = [
    {
      title: 'Mark the words', context: 'At a rehearsal, someone asks where the script is.',
      prompt: 'Mark the two parts that need to swap places.',
      model: 'Could you tell me where the script is?',
      hint: 'Inside the question, put the subject before is.',
    },
    {
      title: 'Choose the question', context: 'You want to know what time your friend’s shift finishes.',
      prompt: 'Choose the question that asks for the time.',
      options: [
        'Do you know what time does your shift finish?',
        'Do you know if your shift finishes at six?',
        'Do you know what time your shift finishes?',
      ],
      model: 'Do you know what time your shift finishes?',
      hint: 'Use what time to ask for a time. Inside the question, use your shift finishes.',
    },
    {
      title: 'Build the question', context: 'You’re deciding whether to book a film. You want to know if it has subtitles.',
      prompt: 'Tap the blocks in order to finish “Do you know …?”',
      blocks: ['has subtitles', 'when', 'the film', 'if'],
      order: ['if', 'the film', 'has subtitles'],
      model: 'Do you know if the film has subtitles?',
      hint: 'Start with if for a yes/no question. Then put the subject before the verb.',
    },
    {
      title: 'Edit the question', context: 'You’re looking for the script. Maya left it somewhere yesterday.',
      prompt: 'Start with “Do you know where”. Remove the extra word and keep the past tense.',
      model: 'Do you know where Maya left the script?',
      hint: 'Remove did. Change leave to its past form, left.',
    },
    {
      title: 'Ask your own question', context: 'You’re at the cinema with a friend who needs subtitles.',
      prompt: 'Before you buy tickets for the comedy, ask a member of staff politely about subtitles. Write or say the whole question.',
      model: 'Could you tell me if the comedy has subtitles?',
      hint: 'Start with a polite phrase such as Could you tell me. Use if or whether, then put the subject before the verb.',
    },
  ];
  const key = 'spill-indirect-marker-v1';
  let memory;
  try { memory = JSON.parse(localStorage.getItem(key)); } catch {}
  const embedded = new URLSearchParams(location.hash.slice(1)).has('embed');
  const blank = () => ({ index: 0, oral: false, drafts: {} });
  const state = embedded ? blank() : memory || blank();
  const save = () => {
    if (embedded) return;
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  const normalize = value => value.toLowerCase().replace(/[’‘]/g, "'").replace(/[.,!?]/g, '').trim().replace(/\s+/g, ' ');
  function checkFinal(value) {
    const answer = normalize(value);
    if (!answer) return ['empty', 'Write your question or switch to Oral.'];
    if (/^(excuse me )?(can|could|would) you tell (me|us) (if|whether) (the|this) (comedy|film) (has|comes with) (english )?subtitles( or not)?$/.test(answer) ||
        /^(excuse me )?do you know (if|whether) (the|this) (comedy|film) has (english )?subtitles( or not)?$/.test(answer)) {
      return ['correct', 'That works. You asked politely and used statement order inside the question.'];
    }
    if (/\b(if|whether) does (the|this) (comedy|film) have\b/.test(answer)) {
      return ['revise', 'After if or whether, use “the comedy has”. Leave out does.'];
    }
    return ['review', 'Compare with the example. Does your question ask about subtitles politely?'];
  }
  window.IndirectMarker = { tasks, checkFinal };

  function open() {
    seaOff();
    S.splevel = 'b1';

    function render(focus) {
      const index = state.index;
      const task = tasks[index];
      const draft = state.drafts[index] ??= {};
      draft.order ??= [];
      const done = !!draft.done;
      const mark = (id, word) => `<button type="button" class="im-word" data-mark="${id}" aria-pressed="false">${word}</button>`;
      const choice = (value, selected) => `<button type="button" data-block="${escape(value)}" aria-pressed="${selected}">${escape(value)}</button>`;
      const activities = [
        `<div class="im-line" id="imMarkLine">Could you tell me ${done ?
          '<span>where</span> <mark>the script</mark> <mark>is</mark>' :
          [mark('where','where'), mark('is','is'), mark('script','the script')].join(' ')}<span>?</span></div>`,
        `<div class="im-options">${tasks[1].options.map((option,i) =>
          `<button type="button" data-option="${i}" aria-pressed="${draft.option === i}">${escape(option)}</button>`).join('')}</div>`,
        `<div class="im-line im-built" aria-live="polite">Do you know <mark>${escape(draft.order.join(' ') || '…')}</mark>?</div>
         <div class="im-blocks">${tasks[2].blocks.map(word => choice(word, draft.order.includes(word))).join('')}
         <button type="button" id="imClear">Clear</button></div>`,
        `<div class="im-line">Do you know where ${draft.erased ? '' : '<button type="button" class="im-word" id="imDid" aria-label="Remove did">did</button>'}
          Maya ${draft.past ? '<mark>left</mark>' : '<button type="button" class="im-word" id="imVerb" aria-expanded="false">leave</button>'} the script?</div>
          <div id="imVerbChoices" class="im-blocks" hidden><button type="button" data-verb="leaves">leaves</button><button type="button" data-verb="left">left</button></div>`,
        `<div class="im-blocks" role="group" aria-label="Practice mode">
          <button type="button" id="imWritten" aria-pressed="${!state.oral}">Written</button>
          <button type="button" id="imOral" aria-pressed="${state.oral}">Oral</button></div>
          ${state.oral ? '<p>Say your full question aloud, then open the example to compare.</p>' :
            `<form id="imForm"><textarea id="imAnswer" aria-label="Your question" rows="3" maxlength="600">${escape(draft.answer)}</textarea>
            <button type="submit">Check</button></form>`}`,
      ];
      setView(`
        <section id="indirectMarker" data-practice-level="b1" data-stw-plain>
          <header><button type="button" id="imBack">Topics</button><h1>Indirect questions</h1><span>B1</span></header>
          <main>
            <div class="im-top"><h2>${task.title}</h2><output aria-label="Step ${index+1} of 5">${index+1} / 5</output></div>
            <p>${task.context}</p><p class="im-prompt">${task.prompt}</p>
            ${activities[index]}
            <p id="imFeedback" role="status">${escape(draft.feedback)}</p>
            <details id="imHint" ${draft.hint ? 'open' : ''}><summary>Hint</summary><p>${task.hint}</p></details>
            <details id="imExample" ${draft.example ? 'open' : ''}><summary>Show example</summary><p>${task.model}</p></details>
            <nav aria-label="Training steps">
              <button type="button" id="imPrev" ${index === 0 ? 'disabled' : ''}>Previous</button>
              ${index < 4 ? '<button type="button" id="imNext">Next step</button>' : '<button type="button" id="imAgain">Back to first step</button>'}
            </nav>
          </main>
        </section>`);
      const root = document.getElementById('indirectMarker');
      const get = id => root.querySelector('#' + id);
      function feedback(message) {
        draft.feedback = message;
        get('imFeedback').textContent = message;
        save();
      }
      function move(step) {
        state.index = step;
        render('imHeading');
        window.scrollTo(0, 0);
      }
      const heading = root.querySelector('h2');
      heading.id = 'imHeading';
      heading.tabIndex = -1;
      get('imBack').onclick = () => { S.glevel = 'b1'; go('gram'); };
      get('imPrev').onclick = () => move(index - 1);
      if (get('imNext')) get('imNext').onclick = () => move(index + 1);
      if (get('imAgain')) get('imAgain').onclick = () => move(0);
      get('imHint').ontoggle = e => { draft.hint = e.currentTarget.open; save(); };
      get('imExample').ontoggle = e => { draft.example = e.currentTarget.open; save(); };

      const selected = new Set();
      root.querySelectorAll('[data-mark]').forEach(button => {
        button.onclick = () => {
          if (draft.done) return;
          const id = button.dataset.mark;
          if (selected.has(id)) selected.delete(id);
          else selected.add(id);
          button.setAttribute('aria-pressed', String(selected.has(id)));
          if (selected.size !== 2) return;
          if (selected.has('is') && selected.has('script')) {
            const line = get('imMarkLine');
            const verb = line.querySelector('[data-mark=is]');
            const subject = line.querySelector('[data-mark=script]');
            const before = [subject,verb].map(el => el.getBoundingClientRect());
            line.insertBefore(subject, verb);
            [subject,verb].forEach((el,i) => {
              const after = el.getBoundingClientRect();
              el.setAttribute('aria-disabled', 'true');
              if (!matchMedia('(prefers-reduced-motion: reduce)').matches) el.animate([
                { transform: `translate(${before[i].left-after.left}px,${before[i].top-after.top}px)` },
                { transform: 'translate(0,0)' },
              ], { duration: 430, easing: 'ease-out' });
            });
            line.querySelector('[data-mark=where]').setAttribute('aria-disabled','true');
            draft.done = true;
            feedback('The script now comes before is.');
          } else {
            selected.clear();
            lineReset();
            feedback('Keep where in place. Look for the subject and the verb.');
          }
        };
      });
      function lineReset() {
        root.querySelectorAll('[data-mark]').forEach(button => button.setAttribute('aria-pressed','false'));
      }
      root.querySelectorAll('[data-option]').forEach(button => {
        button.onclick = () => {
          draft.option = Number(button.dataset.option);
          root.querySelectorAll('[data-option]').forEach(el => el.setAttribute('aria-pressed',String(el===button)));
          const messages = [
            'The embedded question still has does. Keep the subject before finishes.',
            'That is grammatical, but it only checks whether the shift finishes at six. Ask for the exact time.',
            'Correct. What time asks for a detail, and your shift comes before finishes.',
          ];
          feedback(messages[draft.option]);
        };
      });
      root.querySelectorAll('[data-block]').forEach(button => {
        button.onclick = () => {
          const word = button.dataset.block;
          if (draft.order.includes(word)) return;
          const next = task.order[draft.order.length];
          if (word !== next) {
            feedback(draft.order.length === 0 ? 'This is a yes/no question. Start with if.' :
              draft.order.length === 1 ? 'Put the subject after if.' : 'Finish with the verb phrase.');
            return;
          }
          draft.order.push(word);
          button.setAttribute('aria-pressed','true');
          root.querySelector('.im-built mark').textContent = draft.order.join(' ');
          feedback(draft.order.length === task.order.length ? 'Correct. If introduces the yes/no question.' : '');
        };
      });
      if (get('imClear')) get('imClear').onclick = () => { draft.order = []; draft.feedback = ''; render('imClear'); };
      if (get('imDid')) get('imDid').onclick = () => {
        draft.erased = true;
        draft.feedback = draft.past ? 'Correct. Left keeps the past tense.' : 'Now keep the past tense in the main verb.';
        render(draft.past ? 'imNext' : 'imVerb');
      };
      if (get('imVerb')) get('imVerb').onclick = () => {
        const options = get('imVerbChoices');
        options.hidden = !options.hidden;
        get('imVerb').setAttribute('aria-expanded',String(!options.hidden));
        if (!options.hidden) options.querySelector('button').focus();
      };
      root.querySelectorAll('[data-verb]').forEach(button => {
        button.onclick = () => {
          if (button.dataset.verb !== 'left') { feedback('Leaves is present tense. Maya left it yesterday.'); return; }
          draft.past = true;
          draft.feedback = draft.erased ? 'Correct. Left keeps the past tense.' : 'Left keeps the past tense. Now remove did.';
          render(draft.erased ? 'imNext' : 'imDid');
        };
      });
      if (get('imForm')) {
        get('imAnswer').oninput = e => { draft.answer = e.target.value; feedback(''); };
        get('imForm').onsubmit = e => { e.preventDefault(); feedback(checkFinal(draft.answer || '')[1]); };
      }
      if (get('imOral')) get('imOral').onclick = () => { state.oral = true; draft.feedback = ''; render('imOral'); };
      if (get('imWritten')) get('imWritten').onclick = () => { state.oral = false; render('imWritten'); };
      if (focus) get(focus)?.focus({preventScroll:true});
      save();
    }
    render();
    window.scrollTo(0,0);
  }

  const id = 'indirect_marker_b1';
  DMT[id] = 1;
  DMTF[id] = open;
  SPSHORT[id] = 'Indirect questions · word order';
  SPT.push({ id, n: SPSHORT[id], d: 'Mark, build and ask indirect questions in five steps.' });
  const topics = SPGRP.b1;
  const revision = topics.findIndex(([, ids]) => ids.includes('revision_room'));
  const number = 1 + Math.max(0,...topics.filter((_, i) => i !== revision).map(([name]) => parseInt(name,10) || 0));
  if (revision !== -1) topics[revision][0] = (number + 1) + ' · Revision room';
  topics.splice(revision === -1 ? topics.length : revision,0,[number + ' · Indirect questions',[id]]);
  const ids = SPLV.find(([level]) => level === 'b1')?.[2];
  if (ids) {
    const end = ids.indexOf('revision_room');
    ids.splice(end === -1 ? ids.length : end,0,id);
  }
})();
