"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GlassPage from "@/components/ui/glass/GlassPage";
import { HeroStage } from "@/components/ui/glass/HeroStage";
import { projectsStage } from "@/data/stage";
import { CTABand, FilterPills, SectionHeading } from "@/components/ui/glass/Sections";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/glass/Reveal";
import { caseStudies, caseStudyCategories, creators, headlineStats, type CaseStudy } from "@/data/site";
import { CountUp } from "@/components/ui/count-up";

function ResultRow({ results }: { results: CaseStudy["results"] }) {
  return (
    <dl className="mt-6 grid grid-cols-3 gap-3">
      {results.map((result) => (
        <div key={result.label} className="glass glass-sm glass-soft p-3 text-center">
          <dt className="sr-only">{result.label}</dt>
          <dd className="stat-value stat-value-sm">{result.value}</dd>
          <p className="clash-display-font mt-1 text-[0.55rem] uppercase tracking-[0.16em] text-soft">
            {result.label}
          </p>
        </div>
      ))}
    </dl>
  );
}

export default function ProjectsPage() {
  const [category, setCategory] = useState("All");

  const visible = useMemo(
    () => (category === "All" ? caseStudies : caseStudies.filter((item) => item.category === category)),
    [category]
  );

  const [feature, ...rest] = visible;

  return (
    <GlassPage>
      <HeroStage
        eyebrow="Our work"
        title={
          <>
            Built with <span className="display-accent">intent.</span>
          </>
        }
        lede="A glimpse into the brands we've worked with and the results we've delivered through focused, performance-led marketing."
        actions={
          <>
            <Link href="/contact#contact-form" className="btn-brand">
              <span>Start a project</span>
              <span aria-hidden>→</span>
            </Link>
            <Link href="/services" className="btn-glass">
              <span>What we do</span>
            </Link>
          </>
        }
        cards={projectsStage}
        crumbs={[{ label: "Work" }]}
      />

      <section className="section-tight">
        <div className="shell">
          <Reveal>
            <FilterPills
              label="Filter work by category"
              options={caseStudyCategories}
              value={category}
              onChange={setCategory}
            />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      <section className="pb-[var(--section-y)]">
        <div className="shell">
          {feature ? (
            <Reveal key={feature.slug}>
              <article className="glass glass-card group grid gap-0 overflow-hidden lg:grid-cols-2">
                <div className="media-zoom relative min-h-[280px] overflow-hidden lg:min-h-[460px]">
                  <Image
                    src={feature.image}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent lg:bg-gradient-to-r" />
                  <span className="glass-pill absolute left-5 top-5 !border-white/25 !bg-white/15 !text-white">
                    Featured
                  </span>
                </div>

                <div className="flex flex-col justify-center p-7 sm:p-10">
                  <div className="clash-display-font flex flex-wrap items-center gap-3 text-[0.65rem] uppercase tracking-[0.2em] text-soft">
                    <span className="text-[var(--brand)]">{feature.category}</span>
                    <span aria-hidden className="opacity-40">
                      /
                    </span>
                    <span>{feature.client}</span>
                    <span aria-hidden className="opacity-40">
                      /
                    </span>
                    <span>{feature.year}</span>
                  </div>
                  <h2 className="display-3 mt-4 text-balance">{feature.title}</h2>
                  <p className="body-copy archivo-font mt-4">{feature.summary}</p>
                  <ResultRow results={feature.results} />
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {feature.tags.map((tag) => (
                      <li key={tag} className="glass-pill !py-1.5 !text-[0.6rem]">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ) : null}

          <RevealGroup className="mt-6 grid gap-6 md:grid-cols-2">
            {rest.map((project) => (
              <RevealItem key={project.slug} className="h-full">
                <article className="glass glass-card group flex h-full flex-col">
                  <div className="media-zoom relative aspect-[16/10] overflow-hidden rounded-t-[inherit]">
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-5">
                      {project.tags.map((tag) => (
                        <span key={tag} className="glass-pill !border-white/25 !bg-white/15 !py-1.5 !text-[0.58rem] !text-white">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    <div className="clash-display-font flex items-center justify-between text-[0.62rem] uppercase tracking-[0.2em] text-soft">
                      <span className="text-[var(--brand)]">{project.category}</span>
                      <span>{project.year}</span>
                    </div>
                    <h3 className="display-4 mt-3 text-balance">{project.title}</h3>
                    <p className="body-copy archivo-font mt-3 flex-1 text-sm">{project.summary}</p>
                    <ResultRow results={project.results} />
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>

          {visible.length === 0 ? (
            <Reveal>
              <p className="body-copy archivo-font py-16 text-center">
                Nothing in that category yet. Try another filter.
              </p>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      <section className="section-tight">
        <div className="shell">
          <SectionHeading
            eyebrow="The scoreboard"
            title="What nine years of work adds up to."
            align="center"
          />
          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {headlineStats.map((stat) => (
              <RevealItem key={stat.label}>
                <div className="glass glass-card h-full p-6 text-center">
                  <p className="stat-value">
                    <CountUp value={stat.value} decimals={stat.decimals ?? 0} suffix={stat.suffix} duration={1.8} />
                  </p>
                  <p className="clash-display-font mt-3 text-[0.65rem] uppercase tracking-[0.22em] text-soft">
                    {stat.label}
                  </p>
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
            eyebrow="Influencers"
            title="People who get the brief… and the business."
            description="No fake hype here. Just creators who know how to make something, connect with an audience, and actually move the needle for brands."
          />
          <Reveal delay={0.1}>
            <ul className="mt-10 flex flex-wrap gap-2.5">
              {creators.map((handle) => (
                <li key={handle} className="glass-pill !normal-case !tracking-[0.06em]">
                  {handle}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <CTABand
        eyebrow="Your turn"
        title="Ready to start your project?"
        body="Let's create something extraordinary together. Tell us about your vision and we'll show you the path from where you are to where you want to be."
        actions={[
          { label: "Start a project", href: "/contact#contact-form" },
          { label: "Read the blog", href: "/blog", variant: "glass" },
        ]}
      />
    </GlassPage>
  );
}
