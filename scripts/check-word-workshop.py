"""Real course/custom selection, reviewed morphology, complete drills and shared final writing."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path('/workspace/shared/downloads/word-workshop');OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
s=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=s.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{s.server_port}/'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context(viewport={'width':1440,'height':1050},reduced_motion='reduce');p=ctx.new_page();errors=[];missing=[];p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.url.startswith(base) and r.status>=400 else None);p.goto(base);p.locator('[data-book-game=flask]').click();p.locator('#mine').wait_for()
 # Known irregulars, retained particles, regular spelling, adjective rules and editable variants.
 cases=[('become','verb','part','become'),('overcome','verb','part','overcome'),('undergo','verb','part','undergone'),('look for','verb','part','looked for'),('take off','verb','part','taken off'),('run out of','verb','part','run out of'),('come back','verb','part','come back'),('lie down','verb','past','lay down'),('lie down','verb','part','lain down'),('conceal','verb','ing','concealing'),('study','verb','past','studied'),('stop','verb','ing','stopping'),('travel','verb','past','traveled'),('go','verb','part','gone'),('be','verb','ing','being'),('child','noun','plural','children'),('bus stop','noun','plural','bus stops'),('beautiful','adjective','comparative','more beautiful'),('big','adjective','superlative','biggest'),('happy','adjective','comparative','happier'),('good','adjective','comparative','better'),('far','adjective','superlative','farthest'),('red','adjective','comparative','redder')]
 for word,kind,form,expected in cases:assert p.evaluate('([w,k,f,x])=>WordWorkshopForms.analyse(w,k).forms[f].includes(x)',[word,kind,form,expected]),(word,expected)
 for text,target in [("I've looked for my keys.",'have looked for'),('She was maintaining her composure.','maintaining his composure'),('I have taken my coat off.','have taken off'),('I ran.','ran'),('Children play.','children')]:assert p.evaluate('([s,t])=>WordWorkshopForms.sentenceUses(s,t)',[text,target]),(text,target)
 for text,target in [('I looked for my keys.','have looked for'),('I have looked my keys for.','have looked for'),('A runner waits.','run'),('have looked for','have looked for'),('I have taken it. Off we go.','have taken off')]:assert not p.evaluate('([s,t])=>WordWorkshopForms.sentenceUses(s,t)',[text,target]),(text,target)
 assert p.evaluate("WordWorkshopForms.parseWords('look for, take off\\nlook for | искать\\n- conceal').length")==3
 # Course checkboxes and exclusions use the site's existing lesson-word picker.
 assert p.locator('#ww-start').is_disabled();course_word=p.locator('#lpbody [data-w]').first;word=course_word.locator('xpath=..').inner_text().strip();course_word.check();assert p.locator('.ww-review-row').count()==1;assert p.evaluate('WordWorkshop.selection[0].word')==word.lower();course_word.uncheck();assert p.locator('.ww-review-row').count()==0
 # Unknown words require an explicit type; overrides persist and affect accepted targets.
 p.locator('#mine').fill('xyzzy');assert p.locator('#ww-start').is_disabled();p.locator('[data-ww-type]').select_option('verb');assert p.locator('#ww-start').is_enabled();p.locator('summary').click();field=p.locator('[data-form=past]');field.fill('xyzzied / xyzzyed');field.press('Tab');assert p.evaluate("WordWorkshop.selection[0].forms.past.includes('xyzzied')");assert p.evaluate("WordWorkshopForms.matches('xyzzyed',WordWorkshop.selection[0].forms.past)")
 p.locator('#mine').fill('look for | искать\ntake off\nconceal');assert p.locator('.ww-review-row').count()==3
 assert p.evaluate("WordWorkshop.selection.every(r=>r.type==='verb')");p.screenshot(path=str(OUT/'choose-vocabulary.png'),full_page=True)
 # Saved teacher vocabulary is restored on reload.
 p.reload();p.wait_for_function('window.WordWorkshop');p.evaluate("go('gram');S.gmode='craft';gmNew()");assert p.locator('#mine').input_value()=='look for | искать\ntake off\nconceal';p.locator('#ww-start').click();assert p.locator('#wcf').is_visible();assert p.locator('#ww-word').inner_text() in ['look for','take off','conceal'];p.screenshot(path=str(OUT/'workshop-board.png'),full_page=True)
 perfect=0
 for i in range(15):
  assert p.locator('.ww-play').get_attribute('data-phase')=='forms';task=p.evaluate('WordWorkshopForms.steps(WordWorkshop.state.entries[WordWorkshop.state.wordIndex])[WordWorkshop.state.stepIndex]');p.locator('#ww-answer').fill('go went banana');p.locator('#ww-check').click();assert not p.evaluate('WordWorkshop.state.done');assert p.locator('#ww-next').is_hidden()
  p.locator('#ww-hint').click();assert p.locator('#ww-hint-copy').is_visible();p.locator('#ww-show').click();assert p.locator('#ww-model').is_visible();p.locator('#ww-show').click();assert p.locator('#ww-model').is_hidden()
  answer=task['answers'][0];p.locator('#ww-answer').fill(answer.upper());p.locator('#ww-check').click();assert p.evaluate('WordWorkshop.state.done');assert p.locator('#ww-answer').get_attribute('readonly') is not None
  if task['id']=='perfect':perfect+=1;assert answer.startswith('have ')
  p.locator('#ww-next').click()
 assert perfect==3;assert p.locator('.ww-play').get_attribute('data-phase')=='sentence';target=p.locator('#ww-word').inner_text();assert p.evaluate('WordWorkshop.state.completed.some(x=>x.answers.includes(WordWorkshop.state.target.form))');p.locator('#ww-answer').fill('An unfinished sentence.');p.screenshot(path=str(OUT/'random-form-sentence.png'),full_page=True)
 # Copy link reproduces vocabulary, completed forms, the random target and the draft.
 url=p.evaluate('SharedGame.getLink()');q=ctx.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto(url);q.wait_for_function('window.SharedGame&&!SharedGame.replaying');assert q.locator('.shared-game-loading').count()==0;assert q.locator('#ww-word').inner_text()==target;assert q.locator('#ww-answer').input_value()=='An unfinished sentence.';assert q.locator('#ww-collected>span').count()==15;q.close()
 p.locator('#ww-answer').fill('A sentence with another word.');p.locator('#ww-check').click();assert p.locator('.ww-play').get_attribute('data-phase')=='sentence';p.locator('#ww-answer').fill('In this story, I '+target+' something important.');p.locator('#ww-check').click();assert p.locator('.ww-play').get_attribute('data-phase')=='done';assert 'Saved' in p.locator('#ww-feedback').inner_text();p.locator('#ww-next').click();assert p.locator('.ww-play').get_attribute('data-phase')=='forms'
 # Noun/adjective/fixed drills are meaningful and never get verb auxiliaries.
 p.locator('#ww-edit').click();p.locator('#mine').fill('child\nbeautiful\nquickly');assert p.evaluate("WordWorkshop.selection.map(r=>r.type)")==['noun','adjective','fixed'];p.locator('#ww-start').click()
 while p.locator('.ww-play').get_attribute('data-phase')=='forms':
  task=p.evaluate('WordWorkshopForms.steps(WordWorkshop.state.entries[WordWorkshop.state.wordIndex])[WordWorkshop.state.stepIndex]||null');answer=task['answers'][0] if task else 'She moved quickly today.';p.locator('#ww-answer').fill(answer);p.locator('#ww-check').click();assert p.evaluate('WordWorkshop.state.done');p.locator('#ww-next').click()
 assert p.locator('.ww-play').get_attribute('data-phase')=='sentence'
 # Mobile configuration and board remain usable without horizontal overflow.
 p.locator('#ww-edit').click();p.locator('#mine').fill('look for');p.set_viewport_size({'width':390,'height':844});assert p.evaluate('document.documentElement.scrollWidth<=innerWidth');p.locator('#ww-start').click();assert p.evaluate('document.documentElement.scrollWidth<=innerWidth');assert p.locator('#ww-answer').bounding_box()['width']>200;p.screenshot(path=str(OUT/'workshop-mobile.png'),full_page=True)
 assert not errors,errors;assert not missing,missing;b.close()
s.shutdown();print('PASS: course selection/exclusion, pasted phrases, editable morphology, irregulars and particles, 15 checked forms, random final sentence, shared progress/target/draft, persisted vocabulary, nouns/adjectives/fixed expressions, mobile and safe failure on wrong forms. Final writing validates target use, not sentence grammar.')
