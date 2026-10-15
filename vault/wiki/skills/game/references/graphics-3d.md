# 3D graphics — three.js

Read this when the game is 3D. The world renders with three.js and everything
visible in it is procedural: primitives, authored geometry, canvas-generated
textures, lights, and materials. No model files, no texture downloads, no
image or asset generation for world art — the hub's `get_images` allowance
is for DOM UI (title screen, icons) only. Sound follows the same rule in
`references/sound.md`: synthesized in code, no audio files.

`three` is not preinstalled. Install it in `apps/web` first:
`npm install three` and `npm install --save-dev @types/three`. Addons import
from `three/addons/*`. All of it stays browser-only behind the dynamic
`import()` described in the skill hub — three.js must never run during SSR.
Verify version-sensitive API details against the installed three version.

## Core rule

Authored forms first, then materials, then lighting, then effects — in that
order. Glow, fog, bloom, and particles never stand in for missing geometry.
A primitive with a glow is a placeholder, not a finished object.

## Renderer baseline

Set once in `world.ts` when the renderer is created:

- `new THREE.WebGLRenderer({ antialias: true, canvas })`.
- `renderer.outputColorSpace = THREE.SRGBColorSpace`.
- When anything casts a real shadow: `renderer.shadowMap.enabled = true` and
  `renderer.shadowMap.type = THREE.PCFSoftShadowMap`.
- Tone mapping is a choice: `ACESFilmicToneMapping` suits cinematic stylized
  scenes; simpler tone mapping reads better for bright arcade looks. Tune
  `toneMappingExposure` against active play, not a static title view.
- Cap DPR: `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`; prefer
  `1.5` on mobile.
- Environment map — metals, glass, and glossy surfaces read as flat gray
  without one. One PMREM bake at startup, near-zero per frame:

```text
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
pmrem.dispose();
```

- Resize updates the canvas, renderer, camera aspect
  (`camera.updateProjectionMatrix()`), and composer together.
- `stop()` disposes the renderer, geometries, materials, and generated
  textures so a restart or route change does not leak GPU memory.
- The camera is composition: it keeps the player, the immediate threat or
  reward, and the route visible (`references/tick.md` owns the follow logic).
  Check the framing on a narrow mobile viewport separately — it usually
  needs different offsets or FOV.

## Modeling

- **Silhouette first.** An object must be recognizable as a dark shape before
  materials or glow. If it only reads because it glows, the geometry is
  missing.
- Build from composed parts, not one primitive: a primitive base plus
  extrusions, bevels, curves, tubes, lathes, custom buffers, trim strips, and
  instanced micro-detail. Asymmetry and functional parts — vents, fins,
  brackets, seams, panels — make a form look authored.
- Every distinct gameplay role gets a distinct silhouette and a material cue,
  readable at gameplay distance. A recolor of the same box is one variant,
  not a second role.
- Detail goes where the camera looks, not on hidden undersides.
- State changes come from material swaps, emissive pulses, and animated child
  parts — group parts under named children (`core`, `signal`,
  `collisionProxy`) so the tick can reach them.
- The collision shape stays a separate simple proxy; animate and detail the
  visual group, never the proxy (`references/feel.md`).

| Class                   | Use for                                        |
| ----------------------- | ---------------------------------------------- |
| `ExtrudeGeometry`       | panels, fins, plates, badges, trim             |
| `LatheGeometry`         | domes, nozzles, pipes, rounded bases           |
| `TubeGeometry`          | cables, rails, curved conduits                 |
| custom `BufferGeometry` | tapered hulls, rocks, shards, low-poly terrain |
| `ShapeGeometry`         | flat decals, markers, icon shapes              |
| `InstancedMesh`         | any repeated small detail or prop              |
| `LOD`                   | near/far variants of large or dense objects    |

When real bevels are too expensive, fake them: thin offset trim meshes or
slightly darker edge panels.

## Materials

Define a small kit of named, shared roles and reuse them across every mesh
playing the same part — never one-off colors per mesh: a primary body, a
secondary contrast, trim, a danger cue, a reward cue, glass, an emissive
signal, and a dark ground-contact material. Separate roles by roughness and
metalness contrast, not hue alone.

The kit's hues come from the named place and its hour (the one-sentence
world in "World, sky, fog"), not from a generic pleasant set: a seaside
noon is deep sea blue, hot sand, whitewash, and terracotta; a neon night is
near-black blues under saturated signage. If the palette would fit any
game, it is describing no place.

