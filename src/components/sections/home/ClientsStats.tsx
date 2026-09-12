'use client';

import { motion } from 'framer-motion';
import { CountUp } from '../../ui/count-up';
import LogoMarquee from '@/components/ui/media/LogoMarquee';
import { headlineStats, testimonials } from '@/data/site';

/* Every logo in /public/clients. The order mixes sectors so no two
   construction or healthcare marks sit together in a row. */
const logo = (file: string, alt: string) => ({ src: `/clients/${file}.webp`, alt });

const clientLogos = [
  logo("2", "Life Care Logistic"),
  logo("cult-fit", "cult.fit"),
  logo("9", "Star Build Construction & Solution"),
  logo("26", "HealthVeda Organics"),
  logo("omaxe", "Omaxe"),
  logo("3", "Bandhan Event"),
  logo("golds-gym", "Gold's Gym"),
  logo("18", "Reddito Capital"),
  logo("evokhomes", "Evokhomes"),
  logo("12", "Agri Bhawishya"),
  logo("m3-aligners", "M3 Aligners"),
  logo("32", "SSC Group"),
  logo("kv11-events", "KV-11 Events"),
  logo("15", "H&H Healthcare and Cosmetics"),
  logo("roger-realty", "Roger Realty"),
  logo("8", "Global Focus Today"),
  logo("magic-amrit", "Magic Amrit"),
  logo("22", "ADGS & Associates"),
  logo("vistara", "Vistara Mangalam Lifestyle"),
  logo("10", "Shibh"),
  logo("dreams-india", "Dreams India Entertainment"),
  logo("28", "DAMAC"),
  logo("fdm", "FDM"),
  logo("6", "Advanced Academy"),
  logo("malwa-county", "Malwa County"),
  logo("17", "Fun O'Farm"),
  logo("vedaantam", "Vedaantam"),
  logo("mmo", "MMO Construction & Solution"),
  logo("11", "Trisha's Enterprise"),
  logo("redsmoke-tattoo", "Redsmoke Tattoo"),
  logo("14", "Maa Ginni Vihar"),
  logo("adhyaveda", "Adhyaveda Organic"),
  logo("25", "Business Bazaar"),
  logo("nexel-architects", "Nexel Architects"),
  logo("31", "Yuva Udaan"),
  logo("dbr", "DBR — Dipali Biswas Realcon"),
  logo("13", "Siddharth Garments"),
  logo("m20-resort", "M20 Garden & Resort"),
  logo("21", "Life Care Group"),
  logo("hi-link", "Hi-Link Group"),
  logo("bharat-agritech", "Bharat AgriTech"),
  logo("star-build-realty", "Star Build Realty"),
  logo("gau-mahakumbh", "Gau Mahakumbh Jaipur"),
  logo("creative-column", "Creative Column Designs"),
  logo("ads-infra", "ADS Infra by Yadav Group"),
];

/* Three rows of fifteen, so no row repeats another. */
const rowSize = Math.ceil(clientLogos.length / 3);
const logoRows = [0, 1, 2].map((row) => clientLogos.slice(row * rowSize, (row + 1) * rowSize));

const marqueeProps = {
  speed: 200,
  logoHeight: 80,
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

        <LogoMarquee {...marqueeProps} logos={logoRows[0]} direction="left" />
        <div className="h-6" />
        <LogoMarquee {...marqueeProps} logos={logoRows[1]} direction="right" />
        <div className="h-6" />
        <LogoMarquee {...marqueeProps} logos={logoRows[2]} direction="left" />

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
            <h3 className="display-2 mt-4">Straight from the brand Owners.</h3>
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
