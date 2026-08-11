export function WeatherCard({ weather }: { weather: any }) {
  return (
    <div className="max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">{weather.city}</p>
          {weather.country && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{weather.country}</p>
          )}
        </div>
        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
          <svg className="w-5 h-5 text-amber-600 dark:text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" strokeWidth={1.8} />
            <path strokeLinecap="round" strokeWidth={1.8} d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4l1.4-1.4" />
          </svg>
        </div>
      </div>
      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
        {weather.temperature}
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">{weather.condition}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Feels like {weather.feels_like}</p>
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Humidity</p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{weather.humidity}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Wind</p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{weather.wind_speed}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">High</p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{weather.high}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Low</p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{weather.low}</p>
        </div>
      </div>
    </div>
  );
}
