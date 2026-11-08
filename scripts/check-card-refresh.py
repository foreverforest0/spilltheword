"""Check shared hints, straight card labels, coin scenes and section heading waves."""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
from pathlib import Path
from playwright.sync_api import sync_playwright
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
root=Path(__file__).resolve().parents[1]
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)))
Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 p=b.new_page(viewport={'width':1365,'height':1000},reduced_motion='reduce');errors=[]
 p.on('pageerror',lambda e:errors.append(str(e)))
 p.goto(f'http://127.0.0.1:{server.server_port}/')
 p.wait_for_timeout(100)
 assert p.locator('[data-category="grammar"] .stw-wave-letter').count()==7
 assert p.locator('[data-category="vocab"] .stw-wave-letter').count()==10
 p.evaluate("go('gram')");p.locator('[data-catalog-level="a1"]').click();p.wait_for_timeout(100)
 assert p.locator('.grammar-title .stw-wave-letter').count()==7
 assert p.locator('.grammar-topic .stw-wave-letter').count()==0
 p.evaluate("go('words')");p.wait_for_timeout(80)
 assert p.locator('.vocabulary-title .stw-wave-letter').count()==10
 for task in ['gmj','intv']:
  p.evaluate("id=>{go('gram');S.splevel='a1';spOpen(id)}",task);p.wait_for_timeout(120)
  assert p.locator('#cbsharedhint').count()==1
  assert p.locator('#cbsharedhint').bounding_box()['x']<p.locator('#cbnew').bounding_box()['x']
  assert p.locator('#cboard #cbhint').count()==0
  if task=='gmj':
   assert all('I am' in t for t in p.locator('.stw-board-card .cbt').all_text_contents())
  else:
   assert p.locator('.stw-board-card .stw-prompt-copy').count()==0
  p.locator('.cbc').first.click();p.wait_for_timeout(500)
  if task=='intv':
   assert p.locator('.interview-answers li').count()==5
   assert '?' not in p.locator('.interview-answers').inner_text()
  p.locator('#cbsharedhint').click();assert p.locator('#cbsharedh').is_visible()
  if task=='intv': assert '?' in p.locator('#cbsharedh').inner_text()
  p.screenshot(path=f'/tmp/card-refresh-{task}.png',full_page=True)
  p.locator('.cbc.flipped').click(position={'x':15,'y':15});assert p.locator('.cbc.flipped').count()==0
 p.evaluate("go('gram');S.splevel='kids';spOpen('mgc')");p.wait_for_timeout(150)
 assert p.locator('.b1-magnet-picture .mgpic').bounding_box()['width']>=280
 p.screenshot(path='/tmp/card-refresh-kids-fridge.png',full_page=True)
 for width in [1365,390]:
  p.set_viewport_size({'width':width,'height':1000 if width>600 else 844})
  p.evaluate("go('gram');S.splevel='a1';spOpen('scp')");p.wait_for_timeout(100)
  assert p.locator('.scene-photo').count()==0
  p.locator('.scene-coin').click();p.wait_for_selector('.scene-photo')
  assert p.locator('.scene-photo').count()==1
  assert p.locator('.scene-question-copy').count()==0
  src=p.locator('.scene-photo-toggle>img').get_attribute('src')
  p.locator('.scene-photo-toggle').click()
  assert p.locator('.scene-question-copy').count()==1
  assert p.locator('[data-scene-question]').count()==5
  questions=[]
  for i in range(5):
   p.locator(f'[data-scene-question="{i}"]').click()
   questions.append(p.locator('.scene-question').inner_text())
   assert p.locator('.scene-photo .mgbase').get_attribute('src')==src
  assert len(set(questions))==5
  p.locator('#sceneHint').click();assert p.locator('#sceneHintText').is_visible()
  r=p.locator('.scene-photo-toggle').bounding_box();p.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);p.wait_for_timeout(80)
  assert p.locator('.mglens').evaluate("e=>+getComputedStyle(e).opacity")>0
  p.screenshot(path=f'/tmp/card-refresh-scenes-{width}.png',full_page=True)
  assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
  p.locator('.scene-photo-toggle').click();assert p.locator('.scene-question-copy').count()==0
  p.locator('#sceneNew').click();assert p.locator('.scene-photo').count()==0
  p.locator('.scene-coin').click();p.wait_for_selector('.scene-photo')
  assert p.locator('.scene-photo-toggle>img').get_attribute('src')!=src
 assert not errors,errors
 print('Passed: section waves, straight labels, shared hints, interview answers, enlarged fridge picture, coin print, one scene/five questions, magnifier and mobile.')
 b.close()
server.shutdown()
