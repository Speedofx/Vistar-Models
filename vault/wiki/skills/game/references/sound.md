# Sound — procedural Web Audio

Read this when the game gets sound. Every sound is synthesized in code with
the Web Audio API: oscillators, noise buffers, gain envelopes, and filters.
No audio files, no CDN samples, no Howler, no Tone.js, no audio generation of
any kind. Nothing to install.

The one exception is audio the user supplies: decode those files with
`decodeAudioData` and play them as `AudioBufferSourceNode`s through the same
group graph and mix rules below. The ban is on sourcing audio yourself, not
on the user's own assets.

Sound is part of the default build, not an extra the user must ask for: once
the slice plays, give every feel event its sound during the graphics pass,
and give the game a quiet atmospheric music bed in the same pass (the Music
section below). A silent action game reads as broken to players, and a game
with only a blip per event reads as unfinished. An explicitly silent brief
wins, and sound never comes before the slice plays — a game with wrong or
premature sound is worse than a quiet one.

## Core rule

Sounds are feel events made audible. Every one-shot maps to one row of the
event map in `references/feel.md` and fires on the same frame as its visual.
No sound without a state change, and no state change the player must read
that is visual-only when sound exists. Do not invent sounds for events the
slice does not have. The two continuous exceptions are the ambience layer
and the music bed — they map to the game's mood, not to an event.

## Audio module

One client-only module (`apps/web/src/game/sound.ts`), owning one
`AudioContext` — created and resumed only after a user gesture, because
browsers block audio until one:

```text
let ctx: AudioContext | null = null;
const groups = new Map<string, GainNode>();

export function unlock() {
  if (ctx) return;
  ctx = new AudioContext();
  const master = ctx.createGain();
  master.connect(ctx.destination);
  for (const name of ['sfx', 'ui', 'music', 'ambience']) {
    const g = ctx.createGain();
    g.connect(master);
    groups.set(name, g);
  }
  groups.set('master', master);
}
```

Call `unlock()` from the first `pointerdown`/`keydown` — the start-screen
"press to play" interaction in `references/ui.md` is the natural place. Guard
every play call with `if (!ctx || ctx.state !== 'running') return;` so sound
is a no-op before unlock, never an error.

- Groups: `master` → `sfx`, `ui`, `music`, `ambience`. Mute and volume set
  group gains; a mute toggle must silence everything through `master`, not
  by branching in each play function.
- Pause: suspend or set `master` gain to `0` when the game pauses and on
  `visibilitychange`; resume with the game. Stop and discard looping
  ambience sources and the music scheduler on restart and in the `stop()`
  cleanup — a restart that starts a second loop over the first is the most
  common audio bug.
- `stop()` closes the context (`ctx.close()`) and nulls it.

## One-shot synthesis

The base unit is oscillator (or noise buffer) → gain envelope → group. Nodes
are one-shot and cheap: create them per play, schedule, start, stop — they
are garbage-collected after they end. What gets cached is buffers and
constants, not source nodes.

Envelope scheduling is where the API bites: `exponentialRampToValueAtTime`
cannot ramp to or from `0`, so attack starts at `0.0001` and release ends at
`0.0001`, then the source stops. Stopping a source at nonzero gain clicks.

```text
export function blip(freq: number, duration: number, group = 'sfx') {
  if (!ctx || ctx.state !== 'running') return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.15, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain).connect(groups.get(group)!);
  osc.start(now);
  osc.stop(now + duration + 0.05);
}
```

Recipes per event role — each is this shape with different source, pitch
motion, and duration. Enemy and mob events map onto the same roles: a spawn
telegraph is a whoosh, an enemy taking a hit is a hit, a death is a bigger
hit, the player being hit is fail/damage:

| Event role          | Recipe                                                                                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pickup / reward     | Triangle or sine, short upward `frequency.exponentialRampToValueAtTime` chirp (~0.15–0.2 s). A bigger reward is two chirps a fifth apart, not a louder one. |
| Hit / impact        | Noise burst through a `BiquadFilterNode` lowpass (~400–900 Hz), ~0.1–0.25 s, optionally a low sine thud underneath.                                         |
| Fail / damage taken | Downward pitch sweep (sawtooth or square through a lowpass), longer (~0.3–0.5 s), the one sound allowed to be louder than the rest.                         |
| UI click / confirm  | Very short (~0.05–0.1 s) triangle blip, quietest group.                                                                                                     |
| Dash / whoosh       | Noise through a bandpass whose frequency sweeps up or down over ~0.2 s.                                                                                     |
| Ambience            | A looped `AudioBufferSourceNode` of filtered noise at very low gain (~0.02–0.05), or a slow detuned sine pair. One layer, barely audible.                   |

