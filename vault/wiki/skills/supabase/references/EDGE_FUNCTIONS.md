# Supabase Edge Functions

Load this reference when the task needs server-side execution: a 3rd-party API
call with a secret key, a webhook receiver, or orchestration the browser must
not do.

Do NOT reach for a function for plain CRUD or auth — React talks to Supabase
directly for those. See `supabase/references/USING_IN_REACT.md`.

On a Supabase site this is where server-side work goes. Do not write a React
Router `/api/*` resource route or read `apps/web/.env` for it, even though the
framework-mode skill describes that path: secrets live in the Supabase secret
store, and only a function can read them.

## The workflow

1. Write the source to `supabase/functions/<name>/index.ts` with `write_file`.
2. Store any API key it needs with `set_supabase_secret`.
3. Deploy it with `deploy_supabase_edge_function`, passing `<name>`.
4. Call it from React with `supabase.functions.invoke('<name>')`.

The file in this repo is the source of truth — it is versioned with the rest of
the code, so a later task can read and edit it. The deploy tool reads that exact
path, so the file must exist and be saved before you deploy.

Use a lowercase, hyphenated `<name>`: `send-email`, `handle-payment`,
`api-leads`.

## The minimum function

```ts
// supabase/functions/hello-world/index.ts
import { corsHeaders } from "./cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  return new Response(JSON.stringify({ message: "Hello, world!" }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
```

Two non-negotiables, both invisible until the browser calls the function:

1. **`import { corsHeaders } from "./cors.ts";`** — write the import and the
   platform puts `cors.ts` next to your function on deploy, both in the
   deployment and in the repo. It only does so when the source contains that
   exact import. Never write or edit `cors.ts` yourself and never inline the
   headers.
2. **Answer the `OPTIONS` preflight.** Without it the browser rejects every
   `invoke()` before your handler runs, while curl works fine.

Spread `corsHeaders` into every response you return, including error responses.

## A function that uses a secret

```ts
// supabase/functions/send-email/index.ts
import { corsHeaders } from "./cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const apiKey = Deno.env.get("SENDGRID_API_KEY");

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Email is not configured yet." }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const { to, subject, body } = await req.json();

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: "noreply@example.com" },
        subject,
        content: [{ type: "text/plain", value: body }],
      }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Upstream rejected the request." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

Return a graceful "not configured" state when a user-supplied key is missing —
never `throw` on it. The user is asked for the key in chat; until it arrives the
feature must degrade, not 500. See `supabase/references/SECRETS.md`.

## Reading the database from a function

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are always present in the
function environment — you do not set them.

```ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./cors.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);
```

The service role key **bypasses RLS**. Only use it for work the user is not
allowed to do directly, and never return rows the caller should not see. If the
function should act as the calling user instead, forward their token:

```ts
const authHeader = req.headers.get("Authorization")!;
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!,
  { global: { headers: { Authorization: authHeader } } },
);
```

Never import `@/lib/customSupabaseClient` in a function — that file is frontend
code and the path does not resolve in Deno.

## Calling it from React

Call it from the browser — an event handler, an effect, or a `clientAction` —
so the request carries the visitor's session. Never call a function from a
server `loader`: the server has no session, and the published site caches
every GET response for all visitors.

```js
import { supabase } from "@/lib/customSupabaseClient";

const { data, error } = await supabase.functions.invoke("send-email", {
  body: { to, subject, body },
});

if (error) {
  // surface a message to the user
}
```

**The name in `invoke()` must equal the directory name** —
`supabase/functions/send-email/index.ts` is `invoke("send-email")`. A mismatch
is a runtime 404 that nothing catches at build time.

Pass `body` as a plain object. The SDK serializes it; `JSON.stringify` on top
sends a JSON-encoded string and `await req.json()` then yields a string instead
of your object.

`invoke` resolves to `{ data, error }` like every other SDK call, and `error` is
set for any non-2xx response.

## Webhooks

An external service calling your function cannot send a Supabase JWT, so verify
the caller yourself with a shared secret and read the raw body:

```ts
const signature = req.headers.get("x-webhook-signature");
if (signature !== Deno.env.get("WEBHOOK_SECRET")) {
  return new Response("Unauthorized", { status: 401, headers: corsHeaders });
}

const raw = await req.text(); // signature checks need the exact bytes
```

Read the body once. `req.json()` after `req.text()` throws — the stream is
consumed.

## Editing an existing function

Read `supabase/functions/<name>/index.ts`, edit it, then deploy again. Deploying
replaces the live version. There is no version history and no rollback, so keep
the change small and verify the whole handler still returns CORS headers on
every path.

## Pitfalls

- **Missing `./cors.ts` import** → the shared file is neither attached nor
  written to the repo, and the browser cannot call the function.
- **No `OPTIONS` branch** → works in curl, fails in the browser.
- **Missing `corsHeaders` on the error path** → failures surface as opaque CORS
  errors instead of your message.
- **`invoke()` name ≠ directory name** → 404.
- **`JSON.stringify` inside `body`** → double-encoded payload.
- **Deploying before writing the file** → the tool has nothing to read.
- **Service role key returned to the browser, or used when the anon key would
  do** → it bypasses RLS.
- **Node APIs** (`process.env`, `require`, `fs`) → this is Deno. Use
  `Deno.env.get(...)` and URL imports.
- **A key hardcoded in the function source** → use a secret. The source is
  committed to the repo.
- **Scheduled or recurring work** → not supported here. Trigger the function
  from a user action or an external caller.
- **A `/api/*` resource route with a key in `apps/web/.env`** → wrong tier on a
  Supabase site. Write an edge function and store the key with
  `set_supabase_secret`.
- **`invoke()` inside a server `loader`** → no session on the server, and the
  cached response is served to every visitor. Invoke from the browser.
