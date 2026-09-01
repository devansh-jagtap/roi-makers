import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { company, faqs } from "@/data/site";

const FAQSection = () => (
  <div className="bg-background px-3 py-12 text-foreground sm:px-4 sm:py-16 md:px-6 md:py-20 lg:px-8 lg:py-24">
    <div className="mx-auto mt-14 max-w-5xl">
      <div className="mb-10 text-center sm:mb-14">
        <p className="eyebrow">Questions</p>
        <h2 className="display-2 mt-4 text-balance">Frequently asked questions</h2>
        <p className="lede archivo-font mx-auto mt-5 max-w-3xl px-4 text-pretty">
          Everything you need to know about partnering with ROI Makers. Can&rsquo;t find what you&rsquo;re looking
          for? Hit us up — we actually respond.
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-3 px-2 sm:px-4 sm:space-y-4">
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.question}
            value={faq.question}
            className="glass glass-card !border-b px-1 text-foreground"
          >
            <AccordionTrigger className="display-4 px-4 py-4 text-left sm:px-6 sm:py-5">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-5 sm:px-6 sm:pb-6">
              <p className="body-copy archivo-font text-sm sm:text-base">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-14 px-2 text-center sm:px-4">
        <div className="glass mx-auto max-w-2xl p-7 sm:p-9">
          <h3 className="display-3">Still have questions?</h3>
          <p className="body-copy archivo-font mx-auto mt-3 max-w-md">
            Reach out to the team and we&rsquo;ll get back to you with something useful, not a brochure.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={`mailto:${company.emails.general}`} className="btn-brand">
              <span>Email us</span>
              <span aria-hidden>→</span>
            </a>
            <a
              href={company.socials[0].href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass"
            >
              <span>Follow on Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FAQSection;
