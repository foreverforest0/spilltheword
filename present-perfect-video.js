/* Local, attributed video excerpts; authored prompts and optional models.
   Open writing has no automatic grammar grader. */
(() => {
  'use strict';
  const data = PresentPerfectVideoData, asset = id => 'assets/present-perfect-video/' + id;
  let state = null, dispose = null;
  const baseView = setView;
  setView = function(html) { dispose?.(); dispose = null; return baseView(html); };
  const record = value => value && typeof value === 'object' && !Array.isArray(value);
  function settings() {
    if (!record(S.ppVideo)) S.ppVideo = {};
    const s = S.ppVideo;
    if (!data.groups.some(g => g.id === s.group)) s.group = 'just';
    for (const key of ['active','drafts','hints','models','frames']) if (!record(s[key])) s[key] = {};
    return s;
  }
  function open() {
    seaOff(); S.splevel = 'b1';
    render();
  }
  function render() {
    const s = settings(), group = data.groups.find(g => g.id === s.group), tasks = data.tasks.filter(t => t.group === group.id);
    const task = tasks.find(t => t.id === s.active[group.id]) || tasks[0], index = tasks.indexOf(task), source = data.sources[task.source];
    s.active[group.id] = task.id;
    if (!Array.isArray(s.drafts[task.id])) s.drafts[task.id] = [];
    const drafts = s.drafts[task.id];
    for (let i = 0; i < task.fields.length; i++) drafts[i] = typeof drafts[i] === 'string' ? drafts[i].slice(0,2500) : '';
    state = {group:group.id,task:task.id};
    setView(`<section class="pv-page"><div class="pv-topbar"><button type="button" id="pv-topics">← Topics</button><span>PRESENT PERFECT / B1</span><button type="button" id="pv-how" aria-expanded="false" aria-controls="pv-help">How to?</button></div><div id="pv-help" class="pv-help" hidden><p>Watch a short action, then describe its result now, inside the scene. Choose an exercise type above the player. Replay as often as you need; Hint gives a useful verb or principle.</p><p>Write your own sentence, or say it aloud. Show answer opens one possible model and does not mark your answer. There is no automatic grammar check. Dates of the original films are not dates to put in your sentence.</p><p>Your writing stays separate for each clip. Copy link keeps the exercise, hints and drafts; playback is independent on each device. The two source films are openly licensed Blender animations; these are edited, silent excerpts.</p></div><div class="pv-title"><span class="pv-eyebrow">EIGHT SMALL SCENES / FOUR WAYS TO PRACTISE</span><h1>What just happened?</h1></div><div class="pv-modes" role="group" aria-label="Choose the exercise type">${data.groups.map(g => `<button type="button" id="pv-mode-${g.id}" data-pv-group="${g.id}" aria-pressed="${g.id === group.id}"><span>${esc(g.name)}</span><small>${data.tasks.filter(t => t.group === g.id).length} clips</small></button>`).join('')}</div><p class="pv-aim">${esc(group.aim)}</p><div class="pv-workspace"><section class="pv-viewer" aria-label="Video scene"><div class="pv-reel-label"><span id="pv-clip-title">${esc(task.title)}</span><span>CLIP ${index + 1} / ${tasks.length}</span></div><div class="pv-stage"><video id="pv-video" controls playsinline muted preload="metadata" poster="${asset(task.id + '-before.jpg')}" aria-label="${esc(task.alt)}"><source src="${asset(task.id + '.mp4')}" type="video/mp4">Your browser cannot play this video.</video><img class="pv-live-frame" id="pv-live-frame" src="${asset(task.id + '-before.jpg')}" alt="${esc(task.alt)}"></div><div class="pv-playback"><button type="button" id="pv-replay">Play clip ↻</button><span id="pv-watch-status" role="status">Watch the action. Notice the result.</span>${group.id === 'change' ? `<button type="button" id="pv-frames" aria-expanded="${!!s.frames[task.id]}" aria-controls="pv-frame-pair">Compare frames</button>` : ''}</div><div id="pv-frame-pair" class="pv-frame-pair" ${group.id === 'change' && s.frames[task.id] ? '' : 'hidden'}><figure><img src="${asset(task.id + '-before.jpg')}" alt="First frame: ${esc(task.alt)}"><figcaption>Before</figcaption></figure><figure><img src="${asset(task.id + '-after.jpg')}" alt="Last frame: the completed action"><figcaption>After</figcaption></figure></div><div class="pv-credit"><span>Excerpt from <a href="${source.url}" target="_blank" rel="noopener">${esc(source.title)}</a> · ${esc(source.creator)} · <a href="${source.licenseUrl}" target="_blank" rel="noopener">${source.license}</a></span><details><summary>Film credits</summary><p>${esc(source.title)} (${source.year}), directed by ${esc(source.director)}. ${esc(source.creator)}. Edited excerpt: cropped in time, resized, muted; final frame held briefly.</p><a href="${source.copy}" target="_blank" rel="noopener">Source copy and full credits</a></details></div></section><section class="pv-writing" aria-label="Your answer"><div class="pv-task-top"><span>YOUR TURN</span><button type="button" id="pv-hint" aria-expanded="${!!s.hints[task.id]}" aria-controls="pv-hint-copy">Hint</button></div><p class="pv-prompt">${esc(task.prompt)}</p><p class="pv-hint" id="pv-hint-copy" ${s.hints[task.id] ? '' : 'hidden'}>${esc(task.hint)}</p>${task.fields.map((field,i) => `<label for="pv-answer-${i}">${esc(field)}</label><textarea id="pv-answer-${i}" class="pv-answer" data-pv-field="${i}" maxlength="2500" rows="${task.fields.length === 1 ? 5 : 3}" spellcheck="false" autocomplete="off" placeholder="Your own words…">${esc(drafts[i])}</textarea>`).join('')}<button type="button" id="pv-answer-toggle" aria-expanded="${!!s.models[task.id]}" aria-controls="pv-models">${s.models[task.id] ? 'Hide answer' : 'Show answer'}</button><div class="pv-models" id="pv-models" ${s.models[task.id] ? '' : 'hidden'}><small>ONE POSSIBLE ANSWER</small>${task.models.map((models,i) => `<p>${task.fields.length > 1 ? `<span>${esc(task.fields[i])}</span>` : ''}${esc(models[0])}</p>`).join('')}<small>Other wording is possible.</small></div></section></div><div class="pv-navigation"><button type="button" id="pv-back" ${index === 0 ? 'disabled' : ''}>← Back</button><div class="pv-clip-tabs" role="group" aria-label="Choose a clip">${tasks.map((t,i) => `<button type="button" id="pv-clip-${t.id}" data-pv-clip="${t.id}" aria-pressed="${t.id === task.id}"><span>${String(i+1).padStart(2,'0')}</span>${esc(t.title)}</button>`).join('')}</div><button type="button" id="pv-next" ${index === tasks.length - 1 ? 'disabled' : ''}>Next →</button></div></section>`);
    const root = document.querySelector('.pv-page'), video = document.getElementById('pv-video'), status = document.getElementById('pv-watch-status'), play = document.getElementById('pv-replay');
    let alive = true, lastCapture = 0;
    const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 360;
    function capture() {
      if (!alive || video.readyState < 2 || !video.videoWidth) return;
      try { canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height); document.getElementById('pv-live-frame').src = canvas.toDataURL('image/jpeg',.62); } catch {}
    }
    function toggle(buttonId, copyId, store) {
      const b = document.getElementById(buttonId), copy = document.getElementById(copyId);
      b.onclick = () => { copy.hidden = !copy.hidden; s[store][task.id] = !copy.hidden; b.setAttribute('aria-expanded',String(!copy.hidden)); save(); if (store === 'models') b.textContent = copy.hidden ? 'Show answer' : 'Hide answer'; };
    }
    document.getElementById('pv-topics').onclick = spSetup;
    document.getElementById('pv-how').onclick = () => { const box = document.getElementById('pv-help'); box.hidden = !box.hidden; document.getElementById('pv-how').setAttribute('aria-expanded',String(!box.hidden)); };
    for (const b of root.querySelectorAll('[data-pv-group]')) b.onclick = () => { s.group = b.dataset.pvGroup; save(); render(); document.getElementById('pv-mode-' + s.group).focus({preventScroll:true}); };
    function choose(id) { if (!tasks.some(t => t.id === id) || id === task.id) return; s.active[group.id] = id; save(); render(); }
    for (const b of root.querySelectorAll('[data-pv-clip]')) b.onclick = () => { choose(b.dataset.pvClip); document.getElementById('pv-clip-' + b.dataset.pvClip)?.focus({preventScroll:true}); };
    document.getElementById('pv-back').onclick = () => choose(tasks[index - 1]?.id);
    document.getElementById('pv-next').onclick = () => choose(tasks[index + 1]?.id);
    for (const input of root.querySelectorAll('[data-pv-field]')) input.oninput = () => { drafts[+input.dataset.pvField] = input.value.slice(0,2500); save(); };
    toggle('pv-hint','pv-hint-copy','hints'); toggle('pv-answer-toggle','pv-models','models');
    if (document.getElementById('pv-frames')) toggle('pv-frames','pv-frame-pair','frames');
    play.onclick = async () => {
      try { video.currentTime = 0; video.muted = true; await video.play(); if (alive) play.textContent = 'Replay ↻'; }
      catch { if (alive) status.textContent = 'Press Play on the video to watch the scene.'; }
    };
    video.onplaying = () => { status.textContent = 'Watch the action…'; play.textContent = 'Replay ↻'; };
    video.ontimeupdate = () => { if (performance.now() - lastCapture > 900) { lastCapture = performance.now(); capture(); } };
    video.onpause = capture; video.onseeked = capture;
    video.onended = () => { if (!alive) return; capture(); status.textContent = 'Now describe the result.'; };
    video.onerror = () => { if (alive) status.textContent = 'The clip could not load. Try Replay or choose another clip.'; };
    root.onkeydown = e => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || e.target.closest('textarea,input,select,video,a,details')) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault(); const next = tasks[index + (e.key === 'ArrowLeft' ? -1 : 1)]; if (next) { choose(next.id); document.getElementById('pv-clip-' + next.id)?.focus({preventScroll:true}); }
      }
    };
    dispose = () => { alive = false; for (const key of ['onplaying','ontimeupdate','onpause','onseeked','onended','onerror']) video[key] = null; video.pause(); video.removeAttribute('src'); video.querySelector('source')?.removeAttribute('src'); video.load(); };
  }
  const group = SPGRP.b1.find(g => /^1\s*·/.test(g[0]));
  if (group && !group[1].includes('ppvideo')) group[1].splice(group[1].includes('ppfiles') ? group[1].indexOf('ppfiles') + 1 : 1,0,'ppvideo');
  SPSHORT.ppvideo = 'Video: what just happened?'; DMT.ppvideo = 1; DMTF.ppvideo = open;
  SPT.push({id:'ppvideo',n:'Present Perfect: video scenes',d:'Watch a completed action and describe its result. Four types of practice, with optional hints and models.'});
  window.PresentPerfectVideo = {data,open,get state() { return state; }};
})();
