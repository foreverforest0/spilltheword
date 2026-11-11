"""Story files: collaged keepsakes, separate writer, drafts, sharing and phones."""
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
server = ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/'

with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    ctx=browser.new_context(viewport={'width':1440,'height':1100},reduced_motion='reduce')
    p=ctx.new_page();errors=[];missing=[]
    p.on('pageerror',lambda e:errors.append(str(e)))
    p.on('response',lambda r:missing.append(r.url) if r.status>=400 and r.url.startswith(base) else None)
    p.goto(base);p.wait_for_function('window.PresentPerfectFiles && window.SharedGame')
    p.evaluate("()=>{go('gram');S.glevel='b1';glSetup()}")
    p.locator('[data-grammar-topic="b1:1"]').click()
    assert p.locator('[data-grammar-exercise=ppfiles]').count()==1
    assert p.locator('[data-grammar-exercise=ppvideo]').count()==1
    p.locator('[data-grammar-exercise=ppfiles]').click()
    assert p.locator('[data-cf-file]').count()==3
    assert not p.locator('.cf-page .stw-wave-letter').count()
    p.locator('#cf-how').click();assert 'no automatic checking' in p.locator('#cf-help').inner_text()
    p.locator('#cf-how').click();assert p.locator('#cf-help').is_hidden()
    stories=p.evaluate('PresentPerfectFiles.stories')
    assert len(stories)==3 and all(len(s['details'])==8 for s in stories)
    for s in stories:
        assert len(set(d['id'] for d in s['details']))==8
        assert sum(d['kind']=='photo' for d in s['details'])==2
        assert sum(d['kind']=='ticket' for d in s['details'])==3
        assert sum(d['kind']=='receipt' for d in s['details'])==2
    p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'folders-desktop.png'),full_page=True)
    def pick_piece(i):
        item=p.locator('#cf-piece-'+str(i));item.scroll_into_view_if_needed()
        point=item.evaluate('''e=>{const r=e.getBoundingClientRect();for(let y=.1;y<.95;y+=.1)for(let x=.1;x<.95;x+=.1){const px=r.left+r.width*x,py=r.top+r.height*y;if(document.elementFromPoint(px,py)?.closest('[data-cf-piece]')===e)return {x:px,y:py}}return null}''')
        assert point, f'No exposed, clickable area on keepsake {i}'
        p.mouse.move(point['x'],point['y']);item.click()
    for s in stories:
        p.locator('#cf-open-'+s['id']).click()
        assert p.locator('.cf-piece').count()==8
        assert p.locator('.cf-photo-caption').count()==2
        assert p.locator('#cf-inspector').is_hidden()
        assert p.locator('.cf-memory-folder #cf-draft').count()==0
        folder=p.locator('.cf-memory-folder').bounding_box();writer=p.locator('#cf-draft').bounding_box()
        assert writer['x']>folder['x']+folder['width'] and writer['width']>400 and writer['height']>=600
        # Papers have native ink only. No worksheet paragraphs or prompt overlays.
        for i,d in enumerate(s['details']):
            assert p.locator('#cf-piece-'+str(i)).inner_text()==d.get('caption','')
        draft='My unfinished draft for '+s['id']+': I has went somewhere.'
        p.locator('#cf-draft').fill(draft)
        assert p.locator('#cf-draft').get_attribute('spellcheck')=='false'
        assert p.get_by_role('button',name='Check',exact=True).count()==0
        # Each tangible item can be picked up from the collage, not just the index.
        for i,d in enumerate(s['details']):
            pick_piece(i)
            assert p.locator('#cf-inspector').is_visible()
            assert p.locator('#cf-detail-'+str(i)).get_attribute('aria-pressed')=='true'
            assert p.locator('#cf-word').is_hidden()
            assert p.locator('#cf-document').inner_text()==d.get('caption','')
            if d['kind']!='photo':
                art=p.locator('#cf-document svg');box=art.bounding_box()
                assert box['width']>150 and box['height']>150
                assert art.get_attribute('aria-label')==d.get('transcript',d['label']) or not d.get('transcript')
            p.locator('#cf-hint').click();assert p.locator('#cf-word strong').inner_text()==d['word']
            assert p.locator('#cf-word').is_visible()
            p.locator('#cf-document').click();assert p.locator('#cf-word').is_hidden()
            assert p.locator('#cf-draft').input_value()==draft
            p.locator('#cf-put-back').click()
            assert p.locator('#cf-piece-'+str(i)).evaluate('e=>e===document.activeElement')
        # Arrow keys move the picked-up item; Escape returns it, without touching text.
        p.locator('#cf-detail-7').click();assert p.locator('#cf-next').is_disabled()
        p.keyboard.press('ArrowLeft');assert p.locator('#cf-detail-6').get_attribute('aria-pressed')=='true'
        assert p.evaluate('document.activeElement.id')=='cf-document'
        p.keyboard.press('Escape');assert p.locator('#cf-inspector').is_hidden()
        p.locator('#cf-detail-4').click();p.locator('#cf-hint').click()
        p.locator('#cf-close').click();assert p.locator('#cf-open-'+s['id']).evaluate('e=>e===document.activeElement')
        p.locator('#cf-open-'+s['id']).click()
        assert p.locator('#cf-draft').input_value()==draft and p.locator('#cf-word').is_visible()
        p.locator('#cf-put-back').click();p.locator('#cf-close').click()
    p.reload();p.wait_for_function('window.PresentPerfectFiles');p.evaluate("openSharedGrammar('ppfiles','b1')")
    for s in stories:
        p.locator('#cf-open-'+s['id']).click();assert s['id'] in p.locator('#cf-draft').input_value()
        assert p.locator('#cf-inspector').is_hidden();p.locator('#cf-close').click()
    # Native replay must restore a folder, picked-up receipt, hint and the writing.
    p.evaluate("spOpen('ppfiles')")
    p.locator('#cf-open-unclaimed-roll').click();p.locator('#cf-detail-1').click();p.locator('#cf-hint').click()
    p.locator('#cf-draft').fill('I have found an old camera. I bought it in Porto.')
    url=p.evaluate('SharedGame.getLink()')
    pupil=browser.new_context(viewport={'width':1440,'height':1100},reduced_motion='reduce')
    q=pupil.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto(url)
    q.wait_for_function('window.SharedGame && !SharedGame.replaying')
    assert q.locator('.cf-open-file').get_attribute('data-file')=='unclaimed-roll'
    assert q.locator('#cf-detail-1').get_attribute('aria-pressed')=='true'
    assert q.locator('#cf-word').is_visible() and q.locator('#cf-word strong').inner_text()=='ever'
    assert q.locator('#cf-draft').input_value()==p.locator('#cf-draft').input_value()
    q.locator('#cf-draft').fill('My own next sentence.');q.locator('#cf-next').click()
    assert q.locator('#cf-draft').input_value()=='My own next sentence.'
    snapshot=q.evaluate('SharedLive.snapshot()')
    assert 'My own next sentence.' in snapshot['html'] and 'present-perfect-files.css' in snapshot['html']
    assert 'porto-papers.png' in snapshot['html'] and '<svg' in snapshot['html']
    # The existing read-only snapshot actually loads the SVG image resources.
    live=pupil.new_page();live.set_content(snapshot['html']);live.wait_for_load_state('networkidle')
    assert live.locator('#cf-draft').input_value()=='My own next sentence.'
    assert live.locator('#cf-document svg image').get_attribute('href').endswith('porto-papers.png')
    assert live.locator('#cf-document svg').bounding_box()['width']>300
    pupil.close()
    p.locator('#cf-put-back').click();p.locator('#cf-draft').fill('I bought a camera at a flea market in Porto.\nThe lab has already developed the film.\nI have never met the people in the photographs.')
    p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'collage-desktop.png'),full_page=True)
    p.locator('#cf-detail-1').click();p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'receipt-desktop.png'),full_page=True)
    for sid in ['dinosaur-night','cassette']:
        p.locator('#cf-close').click();p.locator('#cf-open-'+sid).click()
        p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/(sid+'-collage.png')),full_page=True)
    for width in [768,390]:
        p.set_viewport_size({'width':width,'height':950})
        assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
        folder=p.locator('.cf-memory-folder').bounding_box();writer=p.locator('#cf-draft').bounding_box()
        assert writer['y']>folder['y']+folder['height'] and writer['width']>270
        if width==390:
            p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'collage-mobile.png'),full_page=True)
        p.locator('#cf-detail-0').click();assert p.locator('#cf-document svg').bounding_box()['width']>250
        p.locator('#cf-next').click();assert p.locator('#cf-detail-1').get_attribute('aria-pressed')=='true'
        p.locator('#cf-draft').fill('A mobile draft.');p.locator('#cf-detail-2').click()
        assert p.locator('#cf-draft').input_value()=='A mobile draft.'
        if width==390:
            p.locator('#cf-detail-1').click();p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'receipt-mobile.png'),full_page=True)
        p.locator('#cf-put-back').click()
    p.locator('#cf-close').click();assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
    p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'folders-mobile.png'),full_page=True)
    p.emulate_media(reduced_motion='no-preference');p.locator('#cf-open-cassette').click();p.locator('#cf-piece-0').click()
    assert p.locator('#cf-inspector').evaluate('e=>getComputedStyle(e).animationName')=='cf-pick-up'
    p.locator('#cf-put-back').click();p.locator('#cf-close').click();p.locator('#cf-topics').click()
    assert p.locator('[data-grammar-exercise=ppfiles]').count()==1
    assert not errors,errors
    assert not missing,missing
    browser.close()
server.shutdown()
print('PASS: B1 catalog; 3 collages / 24 keepsakes; real image assets; separate large writer; per-file drafts; hints; keyboard; shared replay and read-only snapshot; desktop/tablet/phone; no checker.')
