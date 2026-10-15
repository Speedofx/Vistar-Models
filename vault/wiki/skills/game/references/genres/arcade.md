# Arcade classics

Read this when the brief is a snake, breakout/pong, flappy-style, asteroids,
or falling-block game — or "a simple/retro/classic game". Default dimension:
2D. The loop contract comes first; this file adds the mechanics that make
each classic feel right instead of almost-right.

Arcade games live on **one pure input** and a speed ramp. Their quality is
decided by tiny rules (where the ball bounces, when the snake dies), not by
content. Get the rule exact; do not add mechanics to compensate.

## Sub-genres

| Sub-genre       | Loop                                                | The rule that must be exact         |
| --------------- | --------------------------------------------------- | ----------------------------------- |
| Snake           | Eat to grow, don't hit yourself                     | Grid-stepped movement, queued turns |
| Breakout / pong | Keep the ball alive, clear bricks / beat the paddle | Hit position steers the bounce      |
| Flappy-like     | Thread the gaps                                     | One impulse, heavy gravity          |
| Asteroids-like  | Shoot and dodge in open space                       | Inertia and screen wrap             |
| Falling blocks  | Place pieces, clear lines                           | Grid lock-in, fair randomizer       |

## Snake

Movement is grid-stepped on a timer, not pixel-smooth: the snake advances
one cell every `stepInterval`, which shrinks as the score grows (the ramp).
Queue direction changes and apply **one per step** — reading input directly
lets a fast player press up-then-left inside one step and reverse into their
own neck. Reject the direct reverse. The body is an array of cells; grow by
not removing the tail on an eat. Death is head-vs-body or head-vs-wall,
checked after the step.

## Breakout / pong

The ball's bounce off the paddle is the entire skill expression: reflect the
y-velocity, then set the x-velocity from **where on the paddle it hit**
(center = straight, edge = sharp angle). Without that, the game plays
itself. Clamp the resulting angle so the ball never travels near-horizontal
(unreachable) or near-vertical (boring). Speed up slightly on every paddle
hit — that is the ramp. Pong AI: move the paddle toward the ball's y at a
capped speed; difficulty is the cap, never perfect tracking.

## Flappy-like

One verb: an upward velocity impulse (`vy = FLAP`, not `vy += FLAP` —
additive flaps stack into orbit). Gravity is strong and falling is faster
than rising. Obstacles spawn at a fixed interval with a gap whose vertical
position is random but whose **size guarantees passability** from any
reachable height. The kill zone is the obstacle and the screen edges. Score
on passing an obstacle's center, once.

## Asteroids-like

The ship has inertia: thrust adds to velocity, nothing subtracts it except
optional light damping — stopping is the skill. Rotation is separate from
velocity (you fly backwards while turning). Everything wraps at screen edges
— including bullets and hazards, and the wrap must be seamless (draw twice
near the seam or wrap before draw). Split large hazards into smaller, faster
ones on hit. Cap bullet count and lifetime.

## Falling blocks

The board is a grid in state; the falling piece is separate until **lock-in**
merges it. Core beats: gravity tick, soft/hard drop, rotation with a basic
wall kick (try the rotation, nudge one cell left/right if blocked, else
refuse), full-row clear with everything above shifting down, and a fair
randomizer — shuffle a bag of all seven pieces and deal from it; pure
`rng()` per piece produces cruel droughts. Show the next piece. Ramp =
gravity interval shrinking per cleared-lines threshold.

## Difficulty levers

Speed is the lever for all of these: step interval, ball speed, scroll
speed, gravity tick. Ramp it on score or time per `references/loop.md` and
cap it at a named maximum that is still humanly playable. Do not ramp by
adding new rules mid-run — the classic's purity is the product.

## What goes wrong

- Smooth (per-frame) snake movement — it is a different, worse game.
- A reversible snake, or multiple turns applied in one step.
- Paddle bounces that ignore hit position.
- Additive flap impulses, or a gap the player cannot reach in time.
- Asteroids that despawn at the edge instead of wrapping.
- A piece randomizer with droughts, or rotation that bites into the stack.
- A second mechanic (power-ups, weapons) added before the pure loop is fun.
