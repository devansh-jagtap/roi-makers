"use client";

import { StickyCard002 } from "@/components/ui/sticky-card";
import { missionVision } from "@/data/site";

/* Orange, white, black — the three brand colours, one per card. */
const cards = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    alt: "Our Mission",
    title: "Our Mission",
    description: missionVision.mission.body,
    ctaText: "Read more",
    ctaLink: "/about",
    bgColor: "#000000",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    alt: "Our Vision",
    title: "Our Vision",
    description: missionVision.vision.body,
    ctaText: "Read more",
    ctaLink: "/about",
    bgColor: "#f26b38",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80",
    alt: "Our History",
    title: "Our History",
    description:
      "Started in a cramped Indore office with one stubborn belief: creative work should drive revenue. Today, 250+ brands and 1,200+ campaigns later, that belief runs the whole operation.",
    ctaText: "Read more",
    ctaLink: "/about",
    bgColor: "#ffffff",
  },
];

export default function AboutCards() {
  return (
    <section className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mb-10 text-center sm:mb-12 md:mb-16">
          <p className="eyebrow">Get to know us</p>
          <h2 className="display-1 mt-4 text-balance">
            Nine years deep.
            <br />
            <span className="display-accent">Still obsessed.</span>
          </h2>
          <p className="lede archivo-font mx-auto mt-6 max-w-3xl text-pretty">
            We started with one belief: creative work should drive revenue, not just win awards. Today, 250+ brands
            trust us with their growth because we trade in results, not reports. Indore-born. Globally proven.
          </p>
        </div>

        <StickyCard002 cards={cards} />
      </div>
    </section>
  );
}
