"use client";

import { motion } from "framer-motion";
import { useRef, type ElementType, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* Headline reveal                                                     */
/* ------------------------------------------------------------------ */

type AnimatedHeadingProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Words rendered in the brand orange — matched case-insensitively. */
  accent?: string;
  delay?: number;
  immediate?: boolean;
};

/**
 * Words rise out of their own mask, one after another.
 *
 * Only a transform animates inside each mask, so a 40-character headline is
 * still one composited layer per word rather than a text repaint.
 */
export function AnimatedHeading({
  text,
  as: Tag = "h2",
  className,
  accent,
  delay = 0,
  immediate = false,
}: AnimatedHeadingProps) {
  const accents = accent ? accent.toLowerCase().split(" ") : [];
  const words = text.split(" ");

  return (
    <Tag className={cn("text-balance", className)}>
      {words.map((word, index) => {
        const isAccent = accents.includes(word.toLowerCase().replace(/[.,!?]/g, ""));
        return (
          <span key={`${word}-${index}`} className="word-mask">
            <motion.span
              initial={{ y: "108%" }}
              {...(immediate
                ? { animate: { y: "0%" } }
                : { whileInView: { y: "0%" }, viewport: { once: true, margin: "-60px" } })}
              transition={{ duration: 0.7, delay: delay + index * 0.045, ease: EASE }}
              className={isAccent ? "display-accent" : undefined}
            >
              {word}
            </motion.span>
            {index < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Spotlight card                                                      */
/* ------------------------------------------------------------------ */

/**
 * A glass surface that tracks the pointer with a soft brand-coloured
 * highlight. The handler writes two custom properties straight onto the
 * node — no React state, so moving the mouse never triggers a render.
 */
export function SpotlightCard({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  const track = (event: PointerEvent<HTMLElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    node.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <Tag ref={ref} onPointerMove={track} className={cn("glass glass-card", className)}>
      <span aria-hidden className="spotlight-glow" />
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic hover                                                      */
/* ------------------------------------------------------------------ */

/**
 * Nudges its child toward the cursor, then springs back. Used on the
 * primary calls to action so the page has one moment of playfulness.
 */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  const move = (event: PointerEvent<HTMLSpanElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * strength;
    const y = (event.clientY - rect.top - rect.height / 2) * strength;
    node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      className="inline-flex transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
    >
      {children}
    </span>
  );
}
