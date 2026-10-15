# Vault Index

## wiki/

| File                         | Description                                          |
| ---------------------------- | ---------------------------------------------------- |
| `CODEBASE.md`                | Monorepo structure, file map, ports, quick reference |
| `APP_EVENT_SUMMARY.md`       | High-level summary of app events and state           |
| `GLOBAL_PROMPT.md`           | Global system prompt / instructions                  |
| `LOCAL_PROMPT.md`            | Local / session-specific prompt overrides            |
| `FIRST_GENERATION_PROMPT.md` | Extra guidance injected on the first gen of an app   |

## wiki/skills/

Each skill is a folder with a `SKILL.md` entry (the hub) and a `references/` subfolder for deep-dives. Load `<skill>/SKILL.md` first; pull individual `<skill>/references/*.md` files only when the entry tells you to.

| Skill                          | SKILL.md (entry)                       | Description                                                                                                       |
| ------------------------------ | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `react-router-framework-mode/` | `react-router-framework-mode/SKILL.md` | React Router framework mode: routes, loaders, actions, forms, SSR                                                 |
| `react-router-migration/`      | `react-router-migration/SKILL.md`      | Post-cutover stitch from archived Vite SPA + Express API into the live React Router app                           |
| `pocketbase/`                  | `pocketbase/SKILL.md`                  | PocketBase hub: architecture, the two hard rules, minimum migration, sub-skill index                              |
| `hostinger-ecommerce/`         | `hostinger-ecommerce/SKILL.md`         | Building a storefront on the typed store client: products, variants, cart, inventory, checkout, subscriptions     |
| `integrated-ai/`               | `integrated-ai/SKILL.md`               | AI chat, assistants and image generation on the injected model client: route wiring, access modes, streaming UI   |
| `design/`                      | `design/SKILL.md`                      | Website and app UI only. Do not load for a browser game; use `game/`                                              |
| `game/`                        | `game/SKILL.md`                        | Browser-game foundation: plain state, tick, one playable loop, feel, and 2D (Canvas 2D) or 3D (three.js) graphics |
| `supabase/`                    | `supabase/SKILL.md`                    | LEGACY, migrated sites only: Supabase hub — client, the four hard rules, SQL/auth/edge-function/secret index      |

## wiki/skills/react-router-migration/references/

| File                      | Description                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `manifest-schema.md`      | Combined `{ web, api }` manifest fields and post-cutover path remapping                |
| `stitch-patterns.md`      | Route-module assembly, SPA shell removal, import repair, Express conversion, SSR risks |
| `completion-checks.md`    | Product, hygiene, and `reload_app` checks before you stop                              |
| `migration-manifest.json` | Generated per website during staging. Not shipped in the template.                     |

## wiki/skills/react-router-framework-mode/references/

| File                      | Description                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| `routing.md`              | Configuring routes, nested routes, dynamic segments                                                |
| `route-modules.md`        | Every route module export (loader, action, meta, headers, ErrorBoundary)                           |
| `special-files.md`        | Customizing root.tsx, global nav/footer, fonts                                                     |
| `data-loading.md`         | Loaders, streaming, caching                                                                        |
| `actions.md`              | Forms, mutations, validation                                                                       |
| `api-routes.md`           | Server-side `/api/*` routes: 3rd-party calls, secrets, webhooks, rate limits, superuser PocketBase |
| `navigation.md`           | Links, programmatic navigation, redirects                                                          |
| `pending-ui.md`           | Loading states, optimistic UI                                                                      |
| `error-handling.md`       | Error boundaries, error reporting                                                                  |
| `rendering-strategies.md` | SSR vs SPA vs pre-rendering configuration                                                          |
| `seo-sitemap.md`          | Public pages, `/sitemap.xml`, SEO/GEO indexing                                                     |
| `middleware.md`           | Middleware and the context API: auth guards, response headers, request context                     |
| `sessions.md`             | Cookie sessions, authentication, protected routes                                                  |
| `type-safety.md`          | Auto-generated route types, type imports                                                           |

## wiki/skills/pocketbase/references/

Foundations:

