# PocketBase Migrations

## What a migration is

A file under `apps/pocketbase/pb_migrations/*.js` that contains exactly one
`migrate(upFunc, downFunc)` call. PocketBase applies any file not yet recorded
in its internal `_migrations` table, in filename order, on every `serve`
startup. `reload_app` restarts PB → migrations apply automatically.

## Filename rules (strict)

- Must end in `.js`.
- Must start with `{unix_timestamp}_`, monotonically increasing.
- Short snake_case description after the timestamp.
- Examples:
  - `1745000000_create_tasks.js` ✅
  - `1745000001_add_due_date_to_tasks.js` ✅
  - `tasks.js` ❌ (no timestamp → ignored)
  - `1700_tasks.js` ❌ (timestamp smaller than earlier migrations → skipped silently)

**Always use `<current_time>` from your first message as the base timestamp.**
For multiple migrations in one session, increment by 1 each time:
`<current_time>`, `<current_time>+1`, `<current_time>+2`, …
Never hardcode a fixed timestamp — it will collide with past migrations.

Exception: if you are correcting a migration you just wrote in this same session
(before `reload_app` has applied it), overwrite the existing file at its original
filename — do NOT generate a new timestamp for it.

## The `up` / `down` pattern

`up` makes the change. `down` reverts it. `down` is optional but recommended it's the only protection against
silently broken state during development and revert changes.

## Concrete example — create + later alter

First migration (creates the collection):

```js
// apps/pocketbase/pb_migrations/1729500000_create_tasks.js
/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    const collection = new Collection({
      type: "base",
      name: "tasks",
      // Owner-scoped by default — only the user who created a task can
      // see or change it. Loosen ONLY if the user prompt explicitly
      // asked for public/shared semantics.
      listRule: "@request.auth.id != '' && @request.auth.id = owner",
      viewRule: "@request.auth.id != '' && @request.auth.id = owner",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && @request.auth.id = owner",
      deleteRule: "@request.auth.id != '' && @request.auth.id = owner",
      fields: [
        { name: "title", type: "text", required: true, max: 200 },
        { name: "done", type: "bool" },
        {
          name: "owner",
          type: "relation",
          required: true,
          maxSelect: 1,
          collectionId: users.id,
          cascadeDelete: true,
        },
        { name: "created", type: "autodate", onCreate: true, onUpdate: false },
        { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
      ],
    });
    app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("tasks");
    app.delete(collection);
  },
);
```

Second migration (adds a field — note it's a NEW file, we never edit the first):

```js
// apps/pocketbase/pb_migrations/1729500001_add_due_date_to_tasks.js
/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("tasks");
    collection.fields.add(
      new DateField({
        name: "due",
        required: false,
      }),
    );
    app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("tasks");
    collection.fields.removeByName("due");
    app.save(collection);
  },
);
```

## How to ship a migration

1. Write the file via `write_file` into
   `apps/pocketbase/pb_migrations/<timestamp>_<name>.js`.
2. Call `reload_app` ONCE. PocketBase reboots, applies unapplied migrations
   inside a transaction, and ports come back up.
3. If `reload_app` reports errors from PocketBase (e.g. "failed to apply
   migration ..."), open the migration file, fix the problem, and
   `reload_app` again. Do NOT leave a broken migration in place, and do NOT
   add a second migration that "fixes" a broken unmigrated one — delete /
   correct the broken file first.

## Common mistakes

- **Calling `new Collection({ name: "X" })` when `X` is already in
  `<pocketbase_schema>`.** PB rejects with `name: Collection name must be
unique (case insensitive)` and rolls back the whole `up` function.
  In this template the `users` auth collection is pre-provisioned, so a
  bare `new Collection({ type: "auth", name: "users", ... })` will always
  fail on first generation. Use the find-or-create pattern from
  `CREATE_AUTH_COLLECTION.md` / `CREATE_COLLECTION.md`:
  ```js
  let users;
  try {
    users = app.findCollectionByNameOrId("users");
  } catch (_) {
    users = new Collection({ type: "auth", name: "users" /* ... */ });
    app.save(users);
  }
  ```
  Do NOT wrap a bare `app.save(new Collection(...))` in `try/catch` to mask
  the error — that leaves an unreachable `new Collection(...)` block in the
  file. Switch to find-or-create.
- **Using `return` after "already exists" in a multi-step `up` migration.**
  This silently skips every later operation in the file. Example: if `users`
  already exists and the migration returns before creating `tasks`, PocketBase
  starts cleanly but the app collection is missing. Instead, resolve the
  existing collection and continue, or split the work into separate migrations.
- **Editing an already-applied migration.** PB keys migrations by filename;
  if the filename is already in `_migrations` system collection, the edited migration is NOT
  re-applied. Add a new migration with the delta.
- **Calling raw `.one()` with no destination model.** `app.db().newQuery(...).one()`
  is not a row-returning call — it panics the Go process and takes the site
  down, and `try/catch` does not stop a Go panic. Use the record wrapper for
  existence checks: `findRecordsByFilter` is the safe default because it
  returns an array that is empty when nothing matches, while
  `findFirstRecordByData` throws `sql: no rows in result set` on a miss and so
  needs a `try/catch`. See `RAW_SQL.md` if you genuinely need SQL.
- **Assuming a record exists.** A migration runs on every database that has not
  applied it yet — a brand-new sandbox or a restored backup may not contain the
  record you can see right now. An unguarded `findFirstRecordByData(...)` miss
  throws `sql: no rows in result set` and crash-loops PocketBase. Use
  `findRecordsByFilter` (returns `[]` on no match) and iterate, or `try/catch`
  the lookup and skip the step.
- **Inventing JSVM members.** Migration code runs in PocketBase's Go-backed
  JSVM — only documented members exist. It is `record.id`, not
  `record.getId()`; `collection.fields.removeByName("x")` / `removeById(...)`,
  not `fields.remove(...)`. `Object.keys()` / `Object.entries()` on a value
  that turned out `undefined`/`null` throws `TypeError: Cannot convert
  undefined or null to object` — guard the lookup first.
- **Saving a rule that references a field the collection doesn't have yet.**
  Rules are validated at `app.save(collection)` — add the field in the same
  `up` function before saving. See `ACCESS_RULES.md` for the syntax gotchas
  (`field:length`, never `field.length`; `:changed`/`:length`/`:each` on a
  missing field fail with a misleading `invalid modifier sequence` error).
- **Decide field options BEFORE the first `reload_app`.** Once a migration is
  applied, fixing `required`, `max`, or `pattern` on the same field requires
  a NEW delta migration via `collection.fields.getByName(...)` — see
  `UPDATE_FIELD.md`. Avoid the flip-flop pattern of writing a migration,
  applying it, realising a flag is wrong, editing the original (no-op),
  then writing a delta. Pick the right option upfront.
- **Reflexive `required: true`.** Most fields should NOT be required.
  Required-by-default produces immediate frontend validation errors and
  follow-up "fix" migrations. Two especially nasty cases on PB:
  `required: true` on `bool` rejects `false`, and `required: true` on
  `number` rejects `0`. See `FIELD_TYPES.md` for the per-type policy.
- **Writing schema changes somewhere other than `pb_migrations/`.** A route
  file that POSTs to `/api/collections` creates untracked state that gets
  wiped on the next container start.
- **Forgetting the closing `});`** — migrate takes two arg functions, and
  missing a `});` will usually surface as a cryptic JSVM parse error.
- **Using `Date.now()` for the filename in the file body.** The timestamp is
  in the filename only, used for ordering. The body is plain migration code.
