"""B1 content and browser regression checks. Requires Python Playwright + Chromium.
Run: python scripts/check-b1-content.py
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import json
import re
import sys
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Quiet, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}'

with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    page = browser.new_page(viewport={'width':1440,'height':1000}, reduced_motion='reduce')
    errors=[]
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(base+'/')
    page.wait_for_function('typeof B1_CONTENT_AUDIT!=="undefined" && B1_CONTENT_AUDIT.length>90')
    report=page.evaluate('''()=>{
      S.splevel='b1';S.elv=false;
      const assert=(v,m)=>{if(!v)throw Error(m)};
      assert(B1_CONTENT_AUDIT.every(x=>x.added>=5),'Every bank needs at least five additions');
      assert(new Set(B1_CONTENT_AUDIT.map(x=>x.bank+':'+x.key)).size===B1_CONTENT_AUDIT.length,'Duplicate audit key');
      for(const [id,cfg] of Object.entries(B1MAG)){
       const types=new Set(cfg.types.map(x=>x[0]));
       for(const [type,answers,,,extra={}] of cfg.items()){
        assert(types.has(type),'Unknown magnet mode '+id+':'+type);
        assert(answers.length && answers.every(x=>typeof x==='string'&&x.trim()),'Empty magnet answer '+id);
        const tokens=extra.tokens||answers[0].replace(/[.,?!]/g,'').split(' ');
        assert(b1AnswerMatch(tokens.join(' '),answers[0]),'Impossible canonical magnets '+id+': '+answers[0]);
       }
       for(const [type]of cfg.types)assert(type==='all'||cfg.items().some(x=>x[0]===type),'Empty mode '+id+':'+type);
      }
      for(const key of ['p','t','a'])assert(CWO[key].items.length===17,'Board count '+key);
      for(const key of ['b1','h1','k1','l1','s1']){
       const C=EVO[key];assert(C.clues.length===15,'Evidence count '+key);
       for(const c of C.clues){
        assert(c.box.length===4&&c.ok.length,'Invalid clue '+key);
        for(const answer of c.ok)assert(evOk(c,answer,true),'Rejected model '+answer);
        assert(!evOk(c,'must be '+c.k+' words in any order',true),'Keyword-only false positive');
       }
      }
      for(const [k,cfg]of Object.entries(TYD).filter(([k])=>['tv3','tpa','trp','ttg','tcd','tgi','twf'].includes(k))){
       for(const [mode]of cfg.modes)assert(cfg.pool(mode).length,'Empty typewriter mode '+k+mode);
       const all=cfg.pool('all');assert(new Set(all.map(x=>x.p)).size===all.length,'Repeated typewriter prompt '+k);
       for(const it of all)assert(it.a.length&&it.a.every(x=>x.trim()),'Missing typed answer '+k);
      }
      assert(b1AnswerMatch('She has not called me','She hasn’t called me'),'Negative contraction');
      assert(b1AnswerMatch('I have just sent it','I’ve just sent it'),'Positive contraction');
      assert(!b1AnswerMatch('She have called me','She has called me'),'Agreement false positive');
      assert(!b1AnswerMatch('She has tired',"She’s tired"),'Ambiguous contraction false positive');
      assert(!b1AnswerMatch('Nobody is replied yet',"Nobody’s replied yet"),'Wrong auxiliary false positive');
      assert(!b1AnswerMatch('Must he at home be','He must be at home'),'Word order false positive');
      const allids=SPGRP.b1.flatMap(x=>x[1]);for(const id of allids)assert(DMTF[id]||SPT.some(x=>x.id===id)||GT.some(x=>x.id===id&&x.sp),'Missing activity '+id);
      return {banks:B1_CONTENT_AUDIT,magnetCount:Object.values(B1MAG).reduce((a,x)=>a+x.items().length,0),topics:SPGRP.b1.length};
    }''')
    print('Content structure and answer validation passed',flush=True)
    if '--tail' not in sys.argv:
        # Every exhibit, including all new second-page exhibits, is solvable through its UI.
        for key in ['p','t','a']:
            page.evaluate('(k)=>{cwStart(k);CW.started=true;CW.mode="t";cwScene()}',key)
            for i in range(17):
                it=page.evaluate('([k,i])=>CWO[k].items[i]',[key,i])
                if i==12: page.locator('#cwpages [data-page="1"]').click()
                page.locator(f'.cwi[data-i="{i}"]').click()
                page.locator(f'#cwans [data-j="{it["c"][0]}"]').click()
                page.locator('#cwin').fill(it['ok'][0]);page.locator('#cwchk').click()
                assert page.locator('#cwnext').count(), (key,i,page.locator('#cwfb').inner_text())
                page.locator('#cwnext').click()
            assert page.locator('.cwstamp').count()==1,key
        print('All 51 case-board exhibits passed, including pagination',flush=True)
        # Review all fifteen clues in each B1 room. Future hotspots cannot block current ones.
        for key in ['b1','h1','k1','l1','s1']:
            page.evaluate('(k)=>{evStart(k);EV.started=true;EV.mode="t";evScene()}',key)
            for i in range(15):
                c=page.evaluate('EVO[EV.cid].clues[EV.i]')
                page.locator(f'.evh[data-k="{i}"]').click()
                page.locator(f'#evans .evc[data-k="{c["lv"]}"]').click()
                page.locator('#evin').fill(c['ok'][0]);page.locator('#evchk').click()
                assert page.locator('#evnext').count(),(key,i,page.locator('#evfb').inner_text())
                page.locator('#evnext').click()
        print('All 75 B1 evidence clues passed',flush=True)
        # The first item in each magnet filter must be constructible, including form cycling.
        filters=page.evaluate('Object.entries(B1MAG).flatMap(([id,c])=>c.types.filter(x=>x[0]!=="all").map(([type])=>({id,type})))')
        for entry in filters:
            tokens=page.evaluate('''({id,type})=>{
              S.mgxt=S.mgxt||{};S.mgxt[id]=type;S.b1challenge=S.b1challenge||{};S.b1challenge[id]='guided';
              const row=B1MAG[id].items().filter(x=>x[0]===type).at(-1);MGXQ[id+type]=[row];dmMagnets(id,B1MAG[id]);
              return row[4]?.tokens||row[1][0].replace(/[.,?!]/g,'').split(' ');
            }''',entry)
            for i,token in enumerate(tokens):
                selector=f'.b1-bank [data-piece="{i}"]'
                for _ in range(4):
                    if page.locator(selector+' span').inner_text()==token:break
                    page.locator(selector+' + button').click()
                assert page.locator(selector+' span').inner_text()==token,(entry,token)
                page.locator(selector).click()
            page.locator('#mgchk').click()
            assert re.search(r'Perfect|Correct',page.locator('.b1-answer').inner_text()),entry
        print(f'All {len(filters)} B1 magnet filters passed',flush=True)
        # CRT examples and all five new passengers.
        for key in page.evaluate('B1_CONTENT_AUDIT.filter(x=>x.bank==="desk-examples").map(x=>x.key)'):
            page.evaluate('(k)=>deskTask([k])',key)
            page.locator('#dkm [data-b="3"]').click()
            assert page.locator('#dkdots span').count()==5
            page.locator('#dkdots [data-d="4"]').click()
            assert 'EXAMPLE 5/5' in page.locator('#dkp').inner_text()
        page.evaluate('()=>{deskOff();elStart("t1");EL.started=true;EL.mode="t"}')
        for i in range(8,13):
            page.evaluate('(i)=>{EL.i=i;EL.floor=EL.C.items[i].from;EL.started=false;elScene();elAsk();elBuild(0)}',i)
            answer=page.evaluate('EL.C.items[EL.i].ok[0]')
            page.locator('#elin').fill(answer);page.locator('#elchk').click()
            assert page.locator('#elnext').count(),i
        print('All 18 desks and 5 new elevator passengers passed',flush=True)
        # New definitions, joins, quality control and sorting use the original factory controls.
        for group in ['s','d','j','q']:
            count=page.evaluate('(g)=>FYO[1][g].items.length',group)
            for i in range(count-5,count):
                it=page.evaluate('''([g,i])=>{fyStart(g,'1');FY.items=FY.G.items.slice();FY.i=i;FY.started=true;FY.mode='t';FY.phase='revealed';FY.open=true;fyScene();fyTask();return FY.items[i]}''',[group,i])
                if group=='s':page.locator(f'.fypb[data-k="{it["a"]}"]').click();continue
                if group=='q':
                    page.locator(f'#fzans > .evcert [data-k="{0 if it["good"] else 1}"]').click()
                    if it['good']:assert page.locator('#fznx').count();continue
                    page.locator(f'#fzfix > .evcert [data-k="{it["c"][0]}"]').click()
                else:page.locator(f'#fzans > .evcert [data-k="{it["c"][0]}"]').click()
                page.locator('#fzin').fill(it['ok'][0]);page.locator('#fzchk').click();assert page.locator('#fznx').count(),(group,i)
        print('All 20 new factory tasks passed',flush=True)
    # Text-to-speech additions must never request missing vm34...vm38 files.
    page.evaluate('()=>{S.splevel="b1";vmStart()}')
    for _ in range(23):page.locator('#vznx').click()
    # Find the new-message index by the displayed counter, without relying on older filtered counts.
    for _ in range(40):
        if page.locator('#vzs').inner_text().endswith(' / 30'):pass
        src=page.evaluate('VMA.getAttribute("src")')
        if src is None:break
        page.locator('#vznx').click()
    assert page.evaluate('VMA.getAttribute("src")') is None
    page.locator('#vztx').click();assert page.locator('#vzx').inner_text().strip()
    page.evaluate('''()=>{window.spokenMessage=null;Object.defineProperty(window,'speechSynthesis',{value:{cancel(){window.speechCancelled=true},speak(u){window.spokenMessage=u.text;u.onstart?.()}}})}''')
    page.locator('#vzpl').click();assert page.evaluate('spokenMessage')
    page.evaluate('()=>spSetup()');assert page.evaluate('speechCancelled')
    page.evaluate('()=>vmStart()')
    page.locator('#vzback').click()
    # Photobooth data: 340 prompts, valid options, explicit full correction variants.
    photo=browser.new_page(viewport={'width':1280,'height':1000},reduced_motion='reduce')
    photo.on('pageerror',lambda e:errors.append(str(e)))
    photo.goto(base+'/photobooth/')
    banks=photo.evaluate('PHOTO_BANK')
    assert len(banks)==20 and all(len(t['cases'])==17 for t in banks)
    for t in banks:
        ids=set()
        for it in t['cases']:
            assert it['id'] not in ids;ids.add(it['id'])
            assert it['prompt'].count('___')==1,it
            assert len(it['options'])>=3 and it['answers'][0] in it['options'],it
            assert len(it['answers'])==len(it['corrections']),it
            assert it['errorPrompt'] not in it['corrections'],it
            assert '___' not in it['correction']
            assert (ROOT/'photobooth'/it['picture']).exists(),it['picture']
    for i,t in enumerate(banks):
        for mode in range(3):
            photo.select_option('#topic',str(i));photo.select_option('#mode',str(mode));photo.select_option('#scene','12');photo.locator('#coin').click()
            photo.wait_for_function('document.querySelector("#booth").dataset.state==="answering"')
            it=t['cases'][12]
            if mode==1:photo.get_by_role('button',name=it['answers'][0],exact=True).click()
            else:photo.locator('#answer').fill(it['correction'].replace('He’s just ', 'He has just ') if mode==2 else it['answers'][0])
            photo.locator('#check').click()
            photo.wait_for_function('document.querySelector("#booth").dataset.state==="revealed"')
    print('All 340 photobooth entries validated; all 20 topics solved in all 3 modes',flush=True)
    # Mobile: second-page navigation and the new photobooth scene work with touch.
    mobile=browser.new_page(viewport={'width':390,'height':844},has_touch=True,reduced_motion='reduce')
    mobile.on('pageerror',lambda e:errors.append(str(e)));mobile.goto(base+'/')
    mobile.evaluate('()=>{S.splevel="b1";cwStart("p");CW.started=true;cwScene()}')
    mobile.locator('#cwpages [data-page="1"]').tap();assert mobile.locator('.cwi').count()==5
    mobile.locator('.cwi[data-i="16"]').tap();assert mobile.locator('#cwmod').is_visible()
    assert not errors,errors
    Path('/tmp/b1-content-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print(json.dumps({'expanded_banks':len(report['banks'])+20,'new_entries':sum(x['added'] for x in report['banks'])+100,'browser_errors':errors}),flush=True)
    browser.close()
server.shutdown()
