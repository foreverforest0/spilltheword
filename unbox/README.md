# Unbox it

Replaces the Invention Factory presentation for the existing B1/B2 relative-clause activities. Existing topic IDs and reviewed exercise banks remain in use. Preview: `index.html?unbox=1` (`&level=b2` for B2).

Choose a task, answer format and contents before starting. Pick up the knife and trace the dotted tape seam. Cut coverage persists across strokes; an incomplete or distant stroke does not open the parcel. The flaps then open, and a separate click lifts the patterned paper aside to reveal an object, a card, or both. “Choose task” and “Topics” cancel pending animation callbacks.

Transparent PNG assets are cropped in SVG at display time: `parts.png` contains the approved parcel/tools/cards, `papers.png` the six wrapping patterns, `open-box.png` the open carton, and `objects.png` twenty photographic objects. People and locations use the existing illustrations printed as postcards. Opening uses authored layered transitions rather than a physics simulation. The page inherits the application's background.

Mouse, touch and keyboard are supported. With the keyboard, focus the knife and press Enter, then press Enter on the parcel; focus the paper and press Enter to unwrap. Reduced-motion preferences shorten transitions. Sound respects the existing sound setting.

Validation: `python scripts/check-unbox.py` (Python Playwright and Chromium), `python scripts/check-b1-content.py`, and `node --check unbox/app.js`.
