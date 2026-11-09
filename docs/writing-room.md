# The Writing Room

The new home-shelf book opens `go('bard')`, an embedded Shakespeare vocabulary activity in `writing-room/`. The general room view stays visible beside the illustrated desk. The room animation is muted, loops, has a pause control and respects reduced-motion preferences.

The source sentence, extra context and instructions live inside the closed **how to?** disclosure. It expands in normal flow above the scene. Three curated prompts per level are included for B1, B2 and C1. The word parchment offers short definitions and highlights words when used; it does not grade vocabulary or semantic accuracy.

The answer is a real labelled textarea drawn transparently over the illustrated parchment, using the locally hosted OFL-licensed **La Belle Aurore** handwriting font. Its caret, selection, multiline input, paste and scrolling remain native. A quill follows the measured caret position. Drafts are retained per level and prompt during a game.

## Checking and paper animation

An explicit Check sends the current text to LanguageTool's public English-GB endpoint. Only matches with `rule.issueType === 'grammar'` reject a page. Style, spelling, punctuation and vocabulary suggestions do not reject it. No grammar match means no issue was detected by that service, not a guarantee of correctness. Meaning preservation and the task's vocabulary are not automatically graded.

On rejection the page crumples and a paper ball flies between the basket's back and front layers. The draft is retained and the first reported issue is selected for correction. On acceptance a decorative W. Shakespeare signature appears, the page moves to the stack, and a fresh prompt opens. Signed pages can be read from the stack.

HTTP errors, rate limits, timeouts, malformed responses and incomplete-result warnings never count as acceptance. The draft stays in place with an error message. The endpoint can be replaced with a project-owned checker later; no secret is placed in browser code.

## Shared sessions

Copy link records the iframe's normal inputs and navigation. The bridge additionally includes a bounded ordered history of completed grammar verdicts, including failures. Replay uses those historical outcomes without repeating network requests; a subsequent new check still uses the live service. The parent waits for checking and paper animation to settle. Iframe height messages verify origin and source. Signed text and checker messages are rendered as text, not HTML.

## Assets and validation

The user-approved generated assets are packaged losslessly as WebP; the original source files remain in `/workspace/generated_images`. Basket layers retain the same full canvas and align exactly. The original animated room MP4 is reused. Font attribution and license are in `writing-room/fonts/OFL.txt`.

`python scripts/check-writing-room.py` covers the real home-book entry, all three levels, hidden instructions, transparent handwriting editor, quill movement, draft retention, grammar-only decisions, failed/incomplete service responses, real paper animations, signed-page reading, matching shared-link replay without repeated API calls and mobile layout. API responses are mocked for this test. The managed environment denied access to `api.languagetool.org` (HTTP CONNECT 403); production LanguageTool connectivity and coverage remain unverified.
