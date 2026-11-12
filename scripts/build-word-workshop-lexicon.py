"""Build the local lowercase English spelling lexicon from system Hunspell/SCOWL.
Retains source flags and affix rules; checks expansions with libhunspell. No runtime API.
"""
from pathlib import Path
import ctypes,ctypes.util,gzip,hashlib,json,re
ROOT=Path(__file__).resolve().parents[1];src=Path('/usr/share/hunspell/en_US.dic');aff=src.with_suffix('.aff')
lib=ctypes.CDLL(ctypes.util.find_library('hunspell-1.7'));lib.Hunspell_create.argtypes=[ctypes.c_char_p,ctypes.c_char_p];lib.Hunspell_create.restype=ctypes.c_void_p;lib.Hunspell_spell.argtypes=[ctypes.c_void_p,ctypes.c_char_p];lib.Hunspell_destroy.argtypes=[ctypes.c_void_p];h=lib.Hunspell_create(str(aff).encode(),str(src).encode())
rules=[];cross={}
for line in aff.read_text().splitlines():
 p=line.split()
 if len(p)>=4 and p[0] in ['PFX','SFX'] and p[2] in ['Y','N']:cross[(p[0],p[1])]=p[2]=='Y'
 elif len(p)>=5 and p[0] in ['PFX','SFX']:
  kind,flag,strip,add,condition=p[:5];rules.append({'kind':kind,'flag':flag,'strip':'' if strip=='0' else strip,'add':'' if add=='0' else add.split('/')[0],'condition':condition,'cross':cross[(kind,flag)]})
roots={}
for line in src.read_text().splitlines()[1:]:
 word,_,flags=line.split()[0].partition('/')
 if re.fullmatch('[a-z]+',word):roots[word]=''.join(sorted(set(roots.get(word,'')+flags)))
def apply(word,r):
 pattern=('^'+r['condition']) if r['kind']=='PFX' else (r['condition']+'$')
 if not re.search(pattern,word):return None
 strip=r['strip'];add=r['add']
 if r['kind']=='PFX':return add+word[len(strip):] if word.startswith(strip) else None
 return word[:-len(strip)]+add if strip and word.endswith(strip) else word+add if not strip else None
words=set(roots)
for word,flags in roots.items():
 pres=[r for r in rules if r['kind']=='PFX' and r['flag'] in flags];sufs=[r for r in rules if r['kind']=='SFX' and r['flag'] in flags]
 for r in pres+sufs:
  out=apply(word,r)
  if out and re.fullmatch('[a-z]+',out) and lib.Hunspell_spell(h,out.encode()):words.add(out)
 for p in pres:
  pre=apply(word,p)
  if pre and p['cross']:
   for r in sufs:
    out=apply(pre,r) if r['cross'] else None
    if out and re.fullmatch('[a-z]+',out) and lib.Hunspell_spell(h,out.encode()):words.add(out)
lib.Hunspell_destroy(h)
data={'source':'Hunspell en_US / SCOWL','source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'license':'LICENSE-SCOWL.txt','wordCount':len(words),'words':' '.join(sorted(words)),'flags':roots,'rules':rules}
raw=json.dumps(data,separators=(',',':')).encode();out=ROOT/'vendor/english';out.mkdir(exist_ok=True)
(out/'lexicon.json').write_bytes(raw);(out/'lexicon.json.gz').write_bytes(gzip.compress(raw,mtime=0))
print('Built',len(words),'spellings;',len(roots),'roots;',len(raw),'bytes;',len(gzip.compress(raw,mtime=0)),'gzipped bytes.')
