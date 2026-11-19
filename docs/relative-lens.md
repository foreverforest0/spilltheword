# Relative clauses · glass lens

Reference: https://recent.design/i/o5w1k5q-physical-texture-web-experiments
The moving glass lens magnifies a real DOM copy of the fact sheet. Softly obscured
secondary facts become readable inside the lens. Selecting a fact pair also
reveals it in full, so neither precise pointer control nor hovering is required.
No photographs, portraits or generated images are used. The lens never reveals
an answer. Tap, keyboard focus/arrow keys and click all select the same tasks.

B1, B2 and C1 each contain six situations, with four tasks per situation (72
original tasks). Contexts include films, memes, friends, food, travel, hobbies,
a smart home, a digital detox and neighbourhood life. Lexical provenance in
relative-lens-bank.json points to the actual B1 Course word list or the user's
corrected B2 ALH. C1 uses ALH until a separate C1 list is supplied.

Coverage:
- B1: defining subject and object relatives, who/which/that, object omission,
  whose, where and when; no omission of a subject relative word.
- B2: non-defining clauses and punctuation, possession, object omission,
  place relatives, preposition stranding/fronting, quantifier + of whom/which,
  and which referring to an entire situation.
- C1: fronted prepositions and whom, whole-clause comments, quantifiers,
  active/passive reductions, prepositional-phrase reductions, fused what and
  defining reason clauses. Formal or reduced patterns are requested explicitly.

The approach follows standard distinctions taught in Cambridge English Grammar
in Use / Advanced Grammar in Use, Oxford Practice Grammar and Pearson
MyGrammarLab. All situations and sentences are original; no book exercises or
specific publisher pages are reproduced or claimed as retrieved.

Written checking accepts documented alternatives, object omission, contractions
and reasonable surface punctuation differences. It detects selected precise
errors (missing subject pronouns, non-defining that, missing commas, whose/who's,
whom/which after quantifiers). Unrecognised paraphrases get neutral comparison
with a model, never a claim of being ungrammatical. Oral use is always available
via Show example, without manufacturing a checked result. Drafts and visibility
persist separately per task.

The user's explicit visual preference overrides the white background in the
reference: cream #F9F5E6, Kindaten headings, B1 accent #001166, B2/C1 #1D2E1B.
reference-practice-theme.css applies the same correction to Photo folders,
reported-speech badges and the deduction toggle, preserving their mechanics.

Checks:
- node scripts/check-relative-lens.js
- python scripts/check-relative-lens.py
- RELATIVE_LENS_ROOT=/path/to/site python scripts/check-relative-lens.py
