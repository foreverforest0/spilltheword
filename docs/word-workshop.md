# Word Craft — word-form workshop

The existing Word Craft book and `gmode=craft` entry now open a word-form workshop instead of the word-combination board. Course vocabulary uses the site's original `lessonPickerHTML`, `bindLessons`, selected-lesson and excluded-word handling, under independent `S.les.craft` / `S.lx.craft` keys. Other games' lists and old discovered Word Craft combinations remain intact.

Teachers can select individual course words, paste words or multiword phrases, combine both sources, and exclude individual entries. Newline/comma-separated words are accepted; a translation after `|` is optional. Duplicates are collapsed. Up to 150 entries are used. Source text and per-word choices are persisted in the existing `engGames.v1` settings, not a separate account or remote service.

An inferred part of speech is shown for review and can be changed. Unknown words require a type choice. Forms are editable before starting, with slash-separated accepted alternatives. This matters for ambiguous senses such as `lie` or words used as either nouns or verbs. Lexical classification and morphology are aids, not a universal dictionary or semantic grader.

One vocabulary item stays on the corkboard while the learner completes its tasks:

- Verbs: -ing, positive Past Simple, third-person Present Simple, Present Perfect with have, and negative Past Simple. `be` has an appropriate negative-past prompt instead of a do-based form.
- Nouns: plural, singular possessive and back to singular.
- Adjectives: comparative, superlative and back to the original degree.
- Fixed expressions/adverbs: an own-sentence task, without invented inflections.

Particles and objects stay attached to the verb, for example `look for → looking for / looked for / have looked for` and `take care of → taking care of / taken care of`. Reviewed irregulars override the library's incomplete participle output, including `run → run`, `come → come` and `become → become`. Selected British/American variants and contractions are accepted. Show answer is optional; seeing it does not complete a task. Incorrect forms cannot advance.

Correct forms collect below the board. After all selected vocabulary, one practised form is chosen randomly for a final original sentence. The sentence check confirms whole-word target use and added context; it supports contractions, changed possessives and common separable phrasal verbs such as `have taken my coat off`. It does **not** claim to check the complete grammar, meaning or naturalness of free writing. The sentence is saved for teacher review through the site's existing live-answer screen.

Copy link captures settings and normal input/click actions. Replay reproduces the selected course/custom vocabulary, completed forms, random target and in-progress sentence. Random decisions happen inside recorded events. The page uses native fields and buttons, so existing live-answer snapshots retain the written answers. Transport itself is unchanged.

## Files and verification

- `word-workshop-forms.js`: parsing, lexical types, reviewed form generation, constrained matching and target-use checks.
- `word-workshop.js` / `word-workshop.css`: course/custom setup, teacher review, corkboard, cumulative checked forms and final writing.
- `vendor/compromise/`: local MIT-licensed compromise 14.20.0 browser build, original licence and provenance. No runtime dictionary or grammar API request is made.
- `scripts/check-word-workshop.py`: actual course selection/exclusion, pasted phrases and translations, persisted settings, teacher edits, representative irregular/regular/compound forms, 15 checked verb forms, wrong-answer rejection, random final writing, shared replay, noun/adjective/fixed paths and mobile layout.
- `scripts/check-shared-games.py`: surrounding shared-link routes, including the new Word Craft setup screen.
