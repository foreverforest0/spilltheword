/* Sprite placement uses common face landmarks, with separate anchors for paired parts. */
const AppearanceParts=(()=>{
const catalog=APPEARANCE_CATALOG;
const find=(kind,id)=>catalog[kind]?.find(x=>x.id===String(id));
const metric=item=>item?APPEARANCE_GEOMETRY[item.file.split('/').pop()]:null;
function image(item,rect){if(!item||!rect)return '';return `<image href="${item.src}" x="${rect[0]}" y="${rect[1]}" width="${rect[2]}" height="${rect[3]}" preserveAspectRatio="xMidYMid meet"/>`}
function crop(item,box,r){const m=metric(item);return `<svg x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" viewBox="${box.join(' ')}" preserveAspectRatio="xMidYMid meet" overflow="hidden"><image href="${item.src}" width="${m.w}" height="${m.h}"/></svg>`}
function pair(item,rects){const m=metric(item);if(!item||!m?.pair)return '';return rects.map((r,i)=>crop(item,m.pair[i],r)).join('')}

const accessories={
 '0':[122,258,176,62],'1':[122,258,176,62],'2':[122,258,176,62],'3':[122,258,176,62],'4':[122,258,176,62],'5':[122,258,176,62],
 '6':[75,58,270,175],'7':[75,58,270,175],'8':[98,10,224,220],'9':[75,78,270,150],'10':[75,58,270,180],'11':[80,50,260,180],
 '12':[77,97,266,185],'13':[77,97,266,185],
 '14':[272,150,64,64],'15':[272,150,64,64],'16':[272,155,60,60],'17':[275,150,60,60],
 '21':[132,410,156,100],'22':[132,410,156,100],'23':[66,105,288,262],
 '24':[125,410,170,112],'25':[125,410,170,112],'26':[135,420,150,70],'27':[125,410,170,112]
};
function render(p){const face=find('face',p.face),fm=metric(face),headScale=fm?Math.min(230/fm.w,220/fm.h)*fm.w/230:1,skin=metric(face)?.skin||'#F2BEA6',shirt=['#26422B','#70271F','#CCE5FF','#F24E07'][Number(p.face||0)%4];let s='';
 s+=`<path d="M105 553q3-100 75-124h60q72 24 75 124Z" fill="${shirt}"/><path d="M187 370v58q22 24 46 0v-58Z" fill="${skin}"/><path d="M180 429q28 24 60 0" fill="none" stroke="#F9F5E6" stroke-width="2"/>`;
 s+=image(face,[95,170,230,220]);s+=`<g transform="translate(210 0) scale(${headScale} 1) translate(-210 0)">`;
 s+=image(find('cheeks',p.cheeks),[120,290,180,56]);
 s+=pair(find('brows',p.brows),[[137,242,62,22],[221,242,62,22]]);
 s+=pair(find('eyes',p.eyes),[[140,268,56,34],[224,268,56,34]]);
 s+=image(find('nose',p.nose),[187,301,46,48]);s+=image(find('mouth',p.mouth),[174,350,72,28]);
 const hair=find('hair',p.hair);if(hair){const r=hair.rect,k=Math.min(1,330/r[2]);s+=image(hair,[210-r[2]*k/2-(hair.id==='17'?25:0),r[1]+(1-k)*55,r[2]*k,r[3]*k])}
 const facial=find('facial',p.facial);if(facial){const id=+facial.id;s+=image(facial,id<4?[164,335,92,34]:[8,18].includes(id)?[180,363,60,70]:[112,312,196,id===10?180:144])}
 for(const group of ['headband','hat','glasses','earrings','necklace','scarf','headphones','decoration']){
  const a=find('accessory',p[group]);if(!a)continue;
  if(group==='earrings')s+=pair(a,[[91,300,28,50],[301,300,28,50]]);else if(group==='headphones'){const m=metric(a);s+=`<path d="M83 165q-13 39 3 88m251-88q13 39-3 88" fill="none" stroke="#E8E4CA" stroke-width="9"/><path d="M83 165q-13 39 3 88m251-88q13 39-3 88" fill="none" stroke="#52694B" stroke-width="3"/>`;s+=crop(a,[0,0,m.w,75],[64,88,292,100]);s+=crop(a,[0,85,105,m.h-85],[60,240,65,100]);s+=crop(a,[130,85,m.w-130,m.h-85],[295,240,65,100])}else s+=image(a,accessories[a.id]);
 }
 s+='</g>';
 return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 420 560" role="img" aria-label="Watercolor character portrait">${s}</svg>`;
}
return {catalog,find,render};
})();
