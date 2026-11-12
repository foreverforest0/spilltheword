"""Regression for the blocked custom-word list and initially's invalid comparison forms."""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path('/workspace/shared/downloads/word-workshop');OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=browser.new_page(viewport={'width':1440,'height':1100});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.goto(f'http://127.0.0.1:{server.server_port}/');p.wait_for_function('window.WordWorkshop')
 p.evaluate("()=>{S.wordWorkshop={mode:'formation',level:'b1',overrides:{initially:{type:'adjective',forms:{comparative:'initiallier',superlative:'initialliest'}}}};go('gram');S.gmode='craft';gmNew()}")
 p.locator('#mine').fill('expand\ninitially\npredator\nconduct')
 assert p.locator('#ww-start').is_enabled()
 assert p.evaluate("WordWorkshop.selection.find(r=>r.word==='initially').type")=='adverb'
 assert p.evaluate("WordWorkshopForms.analyse('initially','adjective').forms")=={'base':['initially']}
 assert p.locator('.ww-family-status').count()==4 and p.locator('.ww-forms-editor').count()==0
 p.locator('#ww-start').click();i=p.evaluate("WordWorkshop.state.runs.findIndex(r=>r.row.word==='initially')");p.locator('#ww-bank-'+str(i)).click();p.locator('#ww-op-remove-ly').click();assert p.locator('#ww-result').inner_text()=='initial'
 assert p.evaluate('WordWorkshopForms.matches(document.getElementById("ww-result").textContent,WordWorkshop.state.runs[WordWorkshop.state.wordIndex].steps[0].answers)')
 p.locator('#ww-edit').click();p.locator('#mine').fill('conduct\nexpand');p.locator('[data-ww-level=kids]').click();assert p.locator('#ww-start').is_disabled()
 assert 'No word-family tasks' in p.locator('#ww-start-note').inner_text();assert p.locator('#ww-use-grammar').is_visible()
 assert p.locator('[data-ww-mode=formation]').get_attribute('aria-pressed')=='true'
 p.locator('#ww-use-grammar').click();assert p.locator('.ww-play-meta').inner_text().startswith('GRAMMAR')
 assert {r['row']['word'] for r in p.evaluate('WordWorkshop.state.runs')}=={'conduct','expand'}
 p.locator('#ww-edit').click();p.locator('[data-ww-mode=formation]').click();p.locator('[data-ww-level=b1]').click();p.locator('#mine').fill('zqxunknown');assert p.locator('#ww-start').is_disabled();assert p.locator('#ww-use-grammar').inner_text()=='Switch to Grammar'
 p.locator('#ww-use-grammar').click();assert p.locator('[data-ww-mode=grammar]').get_attribute('aria-pressed')=='true';assert p.locator('#ww-start').is_disabled();assert 'Choose a word type' in p.locator('#ww-start-note').inner_text()
 p.locator('#mine').fill('initially');assert p.locator('[data-ww-type]').input_value()=='adverb';assert not p.locator('.ww-forms-editor').count();p.locator('#ww-start').click();p.locator('#ww-bank-0').click();assert p.locator('#ww-topic').is_visible();assert not p.locator('#ww-check').count()
 p.locator('#ww-edit').click();p.locator('[data-ww-mode=formation]').click();p.locator('#mine').fill('expand\ninitially\npredator\nconduct');p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'start-fixed.png'),full_page=True)
 assert not errors,errors;browser.close()
server.shutdown();print('PASS: screenshot vocabulary starts; stale adjective override corrected; initially → initial; no fake comparatives; explicit same-list Grammar fallback; honest unsupported/type states.')
