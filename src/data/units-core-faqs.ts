export type UnitFAQ = {
	question: string;
	answer: string;
};

export function getCoreFaqs(city: string, state: string, address: string): UnitFAQ[] {
	return [
		// CATEGORY A: About Vistar Models (1–15)
		{
			question: `What is Vistar Models ${city}?`,
			answer: `Vistar Models ${city} is a specialized scale model consultancy operating under MSME UDYAM Registration UDYAM-RJ-17-0536099, located at ${address}, ${city}, ${state}. We consult architects, developers, and government agencies to specify and source precision architectural, township, industrial, and engineering scale models.`,
		},
		{
			question: `Is Vistar Models ${city} a direct manufacturer or a consultancy?`,
			answer: `Vistar Models operates as a specialized technical consultancy and sourcing coordinator. We assist you in drafting exact fabrication specifications (scales, materials, tolerance, illumination) and connect your project with verified master model makers and industrial fabrication facilities capable of delivering the highest quality.`,
		},
		{
			question: `Where is the Vistar Models registered office located in ${city}?`,
			answer: `The official registered unit address in ${city} is ${address}, ${city}, ${state}, pin-coded for verified regional operations under MSME registration UDYAM-RJ-17-0536099.`,
		},
		{
			question: `Is Vistar Models ${city} registered under the Government of India MSME?`,
			answer: `Yes, Vistar Models is officially registered with the Ministry of Micro, Small and Medium Enterprises (MSME), Government of India, under UDYAM Registration Number UDYAM-RJ-17-0536099 in the manufacturing and scale model consultancy sector.`,
		},
		{
			question: `What is the official UDYAM registration number for Vistar Models?`,
			answer: `The official UDYAM Registration Number for Vistar Models is UDYAM-RJ-17-0536099. This registration can be verified on the official Udyam portal of the Government of India.`,
		},
		{
			question: `Who founded Vistar Models?`,
			answer: `Vistar Models was founded by Yogendra Yogi, an experienced professional dedicated to modernizing the architectural and industrial physical modeling ecosystem across India.`,
		},
		{
			question: `Across how many cities does Vistar Models have registered operating units?`,
			answer: `Vistar Models has 9 registered units across major Indian metropolitan hubs: Jaipur, Mumbai, Gurugram, Delhi, Bengaluru, Pune, Hyderabad, Ahmedabad, and Noida.`,
		},
		{
			question: `Can clients schedule a consultation at the ${city} office?`,
			answer: `Yes, project consultations for architectural and township models at our ${city} location (${address}) can be booked by prior appointment via phone (+91 83028 06913) or WhatsApp.`,
		},
		{
			question: `What are the working hours of Vistar Models in ${city}?`,
			answer: `Our ${city} consultancy desk operates 24 hours Monday through Saturday, providing continuous support for ongoing project tenders and urgent fabrication timelines. We remain closed on Sundays.`,
		},
		{
			question: `How can developers and architects in ${city} contact Vistar Models?`,
			answer: `You can reach our ${city} desk directly via phone at +91 83028 06913, email at vistarmodels@gmail.com, or via direct WhatsApp enquiry through our website vistarmodels.com.`,
		},
		{
			question: `Does Vistar Models support emergency or weekend project coordination in ${city}?`,
			answer: `While our official consulting hours are Monday through Saturday, urgent weekend tender submissions and exhibition installations can be accommodated by prior arrangement with our project coordination team.`,
		},
		{
			question: `Can international architecture firms operating in ${city} commission models through Vistar Models?`,
			answer: `Yes, we frequently assist international architectural practices, master planning firms, and multinational developers operating in ${city} with local fabrication sourcing, export-grade crating, and international logistics.`,
		},
		{
			question: `Does Vistar Models adhere to Indian Institute of Architects (IIA) drawing standards?`,
			answer: `Yes, our technical team reviews all architectural drawings conforming to standard Indian Institute of Architects (IIA) conventions, National Building Code (NBC) guidelines, and standard metric/imperial architectural scales.`,
		},
		{
			question: `What safety and material standards do Vistar Models partners follow?`,
			answer: `Fabrication partners connected through Vistar Models follow stringent standards including high-grade non-warping cast acrylic, flame-retardant ABS, low-heat LED arrays, and CE/UL certified power transformers.`,
		},
		{
			question: `How does Vistar Models protect confidential architectural designs and IP in ${city}?`,
			answer: `We sign comprehensive Non-Disclosure Agreements (NDAs) prior to receiving proprietary CAD, BIM, or Revit models, ensuring complete intellectual property protection for all developers and architects in ${city}.`,
		},

		// CATEGORY B: Services Offered (16–30)
		{
			question: `What scale model categories are supported in ${city}?`,
			answer: `We support 9 major categories: Architectural Scale Models, Township & Master Plans, Industrial Plants & Factories, Villa & Commercial Complex Models, Interior Presentation Models, Exhibition & Museum Models, Engineering & Infrastructure Models, Working & Dynamic Mechanism Models, and Precision 3D Printed Components.`,
		},
		{
			question: `Can I get high-rise residential sales gallery models made in ${city}?`,
			answer: `Yes, we specialize in high-rise residential tower models for builder sales galleries in ${city}, featuring multi-tiered podium parking, realistic landscaping, floor-by-floor interactive lighting, and cutaway luxury amenities.`,
		},
		{
			question: `Does Vistar Models coordinate large township master plan models in ${city}?`,
			answer: `Yes, we coordinate large-scale master plan models ranging from 50 to 500+ acres for developments in and around ${city}, manufactured in modular seamless interlocking sections with topographical contours.`,
		},
		{
			question: `Can Vistar Models source industrial plant and factory scale models in ${city}?`,
			answer: `Yes, we facilitate fabrication of heavy industrial models, chemical processing units, refinery layouts, and automated warehouse flow models with color-coded piping and operational equipment detailing.`,
		},
		{
			question: `Are cutaway interior presentation models available in ${city}?`,
			answer: `Yes, interior cutaway models at scales such as 1:25 or 1:50 featuring miniature bespoke furniture, micro-textured wall finishes, modular removable roofs, and warm interior LED downlighting are available for ${city} projects.`,
		},
		{
			question: `Can exhibition and museum display models be commissioned in ${city}?`,
			answer: `Yes, we source high-durability interactive models with touchscreen controls, visitor push-button lighting, protective tempered acrylic enclosures, and tamper-proof pedestals for museums and trade expos in ${city}.`,
		},
		{
			question: `Does Vistar Models handle infrastructure and bridge models in ${city}?`,
			answer: `Yes, civil engineering scale models including elevated metro viaducts, multi-level highway flyovers, cable-stayed bridges, railway junctions, and water treatment plants are routinely coordinated for ${city} infrastructure tenders.`,
		},
		{
			question: `Are motorized and dynamic working scale models available in ${city}?`,
			answer: `Yes, we source models with motorized elements such as revolving display bases, moving container gantry cranes, functioning lock gates, solar tracker mechanics, and sequenced dynamic lighting.`,
		},
		{
			question: `Can I order 3D-printed miniature architectural components in ${city}?`,
			answer: `Yes, for specialized components like ornate heritage jaalis, organic parametric facades, miniature structural trusses, and customized human figures, high-resolution SLA, SLS, and PolyJet 3D printing can be sourced in ${city}.`,
		},
		{
			question: `What is the typical minimum project size accepted for consultation in ${city}?`,
			answer: `We evaluate projects of all sizes, from individual luxury villa presentation models starting around 2×2 feet up to massive township displays spanning 20×15 feet.`,
		},
		{
			question: `Can Vistar Models handle multiple model replicas for multi-city project launches?`,
			answer: `Yes, we manage parallel fabrication pipelines capable of producing identical master model replicas for concurrent launch galleries across ${city} and other major metropolitan centers.`,
		},
		{
			question: `Does Vistar Models support competition scale models for architecture students and colleges in ${city}?`,
			answer: `Yes, we provide advisory services on material selection, rapid fabrication techniques, and cost-effective laser cutting for architectural design competitions and university exhibitions in ${city}.`,
		},
		{
			question: `Can landscape and terrain contour models be fabricated for hilly or sloping sites near ${city}?`,
			answer: `Yes, stepped contour terrain models using precision laser-cut cork, acrylic sheets, or CNC-milled high-density polyurethane foam can be accurately generated from topographic survey GIS data.`,
		},
		{
			question: `Does Vistar Models provide pre-manufacturing feasibility reviews in ${city}?`,
			answer: `Yes, our senior technical advisors review your 2D drawings and 3D models prior to manufacturing to detect scale clashes, fragile overhangs, and transport constraints, preventing costly revisions.`,
		},
		{
			question: `Can scale models be constructed with removable floor slabs in ${city}?`,
			answer: `Yes, modular multi-tier models where upper floors or roofs can be lifted off to reveal floor-plan space planning and apartment unit layouts are widely sourced for sales offices in ${city}.`,
		},

		// CATEGORY C: Pricing & Budget (31–45)
		{
			question: `What is the estimated cost of an architectural scale model in ${city}?`,
			answer: `Architectural models in ${city} generally range from ₹60,000 for compact residential villas to ₹3,50,000–₹12,00,000+ for large commercial towers or detailed township layouts, depending on scale, level of detail, and interactive lighting.`,
		},
		{
			question: `How much does a township master plan scale model cost in ${city}?`,
			answer: `Township master plan models typically range from ₹2,50,000 to ₹15,00,000+ depending on total footprint size (e.g., 8×5 ft vs 16×10 ft), road network illumination, landscape density, and motorized features.`,
		},
		{
			question: `What is the pricing for a luxury residential villa model in ${city}?`,
			answer: `A detailed 1:50 or 1:75 scale villa model with landscaped garden, interior lighting, and clear acrylic display cover typically costs between ₹75,000 and ₹2,25,000 in ${city}.`,
		},
		{
			question: `What factors directly determine the price of a physical scale model?`,
			answer: `Primary cost drivers include overall model footprint, scale ratio, complexity of facade geometry, material grade (cast acrylic vs 3D resin), lighting technology (static vs multi-zone smart app-controlled LEDs), and custom base cabinetry.`,
		},
		{
			question: `Is GST applicable to scale model manufacturing and consultancy in ${city}?`,
			answer: `Yes, standard Government of India GST (18%) is applicable on professional scale model consultancy, technical drawing preparation, and commercial model manufacturing services with formal tax invoicing.`,
		},
		{
			question: `How can I get an accurate cost quotation for my project in ${city}?`,
			answer: `To receive an itemized proposal, share your site plan, building elevations, preferred scale (e.g., 1:100), desired model dimensions, and required completion date with our team via WhatsApp or email.`,
		},
		{
			question: `Are there economical or low-budget scale model options available in ${city}?`,
			answer: `Yes, monochromatic volumetric massing models or white architectural study models made from high-density foam board and laser-cut acrylic offer substantial cost savings (30–45% lower than fully painted realistic models).`,
		},
		{
			question: `Does Vistar Models charge a consultation fee for initial requirement scoping?`,
			answer: `Initial project scoping, preliminary scale recommendations, and manufacturer matching consultations are conducted without upfront fees for qualified real estate developers and architectural practices in ${city}.`,
		},
		{
			question: `What payment milestones are standard for scale model fabrication in ${city}?`,
			answer: `Industry standard milestones are: 40–50% advance on drawing signoff, 30–40% upon interim structural photo/video inspection, and the final 10–20% balance upon final quality approval prior to dispatch or on-site installation.`,
		},
		{
			question: `Can I get an approximate budget quote without detailed architectural drawings?`,
			answer: `Yes, if you provide the plot size, total built-up area, building height/number of floors, and a conceptual 3D render, we can provide a preliminary budgetary estimate within ±15% accuracy.`,
		},
		{
			question: `What is the cost difference between 1:100 scale and 1:200 scale?`,
			answer: `A 1:100 scale model has twice the linear dimensions and approximately four times the surface area of a 1:200 model, typically requiring 2.5× to 3.5× more fabrication time and material, thus increasing the price accordingly.`,
		},
		{
			question: `How much does multi-zone LED illumination add to scale model pricing?`,
			answer: `Basic interior ambient lighting adds ₹15,000–₹35,000, while multi-channel remote-controlled or iPad-switched lighting (highlighting residential vs commercial vs amenity zones) ranges from ₹45,000 to ₹1,50,000+.`,
		},
		{
			question: `Does the quote include the display table and acrylic dust hood in ${city}?`,
			answer: `Quotations can be structured all-inclusive with custom CNC-finished wooden/metal pedestal tables and 4mm–8mm UV-bonded scratch-resistant acrylic covers, or for the tabletop model base board alone.`,
		},
		{
			question: `Do scale model prices differ across different cities in India?`,
			answer: `While raw materials cost the same nationwide, transport distance, on-site technician deployment, and city-specific logistics can cause minor variations (5–10%), which Vistar Models optimizes through regional unit coordination.`,
		},
		{
			question: `Are corporate invoicing and MSME vendor onboarding supported for ${city} builders?`,
			answer: `Yes, we provide full vendor onboarding documentation, MSME UDYAM certificate, GST compliance certificates, and PAN details for smooth corporate procurement compliance in ${city}.`,
		},

		// CATEGORY D: Technical Specifications (46–60)
		{
			question: `What scale ratios are most commonly used for architectural models in ${city}?`,
			answer: `Standard scales are: 1:20 to 1:50 for luxury villas and interior cutaways; 1:75 to 1:150 for residential towers and commercial complexes; 1:200 to 1:500 for large master plans, townships, and industrial campuses.`,
		},
		{
			question: `What materials are used for long-lasting scale models in ${city}?`,
			answer: `We prioritize high-density cast acrylic (PMMA), ABS engineering plastic, high-density polyurethane tooling boards (Ureol), photo-etched brass, fine laser-engraved birch ply, and automotive-grade polyurethane paints.`,
		},
		{
			question: `What is the difference between cast acrylic and 3D printing in scale modeling?`,
			answer: `Laser-cut cast acrylic provides ultra-sharp, glass-smooth planar walls and window mullions with zero layer lines. 3D printing (SLA/PolyJet) is utilized for complex organic curves, statues, balconies, and intricate decorative motifs.`,
		},
		{
			question: `What digital design file formats are required to initiate a model build?`,
			answer: `We accept AutoCAD (.DWG/.DXF), Revit (.RVT), SketchUp (.SKP), Rhino (.3DM), 3ds Max (.MAX), and neutral 3D formats (.STEP, .IGES, .FBX, .OBJ, .STL) along with PDF architectural sets.`,
		},
		{
			question: `Can a scale model be made if only 2D PDF drawings or hand sketches exist?`,
			answer: `Yes, our technical drafting team can convert 2D PDF floor plans, hand sketches, and elevation drawings into clean 3D CAD fabrication vectors ready for laser cutting and CNC machining.`,
		},
		{
			question: `What lighting systems are engineered into sales gallery models?`,
			answer: `We use low-voltage (12V/24V) high-CRI micro LEDs, edge-lit acrylic light-guides, fiber-optic pinpoint starry sky accents, warm white (3000K) facade illumination, and cool white (5000K) street lighting with heat-sink protection.`,
		},
		{
			question: `Can the lighting in the model be controlled via iPad, tablet, or smartphone?`,
			answer: `Yes, smart Wi-Fi or Bluetooth DMX controller modules can be integrated, allowing sales agents in ${city} to trigger specific floor plans, clubhouses, or green zones directly from an iPad during customer presentations.`,
		},
		{
			question: `How are miniature trees, grass, and realistic landscaping created?`,
			answer: `Landscaping utilizes electrostatically flocked multi-tone synthetic turf, etched brass wire-twisted miniature trees with sponge foliage, clear tinted resin water bodies with simulated ripples, and miniature human and vehicle figures.`,
		},
		{
			question: `What is the standard base board construction for structural stability?`,
			answer: `Bases are constructed from marine-grade calibrated plywood reinforced with internal aluminium box-section framing to prevent sagging, warping, or bowing over years of display in ${city}.`,
		},
		{
			question: `Can water bodies in master plan models look realistic with ripples and depth?`,
			answer: `Yes, swimming pools, lakes, and rivers are crafted using tinted multi-layer epoxy casting resins, textured acrylic sheets, and underwater LED light ribbons to produce realistic aquatic depth and wave motion.`,
		},
		{
			question: `Are scale models built with removable sectional modules for easy transport?`,
			answer: `Yes, models larger than 8×4 feet are typically designed as interlocking modular sections with concealed magnetic or dowel pin alignments and multi-pin electrical connectors for seamless on-site assembly.`,
		},
		{
			question: `What paint finishes are applied to withstand UV light and ambient heat in ${city}?`,
			answer: `All exterior surfaces receive multi-coat industrial polyurethane (PU) primers and matte automotive topcoats mixed to exact RAL, Pantone, or Asian Paints Asian fan-deck codes, resisting fading and yellowing.`,
		},
		{
			question: `Can scale models display structural glass curtain walls and mullions?`,
			answer: `Yes, tinted, reflective, or frosted acrylic sheet glazing with CNC-milled or laser-scored micro-mullions accurately reproduces modern glass curtain facades with millimeter precision.`,
		},
		{
			question: `What is the dimensional tolerance maintained during model fabrication?`,
			answer: `Using industrial CO2 laser cutters and CNC router tables, fabrication tolerances are held to ±0.1mm to ±0.2mm, ensuring razor-sharp joints, perfect alignments, and clean geometric corners.`,
		},
		{
			question: `Can sound effects or video display screens be integrated into the model base?`,
			answer: `Yes, flush-mounted OLED/LCD screens displaying promotional project videos or synchronized ambient audio systems can be seamlessly built into the model pedestal in ${city}.`,
		},

		// CATEGORY E: Timeline & Logistics (61–75)
		{
			question: `What is the typical fabrication timeline for an architectural model in ${city}?`,
			answer: `Standard production spans 2 to 4 weeks for residential towers and commercial buildings, 3 to 6 weeks for large master plan townships, and 10 to 14 days for individual villa models.`,
		},
		{
			question: `Can urgent scale models be delivered in 7 to 10 days in ${city}?`,
			answer: `Yes, for critical launch deadlines or government tender submissions, fast-track double-shift fabrication pipelines can be organized with expedited laser-cutting and dedicated multi-technician teams.`,
		},
		{
			question: `How are delicate scale models packaged for safe transit to ${city}?`,
			answer: `Models are packed in custom-built fumigated plywood export crates lined with high-density EVA shock-absorbing foam, silica gel desiccant packs, and waterproof vapor-barrier wrapping with fragile tilt-indicators.`,
		},
		{
			question: `Does a technician travel to ${city} for on-site unboxing and installation?`,
			answer: `Yes, experienced senior model technicians travel to the site in ${city} to unbox the crate, align modular sections, wire the power adapters, test all lighting zones, and perform final white-glove touch-ups.`,
		},
		{
			question: `What transit insurance is arranged for scale model deliveries?`,
			answer: `Comprehensive all-risk transit insurance covering accidental damage, shock impact, and transit loss from workshop to your destination site in ${city} is arranged for every shipment.`,
		},
		{
			question: `Can scale models be safely moved between multiple marketing suites in ${city}?`,
			answer: `Yes, we can provide heavy-duty reusable flight cases equipped with industrial recessed butterfly latches, spring handles, and lockable caster wheels for models scheduled for roadshows and exhibitions.`,
		},
		{
			question: `What happens if a delicate component is damaged during transit to ${city}?`,
			answer: `Our traveling technician carries a comprehensive repair field-kit including matching PU paint touches, spare trees, vehicles, and adhesives to restore any dislodged component immediately prior to handover.`,
		},
		{
			question: `How far in advance should a developer in ${city} place a model order before project launch?`,
			answer: `We recommend initiating discussions 5 to 7 weeks prior to your targeted sales gallery launch to allow ample time for CAD vectorization, sample approvals, lighting programming, and on-site testing.`,
		},
		{
			question: `Does Vistar Models handle cross-state transport logistics to and from ${city}?`,
			answer: `Yes, we manage complete interstate logistics with dedicated air-ride suspension trucks, express air-cargo charters, and full E-Way Bill and GST compliance documentation across state borders.`,
		},
		{
			question: `Is installation and setup included in the quoted project cost?`,
			answer: `Yes, all comprehensive proposals include on-site installation by professional model builders, complete electrical commissioning, and basic operational staff training in ${city}.`,
		},
		{
			question: `Can models be delivered directly to temporary hotel convention halls in ${city}?`,
			answer: `Yes, we frequently deliver and assemble display models directly in hotel ballrooms and convention centers for investor meets, channel partner launches, and real estate trade summits.`,
		},
		{
			question: `What electrical power supply is required for the scale model in ${city}?`,
			answer: `Models operate on standard single-phase 220V–240V AC 50Hz wall sockets, stepped down via certified internal SMPS power supplies to safe low-voltage 12V DC with fuse protection.`,
		},
		{
			question: `Can models be shipped internationally from ${city}?`,
			answer: `Yes, we coordinate international air freight with ISPM-15 certified fumigated wooden crating, commercial export documentation, and customs clearance support for overseas clients.`,
		},
		{
			question: `How are large 15-foot models negotiated through building doors in ${city}?`,
			answer: `Before fabrication, our team checks your site's lift dimensions, corridor turnings, and door clearances, engineering the model into modular sections that comfortably pass through standard entryways.`,
		},
		{
			question: `Is express air delivery available for urgent miniature components in ${city}?`,
			answer: `Yes, replacement parts or supplementary 3D miniature components can be dispatched via next-day priority air courier to ${city} whenever urgent additions are required.`,
		},

		// CATEGORY F: Maintenance & Longevity (76–90)
		{
			question: `How long do architectural scale models last under typical display conditions in ${city}?`,
			answer: `High-quality scale models manufactured with UV-stabilized cast acrylic and automotive PU paints have an indoor lifespan of 8 to 15+ years without warping, discoloration, or structural deterioration.`,
		},
		{
			question: `How should a physical scale model be cleaned and dusted in ${city}?`,
			answer: `Clean only with ultra-soft electrostatic feather dusters or low-pressure cold-air cans. Never use solvent sprays, alcohol wipes, or abrasive cloths on acrylic or miniature foliage surfaces.`,
		},
		{
			question: `What type of acrylic cover is recommended for sales gallery displays in ${city}?`,
			answer: `We recommend 5mm to 8mm optically clear, UV-filtering cast acrylic covers with diamond-polished beveled edges and corner reinforcement blocks to protect against dust and curious visitors.`,
		},
		{
			question: `Can scale models withstand high temperatures or air-conditioned environments in ${city}?`,
			answer: `Yes, using thermally stable acrylic and moisture-resistant marine-grade bases prevents expansion and contraction cycles between air-conditioned gallery hours and night closures in ${city}.`,
		},
		{
			question: `Can an existing scale model be modified if the architectural design changes later?`,
			answer: `Yes, our technicians can modify existing models on-site in ${city} by retrofitting new building towers, re-routing roadway networks, or altering landscape layouts without discarding the entire base.`,
		},
		{
			question: `Are scale models safe for continuous 24/7 illumination in sales offices?`,
			answer: `Yes, our LED illumination arrays generate negligible heat and run through commercial-grade constant-voltage power supplies designed for continuous commercial duty cycles without fire hazard.`,
		},
		{
			question: `What routine maintenance does Vistar Models recommend for display models?`,
			answer: `We recommend an annual maintenance checkup: inspecting power adapters, dusting delicate tree foliage, polishing the acrylic hood with antistatic cleaner, and testing all lighting relays.`,
		},
		{
			question: `What warranty is provided on scale models sourced through Vistar Models?`,
			answer: `Fabrication partners provide a standard 12-month craftsmanship and electrical warranty covering LED circuits, transformers, and structural joints against manufacturing defects.`,
		},
		{
			question: `Can scratched acrylic display hoods be polished on-site in ${city}?`,
			answer: `Yes, minor surface hairline scratches on the clear acrylic casing can be polished out using specialized micro-abrasive acrylic polishing compounds and high-speed buffing pads.`,
		},
		{
			question: `How are scale models preserved if placed into storage after project sellout?`,
			answer: `Store models inside their original foam-padded wooden crates in a dry, climate-controlled room away from direct sunlight, with silica gel packs to absorb any latent ambient humidity.`,
		},
		{
			question: `Can Vistar Models arrange annual maintenance contracts (AMC) for models in ${city}?`,
			answer: `Yes, periodic AMC visits can be coordinated for major developer sales lounges across ${city} to ensure the model remains in pristine, showroom-ready condition throughout the sales cycle.`,
		},
		{
			question: `Are scale models termite and pest resistant?`,
			answer: `Yes, all base boards use boiling water resistant (BWR) marine plywood treated with anti-termite and anti-fungal chemical preservatives, while the model structures themselves are synthetic acrylic and ABS.`,
		},
		{
			question: `Can scale models be safely displayed near sunny atrium windows in ${city}?`,
			answer: `While automotive paints and cast acrylic have high UV resistance, prolonged exposure to direct desert sun can create greenhouse heat inside acrylic hoods; we advise placing models in indirect light.`,
		},
		{
			question: `What if an LED light strip fails inside a sealed model tower?`,
			answer: `Models are built with concealed under-base access hatches, allowing technicians to slide out and replace internal LED light bars without dismantling the exterior architectural facade.`,
		},
		{
			question: `Can replacement parts (like miniature cars or streetlights) be ordered separately in ${city}?`,
			answer: `Yes, replacement miniature accessories matching the exact scale ratio can be ordered on-demand and delivered directly to your ${city} site.`,
		},

		// CATEGORY G: Industry Impact & Compliance (91–100)
		{
			question: `Why are physical scale models essential for RERA compliance in ${city}?`,
			answer: `Under Real Estate Regulatory Authority (RERA) norms, buyers require transparent, unambiguous physical visualization of project layouts, open space percentages, fire access roads, and amenity locations, making physical models a vital trust-building asset in ${city}.`,
		},
		{
			question: `How do architectural scale models accelerate real estate sales conversion rates?`,
			answer: `Industry studies demonstrate that prospective property buyers spend 3× more time engaging with a tactile 3D physical model than with 2D floor plans or screens, leading to faster emotional connection and higher booking conversions.`,
		},
		{
			question: `Do government urban development authorities in ${state} use scale models for public hearings?`,
			answer: `Yes, regional development authorities, municipal corporations, and smart city mission boards use physical scale models to present master plans, transit hubs, and redevelopment schemes during public consultations.`,
		},
		{
			question: `Are scale models used for VIP investor presentations and board meetings in ${city}?`,
			answer: `Yes, physical models create an authoritative tactile centerpiece in corporate boardrooms and investor summits, communicating project scale, grandeur, and architectural vision that virtual renders cannot match.`,
		},
		{
			question: `How do engineering contractors use industrial scale models in ${city}?`,
			answer: `EPC contractors and plant engineers utilize 1:50 and 1:100 scale models to conduct constructability reviews, evaluate crane lifting clearances, train plant operators, and inspect maintenance access routes.`,
		},
		{
			question: `Can scale models be donated to architecture institutions in ${city} after project completion?`,
			answer: `Yes, many developers in ${city} donate finished models to architecture colleges and technical museums as educational case studies, receiving CSR and institutional goodwill in return.`,
		},
		{
			question: `How does Vistar Models ensure fair and transparent pricing across ${city}?`,
			answer: `By establishing clear technical fabrication specifications and comparing multiple vetted manufacturing partners, we eliminate arbitrary pricing and ensure developers receive maximum value.`,
		},
		{
			question: `Can scale models incorporate environmentally sustainable or recycled materials?`,
			answer: `Yes, eco-friendly models utilizing FSC-certified timber, recycled acrylic sheets, biodegradable PLA resins, and solar-powered micro-LED arrays can be sourced for green building (IGBC/LEED) projects in ${city}.`,
		},
		{
			question: `What documentation is provided upon handover of a completed scale model in ${city}?`,
			answer: `Clients receive a comprehensive Handover Dossier including wiring diagrams, lighting control manuals, spare parts lists, cleaning guidelines, warranty certificates, and MSME invoices.`,
		},
		{
			question: `How does a developer in ${city} get started with Vistar Models today?`,
			answer: `Simply contact our ${city} unit at +91 83028 06913, email your CAD drawings to vistarmodels@gmail.com, or fill out our online inquiry form on vistarmodels.com to receive a detailed scoping review within 24 hours.`,
		},
	];
}
