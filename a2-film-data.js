/* Each task pairs a short question with a model answer. */
window.A2FilmData=(()=>{
 const ids={
  coffee:['Coffee Run','coffee-run'],
  spring:['Spring','spring_blenderopenmovie'],
  llama:['Caminandes 3: Llamigos','CaminandesLlamigos'],
  agent:['Agent 327: Operation Barbershop','agent-327-operation-barbershop'],
  tears:['Tears of Steel','Tears-of-Steel'],
  charge:['Charge','charge-blender-open-movie-1608p']
 };
 const films=Object.fromEntries(Object.entries(ids).map(([key,[title,id]])=>[
  key,{title,archive:'https://archive.org/details/'+id}
 ]));
 const clips=Object.fromEntries([
  'coffee-cafe','spring-walk','spring-forest','llama-ice',
  'llama-train','llama-berries','agent-shop','tears-bridge','charge-battery'
 ].map(key=>[key,{film:key.split('-')[0],src:'assets/a2-film/'+key+'.mp4'}]));
 const topics=[
  [1,'Present Simple',[
   ['llama-train','Does the train stop?','No, it doesn’t.'],
   ['spring-walk','What does the girl carry?','She carries a long stick.'],
   ['agent-shop','Where does the man go?','He goes into a barbershop.']
  ]],
  [2,'To be',[
   ['agent-shop','Where are the red chairs?','They are in the barbershop.'],
   ['spring-forest','Is the forest dark?','Yes, it is.'],
   ['llama-berries','What colour are the berries?','They are red.']
  ]],
  [3,'Present Continuous',[
   ['spring-walk','What is the girl doing?','She is walking with a dog.'],
   ['tears-bridge','What are the two people doing?','They are talking.'],
   ['charge-battery','What is the man doing with his hands?','He is holding a battery.']
  ]],
  [4,'Present Simple or Present Continuous?',[
   ['spring-walk','Complete with walk. She usually ___ alone. Right now she ___ with her dog.','She usually walks alone. Right now she is walking with her dog.'],
   ['agent-shop','Complete with go. He often ___ past the shop. Now he ___ inside.','He often goes past the shop. Now he is going inside.'],
   ['llama-train','Complete with pass. A train ___ here every day. Look! One ___ now.','A train passes here every day. Look! One is passing now.']
  ]],
  [5,'Word order',[
   ['tears-bridge','Put in order. are / where / they / standing / ?','Where are they standing?'],
   ['llama-train','Put in order. go / did / the train / past / ?','Did the train go past?'],
   ['agent-shop','Put in order. the chairs / what colour / are / ?','What colour are the chairs?']
  ]],
  [6,'Past Simple',[
   ['agent-shop','Did the man go into the shop?','Yes, he did.'],
   ['llama-train','What went past the llama?','A train went past the llama.'],
   ['tears-bridge','Listen. What part of her body did she mention?','She mentioned her hand.']
  ]],
  [7,'Past Continuous',[
   ['coffee-cafe','What were people doing at the tables?','They were sitting at the tables.'],
   ['spring-forest','Where was the girl walking?','She was walking through the forest.'],
   ['llama-ice','What was the llama doing at the end of the clip?','It was lying on the ice.']
  ]],
  [8,'Past Simple or Past Continuous?',[
   ['llama-train','Use look and go. The llama ___ at the tracks when the train ___ past.','The llama was looking at the tracks when the train went past.'],
   ['agent-shop','Use shine and walk. The lights ___ when the man ___ in.','The lights were shining when the man walked in.'],
   ['spring-walk','Use walk and notice. The dog ___ with the girl when it ___ a stick.','The dog was walking with the girl when it noticed a stick.']
  ]],
  [9,'Modals',[
   ['llama-ice','The ice is slippery. Give the llama advice with should.','You should walk slowly.'],
   ['llama-train','A train is coming. Make a rule with mustn’t.','You mustn’t cross the tracks.'],
   ['spring-forest','What can you see in the forest?','I can see a girl with a stick.']
  ]],
  [10,'Used to',[
   ['coffee-cafe','They went to this café every week. Say it with used to.','They used to go to this café every week.'],
   ['agent-shop','He never went to this shop before. Use didn’t use to.','He didn’t use to go to this shop.'],
   ['coffee-cafe','Ask about an old habit. Use they / meet here after work.','Did they use to meet here after work?']
  ]],
  [11,'Infinitive or gerund?',[
   ['spring-walk','Complete with walk. She enjoys ___ with her dog.','She enjoys walking with her dog.'],
   ['llama-berries','Complete with eat. The penguin wants ___ the berries.','The penguin wants to eat the berries.'],
   ['agent-shop','Complete with go. The man decides ___ inside.','The man decides to go inside.']
  ]],
  [12,'Present Perfect',[
   ['agent-shop','At the end, has the man come in yet?','Yes, he has. He’s just come in.'],
   ['llama-train','At the end, has the train gone past yet?','Yes, it has. It’s just gone past.'],
   ['llama-berries','Ask the penguin about its experience. Use ever / eat these berries.','Have you ever eaten these berries?']
  ]],
  [13,'Comparatives and superlatives',[
   ['spring-walk','Who is taller, the girl or the dog?','The girl is taller than the dog.'],
   ['llama-train','Which is longer, the train or the llama?','The train is longer than the llama.'],
   ['agent-shop','Which part of the shop is the brightest?','The area near the window is the brightest.']
  ]]
 ];
 return {films,clips,topics};
})();
