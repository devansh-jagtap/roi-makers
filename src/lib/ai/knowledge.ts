import {
  benefits,
  blogPosts,
  caseStudies,
  company,
  faqs,
  founderQuote,
  headlineStats,
  leadership,
  missionVision,
  openRoles,
  services,
  testimonials,
  timeline,
  trustSignals,
  values,
} from '@/data/site';

/**
 * The public assistant's knowledge base, derived from `src/data/site.ts`.
 *
 * `site.ts` is already the single source of truth for every piece of marketing
 * copy on the site, so the assistant reads from it rather than from a
 * hand-maintained copy. That is what keeps the bot from contradicting the pages
 * a visitor is looking at, and it means new services or case studies show up in
 * the assistant the moment they are added to the site.
 */

const fmtStat = (stat: { value: number; suffix: string; label: string; decimals?: number }) =>
  `${stat.decimals ? stat.value.toFixed(stat.decimals) : stat.value}${stat.suffix} ${stat.label}`;

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

export function companyBrief(): string {
  return [
    `Name: ${company.name}`,
    `Tagline: ${company.tagline}`,
    `Promise: ${company.promise}`,
    `Founded: ${company.founded} · Based in ${company.city}, India`,
    `Address: ${company.address}`,
    `Phone: ${company.phones.join(' / ')}`,
    `General email: ${company.emails.general}`,
    `Support email: ${company.emails.support}`,
    `Careers email: ${company.emails.careers}`,
    `Social: ${company.socials.map((s) => `${s.label} ${s.href}`).join(' · ')}`,
    `Headline numbers: ${headlineStats.map(fmtStat).join(' · ')}`,
    `Track record: ${trustSignals.map(fmtStat).join(' · ')}`,
    `Mission: ${missionVision.mission.title} — ${missionVision.mission.body}`,
    `Vision: ${missionVision.vision.title} — ${missionVision.vision.body}`,
  ].join('\n');
}

/** One line per service — cheap enough to sit in the system prompt. */
export function serviceIndex(): string {
  return services
    .map((s) => `- ${s.title} (/services/${s.slug}) — ${s.cardCopy}`)
    .join('\n');
}

/** Everything about one service. Returned by the `lookupService` tool. */
export function serviceDetail(slug: string) {
  const service = services.find((s) => s.slug === slug);
  if (!service) return null;

  return {
    title: service.title,
    slug: service.slug,
    url: `/services/${service.slug}`,
    category: service.category,
    headline: service.headline,
    summary: service.summary,
    approach: `${service.approach.title} ${service.approach.body}`,
    reality: `${service.reality.title} ${service.reality.body}`,
    pillars: service.pillars.map((p) => `${p.title}: ${p.description}`),
    capabilitiesIntro: service.capabilitiesIntro,
    capabilities: service.capabilities.map((c) => `${c.title}: ${c.description}`),
    stats: service.stats.map(fmtStat),
    callToAction: `${service.cta.title} ${service.cta.body}`,
  };
}

/**
 * Loose keyword match over the service catalogue, so a visitor asking about
 * "facebook ads" or "ranking on google" lands on the right service even though
 * neither phrase is a slug.
 */
export function findServices(query: string) {
  const needle = query.toLowerCase().trim();
  if (!needle) return services.map((s) => ({ slug: s.slug, title: s.title }));

  const words = needle.split(/\s+/).filter((w) => w.length > 2);

  const scored = services.map((service) => {
    const haystack = [
      service.slug,
      service.title,
      service.category,
      service.summary,
      service.cardCopy,
      service.capabilities.map((c) => `${c.title} ${c.description}`).join(' '),
      service.pillars.map((p) => `${p.title} ${p.description}`).join(' '),
    ]
      .join(' ')
      .toLowerCase();

    const score =
      (haystack.includes(needle) ? 5 : 0) +
      words.filter((word) => haystack.includes(word)).length;

    return { slug: service.slug, title: service.title, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ slug, title }) => ({ slug, title }));
}

export function faqList(topic?: string) {
  if (!topic) return faqs;
  const needle = topic.toLowerCase();
  const matches = faqs.filter(
    (f) => f.question.toLowerCase().includes(needle) || f.answer.toLowerCase().includes(needle),
  );
  return matches.length ? matches : faqs;
}

export function caseStudyList(category?: string) {
  const list = category
    ? caseStudies.filter((c) => c.category.toLowerCase().includes(category.toLowerCase()))
    : caseStudies;

  return (list.length ? list : caseStudies).map((c) => ({
    title: c.title,
    client: c.client,
    category: c.category,
    year: c.year,
    summary: c.summary,
    results: c.results.map((r) => `${r.label}: ${r.value}`),
    tags: c.tags,
    url: `/projects#${c.slug}`,
  }));
}

export function careerInfo() {
  return {
    openRoles: openRoles.map((r) => ({
      title: r.title,
      experience: r.experience,
      type: r.type,
      skills: r.skills,
    })),
    benefits: benefits.map((b) => `${b.title}: ${b.description}`),
    applyAt: '/careers',
    careersEmail: company.emails.careers,
  };
}

export function blogIndex(topic?: string) {
  const list = topic
    ? blogPosts.filter((p) =>
        `${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(topic.toLowerCase()),
      )
    : blogPosts;

  return (list.length ? list : blogPosts).map((p) => ({
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    date: p.date,
    readTime: p.readTime,
    url: `/blog/${p.slug}`,
  }));
}

export function aboutBrief() {
  return {
    story: timeline.map((t) => `${t.year} — ${t.title}: ${t.body}`),
    values: values.map((v) => `${v.title}: ${v.description}`),
    leadership: leadership.map((l) => ({ name: l.name, role: l.role, bio: l.bio })),
    founderQuote: `"${founderQuote.quote}" — ${founderQuote.attribution}`,
    testimonials: testimonials.map((t) => `"${t.quote}" — ${t.name} (${t.context})`),
  };
}

/* ------------------------------------------------------------------ */
/* Prompt-sized digest                                                 */
/* ------------------------------------------------------------------ */

/**
 * The always-on context injected into the public assistant's system prompt.
 * Deliberately an index rather than a dump — depth comes from the tools, which
 * keeps the per-turn token cost flat as the site grows.
 */
export const publicKnowledgeDigest = `
COMPANY
${companyBrief()}

SERVICES (use the lookupService tool for detail on any of these)
${serviceIndex()}

SITE MAP
/ (home) · /services · /projects (case studies) · /about · /team · /blog · /careers · /contact
/privacy-policy · /terms-conditions
`.trim();
