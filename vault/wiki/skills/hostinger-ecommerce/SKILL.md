---
name: hostinger-ecommerce
description: >
  Build the storefront on the injected Hostinger Online Store client
  (apps/web/src/api/ecommerce-api.ts): product listings, product detail with
  variants, cart, inventory, categories, hosted checkout, and bookable
  appointments (date and time slot picking for salons, clinics, studios,
  consultations). Use after the store is enabled — activation is
  enable_ecommerce_integration in horizons-ai, not this doc. Subscriptions,
  plans, memberships and gated content are covered by
  references/SUBSCRIPTIONS.md once that module is enabled.
---

# Online Store — build the storefront on the typed client

Only one file is injected on this template: **`apps/web/src/api/ecommerce-api.ts`**
— a read-only, fully typed client with this site's store id already baked in.
There are no injected pages, components, or hooks here: **you write the
storefront**, in TypeScript, with this template's own routing and design.

Read the client first (`read_file apps/web/src/api/ecommerce-api.ts`) unless it is
already inlined in `<files_injected>`. Its types and doc comments are the
contract — trust them over any shape described here.

## Never

- Recreate the client, re-export it, or call store endpoints with raw `fetch`.
- Put a product id in a URL. Product links are built from `url_handle` — see
  "Product URLs are slugs, never ids".
- Ship a product page with no `meta` export, or override the merchant's
  `product.seo` (its `noindex` especially) with a title you made up.
- Hardcode products, fake prices, or build a local-only "checkout" — payment
  happens on the hosted checkout URL only.
- Import from `react-router-dom` (gone in v8) or add store logic to
  `react-router.config.ts` / `vite.config.ts`.
- Hand-roll recurring billing. Plans, tiers and gated content need the
  subscriptions module: read `references/SUBSCRIPTIONS.md` when its files are
  injected, and otherwise say it has to be enabled first.

## What the client exposes

| Export | Use |
| ------------------------ | ------------------------------------------------------------- |
| `getProducts(params?)` | Listings, grids, category pages. Returns `{ count, offset, limit, products }`. Always pass `exclude_types: 'subscription'` |
| `getProductByHandle(handle)` | **Detail page.** Resolves a `url_handle` — slug or id — and adds `status`, `created_at`, `metadata` |
| `getProduct(id)` | The same product when you already hold an id (a cart line, a related-product id), not a URL segment |
| `getProductBySlug(slug)` | Slug-only lookup, for a value you know is a slug |
| `searchProducts({ query })` | Free-text search across this sales channel. Returns `{ count, products }` of `SearchProduct` — price and availability only, so fetch the product for anything more |
| `getProductQuantities()` | Live stock right before add-to-cart or checkout |
| `getCategories()` | Filters and menus; match `Category.id` to `product.collections[].collection_id` |
| `initializeCheckout()` | Creates the payment session, returns the URL to redirect to |
| `formatCurrency()` | Cents → display string, using the currency's own decimals |
| `toPriceUnits()` | Cents → bare decimal string for JSON-LD `offers.price`. Never for display |
| `getAvailability()` | Appointments: which days have a free slot. Browser only |
| `getTimeSlots()` | Appointments: the free start times for one day. Browser only |
| `isBookingSlotTakenError()` | Appointments: whether checkout failed because the slot just went |

Types worth importing: `ProductListItem`, `Product`, `ProductVariant`,
`SearchProduct`, `ProductSeo`, `CurrencyInfo`, `CheckoutItem`, `BookingEvent`.

## Routes to create

Create route modules under `apps/web/src/routes/` and register every one in
`apps/web/src/routes.ts` — a file alone is not a route:

```ts
route('shop', 'routes/shop.tsx'),
route('product/:handle', 'routes/product.$handle.tsx'),
route('cart', 'routes/cart.tsx'),
route('checkout/success', 'routes/checkout.success.tsx'),
route('checkout/cancelled', 'routes/checkout.cancelled.tsx'),
```

