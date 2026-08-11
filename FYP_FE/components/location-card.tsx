'use client';

import { MapPin, Navigation } from 'lucide-react';

export function LocationCard({ locations }: { locations: any[] }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📍</span>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Top Attractions
        </h4>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 tabular-nums">
          {locations.length}
        </span>
      </div>
      <div className="space-y-1.5">
        {locations.map((loc: any, idx: number) => (
          <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <div className="w-7 h-7 rounded-lg bg-[hsl(var(--brand))]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[hsl(var(--brand))]/15 transition-colors">
              <MapPin className="w-3.5 h-3.5 text-[hsl(var(--brand))]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{loc.name}</p>
              {loc.type && (
                <p className="text-[10px] text-slate-400 capitalize">{loc.type.replace(/_/g, ' ')}</p>
              )}
            </div>
            {loc.latitude && loc.longitude && (
              <a
                href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Navigation className="w-3.5 h-3.5 text-slate-400 hover:text-[hsl(var(--brand))]" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
