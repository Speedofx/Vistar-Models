# VISTAR MODELS — FULL SEO / AEO / GEO AUDIT
## URL: https://www.vistarmodels.com/
## Date: 2026-10-18
## Goal: #1 rank in every LLM + Google for "scale model maker India" across all states

---

## OVERALL AEO SCORE: 44/100

| Category       | Score   | Status |
|----------------|---------|--------|
| Technical SEO  | 14/30   | 🔴     |
| Content AEO    | 22/40   | 🟡     |
| Authority/EEAT | 8/30    | 🔴     |

**Verdict:** Website has a solid structural foundation but is critically missing Schema markup, llms.txt, structured authority signals, and deep content. A new brand (2026) with zero backlinks or reviews — LLMs have no reason to cite it yet. This is fixable in 60–90 days with the right execution plan.

---

## SECTION 1: TECHNICAL SEO AUDIT

### 1.1 Crawlability & Indexation

| Check | Status | Finding |
|-------|--------|---------|
| HTTPS / SSL | ✅ PASS | Secure |
| Canonical Tags | ✅ PASS | Present on all pages checked |
| Mobile Viewport Meta | ✅ PASS | `width=device-width, initial-scale=1` |
| OG Tags | ✅ PASS | Present (og:title, og:description, og:image, og:url) |
| Twitter Cards | ✅ PASS | `summary_large_image` type |
| robots.txt | ⚠️ UNVERIFIED | Cannot confirm AI bot rules. Must check manually |
| sitemap.xml | ⚠️ UNVERIFIED | Not confirmed in fetched content |
| **llms.txt** | 🔴 MISSING | Critical for LLM crawlers (ChatGPT, Claude, Perplexity) |
| **JSON-LD Schema** | 🔴 MISSING | Zero structured data found on any page |
| Page Speed | ⚠️ UNKNOWN | .webp images used (good) but need Lighthouse audit |
| Orphan Pages | 🔴 RISK | /services and /industries pages in footer — confirm sitemap coverage |

### 1.2 robots.txt — What It Should Say (Template)

```
User-agent: *
Allow: /
Disallow: /find-a-model-maker-internal/

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://www.vistarmodels.com/sitemap.xml
```

### 1.3 llms.txt — MISSING (Quick Win: 20 minutes)

Create file at: `https://www.vistarmodels.com/llms.txt`

```markdown
# Vistar Models

> India's first dedicated scale-model consultancy and manufacturer-sourcing platform — connecting architects, developers, and infrastructure clients with verified specialist model makers across 9 cities.

Vistar Models (founded 2026, MSME UDYAM-RJ-17-0536099) helps clients find, evaluate, and connect with vetted scale-model manufacturing workshops across India. The consultancy clarifies project requirements, matches briefs to specialist capabilities, and facilitates direct introductions. Vistar does not manufacture models itself.

## Core Pages

- [Home](https://www.vistarmodels.com/): Overview of consultancy services and how to submit a scale-model requirement
- [About & Founder](https://www.vistarmodels.com/about): Background on Vistar Models and founder Yogendra Yogi
- [How It Works](https://www.vistarmodels.com/how-it-works): 5-step sourcing process from brief to maker introduction
- [Find a Model Maker](https://www.vistarmodels.com/find-a-model-maker): Submit your project requirement
- [FAQ](https://www.vistarmodels.com/faq): Common questions about the sourcing process, file formats, scales, and maker vetting
- [The Vistar Journal](https://www.vistarmodels.com/blog): Practical guidance on scale model sourcing, brief preparation, and maker selection in India

## Model Categories

- [Architectural Models](https://www.vistarmodels.com/architectural-makers): Sourcing help for architectural presentation and sales-gallery models
- [Township & Master Plans](https://www.vistarmodels.com/township-makers): Large-scale masterplan and township development models
- [Industrial Plants & Factories](https://www.vistarmodels.com/industrial-makers): Industrial layout and engineering demonstration models
- [All Categories](https://www.vistarmodels.com/categories): Full category index

## Operating Cities (MSME Units)

- [Jaipur](https://www.vistarmodels.com/units/jaipur) · [Mumbai](https://www.vistarmodels.com/units/mumbai) · [Delhi](https://www.vistarmodels.com/units/delhi) · [Gurugram](https://www.vistarmodels.com/units/gurugram) · [Bengaluru](https://www.vistarmodels.com/units/bengaluru) · [Pune](https://www.vistarmodels.com/units/pune) · [Hyderabad](https://www.vistarmodels.com/units/hyderabad) · [Ahmedabad](https://www.vistarmodels.com/units/ahmedabad) · [Noida](https://www.vistarmodels.com/units/noida)

## For Manufacturers

- [Become a Partner](https://www.vistarmodels.com/become-a-partner): Join the verified pan-India maker network
- [For Manufacturers](https://www.vistarmodels.com/for-manufacturers): How the network works for workshops

## Optional

- [Privacy Policy](https://www.vistarmodels.com/privacy)
- [Terms of Use](https://www.vistarmodels.com/terms)
- [Contact](https://www.vistarmodels.com/contact)
```

