# Online Store — subscriptions (recurring billing, plans, gated content)

Read this AFTER `../SKILL.md` when `<files_injected>` contains
`ecommerce-subscriptions-api.ts` or the task is memberships, plans, tiers, or
paywalled content. Activation is already done — do not call enable tools from
this doc.

Subscriptions sit on top of the base store: plans are products of type
`subscription`, and paying still happens on hosted checkout. Every base rule
still applies.

## Injected files — never recreate

| File | What it is | You |
| ---------------------------------------------------- | ---------------------------------------------------------------- | --- |
| `apps/web/src/api/ecommerce-subscriptions-api.ts` | Browser client: read subscriptions, subscribe, manage, post-checkout polling, tier helpers | **import it**; edit only to extend it |
| `apps/web/src/lib/ecommerce-subscriptions.server.ts` | Server-only: store calls with the secret API key, tier gating | never import from the browser (read-only) |
| `apps/web/src/routes/api.ecommerce.subscriptions.ts` | `POST /api/ecommerce/subscriptions` (POST, not GET: per-caller reads must not be cacheable) | **register it**; edit only to extend it |
| `apps/web/src/routes/api.ecommerce.subscriptions.manage.ts` | `POST /api/ecommerce/subscriptions/manage` | **register it**; edit only to extend it |

The client and both routes are yours to edit. You cannot edit away the identity
check: `getUserSubscriptions({ request })` and
`createManageUserSubscriptionUrl({ request, … })` resolve the visitor from the
request's own token inside the read-only server module, so a route can never be
pointed at another visitor's subscriptions or billing portal. What you do have to
keep is in the client: the `ALREADY_SUBSCRIBED` guard and the
`customer.external_id` link to the PocketBase user — without them a visitor gets
charged twice, or pays for a subscription that entitles nobody.

Read `ecommerce-subscriptions-api.ts` before writing UI — its types and comments
are the contract. You write every page, component, and hook yourself.

## Step 1 — register the two resource routes (MANDATORY)

Read `apps/web/src/routes.ts`, keep every existing route, and add both lines. A
route module that is not registered answers 404, so skipping this breaks the
whole feature:

```ts
route('api/ecommerce/subscriptions', 'routes/api.ecommerce.subscriptions.ts'),
route('api/ecommerce/subscriptions/manage', 'routes/api.ecommerce.subscriptions.manage.ts'),
```

## Step 2 — the two pages and everything they must handle

Design both freely, but ship every state below: each one is a real thing that
happens to a paying visitor, and a missing state reads as a broken site. The
paths are only a default worth keeping, because `startSubscriptionCheckout`
returns visitors to `/subscriptions?just_subscribed=1` unless you pass your own.

`/plans` — public pricing page:

- one card per plan, with a billing-period switcher when a plan has several
  variants (monthly / yearly), and the sale price shown as the live price with
  the original struck through when `sale_price_in_cents` is set;
- a "Current plan" badge on the plan the visitor is already on;
- on every *other* plan, a working way to move to it — an
  `Upgrade to <plan>` / `Switch to <plan>` button that opens the billing portal,
  never a Subscribe button and never a dead disabled card (see plan changes
  below);
- a Subscribe button that sends signed-out visitors to login first, since paying
  anonymously entitles nobody.

`/subscriptions` — the visitor's own subscription, sign-in required:

- **activating**: polling after checkout;
- **still processing**: polling ran out, ask them to refresh in a moment;
- **none**: explain the value and link to `/plans`;
- **subscribed**: plan title, `Active` / `Trialing`, renewal date from
  `current_period_end`, the manage button, and — whenever the store sells more
  than one plan — a change-plan entry point (a link to `/plans`, or the portal
  directly).

Link `/plans` from the public nav and `/subscriptions` from the signed-in nav
(header, user menu, and mobile menu). A subscribed visitor must be able to reach
billing from any page — that is the only route to cancelling, so burying it turns
into a support problem.

## Plans are products — load them in a `loader`

Never hardcode tiers or prices; the store owns them.

```tsx
// apps/web/src/routes/plans.tsx
import { getProducts } from '@/api/ecommerce-api';
import type { Route } from './+types/plans';

export async function loader() {
	const { products } = await getProducts({ type: 'subscription' });

	return { plans: products };
}
```

`type: 'subscription'` is the only place plans appear. The storefront is the
mirror image: every product listing passes `exclude_types: 'subscription'`, so a
store selling both keeps plans on the pricing page and one-time products in the
shop. A plan bought through the ordinary cart bypasses sign-in and the
duplicate-charge guard, so it must not be reachable from a product grid.

