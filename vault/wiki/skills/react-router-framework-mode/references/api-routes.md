# Server-Side API Routes (`/api/*`)

Load this reference when the task needs server-side work: calling a third-party
API, using a secret/API key, receiving a webhook, orchestrating multiple systems,
or reaching PocketBase with superuser privileges.

Server-side code runs in the same `react-router-serve` process that renders pages.
Endpoints are `/api/*` resource routes — route modules that export only a
`loader` / `action` and no component. There is no separate backend service.

## The health route ships with every app

`src/routes/api.health.ts` answers `GET /api/health` with `200 {"ok": true}`. It
is read-only, and it is the check for whether the app is healthy and listening.

Keep the file, keep `route('api/health', 'routes/api.health.ts')` in
`src/routes.ts`, and keep the response shape. Deleting the route, renaming it,
moving the URL, or putting anything in front of it (auth, a redirect, a
different body) makes a running site look down.

## Prefer loaders and actions over endpoints

Before adding an `/api/*` route, check whether the page's own `loader` / `action`
can do the work. A form that posts to its own route, or a page that fetches its
data in a `loader`, needs no endpoint at all — see `references/data-loading.md`
and `references/actions.md`.

Add an `/api/*` route when the caller is not a page: webhooks from third parties,
polling clients, or `useFetcher()` calls that don't belong to a page mutation.

## Caching: GET responses are shared between visitors (security)

Published sites edge-cache every `/api/*` **GET** response by URL for all
visitors, ignoring `Cookie` and `Authorization` headers — and the platform
overrides the app's `Cache-Control`, so the route cannot opt out. Two hard
rules follow:

- A GET endpoint must return the same response for every caller. Never
  read `Cookie`/`Authorization` (or otherwise identify the caller) in a
  GET handler — the first caller's response, including their private data,
  would be cached and served to everyone.
- Anything per-user, authenticated, or sensitive must be an **`action`
  (POST)** — POST responses are never cached. Validate the caller inside
  the action (e.g. verify a PocketBase token from the request against
  PocketBase). For plain per-user CRUD, prefer the browser PocketBase
  client instead — its `/hcgi/platform/*` calls bypass the cache and
  access rules already scope results to the caller.
- This applies even when the edge cache skips storing the authenticated
  response itself: **error responses are cached too**. One anonymous
  request answered 401 on an authenticated GET URL is cached and then
  served to every valid caller of that URL for up to 7 days, breaking the
  endpoint for everyone. POST avoids this entirely.

Note that cached also means **stale**: a public GET's response may be
served for up to 7 days after the underlying data changes.

See `references/sessions.md` for the full platform caching rule.

## The helper library

`src/lib/api.server.ts` applies the cross-cutting concerns a server would
normally handle in middleware. Every resource route handler MUST be wrapped in
`withApi`:

```ts
// src/routes/api.dogs.ts
import { apiError, json, withApi } from '@/lib/api.server';
import logger from '@/lib/logger.server';

export const loader = withApi(async ({ request }) => {
	const breed = new URL(request.url).searchParams.get('breed');

	// Input validation: returning a 4xx is correct.
	if (!breed) {
		return apiError(422, 'breed query param is required');
	}

	// Secrets are read per request, never at module scope.
	const apiKey = process.env.DOG_API_KEY;

	if (!apiKey) {
		throw new Error('DOG_API_KEY is not set in apps/web/.env');
	}

	const upstream = await fetch(`https://api.thedogapi.com/v1/breeds?q=${breed}`, {
		headers: { 'x-api-key': apiKey },
	});

	// fetch does NOT throw on 4xx/5xx — check and throw yourself.
	if (!upstream.ok) {
		throw new Error(`dog api failed: ${upstream.status} ${upstream.statusText}`);
	}

	logger.info('dog api ok', breed);

	return json(await upstream.json());
});
```

Register it in `src/routes.ts` — routing is explicit, the file alone does nothing:

```ts
route('api/dogs', 'routes/api.dogs.ts'),
```

`withApi` gives every handler:

- **Rate limiting** — 100 requests per 5 minutes per client IP (IPv6 callers are
  bucketed by /56), with `RateLimit-*` headers and a
  `429 {"error":"Too many requests, ..."}` body. It applies to every endpoint and
  is not configurable.
- **One error shape** — a thrown `Error` becomes
  `500 {"message":"Something went wrong!"}`, with `error.name` / `message` /
  `stack` included outside production. Errors are logged for you.
- **Security headers** — `nosniff`, `DENY` framing, a locked-down CSP, and
  `no-referrer` on API responses. Page responses are deliberately left alone so
  the site keeps working inside a preview iframe.
- **Response coercion** — return a `Response` from `json()`, or return a plain
  object and it is serialised for you.
- **Request logging** — one `[INFO] METHOD /path STATUS DURATIONms` line per
  request, so `pm2 logs` shows the traffic your endpoint received.

## Error handling contract

Work with `withApi`, not around it:

1. NEVER `try/catch` in order to convert a failure into a response. Let it throw.
2. NEVER build a 5xx yourself. `withApi` owns server-error responses.
3. Input validation is the one place a manual status is right:
   `return apiError(422, '...')`.
4. Every HTTP-failure throw must include BOTH `${response.status}` AND
   `${response.statusText}` — the numeric code alone makes failures hard to
   diagnose.
5. NEVER use `console.log` / `console.error`. Use `@/lib/logger.server` — it is
   server-only, so it never leaks into the browser bundle.

## Reading request bodies

`readJsonBody` and `readFormData` apply a 20MB limit, answering with `413` (too
large) or `400` (malformed JSON):

```ts
import { apiError, readJsonBody, withApi } from '@/lib/api.server';

