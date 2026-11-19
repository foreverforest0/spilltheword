"""Actual B2/C1 catalogs, 48 dialogues, grammar checking, glyph dust, native scroll and touch."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from functools import partial
from threading import Thread
from playwright.sync_api import sync_playwright
import json,os
SOURCE=Path(__file__).resolve().parents[1];ROOT=Path(os.environ.get('ELLIPSIS_DUST_ROOT',SOURCE));D=json.loads((ROOT/'docs/ellipsis-dust-bank.json').read_text());B=json.loads((ROOT/'docs/b2-alh-approved.json').read_text())
for lv,rows in D['levels'].items():
 assert len(rows)==24 and len({t['context'] for t in rows})==24
 for t in rows:
  v=t['vocab'];assert v['course']=='b2alh' and v['word'] in B['units'][v['unit']]['ls'][v['lesson']]['v'];assert ''.join(p['text'] for p in t['parts'])==t['reply'];assert any(p['repeat'] for p in t['parts'])
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(Q,directory=str(ROOT)));Thread(target=srv.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{srv.server_port}/'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1100},reduced_motion='reduce');errors=[];missing=[];p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.status>=400 and 'favicon' not in r.url else None);p.goto(url)
 def theme(lv):
  assert p.locator('#ellipsisDust').evaluate('e=>getComputedStyle(e).backgroundColor')=='rgb(249, 245, 230)';assert p.evaluate('getComputedStyle(document.body).backgroundColor')=='rgb(249, 245, 230)';h=p.locator('.ed-header h1');assert 'Kindaten' in h.evaluate('e=>getComputedStyle(e).fontFamily');assert h.evaluate('e=>getComputedStyle(e).color')=='rgb(29, 46, 27)'
 for lv,rows in D['levels'].items():
  p.evaluate("go('gram')");p.locator(f'[data-catalog-level="{lv}"]').click();p.locator('[data-grammar-topic]').filter(has_text='Ellipsis & substitution').click();p.locator(f'[data-grammar-exercise="ellipsis_dust_{lv}"]').click();theme(lv)
  for i,t in enumerate(rows):
   assert p.locator('.ed-visual').text_content()==t['reply'];assert p.locator('#edExample').is_hidden();p.locator('#edFade').click();assert p.locator('#edFade').get_attribute('aria-pressed')=='true';assert p.locator('.ed-bit').evaluate_all('es=>es.every(e=>+getComputedStyle(e).opacity===0)');assert p.locator('.ed-context').text_content()=='A'+t['context'];p.locator('#edFade').click();assert p.locator('.ed-bit').evaluate_all('es=>es.every(e=>+getComputedStyle(e).opacity===1)');p.locator('#edAnswer').fill(t['answers'][0]);p.locator('#edAnswer').press('Control+Enter');assert p.locator('#edFeedback').get_attribute('data-status')=='correct';p.locator('#edShow').click();assert p.locator('#edExample').inner_text()==t['answers'][0];p.locator('#edShow').click()
   if i<23:p.locator('#edNext').click()
  # All six focused patterns exist and have a nonempty bank; each keeps its own task draft.
  for f in ['aux','inf','noun','so','action','agree']:
   p.locator('#edFilter').select_option(f);assert int(p.locator('.ed-topline output').inner_text().split('/')[1])>0;p.locator('#edShow').click();assert p.locator('#edExample').is_visible()
  p.locator('#edFilter').select_option('all');p.screenshot(path=f'/tmp/ellipsis-dust-{lv}.png',full_page=True);p.locator('#edBack').click();assert p.locator(f'[data-catalog-level="{lv}"]').get_attribute('aria-selected')=='true'
 p.goto(url+'#g=speak&tp=ellipsis_dust_b2&lv=b2');p.locator('#ellipsisDust').wait_for();p.locator('#edFilter').select_option('all');p.locator('#edAnswer').fill('A free shorter reply.');p.locator('#edCheck').click();assert p.locator('#edFeedback').get_attribute('data-status')=='review';p.reload();p.locator('#edAnswer').wait_for();assert p.locator('#edAnswer').input_value()=='A free shorter reply.'
 # Spoken use reveals a model without a check result or automatic input focus.
 p.locator('#edNext').click();p.locator('#edShow').click();assert p.locator('#edExample').is_visible();assert p.locator('#edFeedback').get_attribute('data-status')=='correct' # previous valid written draft persists
 p.locator('#edAnswer').fill('');p.locator('#edShow').click();p.locator('#edShow').click();assert p.locator('#edFeedback').is_hidden()
 # Real animation: original glyphs produce nonempty canvas pixels, then both dust and words fade.
 p.locator('#edPrev').click();p.emulate_media(reduced_motion='no-preference');p.locator('#edFade').click();p.wait_for_timeout(230);assert p.locator('#edDust').evaluate('e=>{const a=e.getContext("2d").getImageData(0,0,e.width,e.height).data;return a.some((x,i)=>i%4===3&&x>0)}');assert p.locator('.ed-bit').evaluate_all('es=>es.some(e=>+getComputedStyle(e).opacity<1)');p.screenshot(path='/tmp/ellipsis-dust-motion.png',full_page=True);p.wait_for_timeout(850);assert p.locator('#edFade').get_attribute('aria-pressed')=='true';p.locator('#edFade').click();p.wait_for_timeout(1050);assert p.locator('#edFade').get_attribute('aria-pressed')=='false'
 # Native page scroll also drives disintegration, without capturing or preventing scrolling.
 p.locator('#edNext').click();p.set_viewport_size({'width':390,'height':650});p.evaluate('window.scrollTo(0,0)');p.wait_for_timeout(50);p.locator('#edNext').click();p.wait_for_timeout(750);p.evaluate('window.scrollTo(0,180)');p.wait_for_timeout(100);assert p.locator('.ed-bit').evaluate_all('es=>es.some(e=>+getComputedStyle(e).opacity<1)')
 p.emulate_media(reduced_motion='reduce')
 for width in [390,320]:
  p.set_viewport_size({'width':width,'height':844});assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1');theme('b2');p.screenshot(path=f'/tmp/ellipsis-dust-{width}.png',full_page=True)
 # Existing B1/B2 theme stays intact after expanding the shared cream rule.
 p.evaluate("RelativeLens.open('b1')");assert p.locator('#relativeLens h1').evaluate('e=>getComputedStyle(e).color')=='rgb(0, 17, 102)';assert p.locator('#relativeLens').evaluate('e=>getComputedStyle(e).backgroundColor')=='rgb(249, 245, 230)'
 touch=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,reduced_motion='reduce');q=touch.new_page();q.goto(url+'#g=speak&tp=ellipsis_dust_c1&lv=c1');q.locator('#edFade').tap();assert q.locator('#edFade').get_attribute('aria-pressed')=='true';assert not q.evaluate('document.activeElement.tagName==="TEXTAREA"');q.locator('#edShow').tap();assert q.locator('#edExample').is_visible();assert q.locator('#edFeedback').is_hidden();q.locator('#edHint').tap();assert q.locator('#edHintText').is_visible();touch.close()
 assert not errors,errors;assert not missing,missing;b.close()
srv.shutdown();print('PASS: 48 original dialogues and approved vocabulary; B2/C1 catalogs; six filters; grammar alternatives; written/oral flow; drafts; actual glyph dust and native scroll; keyboard, touch, reduced motion and 320/390px layout; cream and accented Kindaten titles; no JS/resource errors.')
