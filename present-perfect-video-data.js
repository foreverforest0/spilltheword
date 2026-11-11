/* Film-relative “now”: describe the completed change, not the production date. */
(() => {
  'use strict';
  const sourceRoot = 'https://github.com/rightonhana/blender-studios-hls/tree/f04f5f4df52914b3fef2ec91b1228d971c7d9bea/';
  const sources = {
    wing: {title:'Wing It!',year:2023,creator:'Blender Studio / Blender Foundation',director:'Rik Schutte',url:'https://studio.blender.org/projects/wing-it/',copy:sourceRoot+'wing-it',license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/'},
    dweebs: {title:'The Daily Dweebs',year:2017,creator:'Blender Animation Studio / Blender Foundation',director:'Hjalti Hjálmarsson',url:'https://studio.blender.org/projects/dailydweebs/',copy:sourceRoot+'the-daily-dweebs',license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/'}
  };
  const groups = [
    {id:'just',name:'What just happened?',aim:'Describe a completed action with just.'},
    {id:'already',name:'Already / not yet',aim:'Separate what is done from what is still unfinished.'},
    {id:'question',name:'Ask & answer',aim:'Build a yes/no question and give a short answer.'},
    {id:'change',name:'Before / after',aim:'Use the Present Perfect to explain a visible change.'}
  ];
  const tasks = [
    {id:'helmet',group:'just',source:'wing',title:'The visitor',start:25.1,end:28.5,alt:'An animated dog removes a helmet at a workshop entrance.',prompt:'Describe the dog’s completed action. Include just.',hint:'Main verb: take off. Use its past participle after has.',fields:['Your sentence'],models:[['The dog has just taken off the helmet.','The dog has just removed the helmet.']]},
    {id:'takeoff',group:'just',source:'wing',title:'Off the ground',start:82,end:92.2,alt:'A small flying machine leaves the workshop and rises into the sky.',prompt:'Say what the machine has just done.',hint:'Main verb: take off. Keep the particle after the past participle.',fields:['Your sentence'],models:[['The machine has just taken off.','The flying machine has just left the workshop.']]},
    {id:'bowl',group:'already',source:'dweebs',title:'Breakfast is coming',start:8.1,end:10.9,alt:'An owner fills a dog’s bowl while the dog waits beside it.',prompt:'The plan: fill the bowl, then let the dog eat. At the end of this clip, what is already done? What is not done yet?',hint:'Useful verbs: fill / eat. The owner and the dog are singular subjects.',fields:['Already','Not yet'],models:[['The owner has already filled the bowl.','The owner has already put food in the bowl.'],['The dog has not eaten the food yet.','The dog has not started eating yet.']]},
    {id:'checklist',group:'already',source:'wing',title:'One more check',start:29.4,end:31.8,alt:'An inventor ticks a checklist; some boxes are still empty.',prompt:'The goal is to complete every check. Describe what is already done and what is not finished yet.',hint:'Useful verbs: tick / finish. Look at both the marked and empty boxes.',fields:['Already','Not yet'],models:[['The inventor has already ticked some boxes.','The inventor has already completed some checks.'],['The inventor has not finished the checklist yet.','The inventor has not completed all the checks yet.']]},
    {id:'meal',group:'question',source:'dweebs',title:'The little bowl',start:11.3,end:14.5,alt:'A dog quickly eats the food and leaves the bowl empty.',prompt:'The dog’s meal: finished? Write a yes/no question, then answer briefly.',hint:'Useful verb: eat. Put the auxiliary before the subject in the question.',fields:['Your question','Short answer'],models:[['Has the dog eaten all the food?','Has the dog finished the food?'],['Yes, it has.']]},
    {id:'engine',group:'question',source:'wing',title:'The green lever',start:16.2,end:21.9,alt:'An inventor moves a lever; the flying machine starts up inside the workshop.',prompt:'Engine / start. Ask a yes/no question about the result, then give a short answer.',hint:'Start is regular. Repeat the question’s auxiliary in your short answer.',fields:['Your question','Short answer'],models:[['Has the engine started?','Has the machine started?'],['Yes, it has.']]},
    {id:'goggles',group:'change',source:'wing',title:'A new view',start:13.4,end:16.3,alt:'An inventor lifts the goggles from the eyes to the forehead.',prompt:'Compare the first and last frames. Describe the change with the Present Perfect.',hint:'Useful verbs: lift / push up. Goggles is a plural noun; the inventor is the subject.',fields:['What has changed?'],models:[['The inventor has lifted the goggles.','The inventor has pushed the goggles up.']]},
    {id:'gone',group:'change',source:'dweebs',title:'An empty stage',start:46,end:51.7,alt:'A dog and a chicken run out of the picture, leaving the deck empty.',prompt:'Who was here at the start? Say what has changed now.',hint:'Two animals: use have. The past participle of run is run.',fields:['What has changed?'],models:[['The dog and the chicken have run away.','Both animals have left the picture.']]}
  ];
  window.PresentPerfectVideoData = {sources,groups,tasks};
})();
