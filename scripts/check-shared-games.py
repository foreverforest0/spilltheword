"""Open share links in independent browser contexts; compare playable task state."""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 ctx=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce');p=ctx.new_page();errors=[]
 p.on('pageerror',lambda e:errors.append(str(e)));p.goto(base);p.wait_for_function('window.SharedGame')
 def opened():
  url=p.evaluate('SharedGame.getLink()');c=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce');q=c.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto(url);q.wait_for_function("window.SharedGame&&!SharedGame.replaying");assert q.locator('.shared-game-loading').count()==0,q.locator('.shared-game-loading').inner_text();return q,c
 def catalog(task,lv='b1'):
  p.evaluate("([id,lv])=>openSharedGrammar(id,lv)",[task,lv]);assert p.locator('.game-share-toolbar button').first.inner_text()=='Copy link'
 def cards(page):return page.locator('#view').evaluate("v=>[...v.querySelectorAll('.cs-card:not([hidden])')].map(c=>({text:c.textContent,img:[...c.querySelectorAll('img')].map(i=>i.getAttribute('src'))}))")
 # Same current deck, including a subsequent randomized New cards click.
 catalog('ppc');ctx.grant_permissions(['clipboard-read','clipboard-write'],origin=base.rstrip('/'));p.get_by_role('button',name='Copy link',exact=True).click();p.wait_for_function("document.querySelector('.game-share-toolbar output').textContent.includes('Copied')");assert '#play=' in p.evaluate('navigator.clipboard.readText()');print('clipboard PASS',flush=True)
 q,c=opened();assert p.locator('#view').evaluate("v=>{const c=v.cloneNode(true);c.querySelector('.game-share-toolbar')?.remove();return c.innerText||c.textContent}")==q.locator('#view').evaluate("v=>{const c=v.cloneNode(true);c.querySelector('.game-share-toolbar')?.remove();return c.innerText||c.textContent}");assert cards(p)==cards(q);assert q.locator('.grammar-exercise-back').count()==0;c.close()
 new=p.get_by_role('button',name='New cards',exact=False).first;new.click();q,c=opened();assert cards(p)==cards(q);assert p.locator('#view').evaluate("v=>{const c=v.cloneNode(true);c.querySelector('.game-share-toolbar')?.remove();return c.innerText||c.textContent}")==q.locator('#view').evaluate("v=>{const c=v.cloneNode(true);c.querySelector('.game-share-toolbar')?.remove();return c.innerText||c.textContent}");print('cards PASS',flush=True);c.close()
 # Pond selection, input and hint survive and can still be changed by the pupil.
 catalog('pond_b1_1');p.locator('.pond-fish').first.click(force=True);p.wait_for_selector('#pondAnswer');p.locator('#pondAnswer').fill('My draft answer.');p.locator('#pondHint').click();q,c=opened()
 assert p.locator('.pond-question-text').inner_text()==q.locator('.pond-question-text').inner_text();assert q.locator('#pondAnswer').input_value()=='My draft answer.';assert q.locator('#pondHintText').is_visible();assert q.locator('.pond-caught-preview').is_visible();q.locator('#pondAnswer').fill('A new answer.');q.locator('#pondCheck').click();assert q.locator('.pond-page').get_attribute('data-outcome')=='incorrect';print('pond PASS',flush=True);c.close()
 # A dragged magnet and a later randomized sentence remain playable on the copy.
 catalog('mgb','b1');p.wait_for_selector('.b1-bank .b1-magnet');mag=p.locator('.b1-bank .b1-magnet').first
 start=mag.bounding_box();door=p.locator('.b1-strip').bounding_box();p.mouse.move(start['x']+start['width']/2,start['y']+start['height']/2);p.mouse.down();p.mouse.move(door['x']+30,door['y']+30,steps=8);p.mouse.up()
 assert p.locator('.b1-strip .b1-magnet').count()==1
 q,c=opened();assert q.locator('.b1-strip .b1-magnet').count()==1;assert p.locator('.b1-strip').inner_text()==q.locator('.b1-strip').inner_text();q.locator('.b1-strip .b1-magnet').click();assert q.locator('.b1-strip .b1-magnet').count()==0;c.close()
 p.locator('#dmnew').click();q,c=opened();assert p.locator('.b1-bank').inner_text()==q.locator('.b1-bank').inner_text();c.close();print('fridge drag/new sentence PASS',flush=True)
 # Home books: a separate app in an iframe retains the generated portrait.
 catalog('app','kids');p.frame_locator('iframe').locator('#app').wait_for();p.frame_locator('iframe').locator('[data-mode=free]').click();p.frame_locator('iframe').locator('#name').fill('Jamie');p.frame_locator('iframe').locator('[data-key=hair][data-value="17"]').click();q,c=opened()
 a=p.frame_locator('iframe').locator('#app');b=q.frame_locator('iframe').locator('#app');b.wait_for();assert a.inner_text()==b.inner_text();assert a.locator('img').evaluate_all("a=>a.map(x=>x.getAttribute('src'))")==b.locator('img').evaluate_all("a=>a.map(x=>x.getAttribute('src'))");print('portrait PASS',flush=True);c.close()
 # Every catalog game can be validated, including DMT entries without SPT rows.
 assert p.evaluate("Object.values(SPGRP).flatMap(gs=>gs.flatMap(g=>g[1])).every(id=>typeof id==='string')")
 # Standalone home games and grammar modes all expose a usable direct link.
 for setup,needle in [("go('house')",'iframe'),("go('shop')",'#view'),("go('write')",'.tyst'),("go('gram');S.gmode='absurd';gmNew()",'#view'),("go('gram');S.gmode='craft';gmNew()",'#wcf')]:
  p.evaluate(setup);p.wait_for_selector(needle);
  if setup=="go('write')":
   p.locator('#tyta').focus();p.keyboard.type('Hello student');
  q,c=opened();q.wait_for_selector(needle);assert q.locator('.game-share-toolbar button').first.is_visible();assert p.locator('#view').evaluate("v=>{const c=v.cloneNode(true);c.querySelector('.game-share-toolbar')?.remove();return c.innerText||c.textContent}")==q.locator('#view').evaluate("v=>{const c=v.cloneNode(true);c.querySelector('.game-share-toolbar')?.remove();return c.innerText||c.textContent}"),(setup,p.locator('#view').evaluate("v=>{const c=v.cloneNode(true);c.querySelector('.game-share-toolbar')?.remove();return c.innerText||c.textContent}"),q.locator('#view').evaluate("v=>{const c=v.cloneNode(true);c.querySelector('.game-share-toolbar')?.remove();return c.innerText||c.textContent}"));c.close();print(setup,'PASS',flush=True)
 assert not errors,errors
 browser.close()
server.shutdown();print('PASS: matching decks, new cards, pond draft/hint, playable links, embedded portraits and all home books.')
