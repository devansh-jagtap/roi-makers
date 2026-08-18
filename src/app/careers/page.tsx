'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import SiteFooter from '@/components/layout/SiteFooter';

export default function CareersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    resume: null as File | null,
    message: ''
  });

  const benefits = [
    {
      title: "Flexible Work",
      description: "Remote-first with co-working stipends and quarterly offsites",
    
    },
    {
      title: "Learning Budget",
      description: "₹50K/year for courses, conferences, and certifications",
   
    },
    {
      title: "Health Coverage",
      description: "Comprehensive insurance for you and your family",
      
    },
    {
      title: "Performance Bonus",
      description: "Quarterly bonuses tied to campaign outcomes and team OKRs",
     
    },
    {
      title: "Creative Time",
      description: "20% time for side projects and skill exploration",
      
    },
    {
      title: "Growth Path",
      description: "Clear progression frameworks with regular reviews",
   
    }
  ];

  const positions = [
    "Digital Marketing",
    "Performance Marketing",
    "SEO Expert",
    "Social Media",
    "Content Writing",
    "Human Resources",
    "Others"
  ];

  const perks = [
    "Annual company retreat to exotic locations",
    "Home office setup allowance",
    "Mental health and wellness support",
    "Unlimited books and Audible subscription",
    "Team lunches and celebration budgets",
    "Equity participation for senior roles"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      if (formData.phone) data.append('phone', formData.phone);
      data.append('position', formData.position);
      data.append('message', formData.message);
      if (formData.resume) {
        data.append('resume', formData.resume);
      }
      
      const response = await fetch('/api/careers', {
        method: 'POST',
        body: data,
      });
      
      if (response.ok) {
        alert('Thank you for applying! We\'ll review your application within 5 business days.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          position: '',
          resume: null,
          message: '',
        });
        // Reset file input
        const fileInput = document.getElementById('resume') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting the form. Please try emailing us directly at info@roimakers.in');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resume: e.target.files[0] });
    }
  };

  return (
    <div className="careers-page min-h-screen boska-font" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-lg font-semibold uppercase tracking-[0.5em] text-[#8c7b62] mb-6 clash-display-font">Career</p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#060010] mb-6">
              JOIN OUR TEAM
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-[#312619]/80 max-w-3xl mx-auto archivo-font leading-relaxed mb-4">
              Build The Future With Us
            </p>
            <p className="text-base sm:text-lg text-[#312619]/70 max-w-2xl mx-auto archivo-font leading-relaxed">
              We're assembling a world-class team of growth obsessives, creative engineers, and data storytellers. If you thrive in ambiguity and measure success in outcomes, let's talk.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs uppercase tracking-[0.5em] text-[#8c7b62] clash-display-font">Why ROI Makers</p>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[#060010]">Benefits & Perks</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/70 rounded-[28px] p-8 border border-[#060010]/10 shadow-[0_20px_60px_-40px_rgba(6,0,16,0.25)] hover:shadow-[0_30px_90px_-40px_rgba(6,0,16,0.4)] transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-[#060010] mb-2">{benefit.title}</h3>
                <p className="text-sm text-[#312619]/80 archivo-font leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Additional Perks */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 bg-[#060010] text-[#E9E4D7] rounded-[32px] p-8 md:p-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Plus More...</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {perks.map((perk, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#ff9933] rounded-full" />
                  <p className="text-sm archivo-font">{perk}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


      {/* Application Form */}
      <section id="apply" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs uppercase tracking-[0.5em] text-[#8c7b62] clash-display-font">Get Started</p>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[#060010]">Apply Now</h2>
            <p className="mt-4 text-base text-[#312619]/80 archivo-font max-w-2xl mx-auto">
              Fill out the form below or email your resume and portfolio to{' '}
              <a href="mailto:info@roimakers.in" className="text-[#8c7b62] font-semibold hover:underline">
                info@roimakers.in
              </a>
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-white/70 rounded-[32px] p-8 md:p-12 border border-[#060010]/10 shadow-[0_25px_80px_-50px_rgba(6,0,16,0.3)]"
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-[#060010] mb-2 clash-display-font uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-[#060010]/20 bg-white/50 text-[#060010] archivo-font focus:outline-none focus:ring-2 focus:ring-[#8c7b62] transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#060010] mb-2 clash-display-font uppercase tracking-wider">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-[#060010]/20 bg-white/50 text-[#060010] archivo-font focus:outline-none focus:ring-2 focus:ring-[#8c7b62] transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-[#060010] mb-2 clash-display-font uppercase tracking-wider">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-[#060010]/20 bg-white/50 text-[#060010] archivo-font focus:outline-none focus:ring-2 focus:ring-[#8c7b62] transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label htmlFor="position" className="block text-sm font-semibold text-[#060010] mb-2 clash-display-font uppercase tracking-wider">
                  Position *
                </label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-[#060010]/20 bg-white/50 text-[#060010] archivo-font focus:outline-none focus:ring-2 focus:ring-[#8c7b62] transition-all"
                >
                  <option value="">Select A Position</option>
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="resume" className="block text-sm font-semibold text-[#060010] mb-2 clash-display-font uppercase tracking-wider">
                Upload Your CV/Resume here
              </label>
              <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="w-full px-4 py-3 rounded-2xl border border-[#060010]/20 bg-white/50 text-[#060010] archivo-font focus:outline-none focus:ring-2 focus:ring-[#8c7b62] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#060010] file:text-[#E9E4D7] hover:file:bg-[#8c7b62] cursor-pointer"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-semibold text-[#060010] mb-2 clash-display-font uppercase tracking-wider">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-2xl border border-[#060010]/20 bg-white/50 text-[#060010] archivo-font focus:outline-none focus:ring-2 focus:ring-[#8c7b62] transition-all resize-none"
                placeholder="Tell us about yourself, your experience, and why you'd be a great fit..."
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-10 py-4 bg-[#060010] text-[#E9E4D7] rounded-full font-semibold text-sm uppercase tracking-wider clash-display-font hover:bg-[#8c7b62] transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Submit Now
            </button>
          </motion.form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
