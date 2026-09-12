"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useRef } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type WordRevealProps = {
  /** Plain text only — SplitType rewrites the DOM under this node. */
  children: string;
  className?: string;
  /** Seconds before the first word starts. */
  delay?: number;
  /** Plays on mount instead of waiting for the viewport. */
  immediate?: boolean;
};

/**
 * Headline reveal: each word rises out of its own line mask as the
 * heading scrolls into view. Splits by line as well as word so the mask
 * follows the real wrap, and re-splits on resize so a narrower viewport
 * doesn't leave the old line boxes behind.
 */
export function WordReveal({ children, className, delay = 0, immediate = false }: WordRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      let split: SplitType | null = null;
      let tween: gsap.core.Tween | null = null;

      const build = () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
        split?.revert();

        split = new SplitType(el, { types: "lines,words", lineClass: "wr-line", wordClass: "wr-word" });
        const words = split.words ?? [];
        if (!words.length) return;

        tween = gsap.from(words, {
          yPercent: 110,
          rotate: 4,
          opacity: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.045,
          delay,
          ...(immediate
            ? {}
            : {
                scrollTrigger: {
                  trigger: el,
                  start: "top 88%",
                  once: true,
                },
              }),
        });
      };

      build();

      /* Fonts arriving late change line breaks; rebuild once they land. */
      document.fonts?.ready.then(() => {
        if (tween && tween.progress() === 0) build();
      });

      let raf = 0;
      let lastWidth = window.innerWidth;
      const onResize = () => {
        if (window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          /* Once it has played, just settle the words — re-animating a
             heading the reader already saw is noise. */
          const played = tween ? tween.progress() > 0 : false;
          build();
          if (played) tween?.progress(1);
        });
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(raf);
        tween?.scrollTrigger?.kill();
        tween?.kill();
        split?.revert();
      };
    },
    { scope: ref, dependencies: [children] }
  );

  return (
    <span ref={ref} className={cn("word-reveal", className)}>
      {children}
    </span>
  );
}

export default WordReveal;
