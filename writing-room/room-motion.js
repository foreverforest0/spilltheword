/* Add hand-painted motion to the existing room, leaving its illustration intact. */
window.BardRoomMotion={create(host){
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.classList.add('wr-room-overlays');svg.setAttribute('viewBox','0 0 1024 1536');svg.setAttribute('aria-hidden','true');
 const image='<image href="assets/room.webp" width="1024" height="1536"/>';
 function blink(id,eyes,duration,begin){
  const lids=eyes.map(([x,y,colour])=>`<ellipse cx="${x}" cy="${y}" rx="6" ry="7" fill="${colour}"/>`).join(''),lines=eyes.map(([x,y])=>`M${x-3.5} ${y}Q${x} ${y+2} ${x+3.5} ${y}`).join('');
  return `<g class="wr-blink" data-blink="${id}" opacity="0">${lids}<path d="${lines}" fill="none" stroke="#70271F" stroke-width="1.6" stroke-linecap="round"/><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.65;.68;.71;.74;1" dur="${duration}s" begin="${begin}s" repeatCount="indefinite"/></g>`;
 }
 function finger(id,x,y,delay){return `<defs><radialGradient id="${id}-fade"><stop offset="0" stop-color="white"/><stop offset=".65" stop-color="white"/><stop offset="1" stop-color="black"/></radialGradient><mask id="${id}-mask" maskUnits="userSpaceOnUse" x="${x-15}" y="${y-17}" width="30" height="34"><ellipse cx="${x}" cy="${y}" rx="15" ry="17" fill="url(#${id}-fade)"/></mask></defs><g class="wr-finger" data-finger="${id}" mask="url(#${id}-mask)"><g>${image}<animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 -3;0 2;0 -2;0 0;0 0" keyTimes="0;.3;.36;.42;.48;.55;1" dur="3.8s" begin="${delay}s" repeatCount="indefinite"/></g></g>`}
 svg.innerHTML=`<defs><clipPath id="wr-globe-disk"><circle cx="891" cy="1229" r="95"/></clipPath></defs><g clip-path="url(#wr-globe-disk)"><g class="wr-globe-spin">${image}<animateTransform attributeName="transform" type="rotate" from="0 891 1229" to="360 891 1229" dur="36s" repeatCount="indefinite"/></g></g>`+
  blink('wr-poet-eyes',[[522,109,'#fbd4b7'],[554,111,'#fcd4b5']],4.7,.4)+blink('wr-woman-eyes',[[325,194,'#fbe1c5'],[351,197,'#fae0c4']],5.3,1.15)+blink('wr-writer-eyes',[[407,512,'#fbceaf'],[462,512,'#fac3a2']],4.3,0)+
  finger('wr-index',447,671,0)+finger('wr-middle',444,684,.12)+finger('wr-ring',435,697,.24);
 host.insertBefore(svg,host.querySelector('span'));svg.pauseAnimations?.();
 return {play(){svg.unpauseAnimations?.()},pause(){svg.pauseAnimations?.()},destroy(){svg.pauseAnimations?.();svg.remove()},element:svg};
}};
