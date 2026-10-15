# Strategy games

Read this when the brief is tower defense, turn-based tactics, an
auto-battler, or "an RTS". Dimension: 2D top-down or grid by default; 3D
only when the brief insists on it. Strategy games are decided by **readable
state** (the player must see the whole situation) and a fair, simple AI —
not by content volume.

## Sub-genres

| Sub-genre                  | Loop                              | Load-bearing mechanics                  |
| -------------------------- | --------------------------------- | --------------------------------------- |
| Tower defense              | Place, survive the wave, reinvest | Waypoint path, targeting, economy       |
| Turn-based tactics         | Move units, exploit position      | BFS move range, turn machine, scored AI |
| Auto-battler / lane pusher | Deploy, watch, adapt              | Lane simulation, deploy economy         |
| RTS                        | Build, command, overwhelm         | **Scope rails below — steer to lite**   |

## Tower defense

- Enemies follow a **waypoint path** (an array of points in the level
  record); each enemy tracks its waypoint index and steers to the next.
  Progress along the path — not raw distance to the goal — drives "first"
  targeting.
- Towers are records: range, damage, cooldown, cost, and a **targeting
  priority** (first / strongest / nearest). First is the default; it is
  what players expect.
- The economy is the decision: kills pay, towers cost, and the interesting
  choice is save-vs-spend. Show the next wave's composition (the tell) so
  placement is a decision, not a gamble.
- Maps create placement decisions: chokepoints where coverage overlaps,
  and open stretches where it cannot. A straight line with uniform tiles
  has one optimal answer and no game.

## Turn-based tactics

- A turn is a state machine: `select unit → show reachable cells → move →
act (attack/wait) → next unit → enemy turn`. One phase field in state
  drives everything; input is interpreted strictly by phase.
- **Move range is BFS flood fill** from the unit, budgeted by move points,
  blocked by terrain and occupied cells. Highlight the result; clicking
  outside it does nothing. (A* is unnecessary here — BFS _is_ the range and
  the path.)
- Enemy AI is **scored actions, not search**: enumerate each unit's legal
  (move, target) pairs, score them with a plain function (damage dealt,
  kill bonus, retaliation risk, distance), play the best. Ship obvious
  priorities over clever ones — players call a readable AI "smart" and an
  opaque one "random".
- Facing, cover, or height bonuses: at most one of these in the first
  slice, per the one-seam law.

## Auto-battler / lane pusher

The RTS fantasy at a tenth of the complexity — offer this shape when the
brief says RTS without insisting on direct unit control. The player spends
a regenerating resource to deploy units into lanes; units auto-advance,
auto-fight (seek + attack from `genres/shooter.md` movement tiers), and
push toward the enemy base. The decision is **what to deploy where, when**
— composition counters, lane pressure, resource timing. The enemy AI is a
deploy schedule with the same rules plus light reaction (reinforce its
weakest lane).

## RTS — scope rails

A real RTS (drag-select armies, free-form building, full pathfinding economy
AI) is the hardest genre on this list and the most likely to ship broken.
The rails, if the brief truly demands RTS:

- One resource, one producer building, a handful of unit types.
- A **grid** map; unit movement is grid A* (re-path on arrival or on a
  timer, never per frame — see `genres/shooter.md` tier 3), max ~30 units.
- Selection: click one unit, drag-box for several; right-click is move/attack
  intent. Mobile gets tap-select, tap-move.
- Enemy AI is a build-order script with timers, not an adaptive economy.

If any rail must break, say so to the user and propose the auto-battler.

## Difficulty levers

Wave composition and interval, enemy stat tiers, AI score function weights
(not cheating resources), map openness, resource rate. Ramp per
`references/loop.md`; strategy breathers are between-wave or between-turn
pauses — never interrupt the player's planning with real-time pressure in a
turn-based game.

## What goes wrong

- Unreadable state: the player loses to information they could not see
  (hidden range, no wave tell, fog with no reason).
- A tower defense map with one straight path and no placement choice.
- Turn phases enforced only by the UI — state accepts an attack during the
  enemy turn.
- BFS range ignoring occupied cells, or an AI that moves through walls.
- An AI that cheats visibly (free resources, reacting to what it cannot
  see) instead of being honestly simple.
- A full RTS attempted when the brief would have been thrilled with a lane
  pusher.
- Pathfinding per unit per frame.
