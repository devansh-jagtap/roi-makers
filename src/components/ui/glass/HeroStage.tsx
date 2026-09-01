"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "./Reveal";
import type { Crumb } from "./GlassPage";

export type StageCard = {
  /** Small label above the line, e.g. a channel or client name. */
  tag: string;
  /** The line of content the card shows. */
  line: string;
  /** Byline under the content. */
  meta: string;
  /** How far back the card sits — drives blur and opacity. */
  depth: "far" | "mid" | "near";
  /** Absolute placement, as raw CSS values. */
  style: CSSProperties;
};

/**
 * The opening of every marketing page.
 *
 * Two jobs. First, it fills the viewport, so a page starts with something
 * to look at rather than a breadcrumb floating in dead space. Second, it
 * gives the frosted panel something to refract — a spread of real client
 * outcomes, staggered in depth so the far ones carry a blur filter and the
 * near ones stay sharp. That layering is what reads as glass; a translucent
 * fill over a flat background just reads as grey.
 */
export function HeroStage({
  eyebrow,
  title,
  lede,
  actions,
  cards,
  crumbs,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  cards: StageCard[];
  crumbs?: Crumb[];
  align?: "center" | "left";
}) {
  const centered = align === "center";

  return (
    <section className="stage">
      {/* Behind: the content the panel refracts. */}
      <div className="stage-layer" aria-hidden>
        {cards.map((card) => (
          <div key={card.tag + card.line} className="stage-card" data-depth={card.depth} style={card.style}>
            <p className="stage-card-tag">
              <span className="stage-dot" />
              {card.tag}
            </p>
            <p className="stage-card-line">{card.line}</p>
            <p className="stage-card-meta">{card.meta}</p>
          </div>
        ))}
        <div className="stage-fade" />
      </div>

      {/* Breadcrumb rides inside the stage so the page has no dead top. */}
      {crumbs?.length ? (
        <nav aria-label="Breadcrumb" className="stage-crumbs shell">
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

      {/* In front: the panel. */}
      <div className="stage-content shell">
        <Reveal immediate>
          <div className={`glass-panel stage-panel ${centered ? "text-center" : ""}`}>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="display-1 mt-5 text-balance">{title}</h1>
            {lede ? (
              <p className={`lede mt-6 text-pretty ${centered ? "mx-auto max-w-xl" : "max-w-xl"}`}>{lede}</p>
            ) : null}
            {actions ? (
              <div className={`mt-9 flex flex-wrap gap-3 ${centered ? "justify-center" : ""}`}>{actions}</div>
            ) : null}
          </div>
        </Reveal>
      </div>

      <div className="stage-cue" aria-hidden>
        <span className="stage-cue-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}

export default HeroStage;
