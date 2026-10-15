# Stitch patterns

Load the React Router framework-mode skill before you apply these patterns.
This file covers only the migration mechanics.

## v2 → SSR replacements

These are decided. Do not re-evaluate them.

| Archived item | Live replacement | Action |
| ------------- | ---------------- | ------ |
| `react-router-dom` | `react-router` | Rewrite imports. Do not keep `react-router-dom`. |
| `Helmet` / `Seo.jsx` | `meta` via `seo()` | Drop Helmet. Use the route `meta` export. |
| Helmet title from client-fetched data (not store catalog) | `document.title` in the same `useEffect` as the fetch; route `meta` is the static fallback | Keep the fetch. Do not add a `clientLoader` for the title. Does **not** apply to store catalog pages. |
| `getProduct(id)` / `getProductByHandle` in a PDP `useEffect` | route `loader` + `getProductByHandle` | Fetch on the server so the HTML already contains the product. Pass `loaderData` into the staged page. Remove the catalog mount fetch. |
| Listing `getProducts` on mount (shop, grids, category) | listing route `loader` + `getProducts` | Same: HTML must ship the list. Keep `exclude_types: 'subscription'` on storefront listings. |
| Helmet / invented title on a product page | `meta` via `seo()` from `product.seo` (and Product JSON-LD) | Never `document.title`, never a `clientLoader`, for catalog HTML. See hostinger-ecommerce "Product pages carry the merchant's SEO". |
| `AuthContext` / `useAuth` | `@/hooks/use-auth` | Only when `apps/web/src/hooks/use-auth.ts` exists (PocketBase sites). Point imports at the shipped hook. Drop `AuthProvider`. Otherwise see "Custom auth" below. |
| `ProtectedRoute` | `clientLoader` + `requireAuth` + `HydrateFallback` | Only when `apps/web/src/lib/require-auth.ts` exists (PocketBase sites). Guard the route module. Import from `@/lib/require-auth`. Otherwise see "Custom auth" below. |
| `ScrollToTop` | `ScrollRestoration` | Already in root. Delete the old component. |
| `pocketbaseClient.js` | `@/lib/pocketbase-client` | Only when `apps/web/src/lib/pocketbase-client.ts` exists (PocketBase sites). Point imports at the shipped client. Otherwise keep the archived client or drop it with unused PocketBase code. |
| `use-mobile.jsx` / `use-toast.js` / `utils.js` | the `.ts` twin | Delete the JS copy. Keep the TypeScript file. |
| template `src/index.css` (DM Sans, gray tokens) | archived `src/index.css` | Copy the archive over the live file. See "Theme transfer". |
| template `tailwind.config.js` `theme.extend` | archived `theme.extend` keys | Merge `fontFamily`, `colors`, `keyframes`, `animation`, and every other key the archive adds. |
| `@import url(fonts.googleapis…)` in `index.css` / `<link>` fonts in `index.html` | `links` in `src/root.tsx` | Move the families to the root stylesheet link. Drop the `@import`. |
| `EcommerceApi.js` / `@/api/EcommerceApi` | `@/api/ecommerce-api` | Point imports at the injected typed client. Delete the staged JS copy. |
| `InternalEcommerceSubscriptionsApi.js` | `@/api/ecommerce-subscriptions-api` | Same. The Express endpoints it called are gone. |
| `integratedAiClient.js` | `@/api/integrated-ai-api` | Point imports at the injected client. Delete the staged JS copy. |
| `customSupabaseClient.js` | `@/lib/customSupabaseClient` | Supabase sites only. Keep it as is: read-only, same path. Do not convert it to TypeScript. |
| `SupabaseAuthContext` / its `useAuth` | `@/contexts/SupabaseAuthContext` | Supabase sites only. Keep the context and mount its `AuthProvider` in `root.tsx`. See "Supabase sites" below. |

## Route-module assembly

For each `web.routes[]` entry:

1. Create or replace `apps/web/src/routes/<name>.tsx`.
2. Move the page UI from the remapped `sourceComponent` into the route
   module `default` export, or into a component that the route module
   renders.
