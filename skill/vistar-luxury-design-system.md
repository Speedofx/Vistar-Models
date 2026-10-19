---
name: vistar-luxury-design-system
description: The absolute, non-negotiable gold standard protocol and master design system for Vistar Models. Governs architectural dark museum aesthetics, multi-variant 3D/2D scroll-driven motion graphics (strict anti-static-PDF law), fail-safe image loading, real physical scale model photography standards, zero-collision mobile responsive headers, brand logo placement rules, and monochrome luxury typography inspired by California Model & Design (CMD).
---

# 🏛️ VISTAR LUXURY & CINEMATIC MOTION DESIGN SYSTEM

> **THE PERMANENT GOLD-STANDARD CONSTITUTION:**  
> This document captures every iterative refinement, user directive, and architectural principle established for **Vistar Models**.  
> **Rule 0:** Under NO circumstances should any future page, component, or revision resemble a flat, dead, static "PDF brochure". Every interaction must feel like a living, tactile, ultra-luxury digital gallery at the pinnacle of architectural excellence (inspired by California Model & Design — `cmdmodels.com`).

---

## 💎 1. THE ANTI-STATIC "PDF WEBSITE" LAW

A website is NOT a printed catalog or PDF export. Static layouts with zero animation or identical repetitive fades make high-end projects feel cheap.

### Mandatory Kinetic Experience:
1. **Multi-Variant 3D & 2D Motion Graphics Engine:**
   - **Never repeat the same animation everywhere.** Each section must express its mechanical and spatial purpose:
     - **Architectural Showcase (Zig-Zag):** `shutter-reveal` — 3D scale elevation combined with an optical architectural light-flare sweep (`.luxury-media-frame::after`).
     - **Fabrication Capabilities Lab:** `laser-scan` — A precision holographic blueprint laser scanner beam (`.lux-cap-scanner-beam`) sweeping horizontally across the active tooling display.
     - **5-Stage Process & Workflow:** `circuit-pulse` & `domino-flip` — An electrified kinetic energy timeline track with sequential 3D domino step cards.
     - **Industry Sectors & Partners:** `domino-flip` 3D masonry tilt — Heavy titanium-finished cards rotating gracefully into view on scroll.
     - **Category Matrix Cards:** `tilt-in` with live 3D mouse gyro tilt (`use3DTilt`) responding to cursor coordinates.
     - **Global Viewport:** Minimalist top 2px luxury scroll depth indicator (`.lux-scroll-progress`) tracking 0% to 100% page traversal.

2. **Fail-Safe Viewport Detection Protocol (`useScrollReveal`):**
   - **Immediate Mount Check:** Always check `getBoundingClientRect()` on mount. If an element is already in or near the viewport (`rect.top <= window.innerHeight + 150`), reveal it immediately so the user never sees a blank space.
   - **Pre-emptive Triggering:** Set `rootMargin: '120px 0px 120px 0px'` and `threshold: 0.02` so animations start *before* the element enters view.
   - **Safety Timer:** Include an automatic 1.5s fallback reveal timer in JavaScript to prevent any element from ever staying invisible.
   - **Zero Degenerate Clip-Paths:** Never use `clip-path: polygon(0 0, 0 0, 0 100%, 0 100%)` as an initial state because it collapses elements to 0-width in Chromium and breaks lazy loading.

---

## 📸 2. PHOTOGRAPHY & ASSET OPTIMIZATION STANDARDS

1. **Anti-Toy AI Render Law (Strictly Enforced):**
   - **FORBIDDEN:** Cartoonish 3D clay renders, toy-like miniature plastic buildings, and generic AI fantasy cities.
   - **MANDATORY:** Real, physical studio photography showing authentic craftsmanship:
     - Hand-finished solid teak, brass, and titanium plinths.
     - Laser-etched clear acrylic facades and sub-millimeter mullions.
     - Architectural warm interior micro-LED illumination (2700K–3500K).
     - Clean museum vitrines with zero distortion.

2. **Performance Asset Pipeline:**
   - All scale-model imagery must be stored in high-efficiency **WebP** format (target: 80KB–180KB with 88% quality).
   - Never serve uncompressed 1.5MB+ PNGs in primary showcase carousels or scroll sections.
   - Set `decoding="async"` and explicit `width` and `height` attributes to eliminate layout shifts (CLS).

---

## 🏷️ 3. OFFICIAL BRAND LOGO ARCHITECTURE

1. **Header Navigation Logo:**
   - **Asset:** Clean horizontal brand identity (`/header-logo.png` reconstructed in Full HD from `image copy.png`).
   - **Two-Tone White & Gold Contrast Rule:** To ensure 100% visibility against dark onyx/glass headers, the emblem and typography must NEVER contain pitch-black elements:
     - *Left Wing of V:* Crisp architectural pure white & titanium silver (`#ffffff` / `#dbe2ec`) with 3D metallic highlights.
     - *Right Wings of V:* Authentic rich metallic gold (`#c58821` to `#f5b93c`).
     - *Vertical Divider:* Clean architectural gold hairline rule (`#e8b44b`).
     - *"VISTAR" Wordmark:* Razor-sharp brilliant white (`#ffffff`).
     - *"MODELS" Sub-mark:* Warm architectural gold (`#e8b44b`) with flanking rules.
   - **Dimensions:** Height `46px` (desktop), `38px` (mobile), max-width `230px`.
   - **Interaction:** On hover, elevates with a dual luminescent halo: `filter: drop-shadow(0 0 16px rgba(255, 255, 255, 0.35)) drop-shadow(0 0 8px rgba(212, 160, 23, 0.4))`.

