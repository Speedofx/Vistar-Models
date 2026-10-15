---
title: useEffect Discipline
description: When not to use useEffect — derived state, fetching, mutations, resets, and the few legitimate uses
tags: [useEffect, effects, derived state, loader, action, useFetcher, useSyncExternalStore, useEffectEvent]
---

# useEffect Discipline

`useEffect` is the most abused hook in React, and most uses in generated sites
are compensating for something React or React Router already handles better.
Effects are **not** "run this after render / on mount" — they exist to sync
React with external systems React does not own (subscriptions, third-party
libraries, browser APIs). Everything else has a better home. The React docs
cover this in *You Might Not Need an Effect*.

Why it goes wrong:

- **Derived state trap.** Computing a value into `useState` and "syncing" it
  with an effect adds an extra render, staleness, and race conditions.
- **Data fetching is a bad fit.** `useEffect` + `fetch` means race conditions,
  no caching, loading/error boilerplate, and request waterfalls — and on this
  template it skips SSR entirely, so the page ships empty HTML.
- **Dependency array hell.** Missing deps are stale closures; extra deps are
  infinite loops — a `useEffect` fetch loop is what trips the platform's
  rate limit (429s).

Legitimate uses still exist (subscribing to external stores, setting up and
tearing down non-React things, measurements), but they should be rare.

## Before / After

### 1. Derived state (most common misuse)

```tsx
// ❌ Before: extra state + extra render
function FilteredList({ items, query }: Props) {
  const [filtered, setFiltered] = useState<Item[]>([]);
  useEffect(() => {
    setFiltered(items.filter((item) => item.name.includes(query)));
  }, [items, query]);
  return <ul>{filtered.map((i) => <li key={i.id}>{i.name}</li>)}</ul>;
}

// ✅ After: just compute it (useMemo only if expensive)
function FilteredList({ items, query }: Props) {
  const filtered = items.filter((item) => item.name.includes(query));
  return <ul>{filtered.map((i) => <li key={i.id}>{i.name}</li>)}</ul>;
}
```

### 2. Data fetching → route loader

```tsx
// ❌ Before: race-condition prone, renders empty on the server
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/users/${userId}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setUser(data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);
  if (loading) return <Spinner />;
  return <h1>{user?.name}</h1>;
}

// ✅ After: src/routes/users.$userId.tsx
import type { Route } from "./+types/users.$userId";

export async function loader({ params }: Route.LoaderArgs) {
  const user = await getUser(params.userId);
  if (!user) throw new Response("Not found", { status: 404 });
  return { user };
}

export default function UserProfile({ loaderData }: Route.ComponentProps) {
  return <h1>{loaderData.user.name}</h1>;
}

export function ErrorBoundary() {
  return <ErrorMessage />;
}
```

Loading state comes from `useNavigation().state === "loading"`, errors from the
route `ErrorBoundary`. Public data loads in a server `loader` (that is what
makes it indexable — see `data-loading.md`); per-user data the server cannot
see (PocketBase session) loads in a `clientLoader` — see `sessions.md`.

### 3. Mutations → action + Form / useFetcher

```tsx
// ❌ Before: effect fires a request when state changes
useEffect(() => {
  if (submitted) fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) });
}, [submitted]);

// ✅ After
export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  await subscribe(String(form.get("email")));
  return { ok: true };
}

function Subscribe() {
  const fetcher = useFetcher<typeof action>();
  return (
    <fetcher.Form method="post">
      <input name="email" type="email" required />
      <button disabled={fetcher.state !== "idle"}>Subscribe</button>
      {fetcher.data?.ok && <p>Thanks!</p>}
    </fetcher.Form>
  );
}
```

React Router revalidates loaders after an action — no manual refetch effect.

### 4. Resetting state when a prop changes → key

```tsx
// ❌ Before
function Form({ userId }: { userId: string }) {
  const [name, setName] = useState("");
  useEffect(() => { setName(""); }, [userId]);
}

// ✅ After
function Form({ userId }: { userId: string }) {
  return <FormInner key={userId} userId={userId} />;
}
function FormInner({ userId }: { userId: string }) {
  const [name, setName] = useState(""); // resets when key changes
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}
```

