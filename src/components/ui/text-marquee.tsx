"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface MarqueeItem { text: string; imageUrl: string; }
interface ParallaxProps {
  items: MarqueeItem[];
  baseVelocity: number;
  clasname?: string;
  scrollDependent?: boolean;
  delay?: number;
}

/** A compositor-only marquee; it deliberately avoids a JavaScript animation frame. */
export default function ScrollBaseAnimation({ items, baseVelocity, clasname, delay = 0 }: ParallaxProps) {
  const duration = `${Math.max(26, 52 / Math.max(Math.abs(baseVelocity), 0.25))}s`;
  const direction = baseVelocity > 0 ? "reverse" : "normal";
  const repeatedItems = [...items, ...items];

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div className="marquee-track flex w-max items-center gap-12" style={{ animationDuration: duration, animationDirection: direction, animationDelay: `${delay}s` }}>
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0 items-center gap-12" aria-hidden={group === 1}>
            {repeatedItems.map((item, index) => (
              <span key={`${item.text}-${index}`} className={cn("flex items-center gap-8 text-[13vw] leading-none sm:text-[10vw]", clasname)}>
                <span className="relative inline-block h-[13vw] w-[13vw] shrink-0 overflow-hidden rounded-3xl sm:h-[10vw] sm:w-[10vw]">
                  <Image src={item.imageUrl} alt="" fill sizes="(max-width: 640px) 13vw, 10vw" className="object-cover" />
                </span>
                {item.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
