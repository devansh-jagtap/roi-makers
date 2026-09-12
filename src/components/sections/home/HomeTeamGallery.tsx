"use client";

import { HoverExpand } from "@/components/ui/hover-expand";
import Image from "next/image";

export default function TeamGallery() {
  const images = [
    {
      src: "/team_picture/1.webp",
      alt: "Sankesh Pate",
      code: "# 05",
      title: "Sankesh Pate",
      subtitle: "Senior Graphic Designer",
    },
   
    {
      src: "/team_picture/2.webp",
      alt: "Tripti Ray",
      code: "# 02",
      title: "Tripti Ray",
      subtitle: "Digital Marketing Strategist",
    },
    {
      src: "/team_picture/3.webp",
      alt: "Harshita Sharma",
      code: "# 03",
      title: "Harshita Sharma",
      subtitle: "Social Media Strategist",
    },
    {
      src: "/team_picture/4.webp",
      alt: "Amit Sharma",
      code: "# 01",
      title: "Amit Sharma",
      subtitle: "Founder & CEO",
    },
    {
      src: "/team_picture/5.webp",
      alt: "Vijay Vishwakarma",
      code: "# 04",
      title: "Vijay Vishwakarma",
      subtitle: "Senior Motion Graphic Designer",
    },
    {
      src: "/team_picture/6.webp",
      alt: "Pankaj Vishwakarma",
      code: "# 06",
      title: "Pankaj Vishwakarma",
      subtitle: "Wordpress & Shopify Developer",
    },
  ];

  return (
    <section className="bg-background py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-[0.55em] text-orange-500 mb-3 sm:mb-4 clash-display-font">
            Team
          </p>
          <h2 className="text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold boska-font">
            Meet Our Team
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg mt-4 sm:mt-6 max-w-2xl mx-auto archivo-font px-2">
          The Minds Behind the Metrics
          </p>
        </div>

        {/* Desktop: Hover Expand Gallery */}
        <div className="hidden md:flex items-center justify-center">
          <HoverExpand images={images} />
        </div>

        {/* Mobile: Grid Layout */}
        <div className="md:hidden grid grid-cols-2 gap-3 sm:gap-4">
          {images.map((member, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-2xl bg-muted aspect-[3/4]"
            >
              <Image
                src={member.src}
                alt={member.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
              {/* Overlay - Always visible */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Info - Always visible */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <h3 className="text-white font-bold text-sm sm:text-base leading-tight">
                  {member.title}
                </h3>
                <p className="text-[#FFAA17] text-xs sm:text-sm mt-1 leading-tight">
                  {member.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
