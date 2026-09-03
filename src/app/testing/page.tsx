import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ExpandingHero from "./ExpandingHero";
import { caseStudies, headlineStats } from "@/data/site";
import "./testing.css";

export const metadata: Metadata = {
  title: "Concept test — ROI Makers",
  description: "Layout concept: inline video capsule that opens to full screen on scroll.",
};

const clientLogos = [2, 3, 6, 8, 9, 10, 11, 12].map((n) => `/clients/${n}.webp`);

/**
 * An isolated sandbox at /testing.
 *
 * Nothing here is imported by the rest of the site and its CSS is scoped to
 * this route, so the concept can be judged — and thrown away — without
 * touching any live page. Everything below the hero follows the site's
 * light/dark theme; the hero keeps light type because it sits on video.
 */
export default function TestingPage() {
  return (
    <main className="tst-page">

      <ExpandingHero />

      {/* --- Clients --------------------------------------------------- */}
      <section className="tst-section">
        <div className="tst-shell">
          <div className="tst-clients">
            <p className="tst-clients-head">The agency behind…</p>
            <div className="tst-clients-grid">
              {clientLogos.map((src) => (
                <div key={src} className="tst-client-logo">
                  <Image src={src} alt="" fill sizes="140px" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Statement ------------------------------------------------- */}
      <section className="tst-section">
        <div className="tst-shell">
          <p className="tst-kicker">Driving demand &amp; discovery</p>
          <h2 className="tst-statement">
            A performance team engineering <em>revenue signals</em> for both the algorithm and the buyer.
          </h2>
          <p className="tst-lead">
            Nine years in, across search, social, marketplaces and the sites they all point at. Every campaign is
            tested, refined and optimised to improve lead quality, reduce wasted spend and generate growth you can
            actually measure.
          </p>
        </div>
      </section>

      {/* --- Stats ----------------------------------------------------- */}
      <section>
        <div className="tst-shell">
          <div className="tst-stats">
            {headlineStats.map((stat) => (
              <div key={stat.label} className="tst-stat">
                <p className="tst-stat-value">
                  {stat.decimals ? stat.value.toFixed(stat.decimals) : stat.value.toLocaleString("en-IN")}
                  {stat.suffix}
                </p>
                <p className="tst-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Featured work --------------------------------------------- */}
      <section className="tst-section">
        <div className="tst-shell">
          <div className="tst-work-head">
            <h2 className="tst-statement">Featured work</h2>
            <Link href="/projects" className="tst-kicker">
              View all →
            </Link>
          </div>

          <div className="tst-work-grid">
            {caseStudies.map((study) => (
              <article key={study.slug} className="tst-work-card">
                <div className="tst-work-media">
                  <Image
                    src={study.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="tst-work-meta">
                  <span>{study.category}</span>
                  <span aria-hidden>·</span>
                  <span>[{study.year}]</span>
                </div>
                <p className="tst-work-client">{study.client}</p>
                <p className="tst-work-result">
                  {study.results[0].value} {study.results[0].label.toLowerCase()} — {study.title.toLowerCase()}.
                </p>
                <span className="tst-work-tag">{study.tags[0]}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA -------------------------------------------------------- */}
      <section className="tst-section">
        <div className="tst-shell">
          <div className="tst-cta">
            <div>
              <p className="tst-kicker">Let&rsquo;s talk growth</p>
              <p className="tst-cta-title">Your next move starts here.</p>
            </div>
            <div>
              <p className="tst-cta-copy">
                Tell us where you are. We&rsquo;ll tell you exactly where you can go and how we get there. No fluff,
                no filler, just a real conversation about real growth.
              </p>
              <Link href="/contact#contact-form" className="tst-cta-btn">
                Get in touch <span aria-hidden>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- What this page is testing ---------------------------------- */}
      <div className="tst-shell">
        <div className="tst-note">
          <h2>What this page is testing</h2>
          <p>
            A full-viewport video sits behind the headline the whole time, masked by a <code>clip-path</code> inset
            down to the exact rectangle of the slot between &ldquo;Category&rdquo; and &ldquo;Leaders&rdquo;. Scroll
            drives that inset to zero. Because only the mask animates, the footage never scales or reflows and the
            scrub stays smooth while the section is pinned.
          </p>
          <ul>
            <li>
              <strong>Theme</strong> — everything below the hero follows the site&rsquo;s light/dark setting. The hero
              keeps light type in both, since it sits on footage; only the scrim weight changes.
            </li>
            <li>
              <strong>Video</strong> — currently <code>/flower.mp4</code>, the only clip in the repo. Swap in a real
              showreel and nothing else changes.
            </li>
            <li>
              <strong>Reduced motion</strong> — the mask opens immediately and the pin is skipped.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
