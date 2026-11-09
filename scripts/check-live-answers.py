"""Live answer transport contract, actual DOM snapshots, nested apps and disconnection.
Firestore's compat API is served by a local test backend; no remote project is changed.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright
import json,time
ROOT=Path(__file__).resolve().parents[1];packets={}
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
 def do_POST(self):
  if self.path!='/test-live':return super().do_POST()
  d=json.loads(self.rfile.read(int(self.headers['Content-Length'])));packets[d['path']]=d['packet'];self.send_response(200);self.end_headers();self.wfile.write(b'{}')
 def do_GET(self):
  if self.path.startswith('/test-live?'):
   from urllib.parse import parse_qs,urlparse
   prefix=parse_qs(urlparse(self.path).query)['prefix'][0];data=[{'id':k.split('/')[-1],'data':v} for k,v in packets.items() if k.startswith(prefix+'/')];self.send_response(200);self.send_header('Content-type','application/json');self.end_headers();self.wfile.write(json.dumps(data).encode());return
  super().do_GET()
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
FAKE='''window.firebase=window.firebase||{apps:[],initializeApp(cfg,name){
 function col(path){return {doc(id){return {collection(n){return col(path+'/'+id+'/'+n)},async set(packet){await fetch('/test-live',{method:'POST',body:JSON.stringify({path:path+'/'+id,packet})})}}},onSnapshot(next,error){let alive=true,last='';const run=async()=>{try{const a=await(await fetch('/test-live?prefix='+encodeURIComponent(path))).json();const s=JSON.stringify(a);if(alive&&s!==last){last=s;next({docChanges:()=>a.map(x=>({type:'modified',doc:{id:x.id,data:()=>x.data}}))})}}catch(e){if(alive)error(e)}};run();const timer=setInterval(run,250);return()=>{alive=false;clearInterval(timer)}}}}
 const app={name,auth:()=>({signInAnonymously:async()=>({})}),firestore:()=>({collection:col})};this.apps.push(app);return app}};'''
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);errors=[]
 def context():
  c=b.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce');c.route('**/firebasejs/**',lambda r:r.fulfill(content_type='text/javascript',body=FAKE));return c
 c=context();teacher=c.new_page();teacher.on('pageerror',lambda e:errors.append(str(e)));teacher.goto(base);teacher.evaluate("openSharedGrammar('pond_b1_1','b1')");teacher.locator('.pond-fish').first.click(force=True);teacher.wait_for_selector('#pondAnswer');url=teacher.evaluate('SharedGame.getLink()')
 c2=context();student=c2.new_page();student.on('pageerror',lambda e:errors.append(str(e)));student.goto(url);student.wait_for_function('window.SharedGame&&!SharedGame.replaying');student.wait_for_selector('#pondAnswer');teacher.get_by_role('button',name='See answers',exact=True).click()
 student.locator('#pondAnswer').fill('I have been reading for two hours.');tile=teacher.locator('.live-answer-tile iframe');tile.wait_for();screen=teacher.frame_locator('.live-answer-tile iframe');screen.locator('#pondAnswer').wait_for();teacher.wait_for_function("!!document.querySelector('.live-answer-tile iframe')?.contentDocument") # scripts remain disabled; same-origin styles/images can load
 def wait_value(text):
  end=time.time()+15
  while time.time()<end:
   try:
    if screen.locator('#pondAnswer').input_value(timeout=500)==text:return
   except Exception:pass
   time.sleep(.2)
  raise AssertionError('Live answer did not update')
 wait_value('I have been reading for two hours.');student.locator('#pondAnswer').fill('An edited answer.');wait_value('An edited answer.');assert tile.get_attribute('sandbox')=='allow-same-origin'
 assert packets and all('An edited answer.' not in json.dumps(d) for d in packets.values()),'Answers must be encrypted on transport'
 # A live canvas is rendered as an image, rather than disappearing from the teacher screen.
 student.locator('#pondDrawMode').click();student.locator('#pondStartDrawing').click();canvas=student.locator('#pondCanvas');r=canvas.bounding_box();student.mouse.move(r['x']+20,r['y']+40);student.mouse.down();student.mouse.move(r['x']+120,r['y']+90,steps=8);student.mouse.up()
 screen.locator('img[src^="data:image/png"]').wait_for(timeout=15000)
 screen.locator('.pond-layout').evaluate("e=>{if(getComputedStyle(e).display!=='grid')throw Error('Missing game CSS')}");teacher.screenshot(path='/tmp/live-answers-pond.png',full_page=True)
 teacher.locator('.live-answer-header button').click();assert teacher.locator('.live-answer-panel').count()==0
 # A nested standalone app is kept, including its own styles and form values.
 teacher.evaluate("openSharedGrammar('app','kids')");url=teacher.evaluate('SharedGame.getLink()');student.goto(url);student.wait_for_function('window.SharedGame&&!SharedGame.replaying');frame=student.frame_locator('#view iframe');frame.locator('[data-mode=free]').click();frame.locator('#name').fill('Jamie Live');teacher.get_by_role('button',name='See answers',exact=True).click()
 nested=teacher.frame_locator('.live-answer-tile iframe').frame_locator('#view iframe');
 try:nested.locator('#name').wait_for(timeout=15000)
 except Exception:
  print(student.locator('[data-live-status]').all_text_contents(), student.evaluate('(()=>{const s=SharedLive.snapshot();return [s.html.length,s.html.includes("Jamie Live"),s.html.includes("srcdoc")]})()'),[(k,len(v['w'])) for k,v in packets.items()],flush=True)
  teacher.screenshot(path='/tmp/live-answers-error.png',full_page=True)
  raise
 end=time.time()+15
 while nested.locator('#name').input_value()!='Jamie Live' and time.time()<end:time.sleep(.3)
 assert nested.locator('#name').input_value()=='Jamie Live';assert nested.locator('#portrait>svg').count()==1
 assert not errors,errors
 # Explicit, visible failure if a cross-device service cannot be reached.
 off=b.new_context();off.route('**/firebasejs/**',lambda r:r.abort());p=off.new_page();p.goto(base);p.evaluate("go('gram')");p.get_by_role('button',name='See answers',exact=True).click();p.wait_for_function("document.querySelector('.live-answer-header [role=status]')?.textContent.includes('unavailable')",timeout=20000)
 b.close()
server.shutdown();print('PASS: encrypted updates across independent contexts, edits, canvas capture, nested portrait app, read-only sandbox, close and visible offline status. Remote Firebase access was not tested.')
