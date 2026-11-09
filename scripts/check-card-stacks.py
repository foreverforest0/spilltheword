"""Actual card routes: navigation history, six effects, flip, special tasks, sharing and mobile."""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright
import json
ROOT=Path(__file__).resolve().parents[1];OUT=Path('/workspace/shared/downloads/card-stacks');OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');errors=[];missing=[]
 p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:missing.append(r.url) if r.status>=400 and r.url.startswith(base) else None);p.goto(base);p.wait_for_function('window.CardStacks')
 def ready():p.wait_for_function("document.querySelector('.cs-deck')&&!document.querySelector('.cs-deck')._cardDeck.busy")
 def open_task(id,lv='a1'):
  p.evaluate("([id,lv])=>openSharedGrammar(id,lv)",[id,lv]);p.wait_for_selector('.cs-deck');ready()
 def card():return p.locator('.cs-card:not([hidden])')
 def move(direction):p.locator('.cs-'+direction).click();ready()
 def flip():card().click(position={'x':14,'y':18});ready()
 def front_text():return card().locator('.cs-front').inner_text()
 routes=p.evaluate("()=>{const out=[];for(const [lv,gs]of Object.entries(SPGRP))for(const g of gs)for(const id of g[1])if(!DMT[id]&&id!=='gwt'&&!out.some(x=>x.id===id))out.push({id,lv});return out}")
 for t in routes:
  open_task(t['id'],t['lv']);assert p.locator('.cs-card:visible').count()==1,t;assert p.locator('.cs-back').is_disabled();original=front_text();flip();assert card().get_attribute('aria-pressed')=='true';assert card().locator('.cs-reverse .cs-content').inner_text() or card().locator('.cs-reverse img').count(),t
  if p.locator('.cs-card').count()>1:
   move('next');assert p.locator('.cs-deck').get_attribute('data-index')=='1';move('back');assert front_text()==original;assert card().get_attribute('aria-pressed')=='true'
 print('generic routes',len(routes),'PASS',flush=True)
 open_task('intv');assert card().locator('.cs-front .stw-prompt-copy').count()==0;flip();assert card().locator('.interview-answers li').count()==5;p.locator('#cbsharedhint').click();hint=p.locator('#cbsharedh').inner_text();move('next');move('back');assert p.locator('#cbsharedh').is_visible() and p.locator('#cbsharedh').inner_text()==hint
 open_task('who');assert p.locator('#cbsharedhint').count()==0;flip();assert card().locator('.ownership-prompt').count()==2
 open_task('how');seen=set()
 for i in range(6):
  item=card();seen.add(item.get_attribute('data-process'));assert item.locator('.process-front img').count()==1;flip();assert item.locator('.process-verbs [role=listitem]').count()>=5
  if i<5:move('next')
 assert len(seen)==6;assert p.locator('.cs-next').is_disabled()
 # Six real animation pairs, without ticks/crosses or scoring semantics.
 open_task('gmj');p.emulate_media(reduced_motion='no-preference');effects=set()
 for i in range(6):
  outgoing=card();p.locator('.cs-next').click();effects.add(p.locator('.cs-deck').get_attribute('data-effect'));assert outgoing.evaluate('e=>getComputedStyle(e).animationName')!='none';assert p.locator('.cs-next').is_disabled();ready()
 assert effects=={'yuda','krisna','wangi','wira','slamet','eka'},effects
 p.locator('.cs-back').click();ready();assert p.locator('.cs-deck').get_attribute('data-index')=='5';assert p.locator('.cs-controls').inner_text().splitlines()[0]=='Back'
 p.screenshot(path=str(OUT/'profession-deck.png'),full_page=True);p.emulate_media(reduced_motion='reduce')
 # Reporter keeps the response/deduction task outside the flipping card.
 open_task('pcr');page=p.locator('.reporter-page');subject=page.get_attribute('data-subject');wrong=page.get_attribute('data-wrong');action=page.get_attribute('data-action');answer=f'{subject} is not {wrong}. {subject} is {action}.';p.locator('#reporterAnswer').fill(answer);p.locator('#reporterCheck').click();assert p.locator('#reporterFeedback').inner_text().startswith('Correct!');move('next');move('back');assert p.locator('#reporterAnswer').input_value()==answer and p.locator('#reporterFeedback').inner_text().startswith('Correct!')
 # Picture-pair comparison remains a pair; memory mode stays genuinely dark.
 open_task('therecompare','kids');assert card().locator('.cs-front .there-photo').count()==2;flip();assert card().locator('.there-example').inner_text()
 open_task('therememory');p.locator('#thereHide').click();assert card().locator('.cs-front .there-photo').evaluate("e=>getComputedStyle(e).filter.includes('0.07')");move('next');move('back');assert p.locator('#thereHide').get_attribute('aria-pressed')=='true'
 # Existing coin → one picture / five questions, with magnifier on the back.
 p.evaluate("openSharedGrammar('scp','a1')");p.locator('.scene-coin').click();p.wait_for_selector('.cs-deck');ready();assert p.locator('.cs-card').count()==5;source=card().locator('.cs-front img').get_attribute('src');flip();questions=set()
 for i in range(5):
  assert card().get_attribute('aria-pressed')=='true';questions.add(card().locator('.scene-question').inner_text());assert card().locator('.mgbase').get_attribute('src')==source
  if i<4:move('next')
 assert len(questions)==5;p.screenshot(path=str(OUT/'scene-deck.png'),full_page=True)
 # Proofreading words are interactive and do not trigger a card flip.
 open_task('fxt');row=p.evaluate("()=>{const s=document.querySelector('.fix-time-page').dataset.sentence;return FXT.find(x=>x[0]===s)}");wrong_words=row[0].split();right_words=row[1].split();index=next(i for i,w in enumerate(wrong_words) if w!=right_words[i]);card().locator(f'[data-fix-word="{index}"]').click();assert card().get_attribute('aria-pressed')=='false';p.locator('#fixReplacement').fill(right_words[index]);p.keyboard.press('Enter');assert p.locator('#fixFeedback').inner_text().startswith('Correct!');p.wait_for_function("document.querySelector('.cs-deck').dataset.index==='1'");ready();move('back');assert p.locator('#fixReplacement').input_value()==right_words[index]
 # Grammar transformations expose the model on the reverse; no correctness buttons.
 p.evaluate("go('gram');GL={mode:'ts',items:TS.pfi.slice(0,4).map(x=>({t:GT.find(t=>t.id==='pfi'),s:x[0],q:x[1],a:x[2]})),i:0,show:false,ok:0,bad:0};glRender()");ready();assert p.locator('#glok,#glbad').count()==0;flip();assert p.evaluate('GL.show');move('next');assert p.evaluate('GL.i')==1
 # Real GIF start button uses the new deck and GIF sources remain animated images.
 p.evaluate("S.gmode='grammar';S.gram.gif='Present Continuous';S.gcats=GIFCATS.map(c=>c.n);go('gif')");p.locator('#start').click();p.wait_for_selector('.cs-deck');ready();assert card().locator('.gifimg').get_attribute('src');flip();move('next');move('back');assert card().get_attribute('aria-pressed')=='true'
 # Alias / Taboo rerender the round on opening; Back retains the earlier hint.
 for game in ['alias','taboo']:
  p.evaluate("g=>{S.time=0;S.mine[g]='apple | fruit, red, tree\\nbook | read, pages, library\\ndog | bark, pet, animal\\nhouse | home, room, live\\nchair | sit, furniture, seat\\nphone | call, screen, mobile';S.only[g]=true;S.les[g]=[];go(g);startGame(g)}",game)
  p.locator('[data-a=go]').click();ready();flip();p.wait_for_timeout(290);card().locator('#rhint').click();hint=card().locator('.cbh').inner_text();move('next');flip();p.wait_for_timeout(290);move('back');assert card().get_attribute('aria-pressed')=='true';assert card().locator('.cbh').is_visible() and card().locator('.cbh').inner_text()==hint;flip();assert p.evaluate('R.used[0]');p.locator('[data-a=newdeck]').click();ready();assert card().get_attribute('aria-pressed')=='false'
 # Actual next/back and keyboard actions survive a shared link on another viewport.
 open_task('ppc','b1');flip();card().focus();p.keyboard.press('ArrowRight');ready();p.wait_for_function("document.querySelector('.cs-deck').dataset.index==='1'");flip();p.locator('.cs-back').click();ready();url=p.evaluate('SharedGame.getLink()')
 q=b.new_page(viewport={'width':390,'height':900},reduced_motion='no-preference');q.on('pageerror',lambda e:errors.append(str(e)));q.goto(url);q.wait_for_function('window.SharedGame&&!SharedGame.replaying');assert q.locator('.shared-game-loading').count()==0,q.locator('.shared-game-loading').inner_text();assert q.locator('.cs-deck').get_attribute('data-index')=='0';assert q.locator('.cs-card:not([hidden])').get_attribute('aria-pressed')=='true';q.close()
 for width in [768,390]:
  p.set_viewport_size({'width':width,'height':900})
  for id in ['ppc','intv','who','how','therecompare','pcr','fxt']:
   open_task(id,'b1' if id=='ppc' else 'a1');flip();assert p.evaluate('document.documentElement.scrollWidth<=innerWidth'),(id,width);active=card();face=active.locator('.cs-reverse');assert face.evaluate('e=>e.scrollHeight<=e.clientHeight+2'),(id,width)
  if width==390:p.screenshot(path=str(OUT/'mobile.png'),full_page=True)
 # Mid-animation navigation must dispose the old deck without touching Home.
 p.emulate_media(reduced_motion='no-preference');open_task('ppc','b1');p.locator('.cs-next').click();p.evaluate("go('home')");p.wait_for_timeout(750);assert p.locator('.cs-deck').count()==0;assert p.evaluate('CardStacks.instances.size')==0
 assert not errors,errors;assert not missing,missing;b.close()
server.shutdown();print('PASS',json.dumps({'card_routes':len(routes),'effects':len(effects)}),'— flip/back history, hints, GIFs, pair comparison, dark memory, reporter drafts, proofreading, five coin questions, sharing, mobile and cleanup.')
