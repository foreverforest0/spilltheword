# Photo folders — conditionals, B1 / B2 / C1

## Published integration

Activity IDs: `conditional_folders_b1`, `conditional_folders_b2`,
`conditional_folders_c1`. Each belongs to the level's existing conditional groups;
C1 gains a Conditionals group. B1 Revision room remains last. Existing video and
other conditional activities remain available. Direct URL pattern:
`/#g=speak&tp=conditional_folders_b1&lv=b1`.

## Reference and interaction

Reference: https://recent.design/i/f138hkt-photo-sorting-interaction
(Photo Sorting / Folder Animation, Raul Dronca). The reference video was examined
at multiple points. The adaptation retains the white background, compact Library
heading, dark layered folders, four-column square photo grid, corner checkmark,
floating dark selection toolbar and rising/filing motion. Folder vectors are
original HTML/SVG/CSS recreations; reference source code/assets are not claimed.
The number of folders follows the level's conditional types (three/five/five).
The single short task appears only after selecting a photograph.

Select one photo, say a conditional and click a destination folder. Drag/drop is
also supported. The selected photo rises, scales down, moves towards the folder
and drops into its front pocket in a 760ms animation. Filed photographs form a
small stacked preview, fanning out on hover. Open a folder to review its photos.
Filing is checked against the task’s conditional type on B1, B2 and C1 before any
placement is saved. A wrong destination keeps the photo in the grid and shows one
short semantic cue; the attempted folder briefly shakes. The correct destination
accepts it with the existing flight animation. Spoken/written sentences remain
teacher-checked, with no automatic text grading.
A hidden Example offers one possible response and a concise reason. Write opens
an optional field. No score, level assessment, hints panel or completion summary.
Reset restores positions without deleting written answers. Next photos appears
when the current grid is filed and more tasks remain. No repeated photo appears
within an initial 16-photo grid.

Photographs reuse the sixteen already-approved fictional realistic story photos,
unchanged, through SVG viewports using the existing atlas manifest. Their original
files and provenance remain in assets/past-notebooks. No new image generation.
Main-site heading transformations, course-colour cards and share toolbar are
suppressed within this activity to preserve the requested reference appearance.

## Methodology and original content

79 authored tasks: B1 24 (eight each zero/first/second); B2 30 (six each
zero/first/second/third/mixed); C1 25 (five each). Mixed includes past → present and
present characteristic → past result. B1 includes statements, negative conditions,
negative results, questions, imperative requests and modal results. B2 adds past
counterfactuals, both mixed directions, unless, passive/continuous conditions and
could/might outcomes. C1 adds should/were/had inversion, negative inversion, only-if
main-clause inversion, provided that, as long as, otherwise and but for. No wish
prompts are mixed into the conditional sorting task.

Pedagogical reference points: Raymond Murphy, *English Grammar in Use* (Cambridge);
Martin Hewings, *Advanced Grammar in Use* (Cambridge); John Eastwood, *Oxford
Practice Grammar Intermediate* (Oxford); Mark Foley and Diane Hall, *MyGrammarLab*
Intermediate B1/B2 and Advanced C1/C2 (Pearson). These are methodological reference
points, not a source of copied sentences or an endorsement. Publisher/reference
web requests were blocked by the environment's network policy; no claim is made
that current book pages or specific units were retrieved for this implementation.
All task wording, examples and reasons are original and recorded in the bank JSON.

Prompts explicitly identify repeated patterns, possible future events, unreal
present situations and finished past events. Mixed prompts supply both time
frames. Zero-conditionals use qualified patterns instead of unsound universal
claims. First conditional examples use present forms in ordinary if-clauses,
with will/can/imperatives in the result. Alternative correct wording remains
possible, so examples are not automatic grading keys. C1 fronted only-if inversion
is correctly located in the main clause; negative had inversion keeps not after
the subject. British usage is used throughout.

Every row records course vocabulary: B1 uses the site's B1 Course pool; B2 uses
only `docs/b2-alh-approved.json`, the user's corrected ALH list, with unit/lesson
indices. Since a separate C1 lexical list was not provided, C1 also uses that
approved ALH vocabulary with more advanced grammar; no invented C1 course is
claimed. Vocabulary is integrated in the situation and/or example, not shown as
an extra vocabulary panel. Forms may be inflected naturally.

## Persistence and checks

`spill-conditional-folders-v1` stores separate positions, decks and writing per
level. On opening a level, previously unchecked incorrect placements return to the
library; correct placements and all saved writing are retained.
Native buttons, focus restoration, Escape, touch selection and reduced
motion are supported. Filing updates state once; double clicks cannot duplicate
photos. Leaving during a flight cannot repaint another activity.

Run `python scripts/check-conditional-folders.py` and
`python scripts/check-conditional-folder-sorting.py`; use CONDITIONAL_FOLDERS_ROOT to
exercise the exact production checkout. Covers provenance and coverage, all three
catalogs, distinct photos, hidden examples, writing, real animations, drag/drop,
folder counts/reopening, persistence, direct links, keyboard, reduced motion,
320/390px framing and loaded assets. The sorting suite tries every destination
for every one of the 79 tasks and verifies legacy placement/draft migration. Existing B1 revision and Kids checks cover
catalog regressions independently.