Name and place them to fit the site (`/store`, `/menu`, `/products` are all fine)
and link them from the nav in `root.tsx`.

`/checkout` itself is reserved: the platform serves the checkout page there.
Never create a route, page, redirect or file at `/checkout` — only the
`checkout/success` and `checkout/cancelled` children above.

In that same change, update `src/routes/sitemap.xml.ts`: put the listing path
(`/shop`) in `STATIC_PATHS`, and emit one URL per product from
`getDynamicEntries()` via `getProducts({ exclude_types: 'subscription' })`,
using `product.url_handle` for the path. Cart, checkout, and subscription plans
stay out of the sitemap. Removing the store strips those URLs too. Load
`../react-router-framework-mode/references/seo-sitemap.md`.

## Product URLs are slugs, never ids

Every link to a product uses **`product.url_handle`**. It is the merchant's SEO
slug, and only falls back to the id for a product that has none, so
`/product/blue-mug` is what gets indexed and shared instead of
`/product/prod_01J7Z...`. The client fills it in on every product the store
returns with an id, so link with it directly rather than assembling a handle of
your own:

```tsx
<Link to={`/product/${product.url_handle}`}>{product.title}</Link>
```

This holds for **every** way into a product page — grid cards, search hits
(`SearchProduct.url_handle`), related products, the booking `cancelUrl`, and the
sitemap. `product.id` stays in the code that needs an id: cart lines,
`getProductQuantities`, and matching related-product ids.

So the route segment is a handle, and the loader resolves it with
`getProductByHandle`, which takes a slug or an id and therefore still answers an
id URL that was already indexed or bookmarked:

```tsx
// apps/web/src/routes/product.$handle.tsx
import { EcommerceApiError, getProductByHandle } from '@/api/ecommerce-api';
import type { Route } from './+types/product.$handle';

export async function loader({ params }: Route.LoaderArgs) {
	try {
		return { product: await getProductByHandle(params.handle) };
	}
	catch (error) {
		if (error instanceof EcommerceApiError && error.status === 404) {
			throw new Response('Not found', { status: 404 });
		}

		throw error;
	}
}
```

A merchant can rename a slug at any time, so a handle that stops resolving is an
ordinary 404 for the error boundary — not something to guard against by falling
back to id URLs.

This catch is not product-page-specific: **every loader that calls the
ecommerce client** maps an `EcommerceApiError` with `status === 404` to
`throw new Response('Not found', { status: 404 })` the same way. Uncaught, it
fails the whole route as a 500 error page — one deleted product must render the
error boundary as a 404, not take the page down.

**On a storefront that already routes on `:id`**, move the whole route over in
one edit: loader to `getProductByHandle`, then the segment and the filename to
`handle`. No live URL breaks, because `getProductByHandle` still resolves the
ids those pages were linked with. What you must never do is leave the `:id`
route in place and start linking `url_handle` — the loader would look a slug up
as an id and every card would 404. Links and route must change together.

## Products load in a `loader`

The store API is public, so fetch on the server: the HTML ships with the products
in it, which is what makes product pages indexable.

```tsx
// apps/web/src/routes/shop.tsx
import { getProducts } from '@/api/ecommerce-api';
import type { Route } from './+types/shop';

export async function loader() {
	const { products } = await getProducts({
		limit: 24,
		sort_by: 'order',
		order: 'ASC',
		exclude_types: 'subscription',
	});

	return { products };
}

export default function Shop({ loaderData }: Route.ComponentProps) {
	return <ProductGrid products={loaderData.products} />;
}
```

Detail pages load the same way, through `getProductByHandle(params.handle)` —
see the loader above.

## Product pages carry the merchant's SEO

The merchant sets a title, meta description, social image and `noindex` per
product in the store admin. The client returns them resolved as **`product.seo`**
— already falling back to the product's own title, description and thumbnail —
so a page that invents its own title throws that work away. Every product route
gets a `meta` export built from it:

