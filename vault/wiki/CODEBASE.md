# Codebase Map — Vistar Models

Production-ready scale-model consultancy platform for India built with React Router v7/v8 framework mode (SSR & Vite), TypeScript, Tailwind CSS, and Radix UI. Fully optimized for 1-Click Zero-Config deployment to Vercel and local development on Port 302.

## Application Architecture

- **Project Root**: Flattened single-app structure (no monorepo nesting).
- **TypeScript**: Strict TypeScript throughout (`tsx` / `ts`) with path alias `@/*` -> `./src/*`.
- **Framework**: React Router framework mode with explicit route configuration in `src/routes.ts`.
- **SSR & Deployment**: Server-Side Rendering (`ssr: true` in `react-router.config.ts`) with `@vercel/react-router/vite` preset for automatic serverless functions on Vercel.
- **Form & Lead Handling**: Inquiries and Partner Applications are connected directly to WhatsApp (`+91 8302806913`) with structured markdown briefs and zero backend dependencies.

## Key Files & Directory Map

### Root Configuration
- `package.json` — Dependencies, build scripts (`dev`, `build`, `start`, `dev:302`).
- `vite.config.ts` — Vite build and preview configuration.
- `react-router.config.ts` — React Router SSR config with `vercelPreset()`.
- `.npmrc` — Configures `legacy-peer-deps=true` for zero-friction Vercel builds.
- `.gitignore` — Ignores `node_modules`, `build`, `dist`, `.vercel`, and env files.
- `skill.md` — Complete directory structure cheat-sheet.

### `src/` — Main Application Code
- `src/root.tsx` — Document shell (`<html lang="en">`), font links (Manrope), meta tags, header, footer, and ErrorBoundary.
- `src/routes.ts` — Explicit routes definition.
- `src/index.css` — Design system tokens (CSS variables consumed by Tailwind/shadcn), styling rules, typography, and responsive breakpoints.

### `src/routes/` — Application Routes
- `src/routes/home.tsx` — `/` Homepage.
- `src/routes/page.tsx` — Dynamic route handler for all content pages (`/about`, `/services`, `/find-a-model-maker`, `/categories`, `/industries`, `/how-it-works`, `/for-manufacturers`, `/become-a-partner`, `/faq`, `/contact`, `/privacy`, `/terms`, and category slugs).
- `src/routes/blog.tsx` — `/blog` Journal index listing.
- `src/routes/blog.$slug.tsx` — `/blog/:slug` Article pages with `tlDr` summaries and related links.
- `src/routes/sitemap.xml.ts` — `GET /sitemap.xml` SEO sitemap with all public pages and articles.
- `src/routes/robots.txt.ts` — `GET /robots.txt` Crawler instructions.
- `src/routes/llms.txt.ts` — `GET /llms.txt` Generative Engine Optimization (GEO) feed for AI search engines (Perplexity, ChatGPT, Gemini).
- `src/routes/rss.xml.ts` — `GET /rss.xml` Journal RSS feed.
- `src/routes/api.health.ts` — `GET /api/health` Health check endpoint answering `{ ok: true }`.
- `src/routes/api.$.ts` — JSON `404` handler for unmatched `/api/*` paths.

### `src/components/` — UI Components & Sections
- `src/components/site-header.tsx` — Responsive navigation bar, logo, and "Discuss Your Requirement" CTA.
- `src/components/site-footer.tsx` — Footer with consultancy disclaimer, links, and contact info.
- `src/components/enquiry-form.tsx` — WhatsApp-powered lead generation form for clients and maker partners.
- `src/components/home/hero.tsx` — Homepage hero section.
- `src/components/home/perspective.tsx` — Consultancy positioning.
- `src/components/home/industry-partners.tsx` — Industries served and maker partnership callout.
- `src/components/home/blog-teaser.tsx` — Recent journal posts teaser.
- `src/components/category-gallery.tsx` — Model categories visual grid.
- `src/components/capability.tsx` — Capability-based matching highlights.
- `src/components/process.tsx` — 5-step sourcing process walkthrough.
- `src/components/founder.tsx` — Founder profile and background.
- `src/components/contact-cta.tsx` — Pre-footer CTA banner.
- `src/components/blog/blog-index.tsx` — Journal listing layout.
- `src/components/blog/article-body.tsx` — Sectioned article renderer with related links.
- `src/components/ui/` — 40+ Shadcn/Radix UI accessible primitives.

### `src/data/` — Local Content Database
- `src/data/site.ts` — Navigation links, service definitions, category specifications, FAQs, and WhatsApp URLs.
- `src/data/blog-posts.ts` — Authoritative journal articles with titles, excerpts, read times, and `tlDr` fields.
- `src/data/business.ts` — Consultancy business details, phone numbers, and operating regions.

### `src/lib/` — Utilities & SEO
- `src/lib/seo.ts` — Automated SEO generator: titles, descriptions, canonical URLs, Open Graph, Twitter cards, and Schema.org JSON-LD (`WebSite`, `Organization`, `Article`, `FAQPage`).
- `src/lib/site-origin.server.ts` — Resolves the current canonical domain origin from incoming requests.
- `src/lib/utils.ts` — Tailwind `cn()` class merger utility.