| File                   | Description                                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `MIGRATIONS.md`        | Base layer: filename rules, up/down, how reload_app applies them                                                        |
| `USING_IN_REACT.md`    | Default path: React → PB direct (auth, CRUD, realtime, files)                                                           |
| `HOOKS.md`             | Server-side reactions: transactional email (`$app.newMailClient`), default/redact fields per request, brand auth emails |
| `RECORD_OPERATIONS.md` | JSVM record getters, fetch helpers, and relation expansion (`$app.expandRecord`)                                        |
| `FIELD_TYPES.md`       | All field types (relation, select, file, json, date, geoPoint, etc.)                                                    |
| `ACCESS_RULES.md`      | listRule/viewRule/createRule/updateRule/deleteRule expressions (designing from scratch)                                 |
| `INDEXES.md`           | Unique, composite, partial, case-insensitive indexes (designing from scratch)                                           |
| `RAW_SQL.md`           | Escape hatch for bulk updates / cross-collection aggregates                                                             |

Collection operations:

| File                        | Description                                                         |
| --------------------------- | ------------------------------------------------------------------- |
| `CREATE_COLLECTION.md`      | New base (non-auth) collection, fields, rules, indexes (idempotent) |
| `CREATE_AUTH_COLLECTION.md` | Users / staff / OTP auth collections and seeded admins              |
| `DELETE_COLLECTION.md`      | Drop a collection, with relation-cascade ordering                   |
| `RENAME_COLLECTION.md`      | Rename a collection (preserves data, frontend follow-up needed)     |

Field operations (existing collection):

| File              | Description                                               |
| ----------------- | --------------------------------------------------------- |
| `ADD_FIELD.md`    | Add a new field with idempotency + per-type templates     |
| `REMOVE_FIELD.md` | Drop a field with index cascade and rollback restoration  |
| `RENAME_FIELD.md` | Rename a field, with the rule/index follow-up checklist   |
| `UPDATE_FIELD.md` | Change required/min/max/values/maxSize/cascadeDelete/etc. |

Rules + indexes on existing collection:

| File                | Description                                                                   |
| ------------------- | ----------------------------------------------------------------------------- |
| `UPDATE_RULES.md`   | Mutate listRule/viewRule/createRule/updateRule/deleteRule/manageRule/authRule |
| `UPDATE_INDEXES.md` | Add or remove indexes via `collection.indexes.push` / `.filter`               |

Records / seeding / data:

| File                | Description                                                                      |
| ------------------- | -------------------------------------------------------------------------------- |
| `SEED_DATA.md`      | Seed inside create migrations or in a follow-up; `_lookup` pattern for relations |
| `UPDATE_RECORDS.md` | findRecordsByFilter + loop + r.set + app.save (validated bulk update)            |
| `DELETE_RECORDS.md` | findRecordsByFilter + loop + app.delete (with cascade caveats)                   |

Auth features:

| File                 | Description                                                                         |
| -------------------- | ----------------------------------------------------------------------------------- |
| `OAUTH_PROVIDERS.md` | Configure Google/GitHub/Apple/Discord/… with $os.getenv secrets and upsert          |
| `OTP_AUTH.md`        | Email-code (passwordless) auth, OTP-only or hybrid                                  |
| `MFA.md`             | Two-factor on top of password, opt-in (`mfaEnabled` field) or mandatory             |
| `CUSTOM_SMTP.md`     | Send mail from the user's own address (Hostinger mail / Gmail / custom-domain SMTP) |

## wiki/skills/hostinger-ecommerce/references/

| File               | Description                                                                          |
| ------------------ | ------------------------------------------------------------------------------------ |
| `SUBSCRIPTIONS.md` | Recurring billing: plans, subscribe, billing portal, tier-gated pages and API routes |

## wiki/skills/game/references/

| File             | Description                                                                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `loop.md`        | Core loop contract, the tests that separate a playable slice from a scene, and the difficulty ramp                                             |
| `tick.md`        | Frame loop, seeded RNG on state, cutscene timelines, and three plugs for the next mechanic: entity kind, one step, or a content record         |
| `feel.md`        | Tween helper, camera follow, hitstop, shake, squash, FOV punch, rumble, and HUD feedback. Sound lives in `sound.md`                            |
| `ui.md`          | Full-viewport frame. First screen names the goal and the verb. UI scales. Touch controls. HUD zones, fixed-width values, menu ordering         |
| `graphics-2d.md` | 2D world art on Canvas 2D: authored shapes, palette roles, the background as a place, pre-rendered sprites, effects, performance               |
| `graphics-3d.md` | 3D world art on three.js: procedural models, material kit, lighting, world as a named place with one mood, sky, shaders, post, budgets         |
| `sound.md`       | Procedural Web Audio: synthesized one-shots per feel event, a quiet atmospheric music bed, groups and unlock, variance and mix. No audio files |
| `story.md`       | Narrative in any genre: scene graph and flags, writing rails (arc, endings, dilemmas), DOM scene presentation, story-first vs story-flavored   |
| `physics.md`     | Escape hatch when overlap tests fail: Rapier (2D/3D), fixed timestep, sensors, one-place sync, teardown                                        |
| `debug.md`       | Blank/wrong canvas triage (2D and 3D), measure-first profiling loop, dev-only diagnostics handle                                               |

