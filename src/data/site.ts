/**
 * Single source of truth for every piece of marketing copy on the site.
 *
 * Content is lifted from the live roimakers.in site so the new front end
 * says the same things the business actually says. Pages import from here
 * instead of declaring their own local arrays — that is what keeps the
 * numbers, service names and contact details from drifting apart.
 */

/* ------------------------------------------------------------------ */
/* Company                                                             */
/* ------------------------------------------------------------------ */

export const company = {
  name: "ROI Makers",
  tagline: "ROI First. Always!",
  promise: "Performance marketing built for brands that refuse to be average.",
  founded: 2019,
  city: "Indore",
  phones: ["+91 9009500202", "+91 9669600202"],
  emails: { general: "info@roimakers.in", support: "support@roimakers.in", careers: "hr@roimakers.in" },
  address: "213-B, 18, Trade Centre, South Tukoganj, Indore, Madhya Pradesh 452001",
  addressShort: "Trade Centre, South Tukoganj, Indore",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/roimakers/" },
    { label: "Facebook", href: "https://www.facebook.com/roimakersin" },
    { label: "X", href: "http://x.com/roimakers" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/roimakers/" },
    { label: "YouTube", href: "https://www.youtube.com" },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Numbers                                                             */
/* ------------------------------------------------------------------ */

export type Stat = { value: number; suffix: string; label: string; decimals?: number };

/** The four headline numbers used on the home page and About. */
export const headlineStats: Stat[] = [
  { value: 1200, suffix: "+", label: "Campaigns Executed" },
  { value: 250, suffix: "+", label: "Active Clients" },
  { value: 2.3, suffix: "M+", label: "Leads Generated", decimals: 1 },
  { value: 8600, suffix: "+", label: "Satisfied Customers" },
];

export const trustSignals: Stat[] = [
  { value: 9, suffix: "+", label: "Years in the Trenches" },
  { value: 50, suffix: "+", label: "Verticals Scaled" },
  { value: 98, suffix: "%", label: "Client Retention" },
  { value: 5, suffix: " yrs", label: "Average Partnership" },
];

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export type ServiceCapability = { title: string; description: string };

export type Service = {
  slug: string;
  title: string;
  category: string;
  eyebrow: string;
  headline: string;
  summary: string;
  /** Short line used on grids and the home page. */
  cardCopy: string;
  image: string;
  approach: { title: string; body: string };
  statsTitle: string;
  stats: Stat[];
  statsFooter: string;
  pillars: { title: string; description: string }[];
  reality: { title: string; body: string };
  capabilitiesIntro: string;
  capabilities: ServiceCapability[];
  cta: { title: string; body: string; label: string };
};

export const services: Service[] = [
  {
    slug: "performance-marketing",
    title: "Performance Marketing",
    category: "Performance",
    eyebrow: "Revenue Focused",
    headline: "Performance marketing that pays you back.",
    summary:
      "Campaigns engineered for measurable returns, not applause. Meta Ads, Google Ads, and data-driven growth, built to scale.",
    cardCopy: "Campaigns focused on conversions, profitability, and measurable business growth.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    approach: {
      title: "Most ads buy attention. The goal is revenue.",
      body: "Strong performance marketing starts with understanding buyer intent, platform behaviour, creative direction, and the business objective behind every campaign. Campaigns are continuously tested, refined, and optimised to improve lead quality, reduce wasted spend, and generate measurable business growth. Because impressions alone do not grow brands. Revenue does.",
    },
    statsTitle: "Nine years in. Here is what that actually looks like.",
    stats: [
      { value: 980, suffix: "+", label: "Ad Campaigns Managed" },
      { value: 3.2, suffix: "X", label: "ROAS Delivered", decimals: 1 },
      { value: 65, suffix: "+", label: "Active Brand Partners" },
      { value: 25, suffix: "+", label: "Industries Scaled" },
      { value: 140, suffix: "K+", label: "Leads Generated" },
      { value: 180, suffix: "+", label: "Businesses Grown" },
    ],
    statsFooter: "Every figure represents a real business that needed real growth — and got it.",
    pillars: [
      { title: "Sharp Creative", description: "Ads that stop the scroll without looking like ads." },
      { title: "Precise Targeting", description: "Your audience, at the right moment, on the right platform." },
      { title: "Relentless Optimisation", description: "Because a campaign that isn't improving is quietly dying." },
    ],
    reality: {
      title: "Performance marketing ≠ running ads.",
      body: "Buyers today move across platforms fast, compare brands instantly, and decide within seconds whether your ad deserves attention. Performance marketing now demands far more than simply running campaigns. It is the balance of audience psychology, creative strategy, targeting precision, and continuous optimisation that separates wasted spend from measurable growth.",
    },
    capabilitiesIntro:
      "It starts with auditing the brand, mapping the funnel, and identifying where buyers are dropping off — then building the channel mix that fits.",
    capabilities: [
      {
        title: "Meta Ads — Facebook & Instagram",
        description:
          "We put your offer in front of people who are actually likely to buy, with creative that stops them and targeting that does not bleed. More buyers, less wasted spend.",
      },
      {
        title: "Google Ads",
        description:
          "Your buyers are already searching. We make sure they find you first — with the right keywords, sharp ad copy, and bids that bring in revenue, not just clicks.",
      },
      {
        title: "Performance Creative",
        description:
          "We build ads around what converts, not what looks good. The right hook, the right format, the right message — creative that actually moves the numbers.",
      },
      {
        title: "Conversion Rate Optimisation",
        description:
          "More revenue from the traffic you are already paying for. We fix what is stopping people from converting, without touching your ad budget.",
      },
      {
        title: "Campaign Strategy & Funnel Mapping",
        description:
          "We map the full picture before anything goes live — who the buyer is, where they are, what it takes to move them. So every rupee has a clear job from day one.",
      },
    ],
    cta: {
      title: "Curious where your ad budget actually stands?",
      body: "A free strategy audit covers where your ad spend currently stands, what is working, and where the gaps are. No commitment, no pitch.",
      label: "Get a free strategy audit",
    },
  },
  {
    slug: "search-engine-optimization",
    title: "Search Engine Optimization",
    category: "Performance",
    eyebrow: "Search First",
    headline: "Rank higher. Get found. Grow revenue.",
    summary:
      "SEO and SEM built to put your brand in front of buyers at the exact moment they are looking.",
    cardCopy: "Optimised content that ranks higher and attracts high-intent organic traffic.",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1600&q=80",
    approach: {
      title: "Your website, right where buyers are searching.",
      body: "We approach SEO with a clear focus on search intent, technical strength, content structure, and competitive positioning from day one. Every optimisation is planned around improving visibility, bringing in qualified traffic, and helping the website stay discoverable where actual buying decisions begin. The goal is not just rankings, but long-term search presence that consistently contributes to business growth.",
    },
    statsTitle: "Years of search experience. Measurable across every metric.",
    stats: [
      { value: 20, suffix: "+", label: "Industries Worked Across" },
      { value: 520, suffix: "+", label: "SEO Audits Completed" },
      { value: 180, suffix: "+", label: "Search Campaigns Executed" },
      { value: 85, suffix: "+", label: "Businesses Scaled Through Search" },
      { value: 2.4, suffix: "x", label: "Avg. Organic Traffic Growth", decimals: 1 },
      { value: 250, suffix: "+", label: "Landing Pages Optimised" },
    ],
    statsFooter:
      "Every number represents a brand that needed stronger visibility, better traffic quality, and a search presence built to grow consistently.",
    pillars: [
      { title: "Organic Authority", description: "Built around intent, structure, and authority that search engines trust." },
      { title: "Paid Precision", description: "Campaigns focused on high-intent searches that convert into business." },
      { title: "Next-Gen Visibility", description: "Built for AI answers, voice search, snippets, and zero-click discovery." },
    ],
    reality: {
      title: "Ranking alone is not the goal anymore.",
      body: "Modern search is no longer limited to blue links on Google. Buyers now discover brands through AI Overviews, voice search, featured snippets, shopping feeds, and answer engines before they even visit a website. Our approach is built around making sure your brand stays visible across every layer of how search works today.",
    },
    capabilitiesIntro:
      "We start by understanding your current search presence, identifying visibility gaps, and building a strategy that improves rankings, traffic quality, and search-driven growth across every important platform.",
    capabilities: [
      {
        title: "Technical SEO",
        description:
          "We optimise the technical foundation of your website so search engines can properly crawl, understand, and rank your pages without structural limitations affecting visibility.",
      },
      {
        title: "On-Page SEO",
        description:
          "From content structure and keyword placement to internal linking and intent alignment, every page is optimised to improve discoverability and ranking potential.",
      },
      {
        title: "Off-Page SEO & Link Building",
        description:
          "Authority matters in search. We build credible, high-quality backlinks that strengthen trust, improve rankings, and support long-term domain growth.",
      },
      {
        title: "Local SEO",
        description:
          "We optimise your Google Business Profile, maps visibility, and local search presence so nearby buyers find your business before competitors.",
      },
      {
        title: "Google Search Ads",
        description:
          "Search ads are built around intent-driven keywords, strong copywriting, and smart bidding strategies designed to generate enquiries, leads, and measurable returns.",
      },
      {
        title: "Google Shopping & Performance Max",
        description:
          "For e-commerce brands, we manage shopping campaigns and Performance Max strategies focused on product visibility, feed optimisation, and stronger return on ad spend.",
      },
      {
        title: "Search-Integrated Content",
        description:
          "Every piece of content is planned around actual search demand, ranking opportunities, and buyer intent, so traffic coming in has a higher chance of converting.",
      },
      {
        title: "AEO — Answer Engine Optimisation",
        description:
          "We structure content strategically to improve visibility in featured snippets, People Also Ask sections, and voice search results, where attention gets captured first.",
      },
      {
        title: "GEO — Generative Engine Optimisation",
        description:
          "AI search platforms are already influencing buying decisions. We optimise your brand presence so tools like ChatGPT, Gemini, and Perplexity are more likely to surface your business.",
      },
      {
        title: "AIO — AI Overviews Optimisation",
        description:
          "Google AI Overviews are changing organic visibility rapidly. We optimise content structure and authority signals to improve the chances of your brand appearing within these AI-generated summaries.",
      },
    ],
    cta: {
      title: "Let's see how strong your search presence really is.",
      body: "Get a detailed search audit covering rankings, technical issues, traffic opportunities, competitor gaps, and paid search performance with clear actionable insights.",
      label: "Get a free search audit",
    },
  },
  {
    slug: "social-media-marketing",
    title: "Social Media Marketing",
    category: "Brand",
    eyebrow: "Brand Presence",
    headline: "Social media that builds brands and moves buyers.",
    summary:
      "Strategy, content, and community management built to turn your social presence into a channel that actually contributes to revenue.",
    cardCopy: "Content that builds engagement, trust, and drives meaningful customer actions.",
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=1600&q=80",
    approach: {
      title: "Most brands post consistently. Very few actually build anything.",
      body: "A full content calendar and decent engagement numbers are not the same as a brand people trust and buy from. Social media done right is the difference between a business that is recognised and one that is remembered. We build the second kind — with a strategy that connects creative to commercial outcomes, not just content that fills a feed.",
    },
    statsTitle: "Nine years in. Here is what consistent social strategy looks like.",
    stats: [
      { value: 250, suffix: "+", label: "Brands Managed on Social" },
      { value: 400, suffix: "+", label: "Paid Social Campaigns Run" },
      { value: 18000, suffix: "+", label: "Content Pieces Produced" },
      { value: 40, suffix: "+", label: "Industries Worked Across" },
      { value: 2.8, suffix: "x", label: "Avg. Engagement Growth", decimals: 1 },
      { value: 180, suffix: "+", label: "Communities Built and Grown" },
    ],
    statsFooter:
      "Every number is a brand that needed a stronger presence, a bigger audience, or a more direct line between content and revenue.",
    pillars: [
      { title: "Brand Architecture", description: "A consistent visual and verbal identity that makes your brand recognisable in a single scroll." },
      { title: "Strategic Content", description: "Every post is mapped to a stage of the buyer journey, not just a day of the week." },
      { title: "Community & Conversion", description: "Audiences that grow with intent, engage with purpose, and move toward becoming customers." },
    ],
    reality: {
      title: "Social media marketing ≠ posting content.",
      body: "Anyone can fill a feed. The work is in building a presence people actually follow, engage with, and eventually buy from. That requires more than a content calendar.",
    },
    capabilitiesIntro:
      "We audit your current social presence, identify the gap between what you are putting out and what your audience actually responds to, and build the strategy from there.",
    capabilities: [
      {
        title: "Social Media Strategy",
        description:
          "Before a single post goes live, we map the brand voice, content pillars, platform priorities, and the metrics that actually matter. Strategy is what separates brands that grow from brands that just post.",
      },
      {
        title: "Instagram & Facebook Marketing",
        description:
          "The two platforms where brand and performance intersect most directly. We manage organic presence, paid campaigns, and community engagement as one connected system — because they are.",
      },
      {
        title: "YouTube & Video Strategy",
        description:
          "Video is where attention lives longest. We plan, produce, and optimise video content — from short-form hooks to long-form brand stories — built for retention, reach, and the algorithm.",
      },
      {
        title: "LinkedIn Marketing",
        description:
          "For B2B brands, LinkedIn is where decisions happen before a single call is booked. We build authority, grow the right audience, and create content that positions your brand as the credible choice in the room.",
      },
      {
        title: "Paid Social Campaigns",
        description:
          "Organic builds presence. Paid accelerates it. We run Meta, LinkedIn, and YouTube ad campaigns that work in lockstep with your organic strategy — not as a separate function bolted on afterwards.",
      },
      {
        title: "Content Creation & Management",
        description:
          "From concept to caption to scheduling — we produce content that looks like your brand, sounds like your brand, and performs on the platform it is built for. No recycled formats, no generic templates.",
      },
      {
        title: "Influencer & Creator Partnerships",
        description:
          "The right creator in the right niche reaches your buyer with more credibility than any ad placement can. We identify, brief, and manage partnerships that actually move the needle.",
      },
      {
        title: "Analytics & Reporting",
        description:
          "Numbers without context are just noise. We track what actually matters, report on what is working, and use that data to make next month better than this one. Every time.",
      },
    ],
    cta: {
      title: "Want to know what your social presence is actually worth?",
      body: "A free social audit covers your current presence, content performance, audience quality, and where the biggest opportunities are sitting untouched.",
      label: "Get a free social audit",
    },
  },
  {
    slug: "website-development",
    title: "Website Development",
    category: "Build",
    eyebrow: "Web Development",
    headline: "Websites built to work, not just exist.",
    summary:
      "Custom WordPress and Shopify development built for speed, clarity, and conversion. Because a website that does not perform is just an expensive brochure.",
    cardCopy: "Fast, user-focused websites designed to convert visitors into customers.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    approach: {
      title: "Most websites look good on presentation day. Ours work every day after.",
      body: "A website is not a design project. It is the single hardest-working asset your business has — open 24 hours, selling, convincing, and converting without you in the room. We build websites around that responsibility, not around aesthetics alone.",
    },
    statsTitle: "Nine years in. Here is what purposeful web development looks like.",
    stats: [
      { value: 600, suffix: "+", label: "Websites Built and Launched" },
      { value: 3.1, suffix: "X", label: "Avg. Page Load Improvement", decimals: 1 },
      { value: 380, suffix: "+", label: "WordPress Projects Delivered" },
      { value: 35, suffix: "+", label: "Industries Developed For" },
      { value: 140, suffix: "+", label: "Shopify Stores Built" },
      { value: 500, suffix: "+", label: "Businesses Earning Through Our Sites" },
    ],
    statsFooter: "Every site in that number had one job — to work. Not to win awards. To bring in business.",
    pillars: [
      { title: "Performance First", description: "Core Web Vitals, load speed, and mobile responsiveness are the foundation." },
      { title: "Structure With Intent", description: "Information architecture mapped to how your buyers actually move." },
      { title: "Built To Maintain", description: "A backend your team can run without a developer permanently on call." },
    ],
    reality: {
      title: "A website is not a design decision.",
      body: "Most websites fail quietly — not because they look bad, but because they were built without understanding how people actually move through them. Speed, structure, and intent are what separate a site that converts from one that just sits there.",
    },
    capabilitiesIntro:
      "We start with a full audit of what you currently have, map the gap between that and what your business needs, and build or rebuild accordingly — on the platform that fits.",
    capabilities: [
      {
        title: "WordPress Development",
        description:
          "Custom themes, clean architecture, proper SEO structure, and a backend your team can manage without a developer on call. Fast, scalable, and built around how your buyers actually use them.",
      },
      {
        title: "Shopify Development",
        description:
          "For brands selling online, Shopify done right is a revenue machine. Custom storefronts, optimised product pages, and a checkout flow built around reducing drop-off.",
      },
      {
        title: "UI and UX Design",
        description:
          "Before a line of code is written, we map how users move through the site — what they see first, where they hesitate, and what makes them act.",
      },
      {
        title: "Speed & Performance Optimisation",
        description:
          "A one-second delay in page load costs conversions. We audit Core Web Vitals, server response times, image compression, caching architecture, and rendering performance.",
      },
      {
        title: "SEO-Ready Development",
        description:
          "Clean URL structures, proper heading hierarchy, schema markup, canonical tags, sitemaps and crawlability built in from day one — not patched in after launch.",
      },
      {
        title: "Landing Page Development",
        description:
          "Campaign traffic needs a destination built specifically for it. Single focus, zero distraction, copy and layout tested against real user behaviour.",
      },
      {
        title: "Third-Party Integrations",
        description:
          "CRMs, payment gateways, email platforms, analytics tools, marketing automation, booking systems, WhatsApp APIs and ERP connections — so everything talks to everything.",
      },
      {
        title: "Security & Compliance",
        description:
          "SSL, GDPR-compliant cookie policies, data protection frameworks, malware scanning, security audits and uptime monitoring. We treat security as infrastructure, not an afterthought.",
      },
      {
        title: "Maintenance & Support",
        description:
          "Websites are not finished at launch. Plugin updates, content changes, performance monitoring and bug fixes — we stay on after go-live so nothing breaks quietly.",
      },
    ],
    cta: {
      title: "Want to know what your current website is actually costing you?",
      body: "A free website audit covers speed, structure, SEO readiness, conversion gaps, and what needs fixing before your next campaign sends traffic to it.",
      label: "Get a free website audit",
    },
  },
  {
    slug: "ecommerce",
    title: "E-commerce Management",
    category: "Commerce",
    eyebrow: "Marketplace Growth",
    headline: "Your products, on every platform that sells.",
    summary:
      "Amazon, Flipkart, Meesho, and beyond — full marketplace management built around visibility, conversions, and revenue that compounds.",
    cardCopy: "End-to-end marketplace management that turns listings into a real revenue channel.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
    approach: {
      title: "Most sellers are on marketplaces. Very few actually own them.",
      body: "Being listed is not the same as being found. Being found is not the same as being chosen. We manage marketplace presence the way it deserves to be managed — with the right listings, the right ads, and the right strategy to make your products the ones buyers keep coming back to.",
    },
    statsTitle: "Nine years in. Here is what serious marketplace management looks like.",
    stats: [
      { value: 320, suffix: "+", label: "Marketplace Accounts Managed" },
      { value: 2.9, suffix: "X", label: "Avg. Sales Growth After Onboarding", decimals: 1 },
      { value: 45, suffix: "K+", label: "Products Listed and Optimised" },
      { value: 30, suffix: "+", label: "Categories Worked Across" },
      { value: 500, suffix: "+", label: "Ad Campaigns Run Across Platforms" },
      { value: 200, suffix: "+", label: "Brands Scaled on Marketplaces" },
    ],
    statsFooter: "Every number is a brand that needed its products seen, clicked, and bought. We made that happen.",
    pillars: [
      { title: "Listing Intelligence", description: "Titles, images, and keywords built around how the algorithm ranks and buyers search." },
      { title: "Ad Precision", description: "Sponsored placements managed around return on ad spend, not visibility metrics." },
      { title: "Account Health", description: "Reviews, compliance, and seller metrics maintained so nothing quietly kills rankings." },
    ],
    reality: {
      title: "Marketplace management ≠ uploading products.",
      body: "Listing a product is the easiest part. Getting it ranked, clicked, reviewed, and reordered consistently is the actual work. Most sellers never figure that out.",
    },
    capabilitiesIntro:
      "We audit your current marketplace presence, identify what is holding your products back, and build the full management strategy across every platform that matters.",
    capabilities: [
      {
        title: "Amazon Account Management",
        description:
          "From account setup and brand registry to listing optimisation, A+ content, storefront design, and full advertising management across Sponsored Products, Sponsored Brands and DSP.",
      },
      {
        title: "Flipkart Account Management",
        description:
          "Flipkart's algorithm rewards sellers who understand its ranking signals — and punishes those who do not. We manage listings, ads, promotions and account health with the same rigour.",
      },
      {
        title: "Meesho Account Management",
        description:
          "Meesho's price-sensitive, high-volume buyer base requires a fundamentally different strategy. We optimise catalogues, pricing and ad spend for how its discovery system actually works.",
      },
      {
        title: "Marketplace SEO & Listing Optimisation",
        description:
          "Every word in a product title and every bullet in a description is a ranking signal. We research keywords, structure listings around buyer intent, and optimise what determines visibility.",
      },
      {
        title: "Product Photography & A+ Content",
        description:
          "On a marketplace, your image is your shelf presence. We produce photography, infographics, lifestyle images and A+ content built specifically for conversion.",
      },
      {
        title: "Marketplace Advertising",
        description:
          "Sponsored ads on Amazon, Flipkart and Meesho managed around one metric — return on ad spend. Campaign structures, bid management, creative tests, and scaling what works.",
      },
      {
        title: "Pricing & Competitive Intelligence",
        description:
          "We track competitor pricing, monitor Buy Box health, and adjust strategy in real time so your products stay competitive without unnecessarily cutting into margin.",
      },
      {
        title: "Multi-Platform Catalogue Management",
        description:
          "One product, multiple platforms, zero inconsistency — across Amazon, Flipkart, Meesho, Myntra, Nykaa, JioMart and others, with platform-specific titles, images and copy.",
      },
      {
        title: "Account Health & Compliance",
        description:
          "Policy violations, suppressed listings and negative feedback loops are silent revenue killers. We monitor daily, handle escalations, and protect your rankings and standing.",
      },
    ],
    cta: {
      title: "Want to know where your marketplace presence is leaking revenue?",
      body: "A free marketplace audit covers your current listings, ad performance, account health, and exactly where competitors are winning customers that should be yours.",
      label: "Get a free marketplace audit",
    },
  },
  {
    slug: "virtual-tours",
    title: "Virtual Tours",
    category: "Creative",
    eyebrow: "Immersive Experience",
    headline: "Let buyers walk in before they show up.",
    summary:
      "Custom interactive tours built with 360° imaging, AR integration, and multimedia layering — so your space sells itself, around the clock.",
    cardCopy: "Immersive virtual experiences that showcase spaces with depth and clarity.",
    image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?auto=format&fit=crop&w=1600&q=80",
    approach: {
      title: "A picture shows your space. A virtual tour sells it.",
      body: "Static images tell buyers what a space looks like. A well-built interactive tour makes them feel like they are already inside it. That shift — from viewing to experiencing — is what shortens decision cycles, reduces site-visit drop-offs, and puts your brand ahead of every competitor still relying on a photo gallery.",
    },
    statsTitle: "Here is what immersive experience tech actually delivers.",
    stats: [
      { value: 320, suffix: "+", label: "Virtual Tours Produced" },
      { value: 80, suffix: "+", label: "AR-Integrated Tours Delivered" },
      { value: 15, suffix: "+", label: "Industries Worked Across" },
      { value: 200, suffix: "+", label: "Businesses Using Tours as Sales Tools" },
      { value: 3.5, suffix: "X", label: "Avg. Engagement Time Increase", decimals: 1 },
      { value: 20, suffix: "+", label: "Cities Covered Across India" },
    ],
    statsFooter: "Every tour in that number was built to do one thing — keep the buyer engaged long enough to make a decision.",
    pillars: [
      { title: "Immersive Architecture", description: "Multi-node 360° environments built so viewers move through space intentionally." },
      { title: "Multimedia Integration", description: "Video, audio, info panels, and 3D models, every element placed with purpose." },
      { title: "Platform Reach", description: "One tour deployable across your website, Google Maps, YouTube, and VR." },
    ],
    reality: {
      title: "Virtual tours ≠ 360° photos stitched together.",
      body: "A basic 360° upload and a custom interactive tour are not the same product. One is a passive image. The other is a fully navigable, multimedia-layered experience built to inform, engage, and convert.",
    },
    capabilitiesIntro:
      "We handle the full production pipeline — from location shoot and 360° capture to software integration, multimedia layering, and final deployment across every platform your audience uses.",
    capabilities: [
      {
        title: "Custom Interactive Tour Production",
        description:
          "Multi-node 360° environments stitched with precision, layered with multimedia elements, and built with navigation logic that guides the viewer through the space intentionally.",
      },
      {
        title: "360° Photography & Videography",
        description:
          "Shot with high-resolution 360° cameras and professional lighting built for spatial accuracy. Every node renders correctly across desktop, mobile, tablet and VR.",
      },
      {
        title: "Augmented Reality Integration",
        description:
          "AR layers placed within the tour let viewers interact with elements inside the space — product placements, information overlays, animated walkthroughs — without a separate app.",
      },
      {
        title: "Floor Plan & Map Integration",
        description:
          "Clickable floor plans and spatial maps embedded within the tour so viewers navigate by layout, not just by arrow clicks. Critical for real estate, hospitality and large campuses.",
      },
      {
        title: "Multimedia Layering & Hotspots",
        description:
          "Audio narration, background music, embedded video, image galleries, text panels and 3D model placements — each configured as an interactive hotspot with a placement rationale.",
      },
      {
        title: "VR Box Compatibility",
        description:
          "Tours built and optimised for VR headset viewing — fully immersive, gyroscope-responsive, and rendered for the field of view VR devices require.",
      },
      {
        title: "Live Remote Access",
        description:
          "Tours hosted on a dedicated link so your sales team can walk a client through a property or facility in real time without either party being physically present.",
      },
      {
        title: "Google Maps & Street View Publishing",
        description:
          "Published directly to Google Maps and Street View, so your space appears in local search results with an immersive preview that lifts click-through rates.",
      },
      {
        title: "Website & Social Deployment",
        description:
          "Embedded into your website and shared across Instagram, Facebook and YouTube, formatted for every screen size without losing interactivity or load performance.",
      },
    ],
    cta: {
      title: "Want to see what a tour of your space actually looks like?",
      body: "We produce a sample walkthrough of your space so you can see exactly what buyers will experience before committing to anything.",
      label: "Get a free tour demo",
    },
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    category: "Strategy",
    eyebrow: "Full Funnel",
    headline: "One growth system. Every channel pulling the same way.",
    summary:
      "Strategy, creative, media and analytics run as a single operation — so your channels compound instead of competing for credit.",
    cardCopy: "A connected growth system across every channel your buyers actually use.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    approach: {
      title: "Marketing is not a set of activities. It is a system.",
      body: "The businesses growing fastest stopped treating marketing as an expense and started treating it as a system — one with inputs, outputs, and measurable returns at every stage. We build that system: audience research, funnel architecture, creative built around conversion behaviour, and the analytical infrastructure to know what is working and what needs to change.",
    },
    statsTitle: "What a connected system produces.",
    stats: [
      { value: 1200, suffix: "+", label: "Campaigns Executed" },
      { value: 250, suffix: "+", label: "Active Clients" },
      { value: 2.3, suffix: "M+", label: "Leads Generated", decimals: 1 },
      { value: 50, suffix: "+", label: "Verticals Scaled" },
      { value: 9, suffix: "+", label: "Years in the Trenches" },
      { value: 8600, suffix: "+", label: "Satisfied Customers" },
    ],
    statsFooter: "No vanity metrics. Every number here represents a business that grew because of decisions we made together.",
    pillars: [
      { title: "Audience Clarity", description: "Not demographics — intent signals, decision triggers, and the objections buyers carry in." },
      { title: "Funnel Architecture", description: "A specific intervention at every stage, from first awareness to final conversion." },
      { title: "Attribution You Trust", description: "GA4, Tag Manager, conversion pixels and CRM integration wired from day one." },
    ],
    reality: {
      title: "Reach is not the metric. Buyers are.",
      body: "A campaign that reaches a hundred thousand people but speaks to none of them specifically is not a hundred thousand opportunities. It is noise. What works now is precision — knowing who the buyer is, where they are in their decision process, and which channel delivers the message with the least friction.",
    },
    capabilitiesIntro:
      "We audit what exists, map the buyer journey, find where it leaks, and build the channel mix and measurement around that — not around a template.",
    capabilities: [
      {
        title: "Growth Strategy & Funnel Mapping",
        description:
          "Who the buyer is, where they are, what moves them, and what it costs to reach them. Every rupee gets a defined job before anything goes live.",
      },
      {
        title: "Multi-Channel Campaign Management",
        description:
          "Search, social, marketplace and email run as one operation with a shared calendar, shared creative system and shared reporting.",
      },
      {
        title: "Content Marketing",
        description:
          "Content planned around real search demand and buyer intent, so what you publish has a job beyond filling a blog page.",
      },
      {
        title: "Email & Lifecycle Automation",
        description:
          "Follow-up sequences that move leads through the funnel instead of letting them go cold. Most budgets are wasted on lead management, not lead generation.",
      },
      {
        title: "Marketing Analytics & Reporting",
        description:
          "Live dashboards showing traffic sources, conversion paths, cost per acquisition, customer lifetime value, and revenue attributed to campaigns.",
      },
      {
        title: "Brand Positioning & Messaging",
        description:
          "The words that make a buyer choose you over the identical-looking option next to you. Positioning first, campaigns second.",
      },
    ],
    cta: {
      title: "Tell us where you are. We will tell you where you can go.",
      body: "No fluff, no filler, just a real conversation about real growth — and a prioritised plan you can act on with or without us.",
      label: "Book a growth call",
    },
  },
  {
    slug: "shopify-development",
    title: "Shopify Development",
    category: "Commerce",
    eyebrow: "Storefront Engineering",
    headline: "A Shopify store built around the buyer journey.",
    summary:
      "Custom storefronts, optimised product pages, and a checkout flow engineered to reduce drop-off from the first scroll to the confirmation page.",
    cardCopy: "Custom Shopify storefronts engineered to convert, not just to launch.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1600&q=80",
    approach: {
      title: "Done right, Shopify is a revenue machine.",
      body: "The theme is the easy part. The work is in the product page hierarchy, the trust signals, the upsell logic and the checkout friction you cannot see until you measure it. We build stores around how people actually buy, then keep tightening the funnel after launch.",
    },
    statsTitle: "What we have shipped on Shopify.",
    stats: [
      { value: 140, suffix: "+", label: "Shopify Stores Built" },
      { value: 3.1, suffix: "X", label: "Avg. Page Load Improvement", decimals: 1 },
      { value: 45, suffix: "K+", label: "Products Listed and Optimised" },
      { value: 30, suffix: "+", label: "Categories Worked Across" },
      { value: 2.9, suffix: "X", label: "Avg. Sales Growth After Onboarding", decimals: 1 },
      { value: 500, suffix: "+", label: "Businesses Earning Through Our Sites" },
    ],
    statsFooter: "Every store in that number was built to sell, not to sit in a portfolio.",
    pillars: [
      { title: "Conversion Layout", description: "Product pages structured around the questions buyers ask before they add to cart." },
      { title: "Checkout Discipline", description: "Every extra field, step and surprise cost is a leak. We close them." },
      { title: "Stack Integration", description: "Reviews, subscriptions, analytics, WhatsApp and your ad platforms, wired properly." },
    ],
    reality: {
      title: "A theme is not a store.",
      body: "Installing a premium theme gets you a storefront that looks like a thousand others and converts like them too. The difference is in the details nobody screenshots: page speed, product data quality, trust placement and post-purchase flow.",
    },
    capabilitiesIntro:
      "We start from your catalogue and your margins, then build the storefront and the systems that keep it improving.",
    capabilities: [
      {
        title: "Custom Storefront Development",
        description: "Bespoke themes and sections built to your brand, not a marketplace template with your logo dropped in.",
      },
      {
        title: "Product Page Optimisation",
        description: "Imagery, copy hierarchy, variant logic and trust signals arranged around how buyers actually evaluate a product.",
      },
      {
        title: "Checkout & Cart Optimisation",
        description: "Reducing drop-off between add-to-cart and confirmation — the most expensive gap in any online store.",
      },
      {
        title: "Migration & Replatforming",
        description: "Moving from WooCommerce, Magento or a custom build without losing SEO equity, order history or sanity.",
      },
      {
        title: "App & API Integrations",
        description: "Payments, logistics, subscriptions, reviews, loyalty, CRM and marketing automation connected into one stack.",
      },
      {
        title: "Speed & Core Web Vitals",
        description: "Theme audits, asset optimisation and script discipline, because a slow store is a discount you did not agree to.",
      },
    ],
    cta: {
      title: "Want a teardown of your current store?",
      body: "We audit speed, product page structure, checkout friction and the integrations you are missing — then show you what to fix first.",
      label: "Get a free store audit",
    },
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

/** Compact list used by the home page grid and the footer. */
export const serviceLinks = services.map(({ slug, title, image }) => ({
  title,
  href: `/services/${slug}`,
  image,
}));

/* ------------------------------------------------------------------ */
/* Case studies                                                        */
/* ------------------------------------------------------------------ */

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  summary: string;
  image: string;
  results: { label: string; value: string }[];
  tags: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "hh-nutraceuticals",
    title: "From zero digital presence to a category contender",
    client: "H&H",
    category: "Nutraceuticals",
    year: "2026",
    summary:
      "A full-stack rebuild: brand system, Shopify storefront and a paid social engine launched together so the first campaign landed on a store that could actually convert it.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
    results: [
      { label: "Monthly Online Revenue", value: "₹35L" },
      { label: "Time to Scale", value: "6 months" },
      { label: "Return on Ad Spend", value: "3.2X" },
    ],
    tags: ["Shopify", "Performance Marketing", "Brand"],
  },
  {
    slug: "search-visibility-programme",
    title: "Owning search in a market where nobody was optimising",
    client: "Multi-brand SEO programme",
    category: "SEO",
    year: "2026",
    summary:
      "Technical repair first, then intent-led content and authority building — plus AI Overview and answer-engine structuring for the surfaces that did not exist two years ago.",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1600&q=80",
    results: [
      { label: "Organic Traffic", value: "2.4x" },
      { label: "Landing Pages Optimised", value: "250+" },
      { label: "Audits Completed", value: "520+" },
    ],
    tags: ["Technical SEO", "Content", "GEO / AEO"],
  },
  {
    slug: "real-estate-virtual-tours",
    title: "Site visits that happen before the site visit",
    client: "Real estate portfolio",
    category: "Virtual Tours",
    year: "2025",
    summary:
      "Multi-node interactive tours with AR layers, clickable floor plans and Street View publishing — so buyers shortlisted properties without a sales team in the room.",
    image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?auto=format&fit=crop&w=1600&q=80",
    results: [
      { label: "Engagement Time", value: "3.5X" },
      { label: "Tours Produced", value: "320+" },
      { label: "Cities Covered", value: "20+" },
    ],
    tags: ["360° Capture", "AR", "Real Estate"],
  },
  {
    slug: "marketplace-scale-up",
    title: "Listed everywhere, finally winning somewhere",
    client: "D2C consumer brand",
    category: "E-commerce",
    year: "2025",
    summary:
      "Catalogue rebuilt across Amazon, Flipkart and Meesho with platform-specific copy, A+ content and sponsored ad structures managed to ROAS rather than impressions.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
    results: [
      { label: "Sales Growth", value: "2.9X" },
      { label: "Products Optimised", value: "45K+" },
      { label: "Categories", value: "30+" },
    ],
    tags: ["Amazon", "Flipkart", "Meesho"],
  },
  {
    slug: "education-lead-engine",
    title: "A lead engine built before the ad budget grew",
    client: "Education group",
    category: "Lead Generation",
    year: "2025",
    summary:
      "Channel mix rebuilt around intent, landing pages built for a single action, and follow-up sequences that stopped good leads going cold between enquiry and counselling.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80",
    results: [
      { label: "Leads Generated", value: "140K+" },
      { label: "Campaigns Managed", value: "980+" },
      { label: "Industries Scaled", value: "25+" },
    ],
    tags: ["Google Ads", "Meta Ads", "CRO"],
  },
  {
    slug: "fashion-social-build",
    title: "A feed that finally sold something",
    client: "Fashion & clothing label",
    category: "Social Media",
    year: "2024",
    summary:
      "Brand architecture, a content system mapped to funnel stages, and creator partnerships briefed properly — organic and paid running as one connected motion.",
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=1600&q=80",
    results: [
      { label: "Engagement Growth", value: "2.8x" },
      { label: "Content Pieces", value: "18K+" },
      { label: "Communities Grown", value: "180+" },
    ],
    tags: ["Instagram", "Creators", "Paid Social"],
  },
];

