# Completion checks

Stop only when every item below is true. Where a command is given, run it
from `apps/web` and act on its output - do not assume the answer.

## Assembly

- [ ] Every module under `src/routes/` is registered in `src/routes.ts`.
      Compare the two:

      ls src/routes/
      grep -o "'routes/[^']*'" src/routes.ts

      Every file must appear in the second list. An unregistered module is
      dead code, not a route.
- [ ] Every path from the archived router is registered. List them:

      grep -o 'path="[^"]*"' ../../.migration/web-old/src/App.jsx

      Each path (including the index route) has an entry in `src/routes.ts`.
- [ ] `/` renders the archived home, not an empty `<div />`:

      grep -n 'return' src/routes/home.tsx

- [ ] The app shell is rebuilt. Every provider whose hook is used must be
      mounted in `src/root.tsx` or a layout route:

      grep -rn 'useCart\|useAuth\|useSubscriptionAuth\|useContext' src/ --include='*.jsx' --include='*.tsx' -l
      grep -n 'Provider\|SiteLayout\|Toaster' src/root.tsx

- [ ] No diagnostic leftovers:

      grep -rn 'TEMP\|diagnostic\|FIXME' src/

      Anything this finds that you added must be resolved and removed.

## Theme

- [ ] Every CSS variable the archive defines exists with the same value in
      the live `src/index.css`:

      grep -oE -- '--[a-zA-Z0-9-]+: *[^;]+' ../../.migration/web-old/src/index.css | sort -u > /tmp/old.vars
      grep -oE -- '--[a-zA-Z0-9-]+: *[^;]+' src/index.css | sort -u > /tmp/new.vars
      comm -23 /tmp/old.vars /tmp/new.vars

      The last command must print nothing. Any line it prints is an archived
      token the live app lost.
- [ ] No Google Fonts `@import` remains in `src/index.css`, and every
      archived font family is loaded from `src/root.tsx`:

      grep -n '@import' src/index.css
      grep -ohE 'family=[A-Za-z+]+' ../../.migration/web-old/src/index.css ../../.migration/web-old/index.html | sort -u
      grep -ohE 'family=[A-Za-z+]+' src/root.tsx | sort -u

      The first command prints nothing. Every family from the second list
      appears in the third. `DM+Sans` appears in the third list only when the
      archive used it.
- [ ] Every `theme.extend` key the archive defines exists in the live
      `tailwind.config.js`:

      grep -oE '^\s+[A-Za-z"-]+:' ../../.migration/web-old/tailwind.config.js | tr -d ' \t' | sort -u > /tmp/old.keys
      grep -oE '^\s+[A-Za-z"-]+:' tailwind.config.js | tr -d ' \t' | sort -u > /tmp/new.keys
      comm -23 /tmp/old.keys /tmp/new.keys

      The last command must print nothing.
- [ ] The Tailwind `content` glob scans staged `.jsx` files:

      grep -n 'content:' tailwind.config.js

      The line must contain `jsx`.

## API coverage

- [ ] If `api.endpoints[]` is empty, `api.warnings[]` has no
      `endpoints-not-extracted` or `unreadable-router` entry, and
      `.migration/api-old/src/routes` has only template files, skip API
      conversion and record that in the summary.
- [ ] Every module an `endpoints-not-extracted` warning names has had its
      endpoints read from `.migration/api-old/` and converted.
- [ ] Custom `api.endpoints[]` exist as `/api/*` resource routes or have a
      written reason they are obsolete.
- [ ] Every API path the client calls has a matching registered route:

      grep -rn "'/api/\|\"/api/\|(\`/api/" src/ --include='*.js*' --include='*.ts*' | grep -v 'src/routes/' | grep -v 'pocketbase-client.server'

      The `api/*` catchall answers 404 and does not count as a match.

## Store catalog (skip this section if `src/api/ecommerce-api.ts` is absent)

