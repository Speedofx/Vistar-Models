# Access Rules

## The five rules

Every collection has five rule strings:

| Rule         | Applied to                                 |
| ------------ | ------------------------------------------ |
| `listRule`   | `GET /api/collections/.../records`         |
| `viewRule`   | `GET /api/collections/.../records/{id}`    |
| `createRule` | `POST /api/collections/.../records`        |
| `updateRule` | `PATCH /api/collections/.../records/{id}`  |
| `deleteRule` | `DELETE /api/collections/.../records/{id}` |

Each rule is one of:

| Value               | Meaning                                              |
| ------------------- | ---------------------------------------------------- |
| `""` (empty string) | Anyone (including anonymous) can perform this op     |
| `null`              | Nobody can (except superuser calls from server code) |
| A filter expression | Check per-record; allow iff it evaluates truthy      |

**Important:** Superuser server-side code (PB hooks / migrations) bypasses
ALL rules. Rules only affect direct REST access with a user JWT.
Since `apps/web` hits PocketBase directly in this project, rules are
mostly a defense-in-depth layer — but they're also the cleanest way to
express "the user can only update their own record" without re-implementing
auth in a React Router resource route for every request.

## Expression syntax

Two contexts available inside the expression:

- `@request` — the incoming request
  - `@request.auth.id` — caller's record id (empty string for anonymous)
  - `@request.auth.email`, `@request.auth.role`, … any field on the auth record
  - `@request.body.field` — submitted payload value (only for `create`/`update`)
- Plain field names — the existing record's fields (for `view`, `update`, `delete`;
  for `list` it applies per row)

Operators: `=`, `!=`, `>`, `<`, `>=`, `<=`, `~` (contains), `!~` (not contains),
`&&`, `||`, parentheses. String literals use single quotes: `'value'`.

### Modifiers (`:isset`, `:changed`, `:length`, `:each`)

- `@request.body.role:isset = false` — the client omitted `role` from the body
  (a profile edit that sends only `name` / `avatar`).
- `@request.body.role:changed = false` — the client omitted `role` **or** sent
  the same value already stored. Equivalent to
  `(@request.body.role:isset = false || @request.body.role = role)`.
- `tags:length = 2` — number of items in a multiple `select` / `relation` /
  `file` field (also on `@request.body.*`). Always `field:length`, never
  `field.length` — dot syntax fails with `invalid left operand "field.length" -
  field "field" is not a valid relation`.
- `roles:each ~ 'admin'` — applies the condition to every item of a multiple field.

Use `:changed = false` whenever a field must stay client-writable for "same
value" round-trips but must not escalate. Use `:isset = false` on create
(there is no stored value to compare).

**Every field a rule references must exist in the collection's schema when the
collection is saved** — that is when PocketBase validates the rules, so a rule
naming a field added "later" fails the migration. This includes modifier
targets: on a plain missing field, `foo:changed`, `foo:length` and `foo:each`
fail with `unknown field "foo"`; on `@request.body.*` targets the same mistake
fails with the misleading `invalid left operand … invalid modifier sequence`
error instead (`:isset` is the one modifier that works without the schema
field). Add the field in the same `up` function, before `app.save(collection)`.

## Defaults: least privilege first

Since `apps/web` calls PocketBase directly with the user's JWT, these
rules ARE your authorization layer. The default for any new app
collection MUST be **owner-scoped** — the user who created the record is
the only one who can list / view / update / delete it. Loosen the rules
ONLY when the user prompt explicitly asks for public / shared / feed /
directory / "everyone can see" semantics. In that case, loosen the
narrowest rule that does the job (almost always just `viewRule` and
`listRule`) and leave write rules owner-scoped.

Decision flow:

1. Did the prompt ask for public / shared reads? **No** → use the
   "Owner-only" recipe below for every new collection. Stop.
2. **Yes** → use the "Owner writes, public reads" recipe and confirm in
   the response that you opened reads to anyone.
3. Need role-based or staff/member splits? → use the role recipes below.
4. Need a public form (anonymous create, nobody else reads) → use the
   "Anonymous submission" recipe.

