"use client";

import Image from "next/image";
import Link from "next/link";
import GlassPage from "@/components/ui/glass/GlassPage";
import { Reveal } from "@/components/ui/glass/Reveal";
import { AnimatedHeading, Magnetic } from "@/components/ui/glass/Motion";
import { IndexList } from "@/components/ui/glass/IndexList";
import { HeroStage } from "@/components/ui/glass/HeroStage";
import { servicesStage } from "@/data/stage";
import { CountUp } from "@/components/ui/count-up";
import { headlineStats, services, testimonials } from "@/data/site";

const engagement = [
  {
    week: "01",
    title: "Audit",
    body: "Your tracking, your campaign history, your competitors. We find out what is actually happening before anyone proposes anything.",
  },
  {
    week: "02",
    title: "Strategy",
    body: "A prioritised plan with projected ROI — channel mix, funnel architecture, and a specific intervention at each stage of the buyer journey.",
  },
  {
    week: "03",
    title: "Launch",
    body: "Live campaigns with real-time dashboards. Actionable data inside 30 days, measurable ROI movement inside 90.",
  },
];

export default function ServicesPage() {
  return (
    <GlassPage>
      {/* ── Hero: frosted panel over a stage of real work ────────── */}
      <HeroStage
        eyebrow="What we do"
        title={
          <>
            We don&rsquo;t offer services.
            <br />
            We engineer growth <span className="display-accent">systems.</span>
          </>
        }
        lede="Every solution we build is tied to one question: what will actually move your numbers? From the first click to the final conversion, we own the outcome with you."
        cards={servicesStage}
        crumbs={[{ label: "Services" }]}
        actions={
          <>
            <Magnetic>
              <Link href="/contact#contact-form" className="btn-brand">
                <span>Get a free strategy audit</span>
                <span aria-hidden>→</span>
              </Link>
            </Magnetic>
            <Link href="/projects" className="btn-glass">
              <span>See the work</span>
            </Link>
          </>
        }
      />

      {/* Numbers as a rule-separated row, not four boxes. */}
      <div className="shell">
        <Reveal>
          <dl className="grid grid-cols-2 border-y border-[var(--rule)] lg:grid-cols-4">
            {headlineStats.map((stat, index) => (
              <div
                key={stat.label}
                className={`px-1 py-6 lg:px-6 ${index > 0 ? "lg:border-l lg:border-[var(--rule)]" : ""} ${
                  index % 2 === 1 ? "border-l border-[var(--rule)] pl-5 lg:pl-6" : ""
                }`}
              >
                <dd className="stat-value">
                  <CountUp value={stat.value} decimals={stat.decimals ?? 0} suffix={stat.suffix} duration={1.8} />
                </dd>
                <dt className="mt-2 text-[0.8125rem] text-soft">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* ── Capabilities as an index ─────────────────────────────── */}
      <section id="all-services" className="section">
        <div className="shell">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow">Capabilities</p>
              <AnimatedHeading as="h2" text="Eight practices. One operating system." className="display-2 mt-3" />
            </div>
            <p className="body-copy max-w-sm">
              A campaign, the page it lands on and the listing it sells through are never three separate
              conversations here.
            </p>
          </Reveal>

          <IndexList
            entries={services.map((service) => ({
              href: `/services/${service.slug}`,
              title: service.title,
              meta: service.category,
              description: service.cardCopy,
              image: service.image,
            }))}
          />
        </div>
      </section>

      {/* ── Full-bleed image band ────────────────────────────────── */}
      <section className="section-tight">
        <div className="shell">
          <Reveal>
            <figure className="frame frame-lg relative aspect-[16/9] w-full sm:aspect-[21/9]">
              <Image src={services[0].image} alt="" fill sizes="100vw" className="object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 bg-gradient-to-t from-black/80 to-transparent p-6 sm:p-10">
                <p className="display-2 max-w-lg text-white">
                  Impressions alone don&rsquo;t grow brands. <span className="display-accent">Revenue does.</span>
                </p>
                <Link href="/projects" className="btn-glass on-media !text-white">
                  <span>See the proof</span>
                  <span aria-hidden>→</span>
                </Link>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ── Process: sticky heading, scrolling steps ─────────────── */}
      <section className="section-tight">
        <div className="shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Reveal className="lg:sticky lg:top-28">
            <p className="eyebrow">How an engagement runs</p>
            <AnimatedHeading
              as="h2"
              text="Three weeks from first call to live campaigns."
              className="display-2 mt-3"
            />
            <p className="body-copy mt-4 max-w-sm">
              We move fast because velocity creates competitive advantages that budget can&rsquo;t buy.
            </p>
          </Reveal>

          <div className="border-t border-[var(--rule)]">
            {engagement.map((step, index) => (
              <Reveal key={step.week} delay={index * 0.08}>
                <div className="grid grid-cols-[3rem_1fr] gap-5 border-b border-[var(--rule)] py-8">
                  <span className="stat-value stat-value-sm text-[var(--brand)]">{step.week}</span>
                  <div>
                    <h3 className="display-3">{step.title}</h3>
                    <p className="body-copy mt-2">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quotes ───────────────────────────────────────────────── */}
      <section className="section-tight">
        <div className="shell">
          <Reveal className="mb-10">
            <p className="eyebrow">Client wins</p>
            <AnimatedHeading as="h2" text="Straight from the brands." className="display-2 mt-3" />
          </Reveal>

          <div className="grid border-t border-[var(--rule)] md:grid-cols-3">
            {testimonials.map((item, index) => (
              <Reveal key={item.name} delay={index * 0.1}>
                <figure
                  className={`h-full border-b border-[var(--rule)] px-1 py-8 md:px-7 ${
                    index > 0 ? "md:border-l md:border-[var(--rule)]" : ""
                  }`}
                >
                  <blockquote className="display-3 text-pretty font-normal">&ldquo;{item.quote}&rdquo;</blockquote>
                  <figcaption className="mt-6">
                    <p className="text-[0.875rem] font-semibold">{item.name}</p>
                    <p className="mt-0.5 text-[0.8125rem] text-soft">{item.context}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA: black plate ─────────────────────────────────────── */}
      <section className="section-tight">
        <div className="shell">
          <Reveal>
            <div className="glass-ink grid gap-8 p-8 sm:p-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <p className="eyebrow">Let&rsquo;s talk growth</p>
                <p className="display-1 mt-4 text-white">
                  Your next move <span className="display-accent">starts here.</span>
                </p>
              </div>
              <div>
                <p className="body-copy !text-white/65">
                  Tell us where you are. We&rsquo;ll tell you exactly where you can go and how we get there. No fluff,
                  no filler.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Magnetic>
                    <Link href="/contact#contact-form" className="btn-brand">
                      <span>Start a project</span>
                      <span aria-hidden>→</span>
                    </Link>
                  </Magnetic>
                  <Link href="/contact" className="btn-glass !border-white/25 !bg-white/10 !text-white">
                    <span>Book a call</span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </GlassPage>
  );
}