export const caseStudyCategories = ["All", ...Array.from(new Set(caseStudies.map((c) => c.category)))];

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export const testimonials = [
  {
    quote:
      "They didn't just run campaigns. They sat inside our numbers, questioned our assumptions, and rewrote our digital strategy top to bottom. Our CAC dropped by 40%.",
    name: "Priya Nair",
    context: "Full Digital Marketing",
  },
  {
    quote:
      "From zero to ₹35L/month in online revenue in under six months. The Shopify build was clean, the ads were sharp, and the reporting was finally something we could act on.",
    name: "Ankit Joshi",
    context: "E-commerce",
  },
  {
    quote:
      "We launched with zero digital presence. ROI Makers helped us build brand, community, and sales simultaneously. Within four months, we had a waitlist. That felt unreal.",
    name: "Shreya Bansal",
    context: "Brand New to Market",
  },
];

/* ------------------------------------------------------------------ */
/* Story                                                               */
/* ------------------------------------------------------------------ */

export const missionVision = {
  mission: {
    title: "Delivering consistent growth through performance-driven marketing",
    body: "We build marketing systems that compound, not campaigns that expire. Our mission is to replace guesswork with growth science and make ROI so predictable it becomes your unfair advantage.",
    points: [
      "Focused on results that directly impact your business growth",
      "Performance-focused strategies built to maximise ROI and efficiency",
      "Full transparency into what works and what doesn't",
      "Continuous optimisation to improve results and scale sustainably",
    ],
  },
  vision: {
    title: "Shaping future-ready brands through smart digital growth",
    body: "To be the agency founders call when they're done experimenting and ready to grow with conviction. Not the loudest agency in the room. The one with the sharpest results on the board.",
    points: [
      "The go-to growth partner for ambitious brands",
      "Setting the benchmark for performance marketing in India",
      "Where creative thinking meets conversion engineering",
      "Building legacies, not just quarterly reports",
    ],
  },
};

