# Present Perfect — video scenes

Entry: Grammar → B1 → Present Perfect → **Video: what just happened?** (`ppvideo`).

Eight locally hosted, reviewed excerpts from two openly licensed Blender animations, grouped into four independent types of practice:

| Group | Clips | Focus |
| --- | --- | --- |
| What just happened? | helmet, takeoff | Completed action; has + V3; just; keep phrasal-verb particles |
| Already / not yet | bowl, checklist | Current completed/unfinished parts of an explicit plan; statement + negative; already/yet |
| Ask & answer | meal, engine | Yes/no question word order; has; short positive answer |
| Before / after | goggles, gone | Visible change; singular has / plural have; regular and irregular V3 |

## Viewing and writing

One video and its short task stay on screen. Native player controls and Play/Replay let learners pause, scrub or repeat. Clips do not loop or start automatically. They are silent and hold their final frame briefly. The end status invites a description of the result now inside the scene, rather than a past-time claim about a film made in 2017 or 2023.

Already/not-yet prompts supply a plan so the negative has a clear meaning. Before/after offers a separate two-still comparison. Hint reveals only a verb/principle. Show answer is independent and shows one authored example per field. It neither checks the learner's wording nor completes a task. There is no automatic grammar grading or score; other valid descriptions can be discussed with the teacher. This is an initial focused video bank, not complete coverage of every Present Perfect aspect.

Answers, hints, models and comparison-panel state are kept separately per clip in `S.ppVideo`, using existing persistence. Changing a group/clip and returning or refreshing preserves drafts. Arrow navigation is scoped to the activity; textarea and native video keyboard input retain their own behavior. Leaving/changing the scene pauses and unloads the previous video and removes media handlers.

## Sharing and live viewing

Copy link uses the existing recipe/input replay. It restores the selected group/clip, written answers and disclosures. Playback time/rate is independent, not synchronized between browsers. No transport changes.

The existing live snapshot sanitizer removes video tags. This activity therefore supplies a static JPEG of the current frame, throttled to roughly once a second during playback and updated on pause/end/seek. It is hidden in the actual player, and the activity CSS displays it when the live sanitizer removes the video element. The teacher receives the frame plus current answers through the existing read-only snapshot, without embedding a playable video into that snapshot. Frame capture is local same-origin canvas work; no remote service is called.

## Sources and assets

- `assets/present-perfect-video/SOURCES.md`: creator attribution, licence links, modifications, pinned source-copy revision and timing convention.
- `assets/present-perfect-video/manifest.json`: eight source ranges and actual encoded-file metadata.
- Eight silent H.264 MP4s and sixteen before/after JPEGs, about 3.5 MB together.
- `present-perfect-video-data.js`: groups, scene-specific prompts, hints and authored examples.
- `present-perfect-video.js` / `.css`: viewing, draft storage, disclosure, snapshot fallback and responsive layout.

The previously proposed Archive.org/Prelinger titles remain candidates only. Archive.org access was still denied by the runtime network policy, so those files were not downloaded, cut or presented as reviewed. This first working set uses separately accessible copies of CC BY 4.0 Blender films. It contains neither AI-generated videos nor an external streaming dependency.

## Verification

`python scripts/check-present-perfect-video.py` uses real Chromium playback for all eight local files, checks the final state and error-free decode, exercises every prompt/field/hint/model, switches and restores drafts, reloads, opens Copy link in a clean context, inspects the static live snapshot and tests keyboard, cleanup and 390/768/1440px layouts. `ffprobe` verifies the asset manifest, silence and H.264 dimensions.
