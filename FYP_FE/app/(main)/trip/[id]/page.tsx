'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapView } from '@/components/map-view';

const tripIconMap: Record<string, JSX.Element> = {
  city: (
    <svg className="w-8 h-8 brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  mosque: (
    <svg className="w-8 h-8 brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c-1.5 2-4 4-4 7a4 4 0 008 0c0-3-2.5-5-4-7zM8 14v7m8-7v7M5 21h14M3 21h18" />
    </svg>
  ),
  beach: (
    <svg className="w-8 h-8 brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15c2.483 0 4.345-1.932 5-3 .655 1.068 2.517 3 5 3s4.345-1.932 5-3c.655 1.068 2.517 3 5 3M12 3v6m-4-2l4 4 4-4" />
    </svg>
  ),
};

const tripsData: Record<string, any> = {
  '1': {
    destination: 'Dubai, UAE',
    iconKey: 'city',
    dates: 'Mar 15 - Mar 22, 2026',
    status: 'Upcoming',
    totalBudget: '$2,450',
    travelers: 2,
    flights: [
      {
        type: 'Outbound',
        airline: 'Emirates',
        flightNo: 'EK-342',
        from: 'Lahore (LHE)',
        to: 'Dubai (DXB)',
        departure: 'Mar 15, 2026 — 08:30 AM',
        arrival: 'Mar 15, 2026 — 10:45 AM',
        duration: '3h 15m',
        price: '$320',
      },
      {
        type: 'Return',
        airline: 'Emirates',
        flightNo: 'EK-343',
        from: 'Dubai (DXB)',
        to: 'Lahore (LHE)',
        departure: 'Mar 22, 2026 — 11:00 PM',
        arrival: 'Mar 23, 2026 — 01:15 AM',
        duration: '3h 15m',
        price: '$320',
      },
    ],
    hotel: {
      name: 'Marriott Hotel Downtown Dubai',
      checkIn: 'Mar 15, 2026',
      checkOut: 'Mar 22, 2026',
      nights: 7,
      roomType: 'Deluxe King Room',
      pricePerNight: '$185',
      totalPrice: '$1,295',
    },
    itinerary: [
      { day: 1, title: 'Arrival & Check-in', activities: ['Airport pickup', 'Hotel check-in at Marriott Downtown', 'Evening walk at Dubai Marina', 'Dinner at La Petite Maison'] },
      { day: 2, title: 'Iconic Landmarks', activities: ['Burj Khalifa observation deck', 'Dubai Mall & Aquarium', 'Dubai Fountain show', 'Souk Al Bahar dinner'] },
      { day: 3, title: 'Cultural Dubai', activities: ['Al Fahidi Historic District', 'Dubai Museum', 'Abra ride across Dubai Creek', 'Gold & Spice Souk exploration'] },
      { day: 4, title: 'Desert Adventure', activities: ['Morning at leisure', 'Afternoon desert safari', 'Dune bashing & camel riding', 'BBQ dinner under the stars'] },
      { day: 5, title: 'Beach & Luxury', activities: ['Jumeirah Beach morning', 'Atlantis Aquaventure water park', 'Palm Jumeirah exploration', 'Fine dining at Nobu'] },
      { day: 6, title: 'Modern Dubai', activities: ['Dubai Frame visit', 'Miracle Garden', 'Global Village', 'Shopping at Mall of the Emirates'] },
      { day: 7, title: 'Departure', activities: ['Last-minute shopping', 'Hotel checkout', 'Airport transfer', 'Flight back home'] },
    ],
  },
  '2': {
    destination: 'Istanbul, Turkey',
    iconKey: 'mosque',
    dates: 'Apr 5 - Apr 12, 2026',
    status: 'Planning',
    totalBudget: '$1,800',
    travelers: 2,
    flights: [
      {
        type: 'Outbound',
        airline: 'Turkish Airlines',
        flightNo: 'TK-715',
        from: 'Lahore (LHE)',
        to: 'Istanbul (IST)',
        departure: 'Apr 5, 2026 — 06:00 AM',
        arrival: 'Apr 5, 2026 — 11:30 AM',
        duration: '7h 30m',
        price: '$280',
      },
      {
        type: 'Return',
        airline: 'Turkish Airlines',
        flightNo: 'TK-716',
        from: 'Istanbul (IST)',
        to: 'Lahore (LHE)',
        departure: 'Apr 12, 2026 — 01:00 PM',
        arrival: 'Apr 12, 2026 — 10:30 PM',
        duration: '7h 30m',
        price: '$280',
      },
    ],
    hotel: {
      name: 'Hotel Sultanhan Istanbul',
      checkIn: 'Apr 5, 2026',
      checkOut: 'Apr 12, 2026',
      nights: 7,
      roomType: 'Superior Double Room',
      pricePerNight: '$120',
      totalPrice: '$840',
    },
    itinerary: [
      { day: 1, title: 'Arrival in Istanbul', activities: ['Airport transfer', 'Hotel check-in at Sultanahmet', 'Evening stroll along the Bosphorus', 'Turkish dinner'] },
      { day: 2, title: 'Historic Peninsula', activities: ['Hagia Sophia visit', 'Blue Mosque (Sultan Ahmed)', 'Basilica Cistern', 'Topkapi Palace'] },
      { day: 3, title: 'Grand Bazaar & Spice Market', activities: ['Grand Bazaar shopping', 'Spice Bazaar exploration', 'Turkish coffee tasting', 'Süleymaniye Mosque'] },
      { day: 4, title: 'Bosphorus Cruise', activities: ['Full-day Bosphorus cruise', 'Dolmabahçe Palace visit', 'Ortaköy neighborhood', 'Dinner at Mikla'] },
      { day: 5, title: 'Asian Side', activities: ['Ferry to Kadıköy', 'Moda neighborhood walk', 'Çamlıca Hill panoramic views', 'Street food tour'] },
      { day: 6, title: 'Art & Culture', activities: ['Istanbul Modern Art Museum', 'İstiklal Avenue walk', 'Galata Tower', 'Taksim Square & nightlife'] },
      { day: 7, title: 'Departure', activities: ['Last breakfast at hotel', 'Souvenir shopping', 'Airport transfer', 'Departure flight'] },
    ],
  },
};

