"""Prepared iframe codes: Word Craft, hosted Appearance and standalone Appearance."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path('/workspace/shared/downloads/word-workshop');OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
 def do_GET(self):
  if self.path=='/embed-test-host.html':
   self.send_response(200);self.send_header('Content-Type','text/html');self.end_headers();self.wfile.write(b'<!doctype html><html><body></body></html>')
  else:super().do_GET()
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=browser.new_context(viewport={'width':1440,'height':1250},reduced_motion='reduce');ctx.grant_permissions(['clipboard-read','clipboard-write'],origin=base.rstrip('/'));p=ctx.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.goto(base);p.wait_for_function('window.SharedGame')
 def code(page):
  page.get_by_role('button',name='Embed',exact=True).click();field=page.locator('.stw-embed-panel textarea');field.wait_for(state='visible');value=field.input_value();assert '<iframe' in value and 'embed=1' in value;page.get_by_role('button',name='Copy embed code',exact=True).click();return value
 def host(value):
  c=browser.new_context(viewport={'width':1440,'height':1250},reduced_motion='reduce');q=c.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto(base+'embed-test-host.html');q.set_content(value);frame=q.frame_locator('iframe');return c,q,frame
 p.evaluate("go('gram');S.gmode='craft';gmNew()");p.locator('[data-ww-mode=formation]').click();p.locator('#mine').fill('fear\nzqxunknown');p.wait_for_function("WordWorkshopDictionary.status==='ready'");p.locator('#ww-start').click();i=p.evaluate("WordWorkshop.state.runs.findIndex(r=>r.row.word==='zqxunknown')");p.locator('#ww-bank-'+str(i)).click();p.locator('#ww-answer').fill('My prepared context draft.');topic=p.locator('#ww-topic').inner_text();value=code(p);assert p.evaluate('navigator.clipboard.readText()')==value
 c,q,frame=host(value);frame.locator('#ww-topic').wait_for(timeout=60000);q.frames[1].wait_for_function('window.SharedGame&&!SharedGame.replaying',timeout=60000);assert frame.locator('#ww-topic').inner_text()==topic;assert frame.locator('#ww-answer').input_value()=='My prepared context draft.';assert frame.locator('#ww-bank [data-ww-word]').count()==2;assert frame.locator('body').get_attribute('class').find('embed')>=0;assert frame.get_by_role('button',name='Embed',exact=True).count()==0;frame.locator('#ww-answer').fill('An independently editable learner draft.');c.close()
 # The same visible toolbar embeds an Appearance game hosted inside the site.
 p.evaluate("openSharedGrammar('app','kids')");app=p.frame_locator('iframe');app.locator('[data-mode=free]').click();app.locator('#name').fill('Мария & Jamie');app.locator('[data-key=hair][data-value="17"]').click();value=code(p)
 c,q,frame=host(value);nested=frame.frame_locator('iframe');nested.locator('#name').wait_for(timeout=60000);q.frames[1].wait_for_function('window.SharedGame&&!SharedGame.replaying',timeout=60000);assert nested.locator('#name').input_value()=='Мария & Jamie';assert nested.locator('[data-key=hair][data-value="17"]').get_attribute('aria-pressed')=='true';c.close()
 # Direct Appearance has its own Embed control and a validated state payload.
 p.goto(base+'appearance/index.html');p.locator('[data-mode=free]').click();p.locator('#name').fill('Лея <&>');p.locator('[data-key=hair][data-value="17"]').click();value=code(p);assert '#studio=' in value
 c,q,frame=host(value);frame.locator('#name').wait_for(timeout=15000);assert frame.locator('#name').input_value()=='Лея <&>';assert frame.locator('[data-key=hair][data-value="17"]').get_attribute('aria-pressed')=='true';c.close()
 p.locator('.stw-embed-toggle').click();p.locator('#back').click();p.locator('[data-mode=guess]').click();sheet=p.locator('#sheet-code').input_value();p.locator('[data-person="2"]').click();names=p.locator('.card-name').all_inner_texts();value=code(p)
 c,q,frame=host(value);frame.locator('#sheet-code').wait_for();assert frame.locator('#sheet-code').input_value()==sheet;assert frame.locator('.card-name').all_inner_texts()==names;assert frame.locator('[data-person="2"]').get_attribute('aria-pressed')=='true';c.close()
 p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'appearance-embed.png'),full_page=True)
 assert not errors,errors;browser.close()
server.shutdown();print('PASS: visible Embed, copied iframe code, fresh-context Word Craft with all words/topic/draft, hosted Appearance portrait, standalone Unicode portrait and same guessing sheet/eliminations.')
