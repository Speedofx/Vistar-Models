---
title: SEO and sitemap
description: Page metadata via seo(), structured data, and the /sitemap.xml and /robots.txt resource routes
tags: [seo, geo, sitemap, robots, structured-data, canonical, open-graph, resource-route]
---

# SEO

Every page here renders on the server, so a crawler sees finished HTML. That only
pays off if the page also carries what search engines, social platforms and AI
assistants read: a unique title and description, a canonical URL, Open Graph
tags, and structured data. Two things make that happen — each page's `meta`
export, and the sitemap.

React Router Framework mode does **not** generate sitemaps from the route tree.
`src/routes.ts` holds URL patterns (`/blog/:slug`, `/product/:handle`), not the
public URLs that crawlers index. The app owns the document.

The platform does **not** write `sitemap.xml` or `robots.txt` for this template
at publish time. Both are served by resource routes the app owns.

## When to load this reference

Load it in the **same change** as any of:

- Building or reworking any public page (it needs its own `meta` export)
- Adding, renaming, or removing a public page
- Adding or removing a public collection (blog, journal, PDPs, products, articles, listings)
- Enabling or removing Hostinger ecommerce (shop listing + product detail pages)
- Changing which pages search engines or GEO crawlers should see

Do not wait for a follow-up prompt. The change is incomplete until every new page
exports `meta` and `src/routes/sitemap.xml.ts` matches the public URLs that still
exist.

## Page metadata: call `seo()`

`src/lib/seo.ts` builds the whole tag set — title, description, canonical link,
`og:*`, `twitter:*`, `robots`, and any JSON-LD — from the page's own words. Every
public route module exports `meta` through it:

```tsx
import type { Route } from './+types/about';
import { seo } from '@/lib/seo';

export function meta({ matches, location }: Route.MetaArgs) {
	return seo({ matches, location }, {
		title: 'About the journal',
		description: 'Who writes it, which decades it covers, and how each story gets researched.',
	});
}
```

`matches` carries the site's public origin, published by the root route's
`loader`, which is the only way `seo()` can build absolute canonical and
`og:url` values. Keep that `loader` and the `headers` export in `src/root.tsx`;
if they are missing, add them back:

```tsx
export function loader({ request }: Route.LoaderArgs) {
	const origin = siteOrigin(request);

	return data(
		{ origin },
		{ headers: { Link: `<${origin}/sitemap.xml>; rel="sitemap"; type="application/xml"` } },
	);
}

export function headers({ loaderHeaders }: Route.HeadersArgs) {
	return loaderHeaders;
}
```

That `Link` header is how agents discover the sitemap without parsing HTML. A
page route that exports its own `headers` **replaces** the root's, so merge
`parentHeaders` in it or the header disappears from that page:

```tsx
export function headers({ parentHeaders }: Route.HeadersArgs) {
	parentHeaders.set('Cache-Control', 'public, max-age=3600');

	return parentHeaders;
}
```

Rules the audits grade:

- **One `title` per page**, unique across the site, under ~60 characters, written
  for a reader — not `Home` or the site name repeated on every page. It does not
  have to match the page's `<h1>`: when the headline runs longer than that, pass
  a shortened form here and leave the headline as written.
- **One `description` per page**, unique, 120-160 characters, about that page
  rather than the site. Count the characters instead of eyeballing them — an
  excerpt reused verbatim from a post usually runs past 160 and is cut
  mid-sentence in the results page.
