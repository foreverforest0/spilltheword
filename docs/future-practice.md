# Future practice and the timetable printer

Grammar has two independent future entry cards above the existing topic catalog:

1. `future_basic`: Future Simple / will / going to; contains will, going to,
   and `future_timetable` (Present Simple for future schedules).
2. `future_advanced`: Future Continuous / Future Perfect / Future Perfect
   Continuous; each form has a separate practice bank and route.

The five new authored banks contain 54 prompts in total. Each seven-question
round has one context and one prompt per screen, a short written answer or oral
mode, Show answer, previous/next navigation, saved drafts and saved model reveals.
There is no automatic marking of freely worded answers.

Timetable has 28 ticket variants across ten kinds. A seven-ticket round always
includes a film, park, museum, train and flight, plus two other kinds. Identities
never repeat within the round. Names of venues, film titles and carriers are
real; official identity URLs are recorded with each row in the data. Dates and
times are authored educational schedules, not checked live availability, bookings
or film showings. How to explains this and each ticket says Practice ticket.
All displayed dates are future dates when a round is created. Old rounds with
past dates are refreshed on entry. All times refer to the local event/departure/
arrival location printed on the ticket. Arrival tickets identify the destination.

The printer's housing and printed stub use the supplied reference photograph
through a viewport crop; the original source is not redrawn. Tickets feed out,
then rest below the stub. Seven numbered history controls allow reviewing prior
tickets without losing notes or revealed answers. Oral mode requires no
microphone. Printing is locked while an animation runs, respects reduced motion
and is disposed safely when leaving. Shared-game replay uses immediate printing.

Future entry cards are hidden in Kids. A1 and A2 show only will / going to;
the timetable and advanced future room are available at higher levels. Existing topic
numbers and the 66 registered pond/expander topics are unchanged.

Validation: `python scripts/check-future-practice.py` checks entry navigation,
all banks, seven different tickets, times/questions/models, modes, persistence,
review, a new round, mobile widths and the real print-animation lifecycle.

Printer audio is the user-supplied thermal-receipt print-and-cut MP3, copied
byte for byte to `assets/timetable/printer.mp3` (1.593 s container duration).
Playback begins only on a print click; the animation begins once playback starts
and uses the decoded clip duration. The site's sound toggle mutes playback;
leaving stops and resets it. Reduced motion preserves the full audio without
animating the paper. Shared-game replay is silent. The generic synthesized
button click is suppressed for the printer control so the supplied recording
is heard without an extra effect.


## Printed future documents and Time lift

`future-time-data.js` adds 30 authored documents (10 per advanced future form).
`future_print_continuous`, `future_print_perfect` and
`future_print_perfectcontinuous` select seven unique documents. `future_print_mix`
selects three continuous, two perfect and two perfect-continuous documents and
shuffles them. These are practice plans, not live schedules. Small task fields,
separate hidden Hint and Show answers, drafts, reveals and printed history are
saved per run. There is no automatic grading of open answers or Speak toggle.
The supplied receipt-printer MP3 and existing printer housing are reused.

`future_lift` reuses the existing elevator silhouette and door mechanics with
seven time labels instead of floors. A single planned day distinguishes an
activity at a moment, a completed result by a deadline and duration up to a
future checkpoint. Doors close before travel; the user opens them after arrival.
A traveller and relevant travel objects are displayed inside. All facts stay
accessible in the task panel. The illustrated clock is only shown at ten, its
actual face time. The London–Paris exercise explicitly uses one time zone for
all its times. SVG clip regions isolate individual transparent illustrations
from `assets/time-lift/travel-sheet.png`; illustrations were generated from the
approved style previews. Visible task wording does not provide the target
auxiliary structure. Hints explain the meaning; answers provide examples.

Door, motor, floor and arrival effects use the site's sound preference. Travel
timers are cancelled on navigation; reduced motion and shared replay are
immediate (and replay is silent). Answers and stop selection survive reload.

Kids / A1 / A2 now use yellow-green, pink, blue, orange and cream. Small text on
orange uses a darker navy for contrast. Image regions, task papers, reverse
cards and controls inherit the new palette without altering original PNG art.

Validation: `python scripts/check-future-time.py` checks all four printer runs,
a balanced mixed set, drafts/reveals/history/reload, lift door and travel states,
timer cancellation, 320/390/768/1440 layouts and catalog text contrast.


Kids does not show any future entry cards. A1 and A2 show the basic entry only,
with exactly will and going to inside it. Timetable is no longer appended to
Present Simple in these three levels. Advanced printers and the lift remain in
the higher-level room. This visibility follows the selected catalog level.
