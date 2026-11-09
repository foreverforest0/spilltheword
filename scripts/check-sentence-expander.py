"""66 grammar-specific dives: cumulative edits, reveal animation, scroll, share and mobile."""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright
import json
ROOT=Path(__file__).resolve().parents[1]
OUT=Path('/workspace/shared/downloads/sentence-expander');OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce');p=ctx.new_page();errors=[];missing=[]
 p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.status>=400 and r.url.startswith(base) else None);p.goto(base);p.wait_for_function('window.SentenceExpander')
 topics=p.evaluate('SentenceExpander.topics');assert len(topics)==66
 report=p.evaluate('''()=>{
  const fail=m=>{throw Error(m)};let count=0;
  for(const t of SentenceExpander.topics){
   const group=SPGRP[t.level].find(g=>g[0].startsWith(t.number+' ·'));
   if(group[1].filter(x=>x===t.id).length!==1)fail('Missing or duplicate catalog entry '+t.id);
   for(let v=0;v<3;v++){
    const c=ExpanderCurriculum.variant(t.level,t.number,v);let previous=c.start;
    if(c.steps.length<5)fail('Incomplete sequence');
    for(const s of c.steps){count++;if(!s.instruction||!s.hint||!s.answers.length)fail('Empty step');
     if(s.answers.some(a=>/undefined|TODO|no name|…/.test(a)))fail('Placeholder');
     if(QuestionPond.matches(previous,s.answers))fail('An unchanged sentence passed '+t.id);
     for(const a of s.answers)if(!QuestionPond.matches(a.toUpperCase(),s.answers))fail('Answer normalization');
     previous=s.answers[0];
    }
   }
  }
  const get=(l,n)=>ExpanderCurriculum.variant(l,n);
  if(!get('kids',2).steps[2].answers[0].startsWith('Tom plays'))fail('Kids third person');
  if(!get('a1',3).steps[3].answers[0].includes('does not work'))fail('Negative base form');
  if(!get('b1',1).steps.at(-1).answers[0].includes('finished the report yesterday'))fail('Finished past time');
  const pc=get('b1',2);if(!pc.steps[1].answers[0].includes('for two hours')||!pc.steps[2].answers[0].includes('since nine'))fail('Duration/start distinction');
  if(!get('b2',2).steps[1].answers[0].includes('would be a doctor now'))fail('Mixed time reference');
  if(!get('b2',4).steps[2].answers[0].includes('will have been repaired'))fail('Perfect passive');
  if(!get('c1',1).steps[1].answers[0].startsWith('Never has Mia'))fail('Negative inversion');
  if(!get('c1',4).steps[1].answers[0].startsWith('Having finished'))fail('Earlier participle action');
  return {topics:SentenceExpander.topics.length,variants:SentenceExpander.topics.length*3,transformations:count};
 }''')
 def open_topic(t):
  p.evaluate("t=>{go('gram');S.glevel=t.level;S.splevel=t.level;S.gmode='ts';glSetup()}",t)
  key=p.evaluate("t=>t.level+':'+SPGRP[t.level].findIndex(g=>g[0].startsWith(t.number+' ·'))",t)
  p.locator(f'[data-grammar-topic="{key}"]').click();p.locator(f'[data-grammar-exercise="{t["id"]}"]').click();p.wait_for_function("document.querySelector('.sx-dive')?.dataset.phase==='question'")
 def check_step(i):
  s=p.locator(f'.sx-stage[data-step="{i}"]');return s,s.locator('.sx-answer'),s.locator('.sx-check')
 open_topic(next(t for t in topics if t['level']=='b1' and t['number']==2))
 assert p.locator('.sx-header h1').is_visible();assert p.locator('.sx-header .stw-wave-letter').count()>10;assert p.locator('.sx-hint').is_hidden();assert p.locator('.grammar-exercise-back').count()==0
 s,field,button=check_step(0);original=field.input_value();button.click();assert p.evaluate('EX.index')==0;assert 'Change the sentence' in s.locator('.sx-feedback').inner_text()
 s.locator('.sx-hint-toggle').click();assert s.locator('.sx-hint').is_visible();s.locator('.sx-example-toggle').click();assert s.locator('.sx-example').is_visible()
 field.fill('She has been study English.');button.click();assert p.evaluate('EX.index')==0
 p.screenshot(path=str(OUT/'first-step.png'),full_page=True)
 # All actual catalog topics can be completed using real editable fields and checks.
 for t in topics:
  open_topic(t);previous=p.evaluate('EX.chain.start')
  for i in range(5):
   stage,field,button=check_step(i);assert field.input_value()==previous
   answer=p.evaluate('i=>EX.chain.steps[i].answers[0]',i);field.fill(answer);button.click();previous=answer
   if i<4:p.wait_for_function(f"EX.index==={i+1}&&document.querySelector('.sx-dive').dataset.phase==='question'")
   else:p.wait_for_selector('.sx-finish')
   assert field.get_attribute('readonly') is not None;assert p.locator('.sx-stage[data-complete=true]').count()==i+1
  assert p.locator('#sx-depth').inner_text()=='3000';assert p.locator('.sx-stage').count()==5
  before=p.locator('.sx-dive').get_attribute('data-variant');p.locator('#sx-again').click();p.wait_for_function("document.querySelector('.sx-dive').dataset.phase==='question'");assert before!=p.locator('.sx-dive').get_attribute('data-variant');assert p.locator('.sx-stage').count()==1
 # True animation uses the upstream reveal engine; previous versions remain above.
 p.emulate_media(reduced_motion='no-preference');open_topic(topics[0]);stage=p.locator('.sx-stage');assert stage.locator('.block-revealer__element').count()==1
 answer=p.evaluate('EX.chain.steps[0].answers[0]');stage.locator('.sx-answer').fill(answer);stage.locator('.sx-check').click();p.wait_for_selector('.sx-stage[data-step="1"] .block-revealer__element');assert p.locator('.sx-dive').get_attribute('aria-busy')=='true'
 p.wait_for_function("document.querySelector('.sx-dive').dataset.phase==='question'");p.wait_for_timeout(750);assert p.evaluate('scrollY')>300
 assert p.locator('.sx-stage[data-complete=true] .sx-answer').input_value()==answer
 p.screenshot(path=str(OUT/'ocean-descent.png'),full_page=True)
 # A copied in-progress dive resumes even with a different motion preference.
 stage=p.locator('.sx-stage[data-step="1"]');stage.locator('.sx-answer').fill('My unfinished sentence.');stage.locator('.sx-hint-toggle').click();url=p.evaluate('SharedGame.getLink()')
 c=b.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce');q=c.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto(url);q.wait_for_function('window.SharedGame&&!SharedGame.replaying');assert q.locator('.shared-game-loading').count()==0
 assert q.evaluate('EX.index')==1;assert q.locator('.sx-stage[data-step="1"] .sx-answer').input_value()=='My unfinished sentence.';assert q.locator('.sx-stage[data-step="1"] .sx-hint').is_visible();c.close()
 # Reverse motion preferences: fast teacher edits must wait for the pupil's reveal.
 p.emulate_media(reduced_motion='reduce');open_topic(next(t for t in topics if t['level']=='b2' and t['number']==7))
 for i in range(4):
  p.locator(f'#sx-answer-{i}').fill(p.evaluate('i=>EX.chain.steps[i].answers[0]',i));p.locator(f'#sx-check-{i}').click();p.wait_for_function(f"EX.index==={i+1}&&document.querySelector('.sx-dive').dataset.phase==='question'")
 assert 'who was trained' in p.evaluate('EX.chain.steps[4].answers[0]');p.locator('#sx-answer-4').fill('A draft on the final step.');url=p.evaluate('SharedGame.getLink()')
 c=b.new_context(viewport={'width':390,'height':900},reduced_motion='no-preference');q=c.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto(url);q.wait_for_function('window.SharedGame&&!SharedGame.replaying');assert q.locator('.shared-game-loading').count()==0;assert q.evaluate('EX.index')==4
 assert q.locator('#sx-answer-4').input_value()=='A draft on the final step.';q.wait_for_timeout(800);assert q.evaluate('scrollY')>1000
 q.locator('#sx-answer-4').fill(q.evaluate('EX.chain.steps[4].answers[0]'));q.locator('#sx-check-4').click();q.wait_for_selector('.sx-finish');c.close()
 # Phone / tablet layouts, keyboard, readable fields and functioning back navigation.
 p.emulate_media(reduced_motion='reduce')
 for width in [768,390]:
  p.set_viewport_size({'width':width,'height':900});open_topic(next(t for t in topics if t['level']=='c1' and t['number']==2));assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
  stage,field,button=check_step(0);field.fill(p.evaluate('EX.chain.steps[0].answers[0]'));button.click();p.wait_for_selector('.sx-stage[data-step="1"]');p.wait_for_timeout(70)
  assert p.evaluate('document.documentElement.scrollWidth<=innerWidth');assert p.locator('.sx-stage[data-step="1"] .sx-answer').bounding_box()['width']>280
  if width==390:p.screenshot(path=str(OUT/'mobile.png'),full_page=True)
  p.locator('#sx-topics').click();assert p.locator('[data-grammar-exercise="exp_c1_2"]').count()==1
 # Home-book entry has its own topic selector and preserved oral practice option.
 p.set_viewport_size({'width':1440,'height':1000});p.evaluate("go('home')");p.locator('[data-book-game=ruler]').click();assert p.locator('.sx-catalog').count()==1
 p.locator('[data-sx-level=kids]').click();assert p.locator('.sx-topic').count()==9;p.locator('[data-sx-mode=speak]').click();p.locator('[data-sx-topic="exp_kids_2"]').click();p.wait_for_function("document.querySelector('.sx-dive').dataset.phase==='question'")
 assert p.locator('.sx-answer').count()==0;p.locator('.sx-check').click();p.wait_for_selector('.sx-stage[data-step="1"]');assert p.locator('.sx-spoken-example').count()==1
 p.locator('#sx-topics').click();assert p.locator('.sx-catalog').count()==1
 # Exit while a reveal is running; no delayed task may reappear on Home.
 p.emulate_media(reduced_motion='no-preference');p.locator('[data-sx-topic="exp_kids_2"]').click();p.evaluate("go('home')");p.wait_for_timeout(1200);assert p.locator('.sx-dive').count()==0;assert 'sentence-dive' not in p.locator('body').get_attribute('class')
 assert not errors,errors;assert not missing,missing
 print('PASS',json.dumps(report),'— 66 complete dives, unchanged/wrong edits, hint/example, real block reveal, descent, sharing, oral mode, navigation, cleanup and mobile.')
 # Export the actual reviewed curriculum, not a separate proposal.
 curriculum=p.evaluate('SentenceExpander.topics.map(t=>({...t,...ExpanderCurriculum.variant(t.level,t.number)}))')
 lines=['# Sentence Expander — последовательности по всем темам','', 'В каждой цепочке пять изменений. Примеры ниже — проверяемые модели; в игре принимаются сокращения и указанные британские/американские варианты.','']
 for t in curriculum:
  lines+=['## '+t['level'].upper()+' · '+t['name'],'','Начало: **'+t['start']+'**','']
  for i,step in enumerate(t['steps'],1):lines += [str(i)+'. '+step['instruction'],'   - '+step['answers'][0]]
  lines+=['']
 (ROOT/'docs/sentence-expander-curriculum.md').write_text('\n'.join(lines));(OUT/'curriculum.md').write_text('\n'.join(lines))
 b.close()
server.shutdown()
