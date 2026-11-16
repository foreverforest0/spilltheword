# Five-stage B1 film practice

Each of the 11 B1 grammar topics has one `film_b1_N` activity with five stages. The previous `ppvideo` route opens the new Present Perfect training; saved `S.ppVideo` data from the older animation exercise is left intact.

The television is a scalable line drawing based on the supplied reference. The local video plays in its screen; tasks sit on the right and stack below it on phones. Navigation is Back / Next / Finish, with Show answer on every exercise stage. There is no answer matcher, score, required text or automatic pass/fail. All 189 authored models are shown as examples; other correct wording is possible. Extra story cards are explicitly distinguished from film facts and original dialogue.

`S.b1Cinema[topicNumber]` keeps the step, individual drafts, answer reveals and completion state. Switching steps or leaving the activity pauses and unloads the old player. Completion uses the user's original 15-frame `the-end.gif`, extracted unchanged from their ZIP, inside the same television. Review stage 5 returns to the saved notes and allows Back navigation.

55 local, 35-second H.264 clips and JPEG posters live in `assets/b1-video/`. The archive identifiers, source-file names and time ranges are documented in `assets/b1-video/sources.json`; every stage links to the original Archive item. Four sources are silent films with audio omitted; the His Girl Friday excerpts retain their film audio. No runtime request to archive.org is required for playback.

The metadata's public-domain labels, where provided, are recorded as source metadata, not a claim that all editions or soundtracks have identical rights. Modern soundtrack tracks on silent films are not included.

Checks:

- `python3 scripts/check-b1-video.py`: inspect all 55 H.264 media files, play every clip, visit every stage, reveal every model, keep drafts across navigation and reload, check all 11 original-GIF endings, compatibility route, unload old media, and responsive layouts.
- `python3 scripts/check-present-perfect-b1.py`: preserve the existing Present Perfect typewriter, fridge and pond update.
