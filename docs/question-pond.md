# Question pond

A shared exercise available inside all **66 numbered grammar topics**, from Kids to C1. Open Grammar → level → topic → Question pond.

- **Catch a question:** click a fish or tap anywhere on the water. An SVG line follows the fish’s mouth while it arcs out of the water and hangs beside the bank. A single question opens beside the enlarged pond. Returning to the pond lowers the fish back into the water. Type an answer using the supplied words, check it, or reveal an example. A separate Hint button reveals a sentence prompt and a grammar pattern; explicit sentence starters are omitted from the main task. Catch another fish to continue. The shuffled queue covers the whole topic bank before repeating.
- **Draw & release:** catch a question, enter an answer, draw a fish with the site's five pencil colours, then release it. A matching answer lets the fish swim; a nonmatching answer animates a leap out of the pond. The answer and drawing stay available for correction, without having to redraw. Empty answers and empty/erased drawings are not released.
- **Show answer** is available for every caught question in both modes, including while drawing or correcting a failed release. It toggles a separate model-answer panel; the draft, drawing, feedback and correctness state stay intact. The panel starts hidden for each new question and mode render. Hint remains independent. The first authored accepted answer is shown as one possible answer; the checker continues to accept all authored alternatives. The reveal/hide action also replays through Copy link.
- Correctly released fish are kept **locally in this browser, by topic**. At most eight saved fish return per topic, with a global limit of forty; the visible school remains bounded. Storage failures leave the exercise playable and explain that the drawing was not saved.
- Hover or keyboard focus pauses a fish. Fish steer and turn gradually near the banks. Clicking the water catches the nearest fish, with no timing, tension, reeling, scores, buckets, account or multiplayer flow. Offscreen tabs pause animation. Leaving the exercise cancels its timers, animation loop, observer and visibility listener.
- Questions use authored, checkable targets, with selected existing transformation sets added for older learners. Case, punctuation, common contractions, optional `that`, and explicitly supplied answer variants are accepted. This is a **constrained grammar exercise**, not an AI assessment of arbitrary free conversation.

## Files

- `pond-questions.js`: topic mappings and question banks.
- `question-pond.js`: original local interaction, drawing canvas, answer matching, rendering and lifecycle management.
- `question-pond.css`: responsive paper layout, water, catch/release/leap animations, reduced-motion support.
- `assets/pond/`: newly generated coloured-pencil pond background and six-fish transparent sheet, in the existing site palette.
- `scripts/check-question-pond.py`: browser checks for all routes, question variants, correct/incorrect answers, drawing, retry, persistence, keyboard/mouse, motion, cleanup, storage errors and responsive screens.

## Reference

Studied [gauransh18/doodle-pond](https://github.com/gauransh18/doodle-pond), specifically the README and `fish.js`, `studio.js`, `strokes.js`, and `angler.js`: hand-drawn fish become swimming sprites; catching opens a card; drawings return to the water. Inspected revision: `91773efbf43b97dcd2ec6bc67f0a1a4e5ac66ad9`. The public demo host was blocked by this environment's network policy, so the repository was inspected directly. The upstream repository has no licence file at the inspected revision, so **no upstream source code or artwork was copied or bundled**. This implementation is original DOM/Canvas/CSS and does not require Three.js, a build step, a server or D1.

Run `python scripts/check-question-pond.py` with Python Playwright and Chromium installed.

The complete current B1 inventory (136 exercises across 11 topics, shared by both modes) is in [question-pond-b1-tasks.md](question-pond-b1-tasks.md).
