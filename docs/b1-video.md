# B1 films: one prompt per viewing

Each B1 topic has one `film_b1_N` activity with five videos. Each video contains a short sequence of separate prompts, covering one question or one/two sentences per viewing. There are 181 prompts across the 55 clips. Present Perfect's second video has exactly three prompts: already statement, not-yet statement, and a yet question with a short answer.

Only the current prompt, optional necessary context, answer box, Show answer and navigation are displayed. The stage/focus caption, notes label, generic viewing instructions and example disclaimer are removed. Every prompt has its own examples and no automatic grading. Next/Back resets and replays the video, including when moving between prompts for the same clip, while preserving mute/volume settings.

`S.b1Cinema[topicNumber]` stores the video (`step`), question (`task`), individual drafts, answer reveals and completion. `sequenceVersion: 2` starts the revised sequence at the beginning. Previous combined notes remain in the saved data and appear on the first question for their video; they do not spill into later questions. New drafts/reveals are keyed by stable question IDs. Back crosses video boundaries to the previous video's final question; completion happens only after the final question of video five.

The television and local media are retained. The original user-supplied 15-frame `the-end.gif` appears at completion. 55 local 35-second H.264 clips and posters are in `assets/b1-video/`, with source copies and time ranges recorded in `sources.json`. Four silent-film soundtracks are omitted; His Girl Friday retains its film audio. Archive metadata labels are recorded without extending claims to all editions or soundtracks.

Validation: `python3 scripts/check-b1-video.py` visits all 181 prompts, plays all 55 clips, checks same-clip automatic replay, prompt-specific examples and notes, navigation/reload/migration, all 11 GIF endings, removal of unwanted copy, player cleanup and mobile layouts.
