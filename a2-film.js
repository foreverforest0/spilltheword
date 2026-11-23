/* Three short film tasks per A2 topic. The player reuses the existing film frame. */
(()=>{
 const {films,clips,topics}=window.A2FilmData;
 let dispose;
 const previousView=setView;
 setView=function(html){dispose?.();dispose=null;return previousView(html)};
 function open(topic){
  seaOff();S.splevel='a2';
  let index=0;
  const drafts=topic.tasks.map(()=>'');
  function render(){
   const [clipId,prompt,answer]=topic.tasks[index],clip=clips[clipId],film=films[clip.film];
   setView(`<section class="bv-page a2-film-page" data-practice-level="a2" data-stw-plain>
    <header class="bv-heading"><button class="bv-back" id="a2FilmBack">← Back to topics</button><div><h1>${esc(topic.title)}</h1></div><span class="bv-progress" aria-label="Task ${index+1} of 3">${index+1} / 3</span></header>
    <div class="bv-layout">
     <section class="bv-viewer" aria-label="Film clip"><div class="bv-tv"><div class="bv-screen">
      <video id="a2FilmVideo" controls playsinline preload="metadata" aria-label="${esc(film.title)}" src="${esc(clip.src)}"></video>
     </div><img class="bv-frame" src="assets/b1-video/tv-frame.svg" alt="" draggable="false"></div>
     <p class="bv-credit"><a href="${esc(film.archive)}" target="_blank" rel="noopener">${esc(film.title)}</a> · Excerpt by Blender Foundation</p>
     <p id="a2FilmStatus" class="bv-video-status" role="status"></p>
     <button type="button" class="lvb" id="a2FilmReplay">Replay</button>
     </section>
     <section class="bv-task"><h2 class="bv-prompt">${esc(prompt)}</h2>
      <textarea id="bv-draft" aria-label="Your answer" rows="3" maxlength="800" spellcheck="false">${esc(drafts[index])}</textarea>
      <button type="button" id="a2FilmShow" class="bv-show" aria-expanded="false" aria-controls="a2FilmModel">Show answer</button>
      <p id="a2FilmModel" class="bv-models" hidden>${esc(answer)}</p>
      <nav class="bv-navigation" aria-label="Video tasks"><button type="button" id="a2FilmPrev" ${index?'':'disabled'}>Previous</button><button type="button" id="a2FilmNext">${index===2?'Start again':'Next'}</button></nav>
     </section></div></section>`);
   const vid=$('#a2FilmVideo');
   let alive=true;
   dispose=()=>{alive=false;vid.pause();vid.removeAttribute('src');vid.load()};
   vid.onerror=()=>{if(alive)$('#a2FilmStatus').textContent='This clip could not play. Open the film link above.'};
   $('#a2FilmReplay').onclick=()=>{vid.currentTime=0;vid.play().catch(()=>{})};
   $('#bv-draft').oninput=e=>{drafts[index]=e.target.value};
   $('#a2FilmShow').onclick=e=>{
    const model=$('#a2FilmModel');model.hidden=!model.hidden;
    e.currentTarget.textContent=model.hidden?'Show answer':'Hide answer';
    e.currentTarget.setAttribute('aria-expanded',String(!model.hidden));
   };
   $('#a2FilmBack').onclick=spSetup;
   $('#a2FilmPrev').onclick=()=>{index--;render();$('#a2FilmPrev').focus()};
   $('#a2FilmNext').onclick=()=>{index=(index+1)%3;render();$('#a2FilmNext').focus()};
  }
  render();
 }
 for(const [number,title,tasks] of topics){
  const group=SPGRP.a2.find(item=>item[0].startsWith(number+' ·'));
  if(!group)continue;
  const id='film_a2_'+number;
  group[1].push(id);DMT[id]=1;DMTF[id]=()=>open({title,tasks});
  SPSHORT[id]='Video: three short tasks';
  SPT.push({id,n:'Video: '+title,d:'Watch a short film clip and answer one question.'});
  SPLV.find(item=>item[0]==='a2')[2].push(id);
 }
})();
