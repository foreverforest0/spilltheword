"""Browser regression checks for Unbox it. Run with Python Playwright + Chromium."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path
from threading import Thread
import json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'

def wait_phase(p,phase):p.wait_for_function('(s)=>FY.phase===s',arg=phase)
def start(p,g='d',lv='1',mode='t',contents='both',specific=None):
 p.evaluate('([g,lv])=>fyStart(g,lv)',[g,lv])
 if g in ['w','p'] and lv=='1':
  assert p.locator('#ub-start').count()==0
  assert p.evaluate('FY.mode')=='t'
 else:
  p.locator(f'[data-mode="{mode}"]').click() if g!='s' else None
  p.locator(f'[data-contents="{contents}"]').click();p.locator('#ub-start').click()
 if specific:
  p.evaluate('(im)=>{const i=FY.items.findIndex(x=>x.im===im);if(i>=0)[FY.items[0],FY.items[i]]=[FY.items[i],FY.items[0]];fyScene()}',specific)
 return p.evaluate('FY.items[0]')
def keyboard_open(p):
 p.locator('#ub-knife').focus();p.keyboard.press('Enter');p.keyboard.press('Enter');wait_phase(p,'paper')
def reveal(p):p.locator('#ub-paper').click();wait_phase(p,'revealed')
def solve(p,it,group,mode='t',wrong=False):
 if group=='s':p.locator(f'.fypb[data-k="{it["a"]}"]').click();return
 if group=='q':
  p.locator(f'#fzans > .evcert [data-k="{0 if it["good"] else 1}"]').click()
  if it['good']:assert p.locator('#fznx').count();return
  p.locator(f'#fzfix > .evcert [data-k="{it["c"][0]}"]').click()
 else:p.locator(f'#fzans > .evcert [data-k="{it["c"][0]}"]').click()
 if mode=='t':
  if wrong:
   p.locator('#fzin').fill('This grammar is deliberately wrong');p.locator('#fzchk').click();assert p.locator('#fznx').count()==0
  p.locator('#fzin').fill(it['ok'][0])
 else:
  for word in it['ok'][0].split(' '):
   p.evaluate('(w)=>{const b=[...document.querySelectorAll("#fzpool .evt")].find(x=>x.textContent===w);if(!b)throw Error("Missing tile "+w);b.click()}',word)
 p.locator('#fzchk').click();assert p.locator('#fznx').count(),it

with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':1100},reduced_motion='reduce');errors=[];failed=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:failed.append(r.url) if '/unbox/' in r.url and r.status>=400 else None)
 page.goto(base+'/?unbox=1');page.locator('#ub-start').wait_for();assert 'Unbox it' in page.locator('.ub-header').inner_text();assert page.locator('.fywrap,.fybg,.fypipes').count()==0
 start(page,specific='fa_printer.webp');page.wait_for_timeout(80)
 assert page.locator('#fztask').is_hidden();assert page.locator('.ub-inside').evaluate('(e)=>getComputedStyle(e).visibility')=='hidden';page.locator('#ub-parcel').click();assert page.evaluate('FY.phase')=='sealed'
 # Pick up the knife. A distant drag and a tiny cut must not open the box.
 knife=page.locator('#ub-knife');knife.click();assert knife.get_attribute('aria-pressed')=='true'
 stage=page.locator('#ub-stage').bounding_box();page.mouse.move(stage['x']+10,stage['y']+250);page.mouse.down();page.mouse.move(stage['x']+80,stage['y']+290,steps=8);page.mouse.up();assert page.evaluate('FY.phase')=='sealed'
 r=page.locator('#ub-parcel').bounding_box();A=(r['x']+r['width']*.53,r['y']+r['height']*.33);B=(r['x']+r['width']*.42,r['y']+r['height']*(373/(2000/3)));quarter=(A[0]+(B[0]-A[0])*.2,A[1]+(B[1]-A[1])*.2)
 page.mouse.move(*A);page.mouse.down();page.mouse.move(*quarter,steps=12);page.mouse.up();assert page.evaluate('FY.phase')=='sealed';assert 0<int(page.locator('.ub-page').get_attribute('data-cut'))<35
 page.screenshot(path='/tmp/unbox-cutting.png',full_page=True)
 # Progress survives lifting the blade, and a complete trace opens the flaps.
 page.mouse.move(*A);page.mouse.down();page.mouse.move(*B,steps=24);page.mouse.up();wait_phase(page,'paper');assert page.locator('#fztask').is_hidden();assert page.locator('#ub-paper').is_enabled();assert page.locator('#ub-knife').is_disabled();page.screenshot(path='/tmp/unbox-wrapped.png',full_page=True)
 transform=page.locator('#ub-paper').evaluate('(e)=>getComputedStyle(e).transform');reveal(page);assert page.locator('#ub-paper').evaluate('(e)=>getComputedStyle(e).transform')!=transform;assert page.locator('#fztask').is_visible();page.screenshot(path='/tmp/unbox-revealed.png',full_page=True)
 it=page.evaluate('FY.items[FY.i]');solve(page,it,'d',wrong=True);page.locator('#fznx').click();wait_phase(page,'sealed');assert page.evaluate('FY.i')==1;assert page.locator('#fztask').is_hidden();assert page.locator('#ub-progress').evaluate('(e)=>e.value')==0
 print('Knife pickup, rejected wrong/partial strokes, persistent cut, opening, paper click, answer and next parcel passed',flush=True)
 # Every collection remains usable in both input modes, with all three reveal styles.
 collections=0
 for lv in ['1','2']:
  for g in ['s','d','j','q']:
   for mode in (['n'] if g=='s' else ['n','t']):
    contents=['object','card','both'][collections%3];it=start(page,g,lv,mode,contents);keyboard_open(page);reveal(page)
    if contents=='object':assert page.locator('.ub-inner-card').evaluate('(e)=>getComputedStyle(e).display')=='none'
    if contents=='card':assert page.locator('.ub-object').evaluate('(e)=>getComputedStyle(e).display')=='none'
    solve(page,it,g,mode);collections+=1
 print('All 8 B1/B2 collections, both answer modes and all 3 content styles passed',flush=True)
 # Complete a collection and retain its notes instead of losing the final parcel.
 start(page,'d','1','t');page.evaluate('()=>{FY.i=FY.items.length-1;fyScene()}');keyboard_open(page);reveal(page);solve(page,page.evaluate('FY.items[FY.i]'),'d');page.locator('#fznx').click();page.locator('#ub-again').wait_for();assert 'parcels opened' in page.locator('.ub-end-note').inner_text().lower();page.locator('#ub-again').click();assert page.locator('#ub-start').is_visible()
 # Real touch gesture via Chromium's input system (not a synthetic click shortcut).
 mobile=browser.new_page(viewport={'width':390,'height':844},has_touch=True,reduced_motion='reduce');mobile.on('pageerror',lambda e:errors.append(str(e)));mobile.goto(base+'/?unbox=1');mobile.locator('#ub-start').click();mobile.wait_for_timeout(90)
 assert mobile.evaluate('document.documentElement.scrollWidth<=innerWidth');mobile.screenshot(path='/tmp/unbox-mobile-sealed.png',full_page=True)
 cdp=mobile.context.new_cdp_session(mobile);k=mobile.locator('#ub-knife').bounding_box();r=mobile.locator('#ub-parcel').bounding_box();a=(r['x']+r['width']*.53,r['y']+r['height']*.33);b=(r['x']+r['width']*.42,r['y']+r['height']*(373/(2000/3)))
 cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':k['x']+k['width']*.6,'y':k['y']+k['height']*.4}]})
 for i in range(25):
  t=i/24;cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':a[0]+(b[0]-a[0])*t,'y':a[1]+(b[1]-a[1])*t}]})
 cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});wait_phase(mobile,'paper');mobile.locator('#ub-paper').tap();wait_phase(mobile,'revealed');assert mobile.evaluate('document.documentElement.scrollWidth<=innerWidth');mobile.screenshot(path='/tmp/unbox-mobile-revealed.png',full_page=True)
 print('Real touch cutting and mobile paper reveal passed',flush=True)
 # Normal-motion cancellation: old timers cannot reveal a task over the settings screen.
 normal=browser.new_page(viewport={'width':1440,'height':1000});normal.on('pageerror',lambda e:errors.append(str(e)));normal.goto(base+'/?unbox=1');normal.locator('#ub-start').click();normal.locator('#ub-knife').focus();normal.keyboard.press('Enter');normal.keyboard.press('Enter');normal.locator('#ub-settings').click();normal.wait_for_timeout(1200);assert normal.locator('#ub-start').is_visible();assert normal.locator('#fztask').count()==0
 normal.locator('#ub-start').click();normal.locator('#ub-knife').focus();normal.keyboard.press('Enter');normal.keyboard.press('Enter');wait_phase(normal,'paper');normal.locator('#ub-paper').click();normal.locator('#ub-settings').click();normal.wait_for_timeout(1000);assert normal.locator('#ub-start').is_visible();assert normal.locator('#fztask').count()==0
 # Existing topic navigation uses the new title and opens the new setup.
 page.evaluate('()=>{S.splevel="b1";spSetup()}');assert page.locator('[data-tp="fyB1"]').inner_text()=='Unbox it: relative clauses';page.locator('[data-tp="fyB1"]').click();assert page.locator('#ub-start').is_visible()
 assert not errors,errors;assert not failed,failed
 print(json.dumps({'passed':['all unpacking stages','accurate gesture coverage','14 collection/mode combinations','three reveal styles','completion','touch','keyboard','normal-motion cancellation','existing menu integration'],'javascript_errors':errors,'asset_failures':failed}),flush=True)
 browser.close()
server.shutdown()
