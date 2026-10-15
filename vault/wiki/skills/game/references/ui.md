# Game UI

The play view is the document. There is no page around the canvas. Do not load `design`.

Intuition before look. A player who has never seen the game must know the goal, the first verb, and what they can press before they touch anything. If a prettier screen hides that, keep this file and drop the polish.

Start, pause, and HUD overlays are server-rendered React. The first client render must match the server HTML: no `Math.random()`, `Date.now()`, bare `toLocaleDateString()` / `toLocaleString()`, or `date-fns` `format()` in render. Randomize inside a `useEffect` (or pick in the `loader`). Format dates and numbers with an explicit locale and `timeZone`. Gate `window`-dependent effects behind `useHydrated()` from `@/hooks/use-hydrated`. See `react-router-framework-mode/references/hydration.md`.

## Frame

The canvas is the play view. `body` margin is `0`, `overflow` is `hidden`, height is `100dvh`. The `<canvas>` touches all four viewport edges. HUD, start, pause, game-over, and on-screen controls are overlays **on** that canvas — never a column, header, or footer beside it.

There is no default overlay tree. Invent placement, grouping, and shape for **this** brief and **this** place. A match-3 tray, a cabinet bezel, a forest sign, a diegetic cockpit, or numbers painted on the arena are all valid if the canvas stays full screen and the first-second rules below still hold.

Do not reuse the last game's chrome: lockup top-left, score top-right, centered title card, pill CTA.

## Pass check

Replace the route when any line is true:

- The canvas does not touch all four viewport edges.
- The page scrolls.
- The canvas has a `header`, `aside`, or `footer` sibling.
- A second column sits beside the canvas.
- `root.tsx` has a site header or a site footer.
- The largest line is a mood or a title, and the goal is smaller body copy.
- The start control says anything other than the verb ("Take the call" fails; "Run pipe" passes).
- A disabled control dock sits behind the start overlay.
- A clickable control has no `cursor: pointer`. A target drawn on the canvas has no DOM hit target with that cursor.
- Pause, restart, or a HUD control is under 48px tall, or type stays the same px size when the viewport grows.
- Overlay copy is a brand lockup, a tagline, or atmosphere text.
- HUD chrome uses numbered "01/02/03" stamps, or pill buttons with no source in the world.
- Titles use the template Arial stack, DM Sans, or one geometric neo-grotesk as a default.
- The overlay layout would still fit a different genre with only the palette swapped.

Do not restyle a failed screen. Rebuild it so the canvas is still full screen, the first second is still true, and the chrome belongs to this world.

## First second

On load, before the first input, three things are on screen. They may sit anywhere on the canvas — a corner, a diegetic panel, over the board, along a bezel — as long as a new player can read them without hunting:

1. **Goal** — one line, the largest type on the screen. A mood line does not take that slot.
2. **Verb** — the one start control uses that verb as its label. No second row of disabled controls behind it.
3. **Clickable** — every button, including pause and restart, uses `cursor: pointer` and a visible pressed state. If a joint or object on the canvas can be pressed, give it a DOM hit target with that cursor. Otherwise the canvas keeps the default cursor.

The goal stays readable after start (HUD, a persistent world label, or both). A coach line after a miss explains that miss. It does not replace the goal. If the user prompt says the coach appears only after a miss, still show the goal and the verb before play.

Name the keys on the controls (`Thrust · W`). Keyboard works without the on-screen buttons.

## Scale

Type and controls grow with the viewport. Use `clamp()`, not a single phone-sized px size. These are floors and ranges, not a layout:

- Primary goal: at least `clamp(1.5rem, 3vw, 3rem)`.
- Control height: at least `clamp(48px, 8vh, 88px)`.
- HUD numbers: at least `clamp(1rem, 2vw, 1.75rem)`.

44px is the floor on a phone. It is not the size on a large display.

## Touch

When the game needs held or continuous input and the device is touch, show on-screen controls by default. Detect the device with `matchMedia('(pointer: coarse)')`, never user-agent sniffing. Keyboard keeps working either way, and a brief that names its own control scheme wins. Place those controls where thumbs can reach for **this** layout — bottom dock is common, not required.

