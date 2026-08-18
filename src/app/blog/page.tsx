'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SiteFooter from '@/components/layout/SiteFooter';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
};

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Performance Marketing: AI-Driven Strategies',
    excerpt: 'Discover how artificial intelligence is revolutionizing the way we approach digital marketing and ROI optimization.',
    category: 'Strategy',
    date: 'Dec 5, 2024',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Aarav Khanna',
      avatar: '/team/1.webp',
    },
  },
  {
    id: '2',
    title: 'CRO Masterclass: 10 Proven Techniques to Double Conversions',
    excerpt: 'Learn the conversion rate optimization tactics that helped our clients achieve 200%+ improvements in their funnel performance.',
    category: 'CRO',
    date: 'Nov 28, 2024',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Maya Bose',
      avatar: '/team/2.webp',
    },
  },
  {
    id: '3',
    title: 'Building a Data-First Culture in Modern Marketing Teams',
    excerpt: 'Why data literacy matters more than ever and how to transform your marketing team into analytical powerhouses.',
    category: 'Analytics',
    date: 'Nov 20, 2024',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Raghav Desai',
      avatar: '/team/3.webp',
    },
  },
  {
    id: '4',
    title: 'Creative Systems That Scale: From Concept to Campaign',
    excerpt: 'How we built a production framework that ships 50+ high-quality creatives per week without burning out the team.',
    category: 'Creative',
    date: 'Nov 15, 2024',
    readTime: '15 min read',
    image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Maya Bose',
      avatar: '/team/2.webp',
    },
  },
  {
    id: '5',
    title: 'Media Mix Modeling in 2024: Beyond Last-Click Attribution',
    excerpt: 'Understanding true channel impact with statistical models that account for seasonality, lag effects, and cross-channel synergies.',
    category: 'Media',
    date: 'Nov 8, 2024',
    readTime: '14 min read',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Aarav Khanna',
      avatar: '/team/1.webp',
    },
  },
  {
    id: '6',
    title: 'The Psychology of High-Converting Landing Pages',
    excerpt: 'Behavioral science principles that drive action: from attention triggers to decision-making heuristics.',
    category: 'CRO',
    date: 'Oct 30, 2024',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Raghav Desai',
      avatar: '/team/3.webp',
    },
  },
];

const categories = ['All', 'Strategy', 'CRO', 'Analytics', 'Creative', 'Media'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = newsletterEmail.trim();
    const response = await fetch('/api/subscribers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source: 'blog', subscriptionType: 'BLOG' }) });
    if (response.ok) { setNewsletterEmail(''); alert('Thanks! Please check your inbox for a welcome email.'); } else { alert('We could not subscribe you right now. Please try again.'); }
  };

  const filteredPosts =
    selectedCategory === 'All'
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="blog-page min-h-screen boska-font" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-lg font-semibold uppercase tracking-[0.5em] text-[#8c7b62] mb-6 clash-display-font">Blog</p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#060010] mb-6">
              Insights & Stories
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-[#312619]/80 max-w-3xl mx-auto archivo-font leading-relaxed">
              Explore trends, tips, and real-world experiences from our team to help you navigate modern marketing confidently.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="blog-feature group relative cursor-pointer overflow-hidden rounded-[40px] border border-[#060010]/10 bg-white shadow-[0_25px_80px_-50px_rgba(6,0,16,0.4)]"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                <Image
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
              </div>
              <div className="p-8 md:pr-12">
                <span className="inline-block px-4 py-2 bg-[#060010] text-[#E9E4D7] rounded-full text-xs font-semibold uppercase tracking-wider clash-display-font mb-6">
                  Featured
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#060010] mb-4 group-hover:text-[#8c7b62] transition-colors duration-300">
                  {blogPosts[0].title}
                </h2>
                <p className="text-base md:text-lg text-[#312619]/80 archivo-font mb-6 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#060010]/10">
                    <Image
                      src={blogPosts[0].author.avatar}
                      alt={blogPosts[0].author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#060010] clash-display-font">{blogPosts[0].author.name}</p>
                    <p className="text-xs text-[#8c7b62] archivo-font">
                      {blogPosts[0].date} · {blogPosts[0].readTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Filter Section */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 clash-display-font uppercase tracking-wider ${
                  selectedCategory === category
                    ? 'bg-[#060010] text-[#E9E4D7] shadow-lg scale-105'
                    : 'bg-white/70 text-[#060010] hover:bg-white hover:shadow-md border border-[#060010]/10'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(1).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="group cursor-pointer"
              >
                <div className="relative h-[280px] rounded-[28px] overflow-hidden mb-6 border border-[#060010]/10 bg-white shadow-[0_20px_60px_-40px_rgba(6,0,16,0.25)]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#060010] clash-display-font">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-bold text-[#060010] group-hover:text-[#8c7b62] transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-sm md:text-base text-[#312619]/80 archivo-font leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#060010]/10">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-xs archivo-font text-[#8c7b62]">
                      {post.date} · {post.readTime}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-[#060010] text-[#E9E4D7] rounded-[40px] p-12 md:p-16 text-center shadow-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Stay In The Loop</h2>
            <p className="text-lg md:text-xl mb-8 text-[#E9E4D7]/80 archivo-font max-w-2xl mx-auto">
              Get weekly insights on performance marketing, creative systems, and data-driven growth delivered straight to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                required
                className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-[#E9E4D7]/20 text-[#E9E4D7] placeholder:text-[#E9E4D7]/60 archivo-font focus:outline-none focus:ring-2 focus:ring-[#E9E4D7]/50"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90 clash-display-font"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-[#E9E4D7]/60 mt-6 archivo-font">
              Join 5,000+ marketers. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
