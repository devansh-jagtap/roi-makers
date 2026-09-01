"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Direction = "up" | "down" | "left" | "right" | "none";

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds of delay before this element animates in. */
  delay?: number;
  from?: Direction;
  /** Plays immediately on mount instead of waiting for the viewport. */
  immediate?: boolean;
};

/**
 * The one scroll-reveal in the design system.
 *
 * Every page used to repeat the same `initial / whileInView / transition`
 * triple on every block; this collapses that to `<Reveal delay={...}>` and
 * keeps the easing identical everywhere, which is most of what makes the
 * choreography read as one site rather than six.
 */
export function Reveal({ children, className, delay = 0, from = "up", immediate = false }: RevealProps) {
  const { x, y } = offsets[from];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      {...(immediate
        ? { animate: { opacity: 1, x: 0, y: 0 } }
        : { whileInView: { opacity: 1, x: 0, y: 0 }, viewport: { once: true, margin: "-80px" } })}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggers direct children of a list or grid without hand-numbering delays.
 * Pair with `<RevealItem>`.
 */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

export function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

/** Extra props pass through so grid items can carry `data-span` / `data-tall`. */
export function RevealItem({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & Record<`data-${string}`, string | undefined>) {
  return (
    <motion.div className={className} variants={staggerItem} {...rest}>
      {children}
    </motion.div>
  );
}

export default Reveal;