## wiki/skills/game/references/genres/

One file per broad genre; the Genre table in `game/SKILL.md` routes the brief to the right one. Sub-genres live inside each file.

| File                  | Description                                                                                                                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `arcade.md`           | Snake, breakout/pong, flappy, asteroids, falling blocks: grid stepping, bounce steering, wrap, lock-in, speed ramp                                                                                        |
| `shooter.md`          | Top-down/twin-stick/space/FPS: aiming, pooled projectiles, three-tier enemy movement (seek+separation, flow field, A*), waves, telegraphs                                                                 |
| `platformer.md`       | Platformers and runners: the five-part jump kit, axis-separated collision, one-way platforms, camera deadzone, runner chunks                                                                              |
| `puzzle.md`           | Match-3, 2048, sokoban, minesweeper: board-is-state with a step queue, cascade resolution, deadlock handling, undo, teach→confirm→twist                                                                   |
| `word.md`             | Wordle, typing, trivia: two-list dictionary, two-pass letter evaluation, keyboard state, WPM, trivia records                                                                                              |
| `educational.md`      | Learning games as an overlay on a base mechanic: wrong-answer-teaches, re-queue until mastered, curriculum ramp, honest progress                                                                          |
| `strategy.md`         | Tower defense, turn-based tactics, auto-battler, RTS-lite: waypoint paths, targeting, phase machine, flood-fill range, scored AI, RTS rails                                                               |
| `tabletop.md`         | Chess, checkers, cards, solitaire, memory: one legalMoves function, minimax with depth, seeded shuffle, stack predicates, undo                                                                            |
| `rpg-adventure.md`    | RPG, roguelike, stealth, survival, narrative: scope rails, stat/damage/XP math, the power curve, procedural rooms, vision cones, saves; story craft routes to `story.md`                                  |
| `simulation.md`       | Clicker, idle, tycoon, farm/shop: cost curve, rate math, honest offline progress, production chains, no dark patterns                                                                                     |
| `racing.md`           | Lap racers, time trial, drift: kinematic car with speed-scaled turn rate, spline-derived track geometry, checkpoint laps, same-model competitive AI, contact feedback, the vehicle model, speed sensation |
| `sports.md`           | Pool, mini golf, pinball, bowling, air hockey: aim-power-launch verb, honest previews, turn settlement, per-sport rules                                                                                   |
| `fighting.md`         | Boss fights, brawlers, 1v1: startup/active/recovery attacks, hitbox vs hurtbox, phases, attack tokens, lane depth, mandatory juice                                                                        |
| `rhythm.md`           | Rhythm and timing games: AudioContext clock as master time, scheduled-ahead beats, clock-based judgment, calibration                                                                                      |
| `persistent-world.md` | Travian/Torn-like persistent browser games — the architecture fork: DOM + PocketBase, lazy time evaluation, queues, server-validated actions, honest real-time pacing                                     |

## wiki/skills/design/references/

| File           | Description                                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `ANIMATION.md` | The 12 animation principles mapped to web UI; read for motion-heavy work (reveals, transitions, micro-interactions, interaction-led heroes) |

## wiki/skills/supabase/references/

Only present on sites migrated from monorepo-v2 with a connected Supabase project. Supabase cannot be added to a site that does not already have it.

| File                       | Description                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------- |
| `USING_IN_REACT.md`        | Default path: browser → Supabase direct (queries, writes, realtime, storage); public-only server loaders |
| `CHANGING_THE_DATABASE.md` | SQL through `run_supabase_query`: tables, columns, RLS policies, indexes, seeding. Not revertable        |
| `AUTH.md`                  | Login/signup/session on `SupabaseAuthContext.jsx`, `clientLoader` guards, profiles, roles                |
| `EDGE_FUNCTIONS.md`        | Write `supabase/functions/<name>/index.ts`, deploy it, invoke it from the browser                        |
| `SECRETS.md`               | Storing an API key and reading it via `Deno.env` inside a function                                       |
