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

    for mode in ["compare", "find", "memory"]:
        activity("there" + mode)
        question = page.locator("#thereQuestion").inner_text()
        page.locator("#thereExample").click()
        assert len(page.locator("#thereAnswer").inner_text()) > 5
        if mode == "memory":
            page.locator("#thereHide").click()
            page.wait_for_function("getComputedStyle(document.querySelector('.there-photo')).filter.includes('brightness(0.07)')")
            assert page.locator(".there-photo").is_visible()
            page.locator("#thereHide").click()
            assert page.locator("#thereHide").get_attribute("aria-pressed") == "false"
        page.locator("#thereNew").click()
        if mode != "compare":
            assert question != page.locator("#thereQuestion").inner_text()
        page.locator("#thereExample").click()
        assert page.locator("#thereAnswer").is_visible()

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
    print(f"Passed: {len(ids)} A1 activities, six fridge levels, drag/return, responsive layout and room controls.")
    browser.close()

server.shutdown()
