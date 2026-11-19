"""Open through Kids catalog, explore all saved scenes, mark/zoom and persist progress."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from functools import partial
from threading import Thread
from playwright.sync_api import sync_playwright
import os
ROOT=Path(os.environ.get('KIDS_SEARCH_ROOT',Path(__file__).resolve().parents[1]))
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(Q,directory=str(ROOT)));Thread(target=srv.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1000});errors=[];missing=[];p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.status>=400 and 'favicon' not in r.url else None)
 p.goto(f'http://127.0.0.1:{srv.server_port}/');p.evaluate("go('gram')");p.locator('[data-catalog-level="kids"]').click();p.locator('[data-grammar-topic]').filter(has_text='Find & say').click();p.locator('[data-grammar-exercise="kids_search"]').click();assert p.locator('.ks-page').is_visible()
 assert p.evaluate('KidsSearch.scenes.length')==3
 for n in range(3):
  p.locator(f'[data-ks-scene="{n}"]').click();p.locator('#ksImage').evaluate('(i)=>i.decode()');assert not p.locator('.ks-key').get_attribute('open')
  for i in range(12):
   assert p.locator('.ks-count').inner_text()==f'{i+1} / 12';assert p.locator('#ksPrompt').inner_text()==p.evaluate(f'KidsSearch.scenes[{n}].tasks[{i}].prompt');p.locator('#ksNext').click()
  assert p.locator('.ks-count').inner_text()=='1 / 12'
 p.locator('#ksPlus').click();assert p.locator('#ksZoom').inner_text()=='150%';assert p.locator('#ksViewport').evaluate('e=>e.scrollWidth>e.clientWidth')
 # Choose a visible location after zoom, then ensure marker stays tied to image coordinates.
 p.locator('#ksImage').click(position={'x':550,'y':300});assert p.locator('#ksMarker').is_visible();left=p.locator('#ksMarker').evaluate('e=>e.style.left');p.locator('#ksFit').click();assert p.locator('#ksMarker').evaluate('e=>e.style.left')==left;assert p.locator('#ksZoom').inner_text()=='100%'
 p.locator('.ks-key summary').click();assert p.locator('.ks-key p').is_visible();p.locator('#ksNext').click();assert not p.locator('#ksMarker').is_visible();assert not p.locator('.ks-key').get_attribute('open')
 p.screenshot(path='/tmp/kids-search-desktop.png',full_page=True)
 p.reload();p.evaluate("go('gram');S.splevel='kids';spOpen('kids_search')");assert p.locator('.ks-count').inner_text()=='2 / 12';assert p.locator('[data-ks-scene="2"]').get_attribute('aria-pressed')=='true'
 for width in [390,320]:
  p.set_viewport_size({'width':width,'height':844});assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1');assert p.locator('#ksPrompt').is_visible();p.screenshot(path=f'/tmp/kids-search-{width}.png',full_page=True)
 p.goto(f'http://127.0.0.1:{srv.server_port}/#g=speak&tp=kids_search&lv=kids');p.locator('.ks-page').wait_for(state='visible')
 assert not errors,errors;assert not missing,missing
 b.close();print('PASS: Kids menu and direct link; 3 original scenes/36 tasks; zoom; image-relative marker; teacher keys initially closed; progress persistence; mobile 320/390; no missing assets or JS errors.')
srv.shutdown()
