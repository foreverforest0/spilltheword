# Unbox it

Replaces the Invention Factory presentation for the existing B1/B2 relative-clause activities. Existing topic IDs and reviewed exercise banks remain in use. Preview: `index.html?unbox=1` (`&level=b2` for B2).

The original four relative-clause collections offer a task, answer format and contents before starting. The two newer B1 games open directly into unpacking with a fixed object/card presentation and typed answer. Pick up the knife and trace the dotted tape seam. Cut coverage persists across strokes; an incomplete or distant stroke does not open the parcel. The flaps then open, and a separate click lifts the patterned paper aside to reveal an object, a card, or both. “Choose task” and “Topics” cancel pending animation callbacks.

Transparent PNG assets are cropped in SVG at display time: `parts.png` contains the approved parcel/tools/cards, `papers.png` the six wrapping patterns, `open-box.png` the open carton, and `objects.png` twenty photographic objects. People and locations use the existing illustrations printed as postcards. Opening uses authored layered transitions rather than a physics simulation. The page inherits the application's background.

Mouse, touch and keyboard are supported. With the keyboard, focus the knife and press Enter, then press Enter on the parcel; focus the paper and press Enter to unwrap. Reduced-motion preferences shorten transitions. Sound respects the existing sound setting.

Validation: `python scripts/check-unbox.py` (Python Playwright and Chromium), `python scripts/check-b1-content.py`, and `node --check unbox/app.js`.

## Additional B1 collections

`tasks.js` adds two B1 games with direct entry from their grammar topics:

- **Whose parcel is it?**: 15 owner clues. Unpack the object, join the two short clues using `whose`, and type the complete sentence.
- **The story of an object**: 38 fictional labels across Present Simple, Past Simple, Present Continuous, Present Perfect and Future Simple Passive. Unpack the object, read its verb/place/time tag, and type a sentence. The label is also printed on the small physical card inside the box. The task shows the requested passive form and sentence opening; it does not provide an active sentence. Natural final-position alternatives for `already` are accepted.

There is no setup screen, contents choice, answer-mode choice or tense selector in these two games. They always show the object and clue card, and use one typed answer field. “Topics” remains available during every animation; restarting the finished collection goes directly to a new parcel. Saved preferences for the older collections do not affect these defaults.

`finds-1.png` and `finds-2.png` are the two approved transparent twelve-object sheets. SVG crop rectangles account for the second sheet’s unequal row spacing. Preview: `index.html?unbox=1&task=passive` or `index.html?unbox=1&task=whose`. Validate with `python scripts/check-unbox-b1.py` (all 53 situations, accepted alternatives, rejected wrong forms, direct routes, completion, cancellation and mobile).
