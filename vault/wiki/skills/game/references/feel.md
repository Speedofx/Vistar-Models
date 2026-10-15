# Feel

Feel is state communication. It tells the player the verb landed. It is not
decoration. This file covers the visual layers; sound is its own optional
layer in `references/sound.md`, driven by the same events.

Apply layers in this order. Each layer depends on the one before it.

1. **Latency.** The verb is visible within about 100 ms. Fix a late control
   before any juice.
2. **Motion curves.** Acceleration and easing on the player's own movement.
3. **Contact.** Flash, squash, hitstop, or a pop at impact, pickup, or score.
4. **Camera.** Shake or an FOV punch that amplifies contact and still leaves
   the next decision readable.

If shake, flash, or hitstop hides the next threat, it is a bug. Strong events
(fail, explosion) are unmistakable. Weak events (pickup) stay small. Do not
shake the camera all the time.

Drive tweens and shake from the **real** delta in `references/tick.md`. Drive
hitstop by scaling **gameplay** delta only.

## Tween helper

Every "then ease back" in this file runs through one tiny helper in `feel.ts`
— no tween library. Three curves cover the work: `easeOutCubic` for settles
and fades, `easeOutBack` for bounce (it overshoots past `1` near the end —
that overshoot **is** the bounce), `easeInQuad` for accelerating exits.

```text
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeOutBack = (t) => {
  const c1 = 1.70158;
  return 1 + (c1 + 1) * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

const tweens = [];

export function tween(duration, onUpdate, easing = easeOutCubic, onComplete) {
  tweens.push({ elapsed: 0, duration, onUpdate, easing, onComplete });
}

export function updateTweens(realDelta) {
  for (let i = tweens.length - 1; i >= 0; i--) {
    const t = tweens[i];
    t.elapsed += realDelta;
    const k = Math.min(t.elapsed / t.duration, 1);
    t.onUpdate(t.easing(k));
    if (k === 1) {
      t.onComplete?.();
      tweens.splice(i, 1);
    }
  }
}
```

Call `updateTweens` once per frame from the tick with the **real** delta, so
feedback stays live during hitstop. Iterate backwards because completed
tweens splice out mid-loop. Clear the array on restart so stale callbacks do
not touch freed objects.

## Hitstop

On a heavy contact only, set `timeScale` to about `0.05` for 60–90 ms. Decay
that timer with real delta, then set `timeScale` back to `1`. Do not hitstop
on every minor event. Do not stop `requestAnimationFrame`.

## Camera follow

A follow camera eases toward its target; it does not hard-snap to it. Use
frame-rate-independent smoothing — a fixed `lerp(0.1)` per frame is the
classic bug, stiff at 30 fps and floaty at 120:

```text
const k = 1 - Math.exp(-FOLLOW_RATE * realDelta); // FOLLOW_RATE ~ 4-8
camX += (targetX - camX) * k;                     // same for Y (and Z in 3D)
```

Aim slightly ahead: the target is the player position plus a fraction of
their velocity (look-ahead), so the space the player is entering is on
screen before they reach it. The smoothing must never lag so far that the
next threat sits off-screen — if it does, raise `FOLLOW_RATE`; readability
beats drama. This eased pose is the **base pose** the sections below offset.

## Shake

Add trauma on an event, clamp it to `1`, decay it every frame. Offset the
camera by `trauma * trauma` so small hits barely move and big hits snap.
Recompute the camera base pose (the follow section above) every frame, then
add the offset. Do not let offsets accumulate.

Suggested trauma: pickup `0.15`, hit `0.4`, heavy fail `0.7`.

## Squash

On landing or impact, scale one axis (about `0.85`) and the other two by
`1 / sqrt(scale)` so volume stays even. Ease back over about 180 ms. On a
jump takeoff, stretch to about `1.15`, then return. Animate a visual object,
not a collider root, so overlap tests stay stable.

## FOV punch

Add a few degrees (about 4–8) on a dash or heavy hit, then decay toward `0`.
Call `camera.updateProjectionMatrix()` after any FOV change.

## Flash and pickup

Pulse `emissiveIntensity` on the hit material, then tween it back. The
material `emissive` color must be non-black or the pulse is invisible.

A pickup rises, scales down, and fades, then `visible = false`. On the same
event, punch the HUD score (a short CSS or WAAPI scale on the score node).

A fail may add one full-screen flash: a `position: fixed` element with
`pointer-events: none`, opacity from about `0.8` to `0` over 100 ms. Do not
allocate a second WebGL render target for that flash.

## Rumble

When a gamepad is connected, vibrate on the same events. Feature-detect and
swallow the promise — `vibrationActuator` is missing on some pads and
`playEffect` may reject on others; rumble must never throw:

```text
export function rumble(durationMs, strong = 0.6, weak = 0.3) {
  for (const pad of navigator.getGamepads?.() ?? []) {
    pad?.vibrationActuator
      ?.playEffect('dual-rumble', {
        duration: durationMs,
        strongMagnitude: strong,
        weakMagnitude: weak,
      })
      .catch(() => {});
  }
}
```

Match it to the event weight: light (~180 ms, `0.3`) on a pickup or land,
heavy (~250 ms, `0.9`) on a fail or explosion. No rumble on UI clicks, and
nothing continuous.

## Event map

| Event  | Stack                                          |
| ------ | ---------------------------------------------- |
| Pickup | Pop + HUD punch + trauma `0.15`                |
| Hit    | Hitstop ~70 ms + trauma `0.4` + emissive flash |
| Dash   | FOV punch + stretch `1.15`                     |
| Land   | Squash `0.9` + trauma `0.2`                    |
| Fail   | Hitstop ~90 ms + trauma `0.7` + white overlay  |

Skip a row the slice does not have. Each row gets its one synthesized sound
from `references/sound.md` (sound is part of the default build; a silent
brief skips it) — do not invent audio to fill a row.

## Anti-patterns

- Hitstop on every tick of damage.
- Feedback that blocks the next input until an animation ends.
- `Math.random` inside the tick. If you need variance, use the seeded RNG on
  the state object (`references/tick.md` has the implementation).
- Emissive flash on a black emissive color.
- Shake with no decay and no cap.
