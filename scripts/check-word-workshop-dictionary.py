"""Verify every authored word-family endpoint and permitted plural against Hunspell/SCOWL."""
from pathlib import Path
import ctypes,ctypes.util,json,hashlib,subprocess
root=Path(__file__).resolve().parents[1]
source=(root/'word-workshop-families.js').read_text();data=json.loads(source.split('window.WordWorkshopFamilies = ',1)[1].rstrip().rstrip(';'))
dic=Path('/usr/share/hunspell/en_US.dic');aff=dic.with_suffix('.aff')
lib=ctypes.CDLL(ctypes.util.find_library('hunspell-1.7'))
lib.Hunspell_create.argtypes=[ctypes.c_char_p,ctypes.c_char_p];lib.Hunspell_create.restype=ctypes.c_void_p
lib.Hunspell_spell.argtypes=[ctypes.c_void_p,ctypes.c_char_p];lib.Hunspell_spell.restype=ctypes.c_int
lib.Hunspell_destroy.argtypes=[ctypes.c_void_p]
h=lib.Hunspell_create(str(aff).encode(),str(dic).encode())
words=sorted({e[k] for e in data['edges'] for k in ['from','word']}|{w[:-1]+'ies' if w.endswith('y') and w[-2] not in 'aeiou' else w+'s' for w in data['countable']})
# Validate the actual comparison spellings used by the formation planner too.
comparisons=json.loads(subprocess.check_output(['node','-e',"global.window=global;global.nlp={world:()=>({model:{one:{lexicon:{}}}})};require('./word-workshop-families.js');require('./word-workshop-forms.js');const words=[...new Set(WordWorkshopFamilies.edges.filter(e=>e.type==='adjective').map(e=>e.word))];console.log(JSON.stringify(words.filter(w=>WordWorkshopForms.canCompare(w)).flatMap(w=>{const f=WordWorkshopForms.analyse(w,'adjective').forms;return [...f.comparative,...f.superlative].flatMap(x=>x.split(' '))})))"],cwd=root,text=True))
words=sorted(set(words)|set(comparisons))
checked=[{'word':w,'accepted':bool(lib.Hunspell_spell(h,w.encode()))} for w in words];lib.Hunspell_destroy(h)
failed=[r['word'] for r in checked if not r['accepted']]
report={'dictionary':'Hunspell en_US / SCOWL','dictionary_sha256':hashlib.sha256(dic.read_bytes()).hexdigest(),'source':'https://github.com/wooorm/dictionaries/tree/main/dictionaries/en','checked_on':'2026-11-12','edges':len(data['edges']),'words':checked,'notes':'Spelling attestation includes authored endpoints and permitted count-noun plurals. Comparison spellings are checked too. POS, semantic directions and affix segmentation are curated. Unlisted custom words are not claimed to be dictionary checked.'}
(root/'docs/word-workshop-dictionary-check.json').write_text(json.dumps(report,indent=2)+'\n')
assert not failed, failed
print('PASS:',len(words),'dictionary-attested spellings;',len(data['edges']),'curated joins.')
