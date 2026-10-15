---
title: Sessions, Cookies & Auth
description: Why cookie sessions leak user data on this platform, and the client-side auth patterns to use instead
tags: [sessions, cookies, authentication, login, logout, protected-routes]
---

# Sessions, Cookies & Auth

## The platform rule — read this first

Published Horizons sites sit behind a shared edge cache (CDN) with a fixed
policy the app cannot change:

- Every GET response the app serves — HTML documents, `.data` loader
  payloads, and `/api/*` resource-route GETs — is cached **by URL** for up
  to 7 days.
- The cache does **not** vary on `Cookie` or `Authorization`. A response
  cached for one visitor is replayed to every other visitor of that URL.
- The platform **rewrites the app's `Cache-Control` header** on these
  responses. Setting `no-store`, `private`, or `Vary` in the app does NOT
  opt out.

Consequence: **every GET response must be identical for every visitor.**
If a `loader`, server `middleware`, or `headers` export shapes a response
from the request's `Cookie` header (or any other per-user input), the
first signed-in user's response — including their private data — is
cached at the edge and served to everyone who visits that URL afterwards.
That is a real cross-user data leak, not a hypothetical.

Therefore, in this template:

- **NEVER** read `request.headers.get("Cookie")` — or any session built on
  it — in a `loader`, server `middleware`, or `headers` export.
- **NEVER** build authentication with `createCookieSessionStorage`,
  `createCookie`, or `Set-Cookie` headers. React Router documents these
  utilities, but they are unusable for auth on this platform.
- **NEVER** store an auth token in a cookie (not even mirrored from
  localStorage). If the server can see who is asking, it must still never
  answer differently — so a cookie token buys nothing and invites the leak.

What IS safe for per-user work:

| Channel | Why it is safe |
| --- | --- |
| `action`s and other POST requests | POST responses are never cached |
| Browser → PocketBase calls (`/hcgi/platform/*`) | Excluded from the edge cache (`no-store`) |
| Client-side state after hydration (`clientLoader`, hooks) | Runs in the visitor's own browser |

## Authentication in this template

Auth is client-side, built on PocketBase. The token lives in
`localStorage` (via `pb.authStore`), which the server cannot read — that
is what keeps server-rendered output identical for everyone and therefore
safe to cache.

Use the shipped helpers instead of building anything:

- `useAuth()` (`src/hooks/use-auth.ts`) — session state plus `login`,
  `signup`, `logout`.
- `requireAuth()` (`src/lib/require-auth.ts`) — guard for protected
  routes, called from a `clientLoader`.

Authorization lives in PocketBase collection access rules
(`@request.auth.id = owner`), enforced by PocketBase itself on every
record call — see the PocketBase skill.

### Protected route

The guard runs in `clientLoader` (browser), never in a server `loader`:

```tsx
// src/routes/dashboard.tsx
import type { Route } from "./+types/dashboard";
import { requireAuth } from "@/lib/require-auth";

export function clientLoader() {
  return { user: requireAuth() }; // redirects to /login when signed out
}
clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <div aria-hidden />; // keeps protected UI hidden pre-check
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return <p>Signed in as {loaderData.user.email}</p>;
}
```

Put the guard on a layout route to cover a whole section at once. The
server-rendered document for a protected route is the anonymous
`HydrateFallback` shell — identical for everyone, safe to cache.

### Login / logout

```tsx
// inside a component
const { user, isAuthed, isLoading, login, signup, logout } = useAuth();

await login(email, password);   // pb users auth, token → localStorage
await signup(email, password);  // create + auth
logout();                       // clears pb.authStore
```

Render on `isLoading` (spinner/skeleton) instead of the signed-out state,
or signed-in visitors see a "Sign in" flash on every hard load.

Give the login page the inverse guard, so already-signed-in visitors are
sent to the app instead of seeing the form again:

```tsx
// src/routes/login.tsx
import { redirect } from "react-router";
import pb from "@/lib/pocketbase-client";

export function clientLoader() {
  if (pb.authStore.isValid) throw redirect("/dashboard");
  return null;
}
clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return null; // avoids flashing the form for signed-in visitors
}
```

After a successful `login(...)` call, navigate with
`navigate(redirectTo, { replace: true })` so the login page is not left in
the history stack.

### Per-user data

Fetch it in the browser with the PocketBase client — after hydration or in
a `clientLoader` — never in a server `loader`:

```tsx
import pb from "@/lib/pocketbase-client";

// in an effect, clientLoader, or event handler
const entries = await pb.collection("backlog").getFullList({ sort: "-created" });
```

These calls carry the user's token from `pb.authStore`, go to
`/hcgi/platform/*` (never cached), and PocketBase access rules scope the
results to that user.

### Per-user work that must run on the server

Use an `action` (POST) — POST responses are never cached. Validate the
caller inside the action (e.g. verify a PocketBase token passed in the
request body or `Authorization` header against PocketBase). Never expose
the same data through a GET.

## Flash messages and preferences — without cookies

- One-time messages ("Saved!", "Invalid password"): return them from the
  `action`'s response and render from `actionData`, or use the toast hook —
  both are per-request/client-side, nothing is cached.
- User preferences (theme, layout): store in `localStorage` and apply on
  the client, or store per-user in a PocketBase collection. Never store a
  preference in a cookie that a `loader` reads — the first user's theme
  would be baked into the cached page for everyone.

## See Also

- `references/middleware.md` — what server middleware is still for
  (response headers on documents, request logging; NOT auth)
- `references/api-routes.md` — `/api/*` caching rules: per-user endpoints
  must be POST
- PocketBase skill — collections, access rules, `use-auth` details
- [React Router Sessions & Cookies documentation](https://reactrouter.com/explanation/sessions-and-cookies)
  — upstream cookie-session utilities; do not use them for auth or for
  anything a `loader`/`middleware` reads on this platform (see the rule at
  the top)
