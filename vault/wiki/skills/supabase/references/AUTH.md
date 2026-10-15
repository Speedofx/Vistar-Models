# Supabase Auth (Login, Signup, Sessions, Guards)

Load this reference for login, signup, logout, "only logged-in users can …",
protected pages, admin areas, or user profiles.

This site authenticates with Supabase, not PocketBase. Ignore the
`@/hooks/use-auth` / `@/lib/require-auth` helpers the framework-mode and
PocketBase skills describe — they are PocketBase code.

## Auth is already scaffolded — extend it, never rewrite it

`apps/web/src/contexts/SupabaseAuthContext.jsx` ships with the project. Read it
before writing any auth code.

It exports:

- `AuthProvider` — wraps the app, tracks the session, restores it on reload.
- `useAuth()` — returns `{ user, session, loading, signUp, signIn, signOut }`.

```tsx
import { useAuth } from "@/contexts/SupabaseAuthContext";

const { user, session, loading, signUp, signIn, signOut } = useAuth();

await signIn(email, password);
await signUp(email, password, { data: { full_name: name } });
await signOut();
```

`signIn`, `signUp` and `signOut` each return `{ error }` and already surface a
toast on failure — do not add a second toast for the same error. Check `error`
to decide whether to navigate.

Extend this file in place when a task needs more (roles, profile loading,
permissions). **Never create a second auth hook** — no `hooks/use-auth.ts`, no
`lib/auth.tsx`, no parallel context.

`AuthProvider` wraps the app once, around the `<Outlet />` in the default
export of `apps/web/src/root.tsx`:

```tsx
import { AuthProvider } from "@/contexts/SupabaseAuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
```

Keep it there, not in `Layout` — `Layout` also renders the error boundary,
which must not depend on the session.

## The session exists only in the browser

The session is stored in browser storage. The server renders every page as a
signed-out visitor, and the published site caches that HTML for everyone (see
`react-router-framework-mode/references/sessions.md`). Consequences:

- Never check the session in a server `loader`, `action`, `middleware`, or
  `.server.ts` module, and never redirect on auth there.
- Never copy the session into a cookie so the server can read it.
- The first client render still has `loading: true` and `user: null` — the
  session is restored asynchronously after hydration.

## `loading` exists so the UI does not flicker

Until `loading` is `false`, `user` is `null` even for a signed-in visitor. A
header that ignores it shows "Sign in" on every page load; a guard that ignores
it bounces every authenticated user to `/login`.

```tsx
export function SiteHeader() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <div className="h-9" />;

  return user ? <button onClick={signOut}>Sign out</button> : <Link to="/login">Sign in</Link>;
}
```

## Protected routes

Guard the route module with a `clientLoader`. It runs in the browser, so it can
read the session, and it runs before the route renders:

```tsx
// src/routes/dashboard.tsx
import { redirect } from "react-router";
import type { Route } from "./+types/dashboard";
import { supabase } from "@/lib/customSupabaseClient";

export async function clientLoader() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) throw redirect("/login");

  return { user: session.user };
}
clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <div aria-hidden />; // keeps protected UI hidden until the check ran
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return <p>Signed in as {loaderData.user.email}</p>;
}
```

Put the guard on a layout route to cover a whole section at once. The
server-rendered document for a protected route is the anonymous
`HydrateFallback` — identical for everyone, safe to cache.

Give the login page the inverse guard, so signed-in visitors go straight to
the app:

```tsx
// src/routes/login.tsx
export async function clientLoader() {
  const { data: { session } } = await supabase.auth.getSession();

  if (session) throw redirect("/dashboard");

  return null;
}
clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return null;
}
```

A `ProtectedRoute` wrapper component from the old app is replaced by this
guard. Do not recreate it.

## A login page

```tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    const { error } = await signIn(email, password);

    setSubmitting(false);
    if (!error) navigate("/dashboard", { replace: true });
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit" disabled={submitting}>Sign in</button>
    </form>
  );
}
```

Import navigation from `react-router`, never `react-router-dom`. Never display
demo credentials on the page.

## Match signup to who the app is for

Private, internal, admin-only, or single-user apps ("just for me", "staff
only", a personal dashboard, an internal tool) should not offer public signup.
Build the login page and leave signup out of the UI. Only build a signup flow
when the app is genuinely public or the user asks for one.

If the app has no signup UI and no account yet, nobody can get in. Tell the
user in your final message that they can ask you to create the first account.

Do not seed demo users unless asked. When you do, reveal the credentials only
in your final chat message, never in the UI or a committed file.

## Profile data belongs in `public.profiles`

`auth.users` is managed by Supabase. Never create, alter, or insert into it.
Extra per-user fields go in your own table keyed by the auth id:

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);
```

Create the row automatically on signup with a trigger, so no code path can
leave a user without a profile:

```sql
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

`security definer` is required — the trigger runs as the signing-up user, who
has no direct insert rights on `profiles`.

The `{ data: { full_name } }` you pass to `signUp` lands in
`raw_user_meta_data`, which is where the trigger reads it from.

## Roles and admin-only access

Store the role on `profiles`, then check it in the policy rather than in React.
A check that only exists in the frontend is not a security boundary — anyone
with the anon key can query around it.

```sql
create policy "Admins read all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
```

In React, load the profile once (extend `SupabaseAuthContext.jsx`) and use the
role to decide what to render — for navigation and empty states, not as the
enforcement point.

## Email confirmation changes what signup returns

If the project requires email confirmation, `signUp` succeeds but no session is
created until the user clicks the link. `user` stays `null`. Do not navigate to
a protected page after signup — show a "check your email" state instead.

## Password reset

```js
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`,
});

// On the /reset-password page, after the user arrives from the email link:
await supabase.auth.updateUser({ password: newPassword });
```

Call both from the browser — `window` does not exist on the server.

## Pitfalls

- **Guarding without `loading`, or in a server `loader`.** Signed-in users get
  bounced on every refresh; a server guard never sees the session.
- **Using `@/hooks/use-auth` or `requireAuth`.** Those are PocketBase helpers.
- **A second auth context or `useAuth` hook.** Extend the existing one.
- **Mounting `AuthProvider` in `Layout` or per route.** Once, in the `App`
  default export of `root.tsx`.
- **Creating `public.users`.** Use `auth.users` + `public.profiles`.
- **A trigger on `auth.users` without `security definer`.** Signup fails with a
  permission error.
- **Enforcing roles only in React.** Put the check in an RLS policy.
- **Reading `user` right after `await signIn(...)`.** The context updates on the
  next render; use the returned `{ error }` to branch, and read `user` from the
  hook on a later render.
- **Storing the session yourself in localStorage or a cookie.** The SDK already
  persists and refreshes it, and a cookie invites the cross-visitor cache leak.
