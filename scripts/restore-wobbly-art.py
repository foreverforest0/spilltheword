"""Restore original artwork without redrawing; export padded transparent PNG assets.
Sources come from the earliest complete repository illustrations.
Whole silhouettes preserve pale foreground instead of colour-keying it away.
The alternate smooth action series is excluded.
"""
from pathlib import Path
import subprocess,json,base64,io,re
import numpy as np
from scipy.ndimage import binary_closing,binary_fill_holes,binary_dilation,label
from PIL import Image,ImageDraw
from scipy.spatial import ConvexHull
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/wobbly';OUT.mkdir(exist_ok=True,parents=True)
old=subprocess.check_output(['git','show','b5eea8f:index.html'],cwd=ROOT,text=True)
current=(ROOT/'index.html').read_text();decoder=json.JSONDecoder()
def read(source,key):
 a=source.index('const '+key+'=')+len('const '+key+'=');v,n=decoder.raw_decode(source[a:]);return a,a+n,v
def replace(source,key,value):
 a,b,_=read(source,key);return source[:a]+json.dumps(value,ensure_ascii=False,separators=(',',':'))+source[b:]
_,_,source_pics=read(old,'PICS');_,_,pics=read(current,'PICS')
action_source=subprocess.check_output(['git','show','8dd6c2c:index.html'],cwd=ROOT,text=True)
_,_,actions=read(action_source,'ACTIONS')
manifest={'sourceCommit':'b5eea8f','actionSourceCommit':'8dd6c2c','maskVersion':'whole-silhouettes-v2','pictures':{},'actions':{},'omittedSecondaryActions':[]}
def export(src,key,kind):
 im=Image.open(io.BytesIO(base64.b64decode(src.split(',')[1]))).convert('RGBA');pixels=np.array(im);original=pixels.copy();h,w=pixels.shape[:2]
 # The earliest originals retain complete clothing and skin. Later cutouts
 # already have missing pixels, so their alpha must never be reused.
 if not key.startswith('scene ') and (pixels[:,:,3]==0).mean()<.05:
  rgb=pixels[:,:,:3].astype(float);k=max(3,min(w,h)//25)
  corners=np.concatenate([rgb[:k,:k].reshape(-1,3),rgb[:k,-k:].reshape(-1,3),rgb[-k:,:k].reshape(-1,3),rgb[-k:,-k:].reshape(-1,3)])
  paper=np.median(corners,axis=0)
  if paper.min()>155 and np.percentile(np.linalg.norm(corners-paper,axis=1),85)<48:
   marks=np.linalg.norm(rgb-paper,axis=2)>20
   marks=binary_closing(marks,iterations=3)
   components,count=label(marks);sizes=np.bincount(components.ravel())
   keep=sizes>=max(24,w*h*.00015);keep[0]=False;marks=keep[components]
   silhouette=binary_fill_holes(marks)
   if key.startswith('be ') or key in ['rice','popcorn','milk','cheese']:
    # Pale necks and shirts resemble paper. Infer the two outer silhouette
    # boundaries between drawn rows instead of treating pale fill as a hole.
    rows=np.flatnonzero(marks.any(axis=1));left=np.argmax(marks[rows],axis=1);right=w-1-np.argmax(marks[rows,::-1],axis=1)
    if len(rows)>1:
     ys=np.arange(rows[0],rows[-1]+1);lo=np.interp(ys,rows,left);hi=np.interp(ys,rows,right)
     for y,l,r in zip(ys,lo,hi):silhouette[y,max(0,int(l)):min(w,int(r)+1)]=True
   # Cream jumpers have scarcely any contrast with the original paper. Their
   # outer pencil/dot marks enclose a solid garment, not separate blue islands.
   if key in ['be woman headband','be sad man','rice','popcorn','milk','cheese']:
    region=silhouette.copy()
    if key.startswith('be '):region[:round(h*.60)]=False
    yy,xx=np.where(region)
    if len(xx)>3:
     points=np.column_stack((xx,yy));hull=points[ConvexHull(points).vertices]
     fill=Image.new('1',(w,h));ImageDraw.Draw(fill).polygon([tuple(p) for p in hull],fill=1)
     silhouette|=np.array(fill,dtype=bool)
   silhouette=binary_dilation(binary_fill_holes(silhouette),iterations=1)
   pixels[:,:,3]=np.where(silhouette,original[:,:,3],0)
 # Original RGB and pencil strokes stay unchanged inside the new silhouette.
 assert np.array_equal(pixels[:,:,:3],original[:,:,:3])
 im=Image.fromarray(pixels);box=im.getbbox()
 if box:im=im.crop(box)
 margin=max(18,round(max(im.size)*.055));canvas=Image.new('RGBA',(im.width+margin*2,im.height+margin*2));canvas.paste(im,(margin,margin))
 filename=re.sub(r'[^a-z0-9]+','-',key.lower()).strip('-')+'-whole.png';path=OUT/kind/filename;path.parent.mkdir(exist_ok=True);canvas.save(path,optimize=True)
 return path.relative_to(ROOT).as_posix()
# Restore all original primary illustrations replaced in the preceding change.
keys=list(json.loads((OUT/'manifest.json').read_text())['pictures'])
for key in keys:
 pics[key]=export(source_pics[key],key,'pictures');manifest['pictures'][key]=pics[key]
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
