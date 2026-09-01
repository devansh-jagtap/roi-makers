"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

gsap.registerPlugin(SplitText);

export type TeamInfo = {
  fullName: string;
  role: string;
  bio: string;
  fun?: string;
};

export type TeamShowcaseProps = {
  teamNames: string[];
  teamImages: string[];
  teamInfo: TeamInfo[];
  title?: string;
};

const TeamShowcase: React.FC<TeamShowcaseProps> = ({
  teamNames,
  teamImages,
  teamInfo,
  title = "{ Meet }",
}) => {
  const imagesRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const prevActiveIndex = useRef<number | null>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const profileImagesContainer = imagesRef.current;
    const profileImages = imagesRef.current?.querySelectorAll(".img") ?? [];
    const nameElements = namesRef.current?.querySelectorAll(".name") ?? [];
    const nameHeadings = namesRef.current?.querySelectorAll(".name h1") ?? [];

    // Split all h1s into chars and add 'letter' class
    nameHeadings.forEach((heading) => {
      const splitText = SplitText.create(heading, { type: "chars" });
      (splitText.chars as Element[]).forEach((char) => {
        (char as HTMLElement).classList.add("letter");
      });
    });

    const defaultLetters = nameElements[0]?.querySelectorAll(".letter") ?? [];
    gsap.set(defaultLetters, { y: "100%" });

    // Apply animations for both mobile and desktop
    profileImages.forEach((img, index) => {
      const correspondingName = nameElements[index + 1];
      if (!correspondingName) return;
      const letters = correspondingName.querySelectorAll(".letter");

      img.addEventListener("mouseenter", () => {
        gsap.to(img, {
          width: window.innerWidth >= 900 ? 140 : 80,
          height: window.innerWidth >= 900 ? 140 : 80,
          duration: 0.4,
          ease: "power4.out",
        });

        gsap.to(letters, {
          y: "-100%",
          duration: 0.4,
          stagger: {
            each: 0.08,
            from: "center",
          },
        });
      });

      img.addEventListener("mouseleave", () => {
        gsap.to(img, {
          width: window.innerWidth >= 900 ? 70 : 60,
          height: window.innerWidth >= 900 ? 70 : 60,
          duration: 0.4,
          ease: "power4.out",
        });

        gsap.to(letters, {
          y: "0%",
          duration: 0.4,
          stagger: {
            each: 0.08,
            from: "center",
          },
        });
      });
    });

    profileImagesContainer?.addEventListener("mouseenter", () => {
      gsap.to(defaultLetters, {
        y: "0%",
        ease: "power4.out",
        duration: 0.4,
        stagger: {
          each: 0.08,
          from: "center",
        },
      });
    });

    profileImagesContainer?.addEventListener("mouseleave", () => {
      gsap.to(defaultLetters, {
        y: "100%",
        duration: 0.4,
        stagger: {
          each: 0.08,
          from: "center",
        },
      });
    });
  }, [teamNames, teamImages, teamInfo]);

  // Mobile tap effect with exit animation and index+1 mapping
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.innerWidth < 900;
    if (!isMobile) return; // Only run on mobile for tap interactions
    
    const nameElements = namesRef.current?.querySelectorAll(".name") ?? [];
    const profileImages = imagesRef.current?.querySelectorAll(".img") ?? [];
    
    // Animate previous active image
    if (prevActiveIndex.current !== null && prevActiveIndex.current !== activeIndex) {
      const prevImg = profileImages[prevActiveIndex.current];
      if (prevImg) {
        gsap.to(prevImg, {
          width: 60,
          height: 60,
          duration: 0.4,
          ease: "power4.out",
        });
      }
    }
    
    // Animate current active image
    if (activeIndex !== null) {
      const currentImg = profileImages[activeIndex];
      if (currentImg) {
        gsap.to(currentImg, {
          width: 80,
          height: 80,
          duration: 0.4,
          ease: "power4.out",
        });
      }
    }
    
    // Animate previous active name out
    if (
      prevActiveIndex.current !== null &&
      prevActiveIndex.current !== activeIndex &&
      nameElements[prevActiveIndex.current + 1]
    ) {
      const prevLetters =
        nameElements[prevActiveIndex.current + 1].querySelectorAll(".letter");
      gsap.to(prevLetters, {
        y: "0%",
        duration: 0.3,
        stagger: { each: 0.06, from: "center" },
      });
    }
    
    // Animate new active name in
    if (activeIndex !== null && nameElements[activeIndex + 1]) {
      const newLetters =
        nameElements[activeIndex + 1].querySelectorAll(".letter");
      gsap.to(newLetters, {
        y: "-100%",
        duration: 0.4,
        stagger: { each: 0.08, from: "center" },
      });
    }
    
    // Animate Core (index 0) out when a profile is active, in when not
    const coreLetters = nameElements[0]?.querySelectorAll(".letter") ?? [];
    if (activeIndex !== null) {
      gsap.to(coreLetters, {
        y: "100%",
        duration: 0.3,
        stagger: { each: 0.06, from: "center" },
      });
    } else {
      gsap.to(coreLetters, {
        y: "0%",
        duration: 0.4,
        stagger: { each: 0.08, from: "center" },
      });
    }
    
    // Reset all others
    nameElements.forEach((el, i) => {
      if (activeIndex === null || i !== activeIndex + 1) {
        const letters = el.querySelectorAll(".letter");
        gsap.to(letters, {
          y: "0%",
          duration: 0.3,
          stagger: { each: 0.06, from: "center" },
        });
      }
    });
    
    prevActiveIndex.current = activeIndex;
  }, [activeIndex, teamInfo]);

  const handleImageTap = (index: number) => {
    if (typeof window !== "undefined" && window.innerWidth < 900) {
      setActiveIndex((prev) => (prev === index ? null : index));
    }
  };

  // Mobile Card Layout (< 768px)
  if (isMobile) {
    return (
      <div className="w-screen min-h-screen bg-background py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {title}
          </h1>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {teamInfo.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
                <div className="aspect-square relative">
                  <Image
                    src={teamImages[index]} // Direct mapping: teamInfo[index] → teamImages[index]
                    alt={member.fullName}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    priority={index < 4}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold mb-1 text-foreground">
                    {member.fullName}
                  </h3>
                  <p className="text-sm font-semibold mb-3 text-orange-500">
                    {member.role}
                  </p>
                  <p className="text-sm leading-relaxed mb-2 text-foreground/90">
                    {member.bio}
                  </p>
                  {member.fun && (
                    <p className="text-xs italic text-muted-foreground">
                      {member.fun}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop Animation Layout (≥ 768px) - Original animations preserved
  return (
    <Card className="team-section border-4 border-muted w-screen h-[100svh] flex md:flex-col justify-center items-center md:gap-[2.5em] gap-4 overflow-hidden relative team-page m-0 p-0 box-border flex-col-reverse md:flex-nowrap bg-background">
      <CardHeader className="absolute top-12 md:top-20 left-0 w-full flex justify-center items-center secondary-font z-30">
        <CardTitle className="text-3xl md:text-4xl lg:text-5xl text-foreground">{title}</CardTitle>
      </CardHeader>
      <div
        className="profile-images flex flex-wrap md:flex-nowrap justify-center items-center w-full md:w-max max-w-[95%] sm:max-w-[85%] md:max-w-none gap-2 md:gap-0"
        ref={imagesRef}
      >
        {teamImages.map((src, i) => (
          <div
            className="img relative w-[60px] h-[60px] p-[10px] cursor-pointer will-change-[width,height] md:w-[70px] md:h-[70px] md:p-[0.5rem]"
            key={i}
            tabIndex={0}
            aria-label={`Profile image for ${teamNames[i + 1] || teamNames[0]}`}
            role="img"
            onClick={() => handleImageTap(i)}
            onMouseEnter={() => {
              if (window.innerWidth >= 900) setActiveIndex(i);
            }}
            onMouseLeave={() => {
              if (window.innerWidth >= 900) setActiveIndex(null);
            }}
          >
            <Image
              src={src}
              alt={`Profile of ${teamNames[i + 1] || teamNames[0]}`}
              width={70}
              height={70}
              className="w-full h-full object-cover rounded-lg"
              priority={i < 3}
            />
          </div>
        ))}
      </div>
      <div
        className="profile-names relative flex items-center justify-center w-full h-[5rem] sm:h-[6rem] md:h-[15rem] overflow-hidden z-10"
        ref={namesRef}
      >
        {teamNames.map((name, i) => (
          <div
            className={`name${i === 0 ? " default" : ""} w-full h-full`}
            key={i}
          >
            <h1
              className={
                `split absolute w-full text-center uppercase font-extrabold leading-none select-none z-10 ` +
                `font-['IBM_Plex_Mono'] text-[4rem] tracking-[0] drop-shadow-lg md:text-[13rem] md:tracking-[-0.5rem] ` +
                (i === 0
                  ? "-translate-x-1/2 -translate-y-[60%] left-1/2 top-1/2 md:-translate-y-[150%] text-foreground"
                  : "-translate-x-1/2 translate-y-[50%] left-1/2 top-1/2 md:translate-y-[50%] text-orange-500")
              }
              style={{
                fontFamily: "IBM Plex Mono, monospace",
              }}
            >
              {i === 0
                ? name
                : teamInfo[i - 1]?.fullName?.split(" ")[0] || name}
            </h1>
          </div>
        ))}
      </div>
      {/* Animated Info Card */}
      <AnimatePresence>
        {activeIndex !== null && teamInfo[activeIndex] && (
          <Card
            key={activeIndex}
            className="absolute left-1/2 -translate-x-1/2 bottom-4 sm:bottom-6 md:bottom-8 w-[calc(100%-20px)] sm:w-[calc(100%-40px)] max-w-2xl md:max-w-4xl rounded-xl shadow-xl p-0 secondary-font border-none min-h-[180px] sm:min-h-[160px] md:min-h-[100px] flex flex-col justify-center items-center bg-card/95 backdrop-blur-sm"
            style={{ zIndex: 20 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="w-full h-full flex flex-col md:flex-row justify-between items-start md:items-center p-4 sm:p-5 md:p-6 gap-4 md:gap-6 md:mx-8"
            >
              {/* Left: Name and Role */}
              <div className="flex flex-col items-start min-w-[120px] w-full md:w-auto md:max-w-[40%]">
                <h3 className="text-xl sm:text-2xl font-bold leading-tight text-foreground">
                  {teamInfo[activeIndex]?.fullName ||
                    teamNames[activeIndex + 1]}
                </h3>
                <p className="text-xs sm:text-sm font-semibold mt-1 text-foreground">
                  {teamInfo[activeIndex].role}
                </p>
              </div>
              {/* Right: Bio and Fun Fact */}
              <div className="flex-1 text-left md:pl-6 md:border-l-4 border-orange-500 flex flex-col justify-center w-full">
                <div className="flex items-start gap-2">
                  <span className="text-2xl sm:text-3xl select-none leading-none text-orange-500">
                    "
                  </span>
                  <span className="text-base sm:text-lg md:text-xl font-medium leading-snug text-foreground">
                    {teamInfo[activeIndex].bio}
                  </span>
                </div>
                {teamInfo[activeIndex].fun && (
                  <span className="block text-xs sm:text-sm italic mt-2 pl-6 md:pl-8 text-muted-foreground">
                    {teamInfo[activeIndex].fun}
                  </span>
                )}
              </div>
            </motion.div>
          </Card>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default TeamShowcase;
