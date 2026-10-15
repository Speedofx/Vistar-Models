# Card and board games

Read this when the brief is solitaire, a memory game, a card battler, chess,
checkers, connect-four, reversi, or another tabletop game. Dimension: 2D;
the board and cards are DOM or canvas per `references/ui.md` — a board game
does not need a world renderer. These games are **rules engines**: the legal
moves, the turn structure, and (for versus games) an AI opponent worth
beating.

## Sub-genres

| Sub-genre                              | Loop                      | Load-bearing mechanics            |
| -------------------------------------- | ------------------------- | --------------------------------- |
| Board vs AI (chess-like, connect-four) | Outplay the opponent      | Legal-move generator, minimax AI  |
| Solitaire (klondike, freecell)         | Untangle the deal         | Stack rules, seeded shuffle, undo |
| Memory / matching                      | Recall positions          | Reveal state machine              |
| Card battler-lite                      | Play hands under a budget | Deck/draw/discard cycle           |

## One legal-move generator, three consumers

Write the rules **once** as a pure function: `legalMoves(state) → Move[]`.
Everything consumes it: input (only legal moves are clickable/droppable),
the AI (searches over it), and hints (show one of them). The moment rules
are duplicated — one check in the click handler, another in the AI — the
two disagree and the game "cheats". Win/draw detection is likewise one pure
function over state, run after every applied move.

## The AI opponent — minimax with a depth limit

For perfect-information board games (connect-four, checkers, reversi,
chess-lite):

```text
function best(state, depth, isMax) {
  if (depth === 0 || isOver(state)) return { score: evaluate(state) };
  let top = null;
  for (const m of legalMoves(state)) {
    const r = best(apply(state, m), depth - 1, !isMax).score;
    if (!top || (isMax ? r > top.score : r < top.score)) top = { score: r, move: m };
  }
  return top;
}
```

- `apply` returns a **new** state (or undoes after recursion) — mutating the
  live board during search is the classic corruption bug.
- `evaluate` is simple and material-first (piece count, center control,
  open lines). A simple eval at depth 4 beats a clever eval at depth 1.
- **Difficulty is depth plus noise**: easy = depth 1–2 and occasionally the
  second-best move; hard = deeper and exact. Never difficulty-by-cheating.
- Depth 4–6 on a small board is fine synchronously; if a move takes longer
  than ~100 ms, cap depth rather than freezing the tick. Add a short
  deliberate delay before the AI plays — instant replies feel dismissive
  and players miss what happened.

## Cards: decks, shuffles, stacks

- A card is a record (`suit`, `rank`, `faceUp`); a deck is an array
  shuffled with **Fisher–Yates using the seeded RNG** from state —
  `Math.random` breaks restart-same-deal and any daily-deal feature.
- Solitaire legality is per-stack predicates (tableau: alternating color
  descending; foundation: same suit ascending) — these are the
  `legalMoves` function in another costume. Unlimited undo via a command
  stack, same as `genres/puzzle.md`. Auto-move obvious cards (double-click
  to foundation) — tedium is not difficulty.
- Memory: a reveal state machine — `0 revealed → 1 revealed → 2 revealed →
(match? keep : flip back after a readable delay)`. Lock input during the
  flip-back; the classic bug is a third card flipped mid-resolution.

## Turn structure and presentation

The turn machine from `genres/strategy.md` applies: whose turn, what phase,
and state rejects out-of-phase input regardless of UI. Animate the
opponent's move visibly (slide the piece, flip the card) — state that
changes with no motion reads as a glitch. Show captured material / score
per `references/ui.md` HUD zones.

## Difficulty levers

Search depth and noise, deal difficulty (winnable-deal check for solitaire
where feasible), board size, hand size, timer (only if the brief wants
speed). Ramp per `references/loop.md`.

## What goes wrong

- Rules implemented twice (input vs AI) that disagree.
- Minimax mutating the real board — the game corrupts as the AI "thinks".
- An AI that cheats (peeks at hidden cards, takes illegal moves) instead of
  searching shallower.
- `Math.random` shuffles that break restart and the seeded-RNG rule.
- A third memory card flipped during flip-back.
- Instant AI replies with no animation — players cannot follow the game.
- Solitaire without undo, or with no auto-move for obvious plays.
