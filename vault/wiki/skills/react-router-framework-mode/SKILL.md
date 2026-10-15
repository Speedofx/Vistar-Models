---
name: react-router-framework-mode
description: >
  Build full-stack React applications using React Router's framework mode.
  Use when configuring routes, working with loaders and actions, handling forms,
  handling navigation, pending/optimistic UI, error boundaries, or working with
  react-router.config.ts or other React Router conventions.
  Also use when adding, renaming, or removing public pages or collections
  (blog, journal, PDPs, products, articles), or when working with sitemap.xml,
  robots.txt, SEO, or GEO indexing.
license: MIT
---

# React Router Framework Mode

Framework mode is React Router's full-stack development experience with
explicit route configuration, server-side rendering, data loading and mutations,
and a type-safe route module API.

## Horizons conventions

This template sets `appDirectory: 'src'` in `react-router.config.ts`. All
route modules live under `apps/web/src/`, not `app/`. Prefer:

- `src/root.tsx`, `src/routes.ts`, `src/routes/*.tsx`
- Import DOM APIs from `react-router` (and `react-router/dom` only when needed).
  Do **not** import from `react-router-dom` — that package is gone in v8.
- Keep `ssr: true`. Do not disable SSR or enable SPA mode.
- Do not edit `react-router.config.ts` or `vite.config.ts`.
- Server-side work (3rd-party APIs, secrets, webhooks, superuser PocketBase)
  belongs in `/api/*` resource routes wrapped in `withApi` from
  `src/lib/api.server.ts` — see `references/api-routes.md`.
- Server-only modules always use the `.server.ts` suffix
  (`src/lib/<name>.server.ts`). Never create a `.server/` directory — React
  Router supports it, but this codebase does not use it under any circumstance.
- `<html lang>` in `src/root.tsx` holds the BCP 47 tag of the language the copy
  is written in. Check it whenever you write or translate copy and correct it in
  that same change; derive it from the URL when the site serves several
  languages — see `references/special-files.md`.
- Every public page exports `meta` built with `seo()` from `@/lib/seo` — it
  returns the title, description, canonical URL, Open Graph, Twitter and JSON-LD
  tags. Never hand-write those tags. See `references/seo-sitemap.md`.

## When to Apply

- Configuring new routes (`src/routes.ts`)
- Loading data with `loader` or `clientLoader`
- Handling mutations with `action` or `clientAction`
- Navigating with `<Link>`, `<NavLink>`, `<Form>`, `redirect`, and `useNavigate`
- Implementing pending/loading UI states
- Configuring SSR or pre-rendering (`react-router.config.ts`)
- Implementing authentication
- Building any public page (its `meta` export ships with it)
- Adding, renaming, or removing a public page (update `/sitemap.xml` in the same change)
- Adding or removing a public collection (blog, journal, PDPs, products, articles) — update `/sitemap.xml` in the same change

## References

Load the relevant reference for detailed guidance on the specific API/concept:

| Reference | Use When |
| ------------------------------------ | ----------------------------------------------------- |
| `references/routing.md` | Configuring routes, nested routes, dynamic segments |
| `references/route-modules.md` | Understanding all route module exports |
| `references/special-files.md` | Customizing root.tsx, adding global nav/footer, fonts, `<html lang>` and multilingual URLs |
| `references/data-loading.md` | Loading data with loaders, streaming, caching |
| `references/actions.md` | Handling forms, mutations, validation |
| `references/use-effect.md` | Before writing any `useEffect` — derived state, fetching, mutations, prop-driven resets all have better homes |
| `references/navigation.md` | Links, programmatic navigation, redirects |
| `references/pending-ui.md` | Loading states, optimistic UI |
| `references/error-handling.md` | Error boundaries, error reporting |
| `references/hydration.md` | Hydration mismatches: dates/locale formatting, `date-fns`, random values and ids, `typeof window`, localStorage/theme state, invalid nesting |
| `references/rendering-strategies.md` | SSR vs SPA vs pre-rendering configuration |
| `references/middleware.md` | Middleware and the context API: response headers, request context (NOT auth) |
| `references/sessions.md` | Authentication, login, protected routes — and why cookie sessions are forbidden here |
| `references/type-safety.md` | Auto-generated route types, type imports, type safety |
| `references/api-routes.md` | Server-side `/api/*` routes: 3rd-party calls, secrets, webhooks, rate limits, superuser PocketBase |
| `references/seo-sitemap.md` | Page metadata (`seo()`), structured data, public pages, blog posts, PDPs, `/sitemap.xml`, SEO/GEO indexing |

