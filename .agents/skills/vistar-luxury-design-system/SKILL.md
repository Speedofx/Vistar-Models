---
name: vistar-luxury-design-system
description: The absolute, non-negotiable gold standard protocol and master design system for Vistar Models. Governs architectural dark museum aesthetics, multi-variant 3D/2D scroll-driven motion graphics (strict anti-static-PDF law), fail-safe image loading, real physical scale model photography standards, zero-collision mobile responsive headers, brand logo placement rules, and monochrome luxury typography inspired by California Model & Design (CMD).
---

# 🏛️ VISTAR LUXURY & CINEMATIC MOTION DESIGN SYSTEM

> **THE PERMANENT GOLD-STANDARD CONSTITUTION:**  
> This document captures every iterative refinement, user directive, and architectural principle established for **Vistar Models**.  
> **Rule 0:** Under NO circumstances should any future page, component, or revision resemble a flat, dead, static "PDF brochure". Every interaction must feel like a living, tactile, ultra-luxury digital gallery at the pinnacle of architectural excellence (inspired by California Model & Design — `cmdmodels.com`).

---

## 💎 1. THE ANTI-STATIC "PDF WEBSITE" LAW & SCROLL MOTION ARCHITECTURE

> **THE GOLDEN CONSTITUTIONAL LAW:**  
> A website is NOT a printed brochure, a catalog, or a flat PDF export.  
> If a visitor scrolls and sections simply appear statically without living, dynamic, 3D motion, the platform has **FAILED**.  
> Every scroll movement must feel kinetic, alive, tactile, and cinematic — mirroring the spatial reality of physical architectural scale models.

---

### 🔬 Technical Anatomy of the Scroll Motion Engine

