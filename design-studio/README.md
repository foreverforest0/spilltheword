# Spill the Word design studio

A separate review page at `/design-studio/`, with a comparison at `/design-studio/compare.html`. This branch adds the previews; the application’s root layout is not replaced. Each direction includes home, collection, saved shelf, palette/type guide and a playable Shakespeare exercise. Existing-game links lead to the production app’s existing topic IDs.

## Directions

1. **Paper club (recommended)**: warm pale paper, walnut ink, olive, lavender and terracotta. Real CSS notches on ticket cards, movable stack, rounded primary action, a restrained plaid accent. Corben for headings, DM Sans for instructions.
2. **Playful pop**: larger sans-serif typography, lime/pink/lilac capsules and graphic starbursts.
3. **The reading room**: quiet cream/burgundy/green, Georgia headings and illustrated literary atmosphere.

Common UI structure: one level choice, a clear next action and readable exercise text. Existing games can retain their physical fridge/parcel/photobooth artwork within the shared page shell. Theme choice and saved favourites persist only under the separate `stw-design-preview` localStorage key.

## Shakespeare’s inbox

Original modern micro-stories with Shakespeare receiving messages from the cast. One typed response, a hint, then a wax “Delivered” seal and the next act. Kids/A1: introductions and basic word order; A2: past/perfect forms; B1: backshift in reported speech; B2: past regrets with wish; C1: inversion. There are three prompts per level (18 total), with explicit accepted models and natural contractions. The prompts are original practice material rather than quotations attributed to Shakespeare. No generative service is called during gameplay.

The three designs are fully rendered HTML/CSS. Ticket masks, dragging, bookmarks, responsive layout, wax stamp and reduced-motion behaviour run directly in the browser. The Shakespeare portrait/desk is a single static illustration; moving its quill or hands independently in a future version would need separate illustrated layers.

## Assets and fonts

- `assets/shakespeare.png`: newly generated transparent storybook illustration, responding to the reference mood without copying its layout or lettering.
- `assets/fridge.png`: the approved generated adaptation of the user’s blue fridge, reused in the preview.
- The parcel is rendered from the existing `unbox/assets/parts.png` atlas.
- Corben and DM Sans are bundled locally, with their SIL Open Font Licenses included. No external font requests.

## Review / installation

Open `index.html?theme=paper` (or `pop`, `literary`), optionally `&level=b2&view=lesson`. The preview is a concrete starting point for choosing the shared palette, typography and navigation before applying it to the main application. Full installation should transfer the selected tokens/shell to the app and register Shakespeare as a classroom activity; the current page is the independently testable prototype.

Validation: `python scripts/check-design-studio.py` (Python Playwright + Chromium), and `node --check design-studio/app.js`. Browser checks cover all three concepts, 18 correct/rejected model responses, ticket dragging, navigation, persisted shelf and mobile overflow.
