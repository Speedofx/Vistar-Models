---
title: Special Files
description: root.tsx, routes.ts, react-router.config.ts, entry files, and module conventions
tags: [root.tsx, routes.ts, config, entry, .server, .client, special-files]
---

# Special Files

React Router framework mode uses several special files with specific purposes.

## Quick Reference

| File                     | Required | Purpose                                              |
| ------------------------ | -------- | ---------------------------------------------------- |
| `src/root.tsx`           | Yes      | Root route rendering the HTML document               |
| `src/routes.ts`          | Yes      | Route configuration (see [routing.md](./routing.md)) |
| `react-router.config.ts` | No       | Framework configuration (SSR, prerender, etc.)       |
| `src/entry.client.tsx`   | No       | Client-side hydration entry point                    |
| `src/entry.server.tsx`   | No       | Server rendering entry — template-owned, read-only   |
| `*.server.ts`            | No       | Server-only modules (excluded from client)           |
| `*.client.ts`            | No       | Client-only modules (excluded from server)           |

---

## root.tsx (Required)

**`src/root.tsx` is the only required route** - it's the parent to all routes and renders the root `<html>` document.

### What Belongs in root.tsx

| Element                                | Why                                                           |
| -------------------------------------- | ------------------------------------------------------------- |
| `<html>`, `<head>`, `<body>`           | Document structure — `<html lang>` is set here and nowhere else |
| `<Meta />`, `<Links />`                | Route meta/links aggregation                                  |
| `<Scripts />`, `<ScrollRestoration />` | React Router runtime                                          |
| `<HorizonsPreviewScripts />`           | Platform preview and site banner — keep it                    |
| `<Outlet />`                           | Child route rendering                                         |
| Global navigation                      | Appears on every page                                         |
| Global footer                          | Appears on every page                                         |
| Context providers                      | Available to all routes                                       |
| Stylesheets/fonts                      | Loaded once, cached                                           |
| Global error boundary                  | Catches app-wide errors                                       |
| Loading indicators                     | Show during navigation (see [pending-ui.md](./pending-ui.md)) |

`<HorizonsPreviewScripts />` comes from a platform-owned module that is not part
of the codebase you see. Keep the element and its import in place when you edit
`Layout`: without it the in-editor preview stops responding and the site banner
disappears.

### Document Language

The `<html lang>` attribute in the `Layout` export of `src/root.tsx` is part of
the content: it holds the BCP 47 tag of the language the copy is written in. It
is not self-maintaining — read its current value whenever you write or translate
copy, and correct it in that same change if it disagrees. Screen readers choose
a voice from it, browsers offer translation based on it, and crawlers read it in
the served HTML before any JS runs. A route's `meta` export cannot set it.

A single-language site hardcodes the tag. Add a region subtag only when the copy
is written for that region (`pt-BR` for Brazilian Portuguese, plain `pt`
otherwise).

#### Several Languages

Give every language its own URL — `/` for the default one and a locale segment
for each of the others (`/<locale>/...`) — and derive `lang` from the URL. A
client-side toggle that swaps copy without changing the URL cannot be indexed,
and it leaves `lang` describing a language that is no longer on screen.

Fill `LOCALES` with the tags the site actually serves; the two below stand in
for whatever those are.

```tsx
// src/root.tsx
import { useLocation } from 'react-router';
import { localeFromPathname } from '@/lib/i18n';

export function Layout({ children }: { children: React.ReactNode }) {
	const { pathname } = useLocation();

	return (
		<html lang={localeFromPathname(pathname)}>
			{/* ...unchanged head and body... */}
		</html>
	);
}
```

```ts
// src/lib/i18n.ts
export const DEFAULT_LOCALE = 'en';
export const LOCALES = ['en', 'de'] as const;

export type Locale = (typeof LOCALES)[number];

export function localeFromPathname(pathname: string): Locale {
	const segment = pathname.split('/')[1] as Locale;

	return LOCALES.includes(segment) ? segment : DEFAULT_LOCALE;
}
```

`useLocation()` is safe in `Layout`: it renders inside the router on every path,
including a 404 and an `ErrorBoundary` render.

In the same change:

- Register the prefixed URLs in `src/routes.ts` so each language is a real,
  linkable, crawlable route — not a state toggle.
- Keep copy in per-locale modules (`src/data/i18n/<locale>.ts`) rather than
  ternaries inside components. Do not add an i18n npm package to a marketing
  site.
- Emit `hreflang` alternates from each page's `links` export and list every
  locale URL in `src/routes/sitemap.xml.ts` — see
  [seo-sitemap.md](./seo-sitemap.md).

### Basic root.tsx Structure

