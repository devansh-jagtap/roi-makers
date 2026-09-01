import type { StageCard } from "@/components/ui/glass/HeroStage";

/**
 * What sits behind each page's frosted opening panel.
 *
 * Every card is a real outcome, quote or fact from the business — the blur
 * is refracting the work rather than decorative noise. Positions are hand
 * placed to leave the middle column clear, since that is where the panel
 * lands; nothing here should sit under the headline.
 */

const LEFT_OUTER = "3%";
const RIGHT_OUTER = "3%";

export const servicesStage: StageCard[] = [
  {
    tag: "Meta Ads",
    line: "3.2X ROAS across 980 managed campaigns",
    meta: "Performance Marketing",
    depth: "mid",
    style: { top: "12%", left: LEFT_OUTER },
  },
  {
    tag: "Shopify",
    line: "Zero to ₹35L/month in under six months",
    meta: "Ankit Joshi · E-commerce",
    depth: "near",
    style: { top: "52%", left: "6%" },
  },
  {
    tag: "Search",
    line: "2.4x organic traffic, 520 audits completed",
    meta: "SEO · AEO · GEO",
    depth: "far",
    style: { top: "16%", right: RIGHT_OUTER },
  },
  {
    tag: "Social",
    line: "18,000 content pieces, 180 communities grown",
    meta: "Brand Presence",
    depth: "mid",
    style: { top: "58%", right: "5%" },
  },
  {
    tag: "Marketplace",
    line: "45K products optimised on Amazon & Flipkart",
    meta: "E-commerce Management",
    depth: "far",
    style: { bottom: "8%", left: "22%" },
  },
];

export const aboutStage: StageCard[] = [
  {
    tag: "2023",
    line: "A laptop, a home office, no investor backing",
    meta: "The leap of faith",
    depth: "far",
    style: { top: "13%", left: LEFT_OUTER },
  },
  {
    tag: "2025",
    line: "First dedicated Indore office, core team of four",
    meta: "The real agency",
    depth: "near",
    style: { top: "50%", left: "5%" },
  },
  {
    tag: "Now",
    line: "250+ active partners, 1,200+ campaigns",
    meta: "Indore's name to watch",
    depth: "mid",
    style: { top: "17%", right: RIGHT_OUTER },
  },
  {
    tag: "Founder",
    line: "\"We don't just run campaigns. We build legacies.\"",
    meta: "Amit Sharma",
    depth: "mid",
    style: { top: "56%", right: "6%" },
  },
  {
    tag: "Team",
    line: "Growth · Brand · Analytics · Tech under one roof",
    meta: "Revenue-obsessed squads",
    depth: "far",
    style: { bottom: "9%", left: "24%" },
  },
];

export const projectsStage: StageCard[] = [
  {
    tag: "Nutraceuticals",
    line: "₹35L/month online revenue in six months",
    meta: "H&H · Shopify + Paid Social",
    depth: "near",
    style: { top: "14%", left: LEFT_OUTER },
  },
  {
    tag: "Real Estate",
    line: "3.5X engagement time with interactive tours",
    meta: "320 tours across 20 cities",
    depth: "mid",
    style: { top: "54%", left: "6%" },
  },
  {
    tag: "Education",
    line: "140K+ leads from intent-led campaigns",
    meta: "Lead Generation",
    depth: "far",
    style: { top: "18%", right: RIGHT_OUTER },
  },
  {
    tag: "D2C",
    line: "2.9X sales growth after marketplace onboarding",
    meta: "Amazon · Flipkart · Meesho",
    depth: "mid",
    style: { top: "58%", right: "4%" },
  },
  {
    tag: "Fashion",
    line: "2.8x engagement growth, 180 communities",
    meta: "Social + Creator partnerships",
    depth: "far",
    style: { bottom: "8%", left: "23%" },
  },
];

export const careersStage: StageCard[] = [
  {
    tag: "Open role",
    line: "Performance Marketing · 2–3 years",
    meta: "On-site · Full-time",
    depth: "near",
    style: { top: "14%", left: LEFT_OUTER },
  },
  {
    tag: "Open role",
    line: "Senior Video Editor · 2+ years",
    meta: "On-site · Full-time",
    depth: "mid",
    style: { top: "53%", left: "5%" },
  },
  {
    tag: "Benefit",
    line: "₹50K a year for courses and conferences",
    meta: "Learning budget",
    depth: "far",
    style: { top: "17%", right: RIGHT_OUTER },
  },
  {
    tag: "Benefit",
    line: "Quarterly bonuses tied to campaign outcomes",
    meta: "Performance bonus",
    depth: "mid",
    style: { top: "57%", right: "5%" },
  },
  {
    tag: "Culture",
    line: "Clear progression frameworks, regular reviews",
    meta: "Growth path",
    depth: "far",
    style: { bottom: "9%", left: "24%" },
  },
];

export const blogStage: StageCard[] = [
  {
    tag: "Strategy",
    line: "Why Indore businesses are choosing performance-driven marketing",
    meta: "20 May 2026 · 6 min",
    depth: "mid",
    style: { top: "13%", left: LEFT_OUTER },
  },
  {
    tag: "SEO",
    line: "What makes an SEO agency worth working with in 2026",
    meta: "20 April 2026 · 7 min",
    depth: "near",
    style: { top: "52%", left: "6%" },
  },
  {
    tag: "Growth",
    line: "Why startups in India need a lead generation strategy first",
    meta: "20 March 2026 · 6 min",
    depth: "far",
    style: { top: "17%", right: RIGHT_OUTER },
  },
  {
    tag: "AI Search",
    line: "Ranking for a keyword is no longer the whole job",
    meta: "AI Overviews · AEO · GEO",
    depth: "mid",
    style: { top: "57%", right: "4%" },
  },
  {
    tag: "Conversion",
    line: "Most budgets are wasted on lead management, not generation",
    meta: "From the archive",
    depth: "far",
    style: { bottom: "8%", left: "23%" },
  },
];
