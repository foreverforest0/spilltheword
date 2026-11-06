/* Original watercolor artwork is embedded in catalog.js so saved portraits also work offline. */
const AppearanceParts=(()=>{
const catalog=APPEARANCE_CATALOG;
const find=(kind,id)=>catalog[kind]?.find(x=>x.id===String(id));
function image(item,rect){if(!item)return '';return `<image href="${item.src}" x="${rect[0]}" y="${rect[1]}" width="${rect[2]}" height="${rect[3]}" preserveAspectRatio="none"/>`}
function render(p){let s='';
 s+=image(find('face',p.face),[95,150,230,280]);
 s+=image(find('cheeks',p.cheeks),[120,300,180,65]);
 s+=image(find('brows',p.brows),[128,236,164,26]);
 s+=image(find('eyes',p.eyes),[127,264,166,53]);
 s+=image(find('nose',p.nose),[182,305,56,61]);
 s+=image(find('mouth',p.mouth),[162,372,96,40]);
 const hair=find('hair',p.hair);s+=image(hair,hair?.rect);
 const facial=find('facial',p.facial);s+=image(facial,facial?.rect);
 for(const group of ['headband','hat','glasses','earrings','necklace','scarf','headphones','decoration']){const a=find('accessory',p[group]);s+=image(a,a?.rect)}
 return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 50 420 470" role="img" aria-label="Watercolor character portrait">${s}</svg>`;
}
return {catalog,find,render};
})();