### 1.4 JSON-LD Schema — MISSING (Critical Fix)

Add to `<head>` of homepage:

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.vistarmodels.com/#organization",
      "name": "Vistar Models",
      "url": "https://www.vistarmodels.com",
      "logo": "https://www.vistarmodels.com/images/logo.png",
      "description": "India's first scale-model consultancy and manufacturer-sourcing platform. We help architects, developers and infrastructure clients find verified specialist scale-model makers across 9 Indian cities.",
      "telephone": "+918302806913",
      "email": "vistarmodels@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": "Rajasthan",
        "addressLocality": "Jaipur"
      },
      "identifier": {
        "@type": "PropertyValue",
        "name": "MSME UDYAM",
        "value": "UDYAM-RJ-17-0536099"
      },
      "foundingDate": "2026",
      "founder": {
        "@type": "Person",
        "name": "Yogendra Yogi",
        "jobTitle": "Founder",
        "url": "https://www.vistarmodels.com/about"
      },
      "areaServed": [
        "Jaipur", "Mumbai", "Delhi", "Gurugram", "Bengaluru",
        "Pune", "Hyderabad", "Ahmedabad", "Noida", "India"
      ],
      "sameAs": [
        "https://wa.me/918302806913"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Scale Model Consultancy Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Architectural Scale Model Sourcing",
              "description": "Requirement consultation and maker matching for architectural presentation and sales-gallery models"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Township & Masterplan Model Sourcing",
              "description": "Specialist sourcing for large-scale masterplan and township development models"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Industrial Model Sourcing",
              "description": "Sourcing for industrial plant layouts and engineering demonstration models"
            }
          }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.vistarmodels.com/#website",
      "url": "https://www.vistarmodels.com",
      "name": "Vistar Models",
      "publisher": {"@id": "https://www.vistarmodels.com/#organization"},
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.vistarmodels.com/find-a-model-maker?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://www.vistarmodels.com/#localbusiness",
      "name": "Vistar Models",
      "description": "Scale model consultancy and manufacturer sourcing across India",
      "url": "https://www.vistarmodels.com",
      "telephone": "+918302806913",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Jaipur",
        "addressRegion": "Rajasthan",
        "addressCountry": "IN"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        "opens": "00:00",
        "closes": "23:59"
      },
      "priceRange": "₹₹₹"
    }
  ]
}
</script>
```

Add to FAQ page `<head>`:

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does Vistar Models manufacture scale models?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Vistar Models is a specialized scale-model consultancy that helps clients clarify technical scope, identify vetted model makers, and facilitate introductions. Precision fabrication is executed by verified manufacturing workshops suited to the specific scale and materials."
      }
    },
    {
      "@type": "Question",
      "name": "Do you work across India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Our consultancy coordinates scale model sourcing across 9 major metropolitan units in India: Mumbai, Delhi, Jaipur, Bengaluru, Pune, Hyderabad, Ahmedabad, Gurugram, and Noida, handling pan-India transport and on-site gallery installation."
      }
    },
    {
      "@type": "Question",
      "name": "How does Vistar Models match projects with specialist makers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We analyze architectural drawings, required scale (1:50 to 1:1000), material finishes, and machine tolerance requirements (0.1mm CNC & SLA 3D printing) to introduce proven specialist makers with verified track records."
      }
    },
    {
      "@type": "Question",
      "name": "What should I prepare before enquiring about a scale model?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Provide your project type (high-rise, masterplan, infrastructure, industrial), target scale or dimensions, reference CAD/Revit/PDF drawings, lighting requirements, site location, and target delivery deadline."
      }
    },
    {
      "@type": "Question",
      "name": "What scales and types of models are covered?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We cover 1:50 to 1:150 luxury architectural high-rise vitrines, 1:200 to 1:500 township masterplans, 1:1000 city/MMRDA infrastructure layouts, and 1:25 to 1:100 functional engineering models."
      }
    },
    {
      "@type": "Question",
      "name": "What is the cost of an architectural scale model in India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Architectural scale model costs in India vary significantly by scale, size, materials, and detailing level. A basic residential model at 1:200 scale typically starts from ₹50,000–₹1,50,000. A detailed sales-gallery high-rise model with LED lighting and premium finishes can range from ₹3,00,000 to ₹15,00,000 or more. Submit your brief to Vistar Models for a scoped introduction to makers who can quote accurately."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to make a scale model in India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Production timelines depend on scale, complexity, and maker capacity. A simple residential model may take 3–4 weeks. A detailed township masterplan or LED-lit high-rise sales model typically requires 6–12 weeks. Rushing production risks quality. Share your delivery deadline when submitting your brief."
      }
    }
  ]
}
</script>
```

