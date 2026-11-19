"""B1 free cues, selected-topic paper list, chosen-word cards and one timed task per drawer."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
import json,hashlib,os
from playwright.sync_api import sync_playwright
ROOT=Path(os.environ.get('REVISION_ROOM_ROOT',Path(__file__).resolve().parents[1]));OUT=Path('/workspace/shared/downloads/revision-room-b1');OUT.mkdir(parents=True,exist_ok=True)
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(Q,directory=str(ROOT)));Thread(target=srv.serve_forever,daemon=True).start()
data=json.loads((ROOT/'docs/revision-room-b1-bank.json').read_text());assert len(data['topics'])==24
for t in data['topics']:
 assert len(t['tasks'])==15 and len(set(t['tasks']))==15
 assert all('Oliver' not in p and 'Charlotte' not in p and 'Amelia' not in p and 'Ben ' not in p for p in t['tasks'])
assert len(data['words'])==187
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');errors=[];missing=[]
 p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.status>=400 and 'favicon' not in r.url else None)
 p.goto(f'http://127.0.0.1:{srv.server_port}/');p.evaluate("go('gram')");p.locator('[data-catalog-level="b1"]').click();assert p.locator('[data-grammar-topic]').last.inner_text()=='Revision room';assert p.locator('[data-grammar-topic]').filter(has_text='Revision room').count()==1;p.locator('[data-grammar-topic]').filter(has_text='Revision room').click();p.locator('[data-grammar-exercise="revision_room"]').click()
 p.locator('[data-exit-b1]').click();assert p.locator('[data-catalog-level="b1"]').get_attribute('aria-selected')=='true';assert p.locator('[data-grammar-topic]').last.inner_text()=='Revision room';p.locator('[data-grammar-topic]').last.click();p.locator('[data-grammar-exercise="revision_room"]').click()
 assert p.locator('[data-category]').count()==4;assert p.locator('[data-topic-icon]').count()==12;assert p.locator('[data-topic-icon][aria-pressed=true]').count()==0
 def at(i,v=.4):
  p.evaluate('''([i,t])=>{const e=document.querySelector('#rbStory'),top=e.getBoundingClientRect().top+scrollY;scrollTo({top:top+(e.offsetHeight-innerHeight)*(i+t)/5,behavior:'instant'})}''',[i,v]);p.wait_for_timeout(80)
 at(0,.4)
 for id in ['present-simple','past-simple','past-continuous','present-perfect','past-perfect']:
  p.locator(f'[data-topic-icon="{id}"]').click()
 p.locator('[data-category="conditions"]').click();p.locator('[data-topic-icon="second"]').click()
 p.locator('[data-category="forms"]').click();p.locator('[data-topic-icon="gerund"]').click()
 p.locator('[data-category="structures"]').click();p.locator('[data-topic-icon="passive"]').click()
 assert p.evaluate('RevisionRoom.getState().selected.length')==8
 p.screenshot(path=str(OUT/'01-topic-icons.png'))
 p.locator('[data-go="settings"]').first.click();assert p.locator('.rb-leaf [data-list-topic]').count()==8
 assert p.locator('[data-topic]').count()==0;assert p.locator('.rb-leaf-next').is_enabled()
 p.locator('#rbWordsOpen').click();p.locator('#rbSearch').fill('resourceful');p.locator('[data-word="resourceful"]').check();p.locator('#rbSearch').fill('curious');p.locator('[data-word="curious"]').check();p.locator('#rbCustomWords').click();p.locator('#rbPaste').fill('my own phrase\n<script>alert(1)</script>');p.locator('#rbAddWords').click()
 assert p.locator('.rb-leaf-next').is_enabled();assert 'my own phrase' in p.locator('.rb-chosen-word-tags').inner_text();p.locator('#rbBaseWord').fill('travel');p.screenshot(path=str(OUT/'02-paper-list.png'))
 p.locator('.rb-leaf-next').click();assert p.locator('.rb-tense-table textarea').count()==5
 first=p.locator('[data-draft="tense:present-perfect:travel"]');assert first.input_value()==''
 assert 'travel' in first.locator('..').inner_text();assert 'Charlotte' in first.locator('..').inner_text()
 assert p.locator('[data-rate],[data-toggle],.rr-rating,.rr-model').count()==0
 first.fill('My own completely free sentence.');p.screenshot(path=str(OUT/'03-free-table.png'))
 p.locator('[data-table="conditions"]').click();assert p.locator('.rb-row-table textarea').count()==1;p.locator('.rb-row-table textarea').fill('My own conditional.');p.locator('[data-table="forms"]').click();assert p.locator('.rb-row-table textarea').count()==2
 p.locator('[data-go="cards"]').first.click();assert p.locator('.rb-lex-pair').count()==4
 assert p.locator('.rb-object-word').all_text_contents()==['resourceful','curious','my own phrase','<script>alert(1)</script>']
 assert p.locator('.rb-card-pile,.rb-vocab-card,.rb-active-card').count()==0
 before=p.locator('.rb-lex-task-text').all_text_contents();p.locator('[data-lex-refresh="0"]').click();after=p.locator('.rb-lex-task-text').all_text_contents();assert before[0]!=after[0] and before[1:]==after[1:]
 p.screenshot(path=str(OUT/'04-two-row-cards.png'))
 p.locator('[data-action="next-card"]').click();assert p.locator('.rb-drawer').count()==8
 forbidden=['Открывай несколько ящиков','Самостоятельно','С подсказкой','Повторить','Ещё не отмечено','Изменить набор тем','Скачать ответы','Новая попытка','Сводка основана']
 assert all(x not in p.locator('#rbScene').inner_text() for x in forbidden)
 for id in ['present-perfect','second']:p.locator(f'[data-drawer="{id}"]').click()
 assert p.locator('.rb-open').count()==2;assert p.locator('.rb-drawer-card:visible').count()==2
 p.locator('[data-open-task="present-perfect"]').click();assert p.locator('#rbStoryDialog').is_visible();assert p.locator('#rbStoryTask h2').count()==1
 assert p.locator('#rbTaskWord').inner_text() in p.evaluate('RevisionRoom.getState().wordSelection');assert p.locator('#rbTimer').inner_text()=='1:00'
 seen=[]
 for i in range(15):seen.append(p.locator('#rbStoryTask h2').inner_text());p.locator('#rbTaskRefresh').click()
 assert len(set(seen))==15
 p.clock.install();p.locator('#rbTimerStart').click();p.clock.fast_forward(61000);assert p.locator('#rbTimer').inner_text()=='0:00';p.locator('#rbTimerReset').click();assert p.locator('#rbTimer').inner_text()=='1:00';p.locator('#rbTaskClose').click();p.screenshot(path=str(OUT/'05-one-task-per-drawer.png'))
 p.reload();p.evaluate("go('gram');spOpen('revision_room')");assert p.locator('.rb-drawer').count()==8
 p.evaluate("RevisionRoom.go('tables')");p.locator('[data-table="tenses"]').click();assert p.locator('[data-draft="tense:present-perfect:travel"]').input_value()=='My own completely free sentence.'
 p.set_viewport_size({'width':390,'height':844})
 for i,stage in enumerate(['intro','settings','tables','cards','archive']):
  at(i);assert p.locator(f'[data-stage="{stage}"]').count()==1;assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),stage;p.screenshot(path=str(OUT/(stage+'-mobile.png')))
 assert not errors,errors;assert not missing,missing
 print('PASS: 24×15 B1 prompts; category icons and selected-only leaf; real B1/custom words; direct free table input; two-row reference cards; exact drawer count; one live task; 60s timer; 15-question cycling; escaped custom text; persistence; mobile; no grading or service clutter.')
 b.close()
