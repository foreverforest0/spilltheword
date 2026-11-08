"""Functional checks for room presets, single tasks, possession prompts and spatial sorting."""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(Path(__file__).resolve().parents[1])))
Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');errors=[];missing=[]
 p.on('pageerror',lambda e:errors.append(str(e)))
 p.on('response',lambda r:missing.append(r.url) if r.status==404 else None)
 p.goto(f'http://127.0.0.1:{server.server_port}/');p.wait_for_timeout(100)
 p.evaluate("go('gram')");p.locator('[data-catalog-level="kids"]').click();p.wait_for_timeout(80)
 assert p.locator('.topic-emotion').count()>0
 p.locator('[data-grammar-topic="kids:3"]').click();assert p.locator('[data-grammar-exercise="tpc"]').count()==1
 p.locator('[data-grammar-exercise="tpc"]').click();p.wait_for_timeout(100)
 assert 'Typewriter' in p.locator('#view h2').inner_text()
 report=p.evaluate("""()=>{const cfg=TYD.tpc;for(const mode of ['be','ing','phrase'])if(cfg.pool(mode).length!==12)throw Error('Empty mode');return cfg.pool('all').length}""")
 assert report==36
 p.wait_for_function('TYDR && !TYDR.busy')
 answer=p.evaluate('TYDR.q[TYDR.i].a[0]')
 p.locator('#tyta').focus();p.keyboard.type(answer);p.keyboard.press('Enter')
 assert p.locator('#drres').inner_text().startswith('✓ Correct!')
 p.evaluate("go('gram');S.splevel='a1';spOpen('who')");p.wait_for_timeout(100)
 assert p.locator('#cbsharedhint,#cbhint').count()==0
 assert p.locator('.stw-board-card .stw-prompt-copy').count()==0
 p.locator('.cbc').first.click();p.wait_for_timeout(400)
 assert p.locator('.ownership-prompt').count()==2
 assert all('___' in t for t in p.locator('.ownership-prompt').all_text_contents())
 assert p.locator('#cbhint').count()==0
 p.screenshot(path='/tmp/workshop-whose.png',full_page=True)
 for task in ['nof','fbk']:
  p.evaluate("id=>{go('gram');S.splevel='a1';spOpen(id)}",task);p.wait_for_timeout(80)
  p.locator('[data-spatial-variant="old"]').click()
  assert p.locator('.spatial-item').count()==8
  if task=='nof':
   item=p.locator('.spatial-item').first;start=item.bounding_box();target=p.locator('[data-spatial-zone="near"]').bounding_box()
   p.mouse.move(start['x']+start['width']/2,start['y']+start['height']/2);p.mouse.down()
   p.mouse.move(target['x']+35,target['y']+45,steps=8);p.mouse.up()
   assert p.locator('[data-spatial-zone="near"] .spatial-item').count()==1
  # The click-select path is also the keyboard/touch alternative to dragging.
  items=p.evaluate("DMO.map(o=>({key:o[0],plural:o[1]==='p'}))")
  for i in range(8):
   item=p.locator(f'.spatial-item[data-object="{i}"]')
   if task=='nof':zone='near' if i%2 else 'far'
   else:
    aria=item.get_attribute('aria-label');near=aria.endswith('near');obj=p.evaluate('(label)=>DMO.find(o=>label.startsWith(o[2]))',aria);plural=obj[1]=='p';zone=('these' if near else 'those') if plural else ('this' if near else 'that')
   item.click();p.locator(f'[data-spatial-zone="{zone}"]').click(position={'x':12,'y':12})
  if task=='fbk':
   assert p.locator('.spatial-status').inner_text().startswith('8 / 8')
   assert p.locator('.spatial-baskets .spatial-item:disabled').count()==8
   for zone in ['this','that','these','those']:assert p.locator(f'[data-spatial-zone="{zone}"] .spatial-item').count()==2
  else:assert p.locator('.spatial-tray .spatial-item').count()==0
  p.screenshot(path=f'/tmp/workshop-{task}.png',full_page=True)
 room_checks=0
 for room in ['living','bedroom','kitchen','bathroom','study']:
  for set_index in [0,1]:
   p.evaluate("([room,set])=>{go('gram');S.splevel='a1';S.sptask='rmp';S.rmroom=room;ROOM_MODE='task';ROOM_SESSIONS[room]={set,task:0,items:null};spOpen('rmp')}",[room,set_index])
   p.wait_for_selector('#roomStage .rmi');p.wait_for_timeout(100)
   assert p.locator('#dmhint').count()==0
   assert p.locator('#roomInstruction').inner_text().count('Put the')==1
   assert p.locator('.room-palette').count()==2
   if set_index==0:
    assert p.locator('#roomStage').bounding_box()['width']>=850
    p.screenshot(path=f'/tmp/workshop-room-{room}.png',full_page=True)
   for _ in range(3):
    p.locator('#roomSolution').click();p.locator('#roomCheck').click()
    assert p.locator('#roomFeedback').inner_text().startswith('Correct!'),(room,p.locator('#roomInstruction').inner_text(),p.locator('#roomFeedback').inner_text())
    p.locator('#roomNext').click();room_checks+=1
   assert p.evaluate("""()=>{const r=RMR.find(r=>r.id===S.rmroom);return ROOM_SESSIONS[r.id].items.every(o=>{const b=rmBox(o,r.ar);return b.l>=0&&b.r<=100&&b.t>=0&&b.b<=100})}"""),room
  p.locator('[data-room-mode="rnd"]').click();p.wait_for_selector('#roomStage .rmi');p.wait_for_timeout(50)
  assert p.locator('[data-room-mode="rnd"]').inner_text()=='Set randomly'
  p.locator('#roomSolution').click();assert ' is ' in p.locator('#roomFeedback').inner_text() or ' are ' in p.locator('#roomFeedback').inner_text()
 for task in ['nof','fbk','rmp']:
  p.set_viewport_size({'width':390,'height':844});p.evaluate("id=>{go('gram');S.splevel='a1';spOpen(id)}",task);p.wait_for_timeout(200)
  assert p.evaluate('document.documentElement.scrollWidth<=innerWidth'),task
  if task=='rmp':assert p.locator('#roomStage').bounding_box()['width']>=330
  p.screenshot(path=f'/tmp/workshop-mobile-{task}.png',full_page=True)
 assert not missing,missing
 assert not errors,errors
 print(f'Passed: 36 typewriter prompts, possession backs, balanced sorting, {room_checks} room solutions, five rooms/two presets and mobile layouts.')
 b.close()
server.shutdown()
