"use client";

import Image from "next/image";
import Link from "next/link";
import GlassPage from "@/components/ui/glass/GlassPage";
import { HeroStage } from "@/components/ui/glass/HeroStage";
import { aboutStage } from "@/data/stage";
import { CTABand, SectionHeading, StatGrid } from "@/components/ui/glass/Sections";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/glass/Reveal";
import {
  capabilitiesList,
  company,
  founderQuote,
  headlineStats,
  leadership,
  missionVision,
  timeline,
  trustSignals,
  values,
} from "@/data/site";

/* Swap these two for real studio photography when it exists — the poster
   art in /public/images/stack is placeholder work, not ROI Makers. */
const stackShots = [
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80",
];

export default function AboutPage() {
  return (
    <GlassPage>
      <HeroStage
        eyebrow="Get to know us"
        title={
          <>
            Nine years deep.
            <br />
            <span className="display-accent">Still obsessed.</span>
          </>
        }
        lede="We started with one belief: creative work should drive revenue, not just win awards. Today, 250+ brands trust us with their growth because we trade in results, not reports. Indore-born. Globally proven."
        actions={
          <>
            <Link href="/contact#contact-form" className="btn-brand">
              <span>Work with us</span>
              <span aria-hidden>→</span>
            </Link>
            <Link href="/projects" className="btn-glass">
              <span>Explore our work</span>
            </Link>
          </>
        }
        cards={aboutStage}
        crumbs={[{ label: "About" }]}
      />

      {/* ---------------------------------------------------------- */}
      <section className="section-tight">
        <div className="shell grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="grid gap-6">
            <Reveal>
              <div className="glass glass-card p-7 sm:p-10">
                <p className="eyebrow">Why we exist</p>
                <h2 className="display-3 mt-4 text-balance">
                  We design conversion machines disguised as beautiful campaigns.
                </h2>
                <p className="body-copy archivo-font mt-5">
                  Every pixel, every line of copy, every targeting parameter exists for one reason: turning your
                  marketing budget into a revenue multiplier. Our cross-functional squads blend art with algorithms,
                  creating experiences that captivate audiences while feeding your bottom line.
                </p>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {capabilitiesList.map((item) => (
                    <li key={item} className="clash-display-font flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.18em] text-soft">
                      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2">
              <Reveal delay={0.08}>
                <div className="glass glass-card h-full p-6">
                  <p className="eyebrow">Headquarters</p>
                  <p className="display-4 mt-3">Indore · Madhya Pradesh</p>
                  <p className="body-copy archivo-font mt-2 text-sm">{company.address}</p>
                </div>
              </Reveal>
              <Reveal delay={0.16}>
                <div className="glass-ink h-full p-6">
                  <p className="eyebrow">Focus</p>
                  <p className="display-4 mt-3">Revenue-obsessed squads</p>
                  <p className="archivo-font mt-2 text-sm leading-relaxed text-white/70">
                    Growth · Brand · Analytics · Tech
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="grid gap-6">
            {stackShots.map((src, index) => (
              <Reveal key={src} delay={0.1 + index * 0.1} from="left">
                <div className="frame frame-lg media-zoom group relative aspect-[4/3]">
                  <Image
                    src={src}
                    alt="Inside the studio"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority={index === 0}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      <section className="section-tight">
        <div className="shell">
          <SectionHeading
            eyebrow="Stats"
            title="Experts in the business."
            description="No vanity metrics. Every number here represents a business that grew because of decisions we made together."
            align="center"
          />
          <div className="mt-12 grid gap-4">
            <StatGrid stats={headlineStats} />
            <StatGrid stats={trustSignals} />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      <section className="section-tight">
        <div className="shell">
          <SectionHeading eyebrow="Our story" title="Mission and vision." />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[missionVision.mission, missionVision.vision].map((block, index) => (
              <Reveal key={block.title} delay={index * 0.1}>
                <div className="glass glass-card h-full p-7 sm:p-9">
                  <p className="eyebrow">{index === 0 ? "Mission" : "Vision"}</p>
                  <h3 className="display-3 mt-4 text-balance">{block.title}</h3>
                  <p className="body-copy archivo-font mt-4">{block.body}</p>
                  <div className="hairline my-6" />
                  <ul className="grid gap-3">
                    {block.points.map((point) => (
                      <li key={point} className="body-copy archivo-font flex gap-3 text-sm">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      <section className="section-tight">
        <div className="shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <p className="eyebrow">The ROI Makers story</p>
            <h2 className="display-2 mt-4 text-balance">A journey built on grit, growth and results.</h2>
            <p className="body-copy archivo-font mt-5">
              From a laptop in a home office to one of Indore&rsquo;s most recognised digital marketing agencies. The
              journey is proof that when strategy meets passion, results are inevitable.
            </p>
            <figure className="glass glass-card mt-8 p-6">
              <blockquote className="display-4 text-balance">&ldquo;{founderQuote.quote}&rdquo;</blockquote>
              <figcaption className="clash-display-font mt-4 text-[0.65rem] uppercase tracking-[0.22em] text-soft">
                {founderQuote.attribution}
              </figcaption>
            </figure>
          </Reveal>

          <RevealGroup className="relative grid gap-4">
            {timeline.map((item) => (
              <RevealItem key={item.year}>
                <div className="glass glass-card flex flex-col gap-4 p-6 sm:flex-row sm:gap-7 sm:p-7">
                  <p className="clash-display-font shrink-0 text-sm uppercase tracking-[0.18em] text-[var(--brand)] sm:w-24">
                    {item.year}
                  </p>
                  <div>
                    <h3 className="display-4">{item.title}</h3>
                    <p className="body-copy archivo-font mt-2 text-sm">{item.body}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      <section className="section-tight">
        <div className="shell">
          <SectionHeading
            eyebrow="Leadership"
            title="The architects behind your next breakthrough."
            description="Our leadership doesn't talk strategy from corner offices. They're in the work daily — optimising campaigns, reviewing creative and obsessing over conversion rates alongside the squads."
          />

          <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
            {leadership.map((person) => (
              <RevealItem key={person.name} className="h-full">
                <article className="glass glass-card group flex h-full flex-col">
                  <div className="media-zoom relative aspect-[4/5] overflow-hidden rounded-t-[inherit]">
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="display-3 text-white">{person.name}</p>
                      <p className="clash-display-font mt-1 text-[0.65rem] uppercase tracking-[0.22em] text-[var(--brand-bright)]">
                        {person.role}
                      </p>
                    </div>
                  </div>
                  <p className="body-copy archivo-font p-6 text-sm">{person.bio}</p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      <section className="section-tight">
        <div className="shell">
          <SectionHeading eyebrow="Our values" title="What moves us forward." align="center" />

          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-2">
            {values.map((value) => (
              <RevealItem key={value.title} className="h-full">
                <div className="glass glass-card h-full p-7">
                  <h3 className="display-3">{value.title}</h3>
                  <p className="body-copy archivo-font mt-3">{value.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CTABand
        eyebrow="Ready to scale"
        title="Stop settling for marketing that looks good in reports."
        body="Tell us where you are. We'll tell you exactly where you can go and how we get there — no fluff, no filler."
        actions={[
          { label: "Start a project", href: "/contact#contact-form" },
          { label: "See our services", href: "/services", variant: "glass" },
        ]}
      />
    </GlassPage>
  );
}
