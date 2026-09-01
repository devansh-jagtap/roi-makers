'use client';

import { motion } from 'framer-motion';
import { CountUp } from '../../ui/count-up';
import LogoMarquee from '@/components/ui/media/LogoMarquee';
import { headlineStats, testimonials } from '@/data/site';

/* One list, two marquee directions — the array used to be pasted twice. */
const clientLogos = [2, 3, 6, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 21, 22, 25, 26, 28, 31, 32].map(
  (n) => ({ src: `/clients/${n}.webp`, alt: `Client ${n}` })
);

const marqueeProps = {
  logos: clientLogos,
  speed: 150,
  logoHeight: 100,
  gap: 50,
  pauseOnHover: true,
  fadeOut: true,
  scaleOnHover: true,
  className: 'w-full',
} as const;

export default function ClientsStats() {
  return (
    <section className="relative bg-background py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-10 px-4 text-center md:mb-14"
        >
          <p className="eyebrow">Stats</p>
          <h2 className="display-2 mt-4 text-balance">
            Experts in the <span className="display-accent">business.</span>
          </h2>
          <p className="lede archivo-font mx-auto mt-5 max-w-3xl text-pretty">
            No vanity metrics. Every number here represents a business that grew because of decisions we made
            together.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 grid max-w-6xl grid-cols-2 gap-4 px-2 md:grid-cols-4 sm:gap-6"
        >
          {headlineStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass glass-card p-5 text-center sm:p-7"
            >
              <p className="stat-value text-[var(--brand)]">
                <CountUp value={stat.value} decimals={stat.decimals ?? 0} suffix={stat.suffix} duration={2} />
              </p>
              <p className="clash-display-font mt-3 text-[0.62rem] uppercase tracking-[0.2em] text-soft">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-4xl px-4 text-center"
        >
          <p className="eyebrow">Trusted by</p>
          <h3 className="display-3 mt-3">Brands that chose results.</h3>
        </motion.div>

        <LogoMarquee {...marqueeProps} direction="left" />
        <div className="h-6" />
        <LogoMarquee {...marqueeProps} direction="right" />

        {/* Client wins — the words brands actually used. */}
        <div className="mx-auto mt-20 max-w-6xl px-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <p className="eyebrow">Client wins</p>
            <h3 className="display-2 mt-4">Straight from the brands.</h3>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((item, index) => (
              <motion.figure
                key={item.name}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass glass-card flex h-full flex-col p-7"
              >
                <span aria-hidden className="display-2 leading-none text-[var(--brand)] opacity-40">
                  &ldquo;
                </span>
                <blockquote className="body-copy archivo-font -mt-4 flex-1 text-[0.95rem]">{item.quote}</blockquote>
                <figcaption className="mt-6">
                  <p className="display-4">{item.name}</p>
                  <p className="clash-display-font mt-1 text-[0.62rem] uppercase tracking-[0.2em] text-soft">
                    {item.context}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
