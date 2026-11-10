"""Story files: evidence, independent drafts, sharing, keyboard and mobile.
Run with Python Playwright and Chromium: python scripts/check-present-perfect-files.py
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path('/workspace/shared/downloads/present-perfect-files')
OUT.mkdir(parents=True, exist_ok=True)

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Quiet, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}/'

with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    ctx = browser.new_context(viewport={'width':1440, 'height':1100}, reduced_motion='reduce')
    p = ctx.new_page(); errors=[]; missing=[]
    p.on('pageerror', lambda e: errors.append(str(e)))
    p.on('response', lambda r: missing.append(r.url) if r.status >= 400 and r.url.startswith(base) else None)
    p.goto(base); p.wait_for_function('window.PresentPerfectFiles && window.SharedGame')
    # The real B1 catalog exposes the activity once, within Present Perfect.
    p.evaluate("()=>{go('gram');S.glevel='b1';glSetup()}")
    p.locator('[data-grammar-topic="b1:1"]').click()
    assert p.locator('[data-grammar-exercise=ppfiles]').count() == 1
    p.locator('[data-grammar-exercise=ppfiles]').click()
    assert p.locator('[data-cf-file]').count() == 3
    assert p.locator('#cf-topics').is_visible() and p.locator('#cf-how').is_visible()
    assert not p.locator('.cf-page .stw-wave-letter').count()
    assert 'Arial' in p.locator('.cf-cover-title').first.evaluate('e=>getComputedStyle(e).fontFamily')
    p.locator('#cf-how').click(); assert p.locator('#cf-help').is_visible()
    assert 'no automatic checking' in p.locator('#cf-help').inner_text()
    p.locator('#cf-how').click(); assert p.locator('#cf-help').is_hidden()
    stories = p.evaluate('PresentPerfectFiles.stories')
    assert len(stories) == 3 and all(5 <= len(s['details']) <= 8 for s in stories)
    for s in stories:
        assert len(set(d['id'] for d in s['details'])) == len(s['details'])
        assert all(d['word'] and (d.get('rows') or d.get('notes') or d.get('message')) for d in s['details'])
        assert any(d['kind'] == 'ticket' for d in s['details'])
        assert any(d['kind'] == 'receipt' for d in s['details'])
        assert any(d['kind'] == 'photo' for d in s['details'])
    p.screenshot(path=str(OUT/'folders-desktop.png'), full_page=True)
    for s in stories:
        p.locator('#cf-open-'+s['id']).click()
        draft='My deliberately unfinished draft for '+s['id']+': I has went somewhere.'
        p.locator('#cf-draft').fill(draft)
        assert p.locator('#cf-draft').get_attribute('spellcheck') == 'false'
        assert p.get_by_role('button', name='Check', exact=True).count() == 0
        for i,d in enumerate(s['details']):
            p.locator('#cf-detail-'+str(i)).click()
            assert d['heading'] in p.locator('#cf-document').inner_text()
            assert p.locator('#cf-detail-'+str(i)).get_attribute('aria-pressed') == 'true'
            assert p.locator('#cf-word').is_hidden()
            p.locator('#cf-document').click()
            assert p.locator('#cf-word strong').inner_text() == d['word']
            assert p.locator('#cf-word').is_visible()
            p.locator('#cf-document').click(); assert p.locator('#cf-word').is_hidden()
            assert p.locator('#cf-draft').input_value() == draft
        assert p.locator('#cf-next').is_disabled()
        p.locator('#cf-document').focus(); p.keyboard.press('ArrowLeft')
        assert p.locator('#cf-detail-5').get_attribute('aria-pressed') == 'true'
        assert p.evaluate('document.activeElement.id') == 'cf-document'
        p.keyboard.press('ArrowLeft'); assert p.locator('#cf-detail-4').get_attribute('aria-pressed') == 'true'
        p.locator('#cf-document').press('Enter'); assert p.locator('#cf-word').is_visible()
        p.locator('#cf-close').click(); assert p.locator('#cf-open-'+s['id']).evaluate('e=>e===document.activeElement')
        p.locator('#cf-open-'+s['id']).click()
        assert p.locator('#cf-draft').input_value() == draft
        assert p.locator('#cf-detail-4').get_attribute('aria-pressed') == 'true'
        assert p.locator('#cf-word').is_visible()
        p.locator('#cf-close').click()
    # Refresh retains each file separately, rather than merging their texts.
    p.reload();p.wait_for_function('window.PresentPerfectFiles');p.evaluate("openSharedGrammar('ppfiles','b1')")
    for s in stories:
        p.locator('#cf-open-'+s['id']).click()
        assert s['id'] in p.locator('#cf-draft').input_value()
        p.locator('#cf-close').click()
    # Start a short, genuine event recipe. A clean browser restores document,
    # revealed word and draft, and the pupil can continue writing independently.
    p.evaluate("spOpen('ppfiles')")
    p.locator('#cf-open-unclaimed-roll').click();p.locator('#cf-detail-6').click();p.locator('#cf-document').click()
    p.locator('#cf-draft').fill('I have found the owners. I bought the camera in Porto.')
    url=p.evaluate('SharedGame.getLink()')
    pupil=browser.new_context(viewport={'width':1440,'height':1100},reduced_motion='reduce')
    q=pupil.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto(url)
    q.wait_for_function('window.SharedGame && !SharedGame.replaying');assert q.locator('.shared-game-loading').count()==0
    assert q.locator('.cf-open-file').get_attribute('data-file') == 'unclaimed-roll'
    assert q.locator('#cf-detail-6').get_attribute('aria-pressed') == 'true'
    assert q.locator('#cf-word strong').inner_text() == 'yet'
    assert q.locator('#cf-word').is_visible()
    assert q.locator('#cf-draft').input_value() == p.locator('#cf-draft').input_value()
    q.locator('#cf-draft').fill('My own next sentence.');q.locator('#cf-prev').click()
    assert q.locator('#cf-draft').input_value() == 'My own next sentence.'
    snapshot=q.evaluate('SharedLive.snapshot()')
    assert 'My own next sentence.' in snapshot['html'] and 'present-perfect-files.css' in snapshot['html']
    pupil.close()
    # Screenshot sizes, both receipt and photograph; no side-to-side overflow.
    p.locator('#cf-detail-0').click();p.screenshot(path=str(OUT/'file-ticket.png'),full_page=True)
    p.locator('#cf-detail-4').click()
    p.locator('#cf-draft').fill('I bought a camera at a flea market in Porto.\nThe lab has already recovered twenty-two photographs.\nI have never met the people in them.\nTheir family has just replied to my post.\nI haven’t sent the prints yet.')
    p.screenshot(path=str(OUT/'file-photograph.png'),full_page=True)
    p.locator('#cf-close').click();p.locator('#cf-open-dinosaur-night').click();p.locator('#cf-detail-2').click()
    p.locator('#cf-draft').fill('I have never spent a night like this before.\nOn Friday, I slept under a dinosaur.\nI have stayed in touch with Jo and Alex since our breakfast.')
    p.screenshot(path=str(OUT/'museum-file.png'),full_page=True)
    p.locator('#cf-close').click();p.locator('#cf-open-cassette').click();p.locator('#cf-detail-1').click()
    p.screenshot(path=str(OUT/'repair-file.png'),full_page=True)
    for width in [768,390]:
        p.set_viewport_size({'width':width,'height':950})
        assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
        p.locator('#cf-detail-0').click();assert p.locator('#cf-document').bounding_box()['width'] > 250
        p.locator('#cf-next').click();assert p.locator('#cf-detail-1').get_attribute('aria-pressed') == 'true'
        p.locator('#cf-draft').fill('A mobile draft.');p.locator('#cf-detail-2').click()
        assert p.locator('#cf-draft').input_value() == 'A mobile draft.'
        if width==390:
            p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'file-mobile.png'),full_page=True)
    p.locator('#cf-close').click();assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
    p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'folders-mobile.png'),full_page=True)
    # Real animation still leaves controls usable; no animation code can overwrite text.
    p.emulate_media(reduced_motion='no-preference');p.locator('#cf-open-cassette').click()
    p.locator('#cf-detail-3').click();assert p.locator('.cf-shuffled').count()==1
    assert p.locator('.cf-shuffled').evaluate("e=>getComputedStyle(e).animationName")=='cf-paper-in'
    p.locator('#cf-document').click();p.locator('#cf-close').click();p.locator('#cf-topics').click()
    assert p.locator('[data-grammar-exercise=ppfiles]').count()==1
    assert not errors,errors
    assert not missing,missing
    browser.close()
server.shutdown()
print('PASS: catalog; 3 files / 21 details; word hints; independent persisted drafts; two-way navigation; keyboard; no checker; shared replay and live snapshot; desktop/tablet/mobile; motion and return to topics.')
