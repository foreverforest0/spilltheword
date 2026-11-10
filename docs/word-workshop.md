# Word Craft — word-form construction workshop

The existing Word Craft book and `gmode=craft` entry open the workshop. Course vocabulary reuses the site's original lesson picker and word exclusions, under independent `S.les.craft` / `S.lx.craft` keys. Teachers can combine course words with a pasted list, deselect individual entries, choose lexical types and review/edit accepted forms. Sources, chosen level and overrides persist in `engGames.v1`. Translations after `|` are optional; up to 150 unique entries are used.

## Board and parts drawer

Selected vocabulary appears as square tiles on the existing corkboard. Clicking a word opens a right-hand drawer with its current task and compatible construction pieces:

- Endings: inflectional changes such as `-ing`, `-ed`, `-s / -es`, possessive, comparative and superlative forms.
- Prefixes and derivational suffixes: reviewed lexical relationships, such as `happy → unhappy → unhappiness`, `care → careful / careless` and `conceal → concealment`. Unsupported joins are not invented.
- Auxiliaries: words such as `have`, `had`, `was`, `were`, `been`, `not`, limited by the selected level. Their chosen order is preserved, so a wrong construction cannot pass merely because a helper was selected.
- Stem changes: base, irregular past and past participle forms. These use reviewed morphology rather than appending an ending to an irregular verb.

Click a piece, drag it onto a word, or drag the word onto a piece. The form on the tile and in the drawer updates immediately; `look for + -ed → looked for`, followed by `have → have looked for`. Inflection uses the whole word/phrase and handles spelling changes, so `stop + -ing → stopping` and `take off → taken off`. Undo and Reset word affect the current construction, not completed work. Each word retains its own task, construction and progress when another tile is selected. Keyboard arrows select board tiles; all pieces are real buttons. On narrow screens the drawer sits below the board.

A task passes only if the constructed form matches its authored alternatives. Show answer is optional and does not complete it. A collapsed Type a form instead field supports manual answers and spelling variants. Fixed expressions receive a sentence task instead of invented inflections.

## Levels and be phrases

The teacher chooses Kids, A1, A2, B1, B2 or C1 before starting. The task planner and piece inventory use the same level:

- Kids: basic third-person, -ing and past forms.
- A1: these basic forms plus negative past; no perfect auxiliaries.
- A2: Present Perfect, eligible Past Continuous, simple forms and basic word families/comparisons.
- B1: Present Perfect Continuous where appropriate, Past Perfect, simpler forms and intermediate word families.
- B2: participles, perfect constructions, future completion, past modal deduction and negative Past Perfect.
- C1: perfect participle/gerund, negative perfect participle, perfect infinitive and negative perfect infinitive.

Noun and adjective tasks respect their applicable forms and the available word-family level. Stative verb heads do not receive continuous-tense tasks. Core morphology remains available as needed to build compound forms. Prefix/suffix vocabulary is a reviewed local set, not an unrestricted word-creation dictionary.

`be` is recognised at the start of phrases as well as on its own. Past negatives for `be packed with`, `be interested in`, `be afraid of`, etc. accept both was/were and contractions: `was not packed with`, `were not packed with`, `wasn't packed with`, `weren't packed with`. `did not be packed with` is rejected. Applying a finite be helper replaces the initial `be`, preserving the rest of the phrase.

## Final writing and sharing

After all selected words, one practised form is picked randomly for an original sentence. The sentence check confirms whole-word target use and added context, with contractions, changed possessives and common separable phrasal verbs. It does not grade complete sentence grammar, meaning or naturalness; the saved sentence remains available for teacher review through the existing live-answer screen.

Copy link records normal selections, clicks, drags and writing. Replay must reproduce the level, board selection, pieces, completed forms, random final target and draft. Native HTML drag events use the site's existing DataTransfer replay. The transport is unchanged. Earlier links to superseded Word Craft layouts may require a fresh link.

## Files and checks

- `word-workshop-forms.js`: source parsing, lexical types, reviewed inflection, level-specific tasks and constrained answer/target matching.
- `word-workshop-parts.js`: reviewed word families, level-scoped pieces and assembly.
- `word-workshop.js` / `word-workshop.css`: source setup, tile board, parts drawer, per-word progress and final writing.
- `vendor/compromise/`: locally served MIT-licensed compromise 14.20.0, original licence and provenance. No runtime dictionary or grammar API is used.
- `scripts/check-word-workshop.py`: buildability of targets across all levels, real two-way drag, click/keyboard interaction, prefixes/suffixes, spelling/irregulars, undo/reset, level gating, be-phrase negatives, shared replay, final writing and mobile layout.
