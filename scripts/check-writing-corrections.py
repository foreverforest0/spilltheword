"""Error categories, correction offsets, repeated checks, shared sessions and room motion."""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
from pathlib import Path
from urllib.parse import parse_qs
from playwright.sync_api import sync_playwright
import json,re
ROOT=Path(__file__).resolve().parents[1];OUT=Path('/workspace/shared/downloads/writing-room');OUT.mkdir(exist_ok=True,parents=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context(viewport={'width':1440,'height':1100},reduced_motion='reduce');p=ctx.new_page();errors=[];calls=[];p.on('pageerror',lambda e:errors.append(str(e)))
 def api(route):
  text=parse_qs(route.request.post_data or '').get('text',[''])[0];calls.append(text);matches=[]
  for word,replacement,kind,category in [('was','were','uncategorized','GRAMMAR'),('teh','the','misspelling','TYPOS'),('becaus','because','typographical','TYPOS')]:
   if re.search(r'\b'+re.escape(word)+r'\b',text) and (word!='was' or text.startswith('The people ')):
    matches.append({'message':'Replace '+word+' with '+replacement+'.','offset':text.index(word),'length':len(word),'replacements':[{'value':replacement}],'rule':{'id':'REGRESSION_'+word,'issueType':kind,'category':{'id':category}}})
  route.fulfill(content_type='application/json',body=json.dumps({'matches':matches}),headers={'Access-Control-Allow-Origin':'*'})
 ctx.route('https://api.languagetool.org/v2/check',api);p.goto(base);p.evaluate("go('bard')");f=p.frame_locator('#writing-room-frame');f.locator('#wr-enter').wait_for();p.wait_for_function("document.getElementById('writing-room-frame').contentWindow.BardGrammar")
 def run(js,arg=None):return p.locator('#writing-room-frame').content_frame.locator('body').evaluate('(e,arg)=>('+js+')(arg)',arg)
 def ready():p.wait_for_function("!document.getElementById('writing-room-frame').contentWindow.WritingRoom.busy")
 # No false alarms for the level examples or a valid mandative subjunctive.
 good=['He felt nervous, but he took a deep breath and finally opened the door.','He hesitated when he heard a strange noise inside. Although he felt anxious, he gathered the courage to open the door.','He concealed his apprehension and opened the door, determined to maintain his composure in front of his friend.','I insist he go now.','It is essential that she have a chance.','If he were here, he would help.','I wish she were here.']
 for text in good:assert run('text=>BardGrammar.localIssues(text)',text)==[],text
 for text in ['He go to the room.','She are nervous.','They is tired.','I is tired.','He don’t know.','She did not went home.','He has went away.','I has an idea.','They does not know.','She were afraid.']:
  issue=run('text=>BardGrammar.localIssues(text)',text);assert issue and all(i['replacements'] for i in issue),text
 # Globe rotation, portrait blinks and finger tapping are independent SVG animations.
 assert f.locator('.wr-globe-spin').count()==1;assert f.locator('.wr-blink').count()==3;assert f.locator('.wr-finger').count()==3
 assert run('()=>document.querySelector(".wr-room-overlays").animationsPaused()')
 run('()=>document.querySelector(".wr-room-overlays").setCurrentTime(0)');a=run('()=>document.querySelector(".wr-globe-spin").getCTM().a');run('()=>document.querySelector(".wr-room-overlays").setCurrentTime(9)');z=run('()=>document.querySelector(".wr-globe-spin").getCTM().a');assert abs(a-z)>.1
 for name,t in [('wr-writer-eyes',2.98),('wr-poet-eyes',3.65),('wr-woman-eyes',4.82)]:
  run('t=>document.querySelector(".wr-room-overlays").setCurrentTime(t)',t);assert run('name=>+getComputedStyle(document.querySelector(`[data-blink="${name}"]`)).opacity',name)>.9
 run('()=>document.querySelector(".wr-room-overlays").setCurrentTime(0)');y=run('()=>document.querySelector("[data-finger=wr-middle]>g").getCTM().f');run('()=>document.querySelector(".wr-room-overlays").setCurrentTime(1.6)');assert abs(run('()=>document.querySelector("[data-finger=wr-middle]>g").getCTM().f')-y)>.1;run('()=>document.querySelector(".wr-room-overlays").setCurrentTime(0)');p.screenshot(path=str(OUT/'animated-room.png'),full_page=True)
 f.locator('#wr-enter').click();f.locator('#wr-take-quill').click();assert run('()=>document.querySelector(".wr-room-overlays").animationsPaused()')
 # Detail changes keep the source sentence and draft, and survive level navigation.
 f.locator('#wr-answer').fill('Keep this draft.');old=f.locator('#wr-detail').inner_text();source=f.locator('#wr-source').inner_text();f.locator('#wr-detail-next').click();detail=f.locator('#wr-detail').inner_text();assert detail!=old and f.locator('#wr-answer').input_value()=='Keep this draft.' and f.locator('#wr-source').inner_text()==source;f.locator('[data-level=b2]').click();f.locator('[data-level=b1]').click();assert f.locator('#wr-detail').inner_text()==detail
 # Three different server categories are all marked; none can silently earn a signature.
 text='The people was at teh door becaus they were nervous.';f.locator('#wr-answer').fill(text);f.locator('#wr-check').click();ready();f.locator('#wr-error-popup').wait_for();assert f.locator('.wr-error').all_text_contents()==['was','teh','becaus'];assert set(f.locator('.wr-error').evaluate_all('xs=>xs.map(x=>x.dataset.annotation)'))=={'circle','strike-through','crossed-off'};assert f.locator('#wr-count').inner_text()=='0';assert f.locator('.rough-annotation path').count()>=3
 f.locator('#wr-error-close').click();p.screenshot(path=str(OUT/'marked-errors.png'),full_page=True)
 # Longer replacements update later offsets; all edits still need a fresh check.
 for wrong,right in [('was','were'),('teh','the'),('becaus','because')]:
  f.locator('.wr-error').filter(has_text=wrong).click();f.locator('#wr-replacements button').filter(has_text=right).click()
 corrected='The people were at the door because they were nervous.';assert f.locator('#wr-answer').input_value()==corrected;assert f.locator('#wr-review').is_hidden();assert f.locator('#wr-count').inner_text()=='0';assert f.locator('.rough-annotation').count()==0
 f.locator('#wr-check').click();ready();assert f.locator('#wr-count').inner_text()=='1'
 # Manual correction is possible; no suggestion is forced on the writer.
 f.locator('#wr-answer').fill('He go inside.');f.locator('#wr-check').click();ready();f.locator('#wr-error-popup').wait_for();f.locator('#wr-replacement').fill('walked');f.locator('#wr-apply').click();assert f.locator('#wr-answer').input_value()=='He walked inside.';assert f.locator('#wr-count').inner_text()=='1'
 # A shared link restores correction actions and outcomes without a new network check.
 url=p.evaluate('SharedGame.getLink()');before=len(calls);q=ctx.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto(url);q.wait_for_function('window.SharedGame&&!SharedGame.replaying');assert q.locator('.shared-game-loading').count()==0;qf=q.frame_locator('#writing-room-frame');assert qf.locator('#wr-answer').input_value()=='He walked inside.';assert qf.locator('#wr-count').inner_text()=='1';assert len(calls)==before;q.close()
 # On a phone, markings and the correction popup stay inside the parchment.
 p.set_viewport_size({'width':390,'height':844});f.locator('#wr-answer').fill('She are nervous.');f.locator('#wr-check').click();ready();f.locator('#wr-error-popup').wait_for();popup=f.locator('#wr-error-popup').bounding_box();paper=f.locator('#wr-manuscript').bounding_box();assert popup['x']>=paper['x'] and popup['x']+popup['width']<=paper['x']+paper['width']+1;assert f.locator('body').evaluate('e=>e.scrollWidth<=innerWidth');p.screenshot(path=str(OUT/'mobile-correction.png'),full_page=True)
 assert not errors,errors;b.close()
server.shutdown();print('PASS: local form guards, broad service categories, all three Rough Notation marks, offset-preserving corrections, manual edits, mandatory recheck, shared correction replay, detail choices, globe/blinks/fingers and mobile popup. Remote grammar API responses were mocked.')
