# Simulation, idle, and tycoon games

Read this when the brief is a clicker/idle game, tycoon, shop/farm
management, or "a game where numbers grow". Dimension: 2D, and most of the
interface is DOM per `references/ui.md` — a canvas is optional scenery
here. The game **is** its economy: one resource flow with visible rates,
costs that outpace income, and upgrades that change the curve.

## Sub-genres

| Sub-genre           | Loop                                      | Load-bearing mechanics                  |
| ------------------- | ----------------------------------------- | --------------------------------------- |
| Clicker / idle      | Click → buy generators → watch it grow    | Cost curve, rate math, offline progress |
| Tycoon / management | Invest, balance a chain, expand           | Production chain, demand, money         |
| Farm / shop sim     | Plant/stock, wait, harvest/sell, reinvest | Growth timers, slot grid                |

## The economy core (idle)

- State is `resources`, `generators[{ kind, owned }]`, and derived
  `ratePerSecond = Σ owned × baseRate × multipliers` — computed in one
  pure function, displayed on the HUD, applied in the tick as
  `resources += rate * gameplayDelta`.
- **Cost curve:** `cost = baseCost * GROWTH^owned` with `GROWTH ≈ 1.15`
  per generator kind (named constants). Linear costs break the game in
  minutes; growth above ~1.3 walls it in minutes. This one formula is the
  genre.
- The first generator is affordable within ~10 clicks; each new generator
  kind unlocks when the previous one feels slow — the ramp
  (`references/loop.md`) is new _kinds_ and multiplier upgrades, not just
  bigger numbers.
- **Big numbers need formatting** from the start: `1.24M`, `8.01B` — a
  compact-notation helper, because `12400000000` on the HUD breaks layout
  and readability (`references/ui.md` fixed-width rule).
- Buy buttons show cost and are visibly disabled until affordable
  (`references/ui.md` disabled states); a buy gives feel feedback
  (`references/feel.md`).

## Offline progress — the honest version

On save, store `lastSeen = Date.now()`. On load,
`gain = min(elapsedSeconds, OFFLINE_CAP) * ratePerSecond`, applied once and
**shown**: "While you were away: +4.2M (3 h)". The cap (hours, named
constant) keeps a week away from trivializing the curve.

The line this file enforces: offline **gifts** are fine; offline
**punishments** are not. Nothing decays while away, no timer demands a
return "or else", no mechanic nags. `references/loop.md` bans engineered
addiction — an idle game stays on the right side by making absence neutral
or kind, never costly.

## Tycoon and management

One production chain for the slice: buy input → process (time or action) →
sell at margin. The decision is allocation — which stations to upgrade,
what to stock — against a demand that shifts visibly (show the price/demand
state, never hide the why of a loss). Money is the one resource; profit per
cycle is the score. Expansion (new station kinds, bigger grid) is the ramp.
Farm/shop variant: a slot grid (plots, shelves) where each slot runs a
timer — plant/stock, grow/wait, harvest/sell — and the layout choice is
the skill expression.

Timers run on **gameplay time** (accumulated delta), pause with the game,
and get the offline treatment above on load.

## Prestige (only if asked)

Reset-for-multiplier is a second loop on the same state: banked multiplier
from lifetime earnings, everything else back to zero. Worth it only when
the first curve is proven fun; do not scaffold it speculatively.

## What goes wrong

- Linear costs (trivial in minutes) or runaway growth (walled in minutes).
- Rates recomputed ad hoc in several places that disagree with the HUD.
- Raw `12400000000` breaking the HUD; no compact formatting.
- Offline decay, return-or-lose timers, or any dark-pattern pressure.
- Offline gain applied silently (looks like a bug) or uncapped (breaks the
  curve).
- Timers on wall-clock time that keep running while paused.
- A tycoon where losses are unexplained because demand/prices are hidden.
- Prestige built before the base loop is fun.
