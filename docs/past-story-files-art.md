# Story folders: artwork and content

Eight fictional stories use olive and rose/maroon folders based on the user's
reference. The notebook binding and the old staged question-player/blue drawings
are removed. Original Present Perfect folders remain unchanged.

Every folder opens with all keepsakes visible: two realistic photographs, physical
objects, readable paper clues and one voice message. There are no guided questions,
model stories, vocabulary panels or automatic grading. A separate loose sheet is
available for writing. Desktop objects can be rearranged; mobile shows a grid.
Writing/layout save per level/story. Existing notebook drafts and the prior
player's final-story drafts migrate without deleting old data.

## Object roles

- Hairpins: Amelia secures the broken zip of the bag hiding her dog; one falls out
  during the interview (The unexpected candidate).
- Crumpled speech: a farewell speech drafted before the full message was read;
  discarded after the mistaken party (We will miss you… apparently).
- Gum wrapper: a train-journey reminder links the Secret Santa gift to a saved
  screenshot (Secret Santa knows too much).
- Cassette, chocolate, receipt/coins: an unheard apology on side B and proof of
  payment change Oliver's memory of a falling-out (The apology on side B).
  The cassette itself is the voice-message item.
- Key 1301, UNO, newspaper: Florence gives her last available hotel room to a
  stranded family, plays cards with other travellers and sleeps in the breakfast
  room; scores are written in newspaper margins (The room she gave away).
- MetroCard and plasters: mistaken for a booked film extra, Harry misses coffee
  with a friend and rubs his heel during repeated takes (The stranger in take four).
- Existing cake, ring box, teapot and mug stay in their original stories.

B1/B2 paper wording differs where appropriate. British character names are used.
The New York MetroCard story is explicitly set in 2024.

## Asset provenance

Sixteen realistic fictional photos and photographed object atlases are unchanged
source PNGs, selected with SVG viewports. SHA-256 hashes, bounds and source paths
are in assets/past-notebooks/manifest.json. The newly generated objects are
analogues of the user's inline references, not exact original cutouts. The original
full-resolution reference images need an accessible archive before exact cutouts
can replace them. Folder shapes/textures are CSS, without reference watermarks.
Paper clues are readable HTML rather than generated image text.

Audio remains pending the user's recordings. All eight scripts/filenames are in
shared/downloads/story-folder-audio/eight-voice-messages.txt (outside the repo).
Each audio field stays null until its recording is connected. No fake playback
button or missing-file request is shown. Existing five scripts remain unchanged.

Run: python scripts/check-past-story-files.py
The browser check covers both levels, all details, draft migration, layout/note
persistence, mobile, audio wiring and original Present Perfect folder isolation.
