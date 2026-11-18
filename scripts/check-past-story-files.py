from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
s=ThreadingHTTPServer(('127.0.0.1',0),partial(Q,directory=str(Path(__file__).resolve().parents[1])));Thread(target=s.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1000});errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.goto(f'http://127.0.0.1:{s.server_port}/');p.wait_for_function('!!window.PastStoryFiles')
 for level in ['b1','b2']:
  p.evaluate("l=>{go('gram');S.glevel=l;S.splevel=l;spOpen('past_story_files')}",level)
  assert p.locator('[data-past-file]').count()==5
  assert p.evaluate("l=>SPGRP[l].some(g=>g[1].includes('past_story_files'))",level)
  assert p.evaluate("l=>{const c=COURSES.find(c=>c.id===(l==='b1'?'b1':'b2alh'));const w=c.units.flatMap(u=>u.ls.flatMap(l=>l.v));return PastStoryFiles.stories.every(s=>s.words[l].every(v=>w.includes(v)))}",level)
  for id in ['dog','farewell','proposal','gift','santa']:
   p.evaluate('id=>PastStoryFiles.open(id)',id)
   for i in range(7):
    assert p.locator('[data-past-item]').count()==[4,4,6,6,8,8,8][i]
    assert p.locator('[data-past-item="6"]').count()==(0 if i<4 else 1)
    assert p.locator('#psModels').is_hidden();assert p.locator('#psHintText').is_hidden()
    p.locator('#psAnswer').fill(f'{level} {id} {i}');p.locator('#psHint').click();p.locator('#psShow').click();assert p.locator('#psModels').is_visible()
    if i<6:p.locator('#psNext').click()
   p.locator('#psPrev').click();assert p.locator('#psAnswer').input_value()==f'{level} {id} 5'
  p.set_viewport_size({'width':390,'height':844});p.wait_for_timeout(100);assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
  p.screenshot(path='/tmp/past-story-'+level+'.png',full_page=True)
  p.set_viewport_size({'width':1440,'height':1000})
 p.reload();p.evaluate("S.splevel='b1';PastStoryFiles.open('dog')");assert p.locator('#psAnswer').input_value()=='b1 dog 5'
 assert not errors,errors
 print('PASS: five files × two levels, gradual clue reveals, all guided steps/final stories, course vocabulary, saved drafts, reveals, mobile and registrations.')
 b.close()
