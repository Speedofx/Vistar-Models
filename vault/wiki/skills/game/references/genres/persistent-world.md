# Persistent-world browser games

Read this when the brief is a slow browser empire builder, a
text-based crime or life sim, a sports manager, or any game described as
"players log in daily", "builds take real hours", or "a world that keeps
going". This genre is the **one architecture fork** in this skill: there is
no canvas, no tick, and no client-owned state. The game is DOM pages over a
server-side database — which is exactly what this template is best at.
Nothing in this file applies to any other genre: every other game is the
single full-viewport frame from `references/ui.md`, never pages.

## The fork — what replaces the foundation

- **State lives in PocketBase**, not a plain module. Per-player rows
  (resources, buildings, queues, timestamps) and shared rows (rankings,
  market). Read the `pocketbase` skill for collections and migrations —
  with one explicit exception to its owner-rule default: game-state
  collections set `createRule`, `updateRule`, and `deleteRule` to `null`,
  keeping only owner-only `listRule`/`viewRule`. An owner `updateRule`
  here is the cheat console: `pb.collection('players').update(id,
{ resources: 1e9 })` from devtools skips every cost, cooldown, and
  settlement check.
- **Every mutation is a PocketBase hook route**: `routerAdd("POST",
"/api/game/<verb>", ...)` in `apps/pocketbase/pb_hooks/` — see
  `pocketbase/references/HOOKS.md`. The handler takes the player from the
  request auth, settles elapsed time, validates cost, cooldown, and
  ownership, and writes — all inside `$app.runInTransaction`. Outside a
  transaction, two parallel build requests both pass the affordability
  check against the same balance: a double-spend.
- **Reads go through the SDK in `clientLoader`.** The session is a
  browser-only JWT — the server renders signed out — so a server `loader`
  or `action` has no player to settle or validate against. The client
  calls the hook routes with `pb.send(...)` so the auth header rides
  along; it never computes game math, only displays what rows and routes
  return.
- **The UI is DOM** — tables, meters, forms, countdowns — on the
  `react-router-framework-mode` plumbing. It is still a game screen, not a
  website: do not load `design`, and bring no website moves (hero sections,
  marketing copy, landing-page craft, generic admin-dashboard chrome).
  `references/ui.md` owns the craft — the first screen names the goal and
  the decision, values are fixed-width with one color per role, the type
  and color rules (including the cliché avoid-list) apply to pages the same
  way — and the screens are themed as the world the brief names (an empire,
  a crime city, a club office), with the dense, information-first layout
  the genre is known for. Themed artwork carries real atmosphere in this
  genre: a scenic `get_images` backdrop on the login scene and
  scene-setting art in the main views (the town, the map) — these are DOM
  pages, so the hub's `get_images`-for-UI allowance covers them, and there
  is no canvas to do that work procedurally. The one ui.md rule that does
  not carry over is the single full-viewport frame: these are pages, and
  pages may scroll.
- From this skill, keep: the loop contract and honesty rules
  (`references/loop.md`), the economy math (`genres/simulation.md`), and the
  UI craft above (`references/ui.md`). Skip: tick, feel, graphics, sound,
  physics, debug-canvas — they assume a canvas that does not exist here.

## Sub-genres

| Sub-genre                                | Loop                                          | Load-bearing mechanics                   |
| ---------------------------------------- | --------------------------------------------- | ---------------------------------------- |
| Empire builder (village, planet, island) | Queue builds, grow, raid                      | Lazy evaluation, build queues, army math |
| Crime / life sim                         | Spend energy on actions, progress a character | Action points, cooldowns, risk rolls     |
| Manager (sports team, business)          | Set strategy, results resolve on schedule     | Scheduled resolution, roster records     |

## Login — the front gate

The world is per-player, so the game starts with an account: there is no
anonymous play, and every game route is guarded (`requireAuth()` from the
pocketbase skill, in `clientLoader`). The login/signup page is the game's
title screen and does the first-impression work the canvas genres give
their start overlay — scenic and themed as the world (the same theming and
palette intent as the pages behind it), naming the game and its promise,
with the form set into that scene. A bare email/password card on a blank
page is the SaaS-dashboard failure at the front door.

Signup bootstraps the player's starting rows — starting resources, the
first buildings, `updatedAtGame` — **server-side**, in a PocketBase hook on
the users collection (`onRecordAfterCreateSuccess`, see
`pocketbase/references/HOOKS.md`). The client cannot do it: game-state
collections have `createRule: null`, and a client that grants its own
starting state is the same cheat console as one that edits resources.
After login, the player lands directly on the "what happened while away"
screen — never a second welcome page.

## The session loop

The contract (`references/loop.md`) still applies, scaled to sessions: a
session is log in → see what happened while away → make 2–5 real decisions →
queue the next batch → leave. The first screen answers "what happened" and
"what should I do now" before anything else. If a session has no decision —
log in, click collect, leave — the loop fails the same test a clicker would.

## Lazy time evaluation — the core trick

