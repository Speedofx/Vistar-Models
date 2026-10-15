---
name: react-router-migration
description: >
  Stitch a cut-over monorepo-v2 Vite SPA into the live React Router app.
  Use after apps/web-new has been renamed to apps/web. Recover source from
  .migration/web-old and .migration/api-old. Do not add features.
license: MIT
---

# React Router migration

This skill is the process hub for the post-cutover stitch. The live app is
already a React Router tree. Your job is to move the archived product into it
and leave a running app.

Do not add features. Do not change product copy, routes, or behavior except
where SSR or React Router requires it. Store catalog URLs (`:id` →
`:handle` / `url_handle`) and moving catalog fetch into a route `loader`
are required SSR exceptions. Social preview assets and structured data are
the one required addition: when the archive defined no `og:image`, favicon,
or JSON-LD, add the missing ones (see "Required work").

## Load these first

1. This file.
2. `references/manifest-schema.md` — how to read the generated manifest.
3. The generated manifest at
   `vault/wiki/skills/react-router-migration/references/migration-manifest.json`.
4. `vault/wiki/skills/react-router-framework-mode/SKILL.md` for React Router
   rules. Load its references only when that skill tells you to.
5. `references/stitch-patterns.md` — open the **v2 → SSR replacement table
   at the top** before you assemble routes, convert Express, or repair imports.
   Those replacements are decided. Do not re-evaluate them.
6. `references/completion-checks.md` before you stop.

Do not copy React Router rules into this skill. Follow the framework-mode skill.

## Post-cutover paths

| Role | Path | Notes |
| ---- | ---- | ----- |
| Live target | `apps/web` | React Router app. Edit this tree. |
| Archived SPA | `.migration/web-old` | Previous Vite `apps/web`. Read-only source. |
| Archived Express API | `.migration/api-old` | Previous `apps/api`. Read-only source. Convert endpoints into resource routes. |
| Generated manifest | `vault/wiki/skills/react-router-migration/references/migration-manifest.json` | Built before the rename. Remap paths before you use them. |

The manifest was written while the SPA still lived at `apps/web` and the
target still lived at `apps/web-new`. After cutover:

- Source path `apps/web/...` → `.migration/web-old/...`
- Target path `apps/web-new/...` → `apps/web/...`
- Source path `apps/api/...` → `.migration/api-old/...`

Staged scratch copies already sit under `apps/web/src/migration-source/`.
Prefer those copies when they exist. Use `.migration/web-old` and
`.migration/api-old` when you need the original file.

## TypeScript gate

`apps/web` is strict TypeScript. `tsconfig.json` is forbidden. Do not edit it.
`allowJs` is on. A `.tsx` route module may import a staged `.jsx` or `.js`
file. Wrap the staged page. Do not rename it to `.tsx` to please `tsc`.

Do not write `declare module '*.jsx'` (or `*.js`) shims. TypeScript ignores
them when the real source file resolves. ESLint lints only `*.ts` / `*.tsx`;
staged `.jsx` files are not linted. Do not read `eslint.config.mjs`.

## Required work

1. Read the remapped manifest. Treat `web.routes` and `api.endpoints` as the
   inventory. Treat `web.files` and `api.files` as the copy map. If `web.routes`
   is empty, read archived `App.jsx` (`.migration/web-old/src/App.jsx` or the
   staged `src/migration-source/App.jsx`). Do not read or write
   `apps/pocketbase` — no `pb_migrations`, hooks, or config.
2. Assemble route modules under `apps/web/src/routes/` and register them in
   `apps/web/src/routes.ts`. A module that exists on disk but is missing from
   `routes.ts` is dead code - config routing has no file-based fallback.
   Home must render the real landing page, not an empty `<div />`. Reuse the
   staged page components; wrap them from a thin route module. Do not rewrite
   working page UI from scratch. In that same change, update
   `src/routes/sitemap.xml.ts`: put each public page path in `STATIC_PATHS`,
   and one URL per public record in `getDynamicEntries()`.
3. Rebuild the app shell in `src/root.tsx`. Every provider and global element
   that wrapped `<Routes>` in the archived `App.jsx` (context providers, cart
   provider, site layout, toaster) must wrap `<Outlet />` in the same nesting
   order. See `stitch-patterns.md` "App shell".
4. Transfer the theme. The cutover replaced `apps/web/src/index.css`,
   `apps/web/tailwind.config.js`, and `index.html` with template copies, so
   the live app renders in the template theme (DM Sans, gray tokens) while
   the staged pages still use the archived classNames (`font-display`,
   `bg-background`, `text-accent`). Copy the archived `index.css` over the
   live one, merge every `theme.extend` key from the archived
   `tailwind.config.js`, and point the font `links` in `root.tsx` at the
   archived Google Fonts families. Make sure the Tailwind `content` glob
   scans `.jsx`. See `stitch-patterns.md` "Theme transfer". Do this before
   the first `reload_app`.
5. Remove the SPA shell. Do not keep `BrowserRouter`, `react-router-dom`,
   `src/App.jsx`, or `src/pages/`. Those belong to the archive.
6. Repair imports after flatten (`src/components`, `src/lib`, `src/hooks`).
   Point them at the new paths. Import from `react-router`, not
   `react-router-dom`.
7. Convert Express handlers in `.migration/api-old` / `src/migration-source` into
   `/api/*` resource routes. Wrap handlers with `withApi` from
   `src/lib/api.server.ts`. If `api.endpoints` is empty and
   `.migration/api-old/src/routes` has only template files, skip API conversion
   and write one line in the summary. Endpoints behind middleware (auth, rate
   limits) are still required when custom endpoints exist - convert the
   middleware too, see `stitch-patterns.md` "Express middleware". See the
   framework-mode `api-routes` reference.