```tsx
// apps/web/src/routes/product.$handle.tsx
import { absoluteUrl, seo, siteOriginFrom } from '@/lib/seo';
import type { Route } from './+types/product.$handle';

export function meta({ matches, location, loaderData }: Route.MetaArgs) {
	if (!loaderData) {
		return seo({ matches, location }, {
			title: 'Product not found',
			description: 'This product is no longer available.',
			noindex: true,
		});
	}

	const { product } = loaderData;

	return seo({ matches, location }, {
		title: product.seo.title,
		description: product.seo.description,
		image: product.seo.image,
		noindex: product.seo.noindex,
		jsonLd: productJsonLd(product, absoluteUrl(siteOriginFrom(matches), location.pathname)),
	});
}
```

- **`noindex` is the merchant's decision.** Pass it straight through — a product
  they chose to hide must not be indexed because the page looked fine to you.
- `product.seo.description` is already plain text trimmed to ~160 characters.
  Never pass the raw `description`; it is HTML.
- `keywords` and `focusKeyword` belong in the copy on the page, not in a
  `<meta name="keywords">` tag — search engines ignore that tag.
- Listing and category pages are not products, so give them their own `meta`
  written to match the site.

Add `Product` structured data from the same loader data — it is what earns the
price and star-rating rich results:

```ts
import { toPriceUnits } from '@/api/ecommerce-api';
import type { Product } from '@/api/ecommerce-api';

const productJsonLd = (product: Product, url: string) => {
	const images = product.images.length
		? product.images.map(image => image.url)
		: [product.seo.image].filter(Boolean);

	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: product.title,
		description: product.seo.description,
		...(images.length ? { image: images } : {}),
		sku: product.variants[0]?.sku || undefined,
		offers: {
			'@type': 'Offer',
			url,
			price: toPriceUnits(product.price_in_cents, product.currency_info),
			priceCurrency: product.currency.toUpperCase(),
			availability: product.purchasable
				? 'https://schema.org/InStock'
				: 'https://schema.org/OutOfStock',
		},
		...(product.reviews_analytics && product.reviews_analytics.total_reviews > 0
			? {
				aggregateRating: {
					'@type': 'AggregateRating',
					ratingValue: product.reviews_analytics.average_rating,
					reviewCount: product.reviews_analytics.total_reviews,
				},
			}
			: {}),
	};
};
```

`offers.price` is a decimal amount, so build it with `toPriceUnits`: passing
`price_in_cents` advertises a price 100x too high, and dividing by 100 yourself
breaks zero-decimal currencies like JPY. Only include `aggregateRating` when
`total_reviews > 0` — inventing one is a structured data violation. Leave
`image` out entirely when the product has none: an empty string there is an
invalid URL, and Google drops the whole Product snippet over it, price included.

## Plans never belong in a product list

Subscription plans are products too, so an unfiltered `getProducts()` returns
them mixed in with the things people buy once. **Every** storefront query —
listings, category pages, search, featured rails, related products — must pass
`exclude_types: 'subscription'`, and a plan must never get a product card, a
detail page link, or an add-to-cart button. Buying a plan through the normal cart
skips the sign-in that ties the subscription to a visitor and the duplicate-charge
guard, so it produces a subscription nobody owns.

Plans are listed on their own pricing page with `getProducts({ type: 'subscription' })`
(see `references/SUBSCRIPTIONS.md`). When you already hold a loaded list and need
the same split in memory, `product.type.value === 'subscription'` identifies a
plan.

## Donations — customer-entered amounts

A donation product differs from an ordinary product only in **how the amount is
chosen**. Its fixed **preset amounts are ordinary priced variants**. The merchant
may also turn on a **customer-priced variant**, which the client exposes as
**`variant.donation`** (`{ allow_custom_amount, min_amount, max_amount }`, all in
cents). **Detect the custom option from `variant.donation` — never from the variant
title or the product type.** The field is the contract; the client provides it, so
do not fall back to string-matching "Custom amount".

