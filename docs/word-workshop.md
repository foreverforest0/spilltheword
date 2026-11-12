# Word Craft

Entry: the existing Word Craft book (`flask`) or Grammar → Word Craft (`gmode=craft`). The teacher selects **Grammar** or **Word formation**, a level, and course vocabulary and/or a pasted list. Existing lesson selections, exclusions, translations and teacher-edited morphology remain supported under `S.les.craft`, `S.lx.craft`, `S.mine.craft` and `S.wordWorkshop`.

## Large board, small windows

The original corkboard artwork is shown in full on a larger board, with a narrow tools drawer beside it. The word bank contains compact windows instead of large sticky notes. Drag a word onto the board or click to place it. A placed window can be moved around the board; Shift + arrow keys also move it. Resizing clamps windows within the board.

Click an ending, stem change, auxiliary or affix, or drag the piece onto the word. The actual window on the board changes immediately. Word-to-piece dragging is also supported. Selecting another window retains each word’s construction, task and writing. Undo reverses one operation; Reset restores that word’s starting form. Each new task starts from the original word. The drawer shows only relevant parts for the selected mode and level, a short direction, Undo / Reset / Check, and a collapsed manual-answer/model-answer section. A model answer never completes a task.

Pointer events support both mouse and native touch. A seven-pixel threshold separates a click from a drag. Moving gestures capture on the stable workspace, keeping coordinates suitable for the existing shared-link replay. Touch actions activate on pointer release; their compatibility mouse click is suppressed before the shared event recorder, preventing both duplicate joins and accidental clicks into a newly rendered screen. Focused input is blurred on touch-down so its change event is recorded before any screen replacement. Pointer cancellation removes the ghost and leaves the construction and window location unchanged. Drag listeners are aborted after completion or cancellation.

## Grammar mode

Grammar uses inflections, auxiliaries, gerunds and infinitives; derivational affixes are absent. A round samples up to **five distinct surface forms per word**, without replacement. Regular past and participle forms with identical spellings are not offered twice in one sample.

Level pools accumulate rather than replace previous forms. B1 includes all A2 tasks, B2 includes B1 and earlier tasks, and C1 includes B2 and earlier tasks. Helpers accumulate on the same principle. The pool includes third person, gerund, past, participle, bare/to-infinitive, positive and negative simple/perfect constructions, eligible continuous forms, and higher-level perfect participles/infinitives. Stative verbs do not receive continuous-tense tasks. Be-phrase negatives accept was/were and contractions and reject `did not be …`. Particles remain attached; the teacher can review ambiguous lexical types and spelling variants before starting.

A noun has fewer genuine inflections than a verb: for example, `child`, `children`, `child’s`, `children’s`. Such words receive their actual available forms rather than an invented fifth form. Small word families can likewise have fewer than five distinct directions. How to explains this and the task counter displays the actual total.

## Word formation mode and dictionary checks

This mode uses a curated graph, not arbitrary concatenation. Instructions state a direction, such as “Make an adverb”, “Make a negative noun”, or “Make a plural noun”; they do not print the required affix. Multiple valid words with the requested direction are accepted. A sampled direction can require several steps:

- `care → careless → carelessness`: two suffixes, with the resulting spelling stored explicitly.
- `comfort → comfortable → uncomfortable → uncomfortably`: two suffixes and a prefix.
- `help → helper → helpers`: derivation followed by an inflection.
- `act → active → activity → activities`: two suffixes followed by a plural ending.

Compatible affixes are recalculated after every join. Spelling changes such as `happy → happiness` and `activity → activities` are handled by reviewed transitions and morphology. An ending does not create invented further suffix joins. Derived plural nouns are limited to a reviewed countable-noun list. Unsupported words and phrases remain in the teacher’s vocabulary but are counted as available for Grammar rather than silently given invented word families.

`word-workshop-families.js` contains **207 curated joins**. `scripts/check-word-workshop-dictionary.py` checks every endpoint and each permitted count-noun plural against the environment’s Hunspell en_US / SCOWL dictionary using libhunspell. The committed report, `docs/word-workshop-dictionary-check.json`, records 313 accepted spellings, the dictionary hash and source. Two earlier candidates not confirmed by that dictionary were removed. This is spelling attestation; POS, word-family relations, segmentation and teaching directions are curated. It is not a claim that the dictionary assigns CEFR levels, nor that arbitrary teacher-supplied words are dictionary verified. There is no dictionary network request at runtime.

## Random situation and free writing

After each word’s form tasks, the drawer shows one of **32 authored situations** and one random form actually practised for that word. Examples include film, trends, work chat, describing a person, neighbours, travel, a gift, a museum, gaming and a lost object. A short phrase or a sentence is welcome. There is **no checker, target-use gate, spelling correction, grammar grade or model sentence** in this phase; even an unfinished draft can be saved and continued. Browser spellchecking is disabled.

Each word retains its own topic and draft while another window is selected. Saved writing is stored by mode and original word in `S.wordWorkshop.writing` for teacher review, using the site’s existing storage. Preferences and course/custom selections persist. Current construction and board arrangement remain within the active session; shared replay restores them through pointer/click/input events. The existing live snapshot captures the board and textarea contents. No backend changes.

## Files and verification

- `word-workshop-forms.js`: parsing, lexical types, inflections, cumulative grammar pools and unique random samples.
- `word-workshop-families.js`: authored dictionary-attested graph and countable derived nouns.
- `word-workshop-parts.js`: mode-specific pieces, assembly and multi-step formation directions.
- `word-workshop-contexts.js`: 32 situation prompts, with no answer sentences.
- `word-workshop.js` / `.css`: setup, compact bank/windows, full board, pointer/touch interaction and unchecked context writing.
- Existing locally served MIT-licensed `vendor/compromise/` supplies morphology; its licence and provenance are unchanged.

Run `python scripts/check-word-workshop-dictionary.py`, `python scripts/check-word-workshop.py` and `python scripts/check-word-workshop-touch.py`.

Browser checks verify all authored grammar targets and reachable family paths, cumulative pools/helpers, distinct random forms, real mouse dragging in both directions, moving/keyboard windows, two suffixes plus an ending, undo/reset, per-word context drafts without checking, clean-context shared links, vocabulary persistence and desktop/mobile bounds. Native touch checks verify bank-to-board and affix-to-word dragging, tapping the next suffix, cancellation, ghost cleanup returning to setup without a duplicate click opening another game, and restoring a touch-built word in a clean browser context. Live transport itself is unchanged; tests do not establish external Firestore availability.
