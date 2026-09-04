"use client";
import React, { useEffect, useRef, lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomeHero from "@/components/sections/home/HomeExpandingHero";
import LoadingOverlay from "@/components/ui/feedback/LoadingOverlay";

// Lazy load components that aren't immediately visible
const ImageWall = lazy(() => import("@/components/ui/shared/ImageWall"));
const ServicesShowcase = lazy(() => import("@/components/sections/home/ServicesShowcase")); 
const HomeServicesGrid = lazy(() => import("@/components/sections/home/HomeServicesGrid"));
const HomeTeamGallery = lazy(() => import("@/components/sections/home/HomeTeamGallery"));
const HomeAbout = lazy(() => import("@/components/sections/home/HomeAbout"));
const ClientsStats = lazy(() => import("@/components/sections/home/ClientsStats"));
const HomeFAQ = lazy(() => import("@/components/sections/home/HomeFAQ"));
const SiteFooter = lazy(() => import("@/components/global/SiteFooter"));

gsap.registerPlugin(ScrollTrigger);

const MenuPage = () => {
  const [showLoading, setShowLoading] = React.useState(true);
  const [showHero, setShowHero] = React.useState(false);
  const [showContent, setShowContent] = React.useState(false);
  const outroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!showLoading) {
      setShowHero(true);
    }
  }, [showLoading]);

  useEffect(() => {
    if (showHero) {
      // Wait a bit before showing content
      const timer = setTimeout(() => setShowContent(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [showHero]);

  useEffect(() => {
    if (showContent) {
      // Animate outro
      if (outroRef.current) {
        gsap.fromTo(
          outroRef.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.5 }
        );
      }
      
      // Refresh ScrollTrigger after content loads
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [showContent]);

  return (
    <div className="min-h-screen text-foreground boska-font overflow-x-hidden bg-background">
      <HomeHero
        showLoading={showLoading}
        showHero={showHero}
        showContent={showContent}
        onLoadingFinish={() => setShowContent(true)}
        videoSrc="https://www.youtube.com/embed/aYSp5qUTC54?autoplay=1&mute=1&loop=1&playlist=aYSp5qUTC54&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&color=white"
      />
      {showLoading && <LoadingOverlay onFinish={() => setShowLoading(false)} />}
      {showContent && (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-lg">Loading...</div>
        </div>}>
          <section
            className="outro flex flex-col justify-center items-center min-h-[100vh] w-full px-2 sm:px-4 md:px-[2.5em] mt-16 sm:mt-20 md:mt-0"
            ref={outroRef}
          >
            <ImageWall
              heroText="ROI first. Always."
              heroTextClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl px-2 sm:px-4 md:px-[2.5em] flex justify-center items-center font-medium text-foreground text-center w-full"
              buttonText="Let's make it count"
              lines={[
                'Performance marketing built for brands that refuse to be average.',
                'Nine years in. 1,200+ campaigns. 250+ active clients.',
                'Tell us where you are. We will tell you exactly where you can go.',
              ]}
              footerContent={
                <section className="hero mb-20 sm:mb-30 md:mb-40 lg:mb-60 flex justify-center items-center w-screen bg-background">
                  <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl px-2 sm:px-4 md:px-[2.5em] flex justify-center items-center font-medium text-foreground text-center w-full">
                    See how we transform brands
                  </p>

                </section>
              }
              stackImageCount={6}
            />
          </section>
          <HomeServicesGrid/>
          {/* <ServicesShowcase /> */}
          <ClientsStats />
          <HomeAbout />
          <HomeTeamGallery />
          <HomeFAQ />
          <SiteFooter />
        </Suspense>
      )}
    </div>
  );
};

export default MenuPage;
