import React from "react";
import SiteFooter from "@/components/global/SiteFooter";
import SiteHeader from "@/components/global/SiteHeader";
import { AnimatedLinePath } from "@/components/ui/animated-line-path";

export default function TermsConditions() {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="absolute inset-0 pointer-events-none">
        <AnimatedLinePath />
      </div>
      <SiteHeader />
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-24 md:py-32">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#060010] mb-6 boska-font">
              Terms & Conditions
            </h1>
            <p className="text-2xl md:text-3xl text-[#8c7b62] archivo-font">
              The (Not-So) Boring Legal Bits
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8 archivo-font">
            <p className="text-[#312619]">
              Let's keep it simple – by using our site, you're agreeing to a few basic rules
              that help keep everything above board and running smoothly. If you're browsing,
              scrolling, reading, watching or clicking on anything at ROI Makers, these terms apply.
            </p>

            <p className="text-[#312619]/70">
              If you're not into legal stuff, we totally get it – maybe check out our work or careers page instead.
            </p>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-[#060010] boska-font">Who We Are</h2>
              <p className="text-[#312619]">
                This website is run by ROI Makers. When we say "we", "us" or "our", that's
                who we mean. If you have any questions, hit us up at{" "}
                <a href="mailto:hello@makers.com" className="text-[#FF9933] hover:underline">
                  info@imakers.com
                </a>
                .
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-[#060010] boska-font">Using Our Website</h2>
              <p className="text-[#312619]">By accessing our site, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-[#312619]">
                <li>Use it only for lawful purposes</li>
                <li>Respect our copyright and intellectual property</li>
                <li>Not try to hack, copy, or mess with our code or content</li>
              </ul>
              <p className="text-[#312619]">
                Basically, be cool. Don't do anything dodgy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-[#060010] boska-font">Our Content</h2>
              <p className="text-[#312619]">
                All the content on this site – including words, videos, graphics, case studies,
                ideas and more – belongs to ROI Makers (unless we've said otherwise). Please
                don't steal it, screenshot it for your pitch deck, or pass it off as your own.
              </p>
              <p className="text-[#312619]">
                Want to share something? Great. Just credit us and link back.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-[#060010] boska-font">No Promises, No Guarantees</h2>
              <p className="text-[#312619]">
                We do our best to keep everything up to date and accurate – but we can't promise
                the site will always be 100% error-free or uninterrupted. If something breaks,
                disappears or goes out of date, we're not liable.
              </p>
              <p className="text-[#312619]">
                The website is provided "as is". That's the legal way of saying we're not making
                any guarantees about its performance, and you use it at your own risk.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-[#060010] boska-font">Third Party Links</h2>
              <p className="text-[#312619]">
                We sometimes link out to other websites – maybe in a blog post or case study.
                Just so you know, we're not responsible for the content or data policies on those
                sites. Once you're off our domain, you're in their world.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-[#060010] boska-font">Liability Stuff</h2>
              <p className="text-[#312619]">We're not liable for:</p>
              <ul className="list-disc pl-6 space-y-2 text-[#312619]">
                <li>Any damage to your device while using the site</li>
                <li>Any loss of data, revenue, or business caused by using (or not being able to use) our site</li>
                <li>Typos, bugs, or out-of-date info</li>
              </ul>
              <p className="text-[#312619]">
                We'll always aim to fix issues quickly – but legally, we're covered.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-[#060010] boska-font">Changes To These Terms</h2>
              <p className="text-[#312619]">
                We might update these terms from time to time – especially if laws change, or we
                launch something new. We won't spam you about it, but you can always check this
                page to stay in the loop.
              </p>
              <p className="text-[#312619]">
                By continuing to use the site, you're agreeing to any changes we've made.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-[#060010] boska-font">Need To Get In Touch?</h2>
              <p className="text-[#312619]">
                Got a question about these terms? Or want to ask about using our content?
              </p>
              <p className="text-[#312619]">
                Drop us a message at{" "}
                <a href="mailto:hello@roimakers.com" className="text-[#FF9933] hover:underline">
                  info@roimakers.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
