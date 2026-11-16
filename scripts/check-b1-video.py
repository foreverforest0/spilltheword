"""B1 films: one prompt per viewing, automatic replays and isolated saved answers."""
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
ids=set();total=0
for topic in data['topics']:
 assert len(topic['stages'])==5
 for stage in topic['stages']:
  assert 'instructions' not in stage and 'answers' not in stage
  assert stage['tasks']
  for task in stage['tasks']:
   assert task['id'] not in ids;ids.add(task['id']);total+=1
   assert task['prompt'] and task['answers']
   assert len(task['prompt'])<220
  assert (ROOT/stage['poster']).is_file()
  meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name','-of','json',str(ROOT/stage['video'])]))
  assert abs(float(meta['format']['duration'])-35)<.2
  assert any(s.get('codec_name')=='h264' for s in meta['streams'])
assert len(data['topics'][0]['stages'][1]['tasks'])==3
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
 page.locator('[data-grammar-exercise="film_b1_1"]').click()
 visited=0
 for topic in data['topics']:
  n=topic['number']
  if n>1:page.evaluate('n=>spOpen("film_b1_"+n)',n)
  assert page.locator('.bv-tv').bounding_box()['width']>700
  for i,stage in enumerate(topic['stages']):
   for j,task in enumerate(stage['tasks']):
    visited+=1
    page.wait_for_function("document.querySelector('#bv-video').readyState>=2")
    assert page.locator('.bv-page').get_attribute('data-step')==str(i)
    assert page.locator('.bv-page').get_attribute('data-task')==str(j)
    assert page.locator('.bv-prompt').inner_text()==task['prompt']
    assert page.locator('.bv-prompt').count()==1
    assert not page.locator('.bv-instructions,.bv-watch,.bv-draft-label,.bv-model-note').count()
    body=page.locator('.bv-page').inner_text()
    for banned in ['STAGE','Your notes','These are examples.','film’s release date']:
     assert banned not in body,(task['id'],banned)
    assert page.locator('#bv-models').is_hidden()
    if j==0:
     page.evaluate("document.querySelector('#bv-video').muted=true;document.querySelector('#bv-video').play()")
    page.wait_for_function("document.querySelector('#bv-video').currentTime>0")
    assert not page.locator('.bv-page button').filter(has_text='Check').count()
    draft=f'{task["id"]}: <my own answer>.'
    page.locator('#bv-draft').fill(draft)
    page.locator('#bv-show').click()
    assert page.locator('#bv-models li').all_text_contents()==task['answers']
    assert page.locator('#bv-draft').input_value()==draft
    if j==1 and i==0:
     page.locator('#bv-previous').click()
     assert page.locator('#bv-draft').input_value()==f'{stage["tasks"][0]["id"]}: <my own answer>.'
     assert page.locator('#bv-models').is_visible()
     page.locator('#bv-next').click()
     assert page.locator('#bv-draft').input_value()==draft
     assert page.locator('#bv-models').is_visible()
    if n==1 and i==1 and j==1:
     page.reload();page.evaluate("go('gram');S.splevel='b1';spOpen('film_b1_1')")
     assert page.locator('.bv-page').get_attribute('data-step')=='1'
     assert page.locator('.bv-page').get_attribute('data-task')=='1'
     assert page.locator('#bv-draft').input_value()==draft
     assert page.locator('#bv-models').is_visible()
    old=page.locator('#bv-video').element_handle();src=page.locator('#bv-video source').get_attribute('src')
    page.locator('#bv-next').click()
    assert old.evaluate('v=>v.paused&&!v.querySelector("source").getAttribute("src")')
    if j<len(stage['tasks'])-1:
     assert page.locator('#bv-video source').get_attribute('src')==src
     page.wait_for_function("document.querySelector('#bv-video').currentTime>0&&!document.querySelector('#bv-video').paused")
    elif i<4:
     assert page.locator('#bv-video source').get_attribute('src')==topic['stages'][i+1]['video']
   # Boundary back/forward restores the last question of the previous video.
   if n==1 and i==0:
    page.locator('#bv-previous').click()
    assert page.locator('.bv-page').get_attribute('data-task')==str(len(stage['tasks'])-1)
    assert page.locator('#bv-draft').input_value()==draft
    page.locator('#bv-next').click()
  assert page.locator('.bv-page').get_attribute('data-finished')=='true'
  page.wait_for_function("document.querySelector('.bv-end-gif').naturalWidth===500")
  page.locator('#bv-review').click()
  assert page.locator('#bv-draft').input_value()==draft
  assert page.locator('#bv-models').is_visible()
 assert visited==total
 # Earlier combined notes survive migration; they are only reused on the first prompt.
 page.evaluate("S.b1Cinema[1]={step:4,finished:true,drafts:{b1_1_1:'My earlier notes'},revealed:{b1_1_1:true}};B1Video.open(1)")
 assert page.locator('.bv-page').get_attribute('data-step')=='0'
 assert page.locator('#bv-draft').input_value()=='My earlier notes'
 assert page.locator('#bv-models').is_hidden()
 page.locator('#bv-next').click();assert page.locator('#bv-draft').input_value()==''
 assert page.evaluate('S.b1Cinema[1].drafts.b1_1_1')=='My earlier notes'
 page.evaluate('DMTF.ppvideo()');assert page.locator('.bv-page').get_attribute('data-topic')=='1'
 for width in [768,390,320]:
  page.set_viewport_size({'width':width,'height':900});page.evaluate("delete S.b1Cinema[6];B1Video.open(6)")
  for _ in range(sum(len(s['tasks']) for s in data['topics'][5]['stages'])):
   page.locator('#bv-show').click();assert page.locator('#bv-models').is_visible()
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   page.locator('#bv-next').click()
  assert page.locator('.bv-end-gif').is_visible()
 page.set_viewport_size({'width':320,'height':900})
 for n in range(1,12):
  page.evaluate('n=>B1Video.open(n)',n)
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),n
 page.evaluate("delete S.b1Cinema[1];B1Video.open(1)");handle=page.locator('#bv-video').element_handle();page.evaluate("go('home')")
 assert handle.evaluate('v=>v.paused&&!v.querySelector("source").getAttribute("src")')
 assert not errors,errors;assert not missing,missing
 browser.close()
server.shutdown()
print(f'PASS: {total} isolated prompts over 55 clips; same-clip replay, per-question models/drafts, reload, migration, cross-video Back, all 11 GIF endings, no grading or removed copy, mobile.')
