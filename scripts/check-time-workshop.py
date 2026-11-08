"""Functional coverage for marked-word corrections and the large daily planner."""
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
 p.evaluate("go('gram');S.splevel='a1';spOpen('fxt')");page=p.locator('.fix-time-page')
 assert page.locator('button').all_text_contents()==['Cancel']
 assert page.locator('.fix-sentence-card').count()==1
 assert p.evaluate("typeof RoughNotation.annotate==='function'")
 sentence=page.get_attribute('data-sentence');marks=set()
 for _ in range(3):
  p.locator('[data-fix-word="0"]').click();marks.add(page.get_attribute('data-annotation'))
  assert page.locator('svg.rough-annotation path').count()>0
  assert p.evaluate("""()=>{const word=document.querySelector('.fix-word[aria-pressed=true]').getBoundingClientRect(),svg=document.querySelector('svg.rough-annotation'),origin=svg.getBoundingClientRect(),bounds=svg.getBBox();return Math.abs(word.x+word.width/2-origin.x-bounds.x-bounds.width/2)<15&&Math.abs(word.y+word.height/2-origin.y-bounds.y-bounds.height/2)<15}"""),'Annotation must cover the selected word'
  p.locator('#fixReplacement').fill('at');p.locator('#fixReplacement').press('Enter')
  assert p.locator('#fixFeedback').inner_text()=='Try another word or correction.'
  p.locator('#fixCancel').click();assert page.get_attribute('data-sentence')==sentence
  assert page.locator('svg.rough-annotation').count()==0 and not page.locator('.fix-editor').is_visible()
 assert marks=={'circle','strike-through','crossed-off'},marks
 seen=set()
 for i in range(12):
  current=page.get_attribute('data-sentence');assert current not in seen;seen.add(current)
  row=p.evaluate("s=>{const pair=FXT.find(r=>r[0]===s),a=pair[0].split(' '),b=pair[1].split(' ');return {index:a.findIndex((w,i)=>w!==b[i]),answer:b[a.findIndex((w,i)=>w!==b[i])]}}",current)
  p.locator(f'[data-fix-word="{row["index"]}"]').focus();p.keyboard.press('Enter')
  if i==0:
   p.screenshot(path='/tmp/fix-time-selected.png',full_page=True)
   # Cancel after a correct answer cancels the scheduled advance, preserving this sentence.
   p.locator('#fixReplacement').fill(row['answer']);p.wait_for_timeout(550);assert p.locator('#fixFeedback').inner_text().startswith('Correct!')
   p.locator('#fixCancel').click();p.wait_for_timeout(2100);assert page.get_attribute('data-sentence')==current
   p.locator(f'[data-fix-word="{row["index"]}"]').click()
  p.locator('#fixReplacement').fill(row['answer']);p.wait_for_timeout(550)
  assert p.locator('#fixFeedback').inner_text().startswith('Correct!')
  p.wait_for_timeout(2100)
  assert page.get_attribute('data-sentence')!=current
 # The old Grammar Lab entry must also open the same mechanic.
 p.evaluate("GL={g:WG.find(g=>g.id==='ftt')};glGameRender()")
 assert p.locator('.fix-time-page').count()==1 and p.locator('.fix-time-page button').all_text_contents()==['Cancel']
 # Leaving with a selected word must remove its annotation and delayed checks.
 p.locator('[data-fix-word="0"]').click();p.locator('#fixReplacement').fill('at')
 p.evaluate("go('gram');S.splevel='a1';spOpen('bmd')");p.wait_for_timeout(100)
 assert p.locator('.rough-annotation').count()==0
 assert p.locator('.day-bank .day-activity').count()==14
 assert p.locator('.day-picture img').first.bounding_box()['height']>=100
 assert p.locator('.day-period').count()==3
 p.screenshot(path='/tmp/build-my-day-empty.png',full_page=True)
 def activity(key):return p.locator(f'[data-day-activity="{key}"]')
 def place(key,period):
  activity(key).click();p.locator(f'[data-spatial-zone="{period}"]').click(position={'x':20,'y':24})
 def input_for(key):return p.locator(f'[data-event="{key}"] input')
 # Real pointer drag into Morning.
 box=activity('aclock').bounding_box();zone=p.locator('[data-spatial-zone="morning"]').bounding_box()
 p.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);p.mouse.down();p.mouse.move(zone['x']+zone['width']/2,zone['y']+130,steps=12);p.mouse.up()
 assert p.locator('[data-spatial-zone="morning"] .day-activity').count()==1
 assert input_for('aclock').input_value()=='07:00'
 place('bread','morning');assert input_for('bread').input_value()=='07:30'
 place('computer','afternoon');place('bed','evening')
 input_for('aclock').fill('06:45');input_for('aclock').dispatch_event('change')
 p.locator('#dayTell').click();sentences=p.locator('#dayStory li').all_text_contents()
 assert sentences[0]=='I get up at 6:45 AM.' and sentences[-1]=='I go to bed at 7:00 PM.',sentences
 # Moving the time into a different period moves its card and updates the spoken day.
 input_for('bread').fill('17:15');input_for('bread').dispatch_event('change')
 assert p.locator('[data-spatial-zone="afternoon"] [data-event="bread"]').count()==1
 assert p.locator('#dayStory li').all_text_contents()[2]=='I have breakfast at 5:15 PM.'
 # Existing events move by drag without cloning the item or leaving an empty old wrapper.
 box=activity('computer').bounding_box();zone=p.locator('[data-spatial-zone="evening"]').bounding_box()
 p.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);p.mouse.down();p.mouse.move(zone['x']+zone['width']/2,zone['y']+130,steps=12);p.mouse.up()
 assert p.locator('[data-spatial-zone="evening"] [data-event="computer"]').count()==1
 assert p.locator('[data-event="computer"]').count()==1
 p.screenshot(path='/tmp/build-my-day-desktop.png',full_page=True)
 activity('bread').click();assert p.locator('.day-bank [data-day-activity="bread"]').count()==1
 assert p.locator('[data-event="bread"]').count()==0
 assert not any('breakfast' in s for s in p.locator('#dayStory li').all_text_contents())
 # Keyboard selection / period placement works without dragging.
 activity('phone').focus();p.keyboard.press('Enter');p.locator('[data-spatial-zone="evening"]').focus();p.keyboard.press('Enter')
 assert p.locator('[data-event="phone"]').count()==1
 # Every activity has a reachable, non-overlapping event and returns to the bank cleanly.
 for i,key in enumerate(p.evaluate('BMD.map(d=>d[0])')):
  if activity(key).get_attribute('data-placed')!='true':place(key,['morning','afternoon','evening'][i%3])
 assert p.locator('.day-event').count()==14 and p.locator('.day-bank .day-activity').count()==0
 for key in p.evaluate('BMD.map(d=>d[0])'):activity(key).click()
 assert p.locator('.day-event').count()==0 and p.locator('.day-bank .day-activity').count()==14
 for width in [1024,768,390]:
  p.set_viewport_size({'width':width,'height':844})
  for task in ['fxt','bmd']:
   p.evaluate("id=>{go('gram');S.splevel='a1';spOpen(id)}",task);p.wait_for_timeout(120)
   assert p.evaluate('document.documentElement.scrollWidth<=innerWidth'),(task,width)
   if task=='fxt':
    p.locator('[data-fix-word="0"]').click();p.set_viewport_size({'width':width,'height':850});p.wait_for_timeout(60)
    assert p.locator('svg.rough-annotation path').count()>0
   else:place('aclock','morning');place('bed','evening');p.locator('#dayTell').click()
   if width==390:p.screenshot(path=f'/tmp/time-workshop-mobile-{task}.png',full_page=True)
 # Verify that real motion draws the stroke rather than just displaying a static mark.
 p.emulate_media(reduced_motion='no-preference');p.evaluate("go('gram');S.splevel='a1';spOpen('fxt')")
 p.locator('[data-fix-word="0"]').click()
 assert p.locator('svg.rough-annotation path').first.evaluate("e=>e.style.animation.includes('rough-notation-dash')")
 p.wait_for_timeout(700)
 assert p.locator('svg.rough-annotation path').first.evaluate("e=>parseFloat(getComputedStyle(e).strokeDashoffset)")==0
 p.locator('#fixCancel').click();assert p.locator('svg.rough-annotation').count()==0
 assert not missing,missing
 assert not errors,errors
 print('Passed: 12 single-sentence corrections, all three Rough Notation marks, Cancel/timers, legacy entry, 14 routine cards, drag/time editing/sorting/return, keyboard and three responsive widths.')
 b.close()
server.shutdown()
