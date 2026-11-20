/* Keep the selected Grammar exercise in the generated iframe link. */
(() => {
  'use strict';
  if (new URLSearchParams(location.hash.slice(1)).has('embed') || !window.SpillEmbed) return;

  const style = document.createElement('style');
  style.textContent = '.grammar-embed-tools{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;padding:12px 16px 24px}.grammar-embed-tools>button{color:#001166;background:#f9f5e6;border:1px solid #001166;border-radius:6px;padding:6px 12px;cursor:pointer}.grammar-embed-tools .stw-embed-panel{max-width:44rem}';
  document.head.append(style);

  const renderView = setView;
  setView = function (html) {
    const result = renderView.call(this, html);
    const id = BLOBID;
    if (!id || !['gram', 'speak'].includes(tab)) return result;
    const exercise = SPT.find(item => item.id === id);
    if (!DMT[id] && !exercise) return result;
    const level = S.splevel || 'b1';
    const mode = S.tdm?.[id] || S.mgxt?.[id];
    const title = SPSHORT[id] || exercise?.n || 'Spill the Word';
    const toolbar = document.createElement('div');
    toolbar.className = 'grammar-embed-tools';
    toolbar.append(window.SpillEmbed.controls(() => {
      const url = new URL(location.pathname, location.href);
      const params = new URLSearchParams({g: 'speak', tp: id, lv: level, embed: ''});
      if (mode) params.set('m', mode);
      url.hash = params.toString();
      return window.SpillEmbed.frame(url.href, title, 780);
    }));
    document.getElementById('view').append(toolbar);
    return result;
  };
})();
