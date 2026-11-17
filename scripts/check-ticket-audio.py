"""Exercise the supplied MP3 in Chromium: timing, mute, reset and cleanup."""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);p=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='no-preference');errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.add_init_script('''(()=>{const Native=window.Audio;window.__ticketAudio=[];window.Audio=function(...args){const a=new Native(...args);window.__ticketAudio.push(a);return a}})()''')
 p.goto(f'http://127.0.0.1:{server.server_port}/');p.evaluate("go('gram');S.snd=true;spOpen('future_timetable')")
 assert p.evaluate('window.__ticketAudio.length')==1
 assert p.evaluate('window.__ticketAudio[0].paused')
 p.locator('#ttPrint').click();p.wait_for_function('window.__ticketAudio[0].currentTime>.05&&!window.__ticketAudio[0].paused')
 duration=p.evaluate('window.__ticketAudio[0].duration');assert 1.4<duration<1.7,duration
 assert p.locator('#ttPrint').is_disabled()
 assert abs(p.locator('.tt-ticket').evaluate('e=>parseFloat(e.style.animationDuration)')-duration*1000)<2
 p.wait_for_function("document.querySelector('.timetable-page').dataset.phase==='ready'")
 assert p.evaluate('window.__ticketAudio[0].paused&&window.__ticketAudio[0].currentTime===0')
 p.locator('#sndbtn').click();assert p.evaluate('S.snd===false');p.locator('#ttPrint').click();p.wait_for_timeout(120);assert p.evaluate('window.__ticketAudio[0].paused')
 p.wait_for_function("document.querySelector('.timetable-page').dataset.phase==='ready'")
 p.locator('#sndbtn').click();p.locator('#ttPrint').click();p.wait_for_function('window.__ticketAudio[0].currentTime>.05&&!window.__ticketAudio[0].paused')
 p.locator('#sndbtn').click();assert p.evaluate('window.__ticketAudio[0].muted')
 p.evaluate("go('home')");assert p.evaluate('window.__ticketAudio[0].paused&&window.__ticketAudio[0].currentTime===0')
 # Reduced motion keeps the recording; only paper motion is skipped.
 p.emulate_media(reduced_motion='reduce');p.evaluate("go('gram');S.snd=true;S.futureTickets=null;spOpen('future_timetable')");p.locator('#ttPrint').click();p.wait_for_function('window.__ticketAudio.at(-1).currentTime>.1')
 assert p.evaluate('!window.__ticketAudio.at(-1).paused');assert p.locator('.timetable-page').get_attribute('data-phase')=='ready'
 p.evaluate("go('home')");assert p.evaluate('window.__ticketAudio.at(-1).paused')
 assert not errors,errors
 print(f'PASS: actual MP3 playback ({duration:.3f}s), synchronized feed, sound off, live mute, reset on finish/exit, full sound with reduced motion; no JS errors')
 b.close()
server.shutdown()
