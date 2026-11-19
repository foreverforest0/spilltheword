"""Real catalogs, 72 text-only tasks, glass lens discovery, checking and site theme."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from functools import partial
from threading import Thread
from playwright.sync_api import sync_playwright
import json,os
SOURCE=Path(__file__).resolve().parents[1];ROOT=Path(os.environ.get('RELATIVE_LENS_ROOT',SOURCE));D=json.loads((ROOT/'docs/relative-lens-bank.json').read_text());B1=json.loads((ROOT/'docs/revision-room-b1-bank.json').read_text())['words'];B2=json.loads((ROOT/'docs/b2-alh-approved.json').read_text())
for lv,scenes in D['levels'].items():
 assert len(scenes)==6
 for s in scenes:
  assert len(s['tasks']) in range(3,6)
  for t in s['tasks']:
   v=t['vocab'];assert v['word'] in (B1 if lv=='b1' else B2['units'][v['unit']]['ls'][v['lesson']]['v']);assert len(t['facts'])==2
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(Q,directory=str(ROOT)));Thread(target=srv.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{srv.server_port}/'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1100},reduced_motion='reduce');errors=[];missing=[];p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.status>=400 and 'favicon' not in r.url else None);p.goto(url)
 def theme(root,lv):
  assert p.locator(root).evaluate('e=>getComputedStyle(e).backgroundColor')=='rgb(249, 245, 230)'
  assert p.evaluate('getComputedStyle(document.body).backgroundColor')=='rgb(249, 245, 230)'
  title=p.locator(root+' h1');assert 'Kindaten' in title.evaluate('e=>getComputedStyle(e).fontFamily');assert title.evaluate('e=>getComputedStyle(e).color')==('rgb(0, 17, 102)' if lv=='b1' else 'rgb(29, 46, 27)')
 for lv,scenes in D['levels'].items():
  p.evaluate("go('gram')");p.locator(f'[data-catalog-level="{lv}"]').click()
  if lv=='b1':assert p.locator('[data-grammar-topic]').last.inner_text()=='Revision room'
  p.locator('[data-grammar-topic]').filter(has_text='Relative clauses').first.click();p.locator(f'[data-grammar-exercise="relative_lens_{lv}"]').click();theme('#relativeLens',lv);assert p.locator('#relativeLens img, #relativeLens canvas').count()==0
  for si,s in enumerate(scenes):
   for ti,t in enumerate(s['tasks']):
    p.locator(f'#rlPaper>.rl-sheet-content [data-fact="{ti}"]').click();assert p.locator('.rl-selected-facts p').all_text_contents()==t['facts'];p.locator('#rlAnswer').fill(t['answers'][0]);p.locator('#rlCheck').click();assert p.locator('#rlFeedback').get_attribute('data-status')=='correct';p.locator('#rlShow').click();assert p.locator('#rlExample p').inner_text()==t['answers'][0];p.locator('#rlShow').click()
   if si<5:p.locator('#rlNext').click()
  p.screenshot(path=f'/tmp/relative-lens-{lv}.png',full_page=True);p.locator('#rlBack').click();assert p.locator(f'[data-catalog-level="{lv}"]').get_attribute('aria-selected')=='true'
 # Earlier reference activities also retain cream, primary title face and each level's accent.
 for api,root in [('DeductionToggle','#deductionToggle'),('ReportedBadges','#reportedBadges'),('ConditionalFolders','#cfPage')]:
  for lv in ['b1','b2','c1']:p.evaluate('([api,lv])=>window[api].open(lv)',[api,lv]);theme(root,lv)
 p.goto(url+'#g=speak&tp=relative_lens_b1&lv=b1');p.locator('#relativeLens').wait_for()
 for _ in range(5):p.locator('#rlPrev').click()
 row=p.locator('#rlPaper>.rl-sheet-content [data-fact="0"]');row.focus();row.press('ArrowDown');assert p.locator('#rlPaper>.rl-sheet-content [data-fact="1"]').get_attribute('aria-pressed')=='true';p.locator('#rlAnswer').fill('My own spoken or written version.');p.locator('#rlAnswer').press('Control+Enter');assert p.locator('#rlFeedback').get_attribute('data-status')=='review';p.reload();p.locator('#rlAnswer').wait_for();assert p.locator('#rlAnswer').input_value()=='My own spoken or written version.'
 # Lens follows the actual pointer and magnifies text; clone is inert, hidden from AT and contains no answer.
 paper=p.locator('#rlPaper');box=paper.bounding_box();p.mouse.move(box['x']+100,box['y']+200);p.wait_for_timeout(50);left1=p.locator('#rlLens').evaluate('e=>parseFloat(e.style.left)');p.mouse.move(box['x']+box['width']-100,box['y']+350);p.wait_for_timeout(50);left2=p.locator('#rlLens').evaluate('e=>parseFloat(e.style.left)');assert left2>left1+50;assert p.locator('#rlLensCopy').evaluate('e=>e.inert');assert p.locator('#rlLens').get_attribute('aria-hidden')=='true';assert p.locator('#rlLensCopy #rlAnswer,#rlLensCopy #rlExample').count()==0;assert p.locator('#rlLensCopy .rl-detail').first.evaluate('e=>getComputedStyle(e).filter')=='none';assert p.locator('#rlLensCopy').evaluate('e=>getComputedStyle(e).transform').startswith('matrix(1.4')
 for width in [390,320]:
  p.set_viewport_size({'width':width,'height':844});p.wait_for_timeout(50);assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1');theme('#relativeLens','b1');p.screenshot(path=f'/tmp/relative-lens-{width}.png',full_page=True)
 touch=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,reduced_motion='reduce');q=touch.new_page();q.goto(url+'#g=speak&tp=relative_lens_b2&lv=b2');q.locator('#rlPaper>.rl-sheet-content [data-fact="2"]').tap();assert q.locator('#rlPaper>.rl-sheet-content [data-fact="2"]').get_attribute('aria-pressed')=='true';assert not q.evaluate('document.activeElement.tagName==="TEXTAREA"');assert q.locator('#rlExercise').evaluate('e=>e.getBoundingClientRect().top>=0&&e.getBoundingClientRect().bottom<=innerHeight+1');q.locator('#rlShow').tap();assert q.locator('#rlExample').is_visible();assert q.locator('#rlFeedback').is_hidden();touch.close()
 assert not errors,errors;assert not missing,missing;b.close()
srv.shutdown();print('PASS: 72 tasks, three catalogs, approved lexical sources, text-only magnification, inert accessible clone, keyboard/touch, independent drafts and oral use; 320/390px layout; cream and level-coloured Kindaten titles across all four reference activities; no JS/resource errors.')