The entire kinetic scroll experience is powered by a triad of high-performance primitives:
1. **The Observer Hook:** [`src/hooks/use-scroll-reveal.ts`](file:///c:/Users/RD%20MODELS/Desktop/RD%20PRO%20PROJECTS/vistar-models/src/hooks/use-scroll-reveal.ts)
2. **The React Component Wrapper:** [`src/components/ui/scroll-reveal.tsx`](file:///c:/Users/RD%20MODELS/Desktop/RD%20PRO%20PROJECTS/vistar-models/src/components/ui/scroll-reveal.tsx)
3. **The GPU-Accelerated 3D Engine:** [`src/index.css`](file:///c:/Users/RD%20MODELS/Desktop/RD%20PRO%20PROJECTS/vistar-models/src/index.css) (lines 850–960)

---

### ⚠️ The "Static PDF Bug" Root Cause & Permanent Outlaw

* **What Caused the Bug:** In previous iterations, an unconditional `setTimeout(() => setIsRevealed(true), 1500)` was placed inside `useScrollReveal`. If a visitor spent 2 seconds reading the Hero section, this timer fired for every element down to the footer. When the user finally scrolled, every card was already revealed and stationary (`transform: translateY(0)`), creating the exact feeling of scrolling a flat, dead PDF!
* **THE PERMANENT BAN:**
  - ❌ **FORBIDDEN:** Never use unconditional `setTimeout` timers on component mount to force-reveal below-the-fold content.
  - ❌ **FORBIDDEN:** Never use `clip-path: polygon(0 0, 0 0, 0 100%, 0 100%)` as initial state (causes 0-width collapse in Chromium).
  - ❌ **FORBIDDEN:** Never set `rootMargin` with positive top values like `120px` that trigger animations before elements are even visible.

---

### ⚙️ The Exact Protocol for `useScrollReveal`

```ts
export function useScrollReveal(threshold = 0.06) {
	const ref = useRef<HTMLDivElement>(null);
	const [isRevealed, setIsRevealed] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		// 1. Initial viewport check: ONLY reveal elements that are ALREADY in the active viewport on load
		if (typeof window !== 'undefined') {
			const rect = node.getBoundingClientRect();
			if (rect.top < window.innerHeight - 20 && rect.bottom > 0) {
				setIsRevealed(true);
				return;
			}
		}

		// 2. IntersectionObserver: fires dynamically 40px inside the viewport as user scrolls
		if (typeof IntersectionObserver !== 'undefined') {
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						setIsRevealed(true);
						observer.unobserve(entry.target); // Unobserve to save CPU cycles
					}
				},
				{ threshold, rootMargin: '0px 0px -40px 0px' }
			);

			observer.observe(node);

			// 3. Dynamic passive scroll backup: ensures fast fling scrolls reveal cleanly
			const handleScroll = () => {
				if (!node) return;
				const r = node.getBoundingClientRect();
				if (r.top <= window.innerHeight - 20) {
					setIsRevealed(true);
					window.removeEventListener('scroll', handleScroll);
				}
			};
			window.addEventListener('scroll', handleScroll, { passive: true });

			return () => {
				observer.disconnect();
				window.removeEventListener('scroll', handleScroll);
			};
		} else {
			setIsRevealed(true);
		}
	}, [threshold]);

	return { ref, isRevealed };
}
```

---

### 🎨 The 9 Distinct Kinetic Animation Variants

Never repeat the same animation across adjacent sections. Use the right kinetic metaphor for each component:

| Animation Variant | Visual Behavior & Metaphor | Ideal Application |
|---|---|---|
| `fade-up-3d` | 45px vertical glide with 4° 3D X-axis elevation (`rotateX(4deg)`). | Section headers, badges, editorial subtexts, FAQs. |
| `tilt-in` | 3D perspective scale up from 0.96 with 6° tilt. | Feature grid cards, specification tables, persona tabs. |
| `slide-left-3d` | Sweeps in from left with 45px translation + 4° Y-axis rotation. | Left-hand editorial text in alternating zig-zag rows. |
| `slide-right-3d` | Sweeps in from right with 45px translation - 4° Y-axis rotation. | Right-hand editorial text in reversed zig-zag rows. |
| `zoom-in-3d` | Scales gracefully from 0.92 to 1.0 with 30px vertical rise. | Centerpiece masterplan vitrines, high-impact hero displays. |
| `shutter-reveal` | Physical elevation + an optical light-flare beam sweeping across the frame (`.luxury-media-frame::after` transforms from `-120%` to `+120%`). | Real scale model photos, showcase galleries. |
| `laser-scan` | Real-time holographic blueprint laser beam (`@keyframes laserSweep`) sweeping horizontally over the tooling container. | Fabrication capabilities lab, CNC & 3D print specs. |
| `circuit-pulse` | High-energy glowing pulse along a connecting timeline rail. | 5-Stage production workflow, delivery timelines. |
| `domino-flip` | 3D rotation along the horizontal axis with staggered delays. | Process cards, city branches, partner credentials. |

---

### 📐 CSS Hardware-Acceleration Standard

All reveal boxes must declare:
```css
.scroll-reveal-box {
	opacity: 0;
	will-change: transform, opacity;
	transition-property: transform, opacity;
	transition-duration: 0.85s;
	transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1); /* Luxury deceleration curve */
}
```

### 📋 Mandatory Developer Rules for Every New Page:
1. **Always wrap interactive sections:** Every row, card group, or media vitrine MUST be wrapped in `<ScrollReveal animation="...">`.
2. **Stagger children:** In grids or lists, apply progressive delays: `delay={idx * 60}` ms so cards cascade into view like dominoes rather than popping up all at once.
3. **Mount the Scroll Progress Bar:** Include `<useScrollProgress />` and `.lux-scroll-progress` at the top of every new page to give the visitor tactile feedback on their journey.

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

## 🎨 5. THE 75% MUSEUM WHITE / 25% ONYX CONTRAST RHYTHM PROTOCOL

> **THE ARCHITECTURAL RATIO LAW:**  
> A 100% black website causes cognitive fatigue, suffocates long-form reading, and suppresses the natural warm wood and crisp acrylic textures of physical scale models.  
> Conversely, a 100% white website loses cinematic exclusivity and dramatic scale lighting.  
> **The Supreme Formula:** Maintain a **75% Museum White / 25% Onyx Black** editorial monograph rhythm.

### 📊 Master Color Palette & Design Tokens

| Token Purpose | Hex / Value | Usage & Application |
|---|---|---|
| **Dark Canvas (Hero & Lab)** | `#09090b` / `#0c0c0e` | Hero background, Precision Tooling Lab, Executive CTA vitrine, Footer. |
| **Light Canvas (75% Body)** | `#ffffff` / `#fbfbfa` | Showcase, Solutions, Perspectives, Matrix, Process, Founder, FAQ. |
| **Light Stone Surfaces** | `#f8f8f9` / `#f4f4f5` | Spec cards, accordion closed state, tag chips, secondary badges. |
| **Dark Obsidian Text** | `#09090b` / `#18181b` | All primary headings, section titles, card names, active tabs. |
| **Muted Slate Body Text** | `#52525b` / `#71717a` | Descriptions, technical specifications, subtitles, disclaimer text. |
| **Architectural Gold Accent**| `#b8860b` / `#d4a017` | Hover button morphs, micro-dot indicators, metric units, active badges. |
| **Porcelain Card Elevation** | `0 16px 48px rgba(0,0,0,0.06)`| Floating stage cards, category cards, showcase photo vitrines. |
| **Hairline Dividers** | `rgba(0, 0, 0, 0.08)` | Borders on light cards, horizontal dividing rules, table borders. |

---

### 🌉 The Smooth Gradient Bridge (Hero ➔ White Transition)

Never abruptly cut from the dark Hero section to a white section. Always deploy the **Vertical Dark-to-Light Ramp** at the top of the first section below the Hero:

```css
/* Smooth Dark-to-White Bridge on First Section Below Hero */
.lux-solutions-section {
	background: linear-gradient(180deg, 
		#09090b 0%, 
		#1c1c1f 80px, 
		#fbfbfa 220px, 
		#fbfbfa 100%
	);
	color: #09090b;
	padding: 130px 6.5% 120px;
	position: relative;
	border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
```

---

### 🌫️ Zero Dark Smoke on Photos Law (Strictly Enforced)

1. **Why Dark Smoke Fails on White:**
   - On pitch-black websites, dark vignette gradients hide image borders.
   - On **Museum White backgrounds**, a dark gradient (`linear-gradient(rgba(0,0,0,0.55))`) makes photos look dusty, dirty, and smudged ("dhuha jaisa").
2. **The Clean Architectural Vitrine Standard:**
   - **MANDATORY:** Set all photo overlays in light sections to `display: none;` or `background: transparent;`.
   - Wrap scale model photos in crisp, elevated porcelain frames with clean borders:

```css
/* Clean Museum Photo Vitrine — Zero Smoke */
.luxury-media-frame {
	position: relative;
	border-radius: 12px;
	overflow: hidden;
	aspect-ratio: 16 / 10;
	border: 1px solid rgba(0, 0, 0, 0.08);
	background: #ffffff;
	box-shadow: 0 16px 40px rgba(0, 0, 0, 0.06);
	transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease, border-color 0.4s ease;
}
.luxury-media-frame:hover {
	transform: translateY(-6px) scale(1.01);
	box-shadow: 0 24px 50px rgba(0, 0, 0, 0.12);
	border-color: rgba(0, 0, 0, 0.22);
}
.luxury-media-overlay {
	display: none; /* Zero dark smoke or vignette */
}
.luxury-media-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
	transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.luxury-media-frame:hover .luxury-media-img {
	transform: scale(1.045);
}
```

---

### 🔲 High-Contrast Button & Interactive Link Standards

To ensure zero "disappearing buttons" or white-on-white invisibility on mouse hover:

```css
/* Primary Action Button in Light Sections */
.luxury-showcase .cmd-btn,
.lux-solution-actions .cmd-btn,
.luxury-action-btn {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	padding: 13px 26px;
	background: #09090b;
	color: #ffffff;
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 0.04em;
	border-radius: 4px;
	border: 1px solid #09090b;
	text-decoration: none;
	transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
	box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
}

/* Hover: Morphs into Rich Metallic Gold with Glow (NEVER White-on-White) */
.luxury-showcase .cmd-btn:hover,
.lux-solution-actions .cmd-btn:hover,
.luxury-action-btn:hover {
	background: #b8860b;
	color: #ffffff;
	border-color: #b8860b;
	box-shadow: 0 6px 22px rgba(184, 134, 11, 0.35);
	transform: translateY(-2px);
}

/* Inline Glass Links in Light Sections */
.lux-glass-link,
.luxury-action-link {
	font-size: 12px;
	font-weight: 700;
	color: #09090b;
	text-decoration: none;
	border-bottom: 1.5px solid rgba(0, 0, 0, 0.25);
	padding-bottom: 2px;
	transition: all 0.2s ease;
}
.lux-glass-link:hover,
.luxury-action-link:hover {
	color: #b8860b;
	border-bottom-color: #b8860b;
}
```

---

## 📐 6. THE 12-SECTION CHOREOGRAPHY ON HOMEPAGE

Every page must respect this alternating visual rhythm:

1. **Hero Section (`.cmd-hero`):** ⬛ **Dark Onyx (`#09090b`)** — Cinematic scale models, floating glass header, 2-line title flow.
2. **Client Solutions (`.lux-solutions-section`):** ⬛ ➔ ⬜ **Smooth Gradient Ramp** — 4 interactive persona tabs, porcelain stage.
3. **Curated Showcase (`.luxury-showcase`):** ⬜ **Museum White (`#ffffff`)** — Alternating zig-zag rows, 3-spec pills, zero smoke.
4. **Perspective & Metrics (`.lux-perspective`):** ⬜ **Museum Light Stone (`#fbfbfa`)** — 4 metric cards (`09 Cities`, `0.1mm Tolerance`, etc.).
5. **Scale Category Matrix (`.lux-category-matrix`):** ⬜ **Museum White (`#ffffff`)** — 3x2 grid of scale categories.
6. **Precision Tooling Lab (`.lux-capability`):** ⬛ **Deep Onyx Tech Lab (~10% Mid Accent)** — Single black accent where laser scan beam sweeps over 5-axis CNC & SLA 3D print capabilities.
7. **Process Timeline (`.lux-process`):** ⬜ **Museum White (`#ffffff`)** — 5-stage kinetic workflow with fine gold line.
8. **Founder Heritage (`.lux-founder`):** ⬜ **Porcelain White (`#fbfbfa`)** — Quote vitrine with 24k gold accent, MSME certification tokens.
9. **Industry Sectors (`.lux-industries`):** ⬜ **Museum White (`#ffffff`)** — Real Estate, Aviation, Rail, Industrial cards + Maker Dock.
10. **The Vistar Journal (`.lux-journal`):** ⬜ **Museum White (`#fbfbfa`)** — Editorial insights cards with hover link animation.
11. **Bespoke FAQs (`.lux-faq`):** ⬜ **Museum White (`#ffffff`)** — Clean accordion rows with gold index numbers.
12. **Executive Consultation & Footer (`.lux-cta`):** ⬛ **Midnight Onyx (`#09090b` / `#000000`)** — Liquid 24k gold vitrine + 2X brand footer mark.

---

## 🚀 7. COMPLETE AI BOILERPLATE TEMPLATE FOR NEW PAGES

When creating a new route or page in this repository (e.g. `/services`, `/portfolio`, `/about`, `/city-landing`), copy and adapt this exact architectural blueprint:

```tsx
import { Link } from 'react-router';
import { ShieldCheck, ArrowUpRight, Compass, Zap } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useScrollProgress } from '@/hooks/use-scroll-reveal';

export default function SamplePage() {
	const progress = useScrollProgress();

	return (
		<main>
			{/* 1. Hardware-Accelerated Scroll Progress Bar */}
			<div
				className="lux-scroll-progress"
				style={{ width: `${progress}%` }}
				role="progressbar"
				aria-valuenow={progress}
				aria-label="Scroll Progress"
			/>

			{/* 2. Hero Section: Dark Onyx (10%) */}
			<section className="cmd-hero" style={{ minHeight: '65vh' }}>
				<div className="cmd-hero-content">
					<ScrollReveal animation="fade-up-3d">
						<div className="cmd-hero-tag">
							<span className="cmd-persona-dot" />
							<span>PRECISION SCALE CONSULTANCY</span>
						</div>
						<h1 className="cmd-hero-title">
							Architectural & Industrial<br />Scale Models.
						</h1>
						<p className="cmd-hero-sub">
							Authentic physical scale models engineered to 0.1mm tolerance for India's leading studios.
						</p>
					</ScrollReveal>
				</div>
			</section>

			{/* 3. Section 1 with Smooth Dark-to-Light Ramp Bridge */}
			<section className="lux-solutions-section">
				<div className="lux-solutions-container">
					<ScrollReveal animation="fade-up-3d">
						<div className="lux-solutions-header">
							<div className="lux-section-badge">
								<ShieldCheck size={13} className="lux-badge-icon" />
								<span>ENGINEERED DELIVERABLES</span>
							</div>
							<h2 className="lux-solutions-title">Architectural Precision at Any Scale</h2>
							<p className="lux-solutions-subtitle">
								Zero text bloat. Direct physical solutions matching the exact demands of your brief.
							</p>
						</div>
					</ScrollReveal>

					{/* Clean White Porcelain Stage Card */}
					<ScrollReveal animation="shutter-reveal" delay={80}>
						<div className="lux-solution-stage">
							<div className="lux-solution-content">
								<h3 className="lux-solution-headline">Masterplan & Tower Physical Twins</h3>
								<p className="lux-solution-desc">
									Laser-cut acrylic facades, hand-finished teak plinths, and multi-zone DMX lighting.
								</p>
								<div className="lux-solution-actions">
									<Link to="/find-a-model-maker" className="cmd-btn">
										<span>Submit Brief</span>
										<ArrowUpRight size={14} style={{ marginLeft: 6 }} />
									</Link>
									<a href="https://wa.me/918302806913" className="lux-glass-link">
										Instant Technical Review &rarr;
									</a>
								</div>
							</div>

							{/* Zero-Smoke Media Vitrine */}
							<div className="lux-solution-visual">
								<div className="luxury-media-frame">
									<img
										src="/images/cmd_hero_1.jpg"
										alt="Architectural Scale Model"
										className="luxury-media-img"
										loading="lazy"
										width={600}
										height={400}
									/>
									{/* NOTE: Zero dark overlay. Image remains bright and natural. */}
								</div>
							</div>
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* 4. Deep Onyx Tech Lab Section (10% Mid Accent) */}
			<section className="lux-capability">
				{/* High-tech blueprint scanning animations on dark slate */}
			</section>

			{/* 5. Executive Midnight Consultation & Footer (15% Bottom Anchor) */}
			<section className="lux-cta">
				{/* 24k liquid gold card vitrine */}
			</section>
		</main>
	);
}
```

---

## 🚫 8. THE ZERO-EMOJI LUXURY LAW & MOBILE CONTRAST RULES

1. **The Zero-Emoji Architectural Law:**
   - Emojis (📐, 🏢, 🏛️, 🏭, 🚀, ✨, etc.) make a luxury platform look cheap, informal, and amateur.
   - High-tier architectural brands (CMD Models, Foster + Partners, BIG) NEVER use consumer emojis.
   - Use only:
     - 5px glowing gold micro-dots (`.cmd-persona-dot`)
     - Clean SVG vector line icons (`lucide-react`)
     - Pure architectural typography in `Manrope` and monospace.

2. **Desktop 2-Line Headline Flow:**
   - Long hero titles such as *"Architectural & Industrial Scale Models."* must break cleanly on desktop:
     - Line 1: *"Architectural & Industrial"*
     - Line 2: *"Scale Models."*
   - Font size: `clamp(38px, 4.3vw, 68px)` with `white-space: nowrap` on Line 1 for desktop screens `> 900px`.
   - Never break this rule on desktop, while leaving mobile flex wrapping natural.

3. **Logo Integrity Standards:**
   - **Header:** Always use `/header-logo.png` (crisp white emblem + metallic gold wings, height `46px`).
   - **Footer:** Always use `/image.png` enlarged to **2X scale** (`height: 84px; max-width: 320px;`) with luminescent white hover glow.

---

## ✅ 9. DEVELOPER PRE-FLIGHT VERIFICATION CHECKLIST

Before concluding ANY code changes or generating a new page:
- [ ] **Contrast Ratio:** Is the page ~75% Museum White with Hero, 1 Mid Accent Lab, and Footer Dark?
- [ ] **Gradient Bridge:** Does the first section below the Hero have the vertical dark-to-white gradient ramp?
- [ ] **Zero Photo Smoke:** Are all image frames in white sections free of dark smoke gradients and heavy 90% black shadows?
- [ ] **Button Visibility:** Do all buttons in white sections have dark obsidian defaults (`#09090b`) and transition into rich metallic gold (`#b8860b`) on hover?
- [ ] **Zero Consumer Emojis:** Are badges, tags, buttons, and titles 100% free of emojis?
- [ ] **No Static PDF:** Is every element animated on scroll via `<ScrollReveal>` without premature `setTimeout`?
- [ ] **CSS Syntax Integrity:** Are all braces matching with zero rogue properties (run `npm run typecheck` and verify HTTP 200)?