Add to each blog post `<head>`:

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Choose an Architectural Model Maker in India",
  "description": "A practical guide to evaluating architectural scale-model makers — what to prepare, what to ask, and how to match a maker's capability to your presentation purpose.",
  "image": "https://www.vistarmodels.com/images/architectural.webp",
  "datePublished": "2026-10-12",
  "dateModified": "2026-10-12",
  "author": {
    "@type": "Person",
    "name": "Yogendra Yogi",
    "url": "https://www.vistarmodels.com/about",
    "jobTitle": "Founder, Vistar Models"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Vistar Models",
    "url": "https://www.vistarmodels.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.vistarmodels.com/images/logo.png"
    }
  }
}
</script>
```

---

## SECTION 2: CONTENT AEO AUDIT

### 2.1 Homepage Content Analysis

| Check | Status | Finding |
|-------|--------|---------|
| H1 Tag | ⚠️ WEAK | "The Right Model. The Right Maker." — brand slogan, NOT keyword-optimized |
| Meta Description | ⚠️ OK | Decent but no city, no scale, no primary keyword |
| Inverted Pyramid | ⚠️ PARTIAL | First visible text is a tagline, not a direct answer |
| FAQ Section | 🔴 MISSING | FAQ exists at /faq but NOT on homepage — AI can't find it without following link |
| Q&A Schema | 🔴 MISSING | No schema anywhere on site |
| City/State signals | ⚠️ WEAK | 9 cities listed in footer only — not in body content |
| Pricing transparency | 🔴 MISSING | No cost range mentioned anywhere |
| Author attribution | ✅ PASS | Founder name visible |
| Alt text quality | ⚠️ WEAK | Alt text is descriptive but "AI-generated" disclaimer dominates |

### 2.2 Homepage H1 Fix (Priority #1 for SEO)

**Current:** "The Right Model. The Right Maker."

**Replace with:** Keep tagline visually but add an invisible H1 OR restructure:

```html
<h1>India's Scale Model Consultancy &amp; Manufacturer Sourcing</h1>
<p class="tagline">The Right Model. The Right Maker.</p>
```

Or use the sub-header as the actual H1:
```html
<h1>Scale Model Consultancy &amp; Manufacturer Sourcing | India</h1>
```

*(The site already has this as a `<p>` label above the hero — promote it to H1)*

### 2.3 About Page — CRITICALLY THIN

**Current word count:** ~150 words
**Required for AEO:** Minimum 600–800 words

**Add to About page:**
- Yogendra Yogi's full professional background (education, experience, why this industry)
- Why Vistar Models was created (story format)
- How the vetting process works (3–4 paragraphs)
- Industries served (with context)
- What makes Vistar different from searching Google
- A headshot photo of the founder (builds E-E-A-T)
- Credentials: MSME registration details, any industry associations

### 2.4 Blog Content — Good Structure, Needs More

**What works:**
- "In short" summary box at the top ✅ (inverted pyramid)
- TOC present ✅
- Author name listed ✅
- Good H2 structure ✅

**What's missing:**
- Author bio box at the bottom with credentials (2–3 sentences + photo)
- FAQPage Schema at the bottom of each article
- Word count too short for authority (~700 words; target 1,500–2,000)
- Internal links to city pages, category pages
- External citations to industry data

### 2.5 Missing Content (AI Visibility Gaps)

These are the questions people ask LLMs that Vistar currently cannot answer:

| Query | Missing Page/Content |
|-------|---------------------|
| "Architectural model maker in Mumbai" | /units/mumbai needs full content page |
| "Scale model price India" | No pricing page or cost guide |
| "How long does a scale model take" | Not in FAQ, not in blog |
| "Difference between 1:100 and 1:200 scale" | No scale guide |
| "Best architectural model maker Jaipur" | /units/jaipur needs local content |
| "Who makes township models in India" | Thin category page |
| "Industrial plant scale model maker" | Thin category page |
| "How much does an architectural model cost" | ZERO pages on pricing |

### 2.6 Content Calendar (Next 90 Days)

**Month 1 — Foundation Articles (LLM Bait)**

1. **"Architectural Scale Model Cost in India: Complete Price Guide 2026"**
   — Target: "scale model price India", "architectural model cost"
   — Must include: pricing table by scale/type, what affects cost

2. **"1:50 vs 1:100 vs 1:200 Scale: Which is Right for Your Project?"**
   — Target: scale selection queries
   — Must include: comparison table, visual guidance

3. **"How Long Does a Scale Model Take to Make? (India Timelines)"**
   — Target: timeline queries
   — Must include: timeline table by model type

4. **"Township Masterplan Models in India: What You Need to Know"**
   — Target: township model queries
   — Category content upgrade

**Month 2 — City Landing Pages (Local SEO)**

Create fully developed pages for each city unit:
- /units/mumbai → "Scale Model Maker Mumbai — Vistar Models"
- /units/delhi → "Scale Model Maker Delhi/NCR — Vistar Models"
- /units/bengaluru → "Scale Model Maker Bangalore — Vistar Models"
- (etc. for all 9 cities)

Each page needs: 400+ words, local context, maker capabilities in that city, serving areas, how to submit a requirement.

**Month 3 — Authority Articles**

5. **"How CAD Files Are Used to Make Scale Models"**
6. **"LED Lighting in Architectural Scale Models: Types and Options"**
7. **"CNC vs 3D Printing vs Laser Cutting in Model Making"**
8. **"How to Evaluate a Scale Model Maker's Portfolio"**
9. **"Scale Models for Real Estate Marketing in India"**

---

## SECTION 3: AUTHORITY / E-E-A-T AUDIT

### 3.1 Current State

| Signal | Status | Finding |
|--------|--------|---------|
| Google My Business | ⚠️ UNKNOWN | Verify all 9 city GMB listings are active |
| Reviews | 🔴 MISSING | Zero reviews visible on site |
| Testimonials | 🔴 MISSING | No client testimonials anywhere |
| Case studies / Portfolio | 🔴 MISSING | No "work we've sourced" showcase |
| Backlinks | 🔴 VERY LOW | New site, likely <10 backlinks |
| Directory listings | 🔴 MISSING | Not on IndiaMart, Justdial, Sulekha, etc. |
| PR / Media mentions | 🔴 MISSING | None found |
| Social media presence | ⚠️ UNKNOWN | No social links in site footer |
| MSME Registration | ✅ PASS | UDYAM-RJ-17-0536099 visible |
| Contact info | ✅ PASS | Phone, email, WhatsApp present |

### 3.2 Authority Building Roadmap

**Immediate (Week 1–2):**
- Submit to these free directories:
  - IndiaMart (free listing)
  - IndiaBusinessOnline.com
  - Justdial (free basic listing)
  - Sulekha (free listing)
  - TradeIndia
  - Yellowpages India
  - Exporters India
  - Udyam Portal (already registered — add web link)

**Month 1:**
- Get first 5 client reviews on Google (use for testimonials on site)
- Add testimonials section to homepage
- Create a LinkedIn company page (post once/week)
- Create Instagram presence (model photos are visually striking)

**Month 2–3:**
- Target backlinks from:
  - Architecture blogs (guest posts: "How to Brief a Scale Model Maker")
  - Real estate news sites (PropTiger, 99acres blogs)
  - Design news (Archdaily India section, Dezeen India)
  - Construction publications
  - LinkedIn Articles (by Yogendra Yogi with links back to site)

---

## SECTION 4: AI VISIBILITY CHECK

### 4.1 Current LLM Status

**Query tested (hypothetical based on site analysis):**
"Who are the best architectural scale model makers in India?"

**Vistar Models likely appears:** ❌ NOT YET

**Reason:** The site is new (2026), has zero backlinks from authority sites, no Wikipedia mention, no media coverage. LLMs train on data that includes web sources — a site with no authority signals will not appear.

**What needs to happen for LLM visibility:**
1. Get cited by at least 3–5 external authority sites
2. Get Google indexing confirmed (Search Console)
3. Add Schema markup (LLMs parse structured data)
4. llms.txt file in place
5. Blog articles need to become the "definitive answer" on key topics

### 4.2 AI Crawler Permissions

Verify that none of these are blocked in robots.txt:
- `GPTBot` (OpenAI/ChatGPT)
- `OAI-SearchBot` (OpenAI search)
- `ChatGPT-User`
- `PerplexityBot`
- `ClaudeBot` (Anthropic)
- `Google-Extended` (Gemini training data)
- `CCBot` (Common Crawl — base training for most LLMs)

### 4.3 Perplexity / SearchGPT Optimization

These engines do live web search before answering. To appear:
1. Your pages must rank in Google for the query (SEO first)
2. Your content must directly answer the question (inverted pyramid)
3. You need structured data (Schema)
4. Fresh content signals (recent publish dates, frequent updates)

---

## SECTION 5: FULL PRIORITY ACTION PLAN

### TIER 1 — DO THIS WEEK (0 cost, high impact)

| # | Action | Time | Impact |
|---|--------|------|--------|
| 1 | Create `llms.txt` (template above) and upload to root | 20 min | AI crawler visibility |
| 2 | Add Organization + LocalBusiness JSON-LD to homepage | 1 hour | Schema presence |
| 3 | Add FAQPage JSON-LD to FAQ page | 30 min | AI answer eligibility |
| 4 | Add Article JSON-LD to each blog post | 30 min | Author authority |
| 5 | Verify robots.txt allows all AI crawlers | 15 min | Crawlability |
| 6 | Submit sitemap to Google Search Console | 10 min | Indexation |
| 7 | Fix homepage H1 to include primary keyword | 10 min | SEO |
| 8 | Add FAQ section to homepage (at minimum 5 Q&As) | 2 hours | AEO |

### TIER 2 — MONTH 1

| # | Action | Time | Impact |
|---|--------|------|--------|
| 9 | Expand About page to 700+ words with founder story | 3 hours | E-E-A-T |
| 10 | Add author bio boxes to all blog posts (with photo) | 1 hour | E-E-A-T |
| 11 | Write "Scale Model Cost India" article | 4 hours | High-intent traffic |
| 12 | Submit to 8+ free Indian directories | 2 hours | Authority |
| 13 | Set up Google My Business for Jaipur (primary) | 1 hour | Local SEO |
| 14 | Add pricing transparency section to homepage or services | 1 hour | Trust + AEO |
| 15 | Add testimonials section (even if empty placeholder) | 1 hour | Social proof |
| 16 | Create city-specific content on /units/[city] pages | 8 hours | Local SEO |

### TIER 3 — MONTH 2–3

| # | Action | Impact |
|---|--------|--------|
| 17 | Publish 2 blog articles/month minimum | Content authority |
| 18 | LinkedIn company page + weekly posts | Brand visibility |
| 19 | Instagram presence with model photos | Visual authority |
| 20 | Outreach to 5 architecture blogs for guest posts | Backlinks |
| 21 | Get 10 Google reviews (ask early clients) | E-E-A-T |
| 22 | Add BreadcrumbList schema to all pages | Navigation signals |
| 23 | Add VideoObject schema if explainer video created | Rich results |
| 24 | Monitor GSC for impression growth | Tracking |

---

## SECTION 6: AI IDE PROMPT — COMPLETE IMPLEMENTATION GUIDE

Give this entire prompt to Cursor AI / GitHub Copilot / Windsurf / any AI IDE:

---

```
TASK: Full SEO + AEO + GEO implementation for vistarmodels.com

