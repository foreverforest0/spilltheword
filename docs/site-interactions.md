# Site click, vocabulary directory and topic balls

`site-interactions.js` replaces the common synthesized UI effects with the
user-supplied `assets/sounds/site-click.mp3`, copied without transcoding. Playback
uses one audio instance at 0.28 volume, with a 70 ms debounce to avoid duplicate
capture/handler clicks. Sound off stops current playback; shared replay is
silent. Recorded printer audio and the separate lift door/motor/arrival effects
are retained. Printer and lift controls are excluded from the generic click.

Vocabulary now lists Alias, Taboo, Jeopardy and Word Craft. These buttons invoke
the existing setup routes, retaining the same course selection and own-word
settings. Word banks remain available internally to those games. Shop and GIFs
stay on the home shelf. Home category links and section headings are larger;
book spines are 4–6 px wider and covers 12–14 px wider with the same 3D geometry.

`topic-ball.js` registers one ball for each of the 66 numbered grammar groups.
Six additional profiles attach to will, going to, the three advanced future
forms and their mix. Future practice/printed documents/lift link to their
matching profile. The old common ball entry is removed from visible group and
level lists; its route remains compatible with older shared links.

Kids have an oral-only task, topic-specific Hint and the ball button. No text
entry, speech capture or automatic correctness claim is used; the teacher
checks the question before the ball is tapped.

Other levels have one question field, Hint and Ask. Finite tense topics reuse
the original question-structure check and restrict the recognized form to this
topic. Future Continuous, Perfect and Perfect Continuous have separate form
filters. Non-tense topics check their relevant construction/markers. Questions
about imperatives or word formation, inversion and other open constructions
explicitly ask the teacher to review wording rather than claim full grammatical
validation. Hints show only this profile's explanation and example. Random ball
answers stay short and readable. Drafts and the last answer survive reload;
animation timers stop on navigation. Reduced motion/replay skips the shake.

`scripts/check-site-interactions.py` covers audio playback/mute, four working
game routes, all 72 examples, per-topic entries, wrong-tense rejection, oral-only
Kids flow, drafts/reload, contextual Back, 3D dimensions and six viewport widths.
The existing printer-audio test filters its instrumentation to printer recordings
now that a separate shared UI audio instance also exists.
