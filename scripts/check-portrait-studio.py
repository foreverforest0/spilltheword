"""Portrait composition, gentle subtitle waves, game flows and SVG-to-PNG export."""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright
from PIL import Image
import json,base64
ROOT=Path(__file__).resolve().parents[1]
OUT=Path('/workspace/shared/downloads/portrait-fix');OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 p=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce',accept_downloads=True);errors=[];missing=[]
 p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.status>=400 else None)
 p.goto(base+'/appearance/');p.wait_for_selector('.mode h2 .stw-wave-letter')
 # Static wave stays below two pixels; the primary title retains its larger wave.
 report=p.evaluate('''()=>{
  const assert=(v,m)=>{if(!v)throw Error(m)},ys=sel=>Array.from(document.querySelectorAll(sel)).map(el=>new DOMMatrix(getComputedStyle(el).transform).m42);
  const spread=a=>Math.max(...a)-Math.min(...a),title=spread(ys('h1 .stw-wave-letter')),intro=spread(ys('.intro h2 .stw-wave-letter'));
  assert(title>8,'Main title lost its wave');assert(intro>0&&intro<2.2,'Intro wave too large');
  for(const h of document.querySelectorAll('.mode h2')){
   assert(spread(Array.from(h.querySelectorAll('.stw-wave-letter')).map(el=>new DOMMatrix(getComputedStyle(el).transform).m42))<2.2,'Card wave too large');
   assert(Array.from(h.querySelectorAll('.stw-wave-letter')).every(el=>getComputedStyle(el).fontWeight==='400'),'Uneven letter weight');
  }
  assert(getComputedStyle(document.querySelector('.mode>span:last-child')).fontWeight==='700','Call-to-action styling lost');
  for(let i=0;i<700;i++){const p=randomPerson();assert(valid(p),'Invalid preset');assert(p.gender==='man'||p.facial==='none','Incompatible ready-made face');assert(['18','15','12'].includes(p.eyes),'Unreviewed expression');}
  for(const f of C.face){
   for(const hair of C.hair){const p={...DEFAULT,face:f.id,hair:hair.id},l=AppearanceParts.layout(p),svg=portrait(p);assert(svg&&!/NaN|Infinity|undefined/.test(svg.replace(/href="data:[^"]*"/g,'')),'Broken composition');assert(Math.abs(l.face[1]+l.face[3]-370)<.01,'Chin misaligned');}
   for(const a of C.accessory){const p={...DEFAULT,face:f.id,[a.group]:a.id},l=AppearanceParts.layout(p),svg=portrait(p);assert(!/NaN|undefined/.test(svg.replace(/href="data:[^"]*"/g,'')),'Broken accessory');
    if(a.group==='glasses'||a.group==='hat'){const r=l[a.group==='hat'?'hat':'glasses'],m=APPEARANCE_GEOMETRY[a.file.split('/').pop()];assert(Math.abs(r[2]/r[3]-m.w/m.h)<.001,'Accessory aspect ratio changed');assert(r[1]>=0,'Headwear clipped at top');}
   }
  }
  return {faces:C.face.length,hair:C.hair.length,accessories:C.accessory.length,mainWave:title,subtitleWave:intro};
 }''')
 for number in [15,17]:
  item=p.evaluate('n=>C.hair[n]',number);path=ROOT/'appearance'/item['file'];assert base64.b64decode(item['src'].split(',')[1])==path.read_bytes()
  art=Image.open(path).convert('RGBA');assert art.getchannel('A').crop((0,0,art.width,4)).getextrema()==(0,0)
 p.screenshot(path=str(OUT/'portrait-studio-after.png'),full_page=True)
 p.emulate_media(reduced_motion='no-preference')
 assert p.locator('h1 .stw-wave-letter').first.evaluate('e=>getComputedStyle(e).animationName')=='stw-page-wave'
 assert p.locator('.intro h2 .stw-wave-letter').first.evaluate('e=>getComputedStyle(e).animationName')=='stw-subtitle-float'
 assert p.locator('.intro h2 .stw-wave-letter').first.evaluate('e=>getComputedStyle(e).animationDuration')=='5.4s'
 p.emulate_media(reduced_motion='reduce')
 assert p.locator('.intro h2 .stw-wave-letter').first.evaluate('e=>getComputedStyle(e).animationName')=='none'
 p.locator('[data-mode="build"]').click();assert p.locator('.toolbar h2 .stw-wave-letter').first.evaluate('e=>new DOMMatrix(getComputedStyle(e).transform).m42')==-6
 p.locator('#check').click();assert 'Almost' in p.locator('#feedback').inner_text()
 p.evaluate('person={...target};refreshPortrait();renderParts()');p.locator('#check').click();assert 'Well done' in p.locator('#feedback').inner_text();assert p.locator('#next').is_enabled()
 p.locator('#next').click();assert p.evaluate('round')==2
 p.locator('#back').click();p.locator('[data-mode="free"]').click();p.locator('#name').fill('Jamie')
 p.locator('[data-key="hair"][data-value="17"]').click();p.locator('[data-category="accessories"]').click();p.locator('[data-key="headphones"][data-value="23"]').click()
 assert p.evaluate("person.headphones==='23'&&person.hat==='none'&&person.earrings==='none'")
 p.locator('[data-key="earrings"][data-value="18"]').click();assert p.evaluate("person.headphones==='none'")
 p.locator('[data-key="hat"][data-value="8"]').click();p.locator('[data-key="glasses"][data-value="3"]').click()
 p.screenshot(path=str(OUT/'portrait-builder-after.png'),full_page=True)
 with p.expect_download() as download:p.locator('#download').click()
 download.value.save_as(str(OUT/'portrait-export.png'));im=Image.open(OUT/'portrait-export.png');assert im.size==(700,850)
 assert len(im.convert('RGB').getcolors(700*850) or [])>1000,'Blank or empty PNG export'
 p.reload();p.locator('[data-mode="free"]').click();assert p.locator('#name').input_value()=='Jamie';assert p.evaluate("person.hair==='17'&&person.glasses==='3'")
 # Representative source images render on exactly the same paired-eye baseline.
 p.evaluate("person={...DEFAULT,glasses:'3'};refreshPortrait()")
 eye_windows=p.locator('#portrait [data-landmark="eyes"]>svg')
 assert eye_windows.count()==2
 assert eye_windows.locator('image').evaluate_all('els=>els.length===2&&els[0].getAttribute("href")===els[1].getAttribute("href")')
 assert eye_windows.evaluate_all('els=>els.every(e=>Number(e.getAttribute("width"))>0&&Number(e.getAttribute("height"))>0)')
 # Review the presets actually used by the game, including hats and thin frames.
 p.evaluate('''()=>{app.innerHTML='<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:12px">'+PORTRAIT_PROFILES.map((x,i)=>{const {hats,frames,...f}=x;return '<div style="background:#CCE5FF;text-align:center">'+portrait({...DEFAULT,...f,hat:hats.at(-1),glasses:frames.at(-1)})+'<p>Profile '+(i+1)+'</p></div>'}).join('')+'</div>';document.querySelectorAll('#app svg').forEach(s=>s.style.height='280px')}''')
 p.screenshot(path=str(OUT/'ready-portraits-after.png'),full_page=True)
 p.goto(base+'/appearance/?mode=guess&sheet=PORTRAITS');assert p.locator('[data-person]').count()==10
 cast=p.evaluate('board');assert len({p['name'] for p in cast})==10
 ids=p.locator('.board [id]').evaluate_all('els=>els.map(e=>e.id)');assert len(ids)==len(set(ids)),'SVG masks leak between characters'
 other=b.new_page();other.goto(p.url);assert other.evaluate('board')==cast;other.close()
 p.locator('[data-person="0"]').click();assert p.locator('.eliminated').count()==1
 p.locator('#guess').click();p.locator('[data-person="1"]').click();p.locator('#yes').click();assert 'You found' in p.locator('#board-feedback').inner_text()
 p.screenshot(path=str(OUT/'guess-who-after.png'),full_page=True)
 for w in [768,390]:
  p.set_viewport_size({'width':w,'height':900});assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
  p.locator('#back').click();p.locator('[data-mode="free"]').click();assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
  if w==390:p.screenshot(path=str(OUT/'portrait-mobile-after.png'),full_page=True)
  p.locator('#back').click();p.locator('[data-mode="guess"]').click()
 # Actual catalog integration and a shared-theme regression on the main site.
 host=b.new_page(viewport={'width':1440,'height':1000});host.on('pageerror',lambda e:errors.append(str(e)));host.goto(base+'/');host.evaluate("go('gram');S.glevel='kids';glSetup()")
 host.locator('[data-grammar-topic="kids:8"]').click();host.locator('[data-grammar-exercise="app"]').click()
 frame=host.frame_locator('iframe[title^="Kids Appearance"]');frame.locator('[data-mode="free"]').click();assert frame.locator('#portrait svg').count()>0
 host.evaluate("go('gram');S.glevel='b1';glSetup()")
 assert host.locator('h1 .stw-wave-letter').first.evaluate('e=>getComputedStyle(e).animationName')=='stw-page-wave'
 host.locator('[data-grammar-topic="b1:1"]').click();assert host.locator('.grammar-topic-heading .stw-wave-letter').first.evaluate('e=>getComputedStyle(e).animationName')=='stw-subtitle-float'
 assert not errors,errors
 assert not missing,missing
 print('PASS',json.dumps(report),'— 288 head/hair combinations, 336 accessory combinations, 700 presets, subtle subtitle waves, identical letter weight, build/guess/free flows, shared cast codes, PNG export, SVG mask isolation, actual catalog entry and mobile screens.')
 b.close()
server.shutdown()
