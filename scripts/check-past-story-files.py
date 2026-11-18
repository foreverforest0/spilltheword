"""Notebooks: all evidence open, no old steps/blue art, photos, writing, layout and audio."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
import json,hashlib
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(Q,directory=str(ROOT)));Thread(target=srv.serve_forever,daemon=True).start()
manifest=json.loads((ROOT/'assets/past-notebooks/manifest.json').read_text())
for name,expected in manifest['sources'].items():assert hashlib.sha256((ROOT/'assets/past-notebooks'/name).read_bytes()).hexdigest()==expected
assert not (ROOT/'assets/past-story-files/approved-blue-pencil-sheet.png').exists()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1600,'height':1150},reduced_motion='reduce');errors=[];missing=[];p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.status>=400 and 'favicon' not in r.url else None);p.goto(f'http://127.0.0.1:{srv.server_port}/')
 p.evaluate("S.pastStoryFiles={'b1:dog':{answers:{6:'Existing final story'}}}")
 for lv in ['b1','b2']:
  p.evaluate("lv=>{go('gram');S.splevel=lv;S.glevel=lv;spOpen('past_story_files')}",lv)
  assert p.locator('[data-notebook]').count()==8
  for id in ['dog','farewell','proposal','gift','santa','side-b','room-1301','take-four']:
   p.evaluate('id=>PastNotebooks.open(id)',id)
   assert p.locator('.pn-header h1').is_visible()
   if lv=='b1' and id=='dog':assert p.locator('#pnDraft').input_value()=='Existing final story'
   count=p.evaluate('id=>PastNotebookData.find(s=>s.id===id).pieces.length',id)
   assert p.locator('[data-notebook-piece]').count()==count
   assert p.locator('.pn-binding').count()==0
   assert p.locator('.pn-left-page').is_visible()
   assert p.locator('.pn-kind-photo').count()==2 and p.locator('.pn-kind-object').count()>=1
   assert p.locator('.pn-kind-audio').count()==1
   assert p.locator('#psNext,#psHint,#psShow,.ps-question,.ps-vocab').count()==0
   for i in range(count):
    piece=p.locator(f'[data-notebook-piece="{i}"]');assert piece.is_visible();piece.click();assert p.locator('#pnDetail').is_visible()
    if i in [0,1,2]:assert p.locator('#pnDetailBody .pn-image').is_visible()
    if i==count-1:assert p.locator('audio').count()==0 and p.locator('.pn-audio-pending').is_visible()
    p.locator('#pnDetailClose').click();assert p.locator('#pnDetail').is_hidden()
   p.locator('#pnDraft').fill(lv+' '+id+' saved story')
  p.evaluate("PastNotebooks.open('dog')");assert p.locator('#pnDraft').input_value()==lv+' dog saved story'
  # Keyboard rearrangement and persisted positions; inspect stays available.
  piece=p.locator('[data-notebook-piece="3"]');piece.focus();piece.press('Shift+ArrowRight');assert p.evaluate("lv=>!!S.pastFolders[lv+':dog'].layout['paper-0']",lv)
  p.screenshot(path='/tmp/story-notebook-'+lv+'-desktop.png',full_page=True)
  p.reload();p.evaluate("lv=>{S.splevel=lv;S.glevel=lv;PastNotebooks.open('dog')}",lv);assert p.locator('#pnDraft').input_value()==lv+' dog saved story'
  p.set_viewport_size({'width':390,'height':844});assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
  for i in range(p.locator('[data-notebook-piece]').count()):assert p.locator(f'[data-notebook-piece="{i}"]').is_visible()
  p.screenshot(path='/tmp/story-notebook-'+lv+'-mobile.png',full_page=True)
  p.locator('[data-notebook-piece="0"]').click();p.keyboard.press('Escape');assert p.locator('#pnDetail').is_hidden()
  p.set_viewport_size({'width':1600,'height':1150})
 # Existing uploaded lift recording stands in for a supplied MP3 to test actual playback.
 p.evaluate("PastNotebookData[0].pieces.at(-1).audio='assets/sounds/time-lift.mp3';PastNotebooks.open('dog')")
 p.locator(f'[data-notebook-piece="{p.locator("[data-notebook-piece]").count()-1}"]').click();p.wait_for_function("document.querySelector('#pnDetailBody audio').readyState>=1")
 assert p.locator('#pnDetailBody details').count()==1
 p.locator('#pnDetailBody audio').evaluate('a=>a.play()');p.locator('#pnDetailClose').click();assert p.locator('#pnDetail').is_hidden()
 # Original Present Perfect files retain their original archive and images.
 p.evaluate("spOpen('ppfiles')");assert p.locator('.cf-folder').count()==3
 assert not errors,errors;assert not missing,missing
 print('PASS: eight folders × two levels, all visible keepsakes, realistic photo/object assets, details, notes/layout persistence, mobile, real audio wiring, no guided stages and original folders preserved.')
 b.close()
