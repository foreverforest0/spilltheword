# Grammar Photobooth

A standalone B1 activity, linked from Grammar Games → Photobooth.

Insert the coin, answer three questions, watch the shutter/countdown/flash, then watch the completed strip feed smoothly out of the illustrated slot. The strip can be downloaded as a PNG. Topic and exercise mode are the only selectors.

The initial bank contains 20 topics with three illustrated cases each. Each case supports completion, multiple choice and correcting one mistake (180 exercise presentations). The asset library contains all 240 individually cropped scenes from the 20 generated illustration sheets; each case explicitly selects its corresponding image. Additional scene-specific cases can be added in `data.js`.

No camera, external API, package installation, build step or authentication is needed. Serve this repository as a static site. `index.html`, `style.css`, `app.js`, `data.js` and `assets/` form the standalone folder.

Verification: all 180 exercise presentations; wrong-answer rejection; coin/shutter/countdown/flash state transitions; intermediate and final printing positions; PNG download; 390px and 768px layouts; reduced motion; integrated entry and iframe resizing. Also verified a bundled single HTML with embedded assets and its PNG download.
