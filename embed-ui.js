/* Reusable, local iframe-code panel for prepared games. */
(()=>{
 'use strict';
 const escape=s=>String(s).replace(/[&"<>]/g,c=>({'&':'&amp;','"':'&quot;','<':'&lt;','>':'&gt;'}[c]));
 function frame(url,title='Spill the Word',height=1000){return `<iframe src="${escape(url)}" title="${escape(title)}" width="100%" height="${height}" style="border:0;max-width:100%" allow="clipboard-write; fullscreen" loading="lazy"></iframe>`;}
 async function copy(value){try{await navigator.clipboard.writeText(value);return true}catch{return false}}
 function controls(getCode){
  const fragment=document.createDocumentFragment(),button=document.createElement('button'),panel=document.createElement('div');
  button.type='button';button.textContent='Embed';button.className='stw-embed-toggle';button.setAttribute('aria-expanded','false');button.dataset.noShareReplay='true';
  panel.className='stw-embed-panel';panel.hidden=true;panel.dataset.noShareReplay='true';
  const label=document.createElement('label');label.textContent='Paste this code into an HTML / iframe block.';
  const area=document.createElement('textarea');area.readOnly=true;area.rows=4;area.setAttribute('aria-label','Embed code');label.append(area);
  const copyButton=document.createElement('button');copyButton.type='button';copyButton.textContent='Copy embed code';
  const status=document.createElement('output');status.setAttribute('role','status');panel.append(label,copyButton,status);
  button.onclick=async()=>{
   if(!panel.hidden){panel.hidden=true;button.setAttribute('aria-expanded','false');return;}
   button.disabled=true;status.textContent='';
   try{area.value=await getCode();panel.hidden=false;button.setAttribute('aria-expanded','true');area.focus();area.select();}
   catch(e){status.textContent=e.message||'Could not make the embed.';panel.hidden=false;}
   finally{button.disabled=false;}
  };
  copyButton.onclick=async()=>{const ok=await copy(area.value);if(!ok){area.focus();area.select();}status.textContent=ok?'Embed code copied.':'Select and copy the code above.';};
  fragment.append(button,panel);return fragment;
 }
 const style=document.createElement('style');style.textContent='body:has(.game-share-toolbar) #embbar{display:none!important}.embed .appearance-share-toolbar{display:none!important}.stw-embed-panel{flex-basis:100%;width:100%;box-sizing:border-box;padding:16px;background:#F9F5E6;color:#26422B;border:1px solid #70271F44;text-align:left}.stw-embed-panel[hidden]{display:none!important}.stw-embed-panel label{display:block;font:14px/1.5 Georgia,serif}.stw-embed-panel textarea{box-sizing:border-box;display:block;width:100%;max-width:100%;min-height:110px;margin:10px 0;padding:10px;background:#fff;color:#70271F;font:13px/1.4 monospace;resize:vertical;border:1px solid #70271F44}.stw-embed-panel output{font:14px Georgia,serif;margin-left:12px}.appearance-share-toolbar{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;max-width:1280px;margin:14px auto 0;padding:0 24px}';document.head.append(style);
 window.SpillEmbed={frame,controls,copy};
})();
