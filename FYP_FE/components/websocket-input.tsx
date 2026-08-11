'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { sendWebSocketMessage } from '@/lib/redux/chatSlice';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ArrowUpIcon } from './icons';

export function WebSocketInput() {
  const dispatch = useAppDispatch();
  const { socketConnected, isTyping } = useAppSelector((state) => state.chat);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && socketConnected && !isTyping) {
      dispatch(sendWebSocketMessage(input.trim()));
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-4xl mx-auto">
      <div className="relative">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tell me where you'd like to travel..."
          className="min-h-[60px] pr-14 resize-none border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-2xl shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-sm font-medium"
          disabled={!socketConnected || isTyping}
        />
        <Button
          type="submit"
          size="icon"
          className="brand absolute right-3 bottom-3 h-10 w-10 rounded-full disabled:bg-slate-300 dark:disabled:bg-slate-600 transition-all duration-200 shadow-sm"
          disabled={!input.trim() || !socketConnected || isTyping}
        >
          <ArrowUpIcon size={18} />
        </Button>
      </div>
    </form>
  );
}