"""Two future rooms, authored banks, seven-ticket printing, persistence and modes."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from functools import partial
from threading import Thread
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1050},reduced_motion='reduce');errors=[];missing=[]
 p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.status>=400 and r.url.startswith(base) and 'favicon' not in r.url else None);p.goto(base)
 p.evaluate("go('gram')");assert p.locator('[data-future-window]').count()==2
 p.locator('[data-future-window="basic"]').click();assert p.locator('[data-future-task]').count()==3
 p.locator('[data-future-task="timetable"]').click();assert p.locator('.timetable-page').is_visible();assert p.locator('.tt-ticket').count()==0
 p.locator('#ttHow').click();assert 'dates and times are created for practice' in p.locator('#ttHelp').inner_text()
 for index in range(7):
  p.locator('#ttPrint').click();p.wait_for_function("document.querySelector('.timetable-page').dataset.phase==='ready'")
  assert p.locator('.tt-progress').inner_text()==f'{index+1} / 7'
  assert p.locator('.tt-ticket').count()==1
  assert p.locator('.tt-ticket-time strong').inner_text()
  p.locator('#ttAnswer').fill(f'My answer {index+1}.');p.locator('#ttShow').click();assert p.locator('#ttModels').is_visible();assert p.locator('#ttAnswer').input_value()==f'My answer {index+1}.'
 assert p.evaluate('new Set(S.futureTickets.deck.map(x=>x.id)).size===7')
 assert p.evaluate("['cinema','park','museum','train','flight'].every(kind=>S.futureTickets.deck.some(x=>FuturePractice.tickets.find(t=>t.id===x.id).kind===kind))")
 p.locator('[data-ticket-index="0"]').click();assert p.locator('#ttAnswer').input_value()=='My answer 1.';assert p.locator('#ttModels').is_visible()
 p.locator('[data-future-mode="speak"]').click();assert p.locator('#ttAnswer').count()==0
 p.locator('[data-future-mode="write"]').click();assert p.locator('#ttAnswer').input_value()=='My answer 1.'
 p.reload();p.evaluate("go('gram');spOpen('future_timetable')");assert p.locator('#ttAnswer').input_value()=='My answer 1.';assert p.locator('.tt-history-ticket').count()==7
 p.locator('#ttPrint').click();assert 'Complete' in p.locator('.tt-progress').inner_text();p.locator('#ttPrint').click();assert p.locator('.tt-ticket').count()==0
 # Every ticket's actual label, question and model refer to the same time/action.
 assert p.evaluate("FuturePractice.tickets.every(t=>FuturePractice.question(t).includes({starts:'start',finishes:'finish',opens:'open',closes:'close',leaves:'leave',arrives:'arrive',departs:'depart'}[t.verb])&&FuturePractice.models(t).every(a=>a.includes(t.verb+' at ')))")
 for key in ['will','going','continuous','perfect','perfectcontinuous']:
  p.evaluate("key=>spOpen('future_'+key)",key);assert p.locator('.future-context').inner_text();assert p.locator('.future-prompt').inner_text()
  p.locator('[data-future-answer]').fill('My unfinished answer.');p.locator('#futureShow').click();assert p.locator('#futureModels').is_visible()
  p.locator('#futureNext').click();p.locator('#futurePrevious').click();assert p.locator('[data-future-answer]').input_value()=='My unfinished answer.'
  if key in ['will','going']:
   assert p.locator('[data-future-mode]').count()==0
   assert p.locator('#futureHintText').is_hidden()
   p.locator('#futureHint').click();assert p.locator('#futureHintText').is_visible()
   assert p.locator('#futureHint').get_attribute('aria-expanded')=='true'
   assert p.locator('[data-future-answer]').input_value()=='My unfinished answer.'
   p.locator('#futureNext').click();assert p.locator('#futureHintText').is_hidden()
   p.evaluate("key=>{S.futureExercises[key].mode='speak';spOpen('future_'+key)}",key)
   assert p.locator('[data-future-answer]').count()==1
  else:
   p.locator('[data-future-mode="speak"]').click();assert p.locator('[data-future-answer]').count()==0;p.locator('#futureShow').click()
  p.locator('#futureBack').click();assert p.locator('[data-future-task]').count()==(3 if key in ['will','going'] else 8)
 # All ticket designs fit the printer, including long real titles and mobile.
 for width in [1440,768,390,320]:
  p.set_viewport_size({'width':width,'height':1050});p.evaluate("spOpen('future_timetable')");p.locator('#ttPrint').click();p.wait_for_function("document.querySelector('.timetable-page').dataset.phase==='ready'")
  assert p.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
  assert p.locator('.tt-ticket').evaluate('(e)=>e.scrollWidth<=e.clientWidth+1'),width
  p.screenshot(path=f'/tmp/timetable-{width}.png',full_page=True)
 # No second print can enter while the first animation is running.
 p.emulate_media(reduced_motion='no-preference');p.evaluate("S.futureTickets=null;spOpen('future_timetable')");p.locator('#ttPrint').click();assert p.locator('#ttPrint').is_disabled();assert p.evaluate('S.futureTickets.printed')==1;p.wait_for_function("document.querySelector('.timetable-page').dataset.phase==='ready'")
 p.evaluate("go('home')");assert p.locator('.stw-home').is_visible()
 assert not errors,errors;assert not missing,missing
 print('PASS: two rooms, five grammar banks, seven distinct tickets, source labels, models, written/oral modes, reload/review, all four widths and printing lifecycle; no JS errors or missing assets')
 b.close()
server.shutdown()
