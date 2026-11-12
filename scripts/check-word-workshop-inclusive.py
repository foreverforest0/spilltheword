"""All selected words are retained; full dictionary forms and visible free contexts."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path('/workspace/shared/downloads/word-workshop');OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=browser.new_page(viewport={'width':1440,'height':1250},reduced_motion='reduce');errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.goto(f'http://127.0.0.1:{server.server_port}/');p.wait_for_function('window.WordWorkshop');p.evaluate("go('gram');S.gmode='craft';gmNew()");p.locator('[data-ww-mode=formation]').click();p.locator('#mine').fill('fear\ngenerous\ntooth\nzqxunknown\nlook for\ninitially');p.wait_for_function("WordWorkshopDictionary.status==='ready'")
 assert p.evaluate('WordWorkshopDictionary.count')>100000
 report=p.evaluate("""()=>{const F=WordWorkshopForms,P=WordWorkshopParts,answers=w=>P.formationTasks(F.analyse(w,F.detect(w)),'b1').flatMap(t=>t.answers);const fear=answers('fear');for(const w of ['fearful','fearless','fearfully','fearlessly','fearfulness','fearlessness'])if(!fear.includes(w))throw Error('Missing '+w);if(!answers('generous').includes('generosity'))throw Error('WordNet relation');if(!answers('tooth').includes('toothless'))throw Error('Unlisted base');const build=P.create(F.analyse('fear','verb'));P.apply(build,'suffix-less','b1','formation');const task=P.formationTasks(F.analyse('fear','verb'),'b1').find(t=>t.prompt==='Make an adjective.');if(!P.matchesFormation(build,task))throw Error('A negative adjective is still an adjective');const row=F.analyse('happy','adjective');if(P.matchesFormation(P.create(row),{meta:{type:'adjective'}}))throw Error('Unchanged root accepted');const helpers=P.create(F.analyse('help','verb'));P.apply(helpers,'suffix-er','b1','formation');P.apply(helpers,'ending-s','b1','formation');if(P.matchesFormation(helpers,{meta:{type:'adverb'}}))throw Error('Plural treated as adverb');const pool=P.formationTasks(row,'b1'),before=pool.map(t=>t.id).join();P.plan(row,'b1','formation');if(pool.map(t=>t.id).join()!==before)throw Error('Sampling mutates cached task order');if(!P.matchesTyped(F.analyse('fear','verb'),'fearlessly',{meta:{type:'adverb'}}))throw Error('Typed family alternative');return {fear:fear.length,words:WordWorkshopDictionary.count}}""")
 p.locator('#ww-start').click();assert p.locator('#ww-bank [data-ww-word]').count()==6
 def choose(word):
  i=p.evaluate('w=>WordWorkshop.state.runs.findIndex(r=>r.row.word===w)',word);p.locator('#ww-bank-'+str(i)).click()
 choose('zqxunknown');assert p.locator('#ww-topic').is_visible();assert not p.locator('#ww-check').count();assert p.locator('#ww-word').inner_text()=='zqxunknown'
 p.locator('#ww-answer').fill('My unfinished phrase, with no checking.');topic=p.locator('#ww-topic').inner_text();choose('fear');assert p.locator('#ww-context-now').is_visible();p.locator('#ww-context-now').click();assert p.locator('#ww-topic').is_visible();assert p.locator('#ww-word').inner_text()=='fear'
 p.locator('#ww-answer').fill('I have no fear of this completely new situation.');choose('zqxunknown');assert p.locator('#ww-answer').input_value()=='My unfinished phrase, with no checking.' and p.locator('#ww-topic').inner_text()==topic
 p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'every-word-context.png'),full_page=True)
 p.locator('#ww-edit').click();p.locator('#mine').fill('zqxunknown');p.locator('#ww-start').click();assert p.locator('#ww-topic').is_visible();p.locator('#ww-answer').fill('Anything at all.');p.locator('#ww-next').click();assert p.locator('.ww-play').get_attribute('data-phase')=='done'
 p.locator('#ww-edit').click();p.locator('[data-ww-mode=grammar]').click();p.locator('#mine').fill('zqxunknown');assert p.locator('#ww-start').is_enabled();p.locator('#ww-start').click();assert p.locator('#ww-topic').is_visible()
 # A list above the old 150-word limit is complete, and tasks are planned lazily.
 p.locator('#ww-edit').click();p.locator('[data-ww-mode=formation]').click();items=['custom-word-'+str(i) for i in range(180)];p.locator('#mine').fill('\n'.join(items));assert p.locator('.ww-review-row').count()==180;p.locator('#ww-start').click();assert p.locator('#ww-bank [data-ww-word]').count()==180;assert p.evaluate("WordWorkshop.state.runs.filter(r=>r.phase==='pending').length")==179
 assert not errors,errors;browser.close()
server.shutdown();print('PASS:',report,'full fear family, WordNet links, all custom/unknown/phrase entries retained, immediate unchecked context, visible context shortcut, per-word drafts, no 150-word truncation and lazy planning.')