## Version Compatibility

This template pins React Router **8.3.0** (ESM-only) with React **19.2.7+**,
Node **22.22+**, and Vite **7**.

Everything that was behind a `future.v8_*` flag in v7 is default behavior in
v8: middleware is always enabled, the Vite Environment API is always on, the
raw incoming request is passed through to loaders/actions, and data-request
URLs are trailing-slash aware. `splitRouteModules` moved to a top-level config
option that defaults to `true`. Never add `future.v8_*` flags to
`react-router.config.ts` — v8 removed them.

## Critical Patterns

These are the most important patterns to follow. Load the relevant reference for full details.

### Server Output Must Be User-Agnostic (security)

Published sites edge-cache every GET response — HTML, `.data`, and `/api/*`
GETs — **by URL, for all visitors, ignoring cookies**, and the platform
overrides the app's `Cache-Control`. A `loader`, server `middleware`, or
`/api/*` GET that shapes its response from the request's `Cookie` or
`Authorization` header leaks the first user's data to everyone.

- Auth and personalization are client-side: `useAuth()` + `requireAuth()`
  in a `clientLoader`, per-user data fetched in the browser via the
  PocketBase client (that path is never cached).
- Never build cookie-session auth (`createCookieSessionStorage`), never
  read `Cookie` in a `loader`/server `middleware`, never store tokens in
  cookies.
- Per-user work that must run on the server goes in an `action` (POST —
  never cached), validating the caller inside the action.

See `references/sessions.md` for the full rule and patterns.

### Hydration-Safe Rendering

The first client render must produce exactly what the server rendered, or React
throws `Hydration failed because the server rendered text/HTML didn't match the
client` and re-renders the whole page from scratch. The server runs in UTC with
a fixed locale; the visitor's browser does not. In render:

