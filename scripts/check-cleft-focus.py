"""Course vocabulary, sequential emphasis and actual Rough Notation rendering."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1050},reduced_motion='reduce');errors=[];missing=[]
 p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.url.startswith(f'http://127.0.0.1:{server.server_port}/') and r.status>=400 and 'favicon' not in r.url else None)
 p.goto(f'http://127.0.0.1:{server.server_port}/')
 assert p.evaluate("(()=>{const c=COURSES.find(c=>c.id===CleftFocusData.course),v=new Set(c.units.flatMap(u=>u.ls.flatMap(l=>l.v)));return CleftFocus.rows.every(r=>r.vocabulary.every(w=>v.has(w))&&r.focus.length>=2&&r.focus.every(f=>r.sentence.includes(f.phrase)&&f.answers.length&&f.starters.length))})()")
 for level in ['b2','c1']:
  p.evaluate("level=>{go('gram');S.glevel=level;S.splevel=level;glSetup()}",level)
  p.locator('[data-grammar-topic]').filter(has_text='Cleft sentences').click();p.locator('[data-grammar-exercise="cleft_focus"]').click()
  assert p.locator('.cf-page').is_visible()
 p.evaluate("S.snd=false;S.cleftFocus=null;spOpen('cleft_focus')")
 styles=set();count=0
 for ri in range(8):
  sentence=p.locator('.cf-sentence').text_content().replace('\xa0',' ');rowid=p.locator('.cf-page').get_attribute('data-cleft-row')
  foci=p.evaluate("id=>CleftFocus.rows.find(r=>r.id===id).focus.length",rowid)
  for fi in range(foci):
   p.wait_for_function("document.querySelector('.cf-paper').dataset.annotation")
   styles.add(p.locator('.cf-paper').get_attribute('data-annotation'))
   assert p.locator('.cf-sentence').text_content().replace('\xa0',' ')==sentence
   assert p.locator('#cfMarked').inner_text()
   assert p.locator('.rough-annotation').count()==1
   assert p.locator('.rough-annotation path').count()>0
   assert p.locator('#cfStarters').is_hidden() and p.locator('#cfAnswers').is_hidden()
   assert p.locator('.cf-page input,.cf-page textarea').count()==0
   p.locator('#cfHint').click();assert p.locator('#cfStarters li').count()>=1
   p.locator('#cfShow').click();assert p.locator('#cfAnswers').is_visible()
   p.locator('#cfNext').click();count+=1
 assert count==23 and styles=={'underline','circle','box','bracket','highlight'}
 # A new round starts after all accents; Back restores the previous reveal.
 assert p.locator('.cf-page').get_attribute('data-cleft-focus')=='0'
 p.locator('#cfShow').click();p.locator('#cfNext').click();assert p.locator('#cfAnswers').is_hidden()
 p.locator('#cfPrevious').click();assert p.locator('#cfAnswers').is_visible()
 before=p.locator('#cfMarked').inner_text();p.reload();p.evaluate("go('gram');spOpen('cleft_focus')");assert p.locator('#cfMarked').inner_text()==before;assert p.locator('#cfAnswers').is_visible()
 # Every phrase/type on a narrow screen keeps all text and a single real SVG.
 for width in [1440,768,390,320]:
  p.set_viewport_size({'width':width,'height':1050})
  for i in range(5):
   p.evaluate("i=>{S.cleftFocus={version:1,order:CleftFocus.rows.map(r=>r.id),sentence:i,focus:0,shown:{}};spOpen('cleft_focus')}",i)
   p.wait_for_function("document.querySelector('.cf-paper').dataset.annotation")
   assert p.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,i)
   assert p.locator('.rough-annotation').count()==1
  p.screenshot(path=f'/tmp/cleft-focus-{width}.png',full_page=True)
 p.emulate_media(reduced_motion='no-preference');p.evaluate("spOpen('cleft_focus')");p.wait_for_function("document.querySelector('.cf-paper').dataset.annotation")
 assert p.locator('.rough-annotation').count()==1
 p.evaluate("go('home')");p.wait_for_timeout(200);assert p.locator('.rough-annotation').count()==0
 assert not errors,errors;assert not missing,missing
 print('PASS: 8 original ALH-based sentences, 23 accents, five Rough Notation styles, oral mode, contextual starters/models, sequential focus, saved progress/reveals, clean disposal and four viewport widths')
 b.close()
server.shutdown()
