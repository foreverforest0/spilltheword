# The Writing Room

The home-shelf book opens `go('bard')`. The entrance shows the full room and an **Open the letter** button. Its original head-scratching video is supplemented by local SVG motion: the globe map rotates within its stationary frame, both portraits and Shakespeare blink, and three fingertips tap with staggered timing. Pause controls both the video and SVG timeline; the scene pauses while writing and starts paused with reduced motion.

The writing view contains the desk and one oval portrait of Shakespeare. The window and the two earlier portraits are removed only from this close view. The inkwell, signed-page stack and basket sit higher. The source sentence remains visible on the parchment. How to is an explicit button that expands instructions in normal flow. The iframe bridge brings the source into view after entry/restoration and verifies message origin and source.

B1, B2 and C1 each have three prompts. Every prompt now has three short detail choices: an action, emotion, reason or related context. **Another detail** changes the blue note without clearing the draft or source. Choices persist across level and room navigation within a session. Hint definitions and usage highlights do not grade vocabulary or meaning.

The answer is a real labelled textarea, transparently overlaid on the illustrated parchment, using the locally hosted OFL-licensed La Belle Aurore font. The quill starts in the clickable inkwell. Writing and checking remain locked until the learner takes it with mouse or keyboard; pickup is recorded in shared sessions. The quill then follows its measured caret. It stays available across tasks and room navigation. Drafts are retained per level and prompt.

## Grammar and corrections

Check requests LanguageTool English-GB with `level=picky`. The former exact `issueType === 'grammar'` filter discarded spelling, typographical and uncategorized corrections. The response adapter now retains error categories, offsets and replacement candidates while excluding optional style/register/locale/formatting suggestions. Invalid ranges, malformed responses, incomplete results, non-English detection, service failures, rate limits and timeouts cannot earn a signature.

A small conservative set of local form guards supplements the service for common agreement, auxiliary and participle errors. It preserves valid conditional/mandative subjunctives. These guards are not a complete grammar checker. If the service fails but the guards find errors, the page can still show those known issues; a clean local result alone cannot pass an unavailable service.

Errors remain on the parchment as clickable spans, marked with the existing Rough Notation library: circle, strike-through or crossed-off. Clicking a mark opens the explanation, suggested replacements and an editable correction field. Applying a replacement updates later issue offsets and preserves all other text. Edit draft returns to normal typing. Corrected text must be checked again before signing; neither applying a suggestion nor clearing visible marks grants acceptance. The page is no longer thrown away before the learner can review its errors.

A successfully rechecked page receives a decorative signature, moves into the stack, and opens a fresh prompt. The stack retains signed versions for reading. The checker does not grade meaning preservation or CEFR appropriateness.

## Sharing and assets

Copy link records normal iframe actions and an ordered, bounded history of completed checks, including replacements and failures. Checker history version 2 is required; older filtered acceptance histories are rejected with a request for a fresh game rather than replayed as correct. Replays use recorded outcomes without repeating network requests. New checks still use the live checker. Popup content, suggestions and drafts are rendered as text, never remote HTML.

Generated artwork is packaged losslessly as WebP; originals remain in `/workspace/generated_images`. The basket layers retain identical full canvases. The room artwork and video are reused by the SVG motion layer. The window is a separate transparent asset. Font licensing is in `writing-room/fonts/OFL.txt`. Version query strings prevent mixing cached iframe, stylesheet and script revisions.

## Verification

- `python scripts/check-writing-room.py`: real book/room entry, visible source, mouse/keyboard How to, B1/B2/C1 drafts, quill pickup and shared readiness, single portrait, handwriting, correction-first behaviour, failed/incomplete service responses, signed-page animation, shared verdict replay and mobile layout.
- `python scripts/check-writing-corrections.py`: local form guards and valid subjunctives; spelling/typographical/uncategorized service matches; all three annotation types; replacement offsets; manual correction; mandatory recheck; shared correction actions; detail choices; actual globe/blink/finger timelines; mobile popup containment.

Browser tests mock remote grammar responses. The managed environment denied `api.languagetool.org` with HTTP CONNECT 403 in this session; live production service availability and coverage remain unverified. Local form guards and the correction interface are tested independently of that access.

The same Rough Notation correction interaction is also used by **Grammar → A1 → 10 · Time → Fix the time**, including its legacy Grammar Lab `ftt` entry.
