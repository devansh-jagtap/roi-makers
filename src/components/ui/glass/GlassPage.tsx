import Link from "next/link";
import type { ReactNode } from "react";
import SiteFooter from "@/components/global/SiteFooter";
import { cn } from "@/lib/utils";

/**
 * The drifting orange wash every marketing page sits on.
 *
 * Deliberately pure CSS: three radial gradients on transform-only
 * keyframes. No WebGL context, no blur filter, no per-frame repaint —
 * it composites on the GPU and costs effectively nothing, which is what
 * keeps the glass surfaces above it cheap to render.
 */
export function AuroraBackdrop() {
  return (
    <div className="aurora" aria-hidden="true">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="aurora-grain" />
    </div>
  );
}

export type Crumb = { label: string; href?: string };

/**
 * The thin rail that runs across the top of every page. It is the piece
 * that makes the site feel like one site: same position, same height,
 * same type on About as on Blog.
 */
export function PageRail({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="shell pt-28 sm:pt-32">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] uppercase tracking-[0.22em] clash-display-font text-soft">
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
  );
}

type GlassPageProps = {
  children: ReactNode;
  className?: string;
  /** Breadcrumb trail after "Home". Omit to hide the rail. */
  crumbs?: Crumb[];
  /** Set false on pages that render their own footer. */
  footer?: boolean;
};

/**
 * Page shell: aurora behind, content above, footer at the end.
 * Wrapping every marketing route in this is what removes the per-page
 * background colours and one-off paddings the old pages carried.
 */
export default function GlassPage({ children, className, crumbs, footer = true }: GlassPageProps) {
  return (
    <main className={cn("glass-page boska-font", className)}>
      <AuroraBackdrop />
      <div className="glass-page-content">
        {crumbs ? <PageRail crumbs={crumbs} /> : null}
        {children}
        {footer ? <SiteFooter /> : null}
      </div>
    </main>
  );
}
