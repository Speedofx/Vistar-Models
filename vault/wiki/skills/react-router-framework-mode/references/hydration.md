---
title: Hydration-Safe Rendering
description: Preventing "Hydration failed because the server rendered text/HTML didn't match the client"
tags: [hydration, ssr, timezone, locale, mismatch, useHydrated, date-fns, useId, theme]
---

# Hydration-Safe Rendering

This app server-renders every page, then React hydrates that HTML in the
browser. **The first client render must produce exactly the markup the server
produced.** When it doesn't, React logs
`Hydration failed because the server rendered text/HTML didn't match the client`,
throws away the server HTML, and re-renders the whole tree from scratch — the
page flashes, loads slower, and the editor reports the error on every visit.

The server runs in **UTC with a fixed locale**; the visitor's browser runs in
**their own timezone and locale**. Anything rendered from those environments —
or from state only the browser has — will differ between the two renders.

## The rules

### 1. Never render locale- or timezone-dependent formatting bare

This is the most common mismatch in production by far.

```tsx
// ❌ Server says "12/25/2025", a German visitor's browser says "25.12.2025" —
//    and near midnight even the date itself differs between UTC and their zone.
<span>{new Date(post.publishedAt).toLocaleDateString()}</span>

// ✅ Explicit locale AND timeZone make the output identical everywhere.
<span>
  {new Date(post.publishedAt).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    dateStyle: 'medium',
  })}
</span>
```

The same applies to `toLocaleTimeString` and `toLocaleString` (dates *and*
numbers — `(1234.5).toLocaleString()` is `1,234.5` or `1.234,5` depending on
the runtime). A locale of `undefined` or `'default'` means "the runtime's
locale", so it counts as bare. ESLint enforces this: bare calls fail the lint
run **everywhere**,
including inside effects and event handlers. In client-only code that should
deliberately use the visitor's zone (e.g. a local `YYYY-MM-DD` day key for a
booking picker), still pass a locale and options — just omit `timeZone`:
`date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })`.

Centralize formatting in `src/lib/format.ts` helpers so the explicit
locale/timeZone lives in one place:

```ts
// src/lib/format.ts
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { timeZone: 'UTC', dateStyle: 'medium' });

export const formatPrice = (amount: number) =>
  amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
```

To show a date/time in the *visitor's* zone (event countdowns, "posted 3 hours
ago"), render the server-safe absolute form first and switch to the local form
after hydration — see `useHydrated` below.

#### Timezone traps lint cannot see

These pass lint but still render a different day or hour on the server (UTC)
than in a visitor's browser — usually only near midnight, so they slip through
testing:

- **`date-fns`** — `format(date, 'PP')`, `isToday`, `startOfDay`,
  `differenceInCalendarDays` all work in the runtime's local zone. In
  server-rendered output, format with `toLocaleDateString('en-US', { timeZone:
  'UTC', … })` instead, or run `date-fns` only after hydration.
- **Local-time getters** — `getDate()`, `getDay()`, `getMonth()`,
  `getHours()`, `getTimezoneOffset()`, `toDateString()`, `toString()`,
  `String(date)`. In render, use the `getUTC*()` getters.
- **`date.toLocaleString('en-US')` without `timeZone`** — a fixed locale is not
  enough for a Date; the hour still comes from the runtime's zone.
- **`Intl.DateTimeFormat` / `Intl.NumberFormat` / `Intl.RelativeTimeFormat`**
  — the same rules as `toLocale*`: always pass a locale, and a `timeZone` for
  server-rendered dates.
- **Zone-less parsing** — `new Date('2025-06-01T10:00')` and
  `new Date(2025, 5, 1)` are read as *local* time, so server and browser hold
  different instants. That is wrong for a moment in time (an event start) but
  fine for a calendar date, as long as you format it locally (see below).
  `new Date('2025-06-01')` and strings ending in `Z` or an offset are safe
  instants.

`timeZone: 'UTC'` is for **instants** — timestamps from a loader or the API.
Never add it to dates built at *local* midnight, like `new Date(y, m, d)` or the
days and months `react-day-picker` generates. Those are the same local calendar
date on both sides, so format them in local time (locale and options, no
`timeZone`). Formatting them in UTC shifts every label back one day for visitors
east of UTC, and brings the mismatch back.

### 2. No `Date.now()`, `new Date()` (current time), or `Math.random()` in render

The server and client evaluate them at different moments, so the output never
matches. Copyright years, countdowns, rotating quotes, randomized hero
variants, particle/confetti seeds — all of it.

```tsx
// ❌ Evaluated once on the server, again in the browser
const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

// ✅ Deterministic on both renders, randomized after hydration
const [quote, setQuote] = useState(QUOTES[0]);
useEffect(() => {
  setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
}, []);
```

