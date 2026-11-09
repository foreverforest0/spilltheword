"""Question pond: 66 topic routes, answer matching, drawing, motion, persistence and mobile."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright
import json
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 p=browser.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');errors=[];missing=[]
 p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.status>=400 else None)
 p.goto(base)
 p.wait_for_function('window.QuestionPond&&QuestionPond.topics.length===66')
 report=p.evaluate('''()=>{
  const fail=m=>{throw Error(m)},topics=QuestionPond.topics;
  const registered=Object.values(SPGRP).flat().filter(g=>/^\\d+\\s*·/.test(g[0]));
  if(topics.length!==registered.length)fail('A topic is missing');
  let rows=0;
  for(const t of topics){
   const group=SPGRP[t.level].find(g=>g[0].startsWith(t.number+' ·'));
   if(!group[1].includes(t.id)||!DMTF[t.id]||!SPSHORT[t.id])fail('Missing route '+t.id);
   const bank=QuestionPond.bankFor(t.level,t.number);if(bank.length<4)fail('Small bank '+t.id);
   for(const row of bank){rows++;if(!row.hint||/start(?: with|:)/i.test(row.cue)||/start(?: with|:)/i.test(row.hint))fail('Visible sentence starter');if(!row.question||(!row.cue&&!row.hint)||!row.answers.length)fail('Empty question '+t.id);if(row.answers.some(a=>a.includes('(that)')||a.includes(' / ')))fail('Unexpanded example alternatives');
    for(const answer of row.answers){if(!QuestionPond.matches(answer,row.answers))fail('Canonical answer rejected');if(!QuestionPond.matches(answer.toUpperCase().replace(/[.,?!]/g,''),row.answers))fail('Punctuation matching');}
    if(QuestionPond.matches('banana banana banana',row.answers))fail('False positive');
   }
  }
  for(const [a,b]of [["He’s just arrived.","He has just arrived."],["She isn’t reading.","She is not reading."],["I’d have called.","I would have called."],["He’d already left.","He had already left."],["I can’t swim.","I cannot swim."],["I won’t go.","I will not go."]])if(!QuestionPond.matches(a,[b]))fail('Contraction '+a);
  for(const [a,b]of [['He play football.','He plays football.'],['She is reading.','She was reading.'],['I have a dog.','I had a dog.'],['They is here.','They are here.']])if(QuestionPond.matches(a,[b]))fail('Wrong grammar accepted');
  if(QuestionPond.validDrawing([{color:'javascript:bad',width:.02,points:[.1,.1,.2,.2]}]))fail('Unsafe saved data');
  return {topics:topics.length,questions:rows};
 }''')
 # Reach the game from the real level → topic → exercise catalog.
 def route(level='kids',number=2):
  p.evaluate("lv=>{go('gram');S.glevel=lv;S.splevel=lv;glSetup()}",level)
  key=p.evaluate("([lv,n])=>lv+':'+SPGRP[lv].findIndex(g=>g[0].startsWith(n+' ·'))",[level,number])
  p.locator(f'[data-grammar-topic="{key}"]').click()
  p.locator(f'[data-grammar-exercise="pond_{level}_{number}"]').click()
  p.wait_for_selector('.pond-page')
 def catch():
  # Normal pointer events, not dispatchEvent, exercise the real one-click catch.
  r=p.locator('.pond-fish').first.bounding_box();p.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);p.mouse.click(r['x']+r['width']/2,r['y']+r['height']/2)
  p.wait_for_selector('#pondAnswer')
 def answer():
  return p.evaluate("()=>{const [lv,n]=document.querySelector('.pond-page').dataset.pondTopic.split(':');return QuestionPond.bankFor(lv,+n)[+document.querySelector('.pond-page').dataset.questionIndex].answers[0]}")
 def draw():
  cv=p.locator('#pondCanvas');cv.scroll_into_view_if_needed();r=cv.bounding_box()
  points=[(.14,.5),(.45,.2),(.85,.42),(.92,.5),(.85,.58),(.45,.8),(.14,.5),(.07,.25),(.07,.75),(.14,.5)]
  x,y=points[0];p.mouse.move(r['x']+r['width']*x,r['y']+r['height']*y);p.mouse.down()
  for x,y in points[1:]:p.mouse.move(r['x']+r['width']*x,r['y']+r['height']*y,steps=6)
  p.mouse.up()
 route();assert p.locator('#pondWater').bounding_box()['width']>850;assert p.locator('.pond-header h1').is_visible();assert p.locator('.pond-header .stw-wave-word').count()==2
 assert p.locator('.pond-fish').count()==6
 assert p.locator('#pondHelp').is_hidden();p.locator('#pondHow').click();assert p.locator('#pondHelp').is_visible()
 assert p.locator('#pondHelp').bounding_box()['y']+p.locator('#pondHelp').bounding_box()['height']<=p.locator('#pondWater').bounding_box()['y']
 p.locator('#pondHow').click();seen=set()
 for _ in range(6):
  catch();assert p.locator('#pondHintText').is_hidden();p.locator('#pondHint').click();assert p.locator('#pondHintText').is_visible();p.locator('#pondHint').click();assert p.locator('#pondHintText').is_hidden();idx=p.locator('.pond-page').get_attribute('data-question-index');assert idx not in seen;seen.add(idx)
  p.locator('#pondAnswer').fill('He banana.');p.locator('#pondCheck').click();assert p.locator('.pond-page').get_attribute('data-outcome')=='incorrect'
  p.locator('#pondShowAnswer').click();assert p.locator('#pondFeedback').inner_text()==answer()
  p.locator('#pondAnswer').fill(answer());p.locator('#pondCheck').click();assert p.locator('.pond-page').get_attribute('data-phase')=='answered'
  p.locator('#pondReturn').click();p.wait_for_function("document.querySelector('.pond-page').dataset.phase==='idle'");assert p.locator('.pond-fish:disabled').count()==0
 # Keyboard access; focus pauses fish in addition to pointer hover.
 p.locator('.pond-fish').nth(1).focus();p.keyboard.press('Enter');p.wait_for_selector('#pondAnswer');p.locator('#pondReturn').click();p.wait_for_function("document.querySelector('.pond-page').dataset.phase==='idle'")
 p.locator('#pondDrawMode').click();catch();p.locator('#pondStartDrawing').click();assert p.locator('#pondStudio').is_hidden()
 p.locator('#pondAnswer').fill('Not an answer.');p.locator('#pondStartDrawing').click();assert p.locator('#pondCanvas').is_visible()
 p.locator('#pondRelease').click();assert 'Draw a little fish' in p.locator('#pondFeedback').inner_text()
 draw();p.locator('#pondRelease').click();p.wait_for_function("document.querySelector('.pond-page').dataset.phase==='question'")
 assert p.locator('.pond-own-fish').count()==0 and p.locator('#pondCanvas').is_visible()
 assert p.evaluate("JSON.parse(localStorage.getItem('stw-question-pond-v1')||'[]').length") == 0
 p.locator('#pondAnswer').fill(answer());p.locator('#pondRelease').click();p.wait_for_function("document.querySelector('.pond-page').dataset.phase==='answered'")
 assert p.locator('.pond-own-fish').count()==1
 assert p.evaluate("JSON.parse(localStorage.getItem('stw-question-pond-v1')).length")==1
 p.screenshot(path='/tmp/question-pond-drawing-desktop.png',full_page=True)
 # Saved fish return only in their own topic; reload doesn't duplicate house fish.
 p.reload();route();assert p.locator('.pond-own-fish').count()==1
 route('a1',3);assert p.locator('.pond-own-fish').count()==0
 # Every actual grammar topic has an opening route and a nonempty, topic-specific question.
 topics=p.evaluate('QuestionPond.topics')
 for t in topics:
  p.evaluate('id=>spOpen(id)',t['id']);assert p.locator('.pond-page').get_attribute('data-pond-topic')==f"{t['level']}:{t['number']}"
  catch();assert p.locator('.pond-question-text').inner_text()
 # Exit while the catch timer is in flight: detached views must never be updated.
 route();r=p.locator('.pond-fish').first.bounding_box();p.mouse.click(r['x']+r['width']/2,r['y']+r['height']/2);p.evaluate("go('home')");p.wait_for_timeout(90);assert p.locator('.pond-page').count()==0
 # Actual motion, a mouse hover pause, release and jump keyframes.
 p.emulate_media(reduced_motion='no-preference');route()
 f=p.locator('.pond-fish').first;p.mouse.move(5,5);x=f.bounding_box()['x'];p.wait_for_timeout(240);assert f.bounding_box()['x']!=x
 r=f.bounding_box();p.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);x=f.bounding_box()['x'];p.wait_for_timeout(220);assert abs(f.bounding_box()['x']-x)<1
 p.locator('#pondDrawMode').click()
 r=f.bounding_box();start_y=r['y'];p.mouse.click(r['x']+r['width']/2,r['y']+r['height']/2);p.wait_for_timeout(180)
 assert p.locator('#pondRig').is_visible();first_path=p.locator('#pondLine').get_attribute('d');p.wait_for_timeout(460)
 assert p.locator('#pondLine').get_attribute('d')!=first_path and f.bounding_box()['y']<start_y
 p.wait_for_selector('#pondAnswer');assert p.locator('.pond-fish.caught.in-card').count()==1 and p.locator('.pond-caught-preview').is_visible() and p.locator('#pondRig').is_hidden()
 p.locator('#pondAnswer').fill('Incorrect.');p.locator('#pondStartDrawing').click();draw();p.locator('#pondRelease').click();assert p.locator('.pond-own-fish.jumped').count()==1
 assert p.locator('.pond-own-fish.jumped .pond-fish-art').evaluate("e=>getComputedStyle(e).animationName")=='pond-jump'
 p.locator('#pondReturn').click();assert p.locator('.pond-page').get_attribute('data-phase')=='releasing'
 p.wait_for_function("document.querySelector('.pond-page').dataset.phase==='question'")
 p.locator('#pondAnswer').fill(answer());p.locator('#pondRelease').click();assert p.locator('.pond-own-fish.released').count()==1
 p.wait_for_function("document.querySelector('.pond-page').dataset.phase==='answered'");p.locator('#pondReturn').click();p.wait_for_function("document.querySelector('.pond-page').dataset.phase==='idle'")
 p.screenshot(path='/tmp/question-pond-desktop.png',full_page=True)
 # Responsive layouts, no page overflow, question doesn't cover the pond.
 p.emulate_media(reduced_motion='reduce')
 for w in [768,390]:
  p.set_viewport_size({'width':w,'height':844});route('b1',1);catch();assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
  a=p.locator('#pondWater').bounding_box();c=p.locator('#pondQuestion').bounding_box()
  assert a['x']+a['width']<=c['x'] or a['y']+a['height']<=c['y']
  p.locator('#pondDrawMode').click();p.locator('#pondAnswer').fill(answer());p.locator('#pondStartDrawing').click();draw();assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
  if w==390:
   assert p.locator('#homeBtn').evaluate("e=>getComputedStyle(e).position")=="absolute"
   p.screenshot(path='/tmp/question-pond-mobile.png',full_page=True)
 # Corrupt local data is discarded. Storage errors don't prevent correct release.
 other=browser.new_page(viewport={'width':1200,'height':950},reduced_motion='reduce');other.on('pageerror',lambda e:errors.append(str(e)))
 other.add_init_script("localStorage.setItem('stw-question-pond-v1','[{\"topic\":\"kids:2\",\"strokes\":[{\"color\":\"bad\"}]}]');const oldSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='stw-question-pond-v1')throw new DOMException('Full','QuotaExceededError');return oldSet.call(this,k,v)}")
 other.goto(base);other.evaluate("go('gram');spOpen('pond_kids_2')");assert other.locator('.pond-own-fish').count()==0
 # Re-use real pointer functions with this page, then restore.
 saved_page=p;p=other;p.locator('#pondDrawMode').click();catch();p.locator('#pondAnswer').fill(answer());p.locator('#pondStartDrawing').click();draw();p.locator('#pondRelease').click();p.wait_for_function("document.querySelector('.pond-page').dataset.phase==='answered'");assert 'could not save' in p.locator('#pondFeedback').inner_text();p=saved_page
 assert not errors,errors
 assert not missing,missing
 print('PASS',json.dumps(report),'— catalog, real mouse/keyboard, six unique rounds, wrong/correct answers, empty drawing, retry without redraw, leap/swim animations, hover pause, local persistence, all 66 routes, cleanup, storage failures and responsive layouts.')
 browser.close()
server.shutdown()