- **No bare locale/timezone formatting** — `toLocaleDateString()` /
  `toLocaleTimeString()` / `toLocaleString()` always get an explicit locale
  and options (`timeZone` too when the output is server-rendered; omit it in
  client-only code that should use the visitor's zone). ESLint fails the build
  on bare calls, even inside effects and handlers. Lint cannot see `Intl.*Format`
  constructors, `date-fns` `format()`, local-time getters (`getDate()`,
  `getHours()`) or zone-less parsing — pass a locale and use UTC in render.
- **No `Date.now()`, current-time `new Date()`, `Math.random()` or generated
  ids** — compute in a `useEffect`, or in the `loader` when both renders must
  share the value; use `useId()` for element ids.
- **No `typeof window`, `import.meta.env.SSR` or `location.hash` branches** —
  use `useHydrated()` from `@/hooks/use-hydrated` (or `useIsMobile()` for
  viewport queries).
- **localStorage/auth/theme-derived UI renders its loading state first** — the
  server cannot read the browser's storage.

See `references/hydration.md` for the full patterns and debugging steps.

### useEffect Is a Last Resort

An effect is only for syncing with something React does not own. Before
writing one: derived values are computed in render, user actions go in event
handlers, route data goes in a `loader`/`clientLoader`, mutations go in an
`action` with `<Form>`/`useFetcher` (loaders revalidate automatically — no
refetch effect), and state that resets on a prop change uses `key`. A
`useEffect` fetch with wrong deps is how sites end up in infinite request
loops and rate-limit 429s. Every effect that remains needs a cleanup. See
`references/use-effect.md` before writing any `useEffect`.

### routes.ts Must Always Boot

`routes.ts` is evaluated at server start — one bad entry takes down every page,
not just one route. Two invariants:

- **Every `file` path points at a module that exists.** Create the module in
  the same change that adds its entry, and update `routes.ts` in the same
  change that deletes or renames a route module.
- **One route entry per file.** Route ids derive from the file path, so reusing
  a file in a second entry needs an explicit unique `id`
  (`route("start", "./routes/home.tsx", { id: "home-start" })`) — or better,
  one entry whose pattern covers both URLs (`route(":lang?/pricing", ...)`).

See `references/routing.md`.

### File Modularity

**Route modules compose, they never contain.** A route file holds `meta`,
`loader` / `action`, and a default export that assembles components — aim to
keep it under ~120 lines. Every page section is its own file:

```
src/routes/home.tsx               meta + loader + <Hero /> <Services /> <Contact />
src/components/home/hero.tsx      one section, one file
src/components/home/services.tsx
src/components/home/contact.tsx
src/components/site-footer.tsx    shared chrome, imported by root.tsx
src/data/services.ts              long static content arrays
src/lib/format.ts                 pure helpers, no JSX
```

- One exported component per file, kebab-case filename, imported through `@/`.
- Page-specific sections live in `src/components/<route>/`; anything two or more
  routes use lives directly in `src/components/`.
- **A route module default-exports its component; every other component is a
  named export.** Mixing the two is what produces React's "Element type is
  invalid … but got: undefined" at render time. This is a rule about components:
  `src/routes.ts` keeps the default export React Router requires, and a few
  shipped hooks and helpers (`@/hooks/use-auth`, `@/lib/pocketbase-client`) also
  carry a default alongside their named export — import all of them by name.
- Long static content — menu items, pricing tiers, FAQ entries, testimonials —
  lives in `src/data/<name>.ts`, not inline in the component that renders it.
- The names above are a landing-page example. App-first surfaces follow the same
  rule with their own vocabulary — `src/components/dashboard/usage-chart.tsx`,
  `src/components/settings/billing-panel.tsx`.
- A helper subcomponent used only by its parent may stay in the parent file
  while it is small (under ~40 lines) — extract it as soon as it is reused or grows.
- No barrel `index.ts` files; import the component's own path.

```tsx
// ✅ src/components/home/hero.tsx — a component, so a named export
export function Hero() { ... }

// ✅ src/routes/home.tsx — a route module, so the default export
import { Hero } from '@/components/home/hero';
import { Button } from '@/components/ui/button';
export default function Home() { return <Hero />; }

// ❌ a component default-exported outside src/routes/ and root.tsx
export default function Hero() { ... }

// ❌ a default import of a component, or a named import of a route module
import Hero from '@/components/home/hero';
import { Home } from '@/routes/home';
```

Two modules must never import each other, directly or through a third file:
the cycle leaves one side `undefined` at render time, and ESLint fails the
build on it. Lift the shared piece into its own file instead.

Two more sources of render-time `undefined` that lint and typecheck cannot see:

- **No component lookup by untyped string.** `const Icon = icons[name]` with a
  string from data types as `any`, and one wrong name crashes the page at
  render. Import each icon directly where it is used; when a data-driven lookup
  is genuinely needed, build an explicit `Record<..., LucideIcon>` from those
  imports, derive the key type from it, and render a fallback for a missing key.
- **Prefer the preinstalled dependencies.** A newly installed package can work
  in the browser yet resolve its default export to `undefined` under Node SSR
  (CJS/ESM interop that types do not reflect). When a new package is
  unavoidable, render its component once and load the page before building on
  top of it.

Never assemble a whole page (hero + services + testimonials + footer) inside its
route module. Decide the file split before writing TSX, not after. If a task
lands on a route file that already holds full sections, extract them into
component files as part of that task instead of appending to the pile.

See `references/route-modules.md` for a worked example.

### Forms & Mutations

**Search forms** - use `<Form method="get">`, NOT `onSubmit` with `setSearchParams`:

```tsx
// ✅ Correct
<Form method="get">
  <input name="q" />
</Form>

// ❌ Wrong - don't manually handle search params
<form onSubmit={(e) => { e.preventDefault(); setSearchParams(...) }}>
```

**Inline mutations** - use `useFetcher`, NOT `<Form>` (which causes page navigation):

```tsx
const fetcher = useFetcher();
const optimistic = fetcher.formData
  ? fetcher.formData.get("favorite") === "true"
  : isFavorite;

<fetcher.Form method="post" action={`/favorites/${id}`}>
  <button>{optimistic ? "★" : "☆"}</button>
</fetcher.Form>;
```

See `references/actions.md` for complete patterns.

### Layouts

**Global UI belongs in `root.tsx`** - don't create separate layout files for nav/footer:

```tsx
// src/root.tsx - add navigation, footer, providers here
export default function App() {
  return (
    <div>
      <nav>...</nav>
      <Outlet />
      <footer>...</footer>
    </div>
  );
}
```

**Use nested routes** for section-specific layouts. See `references/routing.md`.

### Route Module Exports

**`meta` uses `loaderData`**, not deprecated `data`:

```tsx
// ✅ Correct
export function meta({ loaderData }: Route.MetaArgs) { ... }

// ❌ Wrong - `data` is deprecated
export function meta({ data }: Route.MetaArgs) { ... }
```

Same for `useMatches()` — read `match.loaderData`, not `match.data`.

See `references/route-modules.md` for all exports.

### Page metadata (`meta` + `seo()`)

Every public page exports `meta` through `seo()`, in the change that creates it:

```tsx
import { seo } from '@/lib/seo';

export function meta({ matches, location }: Route.MetaArgs) {
	return seo({ matches, location }, {
		title: 'Journal',
		description: 'Fireside stories about the games that defined each decade.',
	});
}
```

That returns the title, description, canonical URL, Open Graph and Twitter tags,
plus any schema.org objects passed as `jsonLd`. Titles and descriptions are
unique per page. Never hand-write those tags, and keep the `loader` and
`headers` exports in `src/root.tsx` — they publish the origin `seo()` builds
absolute URLs from.

### Sitemap (`/sitemap.xml`)

React Router does **not** generate sitemaps. Update `src/routes/sitemap.xml.ts`
in the **same change** as any add, rename, or remove of a public page or
collection (blog, journal, PDPs, products, articles):

- Index paths (`/`, `/blog`, `/shop`) go in `STATIC_PATHS`
- One URL per public record goes in `getDynamicEntries()` (slug or product id + `lastmod`)
- Removing a collection also removes its index path and every record URL

Home-page journal cards and featured product cards are collections: give them
routes (including a PDP for each product) and sitemap URLs in that same change.
`getDynamicEntries()` stays `[]` only while the site has no public records.

A collection also earns a `/llms.txt` route, added in that same change — a blog,
journal, news section, docs, or a shop with product pages. Sites that are only
static marketing pages do not get one.

See `references/seo-sitemap.md`.

### Reading the URL in Loaders/Actions

**Use the `url` argument**, not `new URL(request.url)`. In v8 the raw incoming
request is passed through to loaders and actions, so on client-side
navigations `request.url` contains React Router internals (`.data` suffix,
`index`/`_routes` search params). The `url` argument is the normalized URL:

```tsx
// ✅ Correct
export async function loader({ url }: Route.LoaderArgs) {
  const query = url.searchParams.get("q");
}

// ❌ Wrong - can include a `.data` suffix on client navigations
export async function loader({ request }: Route.LoaderArgs) {
  const query = new URL(request.url).searchParams.get("q");
}
```

Keep using `request` for headers, body, and `request.signal` (but never
read the `Cookie` header in a loader — see `references/sessions.md`). In
`/api/*` resource routes (fetched directly at their own path) `request.url` is
already clean, so either works there.

## Further Documentation

If anything related to React Router is not covered in these references, you can search the official documentation:

https://reactrouter.com/docs