export const timeline = [
  {
    year: "2014–22",
    title: "The foundation years",
    body: "Before ROI Makers existed there was Amit — nine years across graphic design, video production, performance marketing and brand strategy, managing large teams and high-pressure campaigns inside other people's companies.",
  },
  {
    year: "2023",
    title: "The leap of faith",
    body: "A laptop, a small home office, and no investor backing. Design, video, campaigns, websites and strategy all handled solo. The first major client came from construction, and the results built the trust that funded everything after.",
  },
  {
    year: "2024",
    title: "The first office, the first team",
    body: "A barter deal for desk space — digital marketing traded for a place to build. Within six months, clients across multiple industries and the first real hires turned a one-person operation into an agency.",
  },
  {
    year: "2025",
    title: "The real office. The real agency.",
    body: "A dedicated Indore office and a core team of four, planting a flag in real estate, nutraceuticals, education and fashion — with AI-powered tooling wired into everyday workflows from content to analytics.",
  },
  {
    year: "Now",
    title: "Indore's name to watch",
    body: "One of the city's most recognised digital marketing agencies: a full-service team handling brands from local businesses to scaling startups, with 250+ active partners and 1,200+ campaigns behind us.",
  },
];

export const founderQuote = {
  quote: "We don't just run campaigns. We build legacies.",
  attribution: "Amit Sharma, Founder, ROI Makers",
};

