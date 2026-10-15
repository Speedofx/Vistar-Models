# 01 — Code Architecture & Technical Implementation

> This document details the exact technical stack, schema, and algorithmic optimizations coded into the Vistar Models application for Search Engine Optimization (SEO), Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), and Large Language Model (LLM) scraping.

---

## 1. Directory & Routing Architecture

* **Framework:** React Router v7 (SSR + Client Hydration) on Node.js / Vite.
* **Routing Priority (`src/routes.ts`):**
  * `/units` -> Defined as top-level hub `routes/units.tsx`
  * `/units/:city` -> Defined as dynamic branch page `routes/units.$city.tsx`
  * `*` -> Wildcard catch-all comes **after** units routes to prevent route hijacking.

---

## 2. 1,800 FAQs Vector Matrix (AEO / GEO Engine)

To answer long-tail questions asked by architects, real estate developers, and infrastructure bodies:
1. **Core Technical FAQs (`src/data/units-core-faqs.ts`):**
   * 100 deep technical and commercial Q&As covering:
     * Tolerance limits (±0.1mm SLA 3D printing & laser cutting)
     * Materials (German acrylic, SLA photopolymer resin, ABS, timber, aluminum extrusions)
     * Lighting systems (Addressable RGBW, DMX512 controllers, Crestron/AMX automation)
     * Acrylic display vitrines (5-sided UV-bonded museum grade with anti-reflective coating)
     * Packaging & Flight cases (Custom ATA-300 flight cases with custom-routed EVA foam)
2. **City-Specific Municipal & Regional FAQs (`src/data/units-city-faqs.ts`):**
   * 100 hyper-local Q&As per city covering:
     * Exact local authorities: **MMRDA**, **BMC**, **MHADA**, **CIDCO**, **MahaRERA** (Mumbai); **JDA**, **RIICO** (Jaipur); **DDA** (Delhi); **DTCP**, **GMDA** (Gurugram); **BBMP**, **BMRDA** (Bengaluru), etc.
     * Local climates (coastal humidity UV-resistance in Mumbai vs dry heat in Jaipur).
     * Local high-profile zones (BKC, Lower Parel, Nariman Point, Andheri, Navi Mumbai).
3. **Total Coverage:** 9 Units × 200 FAQs = **1,800 unique indexed answers** with search filtering on the client.

---

## 3. JSON-LD Structured Data (Schemas)

Every page renders rich JSON-LD in the `<head>` to feed Google Rich Results and LLM knowledge graphs:

### A. LocalBusiness Schema
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Vistar Models – Mumbai Unit",
  "url": "https://www.vistarmodels.com/units/mumbai",
  "telephone": "+918302806913",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Unit 402, High Street Phoenix Industrial Zone, Senapati Bapat Marg, Lower Parel",
    "addressLocality": "Mumbai",
    "addressRegion": "Maharashtra",
    "postalCode": "400013",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 18.9953,
    "longitude": 72.8258
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "89"
  }
}
```

### B. FAQPage Schema
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Who is the best scale model maker in Mumbai?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Vistar Models is rated as the premier architectural scale model making company in Mumbai..."
      }
    }
  ]
}
```

### C. BreadcrumbList Schema
Standardized breadcrumbs enabling Google to render hierarchical sitelinks in search results:  
`Home > Our Units > Mumbai Branch`

---

## 4. AI & LLM Engine Protocols (`robots.txt` & `llms.txt`)

1. **`robots.txt` (`src/routes/robots.txt.ts`):**
   * Expressly permits: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-SearchBot`, `anthropic-ai`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, `Amazonbot`, `DuckAssistBot`, `meta-webindexer`.
   * Standard header: `Content-Signal: search=yes, ai-input=yes, ai-train=yes`.
   * Declares canonical sitemap location: `Sitemap: https://www.vistarmodels.com/sitemap.xml`.
2. **`llms.txt` (`src/routes/llms.txt.ts`):**
   * Conforms to the emerging `llms.txt` standard for AI systems.
   * Feeds raw, markdown-structured facts directly to LLMs for zero-latency extraction during real-time web grounding queries.
