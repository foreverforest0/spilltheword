"""Five-stage B1 video training: local media, models, saved drafts and completion GIF."""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import json,subprocess
from PIL import Image
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
source=(ROOT/'b1-video-data.js').read_text();data=json.loads(source[source.index('{'):].rstrip().removesuffix(';'))
assert len(data['topics'])==11
assert Image.open(ROOT/data['endGif']).n_frames>1
for topic in data['topics']:
 assert len(topic['stages'])==5
 for stage in topic['stages']:
  assert len(stage['instructions'])>=2 and len(stage['answers'])>=2
  assert (ROOT/stage['poster']).is_file()
  meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name','-of','json',str(ROOT/stage['video'])]))
  assert abs(float(meta['format']['duration'])-35)<.2,(stage['id'],meta)
  assert any(s.get('codec_name')=='h264' for s in meta['streams'])
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce');page=context.new_page();errors=[];missing=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:missing.append(r.url) if r.status>=400 and r.url.startswith(base) else None)
 page.goto(base)
 page.evaluate("go('gram');S.glevel='b1';S.splevel='b1';glSetup()")
 page.locator('[data-grammar-topic="b1:1"]').click()
 assert page.locator('[data-grammar-exercise="film_b1_1"]').count()==1
 assert page.locator('[data-grammar-exercise="ppvideo"]').count()==0
 page.locator('[data-grammar-exercise="film_b1_1"]').click()
 for n in range(1,12):
  if n>1:page.evaluate('n=>spOpen("film_b1_"+n)',n)
  assert page.locator('.bv-page').get_attribute('data-step')=='0'
  assert page.locator('.bv-tv').bounding_box()['width']>700
  for i in range(5):
   page.wait_for_function("document.querySelector('#bv-video').readyState>=2")
   assert page.locator('.bv-page').get_attribute('data-step')==str(i)
   assert page.locator('#bv-models').is_hidden()
   # Every step can be played, not just loaded as a poster.
   page.evaluate("document.querySelector('#bv-video').muted=true;document.querySelector('#bv-video').play()")
   page.wait_for_function("document.querySelector('#bv-video').currentTime>0")
   assert not page.locator('.bv-page button').filter(has_text='Check').count()
   draft=f'Topic {n}, stage {i+1}: <my own wording>.'
   page.locator('#bv-draft').fill(draft)
   page.locator('#bv-show').click();assert page.locator('#bv-models').is_visible()
   answers=data['topics'][n-1]['stages'][i]['answers']
   assert page.locator('#bv-models li').all_text_contents()==answers
   assert page.locator('#bv-draft').input_value()==draft
   old_video=page.locator('#bv-video').element_handle()
   if i==1:
    page.locator('#bv-previous').click()
    assert old_video.evaluate('v=>v.paused&&!v.querySelector("source").getAttribute("src")')
    assert page.locator('#bv-draft').input_value()==f'Topic {n}, stage 1: <my own wording>.'
    assert page.locator('#bv-models').is_visible()
    page.locator('#bv-next').click()
    assert page.locator('#bv-draft').input_value()==draft
    assert page.locator('#bv-models').is_visible()
   if n==1 and i==2:
    page.reload();page.evaluate("go('gram');S.splevel='b1';spOpen('film_b1_1')")
    assert page.locator('.bv-page').get_attribute('data-step')=='2'
    assert page.locator('#bv-draft').input_value()==draft
    assert page.locator('#bv-models').is_visible()
   page.locator('#bv-next').click()
  assert page.locator('.bv-page').get_attribute('data-finished')=='true'
  assert page.locator('.bv-end-gif').get_attribute('src')==data['endGif']
  page.wait_for_function("document.querySelector('.bv-end-gif').naturalWidth===500")
  assert not page.locator('#bv-video').count()
  page.locator('#bv-review').click()
  assert page.locator('#bv-draft').input_value()==f'Topic {n}, stage 5: <my own wording>.'
  assert page.locator('#bv-models').is_visible()
 # A legacy Present Perfect video route now opens the same training.
 page.evaluate("DMTF.ppvideo()")
 assert page.locator('.bv-page').get_attribute('data-topic')=='1'
 # New learner on narrow viewports: long instructions, answer models and GIF fit.
 for width in [768,390,320]:
  page.set_viewport_size({'width':width,'height':900})
  page.evaluate("delete S.b1Cinema[6];B1Video.open(6)")
  for i in range(5):
   page.locator('#bv-show').click();assert page.locator('#bv-models').is_visible()
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,i)
   page.locator('#bv-next').click()
  assert page.locator('.bv-end-gif').is_visible()
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 # All topic headings fit the narrowest screen, including the longer names.
 page.set_viewport_size({'width':320,'height':900})
 for n in range(1,12):
  page.evaluate('n=>B1Video.open(n)',n)
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),('heading',n)
 # Leaving the activity unloads the player.
 page.evaluate("delete S.b1Cinema[1];B1Video.open(1)")
 handle=page.locator('#bv-video').element_handle();page.evaluate("go('home')")
 assert handle.evaluate('v=>v.paused&&!v.querySelector("source").getAttribute("src")')
 assert not errors,errors;assert not missing,missing
 browser.close()
server.shutdown()
print('PASS: 55 H.264 clips played; 55 stages show every model; no grader; drafts/reveals survive navigation and reload; 11 endings use the supplied animated GIF; legacy route, cleanup and 3 responsive widths.')
