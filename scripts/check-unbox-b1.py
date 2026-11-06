"""Check all new B1 parcel stories in both answer formats and their topic routes."""
from pathlib import Path
exec(Path(__file__).with_name('check-unbox.py').read_text().split('with sync_playwright() as pw:')[0])
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1280,'height':1000},reduced_motion='reduce');errors=[];missing=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('response',lambda r:missing.append(r.url) if '/unbox/' in r.url and r.status>=400 else None)
 page.goto(base+'/?unbox=1');page.locator('#ub-start').wait_for()
 assert page.locator('[data-task="w"]').count()==1
 assert page.locator('[data-task="p"]').count()==0
 for g in ['w','p']:
  count=page.evaluate('(g)=>FYO[1][g].items.length',g)
  assert count==(15 if g=='w' else 20)
  for mode in ['t','n']:
   for i in range(count):
    start(page,g,'1',mode)
    it=page.evaluate('([g,i])=>{FY.items=FYO[1][g].items.slice();FY.i=i;FY.phase="revealed";fyScene();return FY.items[i]}',[g,i])
    assert page.locator('#fztask').get_attribute('data-topic')==('Relative clauses' if g=='w' else 'Passive voice')
    assert page.locator('.ub-object image').get_attribute('href').endswith(f'finds-{1 if it["art"]<12 else 2}.png')
    if mode=='t':
     wrong=it['ok'][0].replace(' whose ',' who her ') if g=='w' else it['ok'][0].replace(' was ',' is ').replace(' were ',' are ') if it['tense']=='past' else it['ok'][0].replace(' is ',' was ').replace(' are ',' were ')
     page.locator('#fzin').fill(wrong);page.locator('#fzchk').click();assert page.locator('#fznx').count()==0
     page.locator('#fzin').fill(it['ok'][0]+'.')
    else:
     for word in it['ok'][0].split(' '):
      page.evaluate('(w)=>{const b=[...document.querySelectorAll("#fzpool .evt")].find(x=>x.textContent===w);if(!b)throw Error("Missing tile "+w);b.click()}',word)
    page.locator('#fzchk').click();assert page.locator('#fznx').count()==1,(g,i,mode)
  print(f'{count} {g} stories passed in both modes, including wrong answers',flush=True)
 # Real entry from both B1 grammar topics; the new collection still requires unpacking.
 page.evaluate('()=>{S.splevel="b1";spSetup()}');assert page.locator('[data-tp="fw1"]').count()==1;assert page.locator('[data-tp="fp1"]').count()==1
 page.locator('[data-tp="fp1"]').click();assert page.locator('[data-task="p"]').count()==1;assert page.locator('[data-task="w"]').count()==0
 page.locator('#ub-start').click();assert page.evaluate('FY.phase')=='sealed';keyboard_open(page);reveal(page);assert page.locator('#fztask').is_visible();page.screenshot(path='/tmp/unbox-passive-b1.png',full_page=True)
 page.locator('#ub-settings').click();assert page.locator('[data-task="p"]').count()==1
 page.evaluate('()=>fyStart("w","1")');page.locator('#ub-start').click();keyboard_open(page);reveal(page);assert page.locator('#fztask').is_visible();page.screenshot(path='/tmp/unbox-whose-b1.png',full_page=True)
 # The B2 collection list must not expose the B1 additions.
 page.evaluate('()=>fyStart("d","2")');assert page.locator('[data-task="w"],[data-task="p"]').count()==0
 mobile=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce');mobile.goto(base+'/?unbox=1&task=passive');mobile.locator('#ub-start').click();keyboard_open(mobile);reveal(mobile);assert mobile.evaluate('document.documentElement.scrollWidth<=innerWidth')
 assert not errors,errors;assert not missing,missing
 print(json.dumps({'stories':35,'solved_answers':70,'topic_routes':'passed','unpacking':'passed','mobile':'passed','errors':errors,'missing_assets':missing}),flush=True)
 browser.close()
server.shutdown()
