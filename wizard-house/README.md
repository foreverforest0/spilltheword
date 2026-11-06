# The Midnight House — Kitchen

A static illustrated vocabulary game. The house map has nine planned rooms; the kitchen is playable.

## Entry points

- Home shelf → miniature **The Midnight House** (direct entry).
- Top navigation → **House**.
- Grammar Speaking → **Kids** → **Fun**, or **A1** → **Imperatives**.
- Direct: `wizard-house/index.html`.

## Room interface

The kitchen fills the play area. Tools sit on the worktop alongside the containers and ingredients. Interactive objects and selected background items show their English names on hover or keyboard focus; selected objects show their names on touch screens. One compact instruction note contains the task selector, hint, optional device text-to-speech, feedback and Next button. House, mode, undo and reset controls stay available above the room.

Mobile players can pan the room at a readable scale. Guided tasks pan towards the selected source and destination; dragging near an edge also pans horizontally. There are no side panels, external inventory, verb toolbar or visible notebook.

Choose a mode before entering:

- **Follow the instructions:** eight authored scenes with checks of the actual object interaction. Incorrect actions leave the scene unchanged. Select another task at any time, including during an animation.
- **Free experiment:** combine objects, create spills, move tools around the worktop, and hear/read the sentences describing the results.

Core words: **pour, spill, stir, strain, scoop out, rinse, wipe up, soak up**. Bonus interactions include adding ingredients, refilling the jug and dropping a cup. The word data retain reviewed definitions and forms for future expansion. The app checks performed actions; spoken language is assessed by the teacher.

## Visual physics

`physics.js` renders liquid separately from the painted objects:

- Moving vessels pivot around a grip point. Their streams originate at their painted lip or spout, then follow a gravity-driven arc into the receiving container.
- Water levels transfer continuously. In transparent vessels, polygon clipping keeps the free surface horizontal as the vessel tilts.
- Bowl surfaces use damped waves and angular motion. Stirring moves the spoon partly behind the front rim; floating berries circulate and retain motion briefly afterwards. Added sugar disperses and dissolves.
- Rinsing aligns the tool with the faucet stream; water deflects into the basin.
- Separate spills create separate puddles beneath the objects. Wiping removes water along the cloth’s path; a sponge absorbs the selected puddle towards its contact point.
- Source objects are hidden while being carried. Dropped cups fall, bounce briefly, change to a damaged painted state, and remain where they landed.

These are authored 2D interactions with visual dynamics; the room is not a general-purpose fluid or rigid-body simulator. Render resolution is capped, idle animation stops after waves settle, and reduced-motion settings shorten the sequences.

Undo restores the previous object state. Discovered words remain discovered and are saved locally. Free-play state is temporary; live-room synchronization and speech recognition are not included. Browser speech depends on installed voices.

## Art and planning

All assets use the approved original midnight-indigo, plum, moss, walnut, antique-gold, dusty-rose and parchment art direction. The wider vocabulary and room plan remain in `household-verbs.tsv` and `house-plan.json`; only the kitchen has implemented interactions.

Serve the repository with any static server. No build step, package installation, API key, camera or microphone is required.
