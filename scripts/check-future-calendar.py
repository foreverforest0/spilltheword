"""Week geometry, course data, modes, manual selection, strikethrough and routing."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(Q,directory=str(ROOT)));Thread(target=srv.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1600,'height':1100},reduced_motion='reduce');errors=[];missing=[]
 p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.status>=400 and 'favicon' not in r.url else None);p.goto(f'http://127.0.0.1:{srv.server_port}/')
 assert p.evaluate('''Object.entries(FutureCalendarData).every(([lv,d])=>{const c=COURSES.find(c=>c.id===d.course),v=c.units.flatMap(u=>u.ls.flatMap(l=>l.v));return d.events.length===14&&new Set(d.events.map(e=>e.day)).size===7&&d.events.every(e=>e.start>=8&&e.end<=21&&e.end>e.start&&v.includes(e.vocab.word))})''')
 for lv in ['b1','b2']:
  p.evaluate("lv=>{go('gram');S.glevel=lv;S.splevel=lv;spOpen('future_basic')}",lv)
  assert p.locator('[data-future-task]').count()==3
  p.locator('[data-future-task="calendar"]').click()
  assert p.locator('.fwc-day-name').count()==7;assert p.locator('.fwc-event').count()==14
  assert p.locator('.fwc-grid').evaluate('e=>e.scrollWidth<=e.parentElement.clientWidth+1')
  assert p.locator('.fwc-question').is_visible();assert p.locator('#fwcModels').is_hidden()
  p.wait_for_function("document.querySelector('.fwc-page').dataset.annotation")
  assert p.locator('.rough-annotation path').count()>0
  assert p.locator('body').get_attribute('data-study-level')==lv
  p.locator('#fwcMode').select_option('free');assert p.locator('[data-calendar-event][aria-pressed="true"]').count()==0
  assert p.locator('#fwcAnswer').count()==0;assert p.locator('.rough-annotation').count()==0
  p.locator('[data-calendar-event]').first.click();assert p.locator('#fwcAnswer').is_visible();assert p.locator('.fwc-question').count()==0
  p.locator('#fwcAnswer').fill(lv+' positive draft');p.locator('#fwcShow').click();assert p.locator('#fwcModels p').count()==5
  p.locator('#fwcStrike').click();assert p.locator('#fwcAnswer').input_value()=='';assert p.locator('#fwcModels').is_hidden()
  p.locator('#fwcAnswer').fill(lv+' negative draft');p.locator('#fwcShow').click();assert 'not' in p.locator('#fwcModels').inner_text()
  p.locator('#fwcStrike').click();assert p.locator('#fwcAnswer').input_value()==lv+' positive draft'
  p.locator('#fwcStrike').click();assert p.locator('#fwcAnswer').input_value()==lv+' negative draft'
  p.locator('[data-calendar-event]').nth(3).click();p.locator('[data-calendar-event]').first.click();assert p.locator('#fwcAnswer').input_value()==lv+' negative draft'
  for focus in ['going','arrangement','continuous','perfect','perfectcontinuous','mix']:
   p.locator('#fwcFocus').select_option(focus);p.locator('#fwcMode').select_option('questions')
   assert p.locator('.fwc-question').is_visible();assert p.locator('#fwcModels').is_hidden()
   p.locator('#fwcHint').click();assert p.locator('#fwcHintText').is_visible()
   p.locator('#fwcShow').click();assert p.locator('#fwcModels').is_visible()
   if focus=='mix':assert p.evaluate("lv=>new Set(S.futureCalendars[lv].runs['questions:mix'].deck.map(r=>r.kind)).size",lv)==5
   p.locator('#fwcNext').click();assert p.locator('#fwcHintText').is_hidden()
  p.locator('#fwcMode').select_option('free');p.locator('#fwcFocus').select_option('continuous');p.locator('[data-calendar-event]').nth(4).click();p.locator('#fwcAnswer').fill(lv+' saved input')
  p.wait_for_timeout(100);p.screenshot(path='/tmp/calendar-'+lv+'-desktop.png',full_page=True)
  p.reload();p.evaluate("lv=>{S.glevel=lv;spOpen('future_calendar')}",lv);assert p.locator('#fwcAnswer').input_value()==lv+' saved input'
  p.set_viewport_size({'width':390,'height':844});assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
  p.locator('.fwc-scroll').evaluate('e=>e.scrollLeft=e.scrollWidth');assert p.locator('.fwc-scroll').evaluate('e=>e.scrollLeft>0')
  p.wait_for_timeout(100);p.screenshot(path='/tmp/calendar-'+lv+'-mobile.png',full_page=True);p.set_viewport_size({'width':1600,'height':1100})
  p.evaluate("spOpen('future_printer')");assert p.locator('#ftMode option').evaluate_all('els=>els.map(e=>e.value)')==['will','timetable','mix']
  p.evaluate("S.snd=false");p.locator('#ftPrint').click();p.wait_for_function("document.querySelector('.ft-printer-page').dataset.phase==='ready'")
  assert p.evaluate("lv=>S.futurePrinterRuns[lv+':mix'].deck.every(id=>/-(will|timetable)-/.test(id))",lv)
  p.evaluate("spOpen('future_print_perfect')");assert p.locator('.fwc-page').is_visible();assert p.locator('#fwcFocus').input_value()=='perfect'
 # Normal motion draws the actual pencil animation; reduce remains readable.
 p.evaluate("S.glevel='b1';spOpen('future_calendar')");p.emulate_media(reduced_motion='no-preference')
 if p.locator('#fwcMode').input_value()!='free':p.locator('#fwcMode').select_option('free')
 p.locator('[data-calendar-event]').nth(10).click()
 assert p.locator('.rough-annotation path').evaluate_all("els=>els.some(e=>e.style.animation.includes('rough-notation'))")
 p.wait_for_timeout(650)
 p.evaluate("go('home')");assert p.locator('.fwc-page,.rough-annotation').count()==0
 # Lower-level going-to practice must stay in its original room.
 p.evaluate("S.glevel='a1';S.splevel='a1';spOpen('future_going')");assert p.locator('.future-exercise').is_visible()
 assert not errors,errors;assert not missing,missing
 print('PASS: 7-day schedule, 14 events/level, course words, five tense modes + Mix, manual free selection, marks/drafts/reveals, reload, level colours, mobile scroll, restricted printer and legacy routes.')
 b.close()
