# Raw SQL (escape hatch)

## When raw SQL is justified

- Bulk update: `UPDATE tasks SET status = 'archived' WHERE …` across
  thousands of rows — looping with `app.save(record)` would trigger full
  validation per row and be ~100× slower.
- Complex multi-table read for a dashboard (e.g. "count posts per category,
  join author").
- Setting app settings or platform-level flags that don't have a collection.

## When NOT to use raw SQL

- Creating/updating a handful of records → use the wrapper.
- Anything that mutates schema (collections, fields, indexes) → always use
  `new Collection` / `collection.fields.add(...)`, never `ALTER TABLE`.
  PocketBase tracks schema in its own meta tables AND in SQLite; editing raw
  SQLite without going through the wrapper desyncs them and breaks the admin
  UI.

## The API

`app.db().newQuery("SQL").execute()` — for non-SELECT.
`app.db().newQuery("SQL").one(model)` — for single-row SELECT.
`app.db().newQuery("SQL").all(arrayOf(model))` — for multi-row SELECT.

`.one()` and `.all()` do NOT return rows. They are bindings for Go's
`Query.One(dest)` / `Query.All(dest)`, which scan the result INTO a destination
you hand them. The destination is mandatory — see the next section.

Always bind user/dynamic values with `{:name}` placeholders and `.bind({...})`.
Never string-concatenate values into the SQL.

## `.one()` without a destination crashes PocketBase

This is the most common raw-SQL bug, and it does not fail politely — it kills
the process and takes the site down.

```js
// ❌ WRONG — written as if `.one()` returned the row, the way most JS database
//    clients work. It crashes PocketBase with a Go runtime panic:
//      runtime error: invalid memory address or nil pointer dereference
//      github.com/pocketbase/dbx.(*Rows).one(0x…, {0x0, 0x0})
const row = app
  .db()
  .newQuery("SELECT id FROM settings WHERE key = {:key} LIMIT 1")
  .bind({ key })
  .one();
```

```js
// ✅ CORRECT — pass a DynamicModel whose shape matches the selected columns.
const row = new DynamicModel({ id: "" });
app
  .db()
  .newQuery("SELECT id FROM settings WHERE key = {:key} LIMIT 1")
  .bind({ key })
  .one(row);
// row.id is now populated.
```

With no argument, goja hands dbx a nil interface as the destination. dbx runs
the query fine, gets its rows, then reflects on that nil destination to work out
where to write the columns — and dereferences a nil pointer. The `{0x0, 0x0}` in
the stack trace is that empty interface, both its type and data words nil.

`.all()` has the same contract: it needs `arrayOf(new DynamicModel({...}))`.

### `try/catch` will NOT save you

A Go runtime panic is not a JavaScript exception. goja re-panics anything that
isn't a JS throw, so it blows straight through `catch` — which is why a
migration that looks defensively written still takes down the process:

```js
// ❌ Looks safe. Still site-down.
try {
  existing = app.db().newQuery("SELECT id FROM settings …").bind({ key }).one();
} catch (_) {
  // never reached
}
```

Only JS-level errors are catchable. A `.one(dest)` call with a real destination
and no matching row throws a normal JS error (`sql: no rows in result set`) —
that one you can handle.

### `.bind()` returns the query, not a row

The related silent bug: `.bind({...})` is a builder step. Assigning its result
and reading a column off it never throws, it just always reads `undefined`.

```js
// ❌ `existing` is a Query object, so `existing.id` is always undefined. The
//    "already exists?" guard never fires and the seed inserts duplicates.
const existing = app.db().newQuery("SELECT id FROM settings …").bind({ key });
if (existing && existing.id) continue;
```

### Prefer the wrapper for existence checks

None of this risk is worth it for the "does this row already exist?" check that
makes a seed migration idempotent. The wrapper returns real records and throws
real, catchable JS errors:

```js
const existing = app.findRecordsByFilter(
  "settings",
  "key = {:key}",
  "",
  1,
  0,
  { key },
);
if (existing.length > 0) continue;
```

Reach for raw SQL only when one of the cases at the top of this file applies.

## Example — bulk UPDATE inside a migration

```js
// apps/pocketbase/pb_migrations/1729500005_archive_old_tasks.js
/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    app
      .db()
      .newQuery("UPDATE tasks SET status = 'archived' WHERE due < {:cutoff}")
      .bind({ cutoff: "2024-01-01 00:00:00.000Z" })
      .execute();
  },
  (app) => {
    // Down: we can't recover which rows were archived — leave empty with a note.
  },
);
```

**Important:** raw `$app.db().newQuery(...)` is ONLY available inside
`pb_migrations/*.js` and `pb_hooks/*.pb.js` (JSVM context). The `pocketbase`
Node SDK has no equivalent.

## Example — binding parameters safely

```js
migrate(
  (app) => {
    const emails = ["a@example.com", "b@example.com", "c@example.com"];

    // Wrong — SQL injection surface:
    // .newQuery(`DELETE FROM users WHERE email IN ('${emails.join("','")}')`)

    // Right — parameterized with IN(...):
    const placeholders = emails.map((_, i) => `{:e${i}}`).join(", ");
    const bind = Object.fromEntries(emails.map((e, i) => [`e${i}`, e]));
    app
      .db()
      .newQuery(`DELETE FROM users WHERE email IN (${placeholders})`)
      .bind(bind)
      .execute();
  },
  (app) => {
    // DELETE is destructive — original rows are gone.
  },
);
```

## SELECT via DynamicModel

```js
const row = new DynamicModel({
  totalPublished: 0,
  totalDraft: 0,
});
app
  .db()
  .newQuery(
    `
    SELECT
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS totalPublished,
      SUM(CASE WHEN status = 'draft'     THEN 1 ELSE 0 END) AS totalDraft
    FROM posts
  `,
  )
  .one(row);
console.log(row.totalPublished, row.totalDraft);
```

## Common mistakes

- Calling `.one()` / `.all()` with no destination → Go panic, PocketBase dies,
  and `try/catch` cannot stop it. Always pass a `DynamicModel`.
- Reading a column off the result of `.bind()` → always `undefined`; the guard
  you wrote silently never fires.
- Using raw SQL for an existence check in a seed migration → use
  `findRecordsByFilter` instead (`findFirstRecordByData` works too, but it
  throws `sql: no rows in result set` on a miss, so it needs a `try/catch`).
- Using raw SQL to create or alter collections/fields → desyncs PB's
  metadata. Always use the wrapper for schema.
- String-interpolating user input → SQL injection. Always `{:name}` + `.bind`.
- Expecting raw SQL to fire PocketBase event hooks — it doesn't. Use the
  wrapper if hooks need to run (e.g. search-index updates).
- Assuming raw SQL is faster for everything. For <~100 rows the wrapper's
  overhead is negligible and validation is worth it.