The kit needs a full value range and a saturation hierarchy, decided before
any mesh is colored. The default failure is the bleached pastel world: every
surface in the same bright, low-saturation band — cream ground, mint props,
baby-blue sky — where nothing anchors, the track reads like the ground beside
it, and the scene looks like a mockup instead of a place. Commit to real
darks (ground contact, shadow sides, trim) and real saturation on everything
gameplay touches: the playable surface, the player, threats, rewards. If
anything gets desaturated, it is the background, never the game. Two checks:
imagine the frame in grayscale — the playable space, the player, and the
nearest threat must still separate by value alone; and if every color in the
kit would pass as a nursery wall paint, the palette is a default, not a
choice. A brief's stated art direction overrides all of this.

`MeshStandardMaterial` for most surfaces; `MeshPhysicalMaterial` only where a
physical-only feature is visible during play. Starting points (assume the
environment map above):

```text
// Painted shell:  color, metalness 0, roughness 0.5, clearcoat 0.9, clearcoatRoughness 0.15
// Bare metal:     color 0xaeb4bd, metalness 1.0, roughness 0.4, envMapIntensity 1.1
// Matte body:     color, metalness 0, roughness 0.6, envMapIntensity 0.6
// Dark rubber:    color 0x0a0a0b, metalness 0, roughness 0.92, envMapIntensity 0.35
// Glossy ceramic: color, metalness 0, roughness 0.12, clearcoat 1.0, clearcoatRoughness 0.05
// Cloth/fabric:   color, metalness 0, roughness 0.9, sheen 1.0, sheenRoughness 0.5, sheenColor
// Emissive signal: color 0x101010, emissive <signal color>, emissiveIntensity 2.5
```

The emissive base color must be dark so only the glow reads, and non-black
`emissive` is required for flash feedback (`references/feel.md`).

Glass: real `transmission: 1` renders the whole scene into an extra buffer
every frame — one or two hero surfaces at most, never repeated or instanced
props. Fake glass for everything else: transparent, `opacity` ~0.25,
`roughness` 0.1, `clearcoat: 1`, `depthWrite: false`.

Procedural surface detail beats unique textures: small canvas-generated
textures (`CanvasTexture`) for stripes, grain, panel lines, and markings,
repeated and shared; thin coplanar decal meshes with
`polygonOffset: true, polygonOffsetFactor: -1` to avoid z-fighting. Generate
random scatter and noise once in `start()` — never during React render and
never per frame.

## Lighting and shadows

A small readable stack: one key light that defines form, a fill that keeps
gameplay objects legible, a rim or back light that separates the player and
threats from the background, and practical emissives on the objects
themselves. Prefer few measured lights over many unmeasured ones. Keep the
fill well below the key — an over-strong fill or ambient erases shadow sides
and flattens even a well-chosen palette into the pastel wash above.

Real shadows go to the focal subject and large world anchors only — one or
two shadow-casting lights, map size 1024–2048, bias tuned against acne.
Everything small or hovering gets a fake contact shadow: a
`PlaneGeometry` with a radial-gradient `CanvasTexture`,
`transparent: true, depthWrite: false`, scaled and faded with height. It
grounds objects for one draw call.

Vertex-color AO is the cheapest depth cue for static world geometry: bake
darkness into a `color` attribute in cavities and under overhangs, material
`vertexColors: true`.

## World, sky, fog

**Name the place before building it.** One sentence — a sun-bleached
seaside circuit, a rain-slick neon harbor, a pine valley at dusk — and
every choice after it (palette, sky, fog, prop kit, lighting) argues for
that sentence. The brief's setting is the place when it names one;
otherwise pick a strong one and commit. A world assembled without this
sentence converges on the generic result: a flat ground plane, a default
sky, and props that belong nowhere.

**Mood is one decision, not three.** The sky gradient, the fog color, and
the key light's color temperature describe the same air and the same hour —
golden hour, overcast noon, neon night. Choose the hour once and derive
all three from it; fog that doesn't blend into the horizon color, or a warm
sunset sky over cold white light, reads as a composite of screenshots.

**One art style owns the frame.** Everything on screen — ground, far
layer, sky, entities — is built in the same procedural language: the sky
is the gradient dome below, the far layer is authored silhouettes. Never a
fetched photograph, photoreal image, or `get_images` picture as sky,
backdrop, or scenery: stylized objects in front of a photographic world
read as toys on a postcard, and the mismatch is the first thing a player
sees. The atmosphere demands in this section are met by building more
world, never by fetching one.

The world is a kit, not one floor plane: a small set of modular, instanceable
pieces (ground or track modules, boundary pieces, repeated structures,
scatter props) recombined with enough variation that repetition does not show
at gameplay camera distance. Build it in layers and keep every layer clear of
threats and the next decision:

