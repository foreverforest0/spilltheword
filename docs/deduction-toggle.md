# Modals of deduction · NOW / BEFORE

Reference: https://recent.design/i/6ts0h72-toggle-switch-stretch-animation
The reference's blue/grey pill, elongated white thumb, press stretch and elastic
travel are implemented in CSS without an animation library. Activity titles use
the site's primary heading font, Kindaten, as explicitly requested by the user.

Available in B1, B2 and C1 under Modals of deduction. Each level has twelve paired
situations, with separate NOW and BEFORE answers (72 branches total). NOW is the
time of observation, not a rule that every answer must use a present infinitive:
a current clue can support a conclusion about an earlier event. Three deliberate
pairs preserve this distinction and explain it in the example.

B1: strong/possible/impossible deductions, states and ongoing actions, present
versus past reference. B2 adds perfect continuous deductions, passive forms and
prior activities inferred from current evidence. C1 includes ongoing passives,
anteriority, and the limits of what evidence establishes. May, might and could
are accepted for possible explanations; can't/couldn't have are accepted for past
negative deductions. Mustn't is treated as prohibition, not negative deduction.

All sentences are original. Methodology follows standard modal/infinitive
contrasts used in Cambridge's English Grammar in Use / Advanced Grammar in Use,
Oxford Practice Grammar and Pearson's MyGrammarLab; no exercises are reproduced.
Lexical provenance is in deduction-toggle-bank.json: actual B1 Course vocabulary
and the user's corrected B2 ALH list. C1 uses the approved ALH pool until another
list is supplied. Natural phrasing takes priority over lexical density.

Students can write and check, or answer aloud and reveal an example. Automatic
checking accepts documented model alternatives and identifies a few clear modal
form errors. Unrecognised paraphrases receive neutral comparison, not a false
incorrect result. This is bounded checking, not unrestricted semantic grading.
Drafts, example visibility and feedback persist separately per level, situation
and time reference. Switch supports keyboard, pointer/touch and reduced motion.

Validation:
- node scripts/check-deduction-toggle.js
- python scripts/check-deduction-toggle.py
- DEDUCTION_TOGGLE_ROOT=/path/to/site python scripts/check-deduction-toggle.py

The later user preference keeps the cream site background and level-coloured
Kindaten titles via reference-practice-theme.css, overriding the reference
white surface while preserving the elastic switch.
