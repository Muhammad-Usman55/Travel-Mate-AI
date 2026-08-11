'use client';

import { useState } from 'react';
import { MapPin, Star, Check, Wifi, Car, UtensilsCrossed } from 'lucide-react';

interface NewHotelData {
  HotelName: string;
  City: string;
  Price: string;
  Rating: number | string;
  Stars: string | number;
  Amenities: string[];
  CheckOut: string;
  Link: string;
  Thumbnail: string;
}

interface OldHotelData {
  hotel_city: string;
  hotel_name: string;
  price: number;
  currency: string;
  start_date: string;
  end_date: string;
  room_category: string | null;
  no_of_beds: number;
  bed_type: string | null;
  description: string | null;
  adults: number;
  board_type?: string | null;
}

type HotelData = NewHotelData | OldHotelData;

function isNewFormat(hotel: HotelData): hotel is NewHotelData {
  return 'HotelName' in hotel;
}

function getAmenityIcon(amenity: string) {
  const lower = amenity.toLowerCase();
  if (lower.includes('wifi') || lower.includes('internet')) return <Wifi className="w-3 h-3" />;
  if (lower.includes('parking') || lower.includes('car')) return <Car className="w-3 h-3" />;
  if (lower.includes('breakfast') || lower.includes('restaurant') || lower.includes('food')) return <UtensilsCrossed className="w-3 h-3" />;
  return null;
}

interface HotelCardProps {
  hotel: HotelData;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const [booked, setBooked] = useState(false);
  const confirmationCode = `TM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  if (isNewFormat(hotel)) {
    const stars = typeof hotel.Stars === 'string' ? parseInt(hotel.Stars) || 0 : hotel.Stars || 0;
    const rating = typeof hotel.Rating === 'number' ? hotel.Rating : parseFloat(String(hotel.Rating)) || 0;

    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
        {/* Thumbnail */}
        {hotel.Thumbnail && hotel.Thumbnail !== 'N/A' ? (
          <div className="h-36 overflow-hidden relative">
            <img
              src={hotel.Thumbnail}
              alt={hotel.HotelName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            {/* Price badge */}
            <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
              <p className="text-sm font-bold text-[hsl(var(--brand))] tabular-nums">{hotel.Price === 'N/A' ? 'Price on request' : hotel.Price}</p>
              {hotel.Price !== 'N/A' && <p className="text-[9px] text-slate-400 -mt-0.5">per night</p>}
            </div>
            {/* Rating badge */}
            {rating > 0 && (
              <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{rating}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-36 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
            <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Stars */}
          {stars > 0 && (
            <div className="flex items-center gap-0.5 mb-1.5">
              {Array.from({ length: Math.min(stars, 5) }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-[10px] text-slate-400 ml-1">{stars}-star</span>
            </div>
          )}

          {/* Name */}
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight mb-1 line-clamp-2">
            {hotel.HotelName}
          </h3>

          {/* Location */}
          <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {hotel.City}
          </p>

          {/* Amenities */}
          {hotel.Amenities && hotel.Amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3 mt-auto">
              {hotel.Amenities.slice(0, 3).map((amenity, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded"
                >
                  {getAmenityIcon(amenity)}
                  {amenity.length > 12 ? amenity.slice(0, 12) + '…' : amenity}
                </span>
              ))}
              {hotel.Amenities.length > 3 && (
                <span className="text-[10px] text-slate-400">+{hotel.Amenities.length - 3}</span>
              )}
            </div>
          )}

          {/* Book button */}
          <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-700/50">
            {!booked ? (
              <button
                onClick={() => setBooked(true)}
                className="w-full py-2 rounded-lg bg-[hsl(var(--brand))] text-white text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Book Hotel
              </button>
            ) : (
              <div className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                <Check className="w-3.5 h-3.5" />
                Booked — {confirmationCode}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Legacy format
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{(hotel as OldHotelData).hotel_name}</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {(hotel as OldHotelData).hotel_city}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold brand-text tabular-nums">
              ${(hotel as OldHotelData).price.toFixed(2)} {(hotel as OldHotelData).currency}
            </p>
            <p className="text-[10px] text-slate-400">
              for {(hotel as OldHotelData).adults} adult(s)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
          <div>
            <span className="text-slate-400">Check-in</span>
            <p className="font-medium text-slate-700 dark:text-slate-200 tabular-nums">
              {new Date((hotel as OldHotelData).start_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-slate-400">Check-out</span>
            <p className="font-medium text-slate-700 dark:text-slate-200 tabular-nums">
              {new Date((hotel as OldHotelData).end_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mb-3 text-xs">
          <p className="text-slate-400 mb-0.5">Room</p>
          <p className="font-medium text-slate-700 dark:text-slate-200">
            {(hotel as OldHotelData).room_category
              ? (hotel as OldHotelData).room_category!.replace(/_/g, ' ')
              : 'Standard Room'}
          </p>
          <p className="text-[10px] text-slate-400">
            {(hotel as OldHotelData).no_of_beds} {(hotel as OldHotelData).bed_type || 'Standard'} bed(s)
          </p>
        </div>

        <div className="border-t pt-3">
          {!booked ? (
            <button
              onClick={() => setBooked(true)}
              className="w-full py-2 rounded-lg bg-[hsl(var(--brand))] text-white text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Book Hotel
            </button>
          ) : (
            <div className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
              <Check className="w-3.5 h-3.5" />
              Booked — {confirmationCode}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
