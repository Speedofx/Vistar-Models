# Debug and profile

Read this when the game is broken (blank, wrong, frozen) or slow. It is a
procedure, not a feature: nothing here ships to the player.

## Triage order

1. Reproduce first — **in active play, not on the title screen**. Most bugs
   only exist after start; a check that ends at the overlay proves nothing.
2. Read the console before touching code. An error names the owning module;
   fix it there, not where the symptom shows.
3. Identify the owner before editing: state, tick, renderer, camera, input,
   feel, sound, physics, or CSS/overlay. One bug, one owner.
4. After the fix, retest the exact path that was broken, in active play.

Guessing without reproducing, and patching CSS when the real bug is renderer
or camera sizing, are the two classic wastes.

## Blank or wrong canvas — check in this order

Shared (both renderers):

1. The canvas is in the DOM and its CSS size is non-zero (a `display: none`
   ancestor or a collapsed flex parent gives 0×0).
2. The drawing-buffer size is set: `width`/`height` reflect the CSS size ×
   DPR (`references/graphics-2d.md` / renderer `setSize`).
3. Exactly one `requestAnimationFrame` loop is running and actually reaches
   the draw call (log once inside it, not per frame).
4. No overlay sits on top: a start overlay that never unmounted, or a
   non-`pointer-events-none` HUD layer, covers a perfectly working game.

3D only, in order: WebGL context created → camera aspect matches the canvas
and `updateProjectionMatrix` was called → camera is aimed at the scene and
near/far contain it → objects exist at expected transforms and scale (add a
bare cube at origin to split "scene empty" from "camera wrong") → materials
are visible (opacity, `transparent`, `side`, non-black color with lights
present) → lights exist for lit materials → background and fog are not the
same color as the objects → when using a composer, the final pass renders to
screen.

2D only, in order: the context was obtained once (`getContext('2d')`) →
`setTransform` for DPR runs before drawing, not after → the clear is not
painting over the frame (wrong order) → fill style is not the background
color → the camera translate is not off-screen (draw one rect at a fixed
screen position to split "world empty" from "camera wrong").

## Slow — profile in this order

Never optimize without a baseline; never change two things between measures.

1. Fix the scenario: same route, viewport, DPR, and gameplay moment (active
   play with typical entity counts, not the start screen).
2. Baseline: frame time (ms, from the tick's real delta), and the renderer
   numbers — 3D: `renderer.info.render.calls`, `.triangles`,
   `.memory.geometries`, `.memory.textures` against the budgets in
   `references/graphics-3d.md`; 2D: draw operations per frame and canvas
   size. Physics games add body/collider counts.
3. Classify the bottleneck before fixing:
   - **CPU** — long tick: per-frame allocations, unpooled objects, physics
     step, O(n²) overlap loops.
   - **GPU draw (3D)** — too many draw calls or unique materials: instance,
     merge, share.
   - **GPU fill** — overdraw: high DPR, post passes, large transparent
     particles (3D); `shadowBlur`/`ctx.filter`, huge gradients (2D).
   - **Memory** — climbing heap or texture count: something is created per
     frame or never disposed.
4. Apply **one** change — the highest-payoff lever for that class, from the
   performance sections of the graphics references — re-measure the same
   scenario, and check nothing visual or playable regressed.

## Diagnostics object

Expose one dev-only handle so numbers are one console call away instead of
scattered logs:

```text
if (import.meta.env.DEV) {
  window.__GAME_DEBUG__ = {
    get state() { return state; },        // the live game state object
    info: renderer.info,                  // 3D; 2D: { drawOps, frameMs }
  };
}
```

Keep counters the tick already has (entity counts, pooled/active particles,
frame ms) readable from it. Remove nothing on cleanup — it is dev-only and
costs nothing. Do not build a player-facing stats overlay unless the user
asks.

## What goes wrong

- A fix verified on the title screen that breaks the moment play starts.
- Two changes between measurements — no way to tell which one worked.
- Visual detail deleted for performance before DPR, post, shadows, or
  instancing were even checked.
- Console errors ignored because the canvas "looks fine".
- Profiling the dev server when the user-facing complaint is production.
- A stats overlay added to the game instead of the dev-only handle above.
