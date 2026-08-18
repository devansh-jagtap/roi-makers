'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SiteFooter from '@/components/layout/SiteFooter';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    budget: '',
    message: '',
    website: '',
  });

  useEffect(() => {
    const email = new URLSearchParams(window.location.search).get('email');
    if (email) setFormData((current) => ({ ...current, email }));
  }, []);

  const services = [
    'Performance Marketing',
    'Creative Production',
    'Media Strategy',
    'CRO & Landing Pages',
    'Data & Analytics',
    'Full-Funnel Growth',
  ];

  const budgetRanges = [
    'Under $10K/month',
    '$10K - $25K/month',
    '$25K - $50K/month',
    '$50K - $100K/month',
    '$100K+/month',
  ];

  const contactInfo = [
    {
      label: 'Email',
      value: 'info@rmakers.in',
      href: 'mailto:info@roimakers.in',
    },
    {
      label: 'Phone',
      value: '+91 98765 43210',
      href: 'tel:+919876543210',
    },
    {
      label: 'Office',
      value: '218-B Trade Center, South Tukoganj, Indore, MP 452001',
      href: 'https://www.google.com/maps/search/?api=1&query=Trade+Center+South+Tukoganj+Indore',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const params = new URLSearchParams(window.location.search);
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: params.get('source') || 'website', utmSource: params.get('utm_source'), utmMedium: params.get('utm_medium'), utmCampaign: params.get('utm_campaign'), utmTerm: params.get('utm_term'), utmContent: params.get('utm_content'), landingPage: window.location.href, referrer: document.referrer }),
      });
      
      if (response.ok) {
        alert('Thank you! Your message has been sent. We\'ll get back to you within 24 hours.');
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          service: '',
          budget: '',
          message: '',
          website: '',
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting the form. Please try emailing us directly at info@roimakers.in ');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="contact-page min-h-screen boska-font" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-lg font-semibold uppercase tracking-[0.5em] text-[#8c7b62] mb-6 clash-display-font">
              Contact Us
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#060010] mb-6">
              Connect With Us
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-[#312619]/80 max-w-3xl mx-auto archivo-font leading-relaxed mb-4">
              Let's Grow Your Brand Together
            </p>
            <p className="text-base sm:text-lg text-[#312619]/70 max-w-2xl mx-auto archivo-font leading-relaxed">
              Have a project in mind or just exploring ideas? Tell us what you're building—we'll help you take the next step.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {contactInfo.map((info, idx) => (
              <motion.a
                key={info.label}
                href={info.href}
                target={info.label === 'Office' ? '_blank' : undefined}
                rel={info.label === 'Office' ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="contact-info-card group rounded-[28px] border border-[#060010]/10 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(6,0,16,0.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_30px_90px_-40px_rgba(6,0,16,0.4)] md:p-8"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-[#8c7b62] clash-display-font mb-3">
                  {info.label}
                </p>
                <p className="text-sm md:text-base lg:text-lg text-[#060010] archivo-font font-medium group-hover:text-[#8c7b62] transition-colors duration-300 break-words">
                  {info.value}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
            {/* Left Column - Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#060010] mb-4">
                  Work With ROI Makers
                </h2>
                <p className="text-base md:text-lg text-[#312619]/80 archivo-font leading-relaxed">
                  Share a few details with us and our team will reach out shortly. We'll understand your needs, your goals, and see how we can help you grow.
                </p>
              </div>
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#060010] mb-3 flex items-center gap-2">
                   What Happens Next
                  </h3>
                  <ul className="space-y-2 text-sm archivo-font text-[#312619]/80">
                    <li className="flex items-start gap-2">
                      <span className="text-[#8c7b62] mt-1">→</span>
                      <span>Quick intro call to understand your business</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8c7b62] mt-1">→</span>
                      <span>Clear suggestions tailored to your goals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8c7b62] mt-1">→</span>
                      <span>Honest timelines, budgets, and next steps</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#060010] mb-3 flex items-center gap-2">
                    Who Usually Reaches Out
                  </h3>
                  <ul className="space-y-2 text-sm archivo-font text-[#312619]/80">
                    <li className="flex items-start gap-2">
                      <span className="text-[#8c7b62] mt-1">→</span>
                      <span>Growing brands looking for better leads</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8c7b62] mt-1">→</span>
                      <span>Businesses scaling online sales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8c7b62] mt-1">→</span>
                      <span>Founders who want measurable marketing results</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-[#060010] text-[#E9E4D7] rounded-[28px] p-6">
                <p className="text-sm archivo-font">
                  <strong className="clash-display-font">Not sure where to start?</strong> Drop us a message anyway at{' '}
                  <a href="mailto:info@rmakers.in" className="text-[#ff9933] hover:underline font-semibold">
                    info@roimakers.in
                  </a>{' '}
                  we'll guide you in the right direction.
                </p>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.form
              id="contact-form"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="bg-white/70 rounded-[32px] p-8 md:p-10 border border-[#060010]/10 shadow-[0_25px_80px_-50px_rgba(6,0,16,0.3)] space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs uppercase tracking-wider font-semibold text-[#060010] mb-2 clash-display-font"
                  >
                    Name *
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
                  <label
                    htmlFor="email"
                    className="block text-xs uppercase tracking-wider font-semibold text-[#060010] mb-2 clash-display-font"
                  >
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
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="company"
                    className="block text-xs uppercase tracking-wider font-semibold text-[#060010] mb-2 clash-display-font"
                  >
                    Company *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-[#060010]/20 bg-white/50 text-[#060010] archivo-font focus:outline-none focus:ring-2 focus:ring-[#8c7b62] transition-all"
                    placeholder="Your Company"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs uppercase tracking-wider font-semibold text-[#060010] mb-2 clash-display-font"
                  >
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
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="block text-xs uppercase tracking-wider font-semibold text-[#060010] mb-2 clash-display-font"
                >
                  Service Interest *
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-[#060010]/20 bg-white/50 text-[#060010] archivo-font focus:outline-none focus:ring-2 focus:ring-[#8c7b62] transition-all"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="budget"
                  className="block text-xs uppercase tracking-wider font-semibold text-[#060010] mb-2 clash-display-font"
                >
                  Monthly Budget *
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-[#060010]/20 bg-white/50 text-[#060010] archivo-font focus:outline-none focus:ring-2 focus:ring-[#8c7b62] transition-all"
                >
                  <option value="">Select a range</option>
                  {budgetRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs uppercase tracking-wider font-semibold text-[#060010] mb-2 clash-display-font"
                >
                  Tell Us About Your Goals *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-2xl border border-[#060010]/20 bg-white/50 text-[#060010] archivo-font focus:outline-none focus:ring-2 focus:ring-[#8c7b62] transition-all resize-none"
                  placeholder="What growth challenges are you facing? What are your top priorities for the next quarter?"
                />
              </div>

              <button
                type="submit"
                className="w-full px-10 py-4 bg-[#060010] text-[#E9E4D7] rounded-full font-semibold text-sm uppercase tracking-wider clash-display-font hover:bg-[#8c7b62] transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Send Message
              </button>

              <p className="text-xs text-[#312619]/60 text-center archivo-font">
                By submitting this form, you agree to our privacy policy and terms of service.
              </p>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Map/Location Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-[#060010] mb-3">Visit Our Office</h3>
              <p className="text-base md:text-lg text-[#312619]/80 archivo-font mb-2">
                218-B Trade Center, South Tukoganj
              </p>
              <p className="text-base md:text-lg text-[#312619]/80 archivo-font mb-4">
                Indore, Madhya Pradesh 452001
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Trade+Center+South+Tukoganj+Indore+MP+452001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#8c7b62] font-semibold hover:underline clash-display-font text-sm uppercase tracking-wider"
              >
                Get Directions <span>→</span>
              </a>
            </div>
            <div className="bg-white/70 rounded-[32px] md:rounded-[40px] overflow-hidden border border-[#060010]/10 shadow-[0_25px_80px_-50px_rgba(6,0,16,0.3)]">
              <div className="aspect-[16/9] md:aspect-[21/9] relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.3076!2d75.8577!3d22.7196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd5b0!2sTrade%20Center%2C%20South%20Tukoganj%2C%20Indore%2C%20Madhya%20Pradesh%20452001!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                  title="ROI Makers Office Location"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
