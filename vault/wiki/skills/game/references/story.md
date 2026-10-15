# Story — narrative in any genre

Read this when the brief wants a story: a narrative or adventure game, a
game with dialogue, scenes between levels, or an intro and ending that mean
something. Story is not a genre — a platformer, a racer, or a puzzle game
can carry one. The cutscene timeline that plays story moments is in
`references/tick.md`; this file owns the writing and the presentation.

Two weights, set by the brief:

- **Story-first** — the scene graph is the game (visual novel, interactive
  fiction, narrative adventure). Everything below applies in full.
- **Story-flavored** — a gameplay game with a narrative wrapper: an opening
  hook, a line or two between levels or waves, an ending that acknowledges
  the run. Keep the beats short and skippable; the loop is still the game,
  and story must never gate it.

## The scene graph

Scenes are content records: text/art, choices, each choice pointing to a
next scene and optionally setting flags; flags gate later choices. This is
a data-driven graph in a module — not a route per scene, not nested
if-trees in components. A choice whose consequence never surfaces is dead
weight; pay off every flag at least once. Honest fail states ("the deal
collapses") beat fake choices that all converge silently.

## Writing rails

The prose is a load-bearing mechanic — write it like one. Story-first
scope: 8–15 scenes, one complete arc (a want, an obstacle, a choice that
costs something, its consequence), and two or three endings that differ in
outcome, not in the final paragraph. Concrete nouns and specific stakes —
"the harbormaster wants the ledger burned before the auditor docks", never
"you enter a mysterious place". Choices are dilemmas: two things the player
wants that exclude each other, not one right answer and two throwaways.
Keep a scene to a few short paragraphs; a wall of text is a pacing bug.

Story-flavored games scale this down, not off: the opening still names a
want, the between-level lines still track what the player just did, and the
ending still lands differently after a flawless run than a scraped one.

## Presentation

Present scenes as a stage, not a form. Text-first scenes render in DOM —
long text needs wrapping, selection, and a comfortable reading size, and
canvas text has none of that; the canvas, when present, is scene art behind
the words. Reveal a line typewriter-style: the first click or key completes
the line instantly, the next advances — ignore held-key repeats, and never
auto-advance on a timer, because reading speed is not yours to set. Scene
art comes from the procedural toolkit (palette washes, drawn silhouettes, a
lit vignette per location) with the mood carried by the palette and the
music bed (`references/sound.md`), and a scene transition is a short fade,
not a route change.

## What goes wrong

- Narrative flags that never pay off, or choices that secretly converge.
- Scene text drawn on canvas, auto-advanced on a timer, or delivered as one
  wall of prose.
- A cutscene that cannot be skipped, or a skip that leaves its state
  changes half-applied (`references/tick.md`).
- Story beats that gate the loop in a story-flavored game — the player
  clicks through lore to get back to playing.
- Endings that differ only in the last paragraph.