Noise is a buffer of random samples built **once** in `start()` or on first
use — never per play:

```text
const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
const data = noiseBuffer.getChannelData(0);
for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
```

(`Math.random` is fine here — this runs once at setup, not in the tick.)

## Music — the atmospheric bed

Music is a scheduler, not a recording: a `setInterval` (~100 ms) that keeps
scheduling notes ~0.2 s ahead on `ctx.currentTime` — the same lookahead
pattern `genres/rhythm.md` uses for its track. It plays into the `music`
group and is built from two or three layers, no more:

- **A pad** — two or three slowly detuned oscillators, slow attack and
  release (seconds, not milliseconds), through a lowpass — moving through a
  progression of three or four chords from one scale, changing every two to
  four bars. One held chord forever is a drone, not music.
- **A figure** — a bassline on the beat plus a melodic line answering it:
  several notes per bar at the mood's tempo, rhythm and pitch picked from
  the scale table with the seeded RNG (`references/tick.md`), so the line
  varies forever without leaving key. A note every few seconds is not a
  figure, and a fixed 4-bar loop is audible within a minute and reads as
  cheap — vary the rhythm as well as the notes.
- **A pulse** — a quiet filtered-noise tick on the beat for games whose
  mood wants momentum; the calm and vast moods skip it.

Match the mood to the brief, not to a default:

| Mood                               | Scale and tempo                  | Timbre                                                  |
| ---------------------------------- | -------------------------------- | ------------------------------------------------------- |
| Calm, cozy, puzzle                 | Major or pentatonic, 60–80 BPM   | Sine/triangle pad, long notes, no pulse                 |
| Tense, action, horror              | Minor or phrygian, 90–130 BPM    | Lowpassed saw pad, shorter notes, a pulse               |
| Fast, hype, speed (racing, sports) | Major or mixolydian, 120–160 BPM | Bright saw or square, driving pulse, arpeggiated figure |
| Playful, arcade, retro             | Major pentatonic, 100–140 BPM    | Square/triangle chiptune figures                        |
| Vast, space, mystery               | Whole-tone or minor, very slow   | Detuned sine pairs, long swells, no beat                |

The bed is background by contract, but it must be **heard**: group gain
~`0.08–0.15`, present from the first seconds of play. It sits below every
gameplay sound and must never mask a feel event — if a hit is harder to
hear with music on, the music is too loud or too busy — but inaudible is as
wrong as loud: a player who wouldn't notice the game has music got a
broken mix. Start it with play (the same `unlock()` gesture), keep
one scheduler, and clear it on restart and in `stop()` — two schedulers
running at once phase into mud. A menu/game-over state may keep the pad and
drop the figure and pulse rather than going hard-silent. In a rhythm game
the gameplay track is the music: one scheduler, no separate bed.

## Variance and mix

- An identical sample repeated reads as mechanical (the machine-gun effect).
  Vary pitch per play: `osc.detune.value = (rng() - 0.5) * 200` (±100 cents).
  Use the seeded RNG from the state object (`references/tick.md`), not
  `Math.random` in the tick — the same rule as `references/feel.md`.
- Loudness hierarchy: fail > hit > pickup > UI > music > ambience. UI,
  music, and ambience sit far below gameplay sounds. Peak gains around
  `0.1–0.2` per sound are plenty; a browser game that is loud by default
  gets muted, permanently.
- Duck music and ambience while hitstop holds (set those group gains to
  ~`0.5` of their level for the hitstop window, restore after) so the
  impact reads.
- High-frequency events (a stream of pickups, rapid fire) get a cooldown
  (~50 ms) or a rising-pitch combo pattern — not one full sound per instance.

## What goes wrong

- A silent game and no error: the context was never resumed from a user
  gesture, and every play call returned early.
- Sound fired from the tick while a condition persists (overlap, low health)
  instead of on the state transition — a buzzsaw of stacked sources.
- Ambience or music still playing — or doubled — after restart or unmount:
  two schedulers phasing over each other.
- Music competing with the feel events: a bed loud or busy enough that hits
  and pickups stop reading.
- The opposite failure: a bed nobody can hear, or one note every few
  seconds over a single held chord — a drone, not music.
- A short fixed music loop with no seeded variation — audible repetition
  within a minute.
- A click at the end of every sound: gain stopped at a nonzero value instead
  of ramping to `0.0001` before `stop()`.
- The same pitch on every repeat of a frequent sound.
- Mute that silences SFX but not ambience: a source connected straight to
  `ctx.destination`, bypassing the group graph.
- An `.mp3`, a sample CDN, or an audio library imported.
- A sound added for an event that has no visual — or no event at all.