3. Register the path in `apps/web/src/routes.ts`.
4. Keep nested layouts when the archive used a shared chrome. Put shared
   chrome in `src/root.tsx` or a layout route. See framework-mode
   `special-files.md`.

Home (`/` or index) must show the archived landing page. Do not leave the
template placeholder.

Reuse the staged page file. A thin route module that default-exports or
renders `HomePage.jsx` (or the staged `components/HomePage.jsx`) is done.
Do not retype the page into a new `home-page.tsx` unless SSR forces a
change (Helmet → `meta`, `react-router-dom` → `react-router`, catalog
fetch → route `loader`).

If `web.routes[]` is empty, read `.migration/web-old/src/App.jsx` (or the
staged `App.jsx`) and assemble one module per `<Route>`.

## App shell (providers, layout, toaster)

The archived `App.jsx` wraps `<Routes>` in providers and chrome. That wrapper
tree is part of the product. Recreate it around `<Outlet />` in `src/root.tsx`
(or in a layout route) before you consider any page done:

- Context providers (auth, subscriptions, cart) in the same nesting order as
  the archive.
- The site layout component (header, footer, page frame).
- Global singletons: toaster, analytics scripts. `ScrollRestoration` in the
  template root already replaces a `ScrollToTop` component.

A missing provider does not fail the build. It fails at runtime, when the
first component calls the matching hook (`useCart`, `useSubscriptionAuth`)
outside its provider. Mount every provider whose hook is used anywhere in
`src/`.

Exception: PocketBase session uses the shipped `@/hooks/use-auth` hook.
It has no provider. Point archived `useAuth` / `AuthContext` imports at
that hook and drop `AuthProvider` / `ProtectedRoute`. Guard the route with
`clientLoader` + `requireAuth` + `HydrateFallback` from
`@/lib/require-auth` instead.

`@/hooks/use-auth`, `@/lib/require-auth`, and `@/lib/pocketbase-client`
ship only when PocketBase is enabled. Check that
`apps/web/src/lib/pocketbase-client.ts` exists before rewiring imports to
it; importing a missing file fails the build. Do not `npm install
pocketbase` to silence typecheck on sites that have no PocketBase.

### Custom auth (no PocketBase, no Supabase)

When neither `apps/web/src/hooks/use-auth.ts` nor
`apps/web/src/lib/customSupabaseClient.js` exists, the archived auth is the
site's own. Port it like any other staged code:

- Keep the archived `AuthContext` / `useAuth`, mount its `AuthProvider` in
  `src/root.tsx` like the other providers.
- Replace `ProtectedRoute` with a `clientLoader` in each guarded route
  module that checks the same session state and `redirect`s to the login
  route, plus a `HydrateFallback`. Write the guard locally — do not import
  `@/lib/require-auth`.

### Supabase sites

When `apps/web/src/lib/customSupabaseClient.js` exists, the site
authenticates with Supabase and the PocketBase exception above does not
apply. Load the `supabase` skill and follow it instead:

- Keep `apps/web/src/contexts/SupabaseAuthContext.jsx` where it is and keep
  every `useAuth` import pointing at `@/contexts/SupabaseAuthContext`.
- Mount its `AuthProvider` once, around `<Outlet />` in the `App` default
  export of `src/root.tsx`.
- Replace `ProtectedRoute` with the `clientLoader` session guard in
  `supabase/references/AUTH.md`. Do not import `@/lib/require-auth`.
- Move any Supabase query from a server `loader` into the browser unless it
  reads public content only. See `supabase/references/USING_IN_REACT.md`.

## Theme transfer (index.css, Tailwind, fonts)

The cutover marked `src/index.css`, `tailwind.config.js`, and `index.html`
as `replace-with-target`. The live tree therefore carries the template
theme, while every staged page still uses the archived classNames. Symptoms:
DM Sans instead of the product fonts, gray page background, `font-display`
or `text-accent` that resolve to nothing. Fix all four items below. They are
part of the stitch, not a redesign.

1. **Tokens.** Copy `.migration/web-old/src/index.css` over
   `apps/web/src/index.css` (`write_file` with the archived content). The
   template CSS in v2 and SSR is identical, so nothing is lost. Then delete
   any `@import url('https://fonts.googleapis.com/...')` line from the live
   file; fonts load through `root.tsx` (step 3).
