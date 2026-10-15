# Sports and physics-toy games

Read this when the brief is pool/billiards, mini golf, pinball, bowling,
air hockey, or a mini-sport (penalty kicks, basketball shots, darts).
Dimension: pool/air hockey are top-down 2D; mini golf and bowling read both
ways — ask per the skill hub; pinball is 2D. These games are **one
aim-power-launch verb** against physics the player learns to predict — most
of them are the reason `references/physics.md` exists; read it first for
anything that rolls, ricochets, or rebounds.

## Sub-genres

| Sub-genre               | Loop                               | Load-bearing mechanics                |
| ----------------------- | ---------------------------------- | ------------------------------------- |
| Pool / billiards        | Sink your balls, control the cue   | Rapier balls, turn rules, aim preview |
| Mini golf               | Hole in fewest strokes             | Rapier ball, hole capture, par        |
| Pinball                 | Keep the ball alive, light targets | Flipper impulses, drain, bonus states |
| Bowling / darts / shots | Perfect one throw                  | Aim-power meter, scoring frames       |
| Air hockey              | Outscore the AI                    | Paddle vs puck, goal detection        |

## The aim-power-launch verb

One input pattern serves the whole genre, and it must preview honestly:

- **Aim**: drag from the ball (pool-style, pull back to aim opposite) or
  rotate an arrow (golf/shots). Show an **aim line with the first bounce
  projected** — step a ray against the walls for one reflection. The
  preview is the skill-learning tool; without it the game is dice.
- **Power**: drag distance or a two-click oscillating meter, mapped to a
  **capped** impulse (`MAX_IMPULSE` named constant — uncapped power sends
  bodies through walls per the tunneling rules in `references/physics.md`;
  enable CCD on the struck ball).
- **Launch**: apply one impulse, then lock input until the world settles
  (see below). Touch: the same drag per `references/ui.md` touch rules —
  this genre is the most natural phone fit; test the drag does not scroll.

## Turn settlement — the genre's state machine

`aiming → ball(s) moving → settled → score/rules → next turn`. "Settled"
means every body's speed has stayed under a threshold for a few steps —
then **force-sleep or zero them**; physics micro-jitter otherwise leaves
the game eternally "moving" and input never unlocks. Evaluate rules only at
settlement (pool: what dropped, foul or not, whose turn; golf: in the hole
or stroke+1; bowling: pins down after the sweep delay).

## Per-sport rules that carry the game

- **Pool**: the rules are the game — legal target enforcement, scratch
  (cue ball pot = ball-in-hand or spot), turn continuation on a legal pot.
  Hole capture via pocket sensors (`references/physics.md` sensors need
  active events). Show whose turn and which group is theirs, always.
- **Mini golf**: par per hole; the hole is a sensor that captures only
  below a speed threshold — a fast ball **lips out** (deflect, don't
  capture); that detail is the whole feel of golf. Escalate holes teach →
  confirm → twist (banks, moving blockers, slopes) per `genres/puzzle.md`
  progression.
- **Pinball**: flippers are kinematic rotating colliders driven by input —
  held = up, released = falls; impulse comes from the rotation contact.
  Instant flipper response (input latency is everything); the drain gap
  between flippers is sacred geometry — too wide is unfair, too narrow is
  endless. Targets light a visible bonus state; ball-saver grace on the
  first seconds of a new ball.
- **Bowling / darts / penalty**: no engine needed if nothing rebounds —
  an authored arc plus a spread model (aim error grows with power) is
  honest and tunable. Score frames are content records (bowling's
  strike/spare math is a rules function with unit-testable edges).
- **Air hockey**: the paddle is kinematic and velocity-tracked — the puck
  must inherit paddle velocity on contact or hits feel dead. Cap puck
  speed; goal mouths are sensors. AI: ease toward a defend line, strike
  when the puck crosses its half (capped speed = difficulty).

## Opponents and score presentation

Turn-based opponents (pool, golf) reuse aim + power with error noise from
the seeded RNG — difficulty is the noise radius, and the AI's aim line is
**hidden** (watching its planned shot kills the drama; watching the shot
itself is the drama). Scoreboards per `references/ui.md` zones: strokes vs
par, frames, or race-to-N — always visible, fixed-width.

## What goes wrong

- No aim preview, or a preview that lies about the first bounce.
- Uncapped launch power tunneling balls through rails (no CCD).
- Turn logic evaluated while balls still crawl; input unlocked mid-shot —
  or never, because micro-jitter keeps the world "moving".
- A golf hole that swallows at any speed (no lip-out) — or a capture
  threshold so low nothing ever drops.
- Mushy flippers (input → impulse latency) or a drain gap that's wrong.
- Pool without scratch/legal-target rules — it's marbles, not pool.
- An air-hockey paddle that ignores its own velocity on contact.
- The AI's aim line drawn on screen.
