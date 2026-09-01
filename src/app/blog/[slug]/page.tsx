import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GlassPage from "@/components/ui/glass/GlassPage";
import { CTABand } from "@/components/ui/glass/Sections";
import { Reveal } from "@/components/ui/glass/Reveal";
import { blogPosts, postBySlug } from "@/data/site";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return { title: "Article not found" };
  return { title: `${post.title} — ROI Makers`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = postBySlug(slug);

  if (!post) notFound();

  const more = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2);

  return (
    <GlassPage crumbs={[{ label: "Blog", href: "/blog" }, { label: post.category }]}>
      <article>
        <header className="shell max-w-3xl pt-10 sm:pt-14">
          <Reveal immediate>
            <p className="eyebrow">{post.category}</p>
          </Reveal>
          <Reveal immediate delay={0.08}>
            <h1 className="display-2 mt-5 text-balance">{post.title}</h1>
          </Reveal>
          <Reveal immediate delay={0.16}>
            <p className="lede archivo-font mt-6 text-pretty">{post.excerpt}</p>
          </Reveal>
          <Reveal immediate delay={0.24}>
            <div className="glass glass-sm mt-8 flex flex-wrap items-center gap-4 p-4">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image src={post.author.avatar} alt="" fill sizes="40px" className="object-cover" />
              </div>
              <div className="clash-display-font text-[0.62rem] uppercase tracking-[0.18em]">
                <p>{post.author.name}</p>
                <p className="mt-1 text-soft">
                  <time dateTime={post.isoDate}>{post.date}</time> · {post.readTime}
                </p>
              </div>
            </div>
          </Reveal>
        </header>

        <div className="shell mt-12">
          <Reveal immediate delay={0.3}>
            <div className="frame frame-lg relative aspect-[21/9]">
              <Image src={post.image} alt="" fill priority sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            </div>
          </Reveal>
        </div>

        <div className="shell max-w-3xl">
          <div className="glass my-12 p-7 sm:p-12">
            {post.body.map((block) =>
              block.startsWith("## ") ? (
                <h2 key={block} className="display-3 mt-10 first:mt-0 text-balance">
                  {block.slice(3)}
                </h2>
              ) : (
                <p key={block} className="body-copy archivo-font mt-5 first:mt-0 text-pretty">
                  {block}
                </p>
              )
            )}
          </div>
        </div>
      </article>

      {/* ---------------------------------------------------------- */}
      <section className="section-tight">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <h2 className="display-2">Keep reading</h2>
            <Link href="/blog" className="btn-glass group">
              <span className="link-arrow">
                <span>All articles</span>
                <span aria-hidden>↗</span>
              </span>
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {more.map((item, index) => (
              <Reveal key={item.slug} delay={index * 0.1}>
                <Link href={`/blog/${item.slug}`} className="group block h-full">
                  <article className="glass glass-card flex h-full flex-col">
                    <div className="media-zoom relative aspect-[16/9] overflow-hidden rounded-t-[inherit]">
                      <Image src={item.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="clash-display-font text-[0.6rem] uppercase tracking-[0.2em] text-[var(--brand)]">
                        {item.category}
                      </p>
                      <h3 className="display-4 mt-3 text-balance">{item.title}</h3>
                      <p className="body-copy archivo-font mt-3 flex-1 text-sm">{item.excerpt}</p>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        eyebrow="Let's talk growth"
        title="Want this applied to your business?"
        body="Tell us where you are. We'll tell you exactly where you can go and how we get there. No fluff, no filler."
        actions={[
          { label: "Book a growth call", href: "/contact#contact-form" },
          { label: "See our services", href: "/services", variant: "glass" },
        ]}
      />
    </GlassPage>
  );
}
