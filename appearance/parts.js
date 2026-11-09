/* Original watercolor pieces, aligned to shared facial landmarks.
   Hair is anchored by its face opening; accessories retain their native proportions. */
const AppearanceParts=(()=>{
 const catalog=APPEARANCE_CATALOG;
 const find=(kind,id)=>catalog[kind]?.find(x=>x.id===String(id));
 const metric=item=>item?APPEARANCE_GEOMETRY[item.file.split('/').pop()]:null;
 let serial=0;
 const hairAnchors=[[114.8,66],[122.5,106],[132.5,120],[118.5,70],[127,92],[151.8,115],[126.2,113],[89.5,64],[142,28],[126.2,40],[130.8,83],[137,122],[131.8,87],[134.8,92],[125.8,87],[109.8,52],[119.5,112],[166.2,87],[127.8,63],[127.8,98],[144.8,51],[109.5,31],[115.8,69],[118.5,61]];
 const hairlines=[190,212,219,187,217,217,214,190,180,183,207,216,218,218,211,190,220,193,196,215,194,181,204,197];
 const eyeTrim=[.17,0,.025,.025,.12,.14,0,.04,.08,.08,.10,0,0,.12,.04,.12,0,0,0,.14,.12];
 const mouthWidths=[60,64,62,58,60,44,66,56,56,28,58,60];
 const hatWidths={'6':276,'7':276,'8':208,'9':270,'10':280,'11':282};
 const hatCenters={'6':128,'7':135,'8':226,'9':144,'10':178,'11':115};
 const hatBrims={'6':216,'7':216,'8':218,'9':211,'10':220,'11':221};
 const facialFit={
  4:[172,.52],5:[174,.42],6:[180,.25],7:[182,.29],9:[150,.40],10:[160,.17],11:[178,.30],
  13:[170,.73],14:[172,.48],16:[178,.31],17:[178,.36],19:[184,.36]
 };
 function image(item,rect,extra=''){
  if(!item||!rect)return '';
  return `<image data-part="${item.file.split('/').pop()}" href="${item.src}" x="${rect[0]}" y="${rect[1]}" width="${rect[2]}" height="${rect[3]}" preserveAspectRatio="xMidYMid meet" ${extra}/>`;
 }
 function crop(item,box,r,extra=''){
  const m=metric(item);if(!m)return '';
  return `<svg x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" viewBox="${box.join(' ')}" preserveAspectRatio="xMidYMid meet" overflow="hidden" ${extra}><image data-part="${item.file.split('/').pop()}" href="${item.src}" width="${m.w}" height="${m.h}"/></svg>`;
 }
 function pair(item,rects,trim=0){
  const m=metric(item);if(!m?.pair)return '';
  return rects.map((r,i)=>{const [x,y,w,h]=m.pair[i],cut=h*trim;return crop(item,[x,y+cut,w,h-cut],r)}).join('');
 }
 function natural(item,width,cx,y){const m=metric(item);return m?[cx-width/2,y,width,width*m.h/m.w]:null}
 function layout(p){
  const fm=metric(find('face',p.face)),scale=fm?Math.min(230/fm.w,238/fm.h):1;
  const headWidth=fm?fm.w*scale:230,headHeight=fm?fm.h*scale:220;
  const face=[210-headWidth/2,370-headHeight,headWidth,headHeight];
  const hair=find('hair',p.hair),hm=metric(hair);let hairRect=null;
  if(hair&&hm){const width=Math.min(330,hair.rect[2]),k=width/hm.w,[cx,line]=hairAnchors[+hair.id];hairRect=[210-cx*k,hairlines[+hair.id]-line*k,width,hm.h*k]}
  const hat=find('accessory',p.hat),hatWidth=hat?hatWidths[hat.id]:null;
  const hatRect=hat?natural(hat,hatWidth,210,hatBrims[hat.id]-hatCenters[hat.id]*hatWidth/metric(hat).w):null;
  const glasses=find('accessory',p.glasses),glassesRect=glasses?natural(glasses,176,210,268-(176*metric(glasses).h/metric(glasses).w)*.53):null;
  return {face,headScale:headWidth/230,hair:hairRect,hat:hatRect,hatBrim:hat?hatBrims[hat.id]:null,glasses:glassesRect,eyeY:268,mouthY:337};
 }
 function render(p){
  const uid='portrait-'+(++serial),L=layout(p),face=find('face',p.face),skin=metric(face)?.skin||'#F2BEA6';
  // Deep shirt colours remain visible on all three pale portrait-card backgrounds.
  const shirt=['#26422B','#70271F','#F24E07'][Number(p.face||0)%3];
  let s=`<defs><clipPath id="${uid}-shirt"><path d="M89 553q5-117 91-151h60q85 34 91 151Z"/></clipPath></defs>`;
  s+=`<path d="M89 553q5-117 91-151h60q85 34 91 151Z" fill="${shirt}"/><g clip-path="url(#${uid}-shirt)" stroke="#F9F5E6" stroke-width="1" opacity=".10"><path d="m105 437 5 115m24-132 4 133m31-147-3 147m88-147 3 147m28-131-3 131m24-112 5 112"/></g><path d="M188 350v54q22 21 44 0v-54Z" fill="${skin}"/><path d="M181 402q28 23 58 0" fill="none" stroke="#F9F5E6" stroke-width="2"/>`;
  s+=image(face,L.face);
  s+=`<g transform="translate(210 0) scale(${L.headScale} 1) translate(-210 0)">`;
  s+=image(find('cheeks',p.cheeks),[128,288,164,52]);
  s+=`<g data-landmark="brows">${pair(find('brows',p.brows),[[141,235,52,14],[227,235,52,14]])}</g>`;
  // Trim the eyebrow already printed on some eye pieces, avoiding doubled eyebrows.
  s+=`<g data-landmark="eyes">${pair(find('eyes',p.eyes),[[141,252,52,32],[227,252,52,32]],eyeTrim[+p.eyes]||0)}</g>`;
  const nose=find('nose',p.nose);s+=image(nose,[192,283,36,42]);
  const mouth=find('mouth',p.mouth),mw=mouthWidths[+p.mouth]||60,mm=metric(mouth),mh=mm?Math.min(35,mw*mm.h/mm.w):24;
  s+=image(mouth,[210-mw/2,337-mh/2,mw,mh]);
  const hair=find('hair',p.hair);if(hair)s+=`<g data-landmark="hair">${image(hair,L.hair)}</g>`;
  const facial=find('facial',p.facial);
  if(facial){
   const id=+facial.id;
   if(id<4)s+=image(facial,natural(facial,[86,88,102,92][id],210,314));
   else if(id===8)s+=image(facial,natural(facial,48,210,347));
   else if(id===12){const m=metric(facial);s+=crop(facial,[0,0,m.w,190],[121,252,178,136])}
   else if(id===15)s+=image(facial,natural(facial,174,210,251));
   else if(id===18)s+=image(facial,natural(facial,124,210,299));
   else{const [w,mouthFraction]=facialFit[id]||[176,.36],h=w*metric(facial).h/metric(facial).w;s+=image(facial,[210-w/2,337-h*mouthFraction,w,h])}
  }
  for(const group of ['headband','hat','glasses','earrings','necklace','scarf','headphones','decoration']){
   const a=find('accessory',p[group]);if(!a)continue;
   if(group==='hat')s+=image(a,L.hat);
   else if(group==='glasses')s+=`<g data-landmark="glasses">${image(a,L.glasses)}</g>`;
   else if(group==='earrings')s+=pair(a,[[94,282,26,45],[300,282,26,45]]);
   else if(group==='headphones')s+=image(a,natural(a,330,210,70));
   else if(group==='headband')s+=image(a,natural(a,266,210,105));
   else if(group==='necklace')s+=image(a,natural(a,138,210,394));
   else if(group==='scarf')s+=image(a,natural(a,a.id==='26'?106:158,210,a.id==='26'?389:383));
   else if(group==='decoration')s+=image(a,natural(a,59,301,170));
  }
  s+='</g>';
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-30 0 480 560" overflow="visible" role="img" aria-label="Watercolor character portrait">${s}</svg>`;
 }
 return {catalog,find,render,layout};
})();
