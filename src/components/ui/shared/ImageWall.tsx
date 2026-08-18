"use client";
import gsap from "gsap";
import React, { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export interface ImageWallProps {
  heroText?: string;
  heroTextClassName?: string;
  lines?: string[];
  buttonText?: string;
  footerContent?: React.ReactNode;
  stackImageCount?: number; // number of images in /images/stack
}

const defaultLines = [
  "Razor-sharp strategy. Addictive design.",
  "Campaigns that make CFOs smile and competitors nervous.",
  "Ready To 10x Your Digital Game? Let's Build.",
];

const ImageWall: React.FC<ImageWallProps> = ({
  heroText = "Watch us turn marketing budgets into money printers!",
  lines = defaultLines,
  buttonText = "Start Your Growth Story",
  footerContent = (
    <div className="w-full hidden  flex-col items-start gap-2 p-4 z-2">
      <span className="text-3xl font-bold tracking-tight">Mocko™</span>
      <span className="text-lg">
        Strategy, design, and campaigns for ambitious brands.
      </span>
      <span className="text-base opacity-70">hello@mocko.agency</span>
    </div>
  ),
  stackImageCount = 6,
}) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const approachRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLDivElement>(null);

  const generateRows = () => {
    const rows = [];
    for (let i = 1; i <= stackImageCount; i += 2) {
      rows.push(
        <div
          className="row relative w-screen my-2 md:my-4 flex justify-center gap-[1em] md:gap-[2em] z-0"
          key={i}
        >
          <div className="relative w-[42%] md:w-[40%] h-[180px] sm:h-[240px] md:h-[360px] rounded-[0.5em] md:rounded-[0.75em] overflow-hidden will-change-transform card-left">
            <Image
              src={`/images/stack/${i}.webp`}
              alt=""
              width={600}
              height={360}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              priority={i <= 2}
            />
          </div>
          <div className="relative w-[42%] md:w-[40%] h-[180px] sm:h-[240px] md:h-[360px] rounded-[0.5em] md:rounded-[0.75em] overflow-hidden will-change-transform card-right">
            <Image
              src={`/images/stack/${i + 1}.webp`}
              alt=""
              width={600}
              height={360}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              priority={i <= 2}
            />
          </div>
        </div>
      );
    }
    return rows;
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const scrollTriggerSettings = {
      trigger: mainRef.current,
      start: "top 25%",
      toggleActions: "play reverse play reverse",
    };

    // Responsive animation values
    const isMobile = window.innerWidth < 768;
    
    const leftXValues = isMobile ? [-200, -250, -200] : [-600, -750, -600];
    const rightXValues = isMobile ? [200, 250, 200] : [600, 750, 600];
    const leftRotationValues = isMobile ? [10, -5, -15] : [20, -10, -35];
    const rightRotationValues = isMobile ? [-15, 5, 15] : [-30, 10, 35];
    const yValues = isMobile ? [-20, -80, -150] : [-30, -140, -300];

    const rows = mainRef.current?.querySelectorAll(".row") ?? [];
    rows.forEach((row, index) => {
      const leftCard = row.querySelector(".card-left");
      const rightCard = row.querySelector(".card-right");

      if (leftCard) {
        gsap.to(leftCard, {
          x: leftXValues[index % leftXValues.length],
          rotation: leftRotationValues[index % leftRotationValues.length],
          y: yValues[index % yValues.length],
          scrollTrigger: {
            trigger: mainRef.current,
            start: "top center",
            end: "150% bottom",
            scrub: true,
            // markers: true,
          },
          duration: 0.5,
        });
      }
      if (rightCard) {
        gsap.to(rightCard, {
          x: rightXValues[index % rightXValues.length],
          rotation: rightRotationValues[index % rightRotationValues.length],
          y: yValues[index % yValues.length],
          scrollTrigger: {
            trigger: mainRef.current,
            start: "top center",
            end: "150% bottom",
            scrub: true,
          },
          duration: 1,
        });
      }
    });

    gsap.to(".line p", {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 0.5,
      ease: "power1.out",
      scrollTrigger: scrollTriggerSettings,
    });

    gsap.to(".btn [data-slot='button']", {
      y: 0,
      opacity: 1,
      delay: 0.25,
      duration: 0.5,
      ease: "power1.out",
      scrollTrigger: scrollTriggerSettings,
    });

    // Hero fade up animation
    if (heroRef.current && headlineRef.current && subheadlineRef.current) {
      gsap.set(
        [headlineRef.current, approachRef.current, subheadlineRef.current],
        {
          opacity: 0,
          y: 40,
        }
      );
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(
            [headlineRef.current, approachRef.current, subheadlineRef.current],
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              stagger: 0.15,
            }
          );
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [stackImageCount, lines, buttonText, footerContent, heroText]);

  return (
    <div className="boska-font overflow-x-clip bg-background">
      {/* Approach Hero Section */}
      <section
        ref={heroRef}
        className="w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-[2.5em] pt-6 sm:pt-12 md:pt-24 pb-6 sm:pb-8 md:pb-16"
      >
        <div className="flex w-full max-w-7xl mx-auto items-start gap-2 sm:gap-4 md:gap-8">
          {/* Left Arrow */}
          <div className="flex-shrink-0 hidden lg:flex flex-col items-start justify-start pt-2 min-w-[60px]">
            <span className="flex text-[3.5rem] md:text-[4.5rem] font-bold leading-none">
              &rarr;
            </span>
          </div>
          {/* Headline */}
          <div className="flex-1">
            <h2
              ref={headlineRef}
              className="text-xl sm:text-2xl md:text-3xl lg:text-[3.5rem] font-bold leading-tight tracking-tight mb-6 sm:mb-8 md:mb-12"
              style={{ lineHeight: 1.05 }}
            >
             Engineering digital ecosystems where
              <br className="hidden sm:block" />
              brands don't just exist they dominate,
              <br className="hidden sm:block" />
              disrupt, and redefine their categories
            </h2>
            {/* Two-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mt-4 sm:mt-6 md:mt-8">
              <div
                ref={approachRef}
                className="text-lg sm:text-xl md:text-2xl text-foreground/80 flex items-start font-bold italic"
              >
                (Approach)
              </div>
              <div ref={subheadlineRef} className="pp-neue-world-font">
                <div className="font-semibold text-base sm:text-lg md:text-xl mb-2">
                The game changed. Static is dead. Attention is currency.
                </div>
                <div className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed space-y-3 sm:space-y-4">
                  <p>
                  Today's winning brands understand one truth: visibility without velocity is vanity. In an attention economy where consumers swipe past your best work in 0.3 seconds, you need more than pretty graphics you need psychological triggers wrapped in strategic precision.
                  </p>

                  <p>
                  We architect brand experiences that hijack scroll patterns and rewire buying behavior. Every pixel serves a purpose. Every campaign carries intent. We're not making content we're engineering conversion machines disguised as creative brilliance.
                  </p>
                  <p>
                  Think less "marketing agency," more "growth laboratory." Where hypotheses become campaigns, data becomes direction, and your competitors become case studies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Approach Hero Section */}
      <section
        ref={mainRef}
        className="main w-screen min-h-[80vh] sm:min-h-[100vh] md:min-h-[150vh] flex flex-col items-center justify-center relative bg-background mt-4 sm:mt-6 md:mt-12"
      >
        <div className="main-content flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none px-4 w-full max-w-screen-xl">
          <div className="copy flex flex-col items-center justify-center m-2 sm:m-4 md:m-8 w-full">
            {lines.map((line, idx) => (
              <div
                className="line w-full text-center min-h-[1.2em] sm:min-h-[1.5em] md:min-h-[2.5em] flex items-center justify-center overflow-hidden mb-1 sm:mb-2 md:mb-5"
                key={idx}
              >
                <p className="text-foreground clash-display-font tracking font-medium text-sm sm:text-base md:text-xl lg:text-[2.5vw] translate-y-10 opacity-0 transition-transform duration-100 py-1 text-center">
                  {line}
                </p>
              </div>
            ))}
            <div className="btn pointer-events-auto mt-2 sm:mt-3 md:mt-4">
              <Button asChild className="group relative cursor-pointer overflow-hidden rounded-full border-0 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground opacity-0 shadow-lg shadow-orange-500/30 transition-all duration-300 ease-out hover:scale-105 hover:bg-primary/90 focus:scale-105 active:scale-100 sm:px-6 sm:py-3 sm:text-base md:px-10 md:py-4 md:text-lg lg:text-2xl">
                <Link href="/contact?source=growth-story#contact-form">
                  <span className="relative z-10">{buttonText}</span>
                  <span className="absolute left-[-75%] top-0 h-full w-1/2 rotate-12 bg-white opacity-20 group-hover:animate-shine" aria-hidden="true" />
                </Link>
              </Button>
              <style jsx global>{`
                @keyframes shine {
                  0% {
                    left: -75%;
                  }
                  60% {
                    left: 120%;
                  }
                  100% {
                    left: 120%;
                  }
                }
                .group:hover .group-hover\\:animate-shine {
                  animation: shine 1.1s cubic-bezier(0.4, 0, 0.2, 1);
                }
              `}</style>
            </div>
          </div>
        </div>
        {generateRows()}
      </section>
      <section className="footer flex items-start justify-center z-[2] text-foreground bg-background mt-8 md:mt-12 mb-8 md:mb-12">
        {footerContent}
      </section>
    </div>
  );
};

export default ImageWall;
