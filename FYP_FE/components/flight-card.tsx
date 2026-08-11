'use client';

import { useState } from 'react';
import { Plane, Clock, ArrowRight, Check } from 'lucide-react';

interface FlightSegment {
  AirlineName: string;
  arrivalIATA: string;
  FlightNumber: string;
  Aircraft: string;
  Departure: string;
  Arrival: string;
  FlightDuration: string;
  NumberOfStops: number;
}

interface FlightData {
  TotalBudget: string;
  TotalTravelTime: string;
  CabinClass?: string;
  Segments: FlightSegment[][];
}

interface FlightCardProps {
  flight: FlightData;
}

function splitLeg(value: string) {
  if (!value || value === 'N/A') return { city: '', time: '' };
  const parts = value.split(' - ');
  const city = parts[0] || '';
  const time = parts.slice(1).join(' - ');
  return { city, time };
}

function getAirlineLogo(airline: string): string {
  const logos: Record<string, string> = {
    'Emirates': 'EK', 'flydubai': 'FZ', 'PIA': 'PK', 'SereneAir': 'ER',
    'AirSial': 'PF', 'AirBlue': 'PA', 'British Airways': 'BA',
    'Saudia': 'SV', 'Qatar Airways': 'QR', 'Etihad Airways': 'EY',
    'Turkish Airlines': 'TK', 'Air China': 'CA', 'Singapore Airlines': 'SQ',
  };
  return logos[airline] || airline?.slice(0, 2)?.toUpperCase() || '??';
}

export function FlightCard({ flight }: FlightCardProps) {
  const [booked, setBooked] = useState(false);
  const confirmationCode = `TM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const hasDuration = flight.TotalTravelTime && flight.TotalTravelTime !== 'N/A';
  const firstSegment = flight.Segments?.[0]?.[0];
  const isDirect = firstSegment?.NumberOfStops === 0;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Top: Price + Class + Airline */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
            {getAirlineLogo(firstSegment?.AirlineName)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{firstSegment?.AirlineName}</p>
            <p className="text-xs text-slate-400">{firstSegment?.FlightNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-[hsl(var(--brand))] tabular-nums">{flight.TotalBudget}</p>
          {flight.CabinClass && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--brand))]/10 text-[hsl(var(--brand))] font-medium">
              {flight.CabinClass}
            </span>
          )}
        </div>
      </div>

      {/* Middle: Route + Times */}
      <div className="px-5 py-4">
        {flight.Segments.map((journey, journeyIdx) => (
          <div key={journeyIdx} className={journeyIdx > 0 ? 'mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50' : ''}>
            {journeyIdx > 0 && (
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Return</p>
            )}
            {journey.map((segment, segmentIdx) => {
              const dep = splitLeg(segment.Departure);
              const arr = splitLeg(segment.Arrival);
              const hasDuration = segment.FlightDuration && segment.FlightDuration !== 'N/A';

              return (
                <div key={segmentIdx} className="flex items-center gap-4">
                  {/* Departure */}
                  <div className="text-left min-w-[60px]">
                    <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                      {dep.time || dep.city || segment.Departure}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">{dep.city || segment.Departure}</p>
                  </div>

                  {/* Flight path visual */}
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 w-full">
                      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                        <Plane className="w-3 h-3 text-[hsl(var(--brand))] -rotate-45" />
                      </div>
                      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                    </div>
                    <div className="flex items-center gap-2">
                      {hasDuration && (
                        <span className="text-[10px] text-slate-400 tabular-nums">{segment.FlightDuration}</span>
                      )}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        isDirect
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {isDirect ? 'Direct' : `${segment.NumberOfStops} stop${segment.NumberOfStops > 1 ? 's' : ''}`}
                      </span>
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="text-right min-w-[60px]">
                    <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                      {arr.time || segment.arrivalIATA}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">{segment.arrivalIATA}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom: Book button */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700/50">
        {!booked ? (
          <button
            onClick={() => setBooked(true)}
            className="w-full py-2.5 rounded-lg bg-[hsl(var(--brand))] text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Book Flight
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
            <Check className="w-4 h-4" />
            Confirmed — {confirmationCode}
          </div>
        )}
      </div>
    </div>
  );
}