- **One intent layer.** A control sets the same flag on the state's input object that its key does (`input.left = true`). The tick never knows which device fired. Do not write a second input path for touch.
- **Every release path clears the flag.** `pointerdown` sets it; it must be cleared on `pointerup`, `pointercancel`, `lostpointercapture`, window `blur`, and `visibilitychange`. Miss one and the player runs left forever after a notification interrupts. Use pointer events, not touch events.
- **The page must not move.** `touch-action: none` on the canvas and on each control, so scroll, pinch, and double-tap zoom cannot steal a gesture mid-play.
- **Respect the hardware edges.** Pad reachable controls with `env(safe-area-inset-bottom)` (and the sides in landscape) so nothing sits under the home indicator or a notch.
- **Separate adjacent controls.** A gap between buttons that thumbs can't bridge by accident; two actions that must never misfire into each other do not sit side by side.

Test a touch control by what it fires, not how it looks: press it and verify the verb happens, hold it and verify the state flag stays set, drag off it and verify the flag clears.

## HUD

Show only what the player decides with: the goal line, the values this game's decisions run on (health, fuel, ammo, timer, score, wave, round — whichever exist in the slice), and a coach line after a fail.

Place those values where they serve **this** game. Pin them to world objects when that is clearer (gold on the keep, moves next to the board). Edge slots (objective left, score right, banners top, touch controls bottom) are a fallback when the brief is silent **and** no better place exists — not a template to copy.

Use short labels and tabular numbers, and give every changing value a fixed-width container (reserve `ch` units or a `min-width` for the longest likely value — top score, multi-digit timer): a HUD that shifts layout when 9 becomes 10 reads as broken.

Pick one color per alert role — danger, reward, objective — and reuse it in every HUD element that carries that role; the palette comes from the world per the section below. A value change gets one brief cue (count-up, pulse, meter fill — the HUD punch in `references/feel.md`), not a persistent animation.

## Type and color

Pick two faces that belong to the named place (the same place as the graphics palette). They must contrast: a display face for the goal and titles, and a readable companion for HUD numbers, labels, and buttons. Load both with a font `<link>` in `root.tsx` on a game-only app (for example Google Fonts). If the brief names type, use that.

HUD numbers stay tabular and high-contrast. Do not use the template Arial stack for titles. Do not default to DM Sans or the same geometric neo-grotesk on every game. Do not reuse the same pairing you would pick for a different genre.

Color and motifs come from the world already on the canvas — a panel edge, an accent, an icon shape drawn from the game's own objects, not from a generic component library.

## Chrome from the world

After the graphics pass, HUD, start, pause, and game-over reuse the world palette, materials, and **shapes**. Invent a layout that would look wrong on a different game.

Examples of contrast, not a menu: gems with a tray and a count on the board; a snake with only a fat score in the playfield; a platformer with a flag icon and a tiny coin count; a tower defense with a build strip along the path. A cyan pill on a navy card fails unless that is the place.

These are fail conditions:

- A brand lockup, a tagline, or atmosphere copy on the overlay
- Numbered "01/02/03" section labels
- Generic pill-shaped buttons with no source in the world
- Cream or off-white website panels
- Italic accent words in titles
- Monospace text labels (tabular numerals for changing values are still right)
- A one-note purple or blue gradient with no source in the world
- The same centered title-card overlay used on an unrelated genre

## Start, pause, game-over

These are modes of the same screen (`references/tick.md`), not routes and not sections.

- Start: the world is already visible. The goal and the verb are obvious. Dimming, a panel, or a diegetic object are all fine — a centered marketing card is not the default.
- Pause and game-over: same idea. Restart does not navigate. Say what failed in one line, then the verb again.
- Order actions by likelihood: the primary action (resume, retry, the verb) first and largest; secondary actions after and smaller. Every interactive element has visible focus, pressed, and disabled states — not only hover, which does not exist on touch.
- Honor `prefers-reduced-motion` for shake and flashes.
