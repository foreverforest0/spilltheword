"""Browser regression checks for A1 presentation, fridge magnets and room controls.

Run with Python Playwright and Chromium: python3 scripts/check-practice-layout.py
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


server = ThreadingHTTPServer(("127.0.0.1", 0), partial(Quiet, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()

with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path="/usr/bin/chromium", args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 1365, "height": 900})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(f"http://127.0.0.1:{server.server_port}/")

    def activity(task, level="a1"):
        page.evaluate("([id,lv])=>{go('gram');S.splevel=lv;spOpen(id)}", [task, level])
        page.wait_for_timeout(80)

    # Reach the additional Kids activity through the same catalog as a learner.
    page.evaluate("go('gram')")
    page.locator('[data-catalog-level="kids"]').click()
    page.locator('[data-grammar-topic="kids:2"]').click()
    page.locator('[data-grammar-exercise="mkhabit"]').click()
    page.wait_for_timeout(100)
    assert page.locator(".b1-habit-picture img").evaluate("e=>e.complete&&e.naturalWidth>0")
    assert page.locator(".mglight").count() == 0
    page.locator("#mgans").click()
    assert page.locator(".b1-answer").inner_text().endswith(".")
    page.locator("#dmnew").click()
    assert page.locator(".b1-answer").inner_text() == ""
    kids_report = page.evaluate("""()=>{
      const items=kidsHabitItems(),cfg=MGXC.mkhabit;
      const choose=(st,words)=>words.forEach(word=>{
        const b=[...st.querySelectorAll('.b1-bank .b1-magnet')].find(e=>e.querySelector('span').textContent===word);
        if(!b)throw Error('Missing Kids magnet '+word);b.click();
      });
      for(const item of items){
        const extra=item[4],a=extra.agreement;
        if(a.addS!==['He','She','Tom','Mum'].includes(a.subject))throw Error('Wrong agreement group');
        const st=dmShell('mkhabit',cfg.title,cfg.help,cfg.hints),mb=document.createElement('div');st.before(mb);
        b1MagnetRound(st,mb,'mkhabit',cfg,{s:item[1],pic:item[2],extra});
        choose(st,[a.subject,a.wrong,extra.tokens[2]]);st.querySelector('#mgchk').click();
        if(st.querySelector('.b1-answer').textContent.startsWith('Yes!'))throw Error('Wrong verb accepted');
        // Return the incorrect verb, select the correct form and put it before the object.
        [...st.querySelectorAll('.b1-strip .b1-magnet')].find(e=>e.querySelector('span').textContent===a.wrong).click();
        [...st.querySelectorAll('.b1-strip .b1-magnet')].find(e=>e.querySelector('span').textContent===extra.tokens[2]).click();
        choose(st,[a.verb,extra.tokens[2]]);st.querySelector('#mgchk').click();
        if(!st.querySelector('.b1-answer').textContent.startsWith('Yes!'))throw Error('Correct Kids answer rejected');
        if(st.querySelectorAll('.b1-bank .b1-magnet').length!==1)throw Error('The unused verb should stay in the bank');
      }
      return items.length;
    }""")
    assert kids_report == 56
    activity("mkhabit", "kids")
    page.locator(".b1-settings summary").click()
    page.locator('[data-t="s"]').click()
    assert page.locator(".b1-habit-picture figcaption").inner_text().split(" · ")[1] in ["He", "She", "Tom", "Mum"]
    page.locator(".b1-settings summary").click()
    page.locator('[data-t="base"]').click()
    assert page.locator(".b1-habit-picture figcaption").inner_text().split(" · ")[1] in ["I", "You", "We", "They"]
    page.set_viewport_size({"width": 390, "height": 844})
    page.wait_for_timeout(100)
    assert page.evaluate("document.documentElement.scrollWidth<=innerWidth")
    assert page.evaluate("document.querySelector('#mgans').getBoundingClientRect().bottom<=innerHeight")
    assert page.locator(".b1-bank .b1-magnet").evaluate_all("""els=>els.every(e=>{
      const r=e.getBoundingClientRect(),bank=e.parentElement.getBoundingClientRect();
      return r.top>=bank.top-1&&r.bottom<=bank.bottom+1;
    })""")
    assert page.locator(".b1-habit-art img").evaluate("""e=>{
      const r=e.getBoundingClientRect(),art=e.parentElement.getBoundingClientRect();
      return r.top>=art.top&&r.bottom<=art.bottom&&r.right<=art.right;
    }""")
    page.screenshot(path="/tmp/kids-habits-mobile.png", full_page=True)
    page.set_viewport_size({"width": 1365, "height": 900})
    page.wait_for_timeout(80)
    page.screenshot(path="/tmp/kids-habits-desktop.png", full_page=True)

    for mode in ["compare", "find", "memory"]:
        activity("there" + mode)
        question = page.locator(".cs-card:not([hidden]) .cs-front .thereQuestion").inner_text()
        page.locator("#thereExample").click()
        page.wait_for_function("!document.querySelector('.cs-deck')._cardDeck.busy")
        assert len(page.locator(".cs-card:not([hidden]) .cs-reverse .there-example").inner_text()) > 5
        if mode == "memory":
            page.locator("#thereHide").click()
            page.wait_for_function("getComputedStyle(document.querySelector('.cs-card:not([hidden]) .cs-front .there-photo')).filter.includes('brightness(0.07)')")
            assert page.locator(".cs-card:not([hidden]) .cs-reverse .there-photo").is_visible()
            page.locator("#thereHide").click()
            assert page.locator("#thereHide").get_attribute("aria-pressed") == "false"
        page.locator("#thereNew").click()
        page.wait_for_function("!document.querySelector('.cs-deck')._cardDeck.busy")
        if mode != "compare":
            assert question != page.locator(".cs-card:not([hidden]) .cs-front .thereQuestion").inner_text()
        page.locator("#thereExample").click()
        page.wait_for_function("!document.querySelector('.cs-deck')._cardDeck.busy")
        assert page.locator(".cs-card:not([hidden]) .cs-reverse .there-example").is_visible()

    for level in ["kids", "a1", "a2", "b1", "b2", "c1"]:
        activity("mkb" if level == "kids" else "mgb", level)
        expected = "magnets-fridge-blue.png" if level in ["b1", "b2", "c1"] else "mf_fridge.webp"
        assert page.locator(".magnet-fridge-art").get_attribute("src").endswith(expected)
        assert page.locator(".magnet-fridge-art").evaluate("e=>e.complete&&e.naturalWidth>0")
        magnet = page.locator(".b1-bank .b1-magnet").first
        assert magnet.evaluate("e=>getComputedStyle(e).backgroundColor") == "rgba(0, 0, 0, 0)"
        start, door = magnet.bounding_box(), page.locator(".b1-strip").bounding_box()
        page.mouse.move(start["x"] + start["width"] / 2, start["y"] + start["height"] / 2)
        page.mouse.down()
        page.mouse.move(door["x"] + 25, door["y"] + 25, steps=8)
        assert page.locator(".b1-drag-ghost").count() == 1
        page.mouse.up()
        assert page.locator(".b1-strip .b1-magnet").count() == 1
        expected_ink = "rgb(249, 245, 230)" if level in ["b1", "b2", "c1"] else "rgb(112, 39, 31)"
        assert page.locator(".b1-strip .b1-magnet").evaluate("e=>getComputedStyle(e).color") == expected_ink
        page.locator(".b1-strip .b1-magnet").click()
        assert page.locator(".b1-strip .b1-magnet").count() == 0
        assert page.locator("#b1undo,#b1reset").count() == 0

    for viewport in [{"width": 1365, "height": 900}, {"width": 390, "height": 844}]:
        page.set_viewport_size(viewport)
        activity("mgb")
        assert page.locator(".b1-fridge").bounding_box()["y"] > 0
        assert page.evaluate("document.querySelector('.b1-fridge').getBoundingClientRect().bottom <= innerHeight")
        assert page.evaluate("document.documentElement.scrollHeight <= innerHeight + 1")
        for selector in ["#dmnew", "#mgchk", "#mgans"]:
            assert page.locator(selector).bounding_box()["x"] > page.locator(".b1-fridge").bounding_box()["x"]
        page.locator(".blobb").click()
        page.wait_for_timeout(80)
        assert page.locator(".blobt").bounding_box()["y"] + page.locator(".blobt").bounding_box()["height"] <= page.locator(".b1-stage").bounding_box()["y"]

    ids = page.evaluate("[...new Set(SPGRP.a1.flatMap(g=>g[1]))]")
    for task in ids:
        activity(task)
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), task
        for button in page.locator("#view button").all():
            if not button.is_visible():
                continue
            assert button.evaluate("e=>getComputedStyle(e).borderWidth") == "0px", (task, button.inner_text())
    assert not errors, errors
    print(f"Passed: {kids_report} Kids habit rounds, {len(ids)} A1 activities, six fridge levels, drag/return, responsive layout and room controls.")
    browser.close()

server.shutdown()
