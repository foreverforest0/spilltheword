"""Full distractor palette, comparison tasks in formation, and hints on demand."""
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
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1400},reduced_motion='reduce');errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.goto(f'http://127.0.0.1:{server.server_port}/');p.wait_for_function('window.WordWorkshop');p.evaluate("go('gram');S.gmode='craft';gmNew()");p.locator('[data-ww-mode=formation]').click();p.locator('[data-ww-level=b1]').click();p.locator('#mine').fill('happy\nbeautiful\npossible');p.locator('#ww-start').click()
 def select(word):
  i=p.evaluate('w=>WordWorkshop.state.runs.findIndex(r=>r.row.word===w)',word);p.locator('#ww-bank-'+str(i)).click()
 def task():return p.evaluate('()=>{const s=WordWorkshop.state,r=s.runs[s.wordIndex];return r.steps[r.index]}')
 def solve():
  p.locator('#ww-reset').click();ids=p.evaluate('()=>{const s=WordWorkshop.state,r=s.runs[s.wordIndex];return r.steps[r.index].paths[0].recipe.map(id=>WordWorkshopParts.partId(id))}')
  for id in ids:p.locator('#ww-op-'+id).click()
  p.locator('#ww-check').click()
 def advance_to(prompt):
  p.evaluate("""prompt=>{const s=WordWorkshop.state,r=s.runs[s.wordIndex],task=WordWorkshopParts.formationTasks(r.row,s.level).find(t=>t.prompt===prompt);if(!task)throw Error('Missing '+prompt);r.steps=[task];r.index=0;r.phase='forms'}""",prompt)
  p.locator('#ww-bank-'+str(p.evaluate('WordWorkshop.state.wordIndex'))).click();p.locator('#ww-reset').click()
 select('happy');base=p.locator('[data-ww-part]').evaluate_all('es=>es.map(e=>e.dataset.wwPart)');assert len(base)>35
 assert p.locator('#ww-op-prefix-in').is_enabled() and p.locator('#ww-op-suffix-ment').is_enabled()
 assert p.locator('#ww-hint-copy').is_hidden() and p.locator('#ww-model').is_hidden() and p.locator('#ww-show').is_hidden()
 p.locator('#ww-op-suffix-ment').click();assert p.locator('#ww-result').inner_text()=='happyment';assert not p.locator('#ww-feedback').inner_text()
 p.locator('#ww-check').click();assert p.locator('#ww-feedback').inner_text()=='Try another combination.';assert p.evaluate('WordWorkshop.state.completed.length')==0
 p.locator('#ww-reset').click();p.locator('#ww-hint').click();assert p.locator('#ww-hint-copy').is_visible();assert p.locator('#ww-model').is_hidden();p.locator('#ww-show').click();assert p.locator('#ww-model').is_visible();p.locator('#ww-hint').click();assert p.locator('#ww-show').is_hidden()
 select('beautiful');assert p.locator('[data-ww-part]').evaluate_all('es=>es.map(e=>e.dataset.wwPart)')==base
 advance_to('Make the comparative.');p.locator('#ww-op-suffix-er').click();assert p.locator('#ww-result').inner_text()=='beautifuler';p.locator('#ww-check').click();assert p.locator('#ww-feedback').inner_text()=='Try another combination.'
 p.locator('#ww-reset').click();p.locator('#ww-op-degree-more').click();assert p.locator('#ww-result').inner_text()=='more beautiful';p.locator('#ww-check').click()
 select('possible');advance_to('Give the adjective a negative meaning.');p.locator('#ww-op-prefix-in').click();assert p.locator('#ww-result').inner_text()=='inpossible';p.locator('#ww-check').click();assert p.locator('#ww-feedback').inner_text()=='Try another combination.'
 p.locator('#ww-reset').click();p.locator('#ww-op-prefix-im').click();assert p.locator('#ww-result').inner_text()=='impossible';p.locator('#ww-check').click()
 assert p.evaluate("WordWorkshopForms.steps(WordWorkshopForms.analyse('happy','adjective'),'b1').length")==0
 assert p.evaluate("WordWorkshopParts.formationTasks(WordWorkshopForms.analyse('happy','adjective'),'a2').some(t=>t.id==='degree-comparative')")
 select('happy');p.locator('#ww-reset').click();p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'full-word-formation-palette.png'),full_page=True)
 assert not errors,errors;b.close()
server.shutdown();print('PASS: shared full palette; deliberate wrong trials; no automatic hints; Hint-only answers; degrees moved out of grammar; -er/more and in-/im- require the correct choice.')
