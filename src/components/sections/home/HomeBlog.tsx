"use client";

import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/site";

/* Latest three articles, newest first — same source the /blog page reads from. */
const latest = [...blogPosts].sort((a, b) => b.isoDate.localeCompare(a.isoDate)).slice(0, 3);

export default function HomeBlog() {
  return (
    <section className="bg-background py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center sm:mb-12 md:mb-14">
          <p className="eyebrow">From the blog</p>
          <h2 className="display-2 mt-4 text-balance">
            Insights <span className="display-accent">&amp; stories</span>
          </h2>
          <p className="lede archivo-font mx-auto mt-5 max-w-3xl px-2 text-pretty">
            Trends, tips and real-world lessons from the team — written for people who have to make marketing pay.
          </p>
        </div>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
          {latest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
              <article className="glass glass-card flex h-full flex-col overflow-hidden">
                <div className="media-zoom relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="clash-display-font flex flex-wrap items-center gap-3 text-[0.62rem] uppercase tracking-[0.2em] text-soft">
                    <span className="text-[var(--brand)]">{post.category}</span>
                    <span aria-hidden className="opacity-40">
                      /
                    </span>
                    <time dateTime={post.isoDate}>{post.date}</time>
                    <span aria-hidden className="opacity-40">
                      /
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="display-3 mt-3 text-balance">{post.title}</h3>
                  <p className="body-copy archivo-font mt-3 line-clamp-3">{post.excerpt}</p>
                  <span className="link-arrow clash-display-font mt-auto pt-5 text-[0.66rem] uppercase tracking-[0.2em] text-[var(--brand)]">
                    <span>Read the article</span>
                    <span aria-hidden>↗</span>
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center sm:mt-12">
          <Link
            href="/blog"
            className="link-arrow clash-display-font text-[0.66rem] uppercase tracking-[0.2em] text-[var(--brand)]"
          >
            <span>View all articles</span>
            <span aria-hidden>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
