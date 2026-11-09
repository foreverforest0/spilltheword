/* One-sentence proofreading with Rough Notation, plus an orderly daily planner. */
(()=>{
 const markStyles=['circle','strike-through','crossed-off'];
 const sentenceRows=FXT.map(([wrong,right])=>{
  const words=wrong.split(' '),correct=right.split(' '),index=words.findIndex((w,i)=>w!==correct[i]);
  return {wrong,right,words,index,answer:correct[index],alternatives:wrong.includes('the weekend')?['at','on']:[correct[index]]};
 });
 function fixTime(){return CardStacks.fixTime(sentenceRows,markStyles)}
 DMT.fxt=1;DMTF.fxt=fixTime;SPSHORT.fxt='Fix the time';
 const description=SPT.find(t=>t.id==='fxt');if(description)description.d='Find the wrong word, mark it and type the correct preposition.';
 // Legacy Grammar Lab links lead to the same single-card activity.
 const legacyBoard=glGameRender;
 glGameRender=function(){if(GL?.g?.id==='ftt'){clearInterval(GLT);return fixTime()}return legacyBoard()};

 const periods=[
  {id:'morning',name:'Morning',from:0,to:720,start:7*60,color:'#F5E99A',range:'Before 12 PM'},
  {id:'afternoon',name:'Afternoon',from:720,to:1080,start:13*60,color:'#CCE5FF',range:'12 PM – 6 PM'},
  {id:'evening',name:'Evening',from:1080,to:1440,start:19*60,color:'#F4DDF4',range:'After 6 PM'}
 ];
 const timeOf=minutes=>two(Math.floor(minutes/60))+':'+two(minutes%60);
 const periodOf=minutes=>periods.find(p=>minutes>=p.from&&minutes<p.to);
 function buildDay(){
  let selected=null,spoken=false;
  const st=dmShell('bmd','Build my day','Drag an activity into Morning, Afternoon or Evening, then choose its time. You can also click an activity and then a column. Click a planned activity to return it. Tell my day puts your sentences in time order.',[]);
  $('#dmhint').remove();$('#dmnew').remove();st.classList.add('day-planner-stage');
  st.innerHTML=`<div class="day-workspace"><section class="day-library" aria-label="Activities"><h3>Activities</h3><div class="day-bank" data-spatial-zone="day-bank"></div></section><div class="day-plan" aria-label="My daily plan">${periods.map(p=>`<section class="day-period" data-spatial-zone="${p.id}" style="--period-color:${p.color}" role="group" tabindex="0" aria-label="${p.name}"><div class="day-period-heading"><h3>${p.name}</h3><p>${p.range}</p></div><div class="day-events" role="list"></div><p class="day-empty">Drop an activity here</p></section>`).join('')}</div></div><div class="day-bottom"><p class="day-status" role="status">Choose an activity and a time of day.</p><button class="lvb" id="dayTell">Tell my day</button><div class="day-story" id="dayStory" hidden aria-live="polite"></div></div>`;
  const bank=st.querySelector('.day-bank'),activityElements=[],events=new Map();
  const summary=()=>{
   if(!spoken)return;const list=[...events.values()].sort((a,b)=>a.time-b.time||a.order-b.order);
   $('#dayStory').hidden=false;$('#dayStory').innerHTML=list.length?'<ol>'+list.map(event=>`<li>I ${esc(event.label)} at ${tDig(Math.floor(event.time/60),event.time%60)}.</li>`).join('')+'</ol>':'Choose at least one activity for your day.';
  };
  const status=text=>{st.querySelector('.day-status').textContent=text};
  const emptyStates=()=>{st.querySelectorAll('.day-period').forEach(zone=>{zone.querySelector('.day-empty').hidden=!!zone.querySelector('.day-event')});summary()};
  const deselect=()=>{activityElements.forEach(el=>{el.classList.remove('selected');el.setAttribute('aria-pressed','false')});selected=null};
  const sortZone=zone=>{const list=zone.querySelector('.day-events');[...list.children].sort((a,b)=>events.get(a.dataset.event).time-events.get(b.dataset.event).time||events.get(a.dataset.event).order-events.get(b.dataset.event).order).forEach(el=>list.append(el))};
  const home=el=>{
   const event=events.get(el.dataset.dayActivity);spatialTransfer(el,bank);event?.node.remove();events.delete(el.dataset.dayActivity);el.dataset.placed='false';
   activityElements.forEach(activity=>{if(activity.parentNode===bank)bank.append(activity)});deselect();emptyStates();status('Choose an activity and a time of day.');
  };
  const place=(el,zone)=>{
   if(!zone)return;if(zone===bank){home(el);return}
   const period=periods.find(p=>p.id===zone.dataset.spatialZone);if(!period)return;
   let event=events.get(el.dataset.dayActivity);
   if(event&&periodOf(event.time).id===period.id){deselect();return}
   const used=new Set([...events.values()].filter(e=>e!==event).map(e=>e.time));let time=period.start;
   while(used.has(time)&&time+30<period.to)time+=30;
   if(used.has(time)){time=period.from;while(used.has(time)&&time+5<period.to)time+=5}
   if(!event){
    const node=document.createElement('article');node.className='day-event';node.dataset.event=el.dataset.dayActivity;node.setAttribute('role','listitem');
    const label=document.createElement('label');label.className='day-time';label.innerHTML='<span>at</span>';const input=document.createElement('input');input.type='time';input.step='300';input.required=true;input.setAttribute('aria-label','Time to '+el.dataset.label);label.append(input);node.append(label);
    event={node,input,label:el.dataset.label,time,order:+el.dataset.order};events.set(el.dataset.dayActivity,event);zone.querySelector('.day-events').append(node);spatialTransfer(el,node);node.prepend(el);
    input.onchange=()=>{
     if(!/^\d{2}:\d{2}$/.test(input.value)){input.value=timeOf(event.time);return}
     const [h,m]=input.value.split(':').map(Number);event.time=h*60+m;const newZone=st.querySelector(`[data-spatial-zone="${periodOf(event.time).id}"]`);newZone.querySelector('.day-events').append(node);sortZone(newZone);emptyStates();status('I '+event.label+' at '+tDig(h,m)+'.');
    };
   }else{spatialTransfer(event.node,zone.querySelector('.day-events'));event.time=time}
   event.input.value=timeOf(time);el.dataset.placed='true';sortZone(zone);deselect();emptyStates();status('I '+event.label+' at '+tDig(Math.floor(time/60),time%60)+'.');
  };
  BMD.forEach(([key,label],i)=>{
   const el=document.createElement('button');el.type='button';el.className='day-activity';el.dataset.dayActivity=key;el.dataset.label=label;el.dataset.order=i;el.dataset.placed='false';el.setAttribute('aria-pressed','false');
   el.style.setProperty('--activity-color',['#CCE5FF','#F4DDF4','#BEC3EC','#F5E99A'][i%4]);el.innerHTML=`<span class="day-picture"><img src="${bmdSrc(key)}" alt="" draggable="false"></span><span class="day-activity-name">${esc(label)}</span>`;
   spatialDrag(el,zone=>place(el,zone));el.onclick=()=>{
    if(el.consumeDrag())return;if(el.dataset.placed==='true'){home(el);return}
    const previous=selected===el;deselect();if(!previous){selected=el;el.classList.add('selected');el.setAttribute('aria-pressed','true');status('Choose Morning, Afternoon or Evening for “'+label+'”.')}
   };
   activityElements.push(el);bank.append(el);
  });
  st.querySelectorAll('.day-period').forEach(zone=>{
   zone.onclick=e=>{if(selected&&!e.target.closest('.day-event'))place(selected,zone)};
   zone.onkeydown=e=>{if(selected&&e.target===zone&&(e.key==='Enter'||e.key===' ')){e.preventDefault();place(selected,zone)}};
  });
  $('#dayTell').onclick=()=>{spoken=true;summary()};
 }
 DMTF.bmd=buildDay;
})();
