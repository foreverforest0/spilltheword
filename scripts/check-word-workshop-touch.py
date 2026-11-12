"""Native finger dragging for compact word windows and affix pieces."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context(viewport={'width':390,'height':1250},has_touch=True,reduced_motion='reduce');p=ctx.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.goto(f'http://127.0.0.1:{server.server_port}/');p.wait_for_function('window.WordWorkshop');p.evaluate("go('gram');S.gmode='craft';gmNew()");p.locator('[data-ww-mode=formation]').tap();p.locator('#mine').fill('care');p.locator('#ww-start').tap();cdp=ctx.new_cdp_session(p)
 def finger(x,y,tx,ty,cancel=False):
  cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
  for i in range(1,9):cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+(tx-x)*i/8,'y':y+(ty-y)*i/8}]})
  cdp.send('Input.dispatchTouchEvent',{'type':'touchCancel' if cancel else 'touchEnd','touchPoints':[]})
 bank=p.locator('#ww-bank-0').bounding_box();board=p.locator('#wcf').bounding_box()
 finger(bank['x']+bank['width']/2,bank['y']+bank['height']/2,board['x']+board['width']*.5,board['y']+board['height']*.7)
 p.locator('#ww-tile-0').wait_for();assert p.locator('#ww-result').inner_text()=='care'
 # Positioning the window in the lower half lets the finger reach the parts tray too.
 p.locator('#ww-op-suffix-less-careless').scroll_into_view_if_needed();source=p.locator('#ww-op-suffix-less-careless').bounding_box();target=p.locator('#ww-tile-0').bounding_box()
 finger(source['x']+source['width']/2,source['y']+source['height']/2,target['x']+target['width']/2,target['y']+target['height']/2)
 p.wait_for_function("document.getElementById('ww-result')?.textContent==='careless'")
 p.locator('#ww-op-suffix-ness-carelessness').tap();p.wait_for_function("document.getElementById('ww-result')?.textContent==='carelessness'",timeout=3000)
 # Cancellation leaves both morphology and word location unchanged, with no ghost.
 before=p.evaluate('JSON.stringify(WordWorkshop.state.runs[0].pos)');target=p.locator('#ww-tile-0').bounding_box()
 finger(target['x']+target['width']/2,target['y']+target['height']/2,target['x']+70,target['y']-40,True)
 assert p.evaluate('JSON.stringify(WordWorkshop.state.runs[0].pos)')==before
 assert p.locator('.ww-drag-ghost').count()==0
 assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
 url=p.evaluate('SharedGame.getLink()');pupil=b.new_context(viewport={'width':390,'height':1250},reduced_motion='reduce');q=pupil.new_page();q.goto(url);q.wait_for_function('window.SharedGame&&!SharedGame.replaying',timeout=60000)
 assert not q.locator('.shared-game-loading').count(),q.locator('.shared-game-loading').all_inner_texts()
 assert q.locator('#ww-result').inner_text()=='carelessness'
 assert q.locator('.ww-drag-ghost').count()==0
 pupil.close()
 p.locator('#ww-edit').tap();p.locator('#mine').fill('care\nhelp');assert not errors,errors
 b.close()
server.shutdown();print('PASS: native touch bank-to-board, affix-to-word drag, chained suffix, cancellation, ghost cleanup and mobile bounds.')
