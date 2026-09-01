'use client';

import { animate, useInView } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef } from 'react';

type CountUpProps = {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Thousands grouping. Pass "" to render a bare number. */
  separator?: string;
};

const group = (raw: string, separator: string) => {
  if (!separator) return raw;
  const [whole, fraction] = raw.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return fraction ? `${grouped}.${fraction}` : grouped;
};

const format = (n: number, decimals: number, separator: string, prefix: string, suffix: string) =>
  `${prefix}${group(decimals > 0 ? n.toFixed(decimals) : Math.round(n).toString(), separator)}${suffix}`;

/** SSR and the first client paint both need a DOM node, so only reach for
 *  the layout effect in the browser. */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Animated numeric counter that counts up when it scrolls into view.
 *
 * The rendered markup carries the *final* number, not zero. The count-up is
 * an enhancement layered on top: on mount the value is reset to zero and
 * animated back up. That ordering matters — if JavaScript stalls, the
 * observer never fires, or the tab is throttled, the visitor still sees the
 * real figure instead of a permanent "0".
 */
export function CountUp({
  value,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
}: CountUpProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(valueRef, { once: true, margin: '-80px' });
  const hasRun = useRef(false);

  const final = format(value, decimals, separator, prefix, suffix);

  // Blank to zero before the browser paints, so the real number never flashes.
  // A watchdog puts the true figure back if the count-up never starts — the
  // observer can miss in a throttled or backgrounded tab, and a stat frozen
  // at zero is far worse than one that simply did not animate.
  useIsomorphicLayoutEffect(() => {
    const node = valueRef.current;
    if (hasRun.current || !node) return;
    node.textContent = format(0, decimals, separator, prefix, suffix);

    const watchdog = window.setTimeout(() => {
      if (!hasRun.current && valueRef.current) valueRef.current.textContent = final;
    }, 2500);

    return () => window.clearTimeout(watchdog);
  }, [decimals, final, prefix, separator, suffix]);

  useEffect(() => {
    if (!isInView || hasRun.current || !valueRef.current) return;
    hasRun.current = true;

    const node = valueRef.current;
    const controls = animate(0, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        node.textContent = format(latest, decimals, separator, prefix, suffix);
      },
      // Snap to the exact target — easing can land a hair short.
      onComplete: () => {
        node.textContent = final;
      },
    });

    return () => {
      controls.stop();
      // If we are torn down mid-count, leave the true number behind.
      node.textContent = final;
    };
  }, [decimals, duration, final, isInView, prefix, separator, suffix, value]);

  return <span ref={valueRef}>{final}</span>;
}