2. **Footer Brand Mark:**
   - **Asset:** High-resolution transparent white inverted brand mark (`/image.png`).
   - **Dimensions (2X Rule):** Enlarged to **2X scale** (`height: 84px; max-width: 320px;`) with `opacity: 0.95`.
   - **Interaction:** On hover, shines with a soft white architectural luminescent glow (`drop-shadow(0 0 18px rgba(255, 255, 255, 0.5))`).

---

## 📱 4. MOBILE RESPONSIVENESS & ZERO-COLLISION HEADER LAW

1. **Header Element Grouping:**
   - All interactive controls on the right side of the navbar MUST be wrapped inside `.site-header-actions` (`display: flex; align-items: center; gap: 12px; margin-left: auto;`).
   - Never allow loose, unwrapped CTA buttons to float freely next to `.menu-button`.

2. **Adaptive CTA Labeling:**
   - **Desktop (> 900px):** Display full text: `Discuss Your Requirement ↗`.
   - **Mobile / Tablet (≤ 900px):** Display compact luxury pill: `Discuss ↗` (`.header-cta-text-mobile`).
   - **Small Mobile (≤ 480px):** Sized to `padding: 7px 11px; font-size: 10px;`.
   - **Zero Overlap:** Guaranteed `8px–12px` clearance between the CTA pill and the hamburger icon.

3. **Mobile Drawer CTA:**
   - When the user opens the mobile navigation drawer (`#mobile-nav`), a full-width luxury pill button (`.mobile-drawer-cta`) must be present at the top/bottom: `Discuss Your Requirement ↗`.

---

## 🎨 5. MONOCHROME ARCHITECTURAL LUXURY (ANTI-GAUDY PROTOCOL)

1. **Color Palette:**
   - **Canvas:** Deep Onyx (`#09090b`) & Midnight Charcoal (`#121214`).
   - **Primary Accents:** Crisp Pure White (`#ffffff`), Titanium Silver (`#e4e4e7`), Muted Graphite (`#a1a1aa`).
   - **Strict Rule on Gold/Yellow:** Never splash heavy solid yellow blocks across buttons, badges, or headlines. Restrict gold strictly to micro-dots, subtle progress bars, or active state accents.

2. **Button Standards (`.cmd-btn`):**
   - **Primary Action:** Transparent glass background with a razor-sharp white hairline border:
     `border: 1.5px solid rgba(255, 255, 255, 0.85); background: rgba(0, 0, 0, 0.25); color: #ffffff;`
   - **Hover State:** Smooth inverted contrast: `background: #ffffff; color: #000000; border-color: #ffffff; box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);`.

3. **Glassmorphism Spec Cards:**
   - `background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px;`.

---

## 📐 6. THE 7 CORE SECTIONS ARCHITECTURE

1. **Section 1: The Consultancy Philosophy & Interactive Paradigm:**
   - Asymmetric 2-column split with 3D slide reveals.
   - Left: Core value proposition and philosophical statement.
   - Right: 4 glass metric cards (`09 Cities`, `0.1mm Laser Precision`, `1:50–1:1000 Scale`, `100% Verified Track Record`).

2. **Section 2: Signature Alternating Showcase (Zig-Zag Rhythm):**
   - Alternating rows: Even rows (Left Text / Right Photo) | Odd rows (Left Photo / Right Text).
   - Optical shutter light-flare reveal on media frames.
   - Detailed specification cards (Scale, Mediums, Illumination) + tag pills + outline CTA.

3. **Section 3: Model Category Matrix (3x2):**
   - 6 high-priority categories with `tilt-in` staggered 3D entries.
   - Floating index pills (`CAT · 01`) and interactive hover zoom.

4. **Section 4: Fabrication Capabilities Lab (Studio Showcase):**
   - Interactive tabbed architecture (`CNC Milling`, `SLA/SLS Printing`, `DMX Illumination`, `Joinery & Plinth`).
   - Real-time spec updates and dynamic blueprint laser scan beam effect.

5. **Section 5: The 5-Stage Orchestration Timeline:**
   - Kinetic circuit line with glowing pulse.
   - Staggered domino 3D step cards.

6. **Section 6: Industry Sectors & Proven Track Record:**
   - 8 architectural sector cards with 3D tilt.
   - Direct Maker Network onboarding portal dock.

7. **Section 7: Executive Briefing Suite & Midnight FAQ:**
   - Dark glass accordion FAQ cards preserving JSON-LD schema.
   - Midnight Onyx & Liquid Gold Perimeter CTA with dual action triggers (Submit Brief + WhatsApp Direct Desk).

---

## ✅ 7. PRE-FLIGHT VERIFICATION CHECKLIST FOR ANY FUTURE EDIT

Before concluding any development task or presenting work to the user:
- [ ] **No Static PDF Feel:** Does the section load with dynamic 3D/2D motion graphics?
- [ ] **Varied Animation:** Is the animation distinct from neighboring sections (shutter reveal, laser scan, circuit pulse, domino flip)?
- [ ] **Zero Blank Photos:** Are all images WebP, eagerly or asynchronously loaded, with safe viewport fallbacks?
- [ ] **Mobile Header Check:** Do the logo, compact CTA pill, and hamburger menu have comfortable spacing without ANY overlap?
- [ ] **Logo Integrity:** Is the header logo using `/header-logo.png` and the footer logo using the 2X enlarged `/image.png`?
- [ ] **Monochrome Luxury:** Are all primary buttons using the CMD white hairline outline standard (no cheap flat yellow blocks)?
- [ ] **TypeScript Clean:** Does `npm run typecheck` complete with 0 errors?
