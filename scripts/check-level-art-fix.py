"""Future rooms follow the selected level; pale portrait interiors remain intact."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
import json
import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
m=json.loads((ROOT/'assets/wobbly/manifest.json').read_text())
assert m['sourceCommit']=='b5eea8f' and m['actionSourceCommit']=='8dd6c2c'
for key,src in m['pictures'].items():
 im=Image.open(ROOT/src);a=np.array(im.getchannel('A'));assert src.endswith('-whole.png');assert np.count_nonzero(a)>100
 if key in ['be woman headband','be sad man']:
  widths=(a>0).sum(axis=1)
  assert widths[round(im.height*.70):round(im.height*.87)].min()>im.width*.45,key
 if key.startswith('be '):
  # Every row between the two outer portrait boundaries must keep its fill.
  # This catches the missing neck and torn-shirt defects in the user examples.
  for row in a:
   x=np.flatnonzero(row)
   if len(x)>2:assert np.all(row[x[0]:x[-1]+1]>0),key
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1280,'height':1000},reduced_motion='reduce');errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.goto(f'http://127.0.0.1:{server.server_port}/')
 for lv in ['kids','a1','a2','b1','b2','c1','all']:
  p.evaluate("lv=>{go('gram');S.glevel=lv;glSetup()}",lv)
  assert p.locator('[data-future-window="basic"]').count()==(0 if lv=='kids' else 1)
  assert p.locator('[data-future-window="advanced"]').count()==(0 if lv in ['kids','a1','a2'] else 1)
  if lv in ['kids','a1','a2']:
   assert p.evaluate("lv=>!SPGRP[lv].some(g=>g[1].includes('future_timetable'))",lv)
  if lv in ['a1','a2']:
   p.locator('[data-future-window="basic"]').click()
   assert p.locator('[data-future-task]').count()==2
   assert p.locator('[data-future-task="timetable"]').count()==0
   for key in ['will','going']:
    p.evaluate("key=>spOpen('future_'+key)",key);assert p.locator('[data-future-answer]').is_visible()
 p.evaluate("go('gram');S.glevel='kids';S.splevel='kids';spOpen('be')")
 p.evaluate('window.__portraitRows=BES.slice()')
 for name in ['be woman headband','be mother baby']:
  p.evaluate("name=>{BES.splice(0,BES.length,__portraitRows.find(r=>r.k===name));spOpen('be')}",name)
  p.screenshot(path='/tmp/whole-'+name.replace(' ','-')+'.png',full_page=True)
 assert not errors,errors
 print('PASS: no Kids futures; only will/going-to on A1/A2; advanced room kept on higher levels; complete portrait alpha interiors and fresh PNG names')
 b.close()
server.shutdown()
