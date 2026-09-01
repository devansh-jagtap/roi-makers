"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import GlassPage from "@/components/ui/glass/GlassPage";
import { CTABand, PageHero, SectionHeading, StatGrid } from "@/components/ui/glass/Sections";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/glass/Reveal";
import { serviceBySlug, services } from "@/data/site";

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const service = serviceBySlug(slug);

  if (!service) notFound();

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <GlassPage crumbs={[{ label: "Services", href: "/services" }, { label: service.title }]}>
      <PageHero
        eyebrow={service.eyebrow}
        title={service.headline}
        lede={service.summary}
        align="left"
        actions={
          <>
            <Link href="/contact#contact-form" className="btn-brand">
              <span>{service.cta.label}</span>
              <span aria-hidden>→</span>
            </Link>
            <Link href="/services" className="btn-glass">
              <span aria-hidden>←</span>
              <span>All services</span>
            </Link>
          </>
        }
      >
        <Reveal immediate delay={0.36} className="mt-12">
          <div className="frame frame-lg media-zoom group relative aspect-[21/9]">
            <Image
              src={service.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <span className="glass-pill absolute bottom-5 left-5 !border-white/25 !bg-white/15 !text-white">
              {service.category}
            </span>
          </div>
        </Reveal>
      </PageHero>

      {/* ---------------------------------------------------------- */}
      <section className="section">
        <div className="shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Reveal>
            <p className="eyebrow">The ROI Makers way</p>
            <h2 className="display-2 mt-4 text-balance">{service.approach.title}</h2>
            <p className="body-copy archivo-font mt-6 text-pretty">{service.approach.body}</p>
          </Reveal>

          <RevealGroup className="grid gap-4">
            {service.pillars.map((pillar) => (
              <RevealItem key={pillar.title}>
                <div className="glass glass-card p-6">
                  <h3 className="display-4">{pillar.title}</h3>
                  <p className="body-copy archivo-font mt-2 text-sm">{pillar.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      <section className="section-tight">
        <div className="shell">
          <SectionHeading eyebrow="Numbers, not promises" title={service.statsTitle} align="center" />
          <div className="mt-12">
            <StatGrid
              stats={service.stats}
              className="sm:grid-cols-2 lg:grid-cols-3"
              footnote={service.statsFooter}
            />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      <section className="section-tight">
        <div className="shell">
          <Reveal>
            <div className="glass-ink px-6 py-12 sm:px-12 sm:py-16">
              <p className="eyebrow">Let&rsquo;s be straight about this</p>
              <h2 className="display-2 mt-4 max-w-3xl text-balance">{service.reality.title}</h2>
              <p className="archivo-font mt-6 max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">
                {service.reality.body}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      <section className="section-tight">
        <div className="shell">
          <SectionHeading
            eyebrow="What's included"
            title="Every part of it. Covered."
            description={service.capabilitiesIntro}
          />

          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {service.capabilities.map((capability, index) => (
              <RevealItem key={capability.title} className="h-full">
                <div className="glass glass-card h-full p-6">
                  <span className="clash-display-font text-[0.68rem] tabular-nums tracking-[0.2em] text-[var(--brand)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display-4 mt-3">{capability.title}</h3>
                  <p className="body-copy archivo-font mt-3 text-sm">{capability.description}</p>
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
            eyebrow="Keep going"
            title="Pairs well with"
            action={
              <Link href="/services" className="btn-glass group">
                <span className="link-arrow">
                  <span>All services</span>
                  <span aria-hidden>↗</span>
                </span>
              </Link>
            }
          />

          <RevealGroup className="mt-10 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <RevealItem key={item.slug} className="h-full">
                <Link href={`/services/${item.slug}`} className="group block h-full">
                  <div className="glass glass-card flex h-full items-center gap-4 p-4">
                    <div className="media-zoom relative h-20 w-24 shrink-0 overflow-hidden rounded-[var(--radius-glass-sm)]">
                      <Image src={item.image} alt="" fill sizes="120px" className="object-cover" />
                    </div>
                    <div>
                      <h3 className="display-4">{item.title}</h3>
                      <span className="link-arrow clash-display-font mt-1 text-[0.62rem] uppercase tracking-[0.2em] text-[var(--brand)]">
                        <span>Explore</span>
                        <span aria-hidden>↗</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CTABand
        eyebrow="Next step"
        title={service.cta.title}
        body={service.cta.body}
        actions={[
          { label: service.cta.label, href: "/contact#contact-form" },
          { label: "See the work", href: "/projects", variant: "glass" },
        ]}
      />
    </GlassPage>
  );
}
