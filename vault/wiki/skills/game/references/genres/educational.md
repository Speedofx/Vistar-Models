# Educational games

Read this when the brief is teaching something: math practice, typing,
languages, flashcards, geography, spelling, science facts — "a game for my
kids/students to learn X". This is an **overlay, not a genre**: first pick
the base mechanic from another genre file (quiz, word game, arcade, puzzle),
then apply these rules on top. The game must still pass `references/loop.md`
— "educational" never excuses a missing loop.

## Pick the base mechanic

| The brief wants                             | Base                                                               |
| ------------------------------------------- | ------------------------------------------------------------------ |
| Recall facts (tables, vocab, capitals)      | Quiz/flashcards (`genres/word.md`) with the repetition rules below |
| Fluency/speed (mental math, typing)         | Arcade pressure (`genres/arcade.md`): answers as the verb          |
| Understanding a system (fractions, physics) | Puzzle (`genres/puzzle.md`): manipulate until it clicks            |
| Practice a procedure (spelling, sequences)  | Step-based puzzle with an undo stack                               |

The subject is content records (`references/tick.md`): a problem generator
or question list separate from the mechanic, so difficulty and curriculum
tune independently.

## The rules that differ from normal games

- **A wrong answer teaches; it does not punish.** Show the right answer and
  _why_, then re-queue the same concept soon after. Never game-over on a
  wrong answer — pressure comes from time or streaks, not from being thrown
  out. The fail state of `references/loop.md` becomes "the round ends",
  never "you are stupid".
- **Missed items come back.** Keep a per-item wrong-count in state; items
  answered wrong re-enter the queue at a higher frequency until answered
  right twice in a row. This is the whole difference between a quiz and a
  learning tool, and it is ~15 lines of state.
- **Difficulty is curriculum, not just speed.** Ramp through material
  (bigger numbers, longer words, new categories) per the Ramp rules in
  `references/loop.md` — one new concept at a time, mastery before mixing.
  Add speed pressure only when the goal is fluency drill.
- **Reward streaks loudly.** Correct streaks get escalating feel
  (`references/feel.md`) and a visible counter. The reward schedule
  celebrates being right, not merely finishing.
- **Honest progress.** Show what was practiced and what improved (per-topic
  correct rates) on the end screen. Parents and teachers are the buyers;
  "Score 4200" tells them nothing, "12/15 multiplication, 7× table needs
  work" does.

## Tone and age

Readable type at the target age (bigger, shorter words for younger),
`references/ui.md` scaling floors doubly enforced, encouraging copy on
wrong answers ("Not quite — 7 × 8 = 56. You'll get the next one"), no
sarcasm, no timers for the youngest tier unless fluency is the explicit
goal. Sounds from `references/sound.md`: a soft distinct wrong-answer sound
— never a harsh fail buzzer.

## What goes wrong

- A lecture with a score attached — no verb, no loop, fails
  `references/loop.md` and gets abandoned.
- Game-over on a wrong answer; kids learn to fear input instead of trying.
- Missed items never reappearing — the game tests, it does not teach.
- Speed pressure on a comprehension goal (or a 5-year-old).
- Punishing feedback: red flash + buzzer + lost progress for one mistake.
- Difficulty ramping by speed while the material never advances.
- Progress shown as abstract points instead of what was learned.
