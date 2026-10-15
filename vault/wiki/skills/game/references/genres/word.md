# Word and trivia games

Read this when the brief is a daily word-guess game (guess a hidden word
from colored letter feedback), hangman, anagram game, typing
game, or quiz/trivia. Dimension: 2D, and most of the "world" is DOM UI per
`references/ui.md` — a canvas is optional here, not mandatory. These are
data + input games: the word list or question bank is the content, and input
handling is the mechanics.

## Sub-genres

| Sub-genre         | Loop                                     | Load-bearing mechanics                  |
| ----------------- | ---------------------------------------- | --------------------------------------- |
| Word-guess        | Guess, read the clue colors, narrow down | Two-list dictionary, letter-state rules |
| Hangman / anagram | Reveal or rearrange under a budget       | Word list, normalized comparison        |
| Typing game       | Type the prompt before it lands          | WPM/accuracy, per-keystroke diff        |
| Quiz / trivia     | Answer under time, build a streak        | Question records, streak scoring        |

## The word data

Words and questions are **module-level data**, not a fetched API: a curated
list in a content module (`words.ts`, `questions.ts`). Two lists for
guessing games: a small list of common words that can be **answers**, and a
larger list of words that are **valid guesses** — answers drawn from the big
list produce obscure words that feel unfair. Normalize everything once
(uppercase, no diacritics) at module load; comparing un-normalized strings
is the classic "correct answer marked wrong" bug. Never log or render the
answer before the reveal.

## Letter-state rules (word-guess)

Three states per letter: correct-position, in-word-wrong-position, absent.
The trap is **duplicate letters** — naive per-letter checks mark both E's
yellow when the answer has one. Two-pass evaluation: first pass marks exact
matches and consumes them from a letter-count map; second pass marks
in-word only while the count map has remainder. The on-screen keyboard
mirrors the best-known state per letter and never downgrades it.

## Input

Physical keyboard and on-screen keys emit the same intent (`references/ui.md`
touch rules). Capture `keydown` at the window, filter to `[a-z]`, Enter,
Backspace; `preventDefault` only for keys the game consumes. Reject a
submit of an invalid word with a shake (`references/feel.md`) and a one-line
reason — silent rejection reads as a frozen game. Typing games diff **per
keystroke** against the prompt and color each character immediately; WPM is
`(correctChars / 5) / minutes`, accuracy is correct over total keystrokes.

## Quiz and trivia

A question is a content record: prompt, choices, answer index, optional
explanation. Shuffle choice order at render (seeded, so a restart differs).
Timers create the pressure (`references/loop.md`); streaks create the
reward — a streak multiplier with a visible counter beats flat points.
After an answer, show correct/wrong **and why** before the next question;
instant cuts teach nothing and feel like a slot machine.

## Difficulty levers

Word length, guess budget, list obscurity tier, timer length, choice count,
prompt speed (typing). Ramp per `references/loop.md` — one lever at a time.

## What goes wrong

- Answers drawn from the full dictionary — players lose to words they've
  never seen.
- Duplicate letters mis-colored by a single-pass check.
- Un-normalized comparison (case, accents) marking right answers wrong.
- An on-screen keyboard that downgrades a green key to yellow.
- Invalid input rejected silently.
- The answer visible in logs, state dumps, or the DOM before the reveal.
- A trivia game that never explains the right answer.
