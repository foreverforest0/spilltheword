"""Present Perfect B1: exact question tasks, time gaps, fridge and alternating pond."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 p=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');errors=[];missing=[]
 p.on('pageerror',lambda e:errors.append(str(e)))
 base=f'http://127.0.0.1:{server.server_port}/'
 p.on('response',lambda r:missing.append(r.url) if r.status>=400 and r.url.startswith(base) else None)
 # Speed up the existing print animation only; keep real input and checking logic.
 p.add_init_script("const nativeInterval=window.setInterval;window.setInterval=(f,t,...a)=>nativeInterval(f,t===34?1:t,...a)")
 p.goto(base)
 report=p.evaluate('''()=>{
  S.splevel='b1';const D=PresentPerfectB1,assert=(v,m)=>{if(!v)throw Error(m)};
  for(const rows of [D.questions,D.timeRows,D.buildRows,D.corrections])for(const row of rows){
   const v=row.vocab,c=COURSES.find(c=>c.id===v.course);
   assert(c.units[v.unit].ls[v.lesson].v.includes(v.lexeme),'Invalid course provenance '+JSON.stringify(v));
  }
  const group=SPGRP.b1.find(g=>g[0].startsWith('1 ·'));
  for(const id of ['tv3','tppq','tppfs','mb1pf','pond_b1_1'])assert(group[1].includes(id)&&DMTF[id],'Missing catalog route '+id);
  assert(TYD.tv3.pool('all').some(r=>r.a.includes('written')),'V3 drill lost');
  assert(TYD.tppq.pool('all').every(r=>r.a.length===1),'Ambiguous question key');
  assert(D.questions.every(r=>r.question.startsWith(r.start)&&r.question.endsWith('?')),'Fixed opening');
  for(const r of D.timeRows){assert(['for','since'].includes(r.answer),'Time gap');assert(!b1AnswerMatch(r.answer==='for'?'since':'for',r.answer),'Wrong time accepted')}
  for(const r of D.corrections){assert(!QuestionPond.matches(r.wrong,[r.answer]),'Original error accepted');assert(QuestionPond.matches(r.answer,[r.answer]),'Correction rejected')}
  const bank=QuestionPond.bankFor('b1',1);assert(bank.length===54,'Unexpected pond bank');
  assert(new Set(bank.map(r=>r.kind)).size===3,'Missing pond kind');
  assert(B1MAG.mb1pf.types.map(t=>t[0]).join(',')==='sent,time','Fridge should have two modes');
  return {questions:D.questions.length,timeGaps:D.timeRows.length,pond:bank.length,fridge:B1MAG.mb1pf.items().length};
 }''')
 # Full questions can exceed the old one-line typewriter input limit.
 p.evaluate("go('gram');S.splevel='b1';spOpen('tppq')")
 p.wait_for_function('TYDR&&!TYDR.busy')
 expected=p.evaluate('TYDR.q[TYDR.i].a[0]')
 p.locator('#tyta').fill('Has she went?');p.locator('#tyta').press('Enter')
 assert 'Not quite' in p.locator('#drres').inner_text()
 p.evaluate("while(TY.L>TYDR.ansL||(TY.L===TYDR.ansL&&TY.col>TYDR.ansC))TYDR.keyc('Backspace')")
 assert p.evaluate('TYDR.answer()')==''
 p.locator('#tyta').fill(expected);p.locator('#tyta').press('Enter')
 assert 'Correct!' in p.locator('#drres').inner_text()
 # Force the longest canonical item through the same renderer and textarea.
 p.evaluate("TYD.tppq._originalPool=TYD.tppq.pool;TYD.tppq.pool=()=>[TYD.tppq._originalPool().sort((a,b)=>b.a[0].length-a.a[0].length)[0]];spOpen('tppq')")
 p.wait_for_function('TYDR&&!TYDR.busy');long=p.evaluate('TYDR.q[0].a[0]');assert len(long)>40
 p.locator('#tyta').fill(long);assert p.evaluate('TY.L>TYDR.ansL')
 p.locator('#tyta').press('Backspace');p.locator('#tyta').press('Backspace');p.locator('#tyta').press('Enter')
 assert 'Not quite' in p.locator('#drres').inner_text()
 p.locator('#tyta').fill(long[-2:]);p.locator('#tyta').press('Enter')
 assert 'Correct!' in p.locator('#drres').inner_text()
 p.evaluate("TYD.tppq.pool=TYD.tppq._originalPool;spOpen('tppfs')")
 p.wait_for_function('TYDR&&!TYDR.busy');word=p.evaluate('TYDR.q[0].a[0]')
 p.locator('#tyta').fill('since' if word=='for' else 'for');p.locator('#tyta').press('Enter')
 assert 'Not quite' in p.locator('#drres').inner_text()
 p.evaluate("while(TY.col>TYDR.ansC)TYDR.keyc('Backspace')")
 p.locator('#tyta').fill(word);p.locator('#tyta').press('Enter')
 assert 'Correct!' in p.locator('#drres').inner_text()
 # Old saved fridge filters fall back to mixed sentences, not an empty bank.
 p.evaluate("S.mgxt=S.mgxt||{};S.mgxt.mb1pf='?';spOpen('mb1pf')")
 assert p.evaluate('S.mgxt.mb1pf')=='sent'
 assert p.locator('.mgmodes [data-t]').count()==2
 for mode in ['sent','time']:
  rows=p.evaluate("mode=>B1MAG.mb1pf.items().filter(r=>r[0]===mode)",mode)
  chosen=([rows[0],next(r for r in rows if r[1][0].endswith('?'))] if mode=='sent' else [rows[0],rows[1]])
  for row in chosen:
   p.evaluate("([mode,row])=>{S.mgxt.mb1pf=mode;S.b1challenge={mb1pf:'guided'};MGXQ['mb1pf'+mode]=[row];dmMagnets('mb1pf',B1MAG.mb1pf)}",[mode,row])
   words=row[4].get('tokens') or row[1][0].translate(str.maketrans('','','.,?!')).split()
   if mode=='time':
    wrong='since' if 'for' in words else 'for';wrong_words=[wrong if w in ['for','since'] else w for w in words]
    for w in wrong_words:
     p.evaluate("w=>[...document.querySelectorAll('.b1-bank .b1-magnet')].find(b=>b.querySelector('span').textContent===w).click()",w)
    p.locator('#mgchk').click();assert 'Not yet' in p.locator('.b1-answer').inner_text()
    p.evaluate("[...document.querySelectorAll('.b1-strip .b1-magnet')].forEach(b=>b.click())")
   for w in words:p.evaluate("w=>[...document.querySelectorAll('.b1-bank .b1-magnet')].find(b=>b.querySelector('span').textContent===w).click()",w)
   p.locator('#mgchk').click();assert 'Perfect!' in p.locator('.b1-answer').inner_text()
   if mode=='time':assert p.locator('.b1-bank .b1-magnet').count()==1
 # Nine catches: build -> fix -> question, with no exercise-type picker.
 p.evaluate("spOpen('pond_b1_1')")
 seen=[]
 for i in range(9):
  p.locator('.pond-fish').first.click();p.wait_for_selector('#pondAnswer')
  kind=p.locator('.pond-page').get_attribute('data-task-kind');seen.append(kind)
  assert kind==['build','fix','question'][i%3]
  index=int(p.locator('.pond-page').get_attribute('data-question-index'))
  answer=p.evaluate("i=>QuestionPond.bankFor('b1',1)[i].answers[0]",index)
  p.locator('#pondAnswer').fill('She have went since two years.');p.locator('#pondCheck').click()
  assert p.locator('.pond-page').get_attribute('data-outcome')=='incorrect'
  p.locator('#pondAnswer').fill(answer);p.locator('#pondCheck').click()
  assert p.locator('.pond-page').get_attribute('data-outcome')=='correct'
  p.locator('#pondReturn').click();p.wait_for_function("document.querySelector('.pond-page').dataset.phase==='idle'")
 for width in [390,320]:
  p.set_viewport_size({'width':width,'height':900});p.evaluate("spOpen('pond_b1_1')")
  p.locator('.pond-fish').first.click();p.wait_for_selector('#pondAnswer')
  assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
 assert not errors,errors;assert not missing,missing
 print('PASS',report,'— typed questions including wrapping/backspace, gap rejection, fridge modes and unused distractor, 9 alternating catches, mobile.')
 b.close()
server.shutdown()
