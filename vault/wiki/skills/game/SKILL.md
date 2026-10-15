---
name: game
description: >
  Build a browser game foundation on this React Router SSR app: plain game
  state, a tick, a playable loop, feel, and 2D (Canvas 2D) or 3D (three.js)
  graphics. Use when the user asks for a game, a playable loop, game state,
  or canvas/three.js gameplay. Do not use for ordinary websites, marketing
  pages, dashboards, or stores.
---

# Game foundation

Load this skill when the user wants a **browser game**. Ordinary websites stay
on `design` and `react-router-framework-mode`. This skill is the foundation:
state, objects, tick, one playable slice, and feel — plus one genre reference
that carries the mechanics the brief's genre stands on. It is not a finished
engine.

## Laws

1. **Foundation before features.** A game state object, an object list, and a
   tick exist before jump, guns, inventory, or extra abilities.
2. **Just enough, then playable.** The first slice has real input, pressure,
   a reward or a fail, and a fast restart. Stop when that slice is engaging.
   Do not finish the architecture to 100%.
3. **Client-owned state.** Default is single-player. State lives in a plain
   module the tick mutates. Do not open sockets. Do not put the tick in
   `useState`.
4. **Loop and feel are required.** Name the core loop and prove it in code.
   Hits, pickups, and fail states get feedback from `references/feel.md`.
   Do not add loot schedules, energy timers, or "make it addictive" systems.
5. **Procedural art.** Primitives, paths, lights, and materials, authored by
   the matching graphics reference. No random GLB or texture CDNs. `get_images`
   is for 2D UI (title, icons) unless the user asks for a specific picture —
   never the world: no photo skies, backdrops, or scenery behind gameplay.
   One art style owns the frame.
6. **Readable before pretty.** The first screen names the goal and the verb
   in large type, and every pressable control shows `cursor: pointer`. Look
   does not replace that. Read `references/ui.md` before styling the overlay.
7. **One seam.** The next mechanic joins the same state and tick. Add an
   entity kind, one step in the update order, or one content record. Read
   `references/tick.md` before the second mechanic. Do not add a second tick.

## 2D or 3D

Decide the dimension before writing the world. It picks the renderer and the
graphics reference; nothing else in this skill changes.

- The brief names it, or the perspective settles it (a flat board, grid,
  side or top-down view → 2D; a camera that orbits, follows into depth, or
  sits first/third person → 3D): build that. "2.5D" — a top-down or
  isometric view at an angle, with 3D models — is 3D: a three.js scene
  with a fixed high camera, not a 2D canvas.
- When the brief supports both readings, ask the user whether the game is 2D
  or 3D before building the world. Do not guess silently and do not build
  both.

| Dimension | Renderer          | Read                        |
| --------- | ----------------- | --------------------------- |
| 2D        | Canvas 2D context | `references/graphics-2d.md` |
| 3D        | three.js          | `references/graphics-3d.md` |

## Genre

Match the brief to one row and read that file **after** `references/loop.md`
and before writing mechanics — each carries the load-bearing systems its
genre fails without (enemy movement for shooters, the jump kit for
platformers, the audio clock for rhythm). The foundation laws above always
win over a genre file — except `genres/persistent-world.md`, which replaces
Laws 1 and 3. A brief that straddles two rows takes the one that owns the
core verb; pull single sections from the other if needed. Story is not a
genre: when any brief wants narrative — dialogue, scenes, an intro and
ending that mean something — also read `references/story.md`.

One row is an architecture fork: `genres/persistent-world.md` replaces the
canvas foundation with DOM pages over PocketBase (no tick, no canvas,
server-owned state) and names which rules still apply. Read it before
anything else when the brief matches. No other genre renders pages: every
other game is a full-viewport canvas with overlays from `references/ui.md`.

