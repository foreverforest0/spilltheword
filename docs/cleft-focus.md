# Cleft sentences: shift the focus

An oral B2/C1 activity registered as `cleft_focus`. B2 has a new Cleft sentences
topic; C1 adds this activity to its existing topic. The B2 topic also has its own
Magic 8-ball using the existing cleft profile.

Eight original sentences use vocabulary recorded in course `b2alh`. They include
low-key hangout, endless micro-obligations, subscription creep, sleep-deprived,
compost heap, from scratch, digital detox, down-to-earth, scrolling online and
pep talk. Vocabulary provenance is checked against the actual course list.
There are 23 hand-authored focus transformations, with one or more model answers.

One base sentence stays visible across two or three sequential accents. The
learner says a cleft sentence aloud. Hint lists appropriate openings only;
Show answer independently reveals possible full sentences. There is no text
entry or automatic marking. Back/Next preserve progress and model reveals.
The original meaning and tense are retained; action pseudo-clefts change the
lexical verb to the base form after what … did was … .

Locally vendored Rough Notation supplies underline, circle, box, bracket and
highlight. Strike-through/crossed-off are excluded because the selected phrase
is an emphasis, not an error. Accents animate on entry/focus change and redraw
without animation when width changes. Font readiness, multiline annotation,
reduced motion, shared replay and leaving the page are handled explicitly.
Only one annotation SVG remains active. B2 colours are #A9C632, #C8D2A6,
#FFC4C5 and #1D2E1B. Long phrases wrap; short articles stay with the next word.

Validation: `python scripts/check-cleft-focus.py` checks actual course vocabulary,
all 23 focus steps, all five annotation styles, one unchanged sentence across
focuses, hidden Hint/models, oral-only UI, progress/reload, 320/390/768/1440 widths
and cleanup. The existing topic-ball integration count is now 73.

This version is prepared locally for review; it has not been deployed.
