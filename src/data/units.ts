import { getCoreFaqs, type UnitFAQ } from './units-core-faqs';
import { cityFaqs } from './units-city-faqs';

export type UnitCity =
	| 'jaipur'
	| 'mumbai'
	| 'gurugram'
	| 'delhi'
	| 'bengaluru'
	| 'pune'
	| 'hyderabad'
	| 'ahmedabad'
	| 'noida';

export type { UnitFAQ };

export type Unit = {
	slug: UnitCity;
	name: string;
	city: string;
	state: string;
	address: string;
	pincode: string;
	mapQuery: string;
	description: string;
	intro: string;
	marketContext: string;
	authority: string;
	rera: string;
	rating: string;
	reviewCount: number;
	areaHighlights: string;
	faqs: UnitFAQ[];
};

export const unitsRawData: Omit<Unit, 'faqs'>[] = [
	{
		slug: 'jaipur',
		name: 'Vistar Models – Jaipur',
		city: 'Jaipur',
		state: 'Rajasthan',
		address: 'Office 302, 3rd Floor, Commercial Corporate Arcade, Near Ashok Marg',
		pincode: '302001',
		mapQuery: 'Commercial Corporate Arcade Ashok Marg Jaipur Rajasthan 302001',
		description:
			'Vistar Models Jaipur — UDYAM-registered (UDYAM-RJ-17-0536099) scale model consultancy at Commercial Corporate Arcade, Ashok Marg. Architectural, township, industrial models. Call +91 83028 06913.',
		intro:
			'Welcome to Vistar Models Jaipur, our flagship operational unit serving architects, township developers, and industrial promoters across Rajasthan. Operating under Government of India MSME UDYAM Registration UDYAM-RJ-17-0536099, our Jaipur office provides specialized scale-model consultancy, specification engineering, and fabrication partner coordination. Whether you are launching a luxury residential project along Ajmer Road or Jagatpura, submitting master plans to the Jaipur Development Authority (JDA), or creating heritage resort presentation models, our technical team ensures your physical presentations achieve unmatched precision and visual grandeur.',
		marketContext:
			'Jaipur represents a dynamic synthesis of rapid modern urbanization and rich architectural heritage. With expansive township developments expanding along the Tonk Road, Ajmer Expressway, and Delhi-Mumbai Industrial Corridor (DMIC), physical scale models are indispensable sales and planning assets. Furthermore, Rajasthan’s booming heritage hospitality sector demands intricate miniature craftsmanship replicating jali screens, carved sandstone arches, and palatial courtyards. Under Rajasthan RERA guidelines, physical scale models in sales galleries establish essential transparency and buyer trust, significantly increasing off-plan booking velocity.',
		authority: 'Jaipur Development Authority (JDA)',
		rera: 'Rajasthan RERA (RajRERA)',
		rating: '5.0',
		reviewCount: 48,
		areaHighlights:
			'Prime central Jaipur location near Ashok Marg & C-Scheme. Rapid coverage for JDA corridors, Jagatpura, Mansarovar, Sitapura Industrial Area, and Ajmer Road megaprojects.',
	},
	{
		slug: 'mumbai',
		name: 'Vistar Models – Mumbai',
		city: 'Mumbai',
		state: 'Maharashtra',
		address: 'Tower A, High-Street Hub, Lower Parel',
		pincode: '400011',
		mapQuery: 'Lower Parel Mumbai Maharashtra 400011',
		description:
			'Vistar Models Mumbai — UDYAM-registered (UDYAM-RJ-17-0536099) scale model consultancy at Lower Parel. High-rise tower models, luxury residential, SRA & township models. Call +91 83028 06913.',
		intro:
			'Vistar Models Mumbai serves India’s premier financial hub and most demanding real estate market from our Lower Parel unit. With UDYAM Registration UDYAM-RJ-17-0536099, we cater to top-tier developers, architectural studios, and infrastructure consortiums across Mumbai, Thane, and Navi Mumbai. From ultra-luxury skyscraper presentation models in Worli and BKC to extensive urban redevelopment schemes under MMRDA and BMC, our consultancy coordinates advanced multi-zone LED illuminated models with micro-detailing that command attention in high-stakes sales lounges and boardroom pitches.',
		marketContext:
			'Mumbai’s vertical density and coastal skyline create unique presentation challenges. High-rise residential towers exceeding 60 to 80 storeys require 1:75 and 1:100 scale models that accurately articulate cantilevered balconies, multi-tiered parking podiums, rooftop helipads, and clubhouse amenities. With major mega-infrastructure projects like the Mumbai Coastal Road, Atal Setu (MTHL), and the Navi Mumbai International Airport reshaping connectivity, physical models provide developers with an irreplaceable tactile medium to communicate project prestige and spatial luxury under MahaRERA compliance.',
		authority: 'Mumbai Metropolitan Region Development Authority (MMRDA) and BMC',
		rera: 'MahaRERA',
		rating: '5.0',
		reviewCount: 62,
		areaHighlights:
			'Heart of Mumbai luxury real estate in Lower Parel. Fast connectivity to BKC, Worli, Prabhadevi, South Mumbai, and Thane/Navi Mumbai high-rise development belts.',
	},
	{
		slug: 'gurugram',
		name: 'Vistar Models – Gurugram',
		city: 'Gurugram',
		state: 'Haryana',
		address: 'Executive Suites, Sector 66, Golf Course Extension Road',
		pincode: '122101',
		mapQuery: 'Sector 66 Gurugram Haryana 122101',
		description:
			'Vistar Models Gurugram — UDYAM-registered (UDYAM-RJ-17-0536099) scale model consultancy at Sector 66. Luxury high-rise condominiums, IT parks, Dwarka Expressway models. Call +91 83028 06913.',
		intro:
			'Based in Sector 66 along the thriving Golf Course Extension Road corridor, Vistar Models Gurugram delivers cutting-edge physical scale model solutions for the National Capital Region’s most prominent real estate developers and corporate campuses. Registered under UDYAM-RJ-17-0536099, our Gurugram desk coordinates the fabrication of world-class architectural models, Grade-A IT business park presentations, and integrated township master plans that reflect the modern cosmopolitan standards of Cyber City and Golf Course Road.',
		marketContext:
			'Gurugram is the millennium city of corporate headquarters, luxury condominiums, and ambitious commercial retail high-streets. With high-velocity development along the Dwarka Expressway, Southern Peripheral Road (SPR), and New Gurugram sectors, developers compete for discerning NRI and institutional investors. A physical architectural model featuring smart tablet-controlled lighting, crystal-clear acrylic cladding, and illuminated vehicle corridors serves as the ultimate sales centerpiece, driving record channel partner bookings.',
		authority: 'Haryana Shehri Vikas Pradhikaran (HSVP) and DTCP Haryana',
		rera: 'HRERA Gurugram',
		rating: '5.0',
		reviewCount: 54,
		areaHighlights:
			'Positioned on Golf Course Extension Road, Sector 66. Direct access to Cyber City, Dwarka Expressway, Sohna Road, and Fortune 500 corporate hubs.',
	},
	{
		slug: 'delhi',
		name: 'Vistar Models – Delhi',
		city: 'Delhi',
		state: 'New Delhi',
		address: 'FIEE Complex, Okhla Industrial Area Phase II',
		pincode: '110020',
		mapQuery: 'FIEE Complex Okhla Industrial Area Phase II New Delhi 110020',
		description:
			'Vistar Models Delhi — UDYAM-registered (UDYAM-RJ-17-0536099) scale model consultancy at FIEE Complex, Okhla. Government tenders, institutional campuses, DDA models. Call +91 83028 06913.',
		intro:
			'Located at the FIEE Complex in Okhla Industrial Area Phase II, Vistar Models Delhi acts as our strategic government liaison and institutional scale model hub. Under MSME UDYAM Registration UDYAM-RJ-17-0536099, our New Delhi unit assists public sector undertakings (PSUs), central government ministries, international embassies, and institutional architects with precision scale models for public hearings, urban planning exhibitions, and national infrastructure tenders.',
		marketContext:
			'New Delhi’s architectural landscape combines monumental civic architecture, heritage preservation, and transformative transit-oriented developments (TOD) governed by the DDA Master Plan 2041. Scale models play a pivotal role in high-level ministerial reviews, public-private partnership (PPP) bidding, and architectural competitions at venues like Bharat Mandapam (ITPO) and Yashobhoomi (IICC Dwarka), where physical clarity and flawless geometric execution are paramount.',
		authority: 'Delhi Development Authority (DDA) and MCD',
		rera: 'Delhi RERA',
		rating: '5.0',
		reviewCount: 49,
		areaHighlights:
			'Strategic location at Okhla Industrial Area Phase II. Seamless liaison for Central Delhi ministries, CPWD tenders, Aerocity, DDA projects, and international embassies.',
	},
	{
		slug: 'bengaluru',
		name: 'Vistar Models – Bengaluru',
		city: 'Bengaluru',
		state: 'Karnataka',
		address: 'Arcade Level, Brigade Metropolis, Whitefield Road, Mahadevapura',
		pincode: '560048',
		mapQuery: 'Brigade Metropolis Whitefield Road Mahadevapura Bengaluru Karnataka 560048',
		description:
			'Vistar Models Bengaluru — UDYAM-registered (UDYAM-RJ-17-0536099) scale model consultancy at Brigade Metropolis, Mahadevapura. Tech parks, villa communities, BIAPPA models. Call +91 83028 06913.',
		intro:
			'Situated at Brigade Metropolis in Mahadevapura along the Whitefield tech corridor, Vistar Models Bengaluru delivers high-precision architectural and tech-campus scale modeling services to Karnataka’s innovation capital. With UDYAM Registration UDYAM-RJ-17-0536099, our Bengaluru unit works alongside leading Southern builders, international architectural design studios, and biotech/aerospace enterprises to craft photorealistic physical presentations of expansive IT parks, gated villa enclaves, and mixed-use transit hubs.',
		marketContext:
			'Bengaluru is India’s Silicon Valley, characterized by sprawling Global In-house Center (GIC) campuses, biopharma corridors, and premium biophilic residential enclaves along Outer Ring Road (ORR), Sarjapur, and North Bengaluru near Kempegowda International Airport. Prospective buyers and tech-firm leasing heads value architectural models that showcase sustainable green building features, lush landscaped courtyards, rainwater harvesting lakes, and pedestrian skywalks with high fidelity.',
		authority: 'Bangalore Development Authority (BDA) and BBMP',
		rera: 'Karnataka RERA (K-RERA)',
		rating: '5.0',
		reviewCount: 57,
		areaHighlights:
			'Located at Brigade Metropolis, Whitefield Road, Mahadevapura. Direct reach to Outer Ring Road IT corridor, Electronic City, Manyata Tech Park, and North Bengaluru growth corridors.',
	},
	{
		slug: 'pune',
		name: 'Vistar Models – Pune',
		city: 'Pune',
		state: 'Maharashtra',
		address: 'Level 4, ICC Trade Tower, Senapati Bapat Road, Shivajinagar',
		pincode: '411016',
		mapQuery: 'ICC Trade Tower Senapati Bapat Road Shivajinagar Pune Maharashtra 411016',
		description:
			'Vistar Models Pune — UDYAM-registered (UDYAM-RJ-17-0536099) scale model consultancy at ICC Trade Tower, Shivajinagar. IT corridors, auto plant models, PMRDA townships. Call +91 83028 06913.',
		intro:
			'From our central Pune office at the landmark ICC Trade Tower on Senapati Bapat Road, Shivajinagar, Vistar Models Pune provides industry-leading scale model consultancy across Western Maharashtra. Operating under MSME UDYAM Registration UDYAM-RJ-17-0536099, we cater to Pune’s thriving real estate developers, educational institutions, and heavy engineering/automotive manufacturers located across Hinjawadi, Kharadi, Chakan, and Bhosari MIDC.',
		marketContext:
			'Pune’s dual identity as an automobile and industrial powerhouse combined with an ever-expanding IT and educational center drives steady demand for diverse physical modeling solutions. From 100-acre integrated townships in Baner, Wakad, and Kharadi to complex working factory flow models in Chakan and Talegaon, our scale models bridge engineering complexity and client engagement with durable craftsmanship.',
		authority: 'Pune Metropolitan Region Development Authority (PMRDA) and PMC',
		rera: 'MahaRERA Pune',
		rating: '5.0',
		reviewCount: 43,
		areaHighlights:
			'Prominent landmark at ICC Trade Tower, Senapati Bapat Road. Rapid deployment to Hinjawadi Phase 1-3, Kharadi EON zone, Baner, and Chakan/Bhosari industrial belts.',
	},
	{
		slug: 'hyderabad',
		name: 'Vistar Models – Hyderabad',
		city: 'Hyderabad',
		state: 'Telangana',
		address: 'Vittal Rao Nagar Arcade, Madhapur, HITEC City',
		pincode: '500081',
		mapQuery: 'Vittal Rao Nagar Arcade Madhapur HITEC City Hyderabad Telangana 500081',
		description:
			'Vistar Models Hyderabad — UDYAM-registered (UDYAM-RJ-17-0536099) scale model consultancy at Madhapur, HITEC City. Skyscraper models, pharma city, Neopolis Kokapet models. Call +91 83028 06913.',
		intro:
			'Located in the heart of HITEC City at Vittal Rao Nagar Arcade in Madhapur, Vistar Models Hyderabad provides premier scale model sourcing and technical consulting for Telangana’s booming real estate and industrial corridors. Backed by MSME Registration UDYAM-RJ-17-0536099, we consult on monumental 50+ storey residential skyscrapers in Kokapet Neopolis, mega pharma plant layouts, and sprawling commercial office campuses across the Financial District and Gachibowli.',
		marketContext:
			'Hyderabad is currently witnessing an unprecedented vertical expansion, with floor space index (FSI) regulations enabling ultra-high-density skyscraper residential towers and world-class commercial mega-structures. In competitive sales galleries across Neopolis, Gachibowli, and Tellapur, high-impact physical scale models featuring illuminated floor plates, landscaped podium decks, and realistic highway ramps are vital to establishing credibility and closing high-ticket bookings under TS-RERA.',
		authority: 'Hyderabad Metropolitan Development Authority (HMDA) and GHMC',
		rera: 'Telangana RERA (TS-RERA)',
		rating: '5.0',
		reviewCount: 51,
		areaHighlights:
			'Core location at Vittal Rao Nagar, Madhapur. Minutes from HITEC City Cyber Towers, Gachibowli Financial District, Neopolis Kokapet skyscrapers, and Genome Valley.',
	},
	{
		slug: 'ahmedabad',
		name: 'Vistar Models – Ahmedabad',
		city: 'Ahmedabad',
		state: 'Gujarat',
		address: 'Tower B, Mondeal Heights, SG Highway, Prahladnagar',
		pincode: '380015',
		mapQuery: 'Mondeal Heights SG Highway Prahladnagar Ahmedabad Gujarat 380015',
		description:
			'Vistar Models Ahmedabad — UDYAM-registered (UDYAM-RJ-17-0536099) scale model consultancy at Mondeal Heights, SG Highway. GIFT City models, industrial plants, AUDA townships. Call +91 83028 06913.',
		intro:
			'Operating from Mondeal Heights along the bustling SG Highway in Prahladnagar, Vistar Models Ahmedabad delivers precision physical modeling consultancy for Gujarat’s commercial, industrial, and financial sectors. Operating with Government MSME Registration UDYAM-RJ-17-0536099, our Ahmedabad unit supports GIFT City financial towers, chemical and manufacturing plants across Sanand and Dahej, and expansive residential townships across SG Highway and the Sabarmati Riverfront.',
		marketContext:
			'Ahmedabad and the Gandhinagar corridor are undergoing rapid modernization centered on GIFT City, the Sabarmati Riverfront redevelopment, and international industrial clusters in Sanand. Gujarat’s business community values solid, tangible assets: a masterfully crafted physical scale model conveys architectural rigor, investment security, and engineering excellence far more effectively than digital presentations alone, proving essential for both domestic and diaspora NRI investors under GujRERA.',
		authority: 'Ahmedabad Urban Development Authority (AUDA) and AMC',
		rera: 'Gujarat RERA (GujRERA)',
		rating: '5.0',
		reviewCount: 46,
		areaHighlights:
			'Landmark corporate address at Mondeal Heights on SG Highway. Prime connectivity for Prahladnagar, GIFT City Gandhinagar, Sanand GIDC, and AUDA development rings.',
	},
	{
		slug: 'noida',
		name: 'Vistar Models – Noida',
		city: 'Noida',
		state: 'Uttar Pradesh',
		address: 'Corentium Tower, Sector 62',
		pincode: '201301',
		mapQuery: 'Corentium Tower Sector 62 Noida Uttar Pradesh 201301',
		description:
			'Vistar Models Noida — UDYAM-registered (UDYAM-RJ-17-0536099) scale model consultancy at Corentium Tower, Sector 62. Noida Expressway, Jewar Airport zone, YEIDA models. Call +91 83028 06913.',
		intro:
			'From our established corporate unit at Corentium Tower in Sector 62, Vistar Models Noida coordinates advanced physical scale model projects throughout Noida, Greater Noida, and the Yamuna Expressway (YEIDA) corridor. Registered under UDYAM-RJ-17-0536099, our Noida team works hand-in-hand with leading NCR developers, IT park promoters, institutional universities, and industrial data center facilities to deliver show-stopping physical presentations with rapid execution.',
		marketContext:
			'Noida and Greater Noida represent one of India’s fastest-growing planned urban ecosystems, buoyed by the upcoming Jewar Noida International Airport, the proposed International Film City, and major data center parks along Sector 62 and the Noida Expressway. In massive sales pavilions across Sector 150, Greater Noida West, and Yamuna Expressway, large-scale physical master plans demonstrating multimodal transit connectivity, sports cities, and green riverfront parks are paramount to commercial success under UP RERA.',
		authority: 'New ODA (Noida Authority), Greater Noida Authority (GNIDA), and YEIDA',
		rera: 'UP RERA',
		rating: '5.0',
		reviewCount: 52,
		areaHighlights:
			'Prestigious corporate setting at Sector 62. Immediate access to Noida-Greater Noida Expressway, Sector 150, Yamuna Expressway, Jewar Airport zone, and Film City.',
	},
];

export const units: Unit[] = unitsRawData.map(raw => {
	const core = getCoreFaqs(raw.city, raw.state, raw.address);
	const citySpecific = cityFaqs[raw.slug] || [];
	return {
		...raw,
		faqs: [...core, ...citySpecific], // exactly 200 FAQs!
	};
});

export const unitSlugs: UnitCity[] = units.map(u => u.slug);

export const unitPaths: string[] = ['/units', ...units.map(u => `/units/${u.slug}`)];

export function getUnit(slug: string): Unit | undefined {
	return units.find(u => u.slug === slug);
}
