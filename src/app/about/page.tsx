'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SiteFooter from '@/components/layout/SiteFooter';
import { CountUp } from '@/components/ui/count-up';

const stats = [
	{ label: 'Campaigns Executed', value: 1200 },
	{ label: 'Active Clients', value: 250 },
	{ label: 'Leads Generated', value: 626000 },
	{ label: 'Businesses Scaled', value: 500 },
];

const milestones = [
	{
		year: '2019',
		title: 'Born from necessity',
		desc: 'Started in a cramped Indore office with one mission: prove that creative agencies could actually drive P&L, not just win awards.',
	},
	{
		year: '2021',
		title: 'The lab expands',
		desc: 'Built our creative-tech hybrid model. Brought motion designers, developers, and media buyers under one roof to kill the handoff delays.',
	},
	{
		year: '2023',
		title: 'Cross-border domination',
		desc: 'Scaled beyond Indian borders. Now running synchronized campaigns across time zones with local creators who understand cultural nuance.',
	},
	{
		year: 'Now',
		title: 'Growth infrastructure partners',
		desc: "We're the internal growth team that scales with you. Embedded deep in consumer tech, D2C, B2B SaaS, and emerging crypto brands hitting hockey-stick growth.",
	},
];

const leaders = [
	{
		name: 'Amit Sharma',
		title: 'FOUNDER & CEO',
		image: '/team/1.webp',
		bio: `I've spent years in the digital trenches, working with everyone from bootstrapped startups to blockchain unicorns. My obsession? Building marketing machines that generate predictable revenue. At ROI Makers, we've cracked the code on blending scroll-stopping creative with performance engineering. I believe great marketing isn't about vanity metrics or pretty decks. It's about understanding human psychology, mapping customer journeys, and architecting systems that convert cold traffic into raving fans. If you're done with agencies that promise the moon and deliver PowerPoints, let's build something that actually moves your revenue needle.`,
	},
	{
		name: 'Vishal Yogi',
		title: 'CO-FOUNDER',
		image: '/team/2.webp',
		bio: "I'm the operator who makes our creative chaos actually work. While everyone else is chasing shiny objects, I'm building the infrastructure that lets us scale fast without breaking things. My background in systems thinking and tech implementation means I see gaps before they become problems. I translate between creative dreamers and technical builders, making sure our wild ideas actually ship on time and on budget. My philosophy is simple: brilliant strategy executed poorly is just expensive education. I make sure we execute brilliantly, every single time, so your growth compounds instead of stalling.",
	},
];

const stackShots = ['/images/stack/1.webp', '/images/stack/4.webp'];

const values = [
	{
		title: 'Radical Experimentation',
		description: "We don't just test ideas. We break them, rebuild them, and 10x them until they scale.",
	},
	{
		title: 'Aesthetic Precision',
		description: 'Stunning creative delivery yesterday. We marry beauty with brutal efficiency.',
	},
	{
		title: 'No-Filter Collaboration',
		description: 'Real talk, real numbers, real accountability. We succeed or fail together, period.',
	},
	{
		title: 'Infinite Optimization',
		description: "Last month's winning formula is this month's baseline. We never stop pushing metrics higher.",
	},
];