Never default to `listRule: ""` / `viewRule: ""` (everyone) or
`"@request.auth.id != ''"` (every logged-in user can read every other
user's records). Both are leaks waiting to happen.

## Recipe library

### Owner-only — DEFAULT for every owned collection

This is the one to reach for unless the prompt says otherwise. Requires
an `owner` (or similar) `relation` field on the collection pointing at
`users`, with `required: true` and `maxSelect: 1`.

```js
listRule:   "@request.auth.id != '' && @request.auth.id = owner",
viewRule:   "@request.auth.id != '' && @request.auth.id = owner",
createRule: "@request.auth.id != '' && @request.auth.id = @request.body.owner",
updateRule: "@request.auth.id != '' && @request.auth.id = owner",
deleteRule: "@request.auth.id != '' && @request.auth.id = owner",
```

### Owner writes, public reads — only when the prompt explicitly asks

Use this when the user said "public posts", "anyone can see", "public
directory", "shared feed", etc. Reads open up; writes stay owner-scoped.

```js
listRule:   "",                                                              // explicit public read
viewRule:   "",
createRule: "@request.auth.id != '' && @request.auth.id = @request.body.owner",
updateRule: "@request.auth.id != '' && @request.auth.id = owner",
deleteRule: "@request.auth.id != '' && @request.auth.id = owner",
```

Document the choice when you ship it ("opened `posts.listRule` /
`viewRule` to public per request"). If the prompt is ambiguous, prefer
owner-only and ask.

### Public-read, admin-write (role-based)

```js
listRule: "",
viewRule: "",
createRule: "@request.auth.role = 'admin'",
updateRule: "@request.auth.role = 'admin'",
deleteRule: "@request.auth.role = 'admin'",
```

### Only the user themselves (on `users` auth collection)

```js
listRule: "id = @request.auth.id",
viewRule: "id = @request.auth.id",
updateRule: "id = @request.auth.id",
deleteRule: null,   // prevent self-delete
```

If this collection also has a privileged field (`role`, `isAdmin`, `plan`, …),
do **not** ship this `updateRule` as-is — use "Auth collection with a
privileged field" below.

### Auth collection with a privileged field

`id = @request.auth.id` is record-level, not field-level. A member can PATCH
`role: "admin"` on their own record. Lock the field with `:changed` on update
and `:isset` on create. Repeat per privileged field (`&&`).

```js
listRule: "id = @request.auth.id",
viewRule: "id = @request.auth.id",
updateRule: "(id = @request.auth.id && @request.body.role:changed = false) || @request.auth.role = 'admin'",
deleteRule: null,
createRule: null, // staff/admin portal. If public sign-up, use:
// createRule: "@request.body.role:isset = false || @request.body.role = 'member'",
```

`:changed = false` means omit `role` or send the stored value. `@request.auth.role = 'admin'` may update any user, including `role`.

### Staff can read everything, members can read their own only

```js
listRule: "@request.auth.role = 'staff' || @request.auth.id = owner",
viewRule: "@request.auth.role = 'staff' || @request.auth.id = owner",
```

### Anonymous submission (public form / contact / waitlist)

```js
listRule: null,              // nobody can list submissions
viewRule: null,
createRule: "",              // anyone can submit
updateRule: null,
deleteRule: null,
```

### Prevent status escalation on update

```js
// Users can update their post, but can't change the "status" field to
// "published" themselves — only admins can.
updateRule: "@request.auth.id != '' && @request.auth.id = owner && (@request.body.status:changed = false || @request.auth.role = 'admin')",
```

`:changed = false` means the client left `status` out or kept the stored value.
Only admins may actually change it.

## Concrete full example (owner-only, the default shape)

```js
// apps/pocketbase/pb_migrations/1729500000_create_notes.js
/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    const collection = new Collection({
      type: "base",
      name: "notes",
      listRule: "@request.auth.id != '' && @request.auth.id = owner",
      viewRule: "@request.auth.id != '' && @request.auth.id = owner",
      createRule: "@request.auth.id != '' && @request.auth.id = @request.body.owner",
      updateRule: "@request.auth.id != '' && @request.auth.id = owner",
      deleteRule: "@request.auth.id != '' && @request.auth.id = owner",
      fields: [
        { name: "title", type: "text", required: true, max: 200 },
        { name: "body", type: "editor" },
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
    const collection = app.findCollectionByNameOrId("notes");
    app.delete(collection);
  },
);
```

## Common mistakes

- **Allowing self-service `role` changes on `users`.**
  `updateRule: "id = @request.auth.id"` with a writable `role` field lets any
  member promote themselves to `admin`. When `role` exists, require
  `@request.body.role:changed = false` (or admin) — see the recipe above.
  Open sign-up must also lock `role` on create with `:isset`.
- **Defaulting to public or "any logged-in user" reads.** `listRule: ""` /
  `viewRule: ""` is "anyone, including anonymous". `"@request.auth.id != ''"`
  on `list` / `view` is "every signed-in user can read every other user's
  records". Both are leaks waiting to happen. The default is owner-scoped
  (see the recipe at the top); only loosen reads when the prompt explicitly
  asks for public or shared semantics.
- **Allowing the client to send `owner: '<anyone>'`.** `createRule: "@request.auth.id != ''"`
  alone does NOT verify that the submitted `owner` matches the caller — a
  logged-in user can `POST` with `owner: '<somebody_else>'` and the row is
  accepted. Always include `&& @request.auth.id = @request.body.owner` in
  the `createRule` (see the owner-only recipe above) so PB rejects the write
  with 403 before it ever reaches the database. The client must then send
  `owner: pb.authStore.record.id` on create.
- Writing the rule as a JS expression (`||`, `&&` in JS are the same tokens,
  but `===`, `true`, `null` are NOT). Rule language uses `=`, `'string'`,
  and its own `null` handling (`field = null` for "is null"). Don't paste JS
  conditionals in.
- Using `""` thinking it means "no rule" — it means "everyone allowed".
  `null` means "denied".
- `@request.auth.id = author` when `author` is multi-relation (array). For
  multi-relations use `author.id ?= @request.auth.id` (contains).
- Forgetting that superuser server-side calls (hooks / migrations) bypass rules.
- **Using dot notation (`field.id`) on a non-relation field** — `author.id`
  in a rule means "traverse the relation called `author`, then access its `id`".
  If `author` is declared as `type: "text"` (storing the user ID as a plain
  string), PocketBase rejects the migration with:
  `invalid right operand "author.id" — field "author" is not a valid relation`.
  Fix: (a) declare `author` as `type: "relation"` (preferred — gives referential
  integrity) and keep the rule as `@request.auth.id = author`, no dot notation
  needed (PB compares the relation's referenced id automatically); or (b) keep
  `author` as text and compare directly: `author = @request.auth.id`.
- Rules that reference a field that doesn't exist (typo) → PB returns 500
  on every request to that collection, not a friendly error.
