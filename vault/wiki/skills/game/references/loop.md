# Loop

Read this before the first playable slice. The tick in `references/tick.md`
runs the loop. Feel in `references/feel.md` sells it.

## Contract

Write one sentence, then prove every clause in code:

`Player does [verb] to achieve [objective] while [pressure] creates risk; success gives [reward], failure causes [cost], and restart is immediate.`

| Clause    | Must be true in the slice                                              |
| --------- | ---------------------------------------------------------------------- |
| Verb      | A real key or pointer input changes state within one frame             |
| Objective | Visible in the world or the HUD, not only in a comment                 |
| Pressure  | Present in the first minute (timer, hazard, shrinking space, opponent) |
| Reward    | Changes state (score, position, resource), not only a color            |
| Failure   | Teaches what happened, then restart without a reload                   |
| Decision  | The first 30 seconds contain a real choice                             |

"Explore a cool scene" is not a contract.

Three more answers sharpen the sentence — one line each, in the same module
comment, not a design doc:

- **Feeling** — name the target feeling in one word (tense, cozy, frantic,
  clever). Every pacing, feel, and sound choice is tested against that word;
  a cozy farm game with fail-state screen shake flunks its own feeling.
- **Skill** — what does a better player do differently? Aim, timing, routing,
  risk-taking, planning. If the honest answer is "nothing", the verb has no
  depth — fix that before adding content.
- **Non-goals** — name what this slice deliberately leaves out (the genre
  file's scope rails, the brief's unmentioned features), so the next
  mechanic is a user decision, not drift.

## Contact

Pressure must be able to touch the player. Walk the entity kinds and decide
what every pair the loop depends on does on contact — player × enemy
(damage), projectile × enemy (hit), player × pickup (collect), player ×
hazard (fail), player × wall (block) — and give each pair its overlap check
in the tick and a consequence the player can read. "Nothing happens" is a
decision, not an omission. A chasing enemy that passes through the player
is the most common version of this bug: the chase works, the threat is
fake, and the game is a scene.

## Slice

Build in this order. Something is playable after step 3.

1. State object and tick (see the hub file layout).
2. One controllable object and one camera that shows the next decision.
3. One encounter: start, first threat or timer, first reward or fail, restart.
4. Feel on the verb and on fail (see `references/feel.md`).

Do not add a second mechanic until this encounter is fun to repeat. Do not
add content variety to hide a weak verb. When the prompt names another
mechanic, add an entity kind, one step, or one content record
(`references/tick.md`). Do not add a second tick.

## Tests

Change the slice if any line is true:

- The first 30 seconds have no decision.
- The player can ignore the main verb and still succeed.
- The objective is unclear without reading the source.
- A new player cannot name the goal and the first verb from the first screen alone.
- Failure happens before the player can see why.
- Challenge is only "more things", not a new combination of known things.
- Rewards do not change strategy, score, progress, or feel.
- The space is decoration. It does not block, reveal, or time a choice.
- The explanation is fun and active play is not.
- A first-time player and a practiced one get roughly the same result.
- A threat can overlap the player with no consequence.

If the intended feeling is missing, change the verb, the pressure, or the
space. Lighting does not fix a missing loop.

## Ramp

The slice proves one encounter; the ramp decides what the next minutes do.
Difficulty is a curve, not random escalation.

- Introduce one new concept at a time. Combine concepts only after each has
  appeared alone and been survived.
- Alternate compression and release: a dense high-pressure stretch, then a
  visible breather with reward or recovered safety. Escalate on the game's
  own unit — roughly every 20–60 seconds of continuous play, or per wave,
  level, round, or lap — and give a recovery beat after each spike before
  the next.
- Raise challenge by changing the decision — timing, density, speed,
  scarcity, entity mix, or tighter space — not only "more things" (the test
  above).
- Telegraph before punishing: a new hazard shows itself once before it can
  end a run. Keep early failures recoverable.
- Every knob is a named constant in one place (top of `state.ts`) — whatever
  drives pressure in this game: spawn interval, speed, density, timer,
  timing window, resource rate. Tuning is editing numbers and replaying, not
  hunting magic values through the tick. Change one number at a time.

A flat ramp is boring; a spike in the first minute is unfair. Both are loop
bugs, not content bugs — fix the curve before adding entity kinds.

## Stop

Stop when the contract holds and the tests above pass for one encounter.
Leave room in `state.ts` for more entities and modes. Do not add jump, guns,
inventory, levels, or accounts in the foundation slice unless the user's
prompt already named that verb.
