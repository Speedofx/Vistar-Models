# Using Supabase from React (Default Path)

Load this reference when the frontend needs to read or write data — lists,
forms, dashboards, saving, history. This is the DEFAULT way to talk to the
database. Do NOT put an edge function in the middle unless the task needs a
secret key or server-side logic (see `supabase/references/EDGE_FUNCTIONS.md`),
and do NOT put a React Router `/api/*` resource route in the middle at all.

## The client

Already wired up at `apps/web/src/lib/customSupabaseClient.js` — never edit it,
and never convert it to TypeScript:

```js
import { supabase } from "@/lib/customSupabaseClient";
```

## Where the query runs: the browser, not the server

This app renders on the server, but the Supabase session lives in the
visitor's browser storage. The server never knows who is asking, so a query
that runs on the server always runs as the anonymous visitor. On top of that,
the published site caches every GET response — HTML and loader data — by URL
for every visitor (see `react-router-framework-mode/references/sessions.md`).

So, by default, run queries in the browser:

| Where                                    | Use it for                                                     |
| ---------------------------------------- | -------------------------------------------------------------- |
| `useEffect`, event handlers              | Default. Lists, forms, dashboards, anything per-user           |
| `clientLoader` (+ `clientLoader.hydrate`) | A route whose data must be ready before it renders             |
| `clientAction`                           | Form submissions that write through the SDK                    |
| Server `loader`                          | Only anonymous, public content where SEO matters (see below)   |

Never read or change the session on the server (`supabase.auth.*` in a
`loader`, `action`, or `.server.ts` module). The client module is shared by
every request the server handles; a sign-in there would be shared too.

## Reading rows

```tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/customSupabaseClient";

export function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) setError(error.message);
      else setTasks(data);

      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}
```

**The SDK does not throw.** Every call resolves to `{ data, error }`. If you
skip the `error` branch, a failure looks like an empty list and the user sees a
blank page with no explanation. Always handle it.

The effect runs only in the browser, so the server-rendered HTML shows the
loading state. That is expected.

## Loading before the route renders

Use a `clientLoader` when a route should not render until its data is there:

```tsx
// src/routes/tasks.tsx
import type { Route } from "./+types/tasks";
import { supabase } from "@/lib/customSupabaseClient";

export async function clientLoader() {
  const { data, error } = await supabase.from("tasks").select("*");

  if (error) throw new Response(error.message, { status: 500 });

  return { tasks: data };
}
clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <p>Loading…</p>;
}

export default function Tasks({ loaderData }: Route.ComponentProps) {
  return <ul>{loaderData.tasks.map((task) => <li key={task.id}>{task.title}</li>)}</ul>;
}
```

## Public content in a server loader

A server `loader` may read data that is the same for every visitor and must be
in the HTML for search engines — a public product catalogue, published blog
posts. The query runs as the anonymous role, so the table needs a public
`select` policy.

```tsx
export async function loader() {
  const { data, error } = await supabase
    .from("posts")
    .select("slug, title, excerpt")
    .eq("published", true);

  if (error) throw new Response(error.message, { status: 500 });

  return { posts: data };
}
```

The response is cached at the edge, so an edit in the database can take a
while to appear on the published page. When the content changes often, or the
user expects to see their own edit immediately, read it in the browser
instead.

## Writing rows

```js
const { data, error } = await supabase
  .from("tasks")
  .insert({ title, user_id: user.id })
  .select()
  .single();
```

- Writes run in the browser (event handler or `clientAction`), where the
  session is.
- `.select()` after an insert returns the created row; without it `data` is
  `null`.
- `.single()` returns one object instead of a one-element array.
- Set `user_id` from the signed-in user (`useAuth().user.id`) whenever the
  table is owner-scoped — the RLS policy will reject the insert otherwise.

Update and delete:

```js
await supabase.from("tasks").update({ done: true }).eq("id", taskId);
await supabase.from("tasks").delete().eq("id", taskId);
```

Always constrain an update or delete with `.eq(...)` / `.match(...)`. An
unfiltered `update` or `delete` targets every row the policy allows.

## Common query patterns

```js
// Filtering
.eq("status", "active")
.neq("status", "archived")
.gt("price", 10)
.in("category", ["a", "b"])
.ilike("title", `%${term}%`)   // case-insensitive contains

// Shaping
.select("id, title, created_at")
.order("created_at", { ascending: false })
.limit(20)
.range(0, 19)                  // pagination, inclusive

// Joins across a foreign key
.select("*, profiles(display_name, avatar_url)")

// One row or null (does NOT error when nothing matches)
.maybeSingle()
```

Prefer `.maybeSingle()` over `.single()` when "no row" is a legal outcome —
`.single()` returns an error when the result set is empty.

## Counting

```js
const { count, error } = await supabase
  .from("tasks")
  .select("*", { count: "exact", head: true });
```

`head: true` skips the row payload and returns only the count.

## Realtime

```tsx
useEffect(() => {
  const channel = supabase
    .channel("tasks-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tasks" },
      (payload) => {
        // payload.eventType is INSERT | UPDATE | DELETE
        // payload.new / payload.old carry the row
      },
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, []);
```

Subscribe only inside an effect — never in a loader or at module scope, which
would open the channel on the server. Always remove the channel in the cleanup
function; a subscription that outlives the component leaks and fires into
unmounted state setters.

Realtime must be enabled for the table before events arrive:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
```

## File storage

```js
// Upload
const { error } = await supabase.storage
  .from("avatars")
  .upload(`${user.id}/${file.name}`, file, { upsert: true });

// Public URL (for a public bucket)
const { data } = supabase.storage.from("avatars").getPublicUrl(path);

// Signed URL (for a private bucket), valid 60s
const { data } = await supabase.storage
  .from("avatars")
  .createSignedUrl(path, 60);
```

Buckets are created with SQL — see `supabase/references/CHANGING_THE_DATABASE.md`.
Do not assume a bucket exists; check `<supabase_schema>` or create it.

## RLS is the reason a query returns nothing

When a select returns `[]` and no error, or an insert fails with a policy
message, the cause is almost always Row Level Security, not the query. Read the
table's policies in `<supabase_schema>` before rewriting the React code — the
fix usually belongs in SQL. See `supabase/references/CHANGING_THE_DATABASE.md`.

A query that works in the browser but returns nothing from a server `loader`
is the same cause: the loader runs as the anonymous role.

## When to add an edge function instead

Move the work server-side only when it needs one of these:

- A secret API key (Stripe, SendGrid, OpenAI, Twilio …) that must not reach the
  browser.
- A webhook receiver an external service calls.
- Orchestration across several systems in one request.

Plain CRUD and auth never need one. See
`supabase/references/EDGE_FUNCTIONS.md`.