8. If the store or the AI module is enabled, rewire the archived UI onto the
   injected clients (`src/api/ecommerce-api.ts`,
   `src/api/ecommerce-subscriptions-api.ts`, `src/api/integrated-ai-api.ts`)
   and register their resource routes in `src/routes.ts`. The staged v2
   clients and their Express endpoints are dead. When the store is on,
   product detail, shop, and category pages must fetch catalog data in a
   server `loader` (`getProductByHandle` / `getProducts`). Wrap the staged
   page and pass `loaderData`. Strip the catalog `useEffect` fetch. Change
   product URLs to `url_handle` in the same edit. Cart, quantities, checkout,
   and booking slots stay in the browser. See `stitch-patterns.md`
   "Ecommerce and integrated AI".
9. Guard SSR browser globals. `localStorage`, `window`, `document`, and
   similar APIs must not run at module scope or during SSR render. Use the
   `ssrRisks` list in the manifest. If that list is empty, grep
   `window|document|localStorage` under `src/`.
10. Resolve duplicate JS/TS pairs (`use-mobile.jsx` and `use-mobile.tsx`,
    `utils.js` and `utils.ts`). Keep one file. Prefer the TypeScript file when
    both exist and the contents match. Update imports.
11. Delete `apps/web/src/migration-source` when every staged file is converted
    or discarded.
12. Social preview assets and structured data. The archive may never have
    defined them, so check each and add only what is missing:
    - **og:image.** If an archived page passed an `image` to `Seo` (grep
      `.migration/web-old/src` for `<Seo[^>]*image=`; the `og:image` line
      inside `components/Seo.jsx` is the template component itself and does
      not count), carry that exact image over as `image` in the matching
      route's `meta` via `seo()`.
      Otherwise generate one 16:9 image with `get_images` matching the site's
      subject and pass it as `image` in the home page's `meta`.
    - **Favicon.** If the archive shipped its own icon (an icon link in
      `.migration/web-old/index.html` other than the Vite default `/vite.svg`,
      or an icon file under `.migration/web-old/public/`), copy that file into
      `apps/web/public/` and point the icon link in `src/root.tsx` at it.
      Otherwise generate a 1:1 mark with `get_images` (flat, bold, single
      subject, solid background, legible at 32px), save it with
      `curl -fsSL -o apps/web/public/favicon.png "<url>"`, and change the icon
      link in `src/root.tsx` to `/favicon.png` with `type: 'image/png'`.
      Either way, once the new link is in place, delete the template
      placeholder with `rm apps/web/public/favicon.ico` — unless the icon
      you linked now lives at that exact path.
    - **JSON-LD.** v2 archives carry none, so add it to the routes you are
      already stitching, built only from copy the archived pages themselves
      show: home gets `WebSite` plus `Organization`, `Person`, or
      `LocalBusiness`; each blog post route gets `Article` and
      `BreadcrumbList`; blog and other listing indexes get `CollectionPage`;
      product routes get Product JSON-LD per `stitch-patterns.md`. Pass the
      objects as `jsonLd` through `seo()` (see the framework-mode
      `seo-sitemap` reference's schema table). Never invent ratings, prices,
      dates, or addresses the archived pages do not state.
    This step adds no pages and changes no copy; it is not a feature addition.
13. Run `cd apps/web && npm run typecheck` via `bash`, as a single command.
    Never chain it with `npm run lint` or anything else: `bash` stops at
    30 s and the pair does not fit. Fix until it exits 0. Do not run
    `npm run lint` yourself; `reload_app` runs it. Then run every remaining
    command in `references/completion-checks.md`. Finish with a running
    React Router app. Call `reload_app` once after typecheck is clean.

## Debugging detours

When you strip providers, routes, or chrome to isolate a failure, that is a
temporary state, not a deliverable. Restore everything you stripped before
you finish. Never stop with a reduced `routes.ts`, a bare `<Outlet />`, or a
`TEMP` / `diagnostic` comment in the tree. An app that renders one empty page
is a failed migration, not a partial success.

## Do not

- Edit `react-router.config.ts` or `vite.config.ts`.
- Add `llms.txt` during the stitch.
- Draft file contents in reasoning. Write them with `write_file` /
  `edit_file` directly.
- Disable SSR or switch the app to SPA mode.
- Recreate `apps/api` as a live Express service.
- Change product features, add pages, or restyle the site. Keeping the
  template theme (DM Sans, gray `:root` tokens, template `fontFamily`) is a
  restyle. The live app must use the archived `index.css` tokens, fonts, and
  Tailwind `theme.extend`.
- Leave placeholder route modules that return `<div />` for real pages.
- Rewrite staged page UI (HomePage, LoginPage, …) into new files unless the
  original cannot run under SSR. Prefer wrapping the staged component.
  Stripping a catalog `useEffect` fetch and passing `loaderData` is required,
  not a rewrite.
- Keep catalog `getProduct` / `getProducts` / `getProductByHandle` in a
  page `useEffect`, or use `document.title` / `clientLoader` as the SEO
  path for product or listing pages. Those pages must ship HTML from a
  server `loader`.
- Read or write `apps/pocketbase` — no `pb_migrations`, hooks, or config.
  The database is not part of this migration and must keep working as before.
- `pkill`, `kill`, `killall`, `pm2`, or start a second `react-router` / Vite
  server on another port. App processes belong to the sandbox supervisor.
  `reload_app` is the only restart.
