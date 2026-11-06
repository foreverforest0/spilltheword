"""Browser checks for all grammar-topic fridges, pointer gestures and free tasks."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path
from threading import Thread
import json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=browser.new_page(viewport={'width':1440,'height':1200},reduced_motion='reduce');errors=[];missing=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:missing.append(r.url) if '/magnets/' in r.url and r.status>=400 else None)
 page.goto(base+'/?magnets=1&level=b1');page.locator('#fm-bank .fm-magnet').first.wait_for()
 audit=page.evaluate('''()=>{const out={};for(const [lv,ids]of Object.entries(FRidge.topics)){
 const groups=SPGRP[lv].filter(g=>/^\\d+\\s*·/.test(g[0]));if(ids.length!==groups.length)throw Error('Missing topic '+lv);
 for(const [i,id]of ids.entries()){const d=FRidge.decks[id];if(!groups[i][1].includes(id)||!DMTF[id])throw Error('Missing route '+id);if(d.items.length<6)throw Error('Thin deck '+id);
 for(const r of d.items){const tokens=r.tokens||r.answers[0].replace(/[.,?!:;“”]/g,'').split(/\\s+/).filter(Boolean);if(tokens.some(t=>/\\s/.test(t)))throw Error('Multiword magnet '+id);if(!r.q||!r.answers.length||!b1AnswerMatch(tokens.join(' '),r.answers[0]))throw Error('Impossible sentence '+id+' '+r.answers[0]);}}
 out[lv]={topics:ids.length,sentences:ids.reduce((n,id)=>n+FRidge.decks[id].items.length,0)};}return out}''')
 print(json.dumps(audit),flush=True)
 # Solve a model from every topic using actual visible word controls.
 ids=page.evaluate('Object.values(FRidge.topics).flat()')
 for id in ids:
  page.evaluate('(id)=>FRidge.open(id)',id);assert page.locator('#fm-door').evaluate('(e)=>getComputedStyle(e).backgroundColor')=='rgba(0, 0, 0, 0)';assert page.locator('.fm-magnet img').count()==0
  answer=page.evaluate('FRidge.run.round.answers[0]');tokens=page.evaluate('FRidge.run.pieces.map(p=>p.w)')
  for word in tokens:
   page.evaluate('(w)=>{const b=[...document.querySelectorAll("#fm-bank .fm-magnet")].find(b=>b.textContent===w);if(!b)throw Error("Missing "+w);b.click()}',word)
  page.locator('#mgchk').click();assert page.locator('#fm-result').inner_text().lower().startswith('correct'),(id,answer,page.locator('#fm-result').inner_text())
 print(f'All {len(ids)} grammar topic routes solved',flush=True)
 # Every legacy B1 filter remains functional, including derived words and split infinitives.
 filters=page.evaluate('Object.entries(B1MAG).flatMap(([id,c])=>c.types.filter(x=>x[0]!=="all").map(([type])=>({id,type})))')
 for f in filters:
  tokens=page.evaluate('({id,type})=>{S.splevel="b1";S.mgxt=S.mgxt||{};S.mgxt[id]=type;dmMagnets(id,B1MAG[id]);return FRidge.run.pieces.map(p=>p.w)}',f)
  for word in tokens:page.evaluate('(w)=>[...document.querySelectorAll("#fm-bank .fm-magnet")].find(b=>b.textContent===w).click()',word)
  page.locator('#mgchk').click();assert page.locator('#fm-result').inner_text().lower().startswith('correct'),f
 print(f'All {len(filters)} legacy B1 filters passed',flush=True)
 # Exact example requested: negative Present Perfect, shuffled and task modes.
 page.evaluate('()=>FRidge.open("fm_b1_1")');page.locator('#fm-type').select_option('-');assert 'negative' in page.locator('#fm-task').inner_text().lower();page.locator('#mgchk').click();assert 'first' in page.locator('#fm-result').inner_text()
 # An incorrect ordering does not pass. Undo and clear are reversible.
 page.locator('#fm-bank .fm-magnet').first.click();page.locator('#mgchk').click();assert not page.locator('#fm-result').inner_text().lower().startswith('correct');page.locator('#fm-undo').click();assert page.locator('#fm-door .fm-magnet').count()==0
 # Drag from bank to fridge and reorder on the door; ghost disappears after release.
 src=page.locator('#fm-bank .fm-magnet').first;word=src.inner_text();src.drag_to(page.locator('#fm-door'));assert word in page.locator('#fm-door').inner_text();assert page.locator('.fm-ghost').count()==0
 page.locator('#fm-clear').click();assert page.locator('#fm-door .fm-magnet').count()==0
 # Free/task variants on every level, with no higher-level tense option at lower levels.
 for lv in audit:
  page.evaluate('(lv)=>{S.splevel=lv;FRidge.open(FRidge.topics[lv][0],{mode:"task"})}',lv)
  available=page.locator('#fm-tense option').all_text_contents();assert ('Future Perfect' in available)==(lv in ['b2','c1'])
  if lv in ['kids','a1']:assert 'Present Perfect' not in available
  page.locator('[data-fm-mode="free"]').click();assert page.locator('#fm-search').is_visible();page.locator('#fm-search').fill('cat');assert page.locator('#fm-bank .fm-magnet').count()>0
 page.evaluate('()=>FRidge.open("fm_b1_1",{mode:"task"})');page.locator('#fm-tense').select_option('perfect');page.locator('#fm-form').select_option('-');assert 'yet' in page.locator('#fm-task').inner_text();assert 'negative' in page.locator('#fm-task').inner_text()
 sample=page.evaluate('FRidge.run.challenge.example')
 for word in sample.replace('.','').split():
  page.evaluate('(w)=>{const b=[...document.querySelectorAll("#fm-bank .fm-magnet")].find(b=>b.textContent.toLowerCase()===w.toLowerCase());if(!b)throw Error("Free mode missing "+w);b.click()}',word)
 page.locator('#mgchk').click();assert 'included' in page.locator('#fm-result').inner_text();page.locator('#fm-save').click();assert 'finished' in page.locator('#fm-saved').inner_text()
 page.screenshot(path='/tmp/fridge-b1-task.png',full_page=True)
 # Existing B1 and Kids links still reach the upgraded interface.
 page.evaluate('()=>{S.splevel="b1";DMTF.mb1pa()}');assert page.locator('#fm-fridge').is_visible()
 page.evaluate('()=>{S.splevel="kids";DMTF.mgb()}');assert page.locator('#fm-fridge').is_visible()
 # Real touch on a narrow screen; no page overflow or ghost clicks.
 mobile=browser.new_page(viewport={'width':390,'height':844},has_touch=True,reduced_motion='reduce');mobile.on('pageerror',lambda e:errors.append(str(e)));mobile.goto(base+'/?magnets=1&level=b1');mobile.locator('#fm-bank .fm-magnet').first.wait_for();assert mobile.evaluate('document.documentElement.scrollWidth<=innerWidth')
 mobile.locator('#fm-bank .fm-magnet').first.tap();assert mobile.locator('#fm-door .fm-magnet').count()==1
 mobile.locator('#fm-bank .fm-magnet').first.scroll_into_view_if_needed()
 cdp=mobile.context.new_cdp_session(mobile);source=mobile.locator('#fm-bank .fm-magnet').first.bounding_box();target=mobile.locator('#fm-door').bounding_box();sx=source['x']+source['width']/2;sy=source['y']+source['height']/2;tx=target['x']+target['width']/2;ty=target['y']+target['height']*.4
 cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':sx,'y':sy}]})
 for step in range(1,15):cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':sx+(tx-sx)*step/14,'y':sy+(ty-sy)*step/14}]})
 cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});assert mobile.locator('#fm-door .fm-magnet').count()==2;assert mobile.locator('.fm-ghost').count()==0
 mobile.screenshot(path='/tmp/fridge-mobile.png',full_page=True)
 page.evaluate('()=>FRidge.open("fm_b1_1")');page.screenshot(path='/tmp/fridge-b1.png',full_page=True)
 assert not errors,errors;assert not missing,missing
 print(json.dumps({'topic_routes':len(ids),'desktop':'passed','touch':'passed','free_task':'passed','javascript_errors':errors,'missing_assets':missing}),flush=True);browser.close()
server.shutdown()
