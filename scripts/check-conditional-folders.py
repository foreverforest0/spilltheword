"""Course provenance, catalog entry, photo selection/flight, saved writing and level isolation."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from functools import partial
from threading import Thread
import json,os
from playwright.sync_api import sync_playwright
SOURCE=Path(__file__).resolve().parents[1];ROOT=Path(os.environ.get('CONDITIONAL_FOLDERS_ROOT',SOURCE))
data=json.loads((SOURCE/'docs/conditional-folders-bank.json').read_text());b1=json.loads((SOURCE/'docs/revision-room-b1-bank.json').read_text())['words'];b2=json.loads((SOURCE/'docs/b2-alh-approved.json').read_text())
assert [len(data['levels'][lv]['tasks']) for lv in ['b1','b2','c1']]==[24,30,25]
for lv,level in data['levels'].items():
 assert {t['kind'] for t in level['tasks']}==set(level['kinds'])
 assert len({t['id'] for t in level['tasks']})==len(level['tasks']);assert len({t['prompt'] for t in level['tasks']})==len(level['tasks'])
 for t in level['tasks']:
  assert t['prompt'] and t['example'] and t['reason'];assert 0<=t['photo']<16
  v=t['vocab']
  if lv=='b1':assert v['course']=='b1' and v['word'] in b1
  else:assert v['course']=='b2alh' and v['word'] in b2['units'][v['unit']]['ls'][v['lesson']]['v']
 assert {'negative-condition','question'}.issubset({f for t in level['tasks'] for f in t['facets']}) if lv!='c1' else True
assert {'past-now','now-past'}.issubset({f for t in data['levels']['b2']['tasks'] for f in t['facets']})
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(Q,directory=str(ROOT)));Thread(target=srv.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{srv.server_port}/'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1000});errors=[];missing=[];p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.status>=400 and 'favicon' not in r.url else None);p.goto(url)
 for lv in ['b1','b2','c1']:
  p.evaluate("go('gram')");p.locator(f'[data-catalog-level="{lv}"]').click()
  if lv=='b1':assert p.locator('[data-grammar-topic]').last.inner_text()=='Revision room'
  p.locator('[data-grammar-topic]').filter(has_text='Conditional').first.click();p.locator(f'[data-grammar-exercise="conditional_folders_{lv}"]').click();p.locator('#cfPage').wait_for();assert p.locator('.cf-folder').count()==(3 if lv=='b1' else 5);assert p.locator('[data-photo]').count()==16
  deck=p.evaluate('ConditionalFolders.getState().deck');rows=data['levels'][lv]['tasks'];assert len({next(t for t in rows if t['id']==i)['photo'] for i in deck})==16
  assert p.locator('.cf-selection').count()==0;assert p.locator('#cfPage').inner_text().count('Say one conditional.')==1
  assert p.locator('.game-share-toolbar:visible').count()==0
  p.screenshot(path=f'/tmp/conditional-folders-{lv}.png',full_page=True)
  tile=p.locator('[data-photo]').first;id=tile.get_attribute('data-photo');tile.click();assert p.locator('#cfPrompt').inner_text()==next(t['prompt'] for t in rows if t['id']==id);assert not p.locator('#cfModel').is_visible();assert not p.locator('#cfAnswer').is_visible()
  p.locator('#cfWrite').click();p.locator('#cfAnswer').fill('My own conditional: <script>not executed</script>.');p.locator('#cfExample').click();assert p.locator('#cfModel').is_visible();p.locator('#cfExample').click();p.screenshot(path=f'/tmp/conditional-folders-task-{lv}.png',full_page=True)
  kind=next(t['kind'] for t in rows if t['id']==id);wrong=next(k for k in data['levels'][lv]['kinds'] if k!=kind);p.locator(f'[data-file="{wrong}"]').click();assert p.locator('#cfFeedback').is_visible();assert p.locator('.cf-flight').count()==0;assert p.locator('[data-photo]').count()==16;assert id not in p.evaluate('ConditionalFolders.getState().placed');assert p.locator('#cfAnswer').input_value()=='My own conditional: <script>not executed</script>.';p.locator(f'[data-file="{kind}"]').click();p.locator('.cf-flight').wait_for(state='attached');assert p.locator('.cf-flight').evaluate('e=>e.getAnimations().length')>0;flight_box=p.locator('.cf-flight').bounding_box();p.wait_for_timeout(140);raised=p.locator('.cf-flight').bounding_box();assert raised['y']<flight_box['y']-5;p.locator('.cf-flight').wait_for(state='detached');p.wait_for_timeout(100)
  assert p.locator('[data-photo]').count()==15;assert p.locator('.cf-selection').count()==0;assert p.evaluate('ConditionalFolders.getState().placed')[id]==kind
  assert p.locator(f'[data-folder="{kind}"] .cf-stored-photo').count()==1
  # The same photo can be reopened, reviewed and moved again without duplicate counts.
  p.locator(f'[data-folder="{kind}"]').click();assert p.locator('[data-photo]').count()==1;p.locator('[data-photo]').click();assert p.locator('#cfAnswer').input_value()=='My own conditional: <script>not executed</script>.';p.locator('#cfDeselect').click();p.locator('#cfLibraryBack').click();p.locator('#cfBack').click();assert p.locator(f'[data-catalog-level="{lv}"]').get_attribute('aria-selected')=='true'
 # Dragging a different photo while a task is open must show that photo's own prompt on rejection.
 p.evaluate("ConditionalFolders.open('b1')");p.locator('[data-photo]').first.click();other=p.locator('[data-photo]').nth(1);other_id=other.get_attribute('data-photo');other_task=next(t for t in data['levels']['b1']['tasks'] if t['id']==other_id);other_wrong=next(k for k in data['levels']['b1']['kinds'] if k!=other_task['kind']);other.drag_to(p.locator(f'[data-folder="{other_wrong}"]'));assert p.locator('#cfPrompt').inner_text()==other_task['prompt'];assert p.locator('.cf-selection').get_attribute('data-selected-photo')==other_id;assert p.locator('#cfFeedback').is_visible();p.locator('#cfDeselect').click()
 # Actual drag/drop follows the same filing transition.
 p.evaluate("ConditionalFolders.open('b1')");drag=p.locator('[data-photo]').first;drag_id=drag.get_attribute('data-photo');drag_kind=next(t['kind'] for t in data['levels']['b1']['tasks'] if t['id']==drag_id);wrong=next(k for k in data['levels']['b1']['kinds'] if k!=drag_kind);drag.drag_to(p.locator(f'[data-folder="{wrong}"]'));assert drag_id not in p.evaluate('ConditionalFolders.getState().placed');assert p.locator('#cfFeedback').is_visible();p.locator(f'[data-photo="{drag_id}"]').drag_to(p.locator(f'[data-folder="{drag_kind}"]'));p.wait_for_timeout(1100);assert p.locator(f'[data-folder="{drag_kind}"] .cf-stored-photo').count()>=1
 # Persistence, narrow screens, keyboard selection, reduced motion and reset retaining drafts.
 p.goto(url+'#g=speak&tp=conditional_folders_b2&lv=b2');p.locator('#cfPage').wait_for();assert len(p.evaluate('ConditionalFolders.getState().placed'))==1
 p.emulate_media(reduced_motion='reduce');p.locator('[data-photo]').first.focus();p.keyboard.press('Enter');assert p.locator('.cf-selection').is_visible();p.keyboard.press('Escape');assert p.locator('.cf-selection').count()==0
 p.locator('#cfReset').click();assert p.evaluate('Object.keys(ConditionalFolders.getState().placed).length')==0;assert p.evaluate('Object.keys(ConditionalFolders.getState().answers).length')==1
 for width in [390,320]:
  p.set_viewport_size({'width':width,'height':844});assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1');p.locator('[data-photo]').first.click();assert p.locator('#cfPrompt').is_visible();assert p.locator('#cfPrompt').evaluate('e=>getComputedStyle(e).fontFamily').startswith('FolderInter');p.screenshot(path=f'/tmp/conditional-folders-{width}.png',full_page=True);mobile_id=p.locator('.cf-selected').get_attribute('data-photo');mobile_kind=next(t['kind'] for t in data['levels']['b2']['tasks'] if t['id']==mobile_id);p.locator(f'[data-file="{mobile_kind}"]').click();assert p.locator('.cf-flight').count()==0;assert not p.locator('.cf-selection').count()
 # Every authored B2 task remains reachable across successive photo sets.
 total=len(data['levels']['b2']['tasks']);guard=0
 while len(p.evaluate('ConditionalFolders.getState().placed'))<total:
  if p.locator('[data-photo]').count()==0:p.locator('#cfNextSet').click()
  first=p.locator('[data-photo]').first;id=first.get_attribute('data-photo');kind=next(t['kind'] for t in data['levels']['b2']['tasks'] if t['id']==id);first.click();p.locator(f'[data-file="{kind}"]').click();guard+=1;assert guard<=total
 assert p.locator('[data-photo]').count()==0;assert p.locator('#cfNextSet').count()==0
 # Leaving during a flight cannot bring the activity back over the catalog.
 p.emulate_media(reduced_motion='no-preference');p.evaluate("ConditionalFolders.open('b1')");p.locator('[data-photo]').first.click();exit_id=p.locator('.cf-selected').get_attribute('data-photo');exit_kind=next(t['kind'] for t in data['levels']['b1']['tasks'] if t['id']==exit_id);p.locator(f'[data-file="{exit_kind}"]').click();p.locator('.cf-flight').wait_for(state='attached');p.evaluate("go('gram')");p.wait_for_timeout(900);assert p.locator('.grammar-page').is_visible();assert p.locator('#cfPage,.cf-flight').count()==0
 assert not errors,errors;assert not missing,missing;b.close()
print('PASS: 79 original course-linked tasks; 3 levels and catalog routes; 16 distinct photos per initial grid; hidden examples; saved drafts; actual photo flight and drag/drop; folder reopening/counts; direct entry; keyboard/reduced motion/mobile; wrong-folder rejection, correct filing; no missing assets.')
srv.shutdown()
