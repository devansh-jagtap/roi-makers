"use client";

import Image from "next/image";
import Link from "next/link";
import GlassPage from "@/components/ui/glass/GlassPage";
import { HeroStage } from "@/components/ui/glass/HeroStage";
import { aboutStage } from "@/data/stage";
import { CTABand, SectionHeading, StatGrid } from "@/components/ui/glass/Sections";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/glass/Reveal";
import { Magnetic } from "@/components/ui/glass/Motion";
import { WordReveal } from "@/components/ui/motion/WordReveal";
import { Parallax } from "@/components/ui/motion/Parallax";
import { TiltCard } from "@/components/ui/motion/TiltCard";
import { ClipReveal } from "@/components/ui/motion/ClipReveal";
import { StoryTimeline, type GalleryImage } from "@/components/sections/about/StoryTimeline";
import {
  capabilitiesList,
  company,
  founderQuote,
  headlineStats,
  leadership,
  missionVision,
  partners,
  timeline,
  trustSignals,
  values,
} from "@/data/site";

/* Studio photography beside the "why we exist" copy. */
const studioShots = [
  { src: "/about/team-desk.webp", alt: "Amit Sharma reviewing a plan with the ROI Makers team" },
  { src: "/amit.webp", alt: "Amit Sharma, founder of ROI Makers, at his desk" },
];

/* The circle bento beside the timeline — eight photos, founder-heavy. */
const storyGallery: GalleryImage[] = [
  { src: "/team_picture/4.webp", alt: "Amit Sharma", size: "xs" },
  { src: "/about/amit-square.webp", alt: "Amit Sharma at his desk", size: "md" },
  { src: "/about/team-desk.webp", alt: "The team around the founder's desk", size: "lg" },
  { src: "/team_picture/2.webp", alt: "Tripti Ray", size: "sm" },
  { src: "/about/amit-desk-square.webp", alt: "Amit Sharma signing off a plan", size: "xl" },
  { src: "/team_picture/3.webp", alt: "Harshita Sharma", size: "base" },
  { src: "/team_picture/5.webp", alt: "Vijay Vishwakarma", size: "sm" },
  { src: "/amit.webp", alt: "Amit Sharma", size: "lg" },
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
            <Magnetic>
              <Link href="/contact#contact-form" className="btn-brand">
                <span>Work with us</span>
                <span aria-hidden>→</span>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/projects" className="btn-glass">
                <span>Explore our work</span>
              </Link>
            </Magnetic>
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
                  <WordReveal>We design conversion machines disguised as beautiful campaigns.</WordReveal>
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
            {studioShots.map((shot, index) => (
              <Reveal key={shot.src} delay={0.1 + index * 0.1} from="left">
                <div className="frame frame-lg group relative aspect-[4/3]">
                  <Parallax distance={index === 0 ? 44 : -36}>
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority={index === 0}
                      className="object-cover"
                    />
                  </Parallax>
                  <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/45 via-transparent to-transparent" />
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
            title={<WordReveal>Experts in the business.</WordReveal>}
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
          <SectionHeading
            eyebrow="Our partners"
            title={<WordReveal>The platforms and teams we build with.</WordReveal>}
            description="Certified, connected, and in the room — the partners behind the campaigns, the tooling, and the reach we bring to every client."
            align="center"
          />
          <RevealGroup className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-5">
            {partners.map((partner) => (
              <RevealItem
                key={partner.name}
                className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.84rem)] lg:w-[calc(25%-0.94rem)]"
              >
                <figure className="glass glass-card flex h-full flex-col items-center p-4 sm:p-5">
                  <div className="relative aspect-[5/3] w-full overflow-hidden rounded-xl bg-white">
                    <Image
                      src={partner.logo}
                      alt={partner.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-contain p-5 sm:p-6"
                    />
                  </div>
                  <figcaption className="clash-display-font mt-4 text-[0.62rem] uppercase tracking-[0.2em] text-soft">
                    {partner.name}
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      <section className="section-tight">
        <div className="shell">
          <SectionHeading eyebrow="Our story" title={<WordReveal>Mission and vision.</WordReveal>} />

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
      <StoryTimeline eyebrow="The ROI Makers story" milestones={timeline} gallery={storyGallery} />

      {/* ---------------------------------------------------------- */}
      <section className="section-tight">
        <div className="shell">
          <Reveal>
            <div className="glass-ink founder-band">
              <div className="founder-band-copy">
                <p className="eyebrow">From the founder</p>
                <blockquote className="display-2 mt-4 max-w-xl text-balance">
                  <WordReveal>{`“${founderQuote.quote}”`}</WordReveal>
                </blockquote>
                <p className="archivo-font mt-5 max-w-lg text-base leading-relaxed text-white/70">
                  From a laptop in a home office to one of Indore&rsquo;s most recognised digital marketing agencies.
                  The journey is proof that when strategy meets passion, results are inevitable.
                </p>
                <p className="clash-display-font mt-6 text-[0.65rem] uppercase tracking-[0.22em] text-[var(--brand-bright)]">
                  {founderQuote.attribution}
                </p>
              </div>
              <ClipReveal from="bottom" className="founder-band-figure">
                <Image
                  src="/amit-masked.webp"
                  alt="Amit Sharma, Founder & CEO of ROI Makers"
                  width={750}
                  height={332}
                  sizes="(max-width: 900px) 100vw, 45vw"
                />
              </ClipReveal>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      <section className="section-tight">
        <div className="shell">
          <SectionHeading
            eyebrow="Leadership"
            title={<WordReveal>The architects behind your next breakthrough.</WordReveal>}
            description="Our leadership doesn't talk strategy from corner offices. They're in the work daily — optimising campaigns, reviewing creative and obsessing over conversion rates alongside the squads."
          />

          <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
            {leadership.map((person, index) => (
              <RevealItem key={person.name} className="h-full">
                <article className="glass glass-card group flex h-full flex-col">
                  <ClipReveal from="bottom" delay={index * 0.12} className="media-zoom relative aspect-[4/5] overflow-hidden rounded-t-[inherit]">
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
                  </ClipReveal>
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
          <SectionHeading eyebrow="Our values" title={<WordReveal>What moves us forward.</WordReveal>} align="center" />

          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <RevealItem key={value.title} className="h-full">
                <TiltCard className="h-full">
                  <div className="glass glass-card flex h-full flex-col p-7">
                    <span className="value-index" aria-hidden>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="display-3 mt-5">{value.title}</h3>
                    <p className="body-copy archivo-font mt-3">{value.description}</p>
                  </div>
                </TiltCard>
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