```tsx
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

### Using the Layout Export

The `Layout` export avoids duplicating the document shell across your component, `HydrateFallback`, and `ErrorBoundary`:

```tsx
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return <div>Something went wrong</div>;
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}
```

### Customizing root.tsx (Complete Example)

```tsx
import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
  useRouteLoaderData,
} from "react-router";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Global fonts go in root.tsx, not layout components */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";

  return (
    <div className="app-layout">
      {/* Global loading indicator */}
      {isNavigating && <ProgressBar />}

      {/* Global navigation */}
      <header className="app-header">
        <nav className="app-nav">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Products
          </NavLink>
        </nav>
      </header>

      {/* Page content */}
      <main className="app-main">
        <Outlet />
      </main>

      {/* Global footer */}
      <footer className="app-footer">
        © {new Date().getFullYear()} My App
      </footer>
    </div>
  );
}
```

**Note:** Be defensive in your `Layout` component since it renders the `ErrorBoundary`. Use `useRouteLoaderData("root")` instead of `useLoaderData` to handle cases where the loader threw. See [error-handling.md](./error-handling.md) for error boundary patterns.

---

## routes.ts (Required)

Defines the URL structure and maps URLs to route modules.

**For detailed routing patterns, see [routing.md](./routing.md).**

Quick example:

```ts
import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  index("./home.tsx"),
  route("about", "./about.tsx"),
  layout("./dashboard/layout.tsx", [
    route("dashboard", "./dashboard/index.tsx"),
    route("dashboard/settings", "./dashboard/settings.tsx"),
  ]),
] satisfies RouteConfig;
```

---

## react-router.config.ts (Optional)

Configures framework-level settings:

What this template actually ships. `appDirectory` and `buildDirectory` are set by the
platform, so the build output is `dist/apps/web`, not the framework default `build/`:

```ts
import type { Config } from '@react-router/dev/config';

export default {
	appDirectory: 'src',
	buildDirectory: '../../dist/apps/web',
	ssr: true,
} satisfies Config;
```

Other options the framework accepts, none of which are set here:

```ts
export default {
	// Pre-render routes at build time
	prerender: ['/', '/about', '/pricing'],

	// Base path for all routes
	basename: '/my-app',
} satisfies Config;
```

### Common Configuration Options

| Option              | Default   | Purpose                                        |
| ------------------- | --------- | ---------------------------------------------- |
| `ssr`               | `true`    | Enable server-side rendering                   |
| `prerender`         | `[]`      | Routes to pre-render as static HTML            |
| `basename`          | `"/"`     | Base URL path for all routes                   |
| `appDirectory`      | `"app"`   | Source directory (this template uses `"src"`)  |
| `buildDirectory`    | `"build"` | Build output (this template uses `dist/apps/web`) |
| `splitRouteModules` | `true`    | Split route module exports into smaller chunks |

Do not add a `future` block: all `future.v8_*` flags were removed in v8 (their
behavior is the default now).

### SPA Mode

Disable SSR for a single-page application:

```ts
export default {
  ssr: false,
} satisfies Config;
```

### Pre-rendering

Pre-render routes to static HTML at build time:

```ts
export default {
  async prerender({ getStaticPaths }) {
    const dynamicPaths = await getStaticPaths();
    return ["/", "/about", ...dynamicPaths];
  },
} satisfies Config;
```

---

## entry.client.tsx (Optional)

The browser entry point for hydrating server-rendered markup. React Router provides a default, but you can customize it:

```bash
npx react-router reveal entry.client
```

(Always name the entry — a bare `reveal` also writes `entry.server.tsx`, which
is template-owned and read-only.)

```tsx
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
```

**Use cases for customizing:**

- Initialize client-side libraries (analytics, error tracking)
- Add client-only providers
- Custom hydration logic

---

## entry.server.tsx (Read-Only)

The server entry point for rendering HTML responses. This template ships its
own `src/entry.server.tsx` — a streaming render with bot handling (`isbot`), a
stream timeout, and render-error reporting already wired. The file is
read-only: never run `npx react-router reveal`, and never create, replace, or
customize it.

---

## .server Modules

Files with the `.server.ts` suffix (e.g., `auth.server.ts`) are **server-only** and excluded from client bundles.

**Always use the filename suffix.** React Router also treats a `.server/`
directory as server-only, but this codebase never uses that convention — do
not create a `.server/` folder under any circumstance. One file, one
`.server.ts` suffix, in `src/lib/`:

```
src/
├── lib/
│   ├── db.server.ts      # Server-only
│   ├── auth.server.ts    # Server-only
│   └── format.ts         # Shared
```

**Use for:**

- Database connections
- Authentication utilities
- Environment variables/secrets
- Server-only APIs

```tsx
// db.server.ts
import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();
```

**Safety:** The build will fail if `.server` code accidentally ends up in the client bundle.

**Important:** Route modules should NOT use `.server` - they have special handling.

---

## .client Modules

Files with the `.client.ts` suffix (e.g., `analytics.client.ts`) are **client-only** and excluded from server bundles. Same rule as `.server`: always the filename suffix, never a `.client/` directory.

```
src/
├── lib/
│   ├── analytics.client.ts  # Client-only
│   ├── browser.client.ts    # Client-only
│   └── format.ts            # Shared
```

**Use for:**

- Browser-specific APIs (localStorage, navigator)
- Client-only libraries (charting, animations)
- Feature detection

```tsx
// analytics.client.ts
export function trackEvent(name: string) {
  window.gtag?.("event", name);
}
```

**Note:** Values exported from `.client` modules are `undefined` on the server. Only use them in `useEffect` or event handlers.

---

## Where to Place Stylesheets and Fonts

**Global styles and fonts belong in `root.tsx`**, not in layout components:

- Global fonts: In `root.tsx` `<head>` (see example above)
- Route-specific stylesheets: Use the `links` export in route modules (see [route-modules.md](./route-modules.md#links))

---

## Anti-Patterns

**Don't create a separate layout just for nav/footer** - put global UI in `root.tsx`.

**Don't use flat routes when nesting makes sense** - see [routing.md](./routing.md#layout-routes-use-them) for proper nested route patterns.

---

## See Also

- [routing.md](./routing.md) - Route configuration patterns
- [route-modules.md](./route-modules.md) - Route module exports
- [Official Documentation](https://reactrouter.com/explanation/special-files)
