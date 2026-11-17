"""Quiet supplied click, vocabulary routes, wider books and topic-scoped balls."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1050},reduced_motion='reduce');errors=[];missing=[]
 p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.url.startswith(f'http://127.0.0.1:{server.server_port}/') and r.status>=400 and 'favicon' not in r.url else None)
 p.goto(f'http://127.0.0.1:{server.server_port}/');assert p.evaluate('Object.keys(TopicBall.topics).length')==72
 assert p.evaluate("Object.values(TopicBall.topics).every(t=>TopicBall.check(t.id,t.profile.example).ok)")
 assert p.evaluate("Object.entries(SPGRP).every(([lv,gs])=>gs.filter(g=>/^\\d+/.test(g[0])).every(g=>g[1].filter(id=>id.startsWith('topic_ball_')).length===1))")
 assert p.evaluate("Object.values(SPGRP).every(gs=>gs.every(g=>!g[1].includes('m8')))")
 # Irregular tag contractions and genuinely different conditional meanings.
 assert p.evaluate("""Object.values(TopicBall.topics).filter(t=>t.name==='Question tags').every(t=>TopicBall.check(t.id,"I will win, won't I?").ok&&TopicBall.check(t.id,"She can swim, can't she?").ok)""")
 assert p.evaluate("Object.values(TopicBall.topics).filter(t=>t.name==='Third conditional').every(t=>!TopicBall.check(t.id,'Would I be happier now if I had studied harder?').ok)")
 assert p.evaluate("Object.values(TopicBall.topics).filter(t=>t.name==='Mixed conditionals').every(t=>!TopicBall.check(t.id,'Would I have won if I had tried harder?').ok)")
 assert not p.evaluate("TopicBall.check('topic_ball_future_continuous','Will it be morning?').ok")
 # Main click plays the supplied recording, softly, without the old oscillator.
 p.wait_for_function('SiteInteractions.clickAudio.readyState>=3')
 p.evaluate('S.snd=true');p.locator('[data-category="vocab"]').click()
 p.wait_for_function('SiteInteractions.clickAudio.currentTime>.02&&!SiteInteractions.clickAudio.paused')
 assert p.evaluate('SiteInteractions.clickAudio.volume<=.3&&AC===null')
 assert .60<p.evaluate('SiteInteractions.clickAudio.duration')<.70
 p.locator('#sndbtn').click();assert p.evaluate('S.snd===false&&SiteInteractions.clickAudio.paused')
 p.evaluate("sfx('click');sfx('boot');sfx('pop')");assert p.evaluate('SiteInteractions.clickAudio.paused&&AC===null')
 # Vocabulary contains existing games, not the old word list or Shop/GIF links.
 assert p.locator('[data-vocabulary-game]').count()==4
 assert p.locator('.wchip,.wl,[data-vocabulary-game="shop"],[data-vocabulary-game="gif"]').count()==0
 for game in ['alias','taboo','jeo','craft']:
  p.evaluate("go('words')");p.locator(f'[data-vocabulary-game="{game}"]').click()
  assert p.evaluate('tab')==('gram' if game=='craft' else game)
  if game=='craft':assert p.locator('.ww-page').is_visible()
 # Exact focus: a question in another tense cannot trigger the ball.
 simple=p.evaluate("Object.values(TopicBall.topics).find(t=>t.level==='a1'&&t.name==='Present Simple').id")
 p.evaluate("id=>{go('gram');S.snd=false;spOpen(id)}",simple)
 p.locator('#tbQuestion').fill('Have I seen this film?');p.locator('#tbAsk').click();assert p.locator('#tbStatus').inner_text().startswith('Use Present Simple')
 assert not p.locator('#tbBall').evaluate("e=>e.classList.contains('tb-answered')")
 p.locator('#tbQuestion').fill('Does my cat like me?');p.locator('#tbAsk').click();p.wait_for_function("document.querySelector('#tbBall').classList.contains('tb-answered')")
 assert p.locator('#tbAnswer').inner_text();assert p.locator('#tbHintText').is_hidden()
 p.locator('#tbHint').click();assert 'Does my cat like me?' in p.locator('#tbHintText').inner_text()
 p.locator('#tbQuestion').fill('Does my friend like pizza?');p.reload();p.evaluate("id=>{go('gram');spOpen(id)}",simple);assert p.locator('#tbQuestion').input_value()=='Does my friend like pizza?'
 # Each Kids topic is oral, teacher checked and has no text/microphone input.
 kids=p.evaluate("Object.values(TopicBall.topics).filter(t=>t.level==='kids').map(t=>t.id)")
 assert len(kids)==9
 for id in kids:
  p.evaluate('id=>spOpen(id)',id);assert p.locator('#tbQuestion,#tbAsk').count()==0
  assert 'Your teacher checks' in p.locator('.tb-task').inner_text()
  p.locator('#tbBall').click();p.wait_for_function("document.querySelector('#tbBall').classList.contains('tb-answered')")
  assert p.locator('#tbAnswer').inner_text() in ['Yes!','No!','Maybe!','Ask again!']
 # All non-Kids profiles have a valid on-topic example, visible Hint and ball.
 typed=p.evaluate("Object.values(TopicBall.topics).filter(t=>t.level!=='kids').map(t=>({id:t.id,q:t.profile.example}))")
 for row in typed:
  p.evaluate('id=>spOpen(id)',row['id']);p.locator('#tbQuestion').fill(row['q']);p.locator('#tbAsk').click();p.wait_for_function("document.querySelector('#tbBall').classList.contains('tb-answered')")
 # Entry and Back preserve the actual catalog topic.
 p.evaluate("S.glevel='a1';S.gmode='ts';go('gram')")
 p.locator('[data-grammar-topic]').filter(has_text='Present Simple').click();p.locator(f'[data-grammar-exercise="{simple}"]').click();p.locator('#tbBack').click();assert p.locator('.grammar-topic-heading').inner_text()=='Present Simple'
 # Separate future forms link to separate balls and back to the current activity.
 p.evaluate("S.glevel='a1';spOpen('future_going')");p.locator('.tb-open').click();assert p.locator('body').get_attribute('data-study-level')=='a1'
 p.locator('#tbQuestion').fill('Will I travel tomorrow?');p.locator('#tbAsk').click();assert 'going to' in p.locator('#tbStatus').inner_text()
 p.locator('#tbBack').click();assert p.locator('.future-exercise').is_visible()
 assert not p.evaluate("TopicBall.check('topic_ball_future_perfect','Will I be travelling at ten?').ok")
 assert p.evaluate("TopicBall.check('topic_ball_future_perfect','Will I have spoken to him by noon?').ok")
 assert p.evaluate("TopicBall.check('topic_ball_future_perfectcontinuous','Will I have been studying for two hours by noon?').ok")
 # Larger home links, wider 3D faces, no overflow at desktop/tablet/mobile widths.
 for width in [1440,1280,1024,768,390,320]:
  p.set_viewport_size({'width':width,'height':1050});p.evaluate("go('home')")
  assert p.locator('[data-book-game="gif"]').count()==1 and p.locator('[data-book-game="shop"]').count()==1
  assert p.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
  assert p.locator('[data-category="grammar"]').evaluate('e=>parseFloat(getComputedStyle(e).fontSize)')>=(60 if width==1440 else 30)
  assert p.locator('.book').first.evaluate('e=>parseFloat(getComputedStyle(e).getPropertyValue("--depth"))')==44
  assert p.locator('.book').first.evaluate('e=>parseFloat(getComputedStyle(e).getPropertyValue("--width"))')==122
  p.screenshot(path=f'/tmp/new-home-{width}.png',full_page=True)
  p.evaluate("go('words')");assert p.evaluate('document.documentElement.scrollWidth<=innerWidth'),('vocab',width)
  if width in [1440,390]:p.screenshot(path=f'/tmp/vocabulary-games-{width}.png',full_page=True)
  p.evaluate('id=>{go("gram");spOpen(id)}',simple);assert p.evaluate('document.documentElement.scrollWidth<=innerWidth'),('ball',width)
  if width in [1440,390]:p.screenshot(path=f'/tmp/topic-ball-{width}.png',full_page=True)
 # Leave during normal animation: stale callbacks must not replace the new page.
 p.emulate_media(reduced_motion='no-preference');p.locator('#tbQuestion').fill('Does my friend like pizza?');p.locator('#tbAsk').click();assert p.locator('#tbBall').is_disabled();p.evaluate("go('home')");p.wait_for_timeout(1500);assert p.locator('.stw-home').is_visible()
 assert not errors,errors;assert not missing,missing
 print('PASS: supplied soft click/mute, four existing vocabulary games, 72 topic balls with valid examples, Kids oral mode, tense restrictions, saved drafts, topic Back, wider books and six viewport widths; no JS errors or missing assets')
 b.close()
server.shutdown()