### 5. Adjusting part of state during render

Use when only some state must change on a prop change. Try `key` first.

```tsx
function List({ items }: { items: Item[] }) {
  const [selection, setSelection] = useState<Item | null>(null);
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
}
```

Better still: store `selectedId` and derive `items.find(...)` in render.

### 6. Event chains

```tsx
// ❌ Before: effects triggering effects
useEffect(() => { if (card.gold) setGoldCount((c) => c + 1); }, [card]);
useEffect(() => { if (goldCount > 3) setRound((r) => r + 1); }, [goldCount]);

// ✅ After: compute next state in one handler
function handlePlaceCard(next: Card) {
  setCard(next);
  if (next.gold) {
    if (goldCount < 3) setGoldCount(goldCount + 1);
    else { setGoldCount(0); setRound(round + 1); }
  }
}
```

### 7. Notifying the parent

```tsx
// ❌ Before
useEffect(() => { onChange(isOn); }, [isOn, onChange]);

// ✅ After: notify in the same event
function handleClick() {
  const next = !isOn;
  setIsOn(next);
  onChange(next);
}
```

Or lift the state up and make the component fully controlled.

### 8. useEffectEvent

Use it to read the latest props inside a real effect without re-running it.

```tsx
function ChatRoom({ roomId, theme }: Props) {
  const onConnected = useEffectEvent(() => showToast("Connected", theme));
  useEffect(() => {
    const conn = createConnection(roomId);
    conn.on("connected", onConnected);
    conn.connect();
    return () => conn.disconnect();
  }, [roomId]);
}
```

Do not use it to hide real dependencies.

Known lint false positive: the template's `eslint-plugin-react-hooks` (5.x)
predates `useEffectEvent`, so `exhaustive-deps` warns that `onConnected` is a
missing dependency. The warning is wrong here — an effect event must stay out
of the dependency array (that is its entire purpose). Leave the code as shown:
do not add the event to the deps and do not add an `eslint-disable`. The lint
gate only fails on errors, so this warning never blocks a reload.

### 9. SSR hydration safety

Never read `window`, `localStorage`, `Date.now()`, or `Math.random()` during
render — server and client output will differ. Full patterns live in
`hydration.md`; the template ships `useHydrated()` from `@/hooks/use-hydrated`
for the common cases. For a live browser value, prefer
`useSyncExternalStore` with a server snapshot over an effect:

```tsx
function useIsOnline() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("online", cb);
      window.addEventListener("offline", cb);
      return () => {
        window.removeEventListener("online", cb);
        window.removeEventListener("offline", cb);
      };
    },
    () => navigator.onLine, // client snapshot
    () => true,             // server snapshot
  );
}
```

### 10. StrictMode: always clean up

In development, effects run twice (mount → unmount → mount). Every effect
needs a cleanup. "Run once" logic (analytics, init) goes in an event handler
or at module scope, not in an effect with an `[]` array.

### 11. No lint bypass

Do not use `eslint-disable` for hooks rules. Do not wrap `setState` in
`Promise.resolve().then()`, `setTimeout`, or similar to dodge lint — restructure
the code. Lint and typecheck run on every reload; fix the errors they report
(the one known false positive is the `useEffectEvent` dependency warning above).

## Rules of thumb

1. Can I compute this from props/state during render? → Do that.
2. Is this a user action (click, submit, input)? → Event handler.
3. Is this route data? → `loader` / `clientLoader`.
4. Is this a mutation? → `action` + `<Form>` / `useFetcher`.
5. Must state reset on a prop change? → `key`.
6. Filters, tabs, pagination? → URL search params (`useSearchParams`).
7. A browser value? → `useSyncExternalStore` with a server snapshot.
8. Syncing with something React doesn't own? → Effect, with cleanup (and
   `useEffectEvent` for latest values).
9. Every route has an `ErrorBoundary`.

The goal is not zero effects forever. It is making effects rare, intentional,
and only used for true external sync.
