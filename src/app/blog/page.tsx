"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GlassPage from "@/components/ui/glass/GlassPage";
import { HeroStage } from "@/components/ui/glass/HeroStage";
import { blogStage } from "@/data/stage";
import { FilterPills, SectionHeading } from "@/components/ui/glass/Sections";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/glass/Reveal";
import { useToast } from "@/components/ui/toast";
import { blogCategories, blogPosts } from "@/data/site";

export default function BlogPage() {
  const { toast } = useToast();
  const [category, setCategory] = useState("All");
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const visible = useMemo(
    () => (category === "All" ? blogPosts : blogPosts.filter((post) => post.category === category)),
    [category]
  );

  const [feature, ...rest] = visible;

  const subscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (subscribing) return;
    setSubscribing(true);
    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "blog", subscriptionType: "BLOG" }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "We could not subscribe you right now. Please try again.");
      }
      setEmail("");
      toast("You're subscribed successfully.", "success");
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "We could not subscribe you right now. Please try again.",
        "error"
      );
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <GlassPage>
      <HeroStage
        eyebrow="Fresh reads"
        title={
          <>
            Insights <span className="display-accent">&amp; stories</span>
          </>
        }
        lede="Explore trends, tips and real-world experience from our team to help you navigate modern marketing confidently."
        cards={blogStage}
        crumbs={[{ label: "Blog" }]}
      />

      <section className="section-tight">
        <div className="shell">
          <Reveal>
            <FilterPills
              label="Filter articles by topic"
              options={blogCategories}
              value={category}
              onChange={setCategory}
            />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      <section className="pb-[var(--section-y)]">
        <div className="shell">
          {feature ? (
            <Reveal key={feature.slug}>
              <Link href={`/blog/${feature.slug}`} className="group block">
                <article className="glass glass-card grid overflow-hidden lg:grid-cols-2">
                  <div className="media-zoom relative min-h-[260px] overflow-hidden lg:min-h-[440px]">
                    <Image
                      src={feature.image}
                      alt=""
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                    <span className="glass-pill absolute left-5 top-5 !border-white/25 !bg-white/15 !text-white">
                      Featured
                    </span>
                  </div>

                  <div className="flex flex-col justify-center p-7 sm:p-10">
                    <div className="clash-display-font flex flex-wrap items-center gap-3 text-[0.62rem] uppercase tracking-[0.2em] text-soft">
                      <span className="text-[var(--brand)]">{feature.category}</span>
                      <span aria-hidden className="opacity-40">
                        /
                      </span>
                      <time dateTime={feature.isoDate}>{feature.date}</time>
                      <span aria-hidden className="opacity-40">
                        /
                      </span>
                      <span>{feature.readTime}</span>
                    </div>
                    <h2 className="display-3 mt-4 text-balance">{feature.title}</h2>
                    <p className="body-copy archivo-font mt-4">{feature.excerpt}</p>
                    <span className="link-arrow clash-display-font mt-7 text-[0.66rem] uppercase tracking-[0.2em] text-[var(--brand)]">
                      <span>Read the article</span>
                      <span aria-hidden>↗</span>
                    </span>
                  </div>
                </article>
              </Link>
            </Reveal>
          ) : null}

          <RevealGroup className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <RevealItem key={post.slug} className="h-full">
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <article className="glass glass-card flex h-full flex-col">
                    <div className="media-zoom relative aspect-[16/10] overflow-hidden rounded-t-[inherit]">
                      <Image
                        src={post.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                      <span className="glass-pill absolute left-4 top-4 !border-white/25 !bg-white/15 !py-1.5 !text-[0.58rem] !text-white">
                        {post.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="display-4 text-balance">{post.title}</h3>
                      <p className="body-copy archivo-font mt-3 flex-1 text-sm">{post.excerpt}</p>
                      <div className="clash-display-font mt-5 flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.18em] text-soft">
                        <time dateTime={post.isoDate}>{post.date}</time>
                        <span aria-hidden className="opacity-40">
                          /
                        </span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          {visible.length === 0 ? (
            <Reveal>
              <p className="body-copy archivo-font py-16 text-center">Nothing filed under that topic yet.</p>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      <section className="section-tight">
        <div className="shell">
          <SectionHeading
            eyebrow="Topics we write about"
            title="Search, performance and the systems behind both."
            description="Everything we publish comes out of live client work — what we tried, what it cost, and what it returned."
          />
          <Reveal delay={0.1}>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {["Performance marketing", "SEO & AI search", "Lead generation", "Conversion", "Analytics", "Creative systems"].map(
                (topic) => (
                  <li key={topic} className="glass-pill !normal-case !tracking-[0.06em]">
                    {topic}
                  </li>
                )
              )}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      <section className="section-tight">
        <div className="shell">
          <Reveal>
            <div className="glass-ink px-6 py-14 text-center sm:px-12 sm:py-20">
              <p className="eyebrow">Newsletter</p>
              <h2 className="display-2 mx-auto mt-4 max-w-2xl text-balance">Stay in the loop.</h2>
              <p className="archivo-font mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                Weekly insights on performance marketing, creative systems and data-driven growth, delivered straight
                to your inbox.
              </p>
              <form onSubmit={subscribe} className="mx-auto mt-9 flex max-w-xl flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="glass-field archivo-font flex-1 !rounded-full !border-white/20 !bg-white/10 !text-white placeholder:text-white/50"
                />
                <button type="submit" disabled={subscribing} className="btn-brand disabled:opacity-60">
                  <span>{subscribing ? "Subscribing…" : "Subscribe"}</span>
                </button>
              </form>
              <p className="clash-display-font mt-6 text-[0.6rem] uppercase tracking-[0.18em] text-white/45">
                Unsubscribe anytime
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </GlassPage>
  );
}
