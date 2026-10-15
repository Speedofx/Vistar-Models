# 🧠 AI IDE SKILL PROTOCOL: THE 100/100 PRODUCTION STANDARD

> **MANDATORY INSTRUCTION FOR ALL AI CODING AGENTS & DEVELOPERS:**  
> Before writing any code, modifying routes, creating components, or configuring deployment, you MUST read and strictly adhere to:  
> 📖 **[`MASTER_100_PERCENT_BLUEPRINT.md`](./MASTER_100_PERCENT_BLUEPRINT.md)**

---

## ⚡ CORE NON-NEGOTIABLE PRINCIPLES

1. **Brand Authenticity:** Always strictly use **Vistar Models** (`vistarmodels.com`, UDYAM-RJ-17-0536099, Owner: Yogendra Yogi). Never use old prototype brand names.
2. **PageSpeed 100/100 (Mobile & Desktop):**
   * **Images:** WebP format ONLY (`quality=80`, max ~60–90 KB). Never serve raw PNG/JPG.
   * **LCP Preload:** `<link rel="preload" as="image" href="..." fetchpriority="high" type="image/webp">` must always be present for hero images.
   * **Zero Render-Blocking Fonts:** Never import `fonts.googleapis.com` CSS. Use self-hosted variable WOFF2 in `/public/fonts/` with `@font-face` and `<link rel="preload" as="font">`.
   * **Favicon:** Keep favicon under 10 KB.
   * **Edge Caching:** `vercel.json` must enforce 1-year immutable caching on `/images/*` and `/fonts/*`.
3. **AEO & GEO Knowledge Architecture:**
   * Every physical branch MUST have **200 FAQs** (100 core technical + 100 municipal/regional authority questions).
   * Every branch must feature a **40–60 word Direct Answer Snippet Box** for AI Overviews and Perplexity search grounding.
   * Triple JSON-LD Schemas: `LocalBusiness` + `FAQPage` + `BreadcrumbList` on every location page.
4. **AI Crawlers & Discovery:**
   * `robots.txt` must allow `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` with `Content-Signal: search=yes, ai-input=yes, ai-train=yes`.
   * `llms.txt` must expose verified markdown facts for zero-token LLM extraction.
5. **Google Search Console SOP:**
   * Submit ONLY `sitemap.xml` to "Add a new sitemap".
   * Submit individual web pages to the **top URL Inspection search bar** (`Inspect any URL`) -> "Test Live URL" -> "Request Indexing".
   * Never submit web page URLs into the sitemap submission box.
6. **Local 3-Pack Maps (GBP):**
   * Address, phone, and name must match the on-page JSON-LD schema exactly.
   * Link GBP listings directly to `/units/:city`, never to the generic root homepage.
7. **The Anti-Card Directory Law:**
   * Never use 3x3 rounded e-commerce cards with drop shadows in architectural/engineering directories.
   * Use an **Architectural Terminal Roster** with a horizontal station navigator bar (`01 MUMBAI`, `02 DELHI`...) and full-width terminal strips separated by hairline dividers.
8. **Expansive 2-Column Editorial Spread:**
   * Never squeeze article reading content into a 600-700px narrow column.
   * Use a `1200px+` 2-column layout: Sticky left sidebar (300px) with metadata, table of contents, and consultation dock + wide right column (800px+) for reading.
9. **Homepage Featherweight Performance:**
   * Never inject heavy FAQ accordions or giant `<head>` JSON-LD schemas onto the root homepage (`/`). Keep it under 8 KB SSR HTML for 100/100 Mobile Speed. Distribute deep FAQs to regional landing pages.
10. **Entity Purity & Assertive Voice:**
   * Never mention or link unowned third-party brands in schemas or text. Maintain 100% brand entity purity.
   * Write confident, authoritative consulting copy without weak legal hedging ("A suitable match may not always be available").
11. **Zero-Error Tailwind Linter Protocol:**
   * Ensure `.vscode/settings.json` has `{"css.lint.unknownAtRules": "ignore"}` to prevent `@tailwind` diagnostic warnings.

---

## 📂 FULL DIRECTORY BLUEPRINT

```
vistar-models/
├── MASTER_100_PERCENT_BLUEPRINT.md   # 🏛️ Complete 100/100 Master Coding Bible & SOP
├── SEO_AEO_GEO_MASTER_GUIDE/         # 📚 Specialized operational guides
│   ├── README.md                     # Overview & live status
│   ├── 01_CODE_ARCHITECTURE.md       # Technical specs & JSON-LD
│   ├── 02_GOOGLE_SEARCH_CONSOLE_GUIDE.md # 39 URLs directory & indexing SOP
│   ├── 03_GOOGLE_MY_BUSINESS_LOCAL_SEO.md # Google Maps 3-Pack strategy
│   └── 04_DYNAMIC_URL_EXPANSION_SYSTEM.md # Dynamic scaling for new cities/posts
├── vercel.json                       # ⚡ Edge caching (1-yr immutable) & security headers
├── package.json                      # React Router v7, Tailwind, Lucide
├── vite.config.ts                    # Vite build configuration
├── react-router.config.ts            # Serverless preset configuration
│
├── public/                           # Static assets
│   ├── favicon.png                   # 7 KB optimized favicon
│   ├── fonts/
│   │   └── manrope-latin.woff2       # 24 KB self-hosted variable font
│   └── images/                       # Ultra-compressed WebP images (96% reduced)
│       ├── architectural.webp        # 64 KB (Hero LCP)
│       ├── township.webp             # 95 KB
│       ├── industrial.webp           # 51 KB
│       └── ...                       # All 9 categories in WebP
│
└── src/                              # Source code
    ├── root.tsx                      # Master layout with font preloading & schema links
    ├── routes.ts                     # Strict route hierarchy
    ├── index.css                     # Design system & @font-face definition
    ├── routes/
    │   ├── home.tsx                  # Home page with hero image preload
    │   ├── units.tsx                 # "My Branches" Hub directory
    │   ├── units.$city.tsx           # Dynamic branch page with 200 FAQs & Triple Schema
    │   ├── sitemap.xml.ts            # Dynamic XML sitemap (auto-syncs all 39 URLs)
    │   ├── robots.txt.ts             # AI bot crawler permissions & content signals
    │   └── llms.txt.ts               # Machine-readable facts feed
    ├── data/
    │   ├── units.ts                  # 9 branch units with NAP, ratings, coordinates
    │   ├── units-core-faqs.ts        # 100 deep technical/commercial FAQs
    │   ├── units-city-faqs.ts        # 100 municipal/regional FAQs per city
    │   ├── site.ts                   # Category definitions & WebP image mapping
    │   └── blog-posts.ts             # Dynamic authority articles
    └── components/                   # UI components (Hero, FAQ filter, Header, Footer)
```