**Never put a donation's amounts in a `<select>`.** A price-bearing dropdown
(`Custom amount — €6,700.00`) leaks the placeholder price and hides the input. Build
the expected layout instead: the presets as a row of selectable **chips**, and,
when a `donation` variant exists, an **"Or enter your own"** amount field beneath
them.

Rules:

- The custom variant's `price_in_cents` is a **placeholder, not a price** — never
  render it anywhere (no chip, no dropdown option, no "Your gift €6,700").
- **Whenever a `donation` variant exists, build the amount input in the first
  pass** — it is the point of the feature, not an add-on to bolt on when asked.
- Validate the typed amount against `donation.min_amount` / `donation.max_amount`
  (null max means no upper limit). Those bounds are in **minor units**, so convert
  the buyer's input with the currency's own `currency_info.decimal_digits` — a
  hardcoded ×100 is 100x wrong in a zero-decimal currency like JPY. Build the hint
  with `formatCurrency` — **never hardcode a minimum**.
- A custom-amount line is **always one unit**: no quantity stepper.

```tsx
// A donation product's buy block: preset chips + "enter your own".
const presets = product.variants.filter(variant => !variant.donation);
const custom = product.variants.find(variant => variant.donation?.allow_custom_amount);
const [presetId, setPresetId] = useState(presets[0]?.id ?? '');
const [useCustom, setUseCustom] = useState(!presets.length);
const [amount, setAmount] = useState(''); // major units, what the buyer typed
const bounds = custom?.donation;
// The bounds are in minor units; the buyer types major units. Convert with the
// currency's own decimals — never a hardcoded 100, which is 100x off in JPY.
const decimals = Number.isInteger(custom?.currency_info?.decimal_digits) ? custom!.currency_info!.decimal_digits! : 2;
const factor = 10 ** decimals;
const rangeHint = bounds && (bounds.max_amount != null
	? `${formatCurrency(bounds.min_amount, custom!.currency_info)} – ${formatCurrency(bounds.max_amount, custom!.currency_info)}`
	: `Minimum ${formatCurrency(bounds.min_amount, custom!.currency_info)}`);

const addDonation = () => {
	if (useCustom && custom && bounds) {
		const minor = Math.round(parseFloat(amount) * factor);
		if (!Number.isFinite(minor) || minor < bounds.min_amount
			|| (bounds.max_amount != null && minor > bounds.max_amount)) {
			return setError(rangeHint);
		}
		// One line, its own price, never merged with another gift.
		addLine({ variantId: custom.id, quantity: 1, priceInCents: minor, donationAmountInCents: minor });
	} else {
		const variant = presets.find(preset => preset.id === presetId)!;
		addLine({ variantId: variant.id, quantity: 1, priceInCents: variant.price_in_cents });
	}
};

return (
	<>
		{presets.length > 0 && (
			<div role="group" aria-label="Donation amount">
				{presets.map(variant => (
					<button key={variant.id} type="button" aria-pressed={!useCustom && presetId === variant.id}
						onClick={() => { setUseCustom(false); setPresetId(variant.id); }}>
						{variant.price_formatted}
					</button>
				))}
			</div>
		)}
		{custom && (
			<label>
				Or enter your own
				<input type="number" inputMode="decimal" placeholder="Enter amount" value={amount}
					min={bounds!.min_amount / factor} step={1 / factor}
					onFocus={() => setUseCustom(true)}
					onChange={event => { setUseCustom(true); setAmount(event.target.value); }} />
				<span>{rangeHint}</span>
			</label>
		)}
	</>
);
```

The cart line carries the amount as `donationAmountInCents` (see the cart example
below), and checkout sends it as `donation_amount` (integer cents) with
`quantity: 1`. The store rejects `donation_amount` on a non-donation variant and
rejects any quantity other than 1.