export const leadership = [
  {
    name: "Amit Sharma",
    role: "Founder & CEO",
    image: "/team/1.webp",
    bio: "Amit carries over a decade of experience across finance, media, advertising and digital marketing. He began as a Senior Accountant managing cross-border operations for an Australian organisation, moved into media production at Gullyballa Publishing, and spent nearly five years at Obligr Pvt Ltd as Global Head — leading campaigns, training teams and building the strategic thinking the agency runs on today. Before founding ROI Makers he served as Digital Marketing Head at Healthveda Organics, Reddito Capital and Business Bazaar.",
  },
  {
    name: "Vishal Yogi",
    role: "Co-Founder",
    image: "/team/2.webp",
    bio: "Vishal brings the operational depth that keeps ROI Makers structured, scalable and focused. With hands-on experience building and managing multiple businesses across retail, consumer and service industries, he carries a ground-level understanding of what growth actually demands beyond strategy and planning. He oversees business operations, client partnerships and the internal systems that ensure the agency runs as well as it delivers.",
  },
  {
    name: "Abhishek Sharma",
    role: "Chief Technology Officer",
    image: "/team/3.webp",
    bio: "Abhishek is the technical foundation the agency is built on. With deep expertise in full-stack development, system architecture and emerging technology, he shapes the digital infrastructure that powers operations and scale. As CTO he oversees platform integrations, internal tooling and the data frameworks that keep every campaign running with precision.",
  },
];