export const action = withApi(async ({ request }) => {
	const { email } = await readJsonBody<{ email?: string }>(request);

	if (!email) {
		return apiError(422, 'email is required');
	}

	return { ok: true };
});
```

## Secrets

Read `process.env.NAME` **inside** the loader / action, never at module scope,
never in a client component, and never through `import.meta.env` or a
`VITE_`-prefixed name — those ship to the browser. New keys go in
`apps/web/.env`; never modify `../.h5g_env` (platform-managed, readable but not
writable by you).

Never return `process.env.*`, API keys, tokens, or other secrets in a loader,
action, or `json()` body, and never pass them through `loaderData` for the UI
to read. The response is serialized into the document and the client. Public
values (`WEBSITE_DOMAIN`, a page title) are fine. Use the secret only on the
server, then return the upstream result the page actually needs.

Env loading is handled by Node's built-in `--env-file-if-exists=.env` flag in the
`dev` and `start` scripts of `apps/web/package.json`. Do NOT add `dotenv`, do NOT
call `dotenv.config()`, and do NOT change those script flags. If
`process.env.YOUR_KEY` is undefined after `reload_app`, the cause is one of:

1. the key is missing or misspelled in `apps/web/.env`,
2. you are reading it under a different name, or
3. you did not `reload_app` after editing `.env`.

It is never an env-loading-path problem.

## CORS

Endpoints are same-origin — the pages and `/api/*` are served by one server, so
no CORS configuration is needed and cross-origin callers are denied by default.
If a third party genuinely must call an endpoint from another origin, set the
headers on that one response explicitly:

```ts
return json(data, { headers: { 'Access-Control-Allow-Origin': 'https://partner.example' } });
```

## Unknown routes

`src/routes/api.$.ts` answers any unmatched `/api/*` path with
`404 {"error":"Route not found"}` instead of React Router's HTML error document.
More specific routes always win, so registering `api/dogs` keeps working.

## Superuser PocketBase access

`src/lib/pocketbase-client.server.ts` exists only once PocketBase is enabled. It
authenticates as the PocketBase superuser
and therefore **bypasses collection access rules**. Use it only when the request
genuinely needs that: webhook handlers, third-party orchestration, or aggregation
across users' records. Anything acting on behalf of the signed-in user belongs in
the browser client, where PB rules do the authorization
(`pocketbase/references/USING_IN_REACT.md`).

```ts
import { readJsonBody, withApi } from '@/lib/api.server';
import { pocketbaseAdmin } from '@/lib/pocketbase-client.server';

export const action = withApi(async ({ request }) => {
	const event = await readJsonBody<{ id: string; amount: number }>(request);

	return pocketbaseAdmin.createRecord('payments', {
		stripe_id: event.id,
		amount: event.amount,
	});
});
```

Available: `listRecords`, `getRecord`, `createRecord`, `createRecords` (one
transaction), `updateRecord`, `deleteRecord`, `getFileToken`, and `send` for a
custom `pb_hooks` route the SDK has no method for. Authentication is lazy and
cached, so importing the module never blocks the server and a failed attempt is
retried on the next call.

It wraps the official `pocketbase` SDK, so a failed call throws the SDK's
`ClientResponseError` (`error.status`, `error.response`) rather than a plain
`Error` — catch that when you need to map a PocketBase failure onto a response.

Rules:

- NEVER call it from a component or a `clientLoader` — it is server-only.
- NEVER use superuser access for an operation that is supposed to be the calling
  user's own ("delete MY task"). Check ownership in the handler, or let the
  browser client do it under PB rules.
- NEVER put the superuser credentials in a response body or in client code.
- It requires PocketBase to be enabled. Without it, calls fail with
  `PB_SUPERUSER_EMAIL / PB_SUPERUSER_PASSWORD are not set`.

## Verify with curl after `reload_app`

Do not trust "the code looks right" — hit the route and read the response, both
the happy path and a failure path:

```bash
curl -sS -i "http://localhost:3000/api/dogs?breed=corgi"
curl -sS -i "http://localhost:3000/api/dogs"   # expect 422
```

## Common mistakes

- Forgetting to register the route in `src/routes.ts` — the file exists and the
  path still 404s (as JSON, from `api.$.ts`).
- Dropping `api.health.ts` or its `routes.ts` entry while reorganising routes —
  `/api/health` must keep answering `200 {"ok": true}`.
- Wrapping the handler in `try/catch` and returning a 500 — bypasses the shared
  error shape and the logging that comes with it.
- Reading a secret at module scope: it evaluates once at server start, so a
  later `.env` edit appears to have no effect until a full restart.
- Importing `@/lib/logger.server` or `@/lib/pocketbase-client.server` from a
  component — server-only modules must not enter the client bundle.
- Adding a global fetch to an external API from a component instead of a route:
  third-party calls and keys must stay on the server.
- Returning `process.env.NAME`, an API key, or a token from a loader / action /
  `json()` body — that value is serialized to the client. Return the upstream
  result, not the secret.