WEBSITE: https://www.vistarmodels.com/
STACK: Unknown (check package.json / next.config.js / astro.config.mjs etc.)

=== STEP 1: IDENTIFY STACK ===
First, identify the framework (Next.js, Astro, SvelteKit, plain HTML, etc.)
Then identify how <head> tags are managed.

=== STEP 2: CREATE llms.txt ===
Create file at: /public/llms.txt (or root depending on framework)
Content: [paste the llms.txt content from this audit document]

=== STEP 3: ADD JSON-LD SCHEMA ===

A) Homepage — add Organization + WebSite + LocalBusiness schema in <head>:
[paste the Organization JSON-LD from this audit]

B) FAQ page (/faq) — add FAQPage schema in <head>:
[paste the FAQPage JSON-LD from this audit]

C) Each blog post — add Article schema dynamically using post metadata:
[paste the Article JSON-LD template from this audit]

=== STEP 4: FIX HOMEPAGE H1 ===
Find the element that currently renders "The Right Model. The Right Maker."
Ensure the page's semantic H1 is "Scale Model Consultancy & Manufacturer Sourcing | India"
The tagline can remain visually prominent but must not be the only H1.

=== STEP 5: ADD FAQ SECTION TO HOMEPAGE ===
Add a new section to the homepage BEFORE the footer CTA.
Use this content with accordion expand/collapse:

