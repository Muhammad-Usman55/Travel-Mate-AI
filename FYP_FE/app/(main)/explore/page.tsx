'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

const categories = ['All', 'Beach', 'City', 'Mountains', 'Cultural', 'Adventure'];

const destinations = [
  {
    id: 1,
    name: 'Bali, Indonesia',
    description: 'Tropical paradise with stunning beaches, ancient temples, and lush rice terraces.',
    category: 'Beach',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop',
    rating: 4.8,
    avgBudget: '$1,500',
    bestTime: 'Apr - Oct',
    highlights: ['Beaches', 'Temples', 'Rice Terraces'],
  },
  {
    id: 2,
    name: 'Dubai, UAE',
    description: 'Ultra-modern city with world-class architecture, luxury shopping, and desert safaris.',
    category: 'City',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop',
    rating: 4.7,
    avgBudget: '$2,200',
    bestTime: 'Nov - Mar',
    highlights: ['Burj Khalifa', 'Shopping', 'Desert Safari'],
  },
  {
    id: 3,
    name: 'Istanbul, Turkey',
    description: 'Where East meets West — rich history, stunning mosques, and vibrant bazaars.',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=400&fit=crop',
    rating: 4.9,
    avgBudget: '$1,200',
    bestTime: 'Mar - May',
    highlights: ['Hagia Sophia', 'Grand Bazaar', 'Bosphorus'],
  },
  {
    id: 4,
    name: 'Swiss Alps',
    description: 'Breathtaking mountain scenery, world-class skiing, and pristine alpine towns.',
    category: 'Mountains',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop',
    rating: 4.9,
    avgBudget: '$3,500',
    bestTime: 'Dec - Mar',
    highlights: ['Skiing', 'Hiking', 'Scenic Trains'],
  },
  {
    id: 5,
    name: 'Tokyo, Japan',
    description: 'A fascinating blend of ultramodern and traditional, from neon skyscrapers to historic temples.',
    category: 'City',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop',
    rating: 4.8,
    avgBudget: '$2,800',
    bestTime: 'Mar - May',
    highlights: ['Cherry Blossoms', 'Technology', 'Cuisine'],
  },
  {
    id: 6,
    name: 'Maldives',
    description: 'Crystal-clear waters, overwater villas, and some of the best diving spots on Earth.',
    category: 'Beach',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop',
    rating: 4.9,
    avgBudget: '$4,000',
    bestTime: 'Nov - Apr',
    highlights: ['Snorkeling', 'Overwater Villas', 'Sunsets'],
  },
  {
    id: 7,
    name: 'Machu Picchu, Peru',
    description: 'Iconic Incan citadel set high in the Andes Mountains, a wonder of the ancient world.',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&h=400&fit=crop',
    rating: 4.9,
    avgBudget: '$2,000',
    bestTime: 'May - Sep',
    highlights: ['Inca Trail', 'History', 'Photography'],
  },
  {
    id: 8,
    name: 'Paris, France',
    description: 'The City of Light — art, fashion, gastronomy, and timeless romantic charm.',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop',
    rating: 4.7,
    avgBudget: '$2,500',
    bestTime: 'Apr - Jun',
    highlights: ['Eiffel Tower', 'Louvre', 'Cuisine'],
  },
  {
    id: 9,
    name: 'Patagonia, Argentina',
    description: 'Vast wilderness of glaciers, mountains, and endless steppe at the end of the world.',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop',
    rating: 4.8,
    avgBudget: '$3,000',
    bestTime: 'Oct - Mar',
    highlights: ['Glaciers', 'Trekking', 'Wildlife'],
  },
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = destinations.filter((d) => {
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/70 dark:bg-slate-900">
      {/* Header */}
      <div className="px-6 py-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
            Explore Destinations
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Discover your next adventure from popular destinations around the world
          </p>
        </motion.div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full">
        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-5">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand))]/30 focus:border-[hsl(var(--brand-border))] transition-all shadow-sm"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-[hsl(var(--brand))] text-white shadow-md shadow-[hsl(var(--brand))/20%]'
                    : 'bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 hover:border-[hsl(var(--brand-border))] hover:shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dest, index) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 + index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden hover:shadow-xl hover:shadow-[hsl(var(--brand))/5%] hover:border-[hsl(var(--brand-border))] transition-all duration-300 group"
            >
              {/* Image */}
              <div className="h-44 relative overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-xs font-medium shadow-sm">
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">{dest.rating}</span>
                </div>
                <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm">
                  {dest.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1.5">{dest.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed line-clamp-2">
                  {dest.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {dest.highlights.map((h) => (
                    <span key={h} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium">
                      {h}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50">
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">From</p>
                    <p className="text-sm font-bold text-[hsl(var(--brand))] tabular-nums">{dest.avgBudget}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 dark:text-slate-500">Best Time</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{dest.bestTime}</p>
                  </div>
                </div>

                <Link
                  href={`/chat/new?query=Plan a trip to ${dest.name}`}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[hsl(var(--brand))] text-white hover:opacity-90 hover:shadow-lg hover:shadow-[hsl(var(--brand))/20%] transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Plan This Trip
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">No destinations found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
