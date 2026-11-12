/* Standalone Appearance embeds preserve the current portrait, brief or guessing sheet. */
(()=>{
 'use strict';
 if(new URLSearchParams(location.search).has('embed')){document.body.classList.add('embed');return;}
 try{if(parent!==window&&parent.SharedGame)return;}catch{}
 const toolbar=document.createElement('div');toolbar.className='appearance-share-toolbar';toolbar.dataset.noShareReplay='true';
 const getCode=()=>{
  const state=AppearanceStudio.exportState(),bytes=new TextEncoder().encode(JSON.stringify(state));let raw='';for(const b of bytes)raw+=String.fromCharCode(b);
  const token=btoa(raw).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');const url=new URL(location.href);url.searchParams.set('embed','1');url.hash='studio='+token;
  return SpillEmbed.frame(url.href,'Appearance · Portrait Studio',1000);
 };
 toolbar.append(SpillEmbed.controls(getCode));document.body.insertBefore(toolbar,document.getElementById('app'));
 window.AppearanceEmbed={getCode};
})();