export const values = [
  {
    title: "Performance over promises",
    description: "Every single time. We optimise for your profit margins, not for how a case study looks in a deck.",
  },
  {
    title: "Full transparency",
    description: "Into what works and what doesn't. No black boxes, no vanity metrics, no hiding behind brand awareness when conversions tank.",
  },
  {
    title: "Systems built to scale",
    description: "Not just to survive. We build feedback loops that turn every campaign into institutional knowledge.",
  },
  {
    title: "Growth that outlasts",
    description: "The campaign that started it. Last month's winning formula is this month's baseline.",
  },
];

export const capabilitiesList = [
  "Behavioural data architecture",
  "Performance creative systems",
  "Omnichannel orchestration",
  "Conversion psychology frameworks",
];

/* ------------------------------------------------------------------ */
/* Careers                                                             */
/* ------------------------------------------------------------------ */

export const openRoles = [
  {
    title: "Performance Marketing",
    experience: "2–3 Years",
    type: "On-site · Full-time",
    skills: ["SMM", "SEO", "Meta Ads", "Google Ads", "Lead Generation", "Campaign Optimisation"],
  },
  {
    title: "Senior Video Editor",
    experience: "2+ Years",
    type: "On-site · Full-time",
    skills: ["Adobe Premiere Pro", "After Effects", "Reel Editing", "Motion Graphics", "Creative Video Editing"],
  },
];

