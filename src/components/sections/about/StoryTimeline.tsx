"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Image from "next/image";
import { useRef } from "react";
import type { TimelineEntry } from "@/data/site";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

export type GalleryImage = { src: string; alt: string; size: "xs" | "sm" | "base" | "md" | "lg" | "xl" };

type StoryTimelineProps = {
  eyebrow: string;
  milestones: TimelineEntry[];
  /** Eight photos fill the circle bento, in reading order. */
  gallery: GalleryImage[];
};

const DESKTOP = "(min-width: 1024px)";

/**
 * The company story as a pinned, stepped timeline.
 *
 * Desktop: the section pins for one viewport per milestone. Scrolling
 * crossfades the story panel on the left, pulses the photo bento in the
 * middle and moves the marker down the year rail on the right, with a
 * soft snap so each step settles like a slide. Mobile: no pin — the
 * panels stack and the rail turns into a horizontal row that tracks
 * whichever panel is in view.
 *
 * Built on ScrollTrigger rather than a slider library so it shares the
 * one scroll model the site already has (Lenis → ScrollTrigger.update).
 */
export function StoryTimeline({ eyebrow, milestones, gallery }: StoryTimelineProps) {
  const root = useRef<HTMLElement>(null);
  const count = milestones.length;

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const stage = scope.querySelector<HTMLElement>("[data-tl-stage]");
      const panels = gsap.utils.toArray<HTMLElement>("[data-tl-panel]", scope);
      const pills = gsap.utils.toArray<HTMLButtonElement>("[data-tl-pill]", scope);
      const bubbles = gsap.utils.toArray<HTMLElement>("[data-tl-bubble]", scope);
      const marker = scope.querySelector<HTMLElement>("[data-tl-marker]");
      if (!stage || panels.length === 0) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const mark = (index: number) => {
        pills.forEach((pill, i) => pill.setAttribute("data-active", String(i === index)));
      };

      const moveMarker = (index: number, instant = false) => {
        const pill = pills[index];
        if (!marker || !pill) return;
        gsap.to(marker, {
          y: pill.offsetTop,
          height: pill.offsetHeight,
          duration: instant ? 0 : 0.5,
          ease: "power3.out",
          overwrite: true,
        });
      };

      const mm = gsap.matchMedia();

      /* ---------------------------------------------------------- */
      /* Desktop: pin + step                                          */
      /* ---------------------------------------------------------- */
      mm.add(DESKTOP, () => {
        let active = 0;

        gsap.set(panels, { autoAlpha: 0, y: 32, pointerEvents: "none" });
        gsap.set(panels[0], { autoAlpha: 1, y: 0, pointerEvents: "auto" });
        mark(0);
        moveMarker(0, true);

        const show = (index: number) => {
          if (index === active) return;
          const dir = index > active ? 1 : -1;
          const prev = panels[active];
          const next = panels[index];
          active = index;

          gsap.killTweensOf([prev, next]);
          gsap.to(prev, { autoAlpha: 0, y: -28 * dir, duration: 0.4, ease: "power2.in", pointerEvents: "none" });
          gsap.fromTo(
            next,
            { autoAlpha: 0, y: 36 * dir },
            { autoAlpha: 1, y: 0, duration: 0.65, ease: "power3.out", delay: 0.18, pointerEvents: "auto" }
          );

          /* Stagger the panel's inner rows so the step reads as a page turn, not a fade. */
          const rows = next.querySelectorAll<HTMLElement>("[data-tl-row]");
          gsap.fromTo(
            rows,
            { y: 22, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out", stagger: 0.07, delay: 0.22, overwrite: true }
          );

          mark(index);
          moveMarker(index);

          if (!reduce && bubbles.length) {
            gsap.fromTo(
              bubbles,
              { scale: 0.86 },
              { scale: 1, duration: 0.7, ease: "back.out(1.6)", stagger: { each: 0.05, from: "random" }, overwrite: "auto" }
            );
          }
        };

        const pin = ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: () => `+=${(count - 1) * window.innerHeight * 0.85}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          snap: reduce
            ? undefined
            : {
                snapTo: 1 / (count - 1),
                duration: { min: 0.2, max: 0.55 },
                delay: 0.05,
                ease: "power1.inOut",
              },
          onUpdate: (self) => show(Math.round(self.progress * (count - 1))),
        });

        /* Clicking a year jumps straight to that step. */
        const jump = (index: number) => {
          const y = pin.start + ((pin.end - pin.start) * index) / (count - 1);
          gsap.to(window, { scrollTo: { y, autoKill: false }, duration: 0.8, ease: "power2.inOut" });
        };
        const handlers = pills.map((pill, i) => {
          const fn = () => jump(i);
          pill.addEventListener("click", fn);
          return fn;
        });

        return () => {
          pills.forEach((pill, i) => pill.removeEventListener("click", handlers[i]));
          gsap.set(panels, { clearProps: "all" });
        };
      });

      /* ---------------------------------------------------------- */
      /* Mobile / tablet: stacked panels, rail follows the reader    */
      /* ---------------------------------------------------------- */
      mm.add("(max-width: 1023px)", () => {
        mark(0);

        const triggers = panels.map((panel, index) =>
          ScrollTrigger.create({
            trigger: panel,
            start: "top 60%",
            end: "bottom 60%",
            onEnter: () => mark(index),
            onEnterBack: () => mark(index),
          })
        );

        if (!reduce) {
          panels.forEach((panel) => {
            gsap.from(panel.querySelectorAll("[data-tl-row]"), {
              y: 24,
              autoAlpha: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.08,
              scrollTrigger: { trigger: panel, start: "top 85%", once: true },
            });
          });
        }

        const handlers = pills.map((pill, i) => {
          /* gsap's scrollTo rather than scrollIntoView: Lenis owns the
             scroll position and desyncs from a native smooth scroll. */
          const fn = () =>
            gsap.to(window, { scrollTo: { y: panels[i], offsetY: 96, autoKill: false }, duration: 0.7, ease: "power2.inOut" });
          pill.addEventListener("click", fn);
          return fn;
        });

        return () => {
          triggers.forEach((t) => t.kill());
          pills.forEach((pill, i) => pill.removeEventListener("click", handlers[i]));
        };
      });

      /* ---------------------------------------------------------- */
      /* Idle drift on the bento so it never sits perfectly still    */
      /* ---------------------------------------------------------- */
      if (!reduce) {
        bubbles.forEach((bubble, i) => {
          gsap.to(bubble, {
            y: i % 2 === 0 ? 8 : -8,
            duration: 2.6 + (i % 3) * 0.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.18,
          });
        });
      }

      return () => mm.revert();
    },
    { scope: root, dependencies: [count] }
  );

  return (
    <section ref={root} className="tl3" aria-label="Company timeline">
      <div data-tl-stage className="tl3-stage">
        <div className="shell tl3-grid">
          {/* Story panels */}
          <div className="tl3-panels">
            {milestones.map((item, index) => (
              <article key={item.year} data-tl-panel className="tl3-panel">
                <div data-tl-row className="tl3-head">
                  <span className="glass-pill tl3-badge">
                    <span aria-hidden className="tl3-badge-dot" />
                    {eyebrow}
                  </span>
                  <h2 className="display-1 tl3-title text-balance">
                    <span className="display-accent tl3-title-year">{item.year}</span>
                    <span className="tl3-title-text">{item.title}</span>
                  </h2>
                </div>

                <p data-tl-row className="body-copy archivo-font tl3-copy">
                  {item.body}
                </p>

                <figure data-tl-row className="frame tl3-media">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 34vw"
                    priority={index === 0}
                    className="object-cover"
                  />
                  <div className="tl3-media-shade" aria-hidden />
                  <figcaption className="tl3-fact">
                    <span className="tl3-fact-index">{String(index + 1).padStart(2, "0")}</span>
                    <span>{item.fact}</span>
                  </figcaption>
                </figure>
              </article>
            ))}
          </div>

          {/* Circle bento */}
          <div className="tl3-bento" aria-hidden>
            <div className="tl3-bento-row is-top">
              <Bubble image={gallery[0]} />
              <Bubble image={gallery[1]} />
            </div>
            <div className="tl3-bento-row">
              <Bubble image={gallery[2]} />
              <div className="tl3-bento-col">
                <Bubble image={gallery[3]} />
                <Bubble image={gallery[4]} />
              </div>
            </div>
            <div className="tl3-bento-row is-bottom">
              <div className="tl3-bento-col is-right">
                <Bubble image={gallery[5]} />
                <Bubble image={gallery[6]} />
              </div>
              <Bubble image={gallery[7]} />
            </div>
          </div>

          {/* Year rail */}
          <nav className="tl3-rail" aria-label="Jump to a year">
            <span data-tl-marker className="tl3-rail-marker" aria-hidden />
            {milestones.map((item, index) => (
              <button
                key={item.year}
                type="button"
                data-tl-pill
                data-active={index === 0}
                className="glass-pill tl3-pill"
              >
                {item.year}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}

function Bubble({ image }: { image?: GalleryImage }) {
  if (!image) return null;
  return (
    <div data-tl-bubble className={cn("tl3-bubble", `is-${image.size}`)}>
      <Image src={image.src} alt={image.alt} fill sizes="240px" className="object-cover" />
    </div>
  );
}

export default StoryTimeline;