For a random pick that must not visibly swap after load, generate it in the
`loader` — loader data is serialized to the client, so both renders see the
same value.

**Ids** follow the same rule: `crypto.randomUUID()`, `nanoid()` or a
module-level counter (`let nextId = 0`) produce different `id` / `htmlFor` /
`aria-*` values on each render. Use `useId()` — React generates the same id on
server and client.

**The shadcn `Calendar`** (`react-day-picker`) picks its initial month and the
"today" highlight from the current local date. Server-rendered, it disagrees
with the browser near midnight and at month boundaries. Pass `month` (and
`today`) derived from loader data, or render the calendar behind
`useHydrated()` when it sits below the fold or inside a popover anyway.

### 3. No `typeof window` / `navigator` / `matchMedia` branches in render

A branch on browser globals renders one tree on the server and another in the
browser. Use the shipped hooks instead:

- `useIsMobile()` from `@/hooks/use-mobile` — viewport queries
- `useHydrated()` from `@/hooks/use-hydrated` — everything else

```tsx
// ❌ Server renders the fallback, client renders the widget — tree mismatch
{typeof window !== 'undefined' && <LiveChatWidget />}

// ✅ Both first renders agree (false); the widget mounts right after hydration
const hydrated = useHydrated();
{hydrated && <LiveChatWidget />}
```

Two branches that look server-safe but are not:

- `import.meta.env.SSR` in render is the same as `typeof window` — it is `true`
  on the server and `false` in the browser.
- `useLocation().hash` — browsers never send the `#fragment` to the server, so
  it is always `''` there. Derive an active tab or section from the hash after
  hydration, or move it to a search param (`?tab=…`), which the server does see.

`@/hooks/use-hydrated` ships with the template and is **read-only** — import
it, never edit or recreate it. A variant that "simplifies" it to `useState` +
`useEffect`, or seeds state with `typeof window !== 'undefined'`, reintroduces
the mismatch it exists to prevent. To build on it (a delayed reveal, a media
query), compose it from a new hook instead.

### 4. localStorage / auth state is filled in after hydration

The server cannot read `localStorage`, so any UI derived from it (auth state,
theme, cart badge, saved preferences) must render its **loading/empty state**
first and update after mount. `useAuth()` already works this way — render on
`isLoading` rather than the signed-out state (see `references/sessions.md`).
Never read `localStorage` in a component body or `useState` initializer;
read it in `useEffect` or a `clientLoader`.

**Dark mode via `next-themes`** is the one sanctioned exception to "no DOM
changes before hydration": its `ThemeProvider` runs an inline script that sets
the theme class on `<html>` before React loads, which is why `<html>` and
`<body>` in `src/root.tsx` carry `suppressHydrationWarning` — keep both. They
also absorb attributes browser extensions (Grammarly, dark-mode tools, password
managers) inject before React loads. That only covers the `<html>`/`<body>`
attributes: `useTheme().theme` / `resolvedTheme` are still unknown on the
server, so a theme toggle's icon or label must render behind `useHydrated()`.
Style theme differences with Tailwind `dark:` classes rather than branching on
`resolvedTheme` in JSX.

### 5. Keep the HTML valid

Browsers rewrite invalid nesting before React sees it, so the DOM no longer
matches what the server sent. Classic offenders: `<div>` or `<p>` inside
`<p>`, `<a>` inside `<a>`, `<button>` inside `<button>`, `<form>` inside
`<form>`, `<tr>` directly inside `<table>` (needs `<tbody>`). Components hide
this: a shadcn `Button` inside a `Card` wrapped in a `<Link>` or `<button>` is
interactive-inside-interactive — use `Button asChild` around the `Link`
instead of nesting them.

## Last resort: `suppressHydrationWarning`

For a single element whose text is *intentionally* different per client (a
clock, a relative timestamp), `suppressHydrationWarning` on that element stops
React from treating the difference as an error:

```tsx
<time suppressHydrationWarning>{new Date().toLocaleTimeString('en-US', { timeZone: 'UTC' })}</time>
```

It only reaches one element deep, it hides real bugs when used broadly, and it
never fixes a *tree* mismatch — prefer the patterns above and reach for it
only when a per-client value truly must be in the first paint.

## Debugging a reported mismatch

1. Reproduce in the browser console — the dev error names the mismatched
   component and shows a server/client diff below the message.
2. Look for the causes above in that component, in this order: locale/timezone
   formatting (including `date-fns` and local-time getters) → current
   time/randomness/generated ids → browser-global and `location.hash` branches
   → localStorage/theme-derived state → invalid nesting.
3. Fix the source. Do not wrap the tree in `suppressHydrationWarning` or gate
   whole pages behind `useHydrated()` — that trades correctness for an SPA-shaped
   page and gives up the SEO the SSR template exists for.
