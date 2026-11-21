/* Story-based packing and focused clock practice. */
BGI.ticket=['ch/b_ticket.webp','a ticket'];BGI.water=['ch/p_water.webp','water'];BGI.notebook=['ch/g_notebook.webp','a notebook'];BGI.sunglasses=['ch/b_sunglasses.webp','sunglasses'];BGI.passport=['ch/b_passport.webp','a passport'];BGI.headphones=['ch/b_headphones.webp','headphones'];
BGI.lipgloss=[rmSvg('<path d="M64 24h45v30H64z" fill="#70271F"/><path d="M67 54h39v86H67z" fill="#F4DDF4"/><path d="m73 65 25 58M75 72l19 43" stroke="#F24E07" fill="none"/><path d="M71 140h31" fill="none"/>','0 0 170 165'),'lip gloss'];
BGI.bears=['ch/o11.webp','two teddy bears'];
const BAG_PICTURES={camera:'ch/o16.webp',keys:'ch/o17.webp',key:'ch/o15.webp',umbrella:'ch/o14.webp',books:'ch/o10.webp',cookies:'ch/o07.webp',apples:'ch/o04.webp'};
const bagList=(keys,conjunction='and')=>{const words=keys.map(k=>BGI[k][1]);return words.length<2?words.join(''):words.slice(0,-1).join(', ')+' '+conjunction+' '+words.at(-1)};
const BAG_STORIES=[
 {title:'Rainy day',text:'It is raining. I need my umbrella and keys. I can leave my books at home.',need:['umbrella','keys'],leave:['books','camera','cookies','apples']},
 {title:'A picnic',text:'I need apples and cookies. My friend has a camera, so I can leave mine at home.',need:['apples','cookies'],leave:['camera','books','umbrella','keys']},
 {title:'The library',text:'I need my books and a key. The sun is out, so I can leave my umbrella at home.',need:['books','key'],leave:['umbrella','camera','cookies','apples']},
 {title:'A photo walk',text:'I need my camera and my keys. I can leave my books and cookies at home.',need:['camera','keys'],leave:['books','cookies','umbrella','apples']}
];
let BAG_STORY_QUEUE=[];
function storyBag(){
 if(!BAG_STORY_QUEUE.length)BAG_STORY_QUEUE=shuffle(BAG_STORIES.slice());const story=BAG_STORY_QUEUE.pop();
 const st=dmShell('bag','My bag: a little story','Read the whole story. Plans can change! Drag or tap only the things you need into the bag. Click an item in the bag to take it out. Then press Check.',[]);
 $('#dmhint').remove();$('#dmnew').textContent='New story';$('#dmnew').onclick=storyBag;st.classList.add('story-bag-stage');
 st.innerHTML=`<article class="bag-story"><h3>${story.title}</h3><p>${story.text}</p></article><div class="bag-packing"><div class="bag-items" data-spatial-zone="tray" aria-label="Things to choose"></div><div class="bag-zone" data-spatial-zone="bag" role="group" aria-label="My bag"><strong>MY BAG</strong><div class="bag-packed"></div></div></div><button class="lvb" id="bagCheck">Check</button><div id="bagResult" role="status"></div>`;
 const packed=new Set(),keys=shuffle([...story.need,...story.leave]);let tries=0;
 const put=(el,inBag)=>{const key=el.dataset.bagItem;if(inBag)packed.add(key);else packed.delete(key);spatialTransfer(el,st.querySelector(inBag?'.bag-packed':'.bag-items'));el.setAttribute('aria-pressed',String(inBag));$('#bagResult').textContent=''};
 keys.forEach(key=>{const el=document.createElement('button');el.type='button';el.className='bag-item';el.dataset.bagItem=key;el.setAttribute('aria-pressed','false');el.innerHTML=`<img src="${BAG_PICTURES[key]}" alt="" draggable="false"><span>${esc(BGI[key][1].replace(/^(a|an) /,''))}</span>`;spatialDrag(el,z=>{if(z)put(el,z.dataset.spatialZone==='bag')});el.onclick=()=>{if(!el.consumeDrag())put(el,!packed.has(key))};st.querySelector('.bag-items').append(el)});
 $('#bagCheck').onclick=()=>{tries++;const missing=story.need.filter(k=>!packed.has(k)),extra=[...packed].filter(k=>!story.need.includes(k));
  if(!missing.length&&!extra.length){$('#bagResult').textContent='Correct! I have got '+bagList(story.need)+'. I haven’t got '+bagList(story.leave.slice(0,2),'or')+'.';return}
  $('#bagResult').textContent=missing.length+' missing · '+extra.length+' extra. Read the changes in the story again.'+(tries>1?' '+(extra.length?'Take out '+bgList(extra)+'. ':'')+(missing.length?'You still need '+bgList(missing)+'.':''):'');
 };
 st.dataset.storyTitle=story.title;
}
DMTF.bag=storyBag;
const oldHwhItems=hwhItems;
hwhItems=function(){return oldHwhItems().map(it=>({...it,frontImageOnly:true,pictureExtras:true}))};
const beforePossessionImage=cbImg;
cbImg=function(it){const picture=beforePossessionImage(it);return it.pictureExtras?`<div class="hwh-portrait">${picture}</div><div class="hwh-object-pictures">${it.extra}</div>`:picture};

