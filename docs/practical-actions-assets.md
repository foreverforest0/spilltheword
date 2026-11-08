# Practical actions asset selection

Pack the bag uses a fixed, visually reviewed pool of 12 photographic cutouts: keys, camera, books, notebook, wallet, passport, umbrella, apples, cookies, water, bananas and teddy bears. Each is fully visible in a contained image box. These references are defined in `practical-actions.js`.

The old random `Object.keys(BGI)` selection is no longer used by this activity. In particular, the flat outlined sunglasses, sunscreen, towel, hat, flip-flops, scarf, gloves, jacket, pen, sandwich, toothbrush, ticket, passport and headphones icons cannot appear in Pack the bag. The old smartphone with a conspicuous pale jagged edge and the temporary lip-gloss SVG are also excluded. A photographic wallet/passport replaces those vector versions.

Referenced originals remain available to other activities. Removing an image from this activity's pool does not delete shared files or break other games. The earlier full-site replacement review remains in `image-audit-2026-11-08.json`; this change does not claim to replace every outstanding source image in that review.

How to uses one object image per card. Countable/uncountable sorting uses existing product/food photographs; the cropped `ch/p_milk.webp` is replaced by `shop/dairy/whole-milk.webp`. Sorting cards use a fixed image height, transparent backgrounds, `object-fit: contain` and no move/drop animations. Objects occupy four dedicated slots on each real shelf, with no overlap or free positioning.
