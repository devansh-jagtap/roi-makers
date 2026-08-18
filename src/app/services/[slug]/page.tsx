'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import SiteFooter from '@/components/layout/SiteFooter';

const servicesData: Record<string, {
  title: string;
  description: string;
  image: string;
  features: string[];
  benefits: string[];
  process: { step: string; description: string }[];
}> = {
  'digital-marketing': {
    title: 'Digital Marketing',
    description: 'Drive measurable growth with comprehensive digital marketing strategies that connect your brand with the right audience across all digital channels.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
    features: [
      'Multi-Channel Campaign Management',
      'Content Marketing Strategy',
      'Email Marketing Automation',
      'Marketing Analytics & Reporting',
      'Customer Journey Optimization',
      'Brand Positioning & Messaging'
    ],
    benefits: [
      'Reach your target audience effectively',
      'Build consistent brand presence across channels',
      'Generate qualified leads continuously',
      'Improve customer engagement and retention',
      'Maximize marketing ROI with data-driven decisions'
    ],
    process: [
      { step: 'Discovery', description: 'Understand your business goals and target audience' },
      { step: 'Strategy', description: 'Develop comprehensive digital marketing roadmap' },
      { step: 'Execution', description: 'Launch campaigns across selected channels' },
      { step: 'Optimize', description: 'Continuously refine based on performance data' }
    ]
  },
  'performance-marketing': {
    title: 'Performance Marketing',
    description: 'Pay only for results with performance-driven marketing campaigns that deliver measurable ROI through strategic paid advertising and conversion optimization.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    features: [
      'PPC Campaign Management (Google Ads, Meta Ads)',
      'Conversion Rate Optimization',
      'Landing Page Design & Testing',
      'Retargeting & Remarketing',
      'Performance Analytics Dashboard',
      'Budget Optimization & Scaling'
    ],
    benefits: [
      'Pay only for actual results and conversions',
      'Quick market entry and faster results',
      'Precise audience targeting capabilities',
      'Real-time campaign performance tracking',
      'Scalable growth based on performance'
    ],
    process: [
      { step: 'Audit', description: 'Analyze current performance and opportunities' },
      { step: 'Setup', description: 'Configure tracking and launch campaigns' },
      { step: 'Test', description: 'Run A/B tests to optimize performance' },
      { step: 'Scale', description: 'Increase budget on winning campaigns' }
    ]
  },
  'website-development': {
    title: 'Website Development',
    description: 'Build fast, secure, and scalable websites that deliver exceptional user experiences and drive business growth with modern web technologies.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80',
    features: [
      'Custom Website Design & Development',
      'Responsive & Mobile-First Design',
      'CMS Integration (WordPress, Contentful)',
      'Performance Optimization',
      'Security & SSL Implementation',
      'Ongoing Maintenance & Support'
    ],
    benefits: [
      'Professional online presence that builds trust',
      'Fast loading speeds for better user experience',
      'Mobile-optimized for all devices',
      'SEO-friendly architecture for better rankings',
      'Easy content management for your team'
    ],
    process: [
      { step: 'Planning', description: 'Define requirements and create sitemap' },
      { step: 'Design', description: 'Create mockups and design system' },
      { step: 'Development', description: 'Build and integrate all features' },
      { step: 'Launch', description: 'Test, deploy, and train your team' }
    ]
  },
  'ecommerce': {
    title: 'E-commerce',
    description: 'Launch and grow your online store with complete e-commerce solutions that convert visitors into customers and maximize revenue.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80',
    features: [
      'Custom E-commerce Development',
      'Shopping Cart & Checkout Optimization',
      'Payment Gateway Integration',
      'Inventory Management Systems',
      'Product Catalog Management',
      'Order Fulfillment Automation'
    ],
    benefits: [
      'Increase online sales and revenue',
      'Provide seamless shopping experience',
      'Reduce cart abandonment rates',
      'Automate order processing and fulfillment',
      'Scale your business efficiently'
    ],
    process: [
      { step: 'Setup', description: 'Configure store structure and product catalog' },
      { step: 'Design', description: 'Create conversion-optimized store design' },
      { step: 'Integration', description: 'Connect payment, shipping, and tools' },
      { step: 'Growth', description: 'Optimize and scale your store performance' }
    ]
  },
  'shopify-development': {
    title: 'Shopify Development',
    description: 'Build and customize your Shopify store with expert development that maximizes conversions and creates a unique brand experience.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1600&q=80',
    features: [
      'Custom Shopify Theme Development',
      'Shopify App Integration',
      'Custom Functionality Development',
      'Store Migration to Shopify',
      'Performance Optimization',
      'Shopify Plus Solutions'
    ],
    benefits: [
      'Launch your store quickly with Shopify',
      'Get unique custom features for your brand',
      'Seamless integration with marketing tools',
      'Reliable and secure e-commerce platform',
      'Easily manage products and orders'
    ],
    process: [
      { step: 'Consultation', description: 'Understand your store requirements' },
      { step: 'Development', description: 'Build custom theme and features' },
      { step: 'Testing', description: 'Ensure everything works perfectly' },
      { step: 'Launch', description: 'Go live and monitor performance' }
    ]
  },
  'social-media-marketing': {
    title: 'Social Media Marketing',
    description: 'Build engaged communities and drive business results with strategic social media marketing across all major platforms.',
    image: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=1600&q=80',
    features: [
      'Social Media Strategy Development',
      'Content Creation & Curation',
      'Community Management',
      'Paid Social Advertising',
      'Influencer Marketing',
      'Social Media Analytics'
    ],
    benefits: [
      'Build brand awareness and recognition',
      'Engage directly with your audience',
      'Drive traffic to your website',
      'Generate leads from social platforms',
      'Build loyal customer community'
    ],
    process: [
      { step: 'Strategy', description: 'Define goals and content pillars' },
      { step: 'Create', description: 'Produce engaging social content' },
      { step: 'Engage', description: 'Manage community and conversations' },
      { step: 'Grow', description: 'Scale reach with paid and organic tactics' }
    ]
  },
  'search-engine-optimization': {
    title: 'Search Engine Optimization',
    description: 'Dominate search results and drive organic traffic with comprehensive SEO strategies that improve rankings and increase visibility.',
    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1600&q=80',
    features: [
      'Technical SEO Optimization',
      'Keyword Research & Strategy',
      'On-Page SEO Optimization',
      'Link Building Campaigns',
      'Local SEO & Google Business',
      'SEO Content Strategy'
    ],
    benefits: [
      'Increase organic search traffic',
      'Improve search engine rankings',
      'Build long-term sustainable visibility',
      'Attract high-intent customers',
      'Reduce dependency on paid advertising'
    ],
    process: [
      { step: 'Audit', description: 'Comprehensive SEO analysis of your site' },
      { step: 'Strategy', description: 'Create prioritized SEO roadmap' },
      { step: 'Optimize', description: 'Implement on-page and technical fixes' },
      { step: 'Build', description: 'Earn quality backlinks and authority' }
    ]
  },
  'virtual-tours': {
    title: 'Virtual Tours',
    description: 'Showcase your spaces with immersive 360° virtual tours that engage customers and drive conversions for real estate, hospitality, and retail.',
    image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?auto=format&fit=crop&w=1600&q=80',
    features: [
      '360° Photography & Videography',
      'Interactive Virtual Tour Creation',
      'Virtual Staging & Enhancement',
      'Google Street View Integration',
      'Custom Branding & Hotspots',
      'Virtual Reality (VR) Compatible'
    ],
    benefits: [
      'Showcase properties 24/7 remotely',
      'Reduce in-person showing requirements',
      'Engage customers with immersive experience',
      'Stand out from competitors',
      'Increase conversion rates and bookings'
    ],
    process: [
      { step: 'Planning', description: 'Schedule shoot and plan tour flow' },
      { step: 'Capture', description: 'Professional 360° photography' },
      { step: 'Production', description: 'Edit and create interactive tour' },
      { step: 'Publish', description: 'Deploy on your website and platforms' }
    ]
  }
};

