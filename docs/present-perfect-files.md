# Present Perfect — Story files

Entry: Grammar → B1 → Present Perfect → **Story files** (`ppfiles`). This is a new free storytelling activity alongside the existing drills; it is not a replacement for the entire Present Perfect curriculum.

Three original everyday-life vignettes, each with seven short evidence documents:

1. **The roll nobody collected** — a second-hand camera in Porto, an undeveloped wedding roll, a lab envelope and the search for its owners.
2. **A night under a dinosaur** — an adult museum sleepover, torchlight activities, café receipt and a friendship that continues afterwards.
3. **The voice on the old tape** — a volunteer repair café in Bristol, a broken drive belt, a forgotten family recording and its new digital life.

These are plausible authored stories, not verified biographical/news accounts. Receipts, tickets, messages and photographs are recreated educational props. This is stated inside How to. No real institution's logo, payment QR code or booking link is used.

## Interaction

- The archive has three burgundy paper folders with tabs, spines and clipped photographs, following the user's editorial stationery references.
- Open one folder to see evidence on the left and a lined writing sheet on the right. On phones, the writing sheet follows the evidence.
- Browse documents with Back / Next, their seven index buttons, or left/right arrows while focus is in the evidence area. Clicking a document reveals/hides one useful word/marker on a small blue note. Some notes offer a second short alternative. This is not a model sentence.
- Evidence includes a train/admission ticket, a receipt, two photographic documents and short notes/messages. Dates, sums, schedules and current outcomes give facts to connect rather than a ready-made story.
- How to explains first-person retelling and use of Present Perfect for experience/current outcomes alongside Past Simple for dated events. Each file has a fixed **AS OF** date; Today and duration clues refer to this date, not the browser clock.
- There is **no answer checker**, score, automatic correction, required wording or model narrative. Browser spellchecking is disabled on the writing sheet. Learners may speak instead of writing.
- Drafts, the last document and individual word disclosures persist independently for each file in `S.ppStoryFiles`, using the site's existing save function. Closing a file returns to the archive and focuses its cover; opening another file preserves both drafts. Storage failures do not prevent the in-memory draft from working.
- Copy link uses the existing deterministic recipe and native click/input/keydown replay. The copied game restores the selected folder/document, disclosed word and text, then remains editable. See answers captures the writing sheet and styles through the existing live snapshot system. No transport/backend changes.

## Files and visual assets

- `present-perfect-files-data.js`: three stories and their 21 documents, dates and lexical cues.
- `present-perfect-files.js`: archive, evidence browsing, cue disclosure and independent drafts.
- `present-perfect-files.css`: folder construction, paper stack, receipts, tickets, lined paper, responsive layout and reduced motion.
- `assets/case-files/photographs.png`: one newly generated six-frame analog-style photographic asset. Frontend background positioning selects each frame without modifying the image. It is illustrative material, not documentary proof of an actual person/event.
- `assets/case-files/paper-grain.svg`: small locally generated procedural paper grain.
- `ch/fonts/special-elite.woff2`: existing local typewriter font, reused for evidence metadata. Bold sans-serif headings reproduce the references' editorial hierarchy; the writing sheet uses the site's readable serif.
- `site-theme.js`: `data-stw-plain` opt-out keeps these editorial headings straight without changing the normal wavy headings elsewhere.

All scene content stays in the main document, with no iframe, external runtime request or new dependency. Card transitions are short CSS motions. Controls and hint disclosures work without motion or animation callbacks. Focusing the document and browsing by keyboard preserves focus after the card is replaced.

## Verification

`python scripts/check-present-perfect-files.py` (Python Playwright and Chromium) verifies real catalog navigation, all 21 documents and their hints, independent drafts across switching/closing/reload, absence of a checker, keyboard controls, shared links in a clean browser context, live snapshot content/styles, 1440/768/390px layouts, actual motion and return to Topics.

The live transport is reused; this test verifies snapshot contents, not external Firestore availability.
