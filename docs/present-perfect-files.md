# Present Perfect — Story files

Entry: Grammar → B1 → Present Perfect → **Story files** (`ppfiles`). Free storytelling with keepsakes, alongside the existing Present Perfect drills.

Three original stories, each with eight objects:

1. **The roll nobody collected** — Porto: rail, museum and concert tickets, a market camera receipt, a developing receipt, a blank memo, a camera photograph and an old wedding photograph.
2. **A night under a dinosaur** — London: transport, museum sleepover and concert tickets, café and museum shop receipts, a blank memo, a museum photograph and a breakfast photograph.
3. **The voice on the old tape** — Bristol: rail, sound museum and concert tickets, repair café and record shop receipts, a blank memo, a repair photograph and a family photograph.

These are authored, plausible stories. All tickets, receipts and photographs are recreated educational keepsakes, not real transactions or verified biographical accounts. How to states this. Native ticket/receipt print gives dates, admissions, purchases and prices; no institution logos or real payment codes are used.

## Visual layout

The archive displays three stuffed paper folders, with physical objects peeking out. Opening one reveals an eight-object collage in the left folder and a **separate, large writing sheet to its right**, outside the folder. Tan, pale blue and burgundy folders follow the user's scrapbook reference and site palette. On tablets and phones the writing sheet follows the folder.

Documents contain only their original printed details, including dates and prices. No explanatory worksheet copy or grammar instructions are overlaid. Small memo sheets are blank. Each photograph has a single short handwritten caption. Story context and instructions are in How to.

## Interaction and storage

- Click an exposed object or its numbered index to pick it up. It enlarges within the left folder; the writing sheet stays available. Previous / Next and left/right arrows browse the objects. The × button or Escape puts the item back. A picked-up object can be clicked for a word cue; a separate hint button provides the same action. The hint appears outside the artifact.
- Native buttons support keyboard focus. The underlying collage becomes inert while an object is picked up; putting it back restores focus to that object. The writing area remains interactive at all times.
- Eight scraps suggest a narrative; they do not prescribe one. How to provides a brief premise and encourages inventing missing connections. Past Simple describes dated events, Present Perfect describes experiences and present results up to the file’s fixed AS OF date.
- No answer checker, score, model story or browser spellchecking. The writer has generous lined space, a word count and a 7,000-character limit.
- Independent drafts, selected index, inspection state and word disclosures persist in `S.ppStoryFiles`. Existing story IDs and draft values are preserved. Closing/reopening, switching files and reloading retain separate drafts through the site's save function. The interface does not promise successful disk persistence when browser storage is unavailable.
- The existing Copy link replay restores the folder, inspected object, hint and draft. The existing live snapshot captures SVG images and the current text. No shared-game or backend changes.

## Assets

- `assets/case-files/{porto,london,bristol}-papers.png`: three generated RGBA sheets, each with six scanned-style physical objects. Originals remain in the workspace generation directory. SVG viewports select each object directly from the unchanged source PNG; no resampling, re-generation or image edits are used for cropping.
- `assets/case-files/photographs.png`: existing six-frame analog-style photographic sheet, reused without changes. CSS selects each photo.
- `assets/case-files/paper-grain.svg`: existing local paper texture.
- `ch/fonts/special-elite.woff2`: typewriter metadata.
- `writing-room/fonts/LaBelleAurore.ttf`: handwritten photo captions and word cues.

All runtime assets are local. No iframe, external image request, additional library or dependency. `data-stw-plain` preserves straight editorial headings; all layout changes are scoped to this activity. Short CSS picking-up and hover motions respect reduced-motion preferences.

## Verification

`python scripts/check-present-perfect-files.py` uses Python Playwright and Chromium to verify the real B1 catalog, all 24 physical objects and their cues, plain artifact rendering, a writing field outside the folder and to its right on desktop, independent drafts across switching/reopening/reload, keyboard controls, a replay link in a clean context, the read-only live snapshot and SVG resources, 1440/768/390px layouts, reduced motion and return to Topics.

The live transport is reused; checks do not establish external Firestore availability.
