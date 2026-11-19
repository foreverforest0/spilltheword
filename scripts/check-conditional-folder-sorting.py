"""Verify wrong/correct folder choices for every task and migrate legacy misfiling."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
import json,os
SOURCE=Path(__file__).resolve().parents[1];ROOT=Path(os.environ.get('CONDITIONAL_FOLDERS_ROOT',SOURCE));data=json.loads((SOURCE/'docs/conditional-folders-bank.json').read_text())
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(Q,directory=str(ROOT)));Thread(target=srv.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{srv.server_port}/'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1280,'height':900},reduced_motion='reduce');errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.goto(url)
 for lv,d in data['levels'].items():
  p.evaluate('lv=>ConditionalFolders.open(lv)',lv);done=0
  while done<len(d['tasks']):
   if not p.locator('[data-photo]').count():p.locator('#cfNextSet').click()
   tile=p.locator('[data-photo]').first;id=tile.get_attribute('data-photo');t=next(t for t in d['tasks'] if t['id']==id);tile.click();count=p.locator('[data-photo]').count()
   for wrong in d['kinds']:
    if wrong==t['kind']:continue
    p.locator(f'[data-file="{wrong}"]').click();assert p.locator('#cfFeedback').is_visible();assert p.locator('.cf-selected').get_attribute('data-photo')==id;assert p.locator('[data-photo]').count()==count;assert len(p.evaluate('ConditionalFolders.getState().placed'))==done
   p.locator(f'[data-file="{t["kind"]}"]').click();done+=1;assert len(p.evaluate('ConditionalFolders.getState().placed'))==done;assert not p.locator('.cf-selection').count()
  assert sum(map(int,p.locator('.cf-folder-caption>span').all_text_contents()))==len(d['tasks'])
 # Existing, formerly unchecked sorting: keep correct placements, return wrong ones, retain writing.
 rows=data['levels']['b1']['tasks'];correct,wrong=rows[:2];bad=next(k for k in data['levels']['b1']['kinds'] if k!=wrong['kind']);legacy={'b1':{'placed':{correct['id']:correct['kind'],wrong['id']:bad},'answers':{wrong['id']:'My saved sentence.'},'deck':[correct['id']]}}
 q=b.new_page(reduced_motion='reduce');q.add_init_script("localStorage.setItem('spill-conditional-folders-v1',"+json.dumps(json.dumps(legacy))+")");q.goto(url+'#g=speak&tp=conditional_folders_b1&lv=b1');q.locator('#cfPage').wait_for();s=q.evaluate('ConditionalFolders.getState()');assert s['placed']=={correct['id']:correct['kind']};assert wrong['id'] in s['deck'];assert s['answers'][wrong['id']]=='My saved sentence.';q.locator(f'[data-photo="{wrong["id"]}"]').click();assert q.locator('#cfAnswer').input_value()=='My saved sentence.'
 assert not errors,errors;b.close()
print('PASS: every correct/incorrect destination across all 79 B1/B2/C1 tasks; only successful choices count; wrong choices keep selection; legacy incorrect placements return without losing drafts.')
srv.shutdown()
