/* Only completed grammar verdicts travel with a shared writing-room session. */
(()=>{
 let replay=[];
 window.WritingRoomBridge={
  async exportChecks(){const frame=document.getElementById('writing-room-frame');if(!frame)return [];const start=performance.now();while(frame.contentWindow?.WritingRoom?.busy){if(performance.now()-start>16000)throw Error('Wait for the grammar check to finish, then copy the link.');await new Promise(r=>setTimeout(r,50))}const rows=frame.contentWindow?.WritingRoom?.exportChecks()||[];if(rows.length>100)throw Error('This writing session is too long. Open a fresh game before copying.');return rows},
  prepareReplay(rows){
   if(!Array.isArray(rows)||rows.length>100)throw Error('Invalid writing-room checks.');
   replay=rows.map(row=>{if(typeof row.text!=='string'||row.text.length>1200||!Array.isArray(row.issues)||row.issues.length>100||(row.error!==undefined&&(typeof row.error!=='string'||row.error.length>500)))throw Error('Invalid writing-room check.');return {text:row.text,error:row.error,issues:row.issues.map(issue=>{if(typeof issue.message!=='string'||issue.message.length>3000||!Number.isInteger(issue.offset)||issue.offset<0||!Number.isInteger(issue.length)||issue.length<0)throw Error('Invalid writing-room issue.');return {message:issue.message,offset:issue.offset,length:issue.length}})}});
  },
  replayChecks(){const rows=replay;replay=[];return rows}
 };
 window.addEventListener('message',event=>{
  const frame=document.getElementById('writing-room-frame');if(!frame||event.origin!==location.origin||event.source!==frame.contentWindow)return;
  if(event.data?.type==='writing-room-height'){const height=Number(event.data.height);if(Number.isFinite(height))frame.style.height=Math.min(3000,Math.max(600,height))+'px'}
  if(event.data?.type==='writing-room-focus-source'){
   const source=frame.contentDocument?.getElementById('wr-source');if(!source||frame.contentWindow.WritingRoom?.state.view!=='writing')return;
   const top=scrollY+frame.getBoundingClientRect().top+source.getBoundingClientRect().top-innerHeight*.32;
   window.scrollTo({top:Math.max(0,top),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
 });
 document.addEventListener('stw:shared-restored',()=>{const game=document.getElementById('writing-room-frame')?.contentWindow?.WritingRoom;if(game?.state.view==='writing')game.revealSource()});
})();
