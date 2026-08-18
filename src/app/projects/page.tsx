'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SiteFooter from '@/components/layout/SiteFooter';

type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  results: {
    label: string;
    value: string;
  }[];
  tags: string[];
};

const projects: Project[] = [
  {
    id: '1',
    title: 'FinTech Revolution',
    category: 'Digital Banking',
    year: '2024',
    description: 'Transforming traditional banking with a cutting-edge mobile-first platform that increased user engagement by 340%.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1600&q=80',
    results: [
      { label: 'User Growth', value: '+340%' },
      { label: 'Conversion Rate', value: '12.4%' },
      { label: 'App Rating', value: '4.8/5' },
    ],
    tags: ['UX Design', 'Mobile App', 'Branding'],
  },
  {
    id: '2',
    title: 'EcoWear Marketplace',
    category: 'E-Commerce',
    year: '2024',
    description: 'Building a sustainable fashion marketplace that connects conscious consumers with ethical brands worldwide.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
    results: [
      { label: 'Revenue Growth', value: '+280%' },
      { label: 'Active Users', value: '125K+' },
      { label: 'Avg. Order Value', value: '+65%' },
    ],
    tags: ['E-Commerce', 'Web Design', 'SEO'],
  },
  {
    id: '3',
    title: 'HealthHub Platform',
    category: 'Healthcare',
    year: '2024',
    description: 'A comprehensive telehealth solution connecting patients with specialists, reducing wait times by 70%.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80',
    results: [
      { label: 'Patient Satisfaction', value: '96%' },
      { label: 'Consultations', value: '50K+' },
      { label: 'Response Time', value: '-70%' },
    ],
    tags: ['Healthcare', 'Product Design', 'HIPAA'],
  },
  {
    id: '4',
    title: 'PropTech Innovation',
    category: 'Real Estate',
    year: '2023',
    description: 'Revolutionizing property search and virtual tours with AI-powered recommendations and immersive experiences.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80',
    results: [
      { label: 'Listing Views', value: '+420%' },
      { label: 'Tour Bookings', value: '+190%' },
      { label: 'Sales Cycle', value: '-45%' },
    ],
    tags: ['AI', 'VR/AR', 'Real Estate'],
  },
  {
    id: '5',
    title: 'FoodHub Delivery',
    category: 'Food Tech',
    year: '2023',
    description: 'End-to-end delivery platform optimizing logistics and customer experience for local restaurants.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80',
    results: [
      { label: 'Daily Orders', value: '15K+' },
      { label: 'Delivery Time', value: '< 30min' },
      { label: 'Restaurant Partners', value: '800+' },
    ],
    tags: ['Logistics', 'Mobile', 'Marketplace'],
  },
  {
    id: '6',
    title: 'EduLearn Academy',
    category: 'EdTech',
    year: '2023',
    description: 'Interactive learning platform with personalized AI tutors and gamified content for K-12 students.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80',
    results: [
      { label: 'Students Enrolled', value: '200K+' },
      { label: 'Course Completion', value: '87%' },
      { label: 'Parent Satisfaction', value: '94%' },
    ],
    tags: ['Education', 'AI', 'Gamification'],
  },
];

const categories = ['All', 'Digital Banking', 'E-Commerce', 'Healthcare', 'Real Estate', 'Food Tech', 'EdTech'];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects =
    selectedCategory === 'All' ? projects : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen boska-font" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-xs uppercase tracking-[0.5em] text-[#8c7b62] mb-6 clash-display-font">Our Work</p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#060010] mb-6">
              Projects
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-[#312619]/80 max-w-3xl mx-auto archivo-font">
              Transforming visions into reality. Explore our portfolio of successful digital experiences that drive
              measurable results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
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

      {/* Projects Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-[400px] rounded-[32px] overflow-hidden mb-6 border border-[#060010]/10 bg-white shadow-[0_25px_80px_-50px_rgba(6,0,16,0.3)]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060010]/80 via-[#060010]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white clash-display-font"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.3em] text-[#8c7b62] clash-display-font">
                      {project.category}
                    </span>
                    <span className="text-sm text-[#8c7b62] clash-display-font">{project.year}</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-[#060010] group-hover:text-[#8c7b62] transition-colors duration-300">
                    {project.title}
                  </h2>

                  <p className="text-base md:text-lg text-[#312619]/80 archivo-font leading-relaxed">
                    {project.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    {project.results.map((result) => (
                      <div key={result.label} className="text-center">
                        <p className="text-2xl font-bold text-[#060010]">{result.value}</p>
                        <p className="text-xs uppercase tracking-wider text-[#8c7b62] mt-1 clash-display-font">
                          {result.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-[#060010] text-[#E9E4D7] rounded-[40px] p-12 md:p-16 shadow-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Start Your Project?</h2>
            <p className="text-lg md:text-xl mb-8 text-[#E9E4D7]/80 archivo-font">
              Let's create something extraordinary together. Get in touch and tell us about your vision.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90 clash-display-font"
            >
              Start a Project <span aria-hidden>→</span>
            </a>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
