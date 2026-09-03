"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { AnimatedHeading } from "./Motion";
import type { Crumb } from "./GlassPage";

/* ------------------------------------------------------------------ */
/* 1. Big-type opening                                                 */
/* ------------------------------------------------------------------ */

/**
 * A page opening where the headline *is* the design.
 *
 * No panel, no card, no decoration — the type fills the viewport and a
 * single rule at the bottom carries the supporting copy, the actions and
 * the scroll cue. Everything else on the page is quieter than this.
 */
export function TypeHero({
  eyebrow,
  title,
  accent,
  lede,
  actions,
  crumbs,
  meta,
}: {
  eyebrow: string;
  title: string;
  /** Words rendered in the serif italic accent. */
  accent?: string;
  lede?: string;
  actions?: ReactNode;
  crumbs?: Crumb[];
  /** Optional right-hand fact, e.g. "9 years · 250+ clients". */
  meta?: string;
}) {
  return (
    <header className="type-hero">
      <div className="shell">
        {crumbs?.length ? (
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] uppercase tracking-[0.16em] text-soft">
              <li>
                <Link href="/" className="transition-colors hover:text-[var(--brand)]">
                  Home
                </Link>
              </li>
              {crumbs.map((crumb) => (
                <li key={crumb.label} className="flex items-center gap-3">
                  <span aria-hidden className="opacity-40">
                    /
                  </span>
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition-colors hover:text-[var(--brand)]">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-[var(--brand)]">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <Reveal immediate>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>

        <AnimatedHeading
          immediate
          as="h1"
          text={title}
          accent={accent}
          className="type-hero-title mt-6"
          delay={0.05}
        />
      </div>

      <div className="shell">
        <div className="type-hero-foot">
          {lede ? (
            <Reveal immediate delay={0.3}>
              <p className="lede text-pretty">{lede}</p>
            </Reveal>
          ) : (
            <span />
          )}

          <Reveal immediate delay={0.36}>
            <p className="text-[0.8125rem] text-soft lg:text-right">{meta}</p>
          </Reveal>

          {actions ? (
            <Reveal immediate delay={0.42}>
              <div className="flex flex-wrap gap-3">{actions}</div>
            </Reveal>
          ) : null}
        </div>

        <div className="mt-8 flex justify-center">
          <span className="type-hero-cue" aria-hidden>
            <span />
            <span>Scroll</span>
          </span>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Sticky split                                                     */
/* ------------------------------------------------------------------ */

/**
 * A pinned left column beside a scrolling right column.
 *
 * The section title stays in view while its content moves past, which is
 * what keeps long copy — and this site has a lot of it — legible without
 * repeating headings every few hundred pixels.
 */
export function SplitSection({
  eyebrow,
  title,
  accent,
  description,
  aside,
  children,
  id,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  /** Extra content under the pinned heading, e.g. a link or a stat. */
  aside?: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="section-tight">
      <div className="shell split">
        <div className="split-aside">
          <Reveal>
            <p className="eyebrow">{eyebrow}</p>
          </Reveal>
          <AnimatedHeading as="h2" text={title} accent={accent} className="display-2 mt-3" />
          {description ? (
            <Reveal delay={0.1}>
              <p className="body-copy mt-4 max-w-sm">{description}</p>
            </Reveal>
          ) : null}
          {aside ? (
            <Reveal delay={0.16}>
              <div className="mt-7">{aside}</div>
            </Reveal>
          ) : null}
        </div>

        <div>{children}</div>
      </div>
    </section>
  );
}

export type SplitEntry = {
  href?: string;
  title: string;
  description: string;
  meta?: string;
  image?: string;
};

/** The rows that live in the right column of a SplitSection. */
export function SplitRows({ entries }: { entries: SplitEntry[] }) {
  return (
    <div className="split-rows">
      {entries.map((entry, index) => {
        const body = (
          <>
            <span className="split-row-index">{String(index + 1).padStart(2, "0")}</span>

            <div>
              <h3 className="display-3">{entry.title}</h3>
              <p className="body-copy mt-2">{entry.description}</p>
            </div>

            {entry.image ? (
              <span className="split-row-thumb hidden md:block" aria-hidden>
                <Image src={entry.image} alt="" fill sizes="88px" className="object-cover" />
              </span>
            ) : entry.meta ? (
              <span className="hidden whitespace-nowrap pt-1 text-[0.75rem] text-soft md:block">{entry.meta}</span>
            ) : null}
          </>
        );

        return entry.href ? (
          <Link key={entry.title} href={entry.href} className="split-row group">
            {body}
          </Link>
        ) : (
          <div key={entry.title} className="split-row">
            {body}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Image-led band                                                   */
/* ------------------------------------------------------------------ */

/**
 * Full-bleed media with a frosted panel sitting on it. This is where the
 * glass material actually earns its keep — there is a photograph behind
 * it to refract, which is what the reference design does.
 */
export function ImageBand({
  image,
  eyebrow,
  title,
  body,
  action,
  priority = false,
}: {
  image: string;
  eyebrow?: string;
  title: ReactNode;
  body?: string;
  action?: ReactNode;
  priority?: boolean;
}) {
  return (
    <section className="section-tight">
      <div className="shell">
        <Reveal>
          <div className="band">
            <div className="band-media">
              <Image src={image} alt="" fill priority={priority} sizes="100vw" className="object-cover" />
            </div>
            <div className="band-scrim" />
            <div className="band-panel">
              {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
              <p className="display-2 mt-3">{title}</p>
              {body ? <p className="body-copy mt-4">{body}</p> : null}
              {action ? <div className="mt-7 flex flex-wrap gap-3">{action}</div> : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