const defaultTrip = {
  destination: 'Bali, Indonesia',
  iconKey: 'beach',
  dates: 'May 1 - May 10, 2026',
  status: 'Completed',
  totalBudget: '$3,200',
  travelers: 2,
  flights: [
    { type: 'Outbound', airline: 'Singapore Airlines', flightNo: 'SQ-437', from: 'Lahore (LHE)', to: 'Denpasar (DPS)', departure: 'May 1, 2026 — 02:00 AM', arrival: 'May 1, 2026 — 04:00 PM', duration: '11h', price: '$450' },
    { type: 'Return', airline: 'Singapore Airlines', flightNo: 'SQ-438', from: 'Denpasar (DPS)', to: 'Lahore (LHE)', departure: 'May 10, 2026 — 06:00 PM', arrival: 'May 11, 2026 — 02:00 AM', duration: '11h', price: '$450' },
  ],
  hotel: { name: 'The Mulia Bali', checkIn: 'May 1, 2026', checkOut: 'May 10, 2026', nights: 9, roomType: 'Ocean View Suite', pricePerNight: '$200', totalPrice: '$1,800' },
  itinerary: [
    { day: 1, title: 'Arrival', activities: ['Airport pickup', 'Resort check-in', 'Beach sunset', 'Welcome dinner'] },
    { day: 2, title: 'Temple Tour', activities: ['Uluwatu Temple', 'Tanah Lot Temple', 'Kecak Dance show'] },
    { day: 3, title: 'Rice Terraces', activities: ['Tegalalang Rice Terraces', 'Ubud Monkey Forest', 'Art galleries'] },
  ],
};

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const trip = tripsData[id] || defaultTrip;

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="px-6 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl brand-subtle flex items-center justify-center">
              {tripIconMap[trip.iconKey] || tripIconMap.beach}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{trip.destination}</h1>
              <p className="text-slate-600 dark:text-slate-400">{trip.dates} · {trip.travelers} travelers</p>
            </div>
            <span className={`ml-auto px-4 py-1.5 rounded-full text-sm font-medium ${
              trip.status === 'Upcoming' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
              trip.status === 'Planning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
              'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}>
              {trip.status}
            </span>
          </motion.div>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto w-full">
        {/* Budget Overview */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="brand rounded-2xl p-6 mb-8"
        >
          <p className="text-sm text-white/80 mb-1">Total Budget</p>
          <p className="text-4xl font-bold">{trip.totalBudget}</p>
          <div className="flex gap-6 mt-4">
            <div>
              <p className="text-xs text-white/70">Flights</p>
              <p className="text-lg font-semibold">{trip.flights[0]?.price}</p>
            </div>
            <div>
              <p className="text-xs text-white/70">Hotel</p>
              <p className="text-lg font-semibold">{trip.hotel.totalPrice}</p>
            </div>
            <div>
              <p className="text-xs text-white/70">Duration</p>
              <p className="text-lg font-semibold">{trip.hotel.nights} nights</p>
            </div>
          </div>
        </motion.div>

        {/* Flights */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Flights
          </h2>
          <div className="space-y-4">
            {trip.flights.map((flight: any, index: number) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider brand-text">{flight.type}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{flight.price}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{flight.from}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{flight.departure}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-xs text-slate-400 dark:text-slate-500">{flight.duration}</p>
                    <div className="w-24 h-px bg-[hsl(var(--brand-border))] relative">
                      <svg className="w-4 h-4 brand-text absolute -right-2 -top-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{flight.airline} {flight.flightNo}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{flight.to}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{flight.arrival}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hotel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Hotel
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">{trip.hotel.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-500 dark:text-slate-400">Check-in</p>
                <p className="font-medium text-slate-900 dark:text-white">{trip.hotel.checkIn}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Check-out</p>
                <p className="font-medium text-slate-900 dark:text-white">{trip.hotel.checkOut}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Room</p>
                <p className="font-medium text-slate-900 dark:text-white">{trip.hotel.roomType}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Total</p>
                <p className="font-bold brand-text">{trip.hotel.totalPrice}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Itinerary */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Day-by-Day Itinerary
          </h2>
          <div className="space-y-4">
            {trip.itinerary.map((day: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl brand-subtle flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold brand-text">D{day.day}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{day.title}</h3>
                    <div className="space-y-1.5">
                      {day.activities.map((activity: string, aIdx: number) => (
                        <div key={aIdx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--brand))] flex-shrink-0" />
                          {activity}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6"
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Trip Map
          </h2>
          <MapView
            latitude={trip.destination === 'Dubai, UAE' ? 25.2048 : trip.destination === 'Istanbul, Turkey' ? 41.0082 : -8.4095}
            longitude={trip.destination === 'Dubai, UAE' ? 55.2708 : trip.destination === 'Istanbul, Turkey' ? 28.9784 : 115.1889}
            name={trip.destination}
          />
        </motion.div>
      </div>
    </div>
  );
}
