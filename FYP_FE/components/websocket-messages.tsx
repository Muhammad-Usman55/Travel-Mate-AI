'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { HotelCard } from './hotel-card';
import { FlightCard } from './flight-card';
import { CurrencyCard } from './currency-card';
import { WeatherCard } from './weather-card';
import { LocationCard } from './location-card';
import { AgentActivity } from './agent-activity';
import { TripOverview } from './trip-overview';

export function WebSocketMessages() {
  const { messages, isTyping } = useAppSelector((state) => state.chat);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto px-4">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="brand w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-md">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Welcome to TravelMate AI</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
            Your personal AI travel agent. I can help you plan trips, search flights, find hotels, check weather, convert currency, and discover attractions.
          </p>
          <div className="flex flex-wrap gap-2 justify-center max-w-md">
            {[
              'Plan a trip to Dubai',
              'Find flights to London',
              '5 star hotels in Islamabad',
              'Weather in Paris',
            ].map((suggestion) => (
              <span key={suggestion} className="text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/50">
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <AgentActivity />
      
      {messages.filter(m => m.type !== 'agent_status').map((message, index) => (
        <div
          key={index}
          className={`flex items-start gap-3 ${
            message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <div           className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
            message.sender === 'user'
              ? 'brand'
              : 'brand-subtle brand-text'
          }`}>
            {message.sender === 'user' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 11.5c0-.276.224-.5.5-.5h5c.276 0 .5.224.5.5s-.224.5-.5.5h-5c-.276 0-.5-.224-.5-.5zm.5-2.5h5c.276 0 .5.224.5.5s-.224.5-.5.5h-5c-.276 0-.5-.224-.5-.5s.224-.5.5-.5zm0-3h5c.276 0 .5.224.5.5s-.224.5-.5.5h-5c-.276 0-.5-.224-.5-.5s.224-.5.5-.5zM5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm0 2v14h14V5H5z"/>
              </svg>
            )}
          </div>
          
          <div className={`${
            message.sender === 'user' ? 'max-w-[75%] text-right' : 'text-left w-full'
          }`}>
            <div className={`inline-block rounded-2xl shadow-sm ${
              message.sender === 'user'
                ? 'brand text-white rounded-br-md p-4'
                : message.error
                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-bl-md p-4'
                : ['hotels', 'flights', 'travel', 'currency'].includes(message.type || '')
                ? 'bg-transparent'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-md p-4 shadow-sm hover:shadow-md transition-shadow'
            }`}>
              {message.type === 'travel' ? (
                <div className="space-y-5">
                  {message.text?.text && (
                    <div className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text.text}</p>
                    </div>
                  )}
                  
                  {/* Trip Overview strip */}
                  {message.text?.flights?.length > 0 && message.text?.hotels?.length > 0 && (
                    <TripOverview
                      flight={message.text.flights[0]}
                      hotel={message.text.hotels[0]}
                      weather={message.text.weather}
                      currency={message.text.currency}
                    />
                  )}

                  {/* Flights */}
                  {message.text?.flights?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">✈️</span>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Flights</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 tabular-nums">
                          {message.text.flights.length} option{message.text.flights.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {message.text.flights.map((flight: any, idx: number) => (
                          <FlightCard key={idx} flight={flight} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Hotels as grid */}
                  {message.text?.hotels?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🏨</span>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Hotels</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 tabular-nums">
                          {message.text.hotels.length} option{message.text.hotels.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {message.text.hotels.slice(0, 4).map((hotel: any, idx: number) => (
                          <HotelCard key={idx} hotel={hotel} />
                        ))}
                      </div>
                      {message.text.hotels.length > 4 && (
                        <p className="text-xs text-slate-400 text-center mt-3">
                          +{message.text.hotels.length - 4} more hotels available
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Weather — only standalone */}
                  {message.text?.weather && !message.text?.flights?.length && (
                    <WeatherCard weather={message.text.weather} />
                  )}

                  {/* Currency — only standalone */}
                  {message.text?.currency && !message.text?.flights?.length && (
                    <div className="max-w-sm"><CurrencyCard currency={message.text.currency} /></div>
                  )}

                  {/* Locations */}
                  {message.text?.locations?.length > 0 && (
                    <LocationCard locations={message.text.locations} />
                  )}
                </div>
              ) : message.type === 'currency' && message.text?.currency ? (
                <div className="max-w-sm">
                  <CurrencyCard currency={message.text.currency} />
                </div>
              ) : message.type === 'hotels' && message.text?.hotels ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Found {message.text.hotels.length} hotel options:</p>
                  {message.text.hotels.map((hotel: any, idx: number) => (
                    <HotelCard key={idx} hotel={hotel.details?.[0]?.data || hotel} />
                  ))}
                </div>
              ) : message.type === 'flights' && message.text?.data ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Found {message.text.data.length} flight options:</p>
                  {message.text.data.map((flight: any, idx: number) => (
                    <FlightCard key={idx} flight={flight} />
                  ))}
                </div>
              ) : message.type === 'locations' && message.text?.locations?.length > 0 ? (
                <LocationCard locations={message.text.locations} />
              ) : message.type === 'weather' && message.text?.weather ? (
                <WeatherCard weather={message.text.weather} />
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{typeof message.text === 'string' ? message.text : JSON.stringify(message.text)}</p>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {isTyping && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            </svg>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl rounded-bl-md shadow-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}