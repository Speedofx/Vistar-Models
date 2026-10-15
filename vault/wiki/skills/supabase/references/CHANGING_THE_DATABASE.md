# Changing the Database (SQL)

Load this reference for ANY schema change: a new table, a new column, an RLS
policy, an index, a storage bucket, seed data.

Schema changes are SQL statements run through the `run_supabase_query` tool.
There is no migration file, no migration runner, and no `down` step.

## Before you write any SQL

Read the `<supabase_schema>` block injected into your context. It lists every
namespace, table, column, foreign key, policy, and trigger that already exists.

- If a table that fits the task already exists, **add a column to it** — do not
  create a parallel table.
- If the task is about users, the `auth.users` table already exists and is
  managed by Supabase. Never create it, never alter it. Attach your own columns
  to a `public.profiles` table keyed by `auth.users.id`. See
  `supabase/references/AUTH.md`.

## There is no undo

`run_supabase_query` runs against the user's live production database. A message
revert rewinds the code in this repo; it does not rewind the schema.

- Write additive SQL. `CREATE TABLE`, `ADD COLUMN`, `CREATE POLICY`.
- Make every statement re-runnable with `IF NOT EXISTS` / `IF EXISTS`. Policies
  and triggers are the exceptions — neither has an `if not exists` form, so guard
  them with `drop policy if exists` / `drop trigger if exists` instead.
- Never `DROP TABLE`, `DROP COLUMN`, `TRUNCATE`, or unfiltered `DELETE` unless
  the user asked for exactly that in this conversation. Dropping a column
  destroys live data.
- There is one database for preview and production. A row you insert while
  testing is live, and a new column appears on the published site at once.

## Inspect, change, verify

The injected `<supabase_schema>` is a useful map, but it does not include every
column default, `CHECK` constraint, enum value, or function body. Before an
`INSERT` or `UPDATE` against an existing table, inspect its live constraints and
defaults instead of inventing values.

For example, inspect the accepted values and defaults on `public.tasks` before
creating a test row:

```sql
select c.conname, pg_get_constraintdef(c.oid) as definition
from pg_constraint c
where c.conrelid = 'public.tasks'::regclass
  and c.contype = 'c';

select column_name, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'tasks'
order by ordinal_position;
```

Inspect one existing function with PostgreSQL's `pg_proc` names and retrieve
its definition before replacing it:

```sql
select
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  pg_get_functiondef(p.oid) as definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'set_updated_at'
order by p.proname;
```

Inspect enum labels instead of guessing an allowed value:

```sql
select t.typname as enum_type, e.enumlabel as value
from pg_type t
join pg_enum e on e.enumtypid = t.oid
join pg_namespace n on n.oid = t.typnamespace
where n.nspname = 'public'
order by t.typname, e.enumsortorder;
```

Keep live validation calls small and ordered:

1. Inspect the current constraints or definition with read-only SQL.
2. Apply one coherent, re-runnable change.
3. Verify the result with read-only SQL.

Prefer read-only verification. If temporary rows are necessary, give them
unique identifiers and delete only those exact rows. Do not combine setup,
dozens of assertions, and cleanup at the end of one large `DO` block: a syntax
or constraint error can stop the block before cleanup. After any failed
mutating query, inspect the affected objects and rows before retrying; do not
blindly replay the whole query or assume its cleanup ran.

## The standard new table

Every new table needs four things in one statement: the table, RLS enabled, the
policies, and an updated-at trigger if the app cares about it.

```sql
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "Users read own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users insert own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users update own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "Users delete own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);
```

**Enabling RLS without adding policies locks the table completely** — every
query returns zero rows and every insert fails. The two always ship together.

`create policy` has no `if not exists`. Re-running this block as written aborts
on the first policy that already exists — prefix each one with
`drop policy if exists "Users read own tasks" on public.tasks;` whenever the
table may already be set up.

## Choosing policies — least privilege by default

Owner-scoped is the default for anything a user creates. Reach for a different
shape only when the prompt asks for it.

```sql
-- Owner-only (default): each user sees just their own rows
using (auth.uid() = user_id)

-- Public read, authenticated write: blog posts, product catalog, public directory
create policy "Anyone can read posts"
  on public.posts for select using (true);
create policy "Authors write own posts"
  on public.posts for insert with check (auth.uid() = author_id);

-- Any signed-in user can read: team-wide data, shared board
using (auth.role() = 'authenticated')

-- Public insert, nobody reads: contact form, waitlist
create policy "Anyone can submit"
  on public.contact_messages for insert with check (true);
```

`using` controls which existing rows the operation can see (select, update,
delete). `with check` validates the incoming row (insert, update). An update
policy that must both restrict and validate needs both clauses.

Do not default to `using (true)` for reads on user data — that publishes every
row to every visitor, including anonymous ones.

## Adding a column

```sql
alter table public.tasks
  add column if not exists due_date timestamptz;
```

Adding a `not null` column to a table with existing rows fails unless you give
it a default:

```sql
alter table public.tasks
  add column if not exists priority integer not null default 0;
```

## Indexes

```sql
create index if not exists tasks_user_id_idx on public.tasks (user_id);
create unique index if not exists profiles_username_key on public.profiles (lower(username));
```

Index the columns your policies and filters use — `user_id` on every
owner-scoped table is the common case.

## Seed data

```sql
insert into public.categories (slug, name)
values ('news', 'News'), ('guides', 'Guides')
on conflict (slug) do nothing;
```

`on conflict … do nothing` keeps the statement safe to re-run. Seeding requires
a unique constraint on the conflict target.

## Updated-at trigger

```sql
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();
```

`create trigger` has no `if not exists` — guard a re-run with
`drop trigger if exists tasks_set_updated_at on public.tasks;` first.

## Storage buckets

```sql
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users upload own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
```

The folder-name check is what scopes uploads to one user — it requires paths
shaped `<user_id>/<filename>`, which is what
`supabase/references/USING_IN_REACT.md` uploads.

## Realtime

```sql
alter publication supabase_realtime add table public.tasks;
```

Only needed when the frontend subscribes to the table.

## After running SQL

The injected `<supabase_schema>` was captured at the start of the turn and does
not update mid-task. Track what you created yourself, and write the frontend
against the columns you just added rather than re-reading a stale block.

## Pitfalls

- **RLS enabled with no policy.** Table is invisible to everyone. Add policies
  in the same statement.
- **Forgetting `enable row level security`.** The opposite failure: the table is
  wide open to anyone with the anon key.
- **`references auth.users(id)` without `on delete cascade`.** Deleting a user
  then fails on the foreign key.
- **A policy that references a column the table does not have.** Postgres
  accepts the policy and every query fails afterwards. Match the column names
  in the `create table` exactly.
- **`create table` without `if not exists` on a re-run.** Aborts the statement.
- **`create policy` on a re-run.** There is no `if not exists` for policies, so
  a second run fails with "policy already exists" — `drop policy if exists`
  first.
- **Creating `public.users`.** Auth users live in `auth.users`; profile data
  belongs in `public.profiles`. See `supabase/references/AUTH.md`.
- **`serial` / `integer` primary keys for new tables.** Prefer
  `uuid primary key default gen_random_uuid()` — it matches `auth.users.id` and
  does not leak row counts.