**Never gate a donation on stock.** A donation is not inventory-tracked:
`manage_inventory` is false and `inventory_quantity` comes back `0`/null. Any
availability check that reads `inventory_quantity` — the classic
`quantity > inventory_quantity` guard on the cart or checkout button — reads that
`0` as "sold out" and blocks the gift. **Guard every stock check with
`manage_inventory === true` first**, so a donation (and any service or
custom-amount variant, which are also untracked) is always purchasable.

**React to `donation`, never assume it.** If no variant carries `donation`, there
is no customer-entered flow — sell the presets and do not invent an amount field or
claim the site supports one.

## Cart lives in the browser

There is no cart endpoint. Keep the cart in your own hook, persisted under the
`localStorage` key `e-commerce-cart`, and store the **variant id** on every line —
that, plus a custom-amount donation's entered amount, is all checkout consumes.

Because this template renders on the server, never read `localStorage` while
rendering; hydrate it in an effect, exactly like `src/hooks/use-auth.ts`:

```ts
// apps/web/src/hooks/use-cart.ts
import { useEffect, useState } from 'react';
import type { CurrencyInfo } from '@/api/ecommerce-api';

const CART_KEY = 'e-commerce-cart';

export type CartLine = {
	productId: string;
	variantId: string;
	title: string;
	priceInCents: number;
	currencyInfo: CurrencyInfo | null;
	image: string | null;
	quantity: number;
	// Set only on a custom-amount donation line: the buyer's amount in cents, which
	// is also this line's `priceInCents`. Always quantity 1, and never merged.
	donationAmountInCents?: number;
};

export function useCart() {
	const [lines, setLines] = useState<CartLine[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const stored = localStorage.getItem(CART_KEY);
		setLines(stored ? JSON.parse(stored) : []);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		if (!isLoading) {
			localStorage.setItem(CART_KEY, JSON.stringify(lines));
		}
	}, [lines, isLoading]);

	// addLine, setQuantity, removeLine, totalInCents, and a useCallback `clear` —
	// the checkout success page depends on `clear` being stable. Merge by variantId
	// only for ordinary lines; a donation line (donationAmountInCents set) is its
	// own line, keyed by variantId + amount, and setQuantity/removeLine must key by
	// that, not variantId alone, or the two gifts move together. totalInCents sums
	// priceInCents, which already holds each donation amount.
}
```

Render a skeleton or a neutral badge while `isLoading` is true, or the cart count
flashes 0 on every page load.

## The cart needs a way in (required)

Always build the cart affordance itself, not just the page behind it: a cart
button in the site header in `root.tsx`, on every page, showing the line count as
a badge once hydrated. Either open a slide-over panel with the lines, quantity
controls, total and the checkout button, or link to `/cart` — a cart page with no
header entry point is a cart nobody finds.

Add-to-cart must confirm itself too (a toast, or the badge visibly incrementing),
otherwise the click reads as broken.

## Checkout

A click handler, never a loader — it needs `window.location.origin` and ends in a
full-page redirect to the checkout:

```tsx
const { url } = await initializeCheckout({
	items: lines.map(line => ({
		variant_id: line.variantId,
		quantity: line.quantity,
		...(line.donationAmountInCents ? { donation_amount: line.donationAmountInCents } : {}),
	})),
	successUrl: `${window.location.origin}/checkout/success`,
	cancelUrl: `${window.location.origin}/checkout/cancelled`,
	customer: user ? { external_id: user.id, email: user.email } : undefined,
});

window.location.href = url;
```

Pass `customer` only when PocketBase is enabled and someone is signed in (see the
`pocketbase` skill) — it links the order to that `users` record.

Never clear the cart before the redirect: the buyer may still abandon checkout,
and they must come back to a full cart.

## Appointments are booked, not added to a cart

A product with `type.value === 'booking'` is an appointment: the visitor picks a
day and a time, then pays for that slot. Its variant carries `booking_event`
(duration, location, and the `id` the two availability calls need); a product
without one cannot be booked, so say so instead of rendering a picker.

