'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

const trips = [
  {
    id: '1',
    destination: 'Dubai, UAE',
    dates: 'Mar 15 – 22',
    status: 'Upcoming',
    statusStyle: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    budget: '$2,450',
    image: 'https://picsum.photos/seed/dubai-skyline/800/500',
    tagline: 'Desert modernism & gold souks',
  },
  {
    id: '2',
    destination: 'Istanbul, Turkey',
    dates: 'Apr 5 – 12',
    status: 'Planning',
    statusStyle: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    budget: '$1,800',
    image: 'https://picsum.photos/seed/istanbul-mosque/800/500',
    tagline: 'Bazaars, Bosphorus, baklava',
  },
  {
    id: '3',
    destination: 'Bali, Indonesia',
    dates: 'May 1 – 10',
    status: 'Completed',
    statusStyle: 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400',
    budget: '$3,200',
    image: 'https://picsum.photos/seed/bali-temple/800/500',
    tagline: 'Rice terraces & reef diving',
  },
  {
    id: '4',
    destination: 'Paris, France',
    dates: 'Jun 10 – 17',
    status: 'Planning',
    statusStyle: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    budget: '$2,900',
    image: 'https://picsum.photos/seed/paris-street/800/500',
    tagline: 'Left bank cafés & night trains',
  },
  {
    id: '5',
    destination: 'Tokyo, Japan',
    dates: 'Jul 20 – 30',
    status: 'Upcoming',
    statusStyle: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    budget: '$4,100',
    image: 'https://picsum.photos/seed/tokyo-neon/800/500',
    tagline: 'Shibuya crossings & onsen towns',
  },
];

const activity = [
  { time: '2h ago', text: 'Booked Emirates EK-342, Lahore → Dubai' },
  { time: '5h ago', text: 'Confirmed Marriott Downtown Istanbul — 7 nights' },
  { time: '1d ago', text: 'Created Bali Adventure itinerary — 10 days' },
  { time: '2d ago', text: 'Added Eiffel Tower visit to Paris trip' },
];

export default function DashboardPage() {
  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
              {trips.length} trips &middot; {trips.filter(t => t.status === 'Upcoming').length} upcoming
            </p>
          </div>
          <Link
            href="/chat/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-[hsl(var(--brand))] text-white hover:opacity-90 transition-opacity"
          >
            New trip
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Featured trip — the one nearest to happening */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mb-10"
        >
          <Link
            href={`/trip/${trips[0].id}`}
            className="group relative block rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-900"
          >
            <div className="relative h-64 md:h-80">
              <Image
                src={trips[0].image}
                alt={trips[0].destination}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 75vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${trips[0].statusStyle}`}>
                  {trips[0].status}
                </span>
                <span className="text-white/60 text-xs">{trips[0].dates}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {trips[0].destination}
              </h2>
              <p className="text-white/70 text-sm">{trips[0].tagline}</p>
            </div>
          </Link>
        </motion.div>

        {/* Trip list — compact rows, not cards */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-4">
            All trips
          </h2>
          <div className="divide-y divide-slate-100 dark:divide-zinc-800 border border-slate-100 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900">
            {trips.map((trip, i) => (
              <motion.div
                key={trip.id}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease }}
              >
                <Link
                  href={`/trip/${trip.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-zinc-800">
                    <Image
                      src={trip.image}
                      alt={trip.destination}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {trip.destination}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${trip.statusStyle}`}>
                        {trip.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                      {trip.dates} &middot; {trip.tagline}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums flex-shrink-0">
                    {trip.budget}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity — minimal, no icons */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-4">
            Activity
          </h2>
          <div className="space-y-3">
            {activity.map((a, i) => (
              <motion.div
                key={i}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.04, ease }}
                className="flex items-baseline gap-3 text-sm"
              >
                <span className="text-slate-300 dark:text-zinc-600 tabular-nums text-xs w-12 flex-shrink-0">
                  {a.time}
                </span>
                <span className="text-slate-700 dark:text-zinc-300">{a.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
