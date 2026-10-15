# Shooters

Read this when the brief has guns, projectiles, waves, zombies, enemies that
chase, or space combat. Dimension: top-down/twin-stick and horde games
default to 2D; first-person and over-the-shoulder are 3D; space dogfights
read both ways — ask per the skill hub.

A shooter is aim + fire + enemies that press. The part that makes or breaks
it is **enemy movement**: enemies that walk into walls or stack into one
blob kill the game no matter how good the gun feels.

## Sub-genres

| Sub-genre             | Loop                           | Load-bearing mechanics          |
| --------------------- | ------------------------------ | ------------------------------- |
| Top-down / twin-stick | Kite the horde, clear the wave | Seek + separation, wave spawner |
| Horde survival        | Survive scaling waves          | Flow field, pooled projectiles  |
| FPS                   | Aim duels in 3D space          | Pointer lock, raycast hits      |
| Space / dogfight      | Out-turn the enemy             | Inertia, lead indicator         |

## Aiming and firing

- Top-down: the player aims at the pointer in **world** coordinates —
  convert through the camera transform, not raw screen pixels, or aim breaks
  the moment the camera moves.
- Fire on a cooldown (named constant), spawn from a muzzle offset, and pool
  projectiles (`references/tick.md` entity pools). Projectiles carry their
  own lifetime; cap the live count.
- Hitscan (instant ray) suits rifles and FPS; moving projectiles suit
  everything the player should dodge. Fast projectiles + thin targets is the
  tunneling case — step the overlap test along the travel segment, or use
  hitscan.
- FPS: `canvas.requestPointerLock()` on the start click, aim from
  accumulated `movementX/Y`, shoot via raycast from the camera. Pointer lock
  is lost on Esc — pause when it drops.

## Enemy movement — the part that cannot be skipped

Pick by arena, in this order:

1. **Open arena (no obstacles): seek + separation.** Each enemy steers
   toward the player, plus a push away from nearby enemies so the horde
   spreads into a front instead of stacking into one sprite:

```text
// per enemy, per tick
let dx = player.x - e.x, dy = player.y - e.y;
const d = Math.hypot(dx, dy) || 1;
let vx = (dx / d) * e.speed, vy = (dy / d) * e.speed;
for (const o of nearby(e)) {              // grid-bucket neighbors, not all-pairs
  const ox = e.x - o.x, oy = e.y - o.y;
  const od = Math.hypot(ox, oy) || 1;
  if (od < SEP_RADIUS) { vx += (ox / od) * SEP_PUSH; vy += (oy / od) * SEP_PUSH; }
}
```

2. **Walls and obstacles: flow field.** Run one grid BFS **from the player**
   every few steps (not per frame, not per enemy); each cell stores the
   direction to its BFS parent. Every enemy just reads its cell's direction
   and steers that way, plus the separation above. One BFS serves a thousand
   chasers — this is why hordes with walls do not need per-enemy A*.
3. _*Few smart units with individual goals: grid A*._* Only when enemies
   path to different targets. Re-path on target change or on a timer, never
   per frame; always keep the straight-line seek as the fallback when no
   path exists.

An enemy that hugs a wall forever, or a horde that forms a single-file
conga line, means the wrong tier was picked.

## Waves and pressure

Spawn at the arena edges or off-screen, never on top of the player — keep a
minimum spawn distance. A wave is a content record (`references/tick.md`):
count, kinds, interval. Ramp per `references/loop.md`: more, faster, tougher,
and new **combinations**, with a breather between waves. Telegraph special
enemies (distinct silhouette per the graphics reference) before they are
lethal.

## Feedback

Every hit reads: impact flash on the enemy, kill feedback bigger than hit
feedback, and the player being hit is unmistakable (screen edge flash,
trauma from `references/feel.md`). Enemies need a tell before a melee hit
lands — a wind-up scale or color, not an instant touch-of-death. Ammo and
reload only if the brief wants them: they add a decision, not realism.

## What goes wrong

- Enemies that chase but never hurt: player × enemy contact does nothing
  (the Contact rule in `references/loop.md`) — the horde is scenery.
- Enemies stacking into one blob (no separation) or walking into walls
  forever (no flow field where the arena has geometry).
- A* per enemy per frame — the tick melts at thirty enemies.
- Aim in screen space while the camera moves.
- Spawns on top of the player, or all spawns from one edge.
- Bullets that tunnel through enemies at high speed.
- Unpooled projectiles/enemies allocating every shot.
- Damage with no tell, no flash, no distinction between hit and kill.