| The brief sounds like                                                                                             | Read                                    |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Snake, breakout, pong, flappy, asteroids, falling blocks                                                          | `references/genres/arcade.md`           |
| Shooting things: top-down, twin-stick, space, FPS, zombies                                                        | `references/genres/shooter.md`          |
| Jumping and levels: platformer, endless runner                                                                    | `references/genres/platformer.md`       |
| Match-3, 2048, sokoban, minesweeper, logic grids                                                                  | `references/genres/puzzle.md`           |
| Word-guess, typing, trivia, letters                                                                               | `references/genres/word.md`             |
| Teaching anything: math drills, language, learning for kids                                                       | `references/genres/educational.md`      |
| Tower defense, turn-based tactics, auto-battler, RTS                                                              | `references/genres/strategy.md`         |
| Chess, checkers, card games, solitaire, memory                                                                    | `references/genres/tabletop.md`         |
| RPG, roguelike, dungeon, stealth, survival, story game                                                            | `references/genres/rpg-adventure.md`    |
| Clicker, idle, tycoon, farm or shop management                                                                    | `references/genres/simulation.md`       |
| Driving: karts, cars, laps, time trial                                                                            | `references/genres/racing.md`           |
| Pool, mini golf, pinball, bowling, air hockey                                                                     | `references/genres/sports.md`           |
| Boss fight, brawler, beat-em-up, 1v1 fighter                                                                      | `references/genres/fighting.md`         |
| Rhythm, beat-matching, press-on-time                                                                              | `references/genres/rhythm.md`           |
| Browser empire built over days, text-based life sim (mafia, sports manager), builds take real hours, daily logins | `references/genres/persistent-world.md` |

## Stack

- **Vanilla JS modules** for the simulation. The canvas renders with
  **three.js** (3D) or the **Canvas 2D context** (2D) — see the table above.
- **React** mounts the canvas and the out-of-play chrome. It does not own
  the frame.
- **No Phaser. No Pixi. No new engine. No Rapier** unless a later change
  proves the slice cannot work with simple overlap tests — when one does
  (rolling, ricochets, stacking, ridable platforms), read
  `references/physics.md` before installing anything.
- three.js imports run **only in the browser**, after hydration, from a
  module the route loads inside `useEffect` (dynamic `import()`). Do not
  import `three` from a loader, a server module, or the first render.
- Keep `ssr: true`. Do not edit `react-router.config.ts` or `vite.config.ts`.

## Where the code lives

Under `apps/web/src/game/` (client-only modules, imported from the effect):

| Module     | Owns                                                                                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `state.ts` | One plain state object: mode, entities, score, timers. No React.                                                                                               |
| `tick.ts`  | `requestAnimationFrame` loop and update order. See `references/tick.md`.                                                                                       |
| `world.ts` | Rendering: three.js scene, camera, renderer (3D) or the canvas 2D draw pass (2D). Created in the browser.                                                      |
| `feel.ts`  | Hitstop, shake, squash, flashes. See `references/feel.md`.                                                                                                     |
| `sound.ts` | Synthesized Web Audio: feel-event one-shots and a quiet atmospheric music bed — part of the default build; a silent brief skips it. See `references/sound.md`. |

The route (`src/routes/play.tsx` or `home.tsx` when the game is the whole app)
mounts a full-viewport canvas and the overlays in `references/ui.md`. It does
not compose sections under `src/components/home/`. The effect calls
`start(canvas)` and returns `stop` on cleanup. HUD numbers are written to the
DOM from the tick. Do not `setState` every frame.

## `design` vs `game`

`design` is for websites and apps. Do not load it for a game-only app. This
holds for persistent-world games too: their DOM pages are the play view,
owned by `game` and styled per `references/ui.md` and the genre file — not
website pages.

| Surface                                                                 | Owner                            |
| ----------------------------------------------------------------------- | -------------------------------- |
| The play view: canvas, HUD, start, pause, game-over, on-canvas controls | `game` — read `references/ui.md` |
| A separate page that is not the game (about, legal, account)            | `design`                         |

When the product is only the game, do not add a header or a footer in
`root.tsx`. Load the two place-based faces from `references/ui.md` there.
`react-router-framework-mode/references/special-files.md` shows the website
shell — skip that shell here. The start screen is an overlay on the play view.

## Build order

