"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Max degrees of tilt at the card's edge. */
  max?: number;
};

/**
 * Pointer-following 3D tilt with a soft light that tracks the cursor.
 * Springs bring the card back to flat on leave, so it never sticks at an
 * angle. Touch devices get the plain card — there is no hover to follow.
 */
export function TiltCard({ children, className, max = 7 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const lightX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const lightY = useTransform(sy, [0, 1], ["0%", "100%"]);
  const light = useMotionTemplate`radial-gradient(420px circle at ${lightX} ${lightY}, rgb(var(--brand-rgb) / 0.16), transparent 60%)`;

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("tilt-card", className)}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <motion.div aria-hidden className="tilt-card-light" style={{ background: light }} />
      {children}
    </motion.div>
  );
}

export default TiltCard;
