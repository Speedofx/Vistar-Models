# 04 — Dynamic URL Expansion & Future Developer Scaling SOP

> This guide documents how new URLs, branches, and articles are automatically registered across the site architecture, and provides clear instructions for any future developer to scale the site without breaking SEO or indexing.

---

## ⚙️ How the Automated Sync Engine Works

The codebase is engineered so that **no developer ever has to edit static XML files by hand**. Everything is dynamic and data-driven:

```
           +-----------------------------+
           | src/data/units.ts           |
           | src/data/blog-posts.ts      |
           | src/data/site.ts            |
           +--------------+--------------+
                          |
             +------------+------------+
             |                         |
             v                         v
+------------------------+  +------------------------+
| src/routes/            |  | src/routes/            |
| sitemap.xml.ts         |  | llms.txt.ts            |
| (Auto-generates XML    |  | (Auto-generates raw    |
| for Googlebot)         |  | facts for AI bots)     |
+------------------------+  +------------------------+
```

1. **Dynamic Sitemap (`src/routes/sitemap.xml.ts`):**
   * Imports `publicPaths` from `src/data/site.ts`.
   * Imports `blogPosts` from `src/data/blog-posts.ts` and maps `lastmod`.
   * When any new page or article is committed, the sitemap updates on the next request with zero manual intervention.
2. **AI & LLM Grounding Feed (`src/routes/llms.txt.ts`):**
   * Dynamically iterates over all units in `src/data/units.ts`.
   * Formats each unit's city, address, industrial zones, and contact coordinates in pure Markdown for Perplexity, ChatGPT, and Claude.

---

## 🚀 How to Add a New Branch / City Unit (Step-by-Step)

If Vistar Models opens a new branch (e.g., Kolkata, Chennai, Chandigarh):

### Step 1: Add Unit Data in `src/data/units.ts`
Add an entry to the `units` array:
```typescript
{
  slug: 'chennai',
  city: 'Chennai',
  state: 'Tamil Nadu',
  address: 'Guindy Industrial Estate, Chennai, Tamil Nadu 600032',
  phone: '+91 83028 06913',
  email: 'chennai@vistarmodels.com',
  rating: '5.0',
  reviewCount: 42,
  lat: 13.0067,
  lng: 80.2025,
  description: 'Precision architectural scale models and industrial master plan models in Chennai.',
  highlights: ['CMDA Master Plans', 'OMR IT Corridor Models', 'Ennore Port Working Scale Models'],
  mapQuery: 'Vistar Models Guindy Industrial Estate Chennai',
  faqs: getCityFaqs('chennai')
}
```

### Step 2: Add City-Specific FAQs in `src/data/units-city-faqs.ts`
Add the city's local authority names (e.g. CMDA, TIDCO) and localized questions to the dictionary.

### Step 3: Add Path to `src/data/site.ts`
In `publicPaths`, ensure `/units/chennai` is in the list.

### Step 4: Commit & Push to GitHub
```bash
git add .
git commit -m "feat: add chennai branch unit with 200 FAQs and schema"
git push origin main
```

### Step 5: Automatic Deployment & Verification
* Vercel will automatically build and deploy within 60 seconds.
* Visit `https://www.vistarmodels.com/sitemap.xml` to verify `/units/chennai` appears automatically.
* Visit `https://www.vistarmodels.com/llms.txt` to verify the AI prompt feed includes Chennai.
* Open Google Search Console -> URL Inspection -> Paste `https://www.vistarmodels.com/units/chennai` -> Click **Request Indexing**.

---

## 📝 How to Add a New Blog Post / Authority Article

1. Open `src/data/blog-posts.ts`.
2. Add the new article object with title, slug, excerpt, content, and `updatedAt` ISO date.
3. Commit and push.
4. The post is instantly available on `/blog/:slug`, injected into `sitemap.xml` with `<lastmod>`, and ready for Google indexing.
