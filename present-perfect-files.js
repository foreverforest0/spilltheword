/* Physical keepsakes on the left, an independent writing sheet on the right. */
(() => {
  'use strict';
  const stories = window.PresentPerfectFileStories;
  let state = null;
  const photo = (n, alt = '') => `<span class="cf-photo" role="img" aria-label="${esc(alt)}" style="--cf-photo-x:${(n % 3) * 50}%;--cf-photo-y:${n < 3 ? 0 : 100}%"></span>`;
  function fileState(story) {
    if (!S.ppStoryFiles || typeof S.ppStoryFiles !== 'object' || Array.isArray(S.ppStoryFiles)) S.ppStoryFiles = {};
    if (!S.ppStoryFiles[story.id] || typeof S.ppStoryFiles[story.id] !== 'object') S.ppStoryFiles[story.id] = {};
    const saved = S.ppStoryFiles[story.id];
    saved.draft = typeof saved.draft === 'string' ? saved.draft.slice(0, 7000) : '';
    saved.index = Number.isInteger(saved.index) ? Math.min(story.details.length - 1, Math.max(0, saved.index)) : 0;
    if (!Array.isArray(saved.words)) saved.words = [];
    saved.inspect = saved.inspect === true;
    return saved;
  }
  const header = story => `<div class="cf-header"><button type="button" id="cf-topics" class="cf-text-button">← Topics</button><span class="cf-kicker">PRESENT PERFECT / B1</span><button type="button" id="cf-how" class="cf-text-button" aria-expanded="false" aria-controls="cf-help">How to?</button></div><div class="cf-help" id="cf-help" hidden><p>Open a file. Browse eight keepsakes and tell the story as if it happened to you. Click any item to look closer; use the arrows to move between items. A small word hint is available below each one.</p>${story ? `<p>${esc(story.premise)}</p>` : ''}<p>Use Past Simple for dated events and Present Perfect for experiences and what has changed up to the file’s AS OF date. Make your own connections. Write on the sheet, or tell the story aloud. There is no automatic checking or model story.</p><p class="cf-small-print">The photographs, tickets and receipts are recreated keepsakes for these original stories.</p></div>`;
  function bindHeader() {
    document.getElementById('cf-topics').onclick = spSetup;
    document.getElementById('cf-how').onclick = () => {
      const box = document.getElementById('cf-help'); box.hidden = !box.hidden;
      document.getElementById('cf-how').setAttribute('aria-expanded', String(!box.hidden));
    };
  }
  function artwork(d) {
    if (d.kind === 'photo') return `<span class="cf-polaroid">${photo(d.photo,d.alt)}<span class="cf-photo-caption">${esc(d.caption)}</span></span>`;
    return `<svg class="cf-scanned-paper" viewBox="${d.crop.join(' ')}" role="img" aria-label="${esc(d.transcript || d.label)}" focusable="false"><image href="assets/case-files/${d.sheet}-papers.png" width="1536" height="1024"/></svg>`;
  }
  function setup() {
    seaOff(); state = null; S.splevel = 'b1';
    setView(`<section class="cf-page cf-archive" data-stw-plain>${header()}<div class="cf-title"><span class="cf-kicker">LIFE IN FOLDERS / PERSONAL ARCHIVE</span><h1>Unfiled stories.</h1><p>Little things. Whole stories.</p></div><div class="cf-folder-shelf">${stories.map(story => {
      const saved=fileState(story);
      return `<button type="button" class="cf-folder cf-color-${story.color}" id="cf-open-${story.id}" data-cf-file="${story.id}" aria-label="Open file ${story.number}: ${esc(story.title)}"><span class="cf-preview-back"><span class="cf-preview-ticket">${artwork(story.details[0])}</span><span class="cf-preview-receipt">${artwork(story.details[1])}</span><span class="cf-preview-photo">${artwork(story.details[6])}</span></span><span class="cf-folder-cover"><span class="cf-cover-edition">FILE ${story.number} / ${esc(story.place)}</span><span class="cf-cover-title">${esc(story.title)}</span><span class="cf-cover-status">${saved.draft.trim() ? 'Your draft inside' : '8 keepsakes inside'} <span aria-hidden="true">↗</span></span></span></button>`;
    }).join('')}</div><p class="cf-archive-foot">OPEN A FOLDER. FOLLOW THE LITTLE THINGS.</p></section>`);
    bindHeader();
    for (const button of document.querySelectorAll('[data-cf-file]')) button.onclick = () => open(button.dataset.cfFile);
  }
  function open(id) {
    const story = stories.find(s => s.id === id); if (!story) return;
    const saved=fileState(story); state={story,saved}; S.splevel='b1';
    setView(`<section class="cf-page cf-open-file" data-stw-plain data-file="${story.id}">${header(story)}<div class="cf-file-top"><button type="button" class="cf-text-button" id="cf-close">← Close file</button><span class="cf-kicker">FILE ${story.number} / ${esc(story.place)}</span><span class="cf-kicker">AS OF ${story.shortDate}</span></div><div class="cf-open-title"><h1>${esc(story.title)}</h1><span>8 keepsakes / your version</span></div><div class="cf-workspace"><section class="cf-evidence-side" aria-label="Keepsakes"><div class="cf-memory-folder cf-color-${story.color}"><span class="cf-dossier-tab">${esc(story.place.split(',')[0].toUpperCase())} / ${story.number}</span><div class="cf-collage" id="cf-collage">${story.details.map((d,i) => `<button type="button" class="cf-piece cf-piece-${i} cf-piece-${d.kind}" id="cf-piece-${i}" data-cf-piece="${i}" aria-label="Look closer: ${esc(d.label)}" aria-controls="cf-inspector" aria-expanded="false">${artwork(d)}</button>`).join('')}</div><span class="cf-folder-pocket" aria-hidden="true"><span>PERSONAL ARCHIVE / ${story.shortDate}</span></span><div class="cf-inspector" id="cf-inspector" aria-label="A closer look" hidden></div></div><div class="cf-index" role="group" aria-label="Look closer at a keepsake">${story.details.map((d,i) => `<button type="button" id="cf-detail-${i}" data-cf-index="${i}" aria-label="${i+1}. ${esc(d.label)}" aria-pressed="false">${String(i+1).padStart(2,'0')}</button>`).join('')}</div><p class="cf-browse-note">Pick something up. Look a little closer.</p></section><section class="cf-writing-side" aria-label="Your story"><div class="cf-writing-paper"><div class="cf-writing-heading"><span class="cf-kicker">YOUR VERSION / ROUGH DRAFT</span><span class="cf-kicker">${story.shortDate}</span></div><label for="cf-draft">Your story.</label><textarea id="cf-draft" rows="18" maxlength="7000" spellcheck="false" autocomplete="off" placeholder="It started with…">${esc(saved.draft)}</textarea><div class="cf-writing-footer"><span id="cf-draft-status" role="status">${saved.draft.trim() ? 'Your draft is here.' : 'Room for your own version.'}</span><span id="cf-word-count">${wordCount(saved.draft)}</span></div></div></section></div></section>`);
    bindHeader();
    document.getElementById('cf-close').onclick=()=>{setup();document.getElementById('cf-open-'+id)?.focus({preventScroll:true});};
    document.querySelectorAll('[data-cf-piece], [data-cf-index]').forEach(b=>b.onclick=()=>select(+(b.dataset.cfPiece ?? b.dataset.cfIndex)));
    document.getElementById('cf-draft').oninput=e=>{
      saved.draft=e.target.value.slice(0,7000);save();
      document.getElementById('cf-draft-status').textContent='Your draft is here.';
      document.getElementById('cf-word-count').textContent=wordCount(saved.draft);
    };
    document.querySelector('.cf-evidence-side').onkeydown=e=>{
      if(e.ctrlKey||e.altKey||e.metaKey)return;
      if(e.key==='Escape'&&saved.inspect){e.preventDefault();closeInspector();}
      if((e.key==='ArrowLeft'||e.key==='ArrowRight')&&saved.inspect){e.preventDefault();select(saved.index+(e.key==='ArrowLeft'?-1:1),true);}
    };
    renderInspector();
  }
  function wordCount(s){const n=s.trim()?s.trim().split(/\s+/).length:0;return `${n} ${n===1?'word':'words'}`;}
  function select(index, focus=true){
    if(!state||index<0||index>=state.story.details.length)return;
    state.saved.index=index;state.saved.inspect=true;save();renderInspector();
    if(focus)document.getElementById('cf-document').focus({preventScroll:true});
  }
  function closeInspector(){
    state.saved.inspect=false;save();renderInspector();
    document.getElementById('cf-piece-'+state.saved.index).focus({preventScroll:true});
  }
  function renderInspector(){
    const {story,saved}=state, panel=document.getElementById('cf-inspector'), d=story.details[saved.index];
    panel.hidden=!saved.inspect;
    document.querySelectorAll('[data-cf-index]').forEach(b=>b.setAttribute('aria-pressed',String(saved.inspect&&+b.dataset.cfIndex===saved.index)));
    document.querySelectorAll('[data-cf-piece]').forEach(b=>{b.setAttribute('aria-expanded',String(saved.inspect&&+b.dataset.cfPiece===saved.index));b.tabIndex=saved.inspect?-1:0;});
    document.getElementById('cf-collage').inert=saved.inspect;
    if(!saved.inspect){panel.innerHTML='';return;}
    const revealed=saved.words.includes(d.id);
    panel.innerHTML=`<div class="cf-inspect-top"><span class="cf-kicker">${String(saved.index+1).padStart(2,'0')} / 08 — ${esc(d.label)}</span><button type="button" id="cf-put-back" aria-label="Put keepsake back">×</button></div><button type="button" id="cf-document" class="cf-enlarged cf-enlarged-${d.kind}" aria-label="${esc(d.label)}. Reveal or hide a word hint." aria-expanded="${revealed}" aria-controls="cf-word">${artwork(d)}</button><div class="cf-hint-line"><button type="button" id="cf-hint" aria-expanded="${revealed}" aria-controls="cf-word">${revealed?'Hide word':'A word to try ↗'}</button><span id="cf-word" class="cf-word" role="note" aria-live="polite" ${revealed?'':'hidden'}><strong>${esc(d.word)}</strong></span></div><div class="cf-card-controls"><button type="button" id="cf-prev" ${saved.index===0?'disabled':''} aria-label="Previous keepsake">← Previous</button><button type="button" id="cf-next" ${saved.index===story.details.length-1?'disabled':''} aria-label="Next keepsake">Next →</button></div>`;
    document.getElementById('cf-put-back').onclick=closeInspector;
    document.getElementById('cf-prev').onclick=()=>select(saved.index-1,true);
    document.getElementById('cf-next').onclick=()=>select(saved.index+1,true);
    const toggle=()=>{
      const word=document.getElementById('cf-word');word.hidden=!word.hidden;
      ['cf-hint','cf-document'].forEach(id=>document.getElementById(id).setAttribute('aria-expanded',String(!word.hidden)));
      document.getElementById('cf-hint').textContent=word.hidden?'A word to try ↗':'Hide word';
      saved.words=word.hidden?saved.words.filter(w=>w!==d.id):[...new Set([...saved.words,d.id])];save();
    };
    document.getElementById('cf-document').onclick=toggle;document.getElementById('cf-hint').onclick=toggle;
  }
  const group=SPGRP.b1.find(g=>/^1\s*·/.test(g[0]));
  if(group&&!group[1].includes('ppfiles'))group[1].splice(1,0,'ppfiles');
  SPSHORT.ppfiles='Story files';DMT.ppfiles=1;DMTF.ppfiles=setup;
  SPT.push({id:'ppfiles',n:'Present Perfect: Story files',d:'A folder of photographs, tickets and receipts. Find the story; write your version.'});
  window.PresentPerfectFiles={stories,setup,open,get state(){return state;}};
})();