**An appointment never enters the cart.** Checkout refuses a booking sitting
alongside anything else, and a slot has to be chosen first, so a card in a listing
gets a "Book" button that navigates to the detail page — not add-to-cart. Keep the
cart hook free of bookings entirely rather than filtering them at checkout time.

The slots load in the browser, never in a `loader`. They are answered in a time
zone, and on the server that would be the server's, so the visitor would be
offered the wrong times; availability also changes as other people book, while
server-rendered HTML is edge-cached for a week. So the product page keeps its
normal `loader` — that is what gets indexed — and the picker fetches days in an
effect once it is mounted:

```tsx
// apps/web/src/components/booking-slot-picker.tsx
import { useEffect, useState } from 'react';
import { getAvailability, getTimeSlots, initializeCheckout, isBookingSlotTakenError } from '@/api/ecommerce-api';
import type { Product, ProductVariant } from '@/api/ecommerce-api';

// Local `YYYY-MM-DD`, which is what both calls take — not a UTC ISO slice.
// Explicit options (without timeZone) keep the visitor's zone and satisfy lint.
const toDateKey = (date: Date) =>
	date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

export function BookingSlotPicker({ product, variant }: { product: Product; variant: ProductVariant }) {
	// The id, not the event object: a re-normalized variant is a new object every
	// time, and depending on it would re-fetch availability that has not changed.
	const bookingEventId = variant.booking_event?.id;
	const [days, setDays] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!bookingEventId) {
			return;
		}

		let isCurrent = true;
		const today = new Date();
		const windowEnd = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);

		getAvailability({ bookingEventId, fromDate: toDateKey(today), toDate: toDateKey(windowEnd) })
			.then(({ available_dates }) => isCurrent && setDays(available_dates))
			.catch(() => isCurrent && setError('Could not load availability.'));

		return () => {
			isCurrent = false;
		};
	}, [bookingEventId]);
	// ...
}
```

Do not reach for a `clientLoader` here: making it run on the first load costs the
page its server-rendered HTML, and leaving it off means the picker has no dates
until the visitor navigates.

Selecting a day then calls `getTimeSlots({ bookingEventId, date })`, which returns
`slots` plus the `time_zone` they are expressed in. Pass a slot string through
**verbatim** — never reformat or re-parse it into another zone:

```tsx
const { slots, time_zone } = await getTimeSlots({ bookingEventId, date: selectedDay });

// ...visitor picks `slot`, then:
try {
	const { url } = await initializeCheckout({
		items: [{ variant_id: variant.id, quantity: 1, time_slot: slot, time_zone }],
		successUrl: `${window.location.origin}/checkout/success`,
		cancelUrl: `${window.location.origin}/product/${product.url_handle}`,
	});

	window.location.href = url;
}
catch (error) {
	if (isBookingSlotTakenError(error)) {
		// Someone paid for it first. Re-list the day and ask for another time.
		await refreshSlots();
	}
}
```

What the picker has to cover:

- **It replaces the whole buy block.** No quantity selector (checkout is always
  `quantity: 1`) and no stock messages — a booking does not manage inventory,
  the slot list *is* its availability.
- **Both loading states and both empty ones.** Loading days, loading times, "no
  times available right now" for an empty `available_dates`, and "nothing left on
  this day" for an empty `slots`. Offer only `available_dates`; the rest of the
  range comes back as `disabled_dates`.
- **Open ready, not empty.** Pre-select the first available day (sort
  `available_dates` first) and load its times immediately, instead of waiting for
  a click before showing anything bookable.
- **The slot going stale.** Listing a slot does not hold it, so a conflict at
  checkout is normal: on `isBookingSlotTakenError`, re-fetch the day, clear the
  selection, and tell the visitor to pick again. Any other error is a generic
  "could not start checkout".
- **Show the zone** the times are in ("Times shown in Europe/Vilnius"), or a
  visitor in another zone cannot tell what they booked.
