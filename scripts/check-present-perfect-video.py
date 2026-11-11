"""Real local playback, scene prompts, writing persistence, sharing and snapshots."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import json
import subprocess
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'assets/present-perfect-video'
OUT=Path('/workspace/shared/downloads/present-perfect-video');OUT.mkdir(parents=True,exist_ok=True)
manifest=json.loads((ASSETS/'manifest.json').read_text())
assert len(manifest)==8
for clip in manifest:
    path=ASSETS/(clip['id']+'.mp4')
    info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_type,codec_name,width,height','-of','json',str(path)]))
    assert len(info['streams'])==1 and info['streams'][0]['codec_name']=='h264'
    assert (info['streams'][0]['width'],info['streams'][0]['height'])==(960,540)
    assert abs(float(info['format']['duration'])-clip['clipDuration'])<.06
    assert clip['bytes']==path.stat().st_size and 3<clip['clipDuration']<12
    assert (ASSETS/(clip['id']+'-before.jpg')).is_file() and (ASSETS/(clip['id']+'-after.jpg')).is_file()

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'

with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    ctx=browser.new_context(viewport={'width':1440,'height':1050},reduced_motion='reduce')
    p=ctx.new_page();errors=[];missing=[]
    p.on('pageerror',lambda e:errors.append(str(e)))
    p.on('response',lambda r:missing.append(r.url) if r.status>=400 and r.url.startswith(base) else None)
    p.goto(base);p.wait_for_function('window.PresentPerfectVideo && window.SharedGame')
    p.evaluate("()=>{go('gram');S.glevel='b1';glSetup()}")
    p.locator('[data-grammar-topic="b1:1"]').click()
    assert p.locator('[data-grammar-exercise=ppvideo]').count()==1
    assert p.locator('[data-grammar-exercise=ppfiles]').count()==1
    p.locator('[data-grammar-exercise=ppvideo]').click()
    assert p.locator('[data-pv-group]').count()==4
    p.locator('#pv-how').click();assert p.locator('#pv-help').is_visible()
    assert 'no automatic grammar check' in p.locator('#pv-help').inner_text()
    p.locator('#pv-how').click();assert p.locator('#pv-help').is_hidden()
    data=p.evaluate('PresentPerfectVideo.data')
    assert len(data['tasks'])==8 and len(data['groups'])==4
    (OUT/'tasks.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
    for group in data['groups']:
        p.locator('#pv-mode-'+group['id']).click()
        group_tasks=[t for t in data['tasks'] if t['group']==group['id']]
        assert len(group_tasks)==2
        for task in group_tasks:
            p.locator('#pv-clip-'+task['id']).click()
            p.wait_for_function("document.getElementById('pv-video').readyState>=2")
            assert p.locator('#pv-models').is_hidden() and p.locator('#pv-hint-copy').is_hidden()
            assert p.locator('.pv-answer').count()==len(task['fields'])==len(task['models'])
            assert task['prompt']==p.locator('.pv-prompt').inner_text()
            p.locator('#pv-hint').click();assert p.locator('#pv-hint-copy').inner_text()==task['hint']
            for i in range(len(task['fields'])):
                p.locator('#pv-answer-'+str(i)).fill(task['id']+' / draft '+str(i)+': I has goed somewhere.')
                assert p.locator('#pv-answer-'+str(i)).get_attribute('spellcheck')=='false'
            p.locator('#pv-answer-toggle').click();assert p.locator('#pv-models').is_visible()
            for model in task['models']:assert model[0] in p.locator('#pv-models').inner_text()
            p.locator('#pv-answer-toggle').click();assert p.locator('#pv-models').is_hidden()
            assert 'I has goed somewhere.' in p.locator('#pv-answer-0').input_value()
            p.evaluate("document.getElementById('pv-video').playbackRate=4")
            p.locator('#pv-replay').click()
            p.wait_for_function("document.getElementById('pv-video').ended",timeout=15000)
            assert p.locator('#pv-watch-status').inner_text()=='Now describe the result.'
            assert p.evaluate("!document.getElementById('pv-video').error && document.getElementById('pv-video').duration>3")
            assert p.locator('#pv-live-frame').get_attribute('src').startswith('data:image/jpeg;')
            assert p.locator('#pv-models').is_hidden()
            assert p.locator('.pv-credit a').first.get_attribute('href')==data['sources'][task['source']]['url']
            assert p.locator('.pv-credit a').nth(1).inner_text()=='CC BY 4.0'
            if group['id']=='change':
                p.locator('#pv-frames').click();assert p.locator('#pv-frame-pair').is_visible()
                assert p.locator('#pv-frame-pair img').count()==2
        print(group['id'],'— two real clips decoded and ended; drafts/hints/models passed',flush=True)
    # All independent drafts and disclosures survive a reload.
    p.reload();p.wait_for_function('window.PresentPerfectVideo');p.evaluate("openSharedGrammar('ppvideo','b1')")
    for task in data['tasks']:
        p.locator('#pv-mode-'+task['group']).click();p.locator('#pv-clip-'+task['id']).click()
        assert p.locator('#pv-answer-0').input_value().startswith(task['id']+' / draft')
        assert p.locator('#pv-hint-copy').is_visible()
        assert p.locator('#pv-models').is_hidden()
    # Keyboard changes clips only outside the writing/video controls.
    p.locator('#pv-mode-just').click();p.locator('#pv-clip-helmet').click()
    p.locator('#pv-answer-0').press('ArrowRight');assert p.evaluate('PresentPerfectVideo.state.task')=='helmet'
    p.locator('#pv-clip-helmet').focus();p.keyboard.press('ArrowRight')
    assert p.evaluate('PresentPerfectVideo.state.task')=='takeoff'
    assert p.evaluate('document.activeElement.id')=='pv-clip-takeoff'
    # A short recipe restores editable answers and independent disclosure states.
    p.evaluate("spOpen('ppvideo')");p.locator('#pv-mode-already').click();p.locator('#pv-clip-bowl').click()
    p.locator('#pv-answer-0').fill('The owner has already filled the bowl.')
    p.locator('#pv-answer-1').fill('The dog has not eaten yet.')
    p.locator('#pv-answer-toggle').click()
    url=p.evaluate('SharedGame.getLink()')
    pupil=browser.new_context(viewport={'width':1440,'height':1050},reduced_motion='reduce')
    q=pupil.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto(url)
    q.wait_for_function('window.SharedGame && !SharedGame.replaying')
    assert not q.locator('.shared-game-loading').count()
    assert q.evaluate('PresentPerfectVideo.state.task')=='bowl'
    assert q.locator('#pv-answer-0').input_value()=='The owner has already filled the bowl.'
    assert q.locator('#pv-answer-1').input_value()=='The dog has not eaten yet.'
    assert q.locator('#pv-models').is_visible()
    q.locator('#pv-answer-1').fill('A pupil’s independent draft.')
    q.wait_for_function("document.getElementById('pv-video').readyState>=2")
    q.evaluate("document.getElementById('pv-video').playbackRate=4")
    q.locator('#pv-replay').click();q.wait_for_function("document.getElementById('pv-video').ended")
    snap=q.evaluate('SharedLive.snapshot()')
    assert 'A pupil’s independent draft.' in snap['html']
    assert 'present-perfect-video.css' in snap['html']
    assert '<video' not in snap['html'] and 'data:image/jpeg;' in snap['html']
    preview=pupil.new_page();preview.set_content(snap['html']);preview.wait_for_load_state('load')
    assert preview.locator('.pv-live-frame').is_visible() and preview.locator('.pv-live-frame').evaluate('e=>e.naturalWidth')==640
    pupil.close()
    # Actual desktop screenshots, including final frame and hidden models.
    p.locator('#pv-mode-just').click();p.locator('#pv-clip-takeoff').click()
    p.wait_for_function("document.getElementById('pv-video').readyState>=2")
    p.locator('#pv-answer-0').fill('The machine has just taken off.')
    p.evaluate("document.getElementById('pv-video').playbackRate=4")
    p.locator('#pv-replay').click();p.wait_for_function("document.getElementById('pv-video').ended")
    p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'just-happened-desktop.png'),full_page=True)
    p.locator('#pv-mode-already').click();p.locator('#pv-clip-bowl').click()
    p.locator('#pv-answer-toggle').click()
    p.wait_for_function("document.getElementById('pv-video').readyState>=2")
    p.evaluate("document.getElementById('pv-video').playbackRate=4")
    p.locator('#pv-replay').click();p.wait_for_function("document.getElementById('pv-video').ended")
    p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'already-yet-desktop.png'),full_page=True)
    p.locator('#pv-mode-change').click();p.locator('#pv-clip-gone').click()
    p.locator('#pv-answer-0').fill('The dog and the chicken have run away.')
    p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'before-after-desktop.png'),full_page=True)
    for width in [768,390]:
        p.set_viewport_size({'width':width,'height':950})
        assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
        p.locator('#pv-mode-question').click();p.locator('#pv-clip-meal').click()
        assert p.locator('#pv-video').bounding_box()['width']>270
        p.locator('#pv-answer-0').fill('Has the dog eaten the food?')
        p.locator('#pv-answer-1').fill('Yes, it has.')
        assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
        if width==390:
            p.evaluate('window.scrollTo(0,0)');p.screenshot(path=str(OUT/'question-mobile.png'),full_page=True)
    # Media error is explicit; choosing another exercise still works.
    p.evaluate("document.getElementById('pv-video').dispatchEvent(new Event('error'))")
    assert 'could not load' in p.locator('#pv-watch-status').inner_text()
    p.locator('#pv-next').click();p.wait_for_function("document.getElementById('pv-video').readyState>=2")
    # Exit during playback: old media is paused and unloaded; no callbacks linger.
    p.locator('#pv-replay').click();p.evaluate('window.oldPPVideo=document.getElementById("pv-video")')
    p.locator('#pv-topics').click()
    assert p.locator('[data-grammar-exercise=ppvideo]').count()==1
    assert p.evaluate('oldPPVideo.paused && !oldPPVideo.getAttribute("src") && !oldPPVideo.onended')
    assert not errors,errors
    assert not missing,missing
    browser.close()
server.shutdown()
print('PASS: eight verified silent H.264 files; 4 practice groups; real playback; hints/models; independent persisted writing; clean-context sharing; live static frames; keyboard; desktop/tablet/mobile; media errors and exit cleanup.')
