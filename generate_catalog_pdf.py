import sys
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#718096"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(40, 810, "Wispr Model Store / Vistar Models — UI/UX Master Pages & Sections Blueprint")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(40, 804, 555, 804)
        
        # Footer
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(555, 30, page_text)
        self.drawString(40, 30, "MSME UDYAM-RJ-17-0536099 | Confidential Architecture Document")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(40, 42, 555, 42)
        
        self.restoreState()

def create_catalog_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=50,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=10
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#475569"),
        spaceAfter=20
    )
    
    h1_style = ParagraphStyle(
        'ClassH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=12,
        spaceAfter=8,
        keepWithNext=True
    )
    
    page_header_style = ParagraphStyle(
        'PageHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#1E293B"),
        keepWithNext=True
    )
    
    url_style = ParagraphStyle(
        'UrlStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#2563EB")
    )
    
    section_style = ParagraphStyle(
        'SectionBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#334155")
    )
    
    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#1E293B")
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#FFFFFF")
    )

    elements = []

    # Title & Header
    elements.append(Paragraph("WISPR MODEL STORE // VISTAR MODELS", ParagraphStyle('Eyebrow', fontName='Helvetica-Bold', fontSize=10, textColor=colors.HexColor("#D97706"), spaceAfter=5)))
    elements.append(Paragraph("UI/UX Master Pages & Sections Architecture Catalog", title_style))
    elements.append(Paragraph("A comprehensive structural blueprint of all <b>39 Web Pages</b>, <b>200 UI Sections</b>, and <b>6 System Endpoints</b>. Organized into sequential design classes for phased UI/UX execution.", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#D97706"), spaceAfter=15))

    # Executive Summary Table
    summary_data = [
        [Paragraph("Class / Module", table_header_style), Paragraph("Category Name", table_header_style), Paragraph("Pages", table_header_style), Paragraph("Total Sections", table_header_style), Paragraph("Design Scope", table_header_style)],
        [Paragraph("<b>Class 1</b>", table_cell_style), Paragraph("Home Foundation & Master Hub", table_cell_style), Paragraph("1", table_cell_style), Paragraph("10", table_cell_style), Paragraph("Brand masthead, galleries, 5-step process, FAQ", table_cell_style)],
        [Paragraph("<b>Class 2</b>", table_cell_style), Paragraph("Core Institutional & Legal", table_cell_style), Paragraph("12", table_cell_style), Paragraph("38", table_cell_style), Paragraph("Services, About, Find Maker form, FAQs, Terms", table_cell_style)],
        [Paragraph("<b>Class 3</b>", table_cell_style), Paragraph("Specialized Category Showcases", table_cell_style), Paragraph("9", table_cell_style), Paragraph("27", table_cell_style), Paragraph("Architectural, Township, Industrial, 3D printing", table_cell_style)],
        [Paragraph("<b>Class 4</b>", table_cell_style), Paragraph("Regional Hubs & 200-FAQ Engine", table_cell_style), Paragraph("10", table_cell_style), Paragraph("86", table_cell_style), Paragraph("Branch terminal, Pricing table, 200 searchable FAQs", table_cell_style)],
        [Paragraph("<b>Class 5</b>", table_cell_style), Paragraph("The Vistar Journal / Articles", table_cell_style), Paragraph("7", table_cell_style), Paragraph("39", table_cell_style), Paragraph("Blog index + 6 articles with sticky TOC & TL;DR", table_cell_style)],
        [Paragraph("<b>Class 6</b>", table_cell_style), Paragraph("Discovery, AI & SEO Feeds", table_cell_style), Paragraph("6", table_cell_style), Paragraph("N/A", table_cell_style), Paragraph("Sitemap, robots.txt, llms.txt, RSS, API health", table_cell_style)],
        [Paragraph("<b>TOTALS</b>", table_header_style), Paragraph("<b>Entire Application Scope</b>", table_header_style), Paragraph("<b>39 Pages</b>", table_header_style), Paragraph("<b>200 Sections</b>", table_header_style), Paragraph("<b>Zero-Defect Full Stack</b>", table_header_style)]
    ]
    
    t_summary = Table(summary_data, colWidths=[65, 150, 45, 75, 180])
    t_summary.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('GRID', (0,0), (-1,-2), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-2), [colors.HexColor("#F8FAFC"), colors.HexColor("#FFFFFF")]),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor("#D97706")),
    ]))
    elements.append(t_summary)
    elements.append(Spacer(1, 15))

    # CLASSES DATA
    classes = [
        {
            "class_title": "CLASS 1: Home Foundation & Master Hub (1 Page · 10 Sections)",
            "pages": [
                {
                    "name": "1. Home Page (Master Gateway)",
                    "url": "https://www.vistarmodels.com/ (Route: /)",
                    "source": "src/routes/home.tsx",
                    "sec_count": "10 Sections",
                    "sections": [
                        "<b>1. Hero (<Hero />):</b> H1 brand label, high-impact tagline 'The Right Model. The Right Maker', dual CTAs, preloaded 960x548 WebP image, scroll marker.",
                        "<b>2. Perspective (<Perspective />):</b> Institutional mission statement, neutral sourcing philosophy ('Understand. Source. Connect.').",
                        "<b>3. Category Gallery (<CategoryGallery compact />):</b> 9-card responsive scale-model categories visual showcase with hover transitions.",
                        "<b>4. Capability Matching (<Capability />):</b> 8 capability verification dimensions (equipment, tolerances, finishes, capacity).",
                        "<b>5. 5-Step Process (<Process />):</b> Step 1 Share Requirement → Step 2 Clarify Scope → Step 3 Identify Makers → Step 4 Connect → Step 5 Execution.",
                        "<b>6. Founder Profile (<Founder />):</b> Yogendra Yogi credentialing, MSME UDYAM-RJ-17-0536099 certification, strict neutrality.",
                        "<b>7. Industry Partners (<IndustryPartners />):</b> 8 target industry badges (Architects, Developers, Infrastructure, Industrial Plants, etc.).",
                        "<b>8. Journal Teaser (<BlogTeaser />):</b> 3 latest high-impact sourcing guide cards with read times and direct links.",
                        "<b>9. Core FAQ Engine (<HomepageFaq />):</b> 10 native accessible FAQ accordions with embedded FAQPage schema.",
                        "<b>10. Direct Action CTA (<ContactCta />):</b> Instant WhatsApp launcher, 24/6 hotline call link (+91 83028 06913), requirement intake link."
                    ]
                }
            ]
        },
        {
            "class_title": "CLASS 2: Core Institutional & Informational Pages (12 Pages · 38 Sections)",
            "pages": [
                {
                    "name": "2. About Vistar Models",
                    "url": "/about",
                    "source": "src/routes/page.tsx + src/data/site.ts",
                    "sec_count": "4 Sections",
                    "sections": [
                        "<b>1. Masthead:</b> Title 'Better connections. More considered models.' with intro narrative.",
                        "<b>2. Founder Credibility:</b> Yogendra Yogi founder bio, UDYAM registration and governance doctrine.",
                        "<b>3. Editorial Reading Block:</b> 3 subsections (Consultancy not manufacturing, Our 4-pillar approach, Clear responsibilities).",
                        "<b>4. Bottom Action CTA:</b> Requirement discussion banner."
                    ]
                },
                {
                    "name": "3. Consultancy Services",
                    "url": "/services",
                    "source": "src/routes/page.tsx + src/components/page-content.tsx",
                    "sec_count": "3 Sections",
                    "sections": [
                        "<b>1. Masthead:</b> 'A clearer brief. A more relevant search.' with intro context.",
                        "<b>2. 8 Numbered Services Rail:</b> Editorial intro + 8 service rows (01 Requirement Consultation, 02 Maker ID, 03 Capability Matching, 04 Scope Clarification, 05 Quotation Coordination, 06 Specialised Sourcing, 07 Multi-category, 08 Network Access).",
                        "<b>3. Bottom Action CTA:</b> Sourcing consultation banner."
                    ]
                },
                {
                    "name": "4. Find a Model Maker (Intake Hub)",
                    "url": "/find-a-model-maker",
                    "source": "src/routes/page.tsx + src/components/enquiry-form.tsx",
                    "sec_count": "4 Sections",
                    "sections": [
                        "<b>1. Masthead:</b> 'Let’s find the capabilities your project needs.'",
                        "<b>2. Capability Matrix:</b> 8 criteria points for matching fabrication partners.",
                        "<b>3. Interactive Requirement Form:</b> Multi-field form (Name, Contact, Category picker, Scale/Dimensions, Timeline, Budget, File upload for CAD/PDFs).",
                        "<b>4. 5-Step Process Summary:</b> Overview of next steps upon brief submission."
                    ]
                },
                {
                    "name": "5. Categories Directory",
                    "url": "/categories",
                    "source": "src/routes/page.tsx + src/components/category-gallery.tsx",
                    "sec_count": "3 Sections",
                    "sections": [
                        "<b>1. Masthead:</b> 'Different models. Different expertise.'",
                        "<b>2. 9-Card Visual Grid:</b> Detailed category cards with high-res photos and direct slug routing.",
                        "<b>3. Bottom Action CTA:</b> Requirement consultation banner."
                    ]
                },
                {
                    "name": "6. Industries We Serve",
                    "url": "/industries",
                    "source": "src/routes/page.tsx + src/data/site.ts",
                    "sec_count": "3 Sections",
                    "sections": [
                        "<b>1. Masthead:</b> 'Built around your industry’s purpose.'",
                        "<b>2. 8 Industry Sector Cards:</b> 01 Architects, 02 Developers, 03 Infrastructure, 04 Industrial, 05 Public Sector, 06 Technical Colleges, 07 Museums, 08 Exhibition Teams.",
                        "<b>3. Bottom Action CTA:</b> Direct inquiry prompt."
                    ]
                },
                {
                    "name": "7. How It Works (Sourcing Workflow)",
                    "url": "/how-it-works",
                    "source": "src/routes/page.tsx + src/components/process.tsx",
                    "sec_count": "4 Sections",
                    "sections": [
                        "<b>1. Masthead:</b> 'From a requirement to a relevant introduction.'",
                        "<b>2. Process Timeline:</b> 5 visual milestone cards from brief to on-site installation.",
                        "<b>3. Architectural Reading Block:</b> 3 guide subsections (Preparing a quotation brief, Comparing scope, Agreeing before making).",
                        "<b>4. Bottom Action CTA:</b> Intake prompt banner."
                    ]
                },
                {
                    "name": "8. For Manufacturing Partners",
                    "url": "/for-manufacturers",
                    "source": "src/routes/page.tsx + src/data/site.ts",
                    "sec_count": "4 Sections",
                    "sections": [
                        "<b>1. Masthead:</b> 'Your capabilities. The relevant conversation.'",
                        "<b>2. Editorial Split:</b> Sourcing network value, workshop assessment criteria, 'Join Network' CTA.",
                        "<b>3. Workshop Checklist Block:</b> What to include (Equipment, tolerances, capacity) and evaluation timeline.",
                        "<b>4. Bottom Action CTA:</b> Maker application banner."
                    ]
                },
                {
                    "name": "9. Become a Partner (Maker Onboarding)",
                    "url": "/become-a-partner",
                    "source": "src/routes/page.tsx + src/components/enquiry-form.tsx",
                    "sec_count": "3 Sections",
                    "sections": [
                        "<b>1. Masthead:</b> 'Introduce your workshop.'",
                        "<b>2. Dedicated Partner Application Form:</b> Workshop details, machinery list (Laser, CNC, SLA 3D print), past project portfolio URLs, capacity.",
                        "<b>3. Terms Notice:</b> Neutrality and submission guidelines."
                    ]
                },
                {
                    "name": "10. Frequently Asked Questions (FAQ)",
                    "url": "/faq",
                    "source": "src/routes/page.tsx + src/data/site.ts",
                    "sec_count": "3 Sections",
                    "sections": [
                        "<b>1. Masthead:</b> 'Good questions. Clear expectations.'",
                        "<b>2. Accordion FAQ Stream + Direct Desk:</b> 10 expandable high-relevance FAQs + Call/WhatsApp direct button box.",
                        "<b>3. Bottom Action CTA:</b> Requirement consultation banner."
                    ]
                },
                {
                    "name": "11. Contact Us & Hotline Desk",
                    "url": "/contact",
                    "source": "src/routes/page.tsx + src/components/enquiry-form.tsx",
                    "sec_count": "3 Sections",
                    "sections": [
                        "<b>1. Masthead:</b> 'Tell us what your project needs.'",
                        "<b>2. Direct Communication Terminals:</b> Phone hotline (+91 83028 06913), WhatsApp desk, Email (vistarmodels@gmail.com), Pan-India service notice.",
                        "<b>3. Inbound Requirement Form:</b> Full project intake form."
                    ]
                },
                {
                    "name": "12. Privacy Policy",
                    "url": "/privacy",
                    "source": "src/routes/page.tsx + src/data/site.ts",
                    "sec_count": "2 Sections",
                    "sections": [
                        "<b>1. Masthead:</b> 'Privacy Policy · Last updated 15 October 2026'",
                        "<b>2. 6 Privacy Blocks:</b> Information collected, Usage, Database storage, Retention choices, External services, Drawing confidentiality."
                    ]
                },
                {
                    "name": "13. Terms of Use",
                    "url": "/terms",
                    "source": "src/routes/page.tsx + src/data/site.ts",
                    "sec_count": "2 Sections",
                    "sections": [
                        "<b>1. Masthead:</b> 'Terms of Use · Last updated 15 October 2026'",
                        "<b>2. 7 Legal Blocks:</b> Sourcing consultancy role, No guaranteed outcome, Client/Maker contract autonomy, Consultancy fees, Applications, Illustrative AI imagery, Permitted use."
                    ]
                }
            ]
        },
        {
            "class_title": "CLASS 3: Specialized Model Category Showcases (9 Pages · 27 Sections)",
            "pages": [
                {
                    "name": "14. Architectural Models (/architectural-makers)",
                    "url": "/architectural-makers",
                    "source": "src/routes/page.tsx + src/components/category-content.tsx",
                    "sec_count": "3 Sections",
                    "sections": [
                        "<b>1. Masthead:</b> 'Find Architectural Models Makers in India' with briefing advice.",
                        "<b>2. Technical Content (<CategoryContent />):</b> High-res photo, consideration notes, 3 scope needs (Plans/elevations, purpose/scale, facade/lighting), other categories link.",
                        "<b>3. Direct Action CTA:</b> Dedicated enquiry banner."
                    ]
                },
                {
                    "name": "15. Township & Master Plans (/township-makers)",
                    "url": "/township-makers",
                    "source": "src/routes/page.tsx + src/components/category-content.tsx",
                    "sec_count": "3 Sections",
                    "sections": ["<b>1. Masthead</b>", "<b>2. Technical Content:</b> Masterplan boundaries, phasing, modular base crating, resin water elements.", "<b>3. CTA</b>"]
                },
                {
                    "name": "16. Industrial Plants & Factories (/industrial-makers)",
                    "url": "/industrial-makers",
                    "source": "src/routes/page.tsx + src/components/category-content.tsx",
                    "sec_count": "3 Sections",
                    "sections": ["<b>1. Masthead</b>", "<b>2. Technical Content:</b> Piping schemes, equipment layouts, cutaway zones, process flow.", "<b>3. CTA</b>"]
                },
                {
                    "name": "17. Villa & Commercial Models (/villa-commercial-makers)",
                    "url": "/villa-commercial-makers",
                    "source": "src/routes/page.tsx + src/components/category-content.tsx",
                    "sec_count": "3 Sections",
                    "sections": ["<b>1. Masthead</b>", "<b>2. Technical Content:</b> Luxury residential finishes, exterior vs cutaway, landscaping, retail podiums.", "<b>3. CTA</b>"]
                },
                {
                    "name": "18. Interior Presentation Models (/interior-makers)",
                    "url": "/interior-makers",
                    "source": "src/routes/page.tsx + src/components/category-content.tsx",
                    "sec_count": "3 Sections",
                    "sections": ["<b>1. Masthead</b>", "<b>2. Technical Content:</b> Cutaway room layouts, bespoke miniature furniture, removable roof systems.", "<b>3. CTA</b>"]
                },
                {
                    "name": "19. Exhibition & Presentation (/exhibition-makers)",
                    "url": "/exhibition-makers",
                    "source": "src/routes/page.tsx + src/components/category-content.tsx",
                    "sec_count": "3 Sections",
                    "sections": ["<b>1. Masthead</b>", "<b>2. Technical Content:</b> Museum displays, durable enclosures, portable transport flight cases.", "<b>3. CTA</b>"]
                },
                {
                    "name": "20. Engineering & Infrastructure (/engineering-infrastructure-makers)",
                    "url": "/engineering-infrastructure-makers",
                    "source": "src/routes/page.tsx + src/components/category-content.tsx",
                    "sec_count": "3 Sections",
                    "sections": ["<b>1. Masthead</b>", "<b>2. Technical Content:</b> Bridges, metro networks, transit corridors, civil engineering mockups.", "<b>3. CTA</b>"]
                },
                {
                    "name": "21. Working & Demonstration (/working-demonstration-makers)",
                    "url": "/working-demonstration-makers",
                    "source": "src/routes/page.tsx + src/components/category-content.tsx",
                    "sec_count": "3 Sections",
                    "sections": ["<b>1. Masthead</b>", "<b>2. Technical Content:</b> Moving mechanisms, motorization, speed controls, safety servicing.", "<b>3. CTA</b>"]
                },
                {
                    "name": "22. 3D Printing & Components (/3d-printing-components)",
                    "url": "/3d-printing-components",
                    "source": "src/routes/page.tsx + src/components/category-content.tsx",
                    "sec_count": "3 Sections",
                    "sections": ["<b>1. Masthead</b>", "<b>2. Technical Content:</b> SLA/PolyJet micro-detailing, CAD mesh vectorization, resin finishing, tolerances.", "<b>3. CTA</b>"]
                }
            ]
        },
        {
            "class_title": "CLASS 4: Regional Operating Hubs & 200-FAQ Engine (10 Pages · 86 Sections)",
            "pages": [
                {
                    "name": "23. All Branches Hub Directory (/units)",
                    "url": "/units",
                    "source": "src/routes/units.tsx",
                    "sec_count": "5 Sections",
                    "sections": [
                        "<b>1. Regional Masthead:</b> 'Our Registered Branches & Operating Units Across India' (MSME UDYAM-RJ-17-0536099).",
                        "<b>2. Quick Station Bar:</b> 9 monospace metro hub quick anchor buttons.",
                        "<b>3. 9 Terminal Rows:</b> Monospace terminal layout per city (City, State, RERA, Authority, Rating, Address, Highlights, Maps, WhatsApp).",
                        "<b>4. National Capability Badges:</b> 3 trust pillars (MSME Verified, Pan-India Crating, 24/6 Technical Desk).",
                        "<b>5. Contact CTA:</b> Regional consultation banner."
                    ]
                },
                {
                    "name": "24–32. 9 Regional City Hub Pages (/units/:city)",
                    "url": "/units/jaipur, /units/mumbai, /units/delhi, /units/gurugram, /units/noida, /units/bengaluru, /units/pune, /units/hyderabad, /units/ahmedabad",
                    "source": "src/routes/units.$city.tsx + src/data/units.ts + src/data/units-city-faqs.ts",
                    "sec_count": "9 Sections Each (Total 81 Sections across 9 Hubs)",
                    "sections": [
                        "<b>1. Breadcrumb & Fast Switch Bar:</b> Hierarchy trail + horizontal badge bar to jump to any of the 8 other city units.",
                        "<b>2. Verification Hero:</b> City H1, UDYAM registration pill, 5.0 Google rating badge with audited review count.",
                        "<b>3. Atomic AEO/GEO Direct Answer Box:</b> 40–60 word dense factual summary for Google AI Overviews & Perplexity citing exact address, RERA & authorities.",
                        "<b>4. Branch Address & Navigation Terminal:</b> Official street address, PIN code, direct Phone, WhatsApp, and Google Maps GPS navigation link.",
                        "<b>5. 4-Card Visual Showcase:</b> High-Rise, Township, Industrial, Villa cards with city-specific image alt tags.",
                        "<b>6. Pricing & Specification Table:</b> 5-column reference matrix (Model Category, Standard Scale, Materials, Production Time, Budget Range ₹, Ideal Purpose).",
                        "<b>7. Editorial Regional Context:</b> Two-column deep dive: (a) Operational Branch capabilities, (b) Local real estate & authority compliance.",
                        "<b>8. 200 Questions Knowledge Engine:</b> Interactive live search bar filtering 200 city-specific technical FAQs with instant zero-CLS accordion rendering.",
                        "<b>9. Cross-Branch Directory & CTA:</b> Links to other 8 city hubs + bottom institutional contact banner."
                    ]
                }
            ]
        },
        {
            "class_title": "CLASS 5: The Vistar Journal / Articles (7 Pages · 39 Sections)",
            "pages": [
                {
                    "name": "33. Journal Main Listing (/blog)",
                    "url": "/blog",
                    "source": "src/routes/blog.tsx + src/components/blog/blog-index.tsx",
                    "sec_count": "3 Sections",
                    "sections": [
                        "<b>1. Journal Masthead:</b> 'The Vistar Journal — Scale model sourcing · Articles'.",
                        "<b>2. Editorial Grid (<BlogIndex />):</b> Intro banner + 6 responsive article cards (Date, read time, cover photo, category, title, excerpt) + 24/6 operating schedule note.",
                        "<b>3. Bottom Action CTA:</b> Requirement consultation banner."
                    ]
                },
                {
                    "name": "34–39. 6 In-Depth Journal Articles (/blog/:slug)",
                    "url": "• /blog/how-to-choose-an-architectural-model-maker<br/>• /blog/prepare-a-useful-quotation-brief-for-a-scale-model<br/>• /blog/matching-a-model-maker-to-project-capabilities<br/>• /blog/types-of-scale-models-and-their-uses<br/>• /blog/scale-model-timelines-and-budget-considerations<br/>• /blog/what-does-a-scale-model-sourcing-consultancy-do",
                    "source": "src/routes/blog.$slug.tsx + src/components/blog/article-body.tsx + src/data/blog-posts.ts",
                    "sec_count": "6 Sections Each (Total 36 Sections across 6 Articles)",
                    "sections": [
                        "<b>1. Sticky Architectural Sidebar (Left Rail):</b> Category pill, author metadata, publication date, read duration, auto-numbered Table of Contents (TOC), quick brief submission box.",
                        "<b>2. Article Header & Cover:</b> H1 headline, lead excerpt, and preloaded high-resolution WebP hero figure with caption.",
                        "<b>3. Atomic TL;DR Answer Box:</b> High-density 1-paragraph summary for AI search engines (Perplexity, Claude, ChatGPT Search).",
                        "<b>4. Editorial Body Stream:</b> 4 to 6 H2 structured sub-sections with checklists, guidelines, and bold lead-in points.",
                        "<b>5. In-Article Requirement CTA & Related Articles Nav:</b> Embedded Call and WhatsApp desk buttons + contextual internal reading links.",
                        "<b>6. Global Bottom Action CTA:</b> Requirement consultation banner."
                    ]
                }
            ]
        },
        {
            "class_title": "CLASS 6: Discovery, AI & SEO Feeds (6 Endpoints)",
            "pages": [
                {
                    "name": "40–45. System Endpoints & Feeds",
                    "url": "/sitemap.xml, /robots.txt, /llms.txt, /rss.xml, /api/health, /api/*",
                    "source": "src/routes/sitemap.xml.ts, robots.txt.ts, llms.txt.ts, rss.xml.ts, api.health.ts, api.$.ts",
                    "sec_count": "Automated Feeds",
                    "sections": [
                        "<b>/sitemap.xml:</b> Dynamic XML index generating all 39 canonical URLs with exact ISO 8601 lastmod dates.",
                        "<b>/robots.txt:</b> Strict crawl directives permitting Googlebot, GPTBot, ClaudeBot, PerplexityBot, and Google-Extended.",
                        "<b>/llms.txt:</b> Markdown knowledge feed designed for LLM citation and agentic reasoning engines.",
                        "<b>/rss.xml:</b> Dynamic RSS 2.0 XML feed broadcasting all published Journal articles.",
                        "<b>/api/health:</b> Lightweight HTTP 200 health check endpoint for monitoring uptime.",
                        "<b>/api/*:</b> Dynamic catch-all API handler for serverless operations."
                    ]
                }
            ]
        }
    ]

    for cls in classes:
        elements.append(PageBreak())
        elements.append(Paragraph(cls["class_title"], h1_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0F172A"), spaceAfter=10))

        for p in cls["pages"]:
            page_card = []
            page_card.append(Paragraph(p["name"], page_header_style))
            page_card.append(Paragraph(f"<b>URL:</b> {p['url']} &nbsp;|&nbsp; <b>File:</b> {p['source']} &nbsp;|&nbsp; <b>Sections:</b> <font color='#D97706'><b>{p['sec_count']}</b></font>", url_style))
            page_card.append(Spacer(1, 4))
            
            for sec in p["sections"]:
                page_card.append(Paragraph(f"• {sec}", section_style))
                page_card.append(Spacer(1, 2))
                
            page_card.append(Spacer(1, 8))
            elements.append(KeepTogether(page_card))

    doc.build(elements, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {filename}")

if __name__ == "__main__":
    out_pdf = os.path.join(r"c:\Users\RD MODELS\Desktop\RD PRO PROJECTS\vistar-models", "Wispr_Model_Store_UI_UX_Master_Catalog.pdf")
    create_catalog_pdf(out_pdf)
