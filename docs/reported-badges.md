# Reported speech — hanging badges, B1–C1

## Placement and visual reference

Activity IDs: `reported_badges_b1`, `reported_badges_b2`, `reported_badges_c1`.
Appended to the existing Reported speech topic at each level, without changing
other activities or the final B1 Revision room entry. Direct link pattern:
`/#g=speak&tp=reported_badges_b1&lv=b1`.

Reference: https://recent.design/i/8c5u6uo-team-profile-card-component
(Team Profile Cards, linked creator Hayriye Akguller). The source animation was
viewed and its high-resolution original frame retained. Maya Bennett, Leo Carter,
Noah Williams and Amina Yusuf are the original reference portraits and identities;
they are displayed through SVG viewports of the unaltered frame. There is no
redrawing, replacement or recolouring. Source URL, timecode, pixel bounds and
SHA-256 are in assets/reported-badges/manifest.json. The source image is not claimed
as original artwork. Badge shells and controls are authored HTML/CSS.

The four hanging, softly tilted rounded badges, fine cable/clips, original coloured
portrait backgrounds, pale front surfaces, circular flip arrows and pastel back
gradients follow the reference. Task text replaces the original profile copy.
The front contains only identity/portrait and the quote. No invented recipient,
reporting date, setting paragraph or job-role instruction is added. Back-only
B2/C1 focus cues are limited to a grammar/meaning nuance. The original reference's
promotional hero, contact labels and QR content are omitted from the teaching UI.

Each badge flips independently around its vertical axis. A short entry swing
settles; hover gives a soft sheen. Focus/hover pauses motion for reading. Hidden
faces are inert, and reduced motion keeps the same controls and final geometry.
Small screens retain the readable badge dimensions in a horizontal rail.

## Original content and language decisions

72 original quotes: 24 per level, six sets of four. Contexts include films and
trailers, memes, games, group chats, friends, family, food, privacy, smart devices,
screen time and everyday choices; work does not dominate.

B1 covers present simple/continuous, past simple/continuous, present perfect,
present perfect continuous, past perfect, will/can/may/should/would, negatives,
yes/no and wh-questions, requests and instructions. B2 adds future continuous and
future perfect, perfect modals, nested clauses, subject questions, conditional
meaning, group perspective and reporting verbs. C1 adds third/mixed conditionals,
epistemic must, wish/would rather, nested past perfect passive, qualified questions,
refusal, apology, insistence, mandative suggest clauses and multi-clause reports.

Vocabulary metadata points to the real B1 Course list and the user's corrected
B2 ALH JSON (with unit/lesson indices). C1 also uses the approved ALH pool because
no separate C1 list was supplied. Lexemes are inflected naturally; articles,
possessives and objects are adapted where required for idiomatic English.

The ongoing preference for natural, correct, modern English and varied everyday
contexts is saved in docs/interaction-preferences.md. Correctness and idiomatic
phrasing take priority over inserting a target word. The grammar treatment follows
standard pedagogical distinctions familiar from Murphy/Hewings, Oxford Practice
Grammar and MyGrammarLab; all quotes, variants and explanations here are original.
No current publisher page or copied textbook exercise is claimed as a source.

No reporting time is specified. Backshift is therefore not forced when an
unchanged tense can truthfully preserve a continuing situation. Simple past may
remain in a clear past account. Past perfect and remote conditionals are not
mechanically shifted again. Would in would rather and epistemic must have are
kept distinct from had/had to. Tomorrow, this/that and this/that week have appropriate
alternative forms rather than an invented mandatory reporting date.

## Checking and oral use

The back has a reporting starter, optional B2/C1 focus cue, an answer field, Check
and Said it. The starter supports a reported-clause-only answer; full reports with
the character's first/full name, pronoun or singular they are also supported.
Requests/instructions use a visible object-bearing starter for clause-only input.
Full reports may explicitly specify another listener. Questions accept if/whether
and appropriate listener pronouns. That is optional where grammatically possible.

The local checker generates bounded, meaning-preserving variants from authored
clause templates. It accepts contractions and common spelling variants, ignores
case and nonessential punctuation, and checks supported complete reports and
scaffolded clauses. Targeted retry feedback covers changed negatives, agreement,
indirect-question inversion, object/to patterns, invalid reporting-verb complements
and selected modal/conditional meaning changes. It does not accept a reply merely
because it contains keywords.

This is not an unrestricted English parser or AI semantic grader. A free
paraphrase outside the supported variants receives a neutral review message and
a model for comparison, never an automatic claim that it is ungrammatical. The
example is one possible report, not the only correct sentence.

Said it opens the example and explanation for a spoken response, without marking
it automatically correct, recording audio or requiring text. All tasks can be
completed orally with the teacher. Written checking also leaves the example
available. There are no scores, CEFR claims or teacher-rating summaries.

Drafts, flipped faces and comparison state are stored locally per level and task
under spill-reported-badges-v1. Changing an answer clears its previous verdict
without rerendering or closing the badge. Set navigation keeps all saved drafts. Touch devices focus the card rather than
forcing the keyboard open, so an oral answer remains convenient.

## Validation

- `node scripts/check-reported-badges.js`: all 72 canonical reports, independent
  valid alternatives, deliberate errors/meaning changes and neutral paraphrase
  review. Includes unshifted/backshifted forms, contractions, singular they,
  listener changes, reporting verbs, questions, requests and conditionals.
- `python scripts/check-reported-badges.py`: three actual catalog entries, all
  quotes and course provenance, exact original portrait frame hash, front-only
  quotes, card bounds, flipping/inert faces, checking, oral comparison without
  fake grading, drafts, keyboard and 320/390px layout. REPORTED_BADGES_ROOT can
  point this test at the isolated production checkout before publication.
