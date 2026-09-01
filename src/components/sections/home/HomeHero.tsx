"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollBaseAnimation from "@/components/ui/text-marquee";
import VideoShowcase from "@/components/ui/media/VideoShowcase";
import { headlineStats } from "@/data/site";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  showLoading: boolean;
  showHero: boolean;
  showContent: boolean;
  onLoadingFinish: () => void;
  videoSrc?: string;
}

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

/** The three proof points that sit under the headline. */
const heroStats = headlineStats.slice(0, 3);

export default function HomeHero({ showLoading, showHero, showContent, onLoadingFinish, videoSrc }: HeroProps) {
  const titleRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 900);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  /* Mask reveal: the glyph slides up out of an overflow-hidden line box, so
     only a transform is animated rather than opacity on a 14vw character. */
  useEffect(() => {
    if (showLoading || !titleRef.current) return;
    const animation = gsap.fromTo(
      titleRef.current,
      { yPercent: 108 },
      { yPercent: 0, duration: 1.05, ease: "expo.out", onComplete: onLoadingFinish }
    );
    return () => {
      animation.kill();
    };
  }, [showLoading, onLoadingFinish]);

  useEffect(() => {
    if (!showContent || !subtitleRef.current) return;
    const targets = subtitleRef.current.querySelectorAll("[data-hero-stagger]");
    const animation = gsap.fromTo(
      targets,
      { autoAlpha: 0, y: 22 },
      { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }
    );
    return () => {
      animation.kill();
    };
  }, [showContent]);

  useEffect(() => {
    if (!showContent || isMobile || !panelRef.current || !videoRef.current || !headingRef.current) return;
    const panel = panelRef.current;
    const context = gsap.context(() => {
      gsap.set(videoRef.current, { xPercent: -50, yPercent: -50, scale: 1, force3D: true });
      gsap
        .timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: 0.35,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .to(videoRef.current, { left: "50%", scale: 2.3, ease: "none" }, 0)
        .to(headingRef.current, { y: -120, autoAlpha: 0, ease: "none" }, 0);
    }, panel);
    return () => context.revert();
  }, [showContent, isMobile]);

  return (
    <section className={`relative w-full bg-background ${isMobile ? "min-h-screen" : "min-h-[200vh]"}`}>
      <div
        ref={panelRef}
        className={`hero-theme-panel relative m-2 flex w-[calc(100%_-_1rem)] flex-col overflow-hidden rounded-[1.75rem] sm:m-5 sm:w-[calc(100%_-_2.5rem)] sm:rounded-[3rem] ${
          isMobile ? "h-[84svh]" : "h-[calc(100vh_-_4rem)]"
        }`}
      >
        {/* Backdrop: four drifting gradients + grain, all GPU-composited. */}
        <div aria-hidden="true" className="hero-mesh">
          <div className="hero-mesh-blob hero-mesh-blob-1" />
          <div className="hero-mesh-blob hero-mesh-blob-2" />
          <div className="hero-mesh-blob hero-mesh-blob-3" />
          <div className="hero-mesh-blob hero-mesh-blob-4" />
          <div className="hero-mesh-vignette" />
          <div className="hero-mesh-grain" />
        </div>

        <section className="relative z-10 flex flex-1 flex-col overflow-hidden px-6 pt-12 sm:px-8 md:px-12 lg:px-[3em] lg:pt-16">
          <div
            ref={headingRef}
            className={`relative z-10 mt-2 md:mt-6 ${
              isMobile ? "flex flex-1 flex-col items-center justify-center text-center" : ""
            }`}
          >
            <div
              className={`hero-chip mb-6 ${isMobile ? "" : "w-fit"}`}
              style={{ opacity: showHero ? 1 : 0, transition: "opacity 600ms ease 200ms" }}
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#d2481c]" />
              Performance marketing · Indore
            </div>

            <h1
              className="mb-4 select-none text-[20vw] font-black uppercase leading-[0.85] tracking-[-0.05em] text-black sm:text-[18vw] md:mb-6 md:text-[16vw] lg:text-[14vw]"
              style={{ opacity: showHero ? 1 : 0 }}
            >
              <span className="hero-line">
                <span ref={titleRef}>
                  ROI<span className="align-super ml-1 text-[0.5em]">™</span>
                </span>
              </span>
            </h1>

            {showContent && (
              <div ref={subtitleRef} className={isMobile ? "flex flex-col items-center" : ""}>
                <p
                  data-hero-stagger
                  className={`pp-neue-world-font select-none text-lg font-medium leading-[1.15] text-black sm:text-xl md:w-[54%] md:text-2xl lg:text-[2.4vw] ${
                    isMobile ? "w-full px-4 text-center" : ""
                  }`}
                >
                  ROI-first thinking for scale-hungry brands.
                </p>

                <div data-hero-stagger className={`mt-7 flex flex-wrap gap-3 ${isMobile ? "justify-center" : ""}`}>
                  <Link
                    href="/contact#contact-form"
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-black px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-14px_rgba(0,0,0,0.75)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-700 group-hover:translate-x-[200%]"
                    />
                    <span>Let&rsquo;s make it count</span>
                    <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>

                  <Link
                    href="/projects"
                    className="group inline-flex items-center gap-2 rounded-full border border-black/25 bg-white/35 px-7 py-3.5 text-sm font-bold text-black shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-black/50 hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                  >
                    <span>Explore our work</span>
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      ↗
                    </span>
                  </Link>
                </div>

                {/* Proof rail — the numbers the old site buried three sections down. */}
                <ul
                  data-hero-stagger
                  className={`mt-8 flex flex-wrap gap-2.5 ${isMobile ? "justify-center" : ""}`}
                >
                  {heroStats.map((stat) => (
                    <li key={stat.label} className="hero-stat">
                      <span className="text-lg font-bold leading-none tabular-nums">
                        {stat.decimals ? stat.value.toFixed(stat.decimals) : stat.value.toLocaleString("en-IN")}
                        {stat.suffix}
                      </span>
                      <span className="clash-display-font text-[0.55rem] uppercase tracking-[0.16em] opacity-70">
                        {stat.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {showContent && !isMobile && (
            <div
              ref={videoRef}
              className="absolute left-[74%] top-[55%] z-0 flex w-[44vw] items-center justify-center will-change-transform"
              style={{ transform: "translate3d(-50%, -50%, 0)" }}
            >
              <VideoShowcase videoSrc={videoSrc ?? ""} containerClassName="w-full" />
            </div>
          )}
        </section>

        {/* Scroll cue keeps the pinned section from feeling like a dead end. */}
        {showContent && !isMobile && (
          <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
            <span className="hero-chip">
              <span aria-hidden className="animate-bounce">
                ↓
              </span>
              Scroll
            </span>
          </div>
        )}
      </div>

      {showContent && (
        <div className="relative z-20 mt-0 w-full overflow-hidden bg-background px-2 py-5 sm:px-4 sm:py-7">
          <ScrollBaseAnimation
            baseVelocity={-0.65}
            clasname="font-extrabold text-foreground !text-3xl sm:!text-4xl md:!text-5xl [&_span]:!h-14 [&_span]:!w-14 sm:[&_span]:!h-16 sm:[&_span]:!w-16"
            items={marqueeItems}
          />
        </div>
      )}
    </section>
  );
}
