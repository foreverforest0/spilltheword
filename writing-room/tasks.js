/* Modern vocabulary in a Shakespeare writing-room setting. Hints are not answer keys. */
window.BardTasks={
 b1:[
  {source:'He was scared, but he opened the door.',detail:'Before opening the door, he takes a deep breath.',words:[['nervous','Worried or a little frightened.'],['take a deep breath','Breathe in slowly and deeply.'],['finally','After a wait or a difficulty.']]},
  {source:'She was happy because her friend came.',detail:'She did not expect to see her friend.',words:[['delighted','Very pleased.'],['unexpected','Something you did not think would happen.'],['arrive','Reach a place.']]},
  {source:'He wanted to help, but he was tired.',detail:'He decides to stay until the work is finished.',words:[['exhausted','Very tired.'],['decide','Choose what to do.'],['until','Up to the time when something happens.']]}
 ],
 b2:[
  {source:'He was scared, but he opened the door.',detail:'He hears a strange noise inside the room.',words:[['hesitate','Pause because you are unsure.'],['anxious','Worried about what may happen.'],['gather the courage','Become brave enough to do something.']]},
  {source:'She did not agree with his plan, but she helped him.',detail:'She wants to protect their friendship.',words:[['reluctant','Not willing or eager to do something.'],['support','Help someone or show that you are on their side.'],['despite','Used to introduce something that does not prevent an action.']]},
  {source:'He wanted to be king, so he lied to his friend.',detail:'He feels guilty immediately afterwards.',words:[['ambition','A strong wish to achieve something.'],['betray','Break someone’s trust.'],['regret','Feel sorry about something you did.']]}
 ],
 c1:[
  {source:'He was scared, but he opened the door.',detail:'His friend is watching. He wants to hide his fear.',words:[['conceal','Keep something hidden.'],['apprehension','Anxiety about something that may happen.'],['maintain his composure','Remain outwardly calm and in control.']]},
  {source:'She was angry, but she spoke politely.',detail:'She does not want the other guests to notice.',words:[['resentment','Bitterness about something you consider unfair.'],['restrain','Keep a feeling or action under control.'],['outwardly','In the way someone appears to other people.']]},
  {source:'He said he would help, but he wanted something in return.',detail:'His generous offer makes her suspicious.',words:[['ulterior motive','A hidden reason for doing something.'],['seemingly','Appearing to be true, although it may not be.'],['arouse suspicion','Make someone think that something may be wrong.']]}
 ]
};
/* Short, swappable details give a concrete action, feeling or reason to weave in. */
{
 const choices={
  b1:[
   [['Add an action','He takes a deep breath first.'],['Add an emotion','His hands are shaking.'],['Add a reason','He wants to help someone inside.']],
   [['Add a surprise','She did not expect her friend to arrive.'],['Add an action','She runs to the door to greet her friend.'],['Add an emotion','She cannot stop smiling.']],
   [['Add a decision','He stays until the work is finished.'],['Add an action','He rubs his tired eyes.'],['Add a reason','His friend needs his help.']]
  ],
  b2:[
   [['Add a sound','He hears a strange noise inside.'],['Add an emotion','He tries to hide his fear.'],['Add a reason','Someone inside may need help.']],
   [['Add a reason','She wants to protect their friendship.'],['Add an action','She sighs before agreeing to help.'],['Add a promise','She has promised to support him.']],
   [['Add an emotion','He feels guilty immediately afterwards.'],['Add a reaction','His friend believes every word.'],['Add a setting','Nobody else hears the conversation.']]
  ],
  c1:[
   [['Add an audience','His friend is watching. He hides his fear.'],['Add a hesitation','He pauses with his hand on the door.'],['Add a contrast','He looks calm despite his racing heart.']],
   [['Add an audience','Other guests are listening.'],['Add an action','She keeps smiling as she speaks.'],['Add a motive','She wants to avoid a public argument.']],
   [['Add a reaction','His offer makes her suspicious.'],['Add a question','She asks what he expects in return.'],['Add an evasion','He avoids explaining why he is helping.']]
  ]
 };
 for(const [level,rows] of Object.entries(choices))rows.forEach((row,i)=>BardTasks[level][i].details=row.map(([kind,text])=>({kind,text})));
}