2. **Tailwind theme.** Keep the live `apps/web/tailwind.config.js` file
   (ESM export, `tailwindcss-animate` plugin). Open
   `.migration/web-old/tailwind.config.js` and merge into the live
   `theme.extend` every key the archive has: `fontFamily`, extra `colors`,
   `borderRadius`, `keyframes`, `animation`, `boxShadow`, `backgroundImage`,
   `spacing`. When both files define the same key, the archived value wins.
   Also copy `plugins` the archive adds and that exist in `package.json`.
3. **Fonts.** Collect the Google Fonts families from the archived
   `src/index.css` `@import` and from `<link>` tags in
   `.migration/web-old/index.html`. In `apps/web/src/root.tsx` `links`,
   replace the template DM Sans stylesheet entry with one entry per archived
   URL. Keep the two `preconnect` entries. If the archive loads no web font,
   remove the DM Sans entry and rely on `index.css`.
4. **Content glob.** The `content` array in `apps/web/tailwind.config.js`
   must include `.js` and `.jsx`: `['./src/**/*.{js,jsx,ts,tsx}']`. Staged
   `.jsx` pages are otherwise never scanned and their utility classes
   (`tracking-[0.18em]`, `leading-[0.95]`) are not compiled at all.

Do not retype the archived tokens by hand or "modernize" them. Do not keep
the template `:root` block next to the archived one. Do not move the theme
into component-level inline styles.

Verification for this section lives in `completion-checks.md` "Theme".

## SPA shell removal

Delete or stop importing:

- `BrowserRouter`, `Routes`, `Route` from `react-router-dom`
- `src/App.jsx` / `src/App.tsx` after its children live in route modules
- `src/main.jsx` / `src/pages/*` copies under `src/migration-source`

React Router owns routing through `src/routes.ts`. Import navigation from
`react-router`.

## Import repair

Flattened files change path depth. After a file moves to `src/components`
or `src/lib`:

- Rewrite relative specifiers (`../pages/Home` → `@/components/Home` or the
  local relative path).
- Keep `@/` aliases that already resolve.
- Replace `react-router-dom` with `react-router`.
- Use `files[].imports` when the list is present. If it is empty, grep
  imports in the staged file and rewrite those specifiers.

When both `file.js` and `file.ts` (or `.jsx` / `.tsx`) exist, keep one file
and point every import at it. Prefer the TypeScript file when the contents
are equivalent.

## Express to resource routes

For each custom `api.endpoints[]` entry:

1. Add `apps/web/src/routes/api.<name>.ts`.
2. Export `loader` and/or `action` wrapped in `withApi`.
3. Register the `/api/...` path in `src/routes.ts`.
4. Move secrets and third-party calls into `.server.ts` modules.
5. Do not start or keep the Express process.

Read framework-mode `references/api-routes.md` for `withApi`, `json`, and
`apiError`.

## Express middleware

Express middleware has no direct equivalent in React Router. Convert it -
never skip an endpoint because middleware sits in front of it:

- Auth middleware → a helper in `src/lib` (for example
  `requireUser(request)` that validates the token and returns the user or
  throws `apiError(401, ...)`). Call it at the top of each protected
  `loader` / `action`.
- Rate limiting → `src/lib/rate-limit.server.ts` (already shipped).
- Error middleware → `withApi` already maps thrown errors to JSON responses.
- CORS middleware → drop it. Resource routes are same-origin.

A router mounted behind middleware (for example
`router.use('/ecommerce/subscriptions', authMiddleware, subscriptionsRouter)`)
still counts as one endpoint group in `api.endpoints[]`. Convert every
handler inside it.

## Ecommerce and integrated AI

If the store or the AI module is enabled, this template injects its own
clients and resource routes. They are already in the live tree before you
start. The archived v2 equivalents are staged alongside them as ordinary
source files — two clients for the same service.

The injected file always wins. Never wire a component to a staged client,
and never re-create an endpoint the injected routes already serve:

