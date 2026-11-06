"""Validate the independent design previews and all Shakespeare micro-stories."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path
from threading import Thread
import json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path('/workspace/shared/downloads');OUT.mkdir(exist_ok=True,parents=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/design-studio/'
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':1100},reduced_motion='reduce');errors=[];missing=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('response',lambda r:missing.append(r.url) if r.status>=400 and '127.0.0.1' in r.url else None)
 page.goto(base);page.evaluate('document.fonts.ready');page.locator('.hero-art').wait_for()
 for theme in ['paper','pop','literary']:
  page.locator(f'[data-theme-choice="{theme}"]').click();assert page.locator('body').get_attribute('data-theme')==theme
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  page.screenshot(path=str(OUT/f'design-{theme}.png'),full_page=True)
  # The palette should follow the selected concept.
  page.locator('.preview-actions [data-view="guide"]').click();assert page.locator('.swatch').count()==6
  page.locator('.brand').click()
 # Drag a ticket, then use the keyboard to open it.
 page.locator('[data-theme-choice="paper"]').click();card=page.locator('.stack-card.front');rect=card.bounding_box();assert rect
 page.mouse.move(rect['x']+70,rect['y']+70);page.mouse.down();page.mouse.move(rect['x']+100,rect['y']+90,steps=10);page.mouse.up();assert card.evaluate('(e)=>parseFloat(e.style.getPropertyValue("--dx"))')>10
 card.focus();page.keyboard.press('Enter');assert page.locator('#reply').is_visible()
 # All 18 original prompts: bad order rejected, then correct target accepted.
 for lv in ['kids','a1','a2','b1','b2','c1']:
  page.evaluate('(lv)=>{DesignStudio.state.level=lv;DesignStudio.navigate("lesson")}',lv)
  for i in range(3):
   answer=page.evaluate('DesignStudio.prompts[DesignStudio.state.level][DesignStudio.state.act].ok[0]')
   page.locator('#reply').fill('Words in a deliberately wrong order');page.locator('#reply-form button[type="submit"]').click();assert page.locator('.feedback.bad').is_visible();assert page.locator('.wax-seal').count()==0
   page.locator('#reply').fill(answer);page.locator('#reply-form button[type="submit"]').click();assert page.locator('.wax-seal').is_visible()
   if lv=='b1' and i==0:page.screenshot(path=str(OUT/'shakespeare-delivered.png'),full_page=True)
   page.locator('#next-act').click()
  assert page.locator('.curtain h1').inner_text()=='Beautifully delivered.'
 print('All 18 Shakespeare prompts, wrong answers and completion passed',flush=True)
 # Home, level navigation, real exercise links and saved shelf work.
 page.locator('.brand').click();page.locator('[data-level="b2"]').click();page.locator('.nav-links [data-view="catalog"]').click();assert page.locator('.topic-card').count()==6;assert 'Third conditional' in page.locator('.catalog-grid').inner_text()
 page.locator('.brand').click();page.locator('[data-save="shakespeare"]').click();assert page.locator('[data-save="shakespeare"]').get_attribute('aria-pressed')=='true';page.locator('.nav-links [data-view="saved"]').click();assert page.locator('.adventure').count()==1;assert 'Shakespeare' in page.locator('.adventure-info h3').inner_text()
 page.reload();assert page.locator('[data-level="b2"]').get_attribute('aria-pressed')=='true';assert page.locator('[data-save="shakespeare"]').get_attribute('aria-pressed')=='true'
 page.evaluate('()=>{DesignStudio.state.level="b1";DesignStudio.navigate("lesson")}');page.screenshot(path=str(OUT/'shakespeare-inbox.png'),full_page=True)
 mobile=browser.new_page(viewport={'width':390,'height':844},has_touch=True,reduced_motion='reduce');mobile.on('pageerror',lambda e:errors.append(str(e)))
 mobile.goto(base+'?theme=paper');mobile.evaluate('document.fonts.ready');mobile.screenshot(path=str(OUT/'design-paper-mobile.png'),full_page=True)
 for theme in ['paper','pop','literary']:
  mobile.locator(f'[data-theme-choice="{theme}"]').tap();assert mobile.evaluate('document.documentElement.scrollWidth<=innerWidth'),theme
  mobile.locator('.preview-actions [data-view="lesson"]').tap();assert mobile.locator('#reply').is_visible();assert mobile.evaluate('document.documentElement.scrollWidth<=innerWidth');mobile.locator('#reply').tap();mobile.locator('.brand').tap()
 assert not errors,errors;assert not missing,missing
 print(json.dumps({'concepts':3,'prompts':18,'desktop':'passed','mobile':'passed','ticket_drag':'passed','navigation':'passed','saved_shelf':'passed','errors':errors,'missing_assets':missing}),flush=True)
 browser.close()
server.shutdown()
