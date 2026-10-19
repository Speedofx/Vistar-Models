# 📋 VISTAR MODELS — WEBSITE PAGES & SECTIONS COMPLETE AUDIT CATALOG
**Comprehensive Blueprint of All Pages, Source Files, Section Counts & Section Details**

> **Project:** Vistar Models ([vistarmodels.com](https://www.vistarmodels.com))  
> **Entity:** MSME Registered — UDYAM-RJ-17-0536099  
> **Framework:** React Router v7 + Vite + Tailwind CSS / Vanilla CSS  
> **Total User-Facing Web Pages:** **39 Pages**  
> **Total Technical/SEO Endpoints:** **6 Endpoints**  
> **Global Shared Elements:** Persistent Header/Nav (`SiteHeader`) & Footer (`SiteFooter`)

---

## 📊 EXECUTIVE SUMMARY TABLE

| # | Page Category | Total Pages | Typical Sections Per Page | Key Components Used |
|---|---------------|:-----------:|:-------------------------:|---------------------|
| 1 | **Home Page** | **1** | 10 | `Hero`, `Perspective`, `CategoryGallery`, `Capability`, `Process`, `Founder`, `IndustryPartners`, `BlogTeaser`, `HomepageFaq`, `ContactCta` |
| 2 | **Core Institutional Pages** | **12** | 2 – 4 | `PageHeading`, `PageContent`, `EnquiryForm`, `Capability`, `Founder`, `Process`, `ContactCta` |
| 3 | **Model Category Pages** | **9** | 3 | `PageHeading`, `CategoryContent` (Figure, Scope, Details Checklist), `ContactCta` |
| 4 | **Operating Units (City Hubs)** | **10** | 5 – 9 | `UnitsHub` directory, City Station Bar, Terminal Rows, 200 FAQ Engine, Pricing Table, Local CTAs |
| 5 | **Journal / Blog System** | **7** | 3 – 6 | `BlogIndex`, `ArticleBody` (TOC Sidebar, Hero, TL;DR, Subsections, CTA), `ContactCta` |
| **TOTAL** | **All User Web Pages** | **39** | — | **Fully Responsive & AEO/GEO Optimized** |
| 6 | *Technical / SEO Feeds* | *6* | *API / XML / TXT* | `sitemap.xml`, `robots.txt`, `rss.xml`, `llms.txt`, `api.health`, `api.$` |

---

## 🌐 GLOBAL PERSISTENT SECTIONS (Every Page)

These two global shell components frame every single page via `src/root.tsx`:
1. **Global Site Header (`SiteHeader`):** Brand wordmark logo, primary navigation links (Categories, Services, Units, Journal, About), and direct WhatsApp & Call contact action buttons.
2. **Global Site Footer (`SiteFooter`):** Institutional information, MSME registration note (UDYAM-RJ-17-0536099), 9 city hubs directory links, 9 category links, legal links (Privacy, Terms), copyright & operational hours note (24/6 Mon–Sat).

---

## 1️⃣ HOME PAGE (1 PAGE)

### Route: `/`
* **Source File:** `src/routes/home.tsx`
* **Total Page Sections:** **10 Sections**
* **Detailed Breakdown of Sections:**
  1. **Section 1: Hero (`<Hero />`)**
     * *Headline:* "Scale Model Consultancy & Manufacturer Sourcing | India"
     * *Tagline:* "The Right Model. The Right Maker."
     * *Elements:* Primary call to action button, category explorer link, high-priority preloaded WebP image, and scroll marker.
  2. **Section 2: Perspective (`<Perspective />`)**
     * *Headline:* "Understand. Source. Connect."
     * *Purpose:* Outlines the philosophy that Vistar brings the brief and maker together while fabrication remains with specialist makers.
  3. **Section 3: Model Categories Gallery (`<CategoryGallery compact />`)**
     * *Headline:* "Explore Model Categories"
     * *Elements:* Grid of 9 scale-model categories with high-resolution imagery and direct links to category detail pages.
  4. **Section 4: Capability & Sourcing Criteria (`<Capability />`)**
     * *Headline:* "Capability-Based Maker Matching"
     * *Purpose:* Explains how projects are matched based on materials, tolerances, lighting, and machine capacity.
  5. **Section 5: 5-Step Sourcing Workflow (`<Process />`)**
     * *Headline:* "From Requirement to Relevant Introduction"
     * *Steps:* 1. Share Requirement → 2. Clarify Scope → 3. Identify Makers → 4. Connect & Discuss → 5. Execution & Delivery.
  6. **Section 6: Founder & Institutional Credibility (`<Founder />`)**
     * *Headline:* "Founder & Governance"
     * *Details:* Profile of Yogendra Yogi, Government of India MSME registration UDYAM-RJ-17-0536099, and strict neutrality statement.
  7. **Section 7: Industry Partners & Client Sectors (`<IndustryPartners />`)**
     * *Headline:* "Who We Serve"
     * *Sectors:* Architects, Developers, Infrastructure, Industrial Plants, Museums, and Technical Institutions.
  8. **Section 8: Featured Journal Articles (`<BlogTeaser />`)**
     * *Headline:* "From the Vistar Journal"
     * *Purpose:* Showcases top practical sourcing guides and reading materials.
  9. **Section 9: Core Direct-Answer FAQ Engine (`<HomepageFaq />`)**
     * *Headline:* "Frequently Asked Questions"
     * *Structure:* Native accessible accordions answering the top 10 consultancy and sourcing questions with schema markup.
  10. **Section 10: Institutional Direct Action CTA (`<ContactCta />`)**
      * *Headline:* "Ready to discuss your model requirement?"
      * *Actions:* Instant WhatsApp desk launcher, direct phone hotline (`+91 83028 06913`), and requirement submission link.

---

## 2️⃣ CORE INSTITUTIONAL & INFORMATIONAL PAGES (12 PAGES)

These pages are routed via `src/routes/page.tsx` and dynamically load content from `src/data/site.ts` and `src/components/page-content.tsx`.

### 1. `/about` — About Vistar Models
* **Source:** `src/routes/page.tsx` + `src/data/site.ts`
* **Total Sections:** **4 Sections**
  1. `PageHeading`: "Better connections. More considered models."
  2. `Founder`: Founder profile, Government MSME registration, neutrality doctrine.
  3. `PageContent`: Editorial reading block (Consultancy vs Manufacturing, Sourcing Approach, Division of Responsibilities).
  4. `ContactCta`: Inbound requirement consultation banner.

### 2. `/services` — Consultancy Services
* **Source:** `src/routes/page.tsx` + `src/data/site.ts`
* **Total Sections:** **3 Sections**
  1. `PageHeading`: "A clearer brief. A more relevant search."
  2. `PageContent`: Editorial split layout with an intro rail and 8 numbered service cards (Requirement consultation, Maker matching, Scope clarification, etc.).
  3. `ContactCta`: Direct enquiry prompt.

### 3. `/find-a-model-maker` — Sourcing Intake & Requirement Matching
* **Source:** `src/routes/page.tsx` + `src/components/enquiry-form.tsx`
* **Total Sections:** **4 Sections**
  1. `PageHeading`: "Let’s find the capabilities your project needs."
  2. `Capability`: 8-point criteria for matching projects to fabrication workshops.
  3. `EnquiryForm`: Interactive requirement submission form with category selection, dimensions, budget, location, and file upload.
  4. *Note:* Bottom global CTA is hidden to prioritize the form submission.

### 4. `/categories` — Model Categories Directory
* **Source:** `src/routes/page.tsx` + `src/components/category-gallery.tsx`
* **Total Sections:** **3 Sections**
  1. `PageHeading`: "Different models. Different expertise."
  2. `CategoryGallery`: Comprehensive 9-card visual gallery linking to all individual category pages.
  3. `ContactCta`: Requirement consultation CTA banner.

### 5. `/industries` — Industries We Serve
* **Source:** `src/routes/page.tsx` + `src/data/site.ts`
* **Total Sections:** **3 Sections**
  1. `PageHeading`: "Built around your industry’s purpose."
  2. `PageContent`: 8 numbered industry sectors (Architects, Developers, Infrastructure, Industrial Plants, Public Sector, Colleges, Museums, Exhibitions) with direct enquiry triggers.
  3. `ContactCta`: Requirement consultation banner.

### 6. `/how-it-works` — Sourcing Workflow & Process
* **Source:** `src/routes/page.tsx` + `src/components/process.tsx`
* **Total Sections:** **4 Sections**
  1. `PageHeading`: "From a requirement to a relevant introduction."
  2. `Process`: Detailed 5-stage procurement walkthrough.
  3. `PageContent`: Deep-dive architectural reading block (Preparing quotation brief, Comparing scopes, Agreeing before making).
  4. `ContactCta`: Requirement consultation banner.

### 7. `/for-manufacturers` — For Manufacturing Partners
* **Source:** `src/routes/page.tsx` + `src/data/site.ts`
* **Total Sections:** **4 Sections**
  1. `PageHeading`: "Your capabilities. The relevant conversation."
  2. `PageContent (Editorial Split)`: Capability-matching rationale, neutrality, button to become a partner.
  3. `PageContent (Reading Block)`: What workshops should include in applications and what to expect.
  4. `ContactCta`: Direct enquiry prompt.

### 8. `/become-a-partner` — Maker Network Application
* **Source:** `src/routes/page.tsx` + `src/components/enquiry-form.tsx`
* **Total Sections:** **3 Sections**
  1. `PageHeading`: "Introduce your workshop."
  2. `EnquiryForm (partner=true)`: Application form for workshops (Equipment, materials, capacity, past project links).
  3. *Note:* Standalone focused page for workshop onboarding.

### 9. `/faq` — Comprehensive FAQs
* **Source:** `src/routes/page.tsx` + `src/data/site.ts`
* **Total Sections:** **3 Sections**
  1. `PageHeading`: "Good questions. Clear expectations."
  2. `PageContent`: Interactive accordions for top 10 frequently asked questions + direct contact box (Phone & WhatsApp).
  3. `ContactCta`: Direct enquiry prompt.

### 10. `/contact` — Contact Desk & PAN-India Hotline
* **Source:** `src/routes/page.tsx` + `src/components/enquiry-form.tsx`
* **Total Sections:** **3 Sections**
  1. `PageHeading`: "Tell us what your project needs."
  2. `PageContent`: Direct contact terminals (Phone hotline, WhatsApp direct link, Email, PAN-India service notice).
  3. `EnquiryForm`: Full inquiry form for project submissions.

### 11. `/privacy` — Privacy Policy
* **Source:** `src/routes/page.tsx` + `src/data/site.ts`
* **Total Sections:** **2 Sections**
  1. `PageHeading`: "Privacy Policy · Last updated 15 October 2026"
  2. `PageContent`: 6 policy blocks (Information collected, Usage, Storage & Security, Retention, External services, Confidential drawings).

### 12. `/terms` — Terms of Use
* **Source:** `src/routes/page.tsx` + `src/data/site.ts`
* **Total Sections:** **2 Sections**
  1. `PageHeading`: "Terms of Use · Last updated 15 October 2026"
  2. `PageContent`: 7 legal blocks (Consultancy role, No guaranteed outcome, Client/Maker agreements, Scope & fees, Applications, Illustrative imagery, Website use).

---

## 3️⃣ MODEL CATEGORY PAGES (9 PAGES)

These pages are loaded dynamically via `:slug` in `src/routes/page.tsx` and render `src/components/category-content.tsx`. Each category page contains **3 distinct sections**:

1. **Section 1: Category Masthead (`PageHeading`)**
   * *Title:* "Find [Category Name] Makers in India"
   * *Eyebrow:* "Specialist model sourcing"
   * *Intro:* Technical scope definition and briefing guidance.
2. **Section 2: Category Technical Content (`CategoryContent`)**
   * *Figure & Showcase:* High-resolution illustrative model visual with WebP compression.
   * *Editorial Split:* "Match the capability to the purpose" guidance.
   * *Scope Checklist:* "Useful details to share" (drawings, scales, lighting, materials).
   * *Explore Other Categories Link:* Cross-navigation link.
3. **Section 3: Direct Action CTA (`ContactCta`)**
   * Instant project consultation trigger via Phone, WhatsApp, and form.

### The 9 Category Pages:
1. `/architectural-makers` — Architectural Models (Residential, commercial towers, sales galleries)
2. `/township-makers` — Township & Master Plans (Large scale, zoning, roads, landscape)
3. `/industrial-makers` — Industrial Plants & Factories (Refineries, piping, process flow)
4. `/villa-commercial-makers` — Villa & Commercial Models (Bungalows, cutaways, retail podiums)
5. `/interior-makers` — Interior Presentation Models (Cutaway apartments, furniture layouts)
6. `/exhibition-makers` — Exhibition & Presentation (Museum displays, trade expos, public kiosks)
7. `/engineering-infrastructure-makers` — Engineering & Infrastructure (Bridges, transit, civil works)
8. `/working-demonstration-makers` — Working & Demonstration Models (Motors, gearboxes, functional flows)
9. `/3d-printing-components` — 3D Printing & Components (SLA/PolyJet prototyping, precision accents)

---

## 4️⃣ REGIONAL OPERATING UNITS & BRANCH PAGES (10 PAGES)

### A. All Branches Directory: `/units`
* **Source File:** `src/routes/units.tsx`
* **Total Page Sections:** **5 Sections**
  1. **Section 1: Regional Masthead (`PageHeading`)**
     * Title: "Our Registered Branches & Operating Units Across India."
     * Eyebrow: "MSME Registered · UDYAM-RJ-17-0536099 · 9 Strategic Hubs"
  2. **Section 2: Metro Corridor Quick Station Bar**
     * Horizontal jump-link bar providing instant navigation to all 9 active city hubs.
  3. **Section 3: Architectural Masterplan Directory (9 Hub Terminal Strips)**
     * Clean monospace terminal rows displaying City, State, RERA jurisdiction, Municipal authority, Google ratings, audited project count, and direct WhatsApp/Maps links.
  4. **Section 4: National Capability & Trust Badges**
     * 3-column verification grid: MSME UDYAM Registration, Heavy-duty Crating & Logistics, 24/6 Technical Desk.
  5. **Section 5: Direct Action CTA (`ContactCta`)**

---

### B. 9 City Operating Unit Pages (`/units/:city`)
* **Source File:** `src/routes/units.$city.tsx`
* **Total Sections Per City Page:** **9 Sections**
* **The 9 City Pages:**
  1. `/units/jaipur` (Flagship Headquarters)
  2. `/units/mumbai`
  3. `/units/delhi`
  4. `/units/gurugram`
  5. `/units/noida`
  6. `/units/bengaluru`
  7. `/units/pune`
  8. `/units/hyderabad`
  9. `/units/ahmedabad`

#### Detailed Breakdown of the 9 Sections on Each City Page:
1. **Section 1: Breadcrumb & Switch Branch Quick Navigation Bar**
   * Accessible hierarchy (`Home > My Branches > [City]`) and dynamic city switch bar to immediately jump to other city hubs.
2. **Section 2: City Regional Masthead & Verification Header**
   * Official H1 tag: `3D Scale Model Making Company in [City] — Architectural & Industrial Scale Models`.
   * Government MSME Registration badge and Google Review rating badge (5.0 ★).
3. **Section 3: Atomic Featured Snippet & AI Overview Box (AEO/GEO Engine)**
   * Specially crafted 40–60 word direct-answer snippet containing official branch address, municipal authority, RERA jurisdiction, and precision manufacturing capabilities.
4. **Section 4: Branch Address, Contact & Map Terminal**
   * Microdata-styled address block with direct phone hotline, email, and one-click Google Maps navigation.
5. **Section 5: Visual Model Showcase with Image SEO Pack**
   * 4-card high-res visual grid showing High-Rise Towers, Township Masterplans, Industrial Refineries, and Luxury Villas with localized alt tags.
6. **Section 6: Localized Cost & Technical Specification Comparison Table**
   * Transparent reference table displaying Model Category, Standard Scale, Key Materials, Fabrication Time, Price Range (₹), and Ideal Purpose for that city.
7. **Section 7: Deep Market Context & Regional Authority Alignment**
   * Two-column editorial section covering local urban growth corridors, RERA compliance, and builder presentation standards.
8. **Section 8: The 200 Questions & Answers Knowledge Base (Interactive AEO Engine)**
   * Live client-side search input filtering 200 city-specific FAQs with zero cumulative layout shift (CLS).
9. **Section 9: Inter-Branch Directory & Institutional CTA (`ContactCta`)**
   * Direct cross-links to the other 8 city branches followed by the contact CTA banner.

---

## 5️⃣ THE VISTAR JOURNAL / BLOG SYSTEM (7 PAGES)

### A. Journal Main Listing: `/blog`
* **Source File:** `src/routes/blog.tsx` + `src/components/blog/blog-index.tsx`
* **Total Page Sections:** **3 Sections**
  1. **Section 1: Journal Masthead (`PageHeading`)**
     * Title: "The Vistar Journal."
     * Eyebrow: "Scale model sourcing · Articles"
  2. **Section 2: Journal Index & Article Grid (`BlogIndex`)**
     * Editorial intro banner + responsive 6-card grid with cover images, read times, categories, excerpts, and 24/6 operating schedule note.
  3. **Section 3: Institutional CTA (`ContactCta`)**

---

### B. 6 Individual Article Pages (`/blog/:slug`)
* **Source File:** `src/routes/blog.$slug.tsx` + `src/components/blog/article-body.tsx`
* **Total Sections Per Article Page:** **6 Sections**
* **The 6 Articles:**
  1. `/blog/how-to-choose-an-architectural-model-maker`
  2. `/blog/prepare-a-useful-quotation-brief-for-a-scale-model`
  3. `/blog/matching-a-model-maker-to-project-capabilities`
  4. `/blog/types-of-scale-models-and-their-uses`
  5. `/blog/scale-model-timelines-and-budget-considerations`
  6. `/blog/what-does-a-scale-model-sourcing-consultancy-do`

#### Detailed Breakdown of the 6 Sections in Each Article:
1. **Section 1: Sticky Architectural Sidebar (Left Rail)**
   * Article category badge, author metadata, publication date, read time, auto-generated Table of Contents, and quick consultation button.
2. **Section 2: Editorial Masthead & High-Resolution Cover**
   * Article H1 title, lead excerpt, and preloaded WebP cover figure.
3. **Section 3: Atomic TL;DR Answer Box**
   * Direct, concise executive summary formatted for Google AI Overviews and Perplexity search answers.
4. **Section 4: Main Body Content Stream**
   * Deep technical content split across 4–8 H2 subheadings with actionable guidelines and checklists.
5. **Section 5: In-Article Requirement CTA & Related Articles Nav**
   * Direct contact desk buttons (Call, WhatsApp) and contextual internal links to related categories and pages.
6. **Section 6: Institutional Global CTA (`ContactCta`)**

---

## 6️⃣ SYSTEM, SEO & DISCOVERY FEEDS (6 ENDPOINTS)

These endpoints are configured in `src/routes.ts` for automated crawling, AI search engine indexing, and uptime monitoring:

1. `/sitemap.xml` (`src/routes/sitemap.xml.ts`): Dynamic XML sitemap publishing all 39 canonical URLs with exact `lastmod` timestamps.
2. `/robots.txt` (`src/routes/robots.txt.ts`): Optimized search engine crawler directives permitting Googlebot, Bingbot, PerplexityBot, ClaudeBot, and GPTBot.
3. `/llms.txt` (`src/routes/llms.txt.ts`): Structured markdown index for Large Language Models (LLMs) summarizing Vistar Models' entire entity structure.
4. `/rss.xml` (`src/routes/rss.xml.ts`): RSS feed broadcasting newly published articles from The Vistar Journal.
5. `/api/health` (`src/routes/api.health.ts`): Health check endpoint returning HTTP 200 OK for uptime pingers.
6. `/api/*` (`src/routes/api.$.ts`): Catch-all API handler for backend and serverless integrations.

---

## 📌 MASTER NUMERICAL SUMMARY

$$\begin{aligned}
\text{Home Page} &: 1 \text{ page} \times 10 \text{ sections} = 10 \text{ sections} \\
\text{Core Pages} &: 12 \text{ pages} \times (\approx 3 \text{ sections}) = 38 \text{ sections} \\
\text{Category Pages} &: 9 \text{ pages} \times 3 \text{ sections} = 27 \text{ sections} \\
\text{Units Hub} &: 1 \text{ page} \times 5 \text{ sections} = 5 \text{ sections} \\
\text{City Unit Pages} &: 9 \text{ pages} \times 9 \text{ sections} = 81 \text{ sections} \\
\text{Blog Hub} &: 1 \text{ page} \times 3 \text{ sections} = 3 \text{ sections} \\
\text{Blog Articles} &: 6 \text{ pages} \times 6 \text{ sections} = 36 \text{ sections} \\
\hline
\mathbf{Total\ Web\ Pages} &: \mathbf{39\ Pages} \\
\mathbf{Total\ Rendered\ Sections} &: \mathbf{200\ Sections\ across\ the\ website}
\end{aligned}$$