Q: What does Vistar Models do?
A: Vistar Models is a scale-model consultancy — not a manufacturer. We help architects, developers, and infrastructure clients clarify their model requirements, identify verified specialist makers, and facilitate direct introductions to relevant workshops across India.

Q: How much does a scale model cost in India?
A: Costs vary by scale, size, materials, and detailing. A basic 1:200 residential model starts from approximately ₹50,000–₹1,50,000. A detailed sales-gallery high-rise model with LED lighting can range from ₹3,00,000–₹15,00,000 or more. We help you clarify scope so makers can quote accurately.

Q: Which cities do you serve?
A: We source scale models across 9 cities: Mumbai, Delhi, Jaipur, Gurugram, Bengaluru, Pune, Hyderabad, Ahmedabad, and Noida, with pan-India transport and installation coordination.

Q: How long does a scale model take to make?
A: Production timelines range from 3–4 weeks for simpler residential models to 6–12 weeks for large township masterplans or detailed LED-lit high-rise models. Share your delivery deadline when submitting your brief.

Q: What files should I prepare?
A: 2D CAD (DWG/DXF), 3D BIM/Revit, SketchUp, Rhino, or high-resolution architectural PDFs. All drawings are handled with commercial confidentiality.

Q: Do you work with government and infrastructure projects?
A: Yes. We source scale models for public-sector buyers, infrastructure and engineering firms, educational institutions, and municipal/MMRDA projects, in addition to private developers and architects.

