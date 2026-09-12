"use client";

import Image from "next/image";
import Link from "next/link";
import { creators } from "@/data/site";

export default function HomeInfluencers() {
  return (
    <section className="bg-background py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center sm:mb-12 md:mb-14">
          <p className="eyebrow">Influencers</p>
          <h2 className="display-2 mt-4 text-balance">
            People who get the brief&hellip;
            <br />
            <span className="display-accent">and the business.</span>
          </h2>
          <p className="lede archivo-font mx-auto mt-5 max-w-3xl px-2 text-pretty">
            No fake hype here. Just creators who know how to make something, connect with an audience, and actually
            move the needle for brands.
          </p>
        </div>
      </div>

      {/* Portrait rail — the same CSS marquee the quote rail uses, so it
          costs no animation frame. Duplicated once for the seamless loop. */}
      <div className="creator-rail">
        <div className="creator-track marquee-track">
          {[0, 1].map((group) => (
            <ul key={group} className="creator-group" aria-hidden={group === 1}>
              {creators.map((creator) => (
                <li key={creator.handle} className="creator-card frame">
                  <Image
                    src={creator.image}
                    alt={creator.name}
                    fill
                    sizes="(max-width: 640px) 180px, 220px"
                    className="object-cover"
                  />
                  <div className="creator-shade" aria-hidden />
                  <p className="creator-handle glass-pill !normal-case !tracking-[0.06em]">{creator.handle}</p>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center sm:mt-12">
        <Link
          href="/projects"
          className="link-arrow clash-display-font text-[0.66rem] uppercase tracking-[0.2em] text-[var(--brand)]"
        >
          <span>See the campaigns they powered</span>
          <span aria-hidden>↗</span>
        </Link>
      </div>
    </section>
  );
}
