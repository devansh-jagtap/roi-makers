import React from "react";
import SiteFooter from "@/components/global/SiteFooter";
import SiteHeader from "@/components/global/SiteHeader";
import { AnimatedLinePath } from "@/components/ui/animated-line-path";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="absolute inset-0 pointer-events-none">
        <AnimatedLinePath />
      </div>
      <SiteHeader />
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-24 md:py-32">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-[#060010] mb-6 boska-font">
              Privacy Policy
            </h1>
            <p className="text-3xl md:text-4xl text-[#8c7b62] archivo-font">
              How we handle your data
            </p>
          </div>

          <div className="prose prose-xl max-w-none space-y-8 archivo-font">
            <p className="text-[#312619] text-xl">
              We care about your privacy and only collect data necessary to provide a smooth
              user experience across roimakers.com.
            </p>

            <section className="space-y-4">
              <h2 className="text-4xl font-bold text-[#060010] boska-font">
                What personal data we collect and why we collect it
              </h2>
              <p className="text-[#312619] text-xl">
                We keep things simple. No user accounts, no complex tracking, no selling of data
                – just the essentials to keep our site running.
              </p>
              
              <div className="space-y-4 mt-6">
                <div>
                  <h3 className="text-2xl font-semibold text-[#060010] mb-2">Contact Forms</h3>
                  <p className="text-[#312619] text-lg">
                    If you contact us, we collect your name, email, and message to respond.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-[#060010] mb-2">Cookies</h3>
                  <p className="text-[#312619] text-lg">
                    We use essential cookies and anonymous analytics to improve your
                    experience and understand site usage.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-[#060010] mb-2">Analytics</h3>
                  <p className="text-[#312619] text-lg">
                    We track site traffic through tools like Google Analytics
                    (anonymised). No personal information is collected.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-4xl font-bold text-[#060010] boska-font">
                Where we store the data we collect
              </h2>
              <p className="text-[#312619] text-xl">
                All data is securely stored on servers located in the Indore , India.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-4xl font-bold text-[#060010] boska-font">
                Why we store the data we collect
              </h2>
              <p className="text-[#312619] text-xl">
                We care about your privacy and only collect data necessary to provide a smooth
                user experience across roimakers.com.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[#312619] text-lg">
                <li>To respond to your inquiries and support requests</li>
                <li>To improve our website and user experience</li>
                <li>To understand how our site is being used</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-4xl font-bold text-[#060010] boska-font">
                Your rights
              </h2>
              <p className="text-[#312619] text-xl">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[#312619] text-lg">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-4xl font-bold text-[#060010] boska-font">
                Changes to this policy
              </h2>
              <p className="text-[#312619] text-xl">
                We may update this privacy policy from time to time. Any changes will be posted
                on this page with an updated revision date.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-4xl font-bold text-[#060010] boska-font">Contact Us</h2>
              <p className="text-[#312619] text-xl">
                If you have any questions about this privacy policy or how we handle your data,
                please contact us at{" "}
                <a href="mailto:hello@roimakers.com" className="text-[#FF9933] hover:underline text-xl">
                  info@imakers.com
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
