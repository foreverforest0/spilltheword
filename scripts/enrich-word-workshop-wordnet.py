"""Add attested derivational/pertainym links from WordNet 3.0 to the local spelling data.
Usage: python scripts/enrich-word-workshop-wordnet.py /path/to/wordnet.zip
"""
from pathlib import Path
import gzip,json,re,sys,zipfile,os
ROOT=Path(__file__).resolve().parents[1];dest=ROOT/'vendor/english';data=json.loads((dest/'lexicon.json').read_text());spell=set(data['words'].split());z=zipfile.ZipFile(sys.argv[1]);nodes={};pointers=[];pos={};people=set()
for file,kind in [('noun','n'),('verb','v'),('adj','a'),('adv','r')]:
 for line in z.read('wordnet/data.'+file).decode().splitlines():
  if not line[:1].isdigit():continue
  p=line.split('|',1)[0].split();offset=p[0];lex=int(p[1]);count=int(p[3],16);lemmas=[re.sub(r'\(.*\)$','',p[4+i*2]) for i in range(count)];idx=4+count*2;pc=int(p[idx]);idx+=1;nodes[(kind,offset)]=lemmas
  for lemma in lemmas:
   if lemma in spell:
    pos.setdefault(lemma,set()).add(kind)
    if kind=='n' and lex==18:people.add(lemma)
  for i in range(pc):
   sym,to,pk,st=p[idx+i*4:idx+(i+1)*4]
   if sym in ['+','\\'] and st!='0000':pointers.append((kind,offset,sym,to,'a' if pk=='s' else pk,int(st[:2],16)-1,int(st[2:],16)-1))
prefixes=['under','counter','inter','super','over','anti','auto','post','non','pre','mis','dis','sub','out','un','re','in','im','il','ir','de','en','em','co']
suffixes=sorted(['ness','ful','less','some','ly','ment','able','ible','ive','ous','al','ic','ical','ish','y','er','or','ee','ist','ism','ship','hood','dom','ance','ence','ity','ion','ation','sion','ize','ise','ify','en'],key=len,reverse=True)
def variants(w):
 s=[w]
 if w.endswith('e'):s.append(w[:-1])
 if re.search('[^aeiou]y$',w):s.extend([w[:-1]+'i',w[:-1]])
 if re.search('[aeiou][^aeiouwxy]$',w) and not re.search('[aeiou]{2}[^aeiouwxy]$',w):s.append(w+w[-1])
 return s
related={};seen=set();types={'n':'noun','v':'verb','a':'adjective','r':'adverb'}
def add(a,b,pk):
 if a==b or a not in spell or b not in spell or len(a)<3 or len(b)<3:return
 label=kind=None
 for pre in prefixes:
  if b==pre+a:label=pre+'-';kind='prefix';break
 if not label and a.endswith('ly') and pk=='a' and (a[:-2]==b or a[:-2].endswith('i') and a[:-3]+'y'==b or a[:-2]+'e'==b):label='remove -ly';kind='remove'
 if not label:
  if len(b)<len(a)-1 or len(os.path.commonprefix([a,b]))<max(3,min(len(a),len(b))*.5):return
  direct=[s for s in suffixes if any(st+s==b for st in variants(a))]
  candidates=direct or [s for s in suffixes if b.endswith(s) and not a.endswith(s)]
  if not candidates:return
  label='-'+candidates[0];kind='suffix'
 key=(a,b,label,kind)
 if key in seen:return
 seen.add(key);related.setdefault(a,[]).append([b,types[pk],label,kind,b in people])
for k,offset,sym,to,pk,si,ti in pointers:
 left=nodes.get((k,offset),[]);right=nodes.get((pk,to),[])
 if not(0<=si<len(left) and 0<=ti<len(right)):continue
 a,b=left[si],right[ti];add(a,b,pk);add(b,a,k)
data['related']=related;data['pos']={w:''.join(sorted(p)) for w,p in pos.items()};data['people']=sorted(people);data['wordnet']={'version':'3.0','source':'https://github.com/nltk/nltk_data/blob/gh-pages/packages/corpora/wordnet.zip','relations':len(seen),'license':'LICENSE-WORDNET.txt'}
raw=json.dumps(data,separators=(',',':')).encode();(dest/'lexicon.json').write_bytes(raw);(dest/'lexicon.json.gz').write_bytes(gzip.compress(raw,mtime=0));(dest/'LICENSE-WORDNET.txt').write_text('\n'.join(line.rstrip() for line in z.read('wordnet/LICENSE').decode().splitlines())+'\n')
print('Added',len(seen),'WordNet joins for',len(related),'source words;',len(pos),'POS entries;',len(gzip.compress(raw,mtime=0)),'gzipped bytes.')
print('generous',related.get('generous'));print('fear',related.get('fear'))