Each plan's `variants` are its billing periods (monthly, yearly), and one plan
usually has several — let the visitor pick inside the card, and subscribe the
selected variant. Show `formatCurrency(variant.price_in_cents, variant.currency_info)`
plus `billing_interval` so the price reads as recurring.

## Subscribing

The visitor must be signed in **before** paying — that is what links the
subscription to their PocketBase user. Send anonymous visitors to the login page
instead (see the `pocketbase` skill).

```tsx
import { startSubscriptionCheckout } from '@/api/ecommerce-subscriptions-api';

await startSubscriptionCheckout({ variantId: selectedVariant.id });
```

It redirects off-site, so call it from a click handler only.

Handle a rejection rather than only logging it: on `code: 'ALREADY_SUBSCRIBED'`
send them to `/subscriptions`, and on anything else re-read
`getUserSubscriptions()` — if a subscription is there after all, the click raced
a purchase they already made, so route them to `/subscriptions` instead of
showing an error.

## Plan changes, upgrades, downgrades and cancelling

A customer holds **one** subscription, and there is no API for changing or
ending it: upgrading, downgrading, switching monthly to yearly, updating the
card, and cancelling all happen in the billing portal from
`getManageSubscriptionUrl`. Build the entry points to it, never your own
version of these actions.

**Whenever the store has more than one plan, shipping that upgrade path is part
of the job, not an extra.** Tiers exist so people move between them, and a
subscriber who cannot find how to move is a support ticket or a cancellation. So
a subscribed visitor must never see a Subscribe button on another plan
(`startSubscriptionCheckout` rejects with `ALREADY_SUBSCRIBED`, and a second
checkout would be a second charge) — but they must never see a dead greyed-out
card either. Every other plan gets a real button that opens the portal, labelled
by direction:

```tsx
const cheapestInCents = (candidate: ProductListItem) =>
	Math.min(...candidate.variants.map(variant => variant.price_in_cents));

const active = activeSubscription(subscriptions);
const currentPlan = plans.find(candidate => candidate.title === active?.product_title);
const isCurrentPlan = plan.title === active?.product_title;
const isUpgrade = currentPlan ? cheapestInCents(plan) > cheapestInCents(currentPlan) : false;

// isCurrentPlan → "Current plan" badge + manage button
// active        → `Upgrade to ${plan.title}` / `Switch to ${plan.title}` → portal
// otherwise     → Subscribe
```

The portal owns what happens next — proration, the confirmation, the new
invoice — so the button only has to get them there with
`returnUrl: window.location.href`. Never compute a price difference yourself or
promise a specific charge.

After the portal sends them back, re-read `getUserSubscriptions()` on mount so a
change made there shows up immediately — the returning page would otherwise
render the plan they just left.

## After checkout — poll, don't trust the redirect

The store confirms the payment out of band, so a fresh subscription takes a few
seconds to appear and the visitor who just paid lands on a page that still knows
nothing. The client owns the waiting; both pages just render it:

```tsx
useEffect(() => {
	if (!isSubscriptionPending()) return;

	waitForActiveSubscription({ onUpdate: setSubscriptions }).then(({ isActivated }) => {
		setIsPolling(false);
		setIsProcessing(!isActivated);
	});
}, []);
```

Show "activating your subscription…" while it runs and "your payment is still
processing, refresh in a moment" when `isActivated` is false — never "no
subscription found", which reads as a lost payment. On the page a cancelled
checkout returns to (`/plans` by default), call `clearSubscriptionPending()` so
the account page does not wait for a payment that never happened.

## Reading and gating in the browser

The session lives in `localStorage`, so the server cannot see who is asking: page
gating belongs in a `clientLoader`, exactly like `requireAuth`.

`getUserSubscriptions()` requires a signed-in user and answers 401 otherwise —
**never call it when `pb.authStore.isValid` is false**. A hard-gated page calls
`requireAuth()` first, as below. A public page that merely renders differently
per tier (header badge, mixed free/paid listing) checks `pb.authStore.isValid`
and uses `[]` as the signed-out visitor's subscriptions without fetching —
`isSubscribedTo([], FREE_TIER_TITLE)` is already true, so free content renders
with no call at all.

```ts
// apps/web/src/routes/premium.tsx
import { redirect } from 'react-router';
import { requireAuth } from '@/lib/require-auth';
import { getUserSubscriptions, isSubscribedTo } from '@/api/ecommerce-subscriptions-api';

export async function clientLoader() {
	requireAuth();

	const { subscriptions } = await getUserSubscriptions();

	if (!isSubscribedTo(subscriptions, 'Creator')) {
		throw redirect('/plans');
	}

	return { subscriptions };
}
clientLoader.hydrate = true as const;

export function HydrateFallback() {
	return <p>Loading…</p>;
}
```

