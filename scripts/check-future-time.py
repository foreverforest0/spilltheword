"""Printer documents, future-form mix, time lift lifecycle and accessible colours."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 p=b.new_page(viewport={'width':1440,'height':1080},reduced_motion='reduce');errors=[];missing=[]
 p.on('pageerror',lambda e:errors.append(str(e)))
 p.on('response',lambda r:missing.append(r.url) if r.url.startswith(base) and r.status>=400 and 'favicon' not in r.url else None)
 p.add_init_script('''(()=>{const Native=window.Audio;window.__timeAudio=[];window.Audio=function(...args){const a=new Native(...args);window.__timeAudio.push(a);return a}})()''')
 p.goto(base);p.evaluate("go('gram');S.snd=false;spOpen('future_advanced')")
 assert p.locator('[data-future-task]').count()==8
 assert p.evaluate("Object.values(FutureTime.documents).every(rows=>rows.length===10&&rows.every(r=>r.facts.length>=2&&r.hint&&r.answers.length))")
 for mode in ['continuous','perfect','perfectcontinuous','mix']:
  p.evaluate("mode=>spOpen('future_print_'+mode)",mode)
  assert p.locator('.ft-printer-page').is_visible();assert p.locator('.tt-ticket').count()==0
  for i in range(7):
   p.locator('#ftPrint').click();p.wait_for_function("document.querySelector('.ft-printer-page').dataset.phase==='ready'")
   assert p.locator('.tt-ticket').count()==1
   assert p.locator('#ftProgress').inner_text()==f'{i+1} / 7'
   assert p.locator('#ftHintText').is_hidden() and p.locator('#ftAnswers').is_hidden()
   p.locator('#ftAnswer').fill(f'Answer {mode} {i}.')
   p.locator('#ftHint').click();assert p.locator('#ftHintText').is_visible()
   p.locator('#ftShow').click();assert p.locator('#ftAnswers').is_visible()
  assert p.evaluate("mode=>new Set(S.futureDocumentRuns[mode].deck).size===7",mode)
  if mode=='mix':assert p.evaluate("new Set(S.futureDocumentRuns.mix.deck.map(id=>id.replace(/-\\d+$/,''))).size===3")
  p.locator('[data-document-index="0"]').click();assert p.locator('#ftAnswer').input_value()==f'Answer {mode} 0.'
  assert p.locator('#ftAnswers').is_visible();assert p.locator('#ftHintText').is_hidden()
  p.reload();p.evaluate("mode=>{go('gram');spOpen('future_print_'+mode)}",mode)
  assert p.locator('#ftAnswer').input_value()==f'Answer {mode} 0.'
  p.locator('#ftPrint').click();assert p.locator('.tt-ticket').count()==0
 p.evaluate("spOpen('future_lift')");assert p.locator('[data-time-stop]').count()==7
 assert p.locator('#ftAnswer').count()==0
 p.locator('#ftDoor').click();assert p.locator('#ftCab').evaluate("e=>e.classList.contains('open')")
 assert p.locator('#ftAnswer').is_visible()
 p.locator('#ftAnswer').fill('My lift answer.');p.locator('#ftHint').click();assert p.locator('#ftHintText').is_visible()
 p.locator('#ftShow').click();assert p.locator('#ftAnswers').is_visible()
 p.locator('#ftNext').click();p.wait_for_function("document.querySelector('.ft-lift-page').dataset.phase==='ready'")
 assert p.locator('#ftTime').inner_text()=='At ten';assert p.locator('#ftAnswer').count()==0
 p.locator('#ftDoor').click();assert p.locator('#ftHintText').is_hidden();assert p.locator('#ftAnswers').is_hidden()
 assert p.locator('.ft-art--person').count()==1 and p.locator('.ft-art--ticket').count()==1 and p.locator('.ft-art--clock').count()==1
 p.locator('[data-time-stop="0"]').click();p.wait_for_function("document.querySelector('.ft-lift-page').dataset.phase==='ready'")
 p.locator('#ftDoor').click();assert p.locator('#ftAnswer').input_value()=='My lift answer.'
 assert p.locator('#ftAnswers').is_visible()
 p.reload();p.evaluate("go('gram');spOpen('future_lift')");assert p.locator('#ftAnswer').input_value()=='My lift answer.'
 # Real-motion doors must close, move, arrive closed and require a user opening.
 p.emulate_media(reduced_motion='no-preference');p.locator('#ftNext').click()
 assert p.locator('#ftDoor').is_disabled()
 p.wait_for_function("document.querySelector('.ft-lift-page').dataset.phase==='moving'")
 assert p.locator('#ftCab').evaluate("e=>getComputedStyle(e).animationName")=='ft-cab-travel'
 p.wait_for_function("document.querySelector('.ft-lift-page').dataset.phase==='ready'")
 assert p.locator('#ftDoor').is_enabled();assert not p.locator('#ftCab').evaluate("e=>e.classList.contains('open')")
 p.locator('#ftDoor').click();p.wait_for_timeout(700);p.screenshot(path='/tmp/future-time-lift-desktop.png',full_page=True)
 # Actual lift audio runs through the existing sound preference and user gesture.
 p.evaluate("window.__liftSounds=[];window.__baseSfx=sfx;sfx=function(name){__liftSounds.push(name);__baseSfx(name)};S.snd=true")
 p.locator('#ftNext').click();p.wait_for_function("document.querySelector('.ft-lift-page').dataset.phase==='ready'")
 p.locator('#ftDoor').click()
 assert p.evaluate("['door','hum','floor','ding'].every(n=>__liftSounds.includes(n))")
 assert p.evaluate("AC.state==='running'")
 p.evaluate("S.snd=false;sfx=__baseSfx")
 # Stop timers on navigation; opening another screen must not be replaced later.
 p.locator('#ftNext').click();p.evaluate("go('home')");p.wait_for_timeout(1900);assert p.locator('.stw-home').is_visible()
 p.emulate_media(reduced_motion='reduce')
 for width in [1440,768,390,320]:
  p.set_viewport_size({'width':width,'height':1000})
  for route in ['future_lift','future_print_mix']:
   p.evaluate("route=>{go('gram');spOpen(route)}",route)
   if route=='future_lift':
    if not p.locator('#ftAnswer').count():p.locator('#ftDoor').click()
   else:
    p.locator('#ftPrint').click();p.wait_for_function("document.querySelector('.ft-printer-page').dataset.phase==='ready'")
   assert p.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,route)
   p.screenshot(path=f'/tmp/{route}-{width}.png',full_page=True)
 # The document printer uses the supplied decoded MP3 and stops on exit.
 p.set_viewport_size({'width':1440,'height':1080});p.emulate_media(reduced_motion='no-preference')
 p.evaluate("delete S.futureDocumentRuns.continuous;S.snd=true;spOpen('future_print_continuous')")
 p.wait_for_function("__timeAudio.at(-1).readyState>=3")
 p.locator('#ftPrint').click();p.wait_for_function("__timeAudio.at(-1).currentTime>.02&&!__timeAudio.at(-1).paused")
 assert p.locator('#ftPrint').is_disabled()
 p.locator('#sndbtn').click();assert p.evaluate("__timeAudio.at(-1).muted")
 p.evaluate("go('home')");assert p.evaluate("__timeAudio.at(-1).paused&&__timeAudio.at(-1).currentTime===0")
 p.emulate_media(reduced_motion='reduce')
 # New Kids palettes and text/background contrast for every catalog colour.
 for level in ['kids','a1','a2']:
  p.evaluate("level=>{go('gram');S.glevel=level;glSetup()}",level)
  assert p.evaluate("LevelDesign.current().cards.includes('#16277F')")
  assert p.evaluate('''()=>{const linear=v=>(v/=255)<=.04045?v/12.92:((v+.055)/1.055)**2.4;const lum=c=>{const [r,g,b]=c.match(/[\\d.]+/g).slice(0,3).map(Number).map(linear);return .2126*r+.7152*g+.0722*b};return [...document.querySelectorAll('.grammar-topic')].every(e=>{const s=getComputedStyle(e),a=lum(s.color),b=lum(s.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5})}'''),level
 p.set_viewport_size({'width':1440,'height':1080});p.evaluate("go('gram');S.splevel='kids';spOpen('be')")
 p.screenshot(path='/tmp/new-kids-colours.png',full_page=True)
 assert not errors,errors;assert not missing,missing
 print('PASS: 30 documents, four seven-item printers, balanced mix, hints/models/drafts, reload, time lift doors/motion/cancellation, four widths, Kids/A1/A2 colour contrast; no missing assets or JS errors')
 b.close()
server.shutdown()
