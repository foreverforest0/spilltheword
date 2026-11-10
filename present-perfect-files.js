/* Browse evidence, reveal a small lexical cue, and write freely. No answer grader. */
(() => {
  'use strict';
  const stories = window.PresentPerfectFileStories;
  let state = null;
  const photo = (n, cls = '', alt = '') => `<span class="cf-photo ${cls}" role="img" aria-label="${esc(alt)}" style="--cf-photo-x:${(n % 3) * 50}%;--cf-photo-y:${n < 3 ? 0 : 100}%"></span>`;
  function stored() {
    if (!S.ppStoryFiles || typeof S.ppStoryFiles !== 'object' || Array.isArray(S.ppStoryFiles)) S.ppStoryFiles = {};
    return S.ppStoryFiles;
  }
  function fileState(story) {
    const files = stored();
    if (!files[story.id] || typeof files[story.id] !== 'object') files[story.id] = {};
    const saved = files[story.id];
    saved.draft = typeof saved.draft === 'string' ? saved.draft.slice(0, 7000) : '';
    saved.index = Number.isInteger(saved.index) ? Math.min(story.details.length - 1, Math.max(0, saved.index)) : 0;
    if (!Array.isArray(saved.words)) saved.words = [];
    return saved;
  }
  const header = (inside = false) => `<header class="cf-header"><button type="button" id="cf-topics" class="cf-text-button">← Topics</button><span class="cf-kicker">PRESENT PERFECT / B1</span><button type="button" id="cf-how" class="cf-text-button" aria-expanded="false" aria-controls="cf-help">How to?</button></header><div class="cf-help" id="cf-help" hidden><p>${inside ? 'Tell this story as if it happened to you.' : 'Open a file and tell the story as if it happened to you.'} Browse the seven pieces of evidence. Connect the details in your own words, aloud or on the writing sheet. You can choose your own order.</p><p>Click a document to reveal a useful word. Dates describe finished events; the notes marked Today show what has changed up to the date of this file. Present Perfect and Past Simple can work together. There is no automatic checking or model story.</p><p class="cf-small-print">Original everyday-life stories. Tickets, receipts, messages and photographs are recreated for this activity.</p></div>`;
  function bindHeader() {
    document.getElementById('cf-topics').onclick = spSetup;
    document.getElementById('cf-how').onclick = () => {
      const box = document.getElementById('cf-help');
      box.hidden = !box.hidden;
      document.getElementById('cf-how').setAttribute('aria-expanded', String(!box.hidden));
    };
  }
  function setup() {
    seaOff(); state = null; S.splevel = 'b1';
    setView(`<section class="cf-page cf-archive" data-stw-plain>${header()}<div class="cf-title"><span class="cf-kicker">THREE FILES / TWENTY-ONE LITTLE DETAILS</span><h1>Unfiled stories<span class="cf-title-dot">.</span></h1><p>A ticket. A photograph. Something that happened next.</p></div><div class="cf-folder-shelf">${stories.map(story => {
      const saved = fileState(story);
      return `<button type="button" class="cf-folder" id="cf-open-${story.id}" data-cf-file="${story.id}" aria-label="Open file ${story.number}: ${esc(story.title)}"><span class="cf-folder-tab">FILE ${story.number} / B1</span><span class="cf-folder-spine" aria-hidden="true">EXPERIENCE / DETAILS / NOW</span><span class="cf-folder-cover"><span class="cf-cover-edition">PERSONAL ARCHIVE<br>CASE ${story.number} — ${story.shortDate}</span><span class="cf-cover-title">${story.cover.map(s => `<span>${esc(s)}</span>`).join('')}</span><span class="cf-cover-photo">${photo(story.photo, '', story.teaser)}<span class="cf-photo-caption">${esc(story.place)}</span><i class="cf-paperclip" aria-hidden="true"></i></span><span class="cf-cover-ledger"><span>LOCATION <b>${esc(story.place)}</b></span><span>CONTENTS <b>7 pieces of evidence</b></span><span>STATUS <b>${saved.draft.trim() ? 'Your draft inside' : 'Ready to open'}</b></span></span></span></button>`;
    }).join('')}</div><p class="cf-archive-foot">OPEN A FILE. FIND THE STORY BETWEEN THE SCRAPS.</p></section>`);
    bindHeader();
    for (const button of document.querySelectorAll('[data-cf-file]')) button.onclick = () => open(button.dataset.cfFile);
  }
  function documentCopy(detail) {
    let copy = '';
    if (detail.photo !== undefined) copy += photo(detail.photo, 'cf-evidence-photo', detail.alt);
    copy += `<span class="cf-document-copy" id="cf-document-copy"><span class="cf-doc-date">${esc(detail.date)}</span>${detail.eyebrow ? `<span class="cf-doc-eyebrow">${esc(detail.eyebrow)}</span>` : ''}<strong class="cf-doc-heading">${esc(detail.heading)}</strong>`;
    if (detail.code) copy += `<span class="cf-doc-code">${esc(detail.code)}</span>`;
    if (detail.rows) copy += `<span class="cf-doc-rows">${detail.rows.map(([label, value]) => `<span><span>${esc(label)}</span><b>${esc(value)}</b></span>`).join('')}</span>`;
    if (detail.notes) copy += `<span class="cf-doc-notes">${detail.notes.map(n => `<span>${esc(n)}</span>`).join('')}</span>`;
    if (detail.message) copy += `<span class="cf-message-sender">${esc(detail.sender)}</span><span class="cf-message">${esc(detail.message)}</span>`;
    if (detail.foot) copy += `<span class="cf-doc-foot">${esc(detail.foot)}</span>`;
    if (detail.kind === 'ticket' || detail.kind === 'receipt') copy += '<span class="cf-barcode" aria-hidden="true"></span>';
    return copy + '</span>';
  }
  function open(id) {
    const story = stories.find(s => s.id === id); if (!story) return;
    const saved = fileState(story); state = {story, saved};
    S.splevel = 'b1';
    setView(`<section class="cf-page cf-open-file" data-stw-plain data-file="${story.id}">${header(true)}<div class="cf-file-top"><button type="button" class="cf-close-file" id="cf-close">Close file ↗</button><span class="cf-kicker">PERSONAL ARCHIVE / FILE ${story.number}</span><span class="cf-file-date">AS OF ${story.shortDate}</span></div><div class="cf-open-title"><h1>${esc(story.title)}</h1><span>${esc(story.place)} / 7 pieces of evidence</span></div><div class="cf-dossier"><span class="cf-dossier-tab">FILE ${story.number}</span><section class="cf-evidence-side" aria-label="Evidence"><div class="cf-evidence-meta"><span>THE EVIDENCE</span><span id="cf-position" aria-live="polite"></span></div><div class="cf-paper-stack" id="cf-paper-stack"></div><div class="cf-card-controls"><button type="button" id="cf-prev" aria-label="Previous piece of evidence">← Back</button><span id="cf-card-label"></span><button type="button" id="cf-next" aria-label="Next piece of evidence">Next →</button></div><div class="cf-index" role="group" aria-label="Choose a piece of evidence">${story.details.map((d, i) => `<button type="button" id="cf-detail-${i}" data-cf-index="${i}" aria-pressed="false"><span>${String(i + 1).padStart(2, '0')}</span>${esc(d.label)}</button>`).join('')}</div></section><section class="cf-writing-side" aria-label="Your story"><div class="cf-writing-paper"><i class="cf-binder" aria-hidden="true"></i><div class="cf-writing-heading"><span class="cf-kicker">FIELD NOTES / YOUR VERSION</span><span class="cf-writing-date">${esc(story.date)}</span></div><label for="cf-draft">The story, in your words.</label><p class="cf-writing-prompt">${esc(story.note)}</p><textarea id="cf-draft" rows="15" maxlength="7000" spellcheck="false" autocomplete="off" placeholder="Start wherever the story begins for you…">${esc(saved.draft)}</textarea><div class="cf-writing-footer"><span id="cf-draft-status" role="status">${saved.draft.trim() ? 'Your draft is here.' : 'Room for your own version.'}</span><span>PERSONAL ARCHIVE / ROUGH DRAFT</span></div></div><span class="cf-envelope-edge" aria-hidden="true"></span></section></div></section>`);
    bindHeader();
    document.getElementById('cf-close').onclick = () => { setup(); document.getElementById('cf-open-' + id)?.focus({preventScroll:true}); };
    document.getElementById('cf-prev').onclick = () => select(saved.index - 1, -1);
    document.getElementById('cf-next').onclick = () => select(saved.index + 1, 1);
    for (const b of document.querySelectorAll('[data-cf-index]')) b.onclick = () => select(+b.dataset.cfIndex, +b.dataset.cfIndex < saved.index ? -1 : 1);
    const input = document.getElementById('cf-draft');
    input.oninput = () => { saved.draft = input.value.slice(0, 7000); save(); document.getElementById('cf-draft-status').textContent = 'Your draft is here.'; };
    document.querySelector('.cf-evidence-side').onkeydown = e => {
      if (e.ctrlKey || e.altKey || e.metaKey || e.target.closest('textarea,input,select')) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); select(saved.index + (e.key === 'ArrowLeft' ? -1 : 1), e.key === 'ArrowLeft' ? -1 : 1); }
    };
    renderEvidence(0);
  }
  function select(index, direction) {
    if (!state || index < 0 || index >= state.story.details.length || index === state.saved.index) return;
    state.saved.index = index; save(); renderEvidence(direction);
  }
  function renderEvidence(direction) {
    const {story, saved} = state, detail = story.details[saved.index], revealed = saved.words.includes(detail.id);
    document.getElementById('cf-position').textContent = `${String(saved.index + 1).padStart(2, '0')} / ${String(story.details.length).padStart(2, '0')}`;
    document.getElementById('cf-card-label').textContent = detail.label;
    document.getElementById('cf-prev').disabled = saved.index === 0;
    document.getElementById('cf-next').disabled = saved.index === story.details.length - 1;
    const pile = document.getElementById('cf-paper-stack'), documentFocused = document.activeElement?.id === 'cf-document';
    pile.style.setProperty('--cf-from', direction < 0 ? '-16px' : '16px');
    pile.innerHTML = `<span class="cf-under-sheet cf-under-one" aria-hidden="true"></span><span class="cf-under-sheet cf-under-two" aria-hidden="true"></span><button type="button" id="cf-document" class="cf-document cf-document-${detail.kind}${direction ? ' cf-shuffled' : ''}" aria-expanded="${revealed}" aria-controls="cf-word" aria-describedby="cf-document-copy" aria-label="${esc(detail.label)}. Click to ${revealed ? 'hide' : 'reveal'} a useful word.">${documentCopy(detail)}<span class="cf-document-click">${revealed ? 'HIDE THE WORD ↗' : 'CLICK FOR A WORD ↗'}</span></button><div class="cf-word" id="cf-word" role="note" aria-live="polite" ${revealed ? '' : 'hidden'}><span>A WORD TO TRY</span><strong>${esc(detail.word)}</strong>${detail.extraWord ? `<small>or ${esc(detail.extraWord)}</small>` : ''}</div>`;
    for (const b of document.querySelectorAll('[data-cf-index]')) b.setAttribute('aria-pressed', String(+b.dataset.cfIndex === saved.index));
    document.getElementById('cf-document').onclick = () => {
      const word = document.getElementById('cf-word'), button = document.getElementById('cf-document');
      word.hidden = !word.hidden;
      button.setAttribute('aria-expanded', String(!word.hidden));
      button.setAttribute('aria-label', detail.label + '. Click to ' + (word.hidden ? 'reveal' : 'hide') + ' a useful word.');
      button.querySelector('.cf-document-click').textContent = word.hidden ? 'CLICK FOR A WORD ↗' : 'HIDE THE WORD ↗';
      saved.words = word.hidden ? saved.words.filter(w => w !== detail.id) : [...new Set([...saved.words, detail.id])]; save();
    };
    if (documentFocused) document.getElementById('cf-document').focus({preventScroll:true});
  }
  const group = SPGRP.b1.find(g => /^1\s*·/.test(g[0]));
  if (group && !group[1].includes('ppfiles')) group[1].splice(1, 0, 'ppfiles');
  SPSHORT.ppfiles = 'Story files'; DMT.ppfiles = 1; DMTF.ppfiles = setup;
  SPT.push({id:'ppfiles',n:'Present Perfect: Story files',d:'Browse seven pieces of evidence and tell your own story. Click a document for a useful word.'});
  window.PresentPerfectFiles = {stories, setup, open, get state() { return state; }};
})();
