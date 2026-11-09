# Card stacks

Question, sentence, picture and GIF decks use one shared renderer in `card-stacks.js`. Cards flip on click, Enter or Space; **Next / Back** and the arrow keys navigate the same finite set. Navigation does not grade or discard cards. Returning preserves each card's side, hints and drafts.

Six paired animations from [Codrops CardStackEffects](https://github.com/codrops/CardStackEffects) are vendored locally: Yuda, Krisna, Wangi, Wira, Slamet and Eka. A shuffled bag uses each before repeating. Back uses the paired reverse exit. Original keyframes and the MIT license are in `vendor/card-stack-effects/`. Reduced motion skips the movement.

Cards use the site's cream, burgundy, blue, orange and green, plus the approved lavender, pink, yellow, olive and coral. Picture/question cards have a coloured image area and a white text area. Images and GIFs load only when their card/side is visited. Hidden cards are inert; card height follows the active content.

Adapters preserve exercise-specific behaviour:

- Interview, jobs and ownership keep their own questions, answer prompts and hint rules.
- The coin photobooth prints one scene with five questions; the reverse retains its magnifier.
- Reporter corrections keep their input, checking and per-card drafts.
- There is / are comparisons retain two pictures; dark-memory mode retains its light switch.
- How to? retains one object, the verb list and shared linking-word hints.
- Fix the time retains Rough Notation word marking, correction checking and Cancel.
- Alias / Taboo keep their round handlers and hints through navigation and rerenders.
- Tense Switch and GIF/speaking decks keep their original prompts and models.

Fridges, room furnishing, the pond, typewriters and the ocean Sentence Expander keep their physical mechanics. They are not replaced by generic cards.

Shared-link event replay waits for card movement to finish, including when teacher and pupil use different motion preferences. Existing live-answer snapshots remain unchanged.

## Verification

`python scripts/check-card-stacks.py` exercises 34 real card routes, all six effects, flip/Back history, special tasks, shared-link keyboard replay, mobile layout and disposal during animation. Existing card-refresh, time-workshop, practical-actions, practice-layout, grammar-perspectives, shared-games, live-answers and sentence-expander scripts cover the surrounding exercise flows. Live-answer checks use the local API contract; production Firebase access is not verified by those checks.
