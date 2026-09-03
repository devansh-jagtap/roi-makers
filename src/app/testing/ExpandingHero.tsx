"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV = ["Services", "Industries", "Work", "About", "Careers", "Blog"];

const AWARDS = ["Global Search Awards", "The Drum", "UK Social Media Awards", "Content Awards"];

const PLATFORMS = ["Google", "ChatGPT", "Gemini", "TikTok", "YouTube", "Instagram", "Amazon", "Flipkart"];

/** A laurel branch, mirrored for the right-hand side. */
function Laurel({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      className="tst-laurel"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      viewBox="0 0 40 64"
      fill="none"
      aria-hidden
    >
      <path
        d="M30 62C14 54 6 40 8 22 9.5 12 15 5 22 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {[8, 17, 26, 35, 44, 52].map((y, i) => (
        <ellipse
          key={y}
          cx={16 - i * 0.6}
          cy={y}
          rx="6.5"
          ry="3"
          transform={`rotate(${-52 + i * 6} ${16 - i * 0.6} ${y})`}
          fill="currentColor"
          opacity="0.9"
        />
      ))}
    </svg>
  );
}

/**
 * The concept test: a capsule sitting inline inside the headline that turns
 * out to be video, and opens to fill the screen as you scroll.
 *
 * How the expansion works
 * ----------------------
 * The video is not moved or scaled. A full-viewport `<video>` sits behind
 * the headline the whole time, and a `clip-path: inset(...)` masks it down
 * to exactly the rectangle the inline slot occupies. Scrolling drives that
 * inset to zero, so the capsule appears to grow into the screen.
 *
 * Masking rather than scaling keeps the pixels stable — no scaling
 * artefacts, no reflow — and animates a single compositor-friendly
 * property, so the scrub stays smooth while GSAP has the section pinned.
 */
export default function ExpandingHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const slot = slotRef.current;
    const stage = stageRef.current;
    if (!section || !slot || !stage) return;

    if (reduced) {
      stage.style.clipPath = "inset(0px round 0px)";
      return;
    }

    const context = gsap.context(() => {
      /* Re-measured on every refresh, so a resize, a font swap or a rotation
         never leaves the mask pointing at a stale rectangle. */
      const slotInset = () => {
        const r = slot.getBoundingClientRect();
        const host = stage.getBoundingClientRect();
        return {
          top: r.top - host.top,
          right: host.right - r.right,
          bottom: host.bottom - r.bottom,
          left: r.left - host.left,
        };
      };

      let from = slotInset();
      const state = { p: 0 };

      const paint = () => {
        const p = state.p;
        const e = 1 - p;
        stage.style.clipPath = `inset(${from.top * e}px ${from.right * e}px ${from.bottom * e}px ${
          from.left * e
        }px round ${18 * e}px)`;
      };

      paint();

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: () => {
              from = slotInset();
              paint();
            },
          },
        })
        .to(state, { p: 1, ease: "none", onUpdate: paint }, 0)
        .to([contentRef.current, navRef.current], { autoAlpha: 0, y: -30, ease: "none" }, 0)
        .fromTo(captionRef.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, ease: "none" }, 0.55);
    }, section);

    return () => context.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="tst-hero">
      {/* Defocused copy of the same footage — the reference blurs its own
          video rather than using a separate photograph. */}
      <video className="tst-bg" src="/flower.mp4" autoPlay muted loop playsInline aria-hidden />
      <div className="tst-bg-wash" aria-hidden />

      {/* The video, masked to the inline slot until you scroll. */}
      <div ref={stageRef} className="tst-stage">
        <video className="tst-video" src="/flower.mp4" autoPlay muted loop playsInline preload="auto" aria-hidden />
        <div ref={captionRef} className="tst-stage-caption">
          <p className="tst-stage-caption-kicker">Showreel</p>
          <p className="tst-stage-caption-title">Nine years of work in ninety seconds.</p>
        </div>
      </div>

      {/* Nav bar, matching the reference. */}
      <nav ref={navRef} className="tst-nav" aria-label="Concept navigation">
        <span className="tst-logo">
          ROI Makers<sup>®</sup>
        </span>
        <ul className="tst-nav-links">
          {NAV.map((item) => (
            <li key={item}>
              <span>{item}</span>
              <em aria-hidden>+</em>
            </li>
          ))}
        </ul>
        <Link href="/contact#contact-form" className="tst-nav-cta">
          Get In Touch <span aria-hidden>↗</span>
        </Link>
      </nav>

      {/* Foreground copy. */}
      <div ref={contentRef} className="tst-content">
        <div className="tst-awards">
          <p className="tst-awards-lead">
            #1 MOST RECOMMENDED
            <br />
            PERFORMANCE MARKETING AGENCY
          </p>
          <div className="tst-awards-row">
            <Laurel />
            <ul>
              {AWARDS.map((award) => (
                <li key={award}>{award}</li>
              ))}
            </ul>
            <Laurel flip />
          </div>
        </div>

        <div className="tst-headline-block">
          <h1 className="tst-title">
            <span className="tst-title-line">We Create</span>
            <span className="tst-title-line">
              Category
              {/* Reserves the capsule's space in the line box. It paints
                  nothing — the masked stage above is what you see. */}
              <span ref={slotRef} className="tst-slot" aria-hidden />
              Leaders
            </span>
          </h1>

          <p className="tst-sub">on every platform that sells</p>

          <ul className="tst-platforms">
            {PLATFORMS.map((platform) => (
              <li key={platform}>{platform}</li>
            ))}
          </ul>
        </div>

        <div className="tst-foot">
          <p>
            Performance marketers creating, distributing &amp; optimising
            <br />
            <strong>revenue-first</strong> campaigns for SEO, Social, Ads and marketplaces
          </p>
          <p className="tst-foot-right">
            <strong>1 Global Office serving</strong>
            <br />
            Indore, India &amp; beyond
          </p>
        </div>
      </div>
    </section>
  );
}
