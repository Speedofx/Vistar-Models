# Fighting and arena games

Read this when the brief is a boss fight, arena brawler, beat-em-up, or 1v1
fighter. Dimension: 2D side view for fighters and beat-em-ups; boss arenas
read both ways — ask per the skill hub. Combat quality is **readability
under pressure**: every attack has a tell, a window to answer it, and
feedback that says what just happened. The repo's boss recipe underlies the
boss section.

## Sub-genres

| Sub-genre                  | Loop                                  | Load-bearing mechanics                   |
| -------------------------- | ------------------------------------- | ---------------------------------------- |
| Boss fight                 | Learn the pattern, punish the windows | Phases, telegraphs, attack state machine |
| Arena brawler / beat-em-up | Clear crowds with positioning         | Attack tokens, lane depth, crowd AI      |
| 1v1 fighter-lite           | Read and counter one opponent         | Attack phases, hitboxes, blocking        |

## Attacks are state machines — startup, active, recovery

Every attack (player's and enemy's) runs three timed phases:

- **Startup** — the telegraph. The wind-up animation/color plays, no damage
  yet. This is the defender's information; its length **is** the
  difficulty.
- **Active** — the hitbox exists for a few frames and can deal damage
  (once per target per swing — track hit targets).
- **Recovery** — the attacker is committed and vulnerable; inputs during it
  are buffered (~120 ms, like the platformer jump buffer), not dropped and
  not instantly cancelled.

**Hitboxes are not hurtboxes.** An entity carries a hurtbox (where it can
be hit — roughly the body) and attacks spawn temporary hitboxes (where the
weapon strikes). Testing "sprite overlaps sprite" makes every trade feel
wrong. Both are plain rects/circles on the state entity, offset by facing;
during development, draw them (`references/debug.md` dev-only handle).

Defense is one verb in the slice — dodge with i-frames (~300 ms
invulnerability timer, same decay pattern as the feel timers) **or** block
(damage reduced/negated while held, broken by throws or heavies). Not both
until the loop proves out.

## Boss fights

From the repo's recipe: a boss is a **pattern set + phases**. Each attack
in the set has the three phases above, a distinct telegraph, and an answer
(a safe spot, a dodge timing, a punish window after recovery). Phases flip
at HP thresholds (~70% / 35%): a new phase adds an attack or combines known
ones — the Ramp rules (`references/loop.md`) applied to one enemy; later
phases are not just "more HP".

- Always-readable: boss HP bar with phase marks (`references/ui.md`
  center-top), current attack telegraphed by silhouette/color per the
  graphics reference — never only by a sound.
- Recovery windows after big attacks are the player's turn; a boss that is
  never punishable is a timer, not a fight.
- On player death: instant restart at the fight's start (fail teaches per
  `references/loop.md` — the pattern knowledge is the progression).

## Crowds — attack tokens and lane depth

The beat-em-up secret: **enemies take turns**. A token pool (1–3 attack
tokens by difficulty) gates aggression — an enemy must hold a token to
enter startup, returns it on recovery's end; tokenless enemies circle and
posture (seek + separation from `genres/shooter.md`, orbit offset). All-at-
once crowds read as chaos and die as unfair. Side-view brawlers use **lane
depth**: y is a depth lane, and combat connects only within a small y
tolerance — the classic "aligned to brawl" rule that makes crowds
manageable. Knockback on heavy hits (brief velocity + the feel stack);
never knock the player off-screen.

## Juice is mandatory here

This genre leans hardest on `references/feel.md`: hitstop on every
connected heavy (the 60–90 ms rule), directional knockback, flash on hurt,
trauma shake scaled to hit weight, and distinct `references/sound.md`
one-shots for whiff vs hit vs block. A combat without hitstop feels like
slapping air regardless of damage math.

## Difficulty levers

Telegraph length (shorter = harder), token count, enemy HP/damage tiers,
punish-window length, phase thresholds. Ramp per `references/loop.md`;
never ramp by making telegraphs invisible.

## What goes wrong

- Damage with no startup phase — undodgeable, reads as random.
- Sprite-overlap combat instead of hitbox/hurtbox separation.
- One swing hitting the same target every frame it is active.
- Inputs dropped during recovery instead of buffered.
- Every crowd enemy attacking simultaneously (no tokens).
- A beat-em-up where attacks connect across obviously different depths.
- A boss with no punish window, or phases that only add HP.
- No hitstop, no knockback — correct math, dead combat.