- **`image` on every page** — the page's own hero or cover, on a listing page
  the newest entry's image, and on a page with no suitable image of its own,
  the site-wide social image (generate one with `get_images`, 16:9, matching
  the site's subject — once, then reuse it). Without it the page posts as a
  text-only card everywhere it is shared, and the home page is the one most
  likely to be shared. Pass a root-relative or absolute URL; `seo()` makes it
  absolute.
- `type: 'article'` on blog posts and news.
- `noindex: true` for thank-you pages, internal search results and duplicates.
  It is not access control — private data needs an auth check in the loader.
- `path` only when the canonical URL differs from the URL being rendered (a
  filtered or paginated view canonicalising to its base page).

Never hand-write `<title>`, `<meta name="description">`, `og:` or canonical tags,
and never put them in a shared component or `root.tsx` — they have to differ per
page. `seo.ts` is read-only; a tag it does not build gets appended at the call
site:

```tsx
return [
	...seo({ matches, location }, { title, description, type: 'article' }),
	{ property: 'article:published_time', content: post.publishedAt },
];
```

When several pages need the same extra tags — `og:site_name`, `og:locale`, a
default social image — write one wrapper in `src/lib/page-meta.ts` that calls
`seo()` and appends them, and have those pages call the wrapper.

### Data-driven pages read `loaderData`

```tsx
export function meta({ matches, location, loaderData }: Route.MetaArgs) {
	if (!loaderData) {
		return seo({ matches, location }, {
			title: 'Post not found',
			description: 'This story is no longer published.',
			noindex: true,
		});
	}

	const { post } = loaderData;

	return seo({ matches, location }, {
		title: post.title,
		description: post.excerpt,
		image: post.coverImage,
		type: 'article',
	});
}
```

## Structured data

Structured data is what earns rich results, and what lets an assistant answer
about the site precisely. Pass plain schema.org objects as `jsonLd` — one object
or an array — and `seo()` renders each as its own
`<script type="application/ld+json">`. Build absolute URLs with `siteOriginFrom`
and `absoluteUrl` from `@/lib/seo`.

JSON-LD is not an optional extra for blogs and shops: **every public page
passes the most specific schema the table assigns it**, and the home page
always carries `WebSite` plus the type that describes the publisher
(`Organization`, `Person`, or `LocalBusiness`). A page whose content matches
no row simply omits `jsonLd` — never invent a type, and never invent facts to
fill one.

| Page | Schema to pass |
| ---- | -------------- |
| Home | `WebSite`, plus `Organization` (or `Person` for a personal site) |
| Blog post, article, news | `Article` and `BreadcrumbList` |
| Blog index, shop category, any list of entries | `CollectionPage` with an `ItemList` of the entries it links to |
| Any page two clicks deep | `BreadcrumbList` |
| Product detail | `Product` with `offers` |
| Restaurant, salon, clinic, shop with an address | `LocalBusiness` with `address`, `openingHours`, `telephone` |
| Service business offering (treatments, classes, plans, packages) | `Service` with `provider` and, when priced on the page, `offers` |
| Event page or listing (concerts, workshops, classes with dates) | `Event` with `startDate`, `location`, and `offers` when ticketed |
| Recipe page | `Recipe` with `recipeIngredient` and `recipeInstructions` |
| About page of a person-led site | `ProfilePage` with a `mainEntity` `Person` |
| FAQ section | `FAQPage` |

An article, from the same `loaderData` the page renders:

```tsx
const origin = siteOriginFrom(matches);
const url = absoluteUrl(origin, location.pathname);

return seo({ matches, location }, {
	title: post.title,
	description: post.excerpt,
	image: post.coverImage,
	type: 'article',
	jsonLd: [
		{
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: post.title,
			description: post.excerpt,
			url,
			image: absoluteUrl(origin, post.coverImage),
			datePublished: post.publishedAt,
			dateModified: post.updatedAt,
			author: { '@type': 'Person', name: post.author },
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl(origin, '/') },
				{ '@type': 'ListItem', position: 2, name: 'Journal', item: absoluteUrl(origin, '/blog') },
				{ '@type': 'ListItem', position: 3, name: post.title, item: url },
			],
		},
	],
});
```

Every value must match what the page actually shows — invented ratings, prices or
dates are what gets a site's rich results revoked. Do not add a package for
this; the objects are plain JSON.

## What the page itself has to get right

Metadata cannot rescue a page a crawler cannot read:

- Exactly one `<h1>`, with headings nesting in order (`h1` → `h2` → `h3`).
- Real `<main>`, `<nav>`, `<header>`, `<footer>` landmarks rather than nested
  `<div>`s.
- Every `<img>` has `alt` describing the image (`alt=""` only for decoration),
  plus `width` and `height` so the layout does not shift.
- `loading="lazy"` on images below the fold; the hero stays eager and gets
  `fetchPriority="high"`.
- Text as text. An image of a heading or paragraph is invisible to search
  engines and assistants alike.
- Internal links between related pages with descriptive anchor text — a page
  nothing links to is a page nothing crawls.

## Favicon

The template ships a placeholder `apps/web/public/favicon.ico`. Every site
replaces it with its own mark: generate a 1:1 image with `get_images` (flat,
bold, single subject, solid background — it has to stay legible at 32px),
save it via `bash` with `curl -fsSL -o apps/web/public/favicon.png "<url>"`,
and point the icon link in `src/root.tsx` at it:

```tsx
{ rel: 'icon', href: '/favicon.png', type: 'image/png' },
```

Then delete the placeholder (`rm apps/web/public/favicon.ico`): clients that
request `/favicon.ico` directly instead of reading the link — some crawlers,
feed readers, share-sheet scrapers — would otherwise keep getting the stock
icon. A site still shipping it looks unfinished in every tab, bookmark, and
share sheet.

## Sitemap (`/sitemap.xml`) — the route already exists, edit it

| File | Role |
| ---- | ---- |
| `src/lib/seo.ts` | `seo()` meta builder plus `siteOriginFrom` / `absoluteUrl` — read-only, call it |
| `src/root.tsx` | Its `loader` publishes the origin `seo()` needs, its `headers` export sends the sitemap `Link` header |
| `src/routes/sitemap.xml.ts` | Loader that returns sitemap 0.9 XML |
| `src/routes/robots.txt.ts` | Read-only loader that returns the crawler rules |
| `src/lib/site-origin.server.ts` | Read-only `siteOrigin(request)` — the public origin both use |
| `src/routes.ts` | `route('sitemap.xml', …)` and `route('robots.txt', …)` |

Do **not** create a second sitemap route. Do **not** write
`apps/web/public/sitemap.xml` or `apps/web/public/robots.txt`.
`@react-router/serve` serves `public/` **before** the SSR handler, so a static
file hides these routes.

## Robots (`/robots.txt`)

`src/routes/robots.txt.ts` is **read-only** and needs no changes — the sitemap is
the document that tracks the site.

It answers on the host it was requested from. On the site's own domain it allows
every crawler and points them at `/sitemap.xml`, and it splits the AI agents in
two. The assistants that fetch a page to answer a question and cite the site
back — `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`,
`PerplexityBot`, `meta-webindexer`, `Amzn-SearchBot` and the rest — each get
their own `Allow: /` group. The training tokens — `GPTBot`, `ClaudeBot`,
`Google-Extended`, `Applebot-Extended`, `meta-externalagent`, `Amazonbot`,
`Bytespider` — get `Disallow: /`, which is what makes the published content
signals (`search=yes, ai-input=yes, ai-train=no`) true rather than merely
stated. Those
signals are fixed — do not try to change them, and do not write a
`public/robots.txt`, which would hide the route that serves the real one. On a
Hostinger-provided host —
the editor preview (`*.app-preview.*`) or the domain a site gets before its owner
connects one (`*.hostingersite.*`) — it answers `Disallow: /`, so previews stay
out of search until the site is published on its real domain. `sitemap.xml` is
served either way; keep it accurate regardless of where the site currently runs.

To keep a page out of search results, leave it out of `sitemap.xml.ts` and
return `{ name: 'robots', content: 'noindex' }` from that route's `meta` export.
Neither is access control: anything that must stay private needs an auth check
in its loader.

## What belongs in the sitemap

Include:

- Static public pages (`/`, `/about`, `/blog`, `/shop`)
- One URL per public blog post
- One URL per public PDP (`/product/{url_handle}`, or the listing path the store uses)

Exclude:

- `/api/*` resource routes
- Auth, admin, account, cart, and checkout pages
- Subscription plans (`exclude_types: 'subscription'` on store queries)
- Anything behind `requireAuth` or meant for `noindex`
- The catch-all / 404 route
- This sitemap route itself

Do **not** copy every entry from `routes.ts`. Dynamic segments (`:slug`, `:id`)
are patterns, not URLs.

## Same-change rule

`getDynamicEntries()` returns `[]` only while the site has **no** public
records. Journal cards, featured product cards, a posts array, PocketBase rows,
and `getProducts()` listings all count — even when they still live only on the
home page as hash links.

### Add or rename a collection

In the same change:

1. Give records real routes (`blog.tsx` + `blog.$slug.tsx`, and/or `shop.tsx` +
   `product.$handle.tsx`).
2. Identify each record (a blog slug, or a product's `url_handle`) and an ISO
   date for `lastmod`.
3. Add the index path (`/blog`, `/shop`) to `STATIC_PATHS`.
4. Wire `getDynamicEntries()` so it emits one `{ path, lastmod }` per public
   record. Concatenate blog posts and PDPs when both exist.

**Blog posts** (hardcoded module):

```ts
import { posts } from '@/lib/posts';

const STATIC_PATHS = ['/', '/blog'];

async function getDynamicEntries(): Promise<{ path: string; lastmod?: string }[]> {
	return posts.map(post => ({
		path: `/blog/${post.slug}`,
		lastmod: post.publishedAt,
	}));
}
```

**PDPs** (Hostinger store — page through every purchasable product):

```ts
import { getProducts } from '@/api/ecommerce-api';

const STATIC_PATHS = ['/', '/shop'];

async function getDynamicEntries(): Promise<{ path: string; lastmod?: string }[]> {
	const entries: { path: string; lastmod?: string }[] = [];
	let offset = 0;
	const limit = 100;

	for (;;) {
		const { products, count } = await getProducts({
			offset,
			limit,
			exclude_types: 'subscription',
		});

		for (const product of products) {
			entries.push({
				path: `/product/${product.url_handle}`,
				lastmod: product.updated_at || undefined,
			});
		}

		offset += products.length;
		if (offset >= count || products.length === 0) {
			break;
		}
	}

	return entries;
}
```

Match `path` to the PDP route you registered (`/product/:handle`,
`/products/:handle`, `/menu/:handle`, …). Always build it from
`product.url_handle` — the product's slug, and its id only as a fallback — so
the indexed URL is readable. Use `product.updated_at` for `lastmod`. Keep
`exclude_types: 'subscription'` so plans never appear as PDPs.

PocketBase (or any other data layer) uses the same `{ path, lastmod }` shape.

### Remove a collection

In the same change as deleting the blog, the shop, or the PDPs:

1. Remove the index path from `STATIC_PATHS` (`/blog`, `/shop`, …).
2. Stop emitting that collection from `getDynamicEntries()`. If nothing else
   remains, return `[]`.
3. Confirm the XML no longer lists the index URL or any `/blog/:slug` /
   `/product/:handle` URL.

## Multilingual sites

A translated page is a separate URL, so it gets its own `<url>` entry: a page in
three languages is three entries, not one. Declare which entries are
translations of each other with `xhtml:link` alternates — every entry in a group
lists the whole group, itself included, plus an `x-default` pointing at the URL
served to unmatched languages. The tags below stand in for the locales the site
actually serves.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
	<url>
		<loc>https://example.com/about</loc>
		<xhtml:link rel="alternate" hreflang="en" href="https://example.com/about" />
		<xhtml:link rel="alternate" hreflang="de" href="https://example.com/de/ueber-uns" />
		<xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/about" />
	</url>
	<url>
		<loc>https://example.com/de/ueber-uns</loc>
		<xhtml:link rel="alternate" hreflang="en" href="https://example.com/about" />
		<xhtml:link rel="alternate" hreflang="de" href="https://example.com/de/ueber-uns" />
		<xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/about" />
	</url>
</urlset>
```

The `xmlns:xhtml` declaration on `<urlset>` is required — without it the
alternates are ignored. Each page also serves its own `<html lang>` (see
[special-files.md](./special-files.md)); a sitemap that claims a translation the
page does not declare is worse than no alternates at all.

## Loader rules

- Export only a `loader`. No UI component, no `clientLoader`.
- Return `Response` with:
  - `Content-Type: application/xml; charset=utf-8`
  - `Cache-Control: public, max-age=3600`
- Do **not** wrap this loader in `withApi`. Rate limits and API CSP headers are
  wrong for crawlers.
- Build absolute `<loc>` URLs from `siteOrigin(request)`
  (`@/lib/site-origin.server`). Do not hardcode a domain, and do not use
  `new URL(request.url).origin` — TLS terminates at the proxy, so that reports
  `http://` on an HTTPS site.
- Escape `&`, `<`, `>`, `"`, and `'` in URLs and `lastmod` text.
- Do not add an npm package for sitemaps.

Valid document:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>https://example.com/</loc>
	</url>
	<url>
		<loc>https://example.com/blog/first-post</loc>
		<lastmod>2026-08-18T09:00:00.000Z</lastmod>
	</url>
	<url>
		<loc>https://example.com/product/prod_123</loc>
		<lastmod>2026-08-18T09:00:00.000Z</lastmod>
	</url>
</urlset>
```

## Documents a collection earns

The template ships `/sitemap.xml` and `/robots.txt` because every site needs
them. These two are resource routes you add yourself — same loader rules as
above — and the trigger is mechanical rather than a judgement call.

**`/llms.txt`** (llmstxt.org) belongs to any site with a collection: a blog,
journal, news section, docs, or a shop with product pages. Add it in the same
change that gives those records their sitemap entries. A site that is only
static marketing pages does not get one — an `llms.txt` listing three pages
tells an assistant nothing the sitemap did not.

Register `route('llms.txt', 'routes/llms.txt.ts')` and serve
`text/plain; charset=utf-8`:

```
# Site name

> One sentence about what this site is.

## Pages
- [Journal](https://example.com/blog): Every story, newest first.
- [The lantern lit in 1986](https://example.com/blog/first-post): How one dungeon taught a generation.
```

Build the URLs from `siteOrigin(request)` and the same records the sitemap
lists, and add it to the root route's `Link` header next to the sitemap:
`<${origin}/llms.txt>; rel="describedby"; type="text/plain"`.

**`/rss.xml`** once the site publishes a dated feed (blog, journal, news), with
`<link rel="alternate" type="application/rss+xml">` in `src/root.tsx`.

## Verify after `reload_app`

```bash
curl -sS -i http://localhost:3000/sitemap.xml
curl -sS -i http://localhost:3000/robots.txt
curl -sS -D - http://localhost:3000/ -o /tmp/page.html | rg -i '^link:'
rg -o '<title>[^<]*|rel="canonical"|og:(title|description|url|image|type)|application/ld\+json' /tmp/page.html
```

Expect `200` and `Content-Type: application/xml`. The body must list every
public URL that still exists after the change (home, listing indexes, every
blog post, every PDP), and must omit every URL you removed. `robots.txt` must
answer `200` as `text/plain`; on the sandbox preview host that body is
`Disallow: /`, which is correct. The page must show a title, a canonical link,
the `og:` tags and — on any page with a schema type above — a JSON-LD block.

## Common mistakes

- A public page with no `meta` export, or one returning only `{ title }` — no
  description, no canonical, no social card
- A `meta` export that passes no `image` — the page posts as a text-only card
- Leaving the template's placeholder `favicon.ico` as the site's icon
- Hand-writing `<title>`, `description`, `og:` or canonical tags instead of
  calling `seo()`
- Reusing one title and description across pages, or using the site name as
  every page's title
- Removing the `loader` or `headers` export from `src/root.tsx`, which leaves
  every canonical and `og:url` empty
- Building a blog or a shop and passing no `jsonLd`, so no page is eligible for
  a rich result
- A home page without `WebSite` + `Organization`/`Person`/`LocalBusiness`
  JSON-LD, or any page whose content matches a schema table row but passes no
  `jsonLd`
- Claiming React Router generates sitemaps automatically
- Writing `apps/web/public/sitemap.xml` or `apps/web/public/robots.txt` (shadows
  the resource route)
- Putting every `routes.ts` entry into the sitemap, including `/api/*`, `:slug`,
  cart, and checkout
- Building the document in a page component or `clientLoader`
- Wrapping the loader in `withApi`
- Leaving `getDynamicEntries()` as `[]` while the home page lists journal cards
  or product cards
- Adding a blog without `/blog` and one URL per post
- Adding a shop without the listing path and one PDP URL per product from
  `getProducts({ exclude_types: 'subscription' })`
- Listing only the first page of products (`limit: 24`) instead of paging until
  `offset >= count`
- Removing a blog or shop without stripping its index path and record URLs from
  `src/routes/sitemap.xml.ts`