export const applicationProfiles = [
  "Performance Marketing",
  "Business Development Associate (BDA)",
  "Graphic Designer",
  "Video Editor",
  "Social Media Marketer",
  "SEO Expert",
  "Content Writing",
  "Human Resources",
  "Others",
];

export const benefits = [
  { title: "Flexible Work", description: "Remote-friendly rhythms with co-working stipends and quarterly offsites." },
  { title: "Learning Budget", description: "₹50K a year for courses, conferences and certifications." },
  { title: "Health Coverage", description: "Comprehensive insurance for you and your family." },
  { title: "Performance Bonus", description: "Quarterly bonuses tied to campaign outcomes and team OKRs." },
  { title: "Creative Time", description: "Dedicated time for side projects and skill exploration." },
  { title: "Growth Path", description: "Clear progression frameworks with regular reviews." },
];

export const perks = [
  "Annual company retreat",
  "Home office setup allowance",
  "Mental health and wellness support",
  "Unlimited books and audiobook subscription",
  "Team lunches and celebration budgets",
  "Equity participation for senior roles",
];

/* ------------------------------------------------------------------ */
/* FAQs                                                                */
/* ------------------------------------------------------------------ */

export const faqs = [
  {
    question: "What makes ROI Makers different from other agencies?",
    answer:
      "We're performance-obsessed, not portfolio-obsessed. While most agencies optimise for case study aesthetics, we optimise for your profit margins. You get full transparency into what's working, what's dying, and what we're testing next. No black boxes, no vanity metrics, no hiding behind \"brand awareness\" when conversions tank. Plus, we operate on results-first pricing models — if we don't deliver ROI, we don't deserve retention.",
  },
  {
    question: "What's your typical project timeline and onboarding process?",
    answer:
      "Week 1: deep-dive audit of your current marketing — tracking infrastructure, campaign performance, competitive landscape. Week 2: strategy presentation with prioritised recommendations and projected ROI. Week 3: campaign launch with real-time dashboard access. Most clients see actionable data within 30 days and measurable ROI improvements within 90 days.",
  },
  {
    question: "Do you work with businesses in my industry?",
    answer:
      "We're industry-agnostic by design. Whether you're selling SaaS, real estate, healthcare services or artisanal dog treats, buyer psychology is universal; execution is what's custom. We've scaled 50+ different verticals because we focus on what drives human behaviour, not what's trendy in your industry's echo chamber.",
  },
  {
    question: "What's your pricing structure?",
    answer:
      "Three engagement models: project-based (fixed scope, fixed price), retainer (ongoing optimisation with monthly sprint goals), and performance-based (compensation tied to your results). Pricing varies based on channels, scale and complexity. We're not the cheapest, but we intend to be the most profitable investment you make in marketing.",
  },
  {
    question: "How do you measure and report ROI?",
    answer:
      "We implement proper attribution tracking from day one — Google Analytics 4, Tag Manager, conversion pixels, CRM integration. You get live dashboards showing traffic sources, conversion paths, cost per acquisition, customer lifetime value and actual revenue attributed to our campaigns. Monthly strategy calls break down what's working, what we're killing and what we're scaling.",
  },
  {
    question: "What if we've been burned by agencies before?",
    answer:
      "You're not alone — most of our clients came to us after wasting budgets on agencies that over-promised and under-delivered. That's exactly why we built ROI Makers differently: transparent operations, ruthless testing, and compensation models that align our success with yours. We're happy to start with a pilot project so you can see how we operate before committing long-term.",
  },
  {
    question: "Can you guarantee specific results?",
    answer:
      "Anyone guaranteeing specific numbers before understanding your business, market and current performance is either lying or incompetent. What we can guarantee: full transparency into what we're doing and why, ruthless optimisation based on data, and immediate course-correction when something isn't working.",
  },
  {
    question: "Do I need to have a big budget to work with you?",
    answer:
      "Not necessarily, but we're honest about minimum thresholds. For paid advertising we recommend at least ₹50,000/month in ad spend to generate statistically significant data. For SEO and content, projects typically start at ₹75,000/month. If you're earlier than that, we can discuss project-based work or consulting to build your foundation.",
  },
];

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  isoDate: string;
  readTime: string;
  image: string;
  author: { name: string; avatar: string };
  /** Plain paragraphs; a heading is any entry prefixed with `## `. */
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-indore-businesses-are-choosing-performance-driven-marketing",
    title: "Why Indore businesses are choosing performance-driven marketing",
    excerpt:
      "The businesses growing fastest in Indore stopped treating marketing as an expense and started treating it as a system with inputs, outputs and measurable returns.",
    category: "Strategy",
    date: "20 May 2026",
    isoDate: "2026-05-20",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    author: { name: "ROI Makers", avatar: "/team/1.webp" },
    body: [
      "Indore is no longer just Central India's commercial capital. It is becoming one of the fastest-growing business ecosystems in the country — with startups scaling, MSMEs going digital, and established enterprises rethinking how they acquire customers. In that shift, one thing has become clear: the way businesses approach marketing is either accelerating their growth or quietly holding it back.",
      "The difference rarely comes down to budget. It comes down to approach.",
      "The businesses growing fastest in Indore right now share one thing in common. They stopped treating marketing as an expense and started treating it as a system — one with inputs, outputs, and measurable returns at every stage.",
      "That shift in thinking is what separates brands that scale from brands that plateau. Business owners are no longer asking \"how do we get more visibility.\" They are asking \"how do we get more buyers\" — and those are fundamentally different questions that require fundamentally different answers.",
      "## Reach was the old metric. Buyers are the new one.",
      "Traditional marketing operated on reach and recall. Put your brand in front of enough people, often enough, and revenue would follow. That model worked when attention was scarce and channels were limited. Neither of those conditions exists today.",
      "Today's buyer researches before they enquire, compares before they decide, and dismisses anything that does not immediately feel relevant to their specific situation. A campaign that reaches a hundred thousand people but speaks to none of them specifically is not a hundred thousand opportunities. It is noise.",
      "What works now is precision — knowing who the buyer is, where they are in their decision process, what they need to hear at that stage, and which channel delivers that message with the least friction. That is not a creative brief. That is a system.",
      "## Building the system",
      "It requires more than a social media posting schedule or a Google Ads account. It requires audience research, funnel architecture, creative built around conversion behaviour, and the analytical infrastructure to know what is working and what needs to change.",
      "The brands getting this right are not necessarily the ones with the largest budgets. They are the ones that have stopped guessing. They have mapped their buyer's journey, identified where drop-offs happen, and built specific interventions at each stage — from first awareness to final conversion.",
      "This is what modern marketing looks like when it is working. Not a collection of disconnected activities, but a connected system where every rupee has a job, every channel has a role, and every campaign generates data that makes the next one sharper.",
      "## Conclusion",
      "Growth does not happen by accident in a market moving this fast. It happens when the right strategy meets the right execution — consistently, measurably, and with a clear line between what is being spent and what is being returned. That is the standard worth holding marketing to.",
    ],
  },
  {
    slug: "what-makes-an-seo-agency-worth-working-with-in-2026",
    title: "What makes an SEO agency worth working with in 2026",
    excerpt:
      "Ranking for a keyword is no longer the whole job. Here is how to tell a serious search partner from one that is still running the 2018 playbook.",
    category: "SEO",
    date: "20 April 2026",
    isoDate: "2026-04-20",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1600&q=80",
    author: { name: "ROI Makers", avatar: "/team/2.webp" },
    body: [
      "Search engine optimisation has been around long enough for everyone to have an opinion about it — and for a lot of those opinions to be wrong. Businesses have been burned by agencies that promised first-page rankings in thirty days, delivered traffic that never converted, and disappeared when the results did not materialise.",
      "That history has made decision-makers rightfully cautious. But caution should not become avoidance, because search is still the highest-intent channel available to any business online. The question is not whether SEO works. The question is what good SEO actually looks like — and how to find the people who practise it.",
      "## Search changed more in two years than in the previous ten",
      "Google's introduction of AI Overviews, the rise of answer engines like Perplexity, and the growing role of generative AI in how people find information have fundamentally shifted what it means to be visible in search.",
      "Ranking for a keyword is no longer the whole job. Appearing in AI-generated answers, featured snippets, People Also Ask boxes and voice search results are now equally important surfaces — and each requires a different technical and content approach. An agency still operating on the 2018 playbook of keyword stuffing, bulk link acquisition and thin content is not just ineffective. It is actively dangerous to a domain's long-term health.",
      "## What separates a serious agency",
      "Depth. Technical SEO — crawlability, Core Web Vitals, schema markup, site architecture — is the foundation. Without it, no amount of content or link building produces sustainable results. On-page optimisation built around search intent, not just keyword density, is what determines whether a ranked page actually gets clicked. And off-page authority built through genuine editorial links, not bulk directories, is what determines whether rankings hold when the algorithm updates.",
      "## The questions to ask",
      "For decision-makers evaluating providers, the right questions are not about timelines and guarantees. They are about process. What does the technical audit cover? How do they research search intent before writing a single word? How do they build links — and what kinds? What does their reporting actually show, and does it connect rankings to revenue or just to traffic?",
      "These questions reveal whether an agency understands SEO as a revenue channel or as a checkbox service. The right partner is not necessarily the largest or most visible one — it is the one that can answer these questions with specificity and show the work behind their results.",
      "## Conclusion",
      "SEO done right is one of the highest-returning investments a business can make. Done wrong, it is an expensive lesson. The difference comes down to who is doing it, what their process looks like, and whether they are building something that lasts — or just something that looks good in a monthly report.",
    ],
  },
  {
    slug: "why-startups-in-india-need-a-lead-generation-strategy-first",
    title: "Why startups in India need a lead generation strategy first",
    excerpt:
      "Most startups do not fail because the product is bad. They fail because not enough of the right people ever find out it exists.",
    category: "Growth",
    date: "20 March 2026",
    isoDate: "2026-03-20",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    author: { name: "ROI Makers", avatar: "/team/3.webp" },
    body: [
      "Most startups do not fail because the product is bad. They fail because not enough of the right people ever find out the product exists. That is a distribution problem — and it is one of the most common, most preventable, and most consistently underestimated challenges in early-stage business building.",
      "The instinct for most founders is to focus on getting the product right, building the brand, and creating content. All of that matters. But none of it replaces a deliberate, structured approach to generating qualified leads — people with an actual reason to buy, at a stage where they are close to making a decision.",
      "The difference between a startup that finds its footing in the first twelve months and one still searching for traction at the two-year mark is rarely the quality of the idea. It is almost always the quality of the pipeline.",
      "## A pipeline does not build itself",
      "It requires understanding who the ideal customer is at a level of specificity most founders skip — not just demographics, but intent signals, decision triggers, the objections they carry into every conversation, and the channels where they are actually reachable. Without that understanding, every marketing activity is a guess dressed up as a strategy.",
      "For early-stage businesses, the most important marketing investment is not awareness. It is conversion infrastructure — the systems that take a prospective buyer from first contact to qualified conversation as efficiently as possible. That means clear messaging, the right channel mix, landing pages built around a single action, and follow-up sequences that move leads through the funnel rather than letting them go cold.",
      "## Channel mix matters",
      "For B2B startups, LinkedIn and Google Search tend to produce higher-intent leads at a higher cost per acquisition. For B2C and D2C brands, Meta's targeting capabilities make it possible to reach very specific buyer profiles at scale. The right answer depends on the product, the price point, the sales cycle and the market — and getting that wrong early is expensive.",
      "There is also the question of what happens after the lead is generated. A significant proportion of marketing budgets are wasted not on bad lead generation but on bad lead management — slow follow-up, no nurturing sequence, and sales conversations that happen too late to be effective.",
      "## Conclusion",
      "Leads are not a marketing metric. They are a business metric. The sooner a startup builds the infrastructure to generate them consistently and convert them reliably, the sooner every other part of the business — product, team, operations — has something real to build on.",
    ],
  },
];

export const postBySlug = (slug: string) => blogPosts.find((p) => p.slug === slug);
export const blogCategories = ["All", ...Array.from(new Set(blogPosts.map((p) => p.category)))];

/* ------------------------------------------------------------------ */
/* Creators                                                            */
/* ------------------------------------------------------------------ */

export const creators = [
  "@charusolanki",
  "@madeinindore",
  "@kashishsitlani",
  "@unofficialhimanshu",
  "@iamazharshaikh",
  "@chiragbarjatya",
  "@meenaltanwani",
  "@sonal2794",
  "@mehakkushwahofficial",
];
