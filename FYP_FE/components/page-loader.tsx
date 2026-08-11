'use client';

import Image from 'next/image';

export function PageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 travel-gradient rounded-xl flex items-center justify-center shadow-sm overflow-hidden">
          <Image
            src="/logo_mark_icon.png"
            alt="TravelMate"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">{text}</p>
      </div>
    </div>
  );
}