export default function About() {
	return (
		<main className="min-h-screen w-full boska-font" style={{ backgroundColor: '#FFFFFF' }}>
			{/* Hero Section */}
			<section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-center mb-16"
				>
					<p className="uppercase tracking-[0.5em] text-lg font-semibold text-[#8c7b62] clash-display-font">ABOUT ROI MAKERS</p>
					<h1 className="mt-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#060010]">
						We Engineer Revenue<br />Acceleration
					</h1>
					<p className="mt-8 text-lg sm:text-xl md:text-2xl text-[#312619]/80 max-w-3xl mx-auto archivo-font leading-relaxed">
						A collective of mad scientists, pixel perfectionists, data nerds, and brand architects who build marketing systems that don't just look good but print money.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-start"
				>
					<div className="space-y-8">
						<div className="bg-white/70 rounded-[32px] border border-[#060010]/10 p-8 md:p-10 shadow-[0_25px_80px_-50px_rgba(6,0,16,0.3)]">
							<h2 className="text-3xl md:text-4xl font-bold text-[#060010] mb-6">
								Crafting brands that sell while the competition sleeps
							</h2>
							<p className="text-base md:text-lg text-[#312619]/80 archivo-font leading-relaxed">
								We design conversion machines disguised as beautiful campaigns. Every pixel, every line of copy, every targeting parameter exists for one reason: turning your marketing budget into a revenue multiplier. Our cross-functional squads blend art with algorithms, creating experiences that captivate audiences while feeding your bottom line.
							</p>
						</div>
						<div className="grid gap-6 sm:grid-cols-2">
							<div className="rounded-[28px] border border-[#060010]/10 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(6,0,16,0.25)]">
								<p className="text-xs uppercase tracking-[0.35em] text-[#8c7b62] clash-display-font">Headquarters</p>
								<p className="mt-3 text-2xl font-bold text-[#060010]">Indore · MP</p>
								<p className="text-sm text-[#312619]/70 archivo-font mt-1">218-B Trade Center, South Tukoganj</p>
							</div>
							<div className="rounded-[28px] border border-[#060010]/10 bg-[#060010] text-[#E9E4D7] p-6">
								<p className="text-xs uppercase tracking-[0.35em] text-[#ff9933] clash-display-font">FOCUS</p>
								<p className="mt-3 text-2xl font-bold">Revenue-obsessed squads</p>
								<p className="text-sm text-[#E9E4D7]/80 archivo-font mt-1">Growth · Brand · Analytics · Tech</p>
							</div>
						</div>
					</div>
					<div className="grid gap-6">
						{stackShots.map((src, idx) => (
							<motion.div
								key={src}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
								className={`relative aspect-[4/3] rounded-[32px] overflow-hidden border border-[#060010]/10 bg-white shadow-[0_25px_80px_-50px_rgba(6,0,16,0.3)] ${
									idx === 1 ? 'translate-x-6 sm:translate-x-10' : ''
								}`}
							>
								<Image src={src} alt="Studio documentation" fill priority={idx === 0} className="object-cover" />
								<div className="absolute inset-0 bg-gradient-to-t from-[#060010]/60 via-transparent to-transparent" />
							</motion.div>
						))}
					</div>
				</motion.div>
			</section>

			{/* Stats Section */}
			<section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{stats.map((stat, idx) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: idx * 0.1 }}
							viewport={{ once: true }}
							className="rounded-[28px] border border-[#060010]/10 bg-white/80 p-8 text-center shadow-[0_20px_60px_-40px_rgba(6,0,16,0.25)]"
						>
						<p className="text-5xl font-black text-[#060010]">
							<CountUp value={stat.value} duration={2} />
							+
						</p>
							<p className="mt-3 text-xs uppercase tracking-[0.3em] text-[#8c7b62] clash-display-font">{stat.label}</p>
						</motion.div>
					))}
				</div>
			</section>

			{/* Values Section */}
			<section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<p className="uppercase tracking-[0.5em] text-xs font-semibold text-[#8c7b62] clash-display-font">OUR VALUES</p>
					<h2 className="mt-4 text-4xl md:text-5xl font-bold text-[#060010]">What Moves Us Forward</h2>
				</motion.div>
				<div className="grid gap-6 md:grid-cols-2">
					{values.map((value, idx) => (
						<motion.div
							key={value.title}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: idx * 0.1 }}
							viewport={{ once: true }}
							className="rounded-[28px] border border-[#060010]/10 bg-white/70 p-8 shadow-[0_20px_60px_-40px_rgba(6,0,16,0.25)] hover:shadow-[0_30px_90px_-40px_rgba(6,0,16,0.4)] transition-shadow duration-300"
						>
							<h3 className="text-2xl font-bold text-[#060010] mb-3">{value.title}</h3>
							<p className="text-base text-[#312619]/80 archivo-font leading-relaxed">{value.description}</p>
						</motion.div>
					))}
				</div>
			</section>

			{/* Timeline Section */}
			<section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid gap-10 lg:grid-cols-[0.85fr_1fr] items-start">
				<motion.div
					initial={{ opacity: 0, x: -30 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
				>
					<p className="uppercase tracking-[0.5em] text-xs font-semibold text-[#8c7b62] clash-display-font">How We Work</p>
					<h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[#060010]">
						Revenue frameworks engineered for infinite scale.
					</h2>
					<p className="mt-6 text-[#312619]/80 archivo-font leading-relaxed">
						We don't just join your team. We become your growth operating system. Our integrated squads work inside your business, building feedback loops that turn every campaign into institutional knowledge and every dollar spent into predictable returns.
					</p>
					<ul className="mt-8 space-y-3 text-sm uppercase tracking-[0.25em] text-[#8c7b62] clash-display-font">
						<li className="flex items-center gap-3">
							<span className="w-1.5 h-1.5 bg-[#8c7b62] rounded-full" />
							Behavioral Data Architecture
						</li>
						<li className="flex items-center gap-3">
							<span className="w-1.5 h-1.5 bg-[#8c7b62] rounded-full" />
							Performance Creative Systems
						</li>
						<li className="flex items-center gap-3">
							<span className="w-1.5 h-1.5 bg-[#8c7b62] rounded-full" />
							Omnichannel Orchestration
						</li>
						<li className="flex items-center gap-3">
							<span className="w-1.5 h-1.5 bg-[#8c7b62] rounded-full" />
							Conversion Psychology Frameworks
						</li>
					</ul>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, x: 30 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="rounded-[32px] border border-[#060010]/10 bg-white/80 p-8 shadow-[0_25px_80px_-50px_rgba(6,0,16,0.3)]"
				>
					<div className="space-y-8">
						{milestones.map((item, idx) => (
							<motion.div
								key={item.year}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: idx * 0.1 }}
								viewport={{ once: true }}
								className="flex gap-6"
							>
								<div className="text-[#8c7b62] font-black text-2xl min-w-[4rem] clash-display-font">{item.year}</div>
								<div>
									<p className="text-xl font-bold text-[#060010]">{item.title}</p>
									<p className="text-sm text-[#312619]/80 archivo-font mt-2 leading-relaxed">{item.desc}</p>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			</section>

			{/* Leadership Section */}
			<section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-12"
				>
					<div>
						<p className="uppercase tracking-[0.5em] text-xs font-semibold text-[#8c7b62] clash-display-font">Leadership</p>
						<h2 className="mt-3 text-4xl sm:text-5xl font-bold text-[#060010]">
							The architects behind<br />your next breakthrough
						</h2>
					</div>
					<p className="text-sm text-[#312619]/80 archivo-font max-w-xl leading-relaxed">
						Our leadership doesn't just talk strategy from corner offices. They're in the trenches daily, optimizing campaigns, reviewing creative, and obsessing over conversion rates alongside our squads.
					</p>
				</motion.div>
				<div className="grid gap-8 md:grid-cols-2">
					{leaders.map((leader, idx) => (
						<motion.div
							key={leader.name}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: idx * 0.1 }}
							viewport={{ once: true }}
							className="group rounded-[32px] border border-[#060010]/10 bg-white overflow-hidden shadow-[0_25px_80px_-50px_rgba(6,0,16,0.3)] hover:shadow-[0_30px_90px_-40px_rgba(6,0,16,0.5)] transition-all duration-300"
						>
							<div className="relative h-80 overflow-hidden">
								<Image
									src={leader.image}
									alt={leader.name}
									fill
									className="object-cover transition-transform duration-700 group-hover:scale-110"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[#060010]/80 via-[#060010]/20 to-transparent" />
							</div>
							<div className="p-6">
								<p className="text-xl font-bold text-[#060010]">{leader.name}</p>
								<p className="text-xs uppercase tracking-[0.3em] text-[#8c7b62] clash-display-font mt-1">
									{leader.title}
								</p>
								<p className="text-sm text-[#312619]/80 archivo-font mt-4 leading-relaxed">{leader.bio}</p>
							</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* CTA Section */}
			<section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="bg-[#060010] text-[#E9E4D7] rounded-[40px] p-12 md:p-16 text-center shadow-2xl"
				>
					<h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Scale?</h2>
					<p className="text-lg md:text-xl mb-8 text-[#E9E4D7]/80 archivo-font max-w-2xl mx-auto">
						Stop settling for marketing that looks good in reports but doesn't move revenue. Let's build your growth engine.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<a
							href="/contact"
							className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90 clash-display-font"
						>
							Explore Opportunities <span aria-hidden>→</span>
						</a>
					</div>
				</motion.div>
			</section>

			<SiteFooter />
		</main>
	);
}
