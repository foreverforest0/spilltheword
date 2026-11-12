# Kids Appearance — Watercolor Portrait Studio

Entry points: home shelf → Appearance, or Grammar Speaking → Kids → Have got / Appearance.

Three modes:
- **Read & build:** a generated description; automatic feedback on hair, eye colour, glasses, headwear, freckles and facial hair. Eye shapes with the same described colour are accepted. Face shape, eyebrows, nose and mouth are freely chosen because the brief does not constrain them. Includes optional device text-to-speech and a teacher reveal.
- **Make your own:** mix the 157 original watercolor parts, name a character and save a PNG. The last free creation is saved in local browser storage.
- **Guess who?:** exactly ten distinct ready-made characters. The child chooses mentally, so the secret is never displayed on a shared screen. The teacher asks questions and crosses cards out. Guess confirmation comes from the child. Print a clean sheet, generate a new sheet, or share a reproducible sheet code/link. Eliminations are local to each screen.

Artwork: all seven source sheets were supplied by the user. Cropped artwork is in `assets/`. `catalog.js` embeds those images so exported portraits and the standalone HTML can work without fetching external images. Parts are composed as SVG image layers, preserving original colors and texture.

No automatic speech recognition, semantic scoring, or live-room synchronization is added. A shared sheet code reproduces the same cast on both screens.

Open `index.html` directly for standalone use, or serve the repository with any static web server for integration with the main site. The downloadable single-file version embeds styles, scripts and all artwork.


Portrait alignment uses the actual opening of each hairstyle, shared eye and mouth landmarks, and native accessory aspect ratios. Hats are anchored to the painted centre of their brim; headphones use the complete original drawing. Ready-made characters use reviewed feature combinations. Free creation retains all original choices.

The ponytail and plaits were recut from the original hairstyle sheet to restore their cropped tops and ends, retaining original visible RGB pixels and adding transparent padding. SVG portraits include extra side room so tall ponytails are not cut off in exports.

Page and activity titles retain their full wave. Subtitles and mode-card names use a shallow, slower wave; the card call-to-action styling no longer changes the weight of individual title letters.

Run `python scripts/check-portrait-studio.py` for browser checks, exports and responsive previews.


**Embed:** the site's toolbar shows Embed next to Copy link. It produces a prepared, independently editable iframe using the shared-game replay. Direct `appearance/index.html` has its own Embed control: it snapshots the current portrait/name, Read & build brief, or Guess who sheet and eliminations into a validated `#studio=` payload. `?embed=1` hides the extra standalone sharing toolbar. No secret person or remote storage is introduced. Run `python scripts/check-prepared-embeds.py` for fresh-browser iframe restoration checks.
