'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';

import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon } from './icons';
import { useSidebar } from './ui/sidebar';
import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import type { AppSession } from '@/lib/get-session';

function PureChatHeader({
  chatId,
  session,
}: {
  chatId: string;
  session: AppSession;
}) {
  const router = useRouter();
  const { open } = useSidebar();
  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 py-3 items-center px-4 gap-3 z-10">
      <SidebarToggle />

      <Link href="/" className="flex items-center gap-2 rounded-lg transition-opacity hover:opacity-90">
        <div className="w-8 h-8 travel-gradient rounded-lg flex items-center justify-center overflow-hidden">
          <Image
            src="/logo_mark_icon.png"
            alt="TravelMate"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200">TravelMate AI</h1>
      </Link>

      {(!open || windowWidth < 768) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto px-3 py-2 rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              onClick={() => {
                router.push('/chat/new');
                router.refresh();
              }}
            >
              <PlusIcon />
              <span className="ml-2 hidden sm:inline">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      )}
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader);
