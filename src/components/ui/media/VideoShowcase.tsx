"use client";
import React from "react";

interface VideoShowcaseProps {
  videoSrc: string;
  className?: string;
  containerClassName?: string;
}

/**
 * Injects YouTube parameters that hide all player UI (controls, branding,
 * progress bar, title, annotations, related videos, fullscreen button).
 */
function sanitizeYouTubeUrl(src: string): string {
  try {
    const url = new URL(src);
    const isYouTube =
      url.hostname.includes("youtube.com") ||
      url.hostname.includes("youtu.be");

    if (!isYouTube) return src;

    const silentParams: Record<string, string> = {
      controls: "0",
      modestbranding: "1",
      showinfo: "0",
      rel: "0",
      iv_load_policy: "3",
      disablekb: "1",
      fs: "0",
      playsinline: "1",
      color: "white",
      autoplay: "1",
      mute: "1",
    };

    Object.entries(silentParams).forEach(([key, value]) => {
      url.searchParams.set(key, value); // enforce even if already present
    });

    // Switch to the privacy-enhanced / reduced-UI nocookie domain
    if (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") {
      url.hostname = "www.youtube-nocookie.com";
    }

    return url.toString();
  } catch {
    return src;
  }
}

/**
 * VideoShowcase Component
 *
 * Handles both video files (.mp4/.webm) and YouTube/Vimeo iframe embeds.
 * For YouTube: automatically strips all player controls and branding.
 * An invisible overlay prevents accidental clicks from revealing the YouTube UI.
 */
