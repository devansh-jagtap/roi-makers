"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollBaseAnimation from "@/components/ui/text-marquee";
import VideoShowcase from "@/components/ui/media/VideoShowcase";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  showLoading: boolean;
  showHero: boolean;
  showContent: boolean;
  onLoadingFinish: () => void;
  videoSrc?: string;
}

const marqueeItems = [
  { text: "TRANSFORM YOUR BRAND", imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80" },
  { text: "CREATIVE SOLUTIONS", imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80" },
  { text: "ROI MAKERS", imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80" },
];

export default function HomeHero({ showLoading, showHero, showContent, onLoadingFinish, videoSrc }: HeroProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 900);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (showLoading || !titleRef.current) return;
    const animation = gsap.fromTo(titleRef.current, { autoAlpha: 0, y: 44 }, {
      autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out", onComplete: onLoadingFinish,
    });
    return () => {
      animation.kill();
    };
  }, [showLoading, onLoadingFinish]);

  useEffect(() => {
    if (!showContent || !subtitleRef.current) return;
    const animation = gsap.fromTo(subtitleRef.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" });
    return () => {
      animation.kill();
    };
  }, [showContent]);

  useEffect(() => {
    if (!showContent || isMobile || !panelRef.current || !videoRef.current || !headingRef.current) return;
    const panel = panelRef.current;
    const context = gsap.context(() => {
      gsap.set(videoRef.current, { xPercent: -50, yPercent: -50, scale: 1, force3D: true });
      gsap.timeline({
        scrollTrigger: { trigger: panel, start: "top top", end: "+=100%", pin: true, scrub: 0.35, anticipatePin: 1, invalidateOnRefresh: true },
      })
        .to(videoRef.current, { left: "50%", scale: 2.3, ease: "none" }, 0)
        .to(headingRef.current, { y: -120, autoAlpha: 0, ease: "none" }, 0);
    }, panel);
    return () => context.revert();
  }, [showContent, isMobile]);

  return (
    <section className={`relative w-full bg-background ${isMobile ? "min-h-screen" : "min-h-[200vh]"}`}>
      <div ref={panelRef} className={`hero-theme-panel relative m-2 flex w-[calc(100%_-_1rem)] flex-col overflow-hidden rounded-[1.75rem] bg-[#f6a46d] sm:m-5 sm:w-[calc(100%_-_2.5rem)] sm:rounded-[3rem] ${isMobile ? "h-[84svh]" : "h-[calc(100vh_-_4rem)]"}`}>
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <ShaderGradientCanvas style={{ width: "100%", height: "100%" }} pixelDensity={0.7} pointerEvents="none">
            <ShaderGradient
              animate="on"
              type="plane"
              shader="defaults"
              wireframe={false}
              uTime={0}
              uSpeed={0.08}
              uStrength={1.05}
              uDensity={0.9}
              uFrequency={0}
              uAmplitude={0}
              positionX={0}
              positionY={0}
              positionZ={0}
              rotationX={45}
              rotationY={0}
              rotationZ={0}
              color1="#ffb35d"
              color2="#ff7548"
              color3="#ee312d"
              reflection={0.15}
              cAzimuthAngle={180}
              cPolarAngle={75}
              cDistance={3}
              cameraZoom={8}
              lightType="3d"
              brightness={1.15}
              envPreset="dawn"
              grain="on"
              toggleAxis={false}
              zoomOut={false}
              hoverState=""
              enableTransition={false}
            />
          </ShaderGradientCanvas>
        </div>
        <div aria-hidden="true" className="absolute inset-0 hero-panel-gradient pointer-events-none opacity-35 mix-blend-overlay" />
        <section className="relative z-10 flex flex-1 flex-col overflow-hidden px-6 pt-12 sm:px-8 md:px-12 lg:px-[3em] lg:pt-20">
          <div ref={headingRef} className={`relative z-10 mt-4 md:mt-8 ${isMobile ? "flex flex-1 flex-col items-center justify-center text-center" : ""}`}>
            <h1 ref={titleRef} className="mb-4 select-none text-[20vw] font-black uppercase leading-[0.85] tracking-[-0.04em] text-black sm:text-[18vw] md:mb-6 md:text-[16vw] lg:text-[14vw]" style={{ opacity: showHero ? 1 : 0 }}>ROI<span className="align-super ml-1 text-[0.5em]">™</span></h1>
            {showContent && (
              <div ref={subtitleRef} className={`mt-4 md:mt-6 ${isMobile ? "flex flex-col items-center" : ""}`}>
                <p className={`pp-neue-world-font select-none text-lg font-normal leading-snug text-black sm:text-xl md:w-[50%] md:text-2xl lg:text-[2.5vw] ${isMobile ? "w-full px-4 text-center" : ""}`}>ROI-first thinking for scale-hungry brands</p>
                <div className={`mt-7 flex flex-wrap gap-3 ${isMobile ? "justify-center" : ""}`}>
                  <Link href="/contact#contact-form" className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
                    Start your project <span aria-hidden="true">→</span>
                  </Link>
                  <Link href="/contact#contact-form" className="rounded-full border border-black/45 bg-white/20 px-6 py-3 text-sm font-semibold text-black transition-colors duration-200 hover:bg-white/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
                    Book a growth call
                  </Link>
                </div>
              </div>
            )}
          </div>
          {showContent && !isMobile && <div ref={videoRef} className="absolute left-[74%] top-[55%] z-0 flex w-[44vw] items-center justify-center will-change-transform" style={{ transform: "translate3d(-50%, -50%, 0)" }}><VideoShowcase videoSrc={videoSrc ?? ""} containerClassName="w-full" /></div>}
        </section>
      </div>
      {showContent && <div className="relative z-20 mt-0 w-full overflow-hidden bg-background px-2 py-5 sm:px-4 sm:py-7"><ScrollBaseAnimation baseVelocity={-0.65} clasname="font-extrabold text-foreground !text-3xl sm:!text-4xl md:!text-5xl [&_span]:!h-14 [&_span]:!w-14 sm:[&_span]:!h-16 sm:[&_span]:!w-16" items={marqueeItems} /></div>}
    </section>
  );
}
