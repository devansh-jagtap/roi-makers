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
  /** The showreel shown inside the capsule: a self-hosted MP4 path (default)
   *  or, for backwards compatibility, a YouTube embed URL. */
  videoSrc?: string;
}

/**
 * The self-hosted showreel. Encoded from the original upload with no audio
 * track (the clip is always muted), `+faststart` so playback begins before
 * the file has finished downloading, and a poster frame that paints instantly.
 * WebM/VP9 is offered first for the browsers that take it (about a third
 * smaller); phones get a 720p H.264 that is half the weight of the 1080p one.
 */
const LOCAL_SHOWREEL = {
  mp4: "/videos/showreel-1080.mp4",
  webm: "/videos/showreel-1080.webm",
  mobileMp4: "/videos/showreel-720.mp4",
  poster: "/videos/showreel-poster.webp",
};

function isYouTube(src: string): boolean {
  try {
    return /youtube|youtu\.be/.test(new URL(src).hostname);
  } catch {
    return false;
  }
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

/** The video's own thumbnail. Blurred as heavily as the ground is, a still is
 *  indistinguishable from the live footage — and unlike a second player it is
 *  rasterised once rather than on every scrubbed frame. */
function posterFor(embed: string): string {
  if (!isYouTube(embed)) return LOCAL_SHOWREEL.poster;
  try {
    const url = new URL(embed);
    const id = url.pathname.split("/").pop();
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
  } catch {
    return "";
  }
}

/** Where the inline slot sits inside the hero, as clip-path insets. Read
 *  from layout offsets rather than getBoundingClientRect so the headline's
 *  reveal transform (the line slides up into place) doesn't skew it — the
 *  capsule must be on its words from the very first frame, not after the
 *  scroll effect has had a chance to re-measure. */
function slotInsetOf(slot: HTMLElement, host: HTMLElement) {
  let top = 0;
  let left = 0;
  let el: HTMLElement | null = slot;
  while (el && el !== host && host.contains(el)) {
    top += el.offsetTop;
    left += el.offsetLeft;
    el = el.offsetParent as HTMLElement | null;
  }
  return {
    top,
    left,
    right: host.clientWidth - (left + slot.offsetWidth),
    bottom: host.clientHeight - (top + slot.offsetHeight),
  };
}

const FALLBACK_EMBED = LOCAL_SHOWREEL.mp4;

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
  const source = videoSrc || FALLBACK_EMBED;
  const useFile = !isYouTube(source);
  const embed = useFile ? source : toBackgroundEmbed(source);
  const poster = posterFor(embed);
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

  /* Fit the capsule to its slot from first paint. The scroll effect below
     owns the mask once the page is ready, but until then (loading overlay,
     headline reveal, web fonts settling) this keeps it glued to the words. */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const slot = slotRef.current;
    if (showContent || reduced || !section || !stage || !slot) return;

    const paint = () => {
      const i = slotInsetOf(slot, section);
      stage.style.clipPath = `inset(${i.top}px ${i.right}px ${i.bottom}px ${i.left}px round 16px)`;
    };
    paint();
    /* A late web-font swap shifts the words without changing the slot's own
       size, so watch the headline (its width follows the text) and the font
       set itself, not just the slot. */
    const fonts = document.fonts;
    fonts?.ready.then(paint).catch(() => {});
    fonts?.addEventListener("loadingdone", paint);
    const observer = new ResizeObserver(paint);
    observer.observe(section);
    observer.observe(slot);
    if (titleRef.current) observer.observe(titleRef.current);
    return () => {
      observer.disconnect();
      fonts?.removeEventListener("loadingdone", paint);
    };
  }, [showContent, reduced]);

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
      const slotInset = () => slotInsetOf(slot, section);
      /* The gap the frame keeps around the card; the pin holds the card that
         far from the top so the spacing stays even while it is held. */
      const frameGap = () => parseFloat(getComputedStyle(section.parentElement as Element).paddingTop) || 0;

      let from = slotInset();
      const state = { p: 0 };
      const paint = () => {
        const e = 1 - state.p;
        const r = Math.round;
        stage.style.clipPath = `inset(${r(from.top * e)}px ${r(from.right * e)}px ${r(
          from.bottom * e
        )}px ${r(from.left * e)}px round ${r(16 * e)}px)`;
      };
      paint();

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: () => `top ${frameGap()}px`,
            end: "+=140%",
            pin: true,
            scrub: true,
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
      {/* The frame carries the gap around the card. It can't live as margin
          on the section itself: ScrollTrigger zeroes a pinned element's
          margins and re-sizes it, which ran the card into the right edge. */}
      <div className="hx-hero-frame">
      <section ref={sectionRef} className="hx-hero">
        {/* A still of the same footage, blurred and enlarged, as a bright
            ambient ground — this is what gives the hero its refreshing, glassy
            feel instead of a flat dark plate. If the poster is unavailable the
            hero falls back to its own warm gradient. */}
        <div className="hx-bg" aria-hidden>
          {/* Deliberately a plain <img>: an external host with no next/image
              config, and it is decorative blur, not content. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {poster && <img className="hx-bg-video" src={poster} alt="" decoding="async" />}
        </div>
        <div className="hx-bg-wash" aria-hidden />

        {/* The showreel, masked to the inline slot until you scroll. */}
        <div ref={stageRef} className="hx-stage">
          <div className="hx-video-frame" aria-hidden>
            {useFile ? (
              /* Native, muted, inline autoplay: no third-party player script,
                 no iframe, and the poster is on screen before the first byte
                 of video arrives. */
              <video
                className="hx-video hx-video-file"
                poster={poster}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                disableRemotePlayback
                tabIndex={-1}
              >
                {embed === LOCAL_SHOWREEL.mp4 && (
                  <>
                    <source src={LOCAL_SHOWREEL.mobileMp4} type="video/mp4" media="(max-width: 767px)" />
                    <source src={LOCAL_SHOWREEL.webm} type="video/webm" />
                  </>
                )}
                <source src={embed} type="video/mp4" />
              </video>
            ) : (
              <>
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
              </>
            )}
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
      </div>

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
