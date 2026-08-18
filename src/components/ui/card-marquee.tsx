"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface CardItem { title: string; description?: string; imageUrl: string; tag?: string; }
interface CardMarqueeProps { cards: CardItem[]; baseVelocity: number; className?: string; scrollDependent?: boolean; delay?: number; }

/** Continuous service rail without a Motion/JS animation frame. */
export default function CardMarquee({ cards, baseVelocity, className, delay = 0 }: CardMarqueeProps) {
  const duration = `${Math.max(38, 85 / Math.max(Math.abs(baseVelocity), 0.25))}s`;
  const direction = baseVelocity > 0 ? "reverse" : "normal";

  return (
    <div className="overflow-hidden">
      <div className="marquee-track flex w-max gap-8" style={{ animationDuration: duration, animationDirection: direction, animationDelay: `${delay}s` }}>
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0 gap-8" aria-hidden={group === 1}>
            {cards.map((card) => (
              <article key={card.title} className={cn("group relative h-[400px] w-[300px] shrink-0 overflow-hidden rounded-3xl shadow-xl transition-shadow duration-300 hover:shadow-2xl sm:h-[500px] sm:w-[400px] md:h-[600px] md:w-[500px]", className)}>
                <Image src={card.imageUrl} alt={card.title} fill sizes="(max-width: 640px) 300px, (max-width: 768px) 400px, 500px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                {card.tag && <span className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-black backdrop-blur-sm">{card.tag}</span>}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <h3 className="mb-4 translate-y-4 text-3xl font-bold text-white transition-transform duration-500 group-hover:translate-y-0 md:text-4xl">{card.title}</h3>
                  {card.description && <p className="translate-y-4 text-lg text-white transition-transform delay-75 duration-500 group-hover:translate-y-0">{card.description}</p>}
                </div>
              </article>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