- **Near** — props close to the camera that sell speed and scale.
- **Mid** — the playable space: where the gameplay reads.
- **Far** — background silhouettes at varied scales and distances, cheap and
  instanced; add parallax for motion-heavy games.

A gradient sky dome beats a cubemap for stylized scenes — one draw call, no
textures:

```text
const sky = new THREE.Mesh(
  new THREE.SphereGeometry(500, 32, 16),
  new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: {
      uTop:      { value: new THREE.Color(0x3a6fb0) },
      uHorizon:  { value: new THREE.Color(0xcfe4f5) },
      uSunColor: { value: new THREE.Color(0xfff2cc) },
      uSunDir:   { value: new THREE.Vector3(0.4, 0.28, 0.6).normalize() },
    },
    vertexShader: `varying vec3 vDir;
      void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `varying vec3 vDir;
      uniform vec3 uTop, uHorizon, uSunColor, uSunDir;
      void main(){
        float h = clamp(vDir.y * 0.5 + 0.5, 0.0, 1.0);
        vec3 col = mix(uHorizon, uTop, pow(h, 0.6));
        float d = clamp(dot(normalize(vDir), normalize(uSunDir)), 0.0, 1.0);
        col += uSunColor * (pow(d, 800.0) + pow(d, 8.0) * 0.25); // disc + halo
        gl_FragColor = vec4(col, 1.0);
      }`,
  })
);
sky.frustumCulled = false;
scene.add(sky);
```

A raw `ShaderMaterial` bypasses tone mapping and sRGB conversion, so author
its colors in display space, and keep the horizon value distinct from hazards
silhouetted against it.

Fog (`scene.fog`) reveals depth and mood — it does not stand in for an empty
world, and hazards must stay readable against fog values.

**Every layer is populated, in clusters.** From any gameplay camera angle,
no bare plane runs to the horizon: the mid layer gets edges and structures,
the far layer gets silhouettes at varied scales, and scatter props land in
seeded clusters with gaps between them — nature and cities both clump; a
uniform sprinkle reads as noise and an even grid reads as placement. Cheap
instanced variety (two or three scales and rotations of the same prop)
beats one more prop kind.

**The world moves a little.** Two or three slow ambient movers — drifting
clouds, swaying banners or grass (the wind-sway injection below), birds
circling the far layer, shimmer on water — none of them gameplay. A world
where nothing moves but the entities reads as a screenshot backdrop, not a
place; motion is also what sells the far layer as distant instead of
painted.

## VFX

World-space effects are event-driven and pooled: build each effect's meshes
once in `start()`, hide them (`visible = false`), and have feel events
(`references/feel.md`) activate one from the pool. One shared geometry and
material per effect kind; never allocate meshes, geometries, or materials
when an event fires.

The workhorses are cheap: an expanding, fading ring mesh for impacts; a
handful of small shard meshes (or one `InstancedMesh`) with velocity and
gravity for bursts and destruction; a scale-up telegraph before a spawn and a
scale-down or dissolve on despawn; short-lived stretched quads for trails and
streaks. Rise-scale-fade for collected pickups.

Every effect points at the player, a threat, a reward, or an impact — spawn
and destroy must look different, and nothing may cover the collision volume
or the next decision. Threats read differently from rewards by shape and
motion, not hue alone. Heavy flash and strobe honor `prefers-reduced-motion`.

## Shader effects

Inject into stock materials with `onBeforeCompile` to keep PBR lighting. Two
rules make it safe: set `material.customProgramCacheKey` to a string unique
to the injection (or three may reuse an un-injected cached program), and
stash the shader for animated uniforms — `onBeforeCompile` fires once:

```text
material.onBeforeCompile = (shader) => {
  shader.uniforms.uRimColor = { value: new THREE.Color(0x33ccff) };
  shader.uniforms.uRimStrength = { value: 1.5 };
  material.userData.shader = shader;
  shader.fragmentShader = 'uniform vec3 uRimColor;\nuniform float uRimStrength;\n'
    + shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      `#include <emissivemap_fragment>
       float fres = pow(1.0 - saturate(dot(normalize(vNormal), normalize(vViewPosition))), 3.0);
       totalEmissiveRadiance += uRimColor * fres * uRimStrength;`,
    );
};
material.customProgramCacheKey = () => 'fresnel-rim';
```

That fresnel rim marks state changes (shield, invulnerable, selected) for a
few ALU ops. The same pattern (with `uniforms.uTime` written each frame from
`userData.shader`) drives two more proven effects:

**Wind sway** for background life — grass cards, banners, antennae; never on
collidable geometry. `transformed` is object space and is displaced before
`instanceMatrix` applies, so read the instance translation for a per-instance
phase. Assumes the model origin at the base, up = +Y:

```text
shader.vertexShader = 'uniform float uTime;\n' + shader.vertexShader.replace(
  '#include <begin_vertex>',
  `#include <begin_vertex>
   #ifdef USE_INSTANCING
     float phase = instanceMatrix[3].x + instanceMatrix[3].z;
   #else
     float phase = 0.0;
   #endif
   float h = max(position.y, 0.0); // base stays planted, tips move most
   transformed.x += sin(uTime * 1.5 + phase) * 0.08 * h;
   transformed.z += cos(uTime * 1.1 + phase) * 0.05 * h;`,
);
```

**Dissolve** for spawn and despawn — threshold-discard with a glowing edge,
driven by a `uProgress` uniform (0→1 despawns, 1→0 spawns). Inject a
local-position varying (`vDisPos = position;` after `<begin_vertex>`) and a
`hash13` function, then in the fragment shader before
`<dithering_fragment>`:

```text
float n = hash13(floor(vDisPos * 12.0));
if (n < uProgress) discard;
float edge = smoothstep(uProgress, uProgress + 0.08, n);
gl_FragColor.rgb += uEdgeColor * (1.0 - edge) * 3.0; // post-tonemap add feeds bloom
```

`discard` disables early-Z — keep dissolve on the objects spawning, never the
whole scene. The edge color telegraphs the event: spawn and destroy must not
share one.

A shader effect earns its place by clarifying gameplay state, not by
decorating.

Post-processing is a finishing pass, not a style: `EffectComposer` with
`RenderPass` → `UnrealBloomPass` (strength ~0.45, threshold ~0.85 so only
authored emissives bloom) → `OutputPass` always last. Beyond bloom, the only
passes that earn a slot are a subtle vignette (one full-screen `ShaderPass`
that must never darken the play path) and brief event-driven chromatic
aberration; prefer geometry trails over motion blur. Composer cost scales
with DPR² — cap DPR before adding passes, and on mobile skip the composer or
run bloom only. Compare screenshots with post on and off.

## Budgets

Starting contracts for the worst active-play view — measure with
`renderer.info` and treat overruns as deliberate tradeoffs, not surprises:

| Metric                                | Desktop   | Mobile    |
| ------------------------------------- | --------- | --------- |
| Draw calls (`info.render.calls`)      | <= 300    | <= 150    |
| Triangles (`info.render.triangles`)   | <= 750k   | <= 300k   |
| Geometries (`info.memory.geometries`) | <= 300    | <= 200    |
| Textures (`info.memory.textures`)     | <= 60     | <= 40     |
| Texture memory (est.)                 | <= 256 MB | <= 128 MB |
| Shadow-casting lights                 | <= 2      | 1         |
| Post passes beyond render+output      | <= 2      | 0–1       |

Spend draw calls on instanced repeats: one `InstancedMesh` for every family
of repeated detail, `instanceMatrix.needsUpdate` set once after a batch of
changes, bounds recomputed when transforms move materially. Instancing with
different materials or per-frame full rewrites erases the win. LOD
transitions need hysteresis or distance gaps so they do not pop, checked
under gameplay camera motion rather than a static orbit. When performance
drops: cut post and shadow cost first, then instance and LOD, then reduce
density where it is least visible.

Two more cheap wins: `MeshMatcapMaterial` bakes a lit look into one small
texture for background props — the cheapest lit-looking material, but it
ignores scene lights, so never use it where a state glow must show. And far
signals (beacons, pickups) keep reading by boosting `emissiveIntensity` with
distance instead of adding geometry — keep the signal color constant so
identity survives.

## What goes wrong

- A single primitive plus bloom shipped as the final look of anything.
- Every surface in the same bright pastel band — no darks, no saturation
  anchor, the playable surface indistinguishable from the ground beside it.
- Gameplay roles distinguishable only by hue.
- VFX meshes or materials allocated when an event fires instead of pooled in
  `start()`.
- Real transmission glass on repeated objects.
- `onBeforeCompile` without `customProgramCacheKey`.
- Many dynamic lights instead of emissives and fakes.
- Unique full-size textures for small repeated marks.
- Fog or darkness hiding an empty world.
- A world that is no place: generic ground, default sky, props from nowhere
  — no sentence names it, nothing argues for it.
- A photographic or fetched image as sky, backdrop, or far layer behind
  procedural objects — two art styles in one frame.
- Sky, fog, and key light each picked separately — three moods in one
  frame.
- A bare plane to the horizon, or scatter spread in a uniform sprinkle or
  grid instead of seeded clusters.
- A world where nothing moves except the gameplay entities.
- A model file, texture URL, or generated asset from anywhere.