- [ ] The product route module exports `loader` and `meta`, and the loader
      calls `getProductByHandle`:

      grep -n 'export async function loader\|export function meta\|getProductByHandle' src/routes/product*.tsx src/routes/*product*.tsx

      `loader` and `meta` must both appear. `getProductByHandle` must appear
      in the loader file. Invented titles or `document.title` on this route
      fail the check.

- [ ] Catalog fetch is not in a mount `useEffect` on detail or listing pages:

      grep -rl 'useEffect' src --include='*.jsx' --include='*.tsx' | xargs grep -n 'getProduct(\|getProducts(\|getProductByHandle('

      This must print nothing for PDP, shop, grid, and category files.
      `getProductQuantities`, cart, checkout, and booking slot calls in
      `useEffect` are allowed — those names are not in this grep. `getProduct(`
      in a cart line that already holds an id is not a catalog page fetch.

- [ ] Product routes use a handle segment, not `:id`:

      grep -nE "products?/:" src/routes.ts

      No output means the product route is not registered, which fails this
      check. A matching line must contain `:handle` (or the site's slug
      param name). It must not be `:id`.

- [ ] Sitemap dynamic product URLs use `url_handle`:

      grep -n 'url_handle\|getProducts\|getDynamicEntries' src/routes/sitemap.xml.ts

      `getDynamicEntries` must call `getProducts` and emit `url_handle`.

## Social preview assets and structured data

- [ ] The home route's `meta` passes `image` to `seo()` — the archived
      og:image when the archive defined one, otherwise a generated 16:9
      image:

      grep -n 'image' src/routes/home.tsx
      grep -rn '<Seo[^>]*image=' ../../.migration/web-old/src | head

      The second grep finds an `image` prop actually passed at a `<Seo`
      call site (check multi-line call sites too). The `og:image` line
      inside the archive's `components/Seo.jsx` is the template component
      itself and does not count as an archived og:image.

- [ ] The template placeholder favicon is gone and `src/root.tsx` links the
      icon that replaced it — the archive's own icon or a generated
      `favicon.png`:

      ls public/
      grep -n "rel: 'icon'" src/root.tsx

      `public/` lists the new icon and no leftover placeholder `favicon.ico`
      (an archived or copied icon living at that exact path is fine), and
      the icon link points at that file.

- [ ] Home passes `jsonLd` (`WebSite` plus the publisher type), and every
      stitched blog post, listing index, and product route passes its own
      schema:

      grep -rn 'jsonLd' src/routes/ | head

      Home must appear. When the site has a blog, each post route and the
      blog index appear too. When `src/api/ecommerce-api.ts` exists, the
      product route appears with Product JSON-LD. Every value must come
      from the archived pages' own copy — no invented ratings, prices,
      dates, or addresses.

## Code hygiene

- [ ] No `react-router-dom` imports remain under `apps/web/src`.
- [ ] No `BrowserRouter` remains under `apps/web/src`.
- [ ] `apps/web/src/migration-source` is gone, or only holds files you
      documented as blocked.
- [ ] Duplicate JS/TS pairs are reduced to one file.
- [ ] High and medium `ssrRisks` do not run at module scope or during SSR
      render.
- [ ] `apps/pocketbase` is untouched - no changed, added, or deleted files
      anywhere under it.

## Runtime

- [ ] From `apps/web`, `npm run typecheck` exits 0. Run it via `bash` as a
      single command before `reload_app`. Do not chain it with `npm run lint`
      (the `bash` tool stops at 30 s). Do not run `npm run lint` yourself;
      `reload_app` runs it. Do not restart to discover typecheck failures.
- [ ] You called `reload_app` once after typecheck was clean.
- [ ] The coding agent reported a successful reload, **or** a failed reload
      with empty `errormsg` whose `<pm2_out_log>` already contains
      `Local: http://localhost:3000` (sandbox health-check race — the app
      is up). Call `reload_app` **once** more in that case. If the same
      logs appear, stop. The app is live.
- [ ] You did not add features, pages, or visual redesigns. Keeping the
      template theme instead of the archived one counts as a redesign. The
      social preview assets and structured data step is required and does
      not count as a feature addition.

If reload fails with a real error (non-empty `errormsg`, ESLint, typecheck,
crash stack), fix that error. Re-run `npm run typecheck` until it exits 0,
then reload again. Do not revert the cutover, and
do not strip routes or providers to make the reload pass.

Never `pkill`, `kill`, spawn `pm2`, or start a debug server on another
port. Those stop the supervisor and turn a live app into `curl 000`.
