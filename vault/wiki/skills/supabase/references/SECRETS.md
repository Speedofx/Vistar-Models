# Supabase Secrets (API Keys)

Load this reference when the user hands you an API key, or when a feature needs
one (Stripe, SendGrid, Twilio, OpenAI, a weather API, any paid service).

## The rule

A secret goes into the Supabase secret store with `set_supabase_secret` and is
read inside an edge function with `Deno.env.get(...)`. It never touches
`apps/web`.

That includes `apps/web/.env`. The framework-mode skill describes server-side
keys in `.env` read by `/api/*` resource routes; that path is not used on a
Supabase site. One store, one place that reads it — the edge function — so a
later task never has to guess where a key lives.

Anything a `VITE_*` variable or client code touches ships to the browser.
There is no such thing as a hidden value in frontend code.

## Storing a key

Call `set_supabase_secret` with the name and value:

```text
name: SENDGRID_API_KEY
value: SG.xxxxxxxxxxxxxxxxxxxx
```

Conventions:

- Uppercase with underscores: `STRIPE_SECRET_KEY`, `OPENAI_API_KEY`.
- Name it after the service, not the feature — `SENDGRID_API_KEY`, not
  `EMAIL_KEY`.
- Setting an existing name overwrites it.

Store the secret before deploying the function that reads it, so the first
invocation already has it.

Never echo the value back in chat, never write it into a file, and never put it
in a code comment. The user pasted it once; confirm it is stored, not what it
is.

## Reading a key

Only inside an edge function:

```ts
const apiKey = Deno.env.get("SENDGRID_API_KEY");
```

Always handle absence with a graceful state, never a throw:

```ts
if (!apiKey) {
  return new Response(
    JSON.stringify({ error: "Email is not configured yet." }),
    { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}
```

A missing user-supplied key is an expected state, not a bug — the user may not
have sent it yet. Throwing turns every request into a 500 that cannot be
auto-fixed; a 503 with a clear message lets the rest of the site work.

## What is already available

These exist in every function's environment. Do not set them and do not ask the
user for them:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

The anon key and project URL are also already in
`apps/web/src/lib/customSupabaseClient.js` for the frontend. Neither is a
secret; the service role key is, and must never leave a function.

## Which keys are public

Some services split their keys. The publishable half belongs in the frontend,
the secret half in a secret:

- Stripe: `pk_live_…` is publishable and may sit in frontend code;
  `sk_live_…` is secret and only a function may see it.
- Most other services issue one key and it is secret.

When unsure, treat it as secret.

## Listing what exists

The names of stored secrets appear in the `<supabase_schema>` block injected
into your context — names only, never values. Check there before asking the user
for a key they already provided.

## When the user has not given you the key yet

Build the feature end to end with the not-configured branch above, deploy it,
and tell the user in your final message exactly which key you need and where to
get it. Do not stub the integration with fake data and do not leave a
placeholder string like `"YOUR_API_KEY_HERE"` in the source.

## Pitfalls

- **A key in `apps/web/.env` read by a `/api/*` route** → wrong store on a
  Supabase site. Use `set_supabase_secret` and an edge function.
- **`VITE_STRIPE_SECRET_KEY`** → published in the bundle.
- **A key in the function source** → the source is committed to this repo.
- **`throw` on a missing key** → 500 on every request; use a 503 with a message.
- **Echoing the value in chat or a summary** → leaks it into the conversation
  history.
- **`process.env`** → functions run on Deno. Use `Deno.env.get(...)`.
- **Asking the user for `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_URL`** → both
  are already present.
- **Reading a secret in React and passing it to the function** → the point of
  the secret is that the browser never has it.