Helpers on a loaded list: `isSubscribedTo(subscriptions, title)`,
`isSubscribedToAny(subscriptions, titles)`,
`activeSubscription(subscriptions)` (the one to display or manage),
`tierTitles(subscriptions)` (badges, multi-tier checks).

## Gating individual pieces of content

When the paywall is per record rather than per page — some posts free, some
Creator-only — store the allowed tiers on the record itself as a `tier_required`
array (`["Free"]`, `["Creator", "Pro"]`) and check it with `isSubscribedToAny`.
Use one field per gated column (`body_tier_required`) when a record is partly
free, e.g. a public excerpt with a paid body.

```tsx
const canRead = isSubscribedToAny(subscriptions, article.tier_required);
```

`'Free'` (`FREE_TIER_TITLE`) matches everyone, signed in or not, so free content
needs no special case. Render a teaser plus an upgrade CTA to `/plans` for the
rest — never fetch the paid body into the page and hide it with CSS.

If the paid content is worth protecting rather than just gating the UI, serve it
from an `/api/*` **action (POST)** guarded with `requireTierByTitle` or
`hasAnyTierByTitle` (below), because anything a `clientLoader` can read is
readable in the browser.

## Gating an API route

Per-caller gating is **POST-only**. A gated handler must be an `action`, never a
`loader`: published sites edge-cache every `/api/*` GET response by URL for all
visitors, ignoring `Authorization`, and the platform rewrites the app's
`Cache-Control`. On a GET the first subscriber's paid report would be cached and
served to everyone — signed-out visitors included — and `requireUserId` /
`requireTierByTitle` never run on a cache hit, so neither guard helps. GET
*errors* are cached too, so one anonymous 401 would break the endpoint for every
paying subscriber. POST responses are never cached.

Gating works because the browser client sends the PocketBase token with the
request:

```ts
import { apiError, json, withApi } from '@/lib/api.server';
import { requireTierByTitle, requireUserId } from '@/lib/ecommerce-subscriptions.server';

export const action = withApi(async ({ request }) => {
	if (request.method !== 'POST') {
		return apiError(405, 'Method not allowed');
	}

	const userId = await requireUserId(request);

	await requireTierByTitle(userId, 'Creator');

	return json({ report: await buildReport(userId) });
});
```

`requireUserId` answers 401 and `requireTierByTitle` 403 on its own — no
try/catch needed. Fetch such a route with

```ts
await fetch('/api/report', {
	method: 'POST',
	headers: { Authorization: `Bearer ${pb.authStore.token}` },
});
```

For a record carrying its own tier list, gate on
`await hasAnyTierByTitle(userId, record.tier_required)` and answer 403 yourself.

## Managing a subscription

```tsx
const { url } = await getManageSubscriptionUrl({
	subscriptionId: activeSubscription(subscriptions)!.id,
	returnUrl: window.location.href,
});

window.location.href = url;
```

The button belongs anywhere a subscribed visitor looks for billing: the account
page, the current-plan card, and the locked plan cards. Subscriptions paid with a
test card have no portal — the call rejects with `code: 'STRIPE_NOT_CONFIGURED'`,
so render `error.message` as a notice, not a crash. Offer "View plans" instead
when there is no active subscription to manage.

## Rules that catch people out

- **One subscription per customer.** Upgrades, downgrades, card updates and
  cancellation are portal-only; a second checkout is a second charge, and the
  client rejects it with `ALREADY_SUBSCRIBED`.
- **Two or more plans means an upgrade path is required.** Every non-current plan
  card needs a working portal button, and the account page needs a change-plan
  entry point.
- **Plans stay out of the shop.** Product listings pass
  `exclude_types: 'subscription'`; the pricing page is the only place plans are
  rendered, and a plan is never added to the cart.
- **Tier titles must match exactly.** Gate on `product_title` (`'Creator'`, never
  `'Creator Plan'`); `product_id` is generated at runtime and unknown while you
  write code.
- **Only `active` and `trialing` grant access.** `past_due`, `canceled`, `paused`
  and friends must not unlock anything — the helpers already enforce this. Someone
  who cancelled mid-period still reads as `active` until it ends, so gate on
  `status` and never compare `current_period_end` yourself.
- **Re-read subscriptions after sign-in, sign-out and portal returns.** They are
  per visitor, so anything cached across those transitions gates the wrong
  person.
- **Never import `*.server.ts` from a component or hook.** The build fails, and
  the secret API key belongs on the server only.
- **Never call the store's customer or billing endpoints from the browser**, and
  never read `ECOMMERCE_API_KEY` in client code. Go through the two injected
  routes.
- **Signed out means no subscriptions.** Guard the account page with
  `requireAuth` before fetching.
