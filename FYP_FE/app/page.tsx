'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/seed/travel-coast/1600/1000"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/40 dark:from-zinc-950 dark:via-zinc-950/90 dark:to-zinc-950/40" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <p className="text-sm font-medium tracking-wide uppercase text-[hsl(var(--brand))] mb-4">
            Multi-agent travel AI
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
            Plan trips
            <br />
            through conversation
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
            One chat to search flights, find hotels, check weather, convert currency, and discover places.
            Five specialist agents handle the rest.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/chat/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-[hsl(var(--brand))] text-white hover:opacity-90 transition-opacity"
            >
              Start planning
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-colors"
            >
              Explore destinations
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="hidden md:block"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/60 dark:border-zinc-800/60">
            <Image
              src="https://picsum.photos/seed/travel-chat/800/520"
              alt="TravelMate chat interface preview"
              width={800}
              height={520}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 0vw, 50vw"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const capabilities = [
  {
    title: 'Flight search',
    description: 'Compare fares across airlines. Real-time pricing, not cached relics.',
    image: 'https://picsum.photos/seed/flight-sky/600/400',
    span: 'md:col-span-2 md:row-span-2',
    tall: true,
  },
  {
    title: 'Hotel booking',
    description: 'From hostels to boutique stays. Filtered by your budget and dates.',
    image: 'https://picsum.photos/seed/hotel-room/600/400',
    span: '',
    tall: false,
  },
  {
    title: 'Weather forecasts',
    description: 'Know what to pack. Real data for your travel dates.',
    image: 'https://picsum.photos/seed/weather-sun/600/400',
    span: '',
    tall: false,
  },
  {
    title: 'Currency conversion',
    description: 'Live exchange rates. Budget in any currency without mental math.',
    image: 'https://picsum.photos/seed/currency-usd/600/400',
    span: '',
    tall: false,
  },
  {
    title: 'Place discovery',
    description: 'Interactive maps and local spots, curated by context not algorithms.',
    image: 'https://picsum.photos/seed/map-city/600/400',
    span: '',
    tall: false,
  },
];

function Capabilities() {
  return (
    <section className="px-6 py-24 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
            What your agents handle
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg">
            Each specialist agent pulls real data via MCP protocol. No hallucinated prices, no made-up flight numbers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 auto-rows-[220px]">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease }}
              className={`group relative rounded-2xl overflow-hidden ${cap.span}`}
            >
              <Image
                src={cap.image}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-semibold text-lg mb-1">{cap.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{cap.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const agents = [
  { label: 'Orchestrator', role: 'Routes your request to the right agents' },
  { label: 'Flights', role: 'Searches airline APIs for real fares' },
  { label: 'Hotels', role: 'Queries booking platforms by dates and budget' },
  { label: 'Weather', role: 'Pulls forecasts for your destination and dates' },
  { label: 'Currency', role: 'Converts between 150+ currencies live' },
  { label: 'Locations', role: 'Finds places, maps, and local context' },
];

function AgentStrip() {
  return (
    <section className="px-6 py-24 bg-slate-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
            Six agents, one conversation
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg">
            You type a message. The orchestrator decides who handles what. Results come back together.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-zinc-800 rounded-2xl overflow-hidden">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white dark:bg-zinc-900 p-6"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-[hsl(var(--brand))] mb-2 block">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{agent.label}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{agent.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-6 py-24 bg-white dark:bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
          Your next trip starts with a message
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
          No forms, no filters, no ten-tab browsing sessions. Just tell the agent where you want to go.
        </p>
        <Link
          href="/chat/new"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium bg-[hsl(var(--brand))] text-white hover:opacity-90 transition-opacity text-lg"
        >
          Start planning
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-slate-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[hsl(var(--brand))] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">TravelMate AI</span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          MCP-based travel planning agent
        </p>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Capabilities />
      <AgentStrip />
      <CTA />
      <Footer />
    </div>
  );
}
