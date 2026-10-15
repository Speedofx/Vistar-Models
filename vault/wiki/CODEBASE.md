# Codebase Map

npm workspaces monorepo at `/home/${username}/websites/${sandboxId}/public_html`. The web app ships with React Router framework mode and `react-router-serve` on port 3000, which also hosts same-origin `/api/*` resource routes. Call `enable_pocketbase_integration` to add a database — it appends its own `## apps/<service>` section to this file. Do **not** call `enable_api_server_integration` (Express is not supported on this template).

## apps/web (React Router Framework Mode + TypeScript + Tailwind + shadcn/ui, port 3000)

Located at apps/web/. Run: `cd apps/web && npm run dev` (auto-started by the sandbox supervisor).

Stack defaults:

- TypeScript throughout (`tsx` / `ts`)
- React Router 8 framework mode with explicit `src/routes.ts` configuration
- SSR by default (`ssr: true` in `react-router.config.ts`); Node server handles document requests and `/api/*` resource routes

Key files:

- `src/root.tsx` — document shell, links, ErrorBoundary; owns `<html lang>`, which must hold the BCP 47 tag of the language the site's copy is written in. Its `loader` publishes the site origin that `seo()` builds canonical URLs from, and its `headers` export advertises the sitemap. Keep `<HorizonsPreviewScripts />` in `<head>` — it is platform-owned and renders the preview and site banner scripts
- `src/routes.ts` — explicit route config (index + resource routes)
- `src/routes/home.tsx` — `/` home route
- `src/routes/page.tsx` — shared route for static content pages and client enquiry / manufacturer partner forms
- `src/routes/blog.tsx` — `/blog` journal index
- `src/routes/blog.$slug.tsx` — `/blog/:slug` article pages
- `src/lib/seo.ts` — `seo()` builds a page's title, description, canonical, Open Graph, Twitter and JSON-LD tags; every public page's `meta` export calls it — read-only, do not edit. Extra tags are appended at the call site
- `src/routes/sitemap.xml.ts` — `GET /sitemap.xml` resource route (public URLs for crawlers, including blog pages)
- `src/routes/robots.txt.ts` — `GET /robots.txt` resource route (allows crawlers on the site's own domain, `Disallow: /` on Hostinger preview hosts) — read-only, do not edit
- `src/routes/api.health.ts` — `GET /api/health` answering `{ ok: true }`, the check for whether the app is healthy and listening — read-only, do not edit, and keep its entry in `src/routes.ts`
- `src/routes/api.$.ts` — JSON `404` for unmatched `/api/*` paths
- `src/routes/api.download-source.ts` — `GET /api/download-source` streams a workspace source archive, excluding generated, dependency, and environment files
- `src/routes/llms.txt.ts` — `GET /llms.txt` resource route with site and journal information for language-model crawlers
- `src/routes/rss.xml.ts` — `GET /rss.xml` journal feed
- `src/index.css` — Tailwind theme, CSS variables, site-wide visual styling, blog and contact-button styles, and source-download button styles
- `src/data/site.ts` — site navigation, contact details, page content and category data
- `src/data/business.ts` — business identity, contact links, service area and operating hours
- `src/data/blog-posts.ts` — original journal articles and related content data
- `src/components/site-header.tsx` — responsive site navigation, Journal link, enquiry CTA and source-code download button
- `src/components/site-footer.tsx` — site footer, visible business contact details and contact links
- `src/components/contact-buttons.tsx` — phone and WhatsApp contact buttons
- `src/components/blog/blog-index.tsx` — journal listing
- `src/components/blog/article-body.tsx` — article content and related links
- `src/components/home/hero.tsx` — homepage editorial hero
- `src/components/home/perspective.tsx` — homepage consultancy positioning section
- `src/components/home/industry-partners.tsx` — homepage industries and partner invitation section
- `src/components/home/blog-teaser.tsx` — homepage journal teaser
- `src/components/category-gallery.tsx` — category imagery and links
- `src/components/capability.tsx` — capability-based maker matching content
- `src/components/process.tsx` — sourcing process steps
- `src/components/founder.tsx` — founder and consultancy background
- `src/components/contact-cta.tsx` — contact and WhatsApp calls to action
- `src/components/enquiry-form.tsx` — client enquiry and manufacturer application forms
- `src/components/page-heading.tsx` — shared content-page heading
- `src/components/page-content.tsx` — shared static page content, including FAQ contact options
- `src/components/category-content.tsx` — category-specific sourcing page content
- `public/favicon.png` — site favicon

Routes: `/` → `src/routes/home.tsx`; content, category, industries, process, partner, FAQ, contact and legal pages → `src/routes/page.tsx`; `/blog` → `src/routes/blog.tsx`; `/blog/:slug` → `src/routes/blog.$slug.tsx`; `GET /sitemap.xml` → `src/routes/sitemap.xml.ts`; `GET /robots.txt` → `src/routes/robots.txt.ts`; `GET /llms.txt` → `src/routes/llms.txt.ts`; `GET /rss.xml` → `src/routes/rss.xml.ts`; `GET /api/health` → `src/routes/api.health.ts`; `GET /api/download-source` → `src/routes/api.download-source.ts`; any other `/api/*` → `src/routes/api.$.ts` (JSON 404)

SEO: every public page exports `meta` built with `seo()` from `@/lib/seo` (title, description, canonical, Open Graph, JSON-LD), and its URL goes into `src/routes/sitemap.xml.ts` in the same change. Every page passes `image` (an `og:image` is never optional — generate a site-wide 16:9 social image with `get_images` when no page image fits), the placeholder `apps/web/public/favicon.ico` must be replaced with a generated site-specific favicon, and every page matching a schema type passes `jsonLd` (home always: `WebSite` + `Organization`/`Person`/`LocalBusiness`; blog posts: `Article`; listings: `CollectionPage`; products: `Product`; services, events, recipes, FAQs: their own types). See `vault/wiki/skills/react-router-framework-mode/references/seo-sitemap.md`.

Structure: route modules stay thin — `meta`, `loader` / `action`, and a default export that composes components. Each page section is its own file: page-specific ones in `src/components/<route>/<section>.tsx` (one exported component per file, kebab-case), pieces shared by two or more routes in `src/components/`, long static content arrays in `src/data/<name>.ts`, shared constants and hand-tunable config in `src/constants/<name>.ts`, pure helpers and types in `src/lib/`. Never assemble a whole page inside its route module, and do not add barrel `index.ts` files. See `vault/wiki/skills/react-router-framework-mode/SKILL.md`. Exception: a browser game's play view is not a sectioned page — it is the one full-viewport frame (canvas edge to edge, overlays on top) from `vault/wiki/skills/game/references/ui.md`, never a page with the game in a box.

Server-only modules: always the `.server.ts` suffix (`src/lib/<name>.server.ts`), matching the shipped `api.server.ts` / `logger.server.ts`. Never create a `.server/` directory — that alternative React Router convention is not used in this codebase.

Exports: a route module (`src/routes/*`, `src/root.tsx`) default-exports its component; every component you write outside those — page sections, shared chrome — is a named export (`export function Hero`, imported as `import { Hero } from '@/components/home/hero'`), and mixing the two renders `undefined`. The rule is about components: `src/routes.ts` keeps the default export React Router requires, and the PocketBase hooks and helpers (`@/hooks/use-auth`, `@/lib/pocketbase-client`, present once PocketBase is enabled) also ship a default alongside their named export — import all of them by name. Imports must never form a cycle, neither directly (A imports B, B imports A) nor through a chain (A imports B, B imports C, C imports A): one module in the cycle is undefined at render time, and ESLint errors on it.

Imports: always the `@/` alias (`@/lib/api.server`, `@/components/ui/button`), never relative paths — even between files in the same folder. The one exception is React Router's generated route types, which must stay relative (`./+types/home`) because typegen resolves them through `rootDirs`.

API conventions: wrap every `/api/*` handler in `withApi` from `src/lib/api.server.ts` — it rate limits the caller, adds security headers, and turns a thrown `Error` into the shared 500 shape. Validation errors use `apiError(422, '...')`; server failures are thrown, never hand-built. See `vault/wiki/skills/react-router-framework-mode/references/api-routes.md`.


## apps/pocketbase (PocketBase binary + SQLite, port 8090)
Located at apps/pocketbase/. Binary: `pocketbase` on PATH (part of the sandbox image, not the project); run it through the apps/pocketbase/package.json scripts. Dashboard: http://localhost:8090/_/, API: http://localhost:8090/api/
Data: apps/pocketbase/pb_data/ (auto-generated, gitignored).
Migrations: apps/pocketbase/pb_migrations/ — JS files; each calls `migrate((app) => { ... }, (app) => { ... })` (up, down — one arg each, the transactional app; there is no `db` arg).
Server-side event hooks: apps/pocketbase/pb_hooks/*.pb.js — fire on record / mailer / request events.
Run: `cd apps/pocketbase && npm run dev` (auto-started by the sandbox supervisor).

apps/pocketbase/pb_migrations/1792052766_create_vistar_forms.js — creates PocketBase collections for Vistar client enquiries and manufacturer partner applications
apps/pocketbase/pb_hooks/vistar-forms.pb.js — handles Vistar form-related server-side events and email notifications

apps/web/src/lib/pocketbase-client.ts — PocketBase SDK client (web-side); usage: `import pocketbaseClient from '@/lib/pocketbase-client'`.

apps/web/src/lib/pocketbase-client.server.ts — superuser client, for loaders / actions / `/api/*` routes only.

Auth scaffolding shipped with the client — extend these in place, never rewrite or duplicate them:
apps/web/src/hooks/use-auth.ts — `useAuth()` returning { user, isAuthed, isLoading, login, signup, logout }; no provider to mount.
apps/web/src/lib/require-auth.ts — `requireAuth()`, called from a route's `clientLoader`; throws a redirect to /login when signed out.

PocketBase skill: load `pocketbase/SKILL.md` first (the hub). Sub-references at `pocketbase/references/`: ACCESS_RULES, ADD_FIELD, CREATE_AUTH_COLLECTION, CREATE_COLLECTION, CUSTOM_SMTP, DELETE_COLLECTION, DELETE_RECORDS, FIELD_TYPES, HOOKS, INDEXES, MFA, MIGRATIONS, OAUTH_PROVIDERS, OTP_AUTH, RAW_SQL, RECORD_OPERATIONS, REMOVE_FIELD, RENAME_COLLECTION, RENAME_FIELD, SEED_DATA, UPDATE_FIELD, UPDATE_INDEXES, UPDATE_RECORDS, UPDATE_RULES, USING_IN_REACT — read the relevant one before any pocketbase change.