A brief matching the persistent-world row skips this build order —
`genres/persistent-world.md` replaces it (keep step 1's loop contract).

1. Read `references/loop.md`. Write the one-sentence loop contract before
   code, in the module comment is enough — do not add a design doc file
   unless the user asked for one. Then read the matching genre file from
   the Genre table — it names the mechanics the slice must carry.
2. Read `references/tick.md` and `references/ui.md`. Stand up state, an empty
   object list, a full-viewport canvas, and a tick that renders a primitive
   with the chosen renderer (2D or 3D — see the table above).
3. Map one input to one verb. Add one pressure and one fail or reward.
4. Read `references/feel.md`. Add feedback on that verb. Check the loop
   tests in `references/loop.md`.
5. Once the slice plays, read the matching graphics reference
   (`references/graphics-2d.md` or `references/graphics-3d.md`) and replace
   primitives with authored forms, palette or materials, and lighting. Keep
   the loop playable while you do. Give the game sound in the same pass —
   feel-event one-shots and the quiet music bed, synthesized per
   `references/sound.md`, never from audio files — unless the brief asked
   for silence.
6. Only then add the next mechanic on the same state and tick, using one
   plug from `references/tick.md`.

## Verify before handing back

You cannot open the game, see the canvas, or press a key — and game code is
client-only, so **none of it runs during reload or typecheck**. A game that
crashes on Start looks identical to a working one from here. Compensate on
both ends:

1. Run everything that can run: `reload_app` must come back clean — started,
   lint, typecheck, no errors in the dev-server log. Type errors are the
   main net for client-only code; do not weaken types in `game/` to ship.
2. Walk the checklists against the code, not from memory: the contract and
   tests in `references/loop.md`, the pass check in `references/ui.md`, and
   the "what goes wrong" list of every reference you used this task.
3. Trace the two paths that break most and are never exercised by checks:
   the full input path (listener → state flag → tick reads it → visible
   change) and the full restart path (every timer, entity, tween, loop
   counter, and sound back to initial — stale state is the top post-restart
   bug).
4. Hand the user a playtest line, not a claim: name what to try — start,
   the verb, one fail, one restart — so the first human run checks the
   things you could not. Never say the game was tested.

## References

| Reference                   | Read when                                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `references/loop.md`        | Starting a game, or the scene moves but is not a game                                                |
| `references/tick.md`        | Writing the frame loop, pause, hitstop, a cutscene, or the next mechanic                             |
| `references/feel.md`        | A hit, pickup, jump, or fail feels like bookkeeping                                                  |
| `references/ui.md`          | Drawing the play view, HUD, start, pause, or controls                                                |
| `references/graphics-2d.md` | The game is 2D: drawing the world — shapes, palette, sprites, canvas effects                         |
| `references/graphics-3d.md` | The game is 3D: building the world — models, materials, lighting, render pipeline                    |
| `references/sound.md`       | Adding sound: procedural Web Audio one-shots and the music bed, groups, unlock, mix — no audio files |
| `references/story.md`       | The brief wants narrative in any genre: scene graph, writing rails, scene presentation               |
| `references/physics.md`     | Overlap tests proved insufficient (rolling, ricochets, stacking): Rapier, fixed timestep, sensors    |
| `references/debug.md`       | The game is blank, wrong, frozen, or slow: ordered triage and the measure-first profiling loop       |
| `references/genres/*.md`    | Always, once the loop contract exists: the Genre table above routes the brief to one file            |

## What goes wrong

- A first screen that does not name the goal and the verb, or controls with no pointer cursor.
- HUD or controls that stay a small fixed size on a large viewport.
- A second tick, or the same index branched in input, the pass test, the coach, and the HUD.
- An `entities` list the tick never reads.
- A framed canvas with a `header`, `aside`, or `footer` sibling, or a page that scrolls.
- A root header or a root footer on a game-only app.
- Titles that use the template Arial stack, DM Sans, or one geometric neo-grotesk as a default.
- A three.js scene you can orbit, with no decision, no fail, and no restart.
- Game state in React state, updated every frame.
- `three` imported during SSR (hydration error or a blank document).
- Features (jump, weapons, inventory) before state + tick exist.
- A dimension guessed silently when the brief reads both 2D and 3D, or a
  flat board/grid game built in three.js.
- A final look that is still bare primitives plus glow — the graphics pass
  (`references/graphics-2d.md` / `references/graphics-3d.md`) never ran.
- Phaser, a physics engine, or a downloaded GLB on the first slice.
- Sockets or a custom Express server. This template serves with
  `react-router-serve`. Realtime multiplayer is out of scope in every
  genre; async request/response multiplayer exists only in
  `genres/persistent-world.md`.
