"""Selected vocabulary on tiles, level-scoped building parts, be-phrase negatives and sharing."""
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
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context(viewport={'width':1440,'height':1100},reduced_motion='reduce');p=ctx.new_page();errors=[];missing=[];p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.url.startswith(base) and r.status>=400 else None);p.goto(base);p.locator('[data-book-game=flask]').click();p.locator('#mine').wait_for()
 # Preserve course/custom input, selection exclusions and explicit morphology overrides.
 assert p.locator('#ww-start').is_disabled();word=p.locator('#lpbody [data-w]').first;word.check();assert p.locator('.ww-review-row').count()==1;word.uncheck();assert p.locator('.ww-review-row').count()==0
 p.locator('#mine').fill('xyzzy');assert p.locator('#ww-start').is_disabled();p.locator('[data-ww-type]').press('ArrowDown');assert p.locator('[data-ww-type]').input_value()=='verb';p.locator('summary').click();field=p.locator('[data-form=past]');field.fill('xyzzied / xyzzyed');field.press('Tab');assert p.evaluate("WordWorkshopForms.matches('xyzzyed',WordWorkshop.selection[0].forms.past)")
 # A semantic recipe finder checks that each authored target can actually be built from available parts.
 p.evaluate(r'''()=>{window.recipeFor=(row,level,target)=>{
  const F=WordWorkshopForms,P=WordWorkshopParts,fresh=()=>P.create(row),ops=P.parts(fresh(),level),valid=ids=>{const build=fresh();return ids.every(id=>P.apply(build,id,level))&&F.matches(P.result(build),[target])};
  for(const op of ops)if(valid([op.id]))return [op.id];
  for(const form of ops.filter(o=>o.kind==='form')){
   const base=row.forms[form.key][0];if(F.matches(base,[target])&&valid([form.id]))return [form.id];
   if(target.endsWith(base)){const prefix=target.slice(0,-base.length).trim().split(/\s+/).filter(Boolean),ids=[form.id,...prefix.map(w=>'aux-'+w)];if(valid(ids))return ids;}
  }
  if(/^be(?: |$)/.test(row.forms.base[0]))for(const finite of ['was','were','is','are']){const ids=['aux-'+finite,...(/\bnot\b/.test(target)?['aux-not']:[])];if(valid(ids))return ids;}
  throw Error('No recipe: '+row.word+' / '+level+' / '+target);
 };}''')
 report=p.evaluate(r'''()=>{
  const F=WordWorkshopForms,P=WordWorkshopParts;let checked=0;
  for(const level of P.levels)for(const [word,type]of [['look for','verb'],['take off','verb'],['run out of','verb'],['be packed with','verb'],['be interested in','verb'],['child','noun'],['happy','adjective'],['care','noun'],['conceal','verb']]){
   const row=F.analyse(word,type),ops=P.parts(P.create(row),level);if(new Set(ops.map(o=>o.id)).size!==ops.length)throw Error('Duplicate part IDs');
   for(const task of F.steps(row,level)){recipeFor(row,level,task.answers[0]);checked++;}
  }
  for(const level of ['a1','a2','b1'])for(const word of ['be packed with','be interested in','be afraid of','be']){
   const row=F.analyse(word,'verb'),task=F.steps(row,level).find(s=>s.id==='negative');if(!task)throw Error('Missing negative');
   const tail=row.forms.base[0].slice(2);for(const phrase of ['was not','were not',"wasn't","weren't"])if(!F.matches(phrase+tail,task.answers))throw Error('Rejected be negative');
   if(F.matches('did not '+row.forms.base[0],task.answers))throw Error('Accepted did not be');
  }
  const row=F.analyse('look for','verb');if(P.parts(P.create(row),'a1').some(o=>o.id==='aux-have'))throw Error('Perfect auxiliary in A1');if(F.steps(row,'a1').some(s=>s.id==='perfect'))throw Error('Perfect task in A1');if(!F.steps(row,'c1').some(s=>s.id==='perfectInfinitive'))throw Error('Missing C1');
  if(P.parts(P.create(F.analyse('conceal','verb')),'a1').some(o=>o.label==='-ment'))throw Error('B1 suffix in A1');
  if(!F.matches("hadn't looked for",F.steps(row,'b2').find(s=>s.id==='negativePerfect').answers))throw Error('Contraction');
  return checked;
 }''')
 def configure(text,level='b1'):
  if p.locator('#ww-edit').count():p.locator('#ww-edit').click()
  p.locator(f'[data-ww-level={level}]').click();p.locator('#mine').fill(text);p.locator('#ww-start').click();assert p.locator('.ww-word-tile').count()==len(text.splitlines())
 def select(word):
  i=p.evaluate('w=>WordWorkshop.state.entries.findIndex(r=>r.word===w)',word);p.locator(f'#ww-tile-{i}').click();return i
 def task():return p.evaluate('()=>{const s=WordWorkshop.state,r=s.runs[s.wordIndex];return r.steps[r.index]||null}')
 def solve():
  current=task()
  if current:
   p.locator('#ww-reset').click();ids=p.evaluate('()=>{const s=WordWorkshop.state,r=s.runs[s.wordIndex];return recipeFor(r.row,s.level,r.steps[r.index].answers[0])}')
   for id in ids:p.locator('#ww-op-'+id).click()
   assert p.locator('#ww-result').inner_text()==current['answers'][0]
  else:p.locator('#ww-answer').fill('She uses '+p.locator('#ww-selected').inner_text()+' in her story.')
  p.locator('#ww-check').click();assert p.evaluate('WordWorkshop.state.runs[WordWorkshop.state.wordIndex].done')
 # A board of squares opens the right menu only after a word is selected.
 configure('look for | искать\ntake off\nconceal');assert p.locator('.ww-tools-empty').is_visible();i=select('look for');assert p.locator('#ww-selected').inner_text()=='look for';assert p.locator('#ww-op-aux-have').is_visible()
 # Wrong construction cannot pass; Undo and native part-to-word drag really build -ing.
 p.locator('#ww-op-form-past').click();assert p.locator('#ww-result').inner_text()=='looked for';p.locator('#ww-check').click();assert not p.evaluate('WordWorkshop.state.runs[WordWorkshop.state.wordIndex].done');p.locator('#ww-undo').click();assert p.locator('#ww-result').inner_text()=='look for';p.locator('#ww-op-form-ing').drag_to(p.locator(f'#ww-tile-{i}'));assert p.locator('#ww-result').inner_text()=='looking for';p.locator('#ww-check').click();p.locator('#ww-next').click()
 # Word-to-part drag works too. Continue into a compound tense by adding have.
 p.locator(f'#ww-tile-{i}').drag_to(p.locator('#ww-op-form-past'));assert p.locator('#ww-result').inner_text()=='looked for';p.locator('#ww-check').click();p.locator('#ww-next').click();assert task()['id']=='perfect';p.locator('#ww-op-aux-have').click();assert p.locator('#ww-result').inner_text()=='have looked for';assert p.locator('#ww-op-aux-have').evaluate("e=>getComputedStyle(e).backgroundColor==='rgb(38, 66, 43)'")
 # Selecting another word preserves each word's current construction and task.
 select('take off');p.locator('#ww-op-form-part').click();assert p.locator('#ww-result').inner_text()=='taken off';select('look for');assert p.locator('#ww-result').inner_text()=='have looked for';p.screenshot(path=str(OUT/'word-tiles-builder.png'),full_page=True)
 # Copy link includes drag-built pieces, selection and progress.
 url=p.evaluate('SharedGame.getLink()');q=ctx.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto(url);q.wait_for_function('window.SharedGame&&!SharedGame.replaying',timeout=60000);assert q.locator('.shared-game-loading').count()==0, q.locator('.shared-game-loading').inner_text();assert q.locator('#ww-result').inner_text()=='have looked for';assert q.locator('#ww-collected>span').count()==2;q.close()
 p.locator('#ww-check').click();p.locator('#ww-next').click()
 # Finish the full selected list using parts rather than typing.
 while p.locator('.ww-play').get_attribute('data-phase')=='board':
  run=p.evaluate('()=>WordWorkshop.state.runs[WordWorkshop.state.wordIndex]')
  if not run['done']:solve()
  p.locator('#ww-next').click()
 target=p.locator('#ww-word').inner_text();assert p.evaluate('WordWorkshop.state.completed.some(x=>x.answers.includes(WordWorkshop.state.target.form))');p.locator('#ww-answer').fill('An unfinished sentence.');p.screenshot(path=str(OUT/'random-form-sentence.png'),full_page=True)
 url=p.evaluate('SharedGame.getLink()');q=ctx.new_page();q.goto(url);q.wait_for_function('window.SharedGame&&!SharedGame.replaying',timeout=60000);assert q.locator('.shared-game-loading').count()==0;assert q.locator('#ww-word').inner_text()==target;assert q.locator('#ww-answer').input_value()=='An unfinished sentence.';q.close()
 p.locator('#ww-answer').fill('I '+target+' something in this story.');p.locator('#ww-check').click();assert p.locator('.ww-play').get_attribute('data-phase')=='done'
 # Meaningful prefixes/suffixes, stem spelling and undo: happy → unhappy → unhappiness.
 configure('happy','a2');select('happy');p.locator('#ww-op-prefix-un-unhappy').click();assert p.locator('#ww-result').inner_text()=='unhappy';p.locator('#ww-op-suffix-ness-unhappiness').click();assert p.locator('#ww-result').inner_text()=='unhappiness';p.locator('#ww-undo').click();assert p.locator('#ww-result').inner_text()=='unhappy';p.locator('#ww-reset').click();p.locator('#ww-op-suffix-ness-happiness').click();assert p.locator('#ww-result').inner_text()=='happiness';p.screenshot(path=str(OUT/'prefixes-and-suffixes.png'),full_page=True)
 # A1 has no have/perfect construction. Be-phrase negatives accept the user's contraction.
 configure('be packed with','a1');select('be packed with');assert p.locator('#ww-op-aux-have').count()==0
 while task()['id']!='negative':solve();p.locator('#ww-next').click()
 p.locator('#ww-reset').click();p.locator('#ww-op-aux-was').click();p.locator('#ww-op-aux-not').click();assert p.locator('#ww-result').inner_text()=='was not packed with';p.locator('.ww-type-instead summary').click();p.locator('#ww-answer').fill("wasn't packed with");p.locator('#ww-check').click();assert p.evaluate('WordWorkshop.state.runs[0].done');p.screenshot(path=str(OUT/'was-not-packed-with.png'),full_page=True)
 # Keyboard square selection and parts; mobile layout and persisted level.
 configure('look for\ntake off','c1');assert p.locator('[data-ww-word][tabindex="0"]').count()==1;p.locator('[data-ww-word][tabindex="0"]').press('ArrowRight');assert p.locator('#ww-selected').is_visible();assert p.locator('#ww-op-aux-to').is_visible();assert p.locator('#ww-op-aux-was').count()==0;p.locator('#ww-op-form-part').press('Enter');assert p.locator('#ww-result').inner_text() in ['looked for','taken off']
 p.set_viewport_size({'width':390,'height':844});assert p.evaluate('document.documentElement.scrollWidth<=innerWidth');assert p.locator('#ww-tools').bounding_box()['width']>200;p.screenshot(path=str(OUT/'workshop-mobile.png'),full_page=True);p.locator('#ww-edit').click();p.reload();p.wait_for_function('window.WordWorkshop');p.evaluate("go('gram');S.gmode='craft';gmNew()");assert p.locator('[data-ww-level=c1]').get_attribute('aria-pressed')=='true';assert p.locator('#mine').input_value()=='look for\ntake off'
 assert not errors,errors;assert not missing,missing;b.close()
s.shutdown();print('PASS:',report,'buildable level-scoped targets; course/custom selection, two-way native drag, clickable tiles, spelling/stem changes, auxiliaries, prefix/suffix chaining, undo/reset, per-word progress, shared construction/final target, was/were contractions for be phrases, no advanced A1 forms, C1 tasks, keyboard and mobile.')
