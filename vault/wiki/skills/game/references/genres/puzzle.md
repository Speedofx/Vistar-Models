# Puzzle games

Read this when the brief is a match-3, merge/2048, sokoban, sliding puzzle,
logic grid, or physics puzzle. Default dimension: 2D. Puzzle games are
state-machine games: the board data model is the game, and the renderer
only shows it.

## Sub-genres

| Sub-genre                | Loop                            | Load-bearing mechanics                |
| ------------------------ | ------------------------------- | ------------------------------------- |
| Match-3                  | Swap to match, chase cascades   | Swap-validate-cascade, deadlock check |
| Merge / 2048             | Combine equal tiles             | Slide-merge rules, one merge per tile |
| Sokoban / sliding        | Push or slide to the goal state | Undo stack, solvable levels           |
| Logic (minesweeper-like) | Deduce from clues               | Clue generation, first-click safety   |
| Physics puzzle           | Build/aim, then watch           | Route through `references/physics.md` |

## The board is state, the view obeys

The grid lives in `state.ts` as a plain 2D array; every rule (match, merge,
push, win) is a pure function over it. Animations **follow** state changes
through a step queue — resolve the whole cascade in state first, record the
steps (swap, clear, fall, spawn), then play them back in order. Mutating
state mid-animation is the number-one puzzle-game bug family: double
matches, tiles vanishing, input during resolution corrupting the board.
Lock input while the queue plays.

## Match-3

- A swap is **validated before it commits**: if it creates no match, animate
  it back. Free swaps remove the decision.
- Resolution loop: find matches → clear → gravity (tiles fall) → spawn new
  at the top → repeat until no matches. Each pass is one queued step;
  cascades are where the dopamine lives, so each pass must be visible.
- Board generation: reroll any tile that would complete a match at spawn —
  the opening board has zero free matches.
- **Deadlock check** after every resolution: scan for at least one legal
  swap; if none exists, reshuffle (animate it, tell the player). A board
  with no moves and no reshuffle is a dead game.

## Merge / 2048

One input slides **all** tiles in a direction: process each row/column from
the far side, a tile merges with an equal neighbor **once per move** (mark
merged tiles; `2+2+4` must not chain into `8` in one slide). Spawn one new
tile per move in a random empty cell. Game over is "no empty cell **and**
no equal neighbors" — checking only for empty cells ends the game early.

## Sokoban and sliding

Every move is an undoable command: push `{ player, box?, from, to }` onto
an undo stack; undo pops and reverses. Players expect unlimited undo — a
sokoban without it is abandoned at the first mistake. Detect the stuck
states that need no solver: a box in a corner (or against a wall with no
goal on that wall's line) is dead — flash it. Levels are data records
(string grids in a content array), ordered teach → confirm → twist per the
progression below.

## Logic grids

Generate the solution first, then derive the clues from it (minesweeper:
place mines, count neighbors). First click is always safe — generate or
relocate after it. Flagging is a first-class input (long-press on touch).
Never require guessing on the critical path; if the generator can't
guarantee it, keep boards small.

## Progression — teach, confirm, twist

From the repo's design rule: the first level teaches the rule by being
almost impossible to fail, the second confirms it with one variation, the
third twists it (combine with a known rule, invert it, add a constraint).
Failure must reveal information — show _why_ the state is lost, not just
"game over". Difficulty levers per `references/loop.md`: board size, piece
variety, move limits, cascade depth — one new concept per level, never two.

## What goes wrong

- State mutated while animations play; input accepted mid-cascade.
- Match-3 swaps that commit without creating a match.
- An opening board with pre-made matches, or a deadlocked board that sits
  there.
- 2048 tiles double-merging in one slide, or game-over declared with merges
  still available.
- Sokoban without undo, or with an unsolvable generated level.
- A logic puzzle whose first click can lose, or that forces a coin-flip.
- Win/lose checked in the renderer instead of the state module.
