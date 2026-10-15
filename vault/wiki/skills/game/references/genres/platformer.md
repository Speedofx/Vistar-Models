# Platformers and runners

Read this when the brief has jumping, platforms, side-scrolling, climbing,
or an endless runner. Default dimension: 2D side view. A 3D platformer is a
much larger ask — build the 2D read unless the brief insists.

A platformer is its jump. Everything in this file exists because a raw
"velocity up, gravity down" jump feels terrible, and players can't say why —
they just leave.

## Sub-genres

| Sub-genre            | Loop                         | Load-bearing mechanics                |
| -------------------- | ---------------------------- | ------------------------------------- |
| Side-scroller        | Traverse, avoid, reach       | The full jump kit, tile collision     |
| Precision platformer | Hard jumps, instant retry    | Same + tighter windows, fast respawn  |
| Endless runner       | Survive accelerating terrain | Auto-run, chunk spawning, one input   |
| Physics platformer   | Momentum puzzles             | Route through `references/physics.md` |

## The jump kit — all five, not a subset

```text
// per tick, gameplay delta
const GRAVITY = 2000, FALL_MULT = 1.8, JUMP_V = -720, MAX_FALL = 1200;
p.vy += GRAVITY * (p.vy > 0 ? FALL_MULT : 1) * dt;
p.vy = Math.min(p.vy, MAX_FALL);
```

1. **Asymmetric gravity.** Falling is ~1.5–2× faster than rising
   (`FALL_MULT`). Equal-speed arcs feel floaty — this one constant is half
   the feel.
2. **Variable height.** On jump release while still rising, cut `vy` to
   ~40% — tap for a hop, hold for the full arc.
3. **Coyote time.** Jumping stays allowed ~100 ms after walking off a ledge
   (`coyoteTimer` reset while grounded, decayed by real delta). Without it,
   every edge jump "ate my input".
4. **Jump buffering.** A jump pressed ~120 ms before landing fires on the
   landing frame (`bufferTimer` set on press, consumed on ground contact).
5. **Max fall speed.** Uncapped falls tunnel through platforms and feel
   out of control.

Landing gets squash, takeoff gets stretch (`references/feel.md`).

## Collision and ground

Level geometry is a tile grid or a list of AABBs in state. Resolve movement
**one axis at a time**: move x, resolve overlaps, then move y, resolve — and
set `grounded` only from the y pass. Diagonal single-pass resolution is the
source of corner-snag and wall-stick bugs. One-way platforms: collide only
when falling (`vy > 0`) and the player's feet were above the surface last
tick; drop through on down+jump.

`grounded` is the most load-bearing boolean in the game: it gates jumping,
resets coyote time, and switches the animation state. Compute it in exactly
one place.

## Camera

Side-scroller camera from `references/feel.md` follow, plus two
platformer-specific rules: a **vertical deadzone** (the camera does not
chase every jump arc — it moves when the player lands at a new height), and
look-ahead in the facing direction so the space ahead is visible. A camera
that tracks the jump arc 1:1 makes players motion-sick.

## Endless runner

The player auto-runs; the one input is jump (the full kit above still
applies — buffering matters _more_ at speed). Terrain spawns in **chunks**:
authored patterns of obstacles and gaps selected from a pool, spawned ahead
of the camera, recycled behind it. Every chunk must be passable at the
current speed — validate gap length against jump distance at max speed when
authoring the pattern, not at runtime. Ramp = scroll speed plus
harder-chunk eligibility per `references/loop.md`; alternate dense chunks
with breathers.

## Difficulty levers

Gap width, platform size, hazard density, chunk eligibility, scroll speed
(runner). Never ramp by weakening the jump — the verb is sacred; the world
gets harder around it.

## What goes wrong

- A jump with symmetric gravity, fixed height, no coyote, no buffer — "the
  controls feel bad" in four different ways at once.
- Diagonal collision resolution: corner snags, wall-sticking, ground
  flicker.
- `grounded` computed in two places that disagree.
- The camera chasing every jump vertically.
- A runner chunk that is impossible at the speed it spawns at.
- Respawn slower than ~1 s in a precision platformer — retry is the loop.
