"""Check story-based packing, image-only ownership fronts and the two clock tasks."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(Path(__file__).resolve().parents[1])))
Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 p=browser.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');errors=[];missing=[]
 p.on('pageerror',lambda e:errors.append(str(e)))
 p.on('response',lambda r:missing.append(r.url) if r.status==404 else None)
 p.goto(f'http://127.0.0.1:{server.server_port}/');p.wait_for_timeout(150)
 p.evaluate("go('gram');S.splevel='kids';spOpen('bag')")
 titles=set()
 for i in range(8):
  title=p.locator('.story-bag-stage').get_attribute('data-story-title');assert title not in titles; titles.add(title)
  story=p.evaluate("title=>BAG_STORIES.find(s=>s.title===title)",title)
  assert p.locator('#dmhint').count()==0
  p.locator('#bagCheck').click();assert 'missing' in p.locator('#bagResult').inner_text()
  for key in story['need']:p.locator(f'[data-bag-item="{key}"]').click()
  p.locator(f'[data-bag-item="{story["leave"][0]}"]').click();p.locator('#bagCheck').click()
  assert '1 extra' in p.locator('#bagResult').inner_text()
  p.locator(f'[data-bag-item="{story["leave"][0]}"]').click();p.locator('#bagCheck').click()
  assert p.locator('#bagResult').inner_text().startswith('Correct!')
  assert p.locator('.bag-packed .bag-item').count()==len(story['need'])
  if i==0:p.screenshot(path='/tmp/bag-story-desktop.png',full_page=True)
  if i<7:p.locator('#dmnew').click()
 # The same item must also move both ways using pointer drag.
 p.locator('#dmnew').click();item=p.locator('.bag-items .bag-item').first;key=item.get_attribute('data-bag-item')
 box=item.bounding_box();zone=p.locator('.bag-zone').bounding_box()
 p.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);p.mouse.down();p.mouse.move(zone['x']+30,zone['y']+50,steps=10);p.mouse.up()
 assert p.locator(f'.bag-packed [data-bag-item="{key}"]').count()==1
 p.locator(f'[data-bag-item="{key}"]').click();assert p.locator(f'.bag-items [data-bag-item="{key}"]').count()==1
 p.evaluate("go('gram');S.splevel='a1';spOpen('hwh')");p.wait_for_timeout(150)
 assert p.locator('.stw-board-card').count()>0
 assert p.locator('.stw-board-card .stw-prompt-copy').count()==0
 assert p.locator('.stw-board-card .hwh-object-pictures img').count()==4*p.locator('.stw-board-card').count()
 p.screenshot(path='/tmp/who-has-what-desktop.png',full_page=True)
 p.locator('.cbc').first.click();p.wait_for_timeout(300)
 assert p.locator('.cbbig .cbq2').inner_text().strip()
 # Read-the-clock answers cover every minute, standard spoken forms and common variants.
 total=p.evaluate("""()=>{let n=0;for(let h=0;h<24;h++)for(let m=0;m<60;m++){
 for(const a of [tDig(h,m),h+':'+two(m),tSay1(h,m),tSay2(h,m),'It is '+tSay1(h,m),h12(h)+'.'+two(m)]){if(!clockAnswerMatches(a,h,m))throw Error('Rejected '+a+' for '+h+':'+m);n++}
 if(clockAnswerMatches(tDig(h,(m+1)%60),h,m))throw Error('Accepted wrong minute');
 if(clockAnswerMatches(tDig((h+12)%24,m),h,m))throw Error('Accepted wrong period');
 }if(!clockAnswerMatches(\"It's a quarter past seven\",7,15))throw Error('a quarter');return n}""")
 assert total==8640
 p.evaluate("go('gram');S.splevel='kids';spOpen('clk')");p.wait_for_timeout(100)
 assert p.locator('#clklv,#clkap').count()==0
 st=p.locator('.independent-clock-stage');dial=p.locator('.clock-dial svg');r=dial.bounding_box();cx=r['x']+r['width']/2;cy=r['y']+r['height']/2
 # Minute hand: grab near its tip and move to 15. Hour remains six.
 p.mouse.move(cx,cy-r['height']*.33);p.mouse.down();p.mouse.move(cx+r['width']*.33,cy,steps=8);p.mouse.up()
 assert st.get_attribute('data-hour')=='6' and st.get_attribute('data-minute')=='15'
 # Hour hand: grab its lower tip and move to nine. Minute remains 15.
 p.mouse.move(cx,cy+r['height']*.2);p.mouse.down();p.mouse.move(cx-r['width']*.2,cy,steps=8);p.mouse.up()
 assert st.get_attribute('data-hour')=='9' and st.get_attribute('data-minute')=='15'
 p.locator('#clockPeriod').click();assert st.get_attribute('data-hour')=='21'
 p.locator('#clockPeriod').focus();p.keyboard.press('Enter');assert st.get_attribute('data-hour')=='9'
 target_h=int(st.get_attribute('data-target-hour'));target_m=int(st.get_attribute('data-target-minute'))
 if target_h>=12:p.locator('#clockPeriod').click()
 p.locator('#clkH').focus()
 for _ in range((target_h%12-9)%12):p.keyboard.press('ArrowRight')
 p.locator('#clkM').focus()
 for _ in range((target_m-15)%60):p.keyboard.press('ArrowRight')
 p.locator('#clockCheck').click();assert p.locator('#clockResult').inner_text().startswith('Correct!')
 p.screenshot(path='/tmp/clock-hands-desktop.png',full_page=True)
 # When hands overlap, the inner grip must still pick the shorter hand.
 p.locator('#clkH').focus()
 for _ in range((12-target_h%12)%12):p.keyboard.press('ArrowRight')
 p.locator('#clkM').focus()
 for _ in range((60-target_m)%60):p.keyboard.press('ArrowRight')
 p.mouse.move(cx,cy-r['height']*.2);p.mouse.down();p.mouse.move(cx+r['width']*.2,cy,steps=8);p.mouse.up()
 assert int(st.get_attribute('data-hour'))%12==3 and st.get_attribute('data-minute')=='0'

 p.evaluate("go('gram');S.splevel='a1';spOpen('tim')");page=p.locator('.flip-time-page');p.wait_for_timeout(100)
 assert page.locator('button').count()==1 and page.locator('button').inner_text()=='Clear',page.locator('button').all_text_contents()
 get_time=lambda:(int(page.get_attribute('data-hour')),int(page.get_attribute('data-minute')))
 old=get_time();answer=p.evaluate('([h,m])=>tSay1(h,m)',list(old));p.locator('#flipAnswer').fill(answer);p.wait_for_timeout(550)
 assert p.locator('#flipFeedback').inner_text()=='Correct!'
 p.locator('#flipClear').click();p.wait_for_timeout(2300);assert get_time()==old and not p.locator('#flipAnswer').input_value()
 p.locator('#flipAnswer').fill(answer);p.wait_for_timeout(550);assert p.locator('#flipFeedback').inner_text()=='Correct!'
 p.wait_for_timeout(2300);assert get_time()!=old and not p.locator('#flipAnswer').input_value()
 p.screenshot(path='/tmp/flip-time-desktop.png',full_page=True)
 for task in ['bag','clk','tim','hwh']:
  p.set_viewport_size({'width':390,'height':844});p.evaluate("id=>{go('gram');S.splevel='a1';spOpen(id)}",task);p.wait_for_timeout(150)
  assert p.evaluate('document.documentElement.scrollWidth<=innerWidth'),task
  p.screenshot(path=f'/tmp/bag-time-mobile-{task}.png',full_page=True)
 assert not missing,missing
 assert not errors,errors
 print(f'Passed: {len(titles)} packing stories, pointer transfers, image-only ownership fronts, independent hands/AM-PM, {total} clock answers, auto-check/Clear and four mobile layouts.')
 browser.close()
server.shutdown()
