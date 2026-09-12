"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /**
   * How far (px) the content drifts across the element's trip through the
   * viewport. Positive = lags behind the scroll, negative = runs ahead.
   */
  distance?: number;
  /** Scale the inner media up so a drift never exposes the frame edge. */
  overscan?: boolean;
};

/**
 * Scroll-scrubbed vertical drift. Wrap a `.frame` and the photo inside
 * it moves at a slightly different speed to the page, which is the
 * cheapest way to make a static image feel like it has depth.
 */
export function Parallax({ children, className, distance = 60, overscan = true }: ParallaxProps) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!outer.current || !inner.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        inner.current,
        { y: -distance },
        {
          y: distance,
          ease: "none",
          scrollTrigger: {
            trigger: outer.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { scope: outer, dependencies: [distance] }
  );

  return (
    <div ref={outer} className={cn("parallax", className)}>
      <div ref={inner} className={cn("parallax-inner", overscan && "parallax-overscan")}>
        {children}
      </div>
    </div>
  );
}

export default Parallax;