Then wrap this section in FAQPage JSON-LD schema as shown in STEP 3B.

=== STEP 6: UPDATE ROBOTS.TXT ===
Ensure /public/robots.txt includes:
- Allow for GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended
- Sitemap declaration: Sitemap: https://www.vistarmodels.com/sitemap.xml

=== STEP 7: META DESCRIPTION IMPROVEMENTS ===

Homepage: 
"Vistar Models — India's scale-model consultancy. Find verified architectural, township and industrial model makers across Mumbai, Delhi, Bengaluru, Jaipur and 5 more cities. Submit your brief today."

About page:
"Vistar Models, founded by Yogendra Yogi in 2026, is India's dedicated scale-model consultancy — structured sourcing, capability matching and maker introductions for architects, developers and engineers."

FAQ page:
"Common questions about Vistar Models' scale-model sourcing process — consultancy role, scales covered (1:50 to 1:1000), file formats accepted, costs, timelines and maker vetting."

=== STEP 8: CITY PAGES CONTENT EXPANSION ===
For each /units/[city] page, ensure minimum 400 words including:
- City-specific heading: "Scale Model Sourcing in [City] — Vistar Models"
- Local context (which industries are prominent in that city)
- Model types commonly needed in that city
- How to submit a requirement from that city
- LocalBusiness schema with city address

=== STEP 9: BREADCRUMB SCHEMA ===
Add BreadcrumbList JSON-LD to all inner pages.
Example for /blog/how-to-choose-an-architectural-model-maker:

{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type":"ListItem","position":1,"name":"Home","item":"https://www.vistarmodels.com/"},
    {"@type":"ListItem","position":2,"name":"The Vistar Journal","item":"https://www.vistarmodels.com/blog"},
    {"@type":"ListItem","position":3,"name":"How to Choose an Architectural Model Maker in India","item":"https://www.vistarmodels.com/blog/how-to-choose-an-architectural-model-maker"}
  ]
}

