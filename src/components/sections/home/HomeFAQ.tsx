import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqData = [
    {
      question: "What makes ROI Makers different from other agencies?",
      answer:
        "We're performance-obsessed, not portfolio-obsessed. While most agencies optimize for case study aesthetics, we optimize for your profit margins. You get full transparency into what's working, what's dying, and what we're testing next. No black boxes, no vanity metrics, no hiding behind \"brand awareness\" when conversions tank. Plus, we operate on results-first pricing models, if we don't deliver ROI, we don't deserve retention.",
    },
    {
      question: "What's your typical project timeline and onboarding process?",
      answer: "Week 1:\nDeep-dive audit of your current marketing (tracking infrastructure, campaign performance, competitive landscape).\n\nWeek 2:\nStrategy presentation with prioritized recommendations and projected ROI.\n\nWeek 3:\nCampaign launch with real-time dashboard access.\n\nMost clients see actionable data within 30 days and measurable ROI improvements within 90 days. We move fast because velocity creates competitive advantages that budget can't buy.",
    },
    {
      question: "Do you work with businesses in my industry?",
      answer: "We're industry-agnostic by design. Whether you're selling SaaS, real estate, healthcare services, or artisanal dog treats, buyer psychology is universal, execution is what's custom. We've scaled 50+ different verticals because we focus on what drives human behavior, not what's trendy in your industry's echo chamber. If you have customers and a growth goal, we can engineer a path there.",
    },
    {
      question: "What's your pricing structure?",
      answer:
        "We offer three engagement models: Project-based (fixed scope, fixed price), Retainer (ongoing optimization with monthly sprint goals), and Performance-based (we eat our own cooking, compensation tied to your results). Pricing varies based on channels, scale, and complexity. Bottom line: we're not the cheapest, but we're the most profitable investment you'll make in marketing. Book a call and we'll build a custom proposal.",
    },
    {
      question: "How do you measure and report ROI?",
      answer:
        "We implement proper attribution tracking from day one, Google Analytics 4, Tag Manager, conversion pixels, CRM integration, the works. You get access to live dashboards showing traffic sources, conversion paths, cost per acquisition, customer lifetime value, and actual revenue attributed to our campaigns. Monthly strategy calls break down what's working, what we're killing, and what we're scaling. No fluff reports that look impressive but say nothing.",
    },
    {
      question: "What if we've been burned by agencies before?",
      answer:
        "You're not alone, 90% of our clients came to us after wasting budgets on agencies that over-promised and under-delivered. That's exactly why we built ROI Makers differently: transparent operations, ruthless testing, and compensation models that align our success with yours. We're happy to start with a pilot project so you can see how we operate before committing long-term. Results speak louder than proposals.",
    },
    {
      question: "Can you guarantee specific results?",
      answer:
        "Anyone guaranteeing specific numbers before understanding your business, market, and current performance is either lying or incompetent. What we can guarantee: full transparency into what we're doing and why, ruthless optimization based on data, and immediate course-correction when something isn't working. We've delivered 200%+ ROI for clients across industries, but we'd rather under-promise and over-deliver than the reverse.",
    },
    {
      question: "Do I need to have a big budget to work with you?",
      answer:
        "Not necessarily, but we're honest about minimum thresholds. For paid advertising, we recommend at least ₹50,000/month in ad spend to generate statistically significant data. For SEO and content, projects typically start at ₹75,000/month. If you're at an earlier stage, we can discuss project-based work or consulting to build your foundation. We'd rather tell you \"not yet\" than take your money before you're ready to scale.",
    },
  ];

  return (
  <div className="text-foreground py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-6 lg:px-8 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto mt-14">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl px-4 sm:text-3xl md:text-4xl lg:text-5xl font-black text-balance mb-4 sm:mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Everything you need to know about partnering with ROI Makers. Can't find what you're looking for? Hit us up, we actually respond.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-2 sm:px-4">
          <Accordion
            type="single"
            collapsible
            className="space-y-3 sm:space-y-4"
          >
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="text-foreground rounded-lg sm:rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300"
              >
                <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-left font-semibold text-sm sm:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="text-muted-foreground leading-relaxed font-medium text-sm sm:text-base">
                    {typeof faq.answer === "string" ? faq.answer : faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12 sm:mt-16 px-2 sm:px-4">
          <div className="text-foreground rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto border border-border bg-card sm:mx-auto">
            <h3 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-4 sm:mb-6 font-medium text-sm sm:text-base">
              We're here to help! Reach out to our team and we'll get back to
              you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=info@imakers.in"
                target="blank"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-[#141414] text-[#fcf2e8] rounded-lg font-medium hover:bg-[#141414]/90 transition-colors text-sm sm:text-base"
              >
                Email Us
              </a>
              <a
                href="https://www.instagram.com/roimakers/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-border text-foreground rounded-lg font-medium hover:bg-foreground hover:text-background transition-colors text-sm sm:text-base"
              >
                Follow on Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;