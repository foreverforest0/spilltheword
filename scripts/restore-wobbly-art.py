"""Restore original artwork without redrawing; export padded transparent PNG assets.
Sources come from the repository's version before the rejected replacement.
Only edge-connected paper is made transparent; existing transparent cutouts keep
all original foreground pixels. The alternate smooth action series is excluded.
"""
from pathlib import Path
import subprocess,json,base64,io,re
import numpy as np
from scipy.ndimage import binary_propagation,binary_closing,binary_fill_holes
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/wobbly';OUT.mkdir(exist_ok=True,parents=True)
old=subprocess.check_output(['git','show','bcdf2f0:index.html'],cwd=ROOT,text=True)
current=(ROOT/'index.html').read_text();decoder=json.JSONDecoder()
def read(source,key):
 a=source.index('const '+key+'=')+len('const '+key+'=');v,n=decoder.raw_decode(source[a:]);return a,a+n,v
def replace(source,key,value):
 a,b,_=read(source,key);return source[:a]+json.dumps(value,ensure_ascii=False,separators=(',',':'))+source[b:]
_,_,pics=read(old,'PICS');_,_,actions=read(old,'ACTIONS')
manifest={'sourceCommit':'bcdf2f0','pictures':{},'actions':{},'omittedSecondaryActions':[]}
def export(src,key,kind):
 im=Image.open(io.BytesIO(base64.b64decode(src.split(',')[1]))).convert('RGBA');pixels=np.array(im);original=pixels.copy();h,w=pixels.shape[:2]
 # Already transparent source illustrations need no new silhouette mask.
 if pixels[:,:,3].min()==255 and not key.startswith('scene '):
  rgb=pixels[:,:,:3].astype(float);k=max(3,min(w,h)//25)
  corners=np.concatenate([rgb[:k,:k].reshape(-1,3),rgb[:k,-k:].reshape(-1,3),rgb[-k:,:k].reshape(-1,3),rgb[-k:,-k:].reshape(-1,3)])
  paper=np.median(corners,axis=0)
  # Process the light paper of the original illustration series, not photographs.
  if paper.min()>155 and paper[0]>=paper[2] and np.percentile(np.linalg.norm(corners-paper,axis=1),85)<48:
   candidate=np.linalg.norm(rgb-paper,axis=2)<32
   warm_skin=(rgb[:,:,0]-rgb[:,:,1]>paper[0]-paper[1]+6)&(rgb[:,:,0]-rgb[:,:,2]>paper[0]-paper[2]+10)&(rgb[:,:,0]>175)&(rgb[:,:,1]>130)
   candidate&=~warm_skin
   barrier=binary_fill_holes(binary_closing(~candidate,iterations=3));allowed=candidate&~barrier
   seed=np.zeros((h,w),bool);seed[0]=allowed[0];seed[-1]=allowed[-1];seed[:,0]=allowed[:,0];seed[:,-1]=allowed[:,-1]
   background=binary_propagation(seed,mask=allowed);pixels[background,3]=0
 # RGB values, pencil strokes and the existing partial alpha stay unchanged.
 assert np.array_equal(pixels[:,:,:3],original[:,:,:3])
 im=Image.fromarray(pixels);box=im.getbbox()
 if box:im=im.crop(box)
 margin=max(18,round(max(im.size)*.055));canvas=Image.new('RGBA',(im.width+margin*2,im.height+margin*2));canvas.paste(im,(margin,margin))
 filename=re.sub(r'[^a-z0-9]+','-',key.lower()).strip('-')+'.png';path=OUT/kind/filename;path.parent.mkdir(exist_ok=True);canvas.save(path,optimize=True)
 return path.relative_to(ROOT).as_posix()
# Restore all original primary illustrations replaced in the preceding change.
keys=list(json.loads((OUT/'manifest.json').read_text())['pictures'])
for key in keys:
 pics[key]=export(pics[key],key,'pictures');manifest['pictures'][key]=pics[key]
# These original action images are the irregular-pencil series, not the smooth
# alternate series (which includes the painting-a-wall reference).
primary={3:'He',4:'She',5:'She',6:'He',11:'She',12:'He',13:'He',14:'She',15:'He',17:'She',20:'She',21:'He',22:'She',23:'She',25:'He',26:'He',28:'She',29:'She',30:'He',31:'He',32:'He',33:'She',34:'She',35:'She'}
# Existing primary pictures supply the same activities for five smooth images.
substitutes={2:('rtn teeth','He'),7:('hab yoga','She'),8:('draw','She'),19:('hab guitar','She'),24:('sing','She')}
new=[]
for i,(name,src) in enumerate(actions):
 if i in substitutes:
  key,subject=substitutes[i];src=read(old,'PICS')[2][key]
 elif i in primary:subject=primary[i]
 else:manifest['omittedSecondaryActions'].append(name);continue
 if name=='brushing her teeth':name='brushing his teeth'
 filename=export(src,name,'actions');new.append([name,filename,subject]);manifest['actions'][name]={'src':filename,'subject':subject}
current=replace(current,'PICS',pics);current=replace(current,'ACTIONS',new)
# Restore the answer matching the original red glasses.
current=current.replace('Her glasses are black. She is happy.','Her glasses are red. She is happy.')
(ROOT/'index.html').write_text(current);(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print('Restored',len(keys),'primary pictures and',len(new),'original pencil-style actions; omitted',len(manifest['omittedSecondaryActions']),'smooth action pictures')
