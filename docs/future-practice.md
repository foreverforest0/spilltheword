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

Timetable also appears under Present Simple in Kids, A1 and A2. Existing topic
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
