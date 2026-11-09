"""Real book entry, parchment typing, grammar outcomes, motion, sharing and mobile."""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
from pathlib import Path
from urllib.parse import parse_qs
from playwright.sync_api import sync_playwright
import json
ROOT=Path(__file__).resolve().parents[1];OUT=Path('/workspace/shared/downloads/writing-room');OUT.mkdir(exist_ok=True,parents=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context(viewport={'width':1440,'height':1100},reduced_motion='reduce');p=ctx.new_page();errors=[];missing=[];calls=[]
 p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.url.startswith(base) and r.status>=400 and not r.url.endswith('/favicon.ico') else None)
 def api(route):
  values=parse_qs(route.request.post_data or '');text=values.get('text',[''])[0];calls.append(text)
  if text.startswith('Unavailable'):return route.fulfill(status=503,content_type='application/json',body='{}',headers={'Access-Control-Allow-Origin':'*'})
  if text.startswith('Incomplete'):return route.fulfill(content_type='application/json',body=json.dumps({'matches':[],'warnings':{'incompleteResults':True}}),headers={'Access-Control-Allow-Origin':'*'})
  match={'rule':{'issueType':'grammar'},'message':'Use goes with he.','offset':3,'length':2} if text.startswith('He go ') else {'rule':{'issueType':'style'},'message':'Optional wording change.','offset':0,'length':2}
  return route.fulfill(content_type='application/json',body=json.dumps({'matches':[match],'warnings':{}}),headers={'Access-Control-Allow-Origin':'*'})
 ctx.route('https://api.languagetool.org/v2/check',api)
 p.goto(base);p.wait_for_function('window.SharedGame');assert p.locator('[data-book-game=bard]').count()==1;p.locator('[data-book-game=bard]').click();p.wait_for_selector('#writing-room-frame');f=p.frame_locator('#writing-room-frame');f.locator('#wr-enter').wait_for();p.wait_for_function("document.getElementById('writing-room-frame').contentWindow.WritingRoom")
 def frame():return p.locator('#writing-room-frame').content_frame
 def ready():frame().locator('.wr-root').wait_for(state='visible');p.wait_for_function("!document.getElementById('writing-room-frame').contentWindow.WritingRoom.busy")
 ready();assert f.locator('#wr-intro').is_visible();assert f.locator('#wr-work').is_hidden();assert f.locator('#wr-room-video').is_visible();p.screenshot(path=str(OUT/'entrance.png'),full_page=True);f.locator('#wr-enter').click()
 assert f.locator('#wr-source').is_visible();assert f.locator('#wr-source').inner_text()=='He was scared, but he opened the door.';assert f.locator('#wr-detail').is_visible();assert f.locator('#wr-help').is_hidden();assert f.locator('#wr-how-toggle').get_attribute('aria-expanded')=='false'
 assert f.locator('#wr-answer').evaluate("e=>getComputedStyle(e).fontFamily.includes('La Belle Aurore')");assert f.locator('#wr-answer').evaluate("e=>getComputedStyle(e).backgroundColor==='rgba(0, 0, 0, 0)'");assert f.locator('#wr-answer').evaluate("e=>getComputedStyle(e).borderTopWidth==='0px'")
 # Icon click and keyboard both operate the explicit How to button.
 f.locator('#wr-how-toggle').click(position={'x':15,'y':18});assert f.locator('#wr-help').is_visible();assert f.locator('#wr-how-toggle').get_attribute('aria-expanded')=='true';assert f.locator('.wr-scene').bounding_box()['y']>=f.locator('#wr-help').bounding_box()['y']+f.locator('#wr-help').bounding_box()['height'];f.locator('#wr-how-toggle').press('Enter');assert f.locator('#wr-help').is_hidden();f.locator('#wr-how-toggle').press('Space');assert f.locator('#wr-help').is_visible();f.locator('#wr-how-toggle').press('Space');assert f.locator('#wr-help').is_hidden()
 f.locator('#wr-answer').fill('Keep my draft.');f.locator('#wr-room-back').click();assert f.locator('#wr-intro').is_visible();f.locator('#wr-enter').click();assert f.locator('#wr-answer').input_value()=='Keep my draft.'
 assert f.locator('.wr-wall-art').count()==3;assert f.locator('.wr-wall-flower').count()==0
 window=f.locator('.wr-wall-window').bounding_box();desk=f.locator('.wr-desk').bounding_box();scene=f.locator('.wr-scene').bounding_box();assert window['x']>=desk['x']+desk['width'];assert window['x']+window['width']<=scene['x']+scene['width'];assert window['y']+window['height']<=scene['y']+scene['height']
 f.locator('#wr-answer').fill('A B1 draft.');f.locator('[data-level=b2]').click();assert f.locator('#wr-words').inner_text()!= 'nervous';f.locator('#wr-answer').fill('A B2 draft.');f.locator('[data-level=b1]').click();assert f.locator('#wr-answer').input_value()=='A B1 draft.';f.locator('[data-level=c1]').click();assert 'apprehension' in f.locator('#wr-words').inner_text();f.locator('[data-level=b1]').click()
 f.locator('.wr-word').first.click();assert f.locator('#wr-gloss').is_visible();assert f.locator('#wr-gloss').inner_text();f.locator('#wr-answer').fill('He felt nervous, but he took a deep breath and finally opened the door.');assert f.locator('.wr-word.used').count()>=2
 f.locator('#wr-answer').focus();f.locator('#wr-answer').press('End');f.locator('#wr-answer').press('ArrowLeft');old=f.locator('#wr-quill').get_attribute('style');f.locator('#wr-answer').press('Home');assert f.locator('#wr-quill').get_attribute('style')!=old
 # A clear form error is marked on the page and must be corrected before signing.
 f.locator('#wr-answer').fill('He go to the room.');f.locator('#wr-check').click();ready();f.locator('#wr-error-popup').wait_for();assert f.locator('#wr-review').is_visible();assert f.locator('#wr-answer').is_hidden();assert f.locator('.wr-error').inner_text()=='go';assert f.locator('.rough-annotation path').count()>0;assert f.locator('#wr-count').inner_text()=='0';f.locator('#wr-replacements button').filter(has_text='went').click();assert f.locator('#wr-answer').input_value()=='He went to the room.';assert f.locator('#wr-count').inner_text()=='0'
 # Service failures never sign, discard or clear a draft.
 for text in ['Unavailable service.','Incomplete response.']:
  f.locator('#wr-answer').fill(text);f.locator('#wr-check').click();ready();assert f.locator('#wr-answer').input_value()==text;assert f.locator('#wr-count').inner_text()=='0';assert 'safe' in f.locator('#wr-feedback').inner_text()
 # A style suggestion is not a grammar rejection; prose goes into the signed stack.
 answer='He felt nervous, but he took a deep breath and finally opened the door.';f.locator('#wr-answer').fill(answer);f.locator('#wr-check').click();ready();assert f.locator('#wr-count').inner_text()=='1';assert f.locator('#wr-answer').input_value()=='';f.locator('#wr-stack').click();assert f.locator('#wr-signed-list').inner_text().endswith(answer);f.locator('#wr-close-pages').click()
 # Copy link carries the verdicts, so replay does not need to repeat the API request.
 f.locator('#wr-answer').fill('Her unexpected arrival delighted me.');url=p.evaluate('SharedGame.getLink()');before=len(calls);q=ctx.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.emulate_media(reduced_motion='no-preference');q.goto(url);q.wait_for_function('window.SharedGame&&!SharedGame.replaying');assert q.locator('.shared-game-loading').count()==0;qf=q.frame_locator('#writing-room-frame');assert qf.locator('#wr-count').inner_text()=='1';assert qf.locator('#wr-answer').input_value()=='Her unexpected arrival delighted me.';assert len(calls)==before;q.close()
 # Capture the actual composition with handwriting and collapsed How to.
 p.evaluate("go('bard')");f=p.frame_locator('#writing-room-frame');f.locator('#wr-enter').wait_for();f.locator('#wr-enter').click();f.locator('#wr-answer').fill(answer);p.wait_for_timeout(550);p.screenshot(path=str(OUT/'desktop.png'),full_page=True)
 for width in [768,390]:
  p.set_viewport_size({'width':width,'height':900});f.locator('#wr-answer').focus();f.locator('#wr-answer').press('End');assert f.locator('body').evaluate('e=>e.scrollWidth<=innerWidth');assert p.evaluate('document.documentElement.scrollWidth<=innerWidth');assert f.locator('#wr-answer').bounding_box()['width']>=170;assert f.locator('#wr-source').is_visible();window=f.locator('.wr-wall-window').bounding_box();scene=f.locator('.wr-scene').bounding_box();assert window and window['x']>=scene['x'] and window['x']+window['width']<=scene['x']+scene['width']+1
  if width==390:
   f.locator('#wr-room-back').click();f.locator('#wr-enter').click();p.wait_for_timeout(150);source=f.locator('#wr-source').bounding_box();assert 0<=source['y']<900; p.screenshot(path=str(OUT/'mobile.png'),full_page=True)
 # Normal-motion branch: real signature/flight, followed by drawn error marks.
 p.set_viewport_size({'width':1440,'height':1100});p.emulate_media(reduced_motion='no-preference');p.evaluate("go('bard')");f=p.frame_locator('#writing-room-frame');f.locator('#wr-enter').wait_for();f.locator('#wr-enter').click();f.locator('#wr-answer').fill(answer);f.locator('#wr-check').click();p.wait_for_function("document.getElementById('writing-room-frame').contentWindow.document.querySelector('.wr-root').dataset.phase==='signing'");assert f.locator('#wr-signature.signed').is_visible();p.screenshot(path=str(OUT/'signing.png'),full_page=True);ready();assert f.locator('#wr-count').inner_text()=='1';f.locator('#wr-answer').fill('He go to the room.');f.locator('#wr-check').click();ready();f.locator('#wr-review').wait_for();assert f.locator('.rough-annotation path').count()>0;assert f.locator('#wr-count').inner_text()=='1';assert f.locator('#wr-signature.signed').count()==0

 assert not errors,errors;assert not missing,missing;b.close()
server.shutdown();print('PASS: real book entry, room entrance, visible original sentence, button/keyboard How to, intact window, B1/B2/C1 drafts, handwriting/transparent parchment, quill caret, grammar-only outcomes, service failures, drawn corrections, signed-page animation/archive, shared verdict replay and mobile. Grammar API responses were mocked; production service access was not tested.')
