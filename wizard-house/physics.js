'use strict';
/* Authored interactions with gravity-driven streams, free liquid surfaces and damped waves. */
window.KitchenPhysics = class KitchenPhysics {
  constructor(scene, getState) {
    this.scene=scene; this.getState=getState; this.puddleCanvas=scene.querySelector('#puddle-canvas'); this.p=this.puddleCanvas.getContext('2d'); this.water=scene.querySelector('#water-canvas'); this.motion=scene.querySelector('#motion-canvas');
    this.w=this.water.getContext('2d'); this.m=this.motion.getContext('2d'); this.W=1000; this.H=1000/1.5;
    this.images={}; this.fluids={}; this.particles=[]; this.rings=[]; this.active=null; this.raf=0; this.last=0; this.alive=true; this.hidden=new Set();
    const names=[...new Set(Object.values(KITCHEN_OBJECTS).map(o=>o.file).concat(['cup','cup-cracked','cup-broken','cloth-wet']))];
    this.ready=Promise.all(names.map(name=>new Promise((resolve,reject)=>{const im=new Image(); im.onload=()=>{this.images[name]=im;resolve()}; im.onerror=()=>reject(Error('Missing kitchen image: '+name)); im.src=`assets/${name}.webp`;})));
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(scene);this.resize();this.ready.then(()=>this.wake()).catch(()=>{});
  }
  resize(){if(!this.alive)return;const d=Math.min(devicePixelRatio||1,2),width=Math.max(1,Math.min(2000,Math.round(this.scene.clientWidth*d))),height=Math.round(width/1.5);for(const c of [this.puddleCanvas,this.water,this.motion]){c.width=width;c.height=height}this.wake()}
  rect(key){const el=this.scene.querySelector(`[data-source="${key}"]`);if(!el)return {x:0,y:0,w:80,h:80};const s=this.W/this.scene.clientWidth;let r={x:el.offsetLeft*s,y:el.offsetTop*s,w:el.clientWidth*s,h:el.clientHeight*s};const im=el.querySelector('img'),ar=(im?.naturalWidth||1)/(im?.naturalHeight||1);if(r.w/r.h>ar){const n=r.h*ar;r.x+=(r.w-n)/2;r.w=n}else{const n=r.w/ar;r.y+=(r.h-n)/2;r.h=n}return r}
  file(key,s=this.getState()){return key==='cup'?(s.cup==='whole'?'cup':s.cup==='cracked'?'cup-cracked':'cup-broken'):key==='cloth'&&s.clothWet?'cloth-wet':KITCHEN_OBJECTS[key]?.file||key}
  pose(key){const r=this.rect(key);return {x:r.x+r.w/2,y:r.y+r.h/2,w:r.w,h:r.h,angle:0}}
  point(p,u,v){const x=(u-.5)*p.w,y=(v-.5)*p.h,c=Math.cos(p.angle),s=Math.sin(p.angle);return {x:p.x+c*x-s*y,y:p.y+s*x+c*y}}
  anchored(p,u,v,point,angle=0){const q=this.point({...p,x:0,y:0,angle},u,v);return {...p,x:point.x-q.x,y:point.y-q.y,angle}}
  surface(key,s=this.getState()){const r=this.rect(key),f=Math.max(0,Math.min(1,(s[key]?.water||0)/4));return {x:r.x+r.w*.5,y:r.y+r.h*(.32-.075*f),rx:r.w*(.29+.10*f),ry:r.h*(.085+.045*f),r}}
  puddle(s=this.getState(),index=0){const p=s.puddles?.[index]||{...(s.puddlePos||{x:285,y:550}),amount:s.puddle||0};return {x:p.x,y:p.y,rx:22+Math.sqrt(p.amount||0)*22,ry:7+Math.sqrt(p.amount||0)*4}}
  wake(){if(!this.alive||this.raf||this.inTick)return;this.last=performance.now();this.raf=requestAnimationFrame(t=>this.tick(t))}
  tick(now){this.raf=0;if(!this.alive)return;this.inTick=true;const dt=Math.min(.035,Math.max(.001,(now-this.last)/1000));this.last=now;let moving=false;
    for(const f of Object.values(this.fluids)){f.velocity+=(-34*f.wave-6.3*f.velocity)*dt;f.wave+=f.velocity*dt;f.spin*=Math.exp(-2.1*dt);f.angle+=f.spin*dt;if(Math.abs(f.wave)+Math.abs(f.velocity)+Math.abs(f.spin)>.015)moving=true}
    let visual=this.getState();if(this.active){visual=this.advance(now,dt);moving=true}
    this.visual=visual;this.draw(visual,now,dt);
    if(this.active&&this.active.finished){const a=this.active;this.active=null;this.restore();a.resolve(true)}
    this.inTick=false;if(!this.raf&&(this.active||this.particles.length||this.rings.length||moving))this.raf=requestAnimationFrame(t=>this.tick(t));
  }
  fluid(key){return this.fluids[key]||(this.fluids[key]={wave:0,velocity:0,angle:0,spin:0})}
  impulse(key,strength=3){this.fluid(key).velocity+=strength;this.wake()}
  resetContext(ctx){ctx.setTransform(ctx.canvas.width/this.W,0,0,ctx.canvas.height/this.H,0,0);ctx.clearRect(0,0,this.W,this.H)}
  draw(s,now,dt){this.resetContext(this.p);this.resetContext(this.w);this.resetContext(this.m);for(const key of ['jug','glass','bowl','bowl2']){if(!this.hidden.has(key))this.drawLiquid(this.w,key,this.pose(key),s,now)}
    if(s.sieveBerries&&!this.hidden.has('sieve'))this.drawSieveBerries(this.w,this.pose('sieve'),s.sieveBerries);
    for(let i=0;i<(s.puddles?.length||0);i++)this.drawPuddle(this.p,s,now,i);if(this.active)this.drawAction(this.m,this.active,s,now,dt);
    this.updateParticles(this.m,dt);this.drawRings(this.m,dt);
    if(this.active&&['stir','scoop'].includes(this.active.id))this.frontRim(this.m,this.active.target);
  }
  polygonArea(p){let a=0;for(let i=0;i<p.length;i++){const q=p[(i+1)%p.length];a+=p[i].x*q.y-q.x*p[i].y}return Math.abs(a)/2}
  below(p,y){const out=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],ia=a.y>=y,ib=b.y>=y;if(ia)out.push(a);if(ia!==ib){const t=(y-a.y)/(b.y-a.y);out.push({x:a.x+(b.x-a.x)*t,y})}}return out}
  drawLiquid(ctx,key,p,s,now){if(['bowl','bowl2'].includes(key)&&Math.abs(p.angle||0)<.01){const bowl=s[key];if(!bowl)return;const f=this.fluid(key),water=bowl.water||0,fraction=Math.min(1,water/4),q={x:p.x,y:p.y-p.h/2+p.h*(.32-.075*fraction),rx:p.w*(.29+.10*fraction),ry:p.h*(.085+.045*fraction),r:{w:p.w,h:p.h}};if(water>.01){
      ctx.save();ctx.beginPath();for(let i=0;i<=60;i++){const a=i/60*Math.PI*2,x=q.x+q.rx*Math.cos(a),y=q.y+q.ry*Math.sin(a)+f.wave*Math.sin(a*3+now*.009)*.45;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();ctx.clip();
      const tinted=bowl.tinted,g=ctx.createLinearGradient(0,q.y-q.ry,0,q.y+q.ry);g.addColorStop(0,tinted?'rgba(199,150,160,.86)':'rgba(174,195,208,.76)');g.addColorStop(1,tinted?'rgba(125,91,116,.92)':'rgba(120,151,172,.87)');ctx.fillStyle=g;ctx.fillRect(q.x-q.rx-4,q.y-q.ry-8,q.rx*2+8,q.ry*2+16);
      ctx.strokeStyle='rgba(242,231,211,.4)';ctx.lineWidth=.7;for(let j=0;j<3;j++){ctx.beginPath();const rr=.35+j*.23;for(let i=0;i<=35;i++){const a=i/35*Math.PI*1.55+f.angle*.28+j;const x=q.x+q.rx*rr*Math.cos(a),y=q.y+q.ry*rr*Math.sin(a)+Math.sin(i*.5+now*.012)*Math.abs(f.wave)*.25;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}
      if(bowl.sugar){const fade=this.active?.id==='stir'&&this.active.target===key?1-this.active.flowProgress:1;ctx.fillStyle=`rgba(236,221,188,${fade*.9})`;for(let i=0;i<28;i++){const a=i*2.399+f.angle,rr=.2+(i%6)*.09;ctx.beginPath();ctx.ellipse(q.x+Math.cos(a)*q.rx*rr,q.y+Math.sin(a)*q.ry*rr,1.1,.7,0,0,7);ctx.fill()}}
      ctx.restore();ctx.strokeStyle='rgba(238,228,211,.55)';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(q.x,q.y,q.rx,q.ry,0,Math.PI,Math.PI*2);ctx.stroke();
    }
    for(let i=0;i<Math.ceil(bowl.berries||0);i++){const a=i*2.399+f.angle,rr=.37+(i%3)*.14;this.berry(ctx,q.x+Math.cos(a)*q.rx*rr,q.y+Math.sin(a)*q.ry*rr+Math.sin(now*.003+i)*.45,Math.max(2.8,q.r.w*.022))}return}
    const bowl=['bowl','bowl2'].includes(key),amount=bowl?s[key].water:Number(s[key])||0;if(amount<=.001)return;const fraction=amount/(bowl?4:6);
    const local=bowl?[[.08,.22],[.92,.22],[.82,.65],[.65,.92],[.35,.92],[.18,.65]]:key==='jug'?[[.54,.15],[.78,.14],[.75,.35],[.86,.53],[.9,.77],[.84,.9],[.45,.93],[.29,.8],[.33,.57],[.49,.34]]:[[.17,.18],[.86,.18],[.75,.87],[.28,.88]];
    const poly=local.map(([u,v])=>this.point(p,u,v)),min=Math.min(...poly.map(q=>q.y)),max=Math.max(...poly.map(q=>q.y)),area=this.polygonArea(poly);let lo=min,hi=max;
    for(let i=0;i<16;i++){const mid=(lo+hi)/2;if(this.polygonArea(this.below(poly,mid))>area*fraction)lo=mid;else hi=mid}const level=(lo+hi)/2,f=this.fluid(key),bottom=this.below(poly,level);if(bottom.length<3)return;
    ctx.save();ctx.beginPath();poly.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.closePath();ctx.clip();const g=ctx.createLinearGradient(0,level,0,max);g.addColorStop(0,bowl&&s[key].tinted?'rgba(199,150,160,.8)':'rgba(169,199,215,.53)');g.addColorStop(1,bowl&&s[key].tinted?'rgba(125,91,116,.9)':'rgba(103,148,176,.65)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-this.W,level);for(let x=-this.W;x<=this.W*2;x+=8)ctx.lineTo(x,level+Math.sin(x*.12+now*.008)*f.wave*.6);ctx.lineTo(this.W*2,max+10);ctx.lineTo(-this.W,max+10);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(238,240,232,.7)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-this.W,level);ctx.lineTo(this.W*2,level);ctx.stroke();if(bowl){const edge=bottom.filter(q=>Math.abs(q.y-level)<.02),xs=edge.map(q=>q.x);if(xs.length>=2){const left=Math.min(...xs),right=Math.max(...xs);for(let i=0;i<Math.ceil(s[key].berries||0);i++)this.berry(ctx,left+(right-left)*(.2+(i%4)*.2),level+2,Math.max(2.8,p.w*.022))}}ctx.restore();
  }
  berry(ctx,x,y,r){const g=ctx.createRadialGradient(x-r*.3,y-r*.4,.1,x,y,r);g.addColorStop(0,'#bc7f87');g.addColorStop(.35,'#67435b');g.addColorStop(1,'#33283e');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.fillStyle='rgba(228,208,170,.6)';ctx.beginPath();ctx.arc(x-r*.25,y-r*.3,r*.15,0,7);ctx.fill()}
  drawSieveBerries(ctx,p,n){const q=this.point(p,.27,.67);for(let i=0;i<n;i++){const a=i*2.4;this.berry(ctx,q.x+Math.cos(a)*p.w*.1,q.y+Math.sin(a)*p.h*.06,3.4)}}
  drawPuddle(ctx,s,now,index=0){if(!s.puddles?.[index]?.amount)return;const p=this.puddle(s,index),a=this.active&&!this.active.finished&&this.active.puddleIndex===index?this.active:null;let progress=a&&['wipe','soak'].includes(a.id)?a.flowProgress:0;
    let scale=a?.id==='soak'?Math.sqrt(Math.max(0,1-progress)):1;if(scale<.02)return;ctx.save();ctx.beginPath();for(let i=0;i<=60;i++){const t=i/60*Math.PI*2,rr=1+.10*Math.sin(t*3+.8)+.07*Math.cos(t*5);const x=p.x+Math.cos(t)*p.rx*rr*scale,y=p.y+Math.sin(t)*p.ry*rr*scale;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();ctx.clip();
    const g=ctx.createLinearGradient(0,p.y-p.ry,0,p.y+p.ry);g.addColorStop(0,'rgba(173,199,212,.47)');g.addColorStop(1,'rgba(130,163,183,.65)');ctx.fillStyle=g;ctx.fillRect(p.x-p.rx*1.2,p.y-p.ry*1.4,p.rx*2.4,p.ry*2.8);ctx.strokeStyle='rgba(237,234,221,.65)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(p.x,p.y,p.rx*.83*scale,p.ry*.63*scale,0,3.6,5.7);ctx.stroke();
    if(a?.id==='wipe'&&progress>0){ctx.globalCompositeOperation='destination-out';ctx.lineWidth=25;ctx.lineCap='round';ctx.beginPath();a.trail.forEach((v,i)=>i?ctx.lineTo(v.x,v.y):ctx.moveTo(v.x,v.y));ctx.stroke()}
    ctx.restore();
  }
  sprite(ctx,key,p,s,file){const im=this.images[file||this.file(key,s)];if(!im)return;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle||0);ctx.drawImage(im,-p.w/2,-p.h/2,p.w,p.h);ctx.restore();if(['jug','glass','bowl','bowl2'].includes(key))this.drawLiquid(ctx,key,p,s,performance.now());if(['bowl','bowl2'].includes(key)){const im=this.images.bowl;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle||0);ctx.drawImage(im,0,im.height*.43,im.width,im.height*.57,-p.w/2,-p.h/2+p.h*.43,p.w,p.h*.57);ctx.restore()}if(key==='spoon'&&s.spoonDirty){const q=this.point(p,.24,.76);ctx.fillStyle='rgba(131,65,99,.6)';ctx.beginPath();ctx.ellipse(q.x,q.y,p.w*.07,p.h*.035,-.7,0,7);ctx.fill()}if(key==='sieve'&&s.sieveBerries)this.drawSieveBerries(ctx,p,s.sieveBerries)}
  frontRim(ctx,key){const r=this.rect(key),im=this.images.bowl;if(!im)return;const y=im.height*.43;ctx.drawImage(im,0,y,im.width,im.height-y,r.x,r.y+r.h*.43,r.w,r.h*.57)}
  emit(x,y,n=1,tint=false){for(let i=0;i<n;i++)this.particles.push({x,y,vx:(Math.random()-.5)*65,vy:-25-Math.random()*55,life:.26+Math.random()*.24,size:.6+Math.random()*1.5,ground:y+3,tint})}
  stream(ctx,from,to,now,tint=false,width=3){if(to.y<from.y+4)return;const dy=to.y-from.y,tau=Math.sqrt(2*dy/750),vx=(to.x-from.x)/tau;
    ctx.save();ctx.lineCap='round';for(let k=0;k<2;k++){ctx.beginPath();for(let i=0;i<=32;i++){const t=tau*i/32,x=from.x+vx*t+Math.sin(now*.025+i*.4)*.35,y=from.y+375*t*t;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.strokeStyle=tint?(k?'rgba(232,199,202,.65)':'rgba(151,94,126,.8)'):(k?'rgba(246,245,228,.7)':'rgba(159,191,211,.75)');ctx.lineWidth=k?width*.25:width;ctx.stroke()}ctx.restore();
  }
  updateParticles(ctx,dt){for(const p of this.particles){p.life-=dt;p.vy+=450*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.vy>0&&p.y>p.ground){p.y=p.ground;p.vy*=-.16;p.vx*=.7;p.life=Math.min(p.life,.12)}ctx.globalAlpha=Math.min(1,p.life*5);ctx.fillStyle=p.tint?'#bc7f87':'#d6dfe0';ctx.beginPath();ctx.ellipse(p.x,p.y,p.size*.65,p.size*(1+Math.min(2,Math.abs(p.vy)*.01)),0,0,7);ctx.fill()}ctx.globalAlpha=1;this.particles=this.particles.filter(p=>p.life>0)}
  drawRings(ctx,dt){for(const r of this.rings){r.life-=dt;r.radius+=dt*21;ctx.strokeStyle=`rgba(239,232,215,${Math.max(0,r.life)*.7})`;ctx.lineWidth=.7;ctx.beginPath();ctx.ellipse(r.x,r.y,r.radius,r.radius*.29,0,0,7);ctx.stroke()}this.rings=this.rings.filter(r=>r.life>0)}
  hide(key){this.hidden.add(key);const e=this.scene.querySelector(`[data-source="${key}"]`);if(e)e.style.visibility='hidden';this.wake()}
  restore(){for(const key of this.hidden){const e=this.scene.querySelector(`[data-source="${key}"]`);if(e)e.style.visibility=''}this.hidden.clear()}
  stop(){if(this.active){this.active.resolve(false);this.active=null}this.restore();this.particles=[];this.rings=[];if(this.raf)cancelAnimationFrame(this.raf);this.raf=0;this.resetContext(this.m);if(this.alive)this.wake()}
  destroy(){this.alive=false;this.stop();this.observer.disconnect()}
  async play({id,source,target,before,after,origin,puddleIndex=0,isCurrent}){await this.ready;if(!this.alive||!isCurrent())return false;this.stop();const actual=id==='strain'&&source==='sieve'?'bowl':source,p=this.pose(actual);if(origin&&actual===source){p.x=origin.x;p.y=origin.y}
    this.hide(actual);if(id==='strain')this.hide('sieve');const duration={pour:2850,spill:2800,strain:3200,add:2100,stir:3150,scoop:2500,rinse:2750,fill:3000,wipe:2400,soak:2300,drop:1150}[id]||1500;
    return new Promise(resolve=>{this.active={id,source:actual,target,puddleIndex,before:structuredClone(before),after:structuredClone(after),base:this.pose(actual),startPose:p,pose:p,start:performance.now(),duration:matchMedia('(prefers-reduced-motion: reduce)').matches?100:duration,resolve,isCurrent,flowProgress:0,trail:[],emitAccumulator:0,ringAccumulator:0};this.wake()})
  }
  advance(now,dt){const a=this.active;if(!a)return this.getState();if(!a.isCurrent()){a.finished=true;return this.getState()}const t=Math.min(1,(now-a.start)/a.duration),s=structuredClone(a.before),ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)},range=(x,l,r)=>ease((x-l)/(r-l)),lerp=(x,y,v)=>x+(y-x)*v;
    a.t=t;a.flowProgress=range(t,.28,.72);a.visual=s;const target=['bowl','bowl2'].includes(a.target)?this.surface(a.target,s):null;
    let goal=target?{x:target.x,y:target.y}:this.puddle(a.after,a.puddleIndex);const b=a.base;
    if(['pour','spill','strain','add'].includes(a.id)){
      if(a.id==='spill')goal=this.puddle(a.after,a.puddleIndex);const spout=a.source==='jug'?[.947,.075]:a.source==='glass'?[.88,.06]:a.id==='add'?[.73,.07]:[.94,.2],hand=a.source==='jug'?[.16,.43]:[.27,.5],maxAngle=a.id==='add'?1.3:1.08;
      const desired={x:goal.x-25,y:goal.y-(a.id==='strain'?96:65)},q1=this.point({...b,x:0,y:0,angle:maxAngle},...spout),q2=this.point({...b,x:0,y:0,angle:maxAngle},...hand),endHand={x:desired.x-(q1.x-q2.x),y:desired.y-(q1.y-q2.y)};
      const startHand=this.point(t>.85?a.base:a.startPose,...hand),move=range(t,0,.17)*(1-range(t,.85,1)),angle=maxAngle*range(t,.16,.28)*(1-range(t,.73,.85));
      a.pose=this.anchored(b,...hand,{x:lerp(startHand.x,endHand.x,move),y:lerp(startHand.y,endHand.y,move)},angle);
      if(a.id==='pour'){s[a.source]=lerp(a.before[a.source],a.after[a.source],a.flowProgress);if(a.target==='glass')s.glass=lerp(a.before.glass,a.after.glass,a.flowProgress);else s[a.target].water=lerp(a.before[a.target].water,a.after[a.target].water,a.flowProgress)}
      if(a.id==='spill'){s.jug=lerp(a.before.jug,a.after.jug,a.flowProgress);s.puddle=lerp(a.before.puddle,a.after.puddle,a.flowProgress);s.puddlePos=a.after.puddlePos;s.puddles=a.after.puddles.map((p,i)=>({...p,amount:lerp(a.before.puddles[i]?.amount||0,p.amount,a.flowProgress)}))}
      if(a.id==='strain'){s[a.source].water=lerp(a.before[a.source].water,0,a.flowProgress);s[a.source].berries=Math.round(a.before[a.source].berries*(1-a.flowProgress));s[a.target].water=lerp(0,a.after[a.target].water,a.flowProgress);s[a.target].tinted=true;s.sieveBerries=Math.round(a.after.sieveBerries*a.flowProgress)}
      if(a.id==='add'&&a.flowProgress>.3)s[a.target]=structuredClone(a.after[a.target]);
    }else if(a.id==='stir'){
      const q=this.surface(a.target,s),move=range(t,0,.2)*(1-range(t,.8,1)),turn=range(t,.2,.8)*Math.PI*6,contact={x:q.x+q.rx*.36*Math.cos(turn),y:q.y+q.ry*.47*Math.sin(turn)+7},tip=this.point(t>.8?a.base:a.startPose,.2,.78);a.pose=this.anchored(b,.2,.78,{x:lerp(tip.x,contact.x,move),y:lerp(tip.y,contact.y,move)},-.20*move+Math.sin(turn)*.07*move);
      const f=this.fluid(a.target);if(t>.2&&t<.8){f.spin=7* Math.sin((t-.2)/.6*Math.PI);f.velocity+=Math.sin(now*.03)*dt*12}if(a.flowProgress>.95)s[a.target].sugar=false;
    }else if(a.id==='rinse'||a.id==='fill'){
      const spout={x:867,y:360},under={x:867,y:405},move=range(t,0,.2)*(1-range(t,.82,1)),anchor=a.id==='fill'?[.65,.13]:a.source==='spoon'?[.2,.78]:[.5,.5],start=this.point(t>.82?a.base:a.startPose,...anchor),angle=a.id==='fill'?0:-.18*move+Math.sin(now*.012)*.08*move;
      a.pose=this.anchored(b,...anchor,{x:lerp(start.x,under.x,move),y:lerp(start.y,under.y,move)},angle);if(a.id==='fill')s.jug=lerp(a.before.jug,a.after.jug,a.flowProgress);if(a.id==='rinse'&&a.flowProgress>.55)s.spoonDirty=false;a.faucet=spout;
    }else if(a.id==='scoop'){
      const q=this.surface(a.target,s),other=this.surface(a.target==='bowl'?'bowl2':'bowl',s),tip=this.point(t>.75?a.base:a.startPose,.25,.76);let target;
      if(t<.3){const k=range(t,0,.3);target={x:lerp(tip.x,q.x,k),y:lerp(tip.y,q.y+8,k)}}else if(t<.75){const k=range(t,.3,.75);target={x:lerp(q.x,other.x,k),y:lerp(q.y+8,other.y-12,k)-Math.sin(k*Math.PI)*65};a.carryBerry=true}else{const k=range(t,.75,1);target={x:lerp(other.x,tip.x,k),y:lerp(other.y-12,tip.y,k)}}
      a.pose=this.anchored(b,.25,.76,target,Math.sin(t*6)*.08);if(t>.3)s[a.target].berries=a.before[a.target].berries-1;if(t>.75)s[a.target==='bowl'?'bowl2':'bowl'].berries=a.after[a.target==='bowl'?'bowl2':'bowl'].berries;
    }else if(['wipe','soak'].includes(a.id)){
      const q=this.puddle(a.before,a.puddleIndex),move=range(t,0,.2)*(1-range(t,.87,1)),p=a.flowProgress;let x=q.x,y=q.y;
      if(a.id==='wipe'){x=q.x+Math.sin((t-.2)/.67*Math.PI*5)*q.rx*.82;y=q.y+Math.cos((t-.2)*13)*3}
      a.pose={...b,x:lerp(a.startPose.x,x,move),y:lerp(a.startPose.y,y,move),angle:Math.sin(t*16)*.05*move};if(t>.2&&t<.87)a.trail.push({x:a.pose.x,y:a.pose.y});
      if(a.id==='soak'){a.pose.w=b.w*(1+.035*Math.sin(p*Math.PI));a.pose.h=b.h*(1-.14*Math.sin(p*Math.PI))}
    }else if(a.id==='drop'){
      const d=a.after.positions?.cup||KITCHEN_OBJECTS.cup,o=KITCHEN_OBJECTS.cup,end={x:d.x*10+this.W*o.w/200,y:d.y*this.H/100+this.H*o.h/200},impact=.62,pickup=range(t,0,.2),fall=Math.max(0,Math.min(1,(t-.2)/.42));a.pose={...b,x:lerp(a.startPose.x,end.x,pickup),y:t<.2?lerp(a.startPose.y,a.startPose.y-45,pickup):t<impact?lerp(a.startPose.y-45,end.y,fall*fall):end.y-Math.abs(Math.sin((t-impact)*22))*30*(1-t)*(1-t),angle:(t<impact?-.12+fall*.22:Math.sin(t*40)*.15*(1-t))};a.dropped=t>impact;
    }
    if(t>=1){a.finished=true;return structuredClone(a.after)}return s;
  }
  drawAction(ctx,a,s,now,dt){this.sprite(ctx,a.source,a.pose,s,a.id==='drop'&&a.dropped?this.file(a.source,a.after):null);
    const flowing=a.t>.28&&a.t<.72;
    if(['pour','spill','strain','add'].includes(a.id)&&flowing){const from=this.point(a.pose,...(a.source==='jug'?[.947,.075]:a.source==='glass'?[.88,.06]:a.id==='add'?[.73,.07]:[.94,.2]));const to=a.id==='spill'?this.puddle(a.after,a.puddleIndex):a.target==='glass'?this.point(this.pose('glass'),.5,.35):this.surface(a.target,s);const tinted=a.id==='strain'||a.before[a.source]?.tinted;
      if(a.id==='strain'){const mesh={x:to.x-5,y:to.y-35},p=this.anchored({w:92,h:88},.27,.67,mesh,-.22);this.sprite(ctx,'sieve',p,s);this.stream(ctx,from,mesh,now,true,4);this.stream(ctx,{x:mesh.x,y:mesh.y+5},to,now,true,2)}
      else if(a.id==='add'){for(let i=0;i<14;i++){const u=((now*.0008+i*.073)%1),x=from.x+(to.x-from.x)*u,y=from.y+(to.y-from.y)*u*u;ctx.fillStyle=a.source==='sugar'?'#e4d0aa':'#67435b';ctx.beginPath();ctx.arc(x+Math.sin(i)*2,y,a.source==='sugar'?1:2.6,0,7);ctx.fill()}}
      else this.stream(ctx,from,to,now,tinted,3.2);
      a.emitAccumulator+=dt*24;if(a.emitAccumulator>1){this.emit(to.x,to.y,Math.floor(a.emitAccumulator),tinted);a.emitAccumulator%=1;if(['bowl','bowl2','glass'].includes(a.target))this.impulse(a.target,.12)}a.ringAccumulator+=dt;if(a.ringAccumulator>.14){this.rings.push({x:to.x,y:to.y,radius:2,life:.5});a.ringAccumulator=0}
    }
    if(['rinse','fill'].includes(a.id)&&a.t>.2&&a.t<.82){const impact=this.point(a.pose,...(a.id==='fill'?[.65,.13]:a.source==='spoon'?[.2,.78]:[.5,.5]));this.stream(ctx,a.faucet,impact,now,false,2.8);this.stream(ctx,impact,{x:890,y:455},now,false,1.2);if(Math.random()<dt*24)this.emit(impact.x,impact.y,2)}
    if(a.id==='scoop'&&a.t>.3&&a.t<.75){const q=this.point(a.pose,.25,.76);this.berry(ctx,q.x,q.y-3,4.8)}
    if(a.id==='soak'&&a.flowProgress>.1){ctx.save();ctx.globalCompositeOperation='source-atop';ctx.globalAlpha=a.flowProgress*.3;const q=a.pose;ctx.fillStyle='#4d5a40';ctx.beginPath();ctx.ellipse(q.x,q.y,q.w*.4,q.h*.3,0,0,7);ctx.fill();ctx.restore()}
  }
  setState(){this.wake()}
  capture(key){const p=this.pose(key),c=document.createElement('canvas'),scale=2;c.width=Math.ceil(p.w*scale);c.height=Math.ceil(p.h*scale);const ctx=c.getContext('2d');ctx.scale(scale,scale);this.sprite(ctx,key,{...p,x:p.w/2,y:p.h/2},this.getState());c.style.width=p.w/this.W*this.scene.clientWidth+'px';c.style.height=p.h/this.H*this.scene.clientHeight+'px';return c}
};
