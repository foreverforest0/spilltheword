"""Real catalogs, evidence pairs, stretch toggle, checking, persistence and touch/keyboard."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from functools import partial
from threading import Thread
from playwright.sync_api import sync_playwright
import json,os
SOURCE=Path(__file__).resolve().parents[1];ROOT=Path(os.environ.get('DEDUCTION_TOGGLE_ROOT',SOURCE));D=json.loads((ROOT/'docs/deduction-toggle-bank.json').read_text());B1=json.loads((ROOT/'docs/revision-room-b1-bank.json').read_text())['words'];B2=json.loads((ROOT/'docs/b2-alh-approved.json').read_text())
for lv,rows in D['levels'].items():
 assert len(rows)==12 and len({t['id'] for t in rows})==12
 for t in rows:
  v=t['vocab'];assert v['word'] in (B1 if lv=='b1' else B2['units'][v['unit']]['ls'][v['lesson']]['v'])
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(Q,directory=str(ROOT)));Thread(target=srv.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{srv.server_port}/'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');errors=[];missing=[];p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.status>=400 and 'favicon' not in r.url else None);p.goto(url)
 for lv,rows in D['levels'].items():
  p.evaluate("go('gram')");p.locator(f'[data-catalog-level="{lv}"]').click()
  if lv=='b1':assert p.locator('[data-grammar-topic]').last.inner_text()=='Revision room'
  p.locator('[data-grammar-topic]').filter(has_text='Modals of deduction').first.click();p.locator(f'[data-grammar-exercise="deduction_toggle_{lv}"]').click();p.locator('#deductionToggle').wait_for()
  assert 'Kindaten' in p.locator('.dt-header h1').evaluate('e=>getComputedStyle(e).fontFamily')
  for i,t in enumerate(rows):
   for mode in ['now','before']:
    if p.locator('#dtToggle').get_attribute('aria-checked')!=str(mode=='before').lower():p.locator('#dtToggle').click()
    assert p.locator('.dt-evidence').inner_text()==t[mode]['facts'];assert p.locator('#dtExample').is_hidden()
    p.locator('#dtAnswer').fill(t[mode]['answer']);p.locator('#dtCheck').click();assert p.locator('#dtFeedback').get_attribute('data-status')=='correct';p.locator('#dtShow').click();assert p.locator('#dtExample p').inner_text()==t[mode]['answer'];p.locator('#dtShow').click()
   if i<11:p.locator('#dtNext').click()
  p.locator('#dtBack').click();assert p.locator(f'[data-catalog-level="{lv}"]').get_attribute('aria-selected')=='true'
 # Direct route, key control, draft persistence and oral comparison.
 p.goto(url+'#g=speak&tp=deduction_toggle_b1&lv=b1');p.locator('#deductionToggle').wait_for()
 for _ in range(11):p.locator('#dtPrev').click()
 p.locator('#dtToggle').focus();p.locator('#dtToggle').press('ArrowLeft');assert p.locator('#dtToggle').get_attribute('aria-checked')=='false';assert p.locator('#dtAnswer').input_value()==D['levels']['b1'][0]['now']['answer'];p.locator('#dtAnswer').fill('A different explanation.');p.locator('#dtCheck').click();assert p.locator('#dtFeedback').get_attribute('data-status')=='review';assert p.locator('#dtExample').is_visible()
 p.locator('#dtToggle').focus();p.locator('#dtToggle').press('Space');assert p.locator('#dtToggle').get_attribute('aria-checked')=='true';assert p.locator('#dtAnswer').input_value()==D['levels']['b1'][0]['before']['answer'];p.screenshot(path='/tmp/deduction-toggle-desktop.png',full_page=True)
 p.reload();p.locator('#deductionToggle').wait_for();assert p.locator('#dtToggle').get_attribute('aria-checked')=='true';p.locator('#dtToggle').click();assert p.locator('#dtAnswer').input_value()=='A different explanation.'
 # Thumb presses stretch; rapid clicks leave the final state correct.
 p.emulate_media(reduced_motion='no-preference');toggle=p.locator('#dtToggle');box=toggle.bounding_box();p.mouse.move(box['x']+100,box['y']+40);p.mouse.down();p.wait_for_timeout(300);assert p.locator('.dt-thumb').evaluate('e=>e.getBoundingClientRect().width')>135;p.mouse.up()
 for _ in range(5):toggle.click()
 p.wait_for_timeout(800);assert toggle.get_attribute('aria-checked')=='false'
 # Mobile retains elastic travel through transitions and fits 320px.
 p.emulate_media(reduced_motion='reduce')
 for width in [390,320]:
  p.set_viewport_size({'width':width,'height':844});assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1');assert 'Kindaten' in p.locator('.dt-header h1').evaluate('e=>getComputedStyle(e).fontFamily');p.screenshot(path=f'/tmp/deduction-toggle-{width}.png',full_page=True)
 touch=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,reduced_motion='reduce');q=touch.new_page();q.goto(url+'#g=speak&tp=deduction_toggle_b2&lv=b2');q.locator('#dtToggle').tap();assert q.locator('#dtToggle').get_attribute('aria-checked')=='true';assert not q.evaluate('document.activeElement.tagName==="TEXTAREA"');q.locator('#dtShow').tap();assert q.locator('#dtExample').is_visible();assert q.locator('#dtFeedback').is_hidden();q.locator('#dtAnswer').fill(D['levels']['b2'][0]['before']['answer']);q.locator('#dtAnswer').press('Control+Enter');assert q.locator('#dtFeedback').get_attribute('data-status')=='correct';touch.close()
 assert not errors,errors;assert not missing,missing;b.close()
srv.shutdown();print('PASS: three real catalogs; 72 branches; approved lexical sources; written and oral use; primary title font; switch, press/stretch, keyboard and touch; separate drafts; reload; 320/390px layout; no JS or resource errors.')