const VideoShowcase: React.FC<VideoShowcaseProps> = ({
  videoSrc,
  className = "",
  containerClassName = "",
}) => {
  const isVideoFile =
    videoSrc.endsWith(".mp4") || videoSrc.endsWith(".webm");

  const cleanSrc = isVideoFile ? videoSrc : sanitizeYouTubeUrl(videoSrc);

  return (
    <div
      className={`relative w-full aspect-[16/9] rounded-[1rem] overflow-hidden ${containerClassName}`}
      style={{
        backgroundColor: "#1a365d",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}
    >
      {isVideoFile ? (
        <video
          src={cleanSrc}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute top-0 left-0 w-full h-full object-cover pointer-events-none ${className}`}
        />
      ) : (
        /*
         * Scale + overflow-crop trick:
         * The iframe is positioned -15% on every side, making it 130% of the
         * container's size. The parent's overflow:hidden crops the edges,
         * which is exactly where YouTube renders its title bar (top) and
         * its controls / branding bar (bottom). The video content itself
         * is centred and fully visible.
         */
        <iframe
          src={cleanSrc}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          title="Video showcase"
          className={`pointer-events-none ${className}`}
          style={{
            position: "absolute",
            top: "-15%",
            left: "-15%",
            width: "130%",
            height: "130%",
            border: "none",
          }}
        />
      )}

      {/* Invisible overlay — sits above the iframe so no click ever reaches YouTube */}
      {!isVideoFile && (
        <div
          className="absolute inset-0 z-10"
          aria-hidden="true"
          style={{ cursor: "default" }}
        />
      )}
    </div>
  );
};

export default VideoShowcase;


// Legacy commented code below for reference - can be deleted after migration

//     const videoContainer = videoContainerRef.current;
//     const lenis = new Lenis();
//     lenis.on("scroll", ScrollTrigger.update);

//     gsap.ticker.add((time) => {
//       lenis.raf(time * 1000);
//     });
//     gsap.ticker.lagSmoothing(0);

//     const animationState = {
//       scrollProgress: 0,
//       initialTranslateY,
//       currentTranslateY: initialTranslateY,
//       scale: initialScale,
//       fontSize: initialFontSize,
//       gap: initialGap,
//       targetMouseX: 0,
//       currentMouseX: 0,
//       movementMultiplier: 650,
//     };

//     const handleMouseMove = (e: MouseEvent) => {
//       animationState.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
//     };
//     document.addEventListener("mousemove", handleMouseMove);

//     let rafId: number;
//     const animate = () => {
//       if (window.innerWidth < 900) return;
//       const { scale, targetMouseX, currentMouseX, gap, movementMultiplier } =
//         animationState;
//       const scaleMovementMultiplier = (1 - scale) * movementMultiplier;
//       const maxHorizontalMovement =
//         scale < 0.95 ? targetMouseX * scaleMovementMultiplier : 0;
//       animationState.currentMouseX = gsap.utils.interpolate(
//         currentMouseX,
//         maxHorizontalMovement,
//         0.05
//       );
//       if (videoContainer) {
//         videoContainer.style.transform = `translateY(${animationState.currentTranslateY}%) translateX(${animationState.currentMouseX}px) scale(${scale})`;
//         videoContainer.style.gap = `${gap}em`;
//       }
//       rafId = requestAnimationFrame(animate);
//     };
//     animate();

//     gsap.timeline({
//       scrollTrigger: {
//         trigger: ".intro",
//         start: "top bottom",
//         end: "top 10%",
//         scrub: true,
//         onUpdate: (self) => {
//           animationState.scrollProgress = self.progress;

//           animationState.currentTranslateY = gsap.utils.interpolate(
//             animationState.initialTranslateY,
//             finalTranslateY,
//             animationState.scrollProgress
//           );
//           animationState.scale = gsap.utils.interpolate(
//             initialScale,
//             finalScale,
//             animationState.scrollProgress
//           );
//           animationState.gap = gsap.utils.interpolate(
//             initialGap,
//             finalGap,
//             animationState.scrollProgress
//           );
//           if (animationState.scrollProgress <= 0.4) {
//             const firstPartProgress = animationState.scrollProgress / 0.4;
//             animationState.fontSize = gsap.utils.interpolate(
//               initialFontSize,
//               midFontSize,
//               firstPartProgress
//             );
//           } else {
//             const secondPartProgress =
//               (animationState.scrollProgress - 0.4) / 0.6;
//             animationState.fontSize = gsap.utils.interpolate(
//               midFontSize,
//               finalFontSize,
//               secondPartProgress
//             );
//           }

//           // Apply font size to video titles
//           videoTitleRefs.current.forEach((el) => {
//             if (el) el.style.fontSize = `${animationState.fontSize}px`;
//           });
//         },
//       },
//     });

//     return () => {
//       gsap.killTweensOf(videoContainer);
//       gsap.ticker.remove(lenis.raf);
//       lenis.destroy();
//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//       document.removeEventListener("mousemove", handleMouseMove);
//       cancelAnimationFrame(rafId);
//     };
//   }, [
//     initialTranslateY,
//     finalTranslateY,
//     initialScale,
//     finalScale,
//     initialFontSize,
//     midFontSize,
//     finalFontSize,
//     initialGap,
//     finalGap,
//     videoSrc,
//   ]);

//   return (
//     <div
//       className="pp-neue-world-font video-container-desktop relative flex flex-col gap-[2em] will-change-transform translate-y-[20%]"
//       ref={videoContainerRef}
//     >
//       <div className="video-preview relative w-full aspect-[16/9] rounded-[1.5rem] bg-[#b9b9b3] overflow-hidden">
//         <div className="video-wrapper absolute top-0 left-0 w-full h-full rounded-[1.5rem] overflow-hidden">
//           {videoSrc.endsWith(".mp4") ? (
//             <video
//               src={videoSrc}
//               autoPlay
//               loop
//               muted
//               playsInline
//               className="absolute top-0 left-0 w-full h-full rounded-[1.5rem] object-cover pointer-events-none"
//             />
//           ) : (
//             <iframe
//               src={videoSrc}
//               frameBorder="0"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//               allowFullScreen
//               loading="lazy"
//               title="video"
//               className="absolute top-0 left-0 w-full h-full rounded-[1.5rem] pointer-events-none"
//             ></iframe>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoShowcase;
