"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollBaseAnimation from "@/components/ui/text-marquee";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  showLoading: boolean;
  showHero: boolean;
  showContent: boolean;
  onLoadingFinish: () => void;
  /** The showreel shown inside the capsule. A YouTube embed URL. */
  videoSrc?: string;
}

/** Force a YouTube embed into a silent, chromeless, looping background clip. */
function toBackgroundEmbed(src: string): string {
  try {
    const url = new URL(src);
    if (!/youtube|youtu\.be/.test(url.hostname)) return src;
    const silent: Record<string, string> = {
      autoplay: "1",
      mute: "1",
      loop: "1",
      controls: "0",
      modestbranding: "1",
      showinfo: "0",
      rel: "0",
      iv_load_policy: "3",
      disablekb: "1",
      fs: "0",
      playsinline: "1",
    };
    Object.entries(silent).forEach(([k, v]) => url.searchParams.set(k, v));
    // loop needs the id echoed into playlist
    const id = url.pathname.split("/").pop();
    if (id && !url.searchParams.get("playlist")) url.searchParams.set("playlist", id);
    if (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") {
      url.hostname = "www.youtube-nocookie.com";
    }
    return url.toString();
  } catch {
    return src;
  }
}

const FALLBACK_EMBED =
  "https://www.youtube-nocookie.com/embed/aYSp5qUTC54?autoplay=1&mute=1&loop=1&playlist=aYSp5qUTC54&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1";

const marqueeItems = [
  {
    text: "ROI FIRST. ALWAYS.",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80",
  },
  {
    text: "BUILT TO PERFORM",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80",
  },
  {
    text: "ROI MAKERS",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80",
  },
];

/**
 * Landing-page hero: a centred headline with the showreel living inside it
 * as a capsule, opening to fill the screen as you scroll.
 *
 * How the expansion works
 * ----------------------
 * A full-bleed <video> sits behind the headline the whole time. A
 * `clip-path: inset(...)` masks it down to the exact rectangle of the
 * inline slot between two words; scrolling drives that inset to zero, so
 * the capsule appears to grow into the screen. Only the mask animates — the
 * footage never scales or reflows — so the scrub stays smooth while GSAP
 * has the section pinned, and it plays nicely with the site's Lenis scroll.
 *
 * It keeps the existing loading contract: the headline reveals once
 * `showHero` is set and calls `onLoadingFinish` when that finishes; the
 * pinned scroll effect is wired only once `showContent` is set, so the page
 * below it exists and the pin measures correctly.
 */
export default function HomeExpandingHero({ showLoading, showHero, showContent, onLoadingFinish, videoSrc }: HeroProps) {
  const embed = toBackgroundEmbed(videoSrc || FALLBACK_EMBED);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);
  const [reduced, setReduced] = useState(false);

  useLayoutEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  /* Headline mask-reveal, gated on the loading sequence. */
  useLayoutEffect(() => {
    if (showLoading || !titleRef.current) return;
    const lines = titleRef.current.querySelectorAll("[data-line] > span");
    const animation = gsap.fromTo(
      lines,
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        onComplete: () => {
          if (!finishedRef.current) {
            finishedRef.current = true;
            onLoadingFinish();
          }
        },
      }
    );
    return () => {
      animation.kill();
    };
  }, [showLoading, onLoadingFinish]);

  /* Scroll-driven expansion, wired once the rest of the page exists. */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const slot = slotRef.current;
    if (!showContent || !section || !stage || !slot) return;

    if (reduced) {
      stage.style.clipPath = "inset(0px round 0px)";
      return;
    }

    const context = gsap.context(() => {
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
        const e = 1 - state.p;
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
        .to(contentRef.current, { autoAlpha: 0, y: -30, ease: "none" }, 0)
        .fromTo(captionRef.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, ease: "none" }, 0.55);

      ScrollTrigger.refresh();
    }, section);

    return () => context.revert();
  }, [showContent, reduced]);

  /* The site header (logo + menu) is dark in light theme, which vanishes on
     the dark hero. While the hero holds the top of the screen, force that
     chrome to render light; it reverts to the theme colour once you scroll
     past. Gated on showHero so the loading overlay isn't affected. */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!showHero || !section) return;
    const sync = () => {
      const overTop = section.getBoundingClientRect().bottom > 96;
      document.body.classList.toggle("hx-hero-chrome", overTop);
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      document.body.classList.remove("hx-hero-chrome");
    };
  }, [showHero]);

  return (
    <>
      <section ref={sectionRef} className="hx-hero">
        {/* The same footage, blurred and enlarged, as a bright ambient
            ground — this is what gives the hero its refreshing, glassy feel
            instead of a flat dark plate. */}
        <div className="hx-bg" aria-hidden>
          <iframe
            className="hx-bg-video"
            src={embed}
            title=""
            aria-hidden
            tabIndex={-1}
            allow="autoplay; encrypted-media"
            loading="eager"
            frameBorder={0}
          />
        </div>
        <div className="hx-bg-wash" aria-hidden />

        {/* The showreel, masked to the inline slot until you scroll. */}
        <div ref={stageRef} className="hx-stage">
          <div className="hx-video-frame" aria-hidden>
            <iframe
              className="hx-video"
              src={embed}
              title="ROI Makers showreel"
              allow="autoplay; encrypted-media; picture-in-picture"
              loading="eager"
              frameBorder={0}
            />
            {/* Blocks clicks so the YouTube UI never appears. */}
            <span className="hx-video-guard" />
          </div>
          <div ref={captionRef} className="hx-caption">
            <p className="hx-caption-kicker">Showreel</p>
            <p className="hx-caption-title">Nine years of work in ninety seconds.</p>
          </div>
        </div>

        {/* Centred headline with the capsule inline. */}
        <div ref={contentRef} className="hx-content" style={{ opacity: showHero ? 1 : 0 }}>
          <p className="hx-eyebrow">Performance marketing · Indore</p>

          <h1 ref={titleRef} className="hx-title">
            <span className="hx-line" data-line>
              <span>We turn attention</span>
            </span>
            <span className="hx-line" data-line>
              <span>
                into
                <span ref={slotRef} className="hx-slot" aria-hidden />
                revenue.
              </span>
            </span>
          </h1>

          <p className="hx-sub">ROI-first thinking for scale-hungry brands.</p>

          <div className="hx-actions">
            <Link href="/contact#contact-form" className="hx-cta">
              <span>Book a growth call</span>
              <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {showContent && (
        <div className="relative z-20 w-full overflow-hidden bg-background px-2 py-5 sm:px-4 sm:py-7">
          <ScrollBaseAnimation
            baseVelocity={-0.65}
            clasname="font-extrabold text-foreground !text-3xl sm:!text-4xl md:!text-5xl [&_span]:!h-14 [&_span]:!w-14 sm:[&_span]:!h-16 sm:[&_span]:!w-16"
            items={marqueeItems}
          />
        </div>
      )}
    </>
  );
}
