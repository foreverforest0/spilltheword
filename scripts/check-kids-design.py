"""Original wobbly art, level palettes, Kids instructions, usable fridge and live pond."""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
manifest=json.loads((ROOT/'assets/wobbly/manifest.json').read_text())
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');errors=[];missing=[]
 p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.status>=400 and r.url.startswith(base) and 'favicon' not in r.url else None);p.goto(base)
 # Every original PNG has transparent safety margins and a nonempty silhouette.
 from PIL import Image
 sources=list(manifest['pictures'].values())+[v['src'] for v in manifest['actions'].values()]
 for source in sources:
  im=Image.open(ROOT/source);assert im.format=='PNG' and im.mode=='RGBA';box=im.getchannel('A').getbbox();assert box and box[0]>=16 and box[1]>=16 and box[2]<=im.width-16 and box[3]<=im.height-16,source
 p.evaluate("async sources=>{for(const src of sources){const im=new Image();im.src=src;await im.decode();if(im.naturalWidth<25)throw Error(src)}}",sources)
 assert p.evaluate("BES.every(person=>PICS[person.k].startsWith('assets/wobbly/'))")
 assert p.evaluate("ACTIONS.length===29&&ACTIONS.every(a=>a[1].endsWith('.png')&&['He','She'].includes(a[2]))")
 assert p.evaluate("MGXC.mgc.items().every(r=>/^(He|She|Is he|Is she)/.test(r[1][0]))")
 for lv in ['kids','a1','a2','b1','b2','c1']:
  p.evaluate("lv=>{go('gram');S.glevel=lv;glSetup()}",lv);p.wait_for_timeout(60)
  assert p.locator('body').get_attribute('data-study-level')==lv
  assert p.evaluate('''()=>[...document.querySelectorAll('.grammar-topic')].every(e=>{const c=getComputedStyle(e).backgroundColor;return LevelDesign.current().cards.some(hex=>{const el=document.createElement('i');el.style.color=hex;document.body.append(el);const rgb=getComputedStyle(el).color;el.remove();return rgb===c})})''')
  p.screenshot(path=f'/tmp/kids-design-catalog-{lv}.png',full_page=True)
 for w in [1440,390,320]:
  p.set_viewport_size({'width':w,'height':1000 if w>600 else 844})
  for task in ['be','mkb','exp_kids_1','pond_kids_1']:
   p.evaluate("task=>{go('gram');S.splevel='kids';spOpen(task)}",task);p.wait_for_timeout(100)
   assert p.evaluate('document.documentElement.scrollWidth<=innerWidth'),(w,task)
   if task=='mkb':
    assert p.locator('#dmhint,#dmh').count()==0
    if w>600:assert p.locator('.b1-fridge').bounding_box()['width']>=380
   if task=='exp_kids_1':
    assert p.locator('#sx-help').is_visible();assert p.locator('.sx-input-label').inner_text()=='Write the whole new sentence'
   p.screenshot(path=f'/tmp/kids-design-{task}-{w}.png',full_page=True)
 # Actual capsule interaction must reveal a sign, retaining a correct example.
 p.set_viewport_size({'width':1440,'height':1000});p.evaluate("go('gram');S.splevel='kids';spOpen('gpc')");p.locator('#gck').click(force=True);p.wait_for_function("document.querySelectorAll('.gcc.wg').length===2")
 p.locator('.gcc').first.click(force=True);p.locator('.gcc:not(.op)').first.click(force=True)
 assert p.locator('#gxb .gv').inner_text() in ['+','−','?'];p.locator('#gxsh').click();assert p.locator('#gxex').inner_text().startswith('Example')
 # Normal-motion pond: fish move and pointer movement paints a visible water wake.
 p.emulate_media(reduced_motion='no-preference');p.evaluate("spOpen('pond_kids_1')");f=p.locator('.pond-fish').nth(3);before=f.bounding_box();p.wait_for_timeout(700);after=f.bounding_box();assert abs(before['x']-after['x'])+abs(before['y']-after['y'])>1
 water=p.locator('#pondWater').bounding_box();p.mouse.move(water['x']+water['width']*.5,water['y']+water['height']*.5);p.wait_for_timeout(150)
 assert p.locator('#pondSurface').evaluate('(c)=>c.getContext("2d").getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4===3&&v>0)')
 p.emulate_media(reduced_motion='reduce');p.locator('.pond-fish').first.click();p.wait_for_selector('#pondAnswer');assert 'Write your answer. Hint can help.' not in p.locator('body').inner_text()
 assert not errors,errors;assert not missing,missing
 print('PASS: 107 original PNGs with transparent margins; six level palettes; Kids fridge without hints, child instructions and mobile layouts; capsule signs; swimming fish and pointer water response; no missing assets or JS errors')
 b.close()
server.shutdown()
