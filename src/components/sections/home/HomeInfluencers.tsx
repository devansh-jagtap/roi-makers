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

        <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-4 gap-y-6 sm:gap-x-6">
          {creators.map((creator) => (
            <li key={creator.handle}>
              <a
                href={`https://www.instagram.com/${creator.handle.replace(/^@/, "")}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="creator-tag"
              >
                <span className="creator-avatar">
                  <Image src={creator.image} alt={creator.name} fill sizes="140px" className="object-cover" />
                </span>
                <span className="glass-pill creator-handle !normal-case !tracking-[0.06em]">{creator.handle}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center sm:mt-12">
          <Link
            href="/projects"
            className="link-arrow clash-display-font text-[0.66rem] uppercase tracking-[0.2em] text-[var(--brand)]"
          >
            <span>See the campaigns they powered</span>
            <span aria-hidden>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
