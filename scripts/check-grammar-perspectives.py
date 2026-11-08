"""Check reporter negatives, stationary viewpoint changes and real listening audio."""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import json,subprocess
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'assets/basket-audio/manifest.json').read_text())
assert len(manifest)==16
for clip in manifest:
 duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(ROOT/'assets/basket-audio'/clip['file'])]))
 assert .6<duration<6,(clip,duration)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');errors=[];missing=[]
 p.on('pageerror',lambda e:errors.append(str(e)))
 p.on('response',lambda r:missing.append(r.url) if r.status==404 else None)
 base=f'http://127.0.0.1:{server.server_port}/';p.goto(base);p.wait_for_timeout(100)
 for level in ['kids','a1','a2']:
  assert p.evaluate("lv=>SPGRP[lv].find(g=>/^\\d+ · Present Continuous$/.test(g[0]))[1].includes('pcr')",level)
 # Verify an actual catalog route, including the exercise button.
 p.evaluate("go('gram')");p.locator('[data-catalog-level="kids"]').click();p.locator('[data-grammar-topic="kids:3"]').click();p.locator('[data-grammar-exercise="pcr"]').click()
 def task(id):p.evaluate("id=>{go('gram');S.splevel='a1';spOpen(id)}",id);p.wait_for_timeout(80)
 seen=set()
 for i in range(16):
  page=p.locator('.reporter-page');key=page.get_attribute('data-action');subject=page.get_attribute('data-subject');wrong=page.get_attribute('data-wrong');assert key not in seen;seen.add(key)
  assert p.locator('.reporter-card img').count()==1
  p.locator('#reporterAnswer').fill(f'{subject} is {key}.');p.locator('#reporterCheck').click();assert not p.locator('#reporterFeedback').inner_text().startswith('Correct!')
  p.locator('#reporterAnswer').fill(f'{subject} is not {wrong}.');p.locator('#reporterCheck').click();assert p.locator('#reporterFeedback').inner_text().startswith('Now add')
  negative=f'{subject} isn’t {wrong}.' if i%2 else f'{subject} is not {wrong}.'
  positive=f'{subject}’s {key}.' if i%3==0 else f'{subject} is {key}.'
  p.locator('#reporterAnswer').fill(negative+' '+positive);p.locator('#reporterCheck').click();assert p.locator('#reporterFeedback').inner_text().startswith('Correct!'),(key,p.locator('#reporterFeedback').inner_text())
  if i==0:
   p.locator('#reporterHint').click();assert p.locator('#reporterHintText').is_visible();p.screenshot(path='/tmp/reporter-desktop.png',full_page=True)
  if i<15:p.locator('#reporterNew').click()
 task('nof');stage=p.locator('.perspective-stage');assert p.locator('.perspective-object').count()==8
 def object_rects():return p.locator('.perspective-object').evaluate_all('els=>{const board=document.querySelector(".perspective-board").getBoundingClientRect();return els.map(el=>{const r=el.getBoundingClientRect();return [r.x-board.x,r.y-board.y,r.width,r.height]})}')
 positions=object_rects();targets=set();numbers=set()
 for i in range(8):
  target=stage.get_attribute('data-target');assert target not in targets;targets.add(target)
  before_word=stage.get_attribute('data-expected');numbers.add('p' if before_word in ['these','those'] else 's')
  start=p.locator('.observer-marker').bounding_box()['x'];assert p.locator('[data-view-answer]:disabled').count()==4
  p.locator('#viewSwitch').click();after_word=stage.get_attribute('data-expected')
  assert {'this':'that','that':'this','these':'those','those':'these'}[before_word]==after_word
  assert p.locator('.observer-marker').bounding_box()['x']!=start
  assert object_rects()==positions,'The objects must stay still'
  p.locator(f'[data-view-answer="{before_word}"]').click();assert stage.get_attribute('data-phase')=='answer'
  p.locator(f'[data-view-answer="{after_word}"]').click();assert stage.get_attribute('data-phase')=='done' and p.locator('#viewFeedback').inner_text().startswith('Correct!')
  if i==0:
   p.screenshot(path='/tmp/near-far-viewpoint-desktop.png',full_page=True)
   p.locator('#viewSwitch').click();assert stage.get_attribute('data-expected')==before_word
   p.locator(f'[data-view-answer="{before_word}"]').click();assert object_rects()==positions
  if i<7:p.locator('#dmnew').click()
 assert numbers=={'s','p'}
 p.locator('[data-spatial-variant="old"]').click();assert p.locator('.spatial-item').count()==8
 p.locator('#dmnew').click();assert p.locator('[data-spatial-variant="old"]').get_attribute('aria-pressed')=='true'
 p.locator('[data-spatial-variant="new"]').click();assert p.locator('.perspective-object').count()==8
 task('fbk');stage=p.locator('.listening-baskets-stage');assert p.locator('.listening-object').count()==8
 assert p.locator('.spatial-distance').count()==0 and p.locator('#basketTranscript').is_hidden()
 initial_height=p.locator('.listening-picture-bank').bounding_box()['height'];counts=dict.fromkeys(['this','that','these','those'],0)
 for i in range(8):
  key=stage.get_attribute('data-current-object');word=stage.get_attribute('data-current-word');counts[word]+=1
  p.locator('#basketListen').click()
  p.wait_for_function("([key,word])=>{const a=document.querySelector('#basketAudio');return !a.paused&&a.currentTime>0.04&&a.currentSrc.endsWith(word+'-'+key+'.mp3')}",arg=[key,word])
  assert p.locator('#basketTranscript').is_hidden()
  if i==0:
   p.locator('#basketText').click();assert p.locator('#basketTranscript').inner_text().lower().startswith(word+' ')
   p.locator('#basketText').click();assert p.locator('#basketTranscript').is_hidden()
   # Pick another stable key, since has_not on the button itself is not a self-filter.
   other=p.locator('.listening-object').evaluate_all('(els,key)=>els.find(el=>el.dataset.listeningObject!==key).dataset.listeningObject',key)
   p.locator(f'[data-listening-object="{other}"]').click();p.locator(f'[data-listening-basket="{word}"] h3').click();assert 'different picture' in p.locator('#basketFeedback').inner_text()
   p.locator(f'[data-listening-object="{key}"]').click();bad=next(w for w in counts if w!=word);p.locator(f'[data-listening-basket="{bad}"] h3').click();assert 'another basket' in p.locator('#basketFeedback').inner_text()
   el=p.locator(f'[data-listening-object="{key}"]');start=el.bounding_box();zone=p.locator(f'[data-listening-basket="{word}"]').bounding_box()
   p.mouse.move(start['x']+start['width']/2,start['y']+start['height']/2);p.mouse.down();p.mouse.move(zone['x']+zone['width']/2,zone['y']+50,steps=10);p.mouse.up()
  else:
   p.locator(f'[data-listening-object="{key}"]').click();p.locator(f'[data-listening-basket="{word}"] h3').click()
  assert p.locator(f'[data-listening-basket="{word}"] [data-listening-object="{key}"]:disabled').count()==1
  p.wait_for_function("key=>{const s=document.querySelector('.listening-baskets-stage');return s.dataset.currentObject!==key||s.dataset.complete==='true'}",arg=key)
  if i<7:assert p.locator('.listening-picture-bank').bounding_box()['height']==initial_height
  else:assert p.locator('.listening-picture-bank').is_hidden()
 assert all(n==2 for n in counts.values()),counts
 assert stage.get_attribute('data-complete')=='true' and p.locator('#basketListen').is_disabled()
 assert p.locator('#basketAudio').evaluate('el=>el.paused')
 p.screenshot(path='/tmp/four-baskets-listening-desktop.png',full_page=True)
 p.locator('#dmnew').click();assert p.locator('.listening-picture-bank .listening-object').count()==8
 p.locator('#basketListen').click();p.wait_for_function("document.querySelector('#basketAudio').currentTime>0.02")
 old_audio=p.locator('#basketAudio').element_handle();p.locator('[data-spatial-variant="old"]').click();assert old_audio.evaluate('a=>a.paused&&!a.getAttribute("src")')
 assert p.locator('.spatial-item').count()==8
 # Real animation moves only the observer; stationary objects keep their coordinates.
 p.emulate_media(reduced_motion='no-preference');task('nof');before=object_rects();left=p.locator('.observer-marker').bounding_box()['x'];p.locator('#viewSwitch').click();p.wait_for_timeout(220)
 middle=p.locator('.observer-marker').bounding_box()['x'];p.wait_for_timeout(700);right=p.locator('.observer-marker').bounding_box()['x']
 assert left<middle<right and object_rects()==before
 p.emulate_media(reduced_motion='reduce')
 for width in [768,390]:
  p.set_viewport_size({'width':width,'height':844})
  for id in ['pcr','nof','fbk']:
   task(id);assert p.evaluate('document.documentElement.scrollWidth<=innerWidth'),(id,width)
   if id=='nof':p.locator('#viewSwitch').click()
   if width==390:p.screenshot(path=f'/tmp/grammar-perspectives-mobile-{id}.png',full_page=True)
 # A failed audio resource uses browser speech synthesis, retaining the same full sentence.
 fallback=b.new_page(viewport={'width':1000,'height':850});fallback.on('pageerror',lambda e:errors.append(str(e)))
 fallback.route('**/assets/basket-audio/*.mp3',lambda route:route.abort())
 fallback.add_init_script("window.testSpoken=[];speechSynthesis.speak=u=>window.testSpoken.push({text:u.text,lang:u.lang});speechSynthesis.cancel=()=>{}")
 fallback.goto(base);fallback.evaluate("go('gram');S.splevel='a1';spOpen('fbk')");fallback.locator('#basketListen').click();fallback.wait_for_function('window.testSpoken.length>0')
 assert fallback.evaluate("testSpoken.at(-1).text===document.querySelector('#basketTranscript').textContent")
 assert fallback.locator('#basketTranscript').is_hidden();fallback.locator('#basketText').click();assert fallback.locator('#basketTranscript').is_visible()
 fallback.close()
 assert not missing,missing
 assert not errors,errors
 print('Passed: 16 reporter images and two-clause corrections; all 8 stationary objects and four demonstratives; 16 MP3 clips, real browser playback, balanced listening sorting, voice fallback, legacy modes, animation and two responsive widths.')
 b.close()
server.shutdown()
