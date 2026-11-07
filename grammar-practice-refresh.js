/* Shared presentation updates for grammar practice. */
TYD.kts=tyMk('Typewriter: -s or no -s','Choose -s or no -s. Type only the verb and press Enter.',[['s','Add -s'],['base','No -s']],{s:'He / she / it: add -s.',base:'I / you / we / they: use the verb without -s.'},[
 ['He ___ (play).','plays','s'],['She ___ (read).','reads','s'],['It ___ (run).','runs','s'],['He ___ (jump).','jumps','s'],['She ___ (sing).','sings','s'],['He ___ (eat).','eats','s'],['She ___ (swim).','swims','s'],['It ___ (sleep).','sleeps','s'],['He ___ (like) cats.','likes','s'],['She ___ (drink).','drinks','s'],
 ['I ___ (play).','play','base'],['You ___ (read).','read','base'],['We ___ (run).','run','base'],['They ___ (jump).','jump','base'],['I ___ (sing).','sing','base'],['You ___ (eat).','eat','base'],['We ___ (swim).','swim','base'],['They ___ (sleep).','sleep','base'],['I ___ (like) cats.','like','base'],['They ___ (drink).','drink','base']]);
SPSHORT.kts='Typewriter: -s or no -s';
const SIMPLE_PC={baking:'baking','brushing her hair':'brushing her hair','brushing her teeth':'brushing her teeth','carrying a box':'carrying a box','cooking soup':'cooking',crying:'crying',dancing:'dancing','doing yoga':'doing yoga','drawing a picture':'drawing','drinking coffee':'drinking','eating pizza':'eating',knitting:'knitting',laughing:'laughing','listening to music':'listening to music','mopping the floor':'cleaning','packing a suitcase':'packing','painting a wall':'painting','petting a dog':'petting a dog','playing chess':'playing chess','playing the guitar':'playing the guitar','reading a book':'reading','riding a bike':'riding a bike',running:'running',shopping:'shopping',singing:'singing','sleeping in an armchair':'sleeping',swimming:'swimming','taking a photo':'taking a photo','talking on the phone':'talking','typing on a laptop':'typing','waiting for a bus':'waiting','washing the dishes':'washing up','watching TV':'watching TV','watering the plants':'watering the plants',waving:'waving','writing in a notebook':'writing'};
MGXC.mgc.hints=[];
MGXC.mgc.items=()=>ACTIONS.flatMap(a=>{const verb=SIMPLE_PC[a[0]]||a[0].split(' ').slice(0,2).join(' ');return [['+',['She is '+verb+'.'],a[1]],['-',['She isn’t '+verb+'.','She is not '+verb+'.'],a[1]],['?',['Is she '+verb+'?'],a[1]]]});
DPQ.park.pc=[
 [1,'What is the man with the camera doing?','He is taking a photo.'],[1,'What is the woman painting?','She is painting a picture.'],[1,'What is the boy on the bike doing?','He is riding a bike.'],[1,'What is the dog doing?','It is running.'],[1,'What are the people on the left doing?','They are doing yoga.'],[1,'What are the women with books doing?','They are reading.'],[1,'What are the children doing?','They are running.'],[1,'Is the dog sleeping?','No, it isn’t. It is running.']];
DPQ.market.pc=[
 [1,'What is the butcher doing?','He is working.'],[1,'What are the people at the checkouts doing?','They are paying.'],[1,'What is the child in the toy car doing?','He is sitting.'],[1,'What are the people with carts doing?','They are shopping.'],[1,'What is the woman in red doing?','She is shopping.'],[1,'What is the man with the baby doing?','He is carrying a baby.'],[1,'Are the people running?','No, they aren’t. They are walking.']];
