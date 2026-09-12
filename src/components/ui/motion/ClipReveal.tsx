"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ClipRevealProps = {
  children: ReactNode;
  className?: string;
  /** Which edge the reveal opens from. */
  from?: "bottom" | "top" | "left" | "right";
  delay?: number;
};

const closed: Record<NonNullable<ClipRevealProps["from"]>, string> = {
  bottom: "inset(100% 0 0 0)",
  top: "inset(0 0 100% 0)",
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
};

/**
 * Wipes its content into view with a clip-path while the media inside
 * settles from a slight zoom. Made for portraits and cover images: the
 * frame stays where it is, only the picture arrives.
 */
export function ClipReveal({ children, className, from = "bottom", delay = 0 }: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const media = el.querySelector("img, video");

      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          delay,
          defaults: { duration: 1.1, ease: "power4.out" },
        })
        .fromTo(el, { clipPath: closed[from] }, { clipPath: "inset(0 0 0 0)" }, 0)
        .fromTo(
          media,
          { scale: 1.18 },
          /* Clear the inline transform afterwards so a CSS hover zoom on
             the image (`.media-zoom`) can take over again. */
          { scale: 1, duration: 1.4, onComplete: () => {
              gsap.set(media, { clearProps: "transform" });
            },
          },
          0
        );
    },
    { scope: ref, dependencies: [from, delay] }
  );

  return (
    <div ref={ref} className={cn("clip-reveal", className)}>
      {children}
    </div>
  );
}

export default ClipReveal;
