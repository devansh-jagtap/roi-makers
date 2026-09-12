'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import LogoMarquee from '@/components/ui/media/LogoMarquee';
import { partners } from '@/data/site';

/* Short version of the about page's partner grid: one heading, one moving
   strip. Each logo sits on a white tile because the source files carry a
   flat white background. */
const partnerLogos = partners.map((partner) => ({
  node: (
    <span className="flex h-[var(--logoloop-logoHeight)] w-[220px] items-center justify-center rounded-2xl bg-white px-7 py-4 shadow-[0_1px_0_rgba(0,0,0,0.04),0_10px_30px_-18px_rgba(0,0,0,0.25)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={partner.logo}
        alt={partner.alt}
        className="max-h-full w-auto max-w-full object-contain"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </span>
  ),
  title: partner.name,
  ariaLabel: partner.name,
}));

export default function HomePartners() {
  return (
    <section className="relative bg-background py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto mb-10 max-w-4xl px-4 text-center md:mb-14"
        >
          <p className="eyebrow">Our partners</p>
          <h2 className="display-2 mt-4 text-balance">
            Backed by the <span className="display-accent">platforms.</span>
          </h2>
          <p className="lede archivo-font mx-auto mt-5 max-w-3xl text-pretty">
            The ad platforms, media houses, and technology teams we build every campaign with.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          viewport={{ once: true }}
        >
          <LogoMarquee
            logos={partnerLogos}
            speed={90}
            direction="right"
            logoHeight={110}
            gap={28}
            pauseOnHover
            fadeOut
            scaleOnHover={false}
            ariaLabel="ROI Makers partners"
            className="w-full"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link
            href="/about"
            className="clash-display-font inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-soft transition-colors hover:text-[var(--brand)]"
          >
            Meet all our partners
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
