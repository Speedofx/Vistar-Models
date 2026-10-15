# RPG and adventure games

Read this when the brief is an RPG, roguelike, dungeon crawler, stealth
game, survival game, or story/adventure game. Dimension: 2D top-down or
grid by default; 3D when the brief asks for it. This genre's defining risk
is **scope**: "make me an RPG" means a 200-hour fantasy in the user's head.
The rails below are the recipe — state them to the user as the plan, build
them, and let the user grow it from there.

## Scope rails — the first slice

One zone or one dungeon. 3–5 enemy kinds. One shop or chest loop. A handful
of items that change decisions. 10–20 minutes of play. Everything else
(second zone, crafting, companions, quest log) is a later seam per the
one-seam law — say so instead of building it.

## Sub-genres

| Sub-genre                   | Loop                           | Load-bearing mechanics                      |
| --------------------------- | ------------------------------ | ------------------------------------------- |
| RPG-lite                    | Fight → loot → level → deeper  | Stats + damage formula, inventory, XP curve |
| Roguelike / dungeon crawler | Die, restart stronger in skill | Procedural rooms, vision, permadeath        |
| Stealth                     | Avoid sight, reach the goal    | Vision cones, alert states                  |
| Survival-lite               | Manage resources against decay | Decaying meters, gathering loop             |
| Adventure / narrative       | Explore, talk, decide          | Scene graph, choice records, flags          |

## Stats that stay legible

Three to five stats, each tied to a visible effect (HP, attack, defense,
speed). One damage formula with named constants:
`damage = attack * variance(0.9–1.1, seeded) − defense`, floored at 1 so
hits never do nothing. XP curve: `xpToNext = BASE * level^1.5` — linear is
too fast late, exponential walls early. On level-up, show exactly what
improved. Items are records (`slot`, `statDeltas`); equipping swaps the
record, stats recompute from base + equipment in **one** pure function —
scattering stat math across pickup handlers is how +2 swords give +4.

Turn-based encounters reuse the turn machine from `genres/strategy.md`;
real-time combat reuses `genres/shooter.md` movement tiers for enemies.

## The power curve

Player power compounds — level, equipment, and pickups stack on each other —
while enemies written as per-kind constants never grow at all. That
mismatch is why runs go god-mode by the third floor. The fix is
structural: derive enemy stats **from** the player curve, so the two
cannot drift apart.

- **One source of truth.** Write the expected player attack and max HP as
  functions of depth (level-ups plus the items found by then), then define
  enemies from them: `enemyHp(depth) = HITS_TO_KILL *
expectedPlayerAttack(depth)` and `enemyDamage(depth) =
expectedPlayerMaxHp(depth) / HITS_TO_DIE`, with `HITS_TO_KILL` ~2–4 and
  `HITS_TO_DIE` ~4–6, tightening slightly with depth. Enemy stats tuned
  independently of the player curve is the bug this genre always ships.
- **Apply the curve at spawn.** Per-kind stats are bases the spawn
  function multiplies by the depth curve — a floor-3 goblin is not a
  floor-1 goblin with the same numbers, it is free XP. Spawn tables rotate
  too: each floor drops the weakest kind and adds one, so deep floors
  never serve the first floor's roster at the first floor's stats.
- **Stack additively, never multiplicatively.** Percentage bonuses sum
  into one stat before the damage formula (+20% and +30% make +50%), they
  do not multiply (1.2 × 1.3). Repeatable upgrades get diminishing returns
  or a cap; the same item a second time should be less exciting than a new
  verb once.
- **Depth adds kinds, not just numbers.** Past the early ramp, difficulty
  comes from new enemy kinds, mixed groups, and density (the Ramp in
  `references/loop.md`) — not ever-larger multipliers on both sides, which
  cancel out and read as no change.

**Bosses are fights, not fat mobs.** Derive boss HP from the same player
curve with `HITS_TO_KILL` ~12–20, give the boss damage the player must
respect (2–3 hits to die), and a second phase below half HP — a new or
faster attack pattern, telegraphed per `genres/fighting.md`. The test: a
player who stands still and trades hits must lose. A boss that melts in a
few seconds of focused fire fails the fight before it starts, and each
deeper boss must out-scale the player's growth since the last one.

## Procedural dungeons (roguelike)

Rooms-and-corridors is enough and reliable: place N non-overlapping
rectangular rooms on a grid, connect each room to the next with an L-shaped
corridor, place entry in the first room and exit in the last. Connecting
sequentially **guarantees** a solvable dungeon — no reachability check
needed. Spawn enemies and loot per room, scaled by depth, never in the
entry room. Use the seeded RNG so a run can be replayed. Vision: a simple
radius (tiles within distance, optionally line-of-sight-checked against
walls) with explored-but-dark memory — full map visibility deletes the
genre's tension.

Permadeath is a loop feature, not a punishment: a death screen that shows
the run (depth, kills, cause of death) and restarts into a **new** dungeon
in one click. Meta-unlocks are allowed; paywalls and timers are not
(`references/loop.md`).

## Stealth and vision cones

An enemy sees the player when: within range, within the facing cone
(`angleBetween(facing, toPlayer) < CONE/2`), and line-of-sight unblocked
(step the segment against the wall grid). Three alert states — patrol →
suspicious (saw something: move to last-known position) → alert (chase per
`genres/shooter.md`) — with **visible state on the enemy** (the graphics
reference's state variants: color, icon, posture). Stealth without readable
AI state is a guessing game; the player must see what the guard knows.
De-escalation (alert decays back to patrol) makes mistakes recoverable per
the Ramp rules.

## Survival meters

Hunger/energy/warmth decay slowly per gameplay-second; actions restore
them. The loop is the tension between gathering (restores) and progressing
(consumes). Two meters is plenty for a slice. Decay pauses with the game —
never real-world time, which is a dark pattern (`genres/simulation.md`
draws the same line).

## Adventure / narrative

This sub-genre is story-first: the scene graph **is** the game. Everything
that carries it — the graph of scene records and flags, the writing rails
(arc, endings, dilemma choices), and the presentation (DOM scene text,
typewriter reveal, procedural scene art) — lives in `references/story.md`;
read it in full. Cutscene mechanics are a tick mode in `references/tick.md`.
What stays genre-specific here: the saving rules below, and reusing the
combat sections when the story has fights.

## Saving

A run worth 10+ minutes saves to `localStorage` (serialize the plain state
object on meaningful transitions — room change, level-up; never per frame).
Offer continue-or-new on load. Version the save shape (`{ v: 1, ... }`) and
discard mismatches — migrating old saves is not first-slice work.

## What goes wrong

- Unscoped "whole RPG" ambition: six half-built systems, none playable.
- Stat math scattered across handlers; equipment double-applies.
- Multiplicative item stacks against linear enemy HP — god-mode by depth
  three, every fight a one-shot.
- Enemy kinds with fixed stats reused on every floor while the player
  keeps growing — deep floors full of free XP.
- A boss the player can face-tank, or one that dies in seconds of focused
  fire.
- A generated dungeon with unreachable rooms (not connected sequentially).
- Full map visibility in a roguelike; vision radius forgotten.
- Stealth guards whose knowledge is invisible to the player.
- Survival decay running on wall-clock time.
- Narrative built without `references/story.md`: flags that never pay off,
  canvas scene text, timer auto-advance.
- Saves written every frame, or crashing on an old save shape.
