# Racing games

Read this when the brief is a racer: karts, cars, boats, hover ships, or
"a driving game". Dimension: 2D top-down racers are a legitimate quick
build; behind-the-car 3D is the usual expectation when the brief says
"racing game" — ask per the skill hub when unclear. Define the **handling
fantasy** first (grippy kart, drifty arcade, floaty hover) — it decides
every constant below.

## Sub-genres

| Sub-genre                 | Loop                            | Load-bearing mechanics                     |
| ------------------------- | ------------------------------- | ------------------------------------------ |
| Lap racer                 | Beat opponents over laps        | Kinematic car, checkpoints, rubber-band AI |
| Street sprint             | Beat rivals point to point      | Same on an open curve, traffic as hazards  |
| Time trial                | Beat the clock, then your ghost | Same + best-time persistence               |
| Drift / stunt             | Score style under time          | Drift state, score multipliers             |
| Obstacle / traffic runner | Survive the road                | `genres/platformer.md` runner with a car   |

## The kinematic car — not a physics engine

Arcade handling is authored, not simulated (`references/physics.md` stays
closed; a racer is kinematic control + simple collision response):

```text
// per tick, gameplay delta
car.speed += (input.throttle ? ACCEL : 0) * dt;
car.speed *= input.brake ? BRAKE_DECAY : ROLL_DECAY;   // per-tick friction
car.speed = Math.min(car.speed, MAX_SPEED);
const turn = TURN_RATE * turnGrip(car.speed) * input.steer * dt;
car.angle += turn * Math.sign(car.speed);
car.x += Math.cos(car.angle) * car.speed * dt;
car.y += Math.sin(car.angle) * car.speed * dt;
```

- **Turn rate scales with speed** (`turnGrip`): near zero at standstill,
  full at mid speed, reduced at top speed. A constant turn rate is the
  number-one "feels like a shopping cart" bug.
- Drift (if the fantasy wants it): while drifting, the velocity direction
  lags the facing angle (store them separately and ease velocity-direction
  toward facing); reduced steering grip, small speed bleed, and a boost on
  a well-held release. Visible state per the graphics reference (trail,
  angle).
- Off-track is friction, not death: a surface multiplier slows grass/sand
  hard. Walls deflect and bleed speed — never a dead stop at speed, which
  reads as a crash bug.
- **Contact is an event, not just math** (the Contact rule in
  `references/loop.md`): a wall scrape shakes the camera, plays a scrape,
  sparks at the contact point, and visibly bleeds speed; a kart-on-kart
  bump pushes both apart with a thud and the AI reacts to it; a hard
  head-on earns a brief hitstop. A collision the player cannot feel reads
  as sliding on ice.

## Track construction — one curve owns everything

The track's geometry comes from one centerline curve (Catmull-Rom through
the waypoint list — closed into a loop for a circuit, open with a start and
a finish gate for a point-to-point street sprint), and everything on or
beside the asphalt derives from it — never hand-placed:

- The road is a ribbon extruded along the curve: at each sample, offset
  left and right by half the track width along the curve's normal, and
  triangulate. Sample densely where curvature is high, sparsely on
  straights — a corner made of visible straight segments reads as broken.
- Elevation and banking are properties of the curve points: `y` on the
  centerline makes hills and crests, rolling the cross-section around the
  tangent makes banked curves. Smooth both along the curve — a kink in the
  ribbon reads as shattered asphalt.
- Curbs, walls, barriers, boost pads, the start gantry, grid slots, and
  checkpoint triggers are all placed by `(t, sideOffset)` on the same
  curve. This is what makes everything line up by construction — floating,
  misaligned barriers are the tell that something was placed by hand.
- Trackside dressing follows the same rule at larger offsets, and matches
  the fantasy: grandstands and pit buildings for a circuit; buildings,
  streetlights, parked cars, and neon for a street race; rocks and brush
  for rally — at fixed `t`-ranges, with smaller props in seeded bands
  beyond, and the far layer (hills, towers, a skyline) closing the horizon
  per `references/graphics-3d.md`. An empty ground plane past the barriers
  reads as a void.

## Track, checkpoints, laps

