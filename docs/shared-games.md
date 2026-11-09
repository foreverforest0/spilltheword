# Sharing games and live answers

Each main game has **Copy link**. It opens a playable copy of the same exercise, generated set and recorded interactions. Links retain the current grammar level, mode, card changes, text inputs and pointer actions. The pupil works independently; the teacher uses **See answers** to view their screen and answers. The latest copied session is remembered in the teacher tab across navigation and reloads.

Shared sets are encoded in `#play=…`; opening them does not require a backend. They use a seeded recipe and a bounded input-event replay, rather than a screenshot. A long session can exceed the link size limit; the interface then asks for a fresh round. Recipes are specific to the deployed game version.

Live viewing uses the existing Firebase compat loader, anonymous authentication and Firestore `watch/live-<session hash>/s/<student id>`. It sends encrypted snapshots at most once per second while the game changes, with a heartbeat every 15 seconds. Embedded apps, form values and drawing canvases are included. The viewer disables scripts and interaction in its preview frames. BroadcastChannel supports tabs on the same browser as well. Connection failures are shown explicitly and retried.

The current Firestore project and rules are reused, without configuration or rule changes. They must permit authenticated anonymous clients to read and write the existing `watch/{session}/s/{student}` documents. No server credentials are added to share links.

## Verification

- `python scripts/check-shared-games.py`: actual clipboard button, identical decks and later New cards, pond question/draft/hint, dragged fridge magnets, embedded portrait edits, creative-writing text and home game entries in independent browser contexts.
- `python scripts/check-live-answers.py`: encrypted updates across independent contexts using a local Firestore API test backend, changed answers, drawings, embedded portraits, CSS, read-only preview and explicit offline state.
- `python scripts/check-question-pond.py`: pond routes, answers, drawing and fish return.
- `python scripts/check-practice-layout.py`: six fridge levels, dragging, responsive layout and A1 activities.

The managed development environment blocks the Firebase hosts, so real Firestore access and rules could not be verified there. After deployment, open a copied link on a second device, enter an answer or move a magnet, and confirm it appears under **See answers**. Both pages report the cloud connection status; an unavailable service does not prevent playing the shared exercise.
