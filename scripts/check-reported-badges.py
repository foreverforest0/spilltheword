"""Actual catalog entries, original portraits, quote-only fronts, flip, checking and oral mode."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from functools import partial
from threading import Thread
from playwright.sync_api import sync_playwright
import json,hashlib,os
SOURCE=Path(__file__).resolve().parents[1];ROOT=Path(os.environ.get('REPORTED_BADGES_ROOT',SOURCE));data=json.loads((SOURCE/'docs/reported-badges-bank.json').read_text());manifest=json.loads((ROOT/'assets/reported-badges/manifest.json').read_text());assert hashlib.sha256((ROOT/manifest['image']).read_bytes()).hexdigest()==manifest['sha256']
b1=json.loads((SOURCE/'docs/revision-room-b1-bank.json').read_text())['words'];b2=json.loads((SOURCE/'docs/b2-alh-approved.json').read_text())
for lv,rows in data['levels'].items():
 assert len(rows)==24 and len({t['quote'] for t in rows})==24
 for t in rows:
  assert t['speaker'] in range(4);v=t['vocab']
  if lv=='b1':assert v['course']=='b1' and v['word'] in b1 and not t['focus']
  else:assert v['course']=='b2alh' and v['word'] in b2['units'][v['unit']]['ls'][v['lesson']]['v']
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(Q,directory=str(ROOT)));Thread(target=srv.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{srv.server_port}/'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1000});errors=[];missing=[];p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.status>=400 and 'favicon' not in r.url else None);p.goto(url)
 for lv,rows in data['levels'].items():
  p.evaluate("go('gram')");p.locator(f'[data-catalog-level="{lv}"]').click()
  if lv=='b1':assert p.locator('[data-grammar-topic]').last.inner_text()=='Revision room'
  p.locator('[data-grammar-topic]').filter(has_text='Reported speech').first.click();p.locator(f'[data-grammar-exercise="reported_badges_{lv}"]').click();assert p.locator('.rbadge-slot').count()==4
  assert p.locator('.rbadge-name').all_text_contents()==[x['name'] for x in manifest['portraits']]
  for page in range(6):
   for i,t in enumerate(rows[page*4:page*4+4]):
    card=p.locator(f'[data-badge="{t["id"]}"]');assert card.locator('.rbadge-quote').inner_text()=='“'+t['quote']+'”';assert card.locator('.rbadge-front .rbadge-focus, .rbadge-front textarea').count()==0
    assert card.locator('.rbadge-quote').evaluate('e=>e.getBoundingClientRect().bottom<=e.parentElement.querySelector(".rbadge-front-footer").getBoundingClientRect().top+1'),t['id']
   if page<5:p.locator('#rbadgeNext').click()
  for _ in range(5):p.locator('#rbadgePrev').click()
  p.screenshot(path=f'/tmp/reported-badges-front-{lv}.png',full_page=True)
  t=rows[0];id=t['id'];front=p.locator(f'.rbadge-front[data-flip="{id}"]');front.click();p.wait_for_timeout(800);assert p.locator(f'[data-badge="{id}"]').get_attribute('class').endswith('rbadge-flipped');assert front.evaluate('e=>e.inert');inp=p.locator(f'[data-badge-answer="{id}"]');inp.fill(p.evaluate('id=>ReportedBadges.example(id)',id));p.locator(f'[data-check="{id}"]').click();assert p.locator(f'[data-feedback="{id}"]').get_attribute('data-status')=='correct'
  assert p.locator(f'[data-example="{id}"]').is_hidden();p.locator(f'[data-oral="{id}"]').click();assert p.locator(f'[data-example="{id}"]').is_visible();p.screenshot(path=f'/tmp/reported-badges-back-{lv}.png',full_page=True)
  # Input never resets the flip or marks an unsupported free paraphrase ungrammatical.
  inp.fill('A different free paraphrase of this quote.');p.locator(f'[data-check="{id}"]').click();assert p.locator(f'[data-feedback="{id}"]').get_attribute('data-status')=='review';assert p.locator(f'[data-badge="{id}"]').get_attribute('class').endswith('rbadge-flipped')
  p.locator('#rbadgeBack').click();assert p.locator(f'[data-catalog-level="{lv}"]').get_attribute('aria-selected')=='true'
 # Written answers persist; oral-only comparison does not create a fake checked result.
 p.goto(url+'#g=speak&tp=reported_badges_b1&lv=b1');p.locator('#reportedBadges').wait_for();assert p.locator('[data-badge-answer="b1-01"]').input_value()=='A different free paraphrase of this quote.'
 p.locator('.rbadge-front[data-flip="b1-02"]').click();p.wait_for_timeout(800);p.locator('[data-oral="b1-02"]').click();assert p.locator('[data-example="b1-02"]').is_visible();assert p.locator('[data-feedback="b1-02"]').is_hidden()
 p.locator('[data-badge-answer="b1-02"]').fill("Leo said he's watching that comedy everyone keeps quoting.");p.locator('[data-badge-answer="b1-02"]').press('Control+Enter');assert p.locator('[data-feedback="b1-02"]').get_attribute('data-status')=='correct';p.locator('[data-badge-answer="b1-02"]').press('Escape');assert not p.locator('[data-badge="b1-02"]').get_attribute('class').endswith('rbadge-flipped')
 # Small screens keep the same readable badge dimensions in a horizontal rail.
 p.emulate_media(reduced_motion='reduce')
 for width in [390,320]:
  p.set_viewport_size({'width':width,'height':844});assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1');rail=p.locator('.rbadge-rail');assert rail.evaluate('e=>e.scrollWidth>e.clientWidth');rail.evaluate('e=>e.scrollLeft=e.scrollWidth');card=p.locator('[data-badge="b1-04"]');card.locator('.rbadge-front').click();p.wait_for_timeout(50);assert card.locator('textarea').is_editable();p.screenshot(path=f'/tmp/reported-badges-{width}.png',full_page=True);card.locator('.rbadge-return').click()
 # A real touch context opens the back without forcing an onscreen keyboard; oral use remains one tap.
 touch=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,reduced_motion='reduce');q=touch.new_page();q.goto(url+'#g=speak&tp=reported_badges_b2&lv=b2');q.locator('.rbadge-front').first.tap();q.wait_for_timeout(50);assert q.evaluate('document.activeElement.classList.contains("rbadge-back")');q.locator('[data-oral="b2-01"]').tap();assert q.locator('[data-example="b2-01"]').is_visible();assert q.locator('[data-feedback="b2-01"]').is_hidden();touch.close()
 assert not errors,errors;assert not missing,missing;b.close()
print('PASS: B1/B2/C1 catalogs, 72 quotes and lexical sources; four unchanged reference portraits; front-only quotes; readable card bounds; flip/inert faces; written checks; oral comparison without fake grading; drafts, keyboard and 320/390px horizontal rail.')
srv.shutdown()