- **Duration and location** from `booking_event`: `length` is in
  **milliseconds** (`length_unit` is a display label, not a multiplier), and the
  place to show comes from `location_type` — `location` for `physical`, the
  meeting link for `online` / `online_auto_generated`, `phone_number` for
  `phone`.
- **`custom_fields`** work as they do anywhere else: collect them next to the
  slot and send them as `custom_field_values` on the single item.
- **`purchasable: false`** disables booking, exactly like a buy button.

`cancelUrl` should come back to the product page rather than `/checkout/cancelled`
when nothing was in the cart — there is no cart to reassure them about, just a
slot they did not take.

## Both checkout return pages are required

Payment happens off-site, so the two URLs you pass are where the buyer lands
afterwards. Build and register both — an unregistered `successUrl` means the
person who just paid gets a 404:

`/checkout/success` — **empties the cart** and confirms the purchase. Clearing it
here is the only thing that empties it, since the store never touches
`localStorage`; without it the buyer keeps a cart full of items they already own
and can pay for them twice. Also thank them, say the order is confirmed and a
receipt is on its way, and link back to the shop and (when PocketBase accounts
exist) to their account.

```tsx
// apps/web/src/routes/checkout.success.tsx
import { useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';

export default function CheckoutSuccess() {
	const { isLoading, clear } = useCart();

	useEffect(() => {
		if (!isLoading) {
			clear();
		}
	}, [isLoading, clear]);

	return <OrderConfirmation />;
}
```

The `isLoading` guard matters: clearing before the hook has hydrated is undone a
tick later when the stored cart loads. Keep `clear` stable with `useCallback` so
the effect does not loop, and if the page shows what was bought, copy `lines`
into state inside that same effect before clearing.

`/checkout/cancelled` — the `cancelUrl` landing. Payment was **not** taken and the
cart is untouched, so say exactly that and offer the way back to checkout. Sending
`cancelUrl` straight to `/cart` is also fine, but then that page has to explain
the abandoned attempt rather than leaving the buyer guessing whether they were
charged.

Neither page can verify the payment — they are told by the store which URL to
open, nothing more. So never treat the success route as proof of an order in code
(no crediting accounts, no unlocking downloads from it), and never show an error
on the cancelled route; nothing failed, the buyer just walked away.

## Rules that catch people out

- **Links use `url_handle`.** `product.id` in a URL is a bug: it costs the page
  its readable, keyword-bearing path. Route on `:handle` and resolve with
  `getProductByHandle`.
- **Money is in cents.** Never divide by 100 yourself: use
  `formatCurrency(cents, variant.currency_info)` or a variant's
  `price_formatted` / `sale_price_formatted` (empty string when not on sale).
  A `ProductListItem.price_in_cents` is already the sale price when on sale.
- **Variants.** `variant_id` is what gets bought. A product with `options` must
  have a variant selected on a detail page before add-to-cart; single-variant
  products can add straight from a card — unless that variant is a custom-amount
  donation (`donation.allow_custom_amount`), which needs the product page's amount
  input, so its card links there instead.
- **Stock.** Only constrain quantity when `variant.manage_inventory === true`,
  and refresh with `getProductQuantities` before checkout — a cached list goes
  stale. Ignore `inventory_quantity` otherwise: a variant with `manage_inventory`
  false (donations, services) reports `0` but is always available, so a
  `quantity > inventory_quantity` gate must never run for it — or it blocks
  add-to-cart and checkout for a perfectly purchasable item.
- **`purchasable: false`** means hide or disable the buy button.
- **HTML fields.** `description` and `additional_info[].description` are HTML;
  render them with `dangerouslySetInnerHTML` inside a styled wrapper, not as text.
- **Images.** Sort `images` by `order`; `image` is the thumbnail.

## Design

Match the rest of the site rather than shipping a generic grid: reuse existing
Tailwind theme tokens, typography, radii, and button styles, and follow
`design/SKILL.md` when it is present.
