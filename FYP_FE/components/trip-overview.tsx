'use client';

function parsePrice(val: any): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const m = val.replace(/,/g, '').match(/[\d.]+/);
    return m ? parseFloat(m[0]) : 0;
  }
  return 0;
}

interface TripOverviewProps {
  flight: any;
  hotel: any;
  weather: any;
  currency: any;
}

export function TripOverview({ flight, hotel, weather, currency }: TripOverviewProps) {
  const flightPrice = parsePrice(flight?.TotalBudget);
  const hotelPrice = parsePrice(hotel?.Price ?? hotel?.price);
  const total = flightPrice + hotelPrice;
  const convertedTotal = currency?.rate ? Math.round(total * currency.rate) : null;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-[hsl(var(--brand))]/8 to-transparent border-b border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[hsl(var(--brand))]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[hsl(var(--brand))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Trip Summary</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {flight?.CabinClass || 'Economy'} · {flight?.Segments?.[0]?.[0]?.NumberOfStops === 0 ? 'Direct' : 'Connecting'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[hsl(var(--brand))] tabular-nums">${total.toLocaleString()}</p>
            {convertedTotal !== null && (
              <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                ≈ {convertedTotal.toLocaleString()} {currency.to}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 divide-x divide-slate-100 dark:divide-slate-700/50">
        <div className="px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Destination</p>
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {weather?.city ?? hotel?.City ?? '—'}
          </p>
        </div>

        <div className="px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Weather</p>
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {weather?.temperature ?? '—'}
          </p>
          <p className="text-[10px] text-slate-400">{weather?.condition ?? ''}</p>
        </div>

        <div className="px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Currency</p>
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {currency?.rate ? `1 USD = ${currency.rate}` : '—'}
          </p>
          <p className="text-[10px] text-slate-400">{currency?.to ?? ''}</p>
        </div>

        <div className="px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Travelers</p>
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {flight?.Segments?.[0]?.[0] ? '1 Adult' : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