| Service | Injected, already live | Staged from v2, delete after rewiring |
| ------- | ---------------------- | ------------------------------------- |
| Store | `src/api/ecommerce-api.ts` | `src/lib/EcommerceApi.js` |
| Subscriptions | `src/api/ecommerce-subscriptions-api.ts`, `src/lib/ecommerce-subscriptions.server.ts`, `src/routes/api.ecommerce.subscriptions.ts`, `src/routes/api.ecommerce.subscriptions.manage.ts` | `src/lib/InternalEcommerceSubscriptionsApi.js`, the `apps/api` subscriptions routes |
| Integrated AI | `src/api/integrated-ai-api.ts`, `src/lib/integrated-ai.server.ts`, `src/routes/api.integrated-ai.stream.ts` | `src/lib/integratedAiClient.js`, the `apps/api` AI routes |

Method names differ between the v2 and the injected clients. Read the
injected client and map each call — do not assume the old name exists.

Register the injected resource routes in `src/routes.ts`. They ship as route
modules but nothing registers them for you.

The archived subscriptions and AI clients called the Express API
(`apiServerClient.fetch('/ecommerce/subscriptions')`). Those endpoints no
longer exist. Rewiring to the injected client is the fix; re-creating the
Express endpoint as a resource route is not.

Keep the v2 UI. Components, pages, and hooks the site already had (cart,
product lists, chat) are the site's own design — port them onto the injected
client rather than replacing them with new pages. Wrap staged catalog
pages from a thin route module. Pass `loaderData` as props. Do not rebuild
the storefront.

When the store is enabled, catalog data **must** load in a server `loader`.
That is what makes product and listing pages indexable. CSR mount-fetch plus
`document.title` is a failed stitch for those pages.

Required when `src/api/ecommerce-api.ts` exists:

1. **Detail.** Route `loader` calls `getProductByHandle(params.handle)`.
   Default export renders the staged PDP with that product. Strip
   `getProduct` / `getProductByHandle` from the page `useEffect`.
2. **Listings.** Shop, product grids, and category pages load
   `getProducts` (with `exclude_types: 'subscription'`) in their route
   `loader`. Strip listing `getProducts` from mount `useEffect`.
3. **URLs.** Change the product segment, route filename, and every product
   `Link` to `url_handle` in one edit. Register `product/:handle` (or the
   site's equivalent path) — not `:id`. `getProductByHandle` still resolves
   old id URLs. Do not leave `:id` in place and start linking slugs.
4. **SEO.** Product route `meta` uses `product.seo` (title, description,
   image, `noindex`) and Product JSON-LD from the same loader data.
5. **Sitemap.** `getDynamicEntries()` in `src/routes/sitemap.xml.ts` emits
   one URL per product via `getProducts({ exclude_types: 'subscription' })`
   and `product.url_handle`. Put the listing path in `STATIC_PATHS`.

Stay in the browser: cart, `getProductQuantities`, checkout redirect,
`getAvailability` / `getTimeSlots`, auth `clientLoader`. Do not put catalog
HTML in a `clientLoader`.

Follow these sections in `hostinger-ecommerce/SKILL.md` as stitch rules, not
optional reading: "Product URLs are slugs, never ids", "Products load in a
`loader`", "Product pages carry the merchant's SEO". Also read
`references/SUBSCRIPTIONS.md` and `integrated-ai/SKILL.md` for those
clients' contracts. They describe this template, not the archived app.

## SSR browser globals

If `ssrRisks` marks `localStorage`, `window`, `document`, `navigator`, or a
browser SDK:

- Do not read them at module scope.
- Do not read them during the initial render of an SSR route.
- Move the read into `useEffect`, a client-only helper, or a
  `clientLoader` when the value is browser-only.

`heuristic` risks still need a check. Open the file and confirm.

If `ssrRisks` is missing or empty, grep `window|document|localStorage` under
`src/` and apply the same rules.

## Cleanup

When a staged file is converted:

1. Write the live route, component, or resource route.
2. Delete the copy under `apps/web/src/migration-source/`.
3. Do not delete `.migration/web-old` or `.migration/api-old`. Those are archives.

Delete staged components under `src/components/` that no route or component
imports. Check with `grep -rn`.
