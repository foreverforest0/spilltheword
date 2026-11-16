"""Check the two simplified B1 games, label-only passive clues and five passive forms."""
from pathlib import Path
exec(Path(__file__).with_name('check-unbox.py').read_text().split('with sync_playwright() as pw:')[0])
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1280,'height':1000},reduced_motion='reduce');errors=[];missing=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('response',lambda r:missing.append(r.url) if '/unbox/' in r.url and r.status>=400 else None)
 page.goto(base+'/?unbox=1&task=whose');page.locator('#ub-knife').wait_for()
 assert page.locator('#ub-start,[data-mode],[data-contents],[data-task],#ub-settings').count()==0
 assert page.evaluate('FY.mode')=='t';assert page.evaluate('FY.contents')=='both'
 counts={};solved=0
 for g in ['w','p']:
  count=page.evaluate('(g)=>FYO[1][g].items.length',g);counts[g]=count
  assert count==(15 if g=='w' else 38)
  if g=='p':assert sorted(page.evaluate('[...new Set(FYO[1].p.items.map(x=>x.tense))]'))==['continuous','future','past','perfect','present']
  for i in range(count):
   start(page,g,'1')
   it=page.evaluate('([g,i])=>{FY.items=FYO[1][g].items.slice();FY.i=i;FY.phase="revealed";fyScene();return FY.items[i]}',[g,i])
   assert page.locator('#ub-start,[data-mode],[data-contents],[data-task],#ub-settings,#fzpool').count()==0
   assert page.locator('#fzin').count()==1
   assert page.locator('#fztask').get_attribute('data-topic')==('Relative clauses' if g=='w' else 'Passive voice')
   assert page.locator('.ub-object image').get_attribute('href').endswith(f'finds-{1 if it["art"]<12 else 2}.png')
   if g=='p':
    assert page.locator('.ub-label-facts').inner_text().replace('\n',' ').strip()
    assert page.locator('.ub-tag-copy').inner_text()==it['b']
    assert it['tenseName'] in page.locator('#fztask').inner_text()
    assert page.locator('.fzcard').count()==0 # No active sentence gives away the answer.
    if it['a']:assert it['a'] not in page.locator('#fztask').inner_text()
   if g=='w':wrong=it['ok'][0].replace(' whose ',' who her ')
   elif it['tense']=='present':wrong=it['ok'][0].replace(' is ',' was ').replace(' are ',' were ')
   elif it['tense']=='past':wrong=it['ok'][0].replace(' was ',' is ').replace(' were ',' are ')
   elif it['tense']=='continuous':wrong=it['ok'][0].replace(' being ',' ')
   elif it['tense']=='perfect':wrong=it['ok'][0].replace(' been ',' ')
   else:wrong=it['ok'][0].replace(' will be ',' will ')
   assert wrong!=it['ok'][0]
   page.locator('#fzin').fill(wrong);page.locator('#fzchk').click();assert page.locator('#fznx').count()==0
   page.locator('#fzin').fill(it['ok'][0]+'.');page.locator('#fzchk').click();assert page.locator('#fznx').count()==1,(g,i)
   solved+=1
   for alt in it['ok'][1:]:
    page.evaluate('(i)=>{FY.i=i;FY.phase="revealed";fyScene()}',i);page.locator('#fzin').fill(alt);page.locator('#fzchk').click();assert page.locator('#fznx').count()==1;solved+=1
  print(f'{count} {g} stories and accepted alternatives passed, including wrong answers',flush=True)
 # Every topic route bypasses settings, even if old preferences were tiles/card only.
 page.evaluate('()=>{S.splevel="b1";S.unboxMode="n";S.unboxContents="card";spSetup()}')
 for route,g in [('fw1','w'),('fp1','p')]:
  page.locator(f'[data-tp="{route}"]').click();assert page.evaluate('FY.gid')==g;assert page.evaluate('FY.mode')=='t';assert page.evaluate('FY.contents')=='both'
  assert page.evaluate('FY.phase')=='sealed';assert page.locator('#fztask').is_hidden();keyboard_open(page);reveal(page)
  assert page.locator('#fztask').is_visible();page.screenshot(path=f'/tmp/unbox-simple-{g}.png',full_page=True)
  page.locator('#ub-back').click();assert page.locator('[data-tp="fp1"]').is_visible()
 # Next and end preserve the simplified route and notes.
 start(page,'p','1');page.evaluate('()=>{FY.i=FY.items.length-1;FY.phase="revealed";fyScene()}');it=page.evaluate('FY.items[FY.i]');page.locator('#fzin').fill(it['ok'][0]);page.locator('#fzchk').click();page.locator('#fznx').click();page.locator('#ub-again').wait_for();assert 'Passive voice' in page.locator('.ub-header').inner_text();page.locator('#ub-again').click();assert page.evaluate('FY.phase')=='sealed';assert page.locator('#ub-start').count()==0
 # Legacy B1/B2 parcel activities keep their existing setup.
 page.evaluate('()=>fyStart("d","2")');assert page.locator('#ub-start').is_visible();assert page.locator('[data-task="w"],[data-task="p"]').count()==0
 # Mobile entry + keyboard reveal, then actual tap into the single answer field.
 mobile=browser.new_page(viewport={'width':390,'height':844},has_touch=True,reduced_motion='reduce');mobile.on('pageerror',lambda e:errors.append(str(e)));mobile.goto(base+'/?unbox=1&task=passive');mobile.locator('#ub-knife').wait_for();keyboard_open(mobile);reveal(mobile);assert mobile.evaluate('document.documentElement.scrollWidth<=innerWidth');mobile.locator('#fzin').tap();mobile.screenshot(path='/tmp/unbox-simple-mobile.png',full_page=True)
 # Cancelling either simple game during animation cannot reveal a stale task.
 normal=browser.new_page(viewport={'width':1280,'height':1000});normal.on('pageerror',lambda e:errors.append(str(e)));normal.goto(base+'/?unbox=1&task=passive');normal.locator('#ub-knife').focus();normal.keyboard.press('Enter');normal.keyboard.press('Enter');normal.locator('#ub-back').click();normal.wait_for_timeout(1100);assert normal.locator('[data-tp="fp1"]').is_visible();assert normal.locator('#fztask').count()==0
 assert not errors,errors;assert not missing,missing
 print(json.dumps({'stories':counts,'solved_answers':solved,'direct_entry':'passed','five_passive_forms':'passed','label_only':'passed','unpacking':'passed','completion':'passed','mobile':'passed','animation_cancel':'passed','errors':errors,'missing_assets':missing}),flush=True)
 browser.close()
server.shutdown()
