Original wobbly pencil artwork

The complete primary drawings come from b5eea8f; primary action drawings come
from 8dd6c2c. Later bcdf2f0 cutouts were already damaged: pale clothing and skin
had been erased. They are no longer used as image sources.

78 primary pictures and 29 matching pencil-style actions are exported to padded
RGBA PNGs. Source RGB and pencil texture are preserved exactly. Transparency is
built around whole silhouettes; enclosed pale regions remain opaque. Portrait
boundaries are bridged across pale clothing and necks instead of removing these
colours as paper. Room scenes retain their original backgrounds.

The -whole.png filenames avoid browsers reusing damaged cached images. The
previous derivatives are retained for old shared links. manifest.json records
source revisions and active paths. scripts/restore-wobbly-art.py reproduces all
exports. The smooth alternate action series stays excluded.
