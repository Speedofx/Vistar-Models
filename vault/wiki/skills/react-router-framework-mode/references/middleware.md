---
title: Middleware & Context API
description: Server and client middleware, context API for sharing data
tags: [middleware, context, authentication, logging, request-processing]
---

# Middleware & Context API

Middleware is always enabled in React Router v8 — no future flag or
`react-router.config.ts` change is needed.

**Template note:** `/api/*` resource routes in this app already get rate
limiting, security headers, request logging, and a single error shape from
`withApi` (`src/lib/api.server.ts`). Do not reimplement those concerns as
middleware. Middleware is for page-route concerns: per-request context,
response headers on documents, logging, redirects.

**Auth does NOT belong in server middleware.** Published sites edge-cache
every GET response by URL and replay it to all visitors, so middleware must
never read the `Cookie` header (or any session) to change what a page
returns — the first user's page would be cached and served to everyone.
Auth guards live in `clientLoader` via `requireAuth()` — see
`references/sessions.md` for the platform rule and the safe patterns.

## Overview

Middleware runs code before and after response generation. Executes in a nested chain: parent → child on the way down, child → parent on the way up.

```
Root middleware start
  Parent middleware start
    Child middleware start
      → Run loaders, generate Response
    Child middleware end
  Parent middleware end
Root middleware end
```

## Basic Middleware

```tsx
import type { Route } from "./+types/blog";
import { redirect } from "react-router";

// Redirect a retired URL scheme. Depends only on the URL — the same
// response for every visitor, so it is safe under the edge cache.
async function legacyPathMiddleware({ request }: Route.MiddlewareArgs) {
  const { pathname } = new URL(request.url);
  if (pathname.startsWith("/posts/")) {
    throw redirect(pathname.replace("/posts/", "/blog/"), 301);
  }
}

export const middleware: Route.MiddlewareFunction[] = [legacyPathMiddleware];
```

### The `next` Function

Call `next()` to continue the chain and get the response:

```tsx
async function loggingMiddleware(
  { request }: Route.MiddlewareArgs,
  next: Route.MiddlewareNext,
) {
  console.log(`→ ${request.method} ${request.url}`);

  const response = await next();

  console.log(`← ${response.status}`);
  return response;
}
```

- Call `next()` only once
- If you don't need post-processing, skip calling `next()` (called automatically)
- `next()` never throws—errors return as error responses

## Context API

Create typed context to share data between middleware and loaders/actions:

```tsx
// src/context.ts
import { createContext } from "react-router";

export const requestIdContext = createContext<string>();
export const dbContext = createContext<Database>();
```

Context values set in server middleware feed loaders that shape cached GET
responses, so derive them from the URL, the environment, or shared
services — never from the request's `Cookie` header (see the template note
above).

### Setting Context in Middleware

```tsx
import { requestIdContext } from "@/context";

async function requestIdMiddleware({ context }: Route.MiddlewareArgs) {
  context.set(requestIdContext, crypto.randomUUID());
}

export const middleware: Route.MiddlewareFunction[] = [requestIdMiddleware];
```

### Reading Context in Loaders/Actions

```tsx
import { requestIdContext } from "@/context";

export async function loader({ context }: Route.LoaderArgs) {
  const requestId = context.get(requestIdContext);
  logger.info(`loading dashboard [${requestId}]`);
  return { articles: await getArticles() };
}

export async function action({ context }: Route.ActionArgs) {
  const requestId = context.get(requestIdContext);
  // available here too
}
```

The `context` parameter is a `RouterContextProvider` instance — always use
`createContext` + `context.get`/`context.set`, never write arbitrary fields
onto it.

## Server vs Client Middleware

**Server middleware** (`middleware`) runs on document requests and `.data` fetches:

```tsx
export const middleware: Route.MiddlewareFunction[] = [
  async ({ request, context }, next) => {
    // Runs on server
    const response = await next();
    return response;
  },
];
```

**Client middleware** (`clientMiddleware`) runs on client-side navigations:

```tsx
export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ context }, next) => {
    // Runs in browser
    const start = performance.now();
    await next();
    console.log(`Navigation: ${performance.now() - start}ms`);
  },
];
```

## When Server Middleware Runs

| Request Type                     | Middleware Runs?      |
| -------------------------------- | --------------------- |
| Document request (`GET /route`)  | Always                |
| Client navigation with loader    | Yes (`.data` request) |
| Client navigation without loader | No                    |

To force middleware on routes without loaders, add an empty loader:

```tsx
export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader() {
  return null;
}
```

## Common Patterns

### Authentication

Do NOT implement auth as server middleware in this template. A middleware
that reads a session/cookie and changes the page response puts the first
user's page into the shared edge cache for every visitor — a cross-user
data leak. Guard routes in the browser instead:

```tsx
// the safe guard — see references/sessions.md for the full pattern
import { requireAuth } from "@/lib/require-auth";

export function clientLoader() {
  return { user: requireAuth() };
}
clientLoader.hydrate = true as const;
```

Server-side auth checks are allowed only for POSTs (`action`s), which are
never cached — see Conditional Execution below.

### Request Logging

```tsx
async function loggingMiddleware(
  { request }: Route.MiddlewareArgs,
  next: Route.MiddlewareNext,
) {
  const id = crypto.randomUUID();
  const start = performance.now();

  console.log(`[${id}] ${request.method} ${request.url}`);
  const response = await next();
  console.log(`[${id}] ${response.status} (${performance.now() - start}ms)`);

  return response;
}
```

### Response Headers

```tsx
async function cacheHeaders(
  _: Route.MiddlewareArgs,
  next: Route.MiddlewareNext,
) {
  const response = await next();
  response.headers.set("Cache-Control", "no-store");
  return response;
}
```

Note: on published domains the platform rewrites `Cache-Control` on page,
`.data`, and `/api/*` GET responses, so never rely on this header to keep
per-user output out of the shared cache — such output must not exist in
GET responses at all (see `references/sessions.md`).

Never set framing or CSP headers (`X-Frame-Options`, `frame-ancestors`) on
page responses in this template — the site must stay embeddable in the preview
iframe. API responses already carry security headers via `withApi`.

### 404 Fallback

```tsx
async function cmsFallback(
  { request }: Route.MiddlewareArgs,
  next: Route.MiddlewareNext,
) {
  const response = await next();

  if (response.status === 404) {
    const target = await checkCmsRedirects(request.url);
    if (target) throw redirect(target, 302);
  }

  return response;
}
```

### Conditional Execution

```tsx
export const middleware: Route.MiddlewareFunction[] = [
  async ({ request, context }, next) => {
    if (request.method === "POST") {
      await verifyCaller(request, context); // e.g. validate a token against PocketBase
    }
    return next();
  },
];
```

The `POST`-only gate is what makes a server-side caller check acceptable
here: POST responses are never cached, so per-caller behavior cannot leak.
Never widen such a check to GETs.

## Error Handling

Errors bubble to the nearest `ErrorBoundary`. The `next()` function always returns a response (never throws):

```tsx
export const middleware: Route.MiddlewareFunction[] = [
  async (_, next) => {
    const response = await next();
    // response.status = 500 if child threw
    // Can still set headers, commit sessions, etc.
    return response;
  },
];
```

- Error **before** `next()`: Bubbles to highest route with a loader
- Error **after** `next()`: Bubbles from the throwing route

## See Also

- [React Router Middleware Documentation](https://reactrouter.com/how-to/middleware)
- `references/sessions.md` - The platform caching rule and the client-side auth patterns
