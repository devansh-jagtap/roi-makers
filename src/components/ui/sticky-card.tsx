"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CardData {
  id: number | string;
  image: string;
  alt?: string;
  title?: string;
  description?: string;
  bgColor?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface StickyCard002Props {
  cards: CardData[];
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
}

const StickyCard002 = ({
  cards,
  className,
  containerClassName,
  imageClassName,
}: StickyCard002Props) => {
  const container = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      // Register GSAP plugins
      gsap.registerPlugin(ScrollTrigger);

      const cardElements = cardRefs.current.filter(Boolean);
      const totalCards = cardElements.length;

      if (totalCards === 0) return;

      // Initial state: All cards stacked at same position with top-left origin
      cardElements.forEach((card, i) => {
        if (!card) return;
        gsap.set(card, {
          y: 0,
          x: 0,
          scale: 1,
          opacity: 1,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          transformOrigin: "top left",
          zIndex: totalCards - i,
        });
      });

      // Create GSAP timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: `+=${totalCards * 100}%`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
        },
      });

      // Animate each card to rotate and flip upward from top-left corner
      cardElements.forEach((card, i) => {
        if (!card || i === totalCards - 1) return; // Skip last card
        
        tl.to(card, {
          rotationX: 15,
          rotationY: -10,
          rotationZ: 8,
          x: "30%",
          y: "-80%",
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        }, i);
      });

      // Cleanup
      return () => {
        tl.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container, dependencies: [cards.length] }
  );

  return (
    <div 
      ref={container}
      className={cn("relative w-full h-screen", className)}
    >
      <div 
        className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16"
        style={{ perspective: "2000px" }}
      >
        <div
          className={cn(
            "relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl",
            containerClassName
          )}
          style={{ 
            height: "70vh",
            maxHeight: "700px",
            minHeight: "500px",
            transformStyle: "preserve-3d"
          }}
        >
          {cards.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={cn(
                "absolute inset-0 rounded-[40px] shadow-2xl sticky-card-item",
                imageClassName
              )}
              style={{
                backgroundColor: card.bgColor || (i % 2 === 0 ? "#000000" : "#a0f0e8"),
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              {/* Card Content */}
              <div 
                className="relative h-full w-full p-6 md:p-8 lg:p-10 flex flex-col justify-between overflow-y-auto"
              >
                {/* Image */}
                <div className="w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 mx-auto mb-4 md:mb-6 rounded-3xl overflow-hidden shadow-lg flex-shrink-0">
                  <img
                    src={card.image}
                    alt={card.alt || ""}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Title */}
                <h2 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-center leading-tight flex-shrink-0"
                  style={{ color: (card.bgColor === "#ffffff" || card.bgColor === "#a0f0e8") ? "#000000" : "#ffffff" }}
                >
                  {card.title || "Title Here"}
                </h2>
                
                {/* Description */}
                <p 
                  className="text-sm md:text-base lg:text-lg leading-relaxed text-center max-w-2xl mx-auto flex-shrink-0"
                  style={{ color: (card.bgColor === "#ffffff" || card.bgColor === "#a0f0e8") ? "#111111" : "#ffffffcc" }}
                >
                  {card.description || "Add your description text here. This is placeholder content that shows the layout and design of the card."}
                </p>
                
                {/* CTA Link */}
                {card.ctaText && card.ctaLink && (
                  <div className="mt-4 text-center">
                    <Link 
                      href={card.ctaLink}
                      className="inline-flex items-center font-semibold text-lg transition-all duration-300 hover:underline"
                      style={{ color: '#FFAA17' }}
                    >
                      {card.ctaText}
                      <span className="ml-2">→</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { StickyCard002 };
