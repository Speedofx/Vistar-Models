---
name: integrated-ai
description: >
  Build AI features on the injected Integrated AI client — chat, assistants,
  text generation, image generation and editing — inside this app.
  Use whenever the user wants anything powered by an LLM. Activation is
  enable_integrated_ai (the coding agent's job); this skill covers wiring the
  route, writing the UI, and the access rules. Never provider/API-key setup.
---

# Integrated AI — build the UI on the injected client

Integrated AI is a **platform-managed** capability: the site can call an LLM and
act on the answer, with provider credentials, streaming, image storage, and
per-visitor history handled for you. It is not limited to chat — the same client
powers one-shot generators, image editors, and model-backed suggestions.

Unlike the monorepo template, **no chat component is injected here**. You get a
typed browser client, a server module, and one resource route. The interface is
yours to design and write.

Use this skill when `<files_injected>` lists `integrated-ai-api.ts`, or the task
asks for an AI chat / assistant / image generator inside the app.

## What was injected

| File | What it is | You |
|---|---|---|
| `apps/web/src/api/integrated-ai-api.ts` | Browser client: `sendMessage`, `loadChatHistory`, `clearChatHistory` | **import it** (read-only) |
| `apps/web/src/lib/integrated-ai.server.ts` | Model credentials, proxying, history, image storage | never import from the client (read-only) |
| `apps/web/src/routes/api.integrated-ai.stream.ts` | `POST /api/integrated-ai/stream` resource route | **register it**; edit only to add your own fields |
| `apps/web/src/constants/ai-assistant.config.ts` | `SYSTEM_PROMPT` + `REQUIRE_LOGIN` | **edit it for this site** |

PocketBase collections `_integratedAiMessages` (transcripts) and
`_integratedAiImages` (uploaded and generated images) come from injected
migrations — don't redefine them, and don't write to them directly.

**Never ask the user for an OpenAI / Gemini / Anthropic / Azure key** — the
platform already provisioned credentials. There is nothing to put in `.env`.

## ‼️ STEP 1 (MANDATORY): register the stream route

The injected route file is an orphan until `apps/web/src/routes.ts` names it.
Skip this and every message fails with a 404 — the UI looks built and does
nothing. This is the most common way the feature ships broken.

```ts
export default [
	index('routes/home.tsx'),
	route('api/health', 'routes/api.health.ts'),
	route('api/integrated-ai/stream', 'routes/api.integrated-ai.stream.ts'), // <-- ADD
] satisfies RouteConfig;
```

Keep every existing route. Verify after `reload_app`:

```bash
curl -i -X POST http://localhost:3000/api/integrated-ai/stream
```

A 401/400 is success — the route is mounted and its own checks answered. A 404
means it is not registered.

## ‼️ STEP 2 (MANDATORY): write a real system prompt

`SYSTEM_PROMPT` in `apps/web/src/constants/ai-assistant.config.ts` ships as
`'You are a helpful assistant.'`. Shipping that unchanged is a bug — it is what
makes an assistant feel bolted on. Replace it with who the assistant speaks for,
what it knows about this business, what it should refuse, and the tone to use:

```ts
export const SYSTEM_PROMPT = `You are the booking assistant for Fern & Fig, a
plant shop in Vilnius. Answer questions about care, stock, and delivery. Keep
answers to two or three sentences. If asked about anything unrelated to plants
or the shop, say it is outside what you can help with.`;
```

## ‼️ STEP 3 (MANDATORY): pick the access mode — login is ON by default

`REQUIRE_LOGIN = true` means `/stream` answers **401** to anonymous callers and
**403** to signed-in visitors whose email is unverified. This gates chat *and*
image generation — generation runs inside the same stream, so an image editor is
login-gated exactly like a chatbot.

- **LOGIN-REQUIRED (default).** Keep `REQUIRE_LOGIN = true` and ship a working
  PocketBase sign-in flow **in the same build** (see the `pocketbase` skill):
  sign-up, sign-in, and a visible way in. Without it the endpoint is on but
  nobody can reach it. Per-visitor history only exists in this mode.
- **PUBLIC.** Set `REQUIRE_LOGIN = false` **only when the user literally asked**
  for it — "no login", "no sign-up", "anyone can use it", "public". A
  customer-facing sales/support/marketing assistant is *not* such a request: do
  not infer public access from the site type, the audience, or "less friction".
  In this mode nothing is stored and `loadChatHistory()` returns `[]`.

Unclear? Default to login-required. **Always say which mode shipped** in your
final reply, and if it's login-required, that visitors sign up to use it.

Verification emails are sent automatically on signup by an injected PocketBase
hook — do not add your own send. Surface the 403 message and optionally offer a
resend button calling `pb.collection('users').requestVerification(email)`. A
visitor who just clicked the link is still `verified: false` in the stored
record, so `authRefresh()` on mount and on window focus, and react to
`pb.authStore.onChange`, or they'll be told to verify an already-verified email.

## The client API

```ts
import { clearChatHistory, loadChatHistory, sendMessage } from '@/api/integrated-ai-api';
import type { ChatMessage } from '@/api/integrated-ai-api';
```

| Function | Signature | Notes |
|---|---|---|
| `sendMessage` | `({ text, images?, onText?, onImage?, onEvent?, signal? }) => Promise<ChatMessage>` | Resolves with the finished answer. `onText` fires per fragment — that's your streaming UI. |
| `loadChatHistory` | `() => Promise<ChatMessage[]>` | Oldest first, images signed. `[]` when signed out. |
| `clearChatHistory` | `() => Promise<void>` | Deletes the transcript for real, not just local state. |
| `signImageUrl` | `(reference: string) => Promise<string>` | Only for image references you handle yourself via `onEvent`. |

```ts
type ChatMessage = {
	role: 'user' | 'assistant';
	content: string;
	images?: string[]; // ready-to-render URLs, on both roles
};
```

`images` are always URL strings — visitor uploads and generated images alike.
You never touch SSE frames or JSON.

Errors are `AssistantError` with a `status`: **401** sign in, **403** verify your
email, **429** slow down (10 messages per minute), **502** the model failed.
Show `error.message` for each — they are written for visitors. Aborting through
`signal` rejects with an `AbortError`, which is normal and must not be shown as
a failure.

## The chat surface — write it yourself

Everything below is a starting point, not a component to copy verbatim: match
this site's design language (see the `design` skill).

```tsx
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [isStreaming, setIsStreaming] = useState(false);

useEffect(() => {
	loadChatHistory().then(setMessages).catch(() => setMessages([]));
}, []);

const send = async (text: string, images: File[] = []) => {
	setMessages(previous => [...previous, { role: 'user', content: text }, { role: 'assistant', content: '' }]);
	setIsStreaming(true);

	try {
		await sendMessage({
			text,
			images,
			onText: chunk => setMessages((previous) => {
				const next = [...previous];
				const last = next[next.length - 1];
				next[next.length - 1] = { ...last, content: last.content + chunk };

				return next;
			}),
			onImage: url => setMessages((previous) => {
				const next = [...previous];
				const last = next[next.length - 1];
				next[next.length - 1] = { ...last, images: [...(last.images ?? []), url] };

				return next;
			}),
		});
	} catch (error) {
		// Drop the empty assistant bubble, then show error.message (401/403/429 are all visitor-readable).
		setMessages(previous => previous.slice(0, -1));
	} finally {
		setIsStreaming(false);
	}
};
```

Non-negotiables for the UI, because their absence reads as "broken":

- The composer disables and shows a pending state while `isStreaming`.
- The assistant bubble appears immediately and fills in as text streams.
- `message.images` render as `<img>`; generated images can take 10–20 seconds,
  so show a placeholder while a turn is in flight.
- 401 renders as a sign-in prompt, not a red toast; 403 as "check your inbox".
- Scroll pins to the newest message.

Anything the client does not do — Markdown rendering, message actions, typing
animation — is yours to add if the design calls for it.

## Not a chat? Same client

A one-shot generator (headline writer, image maker, "suggest a caption") is just
`sendMessage` without a transcript: call it from the form handler, render the
resolved `ChatMessage`, skip `loadChatHistory`. Note the model still sees the
signed-in visitor's earlier turns, which usually helps ("make it shorter") and
is worth a **New session** button (`clearChatHistory`) when it doesn't.

## Image generation and editing

The model decides when to generate from the user's words; you never invoke a
tool directly. It can generate from text and edit or merge images the visitor
uploads (pass the `File`s as `images` — up to 5 per message, 20MB each, JPEG /
PNG / WebP; anything else is rejected by content sniffing, not extension).

Aspect ratios `1:1`, `16:9`, `9:16`, `4:3`, `3:4` and resolutions `1K`, `2K`,
`4K` are inferred from the prompt text, not passed as arguments — to expose them
as UI controls, append the choice to the prompt (e.g. `"... — 16:9, 4K"`).

For a gallery instead of bubbles, flatten each assistant turn's `images` with
the preceding user prompt as its caption, newest first.

## Wire format (debugging only)

The route streams SSE frames; the client parses them. Read this only when
debugging with `curl` or `onEvent`:

```text
data: {"type":"content","data":{"content":"..."}}
data: {"type":"tool_result","data":{"tool_call_id":"...","tool_name":"generate_image","content":"https://<site>/hcgi/platform/api/files/..."}}
data: {"type":"completed","data":{"content":"[COMPLETED]"}}
```

`completed` is emitted after the turn has been stored, which is why history
reloaded right after a stream already contains it.

## Rules that catch people out

- The route is registered in `routes.ts` or nothing works.
- The route is editable, and the access check does not live in it: `uploadImages`
  and `streamAssistant` take the `Request` and apply `REQUIRE_LOGIN` plus the
  per-visitor message budget themselves. Switch access with `REQUIRE_LOGIN` in
  `ai-assistant.config.ts` — editing the route cannot open the assistant up.
- `integrated-ai.server.ts` is server-only. Importing it from a component leaks
  the key and breaks the build; go through `@/api/integrated-ai-api`.
- Don't POST to `/api/integrated-ai/stream` by hand — the client already handles
  auth headers, multipart, streaming, and image signing.
- Image URLs expire: they are signed with a short-lived token. Render what the
  client hands you rather than caching URLs in your own state for later.
- History is per account. Signing out and back in is what changes it, not the
  component's local state.

## Checklist

- [ ] `route('api/integrated-ai/stream', 'routes/api.integrated-ai.stream.ts')` added to `routes.ts`
- [ ] `reload_app` and curled the route to confirm it is mounted
- [ ] `SYSTEM_PROMPT` rewritten for this site
- [ ] Access mode chosen deliberately; sign-in flow shipped when login-required
- [ ] Streaming, pending, empty and error states all visible in the UI
- [ ] Access mode stated in the final reply
