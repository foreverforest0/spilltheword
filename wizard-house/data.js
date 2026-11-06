'use strict';
const KITCHEN_VERBS=[
 {id:'pour',word:'pour',ru:'налить',definition:'Move liquid in a steady stream into another container.',forms:'pour · poured · poured',instruction:'Pour some water from the jug into the mixing bowl.',source:'jug',target:'bowl',example:'I poured some water into the bowl.',hint:'Pick up the jug, then choose the mixing bowl.',setup:'empty'},
 {id:'spill',word:'spill',ru:'пролить',definition:'Let liquid escape from its container onto a surface.',forms:'spill · spilled/spilt · spilled/spilt',instruction:'Spill a little water onto the worktop.',source:'jug',target:'counter',example:'I spilled some water on the worktop.',hint:'Pick up the jug, then choose the empty worktop.',setup:'empty'},
 {id:'stir',word:'stir',ru:'размешать',definition:'Move a spoon around in a liquid or mixture.',forms:'stir · stirred · stirred',instruction:'Stir the sugar into the water in the mixing bowl.',source:'spoon',target:'bowl',example:'I stirred the sugar into the water.',hint:'Pick up the wooden spoon, then choose the mixing bowl.',setup:'sugar'},
 {id:'strain',word:'strain',ru:'процедить',definition:'Pass a liquid through a sieve to separate out solid pieces.',forms:'strain · strained · strained',instruction:'Strain the berry mixture into the clean bowl.',source:'bowl',target:'bowl2',example:'I strained the mixture. The berries stayed in the sieve.',hint:'Pick up the mixing bowl, then choose the clean bowl. The sieve will catch the berries.',setup:'berries'},
 {id:'scoop',word:'scoop out',ru:'достать ложкой; вычерпать',definition:'Lift something out with a scoop or spoon.',forms:'scoop out · scooped out · scooped out',instruction:'Scoop a berry out of the mixing bowl.',source:'scoop',target:'bowl',example:'I scooped a berry out of the bowl.',hint:'Pick up the scoop, then choose the berry mixture.',setup:'berries'},
 {id:'rinse',word:'rinse',ru:'ополоснуть',definition:'Wash away soap or remaining dirt with clean water.',forms:'rinse · rinsed · rinsed',instruction:'Rinse the dirty wooden spoon in the sink.',source:'spoon',target:'sink',example:'I rinsed the spoon with clean water.',hint:'Pick up the wooden spoon, then choose the sink.',setup:'dirty'},
 {id:'wipe',word:'wipe up',ru:'вытереть пролитое',definition:'Remove spilled liquid by wiping it with a cloth.',forms:'wipe up · wiped up · wiped up',instruction:'Wipe up the spilled water with the cloth.',source:'cloth',target:'puddle',example:'I wiped up the spilled water.',hint:'Pick up the pink cloth, then choose the puddle.',setup:'puddle'},
 {id:'soak',word:'soak up',ru:'впитать',definition:'Take liquid into an absorbent material, such as a sponge.',forms:'soak up · soaked up · soaked up',instruction:'Use the sponge to soak up the spilled water.',source:'sponge',target:'puddle',example:'The sponge soaked up the water.',hint:'Pick up the green sponge, then choose the puddle.',setup:'puddle'}
];
const KITCHEN_OBJECTS={
 jug:{name:'Water jug',file:'jug',x:5.5,y:64,w:11,h:24},glass:{name:'Glass',file:'glass',x:19,y:72,w:6.4,h:17},bowl:{name:'Mixing bowl',file:'bowl',x:32,y:69,w:17,h:20},bowl2:{name:'Clean bowl',file:'bowl',x:56,y:71,w:15,h:18},cup:{name:'Cup',file:'cup',x:72,y:73,w:8,h:16},
 sugar:{name:'Sugar',file:'sugar',x:40,y:34,w:6,h:13},berries:{name:'Berries',file:'berries',x:49,y:34,w:6,h:13},
 spoon:{name:'Wooden spoon',file:'spoon',x:24,y:60,w:7,h:16},sieve:{name:'Sieve',file:'sieve',x:49,y:59,w:9,h:15},scoop:{name:'Scoop',file:'scoop',x:64,y:58,w:8,h:15},cloth:{name:'Cloth',file:'cloth',x:4,y:85,w:12,h:9},sponge:{name:'Sponge',file:'sponge',x:82,y:80,w:7,h:10}
};
const HOUSE_ROOMS=[
 {id:'workshop',name:'Workshop',x:4,y:22,w:29,h:21,words:'mend · stick · peel off'},
 {id:'bedroom',name:'Bedroom',x:35,y:22,w:29,h:21,words:'fold · tuck in · put away'},
 {id:'bathroom',name:'Bathroom',x:67,y:22,w:29,h:21,words:'wash · rinse · drain'},
 {id:'kitchen',name:'Kitchen',x:4,y:44,w:29,h:20,words:'pour · stir · strain',open:true},
 {id:'dining',name:'Dining room',x:35,y:44,w:29,h:20,words:'serve · pass · clear'},
 {id:'laundry',name:'Laundry room',x:67,y:44,w:29,h:20,words:'soak · wring out · iron'},
 {id:'living',name:'Library & living room',x:4,y:65,w:29,h:26,words:'dust · sweep · polish'},
 {id:'potions',name:'Potion room',x:35,y:65,w:29,h:26,words:'fish out · dissolve · fizz'},
 {id:'greenhouse',name:'Greenhouse',x:67,y:65,w:29,h:26,words:'water · repot · prune'}
];