const practiceRefreshStyle=document.createElement('style');
practiceRefreshStyle.textContent=`
#view .tybar button,#view .tybar select,#view .tylvm button{border:0!important;border-radius:3px!important;box-shadow:none!important;background:#CCE5FF;color:#70271F;font:17px Georgia,serif;padding:9px 13px}
#view .tybar button:nth-of-type(3n+2){background:#26422B;color:#F9F5E6}#view .tybar button:nth-of-type(3n){background:#70271F;color:#F9F5E6}
#view .tybar button.on,#view .tylvm button.on{background:#F24E07;color:#F9F5E6}#view .tylvm{border:0!important;background:#F9F5E6;box-shadow:0 3px 15px #70271F20}
.there-page{max-width:1060px;margin:auto;padding:20px 16px;color:#70271F}.there-page h2{font:34px Georgia,serif}.there-images{display:grid;gap:18px;grid-template-columns:repeat(2,minmax(0,1fr));margin:18px 0}.there-images.single{grid-template-columns:minmax(0,1fr);max-width:740px;margin:18px auto}
.there-scene{margin:0;padding:12px;background:#CCE5FF;position:relative}.there-scene:nth-child(2){background:#F4DDF4}.there-scene img{display:block;width:100%;height:400px;object-fit:contain}.there-scene figcaption{font:18px Georgia,serif;margin-bottom:8px}
.there-copy{background:#fff;padding:18px;font:23px/1.35 Georgia,serif}.there-controls{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}.there-controls button{border:0;border-radius:3px;padding:10px 14px;background:#CCE5FF;color:#70271F;font:17px Georgia,serif}.there-controls button:nth-child(2){background:#F4DDF4}.there-example{font:21px/1.4 Georgia,serif;color:#26422B;margin-top:16px}.there-memory-cover{min-height:400px;display:grid;place-items:center;color:#26422B;font:30px Georgia,serif}.there-photo{transition:filter .35s}.there-scene.lights-off{background:#151b1c}.there-scene.lights-off .there-photo{filter:brightness(.07) saturate(.4)}.there-scene.lights-off figcaption{color:#F9F5E6}.there-photo[hidden],.there-memory-cover[hidden]{display:none!important}
@media(max-width:620px){.there-images{grid-template-columns:minmax(0,1fr)}.there-scene img{height:300px}.there-copy{font-size:20px}.there-memory-cover{min-height:300px}}
`;
document.head.appendChild(practiceRefreshStyle);
const THERE_COMPARE=[
 ['scene living room','scene kitchen','What is there in picture A but not in picture B?','There is a sofa in picture A, but there isn’t a sofa in picture B.'],
 ['scene bedroom','scene living room','What is there in picture A but not in picture B?','There is a bed in picture A, but there isn’t a bed in picture B.'],
 ['scene street','scene bedroom','What is there in picture A but not in picture B?','There is a fountain in picture A, but there isn’t a fountain in picture B.'],
 ['scene kitchen','scene bedroom','What is there in picture A but not in picture B?','There is a fridge in picture A, but there isn’t a fridge in picture B.']];
const THERE_TITLES={compare:'Compare two pictures',find:'Find it in the picture',memory:'Remember the room'};
function therePractice(mode){
 let round=0,hidden=false;const scenes=shuffle(SCENES.slice()),pairs=shuffle(THERE_COMPARE.slice());
 const questions=scene=>scene.q.filter(qa=>/^(Is there|Are there|How many)/.test(qa[0])).map(qa=>[qa[0].split('?')[0]+'?',qa[1]]);
 const draw=()=>{
  const pair=pairs[round%pairs.length],scene=scenes[Math.floor(round/4)%scenes.length],qs=questions(scene),qa=qs.length?qs[round%qs.length]:['What is there in the picture?',scene.q[0]?.[1]||'There are things in the room.'];
  const picture=(key,label)=>`<figure class="there-scene"><figcaption>${esc(label)}</figcaption><img class="there-photo" src="${PICS[key]}" alt="${esc(label)}"></figure>`;
  setView(`<section class="there-page"><button class="grammar-back" id="thereBack">← Exercises</button><h2>There is / There are: ${THERE_TITLES[mode]}</h2>
   <div class="there-images${mode==='compare'?'':' single'}">${mode==='compare'?picture(pair[0],'Picture A')+picture(pair[1],'Picture B'):picture(scene.k,scene.n)}</div>
   <div class="there-copy"><div id="thereQuestion">${esc(mode==='compare'?pair[2]:qa[0])}</div>
   <div class="there-controls">${mode==='memory'?'<button id="thereHide" aria-pressed="false">Turn light off</button>':''}<button id="thereExample">Show an example</button><button id="thereNew">${mode==='compare'?'Another pair':'Another question'}</button></div><div class="there-example" id="thereAnswer" hidden></div></div></section>`);
  $('#thereBack').onclick=spSetup;
  $('#thereNew').onclick=()=>{round++;hidden=false;draw()};
  $('#thereExample').onclick=()=>{const answer=$('#thereAnswer');answer.hidden=false;answer.textContent=mode==='compare'?pair[3]:qa[1]};
  if(mode==='memory'){
   const fig=$('#view .there-scene');
   $('#thereHide').onclick=()=>{hidden=!hidden;fig.classList.toggle('lights-off',hidden);$('#thereHide').textContent=hidden?'Turn light on':'Turn light off';$('#thereHide').setAttribute('aria-pressed',String(hidden))};
  }
 };
 draw();
}
for(const [mode,title] of Object.entries(THERE_TITLES)){
 const id='there'+mode;DMT[id]=1;DMTF[id]=()=>therePractice(mode);SPSHORT[id]=title;SPT.push({id,n:title,d:'Practise there is / there are with pictures.'});
}
for(const [lv,groups] of Object.entries(SPGRP)){
 const group=groups.find(g=>/There is\s*\/\s*(there\s+)?are/i.test(g[0]));
 if(group){group[1]=['therecompare','therefind','therememory'];const level=SPLV.find(l=>l[0]===lv);if(level)level[2].push(...group[1])}
}
DMTF.thb=()=>therePractice('compare');

for(const id of ['dtt','sct','thr']){DMT[id]=1;DMTF[id]=()=>therePractice('find')}
