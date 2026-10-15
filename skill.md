vistar-models/
├── .npmrc                   # Vercel पर बिना एरर install कराने के लिए (legacy-peer-deps=true)
├── .gitignore               # Git में फालतू node_modules/dist जाने से रोकता है
├── package.json             # प्रोजेक्ट की dependencies और scripts (dev, build, start)
├── vite.config.ts           # Vite Bundler और डेवलपमेंट सर्वर की सेटिंग
├── react-router.config.ts   # React Router v7/v8 और Vercel Serverless Preset सेटिंग
├── tailwind.config.js       # Tailwind CSS की स्टाइलिंग और कलर पैलेट
├── tsconfig.json            # TypeScript कंपाइलर कॉन्फ़िगरेशन
├── README.md                # प्रोजेक्ट ओवरव्यू और Vercel डिप्लॉय गाइड
│
├── public/                  # Static Files (Favicon, Logos आदि)
│   └── favicon.png
│
├── plugins/                 # Vite के इंटरनल प्लगइन्स (Horizons Runtime, Visual Editor)
│
├── src/                     # 👉 मुख्य वेबसाइट का असली कोड (Source Code)
│   ├── root.tsx             # पूरी वेबसाइट का Master Layout (HTML, Head, Fonts, Header, Footer)
│   ├── routes.ts            # वेबसाइट के सारे URLs/Paths की लिस्ट
│   ├── index.css            # ग्लोबल CSS, कस्टम डिज़ाइन सिस्टम और फॉन्ट वैरिएबल्स
│   │
│   ├── routes/              # सारे Pages के रूट कंपोनेंट्स
│   │   ├── home.tsx         # होमपेज (/)
│   │   ├── page.tsx         # सारे डायनामिक पेजेस (/about, /services, /contact, etc.)
│   │   ├── blog.tsx         # ब्लॉग लिस्टिंग पेज (/blog)
│   │   ├── blog.$slug.tsx   # सिंगल ब्लॉग आर्टिकल पेज (/blog/:slug)
│   │   ├── sitemap.xml.ts   # Google SEO Sitemap
│   │   ├── robots.txt.ts    # Search Engine Crawlers के लिए Robots फाइल
│   │   └── rss.xml.ts       # RSS Feed
│   │
│   ├── components/          # वेबसाइट के विज़ुअल सेक्शन्स (UI Blocks)
│   │   ├── site-header.tsx  # ऊपर का नेविगेशन बार (Logo, Links, CTA)
│   │   ├── site-footer.tsx  # नीचे का फ़ूटर (Links, Disclaimer, Copyright)
│   │   ├── enquiry-form.tsx # WhatsApp डायरेक्ट इंक्वायरी फॉर्म
│   │   ├── capability.tsx   # क्षमता/फीचर्स दिखाने वाला ब्लॉक
│   │   ├── process.tsx      # 5-Step Process सेक्शन
│   │   ├── founder.tsx      # फाउंडर/कंसल्टेंट सेक्शन
│   │   ├── home/            # होमपेज के सेक्शन्स (Hero, Perspective, Partners)
│   │   └── ui/              # Shadcn/Radix UI के 40+ री-यूज़ेबल कंपोनेंट्स (Dialog, Accordion, etc.)
│   │
│   ├── data/                # 👉 वेबसाइट का सारा डाटा (CMS की तरह काम करता है)
│   │   ├── site.ts          # सारे पेजेस, श्रेणियां (Categories), FAQs, सर्विसेज और WhatsApp नंबर
│   │   ├── blog-posts.ts    # सारे पब्लिश ब्लॉग आर्टिकल्स और उनका पूरा कंटेंट
│   │   └── business.ts      # बिज़नेस की लीगल और कंसल्टेंसी डिटेल्स
│   │
│   ├── lib/                 # SEO, JSON-LD स्कीमा, मेटा टैग्स और यूटिलिटी फंक्शन्स
│   └── hooks/               # React के कस्टम हुक्स (useHydrated, useMobile, useToast)
│
└── vault/                   # 🧠 👉 वो फ़ोल्डर जो AI को "Best Website" बनाने के लिए गाइड करता है!
