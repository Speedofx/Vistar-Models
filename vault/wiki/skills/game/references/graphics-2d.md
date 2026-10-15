# 2D graphics — Canvas 2D

Read this when the game is 2D. The world renders on the one full-viewport
`<canvas>` through its 2D context, and everything visible is drawn in code:
paths, gradients, and pre-rendered offscreen sprites. No three.js, no Pixi,
no Phaser, no DOM nodes as game objects, no image files, no sprite sheets, no
image or asset generation for world art — the hub's `get_images` allowance is
for DOM UI (title screen, icons) only. Nothing to install. Sound follows the
same rule in `references/sound.md`: synthesized in code, no audio files.

## Core rule

Authored shapes first, then palette, then light and shadow illusion, then
effects — in that order. One bare rect or circle per entity is a placeholder,
not a finished object. Glow never fixes a missing shape.

## Canvas setup

- Render at device resolution: `canvas.width = cssWidth * dpr`,
  `canvas.height = cssHeight * dpr`, then `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)`
  so all drawing uses CSS-pixel coordinates. Cap `dpr` at 2.
- Resize re-applies the sizing and re-renders cached sprites. The CSS size
  stays the full viewport frame from `references/ui.md`.
- One draw pass per frame from the tick (`references/tick.md`): full clear,
  then back to front. No partial-clear tricks — they break the first time the
  background moves.
- For a pixel-art look: `ctx.imageSmoothingEnabled = false` and snap draw
  positions to integers. Otherwise leave smoothing on and don't snap.

## Frame order

1. Clear.
2. Background layers, far to near, each offset by a fraction of the camera
   position (parallax — the cheapest depth in 2D).
3. World and entities, back to front, inside the camera transform:
   `ctx.save()`, `ctx.translate(-camX + shakeX, -camY + shakeY)`, draw in
   world units, `ctx.restore()`.
4. World-space effects: trails, particles, impact rings.
5. Screen-space overlays drawn outside the camera transform: vignette, fail
   flash.

The HUD stays DOM per `references/ui.md` — canvas text is only for labels
that live inside the world.

## Authoring shapes

- Each gameplay role gets its own draw function (or pre-rendered sprite)
  built from composed paths: a body mass, functional parts, trim, and a state
  cue — not a single primitive. Asymmetry and attached parts make a shape
  look authored.
- **Silhouette first.** Fill the shape in one dark color: if the role isn't
  recognizable, fix the outline before adding color or glow.
- Fake lighting with value layers: a base fill, a darker underside or shadow
  side, a lighter top or highlight edge. Two or three layers per object is
  enough; a thin outline or rim separates it from the background.
- Every distinct gameplay role gets a distinct silhouette and palette cue,
  readable at gameplay distance and speed. A recolor of the same shape is one
  variant, not a second role.
- Cache `Path2D` objects and gradients at module level or in `start()` —
  never rebuild them per frame.
- State variants: palette swap, a translucent overlay flash over the shape, a
  squash/stretch scale around the shape's own center. These are the 2D
  equivalents of the emissive flash and squash in `references/feel.md`; the
  FOV punch becomes a brief camera zoom (scale inside the camera transform).

## Palette

A small set of named roles shared by the world, the entities, and the
effects: background, surface, a primary body, a secondary contrast, trim, a
danger cue, a reward cue, a signal/glow accent, and a shadow value. Five to
eight colors total. Separate roles by value contrast, not hue alone —
anything conveyed by color alone also needs a shape or motion cue.

The palette's hues come from the named place and its hour ("The background
is a place" below), not from a generic pleasant set: a moonlit forest is
deep blue-greens with a cold highlight; a harbor at dawn is warm sky over
dark water. If the palette would fit any game, it is describing no place.

The palette needs a full value range and a saturation hierarchy. The default
failure is the bleached pastel world: every color in the same bright,
low-saturation band, where nothing anchors and the playable surface melts
into the background. Commit to real darks (the shadow value, outlines, the
background's deepest layer) and real saturation on everything gameplay
touches: the player, threats, rewards, the surface they play on. If anything
gets desaturated, it is the far background, never the game. Two checks:
imagine the frame in grayscale — the player, the nearest threat, and the
playable surface must still separate by value alone; and if every color in
the palette would pass as a nursery wall paint, it is a default, not a
choice. A brief's stated art direction overrides all of this.

## Pre-rendered sprites

Draw a complex object once into an offscreen canvas at `dpr` resolution, then
`drawImage` it each frame — this is the 2D instancing. Use it for any shape
drawn many times or built from many path operations. Re-render the sprite
when size or `dpr` changes, and on a state change that alters the art (not
per frame).

Procedural texture goes the same way: small offscreen canvases with noise,
stripes, grain, or stars, tiled via `createPattern` or drawn as scattered
sprites. Generate random scatter once in `start()` — never during React
render and never per frame.

## The background is a place

Name the place in one sentence — a moonlit forest, a harbor at dawn, a
neon rooftop skyline — and build the parallax layers as that place:
silhouettes that belong to it at two or three depths, lit by its hour, in
its palette. The background is drawn in the same language as the entities
— paths, gradients, and sprites from this file; never a fetched photograph
or `get_images` picture behind canvas shapes, which splits the frame into
two art styles. A flat fill or an abstract gradient behind the game is the
2D equivalent of the empty ground plane. Give the background a little
ambient motion — drifting clouds, twinkling stars, rolling waves on the
far layer — slow, and never competing with gameplay; a background where
nothing moves reads as wallpaper.

## Depth cues

- Parallax background layers (frame order above).
- A contact shadow — a soft dark ellipse under an entity, scaled and faded
  with its height — grounds anything that moves or hovers.
- Scale and value fade with distance when the game implies depth: farther
  things are smaller, lighter, and less saturated.

## Effects

- Additive glow and energy: `ctx.globalCompositeOperation = 'lighter'` for
  the effect pass, reset after. Cheap and bright.
- `shadowBlur` is the most expensive canvas operation. Pre-render glows into
  sprites; never set `shadowBlur` per entity per frame.
- Trails: store recent positions on the entity and redraw them with fading
  alpha and shrinking size.
- Particles: pooled plain objects in the state, drawn as arcs or rects,
  spawned by feel events (`references/feel.md`). No allocation per frame.
- Every effect points at a state change the player must read — spawn and
  destroy must look different, and nothing may cover the next threat.

## Performance

- No allocations in the draw loop: gradients, `Path2D`, patterns, and arrays
  are created in `start()` or on a state change.
- Group drawing by style to minimize `fillStyle`/`strokeStyle` churn.
- A few hundred draw operations per frame is comfortable; thousands of
  individually-pathed shapes are not — that is what pre-rendered sprites are
  for.
- `ctx.filter` and `shadowBlur` are per-draw GPU stalls; treat both as
  banned in the per-frame path.

## What goes wrong

- Single-primitive entities with a glow shipped as the final look.
- `shadowBlur` or `ctx.filter` inside the frame loop.
- Gradients or `Path2D` rebuilt every frame.
- Every color in the same bright pastel band — no darks, no saturation
  anchor, the playable surface melting into the background.
- Gameplay roles distinguishable only by hue.
- DOM elements moved per frame as game objects.
- A flat single-color background with no layers, light, or texture.
- A background that is no place — abstract gradient, silhouettes from
  nowhere — or one where nothing ever moves.
- A photograph behind canvas shapes — two art styles in one frame.
- An image, sprite sheet, or font fetched for world art.
