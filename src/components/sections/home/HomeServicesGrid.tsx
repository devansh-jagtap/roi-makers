"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Service = {
  title: string;
  image: string;
  href: string;
};

const services: Service[] = [
  {
    title: "Digital Marketing",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    href: "/services/digital-marketing",
  },
  {
    title: "Performance Marketing",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    href: "/services/performance-marketing",
  },
  {
    title: "Website Development",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    href: "/services/website-development",
  },
  {
    title: "E-commerce",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
    href: "/services/ecommerce",
  },
  {
    title: "Shopify Development",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1600&q=80",
    href: "/services/shopify-development",
  },
  {
    title: "Social Media Marketing",
    image:
      "https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=1600&q=80",
    href: "/services/social-media-marketing",
  },
  {
    title: "Search Engine Optimization",
    image:
      "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1600&q=80",
    href: "/services/search-engine-optimization",
  },
  {
    title: "Virtual Tours",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
    href: "/services/virtual-tours",
  },
];

/* One easing curve for the whole section keeps the choreography feeling like a single motion. */
const EASE = "[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]";

export default function ServicesGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <main className="bg-muted dark:bg-background text-foreground">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:gap-10 md:gap-12 px-4 sm:px-6 py-16 sm:py-20 md:py-28">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
          <h2 className="flex items-center gap-2 sm:gap-3 md:gap-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-none">
            <span>Our</span>
            <span className="relative inline-flex h-10 w-10 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 shrink-0 overflow-hidden rounded-2xl sm:rounded-[1.75rem]">
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=80"
                alt="Strategy workshop"
                fill
                sizes="(max-width: 640px) 40px, (max-width: 1024px) 64px, 80px"
                className="object-cover"
                priority
              />
            </span>
            <span>Services</span>
          </h2>

          <Link
            href="/services"
            className={`group inline-flex w-fit items-center gap-2 rounded-full border border-foreground/10 bg-background px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-foreground shadow-sm transition-all duration-500 ${EASE} hover:border-primary/40 hover:text-primary`}
          >
            View All Services
            <span
              aria-hidden
              className={`inline-block transition-transform duration-500 ${EASE} group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
            >
              ↗
            </span>
          </Link>
        </header>

        <div className="h-px w-full bg-foreground/15" />

        <div
          id="services"
          onMouseLeave={() => setHoveredIndex(null)}
          className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 lg:gap-x-16"
        >
          {services.map((service, index) => {
            const isHovered = hoveredIndex === index;
            const isDimmed = hoveredIndex !== null && !isHovered;

            return (
              <Link
                key={service.href}
                href={service.href}
                onMouseEnter={() => setHoveredIndex(index)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
                className="group relative block border-b border-foreground/15 outline-none"
              >
                {/* The row keeps a fixed height so the pill can fill it exactly. */}
                <div className="relative h-[72px] sm:h-[84px] md:h-[92px] lg:h-[104px]">
                  {/* Resting state */}
                  <div
                    className={`absolute inset-0 flex items-center transition-all duration-500 ${EASE} ${
                      isHovered ? "opacity-0 translate-x-3" : "opacity-100 translate-x-0"
                    } ${isDimmed ? "opacity-35" : ""}`}
                  >
                    <h3 className="text-xl sm:text-2xl md:text-[1.75rem] lg:text-4xl font-medium tracking-tight">
                      {service.title}
                    </h3>
                  </div>

                  {/* Hover state: an image pill that wipes open from the left */}
                  <div
                    aria-hidden
                    className={`absolute inset-y-1 -inset-x-1 sm:-inset-x-2 flex items-center overflow-hidden rounded-full transition-[clip-path] duration-[900ms] ${EASE} ${
                      isHovered
                        ? "[clip-path:inset(0_0_0_0_round_9999px)]"
                        : "[clip-path:inset(0_100%_0_0_round_9999px)] pointer-events-none"
                    }`}
                  >
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      className={`object-cover transition-transform duration-[1200ms] ${EASE} ${
                        isHovered ? "scale-100" : "scale-110"
                      }`}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Warm brand wash over the photo so the pill stays on palette */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
                    <div className="absolute inset-0 bg-primary/15 mix-blend-overlay" />

                    <div className="relative z-10 flex items-center gap-3 sm:gap-4 px-5 sm:px-7 md:px-8 w-full">
                      <span
                        className={`text-xl sm:text-2xl md:text-3xl text-white transition-all duration-500 delay-100 ${EASE} ${
                          isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                        }`}
                      >
                        ↗
                      </span>
                      <span
                        className={`text-xl sm:text-2xl md:text-[1.75rem] lg:text-4xl font-medium tracking-tight text-white transition-all duration-500 delay-75 ${EASE} ${
                          isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                        }`}
                      >
                        {service.title}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
