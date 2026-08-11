'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { sendWebSocketMessage } from '@/lib/redux/chatSlice';
import { HotelCard } from './hotel-card';
import { FlightCard } from './flight-card';
import { CurrencyCard } from './currency-card';
import { WeatherCard } from './weather-card';
import { LocationCard } from './location-card';
import { AgentActivity } from './agent-activity';
import { TripOverview } from './trip-overview';
import { Bot, User, Sparkles, AlertCircle, ChevronRight } from 'lucide-react';

function extractOptions(text: string): { promptText: string; options: string[] } {
  if (typeof text !== 'string') return { promptText: String(text || ''), options: [] };
  const lower = text.toLowerCase();

  // Seat class question
  if (lower.includes('seat class') || lower.includes('economy') || lower.includes('business')) {
    return {
      promptText: text,
      options: ['✈️ Economy', '💺 Premium Economy', '💼 Business', '👑 First Class']
    };
  }

  // Hotel question
  if (lower.includes('type of hotel') || (lower.includes('hotel') && (lower.includes('star') || lower.includes('2 star')))) {
    return {
      promptText: text,
      options: ['⭐ 2 Star', '⭐⭐ 3 Star', '⭐⭐⭐ 4 Star', '⭐⭐⭐⭐ 5 Star', '🏨 Any Hotel']
    };
  }

  // Date question — User manually types date, no preset option buttons
  if (lower.includes('travel dates') || lower.includes('booking date') || lower.includes('when are you planning')) {
    return {
      promptText: text,
      options: []
    };
  }

  // Generic options in parentheses e.g. (e.g., Option 1, Option 2)
  const match = text.match(/\(e\.g\.,?\s*([^)]+)\)/i) || text.match(/\(([^)]+)\)/i);
  if (match && match[1]) {
    const raw = match[1]
      .split(/,| or |\/|;/i)
      .map(s => s.replace(/^e\.g\.\,?\s*/i, '').replace(/^or\s+/i, '').trim())
      .filter(s => s.length > 0 && s.length < 35);
    if (raw.length >= 2) {
      return { promptText: text, options: raw };
    }
  }

  return { promptText: text, options: [] };
}

export function WebSocketMessages() {
  const dispatch = useAppDispatch();
  const { messages, isTyping, socketConnected } = useAppSelector((state) => state.chat);

  const handleOptionSelect = (optionText: string) => {
    // Strip leading emojis for sending clean intent text
    const cleanText = optionText.replace(/^[^\w]+/, '').trim();
    dispatch(sendWebSocketMessage(cleanText));
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto px-2 md:px-4 py-4">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl travel-gradient flex items-center justify-center mb-5 shadow-xl shadow-teal-500/20 animate-pulse">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Welcome to <span className="text-gradient-brand">TravelMate AI</span>
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
            Your personal multi-agent travel intelligence platform. Tell me where you want to go and I will help you step-by-step.
          </p>
        </div>
      )}
      
      <AgentActivity />
      
      {messages.filter(m => m.type !== 'agent_status').map((message, index) => {
        const isLastMessage = index === messages.filter(m => m.type !== 'agent_status').length - 1;
        const textContent = typeof message.text === 'string' ? message.text : JSON.stringify(message.text);
        const { promptText, options } = extractOptions(textContent);

        return (
          <div
            key={index}
            className={`flex items-start gap-3.5 ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
              message.sender === 'user'
                ? 'btn-glow-brand'
                : 'travel-gradient text-white'
            }`}>
              {message.sender === 'user' ? (
                <User className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </div>
            
            <div className={`${
              message.sender === 'user' ? 'max-w-[80%] md:max-w-[70%]' : 'w-full'
            }`}>
              <div className={`rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-teal-600 dark:bg-teal-600 text-white font-medium rounded-tr-xs px-5 py-3.5 shadow-md text-sm leading-relaxed'
                  : message.error
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 rounded-tl-xs p-4 shadow-sm text-sm flex items-center gap-2'
                  : ['hotels', 'flights', 'travel', 'currency'].includes(message.type || '')
                  ? 'bg-transparent'
                  : 'bg-white/90 dark:bg-zinc-900/90 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-zinc-800 rounded-tl-xs p-5 shadow-md backdrop-blur-md text-sm leading-relaxed'
              }`}>
                {message.error && <AlertCircle className="w-5 h-5 flex-shrink-0" />}

                {message.type === 'travel' ? (
                  <div className="space-y-6">
                    {message.text?.text && (
                      <div className="bg-white/90 dark:bg-zinc-900/90 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-md backdrop-blur-md">
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
                          <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Available Flight Options</p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold border border-teal-500/20 tabular-nums">
                            {message.text.flights.length}
                          </span>
                        </div>
                        <div className="space-y-4">
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
                          <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Recommended Hotels</p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold border border-teal-500/20 tabular-nums">
                            {message.text.hotels.length}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {message.text.hotels.slice(0, 4).map((hotel: any, idx: number) => (
                            <HotelCard key={idx} hotel={hotel} />
                          ))}
                        </div>
                        {message.text.hotels.length > 4 && (
                          <p className="text-xs text-slate-400 text-center mt-3 font-medium">
                            +{message.text.hotels.length - 4} more hotels available in response
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Weather */}
                    {message.text?.weather && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">Destination Weather</p>
                        <WeatherCard weather={message.text.weather} />
                      </div>
                    )}

                    {/* Currency */}
                    {message.text?.currency && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">Destination Currency Rate</p>
                        <div className="max-w-md">
                          <CurrencyCard currency={message.text.currency} />
                        </div>
                      </div>
                    )}

                    {/* Locations */}
                    {message.text?.locations?.length > 0 && (
                      <LocationCard locations={message.text.locations} />
                    )}
                  </div>
                ) : message.type === 'currency' && message.text?.currency ? (
                  <div className="max-w-md">
                    <CurrencyCard currency={message.text.currency} />
                  </div>
                ) : message.type === 'hotels' && message.text?.hotels ? (
                  <div className="space-y-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-3">Found {message.text.hotels.length} hotel options:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {message.text.hotels.map((hotel: any, idx: number) => (
                        <HotelCard key={idx} hotel={hotel.details?.[0]?.data || hotel} />
                      ))}
                    </div>
                  </div>
                ) : message.type === 'flights' && message.text?.data ? (
                  <div className="space-y-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-3">Found {message.text.data.length} flight options:</p>
                    {message.text.data.map((flight: any, idx: number) => (
                      <FlightCard key={idx} flight={flight} />
                    ))}
                  </div>
                ) : message.type === 'locations' && message.text?.locations?.length > 0 ? (
                  <LocationCard locations={message.text.locations} />
                ) : message.type === 'weather' && message.text?.weather ? (
                  <WeatherCard weather={message.text.weather} />
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{promptText}</p>

                    {/* Claude-style Interactive Option Selection Pills */}
                    {options.length > 0 && message.sender === 'bot' && (
                      <div className="pt-3 border-t border-slate-200/60 dark:border-zinc-800 space-y-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Select an Option:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {options.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleOptionSelect(opt)}
                              disabled={!socketConnected || isTyping}
                              className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-zinc-700 hover:border-teal-500 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-500 dark:hover:text-white transition-all duration-200 shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5 group"
                            >
                              <span>{opt}</span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      {isTyping && (
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl travel-gradient text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div className="bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 p-4 rounded-2xl rounded-tl-xs shadow-md backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Agents are thinking & querying APIs...</span>
            </div>
            <div className="flex space-x-1.5 mt-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}