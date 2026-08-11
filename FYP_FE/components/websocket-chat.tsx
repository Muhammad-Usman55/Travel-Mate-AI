'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { initializeWebSocket } from '@/lib/redux/chatSlice';
import { ChatHeader } from '@/components/chat-header';
import { WebSocketMessages } from './websocket-messages';
import { WebSocketInput } from './websocket-input';
import type { AppSession } from '@/lib/get-session';

export function WebSocketChat({
  id,
  session,
}: {
  id: string;
  session: AppSession;
}) {
  const dispatch = useAppDispatch();
  const { socketConnected } = useAppSelector((state) => state.chat);

  useEffect(() => {
    dispatch(initializeWebSocket(id));
  }, [dispatch, id]);

  return (
    <div className="flex flex-col w-full h-screen bg-background">
      <ChatHeader chatId={id} session={session} />

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <WebSocketMessages />
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-center p-3">
          {socketConnected ? (
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Connected
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Disconnected
            </div>
          )}
        </div>
        <WebSocketInput />
      </div>
    </div>
  );
}