export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const service = servicesData[slug];

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen w-full boska-font" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060010]/80 via-[#060010]/60 to-[#060010]/40" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link 
              href="/services"
              className="inline-flex items-center gap-2 text-[#E9E4D7]/80 hover:text-[#E9E4D7] transition-colors duration-300 mb-6 text-sm uppercase tracking-wider clash-display-font"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#E9E4D7] mb-6">
              {service.title}
            </h1>
            <p className="text-xl md:text-2xl text-[#E9E4D7]/90 max-w-3xl archivo-font leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="uppercase tracking-[0.5em] text-xs font-semibold text-[#8c7b62] clash-display-font mb-4">
            What We Offer
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-[#060010]">
            Comprehensive Solutions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-[24px] border border-[#060010]/10 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(6,0,16,0.25)] hover:shadow-[0_30px_90px_-40px_rgba(6,0,16,0.4)] transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-[#ff9933] rounded-full mt-2 flex-shrink-0" />
                  <span className="text-base text-[#060010] archivo-font leading-relaxed">{feature}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="rounded-[40px] border border-[#060010]/10 bg-gradient-to-br from-[#060010] to-[#312619] p-12 md:p-16 shadow-2xl">
            <p className="uppercase tracking-[0.5em] text-xs font-semibold text-[#ff9933] clash-display-font mb-4">
              Key Benefits
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-10 text-[#E9E4D7]">
              Why Choose This Service
            </h2>
            <ul className="grid md:grid-cols-2 gap-6">
              {service.benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="w-2 h-2 bg-[#ff9933] rounded-full mt-2 flex-shrink-0" />
                  <span className="text-lg text-[#E9E4D7]/90 archivo-font leading-relaxed">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="uppercase tracking-[0.5em] text-xs font-semibold text-[#8c7b62] clash-display-font mb-4">
            Our Process
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-[#060010]">
            How We Work
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-[28px] border border-[#060010]/10 bg-white/80 p-8 shadow-[0_20px_60px_-40px_rgba(6,0,16,0.25)] hover:shadow-[0_30px_90px_-40px_rgba(6,0,16,0.4)] transition-all duration-300"
              >
                <div className="text-5xl font-black text-[#ff9933] mb-4 clash-display-font">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#060010]">
                  {step.step}
                </h3>
                <p className="text-sm text-[#312619]/80 archivo-font leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-[#060010] text-[#E9E4D7] rounded-[40px] p-12 md:p-16 text-center shadow-2xl"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl mb-10 text-[#E9E4D7]/80 archivo-font max-w-2xl mx-auto">
            Let's discuss how our {service.title.toLowerCase()} services can drive measurable growth for your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90 clash-display-font"
            >
              Start a Project <span aria-hidden>→</span>
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-[#E9E4D7] text-[#E9E4D7] rounded-full font-semibold text-sm uppercase tracking-wider clash-display-font hover:bg-[#E9E4D7] hover:text-[#060010] transition-all duration-300 hover:scale-105"
            >
              View All Services
            </Link>
          </div>
        </motion.div>
      </section>

      <SiteFooter />
    </main>
  );
}
