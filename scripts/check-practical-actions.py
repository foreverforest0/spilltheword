"""Check explicit packing commands, one-object process cards and stable shelf sorting."""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import re
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
 def open_task(task):p.evaluate("id=>{go('gram');S.splevel='a1';spOpen(id)}",task);p.wait_for_timeout(80)
 def drag(el,zone):
  start=el.bounding_box();end=zone.bounding_box()
  p.mouse.move(start['x']+start['width']/2,start['y']+start['height']/2);p.mouse.down();p.mouse.move(end['x']+end['width']/2,end['y']+40,steps=10);p.mouse.up()
 def packed_names():return set(p.locator('.pack-target [data-pack-item] span').all_text_contents())
 def pack_item(name):return p.locator('[data-pack-item]').filter(has=p.locator('span',has_text=re.compile('^'+re.escape(name)+'$')))
 open_task('pkb');trips=set();verbs=set();commands=0
 for n in range(8):
  stage=p.locator('.pack-commands-stage');trip=stage.get_attribute('data-trip');assert trip not in trips;trips.add(trip);expected=set()
  assert p.locator('[data-pack-item]').count()==8
  assert p.locator('[data-pack-item] img').evaluate_all("els=>els.every(el=>!el.src.includes('data:image/svg')&&!/ch\\/b_/.test(el.getAttribute('src')))")
  assert p.locator('#dmhint,#bgchk').count()==0
  for step in range(6):
   command=p.locator('#packCommand').inner_text();old_step=stage.get_attribute('data-step')
   swap=re.match(r'Replace the (.+) with the (.+)\.',command);take=re.match(r'Take the (.+) out of the bag\.',command);put=re.search(r'put the (.+) in the bag\.',command,re.I)
   if swap:
    verbs.add('swap');old,new=swap.groups();assert old in expected and new not in expected
    # Both removal-first and addition-first must work without prematurely advancing.
    order=[old,new] if n%2 else [new,old]
    for i,name in enumerate(order):
     pack_item(name).click()
     if i==0:assert stage.get_attribute('data-step')==old_step
    expected.remove(old);expected.add(new)
   elif take:
    verbs.add('out');name=take[1];assert name in expected
    if n==0:drag(pack_item(name),p.locator('.pack-table'))
    else:pack_item(name).click()
    expected.remove(name)
   else:
    assert put,command;name=put[1];verbs.add('remember' if command.startswith('Don’t') else 'put')
    if step==0:
     wrong=p.locator('.pack-table [data-pack-item]').filter(has_not=p.locator('span',has_text=re.compile('^'+re.escape(name)+'$'))).first
     wrong.click();assert not packed_names() and p.locator('#packFeedback').inner_text().startswith('Not this action.')
    if n==0 and step==0:drag(pack_item(name),p.locator('.pack-target'))
    else:pack_item(name).click()
    expected.add(name)
   assert packed_names()==expected,(command,packed_names(),expected)
   p.wait_for_function("old=>document.querySelector('.pack-commands-stage').dataset.step!==old||document.querySelector('.pack-commands-stage').dataset.complete==='true'",arg=old_step)
   commands+=1
  assert stage.get_attribute('data-complete')=='true' and p.locator('[data-pack-item]:disabled').count()==8
  if n==0:p.screenshot(path='/tmp/pack-commands-desktop.png',full_page=True)
  if n<7:p.locator('#dmnew').click()
 assert verbs=={'put','out','swap','remember'}
 open_task('how');titles=set()
 for batch in range(2):
  assert p.locator('.process-card').count()==6
  assert p.locator('.process-card:not([hidden]) .process-front img').count()==1
  assert p.locator('#processHintText:visible').count()==0
  assert p.locator('.process-question .stw-wave-letter').count()==0
  for i in range(6):
   card=p.locator('.process-card:not([hidden])');title=card.get_attribute('data-process');assert title not in titles;titles.add(title)
   assert card.locator('.process-front').inner_text()=='How to '+title+'?'
   card.click();p.wait_for_function("!document.querySelector('.cs-deck')._cardDeck.busy");assert card.get_attribute('aria-pressed')=='true'
   assert card.locator('.process-verbs [role="listitem"]').count()>=5
   assert not re.search(r'firstly|first,|next|finally|after that',card.locator('.process-back').inner_text(),re.I)
   card.click();p.wait_for_function("!document.querySelector('.cs-deck')._cardDeck.busy");assert card.get_attribute('aria-pressed')=='false'
   if i<5:p.locator('.cs-next').click();p.wait_for_function("!document.querySelector('.cs-deck')._cardDeck.busy")
  if batch==0:
   p.screenshot(path='/tmp/how-to-desktop.png',full_page=True)
   p.locator('#processHints').click();assert p.locator('#processHintText').is_visible() and 'Firstly' in p.locator('#processHintText').inner_text()
   p.locator('#processHints').click();assert p.locator('#processHintText').is_hidden()
   p.locator('#processNew').click()
 p.evaluate("startCards('how')");assert p.locator('.process-card').count()==6
 open_task('frg');assert p.locator('.shelf-bank .shelf-food').count()==8
 assert p.locator('#shelfCheck').bounding_box()['x']>p.locator('.open-shelf-fridge').bounding_box()['x']
 assert p.locator('.food-shelf').count()==2 and p.locator('#frtap,.frcats,#frimg').count()==0
 photo_y=p.locator('.open-shelf-fridge').bounding_box()['y']
 first=p.locator('.shelf-food[data-food-type="c"]').first;food=first.get_attribute('data-food');height=first.locator('img').bounding_box()['height']
 drag(first,p.locator('[data-spatial-zone="u"]'))
 moved=p.locator(f'.food-shelf [data-food="{food}"]');assert moved.count()==1
 assert moved.locator('img').bounding_box()['height']==height
 assert moved.evaluate("el=>getComputedStyle(el).transform==='none'&&el.getAnimations().length===0")
 p.locator('#shelfCheck').click();assert p.locator('#shelfFeedback').inner_text().startswith('0 / 1')
 moved.click();assert p.locator(f'.shelf-bank [data-food="{food}"]').count()==1
 # Select food then click the labelled shelf; each shelf holds exactly four objects.
 for key in p.locator('.shelf-food').evaluate_all("els=>els.map(el=>el.dataset.food)"):
  el=p.locator(f'[data-food="{key}"]');kind=el.get_attribute('data-food-type');el.click();p.locator(f'[data-spatial-zone="{kind}"] h3').click()
 assert p.locator('.shelf-bank .shelf-food').count()==0
 assert p.locator('.open-shelf-fridge').bounding_box()['y']==photo_y
 assert all(p.locator(f'[data-spatial-zone="{k}"] .shelf-food').count()==4 for k in ['c','u'])
 p.locator('#shelfCheck').click();assert p.locator('#shelfFeedback').inner_text()=='8 / 8 correct. All sorted!'
 assert p.locator('.food-incorrect').count()==0
 # Food stays inside the relevant shelf, including labels, with no absolute overlapping positions.
 for kind in ['c','u']:
  assert p.locator(f'[data-spatial-zone="{kind}"]').evaluate("el=>{const r=el.getBoundingClientRect();return [...el.querySelectorAll('.shelf-food')].every(b=>{const x=b.getBoundingClientRect();const image=b.querySelector('img').getBoundingClientRect();return x.top>=r.top&&x.bottom<=r.bottom+1&&x.left>=r.left&&x.right<=r.right+1&&image.bottom>=r.bottom-12})}")
 p.screenshot(path='/tmp/sorting-fridge-desktop.png',full_page=True)
 p.locator('#dmnew').click();assert p.locator('.shelf-bank .shelf-food').count()==8 and p.locator('.food-shelf .shelf-food').count()==0
 # A full shelf rejects a fifth item rather than spilling over the photo.
 for key in p.locator('.shelf-food').evaluate_all("els=>els.slice(0,4).map(el=>el.dataset.food)"):
  p.locator(f'[data-food="{key}"]').click();p.locator('[data-spatial-zone="c"] h3').click()
 fifth=p.locator('.shelf-bank .shelf-food').first;fifth.click();p.locator('[data-spatial-zone="c"] h3').click()
 assert p.locator('[data-spatial-zone="c"] .shelf-food').count()==4 and 'full' in p.locator('#shelfFeedback').inner_text()
 for width in [768,390]:
  p.set_viewport_size({'width':width,'height':844})
  for task in ['pkb','how','frg']:
   open_task(task);assert p.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,task)
   if task=='frg':
    for key in p.locator('.shelf-food').evaluate_all("els=>els.map(el=>el.dataset.food)"):
     el=p.locator(f'[data-food="{key}"]');kind=el.get_attribute('data-food-type');el.click();p.locator(f'[data-spatial-zone="{kind}"] h3').click()
    p.locator('#shelfCheck').click();assert 'All sorted' in p.locator('#shelfFeedback').inner_text()
   if task=='how':p.locator('.process-card').first.click()
   if width==390:p.screenshot(path=f'/tmp/practical-mobile-{task}.png',full_page=True)
 assert not missing,missing
 assert not errors,errors
 print(f'Passed: {commands} checked commands across {len(trips)} trips, put/take/replace/remember, 12 one-object process cards and hidden linking words, stable sorting shelves and two responsive widths.')
 b.close()
server.shutdown()
