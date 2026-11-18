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
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1000});errors=[];missing=[];p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.status>=400 and 'favicon' not in r.url else None);p.goto(f'http://127.0.0.1:{srv.server_port}/')
 for level in ['b1','b2']:
  p.evaluate("l=>{go('gram');S.glevel=l;S.splevel=l;spOpen(l==='b1'?'film_b1_4':'film_b2_conditionals')}",level)
  modes=p.locator('#cvMode option').evaluate_all('els=>els.map(e=>e.value)');assert modes==(['zero','first','second','mix'] if level=='b1' else ['zero','first','second','third','mixed','mix'])
  for mode in modes:
   p.locator(f'.cv-page .pgrp [data-v="{mode}"]').click()
   deck=p.evaluate("([l,m])=>S.conditionalVideo[l+':'+m].deck",[level,mode]);assert len(deck)==5
   if mode=='mix':assert p.evaluate("([l,deck])=>new Set(deck.map(id=>ConditionalVideo.rows.find(r=>r.id===id).type)).size",[level,deck])==(3 if level=='b1' else 5)
   for i in range(5):
    assert p.locator('#cvModels').is_hidden();assert p.locator('#cvHintText').is_hidden()
    assert not any(w in p.locator('.bv-prompt').inner_text() for w in ['Begin','Start with','If I'])
    p.locator('#cvAnswer').fill(level+mode+str(i));p.locator('#cvShow').click();assert p.locator('#cvModels').is_visible()
    if i<4:p.locator('#cvNext').click()
   p.locator('#cvPrev').click();assert p.locator('#cvAnswer').input_value()==level+mode+'3'
  p.set_viewport_size({'width':390,'height':844});assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1');p.screenshot(path='/tmp/conditional-video-'+level+'.png',full_page=True);p.set_viewport_size({'width':1440,'height':1000})
 # Lift assets and facts are level-specific, grammatical and clock-free.
 assert p.evaluate("Object.values(FutureLevelData).every(d=>d.lift.every(r=>!r.art&&!r.extraArt&&!/Sam: work|complete by/.test(r.facts.join(' ')+r.prompt)))")
 assert p.evaluate("Object.values(FutureLevelData).every(d=>new Set(d.lift.map(r=>r.personImage)).size===3)")
 for level in ['b1','b2']:
  p.evaluate("l=>{S.glevel=l;spOpen('future_lift')}",level);p.locator('#ftDoor').click();assert p.locator('#ftPerson').evaluate('e=>e.complete&&e.naturalWidth>0');assert p.locator('.ft-object-image').count()==1
  p.screenshot(path='/tmp/future-lift-revised-'+level+'.png',full_page=True)
 assert not errors,errors;assert not missing,missing
 print('PASS: conditional modes and Mix, five distinct scenes each, semantic prompts, independent drafts/models, mobile; varied lift people/objects, grammar and loaded assets.')
 b.close()
