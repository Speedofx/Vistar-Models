/**
 * Blog articles for Vistar Models. Each article answers a real question
 * prospective clients and model-making partners ask, written to be the most
 * useful answer available — so answer engines and search engines surface this
 * site rather than a competitor's.
 *
 * Every article is honest about Vistar being a sourcing consultancy, not a
 * manufacturer, and never guarantees a match, quality, price or delivery.
 */

export type BlogPost = {
	slug: string;
	title: string;
	excerpt: string;
	category: string;
	author: string;
	publishedAt: string;
	updatedAt: string;
	readMinutes: number;
	cover: string;
	/** One-line answer used for the FAQ-style summary and AEO. */
	tlDr: string;
	/** Sectioned body. Each section is an h2 + paragraphs/lists. */
	sections: { heading: string; body: string[] }[];
	/** Related internal links. */
	related: { label: string; path: string }[];
};

export const blogPosts: BlogPost[] = [
	{
		slug: 'how-to-choose-an-architectural-model-maker',
		title: 'How to Choose an Architectural Model Maker in India',
		excerpt:
			'A practical guide to evaluating architectural scale-model makers — what to prepare, what to ask, and how to match a maker’s capability to your presentation purpose.',
		category: 'Sourcing guides',
		author: 'Yogendra Yogi',
		publishedAt: '2026-10-12T09:00:00.000Z',
		updatedAt: '2026-10-12T09:00:00.000Z',
		readMinutes: 7,
		cover: 'architectural',
		tlDr:
			'Choose an architectural model maker by matching their materials, detailing and presentation experience to your purpose — sales gallery, design review or planning — and by preparing clear drawings, scale and finish expectations before you ask for a quotation.',
		sections: [
			{
				heading: 'Start with the purpose, not the maker',
				body: [
					'An architectural model can serve very different purposes: selling apartments off-plan, communicating a design to a review committee, or explaining a master plan to stakeholders. Each purpose rewards different choices of scale, material, detail and finish.',
					'A sales-gallery model usually prioritises finish, lighting and emotional impact. A design-review model may need accurate massing and context. A planning model may need to show relationships between buildings, roads and open space at a legible scale.',
					'Before approaching any maker, write down the single most important thing the model must communicate. That sentence shapes every later decision.',
				],
			},
			{
				heading: 'Prepare the information a maker actually needs',
				body: [
					'A useful quotation brief helps a maker price accurately and reduces back-and-forth. Gather:',
					'Building plans, elevations and any reference renders.',
					'The presentation purpose and audience.',
					'The intended scale and overall footprint.',
					'Facade finish, landscape detail and lighting expectations.',
					'The required date and destination for delivery.',
					'Share only material you are authorised to disclose. If drawings are confidential, discuss confidentiality before sending them.',
				],
			},
			{
				heading: 'Evaluate capability, not just a category label',
				body: [
					'“Architectural model maker” is a broad label. Look for evidence of experience with the specific challenges your project presents: facade materials, clean assembly, landscape treatment, presentation bases and transport of large models.',
					'Ask how the maker preserves legibility at your chosen scale, how the base will be transported, and how it will be installed at the destination. Large footprints often require modular construction.',
					'Request relevant examples and assess suitability yourself. A maker’s previous work is a better signal than a category description.',
				],
			},
			{
				heading: 'Compare proposals on the same scope',
				body: [
					'Ask every maker to state inclusions, exclusions, assumptions, material choices, base and enclosure details, transport, installation, maintenance and delivery terms. Without a shared scope, prices are not comparable.',
					'Clarify which elements are bespoke and which are represented schematically. Window treatments, finish expectations and viewing angles all change the work involved.',
				],
			},
			{
				heading: 'How Vistar Models helps',
				body: [
					'Vistar Models is a sourcing consultancy, not a manufacturer. We help you clarify the brief, consider potentially suitable architectural model makers, and facilitate introductions where relevant capabilities are available.',
					'We do not guarantee a match, quality, price or delivery. The manufacturing agreement — scope, price, production, payment and delivery — is made directly between you and the maker you choose.',
					'Start by sharing your requirement and we will consider which capabilities may be relevant.',
				],
			},
		],
		related: [
			{ label: 'Architectural Models category', path: '/architectural-makers' },
			{ label: 'Prepare a quotation brief', path: '/how-it-works' },
			{ label: 'Submit your requirement', path: '/find-a-model-maker' },
		],
	},
	{
		slug: 'prepare-a-useful-quotation-brief-for-a-scale-model',
		title: 'How to Prepare a Useful Quotation Brief for a Scale Model',
		excerpt:
			'The information a model maker needs to quote accurately — purpose, dimensions, scale, finish, lighting, timeline and budget — explained clearly for first-time clients.',
		category: 'Sourcing guides',
		author: 'Yogendra Yogi',
		publishedAt: '2026-10-10T09:00:00.000Z',
		updatedAt: '2026-10-10T09:00:00.000Z',
		readMinutes: 6,
		cover: 'villa',
		tlDr:
			'A useful quotation brief states the audience and purpose, category, overall dimensions, scale, drawings, finish expectations, lighting or moving features, budget, destination and required date — so makers can price the same scope and you can compare proposals fairly.',
		sections: [
			{
				heading: 'Why the brief matters more than the price',
				body: [
					'A model maker can only quote accurately against a clear scope. A vague brief produces vague prices, hidden assumptions and disappointment later. The goal of a brief is to let every maker price the same thing — so you can compare like with like.',
					'You do not need every detail finalised before enquiring. An early-stage brief is welcome. But the more specific you can be, the more useful the responses will be.',
				],
			},
			{
				heading: 'The essential information to include',
				body: [
					'Purpose and audience: what the model must communicate and who will view it.',
					'Category: architectural, township, industrial, interior, exhibition, engineering, working demonstration, or 3D-printed components.',
					'Overall dimensions and footprint.',
					'Scale, if known — if not, the maker can advise based on the purpose.',
					'Drawings, elevations and reference renders you are authorised to share.',
					'Finish expectations: facade materials, landscape, signage.',
					'Lighting or moving features, if any.',
					'Budget range, even approximate.',
					'Destination and required date, including any installation needs.',
				],
			},
			{
				heading: 'Decisions that change the price',
				body: [
					'Several choices have a large effect on cost and timeline:',
					'Scale: a larger scale shows more detail but takes more time and material.',
					'Detail level: conceptual, presentation detail, or detailed technical.',
					'Cutaway or open sides: removable roofs and walls add fabrication work.',
					'Lighting: integrated lighting increases complexity and cost.',
					'Moving or working features: mechanisms change the sourcing needs entirely.',
					'Base and enclosure: protective covers, transport crates and modular bases.',
					'State these explicitly so makers do not assume them differently.',
				],
			},
			{
				heading: 'What to ask makers to state in return',
				body: [
					'When proposals arrive, ask each maker to state inclusions, exclusions, assumptions, material choices, base and enclosure details, transport, installation, maintenance and delivery terms.',
					'Request relevant examples. Assess suitability yourself. Vistar Models does not verify or approve makers — that judgement is yours.',
				],
			},
			{
				heading: 'Agree before making',
				body: [
					'Before production begins, record the final scope, milestones, change process, acceptance criteria, payment schedule and delivery arrangements directly with the selected maker.',
					'Any Vistar quotation coordination or project coordination is separately agreed. Submitting a form does not place an order or create a payment obligation.',
				],
			},
		],
		related: [
			{ label: 'How it works', path: '/how-it-works' },
			{ label: 'Consultancy services', path: '/services' },
			{ label: 'Submit your requirement', path: '/find-a-model-maker' },
		],
	},
	{
		slug: 'matching-a-model-maker-to-project-capabilities',
		title: 'Matching a Model Maker to Your Project’s Capabilities',
		excerpt:
			'Why model size alone does not define the right maker — and how materials, complexity, finish, working features and capacity all shape a better sourcing decision.',
		category: 'Sourcing guides',
		author: 'Yogendra Yogi',
		publishedAt: '2026-10-08T09:00:00.000Z',
		updatedAt: '2026-10-08T09:00:00.000Z',
		readMinutes: 6,
		cover: 'working',
		tlDr:
			'The right model maker is matched on materials, complexity, detailing, finish, lighting or moving features, budget, timeline, capacity and location — not on size or a category label alone.',
		sections: [
			{
				heading: 'Size is not the whole picture',
				body: [
					'It is tempting to choose a maker by the size of model they have built before. But two models of the same footprint can demand very different skills: one a clean, monochrome massing study; the other a fully detailed, lit, cutaway presentation piece.',
					'Capability-based matching looks at the full set of demands a project places on a maker, then considers who has relevant experience against each.',
				],
			},
			{
				heading: 'The factors that define a match',
				body: [
					'Dimensions and scale: what physical size and level of detail are required.',
					'Complexity and detailing: conceptual, presentation, or detailed technical.',
					'Materials and finish: facade materials, landscape, signage, paint and texture.',
					'Lighting and moving features: integrated lighting, mechanisms, removable elements.',
					'Budget and timeline: what is realistic for the required date.',
					'Capacity and location: whether the maker has capacity now and can deliver or install where you need.',
					'A suitable match may not always be available. That is honest, not a failure of the process.',
				],
			},
			{
				heading: 'When one maker is not enough',
				body: [
					'Some projects combine categories — an architectural model with 3D-printed components, or an exhibition model with a working mechanism. In those cases, one specialist may not cover everything.',
					'For mixed requirements, it can be appropriate to work with several specialists rather than force one maker to stretch beyond their strengths. Vistar helps clarify whether one maker or several may be appropriate.',
				],
			},
			{
				heading: 'What Vistar does and does not do',
				body: [
					'Vistar Models considers potentially relevant capabilities and availability, and facilitates introductions where relevant capabilities exist. We do not manufacture, and we do not guarantee a match, quality, price, delivery or maker performance.',
					'Network participation is not a verification or performance guarantee. Clients should conduct their own due diligence before appointing a maker.',
				],
			},
		],
		related: [
			{ label: 'Capability-based matching', path: '/find-a-model-maker' },
			{ label: 'Model categories', path: '/categories' },
			{ label: 'How it works', path: '/how-it-works' },
		],
	},
	{
		slug: 'types-of-scale-models-and-their-uses',
		title: 'Types of Scale Models and What Each Is Used For',
		excerpt:
			'Architectural, township, industrial, interior, exhibition, engineering, working and 3D-printed models — what each type communicates and when to choose it.',
		category: 'Model types',
		author: 'Yogendra Yogi',
		publishedAt: '2026-10-06T09:00:00.000Z',
		updatedAt: '2026-10-06T09:00:00.000Z',
		readMinutes: 8,
		cover: 'township',
		tlDr:
			'Scale models fall into broad types — architectural, township, industrial, interior, exhibition, engineering, working demonstration and 3D-printed components — each suited to a different communication purpose, audience and level of detail.',
		sections: [
			{
				heading: 'Architectural models',
				body: [
					'Architectural models translate building form, facade detail and context into a physical presentation. They are used for design review, sales galleries, planning submissions and stakeholder communication.',
					'A sales-gallery model may need different detailing from a design-review model. Clarify the purpose before choosing the scale and finish.',
				],
			},
			{
				heading: 'Township and master-plan models',
				body: [
					'Large-scale developments need a clear relationship between buildings, roads and open spaces. These models show phasing, block identification and landscape priorities.',
					'Large footprints often require modular construction. Ask how the maker preserves legibility at the chosen scale, transports the base and installs it at the destination.',
				],
			},
			{
				heading: 'Industrial plant and factory models',
				body: [
					'These models explain facilities, production areas and plant relationships. They may need to show equipment layouts, pipe networks and process zones, with some systems visible or removable.',
					'Clarify whether the goal is spatial communication or a detailed technical demonstration, and what confidentiality requirements apply.',
				],
			},
			{
				heading: 'Interior presentation models',
				body: [
					'Cutaway spaces make room layouts, materials and furniture relationships tangible. They need small-detail fabrication and practical viewing access.',
					'Agree which furniture is bespoke, which finishes are represented, and how removable elements such as roofs and walls are handled.',
				],
			},
			{
				heading: 'Exhibition and presentation models',
				body: [
					'Display models serve exhibitions, museums, educational settings and public presentations. They may prioritise clarity and durability over tiny detail.',
					'Ask about protective enclosures, assembly, maintenance and repeated transport, especially for venue-specific displays.',
				],
			},
			{
				heading: 'Engineering and infrastructure models',
				body: [
					'Bridges, transport networks and infrastructure concepts become easier to understand as physical models. They can be static, cutaway or technical demonstrations.',
					'Clarify whether the model is explanatory or needs functional behaviour. Defence and technical requirements should use only material you are authorised to share.',
				],
			},
			{
				heading: 'Working and demonstration models',
				body: [
					'Moving and functional models demonstrate mechanisms and processes for technical explanation, teaching and demonstration. Moving features change sourcing needs.',
					'Discuss mechanism design, safe operation, access for servicing and acceptance testing directly with the proposed maker.',
				],
			},
			{
				heading: '3D printing and components',
				body: [
					'Specialist components and custom elements can support a wider fabrication scope. A printed component is not always a finished model — clarify file preparation, support removal, surface finishing, fitting and assembly responsibilities.',
				],
			},
			{
				heading: 'How Vistar helps you choose',
				body: [
					'Vistar Models helps clients explore the right category for their purpose and considers potentially suitable makers. We do not manufacture these models. Explore the full set of categories we help source, then share your requirement.',
				],
			},
		],
		related: [
			{ label: 'All model categories', path: '/categories' },
			{ label: 'Matching a maker to capabilities', path: '/blog/matching-a-model-maker-to-project-capabilities' },
			{ label: 'Submit your requirement', path: '/find-a-model-maker' },
		],
	},
	{
		slug: 'scale-model-timelines-and-budget-considerations',
		title: 'Scale Model Timelines and Budget Considerations',
		excerpt:
			'What affects how long a scale model takes and what it costs — and how to set realistic expectations for timeline, budget and scope before you approach a maker.',
		category: 'Planning',
		author: 'Yogendra Yogi',
		publishedAt: '2026-10-04T09:00:00.000Z',
		updatedAt: '2026-10-04T09:00:00.000Z',
		readMinutes: 6,
		cover: 'industrial',
		tlDr:
			'Scale model timelines and budgets depend on detail level, scale, materials, lighting, moving features, base and enclosure, transport and the maker’s current capacity. Set a realistic required date and budget range early, and agree scope before production begins.',
		sections: [
			{
				heading: 'What drives the timeline',
				body: [
					'A model’s production time depends on several factors, most of which you can influence through the brief:',
					'Detail level: detailed technical models take longer than conceptual massing studies.',
					'Scale: larger scales show more detail but require more fabrication time.',
					'Materials and finish: bespoke finishes and facade materials add steps.',
					'Lighting and moving features: integrated systems add design and assembly time.',
					'Base, enclosure and transport: modular bases and protective crates take additional work.',
					'The maker’s current capacity: even a capable maker may be booked. A suitable match may not always be available.',
				],
			},
			{
				heading: 'What drives the budget',
				body: [
					'The same factors drive cost. There is no universal price for “a scale model” because the scope varies so widely. Makers set their own prices, assumptions and commercial terms.',
					'Stating an approximate budget range — even a wide one — helps a maker propose a realistic scope rather than a maximum-specification quote.',
				],
			},
			{
				heading: 'Set expectations early',
				body: [
					'Share your required date and budget range as early as possible. If the date is fixed by an exhibition or presentation, say so. If the budget is constrained, a maker can suggest where to reduce detail without losing the model’s purpose.',
					'Be honest about what is essential and what is flexible. That honesty produces more useful proposals.',
				],
			},
			{
				heading: 'Agree scope before production',
				body: [
					'Before any making begins, record the final scope, milestones, change process, acceptance criteria, payment schedule and delivery terms directly with the maker. Changes after production starts are usually more expensive than decisions made in the brief.',
					'Any Vistar quotation coordination or project coordination is separately agreed. Submitting a form does not place an order or create a payment obligation.',
				],
			},
			{
				heading: 'What Vistar does not promise',
				body: [
					'Vistar Models does not guarantee a match, quality, price, delivery date or maker performance. We help clarify the scope and consider potentially suitable makers. The commercial agreement is between you and the maker.',
				],
			},
		],
		related: [
			{ label: 'Prepare a quotation brief', path: '/blog/prepare-a-useful-quotation-brief-for-a-scale-model' },
			{ label: 'How it works', path: '/how-it-works' },
			{ label: 'Submit your requirement', path: '/find-a-model-maker' },
		],
	},
	{
		slug: 'what-does-a-scale-model-sourcing-consultancy-do',
		title: 'What Does a Scale Model Sourcing Consultancy Do?',
		excerpt:
			'A clear explanation of what a sourcing consultancy like Vistar Models does — and does not do — when helping clients find a suitable scale-model maker in India.',
		category: 'About Vistar',
		author: 'Yogendra Yogi',
		publishedAt: '2026-10-02T09:00:00.000Z',
		updatedAt: '2026-10-02T09:00:00.000Z',
		readMinutes: 5,
		cover: 'printing',
		tlDr:
			'A scale-model sourcing consultancy helps clients clarify their requirement, identify potentially suitable makers and facilitate introductions. It does not manufacture models, set prices, or guarantee a match, quality or delivery.',
		sections: [
			{
				heading: 'The problem a consultancy solves',
				body: [
					'Finding the right scale-model maker is harder than it looks. “Model maker” is a broad label, and different projects need different expertise — architectural presentation, industrial layout, working mechanism, exhibition display. Choosing on category alone often leads to a poor match.',
					'A sourcing consultancy brings structure to that search: understand the requirement, consider relevant capabilities, and connect the client with potentially suitable makers.',
				],
			},
			{
				heading: 'What Vistar Models does',
				body: [
					'Requirement consultation: discussing the purpose, audience and expected model format to establish a practical sourcing brief.',
					'Manufacturer identification: looking for potentially relevant model-making businesses and specialist fabrication partners.',
					'Capability-based matching: considering category experience, materials, detailing, model size, working features and capacity against the brief.',
					'Technical scope clarification: organising dimensions, scale, finishes, lighting, drawings and delivery expectations.',
					'Quotation coordination: where separately agreed, facilitating quotation discussions. Makers set their own prices and terms.',
					'Introductions: facilitating contact where relevant capabilities are available.',
				],
			},
			{
				heading: 'What Vistar Models does not do',
				body: [
					'Vistar does not manufacture scale models. It does not operate a workshop. It does not guarantee a match, quality, price, delivery or maker performance.',
					'It does not independently verify or approve makers. Applications are reviewed for potential relevance; clients should conduct their own due diligence before appointing a maker.',
					'The manufacturing agreement — scope, price, production, payment and delivery — is made directly between the client and the maker.',
				],
			},
			{
				heading: 'Why this structure helps',
				body: [
					'A consultancy has no incentive to push one maker over another. Its value is in clarifying the brief and considering a wider set of capabilities than a client may find alone. That produces more relevant conversations, even when a match is not guaranteed.',
					'If you have a scale-model requirement in India, start by sharing what the model needs to communicate. Vistar will consider which capabilities may be relevant.',
				],
			},
		],
		related: [
			{ label: 'About Vistar Models', path: '/about' },
			{ label: 'Consultancy services', path: '/services' },
			{ label: 'How it works', path: '/how-it-works' },
		],
	},
];

export const blogPostBySlug = (slug?: string): BlogPost | undefined =>
	slug ? blogPosts.find(post => post.slug === slug) : undefined;
