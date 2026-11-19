# Revision room — B1, free production

Published on the main site as the last topic in Grammar → B1 → Revision room.
Direct link: /#g=speak&tp=revision_room&lv=b1.
The isolated browser preview at /preview/revision-room/ remains available.
When the main activity has no saved state, it imports the saved preview state.
A small “← B1” control returns to the B1 catalog without losing progress.

## Current flow

1. Categories: tenses, conditionals/wishes, word forms, constructions. Only the
   active category's topic pictures are offered. Each topic has its own original
   Feather image and small coloured label/selection box. No topics are preselected.
2. Native scroll moves the selected pictures onto the original Feather paper
   artwork, where they form a list containing only the selected topics. Topics can
   be removed from that list. The small word note opens the B1 course/custom word
   picker. A base word for the tense grid can be edited on the sheet.
3. Three tables: Past/Present/Future × four aspects, conditions/wishes, and
   forms/structures. Only selected topics have writing cells. Each contains only
   the base word or a selected lexical word, a name/pronoun and short detail cues.
   Students type their own sentences directly into the grid. There are no models,
   hints, checks, grades or answer comparisons.
4. Vocabulary appears in groups of up to five pairs: the original Feather
   perforated pastel receipt backgrounds with a short task in the top row, and
   the original object compositions with the selected word below in the second
   row. The former separate left-hand stack and large cream postcard are removed. There are 15 rotating lexical task types: explanation, paraphrase,
   contextual opposite, character line, film title, meme, tiny story, collocation,
   advice, villain line, video comment, question, headline, fictional character,
   and message reply. Students answer orally. No extra text field is shown.
5. The number of drawers equals the number of selected grammar topics. Every
   drawer contains exactly one current task card. Its question addresses the
   student; its required word is drawn only from the selected word set. A timer
   starts at 60 seconds and supports pause/reset. The refresh icon cycles through
   that topic's 15 questions. Changing the required word cycles within the chosen
   set. Hover reveals the original drawer sidewalls and paper, moving the front
   left/down by the reference geometry. Clicking pins it open; touch users can tap
   to open it. Multiple drawers can remain open.

No teacher marks, progress summaries, CEFR claims, export controls, new-attempt
buttons, hints or show-answer controls remain in the exercise.

## B1 content

24 topics × 15 unique prompts = 360 authored questions/tasks, plus 15 lexical task
types. Topics: 10 individual tense forms, going to, past narrative mix, zero/first/
second conditionals, present wishes, gerund, infinitive, word formation, passive,
reported speech, relative clauses, question tags and deduction. The two advanced
Perfect Continuous cells have no B1 topic and remain inactive.

Questions cover films, trends, memes, social media, ordinary life, personal
experiences, hypothetical choices, stories and role-play. Named character scenarios
are not used in the question bank. Names remain only as optional grid cues. No answers are generated or evaluated.

The initial vocabulary pool contains the 187 unique entries of the existing
COURSES b1 course, extracted without substituting vocabulary from other courses.
No vocabulary-list entries are preselected. The visible base word is enough to
continue: typing it and pressing Enter advances to the tables and uses that word
for cards/drawers when no separate word set was chosen. Explicit vocabulary-list
choices take precedence; they are not polluted with an implicit default word.
Teachers can paste their own words/phrases; markup is
escaped. Selection and free text persist locally under a new B1 storage key;
previous prototype storage is left intact.

## Artwork and motion

Reference: https://feather.computer/. Uses its supplied paper, icon, portrait,
cabinet-front, tab, knob and object images. Receipt lettering uses the reference
Gerstner Programm font; drawer labels use Mansalva. Other scenes retain Inter, with original source URLs/hashes in
assets/revision-room/reference-manifest.json. This is user-requested reference
artwork; no transfer of asset rights is asserted. HTML/CSS/JS and exercise content
are authored separately.

A native scroll track drives five pinned scenes. Wheel/touch events are not
intercepted. Manual browser scroll restoration keeps the saved scene from being overridden
by the browser after reload. A shorter scroll track and gentle parallax reduce
stationary scrolling between stages. A frame-rate-independent 75ms damping smooths the visual scroll
position. Scene changes overlap an inert snapshot of the departing scene and
the arriving content for 560ms. Arrivals complete even if scrolling stops at
a boundary, and there is no forced scroll-back for an unselected vocabulary list.
The explicit “К таблицам” action and Enter work from the Word field. Scrolling
backwards reverses the icon geometry and transition direction. Long paper lists,
word choices, grids and cabinets scroll internally. Reduced-motion mode keeps all
content usable without the entry transforms.

The receipt backplates retain only the original perforated outline and inset
colour; original text outlines are removed so authored exercise text can be used.
Five pairs pop out with a staggered overshoot and settle into two rows. Refreshing
one task preserves the other tiles and does not restart their animations. More
than five chosen words paginate; mobile keeps the same two rows in a horizontal
rail. Each drawer uses an original paper asset behind its moving front. Opening
its task keeps the pastel receipt/object arrangement and the existing timer.

## Checks

- python scripts/check-revision-b1.py (also scripts/check-revision-room.py)
- python scripts/check-revision-scroll.py
- python scripts/check-revision-usability.py
- python scripts/check-revision-gallery.py

Covers real catalog access, selection categories, list geometry, all 360 prompts,
course/custom words, free cell writing, no grading UI, two-row reference cards, exact drawer
counts, one task per drawer, 15-question cycles, real 60-second timer, persistence,
escaping, mobile layout, reversible scroll movement and loaded assets.

The usability regression reproduces the saved pick-up-only state, Enter/click
continuation, automatic base-word reuse, native wheel progression, overlapping
transitions, uniqueness of live controls and a stable fully visible scene.
