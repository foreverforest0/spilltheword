# The Midnight House — first playable room: Kitchen

A static illustrated vocabulary activity. No build step, API key, account, camera, or microphone is needed.

## Entry points

- Home shelf → miniature **The Midnight House** (direct entry, no preview card).
- Top navigation → **House**.
- Grammar Speaking → **Kids** → **Fun** → The Midnight House: kitchen.
- Grammar Speaking → **A1** → **Imperatives** → The Midnight House: kitchen.
- Direct: `wizard-house/index.html`.

The house illustration shows the agreed nine-room plan. Only the kitchen is playable in this first version; the other rooms are marked as planned and have no fake activities.

## Modes

Choose a mode before entering:

- **Follow the instructions:** eight prepared scenes with automatic checks of the actual object interaction. An incorrect action does not change the scene. The experiment selector and navigation remain available during animations. Hints, optional device text-to-speech and Russian meanings are included.
- **Free experiment:** combine objects, observe consequences, and read/say the resulting sentences. This mode does not grade the learner’s spoken English.

Core vocabulary: **pour, spill, stir, strain, scoop out, rinse, wipe up, soak up**. Word cards include short paraphrased definitions, verb forms and contextual examples. Meanings were reviewed against Open English WordNet during preparation of the larger household-verb bank.

## Interaction and state

Drag an object onto a destination, or tap/click the object and then the destination. Mobile screens also have explicit destination buttons. Keyboard users can activate source and destination buttons with Enter/Space.

- Pouring transfers a unit of water and checks capacity.
- Spilling creates a puddle and uses water from the jug.
- Stirring mixes the contents and dissolves added sugar.
- Straining transfers liquid to an empty receiving bowl and leaves berries in the sieve.
- Scooping moves a berry from one bowl to the other without transferring all the liquid.
- Rinsing uses the sink and clears the relevant tool/container state.
- Wiping removes a puddle with a cloth; soaking up removes it with a sponge. These have distinct animations and wet-tool states. Both the puddle and its surrounding worktop are accepted as cleanup destinations.
- Bonus free interactions: add sugar/berries, refill the jug, and drop a cup to change it from intact to cracked to broken.

The model is a set of authored interactions, not a fluid-physics engine. Water counters are local illustrative units. Reset restores the current scene. Undo restores the last completed object state. Discovered words remain discovered after undo and are saved locally; scene/history state is temporary. There is no live-room synchronization.

The wider room/vocabulary plan is retained in `house-plan.json` and `household-verbs.tsv`. Those planning files do not represent additional playable rooms or completed reviews of newly proposed household collocations.

## Art

Original generated assets use the agreed seven-color direction: midnight indigo `#191B32`, plum `#33283E`, moss `#4D5A40`, walnut `#785444`, antique gold `#C49A52`, dusty rose `#BC7F87`, parchment `#E4D0AA`. The kitchen and its separate transparent props share the same original storybook art direction as the house concept. Water, trails, particles and motion are drawn/animated in the browser. Glass and liquid are separate layers; the cup and cloth use alternate painted states.

## Validation

Checked all eight guided actions, rejection of incorrect actions, prerequisites, straining/berry retention, undo, cup states, pointer dragging, all eight tasks on a touch screen, keyboard access, animated pouring, cancellation during pouring/stirring/rinsing, mobile layout, and host entry points. Device speech availability depends on the browser and installed voices.
