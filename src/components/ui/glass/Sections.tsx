"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";
import type { Stat } from "@/data/site";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  /** Small glass chips under the copy — usually numbers or credentials. */
  chips?: string[];
  align?: "left" | "center";
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, lede, actions, chips, align = "center", children }: PageHeroProps) {
  const centered = align === "center";

  return (
    <header className={cn("shell pt-10 pb-6 sm:pt-14", centered && "text-center")}>
      <Reveal immediate>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>

      <Reveal immediate delay={0.08}>
        <h1 className={cn("display-1 mt-5 text-balance", centered && "mx-auto max-w-5xl")}>{title}</h1>
      </Reveal>

      {lede ? (
        <Reveal immediate delay={0.16}>
          <p className={cn("lede archivo-font mt-6 max-w-3xl text-pretty", centered && "mx-auto")}>{lede}</p>
        </Reveal>
      ) : null}

      {chips?.length ? (
        <Reveal immediate delay={0.24}>
          <ul className={cn("mt-8 flex flex-wrap gap-2.5", centered && "justify-center")}>
            {chips.map((chip) => (
              <li key={chip} className="glass-pill">
                {chip}
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      {actions ? (
        <Reveal immediate delay={0.3}>
          <div className={cn("mt-9 flex flex-wrap gap-3", centered && "justify-center")}>{actions}</div>
        </Reveal>
      ) : null}

      {children}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Section heading                                                     */
/* ------------------------------------------------------------------ */

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <Reveal
      className={cn(
        "flex flex-col gap-5",
        !centered && action && "sm:flex-row sm:items-end sm:justify-between",
        centered && "items-center text-center",
        className
      )}
    >
      <div className={cn("max-w-3xl", centered && "mx-auto")}>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className={cn("display-2 text-balance", eyebrow && "mt-4")}>{title}</h2>
        {description ? <p className="lede archivo-font mt-5 text-pretty">{description}</p> : null}
      </div>
      {action ? <div className={cn("shrink-0", centered && "mt-2")}>{action}</div> : null}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Stats                                                               */
/* ------------------------------------------------------------------ */

export function StatGrid({
  stats,
  className,
  footnote,
}: {
  stats: Stat[];
  className?: string;
  footnote?: string;
}) {
  return (
    <div>
      <RevealGroup
        className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}
      >
        {stats.map((stat) => (
          <RevealItem key={stat.label}>
            <div className="glass glass-card h-full p-6 text-center sm:p-7">
              <p className="stat-value">
                <CountUp value={stat.value} decimals={stat.decimals ?? 0} suffix={stat.suffix} duration={1.8} />
              </p>
              <p className="clash-display-font mt-3 text-[0.68rem] uppercase tracking-[0.22em] text-soft">
                {stat.label}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
      {footnote ? (
        <Reveal delay={0.1}>
          <p className="body-copy archivo-font mx-auto mt-8 max-w-3xl text-center text-sm">{footnote}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Filters                                                             */
/* ------------------------------------------------------------------ */

export function FilterPills({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly string[];
  value: string;
  onChange: (next: string) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap justify-center gap-2.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          data-active={value === option}
          aria-pressed={value === option}
          className="glass-pill"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CTA band                                                            */
/* ------------------------------------------------------------------ */

type Action = { label: string; href: string; variant?: "brand" | "glass" | "ink" };

export function CTABand({
  eyebrow,
  title,
  body,
  actions,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  actions: Action[];
}) {
  return (
    <section className="section-tight">
      <div className="shell">
        <Reveal>
          <div className="glass-ink relative px-6 py-14 text-center sm:px-12 sm:py-20">
            {/* A second wash from the opposite corner keeps the panel from
                reading flat at large sizes. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full opacity-70 [background:radial-gradient(circle,rgb(var(--brand-rgb)/28%)_0%,transparent_68%)]"
            />
            <div className="relative">
              {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
              <h2 className="display-2 mx-auto mt-4 max-w-3xl text-balance">{title}</h2>
              <p className="archivo-font mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                {body}
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                {actions.map((action) => (
                  <Link
                    key={action.href + action.label}
                    href={action.href}
                    className={
                      action.variant === "glass"
                        ? "btn-glass !border-white/25 !bg-white/10 !text-white"
                        : action.variant === "ink"
                          ? "btn-ink"
                          : "btn-brand"
                    }
                  >
                    <span>{action.label}</span>
                    <span aria-hidden>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
