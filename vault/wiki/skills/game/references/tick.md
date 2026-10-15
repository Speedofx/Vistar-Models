# Tick

The simulation is a plain object updated from `requestAnimationFrame`. React
does not participate in the frame.

## State

Keep one module-level object. Entities are data on that object (id, kind,
position, velocity, alive), not React components and not `useState`.

```text
type Mode = 'play' | 'pause' | 'over';

type Entity = {
  id: number;
  kind: string;
  x: number;
  y: number;
  z: number;
  alive: boolean;
};

type GameState = {
  mode: Mode;
  entities: Entity[];
  score: number;
  time: number;
};
```

The three.js `Object3D` for an entity is a view. The tick writes transforms
from `Entity`. Do not store gameplay rules on the mesh.

Include `entities` only when the tick moves or acts on them. An unread list is
not a foundation.

## Seeded RNG

Anything random in the simulation — spawns, shuffles, variance, drops — calls
a seeded generator stored on the state, never `Math.random` (the rule in
`references/feel.md`). Mulberry32 is four lines and enough:

```text
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

State carries `seed` and `rng: mulberry32(seed)`; `state.rng()` replaces
`Math.random()` call-for-call (returns `[0, 1)`). On restart, re-create the
generator — a fresh run gets a fresh seed (`Date.now()` is fine), a replay or
daily puzzle reuses the stored one. Never keep consuming a half-used
generator across runs: the seed no longer describes the run, and that
reproducibility is the point — a run can be replayed, a daily is the same for
everyone, and a bug report with a seed reproduces. One-time cosmetic setup
outside the tick (scatter in `start()`, the noise buffer in
`references/sound.md`) may use `Math.random`.

## How to extend

One state object and one tick serve every genre. The next mechanic uses one of
these three plugs. It does not add a second tick or a second state object.

| Plug           | Use when                                                                   | The next feature is                                              |
| -------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Entity kind    | Things share one loop: shooter, RPG actors, board pieces, units            | One more `kind` the existing steps already move, hit, and render |
| One step       | A new rule applies to the whole loop: turn order, line of sight, inventory | One function in the update order below                           |
| Content record | The game is a sequence of setups: levels, repairs, rounds, scenarios       | One object in an array the tick calls                            |

Do not copy a `level === n` or `kind === '…'` branch through input, the pass
test, the coach line, and the HUD. Presentation reads state. It does not own
the rules.

A sequence of setups uses this record. A continuous world does not need it.

```text
type Encounter = {
  name: string;
  coach: string;
  setup: () => void;
  apply: (verb: string) => void;
  passed: () => boolean;
};
```

`setup` writes the starting fields on the shared state. `apply` handles the
verb for this setup only. `passed` is the one test. The next level, repair,
or round is the next object in that array.

Pause and game-over are `mode` values. Pause skips the gameplay step and
still draws the frame. Restart resets fields on the same object. Do not
remount the React tree to restart.

## Two deltas

- **Real delta** — time since the last frame, capped (for example 1/20 s) so a
  tab switch does not teleport objects.
- **Gameplay delta** — real delta multiplied by `timeScale`. Hitstop sets
  `timeScale` near `0` for 60–90 ms, then returns it to `1`. Decay the hitstop
  timer with the **real** delta. Camera, shake, tweens, and HUD use the real
  delta so feedback stays visible while the world crawls.

Do not call `cancelAnimationFrame` to freeze a hit. The frame must keep
drawing. Do not drive gameplay from `Date.now()` or from React render.

## Update order

Run this every frame, in this order:

1. Sample input into a plain intent (`moveX`, `fire`, `restart`). Edge-trigger
   keys in the listeners; the tick only reads the intent.
2. If `mode` is `pause`, skip to step 6.
3. If `mode` is `over`, ignore gameplay input except restart.
4. Advance gameplay with **gameplay delta**: move entities, timers, collisions
   (overlap tests are enough), score, win/lose. Set `mode` to `over` on fail.
5. Queue feel events (`hit`, `pickup`, `fail`) from what step 4 changed.
6. Apply feel, camera, and HUD with **real delta**.
7. Render.

Camera follow and aim are functions in this step, not a React effect. The
camera must show the next decision. If shake or FOV hides that decision, the
effect is too strong (`references/feel.md`).

## Input

Listeners attach in `start` and detach in `stop`. Prevent default only for
keys the game uses. Restart on `over` is the same path as the first start:
reset state, set `mode` to `play`.

## Cutscenes

When the brief wants story moments — an intro, a boss entrance, an ending —
a cutscene is data the game plays, not a video: a timeline of steps (camera
move, actor movement, a text line, a sound, a pause), each with a duration,
advanced by the tick in a `cutscene` mode that suspends gameplay input.
Actors are the game's own entities driven by the timeline — same renderer,
same art, no second pipeline. Any genre uses this; the writing and the
scene presentation come from `references/story.md`.

- **Always skippable**: one visible control, and skipping jumps to the
  timeline's end **state** — every change the cutscene makes (door opened,
  boss spawned, flag set) applies on skip too, or skipping breaks the game.
- Short: an intro is 10–20 seconds, transitions less. Three slots earn a
  cutscene — why am I here, the midpoint turn or boss entrance, the ending
  — not every room.
- Text inside a cutscene advances on click, never on a timer.
- Restarting the game replays gameplay, not the intro — seen cutscenes are
  skipped by default on repeat runs.

## What not to add

- A physics engine, a behavior tree, or a command queue, until a simple
  overlap test and `mode` cannot express the slice.
- Server authority, sockets, or a custom Express server.
- Per-frame `setState`. Write HUD text on DOM nodes from step 6.
