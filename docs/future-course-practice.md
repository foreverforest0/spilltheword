# Future practice: B1 and B2

B1 and B2 now show one Future practice entry, containing Future printer and Time lift.
The existing Kids/A1/A2 basic-future entries remain unchanged.

The printer has seven practice modes and Mix: will, going to, Present Continuous
(arrangements), Present Simple (timetables), Future Continuous, Future Perfect,
and Future Perfect Continuous. Each round has seven different tasks; Mix selects
one from each mode. Responses are open, with a hidden semantic Hint and Show answers.
The printer recording and reference image are retained.

`future-level-data.js` contains 49 documents and nine lift stops per level.
Every row records a word and lesson from B1 Course (`b1`) or B2 ALH (`b2alh`).
Timetables use real venues/film titles with supplied teaching times, not live schedules.

Lift travel ends with closed doors. Open doors is the only way to reveal the task.
The duplicate time-stop sidebar was removed. The user's original uploaded MP3 is
stored at `assets/sounds/time-lift.mp3`; sound respects mute and stops on navigation.
Answers, reveals and selected printer mode are stored separately per level.
Old future routes remain available for existing links; earlier progress is retained
in its original storage keys, and the new course-specific rounds use new keys.

Validation: `python scripts/check-future-time.py`; legacy routes and ticket printer:
`python scripts/check-future-practice.py`.