const clockNorm=s=>String(s).trim().toLowerCase().replace(/[’‘]/g,"'").replace(/^(?:it is|it's)\s+/,'').replace(/o['’]?clock/g,'oclock').replace(/\ba quarter\b/g,'quarter').replace(/\bminutes?\b/g,'').replace(/\b([ap])\s*\.?\s*m\b\.?/g,'$1m').replace(/[-.,!?]/g,' ').replace(/\s+/g,' ').trim();
function clockAnswerMatches(answer,h,m){
 const norm=clockNorm(answer),twelve=h12(h),am=ampm(h).toLowerCase();
 const numeric=clockNorm(String(answer).replace(/(\d)\.(\d{2})(?=\s|$)/g,'$1:$2'));
 const digital=numeric.match(/^(\d{1,2})\s*[:.]\s*(\d{2})(?:\s*(am|pm))?$/);
 if(digital){const hh=+digital[1],mm=+digital[2],period=digital[3];if(mm!==m||hh<0||hh>23)return false;if(period)return hh>=1&&hh<=12&&hh===twelve&&period===am;return hh===twelve||hh===h}
 const variants=[tSay1(h,m),tSay2(h,m),numW(twelve)+(m===0?' oclock':' '+(m<10?'oh ':'')+numW(m))];
 if(m===0)variants.push(numW(twelve),numW(twelve)+' o clock');
 return variants.some(v=>[v,v+' '+am,v+' '+pod(h)].some(x=>clockNorm(x)===norm));
}
function independentClock(){
 const target={h:Math.floor(Math.random()*24),m:Math.floor(Math.random()*12)*5},cur={h:6,m:0};
 const st=dmShell('clk','Clock hands','Drag the short hand for hours and the long hand for minutes. Click AM / PM to change it. Then press Check.',[]);$('#dmhint').remove();$('#dmnew').textContent='New time';$('#dmnew').onclick=independentClock;st.classList.add('independent-clock-stage');
 st.innerHTML=`<p class="clock-short-task">Set the clock to ${tDig(target.h,target.m)}.</p><div class="independent-clock-layout"><div class="clock-dial">${clkSvg(6,0,1)}</div><div><div class="clock-current"><span id="clockCurrent"></span><span id="clockPeriod" role="button" tabindex="0" aria-label="Change AM or PM">AM</span></div><button class="lvb" id="clockCheck">Check</button><p id="clockResult" role="status"></p></div></div>`;
 const svg=st.querySelector('svg');let active=null;
 const update=()=>{$('#clockCurrent').textContent=h12(cur.h)+':'+two(cur.m);$('#clockPeriod').textContent=ampm(cur.h);$('#clkH').setAttribute('transform',`rotate(${cur.h%12*30} 100 100)`);$('#clkM').setAttribute('transform',`rotate(${cur.m*6} 100 100)`);$('#clkH').setAttribute('aria-valuenow',cur.h%12);$('#clkM').setAttribute('aria-valuenow',cur.m);st.dataset.hour=cur.h;st.dataset.minute=cur.m;$('#clockResult').textContent=''};
 $('#clkH').dataset.hand='hour';$('#clkM').dataset.hand='minute';
 for(const g of [$('#clkH'),$('#clkM')]){const line=g.querySelector('line'),hit=line.cloneNode();hit.setAttribute('stroke','transparent');hit.setAttribute('stroke-width','24');hit.classList.add('clock-hand-hit');g.prepend(hit);g.setAttribute('role','slider');g.tabIndex=0;g.setAttribute('aria-label',g.dataset.hand==='hour'?'Hour hand':'Minute hand');g.setAttribute('aria-valuemin','0');g.setAttribute('aria-valuemax',g.dataset.hand==='hour'?'11':'59');g.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const d=['ArrowRight','ArrowUp'].includes(e.key)?1:-1;if(g.dataset.hand==='hour')cur.h=(cur.h%12+d+12)%12+(cur.h>=12?12:0);else cur.m=(cur.m+d+60)%60;update()}}
 const move=e=>{if(!active)return;const r=svg.getBoundingClientRect(),angle=(Math.atan2(e.clientX-(r.left+r.width/2),-(e.clientY-(r.top+r.height/2)))*180/Math.PI+360)%360;if(active==='hour')cur.h=Math.round(angle/30)%12+(cur.h>=12?12:0);else cur.m=Math.round(angle/6)%60;update()};
 svg.onpointerdown=e=>{if(e.button!==0)return;const r=svg.getBoundingClientRect(),distance=Math.hypot(e.clientX-r.left-r.width/2,e.clientY-r.top-r.height/2)/(r.width/200);const difference=Math.abs((cur.h%12*30-cur.m*6+540)%360-180);active=difference<12&&distance<55?'hour':(e.target.closest('[data-hand]')?.dataset.hand||(distance<55?'hour':'minute'));svg.setPointerCapture(e.pointerId);move(e)};svg.onpointermove=move;svg.onpointerup=svg.onpointercancel=()=>{active=null};
 const period=()=>{cur.h=(cur.h+12)%24;update()};$('#clockPeriod').onclick=period;$('#clockPeriod').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();period()}};
 $('#clockCheck').onclick=()=>{$('#clockResult').textContent=cur.h===target.h&&cur.m===target.m?'Correct! '+tDig(target.h,target.m):'Try again. Check both hands and AM / PM.'};
 st.dataset.targetHour=target.h;st.dataset.targetMinute=target.m;update();
}
function flipTime(){
 setView(`<section class="panel k-card cbpanel flip-time-page"><div class="cbbar"><a class="grammar-back" href="#" id="flipBack">← Topics</a><h2>What time is it?</h2></div><div class="mechanical-clock" role="img" aria-label="Clock to read"><div class="mechanical-flap"><span class="mechanical-period"></span><span class="mechanical-digit" id="flipHour"></span></div><div class="mechanical-flap"><span class="mechanical-digit" id="flipMinute"></span></div></div><label class="flip-answer-label" for="flipAnswer">Say the time or type your answer.</label><input id="flipAnswer" type="text" autocomplete="off" placeholder="It’s …" spellcheck="false"><button class="lvb" id="flipClear">Clear</button><p id="flipFeedback" role="status" aria-live="polite"></p></section>`);
 const page=$('#view .flip-time-page');page.querySelector('.blobw')?.remove();let h,m,timer=null,checked=false;
 $('#flipBack').onclick=e=>{e.preventDefault();spSetup()};
 const next=()=>{if(!page.isConnected)return;const old=h*60+m;do{h=Math.floor(Math.random()*24);m=Math.floor(Math.random()*60)}while(h*60+m===old);checked=false;$('#flipHour').textContent=two(h12(h));$('#flipMinute').textContent=two(m);page.querySelector('.mechanical-period').textContent=ampm(h);page.querySelector('.mechanical-clock').setAttribute('aria-label','Time '+tDig(h,m));page.dataset.hour=h;page.dataset.minute=m;$('#flipAnswer').value='';$('#flipFeedback').textContent='';page.querySelectorAll('.mechanical-digit').forEach(el=>el.animate?.([{transform:'rotateX(-65deg)'},{transform:'rotateX(0)'}],{duration:matchMedia('(prefers-reduced-motion: reduce)').matches?1:500,easing:'ease-out'}))};
 $('#flipAnswer').oninput=()=>{clearTimeout(timer);checked=false;$('#flipFeedback').textContent='';timer=setTimeout(()=>{if(!page.isConnected||checked||!clockAnswerMatches($('#flipAnswer').value,h,m))return;checked=true;$('#flipFeedback').textContent='Correct!';timer=setTimeout(next,2200)},400)};
 $('#flipAnswer').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();if(!clockAnswerMatches(e.target.value,h,m))$('#flipFeedback').textContent='Try again.'}};
 $('#flipClear').onclick=()=>{clearTimeout(timer);checked=false;$('#flipAnswer').value='';$('#flipFeedback').textContent='';$('#flipAnswer').focus()};next();
}
DMTF.clk=independentClock;DMT.tim=1;DMTF.tim=flipTime;