Nothing runs while the player is away. Instead, every stateful row carries
`updatedAtGame` (a timestamp the game writes, not PocketBase's auto field),
and every hook route settles elapsed time before validating or writing:

```text
// inside the hook route, before any validation — one shared settle function
const elapsed = (Date.now() - player.updatedAtGame) / 1000;
player.resources = Math.min(player.resources + elapsed * ratePerSecond(player), capacity(player));
player.updatedAtGame = Date.now();
// then: complete any queue entries whose finishesAt <= now
```

When state lives in a `json` field, the only safe read in `pb_hooks` is
`JSON.parse(record.getString('state'))`. `record.get()` on a `json` field
returns raw bytes, which the JS VM surfaces as an array of byte numbers —
and `JSON.parse(JSON.stringify(...))` of that is still a number array, so
every property on it is `undefined` and **every route 400s, signup
included**: the game is dead behind a working login page. Write back with
`record.set('state', state)` — a plain object is fine there.

Settle once per request, in one shared function, before validation — a
route that checks affordability against unsettled resources rejects players
who have in fact earned enough. Between mutations the client may derive the
displayed total from `updatedAtGame` and the rate — display only, never
posted back. Queues are rows with a `finishesAt` timestamp; completion is
applying the queue entry's effect during settlement, not a timer firing. No
cron, no `setInterval`, no background worker.

Storage caps and queue length limits are what keep lazy evaluation honest —
unbounded accumulation makes absence strictly optimal and the session loop
pointless.

## Real-time pacing — allowed here, with the same honesty line

The wall-clock bans in `genres/simulation.md` and the energy-timer ban in
the skill hub protect client games from engineered addiction. This genre is
the sanctioned exception: a brief asking for this genre **is asking**
for real-hour build times and regenerating action points — that pacing is
the core mechanic, not a retention trick. The honesty line moves with it:

- Absence is neutral or kind: resources accrue to the cap, builds finish,
  nothing decays, nothing is lost for not logging in.
- No pay-to-skip, no FOMO windows, no "come back in 4 hours or lose it".
- Timers are visible as countdowns (ui.md fixed-width values) and short at
  the start — first builds take seconds to minutes, not hours; hour-scale
  timers are late-game pacing.
- Energy/action points regenerate to full within a reasonable session gap
  and the cap is generous enough that a daily player never feels robbed.

## Economy — sinks must match faucets

The same cost curve as `genres/simulation.md` (`cost = base × growth^level`)
drives buildings and upgrades. The genre's extra rule: every resource
faucet needs a sink (upgrades, troop upkeep, repair, market fees), because
a persistent economy compounds forever — hyperinflation is the classic
PBBG killer. Display rates and costs; a player who cannot compute "when can
I afford X" from the screen is missing the genre's whole decision.

## Multiplayer — async by design, sockets never

This genre is multiplayer by nature — the other players **are** the
content: rankings to climb, raid targets to pick, market prices someone
else set. None of it needs realtime. Every multiplayer feature is a read
of rows or a hook route, fetched on navigation and after actions; a
refresh affordance or modest polling only where a countdown genuinely
needs it. Websockets, live chat, and realtime battles stay out of scope —
the genre never needed them: the classic browser empires ran for decades
on page refreshes.

- **Private vs public.** Owner-only `listRule`/`viewRule` keeps player
  rows private, so what others may see (name, level, score — not
  resources or defenses) is a public projection: a rankings/profiles
  collection written during settlement, or a sanitized hook-route view.
  Rankings that read raw player rows leak everything in them.
- **Interactions are hook routes.** Attack, trade, spy: the route loads
  both players' rows, settles **both**, resolves server-side in one
  transaction, and writes a result each can read on their next visit —
  the defender need not be online. Being hit while away obeys the honesty
  line: absence is never ruinous.
- **The build order still holds.** The slice is single-player persistent
  vs NPC opponents (raid targets, league bots, scheduled NPC attacks) —
  that proves the settlement math. Async PvP is the first seam after:
  same collections, plus the resolution route and the ranking query.
  Design the collections for it from the start so the seam is a route,
  not a rewrite.

## What goes wrong

- Built as a canvas game with a tick: the entire skill foundation
  misapplied to a DOM-and-database genre.
- Screens styled as a website or SaaS dashboard — a hero, marketing copy,
  generic admin chrome — instead of a themed game interface.
- A bare, unthemed login form as the first thing a new player sees, or
  unguarded game routes that render for signed-out visitors.
- Starting rows granted by the client instead of the signup hook — or a
  signup that creates no rows at all, so the first login 404s.
- Game math in the client: costs checked in React, the route trusting the
  posted number — a cheat console.
- An owner `updateRule` on game-state collections — the pocketbase default
  applied where it must not be: the player edits their own resources from
  devtools.
- A `json` state field read with `record.get(...)` in a hook instead of
  `JSON.parse(record.getString(...))` — raw bytes, every property
  `undefined`, signup and every action 400.
- Settle-validate-write outside `$app.runInTransaction`: two parallel
  requests both pass the affordability check — a double-spend.
- A cron job, `setInterval`, or background worker instead of lazy
  evaluation on read.
- Settlement in two places that disagree (one route settles, another does
  not).
- No storage caps: absence beats play, and sessions have no decisions.
- Hour-long timers on the first building — the player's first session is
  "wait".
- Punishing absence: decay, expiring rewards, forced daily logins.
- Faucets without sinks: the economy inflates until numbers mean nothing.
- PvP before the single-player slice proves the settlement math.
- Rankings or profiles reading raw player rows — other players' resources
  and defenses leak — instead of a public projection.
- A battle that settles only the attacker, or resolves anything on the
  client.
- `updatedAt` from PocketBase used as the game timestamp — it changes on
  every write, including ones that must not grant time.
