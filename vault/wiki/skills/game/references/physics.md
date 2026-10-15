# Physics — the escape hatch

Read this only when a change proves the slice cannot work with simple
overlap tests — the gate in the skill hub's stack rules. Most games never
get here: pickups, lanes, bullets, timers, tile boards, and anything where
authored feel beats simulation stay on custom overlap checks inside the
tick. A single body reflecting off walls (pong, breakout) is still custom —
reflection is one line of math. Reach for an engine when correctness needs a
real solver: many bodies colliding at once and passing momentum through
contact chains (a pool break), spin and rolling friction (pinball, marble
courses, mini golf), stacks that rest and topple without jittering, slopes
and moving platforms a character must ride, or fast bodies that tunnel
through thin walls between frames. Hand-rolling those is writing a
rigid-body engine, and it fails in ways that are hard to see and harder to
fix.

The renderer never decides this. A physics world runs beside the one in
`world.ts` at a fixed timestep; the draw pass only reads from it.

## Engine

One engine family for both dimensions — Rapier, via its compat builds
(WASM inlined, no bundler config):

| Dimension | Install in `apps/web`                   | World vectors |
| --------- | --------------------------------------- | ------------- |
| 2D        | `npm install @dimforge/rapier2d-compat` | `{ x, y }`    |
| 3D        | `npm install @dimforge/rapier3d-compat` | `{ x, y, z }` |

The API is the same in both; everything below applies to 2D by dropping the
`z` component. Do not add Matter.js, cannon-es, Ammo, or a second engine —
one world, one engine, or none.

Rapier is WASM and initializes async, so it follows the same browser-only
rule as three.js: dynamic `import()` from the game module, never from a
loader or server module, and `await RAPIER.init()` once in `start()` before
any world exists.

## Units and axes

Rapier simulates in meters and seconds; dynamics degrade when objects are
hundreds of units tall. Pick a scale where gameplay objects are roughly
0.5–5 units and convert at the edges:

- 3D: scene units are already meters — use them directly.
- 2D: do not use raw pixels as world units. Define `PIXELS_PER_UNIT`
  (~50–100) as a named constant; physics runs in units, the draw pass
  multiplies by it inside the camera transform. Canvas y points down, so
  either set gravity `{ x: 0, y: 9.81 }` and treat +y as down everywhere,
  or keep y-up physics and negate y in the one draw conversion — pick one
  and never mix.

## Fixed timestep

Variable-delta physics is jitter and tunneling. Step the world on an
accumulator inside the existing tick — one step in the update order from
`references/tick.md`, never a second `requestAnimationFrame`:

```text
const FIXED_DT = 1 / 60;
let accumulator = 0;

function stepPhysics(gameplayDelta) {
  accumulator += Math.min(gameplayDelta, 0.1);
  while (accumulator >= FIXED_DT) {
    world.timestep = FIXED_DT;
    world.step(eventQueue);
    accumulator -= FIXED_DT;
  }
}
```

The `Math.min(..., 0.1)` clamp is what keeps a tab switch or frame spike
from spiralling into a death loop of catch-up steps. Feed the **gameplay**
delta so hitstop and pause freeze the simulation with the rest of the game.

## Bodies and colliders

```text
const body = world.createRigidBody(
  RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0, 2, 0)        // (0, 2) in 2D
    .setLinearDamping(0.25)
    .setAngularDamping(0.5)
);
world.createCollider(
  RAPIER.ColliderDesc.ball(0.5).setRestitution(0.6).setFriction(0.4),
  body
);
```

- Colliders are primitives: balls, cuboids, capsules, compounds of those.
  Never collide against a visual mesh or a traced draw path — the visuals
  get a simple proxy.
- Body types by role: `dynamic` for things physics moves, `fixed` for the
  level, `kinematicPositionBased` for moving platforms and scripted
  obstacles the game drives (a `dynamic` platform sags; a `fixed` one
  cannot move).
- Character controllers: a capsule with locked rotations and kinematic
  movement — not a raw dynamic body, unless falling over is the game.
- Set friction, restitution, and damping explicitly as named constants with
  the other knobs (`references/loop.md`). Defaults read as floaty.

## Sensors, events, CCD

A sensor (pickup zone, goal, hole, checkpoint, damage volume) detects
without colliding — and it is **silent** unless events are switched on;
this is the most common trigger bug:

```text
RAPIER.ColliderDesc.ball(1)
  .setSensor(true)
  .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
```

Drain events with an `EventQueue` passed to `world.step(eventQueue)` and
map collider handles back to entities through a `Map` kept in the state.

Fast bodies (projectiles, a struck cue ball) tunnel through thin colliders
between steps. Enable CCD on those bodies only — it costs:

```text
RAPIER.RigidBodyDesc.dynamic().setCcdEnabled(true)
```

## Sync in one place

After stepping, copy body transforms to visuals in exactly one loop — the
only code that writes positions physics owns:

```text
const t = body.translation();
mesh.position.set(t.x, t.y, t.z);          // 3D
mesh.quaternion.copy(body.rotation());
// 2D: entity.x = t.x * PIXELS_PER_UNIT; entity.angle = body.rotation();
```

Nothing else writes those transforms. Gameplay pushes bodies with impulses
and velocities, not by setting positions (teleporting a dynamic body breaks
contacts). Feel effects (`references/feel.md` squash, shake) animate a
visual child or the camera — never the collider or the body.

## Restart and teardown

Bodies survive restarts silently. On restart, either remove every body and
collider you created (`world.removeRigidBody(body)`) or drop the whole
world and rebuild it — rebuilding is simpler and fast at this scale. On
`stop()`, free the world. A restart that leaves ghost bodies shows up as
invisible walls and doubled gravity.

## What goes wrong

- Physics added for a game overlap tests already carried — the gate failed.
- `world.step()` called with the raw frame delta: jitter on fast machines,
  tunneling on slow ones.
- Two writers: the sync loop and some gameplay code both set positions, and
  mesh and body drift apart.
- A sensor that never fires: `setActiveEvents` missing.
- A platform that moves visually but passes through the player: it was
  `fixed` (or a bare mesh) instead of kinematic.
- Pixel coordinates used as 2D world units: everything is a 400 m block in
  molasses.
- Bodies from the last run still in the world after restart.
- A detailed visual mesh used as a collider: slow, and contacts misfire.
- Fast projectiles passing through walls: no CCD on those bodies.
- Rapier imported at module top level in a route: WASM init during SSR.