=== STEP 10: VERIFY SITEMAP ===
Ensure sitemap.xml includes ALL pages:
- / (homepage)
- /about
- /faq
- /services
- /categories
- /how-it-works
- /industries
- /for-manufacturers
- /become-a-partner
- /blog
- /blog/[each-article]
- /units/[each-city] (all 9)
- /architectural-makers
- /township-makers
- /industrial-makers
- /contact

=== VERIFICATION CHECKLIST ===
After implementation, verify:
[ ] https://www.vistarmodels.com/llms.txt returns 200 with Markdown content
[ ] https://www.vistarmodels.com/robots.txt allows AI bots
[ ] https://www.vistarmodels.com/sitemap.xml returns valid XML
[ ] Google Rich Results Test shows Organization schema on homepage
[ ] Google Rich Results Test shows FAQPage schema on /faq
[ ] Homepage H1 contains primary keyword
[ ] FAQ section visible on homepage
[ ] All blog posts show author name and date
```

---

## SECTION 7: BEYOND-WEBSITE AUDIT CHECKLIST

These things OUTSIDE the website also determine your LLM + Google rank:

### 7.1 Google Business Profile (GMB)

- [ ] All 9 city units have separate GMB listings
- [ ] Each listing has: complete category, services, photos, hours, website link
- [ ] Primary category: "Scale Model Designer" or "Architectural Model Maker"
- [ ] Posts updated weekly on GMB
- [ ] Q&A section filled manually
- [ ] First 10 reviews collected and responded to
- [ ] GMB website links to matching /units/[city] page

### 7.2 Social Media Presence

- [ ] LinkedIn company page: vistarmodels
- [ ] Instagram: @vistarmodels (model photos are visually viral)
- [ ] Pinterest board: "Scale Models India"
- [ ] Twitter/X: for industry conversation
- [ ] YouTube: one explainer video "How Scale Model Sourcing Works"

### 7.3 Citation / Directory Listings

- [ ] IndiaMart (free listing)
- [ ] Justdial (free basic)
- [ ] Sulekha
- [ ] TradeIndia
- [ ] IndiaBusinessOnline
- [ ] MSME Sampark (government portal)
- [ ] Udyam portal (linked with UDYAM-RJ-17-0536099)
- [ ] Arquitecto India / architecture directories
- [ ] Houzz India (if applicable)

### 7.4 Backlink Targets

- [ ] Guest post on Indian architecture blogs
- [ ] Feature in PropTiger / 99Acres industry section
- [ ] LinkedIn Articles by Yogendra Yogi (with site links)
- [ ] Press release on PRwire India / BusinessWire
- [ ] Wikipedia mention (when site has enough authority)
- [ ] CREDAI / RICS / IIA (Institute of Indian Architects) mentions

### 7.5 Analytics & Monitoring Setup

- [ ] Google Search Console — sitemap submitted, errors monitored
- [ ] Google Analytics 4 — AI referral traffic tracked (source: chatgpt.com, perplexity.ai)
- [ ] Brand monitoring: Google Alerts for "Vistar Models"
- [ ] Track LLM citations: test weekly "scale model maker India" in ChatGPT, Perplexity, Gemini

---

## APPENDIX: CURRENT SCORE BREAKDOWN

### What's Already Working ✅
- SSR rendering (AI bots can read all content)
- Canonical tags on every page
- OG and Twitter card meta on every page
- MSME registration displayed (trust signal)
- FAQPage with detailed Q&As (just needs schema)
- Blog content with inverted pyramid structure
- Author attribution (Yogendra Yogi named)
- 9-city coverage stated
- WhatsApp CTA (conversion-optimized)
- webP images (good performance signal)
- Mobile viewport meta

### What Must Be Fixed Immediately 🔴
- llms.txt MISSING
- JSON-LD Schema entirely absent
- Homepage H1 not keyword-optimized
- About page far too thin (150 words → needs 700+)
- Pricing not mentioned anywhere
- No FAQ section on homepage
- No reviews / testimonials
- Zero backlinks from authority sites
- AI crawlers not explicitly permitted in robots.txt

---

*Audit prepared by Claude (Anthropic) for Vistar Models | 2026-10-18*
*Next scheduled review: 2026-12-18 (60 days)*
