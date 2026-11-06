# Word magnets

Blue single-door fridge artwork based on the supplied reference. Words are plain coloured magnets; the door has no painted answer box or white strip. Guided mode gives an explicit task, a shuffled finite set of words and answer validation. Drag onto the door, drag between magnets to reorder, or tap to add/return a word. Keyboard users can activate buttons and use Left/Right to reorder magnets already on the door. Undo and Clear are reversible.

Every numbered grammar section in Kids–C1 has a fridge route: 66 topics. Existing magnet links continue to work and duplicate menu entries are consolidated. Existing reviewed banks supply B1 and relevant A1/Kids exercises; `data.js` supplies topic-specific sentences for the other sections. A2 has its own sentences rather than borrowing the A1 bank. Word Formation builds the full sentence with the derived word. Multi-word token hints are split into individual magnets. In two-part tasks the fixed opening stays in the task text.

The free collection uses cumulative vocabulary by level, a tense selector, word search, reusable word magnets and sentence saving within the session. “Give me a task” specifies tense, statement/negative/question and a compatible time marker. Its clue check checks marker presence and negative-form cues; it explicitly leaves full grammar assessment to the teacher. It does not claim to validate arbitrary English sentences automatically. Guided mode validates against the explicit answer bank and its accepted variants.

Assets: `assets/blue-fridge.png` is a transparent generated adaptation of the user's photo reference. No remote image service is required at runtime.

Preview: `index.html?magnets=1&level=b1`, optionally `&mode=task`, `&mode=free`, or `&topic=fm_b1_1`. Levels: kids, a1, a2, b1, b2, c1. Native selects opt out of the site's `pillify` transform via `data-native-select`.

Checks: `python scripts/check-fridge.py`, `python scripts/check-b1-content.py`, `node --check magnets/app.js`, `node --check magnets/data.js` (browser checks use Python Playwright + Chromium).
