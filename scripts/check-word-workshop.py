"""Two workshop modes, buildable tasks, cumulative levels, moving words and parts, free contexts."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=Path('/workspace/shared/downloads/word-workshop');OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context(viewport={'width':1440,'height':1250},reduced_motion='reduce');p=ctx.new_page();errors=[];missing=[];p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.url.startswith(base) and r.status>=400 else None)
 p.goto(base);p.locator('[data-book-game=flask]').click();p.locator('#mine').wait_for();assert p.locator('#ww-start').is_disabled()
 course=p.locator('#lpbody [data-w]').first;course.check();assert p.locator('.ww-review-row').count()==1;course.uncheck()
 p.locator('#mine').fill('xyzzy');assert p.locator('#ww-start').is_disabled();p.locator('[data-ww-type]').select_option('verb');assert p.locator('#ww-start').is_enabled()
 # Actual recipes for every level and every authored family path, not implementation-mirroring snapshots.
 p.evaluate(r'''()=>{window.recipeFor=(row,level,target)=>{
  const F=WordWorkshopForms,P=WordWorkshopParts,fresh=()=>P.create(row),ops=P.parts(fresh(),level,'grammar'),valid=ids=>{const x=fresh();return ids.every(id=>P.apply(x,id,level,'grammar'))&&F.matches(P.result(x),[target])};
  for(const op of ops)if(valid([op.id]))return [op.id];
  for(const op of ops.filter(o=>o.kind==='form')){const base=fresh().row.forms[op.key][0];if(target.endsWith(base)){const ids=[op.id,...target.slice(0,-base.length).trim().split(/\s+/).filter(Boolean).map(w=>'aux-'+w)];if(valid(ids))return ids;}}
  if(/^be(?: |$)/.test(row.forms.base[0]))for(const finite of ['am','is','are','was','were']){const ids=['aux-'+finite,...(/\bnot\b/.test(target)?['aux-not']:[])];if(valid(ids))return ids;}
  throw Error('Unbuildable grammar: '+row.word+' / '+level+' / '+target);
 };}''')
 report=p.evaluate(r'''()=>{
  const F=WordWorkshopForms,P=WordWorkshopParts;let grammar=0,families=0;
  for(const level of P.levels)for(const [word,type]of [['look for','verb'],['take off','verb'],['be packed with','verb'],['child','noun'],['happy','adjective'],['good','adjective'],['conceal','verb']]){
   const row=F.analyse(word,type);for(const task of F.steps(row,level)){recipeFor(row,level,task.answers[0]);grammar++;}
   const planned=F.plan(row,level),forms=planned.map(t=>t.answers[0]);if(new Set(forms).size!==forms.length||forms.length>5)throw Error('Repeated random form');
  }
  for(const [lo,hi]of [['a2','b1'],['b1','b2'],['b2','c1']]){
   const row=F.analyse('look for','verb'),ids=new Set(F.steps(row,hi).map(t=>t.id));if(F.steps(row,lo).some(t=>!ids.has(t.id)))throw Error('Missing lower-level task');
   if(P.auxByLevel[lo].some(w=>!P.auxByLevel[hi].includes(w)))throw Error('Missing lower-level helper');
  }
  for(const level of P.levels)for(const root of new Set(WordWorkshopFamilies.edges.map(e=>e.from))){
   const row=F.analyse(root,F.detect(root)||'noun');for(const task of P.formationTasks(row,level))for(const path of task.paths){const build=P.create(row);if(!path.recipe.every(id=>P.apply(build,id,level,'formation'))||!F.matches(P.result(build),task.answers))throw Error('Unbuildable family: '+root+' → '+path.word);families++;}
  }
  const row=F.analyse('be packed with','verb'),negative=F.steps(row,'b1').find(s=>s.id==='negative');for(const w of ["wasn't packed with","weren't packed with",'was not packed with','were not packed with'])if(!F.matches(w,negative.answers))throw Error('Be negative rejected');if(F.matches('did not be packed with',negative.answers))throw Error('Did not be accepted');
  if(WordWorkshopContexts.length<20||new Set(WordWorkshopContexts.map(c=>c.id)).size!==WordWorkshopContexts.length)throw Error('Context bank');
  if(P.parts(P.create(F.analyse('care','noun')),'b1','grammar').some(o=>o.kind==='suffix'||o.kind==='prefix'))throw Error('Mixed modes');
  return {grammar,families,topics:WordWorkshopContexts.length};
 }''')
 def configure(text,mode='grammar',level='b1'):
  if p.locator('#ww-edit').count():p.locator('#ww-edit').click()
  p.locator(f'[data-ww-mode={mode}]').click();p.locator(f'[data-ww-level={level}]').click();p.locator('#mine').fill(text);p.locator('#ww-start').click()
 def word_index(word):return p.evaluate('w=>WordWorkshop.state.runs.findIndex(r=>r.row.word===w)',word)
 def select(word):
  i=word_index(word);p.locator('#ww-bank-'+str(i)).click();return i
 def drag(source,target):
  source.scroll_into_view_if_needed();start=source.bounding_box();end=target.bounding_box()
  p.mouse.move(start['x']+start['width']/2,start['y']+start['height']/2);p.mouse.down();p.mouse.move(end['x']+end['width']/2,end['y']+end['height']/2,steps=10);p.mouse.up()
 def solve():
  data=p.evaluate("()=>{const s=WordWorkshop.state,r=s.runs[s.wordIndex],t=r.steps[r.index];return {mode:s.mode,row:r.row,level:s.level,task:t}}")
  p.locator('#ww-reset').click()
  ids=data['task']['paths'][0]['recipe'] if data['mode']=='formation' else p.evaluate('d=>recipeFor(d.row,d.level,d.task.answers[0])',data)
  for id in ids:p.locator('#ww-op-'+id).click()
  assert p.locator('#ww-result').inner_text() in data['task']['answers']
  p.locator('#ww-check').click()
 # Bank-to-board dragging and a full, uncropped, wide board with small windows.
 configure('look for\ntake off\nbe packed with');assert p.locator('#ww-tiles button').count()==0
 i=word_index('look for');drag(p.locator('#ww-bank-'+str(i)),p.locator('#wcf'));assert p.locator('#ww-tile-'+str(i)).is_visible()
 assert p.locator('#wcf').bounding_box()['width']>800 and p.locator('#ww-tile-'+str(i)).bounding_box()['width']<220
 assert len(p.evaluate('WordWorkshop.state.runs[WordWorkshop.state.wordIndex].steps'))==5
 p.locator('#ww-reset').click();drag(p.locator('#ww-op-form-ing'),p.locator('#ww-tile-'+str(i)));assert p.locator('#ww-result').inner_text()=='looking for'
 p.locator('#ww-undo').click();assert p.locator('#ww-result').inner_text()=='look for'
 # Moving a window changes position without opening another word or changing its form.
 before=p.locator('#ww-tile-'+str(i)).bounding_box();startx=before['x']+40;starty=before['y']+30
 p.mouse.move(startx,starty);p.mouse.down();p.mouse.move(startx-180,starty+120,steps=10);p.mouse.up();after=p.locator('#ww-tile-'+str(i)).bounding_box();assert abs(after['x']-before['x'])>50
 p.locator('#ww-tile-'+str(i)).focus();p.keyboard.press('Shift+ArrowRight')
 # The construction is visibly changed on the board; selection preserves it.
 p.locator('#ww-op-form-past').click();select('take off');p.locator('#ww-op-form-part').click();select('look for');assert p.locator('#ww-result').inner_text()=='looked for'
 p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'grammar-board.png'),full_page=True)
 url=p.evaluate('SharedGame.getLink()');q=b.new_context(viewport={'width':1440,'height':1250},reduced_motion='reduce').new_page();q.goto(url);q.wait_for_function('window.SharedGame&&!SharedGame.replaying',timeout=60000);assert q.locator('#ww-result').inner_text()=='looked for';assert q.locator('#ww-tile-'+str(i)).is_visible();q.context.close()
 # Each word receives its own random context after the five random forms.
 for word in ['look for','take off','be packed with']:
  select(word)
  while p.evaluate('WordWorkshop.state.runs[WordWorkshop.state.wordIndex].phase')=='forms':solve()
  assert p.locator('#ww-topic').is_visible() and not p.locator('#ww-check').count()
  p.locator('#ww-answer').fill('deliberately unfinished, even with mistakes')
  assert p.locator('#ww-word').inner_text() in p.evaluate('WordWorkshop.state.runs[WordWorkshop.state.wordIndex].completed')
  p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'random-context.png'),full_page=True)
  if word=='look for':
   topic=p.locator('#ww-topic').inner_text();select('take off');select('look for');assert p.locator('#ww-answer').input_value()=='deliberately unfinished, even with mistakes' and p.locator('#ww-topic').inner_text()==topic
   url=p.evaluate('SharedGame.getLink()');q=b.new_context(viewport={'width':1440,'height':1250}).new_page();q.goto(url);q.wait_for_function('window.SharedGame&&!SharedGame.replaying',timeout=60000);assert q.locator('#ww-topic').inner_text()==topic and q.locator('#ww-answer').input_value()=='deliberately unfinished, even with mistakes';q.context.close()
  p.locator('#ww-next').click()
 assert p.locator('.ww-play').get_attribute('data-phase')=='done'
 # Several suffixes, a prefix plus two suffixes, and an ending attached to a derived noun.
 configure('care\nhelp\ncomfort\ncreate\nact','formation','b2');select('care')
 for id in ['suffix-less-careless','suffix-ness-carelessness']:p.locator('#ww-op-'+id).click()
 assert p.locator('#ww-result').inner_text()=='carelessness';p.locator('#ww-undo').click();assert p.locator('#ww-result').inner_text()=='careless'
 select('comfort')
 for id in ['suffix-able-comfortable','prefix-un-uncomfortable','suffix-ly-uncomfortably']:p.locator('#ww-op-'+id).click()
 assert p.locator('#ww-result').inner_text()=='uncomfortably'
 select('help');p.locator('#ww-op-suffix-er-helper').click();drag(p.locator('#ww-op-form-plural'),p.locator('#ww-tile-'+str(word_index('help'))));assert p.locator('#ww-result').inner_text()=='helpers'
 p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'word-formation-board.png'),full_page=True)
 select('act')
 for id in ['suffix-ive-active','suffix-ity-activity','form-plural']:p.locator('#ww-op-'+id).click()
 assert p.locator('#ww-result').inner_text()=='activities'
 select('create')
 while p.evaluate('WordWorkshop.state.runs[WordWorkshop.state.wordIndex].phase')=='forms':solve()
 assert p.locator('#ww-topic').is_visible()
 # Genuine nouns have fewer inflections; no fake fifth form is invented.
 configure('child');select('child');assert len(p.evaluate('WordWorkshop.state.runs[0].steps'))==4
 configure('look for','grammar','b2');select('look for');assert p.locator('#ww-op-aux-was').is_visible() and p.locator('#ww-op-aux-have').is_visible()
 p.set_viewport_size({'width':390,'height':1000});p.wait_for_timeout(100);assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
 assert p.locator('#wcf').bounding_box()['width']<=360 and p.locator('#wcf').bounding_box()['height']>=500
 p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'workshop-mobile.png'),full_page=True)
 p.locator('#ww-edit').click();p.reload();p.wait_for_function('window.WordWorkshop');p.evaluate("go('gram');S.gmode='craft';gmNew()");assert p.locator('[data-ww-level=b2]').get_attribute('aria-pressed')=='true' and p.locator('#mine').input_value()=='look for'
 assert not errors,errors;assert not missing,missing;b.close()
server.shutdown();print('PASS:',report,'cumulative grammar and helpers; five unique random forms; dictionary chains; pointer drags, undo and movement; contexts without checking; separate drafts; shared replay; whole board and mobile.')