The track is an ordered loop of waypoints (also the AI's racing line).
**Checkpoints are the lap system**: a lap counts only after passing every
checkpoint in order (`nextCheckpoint` index per car) — distance-to-finish
alone is cuttable. Wrong-way detection: movement against the
checkpoint direction for ~2 s shows a wrong-way warning. Reset (on stuck or
key press) respawns at the last checkpoint, facing the next one, at zero
speed.

Readable track rules from the repo's recipe: visible apexes, recovery width
beside the racing line, landmarks to navigate by, rhythm of straights and
corner clusters (compression/release per `references/loop.md`).

## Opponents — same car, real pace

AI drive the **player's movement model with the player's constants** — an
AI with its own slower copy can never be competitive, and a field that
never pressures the player is the most common way this genre ships boring.
Each AI follows the racing line (with a small per-driver lateral offset so
they don't ride one rail) at a target speed per sample computed from the
curve's curvature — braking before tight corners, full throttle out — plus
a per-driver skill factor (~0.94–1.02 on target speed and braking
distance) so the field spreads and the AI battle each other, not just the
player. Validate the pace: an AI's clean lap must land within a few
percent of the best lap you can derive from the player constants — if a
sloppy player wins easily, the AI is too slow and the race has no reason
to be driven twice.

**Rubber-banding keeps races close and must be bounded**: ahead of the
player, cap AI top speed slightly below the player's; behind, allow
slightly above. Clamp to ±~8% — beyond that players notice and feel
cheated. Difficulty tiers move the clamp and the braking caution, never
teleport cars.

Start with 3–5 opponents, staggered grid start, position tracking via
checkpoint progress + distance to next (drives the "3rd / 5" HUD slot).

## The vehicle model

The player stares at the back of this one object for the whole race — it
gets the most modeling budget in the scene (`references/graphics-3d.md`
composed-parts rules), and its body follows the brief's fantasy, not a
default:

| Fantasy             | The body reads as                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Kart / open-wheel   | Exposed spinning wheels, visible driver with helmet, bare chassis and nose                  |
| Street / sports car | Closed body: cabin with windows, wheels in arches, bumpers, spoiler, head- and brake lights |
| Rally / offroad     | Closed body raised on visible suspension, mud guards, light pod, dirt kick                  |
| Hover / sci-fi      | No wheels: hull with fins, thruster glow that scales with throttle, banking in corners      |

Invariants across all of them: wheels (where visible) **spin with speed
and steer with input** — static wheels kill the sense of speed more than
any missing effect; cars show brake lights under braking; materials come
from the kit's roles (painted shell, dark rubber, glass, metal trim). A
box with a sphere on top fails the silhouette rule at exactly the distance
the camera holds. Opponents reuse the same model with palette-swapped
shells — distinct enough to track in a mirror glance.

## Feel and HUD

Speed must be _felt_: FOV punch with speed (3D) or slight zoom-out (2D),
near-ground detail streaming past (the graphics references' near layer),
engine pitch rising with speed (a continuous `sfx`-group oscillator per
`references/sound.md`, running under the music bed; tie frequency to
`car.speed`). HUD per
`references/ui.md` zones: position and lap top-left, time top-right, big
center countdown at start (3-2-1, input locked until GO).

## Difficulty levers

AI clamp and caution, track width and corner tightness, lap count, surface
penalty, traffic density. Ramp across races, not mid-race — a race is one
encounter.

## What goes wrong

- Constant turn rate at all speeds.
- A physics engine installed for an arcade racer.
- Track visuals placed by hand instead of derived from the centerline —
  kinked ribbon edges, floating misaligned barriers, curbs that drift off
  the asphalt.
- AI on their own slower movement model — the field never pressures the
  player and the race is a parade.
- Wall and kart contacts with no shake, sound, or visible speed loss.
- A box-and-sphere kart, or wheels that neither spin nor steer.
- Lap counting by finish-line distance — players cut the track.
- Unbounded rubber-banding: the race feels rigged (because it is).
- A dead-stop wall hit at top speed, or off-track as instant fail.
- No reset: one bad corner ends the run in a wall.
- No countdown — the race starts while the player's hands are off the keys.
- Speed with no sensation: no FOV/zoom, no near detail, silent engine.
