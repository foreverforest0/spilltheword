"""Course-specific future printer and lift: modes, progress, doors, sound and layout."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 p=b.new_page(viewport={'width':1440,'height':1080},reduced_motion='reduce');errors=[]
 p.on('pageerror',lambda e:errors.append(str(e)))
 p.add_init_script('''(()=>{const Native=window.Audio;window.__audios=[];window.Audio=function(...args){const a=new Native(...args);a.__plays=0;const play=a.play.bind(a);a.play=()=>{a.__plays++;return play()};window.__audios.push(a);return a}})()''')
 p.goto(f'http://127.0.0.1:{server.server_port}/')
 p.wait_for_function('!!window.FutureLevelData && !!window.FutureTime')
 # Each authored task really links to a word in that level's course.
 assert p.evaluate('''()=>Object.entries(FutureLevelData).every(([level,data])=>{
  const course=COURSES.find(c=>c.id===data.course),words=new Set(course.units.flatMap(u=>u.ls.flatMap(l=>l.v)));
  return Object.values(data.documents).every(rows=>rows.length>=7&&rows.every(r=>words.has(r.vocab.word)&&r.vocab.course===data.course&&r.hint&&r.answers.length&&r.facts.length));
 })''')
 for level in ['b1','b2']:
  p.evaluate("go('gram');S.snd=false")
  p.locator(f'[data-catalog-level="{level}"]').click()
  assert p.locator('[data-future-window]').count()==1
  p.locator('[data-future-window]').click()
  assert p.locator('[data-future-task]').count()==2
  assert p.evaluate('S.splevel')==level
  p.locator('[data-future-task="printer"]').click()
  assert p.locator('#ftMode option').count()==8
  for mode in ['will','going','arrangement','timetable','continuous','perfect','perfectcontinuous','mix']:
   p.locator('#ftMode').select_option(mode)
   for i in range(7):
    p.locator('#ftPrint').click();p.wait_for_function("document.querySelector('.ft-printer-page').dataset.phase==='ready'")
    assert p.locator('#ftProgress').inner_text()==f'{i+1} / 7'
    assert p.locator('#ftAnswers').is_hidden() and p.locator('#ftHintText').is_hidden()
    p.locator('#ftAnswer').fill(f'{level} {mode} {i}')
    p.locator('#ftHint').click();assert p.locator('#ftHintText').is_visible()
    p.locator('#ftShow').click();assert p.locator('#ftAnswers').is_visible()
   assert p.evaluate('''([l,m])=>{const deck=S.futureDocumentRuns[l+':'+m].deck;return new Set(deck).size===7&&deck.every(id=>id.startsWith(l+'-'))}''',[level,mode])
   if mode=='mix':assert p.evaluate("l=>new Set(S.futureDocumentRuns[l+':mix'].deck.map(id=>Object.values(FutureLevelData[l].documents).flat().find(r=>r.id===id).kind)).size===7",level)
   p.locator('[data-document-index="0"]').click();assert p.locator('#ftAnswer').input_value()==f'{level} {mode} 0'
  p.reload();p.evaluate("l=>{S.glevel=l;spOpen('future_printer')}",level)
  assert p.locator('#ftAnswer').input_value()==f'{level} mix 0'
  p.evaluate("spOpen('future_lift')")
  assert p.locator('.ft-stops,[data-time-stop]').count()==0
  assert not p.locator('#ftCab').evaluate("e=>e.classList.contains('open')")
  p.locator('#ftDoor').click();assert p.locator('#ftAnswer').is_visible()
  p.locator('#ftAnswer').fill(level+' saved lift');p.locator('#ftShow').click()
  p.locator('#ftNext').click();p.wait_for_function("document.querySelector('.ft-lift-page').dataset.phase==='ready'")
  assert p.locator('#ftAnswer').count()==0
  assert not p.locator('#ftCab').evaluate("e=>e.classList.contains('open')")
  p.locator('#ftDoor').click();assert p.locator('#ftAnswers').is_hidden()
  p.screenshot(path=f'/tmp/future-{level}-lift.png',full_page=True)
 # Re-entering closes the doors while preserving each level's answers.
 p.evaluate("S.glevel='b1';spOpen('future_lift')")
 assert p.evaluate("S.futureLiftRuns.b1.answers[0]")=='b1 saved lift'
 assert p.evaluate("S.futureLiftRuns.b2.answers[0]")=='b2 saved lift'
 # Playback only on deliberate opening, mute and navigation stop it.
 p.evaluate('S.snd=true');p.locator('#ftDoor').click()
 assert p.evaluate("__audios.filter(a=>a.src.endsWith('/time-lift.mp3')).at(-1).__plays")==1
 p.evaluate('S.snd=false');p.locator('#ftDoor').click();p.locator('#ftDoor').click()
 assert p.evaluate("__audios.filter(a=>a.src.endsWith('/time-lift.mp3')).at(-1).__plays")==1
 p.emulate_media(reduced_motion='no-preference');p.locator('#ftNext').click()
 assert p.locator('#ftDoor').is_disabled()
 p.wait_for_function("document.querySelector('.ft-lift-page').dataset.phase==='moving'")
 assert p.locator('#ftCab').evaluate('e=>getComputedStyle(e).animationName')=='ft-cab-travel'
 p.wait_for_function("document.querySelector('.ft-lift-page').dataset.phase==='ready'")
 assert not p.locator('#ftCab').evaluate("e=>e.classList.contains('open')")
 p.emulate_media(reduced_motion='reduce');p.set_viewport_size({'width':390,'height':844})
 p.locator('#ftDoor').click();assert p.locator('#ftAnswer').is_visible()
 assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
 p.screenshot(path='/tmp/future-lift-mobile.png',full_page=True)
 p.evaluate("spOpen('future_printer')")
 assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
 p.screenshot(path='/tmp/future-printer-mobile.png',full_page=True)
 assert not errors,errors
 b.close()
print('PASS: 112 printed tasks; all seven modes + mix; separate course/progress; manual doors; uploaded audio; mobile layout.')
