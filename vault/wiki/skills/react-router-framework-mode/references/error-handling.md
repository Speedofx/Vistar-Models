---
title: Error Handling
description: ErrorBoundary, error responses, isRouteErrorResponse, error reporting
tags: [errors, ErrorBoundary, useRouteError, isRouteErrorResponse, 404, 500]
---

# Error Handling

React Router catches errors in loaders, actions, and rendering, then displays them in error boundaries.

## ErrorBoundary Export

Export an `ErrorBoundary` from any route module:

```tsx
import { isRouteErrorResponse, useRouteError } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        {process.env.NODE_ENV === "development" && <pre>{error.stack}</pre>}
      </div>
    );
  }

  return <h1>Unknown Error</h1>;
}
```

## Throwing Responses

Throw Response objects for expected errors:

```tsx
export async function loader({ params }: Route.LoaderArgs) {
  const product = await db.getProduct(params.id);

  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }

  return product;
}
```

Use the `data` helper for structured error data:

```tsx
import { data } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const product = await db.getProduct(params.id);

  if (!product) {
    throw data(
      { message: "Product not found", productId: params.id },
      { status: 404 },
    );
  }

  return product;
}
```

## isRouteErrorResponse

Check if an error is a Response thrown from a loader/action:

```tsx
import { isRouteErrorResponse, useRouteError } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    // This was a Response thrown intentionally
    // error.status, error.statusText, error.data are available
    return <NotFoundPage />;
  }

  // This was an unexpected error
  return <GenericErrorPage />;
}
```

## Error Bubbling

Errors bubble up to the nearest ErrorBoundary:

```
root.tsx (has ErrorBoundary)
└── products.tsx (no ErrorBoundary)
    └── product.$handle.tsx (has ErrorBoundary)
```

- Error in `product.$handle.tsx` → caught by `product.$handle.tsx`
- Error in `products.tsx` → caught by `root.tsx`

## Root Error Boundary

Always define an ErrorBoundary in your root route as a last resort:

```tsx
// src/root.tsx
export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html>
      <head>
        <title>Oops!</title>
      </head>
      <body>
        <h1>Something went wrong</h1>
        {isRouteErrorResponse(error) ? (
          <p>
            {error.status}: {error.data}
          </p>
        ) : (
          <p>An unexpected error occurred</p>
        )}
      </body>
    </html>
  );
}
```

## Error Reporting

`src/entry.server.tsx` is template-owned and read-only — never reveal
`entry.server` (a bare `npx react-router reveal` writes it too; only
`npx react-router reveal entry.client` is allowed), and never create or edit
the file. The shipped entry appends React component stacks to server render
errors, and the runtime plugin reports them to the editor — loader and render
failures surface without extra wiring. For logging in your own code, use
`console.error` in the loader or action that owns the failure.

## Validation Errors (Not Error Boundaries)

For form validation, return errors from the action instead of throwing:

```tsx
import { data } from "react-router";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString() ?? "";

  if (!email.includes("@")) {
    return data({ errors: { email: "Invalid email" } }, { status: 400 });
  }

  // Success
  await createUser({ email });
  return redirect("/welcome");
}
```

Access in component via `fetcher.data`:

```tsx
function SignupForm() {
  const fetcher = useFetcher();
  const errors = fetcher.data?.errors;

  return (
    <fetcher.Form method="post">
      <input type="email" name="email" />
      {errors?.email && <span className="error">{errors.email}</span>}
      <button>Sign Up</button>
    </fetcher.Form>
  );
}
```

## Production vs Development

In production, error messages are sanitized to prevent leaking sensitive info. Full error details are only shown in development.
