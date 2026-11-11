"""Real touch drag and cancellation, alongside check-present-perfect-files.py."""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
from pathlib import Path
from playwright.sync_api import sync_playwright
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
s=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(Path(__file__).resolve().parents[1])));Thread(target=s.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 c=b.new_context(viewport={'width':390,'height':950},has_touch=True,reduced_motion='reduce');p=c.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.goto(f'http://127.0.0.1:{s.server_port}/');p.wait_for_function('window.PresentPerfectFiles');p.evaluate("openSharedGrammar('ppfiles','b1')");p.locator('#cf-open-unclaimed-roll').tap();cdp=c.new_cdp_session(p)
 p.locator('#cf-draft').fill('My touch-screen draft.');p.evaluate('window.scrollTo(0,0)')
 r=p.locator('#cf-piece-8').bounding_box();x=r['x']+r['width']/2;y=r['y']+r['height']/2
 cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
 for i in range(1,9):cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x-i*10,'y':y-i*12}]})
 cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
 assert p.locator('#cf-inspector').is_hidden();saved=p.evaluate('PresentPerfectFiles.state.saved.layout.earbuds');assert saved
 assert p.locator('#cf-draft').input_value()=='My touch-screen draft.'
 # Cancelling a second touch restores the saved, completed position.
 r=p.locator('#cf-piece-8').bounding_box();x=r['x']+r['width']/2;y=r['y']+r['height']/2
 cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
 cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+45,'y':y+45}]})
 cdp.send('Input.dispatchTouchEvent',{'type':'touchCancel','touchPoints':[]})
 assert p.evaluate('PresentPerfectFiles.state.saved.layout.earbuds')==saved
 assert p.locator('#cf-inspector').is_hidden()
 # The reminder is part of the note rather than a separate caption.
 p.locator('#cf-detail-5').tap();assert "Beth's keychain" in p.locator('#cf-document').inner_text()
 p.evaluate('window.scrollTo(0,0)');p.screenshot(path='/workspace/shared/downloads/present-perfect-files/note-mobile.png',full_page=True)
 p.locator('#cf-put-back').tap();p.locator('#cf-reset-layout').tap()
 assert not p.evaluate('Object.keys(PresentPerfectFiles.state.saved.layout).length')
 assert p.locator('#cf-draft').input_value()=='My touch-screen draft.'
 p.locator('#cf-close').tap();p.locator('#cf-topics').tap();p.wait_for_timeout(100)
 assert not errors,errors
 b.close()
s.shutdown();print('PASS: native finger drag; touch cancellation; handwritten note; reset preserves draft; no ResizeObserver errors after leaving.')
