"""GIF home entry, course selection, saved settings and playable rounds.
Run: python3 scripts/check-gif-home.py (Python Playwright + /usr/bin/chromium).
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Quiet, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    page = browser.new_page(reduced_motion='reduce')
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(base)
    assert page.locator('.book').count() == 7
    page.locator('[data-book-game="gif"]').click()
    assert page.locator('.gif-setup').is_visible()
    page.locator('#lpT').click()
    courses = page.locator('#lpcs option').evaluate_all('(es)=>es.map(e=>e.value)')
    for course in courses:
        page.locator('#lpcs').select_option(course)
        assert page.locator('#lpu option').count() > 0
        assert page.locator('#lpl option').count() > 0
    # Choose an actual lesson through all three selectors, then exclude one word.
    lesson = page.evaluate('''()=>{for(const c of COURSES)for(let u=0;u<c.units.length;u++)
      for(let l=0;l<c.units[u].ls.length;l++)if(c.units[u].ls[l].v.length>3)
      return {course:c.id,unit:String(u),lesson:String(l)}}''')
    page.locator('#lpcs').select_option(lesson['course'])
    page.locator('#lpu').select_option(lesson['unit'])
    page.locator('#lpl').select_option(lesson['lesson'])
    page.locator('[data-id]').check()
    excluded = page.locator('[data-w]').first
    excluded_id = excluded.get_attribute('data-w')
    excluded.uncheck()
    page.locator('#mwT').click()
    page.locator('#mine').fill('my custom phrase')
    page.locator('#gram').fill('Present Perfect\nSecond Conditional')
    page.locator('label:has(#gmode) [data-v="vocab"]').click()
    page.locator('label:has(#gn) [data-v="2"]').click()
    category = page.locator('#gcats button').first.get_attribute('data-n')
    page.locator('#gcats button').first.click()
    before = page.evaluate('''()=>JSON.stringify({lessons:S.les.gif,excluded:S.lx.gif,
      mine:S.mine.gif,grammar:S.gram.gif,mode:S.gifMode,count:S.gn,categories:S.gcats})''')
    assert excluded_id in page.evaluate('S.lx.gif')
    assert page.evaluate('lessonWords("gif").length') > 0
    # Visiting another Grammar Game must not replace the GIF display mode.
    page.locator('#gif-home').click()
    page.locator('[data-book-game="flask"]').click()
    page.evaluate("go('home')")
    page.reload()
    page.locator('[data-book-game="gif"]').click()
    after = page.evaluate('''()=>JSON.stringify({lessons:S.les.gif,excluded:S.lx.gif,
      mine:S.mine.gif,grammar:S.gram.gif,mode:S.gifMode,count:S.gn,categories:S.gcats})''')
    assert before == after
    assert page.locator('#gmode').input_value() == 'vocab'
    assert not page.locator(f'#gcats button[data-n="{category}"]').evaluate("e=>e.classList.contains('on')")
    # Start all three modes and check the actual dealt material and GIF files.
    for mode in ['vocab', 'grammar', 'both']:
        page.locator(f'label:has(#gmode) [data-v="{mode}"]').click()
        page.locator('#start').click()
        page.wait_for_selector('.cs-deck .gifimg')
        assert page.evaluate('GF.mode') == mode
        cards = page.evaluate('GF.cards')
        assert cards
        allowed = page.evaluate('lessonWords("gif").concat(mineList("gif")).map(x=>x.w)')
        for card in cards:
            assert len(card['words']) == (0 if mode == 'grammar' else 2)
            assert all(w['w'] in allowed for w in card['words'])
            assert bool(card['gram']) == (mode != 'vocab')
        image = page.locator('.cs-card:not([hidden]) .cs-front .gifimg')
        image.evaluate('e=>e.scrollIntoView()')
        page.wait_for_function("document.querySelector('.cs-card:not([hidden]) .cs-front .gifimg').naturalWidth>0")
        card = page.locator('.cs-card:not([hidden])')
        card.click(position={'x':14,'y':18})
        assert card.get_attribute('aria-pressed') == 'true'
        assert card.locator('.cs-reverse').inner_text()
        page.locator('.cs-next').click()
        page.wait_for_function("document.querySelector('.cs-deck').dataset.index==='1'&&!document.querySelector('.cs-deck')._cardDeck.busy")
        page.locator('.cs-back').click()
        page.wait_for_function("document.querySelector('.cs-deck').dataset.index==='0'&&!document.querySelector('.cs-deck')._cardDeck.busy")
        assert page.locator('.cs-card:not([hidden])').get_attribute('aria-pressed') == 'true'
        page.locator('#cs-gif-new').click()
        assert page.locator('.cs-card').count() == len(cards)
        page.locator('#cs-topics').click()
        assert page.locator('.gif-setup').is_visible()
    for width in [1440, 1024, 768, 390, 320]:
        page.set_viewport_size({'width':width, 'height':950})
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), ('setup',width)
        page.locator('#gif-home').click()
        book = page.locator('[data-book-game="gif"]')
        book.focus()
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), ('home',width)
        assert book.locator('.book-title').evaluate('e=>e.scrollWidth<=e.clientWidth')
        book.click()
    assert not errors, errors
    browser.close()
server.shutdown()
print(f'PASS: 7 books, {len(courses)} courses, lesson/word selection, saved settings, 3 game modes, GIF loading and 5 viewports.')
