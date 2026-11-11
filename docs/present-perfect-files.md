# Present Perfect — Story files

Entry: Grammar → B1 → Present Perfect → **Story files** (`ppfiles`). Free storytelling with keepsakes, alongside the existing Present Perfect drills.

Three original stories, each with eight keepsakes and three loose objects:

1. **The roll nobody collected** — Porto: rail and concert tickets, a saved Anne Frank House ticket from Amsterdam, camera and developing receipts, a reminder about Beth’s keychain, and two photographs. Loose objects: headphones, a pocket notebook and a sweet wrapper.
2. **A night under a dinosaur** — London: transport and museum sleepover tickets, a saved LEGOLAND Windsor ticket, café and shop receipts, a reminder to post Mum’s postcard, and two photographs. Loose objects: sunglasses, a map and a mint tin.
3. **The voice on the old tape** — Bristol: rail and concert tickets, a saved Disneyland Paris ticket, repair and record shop receipts, a reminder to bring Dad’s headphones, and two photographs. Loose objects: a cassette, a green notebook and a tea packet.

These are authored, plausible stories. All tickets, receipts and photographs are recreated educational keepsakes, not real transactions or verified biographical accounts. How to states this. Native ticket/receipt print gives dates, admissions, purchases and prices; no institution logos or real payment codes are used.

## Visual layout

The archive displays three stuffed paper folders, with physical objects peeking out. Opening one reveals an eleven-piece collage in the left folder and a **separate, large writing sheet to its right**, outside the folder. Tan, pale blue and burgundy folders follow the user's scrapbook reference and site palette. On tablets and phones the writing sheet follows the folder.

Documents contain only their original printed details, including dates and prices. No explanatory worksheet copy or grammar instructions are overlaid. Small memo sheets carry short handwritten reminders; their text stays attached while they move. Familiar-attraction tickets have earlier dates and other cities, explicitly described in How to as keepsakes from earlier trips, rather than implying those attractions are in Porto or Bristol. Each photograph has a single short handwritten caption. Story context and instructions are in How to.

## Interaction and storage

- Click an exposed object or its numbered index to pick it up. It enlarges within the left folder; the writing sheet stays available. Previous / Next and left/right arrows browse the objects. The × button or Escape puts the item back. A picked-up object can be clicked for a word cue; a separate hint button provides the same action. The hint appears outside the artifact.
- Every ticket, receipt, photo, note and object can be dragged out of the folder across the full writing workspace with mouse or touch. A seven-pixel threshold distinguishes a drag from a click. Shift + arrow keys move the focused piece. Normalized centre coordinates and stacking order persist per story; resizing clamps pieces within the new workspace. Reset layout restores only positions, preserving text and hints. Pointer cancellation restores the previous arrangement.
- Native buttons support keyboard focus. The underlying collage becomes inert while an object is picked up; putting it back restores focus to that object. The writing area remains interactive at all times.
- Eight scraps suggest a narrative; they do not prescribe one. How to provides a brief premise and encourages inventing missing connections. Past Simple describes dated events, Present Perfect describes experiences and present results up to the file’s fixed AS OF date.
- No answer checker, score, model story or browser spellchecking. The writer has generous lined space, a word count and a 7,000-character limit.
- Independent drafts, selected index, inspection state, word disclosures and `layout` positions persist in `S.ppStoryFiles`. Existing story IDs and draft values are preserved. Closing/reopening, switching files and reloading retain separate drafts through the site's save function. The interface does not promise successful disk persistence when browser storage is unavailable.
- The existing Copy link replay restores the folder, inspected object, hint, draft and rearranged objects. During a drag, pointer capture transfers to the stable workspace so throttled event replay retains absolute positions. The existing live snapshot captures SVG images and the current text. No shared-game or backend changes.

## Assets

- `assets/case-files/{porto,london,bristol}-papers.png`: three generated RGBA sheets, each with six scanned-style physical objects. Originals remain in the workspace generation directory. SVG viewports select each object directly from the unchanged source PNG; no resampling, re-generation or image edits are used for cropping.
- `assets/case-files/{porto,london,bristol}-extras.png`: three generated 1254 × 1254 RGBA sheets. Each supplies one familiar-attraction souvenir ticket and three loose belongings. Unchanged source images, selected with SVG viewports.
- `assets/case-files/photographs.png`: existing six-frame analog-style photographic sheet, reused without changes. CSS selects each photo.
- `assets/case-files/paper-grain.svg`: existing local paper texture.
- `ch/fonts/special-elite.woff2`: typewriter metadata.
- `writing-room/fonts/LaBelleAurore.ttf`: handwritten photo captions, reminders and word cues.

All runtime assets are local. No iframe, external image request, additional library or dependency. `data-stw-plain` preserves straight editorial headings; all layout changes are scoped to this activity. Short CSS picking-up and hover motions respect reduced-motion preferences.

## Verification

`python scripts/check-present-perfect-files.py` uses Python Playwright and Chromium to verify the real B1 catalog, all 33 pieces and their cues, dragging every piece beyond the folder without opening it, persisted arrangements, keyboard movement, plain artifact rendering, a writing field outside the folder and to its right on desktop, independent drafts across switching/reopening/reload, keyboard controls, a replay link in a clean context, the read-only live snapshot and SVG resources, 1440/768/390px layouts, reduced motion and return to Topics.

`python scripts/check-present-perfect-files-touch.py` also checks native touch input in Chromium: finger dragging, touch cancellation, handwritten reminders, reset preserving the draft, and leaving the activity without observer errors.

The live transport is reused; checks do not establish external Firestore availability.
