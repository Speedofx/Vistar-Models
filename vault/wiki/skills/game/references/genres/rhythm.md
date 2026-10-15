# Rhythm and timing games

Read this when the brief is a rhythm game, beat-matcher, or any game whose
verb is "press at the exact moment" (reaction duels, QTE chains, timing
meters). Dimension: 2D. The genre stands on one rule: **the clock is the
audio clock**. Everything else is presentation around timing windows.

## Sub-genres

| Sub-genre                          | Loop                                  | Load-bearing mechanics                |
| ---------------------------------- | ------------------------------------- | ------------------------------------- |
| Lane rhythm (notes fall to a line) | Hit notes on the beat, keep the combo | Audio clock, note scheduling, windows |
| Beat-action (moves only on beat)   | Act on the pulse                      | Beat quantization of inputs           |
| Reaction / QTE                     | Answer prompts inside a window        | Window state machine, fairness floor  |

## The audio clock is the only clock

`AudioContext.currentTime` is the master time for beats, note positions,
and judgments — never `performance.now()` and never accumulated rAF delta;
they drift apart from what the ear hears within seconds. The tick still
renders per `references/tick.md`, but everything rhythmic derives from:

```text
const beat = (ctx.currentTime - songStart - calibration) / secondsPerBeat;
```

The beat itself is procedural per `references/sound.md` (no audio files): a
scheduled kick/hi-hat pattern from oscillators and noise. **Schedule audio
ahead** — a lookahead loop every ~100 ms schedules all notes starting in
the next ~200 ms at exact `ctx.currentTime`-based times. Starting sounds
from the render tick is audibly late and uneven.

## Notes, travel, and judgment

A chart is a content record: note times in beats (`[{ beat, lane }]`),
authored per difficulty — generate patterns from the beat grid (every
beat, offbeats, simple fills), not random times; random is not rhythm.

- A note's screen position is derived **from the clock**, not integrated
  per frame: `y = hitLineY - (noteTime - now) * SCROLL_SPEED`. Spawn it
  when it enters the travel window; despawn after judgment.
- **Judge on input against the clock**, not against the drawn position:
  `error = |inputTime - noteTime|` → perfect (≤50 ms) / good (≤100 ms) /
  miss, with an unjudged note becoming a miss once `now - noteTime >
missWindow`. Judging by sprite overlap punishes frame rate.
- Each input consumes at most one note (the nearest in-window in that
  lane); each note judges once.
- Combo counts perfects+goods, breaks on miss; show the judgment text and
  combo at the hit line per `references/ui.md` (fixed-width — it changes
  every beat). Misses must be quiet visually (`references/feel.md` scale:
  weak event) — a flashy miss punishes twice.

## Calibration — the fairness floor

Audio and input latency differ per device; without an offset every
judgment is systematically early or late and "the game feels broken" on
exactly half of machines. Minimal honest version: a calibration moment on
first play — pulse a beat eight times, the player taps along, store the
median error as `calibration` (in state, persisted). Apply it in the beat
formula above. Offer re-calibration from the pause overlay.

Reaction/QTE games are the degenerate case: one note, one window — the
window state machine (`waiting → prompt shown → inside window → hit/miss`)
with the same clock discipline, plus a randomized prompt delay (seeded) so
it cannot be memorized.

## Difficulty levers

Note density and pattern complexity (offbeats, doubles), scroll speed
(visual only — never changes windows), window widths, song tempo. Ramp per
`references/loop.md`: density before tempo, one new pattern element at a
time.

## What goes wrong

- Notes timed by rAF delta or `performance.now()` — drift within one song.
- Sounds triggered from the render tick instead of scheduled ahead.
- Judgment by sprite position instead of clock error.
- No calibration: systematically unfair on half of all devices.
- One input judging multiple notes, or a hold-spam strategy beating timing.
- Random note times instead of beat-grid patterns.
- Scroll speed changing the judgment windows.
- A miss more spectacular than a perfect.
