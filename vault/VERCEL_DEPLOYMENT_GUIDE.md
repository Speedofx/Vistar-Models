# 🛠️ Vercel Deployment & GitHub Sync Troubleshooting Runbook
**Vistar Models (`vistarmodels.com`) — Senior Developer Operational Guide**

> **समस्या का सारांश (Summary of Issue):**  
> स्थानीय सिस्टम (Local VS Code/Antigravity) से `git push origin main` सफलतापूर्वक हो जाता है, और कोड GitHub पर पहुँच जाता है, लेकिन Vercel Dashboard पर नया Deployment Trigger नहीं होता या Vercel 1 घंटा पुराना Build दिखाता रहता है, जिससे लाइव वेबसाइट पर नए पेजों पर **404 Page Not Found** दिखता है।

---

## 🧭 त्वरित समाधान (Quick 1-Minute Fixes)

अगर कोड पुश करने के 2-3 मिनट बाद भी Vercel पर नया डिप्लॉयमेंट शुरू न हो, तो नीचे दिए गए 4 तरीकों में से कोई एक तरीका अपनाएँ:

### तरीका 1: Vercel Dashboard से डायरेक्ट "Redeploy" (सबसे आसान - 10 सेकंड)
1. अपने ब्राउज़र में [Vercel Deployments Dashboard](https://vercel.com/rd-saas-setups/vistar-models/deployments) खोलें।
2. जो डिप्लॉयमेंट सबसे ऊपर दिख रहा है, उसके दाएँ (right) कोने में स्थित **तीन डॉट्स (`...`)** पर क्लिक करें।
3. **"Redeploy"** विकल्प चुनें।
4. पॉपअप में यदि **"Use existing build cache"** का चेकबॉक्स दिखे, तो उसे अनचेक (Uncheck) कर दें (ताकि Vercel एकदम नया कोड GitHub से खींचे)।
5. **Redeploy** बटन दबाएँ — 30 से 45 सेकंड के भीतर नया कोड लाइव हो जाएगा!

---

### तरीका 2: Git से खाली ट्रिगर कमिट भेजें (Force Webhook Trigger)
कभी-कभी GitHub का ऑटोमेटेड वेबहुक नेटवर्क टाइमआउट के कारण Vercel तक नहीं पहुँच पाता। टर्मिनल में यह दो कमांड चलाएँ:

```powershell
# 1. एक खाली ट्रिगर कमिट बनाएँ
git commit --allow-empty -m "chore: trigger vercel auto-deploy"

# 2. गिटहब पर पुश करें
git push origin main
```
*यह कमांड गिटहब को मजबूर करता है कि वह Vercel के API पर एक नया Webhook Event भेजे, जिससे Vercel तुरंत नया बिल्ड शुरू कर देता है।*

---

### तरीका 3: Vercel Dashboard के फ़िल्टर (Filters) साफ़ करें
अक्सर नया डिप्लॉयमेंट Vercel पर बन जाता है, लेकिन डैशबोर्ड पर दिख नहीं रहा होता क्योंकि ऊपर **Author Filter** या **Status Filter** लगा होता है:
1. `vercel.com/.../deployments` पेज पर ऊपर देखें।
2. यदि वहाँ **`Author: infogorillafacts-7097`** या **`Status: Error`** जैसा कोई फ़िल्टर लगा है, तो उसके **`✕` (Cross)** बटन पर क्लिक करके फ़िल्टर हटाएँ।
3. पेज को Refresh करें — आपको ताज़ा डिप्लॉयमेंट दिख जाएगा।

---

### तरीका 4: GitHub Webhook की जाँच और "Redeliver" करें
1. अपने GitHub Repository खोलें: `https://github.com/Speedofx/Vistar-Models`
2. **Settings** टैब पर क्लिक करें (ऊपर दाईं ओर)।
3. बाएँ मेन्यू से **Webhooks** पर क्लिक करें।
4. वहाँ `https://api.vercel.com/v1/integrations/deploy/...` वाले वेबहुक पर क्लिक करें।
5. नीचे **"Recent Deliveries"** सेक्शन में जाएँ।
6. यदि कोई डिलीवरी लाल रंग (`✕` या 500/Timeout) में दिख रही है, तो उस पर क्लिक करें और **"Redeliver"** बटन दबाएँ।

---

### तरीका 5: Vercel CLI से सीधा इमरजेंसी डिप्लॉय (Bypass GitHub)
यदि GitHub का सर्वर पूरी तरह डाउन हो, तो आप अपने लोकल टर्मिनल से सीधा Vercel प्रोडक्शन पर डिप्लॉय कर सकते हैं:

```powershell
# Vercel पर डायरेक्ट प्रोडक्शन बिल्ड और डिप्लॉय करें
npx vercel --prod
```

---

## 🔍 मुख्य कारण (Root Causes: यह दिक्कत क्यों आती है?)

| # | कारण (Root Cause) | विवरण (Technical Details) | रोकथाम (Prevention) |
|---|-------------------|---------------------------|---------------------|
| 1 | **GitHub Webhook Drop** | Git push होने पर GitHub, Vercel API को HTTP POST भेजता है। नेटवर्क लैग या API लिमिट पर यह ड्रॉप हो जाता है। | खाली कमिट (`--allow-empty`) पुश करें या Vercel से Redeploy दबाएँ। |
| 2 | **Dashboard Filter Hidden** | Vercel UI में किसी खास Author या Environment का फ़िल्टर एक्टिव रहने से नए डिप्लॉय छिप जाते हैं। | Dashboard फ़िल्टर हमेशा Clear रखें। |
| 3 | **Hobby Plan Concurrency Limit** | Vercel Hobby प्लान पर एक समय में केवल 1 बिल्ड चलता है। पुराने बिल्ड कतार में अटके रहने पर नया बिल्ड "Blocked" हो जाता है। | Dashboard पर जाकर पुराने अटके बिल्ड्स को Cancel करें। |
| 4 | **Ignored Build Step Script** | अगर `vercel.json` या Project Settings में कोई स्क्रिप्ट गलती से `exit 0` दे दे, तो Vercel बिल्ड स्किप कर देता है। | Vercel Project Settings > Git > "Ignored Build Step" को खाली (Empty) रखें। |

---

## 📋 Vercel Project Settings Checklist (भविष्य के लिए सही सेटिंग्स)

भविष्य में काम करने वाले किसी भी डेवलपर को Vercel Project Settings में ये सेटिंग्स सुनिश्चित करनी चाहिए:

1. **Framework Preset**: `React Router` या `Vite` (Detect Automatically).
2. **Root Directory**: `./` (Default root).
3. **Build Command**: `react-router build` (या `npm run build`).
4. **Output Directory**: `build/client` (React Router SSR preset handles this automatically).
5. **Install Command**: `npm install` (साथ में `.npmrc` में `legacy-peer-deps=true` होना आवश्यक है).
6. **Node.js Version**: `20.x` or `22.x`.
7. **Production Branch**: `main`.

---

## 🚀 जब कोड लाइव हो जाए, तो कैसे Verify करें?

टर्मिनल में Node से लाइव URL का Status Code और Content चेक करें:

```powershell
# 1. जाँचें कि क्या शहर का पेज 200 OK दे रहा है:
node -e "fetch('https://vistarmodels.com/units/jaipur').then(r => console.log('Status:', r.status));"

# 2. जाँचें कि क्या Header में 'My Branches' आ गया है:
node -e "fetch('https://vistarmodels.com/').then(r => r.text()).then(t => console.log('My Branches present:', t.includes('My Branches')));"
```

*यदि दोनों कमांड्स में `Status: 200` और `My Branches present: true` आए, तो इसका अर्थ है कि नया कोड Vercel के CDN पर पूरी दुनिया में लाइव हो चुका है!*
