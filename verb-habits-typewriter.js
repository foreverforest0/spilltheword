/* A single mixed drill per level. Each row gives a context, a printed stem and valid completions. */
(()=>{
 const b1=[
  ['It happens again and again.','I keep','bump into an old friend','bumping into an old friend','keep doing'],
  ['A decision about your weekend.','She decided','stay in','to stay in','decide to do'],
  ['A visit next weekend.','We’re looking forward to','see you','seeing you','look forward to doing'],
  ['It’s her favourite free-time activity.','She enjoys','make short films','making short films','enjoy doing'],
  ['The script was ready at six.','We finished','write the script','writing the script','finish doing'],
  ['I said I would help.','I promised','help after work','to help after work','promise to do'],
  ['The tickets were too expensive.','They couldn’t afford','buy the tickets','to buy the tickets','afford to do'],
  ['The first drops fell.','It started','rain','raining|to rain','start doing / to do'],
  ['She stopped drinking it last year.','She gave up','drink coffee','drinking coffee','give up doing'],
  ['They worked hard and succeeded.','They managed','meet the deadline','to meet the deadline','manage to do'],
  ['A polite request about the window.','Would you mind','open the window','opening the window','mind doing'],
  ['It’s on his list for tomorrow.','He plans','apply for a job','to apply for a job','plan to do']
 ];
 const b2=[
  ['The door wouldn’t move. It was an attempt.','I tried','open the door','to open the door','try to do · attempt'],
  ['The room was stuffy. Opening a window was one possible solution.','I tried','open the window','opening the window','try doing · test a solution'],
  ['He quit the habit.','He stopped','check his phone in meetings','checking his phone in meetings','stop doing · quit'],
  ['She paused her walk because she wanted to call.','She stopped','call her friend','to call her friend','stop to do · pause for a purpose'],
  ['I can still picture the moment.','I remember','say it out loud','saying it out loud','remember doing · memory'],
  ['This is a task for tomorrow.','Remember','call the dentist','to call the dentist','remember to do · task'],
  ['The message stayed in my drafts.','I forgot','send the message','to send the message','forget to do · missed task'],
  ['That first concert is a lasting memory.','I’ll never forget','see my favourite band','seeing my favourite band','never forget doing · memory'],
  ['I said it and now I’m sorry.','I regret','say it out loud','saying it out loud|having said it out loud','regret doing · past action'],
  ['Write the opening of a formal rejection.','We regret','inform you that your application was unsuccessful','to inform you that your application was unsuccessful','regret to do · formal announcement'],
  ['After his introduction, he started a different task.','He went on','explain the evidence','to explain the evidence','go on to do · a new action'],
  ['She continued with the same story.','She went on','talk about the trip','talking about the trip','go on doing · same action'],
  ['This is a consequence of accepting the shift.','Taking the shift means','work late','working late','mean doing · consequence'],
  ['This was my intention.','I meant','call you','to call you','mean to do · intention'],
  ['The advice was addressed to us.','They advised us','wait outside','to wait outside','advise someone to do'],
  ['The advice was for people in general.','They advised','wait outside','waiting outside','advise doing'],
  ['The coach required us to wait. Use the active.','They made us','wait outside','wait outside','make someone do'],
  ['Keep the same situation. Use the passive.','We were made','wait outside','to wait outside','be made to do'],
  ['This is familiar to me now.','I’m used to','work late','working late','be used to doing'],
  ['The documents are still unsigned. Use the shorter pattern.','These documents need','sign','signing','need doing · passive meaning'],
  ['Give the same meaning with a passive infinitive.','These documents need','be signed','to be signed','need to be done'],
  ['Visitors can take photos. Name the people.','They allow visitors','take photos','to take photos','allow someone to do'],
  ['Either completion can work.','She helped me','carry the boxes','carry the boxes|to carry the boxes','help someone (to) do'],
  ['Nothing prevented us from leaving.','They let us','leave early','leave early','let someone do'],
  ['I saw the whole action from start to finish.','I saw him','cross the road','cross the road','see someone do · whole action'],
  ['I saw him while the action was in progress.','I saw him','cross the road','crossing the road','see someone doing · in progress'],
  ['She thinks the shortlist has already been published.','The shortlist seems','be published','to have been published','seem to have been done'],
  ['They may already have lost touch. Use a perfect infinitive.','They seem','drift apart','to have drifted apart','seem to have done'],
  ['Their friendship is changing at the moment.','They seem','drift apart','to be drifting apart','seem to be doing'],
  ['Other people interrupt me and I dislike it.','I dislike','be interrupted','being interrupted','dislike being done'],
  ['The conversation is already over. Use a perfect gerund.','She denied','say it out loud','having said it out loud','deny having done']
 ];
 for(const [level,rows] of [['b1',b1],['b2',b2]]){
  const id='verb_habits_'+level,title='Typewriter: Verb habits';
  TYD[id]={title,modes:[['all','Mixed forms']],hideModes:true,multilineAnswers:true,notes:true,
   limit:rows.length,ordered:true,
   pool(){
    // Put a broad mix in both phases. The second half keeps only the situation and the stem.
    const deck=shuffle(rows.slice());
    return deck.map(([context,stem,cue,forms,note],i)=>({
     p:context+'\n'+stem+' …'+(i<Math.ceil(deck.length/2)?' ('+cue+')':''),
     a:forms.split('|'),h:'Verb: '+cue,note,nl:true
    }));
   },
   fmt:it=>({t:it.p,nl:true}),
   help:'Finish the phrase. Press Enter.'
  };
  DMT[id]=1;DMTF[id]=()=>tyDrillStart(id);SPSHORT[id]=title;
  SPT.push({id,n:title,d:'Finish a mix of verb patterns on the typewriter.'});
  const group=SPGRP[level].find(([name])=>/· Gerund & infinitive$/i.test(name));
  group?.[1].push(id);SPLV.find(item=>item[0]===level)[2].push(id);
 }
})();
