# Video sources and attribution

The eight local excerpts are from these openly licensed films:

- **Wing It! (2023)** — directed by **Rik Schutte**. Blender Studio / Blender Foundation. [Original project](https://studio.blender.org/projects/wing-it/). [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). See [source credits](wing-it-credits.md).
- **The Daily Dweebs (2017)** — directed/animated by **Hjalti Hjálmarsson**. Blender Animation Studio / Blender Foundation. [Original project](https://studio.blender.org/projects/dailydweebs/). [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). See [source credits](daily-dweebs-credits.md).

Source copies: the public `rightonhana/blender-studios-hls` repository, pinned at commit [`f04f5f4df52914b3fef2ec91b1228d971c7d9bea`](https://github.com/rightonhana/blender-studios-hls/tree/f04f5f4df52914b3fef2ec91b1228d971c7d9bea), folders `wing-it` and `the-daily-dweebs`. Each folder's README identifies the source film, creators and CC BY 4.0 licence; copies of these credit records accompany our excerpts here. The clips are not footage from the earlier Prelinger shortlist. Direct Archive.org access was blocked during preparation.

Changes by Spill the Word: excerpts selected in time; audio removed; re-encoded as H.264 MP4 at 960×540, 24 fps; approximately one second of the final image held for observation. Before/after JPEGs are stills of those same excerpts. No new events or generated frames have been added. These excerpts are adaptations, not original unedited film files. The filmmakers do not endorse the grammar prompts.

`manifest.json` records source-film ranges in seconds, actual excerpt duration and size. Ranges refer to the pinned HLS copies after a local video-only MP4 remux with timestamps starting at zero; other editions/players may differ. Each selected excerpt and its first/last frame was reviewed.

To reproduce from the corresponding local remuxes, select input time **before** `-i`, e.g.:

```sh
ffmpeg -ss 46 -t 5.7 -i dweebs.mp4 -map 0:v:0 -an \
  -vf 'scale=960:540,fps=24,tpad=stop_mode=clone:stop_duration=1' \
  -c:v libx264 -crf 24 -preset fast -pix_fmt yuv420p \
  -movflags +faststart gone.mp4
```

Keep these credits and the licence links when redistributing the excerpts. Licence terms for the videos remain CC BY 4.0 independently of the website code.
