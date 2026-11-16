# Present Perfect B1 practice refresh

`present-perfect-b1.js` adds two drills alongside the existing, unchanged `tv3` third-form exercise:

- `tppq`: 24 answer-to-question items. Each gives the question focus, fixed opening and subject, with one canonical question. The typewriter permits answers across wrapped lines for this drill, including Backspace and Show answer.
- `tppfs`: 24 gaps requiring only `for` or `since`, balanced between duration and starting points, including past-event clauses.

The B1 Present Perfect fridge (`mb1pf`) has exactly two filters: `sent` (18 statements, negatives and questions mixed) and `time` (24 full sentences with both for/since magnets). Leave the unused time word in the bank. Unsupported old filters fall back to the first available filter. Other fridge exercises retain their existing filters and defaults.

`pond_b1_1` uses 54 items: 18 cue-to-sentence, 12 single-error corrections (auxiliary, time word or participle), and the same 24 answer-to-question items. The pond cycles build → fix → question without an exercise-kind selector. Each kind shuffles independently without repeating an item until its own bank is exhausted. Existing catch/draw interactions remain available; other topics retain their previous question selection.

Every new row records its vocabulary source by course ID, zero-based unit/lesson index and lexeme: the site's `b1` (B1 Course) and `teens` courses used by the GIF lesson picker. This uses authored grammatical contexts around actual course vocabulary, not automatic sentence generation or a change to saved course selections.

Validation:

- `python3 scripts/check-present-perfect-b1.py`: course provenance, routes, answer rejection, real typewriter input including a long wrapped question and Backspace, both fridge modes and unused time-word distractor, nine alternating pond catches, mobile widths.
- `python3 scripts/check-b1-content.py`: shared B1 banks, fridge filters and existing activities.
- `python3 scripts/check-question-pond.py`: all pond topics, drawing, checking, sharing and cleanup. Fixed openings are intentionally allowed for the new structured B1 tasks.
