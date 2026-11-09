# The Writing Room

The home-shelf book opens `go('bard')`, an embedded Shakespeare vocabulary activity in `writing-room/`. It starts with the animated full-room illustration and an explicit **Open the letter** button. Opening it switches to the desk-only writing view; **← Room** returns without losing the draft. The room video pauses while writing and respects reduced motion.

The source sentence is always visible at the top of the parchment. The extra context is on the blue note beside it. An explicit **how to?** button toggles instructions with `aria-expanded` and a controlled section, including mouse, keyboard and shared-link replay. The section expands above the scene without covering it. Opening the letter brings the original sentence into view; the parent iframe bridge validates message origin/source before scrolling, including after shared-link restoration. B1, B2 and C1 each have three curated prompts. The word parchment offers definitions and usage highlights without grading vocabulary or meaning.

The working view contains only the desk, writing objects, two wall portraits and a complete arched window to the right of the desk. The window is a separate transparent asset with the formerly occluding books removed, so all four sides remain visible. The previous full room is not shown beside the letter. Styles/scripts and the iframe entry carry a version query to avoid mixing cached revisions after deployment.

The answer is a real labelled textarea drawn transparently over the illustrated parchment, using the locally hosted OFL-licensed **La Belle Aurore** handwriting font. Its caret, selection, multiline input, paste and scrolling remain native. A quill follows the measured caret position. Drafts are retained per level and prompt during a game.

## Checking and paper animation

An explicit Check sends the current text to LanguageTool's public English-GB endpoint. Only matches with `rule.issueType === 'grammar'` reject a page. Style, spelling, punctuation and vocabulary suggestions do not reject it. No grammar match means no issue was detected by that service, not a guarantee of correctness. Meaning preservation and the task's vocabulary are not automatically graded.

On rejection the page crumples and a paper ball flies between the basket's back and front layers. The draft is retained and the first reported issue is selected for correction. On acceptance a decorative W. Shakespeare signature appears, the page moves to the stack, and a fresh prompt opens. Signed pages can be read from the stack.

HTTP errors, rate limits, timeouts, malformed responses and incomplete-result warnings never count as acceptance. The draft stays in place with an error message. The endpoint can be replaced with a project-owned checker later; no secret is placed in browser code.

## Shared sessions

Copy link records the iframe's normal inputs and navigation. The bridge additionally includes a bounded ordered history of completed grammar verdicts, including failures. Replay uses those historical outcomes without repeating network requests; a subsequent new check still uses the live service. The parent waits for checking and paper animation to settle. Iframe height messages verify origin and source. Signed text and checker messages are rendered as text, not HTML.

## Assets and validation

The user-approved generated assets are packaged losslessly as WebP; the original source files remain in `/workspace/generated_images`. Basket layers retain the same full canvas and align exactly. The original room image supplies the two portrait crops; its animation is used on the entrance screen. Font attribution and license are in `writing-room/fonts/OFL.txt`.

`python scripts/check-writing-room.py` covers the real home-book entry, all three levels, hidden instructions, transparent handwriting editor, quill movement, draft retention, grammar-only decisions, failed/incomplete service responses, real paper animations, signed-page reading, matching shared-link replay without repeated API calls and mobile layout. API responses are mocked for this test. The managed environment denied access to `api.languagetool.org` (HTTP CONNECT 403); production LanguageTool connectivity and coverage remain unverified.
